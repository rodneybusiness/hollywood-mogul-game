# TEST Workstream — Coverage & Regression Safety Audit

Audit date: 2026-07-02. Command run: `npx jest --coverage --coverageReporters=text --coverageReporters=json-summary` (jest.config.js already sets `collectCoverageFrom: ['js/**/*.js', ...]`, so no override was needed). All 197 tests in 2 suites pass in 12.1s.

## Summary

- **Overall coverage is 9.69% statements / 7.13% branches / 8.35% functions / 9.53% lines** across 7,197 statements in 46 files. 38 of 46 files are at exactly 0%.
- **Every money-touching system is at 0%**: `financial.js`, `boxoffice.js`, `production.js`, `awards.js`, `censorship.js`, `events.js`, `studio-lot.js`, `talent-management.js`, `rival-studios.js`, `crisis.js`. The entire player economy — loans, box office revenue, production budgets, payroll — has zero regression safety. The audit plan's expected finding is confirmed exactly.
- **What IS tested is tested reasonably well**: `technology.js` (90%), `tv-competition.js` (88%), `franchise.js` (83%), and the save/load schema-validation path (44% of `save-load.js`) have behavior-oriented tests with good edge coverage. The 197-test count flatters the suite: coverage is deep on 4 small systems and absent on the 10 large ones.
- **The riskiest money code is also the hardest to test**: in `financial.js` the loan amount is read from a DOM slider before `gameState.cash += amount` (js/systems/financial.js:439-442, 472-473), and in `production.js` the distribution choice (which debits $8k–$25k or credits a rights sale) flows through `window._distributionFilm` globals set by modal code (js/systems/production.js:703-705). These paths cannot be unit tested without refactoring.
- **`npm run test:coverage` permanently fails**: jest.config.js declares 80/70/75/80% global thresholds against an actual 9.69%, so the documented coverage command always exits non-zero and cannot be used as a CI gate; meanwhile save-corruption/quota paths (`save-load.js:431-813` export/import/backup, no `QuotaExceededError` handling anywhere) are untested data-loss vectors.

## Coverage table

Per-file, sorted ascending by statement coverage (ties broken by statement count, largest first). Source: `coverage/coverage-summary.json`.

| File | % Stmts | % Branch | % Funcs | % Lines | Stmts |
|---|---:|---:|---:|---:|---:|
| js/ui/dashboard.js | 0 | 0 | 0 | 0 | 464 |
| js/systems/financial.js | 0 | 0 | 0 | 0 | 306 |
| js/systems/production.js | 0 | 0 | 0 | 0 | 306 |
| js/systems/unused/scandals.js | 0 | 0 | 0 | 0 | 303 |
| js/ui/save-load-ui.js | 0 | 0 | 0 | 0 | 262 |
| js/systems/audio.js | 0 | 0 | 0 | 0 | 261 |
| js/systems/boxoffice.js | 0 | 0 | 0 | 0 | 255 |
| js/ui/tutorial.js | 0 | 0 | 0 | 0 | 237 |
| js/systems/unused/storylines.js | 0 | 0 | 0 | 0 | 232 |
| js/data/scripts.js | 0 | 0 | 0 | 0 | 222 |
| js/systems/rival-studios.js | 0 | 0 | 0 | 0 | 210 |
| js/systems/awards.js | 0 | 0 | 0 | 0 | 199 |
| js/systems/censorship.js | 0 | 0 | 0 | 0 | 193 |
| js/core/integration.js | 0 | 0 | 0 | 0 | 184 |
| js/systems/studio-lot.js | 0 | 0 | 0 | 0 | 183 |
| js/systems/events.js | 0 | 0 | 0 | 0 | 179 |
| js/ui/timeline.js | 0 | 0 | 0 | 0 | 156 |
| js/systems/talent-management.js | 0 | 0 | 0 | 0 | 152 |
| js/core/game-controller.js | 0 | 0 | 0 | 0 | 136 |
| js/ui/modals.js | 0 | 0 | 0 | 0 | 135 |
| js/systems/newspaper.js | 0 | 0 | 0 | 0 | 130 |
| js/systems/achievements.js | 0 | 0 | 0 | 0 | 124 |
| js/systems/audio-integration.js | 0 | 0 | 0 | 0 | 101 |
| js/ui/dashboard-visuals.js | 0 | 0 | 0 | 0 | 94 |
| js/ui/dashboard-talent-addon.js | 0 | 0 | 0 | 0 | 87 |
| js/systems/crisis.js | 0 | 0 | 0 | 0 | 86 |
| js/systems/scenarios.js | 0 | 0 | 0 | 0 | 86 |
| js/ui/studio-ui-helpers.js | 0 | 0 | 0 | 0 | 84 |
| js/core/time-system.js | 0 | 0 | 0 | 0 | 79 |
| js/ui/help.js | 0 | 0 | 0 | 0 | 76 |
| js/ui/scenario-ui.js | 0 | 0 | 0 | 0 | 76 |
| js/core/dom-utils.js | 0 | 0 | 0 | 0 | 75 |
| js/ui/dashboard-rival-extensions.js | 0 | 0 | 0 | 0 | 67 |
| js/data/talent-roster.js | 0 | 0 | 0 | 0 | 65 |
| js/ui/keyboard-shortcuts.js | 0 | 0 | 0 | 0 | 63 |
| js/ui/visual-enhancements-integration.js | 0 | 0 | 0 | 0 | 58 |
| js/data/historical-events.js | 0 | 0 | 0 | 0 | 55 |
| js/ui/tutorial-integration.js | 0 | 0 | 0 | 0 | 41 |
| js/core/visual-event-triggers.js | 0 | 100 | 0 | 0 | 8 |
| js/core/event-bus.js | 21.62 | 8.33 | 30 | 18.75 | 37 |
| js/core/save-load.js | 44.25 | 54.33 | 43.47 | 44.00 | 357 |
| js/core/game-state.js | 56.07 | 37.50 | 60.49 | 57.86 | 453 |
| js/systems/franchise.js | 82.72 | 66.66 | 73.68 | 84.94 | 110 |
| js/core/constants.js | 86.84 | 76.92 | 75 | 92.59 | 38 |
| js/systems/tv-competition.js | 88.46 | 83.78 | 100 | 88.88 | 52 |
| js/systems/technology.js | 90.00 | 82.66 | 93.75 | 92.78 | 120 |
| **All files** | **9.69** | **7.13** | **8.35** | **9.53** | **7197** |

Notes: `js/data/*` files are mostly static data (low statement counts despite 3–4k lines); 0% there means the accessor/lookup functions they export are untested. `js/systems/unused/` (535 statements of dead code) is included in the denominator — excluding it, live-code coverage is ~10.5%.

## Top-10 test targets (ranked by money-touching × line count)

All at 0% coverage unless noted. "What it does to player cash" is cited to the mutation site.

| # | Module | Lines | Why it's mandatory |
|---|---|---:|---|
| 1 | `js/systems/financial.js` | 1205 | The debt economy. Loan origination credits cash (`gameState.cash += amount`, financial.js:472-473); monthly interest+principal debited (financial.js:172); investment income credited (financial.js:194); investment purchases debited (financial.js:632); mob retaliation `-$15,000` (financial.js:810) and favor `cashDrain` (financial.js:1047). The ECON workstream's "loan cycling" exploit hypothesis is unverifiable without tests here. |
| 2 | `js/systems/boxoffice.js` | 843 | **All player income.** Weekly theatrical revenue (`cash += weekData.studioRevenue`, boxoffice.js:560), rights-sale payments (boxoffice.js:446), ancillary revenue (`cash += result.total`, boxoffice.js:781 — the suspected compounding exploit in AUDIT-PLAN §0.1), marketing debits (boxoffice.js:485). A bug here inflates or starves the whole game. |
| 3 | `js/systems/production.js` | 1040 | **Largest single debits.** Full budget deducted at greenlight (production.js:126), weekly overruns beyond budget (production.js:160), production-event choices costing cash (production.js:530), distribution marketing $25k/$8k (production.js:716, 724), rights-sale income (production.js:731). The prepaid-budget model (comment at production.js:123-125) is a subtle invariant begging for regression tests. |
| 4 | `js/core/game-state.js` | 940 (56%) | The sanctioned cash API (`addCash`/`spendCash`), monthly burn, bankruptcy trigger. Uncovered ranges include weekly/monthly processing hooks (game-state.js:587-667) and the entire end-game flow (game-state.js:829-931) — the code that decides whether the player loses. |
| 5 | `js/core/save-load.js` | 1250 (44%) | Data loss = losing all money. Uncovered block save-load.js:431-813 holds export/import and the backup/versioning system; version mismatch only `console.warn`s "compatibility mode" (save-load.js:364-368) with no migration; no `QuotaExceededError` handling anywhere. |
| 6 | `js/systems/events.js` | 2909 | Largest system file. `applyChoiceEffects` spends player cash for event choices (`spendCash(Math.abs(effects.budget))`, events.js:2792) and mutates film budget/quality/weeks — every historical event with a cost flows through this one untested function. |
| 7 | `js/systems/studio-lot.js` | 710 | Capital expenditure: sound stages (studio-lot.js:233), backlots (studio-lot.js:284), facilities (studio-lot.js:332), recurring maintenance (studio-lot.js:492). Zero DOM references — cheapest big win on this list. |
| 8 | `js/systems/talent-management.js` | 453 | Payroll: contract signing upfronts (talent-management.js:63), contract buyouts (talent-management.js:108), loan-out fees (talent-management.js:190), weekly salary drain (talent-management.js:273). A payroll double-charge or non-charge silently breaks balance. |
| 9 | `js/systems/censorship.js` | 647 | PCA penalties debit cash directly (`spendCash(totalBudgetPenalty)`, censorship.js:500) plus quality/schedule penalties (censorship.js:486-495) that reduce future revenue; a rejected film (censorship.js:555) can strand an entire production budget. Core to the game's Hays Code identity. |
| 10 | `js/systems/awards.js` | 1045 | No direct cash mutation, but wins flag films for a box-office boost (awards.js:862) and reputation +2/nom, +5/win (awards.js:855-856), which gates loan/investment eligibility (financial.js:839). Annual trigger logic (`shouldTriggerOscars`, awards.js:447) skipping or double-firing a ceremony is a silent economy bug. |

Near-misses: `rival-studios.js` (849 lines; mutates rival cash/market share that feeds box-office competition, rival-studios.js:329, 621-630) and `crisis.js` (597 lines; `addCash(effects.cash)` at crisis.js:514). Both should follow immediately after the top 10.

## Testability classification

Classification of the top-10 (plus near-misses): EASY = pure logic, plain Node would do; MEDIUM = needs jsdom and/or a stubbed `window.HollywoodMogul`; HARD = money logic interleaved with DOM reads/writes, needs refactor before it can be unit tested.

| Module | Class | Evidence |
|---|---|---|
| `studio-lot.js` | **EASY** | 0 `document.*` refs, 0 `window.HollywoodMogul` refs; all functions take `gameState` as a parameter. |
| `talent-management.js` | **EASY** | 0 DOM refs; only 4 guarded `HollywoodMogul.addAlert` calls (talent-management.js:70, 117, 294, 309). |
| `save-load.js` | **EASY** | Pure logic + localStorage; already proven testable by systems.test.js. |
| `rival-studios.js` | **EASY** | 0 DOM refs; 4 guarded addAlert/addEvent calls (rival-studios.js:385-386, 709-710). |
| `boxoffice.js` | **MEDIUM** | 0 `document.*` refs, but orchestration functions pull global state instead of taking it: `releaseFilm` (boxoffice.js:433) and `processWeeklyBoxOffice` (boxoffice.js:549) call `window.HollywoodMogul.getGameState()` internally, so tests must install a stub `HollywoodMogul` first. The calculators (`calculateBaseBoxOffice` boxoffice.js:211, `calculateAncillaryRevenue` boxoffice.js:738) are EASY pure functions. |
| `censorship.js` | **MEDIUM** | Evaluation core is pure and parameterized (`evaluateScript` censorship.js:133, `evaluateScriptHaysCode` censorship.js:157); but `applyPCAPenalties` reaches out to `window.HollywoodMogul.spendCash` (censorship.js:500) and the modal functions (censorship.js:322-443) use `showModal` + inline-onclick callbacks. |
| `events.js` | **MEDIUM** | Effect application is parameterized (`applyChoiceEffects(choice, film, gameState)`, events.js:2787) with guarded `spendCash`/`showModal` calls (events.js:2705-2706, 2791-2792); testable with a stub, but event *choice* flow is driven by modal HTML. |
| `awards.js` | **MEDIUM** | Interleaving example: `triggerOscarCeremony` (awards.js:472) computes nominations/winners, then calls `showOscarCeremonyModal` (awards.js:511 → creates a div and `document.body.appendChild(modal)` at awards.js:705, 789) *before* `applyOscarBenefits` (awards.js:515) — the pure pipeline cannot run without a DOM present. Works under jsdom; a refactor to separate ceremony computation from presentation would make it EASY. |
| `game-state.js` | **MEDIUM** | Cash/time logic directly calls display updaters that require specific DOM ids (`#cash-display`, `#runway-display` etc. — see tests/setup.js:32-61 mock); already tested under jsdom, so the pattern is proven, just DOM-coupled. |
| `financial.js` | **HARD** (loan/investment/mob flows); MEDIUM for `processMonthlyFinances` | The money decision lives in the DOM: `submitLoanApplication` reads the loan amount from `document.getElementById('loan-amount').value` (financial.js:439-442) and then pushes the loan and credits `gameState.cash += amount` (financial.js:471-473); the selected loan type travels via `window._currentLoanType` (financial.js:364, 378). `updateLoanPreview` (financial.js:375-397) interleaves the term/interest math with `previewDiv.innerHTML` rendering, so the calculation cannot be exercised without live DOM elements. By contrast `processMonthlyFinances(gameState)` (financial.js:154-200) is parameterized and immediately testable. |
| `production.js` | **HARD** (distribution + event modals); MEDIUM for greenlight/weekly loop | `chooseDistribution` reads `window._distributionFilm` / `window._distributionGameState` globals (production.js:703-705) that were stashed by modal-rendering code, then debits/credits cash (production.js:716, 724, 731); buttons are wired via inline `onclick` strings. `showEventModal` hand-builds DOM nodes (production.js:447-512) and its choice handler debits cash (production.js:530). `greenlightFilm` and `processWeeklyProduction` (production.js:126, 142-170) take `gameState` and are testable with a stubbed `HollywoodMogul.addAlert`. |

Pattern finding for the build plan: the codebase's recurring anti-pattern is **modal HTML with inline `onclick` → handler reads DOM/`window._*` globals → mutates cash**. Every HARD rating above traces to it. Extracting "compute terms/price" functions that the modal handlers call would flip financial.js and production.js to MEDIUM with small diffs.

## Existing test quality

**tests/game-state.test.js** (~40 tests): covers initialization defaults, `addCash`/`spendCash` (including negative-amount bookkeeping), runway math (exact 120/100-week values and the 999 zero-burn sentinel), week/month advancement, bankruptcy via `endGame` and via negative-cash advance, alert cap of 10, modal open/close, and three small integration flows. Genuine behavior tests overall.

**tests/systems.test.js** (~157 tests): technology purchase/year-gating/prerequisite chains, TV penetration table and box-office penalty bounds (floor 0.5, tech defense), franchise qualification/sequel generation/loyalty decay, and save/load (schema validation, backward compat with missing/null fields, round-trip, autosave, delete, integrity). The result-object style (`{success, message}`) keeps most assertions behavioral.

Implementation-detail assertions (brittle to tuning, catch no behavior bugs):

- Constant change-detectors: `expect(constants.STARTING_CASH).toBe(600000)` etc. (game-state.test.js:61-70); `SEQUEL_AUDIENCE_RETENTION` must be 0.85 and `SEQUEL_QUALITY_PENALTY` must be -5 (systems.test.js:1197-1206); exact tech cost "COLOR_FILM costs 200000" (systems.test.js:41-49); exact TV penetration points 0.45/0.79/0.93 (systems.test.js:635-640). Any balance pass breaks dozens of tests without a bug present.
- Presentation-string assertions: cash display must equal `'$600,000'`, runway display must equal `'∞'`, status text `'DANGER'` (game-state.test.js:318-355) — these test the formatter's output embedded in game-state rather than the underlying state.
- Storage-format coupling: save tests parse the raw `mockStorage['hollywood-mogul-saves']` JSON and assert internal slot layout (systems.test.js:1376-1398) — partially justified for a persistence format, but renaming the storage key or slot scheme breaks tests even when round-trip behavior is intact.

Obviously missing edge cases *within what is tested*:

- **No quota/failed-write test**: `setItem` throwing (`QuotaExceededError`) is never simulated; `saveGame`'s catch path and `autoSave`'s failure return are untested — and reading the code shows there is no quota-specific handling to test (save-load.js catches log-and-return-false only).
- **No corrupted-storage test**: garbage JSON in `hollywood-mogul-saves` (the `getAllSaves` catch, save-load.js:200-206) and truncated save blobs are untested.
- **Migration is tested only as "missing fields default to []"** (systems.test.js:1683-1780). There is no test of an actual v1.0→v2.0 field transformation because none exists in code — version mismatch is a `console.warn` (save-load.js:364-368). A real old save with renamed/moved fields has no verified path.
- **Round-trip omits complex state**: no save/load test with populated `activeFilms` (whose objects carry Date fields like `originationDate`), `contractPlayers`, `finances.loans`, or `oscarCeremonies`; only `technologies`/`franchises` round-trip is verified. `completedFilms` is saved with one stub object but its restoration is never asserted.
- **Weak assertion**: the monthly-burn test only checks `finalCash < initialCash` (game-state.test.js:166-178), not that exactly `monthlyBurn` was deducted once (a double-deduction bug would pass).
- **tests/setup.js foot-guns**: the global localStorage mock never stores values (setup.js:180-186), which is why systems.test.js builds its own working mock (systems.test.js:1315-1324); `createMockGameState` uses stale defaults (cash 75000 / burn 30000 vs real 600000 / 20000, setup.js:79-80); `console.error` is swallowed globally (setup.js:170-177), hiding real failures inside catch blocks.

## Findings

```json
[
  {
    "id": "TEST-001",
    "workstream": "test",
    "severity": "S1",
    "title": "9.69% statement coverage overall; every money-touching system is at 0%",
    "evidence": "npx jest --coverage (2026-07-02): All files 9.69% stmts / 7.13% branch / 8.35% funcs / 9.53% lines over 7197 statements; js/systems/financial.js, boxoffice.js, production.js, awards.js, censorship.js, events.js, studio-lot.js, talent-management.js, rival-studios.js, crisis.js all 0%. Full table in docs/audit/TEST.md.",
    "repro": "npx jest --coverage --coverageReporters=text",
    "player_impact": "Any balance fix, refactor, or feature touching the economy can silently break income/expense math; the ECON workstream's exploit fixes cannot be locked in as regressions",
    "suggested_direction": "Adopt the top-10 target list (financial, boxoffice, production, game-state, save-load, events, studio-lot, talent-management, censorship, awards) as mandatory build-plan test items; start with the four EASY modules for fast wins",
    "confidence": "high"
  },
  {
    "id": "TEST-002",
    "workstream": "test",
    "severity": "S2",
    "title": "npm run test:coverage always fails: 80% thresholds vs 9.69% actual",
    "evidence": "jest.config.js coverageThreshold {branches:70, functions:75, lines:80, statements:80}; run output: 'Jest: \"global\" coverage threshold for statements (80%) not met: 9.69%' (exit 1)",
    "repro": "npm run test:coverage; echo $?",
    "player_impact": "Indirect: the documented coverage gate is permanently red, so it cannot be wired into CI and coverage regressions go unnoticed",
    "suggested_direction": "Set thresholds to current reality (~9%) and ratchet upward per module as tests land; or scope thresholds per-directory (high for js/systems, none for js/ui until refactor)",
    "confidence": "high"
  },
  {
    "id": "TEST-003",
    "workstream": "test",
    "severity": "S1",
    "title": "Save data-loss paths untested and largely unimplemented: no quota handling, no migration, export/import/backup at 0%",
    "evidence": "js/core/save-load.js:431-813 (export/import/backup/versioning) uncovered per coverage report; version mismatch only console.warns 'compatibility mode' (save-load.js:364-368) with no transformation; no QuotaExceededError handling in any catch block (all log-and-return); corrupted-JSON path save-load.js:200-206 untested; systems.test.js backward-compat tests (1683-1780) only verify missing/null arrays default to []",
    "repro": "grep -n 'Quota\\|migrat' js/core/save-load.js (no hits for either); npx jest --coverage and inspect save-load.js uncovered ranges",
    "player_impact": "A late-game (77-year) campaign save that exceeds localStorage quota fails silently; loading a pre-2.0 save has no verified path — save corruption/loss is refund territory",
    "suggested_direction": "Add tests simulating setItem throwing QuotaExceededError, corrupted JSON blobs, and a real v1-shaped save with populated films/loans; implement and test an explicit migration function per version bump",
    "confidence": "high"
  },
  {
    "id": "TEST-004",
    "workstream": "test",
    "severity": "S2",
    "title": "Cash-mutating logic interleaved with DOM reads/globals makes the two biggest money systems un-unit-testable (HARD)",
    "evidence": "js/systems/financial.js:439-442 submitLoanApplication reads loan amount from document.getElementById('loan-amount').value, then credits gameState.cash += amount at financial.js:472-473; loan type travels via window._currentLoanType (financial.js:364); updateLoanPreview (financial.js:375-397) mixes interest math with previewDiv.innerHTML. js/systems/production.js:703-705 chooseDistribution reads window._distributionFilm/_distributionGameState set by modal code, then debits/credits cash (production.js:716, 724, 731); showEventModal builds DOM inline (production.js:447-512) with cash debit in handler (production.js:530). awards.js:511 calls showOscarCeremonyModal (document.body.appendChild at awards.js:789) mid-pipeline before applyOscarBenefits (awards.js:515).",
    "repro": "Attempt to call FinancialSystem.submitLoanApplication in Node without a rendered loan modal: returns early at the getElementById guard (financial.js:440), so the cash path is unreachable",
    "player_impact": "Indirect: the loan and distribution economies (prime exploit candidates) cannot get regression tests until compute is separated from presentation",
    "suggested_direction": "Extract pure functions (computeLoanTerms(amount, loanType), applyDistributionChoice(film, strategy, gameState)) that modal handlers call; pass state as parameters instead of window._* globals; then unit test the extracted functions",
    "confidence": "high"
  },
  {
    "id": "TEST-005",
    "workstream": "test",
    "severity": "S3",
    "title": "Dozens of tests assert balance constants and presentation strings rather than behavior",
    "evidence": "tests/game-state.test.js:61-70 asserts STARTING_CASH===600000 etc.; tests/systems.test.js:41-49 asserts COLOR_FILM cost 200000, 1197-1206 asserts SEQUEL_AUDIENCE_RETENTION===0.85 and SEQUEL_QUALITY_PENALTY===-5, 635-640 asserts exact TV penetration points; game-state.test.js:318-355 asserts display strings '$600,000', '\\u221e', 'DANGER'",
    "repro": "Change any balance constant (e.g., STARTING_CASH) and run npm test: multiple failures with no behavior bug",
    "player_impact": "Indirect: every balance-tuning pass from the ECON workstream will churn tests, training developers to update assertions mechanically instead of investigating failures",
    "suggested_direction": "Replace exact-value assertions with invariant/relational ones (cost deducted equals catalog cost; penetration monotonic; display reflects state), keeping at most one schema test per data table",
    "confidence": "high"
  },
  {
    "id": "TEST-006",
    "workstream": "test",
    "severity": "S3",
    "title": "tests/setup.js contains foot-guns: non-functional localStorage mock, stale mock game state, swallowed console.error",
    "evidence": "tests/setup.js:180-186 global localStorage mock's getItem/setItem are bare jest.fn()s that never store (systems.test.js:1315-1324 had to build its own working mock); setup.js:79-80 createMockGameState uses cash 75000 / monthlyBurn 30000 vs real defaults 600000 / 20000 (js/core/constants.js STARTING_CASH); setup.js:170-177 mocks console.error/warn globally, hiding real errors caught inside system catch blocks",
    "repro": "Write a new test using global localStorage.setItem then getItem: returns undefined; compare testUtils.createMockGameState().cash to HollywoodMogul defaults",
    "player_impact": "Indirect: new tests written against these utilities silently test the wrong economy or pass despite storage failures",
    "suggested_direction": "Replace the localStorage mock with the working store-backed implementation from systems.test.js; derive createMockGameState from CONSTANTS; only silence console per-test where noise is expected",
    "confidence": "high"
  },
  {
    "id": "TEST-007",
    "workstream": "test",
    "severity": "S2",
    "title": "Covered areas miss key edge cases: complex-state save round-trip, exact burn deduction, end-game flow uncovered",
    "evidence": "No save/load test populates activeFilms/contractPlayers/finances.loans/oscarCeremonies (only technologies/franchises round-trip, systems.test.js:1783-1810); monthly-burn test asserts only finalCash < initialCash (game-state.test.js:166-178), so a double-deduction would pass; game-state.js end-game flow (829-931) and weekly/monthly processing hooks (587-667) uncovered per coverage report",
    "repro": "npx jest --coverage; inspect game-state.js uncovered ranges; grep systems.test.js for 'activeFilms' in round-trip tests",
    "player_impact": "Save/load of a real mid-campaign game (films in production, loans outstanding) is unverified — the highest-traffic save shape is the untested one",
    "suggested_direction": "Add a 'kitchen-sink' round-trip test built from a real mid-game state; assert exact burn deduction per 4-week cycle; cover endGame paths for each endingType",
    "confidence": "high"
  },
  {
    "id": "TEST-008",
    "workstream": "test",
    "severity": "S3",
    "title": "Dead code in js/systems/unused/ is counted in coverage denominators",
    "evidence": "jest.config.js collectCoverageFrom includes js/**/*.js without excluding js/systems/unused/; scandals.js (303 stmts) and storylines.js (232 stmts) = 535 of 7197 statements (7.4%) are dead code per AUDIT-PLAN §0.5",
    "repro": "npx jest --coverage; see systems/unused rows in report",
    "player_impact": "None directly; skews coverage metrics and hides real progress",
    "suggested_direction": "Add '!js/systems/unused/**' to collectCoverageFrom (or better, delete the directory per the CODE workstream)",
    "confidence": "high"
  }
]
```

## Not covered

- **Churn dimension of the ranking**: AUDIT-PLAN §8 asks for (money-touching × line count × churn). Git history churn per file was not measured; the ranking above uses money-touching × line count only. A `git log --format= --name-only | sort | uniq -c` pass would refine ties (e.g., events.js vs studio-lot.js ordering).
- **Flakiness audit**: the suite was run once (plus the passing baseline). Probabilistic tests (e.g., systems.test.js:782-799 `checkForTvEvents` 200-iteration loop, franchise quality-randomness bounds) were reviewed statically but not re-run N times to measure flake rate.
- **Mutation testing / assertion strength beyond reading**: no Stryker-style run to quantify how many covered lines are actually asserted.
- **UI-layer testability** (`js/ui/*`, 14 files, all 0%): classified implicitly as HARD/out-of-scope for unit tests; a Playwright smoke suite (PLAY workstream) is the right tool there and was not assessed here.
- **Exit-code verification of `npm run test:coverage`**: the coverage run was piped through `tail`, so the exit code observed was the pipe's; the threshold-failure messages confirm jest fails the run, but the exact exit code was not independently captured.
