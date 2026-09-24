/** Focused native gallery QA. Real catalog routes, plus labelled in-memory media/visibility fixtures. */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.SJ_PLAYWRIGHT_PATH || '/Users/wetrade/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const { JSDOM } = require('../preview/node_modules/jsdom');
const BASE = process.env.SJ_PREVIEW_URL || 'http://127.0.0.1:4208';
const SHOTS = path.join(__dirname, 'screenshots/gallery-autoplay');
const ORDER = ['11', '12', '08', '09', '10', '01', '02', '03', '04', '05', '06', '07'];
const HANDLES = ['mojito-metallique', 'amber-oud-silk', 'mistened-narcissus', 'charme-envoutant', 'oud-mirage', 'rtulle-satin'];
const report = { generatedAt: new Date().toISOString(), base: BASE, order: ORDER, runs: [], checks: [], issues: [], limits: ['Browser timing uses Playwright Clock; IntersectionObserver and layout remain native.', 'Hidden-document behavior uses explicitly labelled visibility properties and the real visibilitychange handler. It does not claim an OS background-tab test.', 'Video/model/single-image eligibility uses labelled in-memory response fixtures constructed from the real rendered PDP. No source, catalog, or product data is changed.'] };
const selectedCases = process.env.SJ_QA_CASES?.split(',').filter(Boolean);
if (selectedCases && fs.existsSync(path.join(__dirname, 'GALLERY-AUTOPLAY-QA.json'))) {
  const previous = JSON.parse(fs.readFileSync(path.join(__dirname, 'GALLERY-AUTOPLAY-QA.json'), 'utf8'));
  for (const key of ['runs', 'checks', 'issues']) report[key] = previous[key].filter(r => !selectedCases.includes(r.id));
  report.retainedEvidenceFrom = previous.generatedAt;
}
const hostWait = ms => new Promise(resolve => setTimeout(resolve, ms));
function check(pass, label, id, detail = {}) { const row = { ...detail, pass: Boolean(pass), label, id }; report.checks.push(row); if (!row.pass) report.issues.push(row); }
async function state(page) { return page.locator('sj-product').evaluate(p => { const g = p.querySelector('[data-sj-gallery]'), r = g.getBoundingClientRect(), b = p.querySelector('[data-sj-gallery-autoplay]'), s = p.querySelector('[data-sj-gallery-status]'); return { index: [...p.querySelectorAll('[data-sj-media]')].findIndex(s => s.classList.contains('is-active')), state: p.dataset.sjGalleryRotation, label: b?.getAttribute('aria-label'), buttonHidden: !b || b.hidden, live: s?.getAttribute('aria-live'), status: s?.textContent, visibleRatio: Math.max(0, Math.min(innerHeight, r.bottom) - Math.max(0, r.top)) / r.height, gallery: { top: r.top, height: r.height, width: r.width }, scrollLeft: g.scrollLeft, hidden: document.hidden }; }); }
async function settle(page, advance = 100) { await hostWait(80); await page.clock.runFor(advance); await hostWait(40); }
async function waitState(page, expected) { for (let i = 0; i < 20; i++) { const s = await state(page); if (s.state === expected) return s; await settle(page, 16); } throw new Error(`Expected ${expected}, got ${JSON.stringify(await state(page))}`); }
async function visible(page) { await page.locator('[data-sj-gallery]').evaluate(g => { const r = g.getBoundingClientRect(); window.scrollTo({ top: window.scrollY + r.top - Math.max(70, (innerHeight - r.height) / 2), behavior: 'instant' }); }); await settle(page); }
async function toggle(page) { await page.locator('button[data-sj-gallery-autoplay]').click({ force: true }); }
async function play(page) { if ((await state(page)).state !== 'paused') await toggle(page); await toggle(page); await waitState(page, 'playing'); }
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
  const data = await page.locator('sj-product').evaluate(p => ({ slides: [...p.querySelectorAll('[data-sj-media]')].map(s => ({ id: s.dataset.sjMedia, label: s.getAttribute('aria-label'), src: s.querySelector('img')?.getAttribute('src'), loading: s.querySelector('img')?.loading, priority: s.querySelector('img')?.fetchPriority, active: s.classList.contains('is-active') })), thumbs: [...p.querySelectorAll('[data-sj-thumbnail]')].map(t => ({ id: t.dataset.sjThumbnail, label: t.getAttribute('aria-label'), pressed: t.getAttribute('aria-pressed') })), galleryId: p.querySelector('[data-sj-gallery]').id, controlsId: p.querySelector('[data-sj-gallery-autoplay]')?.getAttribute('aria-controls') }));
  row.gallery = data;
  check(data.slides.length === 12 && data.thumbs.length === 12, 'Existing twelve slides and thumbnails retained', row.id);
  check(JSON.stringify(data.slides.map(s => s.id)) === JSON.stringify(ORDER.map(n => `studio-${n}`)), 'Slides follow infographic-first source order', row.id);
  check(JSON.stringify(data.thumbs.map(s => s.id)) === JSON.stringify(ORDER.map(n => `studio-${n}`)), 'Thumbnails follow the identical source order', row.id);
  check(data.slides.every((s, i) => s.src.includes(`sj-${row.handle}-${ORDER[i]}.jpg`)) && new Set(data.slides.map(s => s.src)).size === 12, 'Gallery reuses all twelve unique existing image assets', row.id);
  check(data.slides.every((s, i) => new RegExp(`(^|\\D)${i + 1}\\s*(of|/)\\s*12(\\D|$)`).test(s.label || '')) && data.thumbs.every((s, i) => new RegExp(`^Show media ${i + 1}:`).test(s.label || '')), 'Accessible positions are sequential despite source reordering', row.id);
  check(data.slides[0].active && data.slides[0].loading === 'eager' && data.slides[0].priority === 'high' && data.controlsId === data.galleryId, 'First infographic is active and prioritized; control targets its gallery', row.id);
}
async function layoutCase(page, row) {
  const data = await page.locator('sj-product').evaluate(p => { const controls = p.querySelector('.sj-product__gallery-controls'), rect = controls.getBoundingClientRect(), selector = ['[data-sj-gallery-autoplay]', '[data-sj-gallery-prev]', '[data-sj-gallery-next]']; return { width: innerWidth, documentWidth: document.documentElement.scrollWidth, h1Count: document.querySelectorAll('h1').length, theme: document.documentElement.dataset.theme, controls: { left: rect.left, right: rect.right, width: rect.width }, buttons: selector.map(s => { const e = p.querySelector(s), r = e.getBoundingClientRect(); return { selector: s, left: r.left, right: r.right, width: r.width, height: r.height, visible: !e.hidden && getComputedStyle(e).display !== 'none' }; }) }; });
  row.layout = data;
  check(data.documentWidth <= data.width + 1 && data.h1Count === 1, 'One H1 and no page horizontal overflow', row.id, data);
  check(data.theme === row.theme, 'Requested theme is active', row.id);
  check(data.buttons.every(b => b.visible && b.left >= -1 && b.right <= data.width + 1 && b.height >= 44) && data.buttons[0].width >= 44, 'Rotation and arrow controls remain visible and usable', row.id, { buttons: data.buttons });
  await page.locator('.sj-product__media').screenshot({ path: path.join(SHOTS, `${row.id}.png`), animations: 'disabled' });
}
async function behaviorCase(page, row) {
  const initial = await waitState(page, 'playing');
  check(initial.visibleRatio >= .5 && initial.label === 'Pause slideshow' && initial.live === 'off', 'Visible image gallery starts rotating silently', row.id, initial);
  await play(page); let before = await state(page);
  await tick(page, 7999); check((await state(page)).index === before.index, 'No automatic advance before eight seconds', row.id);
  await tick(page, 1); let after = await state(page);
  check(after.index === (before.index + 1) % 12 && after.live === 'off' && after.status === before.status, 'Eight-second advance changes image without live announcement', row.id, { before, after });
  await toggle(page); before = await state(page); await tick(page, 16000); after = await state(page);
  check(after.index === before.index && after.state === 'paused' && after.label === 'Play slideshow' && after.live === 'polite', 'Pause button stops rotation and exposes explicit Play', row.id);
  await play(page); before = await state(page); await tick(page, 8000);
  check((await state(page)).index === (before.index + 1) % 12, 'Explicit Play resumes automatic advances', row.id);
  await click(page, '[data-sj-gallery-next]'); after = await state(page); before = after;
  check(after.state === 'paused' && after.live === 'polite' && after.status.includes(`Media ${after.index + 1} of 12`), 'Manual next arrow pauses and politely announces selection', row.id);
  await tick(page, 16000); check((await state(page)).index === before.index, 'Manual browsing stays paused until explicit Play', row.id, { before, after: await state(page) });
  await click(page, '[data-sj-gallery-prev]'); check((await state(page)).index === (before.index + 11) % 12, 'Previous arrow browses backward while paused', row.id, { before, after: await state(page) });
  await page.locator('[data-sj-gallery]').focus(); await page.keyboard.press('End'); await finishMotion(page);
  check((await state(page)).index === 11 && (await state(page)).state === 'paused', 'End key selects last source frame and pauses', row.id, await state(page));
  await visible(page); await play(page); await tick(page, 8000); check((await state(page)).index === 0, 'Autoplay wraps last image to first', row.id);
  await page.locator('[data-sj-gallery]').focus(); await page.keyboard.press('ArrowRight'); await finishMotion(page);
  check((await state(page)).index === 1 && (await state(page)).state === 'paused', 'Keyboard arrow browses and pauses rotation', row.id, await state(page));
  await page.keyboard.press('Home'); await finishMotion(page); check((await state(page)).index === 0, 'Home key returns to first infographic', row.id, await state(page));
  await page.locator('[data-sj-thumbnail]').nth(2).click({ force: true }); await finishMotion(page);
  check((await state(page)).index === 2 && (await state(page)).state === 'paused', 'Thumbnail selects its reordered source and pauses', row.id, await state(page));
  await visible(page); await play(page); await page.locator('[data-sj-media].is-active [data-sj-zoom]').click({ force: true }); await finishMotion(page);
  check(await page.locator('[data-sj-zoom-dialog]').evaluate(e => e.open) && (await state(page)).state === 'paused', 'Opening the image zoom pauses rotation', row.id);
  before = await state(page); await tick(page, 16000); check((await state(page)).index === before.index, 'Zoomed image stays stable', row.id);
  await page.keyboard.press('Escape'); await finishMotion(page);
  check(!await page.locator('[data-sj-zoom-dialog]').evaluate(e => e.open) && (await state(page)).state === 'paused' && await page.locator('[data-sj-media].is-active [data-sj-zoom]').evaluate(e => e === document.activeElement), 'Closing zoom preserves pause and returns focus', row.id);
  await visible(page); await play(page); before = await state(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await finishMotion(page); after = await waitState(page, 'waiting');
  check(after.visibleRatio < .5, 'Below 50% visibility suspends the gallery timer', row.id, after);
  await tick(page, 16000); check((await state(page)).index === before.index, 'Offscreen gallery does not advance', row.id);
  await visible(page); await waitState(page, 'playing');
  // Let native intersection delivery settle, then reset the timer through the actual button.
  await play(page); before = await state(page); await tick(page, 7999); check((await state(page)).index === before.index, 'Returning on screen waits a fresh full interval', row.id);
  await tick(page, 1); check((await state(page)).index === (before.index + 1) % 12, 'Visible gallery resumes after the fresh interval', row.id);
  await layoutCase(page, row);
}
async function lifecycleCase(page, row) {
  await waitState(page, 'playing'); await play(page); let before = await state(page);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
  check((await state(page)).state === 'waiting', 'Simulated hidden-document event suspends native timer', row.id);
  await tick(page, 24000); check((await state(page)).index === before.index, 'Hidden-document fixture does not advance', row.id);
  await page.evaluate(() => { delete document.hidden; delete document.visibilityState; document.dispatchEvent(new Event('visibilitychange')); });
  await waitState(page, 'playing'); before = await state(page); await tick(page, 7999); check((await state(page)).index === before.index, 'Visible-document event starts a fresh eight-second interval', row.id); await tick(page, 1); check((await state(page)).index === (before.index + 1) % 12, 'Visible-document fixture resumes native rotation', row.id);
  const rail = await page.locator('.sj-product__thumbnails').boundingBox();
  await page.mouse.move(rail.x + rail.width / 2, rail.y + rail.height / 2); await page.mouse.wheel(220, 0); await settle(page);
  check((await state(page)).state === 'paused', 'Horizontal thumbnail-rail wheel interaction pauses rotation', row.id);
  await play(page); await page.mouse.move(rail.x + rail.width / 2, rail.y + rail.height / 2); await page.keyboard.down('Shift'); await page.mouse.wheel(0, 120); await page.keyboard.up('Shift'); await settle(page);
  check((await state(page)).state === 'paused', 'Shift-wheel thumbnail-rail interaction pauses rotation', row.id);
  await play(page); await page.locator('[data-sj-variant]').dispatchEvent('change');
  check((await state(page)).state === 'paused', 'Variant selection pauses gallery rotation', row.id);
  await visible(page); await play(page); await page.locator('[data-sj-media].is-active [data-sj-zoom]').focus();
  check((await state(page)).state === 'paused', 'Keyboard focus into gallery media pauses rotation', row.id);
  await play(page); before = await state(page);
  await page.locator('sj-product').evaluate(p => { window.__detachedGalleryQA = p; p.remove(); }); await tick(page, 24000);
  const detached = await page.evaluate(() => { const p = window.__detachedGalleryQA; return { index: [...p.querySelectorAll('[data-sj-media]')].findIndex(s => s.classList.contains('is-active')), connected: p.isConnected, ready: p.ready }; });
  check(detached.index === before.index && !detached.connected && detached.ready === false, 'Disconnected section stops its timer and tears down lifecycle', row.id, detached);
}
async function swipeCase(page, row) {
  await waitState(page, 'playing'); await play(page); const before = await state(page);
  const rect = await page.locator('[data-sj-gallery]').boundingBox(), cdp = await page.context().newCDPSession(page), y = Math.max(120, Math.min(650, rect.y + rect.height / 2)), start = rect.x + rect.width * .85, end = rect.x + rect.width * .12;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start, y }] });
  for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start + (end - start) * i / 8, y }] }); await settle(page, 40); }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await settle(page, 1000);
  let after = await state(page); check(after.state === 'paused' && after.index !== before.index, 'Real touch swipe changes image and pauses automatic rotation', row.id, { before, after });
  before.index = after.index; await tick(page, 16000); check((await state(page)).index === before.index, 'Touch browsing stays paused after the gesture', row.id);
  await layoutCase(page, row); await cdp.detach();
}
async function reducedCase(page, row) {
  let before = await state(page); await tick(page, 16000);
  check(before.state === 'paused' && before.label === 'Play slideshow' && (await state(page)).index === before.index, 'Reduced-motion preference defaults to a paused gallery', row.id);
  await play(page); before = await state(page); await tick(page, 8000); check((await state(page)).index === (before.index + 1) % 12, 'Explicit Play opts in under reduced motion', row.id);
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await settle(page); await page.emulateMedia({ reducedMotion: 'reduce' }); await settle(page);
  check((await state(page)).state === 'paused', 'Changing preference to reduced motion pauses ongoing rotation', row.id);
  await layoutCase(page, row);
}
async function fixtureCase(page, row) {
  let before = await state(page); await tick(page, 24000); let after = await state(page);
  check(before.state === 'unavailable' && before.buttonHidden && after.index === before.index, `${row.fixture} fixture has no visible rotation control and never autoplays`, row.id, { before, after });
  if (row.fixture !== 'single') { await click(page, '[data-sj-gallery-next]'); after = await state(page); check(after.index === 1 && after.state === 'unavailable' && after.live === 'polite', `Manual native ${row.fixture} selection remains available`, row.id, after); }
}
(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.SJ_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  try {
    for (const handle of HANDLES) await run(browser, { id: `order-${handle}`, handle, theme: 'light', width: 1440 }, orderCase);
    for (const width of [1440, 390]) for (const theme of ['light', 'dark']) await run(browser, { id: `behavior-${width}-${theme}`, width, theme }, behaviorCase);
    await run(browser, { id: 'lifecycle-desktop', theme: 'light', width: 1440 }, lifecycleCase);
    await run(browser, { id: 'swipe-mobile', theme: 'dark', width: 390 }, swipeCase);
    await run(browser, { id: 'reduced-motion-mobile', theme: 'light', width: 390, reduced: true }, reducedCase);
    for (const theme of ['light', 'dark']) await run(browser, { id: `controls-320-${theme}`, width: 320, theme }, layoutCase);
    for (const fixture of ['video', 'model', 'single']) await run(browser, { id: `native-${fixture}-fixture`, width: 1440, theme: 'light', fixture }, fixtureCase);
  } finally { await browser.close(); }
  report.summary = { status: report.issues.length ? 'FAIL' : 'PASS', scenarios: report.runs.length, checks: report.checks.length, passed: report.checks.filter(c => c.pass).length, failures: report.issues.length };
  fs.writeFileSync(path.join(__dirname, 'GALLERY-AUTOPLAY-QA.json'), JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(path.join(__dirname, 'GALLERY-AUTOPLAY-QA.md'), ['# Product gallery autoplay QA — ' + report.summary.status, '', 'Local preview verification of infographic-first order and controlled image rotation. Existing images are reused; no Shopify operations or source modifications are performed by this test.', '', ...Object.entries(report.summary).map(([k, v]) => `- ${k}: ${v}`), '', '| Scenario | Result |', '|---|---|', ...report.runs.map(r => `| ${r.id} | ${r.status} |`), '', '## Coverage', '', 'All six actual products retain twelve unique assets in source order 11, 12, 08, 09, 10, 01, 02, 03, 04, 05, 06, 07. Desktop 1440 and mobile 390 cover Light and Dark; 320px controls are checked in both themes. Tests exercise eight-second timing, silent automatic changes, explicit pause/play, wrap, manual arrows/thumbnail/keyboard, native zoom and focus return, real touch swipe, offscreen suspension, reduced motion, variant/focus pausing, and disconnected cleanup.', '', '## Explicit test boundaries', '', ...report.limits.map(l => '- ' + l), '', '## Issues', '', ...(report.issues.length ? report.issues.map(i => `- ${i.id}: ${i.label}. ${i.error || JSON.stringify(i)}`) : ['No automated failures.']), '', 'Screenshots: `screenshots/gallery-autoplay/`. Detailed machine evidence: `GALLERY-AUTOPLAY-QA.json`.'].join('\n') + '\n');
  console.log(JSON.stringify(report.summary, null, 2)); if (report.issues.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
