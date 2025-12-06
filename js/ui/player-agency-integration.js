/**
 * HOLLYWOOD MOGUL - PLAYER AGENCY INTEGRATION
 * Integrates difficulty, scenarios, and custom game systems with the main game
 */

window.PlayerAgencyIntegration = (function() {
    'use strict';

    /**
     * Initialize player agency systems
     */
    function init() {
        console.log('Initializing Player Agency systems...');

        // Initialize difficulty system
        if (window.DifficultySystem) {
            window.DifficultySystem.reset();
        }

        // Initialize scenario system
        if (window.ScenarioSystem) {
            window.ScenarioSystem.reset();
        }

        // Set up UI event listeners
        setupEventListeners();

        console.log('Player Agency systems initialized');
    }

    /**
     * Set up event listeners for player agency features
     */
    function setupEventListeners() {
        // New Game button - show custom game modal
        const newGameBtn = document.getElementById('btn-new-game');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                if (window.CustomGameUI) {
                    window.CustomGameUI.showNewGameModal();
                }
            });
        }

        // Add difficulty indicator to header
        addDifficultyIndicator();
    }

    /**
     * Add difficulty indicator to game header
     */
    function addDifficultyIndicator() {
        const header = document.querySelector('.game-header');
        if (!header || document.getElementById('difficulty-indicator')) return;

        const difficultyDiv = document.createElement('div');
        difficultyDiv.id = 'difficulty-indicator';
        difficultyDiv.className = 'difficulty-indicator';

        header.appendChild(difficultyDiv);

        updateDifficultyIndicator();
    }

    /**
     * Update difficulty indicator in header
     */
    function updateDifficultyIndicator() {
        const indicator = document.getElementById('difficulty-indicator');
        if (!indicator || !window.DifficultySystem) return;

        const diffInfo = window.DifficultySystem.getDifficultyDisplayInfo();

        indicator.innerHTML = `
            <span class="difficulty-label">Difficulty:</span>
            <span class="difficulty-name" style="color: ${diffInfo.color}">${diffInfo.name}</span>
            ${diffInfo.locked ? '<span class="difficulty-locked">🔒</span>' : ''}
        `;

        indicator.title = diffInfo.description;
    }

    /**
     * Start new game with scenario
     */
    function startNewGameWithScenario(scenarioId, difficultyId) {
        // Set difficulty
        if (window.DifficultySystem && difficultyId) {
            window.DifficultySystem.setDifficulty(difficultyId);
        }

        // Load scenario
        const result = window.ScenarioSystem.loadScenario(scenarioId);

        if (!result.success) {
            console.error('Failed to load scenario:', result.message);
            return false;
        }

        // Apply difficulty modifiers to game constants
        let gameConstants = window.HollywoodMogul.CONSTANTS;
        if (window.DifficultySystem) {
            gameConstants = window.DifficultySystem.applyDifficulty(gameConstants);
        }

        // Initialize game with scenario state
        const gameState = result.initialState;

        // Apply modified constants
        gameState.cash = gameConstants.STARTING_CASH;
        gameState.monthlyBurn = gameConstants.BASE_MONTHLY_BURN;

        // Lock difficulty after game starts
        if (window.DifficultySystem) {
            window.DifficultySystem.lockDifficulty();
        }

        // Update UI
        updateDifficultyIndicator();
        updateScenarioIndicator(result.scenario);

        // Start the game
        if (window.HollywoodMogul && window.HollywoodMogul.startNewGame) {
            // Override the standard startNewGame with scenario data
            overrideGameStateWithScenario(gameState);
        }

        console.log('Game started with scenario:', result.scenario.name);
        return true;
    }

    /**
     * Override game state with scenario data
     */
    function overrideGameStateWithScenario(scenarioState) {
        // This function would integrate with HollywoodMogul.startNewGame
        // For now, we'll add a hook to the game state
        if (window.HollywoodMogul) {
            const originalStartNewGame = window.HollywoodMogul.startNewGame;

            window.HollywoodMogul.startNewGame = function(customState) {
                if (customState) {
                    // Merge custom state with default
                    const gameState = originalStartNewGame.call(this);
                    Object.assign(gameState, customState);
                    return gameState;
                } else {
                    return originalStartNewGame.call(this);
                }
            };
        }
    }

    /**
     * Add scenario indicator to UI
     */
    function updateScenarioIndicator(scenario) {
        const header = document.querySelector('.game-header');
        if (!header) return;

        let indicator = document.getElementById('scenario-indicator');

        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'scenario-indicator';
            indicator.className = 'scenario-indicator';
            header.appendChild(indicator);
        }

        indicator.innerHTML = `
            <span class="scenario-label">Scenario:</span>
            <span class="scenario-name">${scenario.name}</span>
            ${scenario.isCustom ? '<span class="custom-badge">Custom</span>' : ''}
        `;

        indicator.title = scenario.description;
    }

    /**
     * Check victory conditions during gameplay
     */
    function checkVictoryConditions(gameState) {
        if (!window.ScenarioSystem) return null;

        const result = window.ScenarioSystem.checkVictoryConditions(gameState);

        if (result.achieved) {
            showVictoryModal(result);
        }

        return result;
    }

    /**
     * Show victory modal
     */
    function showVictoryModal(victoryResult) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal victory-modal">
                <div class="modal-header">
                    <h2>VICTORY!</h2>
                </div>
                <div class="modal-content">
                    <h3>Scenario Complete: ${victoryResult.scenarioName}</h3>
                    <p>Congratulations! You have achieved all victory conditions!</p>

                    <div class="victory-conditions">
                        <h4>Conditions Met:</h4>
                        <ul>
                            ${victoryResult.conditions.map(cond => `
                                <li class="${cond.achieved ? 'achieved' : 'not-achieved'}">
                                    ${cond.achieved ? '✓' : '✗'} ${cond.name}
                                    ${cond.current !== undefined ? `(${cond.current}/${cond.target})` : ''}
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <div class="modal-actions">
                        <button class="continue-btn cta-button">Continue Playing</button>
                        <button class="new-game-btn">Start New Game</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.continue-btn').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.new-game-btn').addEventListener('click', () => {
            modal.remove();
            if (window.CustomGameUI) {
                window.CustomGameUI.showNewGameModal();
            }
        });
    }

    /**
     * Apply difficulty modifier to game mechanic value
     */
    function applyDifficultyModifier(value, modifierType) {
        if (!window.DifficultySystem) return value;

        return window.DifficultySystem.applyModifier(value, modifierType);
    }

    /**
     * Get special rules for current scenario
     */
    function getSpecialRules() {
        const scenario = window.ScenarioSystem.getCurrentScenario();
        return scenario ? scenario.specialRules : {};
    }

    /**
     * Check if special rule is active
     */
    function isSpecialRuleActive(ruleName) {
        const rules = getSpecialRules();
        return rules[ruleName] === true;
    }

    /**
     * Save game with difficulty and scenario data
     */
    function enhancedSaveGame(gameState) {
        // Add difficulty and scenario data to save
        const enhancedState = {
            ...gameState,
            difficulty: window.DifficultySystem ? window.DifficultySystem.serialize() : null,
            scenario: window.ScenarioSystem ? window.ScenarioSystem.getCurrentScenario() : null
        };

        return enhancedState;
    }

    /**
     * Load game with difficulty and scenario data
     */
    function enhancedLoadGame(saveData) {
        // Restore difficulty settings
        if (saveData.difficulty && window.DifficultySystem) {
            window.DifficultySystem.deserialize(saveData.difficulty);
        }

        // Restore scenario
        if (saveData.scenario && window.ScenarioSystem) {
            // Scenario is already in the save data
            console.log('Loaded scenario:', saveData.scenario.name);
        }

        // Update UI
        updateDifficultyIndicator();
        if (saveData.scenario) {
            updateScenarioIndicator(saveData.scenario);
        }
    }

    /**
     * Export game configuration (difficulty + scenario)
     */
    function exportGameConfiguration() {
        const config = {
            game: 'Hollywood Mogul',
            version: '1.0',
            type: 'configuration',
            exportDate: new Date().toISOString(),
            difficulty: window.DifficultySystem ? window.DifficultySystem.serialize() : null,
            scenario: window.ScenarioSystem ? window.ScenarioSystem.getCurrentScenario() : null
        };

        const jsonString = JSON.stringify(config, null, 2);

        // Download as file
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'hollywood-mogul-config.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Public API
     */
    return {
        // Initialization
        init,

        // Game start
        startNewGameWithScenario,

        // Victory conditions
        checkVictoryConditions,

        // Modifiers
        applyDifficultyModifier,
        getSpecialRules,
        isSpecialRuleActive,

        // Save/Load enhancement
        enhancedSaveGame,
        enhancedLoadGame,

        // Export
        exportGameConfiguration,

        // UI updates
        updateDifficultyIndicator,
        updateScenarioIndicator
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.PlayerAgencyIntegration.init();
    });
} else {
    window.PlayerAgencyIntegration.init();
}
