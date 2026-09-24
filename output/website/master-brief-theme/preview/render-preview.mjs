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
const previewPort = Number(process.env.PORT || 4186);
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
engine.registerFilter('item_count_for_variant',(cart,id)=>(cart?.items||[]).filter(x=>String(x.variant_id||x.variant?.id)===String(id)).reduce((sum,x)=>sum+x.quantity,0));
engine.registerFilter('payment_button', () => '<div class="shopify-payment-button"><button type="button" disabled class="db-button">Buy now — Shopify preview required</button></div>');
engine.registerFilter('structured_data', (product) => JSON.stringify({'@context':'https://schema.org','@type':'Product',name:product.title}));
engine.registerFilter('highlight', (text) => escape(text));
engine.registerFilter('within', (url) => url);
engine.registerFilter('pluralize', (count,one,many) => count === 1 ? one : many);
engine.registerFilter('metafield_text', (field) => field?.value || '');
engine.registerFilter('json', (value) => JSON.stringify(value ?? null).replace(/</g, '\\u003c'));

const approvedCopy = JSON.parse(await fs.readFile(path.resolve(previewRoot, '../approved-product-copy.json'), 'utf8'));
const catalog = [
  ['Mojito Metallique', 'mojito-metallique', 'women'],
  ['Amber Oud Silk', 'amber-oud-silk', 'women'],
  ['Mistened Narcissus', 'mistened-narcissus', 'women'],
  ['Oud Mirage', 'oud-mirage', 'men'],
  ['Charme Envoûtant', 'charme-envoutant', 'men'],
  ['Rtulle & Satin', 'rtulle-satin', 'men'],
];
// Category assignments follow the owner-approved source facts/gallery manifests.
// Owner-approved selling price. Availability remains false until inventory is confirmed.
const priorityPrice = 79900;
const products = catalog.map(([title, handle, category], index) => {
  const photoHandle = handle === 'rtulle-satin' ? 'rtulle-and-satin' : handle;
  const featuredImage = image(`/assets/db-${photoHandle}.jpg`, `${title} bottle and presentation canister`);
  const collectionImage = image('/assets/db-hero-desktop.jpg', 'Six DearBody fragrances displayed together in a sunlit home', 1774, 887);
  const media = [featuredImage, collectionImage].map((item, mediaIndex) => ({ ...item, id: (index + 1) * 100 + mediaIndex, media_type: 'image', preview_image: item }));
  const copy = approvedCopy.find(row => row.handle === handle);
  const fields = Object.fromEntries(Object.entries(copy?.metafields || {}).map(([key,value]) => [key.replace('custom.', ''), { value, type: key.includes('bullet') || key.endsWith('scent_description') ? 'multi_line_text_field' : 'single_line_text_field' }]));
  const variant = { id: 1000 + index, title: 'Default Title', available: false, price: priorityPrice, compare_at_price: null, options: ['Default Title'], featured_media: media[0], featured_image: featuredImage };
  return {
    id: index + 1, title, handle, url: `/products/${handle}`, type: '', price: priorityPrice, tags: [category],
    price_varies: false, available: false, has_only_default_variant: true,
    options: ['Title'], variants: [variant], selected_or_first_available_variant: variant,
    featured_image: featuredImage, featured_media: media[0], media, images: [featuredImage, collectionImage],
    description: '',
    metafields: { custom: fields },
  };
});
const allProducts = Object.fromEntries(products.map((product) => [product.handle, product]));
const collection = { sort_options: [{value:'manual',name:'Featured'},{value:'price-ascending',name:'Price: low to high'},{value:'price-descending',name:'Price: high to low'},{value:'title-ascending',name:'Alphabetically, A–Z'}], default_sort_by: 'manual', title: 'All fragrances', handle: 'all', description: '', products, products_count: products.length, all_products_count: products.length, url: '/collections/all' };
const categoryCollections = [
  { title: 'For Her', handle: 'womens-perfume', tag: 'women' },
  { title: 'For Him', handle: 'mens-perfume', tag: 'men' },
].map(({ title, handle, tag }) => {
  const categoryProducts = products.filter((product) => product.tags.includes(tag));
  return { sort_options: collection.sort_options, default_sort_by: 'manual', title, handle, url: `/collections/${handle}`, description: '', products: categoryProducts, products_count: categoryProducts.length, all_products_count: categoryProducts.length };
});
// Shopify's collections drop supports iteration and lookup by handle. Give the
// local Liquid adapter both capabilities without substituting navigation HTML.
const collections = Object.assign([collection, ...categoryCollections], {
  all: collection, 'all-fragrances': collection,
  ...Object.fromEntries(categoryCollections.map((item) => [item.handle, item])),
});
const emptyCart = { item_count: 0, items: [], total_price: 0, cart_level_discount_applications: [] };
const mockCart = {
  item_count: 1, total_price: priorityPrice, cart_level_discount_applications: [],
  items: [{
    key: 'preview-unavailable-item', product: products[0], variant: products[0].variants[0],
    title: products[0].title, url: products[0].url, image: products[0].featured_image,
    quantity: 1, original_price: priorityPrice, final_price: priorityPrice, final_line_price: priorityPrice,
    url_to_remove: '/preview/empty-cart', properties: [],
  }],
};
const baseContext = {
  shop: { name: 'Dear Body Philippines', currency: 'PHP', policies: [], shipping_policy: null, refund_policy: null, privacy_policy: null, customer_accounts_enabled: true },
  routes: { root_url: '/', all_products_collection_url: '/collections/all', cart_url: '/cart', cart_add_url: '/cart/add', search_url: '/search', predictive_search_url: '/search/suggest', product_recommendations_url: '/recommendations/products', account_url: '/account' },
  request: { locale: { iso_code: 'en' }, design_mode: false },
  settings: {}, cart: emptyCart, all_products: allProducts,
  collections, collection,
  form: { 'posted_successfully?': false, errors: null, name: '', email: '', body: '' },
  paginate: { pages: 1, current_page: 1 }, recommendations: {performed:false,products:[],products_count:0}, search: {performed:true,terms:'',results:products,results_count:products.length},
  content_for_header: '', page_description: '',
};
const fallbackTemplates = {
  index: ['db-hero', 'db-lifestyle-scenes', 'db-story', 'db-newsletter'],
  collection: ['db-main-collection'], product: ['db-main-product'], cart: ['db-main-cart'],
  'page.our-story': ['db-main-story'], 'page.contact': ['db-main-contact'],
  page: ['db-main-page'],
  '404': ['db-404'],
};
const fallbackUsed = [];
const schemaRegex = /{%[-\s]*schema\s*[-]?%}([\s\S]*?){%[-\s]*endschema\s*[-]?%}/;
function schemaFrom(source) { const match = source.match(schemaRegex); return match ? JSON.parse(match[1]) : { settings: [] }; }
const defaultsFor = (settings = []) => Object.fromEntries(settings.filter((item) => item.id && item.default !== undefined).map((item) => [item.id, item.default]));


function resolvePickerSettings(schemaSettings, values, context) {
  const resolved = { ...defaultsFor(schemaSettings), ...values };
  for (const item of schemaSettings || []) {
    const value = resolved[item.id];
    if (typeof value !== 'string') continue;
    if (item.type === 'product') resolved[item.id] = context.all_products[value] || null;
    if (item.type === 'collection') resolved[item.id] = context.collections[value] || null;
    if (item.type === 'page') resolved[item.id] = {url:'/pages/'+value};
  }
  return resolved;
}

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
      : await renderSection(match[2], context.settings.sections?.[match[2]] || { type: match[2], settings: {} }, context);
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
    return { id: blockId, type: block.type, settings: resolvePickerSettings(blockSchema?.settings, block.settings, context), shopify_attributes: '' };
  });
  const section = { id, settings: resolvePickerSettings(schema.settings, config.settings, context), blocks };
  const scoped = { ...context, section };
  const rendered = await engine.parseAndRender(await preprocess(source, scoped), scoped, {globals:scoped});
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
const previewBanner = `<aside class="db-preview-notice" aria-label="Local preview notice"><strong>DESIGN PREVIEW</strong><span>Official logo & webfonts pending · Saved catalog fixture, sold out · No orders are sent</span><nav aria-label="Preview pages"><a href="/">Home</a><a href="/pages/scent-finder">Scent Finder</a><a href="/products/mojito-metallique">Product</a><a href="/cart">Bag</a></nav></aside>`;
const previewStyle = `<style>.db-preview-notice{position:relative;z-index:100;background:#f4e3cb;color:#5c0006;padding:10px 20px;font:12px/1.5 Arial,sans-serif;border-bottom:1px solid #5c0006;display:flex;gap:6px 16px;flex-wrap:wrap}.db-preview-notice span{flex:1 1 300px}.db-preview-notice nav{display:flex;gap:12px;flex-wrap:wrap}.db-preview-notice a{color:inherit;text-decoration:underline}.db-preview-feedback{position:fixed;bottom:16px;left:16px;right:16px;z-index:1000;background:#5c0006;color:#f4e3cb;padding:16px;font:16px/1.5 Arial,sans-serif;border:2px solid #e9a250}.db-preview-feedback button{float:right;background:#f4e3cb;color:#5c0006;border:0;padding:8px;cursor:pointer}</style>`;
const previewScript = `<script>document.addEventListener('submit',function(event){event.preventDefault();event.stopImmediatePropagation();var old=document.querySelector('.db-preview-feedback');if(old)old.remove();var box=document.createElement('div');box.className='db-preview-feedback';box.setAttribute('role','status');var close=document.createElement('button');close.type='button';close.textContent='Dismiss';close.onclick=function(){box.remove()};box.append(close,document.createTextNode('Preview only. No order, message or subscription was sent. Shopify handles this form in the installed theme.'));document.body.append(box);},true);</script>`;

async function renderPage(templateName, route, extraContext = {}) {
  const context = { ...baseContext, request: { ...baseContext.request, path: route }, canonical_url: `http://127.0.0.1:${previewPort}${route}`, page_title: 'Dear Body Philippines', template: { name: templateName.split('.')[0] }, ...extraContext };
  const config = await templateConfig(templateName);
  const sections = [];
  for (const id of config.order) {
    if (!config.sections[id].disabled) sections.push(await renderSection(id, config.sections[id], context));
  }
  context.content_for_layout = sections.join('\n');
  const layout = await fs.readFile(path.join(themeRoot, 'layout/theme.liquid'), 'utf8');
  let result = await engine.parseAndRender(await preprocess(layout, context), context, {globals:context});
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
async function verifyMasterPages(routes) {
 const checks=[];
 for(const route of routes){
  const file=path.join(previewRoot,route.file);const document=new JSDOM(await fs.readFile(file,'utf8')).window.document;
  if(document.querySelectorAll('h1').length!==1) throw new Error(route.route+': must have one H1');
  for(const image of document.querySelectorAll('img[src^="/assets/"]'))await fs.access(path.join(assetRoot,image.getAttribute('src').slice(8)));
  for(const link of document.querySelectorAll('link[rel="stylesheet"][href^="/assets/"],script[src^="/assets/"]'))await fs.access(path.join(assetRoot,(link.getAttribute('src')||link.getAttribute('href')).slice(8)));
  if(document.querySelector('img[src*="db-logo-burgundy"],img[src*="db-logo-secondary"]'))throw new Error('Recreated logo must not ship');
  const ids=[...document.querySelectorAll('[id]')].map(x=>x.id);if(new Set(ids).size!==ids.length)throw new Error(route.route+': duplicate IDs');
  checks.push(route.route+': one H1, unique IDs, local assets resolve');
 }
 const doc=new JSDOM(await fs.readFile(path.join(publicRoot,'index.html'),'utf8')).window.document;
 if(doc.querySelectorAll('.db-priority .db-card').length!==6)throw new Error('Launch six missing');
 if(!doc.querySelector('h1').textContent.includes('SCENT JOURNEY.'))throw new Error('Master hero wrong');
 const nav=[...doc.querySelectorAll('.db-desktop-nav a')].map(x=>x.textContent.trim()).join('|');if(nav!=='Women|Men|Scent Finder|Our Story')throw new Error('Master navigation wrong: '+nav);
 checks.push('Six launch products appear before brand/discovery merchandising; exact four-link navigation; master hero copy');
 return checks;
}
async function build() {
  const validation = await validateTheme();
  const settingsData = JSON.parse(await fs.readFile(path.join(themeRoot, 'config/settings_data.json'), 'utf8'));
  const schema=JSON.parse(await fs.readFile(path.join(themeRoot,'config/settings_schema.json'),'utf8'));
  baseContext.settings = {...Object.assign({},...schema.map(g=>defaultsFor(g.settings))),...settingsData.current};
  for(const key of ['scent_finder_page','story_page']){if(typeof baseContext.settings[key]==='string')baseContext.settings[key]={url:'/pages/'+baseContext.settings[key]};}
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
  routes.push(await renderPage('page.scent-finder','/pages/scent-finder',{page:{title:'Scent Finder',handle:'scent-finder',content:''}}));
  routes.push(await renderPage('search','/search',{page_title:'Search fragrances'}));
  routes.push(await renderPage('404','/404',{page_title:'Page not found'}));
  const pageBannerChecks = await verifyMasterPages(routes);
  const lifestyleHomepageChecks = [];
  const report = {
    generatedAt: new Date().toISOString(), edition: 'DearBody Scent Journey — master brief', previewPort, themeRoot, routes, validation,
    fallbackTemplates: [...new Set(fallbackUsed)],
    genericPageChecks: ['contact handle renders shared contact H1 and form', 'our-story handle renders shared story H1'],
    pageBannerChecks,
    lifestyleHomepageChecks,
    gaps: ['Mock catalog is not Shopify admin data; all six products use the approved PHP 799 selling price, with availability false pending inventory confirmation.', 'Shopify-only form, section/group, and single-page pagination behavior is emulated around the actual Liquid markup.', 'Image CDN resizing/srcset and Shopify media players are not emulated.', 'No checkout, payment, email, customer session, inventory or theme-editor behavior is tested.', 'Official parser validates syntax, not complete Shopify theme-store requirements or runtime semantics.'],
  };
  await fs.writeFile(path.join(publicRoot, 'preview-report.json'), JSON.stringify(report, null, 2));
  console.log(`Validated ${validation.length} theme files; rendered ${routes.length} routes.`);
  console.log(`Passed ${pageBannerChecks.length} master layout checks.`);

  if (fallbackUsed.length) console.log(`Templates not yet present; schema-derived preview fallback used: ${[...new Set(fallbackUsed)].join(', ')}`);
  console.log(`Preview output: ${publicRoot}`);
  return report;
}

const mimeTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2' };
function serve() {
  const port = previewPort;
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
