# Women, Men and Scent Finder banners — native image QA

Status: PASS. Six unique selected PNG originals, each 1774 × 887 (2:1), created with the built-in image generator. Each selected photo was inspected at native resolution. The Story pair is owned separately by the parent task.

| Asset | Headroom (approx.) | Face center x/y | Alt description |
|---|---:|---|---|
| sj-banner-women-light | 13% | 71% / 27% | A smiling Filipina in cobalt knit and denim adjusts red sunglasses beside a sunlit cream veranda wall. |
| sj-banner-women-dark | 19% | 67% / 28% | A Filipina in a scarlet blouse and indigo denim turns with a smile, carrying a green bag and lemon scarf beside a blue-shuttered cream wall. |
| sj-banner-men-light | 16% | 68% / 24% | A laughing Filipino man in cobalt and lemon rests his hand on a scarlet bicycle beside a sunlit coastal promenade. |
| sj-banner-men-dark | 16% | 67% / 26% | A smiling Filipino man in a scarlet knit polo holds a lemon cap beside a blue-railed outdoor stairway. |
| sj-banner-finder-light | 17% | 71% / 26% | A Filipina in lemon knit compares a scarlet jacket with green sunglasses in a bright blue-tiled apartment corridor. |
| sj-banner-finder-dark | 19% | 70% / 28% | A Filipino man in green and cobalt compares a scarlet cap with a lemon bucket hat beside a sunlit blue doorway. |

All six contain exactly one adult Filipino model, physically plausible hands and accessories, bright daylight, saturated wardrobe accents, quiet pale left copy space, and no perfume bottles, baked headlines, recognizable brand marks, or extra people/reflection faces. Light and Dark variants are distinct photographs; the Dark photos retain bright daylight.

Each initial generation received one targeted built-in edit for framing. Men Dark also had a tiny invented bag mark removed. Initial candidates remain under `originals/revisions/` and are explicitly unshipped. The selected native PNGs were copied without raster retouching or format conversion.

Some final headroom exceeds the requested 12–15% guide (up to 19%) to protect mobile crops. Faces land around 67–71% horizontally; use approximately 70% horizontal focal positioning and review the real responsive page crop. Final live-heading contrast and responsive crop integration are outside this asset-only QA.

Exact prompts, tool output paths, reference roles, source/correction chain, original hashes, alt text and per-image QA are in `category-finder-provenance.json`. Checksum file: `category-finder-lock.sha256`. No theme, manifest, package or Shopify changes were made.
