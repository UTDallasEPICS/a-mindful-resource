# Styling Guide

Every color, font and button style in this app comes from one file:
[app/assets/css/main.css](../app/assets/css/main.css). This page says which
color goes where. Visual mockup: https://snazzy-hummingbird-438610.netlify.app/

## Rules

1. Use only the tokens on this page: `bg-forest`, `text-ink`, `border-line`.
2. Do not write hex values (`#21483b`), arbitrary classes (`bg-[#21483b]`) or
   Tailwind default colors (`gray-500`, `green-700`, `white`, `black`).
3. Use Nuxt UI components (`UButton`, `UCard`, `UInput`) where you can. They
   already use the palette.
4. If you need a color that is not here, ask the team. Then add it to
   `main.css` and to this page in the same PR.

## Colors by job

### Page structure

| Element                                 | Background           | Text                                               |
| --------------------------------------- | -------------------- | -------------------------------------------------- |
| Navbar                                  | `bg-forest-deep`     | logo `text-paper`, links `text-mist`               |
| Navbar active link                      | —                    | `text-gold-light`                                  |
| Footer                                  | `bg-forest-deep`     | headings `text-paper`, links `text-mist-muted`     |
| Footer divider                          | `border-forest-line` | —                                                  |
| Page background                         | `bg-cream`           | `text-ink`                                         |
| Hero and feature bands (mission, about) | `bg-forest`          | headings `text-paper`, body `text-mist`            |
| Soft section (wellness check-in)        | `bg-sage-light`      | headings `text-forest-deep`, body `text-ink-muted` |
| Alternate section (resource search)     | `bg-cream-light`     | headings `text-forest-deep`, body `text-ink-muted` |

### Cards and inputs

| Element               | Classes                                                    |
| --------------------- | ---------------------------------------------------------- |
| Card on cream         | `bg-cream-light border border-line`                        |
| Card on cream-light   | `bg-cream border border-line`                              |
| Card heading          | `text-forest-deep font-serif`                              |
| Card body             | `text-ink-muted`                                           |
| Card number / eyebrow | `text-gold-deep` (on light), `text-gold-light` (on forest) |
| Text link on light    | `text-gold-deep` or `text-forest`                          |
| Text input            | `UInput` (cream-light background, `line` border)           |

### Buttons

| Button                               | Use                                                              |
| ------------------------------------ | ---------------------------------------------------------------- |
| Main call to action ("Find Support") | `<UButton color="secondary">` (gold, forest-deep text)           |
| Normal action on light background    | `<UButton color="primary">` (forest, paper text)                 |
| Outline button on forest background  | `<UButton variant="outline" class="text-paper ring-mist-muted">` |
| Quiet action (cancel, close)         | `<UButton color="neutral" variant="ghost">`                      |
| Danger (delete, log out)             | `<UButton color="error">`                                        |

Use only one gold button per screen section. Gold means "the main thing to do here".

### Text

| Text                          | On light (`cream`, `cream-light`, `sage-light`) | On dark (`forest`, `forest-deep`) |
| ----------------------------- | ----------------------------------------------- | --------------------------------- |
| Headings                      | `text-forest-deep`                              | `text-paper`                      |
| Body                          | `text-ink`                                      | `text-mist`                       |
| Secondary, descriptions       | `text-ink-muted`                                | `text-mist-muted`                 |
| Eyebrow label above a heading | `text-gold-deep`                                | `text-gold-light`                 |

Never put light text tokens (`paper`, `mist`) on light backgrounds, or dark
text tokens (`ink`, `forest-deep`) on dark backgrounds.

## Full palette

| Token         | Hex       | Job                                             |
| ------------- | --------- | ----------------------------------------------- |
| `forest`      | `#21483b` | Hero, feature bands, primary buttons            |
| `forest-deep` | `#193a30` | Navbar, footer, headings on light, forest hover |
| `forest-line` | `#36584c` | Dividers on forest backgrounds                  |
| `sage`        | `#8fa397` | Decorative accents, strong borders              |
| `sage-light`  | `#dce3de` | Soft section backgrounds, soft cards            |
| `gold`        | `#c89545` | Call-to-action buttons                          |
| `gold-hover`  | `#b98538` | Hover for gold buttons                          |
| `gold-light`  | `#dfb56e` | Eyebrows, active nav link on dark backgrounds   |
| `gold-deep`   | `#866229` | Eyebrows, numbers, links on light backgrounds   |
| `cream`       | `#f2ede3` | Page background                                 |
| `cream-light` | `#faf7f0` | Cards, inputs, alternate sections               |
| `ink`         | `#203a31` | Body text on light                              |
| `ink-muted`   | `#56695f` | Secondary text on light                         |
| `line`        | `#d8ddd8` | Borders on light                                |
| `paper`       | `#fcfaf5` | Headings and button text on dark                |
| `mist`        | `#d7e0da` | Body text and nav links on dark                 |
| `mist-muted`  | `#aebdb5` | Secondary text, footer links on dark            |

All text pairs on this page pass WCAG AA contrast (4.5:1).

## Fonts

- Headings (`h1`, `h2`, `h3`): Georgia serif. Applied automatically. Use
  `font-serif` for other heading-like text.
- Everything else: Arial sans-serif (`font-sans`, the default).

## Dark mode

There is no dark mode. The palette is light-only, so Nuxt UI color mode is
off in `nuxt.config.ts`. Do not add `dark:` classes.

## Differences from the mockup

The mockup used about 15 hex values outside its own palette. They are merged
into the tokens above:

- `#d7aa62` merged into `gold-light`.
- `#9a7135`, `#a47734`, `#8d682f` merged into `gold-deep`. Darkened to
  `#866229` because `#9a7135` on cream fails contrast (3.8:1).
- `#66756d` (old `--text-muted`) and `#56695f` merged into `ink-muted` as
  `#56695f`, because `#66756d` on cream fails contrast (4.2:1).
- `#d3dad5`, `#cbd3ce`, `#c5d0c8` merged into `line`.
- `#e8ece8` merged into `mist`.
- `#91a49a`, `#9baca3` merged into `mist-muted`.
- `--text-dark` renamed `ink`, `--white` renamed `paper`. Tailwind already uses
  `white`, and `text-text-dark` reads badly.
