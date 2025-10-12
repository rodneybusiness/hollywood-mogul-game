# Hollywood Mogul Rapid Impact Plan

## Objective
Identify the most impactful improvements from the A++++ blueprint that can be delivered with minimal engineering risk and outline the concrete steps required to extend the simulation through the year 2010.

## Tier-1 Low-Effort, High-Impact Enhancements
| Initiative | Impact Rationale | Lift Estimate | Key Touchpoints | Risk Notes |
| --- | --- | --- | --- | --- |
| Seasonal Awards Loop | Adds a prestige chase that re-uses existing film quality, marketing, and `stats.oscarsWon` hooks without altering production logic. | 1 sprint | `systems/boxoffice`, `ui/awards-modal`, stats panel | Requires balancing award thresholds; otherwise isolated.
| Era-Savvy Script Variations | Makes scripts feel fresh each decade by extending the existing variation helpers (`createScriptVariation`, censor tuning) instead of rebuilding generation. | 1 sprint | `data/scripts.js`, `systems/censorship.js` | Needs curated tags per new era; safe because fallback behavior already exists.
| Command Center Dashboard Lite | Surfaces KPIs (cash, morale, productions) in one screen by repackaging existing store values; no new simulation. | 1 sprint | `ui/dashboard`, `core/state-store` | Mostly UI refactor; risk limited to layout regressions.

**Why these three?** They introduce new goals, fresh content, and better feedback without requiring new AI agents, save formats, or balance overhauls. Each leans on mature subsystems that already expose the necessary data, keeping code churn low.

## Timeline Extension to 2010
Extending the playable years demands synchronized updates across data, systems, and presentation layers.

1. **Calendar & Periods**
   - Expand `HISTORICAL_PERIODS` with decade blocks (50s, 60s, 70s, 80s, 90s, 2000s, 2010 pivot year) including MPAA rating switch (1968) and New Hollywood, Blockbuster, Home Video, Digital eras.
   - Update `getEraGenreModifiers` with decade-appropriate genre boosts and add new genres (e.g., sci-fi, action, thriller, superhero) plus fallback handling.
   - Wire seasonal/holiday modifiers for modern events (e.g., Memorial Day weekend, summer blockbuster window).

2. **Genre Heat & Audience Trends**
   - Extend `GENRE_HEAT` tables through 2010 with data-driven curves reflecting the new periods.
   - Introduce trend decay logic so heat automatically tapers when new decades begin, preventing runaway multipliers.

3. **Historical Events & System Flags**
   - Append milestone entries for the Paramount Decree, TV competition, VHS/DVD adoption, multiplex boom, internet disruption, and the 2008 recession.
   - Layer censorship system updates: shift from PCA to MPAA ratings with new flag handling and lighten restrictions over time.
   - Add technology unlock events (widescreen, CGI, digital projection) that toggle booleans already consumed by production modifiers.

4. **Talent & Script Content**
   - Expand the talent roster with post-1950 archetypes (method actors, action stars, auteurs) and align contract generation weights per era.
   - Add script tags for blockbuster franchises, indie dramas, animation renaissance, and tentpole budgets, leveraging existing rewrite cost hooks.
   - Seed new scandal hooks (tabloids, social media) that reuse the current crisis event pipeline.

5. **Financial & Market Adjustments**
   - Scale production budgets, marketing ceilings, and revenue caps each decade to reflect inflation and new distribution models.
   - Introduce international box office multipliers post-1980 and ancillary revenue streams (home video, streaming) as additive modifiers rather than new ledgers.

6. **UI & UX Updates**
   - Extend timeline widgets and tooltips to render beyond 1949, including decade separators and event callouts.
   - Update tutorials/codex entries to mention MPAA ratings, blockbuster era mechanics, and new awards categories.

7. **Balancing & QA**
   - Create automated regression scenarios that fast-forward to key years (1968, 1980, 1995, 2008) ensuring events and modifiers fire correctly.
   - Run manual playtests for each new decade with focus on cashflow pacing and script availability.

## Implementation Sequencing
1. **Foundations (Week 1)**
   - Update time system periods, genre heat defaults, and event scaffolding.
   - Add regression tests ensuring `TimeSystem` handles 2010 gracefully.

2. **Content Pass (Weeks 2-3)**
   - Populate historical events, talent roster expansions, and script tags per era.
   - Integrate MPAA rating adjustments into censorship checks.

3. **Feature Delivery (Weeks 4-5)**
   - Ship Seasonal Awards Loop, Script Variation refresh, and Dashboard Lite in parallel with UI polish.
   - Hook awards outcomes into talent morale and marketing bonuses.

4. **Balancing & Polish (Week 6)**
   - Tune financial scaling, finalize event probabilities, and update tutorials/codex.
   - Conduct smoke tests across 1933-2010 timeline and collect telemetry for further tuning.

## Success Criteria
- Players can advance uninterrupted from 1933 through 2010 with era-appropriate modifiers, events, and content.
- Seasonal awards, script variety, and dashboard improvements increase player retention without destabilizing core systems.
- Automated tests cover decade transitions, and manual QA validates at least one full-length campaign.
