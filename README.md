# XOCE

The static website and documentation for **XOCE — Xef’s Open Computing Ecosystem**,
covering PebbleOS projects and the planned Android/KDE direction.

## Visit the site

**[Visit XOCE](https://xefensor.github.io/xoce/)** · [Source](https://github.com/xefensor/xoce) · [Actions](https://github.com/xefensor/xoce/actions/workflows/checks.yml)

The catalogue links to published GitHub releases, including development builds and
Halftone’s prerelease. Local candidates stay separate. Cross-device synchronization
and Phone remain plans.

## Compatibility

Watch downloads target Pebble Time 2 / Emery. ČHMÚ Weather runs as a plugin in the
Pebble phone app and supplies system complications. Each project page gives its
requirements, actual release and licence; [project metadata](src/data/projects.ts)
owns the exact links. Native screenshots retain their recorded version and provenance.

The website supports keyboard navigation and reading without JavaScript. Local
preview requires Node 22.23.4 or newer; Astro 7.4.7 and TypeScript 6.0.3 remain pinned
in package-lock.json. No backend or Pebble SDK is required.

## Setup and use

Use the public catalogue to download a project and follow its setup guide. To preview
this website from a clean checkout:

```sh
npm ci
npm test
npm run dev
```

Open the local URL printed by Astro, normally http://127.0.0.1:4321/xoce/.
`npm run build` writes `dist/`; `npm run preview` serves the built site at
http://127.0.0.1:4322/xoce/.

## Development

The [contributor guide](CONTRIBUTING.md) covers prerequisites, type/build/link checks
and Chromium inspection. [Maintenance contracts](docs/MAINTENANCE.md), the
[publication boundary](docs/RELEASING.md) and the [history index](docs/history/index.md)
separate active source, generated output and original QA evidence.

GitHub Pages deploys `main` after type, build, link, documentation and desktop/mobile
browser checks pass. Pull requests run the same checks without deployment. Keep
ordinary development local; pushing and publishing require explicit authorization.

## Licence

This website package is UNLICENSED. Project downloads retain their own licences, including
PolyForm Noncommercial for the Pebble repositories. Font licences and native screenshot
attribution remain recorded in [asset provenance](docs/asset-provenance.json) and the [original
credits](docs/history/readme-before-maintenance.md#licences-and-credits).
