# Open Activity 1.0.1 — Store update

[Store listing](https://apps.repebble.com/59af0a59f7a34cb09a79bcbe) · [Runtime source](https://github.com/xefensor/pebble-app-open-activity/commit/4fd2e10791845ca148a6c231817ad5e379c8b47d) · [Current artwork source](https://github.com/xefensor/pebble-app-open-activity/commit/1c4958dd0f69f23b56cf91f925b8416a49f6e85a)

1. If the Store still shows **1.0.0**, upload **`Open-Activity-1.0.1.pbw`** as **1.0.1**. If this version has already been uploaded, edit its listing instead; do not duplicate or renumber it for artwork.
2. Paste `description.txt` into the description. Use `release-notes.txt` when publishing the prepared binary version.
3. Use the platform banner PNGs and raw screenshot PNGs below. `upload-map.json` gives the exact field mapping.

## Time 2 / Emery

Banner: `emery-family-banner.png` (720×320).

Screenshots, in order:

1. `emery-overview.png`

## Round 2 / Gabbro

Banner: `gabbro-family-banner.png` (720×320).

Screenshots, in order:

1. `gabbro-overview.png`

## Icons

- `icon-small-80.png` — 80×80
- `icon-large-144.png` — 144×144

Enable the Developer Dashboard setting for a tintable monochrome icon (`icon_tintable=true`). These PNGs contain a solid black glyph and transparent background, so the client can tint the same icon for light and dark mode. Upload the original transparent PNGs, without a tile or background. Local JSON does not change the live Store flag.

The [official API changelog](https://appstore-api.repebble.com/) documents `icon_tintable`. The exact signed-in Dashboard control label has not been verified. After saving, confirm the public app object's `icon_tintable` is true and inspect both app themes.

SVGs, product marks, proof and licence files are editing/reference material. Upload the PNGs named above. Earlier captures retain their original pixels; renderer/resource equality with the prepared PBW was verified. Halftone's orange screens are fresh native emulator captures of its checked 1.10.2 build. No physical-device test is claimed.
