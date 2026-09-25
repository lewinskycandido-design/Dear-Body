const fs=require('fs'),path=require('path'),crypto=require('crypto'),{pathToFileURL}=require('url');
const deps='C:/Users/lhemy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {chromium}=require(deps+'/playwright'),sharp=require(deps+'/sharp'),root=__dirname;
const jobs=JSON.parse(fs.readFileSync(path.join(root,'generation-prompts.json'),'utf8')).jobs;
const copies=JSON.parse(fs.readFileSync(path.join(root,'ad-copy-and-scripts.json'),'utf8'));
const times=['00–04','04–10','10–16','16–21','21–27'];for(const c of copies)c.reel.forEach((s,i)=>s[0]=times[i]);
fs.writeFileSync(path.join(root,'ad-copy-and-scripts.json'),JSON.stringify(copies,null,2));
let md=fs.readFileSync(path.join(root,'ad-copy-and-scripts.md'),'utf8').replaceAll('22-second','27-second');
for(const [a,b] of [['00–03','00–04'],['03–08','04–10'],['08–13','10–16'],['13–17','16–21'],['17–22','21–27']])md=md.replaceAll(a,b);
fs.writeFileSync(path.join(root,'ad-copy-and-scripts.md'),md);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const final=j=>'final/'+j.id+'-'+j.slug+'-personality-1080x1350.png';
for(const j of jobs){
 const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><title>'+esc(j.name)+' personality creative</title><link rel="stylesheet" href="personality.css"></head><body><main class="ad '+j.slug+' '+j.tone+'"><img class="photo" src="../photos/'+j.slug+'.png" alt=""><div class="offer-bar"><div class="shipping">FREE SHIPPING ON 2+ ITEMS</div><div class="cod">CASH ON DELIVERY</div><img class="brand" src="../assets/sj-logo-official-dark.png" alt="Dear Body"></div><div class="intro"><h1>'+j.headline+'</h1><div class="traits">'+j.traits.map(t=>'<div class="trait">'+esc(t.toUpperCase())+'</div>').join('')+'</div></div><div class="footer"><p class="eyebrow">EXPLORE THE SCENT PERSONALITIES</p><h2 class="scent">'+esc(j.name)+'</h2><p class="invite">Which scent fits your personality?</p><div class="cta">FIND YOUR SCENT <span>↗</span></div></div></main></body></html>';
 fs.writeFileSync(path.join(root,'working',j.slug+'.html'),html);
}
const style='@font-face{font-family:Cenzo;src:url(assets/CenzoFlare-Bold.woff2);font-weight:700}@font-face{font-family:HelveticaNow;src:url(assets/HelveticaNowDisplay-Light.woff2);font-weight:300}*{box-sizing:border-box}body{margin:0;background:#f4e3cb;color:#5c0006;font:300 18px/1.5 HelveticaNow,Arial,sans-serif;overflow-wrap:anywhere}header{background:#5c0006;color:#f4e3cb;padding:45px max(24px,calc((100vw - 1180px)/2))}header img{width:220px}h1,h2,h3,h4{font-family:Cenzo;line-height:1.05}h1{font-size:clamp(40px,6vw,72px);margin:20px 0}h2{font-size:34px}h3{font-size:25px;margin:0 0 12px}h4{font-size:20px;margin:18px 0 8px}a{color:inherit;text-underline-offset:4px}nav{display:flex;gap:20px;flex-wrap:wrap}nav a{background:#e9a250;color:#5c0006;padding:12px 18px;text-decoration:none;font-family:Cenzo}main{max-width:1230px;margin:auto;padding:40px 25px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:25px}.card{background:#fff7eb;padding-bottom:20px}.card img{display:block;width:100%;height:auto}.card .text{padding:20px 20px 0}.card p{font-size:16px}.copy{white-space:pre-wrap;background:#fff7eb;padding:20px}.section{border-top:3px solid #d46601;margin-top:45px;padding-top:25px;scroll-margin-top:20px}.meta{font-size:15px}details{background:#fff7eb;margin:15px 0;padding:18px}summary{font-family:Cenzo;cursor:pointer}.shot{padding:15px 0;border-top:1px solid #e9a250}.shot p{margin:6px 0}.shot strong{font-family:Cenzo}.note{border-left:4px solid #d46601;padding-left:20px;margin:30px 0}@media(max-width:800px){.grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:500px){.grid{grid-template-columns:1fr}.card .text{padding:18px}}';
fs.writeFileSync(path.join(root,'gallery.css'),style);
let gallery='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dear Body — Find Your Scent campaign</title><link rel="stylesheet" href="gallery.css"></head><body id="top"><header><img src="assets/sj-logo-official-white.png" alt="Dear Body"><h1>A SCENT THAT<br>FEELS LIKE YOU.</h1><p>Six new personality creatives. Six fresh face-free lifestyle scenes.</p><nav><a href="ad-copy-and-scripts.md">Captions & scripts</a><a href="generation-prompts.json">Generation prompts</a></nav></header><main><p class="note">Main action: FIND YOUR SCENT. Direct the campaign to the website’s Scent Finder at /pages/scent-finder. The imagery invites discovery; it does not promise a fixed personality result.</p><div class="grid">';
for(const j of jobs)gallery+='<article class="card"><a href="'+final(j)+'"><img src="'+final(j)+'" alt="'+esc(j.name)+' personality advertisement" loading="lazy"></a><div class="text"><h3>'+esc(j.name)+'</h3><p>'+esc(j.traits.join(' · '))+'</p><a href="'+final(j)+'" download>Download PNG</a> · <a href="#'+j.slug+'">Caption & script</a></div></article>';
gallery+='</div>';
for(const c of copies){
 gallery+='<section class="section" id="'+c.slug+'"><h2>'+c.id+' — '+esc(c.name)+'</h2><p>'+esc(c.personality)+'</p><h3>Ready-to-use caption</h3><div class="copy">'+esc(c.primaryText)+'</div><p><strong>Ad headline:</strong> '+esc(c.adHeadline)+'<br><strong>Supporting line:</strong> '+esc(c.description)+'<br><strong>Creative CTA:</strong> '+c.creativeCTA+'<br><strong>Destination:</strong> /pages/scent-finder</p><details><summary>Scene and production direction</summary><p>'+esc(c.concept)+'</p>'+['casting','lighting','camera','sound','still'].map(k=>'<h4>'+k[0].toUpperCase()+k.slice(1)+'</h4><p>'+esc(c.production[k])+'</p>').join('')+'</details><details><summary>27-second reel script — five timed shots</summary>'+c.reel.map(s=>'<div class="shot"><h4>'+s[0]+'</h4><p><strong>Action:</strong> '+esc(s[1])+'</p><p><strong>Camera:</strong> '+esc(s[2])+'</p><p><strong>Voiceover:</strong> '+esc(s[3])+'</p><p><strong>On screen:</strong> '+esc(s[4])+'</p></div>').join('')+'<h4>Full voiceover</h4><p>'+esc(c.reel.map(s=>s[3]).join(' '))+'</p></details><p class="meta"><strong>Continuity:</strong> '+esc(c.continuity)+'</p><p class="meta"><strong>Creative test:</strong> '+esc(c.test)+'</p><a href="#top">Back to gallery ↑</a></section>';
}
gallery+='</main></body></html>';
fs.writeFileSync(path.join(root,'gallery.html'),gallery);
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--force-color-profile=srgb']});
 const checks=[],outputs=[];
 for(const j of jobs){
  const page=await browser.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
  await page.goto(pathToFileURL(path.join(root,'working',j.slug+'.html')).href);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()))});
  const check=await page.evaluate(()=>({fonts:[document.fonts.check('700 70px Cenzo'),document.fonts.check('300 35px HelveticaNow')],text:document.body.innerText,brokenImages:[...document.images].filter(i=>!i.naturalWidth).length,overflow:[...document.querySelectorAll('h1,h2,p,.trait,.cta,.shipping,.cod')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.innerText),introBottom:document.querySelector('.intro').getBoundingClientRect().bottom,footerTop:document.querySelector('.footer').getBoundingClientRect().top}));
  if(check.brokenImages||check.overflow.length||check.fonts.includes(false)||check.text.includes('ORDER NOW')||!check.text.includes('FIND YOUR SCENT'))throw new Error(JSON.stringify({slug:j.slug,...check}));
  const dest=path.join(root,final(j));await page.screenshot({path:dest});await page.close();
  checks.push({slug:j.slug,...check});
  await sharp(dest).resize(360,450).png().toFile(path.join(root,'working',j.slug+'-mobile.png'));
  outputs.push({file:final(j),width:1080,height:1350,sha256:crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex')});
 }
 for(const width of [1280,390]){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto(pathToFileURL(path.join(root,'gallery.html')).href);
  await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()))});
  const check=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>!i.naturalWidth).length}));
  if(check.broken||check.scrollWidth>width+1)throw new Error(JSON.stringify(check));
  checks.push({gallery:true,...check});await page.screenshot({path:path.join(root,'working','gallery-'+width+'.png')});await page.close();
 }
 await browser.close();
 const tiles=await Promise.all(jobs.map(async(j,i)=>({input:await sharp(path.join(root,final(j))).resize(360,450).toBuffer(),left:(i%3)*380+20,top:Math.floor(i/3)*470+20})));
 await sharp({create:{width:1160,height:960,channels:3,background:'#f4e3cb'}}).composite(tiles).png().toFile(path.join(root,'six-personality-ads-preview.png'));
 fs.writeFileSync(path.join(root,'qa-report.json'),JSON.stringify({date:'2026-09-25',outputs,checks,cta:'FIND YOUR SCENT',destination:'/pages/scent-finder',builtInImagegen:true},null,2));
 console.log(JSON.stringify({assets:outputs.length,layout:'pass',gallery:'desktop and mobile pass',cta:'FIND YOUR SCENT'}));
})().catch(e=>{console.error(e);process.exit(1)});


