# Theme product connections — 2026-09-24

The merchant requested connecting the added products to every uploaded theme. The six priority products use the live handles in the publication table below. Each theme's scent quiz is now explicitly bound to those products; the internal legacy `rtulle_and_satin` picker resolves the real `rtulle-satin` product.

| Theme | Shopify theme ID | Connection verification |
| --- | --- | --- |
| Current live Liquid Glass | 167055982657 | Six quiz products saved. For Her / For Him already mapped to Women's Perfume / Men's Perfume. Live quiz → Rtulle & Satin → actual product page verified at PHP 799, Sold out. |
| Memphis draft | 167064371265 | Six quiz products saved. Both collections mapped; For Him shows three products at PHP 799 and Rtulle product page opens. |
| Liquid Glass draft | 167064305729 | Six quiz products saved. Both collections mapped. Quiz → Rtulle product page verified at PHP 799, Sold out. |
| Bauhaus draft | 167064338497 | Six quiz products saved. Both collections mapped. Hero opens quiz; Rtulle result links to /products/rtulle-satin. For Her shows three correct products at PHP 799. |
| Vaporwave draft | 167064404033 | Six quiz products saved. Both collections mapped. Hero opens quiz; quiz → Rtulle product page verified at PHP 799, Sold out. |

The lifestyle hero's optional button URL is blank as intended: its fallback link is `/collections/all`, but the click handler opens the scent quiz. This was verified on the live Glass theme and Glass draft; no URL override was introduced. The lifestyle-only homepage arrangement is preserved. No draft theme has been published or switched live, and prices and inventory remain unchanged during this connection pass.

All four local theme sources also save explicit six-product quiz bindings and editable priority-section product presets, with `womens-perfume` / `mens-perfume` collection settings. All four builds passed; quiz checks passed 31 assertions for Memphis and 32 each for the other themes. Commerce checks passed 27 for Glass and 22 each for the other themes. All eight ZIP backups were regenerated and refreshed in `/Users/wetrade/Downloads/DearBody-Updated-Themes-2026-09-24`. Archive entries match the build manifests, source archives contain the matching theme ZIPs, and copied ZIP SHA-256 hashes match the originals.

---

# Priority scent publication — 2026-09-24

Store: https://admin.shopify.com/store/erkayx-xy/ (Dear Body, Alex Chrome profile).

The user authorized publishing all six priority scents at a selling price of **PHP 799**. The linked Canva design DAHIB2UjgJM confirms PHP 799 retail for each (and separately lists PHP 170 cost of goods). Cost-per-item fields were not changed.

All six are now **Active** and included in **Online Store**. The customer-facing catalog was read after saving and shows exactly these six products at PHP 799.00 each. Correct collection membership was also verified: three products in Women's Perfume and three in Men's Perfume.

| Product | Product ID | Live handle | Collection |
| --- | --- | --- | --- |
| Mojito Metallique | 10314869571649 | mojito-metallique | Women's Perfume |
| Mistened Narcissus | 10314865016897 | mistened-narcissus | Women's Perfume |
| Amber Oud Silk | 10314853417025 | amber-oud-silk | Women's Perfume |
| Oud Mirage | 10314853515329 | oud-mirage | Men's Perfume |
| Rtulle & Satin | 10314853449793 | rtulle-satin | Men's Perfume |
| Charme Envoûtant | 10314005020737 | charme-envoutant | Men's Perfume |

Mojito was already Active at PHP 799 when this pass began. The other five selling prices changed from zero to PHP 799, and all six were included in the bulk Active and Online Store actions. The `women` / `men` tags were added for the relevant automated collections. Other products remain Draft.

**Pending merchant inventory decision:** all six have zero stock and the storefront reports `available: false` / Sold out. No inventory quantities or overselling policy were invented. An async question asks the merchant to provide actual quantities or authorize Continue selling when out of stock. Product pages are visible, but customers cannot buy until this is resolved. The directly visited product page loaded without a password prompt in this browser; no store password, plan, payment, tax, shipping, or theme publication settings were changed.

The four local preview catalogs also show PHP 799 while keeping availability false to match Shopify. Theme templates already read live Shopify prices dynamically.

---

# Shopify product draft progress — 2026-09-23

## Latest addition — all six new scents

The user clarified “all” when asked which new scent to add. All six new products are now saved as **Draft**, with verified scent descriptions, size, ingredients, Dear Body vendor and the broad Perfumes & Colognes category. The live Products table confirms eleven products total, all Draft.

**70 new gallery images are uploaded and saved, with all 70 alt texts saved**. Combined with the first five products, this task has uploaded 120 images.

| New product | Shopify product ID | Images | Alt text and order verification |
| --- | --- | --- | --- |
| Rtulle & Satin | 10314853449793 | 12 | Complete: 01–12, packshot first, all alt text saved |
| Oud Mirage | 10314853515329 | 12 | Complete: 01–12, packshot first, all alt text saved |
| Midnight Elixir | 10314858397761 | 12 | Complete: 01–12, packshot first, all alt text saved |
| Amber Oud Silk | 10314853417025 | 12 | Complete: 01–12, packshot first, all alt text saved |
| Mistened Narcissus | 10314865016897 | 10 | Complete for approved frames 01–10, packshot first, all ten alt texts saved |
| Mojito Metallique | 10314869571649 | 12 | Complete: 01–12, packshot first, all alt text saved |

Mojito's twelve-image gallery was finalized during the upload task. Its QA report is PASS and every checksum was verified before upload. Its product description uses the package-evidenced flammable pictogram, without the unverified generic care sentence removed in final gallery QA.

Mistened's local frames 11 and 12 contain an outdated scent description and were excluded. The product description correctly uses the current source-ledger sentence: “Juicy berries softened by a smooth, sweet finish.” These two images still need a separate copy correction before attachment; no incorrect images were uploaded.

Upload paths, alt texts, checksums and new product IDs are in `upload-ready/new-scents-upload-data.json`. Prices remain at Shopify's default 0.00 and stock at zero; no unconfirmed values were invented. Rtulle, Oud and Midnight barcodes were saved. Amber, Mistened and Mojito barcode fields were omitted after UI issues. Verified printed product codes were entered as SKUs by the upload agents for Oud, Midnight, Amber and Mistened.

## Earlier completed upload — original five products

Store: https://admin.shopify.com/store/erkayx-xy/

All **50 approved images have been uploaded and saved**, ten per scent. The live Products table was re-read after the final upload and showed all five products with media thumbnails and **Draft** status.

| Product | Shopify product ID | Saved gallery verification |
| --- | --- | --- |
| Citrus Wish | 10314004791361 | Ten images, order 01–10, packshot first, all approved alt texts saved |
| Moonlight Velvet | 10314004889665 | Ten images, order 01–10, packshot first, all approved alt texts saved |
| Charme Envoûtant | 10314005020737 | Ten images, order 01–10, packshot first, all approved alt texts saved |
| Sunset Cocktail | 10314005053505 | Ten images, order 01–10, packshot first, all approved alt texts saved |
| Ivory Reverie | 10314222534721 | Ten images, order 01–10, packshot first, all approved alt texts saved |

All five product galleries were verified with no unsaved changes. All 50 approved alt texts are saved. Ivory Reverie's description, size, printed ingredients and care text are also saved. Ivory Reverie was created as a Draft during this task; the other four Draft products already existed.

## Source files and authorization

All 50 approved images are staged in `output/website/upload-ready/products/`, ten PNGs per scent. Complete ordered upload paths and approved alt text are in `upload-ready/gallery-upload-data.json`. The first four galleries also have `upload-ready/UPLOAD_MANIFEST.md`; Ivory Reverie product text is in `IVORY_REVERIE_PRODUCT_PREP.md`.

The user explicitly approved uploading all 50 finalized images to store erkayx-xy and attaching them to the five draft products. Uploads succeeded through the authenticated in-app browser after the user signed in. Earlier native Chrome and login blockers are resolved for this task.

## Unconfirmed product details

Prices remain Shopify's 0.00 default because retail prices are unconfirmed; stock is zero. Merchant SKUs, weight, fragrance notes, concentration and origin have not been invented. Ivory Reverie's barcode and collection assignment have not been entered. These products remain Draft.
