# DearBody brand asset provenance

Checked 24 September 2026. This records available source material; it does not certify unavailable files.

## Official reference

The merchant supplied the [DEARBODY PLAYBOOK](https://www.canva.com/design/DAHL_W_c7U8/sTAJ2MiuAWAMJgSeSwtnnA/edit). Canva read APIs returned the 12-page design, revision 109. Pages 6–7 contain primary/secondary logo references. Page 8 identifies **Cenzo Flare Bold** and **Helvetica Now Display**.

Local reference images are `../brand-assets/canva-logo-page-6.png`, `canva-logo-page-7.png`, and `canva-logo-page-8.png`. The links in `../logo-reference-urls.json` point to 335-pixel-high Canva document thumbnails and expiring thumbnail URLs; they are not standalone logo artwork or font files.

## Unavailable production assets

- **Original primary and secondary logo files:** not retrieved. Canva's media-inspection transaction returned `Not allowed to edit this design DAHL_W_c7U8`. No transaction was started, no source design was changed, and no export/download tool is exposed in the connected Canva tools. The connected account's brand-kit listing returned no items.
- **Official DearBody font file required.** Neither Cenzo Flare Bold nor Helvetica Now Display font files are present in this workspace. No `.woff`, `.woff2`, `.ttf`, or `.otf` files were found. A Canva type specimen establishes the font name; it does not provide a downloadable webfont or establish a web embedding licence.
- Existing `../shopify-theme/dearbody/assets/db-logo-burgundy.png` and `db-logo-secondary.svg` are explicitly documented as recreations in `../shopify-theme/LOGO-SOURCE.md`. They are not original masters and were not copied into this theme as approved logo artwork.

The requested Chrome profile was separately verified in the native profile menu as **Alex / owner-provided account**. Opening the supplied link reached a `DEARBODY PLAYBOOK - Presentation` window title. Further native inspection returned empty accessibility trees and `Screenshot unavailable for /Applications/Google Chrome.app.`, including after a control-session reset. No download control or original file could be verified through that route. This is a browser-control limitation; it does not establish whether that Canva browser account has download permission.

Supply approved primary/secondary logo exports, including a version suitable for dark backgrounds, and licensed webfont files before final brand sign-off. The theme provides artwork/font configuration and documents temporary system typography; any plain Home link is navigation, not a retyped logo.

## Product photographs and existing derived assets

The original six-scent reference photographs remain available at:

- `/Users/wetrade/Downloads/IMG_20260923_162213.jpg` — all six canisters.
- `/Users/wetrade/Downloads/IMG_20260923_163311.jpg` — women's bottles.
- `/Users/wetrade/Downloads/IMG_20260923_162432.jpg` — women's bottle/open-canister pairs.
- `/Users/wetrade/Downloads/IMG_20260923_163159.jpg` — men's bottles.
- `/Users/wetrade/Downloads/IMG_20260923_162544.jpg` — men's bottle/open-canister pairs.

Existing website packshots in `../redesign-assets/` are generated derivatives, with original-reference paths and prompts in `PACKSHOT_GENERATION_PROMPTS.json` and `BLACK_LABEL_PACKSHOT_PROMPTS_V02.json`. Existing generated gallery images remain under `../../product-listing/`. Their provenance must not be described as original camera photography.

New campaign assets, when produced, require their own source and QA record. This audit created no image assets.
