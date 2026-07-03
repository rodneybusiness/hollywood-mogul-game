# DESIGN Workstream — Game Design & Systems Depth Audit

Auditor: DESIGN workstream (per `docs/AUDIT-PLAN.md` §3). Method: full code read of `js/core/` and `js/systems/`, cross-referenced with the UI layer (`js/ui/`) to determine which code paths actually execute, plus a headless jsdom-style verification run (`node` with `window` stubbed; script preserved below in "Repro" fields) to confirm the box-office math and the release-path crash. Date: 2026-07-02.

## Summary

- **The game has two competing core loops and the modern one is dead on arrival.** `BoxOfficeSystem.releaseFilm`/`getDistributionStrategies` throw a `TypeError` at runtime because `window.TimeSystem.getCurrentDate` does not exist (`js/systems/boxoffice.js:215` calls it; `js/core/time-system.js:408-436` never exports it). The game only "works" through a legacy modal path inside `production.js` that bypasses era scaling, TV competition, technology revenue bonuses, franchise bonuses, MPAA multipliers, and affordability checks.
- **The economy is mathematically unwinnable after ~1950.** All theatrical revenue is hard-clamped to `potential.max * 1.5` = $900k gross / $495k studio net for a wide release (`js/systems/boxoffice.js:140-166,390-394`) in every era, while era budget floors scale to $500k (1950) → $30M (2005) and monthly burn scales 12× (`js/core/constants.js:196-208`). Verified numerically: a quality-85, star-90 film in 1995 projects $6.6M but is clamped to $900k against a $10M-80M budget range.
- **Of the 12 satellite systems, only 2 are solidly integrated** (technology, scenarios), 4 are partially integrated (awards, censorship, franchise, studio-lot — each with half their outputs written to fields nothing reads), 2 are cosmetic (newspaper, achievements), and 4 are orphans or broken at runtime (crisis, rival-studios, tv-competition, talent-management). The interlock map below is the detailed deliverable.
- **Player choices are largely placebo.** The 50-event choice system (`events.js`), crisis choices, and Hays Code penalties all write consequences to orphan film fields (`film.quality`, `film.weeksRemaining`, `film.budgetSpent`, `film.boxOfficeMultiplier`) that production and box office never read (they use `currentQuality`, `delayWeeks`, `spentToDate`, and no multiplier at all). Only cash and reputation effects are real. Casting does not exist as a player lever: every film gets a random director/lead from 4 hardcoded names (`js/systems/production.js:786-818`).
- **Failure design is a cliff with warnings but no rope.** Cash < 0 = instant game over (`js/core/game-state.js:382-392`); loans are unreachable (`FinancialSystem.takeLoan` doesn't exist — `js/ui/dashboard.js:818`, `js/core/integration.js:456`), loan repayment is never processed (`processMonthlyLoans` doesn't exist — callers at `js/core/game-controller.js:234`, `js/core/integration.js:142` vs. actual `processMonthlyFinances` at `js/systems/financial.js:154`), and the intended "near bankruptcy" rescue crisis is dead code (`CrisisSystem.checkForCrisis` has no callers).

---

## Core loop levers

The loop as executed at runtime: script arrives monthly → player greenlights (full budget prepaid, `production.js:126`) → 17 weeks of automated phases with random event modals → completion auto-opens the **legacy** distribution modal (`production.js:635-698`) → `scheduleBoxOfficeRun` → 4 weeks of revenue → done. The intended modern path (dashboard "distribute" button → `BoxOfficeSystem.releaseFilm`) crashes (DESIGN-001).

| Lever | Real effect size (as executed) | Evidence (file:line) |
|---|---|---|
| **Script quality** | Strongest lever. Working path: revenue ∝ `finalQuality / 70` (linear, ±40% over the quality range seen in scripts). Crashed path: `quality × $2,000 × eraInflation` base. | `js/systems/production.js:923-932` (working); `js/systems/boxoffice.js:228` (dead) |
| **Script budget** | Working path: revenue ∝ `originalBudget × 1.5` — bigger budget linearly raises projected gross, *but* the $900k/$375k clamp (`boxoffice.js:390-394`) truncates it, so past ~$400k budget the lever silently stops working, forever. No player budget choice exists — budget is fixed per script. | `js/systems/production.js:924,928-929`; `js/systems/boxoffice.js:140-166,390-394` |
| **Cast quality (star power)** | **Non-lever.** Player never casts (no UI calls `TalentManagement.greenlightScriptWithTalent` / `hireForProduction`; greenlight goes straight to `ProductionSystem.greenlightScript` at `js/ui/dashboard.js:682,704`). A random lead from 4 hardcoded actors is assigned (`production.js:805-818`). Star power multiplier reads `film.cast`, a field never written anywhere (`boxoffice.js:231-235`), so even the random star never affects revenue. Cast chemistry contributes `(chemistry-70) × 0.1` ≈ ±2 quality pts. | `js/systems/production.js:805-818,895`; `js/systems/boxoffice.js:231` |
| **Director** | Non-lever. Random from 4 hardcoded directors; skill contributes `(skill-70) × 0.2` ≈ ±4 quality points ≈ ±6% revenue. Overwrites anything the (unreachable) talent path would set. | `js/systems/production.js:786-803,892` |
| **Genre (vs. genre heat)** | Real but modest: per-year `GENRE_HEAT` multipliers 0.2–1.8 exist for 1933-2010, applied via `film.genreHeat/100` in the working path — captured **once at greenlight** (`production.js:96`), so a 17-week production shift never matters. This is the only lever that changes across eras. | `js/systems/boxoffice.js:9-116`; `js/systems/production.js:96,926` |
| **Release timing (season/holiday)** | **Non-lever.** `TimeSystem.getTimeBasedBoxOfficeModifier` (summer 1.1×, Christmas 1.3×...) is defined and exported but has zero callers. Films auto-release at production end; the player can't hold a finished film for a better window anyway. | `js/core/time-system.js:98-112,416` (no callers repo-wide) |
| **Distribution strategy** | Real, and the only end-of-pipeline decision: wide (×1.5 on projection, $25k flat marketing) vs. limited (×0.8, $8k) vs. sell rights (0.6 × budget guaranteed — always a 40% loss). Marketing costs in this working path are hardcoded 1933 dollars, never era-scaled, and deducted without an affordability check (`production.js:717,724` can push cash negative → instant game over). | `js/systems/production.js:703-753,923-932` |
| **Technology purchases** | Real: quality bonus feeds `finalQuality` (`production.js:913-918`), budget multiplier cuts weekly costs (`production.js:216-218`), speed bonus shortens phases (`production.js:853-866`), maintenance raises burn (`game-state.js:318-320`). Revenue multipliers (`+20-30%`) only exist in the crashed path (`boxoffice.js:269-280`) so the headline benefit never lands. | `js/systems/technology.js:298-392` |
| **MPAA rating choice (post-1968)** | Placebo. The rating modal works and sets `audienceMultiplier` (G 1.2× … NC-17 0.25×), but that multiplier is only read in the crashed path (`boxoffice.js:254-256`). Real effects: content-cut quality loss and the ±5-10 reputation modifier. | `js/systems/censorship.js:63-114,272-300`; `js/systems/boxoffice.js:254` |

**Variance vs. determinism:** in 1933-49 the loop is reasonably tuned. Monte-Carlo of the (dead) box-office formula at 1936 values — quality 40-90, budget $100k, wide release — gives p10/p50/p90 profit of **-$30k / +$39k / +$114k with a 34% loss rate**: levers matter and risk is felt. The working path is more deterministic (projection is a pure formula; variance only from the clamp, critical reception drawing on `scriptQuality` rather than `finalQuality` (`boxoffice.js:337-361`), and ±competition events). After 1950 nothing matters: every option loses money (see DESIGN-002).

---

## System interlock map

Classification: **INTEGRATED** = outputs feed money/film outcomes in code paths that actually run; **COSMETIC** = display only; **ORPHAN** = parallel mini-game whose outputs nothing reads; **BROKEN** = intended integration exists but crashes or is never invoked at runtime. "At runtime" accounts for the fact that `GameController.advanceTime` is never called — the advance buttons bind to `game-state.js`'s own loop (`js/core/game-state.js:102-103,234-281`), so everything wired only through `game-controller.js:168-277` is dead.

| System | Inputs (reads) | Outputs (writes) | Verdict |
|---|---|---|---|
| **talent-management.js** | `TalentRoster` (174 people, era availability windows), `contractPlayers`, cash | Intended: contracts, per-film hires, cast chemistry. Actual: `signContract` **crashes** on `window.TimeSystem.getCurrentDate()` (`talent-management.js:50`, invoked from `dashboard-talent-addon.js:224`); `greenlightScriptWithTalent`/`hireForProduction` have **zero UI callers**; weekly salaries never charged (`processWeeklyContracts`/`processYearlyContracts` have no callers) and burn calc reads `monthlySalary`, a field contracts don't have (`game-state.js:307-311` vs `talent-management.js:43-60`) | **BROKEN** |
| **censorship.js** | script text/genre/censorRisk, era via `GameConstants` | Greenlight gate modal (real decision); cash penalty via `spendCash` (real, `censorship.js:500`); reputation (real). Quality/schedule penalties written to orphan fields `film.quality/budgetSpent/weeksRemaining` (`censorship.js:493-495`) — production uses `currentQuality/spentToDate/delayWeeks`. MPAA `audienceMultiplier` only consumed by the crashed release path. `finalPCAReview` (10% seal-denial drama) has no callers. | **INTEGRATED (half the teeth missing)** |
| **crisis.js** | `huacActive`, cash, reputation, films | Would write reputation/cash/monthlyBurn (real) plus orphan film fields; contains the only bankruptcy-rescue mechanic (`near_bankruptcy`, `crisis.js:161-204`). `checkForCrisis` has **no callers anywhere**. | **ORPHAN (dead code)** |
| **rival-studios.js** | own AI state, player films | `processWeeklyRivalUpdates` only wired via dead `GameController` (`game-controller.js:188`) and a nonexistent `TimeSystem.addWeeklyCallback` (`rival-studios.js:187`) → rivals **never act after init**. Even if they ran: `playerFilm.competitionPenalty` (`rival-studios.js:369-375`) is never read by box office; rival budgets hardcoded to 1933 scale ($30k-250k) for all 77 years (`rival-studios.js:458-466`). Market-share panel renders static init values (`dashboard-rival-extensions.js:63-73`). | **ORPHAN** (dashboard slice: COSMETIC) |
| **technology.js** | cash, gameYear, owned techs | Quality bonus → `finalQuality` (`production.js:913-918`) ✔; budget multiplier → weekly cost (`production.js:216-218`) ✔; speed bonus → phase length (`production.js:853-866`) ✔; maintenance → monthly burn (`game-state.js:318-320`) ✔. Revenue multiplier + genre bonus + TV defense only in crashed path (`boxoffice.js:267-292`). | **INTEGRATED** (best-connected system) |
| **tv-competition.js** | year, era, tech defenses | `getBoxOfficePenalty` only called from the crashed `calculateBaseBoxOffice` (`boxoffice.js:259-265`); `checkForTvEvents` only called from dead `GameController` (`game-controller.js:251`). The era's signature threat **never touches a running number**. | **ORPHAN at runtime** |
| **franchise.js** | completed-film revenue (2× budget gate), era | Sequel scripts injected into `availableScripts` (`franchise.js:238-261`, called from the live `boxoffice.js:611-613`) ✔ real content feedback. But `getFranchiseBoxOfficeMultiplier` (the actual payoff, up to 1.8×) is only read in the crashed path (`boxoffice.js:283-288`), and the $900k gross cap makes the 2×-budget qualification impossible once era budget floors pass ~$450k (~1950). | **PARTIAL — content loop real, economy loop dead** |
| **studio-lot.js** | cash, reputation, filmsProduced | Maintenance → burn ✔ (`game-state.js:313-315`); speed bonus → phases ✔ (`production.js:860-864`). `getQualityBonus`/`getRevenueBonus` have no external callers; `canStartNewProduction`/`maxConcurrentProductions` never enforced at greenlight; the legacy `hasRelevantBacklot` 15% discount reads `gameState.backlots` booleans (`production.js:820-829`) that only scenarios set — purchased backlots live in `gameState.studioLot.backlots` and never connect. Net: a money sink whose main sales pitch (capacity, quality, Technicolor revenue) is inert. | **PARTIAL (mostly a cost)** |
| **awards.js** | completed films of prior year, quality | Oscars fire every March via the live monthly path (`game-state.js:365-369`) ✔; reputation +2/nom +5/win (`awards.js:848-857`) ✔; `stats.oscarsWon` feeds loan gating (itself dead). `film.oscarNominated` "box office bump" flag set but never read (`awards.js:859-872`; no consumer in `boxoffice.js`). | **INTEGRATED (thin: reputation only)** |
| **newspaper.js** | game state, completed films, RNG | Monthly full-screen newspaper modal; all content display-only, box-office charts partially fictional (`newspaper.js:1003`). Writes nothing back. | **COSMETIC** |
| **scenarios.js** | chosen scenario | Starting cash/reputation/backlots/scripts/restrictions (`scenarios.js:419-545`) ✔; victory conditions checked monthly (`scenario-ui.js` via `integration.js:147-149`) ✔. The one real replay lever (7 scenarios). | **INTEGRATED** |
| **achievements.js** | whole game state | Writes `achievementsUnlocked` + toast only. `checkAchievements` is wired solely through dead `GameController` (`game-controller.js:193,246`) and post-Oscar (`awards.js:521-523`) → checked once a year in March. Several achievements reference fields that don't exist on real films (`f.quality`, `f.budget`, `gameState.loans`) so they can never unlock (`achievements.js:58,382-383,460`). | **COSMETIC (partially unobtainable)** |
| **events.js** (50 choice events) | active films, year | Real: cash via `spendCash`, reputation (`events.js:2786-2827`). Orphan: `film.quality/hype/oscarPotential/morale/scandal/boxOfficeMultiplier/weeksRemaining/budgetSpent` — none consumed by production or box office. Era gating broken: `gameState.year` doesn't exist (`events.js:2579,2582` — real field is `gameYear`), so "wartime-only"/"Red Scare-only" events fire in any year. | **PARTIAL (choices are ~80% placebo)** |

**Tally: 2 INTEGRATED, 4 PARTIAL, 2 COSMETIC, 4 ORPHAN/BROKEN.** Per the audit plan, each orphan is an S1 finding (see JSON).

---

## Decision density by era

Decision = a prompt requiring player choice with any consequence (even cash-only). Estimated from trigger probabilities in code, assuming the player advances **by month** (advancing by week silently skips ALL monthly content — scripts, historical events, Oscars, newspaper, victory checks — because `game-state.js:258-272 advanceWeek` never calls `processMonthlyEvents`, only `advanceMonth` at `game-state.js:274-281` does; that alone is finding DESIGN-006).

| Year | Real decisions / game-year (est.) | What prompts them | Autopilot risk |
|---|---|---|---|
| **1935** | ~15-25 | 4-6 greenlights (600k cash / ~$100k scripts), Hays modal per risky script, ~40%/week production-event modals during each 4-week shoot (`production.js:271`) + 10%/week `EventSystem` events (`game-state.js:344-348`), 1 distribution modal per film, occasional tech/lot purchase, March Oscars. | Healthy, though most event choices are placebo (DESIGN-007). |
| **1943** | ~15-25 (same types) | Identical loop. War flavor: war scripts weighted 60-80% (`scripts.js:2337-2340`), war genre heat 1.5-1.6. Draft mechanic (`talent-roster.js:3375`) needs `warActive`, set by the Pearl Harbor event — which only fires if playing month-by-month. No new *decision types*. | Moderate — the war changes what you pick, not what you do. |
| **1955** | ~5-10 and falling | Same loop, but era budget floor is $500k-5M against a $495k max net per film — most greenlights are now guaranteed losses; the rational move is to stop producing. TV threat invisible (DESIGN-011). | **High — economically rational play is doing nothing.** |
| **1975** | ~0-5 | Budgets $2M-20M vs. capped ~$495k net + ~$800k ancillary. Every action loses money; monthly burn is 4× base. Decisions reduce to "watch runway shrink". | **Terminal autopilot / death spiral.** |
| **1995** | ~0 | Budgets $10M-80M. A player who somehow banked tens of millions in the 1930s-40s (possible: revenue has no cap-to-burn relationship early) can throw money away; there is no winning move. Rivals frozen, TV/franchise/tech-revenue systems inert. | **Unplayable as a game; only the 2010 survival timer ends it.** |

Even in the good years, decision *variety* is flat: the 77-year campaign has exactly one loop with no era-specific verbs (no theater-chain divestment choice for the Paramount Decree, no HUAC testimony — that's in dead `crisis.js`, no TV-production pivot, no home-video decision).

## Failure design

- **Trigger:** `cash < 0` → immediate `endGame('bankruptcy')` on the next time-advance (`js/core/game-state.js:382-392`). No debt state, no receivership, no grace period, no asset liquidation.
- **Warnings:** decent — runway-in-weeks with SAFE/WARNING(≤16wk)/DANGER(≤8wk) states on the dashboard (`game-state.js:401-424,537-561`). Tension exists.
- **Can the player dig out? No.** The three intended rescue mechanics are all disconnected: (1) loans — every UI entry calls nonexistent `FinancialSystem.takeLoan` (`dashboard.js:818`, `integration.js:456`; the real API is the modal chain `showLoanOptions→submitLoanApplication`, `financial.js:221,434`, which nothing opens); (2) the `near_bankruptcy` crisis with emergency loan / asset sale / silent partner (`crisis.js:161-204`) is never checked; (3) selling rights mid-run isn't possible — and the working sell-rights option pays 0.6× budget, a guaranteed loss (`production.js:930`).
- **Perverse safety:** because `processMonthlyFinances` never runs, if loans *were* obtainable they'd be interest-free free money that never has to be repaid (`financial.js:154-216` unreachable) — both failure pressure and rescue are broken, in opposite directions.
- **Cliff edges:** several systems deduct cash without affordability checks and can push you below zero in one click: production-event choices (`production.js:530-531`), legacy distribution marketing (`production.js:717,724`), monthly burn itself. A player at $20k cash can be bankrupted by an event modal with no "can't afford" gating (only `crisis.js` — dead — implemented `requiresCash`).

## Replay differentiation

**Randomized run-to-run** (no seeded RNG anywhere; save-scumming trivially re-rolls everything):
- Script market: 284 templates drawn 2-4/month with ±20% budget, ±15 quality variation and era-weighted category mix (`scripts.js:2436-2555`) — the main source of run variety.
- Production events (~40%/wk shooting), the 50-event choice deck (era-gating broken, so the same pool repeats for 77 years), critical reception, market events, Oscar outcomes.
- Scenario choice: 7 scenarios with different start cash/year/restrictions/victory conditions (`scenarios.js:10-378`) — the only *structural* replay lever.

**Static every run:**
- All historical events fire on fixed dates (no variance, no choices attached — `historical-events.js:3778-3829` auto-applies flags, most of which nothing consumes).
- Genre heat table, era scaling, tech tree, talent roster (fixed 174 people; availability windows only), rival studio definitions and their (frozen) behavior, franchise era bonuses.
- Content thins drastically post-1949, so late-era runs are near-identical: historical events per decade = 30 (1930s), 41 (1940s), then 9/8/5/7/8/7/1; talent debuting per decade = 76/42 then ~10-13. Two full campaigns would replay essentially the same 1950-2010.

---

## Findings

```json
[
  {
    "id": "DESIGN-001",
    "workstream": "design",
    "severity": "S0",
    "title": "Primary release/distribution path crashes: TimeSystem.getCurrentDate does not exist",
    "evidence": "js/systems/boxoffice.js:215,238,455,477,493,630 call window.TimeSystem.getCurrentDate(); js/core/time-system.js:406-436 exports no such function (it lives only on HollywoodMogul, js/core/game-state.js:480, and returns a Date with no .year anyway). Same missing API kills TalentManagement.signContract (js/systems/talent-management.js:50 via js/ui/dashboard-talent-addon.js:224) and BoxOfficeSystem.init's addWeeklyCallback (boxoffice.js:814). Headless run confirms: calculateBaseBoxOffice throws 'window.TimeSystem.getCurrentDate is not a function'.",
    "repro": "node: load js/core/constants.js, js/core/time-system.js, js/systems/boxoffice.js with global.window=global; call BoxOfficeSystem.calculateBaseBoxOffice({scriptQuality:80,genre:'drama',cast:[]},'wide') -> TypeError. In game: finish a film, click the dashboard 'distribute' button (js/ui/dashboard.js:74, executeDistribution -> releaseFilm), or sign any talent contract.",
    "player_impact": "The modern distribution UI and talent contracts crash; the game survives only via the legacy production.js modal that bypasses most systems",
    "suggested_direction": "Add getCurrentDate()/addWeeklyCallback to TimeSystem (returning {year,month,...}) or point all callers at HollywoodMogul; add an integration test that releases a film end-to-end",
    "confidence": "high"
  },
  {
    "id": "DESIGN-002",
    "workstream": "design",
    "severity": "S0",
    "title": "Box office hard-capped at $900k gross forever while budgets scale to $250M — game unwinnable after ~1950",
    "evidence": "simulateWeeklyBoxOffice clamps adjustedTotal to DISTRIBUTION_STRATEGIES[strategy].potential.max*1.5 (js/systems/boxoffice.js:390-394; wide max=600000 at :146, limited 250000 at :155) and these potentials are never era-scaled, while ERA_SCALING budget ranges reach 30M-250M and monthlyBurnMult 12x (js/core/constants.js:196-208). Both release paths funnel through this clamp (production.js:946 scheduleBoxOfficeRun also calls simulateWeeklyBoxOffice). Verified headlessly: 1955 proj $1.28M->clamped $900k vs budgets 500k-5M; 1975 proj $2.78M->$900k vs 2M-20M; 1995 proj $6.6M->$900k vs 10M-80M; 2008 proj $10.3M->$900k vs 30M-250M. Studio net = $495k; ancillary adds at most ~1.8x of the capped gross (boxoffice.js:684-768).",
    "repro": "Scratchpad verify.js run (see DESIGN.md preamble); or play past 1950 and compare any film's revenue to its budget",
    "player_impact": "Every film from the TV era onward loses 50-99% of its budget; the last 60 years of the 77-year campaign are a scripted death spiral",
    "suggested_direction": "Scale potential min/max by eraInflation (they're already 1933 dollars), or replace the clamp with a soft cap relative to budget/era",
    "confidence": "high"
  },
  {
    "id": "DESIGN-003",
    "workstream": "design",
    "severity": "S1",
    "title": "Monthly finance processing never runs: loans free, investments never pay, mob favors never trigger",
    "evidence": "Callers invoke FinancialSystem.processMonthlyLoans which does not exist (js/core/game-controller.js:234-236, js/core/integration.js:142-144); the real function is processMonthlyFinances (js/systems/financial.js:154) with zero callers. Consequences: loan interest/principal never deducted (financial.js:163-186), investment monthlyRevenue never paid (financial.js:189-194 — investments are a pure money sink), mob favor checks never fire (financial.js:1019-1022), credit rating never updates.",
    "repro": "grep -rn processMonthlyFinances js/ -> only definition+export; take a loan via console FinancialSystem.submitLoanApplication and advance 12 months: balance never decreases",
    "player_impact": "Debt has no cost (exploit if reachable), the entire investment feature is a scam against the player, and the mob-favor content (5 favors, retaliation arc) is unreachable",
    "suggested_direction": "Rename call sites to processMonthlyFinances and wire it into game-state's processMonthlyEvents",
    "confidence": "high"
  },
  {
    "id": "DESIGN-004",
    "workstream": "design",
    "severity": "S1",
    "title": "Loans are unreachable: every loan button calls nonexistent FinancialSystem.takeLoan",
    "evidence": "js/ui/dashboard.js:818 and js/core/integration.js:455-456 call window.FinancialSystem.takeLoan (undefined; dashboard path throws, integration path is guard-skipped). The working modal chain showLoanOptions/submitLoanApplication (js/systems/financial.js:221,434) has no UI entry point (grep: only internal references).",
    "repro": "Click a loan button on the dashboard finance panel (js/ui/dashboard.js:520); observe console TypeError and no loan",
    "player_impact": "No financing = no recovery tool before bankruptcy; combined with DESIGN-016 the failure state has zero counterplay",
    "suggested_direction": "Implement takeLoan(loanType, amount) on FinancialSystem or route buttons to showLoanApplication",
    "confidence": "high"
  },
  {
    "id": "DESIGN-005",
    "workstream": "design",
    "severity": "S1",
    "title": "GameController is dead code: rivals, achievements, TV events and era transitions never process",
    "evidence": "GameController.advanceTime (js/core/game-controller.js:32) has zero callers — the advance buttons bind to game-state.js's own advanceTime (js/core/game-state.js:102-103,234). Everything wired only in GameController is therefore inert: RivalStudios.processWeeklyRivalUpdates (:188), AchievementSystem.checkAchievements (:193,246), TVCompetitionSystem.checkForTvEvents (:251), checkEraTransition/era:changed emission (:75-77,286-305) — so integration.js's era transition modal (integration.js:158-160) never shows either.",
    "repro": "grep -rn 'GameController.advanceTime' js/ -> no callers; play across 1934->1935 boundary: no 'A NEW ERA BEGINS' modal fires",
    "player_impact": "Two competing game loops drift apart; a third of the systems only exist in the dead loop",
    "suggested_direction": "Delete one loop; have game-state delegate to GameController (the code comment at game-state.js:4-5 says this was the plan)",
    "confidence": "high"
  },
  {
    "id": "DESIGN-006",
    "workstream": "design",
    "severity": "S1",
    "title": "Advancing week-by-week skips all monthly content: no new scripts, historical events, Oscars, or newspaper",
    "evidence": "game-state.js advanceWeek (js/core/game-state.js:258-272) calls processMonthlyExpenses + processWeeklyEvents only; processMonthlyEvents (scripts at :354-359, HistoricalEvents :361-363, Oscars :365-369, month:processed emit :375 which drives newspaper and scenario victory checks via integration.js:131-150) is invoked solely from advanceMonth (:274-281).",
    "repro": "New game; click ADVANCE WEEK 52 times: availableScripts never replenishes, no newspaper appears, Pearl Harbor never fires in Dec 1941",
    "player_impact": "The more engaged play style (weekly) starves the player of content and silently breaks the war/draft/HUAC flags that other systems read",
    "suggested_direction": "Trigger processMonthlyEvents from advanceWeek on month boundary (the expense code already detects it at :267)",
    "confidence": "high"
  },
  {
    "id": "DESIGN-007",
    "workstream": "design",
    "severity": "S1",
    "title": "Player choices are placebo: event/crisis/censorship consequences written to fields nothing reads",
    "evidence": "EventSystem.applyChoiceEffects writes film.quality/weeksRemaining/hype/oscarPotential/morale/scandal/boxOfficeMultiplier/budgetSpent (js/systems/events.js:2786-2836); CensorshipSystem.applyPCAPenalties writes film.quality/budgetSpent/weeksRemaining (js/systems/censorship.js:493-495); CrisisSystem writes film.boxOfficeModifier/weeksRemaining/quality (js/systems/crisis.js:554-572). Production reads currentQuality/delayWeeks/spentToDate (production.js:542,869,159); box office reads scriptQuality/finalQuality and no per-film multiplier (boxoffice.js:222,228,337). Only cash (spendCash) and reputation effects land. Bonus: events.js era conditions test gameState.year which doesn't exist (events.js:2579,2582; real field gameYear) so wartime/Red-Scare events fire in any year.",
    "repro": "Trigger any events.js choice with a quality effect; inspect film.currentQuality before/after (unchanged) and finalQuality at completion",
    "player_impact": "The game's 50-event decision layer — its main moment-to-moment gameplay — has no mechanical consequences beyond cash/reputation; players will eventually notice choices don't matter",
    "suggested_direction": "Standardize the film-effect field names (one setter API on the film object) and route all three systems through it",
    "confidence": "high"
  },
  {
    "id": "DESIGN-008",
    "workstream": "design",
    "severity": "S1",
    "title": "Casting is not a player lever: random 4-name placeholder cast, star power never reaches box office",
    "evidence": "Greenlight UI goes straight to ProductionSystem.greenlightScript (js/ui/dashboard.js:682,704; js/core/integration.js:290-292) with no talent selection; TalentManagement.greenlightScriptWithTalent and hireForProduction (talent-management.js:391,135) have zero UI callers. Films get a random director/lead from 4 hardcoded names each (production.js:786-818). Box office star-power multiplier reads film.cast (boxoffice.js:231-235), a field never assigned anywhere (grep: only boxoffice reads it).",
    "repro": "Greenlight any script; observe no casting step; film.leadActors = random Gable/Garbo/Stewart/Hepburn regardless of year (Garbo starring in 2005)",
    "player_impact": "A tycoon game's marquee fantasy (building a star roster and casting films) does not exist; the talent screen is disconnected shelf-ware",
    "suggested_direction": "Insert a casting step in the greenlight flow using greenlightScriptWithTalent; write film.cast so star power feeds revenue",
    "confidence": "high"
  },
  {
    "id": "DESIGN-009",
    "workstream": "design",
    "severity": "S1",
    "title": "Two contradictory distribution systems; the one that runs bypasses era scaling and all cross-system modifiers",
    "evidence": "Path A (auto-opens on completion, works): production.js:635-753 chooseDistribution — hardcoded $25k/$8k 1933 marketing forever, no affordability check (cash can go negative -> instant loss), sell-rights pays 0.6x budget (:930), projection ignores TV penalty/tech revenue/franchise/MPAA/star multipliers (:923-932). Path B (dashboard button, crashes per DESIGN-001): boxoffice.js releaseFilm with era-scaled marketing (:474-480), affordability check (:481), states-rights, and all modifiers (:254-292). Displayed theater cuts also disagree (50/60% at production.js:662,672 vs 45/30% at boxoffice.js:144,153).",
    "repro": "Complete a film: legacy modal appears automatically (production.js:635-637); compare its numbers with the dashboard distribute flow for the same film",
    "player_impact": "Whole subsystems (TV, tech revenue, franchise, MPAA) are silently excluded from the loop that runs; displayed projections lie",
    "suggested_direction": "Delete the production.js modal and route completion into BoxOfficeSystem (after fixing DESIGN-001)",
    "confidence": "high"
  },
  {
    "id": "DESIGN-010",
    "workstream": "design",
    "severity": "S1",
    "title": "Rival studios are an orphan: never update at runtime, and their outputs are never consumed",
    "evidence": "processWeeklyRivalUpdates wired only via dead GameController (game-controller.js:188-190) and nonexistent TimeSystem.addWeeklyCallback (rival-studios.js:187-189, typeof-guarded so silently skipped). Even if running: playerFilm.competitionPenalty (rival-studios.js:369-375) has no reader; rival budgets hardcoded $30k-250k for all eras (:458-466); talent pool is 10 fixed 1930s stars (:145-156). Dashboard market-share panel shows frozen init values (dashboard-rival-extensions.js:63-73).",
    "repro": "New game, advance 5 years, open rivals panel: market share identical to start (player 20/MGM 30/Warner 25/RKO 15/Paramount 10 from rival-studios.js:173-179); rivalStudios[x].completedFilms stays empty",
    "player_impact": "Zero competitive pressure across the whole campaign; a headline feature is a static infographic",
    "suggested_direction": "Call processWeeklyRivalUpdates from the live weekly loop; make box office read competitionPenalty; era-scale rival budgets",
    "confidence": "high"
  },
  {
    "id": "DESIGN-011",
    "workstream": "design",
    "severity": "S2",
    "title": "TV competition — the 1950s' defining mechanic — never affects a running number",
    "evidence": "getBoxOfficePenalty consumed only inside the crashing calculateBaseBoxOffice (boxoffice.js:259-265, dead per DESIGN-001; working path production.js:923-932 ignores it); checkForTvEvents called only from dead GameController (game-controller.js:251-261). Widescreen/stereo tvDefenseBonus (technology.js:45,60) therefore defends against nothing.",
    "repro": "Play 1950-1959; film revenue formula identical to 1935 apart from genre heat",
    "player_impact": "The era that should force a strategy shift is flavor-text; buying CinemaScope to fight TV is wasted money",
    "suggested_direction": "Apply the TV multiplier in the live projection and wire checkForTvEvents into the live monthly loop",
    "confidence": "high"
  },
  {
    "id": "DESIGN-012",
    "workstream": "design",
    "severity": "S2",
    "title": "Franchise payoff never lands: sequel box-office multiplier dead, qualification impossible post-1950",
    "evidence": "getFranchiseBoxOfficeMultiplier consumed only in the crashed path (boxoffice.js:283-288); working projection ignores isSequel/audienceBonus (production.js:923-932). Qualification needs revenue >= 2x budget (franchise.js:41,79) — impossible once budgets exceed ~$450k given the $900k gross cap (DESIGN-002), i.e. exactly when the era bonuses (1.4-1.8x, franchise.js:23-36) were meant to matter. Sequel script generation itself works (boxoffice.js:611-613 -> franchise.js:238-261).",
    "repro": "Make a 1930s hit; greenlight the offered sequel; compare its revenue to a non-sequel of equal quality (identical)",
    "player_impact": "Sequels cost 30% more (franchise.js:142) and carry -5 quality ceilings but deliver none of the promised audience bonus — a strictly bad deal",
    "suggested_direction": "Apply the multiplier in the live path; base qualification on ROI vs era-scaled expectations",
    "confidence": "high"
  },
  {
    "id": "DESIGN-013",
    "workstream": "design",
    "severity": "S2",
    "title": "Studio lot is mostly a money sink: quality/revenue/capacity benefits are never read",
    "evidence": "StudioLotSystem.getQualityBonus and getRevenueBonus (studio-lot.js:379-441) have no external callers; canStartNewProduction/maxConcurrentProductions (:461-465) never enforced at greenlight (production.js greenlightScript has no capacity check), so the headline sound-stage benefit is meaningless — you can already run unlimited productions. Purchased backlots (gameState.studioLot.backlots) never connect to the 15% production discount, which reads legacy gameState.backlots booleans (production.js:820-829) set only by scenarios (scenarios.js:435). Only speed bonus (production.js:860-864) and maintenance drain (game-state.js:313-315) are live.",
    "repro": "Buy the Grand Sound Stage ($350k): concurrent productions were already unlimited; buy Western Town: western weekly costs unchanged",
    "player_impact": "Players pay six figures plus monthly maintenance for benefits that don't exist — actively negative value",
    "suggested_direction": "Enforce capacity at greenlight, feed getQualityBonus into calculateFinalQuality, map studioLot.backlots into hasRelevantBacklot",
    "confidence": "high"
  },
  {
    "id": "DESIGN-014",
    "workstream": "design",
    "severity": "S2",
    "title": "Talent contracts (when not crashing) are free after the signing bonus and never expire",
    "evidence": "processWeeklyContracts and processYearlyContracts (talent-management.js:258,281) have zero callers; monthly burn adds contractPlayers[i].monthlySalary (game-state.js:307-311) but contracts store weeklyRate (talent-management.js:47) so the burn contribution is 0. Only the 25% signing bonus is ever paid (:31-63).",
    "repro": "(After fixing DESIGN-001's signContract crash) sign a 7-year contract; advance years: cash only drops by the signing bonus; contract never expires",
    "player_impact": "The roster-management economy (salary pressure, contract renewal decisions) doesn't exist",
    "suggested_direction": "Wire processWeeklyContracts/processYearlyContracts into the live loop; align the salary field names",
    "confidence": "high"
  },
  {
    "id": "DESIGN-015",
    "workstream": "design",
    "severity": "S2",
    "title": "Decision density collapses after 1950 and decision variety is flat across all 12 eras",
    "evidence": "One loop (greenlight/production-event/distribution) serves 1933-2010; no era introduces a new decision type in live code (HUAC testimony lives in dead crisis.js; Paramount Decree/blacklist/home-video are flag-setting modals, historical-events.js:3778-3829, whose flags warActive/blacklistActive are read only by talent availability, talent-roster.js:3375-3405). Post-1950 economics (DESIGN-002) make greenlighting irrational, reducing decisions/year toward zero; content thins in parallel (events per decade: 30/41/9/8/5/7/8/7/1 — grep 'year:' js/data/historical-events.js).",
    "repro": "Count prompts in a logged 1935 vs 1975 game-year (est. ~15-25 vs ~0-5)",
    "player_impact": "60 of 77 campaign years are autopilot; the 'survive to 2010' win is a clicking exercise",
    "suggested_direction": "Fix DESIGN-002 first, then give each era 1-2 unique live decisions (theater divestment, HUAC, TV/home-video output deals, franchise tentpoles)",
    "confidence": "high"
  },
  {
    "id": "DESIGN-016",
    "workstream": "design",
    "severity": "S2",
    "title": "Failure is a cliff: instant game over at cash<0, no debt state, all rescue mechanics disconnected",
    "evidence": "checkGameEndConditions ends the game the moment cash<0 (game-state.js:382-392) — including overdrafts caused by unguarded deductions in event choices (production.js:530-531) and legacy distribution marketing (production.js:717,724). Runway warnings exist (:401-424) but the counterplays don't: loans unreachable (DESIGN-004), near_bankruptcy rescue crisis never checked (crisis.js:161-204; checkForCrisis no callers), no mid-run rights sale.",
    "repro": "Reach ~$20k cash with a film in production; pick any event choice costing more than cash on hand; next week-advance = BANKRUPTCY screen",
    "player_impact": "Losses feel arbitrary (one modal click away) rather than earned through a visible debt spiral",
    "suggested_direction": "Allow negative cash with forced-borrowing/receivership pressure over N weeks; gate event choices on affordability like crisis.js intended",
    "confidence": "high"
  },
  {
    "id": "DESIGN-017",
    "workstream": "design",
    "severity": "S2",
    "title": "Replay differentiation rests on one lever (7 scenarios); late-game content repeats run-to-run",
    "evidence": "Randomized: script draws (284 templates, ±20% budget ±15 quality, scripts.js:2534-2555), production/box-office rolls. Static: fixed-date historical events with no choices, frozen rivals (DESIGN-010), fixed talent roster with post-1950 debuts of ~10-13/decade (grep availableFrom js/data/talent-roster.js), same 50-event pool for 77 years with broken era gates (events.js:2579-2582). Scenarios (scenarios.js:10-378) are the only structural variation. No RNG seeding anywhere, so save/reload rerolls outcomes freely (save-scumming unbounded).",
    "repro": "Diff the historical-event and Oscar sequences of two campaigns: identical; diff two 1990s script markets: near-identical small pools",
    "player_impact": "Second playthrough of the same scenario repeats itself, especially after 1950 — below the two-playthrough bar in the audit plan",
    "suggested_direction": "Vary event timing/outcomes, add per-run talent generation post-1950, era-gate the event deck properly",
    "confidence": "high"
  },
  {
    "id": "DESIGN-018",
    "workstream": "design",
    "severity": "S3",
    "title": "Dangling reward flags: Oscar box-office bump and MPAA audience multiplier are set but never consumed",
    "evidence": "applyOscarBenefits sets film.oscarNominated/oscarWinner 'for box office boost' (awards.js:859-872) — no reader in boxoffice.js; MPAA audienceMultiplier applied only in the crashed path (boxoffice.js:254-256); Oscar wins otherwise grant reputation only (awards.js:855-856). Achievements referencing f.quality/f.budget/gameState.loans can never unlock (achievements.js:58,382-383,460) and checks run only after March Oscars (awards.js:521-523) since GameController is dead.",
    "repro": "Win Best Picture with a film still in theaters; weekly revenue unchanged",
    "player_impact": "Award chasing and rating strategy feel inert; some achievements are unobtainable",
    "suggested_direction": "Consume the flags in the live revenue path; audit achievement predicates against real film fields",
    "confidence": "high"
  }
]
```

## Not covered

- **Live playtest verification in a browser** (audit plan says "verify in play"): findings here are code-traced and headless-verified (the DESIGN-001 crash and DESIGN-002 clamp were executed in Node with the real modules; loop wiring was traced via grep of every caller). Modal-flow feel, tutorial quality, and UI legibility are left to the PLAY/UX workstreams. Runtime behavior of the DOM-coupled paths (e.g., whether the dashboard's throwing click handler visibly breaks anything beyond the console) was not observed in a browser.
- **Full economy curves per strategy/seed** (ECON workstream's harness): I ran a 2,000-sample Monte-Carlo at one era (1936) and point-checks at 1955/1975/1995/2008 only.
- **Historical accuracy of data content** (HIST workstream), audio, save/load integrity, and `js/systems/unused/` (scandals.js, storylines.js — confirmed unloaded, not analyzed).
- **awards.js internals** (nomination scoring fairness vs rivals, lines 529-704) were skimmed, not fully traced; classification is based on its confirmed inputs/outputs.
- Decision-density figures are code-derived estimates from trigger probabilities, not instrumented play counts.
