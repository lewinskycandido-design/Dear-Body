# Helvetica Now Display Light QA

**PASS — 16 page cases, 182 assertions, 0 issues.** The comparison and gallery-review interfaces also pass. Local Google Chrome checks performed on 24 September 2026; no theme, raster, build, package, or Shopify changes were made by this QA pass.

## Coverage

Homepage, Women’s collection, Scent Finder and Mojito Metallique product page, each in Light and Dark at 1440 × 1000 and 390 × 844.

- Fresh pages request `HelveticaNowDisplay-Light.woff2`; none request the old Helvetica Now Text font.
- Native body styles resolve to `Helvetica Now Display` at weight 300. Chrome’s rendered-glyph inspection confirms the actual custom face `HelveticaNowDisplay-Light`, rather than only a declared CSS family.
- H1 headings retain the loaded Cenzo Flare Bold face and weight 700. Every page has exactly one H1.
- No document overflow or visible heading/paragraph overflow. Nine representative screenshots were visually inspected for readable copy, spacing and wrapping across page types, themes and screen sizes.
- Keyboard navigation opens Women’s collection, including the mobile menu. Collection filters open and close; product cards navigate correctly.
- All five Finder questions complete with keyboard selection and submission; focus follows the current question/results, and real product results render without overflow.
- Desktop product information scrolls independently while the gallery/document remain stable. Gallery Next, zoom, and Escape still work at both widths.
- No JavaScript errors were reported in completed flows.

`/compare` and `/gallery-review` retain the internal family alias `HelveticaNow`, now pointing to the supplied Display Light file at weight 300. Both comparison iframes use the native Display family at 300. These checks also show no old-font requests or horizontal overflow.

## Test adjustments

Two harness assumptions were corrected and rechecked only where relevant: visually hidden 1px live announcements are excluded from visual wrapping checks, and the collection filter dropdown is closed before clicking a product card that it temporarily covers. The original run is preserved in `DISPLAY-FONT-QA-initial.json`; the final report records the targeted rechecks. These required no website fixes.

The local adapter omits Shopify’s native sticky-header wrapper class. Existing product-stage captures reflect that known preview limitation; it does not affect the font metrics or independent-scroll checks. The additional mobile body-copy capture simulates that native wrapper in browser memory only.

## Evidence

- [Final measurements and rendered font identities](DISPLAY-FONT-QA.json)
- [Review-tool font checks](DISPLAY-FONT-REVIEW-UI-QA.json)
- [Homepage, Light desktop](screenshots/display-font/home-light-1440.png)
- [Homepage, Dark mobile](screenshots/display-font/home-dark-390.png)
- [Collection, Dark mobile](screenshots/display-font/collection-dark-390.png)
- [Finder quiz, Light desktop](screenshots/display-font/finder-quiz-light-1440.png)
- [Finder results, Dark mobile](screenshots/display-font/finder-results-dark-390.png)
- [Product information, Light desktop](screenshots/display-font/product-light-1440.png)
- [Mobile product body copy](screenshots/display-font/product-body-dark-390.png)
- [Comparison interface](screenshots/display-font/compare-1440.png)

Only live HTML typography was checked. Product gallery raster typography remains outside this update’s scope.
