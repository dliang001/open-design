---
category: Style Library
description: 无印良品 / MUJI minimalism translated to the web. Beige paper, soft greys, no colour, generous white space, Noto Serif. Calm, restrained, almost monastic.
tags:
  - muji
  - minimal
  - beige
  - calm
  - east-asian
  - paper
era: timeless
mood: minimal
primary_color: "#8C7E6A"
---

# Muji Minimal

> The 无印良品 / Kinfolk / Aesop paper aesthetic. No colour, no decoration,
> just structure. Use for wellness, sustainability, slow-fashion, indie
> studios, anything where "less" is the brand position.

## Visual Theme & Atmosphere
Quiet, paper-like, considered. The page reads like a pamphlet pulled from
a hardback book. Photography (when used) is desaturated, natural-light,
single-subject.

## Color Palette & Roles
- **Background:** `#F4EFE6` (warm paper)
- **Surface 2:** `#FFFFFF` (cooler card paper)
- **Foreground:** `#3A332C` (warm near-black, NOT pure black)
- **Muted:** `#8C7E6A` (dust)
- **Border:** `#D8D0C2` (warm hairline)
- **Accent:** `#3A332C` — same as foreground; the system avoids accent colours by design

If a CTA absolutely needs a colour, use a dark sage `#5A6B57` once per page.

## Typography
- **Display:** "Noto Serif JP", "Source Serif", "Caslon" — humanist serif at light weight (300–400)
- **Body:** "Noto Sans JP", "Inter" at light weight, 17px, 1.7 line-height
- Tracking is loose on display headlines (+1 to +2%)
- Vertical writing-mode (`writing-mode: vertical-rl`) is permitted for one decorative element per page when targeting JP/CN audiences

## Component Stylings
- **Buttons:** text + thin underline, OR a 1px hairline rectangle. No fill.
- **Cards:** thin hairline border, generous internal padding (32px+).
- **Inputs:** 1px bottom rule only.
- **Imagery:** square or 4:5 ratio, 0 border-radius.

## Layout Principles
- Wide outer margins (10–15% of viewport on desktop).
- Body column: 56–64ch — narrow, easy to read.
- Section spacing: 128–192px between major blocks.
- Asymmetric: text aligned left, image aligned right (or vice versa). Never centred body.

## Depth & Elevation
None. Hairline borders only. No shadows.

## Do's and Don'ts
- **Do** use serif type for headlines.
- **Do** keep margins very generous (more than feels necessary).
- **Do** use one image per section, never galleries.
- **Don't** introduce a colour accent without exhausting hierarchy options first.
- **Don't** use bold weight; medium is the heaviest you go.
- **Don't** use shadows, gradients, or rounded corners.

## Responsive Behavior
Margins shrink but stay generous (8% min on mobile). Type holds its size.

## Agent Prompt Guide
1. Use the warm paper background; never pure white as the page.
2. Set headlines in serif at light weight.
3. Use hairline borders and bottom rules instead of filled cards.
4. Prefer no accent colour; if forced, use a single dark sage.
5. Section spacing on desktop is at least 128px.
