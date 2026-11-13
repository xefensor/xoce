# XOCE website maintainer instructions

## Scope

This is the static XOCE website, hosted on GitHub Pages at https://xefensor.github.io/xoce/.
A successful push or manual workflow run on main deploys automatically. Do not push or change hosting without authorization.
Read [CONTRIBUTING](CONTRIBUTING.md) for setup, output locations and commit/release policy.
The active Astro source is on main. Historical QA and screenshot evidence remains frozen.
History is not a second active specification.

## Important boundaries

Use local development/preview for validation. Preserve the established GitHub Pages deployment policy in docs/RELEASING.md. Public releases and unpublished implementations are distinct. Xef approved this branch as a local Store launch preview; candidate records must be labelled `preview` and have no active installation links. Published download metadata stays pinned to verified releases, and `check:launch` gates main deployment. Preserve routes, keyboard/no-JavaScript navigation and native screenshot bytes/provenance. Do not invent products, platforms, a team, licences or completed Android features. Current Pebble releases retain PolyForm Noncommercial notices. No backend/account system or automatic app-theme service is implied.

## Read only what the task needs

- Catalogue, navigation, accessibility and screenshot provenance:
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
