# Hollywood Mogul - Player Agency Features (Chain E)

## Overview

Chain E implements four major features that give players greater control over their game experience:

1. **Difficulty Settings** - Three difficulty levels with different modifiers
2. **Scenario Selector** - Five preset scenarios with unique challenges
3. **Custom Game Setup** - Advanced customization options
4. **Scenario Import/Export** - Share and import custom scenarios

## Feature 1: Difficulty Settings

### File: `/js/systems/difficulty.js`

Three difficulty levels are available:

#### 1. Mogul (Easy)
- **Starting Cash**: +50% ($615,000)
- **Monthly Burn**: -20% (saves money)
- **Event Frequency**: -30% (fewer crises)
- **Revenue**: +20% (higher box office)
- **Script Quality**: +5 bonus

**Best for**: First-time players learning the game

#### 2. Golden Age (Normal)
- **All modifiers**: 1.0x (standard gameplay)
- **No bonuses or penalties**

**Best for**: Standard Hollywood experience

#### 3. Depression Era (Hard)
- **Starting Cash**: -30% ($287,000)
- **Monthly Burn**: +20% (higher expenses)
- **Event Frequency**: +30% (more challenges)
- **Revenue**: -15% (lower box office)
- **Script Quality**: -5 penalty

**Best for**: Experienced players seeking a challenge

### Key Functions

```javascript
// Set difficulty before starting game
DifficultySystem.setDifficulty('mogul');

// Apply modifiers to game constants
const modifiedConstants = DifficultySystem.applyDifficulty(GAME_CONSTANTS);

// Lock difficulty when game starts (prevents changing mid-game)
DifficultySystem.lockDifficulty();

// Apply modifier to specific value
const modifiedRevenue = DifficultySystem.applyModifier(baseRevenue, 'revenueMultiplier');
```

### Integration

The difficulty system:
- Modifies `STARTING_CASH` and `BASE_MONTHLY_BURN` in game constants
- Locks automatically when game starts
- Displays in game header
- Saves with game state

## Feature 2: Scenario Selector

### File: `/js/systems/scenarios.js`

Five preset scenarios offer unique starting conditions and challenges:

### Scenario 1: Fresh Start (1933)
**The Standard Experience**
- Start Year: 1933 (beginning of Golden Age)
- Starting Cash: $410,000
- Reputation: 50
- Sound Stages: 1
- Difficulty: Golden Age
- Victory: Survive until 1949

**Special Rules**:
- Tutorial mode enabled
- Standard progression

### Scenario 2: War Bonds Blitz (1941)
**World War II Era**
- Start Year: 1941 (December - Pearl Harbor)
- Starting Cash: $500,000
- Reputation: 60
- Sound Stages: 2
- Backlots: Western, NYC

**Special Rules**:
- Government contracts available
- Patriotic film bonus: +50% revenue
- Strict censorship
- Material shortages

**Victory Conditions**:
- Survive until 1949
- Produce at least 5 films
- Produce 3 patriotic films
- Maintain $300,000+ cash

### Scenario 3: Hays Code Crackdown (1934)
**Censorship Challenge**
- Start Year: 1934 (July - Hays Code enforcement)
- Starting Cash: $350,000
- Reputation: 45
- Difficulty: Depression Era

**Special Rules**:
- Strict censorship (double penalties)
- Morality bonus for clean content
- Increased scandal risk

**Victory Conditions**:
- Survive until 1949
- Produce 10 films
- Accumulate $500,000
- Max 3 censorship violations

### Scenario 4: HUAC Witch Hunt (1947)
**Political Pressure**
- Start Year: 1947 (October - HUAC hearings)
- Starting Cash: $600,000
- Reputation: 70
- Sound Stages: 3
- All backlots unlocked

**Special Rules**:
- Political pressure events
- Talent loss risk
- Loyalty tests
- Volatile public opinion

**Victory Conditions**:
- Survive until 1949
- Produce 8 films
- Protect 5 talent members
- Lose no more than 2 to blacklist

### Scenario 5: From Nothing (1933)
**Survival Mode**
- Start Year: 1933
- Starting Cash: $100,000 (minimal)
- Reputation: 30
- Difficulty: Depression Era

**Special Rules**:
- No loan access
- Limited script selection
- High risk, high reward
- True survival challenge

**Victory Conditions**:
- Survive until 1949
- Produce 20 films
- Accumulate $1,000,000
- No bankruptcies

### Key Functions

```javascript
// Get all scenarios
const scenarios = ScenarioSystem.getAllScenarios();

// Load specific scenario
const result = ScenarioSystem.loadScenario('war-bonds-blitz');

// Get current scenario
const current = ScenarioSystem.getCurrentScenario();

// Check victory conditions
const victory = ScenarioSystem.checkVictoryConditions(gameState);
if (victory.achieved) {
    // Player won!
}
```

## Feature 3: Custom Game Setup

### File: `/js/ui/custom-game.js`

Advanced customization allows players to create their own scenarios:

### Customizable Options

1. **Starting Year**: 1933-1947 (slider)
2. **Starting Cash**: $50,000 - $1,000,000 (slider)
3. **Starting Reputation**: 0-100 (slider)
4. **Sound Stages**: 1-5 (number input)
5. **Historical Events**: Toggle specific event types
   - World War II Events
   - Hays Code Events
   - HUAC Events
   - Technical Innovations

### Custom Scenario Creation

```javascript
// Show new game modal
CustomGameUI.showNewGameModal();

// Create custom configuration
const customScenario = {
    name: "My Custom Challenge",
    startYear: 1940,
    startCash: 250000,
    startReputation: 40,
    soundStages: 2,
    enabledEvents: ['wwii', 'technical'],
    difficulty: 'depression-era'
};

// Save as reusable scenario
ScenarioSystem.saveCustomScenario(customScenario);
```

### Custom Game Flags

Custom games are marked as "Custom" and:
- Still earn achievements
- Save normally
- Can be exported/shared
- Display custom badge in UI

## Feature 4: Scenario Import/Export

### Export Functionality

Export any scenario (preset or custom) as a JSON file:

```javascript
// Export scenario
const result = ScenarioSystem.exportScenario('my-custom-scenario');

// Result includes JSON string ready for download
// File format: hollywood-mogul-scenario-[name].json
```

### Export File Format

```json
{
  "game": "Hollywood Mogul",
  "version": "1.0",
  "type": "scenario",
  "exportDate": "2025-12-06T12:00:00.000Z",
  "scenario": {
    "id": "custom-12345",
    "name": "My Custom Scenario",
    "description": "A unique challenge...",
    "startYear": 1940,
    "startCash": 300000,
    "startReputation": 55,
    "soundStages": 2,
    "backlots": {
      "western": true,
      "nyc": false,
      "jungle": false
    },
    "specialRules": {},
    "victoryConditions": {},
    "difficulty": "golden-age",
    "isCustom": true
  }
}
```

### Import Functionality

Import scenarios from JSON files or text:

```javascript
// Import from JSON string
const result = ScenarioSystem.importScenario(jsonString);

// Or use UI
CustomGameUI.showImportScenarioModal();
```

### Validation & Security

All imported scenarios are:
- **Validated**: Required fields checked
- **Sanitized**: XSS prevention, value clamping
- **Limited**: String lengths, array sizes restricted
- **Safe**: No code execution, pure data

### Validation Rules

- **Name**: Required, max 100 characters
- **Description**: Required, max 500 characters
- **Start Year**: 1933-1949
- **Start Cash**: $0 - $10,000,000
- **Reputation**: 0-100
- **Sound Stages**: 1-10
- **Events**: Max 10 active events

## Integration with Existing Systems

### Save/Load System

Difficulty and scenario data automatically saved:

```javascript
// Enhanced save includes:
{
    ...gameState,
    difficulty: {
        currentDifficulty: 'mogul',
        difficultyLocked: true
    },
    scenario: {
        id: 'war-bonds-blitz',
        name: 'War Bonds Blitz',
        // ... full scenario data
    }
}
```

### UI Integration

The system adds:
- **New Game Modal**: Full scenario/difficulty selector
- **Difficulty Indicator**: Shows in game header
- **Scenario Indicator**: Displays current scenario
- **Victory Modal**: Appears when conditions met

### Game State Integration

```javascript
// Initialize player agency systems
PlayerAgencyIntegration.init();

// Start game with scenario
PlayerAgencyIntegration.startNewGameWithScenario('fresh-start', 'mogul');

// Apply difficulty to game mechanics
const modifiedValue = PlayerAgencyIntegration.applyDifficultyModifier(
    baseValue,
    'revenueMultiplier'
);

// Check special rules
if (PlayerAgencyIntegration.isSpecialRuleActive('governmentContracts')) {
    // Enable government contract system
}

// Check victory during game
const victory = PlayerAgencyIntegration.checkVictoryConditions(gameState);
```

## File Structure

```
hollywood-mogul-game/
├── js/
│   ├── systems/
│   │   ├── difficulty.js          # Difficulty system
│   │   └── scenarios.js           # Scenario management
│   └── ui/
│       ├── custom-game.js         # New game UI
│       └── player-agency-integration.js  # Integration layer
└── css/
    └── player-agency.css          # All styling
```

## Usage Example

### Complete Flow

```javascript
// 1. Player opens new game modal
CustomGameUI.showNewGameModal();

// 2. Player selects scenario
// (UI handles this automatically)

// 3. Player adjusts difficulty
// (UI handles this automatically)

// 4. Optional: Player customizes settings
// (Using sliders and toggles)

// 5. Player starts game
// Integration system:
// - Loads scenario
// - Applies difficulty
// - Locks settings
// - Starts game with modified state

// 6. During gameplay:
// - Special rules apply automatically
// - Victory conditions checked each month
// - Modifiers affect all relevant calculations

// 7. Game end:
// - Victory modal if conditions met
// - Statistics show scenario completion
// - Option to export configuration
```

## Testing

### Test Difficulty Modifiers

```javascript
// Test each difficulty level
['mogul', 'golden-age', 'depression-era'].forEach(diff => {
    DifficultySystem.setDifficulty(diff);
    const constants = DifficultySystem.applyDifficulty(GAME_CONSTANTS);
    console.log(`${diff}:`, constants.STARTING_CASH);
});
```

### Test Scenario Loading

```javascript
// Test all preset scenarios
const scenarios = ScenarioSystem.getPresetScenarios();
scenarios.forEach(scenario => {
    const result = ScenarioSystem.loadScenario(scenario.id);
    console.log(`${scenario.name}:`, result.success);
});
```

### Test Import/Export

```javascript
// Create, export, import cycle
const custom = { /* custom scenario */ };
ScenarioSystem.saveCustomScenario(custom);
const exported = ScenarioSystem.exportScenario(custom.id);
const imported = ScenarioSystem.importScenario(exported.jsonString);
console.log('Import success:', imported.success);
```

## Achievements Integration

Custom games still earn achievements but are marked:
- Achievement notification includes "Custom Game" badge
- Leaderboards separate standard/custom
- Scenario name shown in achievement description

## Community Features

Players can:
1. Create custom scenarios
2. Export to JSON file
3. Share files with friends
4. Import shared scenarios
5. Rate/review community scenarios (future feature)

## Performance Considerations

- Scenarios stored in localStorage (5MB limit)
- Import validation prevents malicious data
- UI optimized for 50+ custom scenarios
- Export files typically < 5KB

## Future Enhancements

Potential additions:
- Community scenario repository
- Scenario rating system
- Achievement for scenario completion
- Scenario difficulty rating
- Meta-progression unlocks
- Challenge modes
- Time-limited scenarios
- Multiplayer scenario challenges

## Troubleshooting

### Scenario won't load
- Check browser console for errors
- Verify scenario ID exists
- Clear localStorage if corrupted

### Import fails
- Validate JSON syntax
- Check file is Hollywood Mogul format
- Verify all required fields present

### Difficulty not applying
- Ensure difficulty set before game start
- Check difficulty is locked after start
- Verify modifiers in game constants

## API Reference

See individual files for complete API documentation:
- `difficulty.js` - DifficultySystem API
- `scenarios.js` - ScenarioSystem API
- `custom-game.js` - CustomGameUI API
- `player-agency-integration.js` - Integration API

## Credits

Implemented as Chain E: Player Agency
Part of Hollywood Mogul game development
Version 1.0
