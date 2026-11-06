---
layout: ../../../layouts/DocLayout.astro
title: Watch controls
description: Use Timer, Dashboard and Open Activity with predictable watch-button actions.
section: Use XOCE
order: 3
---

The apps use Pebble’s physical buttons. The instructions below describe the current development builds; a provider can add capabilities only where a consuming app supports them.

## Timer

| Screen | Up | Select | Down | Back |
| --- | --- | --- | --- | --- |
| Timer list | Previous row | Open timer or New timer | Next row | Exit |
| Duration editor | Increase the selected field | Next field, then start or save | Decrease the selected field | Previous field or originating screen |
| Timer detail | Edit remaining or saved duration | Pause, resume or start a Ready timer | More options | Timer list |
| More options | Previous option | Choose option | Next option | Timer detail |
| Time’s up | Snooze one minute | Done | Done | Done or timer list |

### Reset without restarting

Open the timer, choose **More options → Reset**, and leave it **Ready**. Reset stops that run and restores its saved repeat duration. It stays stopped after closing and reopening Timer. Select starts it again when you are ready.

Changing the remaining time during a run preserves the elapsed portion. The saved repeat duration is separate, including after a one-minute snooze.

### Finish and acknowledge

Choose **Done** to acknowledge a finished timer. Its activity is withdrawn when the owner’s update reaches the phone; the saved timer remains reusable.

While the alarm screen is active, Timer repeats its feedback until acknowledgement and respects Quiet Time. Successfully scheduled native alarms remain owned by Timer when the app is closed or the phone disconnects. Any scheduling error stays visible on the watch.

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

The watch shows pending and result feedback for commands. A successful command acknowledgement does not invent a new reading; the provider supplies the resulting value.

## Open Activity

Launch it through a configured Quick Launch shortcut to open Dynamic’s recent Primary or Secondary destination. The destination must still be valid and have an associated installed app.

The helper opens the whole app. For example, a Timer activity opens Timer; it does not address a particular saved timer inside it.

Open Activity launched normally from the app list stays on its setup screen. Press Back to leave. During a Quick Launch attempt, Back cancels the attempt while it can still be cancelled; an already dispatched app-launch command cannot be recalled reliably.

## Dynamic

Dynamic is a watchface. Its activity order, visibility, appearance and notification privacy are configured on the phone. Text stays static; media changes can use a short incoming transition.

Use Open Activity for the configured activity-opening shortcuts. Dynamic itself displays activity data and app destinations; it does not invoke provider playback or other contextual actions.
