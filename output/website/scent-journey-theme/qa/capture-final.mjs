import {chromium} from 'playwright-core';
import path from 'node:path';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const out=path.join(root,'screenshots');
await fs.mkdir(out,{recursive:true});
const b=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await b.newPage({viewport:{width:1440,height:1000}});
const imageChecks=[];
for(const theme of ['light','dark']) {
 for(const device of ['desktop','mobile']) {
  await page.setViewportSize(device==='mobile'?{width:390,height:844}:{width:1440,height:1000});
  await page.goto(`http://127.0.0.1:4208/?visual_theme=${theme}`,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,150));}scrollTo({top:0,behavior:'instant'});});
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(350);
  await page.screenshot({path:path.join(out,`home-${theme}-${device}.png`),fullPage:true});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(350);
  await page.screenshot({path:path.join(out,`home-${theme}-${device}-top.png`)});
  await page.locator('.sj-logo').first().screenshot({path:path.join(out,`logo-${theme}-${device}.png`)});
  imageChecks.push({theme,device,images:await page.evaluate(()=>[...document.images].filter(i=>i.getBoundingClientRect().width>0).map(i=>({src:i.currentSrc||i.src,loaded:i.complete&&i.naturalWidth>0,width:i.naturalWidth,height:i.naturalHeight})))});
 }
}
await page.setViewportSize({width:1440,height:1000});
await page.goto('http://127.0.0.1:4208/compare',{waitUntil:'networkidle'});
await page.screenshot({path:path.join(out,'comparison-desktop.png'),fullPage:true});
await page.locator('#device').selectOption('mobile');
await page.waitForTimeout(250);
await page.screenshot({path:path.join(out,'comparison-mobile.png'),fullPage:true});
await fs.writeFile(path.join(root,'image-load-report.json'),JSON.stringify({generatedAt:new Date().toISOString(),imageChecks},null,2));
console.log(JSON.stringify({imageFailures:imageChecks.flatMap(row=>row.images.filter(i=>!i.loaded).map(i=>({theme:row.theme,device:row.device,...i}))),screenshots:out},null,2));
await b.close();
