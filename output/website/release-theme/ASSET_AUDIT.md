# Local DearBody asset audit

Release copy of the audit at `../master-brief-theme/ASSET_AUDIT.md`. Relative paths in the original audit below resolve from that original directory. Release note: the two `theme/assets/db-master-hero-*.jpg` files in this release have been replaced byte-for-byte with the home-collection-v03 pair; see `IMAGE_BRIEFS.md` for the delivered mapping and final-art requirements.

Audited 24 September 2026 against the supplied Shopify master brief. Read-only inspection of the workspace and the referenced original product photographs; no Shopify access, network access, or new image generation. Paths below are relative to this document unless absolute.

## Brand artwork and fonts

- `../brand-assets/canva-logo-page-6.png` and page 7 are low-resolution reference images of the primary and secondary logos. They are presentation thumbnails, not original transparent artwork suitable for production.
- `../brand-assets/canva-logo-page-8.png` visually confirms **Cenzo Flare Bold** and **Helvetica Now Display**.
- No `.woff`, `.woff2`, `.ttf`, or `.otf` files were found in the project outside dependency directories. **Official DearBody font file required.** Use the documented Helvetica Neue / Arial development fallback until licensed webfonts are provided.
- Older themes' `db-logo-burgundy.png` and `db-logo-secondary.svg` are documented recreations. The attached brief prohibits redraws/reconstructions; do not treat these files as original supplied logo artwork.
- The current theme's configurable primary, light-footer, and secondary logo settings are appropriate. A plain Home navigation link is an honest temporary fallback. Original approved primary and secondary logo exports remain a merchant-supplied requirement.
- `ASSET-PROVENANCE.md` contains the earlier source investigation. This audit independently confirms the local assets and does not repeat that document's external-access work.

## Authoritative six-scent product references

These original owner photographs were opened and visually inspected:

| Absolute path | Content |
| --- | --- |
| `/Users/wetrade/Downloads/IMG_20260923_163311.jpg` | Mistened Narcissus, Mojito Metallique and Amber Oud Silk bottles with ivory labels |
| `/Users/wetrade/Downloads/IMG_20260923_163159.jpg` | Charme Envoûtant, Rtulle & Satin and Oud Mirage bottles with black labels |
| `/Users/wetrade/Downloads/IMG_20260923_162213.jpg` | All six closed canisters with exact names and color assignments |

Additional original pairing photographs are recorded in existing provenance: `/Users/wetrade/Downloads/IMG_20260923_162432.jpg` and `/Users/wetrade/Downloads/IMG_20260923_162544.jpg`.

| Fragrance | Label | Canister | Observed liquid |
| --- | --- | --- | --- |
| Mojito Metallique | Ivory | Yellow | Golden yellow |
| Amber Oud Silk | Ivory | Blush peach | Pale warm amber |
| Mistened Narcissus | Ivory | Pale lilac | Nearly clear / faint lilac cast |
| Charme Envoûtant | Black | Orange | Orange amber |
| Oud Mirage | Black | Muted blue | Pale blue / lilac |
| Rtulle & Satin | Black | Turquoise | Pale turquoise |

Photographic light and burgundy fabric reflections affect apparent liquid color. Do not reinterpret them as precise pigment specifications. Preserve the unusual **Rtulle** spelling and the circumflex in **Envoûtant**.

## Product-card imagery

All six bundled `dearbody/assets/db-{scent-handle}.jpg` product cards were visually inspected. Each is 900 × 900 and approximately 90–140 KB, with one complete bottle and matching canister on cream. The names, ivory-versus-black label assignments, canister colors, and bottle/canister pairing are consistent with the owner references.

These are existing **generated derivatives**, not original camera photographs. Their source masters and prompts are under `../redesign-assets/`; see `PACKSHOT_QA.md`, `PACKSHOT_GENERATION_PROMPTS.json`, and `BLACK_LABEL_PACKSHOT_PROMPTS_V02.json`. The current theme should use real Shopify product media when present and these six assets only as the explicit launch/demo fallback.

## Campaign imagery

The following existing current-theme assets were opened and visually inspected:

| Asset | Dimensions | Finding |
| --- | --- | --- |
| `dearbody/assets/db-master-hero-desktop.jpg` | 1672 × 941 | Six priority scents; warm cream pedestals, burgundy/orange accents, useful left-side copy space. Generated derivative. |
| `dearbody/assets/db-master-hero-mobile.jpg` | 1122 × 1402 | Six priority scents fully visible. A small print defect on Rtulle's label resembles “LORDON” instead of “LONDON”; do not certify exact packaging fidelity. |
| `dearbody/assets/db-master-story.jpg` | 1254 × 1254 | Four priority scents, burgundy textile and warm orange/cream setting. Complete bottle silhouettes, live-copy-free composition. Generated derivative. |
| `dearbody/assets/db-master-women.jpg` | 1672 × 941 | Warm everyday lifestyle setting, Mojito Metallique label visible; copy works best outside the image. Generated derivative. |
| `dearbody/assets/db-master-men.jpg` | 1672 × 941 | Warm cafe lifestyle setting, Charme Envoûtant visible at natural scale. Generated derivative. |

`CAMPAIGN-PROMPTS.json` records the existing generation prompts and owner-reference paths. The prompts establish intent, not independent final approval. Small printed-label accuracy should be checked at delivery resolution whenever the campaign is changed.

### Existing alternative hero set

`../banners/home-collection-v03/dearbody-home-collection-desktop-v03.jpg` (1774 × 887) and `dearbody-home-collection-mobile-v03.jpg` (1122 × 1402) are an existing matched campaign showing all six products at home. Both were visually inspected here; scent names and label assignments are readable and consistent. Their prior source, rejection, QA, and checksum record is in `QA_AND_ASSETS.md`, `BRAND_ALIGNMENT.md`, `PROMPTS.md`, and `asset-lock.sha256` in that directory.

These are a strong available alternative for a ready local fallback. Preserve the whole grouping with its authored aspect ratio; avoid cover crops that remove scents. Keep live copy above the mobile image. They remain generated campaign assets and must not be described as documentary photography.

Older `../banners/dear-body-home-hero-*-v01.*` feature Citrus Wish, and the old brand-story asset includes Citrus Wish, Moonlight Velvet and Sunset Cocktail. They do not represent this brief's six-priority launch group; do not silently reuse them as the six-scent campaign.

## Remaining asset work

1. Obtain approved original logo exports and licensed official webfont files through the merchant's later manual configuration; do not recreate them.
2. If retaining the new master mobile hero, record a replacement brief covering the small label-print correction and require exact original product reference matching. Alternatively use the existing matched home-collection-v03 hero set.
3. New campaign art is otherwise unnecessary to make the local theme visually complete: six packshots and matching existing desktop/mobile/lifestyle assets already exist. Retain honest provenance and configurable Theme Editor replacements.
4. Exclude audit files, generation prompts, source photos, PNG masters, preview screenshots and tooling from the upload ZIP. Include only theme assets actually referenced by the final code.
