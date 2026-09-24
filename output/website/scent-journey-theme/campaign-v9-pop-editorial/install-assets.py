"""Install the approved 22-banner refresh atomically after all candidates exist."""
from pathlib import Path
import hashlib,json,shutil,struct
ROOT=Path(__file__).resolve().parents[1]
FOLDER=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
previous_campaigns=json.loads((FOLDER/'provenance/previous-campaign-assets.json').read_text())
previous_products=json.loads((FOLDER/'provenance/previous-product-banner-assets.json').read_text())
expected={r['file'] for r in previous_campaigns+previous_products}
assert len(expected)==22
reviews={r['asset']:r for r in json.loads((FOLDER/'provenance/root-visual-review.json').read_text())}
records={}
for file in sorted(expected):
    web=FOLDER/'final-web'/file
    original=FOLDER/'originals'/(Path(file).stem+'.png')
    assert web.exists() and original.exists(), f'Missing approved asset: {file}'
    review=reviews.get(original.name,{})
    assert review.get('nativeVisualReview')=='PASS' and review.get('sha256')==sha(original), f'Asset needs final visual approval: {file}'
    data=original.read_bytes()
    assert data[:8]==b'\x89PNG\r\n\x1a\n', original
    width,height=struct.unpack('>II',data[16:24])
    previous=next(r for r in previous_campaigns+previous_products if r['file']==file)
    assert sha(web)!=previous['sha256'], f'Asset was not regenerated: {file}'
    records[file]={'file':file,'source':str(web.relative_to(ROOT)),'sha256':sha(web),'bytes':web.stat().st_size,'width':width,'height':height,'original':str(original.relative_to(ROOT)),'original_sha256':sha(original)}
for row in records.values():
    shutil.copyfile(ROOT/row['source'],ROOT/'theme/assets'/row['file'])
campaigns=[records[row['file']] for row in previous_campaigns]
products=[{'handle':row['handle'],**records[row['file']]} for row in previous_products]
(ROOT/'qa/campaign-assets.json').write_text(json.dumps(campaigns,indent=2)+'\n')
(ROOT/'qa/product-banner-assets.json').write_text(json.dumps(products,indent=2)+'\n')
(FOLDER/'asset-lock.sha256').write_text(''.join(f"{row['sha256']}  final-web/{row['file']}\n{row['original_sha256']}  originals/{Path(row['file']).stem}.png\n" for row in records.values()))
(FOLDER/'provenance/installed-assets.json').write_text(json.dumps(list(records.values()),indent=2)+'\n')
print(json.dumps({'installed':len(records),'unique_images':len({r['sha256'] for r in records.values()}),'bytes':sum(r['bytes'] for r in records.values())},indent=2))
