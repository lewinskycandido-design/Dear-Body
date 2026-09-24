# Homepage, customer-care, pricing and gallery update

This update changes only the local native Shopify theme, its preview and upload archive. No Shopify store configuration, product data or media was changed.

## Final behavior

- Homepage order: main hero → magnetic cap → collectible display → free shipping → Women/Men. The three new features contain no links or buttons.
- Five new built-in ImageGen photographs are installed: three homepage features, one FAQ header and one Shipping header. Both shipping photographs show two closed canisters, each individually bubble-wrapped. The Shipping header uses a distinct new composition.
- The full-width feature/header sections share desktop and mobile banner dimensions. Live Cenzo Flare Bold and Helvetica Now Display Light copy stays over the photos on mobile.
- The current six PHP799 fragrances show an original reference of ₱1,099, savings of ₱300 and a calculated 27.3% discount. The reference is owner-approved; only Mojito currently has it in the unchanged native catalog snapshot. Other prices and currencies retain native compare-at behavior.
- Product galleries use new SVG chevrons and no play button. Visible image galleries advance every eight seconds until manual interaction pauses them for the visit. Reduced-motion browsing is manual. Existing media and single-image fallbacks remain intact.

## Verification

| Area | Result | Evidence |
| --- | --- | --- |
| Homepage features | PASS — 24 responsive cases, 308 checks | [Report](HOME-FEATURES-QA.md) |
| Gallery controls | PASS — 15 scenarios, 91 checks | [Report](GALLERY-CONTROLS-QA.md) |
| Corrected pricing | PASS — 39 checks, eight native fixtures and six PDP routes | [Report](PRICING-CORRECTION-QA.md) |
| FAQ and Shipping headers | PASS — 158 checks, 12 native checks and 16 responsive scenarios | [Report](CUSTOMER-CARE-BANNER-QA.md) |
| Shopify Theme Check | Zero findings | [JSON](theme-check-home-features.json) |
| Product JavaScript syntax | PASS | `node --check theme/assets/sj-product.js` |
| Preserved assets | 171 earlier image, font and logo files unchanged | [Original hashes](offer-preserved-assets.json) |
| New artwork | All five original/export/installed file hashes match | [Homepage manifest](home-feature-assets.json), [customer-care manifest](customer-care-assets.json) |
| Upload ZIP | Every archived file is verified against native source bytes | [Package manifest](package-manifest.json) |

The local image review contains 99 artworks: 72 product gallery frames, 22 previous campaign/header photographs, three homepage features and two customer-care headers. The older QA files remain historical evidence for their respective revisions. Earlier 20% pricing and gallery Play-button descriptions do not describe this update.

Shipping copy remains: 1 item incurs a shipping fee; 2 or more items qualify for free shipping. Delivery times are Luzon 2–3 days, Visayas 3–5 days and Mindanao 5–10 days. Checkout rates still require configuration in Shopify; a theme ZIP displays these terms but cannot configure checkout shipping rules.

Final package: `DearBody-Theme-Update-Homepage-FAQ-Shipping.zip`, 256 native files, 39,547,447 bytes. The Downloads copy matches SHA-256 `301d72635dc125dc2ee9705c777da2aeb60655d79810329e715a6e9618427ea7`. Final preview rebuild validated 67 source files and rendered 22 native-template routes.
