#!/usr/bin/env python3
"""Package only native Shopify folders and verify every archived byte."""
from pathlib import Path
import argparse
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
THEME = ROOT / "theme"
ALLOWED = {"assets", "config", "layout", "locales", "sections", "snippets", "templates"}
OUTPUT = ROOT / "DearBody-Theme-Update-COD-Orders.zip"
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--validate-only", action="store_true", help="Verify source and theme asset locks without writing an archive or package manifest.")
args = parser.parse_args()
sha = lambda content: hashlib.sha256(content).hexdigest()
assets = json.loads((ROOT / "qa/gallery-assets.json").read_text())
assert len(assets) == 72, "All 72 selected product images must be installed first."
for image in assets:
    if image.get("original_source"):
        assert sha(Path(image["original_source"]).read_bytes()) == image["original_sha256"], "Reviewed original gallery changed after export"
    assert sha((ROOT / image["source"]).read_bytes()) == image["source_sha256"], "Source gallery changed after bundling"
    assert sha((THEME / "assets" / image["asset"]).read_bytes()) == image["sha256"]
    assert sha((THEME / "assets" / image["thumbnail"]).read_bytes()) == image["thumbnail_sha256"]
campaigns = json.loads((ROOT / "qa/campaign-assets.json").read_text())
assert len(campaigns) == 16, "All 16 campaign images must be installed first."
for image in campaigns:
    assert sha((THEME / "assets" / image["file"]).read_bytes()) == image["sha256"]
product_banners = json.loads((ROOT / "qa/product-banner-assets.json").read_text())
assert len(product_banners) == 6, "Each priority fragrance must have its generated banner."
for image in product_banners:
    assert sha((ROOT / image["source"]).read_bytes()) == image["sha256"], "Product banner changed after approval"
    assert sha((THEME / "assets" / image["file"]).read_bytes()) == image["sha256"]
fonts = json.loads((ROOT / "qa/font-assets.json").read_text())
home_features = json.loads((ROOT / "qa/home-feature-assets.json").read_text())
assert len(home_features) == 3, "All three homepage feature images must be installed first."
for image in home_features:
    assert sha((ROOT / image["original"]).read_bytes()) == image["original_sha256"], "Homepage original changed after approval"
    assert sha((ROOT / image["source"]).read_bytes()) == image["sha256"]
    assert sha((THEME / "assets" / image["file"]).read_bytes()) == image["sha256"]
care_banners = json.loads((ROOT / "qa/customer-care-assets.json").read_text())
assert len(care_banners) == 2, "Both FAQ and Shipping banners must be installed first."
for image in care_banners:
    assert sha((ROOT / image["original"]).read_bytes()) == image["original_sha256"], "Customer-care original changed after approval"
    assert sha((ROOT / image["source"]).read_bytes()) == image["sha256"]
    assert sha((THEME / "assets" / image["file"]).read_bytes()) == image["sha256"]
gallery_frames = json.loads((ROOT / "qa/gallery-frame-assets.json").read_text())
assert len(gallery_frames) == 1, "The generated gallery frame must be installed first."
for image in gallery_frames:
    original = (ROOT / image["original"]).read_bytes()
    derivative = (ROOT / image["source"]).read_bytes()
    assert sha(original) == image["original_sha256"], "Generated gallery frame original changed after approval"
    assert sha(derivative) == image["sha256"], "Gallery frame derivative changed after approval"
    assert len(original) == image["original_bytes"] and len(derivative) == image["bytes"]
    assert sha((THEME / "assets" / image["file"]).read_bytes()) == image["sha256"]
assert len(fonts) == 2, "Both supplied webfonts must be embedded."
for font in fonts:
    assert sha((THEME / "assets" / font["file"]).read_bytes()) == font["sha256"]
if args.validate_only:
    print(json.dumps({"status": "PASS", "scope": "Asset checksum validation only; no archive or package manifest written", "gallery_images": len(assets), "gallery_thumbnails": len(assets), "campaign_images": len(campaigns), "product_banners": len(product_banners), "home_features": len(home_features), "customer_care_banners": len(care_banners), "gallery_frames": len(gallery_frames), "fonts": len(fonts)}, indent=2))
    raise SystemExit(0)
files = sorted(p for p in THEME.rglob("*") if p.is_file() and not any(part.startswith('.') for part in p.relative_to(THEME).parts))
manifest = []
with zipfile.ZipFile(OUTPUT, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for path in files:
        relative = path.relative_to(THEME)
        assert relative.parts[0] in ALLOWED and len(relative.parts) == 2, relative
        content = path.read_bytes()
        archive.writestr(relative.as_posix(), content)
        manifest.append({"path":relative.as_posix(), "bytes":len(content), "sha256":sha(content)})
with zipfile.ZipFile(OUTPUT) as archive:
    assert archive.testzip() is None
    assert "layout/theme.liquid" in archive.namelist()
    assert "templates/index.json" in archive.namelist()
    for entry in manifest:
        assert sha(archive.read(entry["path"])) == entry["sha256"], entry["path"]
report = {"archive": OUTPUT.name, "bytes": OUTPUT.stat().st_size,
          "sha256":sha(OUTPUT.read_bytes()), "files":manifest}
(ROOT / "qa/package-manifest.json").write_text(json.dumps(report,indent=2)+"\n")
print(json.dumps({k:v for k,v in report.items() if k!='files'} | {"file_count":len(files)}, indent=2))
