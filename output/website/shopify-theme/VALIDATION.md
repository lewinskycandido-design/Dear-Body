# Memphis edition validation — 23 September 2026

## Result

The current local build adds photographic banners to For Her, For Him, Our Story and Contact, alongside the recreated DearBody PH wordmark and polished lifestyle images generated from raw product references. The user-installed Shopify theme `167049494593` is active, and its product template renders in the Shopify theme editor. These local changes and the blank product-link fix have not been applied to the live theme.

## Structure and code

- 55 theme source files: 40 text files, 14 JPG assets and one PNG logo.
- 37 Liquid/JSON files parsed by Shopify's official Liquid HTML parser or JSON parser. CSS/JavaScript are additional text files.
- Every JSON template/group references an existing section. Every bundled image exists. Section schemas parse and setting IDs are unique.
- The ZIP opens successfully and has Shopify folders at its root, including `layout/theme.liquid`.
- Header, footer, homepage sections, navigation-page banners and priority-product blocks are editable through Shopify section/settings schemas.
- Preview builder renders 16 routes from actual Liquid sources, including For Her / For Him collections and default-page handle mapping for story/contact. There are no substituted fallback templates.
- All 22 isolated runtime/Liquid commerce tests pass. Tests execute the actual theme JavaScript and product-card Liquid against synthetic fixtures: paid/free/sold-out/invalid variant states, merchant-formatted currency, native submission guards, media switching and video pause, keyboard menu dismissal, mixed-price cards, and missing/blank versus resolved product URLs. Missing, empty and whitespace-only URLs render non-clickable cards; a resolved product retains its image, title and detail links.
- Five targeted navigation checks passed: collection-title lookup, explicit resource settings/current-page state, stale Shop all removal while preserving merchant links, menu-based category URLs, and missing-collection guards. Both preview category pages contain exactly their three source-verified scents.

## Shopify verification

Theme `167049494593` is active. Its **Default product** template is assigned to five products. Charme Envoûtant's product detail page and ten-image gallery were verified in the Shopify theme editor.

All five catalog products remain **Draft**. The other five priority scents—Mojito Metallique, Amber Oud Silk, Mistened Narcissus, Oud Mirage and Rtulle & Satin—are absent from the catalog. These catalog dependencies explain why the six homepage cards do not expose working storefront product pages. The existing live card snippet also treats blank URLs as links; the corrected local snippet has not yet been installed in Shopify.

Existing automated collections were verified: **Women's Perfume** (`490398548033`, product tag includes `women`) and **Men's Perfume** (`490398613569`, tag includes `men`). Both have zero products and two sales channels. Verified storefront handles are `womens-perfume` and `mens-perfume`; both are preselected in the local theme package.

## Browser checks

In the earlier Memphis review, the homepage was checked at 1440px desktop, 900px tablet and 390px/320px mobile widths. The complete portrait hero is used at every size: copy sits beside the framed photo on desktop/tablet and above it on mobile. All six bottles remain visible. The header, category navigation, light/dark wordmarks and 320px layout passed earlier checks. Fresh review after replacing the raw snapshots checked the generated collection image at 1280px and both generated trio gallery images on mobile at 390px. The For Her and For Him collections lead to the correct product pages, and gallery controls reveal the corresponding new image. The 390px product page has no horizontal overflow. Gallery images in hidden panels load lazily when selected.

That earlier review also covered hero, all six final product cards, editorial section, story, newsletter, footer, mobile product page, cart and contact page. Open/close/Escape behavior of the mobile menu passed. Product media button switched the visible gallery image. The unavailable preview product and cart checkout controls were correctly disabled.

The code browser's selector/copy behavior was verified in the original build. The final code browser, theme ZIP, full source ZIP and SHA-256 manifest were regenerated after the latest edits. ZIP integrity and theme-source checksums were checked separately from the build/runtime checks above.

## Publication checks

Six exact priority names, original white/black label families and matching packaging colors are retained. Final packshots share cream backgrounds and consistent framing. Home heroes show all six fragrances. See `ASSET_QA.md` for the image audit.

The Memphis layer uses only the five approved brand color tokens for outlines, flat shadows, checker trim, waves, rings, starburst and section backgrounds. Motifs are decorative and ignored by assistive technology. A cream inner/wine outer focus ring, reduced-motion rules, 16px newsletter input and wine-on-gold story hover maintain accessible controls. The approved palette is used. Typography remains a system-font fallback until licensed brand webfonts are supplied. The new wordmark is a faithful AI recreation from page 6 of the supplied Canva playbook; the official logo master remains unavailable. No unsupported prices, stock promises or scent-note claims were added.

Three polished lifestyle assets replace the previous raw snapshots: the six-bottle home collection, a For Her vanity trio and a For Him console trio. All three generated masters and web exports were visually reviewed for readable scent names, correct light/dark label families, full bottle silhouettes and warm brand styling. Each recognized priority product receives the appropriate trio and full collection alongside its Shopify media. These additions are local theme assets and have not been uploaded to live product records. Small label monograms and glass details are AI-rendered approximations; original user photographs remain untouched as source references.

## Practical limits

The local preview uses an explicitly labeled mock catalog with unavailable/zero-price products and intercepts forms. It is not a Shopify checkout simulator. It does not send contact messages or subscriptions.

Shopify installation and product-template rendering have been verified. Authenticated checkout/payment, real inventory, storefront app integrations, customer accounts, email delivery and currency localization remain untested. Existing app customizations are not included in this standalone theme.

## Reproduce

```sh
cd preview
npm ci
npm run build
node verify-commerce.mjs
```

From the package directory, `python3 package-theme.py` regenerates both ZIPs, the source browser and SHA-256 manifest. The preview launch command is `npm run preview` from `preview/`.

Collection URLs verified in Shopify admin on 23 September 2026: `/collections/womens-perfume` (For Her) and `/collections/mens-perfume` (For Him). Both are preselected in theme settings and the local preview uses these same routes.
