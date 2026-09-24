import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { Liquid } from 'liquidjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const theme = path.resolve(root, '../dearbody');
const html = await fs.readFile(path.join(root, 'public/index.html'), 'utf8');
const script = await fs.readFile(path.join(theme, 'assets/dearbody-quiz.js'), 'utf8');
const sectionSource = await fs.readFile(path.join(theme, 'sections/db-scent-quiz.liquid'), 'utf8');
const handles = ['mojito-metallique', 'amber-oud-silk', 'mistened-narcissus', 'oud-mirage', 'charme-envoutant', 'rtulle-and-satin'];
const results = [];

async function verify(name, run) {
  await run();
  results.push(name);
  console.log(`PASS ${name}`);
}

function createQuiz(mutateCatalog) {
  // Only the actual quiz script executes; no resource loading or preview-form
  // interceptor, network requests, product writes or synthetic storefront data.
  const dom = new JSDOM(html, { url: 'https://preview.invalid/', runScripts: 'outside-only' });
  const { window } = dom;
  const { document } = window;
  const dialog = document.querySelector('[data-scent-quiz]');
  const trigger = document.querySelector('[data-scent-quiz-open]');
  assert.ok(dialog && trigger, 'Build the actual homepage with its quiz section before running this verifier.');
  const catalogNode = dialog.querySelector('[data-quiz-catalog]');
  const catalog = JSON.parse(catalogNode.textContent);
  if (mutateCatalog) {
    mutateCatalog(catalog);
    catalogNode.textContent = JSON.stringify(catalog);
  }
  let showCount = 0;
  let closeCount = 0;
  // JSDOM lacks native modal behavior. These shims model only open state and the
  // close event. They DO NOT emulate focus trapping, Escape, inertness or layout.
  Object.defineProperty(window.HTMLDialogElement.prototype, 'showModal', { configurable: true, value() {
    showCount += 1;
    this.setAttribute('open', '');
  } });
  Object.defineProperty(window.HTMLDialogElement.prototype, 'close', { configurable: true, value() {
    if (!this.open) return;
    closeCount += 1;
    this.removeAttribute('open');
    this.dispatchEvent(new window.Event('close'));
  } });
  const errors = [];
  window.addEventListener('error', event => errors.push(event.error || event.message));
  window.eval(script);
  function click(node, extra = {}) {
    assert.ok(node, 'Expected interactive control exists.');
    const event = new window.MouseEvent('click', { bubbles: true, cancelable: true, ...extra });
    node.dispatchEvent(event);
    return event;
  }
  function open() {
    trigger.focus();
    const event = click(trigger);
    assert.equal(event.defaultPrevented, true, 'Quiz opening replaces the fallback link navigation.');
    assert.equal(dialog.open, true);
    assert.equal(document.documentElement.style.overflow, 'hidden');
  }
  function choose(value) {
    const input = dialog.querySelector(`input[type="radio"][value="${value}"]`);
    assert.ok(input, `The current question offers ${value}.`);
    input.checked = true;
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
  }
  function action(name) { return click(dialog.querySelector(`[data-quiz-action="${name}"]`)); }
  function answer(value) { choose(value); action('next'); }
  const question = () => dialog.querySelector('.db-quiz-step')?.textContent;
  const options = () => [...dialog.querySelectorAll('input[type="radio"]')].map(input => input.value);
  const matches = () => [...dialog.querySelectorAll('.db-quiz-result')].map(card => card.dataset.scent);
  const finish = answers => { open(); answers.forEach(answer); };
  function clean() {
    dom.window.close();
    assert.deepEqual(errors, [], 'Actual quiz code emits no uncaught runtime error.');
  }
  return { window, document, dialog, trigger, catalog, open, choose, action, answer, question, options, matches, finish, click, clean, counts: () => ({ showCount, closeCount }) };
}

async function usingQuiz(run, mutateCatalog) {
  const quiz = createQuiz(mutateCatalog);
  try { await run(quiz); } finally { quiz.clean(); }
}

await verify('Every saved priority product picker opens its canonical live handle, including Rtulle & Satin', () => usingQuiz(q => {
  const expected = Object.fromEntries(handles.map(handle => [handle, `/products/${handle === 'rtulle-and-satin' ? 'rtulle-satin' : handle}`]));
  for (const [handle, url] of Object.entries(expected)) assert.equal(q.catalog.products[handle].url, url);
  assert.equal(q.catalog.collections.her, '/collections/womens-perfume');
  assert.equal(q.catalog.collections.him, '/collections/mens-perfume');
}));

await verify('Rendered hero exposes an accessible quiz trigger with a real no-JavaScript destination', () => usingQuiz(q => {
  assert.equal(q.trigger.getAttribute('aria-haspopup'), 'dialog');
  assert.equal(q.trigger.getAttribute('aria-controls'), q.dialog.id);
  assert.equal(q.trigger.getAttribute('href'), '/collections/all');
  assert.ok(q.document.getElementById(q.dialog.getAttribute('aria-labelledby'))?.textContent.trim());
  assert.ok(q.document.getElementById(q.dialog.getAttribute('aria-describedby'))?.textContent.trim());
  assert.deepEqual(Object.keys(q.catalog.products), handles);
}));

for (const [expected, answers] of [
  ['mojito-metallique', ['her', 'fruit', 'creamy']],
  ['amber-oud-silk', ['her', 'spice', 'dark']],
  ['mistened-narcissus', ['her', 'fruit', 'juicy']],
  ['oud-mirage', ['him', 'rose', 'dark']],
  ['charme-envoutant', ['him', 'spice', 'rich']],
  ['rtulle-and-satin', ['him', 'sweet', 'airy']],
]) {
  await verify(`${expected} is reachable as a distinct match with its actual product URL`, () => usingQuiz(q => {
    q.finish(answers);
    assert.deepEqual(q.matches(), [expected]);
    assert.equal(q.dialog.querySelector('.db-quiz-result-heading h3').textContent, 'Meet your scent match.');
    assert.equal(q.dialog.querySelector('.db-quiz-result a').getAttribute('href'), `/products/${expected === 'rtulle-and-satin' ? 'rtulle-satin' : expected}`);
    assert.match(q.dialog.querySelector('.db-quiz-reason').textContent, /^Why it fits:/);
  }));
}

for (const [collection, allowedDirections, allowedCharacters, expected] of [
  ['her', ['fruit', 'spice', 'smoke', 'sweet', 'open'], ['creamy', 'juicy', 'dark', 'open'], handles.slice(0, 3)],
  ['him', ['spice', 'smoke', 'rose', 'sweet', 'open'], ['airy', 'rich', 'dark', 'open'], handles.slice(3)],
]) {
  await verify(`${collection === 'her' ? 'For Her' : 'For Him'} excludes irrelevant choices and limits its open shortlist to that collection`, () => usingQuiz(q => {
    q.open();
    q.answer(collection);
    assert.deepEqual(q.options(), allowedDirections);
    q.answer('open');
    assert.deepEqual(q.options(), allowedCharacters);
    q.answer('open');
    assert.deepEqual(q.matches(), expected);
    assert.equal(q.dialog.querySelector('.db-quiz-result-footer a').getAttribute('href'), `/collections/${collection === 'her' ? 'womens' : 'mens'}-perfume`);
  }));
}

for (const [label, answers, expected] of [
  ['fruity For Her', ['her', 'fruit', 'open'], ['mojito-metallique', 'mistened-narcissus']],
  ['sweet For Him', ['him', 'sweet', 'open'], ['charme-envoutant', 'rtulle-and-satin']],
  ['dark smoky across both collections', ['all', 'smoke', 'dark'], ['amber-oud-silk', 'oud-mirage']],
]) {
  await verify(`Equal ${label} preferences preserve every tied match`, () => usingQuiz(q => {
    q.finish(answers);
    assert.deepEqual(q.matches(), expected);
    assert.equal(q.dialog.querySelector('.db-quiz-result-heading h3').textContent, 'Your scent shortlist.');
    assert.match(q.dialog.querySelector('.db-quiz-result-heading p').textContent, /equally/);
  }));
}

await verify('No preferences returns all six scents without fabricating a winner or matching reason', () => usingQuiz(q => {
  q.finish(['all', 'open', 'open']);
  assert.deepEqual(q.matches(), handles);
  assert.equal(q.dialog.querySelector('.db-quiz-result-heading h3').textContent, 'A little room to explore.');
  assert.equal(q.dialog.querySelectorAll('.db-quiz-reason').length, 0);
  assert.equal(q.dialog.querySelector('.db-quiz-result-footer a').getAttribute('href'), '/collections/all');
}));

for (const [label, answers, expected] of [
  ['fruit over a conflicting dark character', ['all', 'fruit', 'dark'], ['mojito-metallique', 'mistened-narcissus']],
  ['spice over a conflicting juicy character', ['her', 'spice', 'juicy'], ['amber-oud-silk']],
]) {
  await verify(`Direction weighting favors ${label}`, () => usingQuiz(q => {
    q.finish(answers);
    assert.deepEqual(q.matches(), expected);
    const reasons = [...q.dialog.querySelectorAll('.db-quiz-reason')].map(node => node.textContent);
    assert.ok(reasons.every(reason => !reason.includes(answers[2] === 'dark' ? 'dark & smoky' : 'juicy & smooth')), 'Result reasons do not claim an unmet character preference.');
  }));
}

await verify('Every question requires a valid selection, including a dispatched disabled-button click', () => usingQuiz(q => {
  q.open();
  for (const [index, answer] of ['all', 'fruit', 'juicy'].entries()) {
    const next = q.dialog.querySelector('[data-quiz-action="next"]');
    assert.equal(next.disabled, true);
    q.click(next); // Deliberately bypass the browser's disabled-button behavior.
    assert.equal(q.question(), `Question ${index + 1} of 3`);
    q.choose(answer);
    assert.equal(next.disabled, false);
    q.action('next');
  }
  assert.deepEqual(q.matches(), ['mistened-narcissus']);
}));

await verify('Back preserves selections; changing an earlier collection resets both downstream answers', () => usingQuiz(q => {
  q.open(); q.answer('all'); q.answer('fruit'); q.choose('juicy');
  q.action('back');
  assert.equal(q.dialog.querySelector('input:checked')?.value, 'fruit');
  q.action('back');
  assert.equal(q.dialog.querySelector('input:checked')?.value, 'all');
  q.answer('him');
  assert.equal(q.question(), 'Question 2 of 3');
  assert.equal(q.dialog.querySelector('input:checked'), null);
  assert.equal(q.dialog.querySelector('[data-quiz-action="next"]').disabled, true);
  assert.ok(!q.options().includes('fruit'));
  q.answer('sweet');
  assert.equal(q.dialog.querySelector('input:checked'), null);
  assert.equal(q.dialog.querySelector('[data-quiz-action="next"]').disabled, true);
  assert.ok(!q.options().includes('juicy'));
  q.answer('airy');
  assert.deepEqual(q.matches(), ['rtulle-and-satin']);
}));

await verify('Changing the earlier direction clears the existing character answer', () => usingQuiz(q => {
  q.open(); q.answer('all'); q.answer('fruit'); q.choose('creamy');
  q.action('back'); q.answer('smoke');
  assert.equal(q.question(), 'Question 3 of 3');
  assert.equal(q.dialog.querySelector('input:checked'), null);
  assert.equal(q.dialog.querySelector('[data-quiz-action="next"]').disabled, true);
}));

await verify('Retaking the quiz resets answers and results while keeping the modal open', () => usingQuiz(q => {
  q.finish(['her', 'fruit', 'creamy']);
  q.action('restart');
  assert.equal(q.dialog.open, true);
  assert.equal(q.question(), 'Question 1 of 3');
  assert.equal(q.dialog.querySelector('input:checked'), null);
  assert.equal(q.dialog.querySelector('[data-quiz-action="next"]').disabled, true);
  assert.deepEqual(q.matches(), []);
  assert.equal(q.document.activeElement, q.dialog.querySelector('legend'));
}));

await verify('Closing restores trigger focus and prior overflow; reopening adds no duplicate question handler', () => usingQuiz(q => {
  q.document.documentElement.style.overflow = 'scroll';
  q.open(); q.answer('her');
  q.click(q.dialog.querySelector('[data-quiz-close]'));
  assert.equal(q.dialog.open, false);
  assert.equal(q.document.documentElement.style.overflow, 'scroll');
  assert.equal(q.document.activeElement, q.trigger);
  q.open();
  assert.equal(q.question(), 'Question 1 of 3');
  assert.equal(q.dialog.querySelector('input:checked'), null);
  q.answer('him');
  assert.equal(q.question(), 'Question 2 of 3', 'One click advances exactly one question after a second opening.');
  assert.equal(q.dialog.querySelectorAll('fieldset').length, 1);
  q.click(q.dialog.querySelector('[data-quiz-close]'));
  assert.deepEqual(q.counts(), { showCount: 2, closeCount: 2 });
  assert.equal(q.document.documentElement.style.overflow, 'scroll');
}));

await verify('Removing the section in Shopify editor closes its quiz and releases scroll locking', () => usingQuiz(q => {
  q.open();
  const wrapper = q.dialog.closest('.shopify-section');
  wrapper.dispatchEvent(new q.window.Event('shopify:section:unload', { bubbles: true }));
  assert.equal(q.dialog.open, false);
  assert.equal(q.document.documentElement.style.overflow, '');
}));

await verify('Blank and null product URLs show availability copy without invented links', () => usingQuiz(q => {
  q.finish(['all', 'open', 'open']);
  assert.equal(q.dialog.querySelectorAll('.db-quiz-result a').length, 0);
  assert.equal(q.dialog.querySelectorAll('.db-quiz-unavailable').length, 6);
}, catalog => handles.forEach((handle, index) => { catalog.products[handle].url = [null, '', '   '][index % 3]; })));

await verify('A mapped product URL is used without reconstructing a handle', () => usingQuiz(q => {
  q.finish(['her', 'fruit', 'creamy']);
  assert.equal(q.dialog.querySelector('.db-quiz-result a').getAttribute('href'), '/products/merchant-mojito?variant=123');
}, catalog => { catalog.products['mojito-metallique'].url = '/products/merchant-mojito?variant=123'; }));

await verify('Unsafe product and collection URL schemes emit no actionable links', () => usingQuiz(q => {
  q.finish(['all', 'open', 'open']);
  assert.equal(q.dialog.querySelectorAll('.db-quiz-result a').length, 0);
  assert.equal(q.dialog.querySelectorAll('.db-quiz-result-footer a').length, 0);
  assert.equal(q.dialog.querySelectorAll('.db-quiz-unavailable').length, 6);
}, catalog => {
  const unsafe = ['javascript:alert(1)', 'data:text/html,bad', 'vbscript:msgbox(1)', 'file:///private/file', 'javascript:\nalert(1)', 'mailto:someone@example.com'];
  handles.forEach((handle, index) => { catalog.products[handle].url = unsafe[index]; });
  catalog.collections.all = 'javascript:alert(1)';
}));

await verify('Mistened Narcissus describes juicy berries and a smooth sweet finish', () => usingQuiz(q => {
  q.finish(['her', 'fruit', 'juicy']);
  assert.equal(q.dialog.querySelector('.db-quiz-description').textContent, 'Juicy berries softened by a smooth, sweet finish.');
}));

await verify('Missing category fallback is labeled all fragrances, not the selected category', async () => {
  for (const collection of ['her', 'him']) {
    await usingQuiz(q => {
      q.finish([collection, 'open', 'open']);
      const fallback = q.dialog.querySelector('.db-quiz-result-footer a');
      assert.equal(fallback.textContent, 'Explore all fragrances');
      assert.equal(fallback.getAttribute('href'), '/collections/all');
    }, catalog => { catalog.collections[collection] = catalog.collections.all; });
  }
});

// Render the real quiz section to exercise Shopify's missing-product and picker
// paths. Only Shopify's schema wrapper and unavailable asset/json filters adapt.
const source = sectionSource.replace(/{%[-\s]*schema\s*[-]?%}[\s\S]*?{%[-\s]*endschema\s*[-]?%}/, '');
const liquid = new Liquid({ strictFilters: true, strictVariables: false, jsTruthy: false });
liquid.registerFilter('asset_url', filename => `/assets/${filename}`);
liquid.registerFilter('json', value => JSON.stringify(value ?? null));
const renderCatalog = async (extra = {}) => {
  const markup = await liquid.parseAndRender(source, {
    settings: {}, section: { settings: {} }, all_products: {}, collections: {},
    routes: { all_products_collection_url: '/collections/all' }, ...extra,
  });
  const dom = new JSDOM(markup);
  try { return JSON.parse(dom.window.document.querySelector('[data-quiz-catalog]').textContent); }
  finally { dom.window.close(); }
};

await verify('Actual Liquid emits null URLs and bundled images when all_products is absent', async () => {
  const catalog = await renderCatalog({ all_products: undefined });
  assert.deepEqual(Object.keys(catalog.products), handles);
  for (const handle of handles) {
    assert.equal(catalog.products[handle].url, null);
    assert.equal(catalog.products[handle].image, `/assets/db-${handle}.jpg`);
  }
  assert.deepEqual(catalog.collections, { her: '/collections/all', him: '/collections/all', all: '/collections/all' });
});

await verify('Actual Liquid treats missing, empty and whitespace product URLs as unavailable', async () => {
  const allProducts = Object.fromEntries(handles.map((handle, index) => [handle, { title: handle, url: [undefined, '', '   '][index % 3] }]));
  const catalog = await renderCatalog({ all_products: allProducts });
  assert.ok(handles.every(handle => catalog.products[handle].url === null));
});

await verify('Rtulle resolves its actual Shopify handle, legacy alias and existing merchant picker', async () => {
  const actual = { url: '/products/rtulle-satin' };
  const legacy = { url: '/products/rtulle-and-satin' };
  let catalog = await renderCatalog({ all_products: { 'rtulle-satin': actual, 'rtulle-and-satin': legacy } });
  assert.equal(catalog.products['rtulle-and-satin'].url, actual.url);
  assert.equal(catalog.products['rtulle-and-satin'].image, '/assets/db-rtulle-and-satin.jpg');
  catalog = await renderCatalog({ all_products: { 'rtulle-and-satin': legacy } });
  assert.equal(catalog.products['rtulle-and-satin'].url, legacy.url);
  catalog = await renderCatalog({ section: { settings: { rtulle_and_satin: { url: '/products/merchant-rtulle' } } }, all_products: { 'rtulle-satin': actual } });
  assert.equal(catalog.products['rtulle-and-satin'].url, '/products/merchant-rtulle');
});

await verify('Actual Liquid honors merchant product-picker and configured collection overrides', async () => {
  const catalog = await renderCatalog({
    settings: { for_her_collection: { url: '/collections/merchant-her' }, for_him_collection: { url: '/collections/merchant-him' } },
    section: { settings: { mojito_metallique: { url: '/products/merchant-mojito' } } },
    all_products: { 'mojito-metallique': { url: '/products/default-mojito' }, 'oud-mirage': { url: '/products/default-oud' } },
  });
  assert.equal(catalog.products['mojito-metallique'].url, '/products/merchant-mojito');
  assert.equal(catalog.products['oud-mirage'].url, '/products/default-oud');
  assert.equal(catalog.products['amber-oud-silk'].url, null);
  assert.deepEqual(catalog.collections, { her: '/collections/merchant-her', him: '/collections/merchant-him', all: '/collections/all' });
});

console.log(`\n${results.length} quiz checks passed against actual homepage markup, quiz JavaScript and section Liquid.`);
console.log('No network resources loaded, forms submitted or catalog/theme files changed.');
console.log('Limits: dialog API shims do not verify native focus trapping, Escape dismissal, inertness or browser layout. Validate those in a real browser. Shopify runtime/product visibility and scent preference weighting are not measured scent-similarity guarantees.');
