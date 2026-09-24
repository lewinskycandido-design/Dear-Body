/** Focused browser regression for the supplied Helvetica Now Display Light webfont. */
const fs=require('fs');
const path=require('path');
const {chromium}=require('/Users/wetrade/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const ROOT=__dirname,SHOTS=path.join(ROOT,'screenshots/display-font');
const report={generatedAt:new Date().toISOString(),base:'http://127.0.0.1:4208',scope:'16 local page/theme/viewport cases; no gallery asset edits or injected product fixtures',cases:[],issues:[]};
const routes=[['home','/'],['collection','/collections/womens-perfume'],['finder','/pages/scent-finder'],['product','/products/mojito-metallique']];
const bodySelectors={home:'.sj-home-hero__description',collection:'.sj-collection__intro p,.sj-collection p',finder:'[data-sj-finder] p',product:'.sj-product-banner__statement'};
async function run(browser,name,route,theme,width){
 const row={name,route,theme,width,checks:[],errors:[],fontRequests:[]};report.cases.push(row);
 const check=(pass,label,data)=>{const r={pass:!!pass,label,...(data?{data}: {})};row.checks.push(r);if(!pass)report.issues.push({name,theme,width,...r})};
 const page=await browser.newPage({viewport:{width,height:width===1440?1000:844},reducedMotion:'reduce'});
 page.on('pageerror',e=>row.errors.push(e.message));page.on('request',r=>{if(r.resourceType()==='font'||/\.(woff2?|ttf)(?:\?|$)/i.test(r.url()))row.fontRequests.push(r.url())});
 try{
  await page.goto(report.base+route+'?visual_theme='+theme,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  row.fonts=await page.evaluate(()=>({bodyFamily:getComputedStyle(document.body).fontFamily,bodyWeight:getComputedStyle(document.body).fontWeight,headingFamily:getComputedStyle(document.querySelector('h1')).fontFamily,headingWeight:getComputedStyle(document.querySelector('h1')).fontWeight,faces:[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight})),overflow:document.documentElement.scrollWidth>innerWidth,h1s:document.querySelectorAll('h1').length}));
  check(/Helvetica Now Display/.test(row.fonts.bodyFamily)&&row.fonts.bodyWeight==='300','Body uses Helvetica Now Display weight300',row.fonts);
  check(row.fonts.faces.some(f=>/Helvetica Now Display/.test(f.family)&&f.weight==='300'&&f.status==='loaded'),'New supplied font face loaded');
  check(/Cenzo Flare Bold/.test(row.fonts.headingFamily)&&row.fonts.headingWeight==='700','Cenzo Bold heading retained');
  check(row.fontRequests.some(u=>/HelveticaNowDisplay-Light.*woff2/i.test(u))&&!row.fontRequests.some(u=>/HelveticaNowText/i.test(u)),'New font requested; no old Text font requests',row.fontRequests);
  check(!row.fonts.overflow&&row.fonts.h1s===1,'One H1 and no document overflow');
  const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const doc=await cdp.send('DOM.getDocument');
  let node=await cdp.send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:bodySelectors[name]});
  if(!node.nodeId)node=await cdp.send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'main p:not(.sj-eyebrow)'});
  row.renderedFonts=(await cdp.send('CSS.getPlatformFontsForNode',{nodeId:node.nodeId})).fonts;
  check(row.renderedFonts.some(f=>/HelveticaNowDisplay|Helvetica Now Display/i.test(f.postScriptName+' '+f.familyName)&&f.isCustomFont&&f.glyphCount>0),'Rendered body glyphs use supplied custom Display font',row.renderedFonts);await cdp.detach();
  row.wrapping=await page.evaluate(()=>[...document.querySelectorAll('main h1,main h2,main p,.sj-product-banner__title')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[hidden],.sj-visually-hidden')}).flatMap(e=>{const b=e.getBoundingClientRect(),r=document.createRange();r.selectNodeContents(e);return [...r.getClientRects()].some(x=>x.left<b.left-2||x.right>b.right+2)?[{text:e.textContent.trim().slice(0,90),left:b.left,right:b.right}]:[]}));
  check(!row.wrapping.length,'Visible headings and paragraphs fit their containers',row.wrapping);
  if(name==='home'){
   await page.screenshot({path:path.join(SHOTS,`${name}-${theme}-${width}.png`)});
   const nav=width===390?'#sj-mobile-menu':'.sj-desktop-nav';
   if(width===390){await page.locator('[data-sj-menu]').focus();await page.keyboard.press('Enter');check(await page.locator(nav).isVisible(),'Mobile keyboard menu opens');}
   const women=page.locator(nav+' a').filter({hasText:/^Women$/});await women.focus();await page.keyboard.press('Enter');await page.waitForURL('**/collections/womens-perfume');check(new URL(page.url()).pathname==='/collections/womens-perfume','Keyboard navigation opens Women collection');
  }else if(name==='collection'){
   await page.screenshot({path:path.join(SHOTS,`${name}-${theme}-${width}.png`)});
   const filters=page.locator('.sj-filters summary');await filters.focus();await page.keyboard.press('Enter');check(await page.locator('.sj-filters').evaluate(e=>e.open),'Collection filter controls open with keyboard');
   await filters.focus();await page.keyboard.press('Enter');const card=page.locator('.sj-product-card a[href*="/products/"]').first();const href=await card.getAttribute('href');await card.click();await page.waitForURL('**'+href);check(new URL(page.url()).pathname===href,'Collection card opens its product');
  }else if(name==='finder'){
   await page.locator('[data-sj-finder-experience]').screenshot({path:path.join(SHOTS,`finder-quiz-${theme}-${width}.png`)});
   row.quiz=[];
   for(let step=0;step<5;step++){
    const radios=page.locator('[data-sj-finder-choices] input[type=radio]');const radio=radios.first();
    row.quiz.push({step:step+1,key:await radio.getAttribute('name'),value:await radio.getAttribute('value')});
    await radio.focus();await page.keyboard.press('Space');await page.locator('[data-sj-finder-next]').focus();await page.keyboard.press('Enter');
    check(await page.evaluate(last=>document.activeElement===document.querySelector(last?'[data-sj-finder-results] h2':'[data-sj-finder-question]'),step===4),'Quiz keyboard advances with correct focus (step'+(step+1)+')');
   }
   check(await page.locator('[data-sj-finder-results]').isVisible()&&await page.locator('[data-sj-finder-result-grid] [data-sj-finder-product]').count()>0,'Quiz returns real product results');
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Quiz results have no horizontal overflow');
   await page.locator('[data-sj-finder-results]').screenshot({path:path.join(SHOTS,`finder-results-${theme}-${width}.png`)});
  }else if(name==='product'){
   await page.locator('.sj-product-banner a[href^="#"]').click();
   if(width===1440){
    const prior=await page.locator('[data-sj-product-info]').evaluate(e=>({scroll:e.scrollTop,page:scrollY,media:document.querySelector('.sj-product__media').getBoundingClientRect().top,box:e.getBoundingClientRect().toJSON()}));
    await page.mouse.move(prior.box.x+prior.box.width/2,prior.box.y+220);await page.mouse.wheel(0,400);await page.waitForTimeout(150);
    const after=await page.locator('[data-sj-product-info]').evaluate(e=>({scroll:e.scrollTop,page:scrollY,media:document.querySelector('.sj-product__media').getBoundingClientRect().top}));
    check(after.scroll>prior.scroll&&Math.abs(after.page-prior.page)<2&&Math.abs(after.media-prior.media)<2,'PDP information scroll stays independent',{prior,after});
   }
   await page.screenshot({path:path.join(SHOTS,`${name}-${theme}-${width}.png`)});
   await page.locator('[data-sj-gallery-next]').click();check(await page.locator('[data-sj-thumbnail]').nth(1).getAttribute('aria-pressed')==='true','PDP gallery next works');
   await page.locator('[data-sj-media].is-active [data-sj-zoom]').click();check(await page.locator('[data-sj-zoom-dialog]').evaluate(d=>d.open),'PDP zoom opens');await page.keyboard.press('Escape');check(await page.locator('[data-sj-zoom-dialog]').evaluate(d=>!d.open),'PDP zoom closes with Escape');
  }
  check(row.errors.length===0,'No JavaScript errors',row.errors);
 }catch(e){check(false,'Browser case completes',{error:e.message});}
 row.status=row.checks.every(c=>c.pass)?'PASS':'FAIL';console.log(row.status,name,theme,width);await page.close();
}
(async()=>{fs.mkdirSync(SHOTS,{recursive:true});const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});for(const [name,route] of routes)for(const theme of ['light','dark'])for(const width of [1440,390])await run(browser,name,route,theme,width);await browser.close();report.summary={status:report.issues.length?'FAIL':'PASS',cases:report.cases.length,checks:report.cases.reduce((n,r)=>n+r.checks.length,0),issues:report.issues.length};fs.writeFileSync(path.join(ROOT,'DISPLAY-FONT-QA.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary,null,2));})().catch(e=>{console.error(e);process.exitCode=1});
