# Pebble Store website launch

The redesign is a local preview on `feat/pebble-store-launch`. The public site and app releases are separate. Website changes do not authorize Store submission, app publication or a Pages deployment.

## Prepared versions and routes

| Product | Version | Website | Support | Privacy |
| --- | --- | --- | --- | --- |
| Dynamic | 0.19.0 | `/projects/dynamic/` | `/projects/dynamic/support/` | `/projects/dynamic/privacy/` |
| Halftone | 1.10.0 | `/projects/halftone/` | `/projects/halftone/support/` | `/projects/halftone/privacy/` |
| Dashboard | 0.7.0 | `/projects/dashboard/` | `/projects/dashboard/support/` | `/projects/dashboard/privacy/` |
| Timer | 0.15.0 | `/projects/timer/` | `/projects/timer/support/` | `/projects/timer/privacy/` |
| Open Activity | 0.4.0 | `/projects/open-activity/` | `/projects/open-activity/support/` | `/projects/open-activity/privacy/` |
| ČHMÚ Weather | 1.0.2 | `/projects/chmu-weather/` | `/projects/chmu-weather/support/` | `/projects/chmu-weather/privacy/` |

Public URLs use `https://xefensor.github.io/xoce` before these routes. They become public only when the website is deployed. Until then, use already-published app-owned documentation for Store fields; do not point a live listing to an unavailable page. This website task does not edit app manifests or Store submissions.

## After the apps are published

For each of the six consumer records in `src/data/projects.ts`:

1. Set `storeUrl` to the real `https://apps.repebble.com/<id>` public listing.
2. Set `tag` to the actual `v<version>` GitHub release tag and `download` to its exact PBW asset. Do not use `latest` links or an older version as fallback.
3. Confirm the UUID, version and target platforms against the published package. Native apps must contain exactly Emery and Gabbro; the phone plugin has no watch binary.
4. Confirm `artifactSha256` still identifies the reviewed PBW uploaded to both services. If the package was rebuilt or changed, review the resulting artifact and screenshot provenance before changing this hash.
5. Change `publication` to `published` only after those URLs and bytes have been verified.

The app's own physical-device checks and publication approval remain owned by its repository. Local emulator images do not establish hardware or Android results.

## Checks and deployment

Run `npm test`, preview the built site and run `npm run check:browser`. Then run `npm run check:launch` with network access. The launch check is read-only and requires no account token. It reads:

- `https://appstore-api.repebble.com/api/v1/apps/uuid/<uuid>` for public Store identity, latest release and native platforms;
- the exact GitHub release tag and its listed PBW asset;
- both public PBWs, comparing their SHA256 values with the checked package.

An unavailable API, missing listing, different version, hidden release, incorrect platform or different artifact fails the gate. There is no optimistic fallback. The public Store response shape was inspected on 2026-11-13; changes to that API must be reviewed before adapting verification.

The current preview should fail this check with actionable missing-publication fields. PR/branch validation remains usable. The gate runs on main before Pages artifacts are uploaded, preserving the existing protected main-only hosting workflow.

After separately authorized publication, verify the six product pages, installation links, support/privacy URLs and both preview shapes on the public website. The launch banner and `noindex` disappear automatically when all six records are published. No manual or scheduled publishing task is introduced.

## Inspect packages when refreshing the preview

`python3 scripts/audit-review-packages.py --bundle /path/to/Round2-Development/revision-2 --weather-pbw /path/to/CHMU-Weather-1.0.2.pbw --output docs/reviewed-artifacts.json` reads the actual appinfo manifests, verifies UUID/version/platforms and checked hashes against website metadata, and records the inspected bytes. This prevents an older cached package from being described as a newer version. The command reads app artifacts and never builds, edits or publishes an app.
