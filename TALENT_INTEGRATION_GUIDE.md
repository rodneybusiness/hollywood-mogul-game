# Talent Management Integration Guide

## Files Created

1. `/js/systems/talent-management.js` - Core talent management system
2. `/css/talent.css` - Talent UI styling
3. `/js/ui/dashboard-talent-addon.js` - Dashboard talent functions (need to integrate)

## Integration Steps

### 1. Update `js/ui/dashboard.js`

Add these functions BEFORE the `// Public API` comment (around line 1236):

```javascript
/**
 * Update talent section
 */
function updateTalentSection() {
    const gameState = window.HollywoodMogul.getGameState();
    if (!window.TalentManagement) return;

    updateContractPlayers(gameState);
    updateAvailableTalent(gameState);
}

/**
 * Update contract players section
 */
function updateContractPlayers(gameState) {
    const container = document.getElementById('contract-players');
    if (!container) return;

    const contractPlayers = gameState.contractPlayers || [];

    if (contractPlayers.length === 0) {
        container.innerHTML = '<div class="no-content">No talent currently under contract</div>';
        return;
    }

    container.innerHTML = contractPlayers.map(contract => createContractCard(contract)).join('');
}

/**
 * Create contract player card
 */
function createContractCard(contract) {
    const talent = contract.talentType === 'actor'
        ? window.TalentRoster.getActorById(contract.talentId)
        : window.TalentRoster.getDirectorById(contract.talentId);

    if (!talent) return '';

    const happinessColor = contract.happiness >= 75 ? 'good' : contract.happiness >= 50 ? 'medium' : 'poor';
    const annualCost = contract.weeklyRate * 52;

    return `
        <div class="talent-card contract-card">
            <div class="talent-header">
                <h4 class="talent-name">${contract.name}</h4>
                <span class="talent-type">${contract.talentType.toUpperCase()}</span>
            </div>
            <div class="talent-stats">
                <div class="stat-row">
                    <span class="stat-label">Star Power:</span>
                    <span class="stat-value">${talent.starPower || talent.talent}/100</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Happiness:</span>
                    <span class="stat-value ${happinessColor}">${contract.happiness}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Weekly Rate:</span>
                    <span class="stat-value">$${contract.weeklyRate.toLocaleString()}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Contract Expires:</span>
                    <span class="stat-value">${contract.yearsRemaining} year${contract.yearsRemaining !== 1 ? 's' : ''}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Films:</span>
                    <span class="stat-value">${contract.filmsCompleted}</span>
                </div>
            </div>
            <div class="talent-genres">
                ${(talent.genres || []).map(g => `<span class="genre-badge">${g}</span>`).join('')}
            </div>
            <button class="release-btn action-btn secondary" onclick="DashboardUI.releaseContract('${contract.talentId}')">
                RELEASE
            </button>
        </div>
    `;
}

/**
 * Update available talent section
 */
function updateAvailableTalent(gameState) {
    const container = document.getElementById('available-talent');
    if (!container) return;

    const currentYear = gameState.gameYear || new Date(gameState.currentDate).getFullYear();

    const actors = window.TalentRoster.getAvailableActors(currentYear, gameState);
    const directors = window.TalentRoster.getAvailableDirectors(currentYear, gameState);

    const contractedIds = (gameState.contractPlayers || []).map(c => c.talentId);
    const availableActors = actors.filter(a => !contractedIds.includes(a.id));
    const availableDirectors = directors.filter(d => !contractedIds.includes(d.id));

    const allTalent = [
        ...availableActors.map(a => ({ ...a, type: 'actor' })),
        ...availableDirectors.map(d => ({ ...d, type: 'director' }))
    ];

    allTalent.sort((a, b) => (b.starPower || b.talent) - (a.starPower || a.talent));

    container.innerHTML = allTalent.map(talent => createAvailableTalentCard(talent)).join('');

    setupTalentFilters();
}

/**
 * Create available talent card
 */
function createAvailableTalentCard(talent) {
    const power = talent.starPower || talent.talent;
    const powerClass = power >= 85 ? 'a-list' : power >= 70 ? 'b-list' : 'supporting';
    const annualCost = talent.weeklyRate * 52;
    const signingBonus = Math.floor(annualCost * 0.25);
    const contract1Year = annualCost + signingBonus;
    const contract3Year = (annualCost * 3) + signingBonus;

    return `
        <div class="talent-card available-card ${powerClass}" data-type="${talent.type}">
            <div class="talent-header">
                <h4 class="talent-name">${talent.name}</h4>
                <span class="talent-type">${talent.type.toUpperCase()}</span>
            </div>
            <div class="talent-description">${talent.description || ''}</div>
            <div class="talent-stats">
                <div class="stat-row">
                    <span class="stat-label">${talent.type === 'actor' ? 'Star Power' : 'Talent'}:</span>
                    <span class="stat-value">${power}/100</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Weekly Rate:</span>
                    <span class="stat-value">$${talent.weeklyRate.toLocaleString()}</span>
                </div>
                ${talent.oscarWinner ? '<div class="stat-row"><span class="oscar-badge">🏆 Oscar Winner</span></div>' : ''}
            </div>
            <div class="talent-genres">
                ${(talent.genres || talent.specialties || []).map(g => `<span class="genre-badge">${g}</span>`).join('')}
            </div>
            <div class="contract-options">
                <button class="contract-btn action-btn primary" onclick="DashboardUI.signTalent('${talent.id}', '${talent.type}', 3)">
                    SIGN 3-YEAR ($${contract3Year.toLocaleString()})
                </button>
                <button class="contract-btn action-btn secondary" onclick="DashboardUI.signTalent('${talent.id}', '${talent.type}', 1)">
                    SIGN 1-YEAR ($${contract1Year.toLocaleString()})
                </button>
            </div>
        </div>
    `;
}

/**
 * Setup talent filters
 */
function setupTalentFilters() {
    const filterBtns = document.querySelectorAll('.talent-filters .filter-btn');
    const talentCards = document.querySelectorAll('.available-card');

    filterBtns.forEach(btn => {
        btn.removeEventListener('click', handleFilterClick);
        btn.addEventListener('click', handleFilterClick);
    });

    function handleFilterClick(e) {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const filter = e.target.dataset.filter;

        talentCards.forEach(card => {
            const type = card.dataset.type;
            const isAList = card.classList.contains('a-list');

            let show = true;

            if (filter === 'actor' && type !== 'actor') show = false;
            if (filter === 'director' && type !== 'director') show = false;
            if (filter === 'a-list' && !isAList) show = false;

            card.style.display = show ? 'block' : 'none';
        });
    }
}

/**
 * Sign talent to contract (public function)
 */
function signTalent(talentId, talentType, years) {
    const gameState = window.HollywoodMogul.getGameState();
    const result = window.TalentManagement.signContract(talentId, talentType, years, gameState);

    if (result.success) {
        updateTalentSection();
        updateFinancialSummary();
        showNotification('Contract Signed!', result.message, 'success');
    } else {
        showNotification('Cannot Sign', result.message, 'error');
    }
}

/**
 * Release talent from contract (public function)
 */
function releaseContract(talentId) {
    const gameState = window.HollywoodMogul.getGameState();

    if (!confirm('Are you sure you want to release this talent? This will cost a buyout fee.')) {
        return;
    }

    const result = window.TalentManagement.releaseFromContract(talentId, gameState);

    if (result.success) {
        updateTalentSection();
        updateFinancialSummary();
        showNotification('Contract Released', result.message, 'success');
    } else {
        showNotification('Cannot Release', result.message, 'error');
    }
}
```

### 2. Update the `updateDashboard()` function

Find the function around line 94 and add the talent section update:

```javascript
function updateDashboard() {
    updateFinancialSummary();
    updateFilmsInProduction();
    updateFilmsInTheaters();
    updateAlerts();
    updateTimeDisplay();
    updateEventsLog();
    if (window.TalentManagement) {
        updateTalentSection();
    }
}
```

### 3. Update the `showSection()` function

Find around line 303 and add talent case:

```javascript
function showSection(sectionName) {
    // ... existing code ...

    // Update section content
    switch(sectionName) {
        case 'scripts':
            updateScriptsSection();
            break;
        case 'finances':
            updateFinancesSection();
            break;
        case 'studio':
            updateStudioSection();
            break;
        case 'talent':  // ADD THIS
            updateTalentSection();
            break;
        case 'achievements':
            updateAchievementsSection();
            break;
    }

    // ... rest of existing code ...
}
```

### 4. Update the Public API return statement

Find the return statement around line 1237 and add:

```javascript
return {
    init: init,
    updateDashboard: updateDashboard,
    showSection: showSection,
    showNotification: showNotification,
    updateAchievementsSection: updateAchievementsSection,
    showAchievementDetails: showAchievementDetails,
    updateTalentSection: updateTalentSection,  // ADD THIS
    signTalent: signTalent,  // ADD THIS
    releaseContract: releaseContract  // ADD THIS
};
```

## Usage

1. Navigate to the TALENT section in the game
2. Browse available actors and directors
3. Sign talent to 1-year or 3-year contracts
4. View contract players and their happiness
5. Release contracts if needed (costs buyout fee)

## Notes

- Talent under contract costs less when hired for productions
- Freelance talent costs 50% more
- Contract happiness affects performance
- Contracts expire after their term
