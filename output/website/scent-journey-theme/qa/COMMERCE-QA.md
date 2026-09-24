# Commerce and discovery QA

Checked 24 September 2026 against the new Scent Journey source.

## Automated verification

- Full Shopify CLI `theme check` passes with no errors or warnings (`theme-check-current.json`).
- Seven owned Liquid files parse with the strict Shopify Liquid HTML parser. Each section schema and all six commerce/discovery JSON templates parse as JSON.
- `sj-commerce.js` and `sj-finder.js` pass Node syntax checks.
- **35 commerce DOM assertions pass** using JSDOM and explicit test-only endpoint fixtures: locale-aware `/fr/` routes; duplicate add/change prevention; restored button markup/disabled state; form-settled event; available add success; sold-out rejection; read-only recovery without a second write, including uncertain network failure; quantity update; removal rejection; quantity focus after section replacement; drawer focus return and preservation across refresh; search input focus; discarded stale responses; arrow selection; Escape clearing and second-Escape dialog dismissal with trigger focus return.
- **11 pure scoring assertions pass**: metafield tag normalization; duplicate tag handling; null/object rejection; case-insensitive exact matches; weighted matching; no match for missing metadata; deterministic ties.
- **15 Finder DOM assertions pass**: questions and answers derive only from supplied profiles; unconfigured question types omitted; keyboard focus after advancing; answers preserved when going back; ranked results and reasons; reset; honest discovery copy when all answers are skipped.
- **10 Liquid eligibility assertions pass** against the actual Finder section: default inclusion of configured sold-out products; native sold-out labels; optional availability filtering; disabled and missing-profile exclusion; schema default remains false.
- No assertions changed inventory, submitted checkout, or wrote to Shopify. Positive cart/Finder cases use isolated in-memory test fixtures.

## Native Shopify integration

- Global sections: `sj-cart-drawer`, `sj-predictive-search`.
- Global assets: `sj-commerce.css`, deferred `sj-commerce.js`. Finder loads its own deferred `sj-finder.js`.
- Root product form convention: `form[data-sj-product-form]`, submitter `[name=add]`, errors `[data-sj-product-error]`.
- AJAX add dispatches bubbling `sj:product-form-settled` after restoring button state, so the PDP can reapply the current variant state even if changed during the request.
- Cart JSON URLs derive from Shopify locale root. Section refresh uses Shopify Section Rendering API on the current route. Native cart forms, update controls, remove URLs, and checkout remain available without JavaScript.
- Predictive search is Shopify server-rendered HTML; text is never used to construct markup. Query debounce, abort, and generation checks prevent outdated suggestions. Native search remains the submission fallback.
- Finder candidates must have boolean `custom.scent_finder_enabled == true`, plus at least one actual scent profile metafield. Sold-out products remain discoverable by default and retain native availability labels; the optional “Available products only” setting excludes them when enabled. No product identities, classifications, notes, prices, or profile mappings are hardcoded in the finder. Configurable collection supports up to 250 candidates.
- Women/Men templates only style the selected native collection. They never infer product gender.

## Runtime boundaries

- Public snapshot products are currently unavailable. The normal preview truthfully shows sold-out labels. The Finder preparation state appears only when no eligible configured profiles exist; inventory alone does not prevent discovery by default. Live Shopify metafields cannot be verified through the public product JSON.
- Final Shopify Theme Editor checks must confirm actual metafield definitions, collection template assignments, filter configuration, inventory, app blocks, checkout, localized routes, currency, and Section Rendering API responses in the installed theme.
- The preview adapter cannot prove Shopify checkout or live inventory writes; those require an authenticated development-theme QA session.

## Repeatable fixture checks

After installing dependencies with `npm install` in `preview/`, run from this theme project:

```sh
node qa/commerce-dom-qa.cjs
node qa/finder-dom-qa.cjs
node qa/finder-scoring-qa.cjs
node qa/finder-eligibility-qa.cjs
```

These isolated QA fixtures use the preview package’s JSDOM dependency. They are not shipped as storefront data or assets.
