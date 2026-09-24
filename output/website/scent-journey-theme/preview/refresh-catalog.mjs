// Read-only refresh; explicitly fetch public Shopify JSON endpoints. Run with network access.
import fs from 'node:fs/promises';
const source='https://erkayx-xy.myshopify.com';
const get=async path=>{const r=await fetch(source+path);if(!r.ok)throw new Error(`${path}: ${r.status}`);return r.json();};
const [catalog,collections,women,men]=await Promise.all(['/products.json?limit=250','/collections.json?limit=250','/collections/womens-perfume/products.json?limit=250','/collections/mens-perfume/products.json?limit=250'].map(get));
for(const product of catalog.products){const detail=await get(`/products/${product.handle}.js`);product.public_detail={media:detail.media||[],description:detail.description||'',options:detail.options||[],available:detail.available};}
const snapshot={fetched_at:new Date().toISOString(),source,method:'Public Shopify JSON endpoints (GET only)',products:catalog.products,collections:collections.collections,memberships:{'womens-perfume':women.products.map(p=>p.handle),'mens-perfume':men.products.map(p=>p.handle)},limitations:['Public endpoints do not expose product metafields, metaobjects, policies or inventory management settings.','availability is current storefront boolean; actual stock quantity is not public.']};
await fs.writeFile(new URL('./shopify-public-snapshot.json',import.meta.url),JSON.stringify(snapshot,null,2));
console.log(`Read ${catalog.products.length} public products. No Shopify mutations performed.`);
