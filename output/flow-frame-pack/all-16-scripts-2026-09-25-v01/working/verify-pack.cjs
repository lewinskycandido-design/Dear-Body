const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url'),assert=require('assert');
const deps='C:/Users/lhemy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const sharp=require(deps+'/sharp'),{chromium}=require(deps+'/playwright');
const root=path.resolve(__dirname,'..'),rows=JSON.parse(fs.readFileSync(path.join(root,'flow-shot-index.json')));
const scripts=JSON.parse(fs.readFileSync(path.join(root,'script-manifest.json')));
(async()=>{
 assert.equal(rows.length,100);assert.equal(scripts.length,16);
 let checked=0;
 for(const r of rows){
  const frame=await sharp(path.join(root,r.start_frame)).metadata(),overlay=await sharp(path.join(root,r.overlay)).metadata();
  assert.equal(frame.width,1080);assert.equal(frame.height,1920);assert.equal(overlay.width,1080);assert.equal(overlay.height,1920);assert(overlay.hasAlpha);
  assert(r.motion_prompt.includes('No faces'));
  if(r.extra_frame)assert(fs.existsSync(path.join(root,r.extra_frame)));
  checked++;
 }
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--force-color-profile=srgb']});
 const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
 let errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(pathToFileURL(path.join(root,'storyboard.html')).href);await page.evaluate(()=>document.fonts.ready);
 const missing=await page.evaluate(()=>Array.from(document.querySelectorAll('a[href],img[src]')).map(e=>e.getAttribute('href')||e.getAttribute('src')).filter(v=>v&&!v.startsWith('http')&&!v.startsWith('#')));
 for(const f of missing)assert(fs.existsSync(path.join(root,decodeURIComponent(f))),'Missing link '+f);
 assert.equal(await page.locator('article.shot').count(),100);
 await page.locator('#showCopy').check();assert(await page.locator('body').evaluate(e=>e.classList.contains('show-copy')));
 await page.selectOption('#scriptSelect','11-personality-mojito-metallique');
 await page.evaluate(()=>document.getElementById('11-personality-mojito-metallique').scrollIntoView({behavior:'instant'}));
 await page.screenshot({path:path.join(root,'working/storyboard-desktop.png')});
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>document.getElementById('11-personality-mojito-metallique').scrollIntoView({behavior:'instant'}));
 await page.screenshot({path:path.join(root,'working/storyboard-mobile.png')});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert(!overflow,'Mobile overflow');
 await page.goto(pathToFileURL(path.join(root,'VOICE-IDENTITY.html')).href);await page.evaluate(()=>document.fonts.ready);
 assert((await page.locator('#prompt').inputValue()).includes('around 28'));await page.screenshot({path:path.join(root,'working/voice-guide-mobile.png')});
 await browser.close();assert.equal(errors.length,0,errors.join('\n'));
 for(let g=0;g<4;g++){
  const group=rows.slice(g*25,(g+1)*25),cw=180,ch=346,gap=12,W=5*cw+6*gap,H=5*ch+6*gap,layers=[];
  for(let i=0;i<group.length;i++){
   const r=group[i],full=await sharp(path.join(root,r.start_frame)).composite([{input:path.join(root,r.overlay)}]).toBuffer(),b=await sharp(full).resize(cw,320).toBuffer();
   const x=gap+(i%5)*(cw+gap),y=gap+Math.floor(i/5)*(ch+gap);
   layers.push({input:b,left:x,top:y});
   const svg='<svg width="'+cw+'" height="26"><rect width="100%" height="100%" fill="#fff4df"/><text x="6" y="18" font-family="Arial" font-size="12" fill="#591f15">'+r.script_id+' / '+String(r.shot).padStart(2,'0')+' · '+r.time+'</text></svg>';
   layers.push({input:Buffer.from(svg),left:x,top:y+320});
  }
  await sharp({create:{width:W,height:H,channels:3,background:'#c78b45'}}).composite(layers).jpeg({quality:90}).toFile(path.join(root,'working/overlay-review-'+(g+1)+'.jpg'));
 }
 const result={scripts:16,timedShots:100,numberedStartFrames:101,uniqueKeyframes:58,transparentOverlays:100,dimensions:'1080x1920',localLinksChecked:missing.length,mobileOverflow:false,browserErrors:errors,voiceIdentityIncluded:true};
 fs.writeFileSync(path.join(root,'QA-REPORT.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exit(1)});
