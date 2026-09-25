import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL, fileURLToPath} from 'node:url';

const runtime='C:/Users/lhemy/.cache/codex-runtimes/codex-primary-runtime/dependencies';
process.env.RUNTIME_NODE_MODULES=runtime+'/node/node_modules';
const artifactPath=runtime+'/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
const req=createRequire(pathToFileURL(artifactPath));
const {FontLibrary}=req('skia-canvas');
const sharp=req(runtime+'/node/node_modules/sharp');
const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,'../..');
const TMP=path.join(HERE,'qa/deck'); await fs.mkdir(TMP,{recursive:true});
const SKILL='C:/Users/lhemy/.codex/plugins/cache/openai-primary-runtime/presentations/26.921.10847/skills/presentations';
const fonts=path.join(ROOT,'output/website/scent-journey-theme/source-assets/fonts');
FontLibrary.use('Cenzo Flare',[path.join(fonts,'CenzoFlare-Bold/CenzoFlare-Bold.ttf')]);
FontLibrary.use('Helvetica Now Display',[path.join(fonts,'HelveticaNowDisplay-Light/HelveticaNowDisplay-Light.ttf')]);
FontLibrary.use('Helvetica Now Text',[path.join(fonts,'HelveticaNowText-Regular/HelveticaNowText-Regular.ttf')]);
const {Presentation,PresentationFile}=await import(pathToFileURL(artifactPath));
const {finalizePresentation}=await import(pathToFileURL(path.join(SKILL,'container_tools/artifact_tool_utils.mjs')));
const pres=Presentation.create({slideSize:{width:1280,height:720}});
pres.theme.defaultFont='Helvetica Now Display';
const pages=JSON.parse(await fs.readFile(path.join(HERE,'qa/pages.json'),'utf8'));
const C={cream:'#F4E3CB',burgundy:'#5C0006',red:'#9A1106',orange:'#D46601',tan:'#E9A250',ink:'#210B08'};
const theme='output/website/scent-journey-theme/';
const gal='output/website/upload-ready/shopify-gallery-order-2026-09-24/';
const imgmanifest=[]; const slidemeta=[];
function notes(slide, nums, extra=''){
 let text=nums.map(n=>{const p=pages[n-1];return p.title+'\n'+p.blocks.map(b=>b.text||(b.kind==='table'?[b.headers,...b.rows].map(r=>r.join(' | ')).join('\n'):b.caption||'')).filter(Boolean).join('\n')+'\nSources: '+p.source}).join('\n\n');
 slide.speakerNotes.textFrame.setText(text+'\n'+extra);
}
function txt(s,text,x,y,w,h,size=28,color=C.ink,font='Helvetica Now Display',bold=false){
 const t=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 t.text=text;t.text.style={typeface:font,fontSize:size,bold,color,autoFit:'none',wrap:'word',verticalAlignment:'top',insets:{top:0,right:0,bottom:0,left:0}};return t;
}
function slide(title,bg=C.cream,dark=false){const s=pres.slides.add();s.background.fill=bg;txt(s,title,62,46,1150,110,44,dark?C.cream:C.burgundy,'Cenzo Flare',true);slidemeta.push({title});return s;}
function body(s,text,y=200,x=62,w=1100,size=29,color=C.ink,h=380){return txt(s,text,x,y,w,h,size,color);}
async function image(s,p,x,y,w,h,fit='contain'){
 const original=await fs.readFile(path.join(ROOT,p));const meta=await sharp(original).metadata();const alpha=meta.hasAlpha;const pipeline=sharp(original).resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true});const bytes=alpha?await pipeline.png().toBuffer():await pipeline.jpeg({quality:92,chromaSubsampling:'4:4:4'}).toBuffer();s.images.add({blob:new Uint8Array(bytes),contentType:alpha?'image/png':'image/jpeg',alt:p,fit,position:{left:x,top:y,width:w,height:h}});imgmanifest.push({slide:slidemeta.length,path:p});
}
async function a(slug,prefix){return gal+slug+'/'+(await fs.readdir(path.join(ROOT,gal,slug))).find(n=>n.startsWith(prefix)&&n.endsWith('.png'));}
function lines(s,items,{x=62,y=192,w=1100,size=29,gap=93,color=C.ink}={}){items.forEach((t,i)=>txt(s,t,x,y+i*gap,w,gap-15,size,color));}
function foot(s,t,dark=false){txt(s,t,62,662,1155,34,16,dark?C.cream:C.burgundy,'Helvetica Now Text');}
function nativeTable(s,values,{x=62,y=180,w=1156,h=425,cols=null,size=23,head=true}={}){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,values,...(cols?{columnWidths:cols}:{})});
 t.borders.assign({fill:'#D4BCA0',width:1,style:'solid'});
 for(let r=0;r<values.length;r++)for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=(r===0&&head)?C.burgundy:(r%2?'#FFF8ED':C.cream);cell.text.style={typeface:'Helvetica Now Text',fontSize:size,color:(r===0&&head)?C.cream:C.ink,bold:r===0&&head,autoFit:'none',insets:{top:10,right:12,bottom:10,left:12}};
 }return t;
}

// 01 Minimal cover with one existing photographic asset.
{
const s=slide('Dear Body\nMaster Playbook',C.burgundy,true);
// cover title uses a deliberately narrower text block than standard pages
s.shapes.items[0].position={left:62,top:120,width:565,height:240};
s.shapes.items[0].text.style={typeface:'Cenzo Flare',fontSize:64,bold:true,color:C.cream,autoFit:'none',insets:{top:0,right:0,bottom:0,left:0}};
txt(s,'The brand, products, content\nand website',62,416,540,100,31,C.cream);
txt(s,'25 September 2026',62,610,520,35,22,C.cream);
await image(s,await a('mojito-metallique','08-'),675,0,605,720,'cover');notes(s,[1,2]);
}
{
const s=slide('A Scent Journey',C.cream);body(s,'London-formulated fragrance culture\ncurated for Filipino everyday life.',190,62,670,41,C.burgundy,180);
body(s,'Premium and approachable.\nWarm, vibrant, confident and playful.',430,62,650,30,C.ink,130);
await image(s,await a('amber-oud-silk','08-'),820,164,400,400);notes(s,[3,5,6]);
}
{
const s=slide('How the brand system was built');nativeTable(s,[['Stage','Decision'],['Foundation','Existing products and official identity shape the Philippines brand experience.'],['22 September','The Canva playbook becomes a written guide and digital brand tokens.'],['24 September','Product galleries, the Shopify experience and COD ordering form one system.'],['25 September','Owner references sharpen the campaign into warm, tactile, face-free imagery.']],{size:24,cols:[225,931]});notes(s,[4]);
}
{
const s=slide('Audience and brand promise',C.orange);lines(s,['An everyday fragrance choice that feels personal.','The early persona: online shoppers aged 22–35, including students and working individuals.','A clear product story and an attainable premium experience.'],{gap:125,size:32});foot(s,'The persona is a planning reference. It does not limit who can enjoy the products.');notes(s,[5,6]);
}
{
const s=slide('The official palette');
const vals=[['BURGUNDY','RED','ORANGE','GOLDEN TAN','CREAM'],['#5C0006','#9A1106','#D46601','#E9A250','#F4E3CB']];
const t=nativeTable(s,vals,{y:204,h:220,size:25,head:false});
const colors=[C.burgundy,C.red,C.orange,C.tan,C.cream];for(let r=0;r<2;r++)for(let c=0;c<5;c++){let z=t.getCell(r,c);z.fill=colors[c];z.text.style={typeface:'Helvetica Now Text',fontSize:25,color:c<3?C.cream:C.burgundy,autoFit:'none'};}
body(s,'Warm brand colors anchor the composition.\nReal scent colors add individuality.',500,62,1120,31,C.burgundy,120);notes(s,[7]);
}
{
const s=slide('Typography and official identity');
txt(s,'CENZO FLARE BOLD',62,181,1110,92,57,C.burgundy,'Cenzo Flare',true);
txt(s,'Helvetica Now Display Light',62,300,1100,80,43,C.ink);
txt(s,'Display headings stay short. Supporting copy stays readable.',62,410,1100,60,29,C.ink);
await image(s,theme+'theme/assets/sj-logo-official-dark.png',62,525,460,86);
txt(s,'Use original logo artwork and supplied fonts.\nText Regular remains in the earlier gallery sources.',615,525,585,90,25,C.ink);notes(s,[8]);
}
{
const s=slide('The owner visual references');await image(s,'handoff/assets/brand-references/2026-09-25-publication-materials-owner-reference.png',62,169,690,395);await image(s,'handoff/assets/brand-references/2026-09-25-social-media-look-owner-reference.png',790,196,425,260);
txt(s,'Warm color\nTactile objects\nTight editorial crops',790,476,425,155,29,C.burgundy);
foot(s,'References show historical faces. The current Facebook campaign uses face-free crops.');notes(s,[9]);
}
{
const s=slide('The photography standard',C.burgundy,true);await image(s,await a('charme-envoutant','11-'),62,175,460,460);
lines(s,['Exact packaging and realistic scale','Natural hands, light and contact shadows','An active everyday moment','New copy added with actual fonts'],{x:590,y:187,w:625,gap:107,size:31,color:C.cream});notes(s,[10,19]);
}
{
const s=slide('Six priority scents');
for(let i=0;i<6;i++){
const pg=pages[10+i];const source=pg.blocks.find(b=>b.kind==='images').paths[0];const x=62+i*195;
await image(s,source,x,220,184,184);txt(s,pg.title,x,432,184,120,25,C.burgundy,'Cenzo Flare',true);
}
foot(s,'Women: cream labels. Men: black labels. The current campaign covers these six only.');notes(s,[11,12,13,14,15,16,17]);
}
for(let i=0;i<6;i++){
const pg=pages[10+i];const s=slide(pg.title,i%2?C.burgundy:C.cream,i%2===1);const ink=i%2?C.cream:C.burgundy;
const imgs=pg.blocks.find(b=>b.kind==='images');await image(s,imgs.paths[1],710,156,510,510);
const desc=pg.blocks.find(b=>b.style==='Lead').text;
txt(s,desc,62,186,595,158,36,ink,'Helvetica Now Display');
const traits=pg.blocks.filter(b=>b.style==='Caption')[1].text.replaceAll(' · ','\n');txt(s,traits,62,386,585,130,27,ink,'Cenzo Flare',true);
const hh=pg.blocks.filter(b=>b.style==='Heading 2')[1].text;txt(s,hh,62,560,585,78,25,ink);notes(s,[11+i]);
}
{
const s=slide('The twelve-frame gallery');await image(s,await a('mojito-metallique','02-'),62,182,400,400);
txt(s,'Choice information first',527,182,680,65,36,C.burgundy,'Cenzo Flare',true);
txt(s,'01  Main image\n02  Scent description\n03  Who it fits\n04  Product profile\n05  Ingredients and care',527,274,690,235,28,C.ink);
txt(s,'Then lifestyle, spray, packaging, cap detail\nand the closing hero.',527,545,690,90,28,C.ink);notes(s,[18,19]);
}
{
const s=slide('Product facts and approved copy');nativeTable(s,[['Physical facts','Scent description','Personality copy'],['Owner photos and package transcription','Exact owner-approved sentence','Approved wearer interpretation'],['Preserve volume, code, ingredients and construction.','Keep notes and performance claims within the evidence.','Use a “For someone…” sentence and three traits.']],{y:204,h:326,size:26});
foot(s,'Product names alone do not authorize ingredients, note pyramids or longevity claims.');notes(s,[20]);
}
{
const s=slide('The Facebook offer',C.red,true);
txt(s,'FREE SHIPPING\nON 2+ ITEMS',62,191,1140,210,74,C.cream,'Cenzo Flare',true);
txt(s,'CASH ON DELIVERY',62,449,1130,73,43,C.cream);
txt(s,'SHOP NOW',62,565,1130,72,48,C.cream,'Cenzo Flare',true);notes(s,[21]);
}
{
const s=slide('Face-free campaign direction');
await image(s,await a('mistened-narcissus','08-'),62,170,460,460);
lines(s,['Filipino hands, arms and torso crops','Women for cream labels\nMen for black labels','No partial faces, reflections, screens or background portraits'],{x:588,y:181,w:625,gap:137,size:31});notes(s,[21,22]);
}
{
const s=slide('Distinct scenes for every scent');nativeTable(s,[['Scent','Content world'],['Mojito Metallique','Dance rehearsal, headphones and a cobalt bag'],['Amber Oud Silk','Apartment entry, keys, cotton and canvas'],['Mistened Narcissus','Roller-rink preparation and lavender skates'],['Charme Envoûtant','Parked convertible, orange styling and chrome'],['Oud Mirage','Sunlit park and bicycle bag'],['Rtulle & Satin','Pottery-painting café, tote and ceramics']],{size:23,cols:[355,801],h:441});notes(s,[22]);
}
{
const s=slide('The fifteen-second video structure',C.tan);nativeTable(s,[['Timing','What the viewer sees'],['0–4 seconds','Product visible with FREE SHIPPING ON 2+ ITEMS'],['4–6 seconds','One natural action with CASH ON DELIVERY'],['6–11 seconds','Exact scent name and approved description'],['11–15 seconds','Clear product end card with SHOP NOW']],{y:195,h:340,size:28,cols:[275,881]});foot(s,'All shots remain face-free. The Word playbook contains scripts for all six scents.');notes(s,[23,24]);
}
{
const s=slide('The Shopify experience');
lines(s,['A native Online Store 2.0 theme for dearbody.ph','Product-free homepage with Women and Men gateways','Twelve-frame galleries and a five-question Scent Finder','Shopify product data and same-page COD ordering'],{gap:107,size:32});notes(s,[25,27]);
}
{
const s=slide('Website visual examples');await image(s,theme+'qa/screenshots/home-hero/home-light-1440-top.png',62,179,678,471);await image(s,theme+'qa/screenshots/gallery-controls/layout-1440-dark.png',790,179,405,454);
foot(s,'Historical layout snapshots. Current theme source and written rules govern new work.');notes(s,[26,27]);
}
{
const s=slide('Scent Finder');body(s,'Five questions. One scent to explore.',183,62,1140,44,C.burgundy,80);
nativeTable(s,[['Question','Matching role'],['Collection','Filters eligible scents first'],['Scent style','5 points'],['Mood','3 points'],['Occasion and scent feel','1 point each']],{y:300,h:290,size:26,cols:[475,681]});foot(s,'Discovery labels describe character. They do not establish longevity or measured strength.');notes(s,[28]);
}
{
const s=slide('The recorded offer and checkout');nativeTable(s,[['Order','Recorded amount'],['One bottle','₱799 + ₱80 shipping = ₱879'],['Two bottles','₱1,598 with free shipping'],['Three bottles','₱2,397 with free shipping']],{y:183,h:250,size:29,cols:[400,756]});
body(s,'Add to order → quantities → Check out →\nEasySell delivery form → saved-order confirmation',478,62,1140,31,C.burgundy,115);foot(s,'Recorded 24 September 2026. Verify current prices, stock and shipping before a new release.');notes(s,[29]);
}
{
const s=slide('Delivery and customer care');nativeTable(s,[['Destination','Recorded estimate'],['Luzon','2–3 days'],['Visayas','3–5 days'],['Mindanao','5–10 days']],{y:188,h:260,size:29,cols:[440,716]});
body(s,'Support uses actual order records and approved product facts.\nAn opened popup does not prove that an order was saved.',495,62,1150,29,C.ink,110);foot(s,'Delivery windows are estimates. Confirm current courier and dispatch conditions.');notes(s,[30]);
}
{
const s=slide('The production workflow',C.burgundy,true);lines(s,['Brief and verify the product evidence','Map a distinct scene and create the photograph','Preserve the product and add real typography','Review the output and hand off the sources'],{gap:110,size:36,color:C.cream});notes(s,[31]);
}
{
const s=slide('The final quality check');lines(s,['Exact product, approved copy and correct casting','No faces or face fragments in current campaign work','Readable typography and realistic hands and scale','Working mobile layout and verified order quantities','Recorded source, version, review and publication status'],{gap:89,size:29});notes(s,[32]);
}
{
const s=slide('A useful AI and collaborator handoff');
lines(s,['The Word master carries the full rules and copy.','Attach both owner references and the real product photos.','Name the exact scent, output, channel and latest instruction.','Keep historical ideas separate from current authority.'],{gap:106,size:31});foot(s,'The Word playbook includes a ready-to-paste prompt and compact fact pack.');notes(s,[35,36]);
}
{
const s=slide('The project source map');nativeTable(s,[['Need','Source'],['Brand direction','BRAND_GUIDE.md and AGENTS.md'],['Colors and type','brand.tokens.json and the supplied font folder'],['Exact descriptions','SCENT_DESCRIPTION_SOURCE_LEDGER.md'],['Product evidence','Per-scent source facts and approved gallery files'],['Current website','output/website/scent-journey-theme/'],['Current ordering','UPDATE-COD-ORDERS.md and its QA evidence']],{size:23,cols:[330,826],h:429});notes(s,[37,38]);
}
{
const s=slide('Keeping the brand consistent',C.burgundy,true);body(s,'One shared source of truth.\nA clear record of every new decision.',192,62,1100,51,C.cream,190);
txt(s,'Keep the playbook, source assets and AI briefs aligned\nwhen the owner changes direction.',62,450,1130,130,32,C.cream);
txt(s,'A SCENT JOURNEY',62,622,1120,55,32,C.cream,'Cenzo Flare',true);notes(s,[38]);
}

const candidate=path.join(TMP,'candidate.pptx');
await (await PresentationFile.exportPptx(pres)).save(candidate);
await fs.writeFile(path.join(TMP,'image-sources.json'),JSON.stringify(imgmanifest,null,2));
await fs.writeFile(path.join(TMP,'slides.json'),JSON.stringify(slidemeta,null,2));
for(let i=0;i<pres.slides.items.length;i++){
 const s=pres.slides.items[i]; const png=await pres.export({slide:s,format:'png',scale:1});await fs.writeFile(path.join(TMP,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
 const layout=await s.export({format:'layout'});await fs.writeFile(path.join(TMP,`slide-${String(i+1).padStart(2,'0')}.json`),await layout.text());
}
const final=path.join(HERE,'deliverables','Dear-Body-Master-Playbook-v1.pptx');
await fs.mkdir(path.dirname(final),{recursive:true});
const result=await finalizePresentation({workspaceDir:HERE,candidatePath:candidate,finalPath:final,pythonExecutable:runtime+'/python/python.exe',integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],fontPolicy:{basis:'user_request',families:['Cenzo Flare','Helvetica Now Display','Helvetica Now Text']},verifyArtifactToolImport:true,receiptPath:path.join(TMP,'validation-v1.json')});
console.log(JSON.stringify({slides:pres.slides.items.length,final,result}));
