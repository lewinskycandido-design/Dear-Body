# Campaign banner QA — 24 September 2026

Local Chrome inspection of the actual Liquid preview at http://127.0.0.1:4208. No Shopify writes. QA agent did not edit theme source.

## Coverage and results

30 cases: five routes × Light/Dark × 1440px, 390px and 360px widths.

Routes: /, /collections/womens-perfume, /collections/mens-perfume, /pages/scent-finder, /pages/our-story.

Automated results: all 30 passed.
- Actual campaign photographs and footer photographs loaded with the correct mode-specific URLs.
- No horizontal overflow, JavaScript page errors or HTTP failures.
- Shopping-bag SVG is visible at 21×23px.
- Clicking the bag opens the drawer in all cases; focus enters the dialog and Escape closes it.
- Native storefront data remains a local snapshot. Checkout and live Shopify behavior are outside this local visual pass.

Visual review:
- Homepage has two attractive category panels with readable copy and clickable collection links.
- Header photographs are visible, warm and consistent with the new campaign.
- Headings fit their containers; desktop overlay contrast and mobile separate-copy blocks are readable.
- Footer photo and closing statement remain visible and readable in both modes at all three widths.
- Bag icon and cart drawer inspected on narrow screens.

## Two crop defects found and verified fixes

1. Desktop collection banner's centred vertical crop trimmed the top of the woman’s head and the man’s hair. Temporary browser CSS with object-position:center top restored headroom in both modes.
2. Story mobile image at object-position:72% center clipped the rightmost friend. Temporary browser CSS with object-position:100% center kept all three faces in frame at 390px and 360px.

Exact source changes recommended to parent:
```css
@media (min-width: 761px) {
  .sj-page-banner__media img { object-position: center top; }
}
@media (max-width: 760px) {
  .sj-page-banner--story .sj-page-banner__media img { object-position: 100% center; }
}
```

Eight temporary-CSS proof cases passed: Women/Men desktop and Story 390/360, each in Light/Dark. Parent applied these exact verified selectors to theme/assets/sj-base.css and rebuilt the preview with all 72 bundled gallery images.

Final saved-CSS verification also passed all eight cases, with **no CSS injection**. Computed positions are 50% 0% for both desktop collection banners and 100% 50% for Story at 390px and 360px, in Light and Dark. All eight final screenshots were individually inspected: collection models retain full heads/headroom and all three Story faces remain inside the narrow frame. Images loaded in the correct mode; no overflow or JavaScript errors were found. No crop defects remain.

## Evidence

- campaign-v3-report.json — all 30 automated case records and zero failures.
- campaign-v3-screenshots/ — banners and headers for all 30 cases, six footer and six cart screenshots.
- campaign-crop-proof.mjs — temporary browser CSS proof script.
- campaign-crop-final.mjs and campaign-crop-final-report.json — actual rebuilt source verification, eight passes with no injected CSS.
- campaign-v3-screenshots/*-crop-final.png — eight final saved-CSS screenshots; these supersede the temporary proof captures.
- Representative proof captures:
  - campaign-v3-screenshots/women-light-1440-crop-proof.png
  - campaign-v3-screenshots/men-dark-1440-crop-proof.png
  - campaign-v3-screenshots/story-light-390-crop-proof.png
  - campaign-v3-screenshots/story-dark-360-crop-proof.png

The floating Light/Dark comparison control is an optional theme setting, enabled for this review. It can appear over an element screenshot because it remains fixed to the viewport. It can be disabled in Theme settings and is not banner artwork.
