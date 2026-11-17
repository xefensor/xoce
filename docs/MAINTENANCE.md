# XOCE website maintenance contracts

## Current scope

Xef approved the Pebble-first redesign and requested its public deployment on 2026-11-14. It describes Dynamic 1.0.2, Halftone 1.10.3, Dashboard 1.0.2, Timer 1.0.3, Open Activity 1.0.2 and ČHMÚ Weather 1.0.4. Native products target Time 2 and Round 2. The weather plugin runs on the phone and has no watch interface. Duo and Personal Weather are excluded.

All six current products are published in Pebble Store, with matching GitHub PBWs verified on 2026-11-14. A future launch candidate is not a published app release: `publication: 'preview'` records have no active Store or PBW links, and the preview notice and `noindex` identify preparation pages. `check:deployment` allows that state and retains complete public Store/GitHub verification for published records. `check:launch` remains the all-app activation check. [Launch checklist](launch-checklist.md) records the activation process.

## Page jobs and interaction

- Home leads with Pebble products, names both featured watchfaces within the first mobile screen and shows both watch shapes. The wider Android/KDE direction belongs mainly in About.
- Keep Software/Docs/About navigation, the outlined XOCE wordmark, self-hosted Fira Sans/Condensed, cool silver/graphite surfaces and blue interaction colour. Use restrained material depth and clear product presentations. Documentation keeps a quiet reading surface.
- Product stages and catalogue cards use fresh website vector artwork derived from each product’s Store-banner colours and motifs. Use the shared `ProductArtwork` component for those surfaces and design specimens; do not reuse cropped complete banners. Live titles, controls and genuine native/phone previews remain separate content, with readable focus and both-theme contrast. Decoration must not intercept input or carry essential information.
- Group the catalogue into two watchfaces, three watch apps and one phone plugin. Libraries and planned products do not appear as consumer app cards. Activities 0.4.4 (prerelease), Core 0.5.2 and XOCE UI 0.1.1 are the pinned public standalone library packages; consuming app repositories own their newer vendored versions.
- Product pages lead with purpose, native previews, compatibility and installation. Store is the primary action for verified published versions; the matching GitHub PBW is secondary. Configuration help, support and privacy remain directly reachable for people who already installed from the Store.
- The device-led presentation is for people new to XOCE. Home and Software group paired watchfaces, compact watch-app rows and a distinct phone-plugin section. Product pages follow purpose/device preview, illustrated features, relevant connections, full gallery and setup/support. Home illustrates the Timer-to-watchface example after product browsing; detailed setup stays in the guides.
- Preserve all routes, legacy fragments and no-JavaScript reading/navigation. `/docs/` opens Getting started directly. Keep the existing Phone plan and its canonical redirects, without promoting it as installable software.
- Developer and Design task overviews live at `/docs/develop/` and `/docs/design/`. Current guides describe the released implementations; archived studies under `/docs/history/` preserve their original evidence, display a current-reference link and remain separate from current-guide pagination.
- Design references show live website specimens and native captures with their actual capture/reuse labels. Website materials, watch interfaces and phone settings retain separate roles. Search ranks relevant titles ahead of incidental body matches, reports all matches and lets readers reveal further results.
- Shape selection uses native radio controls and defaults to Time 2. Do not infer a visitor’s connected watch from their browser or automatically cycle previews.
- Keep keyboard access, reduced motion/transparency, browser theme preference and clear focus. Explicit Search may focus its input; ordinary visits must not move focus unexpectedly.

## Source ownership

Astro 7.4.7 produces static HTML beneath `/xoce/`; preserve existing dependency pins and lockfile. There is no backend, account system or automatic theme service. `src/lib/site.ts` owns the origin/base; templates, Markdown, search and redirects must use its path conventions.

`src/data/projects.ts` owns product identity, publication state, exact links, checked UUID/PBW hashes, summaries, features, requirements, shape previews and the optional illustrated showcase. Showcase images reference existing entries in `src/data/launch-screenshots.json`; that file owns capture metadata. `src/data/docs.ts` owns navigation and current/history status, with article content under `src/pages/docs`. `src/data/development.ts` records public library packages separately from reviewed app-tag dependency snapshots. An app-tag change requires a fresh dependency review; do not infer standalone library releases from bundled versions.

`src/data/release-highlights.ts` summarizes exact published release notes; its reviewed tag and source URL must match the catalogue before a new release can build. Product pages keep these brief highlights separate from the full upstream release notes. The shared watchface comparison explains the two current layouts without changing their product identities.

The illustrated setup uses `src/data/setup.ts` and version-labelled captures from the released settings pages. Phone examples use simulated bridge replies, while native results remain separate emulator examples. Keep written Pebble-app permission instructions distinct from XOCE settings screenshots. Preserve original image bytes and append provenance for new captures.

The shared product collection owns category order. Each product's connections explain its actual role rather than repeating a generic Activities tutorial. Timer owns countdowns and alarms, Dashboard cannot pause/resume Timer, Open Activity opens an associated app rather than a specific item, and weather readings use separate settings. Shared updates require phone plugin support, source permissions and connectivity. Music/notification integration requires Android.

Support/privacy routes are product-local. Privacy text comes from app-owned documents, with source commits/hashes in `docs/policy-provenance.json`. Change the app’s commitments only through separately scoped app work; the website must describe their actual data handling. Support uses the existing GitHub issue trackers. No invented contact channel, team, analytics or completed Android feature is implied.

## Images and provenance

Native screenshots are unchanged PNG bytes. Append new versioned assets and provenance; preserve historical images and records. Captions distinguish native emulator renders, browser settings previews and original plugin icons. Synthetic data is labelled and no screenshot establishes physical-device testing.

Retain the official Core Devices Time 2 and Round 2 frames, their original bytes and their provenance/licence distinction. Xef requested the matching official Round 2 illustration on 2026-11-13. Fit 200×228 Time 2 and circular 260×260 Round 2 captures into their respective apertures without stretching. Home and product previews use the appropriate device frame; compact catalogue and gallery views show the native captures directly. No additional third-party licence is granted by this website.

The original font, frame and screenshot records remain in `docs/asset-provenance.json`, with the Round 2 frame appended under `additional_device_presentations`; current preview records are also exposed in `public/preview-provenance.json`. Website materials remain separate from native app UI standards.

`docs/product-artwork.json` records the fresh website compositions under `public/images/product-art/`, their banner references and hashes. Square stage and wide tile exports have their own layouts. They are decorative brand artwork, not app screenshots or new device evidence. Keep original Store artwork, native captures and official frames unchanged; append the website artwork’s own provenance. Maintain the `identity.css` product-colour declarations used by the live design specimens alongside the shared artwork component.

## Verification and publication

Use Node 22.23.4 and Python 3.12.15. `npm test` runs type/build/link/doc checks and offline release-verification and search regressions. Native image dimensions, hashes and release versions must agree. Runnable provider and Core integration examples have separate host-side checks documented with their source; they do not establish physical-device behaviour. Browser checks exercise the built site separately and write disposable evidence under ignored `build/qa/`. Existing `docs/qa/` remains historical.

`npm run check:launch` is read-only: it checks public Store UUID/version/platform metadata and exact matching Store/GitHub PBW bytes. Missing or inconsistent data fails. All six current consumer releases passed this check after their Store submission on 2026-11-14. The [publication audit](qa/store-publication-2026-11-14/verification.json) records fresh public metadata and exact downloaded Store/GitHub bytes, including separately identified stale cached observations. Re-run the gate for later publication changes.

GitHub Pages hosting remains at https://xefensor.github.io/xoce/. Only successful, authorized main pushes/manual runs may deploy. The workflow runs the deployment gate before uploading Pages artifacts; PRs and branches validate locally without requiring unpublished listings. Do not push, publish apps or change hosting implicitly.

Project downloads retain their licences, including PolyForm Noncommercial. Do not describe them as unrestricted open-source releases. The website package remains UNLICENSED. Existing attributions, identifiers and release artifacts are unchanged.

## History

[Contracts before the Store redesign](history/website-before-store-launch.md) and the [history index](history/index.md) retain earlier decisions. They do not override the current contracts above.

The dated implementation notes below preserve the sequence of the 2026-11-14 artwork and Store preparation. Version numbers in those notes describe that stage; current publication identities belong to `src/data/projects.ts` and the current scope above.

## Store update — 2026-11-14

The six current PBWs are bound to the Store update manifest and reviewed-artifact hashes. Dynamic includes the adaptive reading layouts and category-based phone settings; Timer includes independent Time 2 alarm sound. Marketing uses the coordinated XOCE family: original product marks and per-platform 720×320 banners. The approved tactile revision uses Fira outlines, unmodified native captures and credited official device frames. This does not change native app UI. Product marks are visible in the catalogue and product headers; banners supply product social images. Weather remains a phone-only plugin.

New versioned website assets are appended alongside historical images. Source/runtime commits and current PBW identities remain separate from any public release claim. Existing preview and deployment gates remain authoritative.

## Approved tactile identity — 2026-11-14

Xef approved the single homepage concept before implementation. The real site uses cool silver in light mode, graphite in dark mode, blue actions, an outlined condensed XOCE wordmark and a matching X favicon. Header/controls and product stages have restrained edge highlights and contact shadows; reading text stays flat. The shared homepage stage shows Dynamic’s four-reading split layout and Halftone’s two-location scene, with both product names in the first mobile screen. No generated mockup is used as production UI.

`src/styles/theme.css` owns the material/colour roles; `src/styles/identity.css` owns the approved website presentation. Fira sources are pinned and hashed in `public/fonts/xoce/provenance.json`; local Latin WOFF exports include Czech characters and the OFL. Existing Inter/Space Grotesk and historic image files remain available. The new artwork review is `Watch/XOCE-Identity-2026-11-14/`; older review ZIPs are unchanged. App runtime code, PBWs, publication state and launch gates remain separate.

## Historical Store package numbering — 2026-11-14

Xef requested uploadable new versions after the public Store numbers were found to be in use. At this preparation stage, Dynamic, Dashboard and Open Activity were numbered 1.0.1; Timer 1.0.2, Halftone 1.10.2 and ČHMÚ Weather 1.0.3. `docs/reviewed-artifacts.json` records the rebuilt/frozen PBW hashes and committed source identities. The combined `store-updates/2026-11-14/` folder and ZIP captured those binaries and their artwork/copy. Later publication used the versions recorded in the current scope. Earlier release archives remain unchanged.

Historical captures and provenance stay intact. New versioned website assets retain the original `capture_version` and source PBW hash, alongside the represented release and a public `release_reuse_proof` where strict renderer/resource equality was checked. The asset validator accepts reuse only with the matching target PBW and verified original source. Weather has a fresh Chromium capture of its new packaged settings with a simulated Pebble bridge. The obsolete Dashboard action example is replaced by its current verified overview. Publication/installation gates still apply.


## Original Halftone artwork direction — 2026-11-14

Xef rejected the material Store tiles and selected the original orange Halftone banner as the reference. The replacement family uses app colours, curved patterned edges, outlined Fira titles and the original watch illustration style. Halftone has two fresh current-PBW orange native captures, one per platform. Standalone Store screenshots remain raw and unframed. Store watchapp/plugin icons use a black transparent binary glyph; the listing’s documented `icon_tintable` option must be enabled. Website product marks adapt to light/dark surfaces. This listing-only artwork update preserves the checked PBWs and frozen release archives. Current evidence and recipes are in `Watch/Pebble-Store-Artwork-2026-11-14/`.
