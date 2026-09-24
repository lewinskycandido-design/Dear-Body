# Gallery QA — charme-envoutant

Final result: **PASS — 12/12 frames**, audited 2026-09-24.

Each final was opened individually for visual inspection, then the rebuilt contact sheet was reopened for set-level review. The tool displays 2048-pixel files resized to 1600 pixels; source files were also mechanically checked at their full dimensions. Root independently reviewed the contact sheets.

| Frame | Role | Result | Visible faces | Evidence |
|---|---|---|---:|---|
| 01 | Featured packshot | PASS | 0 | Bottle and intact two-piece canister, correct label colors, legible scent name, glass and liquid; no competing props. |
| 02 | Spray in motion | PASS | 0 | Active hand press and fine mist from round side port; broad collar, stepped body and thick actuator remain visible. |
| 03 | Packaging reveal | PASS | 0 | High-angle uncapped reveal differs from 01. Upper sleeve is smooth and upright with attached solid black top; lower base supports bottle; real black bottle cap is the only loose cap. |
| 04 | Magnetic cap | PASS | 0 | Glossy black detached cap and black underside above separate polished silver atomizer; exact deterministic MAGNETIC CAP caption. |
| 05 | Lifestyle hero | PASS | 1 | One adult Filipino man stepping out of neighborhood bakery holding fragrance and pastry bag; rust polo/navy trousers; no background faces. |
| 06 | Lifestyle handheld | PASS | 0 | Face-free hand lifting fragrance at a warm cafe table beside coffee and pastry; scale, grip and perspective plausible. |
| 07 | Lifestyle editorial | PASS | 0 | Top-down packing action with fragrance in navy bag beside rust overshirt and pastry; natural fingers and contact shadows; no faces. |
| 08 | Product profile | PASS | 0 | Verified volume, material, cap, liquid, code and package color only; cream/oxblood system, dark text on accent field; text bounds checked. |
| 09 | Ingredients and care | PASS | 0 | All 11 ingredients retained in source order with exact code, barcode and volume; only verified safety text included; 64px body type at 2048. |
| 10 | Closing hero | PASS | 0 | Elevated urban closing view, product and canister clear in warm light; exact deterministic A SCENT JOURNEY heading. |
| 11 | Scent description | PASS | 0 | Exact owner-approved sentence, including punctuation, from Canva DAHIB2UjgJM page 3 / SCENT_DESCRIPTION_SOURCE_LEDGER.md. |
| 12 | Who it fits | PASS | 0 | Inclusive For someone drawn to statement; no more than three supported interpretive traits; face-free photo; no performance, note-pyramid, age or occasion claims. |

## Set review

Exactly one adult face, only in 05. Every other frame has zero faces, including reflections, packaging, background and props. Product identity, label contrast, hardware, liquid and package color remain consistent. Physical grip, contact shadows, plausible settings and warm/fun/light behavior pass. All five brand architecture checks (appealing, vibrant, approachable, DearBody, scent-specific) pass. Cream/oxblood typography anchors the scent accent. No arrows, invented fragrance claims or legacy gallery asset carryover.

## Lifestyle diversity

Mistened uses flower-market walking, lavender crochet tote and gingham picnic. Charme uses bakery departure, coffee-table handheld and navy weekend-bag packing. Location, action, camera distance, wardrobe, props and mood differ from one another and from the rejected legacy roller-rink and red-convertible stories. Flowers, coffee and pastries are setting atmosphere, not asserted fragrance notes.

## Source and copy audit

Physical references: IMG_20260923_163311.jpg (white-label bottles), IMG_20260923_163159.jpg (black-label bottles), IMG_20260923_162213.jpg (canisters), and working/reference-crops/authentic-thick-atomizer-closeup.jpg. Packaging facts and exact ordered ingredients are preserved in SOURCE-FACTS.md and deterministic-copy.json. Mistened facts trace to output/product-listing/mistened-narcissus/SOURCE-FACTS.md; Charme facts trace to output/product-listing/charme-envoutant/generated-v01/GALLERY_MANIFEST.md. Both scent sentences trace to owner Canva design DAHIB2UjgJM, Brand Deep Dive page 3, cross-checked against SCENT_DESCRIPTION_SOURCE_LEDGER.md and approved-product-copy.json. Canva identity remains the design source. No replacement note claims were inferred from lifestyle props or the global website.

## Targeted revision record

05 incidental canister removed from cafe table by referenced edit; one naturally held bottle remains. 08 orange-field caption darkened to deep ink for stronger contrast. Both 08/09 layouts received larger deterministic factual copy; all typography bounds were recomputed successfully. Only targeted failed frames/layouts were changed. Final photos and information frames were re-audited after those corrections.

## Technical validation and limitations

- 12 unique 2048×2048 RGB PNGs with explicit sRGB ICC profile, correctly ordered 01–12.
- 12 unique 1200×1200 progressive JPEG website derivatives, numbered 01.jpg–12.jpg, explicit sRGB.
- Fresh deterministic 08/09/11/12 layouts plus exact 04/10 captions; no generated infographic body copy.
- Built-in ImageGen natively returned 1254×1254 and provides no size control. Newly generated photography was transparently Lanczos-resampled to 2048; native originals remain in working/. This is an export-size pass, not a claim of native 2048 photography.
- System Arial/Arial Bold fallback was explicitly requested because official font binaries were unavailable.
- gallery_guard.py structural check, checksum-lock write and checksum-lock verification completed without failures or warnings. gallery-lock.sha256 protects final PNGs. web-lock.sha256 protects derivatives.

No known blocking visual or factual defect remains.
