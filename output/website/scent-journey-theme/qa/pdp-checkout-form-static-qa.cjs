/** Actual Liquid form fragment, isolated synthetic data. No browser or checkout submission. */
const fs = require('node:fs'), path = require('node:path');
const { Liquid } = require('../preview/node_modules/liquidjs');
const { JSDOM } = require('../preview/node_modules/jsdom');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'theme/sections/sj-product.liquid'), 'utf8');
const css = fs.readFileSync(path.join(root, 'theme/assets/sj-product.css'), 'utf8');
const fragment = source.match(/<form method="get"[\s\S]*?<\/form>/)?.[0];
if (!fragment) throw new Error('Native checkout form missing');
const handles = ['mojito-metallique','amber-oud-silk','mistened-narcissus','charme-envoutant','oud-mirage','rtulle-satin'];
const names = ['Mojito Metallique','Amber Oud Silk','Mistened Narcissus','Charme Envoutant','Oud Mirage','Rtulle Satin'];
const engine = new Liquid({ root: path.join(root, 'theme/snippets'), extname: '.liquid', jsTruthy: false });
engine.registerFilter('money_with_currency', value => `PHP ${(Number(value) / 100).toFixed(2)}`);
engine.registerFilter('money', value => `₱${(Number(value) / 100).toFixed(2)}`);
const report = { generatedAt: new Date().toISOString(), checks: [], issues: [], boundaries: [
 'Renders actual checkout Liquid form with synthetic available/unavailable native product fixtures; no production availability changes.',
 'JSDOM constraint validation and source structure only. No browser layout, network request, order or address submission.',
 'Commerce/product JS transport and totals are independently tested by commerce_discovery. Shipping/payment/address validation remains native Shopify checkout.',
 'No personal addresses are used or persisted. Native subtotal is an estimate before any further checkout adjustments.'
] };
const check = (pass, label, fixture = 'source') => { const row = { pass: Boolean(pass), label, fixture }; report.checks.push(row); if (!row.pass) report.issues.push(row); };
const productFixture = (index, available = true) => ({ id: 100 + index, handle: handles[index], title: names[index], has_only_default_variant: true, options: ['Title'], variants: [{ id: 10001 + index, title: 'Default Title', available, price: 79900, compare_at_price: 109900, quantity_rule: { min: 1, increment: 1 } }] });
const allowed = ['country','first_name','last_name','address1','address2','city','province','zip'].map(n => `checkout[shipping_address][${n}]`);
async function render(label, { available = true, cartPath = '/cart', currency = 'PHP', omitHandle } = {}) {
 const product = productFixture(0, available);
 const products = Object.fromEntries(handles.filter(h => h !== omitHandle).map(h => { const i = handles.indexOf(h); return [h, productFixture(i, i !== 2)]; }));
 const html = await engine.parseAndRender(fragment, { product, current_variant: product.variants[0], product_form_id: 'ProductForm-qa', section: { id: 'qa' }, second_scent_handles: handles, all_products: products, routes: { cart_url: cartPath }, checkout_currency: currency, checkout_initial_quantity: 1, checkout_initial_subtotal: 79900, checkout_initial_shipping: 8000, cart: { currency: { iso_code: currency } }, shop: { currency }, localization: { country: { iso_code: 'PH' } } });
 const dom = new JSDOM(html, { url: 'https://example.invalid/products/qa-product' }), doc = dom.window.document, form = doc.querySelector('form');
 check(form.method === 'get' && form.getAttribute('action') === cartPath + '/10001:1' && form.dataset.sjCheckoutBase === cartPath, 'Native locale-safe direct checkout action encodes one primary bottle', label);
 const named = [...form.elements].filter(n => n.name).map(n => n.name).sort();
 check(JSON.stringify(named) === JSON.stringify([...allowed].sort()), 'Only supported Shopify shipping-prefill fields are named', label);
 check([...form.querySelectorAll('label')].every(l => doc.getElementById(l.htmlFor)), 'Every control label resolves', label);
 const ids = [...doc.querySelectorAll('[id]')].map(n => n.id);
 check(ids.length === new Set(ids).size, 'No duplicate form IDs', label);
 const inputs = [...form.querySelectorAll('input')];
 check(inputs.filter(n => n.required && !n.disabled).length === 6 && !form.elements.namedItem('checkout[shipping_address][address2]').required && form.elements.namedItem('checkout[shipping_address][country]').value === 'Philippines', 'Six required address fields, optional address2 and Philippines hidden country', label);
 check(inputs.filter(n => n.name && n.type !== 'hidden').every(n => n.autocomplete.startsWith('shipping ')), 'Shipping autocomplete tokens present', label);
 check(!form.checkValidity(), 'Empty address is invalid using native constraints', label);
 const values = { first_name: 'QA', last_name: 'Fixture', address1: 'Synthetic test address', city: 'Test city', province: 'Test province', zip: '1234' };
 Object.entries(values).forEach(([key,value]) => { form.elements.namedItem(`checkout[shipping_address][${key}]`).value = value; });
 check(form.checkValidity(), 'Complete synthetic address passes native constraints', label);
 const zip = form.elements.namedItem('checkout[shipping_address][zip]'); zip.value = '123';
 check(!form.checkValidity(), 'Non-four-digit postal code rejected', label);
 const buttons = [...form.querySelectorAll('button[type=submit]')];
 check(buttons.length === 1 && buttons[0].disabled === !available && buttons[0].textContent.trim() === (available ? 'Check out' : 'Sold out'), 'One purchase submit with correct availability state', label);
 const second = form.querySelector('[data-sj-checkout-second]');
 check(second && !second.name && second.disabled && second.closest('[data-sj-checkout-second-field]').hidden && second.value === '', 'Optional second scent hidden and disabled until JS, none selected by default', label);
 const options = [...second.options].filter(n => n.value);
 check(new Set(options.map(n => n.value)).size === options.length && options.length === (omitHandle ? 5 : 6), 'Exactly one native default variant per available catalogue fixture; no duplicate IDs', label);
 check(options.every(o => Boolean(o.dataset.priceCents) && (o.dataset.available === 'true' || o.disabled && o.textContent.includes('Sold out'))), 'Native second-scent price and availability metadata; unavailable choices disabled', label);
 check(options.some(o => o.value === '10001' && o.disabled === !available), 'Same scent can be selected as a second bottle when available', label);
 check(form.querySelector('[data-sj-variant]').disabled && !form.querySelector('[data-sj-variant]').name && [...form.querySelector('[data-sj-variant]').options].every(o => o.dataset.priceCents === '79900'), 'Primary native variant is unnamed, initially disabled until JS and has current native price cents', label);
 const summary = form.querySelector('[data-sj-checkout-summary]');
 check(summary.dataset.currency === currency && summary.dataset.singleShipping === '8000' && summary.querySelectorAll('[data-sj-checkout-subtotal],[data-sj-checkout-shipping],[data-sj-checkout-total],[data-sj-checkout-shipping-message]').length === 4, 'Totals hooks, currency and verified single-item shipping amount present', label);
 check(currency === 'PHP' ? summary.querySelector('[data-sj-checkout-total]').textContent === 'PHP 879.00' && summary.querySelector('[data-sj-checkout-shipping]').textContent === 'PHP 80.00' : summary.querySelector('[data-sj-checkout-total]').textContent === 'Confirmed at checkout' && summary.querySelector('[data-sj-checkout-shipping]').textContent === 'Calculated at checkout', 'Native single-item estimate is guarded by currency', label);
 check(form.querySelector('[data-sj-checkout-quantity]')?.disabled && form.querySelector('[data-sj-checkout-second-quantity]')?.disabled && form.querySelector('[data-sj-product-order-open]')?.hidden && !form.querySelector('[data-sj-product-order-panel]')?.hidden, 'No-JS fallback keeps direct form visible and quantity/reveal controls inactive', label);
 check(!form.querySelector('[name=id],[name=quantity],[name=form_type],[data-sj-product-added]') && !/Add to cart|Your bag/.test(form.textContent), 'No named quantity, bag/toast action or unsupported product-form query metadata', label);
 dom.window.close();
}
(async () => {
 await render('available-php');
 await render('sold-out-php', { available: false });
 await render('locale-cart', { cartPath: '/en/cart' });
 await render('other-currency', { currency: 'USD' });
 await render('missing-native-product', { omitHandle: 'rtulle-satin' });
 check(!source.includes('payment_button') && !source.includes('show_dynamic_checkout') && !source.includes('data-sj-sticky-purchase'), 'Extra dynamic/sticky purchase buttons removed');
 check(source.includes("{% render 'sj-rating-summary', product: product %}"), 'Rating summary preserved beside purchase');
 const template = JSON.parse(fs.readFileSync(path.join(root, 'theme/templates/product.json'), 'utf8'));
 check(!('show_dynamic_checkout' in template.sections.main.settings) && template.order.includes('reviews'), 'Template preserves reviews and removes unused express-purchase setting');
 check(css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))') && css.includes('@media (max-width: 420px)') && css.includes('font: 300 16px/1.4 var(--font-body)') && css.includes('min-height: 46px'), 'Responsive address grid and readable input styling declared');
 check(!css.includes('.sj-product__added-toast') && !css.includes('.sj-product__sticky'), 'Unused toast and sticky purchase styling absent');
 report.summary = { status: report.issues.length ? 'FAIL' : 'PASS', passed: report.checks.filter(n => n.pass).length, checks: report.checks.length, failures: report.issues.length };
 fs.writeFileSync(path.join(__dirname, 'PDP-CHECKOUT-FORM-STATIC-QA.json'), JSON.stringify(report, null, 2) + '\n');
 fs.writeFileSync(path.join(__dirname, 'PDP-CHECKOUT-FORM-STATIC-QA.md'), ['# PDP checkout form static QA — ' + report.summary.status, '', `${report.summary.passed}/${report.summary.checks} checks passed across five isolated Liquid fixtures.`, '', 'Coverage: available/sold-out primary products, locale cart paths, six native second-scent options, unavailable variant disabling, same-scent second bottle, missing catalogue entry, address constraints, single native submit, supported prefill field names, PHP estimates and non-PHP fallback.', '', ...report.boundaries.map(n => '- ' + n), '', ...(report.issues.length ? report.issues.map(n => '- ' + n.fixture + ': ' + n.label) : ['No source/markup failures.'])].join('\n') + '\n');
 console.log(JSON.stringify(report.summary, null, 2));
 if (report.issues.length) { console.log(report.issues); process.exitCode = 1; }
})().catch(error => { console.error(error); process.exitCode = 1; });
