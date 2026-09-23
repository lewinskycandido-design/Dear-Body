import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { Liquid } from 'liquidjs';
import { JSDOM } from 'jsdom';
import * as shopifyParser from '@shopify/liquid-html-parser';

const previewRoot = path.dirname(fileURLToPath(import.meta.url));
const themeRoot = path.resolve(previewRoot, '../dearbody');
const publicRoot = path.join(previewRoot, 'public');
const assetRoot = path.join(themeRoot, 'assets');
const engine = new Liquid({
  root: [path.join(themeRoot, 'snippets'), path.join(themeRoot, 'sections')],
  extname: '.liquid',
  strictFilters: true,
  strictVariables: false,
  jsTruthy: false,
  fs: {
    exists: async (filename) => { try { await fs.access(filename); return true; } catch { return false; } },
    existsSync: fsSync.existsSync,
    readFile: async (filename) => preprocessShopifyBlocks(await fs.readFile(filename, 'utf8')),
    readFileSync: (filename) => preprocessShopifyBlocks(fsSync.readFileSync(filename, 'utf8')),
    resolve: (directory, filename, extension) => path.resolve(directory, path.extname(filename) ? filename : `${filename}${extension}`),
    dirname: path.dirname,
    sep: path.sep,
  },
});
const escape = (value = '') => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const keywordArgs = (args) => Object.fromEntries(args.filter((arg) => Array.isArray(arg) && arg.length === 2));
const mediaMetadata = new Map();
function image(src, alt, width = 900, height = 900) {
  const result = { src, url: src, alt, width, height, aspect_ratio: width / height };
  mediaMetadata.set(src, result);
  return result;
}
engine.registerFilter('asset_url', (filename) => `/assets/${filename}`);
engine.registerFilter('stylesheet_tag', (url) => `<link rel="stylesheet" href="${escape(url)}">`);
engine.registerFilter('image_url', (value) => typeof value === 'string' ? value : value?.src || value?.url || '');
engine.registerFilter('image_tag', (src, ...args) => {
  const attributes = keywordArgs(args);
  const metadata = mediaMetadata.get(src) || { width: 900, height: 900, alt: '' };
  delete attributes.widths;
  const final = { src, width: metadata.width, height: metadata.height, alt: metadata.alt, ...attributes };
  return `<img ${Object.entries(final).filter(([, value]) => value !== undefined && value !== null).map(([key, value]) => `${key}="${escape(value)}"`).join(' ')}>`;
});
engine.registerFilter('money_with_currency', (cents) => `₱${(Number(cents || 0) / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PHP`);
engine.registerFilter('money', (cents) => `₱${(Number(cents || 0) / 100).toFixed(2)}`);
engine.registerFilter('default_errors', () => '');
engine.registerFilter('default_pagination', () => '');
engine.registerFilter('metafield_tag', (field) => field?.value ? `<div>${escape(field.value)}</div>` : '');
engine.registerFilter('media_tag', (media) => {
  if (media.media_type === 'image') return `<img src="${escape(media.src)}" alt="${escape(media.alt)}">`;
  return '<p>Interactive Shopify media requires the Shopify runtime.</p>';
});
engine.registerFilter('payment_terms', () => '');
engine.registerFilter('json', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));

const catalog = [
  ['Mojito Metallique', 'mojito-metallique', 'women'],
  ['Amber Oud Silk', 'amber-oud-silk', 'women'],
  ['Mistened Narcissus', 'mistened-narcissus', 'women'],
  ['Oud Mirage', 'oud-mirage', 'men'],
  ['Charme Envoûtant', 'charme-envoutant', 'men'],
  ['Rtulle & Satin', 'rtulle-and-satin', 'men'],
];
// Category assignments follow the owner-approved source facts/gallery manifests.
const products = catalog.map(([title, handle, category], index) => {
  const featuredImage = image(`/assets/db-${handle}.jpg`, `${title} bottle and presentation canister`);
  const collectionImage = image('/assets/db-hero-desktop.jpg', 'Six DearBody fragrances displayed together in a sunlit home', 1774, 887);
  const media = [featuredImage, collectionImage].map((item, mediaIndex) => ({ ...item, id: (index + 1) * 100 + mediaIndex, media_type: 'image', preview_image: item }));
  const variant = { id: 1000 + index, title: 'Default Title', available: false, price: 0, compare_at_price: null, options: ['Default Title'], featured_media: media[0], featured_image: featuredImage };
  return {
    id: index + 1, title, handle, url: `/products/${handle}`, type: '', price: 0, tags: [category],
    price_varies: false, available: false, has_only_default_variant: true,
    options: ['Title'], variants: [variant], selected_or_first_available_variant: variant,
    featured_image: featuredImage, featured_media: media[0], media, images: [featuredImage, collectionImage],
    description: '<p>London-formulated fragrances, curated for the way you live. Begin your own scent journey with Dear Body.</p>',
    metafields: { custom: {} },
  };
});
const allProducts = Object.fromEntries(products.map((product) => [product.handle, product]));
const collection = { title: 'All fragrances', handle: 'all', description: '', products, products_count: products.length, all_products_count: products.length, url: '/collections/all' };
const categoryCollections = [
  { title: 'For Her', handle: 'womens-perfume', tag: 'women' },
  { title: 'For Him', handle: 'mens-perfume', tag: 'men' },
].map(({ title, handle, tag }) => {
  const categoryProducts = products.filter((product) => product.tags.includes(tag));
  return { title, handle, url: `/collections/${handle}`, description: '', products: categoryProducts, products_count: categoryProducts.length, all_products_count: categoryProducts.length };
});
// Shopify's collections drop supports iteration and lookup by handle. Give the
// local Liquid adapter both capabilities without substituting navigation HTML.
const collections = Object.assign([collection, ...categoryCollections], {
  all: collection, 'all-fragrances': collection,
  ...Object.fromEntries(categoryCollections.map((item) => [item.handle, item])),
});
const emptyCart = { item_count: 0, items: [], total_price: 0, cart_level_discount_applications: [] };
const mockCart = {
  item_count: 1, total_price: 0, cart_level_discount_applications: [],
  items: [{
    key: 'preview-unavailable-item', product: products[0], variant: products[0].variants[0],
    title: products[0].title, url: products[0].url, image: products[0].featured_image,
    quantity: 1, original_price: 0, final_price: 0, final_line_price: 0,
    url_to_remove: '/preview/empty-cart', properties: [],
  }],
};
const baseContext = {
  shop: { name: 'Dear Body Philippines', currency: 'PHP', policies: [], shipping_policy: null, refund_policy: null, privacy_policy: null },
  routes: { root_url: '/', all_products_collection_url: '/collections/all', cart_url: '/cart', cart_add_url: '/cart/add', search_url: '/search' },
  request: { locale: { iso_code: 'en' }, design_mode: false },
  settings: {}, cart: emptyCart, all_products: allProducts,
  collections, collection,
  form: { 'posted_successfully?': false, errors: null, name: '', email: '', body: '' },
  paginate: { pages: 1, current_page: 1 },
  content_for_header: '', page_description: '',
};
const fallbackTemplates = {
  index: ['db-hero', 'db-priority-collection', 'db-editorial', 'db-story', 'db-newsletter'],
  collection: ['db-main-collection'], product: ['db-main-product'], cart: ['db-main-cart'],
  'page.our-story': ['db-main-story'], 'page.contact': ['db-main-contact'],
  page: ['db-main-page'],
  '404': ['db-404'],
};
const fallbackUsed = [];
const schemaRegex = /{%[-\s]*schema\s*[-]?%}([\s\S]*?){%[-\s]*endschema\s*[-]?%}/;
function schemaFrom(source) { const match = source.match(schemaRegex); return match ? JSON.parse(match[1]) : { settings: [] }; }
const defaultsFor = (settings = []) => Object.fromEntries(settings.filter((item) => item.id && item.default !== undefined).map((item) => [item.id, item.default]));

// Shopify-only form/section/paginate tags are translated around unchanged section
// markup. Liquid expressions, conditionals, loops, and snippet renders use LiquidJS.
function formOpening(argumentsText) {
  const type = argumentsText.match(/^\s*['"]([^'"]+)['"]/)?.[1] || 'unknown';
  const attributes = [];
  for (const match of argumentsText.matchAll(/(?:^|,)\s*(id|class):\s*('[^']*'|"[^"]*"|[\w.-]+)/g)) {
    const [, name, value] = match;
    attributes.push(`${name}="{{ ${value} | escape }}"`);
  }
  const action = type === 'product' ? '/cart/add' : '/contact';
  return `<form action="${action}" method="post" data-db-preview-form="${escape(type)}" ${attributes.join(' ')}><input type="hidden" name="form_type" value="${escape(type)}">`;
}
function preprocessShopifyBlocks(source) {
  return source.replace(schemaRegex, '')
    .replace(/{%[-\s]*form\s+([\s\S]*?)\s*[-]?%}/g, (_, argumentsText) => formOpening(argumentsText))
    .replace(/{%[-\s]*endform\s*[-]?%}/g, '</form>')
    .replace(/{%[-\s]*paginate\s+[\s\S]*?%}/g, '')
    .replace(/{%[-\s]*endpaginate\s*[-]?%}/g, '');
}
async function preprocess(source, context) {
  source = preprocessShopifyBlocks(source);
  for (const match of [...source.matchAll(/{%[-\s]*(sections|section)\s+['"]([^'"]+)['"]\s*[-]?%}/g)]) {
    const rendered = match[1] === 'sections'
      ? await renderGroup(match[2], context)
      : await renderSection(match[2], { type: match[2], settings: {} }, context);
    source = source.replace(match[0], rendered);
  }
  return source;
}
async function renderSection(id, config, context) {
  const source = await fs.readFile(path.join(themeRoot, 'sections', `${config.type}.liquid`), 'utf8');
  const schema = schemaFrom(source);
  const rawBlocks = config.blocks || Object.fromEntries((schema.presets?.[0]?.blocks || []).map((block, index) => [`default-${index}`, block]));
  const blocks = (config.block_order || Object.keys(rawBlocks)).map((blockId) => {
    const block = rawBlocks[blockId];
    const blockSchema = schema.blocks?.find((item) => item.type === block.type);
    return { id: blockId, type: block.type, settings: { ...defaultsFor(blockSchema?.settings), ...block.settings }, shopify_attributes: '' };
  });
  const section = { id, settings: { ...defaultsFor(schema.settings), ...config.settings }, blocks };
  const scoped = { ...context, section };
  const rendered = await engine.parseAndRender(await preprocess(source, scoped), scoped);
  return `<div id="shopify-section-${escape(id)}" class="shopify-section">${rendered}</div>`;
}
async function renderGroup(name, context) {
  const group = JSON.parse(await fs.readFile(path.join(themeRoot, 'sections', `${name}.json`), 'utf8'));
  const output = [];
  for (const id of group.order) output.push(await renderSection(`${name}-${id}`, group.sections[id], context));
  return output.join('\n');
}
async function templateConfig(name) {
  try { return JSON.parse(await fs.readFile(path.join(themeRoot, 'templates', `${name}.json`), 'utf8')); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    fallbackUsed.push(name);
    const sections = Object.fromEntries(fallbackTemplates[name].map((type, index) => [`preview-${index}`, { type, settings: {} }]));
    return { sections, order: Object.keys(sections) };
  }
}
const previewBanner = `<aside class="db-preview-notice" aria-label="Local preview notice"><strong>LOCAL THEME PREVIEW</strong><span>Mock catalog; prices and availability are unconfirmed. No orders, messages or subscriptions are sent.</span><nav aria-label="Preview pages"><a href="/">Home</a><a href="/collections/womens-perfume">For Her</a><a href="/collections/mens-perfume">For Him</a><a href="/products/mojito-metallique">Product</a><a href="/cart">Cart</a><a href="/preview/empty-cart">Empty cart</a><a href="/pages/our-story">Story</a><a href="/pages/contact">Contact</a></nav></aside>`;
const previewStyle = `<style>.db-preview-notice{position:relative;z-index:100;background:#fff5e5;color:#5c0006;padding:10px 20px;font:12px/1.5 Arial,sans-serif;border-bottom:1px solid #5c0006;display:flex;gap:6px 16px;flex-wrap:wrap}.db-preview-notice span{flex:1 1 300px}.db-preview-notice nav{display:flex;gap:12px;flex-wrap:wrap}.db-preview-notice a{color:inherit;text-decoration:underline}.db-preview-feedback{position:fixed;bottom:16px;left:16px;right:16px;z-index:1000;background:#5c0006;color:#f4e3cb;padding:16px;font:16px/1.5 Arial,sans-serif;box-shadow:0 4px 24px #0003}.db-preview-feedback button{float:right;background:#f4e3cb;color:#5c0006;border:0;padding:8px;cursor:pointer}</style>`;
const previewScript = `<script>document.addEventListener('submit',function(event){event.preventDefault();event.stopImmediatePropagation();var old=document.querySelector('.db-preview-feedback');if(old)old.remove();var box=document.createElement('div');box.className='db-preview-feedback';box.setAttribute('role','status');var close=document.createElement('button');close.type='button';close.textContent='Dismiss';close.onclick=function(){box.remove()};box.append(close,document.createTextNode('Preview only. No order, message or subscription was sent. Shopify handles this form in the installed theme.'));document.body.append(box);},true);</script>`;

async function renderPage(templateName, route, extraContext = {}) {
  const context = { ...baseContext, request: { ...baseContext.request, path: route }, canonical_url: `http://localhost:4173${route}`, page_title: 'Dear Body Philippines', template: { name: templateName.split('.')[0] }, ...extraContext };
  const config = await templateConfig(templateName);
  const sections = [];
  for (const id of config.order) {
    if (!config.sections[id].disabled) sections.push(await renderSection(id, config.sections[id], context));
  }
  context.content_for_layout = sections.join('\n');
  const layout = await fs.readFile(path.join(themeRoot, 'layout/theme.liquid'), 'utf8');
  let result = await engine.parseAndRender(await preprocess(layout, context), context);
  result = result.replace('</head>', `${previewStyle}\n</head>`)
    .replace(/(<body[^>]*>)/, `$1${previewBanner}`)
    .replace('</body>', `${previewScript}</body>`);
  const destination = path.join(publicRoot, route.replace(/^\//, ''), 'index.html');
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, result);
  return { route, template: templateName, file: path.relative(previewRoot, destination) };
}
async function filesWithin(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => entry.isDirectory() ? filesWithin(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
  return files.flat();
}
async function validateTheme() {
  const parse = shopifyParser.toLiquidHtmlAST || shopifyParser.default?.toLiquidHtmlAST;
  if (!parse) throw new Error('Official Shopify parser does not export toLiquidHtmlAST.');
  const results = [];
  for (const filename of await filesWithin(themeRoot)) {
    const relative = path.relative(themeRoot, filename);
    if (filename.endsWith('.liquid')) {
      const source = await fs.readFile(filename, 'utf8');
      parse(source, { mode: 'strict' });
      if (source.match(schemaRegex)) schemaFrom(source);
      results.push({ file: relative, validation: 'Shopify Liquid HTML parser: strict' });
    } else if (filename.endsWith('.json')) {
      JSON.parse(await fs.readFile(filename, 'utf8'));
      results.push({ file: relative, validation: 'JSON parse' });
    }
  }
  return results;
}
function inspectBanner(source, { label, title, variant, asset, width, height, contact = false }) {
  const document = new JSDOM(source).window.document;
  const banners = document.querySelectorAll('.db-page-banner');
  const headings = document.querySelectorAll('h1');
  const banner = banners[0];
  const heading = headings[0];
  const textOf = (element) => element?.textContent.replace(/\s+/g, ' ').trim();
  if (banners.length !== 1 || headings.length !== 1 || textOf(heading) !== title || !banner.contains(heading)) throw new Error(`${label}: expected one page banner containing the single H1 "${title}".`);
  if (!banner.classList.contains(`db-page-banner--${variant}`) || banner.getAttribute('aria-labelledby') !== heading.id) throw new Error(`${label}: wrong banner variant or accessible heading association.`);
  const photo = banner.querySelector('.db-page-banner__media img');
  if (!photo || photo.getAttribute('src') !== `/assets/${asset}` || Number(photo.getAttribute('width')) !== width || Number(photo.getAttribute('height')) !== height || !photo.getAttribute('alt')) throw new Error(`${label}: banner image source, intrinsic dimensions or alternative text is incorrect.`);
  const breadcrumbs = document.querySelectorAll('nav[aria-label="Breadcrumb"]');
  if (breadcrumbs.length !== 1 || !banner.contains(breadcrumbs[0]) || breadcrumbs[0].querySelector('a')?.getAttribute('href') !== '/') throw new Error(`${label}: expected a single Home breadcrumb in the banner.`);
  if (contact) {
    const form = document.querySelector('.db-contact form[action="/contact"][method="post"]');
    if (!form || !['contact[name]', 'contact[email]', 'contact[body]'].every((name) => form.querySelector(`[name="${name}"]`)) || !form.querySelector('button[type="submit"]')) throw new Error(`${label}: native contact form controls were lost.`);
  }
  return document;
}
async function verifyPageBanners() {
  const cases = [
    { route: '/collections/womens-perfume', title: 'For Her', variant: 'her', asset: 'db-lifestyle-for-her.jpg', width: 1200, height: 1200 },
    { route: '/collections/mens-perfume', title: 'For Him', variant: 'him', asset: 'db-lifestyle-for-him.jpg', width: 1200, height: 1200 },
    { route: '/collections/all', title: 'All fragrances', variant: 'collection', asset: 'db-lifestyle-collection.jpg', width: 1086, height: 1448 },
    ...['/pages/our-story', '/preview/generic-story'].map((route) => ({ route, title: 'FROM LONDON, WITH FEELING.', variant: 'story', asset: 'db-banner-story.jpg', width: 1536, height: 1024 })),
    ...['/pages/contact', '/preview/generic-contact'].map((route) => ({ route, title: "LET'S TALK.", variant: 'contact', asset: 'db-banner-contact.jpg', width: 1536, height: 1024, contact: true })),
  ];
  for (const item of cases) {
    await fs.access(path.join(assetRoot, item.asset));
    inspectBanner(await fs.readFile(path.join(publicRoot, item.route, 'index.html'), 'utf8'), { ...item, label: item.route });
  }
  const checks = cases.map(({ route }) => `${route}: single accessible banner/H1, correct image and one Home breadcrumb${route.includes('contact') ? ', native contact form retained' : ''}`);
  // Exercise merchant content and collection-picker behavior independently of the fixture routes.
  const merchantImage = image('/assets/merchant-banner.jpg', 'Merchant collection photograph', 1600, 900);
  const sectionImage = image('/assets/section-banner.jpg', 'Merchant section photograph', 1200, 800);
  const customCollection = { ...collection, handle: 'my-womens-collection', title: 'Custom collection', image: merchantImage, products: [], products_count: 0, description: '<p>Merchant collection description.</p>' };
  const pickedContext = { ...baseContext, collection: customCollection, settings: { ...baseContext.settings, for_her_collection: customCollection } };
  const customSection = await renderSection('banner-check', { type: 'db-main-collection', settings: {} }, pickedContext);
  const customDocument = inspectBanner(customSection, { label: 'Selected category collection', title: 'For Her', variant: 'her', asset: 'merchant-banner.jpg', width: 1600, height: 900 });
  if (!customDocument.querySelector('.db-empty') || !customDocument.querySelector('.db-collection-description')?.textContent.includes('Merchant collection description.')) throw new Error('Category banner discarded the merchant collection description or empty-catalog state.');
  checks.push('Merchant category picker, collection image, description and empty-catalog state retained');
  const override = await renderSection('banner-check', { type: 'db-main-collection', settings: { banner_image: sectionImage, banner_heading: 'Your <signature>\nscent' } }, pickedContext);
  const overrideDocument = inspectBanner(override, { label: 'Collection section overrides', title: 'Your <signature> scent', variant: 'her', asset: 'section-banner.jpg', width: 1200, height: 800 });
  if (overrideDocument.querySelector('h1 signature') || !overrideDocument.querySelector('h1 br')) throw new Error('Banner heading override must remain escaped text with an intentional line break.');
  checks.push('Merchant heading override stays escaped; section image overrides collection image');
  const genericOverride = await renderSection('banner-check', { type: 'db-main-page', settings: { banner_heading: 'Say hello', banner_image: sectionImage } }, { ...baseContext, page: { handle: 'contact', content: '' } });
  inspectBanner(genericOverride, { label: 'Generic contact overrides', title: 'Say hello', variant: 'contact', asset: 'section-banner.jpg', width: 1200, height: 800, contact: true });
  checks.push('Generic contact page honors heading/image settings and retains its contact form');
  return checks;
}
async function build() {
  const validation = await validateTheme();
  const settingsData = JSON.parse(await fs.readFile(path.join(themeRoot, 'config/settings_data.json'), 'utf8'));
  baseContext.settings = settingsData.current || {};
  // Shopify resolves collection picker handles to CollectionDrop objects.
  for (const key of ['for_her_collection', 'for_him_collection']) {
    const handle = baseContext.settings[key];
    if (typeof handle === 'string') baseContext.settings[key] = baseContext.collections[handle] || null;
  }
  await fs.mkdir(publicRoot, { recursive: true });
  const routes = [];
  routes.push(await renderPage('index', '/'));
  routes.push(await renderPage('collection', '/collections/all', { page_title: collection.title }));
  for (const category of categoryCollections) routes.push(await renderPage('collection', category.url, { collection: category, page_title: category.title }));
  for (const product of products) routes.push(await renderPage('product', product.url, { product, page_title: product.title }));
  routes.push(await renderPage('cart', '/cart', { cart: mockCart, page_title: 'Your bag' }));
  routes.push(await renderPage('cart', '/preview/empty-cart', { cart: emptyCart, page_title: 'Your bag' }));
  routes.push(await renderPage('page.our-story', '/pages/our-story', { page: { title: 'Our story', handle: 'our-story', content: '' }, page_title: 'Our story' }));
  routes.push(await renderPage('page.contact', '/pages/contact', { page: { title: 'Contact', handle: 'contact', content: '' }, page_title: 'Contact' }));
  routes.push(await renderPage('page', '/preview/generic-contact', { page: { title: 'Contact', handle: 'contact', content: '' }, page_title: 'Contact — generic page template' }));
  routes.push(await renderPage('page', '/preview/generic-story', { page: { title: 'Our story', handle: 'our-story', content: '' }, page_title: 'Our story — generic page template' }));
  const pageBannerChecks = await verifyPageBanners();
  const report = {
    generatedAt: new Date().toISOString(), themeRoot, routes, validation,
    fallbackTemplates: [...new Set(fallbackUsed)],
    genericPageChecks: ['contact handle renders shared contact H1 and form', 'our-story handle renders shared story H1'],
    pageBannerChecks,
    gaps: ['Mock catalog is not Shopify admin data; all six products have price 0 and availability false.', 'Shopify-only form, section/group, and single-page pagination behavior is emulated around the actual Liquid markup.', 'Image CDN resizing/srcset and Shopify media players are not emulated.', 'No checkout, payment, email, customer session, inventory or theme-editor behavior is tested.', 'Official parser validates syntax, not complete Shopify theme-store requirements or runtime semantics.'],
  };
  await fs.writeFile(path.join(publicRoot, 'preview-report.json'), JSON.stringify(report, null, 2));
  console.log(`Validated ${validation.length} theme files; rendered ${routes.length} routes.`);
  console.log(`Passed ${pageBannerChecks.length} page-banner checks.`);
  if (fallbackUsed.length) console.log(`Templates not yet present; schema-derived preview fallback used: ${[...new Set(fallbackUsed)].join(', ')}`);
  console.log(`Preview output: ${publicRoot}`);
  return report;
}

const mimeTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2' };
function serve() {
  const port = Number(process.env.PORT || 4173);
  http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const isAsset = pathname.startsWith('/assets/');
      const root = isAsset ? assetRoot : publicRoot;
      const relative = isAsset ? pathname.slice('/assets/'.length) : pathname.slice(1);
      let filename = path.resolve(root, relative);
      if (!filename.startsWith(`${root}${path.sep}`) && filename !== root) { response.writeHead(403); return response.end('Forbidden'); }
      if (request.method !== 'GET' && request.method !== 'HEAD') { response.writeHead(405); return response.end('Local preview does not submit forms.'); }
      const stat = await fs.stat(filename);
      if (stat.isDirectory()) filename = path.join(filename, 'index.html');
      const contents = await fs.readFile(filename);
      response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : contents);
    } catch (error) { response.writeHead(error.code === 'ENOENT' ? 404 : 500); response.end(error.code === 'ENOENT' ? 'Preview page not found' : 'Preview server error'); }
  }).listen(port, '127.0.0.1', () => console.log(`Local preview server: http://127.0.0.1:${port}`));
}
await build();
if (process.argv.includes('--serve')) serve();
