---
layout: ../../../layouts/DocLayout.astro
title: Build an activity provider
description: Publish typed activity content with the current schema 4 API and leave presentation to the host.
section: For developers
order: 1
---

**Activities 0.4.4 is the public development prerelease used by this guide.** It is an embedded library and provider convention for stock PebbleOS. New providers publish `activity/summary` **schema 4**; a native host can consume its **ACT3** profile.

Users install an app or plugin that bundles the library. They do not install a separate Activities service. The public library and a released app’s embedded copy can differ: current app repositories vendor a newer 0.4.5 snapshot. That does not make 0.4.5 a public library download. See [public library versions](/docs/develop/building/#library-versions) and [exact bundled packages](/docs/develop/building/#bundled-packages).

## Start with a summary

Build the [complete Activity Summary example](/examples/activity-summary/) first. It is a phone-only plugin with manually authored sample data, local settings, a full manifest, a pinned library, offline tests and a PBW builder. It needs **Node 22.23.4 or newer and Python 3.12**, with no Pebble SDK. A compatible Pebble phone app and Dynamic or Halftone are needed only for the installation steps.

### Get and build the example

Get the files from the [source index](/examples/activity-summary/) with their subdirectories intact, or clone the website and copy the example into a separate working folder:

```sh
git clone https://github.com/xefensor/xoce.git xoce
cp -R xoce/public/examples/activity-summary ./activity-summary
cd activity-summary
node scripts/fetch-library.mjs
npm ci --ignore-scripts --offline
npm run manifest:check
npm test
npm run build
```

If you already have the website checkout, start at its root and copy the example out before running the fetch, install, test and build commands above:

```sh
cp -R public/examples/activity-summary ../activity-summary
cd ../activity-summary
```

The fetch script downloads **`pebble-activities-0.4.4.tgz`** from its [public release](https://github.com/xefensor/pebble-lib-activities/releases/tag/v0.4.4) and verifies this SHA-256 before installing anything:

```text
dffec3e05041515fbf9385a641adf6b40aedda7e8460c0d11ecb4ed019cd5abe
```

The exact dependency is `file:vendor/pebble-activities-0.4.4.tgz`; the committed lockfile also pins its integrity. Compare [upstream.json](/examples/activity-summary/upstream.json) with the release’s [checksums](https://github.com/xefensor/pebble-lib-activities/releases/download/v0.4.4/SHA256SUMS.txt), and read its [PolyForm Noncommercial licence and required attribution](https://github.com/xefensor/pebble-lib-activities/blob/v0.4.4/LICENSE). The example source download contains no library binary or installed modules.

For an offline machine, obtain that same archive beforehand and replace the fetch command with:

```sh
node scripts/fetch-library.mjs --from /path/to/pebble-activities-0.4.4.tgz
```

The remaining commands run offline. The output is **`build/Activity-Summary-Demo-0.1.0.pbw`**. It contains a phone-only `appinfo.json`, the bundled plugin, local settings and the upstream licence. It has no native watch screen, network permission, alarm or app-opening action. Build it in your downloaded copy, outside the website’s public source folder.

### Understand the three connected files

| File | Responsibility |
| --- | --- |
| [src/provider.cjs](/examples/activity-summary/src/provider.cjs) | Read the demo’s authoritative state and author typed summary records |
| [src/plugin.cjs](/examples/activity-summary/src/plugin.cjs) | Register the SDK handlers and serialize this provider’s source requests |
| [package.json](/examples/activity-summary/package.json) | Declare the plugin UUID, `plugin.js` and complete `activity/summary` source |

The declaration is generated from the **real provider’s `sourceDeclaration`**, including `summary.SOURCE_PROPERTIES`; it is serialized into `package.pebble.plugin.sources`. It declares only the `summary` item. You do not need Timer’s older `live`, `card` or `session` declarations for a new summary-only provider.

`npm run manifest:check` verifies the checked-in manifest against that API. If you deliberately change the provider declaration, run `npm run manifest`, then review the generated JSON. Keep the provider UUID and manifest UUID identical; generate your own UUID before publishing an independently named plugin.

For a fresh authoritative source, the authoring API is small:

```js
var summary = require('pebble-activities/summary');

var provider = summary.defineProvider({
  pluginUuid: OWN_PLUGIN_UUID,
  displayName: 'Delivery',
  storage: localStorage,
  readCurrent: function () {
    return [summary.standard('parcel-42', {
      name: 'Parcel',
      icon: 'delivery',
      headline: summary.text('Driver nearby'),
      detail: summary.text('Front door')
    })];
  }
});
```

Pass actual dispatched requests to `provider.handleSource`. The complete example registers it through a serial promise queue; asynchronous reads for one provider must not race each other. The helper starts no timers or SDK handlers itself. Keep an item’s ID stable while it represents the same ongoing instance. Return `[]` in the next complete response to withdraw it; the helper still supplies the required snapshot header.

### Install, enable and observe

1. Use a Pebble phone app with plugin support. Enable **Plugins**, or its preview feature where the phone-app build requires it, and install Dynamic or Halftone separately.
2. Open the generated PBW on the phone to install it. **Activity Summary Demo** is a phone-only plugin, so there is no new native app to launch on the watch.
3. In the chosen watchface’s settings, enable activity sharing and include **Activity Summary Demo** in the activity provider priority order. Give it an available visible role; a higher-priority source can occupy the slot. Return to that watchface with the phone connected. The [activity setup guide](/docs/pebble/activities/) covers the host side.
4. Open **Activity Summary Demo** settings in the phone app. Its save status confirms phone storage; it cannot confirm what the watch has displayed.

Use these steps in order to check the complete lifecycle:

| Step in the demo settings | Expected result on the next source read |
| --- | --- |
| First read | One “Parcel at depot” item |
| Change the message and save | New text under the same `manual-demo-1` identity |
| Start the countdown | A deadline anchored once at Start, not renewed by reads |
| Pause the countdown | `state: 'paused'` with fixed remaining `seconds` |
| Withdraw the item | Complete empty activity set; the old item disappears |
| Show the expiring item | One absolute `visibleUntil`; repeated fresh reads do not extend its fifteen seconds |

The demo suggests a five-second refresh with fifteen-second fresh validity to reduce waiting. The phone controls source scheduling; those values do not guarantee an update every five seconds. If nothing appears, check plugin support, installation, the selected watchface’s provider order and connectivity before changing the provider code.

`npm test` uses the actual pinned library to check identity, updates, paused clocks, withdrawal, expiry and failure handling. It also executes the built PBW’s real plugin bundle against simulated SDK handlers and storage. These are offline source/package checks, not a Pebble phone app, emulator or physical-watch result. Follow the table on your phone/watch to establish that integration.

## Choose the content

| Content | Helper |
| --- | --- |
| A message or status | `summary.text('Driver nearby')` |
| A measurement | `summary.value(72, '%')` |
| A running countdown | `summary.countdown({ deadline: endUtcSeconds })` |
| A fixed remaining time | `summary.countdown({ seconds: 120 })` |
| Running elapsed time | `summary.elapsed({ since: startUtcSeconds })` |
| A fixed elapsed duration | `summary.elapsed({ seconds: 120 })` |

These datums can be used for a standard summary’s `headline` and optional `detail`. Timestamps use integer UTC seconds. Preserve the actual clock anchor: do not create a later deadline each time the host reads the source.

For a paused countdown, publish the fixed remaining seconds and the record’s paused state. Pausing one source does not implicitly freeze every clock in its content.

## Standard fields

`summary.standard(id, options)` produces a standard record.

| Field | Meaning |
| --- | --- |
| `id` | Stable identity for this ongoing instance |
| `headline` | Required text, value or clock datum |
| `detail` | Optional second datum |
| `summary` | Optional compact datum choice: `headline` or `detail` |
| `state` | `active`, `paused`, `completed` or `cancelled`; defaults to active |
| `result` | Explicit opt-in to showing a completed or cancelled result; defaults to false |
| `name` | Optional instance context, such as a parcel name |
| `icon` | A supported semantic symbol or validated bitmap |
| `visibleUntil` | Optional earlier visibility deadline |

Built-in semantic symbols are `activity`, `timer`, `stopwatch`, `media`, `message`, `call`, `navigation`, `workout`, `recording`, `download` and `delivery`.

The plugin supplies meaning rather than coordinates, fonts or a mandatory icon-and-label header. A generic activity can use a media symbol without becoming a media presentation.

## Media fields

```js
summary.media('player-main', {
  title: 'Example song',
  artist: 'Example artist',
  itemId: 'track-42',
  playback: 'playing'
});
```

A media summary requires a title and can include `artist`, validated bitmap `artwork`, `itemId` and `playback`. Playback values are `playing`, `paused`, `buffering`, `stopped` and `unknown`. Missing metadata remains absent.

Keep `itemId` stable when artwork or artist information arrives for the same item. Change it for the next item. This gives a host a meaningful transition boundary without animating every refresh.

Media does not have the standard record’s state, seek, timeline or layout fields. Artwork is bitmap content in the documented format, not an arbitrary image URL.

## App opening and actions

Both record types can include:

- `openApp: { watchAppUuid: APP_UUID }` to name an associated installed watch app.
- `actions` containing up to three contextual action descriptors.
- `entityRef` to refer separately to a declared source entity.

An action descriptor contains `id`, `label`, the declared SDK `action`, an `args` object and an optional `semantic`. It describes a capability; the consuming host must support and authorize execution.

Dynamic and Halftone request display data and `openApp`, not contextual actions. Open Activity reads the chosen watchface’s recently displayed destination to open the whole app; it does not bundle the Activities library or select a particular saved item. Dashboard supports controls where its source binding provides them, but the current Timer provider has no Dashboard Pause/Resume action. The teaching plugin above deliberately declares neither app destinations nor actions.

## Fresh reads and saved owners

Use `defineProvider` when `readCurrent` reads authoritative current state. By default, the helper suggests a 30-second refresh and gives fresh data 90 seconds of validity. A configured validity must be longer than the refresh interval. The helper starts no timers and registers no SDK handlers by itself.

Use `defineSnapshotProvider` for state imported from a saved owner, such as a native Timer. Retain the owner’s revision, original observation and validity. Polling a saved snapshot does not turn it into a fresh observation.

The native timer remains responsible for its own saved state and alarms. The activity library cannot make a changed phone snapshot pause a watch alarm.

## Let the host choose presentation

Dynamic selects Primary and Secondary from its own saved priority list. Its secondary occupies one static row; the primary expands when that row is absent. Dashboard has its own selection and controls. Providers do not choose either host’s layout or priority.

Text starts at its beginning and truncates when necessary. Do not depend on a marquee, automatic paging or a particular number of lines. Test both long and short content, expiry, empty responses and removed permissions.

## Current reference

This guide introduces the released API. The repository owns the precise specification, byte limits, bitmap encoding and compatibility details:

- [Schema 4 summaries and ACT3, Activities 0.4.4](https://github.com/xefensor/pebble-lib-activities/blob/v0.4.4/docs/SUMMARY-SPECIFICATION.md)
- [Released implementation](https://github.com/xefensor/pebble-lib-activities/blob/v0.4.4/src/js/summary.js)
- [Library package and checksums](https://github.com/xefensor/pebble-lib-activities/releases/tag/v0.4.4)

The maintained repository is `pebble-lib-activities`; the older `pebble-activities` repository is archived. The package and import name remain `pebble-activities`. Schema 1/2/3 and ACT1/ACT2 are compatibility APIs, not the recommended starting point for a new provider.
