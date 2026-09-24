# DearBody Philippines — Shopify Online Store 2.0 theme

The upload artifact is **dearbody-philippines-shopify-theme.zip**. The editable theme source is in `theme/`. Everything was built and tested locally. No Shopify store was accessed, authenticated, changed, uploaded to or published.

The release includes the warm DearBody color system, six launch reference cards, responsive campaign sections, native product/collection/cart/search templates, predictive search, Shopify recommendations, newsletter/contact forms, app blocks and a merchant-data-driven Scent Finder. Official logo artwork and licensed font files were not present; those remain merchant setup requirements. Bundled campaign derivatives are development imagery, described in `IMAGE_BRIEFS.md`.

## HOW TO INSTALL

1. Open Shopify Admin.
2. Go to: **Online Store → Themes**.
3. Click: **Add Theme**.
4. Choose: **Upload ZIP File**.
5. Upload: **dearbody-philippines-shopify-theme.zip**.
6. Wait for Shopify to process the theme.
7. Open: **Customize**.
8. Configure: **Logo, Navigation, Homepage imagery, Featured products, Collections, Product metafields, Scent Finder, Footer**.
9. Preview the store.
10. Publish only after final merchant review.

The ZIP opens directly to `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, and `templates/`. Upload the theme ZIP, not this documentation folder or the preview directory. This is a custom merchant theme; it is not a Shopify Theme Store certification.

## Brand assets and typography

In **Theme settings → Official brand assets**, select the supplied original primary logo, a light footer logo, optional secondary logo and favicon. Until original artwork is uploaded, the theme displays a simple Home link; it does not imitate the DearBody wordmark. Existing reconstructed logo files were excluded.

**Official DearBody font file required.** Upload licensed WOFF2 files for **Cenzo Flare Bold** and **Helvetica Now Display** to Shopify Content → Files and paste their CDN URLs into the two font settings. The declarations are in `theme/snippets/db-fonts.liquid`. The current fallback is Helvetica Neue / Arial, explicitly not the official font. A regular body font is supported; bold UI is synthesized unless the licensed font offers it. Keep license terms with your business records.

The five official colors are global CSS tokens. `dearbody.css` supplies base components; `dearbody-master.css` supplies the campaign layout; `dearbody-release.css` contains final component refinements. Commerce and discovery styles/scripts are separate and dependency-free.

## Homepage and Theme Editor

Sections can be reordered, hidden or removed through Theme Editor. Several editorial/discovery sections also have a Show section checkbox. Text, image pickers and CTA controls live in each section.

| Section | Merchant controls |
| --- | --- |
| Announcement bar | Copy and optional link; separate section in Header group |
| Header | Main menu; supports nested links, mobile navigation, search and cart |
| Campaign hero | Desktop/mobile image, alt text, eyebrow, headline, body, primary/secondary labels and links |
| Brand introduction | Desktop/mobile image, heading, text and enable toggle; story destination uses global page picker |
| Launch collection | Six individual product pickers; each retains the approved name and reference image until connected |
| Shop by feeling | Six editable mood blocks; title, description, image and collection per block; spacing and color scheme |
| Scent finder invitation | Page destination, copy, CTA, image controls, spacing and color scheme |
| Editorial brand moment | Independent desktop/mobile image, alt text, copy, button and enable toggle |
| Featured fragrances | Collection and product limit; hidden until the collection has products |
| Brand story invitation | Copy, destination, button and enable toggle |
| Newsletter | Heading, eyebrow, description, button and enable toggle; native Shopify customer form |
| Footer | Shopping/customer-care menus, statement, contact note/email and social-link blocks; existing policies appear automatically |

The launch cards show **Collection preview** when no product is selected. They have no fabricated price, ID, availability or Add to Bag action. Connect the correct products to enable real Shopify media, price and purchasing. Product pickers remain unselected. Women/Men collection pickers use the handles explicitly recorded in the saved local setup notes. The **Rtulle & Satin** spelling is preserved in preview content; a selected product uses the merchant’s actual title.

## Collections, pages and navigation

In **Theme settings → Collections and pages**, review the Women’s and Men’s selections and choose the optional Launch collection. Women/Men default to `womens-perfume` and `mens-perfume`, explicitly recorded in `../SHOPIFY_PRODUCT_DRAFT_PROGRESS.md`. These selections remain editable; no store access was used to configure them. Products are never gender-classified automatically by the theme. The project’s documented rule for this product family is white perfume-name labels for women and black perfume-name labels for men (PRODUCT_LISTING_IMAGE_STRATEGY.md, line 294). Saved product records corroborate all six launch assignments. Until selected, Women/Men links browse all products. Use merchant-approved classification when creating collection membership.

Assign `collection.women`, `collection.men` or `collection.launch` to the relevant collection for its campaign/SEO defaults. The default collection template also recognizes collections selected in Theme settings. Native Shopify sorting and pagination are supported. Collection content remains Shopify-owned.

Create pages and assign these templates:

- **Scent Finder:** `page.scent-finder`.
- **Our Story:** `page.our-story`.
- **Contact:** `page.contact`.
- Other pages: `page` (native page content plus app blocks).

Select Scent Finder and Our Story in the global page settings, then choose your actual navigation menus. Default header/story links suggest `/pages/scent-finder` and `/pages/our-story`; create those handles or select your actual pages before launch. The homepage finder invitation falls back to browsing when no page is selected. Page-template files alone do not create Shopify page resources.

Page titles and descriptions use supplied defaults for explicit Women/Men/Launch/Story/Finder assignments, while custom Shopify page/collection SEO metadata takes precedence. Set each product’s supplied SEO title and description in Shopify; the theme does not identify products by guessed handles. Homepage SEO defaults are configurable globally. See `SUPPLIED_PRODUCT_COPY.md` for the exact user-supplied launch copy.

## Products, Scent Finder and native commerce

See **METAFIELDS.md** for all supported definitions and precise quiz behavior. Missing optional data is omitted. Note pyramids, reviews, ratings, rankings, performance and ingredients are never invented.

The Scent Finder uses a selected collection (first 50 products) or six product pickers, explicit Boolean enablement, and confirmed scent character/mood/occasion/intensity/gender attributes. It filters by the selected attributes; it has no fabricated scoring. With no usable profiles it displays an editable unavailable state and browse link.

Product pages read Shopify variants, price, availability, media, quantity rules and metafields. At desktop widths (990px and above), the full gallery stays on the left and the right-hand information panel scrolls independently. The panel supports keyboard focus, Page Down/Up and normal wheel/touchpad scrolling. Below 990px, images and information stack in ordinary page flow. Quick Add is reserved for a single default variant that is available and supports the simple quantity case; other products link to variant selection. Product/cart forms use native Shopify routes and checkout. Accelerated checkout can be toggled in the product section. Native checkout handles payment, shipping and taxes. A no-JavaScript variant-refresh form keeps server-rendered prices and constraints accurate.

Add review or other app blocks to the product section, generic page section, or reusable Apps section after installing the relevant app yourself. Recommendations render only when Shopify returns them. Predictive search falls back to the ordinary search form if suggestions fail. The mobile menu and search are native nonmodal disclosures with Escape/focus behavior; they do not trap keyboard focus.

## Remaining launch configuration

- Original logos and licensed fonts.
- Merchant approval or replacement of bundled campaign imagery; see **IMAGE_BRIEFS.md**.
- Real published products, approved images, variants, prices and inventory; select all six homepage products.
- Actual collections, pages, menus and metafields. Approve mood/product associations and quiz data.
- Contact details, social URLs, policies, subscriber consent copy, shipping/tax/payment settings and any apps.
- Manual Shopify preview of Theme Editor changes, real Add to Bag/cart updates, accelerated checkout, native checkout, search, recommendations and form delivery. These runtime services cannot be verified without a store, which was outside this task’s authorization.

## Local preview and checks

A local design preview is generated from the real Liquid source using an adapter for Shopify-only tags. Its banner labels the local reference catalog; prices read **PRICE SET IN SHOPIFY** and submission is intercepted. Demo routes/IDs exist only in preview code, never in the upload ZIP. Women/Men preview collections contain the three launch fragrances confirmed for each in the saved local product records; this is not a fresh store read. The preview does not emulate commerce APIs or send orders, emails or subscriptions.

From `preview/`, `npm ci` installs the pinned development dependencies if needed. Commands:

```sh
node render-preview.mjs
node render-preview.mjs --serve
node test-commerce.mjs
node test-discovery.mjs
```

The local server binds only to `127.0.0.1:4197`. Open that URL in a browser. Preview dependencies, tests, adapters, reports and documentation are excluded from the theme ZIP. Rebuild the package using `python3 package-theme.py` from this release directory. The package script validates schemas, references and archive integrity before writing a checksum manifest.

**QA_REPORT.md** records what passed and what remains for the merchant. Shopify’s official [theme architecture](https://shopify.dev/docs/storefronts/themes/architecture), [section schema](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema), and [local Theme Check](https://shopify.dev/docs/api/shopify-cli/theme/theme-check) references informed the build. Only public documentation was consulted; no store access occurred.
