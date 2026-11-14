---
layout: ../../layouts/DocLayout.astro
title: Getting started
description: Start with a timer on your watch, then add a watchface and the connections you want.
section: For users
order: 1
setupProducts: [timer, dynamic, halftone, dashboard, open-activity, chmu-weather]
---

XOCE is Xef’s collection of small apps. The watchfaces and watch apps here support **Pebble Time 2 and Round 2**. ČHMÚ Weather is a separate phone plugin. Each piece has its own job; start with one and add the others when useful.

## New to Pebble?

1. [Get the official Pebble phone app](https://repebble.com/app) for Android or iPhone, open it and pair your watch. Pebble’s [installation guide](https://help.repebble.com/en/articles/14489632-installing-the-pebble-app) covers the phone app.
2. Choose an app from the [Software catalogue](/projects/), open its product page, then select **View in Pebble Store**. Install the version listed on that page so its settings match these guides.
3. After installing a watch app, open it from the watch’s app list with **Select**, the middle-right button. A watchface becomes your everyday clock screen. [See all four buttons](/pebble/#watch-buttons).

The official Pebble app handles installation, pairing and settings. There is no separate XOCE app or Activities library to install.

## Choose what you need

| Your goal | Start with | Add later |
| --- | --- | --- |
| Set and reuse countdowns | [Timer](/projects/timer/) | A watchface to keep the countdown in view |
| A flexible clock with readings | [Dynamic](/projects/dynamic/) | Timer, music or other Activities |
| A bold clock with a dotted border | [Halftone](/projects/halftone/) | Timer or another compatible data source |
| Czech observations and forecasts | [ČHMÚ Weather](/projects/chmu-weather/) | Select it as a weather provider or reading source |
| An overview of updates and readings | [Dashboard](/projects/dashboard/) | Your chosen pins and shortcuts |
| A shortcut back to the app behind an activity | [Open Activity](/projects/open-activity/) with Dynamic or Halftone | A second shortcut for the smaller activity row |

**Timer is the simplest first check.** Its countdown and successfully scheduled alarm run on the watch. Add Dynamic or Halftone when you want to see that countdown on your clock screen.

## A useful first setup

### 1. Try Timer on its own

Follow [Timer’s setup steps](/docs/pebble/setup/#timer) to create a one-minute countdown. Try pausing and resuming it, then choose **Done** when it finishes.

**Check:** Timer shows the remaining time and keeps the saved duration for reuse. If it says **Alarm not set; keep open**, follow [the alarm help](/docs/pebble/troubleshooting/#timer-reports-alarm-not-set-keep-open) before leaving the app. No activity-sharing setup is needed for this check.

### 2. Keep a countdown on your watchface

1. Choose [Dynamic](/docs/pebble/setup/#dynamic) or [Halftone](/docs/pebble/halftone/), and finish its phone-settings setup first.
2. Enable shared information, show Timer in the watchface’s **Activity priority**, and save. **✓ Saved** confirms phone storage; wait for watch delivery if the page reports it as pending.
3. Now start a **12-minute** timer. From Timer’s detail screen, press Back to the list, then Back again to return to the watchface. Keep the phone connected.

**Check:** the watchface shows the remaining time while Timer still owns the countdown and alarm. The longer example gives you time to try the connection. [If the countdown is missing](/docs/pebble/troubleshooting/#an-activity-is-missing).

You can stop here. Open Timer from the app list to change a countdown. Open Activity is an optional shortcut; Dashboard and ČHMÚ Weather can be added independently.

## What is an activity?

An **activity** is an update about something happening now: a countdown, music or a notification preview. Compatible apps choose how to display it. Timer’s activity can appear in Dynamic, Halftone or Dashboard; the original Timer app still runs it and handles its controls.

Small weather or battery **readings** use separate settings. Pebble calls these **Complications**. [Understand readings and Activities](/docs/pebble/activities/).

## Current Pebble builds

The version list above follows the product pages. Check it before using these instructions with an older build.

| Your setup | What to expect |
| --- | --- |
| Android | Built-in music and notification sources are available with the relevant permissions. |
| iPhone / iOS | These releases do not support built-in music and notification previews. Other sources depend on available plugins and permissions. |
| Phone disconnected | Timer keeps its countdown and successfully scheduled alarm. Sharing updates with another app needs the connection. |

Plugin support is needed for shared readings and Activities. Enable it when you reach that setup step, then allow the permissions for the sources you choose. [Enable shared information](/docs/pebble/setup/#enable-shared-information).

## Try Halftone or Czech weather

[Halftone](/docs/pebble/halftone/) is an alternative to Dynamic. You can install both and choose one active watchface. When switching between them, change Open Activity’s selected source if you use that helper.

[ČHMÚ Weather](/docs/pebble/chmu-weather/) supplies Czech weather inside the phone app. It has no watch screen, API key or separate Android app. Configure it first, then select its weather source in Pebble.

## Add Dashboard when you want an overview

[Dashboard](/docs/pebble/setup/#dashboard) opens as a watch app. It brings together an activity, a notification panel and two pinned items, with full collections behind them. Start with an available phone-battery or weather reading. Pins are Dashboard’s readings and shortcuts, separate from timeline pins.

## What to expect

- A paused timer leaves the shared activity view after five minutes but stays saved in Timer.
- Dashboard shows Timer’s information; pause and resume remain in Timer.
- Dynamic and Halftone use shared Complications choices. Changing them can affect both watchfaces.
- Screenshots and settings previews use example data. Available readings and actions depend on your configured sources.

## Choose your platform

These guides cover the Pebble products above. The planned XOCE Android Phone app is separate, and Android/KDE Plasma work is part of the wider project. [About XOCE](/about/).

## Next steps

[Full setup instructions](/docs/pebble/setup/) · [Watch controls](/docs/pebble/controls/) · [Troubleshooting](/docs/pebble/troubleshooting/)
