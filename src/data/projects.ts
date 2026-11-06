export type Project = {
  slug: string;
  name: string;
  kind: 'watchface' | 'app' | 'library';
  description: string;
  version: string;
  repo: string;
  tag: string;
  download?: string;
  guide: string;
  summary: string;
  features: string[];
  image?: string;
  imageAlt?: string;
  platform: string;
  status: string;
};

export const projects: Project[] = [
  {
    slug: 'dynamic',
    name: 'Dynamic',
    kind: 'watchface',
    description: 'Your time, readings and ongoing activities, at a glance.',
    version: '0.16.2',
    repo: 'https://github.com/xefensor/pebble-watchface-dynamic',
    tag: 'v0.16.2',
    download: 'https://github.com/xefensor/pebble-watchface-dynamic/releases/download/v0.16.2/Dynamic-0.16.2.pbw',
    guide: '/docs/pebble/setup/#dynamic',
    summary: 'A Pebble Time 2 watchface with a bold clock, two shared readings and room for what is happening now. A larger primary activity sits beneath one compact secondary row, with a dedicated presentation for media.',
    features: [
      'One primary activity and one compact, static secondary row',
      'Media title, artist and optional album artwork',
      'Activity visibility and priority configured in Dynamic’s settings',
    ],
    image: '/images/projects/dynamic.png',
    imageAlt: 'Dynamic displayed on the Pebble Time 2 emulator.',
    platform: 'PebbleOS',
    status: 'Development prerelease',
  },
  {
    slug: 'dashboard',
    name: 'Dashboard',
    kind: 'app',
    description: 'Activities, notifications and useful shortcuts in one overview.',
    version: '0.4.3',
    repo: 'https://github.com/xefensor/pebble-app-dashboard',
    tag: 'v0.4.3',
    download: 'https://github.com/xefensor/pebble-app-dashboard/releases/download/v0.4.3/Dashboard-0.4.3.pbw',
    guide: '/docs/pebble/setup/#dashboard',
    summary: 'A separate watch app for a current activity, the latest available notification and two pinned items. A pin can show a reading, perform an action, open an app, or combine those capabilities.',
    features: [
      'A readable overview with a contextual button sidebar',
      'Pinned readings, actions and named app destinations',
      'Independent activity ordering and light or dark appearance',
    ],
    image: '/images/projects/dashboard.png',
    imageAlt: 'Dashboard displayed on the Pebble Time 2 emulator.',
    platform: 'PebbleOS',
    status: 'Development prerelease',
  },
  {
    slug: 'timer',
    name: 'Timer',
    kind: 'app',
    description: 'Eight saved timers, clear countdowns and native watch alarms.',
    version: '0.12.0',
    repo: 'https://github.com/xefensor/pebble-app-timer',
    tag: 'v0.12.0',
    download: 'https://github.com/xefensor/pebble-app-timer/releases/download/v0.12.0/Timer-0.12.0.pbw',
    guide: '/docs/pebble/controls/#timer',
    summary: 'Set a countdown on the watch, follow its hourglass and share the remaining time with compatible activity hosts. Saved timers keep their repeat duration, and Reset leaves a timer Ready until you explicitly start it again.',
    features: [
      'Up to eight saved timers, from five seconds to 24 hours',
      'Pause, resume and reset to Ready on the watch',
      'Native alarm ownership and activity sharing through the phone',
    ],
    image: '/images/projects/timer.png',
    imageAlt: 'Timer displayed on the Pebble Time 2 emulator.',
    platform: 'PebbleOS',
    status: 'Development prerelease',
  },
  {
    slug: 'open-activity',
    name: 'Open Activity',
    kind: 'app',
    description: 'Quick Launch into Dynamic’s primary or secondary activity.',
    version: '0.1.6',
    repo: 'https://github.com/xefensor/pebble-app-open-activity',
    tag: 'v0.1.6',
    download: 'https://github.com/xefensor/pebble-app-open-activity/releases/download/v0.1.6/Open-Activity-0.1.6.pbw',
    guide: '/docs/pebble/setup/#open-activity',
    summary: 'One small watch app connects Quick Launch to the app associated with Dynamic’s recently displayed activity. Choose one shortcut for Primary and another for Secondary. An ordinary app-list launch stays open for setup.',
    features: [
      'Two configurable activity shortcuts in one app',
      'App destinations follow Dynamic’s recent displayed activities',
      'A normal setup screen for configuring shortcuts on the phone',
    ],
    image: '/images/projects/open-activity.png',
    imageAlt: 'Open Activity’s setup screen on the Pebble Time 2 emulator.',
    platform: 'PebbleOS',
    status: 'Development prerelease',
  },
  {
    slug: 'activities',
    name: 'Activities',
    kind: 'library',
    description: 'Publish activity content. Let each consuming app choose its layout.',
    version: '0.4.4',
    repo: 'https://github.com/xefensor/pebble-lib-activities',
    tag: 'v0.4.4',
    download: 'https://github.com/xefensor/pebble-lib-activities/releases/download/v0.4.4/pebble-activities-0.4.4.tgz',
    guide: '/docs/develop/activities/',
    summary: 'An embedded developer library and provider convention for ongoing activities on stock PebbleOS. New providers publish schema 4 standard or media summaries; hosts own placement, priority and rendering.',
    features: [
      'Typed text, measurements, countdowns, elapsed time and media',
      'Optional app destinations and contextual action descriptors',
      'Original source identity, observation and validity preserved',
    ],
    platform: 'PebbleOS',
    status: 'Development prerelease',
  },
  {
    slug: 'core',
    name: 'Core',
    kind: 'library',
    description: 'Shared readings and transport for Pebble watchface developers.',
    version: '0.5.1',
    repo: 'https://github.com/xefensor/pebble-lib-core',
    tag: 'v0.5.1',
    download: 'https://github.com/xefensor/pebble-lib-core/releases/download/v0.5.1/pebble-watchface-core-0.5.1.tgz',
    guide: '/docs/develop/core/',
    summary: 'A versioned library for selected readings, bounded state and shared phone-to-watch transport. The consuming watchface keeps ownership of its layout, Pebble services, permissions and release.',
    features: [
      'Integration with the first two global reading choices',
      'A shared message queue and bounded native packet decoding',
      'Readings-only integration alongside compatible legacy APIs',
    ],
    platform: 'PebbleOS',
    status: 'Published library',
  },
];
