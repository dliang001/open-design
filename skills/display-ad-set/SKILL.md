---
name: display-ad-set
description: |
  Set of standard IAB display ad banners in 4 sizes: Medium Rectangle
  (300×250), Leaderboard (728×90), Billboard (970×250), Wide Skyscraper
  (160×600). Each banner is a standalone fixed-canvas block in one HTML
  so the exporter can rasterise all of them at once. Respects the active
  DESIGN.md tokens.
  Trigger keywords: "banner ad", "display ad", "google ads", "广告横幅".
triggers:
  - "banner ad"
  - "display ad"
  - "google ads"
  - "iab"
  - "广告横幅"
  - "广告 banner"
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
    - name: medium-rectangle
      width: 300
      height: 250
    - name: leaderboard
      width: 728
      height: 90
    - name: billboard
      width: 970
      height: 250
    - name: wide-skyscraper
      width: 160
      height: 600
  inputs:
    - name: campaign
      type: string
      required: true
    - name: headline
      type: string
      required: true
    - name: cta_label
      type: string
      required: true
    - name: subhead
      type: string
      required: false
    - name: include
      type: enum-multi
      values: [medium-rectangle, leaderboard, billboard, wide-skyscraper]
      default: [medium-rectangle, leaderboard, billboard, wide-skyscraper]
  outputs:
    primary: index.html
  capabilities_required:
    - file_write
---

# Display Ad Set Skill

Produce a coordinated set of IAB-standard banner ads. Each banner
must read in 1 second and contain ONE message + ONE CTA. The whole
set must look like one campaign, not four ads.

## 1. Read context

- Read `DESIGN.md`. Banners get cropped to thumbnail-size on most
  screens; only the loudest brand cues survive.
- Identify the single colour and the single typeface that the brand
  is most recognisable for. Use them everywhere.

## 2. Standard sizes (do not deviate)

| name              | width × height | usage                          |
| ----------------- | -------------- | ------------------------------ |
| medium-rectangle  | 300 × 250      | inline body, sidebar           |
| leaderboard       | 728 × 90       | top-of-page strip              |
| billboard         | 970 × 250      | premium top-of-page            |
| wide-skyscraper   | 160 × 600      | sidebar tower                  |

These are IAB standards — DO NOT round, scale, or invent new sizes.

## 3. Emit one banner per requested size

Loop through the `include` input. For each size, emit a separate
`<section class="banner">` block:

```html
<section class="banner" data-size="medium-rectangle"
         style="width:300px;height:250px;...">
  <div class="banner-headline">{{headline}}</div>
  <div class="banner-cta">{{cta_label}}</div>
</section>
```

## 4. Layout per size

Each size demands a different composition:

- **medium-rectangle (300×250)** — Headline (2 lines max) top, CTA
  pill bottom. Leave 16px outer padding.
- **leaderboard (728×90)** — Wordmark left, headline middle, CTA
  pill right. Single horizontal line.
- **billboard (970×250)** — Wordmark left in a 1/3 column,
  headline + subhead in the right 2/3. CTA inline below subhead.
- **wide-skyscraper (160×600)** — Stacked: wordmark top, headline
  middle (90° rotation OK if needed), CTA bottom. Headline must fit
  in 130px width.

## 5. Apply the design system

- ONE accent colour. ONE typeface family. Same headline copy across
  all 4 sizes — only the layout changes.
- Headline sizing scales with banner area: 14–16px for skyscraper,
  18–22px for medium-rectangle, 24–28px for leaderboard, 36–42px
  for billboard.
- CTA pill: 32px tall (small banners), 40px tall (large banners).
  Always full-saturation accent.
- No animation in this skill (animated GIF / HTML5 ad scripts are
  not in scope).

## 6. Write the file

Single self-contained `index.html`:
- `body { margin: 0; padding: 32px; background: #eee; display: flex;
  flex-direction: column; gap: 24px; align-items: flex-start; }` —
  preview chrome only; the exporter strips body styles.
- All CSS inlined in `<style>` in `<head>`.
- Each `.banner` has the exact pixel dimensions on the element style
  so the exporter can rasterise per-banner.
- Tag editable text with `data-od-id="banner-<size>-<role>"`.

## 7. Self-check

- [ ] Every requested size present, each at exact pixel dimensions.
- [ ] Headline text identical across sizes.
- [ ] CTA label identical across sizes.
- [ ] Wordmark appears in every banner.
- [ ] No size larger than 250KB per banner (text-only is fine).

## 8. Done

Write only `index.html`. The exporter can produce one PNG per
banner via `data-size` selectors.
