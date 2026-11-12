---
layout: ../../../layouts/DocLayout.astro
title: Set up your Pebble
description: Install the apps, enable shared information and get a countdown onto your watchface.
section: For users
order: 2
---

New to the collection? [Choose your apps first](/docs/#choose-what-you-need). **Timer + Dynamic** is the recommended first setup. Dashboard, Open Activity and ČHMÚ Weather are optional. Halftone is an alternative watchface.

## Before installing

1. **Check your watch:** the current watchface and watch-app downloads support **Pebble Time 2 only**. The ČHMÚ Weather plugin runs on the phone. They are development builds.
2. **Set up the official phone app:** [get Pebble for Android or iPhone](https://repebble.com/app), open it and pair your watch. Follow Pebble’s [installation guide](https://help.repebble.com/en/articles/14489632-installing-the-pebble-app) if needed. The planned XOCE Phone app is not required.
3. **Enable shared information:** in the latest Pebble phone app, open **Settings → Plugins → Plugins/permissions preview** and turn it on. Plugins supply information such as weather, music or a countdown. Allow the permissions needed by the information you choose.
4. **Download an app:** choose **Download .pbw** on its [app page](/projects/). A `.pbw` is a Pebble installation file; it does not install simply by downloading it.
5. **Open the file with Pebble:** follow the Android or iPhone instructions below, then confirm the installation in the phone app.

Timer can manage countdowns and its successfully scheduled alarms on the watch without sharing them. Displaying that countdown in another app needs plugin preview and a phone connection.

### Android

Open the downloaded `.pbw` from your browser’s downloads or the phone’s Files app. If Android asks which app to use, choose **Pebble**. If it does not offer that option, try the file’s **Share / Open with** menu and select Pebble.

### iPhone / iOS

Save the `.pbw` to Files if necessary, open its share sheet and look for **Pebble**; it may be under **More**. Follow the installation prompt. Available file-opening options depend on your phone and Pebble app version. If Pebble is missing, check that the official app is installed and up to date, then try the file again from Files.

Music and notification previews in these Dynamic, Halftone and Dashboard releases are **Android-only**. Other plugin features depend on the sources and permissions available on your phone. [Compare the requirements](/docs/#current-pebble-builds).

The downloads on this site are the pinned development `.pbw` builds. GitHub release pages also contain source and debugging files; you do not need those to install the watch apps.

## Timer

**First time here? Complete [Before installing](#before-installing) before continuing.**

1. Download and install [Timer 0.14.5](/projects/timer/).
2. On the watch, press **Select** (middle right) to open the app list and choose Timer.
3. Choose **New timer**. Use Up and Down to change each value, and Select to move to the next field. Set hours, minutes and seconds, then start the countdown.
4. To pause or resume, open the timer and press Select. Your saved timers stay available for reuse.

Timer handles the alarm on the watch. If it reports **Alarm not set; keep open**, keep Timer open and follow its message. [Alarm troubleshooting](/docs/pebble/troubleshooting/#timer-reports-alarm-not-set-keep-open).

Timer’s phone settings change its Light/Dark appearance. Creating or editing countdowns happens on the watch. [See every Timer control](/docs/pebble/controls/#timer).

## Dynamic

**First time here? Complete [Before installing](#before-installing), including plugin preview.**

1. Download and install [Dynamic 0.18.3](/projects/dynamic/), then choose it as your watchface in the Pebble phone app.
2. Open Dynamic’s settings using its settings gear in the phone app.
3. Under **Content & priority → Activity priority**, enable Timer. You can enable other available activities later.
4. Choose **Save settings** and wait for **✓ Saved**.
5. Start a countdown in Timer on the watch, then return to Dynamic. With your phone connected, the countdown should appear on the watchface.

The larger area is the **primary activity**; the smaller row is the **secondary activity**. The order you choose decides which eligible activity gets the larger area.

### Add weather and other small readings

In the Pebble phone app, open **Settings → Plugins → Complications** and choose readings for slots 1–2. A complication is a small piece of information, such as the temperature or phone battery level. These are shared choices that can affect other watchfaces too.

Dynamic uses the available weather source rather than including a separate weather provider. Your location, provider and permissions need to be configured in the Pebble app.

### Add music or notifications

These previews need Android. Enable Music or Notifications in Dynamic’s activity priority list. Notifications starts **Off**; choose how much private notification information you want visible on your watch.

## Open Activity

**Optional. Requires [Dynamic](/projects/dynamic/) and the [shared setup](#before-installing).** You can always open Timer from the app list without this helper.

Quick Launch is a Pebble button shortcut. Open Activity lets that shortcut open the app associated with what Dynamic is displaying.

1. Download and install [Open Activity 0.3.3](/projects/open-activity/).
2. Open Open Activity from the watch’s app list. Leave its setup screen open while you configure it on your phone.
3. Open its phone settings. Choose a shortcut for **Primary activity**. Optionally choose a different one for **Secondary activity**. Save.
4. In the Pebble phone app’s **Quick Launch** settings, assign **Open Activity** to the same shortcut or shortcuts. Available choices depend on your phone app and firmware.
5. Press Back on the watch and return to Dynamic. With a countdown visible, try your Primary shortcut: it should open Timer.

For example, you could use Hold Down for Primary and Hold Up for Secondary where supported. Use one connected watch for this setup.

The helper opens the associated app, not a particular timer inside it. A missing or expired activity has no destination to open. [Troubleshoot a shortcut](/docs/pebble/troubleshooting/#open-activity-immediately-closes).

## Dashboard

**Optional. Complete [Before installing](#before-installing) before continuing.** Dashboard is an overview you open as a watch app; it does not replace your clock screen.

1. Download and install [Dashboard 0.6.3](/projects/dashboard/). Open it once on the watch while your phone is connected.
2. Open Dashboard’s settings in the Pebble phone app.
3. Choose which activities to show and their order. These settings are separate from Dynamic’s.
4. Add a **Pinned item** if you want one. Choose an available reading, an action for a short press of Select, or an app to open by holding Select.
5. Save and wait for the saved confirmation. Return to Dashboard on the watch.

Pins use your configured plugins. The example kitchen light in the screenshot requires a suitable smart-home source; installing Dashboard alone does not connect a light.

For an app shortcut, choose **Hold Select → Open app** and select an app by name. Make sure that app is installed on your watch. You can also assign Dashboard to a separate Quick Launch shortcut.

Dashboard currently shows a timer’s information but does not offer Timer Pause/Resume controls. [See Dashboard controls](/docs/pebble/controls/#dashboard).

## Halftone

Want a dotted-border clock instead? Follow [Halftone’s setup guide](/docs/pebble/halftone/). It uses the first two shared Complications choices. The released rc.6 candidate does not show Timer activities or use Open Activity.

## ČHMÚ Weather

This optional plugin runs in the Pebble phone app. Follow [the ČHMÚ Weather guide](/docs/pebble/chmu-weather/) to install it and choose it as a weather provider or reading source. It is intended for Czech weather locations.

## Check the complete workflow

1. Start a timer on the watch.
2. Return to Dynamic and check that its countdown appears.
3. If you configured Open Activity, use your Primary shortcut to open Timer.
4. Pause the timer in Timer. It stays saved; its shared activity disappears after five minutes.

If something is missing, use [Troubleshooting](/docs/pebble/troubleshooting/). Settings that do not save, advanced app destinations and connection failures are covered there.
