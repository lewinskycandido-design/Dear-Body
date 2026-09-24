# Collection Orders update

Historical release. Superseded by the published [Same-page COD Orders update](UPDATE-COD-ORDERS.md), theme **167085703233**. The figures and checks below describe this earlier release.

Release archive: `DearBody-Theme-Update-Collection-Orders.zip`. **DearBody Collection Orders Update**, theme **167083900993**, is now published on [dearbody.ph](https://dearbody.ph), confirmed through Shopify CLI. Theme `167083278401` remains available for rollback. The archive is saved in the project and Downloads: **273 native files**, **39,789,401 bytes**, SHA-256 `65a2e8c3b8db753dd4936d01ab7bb9fb90c4ff9cb120e944cca3ca58fa7cab45`. The release owner verified every source file and ZIP CRC; see [the package manifest](qa/package-manifest.json).

Customers can start an order directly from the **Women** or **Men** collection. Each product card has an **Order** button. Selecting a scent opens one shared order panel below that card's row, showing the chosen fragrances, delivery-address fields, shipping estimate and **Check out**.

- The opposite-collection selector lets customers mix women's and men's fragrances in the same order without leaving the page. Each selected native variant contributes one item; repeated selection of that variant does not duplicate it. A Remove control can take it out of the selection.
- The panel moves as the customer selects other cards; it keeps the same address fields and entered values. Selections stay in memory for the current page and are not written to browser storage. Filter, sort and page navigation remain native GET operations with a fresh selection after navigation.
- The estimate sums native selling prices. Philippine shipping is **₱80 for one item** and **free for two or more items**, backed by the store's existing native quantity-based automatic discount. Checkout confirms the final amount, address and payment. Cash on Delivery remains available.
- **Check out** sends the chosen variant IDs and documented address fields to native Shopify checkout. No order is placed by the theme. The form has no quantity selector or bag step. Empty or unavailable selections cannot start checkout.
- Ordering controls are scoped to Women and Men. Product-page direct checkout and its optional second scent remain intact. Finder, Search and Shop all cards retain their product-page links. If the collection enhancement cannot initialize, its fallback links still lead to the product page.

All six native fragrances were available at **₱799** in the read-only snapshot refreshed **24 September 2026 at 09:58:18 UTC / 17:58:18 Philippine time**. Earlier sold-out preview fixtures were stale. See [availability evidence](qa/COLLECTION-AVAILABILITY-SNAPSHOT.json); current Shopify availability remains authoritative.

## Verification

Browser checks on this theme before publication confirmed **Mistened Narcissus + Oud Mirage** reaching native Shopify checkout as two items, with **₱1,598 total, free shipping and COD**, and the fictional Theme Preview address prefilled. Testing stopped before **Complete order**. The Men-page **Oud Mirage + Amber Oud Silk** selection showed **₱1,598 and Free** in one inline order form; that second combination was a storefront UI check.

The 390px Dark-mode form was visually inspected and readable, with `innerWidth = scrollWidth = 390` and a 346px order panel. Local interactions preserved the address through additions, removal and resizing. Three scents totalled ₱2,397; removing Amber returned the total to ₱1,598; selecting Mistened again did not duplicate it. These release-owner observations are recorded with their scope in [browser QA](qa/COLLECTION-ORDER-BROWSER-QA.json). No order was completed.

Current local interaction evidence is recorded in [collection-order QA](qa/COLLECTION-ORDER-QA.json). The final [read-only public audit](qa/collection-orders-live-audit.json) **passed with zero findings** on live main theme **167083900993**: 18 routes, six product pages, both collection-order pages, 100 artworks, 72 thumbnails, two fonts, 177 observed asset responses and all five current script sources. All **174 locked asset comparisons** passed. The audit submitted no forms and placed no orders. After leaving preview mode, the release owner also checked the public Men page: three Order buttons and the opposite Women selector were present.

Repeat the read-only public check with `python3 qa/collection-orders-live-audit.py --theme-id 167083900993`. It extends the existing 18-route audit with both collection forms, six native catalog records cross-checked against PDP prices and stock, three opposite-collection choices per page, separate filter forms, no ordering controls leaking into Finder/Search/PDP, and the current collection script/source map. It also retains all 174 asset checks. Results are written to `qa/collection-orders-live-audit.json`; the checker does not submit forms, visit checkout permalinks or create orders.

The [collection template baseline](qa/COLLECTION-TEMPLATE-BASELINE.json) records generic headings on both live collection routes and the same template section ID. This is consistent with the shared default template; public HTML did not expose the exact template suffix. The new feature is enabled by the two native collection handles, so it does not depend on assigning the optional women/men template suffixes.

Use `python3 qa/package-theme.py --validate-only` to validate locked artwork and fonts without creating a ZIP. The current [package manifest](qa/package-manifest.json) describes the completed Collection Orders archive above. Rebuilding an archive does not publish a Shopify theme.
