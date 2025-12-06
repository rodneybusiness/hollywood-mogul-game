# Hollywood Mogul

A historically authentic Hollywood studio management game set in the Golden Age of cinema (1933-1949).

**Status**: Production Ready | **Version**: 1.0 | **Tests**: 36/36 Passing

## Overview

**Hollywood Mogul** puts you in control of a Hollywood movie studio during the most tumultuous and glamorous era of film history. Navigate the transition from Pre-Code freedom to strict censorship, survive the Great Depression, adapt to wartime conditions, and face the post-war challenges that would reshape the industry forever.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/rodneybusiness/hollywood-mogul-game.git
cd hollywood-mogul-game

# Open in browser
open index.html
```

Or double-click `index.html` to play immediately.

## Game Features

### Core Gameplay
- **Film Production Pipeline**: Greenlight scripts, manage production, distribute films
- **Financial Management**: Starting cash of $410,000, monthly overhead of $30,000
- **Time Progression**: Week-by-week simulation from 1933 to 1949 (54+ weeks runway)
- **Box Office System**: Earn revenue from theatrical releases with realistic returns

### Historical Authenticity
- **7 Major Historical Events**: Hays Code enforcement, Pearl Harbor, HUAC hearings, Paramount Decision
- **4 Distinct Eras**: Pre-Code (1933-1934), Golden Age (1935-1941), War Years (1941-1945), Post-War (1946-1949)
- **37 Historical Figures**: Real actors (Clark Gable, Bette Davis, Humphrey Bogart) and directors (Hitchcock, Ford, Capra)
- **Era-Appropriate Content**: Genre preferences shift with historical events

### Game Systems

| System | Description |
|--------|-------------|
| Production | 12-16 week film production with random events (15% weekly chance) |
| Censorship | Production Code Administration (PCA) enforcement after July 1934 |
| Crisis Management | 8 crisis scenarios with meaningful player choices |
| Achievements | 36 achievements across 9 categories |
| Tutorial | 18-step guided introduction for new players |
| Save/Load | Multiple save slots using browser localStorage |

### Time Period: 1933-1949

| Era | Period | Key Features |
|-----|--------|--------------|
| Pre-Code Freedom | 1933-1934 | Few restrictions, gangster films profitable |
| Golden Age | 1935-1941 | Hays Code enforcement, studio system peak |
| War Years | 1941-1945 | Propaganda films, talent shortages, rationing |
| Post-War Anxiety | 1946-1949 | Film noir, HUAC investigations, television emerges |

### Victory Conditions

- **Mogul Victory**: 20+ films, $500,000+ cash, survive to 1949
- **Survivor Victory**: 10+ films, $100,000+ cash, survive to 1949
- **Television Victory**: Survive to 1949 (any performance level)
- **Bankruptcy**: Game over when cash reaches $0

## Documentation

| Document | Purpose |
|----------|---------|
| [START-HERE.md](START-HERE.md) | Quick start guide (read first!) |
| [HOW-TO-PLAY.md](HOW-TO-PLAY.md) | Complete gameplay instructions |
| [CHANGELOG.md](CHANGELOG.md) | Version history and recent changes |
| [IMPROVEMENT-ROADMAP.md](IMPROVEMENT-ROADMAP.md) | Future enhancement plans |
| [TESTING-COMPLETE.md](TESTING-COMPLETE.md) | Test results and verification |
| [GITHUB-DEPLOY.md](GITHUB-DEPLOY.md) | Deployment instructions |

## Project Structure

```
hollywood-mogul-game/
├── index.html                    # Game entry point
├── css/
│   ├── main.css                  # Art Deco core styling
│   ├── responsive.css            # Mobile adaptations
│   ├── tutorial.css              # Tutorial overlay styling
│   ├── achievements.css          # Achievement notifications
│   └── modals-extended.css       # Crisis/event modal styling
├── js/
│   ├── core/
│   │   ├── game-state.js         # Central state management
│   │   ├── time-system.js        # Date progression & eras
│   │   ├── save-load.js          # LocalStorage persistence
│   │   └── integration.js        # System coordinator
│   ├── systems/
│   │   ├── financial.js          # Banking, loans, expenses
│   │   ├── production.js         # Film production pipeline
│   │   ├── boxoffice.js          # Box office simulation
│   │   ├── events.js             # Random production events
│   │   ├── censorship.js         # PCA enforcement
│   │   ├── crisis.js             # Crisis management
│   │   └── achievements.js       # Achievement tracking
│   ├── data/
│   │   ├── scripts.js            # Available film scripts
│   │   ├── historical-events.js  # Historical milestones
│   │   └── talent-roster.js      # Actors and directors
│   └── ui/
│       ├── dashboard.js          # Main interface updates
│       ├── modals.js             # Dialog system
│       └── tutorial.js           # Tutorial system
└── tests/
    ├── setup.js                  # Test utilities
    └── game-state.test.js        # Core system tests (36 tests)
```

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Styling**: Custom Art Deco theme with CSS Grid/Flexbox
- **Storage**: Browser localStorage for save/load
- **Testing**: Jest with 36 comprehensive tests
- **Responsive**: Mobile-first design with progressive enhancement

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 80+ | Fully Supported |
| Firefox | 75+ | Fully Supported |
| Safari | 13+ | Fully Supported |
| Edge | 80+ | Fully Supported |

## Development

### Running Tests

```bash
# Install dependencies
npm install

# Run test suite
npm test
```

### Game Constants

| Constant | Value | Description |
|----------|-------|-------------|
| Starting Cash | $410,000 | Initial studio capital |
| Monthly Overhead | $30,000 | Base operating costs |
| Starting Runway | ~54 weeks | Time until bankruptcy |
| Game Duration | 1933-1949 | 16 years of gameplay |
| Weekly Event Chance | 15% | Random production events |

## Implementation Status

All development phases complete:

- **Phase 1**: Foundation (game state, time system, save/load, tests)
- **Phase 2**: Core Systems (production, financial, box office, events, integration)
- **Phase 3**: Historical Depth (events, talent, censorship, crisis)
- **Phase 4**: Polish (tutorial, achievements, CSS styling)

## Statistics

| Metric | Value |
|--------|-------|
| JavaScript | 14,261 lines |
| CSS | 1,200+ lines |
| Source Files | 20+ files |
| Unit Tests | 36 tests (100% passing) |
| Historical Events | 7 major events |
| Achievements | 36 achievements |
| Talent Roster | 37 actors/directors |
| Documentation | 150+ pages |

## Future Roadmap

See [NEXT-20-IMPROVEMENTS.md](NEXT-20-IMPROVEMENTS.md) for the prioritized improvement plan with 20 compounding features organized into 5 chains:

| Chain | Focus | Improvements |
|-------|-------|--------------|
| A | Feel the Stakes | Premieres, Awards, Talent Morale, Star Vehicles |
| B | Master the Craft | Production Decisions, Test Screenings, Reshoots, Quality Breakdown |
| C | Live the Era | Era Themes, Transitions, Genre Heat, Script Commissioning |
| D | See Your Empire | Forecasts, Calendar, Dashboard, Achievement Showcase |
| E | Own the Experience | Difficulty, Scenarios, Custom Setup, Import/Export |

Additional planning documents:
- [IMPROVEMENT-ROADMAP.md](IMPROVEMENT-ROADMAP.md) - A++++ upgrade vision
- [PRIORITIZED-IMPLEMENTATION-PLAN.md](PRIORITIZED-IMPLEMENTATION-PLAN.md) - 2010 timeline extension

## Historical Accuracy

The game strives for historical authenticity while remaining engaging:

- **Real Events**: Hays Code (1934), Pearl Harbor (1941), HUAC hearings (1947), Paramount Decision (1948)
- **Period Content**: Era-appropriate genres, talent, and industry practices
- **Industry Practices**: 7-year contracts, studio system, theater ownership
- **Moral Complexity**: Difficult choices without clear right answers

## License

This project is open source. Feel free to play, study, modify, and share.

## Acknowledgments

Developed with Claude Code - AI-powered software development assistant.

---

**Repository**: https://github.com/rodneybusiness/hollywood-mogul-game
**Last Updated**: 2025-12-06
**Game Status**: Production Ready
