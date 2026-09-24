# DearBody Scent Journey — Same-page COD Orders Update

**Current update — published 24 September 2026:** Shopify CLI and independent public requests confirm **DearBody COD Order Update**, theme **167085703233**, is live; theme **167085146177** is retained for rollback. Women/Men collection selections and product-page quantities hand off to an EasySell cash-on-delivery popup on the same page. **Add to order** opens the selection details; **Check out** opens the delivery form. Customers enter their address once in that popup. The theme does not show an order-success message merely because the popup opened. The [public-store audit](qa/cod-live-audit.json) passed all 18 routes, 174 locked asset comparisons and seven current script-source comparisons with zero findings; EasySell was embedded on all 18 pages. See [the COD update and verification evidence](UPDATE-COD-ORDERS.md).

EasySell is installed on the approved **Free plan: 60 orders per month**, with usage observed at **1 of 60** after the test. All four paid SMS/WhatsApp messaging services were rechecked as **Deactivated**. The app is configured for **No redirection (Show thank you message only)**. Before publication, the authorized test **#1001** saved Oud Mirage ×2 plus Amber Oud Silk ×1 at **₱2,397 with free shipping** and displayed **Order placed** on the same PDP. The test was then canceled, voided and archived, with three bottles restocked and customer notification unchecked. Focused Women 390px and Men 320px checks also passed, including exact popup totals and no horizontal overflow. See [browser evidence](qa/COD-ORDERS-BROWSER-QA.json). All 294 local integration checks and source-asset locks passed. App installation and settings belong to the store and are not included in a theme ZIP; the local preview cannot place orders.

**Previous verified release:** The Order Quantities Update was published on 24 September 2026 as theme `167085146177`. Its tests verified native Shopify checkout totals and COD and stopped before Complete order. Its public audit and archive describe that earlier redirect-based flow, not the current COD popup update. See [the historical release note](UPDATE-ORDER-QUANTITIES.md) and [deployment evidence](qa/LIVE-STORE-DEPLOYMENT.md).

This is a new Shopify Online Store 2.0 theme. One upload ZIP contains both art-directed visual directions; choose **Theme settings → Visual direction → Visual theme**. An optional sun/moon icon sits inline with the navigation actions on desktop and mobile. The moon switches to Dark; the sun switches back to Light. The choice persists while browsing in the same tab. Disable **Show sun/moon switch in navigation** to keep only the configured direction.

The browser favicon defaults to the round official DearBody emblem on a transparent background, with light/dark browser appearance support. The Theme Editor favicon picker can override it. The local comparison and image-review pages use the same emblem.

The homepage opens with a full-width **MAKE IT PERSONAL.** hero banner. Three photographic features lead into large, fully clickable **Women** and **Men** lifestyle campaign panels. The banner image runs edge to edge below the header, with its text aligned to the page content. The hero’s “Explore the collections” button scrolls to those panels. The header offers Search and the Light/Dark switch; the shopping bag entry is removed from the primary flow. The opening hero remains product-free, and there is no individual product grid or card shopping on the homepage. Three new photographic features sit between the main hero and the Women/Men panels: magnetic cap, collectible bottle display, and free shipping on 2 or more items. The three feature sections have no buttons; the existing Women/Men panels remain the collection entry points. The shipping photo shows two closed retail canisters, each individually protected in clear bubble wrap. The campaign links use plain “Explore Women” and “Explore Men” labels without decorative arrows. Gallery controls retain their accessible colorful chevrons.

Women, Men, Shop All, Scent Finder, Our Story, FAQ, and Shipping use full-width header banners directly below the navigation. Banner text and the product grids, quiz, and story content below retain consistent page gutters. The earlier full-width layout passed 23 responsive cases and 258 checks; see [Page banner width QA](qa/PAGE-BANNER-WIDTH-QA.md).

The existing 22 banner and gateway photographs were regenerated in a pop editorial direction inspired by the supplied publication-materials reference, including the six individual product banners. Bold scarlet, cobalt and lemon accents, tactile clothing and accessories, natural sunlight and playful Filipino confidence run through both visual modes. Dark keeps bright daylight photography with richer wardrobe colours. Homepage heroes and Women/Men gateways remain product-free. Original images and exact built-in ImageGen prompts are retained in [the current campaign folder](campaign-v9-pop-editorial/README.md).

Homepage, page, product and footer banners keep the same full-width height: `clamp(540px, 43vw, 650px)` on desktop and `600px` on mobile. Mobile text remains over the photographs, with Cenzo Flare Bold headings and Helvetica Now Display Light supporting copy. Women/Men category gateways retain their portrait layout. Current verification is recorded in [Pop Editorial banner QA](qa/V9-BANNER-REFRESH-QA.md). The [v8 banner checks](qa/V8-BANNER-REFRESH-QA.md) and [earlier shared-size checks](qa/UNIFIED-BANNERS-QA.md) remain historical evidence for their respective revisions.

FAQ and Shipping now have distinct warm, colorful photographs in the same visual style. Their full-width headers use live brand typography and mobile text overlays, with no banner buttons. The Shipping image shows two closed canisters individually bubble-wrapped inside a carton. [Originals and exact generation prompts](campaign-v11-customer-care/README.md) and [responsive QA](qa/CUSTOMER-CARE-BANNER-QA.md) are retained locally.

## Deliverables

- `DearBody-Theme-Update-COD-Orders.zip`: current published theme, saved in the project and Downloads; **275 native files**, **39,797,927 bytes**, SHA-256 `e0cf3d65f6e59a306d5d1cf3d83a2c8db2ba8f4edb921883b43f7215dc1827ce`. The release owner verified the Downloads copy against this size and checksum. Editable source is in `theme/`. [UPDATE-COD-ORDERS.md](UPDATE-COD-ORDERS.md) records the completed public-store audit.
- Historical `DearBody-Theme-Update-Order-Quantities.zip`: earlier native-checkout release, with **273 native files**, **39,793,842 bytes**, SHA-256 `f6e6f16d54e59a7595643e98db3960cb362c2aa3ed0fee1b5021fec2654da8c5`. It does not contain this COD popup update. Copies are in this project and Downloads.
- `campaign-v10-home-features/` and `campaign-v11-customer-care/`: five new images, originals, optimized JPEGs, prompts and provenance.
- `theme/`: editable source, with Liquid, JSON templates, section groups, CSS and vanilla JavaScript. No React or headless dependency.
- `reviewed-product-galleries/`: current import of the owner's selected twelve-frame galleries for the six active fragrances, with source mapping and website derivatives.
- Earlier archive — `regenerated-galleries/`: the previous website-generated galleries, typography exports, contact sheets, provenance and QA records.
- `campaign-v9-pop-editorial/`: current 22-photo pop editorial refresh, accepted original PNGs, production JPEGs, exact prompts, provenance and checksums. Both modes use bright daylight photography inspired by the supplied reference.
- Earlier archive — `campaign-v8-warm-vibrant/`: the previous 22-photo warm, vibrant campaign, with its accepted originals, production JPEGs, prompts and provenance preserved.
- Earlier archive — `campaign-v3/`: 14 category and page/footer campaign images. `campaign-v4-homehero/`: two new homepage hero photographs. Both sets include Light/Dark versions, originals and exact prompt/provenance records.
- Earlier archive — `campaign-v6-product-lifestyle/`: six individual product header lifestyle photographs at native 1774×887 resolution, each showing exactly one adult Filipino person in a believable everyday setting, with original PNGs, optimized JPGs, exact prompts, provenance and checksums.
- Earlier archive — `campaign-v7-banner-refresh/`: the previously accepted Mistened Narcissus product-banner replacement, with its original PNG and website JPG retained under `originals/` and `final-web/`. The image passed independent visual review; responsive layout QA also passed.
- `preview/`: local adapter rendering the real theme sources with a timestamped public Shopify catalog snapshot.
- `qa/`: repeatable interaction/accessibility checks, reports and screenshots.
- [All website images](http://127.0.0.1:4208/gallery-review): scrollable local review of 99 unique website artworks: 72 owner-selected product gallery frames, sixteen category/page/footer/homepage campaign photographs, six product header banners, three new homepage feature photographs, and two new FAQ/Shipping header photos.

## Preview locally

Open [comparison](http://127.0.0.1:4208/compare), [Light](http://127.0.0.1:4208/?visual_theme=light), or [Dark](http://127.0.0.1:4208/?visual_theme=dark) while the local server is running.

To restart: install dependencies in `preview/` with `npm install`, then run `npm run preview`. The comparison page is a local review tool; it is not included in the Shopify upload ZIP.

## Install the ZIP yourself

The current store is already published. For another installation, EasySell must also be installed, activated and configured in the target store; uploading a theme alone does not provide the order service or copy external app settings.

1. In Shopify, open Online Store → Themes → Import theme → Upload ZIP. Select `DearBody-Theme-Update-COD-Orders.zip`.
2. Open the uploaded draft in the Theme Editor. The Women and Men collection pickers default to the existing `womens-perfume` and `mens-perfume` handles. Check them if installing on another store.
3. Choose Light or Dark in Visual direction. The same templates and commerce work in either direction.
4. Prepare the native page resources below; product metafields are optional overrides for the supplied launch content and Finder profiles. In the uploaded draft's Theme Editor, choose a template from the page selector, then choose its preview resource. A theme ZIP does not create Shopify pages, policies or product metafield values.
5. The website uses supplied **Cenzo Flare Bold** for display headings and **Helvetica Now Display Light** for body text. The exact WOFF2 files are bundled; the Display face and body use weight 300. This website selection replaces Helvetica Now Text Regular. Optional WOFF2 URL fields, including the bold override, remain available; without a separate bold file, emphasized interface text uses browser-synthesized emphasis. The earlier website-generated gallery typography used Cenzo Flare Bold / Helvetica Now Text Regular and remains documented in the archived `regenerated-galleries/` set. The current gallery import preserves the owner's selected raster artwork as provided; it does not re-typeset the images. Transparent dark and white original logos from dearbody.com are bundled unchanged. Canva remains the identity authority for palette, tone and art direction. The global logo has no PH suffix; custom official PH exports can override it through the image pickers.
6. Review the uploaded draft, stock, shipping, payment setup, policies, apps and checkout before choosing to publish it.

Selling prices, stock, overselling and payments remain native Shopify data. The original reference of ₱1,099 for the six active ₱799 fragrances is owner-approved and displayed by the theme. The six active fragrances display **Now ₱799**, **Original ₱1,099**, **Save ₱300** and **27.3% OFF**. The percentage is calculated from the actual prices and rounded to one decimal: (1,099 − 799) ÷ 1,099 × 100. The owner's later original-price correction supersedes the earlier 20% offer and ₱998.75 reference. This reference applies only to the six active handles at PHP 799 with uniform prices. Other prices, currencies and products retain native compare-at pricing; mixed-price cards omit a uniform discount claim. Price, reference, savings amount and percentage update together on variant changes.

The percentage appears on product pages, collection and search cards, Scent Finder results, recommendations and predictive search. The selling price is already discounted; the theme does not subtract another discount in the bag or modify checkout prices. The earlier public snapshot records ₱799 selling prices for all six scents; its stock values are historical and must not override current native Shopify availability. Only Mojito has a native ₱1,099 compare-at price; the other five use the owner-approved reference in the theme. To show that reference in other Shopify sales channels, configure their product compare-at prices separately.

Free shipping on **2 or more items** is promoted in the global header and footer, the homepage photographic feature and product purchase area. Quantity changes and the optional second-fragrance selector update the estimate: ₱80 shipping for one item, free shipping for two or more in the Philippines, including two bottles of the same scent. The native automatic quantity discount, ₱80 base rate and Cash on Delivery are configured and were verified in Shopify checkout. Each shipping-photo canister is individually bubble-wrapped. The native cart remains a fallback, with quantity-aware shipping messaging.

Current validation is recorded in [Homepage and gallery update QA](qa/HOMEPAGE-FEATURES-QA.md). The [earlier offer QA](qa/OFFERS-QA.md) remains historical evidence for the earlier pricing revision.

The Display font revision also applies to the local preview UI. Font-loading and layout verification passed 16 viewport/theme cases and 182 checks, plus both local review tools; see [Display font QA](qa/DISPLAY-FONT-QA.md). Earlier browser/font reports document their tested revisions and do not certify this latest font change. Source packages and the distinction between live website type and locked image typography are documented in [the font source notes](source-assets/fonts/README.md).

## Native page resources

The live-store setup found that no Shopify Page resources existed. Our Story, Scent Finder, FAQ, Shipping and Contact have now been created and assigned their matching templates. Footer legal links only appear for a populated native policy or an existing published page with content; the store's published Privacy policy is preserved, and unavailable Terms is omitted. Header, footer and collection navigation now share locale-safe configured link handling. See `qa/NATIVE-NAVIGATION-QA.json` and the deployment verification report.


Create or connect these Shopify pages. Existing Our Story and Contact pages can be kept. Preview each matching template within the draft Theme Editor. Shopify Admin's template assignment dropdown lists only templates in the current live theme, so final resource assignment is a launch step once this theme is made live; previewing a draft template does not assign it. See [Shopify's template guidance](https://help.shopify.com/en/manual/online-store/themes/theme-structure/templates).

| Page handle | Theme template |
| --- | --- |
| `our-story` | `page.our-story` |
| `scent-finder` | `page.scent-finder` |
| `faq` | `page.faq` |
| `contact` | `page.contact` |
| `shipping` | `page.shipping` |
| `privacy` | `page.privacy` |
| `terms` | `page.terms` |

Shipping displays the owner's instructions: Luzon 2–3 days, Visayas 3–5 days, and Mindanao 5–10 days. Shipping fees apply to orders with 1 item; orders with 2 or more items receive free shipping. The homepage announcement, product information, native cart fallback, shipping page and FAQ use these terms. Returns links, FAQ and template have been removed. Privacy and Terms continue to show native Shopify policy content when available, then the merchant's page content.

The ZIP displays shipping estimates but does not itself create shipping settings. This store now has a verified ₱80 Philippine base rate and an active native free-shipping discount for 2 or more items; the earlier price threshold was removed. Cash on Delivery is active. A different store needs its own configuration. See [Shopify configuration and checkout evidence](qa/SHOPIFY-CHECKOUT-CONFIGURATION.json).

At launch, assign `collection.women` to Women's Perfume and `collection.men` to Men's Perfume. The default collection template serves Shop All. Product templates use live Shopify prices, compare-at prices, variants, availability and product identifiers.

## Scent Finder and optional product metafields

The Finder works with the six real launch handles without a metafield import. [The native profile snippet](theme/snippets/sj-finder-profile.liquid) supplies editorial defaults based on the owner's approved scent copy for Mojito Metallique, Mistened Narcissus, Amber Oud Silk, Charme Envoûtant, Oud Mirage and Rtulle & Satin. Mood and occasion labels are discovery suggestions; “scent feel” describes airy, sweet or deep character, not longevity, projection or measured strength. Product titles, IDs, prices, availability and links remain native Shopify data.

Five questions cover collection, mood, scent style, occasion and scent feel. Collection filters the candidates first. Within that collection, matching scent style scores 5, mood 3, occasion 1 and scent feel 1. The result shows only the highest-scoring scent, with the choices it shares. Ties retain the existing catalog order. Skipping every preference gives one clearly labelled scent to explore rather than claiming a personalized match; choosing only a collection still limits that suggestion to the chosen collection. The result uses a single-column card and singular copy. See [Single-result Finder QA](qa/FINDER-SINGLE-RESULT-QA.md) for this revision.

Non-empty `custom.mood`, `custom.scent_character`, `custom.occasion` and `custom.intensity` metafields override their corresponding defaults. An explicit `custom.scent_finder_enabled = false` excludes a product; an absent value does not require setup. Sold-out fragrances remain discoverable with their true stock state unless the section's “Available products only” setting is enabled. The section's collection picker can narrow the six-handle catalog. If no eligible products remain, the page shows an honest empty collection message.

Current revision verification is tracked in [Scent Finder QA](qa/SCENT-FINDER-QA.md). The revised flow passed 16 browser journeys, 550 checks and eight accessibility scans with zero violations, plus native profile, scoring and interaction checks.

Optional product fields in namespace `custom`:

| Key | Type | Purpose |
| --- | --- | --- |
| `scent_finder_enabled` | boolean | Set false to exclude a launch fragrance |
| `scent_character` | list of single-line text | Override Finder scent-style traits |
| `mood` | list of single-line text | Override editorial mood suggestions |
| `occasion` | list of single-line text | Override editorial occasion suggestions |
| `intensity` | single-line text or list | Override Finder scent-feel labels; not a performance claim |
| `personality` | single-line text or list | Optional approved product copy; not a Finder scoring question |
| `hero_statement` | single-line text | PDP hero sentence |
| `short_description` | single-line text | Card/PDP introduction |
| `scent_description` | rich text or multi-line text | Long product copy |
| `bullet_1` … `bullet_5` | multi-line text | Five product benefits |
| `top_notes`, `heart_notes`, `base_notes` | list of single-line text | Verified notes only |
| `gender` | single-line text | Merchant classification, if needed |

`APPROVED-METAFIELD-IMPORT.json` is an optional developer/reference payload containing the supplied scent copy, revised product benefits, explicit fragrance traits and source-verified official note lists. It is not a file Shopify can import directly and is not required for the Finder. If you choose to configure overrides, enter values manually or use an import/API adapter that resolves product IDs and serializes list values for Shopify. It was **not applied to Shopify**. Verified top/heart/base notes are supplied for five launch scents from dearbody.com; Rtulle & Satin's note list remains unverified and blank. Empty intensity and occasion fields in that reference payload do not disable the separate editorial defaults in the theme snippet. No inventory values or Shopify Admin data were changed to enable the Finder.

The supplied hero statements, long descriptions and five revised benefits render through a theme content fallback for the six launch handles. “Why you'll love it” now covers suggested occasions and outfit pairings, the verified 50 ml format, bottle design and gift presentation. It does not repeat the olfactory description in “The scent”. Wear and style ideas are editorial suggestions, not performance claims. Native metafields override those values field by field. The same precedence applies to the five source-verified note lists.

## Optional mood metaobjects

The optional Mood discovery section accepts `scent_mood` metaobjects with `title` (single-line text), `description` (multi-line text), and `collection` (collection reference). Enable storefront access. These are optional; the revised homepage uses a hero banner and Women/Men collection gateways.

## Owner-selected product galleries

The current 72 gallery images come from the owner's selected [Gallery Review, 24 September 2026](../../product-listing/GALLERY_REVIEW_2026-09-24.html), at `output/product-listing/GALLERY_REVIEW_2026-09-24.html`. Only the six active fragrances are imported: Mojito Metallique, Amber Oud Silk, Mistened Narcissus, Charme Envoûtant, Oud Mirage and Rtulle & Satin. The source folder `rtulle-and-satin` maps to the live handle `rtulle-satin`; the other eight reviewed scents are outside the website scope.

Source PNGs remain unchanged. `reviewed-product-galleries/` records the current source mapping and website exports: 1200px JPEGs plus 160px thumbnails. The 72 images are embedded as theme assets, so the ZIP displays them without editing Shopify's media library. Shared frame-01 packshots supply collections, search, Finder, recommendations and cart images. Prices, availability, titles and purchase data still come from the actual Shopify product. Current verification is recorded in [Review gallery import QA](qa/REVIEW-GALLERY-IMPORT-QA.md).

Each product uses all twelve selected images in this order: **Packshot → Scent description → Who it fits → Product profile → Ingredients and care → Lifestyle portrait → Product in hand → Everyday fragrance moment → Spray in motion → Packaging reveal → Magnetic cap detail → A scent journey**. Both slides and thumbnails retain source-frame order `01, 11, 12, 08, 09, 05, 06, 07, 02, 03, 04, 10`. The source PNGs are preserved while the new website derivatives replace the previous gallery JPEGs and thumbnails. The earlier order-only revision is documented in [historical gallery order QA](qa/GALLERY-ORDER-QA.md).

The gallery advances every eight seconds once at least half of it is visible. Clicking an image opens the existing enlarged view and pauses rotation. Thumbnails, chevron controls, keyboard browsing, zoom and touch interaction pause automatic rotation for the rest of that page visit. There is no Play/Pause button. The controls use 44px SVG chevrons, an active thumbnail outline and a current/total counter. Scrolling the gallery out of view or hiding the browser tab suspends the timer; rotation resumes when visible only if there has been no manual interaction. Reduced-motion visitors start paused and use the manual controls. Native video/3D galleries and single-image galleries do not rotate automatically.

The earlier autoplay revision passed 18 focused browser scenarios and all 195 checks, including all six product galleries, desktop/mobile Light and Dark, touch swiping, and 320px controls. Its real-time smoke check confirmed the eight-second advance, zoom pause and quantity control, and Shopify Theme Check returned zero findings. That historical interaction evidence is retained in [gallery autoplay QA](qa/GALLERY-AUTOPLAY-QA.md); the later gallery-order change leaves autoplay and interaction code unchanged.

A global setting allows reverting to native Shopify media. Products outside the six known launch handles use native media. A product with multiple variants or supplied non-image media uses native Shopify media automatically so variant-specific images, video and 3D functionality remain intact. If you later upload these galleries into Shopify itself, you can turn off the bundled-gallery setting.

## Product header banner

Each product page opens with the native [Product header banner section](theme/sections/sj-product-banner.liquid), placed first in `templates/product.json`. The six priority fragrances each have a distinct wide pop editorial photograph in `campaign-v9-pop-editorial/`. Each product scene features exactly one adult Filipino person and the authentic fragrance, with expressive styling, bright natural light and physically plausible surroundings. No extra background people or people in reflections are included. The current layout uses the shared banner heights above rather than a fixed displayed aspect ratio. Mobile copy overlays the lower photograph with cream text on a warm burgundy scrim and a crop that prioritizes the face. The same product artwork serves both Light and Dark.

The previous v6 lifestyle set, v7 Mistened Narcissus roller-rink replacement and v8 warm, vibrant set are retained as historical archives. Their earlier image and layout checks describe those revisions. Current verification is recorded in [Pop Editorial banner QA](qa/V9-BANNER-REFRESH-QA.md).

The title comes from the current Shopify product and is live **Cenzo Flare Bold** text. The scent statement uses **Helvetica Now Display Light**, takes `custom.hero_statement` when populated, then the owner's approved launch copy through `sj-approved-copy`, and is omitted when neither source has content. Neither title nor statement is baked into the photograph. An optional Theme Editor image override takes precedence and can connect to a product image metafield. Future products without a dedicated campaign asset use their native featured image; products with no image receive a text-only introduction.

The banner supplies the page's only H1. The default product template sets the detail section's `show_title: false` and `show_hero_statement: false`, removing the repeated title and statement below it. Both settings still default to true for standalone product-section use; turn them back on if removing the banner. “Explore this fragrance” scrolls to `ProductDetails-<product ID>`, where the twelve-frame gallery, purchase controls and independent desktop information panel remain. The banner's eyebrow, button label and statement visibility are editable.

The v9 banner-only refresh left the previous gallery files unchanged. The subsequent owner-selected gallery import replaces those 72 gallery derivatives while preserving all 22 v9 campaign photographs, original logos, favicons and live website fonts; the earlier artwork total was 94. Three subsequent homepage features brought that total to 97, and FAQ/Shipping banners brought it to 99 photographs. The generated decorative gallery frame is the 100th artwork; all 72 product photos and 72 thumbnails remain unchanged by the frame update. The earlier `campaign-v5-product-banners/` still-life concepts are preserved as unshipped archives. Before the mobile overlay revision, the lifestyle banner implementation passed 28 responsive browser cases and 518 checks with no failures; see [Product campaign banner QA](qa/PRODUCT-CAMPAIGN-BANNER-QA.md). [The earlier product banner report](qa/PRODUCT-BANNER-QA.md) records the previous packshot-based implementation. Both reports remain historical evidence for those revisions. The image revisions preserved native product records; subsequent checkout and shipping configuration changes are documented in the current release notes.

Native cart line identifiers, variant selection, quantities, discounts, totals and checkout remain Shopify-controlled. The local preview simulates endpoints for inspection and cannot certify a real checkout.

The full “A scent journey from London to the Philippines” statement appears only on the Our Story header. The global header, footer and Finder use distinct copy to avoid repeating it across the site. Hero and category text remain editable through their section settings.

## Light and Dark comparison

| Direction | Presentation | Strengths | Brand feeling |
| --- | --- | --- | --- |
| Light | Warm cream, burgundy type, red actions, daytime campaign photography | Clear product separation, airy reading, easy everyday browsing | Fresh, bright, inviting, editorial |
| Dark | Layered warm burgundy, cream type, amber actions, bright daylight campaign photography with richer clothing accents | Strong campaign presence, rich depth, prominent product stage | Immersive, expressive, warm, premium |

Neither direction is selected as the final brand choice. Both use the same original logo family, configured font families, native catalog and interactions.

## Activity record

During earlier native validation, before the instruction to keep this local-only, an unpublished validation draft was created in Shopify (`167070367809`). Shopify reported a PDP settings-schema issue in that partial draft, which was corrected locally. That partial draft is not the final delivery. Work then remained local until the owner's subsequent explicit request to upload the theme and fix the live store. On 24 September 2026, the navigation update was uploaded, five missing native pages were created and connected, and the cart refresh was corrected. The subsequent Direct Checkout Update was published through the authenticated Shopify CLI as theme `167083311169`. Fresh public requests confirmed its `main` role across all 18 audited routes. Fictional-address checkout tests verified prefill, one-item and two-item shipping totals and COD, stopping before Complete order.
