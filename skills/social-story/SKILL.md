---
name: social-story
description: |
  9:16 social story for Instagram Stories, 微信状态, TikTok, Reels covers.
  Output is a single 1080×1920 HTML canvas ready to PNG-export.
  Respects the active DESIGN.md tokens.
  Trigger keywords: "story", "ig story", "instagram story", "微信状态", "9:16", "vertical".
triggers:
  - "story"
  - "ig story"
  - "instagram story"
  - "微信状态"
  - "9:16"
  - "vertical post"
  - "reel cover"
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
    - name: story-1080x1920
      width: 1080
      height: 1920
  inputs:
    - name: topic
      type: string
      required: true
    - name: headline
      type: string
      required: true
    - name: subhead
      type: string
      required: false
    - name: cta
      type: string
      required: false
    - name: variant
      type: enum
      values: [single-screen, swipe-up, poll-card, behind-the-scenes]
      default: single-screen
  outputs:
    primary: index.html
  capabilities_required:
    - file_write
---

# Social Story (9:16) Skill

Produce a single 1080×1920 vertical canvas for Stories surfaces.
Mobile-first, full-bleed, thumb-stopping.

## 1. Read context

- Read `DESIGN.md`. Stories surfaces need maximum brand recognition
  in 0.5 seconds before the user taps to skip.
- Note the brand's loudest accent colour — Stories is the medium
  where you turn it up.

## 2. Canvas

`body` MUST be exactly 1080×1920. `overflow: hidden`.

## 3. Safe area (CRITICAL)

Stories surfaces overlay platform UI on the top and bottom:

- **Top**: 220px reserved for username, time, story bar.
- **Bottom**: 250px reserved for "Send message" / reaction tray.

That leaves a **safe content area of 1080×1450** centered vertically
(y from 220 to 1670). Headlines, CTAs, and key text MUST live inside
this zone. Decorative bleed can extend to the full 1080×1920.

## 4. Pick the variant

1. **single-screen** — one big idea, headline + CTA. The default.
2. **swipe-up** — headline up top, "Swipe up" arrow + CTA at the
   bottom of the safe area.
3. **poll-card** — headline centered, two large tappable rectangles
   below for the poll options (visual mock only — Stories app
   handles the real poll).
4. **behind-the-scenes** — handwritten / loose feel, 70% photo block
   placeholder, 30% caption.

## 5. Apply the design system

- Headline at 96–144px. Stories tolerates bigger type than feed.
- Subhead at 40–56px.
- CTA pill at minimum 80px tall with 32px+ horizontal padding.
- Background should be a single solid brand colour, gradient between
  two palette colours, or a full-bleed photo region.
- Vertical rhythm: align text blocks to a 60px baseline grid.

## 6. Write the file

Single self-contained `index.html`:
- `body { width: 1080px; height: 1920px; margin: 0; overflow: hidden; }`
- `<meta name="viewport" content="width=1080">`
- Ship with a faint 1px outline marking the safe area as a CSS
  `::before` overlay with class `od-safe-area`. The exporter strips
  this class before rasterising; the live preview keeps it so the
  designer can see it.
- No external JS. Tag editable text with `data-od-id="<slug>"`.

```css
/* example safe-area overlay */
.od-safe-area::before {
  content: "";
  position: absolute;
  inset: 220px 0 250px 0;
  outline: 1px dashed rgba(255,255,255,0.4);
  pointer-events: none;
}
```

## 7. Self-check

- [ ] Canvas is exactly 1080×1920.
- [ ] All readable text lies between y=220 and y=1670.
- [ ] CTA (if present) is in the bottom third, above the safe zone.
- [ ] One brand accent dominates; no more than 2 accents total.
- [ ] No platform UI mockups (camera icon, send arrow) — those
      come from the platform.

## 8. Done

Write only `index.html`.
