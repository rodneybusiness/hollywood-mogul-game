# HIST — Historical Authenticity Audit

Auditor workstream per `docs/AUDIT-PLAN.md` §4. All counts below were produced by loading the actual data modules under Node (`window` stub) and counting — not estimated. Line references are to the current working tree.

Files audited: `js/data/historical-events.js` (3,903 lines, 116 events), `js/data/talent-roster.js` (3,533 lines, 117 actors + 57 directors), `js/data/scripts.js` (2,960 lines, 284 script templates), `js/systems/events.js` (2,909 lines, 50 production events), `js/core/time-system.js`, `js/core/constants.js`, plus effect-consumers (`censorship.js`, `crisis.js`, `tv-competition.js`, `technology.js`, `financial.js`, `boxoffice.js`, `achievements.js`).

## Summary

- **The history is a painted backdrop, not a system.** `applyEventEffects` (`js/data/historical-events.js:3778-3826`) recognizes only 10 effect keys; the 100+ other keys used across the 116 events (`genre_boost`, `box_office_modifier`, `technology_available`, `revenue_stream`, `rating_available`, `talent_restriction`, …) are silently dropped. Only 3 events (Pearl Harbor, WWII ends, HUAC begins) change state that any other system ever reads. Era mechanics that do exist (MPAA ratings, TV decline, tech, ancillary revenue) run on parallel year-driven code and would work identically if every historical event were deleted.
- **Content falls off a cliff in 1950.** 71 of 116 events (61%) are 1933–1949; 102 of 174 talent entries expire at `availableTo: 1949`; the 1950s offer 17 actors, 8 directors, and ~13 script templates for a 10-year span. Post-1949 decades average 6–9 events vs 30–41 for the 30s/40s.
- **~20 verifiable date/fact errors** in the 1933–49 event data (SAG founded 1935 instead of 1933, King Kong premiering in November, Cannes "first" festival in 1947, the blacklist expanding four months *before* HUAC convenes, *Miracle on 34th Street* releasing at Christmas, Hollywood Ten jailed in 1949, etc.). Post-1950 events are markedly more accurate. Talent-roster Oscar/service data is very accurate (50+ claims verified, 1 quibble).
- **Legal red flag:** 174 of 174 named talent are real people — including living A-listers (De Niro, Streep, Hanks, Roberts, Pitt, DiCaprio, Nolan). ~91 of 284 script templates are verbatim real film titles ("Citizen Kane", "Casablanca"). Feeds SHIP §9 legal-exposure item.
- **Tone is mostly intentional and good** (HUAC choices carry moral weight, Japanese internment and Hattie McDaniel events are framed thoughtfully), but the HUAC decision has no long-term gameplay consequence — "Name Names" is mechanically the safest choice and even earns an achievement — and the blacklist never lifts (the 1960 Spartacus event's effect key is one of the dropped ones).

## Density tables

### Historical events (`js/data/historical-events.js`, 116 total)

| Decade | Events | major/critical | Notes |
|---|---|---|---|
| 1930s (1933–39) | 30 | 9 | 7 game-years |
| 1940s | 41 | 13 | densest decade |
| 1950s | 9 | 6 | |
| 1960s | 8 | 6 | |
| 1970s | 5 | 4 | thinnest decade |
| 1980s | 7 | 5 | |
| 1990s | 8 | 5 | |
| 2000s | 7 | 6 | |
| 2010 | 1 | 1 | `game_end` bookend |

Importance mix: 47 major, 11 critical, 8 moderate, 22 minor, 28 flavor. A player spends 61 game-years (1950–2010) with 45 events total (~0.7/year) vs 71 events in the first 17 years (~4.2/year).

### Scripts (`js/data/scripts.js`, 284 templates)

| Era category | Templates | Year span |
|---|---|---|
| preCode | 19 | 1933–34 |
| goldenAge | 55 | 1935–44 |
| warYears | 31 | 1940–45 |
| postWar | 25 | 1943–50 |
| bMovies | 18 | 1935–49 (usable all years) |
| tvThreat | 12 | 1952–59 |
| newWave | 22 | 1960–65 |
| ratingsEra | 12 | 1967–72 |
| newHollywood | 12 | 1973–79 |
| blockbusterAge | 12 | 1981–88 |
| indieBoom | 22 | 1991–96 |
| digitalDawn | 22 | 1997–2004 |
| convergence | 22 | 2006–10 |

By decade of template year: 1930s 58, 1940s 89, 1950s 13, 1960s 29, 1970s 17, 1980s 12, 1990s 30, 2000s 32, 2010 4. So 148/284 (52%) of templates serve 1933–49; the 1950s (10 years) have 13; the entire 1967–1988 span (22 years) has 36. `generateScriptForYear` (`scripts.js:2457-2529`) additionally filters to ±5 years post-1950, so the effective monthly pool in, e.g., 1985 is ~12 templates with randomized budgets/quality — repeat titles are guaranteed within a decade.

### Talent (`js/data/talent-roster.js`, 117 actors + 57 directors)

| Decade | Actors active | Directors active |
|---|---|---|
| 1930s | 51 | 25 |
| 1940s | 79 | 38 |
| 1950s | 17 | 8 |
| 1960s | 20 | 12 |
| 1970s | 22 | 14 |
| 1980s | 23 | 15 |
| 1990s | 24 | 16 |
| 2000s | 24 | 15 |

Debuts (`availableFrom`) by decade: 1930s 76, 1940s 42, 1950s 13, 1960s 10, 1970s 11, 1980s 9, 1990s 12, 2000s 1. **72 actors and 30 directors hard-stop at `availableTo: 1949`** — an artifact of the original 1933–1949 scope. Careers that actually continued for decades (Cary Grant to 1966, Kirk Douglas to the 1980s, Orson Welles and John Huston directing into the 1970s/80s) are cut off, which both breaks authenticity and creates the 1950s talent desert above.

## Fact-check results

Sample: all 116 historical events were read against known history; 50+ biographical claims in the talent roster (Oscar wins/years, death dates, war service) and ~30 script titles/years were verified. Representative table below — every found error is listed; correct entries are summarized.

### Verified correct (highlights, 40+ of ~60 sampled facts)

Prohibition repeal 12/1933 · PCA enforcement 7/1934 · Jean Harlow d. 6/1937 age 26 · Snow White 12/1937 · Anschluss 3/1938 · War of the Worlds 10/1938 · GWTW premiere 12/1939 · Hattie McDaniel Oscar 2/1940 · Selective Service 9/1940 · Citizen Kane 5/1941 · Pearl Harbor 12/1941 · EO 9066 2/1942 · Casablanca premiere 11/1942 · Betty Grable #1 1943 · D-Day 6/1944 · 1946 record box office ~$1.7B · HUAC hearings open 10/20/1947 (also correct in `time-system.js:280`) · Paramount decision 5/3/1948 · Korean War 6/1950 · HUAC second wave 3/1951 · The Moon Is Blue 1953 · The Robe/CinemaScope 9/1953 · James Dean d. 9/30/1955 age 24 · Psycho 6/1960 · Spartacus Trumbo credit 10/1960 · Virginia Woolf exemption 6/1966 · Gulf+Western/Paramount 1966 · MPAA G/M/R/X 11/1968 · Godfather 3/1972 · Nixon resigns 8/1974 · Jaws 6/1975 · Star Wars 5/1977 · Heaven's Gate 11/1980 ($44M/$3.5M) · PG-13 7/1984 · NC-17/Henry & June 9/1990 · T2 7/1991 · Jurassic Park 6/1993 · Toy Story 11/1995 · DVD 3/1997 · Titanic 12/1997 · 9/11 · LOTR 12/2001 · Netflix streaming 1/2007 · Avatar 12/2009. Talent: Gable (IHON 1934 Oscar, AAF service 1942–44), Stewart (Philadelphia Story 1940, bomber pilot 41–45), Davis (Dangerous/Jezebel), Hepburn (Morning Glory 1933), de Havilland (1946/1949), Bergman (Gaslight 1944), Bogart d. 1/1957, Lombard d. 1942, Garland d. 1969, Monroe d. 1962, Brando (1954/1972), Loren (Two Women, first foreign-language acting win), Nicholson (1975/1983/1997), Streep (1979/1982), Hanks (1993/1994), Curtiz (Casablanca), Wyler (1942/1946), Lean (1957/1962), Kazan (1947/1954), Spielberg (1993/1998), Coens (1996/2007). Draft-risk list (Gable, Stewart, Fonda, Power, G. Ford; Capra, J. Ford, Wyler, Huston, Stevens) is historically excellent.

### Errors found

| # | file:line | Claim in game | Reality |
|---|---|---|---|
| 1 | `js/data/historical-events.js:86` | Production Code "formally drafted" Aug 1933 | Code written 1929, adopted by MPPDA **March 31, 1930**; 1933 saw only enforcement pressure |
| 2 | `js/data/historical-events.js:115` | King Kong premieres **Nov 1933** | Premiered **March 2, 1933** (Radio City) |
| 3 | `js/data/historical-events.js:182` | Feb 1934: Shirley Temple, "at age 6", is Hollywood's biggest star | She was **5** in Feb 1934 and not yet a star (breakout April 1934; #1 box office 1935–38) |
| 4 | `js/data/historical-events.js:255` | Sept 1934: *It Happened One Night* "wins all five major Oscars" | Ceremony was **Feb 27, 1935** |
| 5 | `js/data/historical-events.js:287` | Legion of Decency formed **Nov 1934** | Formed **April 1934** (its pressure caused the July PCA — game has effect after cause) |
| 6 | `js/data/historical-events.js:323` | Astaire–Rogers partnership "begins" Mar 1935 | Began *Flying Down to Rio* (Dec **1933**), *The Gay Divorcee* (1934) |
| 7 | `js/data/historical-events.js:355` | Will Rogers dies **May 1935** | Died **Aug 15, 1935** (crash with Wiley Post) |
| 8 | `js/data/historical-events.js:387` | SAG founded **July 1935** | Founded **June 30, 1933** |
| 9 | `js/data/historical-events.js:457` | *Top Hat* event Dec 1935 | Released Aug/Sept 1935 (minor) |
| 10 | `js/data/historical-events.js:589` | *Modern Times* released **Nov 1936** | Released **Feb 5, 1936** |
| 11 | `js/data/historical-events.js:1045` | *Fantasia* released **Jan 1940** | Premiered **Nov 13, 1940** |
| 12 | `js/data/historical-events.js:1284` | Sept 1941: Cooper "wins Best Actor" for Sergeant York | Awarded **Feb 26, 1942** |
| 13 | `js/data/historical-events.js:1427` | May 1942: "White Christmas" tops charts | *Holiday Inn* opened Aug 1942; song hit #1 **Oct 1942** |
| 14 | `js/data/historical-events.js:1458` | Sept 1942: *Mrs. Miniver* "wins Best Picture" | Awarded **March 4, 1943** |
| 15 | `js/data/historical-events.js:1637` | Aug 1943: *Oklahoma!* opens on Broadway | Opened **March 31, 1943** |
| 16 | `js/data/historical-events.js:1797` | *Double Indemnity* released **Nov 1944** | Released **July 1944** |
| 17 | `js/data/historical-events.js:2093` | May 1947: "First Cannes Film Festival" launches | First festival ran **Sept–Oct 1946** |
| 18 | `js/data/historical-events.js:2126` | June 1947: "Blacklist Expands" — 4 months **before** `huac_begins` (Oct 1947, :2159) | Blacklist began with the **Waldorf Statement, Nov 25, 1947**, *after* the hearings. Chronology inverted |
| 19 | `js/data/historical-events.js:2208` | Dec 1947: *Miracle on 34th Street* releases at Christmas; "Wins Edmund Gwenn Best Supporting Actor" | Famously released **May/June 1947**; Gwenn's Oscar came March 1948 |
| 20 | `js/data/historical-events.js:2326` | Nov 1948: *Treasure of the Sierra Madre* | Released **January 1948** |
| 21 | `js/data/historical-events.js:2392` | March 1949: Hollywood Ten "begin prison sentences" | Convicted 1948; imprisoned **mid-1950** after appeals failed |
| 22 | `js/data/historical-events.js:3382` | Jan 1994: "*Pulp Fiction* proves indie films can break out" | Cannes May 1994, US release **Oct 1994** — event fires 9 months early |
| 23 | `js/core/time-system.js:261-267` | Technicolor "now available" June **1937** | Three-strip Technicolor features from **1935** (*Becky Sharp*); also contradicts `technology.js` (`yearAvailable: 1935`). Dead code — see HIST-010 |
| 24 | `js/data/scripts.js:421-423` | Script "It Happened One Night", year **1935** | The real film is **1934** — and it's a verbatim real title offered as the player's own production |
| 25 | `js/data/talent-roster.js:1310-1311` | Tony Curtis `availableFrom: 1949, availableTo: 1949` | One-year window; description promises "a long career ahead" that the data forbids (career ran into the 2000s) |
| 26 | `js/data/talent-roster.js:3005-3012` | Akira Kurosawa hireable as a Hollywood studio director 1950–1985 | Kurosawa never directed for a Hollywood studio (was famously removed from *Tora! Tora! Tora!*); active in Japan to 1993 |
| 27 | `js/data/talent-roster.js:1793` | Rock Hudson `availableTo: 1970` | Worked steadily to 1984 (d. 1985) |
| 28 | `js/data/talent-roster.js:1878` | Sidney Poitier `availableFrom: 1955` | Film debut *No Way Out* (1950) |
| 29 | `js/data/talent-roster.js:3114` | Coppola comment lists "Apocalypse Now (1979)" among Oscar wins | Coppola won no Oscar for *Apocalypse Now*; his Godfather (1972) win was screenplay, not director (minor, comment-only) |
| 30 | `js/data/talent-roster.js:119` (pattern ×102) | Cary Grant `availableTo: 1949` — likewise Welles (:2590), Huston (:2621), Kirk Douglas, Gregory Peck, etc. | Systematic truncation at 1949 for 72 actors + 30 directors whose careers continued for decades — the single largest authenticity defect for a 1933–2010 game |

Verdict: pre-1950 event *months* are unreliable (roughly 1 in 3 of the 1933–49 events has a wrong month or year, mostly Oscar ceremonies dated to release year and releases shifted to thematic months); the post-1950 batch (clearly a later addition) is accurate. Names, spellings, and dollar figures are otherwise solid.

## Text-only events (mechanics-vs-flavor)

**How effects flow:** `HistoricalEvents.checkForEvents` (game-state.js:361, game-controller.js:229) → `triggerEvent` → `applyEventEffects` (`historical-events.js:3778-3826`), which handles exactly these keys: `censorship_active`, `war_active`, `actor_draft_risk`, `huac_active`, `political_risk`, `blacklist_begins`, `vertical_integration_ends`, `box_office_uncertainty`, `audience_expectations`, `game_complete`. Of the flags it writes, only three are ever read elsewhere:

- `warActive` → removes 5 draft-risk actors + 5 directors 1942–45 (`talent-roster.js:3375,3400`) — **real mechanic**
- `blacklistActive` → removes directors with `huacRisk` (`talent-roster.js:3405`) — technically real, but only Dmytryk and Dassin carry the flag and both have `availableTo: 1949`, so it does almost nothing; the actor flag (Edward G. Robinson, `talent-roster.js:962`) is **never checked** in `getAvailableActors` (:3363-3383)
- `huacActive` → gates two HUAC crisis decisions (`crisis.js:361`) — **real mechanic**
- `censorshipActive` → read only in a fallback branch (`censorship.js:125`) that is unreachable while `GameConstants` exists; regulation type is purely year-derived (`constants.js:214-237`)

`politicalRisk`, `boxOfficeVariance`, `audienceExpectations`, `actorDraftRisk`, `verticalIntegration`, and `gameComplete` are **write-only** (grep: no reader in `js/`). Every other effect key in the file — including all structured post-1950 keys (`genre_boost`, `box_office_modifier`, `technology_available`, `revenue_stream`, `rating_available`, `censorship_modifier`, `talent_restriction`, `franchise_model`, `marketing_strategy`, `distribution_strategy`, `budget_risk_modifier`, `talent_cost_modifier`, `production_costs`, …) — matches nothing in `applyEventEffects` and is consumed by no other module (only `ui/help.js` mentions the words).

**So of 116 events, 3 have a real mechanical consequence** (pearl_harbor, wwii_ends, huac_begins). The 58 major/critical "marquee" events break down as:

Marquee events that are text-only AND whose promised effect exists nowhere else:
- `paramount_decree` (1948) + `paramount_decree_divestiture` (1950) — no divestiture: the player's theater chain (`financial.js:102-109`) keeps paying $25k/month forever; its `'antitrust_lawsuit'` risk string is never enforced
- `korean_war_begins` (1950) — dead `genre_boost`
- `huac_blacklist_expands` (1951) and `spartacus_breaks_blacklist` (1960) — `talent_restriction` true/false both dropped; **the blacklist never lifts** (and never bites, see above)
- `civil_rights_act` (1964), `conglomerate_era_begins` (1966) — `effects: {}` by design
- `cleopatra_disaster` (1963), `heavens_gate_disaster` (1980) — dead `budget_risk_modifier`
- `studio_system_collapses` (1958) — dead `talent_cost_modifier`
- `jaws_invents_blockbuster` (1975) — dead `distribution_strategy` (no wide-release model change in `boxoffice.js`)
- `batman_marketing_era` (1989), `blair_witch_viral_marketing` (1999) — dead `marketing_strategy`
- `indie_golden_age` (1994) — dead `distribution_strategy`
- `titanic_phenomenon` (1997) — dead `budget_ceiling_raised`
- `september_11_attacks` (2001) — dead `box_office_modifier`/`genre_boost` (no box-office dip occurs)
- `youtube_founded` (2005) — dead `audience_fragmentation`
- `easy_rider_new_hollywood` (1969), `godfather_phenomenon` (1972), `watergate_nixon_resigns` (1974), `et_breaks_records` (1982), `dark_knight_billion` (2008), `psycho_changes_horror` (1960) — dead `genre_boost`s
- `gone_with_wind` (1939) — `audience_expectations` write-only
- `record_box_office` (1946), `television_threat` (1948), `tv_competition_begins` (1950) — dead keys; TV decline is separately implemented year-driven in `tv-competition.js` (starts 1948, peaks late 50s), so the *mechanic* exists but the event is decoration
- `mpaa_rating_system` (1968), `pg13_rating_introduced` (1984), `nc17_replaces_x` (1990) — dead keys; ratings actually arrive via `censorship.js` `yearIntroduced` (1968/1984/1990) independent of the events
- `cinemascope_debut` (1953), `dolby_stereo_arrives` (1975), `tron_cgi_pioneer` (1982), `t2_cgi_breakthrough` (1991), `jurassic_park_cgi_revolution` (1993), `toy_story_all_cgi` (1995), `avatar_3d_revolution` (2009) — dead `technology_available`; techs actually unlock via `technology.js` `yearAvailable`
- `home_video_revolution` (1980), `home_video_surpasses_theatrical` (1986), `dvd_format_launches` (1997), `dvd_revenue_peak` (2004), `netflix_streaming_launches` (2007) — dead `revenue_stream`; ancillary revenue actually comes from year-gated `ANCILLARY_STREAMS` in `boxoffice.js:684-772`
- `star_wars_changes_everything` (1977), `lord_of_the_rings_trilogy` (2001) — dead `franchise_model`; the franchise system (`franchise.js`) is era-aware on its own
- All remaining 1930s–40s majors (SAG, Snow White, Oscars venue, war_of_worlds, film_noir_emerges, best_years_phenomenon, cannes_festival, selective_service, hollywood_ten_jailed, golden_age_ends, game_start) — flavor keys only

**Production events** (`js/systems/events.js`, 50 choice events): these DO have real teeth (quality/budget/weeks/morale deltas via `applyChoiceEffects`), but their era gating is broken — `getEligibleEvents`/`checkConditions` read `gameState.year`, which is never set anywhere (canonical field is `gameState.gameYear`), so the `isWartime` (1941–45) and `isRedScare` (1947–54) window checks compare `undefined` and never exclude anything (`events.js:2536,2580,2583`). Result: War Department propaganda officers and HUAC investigators can visit your set in 1933 or 2005. `censor_board_demands` ("Production Code office…no seal of approval") has no year condition at all and keeps firing decades after 1968; `rival_studio_similar_film` names MGM in every era.

## Real-person inventory

**174 of 174 named talent entries are real historical people. Zero fictional entries.**

- **Actors: 117/117 real.** Deceased pre-1956 (likely clear even under CA's 70-year post-mortem right of publicity by ~2026): Jean Harlow, Carole Lombard, Will Rogers-adjacent era only — very few. Deceased within 70 years (protected in CA/IN/TN etc.): Gable, Bogart, Davis, Hepburn, Monroe, Dean, Wayne, Grant, Stewart, Kelly, Taylor, and most of the roster. **Living (right of publicity + potential false-endorsement exposure): at least 25** — De Niro, Pacino, Nicholson, Hoffman, Keaton, Streep, Hanks, Ford, Weaver, Murphy, Douglas, Washington, Roberts, Pitt, Jackson, Foster, Smith, DiCaprio, Clooney, Blanchett, Jolie, Depp, plus Andrews, Loren, Dunaway.
- **Directors: 57/57 real**, including living: Scorsese, Ridley Scott, Lucas, Spielberg, Allen, Cameron, Burton, Tarantino, Fincher, the Coens, Nolan, Jackson, Bigelow, Ang Lee, Polanski (note: rosters Polanski and Woody Allen with `scandalRisk` fields — reputational consideration for a commercial product).
- **Characterization risk beyond names:** entries assign quantified `scandalRisk`, `quirks` like "heavy drinker", "notorious ladies man" (Gable, `talent-roster.js:42`), "demands top billing", plus `rivalries` — i.e., personality claims about real, sometimes living, people.
- **Events and crises** also depict real people (Welles, Hearst, Trumbo, Ava Gardner/Sinatra affair at `historical-events.js:2430`).
- **Script titles:** ~91 of 284 templates are verbatim real film titles (11 preCode, ~43 goldenAge, ~17 warYears, ~20 postWar), e.g. "Citizen Kane", "Casablanca", "The Wizard of Oz", "Double Indemnity", "Sunset Boulevard" — presented as scripts the *player's* studio produces. Titles alone aren't copyrightable, but several are registered trademarks/franchise marks, and the post-1950 lists switch to parody names ("Pulp Friction", "The Godson", "Star Conflicts"), making the pre-1950 verbatim usage look accidental rather than a licensing decision.

This inventory materially supports AUDIT-PLAN §9 (SHIP) legal finding; decision needed before commercial release: fictionalize (as post-1950 scripts already do), license, or accept risk.

## Tone check

Handled with intent (good):
- HUAC crisis choices (`crisis.js:63-158`) editorialize appropriately: "You've fired an innocent person to save yourself", "Many in Hollywood despise you." Resistance is framed as integrity and the `artistic_integrity` achievement (50 pts) outvalues `friendly_witness` (20 pts).
- `japanese_internment` (`historical-events.js:1395`): "Hollywood largely stays silent" — an honest, critical framing.
- `hattie_mcdaniel_oscar` (:1077): "Historic but bittersweet" with `diversity_slow_progress` framing.
- Civil-rights and blaxploitation scripts (`To Kill a Songbird`, `Freedom March`, `Shaft's Big Score`) are respectful; exploitation-era horror gets distancing notes ("traded on exotic 'voodoo' imagery").

Flags:
- `crisis.js:74-84` — "Cooperate — Name Names" costs 25 reputation but *removes* 50 huacRisk, and `huacRisk`/`blacklistRisk`/`blacklistKarma` are never read by any system afterward (only achievements read `longTermEffects`). Mechanically, informing is the dominant strategy with no karmic payback; the design intent (a `blacklistKarma: 30` counterweight) exists in data but is unimplemented. That turns a deliberate moral dilemma into a free discount — accidental-feeling in exactly the place the game most needs intent.
- `scripts.js:1957-1966` — "Safari Danger" pitch text reads "deadly animals and hostile tribes in darkest Africa" with a cost note but *no* framing note, unlike sibling exploitation scripts; reads as unexamined period voice.
- The blacklist as implemented affects 2 directors who leave the game in 1949 anyway, and never ends (Spartacus 1960 effect dropped) — the game's marquee sensitive topic is 95% modal text. Risk: marketing "navigate HUAC" while the system is cosmetic.
- Race in classic Hollywood is otherwise absent from mechanics (no segregated-market modeling, no casting friction) — acceptable scope choice, but note that events reference it while systems never do.

## Findings

```json
[
  {
    "id": "HIST-001",
    "workstream": "historical",
    "severity": "S1",
    "title": "Historical events are 97% decorative: effect payloads are silently dropped",
    "evidence": "applyEventEffects (js/data/historical-events.js:3778-3826) handles 10 keys; 116 events use 100+ distinct keys (genre_boost, revenue_stream, technology_available, rating_available, talent_restriction, box_office_modifier...) that match nothing; repo grep shows no other consumer. Only pearl_harbor, wwii_ends, huac_begins change state that is read (talent-roster.js:3375,3400,3405; crisis.js:361). politicalRisk, boxOfficeVariance, audienceExpectations, verticalIntegration, actorDraftRisk, gameComplete are write-only.",
    "repro": "node -e \"global.window={};require('./js/data/historical-events.js')\" then diff event effect keys against applyEventEffects; grep -rn 'genre_boost' js/",
    "player_impact": "The game's stated differentiator (living history) is modals + newspaper headlines; eras do not change play through events. Marquee moments like the Korean War, Cleopatra, Jaws, 9/11 promise effects in their own modal text that never occur.",
    "suggested_direction": "Either implement a generic effects interpreter (genre heat deltas, box-office modifiers, tech/revenue unlock hooks) or route events through the existing year-driven systems so the event IS the unlock.",
    "confidence": "high"
  },
  {
    "id": "HIST-002",
    "workstream": "historical",
    "severity": "S1",
    "title": "Post-1949 content cliff: 61 game-years share the content volume of the first 17",
    "evidence": "Counts from data modules: events 71/116 in 1933-49 (1970s has 5 total); talent active 1950s = 17 actors/8 directors vs 79/38 in the 1940s because 72 actors + 30 directors have availableTo:1949 (js/data/talent-roster.js, e.g. :119 Cary Grant, :2590 Orson Welles, :2621 John Huston); scripts: 13 templates dated 1950-59, 12 per era for 1967-88 with a +/-5yr filter (js/data/scripts.js:2519).",
    "repro": "Density script in docs/audit/HIST.md 'Density tables' section",
    "player_impact": "A 1933-2010 campaign spends most of its runtime in the thinnest content; repeat scripts and near-empty casting pools from 1950 onward.",
    "suggested_direction": "Feeds the deep-1933-1969 vs complete-1933-2010 scope decision; if 2010 stays, extend availableTo for the ~40 stars whose careers actually continued and triple 1950-2010 script/event counts.",
    "confidence": "high"
  },
  {
    "id": "HIST-003",
    "workstream": "historical",
    "severity": "S1",
    "title": "Paramount Decree has zero mechanical consequence; player theater chains survive 1948 untouched",
    "evidence": "paramount_decree (js/data/historical-events.js:2243) sets verticalIntegration/boxOfficeVariance which no module reads; THEATER_CHAIN investment (js/systems/financial.js:102-109) keeps paying $25k/mo forever; its 'antitrust_lawsuit' risk string appears nowhere else (grep antitrust => help.js only).",
    "repro": "Buy theater chain pre-1948, advance past May 1948, observe unchanged monthly revenue",
    "player_impact": "The single most important structural event of the era is a modal; the historically forced strategy shift never happens.",
    "suggested_direction": "On decree: force divestiture (cash-out at a multiple), remove the investment option post-1948, raise distribution costs as the 1950 event text already claims.",
    "confidence": "high"
  },
  {
    "id": "HIST-004",
    "workstream": "historical",
    "severity": "S1",
    "title": "Production-event era gating reads gameState.year, which never exists: wartime/HUAC set events fire in any year",
    "evidence": "js/systems/events.js:2536,2580,2583 use gameState.year; canonical field is gameState.gameYear (js/core/game-state.js:21,264) and nothing assigns .year. undefined comparisons make isWartime/isRedScare never exclude, so 'Government Wants Propaganda Added' and 'HUAC Investigator' are eligible 1933-2010. censor_board_demands has no year condition and fires post-1968 (MPAA era); rival_studio_similar_film hardcodes MGM in all eras.",
    "repro": "node: EventSystem.getEligibleEvents({activeFilms:[...]},{phase:'PRODUCTION',budget:100000}) with no year -> wartime events present",
    "player_impact": "Anachronisms directly contradict the game's authenticity pitch (Hays Code seal letters in 1995, HUAC in 2005).",
    "suggested_direction": "One-line fix to gameState.gameYear; add year windows to censor_board_demands (<=1968) and era-appropriate rival names.",
    "confidence": "high"
  },
  {
    "id": "HIST-005",
    "workstream": "historical",
    "severity": "S2",
    "title": "~20 dated/factual errors in 1933-1949 historical events",
    "evidence": "Full table in docs/audit/HIST.md Fact-check section: SAG founded 1935 vs 1933 (historical-events.js:387); King Kong Nov vs Mar 1933 (:115); Will Rogers May vs Aug 1935 (:355); Modern Times Nov vs Feb 1936 (:589); Fantasia Jan vs Nov 1940 (:1045); Oscar events dated to release year (:255,:1284,:1458); 'first Cannes' 1947 vs 1946 (:2093); blacklist event 4 months before HUAC convenes (:2126 vs :2159); Miracle on 34th Street moved to December (:2208); Treasure of the Sierra Madre Nov vs Jan 1948 (:2326); Hollywood Ten jailed 1949 vs 1950 (:2392); Double Indemnity Nov vs Jul 1944 (:1797); Legion of Decency Nov vs Apr 1934 (:287); Production Code 'written' 1933 vs 1930 (:86); plus 5 more minor month shifts.",
    "repro": "Compare cited lines to standard references",
    "player_impact": "History-literate buyers of a game sold on authenticity will catch several of these (SAG, King Kong, Miracle on 34th Street are well-known); reviews will quote them.",
    "suggested_direction": "One data-correction pass; where a month was moved deliberately for pacing, reword titles to 'sweeps the Oscars season' style so dates stop being falsifiable.",
    "confidence": "high"
  },
  {
    "id": "HIST-006",
    "workstream": "historical",
    "severity": "S2",
    "title": "Blacklist never lifts and barely bites; actor blacklist flag is dead data",
    "evidence": "blacklist_begins sets blacklistActive=true (js/data/historical-events.js:3805); no code ever sets it false - spartacus_breaks_blacklist's talent_restriction:false (:2756) is an unhandled key. Only 2 directors carry huacRisk (talent-roster.js:2792,2849) and both expire availableTo:1949; getAvailableActors (talent-roster.js:3363-3383) never checks actor huacRisk, so Edward G. Robinson's flag (:962) does nothing.",
    "repro": "Load 1961 save: blacklistActive still true; Robinson castable during 1947-49 greylist either way",
    "player_impact": "The era's defining talent constraint is effectively absent, and the 1960 'blacklist broken' beat is a lie.",
    "suggested_direction": "Check huacRisk for actors too; give 8-10 1950s talents huacRisk; clear blacklistActive on the Spartacus event.",
    "confidence": "high"
  },
  {
    "id": "HIST-007",
    "workstream": "historical",
    "severity": "S1",
    "title": "100% of the 174-person talent roster are real people, including ~25 living A-listers, with characterization (scandal odds, quirks) attached",
    "evidence": "Inventory in docs/audit/HIST.md: 117 actors + 57 directors, all real; living include De Niro, Streep, Hanks, Roberts, Pitt, DiCaprio, Nolan, Spielberg, Tarantino; entries assign scandalRisk numbers and quirks like 'notorious ladies man' (talent-roster.js:42); ~91/284 script templates are verbatim real film titles (scripts.js:421 'It Happened One Night' etc.).",
    "repro": "node dump of ACTORS/DIRECTORS names",
    "player_impact": "Right-of-publicity / false-endorsement exposure for a commercial product (CA Civil Code 3344/3344.1); also inconsistent with post-1950 scripts which already use parody titles.",
    "suggested_direction": "Joint decision with SHIP-9: fictionalize names (keep stats/archetypes), or restrict roster to pre-1956 deceased, or obtain licenses. Rename the ~91 verbatim film titles to match the parody convention.",
    "confidence": "high"
  },
  {
    "id": "HIST-008",
    "workstream": "historical",
    "severity": "S2",
    "title": "Pre-Code era is not pre-Code: full Hays evaluation applies from 1933",
    "evidence": "CONTENT_REGULATION.PRE_CODE='hays_code' (js/core/constants.js:132); censorship.js getRegulationType (:121-127) is purely year-driven, so evaluateScriptHaysCode runs in 1933-34; the 'none' branch (censorship.js:136) is unreachable. Contradicts game_start modal 'No content restrictions yet (Pre-Code era)' (historical-events.js:40) and makes the hays_code_enforced event's censorship_active flag redundant (read only in unreachable fallback censorship.js:125).",
    "repro": "Greenlight a censorRisk-90 script in Jan 1933; observe Hays violations",
    "player_impact": "The game's opening hook (exploit the Pre-Code window before July 1934) doesn't exist; ERA_ADJUSTMENTS -20 softens but does not remove review.",
    "suggested_direction": "Map PRE_CODE to 'none' (or 'hays_code_weak'), and let the 1934 event flip the regulation on for real.",
    "confidence": "high"
  },
  {
    "id": "HIST-009",
    "workstream": "historical",
    "severity": "S2",
    "title": "HUAC decisions have no downstream consequences; informing is mechanically dominant; second Red Scare wave (1951-54) has no decisions at all",
    "evidence": "crisis.js choice effects write gameState.huacRisk/blacklistRisk (crisis.js:527-535) which no system reads; blacklistKarma:30 (crisis.js:80) matches no handler; longTermEffects only feed two achievements (achievements.js:276,289). Both HUAC crises gate to years [1947,1948,1949] (crisis.js:70,121) though hearings and the blacklist peaked 1951-53 (the 1951 historical event exists but is inert).",
    "repro": "Choose 'Name Names': -25 rep, then nothing ever references cooperative_witness except a 20-point achievement",
    "player_impact": "The game's most marketed moral dilemma is a one-off stat trade; 'blacklisted' as a long-term effect does nothing.",
    "suggested_direction": "Make blacklistRisk/huacRisk feed talent willingness, awards odds, and a possible studio-boycott crisis; extend trigger years to 1954.",
    "confidence": "high"
  },
  {
    "id": "HIST-010",
    "workstream": "historical",
    "severity": "S3",
    "title": "time-system.js checkForHistoricalMilestones is dead code with conflicting facts",
    "evidence": "No caller in repo (grep checkForHistoricalMilestones => only definition js/core/time-system.js:244 and export :420); duplicates 5 events also in historical-events.js; dates Technicolor availability June 1937 (:261-267) vs technology.js yearAvailable:1935 and real 1935 debut; requires exact day match (:298-302) that weekly ticks would rarely hit even if called.",
    "repro": "grep -rn checkForHistoricalMilestones js/",
    "player_impact": "None today; a future caller would introduce duplicate/contradictory events.",
    "suggested_direction": "Delete (per quality rule: remove dead code).",
    "confidence": "high"
  },
  {
    "id": "HIST-011",
    "workstream": "historical",
    "severity": "S3",
    "title": "Triggered-event registry is not persisted; current-month events can replay and re-apply additive effects after load",
    "evidence": "Module-level triggeredEvents Set (js/data/historical-events.js:12) is not serialized by save-load (grep triggeredEvents js/core/save-load.js => none); after load, checkForEvents re-triggers any event matching the current year+month, re-running applyEventEffects where political_risk and box_office_uncertainty are additive (+= at :3801,:3814).",
    "repro": "Save in Oct 1947 before month tick completes, reload, advance: HUAC modal repeats and politicalRisk doubles",
    "player_impact": "Duplicate modals and silent stat drift; low frequency.",
    "suggested_direction": "Persist gameState.historicalEvents ids into the Set on load (data already saved at :3762-3770).",
    "confidence": "medium"
  },
  {
    "id": "HIST-012",
    "workstream": "historical",
    "severity": "S3",
    "title": "Tone: isolated unframed period language and an achievement for naming names",
    "evidence": "scripts.js:1957-1966 'Safari Danger' pitch uses 'hostile tribes in darkest Africa' with no distancing historicalNote (sibling exploitation scripts get one); achievements.js:267-278 'Friendly Witness' (20 pts) rewards cooperating with HUAC - counterweighted by 'Artistic Integrity' (50 pts) so intent exists but is subtle.",
    "repro": "Read cited lines",
    "player_impact": "Low; overall handling of blacklist/internment/McDaniel is notably intentional. These two spots read accidental.",
    "suggested_direction": "Add a framing note to Safari Danger; rename/flavor Friendly Witness so it reads as historical record, not reward.",
    "confidence": "medium"
  },
  {
    "id": "HIST-013",
    "workstream": "historical",
    "severity": "S2",
    "title": "Talent availability windows contradict biography beyond the 1949 truncation",
    "evidence": "tony_curtis availableFrom/To 1949/1949 - one year, description promises 'a long career ahead' (talent-roster.js:1310-1319); akira_kurosawa offered as hireable Hollywood director 1950-1985 (:3005); rock_hudson to 1970 (:1793); sidney_poitier from 1955 (:1878); james_dean 1955-1955 is defensible (died 9/1955) but jointly with Curtis shows windows were not reviewed after the timeline extension.",
    "repro": "node dump of availability windows vs. standard filmographies",
    "player_impact": "Casting pools misrepresent who was working when - the core authenticity promise of the roster.",
    "suggested_direction": "Single data pass extending/correcting windows; decide Kurosawa policy (foreign masters as prestige 'loan-outs' or remove).",
    "confidence": "high"
  },
  {
    "id": "HIST-014",
    "workstream": "historical",
    "severity": "S2",
    "title": "Identity mismatch: README/CLAUDE.md sell 1933-1949; game and constants run 1933-2010",
    "evidence": "CLAUDE.md header 'A historically authentic Hollywood studio management game (1933-1949)'; js/core/constants.js:48 GAME_END_YEAR: 2010; game-state.js:387 ends game at 2010; density tables above quantify how thin 1950-2010 is (45 events, ~30 net talent, 102 templates for 61 years).",
    "repro": "Compare CLAUDE.md to constants.js:44-51",
    "player_impact": "Sets the scope decision for BUILD-PLAN 3.0; shipping '1933-2010' at current density invites 'content runs out' reviews (S1 per plan bar), while '1933-1949' is dense and nearly coherent today.",
    "suggested_direction": "Decide scope with these numbers; if trimming, golden_age_ends (historical-events.js:2462) already reads like an ending.",
    "confidence": "high"
  }
]
```

## Not covered

- **In-browser play verification** of event modal presentation/newspaper output (PLAY/UX workstreams own this; all findings here are code+data traced, with consumers verified by grep and Node loading, not live play).
- `js/systems/newspaper.js`, `awards.js`, `scenarios.js` historical content (headlines, Oscar history, scenario premises) — spot-checked only via cross-references; a dedicated pass could add ~10 more fact checks.
- `js/systems/unused/` (5k lines) — excluded as dead code per plan §0.5.
- Per-year genre-heat tables in `boxoffice.js` (referenced by `time-system.js:121`) were confirmed to exist but their year-by-year historical plausibility was not audited (ECON's simulation will exercise them).
- Right-of-publicity legal analysis is inventory-only here (counts, names, categories); legal conclusions belong to SHIP.
