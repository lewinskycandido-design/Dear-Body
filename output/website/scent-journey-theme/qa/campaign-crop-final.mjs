import{chromium}from'playwright-core';import path from'node:path';import fs from'node:fs/promises';import{fileURLToPath}from'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));const out=path.join(root,'campaign-v3-screenshots');
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const p=await b.newPage({reducedMotion:'reduce'});const cases=[];const errors=[];p.on('pageerror',e=>errors.push(String(e)));
for(const[name,route,width]of[['women','/collections/womens-perfume',1440],['men','/collections/mens-perfume',1440],['story','/pages/our-story',390],['story','/pages/our-story',360]])for(const mode of['light','dark']){
 await p.setViewportSize({width,height:1000});await p.goto('http://127.0.0.1:4208'+route+'?visual_theme='+mode,{waitUntil:'networkidle'});
 const result=await p.locator('.sj-page-banner__media img').evaluate(i=>({position:getComputedStyle(i).objectPosition,src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0,overflow:document.documentElement.scrollWidth>innerWidth,mode:document.documentElement.dataset.theme}));
 const expected=width===1440?'50% 0%':'100% 50%';
 cases.push({name,route,width,mode,expected,...result,pass:result.position===expected&&result.loaded&&!result.overflow&&result.mode===mode&&result.src.includes(mode)});
 await p.locator('.sj-page-banner').screenshot({path:path.join(out,name+'-'+mode+'-'+width+'-crop-final.png')});
}
await fs.writeFile(path.join(root,'campaign-crop-final-report.json'),JSON.stringify({at:new Date().toISOString(),injectedCSS:false,cases,errors},null,2));console.log(JSON.stringify({cases:cases.length,failures:cases.filter(c=>!c.pass),errors},null,2));await b.close();

