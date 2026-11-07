# Layout, content and structure review

Local review: http://127.0.0.1:4323/

Implemented the page jobs in `docs/site-structure.json`, informed by the current
GNOME, KDE, Apple and Microsoft product/catalogue/help pages. Apps now opens
the catalogue directly. Home gives the four available apps comparable places.
Available/planned groups, distinct product/library/plan pages and contextual
setup/help links reduce repeated navigation and descriptions. Docs remains an
actual article at its entry, with practical setup first and old fragments kept.

Corrected the public prerequisites and instructions against tagged source:
Music/Notifications built-ins require Android; published Dynamic settings
submit and close, while confirmed stay-open forms are described separately.
Current PolyForm source is described accurately. Credits reflect raw native
images and Inter; only a stale website-identity sentence changed in the
canonical native UI standard. Native app rules and app repositories did not
change. Versions, repositories, download URLs, platforms, image references,
licences and app relationships match the pre-edit metadata.

`npm test` passes: 28 checked files, zero diagnostics, 33 generated pages,
1,671 internal references, 318 anchors and 18 referenced assets. The existing
Chromium workflow suite passes 16 groups with 83 captures. It checks all routes
at 1440/360/320px; direct keyboard/mobile navigation, filters, native/no-JavaScript
Docs and links, search, themes through reload/restart and reduced motion pass.
Twelve supplemental cases cover reduced transparency on Home, catalogue, a
product, Docs and both platform pages in both themes. No browser exceptions or
failed local requests were recorded. Three additional captures cover the
Open Activity prerequisite, library action hierarchy and mobile footer.

An independent review inspected 12 final frames. The main agent inspected three
final requirement/library/Docs frames plus three earlier Home/catalogue frames
whose layout is unchanged. No concrete clipping, overlap, unreadable text or
task-flow defect was found in those frames. This is browser/viewport testing
and screenshot review, not physical phone/watch verification or user acceptance.
Not every captured frame was manually reviewed.

All work remains local and uncommitted. No Git remote, push, hosting registration
or deployment was created. Historical evidence remains unchanged.
