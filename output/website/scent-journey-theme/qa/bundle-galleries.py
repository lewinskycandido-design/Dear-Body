#!/usr/bin/env python3
"""Install the six audited local galleries into the native Shopify theme."""
from pathlib import Path
import hashlib
import json
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
HANDLES = ["mojito-metallique", "amber-oud-silk", "mistened-narcissus",
           "charme-envoutant", "oud-mirage", "rtulle-satin"]
ASSETS = ROOT / "theme/assets"
sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()

exports = json.loads((ROOT / "reviewed-product-galleries/provenance/web-exports.json").read_text())
assert len(exports) == 72
assert {(r['handle'], r['frame']) for r in exports} == {(h, n) for h in HANDLES for n in range(1, 13)}
sources = []
for row in exports:
    source = ROOT / row['source']
    assert sha(source) == row['source_sha256'], f"Web derivative changed: {source}"
    assert sha(Path(row['original_source'])) == row['original_sha256'], "Reviewed PNG changed after export"
    sources.append((row['handle'], row['frame'], source, row))

manifest = []
for handle, number, source, row in sources:
    target = ASSETS / f"sj-{handle}-{number:02}.jpg"
    thumbnail = ASSETS / f"sj-{handle}-{number:02}-thumb.jpg"
    shutil.copyfile(source, target)
    subprocess.run(["sips", "-Z", "160", "-s", "format", "jpeg", "-s", "formatOptions",
                    "80", str(source), "--out", str(thumbnail)], check=True, capture_output=True)
    manifest.append({"handle": handle, "frame": number,
                     "source": str(source.relative_to(ROOT)), "source_sha256": sha(source),
                     "asset": target.name, "sha256": sha(target), "bytes": target.stat().st_size,
                     "thumbnail": thumbnail.name, "thumbnail_sha256": sha(thumbnail),
                     "original_source": row['original_source'], "original_sha256": row['original_sha256'],
                     "review_scent": row['review_scent'], "position": row['position']})

schema_path = ROOT / "theme/config/settings_schema.json"
schema = json.loads(schema_path.read_text())
for group in schema:
    for setting in group.get("settings", []):
        if setting.get("id") == "regenerated_product_media":
            setting["default"] = True
schema_path.write_text(json.dumps(schema, indent=2, ensure_ascii=False) + "\n")
data_path = ROOT / "theme/config/settings_data.json"
data = json.loads(data_path.read_text())
data["current"]["regenerated_product_media"] = True
data_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
(ROOT / "qa/gallery-assets.json").write_text(json.dumps(manifest, indent=2) + "\n")
print(f"Bundled {len(manifest)} gallery images and {len(manifest)} thumbnails; enabled theme setting.")
