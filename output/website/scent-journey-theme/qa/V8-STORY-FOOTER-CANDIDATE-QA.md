# V8 candidate framing and contrast review

Story and Footer layout/framing: PASS in Light/Dark at 320, 390 and 1440px. Six cases / 60 checks passed. Browser request interception served the exact accepted v8 files without replacing native theme assets during the review. Both Story faces remain visible with generous headroom, and mobile copy stays below the faces. Footer burgundy text over the bright cream wall is clear in both modes; the 20% cream scrim preserves the sunny photograph.

The initial desktop Dark Story gradient produced a measured 2.49:1 minimum contrast behind the large title at 1440px (2.89:1 at 820px). Root applied the stronger shared page-banner scrim. A fresh check of actual CSS, without style injection, passed Story and Finder at 820/1440px: large-title minimum 5.71:1; normal-copy minimum 7.08:1. Faces remained bright and unobstructed.

The requested additional gateway check found insufficient contrast in the original top/bottom gradient over the new Women/Men photographs. At 320/1440px Light, small labels/supporting text reached only 1.80–2.82:1 and large collection titles 2.78–2.98:1. The following browser-tested replacement passed all sampled text at 5.81:1 or higher while preserving clear face centers:

```css
.sj-doorway-link::after {
  background: linear-gradient(180deg,
    rgba(43,8,14,.78),
    rgba(43,8,14,.68) 8%,
    transparent 18%,
    transparent 36%,
    rgba(43,8,14,.72) 62%,
    rgba(43,8,14,.92));
}
```

The gateway change was supplied to root for application; this review did not edit theme code. Root owns the final installed-asset verification.

Evidence:

- [Story/Footer layout report](V8-STORY-FOOTER-CANDIDATE-QA.json)
- [Native shared-scrim measurements](screenshots/v8-story-footer-candidate/native-shared-scrim-sampling.json)
- [Gateway proposed-scrim measurements](screenshots/v8-story-footer-candidate/gateway-scrim-sampling.json)
- [Story mobile Light](screenshots/v8-story-footer-candidate/story-light-320.png)
- [Story desktop Dark, applied shared scrim](screenshots/v8-story-footer-candidate/story-dark-1440-native-current.png)
- [Footer desktop Dark](screenshots/v8-story-footer-candidate/footer-dark-1440.png)
- [Women gateway proposed gradient](screenshots/v8-story-footer-candidate/gateway-women-light-1440-proposed.png)
- [Men gateway proposed gradient](screenshots/v8-story-footer-candidate/gateway-men-light-320-proposed.png)

Contrast sampling compared CSS foreground colors with screenshot backgrounds directly beneath detected text glyphs after hiding only live text in the browser. Tiny collection numerals without fully opaque glyph pixels used the conservative minimum background contrast across their whole text box.
