# Oud Mirage: regenerated gallery QA

Reviewed 24 September 2026. Status: **PASS for local delivery**. All 12 final PNGs and 12 web JPEGs are new outputs for the current website refresh. No old gallery image pixels were reused. No Shopify writes were performed.

## Sources and limits

- Brand identity: workspace BRAND_GUIDE.md derived from the owner's Canva source. Burgundy #5c0006, cream #f4e3cb and warm coral accents govern the new artwork.
- Physical bottle reference: /Users/wetrade/Downloads/IMG_20260923_163159.jpg (right blue bottle).
- Physical canister reference: /Users/wetrade/Downloads/IMG_20260923_162213.jpg (fourth blue canister).
- Atomizer reference: working/reference-crops/authentic-thick-atomizer-closeup.jpg.
- Description: output/product-listing/SCENT_DESCRIPTION_SOURCE_LEDGER.md, approved Canva DAHIB2UjgJM page 4.
- Ingredient, code, barcode and safety transcription: existing verified package record output/product-listing/oud-mirage/generated-v01/QA-REPORT.md and typeset.swift. These factual records were reused; their images were not.
- Exact description: Dark rose wrapped in smoky, woody depth.
- Fit interpretation: For someone drawn to dark rose, smoky contrast, and woody depth.
- Licensed Cenzo/Helvetica Now fonts were not available. Deterministic type uses documented Helvetica Neue / Helvetica Neue Bold fallback, not falsely labelled official brand fonts. No logo was retyped or redrawn as a separate graphic.
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

Frame 03 initial open cup had an unsupported exterior mid-seam. Targeted imagegen edit removed that seam, preserving the open cup, bottle, authentic atomizer, tall black-topped upper canister and all-black detached cap. Re-audit passed.

All other frames passed their first visual review. Passing outputs were retained. Final contact sheet and individual image review found no remaining blocking identity, spelling, anatomy, face-budget, layout or packaging defects.

## Lifestyle diversity

| Frame | Location / action | Wardrobe / prop | Camera / mood |
|---|---|---|---|
| 05 | Independent record shop, selecting a sleeve and reaching into bag | Blue overshirt, cream tee, tobacco trousers; burgundy record bag | Full seated figure; relaxed curious smile |
| 06 | Street coffee table, holding scent while taking coffee | Blue sleeve, cream cup | Cropped hands; tactile afternoon ease |
| 07 | Record-shop stool, tucking scent into bag pocket | Abstract vinyl sleeve and burgundy bag | Overhead context; warm spontaneous motion |

The two stories differ in location, action, wardrobe silhouette, main prop, distance, angle and social energy. Product colouring is maintained while the human mood stays warm, fun and light.

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

