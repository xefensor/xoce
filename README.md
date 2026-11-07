# XOCE

The static website and documentation for **XOCE — Xef’s Open Computing Ecosystem**,
covering PebbleOS projects and the planned Android/KDE direction.

The catalogue links to published GitHub releases. Current downloads are Pebble development
builds; cross-device synchronization and Phone remain plans.

**[Visit XOCE](https://xefensor.github.io/xoce/)** · [Source](https://github.com/xefensor/xoce) · [Actions](https://github.com/xefensor/xoce/actions/workflows/checks.yml)

GitHub Pages deploys `main` after type, build, link, documentation and desktop/mobile
browser checks pass. Pull requests run the same checks without deployment.

## Run locally

Use Node 22.23.4 or newer. Astro 7.4.7 and TypeScript 6.0.3 remain pinned in package-lock.json.

```sh
npm ci
npm test
npm run dev
```

Open the local URL printed by Astro, normally http://127.0.0.1:4321/xoce/. `npm run build` writes
`dist/`; `npm run preview` serves it at http://127.0.0.1:4322/xoce/. Navigation and articles support keyboard
and no-JavaScript use. No backend or Pebble SDK is required.

## Content and compatibility

[Project metadata](src/data/projects.ts) owns exact versions, download and licence links. The existing catalogue entries are Dynamic 0.18.3, Dashboard 0.6.3, Timer 0.14.5, Open Activity 0.3.3, Activities 0.4.4 and Core 0.5.2. Pebble downloads target Time 2 / Emery; requirements are shown per project. Existing native screenshots keep their original provenance and version.

[Contributor guide](CONTRIBUTING.md) explains type/build/link checks and Chromium inspection. [Maintenance contracts](docs/MAINTENANCE.md), [publication boundary](docs/RELEASING.md) and the [history index](docs/history/index.md) separate active source, generated output and original QA evidence.

## Licences and credits

This website package is UNLICENSED. Project downloads retain their own licences, including
PolyForm Noncommercial for the Pebble repositories. Font licences and native screenshot
attribution remain recorded in [asset provenance](docs/asset-provenance.json) and the [original
credits](docs/history/readme-before-maintenance.md#licences-and-credits).
