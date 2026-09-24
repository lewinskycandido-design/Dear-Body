# Product gallery order QA — PASS

Verified on 2026-09-24 after the owner requested main image, infographics, lifestyle, then other product angles. The six existing bundled theme galleries now use source frames **01, 11, 12, 08, 09, 05, 06, 07, 02, 03, 04, 10** for both slides and thumbnails.

The order is Packshot → Scent description → Who it fits → Product profile → Ingredients and care → Lifestyle portrait → Product in hand → Everyday fragrance moment → Spray in motion → Packaging reveal → Magnetic cap detail → A scent journey.

`npm run build` in `preview/` validated 62 Liquid/JSON source files and rendered 23 native-template routes using the existing local catalog snapshot. Read-only JSDOM inspection of those generated files passed **57 checks with zero failures** across Mojito Metallique, Amber Oud Silk, Mistened Narcissus, Charme Envoûtant, Oud Mirage, and Rtulle & Satin.

Checks covered exact slide and thumbnail order, twelve unique source frames, packshot initially active, other slides initially inert, correct image and zoom destinations, matching thumbnails, accessible sequence labels, the correct packshot role, eager/high-priority first-image loading, unchanged collection packshots, and no broken local assets or duplicate IDs in the built routes.

All **178 theme assets** remain byte-for-byte unchanged, including all 72 gallery images and 72 thumbnails. The only changed file inside `theme/` is `sections/sj-product.liquid`. No photographs, gallery sources, native-media fallback, JavaScript interactions, pricing, variants, or inventory behavior changed.

`python3 qa/package-theme.py` rebuilt and verified the 240-file `dearbody-scent-journey-light-dark.zip`. The archive contains the requested order and byte-identical theme assets. SHA-256: `29da19a0e5e789d7a52daae3558c8263d7ab220e278ff3c2d4269b4806195742`.

The repeatable `gallery-browser-qa.mjs` order and first-image zoom expectations were updated to match. Browser interaction and autoplay tests were not rerun because that implementation is unchanged; their earlier evidence is explicitly historical. This check used generated HTML, filesystem hashes, and ZIP verification without network access or Shopify mutations. The package is local and unpublished. The separately reviewed fourteen-gallery export is outside this theme-only order change.

Detailed evidence: [GALLERY-ORDER-QA.json](GALLERY-ORDER-QA.json). Package contents: [package-manifest.json](package-manifest.json).
