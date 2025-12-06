# SCANDAL & GOSSIP COLUMN SYSTEM - INTEGRATION GUIDE

## Overview
The Scandal System brings Hollywood drama to life with 44 unique scandals, Hedda Hopper/Louella Parsons style gossip columns, and deep integration with all game systems.

## Files Created
- **`/js/systems/scandals.js`** - Complete scandal system (1,782 lines)
- **CSS added to `/css/modals-extended.css`** - Beautiful scandal styling (580+ lines)

## Features Implemented

### 1. 44 UNIQUE SCANDALS

**Romance Scandals (6):**
- Secret affairs, divorces, shotgun weddings, love triangles, age gaps, secret marriages

**Personal Scandals (7):**
- Alcohol problems, drug scandals, mental breakdowns, domestic violence, tax evasion, gambling debts, criminal pasts

**Professional Scandals (6):**
- Contract disputes, on-set tyranny, role refusal, studio feuds, outrageous demands, set walkouts

**Criminal Scandals (7):**
- Drunk driving, assault, mob connections, theft, paternity suits, fraud, morals violations

**Political Scandals (4) - Era-specific 1947+:**
- Communist associations, HUAC testimony, anti-war statements, social activism

**Historical Scandals (4) - Based on real events:**
- Arbuckle-style party tragedy
- Errol Flynn-style trial
- Ingrid Bergman-style international affair
- Frances Farmer-style institutionalization

### 2. GOSSIP COLUMN SYSTEM

**Two Gossip Columnists:**
- Hedda Hopper (catty style)
- Louella Parsons (breathless style)

**Features:**
- Period-appropriate language and locations (Ciro's, Romanoff's, Brown Derby, etc.)
- Blind items ("Which blonde bombshell...")
- Weekly gossip generation
- Scandal teasers and follow-ups

### 3. SCANDAL MECHANICS

**Dynamic Effects:**
- Immediate impacts (reputation, box office, Oscar chances)
- Ongoing weekly effects
- Resolution mechanics
- Player choice system with consequences

**Severity Levels:**
- Minor (4-8 weeks)
- Moderate (6-14 weeks)
- Major (8-20 weeks)
- Career-ending (12-60 weeks, can blacklist talent)

**Smart Requirements:**
- Talent star power thresholds
- Era-specific triggers
- Production-based scandals
- Contract-based scandals

### 4. PLAYER CHOICES

Each scandal can have multiple resolution options:
- Suppress the story (expensive, might fail)
- Distance the studio
- Exploit for publicity
- Hire PR firm
- Era-specific choices (name names, take Fifth, flee country)

### 5. INTEGRATION POINTS

**Works with existing systems:**
- Talent Management - affects contracts, loyalty, reliability
- Production System - affects films in production
- Awards System - damages Oscar chances
- Box Office - can increase OR decrease revenue
- Reputation System - major reputation impacts
- Time System - weekly updates and progression
- Newspaper System - generates headlines

## Integration Instructions

### Step 1: Include the Script
Add to your main HTML file (e.g., `index.html`):
```html
<script src="js/systems/scandals.js"></script>
```

### Step 2: Initialize System
In your game initialization code:
```javascript
// After loading game state
window.ScandalSystem.initialize(gameState);
```

### Step 3: Add to Weekly Update
In your weekly update function:
```javascript
function processWeeklyTurn() {
    // ... existing weekly code ...

    // Add scandal system update
    if (window.ScandalSystem) {
        window.ScandalSystem.processWeeklyUpdate(gameState);
    }

    // ... rest of weekly code ...
}
```

### Step 4: Box Office Integration
When calculating film revenue:
```javascript
function calculateBoxOffice(film) {
    let baseRevenue = film.baseBoxOffice;

    // Add scandal modifier
    if (window.ScandalSystem) {
        const scandalImpact = window.ScandalSystem.calculateBoxOfficeImpact(film);
        baseRevenue += (baseRevenue * (scandalImpact / 100));
    }

    return baseRevenue;
}
```

### Step 5: Oscar Integration
When calculating Oscar chances:
```javascript
function calculateOscarChances(film) {
    let oscarChance = film.oscarPotential || 50;

    // Apply scandal penalty
    if (window.ScandalSystem) {
        const scandalPenalty = window.ScandalSystem.calculateOscarImpact(film);
        oscarChance += scandalPenalty; // This will be negative
    }

    return Math.max(0, oscarChance);
}
```

### Step 6: Talent Hiring Check
When hiring talent:
```javascript
function canHireTalent(talentId, gameState) {
    // Check if blacklisted
    if (window.ScandalSystem &&
        window.ScandalSystem.isTalentBlacklisted(talentId, gameState)) {
        return {
            allowed: false,
            reason: 'This talent has been blacklisted due to scandal'
        };
    }

    return { allowed: true };
}
```

### Step 7: Dashboard Display (Optional)
Add scandal section to dashboard:
```javascript
function renderDashboard(gameState) {
    // Get active scandals
    const activeScandals = window.ScandalSystem.getActiveScandals();

    if (activeScandals.length > 0) {
        const scandalHTML = activeScandals.map(scandal => `
            <div class="active-scandal-card">
                <div class="scandal-card-header">
                    <h4 class="scandal-card-title">${scandal.name}</h4>
                    <span class="scandal-card-duration">${scandal.weeksRemaining} weeks</span>
                </div>
                <p class="scandal-card-description">${scandal.description}</p>
            </div>
        `).join('');

        // Add to dashboard
    }
}
```

### Step 8: Display Gossip Column (Optional)
```javascript
function showWeeklyGossip() {
    const gossip = window.ScandalSystem.getWeeklyGossipColumn('hedda');

    if (gossip) {
        const gossipHTML = `
            <div class="gossip-column">
                <div class="gossip-column-header">
                    <h3 class="gossip-columnist">${gossip.columnist}</h3>
                </div>
                <p class="gossip-intro">${gossip.intro}</p>
                <ul class="gossip-items">
                    ${gossip.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <p class="gossip-signoff">${gossip.signoff}</p>
            </div>
        `;

        // Display in UI
    }
}
```

## API Reference

### Core Functions

**`initialize(gameState)`**
- Initializes scandal system with game state
- Call once on game load

**`processWeeklyUpdate(gameState)`**
- Updates active scandals
- Checks for new scandals
- Generates gossip column
- Call every week

**`generateScandal(gameState)`**
- Manually trigger a scandal
- Returns scandal instance or null

**`handleScandalChoice(scandalId, choiceIndex)`**
- Process player's choice for scandal
- Automatically called by modal buttons

### Query Functions

**`getActiveScandals()`**
- Returns array of all active scandals

**`getActiveScandalsByTalent(talentId)`**
- Get scandals affecting specific talent

**`getActiveScandalsByFilm(filmId)`**
- Get scandals affecting specific film

**`getScandalHistory()`**
- Returns array of all past scandals

**`isTalentBlacklisted(talentId, gameState)`**
- Check if talent is blacklisted
- Returns boolean

### Impact Calculators

**`calculateBoxOfficeImpact(film)`**
- Returns percentage modifier for box office
- Can be positive or negative

**`calculateOscarImpact(film)`**
- Returns Oscar chance penalty
- Always negative or zero

### Display Functions

**`getWeeklyGossipColumn(columnist)`**
- Get formatted gossip column
- columnist: 'hedda' or 'louella'
- Returns object with intro, items, signoff

**`getScandalStats(gameState)`**
- Get statistics about scandals
- Returns counts by severity

## Game State Structure

The scandal system adds this to your game state:
```javascript
gameState.scandals = {
    active: [
        {
            instanceId: 'scandal_123456_789',
            id: 'secret_affair',
            name: 'Forbidden Romance',
            description: 'Clark Gable caught in affair...',
            severity: 'major',
            weeksRemaining: 12,
            affectedTalent: [...],
            effects: {...},
            // ... more properties
        }
    ],
    history: [
        {
            id: 'drunk_driving',
            name: 'Drunk Driving Arrest',
            year: 1937,
            severity: 'major',
            affectedTalent: [...]
        }
    ],
    blacklisted_talent: ['talent_id_1', 'talent_id_2']
}

gameState.gossipColumns = [
    {
        week: 45,
        items: [
            { type: 'scandal', text: '...' },
            { type: 'blind_item', text: '...' }
        ]
    }
]
```

## Scandal Probabilities

- Base weekly chance: 12%
- Modified by contract players: +2% per contract
- Modified by active films: +1% per film
- Maximum chance: 35%
- Era-specific scandals only trigger in correct years

## Historical Authenticity

**Era-Appropriate Scandals:**
- Political scandals start in 1947 (HUAC era)
- Anti-war scandals during 1941-1945
- Morals charges typical of 1930s-1940s
- Mob connection scandals post-1935

**Period Locations:**
- Ciro's, Romanoff's, Brown Derby
- Mocambo, Trocadero, Cocoanut Grove
- Garden of Allah, Chateau Marmont
- Musso & Frank, Polo Lounge

**Gossip Columnist Styles:**
- Hedda Hopper: Catty, knows everything
- Louella Parsons: Breathless, sensational

## Testing

Test scandal generation:
```javascript
// Force generate scandal
const scandal = window.ScandalSystem.generateScandal(gameState);
console.log('Generated scandal:', scandal);

// Check stats
const stats = window.ScandalSystem.getScandalStats(gameState);
console.log('Scandal stats:', stats);
```

## Performance Notes

- Scandal checks run weekly (low overhead)
- Only contract players and active film talent can be affected
- Scandal database loaded once at initialization
- No performance impact when no scandals active

## Future Enhancements

Potential additions:
- More era-specific scandals for 1950s+
- Studio-wide scandal events
- Scandal mitigation strategies
- Public apology tours
- Scandal investigation mini-game
- Paparazzi system integration

## Support

For integration issues:
1. Check browser console for errors
2. Verify gameState has correct structure
3. Ensure all required systems loaded (TalentRoster, etc.)
4. Check that weekly update is calling scandal system

---

**Created:** 2025-12-06
**System Version:** 1.0
**Total Scandals:** 44
**Lines of Code:** 1,782 (JS) + 580 (CSS)
