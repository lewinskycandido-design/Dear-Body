# Memphis editorial revision validation — 24 September 2026

This revision implements the owner's Evah-inspired navigation and editorial page hierarchy in DearBody's Memphis UI. No theme was uploaded or published and no live catalog record was changed.

## Source and automated checks

- 66 theme files: 48 text/vector files and 18 raster assets.
- 42 Liquid/JSON files validated with Shopify's strict Liquid HTML parser or JSON parsing; all template section references resolve.
- 16 preview routes rendered from actual Liquid, including six product pages, both category collections, generic-page mapping, cart and contact.
- 10 page-banner checks: one associated H1, correct DearBody asset/dimensions/alt text, breadcrumbs, collection/merchant overrides and native contact form.
- 5 lifestyle-homepage checks: prioritized spray photograph, no former product grid, three distinct lifestyle photos, editable photo/copy settings, access to all six live product-detail paths through the two collection pages.
- 22 existing commerce checks unchanged: paid/free/sold-out/unknown variants, merchant currency, native form guards, gallery, menu keyboard/outside dismissal, mixed card prices and blank product URLs.
- 30 quiz checks: all six reachable scents, preference filtering/ties, validation/back/reset, actual catalog URLs, unsafe URL handling, missing/unpublished products, merchant pickers and approved scent descriptions.
- 18 new editorial checks: exact requested six-label menu/cart icon; homepage category routes/finder and both logos; actual category products rendered as editorial rows; positive-price calculation and From logic; free/mixed/sold-out states; blank URLs; custom handles; merchant notes; and mobile menu → quiz → visible summary focus restoration using both real theme scripts together.
- All hex colors in theme CSS/SVG belong to the five approved DearBody colors. Product photography retains its original packaging colors.

The tests use local LiquidJS/JSDOM with synthetic isolated variants, no network loads or submitted orders. They do not establish native browser geometry or modal behavior. Product variants in the local storefront use the owner-approved ₱799 price and remain unavailable pending inventory confirmation.

## Structure and content

For Her / For Him use live collection products, an introduction and alternating fullwidth 50/50 editorial rows, with pagination preserved. Positive-price available products link to the product page for selection/purchase. The rows do not add a guessed variant directly to the cart. Unknown products keep merchant title/image/description; verified priority descriptions come from the source ledger. Notes require the merchant's custom.scent_notes metafield. No Evah copy, imagery, reviews or pricing is included.

Homepage photographs now replace the prior collection grid. Fullwidth banners and lifestyle routes lead to the category pages; the six-page product template, gallery, cart and Shopify forms remain present. Both logo reproductions can be replaced in theme settings; see LOGO-SOURCE.md.

## Browser and deployment limits

Fresh browser review was completed by the parent task on the current preview:

- At a measured 1440×900 CSS viewport, the final homepage hero shows the perfume bottle, visible mist, complete headline and both CTAs, with no horizontal page overflow.
- Desktop For Him renders the three correct fragrances in alternating editorial rows. The second row was visually confirmed with its photo on the left and copy on the right.
- Clicking the Oud Mirage detail link reached `/products/oud-mirage` and displayed the correct product H1.
- At a measured 467px CSS viewport, both category banners span the viewport. Neither category page has horizontal overflow or completed broken images.
- The mobile menu's Scent Finder opens the native dialog. Escape closes it and restores focus to the visible Menu summary.

These are current sampled browser checks, separate from earlier designs and the automated DOM checks. They do not establish behavior at every viewport or in every browser.

Live Shopify checkout/payment, product channel visibility, currency localization, inventory, app integrations and mail delivery remain unverified for this revision. The preview intercepts every form and sends no orders, subscriptions or contact messages. Archive integrity and content hashes are checked during packaging; the theme has not been uploaded.

## Reproduce

From preview/: `npm run build`, `node verify-commerce.mjs`, `node verify-quiz.mjs`, `node verify-editorial.mjs`.

Then from the package directory: `python3 package-theme.py`. This creates the Shopify ZIP, complete source ZIP, copy-code viewer and THEME-SHA256.json manifest from the same current files.

## Priority price verification — 24 September 2026

After updating the local mock catalog to **79900 cents (₱799)** for all six priority scents, a fresh build, commerce checks and scent-quiz checks passed. Every generated product detail page and mock cart displays ₱799. Existing availability flags remain false; product pages show Sold out and purchasing remains disabled. The preview notice identifies approved pricing and pending stock confirmation. Zero-price and sold-out guard fixtures remain covered. Actual Shopify pricing and inventory remain catalog data. The additional Rtulle handle fix updates quiz/priority-section fallbacks and scent recognition to support the verified `rtulle-satin` URL while preserving the legacy alias and saved picker setting.

The Rtulle handle regression check verifies actual-handle preference, legacy-only fallback, preserved bundled image and explicit merchant-picker precedence. Generated For Him links and the Rtulle quiz result resolve to `/products/rtulle-satin`.

Additional handle QA passed for all four combinations of configured canonical/legacy Rtulle priority-block handles and canonical/legacy catalog records, both scent-row aliases, the generated canonical collection link, and preservation of the bundled photograph.

## Product connections — 24 September 2026

The saved static Scent Finder section binds all six pickers to the live product handles. Collection settings bind For Her and For Him. The preview renderer resolves Shopify product/collection pickers and loads saved static section settings, so this configuration is covered by the actual rendered homepage. A dedicated quiz assertion verifies all six canonical detail links and both collection destinations; the existing missing-product, alias, merchant-override and sold-out commerce checks continue to pass. No inventory mutation is part of this package.
