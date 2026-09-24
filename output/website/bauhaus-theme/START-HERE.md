# DearBody — Bauhaus Edition

A separate Shopify design built around structured grids, geometric forms, large typography and the DearBody brand palette. Its revised shopping layout takes inspiration from Evah, adapted to DearBody's For Her and For Him ranges. Memphis, Liquid Glass and Bauhaus share this shopping structure while retaining their own interface treatments. This package prepares the Bauhaus edition for installation; it does not upload or publish a theme to Shopify.

## Layout and navigation

The menu contains **Home, Scent Finder, For Her, For Him, Our Story and Contact**, with a separate cart icon. Scent Finder opens the three-question quiz from any page. There is no Elemental Collection or Discovery Set category.

The homepage combines full-width lifestyle photography, For Her and For Him entry points, a scent-finder callout, the brand story and newsletter. Each collection uses large alternating photograph-and-copy rows, with the product's name, approved scent character, actual price when configured and a link to its product page. These rows render the products in the connected Shopify collection; the theme does not add products or alter collection membership. Other products can also render with their merchant-provided data. Collection descriptions, empty states and pagination remain supported.

See `REFERENCE-LAYOUT.md` for the reference pages, adaptations and retained brand identity.

## Install the theme

1. In Shopify, open **Online Store → Themes → Import theme → Upload zip file** and select `DearBody-Bauhaus-Shopify-Theme.zip`.
2. Name the new draft **Dear Body — Bauhaus**. Open its **Customize** action.
3. Under **Theme settings → Brand artwork**, upload the primary wordmark and a transparent PNG of the secondary circular monogram to their image pickers. The secondary artwork is used as an alpha mask, so its silhouette automatically appears in burgundy or cream for the story/footer background; avoid an opaque rectangular background. A separate **Footer logo (light version)** picker accepts a light primary wordmark. Both bundled variants work when the pickers are empty. Read `LOGO-SOURCE.md` for source and reproduction details.
4. Under **Theme settings → Fragrance collections**, connect **For Her** to your women's collection and **For Him** to your men's collection. Products and collection membership are managed in Shopify; installing a theme does not create or publish them.
5. Create or keep pages with the handles `our-story` and `contact`. The default page template recognizes those handles; dedicated story and contact templates are also included.
6. Add approved descriptions, actual prices, stock, product media and policies in Shopify. Use **Products**, not **Pages**, for fragrance detail pages. Connect the intended products to the Online Store channel when ready.
7. Use the new draft's **Preview** action to review your real catalog and forms. Publishing is a separate Shopify action.

The ZIP installs the whole storefront. It is not intended for a single Custom Liquid block.

## Included files

- `DearBody-Bauhaus-Shopify-Theme.zip` — uploadable Shopify theme, with Shopify's required folders at the archive root.
- `DearBody-Bauhaus-Website-Source.zip` — editable theme, documentation, copy-code viewer and local-preview tooling.
- `COPY-PASTE-CODE.html` — select and copy each text file individually, preserving its folder and filename.
- `dearbody/` — theme source.
- `THEME-SHA256.json` — packaged theme-file checksums.

For manual installation, copy every required text file and upload all image assets. SVG artwork is text, while PNG/JPG artwork must be uploaded as files. Keep this edition's presentation files together instead of mixing them with another edition.

## Brand and artwork

Use the exact brand colors: burgundy `#5c0006`, red `#9a1106`, orange `#d46601`, gold `#e9a250` and cream `#f4e3cb`. These colors govern the interface; photography retains the real product and packaging colors.

The Bauhaus treatment uses flat color, clear grid divisions and geometric accents. Primary and secondary logo placement is part of the layout. The licensed Cenzo Flare Bold and Helvetica Now Display webfonts were not supplied; the storefront uses the documented system-font fallbacks.

The existing generated product and lifestyle artwork is reused. The homepage includes the visible-mist spray photo, the bag scene, bathroom vanity and six-fragrance home display. For Her, For Him, Our Story and Contact each have a photographic banner. No new product imagery was generated for this interface redesign. `IMAGE-PROMPTS.json`, `HOMEPAGE-PROMPTS.json` and the asset QA records preserve the original artwork provenance.

Banner and lifestyle sections include image, alternative-text and copy settings. Review any replacement photograph at desktop and mobile sizes. Product labels and perfume mist should remain visible. Keep scent claims tied to approved source copy; do not infer notes, concentration, performance or delivery promises from a photograph.

## Find your scent

The homepage **Find your scent** button opens the three-question quiz when its optional URL is blank. Providing a URL deliberately replaces that behavior. In the global **DearBody scent quiz** section, connect the six product pickers if your Shopify handles differ from these defaults:

| Fragrance | Default product handle | Category |
|---|---|---|
| Mojito Metallique | `mojito-metallique` | For Her |
| Amber Oud Silk | `amber-oud-silk` | For Her |
| Mistened Narcissus | `mistened-narcissus` | For Her |
| Oud Mirage | `oud-mirage` | For Him |
| Charme Envoûtant | `charme-envoutant` | For Him |
| Rtulle & Satin | `rtulle-satin` | For Him |

Results link to the product resolved by Shopify. Missing or unpublished records display a coming-soon state. The navigation, homepage scent-finder callout and collection-page finder also open this quiz. The optional priority-scents grid can be added through **Add section**; the default homepage concentrates on lifestyle photography and range discovery.

## Commerce and preview

The theme retains native Shopify product and cart forms, variant selection, product galleries, contact/newsletter forms and checkout handoff. Checkout, payments, shipping, inventory and email delivery are configured separately in Shopify. Theme-level zero-price and availability guards do not replace store configuration or server-side restrictions.

The local preview uses a mock catalog with the approved ₱799 selling price and unavailable inventory. A visible preview notice and form interception prevent orders, contact messages and subscriptions. Those preview-only additions are excluded from the Shopify theme ZIP.

From `preview/`:

```sh
npm ci
npm run build
node verify-commerce.mjs
node verify-quiz.mjs
npm run preview
```

Open `http://127.0.0.1:4175`. This port keeps the Bauhaus preview separate from Memphis on 4173 and Liquid Glass on 4174. From the package root, run `python3 package-theme.py` after the build to create both archives and the source viewer.

See `VALIDATION.md` for the actual checks completed for this edition and their limits.

## Priority pricing update — 24 September 2026

The six priority fragrances have an owner-approved selling price of **₱799 each**. Their Shopify records were set to Active and published to Online Store; existing stock of 0 was retained pending inventory confirmation. Publication does not make an out-of-stock variant purchasable. The theme continues to read live Shopify prices and availability; it does not hardcode ₱799 or change inventory. The local mock catalog mirrors the price and remains unavailable.

Rtulle & Satin uses the verified Shopify handle `rtulle-satin`. Quiz and priority-section fallbacks also support the earlier `rtulle-and-satin` alias; existing product-picker settings and bundled photograph filenames are preserved.

## Connected priority products — 24 September 2026

This package selects `womens-perfume` and `mens-perfume` as For Her and For Him, and saves the six Scent Finder product pickers to the existing Shopify products. Rtulle & Satin uses the live `rtulle-satin` handle; `rtulle-and-satin` remains only an internal quiz/artwork key and a legacy fallback. Product and collection pickers remain editable in the theme editor.

The optional Priority Scents section also starts with all six existing product pickers selected. Product pages and collection rows read Shopify prices and inventory. No duplicate products, hardcoded stock or automatic overselling are added. The local preview shows the approved ₱799 price and retains sold-out availability while stock confirmation is pending.
