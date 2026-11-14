---
layout: ../../../layouts/DocLayout.astro
title: Set up ČHMÚ Weather
description: Add an optional Czech weather source to Pebble Weather and compatible watchface readings.
section: For users
order: 4
setupProducts: [chmu-weather]
---

[ČHMÚ Weather](/projects/chmu-weather/) is an **unofficial weather plugin by Xef**. It runs inside the official Pebble phone app and supplies data to Pebble Weather and compatible watchfaces and apps. It has no watch screen of its own.

Use the guide build and installation status listed above. ČHMÚ Weather uses public ČHMÚ station observations and ALADIN forecasts, with optional Open-Meteo completion. Coverage is for **Czech locations**; nearby stations do not measure your exact street.

## Install the phone plugin

1. Install and update the [official Pebble phone app](https://repebble.com/app), then pair your watch. Enable **Settings → Plugins → Plugins / permissions preview** if needed. Phone-app labels can vary by version.
2. Check the available installation method on the [product page](/projects/chmu-weather/). Use its Store link when available, or open the matching `.pbw` with Pebble. On Android, use **Open with / Share** if necessary. On iPhone, open the file from Files and choose Pebble in the share sheet.
3. In Pebble’s **Settings → Weather**, add at least one Czech weather location and choose your units. A fixed saved location works without GPS; **Current location** needs Location permission.
4. Allow the required Internet access to public ČHMÚ data. Backup observations and Open-Meteo have optional network permissions; allow Open-Meteo if you want its extra forecast fields. Pebble handles these permission prompts.
5. Find **ČHMÚ Weather** in the phone app’s **Plugins** tab and open its settings. Under **Latest loaded readings**, select **Refresh data**.

**Check:** the plugin settings show a connected status and a card for your weather location. Inspect its temperature, source and observation age. A **Measured**, **Forecast estimate** or **Unavailable** badge explains what is loaded. The plugin does not add an app to the watch’s launcher.

There is no API key, separate Android application or weather-service account to create. This is the public plugin, not the separately labelled **ČHMÚ Weather Personal** build.

## Use it in Pebble Weather

To use it for Pebble’s built-in weather, open **Settings → Weather → Weather provider → ČHMÚ Weather** in the phone app. It uses the saved weather locations and units you configured above.

This supplies the watch’s Weather app, weather Timeline information and watchfaces that use Pebble’s weather data. The phone app controls when native Weather updates arrive; selecting a provider does not force an immediate refresh on the watch.

**Check:** the plugin’s location card has usable data, the provider is selected and the watch is connected. If the phone settings have updated but the watch has not, check Pebble’s Weather integration before changing station settings.

## Use it in Dynamic, Halftone or Dashboard

- **Dynamic:** open **Settings → Plugins → Complications** in the Pebble phone app. Choose readings for slots **1–2**, or **1–4** for **Four when idle**. Shake switching can also use slot **5**. Pick ČHMÚ Weather where the source picker offers that choice.
- **Halftone:** choose its readings in the same Complications settings, using slots **1–2**. These shared choices can affect other watchfaces too.
- **Dashboard:** open Dashboard’s phone settings and add a pinned reading from the weather source.

Start with **temperature**. Once that appears, add other readings you want. Precipitation probability needs Open-Meteo completion. A watchface that offers a direct source picker can select ČHMÚ Weather there; this is separate from choosing Pebble’s built-in Weather provider.

**Check:** return to your chosen watchface or Dashboard and confirm the selected reading appears. Weather readings are configured separately from Timer-style Activities. Installing ČHMÚ Weather does not select a watchface for you.

[Dynamic setup](/docs/pebble/setup/#dynamic) · [Halftone setup](/docs/pebble/halftone/) · [Dashboard setup](/docs/pebble/setup/#dashboard)

## Choose a station and forecast sources

In **Latest loaded readings**, open the location card’s **Temperature station** selector. Leave it on **Automatic nearby station**, or choose an eligible nearby station. A manual station remains fixed for that weather location; it does not change the location saved in Pebble.

Settings **save automatically**. After changing a station or forecast source, select **Refresh data** to inspect the new result. There is no separate Save button. Expand the location’s **Source details** for station selection, measurement time and age, and the sources of individual fields.

Under **Forecast sources**, **Complete with Open-Meteo** is on by default. It adds missing fields, rain probabilities and later local forecast days, up to seven days when available. Turning it off stops Open-Meteo requests and excludes its cached values. Weather already stored by Pebble or another watchface is not retracted.

The public-build **UV source** choices are **Open-Meteo** and **Hide UV**. Open-Meteo UV also requires completion to remain enabled. **How these sources work** explains the forecast sources; it is separate from each location’s **Source details**.

Fresh station observations and forecasts are different. A direct reading marked `~` is a forecast, not a station measurement. UV is a forecast too. Some source details and estimate markers may not survive Pebble’s native Weather integration.

## If weather is missing

1. Check that ČHMÚ Weather appears in the phone app’s Plugins tab and has the required permissions. Open its settings from Pebble; opening the settings HTML in a regular browser does not connect it to the plugin.
2. If no location card appears, check the saved weather locations in Pebble. For a fixed location, confirm the selected place; for Current location, check Location permission.
3. Select **Refresh data**, then inspect the location’s badge and **Source details**. A supported Czech forecast town must be nearby; station measurements also need a suitable station. A manually selected station can become unavailable for the current location; try **Automatic nearby station**.
4. If temperature works but rain probability, UV or later forecast days are missing, check **Complete with Open-Meteo**, its network permission and **UV source**. Choosing Open-Meteo UV does not enable completion automatically.
5. If the plugin settings show usable data but the watch does not, confirm the intended Weather provider or Complications source, then check the watch’s phone connection. These are separate output paths.

Weather-service failures, missing observations and Pebble’s import schedule can delay updates. Refreshing an old measurement does not make the observation newer. The native Weather integration may fall back for a location it cannot use.

## Sources and privacy

Weather data comes from **Český hydrometeorologický ústav (ČHMÚ)** and, when enabled, **Open-Meteo**, with their applicable attribution terms. The plugin is independent of those providers and Core Devices. It has no ads, analytics or developer-operated server.

The public release excludes ČHMÚ’s authenticated mobile-app service. [Privacy information](/projects/chmu-weather/privacy/) and [third-party notices](https://github.com/xefensor/pebble-chmu-weather/blob/main/THIRD_PARTY.md) describe its data sources and requests.

[Download ČHMÚ Weather](/projects/chmu-weather/) · [Choose your XOCE apps](/docs/#choose-what-you-need)
