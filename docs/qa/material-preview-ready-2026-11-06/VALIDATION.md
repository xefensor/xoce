# XOCE material direction — two-page local preview

Only the homepage and `/docs/pebble/setup/` opt into the material preview.
The other routes retain the previous appearance. This is a visual proposal for
review, with no whole-site rollout, app UI change or public deployment.

`npm test` passes: 27 checked Astro files, zero errors/warnings, 32 generated
pages, 1,405 internal references, 190 anchors and 12 assets. The final built
static output passes 15 Chromium workflow groups with 35 captures, no browser
exceptions and no failed local HTTP requests. See [the browser report](report.json)
and [scope/source hashes](validation.json).

Checks cover all original navigation/search/platform/relationship workflows,
exact direct homepage downloads, planned Phone availability, preview-only
palette/font scope, light/dark appearance, theme reload/restart, reduced motion,
early mobile guide content, native contents links and no-JavaScript navigation.
The guide markdown and original watch screenshots are unchanged. Four final
screenshots were manually inspected; other capture evidence remains scoped to
its actual review. Mobile viewports are emulated, not physical-phone testing.

The local live review server is http://127.0.0.1:4323/ while running. Earlier
failed/intermediate attempts are retained separately with explanations in
validation.json; they are not counted as final passing evidence.
