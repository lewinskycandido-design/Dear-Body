# DearBody UI research: evidence appendix

Research date: 23 September 2026. Prepared from a parallel research review of original Baymard research and W3C guidance, interpreted against DearBody’s local brand and Shopify content documents.

The documented launch catalog contains four men’s fragrances in 50 mL bottles. Fragrance notes, families, concentration, prices and fulfillment details are not confirmed in the current content brief. Recommendations below distinguish published findings from their application to this brand.

| Priority | Recommendation | Primary source and scope |
|---|---|---|
| 1 | Keep Shop All directly accessible and display all four products in a simple grid. Retain Our Story and Contact; avoid empty category landing pages. | Baymard notes that smaller catalogs may not require intermediary category pages. [Category-page research](https://baymard.com/blog/ecommerce-category-page) |
| 2 | Put exact product name, 50 mL volume, confirmed price and purchase action together. Show accurate packshots and a reference that communicates scale. | Baymard’s product-page research discusses visible selectors, scale imagery and purchase information. DearBody’s single documented size needs a label rather than a one-option selector. [Product-page research](https://baymard.com/research-articles/current-state-ecommerce-product-page-ux?r=0) |
| 3 | Make shipping cost or conditional estimate, delivery expectation and returns information easy to find before checkout. | Baymard identifies total-cost visibility and accessible returns information as important purchase-decision needs. Actual copy must come from DearBody’s operations. [Product-page research](https://baymard.com/research-articles/current-state-ecommerce-product-page-ux?r=0), [delivery guidance](https://baymard.com/blog/reduce-cart-abandonment) |
| 4 | Keep guest checkout prominent and display only enabled payment methods. | Baymard supports a visible guest path and clear payment selection. These sources do not establish Filipino shoppers’ payment preferences. [Guest checkout](https://baymard.com/research-articles/make-guest-checkout-prominent), [payment UX](https://baymard.com/blog/payment-ux) |
| 5 | Add real review counts beside averages when reviews exist. Add a ratings distribution when review volume makes it useful. | Counts help users interpret the average; a distribution provides additional context. Neither is a reason to invent social proof. [Review-count research](https://baymard.com/research-articles/user-perception-of-product-ratings), [ratings distributions](https://baymard.com/research-articles/user-ratings-distribution-summary) |
| 6 | Use readable contrast, visible keyboard focus and controls comfortably sized for touch. Keep sticky elements from obscuring focused controls. | WCAG 2.2 requires 4.5:1 for normal text and 3:1 for large text. AA target size is 24 × 24 CSS px, subject to exceptions; 44–48 px is the proposed design target. [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [sticky-bar focus failure](https://www.w3.org/WAI/WCAG22/Techniques/failures/F110.html) |
| 7 | After scent data is confirmed, place a plain-language scent summary and key notes beside each product. Consider filters only when the catalog warrants them. | Baymard supports category-specific attributes and matching filters. Applying that principle to fragrance families is an inference, not a DearBody-tested finding. [Filter research](https://baymard.com/blog/ecommerce-filter-ui) |

## Local implementation implications

The primary design problem is helping a shopper choose and buy one of four fragrances. The existing photography provides visual distinction, but color and packaging descriptions cannot substitute for scent information. Gather brand-approved scent profiles before offering a matching quiz or family-based recommendations.

The current content brief does not establish DearBody’s payment configuration. Philippine providers can support local e-wallets, but enablement depends on the merchant account and integration. [PayMongo plugin documentation](https://docs.paymongo.com/docs/payment-channels-e-commerce-plugins) is technical evidence of possible support, not proof that DearBody accepts those methods. Apply the same rule to COD and shipping promises.

The warm editorial aesthetic is a recommendation from the DearBody brand guide and reference-site review. Published ecommerce research supports the shopping mechanics; it does not prescribe cream backgrounds, burgundy buttons, or a specific display font.

## Validation

Run an initial qualitative round with target shoppers using concrete tasks: choose between two fragrances, find bottle size, determine delivered cost, identify a payment option and complete guest checkout. Capture confusion and task failures before adding new features. Assess behavioral metrics only after real traffic is available.

Baymard’s research is broad ecommerce evidence, substantially drawn from US and European contexts. No DearBody usability sessions, Philippine fragrance-specific conversion study or controlled experiment was conducted here. No numerical conversion lift is claimed.
