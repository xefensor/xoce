"""Audit the new patch packages, prove capture reuse, then freeze new files only."""
from pathlib import Path
import hashlib
import json
import subprocess
import sys
import zipfile

WATCH = Path(__file__).resolve().parent.parent
REVIEW = Path(__file__).resolve().parent
BASE = WATCH / "Store-Update-2026-11-14"
rows = json.loads((REVIEW / "versions.json").read_text())
sys.path.insert(0, str(WATCH / "pebble-watchface-dynamic/scripts"))
from native_identity import renderer_identity


def sha(data):
    return hashlib.sha256(data).hexdigest()


def run(repo, label, command):
    log = REVIEW / "verification" / (repo.name + "-" + label + ".log")
    print(repo.name, label, "START", flush=True)
    with log.open("w") as stream:
        result = subprocess.run(command, cwd=repo, stdout=stream, stderr=subprocess.STDOUT)
    print(repo.name, label, "PASS" if result.returncode == 0 else "FAIL", flush=True)
    if result.returncode:
        raise SystemExit(result.returncode)


for row in rows:
    repo = WATCH / row["repo"]
    store = repo / "store"
    name = "CHMU-Weather" if row["type"] == "plugin" else row["product"].replace(" ", "-")
    pbw = repo / ("dist" if row["type"] == "plugin" else "build/candidate") / (name + "-" + row["version"] + ".pbw")
    old = BASE / row["file"]
    platforms = [] if row["type"] == "plugin" else ["emery", "gabbro"]
    frozen = repo / "releases" / pbw.name
    if frozen.exists():
        assert frozen.read_bytes() == pbw.read_bytes()
        for line in (repo / "releases" / ("SHA256SUMS-" + row["version"] + ".txt")).read_text().splitlines():
            expected, filename = line.split("  ", 1)
            assert sha((repo / "releases" / filename).read_bytes()) == expected
        row["sha256"] = sha(pbw.read_bytes())
        row["file"] = str(frozen.relative_to(WATCH))
        row["candidateFile"] = str(pbw.relative_to(WATCH))
        row["equivalenceProof"] = "docs/qa/store-version-" + row["version"] + "/package-equivalence.json"
        print(row["product"], row["version"], "EXISTING FROZEN BYTES VERIFIED", flush=True)
        continue
    with zipfile.ZipFile(pbw) as new, zipfile.ZipFile(old) as previous:
        assert new.testzip() is None
        info = json.loads(new.read("appinfo.json"))
        assert info["versionLabel"] == row["version"] and info["uuid"] == row["uuid"]
        identities = {}
        for platform in platforms:
            names = [platform + "/pebble-app.bin", platform + "/app_resources.pbpack"]
            before = renderer_identity(*(previous.read(n) for n in names))
            after = renderer_identity(*(new.read(n) for n in names))
            assert before == after, (row["product"], platform, "Renderer changed")
            identities[platform] = after
        if not platforms:
            assert set(new.namelist()) == set(previous.namelist())
            assert all(new.read(n) == previous.read(n).replace(row["previousVersion"].encode(), row["version"].encode()) for n in new.namelist() if n != "appinfo.json"), "Plugin changed beyond the embedded version label"
            original_info = json.loads(previous.read("appinfo.json"))
            assert {k:v for k,v in info.items() if k != "versionLabel"} == {k:v for k,v in original_info.items() if k != "versionLabel"}
    proof = {
        "result": "PASS", "version": row["version"], "previousVersion": row["previousVersion"],
        "pbwSha256": sha(pbw.read_bytes()), "previousPbwSha256": sha(old.read_bytes()),
        "platforms": identities, "uuidUnchanged": True,
        "nativeRendererResourcesUnchanged": bool(platforms),
        "pluginRuntimeAndSettingsUnchanged": not platforms,
        "scope": "Fresh SDK/public builds. Existing strict renderer identity ignores SDK timestamp, build ID and its derived CRC only; code, native version bytes, UUID and resources remain covered. Plugin/settings compare byte-for-byte except the exact embedded version string. Original captures reused without pixel changes; no fresh emulator or physical-device claim.",
    }
    proof_path = repo / "docs/qa" / ("store-version-" + row["version"]) / "package-equivalence.json"
    proof_path.parent.mkdir(parents=True, exist_ok=True)
    proof_path.write_text(json.dumps(proof, indent=2) + "\n")
    (REVIEW / "verification" / (row["repo"] + "-package-equivalence.json")).write_text(json.dumps(proof, indent=2) + "\n")
    if platforms:
        provenance_path = store / "capture-provenance.json"
        provenance = json.loads(provenance_path.read_text())
        assert provenance["renderer"] == identities
        provenance.setdefault("originalCaptureVersion", provenance["version"])
        provenance.setdefault("sourceCaptureCandidateSha256", provenance["candidateSha256"])
        provenance["version"] = row["version"]
        provenance["candidateSha256"] = sha(pbw.read_bytes())
        provenance["scope"] = "Original native PNGs reused for the new patch after strict renderer/resource equality with the reviewed package was verified. Synthetic example data; no fresh capture or physical-device claim."
        provenance["reuseProof"] = str(proof_path.relative_to(repo))
        for capture in provenance["screenshots"].values():
            capture["rendererProof"] = "Original capture pixels unchanged; native renderer/resources match the new patch. See " + provenance["reuseProof"]
        provenance_path.write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + "\n")
        run(repo, "artifact", ["npm", "run", "check:artifact"])
        run(repo, "config", ["npm", "run", "check:config"])
    run(repo, "store-prepare", ["python3", "scripts/store-kit.py", "--pbw", str(pbw)])
    run(repo, "store-check", ["python3", "scripts/store-kit.py", "--check", "--pbw", str(pbw)])
    run(repo, "freeze", ["python3", "scripts/freeze-release.py"])
    row["sha256"] = sha(pbw.read_bytes())
    row["file"] = str((repo / "releases" / pbw.name).relative_to(WATCH))
    row["candidateFile"] = str(pbw.relative_to(WATCH))
    row["equivalenceProof"] = str(proof_path.relative_to(repo))
    print(row["product"], row["version"], "FROZEN", flush=True)

(REVIEW / "products.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n")
