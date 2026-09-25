const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const deps='C:/Users/lhemy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {chromium}=require(deps+'/playwright'),sharp=require(deps+'/sharp');
const root=__dirname;
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--force-color-profile=srgb']});
const jobs=[{name:'profile',width:1080,height:1080,file:'dear-body-facebook-profile-1080.png'},{name:'cover',width:1640,height:720,file:'dear-body-facebook-cover-1640x720.png'}],checks=[];
for(const j of jobs){
 const page=await browser.newPage({viewport:{width:j.width,height:j.height},deviceScaleFactor:1});
 await page.goto(pathToFileURL(path.join(root,'working',j.name+'.html')).href);
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()))});
 checks.push({name:j.name,...await page.evaluate(()=>({fonts:[document.fonts.check('700 69px Cenzo'),document.fonts.check('300 29px HelveticaNow')],text:document.body.innerText,images:[...document.images].map(i=>({src:i.getAttribute('src'),width:i.naturalWidth,height:i.naturalHeight})),bounds:[...document.querySelectorAll('.brand,.offer,.cod,.cta')].map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,text:e.innerText}})}))});
 await page.screenshot({path:path.join(root,'final',j.file)});await page.close();
}
await browser.close();
fs.writeFileSync(path.join(root,'working','layout-checks.json'),JSON.stringify(checks,null,2));
await sharp(path.join(root,'final',jobs[0].file)).resize(320,320).png().toFile(path.join(root,'working','profile-mobile.png'));
await sharp(path.join(root,'final',jobs[1].file)).extract({left:0,top:18,width:1640,height:684}).resize(820,342).png().toFile(path.join(root,'working','cover-wide-preview.png'));
await sharp(path.join(root,'final',jobs[1].file)).extract({left:180,top:0,width:1280,height:720}).resize(640,360).png().toFile(path.join(root,'working','cover-16x9-preview.png'));
console.log(JSON.stringify(checks,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
