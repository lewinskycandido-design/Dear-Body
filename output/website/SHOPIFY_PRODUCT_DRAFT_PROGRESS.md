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
