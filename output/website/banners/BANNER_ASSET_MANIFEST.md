# Dear Body banner asset manifest

Generated and inspected 2026-09-23. Artwork: built-in ImageGen; no CLI fallback. Brief precedence: CLAUDE_TO_CODEX_BANNER_REQUEST.md. Nine image files delivered; no Shopify changes made.

## Export and QA

Opaque RGB with embedded sRGB profile. Lossless PNG masters; WebP quality 94 (preferred web files); JPEG quality 94, 4:4:4. Lanczos export preserves proportions: desktop native 1774 × 887 to 2400 × 1200; mobile native 1122 × 1402 to 1200 × 1500 with subpixel aspect fit; story native 1448 × 1086 to 1600 × 1200. No deterministic product retouching or recoloring.

All nine final exports visually inspected at full dimensions. Display checks: desktop 1440 × 540, mobile 390 × 430, story 640 × 480. Desktop corrected for canister headroom; story corrected for small LONDON printing. Checked names, package colors, silhouettes, glass, shadows, absence of overlays and props, and campaign continuity. Each finished asset set was copied immediately after passing inspection. WebP heroes are below the approximate 250 KB target because quality 94 already preserves visual quality.

Crop coordinates below are percentages from top-left. Retain bounds describe the region that must stay visible, including a small product margin; they are not instructions to crop tightly. Live Shopify crops and actual overlay typography remain for Claude to verify after upload.

## dear-body-home-hero-desktop-v01

- Placement: Horizon Hero desktop background.
- Alt text (all three formats): Citrus Wish perfume bottle and yellow canister on a burgundy platform against warm cream.
- Suggested subject focal point (all three formats): 72%, 50%.
- Safe crop (all three formats): Retain x=58–86%, y=23–84% for products and margin. Tested crop: x=0–100%, y=12.5–87.5% (1440 × 540).
- Live-text-safe region (all three formats): x=4–42%, y=25–70%; calm cream, burgundy live copy.
- Placement limitations (all three formats): Use separate mobile image. Product focal point 72%, 50%; object-position 72% 50% works for the tested wide crop.

| Absolute file path | Dimensions | Format | Bytes | Role |
| --- | --- | --- | ---: | --- |
| /Users/wetrade/Documents/ChatGPT/Dear Body/output/website/banners/dear-body-home-hero-desktop-v01.png | 2400 × 1200 | PNG | 2753339 | Lossless master |
| /Users/wetrade/Documents/ChatGPT/Dear Body/output/website/banners/dear-body-home-hero-desktop-v01.webp | 2400 × 1200 | WEBP | 211664 | Preferred web derivative |
| /Users/wetrade/Documents/ChatGPT/Dear Body/output/website/banners/dear-body-home-hero-desktop-v01.jpg | 2400 × 1200 | JPEG | 545313 | JPEG fallback |

## dear-body-home-hero-mobile-v01

- Placement: Horizon Hero separate mobile background; custom responsive section if mobile field unavailable.
- Alt text (all three formats): Citrus Wish bottle beside its yellow canister on a burgundy platform in warm light.
- Suggested subject focal point (all three formats): 53%, 56%.
- Safe crop (all three formats): Retain x=29–78%, y=33–79%. Tested 390 × 430 top-aligned crop retains x=0–100%, y=0–88.21%.
- Live-text-safe region (all three formats): x=6–94%, y=4–33%; upper cream region.
- Placement limitations (all three formats): For 390 × 430 use object-position 50% 0% to preserve the full upper text zone. Subject focal point is separate from this layout positioning. Keep live copy compact; verify its fit in the theme.

| Absolute file path | Dimensions | Format | Bytes | Role |
| --- | --- | --- | ---: | --- |
| /Users/wetrade/Documents/ChatGPT/Dear Body/output/website/banners/dear-body-home-hero-mobile-v01.png | 1200 × 1500 | PNG | 1943410 | Lossless master |
| /Users/wetrade/Documents/ChatGPT/Dear Body/output/website/banners/dear-body-home-hero-mobile-v01.webp | 1200 × 1500 | WEBP | 168246 | Preferred web derivative |
| /Users/wetrade/Documents/ChatGPT/Dear Body/output/website/banners/dear-body-home-hero-mobile-v01.jpg | 1200 × 1500 | JPEG | 393294 | JPEG fallback |

## dear-body-brand-story-v01

- Placement: Horizon image-plus-text story section; copy beside or below image.
- Alt text (all three formats): Citrus Wish, Moonlight Velvet, Charme Envoûtant and Sunset Cocktail bottles with yellow, lilac, orange and peach-pink canisters.
- Suggested subject focal point (all three formats): 50%, 54%.
- Safe crop (all three formats): Retain x=2–98%, y=25–80%. Preferred full 4:3 frame; avoid square or portrait cover crops, which cut outer products.
- Live-text-safe region (all three formats): No overlay intended. Calm top x=5–65%, y=3–23% exists, but story copy belongs beside or below.
- Placement limitations (all three formats): Use full 4:3 aspect at all breakpoints. Small packaging print is naturally too small to read in the 640 × 480 preview; scent names remain identifiable. Not a bundle offer.

| Absolute file path | Dimensions | Format | Bytes | Role |
| --- | --- | --- | ---: | --- |
| /Users/wetrade/Documents/ChatGPT/Dear Body/output/website/banners/dear-body-brand-story-v01.png | 1600 × 1200 | PNG | 2138244 | Lossless master |
| /Users/wetrade/Documents/ChatGPT/Dear Body/output/website/banners/dear-body-brand-story-v01.webp | 1600 × 1200 | WEBP | 267558 | Preferred web derivative |
| /Users/wetrade/Documents/ChatGPT/Dear Body/output/website/banners/dear-body-brand-story-v01.jpg | 1600 × 1200 | JPEG | 506748 | JPEG fallback |

## Claude upload instructions

Upload the preferred WebP files through Content → Files in the Dear Body — Website Build duplicate. Assign the desktop and separate mobile images to Horizon Hero; if no mobile image field exists, use the planned custom responsive section. Keep the desktop left 42% and mobile upper 30–35% for live burgundy copy. Add DEAR BODY PHILIPPINES, A SCENT JOURNEY, the supplied supporting line and buttons using Shopify controls. Do not bake any copy or logos into artwork. Place FROM LONDON, WITH FEELING beside or below the full 4:3 story image. Inspect actual theme crops after upload.

## Reference audit

Read BRAND_GUIDE.md, brand.tokens.json, UNIFIED_THREE_SCENT_GALLERY_STANDARD.md and all four adjacent approved GALLERY_MANIFEST.md files. Inspected all original source photographs and each approved packshot and architectural hero using labeled reference sheets; inspected Citrus Wish front bottle and packaging at native size. Correct Citrus Wish bottom label was reviewed (P10638); no Mojito references used. Contact sheets and QA previews remain in tmp/banner-qa for audit, outside the delivered asset set.

## Generation prompt set

The following prompts were used with built-in ImageGen. Original photos are product identity references; approved galleries and completed desktop are styling references.

### desktopPrompt

Use case: product-mockup. Create a finished photorealistic Dear Body Shopify desktop banner, wide 2:1 composition, target 2400x1200. Reference 1 and 2 are authoritative original Citrus Wish bottle and canister photographs; reference 3 is approved studio lighting/material style only. Preserve exact real product geometry, glossy black cylindrical cap, silver collar, cylindrical clear glass, golden yellow liquid, bright yellow cylindrical canister with black rims and low sleeve seam. Preserve authentic black labels reading CITRUS WISH and original small PARFUM / LONDON printing and existing mark only. New scene: warm cream #f4e3cb seamless tactile paper/stone studio with burgundy #5c0006 low architectural platform beneath pair and a restrained warm golden light field at far right. No chrome ribbon or other props. Calm subtly textured cream across entire left 46%; no shadows or objects in left text zone. Pair predominantly right: bottle front-left of matching canister, all product silhouettes confined to x=59–85%, y=21–79%, with realistic proportions, front-facing readable labels and convincing contact shadows. Medium-wide editorial product photograph, warm sunlit highlights, generous margin, confident premium approachable feel. Entire product must survive centered 2.667:1 crop removing top/bottom 12.5%. No headline, caption, button, separate logo, monogram, badge, watermark, people, fruit, flowers, spices or invented props. Opaque background. Render just ONE banner image.

### desktopCorrection

Edit this banner with one targeted composition correction: reduce the bottle and canister grouping together to 83% of current size with identical proportions, preserving all exact labels, material, colors, lighting and relative placement. Place their combined silhouette entirely within x=56–82% and y=22–79% of canvas, upright resting naturally on the same burgundy platform (adjust platform height/position only enough to support them). Keep 2:1 wide aspect, all left 42% calm cream, no added text, logos or objects. This correction needs substantial clear space above canister so a centered shallow 2.667:1 crop preserves every product edge.

### mobilePrompt

Use case: product-mockup. Generate the MOBILE portrait companion of reference 1 desktop campaign, 4:5 ratio target 1200x1500. Reference 1 is approved campaign style; references 2 and 3 are authoritative original product identity. Recompose independently: same warm cream tactile wall and tabletop, burgundy low rectangular architectural platform, warm golden editorial light. Entire upper 35% is calm low-detail cream for live Shopify copy; NO text there. One exact Citrus Wish clear cylindrical bottle with golden liquid, glossy black cylindrical cap and silver collar in front-left of one matching bright yellow cylindrical canister with thin black rims. Authentic black labels, white CITRUS WISH and original small PARFUM LONDON mark. Group centered horizontally, silhouettes within x=24–77%, y=42–80%, platform lower, generous cream bottom margin. Physically realistic photographic glass, faithful proportions, crisp front-facing labels, natural contact shadows. No additional props, chrome ribbon, fruits, flowers, people, headline, caption, buttons, logo overlay, monogram overlay, badge or watermark. Products and package identical to desktop; opaque cream background. ONE portrait image.

### storyPrompt

Use case: product-mockup. Create ONE finished photorealistic 4:3 landscape Dear Body brand-story still life, target 1600x1200. References 1–4 are inspected identity/style contact sheets for Citrus Wish, Moonlight Velvet, Charme Envoûtant, Sunset Cocktail respectively; original phone photos are physical identity authority, studio packshots at bottom are approved styling. Reference 5 is this campaign's desktop for continuity. Do not render a contact sheet. Scene: warm cream #f4e3cb tactile studio, cream stone tabletop and restrained low burgundy #5c0006 architectural step, golden daylight and soft realistic shadows, premium approachable warm editorial still life. Exactly FOUR bottles and FOUR CLOSED matching canisters, one pair per scent. Arrange four comfortably spaced pairs across a shallow staggered arc with a single low step, all eight front labels fully visible, no product overlap obscuring labels, entire grouping inside x=10–90%, y=20–82%, generous air. Similar real scale across all four identical cylindrical bottle designs and matching cylindrical packages. From left: CITRUS WISH (golden yellow liquid, bright yellow canister), MOONLIGHT VELVET (colorless liquid, pale lilac canister), CHARME ENVOÛTANT (amber orange liquid, vivid orange canister), SUNSET COCKTAIL (pale peach liquid, peach pink canister). All clear cylindrical glass, thick glass base, black glossy cylindrical cap, narrow silver collar. Exact black front labels with white scent names as spelled, and authentic small PARFUM LONDON printed marks as references. Each bottle slightly in front and to side of its own taller canister. Photo at product eye level, crisp bottle edges and text, convincing reflections and contact shadows, rich real materials. No invented props, chrome ribbons, fruit, flowers, spices or people. NO headline, caption, buttons, separate logo, monogram, badge, watermark, pricing, bundle offer or text outside existing packaging. Opaque photographic background.

### storyCorrection

Targeted correction to this exact four-product story photograph. Keep the entire composition, bottles, packages, lighting, colors, all scent names, and surfaces unchanged. Correct only small existing packaging print on all eight black front labels: below the original small mark and PARFUM it must cleanly read LONDON, straight and legible, not scrambled or misspelled, using authentic compact white uppercase as original packaging. Preserve existing correctly spelled CITRUS WISH, MOONLIGHT VELVET, CHARME ENVOÛTANT, SUNSET COCKTAIL. No new text outside labels. Render high-resolution 4:3 image with sharp printing.

