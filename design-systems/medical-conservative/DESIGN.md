---
category: Style Library
description: Healthcare and clinical conservative. Calm blue and trustworthy white, ample whitespace, rounded corners (not too round), accessible-first typography. For medical, healthtech, telehealth, pharmacy, insurance.
tags:
  - medical
  - healthcare
  - clinical
  - conservative
  - accessible
  - blue
  - trustworthy
era: modern
mood: confident
primary_color: "#1A6FBF"
---

# Medical Conservative

> The aesthetic of a thoughtful clinic, not a startup. Calm, accessible,
> trustworthy — the visual equivalent of "we read your notes carefully."
> Use for healthtech, telehealth, pharmacy, insurance, clinical SaaS,
> patient-facing portals.

## Visual Theme & Atmosphere
Reassuring. Generous spacing communicates thoroughness. Rounded corners
without being playful. Photography (when used) shows real people in
uncluttered, daylit settings.

## Color Palette & Roles
- **Background:** `#F7FAFD` (clinical off-white with the slightest blue cast)
- **Surface (card):** `#FFFFFF`
- **Foreground:** `#0F2942` (deep clinical navy — easier than pure black)
- **Muted:** `#5C6B7E` (slate)
- **Border:** `#DEE5EC` (cool hairline)
- **Accent (primary):** `#1A6FBF` (clinical blue) — primary CTAs, links
- **Accent (success):** `#1F8E5C` (calm green) — confirmations
- **Accent (warning):** `#C77A0A` (calm amber) — never red unless it's an emergency

Red is reserved for genuine medical alerts; never used for marketing CTAs.

## Typography
- **Display:** "Inter", "Source Sans 3", "IBM Plex Sans" at 600–700
- **Body:** same family at 400, 17px (one notch larger than typical for accessibility), 1.6 line-height
- **No serif.** Sans-serif body keeps screen legibility consistent for older readers.
- Tracking: normal on body. Slightly tight on display (-1%).

## Component Stylings
- **Buttons:** filled accent for primary (12px radius), outlined for secondary, plain link for tertiary. Minimum tap area 48×48.
- **Cards:** white surface, 12px radius, 1px hairline border, 24–32px internal padding.
- **Inputs:** 8px radius, 1px hairline border, focus state uses accent blue 2px ring.
- **Form labels:** ALWAYS visible above the input (never inside as placeholder).

## Layout Principles
- Single-column body columns (max 64ch).
- Generous whitespace: 80–120px between major sections.
- Forms are vertically stacked, never side-by-side, to reduce error rate.
- Long-form content is broken with subheads every 3–4 paragraphs.

## Depth & Elevation
- Soft shadows on cards: `0 1px 3px rgba(15,41,66,0.06)`. Never deep / playful shadows.
- No glass / glow effects.

## Accessibility (non-negotiable)
- Body type is at least 16px (this system uses 17).
- Colour contrast meets WCAG AA (4.5:1 for body, 3:1 for large text).
- Form labels persist (never placeholder-only).
- Focus states are highly visible (2px ring + colour change).

## Do's and Don'ts
- **Do** keep red strictly for medical alerts.
- **Do** use accessible colour contrast everywhere.
- **Do** add explanatory text under each form field if regulated content.
- **Don't** use playful illustrations or marketing-style photography.
- **Don't** use heavy shadows, gradients, or glass.
- **Don't** centre body text.

## Responsive Behavior
Body content is single-column at all breakpoints. Forms remain stacked. Tap targets stay ≥ 48px.

## Agent Prompt Guide
1. Use the clinical off-white background with white cards.
2. Body type is 17px sans-serif, 1.6 line-height.
3. Primary CTA is filled clinical blue with 12px radius.
4. Form labels persist above inputs; never placeholder-only.
5. Reserve red for medical alerts only.
