"""Retain the dependency licence and audit the exact SDK-built example PBW."""
from pathlib import Path
import json
import sys
import zipfile

root = Path(__file__).resolve().parents[1]
pbw = Path(sys.argv[1])
licence = (root / "node_modules/pebble-watchface-core/LICENSE").read_bytes()
licence_name = "licenses/pebble-watchface-core-LICENSE.txt"
with zipfile.ZipFile(pbw, "a", zipfile.ZIP_DEFLATED) as archive:
    if licence_name not in archive.namelist():
        archive.writestr(licence_name, licence)
    assert archive.read(licence_name) == licence
with zipfile.ZipFile(pbw) as archive:
    assert archive.testzip() is None
    assert len(archive.namelist()) == len(set(archive.namelist()))
    info = json.loads(archive.read("appinfo.json"))
    assert info["targetPlatforms"] == ["emery"]
    assert info["appKeys"]["COMPLICATION_DATA"] == 9001
    script = archive.read("pebble-js-app.js")
    assert b"subscribeToSource" in script and b"REQUEST_READINGS" in script
    assert archive.read("emery/pebble-app.bin").startswith(b"PBLAPP")
print("Emery PBW: native payload, merged phone bundle and dependency licence PASS")
