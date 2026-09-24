(() => {
  'use strict';
  if (window.SJCOD) return;

  /* Cart preparation only. The app adapter must call:
   * await SJCOD.prepare([{ id: '123', quantity: 2 }], { isReady: () => true });
   * isReady must synchronously verify the supported app opener and the absence
   * of another cart writer. It is checked before reading and before replacing.
   * Call only from explicit Check out, never selection/input events. The adapter
   * owns UI state and app opening, and must gate other cart writers on .busy.
   * This module never reads contact fields, stores data, opens an app or redirects.
   * clear/add are not atomic. Failed/uncertain writes get one read-only recovery;
   * they are never retried or rolled back automatically, even if recovery matches.
   * After the supported opener settles, await SJCOD.verify(items) to reject any
   * app-induced line/quantity change. verify is one GET only and never repairs.
   */
  const TIMEOUT_MS = 12000;
  let busy = false;
  const failure = (code, message, extra = {}) => Object.assign(new Error(message), { code, ...extra });
  const positiveInteger = value => {
    if (!['string', 'number'].includes(typeof value) || !/^[1-9]\d*$/.test(String(value))) return null;
    const number = Number(value);
    return Number.isSafeInteger(number) ? number : null;
  };
  const normalize = items => {
    if (!Array.isArray(items) || !items.length) throw failure('INVALID_SELECTION', 'Choose a fragrance and a valid quantity before checking out.');
    const selected = new Map();
    let count = 0;
    for (const item of items) {
      const id = positiveInteger(item?.id), quantity = positiveInteger(item?.quantity);
      if (id === null || quantity === null) throw failure('INVALID_SELECTION', 'Choose a valid fragrance and whole-number quantity before checking out.');
      const key = String(id), combined = (selected.get(key) || 0) + quantity;
      count += quantity;
      if (!Number.isSafeInteger(combined) || !Number.isSafeInteger(count)) throw failure('INVALID_SELECTION', 'The selected quantity is too large. Please reduce it.');
      selected.set(key, combined);
    }
    return [...selected].map(([id, quantity]) => Object.freeze({ id, quantity }));
  };
  const urlFor = path => {
    const root = window.Shopify?.routes?.root || window.sjRoutes?.root || document.documentElement.dataset.shopRoot || '/';
    const base = new URL(root, window.location.origin);
    if (base.origin !== window.location.origin || base.search || base.hash) throw failure('INVALID_ROUTE', 'Ordering is unavailable. Please refresh the page and try again.');
    base.pathname = `${base.pathname.replace(/\/?$/, '/')}${path}`;
    return base.toString();
  };
  const ready = callback => {
    let result = false;
    try { result = typeof callback === 'function' && callback() === true; } catch { /* Treat app readiness failures as unavailable. */ }
    if (!result) throw failure('APP_NOT_READY', 'The order form is not ready yet. Please try again in a moment.');
  };
  const request = async (path, data) => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const options = { method: data === undefined ? 'GET' : 'POST', headers: { Accept: 'application/json' }, credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal: controller.signal };
      if (data !== undefined) { options.headers['Content-Type'] = 'application/json'; options.body = JSON.stringify(data); }
      const response = await fetch(urlFor(path), options);
      let json;
      try { json = await response.json(); }
      catch (error) {
        if (controller.signal.aborted) throw error;
        throw failure('INVALID_RESPONSE', 'We couldn’t confirm your selection. Please try again.', { status: response.status });
      }
      if (!response.ok || Number(json?.status) >= 400) {
        const message = typeof json?.description === 'string' ? json.description : typeof json?.message === 'string' ? json.message : 'Your selection could not be prepared. Please try again.';
        throw failure('CART_REJECTED', message, { status: response.status });
      }
      if (!json || typeof json !== 'object' || Array.isArray(json)) throw failure('INVALID_RESPONSE', 'We couldn’t confirm your selection. Please try again.');
      return json;
    } catch (error) {
      if (typeof error.code === 'string') throw error;
      throw failure(controller.signal.aborted ? 'REQUEST_TIMEOUT' : 'NETWORK_ERROR', 'We couldn’t confirm your selection. Please check your connection and try again.');
    } finally { window.clearTimeout(timer); }
  };
  const cartLines = cart => {
    if (!cart || !Array.isArray(cart.items) || !Number.isSafeInteger(cart.item_count) || cart.item_count < 0) throw failure('INVALID_CART', 'We couldn’t verify the current selection. Please try again.');
    const lines = new Map();
    let count = 0, plain = true;
    for (const item of cart.items) {
      const id = positiveInteger(item?.variant_id), quantity = positiveInteger(item?.quantity);
      if (id === null || quantity === null) throw failure('INVALID_CART', 'We couldn’t verify the current selection. Please try again.');
      const key = String(id), combined = (lines.get(key) || 0) + quantity;
      count += quantity;
      if (!Number.isSafeInteger(combined) || !Number.isSafeInteger(count)) throw failure('INVALID_CART', 'We couldn’t verify the current selection. Please try again.');
      lines.set(key, combined);
      if (item.selling_plan_allocation || item.selling_plan || item.properties && Object.keys(item.properties).length) plain = false;
    }
    if (count !== cart.item_count) throw failure('INVALID_CART', 'We couldn’t verify the current selection. Please try again.');
    return { lines, plain };
  };
  const matches = (cart, items) => {
    const actual = cartLines(cart);
    return actual.plain && actual.lines.size === items.length && items.every(item => actual.lines.get(item.id) === item.quantity);
  };
  const prepare = async (items, { isReady } = {}) => {
    if (busy) throw failure('ORDER_BUSY', 'Your selection is already being prepared. Please wait.');
    busy = true;
    let mutationAttempted = false, selected;
    try {
      selected = normalize(items);
      ready(isReady);
      const current = await request('cart.js');
      ready(isReady);
      if (matches(current, selected)) return current;
      mutationAttempted = true;
      const empty = await request('cart/clear.js', {});
      if (cartLines(empty).lines.size !== 0) throw failure('CART_NOT_EMPTY', 'Your previous selection could not be replaced. Please try again.');
      await request('cart/add.js', { items: selected });
      const verified = await request('cart.js');
      if (!matches(verified, selected)) throw failure('CART_MISMATCH', 'The available items or quantities changed. Review your selection and try again.');
      return verified;
    } catch (error) {
      if (mutationAttempted) {
        // A failed add may still have changed stock quantities. Never repeat a POST.
        let cartState = 'unknown';
        try { cartState = matches(await request('cart.js'), selected) ? 'matches-selection' : 'differs-from-selection'; } catch { /* Keep an honest unknown outcome. */ }
        error.mutationAttempted = true;
        error.cartState = cartState;
      }
      throw error;
    } finally { busy = false; }
  };
  const verify = async items => {
    if (busy) throw failure('ORDER_BUSY', 'Your selection is already being checked. Please wait.');
    busy = true;
    try {
      const selected = normalize(items);
      const current = await request('cart.js');
      if (!matches(current, selected)) throw failure('CART_MISMATCH', 'The order form changed the selected items or quantities. Please close it and try again.');
      return current;
    } finally { busy = false; }
  };
  // Keep the namespace extensible for the separately verified app adapter.
  window.SJCOD = { prepare, verify };
  Object.defineProperty(window.SJCOD, 'busy', { enumerable: true, get: () => busy });
})();
