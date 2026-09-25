const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),out=path.resolve(root,'../..');
const scripts=JSON.parse(fs.readFileSync(path.join(root,'script-manifest.json')));
const campaign=path.join(out,'facebook-campaign/bold-faceless-2026-09-25-v02');
for(const name of ['all-content-concepts.json','content-concepts.json','homepage-content-concepts.json']){
 const f=path.join(campaign,name),a=JSON.parse(fs.readFileSync(f)),list=Array.isArray(a)?a:a.concepts;
 for(const c of list){
  const s=scripts.find(s=>s.id===c.id&&s.type==='campaign');
  if(s){c.adStrategy=s.adStrategy;c.shots.forEach((x,i)=>{x[3]=s.shots[i].voiceover;x[4]=s.shots[i].onScreen;});}
  if(c.test)c.test=c.test.replace('first shipping line','opening question');
 }
 fs.writeFileSync(f,JSON.stringify(a,null,2));
}
const a=JSON.parse(fs.readFileSync(path.join(campaign,'all-content-concepts.json')));
let md='# Dear Body — content creation guide\n\nUpdated with conversational Taglish narration. Complete shot prompts and voice direction are in [the Flow storyboard](../../flow-frame-pack/all-16-scripts-2026-09-25-v01/storyboard.html).\n\n';
md+=a.intro.map(([h,p])=>'## '+h+'\n\n'+p).join('\n\n')+'\n\n';
for(const c of a.concepts){
 md+='## '+c.id+' · '+c.scent+' — '+c.title+'\n\n';
 for(const k of ['objective','scene','casting','styling','props','lighting','camera','performance','sound'])md+='**'+k+':** '+c[k]+'\n\n';
 md+='### Shot-by-shot script\n\n| Time | Action | Camera | Taglish voiceover | On-screen copy |\n| --- | --- | --- | --- | --- |\n'+c.shots.map(x=>'| '+x.map(y=>String(y).replace(/\|/g,'/')).join(' | ')+' |').join('\n')+'\n\n';
 md+='### Full Taglish voiceover\n\n'+c.shots.map(x=>x[3]).join(' ')+'\n\n';
 for(const k of ['short','caption','still','continuity','test'])md+='**'+k+':** '+c[k]+'\n\n';
}
md+='## Production order\n\n'+a.production.map(x=>'- '+x).join('\n')+'\n\n## Sources\n\n'+a.sources.map(x=>'- '+x.join(': ')).join('\n')+'\n';
fs.writeFileSync(path.join(campaign,'content-creation-guide.md'),md);
const personality=path.join(out,'facebook-campaign/personality-discovery-2026-09-25-v01');
const pf=path.join(personality,'ad-copy-and-scripts.json'),p=JSON.parse(fs.readFileSync(pf));
let gallery=fs.readFileSync(path.join(personality,'gallery.html'),'utf8'),pm=fs.readFileSync(path.join(personality,'ad-copy-and-scripts.md'),'utf8');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
for(let i=0;i<p.length;i++){
 const s=scripts[i+10],c=p[i];
 c.reel.forEach((x,j)=>{x[3]=s.shots[j].voiceover;x[4]=s.shots[j].onScreen;});
 c.reel[3][2]='Keep the full bottle visible and the top text area clear during the product-detail line.';
 c.shortVO=[s.shots[0].voiceover,s.shots[1].voiceover,'Find your scent.'].join(' ');
 c.adStrategy=s.adStrategy;
 const sectionStart=gallery.indexOf('<section class="section" id="'+c.slug+'">'),sectionEnd=gallery.indexOf('</section>',sectionStart);
 if(sectionStart<0||sectionEnd<0)throw Error('Personality gallery section '+c.slug);
 let section=gallery.slice(sectionStart,sectionEnd);
 const begin=section.indexOf('<details><summary>27-second reel script'),end=section.indexOf('</details>',begin);
 if(begin<0||end<0)throw Error('Personality gallery reel '+c.slug);
 const reel='<details><summary>27-second reel script — question, scent answer, details and CTA</summary>'+c.reel.map(x=>'<div class="shot"><h4>'+x[0]+'</h4><p><strong>Action:</strong> '+esc(x[1])+'</p><p><strong>Camera:</strong> '+esc(x[2])+'</p><p><strong>Voiceover:</strong> '+esc(x[3])+'</p><p><strong>On screen:</strong> '+esc(x[4])+'</p></div>').join('')+'<h4>Full voiceover</h4><p>'+esc(c.reel.map(x=>x[3]).join(' '))+'</p></details>';
 section=section.slice(0,begin)+reel+section.slice(end+10);
 gallery=gallery.slice(0,sectionStart)+section+gallery.slice(sectionEnd);
 const mStart=pm.indexOf('## '+c.id+' — '+c.name),mEnd=pm.indexOf('\n## ',mStart+4);
 if(mStart<0)throw Error('Personality markdown section '+c.name);
 let block=pm.slice(mStart,mEnd<0?undefined:mEnd),rStart=block.indexOf('### 27-second reel script'),rEnd=block.indexOf('**Continuity:**',rStart);
 if(rStart<0||rEnd<0)throw Error('Personality markdown reel '+c.name);
 const table='### 27-second reel script\n\nQuestion → named scent and description → personality → product details → offer and FIND YOUR SCENT.\n\n| Time | Action | Camera | Voiceover | On-screen text |\n| --- | --- | --- | --- | --- |\n'+c.reel.map(x=>'| '+x.join(' | ')+' |').join('\n')+'\n\n**Full voiceover:** '+c.reel.map(x=>x[3]).join(' ')+'\n\n**Short hook voiceover:** '+c.shortVO+'\n\n';
 block=block.slice(0,rStart)+table+block.slice(rEnd);
 pm=pm.slice(0,mStart)+block+(mEnd<0?'':pm.slice(mEnd));
}
fs.writeFileSync(pf,JSON.stringify(p,null,2));
fs.writeFileSync(path.join(personality,'gallery.html'),gallery);
fs.writeFileSync(path.join(personality,'ad-copy-and-scripts.md'),pm);
console.log('Synchronized the earlier campaign and personality guides with the Taglish voiceovers.');
