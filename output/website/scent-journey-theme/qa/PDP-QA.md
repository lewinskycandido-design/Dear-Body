# Product page implementation and checks

The product page is a new Shopify OS2 section, separate from all previous DearBody themes. Its CSS imports no legacy styles. Light and Dark share product assets, live Shopify objects, structure and interactions; semantic tokens control the surrounding art direction.

## Product banner revision — PASS

The native [sj-product-banner section](../theme/sections/sj-product-banner.liquid) is now the first section in `templates/product.json`, before the existing product/gallery section. It introduces the current product in a full-width Light/Dark banner. Its title reads `product.title`; the statement reads `custom.hero_statement` first, then `sj-approved-copy` for a recognized launch handle. An unavailable statement is omitted.

The default image comes from `sj-product-image`: the already-audited frame 01 packshot when the bundled gallery is eligible, otherwise the native featured image. An optional `image_picker` override supports connecting a product image metafield. With no image source, the section has a text-only layout. The banner uses `object-fit: contain`, with no cropping, image regeneration or image filters. The section's eyebrow, CTA label and statement visibility are editable.

The CTA targets `ProductDetails-<product ID>` on the original product section. The existing product H1 remains there; the banner title is a paragraph. The twelve-frame gallery, variant/purchase controls and independently scrolling desktop information panel are retained. Mobile uses normal page flow with stacked banner copy and image.

Focused banner checks passed: 28 viewport/theme cases, 378 browser checks, visual inspection across all launch scents, and final anchor alignment checks. See [PRODUCT-BANNER-QA.md](PRODUCT-BANNER-QA.md). Five native Liquid fallback scenarios in `product-banner-fallback-qa.cjs` cover a future product image, no-image layout, image override, approved defaults and custom statements. Theme Check is clean; the rebuild validates 62 source files and 23 routes. The validation results below preserve the earlier product/gallery baseline.

## Layout contract

- At 1100px and wider, the product section is a 56:44 split with viewport height minus the global `--header-height`. Product media has no vertical scrolling. The right panel has `tabindex="0"`, a labelled region and independent `overflow-y: auto`.
- At smaller widths, media uses a horizontal snap gallery, followed by natural document flow. The mobile purchase bar appears only after the primary purchase area passes above the viewport and hides after the product section ends.
- No wheel or touchmove events are intercepted. Internal scrolling uses normal browser scroll chaining, allowing the customer to leave the product section naturally.
- Media switching supports thumbnails, previous/next controls, arrow/Home/End keys and horizontal touch scrolling. A native dialog supplies an enlarged image with Escape/close and focus restoration. Hidden media is inert, and videos are paused when deselected.
- Light media has warm daylight color behind untouched images. Dark uses burgundy surfaces with an amber atmosphere. No image filters, blending, tinting, recoloring or packaging modification is applied.
- Each of the six exact Shopify launch handles has its own subtle amber spotlight placement, spread and strength. `data-product-handle` controls only the surrounding media-stage background.

## Data and purchase contract

- `form[data-sj-product-form]` is a native Shopify product form with a named variant selector and quantity input. Prices and comparison prices use Shopify money filters, with selected-variant availability, media and quantity rules.
- Variant selection updates the URL, price, sale price, availability, express checkout visibility, purchase buttons and variant media. No hardcoded prices or invented availability.
- The native dynamic checkout output is preserved. The commerce script may enhance the form with Ajax; the primary native form remains the purchase source for the mobile button.
- `sj:variant-change` bubbles with variant, section ID and form. `sj:product-form-settled` from the commerce script resynchronizes state after Ajax button restoration, including concurrent variant changes.
- Shopify metafields take priority for all product copy. When hero statement, scent description or a benefit field is empty, the six launch handles fall back to the owner's approved content in `release-theme/approved-product-copy.json`, represented as plain text in `sj-approved-copy.liquid`. This reuses approved content only; no legacy visual implementation is imported. Unknown products receive no launch-copy fallback. Five source-verified official note lists are also available as field-by-field fallbacks; Rtulle & Satin notes remain empty. Occasions, intensity and detailed scent-character fields require populated Shopify metafields. Ratings require real `reviews.rating`; no placeholder review counts.
- Shipping and returns use native policy content when available, then configured Theme Editor URLs, then locale-aware `/pages/shipping` and `/pages/returns` links.
- Shopify's upload validator rejected two `page` settings in this section even though local theme-check passed. The shipping/returns selectors were corrected to `url` settings (`shipping_url`, `returns_url`), preserving native-policy priority and locale-aware fallback links. Native upload is the decisive schema validation.
- Recommendations use Shopify's native recommendation endpoint and the separate `sj-recommendations` section. Returned cards mount inside the right panel. A failed recommendation request does not block purchase.
- App blocks are supported after the primary purchase area. Product structured data uses Shopify's `structured_data` filter.

## Validation performed

- Node syntax check passed for `sj-product.js`.
- Shopify Liquid HTML parser accepted both new sections.
- Shopify CLI theme-check returned no findings for `sj-product.liquid` or `sj-recommendations.liquid` during this implementation pass.
- jsdom interaction tests passed for available/sold-out variant updates, comparison price visibility, locale-preserving variant URLs, min/step/max quantity enforcement, quantity controls, variant media, thumbnails, keyboard navigation, image dialog open/close, mobile gallery positioning, mobile purchase-bar visibility, primary-form submission, recommendation mounting and custom-element cleanup.
- The tests use synthetic stock states to cover purchase controls. They do not change the real catalog's availability and do not claim a live Shopify checkout was completed.
- Approved-copy validation compared every generated snippet field with the owner-approved source and rendered all six launch products without metafields: all received exactly five benefits and the correct hero statement, live test price stayed intact, and unverified notes stayed hidden. Later, five exact-handle top/heart/base note lists were verified from the user-supplied official website and added as field-by-field fallbacks; Rtulle & Satin remains without inferred notes. Partial native metafields correctly overrode fallback fields. An unknown product received no invented launch copy. Localized support links resolved correctly. Liquid parsing, theme-check and the existing interaction suite passed again after this change.
- Preview/browser agent reported the desktop Dark product at 1440 × 1000 has one H1, no horizontal overflow or JavaScript errors, all images loaded, and an independently scrolling 890px information viewport containing 2274px of content. The visual capture is `qa/product-initial.png`.

## Integration checks still required on Shopify

Verify actual accelerated payment buttons, real cart errors, third-party app blocks, model/video media where supplied, live recommendation results and installed metafield definitions in an authenticated Shopify preview. The prior desktop/media layout and both visual themes were checked in the local browser at the final header height; results are in BROWSER-QA.md. The new banner's current verification is tracked separately in PRODUCT-BANNER-QA.md. Local checks do not certify Shopify runtime behavior or Theme Editor dynamic-source selection.

The current launch catalog uses simple variants. The native variant selector uses Shopify's `product.variants` Liquid output; a future catalog with more than 250 variants per product should use Shopify's high-variant option-value section-rendering approach before launch.

## Official references

- [Shopify product templates and native forms](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/overview)
- [Shopify variant support](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants)
- [Shopify product media](https://shopify.dev/docs/storefronts/themes/product-merchandising/media/support-media)
- [Shopify variant quantity rules](https://shopify.dev/docs/api/liquid/objects/variant)
- [Shopify Product Recommendations API](https://shopify.dev/docs/api/ajax/reference/product-recommendations)


The subsequent homepage hero/copy revision does not change the product gallery or its purchase behavior. The global footer now uses distinct copy rather than repeating the London-to-Philippines headline on product pages.
