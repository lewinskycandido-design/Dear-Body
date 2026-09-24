# Collection order integration QA

The isolated collection-order runtime passed **45 checks** using the actual `sj-collection-order.js` and synthetic JSDOM fixtures. No real cart requests, orders, or address storage were used. Shopify checkout acceptance is outside this local test scope.

Verified behavior:

- One shared order form opens after the clicked card row. Moving the panel preserves the address input nodes and values.
- Women and Men selections share one order. Every distinct native variant appears once with quantity 1; repeat clicks are idempotent.
- First selection focuses the panel heading. Later additions preserve focus; removing a focused line moves focus to a useful remaining control.
- Six selections, opposite-collection auto-add, removal, selected styling, `aria-expanded`, and no-JS links remain coherent.
- Native price values drive subtotal and shipping: one ₱799 item plus ₱80 estimates ₱879; two ₱799 items estimate ₱1,598 with free shipping. Other prices update correctly; unknown prices or foreign-currency single-item shipping use honest checkout fallbacks.
- Native availability, numeric IDs, same-origin destination, required address fields, and the documented shipping-address allowlist are validated.
- A guarded native GET permalink carries selected variant IDs and encoded address fields. Repeated submit triggers only one attempted navigation; pageshow restores the controls for browser return.
- Invalid catalog data leaves the native product links available with enhanced controls hidden/disabled. Filter forms retain their separate native GET behavior.

Evidence: `COLLECTION-ORDER-QA.json`. Run with Node 24: `node qa/collection-order-qa.cjs`. Native Liquid/card checks are owned by the product-detail QA task; Theme Check evidence is `theme-check-collection-order.json`.
