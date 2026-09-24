# DearBody product data and Scent Finder

The theme reads product data already present in Shopify. This local build has not created definitions, populated products, assigned collections or connected to a store. A merchant adds the following definitions and confirmed product values after manually uploading the theme. Missing fields are omitted from product pages; no empty scent accordions or invented attributes are displayed.

## Product metafields

Create product metafields in the `custom` namespace. The table gives recommended definitions, not values to assume about a fragrance.

| Namespace and key | Recommended Shopify definition | Where it is used |
| --- | --- | --- |
| `custom.short_description` | Single line text (`single_line_text_field`) | Product card personality and Scent Finder result description. Rendered as plain text. |
| `custom.hero_statement` | Single line text | Product page statement below the title. |
| `custom.bullet_1` | Multi-line text (`multi_line_text_field`) | First “Why you’ll love it” point. |
| `custom.bullet_2` | Multi-line text | Second point. |
| `custom.bullet_3` | Multi-line text | Third point. |
| `custom.bullet_4` | Multi-line text | Fourth point. |
| `custom.bullet_5` | Multi-line text | Fifth point. |
| `custom.scent_description` | Rich text (`rich_text_field`) or multi-line text | “The scent” description. Falls back to the native product description when empty. |
| `custom.scent_character` | List of single line text (`list.single_line_text_field`) | Product scent character chips and the quiz character question. Single line text is also supported. |
| `custom.top_notes` | List of single line text | Product top notes. Only add a verified note pyramid. |
| `custom.heart_notes` | List of single line text | Product heart notes. |
| `custom.base_notes` | List of single line text | Product base notes. |
| `custom.mood` | List of single line text | Quiz mood choices. Single line text is also supported. |
| `custom.occasion` | List of single line text | Product “Perfect for” content and quiz occasion choices. Single line text is also supported. |
| `custom.intensity` | Single line text or list of single line text | Quiz presence choices. Use a confirmed descriptive label, not an invented numeric scale. |
| `custom.gender` | Single line text or list of single line text | Optional quiz selection question. Does not classify products or assign them to Women/Men collections. |
| `custom.scent_finder_enabled` | True or false (`boolean`) | Explicitly opts a product into the quiz. Only a Boolean `true` is accepted. |
| `custom.ingredients` | Multi-line text or rich text | Optional Ingredients detail on the product page. Use official supplied information only. |
| `custom.care` | Multi-line text or rich text | Optional Care detail on the product page. |

Product bullet fields also support single line text and rich text through Shopify’s native `metafield_tag` filter. Notes and occasion display through the same filter. Use the recommended types above for consistent storefront output.

Prices, comparison prices, variants, inventory availability, product URLs, images and product titles always come from Shopify product objects. They are not custom metafields or theme settings. Preserve **Rtulle & Satin** unless the merchant supplies a different official product title.

The build does not seed note pyramids, gender assignments, longevity, concentration, ratings, sales rankings, health claims or ingredient values. The supplied fragrance copy is available separately for merchant review; it is not automatically assigned to products based on their titles.

## Set up Scent Finder

1. Create a page and assign the `page.scent-finder` template. The page handle is your choice.
2. Select that page in **Theme settings → Collections and pages → Scent Finder page**. A homepage Scent Finder section can override the global page selection.
3. Open the page template’s **DearBody scent quiz** section. Select a product collection, or select up to six individual products. Picker labels name the launch scents for convenience; they do not fetch or classify a product by name.
4. On each participating product, set `custom.scent_finder_enabled` to Boolean `true`. Add at least one confirmed value in `scent_character`, `mood`, `occasion`, `intensity` or `gender`.
5. Use consistent descriptive labels across products. Supply separate list values for separate qualities. A single text field containing “Fresh, bright” is one choice; it is not split on punctuation.
6. Configure the quiz introduction, fallback heading, fallback text, browse collection, browse link, spacing and color scheme in Theme Editor.
7. Preview actual products after upload and confirm each choice and result against the approved product information.

A selected collection takes priority over all individual product pickers and supplies up to its first **50 products**. Individual pickers supply at most six. Repeated selections are deduplicated by product ID. Products that are disabled, have an incorrectly typed enablement field, have no supported attribute values, or lack a valid product destination do not participate.

## How matching works

The quiz builds every answer option from participating products’ supplied attribute values. It asks only questions for which at least one supported value exists. There are no preset gender options, score scales, fragrance weights or inferred product associations.

Matching is a transparent filter: a result must contain **every selected quality** in its corresponding confirmed field. Whitespace at the beginning and end is ignored; comparisons are case-insensitive. Missing values cannot satisfy a choice. All qualifying products are shown in the configured source order. Ties are retained; no “best match” percentage or rank is invented.

“I’m open to any” skips a dimension. Skipping all questions displays a browse state without arbitrary recommendations. An incompatible combination displays an honest no-match message and lets the visitor adjust their answers. Results show the shared qualities, current Shopify price, availability and a native product link. Sold-out matching products can still be explored and are labeled currently sold out.

When no usable profiles exist, the quiz stays unavailable and displays the merchant-configurable fallback content. Its hero start button remains hidden. A working browse link is present in server-rendered HTML even with JavaScript disabled or unavailable. Setup instructions are visible only in Theme Editor.

Only single line text and lists of single line text participate in the five quiz dimensions. Numeric, rich text, reference or unsupported field types are ignored by the quiz. The current quiz does not calculate numeric sweetness, freshness, warmth or depth, and does not match against the note pyramid. Extend the data contract deliberately before adding such dimensions; do not derive unverified scores from product names or prose.

## Collections, moods and SEO

Women’s and Men’s products must be curated by the merchant using official classifications. Select the actual collections in Theme settings; collection handles are not assumed. The optional `collection.women` and `collection.men` templates provide the supplied campaign copy and SEO defaults without changing membership. `collection.launch` provides the six-fragrance launch copy; assign it only to the confirmed launch collection. A global Launch collection picker provides the same launch SEO detection for the default collection template.

Shop by feeling uses ordinary editable blocks with a **title, description, collection picker and image picker**. No metaobject definition is required. Its six supplied mood titles are campaign labels, not product assignments. A block without an assigned collection is a noninteractive editorial mood card. Selecting a collection turns it into a link; only curate that collection from verified scent data.

The `page.our-story` template and the global Our Story page setting support any chosen page handle. Supplied page and collection SEO defaults apply to explicit template or picker assignments. Custom Shopify SEO titles and descriptions take precedence for those pages. Homepage title and description defaults are editable globally.

## Validation performed locally

`preview/test-discovery.mjs` uses synthetic fixtures that are not shipped inside the upload ZIP. Tests verify strict Boolean enablement, the 50-product limit, deduplication, supported field types, data escaping, exact matches, no-match and skip behavior, editable fallbacks, keyboard focus, independent quiz instances, Theme Editor reloads, direct mood collection settings, page destinations and SEO metadata precedence. These checks do not claim to validate merchant data or a live Shopify store.
