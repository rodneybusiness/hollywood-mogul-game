/**
 * HOLLYWOOD MOGUL - CUSTOM GAME SETUP UI
 * Handles new game setup with difficulty, scenarios, and customization
 */

window.CustomGameUI = (function() {
    'use strict';

    /**
     * Show new game setup modal
     */
    function showNewGameModal() {
        const modal = createNewGameModal();
        document.body.appendChild(modal);

        // Initialize event listeners
        initializeEventListeners(modal);

        // Load default scenario
        selectScenario('fresh-start');
    }

    /**
     * Create new game modal
     */
    function createNewGameModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'new-game-modal';
        modal.innerHTML = `
            <div class="modal new-game-modal">
                <div class="modal-header">
                    <h2>NEW GAME</h2>
                    <button class="modal-close" id="close-new-game">×</button>
                </div>
                <div class="modal-content">
                    <div class="new-game-layout">
                        <!-- Left side: Scenario Selection -->
                        <div class="scenario-section">
                            <h3>Choose Your Scenario</h3>
                            <div class="scenario-tabs">
                                <button class="scenario-tab active" data-tab="presets">Preset Scenarios</button>
                                <button class="scenario-tab" data-tab="custom">Custom Scenarios</button>
                                <button class="scenario-tab" data-tab="community">Community Scenarios</button>
                            </div>
                            <div class="scenario-list" id="scenario-list">
                                <!-- Populated by JS -->
                            </div>
                        </div>

                        <!-- Right side: Configuration -->
                        <div class="config-section">
                            <div class="scenario-preview" id="scenario-preview">
                                <h3>Scenario Details</h3>
                                <p class="scenario-description">Select a scenario to see details...</p>
                            </div>

                            <div class="difficulty-section">
                                <h3>Difficulty Level</h3>
                                <div class="difficulty-options" id="difficulty-options">
                                    <!-- Populated by JS -->
                                </div>
                            </div>

                            <div class="customization-section">
                                <button class="customize-btn" id="toggle-custom-options">
                                    Advanced Customization
                                </button>
                                <div class="custom-options hidden" id="custom-options">
                                    <!-- Populated by JS -->
                                </div>
                            </div>

                            <div class="start-game-section">
                                <button class="start-game-btn cta-button" id="start-game-btn">
                                    START GAME
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return modal;
    }

    /**
     * Initialize event listeners for new game modal
     */
    function initializeEventListeners(modal) {
        // Close button
        modal.querySelector('#close-new-game').addEventListener('click', () => {
            closeNewGameModal();
        });

        // Tab switching
        modal.querySelectorAll('.scenario-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                switchScenarioTab(e.target.dataset.tab);
            });
        });

        // Toggle custom options
        modal.querySelector('#toggle-custom-options').addEventListener('click', () => {
            toggleCustomOptions();
        });

        // Start game button
        modal.querySelector('#start-game-btn').addEventListener('click', () => {
            startCustomGame();
        });

        // Populate initial content
        populateScenarioList('presets');
        populateDifficultyOptions();
        populateCustomOptions();
    }

    /**
     * Populate scenario list
     */
    function populateScenarioList(tab) {
        const listContainer = document.getElementById('scenario-list');
        if (!listContainer) return;

        let scenarios = [];

        if (tab === 'presets') {
            scenarios = window.ScenarioSystem.getPresetScenarios();
        } else if (tab === 'custom') {
            scenarios = window.ScenarioSystem.getCustomScenarios();
        } else if (tab === 'community') {
            scenarios = window.ScenarioSystem.getCustomScenarios().filter(s => s.community);
        }

        if (scenarios.length === 0) {
            listContainer.innerHTML = `
                <div class="no-scenarios">
                    <p>${tab === 'custom' || tab === 'community' ?
                        'No custom scenarios yet. Create one using Advanced Customization!' :
                        'No scenarios available'}</p>
                    ${tab === 'community' ? '<button class="import-scenario-btn" id="import-scenario-btn">Import Scenario</button>' : ''}
                </div>
            `;

            // Add import button listener if present
            const importBtn = listContainer.querySelector('#import-scenario-btn');
            if (importBtn) {
                importBtn.addEventListener('click', showImportScenarioModal);
            }

            return;
        }

        listContainer.innerHTML = scenarios.map(scenario => createScenarioCard(scenario)).join('');

        // Add click listeners
        listContainer.querySelectorAll('.scenario-card').forEach(card => {
            card.addEventListener('click', (e) => {
                selectScenario(e.currentTarget.dataset.scenarioId);
            });
        });
    }

    /**
     * Create scenario card HTML
     */
    function createScenarioCard(scenario) {
        const difficultyClass = scenario.difficulty || 'golden-age';

        return `
            <div class="scenario-card" data-scenario-id="${scenario.id}">
                <div class="scenario-card-header">
                    <h4 class="scenario-name">${scenario.name}</h4>
                    ${scenario.isCustom ? '<span class="custom-badge">Custom</span>' : ''}
                </div>
                <div class="scenario-card-body">
                    <p class="scenario-summary">${scenario.description.substring(0, 100)}...</p>
                    <div class="scenario-meta">
                        <span class="scenario-year">${scenario.startYear}</span>
                        <span class="scenario-difficulty difficulty-${difficultyClass}">${formatDifficulty(scenario.difficulty)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Select a scenario
     */
    function selectScenario(scenarioId) {
        // Highlight selected card
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.scenarioId === scenarioId) {
                card.classList.add('selected');
            }
        });

        // Load scenario details
        const scenario = window.ScenarioSystem.getScenario(scenarioId);
        if (scenario) {
            displayScenarioPreview(scenario);
            selectDifficulty(scenario.difficulty || 'golden-age');
        }

        // Store selected scenario
        const modal = document.getElementById('new-game-modal');
        if (modal) {
            modal.dataset.selectedScenario = scenarioId;
        }
    }

    /**
     * Display scenario preview
     */
    function displayScenarioPreview(scenario) {
        const preview = document.getElementById('scenario-preview');
        if (!preview) return;

        preview.innerHTML = `
            <h3>${scenario.name}</h3>
            <p class="scenario-description">${scenario.description}</p>

            <div class="scenario-stats">
                <div class="stat-item">
                    <span class="stat-label">Start Year:</span>
                    <span class="stat-value">${scenario.startYear}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Starting Cash:</span>
                    <span class="stat-value">$${scenario.startCash.toLocaleString()}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Reputation:</span>
                    <span class="stat-value">${scenario.startReputation}/100</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Sound Stages:</span>
                    <span class="stat-value">${scenario.soundStages}</span>
                </div>
            </div>

            ${scenario.specialRules && Object.keys(scenario.specialRules).length > 0 ? `
                <div class="special-rules">
                    <h4>Special Rules:</h4>
                    <ul>
                        ${Object.keys(scenario.specialRules).map(rule =>
                            `<li>${formatSpecialRule(rule)}</li>`
                        ).join('')}
                    </ul>
                </div>
            ` : ''}

            ${scenario.victoryConditions && Object.keys(scenario.victoryConditions).length > 0 ? `
                <div class="victory-conditions">
                    <h4>Victory Conditions:</h4>
                    <ul>
                        ${formatVictoryConditions(scenario.victoryConditions)}
                    </ul>
                </div>
            ` : ''}

            ${scenario.isCustom ? `
                <div class="scenario-actions">
                    <button class="export-scenario-btn" data-scenario-id="${scenario.id}">Export</button>
                    <button class="delete-scenario-btn" data-scenario-id="${scenario.id}">Delete</button>
                </div>
            ` : ''}
        `;

        // Add action button listeners
        const exportBtn = preview.querySelector('.export-scenario-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                exportScenario(e.target.dataset.scenarioId);
            });
        }

        const deleteBtn = preview.querySelector('.delete-scenario-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteScenario(e.target.dataset.scenarioId);
            });
        }
    }

    /**
     * Populate difficulty options
     */
    function populateDifficultyOptions() {
        const container = document.getElementById('difficulty-options');
        if (!container) return;

        const difficulties = window.DifficultySystem.getDifficultyLevels();

        container.innerHTML = difficulties.map(diff => `
            <div class="difficulty-option" data-difficulty="${diff.id}">
                <div class="difficulty-header">
                    <h4 class="difficulty-name" style="color: ${diff.color}">${diff.name}</h4>
                </div>
                <p class="difficulty-description">${diff.description}</p>
                <div class="difficulty-modifiers">
                    <small>Starting Cash: ${formatModifier(diff.modifiers.startingCashMultiplier)}</small>
                    <small>Monthly Burn: ${formatModifier(diff.modifiers.burnRateMultiplier)}</small>
                </div>
            </div>
        `).join('');

        // Add click listeners
        container.querySelectorAll('.difficulty-option').forEach(option => {
            option.addEventListener('click', (e) => {
                selectDifficulty(e.currentTarget.dataset.difficulty);
            });
        });
    }

    /**
     * Select difficulty
     */
    function selectDifficulty(difficultyId) {
        // Highlight selected difficulty
        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.difficulty === difficultyId) {
                option.classList.add('selected');
            }
        });

        // Store selected difficulty
        const modal = document.getElementById('new-game-modal');
        if (modal) {
            modal.dataset.selectedDifficulty = difficultyId;
        }
    }

    /**
     * Populate custom options
     */
    function populateCustomOptions() {
        const container = document.getElementById('custom-options');
        if (!container) return;

        container.innerHTML = `
            <div class="custom-option">
                <label>Starting Year (1933-1947)</label>
                <input type="range" id="custom-year" min="1933" max="1947" value="1933" step="1">
                <span class="range-value" id="year-value">1933</span>
            </div>

            <div class="custom-option">
                <label>Starting Cash ($50k - $1M)</label>
                <input type="range" id="custom-cash" min="50000" max="1000000" value="410000" step="10000">
                <span class="range-value" id="cash-value">$410,000</span>
            </div>

            <div class="custom-option">
                <label>Starting Reputation (0-100)</label>
                <input type="range" id="custom-reputation" min="0" max="100" value="50" step="5">
                <span class="range-value" id="reputation-value">50</span>
            </div>

            <div class="custom-option">
                <label>Sound Stages</label>
                <input type="number" id="custom-soundstages" min="1" max="5" value="1">
            </div>

            <div class="custom-option">
                <label>Historical Events</label>
                <div class="event-toggles" id="event-toggles">
                    <label><input type="checkbox" value="wwii" checked> World War II Events</label>
                    <label><input type="checkbox" value="hays-code" checked> Hays Code Events</label>
                    <label><input type="checkbox" value="huac" checked> HUAC Events</label>
                    <label><input type="checkbox" value="technical" checked> Technical Innovations</label>
                </div>
            </div>

            <div class="custom-option">
                <label>Scenario Name</label>
                <input type="text" id="custom-scenario-name" placeholder="My Custom Scenario" maxlength="50">
            </div>

            <div class="custom-actions">
                <button class="save-scenario-btn" id="save-scenario-btn">Save as Custom Scenario</button>
            </div>
        `;

        // Add range input listeners
        const yearInput = container.querySelector('#custom-year');
        const yearValue = container.querySelector('#year-value');
        yearInput.addEventListener('input', (e) => {
            yearValue.textContent = e.target.value;
        });

        const cashInput = container.querySelector('#custom-cash');
        const cashValue = container.querySelector('#cash-value');
        cashInput.addEventListener('input', (e) => {
            cashValue.textContent = '$' + parseInt(e.target.value).toLocaleString();
        });

        const repInput = container.querySelector('#custom-reputation');
        const repValue = container.querySelector('#reputation-value');
        repInput.addEventListener('input', (e) => {
            repValue.textContent = e.target.value;
        });

        // Save scenario button
        container.querySelector('#save-scenario-btn').addEventListener('click', saveCustomScenario);
    }

    /**
     * Toggle custom options
     */
    function toggleCustomOptions() {
        const customOptions = document.getElementById('custom-options');
        const toggleBtn = document.getElementById('toggle-custom-options');

        if (customOptions.classList.contains('hidden')) {
            customOptions.classList.remove('hidden');
            toggleBtn.textContent = 'Hide Customization';
        } else {
            customOptions.classList.add('hidden');
            toggleBtn.textContent = 'Advanced Customization';
        }
    }

    /**
     * Switch scenario tab
     */
    function switchScenarioTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.scenario-tab').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
            }
        });

        // Populate scenario list for this tab
        populateScenarioList(tab);
    }

    /**
     * Create custom game from settings
     */
    function createCustomGame(options) {
        const customScenario = {
            id: 'custom-' + Date.now(),
            name: options.name || 'Custom Game',
            description: 'Custom game configuration',
            startYear: options.startYear || 1933,
            startMonth: 1,
            startCash: options.startCash || 410000,
            startReputation: options.startReputation || 50,
            soundStages: options.soundStages || 1,
            backlots: {
                western: false,
                nyc: false,
                jungle: false
            },
            activeEvents: options.enabledEvents || [],
            specialRules: {
                customGame: true
            },
            victoryConditions: {
                surviveUntil: 1949
            },
            difficulty: options.difficulty || 'golden-age',
            isCustom: true,
            isPreset: false
        };

        return customScenario;
    }

    /**
     * Save custom scenario
     */
    function saveCustomScenario() {
        const name = document.getElementById('custom-scenario-name').value.trim() || 'Custom Scenario';
        const year = parseInt(document.getElementById('custom-year').value);
        const cash = parseInt(document.getElementById('custom-cash').value);
        const reputation = parseInt(document.getElementById('custom-reputation').value);
        const soundStages = parseInt(document.getElementById('custom-soundstages').value);

        // Get enabled events
        const eventToggles = document.querySelectorAll('#event-toggles input[type="checkbox"]:checked');
        const enabledEvents = Array.from(eventToggles).map(cb => cb.value);

        const scenario = createCustomGame({
            name: name,
            startYear: year,
            startCash: cash,
            startReputation: reputation,
            soundStages: soundStages,
            enabledEvents: enabledEvents,
            difficulty: document.getElementById('new-game-modal').dataset.selectedDifficulty || 'golden-age'
        });

        scenario.description = `Custom scenario starting in ${year} with $${cash.toLocaleString()}`;

        const result = window.ScenarioSystem.saveCustomScenario(scenario);

        if (result.success) {
            alert('Scenario saved! You can find it in the Custom Scenarios tab.');
            switchScenarioTab('custom');
        } else {
            alert('Failed to save scenario: ' + result.message);
        }
    }

    /**
     * Start custom game
     */
    function startCustomGame() {
        const modal = document.getElementById('new-game-modal');
        const scenarioId = modal.dataset.selectedScenario;
        const difficultyId = modal.dataset.selectedDifficulty;

        if (!scenarioId) {
            alert('Please select a scenario');
            return;
        }

        // Check if using custom options
        const customOptions = document.getElementById('custom-options');
        let scenario;

        if (!customOptions.classList.contains('hidden')) {
            // Using custom settings - create custom game
            const year = parseInt(document.getElementById('custom-year').value);
            const cash = parseInt(document.getElementById('custom-cash').value);
            const reputation = parseInt(document.getElementById('custom-reputation').value);
            const soundStages = parseInt(document.getElementById('custom-soundstages').value);

            const eventToggles = document.querySelectorAll('#event-toggles input[type="checkbox"]:checked');
            const enabledEvents = Array.from(eventToggles).map(cb => cb.value);

            scenario = createCustomGame({
                name: 'Custom Game',
                startYear: year,
                startCash: cash,
                startReputation: reputation,
                soundStages: soundStages,
                enabledEvents: enabledEvents,
                difficulty: difficultyId || 'golden-age'
            });
        } else {
            // Using selected scenario
            scenario = window.ScenarioSystem.getScenario(scenarioId);

            // Override difficulty if different from scenario default
            if (difficultyId && difficultyId !== scenario.difficulty) {
                scenario = { ...scenario, difficulty: difficultyId };
            }
        }

        // Load the scenario
        const result = window.ScenarioSystem.loadScenario(scenario.id || 'custom-temp');

        if (result.success || scenario.id === undefined) {
            // Close modal
            closeNewGameModal();

            // Start the game with the scenario
            if (window.HollywoodMogul && window.HollywoodMogul.startNewGame) {
                window.HollywoodMogul.startNewGame(result.initialState || scenario);
            }

            console.log('Starting custom game with scenario:', scenario.name);
        } else {
            alert('Failed to load scenario: ' + result.message);
        }
    }

    /**
     * Export scenario
     */
    function exportScenario(scenarioId) {
        const result = window.ScenarioSystem.exportScenario(scenarioId);

        if (result.success) {
            // Download as file
            const blob = new Blob([result.jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `hollywood-mogul-scenario-${result.scenario.name.replace(/[^a-z0-9]/gi, '_')}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            alert('Scenario exported successfully!');
        } else {
            alert('Failed to export scenario: ' + result.message);
        }
    }

    /**
     * Delete scenario
     */
    function deleteScenario(scenarioId) {
        if (!confirm('Are you sure you want to delete this scenario?')) {
            return;
        }

        const result = window.ScenarioSystem.deleteCustomScenario(scenarioId);

        if (result.success) {
            alert('Scenario deleted');
            switchScenarioTab('custom');
        } else {
            alert('Failed to delete scenario: ' + result.message);
        }
    }

    /**
     * Show import scenario modal
     */
    function showImportScenarioModal() {
        const importModal = document.createElement('div');
        importModal.className = 'modal-overlay';
        importModal.innerHTML = `
            <div class="modal import-modal">
                <div class="modal-header">
                    <h3>Import Scenario</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-content">
                    <p>Paste the scenario JSON below or select a file:</p>
                    <div class="import-options">
                        <textarea id="import-json" rows="10" placeholder="Paste scenario JSON here..."></textarea>
                        <div class="file-upload">
                            <input type="file" id="import-file" accept=".json">
                            <label for="import-file">Or choose a file</label>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="import-btn cta-button">Import</button>
                        <button class="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(importModal);

        // Event listeners
        importModal.querySelector('.modal-close').addEventListener('click', () => {
            importModal.remove();
        });

        importModal.querySelector('.cancel-btn').addEventListener('click', () => {
            importModal.remove();
        });

        importModal.querySelector('#import-file').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.getElementById('import-json').value = event.target.result;
                };
                reader.readAsText(file);
            }
        });

        importModal.querySelector('.import-btn').addEventListener('click', () => {
            const jsonString = document.getElementById('import-json').value.trim();

            if (!jsonString) {
                alert('Please paste JSON or select a file');
                return;
            }

            const result = window.ScenarioSystem.importScenario(jsonString);

            if (result.success) {
                alert('Scenario imported successfully!');
                importModal.remove();
                switchScenarioTab('custom');
            } else {
                alert('Failed to import scenario: ' + result.message);
            }
        });
    }

    /**
     * Close new game modal
     */
    function closeNewGameModal() {
        const modal = document.getElementById('new-game-modal');
        if (modal) {
            modal.remove();
        }
    }

    // Helper functions
    function formatDifficulty(difficulty) {
        const names = {
            'mogul': 'Easy',
            'golden-age': 'Normal',
            'depression-era': 'Hard'
        };
        return names[difficulty] || difficulty;
    }

    function formatModifier(value) {
        if (value === 1.0) return 'Standard';
        if (value > 1.0) return `+${Math.round((value - 1.0) * 100)}%`;
        return `-${Math.round((1.0 - value) * 100)}%`;
    }

    function formatSpecialRule(rule) {
        return rule.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    function formatVictoryConditions(conditions) {
        const items = [];

        if (conditions.surviveUntil) {
            items.push(`<li>Survive until ${conditions.surviveUntil}</li>`);
        }
        if (conditions.minimumFilms) {
            items.push(`<li>Produce at least ${conditions.minimumFilms} films</li>`);
        }
        if (conditions.minimumCash) {
            items.push(`<li>Accumulate $${conditions.minimumCash.toLocaleString()}</li>`);
        }
        if (conditions.patrioticFilmsRequired) {
            items.push(`<li>Produce ${conditions.patrioticFilmsRequired} patriotic films</li>`);
        }
        if (conditions.maxCensorshipViolations) {
            items.push(`<li>No more than ${conditions.maxCensorshipViolations} censorship violations</li>`);
        }

        return items.join('');
    }

    /**
     * Public API
     */
    return {
        showNewGameModal,
        closeNewGameModal,
        showImportScenarioModal
    };
})();
