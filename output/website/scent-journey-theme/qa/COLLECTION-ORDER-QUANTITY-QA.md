# Collection quantities QA

**PASS: 72 checks.** Shopify Theme Check returned zero diagnostics. This is the current collection-order runtime report; `COLLECTION-ORDER-QA.json` is the earlier fixed-quantity baseline.

Tested the actual collection JS plus actual Liquid-rendered quantity controls using synthetic native product fixtures:

- Card labels are Add to order / Added to order. Repeated selection focuses the existing line and does not duplicate it. The final submit remains Check out.
- Every selected native variant has a separate Remove action, editable integer quantity and accessible decrease/increase buttons. Quantity controls use the native minimum, maximum and increment; the default is one with no invented maximum.
- Edits preserve the quantity input node, typing/button focus, and delivery address. Controls occupy a direct line-grid child that spans the mobile row.
- Empty, zero, fractional, negative, nonnumeric, exponent, below-minimum, above-maximum and wrong-increment entries remain visible and cannot check out. Valid correction restores totals and checkout.
- Price totals multiply native unit prices by quantities. One ₱799 bottle plus ₱80 shipping estimates ₱879; two bottles of that same scent estimate ₱1,598 with free shipping. Mixed quantities 2+3 estimate ₱3,995 and encode both actual quantities in the permalink.
- Existing multi-scent selection, opposite-collection selection, native stock checks, native price/currency fallbacks, separate filter form, address allowlist, same-origin URL, duplicate-submit guard, and pageshow recovery still pass.

Evidence: `COLLECTION-ORDER-QUANTITY-QA.json` and `theme-check-collection-order-quantity.json`. Repeat with Node 24: `node qa/collection-order-qa.cjs`.

No real orders, cart API mutations, address storage, or external browser operations occurred. Live Shopify checkout acceptance is not asserted by these tests. Quantity-rule reference: https://shopify.dev/docs/api/liquid/objects/quantity_rule
