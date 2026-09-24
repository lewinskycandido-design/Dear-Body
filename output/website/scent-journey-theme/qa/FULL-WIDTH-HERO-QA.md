# Full-width homepage hero QA — PASS

Focused local-preview browser and visual verification after removing the external hero container/gaps. No theme source edits, broad suite, build, package, or Shopify operation performed by this QA task.

| Theme | Viewport width | Stage x / width | Result |
|---|---:|---|---|
| Light | 1440 px | 0 / 1440 px | PASS |
| Dark | 1440 px | 0 / 1440 px | PASS |
| Light | 820 px | 0 / 820 px | PASS |
| Dark | 820 px | 0 / 820 px | PASS |
| Light | 390 px | 0 / 390 px | PASS |
| Dark | 390 px | 0 / 390 px | PASS |
| Light | 1920 px | 0 / 1920 px | PASS |

All seven hero captures and the mobile full-page capture were opened and inspected. Both faces remain fully visible, copy is readable, and the photo reaches both viewport edges. The text retains appropriate inner padding.

Each case has one H1, no horizontal or heading overflow, a loaded theme-specific hero image, and no JavaScript page errors. Explore the collections still reaches `#ShopCollections` with the title visible and below the header-height offset.

Evidence: `FULL-WIDTH-HERO-QA.json` and `screenshots/full-width-hero/hero-{light|dark}-{width}.png`. Representative complete mobile page: `screenshots/full-width-hero/home-light-390-full.png`.

No remaining blockers.
