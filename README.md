# DearBody Philippines

Brand assets, fragrance galleries, and the Shopify website for [dearbody.ph](https://dearbody.ph).

Latest local update (25 September 2026): the theme includes homepage ordering, image fragrance selectors, sample review layouts, compact product galleries, and the fixed-size Scent Finder with a Buy now order form. These local changes require uploading and publishing in Shopify. The latest upload package is [DearBody-Theme-Fixed-Finder-2026-09-25.zip](output/website/scent-journey-theme/DearBody-Theme-Fixed-Finder-2026-09-25.zip).

The current website is in [`output/website/scent-journey-theme`](output/website/scent-journey-theme/START-HERE.md). Its `theme/` directory contains the Shopify Liquid templates, JavaScript, styles, fonts, and storefront images. Other website directories retain earlier design iterations.

- [Current release and verification](output/website/scent-journey-theme/UPDATE-COD-ORDERS.md)
- [Installable Shopify theme ZIP](output/website/scent-journey-theme/DearBody-Theme-Update-COD-Orders.zip)
- [Local preview instructions](output/website/scent-journey-theme/preview/README.md)
- [Fragrance gallery review](output/product-listing/GALLERY_REVIEW_2026-09-24.html)
- [Brand guide](BRAND_GUIDE.md)

## Local website preview

```sh
cd output/website/scent-journey-theme/preview
npm ci
npm run preview
```

Open `http://127.0.0.1:4208/compare`. The local preview renders the theme and cannot place orders.

## Store configuration

The live store uses EasySell for cash-on-delivery orders and same-page confirmation. The app installation, shipping rules, and saved app settings are separate from the theme ZIP. The confirmation markup, CSS, and deployment evidence are preserved in the current theme's `qa/easysell-confirmation-saved.html`, `qa/easysell-confirmation.css`, and `qa/EASYSELL-CONFIRMATION-DEPLOYMENT.json`.

Dependencies, generated preview output, temporary files, credential-bearing source links, and obsolete ZIP copies are excluded from new commits. Product artwork and brand source files remain in the project.

## Project archive

Campaign artwork, scripts, Flow frames, production guides, product-gallery corrections, and theme packages are included. The 461 MB `output/flow-frame-pack/Dear-Body-Flow-All-16-Scripts.zip` exceeds GitHub’s per-file limit; its unpacked contents are preserved in `output/flow-frame-pack/all-16-scripts-2026-09-25-v01/`. Local dependencies, credentials, caches, and generated previews remain excluded.
