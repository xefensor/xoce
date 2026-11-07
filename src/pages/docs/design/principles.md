---
layout: ../../../layouts/DocLayout.astro
title: Design principles
description: Practical guidance for understandable interfaces, new interaction ideas and the devices XOCE targets.
section: Design
order: 1
---

XOCE aims to make everyday software easy to use while leaving room to try different interfaces. This guide records practical choices for that work. The examples come from the current website and Pebble apps; an Android interface standard has not been implemented yet.

Use the [Pebble UI and UX standard](/docs/design/pebble-ui-system/) for the native watch and phone-settings design. [UI patterns](/docs/design/ui-patterns/) and [interaction guidance](/docs/design/interaction/) describe the actual Pebble workflows. The [visual identity](/docs/design/visual-identity/) covers this website.

## Start with a person’s task

Explain what someone can do, and make the usual action easy to find. Technical details belong where they help someone choose or complete a task.

Dashboard’s named app picker is one example: a person can choose an associated app by name. A custom UUID remains available for an unlisted app without becoming the ordinary setup path.

Trying a different interface should answer a concrete question about use. A future experimental edition can test that idea alongside a dependable stable edition. Experimental does not simply mean an unfinished release.

## Make the hierarchy readable

Give essential content enough room. Keep values and units together, and use labels that identify meaning without repeating it.

Dynamic gives its main activity a larger area and its secondary activity one row. Dashboard starts with one activity, one notification and two pins. Each layout is fitted to its task and display.

## Respect the platform

The current watch builds target Pebble Time 2’s 200 × 228 display, physical buttons, limited memory and battery. The website uses responsive layouts, browser links and keyboard navigation.

Share useful terms and predictable action meanings. Adapt the layout, typography and controls to each device. The website’s glass, palette and web fonts are separate from the native Pebble design. The planned Android Phone app will need its own Android interface.

## Make state and actions predictable

Offer actions the source supports. Preserve the selected target when live content changes. If that target disappears, a press must not silently operate on its replacement.

A save confirmation follows a confirmed write. A failure keeps the draft and explains what can be done next. Opening settings should leave keyboard focus under the user’s control.

## Let motion explain a change

Keep transitions short and bounded. Dynamic can animate a new media item without replaying the entrance on a timer tick or artwork correction.

Watch text stays still and shows the beginning that fits. Avoid decorative work while the app is covered or idle. The website respects reduced motion and keeps primary navigation and guides usable without JavaScript.

## Preserve the source’s truth

Missing, expired, unavailable and confirmed-empty data have different meanings. A fresh transport receipt does not make an old observation current.

A countdown summary reflects the timer owner’s state; displaying it does not grant permission to change its alarm. Dashboard can open Timer, while its Timer Pause/Resume control remains deferred. The Activities library is a Pebble integration, rather than a decided data model for all future XOCE products.

## Be clear about maturity

Distinguish available builds, planned work and deliberate experiments. Desktop–phone–watch synchronization is a future goal, not a shipped feature of the Pebble apps.

The website uses native emulator captures with example data. They show rendering results, not physical-device battery life or radio reliability. Local app candidates implementing the shared UI standard retain their own validation records; older public downloads and screenshots keep their original version context.

## Existing examples

The owning projects document their implementations:

- [Dynamic’s native style and motion](https://github.com/xefensor/pebble-watchface-dynamic/blob/7b5daced6a8c7974425e1b3fb927071d1501df3d/docs/NATIVE-STYLE.md)
- [Dashboard’s implementation and interaction rules](https://github.com/xefensor/pebble-app-dashboard/blob/61e4babc91bef0409c14f8c8699053d047baa2be/docs/IMPLEMENTATION.md)
- [Timer 0.12.0](https://github.com/xefensor/pebble-app-timer/blob/v0.12.0/README.md)
- [Open Activity 0.1.6](https://github.com/xefensor/pebble-app-open-activity/blob/v0.1.6/README.md)

Those references and the native UI standard own the detailed controls and rendering guidance. There is no shared cross-platform component kit.
