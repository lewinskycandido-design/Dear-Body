# Claude prompt — build the Dear Body Shopify store

Copy everything between START PROMPT and END PROMPT into Claude. This is a build brief, not a record of completed Shopify work. Codex creates the banner artwork; Claude implements the storefront.

---

START PROMPT

You are my Shopify designer and implementer. Build and save a polished Dear Body Philippines storefront inside my existing Shopify admin. Use your browser tools first. If your browser tools cannot control the correct session or upload local files, use your available computer-use tools to operate Google Chrome on my Mac. Complete the actual Shopify edits; do not stop at advice, a mockup, or a code snippet.

## 1. Open the correct Chrome profile and store

- Use the existing Google Chrome profile associated with **alexmedina0030@gmail.com**. Its visible profile name is **Alex**. Confirm the email through Chrome's profile menu; a profile name alone is insufficient if multiple Alex profiles exist.
- The Shopify admin observed in that profile when this brief was prepared was **https://admin.shopify.com/store/erkayx-xy/**, displayed as **My Store**. Treat this as the starting candidate, not proof that every store in this account is Dear Body. Honor any store correction I supply with this prompt. If the session or store selector presents conflicting destinations, resolve the target before editing.
- Open the existing Shopify tab if it is the correct store. Otherwise open the admin address above in a new tab within the same Chrome profile. Do not create a new Shopify account or a new store.
- If browser automation sees a different profile, switch to native computer use: open Chrome, select **Profiles → Alex**, verify the email, and navigate there. Do not use an unrelated signed-in browser or a fresh guest/incognito session.
- If sign-in, email verification, or two-factor authentication blocks access, let me complete that step. Continue everything else that is possible. If neither browser nor computer access is available, explain the exact unavailable capability; do not claim you edited Shopify.
- Use the UI that is actually visible. Shopify may call the theme editor **Edit theme** or **Customize**. Take a fresh page observation after navigation; do not guess coordinates or theme IDs.

## 2. Read the brand and existing assets

Project folder on this Mac:
`/Users/wetrade/Documents/ChatGPT/Dear Body`

Read these files if your tools allow local files. With computer access only, use Finder → Go → Go to Folder (`Command+Shift+G`), paste the folder path, and open the Markdown/text files. The essential brand rules are also included below, so file-tool limitations must not stop the design work.

1. `BRAND_GUIDE.md`
2. `brand.tokens.json`
3. `brand.css` — reference tokens, not CSS to paste globally without checking the theme.
4. `output/product-listing/UNIFIED_THREE_SCENT_GALLERY_STANDARD.md` — despite its filename, this is the approved FOUR-scent standard.
5. The `GALLERY_MANIFEST.md` beside each approved gallery folder listed in section 7.

Older paths in `START_HERE_NEW_ACCOUNT.md`, older product briefs, `recreated-v2`, and `recreated-v02` do not override the approved folders below. Use the latest approved manifests for product facts. If a historical brief contradicts a current manifest, omit the disputed claim and ask for confirmation only for that fact.

Brand identity:

- Brand: **DEAR BODY**. Market: Philippines. Tagline: **A Scent Journey**.
- Positioning: London-formulated fragrance culture curated for the Filipino lifestyle. Premium, warm, vibrant, playful, confident, approachable, and sensory.
- Avoid clinical beauty styling, generic black-and-white luxury layouts, cool-gradient interfaces, excessive animation, and crowded text.
- Core UI palette: burgundy **#5C0006**, rich red **#9A1106**, burnt orange **#D46601**, golden tan **#E9A250**, cream **#F4E3CB**.
- Use cream for the main canvas, burgundy for primary text, rich red for primary buttons, and cream on dark sections. Orange/tan are accents and graphic fields. Do not use orange or tan for small text on cream. Photography may contain cobalt, chrome, lilac, or yellow; these do not replace the warm UI palette.
- Display font: **Cenzo Flare Bold**. Body/UI font: **Helvetica Now Display**. Neither licensed font file was found locally. Reuse legitimate fonts already installed in the theme if available. Otherwise use **Georgia** or **Cormorant Garamond** for display and **Helvetica Neue/Arial** for body. Do not download unlicensed fonts or claim the fallbacks are the original brand typefaces.
- Primary logo is the DEAR BODY wordmark; secondary logo is a circular monogram. Look in the existing theme and **Content → Files**, and inspect **Settings → General → Brand assets → Manage** if needed. No standalone logo asset was found in the local project. Use an existing approved logo. If unavailable, use a clean temporary text wordmark; flag the missing official asset in the handoff. Do not invent a monogram or extract a distorted logo from bottle photography.

## 3. Audit briefly, then build the working theme

Go to **Online Store → Themes**. For the candidate store, the observed Themes destination is:
`https://admin.shopify.com/store/erkayx-xy/themes`

Record the current theme name/version, existing unpublished work, product count, menus, pages, available brand assets, and currency. Reuse an existing Dear Body draft if one is clearly intended for this build. Otherwise open the current theme's **… menu → Duplicate**, then rename the duplicate **Dear Body — Website Build**. Work on that copy. Record the original theme name for rollback. Do not purchase a theme or install paid apps.

Open **Edit theme/Customize** on that working copy. Build using the installed theme's sections and blocks first. Do not assume the theme is Dawn or that a particular section exists.

This task authorizes saving theme design, uploading the specified public product/banner assets, and preparing the required catalog/page/menu content. Finish as a reviewable draft. Do not publish the theme, remove the storefront password, place an order, purchase a plan/domain/app, or change payment, tax, shipping-rate, authentication, or billing settings.

Important scope detail: products, pages, collections, menus, and general settings belong to the store and can affect the live site even while editing an unpublished theme. Preserve existing business data. For a store already trading, create separate draft menus/pages as appropriate and avoid unreviewed changes to live catalog content; prepare the changes and list them for launch. For a new empty store, create the required draft records directly. Do not duplicate every product merely to style the theme.

Check for missing product prices/availability, customer support details, policies, official logo/fonts, and final banner assets early. Ask for genuinely missing business facts in one concise batch, then continue the independent design work.

## 4. Set the design system in the theme editor

Open **Theme settings → Colors**. If the theme has color schemes, configure:

| Scheme | Background | Text | Primary button | Button text |
|---|---|---|---|---|
| Cream | #F4E3CB | #5C0006 | #9A1106 | #F4E3CB |
| Burgundy | #5C0006 | #F4E3CB | #F4E3CB | #5C0006 |
| Warm tan | #E9A250 | #5C0006 | #5C0006 | #F4E3CB |

Newer themes may expose a color palette instead of schemes. Map these roles to the available palette and section overrides. Verify actual text/button contrast after applying them.

Open **Theme settings → Typography**, and set the approved font or stated fallback. Design targets: main heading approximately 60–80 px desktop and 36–44 px mobile, section headings 32–44 px desktop and 26–32 px mobile, body 16–18 px. Use short uppercase campaign headings with tight, readable line spacing. Product names should retain normal capitalization and correct accents.

Use approximately 1200–1320 px content width, 64–88 px desktop section spacing, 32–48 px mobile spacing, and 20–24 px mobile gutters. Buttons should be at least 44 px tall, with small corner radii and clear hover/focus states. Favor clean edges, subtle borders, and restrained shadows. Keep core controls and headings readable on a 375 px screen.

## 5. Build the homepage in this exact order

Use the editor's top page selector → **Home page**. Match the following roles to the closest available native sections. Remove or hide irrelevant sample content only in the working theme.

### A. Announcement bar

**Header group → Announcement bar**. Burgundy background and cream text. One static message: **A SCENT JOURNEY**. No invented free-shipping threshold, discounts, countdown, or delivery promise. Avoid rotating announcements.

### B. Header and navigation

**Header group → Header**. Cream background, burgundy logo/icons, compact height around 72–88 px desktop and 60–72 px mobile. Use the approved wordmark at roughly 150–180 px desktop and 120–145 px mobile, adjusted to its proportions. Give it breathing room.

Navigation: **Shop All**, **Our Story**, **Contact**. Use a simple mobile drawer. Include native search and cart; show account only if customer accounts are already enabled. Prefer a sticky header only if it does not obscure mobile content.

The navigation header is a real Shopify component. Codex's artwork is for the visual hero/banner beneath it, not an image of navigation buttons.

### C. Main hero

**Template → Add section → Image banner**, **Hero**, or the nearest equivalent. Use one static campaign image, not an autoplay slideshow.

Exact live text:

- Eyebrow: **DEAR BODY PHILIPPINES**
- H1: **A SCENT JOURNEY**
- Supporting line: **London-formulated fragrances, curated for the way you live.**
- Primary CTA: **Shop the Collection** → the actual All Fragrances collection.
- Secondary link: **Discover Our Story** → the actual Our Story page.

Desktop: copy on the left, product composition on the right, calm space behind text. Target a 560–680 px hero height where the theme supports it. Mobile: use a separately composed mobile image; keep the headline and CTA readable without covering bottles. If overlays crowd the image, put the mobile copy in a cream block above the image.

Codex will generate this art. Until files arrive, use an approved `02-brand-hero.png` as a temporary, clearly tracked preview image. Keep all headings, buttons, and links as live Shopify text and controls. Do not stretch a square image into a panoramic banner or use an infographic as the hero.

### D. Featured collection

**Add section → Featured collection**. Heading: **MEET YOUR NEXT SCENT**. Supporting line: **Four fragrances. Your own scent journey.**

Show the four confirmed products in this order: **Citrus Wish**, **Moonlight Velvet**, **Charme Envoûtant**, **Sunset Cocktail**. Four columns on desktop, two on mobile, square images using `01-featured-packshot.png`. Each card shows actual product title and verified store price. Use native product links and native purchase behavior. No fabricated sale labels, ratings, “bestseller” badges, or free-price placeholders. Only enable quick add when a real purchasable variant is available.

### E. Brand story

**Add section → Image with text**. Warm tan or cream background, campaign image on the left and text on the right on desktop; stack on mobile.

- Heading: **FROM LONDON, WITH FEELING.**
- Body: **Dear Body brings London's fragrance culture into everyday Filipino life. Warm, vibrant, and full of personality, our London-formulated fragrances invite you to make scent part of your own story.**
- CTA: **Our Story**.

This is brand positioning, not a claim that the products were manufactured in the UK. Use a Codex story banner when ready or a suitable approved lifestyle image temporarily.

### F. Lifestyle editorial

**Add section → Multicolumn**, **Collage**, or equivalent. Heading: **MAKE IT PART OF YOUR DAY**. Use three visually different images: Citrus Wish coastal scooter, Moonlight Velvet listening bar, Sunset Cocktail Manila Bay promenade. Keep crops respectful of faces, hands, and product labels.

Small labels can be the exact product names; link each to its actual product page. Avoid invented scent descriptions or occasion/performance promises. The current four products are the men's black-label line, and their approved lifestyle galleries use Filipino male talent.

### G. Email signup and footer

Use the native **Email signup** section only if the store's consent/privacy setup supports it. Heading: **YOUR NEXT SCENT JOURNEY STARTS HERE**. Copy: **Join Dear Body for new arrivals and stories.** No invented signup discount. Do not send campaigns or submit anyone's email while testing.

**Footer group → Footer**: burgundy background and cream text, wordmark, tagline, Shop All / Our Story / Contact links, and existing approved policy links. Add social icons only for verified brand accounts. Do not display my Chrome login email as customer support information unless it is independently confirmed as the business contact.

## 6. Create collections, pages, and menus in the correct places

- **Products → Collections**: reuse or create **All Fragrances** containing the four verified products. Use a manual collection if that is simplest. Suggested handle for a NEW collection is `all-fragrances`; preserve established handles. No empty gender categories or note-based filters.
- **Online Store → Pages → Add page**: create or update **Our Story** with the brand positioning above, in two or three short paragraphs. Create **Contact** using the native `contact` template and concise copy: “We'd love to hear from you. Send us a message below.” Use verified business details only.
- **Content → Menus**: create/select the working main and footer menus. Select real Shopify resources in the link picker. Connect the working main menu under **Header → Menu** and the footer menu in **Footer**. If protecting an existing live design, create **Dear Body Main** and **Dear Body Footer** and assign them only to the draft theme.
- **Settings → Policies**: reuse approved policies if present. Do not invent return windows, shipping times, or legal terms. Missing policies belong in the launch checklist, not fabricated customer copy.
- **Online Store → Preferences**: prepare homepage SEO title **Dear Body Philippines | A Scent Journey** and description **Discover Dear Body Philippines: London-formulated fragrances with warm, vibrant personality. Explore the collection and begin your scent journey.** Apply only when appropriate for the target store; note this setting is shared across themes.

For a new store still named “My Store,” prepare **Dear Body Philippines** as the customer-facing store name. If the destination is confirmed as this new Dear Body store, update it under **Settings → General → Store details**. Do not change its legal business name, address, currency, or domain as part of this cosmetic change. Read the current currency rather than simply adding a peso symbol to prices.

## 7. Product data and exact asset folders

Go to **Products → select the exact product → Media**. Reuse existing matching product records. If missing, create draft products; preserve existing prices, variants, merchant SKUs, inventory, and publication status. Do not turn an unpriced draft into a free purchasable item.

Approved folders — upload only their ten numbered final PNGs, in order 01–10:

| Product | Absolute local folder |
|---|---|
| Citrus Wish | `/Users/wetrade/Documents/ChatGPT/Dear Body/output/product-listing/citrus-wish/standardized-v01/final` |
| Moonlight Velvet | `/Users/wetrade/Documents/ChatGPT/Dear Body/output/product-listing/moonlight-velvet/standardized-v01/final` |
| Charme Envoûtant | `/Users/wetrade/Documents/ChatGPT/Dear Body/output/product-listing/charme-envoutant/generated-v01/final` |
| Sunset Cocktail | `/Users/wetrade/Documents/ChatGPT/Dear Body/output/product-listing/sunset-cocktail/standardized-v01/final` |

All four sets follow: 01 featured packshot; 02 brand hero; 03 packaging reveal; 04 material/cap detail; 05–07 lifestyle; 08 product profile; 09 ingredients/care; 10 closing hero. Set **01-featured-packshot.png** as featured media. Never upload contact sheets, old versions, or working backgrounds. Avoid adding duplicates of files already on the correct product. Use the native Mac upload dialog's `Command+Shift+G` to enter an exact folder when necessary.

Confirmed common facts: men's fragrance, **50 ml / 1.69 fl. oz.**, clear cylindrical glass bottle, dark cylindrical cap, cylindrical presentation canister. Exact identifying details:

| Product | Product code (not confirmed merchant SKU) | Barcode | Appearance |
|---|---|---|---|
| Citrus Wish | P10638 | 5056795407291 | Yellow canister, golden-yellow liquid |
| Moonlight Velvet | P10338 | 5056795407260 | Pale-lilac canister, colorless liquid |
| Charme Envoûtant | P10738 | 5056795407307 | Orange canister, amber-orange liquid |
| Sunset Cocktail | P10538 | 5056795407284 | Peach/blush canister, pale-peach liquid |

Use these product codes as reference identifiers only; do not overwrite merchant inventory SKUs. Copy ingredients from each matching manifest or verified package, never from another fragrance. Citrus Wish and Mojito Metallique had swapped packaging in historical photos: never transfer Mojito facts to Citrus Wish.

Do not claim specific top/heart/base notes, scent family, EDP/EDT concentration, longevity, projection, oil percentage, skin benefits, certifications, or manufacturing country without current supplier/owner confirmation. Some older Citrus material says EDP; the current approved gallery omits concentration. Treat that as unresolved.

Write short product descriptions based on verified presentation facts and brand tone. Example for Sunset Cocktail: “Meet Sunset Cocktail: a 50 ml men's fragrance presented in a clear glass bottle with pale-peach liquid, a glossy black cap, and a peach-toned cylindrical canister. A playful, polished addition to your scent journey.” Vary wording without inventing scent attributes. Keep internal phrases such as “awaiting supplier confirmation” off customer pages.

Use factual alt text, such as “Citrus Wish 50 ml fragrance bottle and yellow presentation canister.” Existing infographic text must also be represented in accessible product details where appropriate.

## 8. Design product, collection, and cart templates

Return to **Online Store → Themes → working theme → Edit theme**. Use the top template selector:

- **Products → Default product**: gallery left / purchase information right on desktop; gallery first on mobile. Preserve square source proportions, enable thumbnails/swiping and zoom where native, and keep the packshot first. Put product title, real price, confirmed size, actual variant selector where needed, quantity, and full-width **Add to cart** above long descriptions. Native availability and sold-out states must work. Do not hardcode one fragrance's facts across the shared template.
- Add expandable product details, verified ingredients, and confirmed care information using the product's own content or existing dynamic sources. If custom metafields are genuinely necessary, define them under **Settings → Metafields and metaobjects → Products** (or **Custom data → Products** in older interfaces), populate each product accurately, and connect compatible blocks. Omit unconfirmed fields.
- Add related products using the theme's native section. Keep unsupported review widgets and fabricated testimonials out.
- **Collections → Default collection**: cream canvas, collection heading, square product grid, four columns desktop / two mobile. A four-product catalog does not need elaborate filtering. Use actual titles, prices, and product URLs.
- **Cart** and **Theme settings → Cart**: use the native page or drawer. Verify product image/title/variant, quantity update, remove action, totals, empty state, and checkout button. No invented shipping estimate or payment logo.
- **Pages → Contact**, **Pages → Default page**, **Search**, and **404**: apply consistent typography, spacing, and colors. A 404 should have a real “Continue shopping” destination.

Draft or unpublished products may not appear in storefront previews or support cart tests. If no real approved purchasable product exists, finish the templates and report the exact catalog dependency. Do not activate unpriced products or falsely report a successful checkout test.

## 9. Codex owns the banner artwork

Do not generate banner photography with Shopify Sidekick or substitute unrelated stock imagery. Codex will create the assets. You own the live layout, responsive behavior, text, buttons, and integration.

Early in the build, prepare a **Codex banner request** with the theme name/version, exact section name, desktop/mobile image fields, measured visible aspect ratios, copy position, focal point, and desired output sizes. Paste it in your reply, or save it to:
`/Users/wetrade/Documents/ChatGPT/Dear Body/output/website/CLAUDE_TO_CODEX_BANNER_REQUEST.md`

Use this existing companion brief as the starting specification:
`/Users/wetrade/Documents/ChatGPT/Dear Body/output/website/CODEX_BANNER_DESIGN_PROMPT.md`

Request these text-free assets unless the inspected theme calls for different dimensions:

1. **Desktop hero**, 2400 × 1200: warm editorial bottle/canister composition on the right, quiet cream space on the left 40–45% for live burgundy copy.
2. **Mobile hero**, 1200 × 1500: a separately composed vertical image with intact product identity and generous space appropriate to the actual mobile copy placement.
3. **Story banner**, 1600 × 1200: warm, approachable Filipino fragrance lifestyle or a tactile product scene; no baked-in headline.

Use the user's real products and approved references. No invented bottles, incorrect label text, fake logo, fragrance-note props that imply unverified ingredients, or baked-in buttons. Existing packaging text remains accurate; “text-free” means no added advertising typography.

Expected delivery folder:
`/Users/wetrade/Documents/ChatGPT/Dear Body/output/website/banners/`

Expected web filenames: `dear-body-home-hero-desktop-v01.webp`, `dear-body-home-hero-mobile-v01.webp`, and `dear-body-brand-story-v01.webp`, with equivalent JPG filenames acceptable if Codex delivers those instead. These are requested outputs, not files assumed to already exist. Read Codex's actual `BANNER_ASSET_MANIFEST.md` before uploading.

When artwork is ready, use **Content → Files → Upload files** or the section's **Select image → Add images**. Then return to the exact hero/story section, assign the correct desktop/mobile files, set focal points, and inspect real crops. Continue the rest of the build while artwork is pending; list temporary images precisely.

## 10. Browser-based code fallback only when needed

If native settings cannot implement a required detail, use **Online Store → Themes → working theme → … → Edit code** through the browser. Inspect the actual files before editing. Do not replace the theme with a standalone HTML page.

For example, if the hero cannot select a separate mobile image, a small custom **sections/dear-body-hero.liquid** section may expose desktop/mobile image pickers, heading, body, link, alignment, and spacing settings. Use responsive image rendering with explicit dimensions and separate art direction. Keep text and CTA as semantic HTML and native links. Add **assets/dear-body.css** only if necessary, namespace classes with `db-`, and load it once. Use actual schema/section conventions from the installed theme.

Keep custom CSS small and scoped; Shopify's custom CSS fields have size and selector limits. Prefer native settings for ordinary styling. Never paste the local `brand.css` over the entire theme without adapting its selectors, especially where dark backgrounds need cream headings. Preserve native product forms, variant IDs, cart routes, and theme app integrations.

## 11. Verify and deliver

Save every completed editor change. Check desktop around 1440 px and mobile around 375–390 px, then an intermediate width. Use both the theme editor and the actual draft preview.

Verify homepage hierarchy, all navigation/CTA destinations, all four product images and names, correct prices when supplied, readable type, no horizontal scrolling, mobile image crops, menus, gallery gestures, keyboard focus, and cart behavior where approved purchasable products allow it. Check forms visually and validate their required fields without sending a test email or signing up an address. Reach checkout only if it is already configured; do not place an order or change payment settings.

Use responsive images, reserve image space to prevent layout jumps, prioritize the hero, and lazy-load lower content where the theme already supports it. Avoid unnecessary apps and heavy animations. Compare the result against the supplied brand identity, not just whether the page loads.

Return:

1. Exact Shopify store URL, working theme name, and an available draft preview link.
2. A brief list of completed pages, templates, menus, products, and assets.
3. Any actual theme files you edited and where they are in Shopify.
4. The Codex banner request and which temporary assets still need replacement, if any.
5. Only the real remaining launch blockers, including unverified prices, missing policies, missing logo/fonts, or unavailable purchase tests.

Finish the authorized work before asking me to review. Do not claim the store is live, payment-ready, or fully tested when it is still a draft or waiting on business information.

END PROMPT

---

## Source notes for this brief

Brand and gallery facts come from this project's local brand guide and approved gallery manifests. Shopify menu labels were checked against official guidance on September 23, 2026; actual theme fields vary by theme/version.

- [Duplicate a theme](https://help.shopify.com/en/manual/online-store/themes/managing-themes/duplicating-themes)
- [Theme templates](https://help.shopify.com/en/manual/online-store/themes/theme-structure/templates)
- [Color palettes and schemes](https://help.shopify.com/en/manual/online-store/themes/customizing-themes/theme-editor/color-settings)
- [Menus in Content → Menus](https://help.shopify.com/en/manual/online-store/menus-and-links/editing-menus)
- [Manage brand assets](https://help.shopify.com/en/manual/promoting-marketing/managing-brand-assets)
- [Create a contact page](https://help.shopify.com/en/manual/online-store/themes/customizing-themes/common-customizations/add-contact-page)
- [Theme code editor](https://help.shopify.com/en/manual/online-store/themes/theme-code)
- [Custom CSS limitations](https://help.shopify.com/en/manual/online-store/themes/customizing-themes/edit-code/add-css)
- [Theme previews](https://help.shopify.com/en/manual/online-store/themes/adding-themes)
