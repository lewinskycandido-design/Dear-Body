# Liquid Glass editorial revision — validation

Updated 24 September 2026. This revision adopts the supplied reference's navigation hierarchy, full-width lifestyle structure and alternating editorial category rows while retaining DearBody artwork, copy, logos, palette and liquid glass UI.

## Current automated checks

- Build validates **40 Liquid/JSON files** and renders **16 local routes** from actual theme source.
- **10 banner checks** cover the four destinations, generic-page mapping, merchant image/heading overrides, retained descriptions, empty collections and contact forms.
- **7 lifestyle/layout checks** cover the single hero H1, prioritized spray photograph, complete lazy-loaded lifestyle assets, merchant overrides, category product links, editorial rows instead of collection grids, six-item navigation, secondary logos, category gateways and scent-finder callout.
- **27 commerce checks** pass against actual theme JavaScript and Liquid. Existing paid/free/sold-out/unknown guards, native product forms, gallery switching, currency and missing-link checks remain. Five additional editorial-row checks cover minimum positive prices, differing positive prices, unavailable/free states and missing product URLs.
- **31 quiz checks** pass against actual markup, script and Liquid. Existing matching, preference, missing/custom URL, product-picker and approved-copy coverage remains. Navigation Scent Finder is tested, including mobile close behavior restoring focus to the visible menu summary.

No test sends a form or modifies live Shopify data. Dialog tests use JSDOM API shims, so their coverage does not establish native focus trapping, Escape behavior, inertness or visual layout.

## Artwork and copy

All photographs are reused DearBody assets from the existing themes. No Evah imagery, product copy, prices, reviews or branding were incorporated. The primary and secondary logos are transparent/vector recreations from the supplied brand playbook, documented in `LOGO-SOURCE.md`; original logo masters remain replaceable in settings.

The six editorial scent descriptions match `output/product-listing/SCENT_DESCRIPTION_SOURCE_LEDGER.md`; character lines use only words from those approved descriptions. No inferred scent-note pyramid, performance or concentration claims were added. Unknown products use their merchant descriptions.

## Packaging

`package-theme.py` builds a standalone Shopify ZIP, source ZIP, checksum manifest and exact text source viewer. Final archive integrity and byte consistency are verified after generation. The source archive excludes `node_modules` and runtime caches.

## Current browser review

The parent task completed the following native-browser checks for this revision:

- At **1440 × 900**, the final desktop hero shows the visible mist, complete perfume bottle, full headline and both CTA controls without horizontal overflow.
- The desktop **For Her** page renders alternating **720px / 720px** editorial rows with the complete product image and readable glass copy panel. Clicking Explore Mojito Metallique reaches the correct product URL and H1.
- At the measured **291px CSS viewport width**, the homepage and both collection pages have no horizontal overflow and no completed broken images. Category banners span the viewport.
- The mobile menu's **Scent Finder** opens the native quiz; Escape dismisses it and restores focus to the visible Menu summary.
- Primary and secondary logos are present in the rendered structure, and the footer monogram was visually inspected.

These are sampled desktop/mobile observations, not an exhaustive browser and operating-system matrix.

## Review limits

Parent desktop browser review found the natural-ratio hero pushed its actions below the opening view. The desktop photograph now uses a 560–740px height with a 54vw target and a crop positioned to preserve the complete bottle and central mist. Mobile retains the natural photograph. Final parent browser review passed after that adjustment. Prior layout screenshots are not presented as current evidence. This local preview contains six mock products at the approved ₱799 price with disabled purchasing pending inventory confirmation. Shopify checkout, tax/shipping, payment handling, inventory, real collection contents, product visibility and email delivery require review in the actual Shopify draft. This revision has not uploaded or published a theme.


## For Him dark palette update — 2026-09-24

For Him now uses the existing burgundy/red palette for the page, navigation, banner copy, collection intro and translucent product panels, with cream copy and gold accents. The collection modifier follows the resolved banner variant, including a merchant-selected For Him collection. Product photography remains unfiltered; For Her and other routes retain their light palette. Opaque burgundy fallback styles support reduced transparency and increased contrast.

Fresh validation for this color update: 40 theme syntax/schema files, 16 rendered routes, 10 banner assertions and 7 homepage assertions passed. Native-browser checks at 1440×900 and 390×844 showed no horizontal overflow on For Him; desktop and mobile fragrance panels were visually reviewed. The mobile For Her page still resolves to cream background/wine copy with no overflow. No commerce logic changed. No live Shopify upload or publish was performed.

## Priority price verification — 24 September 2026

After updating the local mock catalog to **79900 cents (₱799)** for all six priority scents, a fresh build, commerce checks and scent-quiz checks passed. Every generated product detail page and mock cart displays ₱799. Existing availability flags remain false; product pages show Sold out and purchasing remains disabled. The preview notice identifies approved pricing and pending stock confirmation. Zero-price and sold-out guard fixtures remain covered. Actual Shopify pricing and inventory remain catalog data. The additional Rtulle handle fix updates quiz/priority-section fallbacks and scent recognition to support the verified `rtulle-satin` URL while preserving the legacy alias and saved picker setting.

The Rtulle handle regression check verifies actual-handle preference, legacy-only fallback, preserved bundled image and explicit merchant-picker precedence. Generated For Him links and the Rtulle quiz result resolve to `/products/rtulle-satin`.

Additional handle QA passed for all four combinations of configured canonical/legacy Rtulle priority-block handles and canonical/legacy catalog records, both scent-row aliases, the generated canonical collection link, and preservation of the bundled photograph.

## Product connections — 24 September 2026

The saved static Scent Finder section binds all six pickers to the live product handles. Collection settings bind For Her and For Him. The preview renderer resolves Shopify product/collection pickers and loads saved static section settings, so this configuration is covered by the actual rendered homepage. All 32 quiz checks and 27 commerce checks pass, including all six canonical detail links, both collection destinations, missing-product behavior, aliases, merchant overrides and sold-out commerce. No inventory mutation is part of this package.
