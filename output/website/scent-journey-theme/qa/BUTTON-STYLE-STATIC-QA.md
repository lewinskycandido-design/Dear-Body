# Shared button style static QA — PASS

24/24 checks passed.

Primary actions use scarlet/cream with cobalt paper-edge shadow in Light mode; gold/burgundy with scarlet shadow in Dark. Secondary actions use cream/cobalt. Native disabled, focus, reduced-motion and mobile wrapping styles are declared.

- light primary: 5.78:1
- light primary-hover: 7.98:1
- light secondary: 6.8:1
- light secondary-hover: 6.8:1
- light disabled: 4.78:1
- dark primary: 11.1:1
- dark primary-hover: 13.37:1
- dark secondary: 5.79:1
- dark secondary-hover: 6.8:1
- dark disabled: 5.97:1

- CSS parsing, declared target sizes and exact color contrast are verified. Actual layout, label wrapping and clipping require visual review in the integrated preview.
- No component markup, action hooks, gallery controls, Finder answer cards, header layout or text links changed.

No browser actions, preview rebuild, Shopify edits or package updates occurred.
