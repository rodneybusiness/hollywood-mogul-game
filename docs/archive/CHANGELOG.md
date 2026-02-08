# Changelog

All notable changes to Hollywood Mogul are documented in this file.

## [1.1.0] - 2025-12-06

### Current Release

Production-ready release with comprehensive improvement roadmap.

---

## Recent Changes

### [1.1.0] - 2025-12-06

#### Added
- **NEXT-20-IMPROVEMENTS.md**: Comprehensive improvement roadmap created by expert collaboration
  - 20 compounding improvements organized into 5 synergistic chains
  - Chain A: Feel the Stakes (emotional investment)
  - Chain B: Master the Craft (strategic depth)
  - Chain C: Live the Era (historical immersion)
  - Chain D: See Your Empire (feedback & clarity)
  - Chain E: Own the Experience (player agency)
  - Priority matrix with implementation order
  - Expert verdicts (Game Designer, Systems Architect, Playtest Analyst)

#### Documentation
- Updated README.md with new roadmap reference and chain summary
- Updated IMPROVEMENT-ROADMAP.md to reference the new implementation plan

### [1.0.0] - 2025-12-06

#### Fixed
- **Starting Cash Balance**: Increased from $225,000 to $410,000 to fix bankruptcy issue
  - Players were going bankrupt before first film could earn revenue
  - Cheapest film: $75k budget + $120k overhead (16 weeks) = $195k
  - New runway: 54 weeks (safely covers first film cycle)
  - After greenlighting cheapest film: $335k remaining (44 weeks runway)

#### Documentation
- Updated all documentation to reflect accurate game status
- README.md completely rewritten with current features and statistics
- CHANGELOG.md created to track version history
- tests/README.md updated with current test status

### [0.9.1] - 2025-10-12

#### Fixed
- **Starting Cash**: Tripled from $75,000 to $225,000
  - Provides ~30 weeks runway instead of ~10 weeks
  - Allows more time to establish profitable film production

### [0.9.0] - 2025-10-12

#### Added
- **2010 Timeline Extension Roadmap**: Detailed plan for extending game to 2010
  - New eras: New Hollywood, Blockbuster, Home Video, Digital
  - MPAA ratings system (replacing PCA after 1968)
  - Expanded talent roster with post-1950 archetypes
  - International box office multipliers

- **Rapid Impact Plan**: Prioritized enhancement roadmap
  - Seasonal Awards Loop
  - Era-Savvy Script Variations
  - Command Center Dashboard Lite

### [0.8.0] - 2025-10-12

#### Fixed
- **Loading Screen Hang**: Hardened integration renderer
  - Fixed JS loading out of order
  - Added UI fallbacks for integration layer

#### Added
- **V1 Porting Assessment**: Documentation confirming no separate V1 codebase exists
- **Box Office Improvements**: Enhanced revenue calculations
- **Dashboard Improvements**: Better UI updates and display

### [0.7.0] - 2025-10-12

#### Added
- **GitHub Deployment**: Complete deployment documentation
  - GitHub Pages setup instructions
  - Itch.io deployment guide
  - Custom server deployment guide

---

## Initial Release

### [0.1.0] - 2025-10-12

#### Added
- **Complete Game Implementation**: All 4 phases complete

##### Phase 1: Foundation
- Core game state management (759 LOC)
- Time progression system (~400 LOC)
- Save/load system (~300 LOC)
- Test infrastructure (36 tests, 100% passing)

##### Phase 2: Game Mechanics
- Financial system (~1100 LOC) - cash, loans, burn rate
- Production system (~900 LOC) - film production pipeline
- Box office system (~650 LOC) - revenue simulation
- Random events (350 LOC) - 15% weekly chance
- Integration layer (400 LOC) - system coordination
- Dashboard UI (802 LOC) - main interface

##### Phase 3: Historical Depth
- Historical events (500 LOC) - 7 major events
- Talent roster (700 LOC) - 37 actors/directors
- Censorship system (400 LOC) - PCA enforcement
- Crisis management (500 LOC) - 8 scenarios

##### Phase 4: Polish
- Tutorial system (600 LOC) - 18-step guide
- Achievement system (800 LOC) - 36 achievements
- CSS styling (1200+ LOC) - Art Deco theme
- Complete documentation (150+ pages)

---

## Features Summary

### Core Systems
| System | Lines | Description |
|--------|-------|-------------|
| Game State | 759 | Central state management |
| Financial | 1100 | Cash, loans, runway |
| Production | 900 | Film production pipeline |
| Box Office | 650 | Revenue simulation |
| Events | 350 | Random production events |
| Censorship | 400 | PCA enforcement |
| Crisis | 500 | 8 crisis scenarios |
| Achievements | 800 | 36 achievements |
| Tutorial | 600 | 18-step guide |

### Historical Content
- **7 Historical Events**: Hays Code (1934), Pearl Harbor (1941), HUAC (1947), etc.
- **37 Talent**: Real actors and directors from the Golden Age
- **4 Eras**: Pre-Code, Golden Age, War Years, Post-War

### Game Constants
| Constant | Value |
|----------|-------|
| Starting Cash | $410,000 |
| Monthly Overhead | $30,000 |
| Starting Runway | ~54 weeks |
| Game Duration | 1933-1949 |

---

## Upgrade Notes

### From 0.9.x to 1.0.0
- Starting cash increased to $410,000
- Existing saves will maintain their current cash balance
- No breaking changes to save format

### From 0.8.x to 0.9.x
- Starting cash tripled to $225,000
- Game is now more forgiving for new players

---

## Known Issues

### Minor
- Production budget display may show undefined in JSDOM testing (works in browser)
- Event titles may show undefined in automated tests (works in browser)

### Limitations
- Save/load requires localStorage (not available in incognito mode)
- Mobile UI not fully optimized (desktop-first design)
- No audio system (silent gameplay)

---

## Future Plans

See [IMPROVEMENT-ROADMAP.md](IMPROVEMENT-ROADMAP.md) for planned enhancements:
- Timeline extension to 2010
- Seasonal awards system
- Enhanced dashboard
- Audio system

See [PRIORITIZED-IMPLEMENTATION-PLAN.md](PRIORITIZED-IMPLEMENTATION-PLAN.md) for implementation details.

---

**Maintained By**: Claude Code
**Repository**: https://github.com/rodneybusiness/hollywood-mogul-game
