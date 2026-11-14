---
layout: ../../../layouts/DocLayout.astro
title: Watch controls
description: Use Timer, Dashboard and Open Activity with predictable watch-button actions.
section: For users
order: 3
setupProducts: [timer, dynamic, halftone, dashboard, open-activity]
---

New to the watch? [See the labelled button guide](/pebble/#watch-buttons). **Back** is on the left; **Up**, **Select** and **Down** are on the right.

The apps use Pebble’s physical buttons. The version panel above identifies the releases covered by this guide. Earlier versions may have different settings and controls. Available actions depend on both the source and the app displaying them.

New to Activities? [Learn how a Timer countdown reaches your watchface](/docs/pebble/activities/). Timer’s controls stay in Timer; Dashboard can additionally offer controls supplied by other compatible sources.

## Timer

| Screen | Up | Select | Down | Back |
| --- | --- | --- | --- | --- |
| Timer list | Previous row | Open timer or New | Next row | Exit to watchface |
| Duration editor | Increase the selected field | Next field, then start or save | Decrease the selected field | Previous field or originating screen |
| Timer detail | Edit remaining or saved duration | Pause, resume or start a Ready timer | More options | Timer list |
| More options | Previous option | Choose option | Next option | Timer detail |
| Time’s up | Snooze one minute | Done | Done | Done or timer list |

**New** opens at 00:10:00 with **minutes** selected. Up and Down change the highlighted value; Select advances to seconds, and Select on that final field starts the timer. To set hours, press Back from minutes first. From the countdown detail, Back returns to the list; another Back returns to your watchface. Durations range from five seconds to 24 hours.

### Reset without restarting

Open the timer, choose **More options → Reset**, and leave it **Ready**. Reset stops that run and restores its saved repeat duration. It stays stopped after closing and reopening Timer. Select starts it again when you are ready.

Changing the remaining time during a run preserves the elapsed portion. The saved repeat duration is separate, including after a one-minute snooze.

### Finish and acknowledge

Choose **Done** to acknowledge a finished timer. Its activity is withdrawn when the owner’s update reaches the phone; the saved timer remains reusable.

While the alarm screen is active, Timer repeats its feedback until acknowledgement and respects Quiet Time. Time 2 can add sound when **Alarm sound** is enabled in phone settings; it also respects system mute. Round 2 uses vibration. Successfully scheduled native alarms remain owned by Timer when the app is closed or the phone disconnects. Any scheduling error stays visible on the watch.

### Understand the hourglass

Ready shows sand at the bottom. Starting a run turns the glass upright with the sand at the top. Pause leaves it horizontal. Running sand updates alongside the countdown; paused and Ready views stay still.

## Dashboard

| Button | Tap | Hold from the overview |
| --- | --- | --- |
| Up | Previous item | All Activities |
| Select | The selected item’s available action | Open its associated app |
| Down | Next item | All Pinned items |
| Back | Previous screen, or exit from the overview | Standard PebbleOS behaviour |

Inside full lists, holding Up or Down repeats navigation. Back restores the preceding screen and its selection.

### What Select does

- **Music:** toggle playback when the provider offers that action. Hold Select opens the native Music app.
- **Other activities:** open available controls. A summary without controls has no Select action.
- **Notifications:** open the native Notifications app. This row remains selectable even without a preview.
- **Pinned items:** perform the configured action, if there is one. Hold Select opens the optional associated app.

Timer does not currently offer Pause/Resume controls in Dashboard. Open Timer to change its run.

The watch shows pending and result feedback for commands. Confirmation appears when required by the source or your pin settings; it starts on Cancel. A successful command acknowledgement does not invent a new reading; the provider supplies the resulting value.

## Open Activity

In Open Activity settings, choose **Watchface → Dynamic** or **Halftone**, then set **Primary activity** and optionally a different shortcut for **Secondary activity**. Save and assign **Open Activity** to those same shortcuts in Pebble’s **Quick Launch** settings. Allow **Launch apps**, keep the phone connected with plugin support enabled, and use one connected watch.

The shortcut opens the manually selected watchface’s recent Primary or Secondary destination. Change **Watchface** in Open Activity when you switch between Dynamic and Halftone; it does not detect that switch automatically. The destination must still be valid and identify an installed app. An absent Secondary never substitutes Primary.

The helper opens the whole app. For example, a Timer activity opens Timer; it does not address a particular saved timer inside it.

Open Activity launched normally from the app list stays on its setup screen. Press Back to leave. During a Quick Launch attempt, Back cancels the attempt while it can still be cancelled; an already dispatched app-launch command cannot be recalled reliably.

## Dynamic

Dynamic is a watchface. Its activity order, visibility, appearance and notification privacy are configured on the phone in four category screens. **Layout & complications** offers Columns, Stacked rows and Four when idle. Optional shake switching cycles the selected reading pair; Timeline Peek and activities keep that selected pair. Text stays static; media changes can use a short incoming transition.

Use Open Activity for the configured activity-opening shortcuts. Dynamic itself displays activity data and app destinations; it does not invoke provider playback or other contextual actions.

## Halftone

Halftone is a watchface. Change its colours, Big text, dot border and notification privacy through its settings gear in the Pebble phone app. Use Open Activity for shortcuts to its primary or secondary activity. Playback controls remain in Pebble’s Music app. [Set up Halftone](/docs/pebble/halftone/).

## ČHMÚ Weather

The plugin has no watch screen or watch buttons. Configure it in the Pebble phone app’s Plugins tab. Your watch’s normal Weather app retains its own controls. [Choose the weather source](/docs/pebble/chmu-weather/).

## Text size and appearance

**Text size → Follow Pebble** uses the watch’s text size; Small, Medium and Large are app-specific choices. In Timer, Dashboard and Open Activity, choose **Light** or **Dark** for watch appearance. Their **Follow Pebble** appearance choice currently uses the last explicit Light/Dark choice because automatic appearance following is unavailable. Dynamic and Halftone also offer **Follow Quiet Time** for their day/night palettes.

Save confirms phone storage separately from watch delivery. Open the affected app or watchface while connected to apply display settings, and check its delivery status. For Open Activity, use a normal app-list launch so its setup screen stays open. [Display-settings help](/docs/pebble/troubleshooting/#text-size-or-appearance-has-not-changed).
