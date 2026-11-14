# Core readings host

A small JavaScript/C host for the public `pebble-watchface-core` 0.5.2 package.
It reads the phone app’s first two global complication choices. The source also
includes an Emery watch app and portable integration tests using simulated data.

## Get the source and verified dependency

Copy this entire example folder, preserving its paths. From a website checkout:

```sh
cp -R public/examples/core-readings /tmp/core-readings
cd /tmp/core-readings
node scripts/fetch-library.mjs
npm ci --ignore-scripts
```

The fetcher downloads the public upstream archive and verifies the SHA-256 in
`upstream.json` before writing `vendor/pebble-watchface-core-0.5.2.tgz`. The lockfile
pins that exact local archive. To use an archive already downloaded and checked:

```sh
node scripts/fetch-library.mjs --from /path/to/pebble-watchface-core-0.5.2.tgz
npm ci --ignore-scripts --offline
```

The included Core dependency retains its PolyForm Noncommercial licence. Read
the upstream `LICENSE`, preserve it and follow its terms when reusing the package.
The tutorial files do not grant a different licence to Core or the website.

## Run the portable JS/C integration

Requires Node 22 or later and a C99 compiler (`cc`, or set `CC`). No Pebble SDK,
phone, watch or sibling checkout is used:

```sh
npm test
npm run build
```

The JavaScript test runs the real `createMessageQueue` and `createComplications`
exports with a simulated Pebble source/transport. It sends the actual encoded
bytes to a C executable compiled against the same package’s `readings.c`.
Assertions cover a ready reading, original receipt/expiry through persistent
cache restoration, disconnect, expiry and invalid-packet clearing. The second
build command retains the portable executable and packet under `build/`.

This establishes a host-side API/wire integration. It does not establish phone
permissions, real source availability, native rendering or physical behaviour.

## Build the watch host

The package’s published native contract targets Emery/Time 2 with SDK 4.33.1.
This example keeps that single target; it does not claim Round 2 support. With
a compatible Pebble SDK and CLI selected:

```sh
npm run build:watch
```

The SDK writes `build/<checkout-folder>.pbw`. Install it through your normal
Pebble development workflow. The build helper also includes Core’s licence and
checks the actual native payload and merged phone bundle. In the Pebble phone app, enable plugin support and
select two global complication readings. Open **Core Readings Demo** with the
phone connected. A missing or expired reading shows an explicit placeholder.
Test a changed selection, reconnect, expiry and denied source before adding
your own presentation.

The example’s native build was checked with CLI 5.1.2 / SDK 4.44 for Emery; no
emulator or physical-device run is claimed. Use your host’s own supported SDK
and platform contract when integrating it into a product.

## File ownership

- `src/pkjs/host.js`: one phone queue and complication coordinator; request routing.
- `src/pkjs/index.js`: the phone’s single `ready`/`appmessage` dispatcher.
- `src/c/main.c`: native SDK lifecycle, eight reserved persistence keys,
  6,144-byte inbox, display, request/retry, reconnect and minute ticks.
- `test/fixture.cjs`: deterministic simulated preferences, source and transport.
- `test/native-peer.c`: actual Core decoder/cache/freshness lifecycle.
- `test/host.test.cjs`: automated queue/dispatcher and JS-to-C checks.

Core owns bounded reading state. The host still owns permissions, SDK handlers,
request retry, storage namespace, fonts, drawing and release. Do not register a
second dispatcher or use legacy `WatchfaceCore` context functions on `WfcReadings`.
