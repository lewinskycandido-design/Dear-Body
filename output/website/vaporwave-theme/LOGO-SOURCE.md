# DearBody PH logos — Vaporwave edition

Both bundled fallback logos are web recreations of the owner's DearBody Playbook, Canva design `DAHL_W_c7U8`, page 6. They are not original vector or editable master artwork. The original masters were not available in the supplied project.

## Primary wordmark

`dearbody/assets/db-logo-burgundy.png` is the existing transparent 2172 × 724 recreation made for the website on 23 September 2026. It follows the wide uppercase DEAR BODY letterforms and raised PH in the left half of page 6. The theme can use its alpha channel as a mask in brand burgundy or cream.

Use the primary wordmark for the main website header and other formal brand placements. Preserve the complete image proportions and transparent clear space; do not stretch its letterforms.

## Secondary circular monogram

`dearbody/assets/db-logo-secondary.svg` is a vector-native recreation drawn on 24 September 2026 from the right half of page 6. Page 7 was also inspected to cross-check the circular monogram structure. The outline follows the separate outer circle, asymmetrical intertwined lowercase d/b form, and small PH below-left visible on page 6. It is not a replacement generic DB initial badge.

The available reference is a 596 × 335 raster page with a roughly 75-pixel-wide mark. The curves are a careful visual reconstruction at web size, not an exact recovery of the original vector paths. Use the owner's original master when it becomes available.

The SVG viewBox is 120 × 120. Its circular outline is centered at (60, 60), with radius 49 and a 2.4-unit stroke, leaving about 9.8 units of clear space to the file edge. Render at a square aspect ratio; 64–160 CSS pixels suits footer signatures and stamps. At very small sizes the PH detail becomes difficult to read, so do not rely on that detail as functional text. Give the mark additional clear space in its surrounding layout.

The SVG's visible artwork is exactly `#5c0006`. It can also serve as an alpha mask so CSS renders the same shape in cream `#f4e3cb` on dark brand backgrounds. Do not distort, rotate, add new enclosing shapes, or overlay the mark on busy imagery. Primary in the header and secondary in the footer creates a clear hierarchy without duplicating the same logo.

## Local source references

- `../brand-assets/canva-logo-page-6.png` — primary and secondary logos with PH.
- `../brand-assets/canva-logo-page-7.png` — alternate logo applications, used to cross-check monogram structure.
- `../brand-assets/canva-logo-page-8.png` — brand font roles, inspected for context.
- `../../../BRAND_GUIDE.md` — placement, clear-space, color and identity guidance.

The licensed Cenzo Flare Bold and Helvetica Now Display font files are not bundled. Website text uses the documented sans-serif fallbacks; those fallbacks are not represented as the official brand fonts.
