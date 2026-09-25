const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const {marked}=require('C:/Users/lhemy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked');
let md=fs.readFileSync(path.join(root,'ads-strategy-review.md'),'utf8');
const replacements=[
 ['Keep natural Philippine English and effortless Tagalog where written.','Use natural conversational Taglish with fluid Tagalog-English phrasing; keep the wording below.'],
 ['Mojito Metallique. Friendly, easygoing, lighthearted.','Mojito Metallique. Para sa friendly, easygoing, at lighthearted.'],
 ['Soft, creamy sweetness with a light fruity glow.','Soft at creamy ang sweetness, may light fruity glow.'],
 ['Find your scent. Free shipping on two or more items. May COD din.','Find your scent. Free shipping sa two or more items. May COD din.'],
 ['Cash on delivery available.','May COD din.'],
 ['Mojito Metallique or Amber Oud Silk? Choose your pair.','Mojito Metallique o Amber Oud Silk? Pili ka ng pair mo.'],
 ['Tap Order Now. Select Add to order, choose two items, then Check out.','Pili ng two or more items para free shipping, tapos tap Order Now.'],
 ['Oud Mirage. Dark rose wrapped in smoky, woody depth.','Oud Mirage. Dark rose na balot sa smoky, woody depth.'],
 ['For someone independent, reflective, and self-assured.','Para sa independent, reflective, at self-assured na personality.'],
 ['Explore Oud Mirage. Tap Order Now.','Explore ang Oud Mirage. Tap Order Now.'],
 ['That little click? A magnetic cap.',"Yung satisfying click? Magnetic cap ’yan."],
 ['Mojito Metallique, down to the details.','Mojito Metallique. Nasa details din ang charm.'],
 ['Explore the collection. Tap Order Now.','Explore ang collection. Tap Order Now.'],
 ['Choose two or more items for free shipping, then tap Order Now.','Pili ng two or more items para free shipping, tapos tap Order Now.'],
 ['Four shorter scripts ready to produce','Four shorter Taglish scripts ready to produce']
];
for(const [a,b] of replacements)md=md.split(a).join(b);
fs.writeFileSync(path.join(root,'ads-strategy-review.md'),md);
const shots=[];
for(const section of md.split(/^### /m).slice(1,5)){
 const lines=section.split('\n'),rows=lines.filter(l=>/^\| \d+–\d+ \|/.test(l)).map(l=>l.split('|').slice(1,-1).map(v=>v.trim()));
 shots.push({title:lines[0],voiceover:rows.map(r=>r[2]).filter(x=>!x.startsWith('No speech.')).join('\n\n')});
}
const e=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
let body=marked.parse(md);
body=body.replace(/<table>/g,'<div class="table-wrap"><table>').replace(/<\/table>/g,'</table></div>');
const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dear Body · Ads strategy version 2</title><style>'+ 
 '@font-face{font-family:Cenzo;src:url("assets/CenzoFlare-Bold.woff2")}@font-face{font-family:H;src:url("assets/HelveticaNowDisplay-Light.woff2")}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#fff3df;color:#461911;font:18px/1.62 H,Arial,sans-serif}a{color:#9a1106;text-underline-offset:3px}header{background:#9a1106;color:#fff3df;padding:45px max(22px,calc((100vw - 1160px)/2))}header a{color:#fff3df}header h1{font:clamp(45px,6vw,76px)/1 Cenzo;margin:24px 0}header p{max-width:900px}.strip{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:950px}.strip figure{margin:0;background:#f4e3cb;color:#5c0006}.strip img{width:100%;height:225px;object-fit:cover;object-position:center 48%;display:block}.strip figcaption{padding:10px 14px;font:21px Cenzo}main{max-width:1160px;margin:auto;padding:35px 22px 65px}article>h1{font:42px/1.1 Cenzo}h2{font:36px/1.12 Cenzo;margin-top:58px;scroll-margin-top:20px}h3{font:28px/1.15 Cenzo;margin-top:35px}p{max-width:1020px}.table-wrap{width:100%;overflow:auto;margin:22px 0}table{border-collapse:collapse;width:100%;min-width:650px;background:#fffaf1;font-size:16px;line-height:1.5}th{background:#5c0006;color:#fff3df;text-align:left}td,th{padding:13px 15px;vertical-align:top;border:1px solid #d7b99a}blockquote{margin:24px 0;padding:8px 24px;background:#ffdc8d;border-left:5px solid #b13717}code{font-size:.85em;overflow-wrap:anywhere}li{margin:10px 0}nav{display:flex;gap:20px;flex-wrap:wrap}.copy-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}.copycard{padding:22px;background:#ffe2a1;border:1px solid #cd9c50}.copycard h3{margin-top:0}textarea{width:100%;height:240px;padding:14px;font:16px/1.5 Arial;background:#fffaf1;border:1px solid #b68450}button{background:#9a1106;color:#fff3df;font:17px H;border:0;padding:12px 18px;cursor:pointer;margin-top:8px}footer{background:#5c0006;color:#f4e3cb;padding:25px;text-align:center}@media(max-width:650px){body{font-size:17px}.strip{gap:8px}.strip img{height:135px}.strip figcaption{font-size:17px;padding:8px}.copy-grid{grid-template-columns:1fr}main{padding:24px 16px}h2{font-size:31px}}@media print{header{background:white;color:#461911}.copy-grid,nav,button{display:none}table{min-width:0}.table-wrap{overflow:visible}h2,h3{break-after:avoid}tr{break-inside:avoid}}</style></head><body><header><nav><a href="storyboard.html">← All 16 Flow storyboards</a><a href="ads-strategy-review.md">Download written strategy</a><a href="#taglish-copy">Copy revised voiceovers</a></nav><h1>HELP THEM CHOOSE.<br>MAKE THE SCENT CLEAR.</h1><p>Version 2: clear scent choices, personality fit and real product details. Four revised Taglish scripts, with a practical plan for measuring delivered COD orders.</p><div class="strip">'+[
 ['11-personality-mojito-metallique','01-start.png','01 · Help them choose'],['05-campaign-oud-mirage','01-start.png','02 · Explain the scent'],['07-campaign-magnetic-cap','01-start.png','03 · Show the product']
 ].map(([d,f,t])=>'<figure><img src="'+d+'/frames/'+f+'" alt="'+e(t)+'"><figcaption>'+e(t)+'</figcaption></figure>').join('')+'</div></header><main><article>'+body+'</article><section id="taglish-copy"><h2>Copy the revised Taglish voiceovers</h2><p>Read each with the narrator and direction above. The magnetic-cap version includes a two-second pause for the real click.</p><div class="copy-grid">'+shots.map(s=>'<div class="copycard"><h3>'+e(s.title)+'</h3><textarea readonly>'+e(s.voiceover)+'</textarea><button class="copy">Copy Taglish voiceover</button></div>').join('')+'</div></section></main><footer>Dear Body PH · Strategy version 2 · 25 September 2026</footer><script>document.querySelectorAll(".copy").forEach(b=>b.onclick=async()=>{const t=b.previousElementSibling;t.select();try{await navigator.clipboard.writeText(t.value);b.textContent="Copied"}catch(e){document.execCommand("copy");b.textContent="Copied / select text if needed"}})</script></body></html>';
fs.writeFileSync(path.join(root,'ads-strategy-review.html'),html);
fs.writeFileSync(path.join(root,'short-test-voiceovers.json'),JSON.stringify(shots,null,2));
console.log('Built strategy guide and '+shots.length+' copyable Taglish test scripts.');
