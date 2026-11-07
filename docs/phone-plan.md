# Phone app plan and Pebble call integration

Recorded on 7 November 2026. Working direction for future development; no Phone
build or final interface exists, and the combined Android/Pebble flows have not
been tested on physical devices. Phone remains a working name.

Build an Android phone app that works independently, with a separately installed,
optional Pebble companion for call history, contacts, favourites and originating
calls. Keep Pebble’s native incoming-call interface enabled by default. XOCE
should complement that interface without automatically opening a second incoming
call screen.

## Requested scope

- The Android app must be useful without a watch or configured Pebble integration.
- The optional watch companion should support making calls and viewing history,
  using the Android app for phone data and call actions.

## Working direction

- Preserve native Pebble incoming caller display, Answer and Decline.
- Provide history, favourites, contacts and outgoing dialing in the XOCE watch app.
- Provide an XOCE outgoing-call screen and optional extra ongoing-call controls.
- Keep implementation, source findings and unverified device behaviour distinct.
  Research does not establish a released feature or a supported-device list.

| Function | Working owner |
| --- | --- |
| Android dialpad, recents, contacts and phone call interface | XOCE Android app |
| Incoming watch alert, caller display, answer and decline | Native Pebble call interface |
| Basic ongoing display after answering an incoming call | Native Pebble call interface |
| Watch history, favourites, contacts and number selection | XOCE watch app |
| Watch-originated outgoing call progress and End | XOCE watch app |
| Extra controls such as mute, audio output and an in-call keypad | XOCE when explicitly opened; controls follow Android call capabilities |

## Android architecture under consideration

For a complete replacement phone app, request Android’s user-selected
`ROLE_DIALER` and implement `ACTION_DIAL` and `InCallService`. This requires proper
incoming and ongoing call interfaces. Android Telecom performs the carrier calls;
use `TelecomManager.placeCall()` to initiate them. The preinstalled dialer retains
the emergency-call interface. This is the recommended architecture, not an
implemented role request. [Android default Phone guide][android-phone]

Android exposes call history through `CallLog.Calls`, contacts and starred
contacts through the contacts provider, and call actions through `Call` and
`InCallService`. Dual-SIM selection uses phone accounts. Permission handling,
supported Android versions and available call capabilities need to be established
in the prototype. [Call history][android-history], [contacts][android-contacts],
[call controls][android-call], [phone accounts][android-accounts]

Call-log access is an Android restricted permission. Google Play separately
recognises default Phone use cases and qualifying connected-device companions;
distribution approval and OS permission access are separate concerns. A watch
companion is not universally required to become the default dialer.
[Android call-log permission][android-call-permission], [Play policy][play-policy]

## Pebble connection under consideration

Use a native watch app with AppMessage and a PebbleKit Android 2 service inside
the Android app:

```text
XOCE watch app ↔ Pebble mobile app ↔ XOCE Android app ↔ Android Telecom
```

The current PebbleKit Android 2 documentation lists support in the Pebble/Core
mobile app from version 1.0.7.7. Its bound service supports companion communication
while the watch app runs. That is a bridge requirement from the SDK documentation,
not XOCE’s final compatibility promise. The initial Phone integration does not
need the JavaScript plugin preview used by the existing activity experiments.
[PebbleKit Android 2][pebblekit]

Android should own the data. Fetch small pages of recent calls or contacts when
needed instead of continuously copying the entire address book. Validate the
selected companion, report missing permissions or disconnection clearly, and
distinguish transport acknowledgement from completion of a call action. Never
replay a stale dial command after reconnection. These are proposed implementation
rules. [AppMessage][appmessage]

## Verified native call behaviour

Current PebbleOS source already creates a system incoming-call popup with Answer
and Decline. The Up button answers and Down declines. It overlays a running watch
app, so incoming answering does not depend on XOCE’s watch app being open.
[Native watch call interface][native-ui]

The official Android app receives the native watch commands and executes their
call callbacks. Its wearable `InCallService` explicitly invokes
`call.answer(VideoProfile.STATE_AUDIO_ONLY)` and `call.disconnect()`.
[Native command handling][native-manager], [Android call service][native-service]

Pebble has its own wearable call service, separate from the Android default
dialer’s interface. Consequently, making XOCE the default Phone app should retain
native watch answering when both use Android Telecom normally and Pebble retains
its association and permissions. This is an architectural inference that still
needs testing with XOCE. [Pebble manifest][pebble-manifest],
[Android wearable call access][android-wearable]

The fallback path uses phone-state broadcasts and actions from `CATEGORY_CALL`
notifications. XOCE should publish standard call notifications with explicit
semantic Answer and Decline actions, avoiding dependence on translated button
labels. [Fallback receiver][native-fallback], [action detection][native-actions]

### Outgoing calls need a separate flow

The current mobile call manager sends Incoming for ringing and Start for active
calls, but does nothing for Dialing or Holding. The firmware’s Start event updates
an existing incoming-call session; it does not create one. Therefore the current
integration is not an established handoff for an XOCE-originated outgoing call.
Keep XOCE open to show its number, progress, elapsed time and End control.
[Mobile state handling][native-manager], [firmware call service][native-call-service]

### Dismissing the native screen

The native Back handler stops the watch’s ringing and closes the popup without
sending a hang-up command. This applies to incoming and ongoing screens.
[Native button handlers][native-ui]

The intended coexistence flow is:

1. An incoming call displays Pebble’s native popup, including while XOCE is open.
2. Answer through that popup and use the phone or a connected headset for audio.
3. For additional controls, dismiss the popup with Back and open XOCE through
   Quick Launch, or return to the already-running XOCE app.
4. XOCE reads the current call state and opens its active-call controls.

Back behaviour is source-confirmed. Resuming XOCE, Quick Launch and state updates
in this complete flow remain device-test items.

## Native call interface disabling

Do not disable native call handling as part of initial XOCE setup. No supported
public takeover API or exposed call-only replacement switch was found in the
inspected integration. This is a finding about the current interfaces, not a
claim that PebbleOS could never support a replacement.

| Existing control | What the inspected source establishes |
| --- | --- |
| Mute phone call effects | Mutes the phone’s call sound/vibration while connected; does not disable the watch popup |
| Watch notification filter | Offers All On, Phone Calls Only and All Off; All Off suppresses native call popups together with other alerts, and no all-except-calls choice is exposed |
| Quiet Time interruption mask | Controls call vibration/backlight during Quiet Time; is not a selective popup takeover mechanism |
| Per-app notification forwarding | Separate from native PhoneControl events; disabling a dialer’s ordinary notifications is not a verified native-call disable method |
| PebbleKit Android 2 | Messaging and watch app launch/stop are documented; no native call-screen ownership switch was found |

The global notification filter can suppress the popup because the call service
checks `alerts_should_notify_for_type(AlertPhoneCall)` before handling call
events. Its All Off option is unsuitable for replacing only the call interface
while retaining other native alerts.

Sources: [mobile settings][watch-settings], [watch preferences][watch-preferences],
[global alert filtering][alert-filter], [call-event gate][native-call-service],
[native call transport][native-manager], [PebbleKit interface][pebblekit].

A complete custom incoming-call interface is a later proposal. It first needs a
clean, reversible handoff mechanism, potentially through cooperation with the
Core mobile app or PebbleOS. Avoid duplicate popups and broad permission changes
as a workaround.

## Audio and existing implementation references

Time 2 has microphones and a speaker, but normal cellular-call audio through the
watch is not a supported feature. The intended audio endpoints are the phone and
its supported headset routes. Android also restricts third-party access to raw
cellular-call audio. [Pebble hardware statement][hardware],
[Android call-audio restrictions][android-audio]

[Pebble Phone Connect][reference-app] is a current reference for the watch bridge:
its source implements paged history, contacts, favourites, dialing, call status,
mute, audio routing and hang-up. Its Android app is a watch bridge rather than a
complete standalone replacement dialer. Its AGPL-3.0-or-later licence must be
considered before copying or adapting code; XOCE Phone’s licence remains
undecided. [Reference protocol][reference-protocol]

## First prototype and open decisions

First prove a complete watch flow: load Recents, select a number, place a call
with the phone locked, show confirmed state changes and end the call. Then test
native incoming answering while XOCE is the Android default Phone app, with the
XOCE watch app both open and closed.

Repeat the relevant flows after Bluetooth reconnection, Android process restart,
phone reboot, battery saving and permission revocation. Check SIM prompting,
failed calls, call waiting, dismissing the native popup and opening XOCE without
ending the call. The native code’s single-current-call model makes multiple-call
behaviour a specific validation concern.

Still open: minimum Android version, final watch compatibility, exact permission
setup, interface layouts, richer call controls, distribution and licence.

The source review used the mobile app revision
`f127b2aff16fc5b7bb59f75881a62d3d62f158bd` and PebbleOS revision
`39a8ed3c2744c08404c3ee505dabcb082f41d998`. Recheck the integration before building
against a newer release.

[android-phone]: https://developer.android.com/develop/connectivity/telecom/dialer-app
[android-history]: https://developer.android.com/reference/android/provider/CallLog.Calls
[android-contacts]: https://developer.android.com/reference/android/provider/ContactsContract.Contacts
[android-call]: https://developer.android.com/reference/android/telecom/Call
[android-accounts]: https://developer.android.com/reference/android/telecom/TelecomManager#getCallCapablePhoneAccounts()
[android-call-permission]: https://developer.android.com/reference/android/Manifest.permission#READ_CALL_LOG
[play-policy]: https://support.google.com/googleplay/android-developer/answer/10208820?hl=en
[android-wearable]: https://developer.android.com/reference/android/telecom/InCallService#access-to-incallservice-for-wearable-devices
[android-audio]: https://developer.android.com/reference/android/media/MediaRecorder.AudioSource#VOICE_CALL
[pebblekit]: https://github.com/pebble-dev/PebbleKitAndroid2/blob/main/README.MD
[appmessage]: https://developer.repebble.com/docs/c/Foundation/AppMessage/
[native-ui]: https://github.com/coredevices/PebbleOS/blob/39a8ed3c2744c08404c3ee505dabcb082f41d998/fw/popups/phone_ui.c
[native-call-service]: https://github.com/coredevices/PebbleOS/blob/39a8ed3c2744c08404c3ee505dabcb082f41d998/fw/services/phone_call/service.c
[alert-filter]: https://github.com/coredevices/PebbleOS/blob/39a8ed3c2744c08404c3ee505dabcb082f41d998/fw/services/notifications/alerts.c
[native-manager]: https://github.com/coredevices/mobileapp/blob/f127b2aff16fc5b7bb59f75881a62d3d62f158bd/libpebble3/src/commonMain/kotlin/io/rebble/libpebblecommon/connection/endpointmanager/phonecontrol/PhoneControlManager.kt
[native-service]: https://github.com/coredevices/mobileapp/blob/f127b2aff16fc5b7bb59f75881a62d3d62f158bd/libpebble3/src/androidMain/kotlin/io/rebble/libpebblecommon/calls/LibPebbleInCallService.kt
[pebble-manifest]: https://github.com/coredevices/mobileapp/blob/f127b2aff16fc5b7bb59f75881a62d3d62f158bd/libpebble3/src/androidMain/AndroidManifest.xml
[native-fallback]: https://github.com/coredevices/mobileapp/blob/f127b2aff16fc5b7bb59f75881a62d3d62f158bd/libpebble3/src/androidMain/kotlin/io/rebble/libpebblecommon/calls/AndroidPhoneReceiver.kt
[native-actions]: https://github.com/coredevices/mobileapp/blob/f127b2aff16fc5b7bb59f75881a62d3d62f158bd/libpebble3/src/androidMain/kotlin/io/rebble/libpebblecommon/calls/NotificationCallDetector.kt
[watch-settings]: https://github.com/coredevices/mobileapp/blob/f127b2aff16fc5b7bb59f75881a62d3d62f158bd/pebble/src/commonMain/kotlin/coredevices/pebble/ui/WatchSettingsScreen.kt
[watch-preferences]: https://github.com/coredevices/mobileapp/blob/f127b2aff16fc5b7bb59f75881a62d3d62f158bd/libpebble3/src/commonMain/kotlin/io/rebble/libpebblecommon/database/entity/WatchPrefEntity.kt
[hardware]: https://repebble.com/blog/pebble-time-2-is-in-mass-production
[reference-app]: https://github.com/loxK/pebble-phone-sms-android
[reference-protocol]: https://github.com/loxK/pebble-phone-sms-android/blob/main/PROTOCOL.md
