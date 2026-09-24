from pathlib import Path
import html
import json
import zipfile
import hashlib

root = Path(__file__).resolve().parent
theme = root / 'dearbody'
files = sorted(p for p in theme.rglob('*') if p.is_file() and not p.name.startswith('.'))
image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.ico', '.avif'}
sources = [{'name': p.relative_to(theme).as_posix(), 'code': p.read_text()} for p in files if p.suffix.lower() not in image_extensions]
assets = [{'name': p.relative_to(theme).as_posix(), 'bytes': p.stat().st_size} for p in files if p.suffix.lower() in image_extensions]
payload = json.dumps(sources, ensure_ascii=False).replace('<', '\\u003c')
options = ''.join('<option value="'+str(i)+'">'+html.escape(item['name'])+'</option>' for i,item in enumerate(sources))
image_rows = ''.join('<li><a href="dearbody/'+html.escape(item['name'])+'" download>'+html.escape(item['name'])+'</a><span>'+str(round(item['bytes']/1024))+' KB</span></li>' for item in assets)
viewer = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DearBody Liquid Glass — Copy & paste Shopify code</title><style>
*{box-sizing:border-box}body{margin:0;background:radial-gradient(ellipse at 92% 8%,#e9a25040,transparent 48%),linear-gradient(135deg,#f4e3cb,#f4e3cb);color:#5c0006;font:16px/1.6 "Helvetica Neue",Arial,sans-serif}header{background:#f4e3cbcc;backdrop-filter:blur(22px);border-bottom:1px solid #f4e3cbcc;color:#5c0006;padding:40px max(24px,calc((100vw - 1200px)/2))}h1{font-size:clamp(34px,5vw,64px);letter-spacing:-.055em;line-height:1;margin:0 0 18px}header p{max-width:740px;margin-bottom:0}main{max-width:1248px;margin:auto;padding:30px 24px}a{color:inherit;text-underline-offset:4px}h2{font-size:27px;letter-spacing:-.035em;line-height:1.1}button,select,textarea{font:inherit;color:inherit}button{background:#5c0006;color:#f4e3cb;padding:13px 23px;border:1px solid #5c0006;border-radius:999px;box-shadow:0 6px 18px #5c000615;cursor:pointer}button:hover{background:#9a1106}select{background:#f4e3cb70;border:1px solid #5c000630;border-radius:14px;padding:13px 12px;min-width:0;flex:1}label{display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;margin-bottom:9px}.toolbar{display:flex;gap:12px}.hint{font-size:13px}.code{width:100%;height:60vh;min-height:340px;background:#f4e3cb85;border:1px solid #f4e3cbc0;border-radius:18px;box-shadow:0 16px 48px #5c00060b;resize:vertical;padding:18px;font:12px/1.6 Menlo,Consolas,monospace;tab-size:2;white-space:pre;overflow:auto}section{margin-bottom:40px}.intro{display:grid;grid-template-columns:1.1fr 1fr;gap:40px;padding-block:8px 28px}.intro p{font-size:14px}.intro img{width:100%;max-height:440px;object-fit:contain;align-self:center;border-radius:24px}ol{padding-left:20px;font-size:14px}li{padding:5px 0}.assets{display:grid;grid-template-columns:repeat(2,1fr);gap:0 25px;list-style:none;padding:0;font-size:13px}.assets li{display:flex;justify-content:space-between;gap:14px;border-bottom:1px solid #5c000633}.status{min-height:26px;font-size:13px}footer{border-top:1px solid #5c000633;padding:20px 0;font-size:12px}:focus-visible{outline:3px solid #d46601;outline-offset:3px}@media(max-width:650px){.intro{grid-template-columns:1fr;gap:14px}.toolbar{flex-wrap:wrap}.toolbar select{flex-basis:100%}.assets{grid-template-columns:1fr}header{padding-block:30px}}
</style></head><body><header><h1>DEAR BODY.<br>LIQUID GLASS.</h1><p>Your Liquid Glass storefront in the DearBody brand palette, one file at a time. Choose a file, copy its code, and paste into the same filename in Shopify's theme code editor.</p></header><main><section class="intro"><div><h2>The quickest installation</h2><p><a href="DearBody-Liquid-Glass-Shopify-Theme.zip" download>Download the complete Shopify theme ZIP</a> and upload it through Online Store → Themes → Import theme → Upload zip file. The lifestyle homepage, alternating For Her/For Him editorial rows, both logo variants and all images are included. This is a separate alternative; your Memphis theme stays intact.</p><p><a href="DearBody-Liquid-Glass-Website-Source.zip" download>Download the complete editable source</a>, including the local preview and validation scripts.</p><h2>Prefer to copy the code?</h2><ol><li>Duplicate your existing draft and open <strong>Edit code</strong>.</li><li>Create or replace every text file listed below at its exact folder and filename, including assets/db-logo-secondary.svg.</li><li>Upload every image asset listed below, including the logo PNG and existing generated lifestyle photographs. Images must be uploaded as files.</li><li>Confirm the preselected For Her, For Him and six priority-product connections in Theme settings and Scent Finder.</li></ol><p><a href="START-HERE.md">Read the setup and product-mapping guide</a>. The full website spans several files; a single Custom Liquid block cannot install it.</p></div><img src="dearbody/assets/db-home-spray-v1.jpg" alt="Charme Envoûtant being sprayed in warm sunlight, with visible perfume mist"></section><section><label for="file">Choose a theme source file</label><div class="toolbar"><select id="file">''' + options + '''</select><button id="copy" type="button">Copy code</button><button id="download" type="button">Save file</button></div><p id="status" class="status" role="status"></p><textarea id="code" class="code" readonly spellcheck="false" aria-label="Selected theme source code"></textarea><p class="hint">Paste into the exact filename shown in the dropdown. “Select all” inside the code box also works if clipboard access is blocked by your browser.</p></section><section><h2>Upload these image assets</h2><ul class="assets">''' + image_rows + '''</ul></section><footer>DearBody Liquid Glass · Publication palette · Six priority fragrances · Responsive layouts · Native Shopify commerce and forms</footer></main><script type="application/json" id="sources">''' + payload + '''</script><script>
const sources=JSON.parse(document.querySelector('#sources').textContent),select=document.querySelector('#file'),code=document.querySelector('#code'),status=document.querySelector('#status');
function show(){code.value=sources[Number(select.value)].code;status.textContent=sources[Number(select.value)].name+' · '+code.value.split('\\n').length+' lines';code.scrollTop=0}select.addEventListener('change',show);select.value=String(sources.findIndex(x=>x.name==='templates/index.json'));show();
document.querySelector('#copy').addEventListener('click',async()=>{let copied=false;try{await navigator.clipboard.writeText(code.value);copied=true}catch{code.focus();code.select();try{copied=document.execCommand('copy')}catch{}}status.textContent=copied?'Copied '+sources[Number(select.value)].name+' — paste into this file in Shopify.':'Code selected. Press Command+C (Mac) or Ctrl+C (Windows).'});
document.querySelector('#download').addEventListener('click',()=>{const item=sources[Number(select.value)],blob=new Blob([item.code],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=item.name.split('/').pop();a.click();URL.revokeObjectURL(url)});
</script></body></html>'''
(root/'COPY-PASTE-CODE.html').write_text(viewer)
with zipfile.ZipFile(root/'DearBody-Liquid-Glass-Shopify-Theme.zip','w',zipfile.ZIP_DEFLATED) as package:
    for f in files:
        package.write(f, f.relative_to(theme).as_posix())
manifest = {p.relative_to(theme).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
(root/'THEME-SHA256.json').write_text(json.dumps(manifest,indent=2)+'\n')
public = root/'preview/public'
public.mkdir(parents=True,exist_ok=True)
# The browser preview serves the same standalone source viewer through a local route.
web_viewer=viewer.replace('href="dearbody/assets/', 'href="/assets/').replace('src="dearbody/assets/', 'src="/assets/').replace('href="DearBody-Liquid-Glass-Shopify-Theme.zip"','href="/DearBody-Liquid-Glass-Shopify-Theme.zip"').replace('href="START-HERE.md"','href="/START-HERE.md"').replace('href="DearBody-Liquid-Glass-Website-Source.zip"','href="/DearBody-Liquid-Glass-Website-Source.zip"')
(public/'copy-code').mkdir(exist_ok=True)
(public/'copy-code/index.html').write_text(web_viewer)
(public/'DearBody-Liquid-Glass-Shopify-Theme.zip').write_bytes((root/'DearBody-Liquid-Glass-Shopify-Theme.zip').read_bytes())
(public/'START-HERE.md').write_text((root/'START-HERE.md').read_text())
print(f'Packaged {len(files)} theme files ({len(sources)} text files, {len(assets)} images).')
print(f'ZIP: {(root/"DearBody-Liquid-Glass-Shopify-Theme.zip").stat().st_size:,} bytes')
support_files = [
    'START-HERE.md', 'ASSET_QA.md', 'VALIDATION.md', 'SCENT-QUIZ.md', 'LOGO-SOURCE.md', 'IMAGE-PROMPTS.json', 'HOMEPAGE-PROMPTS.json', 'HOMEPAGE-ASSET-QA.json',
    'COPY-PASTE-CODE.html', 'THEME-SHA256.json', 'DearBody-Liquid-Glass-Shopify-Theme.zip',
    'package-theme.py', 'preview/package.json', 'preview/package-lock.json',
    'preview/render-preview.mjs', 'preview/verify-commerce.mjs', 'preview/verify-quiz.mjs',
]
with zipfile.ZipFile(root/'DearBody-Liquid-Glass-Website-Source.zip', 'w', zipfile.ZIP_DEFLATED) as package:
    for f in files:
        package.write(f, f.relative_to(root).as_posix())
    for name in support_files:
        package.write(root/name, name)
print(f'Full source ZIP: {(root/"DearBody-Liquid-Glass-Website-Source.zip").stat().st_size:,} bytes')

# The source archive contains only portable source/support files, never node_modules.
(public/'DearBody-Liquid-Glass-Website-Source.zip').write_bytes((root/'DearBody-Liquid-Glass-Website-Source.zip').read_bytes())
