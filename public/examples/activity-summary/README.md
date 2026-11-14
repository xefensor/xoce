# Activity Summary Demo

A complete manual `activity/summary` provider using the **public Activities
0.4.4 development prerelease**. This teaching fixture is a phone-only plugin, not
a released XOCE product. It has no network permission, native watch screen,
alarm, app destination or contextual action.

## Build and test

Use Node 22.23.4 or newer and Python 3.12. No Pebble SDK is required for this
phone-only PBW. Copy the example into a separate working folder before building:

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

If you already have the website checkout, run these commands from its root,
then continue with the fetch, install, test and build commands above:

```sh
cp -R public/examples/activity-summary ../activity-summary
cd ../activity-summary
```

The first command downloads the exact upstream archive into `vendor/`, verifies
SHA-256, and refuses an existing archive with different bytes. Its published
hash is:

```text
dffec3e05041515fbf9385a641adf6b40aedda7e8460c0d11ecb4ed019cd5abe
```

Compare `upstream.json` with the upstream release's `SHA256SUMS.txt`. Read the
dependency's PolyForm Noncommercial licence and required notice linked in
`THIRD_PARTY.md` before using or distributing it. The public source folder intentionally
contains no dependency archive or installed modules. Obtain the text sources
from the example file index on the website, or copy them from the website
checkout into the standalone working folder shown above.

For an offline machine, first obtain that same archive on a connected machine,
then use this instead of the first command:

```sh
node scripts/fetch-library.mjs --from /path/to/pebble-activities-0.4.4.tgz
```

Everything after acquisition runs offline. `node scripts/fetch-library.mjs
--check` rechecks an existing local archive. The dependency has no runtime npm
dependencies; `package-lock.json` records its exact SHA-512 integrity.

Output: `build/Activity-Summary-Demo-0.1.0.pbw`. The builder verifies the archive,
lockfile and installed library bytes, checks the source declaration, bundles
literal CommonJS imports, and makes a phone-only manifestVersion 2 PBW. It
includes the upstream licence and attribution. It installs or publishes nothing.

## What is in the example

| File | Purpose |
| --- | --- |
| `package.json` / `package-lock.json` | Exact local library pin and complete plugin manifest |
| `upstream.json` | Public archive URL, version, checksum and licence reference |
| `src/provider.cjs` | Manual source owner, typed records and settings handler |
| `src/plugin.cjs` | SDK registration and serialization of source requests |
| `config.html` | Local controls for authoring the demo state |
| `scripts/manifest.cjs` | Serializes the real provider's `sourceDeclaration` into `package.pebble.plugin.sources` |
| `scripts/build.py` / `scripts/bundle.mjs` | Reproducible PBW packaging without an SDK or another bundler dependency |
| `test/` | Offline real-library lifecycle and packaged-handler checks |

The manifest declares **only** `activity/summary`. Its property map comes from
the installed library, not a hand-maintained copy. If you deliberately change
the provider declaration, run `npm run manifest` and review the resulting
`package.json`; `npm run manifest:check` detects drift. Keep the UUID in that
manifest and `src/provider.cjs` identical. Generate a new UUID before publishing
your own independently named plugin; never reuse an existing app's identity.

## Install and observe

1. Use a Pebble phone app with plugin support, and enable Plugins or its preview
   feature where that build requires it. Install Dynamic or Halftone separately.
2. Open the generated PBW on the phone and let the Pebble app install it. This
   plugin has no native watch app, so it does not add a watch launcher screen.
3. In Dynamic or Halftone settings, enable activity sharing and include
   **Activity Summary Demo** in the provider priority order. Give it an available
   visible role; another higher-priority activity may otherwise occupy the slot.
   Return to the chosen watchface and keep the phone connected.
4. Open **Activity Summary Demo** settings in the phone app. Use the controls
   below. Save feedback confirms phone storage only, not watch delivery.

| Action | Expected source / host result |
| --- | --- |
| First source read | One item: “Parcel at depot” |
| Show or update message | Same `manual-demo-1` identity with new text on the next read |
| Start 120-second countdown | An absolute deadline created once when Start is pressed |
| Pause countdown | `state: 'paused'` and fixed remaining `seconds`; later reads do not reduce them |
| Withdraw item | A complete empty response; the helper retains its required `@snapshot` header |
| Show item for 15 seconds | One absolute `visibleUntil`; the item disappears after it expires, even if fresh reads continue |

The example suggests a five-second refresh and fifteen-second fresh lease to
reduce waiting. The phone controls when it requests data, so these are not
guaranteed refresh timings. To inspect missing-provider, expiry and removed
permission cases, use actual phone/watch testing; the offline tests cannot
establish those integrations.

## Source ownership and privacy

This plugin owns the manually entered state. Reads use `defineProvider`, which
manages transient fresh observations and publication metadata. The demo stores
its own chosen text/deadline separately from the library's publication counters.
It never rewrites a deadline during a source read. Returning `[]` withdraws the
whole current set; zero on a countdown does not fabricate completion.

A native timer, cached provider or another saved owner needs
`defineSnapshotProvider`, preserving that owner's revision, observation and
validity. Do not adapt the demo's fresh-read path to make stale cached data look
new. Native Timer remains responsible for its alarms.

## Verification scope

`npm test` exercises the **actual pinned 0.4.4 JavaScript implementation**, not a
mock of its summary API. It checks stable identity, updates, fixed paused time,
empty withdrawal, absolute expiry, invalid data, failed storage readback and
the actual PBW bundle's SDK source/config handlers in a Node VM. Only the SDK
surface, clock and phone storage are simulated. No emulator, Pebble phone app or
physical watch is exercised by these tests.

Run all acquisition, installation, test and build commands in your downloaded
copy. Do not put generated `build/`, `vendor/` or `node_modules/` directories in
the website's public example folder; a static site would expose them.
