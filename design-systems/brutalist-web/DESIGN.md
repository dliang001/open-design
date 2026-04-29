---
category: Style Library
description: Raw HTML brutalism. System fonts, default underlined links, hard borders, no rounded corners, no shadows. Optimised for friction over polish.
tags:
  - brutalist
  - raw
  - monochrome
  - editorial
  - anti-aesthetic
  - bold
era: modern
mood: bold
primary_color: "#000000"
---

# Brutalist Web

> Stripped-back, type-first, deliberately under-styled. Reads like a 1996
> personal homepage rebuilt with 2024 type discipline. Use when the brief
> calls for "raw", "editorial", "anti-corporate", or "indie".

## Visual Theme & Atmosphere
Loud, honest, no decoration. Text does the work. Colour is used for emphasis
only. Layouts are a single column or a hard 2-column split, never a 12-grid.

## Color Palette & Roles
- **Background:** `#FFFFFF` (paper)
- **Foreground:** `#000000` (ink) — all body text and headlines
- **Accent:** `#FF3300` — used for ONE element per screen (a CTA button, a hover state, or an inline highlight); never two
- **Rule:** `#000000` — 1px or 2px lines under headings, around inputs

Optional moody variant: invert the page to `#000000` background + `#FFFFFF` foreground; everything else stays.

## Typography
- **Display:** system-ui (the OS font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`) at heavy weight (800–900). NEVER a custom display font.
- **Body:** Times New Roman or Georgia at 18–22px. Yes, serif body on the web.
- **Mono (when needed):** "Courier New", monospace.
- Justify body paragraphs. Use hanging punctuation. Allow widows.

## Component Stylings
- **Buttons:** plain `<button>` with 2px solid black border, no border-radius, no shadow. Hover inverts colours.
- **Links:** `text-decoration: underline` always. No color change on hover; only thicken the underline.
- **Inputs:** 2px black border, 0 radius, 0 padding-left.
- **Cards:** 1px black border, no shadow, no fill — flat rectangles only.
- **Images:** no border-radius. Captions in mono italic below.

## Layout Principles
- One column at <960px. Hard 2-column split at ≥960px (60/40 or 50/50).
- Outer margin: minimum 32px on the shorter edge.
- Vertical rhythm: 24px baseline grid.
- No carousels. No hero parallax. No animations beyond `:hover` colour swap.

## Depth & Elevation
None. No shadows, no z-stacking effects, no glow. Z-axis does not exist.

## Do's and Don'ts
- **Do** use rules instead of cards.
- **Do** let long text run wide and dense.
- **Do** use `<figure>` and `<figcaption>` for everything image-shaped.
- **Don't** add gradients, shadows, or rounded corners. Ever.
- **Don't** use a custom display font.
- **Don't** centre body text. Left-aligned only.

## Responsive Behavior
- Single column below 960px.
- 2-column split above 960px.
- Type scales with viewport using `clamp()` only on the largest headline.

## Agent Prompt Guide
When generating an artifact under this system, the agent should:
1. Use the system font stack — never a Google Font display face.
2. Use serif body type at 18–22px.
3. Apply the accent colour to exactly one element per page.
4. Use `border` (1–2px solid black) instead of `box-shadow` for any visual separation.
5. Default to a single-column layout; only split on hard editorial demand.
