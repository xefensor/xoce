---
layout: ../../../layouts/DocLayout.astro
title: Troubleshooting
description: Find help with missing activities, settings, permissions and Quick Launch handoff.
section: For users
order: 4
setupProducts: [timer, dynamic, halftone, dashboard, open-activity]
---

Check the version on the affected [app page](/projects/) first. The native launch products target **Time 2** (`emery`) and **Round 2** (`gabbro`). Activity sharing uses the official Pebble phone app’s plugin preview, not the planned XOCE Phone app.

## An activity is missing

An activity is an ongoing update, such as a Timer countdown shown on Dynamic or Halftone. [Set up the Timer example first](/docs/pebble/activities/#try-a-timer-on-your-watchface).

1. Check that the watch and phone are connected and the Pebble phone app’s plugin preview is enabled.
2. Open the source app. For Timer, start or resume a countdown on the watch.
3. Check permissions for the app or watchface where the data should appear, and any permissions its chosen provider needs, in the Pebble phone app.
4. In the app displaying the activity, check its own list: **Activities → Activity priority** in Dynamic, **Content & priority → Activity priority** in Halftone, or **Activity priority** in Dashboard. Enable Timer or the intended provider there. The watchfaces label that checkbox **Show**; Dashboard labels it with the provider’s name. Dynamic and Halftone also need **Show activity plugins** on for Timer.
5. Return to the consuming app and allow the updated source state to arrive.

Dynamic, Halftone and Dashboard each keep their own priority and visibility choices. Enabling or reordering a provider in one does not change the others. Save changes and return to the app or watchface where you want to see them.

Music and notification previews are currently Android-only. If a source stops supplying valid data, its activity disappears rather than continuing to show an old value.

## A paused timer disappeared

This is expected after five minutes. The timer stays saved in Timer, but its activity stops occupying the watchface or activity overview. Resume it or explicitly edit its duration to publish a fresh visible state.

The countdown reaching zero on a consuming app is not proof that Timer has completed or that its alarm sounded. Timer owns that state.

## A finished timer is still visible

Open Timer and choose **Done**. The acknowledgement must reach the phone before other apps can withdraw the activity. If the phone was disconnected, reopen Timer when connected to reconfirm its native state.

Do not reset app data as a first troubleshooting step; that would discard useful saved settings or timers.

## Open Activity immediately closes

That is the expected result when the chosen activity has no valid app destination. Check that:

- **Watchface** in Open Activity settings matches the source you intend to use: Dynamic or Halftone. Change it manually when switching watchfaces.
- That selected watchface has recently displayed an activity in the selected Primary or Secondary position.
- The associated watch app is installed.
- Open Activity has **Launch apps** permission.
- The phone is connected and plugin support is enabled.
- Your phone settings and Pebble’s Quick Launch assignment refer to the same shortcut.
- Only one watch is connected for the supported launch setup.

Return to the selected Dynamic or Halftone watchface, wait for the intended activity and try the shortcut again. Open Activity uses that manually selected source’s recent destination; launching it cannot refresh old activity data or detect which watchface you were using. An absent Secondary does not open Primary instead.

## I cannot reach Open Activity’s settings

Open **Open Activity from the watch’s app list**, leave its setup screen open, then open its settings in the phone app. Use Back on the watch when you finish.

Use the configured Quick Launch shortcuts for activity handoff, rather than the normal app-list launch.

## Settings seem not to save

- **Dynamic and Halftone:** the modern page stays open while Saving… changes to **✓ Saved** after confirmed phone persistence. A legacy return-URL route can close instead; reopen settings to check that fallback.
- **Dashboard and Open Activity:** wait for the page’s saved confirmation. If loading fails or saving is uncertain, keep your draft and use the page’s retry or saved-state recovery controls. Dashboard’s global Save includes the pin currently open in its editor.
- **Timer:** watch-display and Alarm sound settings have separate Save controls. Timer creation, Reset and alarm controls remain on the watch.

The release versions covered by these instructions are shown in the version panel above. Check the affected product page if you installed an earlier release.

**✓ Saved** confirms phone persistence. It does not establish that display settings reached the watch, or that a native alarm was scheduled. Check the separate watch-delivery status, open the affected app while connected and use **Retry watch delivery** where offered. [Save-and-stay behavior](/docs/design/pebble-ui-system/#save-stays-open).

## Text size or appearance has not changed

For text, choose **Follow Pebble**, **Small**, **Medium** or **Large**, save, then reopen the app or watchface while connected. Follow Pebble text uses the watch’s own text size. A phone-saved choice can remain pending until the native app confirms it.

Automatic **Follow Pebble** appearance is unavailable in these builds: it keeps the last explicit Light/Dark choice. Choose **Light** or **Dark** in Timer, Dashboard or Open Activity. Dynamic and Halftone additionally offer **Follow Quiet Time** for their day/night palettes. Editing a palette or changing a settings-page preview does not itself change which palette is active on the watch.

Open Activity applies display preferences during its normal app-list setup launch, not as part of a Quick Launch handoff. Keep that setup screen open and check the watch-delivery status before leaving it.

## Dashboard cannot find an app

Choose a known entry under **PebbleOS apps** where appropriate. Native Weather does not require app-store search or a UUID.

Store search is explicit and needs Dashboard’s scoped Internet permission. After changing that permission, reopen its settings before searching again. A store result is a catalogue entry, not confirmation of installation. Advanced Custom app remains available for private or sideloaded destinations.

## Timer reports “Alarm not set; keep open”

Timer could not secure the background alarm. Keep the app open and follow the visible error. An activity appearing in Dynamic or a successful phone message does not establish that the native Wakeup was scheduled.

## Report a problem

Use the issue link on the affected [project page](/projects/). Include the app version, watch model, phone platform, steps to reproduce, expected result and actual result. Remove private notification text, song metadata and other personal content from screenshots or logs before sharing them.

Use the current source and issue links on the affected project page so the report reaches the repository maintained for that product.
