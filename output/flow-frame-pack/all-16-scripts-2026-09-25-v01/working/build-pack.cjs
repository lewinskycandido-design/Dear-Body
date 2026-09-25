const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const deps='C:/Users/lhemy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const sharp=require(deps+'/sharp'),{chromium}=require(deps+'/playwright');
const root=path.resolve(__dirname,'..');
const scripts=JSON.parse(fs.readFileSync(path.join(root,'script-manifest.json'),'utf8'));
const voice=JSON.parse(fs.readFileSync(path.join(root,'voice-identity.json'),'utf8'));
// The authored script controls its exact CTA and offer timing.
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const write=(f,s)=>fs.writeFileSync(path.join(root,f),s);
const label={
 '01':'MOJITO METALLIQUE; white label; golden-yellow liquid',
 '02':'AMBER OUD SILK; white label; pale peach liquid',
 '03':'MISTENED NARCISSUS; white label; nearly clear liquid',
 '04':'CHARME ENVOÛTANT; black label; orange-amber liquid',
 '05':'OUD MIRAGE; black label; blue liquid',
 '06':'RTULLE & SATIN; black label; turquoise liquid',
 '07':'MOJITO METALLIQUE; white label; golden-yellow liquid',
 '08':'MOJITO METALLIQUE with yellow canister, AMBER OUD SILK with peach canister; both white labels',
 '09':'woman holding AMBER OUD SILK with white label and pale peach liquid on left; man holding CHARME ENVOÛTANT with black label and orange-amber liquid on right',
 '10':'MOJITO METALLIQUE with white label and golden liquid on left; OUD MIRAGE with black label and blue liquid on right'
};
for(let i=11;i<=16;i++)label[String(i)]=label[String(i-10).padStart(2,'0')];
const motions={
 '01':[
 'Keep the complete upright bottle just above the red pouch. Support the glass with the left hand; the free hand eases the zipper a little farther open. Never lift the bottle by its cap.',
 'The free fingertip taps the blue headphone earcup once and relaxes. The bottle stays supported and readable.',
 'The free hand slides the red pouch strap a few centimeters diagonally across the denim, then stops. The bottle remains upright.',
 'Rotate the held bottle only a few degrees into the sunlight, then settle the MOJITO METALLIQUE name square to camera.',
 'Hold the label steady while the camera pushes in only 3 cm. A restrained sunlight highlight glides over the side glass, never over the label.',
 'Lower the supported bottle toward the open pouch by 2 cm. Stop before the label or base is concealed. Cut here; do not close the zip on glass.',
 'Hold the original bottle-and-pouch composition. Allow only a tiny natural hand settle, then remain motionless for the final three seconds.'
 ],
 '02':[
 'Hold the upright bottle above the orange chair, framed by the burgundy pouch. Make a tiny relaxed hand settle without obscuring its label.',
 'Close the slightly ajar cream compact gently, then slide it a short distance into the pouch. The perfume remains upright in the other hand. No mirror reflection appears.',
 'The free hand draws the coral ribbon into one loose curve and releases it onto the orange seat. Keep the perfume held steady.',
 'The camera eases 3 cm closer to the full held bottle. A small highlight catches the black cap; hold the name steady.',
 'Keep the label and pale-peach liquid sharp against the burgundy pouch. A very slow 3 cm push ends in a still hold.',
 'Move the held bottle a few centimeters beside the pouch while the free fingertips gather the coral ribbon. Keep all glass supported.',
 'Hold the clean bottle-in-hand composition above the orange seat. Remain still for the final three seconds.'
 ],
 '03':[
 'Hold the bottle steady above the cream trousers. The stationary coral skate stays on the right; the free hand rests by its lace.',
 'The right hand gathers one cream lace end gently and releases the tension. Keep the perfume upright and readable on the left.',
 'The free fingertip nudges one skate wheel through a quarter turn, then stops it. The perfume stands securely on the yellow bench away from the wheel.',
 'From the supplied held-bottle position, lift the bottle only 2 cm and settle the MISTENED NARCISSUS name square to camera.',
 'Hold the full bottle in sharp focus, with coral nails and lilac cuff. Make a slow 3 cm camera push without cropping its cap or base.',
 'Lower the capped bottle into the visible pouch while supporting the glass body. Pause while the name is still visible above the opening and cut before concealment; keep the skate stationary.',
 'Hold the separate bottle-in-hand hero beside the stationary skate. Remain still for the final three seconds.'
 ],
 '04':[
 'Hold the upright bottle in front of the red scooter panel with the exact label facing the camera. Only a small natural hand settle.',
 'The free hand adjusts the burgundy strap once, keeping it clear of the bottle label, then relaxes.',
 'Make a controlled lateral camera slide of 3 cm to reveal a little more chrome rail and orange overshirt. Maintain the torso-down crop.',
 'Ease 3 cm closer to the complete bottle, then stop with CHARME ENVOÛTANT sharp and readable.',
 'Hold the black label and orange-amber liquid steady against the cream shirt. Let one subtle reflection move along the side glass.',
 'Lower the supported bottle 2 cm while the free hand settles the burgundy strap. The scooter remains parked and stationary.',
 'Hold the bottle beside the red scooter panel, with no movement in the final three seconds.'
 ],
 '05':[
 'Hold the blue perfume bottle steady against the burgundy jersey. Keep its black label fully front-facing.',
 'The free hand slowly opens the cobalt bag zipper a few centimeters. Keep the held perfume steady and supported.',
 'The free hand lowers the basketball edge gently into the foreground and stops it, well away from the bottle. The ball never rolls.',
 'Make a small camera push toward the complete bottle and stop on OUD MIRAGE. Preserve full cap and glass base.',
 'Hold the blue liquid and black label in crisp focus against orange and burgundy; allow a tiny natural hand settle.',
 'Move the supported bottle 2 cm toward the open cobalt bag. Pause with the whole label still visible and cut before it leaves the frame.',
 'Hold the bottle, bag and jersey hero. No movement for the final three seconds.'
 ],
 '06':[
 'Hold the complete bottle above the turquoise tote. Let the supporting hand settle once, keeping the label upright.',
 'The free hand lowers the clean brush onto the ochre saucer and lets it rest. The other hand holds the bottle steady.',
 'The free hand pulls the tote handle into one loose curve across the frame and stops. Do not move the bottle away from the camera.',
 'Hold the full bottle square to camera, then make a restrained 3 cm push that preserves the exact RTULLE & SATIN label.',
 'Stay on the turquoise liquid, striped cotton and natural skin. Keep the bottle still and move the camera only 3 cm.',
 'Lower the supported bottle a short distance toward the open tote, stopping before the label is concealed. Release the loose tote handle with the free hand.',
 'Hold the original label-forward bottle-and-tote hero. Remain still for the final three seconds.'
 ],
 '07':[
 'The visible right hand lowers the aligned black cap the final 2 cm until it seats fully on the silver atomizer. The left hand supports the bottle. One gentle physical closure; no levitation.',
 'Keep the cap fully seated. The supporting hand holds the bottle while the free hand rests naturally on the red vanity.',
 'The poised fingers lift the black cap vertically by 2 cm, revealing its black underside and the silver atomizer. Keep the cap gripped and aligned above the nozzle.',
 'Lower the gripped black cap straight down until fully seated. Complete the closure within the shot, then hold. No magnetic-field animation or floating cap.',
 'Lower the already gripped cap through the final 2 cm once, seat it, and hold the closed bottle. Leave a quiet beat for the soft closure sound.',
 'Keep the cap fully seated and rotate the supported bottle only a few degrees until MOJITO METALLIQUE is square to camera. The fingers relax away from the cap.',
 'Hold the fully closed bottle on the red vanity. No movement during the final three seconds.'
 ],
 '08':[
 'With both product pairs visible, make one tiny alignment adjustment to Amber by steadying its body; never lift it by the cap.',
 'Gently lower the held peach canister onto the shelf behind Amber. Withdraw the hand without covering either product name.',
 'Hold the Mojito bottle and yellow canister pair. Make a very slow 2 cm lateral slide while preserving both names and the complete bottle.',
 'Hold the Amber bottle and peach canister pair. Make a very slow 2 cm lateral slide while preserving both names and the complete bottle.',
 'The arranging hand has already left the supplied frame. Hold both complete product pairs in their finished shelf arrangement, with only a slow 2 cm push.',
 'Make a short smooth 3 cm sideways camera move across both product pairs. Stop well before either bottle is cropped.',
 'Hold the complete two-pair arrangement. Remain motionless for the final three seconds.'
 ],
 '09':[
 'Keep both complete bottles separated above the yellow bench, label-forward. Both adults make a small natural hand settle.',
 'The woman smooths the red pouch edge with her free hand while the man keeps his bottle steady. Keep the burgundy strap clear of both labels.',
 'Hold the woman’s Amber Oud Silk bottle at constant size. A tiny natural hand settle, then stillness. Stay on Amber for this entire generation.',
 'Both adults gently angle their supported bottles toward the center by only a few degrees, without touching. Settle into a steady hold for the final three seconds.',
 'The free hand gently closes the slightly open orange notebook. Keep both fragrances in view, separated and label-forward, then hold.',
 'Hold the paired bottles above the warm yellow bench. Make only a tiny natural hand settle; keep both names sharp.',
 'Hold both bottles label-forward and still for the final three seconds.'
 ],
 '10':[
 'From the supplied position with hands already beside the products, each adult settles their hand naturally. Both bottles remain upright and separate.',
 'Keep both products steady while the hands relax beside their own bottles. Do not cover either label.',
 'Hold the Mojito bottle with its warm yellow fabric and red pouch context. Move the camera 3 cm closer, preserving the full bottle.',
 'Keep Mojito standing steady beside the woman’s hand with yellow fabric and red pouch behind. No new movement or props.',
 'Hold Oud Mirage steady beside the burgundy journal in the man’s vignette. Keep the black label readable and blue liquid unchanged.',
 'Hold both vignettes together with hands resting naturally at their respective edges.',
 'Hold both products in the original composition, with no movement for the final three seconds.'
 ]
};
const personalityOpening={
 '11':'The free fingertips set the single burgundy domino down on the checker cloth, then relax. The other hand keeps the full bottle upright beside it.',
 '12':'The free hand straightens the orange scarf knot once while the bottle hand brings the upright perfume forward by 2 cm. Keep the red blazer and woven clutch unchanged.',
 '13':'The free fingertip presses one coral cassette-player button once, then relaxes. The other hand settles the complete label-forward bottle.',
 '14':'The free hand rests naturally on the cropped red guitar body. Hold the upright bottle steady without playing a chord or hiding its name.',
 '15':'The free fingers ease the notebook elastic into place, then pause. Keep the blue perfume bottle steady beside the closed notebook.',
 '16':'The free fingertips press one existing crease of the cream paper fan, then relax. Hold the complete bottle above the ochre tray. The yellow crane remains still.'
};
for(let i=11;i<=16;i++)motions[String(i)]=[
 personalityOpening[String(i)],
 'Hold the complete bottle steady. The free hand makes one tiny natural adjustment to the existing nearby prop, then rests; do not add or move props across the label.',
 'Push the camera in only 3 cm, then stop on the exact product name. Keep the entire black cap and glass base inside the frame and fingers below the lettering.',
 'Hold the wider hero arrangement as supplied, with the full bottle intact. Keep the quiet top area clear of all moving objects.',
 'Hold the hero arrangement. The final three seconds are entirely still, with no upward camera movement.'
];
function flowPrompt(s,x,motion){
 let productLock=label[s.id];
 if(s.id==='08'&&x.key==='mojito')productLock='MOJITO METALLIQUE golden bottle and matching yellow canister, both with white labels';
 if(s.id==='08'&&x.key==='amber')productLock='AMBER OUD SILK pale-peach bottle and matching peach canister, both with white labels';
 if(s.id==='09'&&x.number===3)productLock=motion.includes('the man’s')?'CHARME ENVOÛTANT; black label; orange-amber liquid; man’s hand only':'AMBER OUD SILK; white label; pale-peach liquid; woman’s hand only';
 if(s.id==='10'&&x.key==='mojito')productLock=label['01'];
 if(s.id==='10'&&x.key==='oud')productLock=label['05'];
 return 'Animate this supplied start frame as one continuous photorealistic portrait 9:16 perfume-commercial shot. Match the first frame exactly: same Filipino adult hands, clothing, jewelry, set, props, warm saturated sunlight and natural skin texture. '+motion+
 '\nCamera: '+(x.number===s.shots.length?'Locked composition; final three seconds fully still.':'Restrained smooth movement only; preserve the supplied viewing angle and full product. Do not zoom out or tilt upward.')+
 '\nProduct lock: '+productLock+'. Preserve the label lettering, PARFUM LONDON signature, small 50 ml cylindrical proportions, thick clear base and fitted black cylindrical cap. '+(s.id==='07'?'The cap moves only when a visible hand grips it; its underside stays black.':'Keep the cap seated throughout.')+
 '\nNo faces or partial faces, necks, chins, people in reflections, new actors, extra fingers, new props, duplicate bottles, label changes, product morphing or liquid-color changes. No cuts within this generated clip. No added captions, promotional lettering, graphic overlays or watermark.'+
 '\nAudio: subtle scene-appropriate room/outdoor ambience and gentle prop foley only; no generated speech or music. Voiceover and exact brand-font text will be added separately in the edit.';
}
function completePrompt(s,x,base,line=x.voiceover,seconds=Math.min(x.editSeconds,x.generateSeconds)){
 return base.split('\nAudio:')[0]+'\n\nVOICE IDENTITY\n'+voice.masterPrompt+
 '\nVOICE TONE FOR THIS SCENT / STORY\n'+s.voiceDirection+
 '\nAUDIO DIRECTION\nGenerate the following off-screen narration in this clip. Begin promptly and complete the spoken line naturally within the first '+seconds+' seconds, then leave quiet ambience for the remaining generation. Keep room tone and prop foley low under the voice; no music or other voices. No visible speaker or lip sync. Use the same selected voice preset/reference as the other clips when the selected Flow model supports it. Exact-font text is added later in the editor; do not generate subtitles.'+
 '\nEXACT VOICEOVER — speak only these words, once:\n“'+line+'”';
}
const assetsURL=pathToFileURL(path.join(root,'assets')+path.sep).href;
function overlayHTML(s,x){
 const parts=x.onScreen.split(/\s*\/\s*/);
 const long=parts[0].length>43, sentence=/^[A-Z][a-z]/.test(parts[0])||parts[0].length>68;
 const mainSize=long?62:80;
 const partsHTML=parts.map((p,i)=>'<div class="'+(i===0?(sentence?'sentence':'headline'):'support')+'" style="'+(i===0?'font-size:'+mainSize+'px':'')+'">'+esc(p)+'</div>').join('');
 const dark=['02','04','07','12','14','16'].includes(s.id);
 return '<!doctype html><html><head><meta charset="utf-8"><style>'+
 '@font-face{font-family:Cenzo;src:url("'+assetsURL+'CenzoFlare-Bold.woff2")}@font-face{font-family:HelveticaNow;src:url("'+assetsURL+'HelveticaNowDisplay-Light.woff2")}'+
 '*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;background:transparent}'+
 '.copy{position:absolute;left:74px;right:74px;top:138px;padding:26px 32px 30px;background:'+(dark?'#fff2d4':'#9d1c12')+';color:'+(dark?'#9d1c12':'#fff2d4')+';box-shadow:12px 12px 0 #efab20}'+
 '.headline{font-family:Cenzo;line-height:1.02;letter-spacing:.2px}.sentence{font-family:HelveticaNow;line-height:1.1}.support{font:46px/1.12 HelveticaNow;margin-top:13px}'+
 '.brand{position:absolute;bottom:258px;left:74px;background:#fff2d4;padding:14px 22px;display:flex;align-items:center;gap:20px}.brand img{width:196px;height:60px;object-fit:contain}.brand span{font:26px HelveticaNow;color:#662716;border-left:1px solid #ae785c;padding-left:18px}'+
 '</style></head><body><div class="copy">'+partsHTML+'</div><div class="brand"><img src="'+assetsURL+'sj-logo-official-dark.png"><span>A SCENT JOURNEY</span></div></body></html>';
}
const stamp=sec=>'00:'+String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')+',000';
function wrap(s,n=46){let lines=[],line='';for(const w of s.split(/\s+/)){if((line+' '+w).trim().length>n){lines.push(line);line=w;}else line+=(line?' ':'')+w;}if(line)lines.push(line);return lines.join('\n');}
for(const s of scripts){
 s.voiceIdentity=voice.masterPrompt;s.voiceDirection=voice.scriptDirections[s.id];
 for(const x of s.shots){
  const [a,b]=x.time.split(/[–—-]/).map(Number);x.startSeconds=a;x.endSeconds=b;x.editSeconds=b-a;
  x.generateSeconds=x.editSeconds<=4?4:x.editSeconds<=6?6:8;
  x.editNote=x.editSeconds>8?'Generate 8 seconds and hold the last steady frame for 1 second in the editor. Alternatively use a model offering 10 seconds and trim to 9.':'Generate '+x.generateSeconds+' seconds, then trim to '+x.editSeconds+' seconds in the edit.';
  x.overlay='overlays/'+String(x.number).padStart(2,'0')+'-copy.png';
  x.motionPrompt=flowPrompt(s,x,motions[s.id][x.number-1]);
  x.voiceTone=s.voiceDirection;
  x.completePrompt=completePrompt(s,x,x.motionPrompt);
 }
 if(s.id==='09'){
  const x=s.shots[2];x.generateSeconds=4;x.editNote='Two separate 4-second generations. Trim Amber to 2.5 seconds and Charme to 2.5 seconds; hard-cut at 09.5 seconds. Keep the voiceover continuous across both inserts.';
  x.extraFrame='frames/03b-charme-insert.png';
  x.extraPrompt=flowPrompt(s,x,'Hold the man’s Charme Envoûtant bottle at the same apparent size as the separate Amber insert. A tiny hand settle, then stillness. Stay on Charme for this entire generation. Do not introduce Amber or morph products.');
  x.completePrompt=completePrompt(s,x,x.motionPrompt,'Dear Body. London-formulated scents.',2.5);
  x.extraCompletePrompt=completePrompt(s,x,x.extraPrompt,'Pinili para sa Filipino lifestyle.',2.5);
  x.editNote+=' For voice-enabled generation, the two complete prompts split the narration between the inserts. Use a single continuous recorded take instead if their voices do not match.';
 }
 s.fullVoiceover=s.shots.map(x=>x.voiceover).join('\n\n');
}
write('script-manifest.json',JSON.stringify(scripts,null,2));
const quickstart='# Dear Body — Google Flow frame pack\n\n'+
 '16 scripts · 100 timed shots · 58 unique AI-generated keyframes · 101 numbered start-frame files (including one extra Charme insert) · portrait 1080 × 1920.\n\n'+
 'NEW: [44-second brand introduction](brand-introduction-script.html), with eight scenes, Taglish narration, complete Flow prompts and reused clean frame inputs. Brand first, then scent personality, magnetic cap, collection/display, offer and Order Now.\n\n'+
 'The 10 campaign scripts retain ORDER NOW. The 6 personality scripts use FIND YOUR SCENT. Repeated hero frames are deliberate continuity choices; they are not 100 unique photographic setups.\n\n'+
 '## Question-first script revision\n\nThe 16 main scripts now open with a buyer question, then give a relevant scent or product answer, specific details, the offer and CTA. The 44-second brand introduction keeps a brief Dear Body introduction before the choice question. Free shipping still requires 2+ items; COD follows that condition in the closing offer.\n\n'+
 '## Start here\n\n'+
 '1. Open storyboard.html and choose a script. Copy its full voiceover for one consistent narration take, or use the complete prompt on each shot to request generated speech. Each complete prompt includes scene direction, narrator identity, scent-specific tone and exact spoken words.\n'+
 '2. In Flow, open a project and select Video → Frames in the prompt box. Upload the numbered image under frames/ as the start frame, select portrait 9:16, and paste that shot’s complete prompt. Select a model supporting generated audio. The motion-only prompt remains available for a separately recorded voiceover. End frames are optional; this pack uses start frames only. [Google Flow instructions](https://support.google.com/flow/answer/16353334?hl=en).\n'+
 '3. Generate each shot separately. The supplied plan uses 4, 6 or 8 seconds, then trims to the script timing. Feature and duration choices depend on the selected model. Mission/vision shot 4 needs 9 seconds: use 8 seconds plus a 1-second final-frame hold in your editor, or a model offering 10 seconds and trim. [Supported models and durations](https://support.google.com/flow/answer/16352836?hl=en).\n'+
 '4. Assemble in numbered order using hard cuts. Flow’s Scenebuilder can arrange and trim clips. [Scene editing instructions](https://support.google.com/flow/answer/16935718?hl=en).\n'+
 '5. In your finishing editor, place the matching transparent overlays/NN-copy.png above each clip at full 1080 × 1920 size. Use either the generated narration or a separate recording from voiceover-script.txt, never both. voiceover-timing.srt is a timing guide, not recorded audio. Recheck spoken words and timing, and preview the final copy in each Meta placement before launch.\n\n'+
 'A description alone cannot guarantee an identical generated voice in separate clips. Where supported, reuse one voice preset/custom voice. A single full-script narration take gives the most consistent result. If a line sounds rushed, use the motion-only prompt and add the timed narration separately.\n\n'+
 '## Special edits\n\n'+
 '- Script 09, shot 3: generate 03-start.png (Amber) and 03b-charme-insert.png separately. Use 2.5 seconds of each, with a hard cut at 09.5 seconds. Never ask Flow to transform Amber into Charme.\n'+
 '- Script 03, shot 6: cut while the label is still above the pouch; any final lace-tightening is outside this short packing insert. Script 08, shot 5 starts immediately after the arranging hand has withdrawn. These are practical starting-state adaptations of the original actions.\n'+
 '- Copy overlays are finishing assets. Upload only clean frames to Flow so the video model does not animate or distort the brand lettering. Preview overlays in the storyboard to see placement.\n'+
 '- Clean frames are AI-generated photographic starting images, not finished videos. Review each generated video for hands, bottle shape, label spelling, liquid color and complete absence of faces before exporting. A prompt cannot guarantee these stay unchanged through every generated frame.\n\n'+
 '## Files\n\n'+
 '- Each numbered script folder: frames/ upload PNGs, overlays/ transparent copy PNGs, script.txt with complete and motion-only prompts, voiceover-script.txt, voiceover-timing.srt, on-screen-copy.srt, shot-data.json.\n'+
 '- ads-strategy-review.html and .md: the first-launch plan, creative audit and shorter test scripts.\n'+
 '- flow-shot-index.csv and flow-shot-index.json: searchable shot inventory, not an automatic Flow project importer.\n'+
 '- contact-sheets/: one board per script. overview.jpg: all 16 hero frames.\n'+
 '- Generation prompts are saved in master-generation-prompts.json and variant-generation-prompts.json. Still images were produced using the built-in image-generation tool; exact-font overlays use supplied Cenzo Flare Bold, Helvetica Now Display Light and the official logo.\n\n'+
 'All scenes follow the two owner reference boards: playful warm bold color, realistic Filipino adult hands/torso-only crops. Women’s line: white labels (Mojito, Amber, Mistened). Men’s line: black labels (Charme, Oud, Rtulle). Offers always specify free shipping on 2+ items and cash on delivery.\n';
write('START-HERE.md',quickstart+'\n## Voice identity\n\nRead VOICE-IDENTITY.md for the narrator’s age, tone, accent, personality and per-script direction. Copy voice-identity-prompt.txt into your chosen voice workflow. The recommended consistent narrator is a Filipina woman around 28, warm, clear, confident and lightly playful.\n');
const rows=[];
for(const s of scripts){
 let text='SCRIPT '+s.id+' — '+s.scent+'\n'+s.title+'\n'+s.type.toUpperCase()+' · CTA: '+s.cta+'\n\nVOICE IDENTITY\n'+s.voiceIdentity+'\n\nVOICE DIRECTION FOR THIS SCRIPT\n'+s.voiceDirection+'\n\nSCENE\n'+s.scene+'\n\n';
 let vo=[],copy=[];
 for(const x of s.shots){
  text+='SHOT '+String(x.number).padStart(2,'0')+' | '+x.time+' | '+x.editSeconds+' seconds in edit\nSTART FRAME: '+x.frame+'\nCOPY OVERLAY: '+x.overlay+'\nDURATION PLAN: '+x.editNote+'\n\nCOMPLETE FLOW PROMPT — SCENE + VOICE TONE + EXACT VOICEOVER\n'+x.completePrompt+'\n\nMOTION-ONLY ALTERNATIVE — RECORD NARRATION SEPARATELY\n'+x.motionPrompt+'\n\nVOICEOVER\n'+x.voiceover+'\n\nON-SCREEN COPY (add overlay in editor)\n'+x.onScreen.replace(/\s*\/\s*/g,'\n')+'\n\nORIGINAL SCRIPT ACTION\n'+x.action+'\n';
  if(x.extraFrame)text+='\nSECOND INSERT START FRAME: '+x.extraFrame+'\nSECOND INSERT COMPLETE FLOW PROMPT\n'+x.extraCompletePrompt+'\nSECOND INSERT MOTION-ONLY ALTERNATIVE\n'+x.extraPrompt+'\n';
  text+='\n'+'—'.repeat(48)+'\n\n';
  vo.push(x.number+'\n'+stamp(x.startSeconds)+' --> '+stamp(x.endSeconds)+'\n'+wrap(x.voiceover)+'\n');
  rows.push({script_id:s.id,script_type:s.type,scent:s.scent,title:s.title,shot:x.number,time:x.time,edit_seconds:x.editSeconds,generation_seconds:x.generateSeconds,start_frame:s.folder+'/'+x.frame,overlay:s.folder+'/'+x.overlay,extra_frame:x.extraFrame?s.folder+'/'+x.extraFrame:'',voiceover:x.voiceover,voice_tone:x.voiceTone,complete_prompt:x.completePrompt,extra_complete_prompt:x.extraCompletePrompt||'',on_screen:x.onScreen,motion_prompt:x.motionPrompt,extra_prompt:x.extraPrompt||'',edit_note:x.editNote});
 }
 write(s.folder+'/script.txt',text);
 write(s.folder+'/voiceover-script.txt','SCRIPT '+s.id+' — '+s.scent+'\n\nVOICE IDENTITY\n'+s.voiceIdentity+'\n\nTONE\n'+s.voiceDirection+'\n\nEXACT FULL VOICEOVER\n'+s.fullVoiceover+'\n');
 write(s.folder+'/voiceover-timing.srt',vo.join('\n'));
 write(s.folder+'/on-screen-copy.srt',s.shots.map(x=>x.number+'\n'+stamp(x.startSeconds)+' --> '+stamp(x.endSeconds)+'\n'+x.onScreen.replace(/\s*\/\s*/g,'\n')+'\n').join('\n'));
 write(s.folder+'/shot-data.json',JSON.stringify(s,null,2));
}
write('flow-shot-index.json',JSON.stringify(rows,null,2));
const cols=Object.keys(rows[0]),csv=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
write('flow-shot-index.csv','\uFEFF'+cols.map(csv).join(',')+'\r\n'+rows.map(r=>cols.map(c=>csv(r[c])).join(',')).join('\r\n'));
function promptBox(title,prompt,button,open=false){
 return '<details'+(open?' open':'')+'><summary>'+esc(title)+'</summary><textarea readonly>'+esc(prompt)+'</textarea><button class="copy">'+esc(button)+'</button></details>';
}
function shotCard(s,x){
 return '<article class="shot"><div class="visual"><img loading="lazy" src="'+s.folder+'/'+x.frame+'" alt="'+esc(s.scent)+' shot '+x.number+'"><img class="overlay" loading="lazy" src="'+s.folder+'/'+x.overlay+'" alt=""></div><div class="shotbody"><div class="meta">SHOT '+String(x.number).padStart(2,'0')+' · '+x.time+' · '+x.editSeconds+'s</div><h3>'+esc(x.onScreen.replace(/\s*\/\s*/g,' · '))+'</h3><p>'+esc(x.editNote)+'</p><p><b>Voice tone</b><br>'+esc(x.voiceTone)+'</p><p class="vo"><b>Exact voiceover</b><br>'+esc(x.voiceover)+'</p><p><a download href="'+s.folder+'/'+x.frame+'">Start PNG</a> · <a download href="'+s.folder+'/'+x.overlay+'">Copy overlay</a></p>'+
 promptBox('Complete Flow prompt · scene + voice + script',x.completePrompt,'Copy complete Flow prompt',true)+
 (x.extraFrame?'<div class="insert"><img loading="lazy" src="'+s.folder+'/'+x.extraFrame+'" alt="Charme separate insert"><div><b>03b · Separate Charme insert</b><p>Hard-cut after 2.5s of Amber. Each complete prompt speaks its own half of the line.</p><a download href="'+s.folder+'/'+x.extraFrame+'">Download insert</a>'+promptBox('Charme complete prompt',x.extraCompletePrompt,'Copy Charme complete prompt')+promptBox('Charme motion-only alternative',x.extraPrompt,'Copy motion-only prompt')+'</div></div>':'')+
 promptBox('Motion-only alternative · separate narration',x.motionPrompt,'Copy motion-only prompt')+'<details><summary>Original scene direction</summary><p>'+esc(x.action)+'</p><p>'+esc(x.camera)+'</p></details></div></article>';
}
const guideBody='<div class="intro"><p class="note"><b>Updated: question → scent answer → reason to buy.</b> <a href="brand-introduction-script.html">Open the 44-second Taglish brand-introduction script</a> — eight scenes with voice tone, exact narration, Flow prompts and existing start frames. Magnetic cap, collect/display, scent personality, free shipping on 2+ items, COD and Order Now are included.</p><p><b>Advertising structure:</b> each of the 16 scripts now starts with a relevant buyer question, introduces a specific scent or product answer, explains the scent/personality and physical details, then ends with the offer and CTA. The separate brand introduction keeps Dear Body first and asks the question immediately afterward. <a href="ads-strategy-review.html">Read the strategy and hook-testing plan</a>.</p><p><b>Each shot now has one complete Taglish prompt:</b> scene direction, voice identity, scent-specific tone and exact spoken words. Use it with a Flow model supporting audio, or choose the motion-only alternative and record one full narration take.</p><ol><li>In Flow: Video → Frames → add the clean start frame → portrait 9:16.</li><li>Copy the complete prompt and generate each shot separately. Keep product transitions as hard cuts.</li><li>Trim to the shown timing, check the spoken line, and add the supplied brand-font overlays in your finishing editor.</li></ol><p class="note">Use the same voice preset/reference wherever your selected model supports it. A text description alone cannot guarantee an identical voice across clips; one full-script recording is the most consistent option. Never layer generated narration and a separate recording together.</p><p><a href="ads-strategy-review.html">First-launch ads strategy & shorter scripts</a> · <a href="VOICE-IDENTITY.html">Voice identity</a> · <a href="START-HERE.md">Full instructions</a> · <a href="flow-shot-index.csv">Shot index CSV</a> · <a href="flow-shot-index.json">JSON</a></p><p><b>Ordering language:</b> Order Now is the website button wording confirmed by the owner. Use ORDER NOW in purchase creative and spoken calls to action. Complete the COD form to place the order; selecting two items alone does not place it. Personality creatives retain FIND YOUR SCENT; match the spoken invitation to the native ad button available at launch.</p><p class="small">Images, prompts and scripts are supplied; finished video and recorded audio are not included. Preview brand-font overlays in the actual Meta placement before export because interface elements can cover them. Official Flow guidance: <a href="https://support.google.com/flow/answer/16353334?hl=en">create videos</a>, <a href="https://support.google.com/flow/answer/16352836?hl=en">model and voice features</a>, <a href="https://support.google.com/flow/answer/16935718?hl=en">scene editing</a>.</p></div>';
const html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dear Body · All 16 Flow storyboards</title><style>'+
 '@font-face{font-family:Cenzo;src:url("assets/CenzoFlare-Bold.woff2")}@font-face{font-family:HelveticaNow;src:url("assets/HelveticaNowDisplay-Light.woff2")}'+
 '*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#fff3de;color:#451a13;font:17px/1.48 HelveticaNow,Arial,sans-serif}a{color:#9d2015;text-underline-offset:3px}header{background:#ad2415;color:#fff3de;padding:48px max(24px,calc((100vw - 1440px)/2))}header h1{font:clamp(44px,5vw,76px)/1.02 Cenzo;margin:14px 0}header p{max-width:900px}main{max-width:1488px;margin:auto;padding:24px}.intro{max-width:1040px}.small{font-size:14px}.toolbar{position:sticky;top:0;z-index:5;display:flex;gap:22px;align-items:center;background:#ffd974;border:1px solid #d79729;padding:15px;margin:28px 0;flex-wrap:wrap}select{max-width:100%;font:inherit;padding:8px;background:#fff8e8;border:1px solid #a45430}section{scroll-margin-top:90px;margin:46px 0 72px}h2{font:38px/1.08 Cenzo;margin:0 0 12px}h3{font:25px/1.07 Cenzo;margin:10px 0 14px}.sectioninfo{max-width:1080px}.shots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;margin-top:24px}.shot{background:#fffaf0;border:1px solid #d7b797;display:grid;grid-template-columns:180px minmax(0,1fr);align-items:start}.visual{position:relative;width:180px;aspect-ratio:9/16;background:#e7c39a}.visual>img{width:100%;height:100%;object-fit:contain;display:block}.visual .overlay{position:absolute;inset:0;display:none}.show-copy .visual .overlay{display:block}.shotbody{padding:18px;min-width:0}.meta{font-size:13px;letter-spacing:.06em;color:#955527}.shotbody p{font-size:15px}.vo{border-left:3px solid #e59d1b;padding-left:12px}.fullvoice textarea{width:100%;height:240px;padding:14px;font:16px/1.6 Arial;border:1px solid #c4a37f;background:#fffdf6}.shotbody textarea{width:100%;height:220px;resize:vertical;font:13px/1.4 Arial;padding:10px;border:1px solid #c4a37f;background:#fffdf6}.copy{margin-top:6px;background:#a82015;border:0;color:#fff4dc;padding:9px 14px;cursor:pointer;font:15px HelveticaNow}summary{cursor:pointer;font-size:15px;margin:13px 0 8px}.insert{display:flex;gap:12px;padding-top:14px;border-top:1px solid #dbc0a5}.insert>img{width:76px;height:135px;object-fit:cover}.insert>div{min-width:0}.insert p{margin:5px 0}.downloads{display:flex;gap:18px;flex-wrap:wrap}.note{padding:14px;background:#ffe7a6;border-left:4px solid #ba371d}footer{padding:30px;background:#4b1b16;color:#fff3dc}@media(max-width:1050px){.shots{grid-template-columns:1fr}}@media(max-width:570px){main{padding:14px}.shot{grid-template-columns:125px minmax(0,1fr)}.visual{width:125px}.shotbody{padding:12px}h3{font-size:21px}.toolbar{position:static}header{padding:30px 20px}}'+
 '</style></head><body><header><div>DEAR BODY PH · FLOW PRODUCTION PACK</div><h1>16 stories.<br>Ready to move.</h1><p>100 timed shots · 101 start-frame files · 58 unique keyframes · 1080 × 1920 portrait</p></header><main>'+guideBody+
 '<div class="toolbar"><label>Jump to script <select id="scriptSelect"><option value="">Choose a script</option>'+scripts.map(s=>'<option value="'+s.folder+'">'+s.id+' · '+esc(s.scent)+' · '+esc(s.type)+'</option>').join('')+'</select></label><label><input type="checkbox" id="showCopy"> Preview brand-font copy</label><a href="overview.jpg">16-scene overview</a></div>'+
 scripts.map(s=>'<section id="'+s.folder+'"><div class="meta">SCRIPT '+s.id+' · '+s.type.toUpperCase()+' · '+s.shots[s.shots.length-1].endSeconds+' SECONDS</div><h2>'+esc(s.scent)+'<br>'+esc(s.title)+'</h2><p class="sectioninfo">'+esc(s.scene)+'</p><p><b>Buyer question:</b> '+esc(s.adStrategy?.buyerQuestion||'')+'</p><p><b>Why consider this scent:</b> '+esc(s.adStrategy?.reasonToConsider||'')+'</p><p><b>CTA:</b> '+esc(s.cta)+'</p><p><b>Voice direction:</b> '+esc(s.voiceDirection)+'</p><div class="downloads"><a href="'+s.folder+'/script.txt">Script + all Flow prompts</a><a href="'+s.folder+'/voiceover-timing.srt">Voiceover timing SRT</a><a href="'+s.folder+'/on-screen-copy.srt">On-screen copy SRT</a><a href="contact-sheets/'+s.folder+'.jpg">Shot contact sheet</a></div>'+
 (s.id==='09'?'<p class="note">Shot 3 has two separate image inputs. Generate Amber and Charme separately, trim each to 2.5s, and hard-cut between them. Shot 4 needs a 1s freeze hold after an 8s generation, or a longer supported generation trimmed to 9s.</p>':'')+
 '<div class="fullvoice">'+promptBox('Full voiceover script · copy one continuous take',s.fullVoiceover,'Copy full voiceover script')+'<p><a href="'+s.folder+'/voiceover-script.txt">Download full voiceover + tone</a></p></div><div class="shots">'+s.shots.map(x=>shotCard(s,x)).join('')+'</div></section>').join('')+
 '</main><footer>Built-in image generation · Supplied Cenzo Flare Bold + Helvetica Now fonts · Warm, playful, face-free Dear Body visual direction</footer><script>document.getElementById("scriptSelect").onchange=function(){if(this.value)document.getElementById(this.value).scrollIntoView()};document.getElementById("showCopy").onchange=function(){document.body.classList.toggle("show-copy",this.checked)};document.querySelectorAll("button.copy").forEach(b=>b.onclick=async()=>{const t=b.previousElementSibling;t.select();try{await navigator.clipboard.writeText(t.value);b.textContent="Copied"}catch(e){document.execCommand("copy");b.textContent="Copied / select text if needed"}});</script></body></html>';
write('storyboard.html',html);
async function renderOverlays(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--force-color-profile=srgb']});
 const page=await browser.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
 let checks=[];
 for(const s of scripts)for(const x of s.shots){
  if(process.argv.includes('--cta-overlays')&&!x.onScreen.includes('ORDER NOW'))continue;
  write('working/overlay-current.html',overlayHTML(s,x));
  await page.goto(pathToFileURL(path.join(root,'working/overlay-current.html')).href);await page.evaluate(async()=>{await Promise.all([document.fonts.load('80px Cenzo'),document.fonts.load('46px HelveticaNow')]);await document.fonts.ready;});
  const check=await page.evaluate(()=>({cenzo:document.fonts.check('80px Cenzo'),helvetica:document.fonts.check('46px HelveticaNow'),bottom:document.querySelector('.copy').getBoundingClientRect().bottom,horizontal:document.documentElement.scrollWidth}));
  if(!check.cenzo||!check.helvetica||check.bottom>600||check.horizontal>1080)throw Error('Overlay layout '+s.id+'/'+x.number+' '+JSON.stringify(check));
  await page.screenshot({path:path.join(root,s.folder,x.overlay),omitBackground:true});
  checks.push({script:s.id,shot:x.number,...check});
 }
 await browser.close();write(process.argv.includes('--cta-overlays')?'working/cta-overlay-checks.json':'working/overlay-checks.json',JSON.stringify(checks,null,2));
 console.log('Rendered '+checks.length+' transparent brand-font overlays.');
}
async function assets(){
 fs.mkdirSync(path.join(root,'contact-sheets'),{recursive:true});
 const jobs=[...JSON.parse(fs.readFileSync(path.join(root,'master-generation-prompts.json'))),...JSON.parse(fs.readFileSync(path.join(root,'variant-generation-prompts.json')))];
 const keyMeta=[];
 for(const j of jobs){
  const f=path.join(root,j.folder,j.file);const m=await sharp(f).metadata();
  if(Math.abs(m.width/m.height-9/16)>.025)throw Error('Nonportrait '+f);
  const b=await sharp(f).resize(1080,1920,{fit:'cover',position:'centre'}).png().toBuffer();fs.writeFileSync(f,b);
  keyMeta.push({script:j.id,key:j.key,file:j.folder+'/'+j.file,originalWidth:m.width,originalHeight:m.height,width:1080,height:1920});
 }
 let count=0;
 for(const s of scripts){
  for(const x of s.shots){fs.copyFileSync(path.join(root,s.folder,'keyframes',x.key+'.png'),path.join(root,s.folder,x.frame));count++;}
  if(s.id==='09'){fs.copyFileSync(path.join(root,s.folder,'keyframes/charme.png'),path.join(root,s.folder,'frames/03b-charme-insert.png'));count++;}
 }
 const font='Arial';
 async function board(items,file,cols=4){
  const w=240,h=427,cellh=480,gap=18,rows=Math.ceil(items.length/cols),width=cols*w+(cols+1)*gap,height=rows*cellh+(rows+1)*gap;
  const layers=[];
  for(let i=0;i<items.length;i++){
   const x=gap+(i%cols)*(w+gap),y=gap+Math.floor(i/cols)*(cellh+gap);
   layers.push({input:await sharp(items[i].file).resize(w,h).toBuffer(),left:x,top:y});
   const text='<svg width="'+w+'" height="50"><rect width="100%" height="100%" fill="#fff1d8"/><text x="8" y="21" font-family="'+font+'" font-size="13" font-weight="bold" fill="#631f15">'+esc(items[i].label)+'</text><text x="8" y="40" font-family="'+font+'" font-size="12" fill="#631f15">'+esc(items[i].sub||'')+'</text></svg>';
   layers.push({input:Buffer.from(text),left:x,top:y+h});
  }
  await sharp({create:{width,height,channels:3,background:'#efbc63'}}).composite(layers).jpeg({quality:87}).toFile(file);
 }
 for(const s of scripts){
  const items=s.shots.map(x=>({file:path.join(root,s.folder,x.frame),label:'SHOT '+String(x.number).padStart(2,'0')+'  |  '+x.time,sub:x.key}));
  if(s.id==='09')items.splice(3,0,{file:path.join(root,s.folder,'frames/03b-charme-insert.png'),label:'SHOT 03b | 09.5–12',sub:'Charme hard-cut insert'});
  await board(items,path.join(root,'contact-sheets',s.folder+'.jpg'),s.shots.length>5?4:3);
 }
 await board(scripts.map(s=>({file:path.join(root,s.folder,'keyframes',s.masterKey+'.png'),label:s.id+' '+s.scent,sub:s.type})),path.join(root,'overview.jpg'),4);
 write('working/image-checks.json',JSON.stringify({uniqueKeyframes:keyMeta.length,numberedFrames:count,keyMeta},null,2));
 console.log('Normalized '+keyMeta.length+' keyframes; mapped '+count+' numbered upload frames; wrote 17 contact sheets.');
}
(async()=>{if(process.argv.includes('--overlays'))await renderOverlays();if(process.argv.includes('--assets'))await assets();require('./build-brand-introduction.cjs');console.log('Wrote all 16 scripts, 100 motion prompts, timing files and storyboard, plus the new brand-introduction edit.');})().catch(e=>{console.error(e);process.exit(1)});
