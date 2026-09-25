const fs=require('fs'),path=require('path');
const sharp=require('C:/Users/lhemy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const project='C:/Users/lhemy/OneDrive/Documents/Dear Body';
const root=__dirname;
(async()=>{
 const font=project+'/output/website/scent-journey-theme/source-assets/fonts/CenzoFlare-Bold/CenzoFlare-Bold.ttf';
 const logo=project+'/output/facebook-campaign/bold-faceless-2026-09-25-v02/assets/sj-logo-official-dark.png';
 const title=await sharp({text:{text:'<span foreground="#5c0006">A SCENT JOURNEY</span>',font:'Cenzo Flare Bold 94',fontfile:font,dpi:72,rgba:true}}).png().toBuffer({resolveWithObject:true});
 const wordmark=await sharp(logo).resize({width:330}).png().toBuffer({resolveWithObject:true});
 const output=path.join(root,'final/dear-body-facebook-cover-six-scents-a-scent-journey-1640x720.png');
 await sharp(path.join(root,'assets/lifestyle-photo.png')).resize(1640,720,{fit:'cover'}).composite([
 {input:wordmark.data,left:Math.round((1640-wordmark.info.width)/2),top:61},
 {input:title.data,left:Math.round((1640-title.info.width)/2),top:135}
 ]).png().toFile(output);
 await sharp(output).extract({left:180,top:0,width:1280,height:720}).png().toFile(path.join(root,'working/center-crop-preview.png'));
 await sharp(output).extract({left:0,top:48,width:1640,height:624}).png().toFile(path.join(root,'working/wide-crop-preview.png'));
 fs.writeFileSync(path.join(root,'working/layout-check.json'),JSON.stringify({width:1640,height:720,title:title.info,wordmark:wordmark.info,font,scents:6,marketingCopy:['DEAR BODY','A SCENT JOURNEY'],imageMethod:'Built-in image_gen, with official logo and exact brand font composed afterward'},null,2));
 console.log(JSON.stringify({output,title:title.info,wordmark:wordmark.info}));
})().catch(e=>{console.error(e);process.exit(1)});

