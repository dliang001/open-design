---
name: poster-print
description: |
  Single printable poster (event, recruiting, product launch, exhibition).
  Output is a single-page HTML at print dimensions, ready to PNG/PDF and
  send to the printer. Respects the active DESIGN.md tokens.
  Trigger keywords: "poster", "flyer", "海报", "招贴", "招聘海报".
triggers:
  - "poster"
  - "flyer"
  - "海报"
  - "招贴"
  - "招聘海报"
od:
  mode: prototype
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: true
    sections: [color, typography, layout]
  dimensions:
    - name: A4-portrait
      width: 794
      height: 1123
    - name: A3-portrait
      width: 1123
      height: 1587
    - name: A2-portrait
      width: 1587
      height: 2245
  inputs:
    - name: occasion
      type: string
      required: true
    - name: headline
      type: string
      required: true
    - name: subhead
      type: string
      required: false
    - name: when_where
      type: string
      required: false
    - name: cta
      type: string
      required: false
    - name: paper_size
      type: enum
      values: [A4, A3, A2]
      default: A4
    - name: orientation
      type: enum
      values: [portrait, landscape]
      default: portrait
  outputs:
    primary: index.html
  capabilities_required:
    - file_write
---

# Poster (Print) Skill

Produce a single printable poster. Optimised for one strong message, one
visual focal point, and one CTA. The output is a fixed-canvas HTML so the
exporter can rasterise it to PNG or print it to PDF without reflow.

## 1. Read context

- Read `DESIGN.md` in the current working directory. If missing, stop and
  ask for one. The poster has to read like the brand without a logo lockup.
- Note the typography hierarchy: posters lean on **display weight** more
  than any other medium. Use the largest declared display size or scale
  it 1.5×–2× if the system tops out below 96px.
- Confirm the colour palette has at least one accent strong enough to
  carry a hero element at A2 size.

## 2. Resolve the canvas

Compute the canvas in pixels at 96 DPI (screen-equivalent for print):

| paper | portrait        | landscape       |
| ----- | --------------- | --------------- |
| A4    | 794 × 1123      | 1123 × 794      |
| A3    | 1123 × 1587     | 1587 × 1123     |
| A2    | 1587 × 2245     | 2245 × 1587     |

The root `<body>` MUST have explicit width/height in those exact pixel
values. Do not use `min-height: 100vh` — print canvases are fixed.

## 3. Compose the layout

Pick ONE of these proven layouts based on the occasion:

1. **Hero stack** — full-bleed display headline, subhead in middle band,
   metadata footer. Best for recruiting, simple announcements.
2. **Editorial split** — left half image/illustration block, right half
   text. Best for exhibitions, product launches.
3. **Centered focal** — circle/square hero shape dead-centre, text
   wrapping above and below. Best for events.
4. **Asymmetric grid** — large headline top-right, supporting blocks
   tiled below. Best for festivals, multi-act events.

Required elements (in this order of visual weight):
1. Headline (the `headline` input) — biggest type on the canvas.
2. Subhead (`subhead`) if present — 30–50% of headline size.
3. When / where (`when_where`) — small caps or tabular.
4. CTA (`cta`) — accent-coloured pill or rule.
5. Brand mark — wordmark only; no full logo lockup.

## 4. Apply the design system

- Headline uses the display font at the largest declared weight (or
  900 if the system doesn't go that heavy).
- Body uses the body font, never the display font (display at small
  sizes prints poorly).
- Use AT MOST 2 colours from the palette plus the page background. A
  third accent kills hierarchy at print size.
- White space is the silent collaborator. Reserve at least 8% of the
  shorter edge as outer margin on every side.
- Avoid drop shadows; print can't render them well. Use solid blocks
  and rules instead.

## 5. Write the file

Output a single self-contained `index.html`:

- All CSS inlined in `<style>` in `<head>`.
- `body { width: <W>px; height: <H>px; margin: 0; }` where W/H are the
  resolved canvas pixels from §2.
- `@page { size: <paper> <orientation>; margin: 0; }` so browser print
  hits the right paper.
- `@media print { html, body { background: white !important; } }` —
  posters print with bleed.
- No external JS. No external fonts unless DESIGN.md specifies a
  Google Font (then `<link>` it).
- Tag every editable text node with `data-od-id="<slug>"` for comment
  mode.

## 6. Self-check

Before finishing:
- [ ] Canvas is exactly the resolved pixel size — no `100vw` / `100vh`.
- [ ] Headline is legible from "across the room" (mentally simulate at
      A2 hung on a wall).
- [ ] CTA appears exactly once.
- [ ] No more than 2 palette colours used in addition to background.
- [ ] Print preview test: `Cmd/Ctrl+P` would produce a single page.

## 7. Done

Write only `index.html`. Do not generate auxiliary files.
