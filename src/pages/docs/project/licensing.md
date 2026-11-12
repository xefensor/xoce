---
layout: ../../../layouts/DocLayout.astro
title: Licensing and source
description: Find the source, licence and release records for each XOCE project.
section: For users
order: 5
---

Licensing is stated per project. The current Pebble repositories declare **PolyForm Noncommercial License 1.0.0**. Their source is available, but this is not an OSI-approved open-source licence. Each repository’s terms and the notices shipped with its release remain authoritative.

## Maintained repositories

| Project | Source | Licence at the listed release |
| --- | --- | --- |
| Dynamic 0.18.3 | [pebble-watchface-dynamic](https://github.com/xefensor/pebble-watchface-dynamic) | [LICENSE](https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.18.3/LICENSE) |
| Dashboard 0.6.3 | [pebble-app-dashboard](https://github.com/xefensor/pebble-app-dashboard) | [LICENSE](https://github.com/xefensor/pebble-app-dashboard/blob/v0.6.3/LICENSE) |
| Timer 0.14.5 | [pebble-app-timer](https://github.com/xefensor/pebble-app-timer) | [LICENSE](https://github.com/xefensor/pebble-app-timer/blob/v0.14.5/LICENSE) |
| Open Activity 0.3.3 | [pebble-app-open-activity](https://github.com/xefensor/pebble-app-open-activity) | [LICENSE](https://github.com/xefensor/pebble-app-open-activity/blob/v0.3.3/LICENSE) |
| Halftone 1.9.0-rc.6 | [halftone-watchface](https://github.com/xefensor/halftone-watchface) | [LICENSE](https://github.com/xefensor/halftone-watchface/blob/v1.9.0-rc.6/LICENSE) |
| ČHMÚ Weather 1.0.1 | [pebble-chmu-weather](https://github.com/xefensor/pebble-chmu-weather) | [LICENSE](https://github.com/xefensor/pebble-chmu-weather/blob/v1.0.1/LICENSE) |
| Activities 0.4.4 | [pebble-lib-activities](https://github.com/xefensor/pebble-lib-activities) | [LICENSE](https://github.com/xefensor/pebble-lib-activities/blob/v0.4.4/LICENSE) |
| Core 0.5.2 | [pebble-lib-core](https://github.com/xefensor/pebble-lib-core) | [LICENSE](https://github.com/xefensor/pebble-lib-core/blob/v0.5.2/LICENSE) |

Each repository’s licence and required notices are authoritative for its code. Font and other third-party notices accompany the relevant project and release files.

## Source and release identity

Project pages link to versioned GitHub releases. A release can include an installable PBW, a buildable source archive, debugging files and checksums, depending on the project.

Published tags and archives keep their original source and bytes. Later documentation updates on a repository’s default branch do not replace that tested release snapshot. The source archive or release notes identify the relevant source commit.

## Historical names

Three repositories moved to the consistent `pebble-<type>-<name>` naming scheme:

| Historical archive | Maintained repository |
| --- | --- |
| [dynamic-watchface](https://github.com/xefensor/dynamic-watchface) | [pebble-watchface-dynamic](https://github.com/xefensor/pebble-watchface-dynamic) |
| [pebble-activities](https://github.com/xefensor/pebble-activities) | [pebble-lib-activities](https://github.com/xefensor/pebble-lib-activities) |
| [pebble-watchface-core](https://github.com/xefensor/pebble-watchface-core) | [pebble-lib-core](https://github.com/xefensor/pebble-lib-core) |

The old repositories are archived with moved notices. Existing historical links and releases remain available there. Current development and new issue reports belong in the maintained repositories.

Repository names and package identities are separate. The libraries still use `pebble-activities` and `pebble-watchface-core` as their import and package names.

## Website credits

Product previews use native emulator captures with example data. Some appear inside the [official Pebble Appstore Time 2 frame](https://apps.repebble.com/images/screenshot_slider_background_emery_v2.png), credited to Core Devices. The frame and native screen files remain unchanged; their sources and hashes are recorded in `docs/asset-provenance.json`. The composite does not establish physical-watch verification.

ČHMÚ Weather is independent of ČHMÚ, Open-Meteo and Core Devices. Weather data is attributed to **Český hydrometeorologický ústav (ČHMÚ)** and, when enabled, **Open-Meteo** under their applicable CC BY 4.0 terms. Its icon is original generic weather artwork, not the ČHMÚ logo. [Weather data and third-party notices](https://github.com/xefensor/pebble-chmu-weather/blob/v1.0.1/THIRD_PARTY.md) remain authoritative.

The current website uses self-hosted **Inter** under the SIL Open Font License 1.1. Space Grotesk assets remain from an earlier website design. Both notices remain available: [Inter licence](/fonts/inter-LICENSE.txt) and [retained Space Grotesk licence](/fonts/space-grotesk-LICENSE.txt).

The website’s own project-wide licence has not been selected. The individual project and third-party licences above remain unchanged.
