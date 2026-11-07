# Third-party notices and asset credits

## Website fonts

Space Grotesk and Inter are self-hosted from the pinned Fontsource variable-font
packages (both version 5.3.0). Both use the SIL Open Font License 1.1. Complete
copyright notices and licence texts are retained in
`public/fonts/space-grotesk-LICENSE.txt` and `public/fonts/inter-LICENSE.txt`.
The website loads no fonts from an external font service.

## Project screenshots

The product screenshots in `public/images/projects/` reproduce Xef's Pebble
applications. They are copied without pixel changes from native Emery emulator
captures in their project repositories. They show example data and are not
physical-watch photographs or browser design mock-ups.

The website displays these captures directly or within the official Pebble Appstore watch
frame credited below. The source PNG files remain unchanged in either
presentation.

| Website asset | Source and capture version |
| --- | --- |
| `dynamic.png` | [Dynamic 0.16.2](https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.16.2/docs/qa/0.16.2/native-previews/music-24-light.png) |
| `dashboard.png` | [Dashboard 0.4.1 capture, retained in 0.4.3](https://github.com/xefensor/pebble-app-dashboard/blob/v0.4.3/docs/qa/0.4.1/native/startup-first-valid-light-snapshot.png) |
| `timer.png` | [Timer 0.12.0](https://github.com/xefensor/pebble-app-timer/blob/v0.12.0/docs/qa/0.12.0/native/reset-explicit-start-new-run.png) |
| `open-activity.png` | [Open Activity 0.1.6](https://github.com/xefensor/pebble-app-open-activity/blob/v0.1.6/docs/qa/0.1.6/emulator/setup-phone-launch.png) |

Dashboard's screenshot illustrates the native layout also used in 0.4.3. It is
an explicitly reused 0.4.1 capture, not a new capture of the 0.4.3 binary.

Source-project licences and third-party notices remain authoritative:

- [Dynamic licence](https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.16.2/LICENSE)
  and [notices](https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.16.2/THIRD-PARTY-NOTICES.md).
- [Dashboard licence](https://github.com/xefensor/pebble-app-dashboard/blob/v0.4.3/LICENSE)
  and [notices](https://github.com/xefensor/pebble-app-dashboard/blob/v0.4.3/THIRD-PARTY-NOTICES.md).
- [Timer licence](https://github.com/xefensor/pebble-app-timer/blob/v0.12.0/LICENSE)
  and [notices](https://github.com/xefensor/pebble-app-timer/blob/v0.12.0/THIRD-PARTY-NOTICES.md).
- [Open Activity licence](https://github.com/xefensor/pebble-app-open-activity/blob/v0.1.6/LICENSE)
  and [notices](https://github.com/xefensor/pebble-app-open-activity/blob/v0.1.6/THIRD-PARTY-NOTICES.md).

This file does not grant a new licence to those applications or their assets.
Exact paths, versions, source commits and SHA-256 hashes are recorded in
[`docs/asset-provenance.json`](docs/asset-provenance.json).

## Pebble Appstore watch frame

`public/images/devices/pebble-time-2.png` is the unchanged official Pebble Time 2
frame used by the [Pebble Appstore](https://apps.repebble.com/). The exact source
is [`screenshot_slider_background_emery_v2.png`](https://apps.repebble.com/images/screenshot_slider_background_emery_v2.png).
Copyright: **Core Devices**. This is a source-provided Pebble asset, not original
XOCE artwork.

The transparent PNG is 488 × 700 pixels, 103,751 bytes, with SHA-256
`ec5f810dda6cfa769df5421c3fcbebb5bd45a36839029a6c396ea4acc7609c54`. Source, hash and usage
are recorded in `docs/asset-provenance.json`.

No asset-specific permissive licence has been verified. The frame is included
for local review only; this record grants no additional licence to it.
The source screenshots remain separate, unchanged native emulator captures.
They retain their 200:228 aspect ratio inside the frame, with matte black
letterboxing where needed. The composite is not a photograph of the running
apps and does not establish physical-watch verification.

## Spatial Desktop material ancestry and historical silk artwork

The material adaptation references the actual [Spatial Desktop prototype](https://github.com/xefensor/spatial-desktop/tree/647b6e1bd1607c28669036795cdcd66ce31197e2), by Alexej Tušl (xefensor). The glass declarations retain ancestry from its acrylic panels and flush controls; the current XOCE palette, geometry and surface densities have their own direction; its philosophy prose and desktop runtime are not imported. Adapted material declarations retain GPL-3.0-or-later terms; the [full GPL text](/licenses/spatial-desktop-materials-GPL-3.0.txt) is included. This attribution does not assign a new licence to the separate apps, their screenshots or website prose.

`public/images/materials/spatial-silk.svg` is an unchanged copy of the original `dist/assets/wallpaper-silk.svg`, copyright 2026 Alexej Tušl (xefensor), licensed under [CC BY-SA 4.0](/licenses/spatial-desktop-artwork-CC-BY-SA-4.0.txt). It is retained as a historical reference and is no longer rendered by the current pages; the SVG itself is not modified. Exact source paths and hashes are recorded in `docs/spatial-material-reference.json`.

## Current XOCE background artwork

`public/images/materials/xoce-planes.svg` is original geometric artwork authored
for this website. It replaces the borrowed silk wallpaper in the current pages.
It does not copy a GNOME, KDE, Microsoft, Apple or Spatial Desktop asset. Current
asset hashes and design roles are recorded in `docs/xoce-visual-identity.json`.
This record does not establish a new project-wide website licence.
