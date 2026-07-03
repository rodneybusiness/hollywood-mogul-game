# Era Metas — 1933–1949 (ROADMAP P3.11)

What actually changes about optimal play per era in the tuned economy, as of
Phase 3. Mechanical drivers cited; Phase 4 ("history with teeth") deepens each
era with event-driven decisions on top of these economic currents.

## Pre-Code (1933 – mid-1934)
- **No Hays evaluation before July 1, 1934** (`constants.js HAYS_CODE_ENFORCEMENT_DATE`; the greenlight path routes through `CensorshipSystem.evaluateScript`, which returns `regulationType 'none'` before enforcement). Risqué, high-censor-risk scripts carry no compliance cost — the only window where they're free money.
- Genre heat favors crime/gangster pictures (`boxoffice.js GENRE_HEAT 1933-34`).
- Cash is tightest here: starting capital, one sound stage (2 concurrent productions), and receivership is 8 weeks — the opening two years kill passive and random play (balance gates).

## Golden Age (1935–1941)
- **The Code compliance tax arrives**: violations found at greenlight trigger PCA penalties on the film (quality/cost hits via `applyPCAPenalties`). Clean scripts (musicals, comedies, westerns) become relatively stronger — matching their genre-heat rise.
- Prestige economics open up: bigger era budget ranges + the production-values curve (`boxoffice.js`, sqrt of budget vs era reference) reward scaling up budgets, but wide-release marketing scales with era too.
- Sound-stage expansion is the capacity lever (2 films per stage).

## War Years (1942–1945)
- War-genre heat spikes to 1.3–1.6 (1941–44) then collapses to 0.3 by 1949 — the sharpest genre timing play in the campaign.
- Era scaling raises burn (×1.2) and budgets (×1.3): margins compress unless budgets follow the curve upward.
- Phase 4 adds: draft removing leading men, materials rationing on budgets, war-bond prestige decisions (HIST backlog).

## Post-War (1946–1949)
- Peak revenue years: inflation ×1.5 lifts the era-scaled box-office ceiling (the old fixed $900k clamp is gone — DESIGN-002) while noir/western heat runs hot.
- Costs are also at campaign peak (burn ×1.4, marketing ×1.5): the era rewards studios that built capacity and cash earlier — and punishes thin operations (conservative runs that die, die here).
- The campaign ends at Jan 1950 with the legacy epilogue (`computeLegacyScore`). Phase 4 adds HUAC and the Paramount Decree as event-driven earthquakes.

## Sim evidence (balance gates, seeds 1–5)
- Passivity dies in 1934; random play dies 1934–39.
- Cautious cheap-film play survives the 30s and dies (if it dies) 1939–1946 — the post-war cost squeeze is real.
- Prestige play survives 5/5 with min-cash dips under $150k (danger through the war years) and lands $6–13M.
- Mob-loan exploitation ends the campaign broke or nearly so, deep in favors, and is never the best line.

Re-run: `npm run sim -- --matrix --seeds 5` · gates: `npx jest tests/sim/balance-gates.test.js`.
