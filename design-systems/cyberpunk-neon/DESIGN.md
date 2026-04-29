---
category: Style Library
description: Neon-on-black cyberpunk aesthetic. Magenta and cyan glows, monospace typography, scanline overlays, hard geometric grids. For gaming, web3, hacker culture, music drops.
tags:
  - cyberpunk
  - neon
  - dark
  - gaming
  - web3
  - mono
  - futuristic
era: modern
mood: energetic
primary_color: "#FF2A78"
---

# Cyberpunk Neon

> Blade Runner / GitS / Neuromancer aesthetic. Pitch-black backgrounds,
> neon magenta and cyan as glow sources, monospace type doing all the
> work. Use for gaming, web3, hacker / dev culture, indie music, anime
> partnerships.

## Visual Theme & Atmosphere
Loud, kinetic, slightly hostile. Every accent looks like it could
electrocute you. Type leans monospace because it reads as "terminal".

## Color Palette & Roles
- **Background:** `#070417` (deep blue-black)
- **Surface 2:** `#0F0A24` (lifted panel)
- **Foreground:** `#E6E0FF` (cool off-white) — body text
- **Neon magenta:** `#FF2A78` — primary accent, glow source
- **Neon cyan:** `#22F0E0` — secondary accent, terminal-style highlights
- **Neon yellow (warning):** `#F0F22A` — used very sparingly for alerts
- **Grid line:** `rgba(255, 42, 120, 0.18)` — for background grid overlays

## Typography
- **Display:** "Orbitron", "Space Grotesk", or any geometric futurist sans at 700+
- **Body:** "JetBrains Mono", "Space Mono", "IBM Plex Mono" — yes, body is monospace
- **Tracking:** wide on display headlines (+5 to +10%) for "computer terminal" feel
- ALL CAPS is encouraged for section labels

## Component Stylings
- **Buttons:** transparent fill, 1px neon-magenta stroke with `box-shadow: 0 0 16px rgba(255,42,120,0.6)` outer glow. Hover: stroke becomes solid fill.
- **Cards:** dark surface with 1px neon stroke (magenta or cyan, choose one per card), inner glow `box-shadow: inset 0 0 24px rgba(34,240,224,0.18)`.
- **Inputs:** dark fill, 1px cyan stroke, monospace text, blinking cursor.
- **Dividers:** 1px neon line with subtle outer glow.

## Layout Principles
- Background carries a faint perspective grid (CSS gradient or SVG) — gives the page depth.
- Layouts are gridded but rotated 0–2° on small accents to feel "in motion".
- Hero often has a glitching / scanline overlay (CSS `repeating-linear-gradient` for scanlines).

## Depth & Elevation
- Outer glows are the only shadow.
- Layered glass + glow: a small inner panel with cyan glow on top of a magenta-glowing card creates depth.

## Do's and Don'ts
- **Do** use ONE primary glow colour per section (don't mix magenta and cyan glows in the same card).
- **Do** add a subtle scanline or grid overlay to the hero.
- **Do** use ALL CAPS for short labels.
- **Don't** add light-mode variants. The system is dark by definition.
- **Don't** use sans-serif body — break the terminal feel.
- **Don't** over-glow body content; glows are for accents only.

## Responsive Behavior
Grid backgrounds scale; glows reduce intensity by 30% on mobile to save battery. Type stays monospace.

## Agent Prompt Guide
1. Use deep blue-black background, never grey.
2. All body type is monospace.
3. Apply outer glow (magenta or cyan) to interactive elements only.
4. Add a perspective-grid SVG or CSS gradient to the hero background.
5. Use ALL CAPS for labels and CTAs.
