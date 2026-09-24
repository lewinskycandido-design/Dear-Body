# Product banner QA

**PASS — 28 banner cases, 378 assertions, 4 final anchor cases, 0 blockers.** Tested locally in desktop Google Chrome on 24 September 2026. No Shopify operations or theme source edits were performed by this QA pass.

## Coverage and findings

- All six fragrance pages in Light and Dark at 1440 × 1000 and 390 × 844: 24 cases.
- Longest-title Mistened Narcissus in both modes at 820 and 1920: 4 additional cases.
- Banner outer edge is x = 0 and width equals the viewport. Each banner displays its correct product title and loaded verified `01` packshot with `object-fit: contain`.
- Every page retains exactly one H1 in the product information section. Banner display titles, approved statements and CTAs fit without horizontal or text overflow.
- All pages retain 12 gallery slides. Next selects frame 02; zoom opens that image and closes with Escape. No JavaScript page errors occurred.
- On desktop, actual mouse-wheel input scrolls the information panel while document position and gallery position remain stable.

Sixteen banner captures were visually inspected: all six scents in Light desktop and Dark mobile, plus Mistened Narcissus in both themes at 820 and 1920. Packaging remains complete and uncropped; title, statement, button and image have clear separation. Two final anchored viewport captures were also inspected.

## Final CTA landing position

The first pass found that product scroll margin duplicated the shared HTML anchor padding. The source owner removed the duplicate and applied a product-target margin of `-24px` to cancel the remaining shared decorative gap. A focused four-case follow-up checked the final source in Light and Dark at desktop and mobile widths.

| Viewport | Header bottom | Product top | Thumbnail controls bottom | Caption bottom | Result |
|---|---:|---:|---:|---:|---|
| 1440 × 1000, Light/Dark | 110.5 | 110.5 | 949.5 | 1000 | Pass |
| 390 × 844, Light/Dark | 99 | 99.125 | 657.625 | 708.125 | Pass |

Desktop now shows the complete fixed-height stage below the header. Mobile keeps its natural vertical product flow. Next, zoom and Escape were verified again in all four follow-up cases.

The local preview adapter omits Shopify’s native header-group wrapper class. For the final anchor check only, the existing wrapper received `shopify-section-group-header-group` in the browser DOM to reproduce the theme’s native sticky-header behavior. No files were changed for that simulation. The floating theme comparison control remains in screenshots; caption bounds above measure layout geometry.

## Evidence

- [Full measurements](PRODUCT-BANNER-QA.json)
- [Final anchor measurements](PRODUCT-BANNER-ANCHOR-FINAL-QA.json)
- [Main QA script](product-banner-qa.cjs)
- [Focused anchor script](product-banner-anchor-final-qa.cjs)
- [Mojito, Light desktop](screenshots/product-banner/mojito-metallique-light-1440.png)
- [Charme, Dark mobile](screenshots/product-banner/charme-envoutant-dark-390.png)
- [Longest title, Light tablet](screenshots/product-banner/mistened-narcissus-light-820.png)
- [Longest title, Dark wide desktop](screenshots/product-banner/mistened-narcissus-dark-1920.png)
- [Final desktop anchor](screenshots/product-banner/anchor-final-light-1440.png)
- [Final mobile anchor](screenshots/product-banner/anchor-final-dark-390.png)

Native future-product fallback scenarios and Shopify Theme Check were handled separately by the source owner; they are not counted in the totals above.
