# MOGUL - Hollywood Tycoon Game

A historically authentic Hollywood studio management game set in the golden age of cinema (1933-1949).

## Game Overview

**MOGUL** puts you in control of a Hollywood movie studio during the most tumultuous and glamorous era of film history. Navigate the transition from Pre-Code freedom to strict censorship, survive the Great Depression, adapt to wartime conditions, and face the post-war challenges that would reshape the industry forever.

### Core Gameplay

- **Studio Management**: Build sound stages, backlots, and facilities
- **Film Production**: Greenlight scripts, manage productions, handle crises
- **Financial Survival**: Balance cash flow, secure loans, maximize profits
- **Talent Management**: Sign contract players, directors, and writers
- **Historical Events**: Navigate real industry changes and challenges
- **Crisis Management**: Handle scandals, censorship, and industry pressure

### Time Period: 1933-1949

#### Era 1: Pre-Code Freedom (1933-1934)
- Few censorship restrictions
- Gangster films and racy content are profitable
- Creative experimentation flourishes

#### Era 2: Golden Age (1935-1941) 
- Hays Code enforcement creates new challenges
- Studio system reaches peak power
- Technicolor revolution begins
- Labor unions emerge

#### Era 3: War Years (1941-1945)
- Government demands propaganda films
- Talent shortages as actors are drafted
- Material rationing affects production
- Audiences seek both escapism and patriotism

#### Era 4: Post-War Anxiety (1946-1949)
- Film noir reflects cultural cynicism
- HUAC investigations threaten careers
- Television emerges as competition
- Anti-trust lawsuits challenge studio dominance

## Technical Details

### Architecture

```
/hollywood-mogul-game/
├── index.html              # Main game interface
├── css/
│   ├── main.css           # Art Deco styling & core UI
│   └── responsive.css     # Mobile & tablet adaptations
├── js/
│   ├── core/              # Core game systems
│   │   ├── game-state.js  # Central state management
│   │   ├── time-system.js # Date progression & historical periods
│   │   └── save-load.js   # Game persistence
│   ├── systems/           # Game mechanics (Phase 2)
│   │   ├── financial.js   # Banking, loans, expenses
│   │   ├── production.js  # Film production pipeline
│   │   ├── talent.js      # Actor/director management
│   │   ├── studio.js      # Facility upgrades
│   │   └── events.js      # Random events & crises
│   ├── data/              # Game content (Phase 2)
│   │   ├── scripts.js     # Available film scripts
│   │   ├── historical-events.js # Milestone events
│   │   └── talent-roster.js     # Available actors/directors
│   └── ui/                # Interface components (Phase 2)
│       ├── dashboard.js   # Main UI updates
│       ├── modals.js      # Dialog systems
│       └── animations.js  # Visual effects
└── assets/                # Images, audio (Phase 4)
```

### Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom Art Deco theme with CSS Grid/Flexbox
- **Storage**: localStorage for save/load system
- **Responsive**: Mobile-first design with progressive enhancement

### Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development Phases

### Phase 1: Foundation ✅ COMPLETED
- [x] Project structure and HTML framework
- [x] Art Deco UI styling with responsive design
- [x] Core game state management
- [x] Time progression system
- [x] Save/load architecture
- [x] Basic financial tracking

### Phase 2: Core Systems (Next)
- [ ] Film production pipeline
- [ ] Script library with 20+ diverse films
- [ ] Financial system (loans, investments)
- [ ] Box office simulation
- [ ] Random production events

### Phase 3: Historical Depth
- [ ] Era-specific content and challenges
- [ ] Historical milestone events
- [ ] Censorship and rating systems
- [ ] Talent management with personalities
- [ ] Crisis management scenarios

### Phase 4: Polish & Features
- [ ] Complete UI/UX polish
- [ ] Audio integration (period music, effects)
- [ ] Tutorial and onboarding
- [ ] Achievement system
- [ ] Balance testing and optimization

## Getting Started

### Installation

1. Clone or download the game files
2. Open `index.html` in a modern web browser
3. No additional setup required - runs entirely client-side

### First Time Playing

1. **Start with Small Budget**: You begin with $75,000 and $30,000/month expenses
2. **Review Scripts**: Click "REVIEW SCRIPTS" to see available films
3. **Watch Cash Flow**: Monitor your runway - how many weeks until bankruptcy
4. **Time Management**: Advance by week or month to progress
5. **Learn the Systems**: Each era brings new challenges and opportunities

### Controls

- **Time Advance**: Use week/month buttons to progress
- **Navigation**: Click tabs to switch between studio sections
- **Save/Load**: Use save system to preserve progress (Phase 4)
- **Mobile**: Fully responsive - plays on phones and tablets

## Game Balance

### Difficulty Curve
- **Weeks 1-8**: Tutorial phase, learn basic systems
- **Year 1-2**: Survival focus, establish studio
- **Year 3-5**: Growth phase, build reputation
- **Year 6-10**: Golden age management
- **Year 11-15**: War adaptation challenges
- **Year 16-17**: Final survival test

### Victory Conditions
- **Survive to 1949**: Basic victory, you made it through
- **Mogul Ending**: Accumulate massive wealth and influence
- **Prestige Ending**: Win multiple Oscars, artistic legacy
- **Integrity Ending**: Navigate HUAC without betraying anyone
- **Survival Ending**: Make it through with minimal compromise

### Failure States
- **Bankruptcy**: Run out of cash, can't make payroll
- **Mob Takeover**: Owe too many favors, lose control
- **HUAC Blacklist**: Political persecution ends career
- **Reputation Death**: Too many scandals, industry exile

## Historical Accuracy

The game strives for historical authenticity while remaining engaging:

- **Real Events**: Hays Code, WWII, HUAC hearings, Paramount decision
- **Period Slang**: Authentic 1930s-1940s dialogue and terminology
- **Industry Practices**: 7-year contracts, studio system, theater ownership
- **Cultural Context**: Changing audience tastes, technological advances
- **Moral Complexity**: Difficult choices without clear right answers

## Credits

- **Design & Development**: Phase 1 Implementation
- **Historical Research**: 1930s-1940s Hollywood industry practices
- **Art Direction**: Art Deco visual design inspired by period films
- **Typography**: Period-appropriate fonts and styling

---

**Current Status**: Phase 1 Complete - Foundation systems implemented and tested
**Next**: Begin Phase 2 development (Film Production & Financial Systems)