"""Validate and package only the local Shopify theme. Never connects to Shopify."""
from pathlib import Path
import hashlib,json,re,zipfile
root=Path(__file__).resolve().parent
theme=root/'theme'
allowed={'assets','config','layout','locales','sections','snippets','templates'}
required=['layout/theme.liquid','config/settings_schema.json','config/settings_data.json','locales/en.default.json']+[f'templates/{n}.json' for n in ['index','product','collection','page','search','cart','404']]
for name in required: assert (theme/name).is_file(),f'Missing required {name}'
files=sorted(p for p in theme.rglob('*') if p.is_file())
for p in files:
 rel=p.relative_to(theme)
 assert rel.parts[0] in allowed, f'Unexpected path {rel}'
 assert not p.is_symlink() and not any(v.startswith('.') for v in rel.parts),f'Unsafe entry {rel}'
 if p.suffix=='.json':json.loads(p.read_text())
 if p.suffix=='.liquid':
  source=p.read_text()
  for raw in re.findall(r'{%-?\s*schema\s*-?%}(.*?){%-?\s*endschema\s*-?%}',source,re.S):
   schema=json.loads(raw);assert len(schema['name'])<=25,f'Long schema name {rel}'
  for name in re.findall(r"(?:render|include)\s+['\"]([^'\"]+)['\"]",source):assert (theme/'snippets'/f'{name}.liquid').is_file(),f'Missing snippet {name}'
  for name in re.findall(r"['\"]([^'\"]+)['\"]\s*\|\s*asset_url",source):assert (theme/'assets'/name).is_file(),f'Missing asset {name}'
for p in list((theme/'templates').glob('*.json'))+list((theme/'sections').glob('*.json')):
 d=json.loads(p.read_text())
 assert set(d.get('order',[]))==set(d.get('sections',{})),f'Section order mismatch {p.name}'
 for section in d.get('sections',{}).values():assert (theme/'sections'/f"{section['type']}.liquid").exists(),f'Missing section {section}'
index=json.loads((theme/'templates/index.json').read_text());launch=index['sections']['launch'];assert len(launch['blocks'])==6
assert all(not b['settings'].get('product') for b in launch['blocks'].values()),'Resource defaults must be empty'
archive=root/'dearbody-philippines-shopify-theme.zip'
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in files:z.write(p,p.relative_to(theme).as_posix())
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None,'Corrupt ZIP'
 assert {n.split('/')[0] for n in z.namelist()}==allowed,'Invalid ZIP root'
 assert 'layout/theme.liquid' in z.namelist()
manifest={'archive':archive.name,'bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'file_count':len(files),'files':{p.relative_to(theme).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in files}}
(root/'THEME-SHA256.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({k:v for k,v in manifest.items() if k!='files'},indent=2))
