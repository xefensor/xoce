# XOCE website

This repository is the website, cross-project guides and design documentation
for XOCE — Xef's Open Computing Ecosystem.

- Keep this checkout local until Xef requests publication. No remote or hosting
  identity is configured for the first review.
- Astro builds static HTML. Keep browser JavaScript small and use native links,
  forms, dialogs and platform conventions. Keep the primary content usable
  without JavaScript. Respect reduced motion and keyboard navigation.
- `src/data/projects.ts` owns the explicit current release catalogue. Link exact
  GitHub release versions, including prereleases; never infer them from a generic
  latest-release endpoint. Public npm package names differ from repository names.
- The four Pebble products target Emery / Pebble Time 2 development builds.
  Linux, Android and spatial computing are broader directions; do not invent
  available applications, compatibility or completed integrations.
- Website user guides live here. Library repositories own API contracts and
  build instructions. Link reviewed versions of those references. Do not import
  legacy specifications or design proposals as current behaviour.
- Native screenshot assets are emulator captures with example data. Preserve
  exact pixels and provenance in `docs/asset-provenance.json`. They do not prove
  physical-watch testing. Keep third-party font and asset notices.
- Document current projects only. Keep the main sections Projects, For users,
  For developers, Design and About. Do not add a Lab, fictional demos, speculative
  product pages or future-platform sections without Xef's request.
- Design guidance covers verified current patterns and the separately labelled
  agreed target in `src/pages/docs/design/pebble-ui-system.md`. App implementation
  remains pending; keep current user guides and release claims accurate. This
  documentation request does not authorize changing app behaviour or artifacts.
- Website colours, fonts and marks describe the website. The agreed Pebble
  standard has its own native/watch and phone-settings roles; do not silently
  copy the website palette or web fonts into the apps. Exact app accents,
  unmeasured native metrics and shared-code packaging remain open decisions.
- Preserve each project's actual licence. The site has no project-wide licence
  decision yet; dependencies and imported assets retain their own terms.

Use Node >=22.23.4. Run `npm ci`, `npm test`, then start `npm run dev` for browser
checks. `npm run check:browser` checks the running local site with the installed
Chromium browser. Save meaningful browser evidence in `docs/qa/` and distinguish
automated checks from a user's review. Do not publish as part of validation.
