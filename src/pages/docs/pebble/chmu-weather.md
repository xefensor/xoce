---
layout: ../../../layouts/DocLayout.astro
title: Set up ČHMÚ Weather
description: Add an optional Czech weather source to Pebble Weather and compatible watchface readings.
section: For users
order: 4
---

[ČHMÚ Weather](/projects/chmu-weather/) is an **unofficial weather plugin by Xef**. It runs inside the official Pebble phone app and supplies data to Pebble Weather and compatible watchfaces and apps. It has no watch screen of its own.

This guide covers the public **1.0.1** release. It uses public ČHMÚ station observations and ALADIN forecasts, with optional Open-Meteo completion. Coverage is for **Czech locations**; nearby stations do not measure your exact street.

## Install the phone plugin

1. Install and update the [official Pebble phone app](https://repebble.com/app). Enable **Settings → Plugins → Plugins/permissions preview** if needed.
2. Download the public **ČHMÚ Weather 1.0.1** `.pbw` from its [product page](/projects/chmu-weather/).
3. Open the file with the Pebble phone app. On Android, use the download’s **Open with / Share** menu if necessary. On iPhone, open it from Files and choose Pebble in the share sheet. The plugin is installed in the phone app, not as an app in the watch’s launcher.
4. Allow the plugin’s required location and internet access through Pebble’s permission prompts.
5. Find **ČHMÚ Weather** in the Pebble phone app’s Plugins tab and open its settings.

There is no API key, separate Android application or weather-service account to create. This is the public plugin, not the separately labelled **ČHMÚ Weather Personal** build.

## Use it in Pebble Weather

Open **Settings → Weather → Weather provider → ČHMÚ Weather** in the Pebble phone app. It uses your saved weather locations and units.

This supplies the watch’s Weather app, weather Timeline information and watchfaces that use Pebble’s weather data. The phone app controls when native Weather updates arrive; selecting a provider does not force an immediate refresh on the watch.

## Use it in Dynamic, Halftone or Dashboard

- **Dynamic and Halftone:** choose the weather readings you want under **Settings → Plugins → Complications**, using slots 1–2. Pick ČHMÚ Weather as the source where the source picker offers that choice.
- **Dashboard:** open Dashboard’s phone settings and add a pinned reading from the weather source.

Start with temperature and precipitation probability. Configure the source first, then return to the watchface or app. You can use ČHMÚ with either watchface; installing the plugin does not select a watchface for you.

[Dynamic setup](/docs/pebble/setup/#dynamic) · [Halftone setup](/docs/pebble/halftone/) · [Dashboard setup](/docs/pebble/setup/#dashboard)

## Choose a station and forecast sources

In the plugin’s settings, inspect **Latest loaded readings** and leave station selection on Automatic or choose a nearby station. Refresh there to check the result and its measurement age. Automatic selection looks for a suitable station; a manually selected station stays fixed.

**Complete with Open-Meteo** is on by default. It adds missing fields, rain probabilities and later local forecast days, up to seven days when available. Turning it off disables Open-Meteo requests and use of its cached values. The separate public-build **UV source** choices are Open-Meteo or Off; Open-Meteo UV also requires completion to be enabled.

Fresh station observations and forecasts are different. A direct reading marked `~` is a forecast, not a station measurement. UV is a forecast too. Some source details and estimate markers may not survive Pebble’s native Weather integration.

## If weather is missing

1. Check that the plugin is installed, enabled and has the required permissions.
2. Check the saved weather location and the plugin’s coverage or error message. A suitable Czech station and forecast town need to be nearby.
3. Refresh in the plugin’s settings and inspect the last reading’s timestamp and source status.
4. Confirm the correct weather provider or complication source is selected, then check the watch’s phone connection.

Weather-service failures, missing observations and Pebble’s import schedule can delay updates. Refreshing an old measurement does not make the observation newer. The native Weather integration may fall back for a location it cannot use.

## Sources and privacy

Weather data comes from **Český hydrometeorologický ústav (ČHMÚ)** and, when enabled, **Open-Meteo**, with their applicable attribution terms. The plugin is independent of those providers and Core Devices. It has no ads, analytics or developer-operated server.

The public release excludes ČHMÚ’s authenticated mobile-app service. [Privacy information](https://github.com/xefensor/pebble-chmu-weather/blob/v1.0.1/PRIVACY.md) and [third-party notices](https://github.com/xefensor/pebble-chmu-weather/blob/v1.0.1/THIRD_PARTY.md) describe its data sources and requests.

[Download ČHMÚ Weather](/projects/chmu-weather/) · [Choose your XOCE apps](/docs/#choose-what-you-need)
