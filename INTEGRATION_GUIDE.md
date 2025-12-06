# Player Agency Integration Guide

## Quick Start

### Step 1: Include Files in HTML

Add these files to your `index.html` in the correct order:

```html
<!-- Core game files first -->
<script src="js/core/game-state.js"></script>
<script src="js/core/save-load.js"></script>

<!-- Player Agency systems -->
<script src="js/systems/difficulty.js"></script>
<script src="js/systems/scenarios.js"></script>

<!-- UI components -->
<script src="js/ui/modals.js"></script>
<script src="js/ui/custom-game.js"></script>
<script src="js/ui/player-agency-integration.js"></script>

<!-- CSS -->
<link rel="stylesheet" href="css/player-agency.css">
```

### Step 2: Initialize on Page Load

```javascript
// In your main initialization code
document.addEventListener('DOMContentLoaded', function() {
    // Initialize player agency systems
    if (window.PlayerAgencyIntegration) {
        window.PlayerAgencyIntegration.init();
    }

    // Your existing initialization...
    window.HollywoodMogul.init();
});
```

### Step 3: Update New Game Button

Replace or update your existing "New Game" button:

```html
<!-- Add this button to your main menu -->
<button id="btn-new-game" class="cta-button">NEW GAME</button>
```

The integration script automatically hooks this button to show the new game modal.

### Step 4: Modify Game Start Function

Update your `startNewGame()` function to accept scenario data:

```javascript
// In game-state.js
function startNewGame(scenarioState = null) {
    // If scenario state provided, use it
    if (scenarioState) {
        gameState = {
            ...gameState,
            ...scenarioState
        };
    } else {
        // Default initialization
        gameState = {
            currentDate: new Date(1933, 0, 1),
            cash: GAME_CONSTANTS.STARTING_CASH,
            // ... rest of default state
        };
    }

    // Apply difficulty modifiers
    if (window.DifficultySystem) {
        const modifiedConstants = window.DifficultySystem.applyDifficulty(GAME_CONSTANTS);
        gameState.cash = modifiedConstants.STARTING_CASH;
        gameState.monthlyBurn = modifiedConstants.BASE_MONTHLY_BURN;
    }

    // Rest of initialization...
}
```

### Step 5: Apply Difficulty Modifiers to Game Mechanics

When calculating game values, apply difficulty modifiers:

```javascript
// Example: Box office revenue calculation
function calculateBoxOfficeRevenue(baseRevenue) {
    let revenue = baseRevenue;

    // Apply quality modifiers
    revenue *= qualityMultiplier;

    // Apply difficulty modifier
    if (window.PlayerAgencyIntegration) {
        revenue = window.PlayerAgencyIntegration.applyDifficultyModifier(
            revenue,
            'revenueMultiplier'
        );
    }

    return Math.floor(revenue);
}

// Example: Event frequency
function shouldTriggerEvent() {
    let baseChance = 0.1; // 10% base chance

    // Apply difficulty modifier
    if (window.DifficultySystem) {
        const modifier = window.DifficultySystem.getModifier('eventFrequencyMultiplier');
        baseChance *= modifier;
    }

    return Math.random() < baseChance;
}
```

### Step 6: Check Special Rules

Check for scenario special rules before applying game mechanics:

```javascript
// Example: Government contracts
function checkAvailableContracts() {
    // Only available in War Bonds Blitz scenario
    if (window.PlayerAgencyIntegration &&
        window.PlayerAgencyIntegration.isSpecialRuleActive('governmentContracts')) {

        // Generate government contract opportunities
        return generateGovernmentContracts();
    }

    return [];
}

// Example: Stricter censorship
function applyCensorshipPenalty(film) {
    let penalty = baseCensorshipPenalty;

    // Double penalty in Hays Code Crackdown scenario
    if (window.PlayerAgencyIntegration &&
        window.PlayerAgencyIntegration.isSpecialRuleActive('censorshipPenaltyDouble')) {
        penalty *= 2;
    }

    return penalty;
}
```

### Step 7: Check Victory Conditions

Add victory condition checking to your monthly update:

```javascript
function processMonthlyEvents() {
    // Existing monthly processing...

    // Check victory conditions
    if (window.PlayerAgencyIntegration) {
        const victory = window.PlayerAgencyIntegration.checkVictoryConditions(gameState);

        if (victory && victory.achieved) {
            // Victory modal shown automatically
            console.log('Player achieved victory!');
        }
    }
}
```

### Step 8: Enhance Save/Load

Update save and load functions to include difficulty and scenario:

```javascript
function saveGame(slotNumber) {
    let saveData = {
        ...gameState,
        saveDate: new Date().toISOString()
    };

    // Add difficulty and scenario data
    if (window.PlayerAgencyIntegration) {
        saveData = window.PlayerAgencyIntegration.enhancedSaveGame(saveData);
    }

    // Save to localStorage
    window.SaveLoadSystem.saveGame(slotNumber, saveData);
}

function loadGame(slotNumber) {
    const result = window.SaveLoadSystem.loadGame(slotNumber);

    if (result.success) {
        gameState = result.gameState;

        // Restore difficulty and scenario
        if (window.PlayerAgencyIntegration) {
            window.PlayerAgencyIntegration.enhancedLoadGame(result.gameState);
        }

        updateUI();
    }
}
```

## Advanced Integration

### Custom Scenario Rules

Implement custom handling for special rules:

```javascript
// In your event system
function generateRandomEvent() {
    const specialRules = window.PlayerAgencyIntegration.getSpecialRules();

    // Different event pools based on scenario
    if (specialRules.governmentContracts) {
        // Include war-time events
        eventPool.push(...warTimeEvents);
    }

    if (specialRules.politicalPressure) {
        // Include HUAC events
        eventPool.push(...huacEvents);
    }

    // Select random event from pool
    return selectRandomEvent(eventPool);
}
```

### Difficulty-Based AI

Adjust AI behavior based on difficulty:

```javascript
function calculateCompetitorStrategy() {
    const difficulty = window.DifficultySystem.getCurrentDifficulty();

    switch(difficulty.id) {
        case 'mogul':
            // Less aggressive competitors
            return generateEasyCompetition();

        case 'depression-era':
            // More aggressive, smarter competitors
            return generateHardCompetition();

        default:
            return generateStandardCompetition();
    }
}
```

### Victory Progress Tracking

Show victory progress in UI:

```javascript
function updateVictoryProgress() {
    const victory = window.ScenarioSystem.checkVictoryConditions(gameState);

    if (!victory || victory.conditions.length === 0) return;

    const progressHTML = victory.conditions.map(cond => `
        <div class="victory-progress ${cond.achieved ? 'complete' : 'incomplete'}">
            <span>${cond.name}</span>
            <span>${cond.current}/${cond.target}</span>
        </div>
    `).join('');

    document.getElementById('victory-tracker').innerHTML = progressHTML;
}
```

## UI Customization

### Custom Modal Styling

Override default styles in your CSS:

```css
/* Custom modal theme */
.new-game-modal {
    background: linear-gradient(135deg, #your-color-1, #your-color-2);
}

.scenario-card {
    /* Your custom card style */
}

.difficulty-option {
    /* Your custom difficulty style */
}
```

### Custom Scenario Display

Modify how scenarios are displayed:

```javascript
// In custom-game.js, override createScenarioCard
function createScenarioCard(scenario) {
    // Your custom HTML template
    return `
        <div class="custom-scenario-card" data-scenario-id="${scenario.id}">
            <!-- Your custom layout -->
        </div>
    `;
}
```

## Testing Your Integration

### Test Checklist

- [ ] New Game modal opens correctly
- [ ] All 5 preset scenarios load
- [ ] Difficulty modifiers apply to cash and burn rate
- [ ] Custom game settings work
- [ ] Scenario export creates valid JSON
- [ ] Scenario import validates and loads
- [ ] Difficulty indicator shows in header
- [ ] Scenario indicator shows in header
- [ ] Special rules affect gameplay
- [ ] Victory conditions check correctly
- [ ] Save/load preserves difficulty and scenario
- [ ] UI is responsive on mobile

### Console Testing

```javascript
// Test in browser console

// 1. Check systems initialized
console.log('Difficulty:', window.DifficultySystem);
console.log('Scenarios:', window.ScenarioSystem);
console.log('Integration:', window.PlayerAgencyIntegration);

// 2. Test difficulty change
DifficultySystem.setDifficulty('depression-era');
console.log('Current difficulty:', DifficultySystem.getCurrentDifficulty());

// 3. Test scenario loading
const result = ScenarioSystem.loadScenario('war-bonds-blitz');
console.log('Scenario loaded:', result.success);

// 4. Test modifier application
const modded = DifficultySystem.applyModifier(100000, 'startingCashMultiplier');
console.log('Modified cash:', modded);

// 5. Test special rules
console.log('Special rules:', PlayerAgencyIntegration.getSpecialRules());
```

## Common Issues

### Issue: Modal doesn't show

**Solution**: Check that modal HTML structure exists:

```html
<!-- Add to your index.html if missing -->
<div id="modal-overlay" class="modal-overlay hidden">
    <div id="modal-content" class="modal-content"></div>
</div>
```

### Issue: Difficulty not applying

**Solution**: Ensure difficulty set BEFORE game starts:

```javascript
// Correct order:
DifficultySystem.setDifficulty('mogul');
startNewGame(); // Now difficulty applies

// Wrong order:
startNewGame();
DifficultySystem.setDifficulty('mogul'); // Too late!
```

### Issue: Scenario data not saving

**Solution**: Use enhanced save/load functions:

```javascript
// Instead of:
SaveLoadSystem.saveGame(slot, gameState);

// Use:
const enhanced = PlayerAgencyIntegration.enhancedSaveGame(gameState);
SaveLoadSystem.saveGame(slot, enhanced);
```

### Issue: Victory conditions not checking

**Solution**: Call check function in game loop:

```javascript
function monthlyUpdate() {
    // Your existing code...

    // Add this:
    PlayerAgencyIntegration.checkVictoryConditions(gameState);
}
```

## Performance Tips

1. **Cache difficulty modifiers**:
   ```javascript
   const revenueModifier = DifficultySystem.getModifier('revenueMultiplier');
   // Use cached value in calculations
   ```

2. **Lazy load scenarios**:
   ```javascript
   // Only load scenario data when needed
   const scenario = ScenarioSystem.getScenario(id);
   ```

3. **Debounce UI updates**:
   ```javascript
   // Don't update indicators every frame
   const updateIndicators = debounce(() => {
       PlayerAgencyIntegration.updateDifficultyIndicator();
   }, 100);
   ```

## Best Practices

1. **Always validate scenario data** before using
2. **Lock difficulty** immediately after game starts
3. **Check for system availability** before calling functions
4. **Provide user feedback** for all actions
5. **Test all scenarios** before release
6. **Document custom special rules** clearly
7. **Version your scenario format** for future compatibility

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all files loaded correctly
3. Test with preset scenarios first
4. Review this integration guide
5. Check PLAYER_AGENCY_FEATURES.md for detailed API docs

## Next Steps

After integration:
1. Playtest all scenarios
2. Balance difficulty modifiers
3. Add custom scenarios for your game
4. Create community sharing platform
5. Add achievements for scenario completion
6. Implement leaderboards
7. Add scenario creation tutorial
