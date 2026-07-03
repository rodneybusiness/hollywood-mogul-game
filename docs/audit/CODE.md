# CODE Workstream — Code Health, Architecture & Performance Audit

Audit date: 2026-07-02. Method: static analysis (AST-based dependency extraction via acorn) **plus** empirical execution — the full game was booted headlessly under jsdom exactly as the browser loads it (all 44 script tags in order, DOMContentLoaded, real timers), then driven through complete 1933→2010 campaigns on both the monthly and weekly time paths. Every headline claim below was reproduced by running the code, not just reading it.

Simulation harness: `boot-sim.js` / `campaign-sim.js` (scratchpad; trivially re-creatable — they load `index.html`, eval each `<script src>` in order under jsdom with `url: https://localhost/`, then call `HollywoodMogul.startNewGameWithScenario('classic_start')` and `advanceTime(...)` in a loop).

## Summary

- **The two time buttons run disjoint simulations (S0).** "Advance Month" never runs weekly processing, so films never progress and box office never pays out (verified: 924 films greenlit over 77 sim-years, all still in `activeFilms`, 0 completed). "Advance Week" never runs monthly processing, so no new scripts, no historical events, and no Oscars ever occur (verified: 77 weekly-play years produced 0 Oscar ceremonies and 0 historical events).
- **`EventBus.clear()` at game start wipes every subscription registered during init (S0, verified: listener count drops to `{}`).** Monthly loan processing, newspaper, scenario victory checks, ironman autosave, era display, and MPAA-rating completion are all dead in actual play.
- **Three always-crash APIs sit on player-facing paths (S0):** `DashboardUI.updateDashboard()` (ReferenceError `getAllFilms`, aborts `DashboardUI.init` entirely), `BoxOfficeSystem.releaseFilm()` (TypeError `TimeSystem.getCurrentDate is not a function` on every strategy), and `ProductionSystem.greenlightScript()` (TypeError `ScriptLibrary.getScriptById is not a function`) — the latter means the only working greenlight path bypasses the censorship system entirely.
- **Save/load loses ~40 live state fields** (loans/debt, fired-historical-event flags, Oscar history, crisis state, tutorial progress, scenario modifiers), and a late-game save measured **2.0–2.8 MB** (dominated by a never-pruned `availableScripts` array of ~2,760 entries); one slot plus its backups consumed **4.02 MB of the ~5 MB localStorage quota** — multiple slots cannot fit.
- **~7,000 lines of dead code ship with the game**: `GameController` (401 lines, the only emitter of `era:changed` and only caller of rival/TV/achievement ticks), `ModalSystem` (655 lines, `init` never called), `CrisisSystem` (597 lines, zero external references), `VisualEvents`, `DOMUtils`, and `js/systems/unused/` (4,952 lines). There is **no global error handler** and zero try/catch in the month-advance pipeline.

---

## Dependency graph

Extracted from `index.html:507-558` (44 `<script>` tags) with an acorn AST pass separating **eval-time** references (execute while the script loads) from **deferred** references (inside functions called later).

**Key structural result:** every file's IIFE only *writes its own global* at eval time (e.g. `window.DashboardUI = (function(){...})()`); no file reads another module's global at eval time. So raw `<script>` order is *not* load-bearing for evaluation — all cross-module coupling happens at init/runtime. The load-bearing points are listed after the table.

| # | File | Defines (window.*) | Reads (deferred) |
|---|------|--------------------|------------------|
| 1 | js/core/event-bus.js | EventBus | — |
| 2 | js/core/constants.js | GameConstants | — |
| 3 | js/core/dom-utils.js | DOMUtils | — (nothing reads DOMUtils either — dead) |
| 4 | js/core/game-state.js | HollywoodMogul | GameConstants, EventBus, ScenarioSystem, ScriptLibrary, TechnologySystem, FranchiseSystem, StudioLotSystem, ProductionSystem, BoxOfficeSystem, EventSystem, HistoricalEvents, AwardsSystem, SaveLoadUI |
| 5 | js/core/game-controller.js | GameController | (many — **but nothing anywhere references GameController: dead**) |
| 6 | js/core/time-system.js | TimeSystem | BoxOfficeSystem |
| 7 | js/core/save-load.js | SaveLoadSystem | HollywoodMogul, TimeSystem, DashboardUI |
| 8 | js/core/visual-event-triggers.js | VisualEvents | — (nothing reads VisualEvents — dead) |
| 9 | js/systems/scenarios.js | ScenarioSystem | HollywoodMogul, ScriptLibrary |
| 10 | js/systems/audio.js | AudioSystem | HollywoodMogul |
| 11 | js/systems/audio-integration.js | *(nothing)* | AudioSystem, DashboardUI, HollywoodMogul |
| 12 | js/systems/financial.js | FinancialSystem, _currentLoanType, _currentMobFavor | HollywoodMogul |
| 13 | js/systems/production.js | ProductionSystem, _currentProductionEvent, _distributionFilm, _distributionGameState | HollywoodMogul, ScriptLibrary, FinancialSystem, BoxOfficeSystem, StudioLotSystem, TechnologySystem, TimeSystem |
| 14 | js/systems/boxoffice.js | BoxOfficeSystem | HollywoodMogul, FinancialSystem, FranchiseSystem, GameConstants, TVCompetitionSystem, TechnologySystem, TimeSystem |
| 15 | js/systems/events.js | EventSystem | HollywoodMogul |
| 16 | js/systems/censorship.js | CensorshipSystem | EventBus, GameConstants, HollywoodMogul |
| 17 | js/systems/crisis.js | CrisisSystem | HollywoodMogul, Integration (**nothing references CrisisSystem — dead**) |
| 18 | js/systems/achievements.js | AchievementSystem | GameConstants, HollywoodMogul |
| 19 | js/systems/awards.js | AwardsSystem | AchievementSystem, DashboardUI, HollywoodMogul |
| 20 | js/systems/studio-lot.js | StudioLotSystem | — |
| 21 | js/systems/talent-management.js | TalentManagement | HollywoodMogul, ProductionSystem, ScriptLibrary, TalentRoster, TimeSystem |
| 22 | js/systems/rival-studios.js | RivalStudios | HollywoodMogul, TimeSystem |
| 23 | js/systems/newspaper.js | NewspaperSystem | AudioSystem |
| 24 | js/systems/technology.js | TechnologySystem | GameConstants, HollywoodMogul |
| 25 | js/systems/tv-competition.js | TVCompetitionSystem | GameConstants, TechnologySystem |
| 26 | js/systems/franchise.js | FranchiseSystem | GameConstants, HollywoodMogul |
| 27 | js/data/scripts.js | ScriptLibrary | GameConstants, HollywoodMogul, ProductionSystem, TimeSystem |
| 28 | js/data/historical-events.js | HistoricalEvents | HollywoodMogul |
| 29 | js/data/talent-roster.js | TalentRoster | — |
| 30 | js/ui/keyboard-shortcuts.js | KeyboardShortcuts | DashboardUI, HollywoodMogul, SaveLoadSystem, SaveLoadUI |
| 31 | js/ui/save-load-ui.js | SaveLoadUI | DashboardUI, HollywoodMogul, SaveLoadSystem |
| 32 | js/ui/scenario-ui.js | ScenarioUI | HollywoodMogul, ScenarioSystem |
| 33 | js/ui/dashboard.js | DashboardUI | HollywoodMogul, and 10 systems |
| 34 | js/ui/dashboard-visuals.js | DashboardVisuals | ProductionSystem |
| 35 | js/ui/dashboard-rival-extensions.js | DashboardRivalExtensions | DashboardUI (monkey-patches `updateDashboard`), HollywoodMogul, RivalStudios |
| 36 | js/ui/dashboard-talent-addon.js | *(bare top-level function declarations → implicit globals: `updateTalentSection`, `updateContractPlayers`, `createContractCard`, …)* | HollywoodMogul, TalentManagement, TalentRoster |
| 37 | js/ui/modals.js | ModalSystem | DashboardUI, HollywoodMogul, ProductionSystem, SaveLoadSystem (**nothing calls ModalSystem — dead**) |
| 38 | js/ui/tutorial.js | TutorialSystem | AudioSystem, HollywoodMogul |
| 39 | js/ui/help.js | HelpSystem | — |
| 40 | js/ui/tutorial-integration.js | *(nothing)* | TutorialSystem, HelpSystem, HollywoodMogul |
| 41 | js/ui/timeline.js | TimelineUI | HollywoodMogul |
| 42 | js/ui/studio-ui-helpers.js | updateStudioSectionFull | DashboardUI, HollywoodMogul, StudioLotSystem |
| 43 | js/ui/visual-enhancements-integration.js | *(nothing)* | DashboardUI (monkey-patches `updateDashboard`), DashboardVisuals, ProductionSystem, BoxOfficeSystem, HollywoodMogul |
| 44 | js/core/integration.js | Integration | 16 modules (orchestrator; must load last per index.html:557 comment) |

**Where load order IS load-bearing:**

1. **DOMContentLoaded registration order = script order.** Four files self-initialize on DOMContentLoaded: tutorial-integration.js:100, visual-enhancements-integration.js:10, audio-integration.js:241, integration.js:517. Their relative order determines monkey-patch layering.
2. **Monkey-patch chains on `DashboardUI.updateDashboard`.** dashboard-rival-extensions.js:15-17 (via `Integration.initializeSystems`) and visual-enhancements-integration.js:38-42 (DOMContentLoaded + 1000ms) both wrap `window.DashboardUI.updateDashboard`. Each must run after dashboard.js defines it; the wrap order changes render order of the extensions. audio-integration.js:211 similarly wraps `showNotification`.
3. **dashboard-talent-addon.js is not a module.** Its header (lines 1-6) reads *"Insert this content at the end of dashboard.js, before the return statement"* — it was shipped as a standalone script instead. Its bare function declarations become globals, and dashboard.js:130-131 (`typeof updateTalentSection === 'function'`) accidentally resolves them through the global scope. Any bundler/ES-module migration or `'use strict'` refactor that scopes these breaks the talent panel silently.
4. **integration.js must be last** — its `initializeSystems()` (integration.js:44-53) hard-codes the init order: DashboardUI → TimelineUI → HollywoodMogul → RivalStudios → DashboardRivalExtensions → SaveLoadUI → KeyboardShortcuts → ScenarioUI.
5. **Global namespace pollution as an API:** production.js and financial.js publish `window._distributionFilm`, `window._distributionGameState`, `window._currentLoanType`, `window._currentMobFavor` as inter-function mailboxes for inline `onclick` handlers.

**ES-module readiness:** because no cross-module eval-time reads exist, a mechanical conversion to ES modules is feasible, but the four DOMContentLoaded self-initializers, the two monkey-patch chains, the addon file's implicit globals, and ~20 inline `onclick="System.method()"` HTML strings (which require globals) must be reworked first.

---

## Rogue state writers

`js/core/game-state.js` is nominally the state owner, but **`getGameState()` (game-state.js:477) returns the raw mutable object**, and that is the de-facto API: the sanctioned mutators (`addCash`, `spendCash`, `addAlert`, `addEvent`, game-state.js:484-499) are a tiny minority of writes. Enumeration of `gameState.<field> = / += / .push(...)` across `js/` (excluding `unused/`) found **direct mutation in 20 of 23 non-core modules**, including:

- `js/systems/financial.js:134` creates `gameState.finances = {loans: [...]}` wholesale; :472 pushes loans; cash mutated directly at ~15 sites (e.g. financial.js:106-108, 446-447, 485-492).
- `js/systems/boxoffice.js:446-447, 486-487` — `gameState.cash += payment` directly (bypassing `addCash`, so `totalRevenue` bookkeeping and the `financial:updated` event are skipped or hand-rolled).
- `js/systems/production.js:1001` reassigns `gameState.activeFilms`; production.js:716-731 mutates cash directly in distribution.
- `js/systems/scenarios.js:429-512` rewrites 20+ fields including `currentDate`, `cash`, `debt`, and invents scenario-only fields (`wartime`, `maxBudget`, `costMultiplier`, `integrityScore`).
- `js/systems/crisis.js:519-550`, `awards.js:834-889`, `events.js:2826, 3763-3824`, `censorship.js:565`, `rival-studios.js:163-172`, `technology.js:159`, `franchise.js:52-86`, `studio-lot.js:194, 675`, `tutorial.js:412-765`, `scenario-ui.js:226`, `newspaper.js` (gossipColumns) — all write novel fields directly onto the state object.

Consequences observed: `reputation` is written by 8 different modules with inconsistent clamping; `monthlyBurn` by 3; two separate loan ledgers exist (`gameState.finances.loans` from financial.js:135 and `gameState.loans` from crisis.js:548).

**Stale-reference hazard (verified):** `startNewGameWithScenario` **replaces** the state object (game-state.js:166) rather than mutating it. `Integration.initializeSystems` passed the *pre-game* object to `RivalStudios.init(getGameState())` (integration.js:58-59, rival-studios.js:161-192), which wrote `rivalStudios`/`competitionData` onto it. After the real game starts, **`gameState.rivalStudios` is `undefined`** (jsdom boot: `has rivalStudios: true` before start, `false` after). The rival-studio system is effectively absent from actual play, and its weekly closure captured the dead object.

---

## Unserialized state

`createSaveData` (js/core/save-load.js:304-358) serializes exactly 25 fields. Diffing against every field the systems actually write yields **~40 live fields that are silently dropped**. Verified by round-trip in the jsdom campaign: after `saveGame(1)`/`loadGame(1)`, fields lost included `debt, historicalEvents, oscarCeremonies, censorshipActive, audienceExpectations, warActive, actorDraftRisk, huacActive, politicalRisk, blacklistActive, verticalIntegration, boxOfficeVariance` (plus, in sessions where they exist: `finances`, `rivalStudios`, `competitionData`, `crises`, `huacRisk`, `blacklistRisk`, `longTermEffects`, `loans`, `tutorialState`, `tutorialMissions`, `tutorialCompleted`, `missionsShown`, `scenarioVictoryAchieved`, `wartime`, `warEndYear`, `maxBudget`, `costMultiplier`, `integrityScore`, `blacklistChoices`, `debtPaymentSchedule`, `achievementsUnlocked`, `achievementPoints`, `isOscarWinningStudio`, `gossipColumns`, `minCashReached`, `morale`, `scandals`, `storylines`).

Highest-impact losses:

| Field | Written at | Effect of loss on load |
|---|---|---|
| `finances` (incl. `loans[]`) | financial.js:134, 472 | **All debt erased on reload — take loan → save → refresh = free money** |
| `historicalEvents` (fired-event flags, 114 keys by 2010) | events.js:3763-3765 | Historical events re-fire after every load |
| `oscarCeremonies` (76 entries by 2010) | awards.js:834-837 | Entire awards history lost; `isOscarWinningStudio` reset |
| `crises`, `huacRisk`, `blacklistRisk`, `longTermEffects` | crisis.js:399-550 | Active crises vanish |
| Scenario modifiers (`wartime`, `maxBudget`, `costMultiplier`, `debtPaymentSchedule`) | scenarios.js:486-512 | Scenario rules stop applying mid-run after a reload |
| `tutorialState`/`tutorialCompleted` | tutorial.js:412, 737 | Tutorial restarts |

**Compounding defect:** loading uses `Object.assign(currentState, loadedState)` (save-load-ui.js:379-384; duplicated at keyboard-shortcuts.js:129-131). It never deletes keys absent from the save, so unserialized fields from the *current* session leak into the loaded game — loading an early save after a long session keeps the long session's loans, crises, and event flags (cross-save contamination).

Module-private mutable state is also unsaved: `SaveLoadSystem.ironmanMode` (save-load.js:19 — persisted separately in settings), `Integration.pendingIntegrationGreenlight` (integration.js:20), `DashboardUI.pendingGreenlight` (dashboard.js:12), and production's `window._distributionFilm` — saving mid-modal and reloading drops the pending action.

---

## Init sequence & order fragility

Observed sequence (empirically traced in jsdom):

1. 44 scripts evaluate; only self-defines execute (safe).
2. DOMContentLoaded → tutorial-integration (immediate or +500ms), visual-enhancements (+1000ms), audio-integration, then **integration.js:517-522 → `Integration.init()` at +100ms**.
3. `Integration.init` → `initializeSystems()` (integration.js:43-68): each `sys.init()` in a `try/catch` that only `console.error`s. **`DashboardUI.init()` throws immediately** (see CODE-003) and is swallowed here. `HollywoodMogul.init()` schedules the real game start at **+3000ms** (game-state.js:92-98). `SaveLoadUI.init` starts the 5-minute autosave interval (save-load-ui.js:34-35).
4. `Integration.wireEventDelegation()` + `subscribeToEvents()` register the document click delegate and 6 EventBus subscriptions.
5. +3100ms: `startNewGame()` → scenario selection modal → player picks → `startNewGameWithScenario()` → **`EventBus.clear()` (game-state.js:164) deletes every subscription registered in steps 2-4** → fresh state object created (orphaning references captured in step 3) → systems re-init selectively (Technology, Franchise, Scenario, StudioLot — but *not* Rivals, *not* Integration's subscriptions).

**What breaks if a system is missing:** almost every call site is guarded `if (window.X)`, so missing systems degrade *silently* — which is precisely why the broken paths documented here shipped unnoticed: the guard pattern converts hard failures into invisible feature absence. The few unguarded dependencies: `window.HollywoodMogul.getGameState()` inside Integration's bus handlers (integration.js:120, 132) and `window.EventBus.emit` in game-controller.js; `HollywoodMogul` and `EventBus` are hard-required.

**Restart path:** the game-over "START NEW STUDIO" button (game-state.js:120-123) re-runs `startNewGame` → `EventBus.clear()` again; nothing ever re-subscribes; `Integration.init` refuses re-entry (`isInitialized`, integration.js:27-30). Every successive game is started with zero bus wiring.

---

## Error posture

- **No global error handler.** No `window.onerror`, no `error` listener, no `unhandledrejection` anywhere in `js/` or `index.html` (grep verified). An uncaught exception is invisible to the player: no toast, no dialog, no recovery.
- **The month/week-advance pipeline has zero try/catch.** `advanceTime` → `advanceWeek/advanceMonth` → `processMonthlyExpenses` → `processWeeklyEvents`/`processMonthlyEvents` (game-state.js:234-376) calls ProductionSystem, BoxOfficeSystem, EventSystem, ScriptLibrary, HistoricalEvents, and AwardsSystem directly and unguarded. Any throw mid-tick propagates to the button's click handler and dies uncaught **after** the date has advanced and expenses were charged, but **before** remaining systems ran — the state is left partially ticked (silent divergence), the UI freezes on stale data for that tick, and nothing tells the player. Verified: `BoxOfficeSystem.releaseFilm`'s TypeError propagates uncaught to the caller (2,996 occurrences captured in the weekly campaign sim).
- try/catch coverage that does exist: `EventBus.emit` wraps each handler (event-bus.js:72-78, `console.error` only); `Integration.initializeSystems` wraps init (integration.js:57-65); save-load.js wraps storage ops (19 blocks, good); audio.js (3). That's the complete inventory.
- **Latent crash in the recovery-critical path:** integration.js:355 references an undeclared `gameState` inside `completeIntegrationGreenlight()` under `'use strict'` → ReferenceError whenever ironman mode is on and a censorship-flagged script is greenlit (currently masked because the call above it, CODE-005, throws first).

---

## Leak & growth risks

**Timers (all singletons, none cleared, all survive game restarts):**
- dashboard.js:34 — `setInterval(updateDashboard, 3000)` forever; `updateInterval` is never cleared anywhere (currently unreachable because init crashes; becomes a permanent 3s full-dashboard re-render once CODE-003 is fixed).
- tutorial-integration.js:88-93 — 5s mission-check interval, never cleared.
- audio-integration.js:128+ — ~1s cash-polling interval, never cleared; plus a `MutationObserver` on the notifications container (audio-integration.js:115-124) never disconnected.
- save-load.js:433 — 5-minute autosave interval; properly clearable but `stopAutoSave` is never invoked by the app.

**Listeners:** the Phase-6 leak fix pattern (store bound handler, remove before re-add) is present in integration.js:78-99, dashboard.js:43-45, modals.js:491-493 and held up in review. game-state.js's `domListeners` registry (game-state.js:83, 130-137) is write-only — no removal code ever reads it. Per-render listener churn in timeline.js:525-591 and game-state.js:864-874 is bounded (old nodes GC with `innerHTML` replacement). modals.js appends `.modal-overlay` divs to `document.body` (modals.js:46, 139, 269, 341, 438); its own close paths `.remove()` them, but since `ModalSystem.init` never runs, none of this executes.

**State growth over a 77-year campaign (measured):**

| Array | Pruning | Measured at 2010 |
|---|---|---|
| `availableScripts` | **None.** Greenlight only flags `available=false` (scripts.js:2888-2891); `generateMonthlyScripts` pushes ~3/month forever (game-state.js:353-359) | **2,762–2,779 entries** |
| `activeFilms` (monthly-path play) | Films never leave (see CODE-001) | **924 entries** |
| `completedFilms` | None (by design, it's history) | ~1.2 KB/film JSON |
| `oscarCeremonies` | None (and unserialized) | 76 entries |
| `currentEvents` / `events` | Capped at 10 / 20 (game-state.js:440-441, 454-455) ✓ | 10 / ≤20 |
| `historicalEvents` flags | Grows to one key per fired event (unserialized) | 114 keys |

**Late-game save size (measured, not estimated):** a single 2010 save was **2,001,173 bytes** (weekly-progression variant with stuck films: **2,811,941 bytes**), dominated by `availableScripts`. With the backup system (save-load.js:745-765 keeps 3 backups per key, each a full save **string embedded in JSON** — double-encoded), one occupied slot reached **4,211,006 bytes ≈ 4.02 MB of the ~5 MB localStorage quota**. In the 2.8 MB variant, backup writes were *already* failing silently on quota (`backup bytes: 0`). Two save slots + autosave + backups cannot fit: late-game saving will throw `QuotaExceededError`, which save-load.js catches and surfaces only as a return value most callers ignore.

**Perf:** month-tick long-task risk is currently low — max observed tick 8 ms across 924 months (jsdom, no paint) — but that measurement is hollow because production/box office/dashboard rendering are all broken; re-measure after S0 fixes.

---

## Findings

```json
[
  {
    "id": "CODE-001",
    "workstream": "code",
    "severity": "S0",
    "title": "Advance-Month and Advance-Week execute disjoint simulations: monthly play freezes all film production and box office; weekly play never delivers scripts, historical events, or Oscars",
    "evidence": "js/core/game-state.js:274-281 (advanceMonth calls only processMonthlyExpenses+processMonthlyEvents; never processWeeklyEvents which owns ProductionSystem.processWeeklyProduction and BoxOfficeSystem.processWeeklyBoxOffice at :337-343); js/core/game-state.js:258-272 (advanceWeek never calls processMonthlyEvents which owns generateMonthlyScripts/HistoricalEvents/Oscars at :353-369). Sim: 924 monthly ticks -> 924 films permanently in activeFilms, 0 completed; 77 years of weekly ticks -> availableScripts stuck at 5, 0 oscarCeremonies, 0 historicalEvents fired.",
    "repro": "jsdom boot; startNewGameWithScenario('classic_start'); loop advanceTime('month') -> films never complete. Loop advanceTime('week') x4/month -> no new scripts/events/Oscars ever.",
    "player_impact": "Whichever time button the player prefers, half the game does not happen. Monthly players soft-lock (films never finish); weekly players run out of content in year one.",
    "suggested_direction": "Single tick pipeline: advanceMonth = 4x advanceWeek; fire monthly hooks on month-boundary crossings inside the weekly path.",
    "confidence": "high"
  },
  {
    "id": "CODE-002",
    "workstream": "code",
    "severity": "S0",
    "title": "EventBus.clear() at game start wipes all init-time subscriptions: loan interest, newspaper, scenario victory checks, ironman autosave, era display, and MPAA-rating completion are dead during actual play",
    "evidence": "js/core/game-state.js:164 (EventBus.clear() in startNewGameWithScenario) runs after Integration.subscribeToEvents (js/core/integration.js:107-165) and DashboardUI's subscription (js/ui/dashboard.js:24-31); nothing re-subscribes (Integration.init re-entry blocked by isInitialized, integration.js:27-30). Verified in jsdom: EventBus.listenerCount() = 6 events before start, {} after startNewGameWithScenario.",
    "repro": "jsdom boot; wait for Integration.init; call startNewGameWithScenario; EventBus.listenerCount() returns {}.",
    "player_impact": "Loans never accrue interest or payments (free-money exploit; FinancialSystem.processMonthlyLoans only called from the wiped month:processed handler, integration.js:142-143); scenarios can never be won (checkVictoryConditions wiped, integration.js:147-149); ironman never autosaves; era indicator frozen; MPAA rating selection never completes a greenlight.",
    "suggested_direction": "Remove the clear() or scope it to game-lifecycle events; have systems subscribe on game:started; add a regression test asserting listener counts survive a new game.",
    "confidence": "high"
  },
  {
    "id": "CODE-003",
    "workstream": "code",
    "severity": "S0",
    "title": "DashboardUI.updateDashboard() throws ReferenceError (getAllFilms is not defined) on every call, aborting DashboardUI.init before handlers, subscriptions, or refresh start",
    "evidence": "js/ui/dashboard.js:207 and :958 call getAllFilms(), which is defined only as a private function inside other IIFEs (js/systems/boxoffice.js:182, js/ui/timeline.js:646, js/ui/visual-enhancements-integration.js:126) and never in dashboard.js nor exported (boxoffice.js public API :831-843 lacks it). updateDashboard (:120-133) calls updateFilmsInProduction (:122) unconditionally. init() calls updateDashboard() at :20 before bindEventHandlers/:34 setInterval, so the throw aborts init; jsdom boot logs 'Failed to initialize DashboardUI ReferenceError: getAllFilms is not defined'. Every later call from js/ui/modals.js:531,562,577, js/ui/save-load-ui.js:388, js/ui/keyboard-shortcuts.js:135, js/ui/studio-ui-helpers.js:285 throws. Latent secondary bug shielded by this: dashboard.js:56/:61 call nonexistent window.TimeSystem.advanceWeek()/advanceMonth() (TimeSystem API js/core/time-system.js:408-436 has no such methods).",
    "repro": "Open index.html; console shows the ReferenceError at load; window.DashboardUI.updateDashboard() throws.",
    "player_impact": "The main dashboard module is inert; UI survives only via game-state.js's duplicate render functions; any action that tries to refresh the dashboard (quick-load, tech purchase, production-event choice) raises an uncaught exception.",
    "suggested_direction": "Export getAllFilms from BoxOfficeSystem (or a shared film-query util) and use it; fix or delete the TimeSystem.advanceWeek/advanceMonth handlers.",
    "confidence": "high"
  },
  {
    "id": "CODE-004",
    "workstream": "code",
    "severity": "S0",
    "title": "BoxOfficeSystem.releaseFilm() crashes on every strategy: TimeSystem.getCurrentDate does not exist",
    "evidence": "js/systems/boxoffice.js:455, :477, :493 call window.TimeSystem.getCurrentDate(); TimeSystem's API (js/core/time-system.js:408-436) has no getCurrentDate (it lives on HollywoodMogul, game-state.js:480). The 'window.TimeSystem ?' guards pass because the object exists. Same phantom method called at js/systems/talent-management.js:50,:379 and js/ui/dashboard.js:593. Sim: 2,996/2,996 releaseFilm calls threw 'window.TimeSystem.getCurrentDate is not a function'.",
    "repro": "jsdom boot; complete a film; BoxOfficeSystem.releaseFilm(id,'wide') -> TypeError. Also boxoffice.js:215,:238,:630 crash any code path touching them.",
    "player_impact": "Every distribution path routed through BoxOfficeSystem/Integration/dashboard ('distribute-btn') crashes uncaught; only production.js's internal distribution modal (production.js:703-752) works, and it uses different economics. Talent contract signing (talent-management.js:50) also crashes.",
    "suggested_direction": "Replace with HollywoodMogul.getCurrentDate() or pass gameState.currentDate; add a smoke test that calls every exported function once.",
    "confidence": "high"
  },
  {
    "id": "CODE-005",
    "workstream": "code",
    "severity": "S0",
    "title": "ProductionSystem.greenlightScript() always throws (ScriptLibrary.getScriptById not exported); the only working greenlight path bypasses the censorship system entirely",
    "evidence": "js/systems/production.js:983 calls window.ScriptLibrary.getScriptById(scriptId); ScriptLibrary's exports (js/data/scripts.js:2950-2959) do not include it. Sim: 924/924 calls threw. Callers: js/core/integration.js:292,:331 (the censorship-integrated greenlight for '.greenlight-btn' with data-script-id, wired at integration.js:84-86) and js/ui/dashboard.js:682,:704. The working path is ScriptLibrary.greenlightScript (scripts.js:2863-2897) via inline onclick (scripts.js:2850), which calls ProductionSystem.startProduction directly and performs no CensorshipSystem evaluation.",
    "repro": "jsdom boot; ProductionSystem.greenlightScript(anyId) -> TypeError. Greenlight via script-library modal -> works, no Hays Code check.",
    "player_impact": "The game's flagship mechanic (Hays Code navigation) is unreachable through the working UI path and crashes through the integrated path.",
    "suggested_direction": "Export getScriptById (or look up in gameState.availableScripts); route ScriptLibrary.greenlightScript through Integration.handleScriptGreenlight so censorship always applies.",
    "confidence": "high"
  },
  {
    "id": "CODE-006",
    "workstream": "code",
    "severity": "S1",
    "title": "GameController (401 lines) is dead code, and it is the sole owner of era transitions, weekly rival/achievement ticks, TV events, and in-tick loan processing",
    "evidence": "Zero references to window.GameController outside its own file (only mention: comment js/core/game-state.js:4). era:changed is emitted only at js/core/game-controller.js:298 -> Integration's era-transition modal (integration.js:158-160) can never fire. It also contains its own crash: bare 'C' at game-controller.js:180 (ReferenceError under 'use strict' if ever invoked). game-state.js's live duplicate pipeline (:234-376) omits RivalStudios, AchievementSystem (outside Oscars, awards.js:522), TVCompetitionSystem.checkForTvEvents, and checkEraTransition.",
    "repro": "grep -rn GameController js/ index.html; play any length — no era transition modal ever appears.",
    "player_impact": "No era-transition moments, no weekly achievement checks, no TV-competition events; two divergent copies of the core loop invite silent drift.",
    "suggested_direction": "Either delete GameController and port its missing hooks into the live pipeline, or make it the single pipeline and delete game-state.js's copy.",
    "confidence": "high"
  },
  {
    "id": "CODE-007",
    "workstream": "code",
    "severity": "S1",
    "title": "Save system drops ~40 live state fields: loans/debt erased on reload (exploit), historical events re-fire, Oscar/crisis/tutorial/scenario state lost",
    "evidence": "createSaveData whitelist js/core/save-load.js:304-358 vs. field census of gameState writes. Verified round-trip loss list from sim: debt, historicalEvents(114 keys), oscarCeremonies(76), censorshipActive, warActive, huacActive, politicalRisk, blacklistActive, verticalIntegration, boxOfficeVariance, actorDraftRisk, audienceExpectations; plus session-dependent: finances.loans (financial.js:134,472), crises (crisis.js:399), tutorialState (tutorial.js:412), wartime/maxBudget/costMultiplier (scenarios.js:495-512), achievementsUnlocked (crisis-adjacent :534-547), gossipColumns, rivalStudios/competitionData.",
    "repro": "Take a loan; saveGame(1); loadGame(1); gameState.finances is gone -> debt erased. Sim printed the exact lost-field list.",
    "player_impact": "Reload = free money and re-fired historical events; scenario runs break after any reload; awards history vanishes.",
    "suggested_direction": "Serialize the whole state object minus a small denylist, with a version-migrated schema, instead of a hand-maintained allowlist.",
    "confidence": "high"
  },
  {
    "id": "CODE-008",
    "workstream": "code",
    "severity": "S1",
    "title": "Loading merges via Object.assign without deleting stale keys: current-session state contaminates the loaded game",
    "evidence": "js/ui/save-load-ui.js:379-384 (Object.assign(currentState, gameState)); duplicated at js/ui/keyboard-shortcuts.js:129-131. Fields absent from the save (all of CODE-007's list) retain their current-session values instead of resetting.",
    "repro": "Play to 1950 with loans+crises; load a 1934 save; finances/crises/historicalEvents from 1950 persist in the '1934' game.",
    "player_impact": "Loaded games are chimeras of two timelines; bugs are unreproducible.",
    "suggested_direction": "Replace-not-merge: build a complete fresh state from the save, or delete non-save keys before assign.",
    "confidence": "high"
  },
  {
    "id": "CODE-009",
    "workstream": "code",
    "severity": "S1",
    "title": "Late-game save is 2-2.8 MB (unpruned availableScripts) and the backup system double-stores it: one slot consumed 4.02 MB of the ~5 MB localStorage quota; multiple slots cannot fit",
    "evidence": "Measured in jsdom (5 MB quota, matching typical browsers): 2010 save = 2,001,173-2,811,941 bytes; hollywood-mogul-backup after 3 overwrites = 2,209,738 bytes (save-load.js:745-765 keeps 3 backups per key as JSON-escaped strings, ~doubling cost); total = 4,211,006 bytes. In the 2.8 MB run, backup writes already failed silently on quota (backup bytes: 0). availableScripts never pruned: scripts.js:2888-2891 only flags available=false; game-state.js:353-359 pushes ~3/month -> 2,762-2,779 entries by 2010.",
    "repro": "Run campaign-sim (monthly loop to 2010); saveGame(1) x4; sum localStorage byte lengths.",
    "player_impact": "Late-game saves and backups start failing exactly when the player has the most to lose; MAX_SAVE_SLOTS=5 is unusable past mid-game.",
    "suggested_direction": "Prune consumed/expired scripts (cap the pool); store backups compressed or as diffs; surface quota failures in UI.",
    "confidence": "high"
  },
  {
    "id": "CODE-010",
    "workstream": "code",
    "severity": "S1",
    "title": "No global error handler and zero try/catch in the tick pipeline: an exception mid-month-tick half-applies the tick and shows the player nothing",
    "evidence": "grep: no window.onerror / addEventListener('error') / unhandledrejection in js/ or index.html. advanceTime pipeline game-state.js:234-376 calls 6+ systems unguarded after date/expense mutation (:262-264,:275-279 mutate before system dispatch). Only EventBus handlers are individually wrapped (event-bus.js:72-78). Verified: releaseFilm TypeErrors propagate uncaught to the click handler.",
    "repro": "Trigger CODE-004 from the distribute button: console-only exception; date advanced; box office skipped.",
    "player_impact": "Silent state corruption per tick; 'obviously unfinished' feel when actions do nothing with no feedback.",
    "suggested_direction": "window.onerror -> user-visible error toast + auto-backup save; wrap each system dispatch in the tick with per-system isolation (mirror EventBus.emit's pattern).",
    "confidence": "high"
  },
  {
    "id": "CODE-011",
    "workstream": "code",
    "severity": "S1",
    "title": "Rival-studio system is orphaned from live state: initialized on the pre-game state object which is replaced at game start; its weekly hook targets a method that does not exist",
    "evidence": "integration.js:48,:58-59 pass getGameState() (pre-game object) to RivalStudios.init; game-state.js:166 replaces the object in startNewGameWithScenario; verified: gameState.rivalStudios === undefined after game start. Weekly updates registered only via window.TimeSystem.addWeeklyCallback (rival-studios.js:186-189) which TimeSystem never defines (time-system.js:408-436) — the typeof guard makes it silently no-op. Same phantom API called unguarded at boxoffice.js:813-815 (BoxOfficeSystem.init would throw; nothing calls it).",
    "repro": "jsdom boot -> 'has rivalStudios: true' pre-start, 'false' post-start.",
    "player_impact": "Rival studios never exist during play; dashboard-rival-extensions renders from undefined data.",
    "suggested_direction": "Re-init rivals on game:started with the live state; delete the addWeeklyCallback fiction or implement it.",
    "confidence": "high"
  },
  {
    "id": "CODE-012",
    "workstream": "code",
    "severity": "S1",
    "title": "ModalSystem (655 lines) is dead code with destructive semantics: its closeAllModals() would permanently delete the static modal roots, and its save handlers call SaveLoadSystem with the wrong signature",
    "evidence": "ModalSystem.init (js/ui/modals.js:629-633) is called by no one (grep: zero external references; Integration's system list integration.js:44-53 omits it); its show* functions are never invoked (events.js:2667 and historical-events.js:3831 have their own private showEventModal). closeAllModals (modals.js:593-595) removes every '.modal-overlay' node — index.html:331 (#save-load-modal), :462 (#delete-confirm-modal), :476 (#modal-overlay) all carry that class, so one invocation would permanently break HollywoodMogul.showModal and the save/load UI. modals.js:521 calls SaveLoadSystem.saveGame(saveName) against signature (slotNumber, gameState, name) (save-load.js:26); modals.js:528 treats loadGame's always-truthy result object as a boolean.",
    "repro": "window.ModalSystem.closeAllModals() in console -> save/load modal and #modal-overlay removed from DOM for the session.",
    "player_impact": "Currently latent (dead), but any future 'just call ModalSystem.init()' fix arms all three defects.",
    "suggested_direction": "Delete modals.js or rewrite it as the single modal layer; never class static roots the same as dynamic overlays.",
    "confidence": "high"
  },
  {
    "id": "CODE-013",
    "workstream": "code",
    "severity": "S1",
    "title": "Ironman greenlight path references undeclared variable: ReferenceError under 'use strict'",
    "evidence": "js/core/integration.js:355 uses gameState inside completeIntegrationGreenlight() where it is never declared (contrast executeIntegrationGreenlight which declares it at :313). IIFE is 'use strict' (integration.js:16). Currently masked by CODE-005 throwing earlier at :331.",
    "repro": "Fix CODE-005, enable ironman, greenlight a censorship-flagged script, complete the PCA modal -> ReferenceError.",
    "player_impact": "Ironman players crash at the exact moment their only save should be written.",
    "suggested_direction": "var gameState = window.HollywoodMogul.getGameState(); one-line fix; add lint (no-undef) to CI.",
    "confidence": "high"
  },
  {
    "id": "CODE-014",
    "workstream": "code",
    "severity": "S2",
    "title": "~7,000 lines of dead code ship in the bundle: unused/ (4,952), ModalSystem (655), CrisisSystem (597), GameController (401), VisualEvents, DOMUtils; TV events only reachable from dead code",
    "evidence": "js/systems/unused/scandals.js (1,782) + storylines.js (3,170) = 4,952 lines not loaded by index.html but in repo; loaded-but-dead: modals.js (CODE-012), crisis.js (zero external references to CrisisSystem), game-controller.js (CODE-006), visual-event-triggers.js (VisualEvents never read), dom-utils.js (DOMUtils never read); TVCompetitionSystem.checkForTvEvents only called from dead game-controller.js:251-252. 43 console.* calls in shipped js (excluding unused/); 1 real TODO-class item (none found — the only 'XXX' hit is historical prose, historical-events.js:3317).",
    "repro": "grep -rn 'CrisisSystem|VisualEvents|DOMUtils' js/ index.html excluding defining files -> no hits.",
    "player_impact": "Crisis/TV content the game advertises internally never reaches the player; maintenance surface is ~20% larger than the real game.",
    "suggested_direction": "Delete unused/ and dead modules per quality rule ('delete dead code'); wire or delete Crisis/TV hooks; strip console.* behind a debug flag.",
    "confidence": "high"
  },
  {
    "id": "CODE-015",
    "workstream": "code",
    "severity": "S2",
    "title": "Systemic duplication with drift: 2 tick pipelines, 4 greenlight paths, 3 distribution flows, 2 burn/runway calculators, 3 private getAllFilms copies, 2 save-apply implementations, and a monkey-patch chain on updateDashboard",
    "evidence": "Tick: game-state.js:234-376 vs game-controller.js:32-277. Greenlight: game-state.js:864-874, scripts.js:2863, production.js:972, dashboard.js:645, integration.js:249. Distribution: production.js:642-752 (live), boxoffice.js:432+ (crashes), integration.js:392-448, dashboard.js:790-806. Burn/runway duplicated game-state.js:302-331/:420-424 vs game-controller.js:126-159/:378-385. getAllFilms tripled (boxoffice.js:182, timeline.js:646, visual-enhancements-integration.js:126) and missing where needed (CODE-003). Save-apply: save-load-ui.js:379 vs keyboard-shortcuts.js:129. updateDashboard wrapped twice (dashboard-rival-extensions.js:15-17, visual-enhancements-integration.js:38-42). dashboard-talent-addon.js:1-6 is a paste-me file shipped as a script (bare globals).",
    "repro": "Compare the cited ranges; behaviors already diverge (e.g., production.js wide-release marketing $25,000 flat vs boxoffice.js era-scaled marketing).",
    "player_impact": "Same action costs/behaves differently depending on which UI path fired; every balance fix must be made 2-4 times.",
    "suggested_direction": "One owner per verb (tick, greenlight, distribute, applyLoadedState, film queries) before any ES-module migration.",
    "confidence": "high"
  },
  {
    "id": "CODE-016",
    "workstream": "code",
    "severity": "S2",
    "title": "Perpetual polling timers and observers are never cleared and survive game restarts",
    "evidence": "dashboard.js:34 setInterval(updateDashboard,3000) with no clearInterval anywhere; tutorial-integration.js:88-93 5s interval; audio-integration.js:128+ cash-polling interval and MutationObserver (:115-124) never disconnected; game-state.js domListeners registry (:83,:130-137) is written but never used for removal. Bounded (singletons), so slow burn rather than unbounded leak; the 3s full-dashboard innerHTML re-render becomes a constant perf tax once CODE-003 is fixed.",
    "repro": "Code inspection; set breakpoints after 'START NEW STUDIO' restart — old intervals still firing.",
    "player_impact": "Background CPU/GC churn in long sessions; event-driven updates already exist (EventBus) but polling remains.",
    "suggested_direction": "Replace polling with EventBus subscriptions; add destroy() lifecycle called on game restart.",
    "confidence": "medium"
  }
]
```

## Not covered

- **Real-browser memory profiling** (detached-DOM snapshots, GC pressure over 20+ years with DevTools): jsdom cannot measure this; the listener/timer inventory above is static+jsdom evidence only. Playwright/Chromium pass still needed once S0s are fixed (a meaningful profile is impossible while `DashboardUI.init` crashes and films can't complete on the monthly path).
- **Timeline render cost late-game** (`js/ui/timeline.js`) under real paint — same jsdom limitation; structure (full `innerHTML` rebuild per render, listeners re-attached per marker, timeline.js:257, 525-591) noted but not timed in-browser.
- **Version-migration paths**: only v2.0 exists; `restoreGameState` (save-load.js:363-369) merely warns on mismatch. No older-format fixtures existed to test against.
- **audio.js internals** (fade intervals at audio.js:391/421/621 are cleared; deeper review left to the AUDIO workstream) and CSS/asset weight (UX workstream).
- Per-file test-coverage mapping (TEST workstream owns `npm test:coverage`).
