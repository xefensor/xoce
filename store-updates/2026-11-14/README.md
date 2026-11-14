# XOCE — Pebble Store update, 14 November 2026

The current Store artwork follows the original orange Halftone banner: bold colour, large white type, a curved patterned edge and illustrated watches with real native screens. Open each product’s `UPLOAD.md` for the exact upload fields.

| Product folder | Checked PBW version | Public Store version checked on 14 November |
| --- | --- | --- |
| [Dynamic](dynamic/UPLOAD.md) | 1.0.1 | 1.0.0 |
| [Halftone](halftone/UPLOAD.md) | 1.10.2 | 1.10.1 |
| [Timer](timer/UPLOAD.md) | 1.0.2 | 1.0.0 |
| [Dashboard](dashboard/UPLOAD.md) | 1.0.1 | 1.0.0 |
| [Open Activity](open-activity/UPLOAD.md) | 1.0.1 | 1.0.0 |
| [ČHMÚ Weather](chmu-weather/UPLOAD.md) | 1.0.3 | 1.0.3 |

Each product folder contains its checked `.pbw`, plain-text description/release notes, platform banners, raw native screenshots, applicable 80/144 px icons, editable SVGs and licences. There are 34 selected native screenshots, ten 720×320 Store banners and four icon sets. Weather is phone-only and has no watch screenshot or Store banner.

These PBWs retain the new numeric versions prepared earlier; artwork does not require another binary version. Weather 1.0.3 is already public and matches the checked PBW: update its listing only. For other apps, upload the prepared version only if it is still missing. Public UUIDs and existing binary bytes are retained. `runtimeSourceCommit` and `storeSourceCommit` distinguish the binary source from the current listing art.

For Timer, Dashboard, Open Activity and Weather, upload the transparent black 80/144 px icons and enable the documented tintable-icon setting (`icon_tintable=true`) in Developer Dashboard. The client can then tint one glyph for light/dark mode. This setting must be saved on the Store; editing local JSON cannot enable it remotely. See `review/icons-light-dark.png` and each guide. Watchfaces have no Store icon upload in this handoff.

Use the `.pbw` in each product folder for the binary field. `developer/` contains matching source/debug archives for maintenance; `design-source/` preserves the original artwork inputs, fonts/licences and recipes. SVGs, product marks and these archives are not extra Store screenshot fields. Preview the banner/icon family in `review/`.

`verification/` includes the earlier six-app builds, artifact/configuration checks and strict renderer equivalence, plus fresh six-app tests/Store checks for this artwork pass, binary-alpha icon checks and website browser evidence. Halftone's two orange screens are fresh native QEMU captures of its checked build; other native PNGs were reused after renderer equivalence passed. No physical-watch result is claimed.

The source and this handoff are on the GitHub branches linked in the per-product guides and [XOCE website repository](https://github.com/xefensor/xoce). Website deployment is tracked separately from app publication. No Store submission or GitHub app release is performed by this package.

Verify all payload files with `sha256sum -c SHA256SUMS.txt`. Each product has its own checksum list. The complete ZIP has a separate `.sha256` file beside it.
