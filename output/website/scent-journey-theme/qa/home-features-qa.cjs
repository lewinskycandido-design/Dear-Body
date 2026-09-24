/* Focused local homepage feature QA; no store or cart mutations. */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {chromium}=require('./node_modules/playwright-core');
const ROOT=path.resolve(__dirname,'..'),DIR=path.join(__dirname,'screenshots/home-features'),BASE='http://127.0.0.1:4208';
const kinds=[{name:'magnetic',file:'sj-home-magnetic-cap.jpg'},{name:'collectible',file:'sj-home-collectible.jpg'},{name:'shipping',file:'sj-home-free-shipping.jpg'}];
const report={generatedAt:new Date().toISOString(),scope:'Three homepage photo features, 320/390/768/1440, Light/Dark. No live writes.',cases:[],failures:[]};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const close=(a,b)=>Math.abs(a-b)<1.1;
async function run(browser,width,theme){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
    await page.goto(BASE+'/?visual_theme='+theme,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
    for(const item of kinds){
      const row={kind:item.name,width,theme,checks:[],errors};report.cases.push(row);
      const check=(pass,label,data)=>{row.checks.push({pass:!!pass,label,...(data===undefined?{}:{data})});if(!pass)report.failures.push({kind:item.name,width,theme,label,data})};
      const selector='.sj-home-feature--'+item.name,loc=page.locator(selector);
      await loc.scrollIntoViewIfNeeded();await loc.locator('img').evaluate(i=>i.decode());
      const m=await loc.evaluate(el=>{
        const rect=e=>{let b=e.getBoundingClientRect();return{x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width,height:b.height}},img=el.querySelector('img'),copy=el.querySelector('.sj-home-feature__copy');
        const nodes=[...copy.querySelectorAll('h2,p,a')];
        return{banner:rect(el),copy:rect(copy),image:{...rect(img),src:img.currentSrc,loaded:img.complete&&img.naturalWidth>0,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,objectPosition:getComputedStyle(img).objectPosition,objectFit:getComputedStyle(img).objectFit},text:copy.innerText,mode:document.documentElement.dataset.theme,token:getComputedStyle(document.documentElement).getPropertyValue('--banner-height').trim(),overflow:document.documentElement.scrollWidth>innerWidth,elements:nodes.map(e=>({tag:e.tagName,text:e.innerText,href:e.getAttribute('href'),box:rect(e)})),textOverflow:nodes.flatMap(e=>{const box=e.getBoundingClientRect(),r=document.createRange();r.selectNodeContents(e);return [...r.getClientRects()].some(v=>v.width>0&&(v.left<box.left-2||v.right>box.right+2))?[e.innerText]:[]})};
      });row.measurement=m;
      m.actionCount=await loc.locator('a,button,[role="button"]').count();
      m.homepageOrder=await page.locator('.sj-home-hero,.sj-home-feature,.sj-doorway').evaluateAll(xs=>xs.map(x=>x.classList.contains('sj-home-hero')?'hero':x.classList.contains('sj-doorway')?'doorway':x.classList.contains('sj-home-feature--magnetic')?'magnetic_cap':x.classList.contains('sj-home-feature--collectible')?'collectible':'free_shipping'));
      const expected=width<=760?600:Math.max(540,Math.min(width*.43,650));
      check(close(m.banner.x,0)&&close(m.banner.width,width),'Full viewport width',m.banner);
      check(close(m.banner.height,expected),'Shared banner height',{expected,actual:m.banner.height});
      check(m.image.loaded&&m.image.src.endsWith('/'+item.file),'Correct artwork loaded',m.image.src);
      check(m.image.naturalWidth===1774&&m.image.naturalHeight===887,'Native 2:1 photograph retained');
      check(m.image.objectFit==='cover'&&close(m.image.width,m.banner.width)&&close(m.image.height,m.banner.height-2),'Photo fills bordered banner');
      check(m.copy.x>=m.banner.x&&m.copy.right<=m.banner.right&&m.copy.y>=m.banner.y&&m.copy.bottom<=m.banner.bottom,'Copy remains inside banner');
      check(m.elements.every(e=>e.box.x>=m.banner.x&&e.box.right<=m.banner.right&&e.box.y>=m.banner.y&&e.box.bottom<=m.banner.bottom),'Heading and supporting copy remain inside banner');
      check(!m.overflow&&!m.textOverflow.length,'No horizontal overflow or clipped text',m.textOverflow);
      check(m.mode===theme,'Requested mode applies');
      check(m.actionCount===0,'No links or buttons in the feature',m.actionCount);
      check(m.homepageOrder.join(',')==='hero,magnetic_cap,collectible,free_shipping,doorway','Three features precede Women/Men in requested order',m.homepageOrder);
      if(width<=760)check(m.copy.y>=m.image.y&&m.copy.bottom<=m.image.bottom+1,'Mobile copy overlays photo');
      if(item.name==='shipping')check(m.text.includes('2 or more items')&&m.text.includes('Shipping fee applies to 1 item.'),'Shipping threshold and single-item fee present');
      check(errors.length===0,'No JavaScript errors',errors);
      row.screenshot=path.relative(ROOT,path.join(DIR,`${item.name}-${theme}-${width}.png`));
      await loc.screenshot({path:path.join(ROOT,row.screenshot)});row.status=row.checks.every(c=>c.pass)?'PASS':'FAIL';
      console.log(row.status,item.name,theme,width);
    }
  }finally{await page.close()}
}
async function contact(browser,width,theme){
  const tileWidth=width>768?720:width;
  const html='<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#ddd;font:14px Arial;display:grid;grid-template-columns:repeat(3,'+tileWidth+'px);gap:8px}h2{font-size:14px;margin:0;padding:8px;background:white}img{display:block;width:100%;height:auto}</style>'+kinds.map(x=>'<div><h2>'+x.name+' / '+theme+' / '+width+'</h2><img src="file://'+path.join(DIR,x.name+'-'+theme+'-'+width+'.png')+'"></div>').join('');
  const file=path.join(DIR,`contact-${theme}-${width}.html`);fs.writeFileSync(file,html);
  const page=await browser.newPage({viewport:{width:tileWidth*3+16,height:1000}});await page.goto('file://'+file);await page.locator('img').evaluateAll(xs=>Promise.all(xs.map(x=>x.decode())));await page.screenshot({path:file.replace('.html','.png'),fullPage:true});await page.close();
}
(async()=>{
  fs.mkdirSync(DIR,{recursive:true});
  const entries=[...JSON.parse(fs.readFileSync(path.join(__dirname,'gallery-assets.json'))).map(x=>({file:x.asset,sha256:x.sha256})),...JSON.parse(fs.readFileSync(path.join(__dirname,'campaign-assets.json'))),...JSON.parse(fs.readFileSync(path.join(__dirname,'product-banner-assets.json'))),...JSON.parse(fs.readFileSync(path.join(__dirname,'home-feature-assets.json')))];
  report.artworkInventory={count:entries.length,uniqueFiles:new Set(entries.map(x=>x.file)).size,groups:{gallery:72,campaign:16,productBanners:6,homeFeatures:3},hashMismatches:entries.filter(x=>hash(fs.readFileSync(path.join(ROOT,'theme/assets',x.file)))!==x.sha256).map(x=>x.file)};
  if(report.artworkInventory.uniqueFiles!==97||report.artworkInventory.hashMismatches.length)report.failures.push({label:'97 installed artwork hashes',data:report.artworkInventory});
  const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try{for(const width of [320,390,768,1440])for(const theme of ['light','dark'])await run(browser,width,theme);for(const width of [320,390,768,1440])for(const theme of ['light','dark'])await contact(browser,width,theme)}finally{await browser.close()}
  report.summary={status:report.failures.length?'FAIL':'PASS',cases:report.cases.length,checks:report.cases.reduce((a,b)=>a+b.checks.length,0),failures:report.failures.length};
  fs.writeFileSync(path.join(__dirname,'HOME-FEATURES-QA.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary));process.exitCode=report.failures.length?1:0;
})().catch(e=>{console.error(e);process.exitCode=1});
