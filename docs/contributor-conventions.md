# XOCE contributor conventions

Each project keeps its own repository, history, dependencies and release workflow.
Its `CONTRIBUTING.md` owns prerequisites, exact commands and project exceptions.
Its `AGENTS.md` states constraints and points to the active maintenance, UI and
release documents.

## Repository layout

Use `src/` for source, `tests/` for checks, `scripts/` for tooling and `docs/` for
detailed guidance. Keep pinned local dependencies and their provenance in
`vendor/` where the project uses them. Preserve the locations required by watch
resources, phone-only plugins and catalogue tooling. Move files only when that
makes ownership clearer, and update every build, CI, packaging and site reference.

Keep development packages in the project's candidate build area and disposable
captures in `build/qa/`. Published artifacts and historical QA retain their
original bytes, version, source identity and verification scope.

## README order

Start with the name and a short description, then Download or Install,
Compatibility, Setup and Use where relevant, Development, and Licence. The
catalogue uses its public site and local preview instructions in the equivalent
sections. Link to detailed settings, troubleshooting and release guidance.

Name the actual supported watch, SDK or phone runtime. Distinguish public
releases, prereleases and local candidates. Keep download links, attribution,
licences and availability labels tied to the actual distributed project.

## Build and verify

Start from the repository's instructions, status and relevant entry point.
Preserve existing edits, public identities, wire keys, stored data and privacy
rules. Install locked dependencies and use the documented `npm test` and
`npm run build` commands or their stated project variants. A clean standalone
checkout must not need sibling repositories to build.

Run the checks relevant to the change. Separate portable tests, packaged
execution, emulator/browser checks, live-service checks and physical devices.
Bind screenshots and reports to the actual package and native payload hashes;
identify diagnostic and locale fixtures separately. Report unavailable checks
and the concrete steps still needed.

When a shared package changes, build and pack its candidate, record its source
commit and checksum, update affected consumer pins and build those consumers
independently. Apps retain their own lifecycle, input, state and storage.

## Review and publication

Review the diff and finish authorized work in local commits. Keep documentation
organization separate from behavior changes where practical. Preserve each
project's release policy. A local build or commit does not authorize a push,
release, Store submission or website deployment.
