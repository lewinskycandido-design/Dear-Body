/** Screenshot-based background check for the Home Light eyebrow at 760px. */
const fs=require('fs'),path=require('path');
const {chromium}=require('/Users/wetrade/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const page=await browser.newPage({viewport:{width:760,height:1000},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:4208/?visual_theme=light',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 const data=await page.locator('.sj-home-hero__copy .sj-eyebrow').evaluate(e=>{const r=document.createRange();r.selectNodeContents(e);const b=r.getBoundingClientRect(),s=getComputedStyle(e);return{selector:'.sj-home-hero__copy .sj-eyebrow',viewport:{width:innerWidth,height:innerHeight},text:e.textContent,color:s.color,fontSize:s.fontSize,fontWeight:s.fontWeight,clip:{x:Math.floor(b.x),y:Math.floor(b.y),width:Math.ceil(b.width)+1,height:Math.ceil(b.height)+1}}});
 // Hide only this live text in the browser, keeping layout fixed, to sample the actual photograph + CSS scrim underneath its glyph area.
 await page.locator(data.selector).evaluate(e=>e.style.visibility='hidden');
 await page.screenshot({path:path.join(__dirname,'screenshots/mobile-banner-overlay/home-light-760-eyebrow-background.png'),clip:data.clip});
 await browser.close();fs.writeFileSync(path.join(__dirname,'MOBILE-BANNER-OVERLAY-CONTRAST.json'),JSON.stringify(data,null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1});
