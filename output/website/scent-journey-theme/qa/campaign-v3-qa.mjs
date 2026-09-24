import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));const out=path.join(root,'campaign-v3-screenshots');
await fs.mkdir(out,{recursive:true});
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const p=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const cases=[];const errors=[];p.on('pageerror',e=>errors.push(String(e)));const broken=[];
p.on('response',r=>{if(r.status()>=400)broken.push({status:r.status(),url:r.url()});});
const routes=[['home','/'],['women','/collections/womens-perfume'],['men','/collections/mens-perfume'],['finder','/pages/scent-finder'],['story','/pages/our-story']];
for(const width of [1440,390,360])for(const mode of ['light','dark'])for(const [name,route] of routes){
 await p.setViewportSize({width,height:width===1440?1000:844});
 await p.goto('http://127.0.0.1:4208'+route+'?visual_theme='+mode,{waitUntil:'networkidle'});
 await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=650){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,70));}scrollTo({top:0,behavior:'instant'});});
 await p.waitForLoadState('networkidle');await p.waitForTimeout(100);
 const row=await p.evaluate(()=>{
   const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};
   const banner=document.querySelector('.sj-page-banner')||document.querySelector('.sj-doorway-grid');
   return {mode:document.documentElement.dataset.theme,overflow:document.documentElement.scrollWidth>innerWidth,documentWidth:document.documentElement.scrollWidth,headings:[...document.querySelectorAll('h1,h2')].filter(e=>e.getBoundingClientRect().width).map(e=>({text:e.textContent.trim(),rect:rect(e),font:getComputedStyle(e).fontSize,color:getComputedStyle(e).color})),bannerImages:[...banner.querySelectorAll('img')].filter(i=>i.getBoundingClientRect().width>0).map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,rect:rect(i),position:getComputedStyle(i).objectPosition,fit:getComputedStyle(i).objectFit})),footerImages:[...document.querySelectorAll('.sj-footer-banner img')].map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0})),bag:rect(document.querySelector('.sj-bag-icon')),bagStroke:getComputedStyle(document.querySelector('.sj-bag-icon')).stroke};
 });
 row.name=name;row.route=route;row.width=width;row.expectedMode=mode;
 const banner=p.locator(name==='home'?'.sj-doorway-grid':'.sj-page-banner').first();
 await banner.screenshot({path:path.join(out,name+'-'+mode+'-'+width+'-banner.png')});
 await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await p.locator('.sj-header').screenshot({path:path.join(out,name+'-'+mode+'-'+width+'-header.png')});
 await p.locator('[data-sj-open-cart]').click();
 row.cartOpen=await p.locator('#sj-cart-drawer').evaluate(e=>e.open);
 row.bagKeyboardFocus=await p.locator('#sj-cart-drawer').evaluate(e=>e.contains(document.activeElement));
 if(name==='home')await p.screenshot({path:path.join(out,'cart-'+mode+'-'+width+'.png')});
 await p.keyboard.press('Escape');
 row.cartCloses=!(await p.locator('#sj-cart-drawer').evaluate(e=>e.open));
 if(name==='home')await p.locator('.sj-footer-banner').screenshot({path:path.join(out,'footer-'+mode+'-'+width+'.png')});
 cases.push(row);
}
const failures=cases.flatMap(c=>{const fail=[];if(c.overflow)fail.push('horizontal overflow');if(c.mode!==c.expectedMode)fail.push('mode mismatch');if(!c.bannerImages.length||c.bannerImages.some(i=>!i.loaded))fail.push('banner load');if(c.bannerImages.some(i=>!i.src.includes(c.expectedMode)))fail.push('wrong banner mode');if(c.footerImages.some(i=>!i.loaded||!i.src.includes(c.expectedMode)))fail.push('footer load/mode');if(c.bag.width<16||c.bag.height<16)fail.push('bag icon size');if(!c.cartOpen||!c.cartCloses)fail.push('cart open/close');return fail.map(reason=>({name:c.name,mode:c.mode,width:c.width,reason}));});
await fs.writeFile(path.join(root,'campaign-v3-report.json'),JSON.stringify({at:new Date().toISOString(),cases,failures,errors,broken},null,2));
console.log(JSON.stringify({cases:cases.length,failures,errors,broken,screenshots:out},null,2));await b.close();

