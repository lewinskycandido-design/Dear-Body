# Order Quantities update

Historical release. Superseded by the published [Same-page COD Orders update](UPDATE-COD-ORDERS.md), theme **167085703233**. The figures and checks below describe the earlier native-checkout release.

Published 24 September 2026: [dearbody.ph](https://dearbody.ph) serves **DearBody Order Quantities Update**, main theme **167085146177**. Shopify CLI confirmation and the independent public audit agree. The archive is `DearBody-Theme-Update-Order-Quantities.zip`.

Customers can adjust quantities on the product page and within selected collection-order lines. The PDP supports separate quantities for its main scent and optional second scent. Initial actions use **Add to order**; the final action remains **Check out**. Mixed Women/Men orders, the delivery-address form and native Shopify checkout remain part of the flow.

Short **How to order** instructions explain selection, quantities, delivery address and checkout. They appear above the Women/Men collection grids and below the initial Add to order button on all six product pages. The current verified flow redirects to native Shopify checkout. The later request for same-page COD order saving is a separate investigation and is not part of this release.

- Each native variant has one order line with its selected quantity. Item count is the sum of quantities, so two bottles of the same scent also qualify for the existing Philippine free-shipping offer.
- Shipping estimates are **₱80 for one item** and **free for two or more items**. Subtotal uses native unit prices multiplied by quantity. Checkout confirms final prices, discounts, shipping, stock and payment; COD remains available under the existing store configuration.
- Quantity controls must follow native variant minimum, increment and optional maximum rules. Shopify's documented defaults are minimum 1, increment 1 and no maximum rule. An absent maximum does not establish stock quantity. [Shopify quantity-rule reference](https://shopify.dev/docs/api/liquid/objects/quantity_rule).
- Checkout permalinks encode the selected quantity with each native variant ID. The same-origin destination, locale handling and documented address fields remain required. No extra quantity/address data should be written to browser storage. [Shopify cart-permalink reference](https://shopify.dev/docs/apps/build/checkout/create-cart-permalinks).
- Finder, Search, Shop all, gallery controls and native filters must retain their existing behavior. Product imagery, gallery/thumbnail locks, fonts and banner artwork remain unchanged.

## Verification status

Local checks passed: [collection quantity interactions](qa/COLLECTION-ORDER-QUANTITY-QA.json) 72/72, [PDP checkout interactions](qa/DIRECT-CHECKOUT-QA.json) 69/69, [native PDP form fixtures](qa/PDP-CHECKOUT-FORM-STATIC-QA.json) 100/100, and [gallery regression](qa/GALLERY-FRAME-STATIC-QA.json) 112/112. The gallery check retains all 144 original image/thumbnail hashes and isolates gallery code from purchase-only click handling.

The final [public audit](qa/order-quantities-live-audit.json) **passed with zero findings** on main theme **167085146177**: 18 routes, six PDP quantity forms, both collection-order pages and all eight How to order paragraphs in their intended locations. All 174 locked artwork/thumbnail/font comparisons and all five current script sources matched; 177 observed asset responses were checked. The audit was read-only, without cookies or preview parameters, and did not request checkout permalinks or submit forms. To repeat it: `python3 qa/order-quantities-live-audit.py --theme-id 167085146177`.

Before publication, the release owner verified native Shopify checkout for **Oud Mirage ×2: ₱1,598, Free shipping, COD** and **Mistened Narcissus ×2 plus Oud Mirage ×1: ₱2,397, Free shipping, COD**, including the exact native line quantities. A fictional Theme Preview address prefilled the PDP checkout. Testing stopped before Complete order; **no order was completed**. Mobile collection controls fit at 320px, the PDP was inspected as readable without horizontal overflow, and collection quantity 0 blocked checkout. [Browser evidence](qa/ORDER-QUANTITIES-BROWSER-QA.json) distinguishes these interactive checks from the public source audit.

The completed archive is saved in the project and Downloads and contains **273 native files**, **39,793,842 bytes**, SHA-256 `f6e6f16d54e59a7595643e98db3960cb362c2aa3ed0fee1b5021fec2654da8c5`. The Downloads copy independently matched this size and checksum. The [package manifest](qa/package-manifest.json) records its contents. `python3 qa/package-theme.py --validate-only` remains available for checksum validation without creating an archive. These documentation updates do not rebuild or change the published theme.
