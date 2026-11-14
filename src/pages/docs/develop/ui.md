---
layout: ../../../layouts/DocLayout.astro
title: Use XOCE UI
description: Add native drawing helpers or shared phone settings styles while keeping your app in control.
section: For developers
order: 4
---

**XOCE UI** is the `pebble-xoce-ui` package. It provides small C drawing helpers and a JavaScript export containing the phone settings CSS. It does not own your app’s windows, buttons, timers, saved settings or phone bridge.

Use it for presentation. Use [Core](/docs/develop/core/) for selected readings and transport, or [Activities](/docs/develop/activities/) for an activity provider. You can use the stylesheet without adding a native UI.

## Choose a package

The public standalone release is [UI 0.1.1](https://github.com/xefensor/pebble-lib-ui/releases/tag/v0.1.1). Its documented native target is Emery/Time 2 with SDK 4.33.1. The five current native XOCE apps instead bundle a checked **0.1.3** snapshot for SDK 4.44 and Emery/Gabbro. That bundled version is not a separate public library release.

For an existing app, preserve its own dependency and `vendor/UI.json` unless you intend to upgrade it. For a new integration using the public package, download [pebble-xoce-ui-0.1.1.tgz](https://github.com/xefensor/pebble-lib-ui/releases/download/v0.1.1/pebble-xoce-ui-0.1.1.tgz) and [SHA256SUMS.txt](https://github.com/xefensor/pebble-lib-ui/releases/download/v0.1.1/SHA256SUMS.txt), verify the archive, then pin it:

```sh
mkdir -p vendor
# Put the verified release archive in vendor/ first.
npm install --save-exact ./vendor/pebble-xoce-ui-0.1.1.tgz
```

The archive’s SHA-256 is `f75f39f047da3684973db7680e06a89ee2fa032220b81f28ac05fe989046d0a5`. Commit the lockfile and provenance, retain the package licence, and check its platform contract before using native code. The [version table](/docs/develop/building/#bundled-packages) identifies the current app pins.

## Native drawing helpers

Include the public header in your host’s existing drawing code:

```c
#include <pebble.h>
#include <pebble-xoce-ui/pebble-xoce-ui.h>

static void content_update(Layer *layer, GContext *ctx) {
  GRect bounds = layer_get_bounds(layer);
  GRect box = GRect(8, 40, bounds.size.w - 16, 64);
  GRect fitted = xoce_ui_fit_image(box, 40, 40);
  GPoint center = GPoint(fitted.origin.x + fitted.size.w / 2,
                        fitted.origin.y + fitted.size.h / 2);
  xoce_ui_draw_content_icon(ctx, XOCE_ICON_TIMER, center, 24, GColorBlack);
}
```

Your app creates the layer, sets this update procedure and destroys the layer. The example assumes a light background; pass the actual contrasting foreground from your own palette.

| Public helper | What the host supplies |
| --- | --- |
| `xoce_ui_fit_image(box, width, height)` | A destination box and positive source dimensions; receives an aspect-fitted, centred rectangle |
| `xoce_ui_text_origin_y(bounds, ink_top, ink_bottom)` | Measured glyph ink bounds, rather than a guessed baseline |
| `xoce_ui_draw_content_icon(...)` | Semantic icon, centre, size and foreground; avoids linking action-control helpers into a watchface |
| `xoce_ui_draw_header(...)` | Title, clock, content width, colours and the host’s text-drawing callback |
| `xoce_ui_draw_action_bar(...)` | Actual rail bounds, three icons, offsets and colours |
| `xoce_ui_press_offset(elapsed_ms)` | Time since a real press; the host owns animation scheduling and invalidation |

These helpers do not reserve screen space or assign gestures. Use the current platform’s bounds, measure real font ink and keep the owning app’s input rules. The public 0.1.1 constants and Emery action anchors are not a universal Round 2 layout. Do not copy a 200×228 geometry or custom-font role into every product.

## Phone settings stylesheet

The public JavaScript entry returns a CSS string. Insert it when generating your local settings HTML:

```js
var commonStyle = require('pebble-xoce-ui/settings-style');

var html = '<!doctype html><html lang="en"><head>' +
  '<meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<style>' + commonStyle + '</style></head><body><main>' +
  '<header><h1>Example settings</h1></header>' +
  '<section class="card"><h2>Display</h2>' +
  '<label for="size">Text size</label>' +
  '<select id="size"><option>Medium</option><option>Large</option></select>' +
  '</section></main></body></html>';
```

This generates presentation only. It performs no load or Save and has no Pebble connection. The shared CSS supplies colour roles, readable fields, focus, responsive spacing and reduced-motion handling. Override a small set of app accent properties after the common CSS when your app needs its own identity.

## Keep state in the host

The settings controller remains your responsibility:

- Load the confirmed values before enabling edits; keep an unknown value distinct from a default.
- Keep a draft and provide explicit Save/Discard. A rejected or uncertain write must preserve that draft.
- Distinguish saving on the phone from confirmation by the watch. A stylesheet cannot establish either.
- Prevent an old asynchronous poll from replacing a newer Save or edit. Update a live status only when its message changes.
- Keep controls and recovery actions reachable on a narrow screen, enlarged text and an open keyboard.

The current [Timer settings controller](https://github.com/xefensor/pebble-app-timer/blob/v1.0.3/src/pkjs/settings-page.js) is an app example with independent display and alarm preferences. Its behaviour is app-owned code, not a hidden UI-library API.

## Validate in your app

Check the imported package and generated HTML, then test the actual consumer. For native drawing, inspect long labels, glyph alignment, selected/unselected states and both supported shapes in the emulator. For phone settings, use a simulated bridge to exercise loading, pending, confirmed and failed writes, then verify real integration separately.

Portable tests, browser layout, native emulator rendering and physical-device results are different evidence. Do not relabel a historical screenshot when changing the package.

## Reference

- [UI 0.1.1 public header](https://github.com/xefensor/pebble-lib-ui/blob/v0.1.1/include/pebble-xoce-ui.h)
- [UI 0.1.1 metrics](https://github.com/xefensor/pebble-lib-ui/blob/v0.1.1/include/metrics.h)
- [UI 0.1.1 stylesheet](https://github.com/xefensor/pebble-lib-ui/blob/v0.1.1/src/js/settings-style.js)
- [Published package, SDK archive and checksums](https://github.com/xefensor/pebble-lib-ui/releases/tag/v0.1.1)
- [Current Pebble UI and UX standard](/docs/design/pebble-ui-system/)

Preserve the [PolyForm Noncommercial licence](https://github.com/xefensor/pebble-lib-ui/blob/v0.1.1/LICENSE) and applicable notices. Shared presentation does not change the consuming project’s licence or ownership.
