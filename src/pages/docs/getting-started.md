---
layout: ../../layouts/DocLayout.astro
title: Getting started
description: Choose the Pebble apps you need and understand how they work together.
section: For users
order: 1
---

XOCE’s current collection is for PebbleOS: Dynamic, Dashboard, Timer and Open Activity. This guide helps you choose and use the apps; the [developer section](/developers/) covers the libraries and integrations behind them.

The current watch builds target **Pebble Time 2 / Emery, 200 × 228**, and are published as development prereleases. Support for other Pebble models is not established by these builds.

## Choose what you need

| If you want to… | Start with |
| --- | --- |
| See ongoing activities alongside the time | [Dynamic](/projects/dynamic/) |
| Start and manage countdowns on the watch | [Timer](/projects/timer/) |
| Browse an activity, notifications and pinned items | [Dashboard](/projects/dashboard/) |
| Open the app associated with Dynamic’s displayed activity | [Open Activity](/projects/open-activity/) |

Install the individual apps you want. Activities and Core are developer libraries already bundled into their consumers; there is no separate Activities or Core app to install.

## A useful first setup

**Timer → Dynamic → Open Activity** is a practical way to try the connected workflow:

1. Install Timer and start a countdown on the watch.
2. Select Dynamic as your watchface and enable the Timer activity in its settings.
3. Optionally install Open Activity, choose a Primary shortcut and assign that same app to the matching Quick Launch button.
4. Return to Dynamic. Use the shortcut to open Timer from its displayed activity.

The phone app mediates activity sharing and app opening. Timer still owns the native countdown and alarm. A successful native alarm does not require the phone to stay connected.

[Follow the setup guide](/docs/pebble/setup/).

## Add Dashboard when you want an overview

Dashboard is a separate watch app. Its opening view combines one current activity, the latest available notification and two pinned items. It has its own activity order and settings, independent of Dynamic.

A pin can show a reading, perform an action, open an associated app, or combine these. For example, a pin can show a value and have an independent action. Which capabilities are available depends on the installed provider and its permissions.

[Set up Dashboard](/docs/pebble/setup/#dashboard) or [learn its controls](/docs/pebble/controls/#dashboard).

## What to expect

- Activity text stays still, starts at the beginning and cuts off at the end when it does not fit.
- Any eligible activity can be primary or secondary. Dynamic’s secondary is one row.
- Paused timers disappear from compatible activity views after five minutes, while remaining saved in Timer.
- Open Activity opens the associated app as a whole. It does not choose a particular timer or notification inside it.
- Timer Pause/Resume from Dashboard is not implemented.

Product screenshots on this site are native emulator captures with example data, shown inside illustrated watch cases. Automated and emulator checks are recorded in the repositories; they are distinct from testing on your phone and physical watch.

## Next steps

[Set up your watch](/docs/pebble/setup/) · [Watch controls](/docs/pebble/controls/) · [Troubleshooting](/docs/pebble/troubleshooting/)
