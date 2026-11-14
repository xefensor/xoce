---
layout: ../../../layouts/DocLayout.astro
title: Set up Halftone
description: Choose a dotted-border clock, configure its two readings and make the appearance yours.
section: For users
order: 3
---

[Halftone](/projects/halftone/) is an alternative everyday clock to Dynamic. Its dot border, large clock and two readings have their own appearance. You can keep both watchfaces installed and choose which one is active.

This guide describes **Halftone 1.10.1** for **Time 2 and Round 2**. Halftone can display Timer and other compatible activities, and works with Open Activity. Check its product page for release status.

## Install and choose the watchface

1. Set up the [official Pebble phone app](https://repebble.com/app) and pair your Time 2 or Round 2.
2. In the phone app, enable **Settings → Plugins → Plugins/permissions preview** for shared readings. Labels can vary between phone-app versions.
3. Once the release is published, open its Pebble Store listing from the [Halftone product page](/projects/halftone/) and install it. A matching `.pbw` will also be available for manual installation. See the [Android and iPhone file-opening instructions](/docs/pebble/setup/#before-installing) if needed.
4. Choose Halftone in the phone app’s Watchfaces section to make it your active clock screen.

Clock and date remain native watch functions. Weather and other shared readings depend on your phone, its available plugins and their permissions.

## Choose your two readings

In the Pebble phone app, open **Settings → Plugins → Complications** and choose the **first two** entries. Halftone displays the first on the left and the second on the right. Choices 3–5 are not used by this release.

For a weather arrangement, try **temperature** and **precipitation probability**. You can use [ČHMÚ Weather](/projects/chmu-weather/) for Czech locations or another compatible weather source. ČHMÚ is optional, not bundled with Halftone.

These are shared choices: changing them can also change readings in Dynamic and other watchfaces using the same slots. Weather units and refresh timing come from your selected source.

## Change the appearance

Open Halftone’s settings using its gear icon in the Pebble phone app. Choose colours, **Big text**, text shadow and the three- or four-step dot border, then save.

The two readings make room for music or a new notification while remaining visible. Both also remain above Pebble’s native Timeline Peek panel. Long text fits down or ends in an ellipsis.

## Music and notifications

Music and notification sources in this release require **Android**. Allow the relevant permissions through Pebble. Music is enabled by default; notification summaries and message text are **off** by default.

If you enable notifications, choose how much private information should appear on the watch. You can filter the displayed apps in Halftone’s settings. Playback controls remain in Pebble’s Music app; Halftone has no custom watch-button controls.

## Add Timer and other activities

Open Halftone’s settings and choose which activities appear and their priority. Enable Timer, start a countdown on the watch, then return to Halftone with the phone connected. The primary activity uses the larger lower area; the secondary activity stays in its compact row.

For shortcuts, choose **Halftone** as the watchface in [Open Activity settings](/docs/pebble/setup/#open-activity), then match its Primary/Secondary shortcuts to Pebble Quick Launch.

## If a reading is missing

- Confirm your watch and phone are connected and plugin preview is enabled.
- Check the first two Complications choices and the selected source’s settings and permissions.
- A missing or unusable reading shows `--`. Choose a current value rather than a forecast series.
- If using ČHMÚ, check its [weather-source setup](/docs/pebble/chmu-weather/). A location without usable Czech coverage may not supply a reading.

Clock and date continue without the phone. This candidate can retain its selected readings for up to two hours, subject to the source’s earlier expiry. Music and notification context disappears on disconnection.

[Halftone download and source](/projects/halftone/) · [Watch controls](/docs/pebble/controls/#halftone)

## Understand Activities

An activity is an ongoing update, such as a countdown. Start a timer in Timer, return to Halftone, and see its remaining time while Timer continues to handle the countdown and alarm. In Halftone settings, turn on **Show activity plugins**, show Timer in **Activity priority**, and save. [Follow the complete Activities guide](/docs/pebble/activities/).
