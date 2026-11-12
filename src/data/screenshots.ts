export type Screenshot = { image: string; title: string; caption: string; alt: string; kind: 'watch' | 'phone'; version: string; width: number; height: number; source: string };

export const screenshotGalleries: Record<string, Screenshot[]> = {
  "dashboard": [
    {
      "image": "/images/screenshots/dashboard-0.6.3-snapshot-dark.png",
      "title": "Your activity overview",
      "caption": "A sample Tea timer, Signal notification, temperature and Kitchen pin. Plugin content depends on your setup.",
      "alt": "Dashboard 0.6.3: Your activity overview. A sample Tea timer, Signal notification, temperature and Kitchen pin. Plugin content depends on your setup.",
      "kind": "watch",
      "version": "0.6.3",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-app-dashboard/blob/v0.6.3/docs/qa/0.6.3/snapshot-dark.png"
    },
    {
      "image": "/images/screenshots/dashboard-0.6.3-confirmation-light.png",
      "title": "Confirm an action",
      "caption": "The confirmation screen for an example Find phone action.",
      "alt": "Dashboard 0.6.3: Confirm an action. The confirmation screen for an example Find phone action.",
      "kind": "watch",
      "version": "0.6.3",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-app-dashboard/blob/v0.6.3/docs/qa/0.6.3/confirmation-light.png"
    }
  ],
  "timer": [
    {
      "image": "/images/screenshots/timer-0.14.5-one-timer-light.png",
      "title": "Running countdown · light",
      "caption": "One running ten-minute timer, with a progress marker and watch-button controls.",
      "alt": "Timer 0.14.5: Running countdown · light. One running ten-minute timer, with a progress marker and watch-button controls.",
      "kind": "watch",
      "version": "0.14.5",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-app-timer/blob/v0.14.5/docs/qa/0.14.5/one-timer-light.png"
    },
    {
      "image": "/images/screenshots/timer-0.14.5-one-timer-dark.png",
      "title": "Running countdown · dark",
      "caption": "The same countdown in the dark appearance.",
      "alt": "Timer 0.14.5: Running countdown · dark. The same countdown in the dark appearance.",
      "kind": "watch",
      "version": "0.14.5",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-app-timer/blob/v0.14.5/docs/qa/0.14.5/one-timer-dark.png"
    },
    {
      "image": "/images/screenshots/timer-0.14.5-value-up-settled.png",
      "title": "Edit the duration",
      "caption": "Hours, minutes and seconds are edited using the watch buttons.",
      "alt": "Timer 0.14.5: Edit the duration. Hours, minutes and seconds are edited using the watch buttons.",
      "kind": "watch",
      "version": "0.14.5",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-app-timer/blob/v0.14.5/docs/qa/0.14.5/value-up-settled.png"
    }
  ],
  "open-activity": [
    {
      "image": "/images/screenshots/open-activity-0.3.3-setup-phone-launch.png",
      "title": "First-time setup · light",
      "caption": "Open Activity directs you to its settings in the Pebble phone app.",
      "alt": "Open Activity 0.3.3: First-time setup · light. Open Activity directs you to its settings in the Pebble phone app.",
      "kind": "watch",
      "version": "0.3.3",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-app-open-activity/blob/v0.3.3/docs/qa/0.3.3/setup-phone-launch.png"
    },
    {
      "image": "/images/screenshots/open-activity-0.3.3-setup-dark-restored-before-phone.png",
      "title": "First-time setup · dark",
      "caption": "The setup screen with the saved dark appearance restored.",
      "alt": "Open Activity 0.3.3: First-time setup · dark. The setup screen with the saved dark appearance restored.",
      "kind": "watch",
      "version": "0.3.3",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-app-open-activity/blob/v0.3.3/docs/qa/0.3.3/setup-dark-restored-before-phone.png"
    }
  ],
  "halftone": [
    {
      "image": "/images/screenshots/halftone-1.9.0-rc.6-emery_01_orange.png",
      "title": "Orange clock",
      "caption": "The date, time and two example weather readings.",
      "alt": "Halftone 1.9.0-rc.6: Orange clock. The date, time and two example weather readings.",
      "kind": "watch",
      "version": "1.9.0-rc.6",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/halftone-watchface/blob/v1.9.0-rc.6/store/emery_01_orange.png"
    },
    {
      "image": "/images/screenshots/halftone-1.9.0-rc.6-emery_02_blue_large.png",
      "title": "Blue with a larger clock",
      "caption": "A larger time display with example temperature and humidity readings.",
      "alt": "Halftone 1.9.0-rc.6: Blue with a larger clock. A larger time display with example temperature and humidity readings.",
      "kind": "watch",
      "version": "1.9.0-rc.6",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/halftone-watchface/blob/v1.9.0-rc.6/store/emery_02_blue_large.png"
    },
    {
      "image": "/images/screenshots/halftone-1.9.0-rc.6-emery_03_green_shadow.png",
      "title": "Green with a clock shadow",
      "caption": "Another colour and clock treatment from the released watchface.",
      "alt": "Halftone 1.9.0-rc.6: Green with a clock shadow. Another colour and clock treatment from the released watchface.",
      "kind": "watch",
      "version": "1.9.0-rc.6",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/halftone-watchface/blob/v1.9.0-rc.6/store/emery_03_green_shadow.png"
    },
    {
      "image": "/images/screenshots/halftone-1.9.0-rc.6-emery_04_music.png",
      "title": "Music on the watchface",
      "caption": "Example artwork, song and artist beneath the clock and readings.",
      "alt": "Halftone 1.9.0-rc.6: Music on the watchface. Example artwork, song and artist beneath the clock and readings.",
      "kind": "watch",
      "version": "1.9.0-rc.6",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/halftone-watchface/blob/v1.9.0-rc.6/store/emery_04_music.png"
    },
    {
      "image": "/images/screenshots/halftone-1.9.0-rc.6-emery_05_notification.png",
      "title": "A notification preview",
      "caption": "An example Signal message beneath the time and readings.",
      "alt": "Halftone 1.9.0-rc.6: A notification preview. An example Signal message beneath the time and readings.",
      "kind": "watch",
      "version": "1.9.0-rc.6",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/halftone-watchface/blob/v1.9.0-rc.6/store/emery_05_notification.png"
    },
    {
      "image": "/images/screenshots/halftone-1.9.0-rc.6-settings-light.png",
      "title": "Settings · English, light",
      "caption": "Halftone’s released settings form, including appearance, readings, music and notifications.",
      "alt": "Halftone 1.9.0-rc.6: Settings · English, light. Halftone’s released settings form, including appearance, readings, music and notifications.",
      "kind": "phone",
      "version": "1.9.0-rc.6",
      "width": 390,
      "height": 1808,
      "source": "https://github.com/xefensor/halftone-watchface/blob/v1.9.0-rc.6/docs/images/settings-light.png"
    },
    {
      "image": "/images/screenshots/halftone-1.9.0-rc.6-settings-dark.png",
      "title": "Settings · Czech, dark",
      "caption": "The same settings page in Czech with its dark appearance.",
      "alt": "Halftone 1.9.0-rc.6: Settings · Czech, dark. The same settings page in Czech with its dark appearance.",
      "kind": "phone",
      "version": "1.9.0-rc.6",
      "width": 390,
      "height": 1827,
      "source": "https://github.com/xefensor/halftone-watchface/blob/v1.9.0-rc.6/docs/images/settings-dark.png"
    }
  ],
  "chmu-weather": [
    {
      "image": "/images/screenshots/chmu-1.0.1-settings-en-light.png",
      "title": "Weather settings · English",
      "caption": "Station selection, example readings, forecast sources and plugin options.",
      "alt": "Chmu Weather 1.0.1: Weather settings · English. Station selection, example readings, forecast sources and plugin options.",
      "kind": "phone",
      "version": "1.0.1",
      "width": 390,
      "height": 1748,
      "source": "https://github.com/xefensor/pebble-chmu-weather/blob/v1.0.1/docs/images/settings-en-light.png"
    },
    {
      "image": "/images/screenshots/chmu-1.0.1-settings-cs-dark.png",
      "title": "Weather settings · Czech",
      "caption": "The released configuration page in Czech with its dark appearance.",
      "alt": "Chmu Weather 1.0.1: Weather settings · Czech. The released configuration page in Czech with its dark appearance.",
      "kind": "phone",
      "version": "1.0.1",
      "width": 390,
      "height": 1820,
      "source": "https://github.com/xefensor/pebble-chmu-weather/blob/v1.0.1/docs/images/settings-cs-dark.png"
    }
  ],
  "dynamic": [
    {
      "image": "/images/screenshots/dynamic-0.18.3-idle-24-light.png",
      "title": "Everyday clock · light",
      "caption": "The large 24-hour clock with two example weather readings.",
      "alt": "Dynamic 0.18.3: Everyday clock · light. The large 24-hour clock with two example weather readings.",
      "kind": "watch",
      "version": "0.18.3",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.18.3/dist/Dynamic-0.18.3.pbw"
    },
    {
      "image": "/images/screenshots/dynamic-0.18.3-idle-24-dark.png",
      "title": "Everyday clock · dark",
      "caption": "The same clock layout with a dark background.",
      "alt": "Dynamic 0.18.3: Everyday clock · dark. The same clock layout with a dark background.",
      "kind": "watch",
      "version": "0.18.3",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.18.3/dist/Dynamic-0.18.3.pbw"
    },
    {
      "image": "/images/screenshots/dynamic-0.18.3-music-24-light.png",
      "title": "Music · light",
      "caption": "The activity area shows a long example song title, artist and artwork.",
      "alt": "Dynamic 0.18.3: Music · light. The activity area shows a long example song title, artist and artwork.",
      "kind": "watch",
      "version": "0.18.3",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.18.3/dist/Dynamic-0.18.3.pbw"
    },
    {
      "image": "/images/screenshots/dynamic-0.18.3-music-24-dark.png",
      "title": "Music · dark",
      "caption": "The music activity with the dark appearance.",
      "alt": "Dynamic 0.18.3: Music · dark. The music activity with the dark appearance.",
      "kind": "watch",
      "version": "0.18.3",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.18.3/dist/Dynamic-0.18.3.pbw"
    },
    {
      "image": "/images/screenshots/dynamic-0.18.3-timer-24-light.png",
      "title": "Timer and music together",
      "caption": "A sample Tea countdown takes the main area while music stays in the compact row.",
      "alt": "Dynamic 0.18.3: Timer and music together. A sample Tea countdown takes the main area while music stays in the compact row.",
      "kind": "watch",
      "version": "0.18.3",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.18.3/dist/Dynamic-0.18.3.pbw"
    },
    {
      "image": "/images/screenshots/dynamic-0.18.3-notification-24-light.png",
      "title": "A message in the activity area",
      "caption": "An example Signal message appears alongside a compact music row.",
      "alt": "Dynamic 0.18.3: A message in the activity area. An example Signal message appears alongside a compact music row.",
      "kind": "watch",
      "version": "0.18.3",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.18.3/dist/Dynamic-0.18.3.pbw"
    },
    {
      "image": "/images/screenshots/dynamic-0.18.3-notification-summary-24-dark.png",
      "title": "Compact notification · dark",
      "caption": "A short message summary beneath the clock, weather and compact music row.",
      "alt": "Dynamic 0.18.3: Compact notification · dark. A short message summary beneath the clock, weather and compact music row.",
      "kind": "watch",
      "version": "0.18.3",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.18.3/dist/Dynamic-0.18.3.pbw"
    },
    {
      "image": "/images/screenshots/dynamic-0.18.3-idle-12-light.png",
      "title": "12-hour clock",
      "caption": "The alternative 12-hour time format in the everyday clock layout.",
      "alt": "Dynamic 0.18.3: 12-hour clock. The alternative 12-hour time format in the everyday clock layout.",
      "kind": "watch",
      "version": "0.18.3",
      "width": 200,
      "height": 228,
      "source": "https://github.com/xefensor/pebble-watchface-dynamic/blob/v0.18.3/dist/Dynamic-0.18.3.pbw"
    }
  ]
};
