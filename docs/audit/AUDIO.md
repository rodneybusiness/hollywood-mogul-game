# AUDIO Workstream — Audit Findings

Auditor: AUDIO workstream per `docs/AUDIT-PLAN.md` section 6. Evidence gathered by full code read of `js/systems/audio.js` (735 lines) and `js/systems/audio-integration.js` (249 lines), plus a headless Chromium runtime probe against `index.html` (Playwright 1.56.1, `file://` load; probe script exercised init, click gesture, `playSFX('clock_tick')`, `playMusic('pre_code')`, and the tutorial code path).

## Summary

- **The game is 100% silent in Chromium.** Zero audio assets exist (`audio/music/` and `audio/sfx/` hold only READMEs), so all 36 referenced files fail to load; and the WebAudio procedural fallback beeps are also inaudible because the `AudioContext` is created at page load and **never resumed** — runtime probe shows `state: "suspended"` even after a user click.
- The header ships a mute button and three volume sliders (Master/Music/SFX, `index.html:40-62`) that control this silence — an automatic S0 per the audit plan ("obviously unfinished").
- The audio *code* is substantially complete: 16 music tracks + 20 SFX are catalogued with URLs and descriptions, crossfade/fade logic, era-switching, localStorage preference persistence (works), and 4 procedural oscillator sounds. What is missing is every asset, the autoplay/resume unlock, and event-driven integration.
- One real bug beyond silence: `js/ui/tutorial.js:938` calls `AudioSystem.playSound('achievement')` — a method that does not exist — throwing an uncaught `TypeError` every time a tutorial mission completes (confirmed at runtime).
- The era→music map covers all 12 game eras (1933–2010) but hardcodes its own year boundaries, which disagree with the canonical `GameConstants.getEraKeyForYear()` (`js/core/constants.js:214-227`) in **15 of the 78 playable years**; audio also ignores the existing `era:changed` EventBus event and polls game state every 5 seconds instead.

## What actually plays

**Nothing, in Chromium.** Verified at runtime, not just by reading:

1. **File-based music/SFX: attempted loads that fail.** Every entry in `MUSIC_LIBRARY` (`js/systems/audio.js:47-115`) and `SFX_LIBRARY` (`js/systems/audio.js:121-215`) points at a file under `audio/music/` or `audio/sfx/` that does not exist. Probe captured failed requests for `menu-theme.mp3`, `clock-tick.mp3`, `1930s-jazz-theme.mp3` and console warnings: `Could not play SFX clock_tick: NotSupportedError: Failed to load because no supported source was found.` Over HTTP these would be 404s; over `file://` they are load failures. Either way: silence plus console noise on every triggered sound.
2. **Procedural WebAudio beeps: scheduled into a suspended context.** `playProceduralSFX()` (`js/systems/audio.js:474-546`) can synthesize 4 sounds (`click`, `ding`, `success`, `error`) with oscillators — this is the only code capable of making sound today. But `init()` creates the `AudioContext` on `DOMContentLoaded` (`js/systems/audio.js:224-230`, called from `audio-integration.js:18` / `:240-248`) and **no code anywhere calls `audioContext.resume()`** (repo-wide grep: zero hits). Chromium's autoplay policy leaves a pre-gesture context suspended forever. Probe result: `stateBefore: "suspended"`, `stateAfterClick: "suspended"`. Oscillators started against a suspended context render nothing. (`audio/AUDIO_GUIDE.md:307-310` claims "Audio context resumed on user interaction" — that code was never written.)
3. **Menu music is double-dead.** `init()` → `playMenuMusic()` fires before any user gesture; probe shows `NotAllowedError: play() failed because the user didn't interact with the document first` — and because `playMusic()` sets `audioState.currentTrack` unconditionally (`js/systems/audio.js:370-371`), the guard at line 342 prevents any retry. Even with all assets installed, menu music would never play.
4. **State lies.** After the failed `playMusic('pre_code')`, `getState().currentTrack === 'pre_code'` (probe-confirmed) — the system believes music is playing while silent.

So: a player opens the game, sees a speaker icon and three volume sliders in the header, adjusts them, hears nothing, ever. The mute toggle's only audible effect (`playProceduralSFX('ding')` on unmute, `js/systems/audio.js:652`) is also suspended-context silence.

## Asset shopping list

Every hook the code expects. Music: `js/systems/audio.js:47-115`; SFX: `js/systems/audio.js:121-215`. "Trigger" cites the call site. Durations from `audio/AUDIO_GUIDE.md`.

### Music (16 tracks, all looping unless noted)

| Hook | Expected file | Trigger | Intended style/era | Duration |
|---|---|---|---|---|
| `menu` | `audio/music/menu-theme.mp3` | init/menu (`audio.js:244-246,604-606`) | Elegant jazz piano | 2–3 min |
| `pre_code` | `audio/music/1930s-jazz-theme.mp3` | era <1934 (`audio.js:592`) | Upbeat jazz/swing (Goodman/Ellington) | 2–4 min |
| `code_era` | `audio/music/1930s-orchestral.mp3` | 1934–1940 (`audio.js:589`) | Refined 1930s orchestral | 2–4 min |
| `war_era` | `audio/music/1940s-patriotic.mp3` | 1941–1944 (`audio.js:587`) | Patriotic wartime orchestral | 2–4 min |
| `post_war` | `audio/music/1940s-optimistic.mp3` | 1945–1949 (`audio.js:585`) | Bright post-war swing/orchestral | 2–4 min |
| `tv_threat` | `audio/music/1950s-cinema.mp3` | 1950–1957 (`audio.js:583`) | Widescreen spectacle | 2–4 min |
| `new_wave` | `audio/music/1960s-revolution.mp3` | 1958–1966 (`audio.js:581`) | Rebellious 60s new wave | 2–4 min |
| `ratings_era` | `audio/music/1970s-gritty.mp3` | 1967–1974 (`audio.js:579`) | Gritty New Hollywood realism | 2–4 min |
| `new_hollywood` | `audio/music/1970s-epic.mp3` | 1975–1982 (`audio.js:577`) | Epic late-70s blockbuster | 2–4 min |
| `blockbuster_age` | `audio/music/1980s-synth.mp3` | 1983–1993 (`audio.js:575`) | Synth-driven 80s | 2–4 min |
| `indie_boom` | `audio/music/1990s-eclectic.mp3` | 1994–1999 (`audio.js:573`) | Eclectic 90s indie | 2–4 min |
| `digital_dawn` | `audio/music/2000s-digital.mp3` | 2000–2004 (`audio.js:571`) | Digital-transition | 2–4 min |
| `convergence` | `audio/music/2000s-modern.mp3` | 2005+ (`audio.js:569`) | Modern convergence | 2–4 min |
| `tension` | `audio/music/tension-low-finances.mp3` | runway <8 wks && cash <$100k (`audio.js:560-565`) | Suspense strings, minor key | 1–3 min |
| `success` | `audio/music/success-fanfare.mp3` | **never triggered** (orphan) | Triumphant brass | 10–20 s |
| `crisis` | `audio/music/crisis-dramatic.mp3` | **never triggered** (orphan) | Dramatic orchestral | 1–2 min |

### SFX (20 catalogued + 1 phantom)

| Hook | Expected file | Trigger | Intended sound | Duration |
|---|---|---|---|---|
| `navigation` | `audio/sfx/page-turn.mp3` | `.nav-button` click (`audio-integration.js:37-39`) | Page turn | <5 s |
| `clock_tick` | `audio/sfx/clock-tick.mp3` | `#btn-advance-week` (`audio-integration.js:42-44`) | Clock tick | <5 s |
| `calendar_flip` | `audio/sfx/calendar-page.mp3` | `#btn-advance-month` (`audio-integration.js:46-48`) | Calendar page flip | <5 s |
| `greenlight` | `audio/sfx/film-projector-start.mp3` | `.greenlight-btn` (`audio-integration.js:51-56`) | Film projector start | <5 s |
| `cash_register` | `audio/sfx/cash-register.mp3` | after greenlight/loan (`audio-integration.js:54,72`) | Vintage cash register | <5 s |
| `film_release` | `audio/sfx/crowd-cheer.mp3` | `.strategy-btn` (`audio-integration.js:64-66`) | Crowd cheering premiere | <5 s |
| `money_positive` | `audio/sfx/money-in.mp3` | `.loan-btn` (`audio-integration.js:69-74`) | Positive transaction | <5 s |
| `money_negative` | `audio/sfx/money-out.mp3` | cash drop >$10k on 5 s poll (`audio-integration.js:141-145`) | Expense | <5 s |
| `alert_warning` | `audio/sfx/warning-bell.mp3` | `.notification.warning` observed (`audio-integration.js:165-166,224-225`) | Warning bell | <5 s |
| `alert_info` | `audio/sfx/notification-soft.mp3` | other notifications (`audio-integration.js:167-168,227-228`) | Soft chime | <5 s |
| `button_click` | `audio/sfx/art-deco-ding.mp3` | **never triggered** (orphan) | Art-deco ding | <5 s |
| `camera_roll` | `audio/sfx/camera-rolling.mp3` | **never triggered** (orphan) | Camera rolling / "Action!" | <5 s |
| `typewriter` | `audio/sfx/typewriter.mp3` | **never triggered** (orphan) | Typewriter clacking | <5 s |
| `phone_ring` | `audio/sfx/vintage-phone-ring.mp3` | **never triggered** (orphan) | Vintage phone ring | <5 s |
| `coins` | `audio/sfx/coins-clink.mp3` | **never triggered** (orphan) | Coins clinking | <5 s |
| `applause` | `audio/sfx/theater-applause.mp3` | **never triggered** (orphan) | Theater applause | <5 s |
| `marquee` | `audio/sfx/neon-buzz.mp3` | **never triggered** (orphan) | Neon marquee buzz | ambience |
| `achievement` | `audio/sfx/orchestra-hit.mp3` | **never triggered** (tutorial.js:938 calls nonexistent `playSound` instead) | Orchestra hit | <5 s |
| `fanfare` | `audio/sfx/trumpet-fanfare.mp3` | **never triggered** (orphan) | Trumpet fanfare | <5 s |
| `alert_critical` | `audio/sfx/alarm-urgent.mp3` | **never triggered** (orphan) | Urgent alarm | <5 s |
| `newspaper` | *(no entry)* | `js/systems/newspaper.js:818-819` | **phantom** — triggered but not in `SFX_LIBRARY`; falls through to `playProceduralSFX('newspaper')` which matches no case → silent no-op | — |

Procedural (WebAudio, no files needed, currently inaudible per suspended context): `click` (`audio-integration.js:60,80,85`), `ding` (unmute `audio.js:652`; SFX-slider test `audio-integration.js:200`), `success`/`error` (notification/DashboardUI hooks `audio-integration.js:162-164,219-222`).

## Era mapping gaps

**Coverage:** every one of the 12 game eras has a track — no unmapped era. **But** `updateMusicForGameState()` (`js/systems/audio.js:568-593`) hardcodes its own year thresholds instead of calling the canonical `GameConstants.getEraKeyForYear()` (`js/core/constants.js:214-227`). The two disagree in **15 of 78 playable years**:

| Year(s) | constants.js era | audio.js track | Discrepancy |
|---|---|---|---|
| 1934 | PRE_CODE | `code_era` | audio switches 1 year early |
| 1941 | GOLDEN_AGE | `war_era` | audio enters war 1 year early (game's war era starts 1942) |
| 1945 | WAR_YEARS | `post_war` | audio exits war 1 year early |
| 1958–1959 | TV_THREAT | `new_wave` | audio 2 years early |
| 1973–1974 | NEW_HOLLYWOOD | `ratings_era` | audio 2 years late |
| 1980–1982 | BLOCKBUSTER_AGE | `new_hollywood` | audio 3 years late |
| 1990–1993 | INDIE_BOOM | `blockbuster_age` | audio 4 years late |
| 1997–1999 | DIGITAL_DAWN | `indie_boom` | audio 3 years late |

Aligned: 1933, 1935–1940, 1942–1944, 1946–1957, 1960–1966, 1967–1972, 1975–1979, 1983–1989, 1994–1996, 2000–2010.

Note the game also emits a proper `era:changed` EventBus event (`js/core/game-controller.js:298`) at the true boundary — audio ignores it (see next section), so a player would hear e.g. 80s synth over the 1990–1993 indie boom for up to 4 game-years once assets exist.

Minor: track naming is a third vocabulary (`code_era` vs constants' `GOLDEN_AGE`; `tv_threat` vs `TV_THREAT` is fine, but `war_era` vs `WAR_YEARS` etc.), inviting future drift.

## Integration issues

1. **No EventBus subscription at all.** `js/core/event-bus.js` exists and the game emits `time:advanced`, `week:processed`, `month:processed`, `era:changed`, `financial:updated`, `financial:expenses`, `game:ended` (`js/core/game-controller.js:43-341`, `js/core/game-state.js:466-467`). `audio-integration.js` subscribes to none of them. Instead it uses (a) document-level click delegation matching CSS classes (`audio-integration.js:33-95`), (b) a `MutationObserver` on `#notifications` (`:106-124`), and (c) a **5-second `setInterval` poll** of `HollywoodMogul.getGameState()` (`:128-154`) for money sounds and era music. Consequences: era music lags transitions by up to 5 s; `money_negative` fires on net cash deltas across a 5 s window (multiple expenses collapse into one sound, or a wash of +/− makes no sound); the interval runs forever including on menus.
2. **Missing assets do not throw — but they log on every trigger.** All `playSFX`/`playMusic` failures are caught (`.catch(e => console.warn(...))`, `audio.js:366,387,468`). No handler throws when assets are missing (probe: `pageErrors: []` from audio paths). The cost is console spam: one warning per SFX trigger, one failed network request per new `Audio` element.
3. **The one real throw is a bad API call, not a missing asset:** `js/ui/tutorial.js:937-939` calls `window.AudioSystem.playSound('achievement')`; the public API (`audio.js:707-734`) exports `playSFX`, not `playSound`. Probe-confirmed: `TypeError: window.AudioSystem.playSound is not a function`, raised on every tutorial mission completion (`showMissionComplete`, called from 6 sites, `tutorial.js:848-895`). It is the last statement in the function so nothing downstream breaks, but it is an uncaught exception in the console during the tutorial — the worst possible first impression.
4. **Mute/volume persistence works.** Prefs round-trip via `localStorage['hollywoodMogul_audioPrefs']` (`audio.js:252-287`), sliders initialize from saved state (`audio.js:302-335`), mute icon updates (`audio.js:659-672`). Caveats: slider HTML defaults (`index.html:47,52,57`) match code defaults only by coincidence (duplicated constants); mute does not pause music, just zeroes volume (fine); `setSFXVolume` correctly applies at play time.
5. **Autoplay unlock never implemented.** No first-gesture handler resumes the AudioContext or retries blocked music; `AUDIO_GUIDE.md:305-310` documents this as done. Combined with the no-retry guard in `playMusic` (`audio.js:342,370-371`), menu music can never recover even with assets present.
6. **`DashboardUI.showNotification` monkey-patch is racy:** `enhanceDashboardUI()` runs at DOMContentLoaded (`audio-integration.js:242-247`); if `dashboard.js` defines `showNotification` later or another addon re-wraps it, the audio wrap silently misses. Duplicate sound risk: notifications trigger sound both via the MutationObserver and the monkey-patch.

## Plan of record vs. implementation (AUDIO_GUIDE.md and READMEs)

The plan (`audio/AUDIO_GUIDE.md`, `audio/music/README.md`, `audio/sfx/README.md`) was: a complete engine + 8 music tracks + 20 SFX sourced from royalty-free libraries (FreePD, Incompetech, Freesound, BBC), with an `AUDIO_CREDITS.md` for licenses. The guide describes the system in the present tense as "complete." Implementation reached: engine code ~90% (missing only the autoplay resume it claims to have), asset acquisition **0%** (no .mp3/.ogg anywhere in the repo; no `AUDIO_CREDITS.md`), and the guide/READMEs still document only the original 8-track 1933–1949 plan while the code grew to 16 tracks for 1933–2010 — the docs were never updated for the timeline extension. Note for the SHIP workstream: Incompetech/Zapsplat/Freesound CC-BY assets require attribution and license vetting for *commercial* sale.

## Findings

```json
[
  {
    "id": "AUDIO-001",
    "workstream": "audio",
    "severity": "S0",
    "title": "Header ships mute button and three volume sliders controlling a fully silent audio system",
    "evidence": "index.html:40-62 (mute toggle + Master/Music/SFX sliders); audio/music and audio/sfx contain only README.md (0 assets for the 36 files referenced at js/systems/audio.js:47-215); headless Chromium probe: all audio file requests fail, AudioContext state 'suspended' before and after user click, so procedural fallback beeps are also inaudible. Player hears nothing under any setting.",
    "repro": "Open index.html in Chromium; click speaker/settings icons in header; adjust sliders; play the game. No sound ever. Console shows 'Could not play music/SFX' warnings.",
    "player_impact": "Obviously-unfinished signal in the first 10 seconds; the UI promises audio the game does not have. Refund territory per audit plan section 6.",
    "suggested_direction": "Either ship the asset set (shopping list in docs/audit/AUDIO.md) plus an AudioContext resume-on-first-gesture, or remove the audio controls from the header until assets exist.",
    "confidence": "high"
  },
  {
    "id": "AUDIO-002",
    "workstream": "audio",
    "severity": "S1",
    "title": "Tutorial throws uncaught TypeError on every mission completion: AudioSystem.playSound is not a function",
    "evidence": "js/ui/tutorial.js:937-939 calls window.AudioSystem.playSound('achievement'); public API (js/systems/audio.js:707-734) exports playSFX, not playSound. Runtime probe confirmed: 'TypeError: window.AudioSystem.playSound is not a function'. Reached from 6 call sites (tutorial.js:848-895).",
    "repro": "Start tutorial, complete any mission (e.g. greenlight first feature); observe TypeError in console when the mission-complete toast appears.",
    "player_impact": "Uncaught exception fired repeatedly during the new-player tutorial; erodes trust, pollutes error telemetry. Would be S0 if any statement followed it in showMissionComplete.",
    "suggested_direction": "Change to playSFX('achievement') (one-line fix) and add a Jest test asserting every AudioSystem call site uses an exported method.",
    "confidence": "high"
  },
  {
    "id": "AUDIO-003",
    "workstream": "audio",
    "severity": "S1",
    "title": "AudioContext is never resumed, so even the implemented procedural WebAudio SFX are silent in Chromium",
    "evidence": "js/systems/audio.js:224-230 creates AudioContext at DOMContentLoaded; repo-wide grep finds zero calls to resume(); probe shows context state 'suspended' before AND after a user click. playProceduralSFX (audio.js:474-546) schedules oscillators into the suspended context: no output. AUDIO_GUIDE.md:305-310 falsely documents 'Audio context resumed on user interaction'. Additionally playMusic sets currentTrack unconditionally (audio.js:370-371) so autoplay-blocked menu music (probe: NotAllowedError at audio.js:366) is never retried after a gesture.",
    "repro": "Open index.html in Chromium, click any .action-btn/.modal-close (wired to playProceduralSFX('click') at audio-integration.js:77-85); no sound. In console: AudioSystem.getState().audioContext.state === 'suspended'.",
    "player_impact": "The only sound the code can make today is unreachable; also blocks the cheapest interim fix (ship procedural audio while assets are sourced).",
    "suggested_direction": "On first pointerdown/keydown: audioContext.resume(), then retry pending music; clear currentTrack when play() rejects.",
    "confidence": "high"
  },
  {
    "id": "AUDIO-004",
    "workstream": "audio",
    "severity": "S2",
    "title": "Every triggered sound produces a failed network request and console warning (36 missing files)",
    "evidence": "MUSIC_LIBRARY (js/systems/audio.js:47-115, 16 files) and SFX_LIBRARY (audio.js:121-215, 20 files) reference audio/music/* and audio/sfx/* which contain only READMEs. Probe captured failed requests (menu-theme.mp3, clock-tick.mp3, 1930s-jazz-theme.mp3) and warnings 'NotSupportedError: Failed to load because no supported source was found' (audio.js:366,387,468 warn paths). Errors are caught; nothing throws.",
    "repro": "Open index.html with DevTools Network tab; advance a week (#btn-advance-week); observe failed request for audio/sfx/clock-tick.mp3 and console warning.",
    "player_impact": "Console/network noise on every interaction; masks real errors during support/debugging; 404 spam on a hosted build.",
    "suggested_direction": "Probe asset availability once at init and disable file-backed hooks (fall back to procedural) instead of retrying per trigger.",
    "confidence": "high"
  },
  {
    "id": "AUDIO-005",
    "workstream": "audio",
    "severity": "S2",
    "title": "Era-music switching duplicates era logic with wrong year boundaries: disagrees with canonical eras in 15 of 78 playable years",
    "evidence": "js/systems/audio.js:568-593 hardcodes year thresholds vs js/core/constants.js:214-227 getEraKeyForYear(). Mismatched years: 1934, 1941, 1945, 1958-59, 1973-74, 1980-82, 1990-93, 1997-99. Example: audio keeps 'blockbuster_age' (1980s synth) through 1993 while the game is in INDIE_BOOM from 1990. All 12 eras do have a track (no unmapped era).",
    "repro": "Code inspection; or with assets installed, play to Jan 1990 and observe the track does not change while GameConstants.getEraKeyForYear(1990) === 'INDIE_BOOM'.",
    "player_impact": "Once assets ship, music contradicts the game's own era transitions (which are announced via era:changed events/UI) for multi-year stretches; undermines the historical-authenticity differentiator.",
    "suggested_direction": "Derive track from GameConstants.getEraKeyForYear() via a single 12-entry era→track map; delete the duplicated thresholds.",
    "confidence": "high"
  },
  {
    "id": "AUDIO-006",
    "workstream": "audio",
    "severity": "S2",
    "title": "Audio integration ignores the EventBus; uses 5-second polling and CSS-class click sniffing",
    "evidence": "js/core/event-bus.js exists; game emits era:changed (js/core/game-controller.js:298), financial:updated (js/core/game-state.js:488), week/month:processed (game-controller.js:197,273), game:ended (:341). js/systems/audio-integration.js subscribes to none: it polls getGameState() every 5000ms (audio-integration.js:128-154) for money SFX + era music, and matches click targets by class (:33-95). money_negative logic (:141-145) reacts to net cash delta over 5s, not transactions; the [why]/comment at :137-139 shows the positive-money branch was left empty.",
    "repro": "Code inspection; era music (with assets) changes up to 5s after the era-transition modal; several expenses within 5s produce one sound or none if offset by income.",
    "player_impact": "Sound feedback decoupled from actions; fragile coupling to CSS class names (selectors like .strategy-btn/.loan-btn silently stop matching if UI classes change).",
    "suggested_direction": "Subscribe to era:changed, financial:updated, week:processed, game:ended; keep click delegation only for generic UI ticks.",
    "confidence": "high"
  },
  {
    "id": "AUDIO-007",
    "workstream": "audio",
    "severity": "S3",
    "title": "12 defined audio hooks are never triggered; 1 triggered SFX ('newspaper') is never defined",
    "evidence": "Orphaned (defined js/systems/audio.js:121-215/98-114, no call sites repo-wide): SFX button_click, camera_roll, typewriter, phone_ring, coins, applause, marquee, achievement, fanfare, alert_critical; music success, crisis. Phantom: js/systems/newspaper.js:818-819 calls playSFX('newspaper') which misses SFX_LIBRARY and falls through playProceduralSFX (audio.js:449-457) to a switch with no matching case — silent no-op. Achievements system (js/systems/achievements.js) has no sound hook at all despite 'achievement'/'fanfare' existing.",
    "repro": "grep -rn \"playSFX('achievement'\\|playSFX('fanfare'\\|playSFX('applause'\" js/ returns nothing; grep newspaper.js:819.",
    "player_impact": "Marquee moments (achievement unlocked, box-office hit, film premiere applause) will stay silent even after assets ship; asset budget wasted on unwired sounds.",
    "suggested_direction": "Wire achievement/fanfare/applause into achievements.js and box-office release flow; add 'newspaper' to SFX_LIBRARY or remove the call. Fold into the event-driven rework (AUDIO-006).",
    "confidence": "high"
  },
  {
    "id": "AUDIO-008",
    "workstream": "audio",
    "severity": "S3",
    "title": "Audio docs are stale and asset licensing groundwork is missing for a commercial release",
    "evidence": "audio/AUDIO_GUIDE.md:5,31 and audio/music/README.md describe 8 music tracks for 1933-1949; code (js/systems/audio.js:47-115) expects 16 tracks for 1933-2010. AUDIO_GUIDE.md:307-310 documents autoplay handling that does not exist (see AUDIO-003). AUDIO_GUIDE.md:353-386 mandates audio/AUDIO_CREDITS.md for license tracking; file absent. Recommended sources (Incompetech, Zapsplat, Freesound) carry attribution/commercial-use conditions relevant to a $20 product.",
    "repro": "Compare audio/music/README.md track list (8) against AudioSystem.getMusicLibrary() (16).",
    "player_impact": "None directly; but the build plan's asset acquisition will start from wrong specs, and unlicensed/unattributed audio is commercial risk (overlaps SHIP workstream).",
    "suggested_direction": "Regenerate the asset spec from code (table in docs/audit/AUDIO.md supersedes the READMEs); create AUDIO_CREDITS.md as assets land; prefer CC0/public-domain sources.",
    "confidence": "high"
  }
]
```

## Not covered

- **Firefox/Safari behavior not tested** (only headless Chromium). Firefox's default WebAudio policy may let the procedural beeps sound, which would slightly soften AUDIO-003 (Chromium/Chrome remains the majority case).
- **No test with real assets installed** — crossfade math (`audio.js:377-430`), loop seams, simultaneous-SFX cloning (`audio.js:466-468`), and the 5s-poll music transitions were code-reviewed but not heard; there may be latent bugs (e.g., `crossfadeMusic` shares one global `fadeInterval`, so overlapping fades cancel each other) that only manifest with audible files.
- **Volume slider UX** (drag feel, keyboard accessibility of `input[type=range]`, settings panel layering) left to the UX workstream; only persistence and wiring were verified here.
- **License audit of any future asset sources** deferred to SHIP; flagged in AUDIO-008.
- CSS for audio controls (`css/*.css`) not reviewed for visual states (muted class styling etc.).
