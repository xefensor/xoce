# XOCE

Main contains the current implementation. [Development](CONTRIBUTING.md),
[current maintenance contracts](docs/MAINTENANCE.md) and [release policy](docs/RELEASING.md)
are the active contributor references. Public downloads and frozen evidence keep
their original versions; a merge to main is not publication.

The local website and documentation for **XOCE — Xef’s Open Computing
Ecosystem**: a project to build everyday software across KDE Plasma, Android
and PebbleOS, with shared state and actions and room to try new interfaces.

Current downloads are Pebble development builds. Cross-device timer
synchronization, JMAP-based personal-data tools and deeper platform work are
goals, not released features.

This checkout remains local. No Git remote, hosting registration or deployment
is configured.

## Technology

- **Astro 7.4.7** builds static pages and shared components.
- **TypeScript 6.0.3** checks source; Markdown holds documentation.
- **CSS** provides responsive layouts, glass materials and the four-choice
  native radio preview on Home.
- Small browser scripts handle search and appearance.

The site needs no application backend. Navigation, articles, disclosures and
the watch showcase remain usable without JavaScript. Dependencies and exact
versions are recorded in `package-lock.json`.

## Run locally

Use **Node 22.23.4 or newer**.

```sh
npm ci
npm run dev
```

Open the Local URL printed by Astro, normally **http://127.0.0.1:4321/**.
Source changes update the preview. Astro may select another port when busy.
The existing background preview can be inspected with `npm run dev:status`
and stopped with `npm run dev:stop`.

For the generated static output:

```sh
npm run build
npm run preview
```

Preview normally uses **http://127.0.0.1:4322/**. Both servers are local review
tools; running them does not publish the website.

## Pages and content

The main navigation is **Software · Docs · About**.

| Destination | Purpose |
| --- | --- |
| Home | Introduce the ecosystem, preview the current Pebble apps on a watch, then explain the future connection goal, general stages and participation |
| `/projects/` | Four exact available Pebble downloads; no filter bar while only one platform has downloads |
| Product pages | Purpose, actual screens, compatibility, requirements, download, help and source |
| `/pebble/` | Current watch collection, prerequisites and installation |
| `/projects/phone/` | Future Android/companion plan, linked quietly from About and retained for compatibility |
| `/docs/` | Getting started directly; 13 articles under Guides, Developers and Design |
| `/about/` | Platform choices, shared-state goal, flexible stages, later JMAP work and contribution links |

Old documentation portals and Phone-plan URLs remain direct compatibility
redirects. Phone is described briefly in About rather than promoted on Home or
in the Software catalogue. The site has no Lab, intermediate Docs hub, logo or
graphical favicon.

About distinguishes the early replaceable apps, future dependable stable
editions alongside deliberate experiments, and longer-term platform work.
There are no fixed dates or invented product releases. Xef is starting phase
one; later stages need broader participation.

## Maintaining the site

| Location | Owns |
| --- | --- |
| `src/data/projects.ts` | Exact releases, availability, downloads, connections, compatibility, consumers and licences |
| `src/data/docs.ts` | Article navigation and search descriptions |
| `src/pages/docs/` | User, developer and design articles |
| `src/layouts/DocLayout.astro` | Direct article layout, native disclosures and pagination |
| `src/components/WatchPreview.astro` | Official Pebble Appstore Time 2 frame around unchanged native captures |
| `src/components/ProjectPreview.astro` | Device presentation and compact direct screen views |
| `src/styles/theme.css` | Shared semantic colours and glass roles |
| `src/styles/global.css` | Header, footer, shared layout and controls |
| `src/styles/guide.css` | Article surface and quiet documentation rails |
| `docs/site-structure.json` | Current page jobs, routing and content boundaries |
| `docs/xoce-visual-identity.json` | Website palette, material roles, typography and assets |
| `docs/asset-provenance.json` | Screenshot origins, capture versions and hashes |
| [docs/phone-plan.md](docs/phone-plan.md) | Working Phone plan, Android/Pebble research, native call ownership and device checks |

The website uses Inter, teal, warm white and charcoal, with 10px/6px/4px corner
roles, warm neutral/charcoal backgrounds and quiet static offset-plane artwork.
The compact Home showcase places the watch beside its explanation; the Software
catalogue uses open rows and larger native captures. The official Pebble frame provides physical
context. Emulator screens retain their native pixels and do not claim
physical-watch verification. Glass and typography on the website remain
separate from the [native Pebble UI standard](src/pages/docs/design/pebble-ui-system.md).

Keep public release metadata distinct from local UI candidates. The four
published apps and two developer libraries retain their exact source links,
versions and individual terms. API contracts and build instructions remain
in their owning repositories.

## Validation

```sh
npm test
# With a local preview running at the printed URL:
XOCE_SITE_URL=http://127.0.0.1:4321/ npm run check:browser
```

The first command checks Astro types, builds static output and audits generated
links, anchors, product facts and search entries. Chromium checks exercise
navigation, native previews, catalogue links, themes, search, mobile layouts,
keyboard interaction and the no-JavaScript paths.

Evidence belongs in `docs/qa/`; `docs/qa/VALIDATION.json` identifies its scope.
Existing reports describe their original source and do not establish that a
later rebuild passed. Browser checks also do not establish physical-phone or
watch behaviour. Report checks only after they complete.

## Licences and credits

The ecosystem’s goal is open source. Current Pebble projects use **PolyForm
Noncommercial 1.0.0**, so their source is not presented as unrestricted
open-source software. Planned products and the website have no project-wide
licence decision; this private npm package remains `UNLICENSED`.

Native screenshots are unchanged emulator captures with example data. The
watch frame comes unchanged from the Pebble Appstore and is credited to Core
Devices. No permissive licence has been verified for that source-provided asset;
it is included for local review and this record grants no additional licence.
Inter is self-hosted under the SIL Open Font License. Historical Space Grotesk
assets and Spatial Desktop material/artwork credits remain retained.
See [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
