# ECON — Automated Economy & Balance Simulation (AUDIT-PLAN §1)

**Method.** A headless harness (`tests/sim/`) boots the real game — the actual `index.html` DOM and all 44 scripts in page order — under jsdom with a seeded `Math.random`, then plays scripted strategies week-by-week. Two fidelity modes: `browser` reproduces the shipped boot sequence bugs-and-all; `patched` restores the intended-but-unwired monthly pipeline (new scripts, historical events, Oscars, loan processing) so the economy can be judged *as designed*, separate from its plumbing bugs. Full raw results: `sim-results-browser.json`, `sim-results-patched.json` (5 strategies × 5 seeds each).

Reproduce: `npm run sim -- --matrix --seeds 5 --fidelity browser` (or any single run via `--strategy prestige --seed 7 --monthly`).

## Headline result

**The game is unwinnable. 50 of 50 simulated runs ended in bankruptcy.** No strategy — cautious, prestige, random, exploitative, or passive — survives to the end year. Honest strategies die in **1933–1934**. The only way to see a second decade is an infinite-money exploit (0%-interest mob loans that are never collected), and even that dies eventually.

| Strategy | Fidelity | Bankruptcies | Median death year | Film ROI range |
|---|---|---|---|---|
| nothing | both | 10/10 | 1933 | — |
| conservative | browser | 5/5 | 1933 | 0.73–0.87 |
| conservative | patched | 5/5 | 1933 | 0.47–0.66 |
| prestige | browser | 5/5 | 1933–34 | 1.08–1.20 |
| prestige | patched | 5/5 | 1933–34 | 1.05–1.33 |
| exploit (mob loans) | browser | 5/5 | **2005** | 0.6 |
| exploit (mob loans) | patched | 5/5 | 1944–48 | 0.6 |
| random | both | 10/10 | 1933 | 0.6–1.02 |

Because no run leaves the 1930s honestly, the audit questions "do eras change optimal play," "when does money stop mattering," and "inflation handling at scale" are **unanswerable until the economy is repaired** — they must be re-run after Phase 3 of the build plan.

## Why every run dies — the arithmetic

Starting position (classic_start): **$410,000 cash, $20,000+/month burn** (rises with contract talent and era scaling). A prestige film costs ~$85–120k up front (full budget deducted at greenlight, `js/systems/production.js:126`), takes ~17 weeks to make, and returns ~1.1–1.3× its budget through a wide release. Best case that's **≈ +$1,500/week of profit per film in flight** against **≥ $5,000/week of burn** — and the burn is actually charged at nearly double rate (ECON-002). Two parallel prestige films cannot cover overhead; the cash floor arrives before awards, ancillary revenue, or era events could ever matter.

## Findings

```json
[
  {
    "id": "ECON-001",
    "workstream": "economy",
    "severity": "S0",
    "title": "Game is unwinnable: 50/50 simulated runs end in bankruptcy; honest play dies in year one",
    "evidence": "docs/audit/sim-results-browser.json + sim-results-patched.json — every run bankrupt; conservative/prestige die 1933-34 with per-film ROI 0.7-1.33 that cannot cover studio burn",
    "repro": "npm run sim -- --matrix --seeds 5 --fidelity patched",
    "player_impact": "A paying customer cannot reach 1935 without exploiting loans; the advertised 1933-2010 game is effectively a 12-month game-over screen",
    "suggested_direction": "Phase 3 rebalance: fix ECON-002/003 first, then retune starting cash, burn, and film returns so skilled play is cash-positive and careless play is not",
    "confidence": "high"
  },
  {
    "id": "ECON-002",
    "workstream": "economy",
    "severity": "S0",
    "title": "Weekly play charges monthly overhead ~1.9x: 21 monthly-expense charges in 48 weeks",
    "evidence": "js/core/game-state.js:267 — advanceWeek fires processMonthlyExpenses when (year changed || month changed || gameWeek % 4 === 1); calendar months (12/yr) and week-modulo (13/yr) both trigger. Empirical: EventBus 'financial:expenses' fired 21 times / $420,000 in 48 weeks at $20,000/month burn",
    "repro": "node -e \"...subscribe financial:expenses, tick 48 weeks...\" (see ECON.md); or any browser session advancing week-by-week",
    "player_impact": "Effective burn is ~doubled; primary driver of the year-one death spiral",
    "suggested_direction": "Charge on calendar month boundary only",
    "confidence": "high"
  },
  {
    "id": "ECON-003",
    "workstream": "economy",
    "severity": "S0",
    "title": "Week and month advancement run disjoint economies: weekly play never delivers new scripts/events/Oscars; monthly play never advances production or box office",
    "evidence": "js/core/game-state.js:258-281 — advanceWeek → processWeeklyEvents only (production/boxoffice); advanceMonth → processMonthlyEvents only (generateMonthlyScripts, HistoricalEvents.checkForEvents, Oscars). Sim proof: browser-fidelity exploit run produced 5 films in 72 years (initial 5 scripts, then permanent script starvation); same strategy in patched fidelity produced 253-344 films",
    "repro": "npm run sim -- --strategy exploit --seed 1 --fidelity browser (filmsProduced=5, scriptsAvailable=0)",
    "player_impact": "Whichever button the player favors silently disables half the game: no new scripts and no historical events (weekly), or frozen productions billed overhead (monthly)",
    "suggested_direction": "Single tick pipeline (the never-invoked GameController was headed here — see CODE workstream); month-boundary work triggered from weekly ticks",
    "confidence": "high"
  },
  {
    "id": "ECON-004",
    "workstream": "economy",
    "severity": "S1",
    "title": "Loans are free money: repayment code is never called (wrong function name at both call sites, and the EventBus subscription is wiped anyway)",
    "evidence": "js/systems/financial.js exports processMonthlyFinances; both callers guard on nonexistent FinancialSystem.processMonthlyLoans (js/core/integration.js:142, js/core/game-controller.js:234) so the branch never runs; additionally startNewGameWithScenario calls EventBus.clear() (js/core/game-state.js:164) after Integration subscribed, killing the month:processed handler. Sim proof: exploit run carried $133,000,000 mob debt for 72 game-years with zero payments, interest, or consequences",
    "repro": "npm run sim -- --strategy exploit --seed 3 --fidelity browser → summary.finalDebt=133000000, endYear=2005",
    "player_impact": "Any player who discovers loans becomes unkillable for decades; with ECON-001 it is also the only way to play past 1934 — the economy is exploit-or-die",
    "suggested_direction": "Fix the name at both call sites; move loan processing into the unified tick; add default/consequence mechanics",
    "confidence": "high"
  },
  {
    "id": "ECON-005",
    "workstream": "economy",
    "severity": "S1",
    "title": "Sell-rights is a deterministic 40% loss and wide/limited releases can't cover overhead — no cash-positive line of play exists",
    "evidence": "sell_rights pays exactly 0.6 x budget every time (ledger: 48000→28800, 85000→51000, 70000→42000; js/systems/production.js calculateProjectedEarnings/:932); wide-release aggregate ROI across 25 honest runs: 0.73-1.33 including marketing",
    "repro": "npm run sim -- --strategy exploit --seed 1 (ledger shows flat 0.6); matrix ROI column",
    "player_impact": "Every option loses money in expectation once burn is included; player decisions are choosing how fast to die",
    "suggested_direction": "Retune return curves so quality/genre/timing skill pushes expected ROI meaningfully above break-even (Phase 3, sim-gated)",
    "confidence": "high"
  },
  {
    "id": "ECON-006",
    "workstream": "economy",
    "severity": "S1",
    "title": "No production capacity limit: soundStages is never checked at greenlight",
    "evidence": "js/systems/production.js:53-140 startProduction has no capacity check; js/data/scripts.js:2863 greenlightScript checks cash only. Sim ran 8 simultaneous productions on 1 sound stage (exploit strategy, 344 films by 1948 in patched mode)",
    "repro": "npm run sim -- --strategy exploit --seed 3 --fidelity patched",
    "player_impact": "Sound stages (a purchasable progression axis) are economically meaningless; parallel-spam is optimal once cash exists",
    "suggested_direction": "Gate concurrent productions on soundStages; make stage expansion a real decision",
    "confidence": "high"
  },
  {
    "id": "ECON-007",
    "workstream": "economy",
    "severity": "S1",
    "title": "Marketing and distribution costs are hardcoded 1933 dollars for all 77 years",
    "evidence": "js/systems/production.js:716-731 — wide release always $25,000, limited always $8,000, theater counts fixed at 500/100, while monthly burn scales with era (js/core/game-state.js:322-327 getEraScalingForYear)",
    "repro": "code inspection; any late-era release in a patched sim run",
    "player_impact": "Era scaling is one-sided: costs inflate, distribution doesn't — late-game numbers stop meaning anything",
    "suggested_direction": "Apply era scaling to all money constants via one utility",
    "confidence": "high"
  },
  {
    "id": "ECON-008",
    "workstream": "economy",
    "severity": "S2",
    "title": "Bankruptcy is instant death at cash < 0 with no warning arc or recovery play",
    "evidence": "js/core/game-state.js checkGameEndConditions: gameState.cash < 0 → endGame('bankruptcy') on the same tick; full film budget is deducted up front at greenlight (production.js:126), so one greenlight can end the game instantly",
    "repro": "npm run sim -- --strategy random --seed 1 (bankrupt 1933)",
    "player_impact": "No tension curve — solvency flips to game-over between two clicks; no debt/receivership/fire-sale mechanics",
    "suggested_direction": "Grace period + forced-liquidation mechanics; warning arc already half-exists (runway warnings) but has no teeth",
    "confidence": "high"
  },
  {
    "id": "ECON-009",
    "workstream": "economy",
    "severity": "S1",
    "title": "Distribution decision flows through a single window._distributionFilm global — concurrent completions clobber each other",
    "evidence": "js/systems/production.js:695-700 stores window._distributionFilm/_distributionGameState; chooseDistribution (:703-706) silently no-ops if the stored film's id mismatches. Two films completing before the player answers the first modal orphan the earlier film with no revenue path",
    "repro": "greenlight two films 1 week apart with matching durations; complete both; only the last is distributable",
    "player_impact": "A finished film (its full budget already spent) can become permanently unreleasable",
    "suggested_direction": "Look films up by id from state at choice time; queue distribution decisions",
    "confidence": "high"
  },
  {
    "id": "ECON-010",
    "workstream": "economy",
    "severity": "S2",
    "title": "Era differentiation is untestable until the economy is survivable — flagged for post-Phase-3 re-audit",
    "evidence": "No honest strategy reaches 1941 (WWII), 1948 (Decree), or the TV era in 50 runs; the sim's era-meta comparison never gets data",
    "repro": "matrix results",
    "player_impact": "The game's core differentiator (history changes the rules) cannot currently be experienced",
    "suggested_direction": "Re-run the era-meta analysis as the Phase 3 exit gate",
    "confidence": "high"
  }
]
```

## Notes and cross-references

- The `getAllFilms` ReferenceError that kills `DashboardUI.init` (seen in every sim run's error log; `js/ui/dashboard.js:207,958` call a function private to `js/systems/boxoffice.js:182`) is a UI-side S0 counted under the UX/CODE workstreams.
- `GameController` (`js/core/game-controller.js`) is a complete rewritten game loop with **zero call sites** — the intended unification of ECON-003 that never shipped. See CODE workstream.
- Harness limitations (documented in `tests/sim/README.md`): timers are no-ops, so anything the game only does through `setTimeout` never happens in the sim; jsdom lacks real audio/media. Strategy play is scripted, not human — a human may find lines the strategies miss, but the arithmetic in "Why every run dies" bounds how much that could matter.

## Not covered

- Save-scumming value (re-roll variance quantification) — meaningless while all outcomes converge on bankruptcy.
- Inflation/number-scaling verification at 2000s scale — unreachable honestly; re-run post-Phase-3.
- Talent contract economics and studio-lot upgrades as sinks — strategies never had spare cash to exercise them.
