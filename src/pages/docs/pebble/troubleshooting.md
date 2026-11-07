---
layout: ../../../layouts/DocLayout.astro
title: Troubleshooting
description: Find help with missing activities, settings, permissions and Quick Launch handoff.
section: For users
order: 4
---

Check the version on the affected [app page](/projects/) first. The current downloads target **Pebble Time 2** (`emery`). Activity sharing uses the official Pebble phone app’s plugin preview, not the planned XOCE Phone app.

## An activity is missing

1. Check that the watch and phone are connected and the Pebble phone app’s plugin preview is enabled.
2. Open the source app. For Timer, start or resume a countdown on the watch.
3. Check the source’s permissions in the Pebble phone app.
4. In Dynamic or Dashboard, check that the activity is enabled and its priority is where you expect it.
5. Return to the consuming app and allow the updated source state to arrive.

Dynamic and Dashboard own separate priority lists. Enabling or reordering a provider in one does not change the other.

Music and notification previews are currently Android-only. If a source stops supplying valid data, its activity disappears rather than continuing to show an old value.

## A paused timer disappeared

This is expected after five minutes. The timer stays saved in Timer, but its activity stops occupying the watchface or activity overview. Resume it or explicitly edit its duration to publish a fresh visible state.

The countdown reaching zero on a consuming app is not proof that Timer has completed or that its alarm sounded. Timer owns that state.

## A finished timer is still visible

Open Timer and choose **Done**. The acknowledgement must reach the phone before other apps can withdraw the activity. If the phone was disconnected, reopen Timer when connected to reconfirm its native state.

Do not reset app data as a first troubleshooting step; that would discard useful saved settings or timers.

## Open Activity immediately closes

That is the expected result when the chosen activity has no valid app destination. Check that:

- Dynamic has recently displayed an activity in the selected position.
- The associated watch app is installed.
- Open Activity has **Launch apps** permission.
- Your phone settings and Pebble’s Quick Launch assignment refer to the same shortcut.
- Only one watch is connected for the supported launch setup.

Return to Dynamic, wait for the intended activity and try the shortcut again. Open Activity uses a recent destination; launching it cannot refresh old activity data. An absent Secondary does not open Primary instead.

## I cannot reach Open Activity’s settings

Open **Open Activity from the watch’s app list**, then open its settings in the phone app. Version 0.3.3 keeps a normal launch open on a static setup screen. Use Back on the watch when you finish.

Use the configured Quick Launch shortcuts for activity handoff, rather than the normal app-list launch.

## Settings seem not to save

- **Dynamic 0.18.3:** the modern page stays open while Saving… changes to **✓ Saved** after confirmed phone persistence. Legacy return-URL submission closes; reopen settings to check that fallback.
- **Dashboard 0.6.3 and Open Activity 0.3.3:** settings stay open. Wait for the page’s saved confirmation, then close and reopen to check the result. If loading fails or saving is uncertain, preserve your draft and use the page’s retry or saved-state recovery controls.
- **Timer 0.14.5:** the phone page selects Light/Dark watch appearance and keeps confirmed Save open. Timer creation, Reset and alarm controls remain on the watch.

Dashboard 0.6.3 and Open Activity 0.3.3 include fixes for choices being overwritten when the Android phone runtime closes. Dashboard’s global Save also includes the pin currently open in its editor.

The [shared Save-and-stay design](/docs/design/pebble-ui-system/#save-stays-open) is included in the current published downloads. Phone persistence confirmation does not establish watch delivery or native alarm acceptance.

## Dashboard cannot find an app

Choose a known entry under **PebbleOS apps** where appropriate. Native Weather does not require app-store search or a UUID.

Store search is explicit and needs Dashboard’s scoped Internet permission. After changing that permission, reopen its settings before searching again. A store result is a catalogue entry, not confirmation of installation. Advanced Custom app remains available for private or sideloaded destinations.

## Timer reports “Alarm not set; keep open”

Timer could not secure the background alarm. Keep the app open and follow the visible error. An activity appearing in Dynamic or a successful phone message does not establish that the native Wakeup was scheduled.

## Report a problem

Use the issue link on the affected [project page](/projects/). Include the app version, watch model, phone platform, steps to reproduce, expected result and actual result. Remove private notification text, song metadata and other personal content from screenshots or logs before sharing them.

The old repository names are retained as read-only historical archives. New issues belong in the maintained repositories linked from this site.
