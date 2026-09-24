# PDP order quantities — PASS

- 69 direct-checkout JSDOM/URL checks passed in `DIRECT-CHECKOUT-QA.json`.
- 100 isolated native Liquid/markup checks passed in `PDP-CHECKOUT-FORM-STATIC-QA.json`.

“Add to order” reveals and focuses the existing order panel without submitting. The final “Check out” button retains native address validation. Main and optional second scents have separate integer inputs and plus/minus controls. Both use native minimum, maximum and increment rules. Combined quantities for the same variant are validated again after merging.

Verified examples include one PHP 799 scent at quantity 2 producing PHP 1,598 with free shipping, two different scents with independent quantities, the same scent merged into one permalink line, invalid/blank/fractional entries, native increment and maximum constraints, unchanged address values on reopening, and currency-safe shipping fallbacks.

Without JavaScript, quantity and optional-scent controls stay disabled. The original form remains visible and its native checkout action encodes the selected variant’s minimum quantity (default 1). No unsupported quantity field is added to Shopify’s address-prefill query.

Only local synthetic fixtures were used. Two navigation attempts were blocked by JSDOM; there were zero network requests, storage writes, orders or live address submissions. Visual layout, real checkout and browser review are handled by the parent task. Gallery image assets and gallery methods were not changed; only purchase branches were changed in the shared click handler.
