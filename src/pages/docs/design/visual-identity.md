---
layout: ../../../layouts/DocLayout.astro
title: Visual identity
description: XOCE’s tactile website identity, materials, typography and native device presentation.
section: Design
order: 2
---

XOCE’s website uses cool silver and graphite, blue controls, strong condensed headings and restrained physical depth. Xef approved the homepage concept before it was extended across the site and Store artwork. The identity draws on the actual Pebble apps and Xef’s desktop and Android material experiments.

The [Pebble UI and UX standard](/docs/design/pebble-ui-system/) owns native watch and phone-settings design. These website materials do not replace the apps’ interfaces.

## Colour and material

Use semantic roles from `src/styles/theme.css`. Light mode has cool silver backgrounds and near-white working surfaces; dark mode uses graphite. Blue identifies actions, links and focus. Colour is accompanied by labels, shapes or visible state.

The page, working surfaces and controls have distinct roles. Fine edge highlights and contact shadows show the grouping of a header, control or product presentation. Reading areas remain opaque and calm. Text stays sharp and flat, with readable supporting text in both themes.

Product stages use a shared graphite surface, keeping the actual native screen the focus. Smaller controls belong to their parent surface. Avoid adding a separate floating panel around every line of text.

## Typography and the name

**Fira Sans** is the reading and control face. **Fira Sans Condensed Bold/ExtraBold** supplies headings. Body text remains comfortable at mobile sizes; documentation has one bounded reading column.

The **XOCE** wordmark uses outlined Fira Sans Condensed ExtraBold letters. It follows the foreground colour and remains readable in monochrome. The X favicon uses the same letter shape on blue. The name expands to **Xef’s Open Computing Ecosystem**.

Fonts are self-hosted Latin/Latin Extended WOFF exports, including Czech characters, with `font-display: swap`. The [font provenance](/fonts/xoce/provenance.json) records pinned upstream sources and hashes; the [SIL OFL licence](/fonts/xoce/OFL.txt) accompanies them. Previous Inter and Space Grotesk files and licences remain available as historical assets.

## Pages and controls

Home introduces the actual Pebble apps with a shared watch stage and direct app/setup actions. Dynamic’s four-reading split layout and Halftone’s two-location layout show their different character. Watchface tiles, watch-app rows and a separate phone weather plugin make browsing clear.

Product pages retain compatibility and installation state beside the preview. About explains the wider KDE Plasma and Android direction accurately. Docs opens the Getting started article and keeps support, setup and developer guidance directly reachable.

Desktop controls can depress slightly while pressed. Touch controls stay stationary and respond through colour and light. Feedback is immediate and brief. Ordinary visits do not move keyboard focus; opening Search explicitly focuses its field.

System, Light and Dark remain available. An explicit appearance choice persists across navigation. Reduced motion, reduced transparency and forced colours receive usable fallbacks. Navigation, documentation and watch-shape selection work without JavaScript.

## Product artwork and images

Product symbols remain recognizable: Timer’s hourglass, Dashboard’s panels, Open Activity’s opening arrow and Weather’s sun/cloud/rain. They use crisp monochrome glyphs with a transparent background. Website marks follow the page’s light/dark appearance; the graphite product stage uses white glyphs. Watchface marks are website artwork rather than Store icon fields.

Xef selected the original orange Halftone banner as the Store reference: a bold colour field, curved patterned edge, large white title and illustrated watch. The family keeps that composition with each app’s colour and motif, and with real native screens for both watch shapes. The Store’s app icons use one-colour transparent glyphs marked `icon_tintable`; no background tile or shadow is baked into those files. Standalone Store screenshots remain raw and unframed.

Native screenshot files and the website’s official Time 2/Round 2 frame files retain their exact bytes and proportions. Those website frames are credited to Core Devices. The new Store illustrations adapt Xef’s original Halftone SVG instead. Neither composition is a physical-watch photograph or a hardware test. Current orange Halftone captures have native emulator evidence.

New artwork uses new website filenames and provenance records. Historical images and the earlier review bundles stay unchanged. The original generated homepage concept is a design reference; the implemented site is responsive HTML/CSS using actual project assets.

## Maintaining the identity

`src/styles/theme.css` owns colours and material roles; `src/styles/identity.css` owns the approved presentation. Shared components provide navigation, the outlined wordmark and native previews. Documentation’s reading layout remains in `src/styles/guide.css`.

Existing app licences and third-party credits remain authoritative. The earlier Spatial Desktop material ancestry and retained artwork are documented separately; this identity does not grant a new licence to app screenshots or official device frames.
