---
layout: ../../../layouts/DocLayout.astro
title: Licensing and source
description: Find the source, licence and release records for each XOCE project.
section: For users
order: 5
---

Licensing is stated per project. The current Pebble repositories declare **PolyForm Noncommercial License 1.0.0**. Their source is available, but this is not an OSI-approved open-source licence. Each repository’s terms and the notices shipped with its release remain authoritative.

## Maintained repositories

| Project | Source | Licence reference |
| --- | --- | --- |
| [Dynamic](/projects/dynamic/) | [pebble-watchface-dynamic](https://github.com/xefensor/pebble-watchface-dynamic) | [LICENSE](https://github.com/xefensor/pebble-watchface-dynamic/blob/main/LICENSE) |
| [Dashboard](/projects/dashboard/) | [pebble-app-dashboard](https://github.com/xefensor/pebble-app-dashboard) | [LICENSE](https://github.com/xefensor/pebble-app-dashboard/blob/main/LICENSE) |
| [Timer](/projects/timer/) | [pebble-app-timer](https://github.com/xefensor/pebble-app-timer) | [LICENSE](https://github.com/xefensor/pebble-app-timer/blob/main/LICENSE) |
| [Open Activity](/projects/open-activity/) | [pebble-app-open-activity](https://github.com/xefensor/pebble-app-open-activity) | [LICENSE](https://github.com/xefensor/pebble-app-open-activity/blob/main/LICENSE) |
| [Halftone](/projects/halftone/) | [halftone-watchface](https://github.com/xefensor/halftone-watchface) | [LICENSE](https://github.com/xefensor/halftone-watchface/blob/main/LICENSE) |
| [ČHMÚ Weather](/projects/chmu-weather/) | [pebble-chmu-weather](https://github.com/xefensor/pebble-chmu-weather) | [LICENSE](https://github.com/xefensor/pebble-chmu-weather/blob/main/LICENSE) |
| Activities 0.4.4 | [pebble-lib-activities](https://github.com/xefensor/pebble-lib-activities) | [LICENSE](https://github.com/xefensor/pebble-lib-activities/blob/v0.4.4/LICENSE) |
| Core 0.5.2 | [pebble-lib-core](https://github.com/xefensor/pebble-lib-core) | [LICENSE](https://github.com/xefensor/pebble-lib-core/blob/v0.5.2/LICENSE) |
| XOCE UI 0.1.1 | [pebble-lib-ui](https://github.com/xefensor/pebble-lib-ui) | [LICENSE](https://github.com/xefensor/pebble-lib-ui/blob/v0.1.1/LICENSE) |

Each repository’s licence and required notices are authoritative for its code. Font and other third-party notices accompany the relevant project and release files.

## Source and release identity

Project pages identify the current published versions and link to their exact GitHub releases. A release can include an installable PBW, a buildable source archive, debugging files and checksums, depending on the project. The [developer build reference](/docs/develop/building/#library-versions) distinguishes public library releases from newer snapshots bundled in apps.

Published tags and archives keep their original source and bytes. Later documentation updates on a repository’s default branch do not replace that tested release snapshot. The source archive or release notes identify the relevant source commit.

## Historical names

Three repositories moved to the consistent `pebble-<type>-<name>` naming scheme:

| Historical archive | Maintained repository |
| --- | --- |
| [dynamic-watchface](https://github.com/xefensor/dynamic-watchface) | [pebble-watchface-dynamic](https://github.com/xefensor/pebble-watchface-dynamic) |
| [pebble-activities](https://github.com/xefensor/pebble-activities) | [pebble-lib-activities](https://github.com/xefensor/pebble-lib-activities) |
| [pebble-watchface-core](https://github.com/xefensor/pebble-watchface-core) | [pebble-lib-core](https://github.com/xefensor/pebble-lib-core) |

The old repositories are archived with moved notices. Existing historical links and releases remain available there. Current development and new issue reports belong in the maintained repositories.

Repository names and package identities are separate. The libraries use `pebble-activities`, `pebble-watchface-core` and `pebble-xoce-ui` as their package names.

## Website credits

Product previews use native emulator captures with example data. Some appear inside the official Pebble Appstore [Time 2](https://apps.repebble.com/images/screenshot_slider_background_emery_v2.png) and [Round 2](https://apps.repebble.com/images/screenshot_slider_background_gabbro.png) frames, credited to Core Devices. The frame and native screen files remain unchanged; their sources and hashes are recorded in `docs/asset-provenance.json`. The composite does not establish physical-watch verification.

ČHMÚ Weather is independent of ČHMÚ, Open-Meteo and Core Devices. Weather data is attributed to **Český hydrometeorologický ústav (ČHMÚ)** and, when enabled, **Open-Meteo** under their applicable CC BY 4.0 terms. Its icon is original generic weather artwork, not the ČHMÚ logo. [Weather data and third-party notices](https://github.com/xefensor/pebble-chmu-weather/blob/v1.0.1/THIRD_PARTY.md) remain authoritative.

The current website uses self-hosted **Fira Sans and Fira Sans Condensed** under the [SIL Open Font License 1.1](/fonts/xoce/OFL.txt). [Pinned font sources and hashes](/fonts/xoce/provenance.json) identify the local exports. Previous font files and notices remain available: [Inter licence](/fonts/inter-LICENSE.txt) and [Space Grotesk licence](/fonts/space-grotesk-LICENSE.txt).

The website’s own project-wide licence has not been selected. The individual project and third-party licences above remain unchanged.
