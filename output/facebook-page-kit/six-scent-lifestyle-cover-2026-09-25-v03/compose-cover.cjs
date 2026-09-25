const fs=require('fs'),path=require('path');
const sharp=require('C:/Users/lhemy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const project='C:/Users/lhemy/OneDrive/Documents/Dear Body',root=__dirname;
(async()=>{
 const font=project+'/output/website/scent-journey-theme/source-assets/fonts/CenzoFlare-Bold/CenzoFlare-Bold.ttf';
 const logo=project+'/output/facebook-campaign/bold-faceless-2026-09-25-v02/assets/sj-logo-official-dark.png';
 const headline=await sharp({text:{text:'<span foreground="#5c0006">A SCENT JOURNEY</span>',font:'Cenzo Flare Bold 84',fontfile:font,dpi:72,rgba:true}}).rotate(-3,{background:'#00000000'}).png().toBuffer({resolveWithObject:true});
 const wordmark=await sharp(logo).resize({width:252}).rotate(-3,{background:'#00000000'}).png().toBuffer({resolveWithObject:true});
 const output=path.join(root,'final/dear-body-facebook-cover-six-scents-designed-1640x720.png');
 await sharp(path.join(root,'assets/designed-lifestyle-photo.png')).resize(1640,720,{fit:'cover'}).composite([
 {input:wordmark.data,left:Math.round((1640-wordmark.info.width)/2),top:94},
 {input:headline.data,left:Math.round((1640-headline.info.width)/2),top:133}
 ]).png().toFile(output);
 await sharp(output).extract({left:180,top:0,width:1280,height:720}).png().toFile(path.join(root,'working/center-crop-preview.png'));
 await sharp(output).extract({left:0,top:48,width:1640,height:624}).png().toFile(path.join(root,'working/wide-crop-preview.png'));
 fs.writeFileSync(path.join(root,'working/layout-check.json'),JSON.stringify({dimensions:[1640,720],headline:headline.info,wordmark:wordmark.info,scents:6,font,copy:['DEAR BODY','A SCENT JOURNEY'],method:'Built-in image_gen editing followed by official-font typography composition'},null,2));
 console.log(JSON.stringify({output,headline:headline.info,wordmark:wordmark.info}));
})().catch(e=>{console.error(e);process.exit(1)});

