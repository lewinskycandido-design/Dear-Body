# DearBody — Vaporwave Edition

A fourth DearBody Shopify theme with a warm Vaporwave interface: sunset gradients, retro grids, circular sunset forms and framed panels in the approved brand colors. It preserves the Evah-inspired shopping structure and DearBody photographs, primary wordmark and secondary monogram. Memphis, Liquid Glass and Bauhaus remain separate designs.

The exact interface palette is burgundy `#5c0006`, red `#9a1106`, orange `#d46601`, gold `#e9a250` and cream `#f4e3cb`. Photography retains the real packaging colors. The licensed brand webfonts were not supplied; documented system-font fallbacks are used.

## Install in Shopify

1. Open **Online Store → Themes → Import theme → Upload zip file** and select `DearBody-Vaporwave-Shopify-Theme.zip`.
2. Name the new draft **Dear Body — Vaporwave** and open **Customize**.
3. In **Theme settings → Fragrance collections**, connect For Her and For Him to your intended collections. Installing the theme does not create products or change collection membership.
4. In **Theme settings → Brand artwork**, optionally replace the bundled primary and secondary logos with original masters. The secondary picker expects a transparent image because its alpha silhouette is recolored for its background. A separate footer picker accepts a light primary wordmark. Both bundled marks work with empty pickers; see `LOGO-SOURCE.md` for their recreation provenance.
5. Keep pages with handles `our-story` and `contact`, or assign the included dedicated page templates. Fragrance detail pages come from **Products**, not **Pages**.
6. Add approved product descriptions, actual prices, stock, photographs and policies in Shopify. Connect intended products to the Online Store channel. Use the draft's **Preview** action to review real catalog data before publishing.

This package has not been uploaded or published. It installs a complete theme, not a single Custom Liquid block.

## Layout and content

The menu is **Home, Scent Finder, For Her, For Him, Our Story, Contact**, with a separate cart icon. Scent Finder opens the three-question quiz. There is no Elemental Collection or Discovery Set category.

The homepage uses full-width lifestyle photography: visible perfume mist, a bag scene, a bathroom vanity and a six-fragrance home display. It provides For Her and For Him entry points, a finder callout, story and newsletter. Collection pages use full-width banners and alternating photograph-and-copy rows inspired by the reference layout in `REFERENCE-LAYOUT.md`.

Rows render the connected Shopify collection's actual products, images, prices and destinations. The six priority scents receive source-approved descriptions. Other products use merchant-provided content; collection descriptions, pagination and empty states remain supported. Unknown or zero prices do not become invented purchasing information.

## Scent Finder setup

In the global **DearBody scent quiz** section, connect its six product pickers if your handles differ from these defaults:

| Fragrance | Default product handle | Range |
|---|---|---|
| Mojito Metallique | `mojito-metallique` | For Her |
| Amber Oud Silk | `amber-oud-silk` | For Her |
| Mistened Narcissus | `mistened-narcissus` | For Her |
| Oud Mirage | `oud-mirage` | For Him |
| Charme Envoûtant | `charme-envoutant` | For Him |
| Rtulle & Satin | `rtulle-satin` | For Him |

Select the matching fragrance record for each named picker. Results link only to a resolved product; missing records show a coming-soon state. Leave the homepage hero's **Optional button link** empty to open the quiz. A supplied URL deliberately replaces that hero behavior. Navigation and finder callouts also open the quiz. See `SCENT-QUIZ.md` for approved descriptions and matching rules.

## Files and manual installation

- `DearBody-Vaporwave-Shopify-Theme.zip`: uploadable theme with Shopify's required folders at the archive root.
- `DearBody-Vaporwave-Website-Source.zip`: theme, documentation and local-preview tooling.
- `COPY-PASTE-CODE.html`: select and copy every theme text file at its exact folder and filename.
- `dearbody/`: editable theme source.
- `THEME-SHA256.json`: packaged source-file checksums.

For manual installation, preserve this edition's complete file set. Upload all PNG/JPG assets as files; SVG artwork is editable text. Do not mix presentation files from different editions.

## Preview and validation

The theme retains native Shopify product/cart forms, variant selection, product galleries, contact/newsletter forms and checkout handoff. Checkout, payments, shipping, inventory and email delivery are configured in Shopify. The local preview uses a synthetic catalog priced at the approved ₱799 with unavailable inventory and intercepts forms, so it cannot place orders or send messages. Preview-only additions are excluded from the Shopify theme ZIP.

From `preview/`:

```sh
npm ci
npm run build
node verify-commerce.mjs
node verify-quiz.mjs
npm run preview
```

Open `http://127.0.0.1:4176`. Other previews remain separate: Memphis 4173, Liquid Glass 4174 and Bauhaus 4175. After building, run `python3 package-theme.py` from this package root to recreate both ZIPs and the copy-code viewer. Packaging must follow a build because a build recreates `preview/public`.

See `VALIDATION.md` for fresh results and scope. Existing photographs and logos are reused; no new product images were generated for this edition. `ASSET_QA.md`, the preserved prompt JSON files and `LOGO-SOURCE.md` document provenance. Replacement media needs a fresh crop, readability and product-fidelity review.

## Priority pricing update — 24 September 2026

The six priority fragrances have an owner-approved selling price of **₱799 each**. Their Shopify records were set to Active and published to Online Store; existing stock of 0 was retained pending inventory confirmation. Publication does not make an out-of-stock variant purchasable. The theme continues to read live Shopify prices and availability; it does not hardcode ₱799 or change inventory. The local mock catalog mirrors the price and remains unavailable.

Rtulle & Satin uses the verified Shopify handle `rtulle-satin`. Quiz and priority-section fallbacks also support the earlier `rtulle-and-satin` alias; existing product-picker settings and bundled photograph filenames are preserved.

## Connected priority products — 24 September 2026

This package selects `womens-perfume` and `mens-perfume` as For Her and For Him, and saves the six Scent Finder product pickers to the existing Shopify products. Rtulle & Satin uses the live `rtulle-satin` handle; `rtulle-and-satin` remains only an internal quiz/artwork key and a legacy fallback. Product and collection pickers remain editable in the theme editor.

The optional Priority Scents section also starts with all six existing product pickers selected. Product pages and collection rows read Shopify prices and inventory. No duplicate products, hardcoded stock or automatic overselling are added. The local preview shows the approved ₱799 price and retains sold-out availability while stock confirmation is pending.
