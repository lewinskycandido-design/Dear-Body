# DearBody Memphis — editorial storefront

This separate Shopify theme uses the owner-requested navigation and editorial rhythm inspired by Evah, expressed in DearBody's Memphis identity: bold outlines, restrained waves/checker details, colorful panels and solid offset shadows. DearBody's five exact colors are #5c0006, #9a1106, #d46601, #e9a250 and #f4e3cb. The theme does not reuse Evah images, product copy, reviews, pricing, Elemental Collection or Discovery Set content.

## Install as an unpublished draft

1. In Shopify **Online Store → Themes**, upload **DearBody-Shopify-Theme.zip** as a new theme. This package has not been uploaded or published by this update.
2. Open **Customize → Theme settings → Fragrance collections**. Connect **For Her** and **For Him** to the corresponding live Shopify collections. The saved default handles are `womens-perfume` and `mens-perfume`.
3. Under **Brand artwork**, select your primary wordmark, a transparent secondary circular logo and the light footer wordmark if official master artwork is available. Bundled recreations from your playbook are the fallbacks; see LOGO-SOURCE.md. The secondary artwork's alpha mask automatically becomes burgundy or cream.
4. Populate each collection with its real products. Upload the matching bundled packshot to each product's media. Product rows use the live product's title, image, variants, currency, availability and URL. The ZIP does not create catalog products or change product publication status.
5. Under the global **DearBody scent quiz** section, connect each of its six product pickers if your handles differ. Only connect the named scent to its matching catalog record.
6. Create pages with handles `our-story` and `contact`. The default page template automatically uses their designed layouts; dedicated templates are also included.
7. Add actual prices, inventory, product details, shipping settings and policy content in Shopify, then review the draft before any publication.

## Page structure

Main, mobile and footer navigation: **Home · Scent Finder · For Her · For Him · Our Story · Contact**, plus the header's cart symbol. Scent Finder opens the existing three-question quiz; without JavaScript/native dialog support, its link goes to the fragrance catalog. Configured merchant links named Our Story/About Us or Contact can supply custom destinations. Other menu labels are intentionally excluded from this requested structure.

The homepage has a fullwidth spray photograph with editable copy/CTA, prominent For Her and For Him lifestyle routes, a fullwidth home-display scene, scent-finder callout, brand story and newsletter/footer. It deliberately has no product grid. The primary logo appears in the header/footer and the secondary circular mark in the story/footer.

For Her and For Him each start with a fullwidth photographic banner and centered introduction, followed by alternating 50/50 image/text scent rows. Rows stack image-first on mobile. There are no hardcoded product counts or prices: all published products in the selected collection render, with pagination after 24 products. The mock preview contains three priority scents per category. Shopify may show a different count according to the actual catalog.

Each row links to the native product page to select variants and quantity before purchase. “Shop this scent” appears only when a positive-price available variant exists; multiple-option products say “Choose your option.” Zero-price products say “Available soon”; paid but unavailable products show “Sold out.” Blank product URLs produce no links. The theme does not invent free prices or direct-purchase unavailable products.

## Catalog and copy

| For Her | Default handle |
|---|---|
| Mojito Metallique | `mojito-metallique` |
| Amber Oud Silk | `amber-oud-silk` |
| Mistened Narcissus | `mistened-narcissus` |

| For Him | Default handle |
|---|---|
| Oud Mirage | `oud-mirage` |
| Charme Envoûtant | `charme-envoutant` |
| Rtulle & Satin | `rtulle-satin` |

Known scents use the exact approved descriptions from `output/product-listing/SCENT_DESCRIPTION_SOURCE_LEDGER.md`, matched by handle or normalized title. Short character lines only summarize those descriptions. Unknown products show their merchant description. Optional **custom.scent_notes** product metafields render only when populated; no top/heart/base notes are invented. Product pages continue using merchant descriptions and existing care/ingredients metafields.

All page banners have editable image, heading, eyebrow and text settings. For collection banners, a section override wins over the collection's image, then the bundled DearBody fallback. Wide banner layouts crop square fallback images responsively; preview replacements at desktop/mobile sizes. The desktop hero uses a viewport-aware 540–740px height with a centered crop and lower-left copy; its mobile image and the other homepage lifestyle photos retain their natural proportions.

## Copy code instead

Open **COPY-PASTE-CODE.html**, choose a source file and paste into that exact path in a duplicate draft's code editor. Create all text files including **assets/db-logo-secondary.svg**, and upload every raster asset listed in the viewer. A full theme requires its layout, templates, sections, snippets, CSS, JS and assets; one Custom Liquid block cannot install it. Uploading the complete ZIP is simpler.

## Preview and validation

From `preview/`, run `npm ci`, then `npm run preview`; open http://127.0.0.1:4173/.

```sh
npm run build
node verify-commerce.mjs
node verify-quiz.mjs
node verify-editorial.mjs
```

From this package directory, run `python3 package-theme.py` to regenerate both ZIPs, the source viewer and SHA-256 manifest. Build before packaging: a build recreates the preview/public folder.

The preview uses an explicitly labeled mock catalog with the approved ₱799 selling price and unavailable inventory, and intercepts all forms. It sends no orders, email or subscriptions. The Shopify ZIP uses native Shopify commerce, contact and newsletter forms. Live checkout/payment, inventory, currency localization, installed app integrations and mail delivery are separate checks in the actual store. This standalone theme does not migrate app blocks, subscriptions or customer-account templates from another theme.

See VALIDATION.md for the checks performed for this revision, ASSET_QA.md for image provenance and SCENT-QUIZ.md for quiz behavior.

## Priority pricing update — 24 September 2026

The six priority fragrances have an owner-approved selling price of **₱799 each**. Their Shopify records were set to Active and published to Online Store; existing stock of 0 was retained pending inventory confirmation. Publication does not make an out-of-stock variant purchasable. The theme continues to read live Shopify prices and availability; it does not hardcode ₱799 or change inventory. The local mock catalog mirrors the price and remains unavailable.

Rtulle & Satin uses the verified Shopify handle `rtulle-satin`. Quiz and priority-section fallbacks also support the earlier `rtulle-and-satin` alias; existing product-picker settings and bundled photograph filenames are preserved.

## Connected priority products — 24 September 2026

This package selects `womens-perfume` and `mens-perfume` as For Her and For Him, and saves the six Scent Finder product pickers to the existing Shopify products. Rtulle & Satin uses the live `rtulle-satin` handle; `rtulle-and-satin` remains only an internal quiz/artwork key and a legacy fallback. Product and collection pickers remain editable in the theme editor.

The optional Priority Scents section also starts with all six existing product pickers selected. Product pages and collection rows read Shopify prices and inventory. No duplicate products, hardcoded stock or automatic overselling are added. The local preview shows the approved ₱799 price and retains sold-out availability while stock confirmation is pending.
