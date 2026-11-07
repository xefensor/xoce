---
layout: ../../../layouts/DocLayout.astro
title: UI patterns
description: Common interface ideas demonstrated by current Pebble layouts and settings, with platform boundaries made explicit.
section: Design
order: 3
---

A useful interface gives the main task enough room, keeps related content and actions together, and makes current state readable. Those [common principles](/docs/design/principles/) can apply across XOCE; their layout and controls depend on the device.

The concrete patterns below describe Pebble Time 2 interfaces and their phone settings. The watch builds target a 200 × 228 screen with physical buttons. The Pebble activity schema is a contract for compatible Pebble hosts, not a universal interface or data model for Android products.

## Android implementation scope

Phone and its optional Pebble companion are planned. No Android interface patterns, screenshots or component kit have been published. Use the common principles as direction; do not treat the watch action bar, compact activity row or bundled Pebble settings controller as an implemented Android app design.

This page’s screenshots and baseline descriptions refer to the published builds. The [Pebble UI and UX standard](/docs/design/pebble-ui-system/) records adoption in Dynamic 0.17.0, Dashboard 0.5.0, Timer 0.13.0 and Open Activity 0.2.0 local candidates. Automated, packaged browser and native emulator checks pass; real-device verification remains separate. Those candidates have not replaced the public downloads.

## Activity content and context

An activity carries source content; the consuming app decides how much space it receives. Either the primary or secondary role can contain any supported activity source. Secondary describes a space constraint, not a particular source such as Music.

Dynamic uses these compositions:

| Area | Existing presentation |
| --- | --- |
| Primary activity | A larger content block, bottom-aligned above its contextual footer. It expands when no secondary row is present. |
| Secondary activity | Exactly one static row above the primary, with an optional source symbol and a selected structured value or text. A divider separates the roles when the row is visible. |
| Media primary | A title with an optional album-art and artist footer. Content and footer stay together at the bottom of the activity area. |

Useful identity can come from context, an icon or artwork with an artist. It does not always need an icon followed by a repeated provider name. A compact row still needs enough context to identify what its value means.

Text starts at its beginning and truncates at the final visible line. It never scrolls or automatically cycles. Keep a structured clock or measurement together with its essential unit; optional content yields when it cannot fit legibly.

<figure>
  <img src="/images/projects/dynamic.png" width="200" height="228" alt="Dynamic showing a music title above album art and artists, beneath its clock and weather readings." loading="lazy" decoding="async" />
  <figcaption class="image-caption">Dynamic 0.16.2, native emulator capture with example media data. This image shows a primary media activity without a secondary row.</figcaption>
</figure>

## A focused overview

Dashboard’s Snapshot contains one activity, one notification and two pinned items. More activities and pins have their own collections. This keeps the overview’s type and values readable.

A pin can combine a reading, a tap action and an associated app. They belong to the same item when they describe the same thing. A light’s brightness and its toggle do not need separate overview rows.

Weather and phone battery can use an icon plus a value. A particular device or an action-only item needs a meaningful name so the user knows what a press affects.

The notification row stays navigable when empty or when preview text is unavailable. It retains the destination to Notifications without inventing content.

<figure>
  <img src="/images/projects/dashboard.png" width="200" height="228" alt="Dashboard showing a timer activity, a Signal notification, weather and phone battery, with action icons on the right." loading="lazy" decoding="async" />
  <figcaption class="image-caption">Dashboard’s Snapshot, native 0.4.1 emulator capture with example data, reused for its unchanged native layout in 0.4.3.</figcaption>
</figure>

## Contextual physical-button actions

Dashboard and Timer place action icons in a right-side bar beside the corresponding physical buttons. The bar describes the selected item or current screen. Only useful actions take space.

In Dashboard, Music exposes play/pause on Select when its source declares that control; holding Select opens its associated app. Other activities may lead to useful source-provided controls. A read-only pin has no invented tap action.

Timer keeps its countdown and hourglass readable while showing the available edit, pause/resume or options actions beside the buttons. At menu bounds, unavailable movement arrows are omitted. Confirmation screens keep the target and safe choice readable.

Button meanings still need discoverable guidance. Dashboard shows a first-use guide and previews the associated app during a deliberate Select hold. The [watch controls guide](/docs/pebble/controls/) gives the user-facing button mapping.

## State through stable content

Timer keeps a regular wall clock at the top and a fixed countdown baseline. Its hourglass connects the state to a recognisable image:

- Ready shows sand at the bottom and stays still.
- Start turns the glass upright with sand at the top; the stream uses the existing running tick.
- Pause turns the glass horizontally and freezes remaining time.
- Resume turns it upright again.

The state should also be understandable through the countdown and available action. Animation is bounded, and reopening or refreshing a timer does not replay the flip.

<figure>
  <img src="/images/projects/timer.png" width="200" height="228" alt="Timer’s running screen with local time at the top, a large countdown, a blue hourglass and a pause action in the sidebar." loading="lazy" decoding="async" />
  <figcaption class="image-caption">Timer 0.12.0, native emulator capture with an example 20-second countdown.</figcaption>
</figure>

## Phone settings with a clear job

The published baseline apps keep settings close to the thing they configure:

| Project | Existing settings structure |
| --- | --- |
| Dynamic | Appearance; Content & priority; Connection & help. Its activity list owns the watchface’s order and visibility. |
| Dashboard | Appearance and independent activity choices, plus a pinned-item editor combining reading, tap action and associated app. Named native/store app choices make the common path usable. |
| Open Activity | One shortcut choice for Primary and one for Secondary, with setup and help explaining the corresponding system Quick Launch assignment. |
| Timer | Timer creation, editing and options on the watch, where timers and alarms are owned. |

Phone appearance is separate from watch appearance. Opening settings or choosing a named app should not automatically focus a text input. Keep an edited item’s fields together and show relevant validation beside them.

In Dashboard, global Save includes an open pin editor. A confirmed save closes that editor while leaving the settings page open; validation or save/transport failures preserve the unfinished edit. Open Activity also leaves settings open, and an uncertain save keeps its draft and offers an explicit saved-state reload or retry. Published Dynamic 0.16.2 submits and closes its Clay page. Local Dynamic 0.17.0 adds the bundled controller for [Save-and-stay with inline confirmation](/docs/design/pebble-ui-system/#save-stays-open). The modern local configuration pages follow that workflow; legacy return-URL submission still closes.

## Phone appearance in the local candidates

Appearance stays on the phone. Timer 0.13.0 adds a small Light/Dark watch-appearance page with help, while timer creation, editing and alarms remain on the watch. Open Activity 0.2.0 adds a separate Watch appearance selector alongside its Primary and Secondary shortcut pickers. These are local candidate changes, not features of the older captures above.

## Platform boundaries

These are Pebble patterns shaped by its screen, buttons and lifecycle. Phone’s eventual Android interface needs its own implementation guidance; this page does not claim that work is complete. The [website visual identity](/docs/design/visual-identity/) records web-specific choices separately. Cross-project consistency comes from clear hierarchy, honest state and predictable actions; app layouts and packaged assets remain owned by their projects.

Detailed examples live in [Dynamic’s native style](https://github.com/xefensor/pebble-watchface-dynamic/blob/7b5daced6a8c7974425e1b3fb927071d1501df3d/docs/NATIVE-STYLE.md), [Dashboard’s implementation](https://github.com/xefensor/pebble-app-dashboard/blob/61e4babc91bef0409c14f8c8699053d047baa2be/docs/IMPLEMENTATION.md), [Timer 0.12.0](https://github.com/xefensor/pebble-app-timer/blob/v0.12.0/README.md) and [Open Activity 0.1.6](https://github.com/xefensor/pebble-app-open-activity/blob/v0.1.6/README.md).
