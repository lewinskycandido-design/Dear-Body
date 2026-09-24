import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const out=path.join(root,'font-screenshots');await fs.mkdir(out,{recursive:true});
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const p=await b.newPage({reducedMotion:'reduce'});const results=[],errors=[];p.on('pageerror',e=>errors.push(e.message));
const routes=[['home','/'],['women','/collections/womens-perfume'],['men','/collections/mens-perfume'],['finder','/pages/scent-finder'],['story','/pages/our-story'],['product','/products/mojito-metallique']];
for(const width of [1440,390,360])for(const mode of ['light','dark'])for(const [name,route] of routes){
 await p.setViewportSize({width,height:width===1440?1000:844});
 await p.goto('http://127.0.0.1:4208'+route+'?visual_theme='+mode,{waitUntil:'networkidle'});
 await p.evaluate(()=>document.fonts.ready);
 const state=await p.evaluate(()=>{const h=document.querySelector('h1');return{displayLoaded:document.fonts.check('700 32px "Cenzo Flare Bold"'),bodyLoaded:document.fonts.check('300 16px "Helvetica Now Display"'),displayFamily:getComputedStyle(h).fontFamily,bodyFamily:getComputedStyle(document.body).fontFamily,overflow:document.documentElement.scrollWidth>innerWidth,headingOverflow:h.scrollWidth>h.clientWidth+1,faces:[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight}))}});
 const row={name,route,width,mode,...state};results.push(row);
 if(width!==360)await p.screenshot({path:path.join(out,`${name}-${mode}-${width}.png`)});
}
const failures=results.filter(r=>!r.displayLoaded||!r.bodyLoaded||!r.displayFamily.includes('Cenzo Flare Bold')||!r.bodyFamily.includes('Helvetica Now Display')||r.overflow||r.headingOverflow||r.faces.some(f=>f.status!=='loaded'));
await fs.writeFile(path.join(root,'font-report.json'),JSON.stringify({generatedAt:new Date().toISOString(),results,failures,errors},null,2));
console.log(JSON.stringify({cases:results.length,failures,errors},null,2));await b.close();if(failures.length||errors.length)process.exitCode=1;
