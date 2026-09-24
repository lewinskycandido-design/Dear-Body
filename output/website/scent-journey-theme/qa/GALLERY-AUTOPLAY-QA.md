# Product gallery autoplay QA — historical PASS

Historical local preview verification of the earlier infographic-first order and controlled image rotation. The current packshot-first order is verified separately in [GALLERY-ORDER-QA.md](GALLERY-ORDER-QA.md). Autoplay and other interaction code did not change during the order revision. Existing images are reused; no Shopify operations or source modifications were performed by this test.

- status: PASS
- scenarios: 18
- checks: 195
- passed: 195
- failures: 0

| Scenario | Result |
|---|---|
| behavior-1440-light | PASS |
| behavior-1440-dark | PASS |
| swipe-mobile | PASS |
| reduced-motion-mobile | PASS |
| controls-320-light | PASS |
| controls-320-dark | PASS |
| native-video-fixture | PASS |
| native-model-fixture | PASS |
| native-single-fixture | PASS |
| order-mojito-metallique | PASS |
| order-amber-oud-silk | PASS |
| order-mistened-narcissus | PASS |
| order-charme-envoutant | PASS |
| order-oud-mirage | PASS |
| order-rtulle-satin | PASS |
| behavior-390-light | PASS |
| behavior-390-dark | PASS |
| lifecycle-desktop | PASS |

## Coverage

At the tested revision, all six actual products retained twelve unique assets in source order 11, 12, 08, 09, 10, 01, 02, 03, 04, 05, 06, 07. Desktop 1440 and mobile 390 covered Light and Dark; 320px controls were checked in both themes. Tests exercised eight-second timing, silent automatic changes, explicit pause/play, wrap, manual arrows/thumbnail/keyboard, native zoom and focus return, real touch swipe, offscreen suspension, reduced motion, variant/focus pausing, and disconnected cleanup.

## Explicit test boundaries

- Browser timing uses Playwright Clock; IntersectionObserver and layout remain native.
- Hidden-document behavior uses explicitly labelled visibility properties and the real visibilitychange handler. It does not claim an OS background-tab test.
- Video/model/single-image eligibility uses labelled in-memory response fixtures constructed from the real rendered PDP. No source, catalog, or product data is changed.

## Issues

No automated failures.

Screenshots: `screenshots/gallery-autoplay/`. Detailed machine evidence: `GALLERY-AUTOPLAY-QA.json`.

## Visual review

PASS: inspected desktop 1440, mobile 390, and narrow 320 screenshots in both Light and Dark. Image composition stays intact; active thumbnails, pause control and arrows are clear and contained. The thumbnail rail scrolls horizontally without page overflow.

The aggregate retains passed scenarios and reruns only corrected test assertions and timing. Initial harness corrections covered native “Show media” labels, sufficient time for long-distance smooth scrolling, and the wheel pointer position. No source changes were required by these corrections.

Independent real-time browser smoke evidence is recorded by the parent task in `GALLERY-REAL-TIME-SMOKE.json`; it checks actual eight-second advancement, zoom pause, and quantity increment without the mocked clock.
