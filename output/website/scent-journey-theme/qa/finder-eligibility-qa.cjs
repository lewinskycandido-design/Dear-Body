const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('../preview/node_modules/liquidjs');
const { JSDOM } = require('../preview/node_modules/jsdom');
const theme = path.join(__dirname, '../theme');
const snapshot = require('../preview/shopify-public-snapshot.json');
const source = fs.readFileSync(path.join(theme, 'sections/sj-scent-finder.liquid'), 'utf8');
const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
const handles = ['mojito-metallique', 'amber-oud-silk', 'mistened-narcissus', 'oud-mirage', 'charme-envoutant', 'rtulle-satin'];
const field = value => ({ value, type: Array.isArray(value) ? 'list.single_line_text_field' : typeof value === 'boolean' ? 'boolean' : 'single_line_text_field' });
const makeProducts = () => handles.map(handle => {
  const actual = snapshot.products.find(product => product.handle === handle);
  assert(actual, `Real catalog fixture missing: ${handle}`);
  return { id: actual.id, handle, title: actual.title, url: `/products/${handle}`, available: actual.public_detail.available,
    price: Number(actual.variants[0].price) * 100, metafields: { custom: {} } };
});
const engine = new Liquid({ root: path.join(theme, 'snippets'), extname: '.liquid', jsTruthy: false });
engine.registerFilter('json', value => JSON.stringify(value ?? null));
engine.registerFilter('asset_url', value => '/assets/' + value);
engine.registerFilter('money', value => '₱' + Number(value || 0) / 100);
// LiquidJS lacks Shopify schema/paginate tags. Only wrappers are removed;
// profiles, eligibility, and product cards render from the actual native source.
const prepared = source.replace(/{% schema %}[\s\S]*?{% endschema %}/, '')
  .replace(/{% paginate [\s\S]*?%}/, '').replace(/{% endpaginate %}/, '');
const render = async (products = makeProducts(), settings = {}) => {
  const html = await engine.parseAndRender(prepared, {
    section: { id: 'qa-finder', settings: { heading: 'Find your scent', description: 'Explore', ...settings } },
    collections: { all: { products, url: '/collections/all' } },
    routes: { all_products_collection_url: '/collections/all' }, request: { design_mode: false }
  });
  const dom = new JSDOM(html);
  const script = dom.window.document.querySelector('[data-sj-finder-data]');
  return { dom, data: JSON.parse(script.textContent), script };
};
const profileHandles = result => result.data.map(profile => profile.handle).sort();
const assertCardParity = result => assert.deepEqual(
  [...result.dom.window.document.querySelectorAll('[data-sj-finder-product]')].map(card => Number(card.dataset.sjFinderProduct)).sort(),
  result.data.map(profile => profile.id).sort(), 'Eligible profiles and result-card bank must agree'
);
const loadDefaultProfiles = async () => {
  const result = await render();
  const data = result.data;
  result.dom.window.close();
  return data;
};
async function run() {
  let scenarios = 0;
  const test = async (name, action) => { await action(); scenarios++; console.log(`PASS ${name}`); };
  await test('Native defaults allow sold-out discovery', () => {
    const setting = schema.settings.find(item => item.id === 'available_only');
    assert.equal(setting.type, 'checkbox'); assert.equal(setting.default, false);
  });
  await test('All six actual launch handles work without metafields and retain sold-out labels', async () => {
    const result = await render();
    try {
      assert.deepEqual(profileHandles(result), [...handles].sort());
      assertCardParity(result);
      for (const profile of result.data) {
        for (const key of ['mood', 'character', 'occasion', 'intensity', 'description']) assert(profile[key]?.length, `${profile.handle} lacks ${key}`);
        assert.equal(profile.collection, snapshot.memberships['womens-perfume'].includes(profile.handle) ? 'Women' : 'Men');
        const badge = result.dom.window.document.querySelector(`[data-sj-finder-product="${profile.id}"] .sj-product-card__badge`);
        assert.match(badge.textContent, /SOLD OUT/);
      }
      assert.equal(result.dom.window.document.querySelector('[data-sj-finder-experience]').hidden, true);
    } finally { result.dom.window.close(); }
  });
  await test('Explicit false opts out while true and missing flags remain eligible', async () => {
    const products = makeProducts();
    products[0].metafields.custom.scent_finder_enabled = field(false);
    products[1].metafields.custom.scent_finder_enabled = field(true);
    const result = await render(products);
    try { assert.deepEqual(profileHandles(result), handles.slice(1).sort()); assertCardParity(result); }
    finally { result.dom.window.close(); }
  });
  await test('Unknown handles stay excluded even when enabled with complete custom traits', async () => {
    const products = makeProducts();
    products.push({ ...products[0], id: 999, handle: 'non-launch-fragrance', metafields: { custom: {
      scent_finder_enabled: field(true), mood: field('Warm'), scent_character: field('Woody'), occasion: field('Everyday'), intensity: field('Rich')
    } } });
    const result = await render(products);
    try { assert.deepEqual(profileHandles(result), [...handles].sort()); assertCardParity(result); }
    finally { result.dom.window.close(); }
  });
  await test('Available-only includes exactly available and non-opted-out products', async () => {
    const products = makeProducts(); products[0].available = true; products[1].available = true;
    products[1].metafields.custom.scent_finder_enabled = field(false);
    const result = await render(products, { available_only: true });
    try { assert.deepEqual(profileHandles(result), [handles[0]]); assertCardParity(result); }
    finally { result.dom.window.close(); }
  });
  await test('Explicit available-only false includes all six sold-out products', async () => {
    const result = await render(makeProducts(), { available_only: false });
    try { assert.deepEqual(profileHandles(result), [...handles].sort()); assertCardParity(result); }
    finally { result.dom.window.close(); }
  });
  await test('No eligible stock produces valid empty JSON and an honest empty state', async () => {
    const result = await render(makeProducts(), { available_only: true });
    try {
      assert.deepEqual(result.data, []); assertCardParity(result);
      assert.equal(result.dom.window.document.querySelector('[data-sj-finder-experience]'), null);
      assert.match(result.dom.window.document.querySelector('.sj-empty-state').textContent, /no fragrances to match/i);
    } finally { result.dom.window.close(); }
  });
  await test('Custom traits override independently and blank values retain starter defaults', async () => {
    const products = makeProducts(); const defaults = await loadDefaultProfiles();
    const custom = { mood: ['Custom mood'], scent_character: 'Custom style', occasion: ['Custom occasion'], intensity: 'Custom feel' };
    products[0].metafields.custom = Object.fromEntries(Object.entries(custom).map(([key, value]) => [key, field(value)]));
    products[1].metafields.custom = { mood: field(''), scent_character: field(null), occasion: field([]), intensity: field('') };
    products[2].metafields.custom.mood = field('Only this trait changes');
    const result = await render(products);
    try {
      for (const [key, value] of Object.entries(custom)) assert.deepEqual(result.data[0][key === 'scent_character' ? 'character' : key], value);
      assert.deepEqual(result.data[1], defaults[1]);
      assert.equal(result.data[2].mood, 'Only this trait changes');
      for (const key of ['character', 'occasion', 'intensity', 'description', 'collection']) assert.deepEqual(result.data[2][key], defaults[2][key]);
    } finally { result.dom.window.close(); }
  });
  await test('Title and every custom trait produce script-safe JSON with exact round-trip values', async () => {
    const products = makeProducts();
    const payload = '</script><script id="finder-injected">alert("x")</script><img src=x onerror=alert(1)> & “é”\n';
    products[0].title = payload;
    products[0].metafields.custom = { mood: field([payload]), scent_character: field(payload), occasion: field([payload]), intensity: field(payload) };
    const result = await render(products);
    try {
      assert.equal(result.dom.window.document.querySelector('#finder-injected'), null);
      assert.equal(result.dom.window.document.querySelectorAll('[data-sj-finder-data]').length, 1);
      assert(!result.script.textContent.includes('<'));
      assert(result.script.textContent.includes('\\u003c/script'));
      assert.equal(result.data[0].title, payload); assert.deepEqual(result.data[0].mood, [payload]);
      assert.equal(result.data[0].character, payload); assert.deepEqual(result.data[0].occasion, [payload]);
      assert.equal(result.data[0].intensity, payload); assert.deepEqual(profileHandles(result), [...handles].sort());
    } finally { result.dom.window.close(); }
  });
  console.log(`Finder Liquid eligibility QA: ${scenarios} scenarios passed.`);
}
module.exports = { loadDefaultProfiles };
if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
