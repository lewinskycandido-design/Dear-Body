import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { Liquid } from 'liquidjs';
import { toLiquidHtmlAST } from '@shopify/liquid-html-parser';

const theme = new URL('../dearbody/', import.meta.url);
const productScript = await fs.readFile(new URL('assets/dearbody.js', theme), 'utf8');
const commerceScript = await fs.readFile(new URL('assets/dearbody-commerce.js', theme), 'utf8');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let checks = 0;
const pass = label => { checks++; console.log(`PASS ${label}`); };

// Exercise product behavior using changing stock/price/media fixtures, never real checkout.
const variantDOM = new JSDOM(`<section data-db-product>
<p data-db-price>₱799.00 PHP</p><div id="first" data-db-media-panel data-db-media-id="11"></div><div id="second" data-db-media-panel data-db-media-id="22" hidden></div>
<button data-db-media-target="first" aria-pressed="true"></button><button data-db-media-target="second" aria-pressed="false"></button>
<form><select name="id" data-db-variant><option value="1">One</option><option value="2">Two</option><option value="3">Three</option><option value="4">Four</option><option value="999">Missing</option></select><button type="submit" data-db-add>Add to bag</button><div data-db-payment>Checkout</div></form>
<script type="application/json" data-db-variants>${JSON.stringify([
  {id:1,available:true,price:79900,featured_media:{id:11}},
  {id:2,available:true,price:99900,featured_media:{id:22}},
  {id:3,available:false,price:79900},
  {id:4,available:true,price:0}
])}</script><script type="application/json" data-db-variant-prices>{"1":"₱799.00 PHP","2":"₱999.00 PHP","3":"₱799.00 PHP","4":"₱0.00 PHP"}</script></section>`, {url:'https://example.test/en-ph/products/test?source=collection',runScripts:'outside-only'});
const v = variantDOM.window;
v.eval(productScript);
const choose = id => { const select=v.document.querySelector('select'); select.value=String(id); select.dispatchEvent(new v.Event('change',{bubbles:true})); };
choose(2);
assert.equal(v.document.querySelector('[data-db-price]').textContent,'₱999.00 PHP');
assert.equal(v.document.querySelector('#second').hidden,false);
assert.equal(v.document.querySelector('#first').hidden,true);
assert.equal(v.document.querySelector('[data-db-payment]').hidden,false);
assert.equal(new URL(v.location.href).searchParams.get('variant'),'2');
assert.equal(new URL(v.location.href).searchParams.get('source'),'collection');
pass('variant selection updates native currency, media, checkout visibility and URL');
for (const id of [3,4,999]) {
  choose(id);
  assert.equal(v.document.querySelector('[data-db-add]').disabled,true);
  assert.equal(v.document.querySelector('[data-db-payment]').hidden,true);
  const submit = new v.Event('submit',{bubbles:true,cancelable:true});
  v.document.querySelector('form').dispatchEvent(submit);
  assert.equal(submit.defaultPrevented,true);
}
choose(1);
const validSubmit = new v.Event('submit',{bubbles:true,cancelable:true});
v.document.querySelector('form').dispatchEvent(validSubmit);
assert.equal(validSubmit.defaultPrevented,false);
pass('sold-out, zero-price and missing variants cannot submit; available native form can');
v.document.querySelector('[data-db-media-target="second"]').click();
assert.equal(v.document.querySelector('#second').hidden,false);
pass('gallery thumbnail selection works independently of variant');
v.close();

const searchMarkup = `<form action="/en-ph/search" method="get" data-db-search data-predictive-url="/en-ph/search/suggest"><label for="q">Search</label><input id="q" name="q"><button type="submit">Search</button><div data-db-search-results hidden></div><p data-db-search-status role="status"></p></form>`;
const dom = new JSDOM(searchMarkup + '<div data-db-recommendations data-section-id="rec-1" data-url="/en-ph/recommendations/products?section_id=rec-1&product_id=1&limit=3&intent=related"></div>', {url:'https://example.test/en-ph/',runScripts:'outside-only'});
const w = dom.window;
const requests = [];
w.fetch = (url, options) => new Promise(resolve => { requests.push({url:String(url),options,resolve}); });
w.eval(commerceScript);
w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
assert.equal(requests.length,1);
assert.match(requests[0].url,/^\/en-ph\/recommendations\/products/);
requests[0].resolve({ok:true,text:async()=>'<div data-db-recommendations data-section-id="rec-1"><section><h2>Recommended by Shopify</h2></section></div>'});
await sleep(0);
assert.equal(w.document.querySelector('[data-db-recommendations] h2').textContent,'Recommended by Shopify');
pass('recommendations preserve locale and render matching Shopify section');
const input=w.document.querySelector('input');
const output=w.document.querySelector('[data-db-search-results]');
const type = text => { input.value=text; input.dispatchEvent(new w.Event('input',{bubbles:true})); };
const key = key => input.dispatchEvent(new w.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));
const response = title => ({ok:true,text:async()=>`<div id="shopify-section-db-predictive-search"><div data-db-predictive-content><ul role="listbox" data-db-predictive-list><li role="presentation"><a href="/products/${title}" role="option" aria-selected="false" data-db-search-option tabindex="-1">${title}</a></li><li role="presentation"><a href="/en-ph/search?q=${title}" role="option" data-db-search-option tabindex="-1">All results</a></li></ul><span data-db-predictive-count hidden>1</span></div></div>`});
input.focus();
type('ou'); type('oud');
await sleep(240);
assert.equal(requests.length,2);
const first = requests[1];
const url=new URL(first.url);
assert.equal(url.pathname,'/en-ph/search/suggest');
assert.equal(url.searchParams.get('q'),'oud');
assert.equal(url.searchParams.get('section_id'),'db-predictive-search');
assert.equal(url.searchParams.get('resources[type]'),'product');
pass('search debounce sends a locale-aware Shopify section query');
type('rose');
await sleep(240);
assert.equal(first.options.signal.aborted,true);
requests[2].resolve(response('rose'));
await sleep(0);
first.resolve(response('oud'));
await sleep(0);
assert.match(output.textContent,/rose/);
assert.doesNotMatch(output.textContent,/oud/);
assert.equal(input.getAttribute('aria-expanded'),'true');
pass('stale network response cannot overwrite the latest query');
key('ArrowDown');
const selected = output.querySelector('[aria-selected="true"]');
assert.equal(selected.textContent,'rose');
assert.equal(input.getAttribute('aria-activedescendant'),selected.id);
assert.equal(w.document.activeElement,input);
let selectedLink;
output.addEventListener('click',event=>{selectedLink=event.target.closest('a')?.getAttribute('href');event.preventDefault();});
key('Enter');
assert.equal(selectedLink,'/products/rose');
key('Escape');
assert.equal(output.hidden,true);
assert.equal(input.getAttribute('aria-expanded'),'false');
assert.equal(input.hasAttribute('aria-activedescendant'),false);
pass('combobox arrow/Enter/Escape interaction keeps accessible focus state');
type('network-failure');
await sleep(240);
requests[3].resolve({ok:false});
await sleep(0);
assert.equal(output.hidden,true);
assert.match(w.document.querySelector('[data-db-search-status]').textContent,/Press Enter/);
const nativeSearch = new w.Event('submit',{bubbles:true,cancelable:true});
w.document.querySelector('form').dispatchEvent(nativeSearch);
assert.equal(nativeSearch.defaultPrevented,false);
assert.equal(w.document.querySelector('form').getAttribute('action'),'/en-ph/search');
pass('failed predictive search preserves native full-search submission');
type('');
assert.equal(output.hidden,true);
assert.equal(output.childElementCount,0);
pass('empty queries clear suggestions');
w.close();

for (const name of ['sections/db-main-product.liquid','snippets/db-product-card.liquid','sections/db-main-search.liquid','sections/db-predictive-search.liquid','sections/db-product-recommendations.liquid']) {
  toLiquidHtmlAST(await fs.readFile(new URL(name,theme),'utf8'));
}
pass('all commerce Liquid parses with Shopify Liquid/HTML parser');
const productSource=await fs.readFile(new URL('sections/db-main-product.liquid',theme),'utf8');
assert.ok(productSource.includes('product | structured_data'));
assert.ok(productSource.includes('form | payment_button'));
assert.doesNotMatch(productSource,/lifestyle_identity|lifestyle_photos|case product\.title/);
pass('native structured data and accelerated checkout present; inferred gallery mappings removed');

// Render the real card branches against explicit catalog fixtures.
const liquid = new Liquid({strictFilters:true});
liquid.registerFilter('money_with_currency', value => `PHP ${Number(value)/100}`);
liquid.registerFilter('asset_url', value => `/assets/${value}`);
liquid.registerFilter('image_url', value => value.src);
liquid.registerFilter('image_tag', value => `<img src="${value}">`);
const cardSource = (await fs.readFile(new URL('snippets/db-product-card.liquid',theme),'utf8'))
  .replace(/{%\s*form\s+[\s\S]*?%}/g,'<form method="post" action="/cart/add">').replace(/{%\s*endform\s*%}/g,'</form>');
const cardVariant = {id:1,price:42000,available:true};
const fixture = {id:1,title:'Merchant title',url:'/products/merchant-title',featured_image:{src:'/live-photo.jpg'},has_only_default_variant:true,variants:[cardVariant],selected_or_first_available_variant:cardVariant,metafields:{custom:{short_description:{value:'Merchant personality'}}}};
async function card(product) {
  const html=await liquid.parseAndRender(cardSource,{product,section:{id:'test'},fallback_image:'fallback.jpg'});
  return new JSDOM(html).window.document;
}
let rendered=await card(fixture);
assert.equal(rendered.querySelector('img').getAttribute('src'),'/live-photo.jpg');
assert.equal(rendered.querySelector('form button').disabled,false);
assert.match(rendered.body.textContent,/PHP 420/);
assert.match(rendered.body.textContent,/Merchant personality/);
for (const variant of [{...cardVariant,available:false},{...cardVariant,price:0}]) {
  rendered=await card({...fixture,variants:[variant],selected_or_first_available_variant:variant});
  assert.equal(rendered.querySelector('form button').disabled,true);
}
rendered=await card({...fixture,has_only_default_variant:false,variants:[cardVariant,{...cardVariant,id:2}]});
assert.equal(rendered.querySelector('form'),null);
assert.match(rendered.querySelector('.db-card-options').textContent,/Choose options/);
pass('rendered cards prefer live media, use current price and restrict Quick Add to a purchasable default variant');
console.log(`\n${checks} commerce checks passed.`);
