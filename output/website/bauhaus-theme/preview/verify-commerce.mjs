import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { Liquid } from 'liquidjs';

// These synthetic variants exist only in this isolated test DOM. They never
// modify the preview catalog, Shopify products, or the theme's source files.
const root = path.dirname(fileURLToPath(import.meta.url));
const theme = path.resolve(root, '../dearbody');
const html = await fs.readFile(path.join(root, 'public/products/mojito-metallique/index.html'), 'utf8');
const script = await fs.readFile(path.join(theme, 'assets/dearbody.js'), 'utf8');
const dom = new JSDOM(html, {
  url: 'https://preview.invalid/products/mojito-metallique',
  runScripts: 'outside-only',
  // No resources option: images, scripts, and stylesheets are never fetched.
});
const { window } = dom;
const { document } = window;
const section = document.querySelector('[data-db-product]');
assert.ok(section, 'Rendered product markup exists.');
const form = section.querySelector('form');
const addButton = section.querySelector('[data-db-add]');
const price = section.querySelector('[data-db-price]');
const mediaPanels = [...section.querySelectorAll('[data-db-media-panel]')];
const mediaButtons = [...section.querySelectorAll('[data-db-media-target]')];
const results = [];
function verify(name, run) {
  run();
  results.push(name);
  console.log(`PASS ${name}`);
}
verify('Approved PHP 799 preview product remains unavailable pending inventory confirmation', () => {
  assert.equal(addButton.disabled, true);
  assert.equal(addButton.textContent.trim(), 'Sold out');
  assert.equal(price.textContent.trim(), '₱799.00 PHP');
});
assert.ok(mediaPanels.length >= 2, 'Actual rendered gallery has at least two media panels.');

const fixtures = [
  { id: 900101, title: 'Synthetic paid test', price: 1750, available: true, featured_media: { id: Number(mediaPanels[1].dataset.dbMediaId) } },
  { id: 900102, title: 'Synthetic free test', price: 0, available: true },
  { id: 900103, title: 'Synthetic sold-out test', price: 2990, available: false },
];
const preformattedPrices = { '900101': 'CA$17.50 CAD', '900102': 'CA$0.00 CAD', '900103': 'CA$29.90 CAD' };
section.querySelector('[data-db-variants]').textContent = JSON.stringify(fixtures);
section.querySelector('[data-db-variant-prices]').textContent = JSON.stringify(preformattedPrices);
const originalVariantInput = section.querySelector('[data-db-variant]');
const variantSelect = document.createElement('select');
variantSelect.name = 'id';
variantSelect.id = originalVariantInput.id || 'synthetic-variant-selector';
variantSelect.dataset.dbVariant = '';
for (const variant of fixtures) {
  const option = document.createElement('option');
  option.value = String(variant.id);
  option.textContent = variant.title;
  option.disabled = !variant.available || variant.price <= 0;
  variantSelect.append(option);
}
const invalidOption = document.createElement('option');
invalidOption.value = 'missing-variant';
invalidOption.textContent = 'Synthetic invalid selection';
variantSelect.append(invalidOption);
originalVariantInput.replaceWith(variantSelect);

// Only the theme script executes. The preview-only inline interceptor does not,
// so the paid submission test observes the theme's real native-form behavior.
window.eval(script);
const changeVariant = (id) => {
  variantSelect.value = String(id);
  variantSelect.dispatchEvent(new window.Event('change', { bubbles: true }));
};
const submitEvent = () => {
  const event = new window.Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(event);
  return event;
};
verify('Paid variant enables Add to bag and preserves Shopify-formatted currency', () => {
  changeVariant(900101);
  assert.equal(addButton.disabled, false);
  assert.equal(addButton.textContent, 'Add to bag');
  assert.equal(price.textContent, preformattedPrices['900101']);
  assert.equal(new URL(window.location.href).searchParams.get('variant'), '900101');
});
verify('Paid variant selects its featured media and exposes one active thumbnail', () => {
  assert.equal(mediaPanels[1].hidden, false);
  assert.equal(mediaPanels[0].hidden, true);
  assert.equal(mediaButtons[1].getAttribute('aria-pressed'), 'true');
  assert.equal(mediaButtons.filter((button) => button.getAttribute('aria-pressed') === 'true').length, 1);
});
verify('Paid native product submission is not prevented by theme JavaScript', () => {
  assert.equal(submitEvent().defaultPrevented, false);
});
verify('Free variant is disabled and labeled Available soon', () => {
  changeVariant(900102);
  assert.equal(addButton.disabled, true);
  assert.equal(addButton.textContent, 'Available soon');
  assert.equal(price.textContent, 'Available soon');
});
verify('Free product submission is prevented even if the disabled button is tampered with', () => {
  addButton.disabled = false;
  assert.equal(submitEvent().defaultPrevented, true);
});
verify('Sold-out variant is disabled with its actual formatted price', () => {
  changeVariant(900103);
  assert.equal(addButton.disabled, true);
  assert.equal(addButton.textContent, 'Sold out');
  assert.equal(price.textContent, preformattedPrices['900103']);
  assert.equal(submitEvent().defaultPrevented, true);
});
verify('Unknown variant disables the action and prevents submission', () => {
  changeVariant('missing-variant');
  assert.equal(addButton.disabled, true);
  assert.equal(addButton.textContent, 'Unavailable');
  assert.equal(submitEvent().defaultPrevented, true);
});
verify('Gallery thumbnail clicks switch panels and accessible pressed states', () => {
  const childTarget = mediaButtons[0].querySelector('img') || mediaButtons[0];
  childTarget.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(mediaPanels[0].hidden, false);
  assert.equal(mediaPanels[1].hidden, true);
  assert.equal(mediaButtons[0].getAttribute('aria-pressed'), 'true');
  assert.equal(mediaButtons[1].getAttribute('aria-pressed'), 'false');
});
verify('Switching away from a video pauses playback', () => {
  const syntheticVideo = document.createElement('video');
  let pauseCalls = 0;
  syntheticVideo.pause = () => { pauseCalls += 1; };
  mediaPanels[0].append(syntheticVideo);
  mediaButtons[1].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(pauseCalls, 1);
  syntheticVideo.remove();
});
verify('Escape closes the mobile menu and restores summary focus', () => {
  const menu = document.querySelector('.db-mobile-menu');
  assert.ok(menu);
  menu.open = true;
  menu.querySelector('nav a').focus();
  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(menu.open, false);
  assert.equal(document.activeElement, menu.querySelector('summary'));
});
verify('Clicking outside closes the mobile menu', () => {
  const menu = document.querySelector('.db-mobile-menu');
  menu.open = true;
  price.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(menu.open, false);
});
verify('Malformed variant JSON fails closed for change and submit', () => {
  section.querySelector('[data-db-variants]').textContent = '{malformed';
  changeVariant(900101);
  assert.equal(addButton.disabled, true);
  assert.equal(submitEvent().defaultPrevented, true);
});
dom.window.close();

// Render the actual card snippet with separately scoped synthetic catalog data.
// This verifies the Liquid minimum-positive-price behavior, not a reimplementation.
const cardSource = await fs.readFile(path.join(theme, 'snippets/db-product-card.liquid'), 'utf8');
const liquid = new Liquid({ strictFilters: true, strictVariables: false, jsTruthy: false });
liquid.registerFilter('money_with_currency', (cents) => `£${(Number(cents) / 100).toFixed(2)} GBP`);
liquid.registerFilter('asset_url', (filename) => `/assets/${filename}`);
liquid.registerFilter('image_url', (image) => image?.src || '');
liquid.registerFilter('image_tag', (src) => `<img src="${src}" alt="Synthetic test">`);
for (const test of [
  { name: 'Mixed zero and one paid price displays the positive price without From', prices: [0, 75000], expected: '£750.00 GBP' },
  { name: 'Mixed zero and varied paid prices uses minimum positive price with From', prices: [95000, 0, 75000], expected: 'From £750.00 GBP' },
  { name: 'Repeated equal paid prices omit From even alongside zero-price variant', prices: [75000, 0, 75000], expected: '£750.00 GBP' },
  { name: 'Entirely zero-price card remains Available soon', prices: [0, 0], expected: 'Available soon' },
]) {
  const markup = await liquid.parseAndRender(cardSource, {
    product: { title: 'Synthetic card fixture', url: '/synthetic-test', price: 0, variants: test.prices.map((price, index) => ({ id: index + 1, price, available: true })) },
    fallback_name: '', fallback_image: '',
  });
  const cardDom = new JSDOM(markup);
  verify(test.name, () => assert.equal(cardDom.window.document.querySelector('.db-card-meta p').textContent.trim(), test.expected));
  cardDom.window.close();
}
// Shopify Liquid considers empty strings truthy. An unresolved product must
// remain a non-linked card instead of emitting href="" back to the homepage.
for (const test of [
  { name: 'Missing product keeps fallback artwork and name without a link', product: undefined },
  { name: 'Product with missing URL emits no homepage link', product: { title: 'Synthetic missing URL' } },
  { name: 'Product with empty URL emits no homepage link', product: { title: 'Synthetic empty URL', url: '' } },
  { name: 'Product with whitespace-only URL emits no homepage link', product: { title: 'Synthetic whitespace URL', url: '   ' } },
  { name: 'Resolved product links its image, name and action to its detail page', product: { title: 'Synthetic resolved product', url: '/products/synthetic-resolved' } },
]) {
  const markup = await liquid.parseAndRender(cardSource, {
    product: test.product, fallback_name: 'Priority fragrance', fallback_image: 'db-mojito-metallique.jpg',
  });
  const cardDom = new JSDOM(markup);
  verify(test.name, () => {
    const cardDocument = cardDom.window.document;
    const links = [...cardDocument.querySelectorAll('.db-card a')];
    const expectedUrl = test.product?.url?.trim();
    assert.equal(links.length, expectedUrl ? 3 : 0);
    for (const link of links) assert.equal(link.getAttribute('href'), expectedUrl);
    assert.equal(cardDocument.querySelector('.db-card h3').textContent.trim(), test.product?.title || 'Priority fragrance');
    assert.equal(cardDocument.querySelector('.db-card img').getAttribute('src'), '/assets/db-mojito-metallique.jpg');
    assert.equal(cardDocument.querySelector('.db-card-meta p').textContent.trim(), 'Available soon');
    assert.equal(cardDocument.querySelectorAll('.db-card-arrow').length, expectedUrl ? 1 : 0);
  });
  cardDom.window.close();
}
console.log(`\n${results.length} commerce checks passed against actual theme JavaScript and Liquid markup.`);
console.log('No network resources loaded; no forms submitted; no preview catalog or theme files changed.');
console.log('Gaps: no browser layout, Shopify checkout/backend, no-JavaScript variant switching, or live currency localization validation.');
