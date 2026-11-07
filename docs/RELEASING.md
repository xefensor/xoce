# Publishing the XOCE website

The site is published at **https://xefensor.github.io/xoce/** from `main` in
[xefensor/xoce](https://github.com/xefensor/xoce). Xef explicitly requested GitHub
Pages hosting and retention of the existing Pebble frame on 2026-11-07.

## Checks and deployment

The [website workflow](../.github/workflows/checks.yml) runs on pushes, pull
requests and manual dispatch. It selects the pinned Node/Python runtimes, installs
locked dependencies, runs `npm test`, and inspects desktop/mobile pages in Chrome,
including keyboard navigation, search, old bookmarks and no-JavaScript use.
Browser reports and screenshots are retained for 14 days.

Only a successful run on `main` can upload the checked `dist/` as a Pages artifact
and deploy it through the `github-pages` environment. Pull requests and other
branches run checks without deploying. The deployment job alone receives
`pages: write` and `id-token: write`; actions remain pinned to commit hashes.
Public route, search-index and frame requests are checked after deployment.
No personal access token or separate hosting account is required by the workflow.

GitHub Settings → Pages must use **GitHub Actions** as its source. The
`github-pages` environment permits deployments from `main` only. The repository
homepage points to the live URL. There is no custom domain, backend or gh-pages
source branch.

## Routes and assets

[Site paths](../src/lib/site.ts) define the public origin and `/xoce/` prefix.
Astro templates, Markdown rendering, search and redirects all use that prefix.
The suffixes of existing routes and legacy fragments remain compatible. Local
development and preview use the same paths as the public site.

Keep the native screenshot and frame bytes/provenance intact. Xef requested that
the frame remain in the public site; this decision does not grant an additional
third-party licence. The provenance record preserves the source and licence status.
Changing catalogue metadata does not publish an app release or replace its artifacts.

## Review and recovery

Before pushing website work to `main`, review the diff and built pages, run the
checks in [CONTRIBUTING](../CONTRIBUTING.md), and inspect relevant browser evidence.
A push to `main` deploys automatically after checks pass. To redeploy the current
source, manually run **Website checks and deployment** against `main`. For a
rollback, revert the affected source commit on `main` and let the same checks and
deployment run. Do not move app release tags or regenerate their archives.

Builds and previews stay local until an authorized push. Generated output belongs
in ignored `dist/`, disposable browser evidence in `build/qa/`, and historical
`docs/qa/` evidence retains its original scope.

[Earlier publication policy](history/release-policy-before-maintenance.md).
