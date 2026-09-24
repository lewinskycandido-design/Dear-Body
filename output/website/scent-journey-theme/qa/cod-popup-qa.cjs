/* Isolated DOM/mocked bridge only. Never contacts Shopify or creates an order. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { JSDOM } = require('../preview/node_modules/jsdom');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'theme/assets/sj-cod-popup.js'), 'utf8');
const results = [];
let networkAttempts = 0, storageAttempts = 0;
const items = () => [{ id: '101', quantity: 2 }, { id: '202', quantity: 1 }];
const clone = value => JSON.parse(JSON.stringify(value));
const flush = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };

function harness(config = {}) {
  const dom = new JSDOM('<button id="es-popup-button-overwrite" hidden></button><div id="easysell-modal"><button class="close-icon"></button><div id="es-form"></div></div><input data-sj-cod-native-quantity value="1"><form><select data-sj-variant><option value="101" selected>Primary</option></select></form>', { url: 'https://example.test/products/synthetic', runScripts: 'outside-only' });
  const w = dom.window, doc = w.document, calls = [], timers = new Map();
  let now = 0, timerID = 0, shown = false;
  w.Date.now = () => now;
  w.setTimeout = (callback, delay) => { const id = ++timerID; timers.set(id, { due: now + delay, callback }); return id; };
  w.clearTimeout = id => timers.delete(id);
  w.fetch = () => { networkAttempts++; throw new Error('Unexpected network request'); };
  w.Storage.prototype.setItem = () => { storageAttempts++; throw new Error('Unexpected storage'); };
  const popup = doc.querySelector('#es-form');
  popup.getBoundingClientRect = () => ({ x: 0, y: 0, top: 0, left: 0, width: shown ? 300 : 0, height: shown ? 600 : 0 });
  doc.querySelector('#es-popup-button-overwrite').addEventListener('click', () => {
    calls.push({ type: 'open', nativeQuantity: doc.querySelector('[data-sj-cod-native-quantity]').value });
    if (config.autoShow !== false) shown = true;
  });
  doc.querySelector('.close-icon').addEventListener('click', () => { calls.push({ type: 'close' }); shown = false; });
  const cod = {
    busy: false,
    async prepare(selection, options) {
      calls.push({ type: 'prepare', items: clone(selection), ready: options.isReady() });
      if (config.prepare) return config.prepare(h, selection, options);
    },
    async verify(selection) {
      calls.push({ type: 'verify', items: clone(selection), shown });
      if (config.verify) return config.verify(h, selection);
    }
  };
  w.SJCommerce = { busy: false };
  if (!config.noBridge) w.SJCOD = cod;
  if (config.missing) doc.querySelector(config.missing).remove();
  if (config.commerceBusy) w.SJCommerce.busy = true;
  if (config.bridgeBusy) cod.busy = true;
  const h = { w, doc, cod, calls, form: doc.querySelector('form'), show: value => { shown = value; }, close: () => w.close(),
    async advance(ms) {
      const end = now + ms;
      while (true) {
        const next = [...timers.entries()].filter(([, t]) => t.due <= end).sort((a, b) => a[1].due - b[1].due)[0];
        if (!next) break;
        now = next[1].due; timers.delete(next[0]); next[1].callback(); await flush();
      }
      now = end; await flush();
    }
  };
  w.eval(source);
  return h;
}

async function test(label, callback) {
  try { await callback(); results.push({ label, pass: true }); }
  catch (error) { results.push({ label, pass: false, error: error.stack }); }
}
const types = h => h.calls.map(call => call.type);

(async () => {
  for (const [label, config] of [
    ['Missing EasySell form', { missing: '#es-form' }],
    ['Missing official EasySell opener', { missing: '#es-popup-button-overwrite' }],
    ['Existing commerce operation', { commerceBusy: true }],
    ['Existing shared bridge operation', { bridgeBusy: true }]
  ]) await test(`${label} rejects before prepare or any mutation`, async () => {
    const h = harness(config);
    try { await assert.rejects(h.cod.checkout(items(), h.form), /loading|wait/); assert.deepEqual(h.calls, []); }
    finally { h.close(); }
  });

  await test('Exact selection is prepared before official opener; verification follows visible popup', async () => {
    const h = harness(); const selected = items();
    try {
      await h.cod.checkout(selected, h.form);
      assert.deepEqual(types(h), ['prepare', 'open', 'verify']);
      assert.deepEqual(h.calls[0].items, selected); assert.equal(h.calls[0].ready, true);
      assert.deepEqual(h.calls[2].items, selected); assert.equal(h.calls[2].shown, true);
      assert.equal(h.doc.querySelector('[data-sj-cod-native-quantity]').value, '2');
      assert.deepEqual(selected, items());
    } finally { h.close(); }
  });

  await test('Same native variant quantities 2 + 1 coalesce to 3 before EasySell opens', async () => {
    const h = harness();
    try {
      const selected = [{ id: '101', quantity: 2 }, { id: 101, quantity: 1 }, { id: '202', quantity: 4 }];
      await h.cod.checkout(selected, h.form);
      assert.equal(h.calls.find(call => call.type === 'open').nativeQuantity, '3');
      assert.equal(h.doc.querySelector('[data-sj-cod-native-quantity]').value, '3');
      assert.deepEqual(h.calls[0].items, selected); assert.deepEqual(h.calls[2].items, selected);
    } finally { h.close(); }
  });

  await test('Concurrent calls remain blocked through preparation and post-open verification', async () => {
    const prepared = deferred(), verified = deferred();
    const h = harness({ prepare: () => prepared.promise, verify: () => verified.promise });
    try {
      const first = h.cod.checkout(items(), h.form);
      await assert.rejects(h.cod.checkout(items(), h.form), /wait/);
      assert.deepEqual(types(h), ['prepare']);
      prepared.resolve(); await flush();
      await assert.rejects(h.cod.checkout(items(), h.form), /wait/);
      assert.deepEqual(types(h), ['prepare', 'open', 'verify']);
      verified.resolve(); await first;
      await h.cod.checkout(items(), h.form);
      assert.deepEqual(types(h), ['prepare', 'open', 'verify', 'prepare', 'open', 'verify']);
    } finally { h.close(); }
  });

  await test('Collection handoff without a primary variant does not rewrite native PDP quantity', async () => {
    const h = harness();
    try { await h.cod.checkout(items()); assert.equal(h.doc.querySelector('[data-sj-cod-native-quantity]').value, '1'); assert.deepEqual(types(h), ['prepare', 'open', 'verify']); }
    finally { h.close(); }
  });

  await test('Verification waits for popup geometry instead of merely waiting for opener click', async () => {
    const h = harness({ autoShow: false });
    try {
      const pending = h.cod.checkout(items(), h.form); await flush(); await h.advance(500);
      assert.deepEqual(types(h), ['prepare', 'open']);
      h.show(true); await h.advance(100); await pending;
      assert.deepEqual(types(h), ['prepare', 'open', 'verify']);
    } finally { h.close(); }
  });

  await test('Post-open cart mismatch closes EasySell and propagates the original failure', async () => {
    const mismatch = Object.assign(new Error('The selected quantities do not match.'), { code: 'CART_MISMATCH' });
    const h = harness({ verify: () => { throw mismatch; } });
    try {
      await assert.rejects(h.cod.checkout(items(), h.form), error => error === mismatch);
      assert.deepEqual(types(h), ['prepare', 'open', 'verify', 'close']);
      assert.equal(h.doc.querySelector('#es-form').getBoundingClientRect().width, 0);
    } finally { h.close(); }
  });

  await test('Prepare failure cannot open or verify and releases handoff for a retry', async () => {
    let fail = true;
    const error = new Error('Native stock rejected the quantity.');
    const h = harness({ prepare: () => { if (fail) throw error; } });
    try {
      await assert.rejects(h.cod.checkout(items(), h.form), caught => caught === error);
      assert.deepEqual(types(h), ['prepare']);
      fail = false; await h.cod.checkout(items(), h.form);
      assert.deepEqual(types(h), ['prepare', 'prepare', 'open', 'verify']);
    } finally { h.close(); }
  });

  await test('Popup not opening times out at 8 seconds without verification or order success', async () => {
    const h = harness({ autoShow: false });
    try {
      const pending = h.cod.checkout(items(), h.form);
      const rejection = assert.rejects(pending, /could not open.*order has not been placed/);
      await flush(); await h.advance(7900); assert.deepEqual(types(h), ['prepare', 'open']);
      await h.advance(100); await rejection;
      assert.deepEqual(types(h), ['prepare', 'open']);
    } finally { h.close(); }
  });

  for (const [label, invalidate] of [
    ['opener removed', h => h.doc.querySelector('#es-popup-button-overwrite').remove()],
    ['form removed', h => h.doc.querySelector('#es-form').remove()],
    ['commerce becomes busy', h => { h.w.SJCommerce.busy = true; }]
  ]) await test(`Readiness recheck after prepare fails closed when ${label}`, async () => {
    const h = harness({ prepare: invalidate });
    try { await assert.rejects(h.cod.checkout(items(), h.form), /unavailable/); assert.deepEqual(types(h), ['prepare']); }
    finally { h.close(); }
  });

  await test('Missing shared namespace leaves script inert', async () => {
    const h = harness({ noBridge: true });
    try { assert.equal(h.w.SJCOD, undefined); assert.deepEqual(h.calls, []); }
    finally { h.close(); }
  });

  await test('All cases remain isolated with zero network and storage attempts', async () => { assert.equal(networkAttempts, 0); assert.equal(storageAttempts, 0); });
  const report = { createdAt: new Date().toISOString(), source: 'theme/assets/sj-cod-popup.js', sourceSHA256: crypto.createHash('sha256').update(source).digest('hex'), scope: 'JSDOM, mocked prepare/verify and deterministic timer; no browser, Shopify requests, deployment or orders', total: results.length, passed: results.filter(row => row.pass).length, failed: results.filter(row => !row.pass).length, networkAttempts, storageAttempts, results };
  fs.writeFileSync(path.join(__dirname, 'COD-POPUP-QA.json'), JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(path.join(__dirname, 'COD-POPUP-QA.md'), `# COD popup handoff QA\n\n${report.passed}/${report.total} checks passed; ${report.failed} failed.\n\nMocked DOM, prepare and verify only. Zero network requests, storage writes, real orders or deployment. This verifies the theme handoff contract; it does not claim vendor-side order creation or actual popup appearance.\n\nSource SHA-256: \`${report.sourceSHA256}\`\n\n${results.map(row => `- ${row.pass ? 'PASS' : 'FAIL'}: ${row.label}${row.pass ? '' : ` — ${row.error}`}`).join('\n')}\n`);
  console.log(JSON.stringify({ total: report.total, passed: report.passed, failed: report.failed, failures: results.filter(row => !row.pass) }, null, 2));
  if (report.failed) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
