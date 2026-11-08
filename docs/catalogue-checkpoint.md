# Public catalogue checkpoint

The 2026-11-08 catalogue adds two existing public GitHub downloads: Halftone
1.9.0-rc.6, a prerelease watchface, and ČHMÚ Weather 1.0.1, a phone plugin whose
release is not marked as a prerelease. The release records were checked through
GitHub's public releases API. Downloads use those exact tags and asset names;
local development candidates are separate.

The Software page now contains six available downloads. Project pages, setup,
controls, troubleshooting, Getting started and the Pebble overview explain each
new project's actual role. ČHMÚ Weather is labelled as running in the Pebble
phone app. The public Halftone rc.6 is not described as a generic activity host
or Timer integration. Planned Phone/companion work retains its existing routes
and availability boundary.

The Home showcase keeps its four native watch previews, now selected through
shared metadata. The complete six-project collection remains in Software. No
watch frame is applied to the weather plugin's icon.

Both new assets were extracted byte-for-byte from release store archives whose
digests match the verified release records:

| Asset | SHA-256 |
| --- | --- |
| Halftone rc.6 store archive | `03805809dea05d84c44a1c564442fe17dd7d6148a30b9bebb8ad9a97a5a22ae9` |
| Halftone native PNG, 200 × 228 | `d75e736b20791b5683d2df634b0d371e29e63e0b87cceefc941fc5893e875267` |
| ČHMÚ Weather 1.0.1 store archive | `1e3069642e344c262898990619762d373ec31653c682eb6042bf532707aa663f` |
| ČHMÚ Weather provider icon, 144 × 144 | `f0fde8a6c64cd1b5238e920ab84621aa350f6749b7c60714bf3fd360c4b0a62a` |

The Halftone image is labelled as an rc.5 capture verified unchanged in rc.6;
the released store provenance records comparison with the final rc.6 native
payload. No new capture date is inferred. The weather icon is the project's
original generic sun/cloud/rain artwork, not an official ČHMÚ logo or a phone
screenshot. [Asset provenance](asset-provenance.json) records their exact source
archive members. Existing screenshots and the official watch-frame bytes are
unchanged. Licences remain with the source projects and assets.

`npm test` passes: type checking, the static build, 1678 internal references,
394 anchors, six catalogue downloads, two developer libraries, asset hashes,
dimensions and active documentation links. The build produces 35 pages.

The actual local `npm run preview` and Chromium suite pass 21 checks and capture
73 screens. This includes the new project pages, exact download links, the
complete catalogue, mobile layouts, keyboard and no-JavaScript navigation,
redirects, search, appearance persistence/restart and reduced motion/transparency.
Representative new desktop and mobile screens were inspected. Evidence is in
ignored `build/qa/catalogue-browser-current/report.json`; the static check log is
`/tmp/xoce-catalogue-tests.log` in this session.

The browser suite originally assumed every download belonged in the four-choice
Home watch showcase. That assumption was corrected to use its explicit preview
selection while retaining checks for all six Software downloads. The sandbox
blocks localhost sockets, so the local preview/browser run used the approved
test-process permission override and an isolated temporary browser profile. The
preview process was stopped after testing.

No hosting, dependency, version, push or deployment change is part of this
checkpoint. Physical watch/phone evidence belongs to the owning projects; these
website checks establish neither device compatibility nor live provider delivery.
