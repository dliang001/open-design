---
name: infographic-data
description: |
  Long vertical infographic at 1080×1920 (or longer) that turns a small
  dataset / report into a shareable image. Each "row" is a self-contained
  data block (stat, chart, comparison, callout). Output is a single
  fixed-width HTML ready to PNG-export. Respects the active DESIGN.md
  tokens.
  Trigger keywords: "infographic", "report", "data viz", "信息图".
triggers:
  - "infographic"
  - "data viz"
  - "report graphic"
  - "信息图"
  - "数据图"
  - "annual report graphic"
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
    - name: tall-1080-wide
      width: 1080
      height: 4800
  inputs:
    - name: report_title
      type: string
      required: true
    - name: subtitle
      type: string
      required: false
    - name: dataset_summary
      type: string
      required: true
    - name: row_count
      type: integer
      default: 6
      min: 3
      max: 12
    - name: source_label
      type: string
      required: false
  outputs:
    primary: index.html
  capabilities_required:
    - file_write
---

# Infographic (Data) Skill

Produce a long vertical infographic. Width is fixed at 1080px so it
shares cleanly on phones; height grows with content. Each row is a
self-contained "screenful" of data so social previews work whether
the platform crops to 4:5 or shows the full image.

## 1. Read context

- Read `DESIGN.md`. Infographics rely on the data shapes — bars,
  donuts, labels — being unmistakably brand-coloured.
- Identify the brand's heaviest display weight; data labels need it.

## 2. Canvas

- Width: 1080px exactly.
- Height: grows with content, but every "row" is exactly 1350px so
  cropping to 4:5 reveals one full row at a time. With `row_count` =
  6, total height = 1350 × 6 + 600 (cover) + 480 (footer) = 9180.
  For `row_count` = 6, target ~6000–9000px total height.

## 3. Structure (rows)

```
<body>
  <section class="row cover">    1080 × 600 — title block
  <section class="row data" data-row="1">  1080 × 1350
  <section class="row data" data-row="2">  1080 × 1350
  ...
  <section class="row footer">   1080 × 480 — source + brand
</body>
```

Each `.row.data` MUST be exactly 1080 × 1350. Use `overflow: hidden`
to enforce the boundary.

## 4. Row archetypes (vary across the infographic)

Pick a different archetype for each consecutive row to keep the
scroll interesting. Reuse only after exhausting the list:

1. **Big stat** — One huge number (240px+), one supporting label.
2. **Comparison** — Two side-by-side stats (50/50 split).
3. **Bar chart** — 3–6 horizontal bars with labels and values.
4. **Donut** — Single donut chart (SVG) with center label.
5. **Timeline** — Horizontal line with 3–5 milestones.
6. **Quote callout** — Pull quote with attribution. Display font.
7. **Icon grid** — 2×2 or 3×2 of icon + short label tiles.
8. **List of facts** — 3 short bullets, each with a leading number
   in display font.

## 5. Apply the design system

- Charts use brand accent for the primary series, brand muted for
  secondary, brand background as the chart canvas.
- Every row's background alternates between `background` and
  `background-secondary` (or accent at 5% tint if there's no
  secondary background).
- Headlines per row at 64–96px.
- Body labels at 24–32px, never below 24px (this is for sharing
  as an image; small text disappears).
- Source citation at 18px, muted colour.

## 6. Charts (SVG)

All charts inline as `<svg>` elements. No external chart library.
- Bars: `<rect>` with brand accent fill.
- Donuts: `<circle>` with stroke-dasharray for the segment.
- Lines: `<polyline>` with brand accent stroke.
- Add `data-od-chart="<type>"` so future re-renders can re-style.

Numbers are just numbers — agent should pick plausible values that
match the `dataset_summary` input. Do not invent statistics that
sound like real-world facts; stay generic ("Q3 conversion: 8.2%"
not "WHO reports 47% increase in...").

## 7. Required cover

The first `.row.cover` (1080×600) contains:
- `report_title` as the headline (the largest type on the canvas).
- `subtitle` if present.
- A single accent-coloured rule under the title.
- The `dataset_summary` as a 1–2 sentence intro.

## 8. Required footer

The last `.row.footer` (1080×480) contains:
- "Source: " + `source_label` if present, else "Internal data, [year]".
- Brand wordmark.
- Date.
- Optional URL / social handle.

## 9. Write the file

Single self-contained `index.html`:
- `body { width: 1080px; margin: 0; }` — height auto from row sum.
- `<meta name="viewport" content="width=1080">`.
- All CSS inlined.
- All SVG inlined; no external images unless absolutely necessary.
- Tag every row with `data-od-id="row-<n>-<archetype>"`.

## 10. Self-check

- [ ] Width is exactly 1080px throughout.
- [ ] Every `.row.data` is exactly 1350px tall.
- [ ] No two consecutive rows share the same archetype.
- [ ] Cover and footer present.
- [ ] Body label text is ≥ 24px everywhere.
- [ ] Charts use brand accent + muted only — no extra colours.
- [ ] No external image dependencies.

## 11. Done

Write only `index.html`. The exporter can rasterise per-row PNGs
via the `data-row` attributes for carousel posts.
