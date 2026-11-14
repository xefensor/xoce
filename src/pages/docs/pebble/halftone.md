---
layout: ../../../layouts/DocLayout.astro
title: Set up Halftone
description: Choose a dotted-border clock, configure its two readings and make the appearance yours.
section: For users
order: 3
setupProducts: [halftone, timer, open-activity]
---

[Halftone](/projects/halftone/) is an alternative everyday clock to Dynamic for **Time 2 and Round 2**. You can keep both watchfaces installed and choose which one is active. Timer and Open Activity are optional additions.

## Install and choose the watchface

1. Set up the [official Pebble phone app](https://repebble.com/app) and pair your Time 2 or Round 2.
2. Check the [Halftone product page](/projects/halftone/) for release status and verified installation choices. When the matching release is available, install it through its Store link or matching `.pbw` link. See the [Android and iPhone file-opening instructions](/docs/pebble/setup/#before-installing) for manual installation.
3. Choose Halftone in the phone app’s Watchfaces section to make it your active clock screen.
4. For shared readings or activities, enable **Plugins / permissions preview** in the phone app’s Plugins settings and allow the permissions needed by your chosen sources. Menu labels can vary between phone-app versions.

Clock and date are native watch functions. Weather and other shared readings use your phone, its configured plugins and their permissions. The [shared setup guide](/docs/pebble/setup/#before-installing) explains these requirements.

## Choose your two readings

In the Pebble phone app, open **Settings → Plugins → Complications** and choose the **first two** entries. Halftone displays the first on the left and the second on the right. Choices 3–5 are not used by Halftone.

For a first arrangement, try **temperature** and **precipitation probability**. Configure a weather source and location in Pebble before returning to the watchface. [ČHMÚ Weather](/docs/pebble/chmu-weather/) is one optional source for Czech locations; another compatible weather source works too.

**Check on the watch:** the two selected readings appear beneath the time. If either is missing or unavailable, check the source’s settings and permissions before changing Halftone’s layout.

These are shared choices: changing them can also change readings in Dynamic and other watchfaces using the same slots. Units and refresh timing come from your selected source.

## Change the appearance

Open Halftone’s settings using its gear icon in the Pebble phone app. Under **Appearance**, choose colours and **Text size**: **Small**, **Medium**, **Large** or **Follow Pebble**. **Big text** is a separate option that enlarges the clock, date and both readings.

You can also choose **4-step dot transition**, **Floating text shadow**, **Animations** and **Brief halftone transitions**. The last option briefly dissolves the lower panel while the clock and border stay still. For a dark palette with a visible dot border, try a graphite background with white text.

Choose **Manual** appearance and a **Light** or **Dark** manual palette, or use **Follow Quiet Time**. The current **Follow Pebble** appearance fallback keeps your last Light or Dark choice.

Choose **Save** after making changes. **✓ Saved** confirms that the phone saved your settings. Appearance delivery has a separate status: **Applied on watch** confirms the watch received those display preferences. If it says **Saved on phone · Pending on watch**, keep the watch connected and use **Retry watch delivery** if needed.

The readings make room for activities and Pebble’s native Timeline Peek panel. Long text may fit down or end in an ellipsis.

## Music and notifications

Music and notification sources require **Android** and the relevant Pebble permissions. Open **Content & priority** to choose Music or Notifications in **Activity priority**. **Show music while playing** starts on; **New notifications** and **Include message text** start off.

If you enable notifications, choose whether to include message text, use **App name only**, or filter **Selected apps**. Choose **Save** after changing these preferences. Playback controls remain in Pebble’s Music app. Halftone displays the available song, artist and artwork.

## Add Timer and other activities

Configure the sharing before starting your first countdown:

1. When its release is available, install [Timer](/projects/timer/) and open it once on the watch with your phone connected. Return to Halftone.
2. Open Halftone’s phone settings, then **Content & priority**. Turn on **Show activity plugins** and show Timer in **Activity priority**. Move Timer above other activities if you want its countdown in the larger area.
3. Choose **Save** and check the saved confirmation. Keep the watch and phone connected so the activity can arrive.
4. On the watch, open Timer, choose **New**, set **0 hours, 12 minutes, 0 seconds** with Up, Down and Select, then start it.
5. Return to Halftone.

**Check on the watch:** the time remaining appears on your clock screen and counts down. Timer continues to own the countdown and alarm; open Timer to pause, resume or finish it. If it does not appear, use [the activity checklist](/docs/pebble/troubleshooting/#an-activity-is-missing).

The primary activity uses the larger lower area. A secondary summary appears when there is room. Each watchface keeps its own activity order.

For an optional shortcut back to Timer, open [Open Activity settings](/docs/pebble/setup/#open-activity) and choose **Halftone** under **Watchface**. Configure **Primary activity** and, if wanted, **Secondary activity**, then assign Open Activity to the same Pebble Quick Launch shortcuts. Allow its app-launch permission when prompted.

When switching from Dynamic to Halftone, change Open Activity’s **Watchface** choice and save it too. The helper follows that saved choice; it does not switch sources automatically with your active watchface. It opens the associated app, rather than a particular timer inside it.

## If a reading is missing

- Confirm your watch and phone are connected and plugin preview is enabled.
- Check the first two Complications choices and the selected source’s settings and permissions.
- Choose a current value rather than a forecast series, and check any unavailable-source message.
- If using ČHMÚ, check its [weather-source setup](/docs/pebble/chmu-weather/). A location without usable Czech coverage may not supply a reading.

Clock and date continue without the phone. Selected readings may remain cached for up to two hours, subject to the source’s earlier expiry. Music and notification context clears on disconnection.

[Halftone release status and source](/projects/halftone/) · [Watch controls](/docs/pebble/controls/#halftone)

## Understand Activities

An activity is an ongoing update, such as a countdown. Halftone displays the information supplied by the original app. Timer keeps responsibility for its countdown and alarm. [Read how Activities work](/docs/pebble/activities/).
