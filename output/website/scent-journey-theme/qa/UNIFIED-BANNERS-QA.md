# Shared banner height and Mistened artwork QA

PASS — 66 local Chrome cases, 1,248 checks, zero failures. This run checks the new shared banner sizes directly; earlier height baselines were intentionally not used.

Coverage includes Home, Women, Men, Shop all, Scent Finder, Our Story and all six product pages at 390px and 1440px in Light and Dark. Home, Our Story and Mistened Narcissus also run at 320px, 820px and 1920px in both modes. Each case checks the main campaign header and footer banner; category tiles are excluded.

| Viewport width | Header height | Footer height |
| --- | --- | --- |
| 320 / 390px | 600px | 600px |
| 820px | 540px | 540px |
| 1440px | 619.1875px | 619.1875px |
| 1920px | 650px | 650px |

Every banner spans the viewport and loads the expected artwork. Copy, headings and controls remain inside the banner; mobile copy overlays the photograph. No horizontal overflow, clipped text ranges or JavaScript errors were detected.

All ten header contact sheets were visually inspected, together with full-size mobile and footer closeups. Faces remain clear at the tested crops. Our Story intentionally keeps the right pair on mobile; its tablet framing retains all three faces. The replacement Mistened image shows one woman at a plausible roller-skating rink, with visible headroom and the bottle above the mobile title area. The pre-existing top-edge hair composition in the Oud and Charme source photos is unchanged. Footer statements remain centered and readable in both modes.

Evidence:

- [Machine report](UNIFORM-BANNER-QA.json)
- [Reusable read-only check](uniform-banner-qa.cjs)
- [Light mobile contact sheet](screenshots/uniform-banners/contact-light-390.png)
- [Dark mobile contact sheet](screenshots/uniform-banners/contact-dark-390.png)
- [Light desktop contact sheet](screenshots/uniform-banners/contact-light-1440.png)
- [Dark desktop contact sheet](screenshots/uniform-banners/contact-dark-1440.png)
- [Narrow mobile proof](screenshots/uniform-banners/contact-light-320.png)
- [Tablet proof](screenshots/uniform-banners/contact-light-820.png)
- [Wide desktop proof](screenshots/uniform-banners/contact-light-1920.png)

Additional individual header/footer images and Dark-mode representative contact sheets are in `screenshots/uniform-banners/`. This was local preview QA only; no theme source, store data or Shopify settings were edited by this check.
