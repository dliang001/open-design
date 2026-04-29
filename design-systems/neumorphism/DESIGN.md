---
category: Style Library
description: Soft 3D extrusion via twin shadows. Monochrome surfaces with elements that look "pushed in" or "popped out". For tactile dashboards, fitness apps, controllers. Use sparingly — bad for accessibility.
tags:
  - neumorphism
  - soft-ui
  - tactile
  - monochrome
  - 3d
  - skeuomorphic
era: modern
mood: playful
primary_color: "#A6B0C0"
---

# Neumorphism (Soft UI)

> Surfaces that look extruded from the page. Twin soft shadows (one
> light, one dark) create the illusion of depth on a single colour.
> Useful for tactile dashboards and fitness UIs; disastrous for
> accessibility if used carelessly. NOT for body content.

## Visual Theme & Atmosphere
Soft, tactile, almost sculptural. Every interactive element looks like
it could be pressed with a thumb. Best for control panels, sliders,
toggle-heavy interfaces.

## Color Palette & Roles
- **Background:** `#E0E5EC` (cool grey base) — this is THE system colour. Everything is on top of this.
- **Foreground:** `#3E4B61` (deep slate)
- **Muted:** `#7A8699`
- **Accent:** `#5B7BFF` (used only for icons or single highlights, never large surfaces)

The whole system is monochromatic. Backgrounds, cards, buttons all share the same grey-blue base — the depth is faked by shadow geometry, not by colour.

## Typography
- **Display:** "Inter", "SF Pro" at 600
- **Body:** same family at 400, 16px, 1.5 line-height
- Type colour stays in the deep slate range; never a pure black.

## Component Stylings
- **Raised elements (cards, buttons):**
  ```
  background: #E0E5EC;
  box-shadow: -8px -8px 16px #FFFFFF, 8px 8px 16px #B8BEC9;
  border-radius: 16px;
  ```
- **Pressed elements (active state):** shadows reverse (`inset` shadows).
- **Inputs:** "pressed-in" inset shadows.
- **Icons:** monochrome line icons in the foreground colour.

## Layout Principles
- Minimal layout chrome — the depth IS the chrome.
- Generous internal padding so shadows have room to breathe.
- Cards never butt up against each other; gap 24–32px.

## Depth & Elevation
The depth IS the system. Two-shadow recipe:
- Light shadow: top-left, white at 60%, 16–24px blur.
- Dark shadow: bottom-right, neutral grey-blue at 80%, 16–24px blur.
- The two together create the extrusion illusion.
- "Pressed" state inverts shadows (use `inset`).

## Accessibility (CRITICAL)
- This style has weak colour contrast by nature. NEVER use neumorphic surfaces for body text.
- Reserve neumorphism for control elements (buttons, toggles, sliders, knobs).
- Body content sits on plain `#FFFFFF` cards over the grey base, NOT on neumorphic surfaces.

## Do's and Don'ts
- **Do** use neumorphism for controls and dashboards.
- **Do** keep the entire surface on the same base colour.
- **Don't** put body text on neumorphic surfaces.
- **Don't** mix neumorphism with strong brand colours; the effect needs grey to read.
- **Don't** apply to landing pages — accessibility will fail.

## Responsive Behavior
Shadows scale down on mobile (10–14px blur) to keep performance acceptable.

## Agent Prompt Guide
1. Use the cool grey `#E0E5EC` everywhere — page, cards, buttons all share it.
2. Apply twin shadows (white top-left, slate bottom-right) for raised elements.
3. Reserve neumorphism for control surfaces, not body text.
4. Body text and dense info live on plain white cards, not neumorphic ones.
5. The colour palette is monochromatic; accent colours are tiny and rare.
