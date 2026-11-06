---
layout: ../../../layouts/DocLayout.astro
title: Licensing and source
description: Find the source, licence and release records for each XOCE project.
section: For users
order: 5
---

Licensing is stated per project. The current Pebble repositories declare **PolyForm Noncommercial License 1.0.0**. This website preview does not change those licences or the notices shipped with their releases.

## Maintained repositories

| Project | Source | Licence at the listed release |
| --- | --- | --- |
| Dynamic 0.16.2 | [pebble-watchface-dynamic](https://github.com/xefensor/pebble-watchface-dynamic) | [LICENSE](https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.16.2/LICENSE) |
| Dashboard 0.4.3 | [pebble-app-dashboard](https://github.com/xefensor/pebble-app-dashboard) | [LICENSE](https://github.com/xefensor/pebble-app-dashboard/blob/v0.4.3/LICENSE) |
| Timer 0.12.0 | [pebble-app-timer](https://github.com/xefensor/pebble-app-timer) | [LICENSE](https://github.com/xefensor/pebble-app-timer/blob/v0.12.0/LICENSE) |
| Open Activity 0.1.6 | [pebble-app-open-activity](https://github.com/xefensor/pebble-app-open-activity) | [LICENSE](https://github.com/xefensor/pebble-app-open-activity/blob/v0.1.6/LICENSE) |
| Activities 0.4.4 | [pebble-lib-activities](https://github.com/xefensor/pebble-lib-activities) | [LICENSE](https://github.com/xefensor/pebble-lib-activities/blob/v0.4.4/LICENSE) |
| Core 0.5.1 | [pebble-lib-core](https://github.com/xefensor/pebble-lib-core) | [LICENSE](https://github.com/xefensor/pebble-lib-core/blob/v0.5.1/LICENSE) |

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

Product previews are native emulator captures with example data, presented inside illustrated watch cases. Their capture versions and sources are recorded in the website repository’s `docs/asset-provenance.json`. A screenshot is evidence of rendering in that emulator state, not of physical-watch verification.

Space Grotesk and Inter are self-hosted under the SIL Open Font License 1.1. Their complete notices are available here: [Space Grotesk licence](/fonts/space-grotesk-LICENSE.txt) and [Inter licence](/fonts/inter-LICENSE.txt).

The website’s own project-wide licence has not been selected. The individual project and third-party licences above remain unchanged.
