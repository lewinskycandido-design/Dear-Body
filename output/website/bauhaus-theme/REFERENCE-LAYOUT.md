# DearBody — Reference layout adaptation

The user selected [Evah's website](https://www.evah.ph/) as a layout reference and specifically requested the presentation of its [Elemental Collection](https://www.evah.ph/pages/elemental-collection) for DearBody's **For Her** and **For Him** ranges.

This is an original DearBody implementation inspired by that shopping structure. It does not import Evah's source code, product names, marketing copy, photography, logos or other assets. DearBody does not gain an Elemental Collection or Discovery Set category.

## Shared structure across the three editions

- Six menu entries: **Home, Scent Finder, For Her, For Him, Our Story and Contact**, followed by a separate cart icon.
- Full-width lifestyle photography with clear entry points into the two fragrance ranges.
- Collection introductions followed by large alternating image-and-copy rows, giving each fragrance room for its name, scent character, description, price and product-page action.
- A scent-finder callout that opens DearBody's existing three-question quiz.
- Dedicated story and contact pages, native product detail pages and native Shopify commerce forms.

The collection rows use live `collection.products` data and pagination. Known priority fragrances receive source-approved DearBody scent copy; other products use their merchant-provided content. Prices and product destinations come from Shopify. Missing products and unconfirmed prices are not replaced with fabricated purchasing information.

## DearBody identity

The interface retains the five supplied brand colors: burgundy **#5c0006**, red **#9a1106**, orange **#d46601**, gold **#e9a250** and cream **#f4e3cb**. The primary DearBody wordmark and secondary circular monogram remain part of the branding; see `LOGO-SOURCE.md` for their provenance and merchant replacement options. Existing DearBody product and lifestyle imagery is reused.

The three editions retain distinct visual treatments around this shared layout: Memphis uses playful geometry, Liquid Glass uses translucent surfaces, and Bauhaus uses flat color fields, strong grid divisions, large typography and geometric accents. This package contains the Bauhaus edition.

Scent descriptions are grounded in `output/product-listing/SCENT_DESCRIPTION_SOURCE_LEDGER.md`. Short character labels interpret those approved descriptions; they do not establish a new fragrance-note pyramid, concentration or performance claim.
