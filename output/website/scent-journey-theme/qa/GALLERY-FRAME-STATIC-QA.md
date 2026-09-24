# Gallery frame static QA — PASS

112/112 checks across all six rendered product routes.

Approved order: 01, 11, 12, 08, 09, 05, 06, 07, 02, 03, 04, 10.

All six galleries retain 12 matching images/thumbnails, accurate alt and sequence labels, paired zoom sources, two directional controls, no Play control, the new photo-frame wrappers and existing accessibility hooks. The frame stylesheet declares a white image stage and contained artwork.

All 144 original gallery/thumbnail JPEGs match the immutable pre-redesign baseline. Eight gallery methods, the gallery portion of the click handler and three event/node binding blocks retain their baseline source, including autoplay, manual pause, keyboard, swipe, zoom and cleanup. Purchase-only quantity/reveal handling may change independently; it is excluded from the click-handler lock. The generated frame PNG and JPEG match their separate checksum locks.

## Boundaries

- Site JavaScript is parsed but not executed. Gallery methods and event/node bindings retain the baseline source; checkout integration intentionally changes the complete product script. Runtime checkout and gallery interaction verification are separate.
- JSDOM has no layout engine. White backgrounds/object-fit are stylesheet declarations; actual dimensions, overflow, clicks, autoplay, swipe, zoom, Dark mode and contrast require the separately owned CUA review.
- Original asset immutability covers the 72 product gallery JPEGs and their 72 thumbnails. The generated frame PNG and website JPEG are separately checksum-locked in gallery-frame-assets.json.

No source files, preview pages or packages were changed. Root owns CUA click/layout and visual evidence.

## Issues

No static failures.

Machine evidence: GALLERY-FRAME-STATIC-QA.json. Repeat with `node qa/gallery-frame-static-qa.cjs`.
