# Product lifestyle campaign banner QA

**PASS — 28 browser cases, 518 assertions, 0 failures.** All 28 rendered banner captures were visually inspected in local Google Chrome on 24 September 2026. The previous square-packshot banner QA is retained as a historical baseline.

## Coverage

All six fragrances in Light and Dark at 1440 × 1000 and 390 × 844: 24 cases. Longest-title Mistened Narcissus in both themes at 820 and 1920: four further cases. The two 1920-wide visual captures use a 1200px-tall viewport to show the entire 960px banner; automated checks used the 1000px viewport.

- Correct distinct `sj-product-banner-{handle}.jpg` assets load at their native 1774 × 887 dimensions.
- Campaign media reaches both viewport edges, maintaining 2:1 desktop framing and the intended 3:2 mobile crop. No image filters or reduced image opacity are applied.
- Each rendered image contains exactly one person. Faces and products remain visible in mobile crops; everyday settings and natural actions are believable. No material anatomy, identity or scene-plausibility defect was found in this review.
- Cenzo Flare Bold product names remain live text and are the sole H1. Helvetica Now Display body typography stays at weight 300.
- The product information region has a valid neutral H2 label, “Your next chapter,” and remains keyboard focusable. The main introduction repeats neither the product name nor its scent statement.
- No horizontal page or title overflow. Title, approved statement and CTA contrast remain clear in both themes. The dark gradient ends by 53% of the viewport, before the right-side faces and fragrance bottles.
- Banner CTAs reach the correct product details. Twelve gallery frames remain available; Next opens frame 02, zoom opens the corresponding image, and Escape closes it.
- Actual mouse-wheel checks confirm that desktop information scrolls independently while the gallery and page remain stable.
- No JavaScript errors.

## Native section behavior

Twelve section-render scenarios pass, covering all six campaign mappings, image override priority, genuine featured-image fallback for future products, no-image text fallback, metafield statement priority/escaping, the assembled template’s single H1, and the standalone product section’s default title/statement controls. Five existing fallback scenarios also pass with the new campaign mapping. Both edited sections pass strict Shopify Liquid parsing.

The product section defaults `show_title` and `show_hero_statement` to true for standalone use; the supplied product template sets both false because the banner supplies them. The schema explains enabling the title when removing the banner. Native variant, price, stock, purchase, media and metadata markup remains in place.

The local preview adapter’s previously documented missing native sticky-header wrapper is unchanged. CTA checks verify the anchor destination and header-height offset; the source retains the previously verified product-target offset. No new source fixes were required during this browser pass, and no Shopify operations or packaging were performed here.

## Evidence

- [Browser measurements and checks](PRODUCT-CAMPAIGN-BANNER-QA.json)
- [Native section scenarios](PRODUCT-CAMPAIGN-SECTION-QA.json)
- [Browser script](product-campaign-banner-qa.cjs)
- [Mistened Narcissus, Light desktop](screenshots/product-campaign-banner/mistened-narcissus-light-1440.png)
- [Oud Mirage, Dark mobile](screenshots/product-campaign-banner/oud-mirage-dark-390.png)
- [Rtulle & Satin, Light desktop](screenshots/product-campaign-banner/rtulle-satin-light-1440.png)
- [Amber Oud Silk, Dark mobile](screenshots/product-campaign-banner/amber-oud-silk-dark-390.png)
- [Charme Envoûtant, Dark desktop](screenshots/product-campaign-banner/charme-envoutant-dark-1440.png)
- [Mojito Metallique, Light mobile](screenshots/product-campaign-banner/mojito-metallique-light-390.png)
- [Longest title, Dark tablet](screenshots/product-campaign-banner/mistened-narcissus-dark-820.png)
- [Longest title, Light wide desktop](screenshots/product-campaign-banner/mistened-narcissus-light-1920.png)
