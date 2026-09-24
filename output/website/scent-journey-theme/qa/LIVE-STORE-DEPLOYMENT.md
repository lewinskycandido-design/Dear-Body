# Live Shopify update — 24 September 2026

## Current release: Same-page COD Orders

Shopify CLI and independent public requests confirm **DearBody COD Order Update**, theme **167085703233**, is live on [dearbody.ph](https://dearbody.ph). The preceding theme **167085146177** is retained for rollback. The current [public-store audit](cod-live-audit.json) passed with zero findings; earlier audit results below describe their historical themes.

The archive **DearBody-Theme-Update-COD-Orders.zip** is saved in the project and Downloads: **275 native files**, **39,797,927 bytes**, SHA-256 `e0cf3d65f6e59a306d5d1cf3d83a2c8db2ba8f4edb921883b43f7215dc1827ce`. All source-asset locks passed. The release owner verified the Downloads copy against this size and checksum. [Current release note](../UPDATE-COD-ORDERS.md).

The cookie-free public audit verified **18 routes**, six PDP COD contracts, two collection forms and all eight ordering-instruction blocks. All **174 locked asset comparisons** and **seven current theme script sources** matched; **179 observed asset responses** were checked. EasySell embed references appeared on all 18 pages, and four observed vendor scripts passed HEAD availability checks. The audit had **zero findings** and made no form submissions, checkout requests, cart mutations or order changes. Runtime popup and order-saving behavior are covered by the separate browser evidence below.

The authorized pre-publication test **#1001** saved Oud Mirage ×2 plus Amber Oud Silk ×1 with exact native lines, subtotal **₱2,397**, **Free shipping** and COD pending. EasySell displayed **Order placed** while the URL remained `/products/oud-mirage`. The order was then **Canceled, Voided and Archived**, all three bottles were restocked, and customer notification was unchecked. Women at 390px and Men at 320px retained all three cards above the form with no horizontal overflow; popup totals were ₱879 for one bottle and ₱1,598 with free shipping for two mixed scents. [Browser evidence](COD-ORDERS-BROWSER-QA.json) contains no customer contact, address, IP or cart token.

All **294 local checks** passed: cart preparation 50, popup adapter 17, PDP handoff 45, collection handoff 82, and PDP fallback static checks 100. EasySell's approved Free plan allows 60 orders/month; usage was observed at **1/60** after the test. All four paid SMS/WhatsApp services were rechecked **Deactivated**. Same-page confirmation is an external app setting, not theme-ZIP data. The local preview cannot place orders.

## Previous Order Quantities release — historical record

[dearbody.ph](https://dearbody.ph) previously served **DearBody Order Quantities Update**, main theme **167085146177**, confirmed at that checkpoint by Shopify CLI and independent public requests. That archive, `DearBody-Theme-Update-Order-Quantities.zip`, is saved in the project and Downloads: **273 native files**, **39,793,842 bytes**, SHA-256 `f6e6f16d54e59a7595643e98db3960cb362c2aa3ed0fee1b5021fec2654da8c5`. Its Downloads copy was independently read and matched that archive size and checksum. The [package manifest](package-manifest.json) now records the latest release.

Collection-selected lines and PDP main/optional-second scents now support editable native-rule-aware quantities. Initial actions say **Add to order**; the final submit remains **Check out**. The Philippine shipping estimate counts total units: ₱80 for one item, free for two or more, including multiple bottles of the same scent. **How to order** appears above the Women/Men grids and below the initial button on all six PDPs. [Release note](../UPDATE-ORDER-QUANTITIES.md).

Before publication, the release owner verified native Shopify checkout for **Oud Mirage ×2: ₱1,598, Free shipping and COD**, with the fictional Theme Preview address prefilled. A mixed collection order of **Mistened Narcissus ×2 plus Oud Mirage ×1** reached native checkout with those exact quantities, **₱2,397, Free shipping and COD**. Testing stopped before Complete order; no order was completed. Collection controls fit a 320px viewport with `scrollWidth = 320` and a 134px quantity-control group. The PDP was inspected as readable with no horizontal overflow, and collection quantity 0 blocked checkout. [Attributed browser evidence](ORDER-QUANTITIES-BROWSER-QA.json).

The final read-only [public audit](order-quantities-live-audit.json) **passed with zero findings** on main theme **167085146177**: 18 routes, six PDP quantity forms, both collection-order forms and all eight ordering-instruction blocks in their intended positions. All **174 locked asset comparisons** passed: 100 artworks, 72 thumbnails and two fonts. The audit checked 177 observed asset responses and matched all five current script sources. It used no cookies or preview parameters and did not submit forms or request checkout permalinks. Local regressions passed 72 collection checks, 69 PDP runtime checks, 100 native PDP form fixtures and 112 gallery checks.

That historical release opened native Shopify checkout. It did not implement same-page order saving; the current COD update above supersedes its purchase flow.

## Previous Collection Orders release — historical record

[dearbody.ph](https://dearbody.ph) previously served **DearBody Collection Orders Update**, theme **167083900993**, confirmed at that checkpoint by the release owner through Shopify CLI. Theme **167083278401** was retained for rollback. That archive, `DearBody-Theme-Update-Collection-Orders.zip`, was saved in the project and Downloads: **273 native files**, **39,789,401 bytes**, SHA-256 `65a2e8c3b8db753dd4936d01ab7bb9fb90c4ff9cb120e944cca3ca58fa7cab45`. The release owner verified all 273 native source files and ZIP CRC. The package manifest now records the latest archive above.

Women and Men have scoped Order controls, one shared selection/address form and an opposite-collection selector for mixed orders. Each selected native variant contributes one item. Existing PDP checkout, Finder, Search, native filters and product-page fallbacks remain separate. See [release notes](../UPDATE-COLLECTION-ORDERS.md).

Before publication, Mistened Narcissus plus Oud Mirage reached native Shopify checkout as two items: **₱1,598 total, Free shipping and COD**, with the fictional Theme Preview address prefilled. Testing stopped before **Complete order**; no order was completed. Men-page Oud Mirage plus Amber Oud Silk showed the same total and free shipping in one storefront form. The 390px Dark form had `innerWidth = scrollWidth = 390` and panel width 346px; it was visually inspected as readable. Local address persistence, removal and duplicate prevention were also checked. [Browser evidence](COLLECTION-ORDER-BROWSER-QA.json) distinguishes these scopes.

The final read-only [public audit](collection-orders-live-audit.json) **passed with zero findings** on main theme **167083900993**: 18 routes, six product pages, both collection-order pages, 100 artworks, 72 thumbnails, two fonts, 177 observed asset responses and all five current script sources. All **174 locked asset comparisons** passed. No forms or checkout permalinks were submitted/requested. After leaving preview mode, the release owner also inspected the public Men page and confirmed three Order buttons with the opposite Women selector.

## Previous Direct Checkout release — historical record

The earlier Direct Checkout release was published as theme **167083311169**, **DearBody Direct Checkout Update**, through the installed authenticated Shopify CLI. Public requests confirmed its `main` role at that checkpoint. A later active copy, theme **167083278401**, is now retained as the rollback theme for Collection Orders.

The primary flow uses the product-page shipping-address form and **Check out**, with an optional second fragrance. The header bag entry and quantity selector are removed; Shopify's native cart remains a fallback. Reviews are display-only with honest empty states, and Scent Finder advances after each answer. See [release notes](../UPDATE-DIRECT-CHECKOUT.md).

The final [public audit](direct-checkout-live-audit.json) passed with **zero findings**: 18 routes, six product pages, 100 artworks, 72 thumbnails, two fonts, 177 observed asset responses and four current JavaScript sources. All **174 locked asset comparisons** passed. JavaScript was checked against current local source, using the observed CDN source map where needed.

All six fragrances were **available in native Shopify at verification time**. Earlier local catalog fixtures were stale and do not represent current inventory. Native availability remains authoritative.

The uploaded theme's native checkout was tested before publication with a fictional Theme Preview address. First/last name, street, city, province, postal code and Philippines prefilled correctly. One Oud Mirage showed **₱80 shipping and ₱879 total**. Oud Mirage plus Amber Oud Silk showed **free shipping and ₱1,598 total**, with the native automatic discount visible. Cash on Delivery was visible for both. Testing stopped before **Complete order**: no order was placed and no real contact details were entered. [Configuration and handoff evidence](SHOPIFY-CHECKOUT-CONFIGURATION.json) records the active two-item Philippine free-shipping discount, ₱80 base rate, removed price threshold and COD setup.

`DearBody-Theme-Update-Direct-Checkout.zip` is saved in the project and Downloads: **270 files**, **39,780,845 bytes**, SHA-256 **3309b5fa12d9f1aa73d94f3677a6934b4021727169160f8a884263db050e97ea**. The [package manifest](package-manifest.json) records its contents. Documentation updates did not rebuild the archive or change the published theme.

## Previous navigation release — historical record

The previous public theme was **167080427585**, `dearbody-theme-update-shopify-navigation`. The checks below describe that earlier release, not the current checkout implementation or inventory.

## Repairs

The ZIP contained page templates, but the store had no corresponding Page resources. A theme upload does not create those resources. The following visible native pages now have matching handles and assigned template suffixes:

| Page | Handle / template suffix | Shopify page ID |
| --- | --- | --- |
| Our Story | `our-story` | `164912136257` |
| Scent Finder | `scent-finder` | `164912201793` |
| FAQ | `faq` | `164912267329` |
| Shipping | `shipping` | `164912300097` |
| Contact | `contact` | `164912398401` |

Their body fields are intentionally empty because native theme sections provide the content. Header, footer and collection links now consistently resolve native routes and preserve localized storefront roots. The footer links to the store's populated native Privacy policy and omits unavailable Terms/empty legal pages. No legal text was invented or changed.

The bag refresh also required a correction. Sending `Accept: application/json` to a page-based Section Rendering request caused Shopify to return the page resource instead of cart-drawer HTML. The section fetch now uses the default Accept header and retains page query context. `/cart.js` still requests JSON. The fix is saved in the live theme and local source.

## Verification

- Public audit: **17 routes, all 99 artworks, 174 image URLs and two font URLs passed**, with zero findings. All six products have their twelve gallery frames in the requested order. Native Finder data includes all six profiles.
- The delivered commerce script is minified by Shopify CDN. Its public source map contains the exact approved local source: SHA-256 `be3994b72537d01185348803912dad55325563fb199a687b7c86974fc1cc6ce6`. This proves the saved correction is deployed despite different delivered JS bytes.
- Both observed cart section endpoints return nonempty drawer HTML. The corrected empty bag opened without an error on the public Scent Finder and product detail pages.
- Public UI: desktop navigation opened Women, a product, Our Story, FAQ and Scent Finder. The five-question women's quiz returned exactly one result, **Mistened Narcissus**. Product gallery thumbnail selection changed the displayed image/counter to 2 of 12. Light/dark switching worked and was restored to Light. The shipping FAQ expanded to show the supplied delivery times and free-shipping rule. No browser warning/error logs were recorded in the final interaction check.
- Earlier uploaded-theme UI checks: mobile navigation at 390×844, Men collection, predictive product search and the men's five-question quiz passed. The men's quiz returned exactly one result, **Oud Mirage**. The temporary viewport override was reset.
- Local regression checks: 19 native navigation/conditional-policy fixtures, 22 cart-section-refresh checks and 35 existing commerce checks passed. Theme Check returned zero findings; JavaScript syntax passed.

Evidence: [public audit](live-store-verification.json), [draft audit](shopify-draft-verification.json), [public theme observation](live-theme-observation.json), [native navigation checks](NATIVE-NAVIGATION-QA.json), [cart refresh checks](CART-SECTION-REFRESH-QA.json), [Theme Check](theme-check-store-navigation.json).

## Backup archive

`DearBody-Theme-Update-Shopify-Navigation.zip` contains 258 native theme files, including the live cart correction. It is saved in this project and `/Users/wetrade/Downloads/`.

- Size: **39,548,431 bytes**
- SHA-256: **acdb575ac7248efa0f9418c756cf43a8bce55268b0ff03214da3d55d6812769b**
- The project and Downloads archive hashes match.

## Earlier verification limits

At that earlier checkpoint, the fixtures and audit reported sold-out fragrances, and checkout was not verified. That limitation is superseded by the current native availability and checkout evidence above. No order was placed during either verification. A theme ZIP alone does not configure Shopify shipping rates; the current store's native shipping and COD settings are recorded separately above.

Future installation on another store still requires native page resources and the appropriate collection handles; those resources are not included in a Shopify theme ZIP.
