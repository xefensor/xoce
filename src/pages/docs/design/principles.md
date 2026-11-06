---
layout: ../../../layouts/DocLayout.astro
title: Design principles
description: Established choices for readable content, predictable actions and interfaces that fit the device.
section: Design
order: 1
---

These principles record decisions used in the current website and Pebble projects. Individual apps own their layouts and native controls. The [visual identity](/docs/design/visual-identity/) describes the website’s styling; [UI patterns](/docs/design/ui-patterns/) and [interaction guidance](/docs/design/interaction/) explain existing app behaviour.

## Start with a person’s task

Lead with what someone can do. Reveal technical details when those details help them make a choice. Common actions should be easy to find without knowing a UUID, protocol name or internal data shape.

An unfamiliar interaction needs a visible reason to exist and an understandable result. Dashboard’s named app picker makes choosing an associated app practical; a custom UUID route remains available for an unlisted destination without becoming the ordinary setup path.

## Make the hierarchy readable

Give the most important content enough room and a clear visual weight. Keep essential values and their units together. Use labels when they identify meaning; avoid repeating the same fact in an icon, title and secondary line.

On Dynamic, the primary activity has a larger content area and the secondary has one row. In Dashboard, one activity, one notification and two pinned items form the initial overview. These are device-specific decisions, not a universal grid imposed on every XOCE app.

## Respect the platform

The current watch builds target Pebble Time 2’s 200 × 228 display, with physical buttons, constrained memory and a battery budget. The website uses responsive layouts, ordinary browser links and keyboard focus.

Share useful terminology and clear action meanings. Adapt layout, typography, controls and density to the platform. The website’s orange palette and web fonts are not a requirement for the watch apps.

## Make state and actions predictable

Show the action that is actually available. Keep an absent capability distinct from a disabled or failed one. A summary with no useful action does not need an empty detail screen.

Preserve selection when content moves. If a selected item disappears, do not silently turn the user’s next press into an action on another item.

Save feedback should reflect a confirmed write. Keep an unfinished draft after a failure. Opening settings should leave keyboard focus and scrolling under the user’s control.

## Let motion explain a change

Use short, bounded transitions for meaningful changes. A new media item can arrive with motion; an ordinary clock tick or artwork correction should settle quietly.

Watch text stays static, starts at the beginning and cuts off at the end when it does not fit. It does not marquee, automatically page or cycle. Avoid decorative work while a watch app is covered or a device is otherwise idle.

On the website, support reduced motion, clear focus indicators and ordinary browser navigation. Primary navigation and guide content remain usable without JavaScript.

## Preserve the source’s truth

Data can be current, expired, unavailable or unconfirmed. These states are not interchangeable. A new transport receipt does not make an old observation fresh.

A displayed timer countdown is a presentation of the owner’s state. It does not authorize another app to cancel the timer’s native alarm. Dashboard Timer Pause/Resume remains deferred; the interface should describe the actual capability and result.

Timer’s Reset restores the saved duration as Ready. Starting again requires a separate Select, and Ready persists through closing and reopening. Opening Timer through an associated app destination opens the whole app without selecting or operating a particular timer.

## Be clear about maturity

Label development builds honestly. Product images on this site are native emulator captures with example data. They establish a rendering result; they do not establish physical-device battery life, radio reliability or comfort.

Keep user guides focused on current implemented behaviour. Historical research and superseded designs retain their original context in the owning repositories.

## Existing examples

These app-level documents record the existing implementations:

- [Dynamic’s native style and motion](https://github.com/xefensor/pebble-watchface-dynamic/blob/7b5daced6a8c7974425e1b3fb927071d1501df3d/docs/NATIVE-STYLE.md)
- [Dashboard’s implementation and interaction rules](https://github.com/xefensor/pebble-app-dashboard/blob/61e4babc91bef0409c14f8c8699053d047baa2be/docs/IMPLEMENTATION.md)
- [Timer 0.12.0 and its Reset behaviour](https://github.com/xefensor/pebble-app-timer/blob/v0.12.0/README.md)
- [Open Activity 0.1.6 settings and launch behaviour](https://github.com/xefensor/pebble-app-open-activity/blob/v0.1.6/README.md)

Shared guidance lives here; project-specific rendering and controls remain documented with their owning implementations. This does not imply a completed shared component kit or visual redesign of the apps.
