# Free shipping and 20% offer update — PASS

Date: 24 September 2026. Scope: the local native Shopify theme, preview and upload ZIP. No Shopify product records, inventory, checkout prices or shipping rules were edited.

## Result

The global header has a high-contrast free-shipping announcement with 24px mobile and up to 32px desktop display type. A large, full-width offer above the footer photograph repeats the message across storefront pages. The two-item minimum stays next to “Free shipping”; the single-item shipping fee and shipping-details link remain visible. Product purchase controls, the cart page and cart drawer use matching callouts. The cart message follows native item quantity: one item prompts adding one more; two or more qualify for the stated offer.

The six active fragrances show their native **₱799 selling price**, a **20% OFF** badge and the mathematically exact **₱998.75** reference. The same shared Liquid snippet renders product pages, cards, search, Finder results and recommendations. Variant selection updates the current price, reference and badge together. This is the final discounted price, with no further 20% deduction in the bag.

The approved reference applies only to the six active handles at a native PHP 799 price. Other prices, currencies and products use native compare-at values; mixed-price cards suppress a uniform discount claim. Source catalog data remains unchanged. To match native Shopify sales channels to this display, the corresponding product configuration is price 799 and compare-at price 998.75.

## Verification

- [Focused browser and price checks](OFFERS-BROWSER-QA.md): **129/129 passed, zero failures**. Six route families across Light/Dark at 1440, 390 and 320 pixels; all six product pages and collection prices; fourteen pricing fallback fixtures; shipping terms, contrast, clipping, navigation, cart opening and Finder result. Thirteen screenshots are retained in [the offers folder](screenshots/offers).
- [Build verification](offer-build-verification.json): 65 native theme sources validated and 22 routes rendered, each with one H1, no duplicate IDs and no missing referenced assets.
- [Shopify Theme Check](theme-check-offers.json): zero findings. Updated product JavaScript passes syntax validation.
- [Asset preservation record](offer-preserved-assets.json): all 171 selected gallery, banner, font and logo assets retain their saved hashes.
- In-app browser inspection confirmed the full mobile header offer and accessible navigation controls, collection prices of ₱799 / ₱998.75 / 20% OFF, and the mobile product price and shipping callout.
- Product/cart implementation review passed nine isolated render scenarios covering cart quantities 0, 1, 2 and 5, locale links, preserved native totals/checkout, product pricing, sold-out state and taxes.

The package script verifies the 72 original gallery sources, 72 installed gallery images, 72 thumbnails, 22 banners, two webfonts and every archived file byte. Archive details are saved in [the package manifest](package-manifest.json). Current upload file: `DearBody-Theme-Update-Free-Shipping-20-Off.zip`.

The ZIP displays the owner's offer. Checkout shipping rates remain a separate Shopify configuration: paid shipping for one item and free shipping from two items. The existing delivery estimates remain Luzon 2–3 days, Visayas 3–5 days and Mindanao 5–10 days.
