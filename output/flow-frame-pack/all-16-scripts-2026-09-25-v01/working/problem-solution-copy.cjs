const scents=[
 {name:'Mojito Metallique',hook:'Gusto ng sweet scent, pero hindi alam saan magsisimula?',screen:'SWEET SCENT? / START HERE',description:'Soft at creamy ang sweetness, may light fruity glow.',approved:'Soft, creamy sweetness with a light fruity glow.',traits:'friendly, easygoing, at lighthearted',fit:'FRIENDLY · EASYGOING · LIGHTHEARTED',short:'SOFT · CREAMY · FRUITY'},
 {name:'Amber Oud Silk',hook:'Naghahanap ng warm scent na may spice at smoke?',screen:'WARM SCENT? / SPICE & SMOKE',description:'Dark spice at smoke, may warm, addictive edge.',approved:'Dark spice and smoke with a warm, addictive edge.',traits:'bold, warm, at self-assured',fit:'BOLD · WARM · SELF-ASSURED',short:'DARK SPICE · SMOKE · WARMTH'},
 {name:'Mistened Narcissus',hook:'Hirap pumili ng fruity scent na may sweet finish?',screen:'FRUITY SCENT? / SWEET FINISH',description:'Juicy berries na may smooth at sweet na finish.',approved:'Juicy berries softened by a smooth, sweet finish.',traits:'cheerful, playful, at openhearted',fit:'CHEERFUL · PLAYFUL · OPENHEARTED',short:'JUICY BERRIES · SWEET FINISH'},
 {name:'Charme Envoûtant',hook:'Gusto ng sweet scent na may mas rich na dating?',screen:'SWEET SCENT? / RICH & SPICED',description:'Rich, spiced sweetness na deep at indulgent ang dating.',approved:'Rich, spiced sweetness that feels deep and indulgent.',traits:'expressive, passionate, at confident',fit:'EXPRESSIVE · PASSIONATE · CONFIDENT',short:'RICH · SPICED · INDULGENT'},
 {name:'Oud Mirage',hook:'Rose ang gusto mo, pero may smoky depth sana?',screen:'ROSE, WITH DEPTH? / SMOKY & WOODY',description:'Dark rose na balot sa smoky, woody depth.',approved:'Dark rose wrapped in smoky, woody depth.',traits:'independent, reflective, at self-assured',fit:'INDEPENDENT · REFLECTIVE · SELF-ASSURED',short:'DARK ROSE · SMOKY · WOODY'},
 {name:'Rtulle & Satin',hook:'Naghahanap ng airy sweetness na may warm na dating?',screen:'AIRY SWEETNESS? / A WARM TRAIL',description:'Airy sweetness na may warm, glowing trail.',approved:'Airy sweetness with a warm, glowing trail.',traits:'gentle, imaginative, at lighthearted',fit:'GENTLE · IMAGINATIVE · LIGHTHEARTED',short:'AIRY SWEETNESS · WARM TRAIL'}
];
const shipping='Free shipping sa two items or more.';
const close='May cash on delivery din. Bagay sa vibe mo? Tap Order Now.';
const feature='May magnetic cap na nagki-click, pantakip sa spray nozzle. Puwedeng i-collect at i-display.';
const shortFeature='May magnetic cap na nagki-click. Puwedeng i-collect at i-display.';
const finalCopy='ORDER NOW / FREE SHIPPING ON 2+ ITEMS / CASH ON DELIVERY';
const fit=c=>'Para sa '+c.traits+' na personality.';
function apply(s,lines,copy,roles,reason){
 if(lines.length!==s.shots.length||copy.length!==s.shots.length)throw Error('Script length '+s.id);
 s.adStrategy={framework:'Buyer question → relevant scent or product answer → specific details → offer → CTA',buyerQuestion:lines[0],reasonToConsider:reason,performanceStatus:'Creative hypothesis to test; no ad results yet.'};
 s.shots.forEach((x,i)=>{x.voiceover=lines[i];x.onScreen=copy[i];x.adRole=roles[i];});
}
module.exports=function(scripts){
 for(const s of scripts){
  const id=Number(s.id);
  if(id<=6){
   const c=scents[id-1];
   apply(s,[c.hook,'Try ang '+c.name+' ng Dear Body.',c.description,fit(c),feature,shipping,close],
    [c.screen,c.name.toUpperCase(),c.approved,c.fit,'MAGNETIC CAP / COLLECT & DISPLAY','FREE SHIPPING / ON 2+ ITEMS',finalCopy],
    ['Buyer question','Introduce the scent','Answer with the scent profile','Who it suits','Physical product details','Shipping offer','COD and purchase CTA'],c.approved+' An option for someone drawn to a '+c.traits+' personality.');
  } else if(id>=11){
   const c=scents[id-11];
   apply(s,[c.hook,'Try '+c.name+'. '+c.description,fit(c),shortFeature,'Free shipping sa two items or more. May COD din. Find your scent.'],
    [c.screen,c.name.toUpperCase()+' / '+c.short,c.fit,'MAGNETIC CAP / COLLECT & DISPLAY','FIND YOUR SCENT / FREE SHIPPING ON 2+ ITEMS / CASH ON DELIVERY'],
    ['Buyer question','Answer with the scent and its profile','Who it suits','Physical product details','Offer and discovery CTA'],c.approved+' Explore this option, then use the scent finder to compare preferences.');
  }
 }
 const byId=id=>scripts.find(s=>s.id===id);
 apply(byId('07'),['Pati details ng perfume bottle, mahalaga sa iyo?','Kilalanin ang Mojito Metallique.',scents[0].description,'Magnetic cap—takip sa spray nozzle, na nagki-click sa puwesto.','Para sa friendly, easygoing, at lighthearted. Puwedeng i-collect at i-display.',shipping,close],
  ['LOVE THE LITTLE DETAILS?','MOJITO METALLIQUE',scents[0].approved,'MAGNETIC CAP / CLICKS INTO PLACE','FRIENDLY · EASYGOING · LIGHTHEARTED / COLLECT & DISPLAY','FREE SHIPPING / ON 2+ ITEMS',finalCopy],
  ['Product-detail question','Introduce the scent','Scent profile','Cap purpose and closure','Personality and display','Shipping offer','COD and purchase CTA'],'Mojito combines its approved creamy-fruity scent profile with a cap that covers the spray nozzle and clicks into place.');
 apply(byId('08'),['Gusto ng scent collection na bagay sa shelf mo?','Simulan sa favorites mo.','Mojito Metallique: para sa friendly, easygoing, at lighthearted na personality.','Amber Oud Silk: para sa bold, warm, at self-assured na personality.','Matching canisters na puwedeng i-collect at i-display. May magnetic cap na nagki-click sa puwesto.',shipping,close],
  ['A COLLECTION FOR YOUR SHELF?','START WITH YOUR FAVORITES','MOJITO METALLIQUE / FRIENDLY · EASYGOING · LIGHTHEARTED','AMBER OUD SILK / BOLD · WARM · SELF-ASSURED','MADE TO COLLECT / MADE TO DISPLAY / MAGNETIC CAP','FREE SHIPPING / ON 2+ ITEMS',finalCopy],
  ['Collection question','Simple next step','Mojito option','Amber option','Matching packaging and cap detail','Shipping offer','COD and purchase CTA'],'Choose scents by their personalities; the matching bottle-and-canister pairs can also be displayed together.');
 const mission=byId('09');
 apply(mission,['Anong fragrance ang bagay sa everyday moments mo?','Kilalanin ang Dear Body.',mission.shots[2].voiceover,mission.shots[3].voiceover,mission.shots[4].voiceover,shortFeature,'Free shipping sa two items or more. May COD. Tap Order Now.'],
  ['YOUR EVERYDAY SCENT?','DEAR BODY / A SCENT JOURNEY',mission.shots[2].onScreen,mission.shots[3].onScreen,mission.shots[4].onScreen,'MAGNETIC CAP / COLLECT & DISPLAY',finalCopy],
  ['Everyday-choice question','Introduce the brand','Brand context','Mission as the response','Vision','Product details','Offer and purchase CTA'],'The brand mission is to curate London-formulated fragrances for Filipino tastes and everyday life.');
 apply(byId('10'),['Ang daming scents—paano pipili ng bagay sa iyo?','Simulan sa scent personality.',scents[0].description,'Mojito Metallique: para sa friendly, easygoing, at lighthearted na personality.','Oud Mirage: para sa independent, reflective, at self-assured. Dark rose na may smoky, woody depth.',shortFeature,'Free shipping sa two items or more. May COD. Tap Order Now.'],
  ['UNSURE WHICH SCENT TO CHOOSE?','START WITH YOUR PERSONALITY','MOJITO METALLIQUE / SOFT · CREAMY · FRUITY','MOJITO METALLIQUE / FRIENDLY · EASYGOING · LIGHTHEARTED','OUD MIRAGE / INDEPENDENT · REFLECTIVE · SELF-ASSURED','MAGNETIC CAP / COLLECT & DISPLAY',finalCopy],
  ['Choice question','Simple selection method','Mojito scent profile','Mojito personality','Oud profile and personality','Product details','Offer and purchase CTA'],'Give the viewer two specific scent-and-personality options so the collection is easier to understand.');
};
