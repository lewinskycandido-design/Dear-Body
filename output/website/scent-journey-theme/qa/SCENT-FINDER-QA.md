# Scent Finder revision — PASS

The five-question quiz now works from native theme profiles for the six priority fragrances. The preview leaves Shopify metafields empty and exercises that actual theme fallback; it does not inject fabricated profiles or stock.

## Verified behavior

- Collection preference limits recommendations to Women, Men, or both.
- Mood, scent style, occasion and scent feel guide weighted matches. Style receives the greatest individual weight.
- Every one of the six scents can be the top result when its matching preferences are selected.
- Exactly one highest-ranked scent shows the choices it shares, its product description and real product link/price/availability. The ranking function still returns all positive candidates; only the displayed result is limited to one.
- Skipping the four scent preferences shows one suggestion labelled “A SCENT TO EXPLORE,” with the collection filter retained. Tied scores preserve the first product in catalog order.
- Back preserves answers. Changing collection clears incompatible later answers. Start again resets the quiz.
- Sold-out scents stay discoverable by default. Available-only filters them out; explicit false disables a product. Unknown handles are excluded.
- Native trait metafields override bundled defaults. Special text including a closing script tag safely round-trips inside the embedded JSON.

## Evidence

- [Current single-result report](FINDER-SINGLE-RESULT-QA.md): **six browser cases, 184/184 checks pass**, including native DOM and scoring checks. Covers ranked Women/Men, a stable tie, all skipped, and each collection-only path in Light/Dark at 1440 and 390px. All six result screenshots were visually inspected.
- [Earlier broad browser report](FINDER-LIVE-QA.md): **historical baseline of 16 flows and 550 checks**, captured before the single-result revision. Its multi-result screenshots are not evidence of the current UI. The reusable script now expects one card.
- **Eight baseline axe scans, zero violations**, covering questions and results before the single-result revision. These scans were not repeated for this bounded update. Automated checks do not replace assistive-technology user testing.
- [Mobile control check](FINDER-MOBILE-CONTROL-QA.json): Continue is fully clear of the theme switcher after normal scrolling; all corners and center receive clicks in both themes.
- `finder-eligibility-qa.cjs`: **nine scenarios pass** against native Liquid rendering.
- `finder-scoring-qa.cjs`: **13 scenarios pass**, including reachability of all six profiles.
- `finder-dom-qa.cjs`: passes native-rendered quiz initialization, required answers, focus, back, collection change, exactly one targeted Rtulle result, stable first tie, stock labels, reset and singular skipped-answer/collection-only behavior.
- Earlier baseline Theme Check had no findings and validated **61 source files / 23 routes**. Current packaging and Theme Check evidence are maintained by the root task separately.
- Current result screenshots were visually inspected in Light/Dark, desktop/mobile: `screenshots/finder-single-result/`. Earlier broad quiz screenshots remain in `screenshots/finder-live/`.

The change is local and packaged in the uploadable Shopify ZIP. No Shopify Admin writes or publication were performed. Native checkout and Theme Editor runtime were not revalidated on Shopify.

## Profile basis

Defaults are editorial discovery mappings from `approved-product-copy.json` and verified Women/Men membership in `preview/shopify-public-snapshot.json`. Mood and occasion are suggestions, not measured product performance. Scent feel means airy, sweet or deep character, with no projection/longevity claims. Rtulle uses its approved airy/sweet/warm description without an invented note pyramid.

Native implementation: `theme/snippets/sj-finder-profile.liquid`, `theme/sections/sj-scent-finder.liquid`, `theme/assets/sj-finder.js` and scoped styles in `sj-commerce.css`.
