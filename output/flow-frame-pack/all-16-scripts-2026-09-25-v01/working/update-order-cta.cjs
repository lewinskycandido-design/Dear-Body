const fs=require('fs'),path=require('path');
const project=path.resolve(__dirname,'../../../..');
const extensions=new Set(['.json','.html','.md','.txt','.srt','.csv','.cjs','.ps1','.svg']);
const roots=['output/flow-frame-pack/all-16-scripts-2026-09-25-v01','output/facebook-campaign/bold-faceless-2026-09-25-v02','output/facebook-campaign/personality-discovery-2026-09-25-v01'];
const files=[];
function collect(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,item.name);if(item.isDirectory())collect(f);else if(extensions.has(path.extname(f))&&f!==__filename)files.push(f);}}
roots.forEach(d=>collect(path.join(project,d)));files.push(path.join(project,'AGENTS.md'));
const edits=[
 ['Tap Order Now. Pili ng two or more items para free shipping, tapos Check out.','Pili ng two or more items para free shipping, tapos tap Order Now.'],
 ['Tap Order Now. Pili ng items, tapos Check out.','Pili ng items, tapos tap Order Now.'],
 ['Tap Order Now. Pili ng two items sa Add to order, tapos Check out.','Pili ng two or more items para free shipping, tapos tap Order Now.'],
 ['Tap Order Now, pili ng scents, tapos Check out.','Pili ng scents, tapos tap Order Now.'],
 ['Tap Order Now, pili ng items, tapos Check out.','Pili ng items, tapos tap Order Now.'],
 ['Tap Order Now, choose two or more items for free shipping, then select Check out.','Choose two or more items for free shipping, then tap Order Now.'],
 ['Order Now is the planned ad CTA. The current website theme uses Add to order, then Check out.','Order Now is the website button wording confirmed by the owner. Use ORDER NOW in purchase creative and spoken calls to action.'],
 ['The site explains Add to order and Check out.','Use the owner-confirmed Order Now website button wording.'],
 ['The current local theme says **Add to order → Check out → COD form → confirmation**. Order Now is the planned ad button.','The owner confirms that the website button says **Order Now**. Use that wording in purchase scripts and creative; it supersedes the labels in the older local-theme snapshot.'],
 ["voiceover.includes('tapos Check out.')","voiceover.includes('tap Order Now.')"]
];
let changed=0;
for(const f of files){
 const old=fs.readFileSync(f,'utf8');
 let s=old.replace(/shop now/gi,m=>m===m.toUpperCase()?'ORDER NOW':m===m.toLowerCase()?'order now':'Order Now');
 for(const [a,b] of edits)s=s.split(a).join(b);
 if(s!==old){fs.writeFileSync(f,s);changed++;}
}
const agents=path.join(project,'AGENTS.md');
const note='Owner CTA correction 25 September 2026: use ORDER NOW / Order Now for purchase calls to action in ads, voiceovers, Flow prompts and guides. The owner confirms this is the website button text. It supersedes older purchase-CTA wording and older local-theme label assumptions. Personality-discovery creatives retain FIND YOUR SCENT. This is a creative-copy correction, not an instruction to edit or publish the website.';
if(!fs.readFileSync(agents,'utf8').includes(note))fs.appendFileSync(agents,'\n'+note+'\n');
const brand=path.join(project,'BRAND_GUIDE.md');
const brandNote='Owner CTA update, 25 September 2026: purchase creatives and narration use ORDER NOW, matching the owner-confirmed website button. Personality-discovery creatives use FIND YOUR SCENT. Preserve the free-shipping-on-2+-items condition and COD.';
if(!fs.readFileSync(brand,'utf8').includes(brandNote))fs.appendFileSync(brand,'\n'+brandNote+'\n');
console.log('Updated purchase CTA in '+changed+' text/source files.');
