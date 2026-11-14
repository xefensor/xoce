---
layout: ../../../layouts/DocLayout.astro
title: Activities — a timer on your watchface
description: See what Activities mean, show a Timer countdown on Dynamic or Halftone, and return to the app that controls it.
section: For users
order: 3
---

An **activity** is an update about something happening now, such as a countdown, a song or a new notification. Compatible XOCE apps and watchfaces can display it. You can leave Timer and still see the time remaining on your everyday clock screen.

Activities connect compatible apps; support depends on the app and watchface you choose. This does not add a countdown to every Pebble watchface, and there is no separate Activities app or library to install.

## Try a timer on your watchface

You need **Timer and either Dynamic or Halftone**, the official Pebble phone app with plugin support enabled, the required permissions and a connected phone. [Complete the shared setup](/docs/pebble/setup/#before-installing), then:

1. Choose Dynamic or Halftone as your active watchface in the Pebble phone app.
2. Open that watchface’s settings. Under **Content & priority**, turn on **Show activity plugins**. Show Timer in **Activity priority**. Move Timer above other activities to give it priority for the large area, then save.
3. On the watch, open Timer. Choose **New**, set one minute using Up, Down and Select, and start the countdown. [Timer controls](/docs/pebble/controls/#timer).
4. Return to your watchface. Its activity area should show the time remaining while the countdown continues in Timer.

**Timer still runs the countdown and handles the alarm.** The watchface displays its information. Open Timer from the app list to pause, resume or acknowledge it. Timer also works on its own without activity sharing or a connected phone; successfully scheduled alarms remain on the watch.

## Large activity and smaller row

Dynamic and Halftone can show a large **Primary activity** and a compact **Secondary activity**. The first available activity in your chosen order gets the large area; the next gets the smaller row. For example, Timer can occupy the large area while music appears below it.

Each watchface keeps its own activity order and visibility choices. Dashboard has a separate order: its overview shows one activity, and holding Up opens the full Activities list. Dashboard does not currently pause or resume Timer countdowns.

## Return with a shortcut

**Open Activity is optional.** Configure it for your chosen watchface and Primary or Secondary, then assign it to the matching Pebble Quick Launch shortcut. With the countdown visible, that shortcut can open Timer. It opens the whole app, not a particular saved timer. [Set up Open Activity](/docs/pebble/setup/#open-activity).

Launching Open Activity from the app list opens its setup screen. A shortcut needs a recent, valid activity with an associated installed app. If there is nothing to open, it returns to the watchface.

## Readings and notifications

Small **readings**, such as temperature or battery level, use separate settings. Choose the watchfaces’ readings in Pebble’s **Complications** settings. ČHMÚ Weather supplies weather readings rather than Timer-style activities. Dashboard readings are configured as pinned items.

Music and notification activities require Android and the relevant permissions. Notifications start off; message text is optional. Notification activities are previews in these apps; Pebble’s system notifications remain separate. Use Pebble’s Music app for playback controls.

## When an activity disappears

Sharing updates between apps needs the phone connection, plugin support and source permissions. Missing, expired or unavailable activities can leave the display without changing the original timer. A paused timer’s shared activity disappears after five minutes, but its saved timer remains in Timer. Choose **Done** in Timer to acknowledge a finished countdown.

If the countdown never appears, check that Timer is installed, activity plugins are enabled, Timer is visible in the active watchface’s list and your changes are saved. [Activity troubleshooting](/docs/pebble/troubleshooting/#an-activity-is-missing).
