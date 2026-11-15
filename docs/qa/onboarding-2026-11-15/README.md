# Packaged settings capture fixtures

These pages are for CUA screenshots of Dynamic 1.0.2 and Halftone 1.10.3 setup.
They use the exact `config.html` from the published PBWs identified in
`metadata.json`, downloaded from the recorded release URLs and SHA-256 checked
against the current website catalogue. No tracked app source is edited.

## Open and capture

- `dynamic.html?capture=1`: choose **Activities**.
- `halftone.html?capture=1`: open **Content & priority**.
- Both accept `lang=en|cs` and `platform=emery|gabbro`.

`capture=1` hides **only** the extra fixture disclosure banner. It does not hide,
move or replace any application control. The final image caption and provenance
must identify a packaged-settings page with a simulated bridge, not a real phone
or watch connection. Without this parameter the added banner remains visible.

Initial synthetic state: activity plugins and Music on; Timer discovered but
hidden; Notifications off; order Music, Timer, Notifications. Enable Timer. In
Dynamic choose **Reorder**, move Timer above Music and choose **Done**. Halftone
shows its **Move up / Move down** controls directly. Then press the actual **Save**.
The app's own controller should show phone Save confirmation independently of
watch delivery. Watch delivery remains pending; **Retry** cannot manufacture a
watch receipt. Root performs UI actions and screenshots through CUA.

## What is real and simulated

- Real: the packaged HTML/CSS/JavaScript and its existing controls, validation,
  category navigation, priority editor and Save/status rendering.
- Real package contract: the exact PBW's `plugin.js` configuration handler was
  executed in a non-browser VM to accept the seeded settings and generate its
  localized configuration. The supplied `seedSettings` are recorded in metadata.
- Simulated: one installed Timer provider, saved phone preferences, settings
  transport, and a pending delivery with no watch receipt. State is in page memory
  and resets on reload. No real account, phone storage, watch, app launch or source
  subscription is accessed. Networking is blocked by CSP and bridge stubs.

`bridge-fixture.js` is the complete isolated bridge function used in the injected
bootstrap. The bootstrap calls it with the app name and generated English/Czech
configuration packets. Their only catalogue addition is Timer; its UUID, visibility
and priority are recorded. Original native/library preview frames inside the
packaged UI retain their original scope; these captures do not create new watch
renders.

## Integrity and reproduction

`metadata.json` records PBW, packaged config and complete generated-page hashes.
The generator asserts that removing its added CSP meta, disclosure aside and
`data-xoce-capture-bridge` script from the fixture restores **byte-identical**
packaged `config.html`. Every original application script remains untouched.

To verify a PBW after downloading its recorded URL:

```sh
sha256sum Dynamic-1.0.2.pbw Halftone-1.10.3.pbw
python3 - <<'PY'
import hashlib, zipfile
for name in ['Dynamic-1.0.2.pbw', 'Halftone-1.10.3.pbw']:
    with zipfile.ZipFile(name) as archive:
        assert archive.testzip() is None
        config = archive.read('config.html')
        print(name, hashlib.sha256(config).hexdigest())
PY
```

Compare the output with metadata. A fresh fixture can be reconstructed from the
verified PBW by registering its plugin config handler against an in-memory store,
saving the recorded seed, loading the requested language, adding the Timer entry
to its metadata and setting delivery to `{state:'pending',applied:false,pending:true}`.
Inject the isolated bridge before the first original script; do not patch the
application code. The task generator additionally checks exact seed readback and
the restoration assertion described above.

Validation performed: PBW/config hashes; actual plugin seed acceptance; exact
unmodified-UI restoration; isolated load/Save/pending bridge contract in a Node VM.
Browser screenshots and visible-state confirmation are recorded separately by
the CUA operator. No hardware test is claimed.
