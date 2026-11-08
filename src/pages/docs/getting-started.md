---
layout: ../../layouts/DocLayout.astro
title: Getting started
description: Install the current Pebble apps, try a timer on your watchface and find help for your next task.
section: For users
order: 1
---

This guide covers **Dynamic**, **Halftone**, **Dashboard**, **Timer**, **Open Activity** and the **ČHMÚ Weather** phone plugin. Install the apps you need; there is no separate XOCE app or library service to install.

## Current Pebble builds

The watch downloads target **Pebble Time 2** (`emery`, 200 × 228). Support for other watch models is not established. ČHMÚ Weather runs in the Pebble phone app; check each download’s release status and requirements.

Activity sharing and app opening need the official **Pebble phone app with plugin preview enabled**, a connection and the permissions required by the sources you choose. Music and notification previews in Dynamic and Dashboard are currently Android-only. The planned XOCE Phone app is not required.

## A useful first setup

Try a countdown in Timer, then follow it on Dynamic:

1. Download [Timer](/projects/timer/) and [Dynamic](/projects/dynamic/) from their app pages. Open each `.pbw` file with the Pebble phone app to install it.
2. Open Timer on the watch, choose **New timer**, set a duration and start it.
3. Choose Dynamic as your watchface. Open its phone settings and enable Timer under **Content & priority → Activity priority**, then Save.
4. Return to Dynamic and check that the countdown appears. Timer owns the alarm; the watchface shows its shared activity.
5. If you want a shortcut back to Timer, [set up Open Activity](/docs/pebble/setup/#open-activity). Choose a Primary shortcut and assign Open Activity to the same system Quick Launch button.

Use the [complete setup instructions](/docs/pebble/setup/) for permissions, readings, activity order and Quick Launch. For everyday button actions, go to [Watch controls](/docs/pebble/controls/).

## Choose what you need

| If you want to… | Use |
| --- | --- |
| See the time, readings and ongoing activities | [Dynamic](/projects/dynamic/) |
| Keep two readings beside a wide clock and dotted border | [Halftone](/projects/halftone/) |
| Add Czech weather measurements and forecasts to Pebble | [ČHMÚ Weather](/projects/chmu-weather/) |
| Start and manage countdowns on the watch | [Timer](/projects/timer/) |
| Browse an activity, notifications and pinned items | [Dashboard](/projects/dashboard/) |
| Open the app associated with Dynamic’s displayed activity | [Open Activity](/projects/open-activity/) |

Activities and Core are developer libraries bundled into their consuming apps. You do not install them separately on the watch.

## Add Dashboard when you want an overview

Dashboard is a separate watch app with one current activity, a notification shortcut and two pinned items in its opening view. Pins can show readings, perform actions or open apps. Dashboard keeps its own activity order, independent of Dynamic.

[Set up Dashboard](/docs/pebble/setup/#dashboard) or [learn its controls](/docs/pebble/controls/#dashboard).

## What to expect

- Dynamic can show any eligible activity in its primary area or compact secondary row. Text stays still and cuts off when it does not fit.
- A paused timer leaves activity views after five minutes but remains saved in Timer. Choose **Done** in Timer to dismiss a finished run.
- Open Activity opens the associated app as a whole. To pause or resume a timer, open Timer; Dashboard does not currently offer those controls.

If something is missing or a setting does not stick, use [Troubleshooting](/docs/pebble/troubleshooting/).

## Choose your platform

The instructions above cover the available Pebble apps. The [Phone plan](/projects/phone/) describes the next Android app and its optional Pebble companion. There is no Android installation guide yet.

For development, [build an activity provider](/docs/develop/activities/), [integrate shared readings with Core](/docs/develop/core/) or find the [build and contribution instructions](/docs/develop/building/).

## Next steps

[Install and configure the watch apps](/docs/pebble/setup/) · [Watch controls](/docs/pebble/controls/) · [Troubleshooting](/docs/pebble/troubleshooting/)
