# DearBody Vaporwave — Validation

Revision: 24 September 2026. This report covers the separate fourth Vaporwave edition. Earlier Bauhaus or Glass visual checks are not treated as validation of this design.

## Fresh validation

Fresh runs of `npm run build`, `node verify-commerce.mjs` and `node verify-quiz.mjs` passed against the Vaporwave edition's actual source:

| Check | Result |
|---|---|
| Liquid syntax and JSON/schema files | 41 validated |
| Actual-Liquid preview routes | 16 rendered |
| Page-banner assertions | 10 passed |
| Lifestyle-homepage assertions | 5 passed |
| Editorial layout and commerce assertions | 8 passed |
| Commerce assertions | 22 passed |
| Scent-quiz assertions | 31 passed |

Editorial assertions check the six-link navigation, both logo structures, category rows, merchant copy, actual prices and product destinations. Commerce assertions check variant pricing and availability, guarded native form submission, gallery selection, mobile-menu dismissal and unresolved product URLs. Quiz assertions cover the six recommendations, collection filters, ties, required answers, Back/reset/reopen, merchant product mappings and absent/unsafe URLs. The mobile-menu test verifies that the quiz returns focus to the visible Menu summary.

No network resources loaded or forms submitted during these automated checks. The generated report is `preview/public/preview-report.json`.

## Sampled browser review

The final local Vaporwave preview was reviewed in the Codex in-app browser:

- At 1440 × 900 CSS pixels, the homepage hero and lifestyle scenes were visually reviewed. The For Her product rows used alternating 720-pixel photograph/copy columns.
- At 1280 × 720 CSS pixels, the laptop layout had no horizontal document overflow.
- At 390 CSS pixels wide, product detail and cart pages had no horizontal document overflow. The product page was visually reviewed.
- At 320 CSS pixels wide, home, header, For Him, story and contact pages had no horizontal document overflow. Destination banners spanned the full 320-pixel viewport; the primary header logo rendered at 136 pixels wide. Home, collection and contact screenshots were reviewed.
- Mobile Menu → Scent Finder opened the quiz. All six → Rose → Dark & smoky returned Oud Mirage. Escape closed it and restored focus to the visible Menu summary. The mobile quiz was visually reviewed.
- A product image link reached the Mojito Metallique detail page; the cart icon reached the cart page.

These are sampled browser checks, not exhaustive coverage of all screen sizes, merchant content or Shopify services. The local preview does not perform transactions.

## Package verification

Both Vaporwave archives passed ZIP integrity checks. All **65 theme files** match their editable source bytes, Shopify ZIP entries and `THEME-SHA256.json` hashes. The portable source archive contains those files and **18 support files**, each compared byte for byte with local source.

All **47 text-file entries** in the copy-code source payload match the theme source. Locally served ZIP copies and `START-HERE.md` match their packaged originals. The package contains both logo variants and `assets/dearbody-vaporwave.css`; it does not include the Bauhaus stylesheet. No `node_modules` or local preview output is placed in the portable source ZIP.

No live Shopify upload or publication was performed.

## Reproduce

From `preview/`:

```sh
npm ci
npm run build
node verify-commerce.mjs
node verify-quiz.mjs
npm run preview
```

Preview: `http://127.0.0.1:4176`. After the build, run `python3 package-theme.py` from the package root. It creates both Vaporwave ZIPs, `COPY-PASTE-CODE.html` and `THEME-SHA256.json`. Packaging follows building because the build recreates `preview/public`.

## Scope

The renderer parses Liquid with Shopify's parser and renders actual source with a synthetic catalog. The preview adapter approximates Shopify-specific form, section and pagination objects. It does not emulate real inventory, image-CDN resizing, customer sessions, payment processing or email delivery. Local forms are intercepted; checks cannot establish a live Shopify checkout or complete Shopify runtime behavior.

The retained photographs include generated representations. Both bundled logos are recreations from the supplied playbook, not original masters; see `LOGO-SOURCE.md`. Merchant replacement content requires its own visual and product-fidelity review. This theme has not been uploaded to Shopify or published.

## Priority price verification — 24 September 2026

After updating the local mock catalog to **79900 cents (₱799)** for all six priority scents, a fresh build, commerce checks and scent-quiz checks passed. Every generated product detail page and mock cart displays ₱799. Existing availability flags remain false; product pages show Sold out and purchasing remains disabled. The preview notice identifies approved pricing and pending stock confirmation. Zero-price and sold-out guard fixtures remain covered. Actual Shopify pricing and inventory remain catalog data. The additional Rtulle handle fix updates quiz/priority-section fallbacks and scent recognition to support the verified `rtulle-satin` URL while preserving the legacy alias and saved picker setting.

The Rtulle handle regression check verifies actual-handle preference, legacy-only fallback, preserved bundled image and explicit merchant-picker precedence. Generated For Him links and the Rtulle quiz result resolve to `/products/rtulle-satin`.

Additional handle QA passed for all four combinations of configured canonical/legacy Rtulle priority-block handles and canonical/legacy catalog records, both scent-row aliases, the generated canonical collection link, and preservation of the bundled photograph.

## Product connections — 24 September 2026

The saved static Scent Finder section binds all six pickers to the live product handles. Collection settings bind For Her and For Him. The preview renderer resolves Shopify product/collection pickers and loads saved static section settings, so this configuration is covered by the actual rendered homepage. A dedicated quiz assertion verifies all six canonical detail links and both collection destinations; the existing missing-product, alias, merchant-override and sold-out commerce checks continue to pass. No inventory mutation is part of this package.
