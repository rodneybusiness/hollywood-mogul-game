# UX + SHIP Audit — MOGUL (Hollywood Tycoon)

**Workstreams:** 5 (UX, UI & presentation) + 9 (Commercial readiness) per `docs/AUDIT-PLAN.md`
**Method:** Headless Chromium (Playwright 1.56.1) driving `file:///…/index.html` at 1440×900 and 1280×800; scripted play sessions (scenario start, tutorial skip, greenlight, 18 month-advances, 60 week-advances, save/load round-trips); static analysis of `index.html`, 15 CSS files, `js/ui/*`, `js/core/*`.
**Date:** 2026-07-02

---

## Summary

- **The game is unwinnable as shipped.** `DashboardUI.init()` crashes on a `ReferenceError: getAllFilms is not defined` (`js/ui/dashboard.js:207`), which kills the entire dashboard render pipeline — including the only UI that ever offers a DISTRIBUTE button. Verified in a 60-week scripted run: a film reaches `COMPLETED`, no distribute button ever appears, revenue stays $0, bankruptcy at week 40. Every playthrough is a guaranteed slow loss.
- **The money HUD lies for the entire game.** Cash/burn/runway/films panels freeze at their boot-time values ($600,000 forever) because the working renderer is dead (above) and the fallback renderer in `game-state.js` writes to element IDs that don't exist in `index.html`.
- **"ADVANCE 1 MONTH" — the primary time button — never processes film production.** `advanceMonth()` skips `processWeeklyEvents()`, so films sit in DEVELOPMENT indefinitely (verified: 18 months, phase never moved).
- **Two more S0-class defects:** an uncaught `TypeError: window.AudioSystem.playSound is not a function` fired during normal play (`js/ui/tutorial.js:938`), and a fully wired audio system (mute button + 3 volume sliders in the header) with **zero audio assets** — 18 file-not-found requests per short session (plan §6 calls this an automatic S0).
- **Commercial packaging is otherwise feasible:** the game boots clean from `file://`, uses only relative paths and localStorage, and the save system (5 slots, autosave, ironman, import/export, storage meter) is genuinely above the reference class. The single external request (Google Fonts, `index.html:26`) violates the project's own no-external-requests rule and stalls the window `load` event offline. What's missing for a $20 product is the first five minutes: no title screen, no Continue, no studio naming, no settings, and a tutorial that opens on top of the scenario picker.

---

## Console errors found

Captured via Playwright `console`/`pageerror` listeners on boot and through scripted play.

**On load (before any input):**

| Type | Message | Source |
|---|---|---|
| error | `Failed to initialize DashboardUI ReferenceError: getAllFilms is not defined` | `js/ui/dashboard.js:207` via `updateDashboard` → caught and logged by `js/core/integration.js:63`, so init aborts silently |
| error | `Failed to load resource: net::ERR_CONNECTION_RESET` (Google Fonts) | `index.html:26` — also delays the window `load` event indefinitely when the CDN is unreachable (goto with `waitUntil:'load'` timed out at 30s in this environment) |
| error ×2 | `net::ERR_FILE_NOT_FOUND` — `audio/music/menu-theme.mp3`, `audio/music/1930s-jazz-theme.mp3` | `js/systems/audio.js:353` |
| warning | `Could not play music: NotAllowedError … user didn't interact` | autoplay attempt before first gesture |

**During a short scripted session (skip tutorial → greenlight → 4 months):** 16 further `net::ERR_FILE_NOT_FOUND` for `audio/sfx/page-turn.mp3`, `film-projector-start.mp3`, `cash-register.mp3`, `calendar-page.mp3`, `money-out.mp3` (every SFX hook fires against missing files).

**Uncaught exceptions (S0 per protocol):**

1. `Uncaught TypeError: window.AudioSystem.playSound is not a function` — `js/ui/tutorial.js:938` (fires when a tutorial mission completes; the API is `playSFX`, not `playSound`). Observed twice in the 60-week run's `pageerror` stream.
2. `ReferenceError: getAllFilms is not defined` becomes **uncaught** on every load action: `js/ui/save-load-ui.js:387` and `js/ui/keyboard-shortcuts.js:134` call `DashboardUI.updateDashboard()` with no try/catch. Observed effect (probe run): after Ctrl+L the game state reverted to Jan 1933 but the header still displayed "February 1933", and the "Game loaded successfully" notification never fired because the handler died mid-function.

---

## Screenshots

Saved to `docs/audit/screens/` (all 1440×900 unless noted):

| File | What it shows |
|---|---|
| `01-loading-screen.png` | Fixed 3-second fake loading screen ("Establishing Studio Empire…") |
| `02-scenario-select.png` | **Tutorial "Step 1 of 13" opens on top of the SELECT YOUR SCENARIO modal** — two onboarding flows stacked |
| `03-tutorial-overlay.png` | Tutorial overlay state after scenario auto-selected |
| `04-dashboard.png` | Full dashboard after tutorial skip (full-page) |
| `05-scripts-section.png` | Scripts grid — note **"The Public Enemy" listed twice**, and cash card reads $600,000 although Classic Start grants $410,000 |
| `06-modal-after-greenlight.png` | State after greenlight click (pre-Code: no censorship modal, silent success) |
| `07-newspaper-modal.png` | Dashboard after first month-advance: "No films currently in production" despite 1 active film; stale welcome alert |
| `08-dashboard-4-months.png` | Full dashboard May 1933: **cash still $600,000 (actual: $260,000), CONTENT REGULATION stuck on "Loading...", all panels stale** (full-page) |
| `09-save-modal.png` | Save/Load modal (slots, tabs) — this modal works |
| `10-after-h-key.png` | After pressing `h` — no help opened (no such shortcut exists) |

---

## Information hierarchy

Reference questions ("how am I doing / what needs attention / what's next" in <5s each), assessed against `index.html:67-317`, `css/main.css`, `js/ui/dashboard.js`:

- **"How am I doing?" — the layout says yes, the data says no.** The three-card strip (CASH / MONTHLY BURN / RUNWAY, `index.html:68-85`) is exactly the right hierarchy for a tycoon game and is the first thing under the header. But it displays wrong numbers for the entire session (see UX-001/UX-004): screenshot `08` shows $600,000 / 120 weeks in May 1933 when the real state was $260,000. A player literally cannot answer the most basic question truthfully.
- **"What needs my attention?" — buried and stale.** ALERTS is the 3rd of 9 equal-weight panels in a single-column scroll; at 1440×900 it sits at the fold (~y≈880 in `08-dashboard-4-months.png`). It never updates after boot (the working `updateAlerts` renderer is dead; the fallback writes to nonexistent `#game-alerts`, `js/core/game-state.js:648`). The "Films Ready for Release" alert — the single most important prompt in the game — is generated inside the dead code path (`js/ui/dashboard.js:958`).
- **"What's next?" — the primary verbs are at the bottom of the scroll.** `#game-navigation` and `#time-controls` (`index.html:280-317`) are static flow elements (`css/main.css:356`, `:473` — no `position: fixed/sticky`), rendered *below* nine stacked panels on a page that is ~2,700px tall (see full-page `08`). The most frequent action in the game (advance time) requires scrolling past everything, every time. Reference-class games pin time controls permanently (Game Dev Tycoon: always-visible clock; Mad Games Tycoon 2: fixed top bar).
- Nine `game-panel` blocks with identical visual weight (FILMS / THEATERS / ALERTS / EVENTS / REGULATION / TECHNOLOGY / FRANCHISES / NEWS / STATUS) — no prioritization, several permanently in empty state ("Loading...", "No franchises yet") for hours of play. The floating "Tutorial Missions" pill overlaps the RECENT EVENTS panel content (screenshot `07`, bottom right).

---

## CSS coherence

15 files, 12,513 lines total. `css/design-tokens.css` (491 lines) is a competent glassmorphic token system — but adoption is split down the middle:

- **Token adoption by file (count of `var(--…)` uses):** components 442, screens 305, main 270, timeline 121, talent 89, scenarios 87, responsive 87, animations 21 — versus **zero** in `tutorial.css`, `studio-lot.css`, `newspaper.css`, `modals-extended.css`, `help.css`, `achievements.css`. Six of fifteen files ignore the design system entirely.
- **Hardcoded hex colors outside design-tokens.css: 546** (modals-extended 234, tutorial 61, achievements 58, help 50, newspaper 48, studio-lot 47…). **Hardcoded `font-size` px/rem literals outside tokens: 377.**
- **Two competing token systems:** `css/main.css:3-31` defines its own legacy `:root` palette (`--primary-gold: #B8860B`, `--secondary-gold: #DAA520`, `--ivory`) that predates and disagrees with `design-tokens.css` gold ramp (`--color-gold-400: #F7C96B`). Both are used live; the same "gold" renders as at least 3 different hues (also `#d4af37` hardcoded in help/newspaper/tutorial focus styles).
- **z-index anarchy: 19 distinct values** (-1, 0, 1, 10, 100, 500, 1000, 1500, 2000, 2999, 3000, 4000, 9000, 9998, 9999, 10000, 10001, 10002, 10003). Tutorial claims 9000–10003 (`css/tutorial.css:17,40,61,329,427,454,576` — one `!important`), modals-extended claims 9999/10000, main.css notifications 9999. The observed "tutorial covers scenario-selection modal" collision (screenshot `02`) is a direct consequence — there is no layering scale in the tokens file.
- **Overflow:** no horizontal overflow at 1280×800 or 1440×900 (`document.scrollWidth == clientWidth`, measured). `overflow-x: hidden` on body (`main.css:46`) would mask any regressions rather than prevent them. Wide content risk is low; vertical sprawl (single-column 2,700px dashboard) is the real issue.

---

## Feedback inventory

For each common action: what the player sees/hears at the moment of action. "SFX (silent)" = a wired `AudioSystem.playSFX` hook whose asset file 404s — effectively nothing.

| # | Action | Visual feedback | Audio | Net player experience |
|---|---|---|---|---|
| 1 | Advance week (`#btn-advance-week`) | Date text swap only (HUD frozen, panels dead) | `calendar_flip` SFX (silent) — `js/systems/audio-integration.js:47` | Silent state swap |
| 2 | Advance month (`#btn-advance-month`) | Date text swap; newspaper modal on some months (`js/systems/newspaper.js`) | `calendar_flip` (silent) | Newspaper is the one good beat; otherwise silent — and production doesn't even progress (UX-002) |
| 3 | Greenlight script | Alert pushed to a dead panel (`integration.js:295`); no modal in pre-Code era | `greenlight` + `cash_register` SFX (silent) — `audio-integration.js:52-54` | **Player gets no visible confirmation at all** (screenshot `06`); the script card stays in the grid |
| 4 | Sign/cast talent | `showNotification` toast (talent addon) | none wired | Toast only |
| 5 | Release/distribute film | Alert + toast per `integration.js:438` | `film_release`, `money_positive` (silent) | **Unreachable — button never renders** (UX-001) |
| 6 | Take loan | Alert (dead panel) | `cash_register` (silent) | Invisible |
| 7 | Save game | Toast "Game Saved" + autosave indicator (`#autosave-indicator`) | none | Good — one of the few complete loops |
| 8 | Load game | Toast never fires (handler crashes, UX-005) | none | Broken |
| 9 | Section navigation | Active-state pill, panel swap | `navigation` SFX (silent) | Adequate |
| 10 | Box-office weekly result | `showWeeklyBoxOfficeUpdate` popup (`js/ui/dashboard-visuals.js:171`), count-up keyframes exist | `money_positive` (silent) | Unreachable in practice (films never release) |

Infrastructure worth keeping: `css/animations.css` has **63 keyframes** (cashRegister, countUp, starBurst, curtainOpen…), `js/core/visual-event-triggers.js` dispatches CustomEvents for milestones, and `js/systems/audio-integration.js` wires 13+ EventBus SFX hooks. The juice layer was designed; it is starved by (a) zero audio assets and (b) the dead dashboard pipeline that would host most of the visual feedback.

---

## Accessibility

- **Focus states: pass.** `css/components.css:8-16` gives all interactive elements a 3px gold `:focus-visible` outline; verified computed `3px solid rgb(247,201,107), offset 2px` in live page. Caveat: `transition: all 0.2s` on buttons (e.g. `main.css .audio-btn`) animates the outline in from 0px — cosmetic, not a blocker. Five scoped `outline: none` cases all have replacement styling.
- **Keyboard navigability: fail for actual play.** `js/ui/keyboard-shortcuts.js` implements only Ctrl+S / Ctrl+L / Ctrl+Shift+S / Ctrl+Shift+L / Escape. No keys for advance time, section nav, or script actions. All buttons are tabbable so the game is *technically* keyboard-operable, but core play means tabbing through 20+ stops per action. Escape does **not** close the tutorial overlay (verified; only the × button + a native `confirm()` does), and there is no focus trap in any modal.
- **prefers-reduced-motion: pass.** Honored in 7 files (`design-tokens.css:422` zeroes all duration tokens; `animations.css:777`, `responsive.css:548`, etc.).
- **Contrast (computed on live palette):** `--color-text-secondary` 10.7:1 and `--color-text-tertiary` 5.35:1 pass AA; **`--color-text-muted` (rgba(255,255,255,.35) on #12121A) = 3.21:1 — fails AA 4.5:1** and is used for all empty-state text and placeholders. Gold-400 on bg-primary = 12.7:1 (fine).
- **ARIA:** decent floor in static HTML — `#notifications` has `aria-live="polite" role="status"` (`index.html:321`), 3 dialogs carry `role="dialog"/"alertdialog"` + `aria-modal`, audio buttons have `aria-label`s, 0 unlabeled icon buttons found at runtime. But dynamically injected modals (`#modal-content` HTML strings from `integration.js`, `censorship.js`, etc.) rely on the one static wrapper; no `aria-hidden` management or focus return.

---

## External requests

Full sweep of `index.html`, `js/**`, `css/**` for `http(s)://`, `fetch(`, `XMLHttpRequest`, `new Audio`:

- **Exactly one external request: Google Fonts** — `index.html:26` (`fonts.googleapis.com/css2?family=Playfair+Display…Lato…Cinzel`). This (a) violates the repo's own rule (`.claude/rules/security.md`: "No external requests: All assets bundled locally"), (b) leaks user IP/UA to Google on every launch (GDPR-relevant for a paid EU release), (c) when the CDN is unreachable the `load` event stalls until network timeout (measured: >30s in this sandbox) and all three display fonts silently fall back to system serif/sans — the entire art-deco typographic identity is a network dependency.
- No `fetch`/XHR anywhere. `new Audio(...)` loads only local relative paths (`js/systems/audio.js:353,461`) — files simply don't exist (see SHIP-003).
- **Offline verdict: playable but degraded** (fonts fall back, long first-load stall). Fix is trivial: self-host the three families as woff2 (~150KB).

---

## First five minutes

Observed new-player path (screenshots `01`–`04`):

1. `index.html` → **3-second fixed fake loading screen** (`game-state.js:92-98` — a hardcoded `setTimeout(…, 3000)`, not real loading).
2. No title screen or main menu. `startNewGame()` fires unconditionally (`game-state.js:95`) → SELECT YOUR SCENARIO modal (which is good content: 5+ scenarios with difficulty, year, cash, reputation).
3. **Simultaneously, the interactive tutorial (Step 1 of 13) opens on top of the scenario picker** (screenshot `02`). Escape is a no-op; skipping requires the × and then a native `confirm()` dialog (`tutorial.js:711`).
4. **No Continue.** An existing save is never offered at boot — the player must know to click LOAD. No "you have a save from yesterday" hook at all.
5. **No studio naming.** `studioName` is hardcoded `'Mogul Pictures'` (`game-state.js:174`); the header brand never changes. (Consequence: the input-sanitization requirement in `.claude/rules/security.md` is moot — there is no user text input in the game beyond save import file selection.)
6. **No settings.** The only options surface is the header audio popover (3 sliders for audio that doesn't exist).
7. First informed decision (greenlight) produces no visible acknowledgment (Feedback #3), and the HUD is already lying about cash.

**Reference comparison.** *Game Dev Tycoon* minute one: title menu (New/Continue/Settings), company + founder naming, contextual drip tutorial, every action animated with sound. *Mad Games Tycoon 2*: new-game setup screen (difficulty, era, map), settings from menu, autosave prompt. MOGUL's scenario picker is actually competitive content-wise — but it's wrapped in no shell: no menu, no naming, no continue, colliding overlays, silent actions.

---

## Meta features

- **Save slots: above reference class (when not blocked by the load bug).** `js/ui/save-load-ui.js` (591 lines) + `js/core/save-load.js` (1,250 lines): 5 named slots with metadata, quick save/load, autosave slot + on-screen autosave indicator, ironman mode (single-slot, no manual saves, toggle guarded by confirm), JSON export/import per slot, localStorage usage meter, delete-with-confirmation, clear-all "danger zone". Verified: quick save wrote `hollywood-mogul-saves` + `hollywood-mogul-save-settings`; state round-tripped correctly ($390,000 → load → $410,000). **But** every load path ends in the uncaught `getAllFilms` error, leaving the UI stale (UX-005) — save works, load is broken as experienced.
- **Pause / speed:** the game is turn-based (explicit week/month buttons), so pause is structurally unnecessary; there are no speed controls and no "advance until event" convenience. Acceptable design, worth a "play to next decision" button at the reference class.
- **Options persistence:** only audio prefs persist (`hollywoodMogul_audioPrefs`, `js/systems/audio.js:254,283`). Nothing else exists to persist (no display, difficulty, or accessibility options).
- **Reset/uninstall:** "CLEAR ALL SAVES" behind a **double native `confirm()`** (`save-load-ui.js:537,541`). Native `confirm()`/`alert()` appear in 5 flows (also `tutorial.js:711`, `dashboard-talent-addon.js:242`) — browser-chrome dialogs inside a styled game read as unfinished and behave inconsistently in desktop webviews.

---

## Packaging notes

Assessment for a Tauri/Electron wrap (plan §9):

- **Green:** Boots and plays entirely from `file://` (all audit runs used it). All asset/script/CSS paths are relative. No fetch/XHR, no server assumptions, no absolute paths. Persistence is 100% localStorage — works in both Electron and Tauri (WKWebView/WebView2) out of the box. jsdom-free vanilla JS; no build step to reproduce.
- **Must fix before wrapping:**
  - Bundle the Google Fonts locally (SHIP-001) — in a desktop webview with no network this is the difference between branded and generic typography, and the `load`-event stall can delay `DOMContentLoaded`-gated tooling.
  - Replace native `confirm()` dialogs — sync dialogs are disabled or ugly in some webviews (Tauri requires the dialog allowlist; Electron renders OS dialogs that break fullscreen).
  - Audio: `new Audio()` with missing files logs 18 errors per session; a desktop release either ships assets or strips the system.
- **Should fix:** 43 `console.*` calls in shipping code; `js/systems/unused/` (~5k lines) ships in the install; no app icon/window-title/menu handling anywhere; localStorage is per-partition in Electron — Steam cloud save requires migrating saves to real files (the existing export/import JSON path is 80% of that work).
- **Steam specifics:** achievements system exists in-game (`js/systems/achievements.js`) and could map to Steamworks; overlay requires hardware acceleration (fine); cloud save needs the file-backed saves above. itch.io could take the folder as-is today (HTML5 upload), modulo the font CDN.
- **Verdict:** packaging is a **small** workstream (days) — commercial readiness is gated by the S0 gameplay defects, not by the wrap.

---

## Findings (JSON)

```json
[
  {
    "id": "UX-001",
    "workstream": "ux",
    "severity": "S0",
    "title": "Core loop is unwinnable: dashboard render pipeline crashes, so films can never be released",
    "evidence": "js/ui/dashboard.js:207 and :958 call getAllFilms(), which is not defined in that file's IIFE scope (it is a private function of js/systems/boxoffice.js:182). DashboardUI.init() therefore throws before bindEventHandlers() and before its 3s update interval starts (js/ui/dashboard.js:17-37); integration.js:63 catches and logs 'Failed to initialize DashboardUI'. The only creators of .distribute-btn are the dead paths dashboard.js:274 and dashboard-visuals.js:123 (invoked via the same broken updateDashboard), and the only callers of BoxOfficeSystem.releaseFilm are dashboard.js:799 and integration.js:435, both gated on that button. Scripted 60-week run: film reached COMPLETED at week ~20, document.querySelectorAll('.distribute-btn').length stayed 0 for 60 weeks, totalRevenue stayed 0, bankruptcy at week 40.",
    "repro": "Open index.html; pick Classic Start; skip tutorial; greenlight any script; advance 60 weeks. No distribute option ever appears; console shows 'Failed to initialize DashboardUI ReferenceError: getAllFilms is not defined' on boot.",
    "player_impact": "Every campaign is a guaranteed slow bankruptcy with zero revenue; the game cannot be played to any win state",
    "suggested_direction": "Define/import getAllFilms in dashboard.js (copy the helper from visual-enhancements-integration.js:126); add a smoke test that boots the page and asserts DashboardUI initialized",
    "confidence": "high"
  },
  {
    "id": "UX-002",
    "workstream": "ux",
    "severity": "S0",
    "title": "'ADVANCE 1 MONTH' never processes film production — films stall in DEVELOPMENT forever",
    "evidence": "js/core/game-state.js:274-281 advanceMonth() calls processMonthlyExpenses() and processMonthlyEvents() only; ProductionSystem.processWeeklyProduction is invoked solely from processWeeklyEvents() (game-state.js:337-351), which only advanceWeek() calls. Scripted run: 18 consecutive month-advances after greenlight, film phase stayed 'DEVELOPMENT' the entire time while cash drained 320000 to -20000. Week-advance runs progress normally (PRE_PRODUCTION at wk4, COMPLETED at wk20).",
    "repro": "Greenlight a script, click ADVANCE 1 MONTH repeatedly; observe activeFilms[0].phase never changes",
    "player_impact": "The most prominent time button silently breaks the core loop; players who prefer month steps see productions frozen and go bankrupt",
    "suggested_direction": "advanceMonth() should iterate 4 weekly ticks (or call production/boxoffice processing directly)",
    "confidence": "high"
  },
  {
    "id": "UX-003",
    "workstream": "ux",
    "severity": "S0",
    "title": "Uncaught TypeError during normal play: AudioSystem.playSound is not a function",
    "evidence": "js/ui/tutorial.js:938 calls window.AudioSystem.playSound('achievement'); the AudioSystem public API (js/systems/audio.js) exposes playSFX/playProceduralSFX but no playSound. Captured twice as page-level uncaught exceptions during the 60-week scripted run (tutorial mission completion path).",
    "repro": "Play with tutorial missions active until a mission completes; observe uncaught TypeError in console",
    "player_impact": "Uncaught exception mid-play; whatever code follows in that handler never runs",
    "suggested_direction": "Rename to playSFX('achievement'); add an ESLint no-undef style pass over window.* API calls",
    "confidence": "high"
  },
  {
    "id": "UX-004",
    "workstream": "ux",
    "severity": "S0",
    "title": "Financial HUD and all dashboard panels are frozen at boot values for the whole game",
    "evidence": "Fallback renderer in js/core/game-state.js writes to element IDs that do not exist in index.html: #cash-display/#burn-display/#runway-display/#runway-status (game-state.js:526-561), #active-productions (:565), #theater-films (:609), #game-alerts (:648) — index.html uses #current-cash, #monthly-burn, #cash-runway, #films-in-production, #films-in-theaters, #alerts-section. The renderer that targets the correct IDs (DashboardUI) is dead per UX-001. Screenshots 05/08: header shows $600,000 and '120 weeks' in May 1933 when actual state was $260,000; FILMS IN PRODUCTION shows 'No films' with 1 active film; CONTENT REGULATION shows 'Loading...' permanently.",
    "repro": "Start Classic Start ($410,000) — header immediately wrong ($600,000); advance months — cash display never changes",
    "player_impact": "Player cannot see their money, runway, productions, or alerts — the core readouts of a tycoon game all lie",
    "suggested_direction": "Delete the dead game-state.js DOM code (single-renderer rule) and fix UX-001; add a DOM-contract test asserting every getElementById target exists in index.html",
    "confidence": "high"
  },
  {
    "id": "UX-005",
    "workstream": "ux",
    "severity": "S1",
    "title": "Every load path throws uncaught and leaves the UI showing pre-load state",
    "evidence": "js/ui/save-load-ui.js:387 (applyLoadedGameState) and js/ui/keyboard-shortcuts.js:134 (handleQuickLoad) call DashboardUI.updateDashboard() unguarded; it throws ReferenceError (UX-001) after updating only the cash card. Probe run: quick save at Jan 1933/$410,000, advance to Feb ($390,000), Ctrl+L — state correctly reverted but header date still read 'February 1933' and the 'Game loaded successfully' notification never fired.",
    "repro": "Quick save, advance a month, Ctrl+L; compare #current-date vs HollywoodMogul.getGameState().currentDate",
    "player_impact": "Loading appears broken/does nothing; players will assume their save is corrupt",
    "suggested_direction": "Fix UX-001; make load re-render via a single 'state:loaded' EventBus event with try/catch per subscriber",
    "confidence": "high"
  },
  {
    "id": "UX-006",
    "workstream": "ux",
    "severity": "S1",
    "title": "Onboarding collision: tutorial (13 steps) opens on top of the scenario-selection modal",
    "evidence": "Screenshot 02-scenario-select.png: 'Step 1 of 13' tutorial box overlays SELECT YOUR SCENARIO. Tutorial overlay (css/tutorial.css:17, z-index 10000) sits above #modal-overlay; it intercepts all pointer events (Playwright click on nav timed out 30s: 'tutorial-overlay intercepts pointer events'). Escape does not dismiss it (verified); skip requires the small × then a native confirm() (js/ui/tutorial.js:711).",
    "repro": "Load index.html fresh (no localStorage); wait 3s",
    "player_impact": "First 30 seconds are two competing modal flows; the player is taught the UI before choosing a game",
    "suggested_direction": "Sequence: menu -> scenario -> then offer tutorial; give tutorial Escape handling and an in-DOM confirm",
    "confidence": "high"
  },
  {
    "id": "UX-007",
    "workstream": "ux",
    "severity": "S1",
    "title": "Primary controls (time advance + section nav) live at the bottom of a ~2,700px single-column scroll",
    "evidence": "index.html:280-317 places #game-navigation and #time-controls after all 9 dashboard panels; css/main.css:356 and :473 style them as static flex blocks (no fixed/sticky). Full-page screenshot 08-dashboard-4-months.png (1440x2723) shows them at the very bottom; at 1440x900 the ALERTS panel is already at the fold.",
    "repro": "Open dashboard at 1440x900; try to click ADVANCE 1 WEEK without scrolling",
    "player_impact": "The most frequent action in the game requires a full-page scroll every turn; core info hierarchy fails the 5-second test",
    "suggested_direction": "Pin time controls + nav in a persistent bar (header or footer); collapse empty panels",
    "confidence": "high"
  },
  {
    "id": "SHIP-003",
    "workstream": "ship",
    "severity": "S0",
    "title": "Header ships mute button + three volume sliders for an audio system with zero audio assets",
    "evidence": "index.html:40-64 (audio controls UI); js/systems/audio.js + audio-integration.js wire 13+ SFX and era music tracks, but audio/music and audio/sfx contain only READMEs. One boot + 4 months of play produced 18 net::ERR_FILE_NOT_FOUND requests (menu-theme.mp3, 1930s-jazz-theme.mp3, page-turn.mp3, film-projector-start.mp3, cash-register.mp3, calendar-page.mp3, money-out.mp3). AUDIT-PLAN.md section 6 defines volume sliders for silence as automatic S0 ('obviously unfinished').",
    "repro": "Open the game, click the speaker/gear icons; play a month; watch the network/console",
    "player_impact": "Visible controls that do nothing scream unfinished product; console error spam",
    "suggested_direction": "Ship the asset list audio-integration.js already implies (the AUDIO workstream's shopping list), or hide the controls until assets exist",
    "confidence": "high"
  },
  {
    "id": "SHIP-001",
    "workstream": "ship",
    "severity": "S1",
    "title": "Google Fonts CDN is the game's only external request: privacy leak, offline degradation, load stall",
    "evidence": "index.html:26 loads fonts.googleapis.com (Playfair Display, Lato, Cinzel). Violates .claude/rules/security.md ('No external requests'). Measured: with the CDN unreachable, window 'load' did not fire within 30s (Playwright goto waitUntil:'load' timeout) and all display fonts fell back to system serif/sans, erasing the art-deco identity. Full repo grep confirms no other external URL, no fetch/XHR.",
    "repro": "Disconnect network; open index.html; observe fallback typography and long pending request",
    "player_impact": "Offline/desktop builds lose the visual identity; IP leak to Google on every launch of a paid product",
    "suggested_direction": "Self-host woff2 subsets (~150KB) with font-display:swap",
    "confidence": "high"
  },
  {
    "id": "SHIP-002",
    "workstream": "ship",
    "severity": "S1",
    "title": "No first-five-minutes shell: no title screen, no Continue, no studio naming, no settings",
    "evidence": "js/core/game-state.js:89-99 boots via a hardcoded 3s setTimeout 'loading' screen then unconditionally startNewGame() -> scenario modal; existing saves are never offered (no continue path anywhere in js/). studioName is hardcoded 'Mogul Pictures' (game-state.js:174) with no naming input in index.html (input-sanitization rule is moot — no user text input exists). Only 'settings' surface is the header audio popover. Reference: Game Dev Tycoon and Mad Games Tycoon 2 both open with menu (New/Continue/Settings) + company naming in minute one.",
    "repro": "Open index.html with an existing save in localStorage — you are routed to new-game scenario selection regardless",
    "player_impact": "A $20 buyer's first minute reads as tech demo; returning players can silently lose progress by starting a new game",
    "suggested_direction": "Add a main menu (Continue if autosave exists / New Game / Load / Settings / Credits) and a studio-naming step (sanitize per security.md)",
    "confidence": "high"
  },
  {
    "id": "UX-008",
    "workstream": "ux",
    "severity": "S2",
    "title": "Core actions are silent state swaps: all SFX hooks 404 and greenlight has no visible acknowledgment",
    "evidence": "Feedback inventory table (this report): greenlight produces only an alert pushed to a dead panel (integration.js:295 -> addAlert -> #game-alerts which doesn't exist) and a silent SFX; advance-time is a date text swap; loans/releases invisible. 63 keyframes in css/animations.css and CustomEvent triggers in js/core/visual-event-triggers.js exist but their host surfaces never render (UX-001).",
    "repro": "Greenlight a script in 1933 (pre-Code, no censorship modal): nothing visible happens",
    "player_impact": "Actions feel weightless; flat feedback is explicitly below the reference class",
    "suggested_direction": "After fixing UX-001, route every verb through toast + panel animation; ship audio (SHIP-003)",
    "confidence": "high"
  },
  {
    "id": "UX-009",
    "workstream": "ux",
    "severity": "S2",
    "title": "Design-token system ignored by 6 of 15 CSS files; 546 hardcoded hex colors and 377 hardcoded font-sizes; duplicate legacy palette",
    "evidence": "var(--) usage counts: 0 in tutorial.css, studio-lot.css, newspaper.css, modals-extended.css (234 hex), help.css, achievements.css; 546 hex literals outside design-tokens.css; 377 font-size px/rem literals outside tokens. css/main.css:3-31 defines a second, conflicting :root palette (--primary-gold #B8860B vs tokens --color-gold-400 #F7C96B; #d4af37 hardcoded in 3 more files).",
    "repro": "grep counts per this report's CSS coherence section",
    "player_impact": "Visible hue/typography drift between screens (modals vs dashboard vs tutorial); every reskin costs 6 files",
    "suggested_direction": "Migrate the six token-free files to tokens; delete the legacy main.css palette",
    "confidence": "high"
  },
  {
    "id": "UX-010",
    "workstream": "ux",
    "severity": "S2",
    "title": "z-index anarchy: 19 distinct values up to 10003 with no layering scale",
    "evidence": "Census: -1,0,1,10,100,500,1000,1500,2000,2999,3000,4000,9000,9998,9999,10000,10001,10002,10003. Tutorial (tutorial.css:17,61,329,427 !important,576) outranks modals (modals-extended.css:966, main.css:64) — producing the tutorial-over-scenario collision in screenshot 02.",
    "repro": "grep -rn 'z-index' css/",
    "player_impact": "Unpredictable overlay stacking; any new modal risks appearing under/over the wrong layer",
    "suggested_direction": "Add --z-* tokens (base/panel/nav/modal/tutorial/toast) to design-tokens.css and replace all literals",
    "confidence": "high"
  },
  {
    "id": "UX-011",
    "workstream": "ux",
    "severity": "S2",
    "title": "Keyboard support limited to save/load; game not practically playable without a mouse",
    "evidence": "js/ui/keyboard-shortcuts.js:39-82 implements only Ctrl+S, Ctrl+L, Ctrl+Shift+S/L, Escape. No shortcuts for advance week/month, section navigation, or modal confirmation. Tutorial overlay ignores Escape (verified); modals have no focus trap. Focus-visible styling itself is good (components.css:8-16, verified 3px gold outline).",
    "repro": "Try to play one month keyboard-only",
    "player_impact": "Accessibility reviews and power users hit a wall; 'unplayable without a mouse' is review bait at $20",
    "suggested_direction": "Add Space/N = advance, 1-7 = sections, Enter/Escape in all modals, focus trap util",
    "confidence": "high"
  },
  {
    "id": "UX-012",
    "workstream": "ux",
    "severity": "S2",
    "title": "Initial script pool contains duplicate titles (selection with replacement)",
    "evidence": "Screenshot 05-scripts-section.png shows 'The Public Enemy' twice in the 5-card initial grid. js/data/scripts.js:2420-2431 generateInitialScripts() draws via selectScriptByType from overlapping pools with no dedupe ('The Public Enemy' exists once in data, scripts.js:16).",
    "repro": "New game; open SCRIPTS; repeat a few seeds",
    "player_impact": "Immediately undermines content credibility in the first minute",
    "suggested_direction": "Dedupe by title/id when generating; same for generateMonthlyScripts",
    "confidence": "high"
  },
  {
    "id": "SHIP-004",
    "workstream": "ship",
    "severity": "S2",
    "title": "Native browser confirm()/alert() dialogs in 5 player-facing flows",
    "evidence": "js/ui/tutorial.js:711 (skip tutorial), js/ui/save-load-ui.js:453 (ironman), :537 and :541 (double-confirm clear-all), js/ui/dashboard-talent-addon.js:242 (release talent). OS chrome breaks the art-deco presentation and behaves inconsistently in desktop webviews (Tauri dialog allowlist; Electron OS dialogs over fullscreen).",
    "repro": "Click Skip Tutorial or Clear All Saves",
    "player_impact": "Reads as unfinished; jarring in a packaged desktop build",
    "suggested_direction": "Reuse the existing #delete-confirm-modal pattern (index.html:462) as a generic styled confirm",
    "confidence": "high"
  },
  {
    "id": "SHIP-005",
    "workstream": "ship",
    "severity": "S2",
    "title": "Desktop wrap is feasible but needs hygiene: fonts, console noise, dead code, file-backed saves for Steam cloud",
    "evidence": "Verified: full boot/play from file:// with relative paths only; persistence purely localStorage (keys hollywood-mogul-saves, hollywood-mogul-save-settings, hollywoodMogul_audioPrefs); no fetch/XHR. Gaps: 43 console.* calls in shipping js/ (excluding js/systems/unused/); js/systems/unused/ (~5k lines) ships; no app icon/menu/window handling; Electron localStorage is per-partition so Steam cloud save needs file-backed saves (export/import JSON in save-load-ui.js:396-446 is most of the work).",
    "repro": "See Packaging notes section",
    "player_impact": "None today; determines effort/quality of the sellable build",
    "suggested_direction": "Tauri wrap + local fonts + strip console/unused + route saves through the existing export path to disk",
    "confidence": "medium"
  },
  {
    "id": "UX-013",
    "workstream": "ux",
    "severity": "S3",
    "title": "Empty-state/placeholder text fails WCAG AA contrast",
    "evidence": "--color-text-muted rgba(255,255,255,0.35) over #12121A computes to 3.21:1 (AA requires 4.5:1). Used for .no-content empty states and placeholders across the dashboard.",
    "repro": "Computed in live page (probe script, this audit)",
    "player_impact": "Low-vision players can't read empty states; minor review risk",
    "suggested_direction": "Raise muted to rgba(255,255,255,0.55) or reserve it for decorative text",
    "confidence": "high"
  },
  {
    "id": "UX-014",
    "workstream": "ux",
    "severity": "S3",
    "title": "3-second hardcoded fake loading screen on every boot",
    "evidence": "js/core/game-state.js:90-98: showLoadingScreen(); setTimeout(init work + hide, 3000). Nothing loads during the delay (all scripts are already parsed).",
    "repro": "Open index.html; time the loading bar",
    "player_impact": "3 wasted seconds per launch; fake progress erodes trust",
    "suggested_direction": "Cut to ~300ms or gate on an actual ready signal",
    "confidence": "high"
  }
]
```

---

## Not covered

Per the audit ground rule, what this workstream did **not** do:

- **Full screenshot sweep of every modal/state** (plan §5 asks for all screens): censorship/PCA modal (pre-Code start bypasses it), MPAA rating modal, Oscar ceremony, crisis modals, era-transition modal, game-over screen, newspaper front page (month-advance runs closed modals blind; `07` caught none open), achievements/timeline/studio/talent/finances sections, and phone-width layouts. The three required screens + save modal + tutorial + scenario select are captured.
- **Responsiveness matrix**: verified no horizontal overflow at 1280×800 and 1440×900 only; 1920×1080 and the documented floor untested.
- **Legal exposure inventory** (real historical figures in `talent-roster.js`) — in plan §9 but out of my task's items 6–9; needs the HIST workstream's roster pass.
- **Contrast audit beyond the token palette** (per-component sampling, e.g. gold-on-gold buttons).
- **Screen reader walk-through** (only static ARIA + focus probes done).
- **Long-session behavior** (60 in-game weeks max here; no 1933→2010 UI endurance run, no memory profiling — CODE workstream).
- The Google Fonts failure mode observed here (proxy connection reset) approximates but is not identical to a true offline environment.
