---
layout: ../../../layouts/DocLayout.astro
title: Activities — a timer on your watchface
description: See what Activities mean, show a Timer countdown on Dynamic or Halftone, and return to the app that controls it.
section: For users
order: 3
setupProducts: [timer, dynamic, halftone, dashboard, open-activity]
---

Start a countdown in **Timer**, then return to **Dynamic or Halftone** to see the time remaining on your everyday clock screen. Timer continues to run the countdown and handle its alarm.

That shared update is called an **activity**. It describes something happening now: a countdown, the song you are listening to or an optional notification. Compatible apps choose how to display it.

Start with Timer and one of those watchfaces. You can add Dashboard for an overview or Open Activity for a shortcut later. Activities support depends on the apps you choose; there is no separate Activities app or library to install.

## Try a timer on your watchface

The [illustrated setup](/docs/pebble/setup/#illustrated-first-setup) shows where to find activity priority and how phone saving differs from watch delivery.

You need **Timer and either Dynamic or Halftone**, the official Pebble phone app with plugin support enabled, the required permissions and a connected phone. [Enable shared information](/docs/pebble/setup/#enable-shared-information), then:

1. Choose Dynamic or Halftone as your active watchface in the Pebble phone app.
2. Open that watchface’s settings. Under **Activities** in Dynamic, or **Content & priority** in Halftone, turn on **Show activity plugins**. In **Activity priority**, turn on **Show** for Timer. To give its countdown the large area, move it above competing sources: in Dynamic choose **Reorder**, use the arrows and choose **Done**; Halftone shows the **Move up / Move down** controls directly.
3. Choose **Save** and wait for **✓ Saved**. That confirms the settings are saved on the phone; any separate watch-delivery message describes whether display settings have reached the watch.
4. On the watch, open Timer and choose **New**. Minutes are selected first. Use Up or Down to set **12**, press Select to move to seconds, then press Select again to start with zero seconds. The new editor defaults to ten minutes, so two Up presses give twelve. [Timer controls](/docs/pebble/controls/#timer).
5. From the countdown screen, press **Back twice**: once to the Timer list, then again to your watchface. With the phone connected, its activity area should show the remaining time.

**Timer still runs the countdown and handles the alarm.** The watchface displays its information. Open Timer from the app list to pause, resume or acknowledge it. Timer also works on its own without activity sharing or a connected phone; successfully scheduled alarms remain on the watch.

## Large activity and smaller row

Dynamic and Halftone can show a large **Primary activity** and a compact **Secondary activity**. The first eligible activity in your chosen order gets the large area; the next can appear in the smaller row when the current layout has room. For example, Timer can occupy the large area while music appears below it. A visible Primary does not guarantee that a Secondary is currently displayed.

Each watchface keeps its own activity order and visibility choices. Dashboard has a separate order: its overview shows one activity, and holding Up opens the full Activities list. Dashboard does not currently pause or resume Timer countdowns.

## Return with a shortcut

**Open Activity is optional.** Choose **Watchface → Dynamic** or **Halftone** in its settings, pick a shortcut for **Primary activity** and optionally a different one for **Secondary activity**, then Save. Assign **Open Activity** to the same shortcuts in Pebble’s **Quick Launch** settings and allow **Launch apps**. With the countdown visible, the matching shortcut can open Timer. It opens the whole app, not a particular saved timer. [Set up Open Activity](/docs/pebble/setup/#open-activity).

Launching Open Activity from the app list opens its setup screen. A shortcut needs a recent, valid activity with an associated installed app, plugin support and a connected phone. Use one connected watch. Open Activity reads the source you chose; update its **Watchface** setting when switching between Dynamic and Halftone. It does not detect that switch automatically. A missing Secondary does not fall back to Primary. If there is nothing to open, it returns to the watchface.

## Readings and notifications

Small **readings**, such as temperature or battery level, use separate settings. Choose the watchfaces’ readings in Pebble’s **Settings → Plugins → Complications**. ČHMÚ Weather supplies weather readings rather than Timer-style activities. Dashboard readings are configured as pinned items.

Built-in music and notification sources require Android and the relevant permissions. New notification activities start off in Dynamic and Halftone. Dashboard instead has **Show latest notification** enabled by default, with **Show notification message text** off. These previews remain separate from Pebble’s system notifications and its full notification history.

Dynamic and Halftone display music; use Pebble’s Music app for playback controls from those watchfaces. Dashboard can play or pause music when its source supplies that action, and Hold Select opens the Music app for further controls.

## When an activity disappears

Sharing updates between apps needs the phone connection, plugin support and source permissions. Missing, expired or unavailable activities can leave the display without changing the original timer. A paused timer’s shared activity disappears after five minutes, but its saved timer remains in Timer. Choose **Done** in Timer to acknowledge a finished countdown.

If the countdown never appears, check that Timer is installed, activity plugins are enabled, Timer is visible in the active watchface’s list and your changes are saved. [Activity troubleshooting](/docs/pebble/troubleshooting/#an-activity-is-missing).
