import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Liquid } from 'liquidjs';
import { JSDOM } from 'jsdom';
const root=path.dirname(fileURLToPath(import.meta.url));
const theme=path.resolve(root,'../dearbody');
const checks=[];
const verify=(name,run)=>{run();checks.push(name);console.log(`PASS ${name}`)};
const home=new JSDOM(await fs.readFile(path.join(root,'public/index.html'),'utf8')).window.document;
verify('Header has the six requested destinations and an accessible cart symbol',()=>{
  assert.deepEqual([...home.querySelectorAll('.db-desktop-nav a')].map(a=>a.textContent.trim()),['Home','Scent Finder','For Her','For Him','Our Story','Contact']);
  const quiz=home.querySelector('.db-desktop-nav [data-scent-quiz-open]');assert.equal(quiz.getAttribute('aria-controls'),'DearBodyScentQuiz');
  assert.ok(home.querySelector('.db-bag svg[aria-hidden="true"]'));assert.ok(home.querySelector('.db-bag').getAttribute('aria-label'));
});
verify('Homepage has category lifestyle routes, finder callout and both logo variants',()=>{
  assert.equal(home.querySelector('.db-lifestyle-scene--bag figcaption a').getAttribute('href'),'/collections/womens-perfume');
  assert.equal(home.querySelector('.db-lifestyle-scene--vanity figcaption a').getAttribute('href'),'/collections/mens-perfume');
  assert.ok(home.querySelector('.db-finder-callout [data-scent-quiz-open]'));
  assert.ok(home.querySelector('.db-header .db-logo-art'));
  assert.ok(home.querySelector('.db-story .db-secondary-logo-art'));
  assert.ok(home.querySelector('.db-footer .db-secondary-logo-art'));
});
const expected=[['womens-perfume',['Mojito Metallique','Amber Oud Silk','Mistened Narcissus']],['mens-perfume',['Oud Mirage','Charme Envoûtant','Rtulle & Satin']]];
for(const [handle,names] of expected){
 const d=new JSDOM(await fs.readFile(path.join(root,'public/collections',handle,'index.html'),'utf8')).window.document;
 verify(`${handle} uses one editorial row per live product with native detail links`,()=>{
   assert.deepEqual([...d.querySelectorAll('.db-scent-row h3')].map(x=>x.textContent),names);
   assert.equal(d.querySelectorAll('.db-scent-row').length,3);assert.equal(d.querySelectorAll('.db-card,.db-product-grid').length,0);
   for(const row of d.querySelectorAll('.db-scent-row')){const img=row.querySelector('img');assert.ok(img.alt);assert.equal(img.getAttribute('loading'),'lazy');assert.equal(row.querySelectorAll('a').length,2);assert.ok(row.querySelector('a').getAttribute('href').startsWith('/products/'));assert.equal(row.querySelector('.db-scent-row__price').textContent.trim(),'₱799.00 PHP');assert.equal(row.querySelector('.db-scent-row__status')?.textContent.trim(),'Sold out');}
 });
}
const source=await fs.readFile(path.join(theme,'snippets/db-scent-row.liquid'),'utf8');
const liquid=new Liquid({strictFilters:true,strictVariables:false,jsTruthy:false});
liquid.registerFilter('money_with_currency',n=>`£${(Number(n)/100).toFixed(2)} GBP`);
liquid.registerFilter('image_url',v=>v?.src||'');liquid.registerFilter('image_tag',src=>`<img src="${src}" alt="Product">`);
liquid.registerFilter('metafield_tag',f=>`<div>${f.value}</div>`);
async function row(overrides={}){const product={id:1,title:'Custom fragrance',handle:'custom',url:'/products/custom',description:'<p>Merchant scent description.</p>',variants:[],metafields:{custom:{}},has_only_default_variant:true,...overrides};return new JSDOM(await liquid.parseAndRender(source,{product,index:1})).window.document;}
for(const [label,variants,price,action,status] of [
 ['Paid single variant',[{price:75000,available:true}],'£750.00 GBP','Shop this scent',false],
 ['Mixed free and paid',[{price:0,available:true},{price:75000,available:true}],'£750.00 GBP','Shop this scent',false],
 ['Varied positive prices',[{price:95000,available:true},{price:0,available:true},{price:75000,available:true}],'From £750.00 GBP','Shop this scent',false],
 ['Only free variants',[{price:0,available:true}],'Available soon','View fragrance',false],
 ['Sold-out paid variants',[{price:75000,available:false}],'£750.00 GBP','View fragrance',true],
 ['Free available and paid sold out',[{price:0,available:true},{price:75000,available:false}],'£750.00 GBP','View fragrance',true],
 ]){const d=await row({variants});verify(`${label}: accurate price, availability and safe detail-page action`,()=>{assert.equal(d.querySelector('.db-scent-row__price').textContent.trim(),price);assert.ok(d.querySelector('.db-button').textContent.includes(action));assert.equal(!!d.querySelector('.db-scent-row__status'),status);assert.equal(d.querySelectorAll('form').length,0)})}
for(const url of [undefined,'','   ']){const d=await row({url});verify(`Blank URL ${JSON.stringify(url)} creates no actionable link`,()=>assert.equal(d.querySelectorAll('a').length,0))}
const custom=await row({title:'Merchant fragrance',handle:'different',description:'<p>Only merchant-approved copy.</p>'});verify('Unrecognized products keep merchant data and do not gain invented fragrance notes',()=>{assert.equal(custom.querySelector('h3').textContent,'Merchant fragrance');assert.equal(custom.querySelector('.db-scent-row__description').textContent,'Only merchant-approved copy.');assert.equal(custom.querySelectorAll('.db-scent-row__character,.db-scent-row__notes').length,0)});
const known=await row({title:'MISTENED NARCISSUS',handle:'merchant-handle'});verify('Known product titles work with custom handles and retain verified berry description',()=>assert.equal(known.querySelector('.db-scent-row__description').textContent,'Juicy berries softened by a smooth, sweet finish.'));
const metafield=await row({metafields:{custom:{scent_notes:{value:'Merchant-verified notes'}}}});verify('Notes render only from a populated merchant scent_notes metafield',()=>assert.equal(metafield.querySelector('.db-scent-row__notes div').textContent,'Merchant-verified notes'));
const options=await row({has_only_default_variant:false,variants:[{price:75000,available:true}]});verify('Multi-option products lead to the product page to choose an option',()=>assert.ok(options.querySelector('.db-button').textContent.includes('Choose your option')));
const quizDom=new JSDOM(await fs.readFile(path.join(root,'public/index.html'),'utf8'),{url:'https://preview.invalid/',runScripts:'outside-only'});
const w=quizDom.window,d=w.document;
w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};
w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'))};
w.eval(await fs.readFile(path.join(theme,'assets/dearbody.js'),'utf8'));
w.eval(await fs.readFile(path.join(theme,'assets/dearbody-quiz.js'),'utf8'));
verify('Mobile Scent Finder closes its menu and returns focus to the visible Menu summary',()=>{
 const menu=d.querySelector('.db-mobile-menu'),trigger=menu.querySelector('[data-scent-quiz-open]'),dialog=d.querySelector('[data-scent-quiz]');
 menu.open=true;trigger.focus();trigger.dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}));
 assert.equal(menu.open,false);assert.equal(dialog.open,true);
 dialog.querySelector('[data-quiz-close]').dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}));
 assert.equal(dialog.open,false);assert.equal(d.activeElement,menu.querySelector('summary'));
});
quizDom.window.close();
console.log(`\n${checks.length} editorial layout and collection-commerce checks passed.`);
console.log('No network, browser-layout assertion, catalog change or actual purchase.');
