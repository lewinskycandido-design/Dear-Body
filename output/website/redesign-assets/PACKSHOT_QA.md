# Website packshot QA

Created 2026-09-23 with the built-in image generation tool for the website redesign. Scope: three standalone product-card packshots, not fragrance galleries.

## Source and output

Physical identity is based on the owner's IMG_20260923_163311.jpg (bottles), IMG_20260923_162213.jpg (closed canisters), and IMG_20260923_162432.jpg (pairing and materials), all in /Users/wetrade/Downloads. Original photographs were visually inspected before generation. The first Mojito result supplied the common lighting and framing reference for the other two images.

All three native PNG masters are 1254 × 1254 pixels. They were copied unchanged from built-in generated outputs. Same-size WebP quality 94 derivatives have embedded sRGB profiles. No product pixels were deterministically retouched, recolored, stretched or composited. The native size is suitable for website cards; these are not 2048-pixel gallery deliverables.

| Image | Visual audit | Identity |
| --- | --- | --- |
| mojito-metallique-website-packshot-v01 | PASS | Exact MOJITO METALLIQUE on both ivory labels; yellow closed canister; golden-yellow liquid; glossy black cap and narrow silver collar. |
| amber-oud-silk-website-packshot-v01 | PASS | Exact AMBER OUD SILK on both ivory labels; peach-pink closed canister; pale champagne liquid; same bottle/cap proportions. |
| mistened-narcissus-website-packshot-v01 | PASS | Exact MISTENED NARCISSUS on both ivory labels; pale lilac closed canister; nearly clear liquid; same bottle/cap proportions. |

Each image contains exactly one bottle and one matching closed canister. Both labels are visible with their original monogram/PARFUM/LONDON hierarchy. Complete silhouettes, caps and bases are inside the square frame. Warm cream backgrounds, soft contact shadows, natural glass highlights and matched framing make a coherent card set. Native outputs and final WebP exports were individually visually inspected. No blocking visual defects were found.

Prompts and reference paths are in PACKSHOT_GENERATION_PROMPTS.json. File paths, dimensions, byte sizes and SHA-256 checksums are in PACKSHOT_FILES.json. Use WebP derivatives in the storefront and retain PNG masters.
