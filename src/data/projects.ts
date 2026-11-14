export type WatchPlatform = 'emery' | 'gabbro';
export type Project = {
  storeArtwork?: { mark: string; shareImage: string };
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
  showcase?: { title: string; text: string; image: string };
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
    "status": "Planned · working name",
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
    "status": "Planned · working name",
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
      "Shared readings and activities need the Pebble phone app’s plugin support and a connected phone.",
      "Built-in Music and Notifications activities need an Android phone."
    ],
    "availability": "available",
    "compatibility": "Pebble Time 2 and Round 2",
    "previewType": "watch",
    "developerGuide": "/docs/develop/activities/",
    "developerNote": "A watchface that displays compatible activities; providers supply content while Dynamic owns placement and priority.",
    "name": "Dynamic",
    "kind": "watchface",
    "description": "A clock that makes room for your day.",
    "version": "1.0.2",
    "repo": "https://github.com/xefensor/pebble-watchface-dynamic",
    "licence": {
      "name": "PolyForm Noncommercial 1.0.0",
      "url": "https://github.com/xefensor/pebble-watchface-dynamic/blob/main/LICENSE"
    },
    "guide": "/docs/pebble/setup/#dynamic",
    "summary": "Choose an everyday clock layout with two readings, stacked rows, or four when idle. Keep your selected pair when music, a countdown or Timeline Peek needs the space.",
    "showcase": {
      "title": "Choose the space your readings need.",
      "text": "Four when idle adds a compact 2×2 grid. Activities and Timeline Peek keep the selected pair. Layout, colours and Activities have their own phone-settings screens, with an example preview and one Save action.",
      "image": "/images/screenshots/dynamic-1.0.1-demo-20261114-emery-four-split.png"
    },
    "features": [
      "Choose Columns, Stacked rows or Four when idle",
      "Split clock and detail colours; hide optional titles or enable shake switching",
      "Keep complete percentages and required qualifiers together",
      "Arrange music, Timer and optional notifications in your preferred order"
    ],
    "image": "/images/screenshots/dynamic-1.0.1-demo-20261114-emery-four-split.png",
    "imageVersion": "1.0.1",
    "imageAlt": "Dynamic, Time 2: split clock and four readings while idle.",
    "platform": "PebbleOS",
    "status": "Published in Pebble Store",
    "previousRelease": {
      "version": "0.18.3",
      "tag": "v0.18.3",
      "download": "https://github.com/xefensor/pebble-watchface-dynamic/releases/download/v0.18.3/Dynamic-0.18.3.pbw"
    },
    "publication": "published",
    "supportUrl": "/projects/dynamic/support/",
    "privacyUrl": "/projects/dynamic/privacy/",
    "watchPlatforms": [
      "emery",
      "gabbro"
    ],
    "previews": {
      "emery": {
        "image": "/images/screenshots/dynamic-1.0.1-demo-20261114-emery-four-split.png",
        "alt": "Dynamic, Time 2: split clock and four readings while idle."
      },
      "gabbro": {
        "image": "/images/screenshots/dynamic-1.0.1-demo-20261114-gabbro-four-split.png",
        "alt": "Dynamic, Round 2: split clock and four readings while idle."
      }
    },
    "uuid": "cc1281f1-3b4d-45b5-b235-6881b1fd8fbd",
    "artifactSha256": "4abb6fcc9197f60d0f69e235030043a09ef03629336e6c59c1e6b35e5eb915ca",
    "storeArtwork": {
      "mark": "/images/store/dynamic-xoce-icons-20261114-mark.svg",
      "shareImage": "/images/store/dynamic-xoce-screenshots-20261114-banner-emery.png"
    },
    "storeUrl": "https://apps.repebble.com/5db601a9303a4eb7baa90331",
    "tag": "v1.0.2",
    "download": "https://github.com/xefensor/pebble-watchface-dynamic/releases/download/v1.0.2/Dynamic-1.0.2.pbw"
  },
  {
    "slug": "dashboard",
    "setupGuide": "/docs/pebble/setup/",
    "controlsGuide": "/docs/pebble/controls/#dashboard",
    "helpGuide": "/docs/pebble/troubleshooting/#settings-seem-not-to-save",
    "requirements": [
      "Shared readings and activities need the Pebble phone app’s plugin support and a connected phone.",
      "Built-in Music and Notifications activities need an Android phone."
    ],
    "availability": "available",
    "compatibility": "Pebble Time 2 and Round 2",
    "previewType": "watch",
    "developerGuide": "/docs/develop/activities/#app-opening-and-actions",
    "developerNote": "An interactive activity host. Controls depend on the bound source; Timer Pause/Resume is not implemented.",
    "name": "Dashboard",
    "kind": "app",
    "description": "Your activity, notifications and pins. One overview.",
    "version": "1.0.2",
    "repo": "https://github.com/xefensor/pebble-app-dashboard",
    "licence": {
      "name": "PolyForm Noncommercial 1.0.0",
      "url": "https://github.com/xefensor/pebble-app-dashboard/blob/main/LICENSE"
    },
    "guide": "/docs/pebble/setup/#dashboard",
    "summary": "Open Dashboard for a quick look at a current activity, the latest available notification and two pinned items. Add the readings and shortcuts you find useful, then browse the full collections when you need more.",
    "showcase": {
      "title": "Your overview, one button away.",
      "text": "See a current activity, an optional notification and your chosen pins together. Open Dashboard when you want more room for the details.",
      "image": "/images/screenshots/dashboard-1.0.1-demo-20261114-gabbro-overview.png"
    },
    "features": [
      "Keep an activity, a notification and two pins in one overview",
      "Open collections and use the controls a source provides",
      "Choose readings, actions and app shortcuts for your pins"
    ],
    "image": "/images/screenshots/dashboard-1.0.1-demo-20261114-emery-overview.png",
    "imageVersion": "1.0.1",
    "imageAlt": "Dashboard, Time 2: overview.",
    "platform": "PebbleOS",
    "status": "Published in Pebble Store",
    "previousRelease": {
      "version": "0.6.3",
      "tag": "v0.6.3",
      "download": "https://github.com/xefensor/pebble-app-dashboard/releases/download/v0.6.3/Dashboard-0.6.3.pbw"
    },
    "publication": "published",
    "supportUrl": "/projects/dashboard/support/",
    "privacyUrl": "/projects/dashboard/privacy/",
    "watchPlatforms": [
      "emery",
      "gabbro"
    ],
    "previews": {
      "emery": {
        "image": "/images/screenshots/dashboard-1.0.1-demo-20261114-emery-overview.png",
        "alt": "Dashboard, Time 2: overview."
      },
      "gabbro": {
        "image": "/images/screenshots/dashboard-1.0.1-demo-20261114-gabbro-overview.png",
        "alt": "Dashboard, Round 2: overview."
      }
    },
    "uuid": "f76f9fc1-2944-4248-bcc5-3eea2af0183b",
    "artifactSha256": "98e0c2098f769a6963b26a2f7003953aecf44a7a8c95ad76ef059d2776f63b72",
    "storeArtwork": {
      "mark": "/images/store/dashboard-xoce-icons-20261114-mark.svg",
      "shareImage": "/images/store/dashboard-xoce-screenshots-20261114-banner-emery.png"
    },
    "storeUrl": "https://apps.repebble.com/603d814e961c40308c98ce63",
    "tag": "v1.0.2",
    "download": "https://github.com/xefensor/pebble-app-dashboard/releases/download/v1.0.2/Dashboard-1.0.2.pbw"
  },
  {
    "slug": "timer",
    "setupGuide": "/docs/pebble/setup/",
    "controlsGuide": "/docs/pebble/controls/#timer",
    "helpGuide": "/docs/pebble/troubleshooting/#timer-reports-alarm-not-set-keep-open",
    "requirements": [
      "Sharing needs the Pebble phone app’s plugin support and a connected phone. Timer’s successfully scheduled alarms work on the watch without the phone."
    ],
    "availability": "available",
    "compatibility": "Pebble Time 2 and Round 2",
    "previewType": "watch",
    "developerGuide": "/docs/develop/activities/",
    "developerNote": "Timer owns native countdowns and alarms. Its bundled provider shares summaries with compatible activity hosts.",
    "name": "Timer",
    "kind": "app",
    "description": "Set a timer. Keep it ready for next time.",
    "version": "1.0.3",
    "repo": "https://github.com/xefensor/pebble-app-timer",
    "licence": {
      "name": "PolyForm Noncommercial 1.0.0",
      "url": "https://github.com/xefensor/pebble-app-timer/blob/main/LICENSE"
    },
    "guide": "/docs/pebble/controls/#timer",
    "summary": "Manage up to eight timers with the watch buttons. Pause, resume or reuse a saved duration. The watch keeps the countdown and handles its alarm; sharing it with a watchface is optional.",
    "showcase": {
      "title": "Set it once. Use it again.",
      "text": "Set hours, minutes and seconds with the watch buttons. Your timers stay ready for reuse. Finished countdowns can sound on Time 2 when enabled, alongside vibration; Round 2 uses vibration. Sound respects system mute and Quiet Time.",
      "image": "/images/screenshots/timer-1.0.2-demo-20261114-gabbro-running.png"
    },
    "features": [
      "Keep up to eight timers, from five seconds to 24 hours",
      "Pause, resume, reset or snooze on the watch",
      "Use optional sound and vibration on Time 2; vibration on Round 2",
      "Share the countdown with Dynamic, Halftone or Dashboard through your connected phone"
    ],
    "image": "/images/screenshots/timer-1.0.2-demo-20261114-emery-running.png",
    "imageVersion": "1.0.2",
    "imageAlt": "Timer, Time 2: running countdown.",
    "platform": "PebbleOS",
    "status": "Published in Pebble Store",
    "previousRelease": {
      "version": "0.14.5",
      "tag": "v0.14.5",
      "download": "https://github.com/xefensor/pebble-app-timer/releases/download/v0.14.5/Timer-0.14.5.pbw"
    },
    "publication": "published",
    "supportUrl": "/projects/timer/support/",
    "privacyUrl": "/projects/timer/privacy/",
    "watchPlatforms": [
      "emery",
      "gabbro"
    ],
    "previews": {
      "emery": {
        "image": "/images/screenshots/timer-1.0.2-demo-20261114-emery-running.png",
        "alt": "Timer, Time 2: running countdown."
      },
      "gabbro": {
        "image": "/images/screenshots/timer-1.0.2-demo-20261114-gabbro-running.png",
        "alt": "Timer, Round 2: running countdown."
      }
    },
    "uuid": "50e9ef12-a5ab-4369-a3b5-3447bfba5151",
    "artifactSha256": "33bc8ee06bbcc084a70d133a6f126bc4bcb0b90f3e46f5823dc78ea5b38171f6",
    "storeArtwork": {
      "mark": "/images/store/timer-xoce-icons-20261114-mark.svg",
      "shareImage": "/images/store/timer-xoce-screenshots-20261114-banner-emery.png"
    },
    "storeUrl": "https://apps.repebble.com/2f8f8cfd4e7e442fb724dac7",
    "tag": "v1.0.3",
    "download": "https://github.com/xefensor/pebble-app-timer/releases/download/v1.0.3/Timer-1.0.3.pbw"
  },
  {
    "slug": "open-activity",
    "setupGuide": "/docs/pebble/setup/",
    "controlsGuide": "/docs/pebble/controls/#open-activity",
    "helpGuide": "/docs/pebble/troubleshooting/#open-activity-immediately-closes",
    "requirements": [
      "Needs either Dynamic or Halftone as its source watchface.",
      "Needs the Pebble phone app’s plugin support, a connected phone and Launch Apps permission.",
      "Choose matching shortcuts in Open Activity and the phone’s Quick Launch settings."
    ],
    "availability": "available",
    "compatibility": "Pebble Time 2 and Round 2",
    "previewType": "watch",
    "developerGuide": "/docs/develop/activities/#app-opening-and-actions",
    "developerNote": "Uses Dynamic’s recent displayed destinations. Opens the associated app without selecting a particular item inside it.",
    "requires": [],
    "name": "Open Activity",
    "kind": "app",
    "description": "From the activity you see to the app behind it.",
    "version": "1.0.2",
    "repo": "https://github.com/xefensor/pebble-app-open-activity",
    "licence": {
      "name": "PolyForm Noncommercial 1.0.0",
      "url": "https://github.com/xefensor/pebble-app-open-activity/blob/main/LICENSE"
    },
    "guide": "/docs/pebble/setup/#open-activity",
    "summary": "See a countdown on Dynamic or Halftone, then use a configured Quick Launch button shortcut to open Timer. Open Activity follows the activity displayed by your chosen watchface.",
    "showcase": {
      "title": "Choose what your shortcut follows.",
      "text": "Pick Dynamic or Halftone, then its large Primary activity or smaller Secondary row. Match the shortcut in Pebble’s Quick Launch settings. Opening Open Activity from the app list brings you to setup.",
      "image": "/images/screenshots/open-activity-1.0.1-emery-activities-setup.png"
    },
    "features": [
      "Choose Dynamic or Halftone as the source watchface",
      "Assign different shortcuts to primary and secondary activities",
      "Open from the app list for setup; use Quick Launch to open an activity"
    ],
    "image": "/images/screenshots/open-activity-1.0.1-emery-activities-setup.png",
    "imageVersion": "1.0.0",
    "imageAlt": "Open Activity, Time 2: activities and shortcut setup.",
    "platform": "PebbleOS",
    "status": "Published in Pebble Store",
    "previousRelease": {
      "version": "0.3.3",
      "tag": "v0.3.3",
      "download": "https://github.com/xefensor/pebble-app-open-activity/releases/download/v0.3.3/Open-Activity-0.3.3.pbw"
    },
    "publication": "published",
    "supportUrl": "/projects/open-activity/support/",
    "privacyUrl": "/projects/open-activity/privacy/",
    "watchPlatforms": [
      "emery",
      "gabbro"
    ],
    "previews": {
      "emery": {
        "image": "/images/screenshots/open-activity-1.0.1-emery-activities-setup.png",
        "alt": "Open Activity, Time 2: activities and shortcut setup."
      },
      "gabbro": {
        "image": "/images/screenshots/open-activity-1.0.1-gabbro-activities-setup.png",
        "alt": "Open Activity, Round 2: activities and shortcut setup."
      }
    },
    "optionalConnections": [
      "dynamic",
      "halftone"
    ],
    "uuid": "d2d0bf48-cf4c-42f6-8b5f-3657fb2de4e9",
    "artifactSha256": "bcf32d22f9f9cb3227e2070b763b514ea7202ae503455311ee5b8de1ee98d301",
    "storeArtwork": {
      "mark": "/images/store/open-activity-xoce-icons-20261114-mark.svg",
      "shareImage": "/images/store/open-activity-xoce-screenshots-20261114-banner-emery.png"
    },
    "storeUrl": "https://apps.repebble.com/59af0a59f7a34cb09a79bcbe",
    "tag": "v1.0.2",
    "download": "https://github.com/xefensor/pebble-app-open-activity/releases/download/v1.0.2/Open-Activity-1.0.2.pbw"
  },
  {
    "slug": "halftone",
    "name": "Halftone",
    "kind": "watchface",
    "availability": "available",
    "platform": "PebbleOS",
    "compatibility": "Pebble Time 2 and Round 2",
    "status": "Published in Pebble Store",
    "version": "1.10.3",
    "repo": "https://github.com/xefensor/halftone-watchface",
    "licence": {
      "name": "PolyForm Noncommercial 1.0.0",
      "url": "https://github.com/xefensor/halftone-watchface/blob/main/LICENSE"
    },
    "description": "A bold clock. A border with depth.",
    "summary": "A Fira clock, a distinctive dot border and two readings beneath the time. Make it yours with colour, Bigger Text, depth and shadow, with space below for ongoing updates.",
    "showcase": {
      "title": "A clock with its own character.",
      "text": "Choose the colours and depth that suit you. Weather or other readings keep their place beneath the clock, above your chosen activities and Timeline Peek.",
      "image": "/images/screenshots/halftone-1.10.2-demo-20261114-gabbro-orange.png"
    },
    "features": [
      "Choose colours, Bigger Text, depth and shadow around the dot border",
      "Keep weather or other readings above your chosen activities",
      "Follow timers, music and optional notifications; use Open Activity for shortcuts"
    ],
    "requirements": [
      "Shared readings and activities need the Pebble phone app’s plugin support and a connected phone.",
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
    "image": "/images/screenshots/halftone-1.10.2-demo-20261114-emery-orange.png",
    "imageVersion": "1.10.2",
    "imageAlt": "Halftone, Time 2: orange clock with two weather locations.",
    "previousRelease": {
      "version": "1.9.0-rc.6",
      "tag": "v1.9.0-rc.6",
      "download": "https://github.com/xefensor/halftone-watchface/releases/download/v1.9.0-rc.6/Halftone-1.9.0-rc.6.pbw"
    },
    "publication": "published",
    "supportUrl": "/projects/halftone/support/",
    "privacyUrl": "/projects/halftone/privacy/",
    "watchPlatforms": [
      "emery",
      "gabbro"
    ],
    "previews": {
      "emery": {
        "image": "/images/screenshots/halftone-1.10.2-demo-20261114-emery-orange.png",
        "alt": "Halftone, Time 2: orange clock with two readings."
      },
      "gabbro": {
        "image": "/images/screenshots/halftone-1.10.2-demo-20261114-gabbro-orange.png",
        "alt": "Halftone, Round 2: orange clock with two readings."
      }
    },
    "uuid": "d4dd5046-53be-4624-99e8-46e0b377fe66",
    "artifactSha256": "199fdad4a20a885f66216075ed07bd336b86fe50c574413f8a5f89a3fc086a9d",
    "storeArtwork": {
      "mark": "/images/store/halftone-xoce-icons-20261114-mark.svg",
      "shareImage": "/images/store/halftone-xoce-screenshots-20261114-banner-emery.png"
    },
    "storeUrl": "https://apps.repebble.com/48d7f4eab704414c8bc1fa7e",
    "tag": "v1.10.3",
    "download": "https://github.com/xefensor/halftone-watchface/releases/download/v1.10.3/Halftone-1.10.3.pbw"
  },
  {
    "slug": "chmu-weather",
    "name": "ČHMÚ Weather",
    "kind": "plugin",
    "availability": "available",
    "platform": "PebbleOS",
    "compatibility": "Pebble phone app with plugins · Czech weather locations",
    "status": "Published in Pebble Store",
    "version": "1.0.4",
    "repo": "https://github.com/xefensor/pebble-chmu-weather",
    "licence": {
      "name": "PolyForm Noncommercial 1.0.0",
      "url": "https://github.com/xefensor/pebble-chmu-weather/blob/main/LICENSE"
    },
    "description": "Czech observations. Local forecasts. On your Pebble.",
    "summary": "An unofficial weather provider inside the Pebble phone app. Get nearby ČHMÚ station observations and ALADIN forecasts in Pebble Weather and compatible readings. Open-Meteo completion adds missing fields and later forecast days; it starts enabled and can be turned off.",
    "showcase": {
      "title": "Choose where your weather comes from.",
      "text": "Let the plugin find a nearby station or choose a fixed Czech station. Follow the locations and units saved in Pebble, and decide whether to add Open-Meteo forecast information.",
      "image": "/images/screenshots/chmu-weather-1.0.4-final-phone-settings.png"
    },
    "features": [
      "Use automatic nearby station selection or choose a fixed Czech station",
      "Feed Pebble Weather and compatible watchface readings without an API key",
      "Use Open-Meteo completion for rain probabilities, forecast UV and later forecast days; turn it off in settings if preferred"
    ],
    "requirements": [
      "Enable Plugins / permissions preview in the official Pebble phone app.",
      "Czech coverage. Internet access is required for public observations; GPS is optional when using a saved location."
    ],
    "guide": "/docs/pebble/chmu-weather/",
    "setupGuide": "/docs/pebble/chmu-weather/",
    "helpGuide": "/docs/pebble/chmu-weather/#if-weather-is-missing",
    "developerNote": "The public plugin uses public ČHMÚ data and optional Open-Meteo fields. It has no watch binary. Personal builds are excluded.",
    "image": "/images/store/chmu-weather-xoce-icons-20261114-mark.svg",
    "imageVersion": "1.0.3",
    "previewType": "icon",
    "imageAlt": "Original XOCE ČHMÚ Weather cloud-and-sun mark; unofficial phone plugin.",
    "imageCaption": "Original plugin icon · no watch interface",
    "previousRelease": {
      "version": "1.0.1",
      "tag": "v1.0.1",
      "download": "https://github.com/xefensor/pebble-chmu-weather/releases/download/v1.0.1/CHMU-Weather-1.0.1.pbw"
    },
    "publication": "published",
    "supportUrl": "/projects/chmu-weather/support/",
    "privacyUrl": "/projects/chmu-weather/privacy/",
    "watchPlatforms": [],
    "uuid": "00866104-6ce5-4ae3-952f-9800f437442c",
    "artifactSha256": "6c57e1191d470cd720e4989b5b1c677747c00fab267c60601f0bc24af8d9af5b",
    "storeArtwork": {
      "mark": "/images/store/chmu-weather-xoce-icons-20261114-mark.svg",
      "shareImage": "/images/store/chmu-weather-xoce-screenshots-20261114-banner-phone.png"
    },
    "storeUrl": "https://apps.repebble.com/ef7111ffaeaf4593aaaa85ed",
    "tag": "v1.0.4",
    "download": "https://github.com/xefensor/pebble-chmu-weather/releases/download/v1.0.4/CHMU-Weather-1.0.4.pbw"
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
