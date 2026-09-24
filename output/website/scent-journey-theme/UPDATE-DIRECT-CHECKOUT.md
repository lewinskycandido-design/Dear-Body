# Direct checkout update

Historical release. Superseded by the published [Same-page COD Orders update](UPDATE-COD-ORDERS.md), theme **167085703233**. The figures and checks below describe this earlier release.

Release filename: `DearBody-Theme-Update-Direct-Checkout.zip`.

Published on 24 September 2026 to [dearbody.ph](https://dearbody.ph): theme **167083311169**, **DearBody Direct Checkout Update**, using the installed authenticated Shopify CLI. The archive contains **270 files**, is **39,780,845 bytes**, and has SHA-256 `3309b5fa12d9f1aa73d94f3677a6934b4021727169160f8a884263db050e97ea`. Copies are saved in this project and Downloads.

The primary purchase flow now starts on the product page. Customers enter their Philippine shipping address and select **Check out** to continue to secure Shopify checkout. The header bag entry, Add to bag action and quantity selector are removed from this flow; Shopify's native cart route remains a fallback.

- An optional second-fragrance selector adds one available scent to the order. The estimate updates for one or two items: **₱80 shipping for one item; free shipping for two items in the Philippines**. The two-item offer is backed by the confirmed native automatic shipping discount. Checkout confirms the final address, shipping, discounts and payment. Cash on Delivery is available at checkout.
- Product selection and sold-out states use native Shopify variants and availability. The theme does not fabricate stock, place an order, or show a false order-success state. Address fields are passed to Shopify checkout; they are not saved to browser storage by this flow.
- Reviews are display-only. Genuine approved product-specific reviews, native review data or a connected review app can supply content. Products without review data show **No reviews yet**; there are no seeded reviews or public review-submission controls.
- Buttons and decorative icons use the current cream, scarlet, cobalt and lemon visual theme. Scent Finder answer cards advance automatically, preserve Back/Start again behavior, and present one relevant fragrance after the last answer.
- The generated gallery frame decorates the existing photographs. All 72 owner-selected gallery images and 72 thumbnails remain unchanged; zoom opens the original image. Gallery order remains **1, 11, 12, 8, 9, 5, 6, 7, 2, 3, 4, 10**. The existing eight-second rotation pauses after manual interaction, with no Play/Pause button.

## Verification and packaging

Native Shopify checkout was checked on this uploaded theme before publication using a fictional Theme Preview address. First/last name, street, city, province, postal code and Philippines prefilled correctly. One Oud Mirage showed **₱80 shipping and ₱879 total**; Oud Mirage plus Amber Oud Silk showed **free shipping and ₱1,598 total**, with the automatic discount visible. Cash on Delivery was visible in both cases. Testing stopped before **Complete order**; no order was placed and no real contact details were entered. See [Shopify checkout configuration and handoff evidence](qa/SHOPIFY-CHECKOUT-CONFIGURATION.json).

All six fragrances were **available in native Shopify at verification time**. Earlier local catalog fixtures were stale and must not be treated as current inventory; the storefront continues to use native availability.

The final [read-only public audit](qa/direct-checkout-live-audit.json) **passed with zero findings**: 18 routes, all six product pages, 100 artwork files, 72 thumbnails, two fonts, 177 observed asset responses and four current JavaScript sources. All 174 locked asset comparisons passed, and every page exposed live main theme **167083311169**. The audit checked deployed source and rendered markup without submitting forms or orders.

Additional verification is recorded in [direct-checkout QA](qa/DIRECT-CHECKOUT-QA.json), [Finder auto-advance QA](qa/FINDER-AUTO-ADVANCE-QA.json), [reviews QA](qa/PRODUCT-REVIEWS-STATIC-QA.md), [cart shipping QA](qa/CART-SHIPPING-QA.md) and [gallery frame QA](qa/GALLERY-FRAME-STATIC-QA.md). Their local/static limits remain explicit.

The [frame manifest](qa/gallery-frame-assets.json) locks both the generated 1254 × 1254 PNG and the 1200 × 1200 website JPEG. Its exact generation prompt is preserved in [frame provenance](campaign-v12-gallery-frame/README.md). The package script validates these locks alongside the existing image, thumbnail and font manifests before creating a native Shopify ZIP.

Run `python3 qa/package-theme.py --validate-only` to verify asset checksums without creating an archive or changing the package manifest. The current [package manifest](qa/package-manifest.json) records the completed archive described above. A future run of `python3 qa/package-theme.py` rebuilds that ZIP from local source; it does not publish to Shopify.
