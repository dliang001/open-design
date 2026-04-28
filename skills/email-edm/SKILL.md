---
name: email-edm
description: |
  Responsive HTML email (EDM) for marketing campaigns, transactional
  templates, or product announcements. Output is a 600px-wide table-based
  HTML compatible with Gmail, Outlook, Apple Mail, and 微信. Respects the
  active DESIGN.md tokens.
  Trigger keywords: "email", "edm", "newsletter", "campaign email", "邮件".
triggers:
  - "email"
  - "edm"
  - "newsletter"
  - "campaign email"
  - "marketing email"
  - "邮件"
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
    - name: edm-600
      width: 600
      height: 1200
  inputs:
    - name: campaign
      type: string
      required: true
    - name: preheader
      type: string
      required: true
    - name: subject_hint
      type: string
      required: false
    - name: cta_label
      type: string
      required: true
    - name: cta_url
      type: string
      required: true
    - name: variant
      type: enum
      values: [announce, digest, transactional, recovery]
      default: announce
  outputs:
    primary: index.html
  capabilities_required:
    - file_write
---

# Email (EDM) Skill

Produce a single-file responsive marketing email that renders in
Gmail, Outlook, Apple Mail, and 微信. Email HTML is intentionally old —
this is not a place to use modern CSS layout.

## 1. Read context

- Read `DESIGN.md`. Email respects brand palette and typography but
  loses about 40% of expressive range (no flexbox, limited fonts,
  no shadows in Outlook).
- Note the brand's web-safe font fallback or fall back to Helvetica /
  Arial / Georgia.

## 2. Constraints (READ THIS BEFORE WRITING)

- Width: 600px max. Anything wider gets clipped in Outlook.
- **Tables only** for layout. No flexbox, no grid. Use `<table>`,
  `<tr>`, `<td>` with `cellpadding` and `cellspacing`.
- Inline styles only. `<style>` blocks are dropped by some clients.
- No background images (Outlook ignores them); use solid `bgcolor`.
- Fonts: stick to Helvetica, Arial, Georgia, Times, system-ui.
- Buttons: render as `<a>` with table wrapper for bulletproof tap
  area. Do not use `<button>`.
- Links: include `target="_blank"` and full absolute URLs.
- Images: width/height attributes mandatory; alt text mandatory.

## 3. Pick the variant

1. **announce** — single hero + headline + body + ONE CTA. Default.
2. **digest** — 3–5 stacked content blocks (header + thumb + blurb +
   inline link), one footer CTA. Best for weekly newsletters.
3. **transactional** — receipt / confirmation. Heavy on tables, no
   marketing language. Logo top, summary table center, support
   footer at the bottom.
4. **recovery** — abandoned cart / re-engagement. Hero hook line +
   single CTA + secondary "no thanks" link.

## 4. Required structure

Every variant ships with these sections (in order):

```
<!-- preheader (hidden but shown in inbox preview) -->
<div style="display:none">{{preheader}}</div>

<!-- 600px outer container -->
<table align="center" cellpadding="0" cellspacing="0" border="0"
       width="600" style="...">
  <!-- header (logo) -->
  <!-- hero / opening -->
  <!-- body sections (variant-dependent) -->
  <!-- CTA button -->
  <!-- footer (unsubscribe, address, copyright) -->
</table>
```

## 5. Apply the design system

- Background: page `bgcolor` from DESIGN.md (often `#f5f5f5` to make
  the email card "pop"). Card body uses brand background.
- Headlines: 28–34px, 1.25 line-height, brand display fallback.
- Body: 16px, 1.5 line-height. Never below 14px (small in iOS Mail).
- Accent: button background colour. ONE button.
- Colour contrast: WCAG AA minimum (4.5:1 for body text).

## 6. Required footer

Every email MUST include in the footer:
- Sender name + physical address (legal requirement in EU/US).
- Unsubscribe link (CAN-SPAM / GDPR).
- Reason this user is receiving the email (one line).

Use placeholder text like `{{unsubscribe_url}}` and `{{address}}` —
the agent does not invent legal content.

## 7. Write the file

Output a single `index.html`:
- Doctype: `<!doctype html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">`
- All styles inline. Use `style="..."` on every element.
- `<head>` contains only `<title>`, `<meta charset>`, `<meta http-equiv="X-UA-Compatible" content="IE=edge">`,
  `<meta name="viewport" content="width=device-width">`.
- The body's outermost element is the 600px table — no wrappers
  with `<div>` flex columns.

## 8. Self-check

- [ ] Total width ≤ 600px. Test by mentally rendering at 320px viewport.
- [ ] Single CTA per variant (announce/recovery) or single footer
      CTA (digest).
- [ ] Footer contains unsubscribe + address placeholders.
- [ ] All images have width, height, alt.
- [ ] All links have full URLs and target="_blank".
- [ ] No flexbox, grid, or `<style>` block in `<head>`.

## 9. Done

Write only `index.html`. Do not generate a separate text-only
fallback — most modern clients auto-generate one.
