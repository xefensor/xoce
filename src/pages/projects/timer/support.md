---
layout: ../../../layouts/PolicyLayout.astro
title: "Timer support"
description: "Setup help and issue reporting for Timer."
project: timer
---

## Set up Timer

Start with the [setup guide](/docs/pebble/setup/#timer). For missing readings, permissions or connection problems, see [troubleshooting](/docs/pebble/troubleshooting/).

## Alarm sound

On Time 2, enable **Alarm sound** in Timer’s phone settings and check system mute and Quiet Time. Sound is independent of the display settings. Round 2 has no supported speaker in this build and uses vibration. Timer’s on-watch alarm and acknowledgement controls remain available.

## Report a problem

[Open an issue](https://github.com/xefensor/pebble-app-timer/issues). Include the app version, your watch model and firmware, your phone and Pebble app versions, what happened, and the steps to reproduce it.

Remove private notification text, names, exact locations and installation identifiers from reports and screenshots.

Timer owns its countdowns and alarms on the watch. If it says **Alarm not set; keep open**, keep it open and follow the [alarm troubleshooting steps](/docs/pebble/troubleshooting/#timer-reports-alarm-not-set-keep-open).

## Downloads

The [product page](/projects/timer/) links to the current published version in Pebble Store and its matching GitHub PBW. For earlier versions, see [GitHub releases](https://github.com/xefensor/pebble-app-timer/releases).
