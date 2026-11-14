"""Replace the working handoff with the newly numbered, verified release files."""
from pathlib import Path
import hashlib
import json
import shutil
import struct
import subprocess
import zipfile

WATCH = Path(__file__).resolve().parent.parent
REVIEW = WATCH / "Pebble-Store-Versions-2026-11-14"
SITE = WATCH.parent / "XOCE-website-update"
OUT = WATCH / "Pebble-Store-Update-2026-11-14"
IDENTITY = WATCH / "XOCE-Identity-2026-11-14"
SLUGS = ["dynamic", "halftone", "timer", "dashboard", "open-activity", "chmu-weather"]
products = json.loads((REVIEW / "products.json").read_text())


def sha(data):
    return hashlib.sha256(data).hexdigest()


def copy(source, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, destination)
    assert source.read_bytes() == destination.read_bytes()


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def sums(folder):
    files = sorted(f for f in folder.rglob("*") if f.is_file() and f != folder / "SHA256SUMS.txt")
    (folder / "SHA256SUMS.txt").write_text("".join(f"{sha(f.read_bytes())}  {f.relative_to(folder).as_posix()}\n" for f in files))


if not (REVIEW / "previous-delivery").exists():
    shutil.move(str(OUT), str(REVIEW / "previous-delivery"))
    old_zip = WATCH / (OUT.name + ".zip")
    copy(old_zip, REVIEW / "previous-delivery.zip")
OUT.mkdir(exist_ok=True)
records = []
for p, slug in zip(products, SLUGS):
    repo = WATCH / p["repo"]
    assert not subprocess.check_output(["git", "status", "--porcelain"], cwd=repo, text=True)
    store = repo / "store"
    target = OUT / slug
    target.mkdir(exist_ok=True)
    listing = json.loads((store / "listing.json").read_text())
    art = json.loads((store / "artwork-provenance.json").read_text())
    names = set(art["files"]) | {"listing.json", "description.txt", "release-notes.txt", "artwork-provenance.json", "ARTWORK-LICENSES.txt"}
    for name in ["description-cs.txt", "capture-provenance.json", "icon-provenance.json"]:
        if (store / name).exists():
            names.add(name)
    for images in listing.get("screenshots", {}).values():
        names.update(images)
    if p["type"] != "watchface":
        names.update(json.loads((store / "icon-provenance.json").read_text())["files"])
    for name in sorted(names):
        copy(store / name, target / name)
    for name, expected in art["files"].items():
        assert sha((target / name).read_bytes()) == expected
    pbw = WATCH / p["file"]
    assert sha(pbw.read_bytes()) == p["sha256"]
    with zipfile.ZipFile(pbw) as archive:
        assert archive.testzip() is None
        info = json.loads(archive.read("appinfo.json"))
        assert info["versionLabel"] == p["version"] and info["uuid"] == p["uuid"]
    copy(pbw, target / pbw.name)
    for name in ["LICENSE", "PRIVACY.md", "THIRD-PARTY-NOTICES.md", "THIRD_PARTY.md"]:
        if (repo / name).exists():
            copy(repo / name, target / "licences" / name)
    for source in (REVIEW / "previous-delivery" / slug / "licences" / "bundled").rglob("*"):
        if source.is_file():
            base = REVIEW / "previous-delivery" / slug / "licences" / "bundled"
            copy(source, target / "licences/bundled" / source.relative_to(base))
    copy(repo / p["equivalenceProof"], target / "package-equivalence.json")
    # Source and debug archives stay out of the Store upload fields.
    stem = pbw.stem
    for suffix in ["-source.zip", "-debug.zip"]:
        file = repo / "releases" / (stem + suffix)
        if file.exists():
            copy(file, OUT / "developer" / slug / file.name)
    remote = subprocess.check_output(["git", "remote", "get-url", "origin"], cwd=repo, text=True).strip().removesuffix(".git")
    branch = subprocess.check_output(["git", "branch", "--show-current"], cwd=repo, text=True).strip()
    plan = {
        "product": p["product"], "version": p["version"], "uuid": p["uuid"], "type": p["type"],
        "pbw": pbw.name, "pbwSha256": p["sha256"], "sourceCommit": p["sourceCommit"],
        "previousStoreVersion": p["publicStoreVersion"], "newNumericVersion": True,
        "publicVersionAndTagAvailabilityChecked": p["storeVersionAvailable"] and p["githubTagAvailable"],
        "description": "description.txt", "releaseNotes": "release-notes.txt",
        "screenshotsInUploadOrder": listing.get("screenshots", {}), "platformBanners": listing.get("banners", {}),
        "storeIcons": listing.get("icons", []), "storeUrl": p["storeUrl"],
        "githubBranch": remote + "/tree/" + branch, "githubCommit": remote + "/commit/" + p["sourceCommit"],
        "checks": "Fresh build/tests, artifact/configuration and Store checks, strict package-equivalence proof, frozen checksums and committed release preparation passed.",
    }
    write_json(target / "upload-map.json", plan)
    lines = [f"# {p['product']} {p['version']} — Store upload", "", f"[Store listing]({p['storeUrl']}) · [Exact source commit]({plan['githubCommit']})", "",
             f"1. Upload **`{pbw.name}`** as the new **{p['version']}** version, replacing public {p['publicStoreVersion']}.",
             "2. Paste `description.txt` into the description and `release-notes.txt` into the version notes.",
             "3. Use the platform banner PNGs and raw screenshot PNGs below. `upload-map.json` gives the exact field mapping.", ""]
    if (target / "description-cs.txt").exists():
        lines += ["`description-cs.txt` is the Czech description.", ""]
    for platform, images in listing.get("screenshots", {}).items():
        lines += ["## " + ("Time 2 / Emery" if platform == "emery" else "Round 2 / Gabbro"), "", "Banner: `" + listing["banners"][platform] + "` (720×320).", "", "Screenshots, in order:", ""]
        lines += [str(i) + ". `" + name + "`" for i, name in enumerate(images, 1)] + [""]
    if listing.get("icons"):
        lines += ["## Icons", "", "- `icon-small-80.png` — 80×80", "- `icon-large-144.png` — 144×144", ""]
    if p["type"] == "plugin":
        lines += ["Phone plugin: no native watch screenshots or Store banner.", ""]
    lines += ["SVGs, product marks, proof and licence files are editing/reference material. Upload the PNGs named above. Earlier captures retain their original pixels; renderer/resource equality with this new patch was verified. No new physical-device test is claimed.", ""]
    (target / "UPLOAD.md").write_text("\n".join(lines))
    sums(target)
    records.append(plan)

copy(IDENTITY / "XOCE-tactile-artwork-2026-11-14.zip", OUT / "design-source/XOCE-tactile-artwork-2026-11-14.zip")
copy(IDENTITY / "ZIP-SHA256SUMS.txt", OUT / "design-source/SHA256SUMS.txt")
for name in ["banners-contact-sheet.png", "icons-contact-sheet.png"]:
    copy(IDENTITY / "review" / name, OUT / "review" / name)
for source in (REVIEW / "verification").rglob("*"):
    if source.is_file():
        copy(source, OUT / "verification" / source.relative_to(REVIEW / "verification"))
copy(REVIEW / "versions.json", OUT / "verification/unused-version-check.json")
copy(REVIEW / "products.json", OUT / "verification/release-products.json")
copy(Path(__file__), OUT / "assemble-update.py")
for name in ["verify-and-freeze.py", "update-website.py"]:
    copy(REVIEW / name, OUT / "developer" / name)
for name in ["packaged-config.html", "fixture.json", "preview.html"]:
    copy(REVIEW / "phone" / name, OUT / "developer/weather-browser" / name)
write_json(OUT / "manifest.json", {"date": "2026-11-14", "products": records,
    "counts": {"pbws": 6, "nativeScreenshots": 34, "banners": 10, "iconSets": 4},
    "scope": "Fresh unused patch versions built, audited, frozen and prepared. Earlier releases unchanged. No Store submission or website deployment.",
    "websiteBranch": "https://github.com/xefensor/xoce/tree/feat/pebble-store-launch"})
table = "\n".join(f"| [{p['product']}]({slug}/UPLOAD.md) | {p['version']} | {p['previousStoreVersion']} |" for slug, p in zip(SLUGS, records))
(OUT / "README.md").write_text("""# XOCE — Pebble Store update, 14 November 2026

All six PBWs now have new numeric versions, rebuilt from the reviewed source and checked for Store upload. Open each product’s `UPLOAD.md` for the exact file mapping.

| Product folder | New version to upload | Replaces public version |
| --- | --- | --- |
""" + table + """

Each product folder contains its new `.pbw`, plain-text description/release notes, platform banners, raw native screenshots, applicable 80/144 px icons, editable SVGs and licences. There are 34 native screenshots, ten 720×320 banners and four icon sets. Weather is phone-only and has no watch screenshot or Store banner.

The new versions were absent from public Pebble Store history and GitHub tags when checked. Public UUIDs, saved-state compatibility, reviewed native interfaces and dependency pins are retained. The complete previous numbered artifacts remain unchanged. No old-number PBW is mixed into this handoff.

Use the `.pbw` in each product folder for the binary field. `developer/` contains matching source/debug archives for maintenance; `design-source/` preserves the original artwork inputs, fonts/licences and recipes. SVGs, product marks and these archives are not extra Store screenshot fields. Preview the banner/icon family in `review/`.

`verification/` records fresh six-app tests/builds, native artifact/configuration and Store-kit checks, strict renderer/resource equivalence, version availability, release preparation and website checks. Previous native PNGs were reused only after renderer equivalence passed; no fresh emulator capture, phone or physical-watch result is claimed.

The source and this handoff are on the GitHub feature branches linked in the per-product guides and [XOCE website branch](https://github.com/xefensor/xoce/tree/feat/pebble-store-launch). No Store submission, GitHub release publication or website deployment is implied by a branch push.

Verify all payload files with `sha256sum -c SHA256SUMS.txt`. Each product has its own checksum list. The complete ZIP has a separate `.sha256` file beside it.
""")
sums(OUT)
archive = WATCH / (OUT.name + ".zip")
with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for file in sorted(OUT.rglob("*")):
        if file.is_file():
            z.write(file, OUT.name + "/" + file.relative_to(OUT).as_posix())
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    for line in (OUT / "SHA256SUMS.txt").read_text().splitlines():
        expected, name = line.split("  ", 1)
        assert sha(z.read(OUT.name + "/" + name)) == expected
assert len(list(OUT.rglob("*.pbw"))) == 6
(WATCH / (archive.name + ".sha256")).write_text(sha(archive.read_bytes()) + "  " + archive.name + "\n")
print(json.dumps({"result": "PASS", "folder": str(OUT), "archiveBytes": archive.stat().st_size, "versions": {p["product"]:p["version"] for p in products}}, indent=2))
