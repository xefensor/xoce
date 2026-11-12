export interface DocLink {
  title: string;
  href: string;
  section: 'For users' | 'For developers' | 'Design';
  description: string;
  platform?: 'Android' | 'PebbleOS';
  project?: string;
}

export const docSections = [
  { title: 'For users', href: '/docs/getting-started/', description: 'Install and use the available Pebble apps, with help when something goes wrong.', icon: 'book' },
  { title: 'For developers', href: '/docs/develop/building/', description: 'Use the current Pebble libraries, build from source and understand each platform’s scope.', icon: 'code' },
  { title: 'Design', href: '/docs/design/principles/', description: 'Design decisions, website identity and the native Pebble interface standard.', icon: 'spark' },
] as const;

export const docs: DocLink[] = [
  {
    title: 'Getting started',
    href: '/docs/getting-started/',
    section: 'For users',
    description: 'Install the current Pebble apps, try a timer on your watchface and find help for your next task.',
  },
  {
    title: 'Set up your Pebble',
    href: '/docs/pebble/setup/',
    section: 'For users',
    platform: 'PebbleOS',
    description: 'Install the development builds, configure activities and set Quick Launch shortcuts.',
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
    title: 'Building and contributing',
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
    title: 'Pebble UI and UX standard',
    href: '/docs/design/pebble-ui-system/',
    section: 'Design',
    platform: 'PebbleOS',
    description: 'Shared watch and phone settings design, implemented and validated in local candidates; not published.',
  },
  {
    title: 'Design principles',
    href: '/docs/design/principles/',
    section: 'Design',
    description: 'Common principles for readable content, clear state and interfaces that fit their device.',
  },
  {
    title: 'Visual identity',
    href: '/docs/design/visual-identity/',
    section: 'Design',
    description: 'The website’s plain-text name, colour roles, typography and available assets.',
  },
  {
    title: 'UI patterns',
    href: '/docs/design/ui-patterns/',
    section: 'Design',
    description: 'Shared ideas demonstrated by current Pebble layouts and phone settings.',
  },
  {
    title: 'UX and interaction',
    href: '/docs/design/interaction/',
    section: 'Design',
    description: 'Common interaction rules and their concrete implementations in the Pebble apps.',
  },
];
