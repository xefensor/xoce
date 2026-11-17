---
layout: ../../../layouts/DocLayout.astro
title: Website visual identity
description: Live colour, type and control specimens, with rules for XOCE product identities and assets.
section: Design
order: 2
designReference: website
---

The specimens above use this website’s real CSS and product marks. The website family is **cool silver and graphite, blue actions, Fira typography and restrained physical depth**. Product accents distinguish the apps; they do not replace the interaction colour.

These are web and marketing rules. [Phone settings and native watch interfaces](/docs/design/pebble-ui-system/) have their own typography, controls and palette constraints.

## Colour and material

Use semantic roles from [theme.css](https://github.com/xefensor/xoce/blob/main/src/styles/theme.css), not a convenient product accent. `--ink` and `--muted` distinguish text roles; `--accent-text` is for links, `--accent` with `--accent-ink` for prominent actions, and `--focus` for a visible keyboard boundary.

Page, reading, control and product-stage surfaces have different jobs. Reading areas are opaque and quiet. Fine highlights and contact shadows group a control or stage; do not add a floating panel around every sentence. Supporting text still needs readable contrast in both themes.

```css
/* Reuse the existing roles in a website component. */
.example-reading { color: var(--ink); background: var(--paper); }
.example-link { color: var(--accent-text); }
.example-link:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 3px;
}
```

The website’s theme control offers System, Light and Dark. Explicit choices persist across navigation. Forced colours, reduced transparency and reduced motion need usable fallbacks; colour must not be the only indication of selection, failure or focus.

## Typography and the name

Use **Fira Sans** for reading and controls, and **Fira Sans Condensed** for headings. Ordinary headings use weight 700; prominent home/product headings can use 800. The existing documentation body is 1.0625rem with line-height1.8 on larger screens, and 1rem/1.75 on narrow screens. Its reading width is bounded rather than filling a large monitor.

The outlined **XOCE** wordmark uses Fira Sans Condensed ExtraBold and follows the foreground colour. The X favicon uses the same letter on blue. The name means **Xef’s Open Computing Ecosystem**. Keep the supplied vector’s proportions and clear space; do not reconstruct it with live text or add a background tile.

Fonts are self-hosted Latin/Latin Extended WOFF exports, including Czech. [Font provenance](/fonts/xoce/provenance.json) pins their sources and hashes, and the [OFL](/fonts/xoce/OFL.txt) accompanies them. Historical Inter and Space Grotesk assets retain their original credits.

## Spacing and shape

Reuse the existing component before inventing a new measurement. Current shape roles are 4px for small corners, 7px for controls and 14px for panes. Common local gaps include 8, 12, 16 and 24px; the desktop article gutter is 36px and narrows with the viewport. These are existing applications, not a requirement to snap every composition to one grid.

Keep related labels, values and help close together; leave more space between tasks. Ordinary touch controls need a comfortable target, with 44px as the starting target used by the site. Test the real narrow layout and enlarged text rather than relying on nominal dimensions.

## Pages and controls

Blue identifies links and actions across all product pages. The primary action should name its destination or result. A quieter action stays on the parent surface. Hover, press and keyboard focus are distinct; a focus ring must remain visible over both silver and graphite.

Desktop pointer controls may depress slightly while pressed. Touch controls stay stationary and respond through colour and light. A disabled action uses an actual disabled control and an understandable reason; appearance alone cannot disable a link. The disabled specimen is a native button, while the other specimens are working documentation links.

Home and Software group two watchfaces, three watch apps and a separate phone plugin. Product pages put purpose, a genuine demonstration and installation/compatibility information together. On mobile the introduction is followed by the demonstration, then the longer detail. The docs remain a calm reading surface with explicit navigation.

## Product artwork and images

Use the six symbols and motifs above as a family. Keep the monochrome silhouette clear at small sizes. Device treatment, title typography, spacing and the small XOCE endorsement tie banners together; composition and meaningful geometry belong to each product. Halftone keeps orange dots rather than donating its separator to every other app.

Website stages and cards use **fresh vector compositions based on those banner colours and motifs**. The square stage and wide tile assets in `/images/product-art/` are designed for their website surfaces, with their sources and hashes recorded in the [product artwork manifest](https://github.com/xefensor/xoce/blob/main/docs/product-artwork.json). The specimens above use the same artwork component as the product sections.

Keep artwork decorative: product titles, controls and real device previews remain separate content. Do not crop a complete Store banner into a background or bake its title and watch screen into a website card. Native captures and official frames keep their original bytes, proportions and provenance. Product colour supports identity while the website’s blue continues to identify actions.

| Product | Website identity | Pebble Store artwork | Native launcher |
| --- | --- | --- | --- |
| Dynamic | Clock/readings mark, adapting bands, idle and activity examples | Per-platform banner and raw native gallery; no Store icon fields | Transparent25px glyph |
| Halftone | Dithered clock mark, orange dots, original orange hero | Per-platform banner and raw native gallery; no Store icon fields | Transparent25px glyph |
| Timer | Hourglass and time arcs | Tintable 80/144px icons, banner and raw native gallery | Transparent25px glyph |
| Dashboard | Panels and grid | Tintable 80/144px icons, banner and raw native gallery | Transparent25px glyph |
| Open Activity | Opening arrow and directional path | Tintable 80/144px icons; labelled cross-app banner; its own native setup screen in the gallery | Transparent25px glyph |
| ČHMÚ Weather | Sun/cloud/rain and atmospheric contours; genuine phone settings | Tintable 80/144px plugin icons; no plugin screenshot/banner slots | None: phone-only plugin |

Website marks follow the page theme; marks on graphite stages are white. Store icons are one-colour black glyphs on a transparent background with binary alpha, marked `icon_tintable`; tiles, shadows and device frames are not baked into them. The current native launcher exports are black on transparent, chosen for actual firmware rows; they are separate files from the Store and website marks.

Banners are 720×320 marketing compositions. Standalone Store screenshots are raw, unframed native PNGs: 200×228 for Emery and 260×260 for Gabbro. Website device previews use the credited official frame files without changing their proportions or source pixels.

Dynamic’s side-by-side states and Open Activity’s labelled Dynamic→Timer example are separate real captures, not a synchronized recording or invented helper interface. ČHMÚ has no watch screen: its hero presents actual browser settings and links to the full image. The [image provenance](/preview-provenance.json) distinguishes artwork, emulator rendering and simulated phone previews.

## Maintaining the identity

[theme.css](https://github.com/xefensor/xoce/blob/main/src/styles/theme.css) owns colours/material roles; [identity.css](https://github.com/xefensor/xoce/blob/main/src/styles/identity.css) owns the approved presentation; [guide.css](https://github.com/xefensor/xoce/blob/main/src/styles/guide.css) owns reading geometry. The specimens read the production theme declarations at build time. Keep shared navigation, wordmark and preview components in use.

Use the shared `ProductArtwork` component for product stages, tiles and design specimens. Its decorative image must stay outside the accessible content and ignore pointer input. Keep headings, links, shape controls and focus indicators readable in both themes; forced-colour and reduced-transparency modes may omit the decoration without losing information.

Append new versioned artwork and provenance when assets change. Historical images, official device frames, app screenshots, licences and earlier review bundles retain their bytes and credits. Validate desktop/mobile, both themes, keyboard focus and reduced-motion/forced-colour behaviour on the rendered page.
