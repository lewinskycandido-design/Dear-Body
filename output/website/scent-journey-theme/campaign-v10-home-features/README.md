# Homepage feature photography

Three new photographs were created with the **built-in ImageGen tool** for the local DearBody theme. Each original is a 1774×887 PNG. Quality-92 JPEG exports at the same dimensions are installed in the theme. Website copy is live Cenzo Flare Bold / Helvetica Now Display Light text, not part of the photographs.

| Homepage feature | Final original | Final prompt |
| --- | --- | --- |
| Magnetic cap | [Original PNG](originals/sj-home-magnetic-cap.png) | [Generation prompt](prompts/sj-home-magnetic-cap.txt) |
| Made to collect, made to display | [Original PNG](originals/sj-home-collectible.png) | Exact generation and composition-edit prompts are recorded in [provenance](provenance/sj-home-collectible.json) |
| Free shipping on 2 or more items | [Original PNG](originals/sj-home-free-shipping.png) | [Bubble-wrap edit](prompts/sj-home-free-shipping-bubble-wrap.txt), following the [canister correction](prompts/sj-home-free-shipping-canisters.txt) |

The magnetic-cap photo references the physical Mojito bottle, the close-up of its stepped silver atomizer, the canonical bottle geometry and the approved cap macro. The detached black cap is held just above the separate silver spray assembly. No airtight or leakproof claim is made.

The collectible image shows Mojito Metallique and Amber Oud Silk bottles with their matching closed canisters on a real display surface. Product-specific physical references, exact prompts and composition revisions are retained in its provenance record.

The shipping photo follows both owner corrections: perfume is shown in its closed retail canister, and **each canister is individually wrapped in clear bubble wrap**. The earlier bare-bottle and unwrapped-canister compositions are retained only as superseded sources in `rejected/`; neither is installed.

Final homepage order: main hero → magnetic cap → collectible display → shipping feature → Women/Men collection panels. The three features have no buttons or links. They share the website's full-width banner height, and copy overlays the image on mobile. Both visual modes use the same new photos. The original 72 gallery images and 22 earlier banners are unchanged.

- [Installed asset manifest and checksums](../qa/home-feature-assets.json)
- [Original and JPEG checksum lock](asset-lock.sha256)
- [Homepage visual QA](../qa/HOME-FEATURES-QA.md)
- [Complete update QA](../qa/HOMEPAGE-FEATURES-QA.md)
- [Review all website imagery](http://127.0.0.1:4208/gallery-review)

Installed files: `theme/assets/sj-home-magnetic-cap.jpg`, `theme/assets/sj-home-collectible.jpg`, and `theme/assets/sj-home-free-shipping.jpg`. Editable section: `theme/sections/sj-home-feature.liquid`.
