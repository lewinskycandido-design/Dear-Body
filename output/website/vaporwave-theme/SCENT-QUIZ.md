# DearBody scent quiz

The homepage **Find your scent** link opens a three-question modal in the Vaporwave theme. It asks which collection, scent direction and character the visitor prefers. Recommendations include the bundled product image, the exact approved scent description, a reason based on matched preferences, and an actual Shopify product-page link when available.

The quiz uses the existing brand colors with framed controls and warm Vaporwave panels. Back, retake, close, keyboard focus cycling and Escape are supported. The result area scrolls on small screens while the close button stays visible. Answers stay in memory for the open quiz; no email address, tracking endpoint, storage or external quiz service is used. Closing and reopening starts again. Without JavaScript or native dialog support, the hero link opens the fragrance catalog.

## Shopify setup

Install `DearBody-Vaporwave-Shopify-Theme.zip` as a separate draft. The quiz is already included. A manual installation must preserve the full theme; the shared layout loads the quiz styles and script as well as the Vaporwave presentation stylesheet. Its main files are:

- `assets/dearbody-quiz.js`
- `assets/dearbody-quiz.css`
- `assets/dearbody-vaporwave.css`
- `sections/db-scent-quiz.liquid`
- `sections/db-hero.liquid`
- `layout/theme.liquid`

In **DearBody lifestyle hero**, leave **Optional button link** empty to open the quiz. A custom link deliberately overrides the quiz. The default **Button label** remains **Find your scent**. The global **DearBody scent quiz** section provides six named product pickers; use these if the store's product handles differ from the defaults below. Select each named scent's matching record, not a different fragrance: the recommendation description and bundled image describe that named scent.

Products resolve through the picker or `all_products[handle]`. A missing/unpublished product has no invented URL and shows **Product page coming soon**. Existing product-page price and availability guards still apply. Products do not need to be purchasable for a visible detail page to be linked. Publishing or activating product records is a separate catalog action.

The collection links use the theme's For Her/For Him collection pickers and their established fallback handles. This quiz ships as a static section; no new Shopify page, app, or page-template assignment is required.

## Approved descriptions and matching rules

The copy below comes from the owner's **Dear Body Brand Deep Dive**, Canva design `DAHIB2UjgJM`, pages 2–4, as recorded in the project's `output/product-listing/SCENT_DESCRIPTION_SOURCE_LEDGER.md`. That ledger's corrected Mistened Narcissus sentence supersedes its older source-facts/gallery copy.

| Fragrance / handle | Collection | Approved description | Direction choices | Character choice |
|---|---|---|---|---|
| Mojito Metallique / `mojito-metallique` | For Her | Soft, creamy sweetness with a light fruity glow. | Fruit or berries; Sweetness | Soft & creamy |
| Amber Oud Silk / `amber-oud-silk` | For Her | Dark spice and smoke with a warm, addictive edge. | Spice; Smoke or woods | Dark & smoky |
| Mistened Narcissus / `mistened-narcissus` | For Her | Juicy berries softened by a smooth, sweet finish. | Fruit or berries; Sweetness | Juicy & smooth |
| Oud Mirage / `oud-mirage` | For Him | Dark rose wrapped in smoky, woody depth. | Rose; Smoke or woods | Dark & smoky |
| Charme Envoûtant / `charme-envoutant` | For Him | Rich, spiced sweetness that feels deep and indulgent. | Spice; Sweetness | Rich & indulgent |
| Rtulle & Satin / `rtulle-satin` | For Him | Airy sweetness with a warm, glowing trail. | Sweetness | Airy & warm |

Collection preference filters candidates, without asking the visitor's gender. The next questions show only choices relevant to that collection. A direction match adds 3 points; a character match adds 2. Open choices add no points. Every highest-scoring candidate is shown, with equal matches identified as a shortlist. Two open preferences show the whole selected collection without claiming a personalized winner. A result's reason mentions only the preferences it actually matched.

These weights are editorial rules for discovering the range, not measured scent similarity. No percentages, unverified fragrance notes, performance, occasion, season or personality claims are used.

## Verification

From `preview/`, run:

```sh
npm run build
node verify-quiz.mjs
node verify-commerce.mjs
```

All 30 quiz checks passed against actual rendered markup, theme JavaScript and Liquid. Coverage includes all six recommendations, filters, ties, conflicting preferences, no-preference shortlists, required answers, Back/reset/reopen state, missing and custom product URLs, product/collection picker overrides, corrected copy and editor-section unloading. The separate 22-check commerce suite also passed for native product interactions and purchase guards.

See `VALIDATION.md` for fresh results from this Vaporwave edition. Native browser dialog focus, Escape behavior, scrolling and visual contrast require a separate browser review; the automated modal shim cannot establish those details. Current sampled browser results are recorded in `VALIDATION.md`. Earlier Liquid Glass layout measurements are not Vaporwave results. This is local-preview validation, not a Shopify upload or publication.
