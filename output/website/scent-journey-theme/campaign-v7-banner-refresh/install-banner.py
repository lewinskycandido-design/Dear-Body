"""Install only the approved Mistened refresh; retain every other artwork byte."""
from pathlib import Path
import hashlib,json,shutil,struct,subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
FOLDER=Path(__file__).resolve().parent
source=Path(sys.argv[1])
name='sj-product-banner-mistened-narcissus'
original=FOLDER/'originals'/f'{name}.png'
web=FOLDER/'final-web'/f'{name}.jpg'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
assert source.read_bytes()[:8]==b'\x89PNG\r\n\x1a\n'
width,height=struct.unpack('>II',source.read_bytes()[16:24])
assert (width,height)==(1774,887), 'Update native dimensions intentionally if the source size changes.'
manifest_path=ROOT/'qa/product-banner-assets.json'
manifest=json.loads(manifest_path.read_text())
for row in manifest:
 assert sha(ROOT/'theme/assets'/row['file'])==row['sha256']
before=[dict(row) for row in manifest]
(FOLDER/'provenance'/'previous-product-banner-manifest.json').write_text(json.dumps(before,indent=2)+'\n')
shutil.copyfile(source,original)
subprocess.run(['sips','-s','format','jpeg','-s','formatOptions','91',str(original),'--out',str(web)],check=True)
subprocess.run(['sips','--embedProfileIfNone','/System/Library/ColorSync/Profiles/sRGB Profile.icc',str(web)],check=True)
record={'handle':'mistened-narcissus','file':web.name,'source':str(web.relative_to(ROOT)),'sha256':sha(web),'bytes':web.stat().st_size,'width':width,'height':height,'original':str(original.relative_to(ROOT)),'original_sha256':sha(original)}
for index,row in enumerate(manifest):
 if row['handle']=='mistened-narcissus':manifest[index]=record
shutil.copyfile(web,ROOT/'theme/assets'/web.name)
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
for row in before:
 if row['handle']!='mistened-narcissus':
  assert sha(ROOT/'theme/assets'/row['file'])==row['sha256']
  assert sha(ROOT/row['source'])==row['sha256']
(FOLDER/'asset-lock.sha256').write_text(f'{sha(original)}  originals/{original.name}\n{sha(web)}  final-web/{web.name}\n')
print(json.dumps(record,indent=2))
