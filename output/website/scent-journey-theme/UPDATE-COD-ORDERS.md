# Same-page COD orders update

Published 24 September 2026: Shopify CLI and independent public requests confirm **DearBody COD Order Update**, theme **167085703233**, is live. Theme **167085146177** is retained for rollback. The final archive is **DearBody-Theme-Update-COD-Orders.zip**, saved in the project and Downloads: **275 native files**, **39,797,927 bytes**, SHA-256 `e0cf3d65f6e59a306d5d1cf3d83a2c8db2ba8f4edb921883b43f7215dc1827ce`. The release owner verified the Downloads copy against this size and checksum. The independent [public-store audit](qa/cod-live-audit.json) passed with zero findings.

The authorized same-page COD order and focused mobile browser checks passed before publication. The test order was then canceled, voided and archived, with all three bottles restocked and customer notification unchecked. See [browser evidence](qa/COD-ORDERS-BROWSER-QA.json).

Customers select **Add to order**, choose quantities, then select **Check out**. An EasySell popup collects delivery details and places the cash-on-delivery order on the same page. Women and Men scents can share an order. The PDP retains its main scent and optional second scent, including independent quantities. Delivery details are entered once in the popup; the separate PDP address fields are disabled and hidden when JavaScript is active.

The integration passes exact native variant IDs and quantities, merges duplicate variants and validates native quantity rules. Cart preparation verifies the selected Shopify cart before the app opens. The theme does not create its own order-success message: opening the popup is only an intermediate step, and genuine completion must come from EasySell after it saves the order. The native PDP checkout remains a no-JavaScript fallback.

## App configuration

- EasySell is installed with the owner's approval on the **Free plan, 60 orders per month**. Usage was observed at **1 of 60** after the authorized test. No paid plan or usage upgrade is authorized by this release.
- Paid SMS and WhatsApp features remain disabled; all four messaging services were rechecked as **Deactivated** after the test.
- The app is configured for **No redirection (Show thank you message only)**. Its official [confirmation setting](https://help.tyslo.com/en/article/where-to-redirect-clients-after-placing-an-order-cwq7l3/) supports a genuine same-page thank-you message after order placement.
- Philippine shipping is **₱80 for one bottle** and **free for two or more bottles**, counting quantities across all selected scents. The draft popup checks verified both cases with exact selected lines and totals.
- App installation, permissions and configuration are store settings, not theme-ZIP contents. The theme requires the configured EasySell service; it must show a recoverable error if the app cannot open.

## Verification evidence

Local checks completed without real network requests or orders:

- [Exact-cart preparation](qa/COD-CART-PREPARE-QA.json): 50 checks passed.
- [Popup adapter](qa/COD-POPUP-QA.md): 17 checks passed.
- [PDP COD handoff](qa/PDP-COD-HANDOFF-QA.md): 45 runtime/Liquid integration checks passed, including exact quantities, duplicate-variant rules, popup pending/error handling and no duplicate address collection.
- [Native PDP fallback](qa/PDP-CHECKOUT-FORM-STATIC-QA.json): 100 static checks passed.
- [Collection COD handoff](qa/COLLECTION-COD-HANDOFF-QA.md): 82 local checks passed. The app bridge is mocked in this suite, so these checks do not prove order creation.

The PDP-only compatibility quantity field corrected EasySell's generic product-page opener behavior. The release owner verified **Oud Mirage ×2 plus Amber Oud Silk ×1**, subtotal **₱2,397**, shipping **Free**, and the exact three units in the saved COD test order **#1001**. The URL remained `/products/oud-mirage` while EasySell displayed **Order placed**. COD payment was pending before cancellation. The authorized test was then **canceled, voided and archived**; all three bottles were restocked, and the cancellation notification checkbox was left unchecked. No fulfillment is claimed.

Focused mobile browser checks also passed:

- **Women at 390px:** selecting the first card leaves all three product cards before the form. The form begins below the final card, and document width equals scroll width at 390px. Mistened Narcissus ×1 opens the popup at **₱799 + ₱80 shipping = ₱879**.
- **Men at 320px:** all three product cards remain before the form, which begins below the final card. Document width equals scroll width at 320px. Rtulle & Satin ×1 plus Mojito Metallique ×1 opens the popup at **₱1,598, Free shipping**; the popup is approximately 300.8px wide within the 320px viewport.
- **PDP:** the actual saved three-bottle test verifies quantity preservation and the genuine same-page confirmation. The browser evidence records the observed path and outcome without customer contact, address, IP or cart-token data.

All source-asset locks passed. The five local suites above total **294 passing checks**. The final cookie-free [public-store audit](qa/cod-live-audit.json) passed on main theme **167085703233**: **18 routes**, six PDP COD contracts, two collection forms, all eight ordering-instruction blocks, **174 locked asset comparisons**, **179 observed asset responses** and **seven exact current script-source matches**. EasySell embed references were present on all 18 pages; four observed vendor scripts answered HEAD availability checks. There were **zero findings**. This audit submitted no forms, requested no checkout links and made no cart or order changes. Popup behavior and saved-order confirmation are established by the separate browser evidence above. The local preview cannot place orders or validate external app settings.

No documented EasySell sandbox that suppresses real order creation was found. Its [Meta CAPI test guide](https://help.tyslo.com/en/article/how-to-test-meta-conversion-api-with-your-easysell-form-kq194v/) instructs submitting an order normally; it is not evidence of a non-fulfillment test mode. The one authorized verification therefore used a real test order, whose cancellation and restock are recorded above. No extra order or customer notification is authorized by this document.

The earlier [Order Quantities archive](UPDATE-ORDER-QUANTITIES.md) describes the native Shopify checkout redirect flow. Its historical checks and checksum do not certify or package this COD popup update. Artwork, gallery behavior and product data remain outside this update's scope.

## Branded order confirmation

The DearBody confirmation design is saved in EasySell Settings > General, with no redirection retained. It shows the customer name, order number, scent list and cash-on-delivery total in the brand colors and fonts. The saved content survived an admin reload; the live store loads the scoped confirmation CSS. Sample layouts passed CUA visual checks at 320px and 600px without horizontal overflow. No additional test order was submitted after the appearance update. See [confirmation deployment evidence](qa/EASYSELL-CONFIRMATION-DEPLOYMENT.json). These are app settings, so the theme ZIP is unchanged.
