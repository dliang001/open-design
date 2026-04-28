---
name: business-card
description: |
  Front-and-back business card at standard 90×54mm (China/EU) or 88.9×50.8mm
  (US). Output is a single HTML with two stacked .card-face blocks ready
  to PNG-export. Respects the active DESIGN.md tokens.
  Trigger keywords: "business card", "name card", "名片".
triggers:
  - "business card"
  - "name card"
  - "名片"
  - "name plate"
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
    - name: china-eu-front
      width: 1063
      height: 638
    - name: china-eu-back
      width: 1063
      height: 638
    - name: us-front
      width: 1050
      height: 600
    - name: us-back
      width: 1050
      height: 600
  inputs:
    - name: full_name
      type: string
      required: true
    - name: title
      type: string
      required: true
    - name: company
      type: string
      required: true
    - name: email
      type: string
      required: false
    - name: phone
      type: string
      required: false
    - name: website
      type: string
      required: false
    - name: standard
      type: enum
      values: [china-eu, us]
      default: china-eu
    - name: orientation
      type: enum
      values: [landscape, portrait]
      default: landscape
  outputs:
    primary: index.html
  capabilities_required:
    - file_write
---

# Business Card Skill

Produce a front-and-back business card. Both faces ship as separate
fixed-canvas blocks in one HTML so the exporter can rasterise each.

## 1. Read context

- Read `DESIGN.md`. Cards are tiny canvases — type discipline matters
  more than colour.
- Note the brand wordmark style (lockup vs. wordmark only). At
  business-card size, prefer wordmark.

## 2. Resolve the canvas

Standard sizes at 300 DPI (print quality):

| standard  | landscape (px)  | portrait (px)  |
| --------- | --------------- | -------------- |
| china-eu  | 1063 × 638      | 638 × 1063     |
| us        | 1050 × 600      | 600 × 1050     |

Each face is a separate fixed-size block. Stack them vertically with
a 40px gap so the live preview shows both at once.

## 3. Front face (typical)

Required:
- Full name — primary type, brand display font, ~36–48px.
- Title — secondary type, ~18–22px, often in muted colour.
- Company — wordmark or just text in brand voice.
- One contact detail (email or phone).

Layout patterns:
1. **Top-left aligned** — classic, name top-left, contact bottom.
2. **Centered** — name dead-centre, supporting metadata above and
   below.
3. **Vertical rule** — wordmark left, content right separated by
   accent vertical line.
4. **Bold accent block** — full accent block top half, white type;
   info bottom half in brand foreground.

## 4. Back face (typical)

Required: at minimum, the brand mark / wordmark, and any contact
details that didn't fit on the front.

Common patterns:
1. **Wordmark only** — single large brand mark dead-centre. Most
   restrained / luxury.
2. **All contacts** — every contact detail listed left-aligned.
3. **Tagline + URL** — single brand line + URL. Marketing-led.
4. **QR + URL** — QR code (placeholder square with `data-od-qr-url`
   attr) bottom-right, URL underneath.

## 5. Apply the design system

- Use AT MOST 2 colours from the palette plus background per face.
- Type sizing on a tight scale: 12 / 16 / 22 / 36 / 48. Do not
  introduce sizes outside this scale unless DESIGN.md mandates them.
- Paper feel: keep the background a solid brand colour or paper
  off-white. Texture is fine if DESIGN.md uses it; never gradients.
- Bleed: leave 8% of the shorter edge as outer margin. Never put
  text within 30px of any edge — printers crop.

## 6. Write the file

Single self-contained `index.html`. Structure:

```html
<body>
  <section class="card-face front" style="width:1063px;height:638px;">
    <!-- front content -->
  </section>
  <section class="card-face back" style="width:1063px;height:638px;">
    <!-- back content -->
  </section>
</body>
```

- `body { margin: 0; background: #eee; padding: 40px; }` so faces
  visually separate from the page chrome.
- `.card-face { margin: 0 auto 40px auto; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }`
  for preview-only depth (the exporter strips shadow on print).
- All CSS inlined in `<style>` in `<head>`.
- Tag editable text with `data-od-id="<slug>"`.

## 7. Self-check

- [ ] Both faces are exactly the resolved pixel size.
- [ ] No text within 30px of any edge.
- [ ] Type uses no more than 4 sizes total across both faces.
- [ ] At most 2 palette colours plus background per face.
- [ ] The brand wordmark / name appears at least once across the
      two faces.

## 8. Done

Write only `index.html`. The exporter can split the two faces into
separate PNGs.
