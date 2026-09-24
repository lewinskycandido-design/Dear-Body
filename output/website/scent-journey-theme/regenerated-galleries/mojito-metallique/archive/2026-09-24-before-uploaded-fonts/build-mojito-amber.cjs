const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const base = __dirname;
const scents = [
  { handle: 'mojito-metallique', name: ['MOJITO', 'METALLIQUE'], code: 'P11138', barcode: '5056795407345', accent: '#e8ba25', description: ['Soft, creamy', 'sweetness with a', 'light fruity glow.'], exactDescription: 'Soft, creamy sweetness with a light fruity glow.', fit: ['For someone drawn', 'to soft, creamy', 'sweetness and a', 'light fruity glow.'], exactFit: 'For someone drawn to soft, creamy sweetness and a light fruity glow.', traits: ['SOFT', 'CREAMY', 'GLOWING'], ingredients: ['Alcohol', 'Water (Aqua)', 'Fragrance (Parfum)', 'PEG-40 Hydrogenated', 'Castor Oil', 'Propylene Glycol', 'Linalool', 'Limonene', 'Coumarin', 'Anise Alcohol'] },
  { handle: 'amber-oud-silk', name: ['AMBER OUD', 'SILK'], code: 'P11038', barcode: '5056795407338', accent: '#dcaa97', description: ['Dark spice and smoke', 'with a warm,', 'addictive edge.'], exactDescription: 'Dark spice and smoke with a warm, addictive edge.', fit: ['For someone drawn', 'to warm depth,', 'smoky spice, and', 'an expressive,', 'addictive edge.'], exactFit: 'For someone drawn to warm depth, smoky spice, and an expressive, addictive edge.', traits: ['WARM', 'SMOKY', 'EXPRESSIVE'], ingredients: ['Alcohol', 'Water (Aqua)', 'Fragrance (Parfum)', 'PEG-40 Hydrogenated', 'Castor Oil', 'Propylene Glycol', 'Linalool', 'Limonene', 'Citronellol', 'Eugenol', 'Coumarin', 'Cinnamal', 'Citral', 'Geraniol'] }
];
const names = ['featured-packshot','spray-in-motion','uncapped-reveal','magnetic-cap','lifestyle-hero','handheld-detail','editorial-lifestyle','product-profile','ingredients-care','scent-journey','scent-description','who-it-fits'];
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const rect = (x,y,w,h,fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
function text(lines,x,y,size=60,leading=1.22,weight=400,color='#231c1a',spacing=0) {
  return `<text x="${x}" y="${y}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" fill="${color}">${lines.map((s,i)=>`<tspan x="${x}" dy="${i ? size*leading : 0}">${esc(s)}</tspan>`).join('')}</text>`;
}
const rule = (x,y,w=110) => rect(x,y,w,7,'#631f35');
function overlay(frame,s) {
  let a = '';
  if(frame===4) {
    a += rule(110,680,130);
    a += text(['MAGNETIC','CAP'],110,820,76,1.12,600,'#631f35');
  }
  if(frame===8) {
    a += rect(0,0,920,2048,'#f8f1e4');
    a += text(['THE PROFILE'],120,215,40,1.2,500,'#631f35',5);
    a += rule(120,270,112);
    a += text(s.name,120,470,86,1.09,600);
    a += text(['PARFUM LONDON'],120,710,38,1.2,400,'#631f35',4);
    a += rect(120,830,760,2,'#c7b9aa');
    a += text(['50 ml'],120,1045,128,1.1,400);
    a += text(['1.69 fl. oz.'],120,1135,48);
    a += text(['MAGNETIC CAP'],120,1375,49,1.2,500,'#631f35');
    a += rect(120,1480,760,2,'#c7b9aa');
    a += text(['PRODUCT CODE',s.code],120,1600,43,1.55,400);
    a += text(['A SCENT JOURNEY'],120,1900,34,1.2,500,'#631f35',4);
  }
  if(frame===9) {
    a += rect(1020,0,1028,2048,'#f8f1e4');
    a += text(['INGREDIENTS & CARE'],1115,185,55,1.1,600,'#631f35');
    a += text([s.name.join(' ')],1115,273,39,1.2,400);
    a += rule(1115,320,104);
    const start=443, size=51, line=78;
    a += text(s.ingredients,1115,start,size,line/size,400);
    const foot=Math.max(1420,start+(s.ingredients.length-1)*line+145);
    a += rect(1115,foot-40,810,2,'#c7b9aa');
    a += text(['Flammable.'],1115,foot+40,53,1.1,600,'#631f35');
    a += text(['50 ml / 1.69 fl. oz.',`Product code: ${s.code}`,`Barcode: ${s.barcode}`],1115,foot+143,42,1.52,400);
  }
  if(frame===10) {
    a += rect(100,105,1010,315,'#f8f1e4');
    a += text(['A SCENT','JOURNEY'],145,235,87,1.12,600,'#631f35',1);
  }
  if(frame===11) {
    a += rect(0,0,1060,2048,'#f8f1e4');
    a += text(['THE SCENT'],120,220,40,1.2,500,'#631f35',5);
    a += rule(120,275,112);
    a += text(s.name,120,470,83,1.1,600);
    a += text(s.description,120,895,73,1.33,400);
    a += text(['A SCENT JOURNEY'],120,1890,34,1.2,500,'#631f35',4);
  }
  if(frame===12) {
    a += rect(0,0,1060,2048,'#f8f1e4');
    a += text(['WHO IT FITS'],120,220,51,1.2,600,'#631f35',3);
    a += rule(120,285,112);
    a += text(s.name,120,470,81,1.1,600);
    a += text(s.fit,120,830,63,1.34,400);
    a += text(s.traits,120,1420,50,1.65,600,'#631f35',3);
    a += text(['A SCENT JOURNEY'],120,1900,34,1.2,500,'#631f35',4);
  }
  return a ? Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 2048 2048">${a}</svg>`) : null;
}
async function run() {
  const requested=process.argv.slice(2);
  const priorPath=path.join(base,'MOJITO-AMBER-BUILD-MANIFEST.json');
  const priorRecords=fs.existsSync(priorPath) ? JSON.parse(fs.readFileSync(priorPath,'utf8')).records : [];
  const records=[];
  for(const s of scents) {
    if(process.env.SJ_GALLERY_HANDLE && process.env.SJ_GALLERY_HANDLE!==s.handle) continue;
    const working=path.join(base,s.handle,'working');
    for(let frame=1;frame<=12;frame++) {
      if(requested.length&&!requested.includes(String(frame))) continue;
      const number=String(frame).padStart(2,'0');
      const f=fs.readdirSync(working).find(n=>n.startsWith(number+'-')&&n.endsWith('.png'));
      if(!f){console.log(`Waiting: ${s.handle} ${number}`);continue;}
      const src=path.join(working,f), out=path.join(base,s.handle,'final',`${number}-${names[frame-1]}.png`);
      const original=await sharp(src).metadata();
      const normalized=await sharp(src).resize(2048,2048,{fit:'fill',kernel:'lanczos3'}).toColourspace('srgb').png().toBuffer();
      const layer=overlay(frame,s);
      const master=layer ? sharp(normalized).composite([{input:layer}]) : sharp(normalized);
      await master.withIccProfile('srgb').png().toFile(out);
      await sharp(out).resize(1200,1200).withIccProfile('srgb').jpeg({quality:88,mozjpeg:true,chromaSubsampling:'4:4:4'}).toFile(path.join(base,s.handle,'final-web',`${number}.jpg`));
      records.push({handle:s.handle,frame:number,source:src,sourceDimensions:[original.width,original.height],master:out,masterDimensions:[2048,2048],webDimensions:[1200,1200],type:layer?'Deterministic SVG typography over new ImageGen base':'New ImageGen photograph',font:layer?'Helvetica Neue; Helvetica/Arial fallback':''});
      console.log(`Built ${s.handle} ${number}`);
    }
  }
  const allRecords = [...priorRecords.filter(p=>!records.some(r=>r.handle===p.handle&&r.frame===p.frame)),...records].sort((a,b)=>(a.handle+a.frame).localeCompare(b.handle+b.frame));
  fs.writeFileSync(priorPath,JSON.stringify({createdAt:new Date().toISOString(),records:allRecords,approvedCopy:scents.map(s=>({handle:s.handle,description:s.exactDescription,fit:s.exactFit,traits:s.traits})),sourceNote:'Every photographic base is newly generated for this website. Native ImageGen1254px output normalized to2048px per required master specification; web derivatives1200px. Typography is deterministic; no imported old gallery image.'},null,2));
}
run().catch(e=>{console.error(e);process.exit(1)});
