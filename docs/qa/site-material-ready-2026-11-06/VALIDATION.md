# Whole-site material design — local validation

The approved website direction now applies to every page. Home has one featured
app and compact rows for the other releases. Catalogue, product, platform and
audience pages use the same neutral light/graphite dark roles and Inter type.
All 14 guides use one reading layout with native mobile navigation and contents.
Mobile Home presents Dynamic’s name, purpose and download before its screenshot.

The checkout remains local. No commit, push, hosting registration or deployment
was performed for this rollout. The live review server is
<http://127.0.0.1:4323/> while that local development process is running.

## Automated checks

- `npm test`: Astro check, production build and link/content audit pass.
- Astro: 27 checked files, no errors, warnings or hints.
- Static output: 32 pages, 1,524 internal references, 286 anchors and 13 referenced assets.
- Chromium: 15 workflow groups and 83 captured frames pass, without browser
  exceptions or failed local HTTP requests.
- All 32 generated pages, including the error page, were checked for horizontal
  overflow at 1,440, 360 and 320 CSS pixels.
- Fourteen representative page types were checked in light/dark themes and
  desktop/mobile viewports. Theme selection survived reload and browser restart.
- Navigation, app filtering, search, product/guide paths, companion relationships,
  keyboard controls, reduced motion and native contents links passed. Primary
  content, menus and guide links also worked with JavaScript disabled.

These are automated Chromium checks on Linux, including mobile viewport
emulation. They do not establish physical-phone WebView or physical-watch results.

## Visual and preservation checks

Representative desktop/mobile captures were visually reviewed across Home,
platforms, catalogue, products, audience pages and guides. The final mobile Home,
dark desktop Home, Android mobile and setup-guide frames were rechecked after
the small layout refinements. Not every captured frame was manually inspected.

Product metadata matches its pre-rollout hash. All four native screenshot files
match their recorded provenance hashes. Exact public release/download links,
per-project licences, app connections and existing guide destinations remain.
The canonical Pebble UI standard and sibling app repositories were not changed.

See [report.json](report.json) for browser results and
[validation.json](validation.json) for scope, hashes and historical evidence.
Earlier reports retain their original scope; the initial full-site run predates
the final mobile content order, Android divider and short-desktop rail refinements.
