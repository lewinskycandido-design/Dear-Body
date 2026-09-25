import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const page = async route => new JSDOM(await fs.readFile(new URL(`./public/${route}/index.html`, import.meta.url), 'utf8'), { url: `http://localhost/${route}`, runScripts: 'outside-only' });
const home = await page('');
const actions = home.window.document.querySelectorAll('.sj-home-hero__actions a');
assert.equal(actions.length, 1);
assert.equal(actions[0].textContent, 'Shop now');
assert.equal(actions[0].getAttribute('href'), '/collections/all');
assert.equal(home.window.document.querySelector('#HomeOrder'), null);
home.window.close();

const commerce = await fs.readFile(new URL('../theme/assets/sj-commerce.js', import.meta.url), 'utf8');
for (const [route, selector, expected] of [
  ['collections/all', 'main [data-sj-product-form]', 6],
  ['collections/womens-perfume', 'main [data-sj-product-form]', 3],
  ['collections/mens-perfume', 'main [data-sj-product-form]', 3],
  ['products/oud-mirage', 'sj-product [data-sj-product-form]', 1],
  ['cart', 'main .sj-cart-perfumes [data-sj-product-form]', 6],
]) {
  const dom = await page(route), w = dom.window, d = w.document;
  assert.equal(d.querySelectorAll(selector).length, expected, route);
  assert.equal(d.querySelector('[data-sj-checkout-form], [data-sj-order-form]'), null);
  const form = d.querySelector(selector);
  const id = new w.FormData(form).get('id');
  assert.match(id, /^\d+$/, `${route} submits variant ID`);
  let additions = 0, reject = false;
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.CSS = { escape: value => value };
  w.fetch = async (url, options) => {
    const path = new URL(url, w.location.href);
    let data;
    if (path.pathname === '/cart/add.js') {
      assert.equal(options.body.get('id'), id);
      assert.equal(options.body.get('quantity'), '1');
      additions++;
      return { ok: !reject, json: async () => reject ? { description: 'This scent is sold out.' } : { id } };
    }
    if (path.pathname === '/cart.js') data = { item_count: reject ? 0 : 1 };
    else {
      data = {};
      for (const section of d.querySelectorAll('[data-section-id]')) data[section.dataset.sectionId] = section.outerHTML.replace(/ data-sj-submitting="true"/g, "").replace(/ disabled=""/g, "");
    }
    return { ok: true, json: async () => data };
  };
  w.eval(commerce);
  const settle = f => new Promise(resolve => f.addEventListener('sj:product-form-settled', resolve, { once: true }));
  let settled = settle(form);
  form.dispatchEvent(new w.SubmitEvent('submit', { bubbles: true, cancelable: true, submitter: form.querySelector('[name=add]') }));
  await settled;
  assert.equal(additions, 1);
  assert.equal(d.querySelector('#sj-cart-drawer').open, true);
  assert.equal(d.querySelector('[data-sj-cart-count]').textContent, '1');
  reject = true;
  const retry = d.querySelector(selector);
  settled = settle(retry);
  retry.dispatchEvent(new w.SubmitEvent('submit', { bubbles: true, cancelable: true, submitter: retry.querySelector('[name=add]') }));
  await settled;
  assert.match(d.body.textContent, /This scent is sold out\./);
  assert.equal(w.SJCommerce.busy, false);
  w.close();
}
console.log('Cart flow passed: homepage CTA, collection/PDP/cart variant submissions, drawer refresh, and failed-add feedback.');
