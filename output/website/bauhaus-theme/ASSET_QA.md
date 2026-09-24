# DearBody Bauhaus — artwork provenance and presentation

The Bauhaus edition reuses the existing DearBody generated product and lifestyle photographs. No new product-image generation was performed for this redesign. The primary wordmark is the previously created web recreation; the secondary circular monogram is a new vector recreation from the supplied brand playbook. `LOGO-SOURCE.md` records the distinction between these bundled web recreations and original brand masters.

## Homepage photographs

| Asset | Dimensions | Inherited scene and identity |
|---|---|---|
| `db-home-spray-v1.jpg` | 1536 × 1024 | Charme Envoûtant held in a hand, spraying visible fine mist in warm light; black label and amber-orange liquid. Default hero. |
| `db-home-bag-v1.jpg` | 1122 × 1402 | A hand lifts Amber Oud Silk from a burgundy tote, with Mojito Metallique in an adjacent pocket; ivory labels and corresponding liquid colors. |
| `db-home-vanity-v1.jpg` | 1122 × 1402 | Mistened Narcissus, Oud Mirage and Rtulle & Satin on a warm bathroom counter, with distinct ivory/black label families and pale liquid colors. |
| `db-banner-story.jpg` | 1536 × 1024 | Sunlit home-console display showing all six priority scents; closing homepage scene and Story banner. |

The three spray/bag/vanity photographs were generated and reviewed during the earlier Liquid Glass work. Their unchanged generation prompts, references, export details, review records and checksums are retained in `HOMEPAGE-PROMPTS.json` and `HOMEPAGE-ASSET-QA.json`. Those files document the original image work, not a fresh Bauhaus visual-layout review.

## Other retained artwork

| Asset | Role and product identity |
|---|---|
| `db-mojito-metallique.jpg` | Packshot: ivory labels, yellow canister, golden liquid. |
| `db-amber-oud-silk.jpg` | Packshot: ivory labels, peach canister, pale champagne liquid. |
| `db-mistened-narcissus.jpg` | Packshot: ivory labels, lilac canister, nearly clear liquid. |
| `db-oud-mirage.jpg` | Packshot: black labels, blue canister, transparent pale-blue liquid. |
| `db-charme-envoutant.jpg` | Packshot: black labels, orange canister, amber-orange liquid. |
| `db-rtulle-and-satin.jpg` | Packshot: black labels, turquoise canister, pale-turquoise liquid. Preserve the printed initial R. |
| `db-lifestyle-for-her.jpg` | Mojito Metallique, Amber Oud Silk and Mistened Narcissus trio; category banner and matching product-gallery lifestyle view. |
| `db-lifestyle-for-him.jpg` | Oud Mirage, Charme Envoûtant and Rtulle & Satin trio; category banner and matching product-gallery lifestyle view. |
| `db-banner-contact.jpg` | Telephone/stationery Contact banner; no actual contact number, address or baked-in heading. |
| `db-hero-mobile.jpg` | Earlier portrait collection photograph, used by the Story content and retained as an optional hero alternative. |
| `db-hero-desktop.jpg` | Earlier landscape collection photograph, retained for optional use. |
| `db-lifestyle-collection.jpg` | Earlier home-console photograph retained for optional editorial/gallery use. |
| `db-editorial.jpg` | Retained legacy editorial asset. |
| `db-logo-burgundy.png` | Recreated primary DearBody PH wordmark, used as an alpha mask with the brand interface color. |
| `db-logo-secondary.svg` | Recreated secondary circular monogram, used as a scalable alpha mask and favicon. |

The fallback asset set includes seventeen JPG photographs, one primary-logo PNG and one secondary-logo SVG. Packaging treats the SVG as editable text, so it appears in the copy-code selector as `assets/db-logo-secondary.svg`. It is still included in the Shopify theme archive.

## Source references and limits

Earlier image work used the owner's photographs, including `IMG_20260923_163159.jpg`, `IMG_20260923_163311.jpg`, `IMG_20260923_162213.jpg`, `IMG_20260923_162432.jpg` and `IMG_20260923_162544.jpg`, to check printed names, label families, liquid colors and bottle proportions. The generated packshots were reviewed as matching cream studio compositions; the lifestyle outputs were reviewed against the same references. Raw owner photographs are reference material rather than storefront assets.

`IMAGE-PROMPTS.json` preserves earlier generation prompts and references. Packshot refinements were recorded in the original workspace under `output/website/redesign-assets/BLACK_LABEL_PACKSHOT_PROMPTS_V02.json` and `BLACK_LABEL_PACKSHOT_FILES_V02.json`. These original-workspace paths are provenance references and may not exist in the portable source ZIP.

Generated typography, small monograms, liquid reflections and glass details remain approximations rather than exact pixel-preserving product photography. Do not infer ingredients, fragrance concentration, scent notes, performance or delivery promises from visual props or product names.

## Bauhaus presentation

Use the supplied interface colors: `#5c0006`, `#9a1106`, `#d46601`, `#e9a250` and `#f4e3cb`. Product photographs retain their own colors, including blue, lilac and turquoise packaging. The UI uses solid color fields, grid rules, square controls and decorative geometric shapes; geometry must not replace or distort the brand marks.

Hero and destination-banner photographs span the viewport. Live text remains separate from bottle labels, and the mobile hero puts its copy beneath the image. Preserve complete bottle silhouettes and visible mist when adjusting layouts or replacing photos. Bag and vanity captions stay outside the photographs. Decorative shapes must not intercept clicks, receive focus or obstruct product detail.

Keep both logo variants proportionate, with clear space and strong contrast. The primary wordmark identifies the header; the secondary monogram signs the story and footer. Merchant image pickers can replace the bundled web recreations. See `LOGO-SOURCE.md` for exact provenance and the limits of the available raster reference.

Helvetica Neue/Helvetica/Arial are system-font fallbacks. Licensed Cenzo Flare Bold and Helvetica Now Display files were not supplied; do not describe fallback type as the official brand fonts.

## Validation boundary

Historical photo-generation reviews establish the inherited artwork provenance. They do not establish the Bauhaus theme's responsiveness, crop quality, readability or accessibility. Current source/runtime and sampled browser results belong in `VALIDATION.md`. Any later merchant image or logo replacement needs its own framing, alternative-text and contrast review.
