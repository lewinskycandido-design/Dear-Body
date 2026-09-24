/** Six focused browser cases using actual rendered catalog/profile data; no injected fixtures. */
const { chromium } = require('/Users/wetrade/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { rank, poolFor, normalize } = require('../theme/assets/sj-finder.js');
const BASE = process.env.SJ_PREVIEW_URL || 'http://127.0.0.1:4208';
const SHOTS = path.join(__dirname, 'screenshots/finder-single-result');
const KEYS = ['collection', 'mood', 'character', 'occasion', 'intensity'];
const skips = { collection: '', mood: '', character: '', occasion: '', intensity: '' };
const cases = [
  { id: 'ranked-women-light-desktop', theme: 'light', width: 1440, kind: 'ranked', answers: { collection: 'Women', mood: 'Bright & playful', character: 'Creamy & fruity', occasion: 'Coffee & catch-ups', intensity: 'Soft & airy' } },
  { id: 'ranked-men-dark-mobile', theme: 'dark', width: 390, kind: 'ranked', answers: { collection: 'Men', mood: 'Warm & inviting', character: 'Warm spice', occasion: 'Evenings out', intensity: 'Rich & deep' } },
  { id: 'tie-men-light-mobile', theme: 'light', width: 390, kind: 'tie', answers: { ...skips, collection: 'Men', occasion: 'Evenings out' } },
  { id: 'all-skipped-dark-desktop', theme: 'dark', width: 1440, kind: 'discovery', answers: { ...skips } },
  { id: 'collection-women-light-mobile', theme: 'light', width: 390, kind: 'discovery', answers: { ...skips, collection: 'Women' } },
  { id: 'collection-men-dark-desktop', theme: 'dark', width: 1440, kind: 'discovery', answers: { ...skips, collection: 'Men' } }
];
const result = { generatedAt: new Date().toISOString(), base: BASE, fixtureInjection: false, nativeTests: [], runs: [], checks: [], issues: [] };
const check = (condition, label, context = {}) => { const row = { pass: Boolean(condition), label, ...context }; result.checks.push(row); if (!condition) result.issues.push(row); };
async function layout(page) { return page.evaluate(() => {
  const visible = e => !e.closest('[hidden]') && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0;
  const headingOverflow = [...document.querySelectorAll('[data-sj-finder] h1,[data-sj-finder] h2,[data-sj-finder] legend')].filter(visible).flatMap(e => {
    const range = document.createRange(); range.selectNodeContents(e); const rect = e.getBoundingClientRect();
    return [...range.getClientRects()].some(r => r.right > rect.right + 2 || r.left < rect.left - 2) ? [e.innerText] : [];
  });
  const grid = document.querySelector('[data-sj-finder-result-grid]');
  const gridRect = grid.getBoundingClientRect(), resultsRect = grid.parentElement.getBoundingClientRect();
  return { overflow: document.documentElement.scrollWidth > innerWidth, headingOverflow, h1Count: document.querySelectorAll('h1').length, gridWidth: gridRect.width, gridLeft: gridRect.left, resultsLeft: resultsRect.left, columns: getComputedStyle(grid).gridTemplateColumns, focusQuestion: document.activeElement === document.querySelector('[data-sj-finder-question]'), focusResult: document.activeElement === document.querySelector('[data-sj-finder-results] h2') };
}); }
async function complete(page, answers, id, record = true) {
  for (let step = 0; step < KEYS.length; step++) {
    const radios = page.locator('[data-sj-finder-choices] input[type=radio]');
    const options = await radios.evaluateAll(nodes => nodes.map(n => ({ name: n.name, value: n.value })));
    if (record) {
      check(options[0]?.name === KEYS[step], 'Question order is correct', { id, step: step + 1 });
      const view = await layout(page);
      check(view.h1Count === 1 && !view.overflow && !view.headingOverflow.length, 'Question has one H1 and no horizontal or heading overflow', { id, step: step + 1, layout: view });
    }
    const index = options.findIndex(o => o.value === answers[KEYS[step]]);
    if (index < 0) throw new Error(`Missing ${KEYS[step]} choice: ${answers[KEYS[step]]}`);
    await radios.nth(index).locator('xpath=..').click();
    await page.locator('[data-sj-finder-next]').click();
  }
  await page.locator('[data-sj-finder-results]').waitFor({ state: 'visible' });
}
async function run(browser, scenario) {
  const { id, theme, width, kind, answers } = scenario;
  const row = { ...scenario, errors: [] }; result.runs.push(row);
  const page = await browser.newPage({ viewport: { width, height: width < 500 ? 844 : 1000 }, reducedMotion: 'reduce' });
  page.on('pageerror', e => row.errors.push(e.message));
  try {
    const response = await page.goto(`${BASE}/pages/scent-finder?visual_theme=${theme}`, { waitUntil: 'networkidle' });
    check(response.ok(), 'Finder page responds successfully', { id, status: response.status() });
    await page.locator('[data-sj-finder-experience]').waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts.ready);
    check(await page.locator('html').getAttribute('data-theme') === theme, 'Requested visual theme is active', { id });
    const profiles = await page.locator('[data-sj-finder-data]').evaluate(e => JSON.parse(e.textContent));
    const ranked = rank(profiles, answers), pool = poolFor(profiles, answers);
    const expected = kind === 'discovery' ? pool[0] : ranked[0]?.profile;
    row.candidates = ranked.map(r => ({ handle: r.profile.handle, id: r.profile.id, score: r.score }));
    row.expected = expected?.handle;
    check(Boolean(expected), 'Actual native profile supplies the expected result', { id });
    if (kind === 'discovery') check(ranked.length === 0 && pool.length > 1, 'Skipped preferences produce no scored matches and retain the collection pool', { id, poolSize: pool.length });
    else check(ranked.length > 1, 'Ranking retains multiple positive candidates before UI selection', { id, count: ranked.length });
    if (kind === 'tie') {
      const tied = ranked.filter(r => r.score === ranked[0].score);
      const firstInPool = pool.find(p => tied.some(t => t.profile.id === p.id));
      check(tied.length > 1 && ranked[0].profile.id === firstInPool?.id, 'Equal top scores preserve first native catalog order', { id, tied: tied.map(r => r.profile.handle) });
    } else if (kind === 'ranked') check(ranked[0].score > ranked[1].score, 'Targeted path has a unique highest score', { id });
    await complete(page, answers, id);
    row.cards = await page.locator('[data-sj-finder-result-grid] [data-sj-finder-product]').evaluateAll(cards => cards.map(c => ({ id: c.dataset.sjFinderProduct, title: c.querySelector('h3').innerText, href: c.querySelector('h3 a').getAttribute('href'), price: c.querySelector('.sj-product-card__price').innerText, badge: c.querySelector('.sj-product-card__badge')?.innerText || '', label: c.querySelector('[data-sj-match-label]').innerText, reason: c.querySelector('[data-sj-match-reason]').innerText })));
    row.summary = await page.locator('[data-sj-finder-result-summary]').innerText();
    row.layout = await layout(page);
    check(row.cards.length === 1, 'Exactly one product result is rendered', { id, count: row.cards.length });
    const card = row.cards[0];
    check(card?.id === String(expected.id), 'Only the highest ranked or first discovery scent is shown', { id, expected: expected.handle, actual: card?.title });
    check(card?.label === (kind === 'discovery' ? 'A SCENT TO EXPLORE' : 'YOUR SCENT MATCH'), 'Result label honestly distinguishes recommendation and discovery', { id, label: card?.label });
    check(await page.locator('[data-sj-finder-step]').innerText() === 'YOUR RESULT' && await page.locator('[data-sj-finder-results] > .sj-eyebrow').innerText() === 'YOUR SCENT' && await page.locator('[data-sj-finder-status]').innerText() === '1 scent to explore.', 'Progress, eyebrow and accessible status use singular wording', { id });
    check(!/\b(these|matches|fragrances|scents)\b/i.test(row.summary), 'Summary contains no plural result claim', { id, summary: row.summary });
    if (kind === 'discovery') check(/kept your options open/i.test(row.summary) && /this scent/i.test(row.summary) && !/\d+\s*%|perfect|best match|recommended|connects with your choices/i.test(row.summary + card?.reason), 'Skipped answers honestly offer one scent without a preference-match claim', { id });
    else check(/your recommended scent/i.test(row.summary) && /Connects with your choices:/.test(card?.reason), 'Ranked result explains its actual selected traits', { id });
    if (answers.collection) check(expected.collection === answers.collection, 'Result respects the collection hard filter', { id, collection: expected.collection });
    const bank = await page.locator(`[data-sj-finder-card-bank] [data-sj-finder-product="${card.id}"]`).evaluate(c => ({ price: c.querySelector('.sj-product-card__price').innerText, badge: c.querySelector('.sj-product-card__badge')?.innerText || '' }));
    check(card.price.replace(/\s+/g, '') === bank.price.replace(/\s+/g, '') && card.badge === bank.badge, 'Native price and availability are preserved', { id, price: card.price, badge: card.badge });
    check(card.href === `/products/${expected.handle}`, 'Result links to its actual product', { id, href: card.href });
    check(row.layout.h1Count === 1 && !row.layout.overflow && !row.layout.headingOverflow.length, 'Results have one H1 and no horizontal or heading overflow', { id, layout: row.layout });
    check(row.layout.gridWidth <= 442 && row.layout.columns.split(' ').length === 1 && Math.abs(row.layout.gridLeft - row.layout.resultsLeft) < 2, 'Single result uses one left-aligned column at most 440px wide', { id, layout: row.layout });
    check(row.layout.focusResult, 'Completion focuses the result heading', { id });
    await page.locator('[data-sj-finder-results]').screenshot({ path: path.join(SHOTS, `${id}.png`) });
    await page.locator('[data-sj-finder-results] [data-sj-finder-reset]').click();
    const reset = await page.locator('[data-sj-finder-choices] input').evaluateAll(nodes => ({ key: nodes[0]?.name, checked: nodes.some(n => n.checked) }));
    check(reset.key === 'collection' && !reset.checked && await page.locator('[data-sj-finder-results]').isHidden() && await page.locator('[data-sj-finder-next]').isDisabled() && (await layout(page)).focusQuestion, 'Reset clears answers, hides the result and focuses the first question', { id });
    await complete(page, answers, id, false);
    check(await page.locator('[data-sj-finder-result-grid] [data-sj-finder-product]').count() === 1, 'Repeating the quiz after reset still produces one result', { id });
    await Promise.all([page.waitForURL(`**/products/${expected.handle}`), page.locator('[data-sj-finder-result-grid] h3 a').click()]);
    await page.waitForLoadState('domcontentloaded');
    row.destination = { url: page.url(), h1Count: await page.locator('h1').count(), h1: await page.locator('h1').first().innerText() };
    check(row.destination.h1Count === 1 && normalize(row.destination.h1) === normalize(expected.title), 'Clicking the result opens the correct product with one H1', { id, destination: row.destination });
    check(row.errors.length === 0, 'No browser JavaScript errors', { id, errors: row.errors });
  } catch (error) {
    row.failure = error.message; check(false, 'Focused browser case completed', { id, error: error.message });
    await page.screenshot({ path: path.join(SHOTS, `failure-${id}.png`), fullPage: true }).catch(() => {});
  } finally {
    row.status = result.issues.some(issue => issue.id === id) ? 'FAIL' : 'PASS';
    console.log(row.status, id, row.cards?.map(c => c.title).join(' / ') || row.failure || ''); await page.close();
  }
}
(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  for (const script of ['finder-dom-qa.cjs', 'finder-scoring-qa.cjs']) {
    try { const output = execFileSync(process.execPath, [path.join(__dirname, script)], { encoding: 'utf8' }); result.nativeTests.push({ script, pass: true, output }); check(true, 'Native test passes', { script }); }
    catch (error) { result.nativeTests.push({ script, pass: false, output: String(error.stdout || '') + String(error.stderr || '') }); check(false, 'Native test passes', { script }); }
  }
  const browser = await chromium.launch({ headless: true, executablePath: process.env.SJ_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  try { for (const scenario of cases) await run(browser, scenario); } finally { await browser.close(); }
  result.summary = { status: result.issues.length ? 'FAIL' : 'PASS', browserCases: result.runs.length, nativeTests: result.nativeTests.length, checks: result.checks.length, passedChecks: result.checks.filter(c => c.pass).length, issues: result.issues.length };
  fs.writeFileSync(path.join(__dirname, 'FINDER-SINGLE-RESULT-QA.json'), JSON.stringify(result, null, 2) + '\n');
  const lines = ['# Scent Finder single-result QA — ' + result.summary.status, '', 'Focused verification of the actual local preview using native profile and product data. No profile/catalog injection. This report supersedes the earlier multi-result UI expectation; the prior broad browser report remains historical baseline evidence.', '', '## Results', '', ...Object.entries(result.summary).map(([key, value]) => `- ${key}: ${value}`), '', '| Case | Theme | Width | Expected product | Result |', '|---|---|---:|---|---|', ...result.runs.map(r => `| ${r.id} | ${r.theme} | ${r.width} | ${r.expected || '—'} | ${r.status} |`), '', '## Coverage', '', 'Ranked Women and Men paths retain multiple positive candidates in the ranking API but render only the highest. Tied scores preserve catalog order. All-skipped and collection-only paths show one honestly labelled discovery suggestion. Every case checks singular wording and accessible status, native price/availability, collection filtering, reset, repeat completion, product navigation, focus, one H1, horizontal/heading overflow, and the left-aligned column limited to 440px. Light/Dark desktop/mobile are covered.', '', 'Native DOM test covers targeted Rtulle, all-skipped, collection-only and tied first results alongside required answers, answer persistence and focus. The existing scoring suite retains all candidates and verifies all six current profiles can be the top result.', '', '## Issues', '', ...(result.issues.length ? result.issues.map(i => `- ${i.label}: ${JSON.stringify(i)}`) : ['No automated failures.']), '', 'Screenshots: `screenshots/finder-single-result/`. Machine evidence: `FINDER-SINGLE-RESULT-QA.json`. Visual inspection is recorded below after review. This is local preview QA; no Shopify Admin changes or checkout tests were performed.'];
  fs.writeFileSync(path.join(__dirname, 'FINDER-SINGLE-RESULT-QA.md'), lines.join('\n') + '\n');
  console.log(JSON.stringify(result.summary, null, 2));
  if (result.issues.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
