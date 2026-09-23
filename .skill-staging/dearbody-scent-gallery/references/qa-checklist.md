# DearBody Gallery QA Checklist

Use this checklist on every audit pass. A frame passes only when every applicable hard gate passes. Attractive styling never compensates for an identity, factual, anatomy, readability, or technical failure.

## Hard Gates For Every Frame

- **Correct role:** The image clearly performs its assigned gallery function.
- **Product identity:** Scent name, DearBody/Parfum London mark, label color, bottle, cap, pump, liquid, package color, and proportions match the references.
- **Legible brand text:** Required label and infographic text is exact, correctly spelled, unobstructed, and readable at mobile size.
- **No invented information:** Notes, ingredients, claims, measurements, product codes, barcode, warnings, and benefits come only from verified sources.
- **Physical realism:** Hands, fingers, face, limbs, grip, seating, clothing, vehicle or furniture interaction, shadows, reflections, and perspective are plausible.
- **Product realism:** The bottle is not floating, fused into a hand, oversized, undersized, duplicated, warped, or missing necessary parts.
- **Casting:** Black-label men's scents use male models only. White-label women's scents use female models only.
- **Clean scene:** No accidental text, watermarks, unrelated brands, malformed logos, duplicate accessories, or unexplained objects.
- **Publication vibe:** The frame is visually appealing, vibrant, approachable, contemporary, and recognizably DearBody Philippines.
- **Technical:** Final file is a unique 2048x2048 PNG, intended for sRGB display, and correctly named.

## Brand Architecture Review

Answer `YES` to all five:

1. **Appealing:** Is the composition polished, intentional, balanced, and commercially usable?
2. **Vibrant:** Does it have lively contrast and confident color without looking neon, muddy, or chaotic?
3. **Approachable:** Does the subject feel natural and relatable rather than aloof, over-luxury, or synthetic?
4. **DearBody:** Are shared anchors, clear hierarchy, product prominence, and youthful Philippine-market energy present?
5. **Scent-specific:** Could this scene belong uniquely to this scent rather than being swapped into another gallery unchanged?

Any `NO` means revise.

## Frame-Specific Checks

### 01 Featured Packshot

- Bottle and complete package are both clearly visible.
- Front labels are square to camera and exact.
- Product is the unmistakable focal point; props do not compete.
- Lighting reveals glass, liquid, label, and package material.

### 02 Architectural Brand Hero

- Uses bold shapes, platforms, or architectural light in the scent palette.
- Bottle and package remain readable against the stronger environment.
- Shared DearBody visual language is present without copying another scent's composition.

### 03 Packaging Reveal

- Canister is visibly open and construction makes sense.
- Bottle placement inside or beside the open package is physically plausible.
- Lid, base, and package scale match the reference.

### 04 Material Detail

- Macro view accurately features cap emboss, glass, label, chrome, or package texture.
- No invented embossing, seams, hardware, or finish.
- Focus and crop feel intentional, not accidental.

### 05 Full-Person Lifestyle Hero

- Full-person pose and environment are natural.
- Product interaction is believable and the bottle remains readable.
- Scene is unique to this scent and not a reused vehicle, court, rooftop, or pose from another scent.
- Wardrobe and location express the scent palette without becoming costume-like.

### 06 Product-In-Hand Lifestyle Detail

- Hand anatomy and grip are correct; all visible fingers have a plausible function.
- Bottle scale and perspective match the hand and camera distance.
- Accessories and sky or environment are culturally plausible and do not obscure the product.

### 07 Social Or Editorial Lifestyle

- The moment feels candid, social, and approachable while still art-directed.
- Product is integrated into the action rather than pasted in front.
- Pose, location, props, and energy differ from frames 5-6 and from other scent galleries.

### 08 Product Profile Infographic

- Uses only verified product facts.
- Information hierarchy is clear at mobile size.
- Product image does not cover text.
- Text on cream or beige is near-black or oxblood. Yellow, lilac, or orange text appears only on a sufficiently dark field.

### 09 Ingredients And Care Infographic

- Ingredients and safety copy are transcribed exactly from the package.
- No ingredient is added, omitted, reordered, or promoted into a claim.
- Volume, product code, barcode, and flammability warning are exact when included.
- Copy is readable without zooming beyond a normal product-listing view.

### 10 Closing Hero

- Includes the exact heading `A SCENT JOURNEY` with strong contrast.
- Elevated or rooftop atmosphere feels aspirational but approachable.
- Product and package close the same visual story established by frames 1-9.
- No tiny low-contrast copy or product silhouette loss at dusk.

## Cross-Gallery Lifestyle Diversity

Maintain a quick matrix for frames 5-7 across all scents with these columns:

- Location
- Time of day
- Pose/action
- Wardrobe silhouette and dominant color
- Main prop
- Camera distance and angle
- Social energy
- Philippine-context cue

No two scents may match across most columns. Changing only the shirt or background color is not sufficient.

## Iteration Record

For every revision pass, record:

| Frame | Status | Blocking issue | Revision made | Re-audit result |
|---|---|---|---|---|
| 01-10 | PASS/REVISE | Specific observable defect | Targeted correction | PASS/REVISE |

Lock passing frames with SHA-256. After every targeted regeneration, verify the locks before doing the next full-set audit.

## Final Set Review

- Exactly ten frames, in the fixed order.
- One coherent system across type, scale, spacing, polish, and color anchors.
- Three distinct lifestyle narratives within the scent.
- No lifestyle narrative duplicated from another scent.
- Infographics are useful, accurate, and readable.
- Product identity is consistent across all ten frames.
- Contact sheet matches the final individual files.
- No known defects remain.
