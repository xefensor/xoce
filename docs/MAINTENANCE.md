# XOCE website maintenance contracts

These are current implementation constraints. They apply when changing the
relevant subsystem, not as a requirement to reread every document for every edit.

## Ownership and compatibility

The website is hosted on GitHub Pages at https://xefensor.github.io/xoce/ following Xef’s explicit publication request. Local tests do not authorize a push; main pushes deploy after checks pass. Public releases and merged-but-unpublished app implementations are distinct; catalogue/download metadata stays pinned to actual public releases. Preserve routes, keyboard/no-JavaScript navigation and native screenshot bytes/provenance. Do not invent products, platforms, a team, licences or completed Android features. Current Pebble releases retain PolyForm Noncommercial notices. No backend/account system or automatic app-theme service is implied.

## Current interaction and product boundaries

Retain Software/Docs/About navigation and four available Pebble products. Phone/companion work remains an accurately labelled plan, linked quietly from About. Docs opens the actual Getting started article. Website identity/materials remain distinct from watch UI. Preserve the official Time2 frame and 200×228 native image proportions, Inter/type roles and reduced motion/transparency. The accepted native UI is now on each app’s main branch; public download versions remain unchanged.

## Source ownership

Astro builds static pages beneath `/xoce/`; `src/lib/site.ts` owns public paths.
The Sätteri plugin prefixes rendered Markdown links and images; templates, search
and redirects use the same helper. src/data/projects.ts owns exact release/catalogue metadata; src/data/docs.ts owns navigation. src/pages/docs holds articles; shared layouts/components and styles own presentation.

## Phone persistence and evidence

For apps with phone settings, keep active-writer selection, separate Android
DOM/native storage views, exact application acknowledgements and bounded handoffs.
Saving stays open where supported; uncertain writes retain the draft and explicit
readback/retry. Discard cannot undo a write already sent. Load errors must not
silently replace saved choices with editable defaults. Do not introduce unsolicited
focus or scroll changes. Historical browser/emulator results do not validate a
new build. Keep portable, packaged, simulated transport and real-device claims distinct.

## Dependencies, identities and licences

Preserve public identifiers, message-key numbers, compatible storage formats,
licences and attribution. Pinned vendor archives/checksums remain independent of
sibling checkouts. Do not repin consumers or change published bytes as cleanup.

## History

[Earlier maintainer notes](history/maintainer-notes-before-rework.md) retain the
full rationale/history. Read them only when investigating an old decision.

## Detailed site policy

The following retained policies apply to the existing site; the current-main UI
status above replaces older local-candidate version descriptions.



This repository contains the static website, guides and design documentation for
XOCE — Xef’s Open Computing Ecosystem. User instructions and accepted changes
supersede these maintenance notes.

## Scope and source of truth

- Keep development and previews local. A main push deploys to the established
  GitHub Pages site after checks pass; hosting changes still need authorization.
- Preserve existing work, historical QA evidence, release files and credits.
  Do not commit, push or change another app repository unless requested.
- `src/data/projects.ts` owns product identity, availability, exact release and
  download URLs, prerequisites, required/optional connections, library consumers
  and per-project licences. Do not infer versions from latest-release endpoints.
- The Software catalogue shows only the four available Pebble products.
  Keep planned Phone and companion metadata and canonical/legacy routes intact,
  without promoting the plan as a catalogue item or Home feature. A plain link
  in About may describe the future Android app and its optional watch companion.
- Current watch downloads target Pebble Time 2 / Emery. Activity integrations
  use the Pebble phone app’s plugin preview; built-in Music and Notifications
  in the public Dynamic and Dashboard releases require Android. Do not invent
  other platform support or completed cross-device synchronization.
- Catalogue entries are pinned to the verified Dynamic 0.18.3, Dashboard 0.6.3,
  Timer 0.14.5 and Open Activity 0.3.3 releases. Modern settings pages confirm
  phone persistence while staying open; legacy return-URL fallback still closes.
  Timer's appearance page never edits a timer. Older screenshots retain their
  original versions, layouts and evidence scope.
- The ecosystem’s aim is open source. Current Pebble projects retain PolyForm
  Noncommercial 1.0.0; do not describe those releases as unrestricted open-source
  software. Planned products and the website have no project-wide licence
  decision. Existing dependency and asset terms remain in force.

## Stack and implementation

Astro 7.4.7 produces static HTML; TypeScript 6.0.3 checks source, Markdown stores
articles, and CSS handles layout and material roles. Retain the installed lockfile
unless a dependency change serves an actual requirement. No React application,
application server, database or account system is needed for the present site.
Use Node >=22.23.4.

Keep JavaScript small. Main navigation, article reading, native disclosures and
the Home app-preview radio controls work without it. Search and theme
persistence progressively enhance that base. Respect keyboard
navigation, reduced motion and reduced transparency. Do not focus inputs during
ordinary visits; explicit Search may focus its own field.

## Content and page jobs

- Main navigation is **Software · Docs · About**. Software opens `/projects/`
  directly. Show platform filters only when downloads exist for more than one
  platform. Current downloads are all PebbleOS, so there is no filter bar or
  empty Android choice. Planned records do not count as available platforms.
- Home introduces the ecosystem goal alongside a real watch preview. Continue
  with platform focus and the current download/setup path, a labelled future
  shared-timer concept, a short general three-stage direction and useful
  contribution links. Do not restore a standalone Phone promotion or plan card
  on Home, in the catalogue or as an explicit Android-plans footer link. Native CSS radios select one of four static app previews;
  the showcase does not automatically cycle.
- `/pebble/` explains the current watch collection, requirements and setup.
  `/projects/phone/` owns the standalone Android Phone plan and optional separate
  Pebble companion. Neither planned component has a build, final name, verified
  interface, permissions list or compatibility promise.
- `docs/phone-plan.md` records the Phone research and current working direction:
  preserve native Pebble incoming answering; add history, favourites, contacts,
  outgoing calls and optional extra controls in XOCE. Keep source findings,
  architecture proposals and physical-device verification distinct.
- Released product pages explain purpose and actual capabilities, put
  compatibility beside Download, then link setup, controls, help, source and
  licence. Library pages lead with integration instructions and name consumers.
  Consumer catalogue entries do not require users to install a library service.
- About owns the real project scope: KDE Plasma, Android and PebbleOS;
  understandable everyday software and trying new interfaces; shared state and
  actions; flexible stages from replaceable apps to dependable stable editions
  alongside separate experiments, then deeper system work. Exact future forks,
  dates and intermediate stages are undecided. JMAP personal-data tools are a
  later goal. Examples of basic apps are not a closed product list.
- Xef is starting the first stage. Later work needs contributors; do not invent
  an existing team, community scale, sponsorship or maintained task programme.
- `/docs/` opens the actual Getting started article immediately. There are
  currently 13 articles under native expandable Guides, Developers and Design
  sections. Do not add a category portal or another step before the article.
  Detailed API contracts and build commands stay with their owning repositories.
- Keep old routes and fragments usable. `/users/`, `/developers/` and `/design/`
  lead directly to articles. `/android/`, `/projects/pebble-phone/`,
  `/docs/android/phone/` and `/docs/pebble/phone-connection/` lead directly to the
  canonical Phone plan or companion section. New links use their final targets.
- No logo or graphical favicon, Lab, fictional app interfaces, empty desktop
  download portal or invented release catalogue. Planned work can be described
  plainly without implying a shipped product.

## Visual design and assets

Use Inter, plain-text XOCE, deep teal, warm white and charcoal. Preserve the
10px/6px/4px pane/control/small corner roles. `BaseLayout` sets `data-ui="material"`;
`src/styles/theme.css` owns semantic colours and material roles, `global.css`
owns the shell and shared controls, and `guide.css` owns the Docs reader.

Glass density follows the task: lighter navigation and showcases, regular
supporting surfaces, and a denser article. The Docs article is its main glass
surface, with quiet sidebar and contents rails. Keep open editorial sections,
clear hierarchy and flush controls rather than enclosing every block in a panel.
The static offset-plane artwork is reduced on Docs; there is no idle motion or
pointer-following effect.

`WatchPreview.astro` uses the official Pebble Appstore Time 2 frame from
`https://apps.repebble.com/images/screenshot_slider_background_emery_v2.png`,
credited to Core Devices. The unchanged 488 × 700 transparent PNG lives at
`public/images/devices/pebble-time-2.png`. Do not replace it with an invented CSS
watch case. `ProjectPreview.astro` uses the frame for larger previews and direct
captures for compact views. Preserve the native 200 × 228 screen proportions
and exact screenshot bytes; fit captures within the aperture with matte black
letterboxing rather than stretching them. Keep all source and hash records.
Xef explicitly requested retaining this frame for the public website on 2026-11-07.
No asset-specific permissive licence has been independently verified and no additional
licence is granted by this repo. The provenance record preserves that distinction.
Captions distinguish emulator previews in a device frame from photographs of
running apps or physical-device testing. Do not fabricate phone or desktop
interfaces for plans.

Native app fonts, colours and controls remain separate from the website. The
canonical `src/pages/docs/design/pebble-ui-system.md` records the app standard;
website styling does not silently redesign those apps. Keep third-party notices,
`docs/asset-provenance.json`, `docs/spatial-material-reference.json` and retained
historical assets intact. Current site jobs and visuals are recorded in
`docs/site-structure.json` and `docs/xoce-visual-identity.json`.

## Validation

Run `npm ci` if dependencies need installing, then `npm test`. With a local
preview running, use `XOCE_SITE_URL=<local-url> npm run check:browser`.
Validate meaningful workflows: preview choice by pointer/keyboard without JS,
the available-software catalogue, downloads and direct plan redirects, Docs and
anchors, mobile navigation, search, appearance saving/reopening/browser restart,
small screens and zoom. Avoid text overflow and keep table/code scrolling local.

Save evidence in `docs/qa/` and update its validation record only for checks
actually completed against that source. Historical reports do not validate a new
rebuild. Separate compilation, browser checks, emulator evidence and physical
phone/watch verification. Validation does not authorize publication.
