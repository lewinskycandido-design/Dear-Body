# Supplied DearBody fonts

The current website font selection is **Cenzo Flare Bold** for display headings and **Helvetica Now Display Light** for body text. The user supplied `HelveticaNowDisplay-Light.zip` on 24 September 2026 after the earlier Text Regular revision and asked to change website Helvetica Now to Display.

| Source | Usage | Weight |
| --- | --- | --- |
| Cenzo Flare Bold | Live website display headings; also used by the archived website-generated gallery typography | 700 |
| Helvetica Now Display Light | Live website body text and local preview UI | 300 |
| Helvetica Now Text Regular | Archived website-generated gallery body copy, labels and infographic details; source preserved for reproducibility | 400 |

The exact supplied Cenzo and Display WOFF2 files are embedded unchanged in `../../theme/assets/`. The Display face is declared as `Helvetica Now Display` at weight 300, and the website body uses weight 300. The former Text WOFF2 has been removed from theme assets. Optional Theme Editor font URL overrides remain supported, including a separate bold file; without that file, the browser supplies emphasized styling from the available face.

The Display source archive is preserved as `HelveticaNowDisplay-Light.zip`, with four extracted files in `HelveticaNowDisplay-Light/`: TTF, WOFF, WOFF2 and the supplied stylesheet. The earlier Cenzo and Text archives and extracted files remain here. [provenance.json](provenance.json) records the source and SHA-256 checksum of each extracted file.

The earlier website-generated galleries in `../../regenerated-galleries/` were typeset using the supplied Cenzo Bold and Helvetica Now Text Regular TTF files. Their source files, typography scripts and checksum locks remain historical records. Those font statements apply to that archived set.

The current galleries instead use the owner's selected PNGs from `output/product-listing/GALLERY_REVIEW_2026-09-24.html` for the six active scents. `../../reviewed-product-galleries/` records the import: unchanged source PNGs, 1200px JPEG derivatives and 160px thumbnails. The import preserves the selected raster artwork without re-typesetting or relabelling its fonts. Live website Cenzo/Display fonts, logos, favicons and physical product-label artwork remain unchanged. Current verification is recorded in [Review gallery import QA](../../qa/REVIEW-GALLERY-IMPORT-QA.md).

The website Display font-loading and layout revision passed its checks; see [Display font QA](../../qa/DISPLAY-FONT-QA.md). Font/gallery reports describe the versions they tested and do not establish the typefaces in subsequently selected raster artwork.
