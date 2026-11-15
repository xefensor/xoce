---
layout: ../../../layouts/DocLayout.astro
title: Set up your Pebble
description: Follow the illustrated Timer setup, show its countdown on a watchface, then add optional shortcuts and readings.
section: For users
order: 2
setupProducts: [timer, dynamic, halftone, dashboard, open-activity, chmu-weather]
illustratedSetup: true
---

New to XOCE? [Choose your apps first](/docs/#choose-what-you-need). Start with **Timer**, then add **Dynamic or Halftone** if you want a countdown on your everyday clock. Dashboard, Open Activity and ČHMÚ Weather are optional.

## Before installing

1. **Pair your watch:** get the [official Pebble phone app](https://repebble.com/app), open it and pair your **Time 2 or Round 2**. Follow Pebble’s [phone-app guide](https://help.repebble.com/en/articles/14489632-installing-the-pebble-app) if needed. These native builds do not include other watch models.
2. **Check availability and version:** open the app’s [product page](/projects/). Its release status and the version list above describe the build covered by this guide. A release in preparation has no verified installation button yet.
3. **Use the Store link when available:** choose **View in Pebble Store**, then install through the official phone app. Pebble’s buttons are **Add to Watch** for an app and **Start Watchface** for a watchface. [Official installation help](https://help.repebble.com/en/articles/14166032-adding-watchfaces-apps).
4. **Check the watch:** an app appears in its app list; a watchface can be selected as the clock. ČHMÚ Weather appears in the phone app’s Plugins list instead.

Older GitHub releases can have different settings. Use a matching version rather than substituting an older release for a prepared one. Source and debugging ZIP files are for development; a `.pbw` is the Pebble installation file.

### Optional manual installation

A verified **Download .pbw** link appears on the product page when offered for that release. Open that file with the official Pebble phone app and follow its prompt.

- <span id="android"></span>**Android:** try the browser’s download list or the Files app. If Pebble is not offered directly, check **Open with / Share**.
- <span id="iphone--ios"></span>**iPhone / iOS:** save the file to Files, then open its share sheet and look for **Pebble**, possibly under **More**.

File-opening choices vary by phone and app version. If Pebble is absent, check the official app is installed and current, then try from Files. This is an alternative to Store installation, not an additional step.

## Timer

**First complete [Before installing](#before-installing).** Timer’s countdown and successfully scheduled alarms work on the watch; the sharing setup below is optional.

1. Install [Timer](/projects/timer/) when the matching release is available. On the watch, press **Select** to open the app list and choose Timer.
2. Choose **New**; minutes are selected first. Use **Up/Down** to set **1**, press **Select** to move to seconds, leave them at zero, then press **Select** again to start. [All Timer controls](/docs/pebble/controls/#timer).
3. On the countdown screen, press **Select** to pause; press it again to resume.
4. When it finishes, choose **Done**. The saved duration remains available to start again. **Up** on the alarm screen snoozes for one minute.

**Check:** you can start, pause, resume and reuse the timer. If the watch reports **Alarm not set; keep open**, keep Timer open and follow [the alarm help](/docs/pebble/troubleshooting/#timer-reports-alarm-not-set-keep-open).

To return from a timer detail screen to the watchface, press **Back** to the timer list, then **Back** again. Timer’s phone settings select text size, Light/Dark watch appearance and **Alarm sound**. Sound is available on Time 2 and respects system mute and Quiet Time; Round 2 uses vibration. Timer creation and controls stay on the watch.

## Enable shared information

Complete this part when adding **shared readings, Activities or Open Activity**.

1. In the current official Pebble phone app, open **Settings → Plugins → Plugins / permissions preview** and enable it. The Plugins tab should appear in the Apps screen. Labels may vary with phone-app versions.
2. Keep the watch and phone connected. Open the relevant app or watchface’s settings using its gear in Pebble.
3. Allow the permissions needed by the sources or actions you choose. A prompt may appear when you first use an optional feature; return to the app after allowing it. Review permissions on that app’s page in Pebble.

**Check:** the phone offers the source or activity you want. Installing every XOCE app is unnecessary: choose Timer for a countdown, a weather source for weather, and app launching for Open Activity.

Built-in music and notification sources need **Android**. Other plugin features depend on the sources and permissions available on your phone. [Phone compatibility](/docs/#current-pebble-builds).

A saved confirmation records phone settings. Keep the watch connected and check the actual watch display too. If delivery is pending, use the page’s watch-delivery retry where offered. [Settings help](/docs/pebble/troubleshooting/#settings-seem-not-to-save).

## Dynamic

After installation, choose [Dynamic](/projects/dynamic/) as your watchface and complete [Enable shared information](#enable-shared-information).

1. Open Dynamic’s phone settings, then **Activities**.
2. Turn on **Show activity plugins**. In **Activity priority**, show Timer; use **Reorder** to put it above other activities if you want it in the larger area.
3. Choose **Save** and wait for **✓ Saved**. If watch delivery is pending, keep the connection and use the indicated retry.
4. Now open Timer on the watch and start a **12-minute** countdown. Press Back to its list, then Back again to return to Dynamic.

**Check:** Dynamic shows the remaining time. Timer still owns the countdown and alarm. [If it does not appear](/docs/pebble/troubleshooting/#an-activity-is-missing).

### Choose a layout and colours

**Layout & complications** offers **Columns**, **Stacked rows** and **Four when idle**. The four-reading grid keeps the selected pair when an activity or Timeline Peek needs room. Optional shake switching cycles the selected pair without refreshing the sources.

**Colours** selects the appearance used on the watch and edits day/night palettes. Editing a palette does not switch the active one. Detail colours apply with **Split clock and details** enabled. The preview contains examples, not live readings.

All four category screens share a draft and one **Save/Discard** bar. **More & help** contains text size, clock format and diagnostics.

### Add weather and other small readings

In Pebble, open **Settings → Plugins → Complications**. Choose readings such as temperature or phone battery for slots **1–2**, or **1–4** for Four when idle. Shake switching can also use slot 5. These shared choices can affect other watchfaces, including Halftone.

Configure the chosen weather provider, location and permissions in Pebble. Dynamic displays the source you select; [ČHMÚ Weather](/docs/pebble/chmu-weather/) is an optional Czech source.

### Add music or notifications

On Android, show the desired source in the watchface’s activity list and allow its permissions. Dynamic’s notification summaries and message text both start off. Choose deliberately what private content may appear. The large **Primary activity** gets the first eligible update in your order; a **Secondary activity** appears when space allows.

## Open Activity

**Optional. First show a Timer countdown on [Dynamic](#dynamic) or [Halftone](#halftone).** You can also open Timer directly from the app list.

1. Install [Open Activity](/projects/open-activity/) when available. Open it from the watch’s app list and leave its setup screen open.
2. Open its phone settings. Choose **Watchface → Dynamic** or **Halftone** to match the face you use.
3. Choose a supported shortcut for **Primary activity**; optionally choose a different one for **Secondary activity**. For a first test, use **Hold Down** for Primary if offered. Save and wait for confirmation.
4. Allow **Launch apps** when Pebble prompts. If it was denied earlier, review Open Activity’s permissions in Pebble.
5. Assign **Open Activity** to the same shortcut in Pebble’s Quick Launch settings. For a normal button hold, use **Settings → Quick Launch** on the watch, or the phone’s **Watch Settings → Quick Launch**. [Official Quick Launch help](https://help.repebble.com/en/articles/14490338-quick-launch).
6. Return to the chosen watchface, with a fresh countdown visible. Hold the assigned button to try it.

**Check:** the shortcut opens Timer. A normal app-list launch opens Open Activity’s setup screen instead.

Use **one connected watch**. If you change between Dynamic and Halftone, update the source in Open Activity too. It uses that chosen face’s recent activity record; it does not detect the previously active face automatically. The destination must be installed. It opens the whole app, not a particular timer, song or notification. [Shortcut troubleshooting](/docs/pebble/troubleshooting/#open-activity-immediately-closes).

## Dashboard

**Optional.** Install [Dashboard](/projects/dashboard/) when available, then complete [Enable shared information](#enable-shared-information). It opens as a watch app, leaving your chosen watchface in place.

1. Open Dashboard on the watch while the phone is connected, then open its phone settings.
2. Choose which Activities appear and their order. Dashboard’s list is separate from both watchfaces.
3. Add a **Pinned item**. Start with an available phone-battery or weather reading. Choose an action for Select or an installed app for Hold Select only if useful.
4. Save, wait for confirmation, then return to Dashboard on the watch.

**Check:** the overview can show your current Timer activity, a notification panel and two pinned items. Empty or unavailable sources may leave those positions without content. Hold **Up** for the Activities collection or **Down** for Pinned.

For an app shortcut, choose **Hold Select → Open app** and select the destination by name. A Store search result does not install the app; confirm it is on your watch. Pins here are Dashboard readings and shortcuts, separate from timeline pins.

Dashboard displays Timer’s countdown but cannot pause or resume it. Open Timer for those controls. [Dashboard controls](/docs/pebble/controls/#dashboard).

## Halftone

[Set up Halftone](/docs/pebble/halftone/) for a dotted-border clock with the first two shared Complications readings. Its **Content & priority** settings can show Timer too. Configure and save them before starting the example countdown.

## ČHMÚ Weather

[Set up ČHMÚ Weather](/docs/pebble/chmu-weather/) if you want Czech station observations and ALADIN forecasts. It runs inside the phone app. Its guide separates adding a saved location, checking plugin data and selecting the weather provider or a watchface reading.

## What is an activity?

An **activity** is an update about something happening now, such as a countdown. Compatible watchfaces and apps display it while the source app retains its controls. Weather and battery **readings** use separate Complications or pinned-item settings. [How Activities work](/docs/pebble/activities/).

## Check the complete workflow

1. Configure your chosen watchface and save its Activity settings.
2. Start a 12-minute timer and return to that face. Check that its countdown appears.
3. If you added Open Activity, use its Primary shortcut to open Timer.
4. Pause or resume in Timer. A paused timer remains saved; its shared activity leaves the display after five minutes.

If a check fails, use [Troubleshooting](/docs/pebble/troubleshooting/) for that step before adding another optional connection.
