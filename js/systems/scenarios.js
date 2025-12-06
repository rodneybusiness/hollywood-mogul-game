/**
 * HOLLYWOOD MOGUL - SCENARIO SYSTEM
 * Manages game scenarios, presets, and custom scenarios
 */

window.ScenarioSystem = (function() {
    'use strict';

    const STORAGE_KEY = 'hollywood-mogul-custom-scenarios';

    // Preset scenarios
    const PRESET_SCENARIOS = {
        'fresh-start': {
            id: 'fresh-start',
            name: 'Fresh Start',
            description: 'Begin your Hollywood journey in 1933 with standard settings. Build your empire from the ground up during the birth of the Golden Age.',
            startYear: 1933,
            startMonth: 1, // January
            startCash: 410000,
            startReputation: 50,
            soundStages: 1,
            backlots: {
                western: false,
                nyc: false,
                jungle: false
            },
            activeEvents: [],
            specialRules: {
                tutorialMode: true,
                unlockAllGenres: false
            },
            victoryConditions: {
                surviveUntil: 1949,
                minimumFilms: 0,
                minimumCash: 0
            },
            difficulty: 'golden-age',
            isPreset: true,
            isCustom: false
        },
        'war-bonds-blitz': {
            id: 'war-bonds-blitz',
            name: 'War Bonds Blitz',
            description: 'Start in 1941 during World War II. Government contracts are available for patriotic films, but censorship is strict and audiences want escapism.',
            startYear: 1941,
            startMonth: 12, // December (Pearl Harbor)
            startCash: 500000,
            startReputation: 60,
            soundStages: 2,
            backlots: {
                western: true,
                nyc: true,
                jungle: false
            },
            activeEvents: ['wwii-begins', 'war-contracts-available'],
            specialRules: {
                governmentContracts: true,
                patrioticFilmBonus: 1.5,
                censorshipStrict: true,
                materialShortages: true
            },
            victoryConditions: {
                surviveUntil: 1949,
                minimumFilms: 5,
                minimumCash: 300000,
                patrioticFilmsRequired: 3
            },
            difficulty: 'golden-age',
            isPreset: true,
            isCustom: false
        },
        'hays-code-crackdown': {
            id: 'hays-code-crackdown',
            name: 'Hays Code Crackdown',
            description: 'Begin in 1934 when the Production Code Administration is enforced. Navigate strict censorship while keeping audiences entertained.',
            startYear: 1934,
            startMonth: 7, // July (Hays Code enforcement begins)
            startCash: 350000,
            startReputation: 45,
            soundStages: 1,
            backlots: {
                western: false,
                nyc: false,
                jungle: false
            },
            activeEvents: ['hays-code-enforcement'],
            specialRules: {
                strictCensorship: true,
                censorshipPenaltyDouble: true,
                moralityBonus: true,
                scandalRiskIncreased: true
            },
            victoryConditions: {
                surviveUntil: 1949,
                minimumFilms: 10,
                minimumCash: 500000,
                maxCensorshipViolations: 3
            },
            difficulty: 'depression-era',
            isPreset: true,
            isCustom: false
        },
        'huac-witch-hunt': {
            id: 'huac-witch-hunt',
            name: 'HUAC Witch Hunt',
            description: 'Start in 1947 during the Hollywood blacklist era. Protect your talent from political persecution while maintaining studio profits.',
            startYear: 1947,
            startMonth: 10, // October (HUAC hearings begin)
            startCash: 600000,
            startReputation: 70,
            soundStages: 3,
            backlots: {
                western: true,
                nyc: true,
                jungle: true
            },
            activeEvents: ['huac-hearings', 'blacklist-threat'],
            specialRules: {
                politicalPressure: true,
                talentLossRisk: true,
                loyaltyTestsEnabled: true,
                publicOpinionVolatile: true
            },
            victoryConditions: {
                surviveUntil: 1949,
                minimumFilms: 8,
                minimumCash: 400000,
                protectedTalent: 5,
                maxTalentLost: 2
            },
            difficulty: 'depression-era',
            isPreset: true,
            isCustom: false
        },
        'from-nothing': {
            id: 'from-nothing',
            name: 'From Nothing',
            description: 'Start in 1933 with minimal resources. True survival mode - every decision matters. Can you build an empire from pocket change?',
            startYear: 1933,
            startMonth: 1, // January
            startCash: 100000,
            startReputation: 30,
            soundStages: 1,
            backlots: {
                western: false,
                nyc: false,
                jungle: false
            },
            activeEvents: [],
            specialRules: {
                survivalMode: true,
                noLoanAccess: true,
                limitedScripts: true,
                highRiskHighReward: true
            },
            victoryConditions: {
                surviveUntil: 1949,
                minimumFilms: 20,
                minimumCash: 1000000,
                noBankruptcies: true
            },
            difficulty: 'depression-era',
            isPreset: true,
            isCustom: false
        }
    };

    // Current loaded scenario
    let currentScenario = null;

    /**
     * Get all preset scenarios
     */
    function getPresetScenarios() {
        return Object.values(PRESET_SCENARIOS);
    }

    /**
     * Get scenario by ID
     */
    function getScenario(scenarioId) {
        // Check presets first
        if (PRESET_SCENARIOS[scenarioId]) {
            return { ...PRESET_SCENARIOS[scenarioId] };
        }

        // Check custom scenarios
        const customScenarios = getCustomScenarios();
        const custom = customScenarios.find(s => s.id === scenarioId);
        if (custom) {
            return { ...custom };
        }

        return null;
    }

    /**
     * Load scenario and return initial game state
     */
    function loadScenario(scenarioId) {
        const scenario = getScenario(scenarioId);

        if (!scenario) {
            console.error('Scenario not found:', scenarioId);
            return {
                success: false,
                message: 'Scenario not found'
            };
        }

        currentScenario = scenario;

        // Create initial game state from scenario
        const initialState = {
            currentDate: new Date(scenario.startYear, scenario.startMonth - 1, 1),
            gameWeek: 1,
            gameYear: scenario.startYear,

            cash: scenario.startCash,
            monthlyBurn: 30000, // Will be calculated based on assets
            totalRevenue: 0,
            totalExpenses: 0,

            studioName: "Mogul Pictures",
            reputation: scenario.startReputation,

            activeFilms: [],
            completedFilms: [],
            contractPlayers: [],
            availableScripts: [],
            currentEvents: [],

            soundStages: scenario.soundStages || 1,
            backlots: { ...scenario.backlots },

            gameStarted: true,
            gameEnded: false,
            endingType: null,

            stats: {
                filmsProduced: 0,
                oscarsWon: 0,
                boxOfficeTotal: 0,
                scandalsHandled: 0,
                yearsSurvived: 0
            },

            // Scenario metadata
            scenario: {
                id: scenario.id,
                name: scenario.name,
                isCustom: scenario.isCustom || false,
                difficulty: scenario.difficulty,
                specialRules: { ...scenario.specialRules },
                victoryConditions: { ...scenario.victoryConditions },
                activeEvents: [...scenario.activeEvents]
            }
        };

        // Set difficulty level
        if (window.DifficultySystem && scenario.difficulty) {
            window.DifficultySystem.setDifficulty(scenario.difficulty);
        }

        console.log('Scenario loaded:', scenario.name, initialState);

        return {
            success: true,
            message: `Loaded scenario: ${scenario.name}`,
            scenario: scenario,
            initialState: initialState
        };
    }

    /**
     * Get current scenario
     */
    function getCurrentScenario() {
        return currentScenario ? { ...currentScenario } : null;
    }

    /**
     * Get custom scenarios from localStorage
     */
    function getCustomScenarios() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load custom scenarios:', error);
            return [];
        }
    }

    /**
     * Get all scenarios (preset + custom)
     */
    function getAllScenarios() {
        const presets = getPresetScenarios();
        const customs = getCustomScenarios();
        return [...presets, ...customs];
    }

    /**
     * Save custom scenario
     */
    function saveCustomScenario(scenario) {
        try {
            // Validate scenario
            const validation = validateScenario(scenario);
            if (!validation.valid) {
                return {
                    success: false,
                    message: validation.errors.join(', ')
                };
            }

            // Mark as custom
            scenario.isCustom = true;
            scenario.isPreset = false;

            // Generate ID if not provided
            if (!scenario.id) {
                scenario.id = 'custom-' + Date.now();
            }

            // Get existing custom scenarios
            const customs = getCustomScenarios();

            // Check if scenario with this ID already exists
            const existingIndex = customs.findIndex(s => s.id === scenario.id);

            if (existingIndex >= 0) {
                // Update existing
                customs[existingIndex] = scenario;
            } else {
                // Add new
                customs.push(scenario);
            }

            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(customs));

            console.log('Custom scenario saved:', scenario.name);

            return {
                success: true,
                message: `Scenario "${scenario.name}" saved`,
                scenario: scenario
            };

        } catch (error) {
            console.error('Failed to save custom scenario:', error);
            return {
                success: false,
                message: 'Failed to save scenario: ' + error.message
            };
        }
    }

    /**
     * Delete custom scenario
     */
    function deleteCustomScenario(scenarioId) {
        try {
            const customs = getCustomScenarios();
            const filtered = customs.filter(s => s.id !== scenarioId);

            if (filtered.length === customs.length) {
                return {
                    success: false,
                    message: 'Scenario not found'
                };
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

            return {
                success: true,
                message: 'Scenario deleted'
            };

        } catch (error) {
            console.error('Failed to delete custom scenario:', error);
            return {
                success: false,
                message: 'Failed to delete scenario: ' + error.message
            };
        }
    }

    /**
     * Export scenario as JSON string
     */
    function exportScenario(scenarioId) {
        const scenario = getScenario(scenarioId);

        if (!scenario) {
            return {
                success: false,
                message: 'Scenario not found'
            };
        }

        const exportData = {
            game: 'Hollywood Mogul',
            version: '1.0',
            type: 'scenario',
            exportDate: new Date().toISOString(),
            scenario: scenario
        };

        try {
            const jsonString = JSON.stringify(exportData, null, 2);

            return {
                success: true,
                message: 'Scenario exported',
                jsonString: jsonString,
                scenario: scenario
            };

        } catch (error) {
            console.error('Failed to export scenario:', error);
            return {
                success: false,
                message: 'Failed to export scenario: ' + error.message
            };
        }
    }

    /**
     * Import scenario from JSON string
     */
    function importScenario(jsonString) {
        try {
            // Parse JSON
            const importData = JSON.parse(jsonString);

            // Validate import data
            if (!importData.game || importData.game !== 'Hollywood Mogul') {
                return {
                    success: false,
                    message: 'Invalid scenario file - not a Hollywood Mogul scenario'
                };
            }

            if (!importData.scenario) {
                return {
                    success: false,
                    message: 'No scenario data found in file'
                };
            }

            const scenario = importData.scenario;

            // Validate scenario structure
            const validation = validateScenario(scenario);
            if (!validation.valid) {
                return {
                    success: false,
                    message: 'Invalid scenario: ' + validation.errors.join(', ')
                };
            }

            // Sanitize scenario data
            const sanitized = sanitizeScenario(scenario);

            // Generate new ID to avoid conflicts
            sanitized.id = 'imported-' + Date.now();
            sanitized.isCustom = true;
            sanitized.isPreset = false;

            // Save as custom scenario
            const saveResult = saveCustomScenario(sanitized);

            if (saveResult.success) {
                return {
                    success: true,
                    message: `Scenario "${sanitized.name}" imported successfully`,
                    scenario: sanitized
                };
            } else {
                return saveResult;
            }

        } catch (error) {
            console.error('Failed to import scenario:', error);
            return {
                success: false,
                message: 'Failed to import scenario: ' + error.message
            };
        }
    }

    /**
     * Validate scenario structure
     */
    function validateScenario(scenario) {
        const errors = [];

        // Required fields
        if (!scenario.name || typeof scenario.name !== 'string') {
            errors.push('Scenario name is required');
        }

        if (!scenario.description || typeof scenario.description !== 'string') {
            errors.push('Scenario description is required');
        }

        if (typeof scenario.startYear !== 'number' || scenario.startYear < 1933 || scenario.startYear > 1949) {
            errors.push('Start year must be between 1933 and 1949');
        }

        if (typeof scenario.startCash !== 'number' || scenario.startCash < 0) {
            errors.push('Start cash must be a positive number');
        }

        if (typeof scenario.startReputation !== 'number' || scenario.startReputation < 0 || scenario.startReputation > 100) {
            errors.push('Start reputation must be between 0 and 100');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Sanitize scenario data to prevent XSS and invalid data
     */
    function sanitizeScenario(scenario) {
        // Create clean copy
        const sanitized = {
            id: scenario.id,
            name: String(scenario.name).substring(0, 100), // Limit length
            description: String(scenario.description).substring(0, 500),

            startYear: Math.max(1933, Math.min(1949, parseInt(scenario.startYear) || 1933)),
            startMonth: Math.max(1, Math.min(12, parseInt(scenario.startMonth) || 1)),
            startCash: Math.max(0, Math.min(10000000, parseInt(scenario.startCash) || 410000)),
            startReputation: Math.max(0, Math.min(100, parseInt(scenario.startReputation) || 50)),

            soundStages: Math.max(1, Math.min(10, parseInt(scenario.soundStages) || 1)),
            backlots: {
                western: Boolean(scenario.backlots?.western),
                nyc: Boolean(scenario.backlots?.nyc),
                jungle: Boolean(scenario.backlots?.jungle)
            },

            activeEvents: Array.isArray(scenario.activeEvents) ? scenario.activeEvents.slice(0, 10) : [],
            specialRules: typeof scenario.specialRules === 'object' ? scenario.specialRules : {},
            victoryConditions: typeof scenario.victoryConditions === 'object' ? scenario.victoryConditions : {},

            difficulty: scenario.difficulty || 'golden-age',
            isCustom: true,
            isPreset: false
        };

        return sanitized;
    }

    /**
     * Check victory conditions
     */
    function checkVictoryConditions(gameState) {
        if (!currentScenario || !currentScenario.victoryConditions) {
            return { achieved: false, conditions: [] };
        }

        const conditions = currentScenario.victoryConditions;
        const results = [];

        // Check survival time
        if (conditions.surviveUntil) {
            const achieved = gameState.gameYear >= conditions.surviveUntil;
            results.push({
                name: `Survive until ${conditions.surviveUntil}`,
                achieved: achieved,
                current: gameState.gameYear,
                target: conditions.surviveUntil
            });
        }

        // Check minimum films
        if (conditions.minimumFilms) {
            const achieved = gameState.stats.filmsProduced >= conditions.minimumFilms;
            results.push({
                name: `Produce ${conditions.minimumFilms} films`,
                achieved: achieved,
                current: gameState.stats.filmsProduced,
                target: conditions.minimumFilms
            });
        }

        // Check minimum cash
        if (conditions.minimumCash) {
            const achieved = gameState.cash >= conditions.minimumCash;
            results.push({
                name: `Accumulate $${conditions.minimumCash.toLocaleString()}`,
                achieved: achieved,
                current: gameState.cash,
                target: conditions.minimumCash
            });
        }

        // All conditions achieved?
        const allAchieved = results.every(r => r.achieved);

        return {
            achieved: allAchieved,
            conditions: results,
            scenarioName: currentScenario.name
        };
    }

    /**
     * Reset scenario system
     */
    function reset() {
        currentScenario = null;
    }

    /**
     * Public API
     */
    return {
        // Scenario management
        getPresetScenarios,
        getCustomScenarios,
        getAllScenarios,
        getScenario,
        loadScenario,
        getCurrentScenario,

        // Custom scenarios
        saveCustomScenario,
        deleteCustomScenario,

        // Import/Export
        exportScenario,
        importScenario,

        // Validation
        validateScenario,

        // Victory conditions
        checkVictoryConditions,

        // Utility
        reset
    };
})();
