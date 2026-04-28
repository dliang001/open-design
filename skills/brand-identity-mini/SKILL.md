---
name: brand-identity-mini
description: |
  Single-page brand mini guide showing logo / wordmark, colour palette,
  typography stack, voice principles, and Do/Don't usage examples. Output
  is a long-scrolling HTML at standard desktop width. Best used after
  generating a DESIGN.md to visualise it for stakeholders. Respects the
  active DESIGN.md tokens.
  Trigger keywords: "brand guide", "mini brand", "brand identity",
  "style guide", "品牌手册".
triggers:
  - "brand guide"
  - "mini brand"
  - "brand identity"
  - "style guide"
  - "brand book"
  - "品牌手册"
  - "品牌指南"
od:
  mode: prototype
  platform: desktop
  scenario: design
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: true
    sections: [color, typography, layout, components]
  dimensions:
    - name: desktop
      width: 1280
      height: 4200
  inputs:
    - name: brand_name
      type: string
      required: true
    - name: brand_promise
      type: string
      required: true
    - name: voice_words
      type: string-array
      required: false
      default: [confident, warm, precise]
    - name: include_dos_donts
      type: boolean
      default: true
  outputs:
    primary: index.html
  capabilities_required:
    - file_write
---

# Brand Identity (Mini) Skill

Produce a single-page brand mini guide that explains the active design
system to a non-designer in under 2 minutes of reading. This is NOT a
full brand book — it's the laminated 1-pager you'd hand a contractor.

## 1. Read context

- Read `DESIGN.md`. This skill literally renders the design system
  for human consumption.
- Note every declared colour role, every typeface and weight, the
  spacing scale, and any "Do / Don't" guidance.

## 2. Required sections (in order)

1. **Cover** — Brand wordmark, brand name, brand promise (one
   sentence), tagline if any. Set against the brand's signature
   background colour.
2. **Logo / Wordmark** — Wordmark in 3 sizes (small / medium / large)
   on light + dark backgrounds. Add `data-od-id` so each rendition
   is exportable separately.
3. **Colour palette** — Every named colour from DESIGN.md as a
   swatch card: large colour block + name + hex + role description
   ("primary CTA, links, hero accents — use sparingly"). Group by
   role (background / foreground / accent / supporting).
4. **Typography** — Display font specimen at 96 / 64 / 48 / 32px
   showing the alphabet + 0–9 + sample headline. Body font specimen
   at 24 / 18 / 16 / 14px showing a paragraph. If the system has
   distinct mono / serif, include them.
5. **Spacing & rhythm** — Visual ruler showing the spacing scale (4
   / 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128) with a labelled colour
   bar for each step.
6. **Voice principles** — `voice_words` rendered as chips with one
   sentence each ("Confident: short declarative sentences. No
   weasel words.").
7. **Do / Don't** (optional, controlled by `include_dos_donts`) —
   2-column grid: 4 visual examples on the Do side, 4 on the Don't
   side. Use real-looking mocks, not lorem ipsum.
8. **Footer** — Last updated date, version, link to full DESIGN.md
   ("see DESIGN.md for full token reference").

## 3. Layout

- Width: 1280px (standard desktop). Vertical scroll, no horizontal
  scroll. No fixed canvas — this section grows.
- Every section: 96px top + bottom padding, 96px outer left/right
  margin. Section titles in display font at 48px.
- Use the design system's actual layout grid. No grid means a
  4-column 64px-gutter grid.
- Section dividers: a single thin rule in the muted colour OR a
  100% bleed colour band — pick the one that matches the design
  system's restraint level.

## 4. Apply the design system

- This is the showcase. Every visual decision must reflect the
  design system. If the system feels wrong here, the system is wrong.
- Do NOT add tokens that aren't in DESIGN.md. If a section needs
  a colour the palette doesn't have, leave it as a comment block
  asking for one.
- The cover is the only place you may use the brand's signature
  background colour at 100% bleed. Other sections use the standard
  page background.

## 5. Write the file

Single self-contained `index.html`:
- `<body>` is the long scroll container, no fixed dimensions.
- All CSS inlined in `<style>` in `<head>`.
- Sections as `<section data-od-id="<slug>">` so each is
  individually exportable.
- Tag every editable text with `data-od-id`.
- No external JS.

## 6. Self-check

- [ ] All 7 (or 8 with Do/Don'ts) sections present.
- [ ] Every colour from DESIGN.md is shown with hex + role.
- [ ] Every font from DESIGN.md is shown at multiple sizes.
- [ ] Voice principles match `voice_words` input.
- [ ] No tokens (colour or font) appear that aren't in DESIGN.md.
- [ ] Cover, footer, and at least one body section have a
      `data-od-id` so the exporter can render section thumbnails.

## 7. Done

Write only `index.html`. Do not generate a separate logo SVG file —
the brand mark belongs inline in the HTML so the whole guide ships
as one document.
