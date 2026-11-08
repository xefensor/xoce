---
layout: ../../../layouts/DocLayout.astro
title: Set up your Pebble
description: Install the Pebble development builds, configure activities and choose Quick Launch shortcuts.
section: For users
order: 2
---

This guide covers the published Pebble downloads. The watch builds target **Pebble Time 2** (`emery`); ČHMÚ Weather runs inside the phone app. Use the official **Pebble phone app** to install and configure them. The planned XOCE Phone app is separate and is not required.

## Before installing

1. For a watchface or watch app, check that your watch is **Pebble Time 2**. Support for other models is not established.
2. For activities, readings and app opening, enable the Pebble phone app’s **plugin preview**. Allow the permissions needed by your chosen sources.
3. Use **Download** on the [app page](/projects/) to get its versioned `.pbw` file.
4. Open that file with the Pebble phone app and follow its installation flow.

Music and notification previews in Dynamic and Dashboard are currently **Android-only**. Other plugin features depend on the sources and permissions available in your Pebble phone app.

The linked GitHub release pages also contain source, debugging files and checksums; those are not the watch installation file.

## Timer

Install [Timer 0.14.5](/projects/timer/), then open it on the watch.

1. Choose **New timer**.
2. Set hours, minutes and seconds using Up, Select and Down.
3. Start the countdown. Timer saves the run on the watch, schedules its native alarm and shares its reported state with the phone.

Timer’s phone settings select Light/Dark watch appearance. Save stays open with a confirmed **✓ Saved** state. Timer creation, the duration editor and **More options** remain on the watch; you can keep up to eight saved timers.

If Timer reports an alarm or storage error, keep it open and follow the message on the watch. Seeing its countdown in another app does not confirm that its background alarm was set.

## Dynamic

Install [Dynamic 0.18.3](/projects/dynamic/) and choose it as your watchface.

1. Open Dynamic’s settings in the Pebble phone app.
2. Under **Content & priority → Activity priority**, enable the sources you want and reorder them.
3. Keep Timer visible while testing the first countdown. The first eligible activity becomes primary; the next becomes the compact secondary row.
4. Choose **Save settings** and wait for **✓ Saved**. The modern settings page stays open after confirmed phone persistence. Reopen settings to check your choices, then return to the watchface. Legacy return-URL submission remains a separate closing fallback.

Music and Notifications share this priority list. Notifications defaults to Off. Enable it deliberately and choose how much notification information to show.

For the two readings above the activities, configure slots 1–2 under **Complications** in the Pebble phone app. These are shared choices and can affect other watchfaces using those slots. Dynamic does not include its own weather provider; select an available source there.

Dynamic’s colour settings, activity order and visibility belong to Dynamic. Dashboard keeps its own choices.

## Open Activity

Install [Open Activity 0.3.3](/projects/open-activity/) if you want Quick Launch to open the app associated with an activity.

1. Open **Open Activity from the watch’s app list**. It stays on a setup screen.
2. Open its phone settings.
3. Choose a shortcut for **Primary activity** and a different shortcut for **Secondary activity**, or leave either unassigned.
4. Save the choices.
5. In the phone app’s Quick Launch settings, assign **Open Activity** to those same shortcuts.
6. Press Back on the watch and return to Dynamic.

For example, you can choose Hold Down for Primary and Hold Up for Secondary. These are choices, not hardcoded requirements. The app supports stock taps, holds and the listed button combinations; availability in system settings depends on your phone and firmware versions.

Use one connected watch for the supported launch setup. The current launch API does not let this helper select between multiple connected watches.

Open Activity uses **Dynamic’s recent displayed activities**. A missing or expired destination closes the helper. Secondary does not silently fall back to Primary.

## Dashboard

Install [Dashboard 0.6.3](/projects/dashboard/) and open it once on the watch so its phone runtime can discover available providers.

1. Open Dashboard’s phone settings.
2. Choose the activities you want and their order.
3. Add or edit your Pinned items. A pin can have a reading, a Select action and a Hold Select app destination.
4. Save and wait for the page’s confirmation. It stays open, and Save includes a pin editor you are still editing.

For a native app destination, choose **Hold Select → Open app** and select an app by name. PebbleOS apps such as Weather have named entries; their availability depends on the watch and OS. Store search can find other app names, but a result does not prove that app is installed on your watch.

You can assign Dashboard itself to a separate Quick Launch shortcut for opening the overview directly.

## Check the complete workflow

Start a timer, return to Dynamic and wait for its activity. Use your Primary shortcut to open Timer. Pause it in Timer, return to Dynamic, and check that the activity disappears after five minutes while the timer remains saved.

After changing settings, close and reopen the page to check the saved choices. The current modern settings pages keep Save open with confirmation. Legacy return-URL fallbacks close after submission. If a page reports an uncertain or failed save, preserve your draft and follow its retry or saved-state recovery controls.

Need help? [Troubleshoot activities and settings](/docs/pebble/troubleshooting/).

## Halftone

Install [Halftone 1.9.0-rc.6](/projects/halftone/) and select it as your watchface.

1. Enable the Pebble phone app’s plugin preview where required.
2. In the phone app’s global **Complications** settings, choose slots 1–2. Halftone keeps the first on the left and the second on the right.
3. Open Halftone’s settings to choose colours, clock format, **Bigger Text**, effects and optional dynamic content. Save your choices.
4. Allow the permissions needed by your selected reading sources. Notification summaries and message text start disabled; enable them deliberately.

Both readings stay visible above music, a new notification or native Timeline Peek. This public rc.6 does not include Timer or generic activity integration. Its [tagged guide](https://github.com/xefensor/halftone-watchface/blob/v1.9.0-rc.6/README.md) documents the released behaviour.

## ČHMÚ Weather

Install [ČHMÚ Weather 1.0.1](/projects/chmu-weather/) by opening its `.pbw` with a Pebble phone app that supports plugins. The plugin runs on the phone and does not add a watch app.

1. Allow **Location** and internet access to `data-provider.chmi.cz`, `opendata.chmi.cz` and `api.open-meteo.com` through Pebble’s permission flow.
2. Under **Weather → Weather provider**, select **ČHMÚ Weather** to supply Pebble’s Weather app and Timeline. The exact menu labels depend on your phone app version.
3. Open the plugin settings and refresh. Choose a fixed nearby station or leave station selection on Automatic. Pebble’s saved weather locations and units are used.
4. For a watchface, choose a compatible weather reading and provider in Pebble’s global **Complications** settings. Dynamic and Halftone use the first two choices.

ČHMÚ station measurements and public ALADIN forecasts focus on Czechia. Open-Meteo completion is optional. The plugin identifies measurement and forecast timestamps; a fallback forecast does not become a fresh station measurement. Read the [public plugin guide](https://github.com/xefensor/pebble-chmu-weather/blob/v1.0.1/README.md) for coverage and available fields.
