import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { Liquid } from 'liquidjs';
import * as shopifyParser from '@shopify/liquid-html-parser';

// Synthetic fixtures test behavior, not product facts or merchant assignments.
const theme = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dearbody');
const script = await fs.readFile(path.join(theme, 'assets/dearbody-quiz.js'), 'utf8');
const source = await fs.readFile(path.join(theme, 'sections/db-scent-quiz.liquid'), 'utf8');
const moodSource = await fs.readFile(path.join(theme, 'sections/db-mood-discovery.liquid'), 'utf8');
const engine = new Liquid({ strictFilters: true, jsTruthy: false });
engine.registerFilter('asset_url', value => '/assets/' + value);
engine.registerFilter('stylesheet_tag', value => '<link rel="stylesheet" href="' + value + '">');
engine.registerFilter('json', value => JSON.stringify(value ?? null));
engine.registerFilter('money_with_currency', value => '₱' + (Number(value) / 100).toFixed(2) + ' PHP');
engine.registerFilter('image_url', value => value?.src || '');
engine.registerFilter('image_tag', value => '<img src="' + value + '" alt="">');
const body = content => content.replace(/\{% schema %\}[\s\S]*?\{% endschema %\}/, '');
const field = (value, type = Array.isArray(value) ? 'list.single_line_text_field' : 'single_line_text_field') => ({ type, value });
const product = (id, attributes = {}, enabled = true) => ({
  id, title: 'Fixture fragrance ' + id, url: '/products/fixture-' + id,
  featured_image: { src: '/fixture-' + id + '.jpg', alt: 'Fixture bottle ' + id },
  price: 125000 + id, price_varies: false, available: true,
  metafields: { custom: {
    scent_finder_enabled: field(enabled, 'boolean'),
    short_description: field('A supplied fixture description.'),
    ...Object.fromEntries(Object.entries(attributes).map(([key, value]) => [key, field(value)]))
  } }
});
async function render(settings = {}, designMode = false, id = 'fixture-quiz') {
  return engine.parseAndRender(body(source), {
    section: { id, settings },
    routes: { all_products_collection_url: '/collections/all' },
    request: { design_mode: designMode }
  });
}
function catalog(html) {
  const dom = new JSDOM(html);
  const parsed = JSON.parse(dom.window.document.querySelector('[data-quiz-catalog]').textContent);
  dom.window.close();
  return parsed;
}
function mount(html) {
  const dom = new JSDOM('<button data-scent-finder-start hidden>Start</button>' + html, { url: 'https://fixture.example/pages/scent-finder', runScripts: 'outside-only' });
  dom.window.eval(script);
  dom.window.DearBodyScentFinder.init(dom.window.document);
  return dom;
}
function choose(dom, label, root = dom.window.document) {
  const option = [...root.querySelectorAll('.db-quiz-option')].find(node => node.textContent === label);
  assert.ok(option, 'Missing option: ' + label);
  const input = option.querySelector('input');
  input.checked = true;
  input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
}
function action(dom, name, root = dom.window.document) {
  const target = root.querySelector('[data-quiz-action="' + name + '"]');
  assert.ok(target, 'Missing action: ' + name);
  target.click();
}
function labels(dom, root = dom.window.document) {
  return [...root.querySelectorAll('.db-quiz-option')].map(option => option.textContent);
}
let checks = 0;
async function test(name, run) {
  await run();
  checks += 1;
  console.log('PASS ' + name);
}

await test('All discovery sections parse with Shopify Liquid parser and valid schemas', async () => {
  const parse = shopifyParser.toLiquidHtmlAST || shopifyParser.default?.toLiquidHtmlAST;
  for (const name of ['db-scent-quiz', 'db-scent-finder', 'db-main-scent-finder', 'db-mood-discovery']) {
    const content = await fs.readFile(path.join(theme, 'sections/' + name + '.liquid'), 'utf8');
    parse(content);
    JSON.parse(content.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/)[1]);
  }
});
await test('Liquid requires true Boolean enablement and deduplicates selected products', async () => {
  const eligible = product(1, { scent_character: ['Fresh', 'Bright'], mood: 'Curious' });
  const textual = product(3, { scent_character: ['Wrong'] });
  textual.metafields.custom.scent_finder_enabled = field('true');
  const data = catalog(await render({ product_1: eligible, product_2: eligible, product_3: product(2, { mood: 'Disabled' }, false), product_4: textual }));
  assert.equal(data.products.length, 1);
  assert.equal(data.products[0].id, '1');
  assert.deepEqual(data.products[0].attributes.scent_character, ['Fresh', 'Bright']);
  assert.equal(data.products[0].attributes.gender, null);
});
await test('Collection takes precedence and is capped at its first 50 records', async () => {
  const products = Array.from({ length: 52 }, (_, index) => product(index + 1, { mood: 'Fixture' }));
  const data = catalog(await render({ collection: { products }, product_1: product(100, { mood: 'Picker' }) }));
  assert.equal(data.products.length, 50);
  assert.equal(data.products.at(-1).id, '50');
  assert.ok(!data.products.some(item => item.id === '100'));
});
await test('Unsupported numeric attributes are omitted and names cannot break catalog script', async () => {
  const supplied = product(1, { mood: 'Curious' });
  supplied.title = '</script><script>alert("fixture")</script>';
  supplied.metafields.custom.intensity = field(8, 'number_integer');
  const html = await render({ product_1: supplied });
  const data = catalog(html);
  assert.equal(data.products[0].name, supplied.title);
  assert.equal(data.products[0].attributes.intensity, null);
  assert.ok(!html.includes('</script><script>alert'));
});
await test('Missing setup gives a customer browse state and editor-only instructions', async () => {
  const html = await render();
  assert.ok(!html.includes('Scent finder setup'));
  assert.ok((await render({}, true)).includes('Scent finder setup'));
  const dom = mount(html);
  assert.equal(dom.window.document.querySelectorAll('input').length, 0);
  assert.ok(dom.window.document.querySelector('.db-quiz-empty-title'));
  assert.equal(dom.window.document.querySelector('[data-quiz-content] a').pathname, '/collections/all');
  assert.equal(dom.window.document.querySelector('[data-scent-finder-start]').hidden, true);
  dom.window.close();
});

const fresh = product(11, { scent_character: ['Fresh', ' fresh ', 'Bright'], mood: ['Curious'] });
fresh.price_varies = true;
fresh.available = false;
const warm = product(12, { scent_character: ['Warm'], mood: ['Relaxed'] });
const shared = product(13, { scent_character: 'Fresh', mood: 'Curious' });
const fixtureHtml = await render({ product_1: fresh, product_2: warm, product_3: shared, product_4: product(14, { gender: 'Unconfirmed option' }, false) });

await test('Questions contain only supplied values; no inferred gender, notes or scales', () => {
  const dom = mount(fixtureHtml);
  assert.deepEqual(labels(dom), ['Fresh', 'Bright', 'Warm', 'I’m open to any']);
  assert.equal(dom.window.document.querySelector('.db-quiz-step').textContent, 'Question 1 of 2');
  assert.equal(dom.window.document.querySelector('[data-quiz-action="next"]').disabled, true);
  assert.equal(dom.window.document.querySelector('[data-scent-finder-start]').hidden, false);
  dom.window.document.querySelector('[data-scent-finder-start]').click();
  assert.equal(dom.window.document.activeElement.tagName, 'LEGEND');
  dom.window.close();
});
await test('Exact matches retain ties, current price, availability and supplied reasons', () => {
  const dom = mount(fixtureHtml);
  choose(dom, 'Fresh');
  action(dom, 'next');
  assert.equal(dom.window.document.activeElement.tagName, 'LEGEND');
  choose(dom, 'Curious');
  action(dom, 'next');
  assert.deepEqual([...dom.window.document.querySelectorAll('[data-product-id]')].map(node => node.dataset.productId), ['11', '13']);
  assert.equal(dom.window.document.querySelector('.db-quiz-price').textContent, 'From ₱1250.11 PHP');
  assert.equal(dom.window.document.querySelector('.db-quiz-availability').textContent, 'Currently sold out');
  assert.equal(dom.window.document.querySelector('.db-quiz-reason').textContent, 'Shared qualities: Fresh · Curious.');
  assert.equal(dom.window.document.querySelector('.db-quiz-result a').pathname, '/products/fixture-11');
  assert.ok(dom.window.document.activeElement.classList.contains('db-quiz-result-title'));
  dom.window.close();
});
await test('Incompatible preferences never produce false matches', () => {
  const dom = mount(fixtureHtml);
  choose(dom, 'Fresh'); action(dom, 'next');
  choose(dom, 'Relaxed'); action(dom, 'next');
  assert.equal(dom.window.document.querySelectorAll('[data-product-id]').length, 0);
  assert.match(dom.window.document.querySelector('[data-quiz-content]').textContent, /haven’t found a fragrance/);
  action(dom, 'adjust');
  choose(dom, 'Curious'); action(dom, 'next');
  assert.equal(dom.window.document.querySelectorAll('[data-product-id]').length, 2);
  dom.window.close();
});
await test('All skipped choices offer browsing without presenting arbitrary recommendations', () => {
  const dom = mount(fixtureHtml);
  choose(dom, 'I’m open to any'); action(dom, 'next');
  choose(dom, 'I’m open to any'); action(dom, 'next');
  assert.equal(dom.window.document.querySelectorAll('[data-product-id]').length, 0);
  assert.match(dom.window.document.querySelector('.db-quiz-result-title').textContent, /wide open/);
  action(dom, 'restart');
  assert.equal(dom.window.document.querySelectorAll('input:checked').length, 0);
  assert.equal(dom.window.document.querySelector('[data-quiz-action="next"]').disabled, true);
  dom.window.close();
});
await test('Back retains the current choice and changed earlier choices clear later answers', () => {
  const dom = mount(fixtureHtml);
  choose(dom, 'Fresh'); action(dom, 'next');
  choose(dom, 'Curious'); action(dom, 'back');
  assert.equal(dom.window.document.querySelector('input:checked').closest('label').textContent, 'Fresh');
  choose(dom, 'Warm'); action(dom, 'next');
  assert.equal(dom.window.document.querySelectorAll('input:checked').length, 0);
  assert.equal(dom.window.document.querySelector('[data-quiz-action="next"]').disabled, true);
  dom.window.close();
});
await test('Multiple quiz sections use independent radio groups and idempotent initialization', async () => {
  const dom = mount(fixtureHtml + await render({ product_1: warm }, false, 'second-quiz'));
  const roots = dom.window.document.querySelectorAll('[data-scent-finder]');
  assert.notEqual(roots[0].querySelector('input').name, roots[1].querySelector('input').name);
  dom.window.DearBodyScentFinder.init(dom.window.document);
  dom.window.eval(script);
  choose(dom, 'Fresh', roots[0]); action(dom, 'next', roots[0]);
  assert.equal(roots[0].querySelector('.db-quiz-step').textContent, 'Question 2 of 2');
  assert.equal(roots[1].querySelector('.db-quiz-step').textContent, 'Question 1 of 2');
  dom.window.close();
});
await test('Malformed catalog preserves native browse fallback and unsafe URLs are discarded', async () => {
  for (const json of ['not JSON', 'null', '{}']) {
    const malformed = fixtureHtml.replace(/(<script type="application\/json" data-quiz-catalog>)[\s\S]*?(<\/script>)/, '$1' + json + '$2');
    const dom = mount(malformed);
    assert.ok(dom.window.document.querySelector('[data-quiz-content] a'));
    assert.equal(dom.window.document.querySelectorAll('input').length, 0);
    dom.window.close();
  }
  const bad = product(3, { mood: 'Unsafe' });
  bad.url = 'javascript:alert(1)';
  const dom = mount(await render({ product_1: bad }));
  assert.equal(dom.window.document.querySelectorAll('input').length, 0);
  assert.ok(!dom.window.document.querySelector('a[href^="javascript:"]'));
  dom.window.close();
});
await test('Merchant text renders as text and optional dimensions appear only when supplied', async () => {
  const supplied = product(7, { gender: 'Merchant selection', intensity: 'Quiet', scent_character: '<img src=x onerror=alert(1)>' });
  supplied.title = '<img src=x onerror=alert(1)>';
  const dom = mount(await render({ product_1: supplied }));
  choose(dom, supplied.title); action(dom, 'next');
  choose(dom, 'Quiet'); action(dom, 'next');
  choose(dom, 'Merchant selection'); action(dom, 'next');
  assert.equal(dom.window.document.querySelector('h4').textContent, supplied.title);
  assert.equal(dom.window.document.querySelectorAll('img[onerror]').length, 0);
  dom.window.close();
});
await test('Theme Editor replacement initializes the new section and removes stale CTA controls', async () => {
  const dom = mount(fixtureHtml);
  const root = dom.window.document.querySelector('[data-scent-finder]');
  root.dispatchEvent(new dom.window.CustomEvent('shopify:section:unload', { bubbles: true }));
  assert.equal(dom.window.document.querySelector('[data-scent-finder-start]').hidden, true);
  root.remove();
  const wrapper = dom.window.document.createElement('div');
  wrapper.innerHTML = await render({ product_1: warm }, false, 'replacement');
  dom.window.document.body.append(wrapper);
  wrapper.dispatchEvent(new dom.window.CustomEvent('shopify:section:load', { bubbles: true }));
  assert.ok(wrapper.querySelector('input'));
  assert.equal(dom.window.document.querySelector('[data-scent-finder-start]').getAttribute('aria-controls'), 'DearBodyScentFinder-replacement');
  dom.window.close();
});
await test('Mood cards render only assigned metaobjects with a title and collection', async () => {
  const context = { section: { id: 'moods', settings: {}, blocks: [] }, request: { design_mode: false } };
  assert.equal((await engine.parseAndRender(body(moodSource), context)).trim(), '');
  context.section.blocks = [{ settings: { mood: { title: field('Confirmed feeling') } } }];
  assert.equal((await engine.parseAndRender(body(moodSource), context)).trim(), '');
  context.section.blocks[0].settings.mood.collection = field({ url: '/collections/confirmed' }, 'collection_reference');
  context.section.blocks[0].settings.mood.description = field('Merchant-supplied mood.');
  const html = await engine.parseAndRender(body(moodSource), context);
  assert.match(html, /href="\/collections\/confirmed"/);
  assert.match(html, /Merchant-supplied mood/);
  assert.ok(!html.includes('Shop by feeling setup'));
});
console.log('\n' + checks + ' discovery checks passed.');
