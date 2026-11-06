export interface DocLink {
  title: string;
  href: string;
  section: 'Use XOCE' | 'Develop' | 'Design';
  description: string;
}

export const docs: DocLink[] = [
  {
    title: 'Getting started',
    href: '/docs/getting-started/',
    section: 'Use XOCE',
    description: 'Choose the Pebble apps you need and understand how they fit together.',
  },
  {
    title: 'Set up your Pebble',
    href: '/docs/pebble/setup/',
    section: 'Use XOCE',
    description: 'Install the development builds, configure activities and set Quick Launch shortcuts.',
  },
  {
    title: 'Watch controls',
    href: '/docs/pebble/controls/',
    section: 'Use XOCE',
    description: 'Use Timer, Dashboard and Open Activity with the watch’s buttons.',
  },
  {
    title: 'Troubleshooting',
    href: '/docs/pebble/troubleshooting/',
    section: 'Use XOCE',
    description: 'Find help with missing activities, permissions, settings and app handoff.',
  },
  {
    title: 'Licensing and source',
    href: '/docs/project/licensing/',
    section: 'Use XOCE',
    description: 'Find each project’s source, licence, release files and historical repositories.',
  },
  {
    title: 'Build an activity provider',
    href: '/docs/develop/activities/',
    section: 'Develop',
    description: 'Publish current activity summaries with the schema 4 provider API.',
  },
  {
    title: 'Integrate Core',
    href: '/docs/develop/core/',
    section: 'Develop',
    description: 'Understand the shared readings library and what its consuming host owns.',
  },
  {
    title: 'Design principles',
    href: '/docs/design/principles/',
    section: 'Design',
    description: 'Readable, predictable interfaces that respect each device and the person using it.',
  },
];
