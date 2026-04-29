---
name: social-post-square
description: |
  Single square or 4:5 social post for Instagram, 小红书, LinkedIn,
  Threads. Output is a fixed-canvas HTML at 1080×1080 or 1080×1350
  ready to PNG-export. Respects the active DESIGN.md tokens.
  Trigger keywords: "social post", "instagram", "小红书", "post", "feed".
triggers:
  - "social post"
  - "instagram"
  - "instagram post"
  - "小红书"
  - "feed post"
  - "linkedin post"
od:
  mode: prototype
  platform: mobile
  scenario: marketing
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: true
    sections: [color, typography, layout]
  dimensions:
    - name: square-1080
      width: 1080
      height: 1080
    - name: portrait-1080x1350
      width: 1080
      height: 1350
  inputs:
    - name: topic
      type: string
      required: true
    - name: headline
      type: string
      required: true
    - name: kicker
      type: string
      required: false
    - name: cta
      type: string
      required: false
    - name: aspect
      type: enum
      values: [square, portrait]
      default: square
    - name: variant
      type: enum
      values: [type-led, photo-block, quote-card, stat-block]
      default: type-led
  outputs:
    primary: index.html
  capabilities_required:
    - file_write
---

# Social Post (Square / 4:5) Skill

Produce a single high-impact social post at 1080×1080 or 1080×1350.
This is one slide of a feed — it must read in 1.5 seconds.

## 1. Read context

- Read `DESIGN.md`. The post has to feel native to the brand's feed.
- Note the brand's preferred type-to-image ratio if declared. If not,
  default to 70% type, 30% supporting visual / colour block.

## 2. Resolve the canvas

| aspect   | width × height |
| -------- | -------------- |
| square   | 1080 × 1080    |
| portrait | 1080 × 1350    |

Root `<body>` MUST have those exact pixel dimensions. Use
`overflow: hidden` so nothing escapes the safe area.

## 3. Pick the variant

`variant` controls the layout archetype:

1. **type-led** — display headline dominates, small kicker above,
   small CTA below. Best for announcements, hot takes.
2. **photo-block** — top 60% reserved for an illustration / colour
   block, bottom 40% holds title and CTA over solid background.
3. **quote-card** — centered pull quote with attribution. Use serif
   if the design system has one.
4. **stat-block** — single huge number top, supporting label below,
   1-line context line at bottom. Best for product metrics, growth.

## 4. Safe area

Instagram crops the **outer 60px** of every side in some surfaces
(Reels overlays, profile grid hover). Reserve a 60px inner padding
from every edge for any text you must keep readable. Decorative
shapes can bleed.

## 5. Apply the design system

- Headline at minimum 96px (square) or 112px (portrait). Smaller
  reads as "ad" rather than "post".
- Kicker uses the body font at 32–40px, often in accent colour or
  small caps.
- Background is the brand's canvas colour or a single brand accent
  (full-bleed). Never a stock-photo gradient unless DESIGN.md
  explicitly says so.
- Use ONE colour beyond the background. Two accents on a single post
  reads cluttered.
- Do NOT include hashtags or @ handles in the canvas — those go in
  the post copy, not the image.

## 6. Write the file

Output a single self-contained `index.html`:

- All CSS inlined in `<style>` in `<head>`.
- `body { width: 1080px; height: <h>px; margin: 0; overflow: hidden; }`
- No external JS. No external fonts unless declared.
- Tag editable text with `data-od-id="<slug>"`.
- `<meta name="viewport" content="width=1080">` so the live preview
  doesn't shrink the canvas.

## 7. Self-check

- [ ] Canvas is exactly 1080×1080 or 1080×1350 pixels.
- [ ] Headline is readable at thumbnail size (mentally shrink to
      300px wide).
- [ ] No text within 60px of any edge.
- [ ] No hashtags or @ handles inside the canvas.
- [ ] Maximum 2 colours from the palette in addition to background.

## 8. Done

Write only `index.html`. The exporter handles PNG conversion at
1×, 2×, and 3× DPR for crisp uploads.
