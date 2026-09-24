(() => {
  'use strict';
  if (window.SJCommerce) return;
  const root = () => window.Shopify?.routes?.root || window.sjRoutes?.root || document.documentElement.dataset.shopRoot || '/';
  const route = path => `${root().replace(/\/?$/, '/')}${path}`;
  let cartBusy = false;
  const dialogTriggers = new WeakMap();
  const checkoutStates = new WeakMap();
  const checkoutItems = form => {
    const option = form.querySelector('[data-sj-variant]')?.selectedOptions[0];
    if (!option || !/^\d+$/.test(option.value) || option.dataset.available !== 'true') throw new Error('This fragrance is currently unavailable. Please choose an available option.');
    const second = form.querySelector('[data-sj-checkout-second]')?.selectedOptions[0];
    const integer = (value, fallback) => /^\d+$/.test(value || '') && Number.isSafeInteger(Number(value)) && Number(value) > 0 ? Number(value) : fallback;
    const validateQuantity = (value, variant) => {
      const min = integer(variant.dataset.quantityMin, 1), step = integer(variant.dataset.quantityStep, 1), max = integer(variant.dataset.quantityMax, null);
      if (!/^\d+$/.test(String(value)) || !Number.isSafeInteger(Number(value)) || Number(value) < min || max !== null && Number(value) > max || (Number(value) - min) % step !== 0) throw new Error(`Choose a valid whole-number quantity for this scent (minimum ${min}, increments of ${step}${max !== null ? `, maximum ${max}` : ''}).`);
      return Number(value);
    };
    const quantityInput = form.querySelector('[data-sj-checkout-quantity]');
    const items = new Map([[option.value, { quantity: validateQuantity(quantityInput ? quantityInput.value : '1', option), variant: option }]]);
    if (second?.value) {
      if (!/^\d+$/.test(second.value) || second.dataset.available !== 'true' || second.disabled) throw new Error('The second scent is currently unavailable. Please choose another scent or leave it out.');
      const secondInput = form.querySelector('[data-sj-checkout-second-quantity]');
      const quantity = validateQuantity(secondInput ? secondInput.value : '1', second);
      const existing = items.get(second.value);
      items.set(second.value, { quantity: (existing?.quantity || 0) + quantity, variant: existing?.variant || second });
    }
    // Shopify quantity rules apply to the coalesced variant line, including two selections of the same scent.
    for (const entry of items.values()) validateQuantity(String(entry.quantity), entry.variant);
    return [...items].map(([id, entry]) => ({ id, quantity: entry.quantity }));
  };
  const resetCheckout = form => {
    const state = checkoutStates.get(form);
    if (!state) return;
    state.controls.forEach(({ node, disabled }) => { if (node.isConnected) node.disabled = disabled; });
    if (state.button?.isConnected) { state.button.innerHTML = state.html; state.button.disabled = state.disabled; }
    form.removeAttribute('aria-busy'); delete form.dataset.sjCheckoutSubmitting;
    checkoutStates.delete(form);
    form.dispatchEvent(new CustomEvent('sj:product-form-settled', { bubbles: true }));
  };
  const startCheckout = async (form, submitter) => {
    if (form.dataset.sjCheckoutSubmitting) return;
    const panel = form.querySelector('[data-sj-product-order-panel]');
    if (panel?.hidden) { form.closest('sj-product')?.revealOrder(); return; }
    if (!form.reportValidity()) return;
    const errorNode = form.querySelector('[data-sj-product-error]');
    if (errorNode) errorNode.textContent = '';
    let failure = '';
    try {
      const items = checkoutItems(form);
      if (typeof window.SJCOD?.checkout !== 'function') throw new Error('The order form is unavailable. Please refresh the page and try again.');
      if (cartBusy || window.SJCOD.busy) throw new Error('Your selection is still updating. Please try again in a moment.');
      const button = submitter || form.querySelector('[data-sj-add]');
      const controls = [...form.elements].filter(node => typeof node.disabled === 'boolean').map(node => ({ node, disabled: node.disabled }));
      checkoutStates.set(form, { button, html: button?.innerHTML, disabled: button?.disabled, controls });
      form.dataset.sjCheckoutSubmitting = 'true'; form.setAttribute('aria-busy', 'true');
      controls.forEach(({ node }) => { node.disabled = true; });
      if (button) { (button.querySelector('[data-sj-add-label]') || button).textContent = 'Opening order form…'; }
      // Opening the supported COD form is not order success. EasySell owns address collection and confirmation.
      await window.SJCOD.checkout(items, form);
    } catch (error) {
      failure = error.message || 'The order form is unavailable. Please try again.';
    } finally {
      resetCheckout(form);
      if (failure && errorNode) {
        errorNode.textContent = failure;
        errorNode.setAttribute('tabindex', '-1');
        errorNode.focus({ preventScroll: true });
      }
    }
  };
  const showDialog = (dialog, trigger) => {
    if (!dialog?.showModal) return false;
    dialogTriggers.set(dialog, trigger || document.activeElement);
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add('sj-dialog-open');
    (dialog.querySelector('input[type=search]') || dialog.querySelector('[data-sj-close-dialog]'))?.focus();
    return true;
  };
  const initialize = () => {
    document.querySelectorAll('[data-sj-step]').forEach(button => { button.hidden = false; });
    document.querySelectorAll('[data-sj-native-update]').forEach(button => { button.hidden = true; });
    document.querySelectorAll('#sj-cart-drawer, #sj-search-dialog').forEach(dialog => {
      if (dialog.dataset.sjInitialized) return;
      dialog.dataset.sjInitialized = 'true';
      dialog.addEventListener('close', () => {
        if (!document.querySelector('dialog[open]')) document.documentElement.classList.remove('sj-dialog-open');
        const trigger = dialogTriggers.get(dialog);
        if (trigger?.isConnected) trigger.focus();
      });
      dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
      });
    });
    initializeSearch();
  };
  const announce = message => {
    document.querySelectorAll('[data-sj-cart-status]').forEach(status => { status.textContent = message; });
  };
  const cartError = message => {
    document.querySelectorAll('[data-sj-cart-error]').forEach(node => { node.textContent = message; });
    announce(message);
  };
  const readJSON = async response => {
    let data;
    try { data = await response.json(); } catch { throw new Error('We couldn’t confirm the update. Check your bag before trying again.'); }
    if (!response.ok) throw new Error(typeof data.description === 'string' ? data.description : typeof data.message === 'string' ? data.message : 'Your bag could not be updated. Please try again.');
    return data;
  };
  const saveCartFocus = () => {
    const active = document.activeElement;
    const item = active?.closest('[data-sj-line-key]');
    if (!item) {
      if (active?.closest('#sj-cart-drawer')) return { drawer: true, kind: active.matches('[name=checkout]') ? 'checkout' : 'close' };
      return null;
    }
    return { key: item.dataset.sjLineKey, drawer: !!active.closest('#sj-cart-drawer'), kind: active.matches('[data-sj-remove]') ? 'remove' : active.dataset.sjStep || 'quantity' };
  };
  const restoreCartFocus = focus => {
    if (!focus) return;
    const scope = focus.drawer ? document.querySelector('#sj-cart-drawer') : document.querySelector('[data-sj-cart-section]');
    if (!scope || (focus.drawer && !scope.open)) return;
    if (!focus.key) { scope.querySelector(focus.kind === 'checkout' ? '[name=checkout]' : '[data-sj-close-dialog]')?.focus(); return; }
    const item = scope.querySelector(`[data-sj-line-key="${CSS.escape(focus.key)}"]`);
    const selector = focus.kind === 'remove' ? '[data-sj-remove]' : focus.kind === 'quantity' ? '[data-sj-cart-quantity]' : `[data-sj-step="${focus.kind}"]`;
    (item?.querySelector(selector) || scope.querySelector('[data-sj-cart-quantity], [data-sj-close-dialog], a'))?.focus();
  };
  const refreshCart = async () => {
    const drawer = document.querySelector('#sj-cart-drawer');
    const page = document.querySelector('[data-sj-cart-section]');
    const ids = [drawer?.dataset.sectionId, page?.dataset.sectionId].filter(Boolean);
    const url = new URL(window.location.href);
    // Preserve draft theme, template view, and localized page context for section rendering.
    url.hash = '';
    url.searchParams.set('sections', ids.join(','));
    const focus = saveCartFocus();
    const [cartResult, sectionResult] = await Promise.allSettled([
      fetch(route('cart.js'), { headers: { Accept: 'application/json' }, cache: 'no-store' }).then(readJSON),
      // Shopify resource pages return resource JSON instead of sections when Accept is application/json.
      ids.length ? fetch(url.toString(), { cache: 'no-store' }).then(readJSON) : Promise.resolve({})
    ]);
    let updated = false;
    if (sectionResult.status === 'fulfilled') {
      const html = sectionResult.value;
      if (drawer && typeof html[drawer.dataset.sectionId] === 'string') {
        const parsed = new DOMParser().parseFromString(html[drawer.dataset.sectionId], 'text/html');
        const content = parsed.querySelector('[data-sj-drawer-content]');
        if (content) { drawer.querySelector('[data-sj-drawer-content]').replaceWith(content); updated = true; }
      }
      if (page && typeof html[page.dataset.sectionId] === 'string') {
        const parsed = new DOMParser().parseFromString(html[page.dataset.sectionId], 'text/html');
        const content = parsed.querySelector('[data-sj-cart-section]');
        if (content) { page.replaceWith(content); updated = true; }
      }
    }
    if (cartResult.status === 'fulfilled') {
      const cart = cartResult.value;
      document.querySelectorAll('[data-sj-cart-count]').forEach(node => { node.textContent = cart.item_count; });
      document.dispatchEvent(new CustomEvent('sj:cart-updated', { detail: { cart } }));
    }
    initialize();
    restoreCartFocus(focus);
    if (!updated && ids.length) throw new Error('Your bag has changed, but we couldn’t refresh this view. Open the bag page to see the latest details.');
    if (cartResult.status === 'rejected') throw cartResult.reason;
    return cartResult.value;
  };
  const setCartBusy = busy => {
    cartBusy = busy;
    document.querySelectorAll('[data-sj-cart-form]').forEach(form => {
      form.setAttribute('aria-busy', String(busy));
      form.querySelectorAll('button, input').forEach(node => {
        if (busy) { node.dataset.sjPreviousDisabled = String(node.disabled); node.disabled = true; }
        else { node.disabled = node.dataset.sjPreviousDisabled === 'true'; delete node.dataset.sjPreviousDisabled; }
      });
    });
    document.querySelectorAll('[data-sj-remove]').forEach(node => {
      if (busy) node.setAttribute('aria-disabled', 'true'); else node.removeAttribute('aria-disabled');
    });
  };
  const mutateCart = async (key, quantity) => {
    if (cartBusy || window.SJCOD?.busy || !Number.isSafeInteger(quantity) || quantity < 0) return;
    const focus = saveCartFocus();
    setCartBusy(true);
    cartError('');
    let mutationSucceeded = false;
    try {
      await fetch(route('cart/change.js'), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ id: key, quantity }) }).then(readJSON);
      mutationSucceeded = true;
      await refreshCart();
      announce(quantity === 0 ? 'Fragrance removed from your bag.' : 'Bag quantity updated.');
    } catch (error) {
      // Read-only recovery: never retry a mutation whose network outcome is uncertain.
      if (!mutationSucceeded) { try { await refreshCart(); } catch {} }
      cartError(error.name === 'TypeError' ? 'We couldn’t confirm the update. Check your bag before trying again.' : error.message || 'We couldn’t confirm the update. Check your bag before trying again.');
    } finally { setCartBusy(false); restoreCartFocus(focus); }
  };
  const addProduct = async (form, submitter) => {
    if (form.dataset.sjSubmitting || cartBusy || window.SJCOD?.busy || !form.reportValidity()) return;
    const errorNode = form.querySelector('[data-sj-product-error]');
    if (errorNode) errorNode.textContent = '';
    const button = submitter || form.querySelector('[name=add]');
    const buttonState = button ? { html: button.innerHTML, disabled: button.disabled } : null;
    const formData = new FormData(form);
    form.dataset.sjSubmitting = 'true';
    form.setAttribute('aria-busy', 'true');
    setCartBusy(true);
    if (button) { button.disabled = true; button.textContent = 'Adding…'; }
    let added = false;
    try {
      await fetch(route('cart/add.js'), { method: 'POST', headers: { Accept: 'application/json' }, body: formData }).then(readJSON);
      added = true;
      await refreshCart();
      announce('Fragrance added to your bag.');
      const drawer = document.querySelector('#sj-cart-drawer');
      if (!showDialog(drawer, button)) window.location.assign(route('cart'));
    } catch (error) {
      if (!added) { try { await refreshCart(); } catch {} }
      const message = added ? 'Added to your bag. Open the bag page to review it and checkout.' : error.name === 'TypeError' ? 'We couldn’t confirm the update. Check your bag before trying again.' : error.message || 'We couldn’t confirm the update. Check your bag before trying again.';
      if (errorNode) errorNode.textContent = message;
      announce(message);
      if (added) window.location.assign(route('cart'));
    } finally {
      delete form.dataset.sjSubmitting;
      form.removeAttribute('aria-busy');
      setCartBusy(false);
      if (button && buttonState) { button.disabled = buttonState.disabled; button.innerHTML = buttonState.html; }
      form.dispatchEvent(new CustomEvent('sj:product-form-settled', { bubbles: true, detail: { added } }));
    }
  };
  document.addEventListener('click', async event => {
    const target = event.target.closest('button, a');
    if (!target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (target.matches('[data-sj-open-cart]')) {
      if (!document.querySelector('#sj-cart-drawer')?.showModal) return;
      event.preventDefault();
      showDialog(document.querySelector('#sj-cart-drawer'), target);
      if (!cartBusy) { try { await refreshCart(); } catch (error) { cartError(error.message); } }
    } else if (target.matches('[data-sj-open-search]')) {
      if (!document.querySelector('#sj-search-dialog')?.showModal) return;
      event.preventDefault();
      showDialog(document.querySelector('#sj-search-dialog'), target);
    } else if (target.matches('[data-sj-close-dialog]')) {
      event.preventDefault();
      target.closest('dialog')?.close();
    } else if (target.matches('[data-sj-step]') && target.closest('[data-sj-cart-form]')) {
      event.preventDefault();
      if (cartBusy) return;
      const input = target.closest('.sj-quantity').querySelector('input');
      const quantity = Math.max(0, (Number(input.value) || 0) + Number(target.dataset.sjStep));
      await mutateCart(input.dataset.lineKey, quantity);
    } else if (target.matches('[data-sj-remove]')) {
      event.preventDefault();
      if (!cartBusy) await mutateCart(target.dataset.sjRemove, 0);
    }
  });
  document.addEventListener('change', event => {
    const input = event.target.closest('[data-sj-cart-quantity]');
    if (input && input.reportValidity()) mutateCart(input.dataset.lineKey, Number(input.value));
  });
  window.addEventListener('pageshow', () => document.querySelectorAll('[data-sj-checkout-form]').forEach(resetCheckout));
  document.addEventListener('submit', event => {
    const form = event.target;
    if (form.matches('[data-sj-checkout-form]')) {
      event.preventDefault();
      startCheckout(form, event.submitter);
    } else if (form.matches('[data-sj-product-form]')) {
      if (event.submitter && event.submitter.name !== 'add' && !event.submitter.matches('[data-sj-add]')) return;
      event.preventDefault();
      addProduct(form, event.submitter);
    } else if (form.matches('[data-sj-cart-form]') && (cartBusy || window.SJCOD?.busy || event.submitter?.name !== 'checkout')) {
      if (cartBusy || window.SJCOD?.busy) { event.preventDefault(); return; }
      // A keyboard submission is a native update, never an accidental checkout.
      if (!event.submitter) {
        event.preventDefault();
        let update = form.querySelector('[name=update]');
        if (update) form.requestSubmit(update);
      }
    }
  });
  function initializeSearch() {
    const dialog = document.querySelector('#sj-search-dialog');
    const input = dialog?.querySelector('[data-sj-predictive-input]');
    if (!input || input.dataset.sjSearchInitialized) return;
    input.dataset.sjSearchInitialized = 'true';
    const container = dialog.querySelector('[data-sj-predictive-container]');
    const status = dialog.querySelector('[data-sj-search-status]');
    const inspiration = dialog.querySelector('[data-sj-search-inspiration]');
    let timer, controller, generation = 0, active = -1;
    const options = () => [...container.querySelectorAll('[data-sj-search-option]')];
    const resetActive = () => { active = -1; input.removeAttribute('aria-activedescendant'); options().forEach(option => option.parentElement.setAttribute('aria-selected', 'false')); };
    const clear = () => { const list = document.createElement('ul'); list.id = 'PredictiveSearchList'; list.setAttribute('role', 'listbox'); list.setAttribute('aria-label', 'Fragrance suggestions'); container.replaceChildren(list); input.setAttribute('aria-expanded', 'false'); inspiration.hidden = false; status.textContent = ''; resetActive(); };
    input.addEventListener('input', () => {
      window.clearTimeout(timer);
      controller?.abort();
      const requestGeneration = ++generation;
      const query = input.value.trim();
      clear();
      if (query.length < 2) return;
      status.textContent = 'Searching fragrances…';
      timer = window.setTimeout(async () => {
        controller = new AbortController();
        const url = new URL(dialog.dataset.sjPredictiveUrl || route('search/suggest'), window.location.origin);
        url.searchParams.set('q', query);
        url.searchParams.set('resources[type]', 'product');
        url.searchParams.set('resources[limit]', '6');
        url.searchParams.set('section_id', 'sj-predictive-search');
        try {
          const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'text/html' } });
          if (!response.ok) throw new Error('Search unavailable');
          const html = await response.text();
          if (requestGeneration !== generation || input.value.trim() !== query) return;
          const parsed = new DOMParser().parseFromString(html, 'text/html');
          const results = parsed.querySelector('[data-sj-predictive-results]');
          if (!results) throw new Error('Search unavailable');
          container.replaceChildren(results);
          inspiration.hidden = true;
          input.setAttribute('aria-expanded', String(options().length > 0));
          status.textContent = results.querySelector('[data-sj-result-count]')?.textContent || 'Suggestions updated.';
          resetActive();
        } catch (error) {
          if (error.name === 'AbortError' || requestGeneration !== generation) return;
          clear();
          status.textContent = 'Suggestions are unavailable. Press Enter to see search results.';
        }
      }, 220);
    });
    input.addEventListener('keydown', event => {
      const entries = options();
      if (event.key === 'Escape') {
        // Search inputs may consume Escape before the native dialog cancel action.
        event.preventDefault(); event.stopPropagation(); generation++;
        window.clearTimeout(timer); controller?.abort();
        if (entries.length) clear(); else dialog.close();
        return;
      }
      if (!entries.length) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        active = event.key === 'ArrowDown' ? (active + 1) % entries.length : active <= 0 ? entries.length - 1 : active - 1;
        entries.forEach((entry, index) => entry.parentElement.setAttribute('aria-selected', String(index === active)));
        input.setAttribute('aria-activedescendant', entries[active].parentElement.id);
        entries[active].scrollIntoView({ block: 'nearest' });
      } else if (event.key === 'Enter' && active >= 0) { event.preventDefault(); window.location.assign(entries[active].href); }
    });
    dialog.addEventListener('close', () => { window.clearTimeout(timer); controller?.abort(); generation++; });
  }
  window.SJCommerce = { refreshCart, checkoutItems, get busy() { return cartBusy; }, openCart: trigger => showDialog(document.querySelector('#sj-cart-drawer'), trigger) };
  document.addEventListener('shopify:section:load', initialize);
  initialize();
})();
