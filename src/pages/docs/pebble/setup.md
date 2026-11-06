---
layout: ../../../layouts/DocLayout.astro
title: Set up your Pebble
description: Install the Pebble development builds, configure activities and choose Quick Launch shortcuts.
section: Use XOCE
order: 2
---

This guide covers the published **Pebble Time 2 / Emery** development builds. Activity sharing and app opening need the official Pebble phone app with plugin support enabled and the permissions required by your chosen sources.

## Before installing

1. Check that your watch matches the target listed on the project page.
2. Download the project’s `.pbw` file from its versioned GitHub release.
3. Open that file with the Pebble phone app and follow its installation flow.
4. Allow the permissions needed for the features you choose to use.

Project pages link to explicit release versions. The release pages also contain source, debugging files and checksums.

## Timer

Install [Timer 0.12.0](/projects/timer/), then open it on the watch.

1. Choose **New timer**.
2. Set hours, minutes and seconds using Up, Select and Down.
3. Start the countdown. Timer saves the run on the watch, schedules its native alarm and shares its reported state with the phone.

Timer has no separate phone settings page. Its duration editor and **More options** on the watch are its settings surface. You can keep up to eight saved timers.

If Timer reports an alarm or storage error, follow the message on the watch. A phone transport acknowledgement alone is not proof that an alarm was secured.

## Dynamic

Install [Dynamic 0.16.2](/projects/dynamic/) and choose it as your watchface.

1. Open Dynamic’s settings in the Pebble phone app.
2. Under **Content & priority → Activity priority**, enable the sources you want and reorder them.
3. Keep Timer visible while testing the first countdown. The first eligible activity becomes primary; the next becomes the compact secondary row.
4. Save, close the settings and return to the watchface.

Music and Notifications share this priority list. Notifications defaults to Off. Enable it deliberately and choose how much notification information to show.

The two readings above the activities come from the phone app’s first two global complication choices. Dynamic does not include its own weather provider; select an available source in the phone app.

Dynamic’s colour settings, activity order and visibility belong to Dynamic. Dashboard keeps its own choices.

## Open Activity

Install [Open Activity 0.1.6](/projects/open-activity/) if you want Quick Launch to open the app associated with an activity.

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

Install [Dashboard 0.4.3](/projects/dashboard/) and open it once on the watch so its phone runtime can discover available providers.

1. Open Dashboard’s phone settings.
2. Choose the activities you want and their order.
3. Add or edit your Pinned items. A pin can have a reading, a Select action and a Hold Select app destination.
4. Save. You can save directly while a pin editor is open.

For a native app destination, choose **Hold Select → Open app** and select an app by name. PebbleOS apps such as Weather have named entries; their availability depends on the watch and OS. Store search can find other app names, but a result does not prove that app is installed on your watch.

You can assign Dashboard itself to a separate Quick Launch shortcut for opening the overview directly.

## Check the complete workflow

Start a Timer, return to Dynamic and wait for its activity. Use your Primary shortcut to open Timer. Return to the watchface, pause the timer, and check that it eventually disappears from activity views after five minutes while remaining saved in Timer.

For settings changes, close and reopen the page to check the saved choices. If Save stays unconfirmed, keep your draft and use the page’s readback or retry controls rather than assuming the change was stored.

Need help? [Troubleshoot activities and settings](/docs/pebble/troubleshooting/).
