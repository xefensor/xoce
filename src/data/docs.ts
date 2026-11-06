export interface DocLink {
  title: string;
  href: string;
  section: 'For users' | 'For developers' | 'Design';
  description: string;
}

export const docSections = [
  { title: 'For users', href: '/users/', description: 'Choose an app, set up your watch and find help.', icon: 'watch' },
  { title: 'For developers', href: '/developers/', description: 'Work with the libraries, integrate activities and contribute.', icon: 'code' },
  { title: 'Design', href: '/design/', description: 'Published interfaces and the shared standard validated in local Pebble candidates.', icon: 'spark' },
] as const;

export const docs: DocLink[] = [
  {
    title: 'Getting started',
    href: '/docs/getting-started/',
    section: 'For users',
    description: 'Choose the Pebble apps you need and understand how they fit together.',
  },
  {
    title: 'Set up your Pebble',
    href: '/docs/pebble/setup/',
    section: 'For users',
    description: 'Install the development builds, configure activities and set Quick Launch shortcuts.',
  },
  {
    title: 'Watch controls',
    href: '/docs/pebble/controls/',
    section: 'For users',
    description: 'Use Timer, Dashboard and Open Activity with the watch’s buttons.',
  },
  {
    title: 'Troubleshooting',
    href: '/docs/pebble/troubleshooting/',
    section: 'For users',
    description: 'Find help with missing activities, permissions, settings and app handoff.',
  },
  {
    title: 'Licensing and source',
    href: '/docs/project/licensing/',
    section: 'For users',
    description: 'Find each project’s source, licence, release files and historical repositories.',
  },
  {
    title: 'Build an activity provider',
    href: '/docs/develop/activities/',
    section: 'For developers',
    description: 'Publish current activity summaries with the schema 4 provider API.',
  },
  {
    title: 'Integrate Core',
    href: '/docs/develop/core/',
    section: 'For developers',
    description: 'Understand the shared readings library and what its consuming host owns.',
  },
  {
    title: 'Pebble UI and UX standard',
    href: '/docs/design/pebble-ui-system/',
    section: 'Design',
    description: 'Shared watch and phone settings design, implemented and validated in local candidates; not published.',
  },
  {
    title: 'Design principles',
    href: '/docs/design/principles/',
    section: 'Design',
    description: 'Established decisions about readability, hierarchy, platform behaviour and battery use.',
  },
  {
    title: 'Visual identity',
    href: '/docs/design/visual-identity/',
    section: 'Design',
    description: 'The website’s current mark, colour roles, typography and available assets.',
  },
  {
    title: 'UI patterns',
    href: '/docs/design/ui-patterns/',
    section: 'Design',
    description: 'Existing activity layouts, settings patterns and readable Pebble interfaces.',
  },
  {
    title: 'UX and interaction',
    href: '/docs/design/interaction/',
    section: 'Design',
    description: 'Navigation, actions, state feedback and transitions in the current apps.',
  },
];
