const fs = require('fs');
const path = require('path');
const {pathToFileURL} = require('url');
const deps = 'C:/Users/lhemy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {chromium} = require(deps + '/playwright');
const sharp = require(deps + '/sharp');
const root = __dirname;
const manifest = JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const titles = {
  'mojito-metallique': 'MOJITO<br>METALLIQUE',
  'amber-oud-silk': 'AMBER OUD SILK',
  'mistened-narcissus': 'MISTENED<br>NARCISSUS',
  'charme-envoutant': 'CHARME<br>ENVOÛTANT',
  'oud-mirage': 'OUD MIRAGE',
  'rtulle-and-satin': 'RTULLE &amp; SATIN'
};
async function main(){
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
const checks=[];
for (let i=0;i<manifest.ads.length;i++){
  const j=manifest.ads[i];
  const dark=j.slug==='oud-mirage';
  const accent=dark?'#125B92':j.color;
  const ink=dark?'#f4e3cb':'#5c0006';
  const logo=dark?'sj-logo-official-white.png':'sj-logo-official-dark.png';
  const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><title>'+esc(j.name)+' — Dear Body Facebook Ad</title><link rel="stylesheet" href="ad.css"></head><body><main class="ad" style="--accent:'+accent+';--ink:'+ink+'"><header class="offer"><div class="curve"></div><img class="brand" src="../assets/'+logo+'" alt="Dear Body"><div class="tagline">A SCENT JOURNEY</div><h1 class="headline">FREE SHIPPING</h1><div class="condition">ON 2+ ITEMS</div><div class="cod">CASH ON DELIVERY</div></header><img class="photo" src="../'+j.photo+'" alt="'+esc(j.name)+' lifestyle photograph featuring an adult Filipino '+j.gender+'"><footer class="foot"><div class="line">'+(j.gender==='woman'?'FOR HER':'FOR HIM')+' · 50 ML</div><h2 class="name">'+titles[j.slug]+'</h2><div class="cta">SHOP NOW<svg class="arrow" viewBox="0 0 34 24" aria-hidden="true"><path d="M1 12H30M20 2L31 12L20 22"/></svg></div></footer></main></body></html>';
  const hpath=path.join(root,'working',j.slug+'.html');
  fs.writeFileSync(hpath,html);
  await page.goto(pathToFileURL(hpath).href);
  await page.evaluate(async()=>{await document.fonts.ready; await Promise.all([...document.images].map(im=>im.decode()));});
  const check=await page.evaluate(()=>{
    const selectors=['.brand','.tagline','.headline','.condition','.cod','.photo','.line','.name','.cta'];
    const boxes=Object.fromEntries(selectors.map(s=>{let e=document.querySelector(s),r=e.getBoundingClientRect();return [s,{text:e.innerText||e.alt,x:r.x,y:r.y,width:r.width,height:r.height,font:getComputedStyle(e).fontFamily,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth}]}));
    return {fontsLoaded:[document.fonts.check('700 91px Cenzo'),document.fonts.check('300 29px HelveticaNow')],boxes,failedImages:[...document.images].filter(i=>!i.naturalWidth).length};
  });
  const file=String(i+1).padStart(2,'0')+'-dear-body-'+j.slug+'-facebook-1080x1350.png';
  await page.screenshot({path:path.join(root,'final',file),type:'png'});
  const meta=await sharp(path.join(root,'final',file)).metadata();
  if(!check.fontsLoaded.every(Boolean)||check.failedImages||meta.width!==1080||meta.height!==1350)throw Error('Invalid render: '+j.slug);
  for(const [selector,b] of Object.entries(check.boxes)){if(b.x<0||b.y<0||b.x+b.width>1080||b.y+b.height>1350)throw Error('Overflow '+j.slug+' '+selector);if(b.scrollWidth>b.clientWidth+1)throw Error('Text overflow '+j.slug+' '+selector);}
  const name=check.boxes['.name'],cta=check.boxes['.cta'];
  if(name.x+name.width>cta.x)throw Error('Title/CTA area collision');
  j.final='final/'+file;
  checks.push({scent:j.slug,...check,dimensions:[meta.width,meta.height],bytes:fs.statSync(path.join(root,'final',file)).size});
  console.log(file);
}
await browser.close();
fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2));
fs.writeFileSync(path.join(root,'working','layout-checks.json'),JSON.stringify(checks,null,2));
const cards=[];
for(let i=0;i<manifest.ads.length;i++){
 const small=await sharp(path.join(root,manifest.ads[i].final)).resize(360,450).png().toBuffer();
 cards.push({input:small,left:24+(i%3)*384,top:24+Math.floor(i/3)*474});
}
await sharp({create:{width:1176,height:972,channels:3,background:'#eee5da'}}).composite(cards).png().toFile(path.join(root,'six-ad-preview.png'));
}
main().catch(e=>{console.error(e);process.exit(1)});
