const fs=require('node:fs');
const assert=require('node:assert/strict');
const {JSDOM}=require('../preview/node_modules/jsdom');
const code=fs.readFileSync(require('node:path').join(__dirname,'../theme/assets/sj-commerce.js'),'utf8');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const contents=(count=1)=>`<div data-sj-drawer-content><h2 id="CartDrawerTitle">Your bag</h2><button data-sj-close-dialog>Close</button><div data-sj-cart-error role="alert"></div><form data-sj-cart-form><article data-sj-line-key="variant:key"><div class="sj-quantity"><button hidden data-sj-step="-1" type="button">-</button><input data-sj-cart-quantity data-line-key="variant:key" type="number" name="updates[]" min="0" value="${count}"><button hidden data-sj-step="1" type="button">+</button></div><a data-sj-remove="variant:key" href="/fr/cart/change?line=1&quantity=0">Remove</a></article><button name="checkout" type="submit">Checkout</button><button hidden name="update" data-sj-native-update>Update</button></form></div>`;
const dom=new JSDOM(`<!doctype html><button data-sj-open-cart>Bag <span data-sj-cart-count>0</span></button><button data-sj-open-search>Search</button><form data-sj-product-form><input name="id" value="123"><input name="quantity" type="number" value="1"><button name="add" data-sj-add><span>Add to bag</span></button><p data-sj-product-error></p></form><dialog id="sj-cart-drawer" data-section-id="sj-cart-drawer">${contents()}</dialog><p data-sj-cart-status></p><dialog id="sj-search-dialog" data-sj-predictive-url="/fr/search/suggest"><button data-sj-close-dialog>Close search</button><form><input data-sj-predictive-input type="search" name="q"><button>Search</button></form><div data-sj-predictive-container></div><div data-sj-search-status></div><div data-sj-search-inspiration></div></dialog>`,{url:'https://example.com/fr/products/test',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document;
w.sjRoutes={root:'/fr/'};w.CSS={escape:s=>s.replace(/[^\w-]/g,'\\$&')};
w.HTMLElement.prototype.scrollIntoView=function(){};
w.HTMLDialogElement.prototype.showModal=function(){this.open=true};
w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};
let requests=[], addResolve, failAdd=false,failChange=false,networkAdd=false, count=1;
w.fetch=async(url,options={})=>{requests.push({url:String(url),options});
 if(String(url).endsWith('/cart/add.js')){await new Promise(r=>addResolve=r);if(networkAdd)throw new TypeError('Failed to fetch');return{ok:!failAdd,json:async()=>failAdd?{description:'This variant is sold out.'}:{id:123}};}
 if(String(url).endsWith('/cart/change.js')){const body=JSON.parse(options.body);if(!failChange)count=body.quantity;return{ok:!failChange,json:async()=>failChange?{description:'Only one item is available.'}:{item_count:count}};}
 if(String(url).endsWith('/cart.js'))return{ok:true,json:async()=>({item_count:count})};
 if(String(url).includes('sections='))return{ok:true,json:async()=>({'sj-cart-drawer':contents(count)})};
 if(String(url).includes('/search/suggest')){const query=new URL(url).searchParams.get('q');await delay(query==='first'?130:10);return{ok:true,text:async()=>`<div data-sj-predictive-results><ul id="PredictiveSearchList"><li id="option-${query}" aria-selected="false"><a data-sj-search-option href="/products/${query}">${query}</a></li></ul><span data-sj-result-count>1 suggestion found.</span></div>`};}
 throw Error('Unexpected URL '+url);
};
(async()=>{
 w.eval(code);
 assert.equal(d.querySelector('[data-sj-step]').hidden,false);
 const form=d.querySelector('[data-sj-product-form]'),button=form.querySelector('button');
 let settled=0;form.addEventListener('sj:product-form-settled',()=>settled++);
 const submit=()=>form.dispatchEvent(new w.SubmitEvent('submit',{bubbles:true,cancelable:true,submitter:button}));
 submit();submit();
 assert.equal(requests.filter(r=>r.url.endsWith('/cart/add.js')).length,1);assert.equal(button.disabled,true);assert.equal(button.textContent,'Adding…');
 addResolve();await delay(30);
 assert.equal(button.innerHTML,'<span>Add to bag</span>');assert.equal(button.disabled,false);assert.equal(d.querySelector('#sj-cart-drawer').open,true);assert.equal(settled,1);assert.equal(d.querySelector('[data-sj-cart-count]').textContent,'1');
 d.querySelector('#sj-cart-drawer').close();assert.equal(d.activeElement,button);
 failAdd=true;submit();addResolve();await delay(30);assert.equal(form.querySelector('[data-sj-product-error]').textContent,'This variant is sold out.');assert.equal(button.disabled,false);assert.equal(settled,2);assert.equal(requests.filter(r=>r.url.endsWith('/cart/add.js')).length,2);
 networkAdd=true;failAdd=false;submit();addResolve();await delay(25);assert.equal(form.querySelector('[data-sj-product-error]').textContent,'We couldn’t confirm the update. Check your bag before trying again.');assert.equal(requests.filter(r=>r.url.endsWith('/cart/add.js')).length,3);assert.equal(button.disabled,false);
 d.querySelector('[data-sj-open-cart]').click();await delay(25);assert.equal(d.activeElement,d.querySelector('#sj-cart-drawer [data-sj-close-dialog]'));
 let plus=d.querySelector('[data-sj-step="1"]');plus.focus();plus.click();plus.click();await delay(25);assert.equal(requests.filter(r=>r.url.endsWith('/cart/change.js')).length,1);assert.equal(count,2);assert.equal(d.activeElement.dataset.sjStep,'1');
 failChange=true;d.querySelector('[data-sj-remove]').click();await delay(25);assert.equal(d.querySelector('[data-sj-cart-error]').textContent,'Only one item is available.');assert.equal(d.querySelector('[data-sj-cart-quantity]').value,'2');assert.equal(requests.filter(r=>r.url.endsWith('/cart/change.js')).length,2);
 assert(requests.filter(r=>r.url.includes('/cart')).every(r=>r.url.includes('/fr/')));
 d.querySelector('#sj-cart-drawer').close();d.querySelector('[data-sj-open-search]').click();assert.equal(d.querySelector('#sj-search-dialog').open,true);
 const input=d.querySelector('[data-sj-predictive-input]');assert.equal(d.activeElement,input);
 input.value='first';input.dispatchEvent(new w.Event('input'));await delay(240);input.value='second';input.dispatchEvent(new w.Event('input'));await delay(250);
 assert(d.querySelector('[data-sj-predictive-container]').textContent.includes('second'));assert(!d.querySelector('[data-sj-predictive-container]').textContent.includes('first'));
 input.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowDown',cancelable:true}));assert.equal(input.getAttribute('aria-activedescendant'),'option-second');assert.equal(d.querySelector('#option-second').getAttribute('aria-selected'),'true');
 input.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',cancelable:true}));assert.equal(input.getAttribute('aria-expanded'),'false');assert.equal(input.hasAttribute('aria-activedescendant'),false);
 input.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',cancelable:true}));assert.equal(d.querySelector('#sj-search-dialog').open,false);assert.equal(d.activeElement,d.querySelector('[data-sj-open-search]'));
 console.log('Commerce DOM QA: 35 assertions passed (locale, duplicate prevention, restore, stock errors, read-only recovery, focus, stale search, keyboard).');
 dom.window.close();
})().catch(e=>{console.error(e);process.exitCode=1;dom.window.close()});
