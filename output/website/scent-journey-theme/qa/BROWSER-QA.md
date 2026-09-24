# Scent Journey browser verification

24 September 2026 · local native-Liquid preview at `http://127.0.0.1:4208`

**Commerce/gallery baseline: 279 checks passed, zero failures and zero uncaught browser JavaScript errors.** Detailed assertions: `browser-report.json`. The later homepage hero/copy revision is covered separately in `HOME-HERO-QA.md`; accessibility and local Theme Check were rerun after that revision.

**Scent Finder revision: PASS.** The counts below are retained as prior baseline evidence and do not certify the newly revised Finder. Its current behavior and focused checks are tracked in [SCENT-FINDER-QA.md](SCENT-FINDER-QA.md). The actual [theme profile snippet](../theme/snippets/sj-finder-profile.liquid) now provides owner-copy-based editorial defaults for the six launch handles, with native trait overrides and explicit false opt-out. No preview-only profiles, invented inventory or Shopify Admin writes enable this flow.

The revised flow asks collection, mood, scent style, occasion and scent feel. Collection filters first; style scores 5, mood 3, occasion 1 and feel 1. Up to three positive-scoring matches are returned. Skipping every preference produces a labelled discovery edit, constrained to any chosen collection. Mood/occasion are editorial suggestions and scent feel is a character description, not a performance claim. Real sold-out states remain unless the section excludes unavailable products.

The baseline run includes all 72 bundled product images, fourteen campaign images, the restored shopping-bag SVG, transparent official logos and the corrected banner crops. `gallery-browser-report.json` adds **104 passing assertions** covering all twelve images for each scent in both modes, thumbnail navigation, keyboard wrapping, zoom, collection packshots, predictive-search thumbnails, exact six-product scope and product-free homepage gateways. `gallery-fallback-qa.cjs` adds eight passing assertions for native-media fallback behavior. Local Shopify Theme Check reports `[]` (no errors or warnings); all four JavaScript assets pass syntax checks. All six master and web gallery locks verify, and all fourteen installed campaign assets match their audited exports (`campaign-assets.json`).

Automated accessibility: **10 scans, zero WCAG 2 A/AA or WCAG 2.1 AA violations** across homepage, PDP, Women collection, finder and contact in both modes using axe-core 4.11.0. Details and checks requiring human review: `accessibility-report.json`. This is not a claim of full accessibility conformance or completed assistive-technology testing.

Supplied-font verification: **36 passing cases** across Home, Women, Men, Finder, Our Story and PDP × Light/Dark × 1440/390/360px. Both actual font faces load, headings use Cenzo Flare Bold, body copy uses Helvetica Now Text, and no page or heading overflows. `font-report.json` records the assertions; `font-screenshots/` contains the visual proof. A desktop gallery button's intrinsic minimum height had clipped the zoom hint; a desktop-only `min-height: 0` fixes it while preserving zoom, thumbnails and the fixed gallery layout.

The post-font browser run initially had six failed Search assertions because the already-running local preview lacked the new `preload_tag` filter. The preview was restarted, and its search adapter was corrected to mark catalog results with Shopify’s native `object_type: product`. A focused retest verifies both Search modes, loaded fonts, real product results and all 86 review images. The original report is preserved as `browser-report-before-preview-restart.json`; `search-font-regression-report.json` records the rechecks.

- All 23 rendered routes return successfully in both Light and Dark, have exactly one H1, include image alt attributes, and avoid desktop horizontal overflow.
- Core home, collection, PDP, cart, finder and search routes avoid mobile horizontal overflow.
- Desktop PDP information panel scrolls independently while product media remains fixed. It is keyboard focusable. Gallery arrows, keyboard arrows and zoom/Escape work in both modes.
- Mobile PDP returns to natural page scrolling.
- Product purchase controls preserve the real sold-out state from the Shopify snapshot.
- Native-theme predictive search finds actual catalog products; keyboard selection and Escape work. Browser QA found and the commerce agent fixed a real Chrome search-input Escape issue. First Escape clears suggestions; second closes the dialog.
- Cart drawer opens, shows the accurate empty state and closes with Escape.
- The earlier baseline covered the previous Finder preparation state and isolated positive-flow fixtures. The current Finder renders six native theme editorial defaults against real product records; the dedicated revision QA record above supersedes that earlier behavior with completed verification.

`capture-final.mjs` refreshes full homepage and comparison screenshots after normal page scrolling so lazy media is loaded. `image-load-report.json` records actual loaded image sources. The image-load report has zero image failures. The logo-only screenshots were visually inspected: the complete official global wordmark and monogram are visible on transparent backgrounds at both sizes. `capture-product.mjs` waits for active gallery media opacity 1 to avoid capturing the short gallery transition.

The theme is rendered from actual new Liquid, JSON templates, section groups and snippets through the technical adapter. Public product values are timestamped live reads. Custom metafields are left empty because the public endpoint does not expose them; actual theme supplied-copy fallbacks are therefore exercised. Neither this report nor the tests claim checkout, payment, stock write, email delivery, Shopify Theme Editor, app-block, or Shopify runtime validation. Those require an installed draft theme and store configuration. The supplied Cenzo Flare Bold and Helvetica Now Text Regular webfonts are embedded; original transparent official-site logos are recovered and documented.

Reproduce:

```
node preview/render-preview.mjs --serve
node qa/browser-qa.mjs
node qa/capture-final.mjs
node qa/capture-product.mjs
node qa/accessibility-qa.mjs
```

Run from the Scent Journey project root after installing each directory's dependencies. `CHROMIUM_PATH` can point to an installed compatible Chromium browser. This machine uses an isolated headless Chrome process; the existing cached Chromium copy lacks its framework, so it was not used.
