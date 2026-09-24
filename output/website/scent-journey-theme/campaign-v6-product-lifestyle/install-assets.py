"""Install the complete approved lifestyle set and record byte locks."""
from pathlib import Path
import hashlib,json,shutil,struct
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'campaign-v6-product-lifestyle'
products=json.loads((ROOT/'approved-product-copy.json').read_text())
records=[]
for product in products:
    handle=product['handle']
    name=f'sj-product-banner-{handle}'
    original=SOURCE/'originals'/f'{name}.png'
    web=SOURCE/'final-web'/f'{name}.jpg'
    assert original.exists() and web.exists(), f'Missing approved banner: {handle}'
    assert struct.unpack('>II',original.read_bytes()[16:24])==(1774,887), handle
    records.append({'handle':handle,'file':web.name,'source':str(web.relative_to(ROOT)),'sha256':hashlib.sha256(web.read_bytes()).hexdigest(),'bytes':web.stat().st_size,'width':1774,'height':887,'original':str(original.relative_to(ROOT)),'original_sha256':hashlib.sha256(original.read_bytes()).hexdigest()})
assert len(records)==6
for record in records:
    shutil.copyfile(ROOT/record['source'],ROOT/'theme/assets'/record['file'])
(ROOT/'qa/product-banner-assets.json').write_text(json.dumps(records,indent=2)+'\n')
(SOURCE/'asset-lock.sha256').write_text(''.join(f"{r['sha256']}  final-web/{r['file']}\n" for r in records))
print(f'Installed {len(records)} lifestyle banners; total {sum(r["bytes"] for r in records):,} bytes.')
