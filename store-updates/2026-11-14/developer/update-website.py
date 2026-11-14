"""Bind the website to the newly checked packages, preserving capture history."""
from pathlib import Path
import hashlib
import json
import shutil

REVIEW = Path(__file__).resolve().parent
WATCH = REVIEW.parent
SITE = WATCH.parent / "XOCE-website-update"
products = json.loads((REVIEW / "products.json").read_text())
lookup = {p["product"]: p for p in products}
file = SITE / "src/data/projects.ts"
prefix, tail = file.read_text().split("export const projects: Project[] = ", 1)
projects, end = json.JSONDecoder().raw_decode(tail)
galleries = json.loads((SITE / "src/data/launch-screenshots.json").read_text())
provs = {name: json.loads((SITE / name).read_text()) for name in ["docs/asset-provenance.json", "public/preview-provenance.json"]}
old_images = {r["site_path"]: r for r in provs["docs/asset-provenance.json"]["images"]}
replacements = {}


def bind_image(old, product):
    if old in replacements:
        return replacements[old]
    new = old.replace("-" + product["previousVersion"] + "-", "-" + product["version"] + "-", 1)
    assert new != old, old
    source = SITE / "public" / old.lstrip("/")
    destination = SITE / "public" / new.lstrip("/")
    if destination.exists():
        assert source.read_bytes() == destination.read_bytes()
    else:
        shutil.copyfile(source, destination)
    entry = dict(old_images[old])
    entry.update({
        "id": Path(new).stem, "site_path": new,
        "represented_release": product["version"],
        "represented_pbw_sha256": product["sha256"],
        "represented_source_commit": product["sourceCommit"],
        "release_reuse_proof": "/capture-verification/" + product["repo"] + "-" + product["version"] + ".json",
        "reuse_scope": "Original capture version, source/hash and PNG bytes retained. New patch renderer/resource equivalence verified; no fresh capture claimed.",
    })
    assert hashlib.sha256(source.read_bytes()).hexdigest() == entry["sha256"]
    for prov in provs.values():
        assert not any(r["site_path"] == new for r in prov["images"]), new
        prov["images"].append(entry.copy())
    replacements[old] = new
    return new


for project in projects:
    if not project.get("publication"):
        continue
    product = lookup[project["name"]]
    assert project["version"] == product["previousVersion"]
    project["version"] = product["version"]
    project["artifactSha256"] = product["sha256"]
    project["imageVersion"] = product["version"]
    project["image"] = bind_image(project["image"], product)
    for preview in project.get("previews", {}).values():
        preview["image"] = bind_image(preview["image"], product)
    if project.get("showcase"):
        project["showcase"]["image"] = bind_image(project["showcase"]["image"], product)
    for key in ["mark", "shareImage"]:
        project["storeArtwork"][key] = bind_image(project["storeArtwork"][key], product)
    for image in galleries.get(project["slug"], []):
        image["image"] = bind_image(image["image"], product)
        image["version"] = product["version"]
        image["caption"] = "Verified native preview; example data." if image["kind"] == "watch" else "Verified settings preview with a simulated Pebble bridge; example settings."
    proof = json.loads((WATCH / product["repo"] / product["equivalenceProof"]).read_text())
    assert proof["pbwSha256"] == product["sha256"] and proof["version"] == product["version"]
    proof_file = SITE / "public/capture-verification" / (product["repo"] + "-" + product["version"] + ".json")
    proof_file.parent.mkdir(exist_ok=True)
    proof_file.write_text(json.dumps(proof, indent=2) + "\n")

file.write_text(prefix + "export const projects: Project[] = " + json.dumps(projects, ensure_ascii=False, indent=2) + tail[end:])
(SITE / "src/data/launch-screenshots.json").write_text(json.dumps(galleries, ensure_ascii=False, indent=2) + "\n")
for name, data in provs.items():
    (SITE / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
file = SITE / "src/pages/index.astro"
text = file.read_text()
for old, new in replacements.items():
    text = text.replace(old, new)
file.write_text(text)
(SITE / "docs/reviewed-artifacts.json").write_text(json.dumps({
    "scope": "Freshly built, audited and frozen new numeric versions for the 2026-11-14 Store update. Original captures reused with renderer equivalence proof; not publication or physical-device verification.",
    "artifacts": [{"product": p["product"], "version": p["version"], "uuid": p["uuid"],
                   "watchPlatforms": [] if p["type"] == "plugin" else ["emery", "gabbro"],
                   "sha256": p["sha256"], "sourceCommit": p["sourceCommit"],
                   "sourceFile": Path(p["file"]).name} for p in products],
}, ensure_ascii=False, indent=2) + "\n")
print("Six new package identities bound;", len(replacements), "versioned assets appended without changing historical images/provenance.")
