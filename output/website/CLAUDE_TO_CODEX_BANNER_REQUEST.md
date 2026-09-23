# Claude → Codex banner request (Dear Body Shopify)

Prepared 2026-09-23 by Claude (storefront implementer). Codex owns the artwork; Claude places it.

## Target

- Store: `https://admin.shopify.com/store/erkayx-xy/` (displayed "My Store"), account alexmedina0030@gmail.com.
- Theme: **Horizon** (Shopify first-party theme, 2025 generation). Original/live theme id `166989201473`. The build happens on a duplicate named **Dear Body — Website Build** (id assigned at duplication; Claude records it in the handoff).
- Homepage hero section: Horizon **"Hero"** (observed in the template sidebar). Story section: the closest Horizon image-plus-text equivalent, confirmed once the working copy is open.
- Image fields: desktop background image; a separate mobile image field is expected but **not yet verified** on Horizon's Hero. If absent, Claude falls back to a small custom section (build brief §10). Deliver the mobile asset regardless.

## Measured / observed containers (approximate — eyeballed from editor previews, not DOM-measured)

| Container | Observed | Ratio |
|---|---|---|
| Desktop hero @1440 px | ≈1440 × 540 px visible | ≈2.6:1 |
| Mobile hero @390 px | ≈390 × 430 px visible | ≈0.9:1 |

Deliver the defaults below; they cover these crops with focal-point positioning. Claude will inspect real crops after upload and request a re-export only if a label is cut.

## Deliverables (text-free; existing packaging print stays authentic)

| # | File base name | Size | Composition |
|---|---|---|---|
| 1 | `dear-body-home-hero-desktop-v01` | 2400 × 1200 | Citrus Wish bottle + bright-yellow canister as lead, predominantly in the **right half**, away from outer edges. **Left ~42 % calm, low-detail cream space** for live burgundy copy (eyebrow + H1 + one line + button). |
| 2 | `dear-body-home-hero-mobile-v01` | 1200 × 1500 | Separately composed portrait. **Upper 30–35 % calm** for live text; product grouping centred in the middle/lower area with bottom breathing room. Same campaign, not a centre-crop of #1. |
| 3 | `dear-body-brand-story-v01` | 1600 × 1200 | Still life of all four products with matching canisters — Citrus Wish/yellow, Moonlight Velvet/pale lilac, Charme Envoûtant/orange, Sunset Cocktail/peach-pink. No crowding, comfortable margins, no dependency on in-image text. Not presented as a bundle/offer. |

Formats: lossless PNG master + WebP + JPEG derivatives, same base names, ~250–600 KB web derivatives where quality permits. Record focal point (%), safe-crop bounds, and live-text-safe region per file in `BANNER_ASSET_MANIFEST.md`.

## Live copy Claude will place (so you know what the calm zones must hold)

- Eyebrow: DEAR BODY PHILIPPINES · H1: A SCENT JOURNEY · Line: London-formulated fragrances, curated for the way you live. · Buttons: Shop the Collection / Discover Our Story.
- Story heading: FROM LONDON, WITH FEELING. (placed beside the image, not on it).

## Palette / mood

Burgundy #5C0006, red #9A1106, burnt orange #D46601, golden tan #E9A250, cream #F4E3CB dominant. Warm editorial light, tactile cream stone/paper, restrained sculptural staging. Packaging colours as SKU accents; cobalt/chrome sparingly. No people required. No invented props implying notes (fruit, flowers, spice). No added logo, monogram, badge, or headline.

## Product identity sources (authoritative)

- Approved galleries: `output/product-listing/{citrus-wish/standardized-v01,moonlight-velvet/standardized-v01,charme-envoutant/generated-v01,sunset-cocktail/standardized-v01}/final`
- Original photographs: `handoff/assets/{citrus-wish,moonlight-velvet,charme-envoutant,sunset-cocktail}-sources`
- Correct Citrus Wish bottom label: `handoff/assets/citrus-wish-sources/02-citrus-wish-packaging-bottom-label.jpg`. Never borrow Mojito Metallique packaging/facts.

## Superseded

An earlier abstract silk/smoke hero (`hero-dearbody.png`, 2400×1200, no products) was generated before this brief and is **not** to be used; the storefront hero must feature the real product.

## Delivery

`/Users/wetrade/Documents/ChatGPT/Dear Body/output/website/banners/` + `BANNER_ASSET_MANIFEST.md`. Claude uploads via Content → Files and sets overlay text/buttons as live Shopify controls.
