const fs=require('fs'),path=require('path'),crypto=require('crypto'),{pathToFileURL}=require('url');
const deps='C:/Users/lhemy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {chromium}=require(deps+'/playwright'),sharp=require(deps+'/sharp'),root=__dirname;
(async()=>{
const {concepts}=JSON.parse(fs.readFileSync(path.join(root,'all-content-concepts.json'),'utf8'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--force-color-profile=srgb']});
const results=[];
for(const width of [1280,390]){
 for(const file of ['campaign.html','content-creation-guide.html']){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  await page.goto(pathToFileURL(path.join(root,file)).href);
  await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()))});
  const check=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:document.images.length,broken:[...document.images].filter(i=>!i.naturalWidth).length,concepts:document.querySelectorAll('.concept[id]').length,shots:document.querySelectorAll('.shot').length,fonts:[document.fonts.check('700 30px Cenzo'),document.fonts.check('300 18px HelveticaNow')]}));
  if(check.broken||check.scrollWidth>width+1||check.fonts.includes(false))throw new Error(file+': '+JSON.stringify(check));
  results.push({file,...check});
  await page.screenshot({path:path.join(root,'working',file.replace('.html','')+'-'+width+'.png')});
  if(file.includes('guide')&&width===1280){await page.locator('#mojito-metallique').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(root,'working/guide-concept-preview.png')})}
  await page.close();
 }
}
await browser.close();
const finals=fs.readdirSync(path.join(root,'final/ads')).map(n=>'final/ads/'+n).concat(fs.readdirSync(path.join(root,'final/page')).map(n=>'final/page/'+n));
const output=[];
for(const file of finals){
 const data=fs.readFileSync(path.join(root,file)),meta=await sharp(data).metadata();
 output.push({file,width:meta.width,height:meta.height,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')});
 if(file.includes('/ads/')&&(meta.width!==1080||meta.height!==1350))throw new Error('Wrong size '+file);
}
const images=await Promise.all(concepts.slice(6).map(async(c,i)=>({input:await sharp(path.join(root,'final/ads/'+c.id+'-'+c.slug+'-1080x1350.png')).resize(432,540).toBuffer(),left:(i%2)*452+20,top:Math.floor(i/2)*560+20})));
await sharp({create:{width:924,height:1140,channels:3,background:'#f4e3cb'}}).composite(images).png().toFile(path.join(root,'homepage-angles-preview.png'));
fs.writeFileSync(path.join(root,'qa-report.json'),JSON.stringify({date:'2026-09-25',browserChecks:results,outputCount:output.length,outputs:output,manualReview:['All 12 final images visually reviewed','Six priority scents plus four approved homepage/story angles','Correct white-label women and black-label men reference mapping','No visible faces or facial fragments','Offer: free shipping on 2+ items, then cash on delivery, then Order Now','Exact Cenzo Flare Bold and Helvetica Now Display fonts loaded for all typography','Current owner visual references reviewed and persisted in project instructions','Cover central crop and circular avatar preview reviewed','Ten complete scripts with 70 timed shots; scripts describe future filming, not delivered videos'],limitations:['No live Facebook placement preview or publishing performed','Generated product lettering and tactile avatar are visual renditions of supplied artwork; original logo source retained','Local website/brand files supplied copy; no live inventory, pricing or checkout audit performed']},null,2));
console.log(JSON.stringify({assets:output.length,concepts:concepts.length,shots:concepts.reduce((n,c)=>n+c.shots.length,0),htmlChecks:results}));
})().catch(e=>{console.error(e);process.exit(1)});

