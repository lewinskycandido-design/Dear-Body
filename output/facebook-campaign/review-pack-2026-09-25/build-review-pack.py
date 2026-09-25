from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from html import escape
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
import json, hashlib, re

project = Path(r"C:\Users\lhemy\OneDrive\Documents\Dear Body")
root = Path(__file__).parent
stage = root / "Dear-Body-Ad-Creatives-START-HERE"
stage.mkdir(parents=True, exist_ok=True)
sources = [
    ("campaign", project / "output/facebook-campaign/bold-faceless-2026-09-25-v02", "Dear-Body-Facebook-Campaign-12-Assets-and-Scripts.zip"),
    ("personality", project / "output/facebook-campaign/personality-discovery-2026-09-25-v01", "Dear-Body-6-Personality-Discovery-Ads.zip"),
]
for prefix, source, archive_name in sources:
    with ZipFile(source / archive_name) as archive:
        for entry in archive.infolist():
            if entry.is_dir():
                continue
            relative = Path(entry.filename.replace("\\", "/"))
            if relative.is_absolute() or ".." in relative.parts:
                raise ValueError("Unsafe archive path")
            destination = stage / prefix / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            current = source / relative
            destination.write_bytes(current.read_bytes() if current.is_file() else archive.read(entry))
latest_cover = project / "output/facebook-page-kit/six-scent-lifestyle-cover-2026-09-25-v03/final/dear-body-facebook-cover-six-scents-designed-1640x720.png"
cover_relative = "page-assets/LATEST-Facebook-Cover-1640x720.png"
(stage / "page-assets").mkdir(exist_ok=True)
(stage / cover_relative).write_bytes(latest_cover.read_bytes())
for old, new in [
    ("campaign/campaign-preview.png", "02 - CAMPAIGN OVERVIEW.png"),
    ("personality/six-personality-ads-preview.png", "03 - PERSONALITY OVERVIEW.png"),
]:
    (stage / new).write_bytes((stage / old).read_bytes())
readme = """DEAR BODY — PLANNED AD CREATIVES
START HERE

HOW TO VIEW THE HTML PREVIEW

1. DOWNLOAD this ZIP to your computer.
2. EXTRACT THE WHOLE ZIP.
   Windows: right-click the ZIP > Extract All > Extract.
   Mac: double-click the ZIP to create the extracted folder.
3. Open the EXTRACTED folder.
4. Double-click: 01 - OPEN ADS PREVIEW.html
   It opens like a normal web page in your browser.
   If it opens as text, right-click > Open with > Google Chrome or Microsoft Edge.

IMPORTANT: Open the HTML after extracting all files.
Do not open it directly inside the ZIP or move it away from its folders.
The folders contain the images and fonts the preview needs.
No installation, login, or internet connection is needed.

WHAT YOU WILL SEE

- 10 main campaign ads, with scene and script links
- 6 personality-discovery ads, with captions and scripts
- Latest redesigned six-scent Facebook cover
- Facebook profile picture
- Links to full-size PNG images for download

QUICK IMAGE-ONLY PREVIEW

Open 02 - CAMPAIGN OVERVIEW.png or 03 - PERSONALITY OVERVIEW.png.
These can be viewed in a normal photo viewer.
The full-resolution images remain in campaign/final and personality/final.
The latest cover is in page-assets.

For the clearest HTML review, use a laptop or desktop.
These are planned creatives; opening this pack does not publish any ads.
"""
(stage / "00 - READ ME FIRST.txt").write_text(readme, encoding="utf-8")
names = [
 ("mojito-metallique", "Mojito Metallique"),
 ("amber-oud-silk", "Amber Oud Silk"),
 ("mistened-narcissus", "Mistened Narcissus"),
 ("charme-envoutant", "Charme Envoûtant"),
 ("oud-mirage", "Oud Mirage"),
 ("rtulle-and-satin", "Rtulle & Satin"),
]
features = [
 ("magnetic-cap", "Magnetic cap"),
 ("collection", "Collection & display"),
 ("mission-vision", "Mission & vision"),
 ("scent-personality", "Scent personality"),
]
def card(image, title, detail, script):
    return f'''<article class="card"><a class="image-link" href="{image}" aria-label="Open full-size {escape(title)} creative"><img src="{image}" alt="{escape(title)} ad creative" width="1080" height="1350"></a><div class="caption"><h3>{escape(title)}</h3><p>{detail}</p><div class="links"><a href="{image}">Open full-size PNG</a><a href="{script}">View script</a></div></div></article>'''
campaign_cards = []
for i, (slug, title) in enumerate(names + features, 1):
    detail = ("Women's line" if i <= 3 else "Men's line") if i <= 6 else "Brand & product story"
    campaign_cards.append(card(f"campaign/final/ads/{i:02}-{slug}-1080x1350.png", title, detail,
        f"campaign/content-creation-guide.html#{slug}"))
personality_cards = [
    card(f"personality/final/{i:02}-{slug}-personality-1080x1350.png", title,
         "Personality discovery · Find Your Scent", f"personality/gallery.html#{slug}")
    for i, (slug, title) in enumerate(names, 1)
]
css = """@font-face{font-family:Cenzo;src:url('campaign/assets/CenzoFlare-Bold.woff2');font-weight:700}
@font-face{font-family:HelveticaNow;src:url('campaign/assets/HelveticaNowDisplay-Light.woff2');font-weight:300}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f4e3cb;color:#5c0006;font:300 18px/1.5 HelveticaNow,Arial,sans-serif}a{color:inherit;text-underline-offset:4px}a:focus-visible{outline:3px solid #d46601;outline-offset:5px}header{background:#5c0006;color:#f4e3cb;padding:38px max(24px,calc((100vw - 1180px)/2)) 34px}header img{width:230px;height:auto}h1,h2,h3,.nav a,.count{font-family:Cenzo;line-height:1.08}h1{font-size:clamp(38px,5.2vw,66px);margin:20px 0 12px}header p{max-width:820px;margin:0 0 20px}.nav{display:flex;gap:10px;flex-wrap:wrap}.nav a{display:block;padding:12px 17px;background:#f4e3cb;color:#5c0006;text-decoration:none;font-size:19px}.nav a:hover{background:#e9a250}main{max-width:1230px;margin:auto;padding:28px 25px 70px}.help{padding:20px 24px;background:#fff8ed;border:2px solid #d46601}.help strong{font-family:Cenzo;font-size:23px}.help p{margin:7px 0 0}.help code{font:700 .96em Arial,sans-serif;overflow-wrap:anywhere}section{margin-top:48px;scroll-margin-top:22px}.section-head{display:flex;align-items:center;justify-content:space-between;gap:15px;border-bottom:2px solid #d46601;padding-bottom:15px;margin-bottom:24px}h2{font-size:clamp(29px,4vw,40px);margin:0}.count{background:#5c0006;color:#f4e3cb;padding:9px 14px;font-size:22px;white-space:nowrap}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:25px}.card{min-width:0;background:#fff8ed;border:1px solid #e1c6a4;overflow:hidden}.image-link{display:block;background:#e9a250}.card img{display:block;width:100%;height:auto}.caption{padding:20px}h3{font-size:25px;margin:0 0 10px}.caption p{font-size:16px;margin:0 0 17px}.links{display:flex;flex-wrap:wrap;gap:10px 18px;font-size:16px}.links a:first-child{font-weight:bold}.cover-card{background:#fff8ed;padding:18px}.cover-card img{width:100%;height:auto;display:block}.cover-card h3{margin:20px 0 10px}.profile-row{display:flex;gap:28px;align-items:center;padding:24px;margin-top:22px;background:#fff8ed}.profile-row img{width:180px;height:180px;object-fit:contain}.script-links{display:flex;flex-wrap:wrap;gap:14px}.script-links a{padding:16px 21px;background:#5c0006;color:#f4e3cb}.note{font-size:16px;margin:22px 0}.back{display:inline-block;margin-top:25px}footer{margin-top:55px;padding-top:20px;border-top:1px solid #d46601;font-size:15px}img{max-width:100%}@media(max-width:880px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.grid{grid-template-columns:1fr}main{padding:22px 16px 45px}.profile-row{align-items:flex-start;flex-direction:column}.help{padding:18px}.nav a{font-size:17px}.section-head{align-items:flex-start}.caption{padding:18px}.count{font-size:18px}}"""
html = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>START HERE — Dear Body Ad Creative Preview</title><style>{css}</style></head>
<body id="top"><header><img src="campaign/assets/sj-logo-official-white.png" alt="Dear Body"><h1>YOUR AD CREATIVE PREVIEW</h1><p>Browse all 16 planned ads, the latest Facebook cover and profile picture. Click an image to see its full-size PNG, or open its script below.</p><nav class="nav" aria-label="Preview sections"><a href="#campaign">10 campaign ads</a><a href="#personality">6 personality ads</a><a href="#page-images">Cover & profile</a><a href="#scripts">Scenes & scripts</a></nav></header>
<main><aside class="help"><strong>How to open this preview</strong><p><b>Extract All</b> from the ZIP first, then double-click <code>01 - OPEN ADS PREVIEW.html</code> in the extracted folder. Choose <b>Chrome</b> or <b>Edge</b> if prompted. Keep the accompanying folders together.</p><p><a href="00 - READ ME FIRST.txt">Read the simple opening instructions</a> · <a href="02 - CAMPAIGN OVERVIEW.png">Campaign overview image</a> · <a href="03 - PERSONALITY OVERVIEW.png">Personality overview image</a></p></aside>
<section id="campaign"><div class="section-head"><h2>Main campaign</h2><span class="count">10 ADS</span></div><div class="grid">{"".join(campaign_cards)}</div><a class="back" href="#top">Back to top ↑</a></section>
<section id="personality"><div class="section-head"><h2>Find Your Scent</h2><span class="count">6 ADS</span></div><div class="grid">{"".join(personality_cards)}</div><a class="back" href="#top">Back to top ↑</a></section>
<section id="page-images"><div class="section-head"><h2>Facebook page images</h2><span class="count">LATEST COVER</span></div><article class="cover-card"><a href="{cover_relative}"><img src="{cover_relative}" alt="Latest redesigned six-scent lifestyle cover with A Scent Journey slogan" width="1640" height="720"></a><h3>A Scent Journey — redesigned cover</h3><p>Six priority scents with layered paper and playful graphic details. 1640 × 720.</p><a href="{cover_relative}" download>Download latest cover PNG</a></article><article class="profile-row"><a href="campaign/final/page/dear-body-facebook-profile-1080.png"><img src="campaign/final/page/dear-body-facebook-profile-1080.png" alt="Dear Body Facebook profile picture" width="1080" height="1080"></a><div><h3>Facebook profile picture</h3><p>1080 × 1080 PNG.</p><a href="campaign/final/page/dear-body-facebook-profile-1080.png" download>Download profile PNG</a></div></article><details class="note"><summary>Earlier promotional cover</summary><p>The earlier cover is retained for reference.</p><a href="campaign/final/page/dear-body-facebook-cover-1640x720.png">Open earlier promotional cover</a></details></section>
<section id="scripts"><div class="section-head"><h2>Scenes, captions & scripts</h2></div><div class="script-links"><a href="campaign/content-creation-guide.html">Open 10 campaign video scripts</a><a href="personality/gallery.html#mojito-metallique">Open 6 personality video scripts</a></div><p class="note">These are production plans and still creatives. Video scripts describe scenes to film or generate.</p></section>
<footer>Dear Body · Creative review pack · 25 September 2026<br>Works offline after extraction. This preview does not publish any ads.</footer></main></body></html>'''
preview = stage / "01 - OPEN ADS PREVIEW.html"
preview.write_text(html, encoding="utf-8")

class References(HTMLParser):
    def __init__(self):
        super().__init__(); self.refs=[]; self.ids=set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.ids.add(attrs.get("id"))
        for attr in ("src","href"):
            if attrs.get(attr): self.refs.append(attrs[attr])
def check_ref(source, ref):
    parsed=urlsplit(ref)
    if parsed.scheme or parsed.netloc:
        return
    destination=(source.parent / unquote(parsed.path)).resolve() if parsed.path else source
    if not destination.is_file():
        raise RuntimeError(f"Missing local target: {source.relative_to(stage)} -> {ref}")
    if parsed.fragment and destination.suffix==".html":
        parser=References();parser.feed(destination.read_text(encoding="utf-8"))
        if unquote(parsed.fragment) not in parser.ids:
            raise RuntimeError(f"Missing anchor: {ref}")
checked=0
for source in stage.rglob("*.html"):
    parser=References();parser.feed(source.read_text(encoding="utf-8"))
    for ref in parser.refs:
        check_ref(source,ref);checked+=1
for source in list(stage.rglob("*.css")) + [preview]:
    text=source.read_text(encoding="utf-8")
    for ref in re.findall(r"url\(['\"]?([^'\"\)]+)",text):
        check_ref(source,ref);checked+=1

zip_path=root / "Dear-Body-Planned-Ads-OPEN-PREVIEW.zip"
files=sorted(p for p in stage.rglob("*") if p.is_file())
with ZipFile(zip_path, "w", ZIP_DEFLATED, compresslevel=6) as archive:
    for file in files:
        archive.write(file,file.relative_to(stage).as_posix())
with ZipFile(zip_path) as archive:
    assert archive.testzip() is None
    assert archive.namelist()[0] == "00 - READ ME FIRST.txt"
    assert archive.namelist()[1] == "01 - OPEN ADS PREVIEW.html"
    for file in files:
        assert hashlib.sha256(archive.read(file.relative_to(stage).as_posix())).digest() == hashlib.sha256(file.read_bytes()).digest()
report={"zip":str(zip_path),"preview":str(preview),"entries":len(files),"local_references_checked":checked,
"campaign_ads":len(campaign_cards),"personality_ads":len(personality_cards),"latest_cover":True,"archive_integrity":"pass","file_hashes":"pass","zip_bytes":zip_path.stat().st_size}
(root/"verification.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
print(json.dumps(report))

