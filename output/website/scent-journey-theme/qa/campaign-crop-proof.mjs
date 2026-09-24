import {chromium} from 'playwright-core';import path from 'node:path';import fs from 'node:fs/promises';import{fileURLToPath}from'node:url';
const out=path.join(path.dirname(fileURLToPath(import.meta.url)),'campaign-v3-screenshots');
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const p=await b.newPage({reducedMotion:'reduce'});
for(const [name,route,width]of[['women','/collections/womens-perfume',1440],['men','/collections/mens-perfume',1440],['story','/pages/our-story',390],['story','/pages/our-story',360]])for(const mode of['light','dark']){
 await p.setViewportSize({width,height:1000});await p.goto('http://127.0.0.1:4208'+route+'?visual_theme='+mode,{waitUntil:'networkidle'});
 await p.addStyleTag({content:'@media(min-width:761px){.sj-page-banner__media img{object-position:center top}}@media(max-width:760px){.sj-page-banner--story .sj-page-banner__media img{object-position:100% center}}'});
 await p.locator('.sj-page-banner').screenshot({path:path.join(out,name+'-'+mode+'-'+width+'-crop-proof.png')});
}
await b.close();console.log('8 injected crop proof screenshots saved; no source files changed');

