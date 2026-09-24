# Customer-care banner QA — PASS

158/158 checks. 12 native render checks and 16 banner scenarios.

FAQ and Shipping checked at 320, 390, 820 and 1440px in Light/Dark: one live H1, no header CTA, correct loaded photo, shared full-width height, text over photo within bounds, no horizontal overflow, Cenzo heading, FAQ interaction and exact shipping facts. Privacy/Terms retain one H1 and no added banner.

- Only FAQ, Shipping and unchanged Privacy/Terms pages are checked. No forms, cart or external services are modified.
- Native Liquid checks validate editable images and policy preservation; browser screenshots require separate human visual review for face/phone/canister crop.

- faq-light-320: PASS
- shipping-light-320: PASS
- faq-dark-320: PASS
- shipping-dark-320: PASS
- faq-light-390: PASS
- shipping-light-390: PASS
- faq-dark-390: PASS
- shipping-dark-390: PASS
- faq-light-820: PASS
- shipping-light-820: PASS
- faq-dark-820: PASS
- shipping-dark-820: PASS
- faq-light-1440: PASS
- shipping-light-1440: PASS
- faq-dark-1440: PASS
- shipping-dark-1440: PASS

No automated failures.

Screenshots: screenshots/customer-care-banners/. All 16 screenshots were independently inspected after the automated run.

## Visual review — PASS

FAQ keeps the face and blue phone clear at every tested size. Shipping uses a narrow mobile override of `75% top`; both MOJITO METALLIQUE and AMBER OUD SILK remain readable above the text at 320px and 390px. Outer package edges crop at 320px, while both identities and bubblewrap remain clear. Live text is legible and does not overlap the face, phone or product names. Desktop/tablet text remains left of the main subjects.

Only the Shipping mobile crop required a scoped CSS addition. Shared banner heights and all other pages remain unchanged.
