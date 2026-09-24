/** Isolated Liquid/JSDOM fixtures only. No site rebuild, browser, network or form submission. */
const fs = require('node:fs'), path = require('node:path');
const { Liquid } = require('../preview/node_modules/liquidjs');
const { JSDOM } = require('../preview/node_modules/jsdom');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'theme/sections/sj-product-reviews.liquid'), 'utf8');
const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
const engine = new Liquid({ root: path.join(root, 'theme/snippets'), extname: '.liquid', jsTruthy: false });
engine.registerFilter('asset_url', v => '/assets/' + v);
engine.registerFilter('stylesheet_tag', v => `<link rel="stylesheet" href="${v}">`);
const adapted = source.replace(/{% schema %}[\s\S]*?{% endschema %}/, '').replace(/{% render block %}/g, '<div data-qa-app-provider>Isolated app provider placeholder</div>');
const report = { generatedAt: new Date().toISOString(), checks: [], issues: [], boundaries: [
  'Synthetic ratings and review text exist only in this QA file and in-memory render fixtures; no customer reviews or defaults are added to the theme.',
  'The production reviews section is display-only. No review form, collector or submission control remains.',
  'Third-party app rendering uses an explicitly labelled placeholder; provider behavior and review-source integration are not tested.',
  'No browser, Shopify edit, preview rebuild, network request, order or contact submission occurred.'
] };
const baseProduct = { id: 101, title: 'QA product', url: '/products/qa-product', metafields: { reviews: {} } };
const review = (id, rating = 4, more = {}) => ({ id, type: 'review', settings: { approved: true, product: { id: 101 }, reviewer: 'QA display name', title: '', review: 'Synthetic QA review. Not customer feedback.', rating, ...more } });
function check(pass, label, fixture) { const row = { pass: Boolean(pass), label, fixture }; report.checks.push(row); if (!row.pass) report.issues.push(row); }
async function render(fixture, { blocks = [], product = baseProduct, form = {} } = {}) {
  const html = await engine.parseAndRender(adapted, { product, section: { id: 'qa-reviews', settings: { heading: 'Customer reviews' }, blocks }, form: { errors: null, ...form }, shop: { url: 'https://example.invalid' }, customer: {} });
  const dom = new JSDOM(html), doc = dom.window.document;
  const ids = [...doc.querySelectorAll('[id]')].map(n => n.id);
  check(ids.length === new Set(ids).size, 'Unique IDs', fixture);
  check(!doc.querySelector('form,input,select,textarea,button[type=submit]') && !/write a review|submit review|share your experience/i.test(doc.body.textContent), 'Reviews remain display-only with no form or submission CTA', fixture);
  return { dom, doc, text: doc.body.textContent.replace(/\s+/g, ' ').trim() };
}
(async () => {
  let r = await render('empty');
  check(r.text.includes('No reviews yet') && !r.doc.querySelector('.sj-review-card') && !r.doc.querySelector('.sj-rating-summary__star'), 'Empty production state has no invented reviews or rating', 'empty');
  check(r.doc.querySelector('#ProductReviews-101') && r.doc.querySelector('.sj-rating-summary').getAttribute('href') === '#ProductReviews-101', 'Summary targets exact product review section', 'empty');
  r.dom.window.close();

  r = await render('approved-match', { blocks: [review('one', 4), review('two', 2)] });
  check(r.doc.querySelectorAll('.sj-review-card').length === 2 && !r.text.includes('No reviews yet'), 'Approved product-matched review blocks become visible', 'approved-match');
  check(r.doc.querySelector('.sj-rating-summary strong')?.textContent === '3' && r.doc.querySelector('.sj-rating-summary__count')?.textContent.includes('2 reviews'), 'Manual fallback aggregate is calculated from approved reviews only', 'approved-match');
  r.dom.window.close();

  r = await render('moderation-gates', { blocks: [review('not-approved', 5, { approved: false }), review('wrong-product', 5, { product: { id: 202 } }), review('no-product', 5, { product: null }), review('no-name', 4, { reviewer: '' }), review('no-text', 4, { review: '' }), review('bad-rating', 6)] });
  check(!r.doc.querySelector('.sj-review-card') && r.text.includes('No reviews yet') && !r.text.includes('Synthetic QA'), 'Unapproved, wrong/absent product, incomplete and invalid blocks stay hidden', 'moderation-gates');
  r.dom.window.close();

  const native = { ...baseProduct, metafields: { reviews: { rating: { value: { rating: 4.8, scale_max: 5 } }, rating_count: { value: 12 } } } };
  r = await render('native-priority', { product: native, blocks: [review('manual', 2)] });
  check(r.doc.querySelector('.sj-rating-summary strong')?.textContent === '4.8' && r.doc.querySelector('.sj-rating-summary__count')?.textContent.includes('12 reviews'), 'Real native rating/count override local review-block aggregate', 'native-priority');
  r.dom.window.close();
  r = await render('native-count-only', { product: { ...baseProduct, metafields: { reviews: { rating_count: { value: 7 } } } }, blocks: [review('manual', 2)] });
  check(r.doc.querySelector('.sj-rating-summary').textContent.includes('7 customer reviews') && !r.doc.querySelector('.sj-rating-summary strong'), 'Native count without rating does not fabricate an average', 'native-count-only');
  r.dom.window.close();

  r = await render('app-provider', { blocks: [{ id: 'provider', type: '@app', settings: {} }] });
  check(r.doc.querySelector('[data-qa-app-provider]') && !r.text.includes('No reviews yet'), 'App blocks render without a conflicting empty-review claim', 'app-provider');
  r.dom.window.close();

  r = await render('native-data-without-text', { product: native });
  check(!r.text.includes('No reviews yet') && !r.doc.querySelector('.sj-review-card'), 'Native rating does not falsely claim empty reviews or invent review text', 'native-data-without-text');
  r.dom.window.close();
  r = await render('escaped-customer-content', { blocks: [review('escape', 4, { reviewer: '<img src=x onerror=alert(1)>', review: '<script>alert(1)</script> Synthetic QA.' })] });
  check(!r.doc.querySelector('script,img') && r.text.includes('<script>alert(1)</script>'), 'Customer display names and review text are escaped', 'escaped-customer-content');
  r.dom.window.close();

  const template = JSON.parse(fs.readFileSync(path.join(root, 'theme/templates/product.json'), 'utf8'));
  check(template.order.indexOf('reviews') > template.order.indexOf('main') && template.order.indexOf('reviews') < template.order.indexOf('recommendations') && !template.sections.reviews.blocks, 'Empty reviews section sits after product and before recommendations', 'source');
  check(schema.blocks.some(b => b.type === '@app') && schema.blocks.find(b => b.type === 'review').settings.some(s => s.id === 'product' && s.type === 'product') && schema.blocks.find(b => b.type === 'review').settings.find(s => s.id === 'approved').default === false, 'Schema supports apps and exact-product review blocks defaulting unapproved', 'source');
  check(!source.includes("{% form 'contact'") && !source.includes('contact[') && !/verified buyer|write a review|submit review/i.test(source), 'Contact review form and fabricated verification claims absent', 'source');
  check(!fs.readFileSync(path.join(root, 'theme/assets/sj-reviews.css'), 'utf8').includes('.sj-review-form'), 'Unused review form styling removed', 'source');
  check(fs.readFileSync(path.join(root, 'theme/sections/sj-product.liquid'), 'utf8').includes("{% render 'sj-rating-summary', product: product %}"), 'Purchase area keeps native rating summary', 'source');
  report.summary = { status: report.issues.length ? 'FAIL' : 'PASS', checks: report.checks.length, passed: report.checks.filter(c => c.pass).length, failures: report.issues.length };
  fs.writeFileSync(path.join(__dirname, 'PRODUCT-REVIEWS-STATIC-QA.json'), JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(path.join(__dirname, 'PRODUCT-REVIEWS-STATIC-QA.md'), ['# Product reviews static QA — ' + report.summary.status, '', `${report.summary.passed}/${report.summary.checks} checks passed.`, '', 'Coverage: empty state, approved product-matched reviews, unapproved/wrong-product/incomplete blocks, native rating priority, count-only data, app blocks, escaped customer content, display-only controls, product identity and template placement.', '', ...report.boundaries.map(s => '- ' + s), '', ...(report.issues.length ? report.issues.map(s => '- ' + s.fixture + ': ' + s.label) : ['No static failures.']), '', 'No customer reviews were invented or shipped. Pending owner-provided reviews remain absent until supplied and approved.'].join('\n') + '\n');
  console.log(JSON.stringify(report.summary, null, 2));
  if (report.issues.length) { console.log(report.issues); process.exitCode = 1; }
})().catch(error => { console.error(error); process.exitCode = 1; });
