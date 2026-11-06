---
layout: ../../../layouts/DocLayout.astro
title: Visual identity
description: The current website’s wordmark, colour roles, typography and assets, with their actual scope.
section: Design
order: 2
---

This page documents the visual styling of the current XOCE website. It provides a reference for maintaining these pages. The Pebble apps retain their own native fonts, colours and controls; a shared visual system across every app has not been established.

## Name and website mark

The project name is **XOCE — Xef’s Open Computing Ecosystem**. The website header and footer pair the XOCE wordmark with an asterisk symbol. The wordmark uses Space Grotesk at a bold weight with tight letter spacing.

The small browser icon uses an eight-spoke mark on an orange rounded square. Its exact SVG is available as [the website favicon](/favicon.svg). It is a website asset; it does not replace the individual watch apps’ icons.

The wordmark and icon are the current website treatment. This guide does not assign them a new licence or declare a final identity for all XOCE applications. See [licensing and source](/docs/project/licensing/) before reusing assets.

## Colours by role

Pages use warm neutral surfaces, dark green/charcoal text and an orange accent. Components refer to semantic CSS properties so light and dark themes keep the same roles.

| Role | CSS property | Light theme | Dark theme |
| --- | --- | --- | --- |
| Page background | `--bg` | `#f5f3ec` | `#1d211d` |
| Contained surface | `--paper` | `#fffef9` | `#272c25` |
| Main text | `--ink` | `#25271f` | `#f1f1e7` |
| Supporting text | `--muted` | `#64675d` | `#b1b8ab` |
| Borders and dividers | `--line` | `#d8d9cf` | `#41483c` |
| Filled accent and focus ring | `--accent` | `#ed754c` | `#f0936a` |
| Accent-coloured text | `--accent-text` | `#a83c1c` | `#f5a17d` |
| Text on a filled accent | `--accent-ink` | `#29251c` | `#25251e` |

Use the dedicated text role for accent-coloured words. A decorative fill and small text have different contrast needs. Keep selected state, errors and action meaning understandable through words, shape or icons as well as colour.

Project illustrations use four additional surface colours: sage `#d7dfcd`, lilac `#ded4e8`, apricot `#f3d0ba` and sky `#d4e3e5`. These colours remain the same in both themes. Content over them needs an appropriate foreground rather than inheriting dark-theme light text blindly.

The favicon has its own fixed orange `#ee683d` and dark mark `#211f1b`. The CSS roles above describe the page interface, not every pixel of an image asset.

## Typography

**Space Grotesk** is the display face for headings and the wordmark. **Inter** is the body face for paragraphs, navigation and controls. Both are self-hosted variable fonts with a system sans-serif fallback and `font-display: swap`.

The base body size is 16px with generous line height. Heading sizes adapt to the viewport. Reading layouts keep prose in a bounded column, while code and wide tables can scroll horizontally within their own area.

Keep long instructions in ordinary sentence case. Small uppercase labels provide section context; they should not carry the only explanation of an important action. Use real text for headings and labels rather than baking it into pictures.

Current font inputs and SIL Open Font License notices are recorded in the repository’s `src/styles/fonts.css` and `THIRD-PARTY-NOTICES.md`. Public copies of the [Inter licence](/fonts/inter-LICENSE.txt) and [Space Grotesk licence](/fonts/space-grotesk-LICENSE.txt) accompany the site.

## Surfaces, spacing and controls

Use whitespace and thin dividers to establish hierarchy. Cards and contained controls use modest rounded corners. Filled orange identifies a prominent action; quieter text links handle ordinary navigation.

The main container has a maximum width of 1200px and responsive side margins. Documentation uses a reading column with section navigation and, where space allows, an on-page table of contents. Smaller screens collapse navigation into explicit disclosure controls.

Keep interactive targets comfortably usable, focus rings visible and labels attached to controls. The search dialog opens through an explicit Search action or keyboard shortcut. Routine page loads leave text-field focus alone.

## Appearance and motion

The theme selector offers System, Light and Dark. An explicit choice is saved in the browser; System follows the operating system. Content, hierarchy and available actions stay consistent across appearances.

Hover and entrance movement should remain brief and optional. The website respects the browser’s reduced-motion preference. Readability and meaningful state do not depend on animation.

## Screenshots and assets

Use real screenshots of current projects. Keep watch pixels intact and provide useful alt text. Describe a rendering as an emulator capture when that is its source. If a watch case is drawn around it, identify the case as an illustration.

Dashboard’s current website image is a 0.4.1 emulator capture reused for its unchanged native layout in 0.4.3. The asset record preserves that distinction instead of relabelling it as a fresh capture.

The repository keeps screenshot origins, source versions and hashes in `docs/asset-provenance.json`. The [project catalogue](/projects/) links current applications and their owning repositories.

## Maintaining this reference

The website’s colour roles, typography and shared layouts are implemented in `src/styles/global.css` and `src/styles/fonts.css`. Header/footer components own the wordmark treatment, and `public/favicon.svg` owns the browser icon. Update this guide when those actual choices change.

For app behaviour, use [design principles](/docs/design/principles/), [UI patterns](/docs/design/ui-patterns/) and [UX & interaction](/docs/design/interaction/).
