/**
 * HOLLYWOOD MOGUL - SCENARIO UI HELPERS
 * Display scenario information and victory progress
 */

window.ScenarioUI = (function() {
    'use strict';

    /**
     * Add scenario indicator to the UI
     */
    function addScenarioIndicator() {
        const gameState = window.HollywoodMogul.getGameState();

        if (!gameState.scenario) {
            return; // No scenario active
        }

        // Check if indicator already exists
        let indicator = document.getElementById('scenario-indicator');

        if (!indicator) {
            // Create indicator
            indicator = document.createElement('div');
            indicator.id = 'scenario-indicator';
            indicator.className = 'scenario-indicator';
            document.body.appendChild(indicator);
        }

        updateScenarioIndicator();
    }

    /**
     * Update scenario indicator
     */
    function updateScenarioIndicator() {
        const gameState = window.HollywoodMogul.getGameState();
        const indicator = document.getElementById('scenario-indicator');

        if (!indicator || !gameState.scenario) {
            return;
        }

        const scenario = gameState.scenario;
        const difficultyClass = window.ScenarioSystem.getDifficultyClass(scenario.difficulty);
        const difficultyText = window.ScenarioSystem.getDifficultyDisplay(scenario.difficulty);

        indicator.innerHTML = `
            <div class="scenario-name">${scenario.name}</div>
            <div class="scenario-difficulty difficulty-badge ${difficultyClass}">
                ${difficultyText}
            </div>
            <div class="scenario-objective">
                ${scenario.victoryConditions.description}
            </div>
        `;

        // Make it clickable to show full details
        indicator.style.cursor = 'pointer';
        indicator.onclick = showScenarioProgress;
    }

    /**
     * Show detailed scenario progress modal
     */
    function showScenarioProgress() {
        const gameState = window.HollywoodMogul.getGameState();

        if (!gameState.scenario) {
            return;
        }

        const scenario = gameState.scenario;
        const progress = window.ScenarioSystem.getVictoryProgress(gameState);
        const difficultyClass = window.ScenarioSystem.getDifficultyClass(scenario.difficulty);
        const difficultyText = window.ScenarioSystem.getDifficultyDisplay(scenario.difficulty);

        let html = `
            <div class="scenario-progress-modal">
                <div class="details-header">
                    <h2>${scenario.name}</h2>
                    <span class="difficulty-badge ${difficultyClass}">${difficultyText}</span>
                </div>

                <div class="scenario-objective">
                    <p><strong>Objective:</strong> ${scenario.victoryConditions.description}</p>
                </div>

                <div class="victory-progress-panel">
                    <h3>VICTORY PROGRESS</h3>
                    <div class="victory-criteria">
        `;

        // Show progress for each criterion
        if (progress) {
            if (progress.cash && progress.cash.required > 0) {
                html += `
                    <div class="criterion ${progress.cash.met ? 'met' : ''}">
                        <div class="criterion-label">Cash</div>
                        <div class="criterion-progress">
                            $${progress.cash.current.toLocaleString()} / $${progress.cash.required.toLocaleString()}
                        </div>
                        <div class="criterion-status">
                            ${progress.cash.met ? 'Complete' : 'In Progress'}
                        </div>
                    </div>
                `;
            }

            if (progress.reputation && progress.reputation.required > 0) {
                html += `
                    <div class="criterion ${progress.reputation.met ? 'met' : ''}">
                        <div class="criterion-label">Reputation</div>
                        <div class="criterion-progress">
                            ${progress.reputation.current} / ${progress.reputation.required}
                        </div>
                        <div class="criterion-status">
                            ${progress.reputation.met ? 'Complete' : 'In Progress'}
                        </div>
                    </div>
                `;
            }

            if (progress.films && progress.films.required > 0) {
                html += `
                    <div class="criterion ${progress.films.met ? 'met' : ''}">
                        <div class="criterion-label">Films Produced</div>
                        <div class="criterion-progress">
                            ${progress.films.current} / ${progress.films.required}
                        </div>
                        <div class="criterion-status">
                            ${progress.films.met ? 'Complete' : 'In Progress'}
                        </div>
                    </div>
                `;
            }

            if (progress.debtFree && scenario.victoryConditions.debtFree) {
                html += `
                    <div class="criterion ${progress.debtFree.met ? 'met' : ''}">
                        <div class="criterion-label">Debt Status</div>
                        <div class="criterion-progress">
                            $${progress.debtFree.current.toLocaleString()}
                        </div>
                        <div class="criterion-status">
                            ${progress.debtFree.met ? 'Debt Free!' : 'Debt Remaining'}
                        </div>
                    </div>
                `;
            }

            // Check for scenario-specific criteria
            if (scenario.victoryConditions.oscarWins) {
                const oscarsWon = gameState.stats.oscarsWon || 0;
                const oscarsMet = oscarsWon >= scenario.victoryConditions.oscarWins;
                html += `
                    <div class="criterion ${oscarsMet ? 'met' : ''}">
                        <div class="criterion-label">Oscar Wins</div>
                        <div class="criterion-progress">
                            ${oscarsWon} / ${scenario.victoryConditions.oscarWins}
                        </div>
                        <div class="criterion-status">
                            ${oscarsMet ? 'Complete' : 'In Progress'}
                        </div>
                    </div>
                `;
            }

            if (scenario.victoryConditions.integrityScore) {
                const integrity = gameState.integrityScore || 0;
                const integrityMet = integrity >= scenario.victoryConditions.integrityScore;
                html += `
                    <div class="criterion ${integrityMet ? 'met' : ''}">
                        <div class="criterion-label">Integrity Score</div>
                        <div class="criterion-progress">
                            ${integrity} / ${scenario.victoryConditions.integrityScore}
                        </div>
                        <div class="criterion-status">
                            ${integrityMet ? 'Complete' : 'In Progress'}
                        </div>
                    </div>
                `;
            }
        }

        html += `
                    </div>
                </div>

                ${scenario.specialRules && scenario.specialRules.length > 0 ? `
                <div class="special-rules">
                    <h3>Special Rules</h3>
                    <ul>
                        ${scenario.specialRules.map(rule => `<li>${rule}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                <div class="details-actions">
                    <button class="action-btn primary" onclick="HollywoodMogul.closeModal()">
                        CONTINUE PLAYING
                    </button>
                </div>
            </div>
        `;

        if (window.HollywoodMogul && window.HollywoodMogul.showModal) {
            window.HollywoodMogul.showModal(html);
        }
    }

    /**
     * Check and display victory notification
     */
    function checkVictoryConditions() {
        const gameState = window.HollywoodMogul.getGameState();

        if (!gameState.scenario || gameState.scenarioVictoryAchieved) {
            return;
        }

        if (window.ScenarioSystem && window.ScenarioSystem.checkVictoryConditions) {
            const victoryAchieved = window.ScenarioSystem.checkVictoryConditions(gameState);

            if (victoryAchieved) {
                gameState.scenarioVictoryAchieved = true;
                showVictoryNotification();
            }
        }
    }

    /**
     * Show scenario victory notification
     */
    function showVictoryNotification() {
        const gameState = window.HollywoodMogul.getGameState();

        if (!gameState.scenario) {
            return;
        }

        if (window.HollywoodMogul && window.HollywoodMogul.addAlert) {
            window.HollywoodMogul.addAlert({
                type: 'success',
                icon: '🏆',
                message: `SCENARIO VICTORY! You've completed "${gameState.scenario.name}"!`,
                priority: 'critical'
            });
        }

        // Show victory modal
        setTimeout(() => {
            showVictoryModal();
        }, 1000);
    }

    /**
     * Show scenario victory modal
     */
    function showVictoryModal() {
        const gameState = window.HollywoodMogul.getGameState();

        if (!gameState.scenario) {
            return;
        }

        const scenario = gameState.scenario;
        const difficultyClass = window.ScenarioSystem.getDifficultyClass(scenario.difficulty);
        const difficultyText = window.ScenarioSystem.getDifficultyDisplay(scenario.difficulty);

        let html = `
            <div class="scenario-victory-modal">
                <h1 style="font-family: var(--font-accent); color: var(--secondary-gold); text-align: center; font-size: 3rem; margin-bottom: 1rem;">
                    VICTORY!
                </h1>

                <div class="victory-content" style="text-align: center;">
                    <h2 style="color: var(--ivory); margin-bottom: 1rem;">
                        You have completed the <span style="color: var(--secondary-gold);">${scenario.name}</span> scenario!
                    </h2>

                    <div style="margin: 2rem 0;">
                        <span class="difficulty-badge ${difficultyClass}" style="font-size: 1.2rem; padding: 0.5rem 1.5rem;">
                            ${difficultyText} DIFFICULTY
                        </span>
                    </div>

                    <div class="final-stats" style="margin: 2rem 0; padding: 2rem; background: rgba(0,0,0,0.3); border-radius: 8px;">
                        <h3 style="color: var(--secondary-gold); margin-bottom: 1rem;">Final Statistics</h3>
                        <p>Cash: $${gameState.cash.toLocaleString()}</p>
                        <p>Reputation: ${gameState.reputation}/100</p>
                        <p>Films Produced: ${gameState.stats.filmsProduced}</p>
                        <p>Oscars Won: ${gameState.stats.oscarsWon}</p>
                        <p>Years Survived: ${gameState.stats.yearsSurvived.toFixed(1)}</p>
                    </div>

                    <p style="font-style: italic; color: rgba(255,255,240,0.8); margin: 2rem 0;">
                        You can continue playing to reach 2010 or start a new scenario.
                    </p>

                    <div class="details-actions" style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                        <button class="action-btn primary" onclick="HollywoodMogul.closeModal()">
                            CONTINUE PLAYING
                        </button>
                        <button class="action-btn secondary" onclick="ScenarioSystem.showScenarioSelection()">
                            NEW SCENARIO
                        </button>
                    </div>
                </div>
            </div>
        `;

        if (window.HollywoodMogul && window.HollywoodMogul.showModal) {
            window.HollywoodMogul.showModal(html);
        }
    }

    /**
     * Initialize scenario UI
     */
    function init() {
        addScenarioIndicator();
    }

    /**
     * Public API
     */
    return {
        init,
        addScenarioIndicator,
        updateScenarioIndicator,
        showScenarioProgress,
        checkVictoryConditions,
        showVictoryNotification
    };
})();
