/**
 * DASHBOARD TALENT MANAGEMENT FUNCTIONS
 * Add these functions to DashboardUI
 */

// Insert this content at the end of dashboard.js, before the return statement

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
    const talentTypeUpper = contract.talentType.toUpperCase();

    return `
        <div class="talent-card contract-card">
            <div class="talent-header">
                <h4 class="talent-name">${contract.name}</h4>
                <span class="talent-type">${talentTypeUpper}</span>
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
                    <span class="stat-label">Annual Cost:</span>
                    <span class="stat-value">$${annualCost.toLocaleString()}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Contract Expires:</span>
                    <span class="stat-value">${contract.yearsRemaining} year${contract.yearsRemaining !== 1 ? 's' : ''}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Films Completed:</span>
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

    // Filter out those already under contract
    const contractedIds = (gameState.contractPlayers || []).map(c => c.talentId);
    const availableActors = actors.filter(a => !contractedIds.includes(a.id));
    const availableDirectors = directors.filter(d => !contractedIds.includes(d.id));

    const allTalent = [
        ...availableActors.map(a => ({ ...a, type: 'actor' })),
        ...availableDirectors.map(d => ({ ...d, type: 'director' }))
    ];

    // Sort by star power
    allTalent.sort((a, b) => (b.starPower || b.talent) - (a.starPower || a.talent));

    container.innerHTML = allTalent.map(talent => createAvailableTalentCard(talent, gameState)).join('');

    // Add filter handlers
    setupTalentFilters(allTalent, gameState);
}

/**
 * Create available talent card
 */
function createAvailableTalentCard(talent, gameState) {
    const power = talent.starPower || talent.talent;
    const powerClass = power >= 85 ? 'a-list' : power >= 70 ? 'b-list' : 'supporting';
    const annualCost = talent.weeklyRate * 52;
    const contractCost = annualCost + Math.floor(annualCost * 0.25); // Plus 25% signing bonus
    const talentTypeUpper = talent.type.toUpperCase();

    const oscarBadge = talent.oscarWinner ? `
        <div class="stat-row">
            <span class="stat-label oscar-badge">&#x1F3C6; Oscar Winner</span>
        </div>
    ` : '';

    const scandalRow = talent.scandalRisk ? `
        <div class="stat-row">
            <span class="stat-label">Scandal Risk:</span>
            <span class="stat-value risk-${talent.scandalRisk > 10 ? 'high' : 'low'}">${talent.scandalRisk}/100</span>
        </div>
    ` : '';

    const chemistryRow = talent.chemistry ? `
        <div class="stat-row">
            <span class="stat-label">Chemistry:</span>
            <span class="stat-value">${talent.chemistry}/100</span>
        </div>
    ` : '';

    return `
        <div class="talent-card available-card ${powerClass}" data-type="${talent.type}">
            <div class="talent-header">
                <h4 class="talent-name">${talent.name}</h4>
                <span class="talent-type">${talentTypeUpper}</span>
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
                ${scandalRow}
                ${chemistryRow}
                ${oscarBadge}
            </div>
            <div class="talent-genres">
                ${(talent.genres || talent.specialties || []).map(g => `<span class="genre-badge">${g}</span>`).join('')}
            </div>
            <div class="contract-options">
                <button class="contract-btn action-btn primary" onclick="DashboardUI.signTalent('${talent.id}', '${talent.type}', 3)">
                    SIGN 3-YEAR ($${(contractCost * 3).toLocaleString()})
                </button>
                <button class="contract-btn action-btn secondary" onclick="DashboardUI.signTalent('${talent.id}', '${talent.type}', 1)">
                    SIGN 1-YEAR ($${contractCost.toLocaleString()})
                </button>
            </div>
        </div>
    `;
}

/**
 * Setup talent filters
 */
function setupTalentFilters(allTalent, gameState) {
    const filterBtns = document.querySelectorAll('.talent-filters .filter-btn');
    const talentCards = document.querySelectorAll('.available-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            talentCards.forEach(card => {
                const type = card.dataset.type;
                const isAList = card.classList.contains('a-list');

                let show = true;

                if (filter === 'actor' && type !== 'actor') show = false;
                if (filter === 'director' && type !== 'director') show = false;
                if (filter === 'a-list' && !isAList) show = false;

                card.style.display = show ? 'block' : 'none';
            });
        });
    });
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

    // Confirm release
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

// Export these functions by adding them to the return statement:
// updateTalentSection, signTalent, releaseContract
