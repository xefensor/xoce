---
layout: ../../../layouts/DocLayout.astro
title: Visual identity
description: The website’s typography, glass materials, device previews and content hierarchy.
section: Design
order: 2
---

This guide describes the XOCE website: deep teal, warm white and charcoal, self-hosted Inter, and layered glass with modest corners. The [Pebble UI and UX standard](/docs/design/pebble-ui-system/) owns the watch and phone-settings design separately. The website does not set an Android app palette or final Phone identity.

<span id="name-and-website-mark"></span>

## Project name

**XOCE** means **Xef’s Open Computing Ecosystem**. Header and footer use the plain-text name. There is no logo or custom graphical favicon. The individual Pebble apps keep their icons.

Phone remains a working product name. A plan does not establish a finished app icon or visual identity. Asset and source terms are listed in [licensing and source](/docs/project/licensing/).

## Colours by role

Use semantic roles from `src/styles/theme.css`. Light pages use warm-white surfaces and teal actions; dark pages use charcoal and lighter teal. Supporting text stays readable against the surface beneath it.

| Role | CSS property | Use |
| --- | --- | --- |
| Background | `--bg` | The page behind its content |
| Opaque surface | `--paper` | Content and fallbacks that need an opaque base |
| Main text | `--ink` | Titles, values and reading text |
| Supporting text | `--muted` | Captions and secondary explanations |
| Dividers | `--line` | Grouping and boundaries |
| Filled action | `--accent` | Primary controls |
| Accent text | `--accent-text` | Links and selected emphasis |
| Text on an accent | `--accent-ink` | Labels inside filled controls |
| Focus | `--focus` | Visible keyboard focus |

Use `--accent-text` for coloured words, rather than assuming the fill colour is suitable for text. State and selection also need labels, shapes or icons.

The existing app accents use `--product-dynamic`, `--product-dashboard`, `--product-timer` and `--product-open-activity`. These are website roles; native screenshots retain their own colours. Exact values live in the stylesheet, so this guide does not maintain a second palette.

## Typography

**Inter** is used for headings, reading text, navigation and the plain-text name. It is self-hosted with a system sans-serif fallback and `font-display: swap`.

Use readable body text, a clear heading hierarchy and short contextual labels. Promotional headings can be larger than guide headings. Let text wrap with the available space; avoid giving every title the same forced line breaks.

Documentation uses one bounded reading column for headings and paragraphs. Wide code and tables may scroll within that column without making the whole page overflow. Navigation, contents and pagination support the article.

Font inputs are recorded in `src/styles/fonts.css`. The [Inter licence](/fonts/inter-LICENSE.txt) and retained [Space Grotesk licence](/fonts/space-grotesk-LICENSE.txt) remain available. Space Grotesk belongs to earlier website styling and is not the current heading face.

## Surfaces, spacing and controls

Glass groups content where it helps. Open page sections, a software showcase and a reading surface can have different compositions.

| Surface | CSS role | Purpose |
| --- | --- | --- |
| Navigation | `--glass-navigation-surface` | Header and navigation controls |
| Showcase | `--glass-feature-surface` | Device and software presentations |
| Regular content | `--glass-surface` | Browsing and supporting information |
| Reading | `--glass-reading-surface` | Stronger frost behind longer articles |

Corners use `--radius-pane` (10px), `--radius-control` (6px) and `--radius-small` (4px). Use spacing and fine dividers inside a surface. Keep controls flush, with clear focus and brief hover or pressed feedback.

The website’s panels have no plastic rims or recessed reading wells. The official Pebble device frame provides physical context for a watch preview; it is separate from the styling of website controls.

Home introduces the ecosystem goal, then presents current Pebble work and the intended cross-device experience. Current software and future goals need visibly distinct context. The current collection can use one watch with manually selected app previews; it does not automatically cycle.

Software opens the catalogue directly. Product pages explain a product and put compatibility beside the download. About owns the project’s scope and stages. Docs opens the actual Getting started article, with Guides, Developers and Design in its reading navigation. There is no extra documentation portal or Lab.

On smaller screens, documentation navigation and contents use native collapsible disclosures. The article remains near the start of the page, and guide navigation works without JavaScript. Routine visits leave keyboard focus alone; explicitly opening Search focuses its search field.

## Appearance and motion

System, Light and Dark are available. An explicit choice is saved in the browser; System follows the operating system.

The background artwork stays static. There is no idle animation, pointer-following effect or automatically advancing showcase. A person chooses which app preview to see. Motion stays brief and optional, and the website respects reduced motion.

Opaque fallbacks keep content readable when backdrop filtering is unavailable or reduced transparency is requested. Important information and actions remain visible in either theme.

## Screenshots and assets

Use actual project captures with useful alt text. Keep the native screenshot files unchanged and preserve their 200 × 228 screen ratio.

The Pebble Time 2 presentation on Home and product pages uses the [official Pebble Appstore frame](https://apps.repebble.com/images/screenshot_slider_background_emery_v2.png), credited to Core Devices. The transparent frame image is unchanged. Native captures fit inside it without stretching; matte black fills the unused part of the taller aperture. A caption identifies the composite as an emulator preview in a device frame. It does not imply a photograph of the running app or physical-watch verification.

Direct screen views remain useful for close reading in documentation and compact catalogue previews. No fake phone or desktop app interface is needed to illustrate planned work.

Dashboard’s image is a 0.4.1 emulator capture reused for the unchanged native layout in 0.4.3. Native image origins, source versions and hashes stay in `docs/asset-provenance.json`. Do not relabel an older capture when a release changes.

The offset-plane artwork is authored for XOCE and recorded in `docs/xoce-visual-identity.json`. The older silk artwork remains a historical asset and is not rendered. It is credited to Spatial Desktop and Alexej Tušl (xefensor) under [CC BY-SA 4.0](/licenses/spatial-desktop-artwork-CC-BY-SA-4.0.txt). Adapted material code retains its [GPL 3 terms](/licenses/spatial-desktop-materials-GPL-3.0.txt), recorded in `docs/spatial-material-reference.json`. Those terms do not replace each app’s own licence.

## Maintaining this reference

`src/styles/theme.css` owns colour and material roles. `src/styles/global.css` owns common layout and controls; `src/styles/guide.css` owns the reading layout. Page and component styles handle their specific compositions.

Keep this guide aligned with the implementation. For native app behaviour, use [UI patterns](/docs/design/ui-patterns/), [UX and interaction](/docs/design/interaction/) and the [Pebble standard](/docs/design/pebble-ui-system/). Versioned API contracts remain with the libraries that own them.
