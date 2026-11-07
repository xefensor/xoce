# Actual Spatial Desktop material adaptation

The reference is the actual desktop at Spatial Desktop commit `647b6e1`, served
from `dist/index.html` and inspected in Chromium in Light and Graphite themes.
Neither its philosophy page nor its design-notes website supplied this design.
Reference captures are retained beside this report.

XOCE now uses the unchanged silk SVG, static blue background paint, square
acrylic navigation with reflected cut edges, opaque shaded ABS casings, recessed
reading/screenshot wells and raised action caps. Real presses replace the raised
shadow with an inset contact shadow. No ambient wallpaper animation or desktop
window-management runtime is imported. Artwork/material credits and licence
copies are recorded in `docs/spatial-material-reference.json` and the notices.

Docs still opens the Getting started article directly, with its native tree.
The material pass preserves content, routes, actual app connections, exact public
download versions, product licences and the four native screenshot files.
The canonical Pebble UI standard and sibling app repositories are unchanged.

`npm test` passed: 28 Astro files without diagnostics, 33 generated pages,
1,649 internal references, 303 anchors and 18 referenced assets. The final
Chromium run passed 16 workflow groups and saved 83 frames. All generated routes
were checked at 1,440, 360 and 320 CSS pixels. Search, filters, native keyboard
navigation, themes across reload/browser restart, no-JavaScript workflows and
reduced motion passed.

A separate check passed ABS pressed-state and reduced-transparency cases in
both themes, saving four additional frames. Acrylic becomes opaque and disables
blur when reduced transparency is requested. An earlier supplemental run found
that prefixed-property order dropped the standard blur reset from the built
CSS; the standard declaration now follows the prefixed one, and the final
computed-style check passes. The wallpaper has no idle animation.

Representative Home, Docs and product captures were compared with the actual
desktop, including an independent visual review. Final Home, mobile dark Docs
and opaque fallback frames were rechecked after the casing-label refinement.
Not every captured frame was manually inspected. Browser evidence uses Chromium
on Linux and mobile viewport emulation, not physical-phone/watch verification.

The result remains local and uncommitted; nothing was pushed or deployed.
Review at <http://127.0.0.1:4323/> while the development server is running.
See [report.json](report.json), [materials-report.json](materials-report.json)
and [validation.json](validation.json) for scope and hashes.
