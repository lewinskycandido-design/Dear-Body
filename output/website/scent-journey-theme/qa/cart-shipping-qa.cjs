/* Isolated native Liquid cart fixtures. No network, store, cart or inventory writes. */
const fs=require('fs'),path=require('path'),assert=require('assert');
const {Liquid}=require('../preview/node_modules/liquidjs');
const {JSDOM}=require('../preview/node_modules/jsdom');
const parser=require('../preview/node_modules/@shopify/liquid-html-parser');
const ROOT=path.resolve(__dirname,'..'),THEME=path.join(ROOT,'theme');
const engine=new Liquid({root:[path.join(THEME,'snippets'),path.join(THEME,'sections')],extname:'.liquid',strictFilters:true,jsTruthy:false});
const money=v=>'₱'+(Number(v)/100).toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2});
engine.registerFilter('money',money);engine.registerFilter('money_with_currency',v=>money(v)+' PHP');
engine.registerFilter('asset_url',x=>'/assets/'+x);engine.registerFilter('stylesheet_tag',x=>'<link rel="stylesheet" href="'+x+'">');
engine.registerFilter('image_url',()=>'/fixture.jpg');engine.registerFilter('image_tag',x=>'<img src="'+x+'" alt="Fixture fragrance">');
const report={generatedAt:new Date().toISOString(),scope:'Local isolated native Liquid fixtures. Verified PHP80 base rate and active automatic free shipping at quantity >=2 in Philippines; cart.total_price includes discounts. Native cart retained only as a fallback after direct PDP checkout steering.',checks:[],cases:[]};
function check(pass,name,detail){report.checks.push({pass:!!pass,name,...(detail===undefined?{}:{detail})});}
const product={id:1,title:'Fixture fragrance',handle:'fixture-only',has_only_default_variant:true};
function cart(count,total,currency='PHP') {return {currency,item_count:count,total_price:total,original_total_price:count*79900,cart_level_discount_applications:[],taxes_included:true,items:count?[{key:'fixture:1',quantity:count,product,url:'/products/fixture-only',url_to_remove:'/cart/change?line=1&quantity=0',image:{src:'/fixture.jpg'},variant:{title:'Default Title'},properties:[],final_line_price:total,original_line_price:count*79900,line_level_discount_allocations:[]}]:[]};}
const fixtures=[
 {name:'empty',cart:cart(0,0),fee:null,total:null},
 {name:'one item',cart:cart(1,79900),fee:'8000',total:87900},
 {name:'two items threshold',cart:cart(2,159800),fee:'0',total:159800},
 {name:'discounted two items still qualify',cart:cart(2,143820),fee:'0',total:143820},
 {name:'two items below former threshold still qualify',cart:cart(2,159799),fee:'0',total:159799},
 {name:'one high-priced item still pays base shipping',cart:cart(1,159800),fee:'8000',total:167800},
 {name:'PHP currency object',cart:cart(1,79900,{iso_code:'PHP'}),fee:'8000',total:87900},
 {name:'other currency',cart:cart(2,159800,{iso_code:'USD'}),fee:null,total:null},
 {name:'unknown currency',cart:cart(1,79900,null),fee:null,total:null},
 {name:'other market',cart:cart(1,79900),country:'US',fee:null,total:null},
 {name:'unknown market',cart:cart(1,79900),country:'',fee:null,total:null}
];
(async()=>{
 for(const file of ['sections/sj-cart.liquid','sections/sj-cart-drawer.liquid','snippets/sj-cart-shipping-summary.liquid']){
  (parser.toLiquidHtmlAST||parser.default.toLiquidHtmlAST)(fs.readFileSync(path.join(THEME,file),'utf8'),{mode:'strict'});check(true,'Strict Shopify Liquid parse: '+file);
 }
 for(const fixture of fixtures)for(const type of ['sj-cart','sj-cart-drawer']){
  const context={cart:fixture.cart,localization:{country:{iso_code:fixture.country??'PH'}},routes:{root_url:'/fr/',cart_url:'/fr/cart',all_products_collection_url:'/fr/collections/all'},section:{id:type},settings:{}};
  const source=fs.readFileSync(path.join(THEME,'sections',type+'.liquid'),'utf8').replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/,'');
  const html=await engine.parseAndRender(source,context,{globals:context}),doc=new JSDOM(html).window.document;
  const block=doc.querySelector('[data-sj-cart-shipping]'),amount=doc.querySelector('[data-sj-shipping-amount]'),total=doc.querySelector('[data-sj-estimated-total]');
  const row={case:fixture.name,type,fee:block?.getAttribute('data-shipping-estimate')??null,shippingText:amount?.textContent.trim()??null,total:total?.textContent.trim()??null};report.cases.push(row);
  if(fixture.cart.item_count===0){check(!block&&!total,fixture.name+' / '+type+': no invented fee or total');}
  else {
   check(!!block,fixture.name+' / '+type+': shipping row exists');
   check(row.fee===fixture.fee,fixture.name+' / '+type+': verified fee or unknown fallback',row);
   check(fixture.total===null?!total:row.total===money(fixture.total)+' PHP',fixture.name+' / '+type+': estimated total',row);
   check(fixture.fee===null?row.shippingText==='Calculated at checkout':fixture.fee==='0'?row.shippingText==='Free':row.shippingText===money(8000),fixture.name+' / '+type+': truthful rate label',row);
   check(block.textContent.includes('Final shipping is confirmed at checkout.'),fixture.name+' / '+type+': concise estimate qualification');
   check(doc.querySelector('[data-sj-step="-1"] .sj-icon--minus')&&doc.querySelector('[data-sj-step="1"] .sj-icon--plus'),fixture.name+' / '+type+': shared quantity icons retain hooks');
   check(doc.querySelector('[data-sj-step="-1"]').hasAttribute('hidden')&&doc.querySelector('[data-sj-step="-1"]').getAttribute('aria-label').includes('Decrease quantity'),fixture.name+' / '+type+': accessible no-JS controls preserved');
   if(fixture.name==='discounted two items still qualify')check(doc.querySelector('.sj-shipping-offer__message')?.textContent.trim()==='Your bag qualifies for free shipping.',fixture.name+' / '+type+': native quantity-based qualification');
   if(fixture.fee===null)check(!doc.querySelector('.sj-shipping-offer__message'),fixture.name+' / '+type+': no destination/currency qualification assumed');
  }
  check(fixture.fee!==null?doc.querySelector('[data-sj-cod-note]')?.textContent.trim()==='Cash on Delivery available at checkout.':!doc.querySelector('[data-sj-cod-note]'),fixture.name+' / '+type+': verified COD statement scoped to Philippines estimate');
  check(doc.querySelector('link[href="/assets/sj-cart-shipping.css"]'),fixture.name+' / '+type+': component stylesheet included');
  if(type==='sj-cart-drawer')check(doc.querySelector('[data-sj-close-dialog] .sj-icon--close')&&doc.querySelector('[data-sj-close-dialog]').getAttribute('aria-label')==='Close bag',fixture.name+': shared close icon keeps accessible label');
 }
 const context={cart:cart(2,143820),localization:{country:{iso_code:'PH'}},eligibility_basis:'subtotal'};
 const html=await engine.renderFile('sj-cart-shipping-summary',context,{globals:context}),doc=new JSDOM(html).window.document;
 check(doc.querySelector('[data-sj-cart-shipping]').dataset.shippingEstimate==='8000'&&doc.querySelector('[data-sj-estimated-total]').textContent.trim()===money(151820)+' PHP','Explicit legacy subtotal parameter remains isolated from the active default');
 check(fs.readFileSync(path.join(THEME,'snippets/sj-cart-shipping-summary.liquid'),'utf8').includes("eligibility_basis | default: 'quantity'"),'Production default follows verified native quantity rule');
 report.summary={status:report.checks.every(x=>x.pass)?'PASS':'FAIL',cases:report.cases.length,checks:report.checks.length,failures:report.checks.filter(x=>!x.pass)};
 fs.writeFileSync(path.join(__dirname,'CART-SHIPPING-QA.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary,null,2));assert.equal(report.summary.status,'PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
