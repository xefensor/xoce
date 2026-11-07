---
layout: ../../../layouts/DocLayout.astro
title: UX & interaction
description: How current navigation, actions, saving, loading, empty states and app handoffs preserve the user’s intent.
section: Design
order: 4
---

Interaction design explains what happens before and after a press, not only how a screen looks. Common rules apply across XOCE: preserve the person’s context, bind actions to the intended target, and distinguish a draft from a confirmed result. The concrete workflows below are implemented Pebble examples; they do not establish an Android interaction API or finished Phone design. For everyday button instructions, use [watch controls](/docs/pebble/controls/).

The [Pebble UI and UX standard](/docs/design/pebble-ui-system/) records the implemented shared design and passed local automated, packaged browser and native emulator checks. The candidates are not published releases, and real-device verification remains separate. The published baselines and older evidence keep their original version context.

## Navigation preserves context

Dashboard’s Up and Down buttons move between items. Holding Up from Snapshot opens Activities; holding Down opens Pinned. Collection navigation and Back retain the originating selection and viewport.

Select performs an available useful action. Music can toggle playback directly; a generic activity can open its declared controls; Notifications opens the native app; a pin can run its configured action. A summary without an action stays read-only rather than opening an enlarged copy of the same text.

Holding Select opens the selected item’s associated app when one exists. A deliberate hold first previews the exact destination. Releasing after that preview but before the hold completes cancels the gesture without also firing its tap action.

Back keeps its ordinary navigation role. The current apps do not add a shared custom hold-Back shortcut to exit to the watchface.

## Updates do not redirect a press

Live content may arrive, expire or change order during interaction. Dashboard preserves selection by identity. If the selected activity disappears, Select and hold remain inert until the user deliberately navigates to a current item.

An old action binding must not become a command for a replacement item. Reconnection alone does not count as selecting that replacement. Command results and app destinations stay tied to the displayed item and request.

## Save, close and reopen

The complete settings workflow includes reopening the app and reading the confirmed choices. The page needs to distinguish an unsaved draft from a confirmed save or an uncertain result.

The modern bundled pages in the local candidates implement [Save stays open](/docs/design/pebble-ui-system/#save-stays-open): Saving…, persistent ✓ Saved, Unsaved changes and relevant failure feedback. Dynamic 0.17.0 retains Clay rendering and adds SDK configuration messages for verified phone persistence. Its published 0.16.2 flow still submits and closes and shows prior watch-delivery status on reopening. The legacy return-URL fallbacks still close to deliver their result; they do not provide modern in-page confirmation.

Dashboard gathers an open pinned-item editor when global Save is pressed. It validates the fields and closes the editor only after saving is confirmed. Validation or transport errors keep the form intact.

Open Activity saves its preferences through the active phone runtime while the helper is running, or its configuration plugin when closed. The UI confirms the exact returned choices. An uncertain result retains the draft and offers Reload saved or an explicit retry. Discarding a local draft cannot promise to undo a save already sent.

Discard retains the visible page context using normal browser scroll anchoring when restored controls change height. This does not promise a pixel-fixed scroll offset; it avoids forcing the page to the top or opening the keyboard.

Opening an editor, selecting a store result or visiting settings does not automatically focus a text field. Explicit Search is an intentional exception: opening the website’s search dialog focuses the search field so it can be used immediately.

## Appearance belongs in phone settings

In the local candidates, Timer has a minimal phone Light/Dark appearance page with help, and Open Activity has a separate Watch appearance selector beside its two role choices. The phone page follows the phone’s theme independently. Appearance preferences remain app-local. Timer’s native duration editor, Reset, pause/resume and alarm ownership stay on the watch; the appearance page does not issue those operations.

## Loading, empty and unavailable

Use the state the source actually establishes:

| State | Existing response |
| --- | --- |
| Dashboard starting | Show the last confirmed watch theme immediately while requesting fresh content. Private activity content is not cached on the watch. |
| No current activity | Show a neutral placeholder instead of a fabricated activity. |
| Confirmed empty notification source | Keep a selectable No notifications row that opens Notifications. |
| Notification preview unavailable | Keep the Notifications destination, with Open notifications rather than invented preview text. |
| Reading/action failure | Show relevant status while preserving navigation and the selected target. |
| Expired activity data | Remove expired content and its action/app bindings instead of presenting them as fresh. |

Dashboard’s command progress and success use the action bar; failures and relevant unavailable-state messages use the header. Feedback should not cover a pinned reading’s value. Timed-out requests stop waiting rather than leaving an indefinite loading state.

The watch uses its last confirmed theme until a new accepted phone update arrives. A phone-side appearance change made while Dashboard is closed cannot change the already saved startup colour before that update.

## Timer actions remain explicit

Timer’s Reset stops that countdown, restores its saved repeat duration and leaves it Ready. Starting again requires Select. Ready persists through closing and reopening, and other saved timers continue normally.

The native owner persists state before changing alarm and activity state. If saving fails, the previous countdown and alarm remain authoritative; the interface must not present a reset as completed.

An acknowledged completed timer disappears from activity summaries. A timer paused for five minutes stops appearing there while remaining saved in Timer. Its absence from a watchface does not delete it.

When Timer is open with a pending alarm, vibration repeats every three seconds, subject to Quiet Time. Done or Snooze clears that alarm’s feedback; another pending alarm can keep alerting. This describes implemented open-app behaviour; it does not establish closed-app vibration or physical-device verification.

Dashboard currently displays Timer and can open its app. Pause/Resume from Dashboard is deferred; the interface should not advertise it as available.

## Quick Launch hands off to an app

Open Activity has two entry paths:

1. An ordinary app-list launch stays on the setup screen. This allows the phone settings flow to work when the app must be open.
2. A configured Quick Launch gesture resolves Dynamic’s recently displayed Primary or Secondary destination, then opens that associated app automatically.

The helper’s settings choose one shortcut per role. Pebble’s system Quick Launch settings must also assign Open Activity to those shortcuts. Other apps keep their independent assignments.

A missing Secondary never falls back to Primary. Missing or expired data, disconnection, denied permission or resolution failure closes the transition attempt. Back stays available, and the initial transition UI has a four-second limit including phone startup time.

The destination is the whole app. Timer opens Timer; media can open Music. The helper does not select a particular timer, notification or song, and it does not issue a playback or timer command.

The handoff uses Dynamic’s recent confirmed selection. Stock SDK support cannot verify which watchface immediately preceded the helper. The implementation is intended for one connected watch; the current launch action has no per-watch selector. These are meaningful platform/implementation boundaries, not additional user settings.

## Motion has a reason and an end

Dynamic uses short incoming transitions for activity replacements or media-item changes. Ticks, refreshes and late artist/artwork metadata repaint without another entrance. Its Animations setting disables its local transitions.

Timer rotates its hourglass for a state transition and settles within 300ms. Ready and paused presentations remain still; ordinary reopening does not replay the flip. Visible falling sand reuses the running second tick.

Neither Dynamic nor Dashboard scrolls text automatically. The watch shows the beginning that fits. The website respects reduced motion and keeps primary navigation and guide content available without JavaScript.

## Android interaction scope

Phone is planned as a standalone Android app, with an optional Pebble companion. Android interaction guidance will follow its actual interface as it develops. The companion will have its own watch controls.

The common rules in this guide remain useful goals. The watch’s tap/hold mappings, Quick Launch handoff and activity bindings belong to the Pebble implementations described above. Android interaction guidance needs to follow the actual Android product rather than inheriting those mappings.

## References and verification

These behaviours are documented in [Dashboard’s current implementation](https://github.com/xefensor/pebble-app-dashboard/blob/61e4babc91bef0409c14f8c8699053d047baa2be/docs/IMPLEMENTATION.md), [Timer 0.12.0](https://github.com/xefensor/pebble-app-timer/blob/v0.12.0/README.md), [Open Activity 0.1.6](https://github.com/xefensor/pebble-app-open-activity/blob/v0.1.6/README.md) and [Dynamic’s native style](https://github.com/xefensor/pebble-watchface-dynamic/blob/7b5daced6a8c7974425e1b3fb927071d1501df3d/docs/NATIVE-STYLE.md).

Automated browser checks, packaged-runtime tests and native emulator captures establish different things. Keep their evidence labels intact. Real-phone permission handling, watch-to-phone latency, physical comfort and battery life need their own device checks.
