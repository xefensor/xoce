"""Collect the reviewed binaries, current listing files and approved Store artwork.

Workspace recipe; no builds, version changes, uploads or tag modifications.
Requires the two original 2026-11-14 review folders and the six app checkouts.
"""
from pathlib import Path
import argparse
import hashlib
import json
import shutil
import struct
import subprocess
import zipfile

parser = argparse.ArgumentParser()
parser.add_argument("--workspace", type=Path, default=Path(__file__).resolve().parents[2])
parser.add_argument("--live-summary", type=Path, required=True)
args = parser.parse_args()
ROOT = args.workspace.resolve()
WATCH = ROOT / "Watch"
OUT = WATCH / "Pebble-Store-Update-2026-11-14"
PREVIOUS = WATCH / "Store-Update-2026-11-14"
IDENTITY = WATCH / "XOCE-Identity-2026-11-14"
SITE = ROOT / "XOCE-website-update"
SLUGS = ["dynamic", "halftone", "timer", "dashboard", "open-activity", "chmu-weather"]
products = json.loads((PREVIOUS / "inputs/products.json").read_text())
live = json.loads(args.live_summary.read_text())
live_products = {p["repo"]: p for p in live["products"]}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def git(path, *args):
    return subprocess.check_output(["git", *args], cwd=path, text=True).strip()


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def copy(source, target):
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, target)
    assert source.read_bytes() == target.read_bytes()


def sums(folder):
    paths = sorted(p for p in folder.rglob("*") if p.is_file() and p != folder / "SHA256SUMS.txt")
    (folder / "SHA256SUMS.txt").write_text("".join(f"{sha(p.read_bytes())}  {p.relative_to(folder).as_posix()}\n" for p in paths))


OUT.mkdir(exist_ok=True)
records = []
total_screens = 0
for product, slug in zip(products, SLUGS):
    repo = WATCH / product["repo"]
    store = repo / "store"
    target = OUT / slug
    target.mkdir(exist_ok=True)
    assert not git(repo, "status", "--porcelain"), repo
    commit = git(repo, "rev-parse", "HEAD")
    branch = git(repo, "branch", "--show-current")
    remote = git(repo, "remote", "get-url", "origin").removesuffix(".git")
    listing = json.loads((store / "listing.json").read_text())
    art = json.loads((store / "artwork-provenance.json").read_text())
    files = set(art["files"])
    metadata = {"listing.json", "description.txt", "release-notes.txt", "artwork-provenance.json", "ARTWORK-LICENSES.txt"}
    if (store / "description-cs.txt").exists():
        metadata.add("description-cs.txt")
    if (store / "capture-provenance.json").exists():
        metadata.add("capture-provenance.json")
    if product["type"] != "watchface":
        icons = json.loads((store / "icon-provenance.json").read_text())
        files.update(icons["files"])
        metadata.add("icon-provenance.json")
    screens = listing.get("screenshots", {})
    for platform, names in screens.items():
        for name in names:
            data = (store / name).read_bytes()
            assert struct.unpack_from(">II", data, 16) == ((200, 228) if platform == "emery" else (260, 260))
            files.add(name)
            total_screens += 1
    for name in sorted(files | metadata):
        copy(store / name, target / name)
    for name, expected in art["files"].items():
        assert sha((target / name).read_bytes()) == expected, (slug, name)
    for name in ["LICENSE", "PRIVACY.md", "THIRD-PARTY-NOTICES.md"]:
        if (repo / name).exists():
            copy(repo / name, target / "licences" / name)
    old_notices = PREVIOUS / "licences" / slug
    if old_notices.exists():
        for source in sorted(old_notices.rglob("*")):
            if source.is_file():
                copy(source, target / "licences" / "bundled" / source.relative_to(old_notices))
    binary = PREVIOUS / product["file"]
    assert sha(binary.read_bytes()) == product["sha256"]
    with zipfile.ZipFile(binary) as pbw:
        assert pbw.testzip() is None
        info = json.loads(pbw.read("appinfo.json"))
        assert info["uuid"].lower() == product["uuid"] and info["versionLabel"] == product["version"]
        if product["type"] == "plugin":
            assert not any(n.endswith("pebble-app.bin") for n in pbw.namelist())
    copy(binary, target / binary.name)
    online = live_products[product["repo"]]
    assert online["preparedPbwSha256"] == product["sha256"]
    plan = {
        "product": product["product"], "type": product["type"], "uuid": product["uuid"],
        "pbw": binary.name, "version": product["version"], "pbwSha256": product["sha256"],
        "runtimeSourceCommit": product["sourceCommit"], "currentSourceCommit": commit,
        "githubBranch": remote + "/tree/" + branch, "githubCommit": remote + "/commit/" + commit,
        "storeUrl": online["storeUrl"], "publicStoreCheck": online,
        "binaryUploadStatus": "Candidate only: this numeric version is already public; prepare a new version before a changed binary upload.",
        "description": "description.txt", "releaseNotes": "release-notes.txt",
        "screenshotsInUploadOrder": screens, "platformBanners": listing.get("banners", {}),
        "storeIcons": listing.get("icons", []),
        "editingOnly": sorted(n for n in files if n.endswith(".svg") or n.startswith("product-mark")),
        "licences": "licences/",
    }
    write_json(target / "upload-map.json", plan)
    lines = [f"# {product['product']} — upload files", "", f"[Existing Store listing]({online['storeUrl']}) · [Source on GitHub]({remote}/tree/{branch})", "",
             f"Reviewed candidate: `{binary.name}` · UUID `{product['uuid']}`.", "",
             f"The live Store already has version **{online['liveVersion']}**. Its downloaded PBW differs from this candidate. Do not upload this as another release with the same numeric version. Prepare a new version for a changed binary, then use matching new-feature screenshots/copy. This folder preserves the reviewed bytes.", "",
             "Paste `description.txt` into the description field. `release-notes.txt` belongs to the matching binary update. `listing.json` preserves the source listing metadata; `upload-map.json` names the files in this folder.", ""]
    if "description-cs.txt" in metadata:
        lines += ["`description-cs.txt` is the Czech description.", ""]
    for platform, names in screens.items():
        label = "Time 2 / Emery" if platform == "emery" else "Round 2 / Gabbro"
        lines += [f"## {label}", "", f"Banner: `{listing['banners'][platform]}` (720×320).", "", "Standalone screenshots, in order:", ""]
        lines += [f"{i}. `{name}`" for i, name in enumerate(names, 1)] + [""]
    if listing.get("icons"):
        lines += ["## Icons", "", "- `icon-small-80.png` — 80×80", "- `icon-large-144.png` — 144×144", ""]
    if product["type"] == "plugin":
        lines += ["This is a phone plugin. It has no watch screenshot or Store banner. The Weather marketing banner in the design-source archive is website-only.", ""]
    lines += ["SVGs, product marks, provenance and licence files are editing/reference material. Native screenshot PNGs are unframed and unchanged. Product marks are website artwork, not extra Store icon fields.", ""]
    (target / "UPLOAD.md").write_text("\n".join(lines))
    sums(target)
    records.append(plan)
assert total_screens == 34

copy(IDENTITY / "XOCE-tactile-artwork-2026-11-14.zip", OUT / "design-source/XOCE-tactile-artwork-2026-11-14.zip")
copy(IDENTITY / "ZIP-SHA256SUMS.txt", OUT / "design-source/SHA256SUMS.txt")
for name in ["banners-contact-sheet.png", "icons-contact-sheet.png"]:
    copy(IDENTITY / "review" / name, OUT / "review" / name)
for source in (IDENTITY / "review/website").glob("*.png"):
    copy(source, OUT / "review/website" / source.name)
copy(IDENTITY / "verification/runtime-and-assets-audit.json", OUT / "verification/artwork-audit-before-push.json")
copy(IDENTITY / "verification/website/browser-report.json", OUT / "verification/website-browser-report.json")
copy(IDENTITY / "verification/website/npm-test.log", OUT / "verification/website-tests.log")
copy(IDENTITY / "verification/website/astro-check.log", OUT / "verification/website-astro-check.log")
for source in (IDENTITY / "verification").glob("*.log"):
    copy(source, OUT / "verification" / source.name)
for source in (PREVIOUS / "verification").glob("*-source-rebuild.json"):
    copy(source, OUT / "verification/source-rebuilds" / source.name)
write_json(OUT / "verification/public-store-check.json", live)
write_json(OUT / "manifest.json", {
    "date": "2026-11-14", "purpose": "Consolidated manual Pebble Store update handoff",
    "binaryStatus": "Reviewed candidates. All six numeric versions already exist publicly; new binary releases require new version numbers.",
    "websiteImplementationCommit": "668acd97240c5d9c902375892717c875f51b9f53",
    "githubWebsiteBranch": "https://github.com/xefensor/xoce/tree/feat/pebble-store-launch",
    "products": records, "counts": {"pbws": 6, "nativeScreenshots": total_screens, "platformBanners": 10, "iconSets": 4},
    "scope": "No binaries rebuilt, versions bumped, tags moved, Store submissions or website deployments. Source branches are pushed separately to GitHub.",
    "validation": "Original six app suites/Store checks, 13 browser checks/158 captures and source-rebuild evidence included; no new physical-device testing.",
})

rows = []
for slug, plan in zip(SLUGS, records):
    rows.append(f"| [{plan['product']}]({slug}/UPLOAD.md) | {plan['version']} | {len(plan['platformBanners'])} | {len(plan['storeIcons'])} |")
readme = """# XOCE — one Pebble Store update folder

Everything for the six apps is grouped by product: the exact reviewed PBW, current descriptions/release notes, native screenshots, approved tactile banners/icons, editable SVGs and credits. Start with each product’s `UPLOAD.md`.

## Before a binary upload

The public Store was checked again on 14 November 2026. **All six prepared version numbers are already published, and their public PBW bytes differ from these candidates.** These preserved candidates cannot be treated as unused numeric versions. A changed binary needs a new version and matching release verification before upload. `verification/public-store-check.json` records the public URLs, versions and both hashes.

Listing artwork can be edited independently when it represents the installed app. New-feature descriptions and screenshots must accompany their matching binary release. This corrects the earlier handoff’s claim that these versions were unused. No app was submitted as part of this handoff.

## Products

| Product folder | Candidate version | Banners | Icon PNGs |
| --- | --- | --- | --- |
""" + "\n".join(rows) + """

Each product folder contains:

- `UPLOAD.md` and `upload-map.json` — exact field mapping and screenshot order.
- One `.pbw` — unchanged from the reviewed candidate; not a new numbered release.
- `description.txt` and `release-notes.txt`; Weather also has `description-cs.txt`.
- Raw native PNG screenshots for each watch platform, plus 720×320 banner PNGs. Time 2 is Emery; Round 2 is Gabbro.
- 80×80 / 144×144 icon PNGs for watch apps and the Weather plugin. Watchfaces have no extra Store icon fields.
- Editable SVGs, original artwork/capture provenance and `licences/`. Product marks are website artwork.

Weather is phone-only: no native watch screenshots or Store banner.

## Preview and source

`review/` has the banner/icon contact sheets and actual website browser previews. `design-source/XOCE-tactile-artwork-2026-11-14.zip` preserves the complete artwork handoff, including the wordmark, favicon, pinned Fira font inputs/licences and generation recipes. Its original audit describes the pre-push snapshot.

The current app source and Store assets are on the GitHub feature branches linked in each `UPLOAD.md`. The website and this complete handoff are on [xefensor/xoce — feat/pebble-store-launch](https://github.com/xefensor/xoce/tree/feat/pebble-store-launch). Website implementation commit: `668acd9`. Pushing these branches does not merge to main, deploy the website, publish a GitHub release or submit to Pebble Store.

## Checks

`verification/` includes the six app test suites/Store-kit checks, source-rebuild evidence, website tests and Chromium report (13 checks, 158 screenshots). These are automated/emulator/browser results; no new physical-watch or phone test is claimed. Previous review ZIPs remain unchanged.

Run `sha256sum -c SHA256SUMS.txt` in this folder to verify every delivered file. Each product also has its own checksum list. The outer ZIP has a separate checksum beside it.

The included `assemble-update.py` is the workspace collection recipe. It requires the original review folders and sibling app checkouts; it does not build or publish anything.
"""
(OUT / "README.md").write_text(readme)
sums(OUT)
archive = WATCH / (OUT.name + ".zip")
with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for path in sorted(OUT.rglob("*")):
        if path.is_file():
            info = zipfile.ZipInfo(OUT.name + "/" + path.relative_to(OUT).as_posix(), date_time=(2026, 11, 14, 12, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            z.writestr(info, path.read_bytes())
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    for line in (OUT / "SHA256SUMS.txt").read_text().splitlines():
        expected, name = line.split("  ", 1)
        assert sha(z.read(OUT.name + "/" + name)) == expected, name
(WATCH / (archive.name + ".sha256")).write_text(f"{sha(archive.read_bytes())}  {archive.name}\n")
print(json.dumps({"result": "PASS", "folder": str(OUT), "archive": str(archive), "archiveBytes": archive.stat().st_size,
                  "products": 6, "screenshots": total_screens, "banners": 10, "iconSets": 4}, indent=2))
