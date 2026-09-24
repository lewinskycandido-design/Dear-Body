import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const order=[1,11,12,8,9,5,6,7,2,3,4,10];
const handles=['mojito-metallique','amber-oud-silk','mistened-narcissus','charme-envoutant','oud-mirage','rtulle-satin'];
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const results=[],failures=[];
const check=(name,pass,detail)=>{(pass?results:failures).push({name,...(detail?{detail}:{})});};
for(const mode of ['light','dark']) {
  await page.goto(`http://127.0.0.1:4208/?visual_theme=${mode}`,{waitUntil:'networkidle'});
  check(`${mode}: shopping bag icon restored`,await page.locator('[data-sj-open-cart] svg').count()===1);
  check(`${mode}: no homepage product cards`,await page.locator('.sj-product-card').count()===0);
  check(`${mode}: two full-panel category links`,await page.locator('.sj-doorway-link').count()===2);
  check(`${mode}: no decorative arrows`,!/[↗→]/.test(await page.locator('body').innerText()));
  check(`${mode}: transparent official logo`,(await page.locator('.sj-logo img').getAttribute('src')).endsWith(mode==='dark'?'sj-logo-official-white.png':'sj-logo-official-dark.png'));
  for(const [index,category] of ['womens-perfume','mens-perfume'].entries()) {
    check(`${mode}: ${category} category destination`,await page.locator('.sj-doorway-link').nth(index).getAttribute('href')==='/collections/'+category);
  }
  for(const handle of handles) {
    await page.goto(`http://127.0.0.1:4208/products/${handle}?visual_theme=${mode}`,{waitUntil:'networkidle'});
    check(`${mode} ${handle}: twelve regenerated slides`,await page.locator('[data-sj-media]').count()===12);
    check(`${mode} ${handle}: twelve thumbnails`,await page.locator('[data-sj-thumbnail]').count()===12);
    const images=await page.locator('[data-sj-media] img').evaluateAll(async nodes=>Promise.all(nodes.map(async image=>{image.loading='eager';try{await image.decode();}catch{}return{src:image.getAttribute('src'),loaded:image.complete&&image.naturalWidth===1200};})));
    check(`${mode} ${handle}: all twelve new assets load`,images.length===12&&images.every((image,index)=>image.loaded&&image.src===`/assets/sj-${handle}-${String(order[index]).padStart(2,'0')}.jpg`),images.filter(image=>!image.loaded));
    await page.locator('[data-sj-gallery]').focus();await page.keyboard.press('End');
    check(`${mode} ${handle}: last frame keyboard access`,await page.locator('[data-sj-thumbnail]').last().getAttribute('aria-pressed')==='true');
    await page.locator('[data-sj-gallery-next]').click();
    check(`${mode} ${handle}: next wraps to first`,await page.locator('[data-sj-thumbnail]').first().getAttribute('aria-pressed')==='true');
    await page.locator('[data-sj-media].is-active [data-sj-zoom]').click();
    check(`${mode} ${handle}: regenerated zoom`,await page.locator('[data-sj-zoom-dialog] img').getAttribute('src')===`/assets/sj-${handle}-01.jpg`);
    await page.keyboard.press('Escape');
    check(`${mode} ${handle}: notes only where verified`,(await page.locator('.sj-product__notes').count()>0)===(handle!=='rtulle-satin'));
  }
  await page.goto(`http://127.0.0.1:4208/collections/all?visual_theme=${mode}`,{waitUntil:'networkidle'});
  const cardSources=await page.locator('.sj-product-card__image img').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('src')));
  check(`${mode}: six priority product cards`,cardSources.length===6);
  check(`${mode}: collection uses fresh packshots`,handles.every(handle=>cardSources.includes(`/assets/sj-${handle}-01.jpg`)));
  await page.locator('[data-sj-open-search]').click();
  await page.locator('[data-sj-predictive-input]').fill('Oud');
  await page.waitForSelector('[data-sj-search-option]');
  const searchSources=await page.locator('[data-sj-search-option] img').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('src')));
  check(`${mode}: predictive search uses fresh thumbnails`,searchSources.length>=2&&searchSources.every(src=>src.startsWith('/assets/sj-')&&src.endsWith('-01-thumb.jpg')));
  await page.keyboard.press('Escape');await page.keyboard.press('Escape');
}
await fs.writeFile(path.join(root,process.env.QA_REPORT||'gallery-browser-report.json'),JSON.stringify({generatedAt:new Date().toISOString(),results,failures},null,2));
await browser.close();
console.log(JSON.stringify({passed:results.length,failures},null,2));
if(failures.length)process.exitCode=1;
