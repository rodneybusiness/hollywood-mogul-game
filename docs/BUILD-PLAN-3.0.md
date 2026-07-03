# MOGUL 3.0 — Build Plan: From Hobby Project to a $20 Game

**Input:** `docs/AUDIT-PLAN.md` findings (`docs/AUDIT-REPORT.md` once produced).
**Output:** a game a stranger pays $20 for, plays for 15+ hours, and recommends.

This plan is complete on its own — every phase has entry criteria, exit gates, and verification. Where the audit's numbers will refine scope, the decision point is marked **[AUDIT-GATED]** with the default choice stated, so execution never blocks on ambiguity.

---

## 1. Product definition

**The pitch:** the only studio-management game where *history is the antagonist*. You don't just balance budgets — you navigate the Hays Code, lose your stars to the draft, testify before HUAC, get broken up by the Paramount Decree, and watch television eat your audience. Every era rewrites the rules of optimal play.

**Reference class & price anchor:** Game Dev Tycoon ($9.99, ~35k reviews), Mad Games Tycoon 2 ($19.50), Hollywood Animal (2025, $24.99). At $20 we must match Mad Games Tycoon 2's depth-per-dollar or Hollywood Animal's presentation. Our edge is authenticity + the era-shift mechanic; our risk is presentation.

**Target player:** tycoon/management fans + classic-film enthusiasts. They forgive modest graphics; they do not forgive shallow economies, silent audio, or running out of content.

### The three 10x pillars

Everything in this plan serves one of these; anything serving none gets cut:

1. **A tuned, dangerous economy.** The player can always lose, dominant strategies don't exist, and every era genuinely changes what works. (Verified by simulation, not vibes.)
2. **History you can feel.** Marquee events have mechanical teeth, not just modals. The game *plays differently* in 1934, 1943, 1952, and 1968.
3. **Commercial-grade presentation.** Real music and SFX, juiced feedback on every action, a first hour that teaches itself, zero console errors, ever.

### Definition of Sellable (hard release gates)

No release while any of these fail:

- [ ] Zero S0 findings open; zero uncaught exceptions across the full hostile-player protocol (AUDIT-PLAN §2C).
- [ ] Simulation suite: no strategy reaches cash-unconstrained state before the final decade; do-nothing loses; no strategy beats field by >1.5x ROI across seeds.
- [ ] Blind first-hour test passes with 4 of 5 fresh players (understand loop, one win, one setback, want to continue).
- [ ] Full campaign playable start→end at every game speed with no dead-zone longer than 3 consecutive interaction-free game-months.
- [ ] Real audio: era-appropriate music for every era + SFX for the 12 core actions; mute/volume honored; nothing 404s.
- [ ] Save/load round-trips a maxed late-game state; v2.0 saves migrate or fail with a clear message (never silently corrupt).
- [ ] Ships fully offline (fonts self-hosted — removes the Google Fonts CDN dependency in `index.html`).
- [ ] Legal pass on real-person names in `js/data/talent-roster.js` complete and its decision implemented.
- [ ] Runs clean in Chrome, Firefox, Safari, Edge at 1280×800 and up.

---

## 2. Strategic decisions (decide in week 1)

**D1 — Scope of eras. [AUDIT-GATED]** Default: **cut back to a deep 1933–1969** (Pre-Code through the death of the studio system — a complete dramatic arc: rise, war, HUAC, Decree, TV, collapse). The 2.0 extension to 2010 tripled the timeline without tripling content; HIST workstream will quantify how thin 1970–2010 is. Shipping 36 dense years beats 77 sparse ones at $20. The 1970–2010 systems (franchise, technology tree) are kept where they map onto 1950s–60s equivalents; era data beyond 1969 is preserved on a branch as expansion/DLC material. Override only if the audit shows post-1969 content is closer to done than believed.

**D2 — Real names. Legal review before content work.** Right-of-publicity for deceased celebrities (California Civil Code §3344.1: 70 years post-death, heirs can claim) makes real-name talent risky in a commercial product. Default: **fictionalize the talent roster** with era-authentic archetypes ("Golden Age leading man, ex-vaudeville") while keeping *historical events and institutions* real (Hays Office, HUAC, studios-as-rivals renamed pastiche). This also frees design (scandals, deaths, feuds) from biography constraints. Historical figures may remain in event text as public-record references.

**D3 — Platform path.** Default: **itch.io first (web + downloadable desktop via Tauri), Steam second.** Tauri wraps the existing browser game with minimal change and small binaries. Steam release (with achievements/cloud saves mapped from the existing achievements + save systems) follows once itch feedback confirms the tuning.

**D4 — Tech modernization depth.** Default: **convert to ES modules + Vite build, keep vanilla JS (no framework).** Kills the 44-script-tag load order problem, enables tree-shaking out `js/systems/unused/`, gives minification and a dev server, and stays within the project's no-framework rule. `index.html` continues to work as the entry point via Vite.

---

## 3. Phases

Phases are sequential gates; work inside a phase parallelizes. Estimates assume one primary developer + AI agents; scale accordingly.

### Phase 0 — Audit & foundation (gate for everything)
*Run `docs/AUDIT-PLAN.md` to completion.*
- Produce `docs/AUDIT-REPORT.md` with scorecard and ranked findings.
- Land the simulation harness in `tests/sim/` and wire it into CI as the **balance regression suite** — from here on, every balance change must pass sim thresholds.
- Resolve D1–D4 with audit numbers.
- **Exit gate:** audit report exists; sim harness runs 10-seed × 5-strategy in CI; decisions D1–D4 recorded in this file.

### Phase 1 — Stabilize (kill every S0)
- Fix all crashes, soft-locks, save-corruption paths from the audit.
- Global error boundary: uncaught exception → in-fiction "studio fire" recovery screen offering save-and-reload, plus error detail for reports — never a silently broken UI.
- Delete `js/systems/unused/` (5k lines), strip the 50 `console.*` calls behind a debug flag, remove stale docs from the root of `docs/`.
- Save system: write v3 migration scaffolding now (every later phase changes state shape; migrations from day one, tested in `tests/`).
- **Exit gate:** hostile-player protocol (AUDIT-PLAN §2C) passes clean; `npm test` green; coverage on save/load paths ≥90%.

### Phase 2 — Re-architect (make the rest of the plan cheap)
- ES-module conversion, file by file, using the audit's dependency map; Vite build; delete script-tag ordering from `index.html`.
- Single sanctioned state API: all writes through `game-state.js` actions; EventBus (already exists, `js/core/event-bus.js`) becomes the only cross-system channel. Fix every rogue writer the CODE audit found.
- Consolidate the dashboard add-on files (`dashboard-talent-addon.js`, `dashboard-rival-extensions.js`, `dashboard-visuals.js`) into `dashboard.js` modules.
- Test the money paths: unit tests for `financial.js`, `boxoffice.js`, `production.js`, `awards.js`, `censorship.js` — the audit's top-10 untested list. Target: every function that adds or removes cash has a test.
- **Exit gate:** game runs identically pre/post conversion (sim outputs byte-comparable given same seed); coverage on money-touching modules ≥80%; no `window.*` cross-module reads outside a single compatibility shim.

### Phase 3 — The economy (pillar 1)
The deepest work. Driven entirely by ECON findings; run the sim after every change.
- **Close every exploit** the sim found (loan cycles, ancillary compounding, re-roll value).
- **Difficulty curve:** money must stay scarce. Introduce escalating sinks that are period-authentic — star contracts with raises, theater-chain upkeep (pre-1948), union agreements, technology adoption costs (sound→color→widescreen), marketing arms races with rivals.
- **Era rebalance:** each era gets a distinct "meta": Pre-Code freedom → Code compliance tax on certain genres; WWII → talent drafted, materials rationed, war-picture demand spike; 1948 Decree → forced theater divestiture (a real mid-game earthquake to studio income); TV era → attendance decline curve that must be answered with widescreen/spectacle/teen genres.
- **Risk texture:** flops must happen to good players sometimes (weather, scandal, competing releases), with enough foreshadowing to feel fair.
- **Difficulty settings:** three levels tuned via sim thresholds, not multipliers alone.
- **Exit gate:** Definition-of-Sellable sim gates pass; a written "era meta" doc describes optimal play per era and the sim confirms they differ.

### Phase 4 — History with teeth (pillar 2)
- Every marquee event in `js/data/historical-events.js` gets a mechanical consequence and, where meaningful, a *player decision* (HUAC: name names and keep your studio's standing but lose talent loyalty and future prestige, or refuse and eat a blacklist-era penalty with a long-tail reputation reward).
- **Censorship as gameplay:** pre-release Hays review with negotiation (cut scenes for a seal vs release "condemned" for niche box office and reputation risk) — the audit will show how much of `censorship.js` already supports this.
- Content density pass per D1 scope: every game-year has ≥N events, ≥N new scripts, ≥N talent debuts/retirements (N set from the audit's per-era density tables; default N=6/8/4 per year).
- Fact-check pass on all kept content; fictionalization pass per D2.
- **Exit gate:** zero pure-flavor marquee events; density targets met per era; HIST re-audit sample passes.

### Phase 5 — Presentation (pillar 3)
- **Audio (from zero):** license or commission era-authentic music (public-domain-recording strategy audited for actual PD status — pre-1923 compositions ≠ PD recordings; budget line for licensing) + full SFX set for the hooks `js/systems/audio.js` already defines. Wire, mix, test the era transitions.
- **Juice pass:** the UX audit's feedback inventory drives animated number transitions, box-office weekend "ticker" moments, premiere sequences, award-night ceremony screen, newspaper front pages (`newspaper.js` already generates them — make them a moment, not a modal).
- **UI coherence pass:** one typographic scale, consolidated CSS (15 files → tokens + components + screens), every screenshot-audit defect fixed; self-host fonts.
- **First hour:** rebuilt tutorial as a scripted first-year scenario (use the existing `scenarios.js` machinery) instead of tooltip tours; title screen, studio-founding sequence with meaningful starting choices.
- **Accessibility:** keyboard-complete play, focus states, reduced-motion, contrast fixes.
- **Exit gate:** blind first-hour test 4/5; audio gates pass; screenshot re-audit clean.

### Phase 6 — Content & replayability
- Scenario roster: 6–8 curated starts with distinct constraints and win conditions (e.g., "Poverty Row 1933," "Inherit a failing major, 1946," "Émigré director's studio, 1938").
- Endings: scored epilogue reels — what history says about your studio — plus a stats/legacy screen worth screenshotting.
- Achievement pass tied to era mastery, not grind.
- New-game variety: script pool shuffling, rival AI personalities (`rival-studios.js` extended), random-ish talent generation per D2.
- **Exit gate:** two consecutive full campaigns by the same tester produce meaningfully different event/script/talent experiences (measured repeat-rate < threshold from audit baseline).
- 
### Phase 7 — Ship
- Tauri desktop builds (Win/macOS/Linux) + web build; itch.io page with trailer/screens; price $19.99 with launch discount.
- Beta: 10–20 external players, structured feedback form mirroring the audit scorecard; one tuning cycle on their data.
- Final full-protocol regression (audit §2 sessions A–D, sim suite, browser matrix, save-migration matrix from real 2.0 saves).
- Post-launch scaffolding: crash-report copy button, version display, CHANGELOG, patch cadence plan. Steam prep (achievements mapping, cloud save via Steam Cloud file sync) begins after itch launch is stable.
- **Exit gate:** every Definition-of-Sellable box checked, dated, with evidence links.

---

## 4. Cross-cutting rules

- **The sim is law.** No balance-touching PR merges without sim suite passing. The harness from Phase 0 is a permanent fixture.
- **Small diffs, phase discipline** (per `.claude/rules/quality.md`): no Phase-5 polish inside Phase-3 PRs.
- **Docs stay honest:** CLAUDE.md/README updated the day D1 lands (the 1933–1949 vs 2010 drift is exactly how identity rot starts). Archived planning docs stay in `docs/archive/`; the only live plans are this file and the audit.
- **Playtest cadence:** one full-hour play session per week minimum during Phases 3–6, logged against the PLAY protocol. Numbers tune the economy; only play finds boredom.

## 5. Budget & risk

| Item | Est. |
|---|---|
| Music licensing/commission (8–12 era tracks) | $500–3,000 |
| SFX library | $50–200 |
| Legal consult (D2, right of publicity) | $500–1,500 |
| Beta distribution, itch fees, trailer | ~$300 + rev share |

**Top risks:** (1) economy retuning is underestimated — mitigated by sim-first workflow and doing it as Phase 3, not last; (2) real-names legal issue discovered late — mitigated by D2 in week 1; (3) scope creep back toward 2010 — mitigated by D1 being a recorded decision with expansion path; (4) audio is the visible-quality long pole — start sourcing during Phase 2, not Phase 5.

## 6. What "10x" means here, concretely

| Dimension | Today (verified) | 3.0 target |
|---|---|---|
| Losable/tension | Audit will quantify; suspected low | Sim-proven danger in every era |
| Strategy variety | Suspected 1–2 viable lines | ≥4 sim-distinct viable strategies, shifting per era |
| Historical mechanics | Many events are modals | 100% of marquee events have teeth; era metas differ |
| Audio | Code, no assets (silent sliders) | Full era-scored music + SFX |
| First hour | Tooltip tutorial | Scripted first-year, 4/5 blind-test pass |
| Stability | Unknown; 3 test suites / 41k LOC | Zero uncaught exceptions in hostile protocol; money paths ≥80% covered |
| Content density | Thin post-1949 decades | Uniform density floor across shipped eras |
| Packaging | "Open index.html" | itch.io web + desktop installers, offline, $19.99 |
