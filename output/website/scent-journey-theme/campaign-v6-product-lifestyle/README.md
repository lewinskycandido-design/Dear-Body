# Filipino product lifestyle banners

Six original lifestyle photographs were generated with the built-in `image_gen.imagegen` tool for the priority DearBody product pages. Each banner features exactly one adult Filipino person in a believable everyday place. Personalities and styling are editorial interpretations of the owner's approved scent descriptions, rather than new fragrance or performance claims.

| Product | Personality and scene |
| --- | --- |
| Mojito Metallique | Cheerful and approachable; a neighborhood café coffee run |
| Amber Oud Silk | Confident and expressive; getting ready at home |
| Mistened Narcissus | Original v6: playful and creative; a local record-shop outing. Accepted roller-rink replacement installed from `../campaign-v7-banner-refresh/`. |
| Charme Envoûtant | Warm and sociable; preparing for a barkada meetup on a neighborhood terrace |
| Oud Mirage | Quietly creative; packing up at a neighborhood bookshop |
| Rtulle & Satin | Easygoing and friendly; a getting-ready moment beside an empty neighborhood court |

Original PNG files are preserved under `originals/`, exact prompts under `prompts/`, and source/reference paths, visual audits, export settings and hashes under `provenance/`. The six production JPEGs are in `final-web/` at their original 1774 × 887 resolution. JPEG conversion changes compression only; no cropping, resampling, compositing, or painted label correction is applied to these files.

The physical product references govern bottle shape, label, cap, liquid and true50ml scale. The shared canonical bottle geometry is a secondary shape reference. Full-resolution review checks one person total, realistic setting construction, natural anatomy, coherent light, product identity and usable space for the website copy.

Product names, approved statements, and buttons are live Liquid text in the supplied Cenzo Flare Bold and Helvetica Now Display Light fonts. The banner contains the page's sole H1; the repeated detail-panel title and statement are disabled in the supplied product template. One lifestyle photograph serves both Light and Dark. Mobile live copy remains over the lower photograph, with cream text on a warm burgundy scrim and a responsive crop that prioritizes the face. The current shared-height revision uses `clamp(540px, 43vw, 650px)` on desktop and `600px` on mobile across full-width homepage, page, product and footer banners; category gateway tiles are separate. Final review passed 66 responsive cases and 1,248 checks; see [Unified banners QA](../qa/UNIFIED-BANNERS-QA.md). The earlier [Mobile banner overlay QA](../qa/MOBILE-BANNER-OVERLAY-QA.md) passed 33 cases and 385 checks before this sizing change and remains historical evidence.

The Mistened Narcissus banner alone has been replaced from `../campaign-v7-banner-refresh/`, with the native 1774×887 original PNG and website JPG retained under `originals/` and `final-web/`. The accepted image shows one adult Filipina at a realistic covered Metro Manila roller rink/bench, a berry-red tee and cream trousers, the authentic clear bottle and pale-lavender skates, with no additional people. Independent native-image visual review passed; responsive layout QA also passed. The other five product banners, all 72 gallery frames and sixteen other campaign photographs remain unchanged.

The superseded `campaign-v5-product-banners/` still-life exploration is retained for provenance but is not installed in the theme or shipped in the ZIP. The existing twelve-frame galleries and sixteen other campaign photographs remain unchanged. No Shopify Admin changes were made for this update.

[Review the banners](http://127.0.0.1:4208/gallery-review#product-banners)
