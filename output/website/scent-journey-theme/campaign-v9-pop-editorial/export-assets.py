"""Encode accepted native PNGs as website JPEGs without cropping or resizing."""
from pathlib import Path
import hashlib, json, struct, subprocess

FOLDER = Path(__file__).resolve().parent
records = []
for original in sorted((FOLDER / 'originals').glob('*.png')):
    data = original.read_bytes()
    assert data[:8] == b'\x89PNG\r\n\x1a\n', original
    width, height = struct.unpack('>II', data[16:24])
    web = FOLDER / 'final-web' / (original.stem + '.jpg')
    subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '91', '-m', '/System/Library/ColorSync/Profiles/sRGB Profile.icc', str(original), '--out', str(web)], check=True, capture_output=True)
    records.append({'asset':original.stem, 'dimensions':[width,height], 'original_sha256':hashlib.sha256(data).hexdigest(), 'web_sha256':hashlib.sha256(web.read_bytes()).hexdigest(), 'bytes':web.stat().st_size})
(FOLDER / 'provenance' / 'jpeg-exports.json').write_text(json.dumps(records, indent=2) + '\n')
print(json.dumps({'exported':len(records), 'resized':False, 'cropped':False, 'format':'JPEG', 'quality':91}))
