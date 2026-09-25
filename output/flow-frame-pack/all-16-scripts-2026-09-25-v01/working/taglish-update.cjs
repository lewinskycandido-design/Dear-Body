const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),project=path.resolve(root,'../../..');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2));
const scripts=read(path.join(root,'script-manifest.json'));
const offer='Free shipping kapag two items or more!',cod='May cash on delivery din.';
const cta='Pili ng two or more items para free shipping, tapos tap Order Now.';
const capBenefit='May magnetic cap—takip sa spray nozzle, na nagki-click sa puwesto.';
const collectionBenefit='Puwede ring i-collect at i-display.';
const personalityBenefit='May magnetic cap na nagki-click sa puwesto. Puwedeng i-collect at i-display sa shelf mo.';
const middle={
 '01':['Ready na ang playlist. Ikaw, ready na rin?','Kilalanin ang Mojito Metallique ng Dear Body.','Soft at creamy ang sweetness, may light fruity glow.','Scent mo muna, bago ang next track.'],
 '02':['Ready na ang outfit. Finishing touch na lang.','Kilalanin ang Amber Oud Silk ng Dear Body.','Dark spice at smoke, may warm, addictive edge.','Isang scent moment, bago ka lumabas.'],
 '03':['Ready na ang skates. Scent mo naman.','Kilalanin ang Mistened Narcissus ng Dear Body.','Juicy berries na may smooth at sweet na finish.','Tapos, oras na para mag-enjoy.'],
 '04':['Sunny stop muna. Dala mo ang sariling style.','Kilalanin ang Charme Envoûtant ng Dear Body.','Rich, spiced sweetness na deep at indulgent ang dating.','Sa little details, ipakita ang style mo.'],
 '05':['Bago ang next game, moment mo muna.','Kilalanin ang Oud Mirage ng Dear Body.','Dark rose na balot sa smoky, woody depth.','Style mo. Sarili mong chapter.'],
 '06':['Konting color. Space para sa creativity mo.','Kilalanin ang Rtulle & Satin ng Dear Body.','Airy sweetness na may warm, glowing trail.','Isama mo ang creative side mo.'],
 '07':['Mojito Metallique, mula sa Dear Body.','Magnetic cap—takip sa spray nozzle, na nagki-click sa puwesto.','Soft, creamy sweetness, may fruity glow. Puwedeng i-collect at i-display.','Little detail, para sa scent routine mo.'],
 '08':['Mojito Metallique: para sa friendly, easygoing, at lighthearted na personality.','Amber Oud Silk: para sa bold, warm, at self-assured na personality.','May magnetic cap. Ang bottle at matching canister, puwedeng i-collect at i-display sa shelf mo.','Madaling ibalik ang takip. Piliin ang favorites mo.'],
 '09':['Dear Body. London-formulated scents, pinili para sa Filipino lifestyle.','Ang mission namin: maingat na pagpili ng fragrances na bagay sa panlasa, lifestyle, at everyday moments ng mga Filipino.','Ang vision namin: maging parte ng everyday life ng bawat Filipino ang fragrance culture ng London.','May magnetic cap na nagki-click. Puwedeng i-collect at i-display.'],
 '10':['Hanapin ang scent na bagay sa iyo.','Mojito Metallique: para sa friendly, easygoing, at lighthearted na personality.','Oud Mirage: para sa independent, reflective, at self-assured na personality.','May magnetic cap na nagki-click. Puwedeng i-collect at i-display.']
};
const hooks={
 '11':'Easygoing ang vibe mo? Dito simulan ang scent journey.',
 '12':'Bold pero warm ang vibe? Hanapin ang scent mo.',
 '13':'Mahilig sa little joys? Anong scent ang bagay sa iyo?',
 '14':'Expressive ang style mo? Sarili mong scent journey, simulan na.',
 '15':'May sarili kang style? Hanapin ang scent na bagay sa iyo.',
 '16':'Malikot ang imagination mo? Discover ang scent personality mo.'
};
const traits={
 '11':'Mojito Metallique: para sa friendly, easygoing, at lighthearted na personality.',
 '12':'Amber Oud Silk: para sa bold, warm, at self-assured na personality.',
 '13':'Mistened Narcissus: para sa cheerful, playful, at openhearted na personality.',
 '14':'Charme Envoûtant: para sa expressive, passionate, at confident na personality.',
 '15':'Oud Mirage: para sa independent, reflective, at self-assured na personality.',
 '16':'Rtulle & Satin: para sa gentle, imaginative, at lighthearted na personality.'
};
for(const s of scripts){
 const lines=s.type==='campaign'?[offer,cod,...middle[s.id],cta]:[hooks[s.id],traits[s.id],personalityBenefit,'Free shipping sa two or more items. May COD din.','Find your scent. Tap para simulan ang scent journey mo.'];
 if(s.type==='campaign'&&Number(s.id)<=6){
  lines[2]='Kilalanin ang '+s.scent+' ng Dear Body.';
  lines[3]=capBenefit;
  lines[4]+=' '+collectionBenefit;
 }
 if(s.type==='campaign'&&Number(s.id)<=7){
  const personalityId=s.id==='07'?'11':String(Number(s.id)+10);
  lines[5]=traits[personalityId].split(': ')[1].replace(/^para/,'Para');
 }
 if(lines.length!==s.shots.length)throw Error('Shot mismatch '+s.id);
 s.shots.forEach((x,i)=>x.voiceover=lines[i]);s.voiceLanguage='Natural conversational Taglish';
}
require('./problem-solution-copy.cjs')(scripts);
write(path.join(root,'script-manifest.json'),scripts);
const vf=path.join(root,'voice-identity.json'),v=read(vf);
v.language='Natural conversational Taglish: fluid Filipino/Tagalog sentence structure mixed with familiar English fragrance and shopping terms. Use a natural Filipina accent. Speak only the supplied words; preserve scent names and website button labels exactly.';
v.masterPrompt=v.masterPrompt.replace('Use natural Philippine English and fluent Tagalog only where it appears in the script.','Speak natural conversational Taglish with fluid Tagalog-English code-switching and a natural Filipina accent. Follow the exact supplied Taglish script; do not translate it into all-English or formal Tagalog. Keep scent names and website button labels unchanged.');
write(vf,v);fs.writeFileSync(path.join(root,'voice-identity-prompt.txt'),v.masterPrompt+'\n');
let build=fs.readFileSync(path.join(root,'working/build-pack.cjs'),'utf8');
build=build.replace("'Choose two or more items for free shipping, then tap Order Now.'",JSON.stringify(cta));
build=build.replace("'Curated for Filipino life.'","'Pinili para sa Filipino lifestyle.'");
build=build.replace('Each shot now has one complete prompt:','Each shot now has one complete Taglish prompt:');
fs.writeFileSync(path.join(root,'working/build-pack.cjs'),build);
const fields=['person','tone','personality','language','pace','performance','cta','avoid'];
const md='# Dear Body voice identity\n\nRecommended consistent Taglish narrator for all 16 videos.\n\n'+fields.map(k=>'**'+k.charAt(0).toUpperCase()+k.slice(1)+':** '+v[k]).join('\n\n')+'\n\n## Copy-and-paste voice identity\n\n'+v.masterPrompt+'\n\nUse the same narrator or selected voice. Record a full script in one continuous take when possible, then align it to the supplied timings. This is a casting and performance brief, not recorded audio.\n\n## Delivery by script\n\n'+scripts.map(s=>'**'+s.id+' · '+s.scent+' · '+s.type+'**\n\n'+v.scriptDirections[s.id]).join('\n\n')+'\n';
fs.writeFileSync(path.join(root,'VOICE-IDENTITY.md'),md);
let voiceHTML=fs.readFileSync(path.join(root,'VOICE-IDENTITY.html'),'utf8');
const oldLanguage=/Natural Philippine English with fluent, effortless Tagalog code-switching wherever the written script uses Tagalog\. Keep the wording exactly as supplied\./g;
voiceHTML=voiceHTML.replace(oldLanguage,v.language).replace(/Use natural Philippine English and fluent Tagalog only where it appears in the script\./g,'Speak natural conversational Taglish with fluid Tagalog-English code-switching and a natural Filipina accent. Follow the exact supplied Taglish script; do not translate it into all-English or formal Tagalog. Keep scent names and website button labels unchanged.');
fs.writeFileSync(path.join(root,'VOICE-IDENTITY.html'),voiceHTML);
// Keep the earlier campaign source scripts aligned without changing approved on-screen scent descriptions.
const campaign=path.join(project,'output/facebook-campaign/bold-faceless-2026-09-25-v02');
for(const name of ['all-content-concepts.json','content-concepts.json','homepage-content-concepts.json']){
 const f=path.join(campaign,name);if(!fs.existsSync(f))continue;
 const a=read(f),list=Array.isArray(a)?a:a.concepts;
 for(const c of list){const s=scripts.find(s=>s.id===c.id&&s.type==='campaign');if(!s)continue;c.shots.forEach((x,i)=>{x[3]=s.shots[i].voiceover;x[4]=s.shots[i].onScreen;});c.adStrategy=s.adStrategy;if(c.short)c.short='Short-edit direction: keep the opening question, the named scent and approved scent description, then one CTA. Keep free shipping on 2+ items and COD readable on screen. Re-time to the recorded narration; do not compress all product details into a rushed 15-second read.';}
 if(a.intro)a.intro=a.intro.map(x=>[x[0],x[1].replace('English on-screen text is paired with conversational Taglish offer lines and the approved English scent descriptions.','English on-screen copy is paired with conversational Taglish narration, preserving the meaning of the approved scent descriptions.')]);
 write(f,a);
}
console.log('Updated all 100 voiceover lines, Taglish narrator directions and campaign source data.');
