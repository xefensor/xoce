# XOCE contributor conventions

These conventions apply to the separate XOCE repositories. Each project's
`AGENTS.md`, `CONTRIBUTING.md` and package scripts supply its exact commands and
requirements. The [XOCE website](https://xefensor.github.io/xoce/) links current
products, user guides, developer references and design guidance.

## Find the right repository

Consumer apps, embedded libraries and the website have independent histories and
releases. A library is bundled by its consumer; users do not install it on the
watch separately. Use the maintained repository linked from each product page.
Archived predecessor repositories preserve historical releases and point to their
successors.

The [repository metadata](repository-metadata.json) supplies current About
descriptions and product website links. Keep those GitHub fields aligned with
the README when a product's public purpose changes.

Start by reading the local maintainer instructions, inspecting the working tree
and checking the current branch. Preserve unrelated work. Keep changes focused
on the requested behaviour and keep useful existing routes, interfaces and
compatibility promises.

## Explain the current product

Keep the README useful to someone arriving for the first time: describe the
product, link its current Store/product page and exact published release, give
requirements and setup, then link usage, support, privacy and development docs.
Distinguish shipped features from work in development. Older version notes and
retired instructions belong in clearly dated history, with links from current
guides when they remain useful.

Published versions, UUIDs, platform lists, download URLs and hashes must agree.
An app's newer vendored library snapshot is independent of the latest standalone
library release. Do not advertise an unpublished snapshot as a public package.
Current publication records describe verified releases; local Store-kit tools
never grant permission to upload or publish.

## Build and verify

Use the repository's selected Node/Python versions, locked dependencies and
documented Python requirements. Keep generated candidates and disposable QA
under ignored `build/` paths. The website needs no Pebble SDK; a phone-only plugin
needs no native watch build. Native consumers use the SDK and platforms stated
by their own project.

Run the checks relevant to the change and report what they establish. Portable
tests, packaged execution, browser checks, native emulator captures and physical
phone/watch verification are separate evidence. A fixture or emulator result
does not establish a physical-device result. Preserve historical evidence and
add a dated correction when an earlier summary was inaccurate.

Review user-facing behaviour as well as test output. Match the current
[design guidance](https://xefensor.github.io/xoce/docs/design/) while preserving
each product's identity. Use meaningful accessible labels, readable values and
units, keyboard-operable phone controls and clear save/delivery states.

## Preserve releases and source provenance

Do not bump app versions, move tags, rebuild frozen archives or replace published
assets for routine documentation or tooling changes. Release preparation is
local validation; publication is a separate authorized action. A website push to
`main` deploys the checked website through GitHub Pages; it does not release the
apps.

Keep native screenshot bytes, represented versions and capture provenance intact.
Distinguish Store artwork from native screenshots and phone-settings examples.
The maintained [artwork tools](../artwork/README.md) export candidates without
changing current app assets. Preserve app-owned privacy statements, licences,
font licences and third-party notices when moving or adapting content.

Before publishing, review the complete diff, run required checks, confirm the
target branch has not changed and describe the resulting behaviour and actual
validation. Keep release, deployment and physical-device claims precise.
