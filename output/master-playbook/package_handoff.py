from pathlib import Path
import json, zipfile, shutil, hashlib
from lxml import etree

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
FINAL=HERE/'deliverables'
FINAL.mkdir(exist_ok=True)
pages=json.loads((HERE/'qa/pages.json').read_text(encoding='utf-8'))

def markdown(p):
    rows=['## '+p['title'],'']
    for b in p['blocks']:
        if b['kind']=='p': rows.extend([('### ' if b.get('style')=='Heading 2' else '')+b['text'],''])
        elif b['kind']=='table':
            rows.append('| '+' | '.join(b['headers'])+' |')
            rows.append('| '+' | '.join(['---']*len(b['headers']))+' |')
            rows.extend('| '+' | '.join(map(str,r))+' |' for r in b['rows'])
            rows.append('')
    return '\n'.join(rows)

brief='# Dear Body AI and collaborator handoff\n\nVersion 1.0 | 25 September 2026\n\n'
brief+='\n\n'.join(markdown(pages[n-1]) for n in [35,36,3,7,8,10,11,12,13,14,15,16,18,20,21,22,25,27,28,29,30,31,32,38])
readme='''# Dear Body companion kit

Use AI-HANDOFF.md for a portable text briefing. It includes current brand rules, six scent profiles, creative direction, website decisions and production guidance. Historical budgets and costs are omitted.

For image work, attach both files in references/ and the relevant product evidence. The six product-front files are existing gallery packshots; inspect the original owner photographs for additional packaging angles, ingredients or tiny label details. The owner moodboards guide color, texture and composition; faces in them do not override the current face-free campaign rule.

fonts/ contains the three owner-supplied TTF files used in the playbook. Install these fonts before editing the PowerPoint on another computer to keep its appearance consistent. The Word file also contains embedded fonts. Font distribution and use remain subject to the original font licenses.

The PowerPoint is the visual briefing and contains detailed speaker notes. The Word document is the full master, including a clearly marked internal historical-planning section. Use this companion kit for general AI briefing.

Prices, delivery windows and Shopify settings are dated project records. Confirm current store data before publishing a new commercial offer.
'''
fontroot=ROOT/'output/website/scent-journey-theme/source-assets/fonts'
refroot=ROOT/'handoff/assets/brand-references'
kit=FINAL/'Dear-Body-AI-and-Font-Kit.zip'
with zipfile.ZipFile(kit,'w',zipfile.ZIP_DEFLATED) as z:
    z.writestr('README.md',readme)
    z.writestr('AI-HANDOFF.md',brief)
    z.write(ROOT/'BRAND_GUIDE.md','BRAND_GUIDE.md')
    z.write(ROOT/'AGENTS.md','AGENTS.md')
    z.write(ROOT/'brand.tokens.json','brand.tokens.json')
    z.write(ROOT/'output/product-listing/SCENT_DESCRIPTION_SOURCE_LEDGER.md','APPROVED-SCENT-DESCRIPTIONS.md')
    for p in fontroot.rglob('*.ttf'):z.write(p,'fonts/'+p.name)
    for name in ['2026-09-25-publication-materials-owner-reference.png','2026-09-25-social-media-look-owner-reference.png']:
        z.write(refroot/name,'references/'+name)
    gallery=ROOT/'output/website/upload-ready/shopify-gallery-order-2026-09-24'
    for slug in ['mojito-metallique','amber-oud-silk','mistened-narcissus','charme-envoutant','oud-mirage','rtulle-and-satin']:
        p=next((gallery/slug).glob('01-*.png'))
        z.write(p,'product-fronts/'+p.name)

doc=FINAL/'Dear-Body-Master-Playbook.docx'
shutil.copyfile(HERE/doc.name,doc)
ppt=FINAL/'Dear-Body-Master-Playbook-v1.pptx'
receipt=json.loads((HERE/'qa/deck/validation-v1.json').read_text())
assert hashlib.sha256(ppt.read_bytes()).hexdigest()==receipt['finalSha256']
for p in [doc,ppt,kit]:
    with zipfile.ZipFile(p) as z: assert z.testzip() is None
with zipfile.ZipFile(doc) as z:
    ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    body=etree.fromstring(z.read('word/document.xml'))
    assert len(z.read('word/document.xml'))>10000
    assert len([n for n in z.namelist() if n.endswith('.odttf')])==3
    text=' '.join(body.xpath('//w:t/text()',namespaces=ns))
    assert 'returns-related FAQ content' in text
    assert 'has no Returns page or FAQ section' not in text
print(json.dumps({'files':[{'name':p.name,'bytes':p.stat().st_size} for p in [doc,ppt,kit]],'zip_integrity':'pass','ppt_hash_matches_validation':True,'docx_fonts_embedded':3}))
