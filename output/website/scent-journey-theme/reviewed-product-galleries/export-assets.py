#!/usr/bin/env python3
"""Encode web derivatives of the owner's reviewed PNGs without altering artwork."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import hashlib
import json
import subprocess

FOLDER = Path(__file__).resolve().parent
ROOT = FOLDER.parent
manifest = json.loads((FOLDER / 'provenance/source-manifest.json').read_text())
SOURCE = Path(manifest['sourceRoot'])
PROFILE = '/System/Library/ColorSync/Profiles/sRGB Profile.icc'
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()

def export(row):
    original = SOURCE / row['source']
    assert sha(original) == row['sha256'], f'Source changed: {original}'
    target = FOLDER / row['handle'] / 'final-web' / f"{row['frame']:02}.jpg"
    target.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(['sips', '-Z', '1200', '-s', 'format', 'jpeg',
                    '-s', 'formatOptions', '91', '-m', PROFILE,
                    str(original), '--out', str(target)], check=True, capture_output=True)
    return {'handle': row['handle'], 'frame': row['frame'], 'position': row['position'],
            'source': str(target.relative_to(ROOT)), 'source_sha256': sha(target),
            'original_source': str(original), 'original_sha256': row['sha256'],
            'review_scent': row['scent'], 'bytes': target.stat().st_size}

with ThreadPoolExecutor(max_workers=4) as pool:
    records = list(pool.map(export, manifest['files']))
assert len(records) == 72
(FOLDER / 'provenance/web-exports.json').write_text(json.dumps(records, indent=2) + '\n')
print(json.dumps({'exported': len(records), 'size': [1200, 1200],
                  'bytes': sum(r['bytes'] for r in records), 'source_artwork_changed': False}))
