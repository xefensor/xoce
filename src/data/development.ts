/** Public library releases and the distinct packages bundled by reviewed app tags.
 * Verified against GitHub release assets and each tag's package.json on 2026-11-14.
 * App catalogue versions stay in projects.ts. Updating a bundled package requires
 * checking the owning app tag and vendor provenance, not assuming matching numbers.
 */
export const developmentLibraries = [
  {
    slug: 'activities', name: 'Activities', packageName: 'pebble-activities',
    version: '0.4.4', status: 'Prerelease', repo: 'https://github.com/xefensor/pebble-lib-activities',
    archive: 'pebble-activities-0.4.4.tgz',
    sha256: 'dffec3e05041515fbf9385a641adf6b40aedda7e8460c0d11ecb4ed019cd5abe',
    guide: '/docs/develop/activities/', purpose: 'Publish and consume typed activity summaries.',
  },
  {
    slug: 'core', name: 'Core', packageName: 'pebble-watchface-core',
    version: '0.5.2', status: 'Stable', repo: 'https://github.com/xefensor/pebble-lib-core',
    archive: 'pebble-watchface-core-0.5.2.tgz',
    sha256: '0d01d6daa50bed274f613c0bc4c476ab841e4a48b5d90b6b7b246867d7ca4d82',
    guide: '/docs/develop/core/', purpose: 'Selected readings, bounded state and shared transport.',
  },
  {
    slug: 'ui', name: 'XOCE UI', packageName: 'pebble-xoce-ui',
    version: '0.1.1', status: 'Stable', repo: 'https://github.com/xefensor/pebble-lib-ui',
    archive: 'pebble-xoce-ui-0.1.1.tgz',
    sha256: 'f75f39f047da3684973db7680e06a89ee2fa032220b81f28ac05fe989046d0a5',
    guide: '/docs/develop/ui/', purpose: 'Native drawing helpers and the phone settings stylesheet.',
  },
] as const;

/** These are shipped package snapshots, not standalone library release claims. */
export const bundledReleases = [
  { slug: 'dynamic', ref: 'v1.0.2', core: '0.6.1-dev.1', activities: '0.4.5', ui: '0.1.3' },
  { slug: 'halftone', ref: 'v1.10.3', core: '0.6.0', activities: '0.4.5', ui: '0.1.3' },
  { slug: 'timer', ref: 'v1.0.3', core: null, activities: '0.4.5', ui: '0.1.3' },
  { slug: 'dashboard', ref: 'v1.0.2', core: null, activities: '0.4.5', ui: '0.1.3' },
  { slug: 'open-activity', ref: 'v1.0.2', core: null, activities: null, ui: '0.1.3' },
] as const;

export const developerReferenceHeadings = [
  { depth: 2, slug: 'released-apps', text: 'Released app build guides' },
  { depth: 2, slug: 'library-versions', text: 'Public library packages' },
  { depth: 2, slug: 'bundled-packages', text: 'Packages bundled in the apps' },
];
