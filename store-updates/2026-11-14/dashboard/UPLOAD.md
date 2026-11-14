# Dashboard 1.0.1 — Store update

[Store listing](https://apps.repebble.com/603d814e961c40308c98ce63) · [Runtime source](https://github.com/xefensor/pebble-app-dashboard/commit/aeb2ee328a5ec75b0b493e25c4f1ac7e1a8889af) · [Current artwork source](https://github.com/xefensor/pebble-app-dashboard/commit/dbbb7f5ad363e172f0e90f7cb819810cf6811706)

1. If the Store still shows **1.0.0**, upload **`Dashboard-1.0.1.pbw`** as **1.0.1**. If this version has already been uploaded, edit its listing instead; do not duplicate or renumber it for artwork.
2. Paste `description.txt` into the description. Use `release-notes.txt` when publishing the prepared binary version.
3. Use the platform banner PNGs and raw screenshot PNGs below. `upload-map.json` gives the exact field mapping.

## Time 2 / Emery

Banner: `emery-family-banner.png` (720×320).

Screenshots, in order:

1. `emery-store-20261114-overview.png`

## Round 2 / Gabbro

Banner: `gabbro-family-banner.png` (720×320).

Screenshots, in order:

1. `gabbro-store-20261114-overview.png`

## Icons

- `icon-small-80.png` — 80×80
- `icon-large-144.png` — 144×144

Enable the Developer Dashboard setting for a tintable monochrome icon (`icon_tintable=true`). These PNGs contain a solid black glyph and transparent background, so the client can tint the same icon for light and dark mode. Upload the original transparent PNGs, without a tile or background. Local JSON does not change the live Store flag.

The [official API changelog](https://appstore-api.repebble.com/) documents `icon_tintable`. The exact signed-in Dashboard control label has not been verified. After saving, confirm the public app object's `icon_tintable` is true and inspect both app themes.

SVGs, product marks, proof and licence files are editing/reference material. Upload the PNGs named above. Earlier captures retain their original pixels; renderer/resource equality with the prepared PBW was verified. Halftone's orange screens are fresh native emulator captures of its checked 1.10.2 build. No physical-device test is claimed.
