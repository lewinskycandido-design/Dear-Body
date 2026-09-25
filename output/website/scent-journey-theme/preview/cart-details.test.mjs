import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { updatePreviewCart } from './preview-cart.mjs';

// Render the real Liquid against an in-memory preview item; no live Shopify writes.
const origin = 'http://127.0.0.1:4208';
const source = await (await fetch(`${origin}/collections/all`)).text();
const collection = new JSDOM(source);
const id = collection.window.document.querySelector('main [name=id]').value;
await fetch(`${origin}/cart/add.js`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, quantity: 1 }) });
const dom = new JSDOM(await (await fetch(`${origin}/cart`)).text(), { url: `${origin}/cart`, runScripts: 'outside-only' });
const w = dom.window, d = w.document;
const sectionHTML = [...d.querySelectorAll('[data-section-id]')].map(node => [node.dataset.sectionId, node.outerHTML]);
let cart = { note: '', item_count: 1, items: [], discount_codes: [], cart_level_discount_applications: [] };
const writes = [];
let failNote = false;
w.CSS = { escape: value => value };
w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
w.fetch = async (url, options) => {
  const path = new URL(url, w.location.href);
  if (path.pathname === '/cart/update.js') {
    const body = JSON.parse(options.body); writes.push(body);
    if ('note' in body) {
      if (failNote) return { ok: false, json: async () => ({ description: 'Note could not be saved.' }) };
      cart.note = body.note;
    }
    if ('discount' in body) cart.discount_codes = body.discount.split(',').filter(Boolean).map(code => ({ code, applicable: code !== 'INVALID' }));
  }
  if (path.pathname === '/cart/change.js') { writes.push(JSON.parse(options.body)); }
  return { ok: true, json: async () => path.searchParams.has('sections') ? Object.fromEntries(sectionHTML) : structuredClone(cart) };
};
w.eval(await fs.readFile(new URL('../theme/assets/sj-commerce.js', import.meta.url), 'utf8'));
const wait = async predicate => {
  for (let i = 0; i < 100; i++) { if (predicate()) return; await new Promise(resolve => setTimeout(resolve, 10)); }
  throw new Error('Cart did not settle.');
};
const apply = async code => {
  const input = d.querySelector('main [data-sj-discount-input]'); input.value = code;
  d.querySelector('main [data-sj-discount-apply]').click();
  await wait(() => !w.SJCommerce.busy);
};
let note = d.querySelector('main [data-sj-cart-note]');
note.value = 'Please pack the bottles separately.';
note.dispatchEvent(new w.Event('input', { bubbles: true }));
await apply('SAVE10');
assert.equal(writes[0].note, note.value, 'Note saved before discount mutation');
assert.match(d.querySelector('main [data-sj-discount-status]').textContent, /Discount applied/);
assert.equal(d.querySelector('main [data-sj-cart-note]').value, note.value, 'Note survives section replacement');
await apply('SECOND');
assert.equal(writes.at(-1).discount, 'SAVE10,SECOND', 'Adding code preserves existing code');
await apply('INVALID');
assert.match(d.querySelector('main [data-sj-discount-status]').textContent, /not valid/);
assert.equal(d.querySelectorAll('main [data-sj-discount-remove]').length, 2, 'Invalid code is not displayed as applied');
d.querySelector('main [data-sj-discount-remove="SAVE10"]').click();
await wait(() => !w.SJCommerce.busy);
assert.equal(writes.at(-1).discount, 'SECOND', 'Removing one code preserves the other');
assert.match(d.querySelector('main [data-sj-discount-status]').textContent, /removed/);

failNote = true;
note = d.querySelector('main [data-sj-cart-note]'); note.value = 'Retain this failed draft'; note.dispatchEvent(new w.Event('input', { bubbles: true }));
await apply('NEWCODE');
assert.match(d.querySelector('main [data-sj-discount-status]').textContent, /Note could not be saved/);
assert.equal(d.querySelector('main [data-sj-cart-note]').value, 'Retain this failed draft');
assert.equal(w.SJCommerce.busy, false);
w.close(); collection.window.close();

const demo = { items: [{ key: 'one', quantity: 2, final_price: 79900 }], note: 'keep me' };
updatePreviewCart(demo, [], '/cart/update.js', { discount: 'INVALID' });
assert.equal(demo.item_count, 2, 'Applying a discount does not clear the cart');
updatePreviewCart(demo, [], '/cart/change.js', { id: 'one', quantity: 1 });
assert.equal(demo.total_price, 79900);
assert.equal(demo.note, 'keep me');
updatePreviewCart(demo, [], '/cart/change.js', { id: 'one', quantity: 0 });
assert.equal(demo.items.length, 0);
console.log('Cart details passed: note persistence/errors, valid/invalid/multiple discounts, removal, and preview totals.');
