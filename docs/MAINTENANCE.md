# XOCE website maintenance contracts

## Current scope

Xef approved a local Pebble-first Store launch redesign on 2026-11-13. It covers Dynamic 0.19.1, Halftone 1.10.1, Dashboard 0.7.1, Timer 0.15.1, Open Activity 0.4.1 and ČHMÚ Weather 1.0.2. Native products target Time 2 and Round 2. The weather plugin runs on the phone and has no watch interface. Duo and Personal Weather are excluded.

A launch candidate is not a published release. `publication: 'preview'` records have no active Store or PBW links; a site-wide preview notice and `noindex` identify the local preview. Published records require exact verified Store and GitHub artifacts. Existing public releases remain unchanged. [Launch checklist](launch-checklist.md) records the activation process.

## Page jobs and interaction

- Home leads with Pebble products, names both featured watchfaces within the first mobile screen and shows both watch shapes. The wider Android/KDE direction belongs mainly in About.
- Keep Software/Docs/About navigation, the plain XOCE wordmark, teal, Inter and semantic light/dark colours. Use open sections, quiet preview surfaces and fine dividers. Documentation can retain a stronger reading surface.
- Group the catalogue into two watchfaces, three watch apps and one phone plugin. Libraries and planned products do not appear as consumer app cards. Activities 0.4.4 and Core 0.5.2 remain the pinned public library packages; consuming app repositories own their newer vendored versions.
- Product pages lead with purpose, native previews, compatibility and installation. Store is the primary action for verified published versions; the matching GitHub PBW is secondary. Configuration help, support and privacy remain directly reachable for people who already installed from the Store.
- Preserve all routes, legacy fragments and no-JavaScript reading/navigation. `/docs/` opens Getting started directly. Keep the existing Phone plan and its canonical redirects, without promoting it as installable software.
- Shape selection uses native radio controls and defaults to Time 2. Do not infer a visitor’s connected watch from their browser or automatically cycle previews.
- Keep keyboard access, reduced motion/transparency, browser theme preference and clear focus. Explicit Search may focus its input; ordinary visits must not move focus unexpectedly.

## Source ownership

Astro 7.4.7 produces static HTML beneath `/xoce/`; preserve existing dependency pins and lockfile. There is no backend, account system or automatic theme service. `src/lib/site.ts` owns the origin/base; templates, Markdown, search and redirects must use its path conventions.

`src/data/projects.ts` owns product identity, publication state, exact links, checked UUID/PBW hashes, requirements and shape previews. `src/data/launch-screenshots.json` owns current gallery metadata. `src/data/docs.ts` owns navigation, with article content under `src/pages/docs`.

Support/privacy routes are product-local. Privacy text comes from app-owned documents, with source commits/hashes in `docs/policy-provenance.json`. Change the app’s commitments only through separately scoped app work; the website must describe their actual data handling. Support uses the existing GitHub issue trackers. No invented contact channel, team, analytics or completed Android feature is implied.

## Images and provenance

Native screenshots are unchanged PNG bytes. Append new versioned assets and provenance; preserve historical images and records. Captions distinguish native emulator renders, browser settings previews and original plugin icons. Synthetic data is labelled and no screenshot establishes physical-device testing.

Retain the official Core Devices Time 2 and Round 2 frames, their original bytes and their provenance/licence distinction. Xef requested the matching official Round 2 illustration on 2026-11-13. Fit 200×228 Time 2 and circular 260×260 Round 2 captures into their respective apertures without stretching. Home and product previews use the appropriate device frame; compact catalogue and gallery views show the native captures directly. No additional third-party licence is granted by this website.

The original font, frame and screenshot records remain in `docs/asset-provenance.json`, with the Round 2 frame appended under `additional_device_presentations`; current preview records are also exposed in `public/preview-provenance.json`. Website materials remain separate from native app UI standards.

## Verification and publication

Use Node 22.23.4 and Python 3.12.15. `npm test` runs type/build/link/doc checks and offline release-verification regressions. Native image dimensions, hashes and release versions must agree. Browser checks exercise the built site separately and write disposable evidence under ignored `build/qa/`. Existing `docs/qa/` remains historical.

`npm run check:launch` is read-only: it checks public Store UUID/version/platform metadata and exact matching Store/GitHub PBW bytes. Missing or inconsistent data fails. The current preview is expected to fail this command until real publication metadata is provided.

GitHub Pages hosting remains at https://xefensor.github.io/xoce/. Only successful, authorized main pushes/manual runs may deploy. The workflow runs the launch gate before uploading Pages artifacts; PRs and branches validate locally without requiring unpublished listings. Do not push, publish apps or change hosting implicitly.

Project downloads retain their licences, including PolyForm Noncommercial. Do not describe them as unrestricted open-source releases. The website package remains UNLICENSED. Existing attributions, identifiers and release artifacts are unchanged.

## History

[Contracts before the Store redesign](history/website-before-store-launch.md) and the [history index](history/index.md) retain earlier decisions. They do not override the current contracts above.
