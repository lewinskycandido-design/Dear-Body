# DearBody — Liquid Glass Edition

The DearBody Liquid Glass Shopify theme now uses an editorial storefront structure inspired by the supplied Evah reference: announcement strip, left brand wordmark, centered navigation, full-width lifestyle hero, two category gateways, a scent-finder callout, story and newsletter, and a multi-column footer. The glass treatment remains distinct: translucent cream surfaces, burgundy text, rounded controls, reflections and restrained backdrop blur.

For Her and For Him use alternating full-width 50/50 product-image and tinted-copy rows, rather than a card grid. Product photos, URLs, prices, stock and collection membership come from the actual Shopify catalog. The six recognized priority scents use owner-approved descriptions. Other products retain their merchant descriptions. Purchase links lead to each product page for variant selection; collection rows do not bypass the existing product-form checks.

Evah artwork, copy, reviews, product names and prices are not included. The menu contains **Home, Scent Finder, For Her, For Him, Our Story and Contact**, with a cart icon. Both DearBody logo forms appear: primary wordmark in header/footer, circular secondary mark in the story and footer. The source logo masters were not supplied; bundled recreations and merchant artwork overrides are documented in `LOGO-SOURCE.md`.

## Install in Shopify

1. Upload `DearBody-Liquid-Glass-Shopify-Theme.zip` through **Online Store → Themes → Import theme → Upload zip file**. This package has not been uploaded or published by this revision.
2. Open Theme settings → Fragrance collections. Select the store's **For Her** and **For Him** collections. Without selections, the theme looks for Women's Perfume / Men's Perfume or For Her / For Him titles. No product records are created by installing a theme.
3. In Theme settings → Brand artwork, set the primary wordmark, secondary circular mark and optional light footer wordmark when official master artwork is available. Use a transparent secondary PNG or artwork with an alpha channel, since its silhouette is masked to the surrounding brand color.
4. Connect the six matching product pickers in the global DearBody scent quiz when store product handles differ. Approved text and bundled quiz photos describe those exact scents, so map each name to its matching record.
5. Populate products with approved prices, inventory, images and descriptions. Add them to the correct collection and review Online Store visibility. The local preview shows the approved **₱799** selling price and **Sold out**, reflecting unavailable inventory. Unpriced and unavailable variants cannot be purchased through the theme's product form.
6. Create or retain pages with handles `our-story` and `contact`. The default page template recognizes these handles; dedicated templates are also supplied. Existing Main menu links titled Our Story / About Us and Contact can supply alternative page URLs.
7. Preview the draft theme on Shopify. Check actual media, variant selection, policies, contact/newsletter delivery and checkout with the store's configured settings before publishing.

## Files and editing

- `DearBody-Liquid-Glass-Shopify-Theme.zip`: complete uploadable theme.
- `DearBody-Liquid-Glass-Website-Source.zip`: editable theme, documentation and local preview tooling.
- `COPY-PASTE-CODE.html`: exact text files with copy controls. Create every matching folder and filename, including `assets/db-logo-secondary.svg`, then upload the binary image assets separately. A single Custom Liquid block cannot install a full theme.
- `dearbody/`: theme source.

The exact brand palette remains **#5c0006, #9a1106, #d46601, #e9a250, #f4e3cb**. Alpha versions provide the glass surfaces. Product photography retains the products' actual colors. Helvetica Neue/Helvetica/Arial are the bundled fallbacks; licensed brand webfonts were not supplied.

## Editable photography and layout

The homepage uses the existing reference-derived spray, bag, vanity and six-bottle display photographs; no new image generation took place in this layout revision. Hero, lifestyle photographs, captions and alternate text are editable through their sections. The desktop hero uses a restrained landscape crop with a 560–740px height, keeping its full bottle, central mist and lower-left actions visible. Mobile shows the full natural image above its copy panel. Both category-photo links resolve to selected Shopify collections. The hero's optional URL overrides its quiz behavior; the navigation and home-display Scent Finder controls always open the quiz.

All four navigation destinations retain full-width photographic banners. Category images may come from the Shopify collection or section image override; custom images preserve their natural proportions. The supplied square category photos use a centered desktop crop and their full image on mobile. Product editorial rows use the merchant product's featured image without inventing image URLs or hiding missing artwork.

The original image prompts, source references and historical image QA remain in `HOMEPAGE-PROMPTS.json`, `HOMEPAGE-ASSET-QA.json` and `IMAGE-PROMPTS.json`. Merchant replacements need their own crop and contrast review.

## Priority assortment

| For Her | For Him |
|---|---|
| Mojito Metallique (`mojito-metallique`) | Oud Mirage (`oud-mirage`) |
| Amber Oud Silk (`amber-oud-silk`) | Charme Envoûtant (`charme-envoutant`) |
| Mistened Narcissus (`mistened-narcissus`) | Rtulle & Satin (`rtulle-satin`) |

Descriptions and descriptive character phrases come from the owner-approved source ledger, not an inferred top/heart/base note pyramid. Prices, inventory and operational policies remain Shopify data. The theme retains product details, variant/media switching, cart, contact/newsletter forms, 404 and password pages.

## Local preview

From `preview/`, run `npm install`, `npm run build`, then `npm run preview`. Open http://127.0.0.1:4174/. The preview uses a mock catalog and blocks real commerce/form submissions. Build and run `node verify-commerce.mjs` and `node verify-quiz.mjs`, then run `python3 package-theme.py` from this directory to regenerate both ZIPs and their checksum manifest.

The Memphis and Bauhaus themes are separate directories and packages. This revision does not publish or modify a Shopify store. Current checks and limits are recorded in `VALIDATION.md`.

The For Him collection uses a darker burgundy/red glass palette with cream text and gold accents. For Her retains the light glass palette. This also applies when a different For Him collection is selected in theme settings.

## Priority pricing update — 24 September 2026

The six priority fragrances have an owner-approved selling price of **₱799 each**. Their Shopify records were set to Active and published to Online Store; existing stock of 0 was retained pending inventory confirmation. Publication does not make an out-of-stock variant purchasable. The theme continues to read live Shopify prices and availability; it does not hardcode ₱799 or change inventory. The local mock catalog mirrors the price and remains unavailable.

Rtulle & Satin uses the verified Shopify handle `rtulle-satin`. Quiz and priority-section fallbacks also support the earlier `rtulle-and-satin` alias; existing product-picker settings and bundled photograph filenames are preserved.

## Connected priority products — 24 September 2026

This package selects `womens-perfume` and `mens-perfume` as For Her and For Him, and saves the six Scent Finder product pickers to the existing Shopify products. Rtulle & Satin uses the live `rtulle-satin` handle; `rtulle-and-satin` remains only an internal quiz/artwork key and a legacy fallback. Product and collection pickers remain editable in the theme editor.

The optional Priority Scents section also starts with all six existing product pickers selected. Product pages and collection rows read Shopify prices and inventory. No duplicate products, hardcoded stock or automatic overselling are added. The local preview shows the approved ₱799 price and retains sold-out availability while stock confirmation is pending.
