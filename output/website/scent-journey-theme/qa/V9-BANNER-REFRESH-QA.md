# Pop Editorial banner refresh — v9 QA

Status: PASS. The current installed refresh contains 22 unique new campaign photographs inspired by the owner's supplied publication-materials reference. These results describe the installed v9 assets, not the archived v8 set.

## Verified

- **84 responsive banner cases, 1,608 checks, zero failures** across Homepage, Women, Men, Shop All, Scent Finder, Our Story and all six product headers, including each page's footer. Core widths: 320, 390, 1440px; additional Home/Story/Mistened cases: 820, 1920px. Both visual modes are covered. See [machine report](V9-BANNER-QA.json).
- **8 homepage gateway cases passed** at 320, 390, 820, 1440px in Light and Dark. Correct artwork, full clickable collection links, contained copy and no horizontal overflow. See [gateway report](V9-GATEWAY-QA.json).
- Shared full-width banner heights, image coverage, correct mode/artwork, live copy within banners, mobile copy over photographs and no JavaScript errors all passed.
- Shopify Theme Check: **zero findings**, [JSON](theme-check-v9.json).
- Local renderer: 62 theme source files validated, 22 routes rendered with one H1 each, no duplicate IDs and no missing referenced assets. See [preview report](../preview/public/preview-report.json).
- All 22 final PNG/JPEG pairs are checksummed; all new JPEG hashes differ from the previous release. Installed campaign JPEG total: 11,523,672 bytes. Native PNG sizes retained through sRGB JPEG encoding; no crops, enlargement or raster retouching were performed by the export script.
- The 72 locked gallery images, 72 source images and72 thumbnails match the pre-refresh manifest; font and gallery locks are also checked by the packaging script. No commerce or gallery interaction code changed.

## Visual inspection

Each accepted native composition was reviewed for the new colour direction, natural anatomy, plausible setting, single-person scene, product references where applicable and space for live copy. ImageGen framing revisions restored headroom. Product label revisions improved small physical names; small packaging lettering remains limited by native pixel density and should not be treated as a high-resolution packaging master. Editable website headings carry the fully legible product names.

Root reviewed all 320/390px Light headers and 390px Dark headers in contact sheets, with targeted gateway/footer/desktop checks. An independent reviewer inspected both 1440px contact sheets, Story in both modes at 820px and both 320px footer banners: no material crop, face, heading overlap or readability issues. The footer's mobile crop was moved to 70% to retain accessory detail while protecting the central statement. All other existing crop rules passed with the new photos.

Screenshots: [banner contact sheets](screenshots/v9-pop-editorial/) and [gateway screenshots](screenshots/v9-gateways/). Native review and detailed generation/repair provenance are in [the current campaign folder](../campaign-v9-pop-editorial/README.md). The refreshed comparison was also opened and visually confirmed in the in-app browser.

## Packaging and limits

The upload ZIP is **DearBody-Theme-Update-Pop-Editorial-Banners.zip**. The packaging script verifies every archived byte and the native Shopify root folders, gallery assets, campaign assets and both supplied webfonts. Final archive metadata is in [package manifest](package-manifest.json).

This is local theme and responsive-layout verification. No Shopify store data, media library, shipping configuration or published theme was edited. The local preview does not validate Shopify checkout or its hosted Theme Editor.
