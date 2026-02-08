# Studio Lot Management System - Complete Documentation

## Overview

The Studio Lot Management System is a comprehensive addition to the Hollywood Mogul game that allows players to purchase and manage studio facilities, including sound stages, backlots, and special facilities. Each facility provides unique benefits and carries monthly maintenance costs.

## Files Created

### 1. Core System
- **`/js/systems/studio-lot.js`** - Main system logic
  - Facility management (purchase, ownership tracking)
  - Production bonuses and modifiers
  - Monthly maintenance processing
  - Requirements checking

### 2. UI Components
- **`/js/ui/studio-ui-helpers.js`** - UI rendering and interaction
  - Facility display cards
  - Purchase confirmation modals
  - Event handlers

### 3. Styling
- **`/css/studio-lot.css`** - Complete styling for the studio lot interface
  - Facility cards
  - Purchase modals
  - Responsive design

### 4. Integration Points
- **`index.html`** - Added script and CSS tags
- **`js/core/game-state.js`** - Integrated studio lot into game state
- **`js/ui/dashboard.js`** - Updated `updateStudioSection()` to use new system

## Facilities

### Sound Stages (Production Capacity)

#### 1. Basic Sound Stage
- **Cost:** $50,000
- **Maintenance:** $2,000/month
- **Benefits:**
  - Allows 1 concurrent production
  - No speed bonus
  - No quality bonus

#### 2. Professional Sound Stage
- **Cost:** $150,000
- **Maintenance:** $5,000/month
- **Requirements:** Reputation 50, 2 films produced
- **Benefits:**
  - Allows 2 concurrent productions
  - 10% faster production speed
  - +3 quality bonus

#### 3. Grand Sound Stage
- **Cost:** $350,000
- **Maintenance:** $10,000/month
- **Requirements:** Reputation 70, 5 films produced, $400,000 cash reserve
- **Benefits:**
  - Allows 3 concurrent productions
  - 20% faster production speed
  - +7 quality bonus

### Backlots (Genre-Specific Cost Reduction)

#### 1. Western Town
- **Cost:** $75,000
- **Maintenance:** $1,500/month
- **Benefits:**
  - 15% cost reduction for Western films
  - +5 quality bonus for Westerns

#### 2. New York Streets
- **Cost:** $100,000
- **Maintenance:** $2,000/month
- **Requirements:** Reputation 45
- **Benefits:**
  - 15% cost reduction for Crime, Gangster, and Drama films
  - +5 quality bonus

#### 3. Jungle Set
- **Cost:** $125,000
- **Maintenance:** $2,500/month
- **Requirements:** Reputation 50
- **Benefits:**
  - 15% cost reduction for Adventure and Jungle films
  - +5 quality bonus

#### 4. European Village
- **Cost:** $150,000
- **Maintenance:** $3,000/month
- **Requirements:** Reputation 55, 3 films produced
- **Benefits:**
  - 15% cost reduction for War, Romance, and Drama films
  - +5 quality bonus

### Special Facilities

#### 1. Technicolor Lab
- **Cost:** $200,000
- **Maintenance:** $5,000/month
- **Requirements:** Year 1935+, Reputation 60, $250,000 cash reserve
- **Benefits:**
  - Enables color films
  - 20% higher revenue for all films
  - +10 prestige bonus

#### 2. Recording Studio
- **Cost:** $100,000
- **Maintenance:** $3,000/month
- **Requirements:** Year 1930+, Reputation 40
- **Benefits:**
  - +5 sound quality bonus
  - +10 bonus for musical films
  - +5 overall quality bonus

#### 3. Costume Department
- **Cost:** $75,000
- **Maintenance:** $2,500/month
- **Requirements:** Reputation 45
- **Benefits:**
  - 20% faster pre-production
  - +10 bonus for period films
  - +3 quality bonus

#### 4. Screening Room
- **Cost:** $50,000
- **Maintenance:** $1,000/month
- **Requirements:** Reputation 35
- **Benefits:**
  - Enables test screenings
  - Quality insight before release
  - +5 reputation bonus

## Game Integration

### Production System Integration

The Studio Lot System provides several hooks that can be used by the production system:

```javascript
// Get cost modifier for a film based on genre and owned backlots
const costModifier = window.StudioLotSystem.getProductionCostModifier(film, gameState);
const adjustedCost = baseCost * costModifier;

// Get quality bonus from all studio facilities
const qualityBonus = window.StudioLotSystem.getQualityBonus(film, gameState);
film.quality += qualityBonus;

// Get revenue multiplier (from Technicolor Lab, etc.)
const revenueMultiplier = window.StudioLotSystem.getRevenueBonus(film, gameState);
const finalRevenue = baseRevenue * revenueMultiplier;

// Get production speed bonus
const speedBonus = window.StudioLotSystem.getProductionSpeedBonus(gameState);

// Check if can start another production
if (window.StudioLotSystem.canStartNewProduction(gameState)) {
    // Start new film
}
```

### Monthly Processing

The system automatically handles monthly maintenance costs:

```javascript
// In game-state.js - calculateMonthlyBurn()
if (gameState.studioLot && gameState.studioLot.totalMaintenanceCost) {
    burn += gameState.studioLot.totalMaintenanceCost;
}
```

### Game State Structure

```javascript
gameState.studioLot = {
    soundStages: [
        {
            id: 'basic_stage',
            name: 'Basic Sound Stage',
            purchaseDate: Date,
            maintenanceCost: 2000,
            benefits: { ... }
        }
    ],
    backlots: [ ... ],
    specialFacilities: [ ... ],
    totalMaintenanceCost: 0,
    maxConcurrentProductions: 1
}
```

## Public API

### Window.StudioLotSystem

#### Initialization
```javascript
initializeStudioLot(gameState)
```

#### Purchase Functions
```javascript
purchaseSoundStage(stageKey, gameState) // Returns {success, message, facility}
purchaseBacklot(backlotKey, gameState)
purchaseSpecialFacility(facilityKey, gameState)
```

#### Query Functions
```javascript
getAvailableFacilities(gameState) // Returns {soundStages, backlots, specialFacilities}
getOwnedFacilities(gameState)
canStartNewProduction(gameState) // Returns boolean
getMaxConcurrentProductions(gameState) // Returns number
```

#### Production Bonuses
```javascript
getProductionCostModifier(film, gameState) // Returns multiplier (0.0 - 1.0)
getQualityBonus(film, gameState) // Returns number
getRevenueBonus(film, gameState) // Returns multiplier (1.0+)
getProductionSpeedBonus(gameState) // Returns percentage (0-20)
```

#### Monthly Processing
```javascript
processMonthlyMaintenance(gameState) // Returns total maintenance cost
```

## UI Flow

1. **Navigate to Studio Section**
   - Click "STUDIO" button in navigation
   - `updateStudioSection()` is called

2. **View Facilities**
   - Owned facilities displayed at top
   - Available facilities grouped by category
   - Each card shows:
     - Name and cost
     - Description
     - Benefits list
     - Monthly maintenance
     - Requirements (if any)
     - Purchase button

3. **Purchase Flow**
   - Click "PURCHASE" button on facility card
   - Confirmation modal appears showing:
     - Cost breakdown
     - Current cash
     - Cash after purchase
   - Click "Confirm Purchase"
   - Purchase processed
   - Notification shown
   - UI refreshed to show new facility

## Strategic Gameplay

### Early Game (1933-1935)
- Start with Basic Sound Stage if you can afford it ($50,000)
- Consider Western Town backlot if making westerns ($75,000)
- Save cash for productions

### Mid Game (1936-1940)
- Upgrade to Professional Sound Stage for 2 concurrent productions
- Add genre-specific backlots based on your film strategy
- Consider Recording Studio for sound quality
- Technicolor Lab becomes available in 1935 - game-changing investment

### Late Game (1941-1949)
- Grand Sound Stage for 3 concurrent productions
- Complete backlot collection for maximum flexibility
- All special facilities for maximum bonuses
- Manage high maintenance costs ($25,000+/month)

## Balance Considerations

### Monthly Maintenance Costs
- Basic setup: ~$5,000/month
- Mid-level studio: ~$15,000/month
- Fully upgraded: ~$30,000/month

### Return on Investment
- Cost reduction backlots: 15% savings per applicable film
- Quality bonuses: Direct improvement to box office
- Production speed: More films per year
- Concurrent productions: Dramatically increases output

### Risk vs Reward
- High upfront costs can strain cash flow
- Monthly maintenance adds to burn rate
- Benefits compound over multiple productions
- Strategic purchases based on film portfolio

## Future Enhancement Opportunities

1. **Facility Upgrades**
   - Upgrade existing facilities instead of buying new ones
   - Progressive enhancement system

2. **Lot Customization**
   - Visual representation of studio lot
   - Drag-and-drop facility placement
   - 3D or isometric view

3. **Special Events**
   - Studio tour revenue
   - Facility damage from disasters
   - Union strikes affecting facilities

4. **Advanced Features**
   - Rent facilities to other studios
   - Temporary facilities for specific productions
   - Historical facility expansions (MGM, Warner Bros style)

5. **Integration Depth**
   - Talent attraction based on facilities
   - Script requirements (needs Technicolor, etc.)
   - Censorship board influenced by screening room

## Testing Checklist

- [ ] All facilities can be purchased when requirements met
- [ ] Purchase blocked when requirements not met
- [ ] Monthly maintenance costs calculated correctly
- [ ] Quality bonuses apply to relevant films
- [ ] Cost reductions apply to appropriate genres
- [ ] Revenue bonuses multiply correctly
- [ ] Concurrent production limits enforced
- [ ] UI updates after purchase
- [ ] Owned facilities persist in game state
- [ ] Modal confirmations work correctly

## Credits

Created for Hollywood Mogul - Golden Age Tycoon Game
Complete studio management simulation for the 1933-1949 era
