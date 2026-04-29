---
category: Style Library
description: Swiss / International Typographic Style. Strict grid, Akzidenz / Helvetica, primary colours used sparingly, generous negative space, left-aligned. The grandfather of "modern".
tags:
  - swiss
  - bauhaus
  - international-style
  - minimal
  - editorial
  - grid
era: timeless
mood: minimal
primary_color: "#E2231A"
---

# Swiss Modern

> The Müller-Brockmann / Josef Albers / Massimo Vignelli playbook. Built
> on a strict grid, set in Helvetica or Akzidenz-Grotesk, organised by
> hierarchy and not by decoration. Use for cultural institutions,
> publishing, civic / transit, and any brief that says "timeless".

## Visual Theme & Atmosphere
Calm, exacting, intellectually serious. Information takes precedence over
expression. Negative space is a structural element, not a leftover.

## Color Palette & Roles
- **Background:** `#FFFFFF`
- **Foreground:** `#1A1A1A`
- **Accent (primary):** `#E2231A` (Swiss red — used for one editorial element per screen)
- **Accent (secondary):** `#1B1B7A` (deep blue) — used for callouts only when red is already taken
- **Rule:** `#1A1A1A` 1px

There is no "supporting palette". Red, black, white. That's the system.

## Typography
- **Display:** "Akzidenz-Grotesk", "Helvetica Now", "Helvetica Neue" — never Arial.
- **Body:** the same family at lighter weight, 16–18px, 1.5 line-height.
- **No mixed families.** One family, three weights (regular / medium / bold).
- Tracking is normal (0). Headlines NEVER track loose.
- Hyphenate body. Justify only when the column is wide enough (≥12 words).

## Component Stylings
- **Buttons:** plain text-and-rule (underline) or a 1px-bordered rectangle with no fill. No filled buttons.
- **Cards:** undecorated rectangles; cards are defined by alignment and whitespace, not by borders.
- **Inputs:** 1px bottom rule only, no box.
- **Tables:** rules between rows; alternating fills are forbidden.

## Layout Principles
- Strict 12-column grid with 24px gutters; type and figures align to the grid without exception.
- Asymmetric balance: weight on the left, whitespace on the right (or vice versa).
- Hierarchy by SIZE and SPACE, not by colour.
- Section spacing is generous: 96–160px between major blocks.

## Depth & Elevation
None. No shadows. No card elevation. The page is a flat plane.

## Do's and Don'ts
- **Do** lead with the grid — every element snaps.
- **Do** use red sparingly: one accent per screen, max.
- **Do** use `figure` / `figcaption` with rule between figure and caption.
- **Don't** use shadows, gradients, or rounded corners.
- **Don't** centre body copy.
- **Don't** mix typefaces. Helvetica only.

## Responsive Behavior
Grid collapses 12 → 8 → 4 columns. Hierarchy preserved by size and space, never by re-introducing colour or decoration.

## Agent Prompt Guide
1. Set everything in Helvetica (or system sans fallback).
2. Use a 12-column grid with 24px gutters; align every block.
3. Use Swiss red exactly once per screen.
4. Define cards by alignment + whitespace, never by borders or fills.
5. Section spacing is at least 96px on desktop.
