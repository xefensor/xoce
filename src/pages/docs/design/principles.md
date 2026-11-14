---
layout: ../../../layouts/DocLayout.astro
title: Design principles
description: Make the task clear, preserve intent and fit each interface to its device.
section: Design
order: 1
---

XOCE shares a way of designing, rather than one interface stretched across every device. The website introduces the products. Phone settings configure them. A Pebble watch presents time, readings and button actions in a much smaller space.

Use the [website visual reference](/docs/design/visual-identity/) for web materials and artwork, the [Pebble interface reference](/docs/design/pebble-ui-system/) for current watch and phone roles, and [interaction and state](/docs/design/interaction/) for behaviour. The [older design studies](/docs/history/pebble-ui-system/) retain their original versions and evidence.

## Start with a person’s task

Lead with what someone can accomplish. The usual action should be easy to find, with technical choices where they help complete the task.

Timer creates and controls countdowns on the watch. Dynamic and Halftone can present a countdown without acquiring its controls or alarm. Open Activity provides an optional route back to the owner. Those are separate jobs, and their interfaces should make the distinction clear.

Dashboard’s named app picker makes choosing an associated app ordinary; a custom UUID remains an advanced option. A new feature should improve a concrete task before it adds another setting or navigation layer.

## Make the hierarchy readable

Give the main content the space it needs. Keep complete values with essential units. Labels should explain meaning without repeating an icon, title and provider name unnecessarily.

Dynamic adapts its composition when an activity needs room. Halftone keeps its clock, dot border and two readings recognizable. Dashboard reserves an overview for one activity, one notification and two pins; larger collections have their own views. Shared hierarchy does not require identical layouts.

## Respect the platform

Current native products support **Time 2 / Emery, 200×228**, and **Round 2 / Gabbro, 260×260**. Round layouts measure the usable width of each circular band; a rectangular layout cannot simply be cropped into a circle.

The website uses responsive HTML, links, keyboard focus and Fira typography. Phone configuration pages use their supported WebView controls and shared settings styles. Watch apps use physical buttons, native font roles and carefully fitted app-specific graphics. Apply the appropriate [platform reference](/docs/design/pebble-ui-system/#platform-and-product-scope) instead of copying one device’s geometry to another.

## Make state and actions predictable

A press belongs to the item the person selected. A live update must not redirect it to a replacement item. A missing target cancels its action until the person deliberately navigates again.

A saved confirmation follows confirmed phone persistence. Watch delivery is a separate state. Failed or uncertain writes keep the draft and explain the available recovery. Opening a page or editor should leave keyboard focus under the person’s control; explicitly opening Search may focus its field.

## Let motion explain a change

Animate a meaningful transition, then stop. A new track can enter; its next timer tick or late artwork update should not replay the entrance. Timer’s hourglass can explain a state change while the numeric baseline stays stable.

Watch text begins at the start that fits and remains still. The website respects reduced motion. Primary navigation, documentation, theme controls and watch-shape selection retain usable fallbacks when JavaScript is unavailable.

## Preserve the source’s truth

Missing, unavailable, expired and confirmed-empty information are different states. A recent transport receipt does not make an old observation fresh. A displayed countdown does not grant control over its alarm.

Keep example data identifiable. Native emulator images demonstrate rendering; browser settings previews use a simulated bridge. Neither proves live-provider reliability, physical-watch comfort or battery life. Preserve actual capture versions when a verified unchanged renderer allows reuse.

## Be clear about maturity

The six current Pebble products have published releases; their [product pages](/projects/) own version and installation links. The broader KDE Plasma and Android direction remains separate from those shipped Pebble interfaces. There is no completed universal Android/watch interface or automatic theme-synchronisation service.

An experiment should answer a useful design question, with its status and limits visible. Historical studies, release evidence and current rules have distinct jobs. Update the current reference when an implementation changes; preserve the old evidence in history.

## Existing examples

The [interface patterns](/docs/design/ui-patterns/) show actual released compositions. The [website specimens](/docs/design/visual-identity/#website-reference) show live colour roles, typography, controls and product identities. Implementation details remain owned by the tagged app source and the [shared Pebble UI package](/docs/develop/ui/), with their licences and validation records intact.
