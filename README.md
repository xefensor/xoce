# XOCE

A static Astro website for **XOCE — Xef’s Open Computing Ecosystem**. The current branch prepares a Pebble Store launch: two watchfaces, three watch apps and the ČHMÚ Weather phone plugin. The wider Android/KDE direction stays in About.

This is a **local launch preview**, not a published release announcement. All six Store links remain unset until the real listings and matching GitHub PBWs are verified. Existing public releases, historical screenshots and app repositories remain unchanged.

## Preview and verify

Use Node 22.23.4 and Python 3.12.15. Dependencies remain pinned to Astro 7.4.7 and TypeScript 6.0.3.

```sh
npm ci --ignore-scripts
npm test
npm run preview
```

Open **http://127.0.0.1:4322/xoce/**. Development uses `npm run dev` at port 4321. To run the actual browser checks against the built site:

```sh
XOCE_SITE_URL=http://127.0.0.1:4322/xoce/ XOCE_QA_OUTPUT=build/qa/browser npm run check:browser
```

`npm test` checks types, builds all routes, audits internal links and image provenance, checks documentation links and tests release verification. Chromium checks cover responsive layouts, both themes, keyboard controls, search, shape selection and JavaScript-disabled browsing. Disposable evidence belongs in ignored `build/qa/`.

## Launch content

The preview covers Dynamic 0.19.0, Halftone 1.10.0, Dashboard 0.7.0, Timer 0.15.0, Open Activity 0.4.0 and ČHMÚ Weather 1.0.2. Native products target Time 2 and Round 2. The weather plugin runs on the phone and has no watch screen. Duo and Personal Weather are excluded.

[Project metadata](src/data/projects.ts) owns publication status, Store links, exact GitHub downloads, UUIDs, checked PBW hashes and per-shape previews. [Screenshot metadata](src/data/launch-screenshots.json), [asset provenance](docs/asset-provenance.json) and [policy provenance](docs/policy-provenance.json) distinguish native emulator images, packaged settings previews and app-owned privacy documents. Historical images keep their original bytes and records.

Store is the primary installation action for a verified published product; a matching GitHub PBW is secondary. A preview has no active installation link. Support and privacy are available beneath each `/projects/{slug}/` route. All previous routes and documentation anchors remain compatible.

## Publication

See the [launch checklist](docs/launch-checklist.md). `npm run check:launch` is expected to fail while these releases are previews. It verifies public Store UUID/version/platform metadata, GitHub release assets and exact matching PBW bytes before the existing main-only Pages workflow can deploy.

No login, upload or publication command runs during checks. A push to `main` can deploy only after all checks and the launch gate pass. Keep this work on its branch until separately authorized to publish. The existing public site is [xefensor.github.io/xoce](https://xefensor.github.io/xoce/).

## Development and credits

[CONTRIBUTING](CONTRIBUTING.md), [maintenance contracts](docs/MAINTENANCE.md) and [publication policy](docs/RELEASING.md) describe the repository boundaries. This website package remains UNLICENSED; app downloads retain their own licences, including PolyForm Noncommercial. Original font, screenshot and official Time 2 and Round 2 frame credits remain in the provenance records. No backend, accounts or hosting migration is introduced.
