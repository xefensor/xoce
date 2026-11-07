# Developing XOCE website

## Setup and normal work

Use the installed Node version required by package.json; no Pebble SDK is needed.

```sh
npm ci
npm test
npm run dev
```

The static site is built under `dist/`. Development and preview servers remain local.

| Task | What to read/check |
| --- | --- |
| Everyday source change | Run relevant source/native tests; use npm test for the complete portable suite. |
| Implementation boundaries | Read docs/MAINTENANCE.md for the affected ownership, compatibility or privacy boundary. |
| Release/publication | Read docs/RELEASING.md. Release preparation is explicit; it is not part of every edit. |

## What counts as done

Make the requested coherent change, run relevant required checks, and report the
result and material gaps. Broaden verification for an actual failure or unresolved
risk; do not automatically repeat every historical QA suite. SDK/native changes
need a current packaged build; visual work needs actual inspection. Do not claim
fresh browser/device evidence from source checks or an old report.

## Output and commit policy

Ordinary work does not bump a version, produce source/debug release archives or
publish anything. A candidate contains the installable runtime and notices and
can be inspected independently of frozen artifacts. Candidate fingerprints reject
stale source or modified bundles. Finish a coherent authorized change in a local
commit when appropriate; do not push, tag, upload or deploy without explicit scope.

## Repository map

Astro builds static pages; src/data/projects.ts owns exact release/catalogue metadata; src/data/docs.ts owns navigation. src/pages/docs holds articles; shared layouts/components and styles own presentation.

[Current maintenance contracts](docs/MAINTENANCE.md) · [Release boundary](docs/RELEASING.md) ·
[Historical maintainer notes](docs/history/maintainer-notes-before-rework.md)

[Repository maintenance validation](docs/qa/repository-rework-2026-11-07/validation.json)
records the preserved baseline and this pass’s checks.
