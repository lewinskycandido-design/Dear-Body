const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const deps='C:/Users/lhemy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {chromium}=require(deps+'/playwright'),sharp=require(deps+'/sharp');
const root=__dirname,data=JSON.parse(fs.readFileSync(path.join(root,'layout-data.json'),'utf8'));
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const wrap=(body,title)=>'<!doctype html><html><head><meta charset="utf-8"><title>'+esc(title)+'</title><link rel="stylesheet" href="campaign.css"></head><body>'+body+'</body></html>';
const offer='<div class="offer"><div class="offer-paper"><h1>FREE<br>SHIPPING</h1><div class="condition">ON 2+ ITEMS</div></div><div class="cod">CASH ON DELIVERY</div></div>';
const logo='<div class="brand"><img src="../assets/sj-logo-official-dark.png" alt="Dear Body"></div>';
const cta='<div class="cta">ORDER NOW <span>↗</span></div>';
const jobs=[];
for(const j of [...data.ads,...data.features]){
 if(!fs.existsSync(path.join(root,'photos',j.slug+'.png')))continue;
 let footer='';
 if(j.kind==='scent') footer='<div class="scent-footer"><p class="line">A SCENT JOURNEY</p><div class="footer-row"><h2 class="scent-title">'+esc(j.name)+'</h2>'+cta+'</div></div>';
 else {
  let details='',bottom=esc(j.support);
  if(j.slug==='mission-vision'){
    details='<div class="details"><div><strong>OUR MISSION</strong><p>London-formulated scents,<br>curated for Filipino life.</p></div><div><strong>OUR VISION</strong><p>London’s fragrance culture<br>in every Filipino’s everyday life.</p></div></div>';bottom='A SCENT JOURNEY';
  }
  if(j.slug==='scent-personality'){
    details='<div class="details"><div><strong>MOJITO METALLIQUE</strong><p>Friendly · Easygoing<br>Lighthearted</p></div><div><strong>OUD MIRAGE</strong><p>Independent · Reflective<br>Self-assured</p></div></div>';bottom='Explore the scent personalities.';
  }
  footer='<div class="feature-panel"><h2>'+j.title+'</h2>'+details+'<div class="feature-bottom"><p>'+bottom+'</p>'+cta+'</div></div>';
 }
 const body='<main class="canvas '+j.kind+' '+j.slug+' '+j.side+'"><img class="photo" src="../photos/'+j.slug+'.png" alt="">'+offer+logo+footer+'</main>';
 fs.writeFileSync(path.join(root,'working',j.slug+'.html'),wrap(body,j.name));
 jobs.push({slug:j.slug,width:1080,height:1350,out:'final/ads/'+j.id+'-'+j.slug+'-1080x1350.png'});
}
fs.writeFileSync(path.join(root,'working','profile.html'),wrap('<main class="canvas profile"><img class="photo" src="../assets/facebook-profile.png" alt="Dear Body Philippines monogram on a burgundy badge and bold warm orange background"></main>','Dear Body Facebook profile'));
fs.writeFileSync(path.join(root,'working','cover.html'),wrap('<main class="canvas cover"><img class="photo" src="../assets/facebook-cover.png" alt=""><img class="cover-brand" src="../assets/sj-logo-official-dark.png" alt="Dear Body"><div class="cover-card"><h1>FREE<br>SHIPPING</h1><div class="condition">ON 2+ ITEMS</div><div class="cod">CASH ON DELIVERY</div>'+cta+'</div><div class="journey">A SCENT JOURNEY</div></main>','Dear Body Facebook cover'));
jobs.push({slug:'profile',width:1080,height:1080,out:'final/page/dear-body-facebook-profile-1080.png'},{slug:'cover',width:1640,height:720,out:'final/page/dear-body-facebook-cover-1640x720.png'});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--force-color-profile=srgb']});
 const checks=[];
 for(const j of jobs){
  const page=await browser.newPage({viewport:{width:j.width,height:j.height},deviceScaleFactor:1});
  await page.goto(pathToFileURL(path.join(root,'working',j.slug+'.html')).href);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()))});
  const check=await page.evaluate(()=>({fonts:[document.fonts.check('700 50px Cenzo'),document.fonts.check('300 30px HelveticaNow')],text:document.body.innerText,brokenImages:[...document.images].filter(i=>!i.naturalWidth).length,overflow:[...document.querySelectorAll('h1,h2,p,.cta,.condition,.cod')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>({text:e.innerText,scroll:e.scrollWidth,width:e.clientWidth})),textBounds:[...document.querySelectorAll('h1,h2,p,.cta,.condition,.cod')].map(e=>{const r=e.getBoundingClientRect();return {text:e.innerText,x:r.x,y:r.y,width:r.width,height:r.height}})}));
  checks.push({slug:j.slug,...check});
  if(check.brokenImages||check.overflow.length||(j.slug!=='profile'&&check.fonts.includes(false)))throw new Error('Layout failed '+j.slug+' '+JSON.stringify(check));
  await page.screenshot({path:path.join(root,j.out)});await page.close();
 }
 await browser.close();
 fs.writeFileSync(path.join(root,'working','layout-checks.json'),JSON.stringify(checks,null,2));
 for(const j of jobs.filter(j=>j.width===1080&&j.height===1350))await sharp(path.join(root,j.out)).resize(360,450).toFile(path.join(root,'working',j.slug+'-mobile.png'));
 await sharp(path.join(root,'final/page/dear-body-facebook-profile-1080.png')).resize(320,320).toFile(path.join(root,'working/profile-mobile.png'));
 await sharp(path.join(root,'final/page/dear-body-facebook-cover-1640x720.png')).extract({left:180,top:0,width:1280,height:720}).resize(640,360).toFile(path.join(root,'working/cover-center-preview.png'));
 const adJobs=jobs.filter(j=>j.height===1350);
 const thumbs=await Promise.all(adJobs.map(async(j,i)=>({input:await sharp(path.join(root,j.out)).resize(324,405).toBuffer(),left:(i%5)*344+20,top:Math.floor(i/5)*425+20})));
 await sharp({create:{width:1740,height:Math.ceil(adJobs.length/5)*425+20,channels:3,background:'#f4e3cb'}}).composite(thumbs).png().toFile(path.join(root,'campaign-preview.png'));
 console.log(JSON.stringify({rendered:jobs.length,checks:'pass',outputs:jobs.map(j=>j.out)},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
