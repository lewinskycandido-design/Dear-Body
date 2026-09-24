# Cart shipping estimate QA

The current implementation follows the verified Shopify Domestic Philippines **₱80 base rate plus active automatic free shipping for two or more items**, discount ID `1488158097473`. It uses `cart.item_count` for eligibility and `cart.total_price`, including applied cart discounts, for the estimated total. The shipping summary is shared between the native fallback cart and drawer. The existing native section refresh replaces both summaries after cart changes; no commerce JavaScript changes or extra cart requests are needed.

**PASS: 22 native Liquid render cases, 212 assertions**, including strict Shopify Liquid parsing. Fixtures cover empty, one item, two items, a discounted two-item order that still qualifies for free shipping, two items below the former price threshold, one expensive item that still pays the base rate, currency string/object forms, unknown/non-PHP currencies, and unknown/non-Philippines markets. Both templates are exercised for every fixture.

Known Philippines/PHP carts show Estimated shipping, Estimated total, the brief checkout-confirmation note and the verified Cash on Delivery availability note. Unknown currencies or markets show Calculated at checkout without inventing a fee, combined total or COD availability. Empty carts show no fee or estimated total. Quantity-based qualification messages are scoped to the verified market/currency; discounted two-item orders remain eligible.

The shared `sj-icon` close, plus and minus SVGs preserve existing cart hooks, accessible button labels and hidden no-JavaScript quantity controls. Remove remains a text link. The new stylesheet uses the existing Light/Dark colour and font tokens.

The default `eligibility_basis` is now `quantity`, following confirmation of the active native automatic discount. The explicit legacy `subtotal` option remains fixture-tested but unused. COD activation was separately confirmed by the root agent in Shopify's Manual Payment Methods list before the line was added.

The later direct-product-checkout request superseded the bag redesign. Its bag-specific layout changes were removed before handoff; the native cart remains as a fallback. `sj-shipping-cards.css` contains only shipping-card styling: a lemon/cream, scarlet/cobalt treatment for the existing shared compact offer and the existing homepage shipping copy. It preserves the generated photo, banner height, image focus and absence of homepage feature buttons. No bag redesign is pending in the source.

This is local rendering verification; fixtures never change inventory, submit an order or mutate a Shopify cart. Browser layout and native checkout behaviour are separate verification steps.

- [Reusable fixture check](cart-shipping-qa.cjs)
- [Full assertions and rendered values](CART-SHIPPING-QA.json)
