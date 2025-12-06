/**
 * HOLLYWOOD MOGUL - DIFFICULTY SYSTEM
 * Manages difficulty levels and applies modifiers to game constants
 */

window.DifficultySystem = (function() {
    'use strict';

    // Difficulty levels with their modifiers
    const DIFFICULTY_LEVELS = {
        'mogul': {
            id: 'mogul',
            name: 'Mogul',
            description: 'An easier experience for first-time moguls',
            modifiers: {
                startingCashMultiplier: 1.5,
                burnRateMultiplier: 0.8,
                eventFrequencyMultiplier: 0.7,
                revenueMultiplier: 1.2,
                scriptQualityBonus: 5
            },
            color: '#4CAF50' // Green
        },
        'golden-age': {
            id: 'golden-age',
            name: 'Golden Age',
            description: 'The standard Hollywood experience',
            modifiers: {
                startingCashMultiplier: 1.0,
                burnRateMultiplier: 1.0,
                eventFrequencyMultiplier: 1.0,
                revenueMultiplier: 1.0,
                scriptQualityBonus: 0
            },
            color: '#FFC107' // Gold
        },
        'depression-era': {
            id: 'depression-era',
            name: 'Depression Era',
            description: 'A challenging survival experience',
            modifiers: {
                startingCashMultiplier: 0.7,
                burnRateMultiplier: 1.2,
                eventFrequencyMultiplier: 1.3,
                revenueMultiplier: 0.85,
                scriptQualityBonus: -5
            },
            color: '#F44336' // Red
        }
    };

    // Current difficulty settings
    let currentDifficulty = 'golden-age';
    let difficultyLocked = false;

    /**
     * Get all available difficulty levels
     */
    function getDifficultyLevels() {
        return Object.values(DIFFICULTY_LEVELS);
    }

    /**
     * Get current difficulty level
     */
    function getCurrentDifficulty() {
        return DIFFICULTY_LEVELS[currentDifficulty];
    }

    /**
     * Set difficulty level
     */
    function setDifficulty(difficultyId) {
        if (difficultyLocked) {
            console.warn('Cannot change difficulty - game has already started');
            return {
                success: false,
                message: 'Difficulty is locked after game starts'
            };
        }

        if (!DIFFICULTY_LEVELS[difficultyId]) {
            console.error('Invalid difficulty level:', difficultyId);
            return {
                success: false,
                message: 'Invalid difficulty level'
            };
        }

        currentDifficulty = difficultyId;

        console.log(`Difficulty set to: ${DIFFICULTY_LEVELS[difficultyId].name}`);

        return {
            success: true,
            message: `Difficulty set to ${DIFFICULTY_LEVELS[difficultyId].name}`,
            difficulty: DIFFICULTY_LEVELS[difficultyId]
        };
    }

    /**
     * Apply difficulty modifiers to game constants
     */
    function applyDifficulty(gameConstants) {
        const difficulty = DIFFICULTY_LEVELS[currentDifficulty];
        const modifiers = difficulty.modifiers;

        // Create modified constants object
        const modifiedConstants = { ...gameConstants };

        // Apply starting cash modifier
        if (modifiedConstants.STARTING_CASH) {
            modifiedConstants.STARTING_CASH = Math.floor(
                modifiedConstants.STARTING_CASH * modifiers.startingCashMultiplier
            );
        }

        // Apply burn rate modifier
        if (modifiedConstants.BASE_MONTHLY_BURN) {
            modifiedConstants.BASE_MONTHLY_BURN = Math.floor(
                modifiedConstants.BASE_MONTHLY_BURN * modifiers.burnRateMultiplier
            );
        }

        // Store modifiers for use by other systems
        modifiedConstants.DIFFICULTY_MODIFIERS = {
            ...modifiers,
            difficultyLevel: currentDifficulty,
            difficultyName: difficulty.name
        };

        console.log('Applied difficulty modifiers:', {
            level: difficulty.name,
            startingCash: modifiedConstants.STARTING_CASH,
            monthlyBurn: modifiedConstants.BASE_MONTHLY_BURN
        });

        return modifiedConstants;
    }

    /**
     * Lock difficulty (called when game starts)
     */
    function lockDifficulty() {
        difficultyLocked = true;
        console.log('Difficulty locked for this game session');
    }

    /**
     * Unlock difficulty (for new game)
     */
    function unlockDifficulty() {
        difficultyLocked = false;
        console.log('Difficulty unlocked');
    }

    /**
     * Check if difficulty is locked
     */
    function isDifficultyLocked() {
        return difficultyLocked;
    }

    /**
     * Get modifier for specific game mechanic
     */
    function getModifier(modifierName) {
        const difficulty = DIFFICULTY_LEVELS[currentDifficulty];
        return difficulty.modifiers[modifierName] || 1.0;
    }

    /**
     * Apply difficulty modifier to a value
     */
    function applyModifier(value, modifierName) {
        const modifier = getModifier(modifierName);
        return Math.floor(value * modifier);
    }

    /**
     * Get difficulty display info for UI
     */
    function getDifficultyDisplayInfo() {
        const difficulty = DIFFICULTY_LEVELS[currentDifficulty];

        return {
            id: difficulty.id,
            name: difficulty.name,
            description: difficulty.description,
            color: difficulty.color,
            locked: difficultyLocked,
            modifiers: {
                startingCash: formatModifier(difficulty.modifiers.startingCashMultiplier),
                burnRate: formatModifier(difficulty.modifiers.burnRateMultiplier),
                eventFrequency: formatModifier(difficulty.modifiers.eventFrequencyMultiplier),
                revenue: formatModifier(difficulty.modifiers.revenueMultiplier),
                scriptQuality: difficulty.modifiers.scriptQualityBonus
            }
        };
    }

    /**
     * Format modifier for display
     */
    function formatModifier(value) {
        if (value === 1.0) return 'Standard';
        if (value > 1.0) return `+${Math.round((value - 1.0) * 100)}%`;
        return `-${Math.round((1.0 - value) * 100)}%`;
    }

    /**
     * Reset difficulty to default
     */
    function reset() {
        currentDifficulty = 'golden-age';
        difficultyLocked = false;
        console.log('Difficulty system reset to default');
    }

    /**
     * Serialize difficulty settings for save game
     */
    function serialize() {
        return {
            currentDifficulty: currentDifficulty,
            difficultyLocked: difficultyLocked
        };
    }

    /**
     * Deserialize difficulty settings from save game
     */
    function deserialize(data) {
        if (data && data.currentDifficulty) {
            currentDifficulty = data.currentDifficulty;
            difficultyLocked = data.difficultyLocked || false;

            console.log('Difficulty settings restored:', {
                level: DIFFICULTY_LEVELS[currentDifficulty].name,
                locked: difficultyLocked
            });
        }
    }

    /**
     * Public API
     */
    return {
        // Difficulty management
        getDifficultyLevels,
        getCurrentDifficulty,
        setDifficulty,
        lockDifficulty,
        unlockDifficulty,
        isDifficultyLocked,

        // Modifier application
        applyDifficulty,
        getModifier,
        applyModifier,

        // UI helpers
        getDifficultyDisplayInfo,

        // Save/Load
        serialize,
        deserialize,
        reset
    };
})();
