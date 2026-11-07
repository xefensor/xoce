---
layout: ../../../layouts/DocLayout.astro
title: Build an activity provider
description: Publish typed activity content with the current schema 4 API and leave presentation to the host.
section: For developers
order: 1
---

**Activities 0.4.4** is an embedded developer library and a provider convention for stock PebbleOS. New providers should use `activity/summary` **schema 4**. A native host can consume its **ACT3** profile.

Users install an app or plugin that bundles the library. They do not install a separate Activities service.

## Start with a summary

This provider entry uses the actual `pebble-activities/summary` API. Replace `OWN_PLUGIN_UUID` with the UUID of your installed plugin, and replace the illustrative delivery data with an authoritative read from your source.

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

Pebble.registerSourceHandler(provider.handleSource);
```

Declare the provider in the plugin manifest’s `sources` list: category `activity`, item `summary`, and the properties in `summary.SOURCE_PROPERTIES`. The provider exposes the complete serializable declaration as `provider.sourceDeclaration` for your packaging step.

For a bundled PBW, that declaration belongs under `pebble.plugin.sources` in `package.json`, and the packaged app must include its plugin script. The [Timer manifest](https://github.com/xefensor/pebble-app-timer/blob/v0.14.5/package.json) is a complete bundled example; it also declares older compatibility sources that a new summary-only provider does not need.

The helper manages response metadata. Your authoring code supplies the content. Keep an item’s ID stable while it represents the same ongoing instance. Return `[]` in the next complete response when nothing should be displayed.

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

Dynamic requests display data and `openApp`, not contextual actions. Open Activity can use Dynamic’s recently displayed destination to open the whole app. Dashboard supports controls where its source binding provides them, but the current Timer provider has no Dashboard Pause/Resume action.

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

The repository name is `pebble-lib-activities`; the package and import name remain `pebble-activities`. Schema 1/2/3 and ACT1/ACT2 are compatibility APIs, not the recommended starting point for a new provider.
