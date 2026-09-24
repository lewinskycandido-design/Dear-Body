# Mobile banner overlay QA

PASS — 33 viewport/theme cases, 385 browser assertions, 33 individually inspected banner captures, and no unresolved issues. Six affected cases were refreshed after focal and contrast refinements (69 repeat assertions); the other 27 passing cases were retained.

This is the current mobile layout baseline. Earlier reports showing mobile copy beneath the image are historical.

## Scope

| Coverage | Cases |
| --- | ---: |
| Home, Women, Men, Shop All, Scent Finder, Our Story and six product pages; Light/Dark at 390 × 844 | 24 |
| Home Light, Story Dark and Mistened Narcissus Light/Dark at 320 × 844 | 4 |
| Home Light and Story Dark at 760 × 1000 | 2 |
| Home Light, Story Light and Mistened Narcissus Dark at 1440 × 1000 | 3 |

Verified full-viewport banner width, full image box matching the banner, copy wholly inside and overlapping the image, unclipped headings/copy, no horizontal overflow, correct artwork, one H1 per page, Helvetica Now Display at weight 300, and Cenzo Flare Bold headings at 700. The three desktop banner dimensions match the previous baseline.

## Visual result

All 33 captures were opened and inspected. Both homepage faces remain visible at 320 px. Story intentionally focuses on the right-hand pair at phone widths; the final 320 px crop retains the man’s full head. All six product campaigns retain one person and recognizable product identity. The longest product title wraps cleanly at 320 px, and the photograph remains behind the full copy block. Small cream text and CTAs are readable in both themes.

Two review findings were resolved before completion: the Story 320 px outer head crop and the Home Light 760 px eyebrow’s weak contrast over the pale wall. Charme and Mojito also received targeted focal adjustments to improve head and bottle margins. No artwork or source code was edited by this QA task.

For the corrected Home Light 760 px eyebrow, the actual photograph plus CSS scrim was captured with only that text hidden in the browser while layout remained fixed. Every background pixel in the text Range rectangle was compared against its computed foreground, rgb(255, 246, 233). The minimum ratio across 1,652 pixels is **7.19:1**, exceeding 4.5:1. This is a targeted screenshot contrast check, not a claim of a new full-site accessibility audit.

## Representative interactions

- Home CTA reaches the collection section.
- Collection CTA opens Scent Finder.
- Finder CTA reaches the quiz; all five questions complete by keyboard, and a real result card opens its product page.
- Product CTA reaches details; the gallery advances, zoom opens, and Escape closes it.
- No browser JavaScript errors occurred in the cases.

## Evidence

- Consolidated data: [MOBILE-BANNER-OVERLAY-QA.json](MOBILE-BANNER-OVERLAY-QA.json)
- Six-case refresh: [MOBILE-BANNER-OVERLAY-QA-targeted.json](MOBILE-BANNER-OVERLAY-QA-targeted.json)
- Contrast data: [MOBILE-BANNER-OVERLAY-CONTRAST.json](MOBILE-BANNER-OVERLAY-CONTRAST.json)
- All captures: [screenshots/mobile-banner-overlay](screenshots/mobile-banner-overlay)
- Representative final captures: [Home 320](screenshots/mobile-banner-overlay/home-light-320.png), [Story 320](screenshots/mobile-banner-overlay/story-dark-320.png), [Home 760](screenshots/mobile-banner-overlay/home-light-760.png), [Mojito Dark 390](screenshots/mobile-banner-overlay/mojito-metallique-dark-390.png), [Mistened Light 320](screenshots/mobile-banner-overlay/mistened-narcissus-light-320.png).
- Runner: [mobile-banner-overlay-qa.cjs](mobile-banner-overlay-qa.cjs); optional `QA_CASES` selects comma-separated `name-theme-width` case keys and `QA_REPORT` selects the output filename.

Checked in local Chrome against the native-theme preview at port 4208. This focused run made no Shopify changes and did not rebuild or package the theme. The preview’s existing native sticky-header wrapper limitation remains as documented in the earlier banner QA; this run verifies the CTA destinations and subsequent interactions.
