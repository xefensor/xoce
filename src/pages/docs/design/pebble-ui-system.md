---
layout: ../../../layouts/DocLayout.astro
title: Pebble UI and UX standard
description: The shared watch and phone settings design implemented and validated in local candidates, with release and device-verification boundaries.
section: Design
order: 5
---

**Status: implemented and validated in local candidates; not published.** The local candidates are Dynamic 0.17.0, Dashboard 0.5.0, Timer 0.13.0 and Open Activity 0.2.0. Their automated tests, packaged settings/browser checks, builds and native emulator checks pass. Real-phone and physical-watch verification remain separate. The public project catalogue and download links still identify the published baselines.

The [UI patterns](/docs/design/ui-patterns/) and [interaction guide](/docs/design/interaction/) distinguish published behaviour from the local candidates. Existing screenshots keep their original capture versions; they do not become evidence of a new binary. The rules below are the shared implementation reference.

## Scope and agreed direction

The design covers [Dynamic](/projects/dynamic/), [Dashboard](/projects/dashboard/), [Timer](/projects/timer/) and [Open Activity](/projects/open-activity/), including their phone settings. Appearance is configured on the phone; Timer creation and alarm management remain on the watch. The current native target is Pebble Time 2 / Emery, 200 × 228 pixels.

Use a neutral light/dark base with a restrained accent for each app. Keep strong contrast, readable content, recognisable controls and useful feedback. Share typography roles and interaction rules while preserving each app’s purpose.

Dynamic keeps its configurable watchface colours. Phone settings follow the phone’s appearance independently of the selected watch palette. The website’s warm surfaces, orange accent, Space Grotesk and Inter remain the [website identity](/docs/design/visual-identity/); they are not the watch-app palette or fonts.

The candidates use the phone colour roles below. These describe app settings, separately from the website palette and Dynamic’s user-selected watch colours.

| Phone role | Light | Dark |
| --- | --- | --- |
| Page | `#f4f5f7` | `#11151b` |
| Card | `#ffffff` | `#1d232d` |
| Main text | `#15181c` | `#f3f5f7` |
| Supporting text | `#5d6571` | `#b5bfcc` |
| Border | `#d9dee6` | `#465165` |

| App accent role | Light | Dark |
| --- | --- | --- |
| Dynamic | `#145ca3` | `#8abfff` |
| Dashboard | `#076b65` | `#83d7ca` |
| Timer | `#145ca3` | `#77bbff` |
| Open Activity | `#6f42a9` | `#c9a7ff` |

Accent text, focus and filled buttons need an appropriate contrasting foreground. A colour-role value is not a promise that every widget uses it as a fill. Watch graphics use the watch’s available palette; phone hex values do not promise identical physical-watch pixels. Native geometry remains fitted per app and display. No new shared framework, token package or component repository was created.

## Watch typography and hierarchy

Use Fredoka for prominent numeric content and Roboto Condensed for interface text, building on the current Dynamic, Dashboard and Timer resources. Keep the existing font licences and notices. Open Activity’s local setup joins the same visual family using a small native font set. Each app retains its own fitted layout and resource budget.

Give essential text a readable role, generally around 18–20px on the current display, and make primary values larger. These are fitting targets, not a promise that every string already fits or a requirement to make every supporting label the same size. Check actual glyph ink, baselines, long translations and value/unit pairs in native rendering. Do not repeatedly shrink important content to make an overcrowded screen fit.

Primary data, context and optional detail have distinct visual weight. Related content stays together. An icon, title and subtitle should not repeat the same information. A symbol plus value is sufficient when its meaning is clear; a device or command needs enough identity to explain what it affects.

## Watch headers, actions and selection

Watch apps use a short screen title on the left and regular local time on the right, respecting the watch’s 12/24-hour setting. List position, app-opening hints and feedback have deliberate space instead of routinely replacing the clock. The local candidates implement this treatment in their headers and reusable native widgets; their native captures check critical messages and recovery actions. Future changes still need fitting checks.

Dashboard 0.5.0 fits an auxiliary context title and an 18px count/status in the left side of its existing header, while the clock stays right. Its activity, notification and two pin rows retain their geometry. Do not add a permanent second strip that squeezes those values or Timer’s countdown. Keep critical failure layouts readable and check new geometry in native captures.

Dynamic is a watchface and retains its own time/date composition. Open Activity’s transient handoff stays minimal; the shared treatment must not add a menu or lengthen its opening attempt.

Use a right-side action bar where physical-button actions need explanation. Emery’s SDK action bar is 34px wide, leaving 166px of a 200px screen for the content beside it. Use platform geometry rather than assuming those dimensions on every model. Passive screens need no empty action bar. Icons share a clear weight and familiar meanings, and unavailable actions do not look executable. See [Pebble’s action-bar reference](https://developer.repebble.com/docs/c/User_Interface/Layers/ActionBarLayer/).

Use a strong inverted foreground/background treatment for selection. Accent colour supports hierarchy and app identity; selection, warnings and action meaning also remain understandable through text, icons or shape. Dark appearance needs the same hierarchy and contrast as light appearance, including the first frame and loading states.

In lists, Up/Down navigate and Select activates the available action. Back returns to the previous context with selection retained. A press, hold or release must not accidentally act again after changing screens. Keep the existing Dashboard hold shortcuts in their defined contexts. Do not introduce a custom shared hold-Back gesture.

## Preserve each app’s composition

| Project | Composition and behaviour to retain |
| --- | --- |
| Dynamic | The distinctive clock and two readings. Primary activity content stays bottom-aligned above its contextual footer; the secondary is exactly one static row above it. Any supported activity can occupy either role. Media retains its title and optional artwork/artist footer. |
| Dashboard | Snapshot has one activity, one notification and two pins. Select runs the available useful action; hold Select opens the associated app. Hold Up/Down from Snapshot opens Activities/Pinned. Keep selection safe when live items change. |
| Timer | A stable countdown and recognisable hourglass. Ready has sand below; running places remaining sand above; paused is horizontal. Preserve native alarm ownership, explicit Reset-to-Ready and a separate Start. |
| Open Activity | Ordinary launch provides a quiet setup screen; configured Quick Launch performs a minimal automatic handoff. Preserve its two role choices, opening deadline and missing-Secondary behaviour. |

A Dashboard pin can combine a reading, a tap action and an associated app. A summary without a useful action remains read-only. The empty or unavailable notification preview keeps its public Notifications destination. Standardising presentation does not create commands a source does not support.

Timer Pause/Resume from Dashboard remains deferred. Opening an associated app opens that app as a whole; it does not select or operate a particular timer, notification or song.

## Watch feedback, confirmations and motion

Loading, confirmed empty, expired, unavailable and failed are different states. Use consistent short wording and a stable place for feedback. Preserve meaningful values and available recovery controls. Never manufacture a fresh reading or a successful action to make the interface look complete.

Confirmations name the operation and target, for example **Delete 5 min timer?** The initial choice is safe, Back cancels, and returning restores the originating selection. Do not hide which item will be changed behind a generic confirmation.

Use bounded motion to explain a real change. Keep Timer’s countdown fixed while its glass rotates, and keep Dynamic’s activity replacements distinct from ordinary clock ticks or metadata corrections. Resting, Ready and paused states remain still. Stop decorative work under covering system windows.

Watch text always displays the beginning that fits, truncating at the final visible line. It never marquees, automatically pages or cycles. Ordinary vertical list navigation remains available. Motion and ticking should reuse the necessary update schedule; the design does not justify a perpetual particle or animation timer.

## Phone settings layout and controls

Phone configuration pages use a shared anatomy:

1. App name and one short explanation of the page’s job.
2. Task-based settings sections containing related controls.
3. Disclosed setup/help and advanced options where useful.
4. A consistently placed Save area with a small status indicator.

Use matching system typography, spacing, cards, selectors, switches, inline errors and button treatments. Body text should be comfortably readable, with a 16px starting target. Aim for at least 44px touch targets and a 48px primary action. These are implementation targets to verify in the actual phone pages, including enlarged text.

Use common terminology and translated interface text across settings. Preserve Dynamic’s existing 17-language coverage and provide equivalent wording for new controls and Save states; alignment must not silently replace a localised page with English-only text. The local Dashboard 0.5.0, Timer 0.13.0 and Open Activity 0.2.0 settings provide English and Czech owned interface copy; other phone locales fall back to English. Dynamic retains its existing 17-language settings. Provider names, saved user labels and source values retain their own text and are not rewritten by interface localisation. These are the included languages, not a claim of 17-language coverage in every app.

Long pages can have section shortcuts. Small pages keep their small structure: Open Activity has one Primary shortcut picker and one Secondary picker, plus a separate Watch appearance selector. The standard does not require a navigation system or extra sections on every page.

Activity rows use consistent identity, visibility and ordering controls. Support move buttons even where drag is available. Dynamic and Dashboard keep their own saved activity order and visibility. Notification privacy and permission choices remain app-specific.

Keep named app destinations as the common path and custom UUID entry under advanced configuration. Store search is explicit and does not claim to enumerate installed watch apps. Do not add unexpected network requests, permission changes or automatic field focus.

Appearance remains in phone settings. Timer 0.13.0 adds a minimal phone page with a Light/Dark watch-appearance choice and setup/help. It does not add a phone timer editor: creation, editing, pause/resume, Reset and alarms remain owned by the watch. Open Activity 0.2.0 places Watch appearance separately from its two activity-shortcut pickers. Phone page appearance follows the phone independently of the selected watch appearance.

## Save stays open

**The modern bundled settings pages keep settings open and show a small inline confirmation in the Save area.** Saving does not dismiss those pages or interrupt the user with a success dialog. The legacy return-URL fallback still closes to submit its result and cannot provide the same in-page persistence confirmation; do not describe that fallback as Save-and-stay.

| State | Indicator and behaviour |
| --- | --- |
| Confirmed settings loaded, no edits | No changes to save. Save is disabled. |
| User changes a setting | Unsaved changes. Save is available when the draft is valid. |
| Save is in progress | Saving… Prevent duplicate submissions and retain the draft. |
| Intended settings are confirmed saved | ✓ Saved. Keep the page open, retain scroll/focus and disable Save until another change. |
| A confirmed failure occurs | Couldn’t save. Try again. Keep the edits and provide a retry. |
| The write’s result is uncertain | Save not confirmed. Offer Reload saved or an explicit retry; do not claim either success or rollback. |
| Saved state cannot be loaded | Explain the load failure and offer Retry. Do not present editable replacement defaults as if they were the saved choices. |

After a successful Save, **✓ Saved stays quietly visible until another edit**. It does not need a disappearing toast, countdown or repeated animation. A fresh page load verifies its saved snapshot instead of claiming that a previous session’s write just succeeded. These English phrases are the shared wording reference; localised pages use equivalent translated text.

The global Save gathers the complete draft, including any open nested editor such as a Dashboard pin. A local Done action can organise a draft, but it is not a hidden prerequisite for saving. Validation identifies the relevant fields and preserves their contents. A nested editor may close after a confirmed Save; the settings page itself stays open.

Saved means the intended phone settings were confirmed through the app’s supported persistence mechanism. Sending a request, receiving a transport acknowledgement or starting watch delivery is not sufficient. Show watch-delivery problems separately, only when relevant; an offline watch must not make confirmed phone storage appear to have failed.

Discard restores the confirmed local snapshot without sending a write. It cannot promise to undo a request already sent. Late callbacks, retries and readbacks must not overwrite a newer edited draft or let one result confirm a different settings version.

## Phone focus, viewport and accessibility

Keep the visible context and input focus stable during Save, confirmation and ordinary updates. If a confirmed Save intentionally closes a nested editor, return focus to a logical existing control without opening the keyboard or jumping to the top of the page. Discard can restore controls with different heights; normal browser scroll anchoring preserves the visible context rather than a fixed numeric `scrollY`. It must not force the page to the top or focus a text field. Opening settings, editing a pin or choosing an app does not automatically summon the keyboard. Explicit search may focus its field when the user requests it.

Keep labels, descriptions and inline errors associated with their controls. Announce Save/status changes through an accessible status area. Feedback uses words or a symbol as well as colour. Routine saving should not repeatedly interrupt reading.

Fixed Save controls reserve their measured height. When a keyboard, short viewport or enlarged text makes that layout unsuitable, the actions move into normal document flow. The final field and help text must stay reachable. Keep the existing independent phone/watch appearance behaviour.

## Local candidate adoption and validation

These local implementations have passed their repository tests, packaged settings checks, builds and native emulator validation. They are not new public releases. These results do not establish real-phone WebView behaviour or physical-watch readability, button feel, vibration and battery life.

| Project | Local candidate implementation | Validation status |
| --- | --- | --- |
| Dynamic 0.17.0 | Bundled configuration page retains Clay’s existing settings and 17-language interface while using SDK configuration messages for verified Save-and-stay. Custom watch palettes and activity composition remain intact. | Packaged stay-open browser checks, legacy-route checks, build/artifact checks and native emulator checks pass. |
| Dashboard 0.5.0 | Persistent clock with compact left count/status, Cancel-first target-specific confirmation, neutral/teal phone shell, English/Czech owned copy and confirmed stay-open Save. | Portable, actual packaged browser/runtime, native UX and startup-theme checks pass. Real-device checks remain separate. |
| Timer 0.13.0 | Shared neutral light/dark native presentation and target-specific Delete context. A minimal phone appearance page selects Light/Dark; native timers and alarms stay watch-owned. | Portable, packaged phone appearance, build/artifact and native emulator checks pass. |
| Open Activity 0.2.0 | Shared native font/header treatment, saved light/dark appearance, purple phone accent and English/Czech interface. Appearance is separate from its two shortcut pickers; modern Save stays open. | Packaged/browser and native checks pass. Real-device checks remain separate. |

Each local repository keeps its release-specific evidence and `docs/UX-ALIGNMENT.md`. The relevant local evidence folders are `pebble-watchface-dynamic/docs/qa/0.17.0/`, `pebble-app-dashboard/docs/qa/0.5.0/`, `pebble-app-timer/docs/qa/0.13.0/` and `pebble-app-open-activity/docs/qa/0.2.0/`. These sibling paths are local workspace references, not published website downloads.

## Published baselines before alignment

The public catalogue still lists Dynamic 0.16.2, Dashboard 0.4.3, Timer 0.12.0 and Open Activity 0.1.6. Their files and tags remain unchanged.

| Published baseline | Historical difference addressed by the local candidate |
| --- | --- |
| Dynamic 0.16.2 | Clay submitted and closed; reopened status described earlier watch delivery rather than the new in-page phone save confirmation. |
| Dashboard 0.4.3 | Collection position or status could replace the clock; phone settings already stayed open, but lacked the new shared presentation and Czech UI. |
| Timer 0.12.0 | Normal screens were light and alarms had their own dark treatment; there was no phone appearance form, and Delete did not identify the timer’s duration. |
| Open Activity 0.1.6 | Setup used stock Gothic/status-bar presentation on a fixed light background. Its phone page had two shortcut pickers without the new watch-appearance control. |

The implementation does not create a global theme-synchronisation service. Each app keeps its own appearance preference and existing independent content order/privacy. Current project download links and older screenshots must not be relabelled as these local candidates.

## Implementation boundaries

Keep this specification as the shared design reference. App repositories own their concrete layout, settings adapters, storage, resources and implementation evidence. Their existing contracts remain authoritative until an explicitly versioned change is made.

The implementations share visual roles and use their existing application adapters. No new framework, UI package, repository or activity-library redesign was introduced. Shared presentation alone does not require a firmware/mobile-app fork, a global settings service or a change to provider data.

Dynamic’s local candidate keeps Clay rendering and adds a bundled SDK configuration-message bridge for load/save confirmation. Dashboard, Timer and Open Activity use their generated configuration pages and supported persistence controllers. The existing mobile WebView host still owns its outer navigation. Modern confirmation depends on those controller paths; CSS alone cannot provide persistence confirmation or prevent a host from dismissing a page. Legacy return-URL submission remains a separate compatibility path.

Preserve app UUIDs, saved preferences, timer/alarm ownership, activity source identity and original validity, and the independent priorities/privacy choices. Published artifacts remain unchanged until a separately validated app release is created.

## Acceptance checks for the app update

Use these checks for the local rollout and any later changes. A completed automated check is distinct from a real-phone or physical-watch result:

- Compare light/dark startup, normal, loading, empty, unavailable, confirmation and error screens. Keep the clock, critical values, target identity and available actions readable.
- Render long names/translations, large values and units, optional/missing artwork and both activity roles on the native target. Check one-row secondary fitting without scrolling text or tiny essential copy.
- Exercise tap, hold, release and Back through lists, controls, confirmations and live item replacement. Verify preserved selection and no action on a replacement target.
- Change phone settings, Save, see confirmed inline feedback and remain on the page without a scroll jump or keyboard popup. Edit again and verify the dirty state and Save availability.
- Save with a nested editor still open. Test validation, rejected writes, timeouts, late replies and explicit retry/readback without losing or falsely confirming edits.
- Save, close, reopen and read the same choices; repeat after app/runtime restart. Cover live and closed settings paths and their separate Android runtime/storage views where applicable.
- Check narrow/short phone viewports, keyboard-open layouts, enlarged text, keyboard navigation, status announcements and translated controls.
- Preserve app-specific behaviours: Timer Reset stays Ready, native alarms remain owned, Dynamic’s composition stays intact, Dashboard’s notification shortcut remains available, and Open Activity keeps its bounded handoff.

Use each repository’s relevant automated tests, packaged/minified settings execution, artifact checks and native emulator captures. Record real-phone WebView/storage/permission checks and physical-watch readability, button feel, vibration and battery evidence separately. Documentation or browser previews alone cannot establish those results.

For the current user-facing workflows, see [watch setup](/docs/pebble/setup/) and [watch controls](/docs/pebble/controls/). The current implementation references are [Dynamic’s native style](https://github.com/xefensor/pebble-watchface-dynamic/blob/7b5daced6a8c7974425e1b3fb927071d1501df3d/docs/NATIVE-STYLE.md), [Dashboard’s implementation](https://github.com/xefensor/pebble-app-dashboard/blob/61a38a981ba060b556feb7f71de41242a64eed67/docs/IMPLEMENTATION.md), [Timer 0.12.0](https://github.com/xefensor/pebble-app-timer/blob/v0.12.0/README.md) and [Open Activity 0.1.6](https://github.com/xefensor/pebble-app-open-activity/blob/v0.1.6/README.md).
