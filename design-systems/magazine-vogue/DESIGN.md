---
category: Style Library
description: Vogue / Harper's Bazaar editorial fashion. High-contrast Didone serif at extreme weight, generous columns, full-bleed imagery, asymmetric grid. For fashion, beauty, lifestyle long-form.
tags:
  - magazine
  - editorial
  - fashion
  - didone
  - serif
  - long-form
  - luxury
era: timeless
mood: luxurious
primary_color: "#0E0E0E"
---

# Magazine Vogue

> The fashion-magazine spread aesthetic: Didot / Bodoni masthead, narrow
> editorial columns, full-bleed photography, occasional decorative drop
> caps. Use for fashion, beauty, hospitality long-form features, premium
> e-commerce editorial content.

## Visual Theme & Atmosphere
Confident, elegant, high-contrast. Type has presence. Photography breathes
across the page. Layouts are deliberately asymmetric — the eye is led by
imagery, not by uniform grids.

## Color Palette & Roles
- **Background:** `#FFFFFF` (paper)
- **Background variant:** `#F5F0E8` (warm cream, used on long-form pages)
- **Foreground:** `#0E0E0E` (true black)
- **Muted:** `#7C7C7C` (mid grey)
- **Accent:** `#9C1B1B` (editorial wine red) — used for one pull quote / drop cap per article
- **Rule:** `#0E0E0E` at varying weights (0.5px, 1px, 2px depending on hierarchy)

## Typography
- **Masthead / display:** "Didot", "Bodoni 72", "Playfair Display" at extra-bold (800–900). High contrast (thin to thick stroke).
- **Sub-display:** same family at light italic for kickers.
- **Body:** "Lora", "EB Garamond", "Cormorant" — humanist serif at 18–19px, 1.65 line-height
- **Sans-serif (kickers / labels):** "Inter Tight" at small size, ALL CAPS, +12% tracking
- Drop caps on the first paragraph of feature articles

## Component Stylings
- **Pull quotes:** centred, displayed in display serif at 36–48px, with a thin red rule above and below.
- **Buttons:** small ALL-CAPS sans label with a 1px black underline. No filled buttons.
- **Imagery:** full-bleed at hero; bordered (1px rule) when inline.
- **Captions:** small italic serif, indented, often 60–70% the column width.

## Layout Principles
- Asymmetric 12-column grid: text in 5 columns, photography in 7 (or vice versa).
- Generous outer margins on desktop (120–160px).
- Pull quotes break the column rhythm — they're 80–90% wide and centred.
- Body columns are NARROW — 56–64ch — easy to read despite serif body.

## Depth & Elevation
None. Photography provides depth.

## Do's and Don'ts
- **Do** use Didone display at extreme weight for the masthead.
- **Do** add a drop cap to feature articles.
- **Do** use full-bleed photography in the hero.
- **Don't** use sans-serif body.
- **Don't** centre everything — composition is asymmetric.
- **Don't** introduce a third colour beyond black and editorial red.

## Responsive Behavior
Columns collapse to single column on mobile. Masthead scales with `clamp()` but never below 48px. Drop caps adjust to single-line on small viewports.

## Agent Prompt Guide
1. Use a Didone serif at extra-bold weight for the masthead.
2. Body type is humanist serif at 18–19px on a 56–64ch column.
3. Add a drop cap to the first paragraph of feature blocks.
4. Use editorial wine red exactly once per article (drop cap or pull quote).
5. Hero imagery is full-bleed, no border-radius, no shadow.
