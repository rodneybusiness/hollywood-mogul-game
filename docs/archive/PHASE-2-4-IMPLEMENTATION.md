# Hollywood Mogul Game - Phase 2-4 Implementation Guide

## Overview

This document provides a complete implementation roadmap for Phases 2-4 of the Hollywood Mogul game. Phase 1 (Foundation) is complete with tests. This guide breaks down the remaining work into manageable chunks with priority ordering.

---

## Current Status

### ✅ Phase 1: COMPLETE
- [x] Project structure and HTML framework
- [x] Art Deco UI styling with responsive design
- [x] Core game state management (game-state.js) - **TESTED**
- [x] Time progression system (time-system.js)
- [x] Save/load architecture (save-load.js)
- [x] Basic financial tracking
- [x] **NEW**: Comprehensive test suite (50+ tests)

### 🟡 Phase 2: PARTIAL (60% complete)
- [x] Film production pipeline (**production.js exists**)
- [x] Financial system (**financial.js exists**)
- [x] Box office simulation (**boxoffice.js exists**)
- [x] Script library (**scripts.js exists**)
- [ ] Random production events (**NEEDS IMPLEMENTATION**)
- [ ] UI components (**NEEDS IMPLEMENTATION**)
- [ ] UI integration (**NEEDS WIRING**)

### ❌ Phase 3: Not Started
### ❌ Phase 4: Not Started

---

## Phase 2: Core Systems (4-6 weeks)

### Priority 1: Random Production Events System

**File**: `js/systems/events.js`

**Purpose**: Create dynamic production events that make each film unique

**Key Features**:
- Weather delays, equipment failures, actor illnesses
- Budget overruns, creative conflicts
- Unexpected opportunities (test screenings, star cameos)
- Era-specific events (WWII rationing, Hays Code inspections)

**Implementation**:
```javascript
window.EventSystem = (function() {
    const EVENT_DATABASE = {
        positive: [
            {
                id: 'test_screening_success',
                title: 'Test Screening Triumph',
                description: 'Audiences love the film! Studio buzz is building.',
                effects: { reputation: +5, quality: +10 },
                probability: 0.15
            }
            // ... more positive events
        ],
        negative: [
            {
                id: 'weather_delay',
                title: 'Production Delay',
                description: 'Bad weather has shut down filming for a week.',
                effects: { weeks: +1, budget: +5000 },
                probability: 0.20
            }
            // ... more negative events
        ]
    };

    function generateRandomEvent(film, gameState) {
        // Roll for event based on film's progress and current era
        // Apply effects to film and gameState
        // Generate alert for player
    }

    return {
        generateRandomEvent,
        processFilmEvent
    };
})();
```

**Time Estimate**: 1 week
**Dependencies**: production.js
**Testing**: Add event.test.js

---

### Priority 2: UI Components System

**Files**:
- `js/ui/dashboard.js` - Main dashboard updates
- `js/ui/modals.js` - Modal system
- `js/ui/animations.js` - UI animations

**Purpose**: Create reusable UI components for game interactions

**Key Components**:

#### Dashboard Component
```javascript
window.DashboardUI = (function() {
    function updateProductionCards(activeFilms) {
        // Render production cards with progress bars
        // Show budget spent, weeks remaining, quality indicators
    }

    function updateFinancialSummary(gameState) {
        // Cash flow visualization
        // Runway meter with color-coded warnings
        // Revenue projections
    }

    function updateAlertsFeed(events) {
        // Priority-sorted alerts
        // Dismissible notifications
        // Event history
    }

    return {
        update,
        render,
        refresh
    };
})();
```

#### Modal System
```javascript
window.ModalSystem = (function() {
    function showFilmDetails(filmId) {
        // Detailed production view
        // Budget breakdown, cast list, progress timeline
    }

    function showScriptSelection(scripts) {
        // Grid of available scripts
        // Filtering by genre, era, budget
        // Greenlight workflow
    }

    function showDecisionModal(decision) {
        // Present player choices
        // Show consequences
        // Timer for urgent decisions
    }

    return {
        show,
        hide,
        showConfirm,
        showAlert
    };
})();
```

**Time Estimate**: 2 weeks
**Dependencies**: None
**Testing**: Add ui.test.js

---

### Priority 3: Integration Layer

**File**: `js/core/integration.js`

**Purpose**: Wire all systems together

**Key Functions**:
```javascript
window.Integration = (function() {
    function wireEventListeners() {
        // Connect UI buttons to game systems
        // Set up delegation for dynamic elements
    }

    function syncGameStateToUI() {
        // Update all UI when state changes
        // Debounce updates for performance
    }

    function handleFilmGreenlight(scriptId, budget) {
        // 1. Validate budget
        // 2. Create film in ProductionSystem
        // 3. Deduct cash from FinancialSystem
        // 4. Update UI
        // 5. Generate alert
    }

    function handleWeekAdvance() {
        // 1. Process film productions
        // 2. Roll for random events
        // 3. Update box office
        // 4. Check milestones
        // 5. Refresh UI
    }

    return {
        init,
        wireAll,
        update
    };
})();
```

**Time Estimate**: 1 week
**Dependencies**: All Phase 2 systems
**Testing**: Add integration.test.js

---

## Phase 3: Historical Depth (4-5 weeks)

### Priority 1: Historical Events System

**File**: `js/data/historical-events.js`

**Purpose**: Trigger real Hollywood history milestones

**Key Events**:
```javascript
const HISTORICAL_EVENTS = {
    1934: {
        july: {
            event: 'Hays Code Enforcement Begins',
            description: 'The Production Code Administration begins strict enforcement.',
            effects: {
                censorship_increase: +40,
                genre_restrictions: ['gangster', 'pre_code_drama']
            },
            mandatory: true
        }
    },
    1939: {
        september: {
            event: 'World War II Begins',
            description: 'War in Europe. Audiences seek escapism and patriotism.',
            effects: {
                genre_boost: ['musicals', 'war', 'comedy'],
                european_market_closed: true
            }
        }
    },
    1941: {
        december: {
            event: 'Pearl Harbor',
            description: 'America enters WWII. Government requests propaganda films.',
            effects: {
                war_film_bonus: 15000,
                talent_shortage: 0.3, // 30% of male actors drafted
                material_rationing: true
            },
            mandatory: true
        }
    },
    1947: {
        october: {
            event: 'Hollywood Ten HUAC Hearings',
            description: 'Communist witch hunt begins. Any film can be targeted.',
            effects: {
                huac_risk: +50,
                paranoia: true,
                blacklist_threat: true
            },
            mandatory: true
        }
    }
};
```

**Time Estimate**: 1.5 weeks
**Testing**: Add historical-events.test.js

---

### Priority 2: Censorship System

**File**: `js/systems/censorship.js`

**Purpose**: Enforce Production Code restrictions

**Key Features**:
```javascript
window.CensorshipSystem = (function() {
    const HAYS_CODE_RULES = {
        prohibited_content: [
            'explicit_violence',
            'sexual_content',
            'drug_use',
            'profanity',
            'clergy_mockery',
            'interracial_romance' // sadly historical
        ],

        mandatory_elements: [
            'crime_punishment', // Crime must not pay
            'moral_lessons',
            'family_values'
        ]
    };

    function evaluateScript(script, year) {
        if (year < 1934) {
            return { approved: true, warnings: [] };
        }

        const violations = checkForViolations(script);
        const severity = calculateSeverity(violations);

        if (severity > 80) {
            return {
                approved: false,
                reason: 'Script rejected by PCA',
                required_changes: violations
            };
        }

        return {
            approved: true,
            warnings: violations,
            cuts_required: severity > 50
        };
    }

    function handleCensorshipEvent(film) {
        // Random PCA inspection during production
        // Force reshoots if violations found
        // Budget impact, schedule delays
    }

    return {
        evaluateScript,
        handleCensorshipEvent,
        calculateRisk
    };
})();
```

**Time Estimate**: 1 week
**Testing**: Add censorship.test.js

---

### Priority 3: Talent Management System

**File**: `js/data/talent-roster.js` and `js/systems/talent.js`

**Purpose**: Manage actors, directors, and crew with personalities

**Talent Database**:
```javascript
const TALENT_DATABASE = {
    actors: [
        {
            id: 'actor_001',
            name: 'James Stewart',
            type: 'leading_man',
            star_power: 85,
            acting_skill: 90,
            genres: ['drama', 'western', 'comedy'],
            personality: 'professional',
            salary: 5000,
            contract_status: 'free_agent',
            availability: 1935 // Year they become available
        }
        // ... 50+ historical actors
    ],
    directors: [
        {
            id: 'dir_001',
            name: 'Frank Capra',
            specialty: ['drama', 'comedy'],
            skill: 95,
            speed: 'fast',
            temperament: 'collaborative',
            salary: 8000,
            oscar_wins: 3
        }
        // ... 30+ historical directors
    ]
};
```

**System Features**:
```javascript
window.TalentSystem = (function() {
    function signContract(talentId, years, salary) {
        // 7-year contracts (historical)
        // Option years, salary escalation
        // Exclusivity clauses
    }

    function castFilm(filmId, castingChoices) {
        // Match talent to roles
        // Calculate chemistry bonuses
        // Handle scheduling conflicts
    }

    function handleTalentEvent(talent) {
        // Scandals, illnesses, award wins
        // Contract disputes, salary demands
        // Drafted for military service (WWII)
    }

    return {
        signContract,
        castFilm,
        manageTalent
    };
})();
```

**Time Estimate**: 2 weeks
**Testing**: Add talent.test.js

---

### Priority 4: Crisis Management System

**File**: `js/systems/crisis.js`

**Purpose**: Major decisions with lasting consequences

**Crisis Types**:
```javascript
const CRISIS_DATABASE = {
    scandal: {
        id: 'actor_arrest',
        title: 'Star Arrested',
        description: 'Your lead actor was arrested for drunk driving. The press is having a field day.',
        choices: [
            {
                text: 'Pay off the press and cover it up',
                cost: 10000,
                effects: { reputation: -10, mob_influence: +20 }
            },
            {
                text: 'Fire the actor and recast',
                cost: 25000,
                effects: { production_delay: 4, quality: -15 }
            },
            {
                text: 'Weather the storm publicly',
                cost: 0,
                effects: { box_office: -30, reputation: +5 }
            }
        ],
        time_limit: 1 // Must decide within 1 week
    },

    huac_investigation: {
        id: 'named_before_huac',
        title: 'HUAC Summons',
        description: 'One of your contract players has been named as a Communist sympathizer.',
        choices: [
            {
                text: 'Terminate their contract immediately',
                effects: { reputation: +10, integrity: -30, talent_morale: -20 }
            },
            {
                text: 'Stand by them publicly',
                effects: { huac_target: true, reputation: -20, integrity: +50 }
            },
            {
                text: 'Quietly let their contract lapse',
                effects: { reputation: -5, integrity: -10 }
            }
        ],
        era_specific: 'post_war'
    }
};
```

**Time Estimate**: 1.5 weeks
**Testing**: Add crisis.test.js

---

## Phase 4: Polish & Features (3-4 weeks)

### Priority 1: Tutorial System

**File**: `js/ui/tutorial.js`

**Purpose**: Onboard new players

**Key Features**:
- Step-by-step guided first film
- Tooltips for UI elements
- Contextual hints
- Skip option for experienced players

**Implementation**:
```javascript
window.TutorialSystem = (function() {
    const TUTORIAL_STEPS = [
        {
            step: 1,
            title: 'Welcome to Hollywood',
            message: 'You\'ve inherited a small studio in 1933...',
            highlight: '#cash-display',
            next_trigger: 'click'
        },
        {
            step: 2,
            title: 'Review Your Finances',
            message: 'You have $75,000 cash and $30,000/month expenses...',
            highlight: '#runway-display',
            next_trigger: 'understood'
        }
        // ... 15-20 tutorial steps
    ];

    function startTutorial() {
        // Progressive disclosure
        // UI element highlighting
        // Prevent actions until step complete
    }

    return {
        start,
        skip,
        next,
        previous
    };
})();
```

**Time Estimate**: 1 week
**Testing**: Manual QA

---

### Priority 2: Achievement System

**File**: `js/systems/achievements.js`

**Purpose**: Track milestones and reward players

**Achievements**:
```javascript
const ACHIEVEMENTS = {
    survival: [
        {
            id: 'first_year',
            title: 'Still Standing',
            description: 'Survive your first year',
            condition: (gs) => gs.gameYear >= 1934
        },
        {
            id: 'depression_survivor',
            title: 'Depression Survivor',
            description: 'Reach 1941 without bankruptcy',
            condition: (gs) => gs.gameYear >= 1941 && gs.cash > 0
        }
    ],

    production: [
        {
            id: 'first_film',
            title: 'Debut Feature',
            description: 'Complete your first film'
        },
        {
            id: 'blockbuster',
            title: 'Box Office Smash',
            description: 'Earn $500,000 from a single film'
        }
    ],

    prestige: [
        {
            id: 'first_oscar',
            title: 'Academy Recognition',
            description: 'Win your first Oscar'
        },
        {
            id: 'mogul_status',
            title: 'Hollywood Mogul',
            description: 'Own 5 sound stages and have $1,000,000 cash'
        }
    ]
};
```

**Time Estimate**: 3-4 days
**Testing**: Add achievements.test.js

---

### Priority 3: UI/UX Polish

**Tasks**:
- Loading transitions
- Success/failure animations
- Sound effects (optional)
- Mobile optimization
- Accessibility (ARIA labels, keyboard navigation)
- Performance optimization

**Time Estimate**: 1 week

---

### Priority 4: Audio Integration

**Files**:
- `assets/audio/music/` - Period-appropriate jazz, big band
- `assets/audio/sfx/` - UI sounds, film projector, cash register
- `js/systems/audio.js` - Audio manager

**Features**:
```javascript
window.AudioSystem = (function() {
    const MUSIC_TRACKS = {
        menu: 'assets/audio/music/main_theme.mp3',
        gameplay_1933: 'assets/audio/music/jazz_1930s.mp3',
        gameplay_1940: 'assets/audio/music/big_band.mp3',
        victory: 'assets/audio/music/triumph.mp3',
        defeat: 'assets/audio/music/bankruptcy.mp3'
    };

    function playMusic(track, loop = true) {
        // Crossfade between tracks
        // Volume control
        // Mute option
    }

    function playSFX(effect) {
        // UI clicks, cash register, film projector
        // Ducking during important dialogs
    }

    return {
        playMusic,
        playSFX,
        mute,
        setVolume
    };
})();
```

**Time Estimate**: 1 week (if using royalty-free music)

---

### Priority 5: Balance & Testing

**Tasks**:
- Playtest complete game loop
- Balance cash flow and difficulty curve
- Tune event probabilities
- Fix edge cases and bugs
- Performance profiling
- Cross-browser testing

**Time Estimate**: 1 week

---

## Implementation Order

### Recommended Sprint Plan (12-15 weeks total)

**Sprint 1-2 (2 weeks)**: Phase 2 - Events & UI
- Random production events
- UI components (dashboard, modals)
- **Deliverable**: Events trigger during production

**Sprint 3 (1 week)**: Phase 2 - Integration
- Wire all Phase 2 systems together
- **Deliverable**: Playable Phase 2 demo

**Sprint 4 (1.5 weeks)**: Phase 3 - Historical Events
- Implement historical milestones
- **Deliverable**: Hays Code, WWII, HUAC events work

**Sprint 5 (1 week)**: Phase 3 - Censorship
- PCA system, script evaluation
- **Deliverable**: Films can be rejected/edited

**Sprint 6-7 (2 weeks)**: Phase 3 - Talent
- Talent database, casting system
- **Deliverable**: Hire actors/directors

**Sprint 8 (1.5 weeks)**: Phase 3 - Crisis
- Major decision points
- **Deliverable**: Scandals, HUAC investigations

**Sprint 9 (1 week)**: Phase 4 - Tutorial
- Onboarding flow
- **Deliverable**: New player experience

**Sprint 10 (4 days)**: Phase 4 - Achievements
- Achievement tracking
- **Deliverable**: Milestone notifications

**Sprint 11 (1 week)**: Phase 4 - Polish
- UI animations, transitions
- **Deliverable**: Polished experience

**Sprint 12 (1 week)**: Phase 4 - Audio (Optional)
- Music and sound effects
- **Deliverable**: Audio atmosphere

**Sprint 13 (1 week)**: Phase 4 - Balance & QA
- Final balancing, bug fixes
- **Deliverable**: Shippable game

---

## File Structure After Phase 2-4

```
hollywood-mogul-game/
├── index.html
├── package.json
├── jest.config.js
├── TESTING.md
├── PHASE-2-4-IMPLEMENTATION.md (this file)
├── css/
│   ├── main.css
│   ├── responsive.css
│   └── animations.css (new)
├── js/
│   ├── core/
│   │   ├── game-state.js ✅
│   │   ├── time-system.js ✅
│   │   ├── save-load.js ✅
│   │   └── integration.js (new)
│   ├── systems/
│   │   ├── financial.js ✅
│   │   ├── production.js ✅
│   │   ├── boxoffice.js ✅
│   │   ├── events.js (new)
│   │   ├── censorship.js (new)
│   │   ├── talent.js (new)
│   │   ├── crisis.js (new)
│   │   ├── achievements.js (new)
│   │   └── audio.js (new)
│   ├── data/
│   │   ├── scripts.js ✅
│   │   ├── historical-events.js (new)
│   │   ├── talent-roster.js (new)
│   │   └── crisis-database.js (new)
│   └── ui/
│       ├── dashboard.js (new)
│       ├── modals.js (new)
│       ├── animations.js (new)
│       └── tutorial.js (new)
├── assets/
│   ├── audio/ (new)
│   │   ├── music/
│   │   └── sfx/
│   └── images/
└── tests/
    ├── setup.js ✅
    ├── game-state.test.js ✅
    ├── events.test.js (new)
    ├── censorship.test.js (new)
    ├── talent.test.js (new)
    ├── historical-events.test.js (new)
    ├── integration.test.js (new)
    └── achievements.test.js (new)
```

---

## Testing Strategy

### Test Coverage Goals

| Phase | Files | Target Coverage |
|-------|-------|----------------|
| Phase 1 | Core systems | 85%+ ✅ |
| Phase 2 | Events, UI | 75%+ |
| Phase 3 | Historical, Talent | 70%+ |
| Phase 4 | Tutorial, Achievements | 60%+ |

### Testing Approach

1. **Unit Tests**: Each new system module
2. **Integration Tests**: System interactions
3. **Manual QA**: UI/UX, game balance
4. **Playtesting**: Complete game loops

---

## Success Metrics

### Phase 2 Complete When:
- [ ] Scripts can be greenlit from UI
- [ ] Random events trigger during production
- [ ] Films complete and release to theaters
- [ ] Box office revenue flows in
- [ ] UI updates reflect all changes

### Phase 3 Complete When:
- [ ] Historical events trigger on schedule
- [ ] Hays Code restrictions enforced
- [ ] Talent can be hired and cast
- [ ] Crises present meaningful choices
- [ ] HUAC investigations affect gameplay

### Phase 4 Complete When:
- [ ] Tutorial guides new players
- [ ] Achievements unlock and display
- [ ] UI polished and responsive
- [ ] Audio enhances atmosphere (optional)
- [ ] Game is balanced and bug-free

---

## Next Steps

1. **Review this document** with stakeholders
2. **Prioritize features** - what must ship vs nice-to-have
3. **Set sprint schedule** - 2-week iterations recommended
4. **Start with Sprint 1** - Random events system
5. **Write tests first** for each new system (TDD)
6. **Iterate and playtest** frequently

---

## Resources Needed

- **Development Time**: 12-15 weeks for 1 developer
- **Art Assets**: Art Deco UI elements (if enhancing)
- **Audio Assets**: Period music and SFX (optional)
- **QA Testing**: 1-2 playtesters for balance
- **Historical Research**: Accuracy checking

---

**Document Version**: 1.0
**Last Updated**: 2025-10-12
**Status**: Ready for implementation
