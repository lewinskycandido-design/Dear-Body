# Warm, vibrant banner refresh — final QA

All 22 active campaign and gateway photographs were regenerated with built-in ImageGen, saved at native dimensions, reviewed individually and installed into the native Shopify theme. Both visual directions use bright daylight. Each product header features one adult Filipino person in a believable, distinct everyday scene.

## Verification

- Full-width campaign headers and footers: **84 responsive cases, 1,608 checks, zero failures**. Every current banner route was checked at 320, 390 and 1440px in both modes, with additional Home/Story/Mistened checks at 820 and 1920px. [Machine report](V8-BANNER-QA.json).
- Homepage Women/Men gateways: **8 cases passed**, covering 320, 390, 820 and 1440px in both modes. Correct image variants and collection destinations loaded; copy remained inside each clickable panel; no horizontal overflow. [Machine report](V8-GATEWAY-QA.json).
- Shopify Theme Check: **zero findings**. [Report](theme-check-v8.json).
- Local native-template adapter validated 62 theme source files and rendered 23 routes, each with one H1, no duplicate IDs and no missing referenced assets.
- Native-image and rendered contact-sheet review: clear faces, practical settings, distinct product scenes, correct product identity/shape, no extra product-scene people, warm colour and natural anatomy. Amber's background sleeve was inspected closely and contains abstract/floral marks; the original accepted image was retained. Unneeded candidate repairs remain unshipped.
- All 22 JPEG hashes differ from the previous campaign files. [Installed manifest](../campaign-v8-warm-vibrant/provenance/installed-assets.json) and [original/export checksum lock](../campaign-v8-warm-vibrant/asset-lock.sha256).

## Integration adjustments

Main banner sizing remains one shared responsive height: 600px through 760px, then clamp(540px,43vw,650px). All main banners remain full width. Mobile text stays over photography. Home and Story horizontal mobile focal positions were tuned to83% and76%; portrait gateway and story-body photos use top vertical alignment to preserve hair in wider crops.

The desktop Dark page scrim was strengthened behind copy while leaving the faces bright. Actual-glyph sampling for Story/Finder at820/1440 exceeded3:1 for large headings and4.5:1 for normal copy. The gateway overlay was adjusted around top labels and lower copy; sampled minimum contrast reached5.81:1. The footer retains its sunny photography in both modes with burgundy type and a light20% cream scrim. [Contrast and framing review](V8-STORY-FOOTER-CANDIDATE-QA.md).

The supplied Cenzo Flare Bold and Helvetica Now Display Light webfonts, transparent logos, navigation icons, single-result Finder, native commerce data and72 product-gallery frames were preserved. Packaging verifies gallery/source/thumbnail/font hashes and every archived byte. No Shopify edits or publication occurred.

## Visual evidence

[Phone Light contact sheet](screenshots/v8-warm-vibrant/contact-light-320.png) · [Phone Dark contact sheet](screenshots/v8-warm-vibrant/contact-dark-320.png) · [Desktop Dark contact sheet](screenshots/v8-warm-vibrant/contact-dark-1440.png).

Production JPEGs and accepted native PNGs are indexed with exact generation prompts in the [campaign handoff](../campaign-v8-warm-vibrant/README.md).
