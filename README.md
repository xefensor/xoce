# XOCE

The website, user guides and shared design documentation for **XOCE — Xef's
Open Computing Ecosystem**. This first version is a local review checkout:
there is no Git remote, registered hosted Site, deployment or public domain.

## Run locally

Use Node **22.23.4 or newer** (developed and checked with Node 26.12.0).

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:4321/**. Astro's development server watches source files
and refreshes the preview. With Astro 7, the server runs in the background:

```sh
npm run dev:status
npm run dev:stop
```

To review the production output instead:

```sh
npm run build
npm run preview
```

The production preview uses **http://127.0.0.1:4322/**. The website is static;
the preview servers are local development tools, not a required backend.

## What's included

- A homepage introducing the project and the current Pebble collection.
- Six project pages: four installable apps/watchfaces and two developer libraries.
- Eight curated guides for setup, controls, troubleshooting, developers, design
  and licensing. Library references point to reviewed released sources.
- A Lab page with a small draggable/keyboard-accessible workspace study. This
  is website demonstration code, separate from the existing spatial prototype.
- About/contributing, a custom 404 page, project filters and local search.
- System/light/dark themes with a saved local preference. Primary content and
  navigation remain available without JavaScript.

Linux/KDE and Android are broader project directions, not invented released
products. The currently documented watch builds target Emery / Pebble Time 2
and are clearly labelled as development prereleases.

## Maintaining content

| Location | Owner and purpose |
| --- | --- |
| `src/data/projects.ts` | Current version-pinned project catalogue and download links |
| `src/data/docs.ts` | Guide navigation and search descriptions |
| `src/pages/docs/` | Website-owned user, developer introduction and design guides |
| `src/pages/projects/[slug].astro` | Shared project-page presentation |
| `src/styles/` | Site typography, colour roles, layouts and device-specific responses |
| `docs/asset-provenance.json` | Exact screenshot origins, capture versions and hashes |

Detailed APIs, native build instructions and validation history remain in their
owning code repositories. Do not copy legacy activity contracts into the current
provider guide or change published release files to update a website link.

The site's colours and typography are a first visual proposal. They do not
change the design or settings of any app.

## Validation

```sh
npm test
# With the local preview running:
npm run check:browser
```

`npm test` type-checks the Astro source, builds all static routes and audits
internal links, anchors, assets and versioned download links. Browser checks use
an installed Chromium and native Node CDP support; see
`scripts/browser-smoke.mjs` for environment options. Evidence is under `docs/qa/`.
These checks are browser automation and do not imply physical-watch testing.

## Licences and assets

Individual Pebble projects retain their own PolyForm Noncommercial licences.
The website's own project-wide licence has not been selected. The npm package
is private and marked `UNLICENSED` pending that decision.

Project images are exact native emulator captures with example data. Desktop
and phone artwork is illustrative. Space Grotesk and Inter are self-hosted under
the SIL Open Font License. Full notices are in
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
