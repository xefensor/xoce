export type Project = {
  slug: string;
  name: string;
  kind: 'watchface' | 'app' | 'library';
  description: string;
  version?: string;
  repo?: string;
  tag?: string;
  download?: string;
  guide: string;
  setupGuide?: string;
  controlsGuide?: string;
  helpGuide?: string;
  requirements?: string[];
  summary: string;
  features: string[];
  image?: string;
  imageAlt?: string;
  platform: string;
  status: string;
  availability?: 'available' | 'planned';
  compatibility?: string;
  previewType?: 'watch' | 'phone' | 'image';
  developerGuide?: string;
  developerNote?: string;
  consumers?: string[];
  requires?: string[];
  optionalConnections?: string[];
  licence?: { name: string; url: string };
};

export const projects: Project[] = [
  {
    slug: 'phone',
    name: 'Phone',
    kind: 'app',
    availability: 'planned',
    platform: 'Android',
    status: 'Planned · working name',
    description: 'A planned standalone Android phone app, with an optional Pebble companion.',
    guide: '/docs/android/phone/',
    summary: 'Phone is intended to work on Android on its own. An optional watch companion is planned for starting a call from a Pebble. Connection details and supported devices will be established with a test build.',
    features: [
      'Planned as an Android app you can use without a watch',
      'Optional connection to a separate Pebble companion',
      'App-specific setup and supported devices will accompany a test build',
    ],
    optionalConnections: ['pebble-phone'],
  },
  {
    slug: 'pebble-phone',
    name: 'Phone for Pebble',
    kind: 'app',
    availability: 'planned',
    platform: 'PebbleOS',
    status: 'Planned · working name',
    description: 'A planned watch companion for the Android phone app.',
    guide: '/docs/pebble/phone-connection/',
    summary: 'The companion is intended to let you start a call from your watch through Phone on Android. It would be installed separately on the watch and would require that Android app. The connection method and supported watches will be documented with a build.',
    features: [
      'A separate Pebble app, connected to the Android phone app',
      'Starting calls from the watch is the intended workflow',
      'Compatibility and setup will be documented with the first build',
    ],
    requires: ['phone'],
  },
  {
    slug: 'dynamic',
    setupGuide: '/docs/pebble/setup/#dynamic',
    controlsGuide: '/docs/pebble/controls/#dynamic',
    helpGuide: '/docs/pebble/troubleshooting/#an-activity-is-missing',
    requirements: ['Activity features need the Pebble phone app’s plugin preview.', 'Built-in Music and Notifications activities need an Android phone.'],
    availability: 'available',
    compatibility: 'Pebble Time 2 / Emery',
    previewType: 'watch',
    developerGuide: '/docs/develop/activities/',
    developerNote: 'A watchface that displays compatible activities; providers supply content while Dynamic owns placement and priority.',
    name: 'Dynamic',
    kind: 'watchface',
    description: 'The time, weather and updates from your apps, right on your watchface.',
    version: '0.16.2',
    repo: 'https://github.com/xefensor/pebble-watchface-dynamic',
    tag: 'v0.16.2',
    licence: { name: 'PolyForm Noncommercial 1.0.0', url: 'https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.16.2/LICENSE' },
    download: 'https://github.com/xefensor/pebble-watchface-dynamic/releases/download/v0.16.2/Dynamic-0.16.2.pbw',
    guide: '/docs/pebble/setup/#dynamic',
    summary: 'A bold clock and two readings sit above your chosen activities. Music has its own presentation, while other activities can show a countdown, a value or a short update.',
    features: [
      'Keep one main activity and one compact row in view',
      'Follow music with the song, artist and optional artwork',
      'Choose which activities appear and their order',
    ],
    image: '/images/projects/dynamic.png',
    imageAlt: 'Dynamic displayed on the Pebble Time 2 emulator.',
    platform: 'PebbleOS',
    status: 'Development prerelease',
  },
  {
    slug: 'dashboard',
    setupGuide: '/docs/pebble/setup/#dashboard',
    controlsGuide: '/docs/pebble/controls/#dashboard',
    helpGuide: '/docs/pebble/troubleshooting/#settings-seem-not-to-save',
    requirements: ['Activity features need the Pebble phone app’s plugin preview.', 'Built-in Music and Notifications activities need an Android phone.'],
    availability: 'available',
    compatibility: 'Pebble Time 2 / Emery',
    previewType: 'watch',
    developerGuide: '/docs/develop/activities/#app-opening-and-actions',
    developerNote: 'An interactive activity host. Controls depend on the bound source; Timer Pause/Resume is not implemented.',
    name: 'Dashboard',
    kind: 'app',
    description: 'Your current activity, latest notification and pinned shortcuts in one place.',
    version: '0.4.3',
    repo: 'https://github.com/xefensor/pebble-app-dashboard',
    tag: 'v0.4.3',
    licence: { name: 'PolyForm Noncommercial 1.0.0', url: 'https://github.com/xefensor/pebble-app-dashboard/blob/v0.4.3/LICENSE' },
    download: 'https://github.com/xefensor/pebble-app-dashboard/releases/download/v0.4.3/Dashboard-0.4.3.pbw',
    guide: '/docs/pebble/setup/#dashboard',
    summary: 'A single watch app brings together a current activity, the latest available notification and two pins. Choose what a pin displays, does on Select and opens on Hold Select.',
    features: [
      'See one activity, a notification and two pinned items',
      'Use pins for a reading, an action or an app shortcut',
      'Choose Dashboard’s activity order independently of Dynamic',
    ],
    image: '/images/projects/dashboard.png',
    imageAlt: 'Dashboard displayed on the Pebble Time 2 emulator.',
    platform: 'PebbleOS',
    status: 'Development prerelease',
  },
  {
    slug: 'timer',
    setupGuide: '/docs/pebble/setup/#timer',
    controlsGuide: '/docs/pebble/controls/#timer',
    helpGuide: '/docs/pebble/troubleshooting/#timer-reports-alarm-not-set-keep-open',
    requirements: ['Sharing the countdown needs the Pebble phone app’s plugin support. The watch owns the alarm.'],
    availability: 'available',
    compatibility: 'Pebble Time 2 / Emery',
    previewType: 'watch',
    developerGuide: '/docs/develop/activities/',
    developerNote: 'Timer owns native countdowns and alarms. Its bundled provider shares summaries with compatible activity hosts.',
    name: 'Timer',
    kind: 'app',
    description: 'Save a countdown, start it again, and get an alarm on your watch.',
    version: '0.12.0',
    repo: 'https://github.com/xefensor/pebble-app-timer',
    tag: 'v0.12.0',
    licence: { name: 'PolyForm Noncommercial 1.0.0', url: 'https://github.com/xefensor/pebble-app-timer/blob/v0.12.0/LICENSE' },
    download: 'https://github.com/xefensor/pebble-app-timer/releases/download/v0.12.0/Timer-0.12.0.pbw',
    guide: '/docs/pebble/controls/#timer',
    summary: 'Set a duration with the watch buttons, then follow the hourglass as it counts down. Saved timers keep their duration so you can use them again.',
    features: [
      'Keep up to eight timers, from five seconds to 24 hours',
      'Pause or resume; reset to Ready and choose when to start again',
      'Let the watch handle the alarm and share the countdown with compatible activities',
    ],
    image: '/images/projects/timer.png',
    imageAlt: 'Timer displayed on the Pebble Time 2 emulator.',
    platform: 'PebbleOS',
    status: 'Development prerelease',
  },
  {
    slug: 'open-activity',
    setupGuide: '/docs/pebble/setup/#open-activity',
    controlsGuide: '/docs/pebble/controls/#open-activity',
    helpGuide: '/docs/pebble/troubleshooting/#open-activity-immediately-closes',
    requirements: ['Uses the Pebble phone app’s plugin support.', 'Choose matching shortcuts in Open Activity and the phone’s Quick Launch settings.'],
    availability: 'available',
    compatibility: 'Pebble Time 2 / Emery',
    previewType: 'watch',
    developerGuide: '/docs/develop/activities/#app-opening-and-actions',
    developerNote: 'Uses Dynamic’s recent displayed destinations. Opens the associated app without selecting a particular item inside it.',
    requires: ['dynamic'],
    name: 'Open Activity',
    kind: 'app',
    description: 'Use Quick Launch to open the app behind a timer or other activity.',
    version: '0.1.6',
    repo: 'https://github.com/xefensor/pebble-app-open-activity',
    tag: 'v0.1.6',
    licence: { name: 'PolyForm Noncommercial 1.0.0', url: 'https://github.com/xefensor/pebble-app-open-activity/blob/v0.1.6/LICENSE' },
    download: 'https://github.com/xefensor/pebble-app-open-activity/releases/download/v0.1.6/Open-Activity-0.1.6.pbw',
    guide: '/docs/pebble/setup/#open-activity',
    summary: 'Assign one shortcut to Dynamic’s main activity and another to its secondary activity. Open Activity opens the associated app using Dynamic’s recent view; it does not select a particular timer or notification inside that app.',
    features: [
      'Choose different shortcuts for the primary and secondary activity',
      'Follow the app destination that Dynamic recently displayed',
      'Open from the watch’s app list to set it up on your phone',
    ],
    image: '/images/projects/open-activity.png',
    imageAlt: 'Open Activity’s setup screen on the Pebble Time 2 emulator.',
    platform: 'PebbleOS',
    status: 'Development prerelease',
  },
  {
    slug: 'activities',
    availability: 'available',
    consumers: ['dynamic', 'dashboard', 'timer', 'open-activity'],
    name: 'Activities',
    kind: 'library',
    description: 'Publish activity content. Let each consuming app choose its layout.',
    version: '0.4.4',
    repo: 'https://github.com/xefensor/pebble-lib-activities',
    tag: 'v0.4.4',
    licence: { name: 'PolyForm Noncommercial 1.0.0', url: 'https://github.com/xefensor/pebble-lib-activities/blob/v0.4.4/LICENSE' },
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
    availability: 'available',
    consumers: ['dynamic', 'dashboard'],
    name: 'Core',
    kind: 'library',
    description: 'Shared readings and transport for Pebble watchface developers.',
    version: '0.5.1',
    repo: 'https://github.com/xefensor/pebble-lib-core',
    tag: 'v0.5.1',
    licence: { name: 'PolyForm Noncommercial 1.0.0', url: 'https://github.com/xefensor/pebble-lib-core/blob/v0.5.1/LICENSE' },
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
