# Copy-paste prompt for Codex: Dear Body Shopify banners

Create finished header/banner artwork for the Dear Body Shopify storefront. You are responsible for the visual assets; Claude is responsible for placing them and building the storefront through the browser or computer. Do not edit Shopify or generate a website. Generate the actual images, visually verify them, and deliver usable local files plus a placement manifest.

## 1. Read the brand and product sources

Project folder:
`/Users/wetrade/Documents/ChatGPT/Dear Body`

Read these through the local filesystem, or use Finder if that is the available access method:

- `BRAND_GUIDE.md`
- `brand.tokens.json`
- `output/product-listing/UNIFIED_THREE_SCENT_GALLERY_STANDARD.md` — despite its filename, this is the approved four-scent standard.
- The `GALLERY_MANIFEST.md` adjacent to each approved gallery below.

Approved gallery folders, relative to the project:

- `output/product-listing/citrus-wish/standardized-v01/final`
- `output/product-listing/moonlight-velvet/standardized-v01/final`
- `output/product-listing/charme-envoutant/generated-v01/final`
- `output/product-listing/sunset-cocktail/standardized-v01/final`

Inspect the approved packshots and architectural heroes for styling. For physical product identity, inspect the original supplied photographs under:

- `handoff/assets/citrus-wish-sources`
- `handoff/assets/moonlight-velvet-sources`
- `handoff/assets/charme-envoutant-sources`
- `handoff/assets/sunset-cocktail-sources`

Use these photographs as the authority for bottle shape, cap, label, canister, liquid, material, and proportions. Ignore older gallery paths in `START_HERE_NEW_ACCOUNT.md` and the older product briefs when selecting finished reference artwork. Citrus Wish and Mojito Metallique had exchanged packaging in earlier references: never borrow Mojito labels or facts. The correct Citrus Wish bottom label is `handoff/assets/citrus-wish-sources/02-citrus-wish-packaging-bottom-label.jpg`.

Read and apply the installed `imagegen` skill before generation. On this machine its source is `/Users/wetrade/.codex/skills/.system/imagegen/SKILL.md`; if unavailable, locate the installed skill. Use the image-generation tool for creating and editing artwork. Inspect every local reference before sending it to the tool. Do not substitute CSS, a mockup, a prompt-only answer, or an unrelated stock photograph for the requested images.

## 2. Use Claude’s placement brief when supplied

First use any brief from Claude naming the active Shopify theme, section type, desktop/mobile container ratios, overlay alignment, focal points, and intended heading/CTA. Check `/Users/wetrade/Documents/ChatGPT/Dear Body/output/website/CLAUDE_TO_CODEX_BANNER_REQUEST.md` if present, or use the brief pasted by the user. Those actual placement requirements override the default dimensions below. If that brief is absent, continue with these defaults without blocking:

| Deliverable | Default final size | Purpose |
|---|---:|---|
| Desktop homepage hero | 2400 × 1200 px | Wide image banner with live text on the left |
| Mobile homepage hero | 1200 × 1500 px | Separately composed portrait artwork with live text above the product |
| Brand-story banner | 1600 × 1200 px | Editorial image paired with a separate live text column |

These are composition/export targets, not assumed native tool resolutions. If the image tool produces another resolution, preserve the intended ratio and subject layout, then make a high-quality export to the requested dimensions. Do not stretch the product.

## 3. Art direction

Make the brand warm, vibrant, confident, playful, premium, and approachable, reflecting contemporary Filipino fragrance culture. Use tactile editorial lighting, realistic shadows, cream stone/paper, warm color fields, and restrained sculptural staging.

Core palette: burgundy `#5c0006`, red `#9a1106`, burnt orange `#d46601`, golden tan `#e9a250`, and soft cream `#f4e3cb`. Keep these dominant. Packaging colors can provide SKU accents; cobalt/chrome may appear sparingly as accents consistent with the approved galleries. Avoid cold clinical styling, gloomy nightclub scenes, excessive haze, and unrelated luxury props.

Default hero concept: Citrus Wish bottle and bright-yellow canister as the unmistakable lead product in a warm cream, burgundy, and golden editorial setting. Desktop and mobile must feel like the same campaign while using different compositions suited to their containers. If Claude’s brief specifies another featured product, use that verified SKU instead.

Default story concept: a cohesive still life featuring the four verified products, each with its matching canister: Citrus Wish/yellow, Moonlight Velvet/pale lilac, Charme Envoûtant/orange, and Sunset Cocktail/peach-pink. Make the product identities clear and avoid crowding. Do not present the grouping as a purchasable bundle or special offer.

## 4. Composition and identity requirements

- Desktop hero: reserve roughly the left 42% as calm, low-detail cream space for burgundy live text and a button. Keep products predominantly within the right half, away from outer edges.
- Mobile hero: leave the upper 30–35% calm for live text; keep the main product grouping centered in the middle/lower area with breathing room at the bottom. Recompose rather than simply center-cropping the desktop banner.
- Story banner: prioritize the four-product grouping, with comfortable margins and no dependency on text within the image. Claude will place story copy beside or below it.
- Keep essential labels, caps, and package silhouettes within a central safe area. Record the actual safe cropping and focal coordinates for each finished file.
- Preserve exact product names, logos already printed on the physical products, packaging colors, geometry, and scale. Never add or redraw a separate brand logo, monogram, certification, badge, or watermark.
- Add no headline, caption, button, promotional text, or other overlay inside the artwork. Existing product-label printing must remain authentic and legible. “A Scent Journey” and all other storefront copy will be live Shopify text.
- Do not invent fragrance-note props such as fruit, flowers, or spices. Product names and packaging colors do not establish ingredients or scent notes.
- Prefer product-only imagery for these assets. If a requested concept includes people, these four SKUs are the approved men’s black-label line: follow the existing male Filipino casting direction and inspect anatomy and product grip.
- Use opaque photographic backgrounds. Make transparent assets only if explicitly requested.

## 5. Generate, verify, and deliver

Create and inspect all three assets at full size and at realistic desktop/mobile display sizes. Check product fidelity, labels, artifacts, lighting, shadows, safe text zones, responsive cropping, and continuity. Correct visible problems before delivering. Do not claim completion for an ungenerated or uninspected image.

Save under:
`/Users/wetrade/Documents/ChatGPT/Dear Body/output/website/banners`

Use these final base names only for successfully generated and verified files:

- `dear-body-home-hero-desktop-v01`
- `dear-body-home-hero-mobile-v01`
- `dear-body-brand-story-v01`

Keep lossless PNG masters. Also export visually checked WebP and JPEG derivatives with the same base names. Faithful deterministic format conversion, resizing, and compression are authorized for export only; do not change product art, recolor, stretch, or invent detail during conversion. Aim for web derivatives around 250–600 KB where quality permits; preserve readable product labels over an arbitrary size target.

Create `BANNER_ASSET_MANIFEST.md` after generation. For each actual file record absolute path, dimensions, format, bytes, intended Shopify placement, concise factual alt text, suggested focal point as percentages, safe crop boundaries, live-text-safe region, and any remaining limitations. Identify the preferred web derivative and separate mobile asset. Include a short instruction for Claude to upload the files and set the section’s overlay text/buttons in Shopify rather than baking them into artwork.

Return clickable links to the finished assets and manifest, and show the banners for review. If generation or file access fails, state the concrete blocker and accurately identify any completed deliverables; never fabricate an output path or claim that a file exists.
