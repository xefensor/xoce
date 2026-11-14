---
layout: ../../../layouts/DocLayout.astro
title: Building and contributing
description: Find the right source version, run its checks and contribute changes in the owning project.
section: For developers
order: 3
developerReference: true
---

Choose a task in the [developer overview](/docs/develop/). The references above distinguish published app tags, downloadable library releases and the different packages bundled in those apps.

## Current development workflow

For a new change, clone the owning repository and start with its current `CONTRIBUTING.md`. To reproduce an installed release, check out the tag in the build table first. Keep a clean branch for your work and record the commit you tested.

The native apps select Node 22.23.4, Python 3.12.15 and SDK 4.44 through version files and locked build tooling. Follow the selected revision’s setup instructions rather than replacing its vendored packages with the newest download. Library releases can have a different SDK/platform contract.

## Build and test

For the native apps, the usual sequence after selecting the required tools is:

```sh
npm ci --ignore-scripts
npm run check:setup -- --sdk
npm test
npm run build
npm run check:artifact
```

Portable source tests need Node, Python and a C compiler; the native build and artifact checks also need the pinned SDK. The owning guide explains the verified SDK bootstrap. Ordinary builds write `build/candidate/`; disposable evidence belongs in `build/qa/`. Preserve frozen `dist/`, `releases/` and historical captures.

ČHMÚ Weather has no watch binary and uses its public-plugin build instead:

```sh
npm ci --ignore-scripts
npm test
CHMU_VERSION=$(node -p "require('./package.json').version")
python3 scripts/build.py --variant public --output "build/candidate/CHMU-Weather-${CHMU_VERSION}.pbw"
```

Use the version from the checked-out package when choosing that output filename. Personal Weather is a separate build and must not enter the public plugin’s release.

Run the checks required by the owning repository and build the affected app or library. Check the resulting workflow as well as the build: saving settings, closing and reopening, restarting, missing permissions and app handoff can expose problems that compilation does not.

Record automated checks, packaged browser execution, native emulator results and physical-device verification separately. An emulator screenshot does not establish physical-watch readability, vibration, button feel or battery life.

## Libraries and consumers

Choose the smallest integration that fits your task:

| Library | Documented consumers | Integration guide |
| --- | --- | --- |
| [Activities](/projects/activities/) | Dynamic, Halftone, Dashboard and Timer | [Publish a summary from a plugin](/docs/develop/activities/) |
| [Core](/projects/core/) | Dynamic and Halftone | [Read the selected global readings in a host](/docs/develop/core/) |
| [XOCE UI](/docs/develop/ui/) | All five native watch products | [Use native drawing helpers or phone settings styles](/docs/develop/ui/) |

Providers supply activity content and capabilities; hosts choose presentation and controls. Dynamic displays compatible activities and app destinations. Dashboard can execute actions supported by its bound source, but Timer Pause/Resume from Dashboard remains unimplemented. See the [app-opening and action boundaries](/docs/develop/activities/#app-opening-and-actions).

The versioned library specifications own exact API fields, limits and wire formats. The guides include small runnable examples. A library update does not change an installed app: update its pin and lockfile, rebuild it, validate the affected behaviour and release that consumer separately.

## Android scope

The [Phone plan](/projects/phone/) describes the intended Android app and optional Pebble companion. No Android build, integration API or developer setup is published here. Activities and Core describe Pebble integrations; they do not establish an Android API or require every XOCE product to use activities.

## Contribute

Report bugs and propose changes in the affected project’s maintained repository, linked from its app or library page. Include the version, reproduction steps, expected behaviour and observed result. For a code change, explain the resulting behaviour and the checks you actually completed.

For interface work, follow the [design principles](/docs/design/principles/), the [Pebble UI and UX standard](/docs/design/pebble-ui-system/) and the owning app’s current UI contract. Shared rules are implemented in the published apps; examples and screenshots keep their actual version and test scope.

Builds and tests create local candidates. Freezing source/debug/Store archives, publishing an app or library, and deploying the website are separate steps. Follow the owning release workflow when that work is authorized; a successful build alone is not publication.

Check the [project licences and source links](/docs/project/licensing/) before reusing code. The current Pebble projects use PolyForm Noncommercial 1.0.0. Each project retains its own terms; a planned Android product does not inherit a licence from the XOCE name.
