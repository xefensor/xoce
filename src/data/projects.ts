export type WatchPlatform = 'emery' | 'gabbro';
export type Project = {
  uuid?: string;
  artifactSha256?: string;
  publication?: 'preview' | 'published';
  storeUrl?: string;
  supportUrl?: string;
  privacyUrl?: string;
  watchPlatforms?: WatchPlatform[];
  previews?: Partial<Record<WatchPlatform, { image: string; alt: string }>>;
  previousRelease?: { version?: string; tag?: string; download?: string };
  slug: string;
  name: string;
  kind: 'watchface' | 'app' | 'plugin' | 'library';
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
  imageVersion?: string;
  imageCapturedOn?: string;
  imageCaption?: string;
  platform: string;
  status: string;
  availability?: 'available' | 'planned';
  compatibility?: string;
  previewType?: 'watch' | 'phone' | 'image' | 'icon';
  developerGuide?: string;
  developerNote?: string;
  consumers?: string[];
  requires?: string[];
  optionalConnections?: string[];
  licence?: { name: string; url: string };
};

export const projects: Project[] = [
  {
    "slug": "phone",
    "name": "Phone",
    "kind": "app",
    "availability": "planned",
    "platform": "Android",
    "status": "Planned \u00b7 working name",
    "description": "A planned standalone Android phone app, with an optional Pebble companion.",
    "guide": "/docs/android/phone/",
    "summary": "Phone is intended to work on Android on its own. An optional watch companion is planned for starting a call from a Pebble. Connection details and supported devices will be established with a test build.",
    "features": [
      "Planned as an Android app you can use without a watch",
      "Optional connection to a separate Pebble companion",
      "App-specific setup and supported devices will accompany a test build"
    ],
    "optionalConnections": [
      "pebble-phone"
    ]
  },
  {
    "slug": "pebble-phone",
    "name": "Phone for Pebble",
    "kind": "app",
    "availability": "planned",
    "platform": "PebbleOS",
    "status": "Planned \u00b7 working name",
    "description": "A planned watch companion for the Android phone app.",
    "guide": "/docs/pebble/phone-connection/",
    "summary": "The companion is intended to let you start a call from your watch through Phone on Android. It would be installed separately on the watch and would require that Android app. The connection method and supported watches will be documented with a build.",
    "features": [
      "A separate Pebble app, connected to the Android phone app",
      "Starting calls from the watch is the intended workflow",
      "Compatibility and setup will be documented with the first build"
    ],
    "requires": [
      "phone"
    ]
  },
  {
    "slug": "dynamic",
    "setupGuide": "/docs/pebble/setup/",
    "controlsGuide": "/docs/pebble/controls/#dynamic",
    "helpGuide": "/docs/pebble/troubleshooting/#an-activity-is-missing",
    "requirements": [
      "Activity features need the Pebble phone app\u2019s plugin preview.",
      "Built-in Music and Notifications activities need an Android phone."
    ],
    "availability": "available",
    "compatibility": "Pebble Time 2 and Round 2",
    "previewType": "watch",
    "developerGuide": "/docs/develop/activities/",
    "developerNote": "A watchface that displays compatible activities; providers supply content while Dynamic owns placement and priority.",
    "name": "Dynamic",
    "kind": "watchface",
    "description": "The time, weather and updates from your apps, right on your watchface.",
    "version": "0.19.1",
    "repo": "https://github.com/xefensor/pebble-watchface-dynamic",
    "licence": {
      "name": "PolyForm Noncommercial 1.0.0",
      "url": "https://github.com/xefensor/pebble-watchface-dynamic/blob/main/LICENSE"
    },
    "guide": "/docs/pebble/setup/#dynamic",
    "summary": "A bold clock and two readings sit above your chosen activities. Music has its own presentation, while other activities can show a countdown, a value or a short update.",
    "features": [
      "Keep one main activity and one compact row in view",
      "Follow music with the song, artist and optional artwork",
      "Choose which activities appear and their order"
    ],
    "image": "/images/screenshots/dynamic-0.19.1-emery-clock-and-readings.png",
    "imageVersion": "0.19.1",
    "imageAlt": "Dynamic 0.19.1, Time 2: clock and readings.",
    "platform": "PebbleOS",
    "status": "Store release in preparation",
    "previousRelease": {
      "version": "0.18.3",
      "tag": "v0.18.3",
      "download": "https://github.com/xefensor/pebble-watchface-dynamic/releases/download/v0.18.3/Dynamic-0.18.3.pbw"
    },
    "publication": "preview",
    "supportUrl": "/projects/dynamic/support/",
    "privacyUrl": "/projects/dynamic/privacy/",
    "watchPlatforms": [
      "emery",
      "gabbro"
    ],
    "previews": {
      "emery": {
        "image": "/images/screenshots/dynamic-0.19.1-emery-clock-and-readings.png",
        "alt": "Dynamic 0.19.1, Time 2: clock and readings."
      },
      "gabbro": {
        "image": "/images/screenshots/dynamic-0.19.1-gabbro-clock-and-readings.png",
        "alt": "Dynamic 0.19.1, Round 2: clock and readings."
      }
    },
    "uuid": "cc1281f1-3b4d-45b5-b235-6881b1fd8fbd",
    "artifactSha256": "c5b3de037721778499d236ba694d7dfae446f658c2e6f7c2774b5d4cac851f19"
  },
  {
    "slug": "dashboard",
    "setupGuide": "/docs/pebble/setup/",
    "controlsGuide": "/docs/pebble/controls/#dashboard",
    "helpGuide": "/docs/pebble/troubleshooting/#settings-seem-not-to-save",
    "requirements": [
      "Activity features need the Pebble phone app\u2019s plugin preview.",
      "Built-in Music and Notifications activities need an Android phone."
    ],
    "availability": "available",
    "compatibility": "Pebble Time 2 and Round 2",
    "previewType": "watch",
    "developerGuide": "/docs/develop/activities/#app-opening-and-actions",
    "developerNote": "An interactive activity host. Controls depend on the bound source; Timer Pause/Resume is not implemented.",
    "name": "Dashboard",
    "kind": "app",
    "description": "Your current activity, latest notification and pinned shortcuts in one place.",
    "version": "0.7.1",
    "repo": "https://github.com/xefensor/pebble-app-dashboard",
    "licence": {
      "name": "PolyForm Noncommercial 1.0.0",
      "url": "https://github.com/xefensor/pebble-app-dashboard/blob/main/LICENSE"
    },
    "guide": "/docs/pebble/setup/#dashboard",
    "summary": "A single watch app brings together a current activity, the latest available notification and two pins. Choose what a pin displays, does on Select and opens on Hold Select.",
    "features": [
      "Keep an activity, a notification and two pins in one overview",
      "Open collections and use the controls a source provides",
      "Choose readings, actions and app shortcuts for your pins"
    ],
    "image": "/images/screenshots/dashboard-0.7.1-emery-overview.png",
    "imageVersion": "0.7.1",
    "imageAlt": "Dashboard 0.7.1, Time 2: overview.",
    "platform": "PebbleOS",
    "status": "Store release in preparation",
    "previousRelease": {
      "version": "0.6.3",
      "tag": "v0.6.3",
      "download": "https://github.com/xefensor/pebble-app-dashboard/releases/download/v0.6.3/Dashboard-0.6.3.pbw"
    },
    "publication": "preview",
    "supportUrl": "/projects/dashboard/support/",
    "privacyUrl": "/projects/dashboard/privacy/",
    "watchPlatforms": [
      "emery",
      "gabbro"
    ],
    "previews": {
      "emery": {
        "image": "/images/screenshots/dashboard-0.7.1-emery-overview.png",
        "alt": "Dashboard 0.7.1, Time 2: overview."
      },
      "gabbro": {
        "image": "/images/screenshots/dashboard-0.7.1-gabbro-overview.png",
        "alt": "Dashboard 0.7.1, Round 2: overview."
      }
    },
    "uuid": "f76f9fc1-2944-4248-bcc5-3eea2af0183b",
    "artifactSha256": "7170f478443ce90509fd80808341027479860cc03da8147451c6a157c175aa45"
  },
  {
    "slug": "timer",
    "setupGuide": "/docs/pebble/setup/",
    "controlsGuide": "/docs/pebble/controls/#timer",
    "helpGuide": "/docs/pebble/troubleshooting/#timer-reports-alarm-not-set-keep-open",
    "requirements": [
      "Sharing the countdown needs the Pebble phone app\u2019s plugin support. The watch owns the alarm."
    ],
    "availability": "available",
    "compatibility": "Pebble Time 2 and Round 2",
    "previewType": "watch",
    "developerGuide": "/docs/develop/activities/",
    "developerNote": "Timer owns native countdowns and alarms. Its bundled provider shares summaries with compatible activity hosts.",
    "name": "Timer",
    "kind": "app",
    "description": "Set a timer. Keep it ready for next time.",
    "version": "0.15.1",
    "repo": "https://github.com/xefensor/pebble-app-timer",
    "licence": {
      "name": "PolyForm Noncommercial 1.0.0",
      "url": "https://github.com/xefensor/pebble-app-timer/blob/main/LICENSE"
    },
    "guide": "/docs/pebble/controls/#timer",
    "summary": "Manage up to eight timers with the watch buttons. Pause, resume or reuse a saved duration. The watch keeps the countdown and handles its alarm; sharing it with a watchface is optional.",
    "features": [
      "Keep up to eight timers, from five seconds to 24 hours",
      "Pause, resume or reset a saved timer when you need it",
      "See the countdown in Dynamic, Halftone or Dashboard with a connected phone"
    ],
    "image": "/images/screenshots/timer-0.15.1-emery-your-first-timer.png",
    "imageVersion": "0.15.1",
    "imageAlt": "Timer 0.15.1, Time 2: your first timer.",
    "platform": "PebbleOS",
    "status": "Store release in preparation",
    "previousRelease": {
      "version": "0.14.5",
      "tag": "v0.14.5",
      "download": "https://github.com/xefensor/pebble-app-timer/releases/download/v0.14.5/Timer-0.14.5.pbw"
    },
    "publication": "preview",
    "supportUrl": "/projects/timer/support/",
    "privacyUrl": "/projects/timer/privacy/",
    "watchPlatforms": [
      "emery",
      "gabbro"
    ],
    "previews": {
      "emery": {
        "image": "/images/screenshots/timer-0.15.1-emery-your-first-timer.png",
        "alt": "Timer 0.15.1, Time 2: your first timer."
      },
      "gabbro": {
        "image": "/images/screenshots/timer-0.15.1-gabbro-saved-timers.png",
        "alt": "Timer 0.15.1, Round 2: saved timers."
      }
    },
    "uuid": "50e9ef12-a5ab-4369-a3b5-3447bfba5151",
    "artifactSha256": "ef0bc144cb324cca6fdc7d82ebb0adfecc116d348a2be53d98c63b118e95fb0f"
  },
  {
    "slug": "open-activity",
    "setupGuide": "/docs/pebble/setup/",
    "controlsGuide": "/docs/pebble/controls/#open-activity",
    "helpGuide": "/docs/pebble/troubleshooting/#open-activity-immediately-closes",
    "requirements": [
      "Needs either Dynamic or Halftone as its source watchface.",
      "Uses the Pebble phone app\u2019s plugin support.",
      "Choose matching shortcuts in Open Activity and the phone\u2019s Quick Launch settings."
    ],
    "availability": "available",
    "compatibility": "Pebble Time 2 and Round 2",
    "previewType": "watch",
    "developerGuide": "/docs/develop/activities/#app-opening-and-actions",
    "developerNote": "Uses Dynamic\u2019s recent displayed destinations. Opens the associated app without selecting a particular item inside it.",
    "requires": [],
    "name": "Open Activity",
    "kind": "app",
    "description": "Use Quick Launch to open the app behind a timer or other activity.",
    "version": "0.4.1",
    "repo": "https://github.com/xefensor/pebble-app-open-activity",
    "licence": {
      "name": "PolyForm Noncommercial 1.0.0",
      "url": "https://github.com/xefensor/pebble-app-open-activity/blob/main/LICENSE"
    },
    "guide": "/docs/pebble/setup/#open-activity",
    "summary": "Choose Dynamic or Halftone, then assign a shortcut to its primary or secondary activity. Open Activity opens the associated app from that watchface\u2019s recent view.",
    "features": [
      "Choose Dynamic or Halftone as the source watchface",
      "Assign different shortcuts to primary and secondary activities",
      "Open from the app list for setup; use Quick Launch to open an activity"
    ],
    "image": "/images/screenshots/open-activity-0.4.1-emery-shortcut-setup.png",
    "imageVersion": "0.4.1",
    "imageAlt": "Open Activity 0.4.1, Time 2: shortcut setup.",
    "platform": "PebbleOS",
    "status": "Store release in preparation",
    "previousRelease": {
      "version": "0.3.3",
      "tag": "v0.3.3",
      "download": "https://github.com/xefensor/pebble-app-open-activity/releases/download/v0.3.3/Open-Activity-0.3.3.pbw"
    },
    "publication": "preview",
    "supportUrl": "/projects/open-activity/support/",
    "privacyUrl": "/projects/open-activity/privacy/",
    "watchPlatforms": [
      "emery",
      "gabbro"
    ],
    "previews": {
      "emery": {
        "image": "/images/screenshots/open-activity-0.4.1-emery-shortcut-setup.png",
        "alt": "Open Activity 0.4.1, Time 2: shortcut setup."
      },
      "gabbro": {
        "image": "/images/screenshots/open-activity-0.4.1-gabbro-shortcut-setup.png",
        "alt": "Open Activity 0.4.1, Round 2: shortcut setup."
      }
    },
    "optionalConnections": [
      "dynamic",
      "halftone"
    ],
    "uuid": "d2d0bf48-cf4c-42f6-8b5f-3657fb2de4e9",
    "artifactSha256": "0cabf5d92b9b105ac301dbed43d61a0d746c83fda017e28f305c8a98071f2293"
  },
  {
    "slug": "halftone",
    "name": "Halftone",
    "kind": "watchface",
    "availability": "available",
    "platform": "PebbleOS",
    "compatibility": "Pebble Time 2 and Round 2",
    "status": "Store release in preparation",
    "version": "1.10.1",
    "repo": "https://github.com/xefensor/halftone-watchface",
    "licence": {
      "name": "PolyForm Noncommercial 1.0.0",
      "url": "https://github.com/xefensor/halftone-watchface/blob/main/LICENSE"
    },
    "description": "A bold clock, a dot border and room for what\u2019s happening now.",
    "summary": "Two readings sit beneath a Fira clock. Timer, music and other compatible activities use the space below, with a compact secondary row and room for Timeline Peek.",
    "features": [
      "Choose colours, Bigger Text, shadow and the circular dot border",
      "Keep weather or other readings above your chosen activities",
      "Follow timers, music and optional notifications; use Open Activity for shortcuts"
    ],
    "requirements": [
      "Readings and shared activities use the Pebble phone app\u2019s plugin preview.",
      "Music and notification integration needs Android."
    ],
    "guide": "/docs/pebble/halftone/",
    "setupGuide": "/docs/pebble/halftone/",
    "controlsGuide": "/docs/pebble/controls/#halftone",
    "helpGuide": "/docs/pebble/halftone/#if-a-reading-is-missing",
    "developerNote": "Activity content stays provider-owned. Halftone controls its layout and independent display preferences.",
    "optionalConnections": [
      "timer",
      "open-activity",
      "chmu-weather"
    ],
    "previewType": "watch",
    "image": "/images/screenshots/halftone-1.10.1-emery-clock-and-readings.png",
    "imageVersion": "1.10.1",
    "imageAlt": "Halftone 1.10.1, Time 2: clock and readings.",
    "previousRelease": {
      "version": "1.9.0-rc.6",
      "tag": "v1.9.0-rc.6",
      "download": "https://github.com/xefensor/halftone-watchface/releases/download/v1.9.0-rc.6/Halftone-1.9.0-rc.6.pbw"
    },
    "publication": "preview",
    "supportUrl": "/projects/halftone/support/",
    "privacyUrl": "/projects/halftone/privacy/",
    "watchPlatforms": [
      "emery",
      "gabbro"
    ],
    "previews": {
      "emery": {
        "image": "/images/screenshots/halftone-1.10.1-emery-clock-and-readings.png",
        "alt": "Halftone 1.10.1, Time 2: clock and readings."
      },
      "gabbro": {
        "image": "/images/screenshots/halftone-1.10.1-gabbro-clock-and-readings.png",
        "alt": "Halftone 1.10.1, Round 2: clock and readings."
      }
    },
    "uuid": "d4dd5046-53be-4624-99e8-46e0b377fe66",
    "artifactSha256": "029dccc901c0df0a071f4253fe911d45af1a2491def4e53b66957c5544e746ec"
  },
  {
    "slug": "chmu-weather",
    "name": "\u010cHM\u00da Weather",
    "kind": "plugin",
    "availability": "available",
    "platform": "PebbleOS",
    "compatibility": "Pebble phone app with plugins \u00b7 Czech weather locations",
    "status": "Store release in preparation",
    "version": "1.0.2",
    "repo": "https://github.com/xefensor/pebble-chmu-weather",
    "licence": {
      "name": "PolyForm Noncommercial 1.0.0",
      "url": "https://github.com/xefensor/pebble-chmu-weather/blob/main/LICENSE"
    },
    "description": "Nearby Czech weather observations and ALADIN forecasts, shared through Pebble\u2019s phone app.",
    "summary": "An unofficial weather provider running inside the Pebble phone app. Choose it for Pebble Weather or compatible readings in Dynamic, Halftone and Dashboard. \u010cHM\u00da supplies station observations and ALADIN forecasts; optional Open-Meteo fills gaps.",
    "features": [
      "Use automatic nearby station selection or choose a fixed Czech station",
      "Feed Pebble Weather and compatible watchface readings without an API key",
      "Optionally add rain probabilities, forecast UV and later forecast days with Open-Meteo"
    ],
    "requirements": [
      "Enable Plugins / permissions preview in the official Pebble phone app.",
      "Czech coverage. Internet access is required for public observations; GPS is optional when using a saved location."
    ],
    "guide": "/docs/pebble/chmu-weather/",
    "setupGuide": "/docs/pebble/chmu-weather/",
    "helpGuide": "/docs/pebble/chmu-weather/#if-weather-is-missing",
    "developerNote": "The public plugin uses public \u010cHM\u00da data and optional Open-Meteo fields. It has no watch binary. Personal builds are excluded.",
    "image": "/images/projects/chmu-weather-1.0.2.png",
    "imageVersion": "1.0.2",
    "previewType": "icon",
    "imageAlt": "\u010cHM\u00da Weather\u2019s original sun, cloud and rain icon.",
    "imageCaption": "Original plugin icon \u00b7 no watch interface",
    "previousRelease": {
      "version": "1.0.1",
      "tag": "v1.0.1",
      "download": "https://github.com/xefensor/pebble-chmu-weather/releases/download/v1.0.1/CHMU-Weather-1.0.1.pbw"
    },
    "publication": "preview",
    "supportUrl": "/projects/chmu-weather/support/",
    "privacyUrl": "/projects/chmu-weather/privacy/",
    "watchPlatforms": [],
    "uuid": "00866104-6ce5-4ae3-952f-9800f437442c",
    "artifactSha256": "09a9bc6e11368a9bf536eebc4bbe644b15945cd71f27c0c02e255be9c3153039"
  },
  {
    "slug": "activities",
    "availability": "available",
    "consumers": [
      "dynamic",
      "halftone",
      "dashboard",
      "timer",
      "open-activity"
    ],
    "name": "Activities",
    "kind": "library",
    "description": "Publish activity content. Let each consuming app choose its layout.",
    "version": "0.4.4",
    "repo": "https://github.com/xefensor/pebble-lib-activities",
    "tag": "v0.4.4",
    "licence": {
      "name": "PolyForm Noncommercial 1.0.0",
      "url": "https://github.com/xefensor/pebble-lib-activities/blob/v0.4.4/LICENSE"
    },
    "download": "https://github.com/xefensor/pebble-lib-activities/releases/download/v0.4.4/pebble-activities-0.4.4.tgz",
    "guide": "/docs/develop/activities/",
    "summary": "An embedded developer library and provider convention for ongoing activities on stock PebbleOS. New providers publish schema 4 standard or media summaries; hosts own placement, priority and rendering.",
    "features": [
      "Typed text, measurements, countdowns, elapsed time and media",
      "Optional app destinations and contextual action descriptors",
      "Original source identity, observation and validity preserved"
    ],
    "platform": "PebbleOS",
    "status": "Development prerelease"
  },
  {
    "slug": "core",
    "availability": "available",
    "consumers": [
      "dynamic",
      "halftone",
      "dashboard"
    ],
    "name": "Core",
    "kind": "library",
    "description": "Shared readings and transport for Pebble watchface developers.",
    "version": "0.5.2",
    "repo": "https://github.com/xefensor/pebble-lib-core",
    "tag": "v0.5.2",
    "licence": {
      "name": "PolyForm Noncommercial 1.0.0",
      "url": "https://github.com/xefensor/pebble-lib-core/blob/v0.5.2/LICENSE"
    },
    "download": "https://github.com/xefensor/pebble-lib-core/releases/download/v0.5.2/pebble-watchface-core-0.5.2.tgz",
    "guide": "/docs/develop/core/",
    "summary": "A versioned library for selected readings, bounded state and shared phone-to-watch transport. The consuming watchface keeps ownership of its layout, Pebble services, permissions and release.",
    "features": [
      "Integration with the first two global reading choices",
      "A shared message queue and bounded native packet decoding",
      "Readings-only integration alongside compatible legacy APIs"
    ],
    "platform": "PebbleOS",
    "status": "Published library"
  }
];

export const consumerProjects = projects.filter(p => p.kind !== "library" && p.availability !== "planned");
export const launchPreview = consumerProjects.some(p => p.publication !== "published");
