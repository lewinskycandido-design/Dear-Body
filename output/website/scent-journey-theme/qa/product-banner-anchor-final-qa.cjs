const fs=require('fs');
const path=require('path');
const {chromium}=require('/Users/wetrade/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const report={scope:'Focused final anchor check after -24px ProductDetails margin; preview missing native header group class added to browser DOM only',cases:[]};
 for(const theme of ['light','dark']) for(const width of [1440,390]){
  const height=width===1440?1000:844;
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  await page.goto(`http://127.0.0.1:4208/products/mistened-narcissus?visual_theme=${theme}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>{document.querySelector('[data-sj-header]').parentElement.classList.add('shopify-section-group-header-group')});
  await page.locator('.sj-product-banner a[href^="#"]').click();
  await page.waitForTimeout(500);
  const row=await page.evaluate(()=>{
   const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height}};
   return {header:rect('[data-sj-header]'),details:rect('sj-product'),controls:rect('.sj-product__gallery-controls'),caption:rect('.sj-product__media-caption'),viewport:innerHeight,margin:getComputedStyle(document.querySelector('sj-product')).scrollMarginTop,scrollPadding:getComputedStyle(document.documentElement).scrollPaddingTop};
  });
  Object.assign(row,{width,theme,aligned:Math.abs(row.details.top-row.header.bottom)<2,controlsVisible:row.controls.top>=row.header.bottom&&row.controls.bottom<=height+1,captionVisible:row.caption.top>=row.header.bottom&&row.caption.bottom<=height+1});
  await page.screenshot({path:path.join(root,'qa/screenshots/product-banner',`anchor-final-${theme}-${width}.png`)});
  await page.locator('[data-sj-gallery-next]').click();
  row.next=await page.locator('[data-sj-thumbnail]').nth(1).getAttribute('aria-pressed')==='true';
  await page.locator('[data-sj-media].is-active [data-sj-zoom]').click();
  row.zoom=await page.locator('[data-sj-zoom-dialog]').evaluate(d=>d.open);
  await page.keyboard.press('Escape');
  row.zoomClosed=await page.locator('[data-sj-zoom-dialog]').evaluate(d=>!d.open);
  row.pass=row.aligned&&row.controlsVisible&&row.captionVisible&&row.next&&row.zoom&&row.zoomClosed;
  report.cases.push(row);await page.close();
 }
 report.status=report.cases.every(r=>r.pass)?'PASS':'FAIL';
 fs.writeFileSync(path.join(root,'qa/PRODUCT-BANNER-ANCHOR-FINAL-QA.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
