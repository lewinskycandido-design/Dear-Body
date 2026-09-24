# Scent Journey — source and asset audit

Audit date: 24 September 2026. New theme location: `theme/`. No previous theme stylesheet, section layout, header, footer, product card, cart appearance, or banner composition was reused.

## Keep for functionality

- Shopify Online Store 2.0 Liquid, JSON templates, section groups, native product/cart/search/recommendation routes, dynamic money values, product media and variants.
- Purely technical LiquidJS local adapter methods (render Liquid, resolve picker values, translate Shopify-only tags) rebuilt around this theme's actual sources.
- Confirmed catalog handles and collection relationships, freshly verified by public Shopify GET requests. Snapshot: `preview/shopify-public-snapshot.json`, fetched 2026-09-24T01:17:02Z.

## Keep as source-approved product and brand material

- Physical owner-supplied product references are the packaging authority. Public Shopify media/order was read for native fallback and compatibility. With bundled media enabled, the six launch products now use the twelve-frame galleries selected by the owner from `output/product-listing/GALLERY_REVIEW_2026-09-24.html`. The selected PNGs are preserved unchanged; only website JPEG and thumbnail derivatives are exported. The earlier website-generated set remains archived in `regenerated-galleries/`.
- User-supplied scent descriptions and SEO copy: `approved-product-copy.json`. The actual theme includes this as a content-only fallback for the six exact product handles, after native metafield values. Local preview leaves custom metafields empty to exercise that actual fallback. Public Shopify JSON does **not** expose the product metafields, so their live presence was not verified.
- The five “Why you'll love it” bullets per scent were rewritten at the user's request. Occasion/style lines are editorial suggestions; capacity, liquid colour, bottle and canister details are grounded in the saved product descriptions in `preview/shopify-public-snapshot.json`. The Liquid fallback, current copy JSON and optional reference payload contain the same revised bullets. Original scent descriptions, hero statements, notes and SEO copy are unchanged.
- Warm brand palette from the supplied brief and DEARBODY PLAYBOOK.
- New campaign photography is generated specifically for this build; no legacy website banners are used.

## Rebuild visually

All storefront UI: global navigation, footer, buttons, product cards, collection treatment, product page, cart drawer, predictive search, finder, typography scale, spacing and campaign layouts. Light and Dark share one Liquid/component architecture.

## Exclude

- `db-logo-burgundy.png` and `db-logo-secondary.svg` from older themes. `output/website/brand-assets/LOGO-SOURCE.md` explicitly records the old primary mark as an image-generated recreation, which the new brief prohibits.
- Old theme CSS/layout and old website campaign banners.
- Unverified review counts, ratings, testimonials, stock quantities, ingredients, note pyramids or duration claims.
- Manual All Fragrances collection as a stand-in for all products: its public metadata currently reports four products, while `/collections/all` correctly represents the six public products.

## Original logos and supplied font files

The user-provided source is [DEARBODY PLAYBOOK](https://www.canva.com/design/DAHL_W_c7U8/sTAJ2MiuAWAMJgSeSwtnnA/edit). Connected Canva read tools verify:

- Pages 6–7: primary and secondary logo examples.
- Page 8: CENZO FLARE BOLD and HELVETICA NOW DISPLAY.
- Page 9: warm tones should dominate the brand palette.

The connected Canva account initially exposed flattened page previews; original-element inspection returned **“Not allowed to edit this design DAHL_W_c7U8.”** No transaction was opened and no design was edited. A separate user-authorized browser read of the full source later recovered the original page-6 image resources directly from Canva. Evidence: `source-assets/canva/page-6-assets-manifest.json` (two image resources, no failures). Original image bytes are preserved in `source-assets/original-logos/`.

Those Canva mockups were initially shown with their source texture. After the user flagged the background and supplied https://www.dearbody.com/, original transparent dark/white logos were recovered directly from that site's header and footer. The theme now ships the unchanged official PNG files, documented by URL and SHA-256 in `source-assets/official-site/logo-provenance.json`. They are the global logo variant with no PH suffix. No logo text was retyped, no PH suffix was fabricated, and no logo recoloring or CSS mask is applied. The textured versions are archived outside the ZIP. A background-removal experiment was not installed.

**Source priority:** the user expressly retained the Canva playbook as the identity authority. The official website provides supporting brand facts and original transparent assets only; its layout, visual system, broad catalog and corporate contact information were not copied. The website remains limited to the six priority fragrances.

The user first supplied `CenzoFlare-Bold.zip` and `HelveticaNowText-Regular.zip` for the website and gallery typography. Their TTF files were used for the earlier website-generated raster captions archived in `regenerated-galleries/`. The user then supplied `HelveticaNowDisplay-Light.zip` and requested Display for the website. The current website and preview UI use **Cenzo Flare Bold** for display headings and **Helvetica Now Display Light** for body text; the exact supplied Display WOFF2 is embedded unchanged, with CSS family `Helvetica Now Display` and weight 300. The old Text WOFF2 was removed from theme assets, while its original source package and extracted files remain preserved.

The Display ZIP and its four extracted files (TTF, WOFF, WOFF2 and supplied stylesheet) are retained under `source-assets/fonts/`. [Font source notes](source-assets/fonts/README.md) explain current usage, and `source-assets/fonts/provenance.json` records the source files and SHA-256 hashes. Optional Theme Editor font URLs still support a separate bold override; without one, browser styling supplies emphasis from the available face. Physical product-label typography and official logo artwork retain their existing artwork.

The earlier Display revision changed live website and preview text only and left its then-current Cenzo Flare Bold / Helvetica Now Text Regular raster captions unchanged. The later owner-selected gallery import preserves the selected artwork as provided, without re-typesetting or regenerating it; those historical font records do not identify the typefaces in the newly selected raster files. Live website fonts remain unchanged. Display loading and layout checks are recorded in [Display font QA](qa/DISPLAY-FONT-QA.md); historical font and gallery QA records retain the versions they actually tested.

## Fresh Shopify verification

Six products are publicly accessible. The snapshot contains their real product and variant IDs, price, compare-at price, available flag, description, image URLs and image dimensions. Every current variant is **unavailable**. All selling prices are PHP 799 at the snapshot timestamp; Mojito Metallique also has a PHP 1,099 compare-at price. Theme code reads native Shopify values and does not hardcode these amounts.

| Product | Handle | Verified collection | Native snapshot images |
| --- | --- | --- | --- |
| Mojito Metallique | mojito-metallique | Women's Perfume | 12 |
| Mistened Narcissus | mistened-narcissus | Women's Perfume | 10 |
| Amber Oud Silk | amber-oud-silk | Women's Perfume | 12 |
| Oud Mirage | oud-mirage | Men's Perfume | 12 |
| Rtulle & Satin | rtulle-satin | Men's Perfume | 12 |
| Charme Envoûtant | charme-envoutant | Men's Perfume | 10 |

Public endpoints cannot verify stock quantity, actual custom metafields, metaobjects, policies, email delivery, payment configuration, apps, or checkout behavior. The local preview cannot validate Shopify's runtime, Theme Editor, or checkout. No live store changes were made by this audit.

## Newly verified fragrance notes

Five priority scent note lists are corroborated by the official website: [Mojito Metallique, Amber Oud Silk and Mistened Narcissus](https://www.dearbody.com/news/dearbody-perfume-sharing-5/) and [Charme Envoûtant and Oud Mirage](https://www.dearbody.com/news/dearbody-perfume-sharing-4/). The dated source record is `source-assets/official-site/verified-fragrance-notes.json`. These are fragrance note/accord descriptions, not ingredient declarations. Native metafields override each theme fallback. Rtulle & Satin has no verified note list in this source pass and remains blank. Owner-approved prose, Shopify prices, inventory and the six-product scope remain authoritative. No performance promises or global company certification/scale claims were imported.

## Scent Finder editorial profiles

[The native profile snippet](theme/snippets/sj-finder-profile.liquid) now supplies owner-copy-based discovery defaults for the six real launch handles. These are theme content, rendered by both Shopify and the local Liquid preview; they are not public-metafield observations or preview-only fixtures. Mood and occasion are editorial suggestions. The internal `intensity` key appears to shoppers as **scent feel**, describing character rather than measured strength, longevity or projection. No unverified note pyramid or performance claim is added.

Non-empty native mood, scent-character, occasion and intensity metafields override the corresponding default traits. Explicit `custom.scent_finder_enabled = false` opts a launch product out. Titles, IDs, prices, stock state and product links still come from the actual catalog. Sold-out products remain in discovery unless “Available products only” is selected. Selecting a section collection narrows the eligible catalog; an empty eligible catalog receives an honest empty collection message.

The five questions cover collection, mood, scent style, occasion and scent feel. Collection filters candidates before scores are applied: style 5, mood 3, occasion 1, feel 1. Only the highest-scoring scent is shown, with stable catalog-order selection for ties. Skipped preferences yield one clearly labelled discovery suggestion, still filtered by the chosen collection. The displayed result and announcements use singular wording. Current single-result checks are recorded in [Single-result Finder QA](qa/FINDER-SINGLE-RESULT-QA.md). This update needs no metafield import or Shopify Admin write. Current browser and behavior checks passed and are recorded in [Scent Finder QA](qa/SCENT-FINDER-QA.md); earlier preparation-state test results describe the previous implementation only.

## Earlier campaign scope (v3)

The new `campaign-v3` set contains fourteen optimized original AI-generated images: two homepage category panels and five wider page/footer banner locations, each in a Light/daytime and Dark/warm-evening direction. Product-free homepage gateways remain fully clickable. The original logos are preserved as original brand assets, rather than regenerated. Exact ImageGen prompts, original PNGs and web JPGs are retained in `campaign-v3`. No image contains baked-in website copy; readable accessible Liquid text overlays remain editable.


## Earlier homepage hero and copy revision (v4)

The user requested a header banner above the Women/Men collection gateways and less repetition of the London-to-Philippines statement. Two product-free homepage hero photographs are stored in `campaign-v4-homehero/`, bringing the campaign total at that revision to sixteen. The live headline is “MAKE IT PERSONAL.” in the supplied Cenzo Flare Bold. The full London-to-Philippines phrase is retained only in the Our Story header; site-wide copy uses distinct messages. That revision left existing galleries and campaign photographs unchanged.

## Product header banner architecture

The native [Product header banner section](theme/sections/sj-product-banner.liquid) appears before the product detail section in `templates/product.json`. The six current AI-generated product photographs, one for each priority handle, are in `campaign-v9-pop-editorial/`. They follow the supplied publication-materials reference with bold colour, tactile clothing and accessories, bright daylight and expressive Filipino personalities in physically plausible scenes. Each product banner features exactly one adult Filipino person with the authentic palm-sized fragrance; no extra people, background bodies or printed/reflected faces are included. The earlier `campaign-v6-product-lifestyle/`, intermediate Mistened replacement in `campaign-v7-banner-refresh/`, and `campaign-v8-warm-vibrant/` set are historical archives.

Original PNGs, exact prompts, product references, per-asset provenance and optimized website JPGs are retained for the current v9 set. Native dimensions are recorded per asset; source aspect ratios do not determine the displayed banner height. Physical labels remain part of the product imagery; promotional headings are not baked in. The earlier v6 native 1774×887 files and prior `campaign-v5-product-banners/` still-life concepts remain archived. They are not additional active website artworks. Current verification is recorded in [Pop Editorial banner QA](qa/V9-BANNER-REFRESH-QA.md).

Product banners now follow the shared full-width height of `clamp(540px, 43vw, 650px)` on desktop and `600px` on mobile. Mobile live copy remains over the lower photograph, with cream text on a warm burgundy scrim and responsive cropping that prioritizes the face. The actual Shopify product title is the page's single H1 in Cenzo Flare Bold, and its statement uses Helvetica Now Display Light. `custom.hero_statement` overrides the owner-approved fallback from `sj-approved-copy`; absent both sources, no statement is invented. The optional banner image picker takes precedence and supports a product image metafield. Future products without a dedicated banner use their native featured image, or a text-only introduction when no image exists.

The product template sets the detail section's `show_title: false` and `show_hero_statement: false` to remove the repeated title and statement. Both settings retain true defaults for standalone section use. The CTA still anchors to `ProductDetails-<product ID>`, and the gallery, native purchase data and independently scrolling desktop information panel remain below. The product-banner architecture keeps the existing 72 gallery images separate from campaign photography. The current total is **94 unique website artworks**: 72 gallery frames plus 22 campaign photographs, including these six product banners; the local image-review page lists that complete set.

Before the mobile overlay revision, the lifestyle banner implementation passed 28 responsive browser cases and 518 checks with no failures; see [Product campaign banner QA](qa/PRODUCT-CAMPAIGN-BANNER-QA.md). That validation also recorded no Shopify Theme Check findings and one H1, no duplicate IDs and no missing assets across all 23 rendered routes. [The previous product banner QA](qa/PRODUCT-BANNER-QA.md) remains a historical record of the earlier packshot-based banner and heading structure. No Shopify data or media-library changes were made for this local revision.

## Earlier page banner width revision

The earlier page banner width revision placed Women, Men, Shop All, Scent Finder, and Our Story media across the full viewport width, immediately below the navigation. Separate inner containers preserve copy gutters and constrain the grids, quiz, and essays below. That native Liquid/CSS revision left campaign image bytes and the supplied Display/Cenzo fonts unchanged. [Page banner width QA](qa/PAGE-BANNER-WIDTH-QA.md) records its 23 responsive cases, 258 checks, and no issues across both visual directions, plus collection navigation and the Finder flow. Shopify Theme Check returned no findings for that revision.

## Earlier mobile banner overlay revision

The earlier mobile overlay revision placed live eyebrows, titles, supporting copy and any CTA over the lower part of the homepage, page and product photographs, with cream text on a warm burgundy scrim. At that stage, desktop layouts and footer/category gateway overlays were unchanged, and no images were altered. It passed 33 responsive cases and 385 browser checks; see [Mobile banner overlay QA](qa/MOBILE-BANNER-OVERLAY-QA.md). Those results are historical evidence for the previous sizing, not the current shared-height revision.

## Earlier shared banner heights and Mistened refresh (v7)

Homepage, page, product and footer banners share a full-width height of `clamp(540px, 43vw, 650px)` on desktop and `600px` on mobile. Women/Men category gateway tiles remain outside this banner system. Mobile copy stays over the photograph with face-prioritized crops. Final verification passed 66 responsive cases and 1,248 checks; see [Unified banners QA](qa/UNIFIED-BANNERS-QA.md).

In v7, only the Mistened Narcissus product banner was regenerated. The accepted image shows one adult Filipina at a realistic covered Metro Manila roller rink/bench, a berry-red tee and cream trousers, the authentic clear bottle and pale-lavender skates, with no additional people. The native 1774×887 original PNG and website JPG are retained in `campaign-v7-banner-refresh/originals/` and `campaign-v7-banner-refresh/final-web/`. Independent native-image review passed product fidelity against the raw Mistened and canonical geometry references, natural anatomy, scene plausibility, headroom and the left copy area. Responsive layout QA passed in both Light and Dark. At that revision, the other five product banners, 72 gallery frames and sixteen other campaign photographs were unchanged; the replacement kept the active artwork count at 94.

## Earlier full banner refresh (v8)

The v8 revision regenerated 22 campaign photographs in `campaign-v8-warm-vibrant/`: Home hero, Women/Men gateways, collection and Finder headers, Story, footer and all six product headers. Both modes used fun, vibrant, warm daytime photography, with richer wardrobe accents for Dark. Accepted originals, exact prompts, rejected revision history, final JPEGs and hashes are retained as historical records. Its 22 new hashes differed from the prior shipped set; the artwork count remained 94 and its 72 gallery frames were unchanged.

The v8 crops and text overlays passed [v8 banner QA](qa/V8-BANNER-REFRESH-QA.md): 84 main-banner cases/1,608 checks, 8 gateway cases and zero ThemeCheck findings. Those results describe the archived v8 revision.

## Current pop editorial banner refresh (v9)

All 22 active campaign photographs are refreshed in `campaign-v9-pop-editorial/`, inspired by the user-supplied publication-materials reference. Saturated scarlet, cobalt and lemon accents, tactile fashion accessories, natural shadows and playful Filipino confidence define the new art direction. Both modes remain bright daylight photographs, with richer wardrobe accents in Dark. Home heroes and Women/Men gateways are product-free; each product banner retains its own fragrance and one adult model. Website headings, labels and supporting copy remain live and editable.

Accepted PNGs, exact built-in ImageGen prompts, per-asset provenance, optimized JPEGs and hashes are retained in the v9 folder. During that banner-only refresh, the 72 gallery JPEGs, source derivatives and thumbnails matched the pre-v9 snapshot in `campaign-v9-pop-editorial/provenance/previous-gallery-assets.json`. That snapshot remains historical evidence for the gallery set before the subsequent owner-selected import below. The active total remains **94 unique website artworks**, and the native upload archive remains `DearBody-Theme-Update-Shopify-Navigation.zip`. Banner verification is recorded in [Pop Editorial banner QA](qa/V9-BANNER-REFRESH-QA.md).

## Current owner-selected gallery import

The owner selected [Gallery Review, 24 September 2026](../../product-listing/GALLERY_REVIEW_2026-09-24.html), at `output/product-listing/GALLERY_REVIEW_2026-09-24.html`, as the product-image source. Only its six active website scents are imported: Mojito Metallique, Amber Oud Silk, Mistened Narcissus, Charme Envoûtant, Oud Mirage and Rtulle & Satin, twelve frames each. The source folder `rtulle-and-satin` maps to the live handle `rtulle-satin`; the other eight reviewed scents are not added to the storefront.

The selected source PNGs remain unchanged. `reviewed-product-galleries/` records their mapping and 1200px JPEG website derivatives, with 160px thumbnails. These derivatives replace all 72 previous theme gallery JPEGs and their 72 thumbnails using the existing asset filenames. Frame 01 continues to supply the shared collection, search, Finder, recommendation and cart packshots. Current verification is recorded in [Review gallery import QA](qa/REVIEW-GALLERY-IMPORT-QA.md).

This import preserves the 22 v9 banners, original logos, favicons, live Cenzo Flare Bold / Helvetica Now Display Light fonts, product copy, native commerce data, gallery order and autoplay. The previous website-only gallery files, typography scripts, checksum locks and QA remain historical records; the import does not regenerate or re-typeset source artwork and makes no Shopify data or media-library changes.

## Product galleries and autoplay

Dark product header banners now use the same full-width burgundy fade as the other page headers: 90% at the left, 70% at 44%, and transparent at 68%. The shared bottom-to-top mobile overlay remains in place. Browser inspection confirmed the desktop gradient and full-width overlay; Light styling is unchanged.

The gallery surround uses the same plain surface color as the product information panel: warm off-white in Light and burgundy in Dark. The earlier removal of amber glow gradients did not alter images; the current source-image import leaves this surface styling unchanged.

The twelve selected images for each priority scent retain source-frame order **01, 11, 12, 08, 09, 05, 06, 07, 02, 03, 04, 10**: packshot, scent description, who it fits, product profile, ingredients and care, lifestyle portrait, product in hand, everyday fragrance moment, spray in motion, packaging reveal, magnetic cap detail, and a scent journey. Selected source PNGs remain unchanged; replacement JPEG and thumbnail hashes belong to the current import mapping. Clean 01 packshots remain the collection/search/recommendation images. The earlier order-only change is recorded in [historical gallery order QA](qa/GALLERY-ORDER-QA.md).

The native product component rotates eligible image galleries every eight seconds while visible and pauses for the rest of the visit after manual interaction. The current design has no play/pause button, uses simple SVG chevrons and supports reduced-motion manual browsing, quiet automatic changes for screen readers, and offscreen/hidden-tab suspension. Video, external-video, 3D and single-image fallbacks do not autoplay.

The earlier autoplay revision was verified with 18 focused browser scenarios and 195 passing checks, plus a real-time advance/zoom/quantity smoke check. Shopify Theme Check returned zero findings for that revision. See [gallery autoplay QA](qa/GALLERY-AUTOPLAY-QA.md) and [real-time smoke results](qa/GALLERY-REAL-TIME-SMOKE.json); the later gallery-order update leaves autoplay and interaction code unchanged.


## Official-logo favicon

The default browser favicon uses the round emblem from the unchanged official dark and white PNG logos in a transparent 36×36 SVG viewport. The SVG embeds the original bytes and clips away the adjacent wordmark; the emblem is not redrawn or regenerated. Browser colour preference selects the dark or white original. The theme favicon picker retains priority, and the unchanged full dark PNG is a fallback for browsers without SVG favicon support. Both storefront layouts and the two local review pages include the favicon.

All 24 rendered pages contain the favicon reference, embedded original-logo bytes match their sources, the comparison-page browser metadata was verified and Shopify Theme Check returned zero findings. See `qa/favicon-verification.json` and `source-assets/official-site/favicon-provenance.json`.

## Homepage photographic features — current update

Three new built-in ImageGen photographs are retained in `campaign-v10-home-features/` with exact prompts, original PNGs, web JPEGs and provenance. The magnetic-cap macro matches the authentic black cap and stepped silver atomizer. The collectible feature shows two active fragrances with their matching closed canisters. The shipping feature was revised from bare bottles to closed canisters and then to individually bubble-wrapped canisters following the owner's corrections. The earlier shipping candidates are not installed.

All previous 72 gallery images and 22 banners remain unchanged. These three features bring that artwork set to 97; the two new customer-care banners bring the complete current total to 99. The homepage uses live Cenzo Flare Bold / Helvetica Now Display Light copy. Source and installed hashes are in `qa/home-feature-assets.json`. The current upload file is `DearBody-Theme-Update-Shopify-Navigation.zip`.

## FAQ and Shipping header photographs

Two distinct built-in ImageGen photographs are retained in `campaign-v11-customer-care/`: a single Filipino adult in a warm red-and-cobalt FAQ scene and a new shipping carton composition with two individually bubble-wrapped closed canisters. The user's earlier homepage shipping photo is preserved separately. Native headers inherit full-width shared heights and Light/Dark gradients; both keep live text over the image on mobile and contain no buttons. `qa/customer-care-assets.json` locks originals and installed JPEGs.
