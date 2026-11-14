# Timer 1.0.2 — Store update

[Store listing](https://apps.repebble.com/2f8f8cfd4e7e442fb724dac7) · [Runtime source](https://github.com/xefensor/pebble-app-timer/commit/575db8a52fd61a378db044fe01dd8bb378bdca2c) · [Current artwork source](https://github.com/xefensor/pebble-app-timer/commit/8070b4be2a12f2081d3e7089a87ce27ed40096bf)

1. If the Store still shows **1.0.0**, upload **`Timer-1.0.2.pbw`** as **1.0.2**. If this version has already been uploaded, edit its listing instead; do not duplicate or renumber it for artwork.
2. Paste `description.txt` into the description. Use `release-notes.txt` when publishing the prepared binary version.
3. Use the platform banner PNGs and raw screenshot PNGs below. `upload-map.json` gives the exact field mapping.

## Time 2 / Emery

Banner: `emery-family-banner.png` (720×320).

Screenshots, in order:

1. `emery-store-20261114-running.png`
2. `emery-store-20261114-overview.png`
3. `emery-store-20261114-editor.png`
4. `emery-store-20261114-paused.png`
5. `emery-store-20261114-pending-alarm.png`

## Round 2 / Gabbro

Banner: `gabbro-family-banner.png` (720×320).

Screenshots, in order:

1. `gabbro-store-20261114-running.png`
2. `gabbro-store-20261114-overview.png`
3. `gabbro-store-20261114-editor.png`
4. `gabbro-store-20261114-paused.png`
5. `gabbro-store-20261114-pending-alarm.png`

## Icons

- `icon-small-80.png` — 80×80
- `icon-large-144.png` — 144×144

Enable the Developer Dashboard setting for a tintable monochrome icon (`icon_tintable=true`). These PNGs contain a solid black glyph and transparent background, so the client can tint the same icon for light and dark mode. Upload the original transparent PNGs, without a tile or background. Local JSON does not change the live Store flag.

The [official API changelog](https://appstore-api.repebble.com/) documents `icon_tintable`. The exact signed-in Dashboard control label has not been verified. After saving, confirm the public app object's `icon_tintable` is true and inspect both app themes.

SVGs, product marks, proof and licence files are editing/reference material. Upload the PNGs named above. Earlier captures retain their original pixels; renderer/resource equality with the prepared PBW was verified. Halftone's orange screens are fresh native emulator captures of its checked 1.10.2 build. No physical-device test is claimed.
