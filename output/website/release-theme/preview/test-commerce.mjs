import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { Liquid } from 'liquidjs';
import { toLiquidHtmlAST } from '@shopify/liquid-html-parser';

const theme = new URL('../theme/', import.meta.url);
const productScript = await fs.readFile(new URL('assets/dearbody.js', theme), 'utf8');
const commerceScript = await fs.readFile(new URL('assets/dearbody-commerce.js', theme), 'utf8');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let checks = 0;
const pass = label => { checks++; console.log(`PASS ${label}`); };

// Exercise product behavior using changing stock/price/media fixtures, never real checkout.
const variantDOM = new JSDOM(`<section data-db-product>
<p data-db-price>₱799.00 PHP</p><div id="first" data-db-media-panel data-db-media-id="11"></div><div id="second" data-db-media-panel data-db-media-id="22" hidden></div>
<button data-db-media-target="first" aria-pressed="true"></button><button data-db-media-target="second" aria-pressed="false"></button>
<form><select name="id" data-db-variant><option value="1">One</option><option value="2">Two</option><option value="3">Three</option><option value="4">Four</option><option value="5">Quantity rules</option><option value="6">At maximum</option><option value="999">Missing</option></select><input name="quantity" data-db-quantity type="number" min="1" value="1" required><p data-db-quantity-rules></p><p data-db-product-error role="alert" hidden></p><button type="submit" data-db-add>Add to bag</button><div data-db-payment>Checkout</div></form>
<script type="application/json" data-db-variants>${JSON.stringify([
  {id:1,available:true,price:79900,featured_media:{id:11}},
  {id:2,available:true,price:99900,featured_media:{id:22}},
  {id:3,available:false,price:79900},
  {id:4,available:true,price:0},
  {id:5,available:true,price:42000},
  {id:6,available:true,price:42000}
])}</script><script type="application/json" data-db-variant-prices>{"1":"₱799.00 PHP","2":"₱999.00 PHP","3":"₱799.00 PHP","4":"₱0.00 PHP","5":"₱420.00 PHP","6":"₱420.00 PHP"}</script><script type="application/json" data-db-variant-rules>{"5":{"min":6,"increment":3,"max":12,"in_cart":3},"6":{"min":6,"increment":3,"max":12,"in_cart":12}}</script></section>`, {url:'https://example.test/en-ph/products/test?source=collection',runScripts:'outside-only'});
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
for (const id of [3,6,999]) {
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
pass('sold-out, quantity-limited and missing variants cannot submit; available native form can');
choose(4);
assert.equal(v.document.querySelector('[data-db-add]').disabled,false);
assert.equal(v.document.querySelector('[data-db-payment]').hidden,false);
assert.equal(v.document.querySelector('[data-db-price]').textContent,'₱0.00 PHP');
const zeroSubmit = new v.Event('submit',{bubbles:true,cancelable:true});
v.document.querySelector('form').dispatchEvent(zeroSubmit);
assert.equal(zeroSubmit.defaultPrevented,false);
pass('genuine zero-priced Shopify variants display their price and remain purchasable');
choose(5);
const quantityInput=v.document.querySelector('[data-db-quantity]');
assert.equal(quantityInput.min,'3');
assert.equal(quantityInput.step,'3');
assert.equal(quantityInput.max,'9');
assert.equal(quantityInput.value,'3');
assert.match(v.document.querySelector('[data-db-quantity-rules]').textContent,/3 already in your bag/);
for(const value of ['', '1', '4', '12']) {
  quantityInput.value=value;
  quantityInput.dispatchEvent(new v.Event('input',{bubbles:true}));
  const submit = new v.Event('submit',{bubbles:true,cancelable:true});
  v.document.querySelector('form').dispatchEvent(submit);
  assert.equal(submit.defaultPrevented,true);
  assert.equal(v.document.querySelector('[data-db-product-error]').hidden,false);
  assert.notEqual(quantityInput.validationMessage,'');
}
quantityInput.value='6';
quantityInput.dispatchEvent(new v.Event('input',{bubbles:true}));
const quantitySubmit = new v.Event('submit',{bubbles:true,cancelable:true});
v.document.querySelector('form').dispatchEvent(quantitySubmit);
assert.equal(quantitySubmit.defaultPrevented,false);
assert.equal(v.document.querySelector('[data-db-product-error]').hidden,true);
choose(1);
assert.equal(quantityInput.hasAttribute('max'),false);
assert.equal(quantityInput.value,'1');
pass('Shopify quantity rules account for cart quantity, reject invalid input and clear corrected errors');
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
let escapeBubbled=0;
w.document.addEventListener('keydown', event => { if (event.key === 'Escape') escapeBubbled++; });
key('Escape');
assert.equal(escapeBubbled,0);
assert.equal(output.hidden,true);
assert.equal(input.getAttribute('aria-expanded'),'false');
assert.equal(input.hasAttribute('aria-activedescendant'),false);
key('Escape');
assert.equal(escapeBubbled,1);
pass('combobox arrow/Enter/Escape interaction keeps accessible focus; second Escape reaches containing disclosure');
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

for (const name of ['sections/db-main-product.liquid','sections/db-main-cart.liquid','snippets/db-product-card.liquid','sections/db-main-search.liquid','sections/db-predictive-search.liquid','sections/db-product-recommendations.liquid']) {
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
const fixture = {id:1,price:42000,price_varies:false,title:'Merchant title',url:'/products/merchant-title',featured_image:{src:'/live-photo.jpg'},has_only_default_variant:true,variants:[cardVariant],selected_or_first_available_variant:cardVariant,metafields:{custom:{short_description:{value:'Merchant personality'}}}};
async function card(product) {
  const html=await liquid.parseAndRender(cardSource,{product,section:{id:'test'},fallback_image:'fallback.jpg'});
  return new JSDOM(html).window.document;
}
let rendered=await card(fixture);
assert.equal(rendered.querySelector('img').getAttribute('src'),'/live-photo.jpg');
assert.equal(rendered.querySelector('form button').disabled,false);
assert.match(rendered.body.textContent,/PHP 420/);
assert.match(rendered.body.textContent,/Merchant personality/);
for (const variant of [{...cardVariant,available:false}]) {
  rendered=await card({...fixture,variants:[variant],selected_or_first_available_variant:variant});
  assert.equal(rendered.querySelector('form button').disabled,true);
}
rendered=await card({...fixture,has_only_default_variant:false,variants:[cardVariant,{...cardVariant,id:2}]});
assert.equal(rendered.querySelector('form'),null);
assert.match(rendered.querySelector('.db-card-options').textContent,/Choose options/);
const zeroVariant = {...cardVariant,price:0};
rendered=await card({...fixture,price:0,price_varies:true,variants:[zeroVariant],selected_or_first_available_variant:zeroVariant});
assert.equal(rendered.querySelector('form button').disabled,false);
assert.match(rendered.body.textContent,/From PHP 0/);
rendered=await card({...fixture,featured_image:null});
assert.equal(rendered.querySelector('img'),null);
assert.match(rendered.querySelector('.db-no-image').textContent,/Merchant title/);
rendered=await card(undefined);
assert.equal(rendered.querySelector('form'),null);
assert.match(rendered.body.textContent,/Price set in Shopify/);
pass('rendered cards use live media/price including zero, never substitute a different bottle for missing media, and preserve native Quick Add');

// Cart server-rendered totals and quantity controls preserve the native checkout contract.
const cartSource=(await fs.readFile(new URL('sections/db-main-cart.liquid',theme),'utf8')).replace(/{% schema %}[\s\S]*?{% endschema %}/,'');
const line={quantity:1,title:'Merchant fragrance',url:'/products/merchant-fragrance',url_to_remove:'/cart/change?line=1&quantity=0',product:{title:'Merchant fragrance',has_only_default_variant:true},variant:{available:true,price:0,quantity_rule:{min:1,increment:1}},original_price:0,final_price:0,original_line_price:0,final_line_price:0,properties:{},line_level_discount_allocations:[]};
const routes={root_url:'/',all_products_collection_url:'/collections/all',cart_url:'/cart'};
let cartHTML=await liquid.parseAndRender(cartSource,{section:{id:'cart'},routes,shop:{},cart:{item_count:1,items:[line],items_subtotal_price:0,total_price:0}});
let cartDoc=new JSDOM(cartHTML).window.document;
assert.equal(cartDoc.querySelector('[name=checkout]').disabled,false);
assert.equal(cartDoc.querySelector('form').getAttribute('action'),'/cart');
assert.equal(cartDoc.querySelector('form').getAttribute('method'),'post');
assert.equal(cartDoc.querySelector('[name="updates[]"]').required,true);
assert.match(cartDoc.querySelector('.db-cart-table__total').textContent,/PHP 0/);
assert.equal(cartDoc.querySelector('.db-cart-item__remove').getAttribute('href'),line.url_to_remove);
cartHTML=await liquid.parseAndRender(cartSource,{section:{id:'cart'},routes,shop:{},cart:{item_count:0,items:[],items_subtotal_price:0,total_price:0}});
cartDoc=new JSDOM(cartHTML).window.document;
assert.equal(cartDoc.querySelector('[name=checkout]'),null);
assert.match(cartDoc.body.textContent,/Your bag is empty/);
pass('cart renders real zero prices, native update/remove/checkout forms and an intentional empty state');

const cartDOM=new JSDOM('<form class="db-cart-form"><input required type="number" name="updates[]" data-db-cart-quantity data-min="6" min="0" step="3" max="12" value="6"></form>',{url:'https://example.test/cart',runScripts:'outside-only'});
cartDOM.window.eval(productScript);
const cartInput=cartDOM.window.document.querySelector('input');
for(const [value,valid] of [['',false],['1',false],['7',false],['15',false],['0',true],['6',true],['12',true]]) {
  cartInput.value=value;
  cartInput.dispatchEvent(new cartDOM.window.Event('input',{bubbles:true}));
  const submit=new cartDOM.window.Event('submit',{bubbles:true,cancelable:true});
  cartDOM.window.document.querySelector('form').dispatchEvent(submit);
  assert.equal(submit.defaultPrevented,!valid,`cart quantity ${value}`);
}
cartDOM.window.close();
pass('cart quantities permit zero for removal, respect minimum/increment/maximum, and reject blanks');
// Without JavaScript, a GET refresh resolves variant-dependent price and quantity rules server-side.
liquid.registerFilter('item_count_for_variant', () => 0);
liquid.registerFilter('structured_data', () => '{}');
for (const name of ['media_tag','metafield_tag','payment_button','default_errors']) liquid.registerFilter(name, value => value || '');
const renderableProductSource=productSource.replace(/{% schema %}[\s\S]*?{% endschema %}/,'').replace(/{%\s*form\s+[\s\S]*?%}/g,'<form method="post" action="/cart/add">').replace(/{%\s*endform\s*%}/g,'</form>');
const productVariants=[{id:1,title:'Small',price:42000,available:true,quantity_rule:{min:1,increment:1,max:null}},{id:2,title:'Large </script><script>alert(1)</script>',price:84000,available:true,quantity_rule:{min:2,increment:2,max:8}}];
const productHTML=await liquid.parseAndRender(renderableProductSource,{product:{...fixture,media:[],has_only_default_variant:false,options:['Size'],variants:productVariants,selected_or_first_available_variant:productVariants[1]},cart:{},section:{id:'product',settings:{show_dynamic_checkout:false},blocks:[]},routes,shop:{}});
const noScriptDocument=new JSDOM(productHTML).window.document;
const refreshForm=noScriptDocument.querySelector('noscript form');
assert.equal(refreshForm?.getAttribute('method'),'get');
assert.equal(refreshForm.getAttribute('action'),fixture.url);
assert.equal(refreshForm.querySelector('select[name="variant"]').value,'2');
assert.equal(refreshForm.querySelectorAll('option').length,2);
assert.match(noScriptDocument.querySelector('[data-db-price]').textContent,/PHP 840/);
assert.equal(noScriptDocument.querySelector('[data-db-quantity]').min,'2');
assert.equal(noScriptDocument.querySelector('[data-db-quantity]').max,'8');
assert.equal(noScriptDocument.querySelector('form[action="/cart/add"] select[name="id"]').value,'2');
assert.equal(JSON.parse(noScriptDocument.querySelector('[data-db-variants]').textContent)[1].title,productVariants[1].title);
assert.equal(noScriptDocument.querySelector('[data-db-variants]').textContent.includes('</script>'),false);
pass('no-JavaScript variant refresh preserves native GET selection and purchase rules; unusual variant titles cannot break catalog JSON');
console.log(`\n${checks} commerce checks passed.`);
