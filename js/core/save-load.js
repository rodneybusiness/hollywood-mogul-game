/**
 * HOLLYWOOD MOGUL - SAVE/LOAD SYSTEM
 * Handles game state persistence using localStorage
 */

window.SaveLoadSystem = (function() {
    'use strict';

    const STORAGE_KEY = 'hollywood-mogul-saves';
    const AUTO_SAVE_KEY = 'hollywood-mogul-autosave';
    const BACKUP_KEY = 'hollywood-mogul-backup';
    const IRONMAN_KEY = 'hollywood-mogul-ironman';
    const SETTINGS_KEY = 'hollywood-mogul-save-settings';
    const MAX_SAVE_SLOTS = 5;
    const AUTO_SAVE_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
    const SAVE_VERSION = '2.0'; // Bumped version for enhanced features

    let autoSaveTimer = null;
    let ironmanMode = false;
    let lastQuickSaveSlot = 1;
    let autoSaveInProgress = false;
    
    /**
     * Save game to specific slot
     */
    function saveGame(slotNumber, gameState, customName = null) {
        try {
            const saves = getAllSaves();
            const saveData = createSaveData(gameState, customName);

            // Ensure slot number is within bounds
            if (slotNumber < 1 || slotNumber > MAX_SAVE_SLOTS) {
                throw new Error('Invalid save slot number');
            }

            // Create backup before overwriting
            const slotKey = `slot_${slotNumber}`;
            if (saves[slotKey]) {
                createBackup(slotKey, JSON.stringify(saves[slotKey]));
            }

            saves[slotKey] = saveData;

            localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));

            // Update last quick save slot
            lastQuickSaveSlot = slotNumber;
            saveSettings({ lastQuickSaveSlot: slotNumber });

            // Show indicator
            showAutoSaveIndicator(`Saved to Slot ${slotNumber}`);

            return {
                success: true,
                message: `Game saved to slot ${slotNumber}`,
                saveData: saveData
            };

        } catch (error) {
            console.error('Save failed:', error);
            return {
                success: false,
                message: 'Failed to save game: ' + error.message
            };
        }
    }
    
    /**
     * Load game from specific slot
     */
    function loadGame(slotNumber) {
        try {
            const saves = getAllSaves();
            const saveKey = `slot_${slotNumber}`;

            if (!saves[saveKey]) {
                return {
                    success: false,
                    message: 'No save found in this slot'
                };
            }

            const saveData = saves[saveKey];

            // Verify save integrity
            if (!verifySaveIntegrity(saveData)) {
                return attemptRecovery(saveKey);
            }

            const gameState = restoreGameState(saveData);

            // Update last quick save slot
            lastQuickSaveSlot = slotNumber;
            saveSettings({ lastQuickSaveSlot: slotNumber });

            return {
                success: true,
                message: `Game loaded from slot ${slotNumber}`,
                gameState: gameState,
                slot: slotNumber,
                saveInfo: {
                    name: saveData.name,
                    date: saveData.saveDate,
                    gameDate: saveData.gameDate,
                    cash: saveData.cash,
                    year: saveData.year
                }
            };

        } catch (error) {
            console.error('Load failed:', error);
            return {
                success: false,
                message: 'Failed to load game: ' + error.message
            };
        }
    }
    
    /**
     * Auto-save game state
     */
    function autoSave(gameState) {
        if (autoSaveInProgress) return false;

        try {
            autoSaveInProgress = true;
            showAutoSaveIndicator('Auto-Saving...');

            // If Ironman mode, save to Ironman slot
            if (ironmanMode) {
                ironmanSave(gameState);
                autoSaveInProgress = false;
                return true;
            }

            // Create backup before overwriting
            const existingAutoSave = localStorage.getItem(AUTO_SAVE_KEY);
            if (existingAutoSave) {
                createBackup(AUTO_SAVE_KEY, existingAutoSave);
            }

            const saveData = createSaveData(gameState, 'Auto Save');
            localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData));

            showAutoSaveIndicator('Game Saved');
            console.log('Auto-save completed');
            autoSaveInProgress = false;
            return true;

        } catch (error) {
            console.error('Auto-save failed:', error);
            autoSaveInProgress = false;
            return false;
        }
    }
    
    /**
     * Load auto-saved game
     */
    function loadAutoSave() {
        try {
            const autoSaveData = localStorage.getItem(AUTO_SAVE_KEY);
            
            if (!autoSaveData) {
                return {
                    success: false,
                    message: 'No auto-save found'
                };
            }
            
            const saveData = JSON.parse(autoSaveData);
            const gameState = restoreGameState(saveData);
            
            return {
                success: true,
                message: 'Auto-save loaded',
                gameState: gameState,
                saveInfo: {
                    name: saveData.name,
                    date: saveData.saveDate,
                    gameDate: saveData.gameDate,
                    cash: saveData.cash,
                    year: saveData.year
                }
            };
            
        } catch (error) {
            console.error('Auto-save load failed:', error);
            return {
                success: false,
                message: 'Failed to load auto-save: ' + error.message
            };
        }
    }
    
    /**
     * Get all saved games
     */
    function getAllSaves() {
        try {
            const saves = localStorage.getItem(STORAGE_KEY);
            return saves ? JSON.parse(saves) : {};
        } catch (error) {
            console.error('Failed to load saves:', error);
            return {};
        }
    }
    
    /**
     * Get save info for all slots (for UI display)
     */
    function getSaveSlotInfo() {
        const saves = getAllSaves();
        const slots = [];
        
        for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
            const slotKey = `slot_${i}`;
            const saveData = saves[slotKey];
            
            if (saveData) {
                slots.push({
                    slot: i,
                    exists: true,
                    name: saveData.name,
                    date: new Date(saveData.saveDate),
                    gameDate: saveData.gameDate,
                    cash: saveData.cash,
                    year: saveData.year,
                    studioName: saveData.studioName,
                    filmsProduced: saveData.stats?.filmsProduced || 0
                });
            } else {
                slots.push({
                    slot: i,
                    exists: false,
                    name: 'Empty Slot',
                    date: null,
                    gameDate: null,
                    cash: null,
                    year: null
                });
            }
        }
        
        return slots;
    }
    
    /**
     * Delete save from specific slot
     */
    function deleteSave(slotNumber) {
        try {
            const saves = getAllSaves();
            const slotKey = `slot_${slotNumber}`;
            
            if (saves[slotKey]) {
                delete saves[slotKey];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
                return {
                    success: true,
                    message: `Save slot ${slotNumber} deleted`
                };
            } else {
                return {
                    success: false,
                    message: 'No save found in this slot'
                };
            }
            
        } catch (error) {
            console.error('Delete save failed:', error);
            return {
                success: false,
                message: 'Failed to delete save: ' + error.message
            };
        }
    }
    
    /**
     * Clear all saves
     */
    function clearAllSaves() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(AUTO_SAVE_KEY);
            
            return {
                success: true,
                message: 'All saves cleared'
            };
            
        } catch (error) {
            console.error('Clear all saves failed:', error);
            return {
                success: false,
                message: 'Failed to clear saves: ' + error.message
            };
        }
    }
    
    /**
     * Create save data object from game state
     */
    function createSaveData(gameState, customName = null) {
        const saveDate = new Date();

        // Create a clean save object with only essential data
        const saveData = {
            version: SAVE_VERSION,
            name: customName || generateSaveName(gameState),
            saveDate: saveDate.toISOString(),
            
            // Game time data
            currentDate: gameState.currentDate.toISOString(),
            gameDate: window.TimeSystem ? 
                window.TimeSystem.formatDate(gameState.currentDate, 'full') : 
                gameState.currentDate.toDateString(),
            gameWeek: gameState.gameWeek,
            gameYear: gameState.gameYear,
            year: gameState.gameYear, // For quick reference
            
            // Financial data
            cash: gameState.cash,
            monthlyBurn: gameState.monthlyBurn,
            totalRevenue: gameState.totalRevenue,
            totalExpenses: gameState.totalExpenses,
            
            // Studio data
            studioName: gameState.studioName,
            reputation: gameState.reputation,
            soundStages: gameState.soundStages,
            backlots: { ...gameState.backlots },
            
            // Game collections (deep copy to avoid reference issues)
            activeFilms: JSON.parse(JSON.stringify(gameState.activeFilms)),
            completedFilms: JSON.parse(JSON.stringify(gameState.completedFilms)),
            contractPlayers: JSON.parse(JSON.stringify(gameState.contractPlayers)),
            availableScripts: JSON.parse(JSON.stringify(gameState.availableScripts)),
            currentEvents: JSON.parse(JSON.stringify(gameState.currentEvents)),
            
            // Game progress
            gameStarted: gameState.gameStarted,
            gameEnded: gameState.gameEnded,
            endingType: gameState.endingType,
            
            // Statistics
            stats: { ...gameState.stats }
        };
        
        return saveData;
    }
    
    /**
     * Restore game state from save data
     */
    function restoreGameState(saveData) {
        // Validate save data version compatibility
        if (!saveData.version) {
            console.warn('Save data missing version, attempting compatibility mode');
        } else if (saveData.version !== SAVE_VERSION) {
            console.warn(`Save data version mismatch (${saveData.version} vs ${SAVE_VERSION}), attempting compatibility mode`);
        }
        
        // Restore dates from ISO strings
        const currentDate = new Date(saveData.currentDate);
        
        // Reconstruct game state object
        const gameState = {
            currentDate: currentDate,
            gameWeek: saveData.gameWeek,
            gameYear: saveData.gameYear,
            
            cash: saveData.cash,
            monthlyBurn: saveData.monthlyBurn,
            totalRevenue: saveData.totalRevenue || 0,
            totalExpenses: saveData.totalExpenses || 0,
            
            studioName: saveData.studioName,
            reputation: saveData.reputation,
            soundStages: saveData.soundStages,
            backlots: { ...saveData.backlots },
            
            activeFilms: [...saveData.activeFilms],
            completedFilms: [...saveData.completedFilms],
            contractPlayers: [...saveData.contractPlayers],
            availableScripts: [...saveData.availableScripts],
            currentEvents: [...saveData.currentEvents],
            
            gameStarted: saveData.gameStarted,
            gameEnded: saveData.gameEnded,
            endingType: saveData.endingType,
            
            stats: { ...saveData.stats }
        };
        
        return gameState;
    }
    
    /**
     * Generate a descriptive save name
     */
    function generateSaveName(gameState) {
        const dateStr = window.TimeSystem ? 
            window.TimeSystem.formatDate(gameState.currentDate, 'short') :
            `${gameState.gameYear}`;
            
        const cash = Math.floor(gameState.cash / 1000);
        const cashStr = cash >= 0 ? `$${cash}k` : `-$${Math.abs(cash)}k`;
        
        return `${gameState.studioName} - ${dateStr} (${cashStr})`;
    }
    
    /**
     * Start auto-save timer
     */
    function startAutoSave(gameState) {
        stopAutoSave(); // Clear any existing timer
        
        autoSaveTimer = setInterval(() => {
            if (window.HollywoodMogul) {
                const currentState = window.HollywoodMogul.getGameState();
                if (currentState && currentState.gameStarted && !currentState.gameEnded) {
                    autoSave(currentState);
                }
            }
        }, AUTO_SAVE_INTERVAL);
        
        console.log('Auto-save started (every 5 minutes)');
    }
    
    /**
     * Stop auto-save timer
     */
    function stopAutoSave() {
        if (autoSaveTimer) {
            clearInterval(autoSaveTimer);
            autoSaveTimer = null;
            console.log('Auto-save stopped');
        }
    }
    
    /**
     * Export save data as downloadable file
     */
    function exportSave(slotNumber) {
        try {
            const saves = getAllSaves();
            const saveData = saves[`slot_${slotNumber}`];
            
            if (!saveData) {
                return {
                    success: false,
                    message: 'No save found in this slot'
                };
            }
            
            const exportData = {
                game: 'Hollywood Mogul',
                version: '1.0',
                exportDate: new Date().toISOString(),
                saveData: saveData
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `hollywood-mogul-save-${saveData.name.replace(/[^a-z0-9]/gi, '_')}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
            return {
                success: true,
                message: 'Save exported successfully'
            };
            
        } catch (error) {
            console.error('Export failed:', error);
            return {
                success: false,
                message: 'Failed to export save: ' + error.message
            };
        }
    }
    
    /**
     * Import save data from file
     */
    function importSave(file, targetSlot) {
        return new Promise((resolve) => {
            if (!file) {
                resolve({
                    success: false,
                    message: 'No file provided'
                });
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const importData = JSON.parse(e.target.result);

                    // Validate import file structure
                    if (!importData.game || importData.game !== 'Hollywood Mogul') {
                        resolve({
                            success: false,
                            message: 'Invalid save file format: not a Hollywood Mogul save'
                        });
                        return;
                    }

                    if (!importData.saveData) {
                        resolve({
                            success: false,
                            message: 'Save data not found in file'
                        });
                        return;
                    }

                    // Perform comprehensive schema validation on save data
                    const validation = validateSaveSchema(importData.saveData);

                    if (!validation.valid) {
                        const errorSummary = validation.errors.slice(0, 3).join('; ');
                        resolve({
                            success: false,
                            message: `Save file validation failed: ${errorSummary}`,
                            errors: validation.errors,
                            warnings: validation.warnings
                        });
                        return;
                    }

                    // Log warnings but allow import to proceed
                    if (validation.warnings.length > 0) {
                        console.warn('Save import warnings:', validation.warnings);
                    }

                    // Import to specified slot
                    const saves = getAllSaves();
                    saves[`slot_${targetSlot}`] = importData.saveData;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));

                    resolve({
                        success: true,
                        message: `Save imported to slot ${targetSlot}`,
                        saveInfo: {
                            name: importData.saveData.name,
                            date: new Date(importData.saveData.saveDate),
                            gameDate: importData.saveData.gameDate
                        },
                        warnings: validation.warnings
                    });

                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Failed to parse save file: ' + error.message
                    });
                }
            };
            
            reader.onerror = function() {
                resolve({
                    success: false,
                    message: 'Failed to read save file'
                });
            };
            
            reader.readAsText(file);
        });
    }
    
    /**
     * Check localStorage availability and space
     */
    function checkStorageAvailability() {
        try {
            const testKey = 'hollywood-mogul-test';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);

            // Estimate available space (rough calculation)
            const used = JSON.stringify(localStorage).length;
            const available = (5 * 1024 * 1024) - used; // Assume 5MB limit

            return {
                available: true,
                usedSpace: used,
                availableSpace: Math.max(0, available),
                percentUsed: Math.round((used / (5 * 1024 * 1024)) * 100)
            };

        } catch (error) {
            return {
                available: false,
                error: error.message
            };
        }
    }

    /**
     * IRONMAN MODE
     * Single save slot with auto-save on every action
     */

    /**
     * Enable Ironman mode
     */
    function enableIronmanMode() {
        ironmanMode = true;
        saveSettings({ ironmanMode: true });
        console.log('Ironman mode enabled - auto-save on every action');
        return {
            success: true,
            message: 'Ironman mode enabled'
        };
    }

    /**
     * Disable Ironman mode
     */
    function disableIronmanMode() {
        ironmanMode = false;
        saveSettings({ ironmanMode: false });
        console.log('Ironman mode disabled');
        return {
            success: true,
            message: 'Ironman mode disabled'
        };
    }

    /**
     * Check if Ironman mode is active
     */
    function isIronmanMode() {
        return ironmanMode;
    }

    /**
     * Ironman save - saves to dedicated slot
     */
    function ironmanSave(gameState) {
        if (!ironmanMode) {
            return {
                success: false,
                message: 'Ironman mode not active'
            };
        }

        try {
            // Create backup before overwriting
            const ironmanData = localStorage.getItem(IRONMAN_KEY);
            if (ironmanData) {
                createBackup(IRONMAN_KEY, ironmanData);
            }

            const saveData = createSaveData(gameState, 'Ironman Save');
            saveData.ironman = true;

            localStorage.setItem(IRONMAN_KEY, JSON.stringify(saveData));

            return {
                success: true,
                message: 'Ironman save completed',
                saveData: saveData
            };

        } catch (error) {
            console.error('Ironman save failed:', error);
            return {
                success: false,
                message: 'Ironman save failed: ' + error.message
            };
        }
    }

    /**
     * Load Ironman save
     */
    function loadIronmanSave() {
        try {
            const ironmanData = localStorage.getItem(IRONMAN_KEY);

            if (!ironmanData) {
                return {
                    success: false,
                    message: 'No Ironman save found'
                };
            }

            const saveData = JSON.parse(ironmanData);

            // Verify save integrity
            if (!verifySaveIntegrity(saveData)) {
                return attemptRecovery(IRONMAN_KEY);
            }

            const gameState = restoreGameState(saveData);
            ironmanMode = true;

            return {
                success: true,
                message: 'Ironman save loaded',
                gameState: gameState,
                saveInfo: {
                    name: saveData.name,
                    date: saveData.saveDate,
                    gameDate: saveData.gameDate,
                    cash: saveData.cash,
                    year: saveData.year
                }
            };

        } catch (error) {
            console.error('Ironman load failed:', error);
            return attemptRecovery(IRONMAN_KEY);
        }
    }

    /**
     * BACKUP & VERSIONING SYSTEM
     */

    /**
     * Create backup of save data
     */
    function createBackup(key, data) {
        try {
            const backups = getBackups();
            const backupEntry = {
                key: key,
                data: data,
                timestamp: new Date().toISOString(),
                version: SAVE_VERSION
            };

            // Keep only last 3 backups per key
            const keyBackups = backups[key] || [];
            keyBackups.unshift(backupEntry);
            backups[key] = keyBackups.slice(0, 3);

            localStorage.setItem(BACKUP_KEY, JSON.stringify(backups));

        } catch (error) {
            console.error('Backup creation failed:', error);
        }
    }

    /**
     * Get all backups
     */
    function getBackups() {
        try {
            const backupsData = localStorage.getItem(BACKUP_KEY);
            return backupsData ? JSON.parse(backupsData) : {};
        } catch (error) {
            console.error('Failed to load backups:', error);
            return {};
        }
    }

    /**
     * Restore from backup
     */
    function restoreFromBackup(key, backupIndex = 0) {
        try {
            const backups = getBackups();
            const keyBackups = backups[key];

            if (!keyBackups || keyBackups.length === 0) {
                return {
                    success: false,
                    message: 'No backups found for this save'
                };
            }

            if (backupIndex >= keyBackups.length) {
                return {
                    success: false,
                    message: 'Backup index out of range'
                };
            }

            const backup = keyBackups[backupIndex];
            localStorage.setItem(key, backup.data);

            return {
                success: true,
                message: `Restored backup from ${new Date(backup.timestamp).toLocaleString()}`,
                backupDate: backup.timestamp
            };

        } catch (error) {
            console.error('Backup restore failed:', error);
            return {
                success: false,
                message: 'Failed to restore backup: ' + error.message
            };
        }
    }

    /**
     * CORRUPTION DETECTION & RECOVERY
     */

    /**
     * JSON Schema for save data validation
     * Provides comprehensive validation of imported save files
     */
    const SAVE_SCHEMA = {
        requiredFields: [
            'version', 'name', 'saveDate', 'currentDate',
            'gameWeek', 'gameYear', 'cash', 'studioName'
        ],
        typeValidation: {
            version: 'string',
            name: 'string',
            saveDate: 'string',
            currentDate: 'string',
            gameWeek: 'number',
            gameYear: 'number',
            cash: 'number',
            monthlyBurn: 'number',
            totalRevenue: 'number',
            totalExpenses: 'number',
            studioName: 'string',
            reputation: 'number',
            soundStages: 'number',
            gameStarted: 'boolean',
            gameEnded: 'boolean'
        },
        arrayFields: [
            'activeFilms', 'completedFilms', 'contractPlayers',
            'availableScripts', 'currentEvents'
        ],
        objectFields: ['backlots', 'stats'],
        numberRanges: {
            gameYear: { min: 1933, max: 1960 },
            gameWeek: { min: 1, max: 10000 },
            reputation: { min: 0, max: 100 },
            soundStages: { min: 0, max: 20 }
        }
    };

    /**
     * Validate a value against expected type
     */
    function validateType(value, expectedType, fieldName) {
        if (value === undefined || value === null) {
            return { valid: false, error: `${fieldName} is missing or null` };
        }

        const actualType = typeof value;
        if (actualType !== expectedType) {
            return {
                valid: false,
                error: `${fieldName} should be ${expectedType}, got ${actualType}`
            };
        }
        return { valid: true };
    }

    /**
     * Validate number is within acceptable range
     */
    function validateNumberRange(value, fieldName, range) {
        if (typeof value !== 'number') return { valid: true }; // Skip if not a number

        if (range.min !== undefined && value < range.min) {
            return {
                valid: false,
                error: `${fieldName} (${value}) is below minimum (${range.min})`
            };
        }
        if (range.max !== undefined && value > range.max) {
            return {
                valid: false,
                error: `${fieldName} (${value}) is above maximum (${range.max})`
            };
        }
        return { valid: true };
    }

    /**
     * Validate ISO date string format
     */
    function validateDateString(value, fieldName) {
        if (typeof value !== 'string') {
            return { valid: false, error: `${fieldName} should be a date string` };
        }

        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return { valid: false, error: `${fieldName} is not a valid date: ${value}` };
        }
        return { valid: true };
    }

    /**
     * Comprehensive save data schema validation
     * Returns detailed validation results
     */
    function validateSaveSchema(saveData) {
        const errors = [];
        const warnings = [];

        // 1. Check required fields exist
        for (const field of SAVE_SCHEMA.requiredFields) {
            if (saveData[field] === undefined || saveData[field] === null) {
                errors.push(`Missing required field: ${field}`);
            }
        }

        // 2. Validate field types
        for (const [field, expectedType] of Object.entries(SAVE_SCHEMA.typeValidation)) {
            if (saveData[field] !== undefined) {
                const result = validateType(saveData[field], expectedType, field);
                if (!result.valid) {
                    errors.push(result.error);
                }
            }
        }

        // 3. Validate arrays
        for (const field of SAVE_SCHEMA.arrayFields) {
            if (saveData[field] !== undefined && !Array.isArray(saveData[field])) {
                errors.push(`${field} should be an array`);
            }
        }

        // 4. Validate objects
        for (const field of SAVE_SCHEMA.objectFields) {
            if (saveData[field] !== undefined &&
                (typeof saveData[field] !== 'object' || Array.isArray(saveData[field]))) {
                errors.push(`${field} should be an object`);
            }
        }

        // 5. Validate number ranges
        for (const [field, range] of Object.entries(SAVE_SCHEMA.numberRanges)) {
            if (saveData[field] !== undefined) {
                const result = validateNumberRange(saveData[field], field, range);
                if (!result.valid) {
                    warnings.push(result.error); // Range issues are warnings, not errors
                }
            }
        }

        // 6. Validate date fields
        if (saveData.saveDate) {
            const result = validateDateString(saveData.saveDate, 'saveDate');
            if (!result.valid) errors.push(result.error);
        }
        if (saveData.currentDate) {
            const result = validateDateString(saveData.currentDate, 'currentDate');
            if (!result.valid) errors.push(result.error);
        }

        // 7. Validate stats object structure if present
        if (saveData.stats && typeof saveData.stats === 'object') {
            const expectedStats = ['filmsProduced', 'oscarsWon', 'boxOfficeTotal', 'scandalsHandled', 'yearsSurvived'];
            for (const stat of expectedStats) {
                if (saveData.stats[stat] !== undefined && typeof saveData.stats[stat] !== 'number') {
                    warnings.push(`stats.${stat} should be a number`);
                }
            }
        }

        // 8. Version compatibility check
        if (saveData.version && saveData.version !== SAVE_VERSION) {
            warnings.push(`Save version mismatch: ${saveData.version} vs current ${SAVE_VERSION}`);
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            errorCount: errors.length,
            warningCount: warnings.length
        };
    }

    /**
     * Verify save data integrity (enhanced with schema validation)
     */
    function verifySaveIntegrity(saveData) {
        try {
            const validation = validateSaveSchema(saveData);

            if (!validation.valid) {
                console.warn('Save integrity check failed:');
                validation.errors.forEach(err => console.warn('  ERROR:', err));
            }

            if (validation.warnings.length > 0) {
                console.warn('Save validation warnings:');
                validation.warnings.forEach(warn => console.warn('  WARNING:', warn));
            }

            return validation.valid;

        } catch (error) {
            console.error('Integrity verification error:', error);
            return false;
        }
    }

    /**
     * Attempt to recover corrupted save
     */
    function attemptRecovery(key) {
        console.log(`Attempting to recover corrupted save: ${key}`);

        // Try to restore from backup
        const backupResult = restoreFromBackup(key, 0);

        if (backupResult.success) {
            try {
                const restoredData = localStorage.getItem(key);
                const saveData = JSON.parse(restoredData);

                if (verifySaveIntegrity(saveData)) {
                    const gameState = restoreGameState(saveData);

                    return {
                        success: true,
                        message: 'Save recovered from backup',
                        recovered: true,
                        gameState: gameState,
                        saveInfo: {
                            name: saveData.name,
                            date: saveData.saveDate,
                            gameDate: saveData.gameDate,
                            cash: saveData.cash,
                            year: saveData.year
                        }
                    };
                }
            } catch (error) {
                console.error('Recovery attempt failed:', error);
            }
        }

        return {
            success: false,
            message: 'Save data corrupted and recovery failed',
            corrupted: true
        };
    }

    /**
     * QUICK SAVE/LOAD
     */

    /**
     * Quick save to last used slot
     */
    function quickSave(gameState) {
        const result = saveGame(lastQuickSaveSlot, gameState, null);

        if (result.success) {
            showAutoSaveIndicator('Quick Saved');
        }

        return result;
    }

    /**
     * Quick load from last saved slot
     */
    function quickLoad() {
        const result = loadGame(lastQuickSaveSlot);

        if (result.success) {
            lastQuickSaveSlot = result.slot || lastQuickSaveSlot;
        }

        return result;
    }

    /**
     * Get last quick save slot
     */
    function getLastQuickSaveSlot() {
        return lastQuickSaveSlot;
    }

    /**
     * Set quick save slot
     */
    function setQuickSaveSlot(slotNumber) {
        if (slotNumber >= 1 && slotNumber <= MAX_SAVE_SLOTS) {
            lastQuickSaveSlot = slotNumber;
            saveSettings({ lastQuickSaveSlot: slotNumber });
            return true;
        }
        return false;
    }

    /**
     * SETTINGS MANAGEMENT
     */

    /**
     * Save settings
     */
    function saveSettings(settings) {
        try {
            const currentSettings = getSettings();
            const updatedSettings = { ...currentSettings, ...settings };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    /**
     * Get settings
     */
    function getSettings() {
        try {
            const settingsData = localStorage.getItem(SETTINGS_KEY);
            const settings = settingsData ? JSON.parse(settingsData) : {};

            // Load settings into memory
            if (settings.ironmanMode !== undefined) {
                ironmanMode = settings.ironmanMode;
            }
            if (settings.lastQuickSaveSlot !== undefined) {
                lastQuickSaveSlot = settings.lastQuickSaveSlot;
            }

            return settings;
        } catch (error) {
            console.error('Failed to load settings:', error);
            return {};
        }
    }

    /**
     * AUTO-SAVE INDICATOR
     */

    /**
     * Show auto-save indicator
     */
    function showAutoSaveIndicator(message = 'Auto-Saving...') {
        const indicator = document.getElementById('autosave-indicator');
        if (indicator) {
            indicator.textContent = message;
            indicator.classList.add('visible');

            setTimeout(() => {
                indicator.classList.remove('visible');
            }, 2000);
        }

        // Also trigger a notification if available
        if (window.DashboardUI && window.DashboardUI.showNotification) {
            window.DashboardUI.showNotification('Game Saved', message, 'success');
        }
    }
    
    /**
     * Initialize save system
     */
    function init() {
        // Load settings
        getSettings();

        console.log('Save/Load system initialized');
        console.log(`Ironman mode: ${ironmanMode ? 'ENABLED' : 'disabled'}`);
        console.log(`Quick save slot: ${lastQuickSaveSlot}`);
    }

    /**
     * Public API
     */
    return {
        // Initialization
        init,

        // Save/Load functions
        saveGame,
        loadGame,
        autoSave,
        loadAutoSave,

        // Save management
        getAllSaves,
        getSaveSlotInfo,
        deleteSave,
        clearAllSaves,

        // Auto-save management
        startAutoSave,
        stopAutoSave,

        // Quick save/load
        quickSave,
        quickLoad,
        getLastQuickSaveSlot,
        setQuickSaveSlot,

        // Ironman mode
        enableIronmanMode,
        disableIronmanMode,
        isIronmanMode,
        ironmanSave,
        loadIronmanSave,

        // Backup & Recovery
        createBackup,
        getBackups,
        restoreFromBackup,
        verifySaveIntegrity,
        validateSaveSchema,
        attemptRecovery,

        // Import/Export
        exportSave,
        importSave,

        // Settings
        saveSettings,
        getSettings,

        // Utility
        checkStorageAvailability,
        showAutoSaveIndicator,

        // Constants
        MAX_SAVE_SLOTS,
        AUTO_SAVE_INTERVAL,
        SAVE_VERSION
    };
})();