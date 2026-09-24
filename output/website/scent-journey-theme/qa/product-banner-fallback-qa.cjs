const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {Liquid} = require('../preview/node_modules/liquidjs');
const engine = new Liquid({root:path.join(__dirname,'../theme/snippets'),extname:'.liquid',jsTruthy:false});
engine.registerFilter('asset_url',value=>'/assets/'+value);
engine.registerFilter('image_url',value=>value.src);
engine.registerFilter('image_tag',value=>`<img src="${value}">`);
const source=fs.readFileSync(path.join(__dirname,'../theme/sections/sj-product-banner.liquid'),'utf8').replace(/{% schema %}[\s\S]*?{% endschema %}/,'');
const future={id:77,handle:'future-fragrance',title:'Future Fragrance',variants:[{id:1}],media:[{media_type:'image'}],featured_image:{src:'/native-future.jpg'},metafields:{custom:{}}};
async function render(product,overrides={}){
 const context={product,settings:{regenerated_product_media:true},section:{id:'banner',settings:{eyebrow:'DEARBODY PHILIPPINES',button_label:'Explore this fragrance',show_statement:true,...overrides}}};
 return engine.parseAndRender(source,context,{globals:context});
}
(async()=>{
 const native=await render(future);
 assert.match(native,/Future Fragrance/);assert.match(native,/native-future.jpg/);assert.match(native,/#ProductDetails-77/);assert(!native.includes('sj-product-banner__statement'));
 const empty=await render({...future,featured_image:null});assert.match(empty,/sj-product-banner--text-only/);assert(!empty.includes('sj-product-banner__media'));
 const override=await render(future,{image:{src:'/custom-banner.jpg'}});assert.match(override,/custom-banner.jpg/);assert(!override.includes('native-future.jpg'));
 const approved=await render({...future,handle:'oud-mirage',title:'Oud Mirage'});assert.match(approved,/sj-product-banner-oud-mirage.jpg/);assert.match(approved,/DARK ROSE/);assert.match(approved,/<h1\b/);
 const custom=await render({...future,metafields:{custom:{hero_statement:{value:'Custom <scent> story'}}}});assert.match(custom,/Custom &lt;scent&gt; story/);
 console.log('Product banner fallback QA: 5 scenarios passed (future native image, no-image layout, image override, product campaign default, custom statement).');
})().catch(error=>{console.error(error);process.exitCode=1});
