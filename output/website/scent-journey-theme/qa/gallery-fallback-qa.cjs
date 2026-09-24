const assert = require('node:assert/strict');
const path = require('node:path');
const {Liquid} = require('../preview/node_modules/liquidjs');
const engine = new Liquid({root:path.join(__dirname,'../theme/snippets'),extname:'.liquid',jsTruthy:false});
engine.registerFilter('asset_url', value => '/assets/' + value);
engine.registerFilter('image_url', value => value.src);
engine.registerFilter('image_tag', value => `<img src="${value}">`);
const single = {handle:'oud-mirage',title:'Oud Mirage',variants:[{id:1}],media:[{media_type:'image'}],featured_image:{src:'/native-product.jpg'}};
async function render(product, enabled=true, extra={}) {
  const context = {product,settings:{regenerated_product_media:enabled},...extra};
  return (await engine.parseAndRender("{% render 'sj-product-image', product: product, native_image: native_image, thumbnail: thumbnail %}", context, {globals:context})).trim();
}
(async()=>{
  assert.match(await render(single), /sj-oud-mirage-01\.jpg/);
  assert.match(await render(single,true,{thumbnail:true}), /sj-oud-mirage-01-thumb\.jpg/);
  assert.match(await render(single,false), /native-product\.jpg/);
  assert.match(await render({...single,handle:'future-fragrance'}), /native-product\.jpg/);
  assert.match(await render({...single,variants:[{id:1},{id:2}]}), /native-product\.jpg/);
  assert.match(await render({...single,media:[...single.media,{media_type:'video'}]}), /native-product\.jpg/);
  assert.match(await render({...single,media:[...single.media,{media_type:'model'}]}), /native-product\.jpg/);
  assert.match(await render({...single,variants:[{id:1},{id:2}]},true,{native_image:{src:'/native-variant.jpg'}}), /native-variant\.jpg/);
  console.log('Gallery fallback QA: 8 assertions passed (bundled, disabled, unknown, variant-specific, video and 3D cases).');
})().catch(error=>{console.error(error);process.exitCode=1});
