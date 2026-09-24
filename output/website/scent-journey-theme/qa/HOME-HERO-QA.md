# Homepage hero QA — PASS

The later full-width layout update is verified separately in [FULL-WIDTH-HERO-QA.md](FULL-WIDTH-HERO-QA.md). This report preserves the earlier content and interaction checks.

Read-only browser QA against the local preview at `http://127.0.0.1:4208`, using headless Google Chrome. No theme source edits, build, packaging, or Shopify operations were performed by this QA task.

## Scope and results

**10/10 viewport/theme combinations passed:** Light and Dark at 1440,1024,820,390,360px. Desktop/tablet viewport height 1000 px; mobile 844 px. Each hero screenshot was visually inspected. Four representative full-page captures were also inspected.

- New theme-specific `sj-home-hero-light.jpg` / `sj-home-hero-dark.jpg` loaded in all cases.
- Both hero faces and heads remain fully visible at all five crop widths. Copy remains readable and clear of the subjects.
- Exactly one H1 per homepage. No horizontal page overflow or text range extending beyond heading bounds.
- Cenzo Flare Bold and Helvetica Now Text report `loaded` in `document.fonts`; headings and body use the supplied font families.
- Hero precedes `#ShopCollections`. Exactly two Women/Men campaign panels; links resolve to `/collections/womens-perfume` and `/collections/mens-perfume`.
- Zero product cards and zero individual product links in the homepage main content.
- Explore the collections reaches the intended section with its title visible.
- Shopping-bag icon is visible and its drawer opens successfully in all 10 cases. No JavaScript page errors.

## Phrase placement

**23/23 native preview routes passed** after normalizing whitespace and case. `A SCENT JOURNEY FROM LONDON TO THE PHILIPPINES` appears once in the Our Story H1 and zero times on every other route. The JSON lists each checked route and count.

## Finding resolved

Full-page inspection found the Light footer's Discover the collection link had burgundy text on the identical burgundy background (1:1 contrast). Root added `.sj-footer .sj-text-link { color: inherit; }` and rebuilt the preview. Fresh-page follow-up at 1440 and390px in both themes confirms cream text and **11.45:1 contrast**. All four targeted checks pass; representative full-page screenshots were refreshed after the fix.

## Preview limitation and anchor verification

The preview adapter emits only `class="shopify-section"` for the header wrapper, so ordinary preview scrolling does not exercise Shopify's native sticky section-group class. The theme already contains sticky CSS for `.shopify-section-group-header-group`. A temporary browser-only class addition simulated that native wrapper at 1440 and390px in both themes. Header top remained 0; collection title stayed below its bottom with 112 px desktop and 90 px mobile clearance. This validates intended native CSS behavior without changing repository source.

## Evidence

- Machine report: `HOME-HERO-QA.json`
- Reproducible checks: `home-hero-qa.cjs`, `home-hero-final-check.cjs`
- All 10 hero crops: `screenshots/home-hero/hero-{light|dark}-{1440|1024|820|390|360}.png`
- All 10 top viewport captures: `screenshots/home-hero/home-{light|dark}-{width}-top.png`
- Representative full pages: `screenshots/home-hero/home-{light|dark}-{1440|390}-full.png`
- Footer follow-up: `screenshots/home-hero/footer-fixed-{light|dark}-{1440|390}.png`
- Native-header simulation: `screenshots/home-hero/collection-anchor-sticky-simulation-{light|dark}-{1440|390}.png`

No remaining blockers.
