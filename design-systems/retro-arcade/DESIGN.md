---
category: Style Library
description: 1980s arcade and 8-bit aesthetic. Pixel fonts, CRT scan effects, saturated primary colours, chunky shadows, hard pixel edges. For gaming, indie devs, retro brand drops.
tags:
  - arcade
  - 8-bit
  - pixel
  - retro
  - gaming
  - bold
era: retro
mood: playful
primary_color: "#FF2D55"
---

# Retro Arcade

> The aesthetic of a 1985 cabinet: pixel fonts, CRT scanlines, saturated
> primaries, chunky offset shadows. Use for indie game dev sites, retro
> brand drops, music releases, hackathons. Skip for anything serious.

## Visual Theme & Atmosphere
High-energy, joyful, deliberately dated. Every interaction feels like a
button press on a control deck.

## Color Palette & Roles
- **Background:** `#1A0F2E` (CRT deep purple-black)
- **Surface 2:** `#0E0822` (cabinet body)
- **Foreground:** `#F2F2E8` (CRT off-white)
- **Primary accent:** `#FF2D55` (arcade red)
- **Secondary accent:** `#00D9FF` (CRT cyan)
- **Tertiary accent:** `#FFD600` (coin yellow)
- **Quaternary:** `#22F08E` (1-up green)

Multiple accents are intentional — primary, secondary, and tertiary often appear together (it's a 4-colour CGA palette feel).

## Typography
- **Display:** "Press Start 2P", "VT323", "Silkscreen" — pixel fonts at 32–96px
- **Body:** "VT323" at 20–24px (NEVER below 18px — pixel fonts shrink poorly), or "Space Mono" / "JetBrains Mono" if pixel fonts are too rough
- ALL CAPS is encouraged.

## Component Stylings
- **Buttons:** chunky pixel border (4px solid), offset hard-shadow `4px 4px 0 currentColor`, 0 radius. Hover: shift the button down/right by 4px (button "presses").
- **Cards:** 4px solid border, offset shadow, 0 radius.
- **Dividers:** dotted or dashed, in any of the 4 accents.
- **Imagery:** pixelate filter (`image-rendering: pixelated`) so photos pixel-style.

## Layout Principles
- Hero often shows a "PRESS START" CTA centred, like a game opening screen.
- Layouts are gridded but blocky — chunky elements with hard edges.
- Add a subtle CRT scanline overlay (CSS `repeating-linear-gradient`) over the entire viewport for atmosphere.

## Depth & Elevation
- Hard offset shadows ONLY (`Xpx Ypx 0 colour`). No soft shadows.
- Z-stack feels tactile, like physical stickers / buttons.

## Do's and Don'ts
- **Do** use pixel fonts for headlines.
- **Do** add hard offset shadows.
- **Do** combine 3+ accent colours per screen.
- **Don't** use rounded corners.
- **Don't** use modern soft shadows.
- **Don't** use light-mode backgrounds — system is dark by default.

## Responsive Behavior
Pixel fonts hold; offset shadows shrink to 2px on mobile to fit. Scanline overlay is preserved.

## Agent Prompt Guide
1. Use the deep CRT purple-black background.
2. Headlines in pixel fonts at 32px+; body in monospace at 20px+.
3. Buttons have 4px solid borders and hard offset shadows.
4. Combine red + cyan + yellow in the hero composition.
5. Add a subtle scanline CSS overlay.
