# Independent commerce and theme review

Reviewed locally on 2026-09-24. No Shopify store, API, authentication, deployment or checkout was accessed.

## Validation

- Official Shopify Theme Check: exit 0, JSON output `[]` (no errors or warnings).
- Commerce tests: 17 checks passed in `preview/test-commerce.mjs`.
- Discovery tests: 18 checks passed in `preview/test-discovery.mjs`.
- `dearbody.js` and `dearbody-commerce.js`: JavaScript syntax checks passed.
- All 43 literal bundled asset references resolve.
- JSON templates and section groups reference existing sections. Their section settings, block types and block settings match the corresponding schemas.
- `apps.liquid` and the general page section correctly declare `@app` blocks and render the app blocks. The product section also declares and renders app blocks.
- Native product, contact, newsletter and password forms retain their Shopify Liquid form types. Cart retains native POST update/checkout and Shopify-generated remove URLs. Search and collection sorting retain GET submission.
- Global `[hidden]` treatment hides inactive panels and statuses. Search failure retains native search submission. Recommendation failure leaves purchasing available.

## Fixes confirmed

- Real Shopify zero prices are rendered and purchasable when Shopify marks the variant available; no artificial price-based availability rule remains in commerce templates.
- Product and cart quantity validation respects configured quantity rules, rejects blank quantities, and permits cart quantity zero for removal. Product errors are announced through an alert.
- Real products missing merchant imagery receive a neutral title placeholder instead of another fragrance's fallback bottle.
- Predictive search cancels stale responses, preserves accessible keyboard focus and permits a second Escape to reach its containing disclosure.
- No-JavaScript product variant selection now uses a separate GET refresh form. Refresh updates the selected variant, displayed price, availability and quantity limits before adding to the cart. The JavaScript variant control is hidden in this mode. Native cart, search, contact and newsletter forms remain usable.
- Variant and price JSON scripts escape literal less-than characters. A rendered variant title containing a closing-script sequence remains a JSON value and cannot terminate the catalog script. Native Shopify product structured data is unchanged.
- Mobile product payment/errors span the form width, gallery groups are labeled, missing-image text wraps, and Remove controls have usable touch targets.

## Review boundary

No remaining commerce/schema/resource blocker was found. Root is handling the separately reported duplicate legacy mobile navigation handlers in `dearbody.js`; the new navigation module owns those events. Payment processing, Shopify-hosted app blocks, real inventory changes and email delivery require the merchant's post-upload preview because this build was intentionally offline.

## Reproduce

Run from this release directory:

```sh
SHOPIFY_CLI_NO_ANALYTICS=1 ../master-brief-theme/tools/node_modules/.bin/shopify theme check --path theme --output json
node preview/test-commerce.mjs
node preview/test-discovery.mjs
node --check theme/assets/dearbody.js
node --check theme/assets/dearbody-commerce.js
```

This report, preview fixtures, dependency folders and development tests belong outside the Shopify upload ZIP.
