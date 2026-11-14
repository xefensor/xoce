# XOCE — one Pebble Store update folder

Everything for the six apps is grouped by product: the exact reviewed PBW, current descriptions/release notes, native screenshots, approved tactile banners/icons, editable SVGs and credits. Start with each product’s `UPLOAD.md`.

## Before a binary upload

The public Store was checked again on 14 November 2026. **All six prepared version numbers are already published, and their public PBW bytes differ from these candidates.** These preserved candidates cannot be treated as unused numeric versions. A changed binary needs a new version and matching release verification before upload. `verification/public-store-check.json` records the public URLs, versions and both hashes.

Listing artwork can be edited independently when it represents the installed app. New-feature descriptions and screenshots must accompany their matching binary release. This corrects the earlier handoff’s claim that these versions were unused. No app was submitted as part of this handoff.

## Products

| Product folder | Candidate version | Banners | Icon PNGs |
| --- | --- | --- | --- |
| [Dynamic](dynamic/UPLOAD.md) | 1.0.0 | 2 | 0 |
| [Halftone](halftone/UPLOAD.md) | 1.10.1 | 2 | 0 |
| [Timer](timer/UPLOAD.md) | 1.0.0 | 2 | 2 |
| [Dashboard](dashboard/UPLOAD.md) | 1.0.0 | 2 | 2 |
| [Open Activity](open-activity/UPLOAD.md) | 1.0.0 | 2 | 2 |
| [ČHMÚ Weather](chmu-weather/UPLOAD.md) | 1.0.2 | 0 | 2 |

Each product folder contains:

- `UPLOAD.md` and `upload-map.json` — exact field mapping and screenshot order.
- One `.pbw` — unchanged from the reviewed candidate; not a new numbered release.
- `description.txt` and `release-notes.txt`; Weather also has `description-cs.txt`.
- Raw native PNG screenshots for each watch platform, plus 720×320 banner PNGs. Time 2 is Emery; Round 2 is Gabbro.
- 80×80 / 144×144 icon PNGs for watch apps and the Weather plugin. Watchfaces have no extra Store icon fields.
- Editable SVGs, original artwork/capture provenance and `licences/`. Product marks are website artwork.

Weather is phone-only: no native watch screenshots or Store banner.

## Preview and source

`review/` has the banner/icon contact sheets and actual website browser previews. `design-source/XOCE-tactile-artwork-2026-11-14.zip` preserves the complete artwork handoff, including the wordmark, favicon, pinned Fira font inputs/licences and generation recipes. Its original audit describes the pre-push snapshot.

The current app source and Store assets are on the GitHub feature branches linked in each `UPLOAD.md`. The website and this complete handoff are on [xefensor/xoce — feat/pebble-store-launch](https://github.com/xefensor/xoce/tree/feat/pebble-store-launch). Website implementation commit: `668acd9`. Pushing these branches does not merge to main, deploy the website, publish a GitHub release or submit to Pebble Store.

## Checks

`verification/` includes the six app test suites/Store-kit checks, source-rebuild evidence, website tests and Chromium report (13 checks, 158 screenshots). These are automated/emulator/browser results; no new physical-watch or phone test is claimed. Previous review ZIPs remain unchanged.

Run `sha256sum -c SHA256SUMS.txt` in this folder to verify every delivered file. Each product also has its own checksum list. The outer ZIP has a separate checksum beside it.

The included `assemble-update.py` is the workspace collection recipe. It requires the original review folders and sibling app checkouts; it does not build or publish anything.
