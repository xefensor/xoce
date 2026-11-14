"""Assemble current Halftone-style listing art with the checked release PBWs."""
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
ARTWORK = Path(__file__).resolve().parent
store_commits = json.loads((ARTWORK / "store-commits.json").read_text())
live = {p["repo"]: p for p in json.loads((ARTWORK / "live-store.json").read_text())}
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


if OUT.exists():
    backup = ARTWORK / "previous-material-delivery"
    assert not backup.exists(), "Keep previous delivery intact; move a repeated working output aside explicitly."
    shutil.move(str(OUT), str(backup))
    copy(WATCH / (OUT.name + ".zip"), ARTWORK / "previous-material-delivery.zip")
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
    for name in ["description-cs.txt", "capture-provenance.json", "orange-capture-provenance.json", "icon-provenance.json"]:
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
        "pbw": pbw.name, "pbwSha256": p["sha256"], "runtimeSourceCommit": p["sourceCommit"],
        "storeSourceCommit": store_commits[p["repo"]],
        "publicStoreVersionCheckedOn20261114": live[p["repo"]]["version"],
        "binaryAction": "already-current-edit-listing" if live[p["repo"]]["version"] == p["version"] else "upload-prepared-version-if-still-needed",
        "description": "description.txt", "releaseNotes": "release-notes.txt",
        "screenshotsInUploadOrder": listing.get("screenshots", {}), "platformBanners": listing.get("banners", {}),
        "storeIcons": listing.get("icons", []), "icon_tintable": listing.get("icon_tintable"), "storeUrl": p["storeUrl"],
        "githubBranch": remote + "/tree/" + branch,
        "runtimeSourceUrl": remote + "/commit/" + p["sourceCommit"],
        "storeSourceUrl": remote + "/commit/" + store_commits[p["repo"]],
        "checks": "Checked release PBWs and source/debug archives retained byte-for-byte. New Store art passed six-app tests and Store checks; icons passed binary-alpha validation. Halftone orange screens freshly captured in both native emulators.",
    }
    write_json(target / "upload-map.json", plan)
    binary_step = (f"The public Store already has **{p['version']}**, matching this checked PBW. Edit the listing artwork; do not upload the same version again."
                   if plan["binaryAction"] == "already-current-edit-listing" else
                   f"If the Store still shows **{live[p['repo']]['version']}**, upload **`{pbw.name}`** as **{p['version']}**. If this version has already been uploaded, edit its listing instead; do not duplicate or renumber it for artwork.")
    lines = [f"# {p['product']} {p['version']} — Store update", "", f"[Store listing]({p['storeUrl']}) · [Runtime source]({plan['runtimeSourceUrl']}) · [Current artwork source]({plan['storeSourceUrl']})", "",
             "1. " + binary_step,
             "2. Paste `description.txt` into the description. Use `release-notes.txt` when publishing the prepared binary version.",
             "3. Use the platform banner PNGs and raw screenshot PNGs below. `upload-map.json` gives the exact field mapping.", ""]
    if (target / "description-cs.txt").exists():
        lines += ["`description-cs.txt` is the Czech description.", ""]
    for platform, images in listing.get("screenshots", {}).items():
        lines += ["## " + ("Time 2 / Emery" if platform == "emery" else "Round 2 / Gabbro"), "", "Banner: `" + listing["banners"][platform] + "` (720×320).", "", "Screenshots, in order:", ""]
        lines += [str(i) + ". `" + name + "`" for i, name in enumerate(images, 1)] + [""]
    if listing.get("icons"):
        lines += ["## Icons", "", "- `icon-small-80.png` — 80×80", "- `icon-large-144.png` — 144×144", "",
                  "Enable the Developer Dashboard setting for a tintable monochrome icon (`icon_tintable=true`). These PNGs contain a solid black glyph and transparent background, so the client can tint the same icon for light and dark mode. Upload the original transparent PNGs, without a tile or background. Local JSON does not change the live Store flag.", "",
                  "The [official API changelog](https://appstore-api.repebble.com/) documents `icon_tintable`. The exact signed-in Dashboard control label has not been verified. After saving, confirm the public app object's `icon_tintable` is true and inspect both app themes.", ""]
    if p["type"] == "plugin":
        lines += ["Phone plugin: no native watch screenshots or Store banner.", ""]
    lines += ["SVGs, product marks, proof and licence files are editing/reference material. Upload the PNGs named above. Earlier captures retain their original pixels; renderer/resource equality with the prepared PBW was verified. Halftone's orange screens are fresh native emulator captures of its checked 1.10.2 build. No physical-device test is claimed.", ""]
    (target / "UPLOAD.md").write_text("\n".join(lines))
    sums(target)
    records.append(plan)

art_zip = ARTWORK / "XOCE-Pebble-Store-Artwork-2026-11-14.zip"
copy(art_zip, OUT / "design-source" / art_zip.name)
copy(ARTWORK / (art_zip.name + ".sha256"), OUT / "design-source/SHA256SUMS.txt")
copy(ARTWORK / "banners-contact-sheet.png", OUT / "review/banners-contact-sheet.png")
copy(ARTWORK / "icons-light-dark.png", OUT / "review/icons-light-dark.png")
copy(ARTWORK / "research.json", OUT / "verification/store-artwork-research.json")
copy(ARTWORK / "live-store.json", OUT / "verification/store-before-artwork-update.json")
for source in (ARTWORK / "verification").rglob("*"):
    if source.is_file() and source.suffix in {".json", ".log", ".png"} and not any(part.startswith("emulator-") for part in source.parts):
        copy(source, OUT / "verification/artwork" / source.relative_to(ARTWORK / "verification"))
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
    "scope": "Current Halftone-style Store artwork and transparent tintable glyphs, paired with exact previously checked release PBWs. Store upload remains manual; website deployment is separate.",
    "websiteBranch": "https://github.com/xefensor/xoce/tree/feat/pebble-store-launch"})
table = "\n".join(f"| [{p['product']}]({slug}/UPLOAD.md) | {p['version']} | {p['publicStoreVersionCheckedOn20261114']} |" for slug, p in zip(SLUGS, records))
(OUT / "README.md").write_text("""# XOCE — Pebble Store update, 14 November 2026

The current Store artwork follows the original orange Halftone banner: bold colour, large white type, a curved patterned edge and illustrated watches with real native screens. Open each product’s `UPLOAD.md` for the exact upload fields.

| Product folder | Checked PBW version | Public Store version checked on 14 November |
| --- | --- | --- |
""" + table + """

Each product folder contains its checked `.pbw`, plain-text description/release notes, platform banners, raw native screenshots, applicable 80/144 px icons, editable SVGs and licences. There are 34 selected native screenshots, ten 720×320 Store banners and four icon sets. Weather is phone-only and has no watch screenshot or Store banner.

These PBWs retain the new numeric versions prepared earlier; artwork does not require another binary version. Weather 1.0.3 is already public and matches the checked PBW: update its listing only. For other apps, upload the prepared version only if it is still missing. Public UUIDs and existing binary bytes are retained. `runtimeSourceCommit` and `storeSourceCommit` distinguish the binary source from the current listing art.

For Timer, Dashboard, Open Activity and Weather, upload the transparent black 80/144 px icons and enable the documented tintable-icon setting (`icon_tintable=true`) in Developer Dashboard. The client can then tint one glyph for light/dark mode. This setting must be saved on the Store; editing local JSON cannot enable it remotely. See `review/icons-light-dark.png` and each guide. Watchfaces have no Store icon upload in this handoff.

Use the `.pbw` in each product folder for the binary field. `developer/` contains matching source/debug archives for maintenance; `design-source/` preserves the original artwork inputs, fonts/licences and recipes. SVGs, product marks and these archives are not extra Store screenshot fields. Preview the banner/icon family in `review/`.

`verification/` includes the earlier six-app builds, artifact/configuration checks and strict renderer equivalence, plus fresh six-app tests/Store checks for this artwork pass, binary-alpha icon checks and website browser evidence. Halftone's two orange screens are fresh native QEMU captures of its checked build; other native PNGs were reused after renderer equivalence passed. No physical-watch result is claimed.

The source and this handoff are on the GitHub branches linked in the per-product guides and [XOCE website repository](https://github.com/xefensor/xoce). Website deployment is tracked separately from app publication. No Store submission or GitHub app release is performed by this package.

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
