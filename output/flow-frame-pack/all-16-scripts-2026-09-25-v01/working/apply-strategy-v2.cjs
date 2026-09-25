const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
for(const ext of ['md','html']){
 const old=path.join(root,'ads-strategy-review-v1.'+ext);
 if(!fs.existsSync(old))fs.copyFileSync(path.join(root,'ads-strategy-review.'+ext),old);
}
const old=fs.readFileSync(path.join(root,'ads-strategy-review-v1.md'),'utf8');
const start=old.indexOf('## Tracking: check the COD path before spending');
const end=old.indexOf('## Learning resources and scope',start);
if(start<0||end<0)throw Error('Version 1 technical sections not found');
const core=fs.readFileSync(path.join(root,'working/strategy-v2-content.md'),'utf8');
fs.writeFileSync(path.join(root,'ads-strategy-review.md'),core+'\n\n'+old.slice(start,end)+'\n## Revision history and scope\n\nThis research update reviewed primary platform documentation, published fragrance cases, actual brand offers and ecommerce usability research. It did not inspect an active Dear Body ad account, watch the complete training videos or establish causal results for Dear Body. Website findings still refer to the local project, not a fresh live checkout test.\n\n[Previous Version 1](ads-strategy-review-v1.html) · [Current 16 Flow storyboards](storyboard.html)\n');
const buildFile=path.join(root,'working/build-strategy.cjs');
let b=fs.readFileSync(buildFile,'utf8');
b=b.replace('Dear Body · First-launch ads strategy','Dear Body · Ads strategy version 2');
b=b.replace('START SMALL.<br>LEARN WHAT SELLS.','HELP THEM CHOOSE.<br>MAKE THE SCENT CLEAR.');
b=b.replace('Dear Body’s first-launch plan: three distinct ideas, clear shopping steps and results measured through delivered COD orders.','Version 2: clear scent choices, personality fit and real product details. Four revised Taglish scripts, with a practical plan for measuring delivered COD orders.');
b=b.replace("['11-personality-mojito-metallique','01-start.png','01 · Find your scent'],['08-campaign-collection','01-start.png','02 · Choose your pair'],['05-campaign-oud-mirage','01-start.png','03 · Describe the scent']","['11-personality-mojito-metallique','01-start.png','01 · Help them choose'],['05-campaign-oud-mirage','01-start.png','02 · Explain the scent'],['07-campaign-magnetic-cap','01-start.png','03 · Show the product']");
b=b.replace('Copy shorter voiceovers','Copy revised voiceovers').replace('Copy the shorter Taglish voiceovers','Copy the revised Taglish voiceovers').replace('Dear Body PH · First-launch recommendations','Dear Body PH · Strategy version 2');
fs.writeFileSync(buildFile,b);
console.log('Applied research strategy version 2; preserved the prior guide.');
