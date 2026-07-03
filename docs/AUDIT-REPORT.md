# MOGUL — Audit Report (Phase 0)

**Executed per `docs/AUDIT-PLAN.md`, 2026-07-02.** Seven workstreams, 93 findings (16 S0, 33 S1, 31 S2, 13 S3 before dedup). Full evidence, repro steps, and JSON finding arrays live in the per-workstream reports under `docs/audit/`: `ECON.md`, `DESIGN.md`, `CODE.md`, `HIST.md`, `UX-SHIP.md`, `AUDIO.md`, `TEST.md`. The economy-simulation harness built for this audit is permanent tooling at `tests/sim/` (`npm run sim`).

## Verdict

**The game as shipped is unwinnable and partially non-functional — but the bones of a genuinely good game are all here.** Every one of 50 simulated campaigns ends in bankruptcy; a browser playtest confirmed a film can *never be released through the UI* (the only render path that offers a distribute button crashes at init), the money HUD freezes at boot values forever, and the primary "advance month" button silently skips all film production. At the same time: the content research is real (116 historical events, 284 script templates, a 174-person roster), the art-deco design system exists, the save system is *above* the $20 reference class, and an estimated ~7,000 lines of already-written systems (GameController, rivals, TV competition, crisis, casting effects) are dead code waiting to be wired in. This is not a rewrite; it is a repair-and-tune of a game that was assembled but never made to run end to end.

The distance to "sellable at $20" is therefore mostly **integration, balance, and presentation** — exactly Phases 1–5 of `docs/BUILD-PLAN-3.0.md` — not new design.

## Scorecard (vs. the $20 reference class: Game Dev Tycoon, Mad Games Tycoon 2, Hollywood Animal)

| Dimension | Score | Basis |
|---|---|---|
| Core loop | **2/10** | The script→greenlight→produce→release→box-office shape is sound on paper, but release is unreachable through the UI (UX-001/CODE-003), the working greenlight path bypasses censorship (CODE-005), and the HUD lies (UX-004). |
| Balance / economy | **1/10** | 50/50 sim bankruptcies; honest play dies 1933–34; $900k box-office cap vs $250M era budgets (DESIGN-002); overhead billed ~1.9× (ECON-002); loans unreachable *and* free (DESIGN-003/004, ECON-004). |
| Depth / interlock | **3/10** | 12 systems exist; 2 fully integrated, 4 partial, 6 cosmetic/orphaned (DESIGN interlock map). ~80% of player choices write to fields nothing reads (DESIGN-007). Casting — the fantasy of a Hollywood game — is not a player action (DESIGN-008). |
| Content volume | **3/10** | Strong 1933–49 (119 events+scripts weighted there); cliff after: 13 scripts for the entire 1950s, talent hard-stops at `availableTo: 1949`, 5–9 events/decade post-1950 (HIST-002). |
| Historical authenticity | **4/10** | Research is genuine and tone mostly intentional, but 97% of event effect payloads are silently dropped (HIST-001), the Paramount Decree does nothing (HIST-003), Pre-Code isn't pre-Code (HIST-008), ~20 dated fact errors (HIST-005). |
| UI / UX | **3/10** | Real design-token system, but 6/15 CSS files ignore it (546 hardcoded colors), primary controls sit at the bottom of a 2,700px scroll (UX-007), and onboarding opens the tutorial on top of the scenario picker (UX-006). |
| Audio / feel | **1/10** | Shipped mute button + three volume sliders over total silence; 36 missing files; even procedural SFX can't play (AudioContext never resumed). Engine itself ~90% built (AUDIO.md). |
| Stability | **2/10** | Three always-crash APIs on player paths, uncaught TypeError during the tutorial, every load path throws (UX-005), no global error handler, zero try/catch in the tick pipeline (CODE-010). |
| Onboarding / first hour | **2/10** | No title screen, no Continue, no studio naming, no settings (SHIP-002); 3-second fake loading screen; tutorial references sounds that crash it. |
| Commercial readiness | **3/10** | Desktop wrap (Tauri) verified feasible; save system above class; but Google Fonts CDN is a privacy/offline violation (SHIP-001), and **all 174 roster names are real people, ~25 living, with scandal odds attached** — a right-of-publicity exposure that must be resolved before any sale (HIST-007). |

**Overall: ~2.5/10 today. The gap is concentrated, not diffuse — see the 10x thesis.**

## The S0 cutline (deduplicated) — nothing ships while any of these stand

1. **Unify the game loop.** Week and month advancement run disjoint economies (weekly: no new scripts/events/Oscars ever; monthly: production and box office frozen), and weekly play double-bills monthly overhead ~1.9× (21 charges in 48 weeks). `EventBus.clear()` at new-game wipes every init-time subscription — loan interest, newspaper, scenario victory checks, ironman saves, era display are all dead in real play. The never-invoked `GameController` already sketches the fix. *(ECON-002/003, CODE-001/002/006, DESIGN-005/006, UX-002)*
2. **Fix the crash quartet.** `dashboard.js:207` (`getAllFilms` ReferenceError — kills the dashboard and the only distribute button, making the game unwinnable through the UI), `boxoffice.js:455+` (`TimeSystem.getCurrentDate` doesn't exist — modern release path 100% crash), `production.js:983` (`getScriptById` not exported — exported greenlight path always throws; the surviving path bypasses censorship), `tutorial.js:938` (`AudioSystem.playSound` — uncaught TypeError during onboarding). *(CODE-003/004/005, UX-001/003/004, DESIGN-001, AUDIO-002)*
3. **Make the economy winnable — then dangerous.** Era-scale the $900k box-office clamp; single-bill overhead; make loans reachable *and* repayable; retune sell-rights (currently a deterministic 40% loss) and release ROI so skilled play is cash-positive and passivity is not. Verified by the sim thresholds in BUILD-PLAN §1 as the exit gate. *(ECON-001/004/005, DESIGN-002/003/004)*
4. **Audio: assets in, or controls out.** The header ships volume sliders over silence. Phase 5 puts real era music + SFX into the ~90%-built engine (with the missing `AudioContext.resume()`); until then the audio UI must not ship. *(AUDIO-001/003, SHIP-003, UX-003)*

## Priority S1 backlog (summary — full lists in workstream files)

- Save/load: ~40 live fields dropped (loans erased on reload — an exploit; events re-fire), `Object.assign` contamination, 4MB/slot localStorage footprint, every load path throws in-session. *(CODE-007/008/009, UX-005, TEST-003)*
- History has no teeth: one dispatcher (`applyEventEffects`, handles 10 of 100+ effect keys) is why 97% of events are decorative; era gating reads a field that never exists (`gameState.year`), so WWII events fire in 1995. Paramount Decree, blacklist, HUAC consequences all inert. *(HIST-001/003/004/006/009, DESIGN-007)*
- Orphan systems: rivals initialized against a discarded state object and never updated; TV competition never touches a live number; franchise/Oscar/MPAA reward multipliers set but never consumed; studio lot benefits never read; no production capacity limit (sound stages meaningless). *(CODE-011, DESIGN-010/011/012/013/018, ECON-006)*
- Commercial/legal: fictionalize or license the talent roster (174/174 real, ~25 living, scandal mechanics attached — BUILD-PLAN D2 is now urgent and confirmed); self-host fonts; build the first-five-minutes shell. *(HIST-007, SHIP-001/002)*
- Test safety net: 9.69% statement coverage, every money-touching system at 0%, coverage script fails its own thresholds. *(TEST-001/002/003)*

S2/S3 items (31+13) are triaged into build-plan phases in the workstream files; none block Phase 1.

## The 10x thesis — five changes carry most of the distance

Ranked by player-value ÷ effort:

1. **One tick pipeline** (finish and wire `GameController`): a wiring change that simultaneously fixes double-billed overhead, script starvation, frozen productions, dead loans, silent rivals/TV/era transitions, and unwinnable scenarios. Largest single unlock in the codebase; most of the code already exists.
2. **Fix the crash quartet + frozen HUD**: days of work; converts "broken demo" into "playable game." Includes unifying the two distribution paths so era scaling, MPAA, franchise, and star modifiers actually reach the box office.
3. **Sim-gated rebalance** (BUILD-PLAN Phase 3): the harness and thresholds already exist; tune until conservative/prestige/exploit/nothing produce the intended survival curve — this is what makes it a *game* rather than a countdown.
4. **One dispatcher fix to give history teeth**: extending `applyEventEffects` to handle the ~100 already-authored effect keys activates content that is already written and researched — near-zero content cost, transforms the differentiator.
5. **Audio assets + first five minutes**: the two loudest "unfinished" signals a buyer hits; engine and save infrastructure are already above class, so this is asset sourcing plus a title/settings shell.

## Decisions now resolved by evidence (BUILD-PLAN §2)

- **D1 (era scope):** the density cliff is measured (13 scripts for the 1950s; talent expires 1949). Recommendation sharpened: ship **deep 1933–1949 first** (a complete arc, where all content depth already lives), with 1950–69 as the stretch goal inside 3.0 and post-1969 as expansion material.
- **D2 (real names):** no longer optional — 174/174 real people, ~25 living, with scandal odds and quirks attached. Fictionalize the roster (keep real institutions/events as public record) or obtain a legal opinion before any commercial release.
- **D3/D4 (platform/tech):** desktop wrap verified feasible from `file://` today; ES-module + Vite conversion unblocked, with the CODE dependency map as the guide. ~7,000 lines of dead code to delete or resurrect deliberately.

## Re-audit obligations

- Era-meta differentiation (does 1943 play differently from 1935?) was **unanswerable** — no honest run survives to 1941. Re-run `npm run sim -- --matrix` as the Phase 3 exit gate (ECON-010).
- Fact-check errata list (HIST-005) applies at Phase 4 content pass.
- The blind first-hour test (PLAY sessions A–D with humans) remains outstanding; the hostile-player protocol was run headlessly and via Playwright, but real-user onboarding data waits for Phase 5's rebuilt first hour.

## Coverage statement

Every workstream reported what it did not cover (see each file's "Not covered" section). Known gaps: no Firefox/Safari verification, no human playtesting, git-churn weighting skipped in TEST, per-year genre-heat plausibility unverified, and the sim's strategies bound but do not exhaust human play.
