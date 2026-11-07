---
layout: ../../../layouts/DocLayout.astro
title: Building and contributing
description: Find the right source version, run its checks and contribute changes in the owning project.
section: For developers
order: 3
---

Choose the project you want to change, then use its versioned README for SDK requirements, build commands and validation. The references below match the public versions listed on this website. Separate local candidates do not replace those releases or their instructions.

## Build and test

Open the relevant build instructions before setting up your environment:

| Project | Version | Build instructions |
| --- | --- | --- |
| Activities | 0.4.4 | [Build and check](https://github.com/xefensor/pebble-lib-activities/blob/v0.4.4/README.md#build-and-check) |
| Core | 0.5.1 | [Build and test](https://github.com/xefensor/pebble-lib-core/blob/v0.5.1/README.md#build-and-test) |
| Dynamic | 0.16.2 | [Build and install](https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.16.2/README.md#build-and-install) |
| Dashboard | 0.4.3 | [Build and validate](https://github.com/xefensor/pebble-app-dashboard/blob/v0.4.3/README.md#build-and-validate) |
| Timer | 0.12.0 | [Build and check](https://github.com/xefensor/pebble-app-timer/blob/v0.12.0/README.md#build-and-check) |
| Open Activity | 0.1.6 | [Development and validation](https://github.com/xefensor/pebble-app-open-activity/blob/v0.1.6/README.md#development-and-validation) |

Work from the source version relevant to your change. When reproducing a reported bug, record the installed release and use its matching tag. When working on newer source, follow that revision’s README and say which revision you tested.

Run the checks required by the owning repository and build the affected app or library. Check the resulting workflow as well as the build: saving settings, closing and reopening, restarting, missing permissions and app handoff can expose problems that compilation does not.

Record automated checks, packaged browser execution, native emulator results and physical-device verification separately. An emulator screenshot does not establish physical-watch readability, vibration, button feel or battery life.

## Libraries and consumers

Activities and Core are dependencies bundled into their consuming apps. Users do not install a separate library service.

| Library | Documented consumers | Integration guide |
| --- | --- | --- |
| [Activities](/projects/activities/) | [Dynamic](/projects/dynamic/), [Dashboard](/projects/dashboard/), [Timer](/projects/timer/) and [Open Activity](/projects/open-activity/) | [Build an activity provider](/docs/develop/activities/) |
| [Core](/projects/core/) | [Dynamic](/projects/dynamic/) and [Dashboard](/projects/dashboard/) | [Integrate Core](/docs/develop/core/) |

Providers supply activity content and capabilities; hosts choose presentation and controls. Dynamic displays compatible activities and app destinations. Dashboard can execute actions supported by its bound source, but Timer Pause/Resume from Dashboard remains unimplemented. See the [app-opening and action boundaries](/docs/develop/activities/#app-opening-and-actions).

The versioned library specifications own exact API fields, limits and wire formats. The integration guides link to those authoritative references. A library update does not change the copy already embedded in an installed app: update the consumer’s dependency, rebuild it, validate the affected behaviour and release that consumer separately.

## Android scope

The [Phone plan](/projects/phone/) describes the intended Android app and optional Pebble companion. No Android build, integration API or developer setup is published here. Activities and Core describe Pebble integrations; they do not establish an Android API or require every XOCE product to use activities.

## Contribute

Report bugs and propose changes in the affected project’s maintained repository, linked from its app or library page. Include the version, reproduction steps, expected behaviour and observed result. For a code change, explain the resulting behaviour and the checks you actually completed.

For interface work, follow the [design principles](/docs/design/principles/) and the [Pebble UI and UX standard](/docs/design/pebble-ui-system/). The shared Pebble standard is implemented and validated in local candidates; those candidates have not replaced the public releases or their user guides. Real-device verification remains separate.

Check the [project licences and source links](/docs/project/licensing/) before reusing code. The current Pebble projects use PolyForm Noncommercial 1.0.0. Each project retains its own terms; a planned Android product does not inherit a licence from the XOCE name.
