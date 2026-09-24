# PDP checkout form static QA — PASS

100/100 checks passed across five isolated Liquid fixtures.

Coverage: available/sold-out primary products, locale cart paths, six native second-scent options, unavailable variant disabling, same-scent second bottle, missing catalogue entry, address constraints, single native submit, supported prefill field names, PHP estimates and non-PHP fallback.

- Renders actual checkout Liquid form with synthetic available/unavailable native product fixtures; no production availability changes.
- JSDOM constraint validation and source structure only. No browser layout, network request, order or address submission.
- Commerce/product JS transport and totals are independently tested by commerce_discovery. Shipping/payment/address validation remains native Shopify checkout.
- No personal addresses are used or persisted. Native subtotal is an estimate before any further checkout adjustments.

No source/markup failures.
