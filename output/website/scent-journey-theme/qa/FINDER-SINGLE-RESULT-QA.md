# Scent Finder single-result QA — PASS

Focused verification of the actual local preview using native profile and product data. No profile/catalog injection. This report supersedes the earlier multi-result UI expectation; the prior broad browser report remains historical baseline evidence.

## Results

- status: PASS
- browserCases: 6
- nativeTests: 2
- checks: 184
- passedChecks: 184
- issues: 0

| Case | Theme | Width | Expected product | Result |
|---|---|---:|---|---|
| ranked-women-light-desktop | light | 1440 | mojito-metallique | PASS |
| ranked-men-dark-mobile | dark | 390 | charme-envoutant | PASS |
| tie-men-light-mobile | light | 390 | oud-mirage | PASS |
| all-skipped-dark-desktop | dark | 1440 | mistened-narcissus | PASS |
| collection-women-light-mobile | light | 390 | mistened-narcissus | PASS |
| collection-men-dark-desktop | dark | 1440 | oud-mirage | PASS |

## Coverage

Ranked Women and Men paths retain multiple positive candidates in the ranking API but render only the highest. Tied scores preserve catalog order. All-skipped and collection-only paths show one honestly labelled discovery suggestion. Every case checks singular wording and accessible status, native price/availability, collection filtering, reset, repeat completion, product navigation, focus, one H1, horizontal/heading overflow, and the left-aligned column limited to 440px. Light/Dark desktop/mobile are covered.

Native DOM test covers targeted Rtulle, all-skipped, collection-only and tied first results alongside required answers, answer persistence and focus. The existing scoring suite retains all candidates and verifies all six current profiles can be the top result.

## Issues

No automated failures.

Screenshots: `screenshots/finder-single-result/`. Machine evidence: `FINDER-SINGLE-RESULT-QA.json`. Visual inspection is recorded below after review. This is local preview QA; no Shopify Admin changes or checkout tests were performed.

## Visual review — PASS

All six result screenshots were inspected. Each shows one product card, singular labels and summary, readable type, native price/availability and complete controls. Desktop uses the intended left-aligned column; mobile cards and text fit the viewport. The existing fixed theme switcher is visible in the captures.
