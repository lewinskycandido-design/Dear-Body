/** Read-only native-render/static audit. Does not execute site JS, launch a browser or rebuild the preview. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const { JSDOM } = require('../preview/node_modules/jsdom');
const ROOT = path.resolve(__dirname, '..');
const HANDLES = ['mojito-metallique', 'amber-oud-silk', 'mistened-narcissus', 'charme-envoutant', 'oud-mirage', 'rtulle-satin'];
const ORDER = ['01', '11', '12', '08', '09', '05', '06', '07', '02', '03', '04', '10'];
const ROLES = ['Bottle and canister', 'Spray in motion', 'Packaging reveal', 'Magnetic cap detail', 'Lifestyle portrait', 'Product in hand', 'Everyday fragrance moment', 'Product profile', 'Ingredients and care', 'A scent journey', 'Scent description', 'Who it fits'];
// Immutable pre-redesign baseline captured from package-manifest.json before packaging this redesign.
const BASELINE = {
  archive: 'DearBody-Theme-Update-Shopify-Navigation.zip',
  archiveSha256: 'acdb575ac7248efa0f9418c756cf43a8bce55268b0ff03214da3d55d6812769b',
  manifestSha256: '38afc0b212f81be30a4c3d09a40f1bca9967509fcb815c5a206eef3330762d8d',
  jsSha256: 'eabb0958e5c5aceb773fb88c29016ddf54cf295b8c3642e7d1b2ba0bf12068da',
  galleryMethods: {
    disconnectedCallback: '947b1eefd342fa846a50f8aea1ac3b400e247a354485c6310dfea375339d9248',
    onGalleryKey: '4f6d978732f38a9f99639b5f23ad8a0f4c9005d4a57905e506efd4b64db54eb3',
    initGalleryRotation: 'eb11a9c01c74273af70ad6cf2238985bc14ba10096c3e180cc84472fabc1773a',
    pauseGalleryRotation: '691d6bce1a5980f313b2a535f877520e6ed04cf6335db7d9c87bbf137263c168',
    scheduleGalleryRotation: 'd0125ad40905a012d5f6fd4f30918670e2e7b8c95e21438e7415e987af8f082b',
    selectMedia: '7c58ff321d9ce07fe3ea81bc7d39dae6282accabc075fc7ce377d086bf13cb7d',
    onGalleryScroll: 'cbcab632724b5e5f0d78497b0006b81c98598803098931c488fff6b5baab926b',
    onViewportChange: '9c21e6e2b712ed79c38d635a10c24e99311fb4e445062118e754d8cd0e738fb0'
  },
  galleryBindings: {
    galleryClickHandling: 'fe1aa7f5903dc01223e26bcd3f989670d6012148af1e27c55a30f85e5523a7a1',
    galleryInteractionBindings: '7080bfdea112f53aa5e586604eb6340b0806020b594f5b582cdabfdeaec4c674',
    galleryViewportAndZoomBindings: 'fba5605ef990c71b4d8a9f2ef1f3bad9469f02f75a22d20e5aa7ba23b8a631df',
    galleryNodeBindings: '7aaf043b29ecf25cab1b07a822288e530c24f9eec2432c7709ddc104d911ce1d'
  },
  galleryAssetCount: 144,
  sortedPathAndHashDigest: '9c416cced5cda44c123bb9f491316e6968d751fd4709a59e28ad7fadfc3c229a'
};
const report = { generatedAt: new Date().toISOString(), scope: 'Static JSDOM, source and filesystem checks only', baseline: BASELINE, order: ORDER, products: [], checks: [], issues: [], limits: [
  'Site JavaScript is parsed but not executed. Gallery methods and event/node bindings retain the baseline source; checkout integration intentionally changes the complete product script. Runtime checkout and gallery interaction verification are separate.',
  'JSDOM has no layout engine. White backgrounds/object-fit are stylesheet declarations; actual dimensions, overflow, clicks, autoplay, swipe, zoom, Dark mode and contrast require the separately owned CUA review.',
  'Original asset immutability covers the 72 product gallery JPEGs and their 72 thumbnails. The generated frame PNG and website JPEG are separately checksum-locked in gallery-frame-assets.json.'
] };
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const read = relative => fs.readFileSync(path.join(ROOT, relative));
function check(pass, name, product = 'shared', details = {}) { const item = { product, name, pass: Boolean(pass), ...details }; report.checks.push(item); if (!item.pass) report.issues.push(item); }
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function filename(value) { return path.basename(new URL(value, 'https://preview.invalid').pathname); }

for (const handle of HANDLES) {
  const file = `preview/public/products/${handle}/index.html`;
  const dom = new JSDOM(read(file).toString());
  const doc = dom.window.document, product = doc.querySelector('sj-product');
  const gallery = product?.querySelector('[data-sj-gallery]');
  const slides = [...product.querySelectorAll('[data-sj-media]')];
  const thumbs = [...product.querySelectorAll('[data-sj-thumbnail]')];
  const expected = ORDER.map(n => `studio-${n}`);
  const title = doc.querySelector('h1')?.textContent.trim();
  const row = { handle, file, title, slides: slides.map(s => s.dataset.sjMedia), thumbnails: thumbs.map(t => t.dataset.sjThumbnail) };
  report.products.push(row);
  check(slides.length === 12 && same(row.slides, expected) && new Set(row.slides).size === 12, 'Twelve unique slides retain approved order', handle);
  check(thumbs.length === 12 && same(row.thumbnails, expected), 'Twelve thumbnails match slide order', handle);
  check(slides.every((s, i) => filename(s.querySelector('img').src) === `sj-${handle}-${ORDER[i]}.jpg` && filename(s.querySelector('[data-sj-zoom]').dataset.sjZoom) === `sj-${handle}-${ORDER[i]}.jpg`) && thumbs.every((t, i) => filename(t.querySelector('img').src) === `sj-${handle}-${ORDER[i]}-thumb.jpg`), 'Original source, thumbnail and zoom destinations remain paired', handle);
  check(slides.every(s => s.querySelectorAll('.sj-product__photo-frame').length === 1 && s.querySelector('.sj-product__photo-frame').parentElement.matches('[data-sj-zoom]') && s.querySelector('.sj-product__photo-frame').children.length === 1 && s.querySelector('.sj-product__photo-frame > img')), 'Every image has one frame wrapper inside the existing zoom button', handle);
  check(slides.every((s, i) => s.querySelector('img').alt === `${title} — ${ROLES[Number(ORDER[i]) - 1]}` && s.querySelector('[data-sj-zoom]').getAttribute('aria-label') === `Enlarge ${s.querySelector('img').alt}`), 'Product-specific image alt and zoom names remain accurate', handle);
  check(slides.every((s, i) => s.getAttribute('aria-label') === `${i + 1} of 12` && s.getAttribute('role') === 'group' && s.hasAttribute('inert') === (i !== 0) && s.classList.contains('is-active') === (i === 0)) && thumbs.every((t, i) => t.getAttribute('aria-pressed') === String(i === 0) && t.getAttribute('aria-label') === `Show media ${i + 1}: ${ROLES[Number(ORDER[i]) - 1]}`), 'Slide and thumbnail accessibility state matches sequence', handle);
  const first = slides[0].querySelector('img');
  check(first.loading === 'eager' || first.getAttribute('loading') === 'eager', 'First image remains eager', handle);
  check(first.getAttribute('fetchpriority') === 'high' && slides.slice(1).every(s => s.querySelector('img').getAttribute('loading') === 'lazy'), 'First image priority and remaining lazy loads preserved', handle);
  const arrows = [...product.querySelectorAll('[data-sj-gallery-prev], [data-sj-gallery-next]')];
  check(arrows.length === 2 && arrows.every(a => a.type === 'button' && a.getAttribute('aria-controls') === gallery.id && a.getAttribute('aria-label') && a.querySelector('svg[aria-hidden="true"][focusable="false"]')) && product.querySelectorAll('[data-sj-gallery-prev]').length === 1 && product.querySelectorAll('[data-sj-gallery-next]').length === 1, 'Exactly two accessible directional controls preserve hooks', handle);
  check(!product.querySelector('[data-sj-gallery-autoplay]') && ![...product.querySelectorAll('button')].some(b => /(?:play|pause) slideshow/i.test(b.getAttribute('aria-label') || b.textContent)), 'No Play or Pause slideshow control', handle);
  check(product.querySelector('[data-sj-gallery-current]').textContent.trim() === '1' && product.querySelector('[data-sj-gallery-total]').textContent.trim() === '12' && product.querySelector('[data-sj-gallery-status]').getAttribute('aria-live') === 'polite', 'Counter and manual announcement hooks remain intact', handle);
  check(gallery.tabIndex === 0 && gallery.getAttribute('aria-roledescription') === 'carousel' && product.querySelector('[data-sj-zoom-dialog]')?.tagName === 'DIALOG' && product.querySelector('[data-sj-zoom-canvas]') && product.querySelector('[data-sj-close-zoom]'), 'Keyboard carousel and native zoom dialog hooks remain intact', handle);
  check(product.querySelector('[data-sj-product-info]').tabIndex === 0 && doc.querySelectorAll('h1').length === 1, 'Independent information region and sole page H1 preserved', handle);
  const links = [...doc.querySelectorAll('link[rel="stylesheet"]')].map(l => filename(l.href));
  check(links.filter(n => n === 'sj-gallery-frame.css').length === 1 && links.indexOf('sj-gallery-frame.css') > links.indexOf('sj-product.css'), 'Frame stylesheet loads once after product stylesheet', handle);
  const ids = [...doc.querySelectorAll('[id]')].map(n => n.id);
  check(ids.length === new Set(ids).size, 'No duplicate rendered IDs', handle);
  dom.window.close();
}

const productJS = read('theme/assets/sj-product.js').toString();
report.productJavaScript = { currentSha256: hash(productJS), baselineSha256: BASELINE.jsSha256, reasonForWholeFileChange: 'Direct checkout replaces Add to bag, supports its native form and tolerates removed quantity/sticky controls.' };
let jsSyntaxValid = true;
try { new vm.Script(productJS, { filename: 'sj-product.js' }); } catch (error) { jsSyntaxValid = false; report.productJavaScript.syntaxError = error.message; }
check(jsSyntaxValid, 'Current product JavaScript parses successfully');
// Lock gallery-specific implementations from the verified prior archive, rather than
// rejecting intentional purchase-flow changes elsewhere in this shared component.
const methodStarts = [...productJS.matchAll(/^    (\w+)\([^\n]*\) \{/gm)];
const methods = Object.fromEntries(methodStarts.map((match, index) => [match[1], productJS.slice(match.index, methodStarts[index + 1]?.index ?? productJS.indexOf('\n  }', match.index)).trimEnd()]));
for (const [name, expected] of Object.entries(BASELINE.galleryMethods)) {
  const actual = methods[name] ? hash(methods[name]) : null;
  check(actual === expected, `Gallery method ${name} retains baseline behavior`, 'shared', { actualSha256: actual, expectedSha256: expected });
}
const sourceBlock = (start, end) => { const from = productJS.indexOf(start), to = productJS.indexOf(end, from); return from >= 0 && to > from ? productJS.slice(from, to).trimEnd() : ''; };
const galleryBindings = {
  galleryClickHandling: (() => { const start = productJS.indexOf('    onClick(event) {'), last = "      if (event.target.closest('[data-sj-close-zoom]')) this.zoomDialog?.close();", end = productJS.indexOf(last, start); return start >= 0 && end > start ? productJS.slice(start, end + last.length).trimEnd() : ''; })(),
  galleryInteractionBindings: sourceBlock("      listen(this, 'click'", '      listen(this.variantSelect'),
  galleryViewportAndZoomBindings: sourceBlock('      listen(this.desktop', "      listen(document, 'sj:cart-updated'"),
  galleryNodeBindings: sourceBlock('      this.gallery =', '      this.form =')
};
for (const [name, expected] of Object.entries(BASELINE.galleryBindings)) {
  check(hash(galleryBindings[name]) === expected, `${name} retains baseline event wiring`, 'shared', { actualSha256: hash(galleryBindings[name]), expectedSha256: expected });
}
check(productJS.includes("this.initGalleryRotation();") && productJS.includes('this.selectMedia(this.activeIndex, false, false, false);'), 'Gallery initialization remains connected to the component lifecycle');
const assets = [];
for (const handle of HANDLES) for (let i = 1; i <= 12; i++) for (const suffix of ['', '-thumb']) {
  const file = `assets/sj-${handle}-${String(i).padStart(2, '0')}${suffix}.jpg`;
  assets.push({ path: file, sha256: hash(read(`theme/${file}`)) });
}
assets.sort((a, b) => a.path.localeCompare(b.path));
const assetDigest = hash(assets.map(f => `${f.path} ${f.sha256}`).join('\n'));
report.originalAssets = { count: assets.length, digest: assetDigest, files: assets };
check(assets.length === BASELINE.galleryAssetCount && assetDigest === BASELINE.sortedPathAndHashDigest, 'All 72 original gallery images and 72 thumbnails are byte-identical to prior manifest', 'shared', { count: assets.length, digest: assetDigest });

const css = read('theme/assets/sj-gallery-frame.css').toString();
const cssDom = new JSDOM(`<style>${css}</style>`);
const rules = [...cssDom.window.document.styleSheets[0].cssRules];
const rule = selector => rules.find(r => r.selectorText === selector)?.style;
const frame = rule('.sj-product__photo-frame'), picture = rule('.sj-product__photo-frame img');
const white = value => /#fff\b|#ffffff\b|rgb\(255,\s*255,\s*255\)/i.test(value || '');
check(white(frame?.getPropertyValue('background')) && frame.getPropertyValue('background').includes('sj-gallery-frame-v1.jpg') && white(picture?.getPropertyValue('background')) && picture.getPropertyValue('object-fit') === 'contain', 'Shared frame and image stage declare white backgrounds with contained original artwork');
check(rule('.sj-product__arrow')?.getPropertyValue('background') === 'var(--gallery-red)' && rule('.sj-product__arrow[data-sj-gallery-next]')?.getPropertyValue('background') === 'var(--gallery-blue)' && parseInt(rule('.sj-product__arrow').getPropertyValue('width')) >= 44 && parseInt(rule('.sj-product__arrow').getPropertyValue('height')) >= 44, 'Colorful directional controls declare distinct colors and at least 44px targets');
cssDom.window.close();
const source = read('theme/sections/sj-product.liquid').toString();
const nativeImageBranch = source.split("when 'image'")[1]?.split("when 'video'")[0] || '';
check(nativeImageBranch.includes('sj-product__photo-frame') && ['video_tag', 'external_video_tag', 'model_viewer_tag'].every(token => source.includes(token)), 'Native image fallback receives frame while native video/external/3D branches remain present');
const frameArt = read('theme/assets/sj-gallery-frame-v1.jpg');
report.newFrame = { path: 'theme/assets/sj-gallery-frame-v1.jpg', bytes: frameArt.length, sha256: hash(frameArt) };
check(frameArt[0] === 0xff && frameArt[1] === 0xd8 && frameArt.length > 0, 'New generated frame JPEG is present');
const frameLocks = JSON.parse(read('qa/gallery-frame-assets.json'));
check(frameLocks.length === 1 && frameLocks[0].file === 'sj-gallery-frame-v1.jpg', 'Exactly one generated frame is locked');
const frameLock = frameLocks[0];
const originalFrame = read(frameLock.original);
check(hash(originalFrame) === frameLock.original_sha256 && originalFrame.length === frameLock.original_bytes, 'Generated frame original PNG matches its checksum lock');
check(hash(read(frameLock.source)) === frameLock.sha256 && hash(frameArt) === frameLock.sha256 && frameArt.length === frameLock.bytes, 'Generated frame website derivative matches its checksum lock');
report.newFrame.original = { path: frameLock.original, bytes: originalFrame.length, sha256: hash(originalFrame) };
report.summary = { status: report.issues.length ? 'FAIL' : 'PASS', products: report.products.length, checks: report.checks.length, passed: report.checks.filter(c => c.pass).length, failures: report.issues.length };
fs.writeFileSync(path.join(__dirname, 'GALLERY-FRAME-STATIC-QA.json'), JSON.stringify(report, null, 2) + '\n');
fs.writeFileSync(path.join(__dirname, 'GALLERY-FRAME-STATIC-QA.md'), [
  '# Gallery frame static QA — ' + report.summary.status, '',
  `${report.summary.passed}/${report.summary.checks} checks across all six rendered product routes.`, '',
  'Approved order: ' + ORDER.join(', ') + '.', '',
  'All six galleries retain 12 matching images/thumbnails, accurate alt and sequence labels, paired zoom sources, two directional controls, no Play control, the new photo-frame wrappers and existing accessibility hooks. The frame stylesheet declares a white image stage and contained artwork.', '',
  'All 144 original gallery/thumbnail JPEGs match the immutable pre-redesign baseline. Eight gallery methods, the gallery portion of the click handler and three event/node binding blocks retain their baseline source, including autoplay, manual pause, keyboard, swipe, zoom and cleanup. Purchase-only quantity/reveal handling may change independently; it is excluded from the click-handler lock. The generated frame PNG and JPEG match their separate checksum locks.', '',
  '## Boundaries', '', ...report.limits.map(v => '- ' + v), '',
  'No source files, preview pages or packages were changed. Root owns CUA click/layout and visual evidence.', '',
  '## Issues', '', ...(report.issues.length ? report.issues.map(v => `- ${v.product}: ${v.name}`) : ['No static failures.']), '',
  'Machine evidence: GALLERY-FRAME-STATIC-QA.json. Repeat with `node qa/gallery-frame-static-qa.cjs`.'
].join('\n') + '\n');
console.log(JSON.stringify(report.summary, null, 2));
if (report.issues.length) { console.log(JSON.stringify(report.issues, null, 2)); process.exitCode = 1; }
