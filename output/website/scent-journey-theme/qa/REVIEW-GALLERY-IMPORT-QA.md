# Owner-selected gallery import — PASS

Date: 24 September 2026. This revision imports the owner's selected artwork from `output/product-listing/GALLERY_REVIEW_2026-09-24.html` into the local theme and preview. No Shopify data or media-library changes were made.

All six existing website fragrances receive twelve images each: Mojito Metallique, Amber Oud Silk, Mistened Narcissus, Charme Envoûtant, Oud Mirage and Rtulle & Satin. The source folder `rtulle-and-satin` maps to website handle `rtulle-satin`. No additional scents are introduced.

## Asset verification

- All 72 original PNGs match the selected review's saved global checksum lock and the import provenance manifest. Original source files remain untouched.
- All 72 installed gallery JPEGs are 1200×1200 and all 72 thumbnails are 160×160. All 72 gallery JPEGs replace their previous website versions.
- Six source gallery guards passed with zero structural failures or color-profile warnings. Independent source/export verification recorded 303 successful checks.
- Six derivative contact sheets were visually reviewed in the website order: **01, 11, 12, 08, 09, 05, 06, 07, 02, 03, 04, 10**. Correct scent mapping, full layouts and legible contrasting artwork were retained. Dense care copy can be enlarged with the existing zoom.
- The optimized JPEGs omit an embedded ICC profile. This metadata observation is recorded in the [visual review](../reviewed-product-galleries/qa/INTEGRATION-VISUAL-QA.md).
- All 30 files in the preservation manifest match their saved hashes, including the 22 banner photographs, banner/font manifests, favicon assets and gallery interaction/layout sources.

## Website verification

- [Browser report](review-gallery-browser-report.json): **104 checks passed; zero failures**. Coverage includes all six galleries in Light and Dark, twelve slides and thumbnails per product, image loading and order, keyboard navigation and wrap, zoom, collection packshots, search thumbnails, cart icon, and the product-free homepage's collection links.
- [Shopify Theme Check](theme-check-review-gallery.json): **zero findings**.
- [Preview build report](../preview/public/preview-report.json): **63 native sources validated; 22 routes rendered**, with one H1 per page, no duplicate IDs and no missing referenced assets.

Autoplay and gallery interaction code are unchanged; the prior [195-check autoplay report](GALLERY-AUTOPLAY-QA.md) remains historical evidence for that implementation. Earlier banner/font reports likewise describe their own revisions. The current import does not regenerate or redesign any artwork.

The package script checks original PNG provenance, installed galleries and thumbnails, banner and font hashes, and every archived file byte. The final archive details and checksum are recorded in [the package manifest](package-manifest.json).
