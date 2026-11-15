# XOCE artwork sources and candidate exports

The current editable masters live in each app repository's `store/` directory:
`product-mark.svg` / `icon-source.svg` for icons and
`emery-family-banner.svg` / `gabbro-family-banner.svg` for native-product banners.
The accompanying provenance files identify exact checked-in PNGs and native
captures. ČHMÚ Weather is a phone-only plugin: its banner is website artwork,
not a plugin Store upload or a watch screenshot.

These tools make the artwork workflow available without the earlier external
review package. They export candidates into this checkout's ignored `build/`
directory. They never apply files to apps, update Store listings, build PBWs or
publish anything. Existing export files are not replaced.

## Export banners from editable masters

Use this website's pinned Node runtime and locked dependencies:

```sh
npm ci --ignore-scripts
node artwork/export-banner.mjs --source /path/to/pebble-app-timer/store/emery-family-banner.svg --output build/artwork/timer-emery.png
```

The 720×320 masters already contain outlined typography and embedded native
captures. No font download, sibling build, external frame or network image is
needed. The tool accepts only self-contained SVGs and records the source/output
SHA-256, dimensions and renderer versions beside the PNG. Edit a copy of the SVG
master to create a new composition, then export to a fresh candidate filename.
Uniform presentation scaling is distinct from editing the raw screenshot bytes.

Raster output can differ between renderer versions. A new export is a candidate,
not a replacement for a historical asset or proof of a new app build. Preserve
the original PNG and its provenance; review a new composition and record its
own source and renderer before deliberately adopting it.

## Generate the icon family

The geometric scene and optical rasterization code from the reviewed
2026-11-14 family is maintained in [generate-icons.py](generate-icons.py).
It draws each target size directly into a binary alpha mask; it does not resize
an antialiased glyph. Product-specific details remain intentional.

```sh
python3 -m venv .venv-artwork
. .venv-artwork/bin/activate
python -m pip install -r artwork/requirements.txt
python artwork/generate-icons.py --product timer --output build/artwork/timer-icons
```

Use `--product all` for all six products. Watchapp/plugin Store icons use black
on transparent at 80×80 and 144×144. Watchfaces export website marks, not app-icon
upload fields. The optional 25×25 launcher exports are candidates; integration
still belongs to the app and its tested appearance behaviour. ČHMÚ has no native
launcher export.

The generated manifest contains the output hashes and format policies. Compare
exports with the app's current icon provenance before adopting anything. An
existing folder with files is refused; use a fresh `build/` directory for another
run. The tools introduce no new licence for the artwork: app licences and
third-party/font notices remain authoritative.

## Keep current authority clear

Files in released Store/source ZIPs and historical QA records describe their
original snapshots. Their old `artwork/generate-*.py` paths referred to the
external review package. Use the checked-in app masters and this maintained
workflow for new candidates. Add dated corrections or new provenance records;
do not silently replace historical screenshots, hashes or test claims.
