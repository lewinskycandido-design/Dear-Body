# Official Canva source inspection

Source: https://www.canva.com/design/DAHL_W_c7U8/sTAJ2MiuAWAMJgSeSwtnnA/edit

Inspected on 2026-09-24 through the read-only public Canva viewer. No design content was changed.

The browser opened the design in **Viewing** mode. Share/export opened a Canva login/sign-up prompt, so no authenticated original SVG/PDF export was available in this session. No access restriction was bypassed.

Pages 6 and 7 show the primary DearBody wordmark and secondary circular monogram as embossed/metallic marks already flattened into textured photographic mockups. Page 6 has the PH variation on a brown texture. Page 7 has the non-PH variation on an olive texture. They are not transparent logo assets, and extracting or reconstructing a flat logo from them would alter the supplied artwork.

Two exact image resources observed on page 7 were saved through the browser's supported page-assets export:

- `page-7-original-asset-1.png`: the unchanged primary wordmark mockup, 2400 × 1600.
- `page-7-original-asset-2.png`: the unchanged secondary monogram mockup, 1599 × 1066.

The original URLs, resource IDs, successes and fetch failures are preserved in `page-assets-manifest.json`. These files are source references and have **not** been inserted into the theme as clean logo files.

Returning to page 6 and exporting while its original images were actively visible succeeded. The following exact, unchanged **logo-only** photographic assets (without the slide's primary/secondary captions) were initially used, then moved outside the theme into `archive/textured-logo-v1/` after the user requested removal of their backgrounds:

- `sj-official-primary-ph.png`: 1599 × 1066, centered silver DearBody PH primary wordmark on its original brown textured background.
- `sj-official-secondary-ph.webp`: 2400 × 1600, centered silver PH circular monogram on its original burgundy textured background.

Both were visually inspected. `page-6-assets-manifest.json` records the successful source export. These are full 3:2 logo mockups with generous background; they are not transparent/vector logos. Their original pixels and proportions have not been modified.

Page 8 explicitly names **Cenzo Flare Bold** and **Helvetica Now Display**. The public page serves Helvetica Now Display resources and a custom font resource, but the supported asset export could not retrieve those font files. No licensed font files were obtained through this browser pass.

The final theme instead bundles unchanged transparent logos from the user-supplied official DearBody website. These are the global mark, without a PH suffix; no suffix was reconstructed. See `../official-site/logo-provenance.json`. The user subsequently supplied Cenzo Flare Bold and Helvetica Now Text Regular font packages, which are now bundled and used in the website and gallery typography; see `../fonts/provenance.json`. The Canva playbook still governs typography, colors, tone and art direction.
