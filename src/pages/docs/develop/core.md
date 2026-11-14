---
layout: ../../../layouts/DocLayout.astro
title: Integrate Core
description: Understand the shared readings library and the responsibilities retained by its host.
section: For developers
order: 2
---

**Core 0.5.2** is the public library for selected readings, bounded state and transport helpers. It is embedded in a host, not installed as an app or background service. Its published native contract targets Emery/Time 2 with SDK 4.33.1.

Its repository is `pebble-lib-core`; the stable package and import name remain **`pebble-watchface-core`**.

Current Dynamic and Halftone releases bundle different, newer Core snapshots. Use the [public and bundled version table](/docs/develop/building/#bundled-packages) when changing an existing app. This guide’s runnable example deliberately uses the independently available 0.5.2 package.

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

Download the exact versioned package and checksums from [Core 0.5.2](https://github.com/xefensor/pebble-lib-core/releases/tag/v0.5.2). A consuming project can vendor the package and reference it from its manifest:

```json
{
  "dependencies": {
    "pebble-watchface-core": "file:vendor/pebble-watchface-core-0.5.2.tgz"
  }
}
```

Record its source version and checksum, update the lockfile and rebuild the consumer. Publishing a library release does not change the copy embedded in an installed watchface.

For 0.5.2, the package SHA-256 is `0d01d6daa50bed274f613c0bc4c476ab841e4a48b5d90b6b7b246867d7ca4d82`. The example fetcher verifies it against a pinned record before installing. Preserve Core’s PolyForm Noncommercial licence and upstream notices.

## Readings-only integration

Hosts using an independent activity engine can use:

```js
var core = require('pebble-watchface-core/readings');
```

This entry exports `createComplications`, `createMessageQueue` and `wire` without loading the legacy context coordinator. On the native side, use the readings API and one `WfcReadings` state.

Create one queue and one coordinator using callbacks supplied by the host:

```js
var send = core.createMessageQueue({
  keys: keys,
  send: function (payload, success, failure) {
    Pebble.sendAppMessage(payload, success, failure);
  },
  later: setTimeout,
  cancelLater: clearTimeout
});
var readings = core.createComplications({
  pebble: Pebble,
  storage: localStorage,
  keys: keys,
  send: send,
  now: function () { return Date.now(); },
  later: setTimeout,
  cancelLater: clearTimeout,
  cacheKey: 'my-host-public-readings-v1',
  getSettings: function () { return {language: 'en'}; }
});
```

`keys` is the host’s generated message-key map, including `COMPLICATION_DATA`. The clock callback returns **milliseconds**. Start or refresh the coordinator with `readings.refresh()` from the host’s own ready/request dispatcher. `readings.configure()` republishes after a host setting change; `readings.status()` supplies bounded diagnostic state. Do not register another set of SDK handlers inside the library.

On C, include `<pebble-watchface-core/readings.h>` and keep one `WfcReadings`. Initialize it with a host-owned `WfcConfig`, restore its permitted cache, route `COMPLICATION_DATA` bytes into `wfc_readings_receive`, forward connection changes and call `wfc_readings_tick` from the host’s minute tick. Native timestamps use **Unix seconds**. Only draw a slot while `complication_is_fresh(slot, now)` is true.

Reserve all eight cache keys beginning at `cache_first_key`, even if fewer chunks are currently used. An AppMessage inbox of at least **6,144 bytes** includes room for the bounded packet and dictionary overhead. The host reports an accepted reading request with `wfc_readings_request_accepted`; it owns outbox failure/retry. The legacy `wfc_request_*` context API belongs to `WatchfaceCore`, not this lean state.

An activity engine can share the same queue through declared snapshot channels. Snapshot replacement applies to the registered channel’s data and sidecars together; ordinary commands retain their ordering.

## Run the small host

The [complete Core readings example](/examples/core-readings/) contains the phone dispatcher, C SDK callbacks, persistence adapter, minimal watch display and portable JS/C tests. Copy it out of the website before fetching or building:

```sh
git clone https://github.com/xefensor/xoce.git xoce-reference
cp -R xoce-reference/public/examples/core-readings ./core-readings
cd core-readings
node scripts/fetch-library.mjs
npm ci --ignore-scripts
npm test
npm run build
```

The first fetch needs the public release download. Afterward the tests need Node 22 or later and a C99 compiler, with no SDK or sibling checkout. An already downloaded archive can be supplied with `node scripts/fetch-library.mjs --from /path/to/pebble-watchface-core-0.5.2.tgz`, followed by `npm ci --ignore-scripts --offline`.

The tests run the actual package’s JavaScript coordinator with simulated global preferences, a public phone reading and transport. Its encoded packet is decoded by a C executable compiled against the same package. They check ready state, original receipt and expiry through cache restoration, disconnect, expiry and invalid-packet clearing. `npm run build` retains that portable fixture under `build/`.

With the Pebble CLI/SDK installed, `npm run build:watch` also builds the example’s Emery PBW. Select the first two global complications in the Pebble phone app, enable plugin support and open **Core Readings Demo** while connected. Expect the selected values or explicit missing/expired placeholders. Change a selected source, reconnect and remove permission to check the real host path before adding your own UI.

The example’s native package build was checked with CLI 5.1.2 and SDK 4.44 for Emery. The portable tests use simulated data; no native emulator, real phone or physical-watch run is claimed. Round 2 is outside this example’s declared target.

## Preserve meaning and privacy

Receipt time and observation time are different. Cache restoration does not renew the original observation or validity. Expired readings must not remain visible as current values.

Music and notification content stays transient. Do not persist private context or copy it into diagnostic logs. Source permissions belong to the phone app and cannot be inferred from the presence of cached data.

Core’s compatible legacy context behaviour is documented for existing consumers. New activity authoring belongs in the separate [Activities guide](/docs/develop/activities/).

## Authoritative reference

The repository owns the exact function signatures, storage range, packet budgets and compatibility rules:

- [Core 0.5.2 host contract](https://github.com/xefensor/pebble-lib-core/blob/v0.5.2/docs/HOST-CONTRACT.md) (the tagged document retains its earlier candidate heading; the release/package identity is 0.5.2)
- [Core 0.5.2 readings API](https://github.com/xefensor/pebble-lib-core/blob/v0.5.2/include/readings.h)
- [Released source](https://github.com/xefensor/pebble-lib-core/tree/v0.5.2)
- [Package, SDK archive and checksums](https://github.com/xefensor/pebble-lib-core/releases/tag/v0.5.2)

Treat a package update as an independent consumer change: pin it, build it, check the affected native behaviour and publish that consumer’s own version.
