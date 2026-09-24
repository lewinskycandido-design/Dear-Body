# Scent Finder live browser QA — PASS

Actual local preview and real six-product data. No fixture/profile/catalog injection.

## Totals

- status: PASS
- runs: 16
- checks: 550
- passedChecks: 550
- axeScans: 8
- axeViolations: 0
- productDestinations: 6
- issues: 0

## Flow matrix

| Theme | Width | Path | Result |
|---|---:|---|---|
| light | 1440 | women | PASS |
| light | 1440 | men | PASS |
| light | 1440 | open | PASS |
| light | 1440 | skip | PASS |
| light | 390 | women | PASS |
| light | 390 | men | PASS |
| light | 390 | open | PASS |
| light | 390 | skip | PASS |
| dark | 1440 | women | PASS |
| dark | 1440 | men | PASS |
| dark | 1440 | open | PASS |
| dark | 1440 | skip | PASS |
| dark | 390 | women | PASS |
| dark | 390 | men | PASS |
| dark | 390 | open | PASS |
| dark | 390 | skip | PASS |

## Coverage

Five-question order; collection filter; real IDs, links, prices and sold-out badges; Women/Men/open choices; all-skipped discovery; back/forward answer persistence; reset; keyboard selection/submission; focus transfer; overflow; WCAG A/AA axe scans on quiz and results; actual product destinations.

Axe is automated coverage, not a substitute for assistive-technology user testing. Incomplete manual-review items are preserved in the JSON.

## Issues

No automated failures. Representative quiz and result screenshots were inspected in both themes at desktop and mobile sizes: PASS.

Screenshots: `screenshots/finder-live/`. Machine results: `FINDER-LIVE-QA.json`.

## Mobile Continue follow-up

All eight mobile end-to-end flows successfully clicked Continue through all five questions. The element-only quiz screenshot aligned the section bottom to the viewport, which allowed the fixed preview comparison control to overlap part of the button. A normal scroll places the complete Continue button at y540–592, above the comparison control at y788–832. In both themes, all four corner hit tests and the center hit test target Continue; a real click advances to the mood question.

Clear captures: `screenshots/finder-live/quiz-light-390-button-clear.png` and `quiz-dark-390-button-clear.png`. Details: `FINDER-MOBILE-CONTROL-QA.json`.

## Visual and accessibility review

Representative desktop and mobile quiz/results captures were inspected for spacing, headings, product-card readability, stock badges, and truthful discovery copy. PASS. Axe incomplete items concern the image-backed footer, dark choice gradients, and the menu glyph; relevant visual states were inspected and remain readable. Zero automatic WCAG A/AA violations across eight scans.

The first test draft compared hidden-card `innerText` directly to visible text. Mojito's desktop compare-at price wraps onto a second line, causing four false mismatches. The assertion now ignores only whitespace; a fresh run passes all 550 checks with identical price/stock values. No application change was needed.

No remaining blockers. No theme source edits, package builds, or Shopify changes were made during this QA task.
