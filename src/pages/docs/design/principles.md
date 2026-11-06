---
layout: ../../../layouts/DocLayout.astro
title: Design principles
description: Readable, predictable interfaces that respect each device and the person using it.
section: Design
order: 1
---

XOCE explores new technology and new ways to interact with it. The everyday experience should be understandable, responsive and useful. These are the initial shared principles for the project; platform-specific components remain owned by their apps.

## Start with a person’s task

Lead with what someone can do. Reveal technical details when those details help them make a choice. Common actions should be easy to find without knowing a UUID, protocol name or internal data shape.

An unfamiliar interaction needs a visible reason to exist and an understandable result. A prototype should explain what it is exploring and which parts are illustrative.

## Make the hierarchy readable

Give the most important content enough room and a clear visual weight. Keep essential values and their units together. Use labels when they identify meaning; avoid repeating the same fact in an icon, title and secondary line.

On Dynamic, the primary activity has a larger content area and the secondary has one row. In Dashboard, one activity, one notification and two pinned items form the initial overview. These are device-specific decisions, not a universal grid imposed on every XOCE app.

## Respect the platform

Pebble has physical buttons, a small display, constrained memory and a battery budget. Android has its own navigation, permissions and input conventions. KDE applications should behave naturally within the desktop.

Share terminology, semantic colour roles and useful icon meanings across the project. Adapt layout, typography, controls and density to the actual platform.

## Make state and actions predictable

Show the action that is actually available. Keep an absent capability distinct from a disabled or failed one. A summary with no useful action does not need an empty detail screen.

Preserve selection when content moves. If a selected item disappears, do not silently turn the user’s next press into an action on another item.

Save feedback should reflect a confirmed write. Keep an unfinished draft after a failure. Opening settings should leave keyboard focus and scrolling under the user’s control.

## Let motion explain a change

Use short, bounded transitions for meaningful changes. A new media item can arrive with motion; an ordinary clock tick or artwork correction should settle quietly.

Watch text stays static, starts at the beginning and cuts off at the end when it does not fit. It does not marquee, automatically page or cycle. Avoid decorative work while a watch app is covered or a device is otherwise idle.

On the website, support reduced motion, clear focus indicators and ordinary browser navigation. Interactive experiments should remain optional to reading the surrounding material.

## Preserve the source’s truth

Data can be current, expired, unavailable or unconfirmed. These states are not interchangeable. A new transport receipt does not make an old observation fresh.

A displayed timer countdown is a presentation of the owner’s state. It does not authorize another app to cancel the timer’s native alarm. The interface should describe the actual capability and result.

## Be clear about maturity

Label development builds, prototypes and planned work honestly. An emulator capture establishes a rendering result; a browser study explores a design. Neither alone establishes physical-device battery life, radio reliability or comfort.

Keep user guides focused on released behaviour. Preserve historical research and superseded designs with their original context.

## Existing examples

These app-level documents informed the initial principles:

- [Dynamic’s native style and motion](https://github.com/xefensor/pebble-watchface-dynamic/blob/7b5daced6a8c7974425e1b3fb927071d1501df3d/docs/NATIVE-STYLE.md)
- [Dashboard’s implementation and interaction rules](https://github.com/xefensor/pebble-app-dashboard/blob/61e4babc91bef0409c14f8c8699053d047baa2be/docs/IMPLEMENTATION.md)
- [Timer’s current release](https://github.com/xefensor/pebble-app-timer/releases/tag/v0.12.0)

The site is the place to develop shared guidance. A common visual identity should grow through reviewed examples and actual device constraints.
