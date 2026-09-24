# Full-width page banners QA

**PASS — 23 cases, 258 assertions, 0 issues.** All 23 banner captures were visually inspected. Local Google Chrome QA on 24 September 2026; this pass changed QA files only.

## Coverage

Women, Men, Shop All, Scent Finder, and Our Story in Light and Dark at 1440 × 1000 and 390 × 844: 20 cases. Three additional spot checks: Our Story Light at 820, Scent Finder Dark at 820, and Shop All Light at 1920.

- Every banner outer and media region starts at x = 0 and matches viewport width.
- Existing Light/Dark artwork loads correctly. Faces remain visible, and Finder’s hands/materials remain clear. Banner headings and supporting copy fit without clipping or collisions with subjects.
- Banner text retains side gutters. Product grids, quiz content, and story essays below the banners retain constrained widths and start after the banners.
- No horizontal page or banner-copy overflow; each page retains exactly one H1.
- Helvetica Now Display Light remains loaded at body weight 300; Cenzo Flare Bold headings remain at 700.
- A mobile collection filter open/close and product-card navigation pass.
- The mobile Finder banner CTA reaches the quiz below the header offset. All five keyboard-driven questions complete and display real product results without overflow.
- No JavaScript errors.

No changes to source, artwork, builds, packages, or Shopify were made by this QA pass. The local preview’s previously documented native sticky-header wrapper limitation remains outside this width update; the Finder CTA check verifies its target and header-height offset.

## Evidence

- [All measurements and checks](PAGE-BANNER-WIDTH-QA.json)
- [Browser QA script](page-banner-width-qa.cjs)
- [Women, Light desktop](screenshots/page-banner-width/women-light-1440.png)
- [Men, Dark mobile](screenshots/page-banner-width/men-dark-390.png)
- [Shop All, wide desktop](screenshots/page-banner-width/shop-all-light-1920.png)
- [Scent Finder, Dark tablet](screenshots/page-banner-width/finder-dark-820.png)
- [Our Story, Light tablet](screenshots/page-banner-width/story-light-820.png)
- [Our Story, Dark mobile](screenshots/page-banner-width/story-dark-390.png)

All 23 banner captures and the completed mobile Finder results capture are in `screenshots/page-banner-width/`.
