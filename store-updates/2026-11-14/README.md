# XOCE — Pebble Store update, 14 November 2026

All six PBWs now have new numeric versions, rebuilt from the reviewed source and checked for Store upload. Open each product’s `UPLOAD.md` for the exact file mapping.

| Product folder | New version to upload | Replaces public version |
| --- | --- | --- |
| [Dynamic](dynamic/UPLOAD.md) | 1.0.1 | 1.0.0 |
| [Halftone](halftone/UPLOAD.md) | 1.10.2 | 1.10.1 |
| [Timer](timer/UPLOAD.md) | 1.0.2 | 1.0.0 |
| [Dashboard](dashboard/UPLOAD.md) | 1.0.1 | 1.0.0 |
| [Open Activity](open-activity/UPLOAD.md) | 1.0.1 | 1.0.0 |
| [ČHMÚ Weather](chmu-weather/UPLOAD.md) | 1.0.3 | 1.0.2 |

Each product folder contains its new `.pbw`, plain-text description/release notes, platform banners, raw native screenshots, applicable 80/144 px icons, editable SVGs and licences. There are 34 native screenshots, ten 720×320 banners and four icon sets. Weather is phone-only and has no watch screenshot or Store banner.

The new versions were absent from public Pebble Store history and GitHub tags when checked. Public UUIDs, saved-state compatibility, reviewed native interfaces and dependency pins are retained. The complete previous numbered artifacts remain unchanged. No old-number PBW is mixed into this handoff.

Use the `.pbw` in each product folder for the binary field. `developer/` contains matching source/debug archives for maintenance; `design-source/` preserves the original artwork inputs, fonts/licences and recipes. SVGs, product marks and these archives are not extra Store screenshot fields. Preview the banner/icon family in `review/`.

`verification/` records fresh six-app tests/builds, native artifact/configuration and Store-kit checks, strict renderer/resource equivalence, version availability, release preparation and website checks. Previous native PNGs were reused only after renderer equivalence passed; no fresh emulator capture, phone or physical-watch result is claimed.

The source and this handoff are on the GitHub feature branches linked in the per-product guides and [XOCE website branch](https://github.com/xefensor/xoce/tree/feat/pebble-store-launch). No Store submission, GitHub release publication or website deployment is implied by a branch push.

Verify all payload files with `sha256sum -c SHA256SUMS.txt`. Each product has its own checksum list. The complete ZIP has a separate `.sha256` file beside it.
