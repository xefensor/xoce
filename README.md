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
and refreshes the preview. In a normal terminal, press Ctrl+C to stop it.
The review preview started for you runs in the background. To start it that way
yourself, or check and stop that background server:

```sh
npm run dev -- --background
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

- A homepage showing the current Pebble collection with real emulator captures.
- Dedicated For users, For developers and Design sections, accessible from the
  main navigation and linked from the current project pages.
- Six project pages: four installable apps/watchfaces and two developer libraries.
- Twelve curated guides for setup, controls, troubleshooting, developers,
  visual identity, UI patterns, interaction, design principles and licensing.
  Library references point to reviewed released sources.
- About/contributing, a custom 404 page, project filters and local search.
- System/light/dark themes with a saved local preference. Primary content and
  navigation remain available without JavaScript.

Linux/KDE and Android are broader project directions, not invented released
products. The currently documented watch builds target Emery / Pebble Time 2
and are clearly labelled as development prereleases.

The site documents existing work. There is no Lab, speculative product section
or website-only interaction demo. Design documentation distinguishes established
principles and app patterns from the website's own colours, typography and mark.
The [shared Pebble UI standard](src/pages/docs/design/pebble-ui-system.md) records
the shared design implemented in local Dynamic 0.17.0, Dashboard 0.5.0, Timer
0.13.0 and Open Activity 0.2.0 candidates. Repository tests, builds, packaged
settings/browser checks and native emulator checks pass; real-phone and
physical-watch verification remain separate. The candidates are not published.
Public project downloads remain pinned to the published baselines; current user
guides and older screenshots keep their release context.

## Maintaining content

| Location | Owner and purpose |
| --- | --- |
| `src/data/projects.ts` | Current version-pinned project catalogue and download links |
| `src/data/docs.ts` | Guide navigation and search descriptions |
| `src/pages/users/`, `developers/`, `design/` | Audience and design section overviews |
| `src/pages/docs/` | Website-owned user, developer introduction and design guides |
| `src/pages/docs/design/pebble-ui-system.md` | Canonical agreed Pebble watch/phone UI standard and implementation status |
| `src/pages/projects/[slug].astro` | Shared project-page presentation |
| `src/styles/` | Site typography, colour roles, layouts and device-specific responses |
| `docs/asset-provenance.json` | Exact screenshot origins, capture versions and hashes |

Detailed APIs, native build instructions and validation history remain in their
owning code repositories. Do not copy legacy activity contracts into the current
provider guide or change published release files to update a website link.

The site's colours and typography are a first visual proposal. They do not
change the design or settings of any app.

The four consuming app repositories keep concise `docs/UX-ALIGNMENT.md` adoption
records and maintainer pointers to the canonical standard. Keep common rules here
and project-specific implementation/evidence there. Appearance is configured on
the phone: Timer has a minimal Light/Dark page with help, and Open Activity has a
separate Watch appearance selector alongside its two shortcut choices. Native
timer editing and alarm ownership remain on the watch. The website is not published yet;
those handoffs identify the sibling checkout and local preview rather than
claiming a public documentation URL.

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

The local UI documentation integration passed `npm test`: 26 pages, 959 internal
references, 155 anchors and 11 referenced assets, with no type errors or warnings.
`docs/qa/VALIDATION.json` records that check and points to each app's local
candidate evidence. Earlier browser captures remain historical; they were not
rerun for this documentation update. Public release catalogue entries remain
unchanged, and real-phone/physical-watch verification is separate.

## Licences and assets

Individual Pebble projects retain their own PolyForm Noncommercial licences.
The website's own project-wide licence has not been selected. The npm package
is private and marked `UNLICENSED` pending that decision.

Project images are exact native emulator captures with example data. Their watch
cases are CSS illustrations. Space Grotesk and Inter are self-hosted under
the SIL Open Font License. Full notices are in
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
