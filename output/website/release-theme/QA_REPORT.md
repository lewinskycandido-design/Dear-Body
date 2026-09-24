# DearBody theme — local QA report

**Date:** 24 September 2026. **Status:** packaged for manual Shopify upload; merchant assets/configuration and Shopify runtime review remain before launch. No store access, login, credentials, Admin/Storefront API, upload, deployment or publishing occurred.

## Validation results

| Check | Result |
| --- | --- |
| Official Shopify CLI local Theme Check | **0 diagnostics**, exit 0; `theme-check.json` contains `[]` |
| Strict Shopify Liquid/HTML parser and JSON parse | **55 files validated** |
| Actual theme source rendered through local Shopify adapter | **19 routes**, one H1 each, unique rendered IDs and resolving bundled assets |
| Commerce regression checks | **17 passed** |
| Discovery regression checks | **18 passed** |
| JavaScript syntax | All four shipped JS files pass `node --check` |
| Browser responsive inspection | **136 route/viewport checks**: 17 routes × 8 widths; no horizontal overflow, missing H1 or broken loaded images |
| Browser console | No captured errors or warnings during responsive route inspection |
| Keyboard interaction | Mobile menu opens/closes; Escape closes it and restores summary focus. Search opens and Escape closes the disclosure. Predictive list keyboard behavior covered by commerce tests |
| Archive integrity | 79 files; ZIP CRC check passes; exactly seven native theme folders at archive root |
| Upload hygiene | No preview adapters, tests, dependencies, source screenshots, OS metadata, hidden files, environment files or credentials in ZIP |
| Integrity record | `THEME-SHA256.json` records archive size, SHA-256 and individual file checksums |

Browser widths: **375, 390, 430, 768, 1024, 1280, 1440, 1728px**. Routes covered: homepage, all-products collection, Women/Men collection templates, all six product layouts, cart, empty cart, Scent Finder, Our Story, Contact, search and 404. Desktop homepage, mobile homepage, mobile product controls and mobile Scent Finder were visually inspected. Header navigation and search were exercised in the local browser. Additional generic page render routes were parsed/inspected by the renderer.

## Functional coverage

- Homepage order: announcement/header, campaign hero, brand introduction, six launch cards, six mood blocks, Scent Finder invitation, editorial moment, optional featured collection, story invitation, newsletter, footer.
- Six launch names and supplied scent character copy are present, including **Rtulle & Satin**. No product resource handles are preselected. Unconnected cards are explicitly collection previews without fake prices or purchase buttons.
- Women/Men/Launch templates have explicit merchant assignment paths. No product gender or mood association is inferred.
- Product media/variant changes, variant URL, currency formatting, quantity minimum/increments/maximum and current-cart quantities are supported. Genuine zero prices are displayed rather than silently replaced. Unavailable/invalid variants cannot submit through enhanced controls. Native forms remain authoritative.
- Native Add to Bag, quantity update, remove, total, checkout and empty-cart markup are present. No custom checkout or commerce backend was built. A no-JavaScript variant-refresh form updates server-rendered information.
- Product cards use real media/title/price. A real product without media never receives another fragrance’s reference bottle. Multi-variant/complex-quantity products lead to option selection.
- Product optional sections render only when corresponding data exists. Product schema uses Shopify `structured_data`. Organization/breadcrumb JSON-LD, canonical, Open Graph and Twitter metadata are included. Page/collection custom SEO metadata takes precedence over defaults.
- Predictive search tests cover debounce, request cancellation, stale-response rejection, arrows/Enter/Escape, empty query and full-search fallback. Recommendations preserve localized native routes and fail quietly when unavailable.
- The quiz accepts only explicit Boolean enablement and supported merchant attributes. Tests cover the 50-product cap, duplicate removal, unsupported types, exact filtering, ties, no-match/skip behavior, independent instances, safe JSON/text, editor reloads and honest unavailable states.
- Product, generic page and reusable Apps sections declare and render app blocks. Section settings and referenced block-setting IDs were checked against schemas. Missing selected collection sections hide safely or explain setup only in Theme Editor.
- Newsletter/contact use Shopify’s native forms, validation and response rendering. Preview submission is intercepted; no email/subscription/order was sent.

## Visual and accessibility coverage

The five supplied brand colors remain dominant. Text has its own cream hero panel; the six-bottle reference image remains fully visible on desktop. Independent mobile campaign settings are available. Mobile tap targets, media controls, semantic headings, labels, focus outlines, alt controls and reduced-motion overrides are implemented.

Calculated principal text contrast ratios: burgundy/cream **11.45:1**, red/cream **6.80:1**, burgundy/gold **6.69:1**. These measurements concern those solid-color pairs, not a certification of every potential merchant-uploaded photograph or future configuration. Decorative orange remains an accent; key text is placed on readable surfaces. Screen-reader certification and a full automated accessibility audit were not performed.

## Asset audit and remaining configuration

Original standalone logo exports and licensed Cenzo Flare Bold / Helvetica Now Display files are absent. The theme uses a neutral Home link and documented development font fallback. No recreated logo ships.

The six reference card images were checked against available owner photographs for identity, name and color assignments. Existing campaign imagery consists of local generated derivatives. The prior mobile hero had a small label-print defect and was replaced with the existing checked `home-collection-v03` pair. Neither generated campaign provenance nor visual inspection certifies pixel-perfect product fidelity; final exact-product-lock campaign assets and Filipino-adult lifestyle photographs are specified in **IMAGE_BRIEFS.md**.

Before publishing, the merchant must configure original logos/fonts, approved imagery, real products/prices/variants/inventory, collections, pages, navigation, metafields, quiz/mood associations, policies, contact/social information and any apps. Supplied product copy is documented separately and is never assigned by inferred product handle.

## Limits of local validation

LiquidJS adapts Shopify forms, section groups, pagination, image filters and other Shopify-only runtime behavior for layout preview. It does not reproduce Shopify’s complete Liquid runtime, CDN transforms, inventory, customer accounts, recommendations service, payment terms, email delivery, accelerated checkout or Theme Editor sessions. No real cart, order or payment was exercised. PHP placeholders in the preview are not prices. Demo routes/IDs and all testing dependencies are outside the upload ZIP.

A merchant must preview the manually uploaded theme and complete real Shopify integration checks before publishing. This report does not claim Theme Store certification, live checkout verification, Lighthouse scores or final approval of missing brand assets.


## Revision 1.0.1 — collection routing and fixed product gallery

- Corrected the default Women/Men collection settings to the explicitly saved `womens-perfume` / `mens-perfume` handles. Header, mobile navigation, hero buttons and footer now reach the two distinct collections; active navigation is indicated.
- Restored locally documented preview membership: Women — Mojito Metallique, Amber Oud Silk, Mistened Narcissus; Men — Oud Mirage, Charme Envoûtant, Rtulle & Satin. Source: `../SHOPIFY_PRODUCT_DRAFT_PROGRESS.md`, publication table; corroborated by source facts/manifests. The project rule for this family is white perfume-name labels for women, black perfume-name labels for men (`../../../PRODUCT_LISTING_IMAGE_STRATEGY.md:294`). No current store read or invented classification was used.
- Added regression checks for correct collection products, collection-specific hero, four navigation destinations, active state and independent Shop All identity. Renderer now passes 23 master layout checks across 19 routes.
- Desktop (≥990px) product gallery and details occupy bounded columns. The whole image and thumbnail strip remain visible on the left. Only the keyboard-accessible information region scrolls on the right. Below 990px the layout stacks naturally. Without JavaScript, all media remains accessible in natural flow.
- Browser checks: 48 product viewport checks (six products × eight widths) and 16 collection viewport checks (two collections × eight widths), all passing. Widths: 375, 390, 430, 768, 1024, 1280, 1440 and 1728 CSS pixels. No horizontal overflow or incorrect desktop/mobile scroll layout was found.
- Actual right-panel wheel scroll changed detail scrollTop from 0 to 354.5px while gallery top stayed 183px and document scroll stayed 60.5px. Keyboard Page Down also reached the scrollable content. Mobile Women navigation was clicked and reached the correct three-product page.
- Commerce regression: 17 passed. Discovery regression: 18 passed. Local Theme Check: zero diagnostics. No Shopify access or deployment.
