# Owner-selected product galleries — 24 September 2026

The current website galleries use the artwork selected by the owner in [Gallery Review, 24 September 2026](../../../product-listing/GALLERY_REVIEW_2026-09-24.html). All twelve images are imported for each of the six active website fragrances. The other eight scents in that review are not added to the website.

| Website handle | Source gallery folder |
| --- | --- |
| `mojito-metallique` | `mojito-metallique` |
| `amber-oud-silk` | `amber-oud-silk` |
| `mistened-narcissus` | `mistened-narcissus` |
| `charme-envoutant` | `charme-envoutant` |
| `oud-mirage` | `oud-mirage` |
| `rtulle-satin` | `rtulle-and-satin` |

Each gallery retains the review's display order: **01, 11, 12, 08, 09, 05, 06, 07, 02, 03, 04, 10**. The main image leads into the scent description, who it fits, product profile and care infographics before the lifestyle and detail frames. Source frame numbers, rather than review positions, determine the website filenames.

The 72 original 2048×2048 PNGs remain untouched in `output/product-listing/`. The website exports are 1200×1200 JPEGs at quality 91, with 160×160 thumbnails at quality 80. Exporting only resizes and encodes the selected artwork: no generation, cropping or re-typesetting is applied. The JPEGs omit an embedded ICC profile; their visual checks are recorded below.

The installed filenames remain `sj-{website-handle}-{frame}.jpg` and `sj-{website-handle}-{frame}-thumb.jpg`. Shared frame-01 assets also update collection, search, Scent Finder, recommendation and cart images. Gallery autoplay, manual pause, zoom and the existing native-media fallback are unchanged. The 22 campaign/banner photographs, fonts and DearBody favicon are preserved.

- [Source mapping and original checksums](provenance/source-manifest.json)
- [Website export provenance](provenance/web-exports.json)
- [Installed assets and thumbnail checksums](../qa/gallery-assets.json)
- [Current derivative checksum lock](asset-lock.sha256)
- [Integration and visual review](qa/INTEGRATION-VISUAL-QA.md)
- [Website verification summary](../qa/REVIEW-GALLERY-IMPORT-QA.md)
- [Current website image review](http://127.0.0.1:4208/gallery-review)

`export-assets.py` creates these web derivatives from the verified originals. `../qa/bundle-galleries.py` installs them and generates thumbnails; `../qa/package-theme.py` verifies the originals and installed assets before packaging the native Shopify theme. The previous website-generated galleries remain archived in `../regenerated-galleries/`, with their historical provenance and QA.
