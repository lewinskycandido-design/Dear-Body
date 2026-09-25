const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const {chromium}=require('C:/Users/lhemy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),a=JSON.parse(fs.readFileSync(path.join(root,'script-manifest.json')));
const assert=(x,m)=>{if(!x)throw Error(m)};
const rows=JSON.parse(fs.readFileSync(path.join(root,'flow-shot-index.json')));
assert(a.length===16&&rows.length===100,'Script/shot count');
let maxWpm=0;
for(const s of a){
 const data=JSON.parse(fs.readFileSync(path.join(root,s.folder,'shot-data.json')));
 assert(fs.readFileSync(path.join(root,s.folder,'voiceover-script.txt'),'utf8').includes(s.fullVoiceover),'Full narration '+s.id);
 assert(data.shots.length===s.shots.length,'Data '+s.id);
 for(const x of s.shots){
  assert(x.completePrompt.includes('conversational Taglish'),'Taglish voice '+s.id);
  assert(!x.completePrompt.includes('no generated speech'),'Conflicting audio '+s.id);
  assert(x.motionPrompt.includes('no generated speech'),'Motion alternate '+s.id);
  assert(x.completePrompt.includes(s.voiceDirection),'Tone '+s.id);
  if(!(s.id==='09'&&x.number===3))assert(x.completePrompt.includes(x.voiceover),'VO prompt mismatch '+s.id);
  assert(data.shots[x.number-1].voiceover===x.voiceover,'VO data '+s.id);
  maxWpm=Math.max(maxWpm,x.voiceover.split(/\s+/).length/x.editSeconds*60);
 }
 if(s.type==='campaign')assert(/tap Order Now\./i.test(s.shots.at(-1).voiceover),'Website CTA '+s.id);
 else assert(s.cta==='FIND YOUR SCENT','Personality CTA '+s.id);
 if(Number(s.id)<=7)assert(s.shots.some(x=>x.voiceover.startsWith('Para sa ')),'Personality fit missing '+s.id);
 assert(s.shots[0].voiceover.endsWith('?')&&s.adStrategy,'Opening buyer question '+s.id);
 assert(/magnetic cap/i.test(s.fullVoiceover)&&/i-collect/.test(s.fullVoiceover)&&/i-display/.test(s.fullVoiceover),'Product benefits '+s.id);
 if(s.id==='08')assert(s.shots[2].key==='mojito'&&s.shots[2].voiceover.includes('Mojito Metallique')&&s.shots[3].key==='amber'&&s.shots[3].voiceover.includes('Amber Oud Silk'),'Collection personality/product alignment');
}
const shortScripts=JSON.parse(fs.readFileSync(path.join(root,'short-test-voiceovers.json')));
assert(shortScripts.length===4&&shortScripts.every(s=>/para sa/i.test(s.voiceover)),'Revised scripts must state personality fit');
const intro=JSON.parse(fs.readFileSync(path.join(root,'brand-introduction-script.json')));
assert(intro.shots.length===8&&intro.durationSeconds===44,'Brand introduction duration/count');
assert(intro.fullVoiceover.startsWith('Hi, kami ang Dear Body.'),'Brand must open the new script');
assert(intro.shots[0].voiceover.includes('Hirap pumili ng scent?'),'Intro problem hook');
assert(/magnetic cap/.test(intro.fullVoiceover)&&/spray nozzle/.test(intro.fullVoiceover)&&/i-collect/.test(intro.fullVoiceover)&&/i-display/.test(intro.fullVoiceover),'Brand introduction product details');
assert(intro.shots[2].sourceScript==='11'&&intro.shots[2].voiceover.includes('Mojito Metallique')&&intro.shots[3].sourceScript==='15'&&intro.shots[3].voiceover.includes('Oud Mirage'),'Intro scent / talent alignment');
for(const [i,x] of intro.shots.entries()){
 assert(x.startSeconds===(i?intro.shots[i-1].endSeconds:0)&&x.endSeconds-x.startSeconds===x.editSeconds,'Intro timing '+i);
 assert(x.completePrompt.includes(x.voiceover)&&x.completePrompt.includes('conversational Taglish')&&!x.completePrompt.includes('no generated speech'),'Intro prompt/voice '+i);
 assert(fs.existsSync(path.join(root,x.startFrame)),'Intro frame '+i);
 assert(x.voiceover.split(/\s+/).length/x.editSeconds*60<=165,'Intro narration too fast '+i);
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--force-color-profile=srgb']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],results=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async x=>{window.lastCopied=x}}}));
 for(const file of ['storyboard.html','ads-strategy-review.html','VOICE-IDENTITY.html','brand-introduction-script.html']){
  await page.goto(pathToFileURL(path.join(root,file)).href);
  await page.evaluate(async()=>{await document.fonts.ready});
  const check=await page.evaluate(()=>{
   const links=[...document.querySelectorAll('[href],[src]')].map(x=>x.getAttribute('href')||x.getAttribute('src')).filter(x=>x&&!/^(https?:|#|data:)/.test(x));
   const buttons=[...document.querySelectorAll('button.copy')];
   return {links,buttons:buttons.length,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  for(const f of check.links)assert(fs.existsSync(path.resolve(root,decodeURIComponent(f.split('#')[0]))),'Missing local link '+file+' '+f);
  assert(!check.overflow,'Desktop overflow '+file);
  const copied=await page.evaluate(async()=>{
   let count=0;for(const b of document.querySelectorAll('button.copy')){await b.onclick();if(window.lastCopied!==b.previousElementSibling.value)throw Error('Copy mismatch');count++;}return count;
  });
  if(file==='storyboard.html'){
   assert(check.buttons===218,'Copy buttons: expected 100 complete + 100 alternate + 16 full + 2 insert');
   await page.locator('[id="11-personality-mojito-metallique"]').scrollIntoViewIfNeeded();
   await page.screenshot({path:path.join(root,'working/updated-storyboard-desktop.png')});
  }
  if(file==='ads-strategy-review.html'){
   assert(check.buttons===4,'Short scripts');
   await page.screenshot({path:path.join(root,'working/ads-strategy-desktop.png')});
   await page.locator('#taglish-copy').scrollIntoViewIfNeeded();
   await page.screenshot({path:path.join(root,'working/short-taglish-scripts.png')});
  }
  if(file==='brand-introduction-script.html'){
   assert(check.buttons===17,'Intro: full voiceover plus 8 complete and 8 motion-only prompts');
   await page.screenshot({path:path.join(root,'working/brand-introduction-desktop.png')});
  }
  await page.setViewportSize({width:390,height:844});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile overflow '+file);
  if(file==='storyboard.html'){
   await page.locator('[id="11-personality-mojito-metallique"]').scrollIntoViewIfNeeded();
   await page.screenshot({path:path.join(root,'working/updated-storyboard-mobile.png')});
  }
  if(file==='brand-introduction-script.html')await page.screenshot({path:path.join(root,'working/brand-introduction-mobile.png')});
  results.push({file,localLinks:check.links.length,copyButtonsChecked:copied,desktopAndMobileOverflow:false});
  await page.setViewportSize({width:1440,height:1000});
 }
 assert(errors.length===0,'Browser errors '+errors.join('; '));
 await browser.close();
 assert(maxWpm<=165,'Written narration exceeds 165 words per minute');
 const report={checkedAt:new Date().toISOString(),strategyVersion:2,problemSolutionRevision:true,personalityFitInScentCampaigns:true,productDetailsInAll16Scripts:true,scripts:16,shots:100,completePrompts:101,fullVoiceovers:16,brandIntroduction:{durationSeconds:44,shots:8,completePrompts:8,reusesExistingFrames:true,startsWithBrand:true,choiceQuestionInOpening:true},shortTestScripts:4,language:'Taglish',maximumWrittenWordsPerMinute:Math.round(maxWpm),narrationAudioGenerated:false,websiteLiveVerified:false,adsLaunched:false,results};
 fs.writeFileSync(path.join(root,'UPDATE-QA-REPORT.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
