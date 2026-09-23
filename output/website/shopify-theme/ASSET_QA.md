# Asset and publication QA — Memphis Edition

Assets reviewed and refined 2026-09-23. Inspected the actual theme JPEGs individually, compared product identities with owner photographs `IMG_20260923_163159.jpg`, `IMG_20260923_163311.jpg`, `IMG_20260923_162213.jpg`, `IMG_20260923_162432.jpg` and `IMG_20260923_162544.jpg`, and checked image dimensions, byte sizes and hero/font markup. The three black-label card images were regenerated with built-in imagegen to match the cream studio treatment and bring Oud Mirage's liquid closer to its source color. Their final 900-pixel quality-87 JPEGs were individually inspected, copied into the theme assets and verified byte-for-byte. The subsequent Memphis UI redesign reuses these reviewed images; it changes their presentation without changing the six scent identities or commerce behavior. Current rendered layout checks are performed separately by the implementation task.

## Asset results

| Theme asset | Pixels | Bytes | Review |
| --- | --- | ---: | --- |
| db-hero-desktop.jpg | 1774 × 887 | 337843 | PASS: all six distinct bottles, correct printed names and white/black label groups; full caps and bases. |
| db-hero-mobile.jpg | 1122 × 1402 | 382917 | PASS: six bottles in two clear rows; every label remains visible; spelling and Charme accent preserved. |
| db-mojito-metallique.jpg | 900 × 900 | 139969 | PASS: MOJITO METALLIQUE, ivory labels, yellow canister, golden liquid. |
| db-amber-oud-silk.jpg | 900 × 900 | 131354 | PASS: AMBER OUD SILK, ivory labels, peach canister, pale champagne liquid. |
| db-mistened-narcissus.jpg | 900 × 900 | 134941 | PASS: MISTENED NARCISSUS, ivory labels, lilac canister, nearly clear liquid. |
| db-oud-mirage.jpg | 900 × 900 | 89695 | PASS after refinement: OUD MIRAGE, black labels, medium-blue canister and transparent pale-blue liquid; saturated cyan liquid corrected. |
| db-charme-envoutant.jpg | 900 × 900 | 102667 | PASS after refinement: CHARME ENVOÛTANT, black labels, vivid orange canister and amber-orange liquid; clean cream composition matches the collection. |
| db-rtulle-and-satin.jpg | 900 × 900 | 99997 | PASS after refinement: RTULLE & SATIN, black labels, turquoise canister and transparent pale-turquoise liquid. The unusual initial R is preserved exactly. |

All eight files decode as RGB JPEG. Labels are sharp at these asset sizes; silhouettes, package closure, caps and contact shadows are intact. No duplicated or omitted scent, extra bottle, cut-off label or spelling error was found. Small PARFUM/LONDON text naturally becomes tiny on narrow product cards; live product titles should carry identification at that size.

## Publication fit

The home-display heroes are warm, vibrant and approachable: cream daylight, natural wood, a burgundy tray and orange lamp tie the six products to the brand palette. They present the collection without treating one fragrance as the only hero. After refinement, all six cards share the same cream background, framing, soft light, natural contact shadow and bottle/canister placement. The lively packaging colors distinguish scents within a consistent product grid. No blocking identity or publication-fit issue remains in the eight reviewed images.

The Memphis interface uses only the five brand colors for its decorative treatment: burgundy `#5c0006`, red `#9a1106`, burnt orange `#d46601`, golden tan `#e9a250` and cream `#f4e3cb`. Rings, waves, zigzags, starbursts and checkerboard details complement solid borders and offset shadows. Product labels remain part of the original reviewed photography, with unrotated live scent names below the cards. Decorative shapes are hidden from assistive technology and cannot intercept clicks. Reduced-motion preferences are respected. Core text pairings have strong contrast: burgundy/cream 11.45:1, burgundy/gold 6.69:1 and red/cream 6.80:1. Orange is reserved for decorative accents rather than small text on cream.

The refined PNG masters and WebP copies are in `output/website/redesign-assets/` as `{oud-mirage,charme-envoutant,rtulle-and-satin}-website-packshot-v02`. Prompt provenance and checksums are recorded there in `BLACK_LABEL_PACKSHOT_PROMPTS_V02.json` and `BLACK_LABEL_PACKSHOT_FILES_V02.json`. The six card masters remain native 1254 × 1254; no product artwork was deterministically retouched during export.

## Hero placement

- Current default: the complete near-4:5 `db-hero-mobile.jpg` is used at every screen size. Its intrinsic ratio is preserved with automatic height and `object-fit:contain` inside the Memphis frame.
- Desktop: live copy and the framed portrait photo occupy separate columns. The decorative starburst overlaps the photo's upper corner, away from the bottle labels. Do not place the heading or button across the product group.
- Mobile: at 700px and below, copy stacks above the photo. All six labels and bottle edges remain visible. Avoid a short fixed-height cover crop or overlaying text over the upper product row.
- Optional images: `db-hero-desktop.jpg` remains available in its complete 2:1 format. The theme editor accepts a replacement hero photo and a separate mobile photo; 4:5 is recommended for the current layout. Replacements need their own crop and label-visibility review rather than inheriting the approval of the supplied assets.

## Brand implementation limits

The theme currently uses `Helvetica Neue`, `Helvetica`, `Arial`, sans-serif for both display and body. This is a documented fallback; it does not reproduce the official Cenzo Flare Bold display face or Helvetica Now Display body face. Licensed brand webfonts have not been installed.

The header supports an uploaded logo through `settings.logo`; the footer supports a light logo through `settings.footer_logo`. Both image pickers are under Theme settings → Brand artwork. Their default is now a transparent DearBody PH wordmark recreated from page 6 of the supplied Canva playbook, rendered in burgundy in the header and cream in the footer. This is a faithful AI web recreation, not the original logo master. Provenance is recorded in `LOGO-SOURCE.md`; official artwork can replace it through the image pickers.

Three new generated images replace all eight raw-photo assets in the theme. `db-lifestyle-collection.jpg` (1086 × 1448) presents all six bottles on a warm home console; `db-lifestyle-for-her.jpg` and `db-lifestyle-for-him.jpg` (1200 × 1200 each) present the corresponding three-bottle groups. Raw owner photographs were used only as product references. All six names, cap colors, cylindrical silhouettes and ivory/black label families were reviewed. Full caps and bases remain visible. Small monograms and glass details are AI representations, not pixel-identical copies. Built-in image generation was used; exact prompts and references are recorded in `IMAGE-PROMPTS.json`. Original source photographs remain unchanged.

No ingredient, performance or fragrance-note claims were inferred during this image audit.

## Navigation banners

Two additional photographs were generated with the built-in image generation tool and visually inspected as both masters and web exports. `db-banner-story.jpg` is 1536 × 1024 (408,583 bytes): exactly six complete bottles in one sunlit row, all names readable, first three ivory labels and last three black labels, original PARFUM/LONDON branding. `db-banner-contact.jpg` is 1536 × 1024 (451,193 bytes): a cream telephone with burgundy handset, blank stationery and warm home materials. There is no baked-in heading, actual contact number, address or claim.

The For Her / For Him banners reuse the approved 1200-square trio images. All four layouts keep live headings beside the photo on desktop and above it on mobile. Image height is automatic, with no cover crop, so bottle caps and bases remain visible. Banner decoration and backgrounds use the five brand tokens. Prompt provenance and QA for both new images are included in `IMAGE-PROMPTS.json`; masters are stored under `output/website/nav-banner-images/` in the original workspace. The Story image retains the documented AI-rendered fine-detail limitation.
