/* Synthetic requests only: this test never connects to Shopify or creates orders. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { JSDOM, VirtualConsole } = require('../preview/node_modules/jsdom');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'theme/assets/sj-cod-order.js'), 'utf8');
const results = [];
const check = (label, value) => { assert(value, label); results.push({ label, pass: true }); };
const empty = () => ({ items: [], item_count: 0, note: null, attributes: {} });
const cart = (items, extra = {}) => ({ ...empty(), items: items.map(([id, quantity, more = {}]) => ({ variant_id: id, quantity, properties: {}, ...more })), item_count: items.reduce((sum, item) => sum + item[1], 0), ...extra });
const reply = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => data });
const selection = [{ id: '101', quantity: 2 }, { id: '202', quantity: 1 }];
const expected = () => cart([[101, 2], [202, 1]]);
let allRequests = 0, allStorageWrites = 0, allNavigations = 0;
function harness(steps, config = {}) {
  const errors = [], requests = [], vc = new VirtualConsole();
  vc.on('jsdomError', error => { if (error.message.includes('navigation')) allNavigations++; else errors.push(error); });
  const dom = new JSDOM('<html><body><form><input name="checkout[email]" value="sensitive@example.test"><input name="checkout[shipping_address][address1]" value="PRIVATE STREET"></form></body></html>', { url: 'https://example.test/fr/products/test', runScripts: 'outside-only', virtualConsole: vc });
  const w = dom.window;
  w.Shopify = { routes: { root: config.route || '/fr/' } };
  w.Storage.prototype.setItem = () => { allStorageWrites++; throw new Error('Unexpected storage'); };
  const nativeTimer = w.setTimeout.bind(w);
  w.setTimeout = (callback, delay) => nativeTimer(callback, config.fastTimeout && delay === 12000 ? 5 : delay);
  w.fetch = async (url, options) => {
    const row = { path: new URL(url).pathname, url, ...options, parsedBody: options.body ? JSON.parse(options.body) : undefined };
    requests.push(row); allRequests++;
    const step = steps.shift();
    assert(step, `Unexpected request ${row.method} ${row.path}`);
    return typeof step === 'function' ? step(row, w) : reply(step);
  };
  w.eval(source);
  return { w, api: w.SJCOD, requests, steps, errors, close: () => dom.window.close() };
}
async function rejects(promise, code) {
  let error;
  try { await promise; } catch (caught) { error = caught; }
  assert(error, `Expected ${code} rejection`);
  assert.equal(error.code, code);
  return error;
}
async function test(label, run) { await run(); check(label, true); }
const ready = { isReady: () => true };

(async () => {
  await test('Exact selection replaces stale cart with one clear/add sequence then verifies', async () => {
    const h = harness([cart([[999, 5]]), empty(), { items: [] }, expected()]);
    try {
      const result = await h.api.prepare(selection, ready);
      assert.equal(result.item_count, 3);
      assert.deepEqual(h.requests.map(x => `${x.method} ${x.path}`), ['GET /fr/cart.js', 'POST /fr/cart/clear.js', 'POST /fr/cart/add.js', 'GET /fr/cart.js']);
      assert.deepEqual(h.requests[2].parsedBody, { items: selection });
      assert(h.requests.every(x => x.credentials === 'same-origin' && x.cache === 'no-store' && x.redirect === 'error' && x.headers.Accept === 'application/json' && x.signal));
      assert(h.requests.filter(x => x.method === 'POST').every(x => x.headers['Content-Type'] === 'application/json'));
      assert.equal(h.api.busy, false);
    } finally { h.close(); }
  });
  await test('Matching cart including discount-split lines avoids all mutations', async () => {
    const h = harness([cart([[101, 1], [202, 1], [101, 1]])]);
    try { await h.api.prepare(selection, ready); assert.equal(h.requests.length, 1); } finally { h.close(); }
  });
  await test('Duplicate variant IDs coalesce; extra input fields and contact fields never enter requests', async () => {
    const h = harness([empty(), empty(), {}, cart([[101, 5]])]);
    try {
      await h.api.prepare([{ id: 101, quantity: 2, email: 'sensitive@example.test', properties: { address: 'PRIVATE STREET' } }, { id: '101', quantity: '3' }], ready);
      assert.deepEqual(h.requests[2].parsedBody, { items: [{ id: '101', quantity: 5 }] });
      assert(!JSON.stringify(h.requests).includes('PRIVATE STREET'));
      assert(!JSON.stringify(h.requests).includes('sensitive@example.test'));
    } finally { h.close(); }
  });
  for (const invalid of [[], null, {}, [null], [{ id: 0, quantity: 1 }], [{ id: '../../cart', quantity: 1 }], [{ id: true, quantity: 1 }], [{ id: '101', quantity: 0 }], [{ id: '101', quantity: -1 }], [{ id: '101', quantity: 1.5 }], [{ id: '101', quantity: '1e2' }], [{ id: '101', quantity: Number.MAX_SAFE_INTEGER + 1 }], [{ id: '101', quantity: Number.MAX_SAFE_INTEGER }, { id: '101', quantity: 1 }]]) {
    await test(`Invalid selection ${JSON.stringify(invalid)} cannot read or mutate cart`, async () => {
      const h = harness([]);
      try { await rejects(h.api.prepare(invalid, ready), 'INVALID_SELECTION'); assert.equal(h.requests.length, 0); assert.equal(h.api.busy, false); } finally { h.close(); }
    });
  }
  for (const options of [{}, { isReady: () => false }, { isReady: () => 'true' }, { isReady: () => Promise.resolve(true) }, { isReady: () => { throw new Error('app missing'); } }]) {
    await test('Missing, false, async or throwing opener readiness blocks every request', async () => {
      const h = harness([]);
      try { await rejects(h.api.prepare(selection, options), 'APP_NOT_READY'); assert.equal(h.requests.length, 0); } finally { h.close(); }
    });
  }
  await test('Opener disappearing during initial read never clears the cart', async () => {
    let calls = 0;
    const h = harness([empty()]);
    try { await rejects(h.api.prepare(selection, { isReady: () => ++calls === 1 }), 'APP_NOT_READY'); assert.equal(h.requests.length, 1); } finally { h.close(); }
  });
  await test('Same-item selling plan or custom properties require replacement', async () => {
    for (const special of [{ selling_plan_allocation: { selling_plan: { id: 7 } } }, { properties: { engraving: 'old order' } }]) {
      const h = harness([cart([[101, 2, special], [202, 1]]), empty(), {}, expected()]);
      try { await h.api.prepare(selection, ready); assert.equal(h.requests.filter(x => x.method === 'POST').length, 2); } finally { h.close(); }
    }
  });
  await test('Concurrent prepare rejects immediately and frozen selection ignores later caller edits', async () => {
    let release;
    const original = [{ id: '101', quantity: 2 }];
    const h = harness([() => new Promise(resolve => { release = () => resolve(reply(empty())); }), empty(), {}, cart([[101, 2]])]);
    try {
      const first = h.api.prepare(original, ready);
      assert.equal(h.api.busy, true);
      await rejects(h.api.prepare(selection, ready), 'ORDER_BUSY');
      await rejects(h.api.verify(selection), 'ORDER_BUSY');
      original[0].quantity = 999;
      release(); await first;
      assert.deepEqual(h.requests[2].parsedBody.items, [{ id: '101', quantity: 2 }]);
      assert.equal(h.api.busy, false);
    } finally { h.close(); }
  });
  await test('Clear that returns remaining lines stops before add and performs one read-only recovery', async () => {
    const h = harness([cart([[999, 1]]), cart([[999, 1]]), cart([[999, 1]])]);
    try { const e = await rejects(h.api.prepare(selection, ready), 'CART_NOT_EMPTY'); assert.equal(e.cartState, 'differs-from-selection'); assert.equal(h.requests.filter(x => x.method === 'POST').length, 1); } finally { h.close(); }
  });
  await test('Partial-stock 422 preserves error, reconciles current cart, and never retries a mutation', async () => {
    const h = harness([empty(), empty(), () => reply({ status: 422, description: 'Only one bottle is available.' }, 422), cart([[101, 1]])]);
    try {
      const e = await rejects(h.api.prepare(selection, ready), 'CART_REJECTED');
      assert.equal(e.status, 422); assert.equal(e.message, 'Only one bottle is available.'); assert.equal(e.cartState, 'differs-from-selection');
      assert.equal(h.requests.filter(x => x.method === 'POST').length, 2); assert.equal(h.api.busy, false);
    } finally { h.close(); }
  });
  await test('Unknown add outcome remains an error even when read-only recovery matches', async () => {
    const h = harness([empty(), empty(), () => { throw new TypeError('offline'); }, expected()]);
    try { const e = await rejects(h.api.prepare(selection, ready), 'NETWORK_ERROR'); assert.equal(e.cartState, 'matches-selection'); assert.equal(e.mutationAttempted, true); assert.equal(h.requests.length, 4); } finally { h.close(); }
  });
  await test('Clear network error never sends add or repeats clear', async () => {
    const h = harness([expected(), () => { throw new TypeError('offline'); }, empty()]);
    try { const e = await rejects(h.api.prepare([{ id: '999', quantity: 1 }], ready), 'NETWORK_ERROR'); assert.equal(e.cartState, 'differs-from-selection'); assert.deepEqual(h.requests.map(x => x.method), ['GET', 'POST', 'GET']); } finally { h.close(); }
  });
  await test('Add timeout aborts the request and reconciles read-only without retry', async () => {
    const h = harness([empty(), empty(), (request, w) => new Promise((resolve, reject) => request.signal.addEventListener('abort', () => reject(new w.DOMException('aborted', 'AbortError')))), empty()], { fastTimeout: true });
    try { const e = await rejects(h.api.prepare(selection, ready), 'REQUEST_TIMEOUT'); assert.equal(e.cartState, 'differs-from-selection'); assert.equal(h.requests[2].signal.aborted, true); assert.equal(h.requests.length, 4); assert.equal(h.api.busy, false); } finally { h.close(); }
  });
  await test('Initial read failure does not mutate or perform automatic retry', async () => {
    const h = harness([() => { throw new TypeError('offline'); }]);
    try { const e = await rejects(h.api.prepare(selection, ready), 'NETWORK_ERROR'); assert.equal(e.mutationAttempted, undefined); assert.equal(h.requests.length, 1); } finally { h.close(); }
  });
  await test('Malformed successful mutation response fails closed with read-only reconciliation', async () => {
    const h = harness([empty(), empty(), () => ({ ok: true, status: 200, json: async () => { throw new SyntaxError('HTML'); } }), expected()]);
    try { const e = await rejects(h.api.prepare(selection, ready), 'INVALID_RESPONSE'); assert.equal(e.cartState, 'matches-selection'); assert.equal(h.requests.length, 4); } finally { h.close(); }
  });
  for (const changed of [cart([[101, 1], [202, 1]]), cart([[101, 2], [202, 1], [999, 1]]), cart([[101, 2, { selling_plan_allocation: {} }], [202, 1]]), cart([[101, 2, { properties: { extra: 'unexpected' } }], [202, 1]])]) {
    await test('Final quantity, extra-line, selling-plan or property mismatch blocks completion', async () => {
      const h = harness([empty(), empty(), {}, changed, changed]);
      try { const e = await rejects(h.api.prepare(selection, ready), 'CART_MISMATCH'); assert.equal(e.cartState, 'differs-from-selection'); assert.equal(h.requests.filter(x => x.method === 'POST').length, 2); } finally { h.close(); }
    });
  }
  await test('Malformed cart count cannot authorize replacing the cart', async () => {
    const h = harness([cart([[999, 1]], { item_count: 9 })]);
    try { await rejects(h.api.prepare(selection, ready), 'INVALID_CART'); assert.equal(h.requests.length, 1); } finally { h.close(); }
  });
  await test('Failed final verification plus failed recovery retains unknown state and releases mutex', async () => {
    const h = harness([empty(), empty(), {}, () => { throw new TypeError('offline'); }, () => { throw new TypeError('offline'); }]);
    try { const e = await rejects(h.api.prepare(selection, ready), 'NETWORK_ERROR'); assert.equal(e.cartState, 'unknown'); assert.equal(h.api.busy, false); assert.equal(h.requests.length, 5); } finally { h.close(); }
  });
  await test('Cart notes and attributes are not copied, overwritten or used as contact storage', async () => {
    const h = harness([cart([[999, 1]], { note: 'Existing note', attributes: { unrelated: 'preserve' } }), empty(), {}, expected()]);
    try { await h.api.prepare(selection, ready); assert.deepEqual(h.requests[1].parsedBody, {}); assert.deepEqual(Object.keys(h.requests[2].parsedBody), ['items']); } finally { h.close(); }
  });
  await test('Cross-origin route is rejected before network access', async () => {
    const h = harness([], { route: 'https://unexpected.test/' });
    try { await rejects(h.api.prepare(selection, ready), 'INVALID_ROUTE'); assert.equal(h.requests.length, 0); } finally { h.close(); }
  });
  await test('Route fallback uses sjRoutes root when Shopify is absent', async () => {
    const h = harness([expected()]);
    try { delete h.w.Shopify; h.w.sjRoutes = { root: '/en-ph/' }; await h.api.prepare(selection, ready); assert.equal(h.requests[0].path, '/en-ph/cart.js'); } finally { h.close(); }
  });
  await test('Script initialization is inert and idempotent; adapter namespace remains extensible', async () => {
    const h = harness([]);
    try {
      assert.equal(h.requests.length, 0); const api = h.api; h.w.eval(source); assert.equal(h.w.SJCOD, api);
      api.checkout = () => {}; assert.equal(typeof api.checkout, 'function');
      assert.equal(Object.getOwnPropertyDescriptor(api, 'busy').set, undefined);
      assert.equal(h.w.document.querySelector('[name="checkout[email]"]').value, 'sensitive@example.test');
    } finally { h.close(); }
  });
  await test('Read-only verify accepts coalesced matching quantities with exactly one GET', async () => {
    const h = harness([cart([[101, 1], [101, 2], [202, 1]])]);
    try {
      const result = await h.api.verify([{ id: '101', quantity: 2 }, { id: 101, quantity: 1 }, { id: '202', quantity: 1 }]);
      assert.equal(result.item_count, 4); assert.equal(h.requests.length, 1);
      assert.equal(h.requests[0].method, 'GET'); assert.equal(h.requests[0].path, '/fr/cart.js');
      assert.equal(h.requests[0].body, undefined); assert.equal(h.api.busy, false);
    } finally { h.close(); }
  });
  await test('Post-popup primary quantity reset to one is rejected without any repair or retry', async () => {
    const h = harness([cart([[101, 1], [202, 1]])]);
    try {
      const error = await rejects(h.api.verify(selection), 'CART_MISMATCH');
      assert.equal(error.mutationAttempted, undefined); assert.equal(h.requests.length, 1);
      assert.equal(h.requests[0].method, 'GET'); assert.equal(h.api.busy, false);
    } finally { h.close(); }
  });
  await test('Read-only verify rejects extra variants rather than ignoring them', async () => {
    const h = harness([cart([[101, 2], [202, 1], [999, 1]])]);
    try { await rejects(h.api.verify(selection), 'CART_MISMATCH'); assert.equal(h.requests.length, 1); assert.equal(h.requests[0].method, 'GET'); } finally { h.close(); }
  });
  await test('Verify holds the shared mutex against prepare and another verification', async () => {
    let release;
    const h = harness([() => new Promise(resolve => { release = () => resolve(reply(expected())); })]);
    try {
      const first = h.api.verify(selection); assert.equal(h.api.busy, true);
      await rejects(h.api.prepare(selection, ready), 'ORDER_BUSY');
      await rejects(h.api.verify(selection), 'ORDER_BUSY');
      release(); await first; assert.equal(h.requests.length, 1); assert.equal(h.api.busy, false);
    } finally { h.close(); }
  });
  await test('Invalid verification selection is rejected before any request', async () => {
    const h = harness([]);
    try { await rejects(h.api.verify([{ id: '101', quantity: 0 }]), 'INVALID_SELECTION'); assert.equal(h.requests.length, 0); assert.equal(h.api.busy, false); } finally { h.close(); }
  });
  await test('Verify network failure is not retried and releases the busy guard', async () => {
    const h = harness([() => { throw new TypeError('offline'); }]);
    try { await rejects(h.api.verify(selection), 'NETWORK_ERROR'); assert.equal(h.requests.length, 1); assert.equal(h.api.busy, false); } finally { h.close(); }
  });
  await test('Verify timeout aborts its sole GET without fallback or mutation', async () => {
    const h = harness([(request, w) => new Promise((resolve, reject) => request.signal.addEventListener('abort', () => reject(new w.DOMException('aborted', 'AbortError'))))], { fastTimeout: true });
    try { await rejects(h.api.verify(selection), 'REQUEST_TIMEOUT'); assert.equal(h.requests.length, 1); assert.equal(h.requests[0].method, 'GET'); assert.equal(h.requests[0].signal.aborted, true); assert.equal(h.api.busy, false); } finally { h.close(); }
  });
  check('No storage writes or navigation attempts across every test', allStorageWrites === 0 && allNavigations === 0);
  const layout = fs.readFileSync(path.join(root, 'theme/layout/theme.liquid'), 'utf8');
  check('Deferred cart preparation script is included once after commerce', layout.split("'sj-cod-order.js'").length === 2 && layout.indexOf("'sj-cod-order.js'") > layout.indexOf("'sj-commerce.js'") && /sj-cod-order\.js' \| asset_url }}" defer/.test(layout));
  const report = { generatedAt: new Date().toISOString(), status: 'PASS', checks: results.length, results, syntheticRequests: allRequests, realRequests: 0, ordersCreated: 0, storageWrites: allStorageWrites, navigationAttempts: allNavigations, scope: 'Mocked JSDOM requests only. Verifies cart preparation and read-only post-opener cart verification; no EasySell opening, app submission, native checkout or live cart was tested.', contract: 'SJCOD.prepare(items, {isReady}) returns a verified cart; synchronous isReady must confirm a supported opener and no other cart writer. SJCOD.verify(items) returns an exactly matching current cart or rejects, using only one GET. Both share SJCOD.busy. Other cart writers must respect the guard. Caller validates native quantity rules and owns UI/app handling.', source: 'https://shopify.dev/docs/api/ajax/reference/cart' };
  fs.writeFileSync(path.join(__dirname, 'COD-CART-PREPARE-QA.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, checks: report.checks, syntheticRequests: allRequests, realRequests: 0, storageWrites: allStorageWrites, navigationAttempts: allNavigations }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
