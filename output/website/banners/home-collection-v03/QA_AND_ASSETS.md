# Home collection hero — asset and QA record

Created 23 September 2026 with the built-in ImageGen tool. Owner direction: six priority scents displayed as a perfume collection at home, applying DearBody publication guidance. The supplied photographs are the product identity references. See `BRAND_ALIGNMENT.md` and `PROMPTS.md`.

## Files

| File | Dimensions | Use |
| --- | --- | --- |
| `dearbody-home-collection-desktop-v03.png` | 1774 × 887 | Desktop photographic master, 2:1 |
| `dearbody-home-collection-desktop-v03.jpg` | 1774 × 887 | Desktop web export |
| `dearbody-home-collection-mobile-v03.png` | 1122 × 1402 | Mobile photographic master, approximately 4:5 |
| `dearbody-home-collection-mobile-v03.jpg` | 1122 × 1402 | Mobile web export |
| `dearbody-home-collection-desktop-preview.jpg` | 1280 × 640 | Compressed inline preview |
| `dearbody-home-collection-mobile-preview.jpg` | 680 × 850 | Compressed inline preview |

The four master/web export files have embedded sRGB profiles. Native generated resolution is retained without upscaling. These website banners deliberately use responsive hero proportions rather than the square product-gallery format.

## Visual review

- Rejected first desktop draft: one extra unlabelled bottle.
- Corrected desktop: exactly six distinct scents, three ivory labels and three black labels. Product names, labels, caps, glass bodies and liquid color assignments visually checked against owner photos.
- Desktop composition: polished home context; warm wood and cream surroundings, burgundy tray and orange lamp. All six bottles visible and grounded; no scent claims or campaign text baked into the image.
- Mobile composition: three bottles behind and three in front, with labels unobscured and all six identities visible. Preserve the complete composition. Independent visual review passed both desktop and mobile, including the ENVOÛTANT circumflex and RTULLE spelling.
- The scene follows the publication direction: visually appealing, vibrant, approachable and product-forward. This is generated campaign imagery based on the product references, not an unaltered documentary photograph.

## Responsive use

The local storefront concept now consumes both new images. The desktop version preserves its 2:1 ratio; compact copy uses the left 28%. At widths up to 900 px, live copy sits above the photograph. At widths up to 700 px, use the separate 4:5 mobile image. Use `object-fit: contain` so no scent is removed by a cover crop.

Headline and supporting copy remain live text. The concept uses Helvetica Neue Bold as a display fallback; exact production typography requires Cenzo Flare Bold and Helvetica Now Display. The typed header wordmark is a preview placeholder, not replacement logo artwork.

Suggested alt text: Six priority DearBody perfumes displayed on a burgundy tray in a sunlit home.

HTML asset integrity, anchor targets, fragment size and JavaScript syntax were checked. This is a local concept update, not a Shopify deployment or a browser-verified theme integration. The existing four-card product section is an illustrative catalog sample; this change replaces the campaign hero, not the product catalog.

Final master and web export checksums are in `asset-lock.sha256`.
