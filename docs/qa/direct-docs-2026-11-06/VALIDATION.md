# Direct documentation reader

Docs opens the existing Getting started article immediately. It uses the same
article body, layout and headings as `/docs/getting-started/`; no prose is copied
into a separate entry page. Guides, Developers and Design are native sidebar
sections. Their headings expand the tree without leading to overview pages.

The rejected hub is removed. Contextual links open actual instructions, and the
useful source/build material is retained in Building and contributing. All six
exact public-version build references and explicit library consumers remain.
Search results lead to articles. Former portal URLs redirect to real articles,
also through native refresh when JavaScript is disabled.

`npm test` passed: no Astro diagnostics, 33 generated pages, 1,644 internal
references, 303 anchors and 13 referenced assets. Chromium passed 16 workflow
groups and saved 83 frames. The checks cover direct article entry, cross-section
sidebar navigation, app-to-guide links, compatibility redirects, search,
light/dark themes, theme persistence across reload and browser restart, reduced
motion, mobile layouts and navigation without JavaScript. All generated routes
were checked at 1,440, 360 and 320 CSS pixels.

Representative Docs desktop/mobile, dark build-guide and expanded no-JavaScript
navigation captures were visually reviewed. The result has one article layout,
readable content and direct sidebar links. Not every frame was manually inspected.
Browser checks use Chromium on Linux with mobile viewport emulation; they do not
establish physical-phone or physical-watch results.

Product metadata, native screenshot provenance hashes, exact release links,
licences and the canonical Pebble UI standard are preserved. Earlier
`docs-consolidation-*` reports describe the rejected hub and remain historical.

The result remains local and uncommitted. No push or publication was performed.
Review at <http://127.0.0.1:4323/docs/> while the development server is running.
See [report.json](report.json) and [validation.json](validation.json) for details.
