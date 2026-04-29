---
category: Style Library
description: Frosted-glass surfaces over colourful backgrounds. Backdrop-blur, translucent cards, subtle borders. For modern OS-style dashboards, premium SaaS heroes, and futuristic landing pages.
tags:
  - glassmorphism
  - frosted-glass
  - blur
  - gradient
  - modern
  - futuristic
era: modern
mood: confident
primary_color: "#5B7BFF"
---

# Glassmorphism

> Frosted glass over colourful backdrops. Originated in macOS Big Sur and
> iOS 14; widely adopted by premium SaaS hero sections. Use for
> "futuristic", "premium", "modern OS" briefs.

## Visual Theme & Atmosphere
Layered, light, airy. The hero is always a vivid gradient or photograph;
content sits in semi-transparent panels that blur whatever is behind them.

## Color Palette & Roles
- **Backdrop gradient:** linear-gradient(135deg, `#5B7BFF`, `#FF7AB6`) — the primary hero background
- **Surface (glass card):** `rgba(255, 255, 255, 0.18)` over the backdrop, with `backdrop-filter: blur(24px)`
- **Surface stroke:** `rgba(255, 255, 255, 0.35)` 1px
- **Foreground (on glass):** `#FFFFFF`
- **Foreground (on neutral page):** `#0E1530`
- **Accent:** `#5B7BFF` (electric blue) — for solid CTAs that should NOT be transparent

## Typography
- **Display:** "Inter", "SF Pro Display", "Pretendard" — modern geometric sans at 600–700 weight
- **Body:** same family at 400, 16px, 1.55 line-height
- White text on glass; dark text on light neutral backgrounds.

## Component Stylings
- **Glass cards:** `background: rgba(255,255,255,0.18); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.35); border-radius: 20px;`
- **Buttons (primary):** solid accent fill, white text, 16px radius — opaque so it doesn't dissolve into the glass.
- **Buttons (secondary):** glass card variant — same blur and border, no fill colour beyond the white tint.
- **Inputs:** glass card with internal padding 16px+, white placeholder text.

## Layout Principles
- Hero takes 70vh, full-bleed gradient or photo.
- Content sits centred in 1–3 stacked glass cards.
- Page below the hero is calm: white or near-white background with dark text — the glass effect lives in the hero.

## Depth & Elevation
- Glass cards cast a soft, slightly tinted shadow (`0 8px 32px rgba(0,0,0,0.12)`) onto whatever is behind them.
- Floating shapes (blurred circles) drift behind the glass — these create the colour variation that makes the blur visible.

## Do's and Don'ts
- **Do** ensure there's something colourful behind every glass surface — blur on white reads as nothing.
- **Do** use opaque buttons for primary actions.
- **Do** keep type weight at 600+ on glass surfaces (thinner weights blur out).
- **Don't** use glass on every surface. The hero gets glass; the rest of the page is calm.
- **Don't** stack more than 2 glass layers (it muddies).
- **Don't** use glass on dark mode without testing — contrast often fails.

## Responsive Behavior
Glass cards stack vertically on mobile. Backdrop gradient scales to fit. Blur radius reduces to 16px on mobile for performance.

## Agent Prompt Guide
1. Hero background is always a vivid gradient (135deg, two palette colours).
2. Place 1–3 glass cards centred in the hero with backdrop-blur 24px.
3. Use white text on glass; never dark text.
4. Primary CTA is opaque (solid colour), not glass.
5. Below the hero, switch to a calm white-background section.
