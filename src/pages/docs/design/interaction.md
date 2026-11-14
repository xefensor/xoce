---
layout: ../../../layouts/DocLayout.astro
title: Interaction and state
description: Preserve the selected target, distinguish confirmed results and keep recovery predictable.
section: Design
order: 4
---

These rules describe the current released Pebble interfaces and the website. For everyday instructions, use [watch controls](/docs/pebble/controls/) and [setup](/docs/pebble/setup/). The [older interaction study](/docs/history/interaction/) preserves earlier version-specific behaviour and evidence.

## Navigation preserves context

Dashboard’s Up/Down navigation keeps selection and viewport. Holding Up from the overview opens Activities; holding Down opens Pinned. Back returns through the existing context, rather than resetting it unnecessarily.

Select performs an available action. Holding Select can open the selected item’s associated app, with a preview of the exact destination during the deliberate hold. Releasing before completion cancels that hold without also triggering its tap action. There is no shared custom hold-Back gesture.

On the website, links navigate and buttons perform their labelled operation. Search is explicit; opening it may focus its field. Ordinary navigation, visiting settings or choosing an item must not unexpectedly open the keyboard.

## Updates do not redirect a press

An action remains bound to the identity and capability displayed when the person selected it. If a live item disappears or changes identity, an old press must not act on its replacement. Reconnection is not a fresh selection.

Retain this rule through confirmation, delayed replies, app handoff and collection changes. Navigation can select a new current item; background updates cannot silently make that choice for the person.

## Save, close and reopen

Modern bundled settings stay open after Save. Their small inline status distinguishes a draft from confirmed phone persistence. Legacy return-URL submission remains a separate close-to-submit compatibility path; it cannot supply the same in-page confirmation.

| State | Feedback and recovery |
| --- | --- |
| Confirmed load, no edits | No changes to save; Save disabled. |
| Edited valid draft | Unsaved changes; Save available. |
| Write in progress | Saving…; prevent duplicate writes and retain the draft. |
| Intended phone choices confirmed | ✓ Saved; stay open and keep the confirmation until another edit. |
| Confirmed failure | Relevant failure and retry; retain edits. |
| Result uncertain | Save not confirmed; offer explicit retry or Reload saved. Do not claim rollback. |
| Saved choices cannot be loaded | Explain the failure and offer Retry rather than presenting editable replacement defaults as saved. |

A transport ACK is not a persistence receipt. For settings that also update the watch, show **Saved on phone · Pending on watch**, **Applied on watch**, or the relevant delivery failure separately. An offline watch must not turn confirmed phone storage into a failed Save. Retry delivery only for a saved, relevant pending state.

Global Save gathers the whole draft, including an open Dashboard pin editor. A confirmed Save may close that nested editor; validation or transport failure preserves it. Discard restores the confirmed local snapshot without writing. It cannot undo a request already sent.

Late callbacks and polling must not replace a newer edited draft or let one result confirm another version. Keep status nodes stable and announce actual transitions once, rather than repeating unchanged live announcements on every poll.

## Appearance belongs in phone settings

Watch appearance is app-local. Phone pages follow the phone theme independently. Timer’s page configures appearance, text size and its Time 2 sound preference, while duration editing, Reset, pause/resume and alarm ownership stay on the watch.

Dynamic’s palette editor does not itself select the active day/night appearance. Preserve the distinction between changing saved palette values, confirming phone storage and applying the chosen display preferences on the watch.

## Loading, empty and unavailable

| Meaning | Response |
| --- | --- |
| Loading | Preserve relevant confirmed context while requesting the new state. |
| Confirmed empty | Show an honest empty state, retaining a useful destination where one exists. |
| Unavailable preview | Preserve the known action without fabricated content. |
| Expired activity | Remove expired content and bindings rather than renewing it with receipt time. |
| Failed action | Keep the target/navigation and offer the recovery that the source supports. |

Dashboard’s empty notification row remains a Notifications shortcut. A missing Secondary activity does not become Primary. A provider’s observation age stays distinct from when the phone or watch received it.

## Timer actions remain explicit

Reset stops the selected countdown, restores its saved repeat duration and leaves it Ready. Starting again requires Select. The native owner persists its state before changing its alarm/activity state; failure leaves the previous owner state authoritative.

Timer owns its controls, scheduled alarms, acknowledgement and snooze. Watchfaces and Dashboard can display the countdown or open Timer, but Dashboard does not provide Timer Pause/Resume. A paused timer can stop appearing in shared activities while remaining saved in Timer.

Open-app vibration/sound and a scheduled closed-app wakeup are distinct paths. Their existence does not establish physical timing, sound or battery results; those require device evidence.

## Quick Launch hands off to an app

Open Activity’s settings select **Dynamic or Halftone** and a shortcut for each Primary/Secondary role. Pebble’s system Quick Launch settings must also assign Open Activity to the chosen shortcuts. When changing watchface, update the source explicitly; it does not detect the preceding face automatically.

An ordinary app-list launch stays on passive setup. A configured Quick Launch resolves the chosen face’s recent confirmed destination and opens the associated installed app. A missing Secondary never falls back to Primary; failure, expiry or denied permission ends the bounded attempt. Back remains available and the original four-second startup budget is retained.

The destination is the whole app, not a saved timer, song or notification. Opening it is separate from issuing one of its commands. The current routing is intended for one connected watch.

## Motion has a reason and an end

Dynamic can animate an actual layout, activity or track change. Ticks and late metadata repaint without another entrance; its Animations choice controls its local transitions. Timer’s hourglass can explain a state change while the value remains stable.

Watch text remains static and shows the beginning that fits. Navigation and resting states do not justify an endless decorative timer. Website controls respect reduced motion, and essential reading/navigation remains usable without JavaScript.

## Android interaction scope

Phone and its optional Pebble companion are planned. Their Android interaction rules must follow the eventual product. These existing watch gestures, data bindings and WebView persistence controllers are not a universal Android framework.

## References and verification

The [Pebble reference](/docs/design/pebble-ui-system/#release-basis-and-evidence) identifies the current release basis and source owners. Keep portable tests, packaged execution, simulated browser rendering, native emulator capture and real-device checks separately labelled. Historical screenshots and test reports retain the versions they actually exercised.
