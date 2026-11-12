---
layout: ../../layouts/DocLayout.astro
title: Getting started
description: Choose your apps, check your Pebble and get your first countdown onto your watchface.
section: For users
order: 1
---

XOCE is Xef’s independent software project. Today you can try two watchfaces and three watch apps for **Pebble Time 2**, plus the optional **ČHMÚ Weather** phone plugin. You can use the pieces you need; there is no separate XOCE app or library service to install.

## New to Pebble?

Pebble is the watch platform. The **official Pebble phone app** connects your watch to Android or iPhone and manages its apps and settings.

1. [Get the official Pebble phone app](https://repebble.com/app).
2. Open it and follow its setup to pair your watch. Pebble’s [phone-app installation guide](https://help.repebble.com/en/articles/14489632-installing-the-pebble-app) links to further setup help.
3. Check your watch model. The XOCE watchface and watch-app downloads are for **Pebble Time 2 only**; other models are not included. ČHMÚ Weather runs in the phone app and follows Pebble’s weather/plugin support.

A **watchface** is your everyday clock screen. A **watch app** is something you open from the watch’s app list. Dynamic and Halftone are watchfaces; Timer, Dashboard and Open Activity are watch apps. ČHMÚ Weather is a plugin running inside the Pebble phone app. [See the watch buttons and basic terms](/pebble/#watch-buttons).

## Choose what you need

| What would you like to do? | Install | Optional additions |
| --- | --- | --- |
| Use a clock with weather and ongoing updates | [Dynamic](/projects/dynamic/) | Timer for countdowns |
| Use a dotted-border clock with two large readings | [Halftone](/projects/halftone/) | ČHMÚ Weather or another compatible source |
| Get Czech weather for Pebble and compatible readings | [ČHMÚ Weather](/projects/chmu-weather/) | Choose it as your weather provider or reading source |
| Set and reuse countdowns | [Timer](/projects/timer/) | Dynamic to see the countdown on your watchface |
| Open an overview with readings and shortcuts | [Dashboard](/projects/dashboard/) | Configure the pins you find useful |
| Use a button shortcut to open Dynamic’s current app | [Open Activity](/projects/open-activity/) **and Dynamic** | Configure a second shortcut for the smaller activity row |

**Start with Timer + Dynamic** if you want to try how the apps work together. Dashboard, Open Activity and ČHMÚ Weather can wait until later. Halftone is an alternative watchface; its released candidate does not show Timer activities.

## Current Pebble builds

The watch downloads are **development builds or release candidates**, so expect rough edges. ČHMÚ Weather is a separate public plugin release. Install the official Pebble phone app’s latest available version before starting.

| Your phone or connection | What to expect |
| --- | --- |
| Android | Music and notification previews are available in Dynamic, Halftone and Dashboard, with the required permissions. |
| iPhone / iOS | Music and notification previews are not supported in these XOCE releases. Other features depend on available plugins and permissions. |
| Watch disconnected from phone | Timer keeps its successfully scheduled alarm on the watch. Sharing updates with Dynamic or Dashboard needs the phone connection. |

The planned XOCE Android Phone app is not required. Your watch and phone do not need a different operating system.

## A useful first setup

Your goal: **start a one-minute countdown in Timer and see it on Dynamic**.

1. Follow [Before installing](/docs/pebble/setup/#before-installing). It covers the phone app, plugin preview and opening the downloaded files.
2. Install [Timer](/projects/timer/) and [Dynamic](/projects/dynamic/). Each **Download .pbw** button gets the watch installation file. Open it with the Pebble phone app.
3. On the watch, open Timer, choose **New timer**, set one minute and start it. Use the [button guide](/pebble/#watch-buttons) if you are unsure which button to press.
4. In the Pebble phone app, choose Dynamic as your watchface. Open Dynamic’s settings using its settings gear.
5. Under **Content & priority → Activity priority**, enable Timer. Choose **Save settings** and wait for **✓ Saved**.
6. Return to Dynamic on the watch. Keep your phone connected and check that the countdown appears.

**Success looks like this:** Timer’s countdown also appears on your everyday clock screen. Timer still handles the alarm. If the countdown is missing, use [the activity checklist](/docs/pebble/troubleshooting/#an-activity-is-missing).

You can stop here. To change a countdown, open Timer from the watch’s app list. [Open Activity](/docs/pebble/setup/#open-activity) is an optional shortcut for returning to it more quickly.

## Try Halftone or Czech weather

[Halftone](/projects/halftone/) offers a different everyday clock with a halftone dot border, configurable colours and two readings. Choose one active watchface at a time. [Set up Halftone](/docs/pebble/halftone/).

[ČHMÚ Weather](/projects/chmu-weather/) is an unofficial weather plugin for Czech locations. It works with Pebble Weather and compatible readings in Dynamic, Halftone and Dashboard. It is optional and needs no API key or separate Android app. [Set up the weather source](/docs/pebble/chmu-weather/).

## Add Dashboard when you want an overview

[Dashboard](/projects/dashboard/) is a separate app you open on the watch. Its opening view has one current activity, a notification shortcut and two pinned items. A pin can show a reading, perform an available action or open an app.

The kitchen light and other readings in the screenshots are examples. What you can choose depends on the plugins you have installed and configured. Dashboard keeps its own activity order, separate from Dynamic.

[Set up Dashboard](/docs/pebble/setup/#dashboard) when you are ready.

## What to expect

- A paused timer leaves the shared activity view after five minutes but stays saved in Timer.
- Choose **Done** in Timer to dismiss a finished countdown.
- Dashboard does not currently pause or resume timers. Open Timer to do that.
- Dynamic’s two small readings are selected under **Settings → Plugins → Complications** in the Pebble phone app. Those choices can also affect other watchfaces.

## Choose your platform

The watch downloads above are for Pebble Time 2; ČHMÚ Weather is a phone plugin. Android and KDE Plasma are part of XOCE’s wider direction; cross-device timer synchronization is a future goal. [Read about the project](/about/).

## Next steps

[Full setup instructions](/docs/pebble/setup/) · [Watch controls](/docs/pebble/controls/) · [Troubleshooting](/docs/pebble/troubleshooting/)
