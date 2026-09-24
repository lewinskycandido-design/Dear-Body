# Mobile collection order placement

PASS — 80 local checks in the current collection-order suite. JavaScript syntax validation also passed.

At the native collection grid's `max-width: 999px` breakpoint, the order panel stays below every product card. Above 999px, it follows the clicked card's row. The existing form node is moved; its address fields, quantities, focused control and text selection remain intact.

Focused checks cover first mobile selection, 320px/390px placement, the 999px/1000px boundary, desktop-to-mobile and mobile-to-desktop resizing, quantity input preservation, and the existing ordering/stock/price/validation behavior.

Evidence: `COLLECTION-ORDER-MOBILE-PLACEMENT-QA.json`. Repeat: `node qa/collection-order-qa.cjs`. These use synthetic local fixtures; no browser deployment, cart API request or real order occurred.
