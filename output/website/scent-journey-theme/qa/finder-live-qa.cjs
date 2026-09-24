/** Browser QA of actual rendered Finder; never injects catalog/profile fixtures. */
const { chromium } = require('/Users/wetrade/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const BASE = process.env.SJ_PREVIEW_URL || 'http://127.0.0.1:4208';
const SHOTS = path.join(ROOT, 'screenshots', 'finder-live');
const SNAPSHOT = JSON.parse(fs.readFileSync(path.join(ROOT, '../preview/shopify-public-snapshot.json'), 'utf8'));
const AXE = path.join(ROOT, 'node_modules/axe-core/axe.min.js');
const KEYS = ['collection', 'mood', 'character', 'occasion', 'intensity'];
const normalize = s => String(s ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
const tags = v => Array.isArray(v) ? v : typeof v === 'string' ? v.split(/[,;|\n]+/).map(s => s.trim()).filter(Boolean) : [];
const products = new Map(SNAPSHOT.products.map(p => [String(p.id), p]));
const result = { generatedAt: new Date().toISOString(), base: BASE, source: SNAPSHOT.source, snapshot: SNAPSHOT.fetched_at, fixtureInjection: false, checks: [], runs: [], accessibility: [], productLinks: [], issues: [] };
const check = (condition, label, context = {}) => { const row = { pass: Boolean(condition), label, ...context }; result.checks.push(row); if (!condition) result.issues.push(row); return condition; };
const selectors = { question: '[data-sj-finder-question]', choices: '[data-sj-finder-choices]', next: '[data-sj-finder-next]', back: '[data-sj-finder-back]', form: '[data-sj-finder-form]', results: '[data-sj-finder-results]', grid: '[data-sj-finder-result-grid]' };
async function choices(page) { return page.locator(`${selectors.choices} input[type=radio]`).evaluateAll(inputs => inputs.map(i => ({ name: i.name, value: i.value, label: i.closest('label')?.innerText.trim(), checked: i.checked }))); }
async function select(page, value, keyboard = false) {
  const radios = page.locator(`${selectors.choices} input[type=radio]`);
  const values = await radios.evaluateAll(nodes => nodes.map(n => n.value));
  const index = values.indexOf(value);
  if (index < 0) throw new Error('Choice missing: ' + value);
  const radio = radios.nth(index);
  if (keyboard) { await radio.focus(); await page.keyboard.press('Space'); } else await radio.locator('xpath=..').click();
  if (!(await radio.isChecked())) throw new Error('Choice did not select: ' + value);
}
async function next(page, keyboard = false) { if (keyboard) { await page.locator(selectors.next).focus(); await page.keyboard.press('Enter'); } else await page.locator(selectors.next).click(); }
async function state(page) { return page.evaluate(() => {
  const visible = e => e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0;
  const headings = [...document.querySelectorAll('[data-sj-finder] h1,[data-sj-finder] h2,[data-sj-finder] legend')].filter(visible).map(e => {
    const range = document.createRange(); range.selectNodeContents(e); const b = e.getBoundingClientRect();
    return { text: e.innerText, overflow: [...range.getClientRects()].some(r => r.right > b.right + 2 || r.left < b.left - 2) };
  });
  return { overflow: document.documentElement.scrollWidth > innerWidth, headingOverflow: headings.filter(h => h.overflow), focus: { tag: document.activeElement?.tagName, question: document.activeElement === document.querySelector('[data-sj-finder-question]'), result: document.activeElement === document.querySelector('[data-sj-finder-results] h2') } };
}); }
async function axe(page, label, context) {
  if (!(await page.evaluate(() => Boolean(window.axe)))) await page.addScriptTag({ path: AXE });
  const scan = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
  const row = { label, ...context, passes: scan.passes.length, violations: scan.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(n => ({ target: n.target, html: n.html, summary: n.failureSummary })) })), incomplete: scan.incomplete.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) };
  result.accessibility.push(row); check(row.violations.length === 0, 'Axe has no WCAG A/AA violations', { label, ...context, violations: row.violations.length });
}
function collectionChoice(options, flow) {
  if (flow === 'women') return options.find(o => /\bwomen\b/i.test(o.value + ' ' + o.label))?.value;
  if (flow === 'men') return options.find(o => /\bmen\b/i.test(o.value + ' ' + o.label) && !/\bwomen\b/i.test(o.value + ' ' + o.label))?.value;
  return options.find(o => o.value === '')?.value ?? options.find(o => /\b(open|all|both|any)\b/i.test(o.value + ' ' + o.label))?.value;
}
async function visibleCards(page) { return page.locator(`${selectors.grid} [data-sj-finder-product]`).evaluateAll(cards => cards.map(c => ({ id: c.dataset.sjFinderProduct, title: c.querySelector('h3')?.innerText, url: c.querySelector('a[href*="/products/"]')?.getAttribute('href'), price: c.querySelector('.sj-product-card__price')?.innerText, badge: c.querySelector('.sj-product-card__badge')?.innerText || '', reason: c.querySelector('[data-sj-match-reason]')?.innerText || '' }))); }
async function run(browser, theme, width, flow) {
  const context = { theme, width, flow };
  const row = { ...context, questions: [], errors: [] };
  result.runs.push(row);
  const page = await browser.newPage({ viewport: { width, height: width < 500 ? 844 : 1000 }, reducedMotion: 'reduce' });
  page.on('pageerror', e => row.errors.push(e.message));
  try {
    await page.goto(`${BASE}/pages/scent-finder?visual_theme=${theme}`, { waitUntil: 'networkidle' });
    await page.locator('[data-sj-finder-experience]').waitFor({ state: 'visible', timeout: 8000 });
    await page.evaluate(() => document.fonts.ready);
    const data = await page.locator('[data-sj-finder-data]').evaluate(e => JSON.parse(e.textContent));
    check(data.length === 6 && data.every(p => products.has(String(p.id))) && new Set(data.map(p => String(p.id))).size === 6, 'Actual six-product catalog fallback rendered', context);
    row.catalogIds = data.map(p => String(p.id));
    const bank = await page.locator('[data-sj-finder-card-bank] [data-sj-finder-product]').evaluateAll(cards => cards.map(c => ({ id: c.dataset.sjFinderProduct, price: c.querySelector('.sj-product-card__price')?.innerText, badge: c.querySelector('.sj-product-card__badge')?.innerText || '' })));
    check(bank.length === 6, 'Real card bank contains six products', context);
    check(Number(await page.locator('[data-sj-finder-progress]').getAttribute('max')) === 5, 'Quiz has five questions', context);
    if (flow === 'women') { await page.locator('[data-sj-finder-experience]').screenshot({ path: path.join(SHOTS, `quiz-${theme}-${width}.png`) }); await axe(page, 'quiz', context); }
    const target = data.find(p => flow === 'open' || flow === 'skip' || SNAPSHOT.memberships[flow === 'women' ? 'womens-perfume' : 'mens-perfume'].includes(products.get(String(p.id))?.handle));
    const keyboard = theme === 'light' && width === 1440 && flow === 'women';
    for (let step = 0; step < 5; step++) {
      const options = await choices(page);
      const key = options[0]?.name;
      check(key === KEYS[step], 'Question order and key correct', { ...context, step: step + 1, actual: key, expected: KEYS[step] });
      const view = await state(page);
      check(!view.overflow && !view.headingOverflow.length, 'Quiz has no horizontal or heading overflow', { ...context, step: step + 1, ...view });
      let value;
      if (step === 0) value = collectionChoice(options, flow === 'skip' ? 'open' : flow);
      else if (flow === 'skip') value = options.find(o => o.value === '')?.value;
      else value = options.find(o => tags(target?.[key]).some(t => normalize(t) === normalize(o.value)))?.value ?? options.find(o => o.value !== '')?.value;
      if (value === undefined) throw new Error(`Cannot find ${flow} choice for ${key}`);
      await select(page, value, keyboard);
      row.questions.push({ key, value, labels: options.map(o => o.label) });
      await next(page, keyboard);
      const after = await state(page);
      check(step === 4 ? after.focus.result : after.focus.question, 'Focus moves to the new question/results heading', { ...context, step: step + 1, focus: after.focus });
      if (step === 1 && flow === 'women') {
        await page.locator(selectors.back).click();
        let old = await choices(page); check(old.find(o => o.checked)?.value === value, 'Back preserves mood selection', context);
        await page.locator(selectors.back).click(); old = await choices(page); check(old.find(o => o.checked)?.value === row.questions[0].value, 'Back preserves collection selection', context);
        await next(page); old = await choices(page); check(old.find(o => o.checked)?.value === value, 'Forward preserves prior answer', context); await next(page);
      }
    }
    await page.locator(selectors.results).waitFor({ state: 'visible' });
    await page.waitForLoadState('networkidle');
    row.cards = await visibleCards(page);
    row.summary = await page.locator('[data-sj-finder-result-summary]').innerText();
    row.resultState = await state(page);
    check(row.cards.length === 1, 'Results contain exactly one real product card', context);
    check(!row.resultState.overflow && !row.resultState.headingOverflow.length, 'Results have no horizontal or heading overflow', context);
    for (const card of row.cards) {
      const product = products.get(String(card.id));
      check(Boolean(product) && card.url === `/products/${product?.handle}`, 'Result link is a real product', { ...context, id: card.id, url: card.url });
      if (flow === 'women' || flow === 'men') check(SNAPSHOT.memberships[flow === 'women' ? 'womens-perfume' : 'mens-perfume'].includes(product?.handle), 'Collection filter excludes other collection', { ...context, handle: product?.handle });
      const original = bank.find(p => p.id === card.id);
      check(String(card.price).replace(/\s+/g, '') === String(original?.price).replace(/\s+/g, '') && card.badge === original?.badge, 'Live price and availability display preserved', { ...context, handle: product?.handle, price: card.price, badge: card.badge });
      const available = product?.variants.some(v => v.available);
      check(available ? !/sold out/i.test(card.badge) : /sold out/i.test(card.badge), 'Sold-out badge matches catalog snapshot', { ...context, handle: product?.handle });
    }
    if (flow === 'skip') check(/discovery|explore|open mind/i.test(row.summary) && !/\d+\s*%|perfect match|best match/i.test(row.summary + row.cards.map(c => c.reason).join(' ')), 'All-skipped results honestly describe discovery', context);
    await page.locator(selectors.results).screenshot({ path: path.join(SHOTS, `results-${flow}-${theme}-${width}.png`) });
    if (flow === 'women') await axe(page, 'results', context);
    await page.locator(`${selectors.results} [data-sj-finder-reset]`).click();
    const resetOptions = await choices(page);
    check(resetOptions[0]?.name === 'collection' && !resetOptions.some(o => o.checked) && await page.locator(selectors.results).isHidden(), 'Reset clears answers and returns to collection', context);
    check((await state(page)).focus.question, 'Reset focuses first question', context);
    check(row.errors.length === 0, 'No JavaScript page errors', { ...context, errors: row.errors });
    row.status = result.issues.some(i => i.theme === theme && i.width === width && i.flow === flow) ? 'FAIL' : 'PASS';
    console.log(row.status, theme, width, flow, row.cards.map(c => c.title).join(' / '));
  } catch (error) { row.status = 'FAIL'; row.failure = error.message; check(false, 'Browser flow completed', { ...context, error: error.message }); console.log('FAIL', theme, width, flow, error.message); await page.screenshot({ path: path.join(SHOTS, `failure-${flow}-${theme}-${width}.png`), fullPage: true }).catch(() => {}); }
  finally { await page.close(); }
}
(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  for (const theme of ['light', 'dark']) for (const width of [1440, 390]) for (const flow of ['women', 'men', 'open', 'skip']) await run(browser, theme, width, flow);
  const page = await browser.newPage();
  for (const product of SNAPSHOT.products) { const url = `${BASE}/products/${product.handle}`; const response = await page.goto(url, { waitUntil: 'domcontentloaded' }); const h1 = await page.locator('h1').innerText(); const row = { handle: product.handle, status: response.status(), h1, pass: response.ok() && normalize(h1) === normalize(product.title) }; result.productLinks.push(row); check(row.pass, 'Product destination responds with correct identity', row); }
  await browser.close();
  result.summary = { status: result.issues.length ? 'FAIL' : 'PASS', runs: result.runs.length, checks: result.checks.length, passedChecks: result.checks.filter(c => c.pass).length, axeScans: result.accessibility.length, axeViolations: result.accessibility.reduce((n, s) => n + s.violations.length, 0), productDestinations: result.productLinks.length, issues: result.issues.length };
  fs.writeFileSync(path.join(ROOT, 'FINDER-LIVE-QA.json'), JSON.stringify(result, null, 2));
  const lines = ['# Scent Finder live browser QA — ' + result.summary.status, '', 'Actual local preview and real six-product data. No fixture/profile/catalog injection.', '', '## Totals', '', ...Object.entries(result.summary).map(([k,v]) => `- ${k}: ${v}`), '', '## Flow matrix', '', '| Theme | Width | Path | Result |', '|---|---:|---|---|', ...result.runs.map(r => `| ${r.theme} | ${r.width} | ${r.flow} | ${r.status} |`), '', '## Coverage', '', 'Five-question order; collection filter; real IDs, links, prices and sold-out badges; Women/Men/open choices; all-skipped discovery; back/forward answer persistence; reset; keyboard selection/submission; focus transfer; overflow; WCAG A/AA axe scans on quiz and results; actual product destinations.', '', 'Axe is automated coverage, not a substitute for assistive-technology user testing. Incomplete manual-review items are preserved in the JSON.', '', '## Issues', '', ...(result.issues.length ? result.issues.map(i => `- ${i.label}: ${JSON.stringify(i)}`) : ['No automated failures. Screenshot visual review is recorded separately after inspection.']), '', 'Screenshots: `screenshots/finder-live/`. Machine results: `FINDER-LIVE-QA.json`.'];
  fs.writeFileSync(path.join(ROOT, 'FINDER-LIVE-QA.md'), lines.join('\n') + '\n');
  console.log(JSON.stringify(result.summary, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
