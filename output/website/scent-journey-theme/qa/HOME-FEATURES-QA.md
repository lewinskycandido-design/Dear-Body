# Homepage photo features QA

Verified locally on 24 September 2026 in installed Chrome through Playwright, against the rebuilt native Liquid preview at `http://127.0.0.1:4208`. No live Shopify actions were performed.

**PASS: 24 feature cases, 308 checks, zero failures.** This final rerun follows removal of all feature links/buttons and the revised homepage order. The preview was rebuilt from 66 theme sources into 22 routes before testing. The three features were checked at 320, 390, 768 and 1440 pixels in both Light and Dark. All 97 installed artworks in the checked gallery, campaign, product-banner and home-feature manifests match their hashes: 72 + 16 + 6 + 3, with zero mismatches. A separately requested FAQ banner is outside this report's scope.

The verified homepage order is hero → magnetic cap → collectible → free shipping → Women/Men. Each feature contains zero links or buttons. The features span the viewport and use the shared banner height: 600 pixels on phones, 540 at 768, and approximately 619.19 at 1440. The correct native 1774 × 887 photos load in both modes. Headings and supporting copy stay inside their banners. Mobile text overlays the photo. There is no horizontal overflow, clipped text or JavaScript error. The shipping section retains the two-item condition and single-item fee.

Full feature screenshots were inspected visually, including all three at 320 and 390 in both modes, plus tablet and desktop views:

- Magnetic cap: the lifted cap, underside, gap and exposed sprayer remain visible above the phone copy. Desktop framing deliberately concentrates on this hardware detail; the lower bottle is cropped by the banner.
- Collectible: all four bottle/canister labels remain visible above the phone headline with the 78% focus. At 320, outer product edges approach the crop boundary, but the product identities and intended four-object composition remain clear. Tablet and desktop display the full arrangement.
- Free shipping: both closed canisters and their separate bubble wrap remain visible. The live headline and condition read clearly below their labels on phones, and beside the box on larger screens.

The shorter copy blocks after button removal remain clear on phones, tablets and desktops. No implementation or focal-setting change was required during this rerun. Contrast was visually inspected; this focused report does not claim a numerical contrast audit or checkout verification.

Evidence:

- Reusable check: [home-features-qa.cjs](home-features-qa.cjs)
- Measurements and all assertions: [HOME-FEATURES-QA.json](HOME-FEATURES-QA.json)
- [320 Light contact sheet](screenshots/home-features/contact-light-320.png), [320 Dark](screenshots/home-features/contact-dark-320.png)
- [390 Light contact sheet](screenshots/home-features/contact-light-390.png), [390 Dark](screenshots/home-features/contact-dark-390.png)
- [768 Light contact sheet](screenshots/home-features/contact-light-768.png), [768 Dark](screenshots/home-features/contact-dark-768.png)
- [1440 Light contact sheet](screenshots/home-features/contact-light-1440.png), [1440 Dark](screenshots/home-features/contact-dark-1440.png)

Individual screenshots are retained in `qa/screenshots/home-features/` as `{magnetic,collectible,shipping}-{light,dark}-{320,390,768,1440}.png`.
