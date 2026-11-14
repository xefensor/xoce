# ČHMÚ Weather 1.0.3 — Store update

[Store listing](https://apps.repebble.com/ef7111ffaeaf4593aaaa85ed) · [Runtime source](https://github.com/xefensor/pebble-chmu-weather/commit/ceb0b18aba3a2f5bbf2e55a6ba4fd96c374ef251) · [Current artwork source](https://github.com/xefensor/pebble-chmu-weather/commit/256d71fcc883a7c8e1baf0068c72015477155601)

1. The public Store already has **1.0.3**, matching this checked PBW. Edit the listing artwork; do not upload the same version again.
2. Paste `description.txt` into the description. Use `release-notes.txt` when publishing the prepared binary version.
3. Use the platform banner PNGs and raw screenshot PNGs below. `upload-map.json` gives the exact field mapping.

`description-cs.txt` is the Czech description.

## Icons

- `icon-small-80.png` — 80×80
- `icon-large-144.png` — 144×144

Enable the Developer Dashboard setting for a tintable monochrome icon (`icon_tintable=true`). These PNGs contain a solid black glyph and transparent background, so the client can tint the same icon for light and dark mode. Upload the original transparent PNGs, without a tile or background. Local JSON does not change the live Store flag.

The [official API changelog](https://appstore-api.repebble.com/) documents `icon_tintable`. The exact signed-in Dashboard control label has not been verified. After saving, confirm the public app object's `icon_tintable` is true and inspect both app themes.

Phone plugin: no native watch screenshots or Store banner.

SVGs, product marks, proof and licence files are editing/reference material. Upload the PNGs named above. Earlier captures retain their original pixels; renderer/resource equality with the prepared PBW was verified. Halftone's orange screens are fresh native emulator captures of its checked 1.10.2 build. No physical-device test is claimed.
