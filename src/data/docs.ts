export interface DocLink {
  title: string;
  href: string;
  section: 'For users' | 'For developers' | 'Design';
  description: string;
  platform?: 'Android' | 'PebbleOS';
  project?: string;
  status?: 'current' | 'historical';
  currentGuide?: string;
}

export const docSections = [
  { title: 'For users', href: '/docs/getting-started/', description: 'Install and use the available Pebble apps, with help when something goes wrong.', icon: 'book' },
  { title: 'For developers', href: '/docs/develop/', description: 'Build an app, publish a provider or use the shared libraries.', icon: 'code' },
  { title: 'Design', href: '/docs/design/', description: 'Use the current visual system, components and device-specific interaction rules.', icon: 'spark' },
] as const;

export const docs: DocLink[] = [
  {
    title: 'Getting started',
    href: '/docs/getting-started/',
    section: 'For users',
    description: 'Check release availability, try Timer on its own, then connect a watchface.',
  },
  {
    title: 'Set up your Pebble',
    href: '/docs/pebble/setup/',
    section: 'For users',
    platform: 'PebbleOS',
    description: 'Install from Pebble Store or a verified PBW, configure activities and set Quick Launch shortcuts.',
  },
  {
    title: 'Activities: a timer on your watchface',
    href: '/docs/pebble/activities/',
    section: 'For users',
    platform: 'PebbleOS',
    description: 'Understand Activities, show a Timer countdown on Dynamic or Halftone, and return to the app.',
  },
  {
    title: 'Set up Halftone',
    href: '/docs/pebble/halftone/',
    section: 'For users',
    platform: 'PebbleOS',
    description: 'Choose Halftone as your watchface and configure its two readings and dot border.',
  },
  {
    title: 'Set up ČHMÚ Weather',
    href: '/docs/pebble/chmu-weather/',
    section: 'For users',
    platform: 'PebbleOS',
    description: 'Install the optional Czech weather plugin and use it with Pebble Weather or shared readings.',
  },
  {
    title: 'Watch controls',
    href: '/docs/pebble/controls/',
    section: 'For users',
    platform: 'PebbleOS',
    description: 'Use Timer, Dashboard and Open Activity with the watch’s buttons.',
  },
  {
    title: 'Troubleshooting',
    href: '/docs/pebble/troubleshooting/',
    section: 'For users',
    platform: 'PebbleOS',
    description: 'Find help with missing activities, permissions, settings and app handoff.',
  },
  {
    title: 'Licensing and source',
    href: '/docs/project/licensing/',
    section: 'For users',
    description: 'Find each current project’s source, licence, release files and historical repositories.',
  },
  {
    title: 'Developer overview',
    href: '/docs/develop/',
    section: 'For developers',
    description: 'Choose an existing app, a provider or a shared library and follow a complete first workflow.',
  },
  {
    title: 'Build and contribute',
    href: '/docs/develop/building/',
    section: 'For developers',
    description: 'Build the current sources, find each project’s checks and contribute in its maintained repository.',
  },
  {
    title: 'Build an activity provider',
    href: '/docs/develop/activities/',
    section: 'For developers',
    platform: 'PebbleOS',
    project: 'activities',
    description: 'Publish current Pebble activity summaries with the schema 4 provider API.',
  },
  {
    title: 'Integrate Core',
    href: '/docs/develop/core/',
    section: 'For developers',
    platform: 'PebbleOS',
    project: 'core',
    description: 'Understand the shared Pebble readings library and what its consuming host owns.',
  },
  {
    title: 'Use XOCE UI',
    href: '/docs/develop/ui/',
    section: 'For developers',
    platform: 'PebbleOS',
    project: 'ui',
    description: 'Use shared native drawing and phone-settings styles while keeping the host in control.',
  },
  {
    title: 'Design overview',
    href: '/docs/design/',
    section: 'Design',
    description: 'Choose current website, watch or phone guidance; find visual examples and historical studies.',
  },
  {
    title: 'Design principles',
    href: '/docs/design/principles/',
    section: 'Design',
    description: 'Common principles for readable content, clear state and interfaces that fit their device.',
  },
  {
    title: 'Website visual identity',
    href: '/docs/design/visual-identity/',
    section: 'Design',
    description: 'The website’s tactile materials, outlined name, typography and product artwork.',
  },
  {
    title: 'Pebble interface reference',
    href: '/docs/design/pebble-ui-system/',
    section: 'Design',
    platform: 'PebbleOS',
    description: 'Current watch and phone interface roles, both watch shapes and the implemented shared UI package.',
  },
  {
    title: 'Interface patterns',
    href: '/docs/design/ui-patterns/',
    section: 'Design',
    description: 'Shared ideas demonstrated by current Pebble layouts and phone settings.',
  },
  {
    title: 'Interaction and state',
    href: '/docs/design/interaction/',
    section: 'Design',
    description: 'Common interaction rules and their concrete implementations in the Pebble apps.',
  },
  {
    title: 'Historical Pebble UI study',
    href: '/docs/history/pebble-ui-system/',
    section: 'Design',
    status: 'historical',
    currentGuide: '/docs/design/pebble-ui-system/',
    description: 'Archived pre-release native UI study; retained for its original decisions and evidence.',
  },
  {
    title: 'Historical UI patterns',
    href: '/docs/history/ui-patterns/',
    section: 'Design',
    status: 'historical',
    currentGuide: '/docs/design/ui-patterns/',
    description: 'Earlier versioned pattern examples, with their original native capture labels.',
  },
  {
    title: 'Historical interaction study',
    href: '/docs/history/interaction/',
    section: 'Design',
    status: 'historical',
    currentGuide: '/docs/design/interaction/',
    description: 'Archived pre-release workflow notes; use the current guide for released behaviour.',
  },
];
