# DearBody Bauhaus — Validation

Current revision: 24 September 2026. The Evah-inspired shopping layout is being applied to Memphis, Liquid Glass and Bauhaus as separate theme packages. This report covers the Bauhaus edition only.

## Fresh build and functional results

A fresh run of `npm run build`, `node verify-commerce.mjs` and `node verify-quiz.mjs` passed for the revised navigation, homepage and collection layout:

| Check | Result |
| --- | --- |
| Liquid syntax and JSON/schema files | 41 validated |
| Actual-Liquid preview routes | 16 rendered |
| Page-banner assertions | 10 passed |
| Lifestyle-homepage assertions | 5 passed |
| Editorial-layout assertions | 8 passed |
| Commerce assertions | 22 passed |
| Scent-quiz assertions | 31 passed |

The renderer parses Liquid with Shopify's parser and renders the actual theme source. Editorial checks cover the revised navigation and live collection rows. Commerce checks cover variant price and availability, guarded submission for unpriced/unknown/sold-out products, native product forms, gallery changes, product-card links and mobile-menu dismissal. Quiz checks cover all six recommendations, preferences, Back/reset, invalid answers, ties, merchant product-picker overrides and missing/unsafe product URLs. The current renderer report is `preview/public/preview-report.json`.

## Browser review

The revised local preview was reviewed in the Codex in-app browser. These are the checks performed on this revision, not carried-over results from the earlier design:

- At a measured 1440 × 900 CSS viewport, the final homepage hero displayed the full perfume bottle and visible mist, its heading and both calls to action within the viewport, without horizontal document overflow. The hero height uses a 540–740-pixel clamp.
- At 1280 CSS pixels wide, the For Her introduction and fragrance rows spanned the viewport, and all three named fragrances appeared. The first row's photograph and copy were visually reviewed.
- At 467 CSS pixels wide, the homepage and both gender collection pages had no horizontal document overflow. Both category banners spanned the viewport and completed images had no broken sources.
- From the native mobile menu, Scent Finder opened the quiz. All six → Rose → Dark & smoky returned Oud Mirage with the correct product destination. Escape closed the quiz and returned focus to the Menu summary.
- Primary and secondary logo structures rendered in the homepage/footer branding.

This browser pass does not claim full-site visual coverage, every device size or a live Shopify checkout test. The automated route and commerce checks above provide broader structural and interaction coverage within the local preview's stated limits.

## Package verification

Both updated ZIP archives passed integrity checks. All **65 theme files** match their source bytes, Shopify ZIP entries and `THEME-SHA256.json` hashes. The editable-source archive contains those theme files and **18 support files**, each compared byte for byte with the local source. Its support files include `REFERENCE-LAYOUT.md`.

All **47 text-file entries** in the standalone and locally served copy-code viewers match the theme source. The locally served archive copies and setup guide match their packaged originals. Both bundled logo forms and the Bauhaus stylesheet are included; the Glass stylesheet is absent from this edition.

## Reproduce

From `preview/`:

```sh
npm ci
npm run build
node verify-commerce.mjs
node verify-quiz.mjs
npm run preview
```

Preview: `http://127.0.0.1:4175`.

After building, run `python3 package-theme.py` from the package root. It produces `DearBody-Bauhaus-Shopify-Theme.zip`, `DearBody-Bauhaus-Website-Source.zip` and `COPY-PASTE-CODE.html`. Packaging must follow the preview build because the build recreates `preview/public`.

## Scope and limits

The preview catalog is synthetic and does not inspect current Shopify product data. Local forms are intercepted; no orders, contact messages or subscriptions were sent. The preview adapter approximates Shopify-specific form/section objects and does not emulate image-CDN resizing, payment processing, real inventory, account sessions or email delivery. These checks do not establish complete Shopify runtime behavior or Theme Store compliance. Test against real catalog data in an unpublished Shopify draft before publishing.

The retained photographs include generated representations. The bundled primary and secondary logos are recreations from the supplied playbook, not original master artwork; see `LOGO-SOURCE.md`. Merchant replacement media and content need their own crop, readability and product-fidelity review.

This Bauhaus theme has not been uploaded to Shopify or published.

## Priority price verification — 24 September 2026

After updating the local mock catalog to **79900 cents (₱799)** for all six priority scents, a fresh build, commerce checks and scent-quiz checks passed. Every generated product detail page and mock cart displays ₱799. Existing availability flags remain false; product pages show Sold out and purchasing remains disabled. The preview notice identifies approved pricing and pending stock confirmation. Zero-price and sold-out guard fixtures remain covered. Actual Shopify pricing and inventory remain catalog data. The additional Rtulle handle fix updates quiz/priority-section fallbacks and scent recognition to support the verified `rtulle-satin` URL while preserving the legacy alias and saved picker setting.

The Rtulle handle regression check verifies actual-handle preference, legacy-only fallback, preserved bundled image and explicit merchant-picker precedence. Generated For Him links and the Rtulle quiz result resolve to `/products/rtulle-satin`.

Additional handle QA passed for all four combinations of configured canonical/legacy Rtulle priority-block handles and canonical/legacy catalog records, both scent-row aliases, the generated canonical collection link, and preservation of the bundled photograph.

## Product connections — 24 September 2026

The saved static Scent Finder section binds all six pickers to the live product handles. Collection settings bind For Her and For Him. The preview renderer resolves Shopify product/collection pickers and loads saved static section settings, so this configuration is covered by the actual rendered homepage. A dedicated quiz assertion verifies all six canonical detail links and both collection destinations; the existing missing-product, alias, merchant-override and sold-out commerce checks continue to pass. No inventory mutation is part of this package.
