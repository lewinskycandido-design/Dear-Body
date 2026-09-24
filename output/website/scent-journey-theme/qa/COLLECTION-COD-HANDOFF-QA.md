# Collection COD form handoff

PASS — 82 local checks. Collection code passes validated native variant IDs and exact quantities to `await window.SJCOD.checkout(items, form)`.

The inline panel keeps scent selection, per-line quantities, totals and mobile placement below all cards. It explains that customers enter delivery details in the COD order form. The separate native address fields, address serialization and direct checkout redirect are removed. Native product-page links remain the no-JavaScript fallback.

Checks cover same-scent quantity2/free shipping, mixed quantities, stock and native quantity-rule validation, mobile/desktop relocation and focus, exact bridge payload, duplicate clicks, missing app bridge, rejected promise recovery, and stale responses after retry. Resolving the bridge promise only restores controls; the collection code never claims that an order was placed.

The suite includes actual Liquid-rendered form/catalog checks. The bridge itself is mocked in these tests. No network requests, orders, address storage or external browser operations occurred. App opening and genuine order creation require the separate supported app adapter and live verification.

Evidence: `COLLECTION-COD-HANDOFF-QA.json`; Theme Check output: `theme-check-collection-cod-handoff.json`. Repeat with Node24: `node qa/collection-order-qa.cjs`.
