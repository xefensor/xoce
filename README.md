# XOCE

A static Astro website for **XOCE — Xef’s Open Computing Ecosystem**. It presents six published Pebble products: two watchfaces, three watch apps and the ČHMÚ Weather phone plugin. The wider Android/KDE direction stays in About.

The live site is [xefensor.github.io/xoce](https://xefensor.github.io/xoce/). [Project metadata](src/data/projects.ts) is the source of truth for current versions, verified Store links, exact GitHub downloads and checked PBW hashes.

## Preview and verify

Use Node 22.23.4 and Python 3.12.15. Dependencies remain pinned to Astro 7.4.7 and TypeScript 6.0.3.

```sh
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r artwork/requirements.txt
npm ci --ignore-scripts
npm test
npm run preview
```

Open **http://127.0.0.1:4322/xoce/**. Development uses `npm run dev` at port 4321. To run the actual browser checks against the built site:

```sh
XOCE_SITE_URL=http://127.0.0.1:4322/xoce/ XOCE_QA_OUTPUT=build/qa/browser npm run check:browser
```

`npm test` checks types, builds all routes, audits internal links and image provenance, checks documentation links and runs release-verification and search regressions. Chromium checks cover responsive layouts, both themes, keyboard controls, search, shape selection and JavaScript-disabled browsing. Disposable evidence belongs in ignored `build/qa/`.

## Product content and documentation

Dynamic, Halftone, Dashboard, Timer, Open Activity and ČHMÚ Weather are published in Pebble Store. Native products target Time 2 and Round 2. The weather plugin runs on the phone and has no watch screen. Duo and Personal Weather are excluded.

[Screenshot metadata](src/data/launch-screenshots.json), [asset provenance](docs/asset-provenance.json) and [policy provenance](docs/policy-provenance.json) distinguish native emulator images, packaged settings previews and app-owned privacy documents. Historical images keep their original bytes and records.

Store is the primary installation action for a verified published product; a matching GitHub PBW is secondary. A preview has no active installation link. Support and privacy are available beneath each `/projects/{slug}/` route. All previous routes and documentation anchors remain compatible.

Documentation starts with [user guides](https://xefensor.github.io/xoce/docs/), [Developers](https://xefensor.github.io/xoce/docs/develop/) and [Design](https://xefensor.github.io/xoce/docs/design/). Current design references include rendered specimens and version-labelled native examples. Earlier studies remain separately labelled under Design history rather than defining current behaviour.

Public standalone library packages are Activities 0.4.4 (prerelease), Core 0.5.2 and XOCE UI 0.1.1. The newer package snapshots bundled in released apps are a separate record, not additional standalone release claims. [Development metadata](src/data/development.ts) and the [build guide](https://xefensor.github.io/xoce/docs/develop/building/) document the distinction. Runnable examples in [public/examples](public/examples/) accompany the provider and Core guides; their host-side checks do not establish physical-device testing.

## Publication

See the [launch checklist](docs/launch-checklist.md). All six current releases passed activation verification on 2026-11-14. `npm run check:launch` verifies public Store UUID/version/platform metadata, GitHub release assets and exact matching PBW bytes; rerun it when publication metadata changes. The main-only Pages workflow uses `npm run check:deployment`, which verifies published records and also permits honestly labelled preview records.

Checks do not upload or publish apps. An authorized push to `main` deploys the website only after the build, reference, browser and deployment checks pass. App releases and their immutable artifacts are maintained in their own repositories.

## Development and credits

[CONTRIBUTING](CONTRIBUTING.md), [maintenance contracts](docs/MAINTENANCE.md) and [publication policy](docs/RELEASING.md) describe the repository boundaries. This website package remains UNLICENSED; app downloads retain their own licences, including PolyForm Noncommercial. Original font, screenshot and official Time 2 and Round 2 frame credits remain in the provenance records. No backend, accounts or hosting migration is introduced.

[Shared contributor conventions](docs/contributor-conventions.md) keep the separate
repositories consistent. [Artwork sources and candidate tools](artwork/README.md)
replace the old external review-package dependency; exports stay in ignored
`build/` and existing app assets remain the published authority.
