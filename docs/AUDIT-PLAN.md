# MOGUL — Rigorous Quality Audit Plan

**Purpose:** Produce an evidence-based, scored assessment of the game as it exists today, sufficient to (a) decide exactly what must change to sell this game for $20, and (b) feed the build plan (`docs/BUILD-PLAN-3.0.md`) with a verified backlog instead of guesses.

**This document is executable.** Each workstream below is written as a self-contained prompt that can be handed to an auditor (human or agent). Run workstreams in parallel; they share one output schema and one severity scale so findings merge into a single ranked backlog.

---

## 0. Ground rules for every auditor

1. **Evidence or it didn't happen.** Every finding must cite `file:line`, a reproducible play sequence, or simulation output. "The economy feels off" is not a finding; "cash goes infinite by 1941 in 8/10 simulated runs because ancillary revenue (`js/systems/boxoffice.js:738`) compounds without a cost sink" is.
2. **Play it before judging it.** UX/design workstreams must actually open `index.html` and play (or drive it with Playwright — Chromium is available). Code workstreams must actually run the code, not just read it.
3. **The bar is a paid product.** The reference class is commercial indie tycoon/management games sold at $10–25: *Game Dev Tycoon*, *Mad Games Tycoon 2*, *The Movies*, *Hollywood Animal* (2025). Judge against what a buyer at $20 expects: no crashes, no dead ends, legible UI, a tuned difficulty curve, real audio, and enough content that two playthroughs don't repeat.
4. **Do not fix anything during the audit.** Findings only. Fixes belong to the build plan.
5. **Known context (verified 2026-07):** 41k lines of vanilla JS in 53 files loaded via 44 `<script>` tags; all modules are `window.*` IIFEs; 197 Jest tests in 3 suites (core state, save/load, some systems); timeline extended to 1933–2010 while README/CLAUDE.md still say 1933–1949; `audio/music` and `audio/sfx` contain only READMEs (no sound assets); `js/systems/unused/` holds ~5k lines of dead code; 50 `console.*` calls in shipping code.

### Severity scale (shared)

| Severity | Definition |
|---|---|
| **S0 — Ship-blocker** | Crash, data loss, soft-lock, unwinnable-by-bug state, save corruption, or "this is obviously unfinished" (e.g., silent audio system with volume sliders). Refund territory. |
| **S1 — Sale-blocker** | No crash, but a $20 buyer would feel cheated: exploitable economy, dominant strategy that trivializes the game, illegible core UI, tutorial that lies, content that runs out. |
| **S2 — Quality gap** | Noticeably below the reference class: flat feedback, missing juice, thin era content, awkward flows, ugly states. |
| **S3 — Polish** | Nice-to-have improvements. |

### Finding schema (shared)

Every finding is one JSON object; workstreams emit an array.

```json
{
  "id": "ECON-004",
  "workstream": "economy",
  "severity": "S1",
  "title": "Prestige pictures strictly dominate B-movies after 1938",
  "evidence": "sim run seed=7: ROI table attached; js/systems/boxoffice.js:211 quality multiplier is unbounded",
  "repro": "Load save X / run `npm run sim -- --seed 7 --strategy prestige`",
  "player_impact": "One viable strategy; replayability collapses",
  "suggested_direction": "Cap quality multiplier; add prestige-flop risk",
  "confidence": "high"
}
```

---

## 1. Workstream: Automated economy & balance simulation (`ECON`)

**The single highest-value audit.** The game's systems are pure JS behind `window.*`; the Jest/jsdom setup (`tests/setup.js`) already loads them headlessly. Build a throwaway simulation harness (it may live in `tests/sim/`; it is audit tooling, not product code) that:

1. Boots game state via `js/core/game-state.js` under jsdom.
2. Plays scripted strategies month-by-month from 1933→2010: **conservative** (cheap films, safe genres), **prestige** (big budgets, awards bait), **exploit-seeking** (whatever maximizes ROI per the code, e.g., spam shorts, abuse ancillary revenue, loan cycling), **do-nothing** (does the game ever actually kill you?), and **random**.
3. Logs per-month: cash, debt, film ROI, talent costs, star power, rival market share.
4. Runs ≥10 seeds per strategy.

**Questions to answer with data:**
- Time-to-unbeatable: in what year does cash stop being a constraint, per strategy? (Target for a good game: never, or very late.)
- Bankruptcy realism: can a reasonable-but-unlucky player actually lose? Can a bad player survive by doing nothing?
- Dominant strategy detection: does any single genre/budget/release pattern beat all others by >2x ROI consistently?
- Era relevance: do WWII (1941–45), the Paramount Decree (1948), TV competition (1950s+), the studio-system collapse, New Hollywood, and the blockbuster era *actually change optimal play*, or are they flavor text? Diff optimal strategies across eras.
- Number scaling: are 1933 dollars vs 2010 dollars handled (inflation), or does the endgame show absurd/flat numbers?
- Degenerate loops: loan → produce → default cycles; save-scumming value (how much does re-rolling a release week matter?).

**Deliverables:** finding array + the ROI/cash-curve tables + the harness itself (kept — it becomes the balance regression suite in the build plan).

## 2. Workstream: Full-playthrough playtest protocol (`PLAY`)

Manual (or Playwright-driven) play sessions with a structured log. Minimum protocol:

- **Session A — blind new player:** follow only the in-game tutorial (`js/ui/tutorial.js`). Log every moment of confusion, every UI element that lies or is stale, every unexplained mechanic. Note the minute count until the player makes their first *informed* decision.
- **Session B — full campaign:** 1933→2010 (or until failure) at normal pace. Log pacing dead zones (months where the only action is clicking "next"), event fatigue (repeated event text), modal spam, and whether the late game (1970–2010) has as much to do as the early game.
- **Session C — hostile player:** try to break it. Spam clicks during transitions, open every modal during every phase, save/load mid-production, keyboard shortcuts (`js/ui/keyboard-shortcuts.js`) during modals, resize to phone width, refresh mid-month-tick. Log every error in console (any uncaught exception = S0).
- **Session D — scenario & achievement sweep:** start every scenario (`js/systems/scenarios.js`), verify win/lose conditions actually fire; verify a sample of achievements (`js/systems/achievements.js`) unlock when earned and persist across saves.

Score each session against the **First Hour Test**: within 60 minutes, does the player understand the loop, feel one meaningful win, one meaningful setback, and want to continue? That's the $20 bar.

## 3. Workstream: Game design & systems depth (`DESIGN`)

Read the systems as a designer, then verify in play:

- **Core loop legibility:** script → greenlight → production → release → box office. Are the levers (budget, cast, genre, timing, distribution) *felt*? Can the player predict outcomes well enough to make plans, but not so well it's a spreadsheet?
- **Decision density:** count real decisions per game-year in each era. Flag eras that are autopilot.
- **Interlock check:** do talent (`talent-management.js`), censorship (`censorship.js`), crises (`crisis.js`), rivals (`rival-studios.js`), technology (`technology.js`), TV (`tv-competition.js`), franchises (`franchise.js`), and studio lot (`studio-lot.js`) feed back into the core loop, or are they parallel mini-games? Map each system's inputs/outputs; orphan systems are S1 findings.
- **Failure design:** what does losing look like? Is there tension before it, and a fair warning?
- **Replay differentiation:** what actually differs run-to-run? Scripts pool size (`js/data/scripts.js`), talent pool (`js/data/talent-roster.js`), event variety (`js/data/historical-events.js`, `js/systems/events.js`) — measure content counts per era and repeat-rates over a full campaign.

## 4. Workstream: Historical authenticity (`HIST`)

The game's stated differentiator. Audit `js/data/historical-events.js` (3.9k lines), `talent-roster.js`, `scripts.js`, and era logic:

- Fact-check a sample of ≥50 events/dates/people across eras (names, years, studio affiliations, Hays Code specifics, HUAC, Paramount Decree terms, ratings-system dates: 1968 MPAA, 1984 PG-13).
- Tone check: are sensitive topics (blacklist, race in classic Hollywood, scandals) handled with intent rather than accidentally?
- **Mechanics-history integration:** for each marquee event, does it have a mechanical consequence or only a modal? List every event that is pure text.
- Identity check: README/CLAUDE.md say 1933–1949; the game runs to 2010. Decide-later material — but document exactly how thin each post-1949 decade is (events, scripts, talent per decade) so the build plan can choose *deep 1933–1969* vs *complete 1933–2010* with real numbers.

## 5. Workstream: UX, UI & presentation (`UX`)

- **Screenshot audit:** capture every screen/modal state (Playwright). Flag: unstyled states, overflow, truncation, placeholder text, inconsistent typography vs the design tokens (`css/design-tokens.css`), spacing drift across the 15 CSS files.
- **Information hierarchy:** can the player answer "how am I doing?", "what needs my attention?", "what happens next?" from the dashboard in <5 seconds each?
- **Feedback & juice inventory:** for the 10 most common actions (greenlight, cast, advance month, release, etc.), rate feedback: instant acknowledgment, number transitions, sound hook, animation. Silent state changes are S2.
- **Responsiveness:** the CSS ships `responsive.css` — verify at 1280×800, 1440×900, and 1920×1080 minimum; document the supported floor.
- **Accessibility floor:** keyboard-only playability, focus states, contrast on the art-deco palette, `prefers-reduced-motion`. (A $20 game gets reviews; "unplayable without a mouse" shows up in them.)

## 6. Workstream: Audio (`AUDIO`)

`js/systems/audio.js` (735 lines) + `audio-integration.js` exist; `audio/music` and `audio/sfx` contain only READMEs.

- Determine what actually plays today (WebAudio synthesis? nothing?). If the header has volume sliders for silence, that's an automatic S0 ("obviously unfinished").
- Inventory every hook the code expects (era music tracks, SFX events) → this becomes the asset shopping list for the build plan.
- Verify the era-music switching logic against the timeline.

## 7. Workstream: Code health, architecture & performance (`CODE`)

- **Load architecture:** 44 ordered `<script>` tags, `window.*` globals, implicit init order (`js/core/integration.js`). Document the dependency graph and every place load order is load-bearing. Assess against the build plan's likely move to ES modules + a minimal bundle step.
- **State integrity:** one mutable global state (`js/core/game-state.js`, 940 lines). Find every writer outside the sanctioned API; find state that isn't serialized by `save-load.js` (v2.0) but should be.
- **Save/load stress:** round-trip a late-game save with every system active; version-migration paths; corrupted-save handling; localStorage quota behavior (a 77-year campaign's save size?).
- **Memory/perf:** play 20+ game-years with DevTools: listener leaks (a leak fix landed in Phase 6 — verify it held), detached DOM from modals (`js/ui/modals.js`), long-task time on month-advance, timeline render cost (`js/ui/timeline.js`) late-game.
- **Dead code & hygiene:** `js/systems/unused/` (5k lines), the 50 `console.*` calls, the 1 TODO, duplicated dashboard add-on files (`dashboard-talent-addon.js`, `dashboard-rival-extensions.js`, `dashboard-visuals.js` vs `dashboard.js`).
- **Error posture:** global error handler? What does the player see on an exception mid-month-tick?

## 8. Workstream: Test coverage & regression safety (`TEST`)

- Run `npm test:coverage`; produce per-file coverage. Expected finding: box office, financial, production, censorship, awards, rivals, events near 0%.
- Rank untested modules by (money-touching × line count × churn). The top 10 become mandatory test targets in the build plan.
- Assess testability: which systems can't be tested without DOM entanglement? Those are refactor targets.

## 9. Workstream: Commercial readiness (`SHIP`)

- **Packaging path:** browser page → sellable product. Evaluate: Electron/Tauri desktop build, itch.io/Steam requirements (Steam needs achievements/cloud-save/overlay considerations), or web-with-license-key. Document what each demands from the codebase.
- **First-five-minutes:** title screen, new game flow, studio naming (input sanitization per `.claude/rules/security.md`), settings, quit/continue. Compare against three reference games.
- **Trust surface:** Google Fonts is loaded from CDN (`index.html:27`) — violates the "no external requests" rule and breaks offline; flag anything else phoning home.
- **Legal exposure:** real historical figures in `talent-roster.js` — using real dead celebrities' names/likenesses in a *commercial* game has right-of-publicity implications that vary by state (California: 70 years post-death). Inventory who's real vs fictional; this materially affects the build plan.
- **Meta:** save-slot UX, pause, speed controls, options persistence, uninstall/reset.

---

## 10. Synthesis & scoring

After all workstreams report:

1. **Merge** findings; dedupe; re-rank by severity then player impact.
2. **Scorecard** — rate 1–10 against the $20 reference class, with one paragraph of justification each: Core loop • Depth/replayability • Balance/economy • Content volume • Historical authenticity • UI/UX • Audio/visual polish • Stability • Onboarding • Commercial readiness.
3. **The 10x thesis:** identify the 3–5 changes with the highest (player-value ÷ effort) — the ones that make the game *feel* 10x, not just cleaner.
4. **Cutline:** every S0/S1 is a mandatory build-plan item. S2s are triaged into the plan; S3s go to a post-launch list.

**Final artifact:** `docs/AUDIT-REPORT.md` — scorecard, ranked findings (full JSON array in an appendix), the 10x thesis, and the confirmed simulation harness checked into `tests/sim/`.

## Execution notes

- Suggested parallelization: ECON and CODE first (they produce the harness and dependency map others reuse), then PLAY/DESIGN/UX/HIST/AUDIO in parallel, then TEST/SHIP, then synthesis.
- Every workstream has a hard rule: **if you ran out of time, say what you did not cover.** Silent partial coverage invalidates the audit.
