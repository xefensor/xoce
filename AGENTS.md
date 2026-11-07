# XOCE website maintainer instructions

## Scope

This is a local static website; do not publish or configure hosting without an explicit request.
Read [CONTRIBUTING](CONTRIBUTING.md) for setup, output locations and commit/release policy.
The accepted app UI is on main. Older candidates, QA records and source archives
remain frozen; history is not a second active specification.

## Important boundaries

Keep the site local until publication is explicitly requested. Public releases and merged-but-unpublished app implementations are distinct; catalogue/download metadata stays pinned to actual public releases. Preserve routes, keyboard/no-JavaScript navigation and native screenshot bytes/provenance. Do not invent products, platforms, a team, licences or completed Android features. Current Pebble releases retain PolyForm Noncommercial notices. No backend/account system or automatic app-theme service is implied.

## Read only what the task needs

- Ownership, storage, source lifecycle, privacy or capabilities:
  [current maintenance contracts](docs/MAINTENANCE.md).
- Versioning, archives, tags, upload or deployment: [release boundary](docs/RELEASING.md).

## Work and verification

Respect research/review versus implementation scope. Preserve established user
choices; clarify materially different interpretations before changing direction.
Run relevant required checks. Tests alone do not judge visual quality. Keep
source/portable tests, packaged execution, native emulator and real-device
verification distinct. Use disposable development evidence; do not overwrite
historical proof or relabel it as fresh.

`npm test` checks types, builds and validates site references. Actual browser
checks are separate and require a running preview/browser environment.
Do not bump versions or create release archives for routine edits. Never push,
publish or deploy as an implicit part of testing. Keep instructions current;
put superseded decisions in [history](docs/history/maintainer-notes-before-rework.md).
