# DearBody: recommended storefront UI

**Hero revision, 23 September 2026:** The user selected an at-home collection display and supplied six priority scents: Mojito Metallique, Amber Oud Silk, Mistened Narcissus, Oud Mirage, Charme Envoûtant, and Rtulle & Satin. The hero uses warm wood, a cream wall, a burgundy tray and an orange lamp, with actual label and liquid colors retained. Publication guidance is applied to this website hero; this is not a 12-image product gallery. See `banners/home-collection-v03/BRAND_ALIGNMENT.md`. The single-Citrus and café directions are superseded. Display copy uses a Helvetica Neue Bold fallback; production requires the licensed Cenzo Flare Bold and Helvetica Now Display fonts.

Research date: 23 September 2026. Scope: the Philippine fragrance storefront described in this workspace. This is a design recommendation based on the brand guide, existing artwork, current reference sites and published UX research; it is not a measured conversion result or an audit of the live DearBody store.

## Recommendation

Use a **warm editorial storefront, designed around clear product comparison on mobile**. Cream should carry the shopping surfaces; burgundy should anchor navigation, headings and purchase actions. Let the yellow, lilac, orange and red packaging provide variety inside one consistent layout. Large, tactile photography and short display headlines supply the personality.

This follows DearBody’s stated positioning: premium, warm, vibrant, playful and approachable. The existing artwork is strong enough to support this direction. The main work is hierarchy, product information and purchase clarity.

## References and what they contribute

| Reference | Observed pattern | DearBody application |
|---|---|---|
| [PHLUR](https://phlur.com/) | A prominent product campaign, compact header and product cards that pair names, sizes and buying controls. | Use the clear product hierarchy and short campaign copy. Keep DearBody’s warmer palette and display typography. |
| [Sol de Janeiro](https://soldejaneiro.com/) | Expressive photography, emphatic campaign typography and a shop-by-scent route with recognizable scent descriptions. The inspected session also showed several overlays competing for space. | Use color and sensory storytelling; keep the launch experience focused on one primary action at a time. |
| [Sunnies Face Philippines](https://ph.sunniesface.com/collections/eau-de-parfum) | A local fragrance collection with clearly visible peso prices, distinct product identities and a scent-discovery entry point. Its homepage pairs a warm pale background with a strong wordmark and large campaign imagery. | Use it as a local presentation reference. Its much broader catalog does not justify a similarly complex menu for DearBody. |
| [Snif](https://snif.co/) | Product summaries put fragrance-family words and short descriptive copy close to buying controls. | Adopt the concise scent vocabulary after DearBody’s actual notes and families are confirmed. |

PHLUR, Sol de Janeiro and Sunnies Face were inspected visually in a browser. Snif’s published page content was reviewed. These are pattern references, not evidence that copying their designs will improve conversion.

## Visual system

| Element | Recommended treatment |
|---|---|
| Main canvas | Soft cream `#F4E3CB`; generous spacing; fine burgundy separators when needed. |
| Primary ink and brand blocks | Deep burgundy `#5C0006`. Use a burgundy footer and occasional editorial panel. |
| Primary buttons | Rich red `#9A1106` with cream text. Keep one dominant purchase action. |
| Accents | Burnt orange `#D46601` and golden tan `#E9A250` in short highlights and photography. Use dark text over these lighter accents. |
| Display type | Cenzo Flare Bold for short hero and section headlines. Use Helvetica Neue Bold as the concept fallback until licensed webfont files are available. |
| Reading and controls | Helvetica Now Display, falling back to Helvetica Neue/Arial. Sentence case for product details and controls. |
| Shape | Mostly straight edges with a modest 4–8 px radius on controls. Avoid turning every section into a floating card. |
| Photography | Actual bottles and canisters, consistent product scale, warm editorial lighting, and the already prepared Filipino lifestyle scenes. |
| Motion | Brief state transitions; honor reduced-motion preferences. Use a still hero initially. |

Suggested starting sizes, to validate in the real theme: body 16–18 px; mobile headline 36–44 px; desktop headline 56–72 px; primary controls about 48 px tall. These are design choices, not research-derived optimum values.

The product galleries contain cool scenery and cobalt props. Preserve those approved images while keeping the interface itself warm, as specified in the brand guide.

## Homepage order

1. **Compact header:** DearBody wordmark, Shop All, Our Story, Contact and bag. On mobile, show a menu control, wordmark and bag. Put shopping first inside the menu.
2. **One campaign hero:** “A SCENT JOURNEY,” the approved London-formulated positioning line and “Shop the Collection.” Use the supplied landscape and portrait banner crops with live HTML text.
3. **Priority collection:** lead with the six owner-selected scents in a three-column desktop and two-column mobile grid once their final catalog assets and details are ready. Include exact names and verified sizes and prices. Keep imagery and text alignment consistent. The existing four-card section remains an illustrative catalog sample, not the complete priority assortment.
4. **Selection help:** add a compact comparison of verified scent families and notes when the brand supplies them. At present, descriptions of packaging cannot answer what a fragrance smells like. This content is a higher priority than a quiz.
5. **Everyday lifestyle:** a small set of distinct scenes linked to the corresponding fragrances. Keep model and campaign imagery separate from customer testimonials.
6. **Brief brand story:** London formulation and Filipino lifestyle, using the approved copy and story artwork.
7. **Signup and useful footer:** Shop All, Our Story, Contact and actual shipping/returns/privacy information. Add real customer reviews when available.

Baymard notes that small catalogs may not need intermediary category pages. With four documented launch products, direct shopping is the better starting hypothesis. [Category-page research](https://baymard.com/blog/ecommerce-category-page)

## Product page and purchase flow

On desktop, place the gallery beside a clear purchase column. On mobile, keep the product name, volume and price near the first image, followed promptly by the purchase control. Display the approved gallery in its established order, with thumbnails, zoom and a visible image count. Put ingredients and care in readable page text as well as the existing infographic.

At launch, the purchase area should contain the exact name, confirmed product type, 50 mL volume, real peso price, stock state, quantity and Add to bag. Place shipping cost or a location-dependent estimate, an achievable delivery estimate and a returns link nearby. A sticky mobile purchase bar is worth testing once these facts are available; it must not cover content or focused controls.

Baymard’s product-page research supports visible purchase information, total-cost clarity and images that communicate physical scale. Use accurate product photographs for scale claims; check generated lifestyle images against the real bottle. [Product-page research](https://baymard.com/research-articles/current-state-ecommerce-product-page-ux?r=0)

Keep checkout available to guests, and show only payment methods actually enabled for the store. GCash, Maya, COD, free shipping and delivery-time promises are not verified DearBody facts. [Guest-checkout research](https://baymard.com/research-articles/make-guest-checkout-prominent)

## Shopify fit and priorities

Continue evaluating the existing **Horizon draft** before buying a replacement theme. Shopify lists image galleries, zoom, ingredients, shipping information and a slide-out cart among Horizon’s capabilities. This makes it a plausible implementation base, not a guarantee that every desired arrangement is available without customization. [Official Horizon listing](https://themes.shopify.com/themes/horizon/presets/horizon)

Priority 1: implement the palette, typography hierarchy, correct mobile hero crop, four-product grid and clear product page in the draft. Complete real product and fulfillment data before enabling purchase.

Priority 2: add the verified scent comparison, usable shipping information, payment visibility and genuine reviews. Test the complete cart and guest-checkout journey.

Later: a scent quiz, additional filters, samples, bundles or loyalty features only when the catalog and business operations support them.

The latest local Codex handoff records incomplete draft styling and pending image selection. This research did not edit or verify the current Shopify admin state.

## Validation and limits

Check the actual build at 360, 390, 768 and 1440 px, plus 200% zoom and keyboard navigation. Normal text needs at least 4.5:1 contrast; large text 3:1. Design touch controls around 44–48 px, while distinguishing this recommendation from WCAG 2.2 AA’s 24 px minimum and its exceptions. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Test with a small first round of target shoppers: can they identify what is sold, compare two fragrances, find the bottle size and delivered cost, and buy as a guest? Record task completion, hesitation and errors. Then use actual traffic to assess product clicks, add-to-bag and checkout completion. No uplift estimate is supported by this research.

Local source of truth: `BRAND_GUIDE.md`, `brand.tokens.json`, `output/website/SHOPIFY_CONTENT_PREP.md`, `output/website/CODEX_BUILD_PROGRESS.md`, and approved banner/product assets. Prices, scent profiles, concentration, stock, policies, contact details and official logo/webfont assets remain content dependencies according to those files. See `UI_UX_EVIDENCE.md` for the research appendix.

## Concept preview verification

The accompanying homepage concept uses existing DearBody artwork and the approved Georgia/Arial font fallbacks. Prices and buying controls are omitted from this illustrative concept because the commercial data is unconfirmed; they belong in the launch UI described above. No live store was changed.

Static checks passed for image embeds, alt text, unique IDs, local navigation targets and JavaScript syntax. Calculated contrast is 11.45:1 for burgundy against cream and 6.80:1 for rich red against cream. The local browser preview was blocked by the browser URL policy, so rendered desktop/mobile layout and interaction QA remain unverified. The responsive concept is for direction review, not a production-ready theme.
