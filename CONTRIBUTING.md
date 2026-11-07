# Developing the XOCE website

Use the Node version required by package.json (22.23.4 or newer). The pinned Astro/TypeScript
dependencies are in package-lock.json. No Pebble SDK or sibling checkout is needed.

```sh
npm ci
npm test
npm run dev
```

`npm test` checks types, builds static pages, validates links/references and checks active
documentation links. `npm run preview` serves `dist/` on 127.0.0.1:4322. For real Chromium
checks of the built site:

```sh
XOCE_SITE_URL=http://127.0.0.1:4322/ XOCE_QA_OUTPUT=build/qa/browser npm run check:browser
```

Keep development and preview servers local. Disposable browser evidence belongs in ignored
`build/qa/`; existing `docs/qa/` is historical. Inspect changed pages in desktop/mobile layouts
and report browser coverage separately from physical-device testing.

`src/data/projects.ts` owns exact catalogue releases, downloads and licence links. Verify GitHub
tags/assets before updating it. `src/data/docs.ts` owns navigation; `src/pages/docs` holds
articles; shared layouts, components and styles own presentation. Preserve existing routes and
keyboard/no-JavaScript navigation. Screenshot bytes/provenance stay unchanged, even when the
catalogue moves to a newer release.

Read [maintenance contracts](docs/MAINTENANCE.md) and the [publication
boundary](docs/RELEASING.md). No hosting, deployment, app release tooling or backend is needed
for routine website work. Commit coherent authorized maintenance locally; do not push or publish
implicitly.

[History index](docs/history/index.md).
