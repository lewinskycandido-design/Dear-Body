/** Focused native gallery QA. Real catalog routes, plus labelled in-memory media/visibility fixtures. */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright-core');
const { JSDOM } = require('../preview/node_modules/jsdom');
const BASE = process.env.SJ_PREVIEW_URL || 'http://127.0.0.1:4208';
const SHOTS = path.join(__dirname, 'screenshots/gallery-controls');
const ORDER = ['01', '11', '12', '08', '09', '05', '06', '07', '02', '03', '04', '10'];
const HANDLES = ['mojito-metallique', 'amber-oud-silk', 'mistened-narcissus', 'charme-envoutant', 'oud-mirage', 'rtulle-satin'];
const report = { generatedAt: new Date().toISOString(), base: BASE, order: ORDER, runs: [], checks: [], issues: [], limits: ['Browser timing uses Playwright Clock; IntersectionObserver and layout remain native.', 'Video/model/single-image eligibility uses labelled in-memory response fixtures constructed from the real rendered PDP. No source, catalog, or product data is changed.'] };
const selectedCases = process.env.SJ_QA_CASES?.split(',').filter(Boolean);
if (selectedCases && fs.existsSync(path.join(__dirname, 'GALLERY-CONTROLS-QA.json'))) {
  const previous = JSON.parse(fs.readFileSync(path.join(__dirname, 'GALLERY-CONTROLS-QA.json'), 'utf8'));
  for (const key of ['runs', 'checks', 'issues']) report[key] = previous[key].filter(r => !selectedCases.includes(r.id));
  report.retainedEvidenceFrom = previous.generatedAt;
}
const hostWait = ms => new Promise(resolve => setTimeout(resolve, ms));
function check(pass, label, id, detail = {}) { const row = { ...detail, pass: Boolean(pass), label, id }; report.checks.push(row); if (!row.pass) report.issues.push(row); }
async function state(page) { return page.locator('sj-product').evaluate(p => { const g = p.querySelector('[data-sj-gallery]'), r = g.getBoundingClientRect(), b = p.querySelector('[data-sj-gallery-autoplay]'), s = p.querySelector('[data-sj-gallery-status]'); return { index: [...p.querySelectorAll('[data-sj-media]')].findIndex(s => s.classList.contains('is-active')), state: p.dataset.sjGalleryRotation, label: b?.getAttribute('aria-label'), buttonHidden: !b || b.hidden, live: s?.getAttribute('aria-live'), status: s?.textContent, visibleRatio: Math.max(0, Math.min(innerHeight, r.bottom) - Math.max(0, r.top)) / r.height, gallery: { top: r.top, height: r.height, width: r.width }, scrollLeft: g.scrollLeft, hidden: document.hidden, current: p.querySelector('[data-sj-gallery-current]')?.textContent, total: p.querySelector('[data-sj-gallery-total]')?.textContent }; }); }
async function settle(page, advance = 100) { await hostWait(80); await page.clock.runFor(advance); await hostWait(40); }
async function waitState(page, expected) { for (let i = 0; i < 20; i++) { const s = await state(page); if (s.state === expected) return s; await settle(page, 16); } throw new Error(`Expected ${expected}, got ${JSON.stringify(await state(page))}`); }
async function visible(page) { await page.locator('[data-sj-gallery]').evaluate(g => { const r = g.getBoundingClientRect(); window.scrollTo({ top: window.scrollY + r.top - Math.max(70, (innerHeight - r.height) / 2), behavior: 'instant' }); }); await settle(page); }
async function tick(page, ms) { await page.clock.runFor(ms); await hostWait(30); }
async function finishMotion(page) { for (let i = 0; i < 24; i++) { await hostWait(50); await page.clock.runFor(50); } }
async function click(page, selector) { await page.locator(selector).click({ force: true }); await finishMotion(page); }
async function open(browser, config, row) {
  const page = await browser.newPage({ viewport: { width: config.width || 1440, height: config.width < 500 ? 844 : 1050 }, reducedMotion: config.reduced ? 'reduce' : 'no-preference', hasTouch: config.width < 500, isMobile: config.width < 500 });
  page.setDefaultTimeout(10000);
  page.on('pageerror', e => row.errors.push(e.message));
  await page.clock.install({ time: new Date('2026-09-24T04:00:00Z') });
  if (config.fixture) {
    const source = await (await page.request.get(`${BASE}/products/${config.handle || HANDLES[0]}`)).text();
    const dom = new JSDOM(source), doc = dom.window.document, product = doc.querySelector('sj-product');
    const keep = config.fixture === 'single' ? 1 : 2;
    [...product.querySelectorAll('[data-sj-media]')].slice(keep).forEach(n => n.remove());
    [...product.querySelectorAll('[data-sj-thumbnail]')].slice(keep).forEach(n => n.remove());
    if (config.fixture !== 'single') {
      const second = product.querySelectorAll('[data-sj-media]')[1];
      second.replaceChildren(doc.createElement(config.fixture === 'video' ? 'video' : 'model-viewer'));
      second.firstElementChild.setAttribute('aria-label', `QA native ${config.fixture} fixture`);
      if (config.fixture === 'video') second.firstElementChild.setAttribute('controls', '');
    } else product.querySelector('.sj-product__gallery-controls')?.remove();
    const body = dom.serialize(); dom.window.close();
    await page.route('**/*gallery_qa_fixture=*', route => route.fulfill({ status: 200, body, contentType: 'text/html' }));
  }
  const response = await page.goto(`${BASE}/products/${config.handle || HANDLES[0]}?visual_theme=${config.theme || 'light'}${config.fixture ? `&gallery_qa_fixture=${config.fixture}` : ''}`, { waitUntil: 'networkidle' });
  check(response.ok(), 'PDP responds successfully', row.id, { status: response.status() });
  await page.locator('sj-product').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.clock.pauseAt(new Date(await page.evaluate(() => Date.now()) + 1000));
  await visible(page);
  return page;
}
async function run(browser, config, fn) {
  if (selectedCases && !selectedCases.includes(config.id)) return;
  const row = { ...config, errors: [] }; report.runs.push(row); let page;
  try { page = await open(browser, config, row); await fn(page, row); check(!row.errors.length, 'No browser JavaScript errors', row.id, { errors: row.errors }); }
  catch (e) { row.error = e.message; check(false, 'Scenario completes', row.id, { error: e.message }); if (page) await page.screenshot({ path: path.join(SHOTS, `failure-${row.id}.png`), fullPage: true }).catch(() => {}); }
  finally { row.status = report.issues.some(i => i.id === row.id) ? 'FAIL' : 'PASS'; console.log(row.status, row.id, row.error || ''); await page?.close(); }
}
async function orderCase(page, row) {
 const data=await page.locator('sj-product').evaluate(p=>({slides:[...p.querySelectorAll('[data-sj-media]')].map(s=>({id:s.dataset.sjMedia,src:s.querySelector('img')?.getAttribute('src')})),thumbs:[...p.querySelectorAll('[data-sj-thumbnail]')].map(t=>t.dataset.sjThumbnail),play:p.querySelector('[data-sj-gallery-autoplay]'),arrows:[...p.querySelectorAll('[data-sj-gallery-prev],[data-sj-gallery-next]')].map(e=>({svg:!!e.querySelector('svg'),text:e.textContent.trim(),controls:e.getAttribute('aria-controls')})),gallery:p.querySelector('[data-sj-gallery]').id}));
 check(data.slides.length===12&&data.thumbs.length===12&&data.slides.every((s,i)=>s.id===`studio-${ORDER[i]}`&&s.src.endsWith(`sj-${row.handle}-${ORDER[i]}.jpg`))&&data.thumbs.every((t,i)=>t===`studio-${ORDER[i]}`),'Twelve existing images and thumbnails retain approved storefront order',row.id,data);
 check(!data.play&&data.arrows.length===2&&data.arrows.every(a=>a.svg&&!a.text&&a.controls===data.gallery),'No Play control; both SVG chevrons target native gallery',row.id);
 check((await state(page)).current==='1'&&(await state(page)).total==='12','Initial visual counter matches actual gallery',row.id);
}
async function layoutCase(page,row){
 const data=await page.locator('sj-product').evaluate(p=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,theme:document.documentElement.dataset.theme,buttons:[...p.querySelectorAll('[data-sj-gallery-prev],[data-sj-gallery-next]')].map(e=>{const r=e.getBoundingClientRect();return{x:r.x,right:r.right,width:r.width,height:r.height}}),counter:p.querySelector('.sj-product__gallery-count').getBoundingClientRect().toJSON(),autoplay:p.querySelectorAll('[data-sj-gallery-autoplay]').length}));
 check(data.width+1>=data.scrollWidth&&data.h1===1&&data.theme===row.theme,'Requested theme, one H1 and no page overflow',row.id,data);
 check(!data.autoplay&&data.buttons.length===2&&data.buttons.every(b=>b.width>=44&&b.height>=44&&b.x>=0&&b.right<=data.width)&&data.counter.x>=0&&data.counter.right<=data.width,'Only chevrons and counter; controls remain within viewport with 44px targets',row.id,data);
 await page.locator('.sj-product__media').screenshot({path:path.join(SHOTS,row.id+'.png'),animations:'disabled'});
}
async function behaviorCase(page,row){
 await waitState(page,'playing');await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));let before=await state(page);
 await tick(page,7999);check((await state(page)).index===before.index,'No auto advance before 8000ms',row.id);
 await tick(page,1);let after=await state(page);check(after.index===(before.index+1)%12&&after.current===String(after.index+1)&&after.live==='off'&&after.status===before.status,'Eight-second rotation updates counter without announcement',row.id,{before,after});
 await click(page,'[data-sj-gallery-next]');before=await state(page);await tick(page,16000);after=await state(page);check(after.index===before.index&&after.state==='paused'&&after.live==='polite'&&after.status===`Media ${after.index+1} of 12`,'Manual chevron pauses permanently and announces selection',row.id,{before,after});
 await page.locator('[data-sj-thumbnail]').nth(4).click({force:true});await finishMotion(page);check((await state(page)).index===4&&(await state(page)).current==='5','Thumbnail selects image and updates counter',row.id);
 await page.locator('[data-sj-gallery]').focus();await page.keyboard.press('End');await finishMotion(page);check((await state(page)).index===11&&(await state(page)).current==='12','End key selects final image',row.id);await page.keyboard.press('Home');await finishMotion(page);check((await state(page)).index===0&&(await state(page)).current==='1','Home key selects first image',row.id);await page.keyboard.press('ArrowRight');await finishMotion(page);check((await state(page)).index===1&&(await state(page)).state==='paused','Keyboard arrow remains available while paused',row.id);
 await click(page,'[data-sj-media].is-active [data-sj-zoom]');check(await page.locator('[data-sj-zoom-dialog]').evaluate(d=>d.open),'Zoom opens selected image',row.id);before=await state(page);await tick(page,16000);await page.keyboard.press('Escape');await finishMotion(page);after=await state(page);check(after.index===before.index&&after.state==='paused'&&!await page.locator('[data-sj-zoom-dialog]').evaluate(d=>d.open)&&await page.locator('[data-sj-media].is-active [data-sj-zoom]').evaluate(e=>e===document.activeElement),'Zoom closes with focus restored and rotation still paused',row.id);await tick(page,16000);check((await state(page)).index===after.index,'No implicit restart after zoom',row.id);
 await layoutCase(page,row);
 await page.reload({waitUntil:'networkidle'});await visible(page);await waitState(page,'playing');check((await state(page)).index===0,'Revisiting page starts a fresh automatic gallery',row.id);
 if(row.width<500){const rect=await page.locator('[data-sj-gallery]').boundingBox(),cdp=await page.context().newCDPSession(page),y=Math.max(120,Math.min(650,rect.y+rect.height/2)),start=rect.x+rect.width*.85,end=rect.x+rect.width*.12;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start,y}]});for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start+(end-start)*i/8,y}]});await settle(page,40)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await finishMotion(page);after=await state(page);check(after.state==='paused'&&after.index>0&&after.current===String(after.index+1),'Real mobile swipe selects image, updates counter and pauses',row.id,after);await tick(page,16000);check((await state(page)).index===after.index,'Swipe stays paused',row.id);await cdp.detach()}
}
async function reducedCase(page,row){const before=await state(page);await tick(page,16000);check(before.state==='paused'&&(await state(page)).index===before.index&&!await page.locator('[data-sj-gallery-autoplay]').count(),'Reduced motion stays paused with no Play control',row.id);await click(page,'[data-sj-gallery-next]');check((await state(page)).index===1,'Manual browsing remains available under reduced motion',row.id);await layoutCase(page,row)}
async function fixtureCase(page,row){const before=await state(page);await tick(page,24000);check(before.state==='unavailable'&&(await state(page)).index===before.index&&!await page.locator('[data-sj-gallery-autoplay]').count(),`${row.fixture} fixture never rotates`,row.id);if(row.fixture!=='single'){await click(page,'[data-sj-gallery-next]');check((await state(page)).index===1&&(await state(page)).current==='2'&&(await state(page)).total==='2',`Native ${row.fixture} manual browsing and counter remain correct`,row.id)}}
(async()=>{fs.mkdirSync(SHOTS,{recursive:true});const browser=await chromium.launch({headless:true,executablePath:process.env.SJ_CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 for(const handle of HANDLES)await run(browser,{id:'order-'+handle,handle,width:1440,theme:'light'},orderCase);
 for(const [width,theme] of [[1440,'light'],[390,'dark']])await run(browser,{id:`behavior-${width}-${theme}`,width,theme},behaviorCase);
 for(const [width,theme] of [[1440,'dark'],[320,'light'],[320,'dark']])await run(browser,{id:`layout-${width}-${theme}`,width,theme},layoutCase);
 await run(browser,{id:'reduced-motion-390-light',width:390,theme:'light',reduced:true},reducedCase);
 for(const fixture of ['video','model','single'])await run(browser,{id:'native-'+fixture,width:1440,theme:'light',fixture},fixtureCase);
 }finally{await browser.close()}
 report.summary={status:report.issues.length?'FAIL':'PASS',scenarios:report.runs.length,checks:report.checks.length,passed:report.checks.filter(c=>c.pass).length,failures:report.issues.length};fs.writeFileSync(path.join(__dirname,'GALLERY-CONTROLS-QA.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(__dirname,'GALLERY-CONTROLS-QA.md'),['# Gallery controls QA — '+report.summary.status,'',`${report.summary.passed}/${report.summary.checks} checks across ${report.summary.scenarios} scenarios.`,'','Twelve original images retain approved order: '+ORDER.join(', ')+'. No image files are changed. Play/Pause controls are absent. SVG chevrons and a current/total counter support manual browsing. Tests cover eight-second automatic rotation, persistent manual pause, keyboard, thumbnail, zoom/focus return, revisit, real touch swipe, reduced motion and native video/model/single-image eligibility. Desktop 1440 and mobile 390/320 cover Light/Dark. Timing uses Playwright Clock; video/model/single-image tests are isolated in-memory response fixtures.','',...report.runs.map(r=>'- '+r.id+': '+r.status),'',...(report.issues.length?report.issues.map(i=>'- '+i.id+': '+i.label):['No unresolved automated failures.']),'','Screenshots: screenshots/gallery-controls/'].join('\n')+'\n');console.log(JSON.stringify(report.summary,null,2));if(report.issues.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
