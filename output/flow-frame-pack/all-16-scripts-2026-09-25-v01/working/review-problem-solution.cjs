const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const {chromium}=require('C:/Users/lhemy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),out=path.resolve(root,'../..');
const scripts=JSON.parse(fs.readFileSync(path.join(root,'script-manifest.json')));
const campaign=JSON.parse(fs.readFileSync(path.join(out,'facebook-campaign/bold-faceless-2026-09-25-v02/all-content-concepts.json'))).concepts;
const personality=JSON.parse(fs.readFileSync(path.join(out,'facebook-campaign/personality-discovery-2026-09-25-v01/ad-copy-and-scripts.json')));
for(const s of scripts){
 const source=s.type==='campaign'?campaign.find(c=>c.id===s.id).shots:personality[Number(s.id)-11].reel;
 s.shots.forEach((x,i)=>{if(source[i][3]!==x.voiceover||source[i][4]!==x.onScreen)throw Error('Source mismatch '+s.id+'/'+i);});
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--force-color-profile=srgb']});
 const page=await browser.newPage({viewport:{width:1440,height:1100}});
 await page.goto(pathToFileURL(path.join(root,'storyboard.html')).href);
 await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
 await page.locator('#showCopy').check();
 const card=page.locator('[id="05-campaign-oud-mirage"] .shot').first();
 await card.evaluate(async el=>{el.scrollIntoView({block:'start'});window.scrollBy(0,-85);await Promise.all([...el.querySelectorAll('img')].map(i=>i.decode()));});
 await page.screenshot({path:path.join(root,'working/problem-solution-oud-preview.png')});
 await page.goto(pathToFileURL(path.join(root,'brand-introduction-script.html')).href);
 const intro=page.locator('#shot-1');
 await intro.evaluate(async el=>{el.scrollIntoView({block:'start'});await Promise.all([...el.querySelectorAll('img')].map(i=>i.decode()));});
 await page.screenshot({path:path.join(root,'working/problem-solution-intro-preview.png')});
 await browser.close();
 console.log('All 100 source-guide voiceover and screen-copy rows match; captured the question opening with its actual photo and overlay.');
})().catch(e=>{console.error(e);process.exit(1)});
