---
layout: ../../../layouts/DocLayout.astro
title: Integrate Core
description: Understand the shared readings library and the responsibilities retained by its host.
section: Develop
order: 2
---

**Core 0.5.1** is a library embedded in consuming watchfaces. It supplies selected readings, bounded state and transport helpers. It is not an installed app or background service.

Its repository is `pebble-lib-core`; the stable package and import name remain **`pebble-watchface-core`**.

## What Core owns

- Coordination of the phone app’s first two global complication choices.
- Bounded reading normalization, freshness, expiry and permitted cache restoration.
- A serialized phone-to-watch message queue.
- Native packet validation and compatibility with the existing wire versions.
- Compatible legacy music, notification and phone-status context interfaces.

The readings contract is bounded. Core does not supply a weather provider, choose watchface geometry or provide general plugin action execution.

## What your host owns

The watchface retains its Pebble services, event dispatcher, AppMessage callbacks, persistence namespace, fonts, drawing, settings, permissions, vibration and Quiet Time behaviour.

Use one dispatcher and one shared message queue. Core does not register a second set of SDK lifecycle handlers on your behalf.

## Pin the package

Download the exact versioned package and checksums from [Core 0.5.1](https://github.com/xefensor/pebble-lib-core/releases/tag/v0.5.1). A consuming project can vendor the package and reference it from its manifest:

```json
{
  "dependencies": {
    "pebble-watchface-core": "file:vendor/pebble-watchface-core-0.5.1.tgz"
  }
}
```

Record its source version and checksum, update the lockfile and rebuild the consumer. Publishing a library release does not change the copy embedded in an installed watchface.

## Readings-only integration

Hosts using an independent activity engine can use:

```js
var core = require('pebble-watchface-core/readings');
```

This entry exports `createComplications`, `createMessageQueue` and `wire` without loading the legacy context coordinator. On the native side, use the readings API and one `WfcReadings` state.

The lifecycle is explicit: initialize the state, restore permitted cached readings, route received packets, forward connection changes, tick freshness, and report transport outcomes through the matching request functions.

An activity engine can share the same queue through declared snapshot channels. Snapshot replacement applies to the registered channel’s data and sidecars together; ordinary commands retain their ordering.

## Preserve meaning and privacy

Receipt time and observation time are different. Cache restoration does not renew the original observation or validity. Expired readings must not remain visible as current values.

Music and notification content stays transient. Do not persist private context or copy it into diagnostic logs. Source permissions belong to the phone app and cannot be inferred from the presence of cached data.

Core’s compatible legacy context behaviour is documented for existing consumers. New activity authoring belongs in the separate [Activities guide](/docs/develop/activities/).

## Authoritative reference

The repository owns the exact function signatures, storage range, packet budgets and compatibility rules:

- [Core 0.5.1 host contract](https://github.com/xefensor/pebble-lib-core/blob/v0.5.1/docs/HOST-CONTRACT.md)
- [Released source](https://github.com/xefensor/pebble-lib-core/tree/v0.5.1)
- [Package, SDK archive and checksums](https://github.com/xefensor/pebble-lib-core/releases/tag/v0.5.1)

Treat a package update as an independent consumer change: pin it, build it, check the affected native behaviour and publish that consumer’s own version.
