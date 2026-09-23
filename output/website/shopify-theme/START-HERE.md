# DearBody — A Scent Journey, Memphis Edition

A complete custom Shopify storefront with a Memphis-inspired interface in DearBody's exact five-color brand palette, the six priority fragrances, and a home-collection hero. Navigation leads with **For Her** and **For Him**. Geometric rings, waves, zigzags, starbursts and checkerboard details sit alongside bold borders, framed photography and solid offset shadows. The theme includes homepage, catalog, product gallery and variant selection, bag, Shopify checkout handoff, story, contact, newsletter, generic content pages, password page and 404 page. This local update includes a recreated brand wordmark and polished AI-generated lifestyle images based on the owner's product references; it has not been installed in the active Shopify theme.

## Install the full website

1. In Shopify, open **Online Store → Themes → Import theme → Upload zip file** and upload `DearBody-Shopify-Theme.zip`. This adds an unpublished theme. Rename it **Dear Body — A Scent Journey**.
2. Open **Customize** on the uploaded theme. Under **DearBody priority scents**, connect each of the six blocks to its correct Shopify product. The bundled artwork and scent names are already present.
3. In **Theme settings → Fragrance collections**, set **For Her collection** to **Women's Perfume** and **For Him collection** to **Men's Perfume**. Under **Brand artwork**, add official logo masters and favicon when available; the bundled recreation is used until then. Existing header/footer menus can retain their other links; stale Shop all entries are removed by the navigation snippet.
4. Create or open pages with the exact handles `our-story` and `contact`. The default page template automatically gives these handles their designed story and contact layouts. The dedicated **our-story** / **contact** templates are also included if you prefer assigning them explicitly. Shopify lists assignable templates from the live theme; the automatic handle mapping lets the draft work before publication.
5. Add approved product descriptions, actual prices, inventory, delivery settings and store policies in Shopify. Upload the matching `assets/db-…jpg` packshot to each product's media so catalog and product pages use the same imagery as the homepage. Keep products that are not ready as drafts.
6. Use the theme's **Preview** action to inspect the storefront. Publish only when the catalog and operational settings are ready.

The ZIP is a full theme. Upload it as a theme, not into a Custom Liquid block. It does not change the currently published store or overwrite product data.

## Copy and paste into the existing draft instead

Open `COPY-PASTE-CODE.html` for every source file with individual **Copy code** buttons. The source folder is `dearbody/`.

For **Dear Body — Website Build**, duplicate the draft first, then use **… → Edit code** on the duplicate. Upload all **14 JPG files and the PNG logo** and create or replace the text files shown in the source browser, preserving each folder and filename. The complete storefront requires all files, including `layout/theme.liquid`, section groups, templates, CSS and JavaScript. Replacing `templates/index.json`, the shared layout or settings replaces that draft's corresponding structure/settings. A fresh ZIP upload is the simplest way to preserve the old draft intact.

Binary photographs cannot be pasted as Liquid code: upload them to the theme's **assets** folder. Do not paste this whole package into one Custom Liquid field. That field cannot install product/cart templates, shared navigation or asset files.

## Navigation page banners

For Her, For Him, Our Story and Contact each open with a photographic Memphis banner directly below the shared navigation. For Her and For Him use their matching three-scent home photographs. Our Story shows all six priority fragrances in a sunlit console setting; Contact uses a warm telephone and stationery scene. Live headings remain separate from the image. Photos retain their full proportions on desktop and mobile.

In **Customize**, open the relevant collection or page template and select its main DearBody section. **Banner image override**, **Banner heading override**, **Banner eyebrow** and **Banner text** let you adjust the banner. Blank overrides use the designed defaults. Collection images take precedence over bundled category images when no section image override is selected. Settings on the default collection template are shared by collections using that template; use the individual collection image or a separate template for collection-specific changes. Story and Contact work with both the dedicated templates and their default-page handle mapping.

For an existing copy of this theme, the banner update requires `snippets/db-page-banner.liquid`, `snippets/db-story-content.liquid`, `snippets/db-contact-content.liquid`, the four main collection/page/story/contact section files, and `assets/dearbody-memphis.css`. Upload `db-banner-story.jpg` and `db-banner-contact.jpg` plus the three `db-lifestyle-*.jpg` images if they are not already present. The complete ZIP and source browser include all required files.

## Priority product mapping

| Product | Default handle | Bundled image |
|---|---|---|
| Mojito Metallique | `mojito-metallique` | `db-mojito-metallique.jpg` |
| Amber Oud Silk | `amber-oud-silk` | `db-amber-oud-silk.jpg` |
| Mistened Narcissus | `mistened-narcissus` | `db-mistened-narcissus.jpg` |
| Oud Mirage | `oud-mirage` | `db-oud-mirage.jpg` |
| Charme Envoûtant | `charme-envoutant` | `db-charme-envoutant.jpg` |
| Rtulle & Satin | `rtulle-and-satin` | `db-rtulle-and-satin.jpg` |

Use the product picker if your actual handles differ. The homepage first uses the chosen product, then attempts the handle. A missing/unpublished product keeps its image/name and “Available soon”; it does not create a broken product link. Homepage bundled artwork is intentional; clear the block's “Bundled image filename” to use the chosen product's featured image instead.

The all-fragrances collection and product pages use real Shopify catalog data. The ZIP does not create products or make draft products available on the Online Store sales channel.

## For Her / For Him collections

The existing Shopify collections were verified on 23 September 2026: **Women's Perfume** (ID `490398548033`) automatically includes products tagged `women`; **Men's Perfume** (ID `490398613569`) uses tag `men`. Each currently has **zero products** and is assigned to two sales channels. Their verified storefront handles are `womens-perfume` and `mens-perfume`, and both collections are preselected in the theme settings.

| Collection | Product tag | Priority scents |
|---|---|---|
| Women's Perfume → For Her | `women` | Mojito Metallique, Amber Oud Silk, Mistened Narcissus |
| Men's Perfume → For Him | `men` | Oud Mirage, Charme Envoûtant, Rtulle & Satin |

Add the matching tag in each product's Shopify **Tags** field when preparing its catalog record. These assignments follow the owner-approved source facts and gallery manifests. Set the two collection pickers described above to use the existing collections. If no picker is selected, navigation searches for collections named Women's Perfume / Men's Perfume or For Her / For Him, then uses matching configured menu links. If none resolves, the category label remains non-clickable instead of linking to a missing page.

The main, mobile and footer menus show For Her / For Him, followed by the remaining merchant links or the default Our story / Contact links. Shop all entries and duplicate category links are suppressed. The all-fragrances catalog still exists for collection calls to action and product breadcrumbs.

At the latest Shopify inspection, the catalog contained only five Draft products: Citrus Wish, Moonlight Velvet, Charme Envoûtant, Sunset Cocktail and Ivory Reverie. The other five priority scents are not yet catalog records. Tags, available collections and this theme do not create those products or make Draft products publicly available. Keep unapproved products as Draft until their business details are ready.

### If a product detail page does not open

The product template is included at `templates/product.json`; there is no separate page to create under Shopify Pages. In **Products**, check that the fragrance exists, then connect that exact product under **Customize → DearBody priority scents → the scent block → Shopify product**. Product availability on the Online Store sales channel also controls whether Shopify can resolve its storefront URL. A Draft product can remain unavailable in storefront previews; keep unapproved products as Draft and use Shopify's product preview while preparing their details. Do not activate an unpriced product just to make its homepage card clickable.

Bundled cards remain visible before catalog setup, but their labels and photos alone are not a working product listing. A missing product now produces a non-clickable “Available soon” card. If an older copy of the theme shows a “View fragrance” link that returns to the same page, replace `snippets/db-product-card.liquid` with the corrected file from this package; it explicitly rejects blank product URLs.

## Behavior and content

- Native Shopify product forms add the selected variant and quantity to the cart. Native cart forms update quantities, remove line items and hand off to Shopify checkout.
- Zero-price and unavailable variants cannot be purchased through this theme's controls. This is a storefront guard, not a server-side product restriction. Keep unapproved products unpublished; do not rely on theme code to restrict other sales channels or direct cart API calls.
- No prices, stock counts, shipping promises, discounts, unsupported scent notes, concentration or size claims are invented. Product descriptions come from Shopify. Ingredients/care render only when corresponding `custom.ingredients` / `custom.care` metafields are populated.
- Contact and newsletter use Shopify's own form handling. Confirm store email/marketing settings in Shopify. No third-party form service is required.
- Policies appear only when their bodies exist in Shopify. Checkout styling, payment methods, tax, delivery and order emails are managed separately in Shopify.
- This is a lean custom theme, not a Shopify Theme Store submission. Existing app-specific snippets, app blocks, subscriptions, customer-account templates and advanced catalog filters are not migrated from Horizon; review any installed storefront apps before switching themes.

## Publication identity

Palette: burgundy `#5c0006`, red `#9a1106`, burnt orange `#d46601`, golden tan `#e9a250`, cream `#f4e3cb`. Photography preserves the six real product identities and original light/dark label families.

The Memphis treatment is in `assets/dearbody-memphis.css`, loaded after the base stylesheet, with decorative shapes in `snippets/db-memphis-motif.liquid`. Both are required when copying this edition into Shopify. Burgundy text on cream or gold and cream text on burgundy or red keep core text legible; orange is used for decorative accents. Decorative motifs do not receive keyboard focus or intercept clicks, and reduced-motion preferences are respected.

Typography currently uses Helvetica Neue/Helvetica/Arial. These are deliberate system-font fallbacks. Licensed Cenzo Flare Bold and Helvetica Now Display webfonts were not supplied or embedded. The bundled `db-logo-burgundy.png` is a faithful AI recreation of the DearBody PH wordmark shown on page 6 of the supplied Canva playbook, not the official master file. The header/footer use it through `snippets/db-logo.liquid`. Replace it through Brand artwork when the official master becomes available.

The hero now shows the complete 4:5 `db-hero-mobile.jpg` at every screen size. Desktop places live copy beside the framed photo; mobile stacks copy above it. All six bottles remain visible without text over their labels. The original 2:1 `db-hero-desktop.jpg` is retained as an optional asset. Hero image settings can replace the default photo or supply a separate mobile image; a 4:5 image is recommended for the current layout. Preserve the full image instead of applying a short fixed-height crop or stretching it.

The homepage editorial section uses `db-lifestyle-collection.jpg`, a polished six-bottle home-console image generated from the owner's raw product references. Each recognized priority product adds its matching For Her or For Him trio plus the full collection after its real Shopify media through `db-lifestyle-product-photo.liquid`. Raw snapshots are reference material only and are not included in the theme. These assets supplement the gallery; they do not upload files into Shopify's product media records. Keep the verified scent names when creating products so matching lifestyle views resolve. Exact image prompts, references and QA are in `IMAGE-PROMPTS.json`. Small monograms and glass details are AI-rendered rather than pixel-identical reproductions.

## Local preview

The preview renders 16 routes from the same Liquid source with mock catalog data. Its For Her and For Him routes each contain the three verified priority scents listed above. The preview uses the verified store routes `/collections/womens-perfume` and `/collections/mens-perfume`. It uses six real scent names and packaged imagery but marks every product unavailable while business data is unconfirmed. Its notice and form interception exist only in the preview; they are absent from the Shopify ZIP.

Run from `preview/`:

```sh
npm ci
npm run preview
```

Then open `http://127.0.0.1:4173`. `npm run build` regenerates preview pages and validates Liquid syntax with Shopify's parser. Local checks cannot validate live payment processing, Shopify mail delivery or real inventory.

## Source references

[Shopify theme upload](https://help.shopify.com/en/manual/online-store/themes/adding-themes) · [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) · [Native forms](https://shopify.dev/docs/api/liquid/tags/form) · [JSON templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates)

Collection URLs verified in Shopify admin on 23 September 2026: `/collections/womens-perfume` (For Her) and `/collections/mens-perfume` (For Him). Both are preselected in theme settings and the local preview uses these same routes.
