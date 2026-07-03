# Economy Simulation Harness

The balance regression suite required by `docs/BUILD-PLAN-3.0.md` (Phase 0) and the
tooling behind the ECON audit workstream (`docs/audit/ECON.md`).

Boots the real game — `index.html`'s DOM and every `<script src="js/...">` in page
order — inside jsdom with a seeded `Math.random`, then plays scripted strategies
week-by-week and records the monthly financial curve.

## Usage

```bash
# one run, full detail
npm run sim -- --strategy prestige --seed 7 --monthly

# the matrix: all strategies × seeds, summary table + JSON dump
npm run sim -- --matrix --seeds 5 --fidelity browser --out docs/audit/sim-results-browser.json
```

Strategies live in `strategies.js`: `nothing`, `conservative`, `prestige`,
`exploit`, `random`.

## Fidelity modes

- `--fidelity browser` (default): reproduces the shipped boot sequence,
  including its bugs (EventBus subscriptions wiped by new-game, loan
  processing never called, weekly play never receiving monthly content).
- `--fidelity patched`: additionally runs the intended monthly pipeline
  (new scripts, historical events, Oscars, loan processing) on month
  boundaries, so the economy can be evaluated *as designed*. The diff
  between modes measures the cost of the plumbing bugs.

## Known limitations

- `setTimeout`/`setInterval` are no-ops inside the game window: the sim makes
  distribution choices directly instead of waiting on modal timers. Anything
  the game only does through a timer does not happen here.
- jsdom: no real audio, no layout. UI code that throws is recorded in
  `game.errors` rather than crashing the run.
- Strategies are scripted, not human. They bound the strategy space; they
  don't exhaust it.

## As a regression gate (build plan Phases 3+)

The Definition-of-Sellable thresholds from `docs/BUILD-PLAN-3.0.md`:
no strategy cash-unconstrained before the final decade, `nothing` loses,
no strategy beats the field by >1.5× ROI across seeds. Wire those as
assertions over `runOne()` summaries once Phase 3 tuning starts —
`smoke.test.js` currently only guards that the harness itself keeps working.
