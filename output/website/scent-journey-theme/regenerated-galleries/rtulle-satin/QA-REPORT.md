# Rtulle & Satin: regenerated gallery QA

Reviewed 24 September 2026. Status: **PASS for local delivery**. All 12 final PNGs and 12 web JPEGs are new outputs for the current website refresh. No old gallery image pixels were reused. No Shopify writes were performed.

## Sources and limits

- Brand identity: workspace BRAND_GUIDE.md derived from the owner's Canva source. Burgundy #5c0006, cream #f4e3cb and warm coral accents govern the new artwork.
- Physical bottle reference: /Users/wetrade/Downloads/IMG_20260923_163159.jpg (centre aqua bottle).
- Physical canister reference: /Users/wetrade/Downloads/IMG_20260923_162213.jpg (far-right aqua canister).
- Atomizer reference: working/reference-crops/authentic-thick-atomizer-closeup.jpg.
- Description: output/product-listing/SCENT_DESCRIPTION_SOURCE_LEDGER.md, approved Canva DAHIB2UjgJM page 4.
- Ingredient, code, barcode and safety transcription: existing verified package record output/product-listing/rtulle-and-satin/generated-v01/QA-REPORT.md and typeset.swift. These factual records were reused; their images were not.
- Exact description: Airy sweetness with a warm, glowing trail.
- Fit interpretation: For someone drawn to airy sweetness and a warm, glowing character.
- Owner-supplied Cenzo Flare Bold headings and Helvetica Now Text Regular body are now rendered from the actual supplied TTF files. No fallback font or synthetic bold is used. Physical photographic labels, logos and exact copy remain unchanged.
- Native imagegen photo outputs are 1254×1254. Requested final PNGs are normalized/upscaled to 2048×2048, with text rendered directly at 2048; web JPEGs are 1200×1200. This does not claim native 2048 photographic detail. Every final has an embedded sRGB ICC profile.
- Physical package logos remain reference-guided generated photographic label details; original standalone brand logos belong to the website shell supplied by the parent task.

## Frame review

| Frame | Result | Evidence |
|---|---|---|
| 01 | PASS | Front bottle and complete canister, correct black label and name, clear cylinder, correct liquid/package colours, no face. |
| 02 | PASS | Cropped male hand actively presses substantial stepped silver atomizer; visible mist originates at round side port, detached cap black, no face. |
| 03 | PASS after targeted revision | Uncapped bottle sits in clearly open short package cup; separate tall upper canister retains solid black top. Only two package components; detached cap all black. |
| 04 | PASS | Black cap is held just above authentic bottle-mounted stepped silver atomizer; underside stays black. Deterministic MAGNETIC CAP type high contrast. |
| 05 | PASS | Warm full-person candid with exactly one adult Filipino male face; natural product interaction and approachable wardrobe. No additional background/printed/reflected faces. |
| 06 | PASS | Face-free cropped male hands, plausible grip and small bottle scale, readable scent label and natural everyday context. |
| 07 | PASS | Face-free bag/personal-object action, product remains grounded and integrated, no portrait/screen/reflection faces. |
| 08 | PASS | Deterministic product facts only; volume, men's line, physical details and product code. Strong burgundy/near-black type on light field. |
| 09 | PASS | Ingredient order, volume, code, barcode and safety wording copied from verified local package-transcription record; deterministic text and clear full-size listing layout. |
| 10 | PASS | Elevated closing scene, exact deterministic A SCENT JOURNEY, label/product remain visible; zero faces. |
| 11 | PASS | Exact approved description sentence, including punctuation, deterministic type; no invented note pyramid/performance claim. |
| 12 | PASS | Inclusive description-derived For someone drawn to wording, no unverified audience or performance claim; face-free hands/product context. |

## Revision record

Frame 03 initially placed the bottle on a closed-looking short platform. Targeted imagegen edit replaced it with the visibly open lower package cup and removed its extra seam; tall black-topped upper section and separate all-black bottle cap remained. Re-audit passed.

All other frames passed their first visual review. Passing outputs were retained. Final contact sheet and individual image review found no remaining blocking identity, spelling, anatomy, face-budget, layout or packaging defects.

## Lifestyle diversity

| Frame | Location / action | Wardrobe / prop | Camera / mood |
|---|---|---|---|
| 05 | Seaside boardwalk, walking with beach tote and taking out scent | Coral linen shirt, cream shorts; aqua-striped tote | Full walking figure; open cheerful smile |
| 06 | Boardwalk rail, taking scent from tote | Coral shirt and cream shorts | Waist-and-hands crop; sparkling sea |
| 07 | Boardwalk bench, reaching for scent in beach bag | Straw hat, opaque sunglasses, coral linen | Overhead context; sunny easy weekend |

The two stories differ in location, action, wardrobe silhouette, main prop, distance, angle and social energy. Product colouring is maintained while the human mood stays warm, fun and light.

## Supplied-font typography refresh — 24 September 2026

Status: **PASS**. Frames **04, 08, 09, 10, 11 and 12** were rerendered at 2048×2048 from their existing clean photographic bases, with Cenzo Flare Bold for headings and Helvetica Now Text Regular for body copy. The requested Text Regular file was used throughout. No new image generation, caption removal or photographic retouching was needed. Original line wording, punctuation, product facts and physical labels are preserved; line wrapping follows the supplied font metrics.

- 04: MAGNETIC CAP fits the clear left field with high contrast and no hardware overlap.
- 08: product profile, volume, line, physical details and code fit their intended columns.
- 09: every ingredient remains in the verified order; product and safety details fit without clipping.
- 10: A SCENT JOURNEY and scent name fit the original clear sky area.
- 11: the exact approved description is readable and clear of the product.
- 12: the exact existing fit interpretation is readable and clear of the hand and bottle.

Every changed frame was visually inspected at its full 2048-pixel resolution. Both complete 12-frame contact sheets were rebuilt and reviewed. Deterministic text-bound checks passed; see TYPOGRAPHY-BOUNDS.json. Each gallery retains 12 unique, ordered 2048×2048 sRGB PNGs and 12 matching 1200×1200 sRGB JPEGs.

Photo preservation was checked against the archived previous finals: all six non-text photo regions are pixel-identical. All 13 working photo files and all six untouched PNG/JPEG pairs retain identical SHA-256 checksums (25 unchanged files per gallery). See TYPOGRAPHY-PRESERVATION-CHECK.json. Frames 01, 02, 03, 05, 06 and 07 were not reexported.

Prior changed PNGs/JPEGs, the prior renderer, contact sheet, manifest, QA report and locks are retained under archives/20260924T023622Z-pre-supplied-fonts/. The archive's BEFORE-CHECKSUMS.json records the earlier source/output state. Updated provenance and font hashes are in EXPORT-MANIFEST.json; final and web checksum locks were rebuilt and verified after review. Theme files and Shopify were not edited in this typography refresh.

## Deliverables and technical checks

- final/: exactly 12 unique numbered 2048×2048 PNGs.
- final-web/: 01.jpg through 12.jpg, 1200×1200, quality91.
- CONTACT-SHEET.jpg: complete final set in fixed 01–12 order.
- EXPORT-MANIFEST.json: selected source and exact output hashes, sizes and export limitations.
- LOCK.sha256: final PNG checksum lock.
- WEB-LOCK.sha256: web JPEG checksum lock.
- export-oud-rtulle.py in the shared parent directory: deterministic text and export source.
- gallery_guard.py validation: PASS, 12 unique ordered files, 2048×2048, explicit colour profile.
- Final SHA-256 verification: PASS.

Images are suitable for the requested local theme/ZIP integration. Native commerce data, pricing and inventory remain the responsibility of the unchanged Shopify product data.

