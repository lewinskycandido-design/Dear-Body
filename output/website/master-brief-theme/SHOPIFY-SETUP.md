# DearBody Shopify setup

This is a setup specification for the master-brief theme, not a record of new live changes. This task has not created metafield definitions, metaobjects, pages, collections, or inventory in Shopify.

## Product metafields

Create product-owned definitions under namespace `custom`. Inspect existing definitions first and preserve compatible merchant data. Use the exact keys below. Recommended types follow [Shopify's supported data types](https://shopify.dev/docs/apps/build/metafields/list-of-data-types).

| Key | Recommended Shopify type | Content |
| --- | --- | --- |
| `short_description` | `single_line_text_field` | Concise approved scent personality on cards. |
| `hero_statement` | `single_line_text_field` | Product hero line from the supplied master brief. |
| `scent_description` | `rich_text_field` | Approved descriptive paragraphs for The Scent. |
| `scent_character` | `list.single_line_text_field` | Approved scent character labels, one value per item. |
| `mood` | `list.single_line_text_field` | Merchant-approved mood labels used for discovery. |
| `occasion` | `list.single_line_text_field` | Merchant-confirmed occasions for Perfect For. |
| `intensity` | `single_line_text_field` | Merchant-confirmed intensity label; do not infer performance. |
| `gender` | `single_line_text_field` | Explicit merchant value; use consistent `women`, `men`, or `unisex` values. |
| `scent_finder_enabled` | `boolean` | Set true only after the product's discovery data has been checked. |
| `top_notes` | `list.single_line_text_field` | Confirmed top notes only. |
| `heart_notes` | `list.single_line_text_field` | Confirmed heart notes only. |
| `base_notes` | `list.single_line_text_field` | Confirmed base notes only. |
| `bullet_1` | `multi_line_text_field` | First approved benefit heading and sentence. |
| `bullet_2` | `multi_line_text_field` | Second approved benefit heading and sentence. |
| `bullet_3` | `multi_line_text_field` | Third approved benefit heading and sentence. |
| `bullet_4` | `multi_line_text_field` | Fourth approved benefit heading and sentence. |
| `bullet_5` | `multi_line_text_field` | Fifth approved benefit heading and sentence. |

Optional supported product information: `custom.ingredients` and `custom.care`, both `multi_line_text_field`, populated only from verified packaging or approved copy. The existing theme can display these when present. Do not create numerical sweetness/freshness/warmth/depth scores unless the merchant supplies both the scale and values.

The master brief is the source for its supplied hero statements, five bullets, and descriptive copy. `../../product-listing/SCENT_DESCRIPTION_SOURCE_LEDGER.md` records exact approved short scent descriptions. Marketing language about smoke, rose, sweetness, or woods does not establish a top/heart/base note pyramid. Empty optional data remains empty, and its storefront module should remain hidden. Do not populate claims about longevity, concentration, projection, ratings, or bestseller status from inference.

## Shop by feeling metaobjects

Create a merchant-owned metaobject definition with type handle **`scent_mood`**, display name **Scent mood**, and these field keys:

| Field | Type | Requirement |
| --- | --- | --- |
| `title` | `single_line_text_field` | Required; display-name field, e.g. an approved mood heading. |
| `description` | `multi_line_text_field` | Optional short supporting copy. |
| `image` | `file_reference` | Optional; restrict to images. |
| `collection` | `collection_reference` | Required destination containing confirmed matching products. |

Enable storefront access for this definition and make intended entries active if publishable status is enabled. Connect the entries through the section's mood selection when offered. Shopify supports selecting custom metaobjects using a [`metaobject_list` Theme Editor setting](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#metaobject_list).

Suggested titles in the brief are Fresh & Bright, Soft & Dreamy, Dark & Addictive, Rich & Indulgent, Warm & Glowing, and Bold & Mysterious. They are proposed merchandising headings, not verified collection assignments. Create only entries whose destination collections and product matches the merchant confirms. There is no requirement to publish all six empty mood cards.

## Routes and catalog connections

| Navigation/resource | Target | Status or setup |
| --- | --- | --- |
| Women | `/collections/womens-perfume` | Existing Women's Perfume collection, verified in the September 24 handoff. |
| Men | `/collections/mens-perfume` | Existing Men's Perfume collection, verified in the September 24 handoff. |
| Scent Finder | `/pages/scent-finder` | Proposed page handle; assign the theme's scent-finder page template. |
| Our Story | `/pages/our-story` | Existing page; assign `page.our-story`. |
| Contact | `/pages/contact` | Existing page; assign `page.contact`. |
| Shop All | `/collections/all` | Shopify catalog route. An older manual `all-fragrances` collection covered only four earlier products; recheck it before using that route. |
| Launch collection | `/collections/launch-collection` | Recommended new manual collection; its existence has not been verified. Add only the six products below in brief order. |

Use Shopify menu/resource pickers and live product/collection references. The six priority products were recorded in `../SHOPIFY_PRODUCT_DRAFT_PROGRESS.md` on September 24, 2026:

| Product | Actual handle | Product ID | Saved collection | Proposed `custom.gender` value |
| --- | --- | --- | --- | --- |
| Mojito Metallique | `mojito-metallique` | `10314869571649` | Women's Perfume | `women` |
| Amber Oud Silk | `amber-oud-silk` | `10314853417025` | Women's Perfume | `women` |
| Mistened Narcissus | `mistened-narcissus` | `10314865016897` | Women's Perfume | `women` |
| Charme Envoûtant | `charme-envoutant` | `10314005020737` | Men's Perfume | `men` |
| Oud Mirage | `oud-mirage` | `10314853515329` | Men's Perfume | `men` |
| Rtulle & Satin | **`rtulle-satin`** | `10314853449793` | Men's Perfume | `men` |

These assignments come from saved Shopify verification, not packaging/name inference. They do not prove that `custom.gender` already exists. Check the live values before writing. Preserve the unusual spelling **Rtulle & Satin** and the verified handle **rtulle-satin**.

The same handoff records all six Active and published to Online Store at PHP 799, with stock zero and Sold out. This is historical saved evidence, not a new live check. The theme must read the current native price, selected variant, inventory availability, product URL, and media. Do not hardcode PHP 799, invent variant IDs, or enable overselling to make the preview purchasable. The merchant still needs to confirm actual stock or an explicit overselling policy.

## Content, artwork, and release checks

- Apply supplied SEO title/description copy to native product, collection, page, and store search-listing fields. These are resource data, not a price or catalog export bundled in the theme ZIP.
- Configure distinct desktop/mobile campaign images through section image settings and descriptive alt text. Preserve the exact bottles, labels, packaging, and names.
- Load approved original primary/secondary logos and the appropriate light version in Brand artwork settings. See [ASSET-PROVENANCE.md](ASSET-PROVENANCE.md) for the Canva access limitation and excluded recreations.
- **Official DearBody font file required.** Supply licensed Cenzo Flare Bold and Helvetica Now Display webfont files, then configure the theme's font URLs. System fallback text is temporary and does not complete brand sign-off.
- Confirm real inventory, variants, shipping, payment, tax, policies, support details, and any review app in the actual Shopify draft before publication. Do not publish placeholder claims or contact details.

Uploading a theme ZIP alone does not create these store resources or product metafield values. Keep theme installation, content setup, and final live verification as separate recorded steps.
