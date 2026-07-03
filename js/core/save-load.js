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
    const SAVE_VERSION = '3.0'; // v3: full generic state serialization + migrations (CODE-007)

    // CODE-009: caps for unbounded history arrays in the save payload
    const MAX_SAVED_EVENTS = 100;
    const MAX_SAVED_ALERTS = 20;

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

            // CODE-009: guarded write — a quota failure leaves the previous
            // save untouched and surfaces a user-visible alert.
            const writeResult = safeSetItem(STORAGE_KEY, JSON.stringify(saves));
            if (!writeResult.success) {
                return {
                    success: false,
                    message: writeResult.message
                };
            }

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
            const writeResult = safeSetItem(AUTO_SAVE_KEY, JSON.stringify(saveData));
            if (!writeResult.success) {
                showAutoSaveIndicator('Auto-Save Failed');
                autoSaveInProgress = false;
                return false;
            }

            showAutoSaveIndicator('Game Saved');

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
     * GENERIC STATE SERIALIZATION (CODE-007)
     */

    /**
     * JSON-safe deep copy of arbitrary game state. Dates are tagged so load
     * can revive them as Date instances wherever they appear (currentDate,
     * film.startDate, film.releaseDate, loan.originationDate, ...).
     * Functions and undefined are dropped; circular references are cut.
     */
    function serializeValue(value, seen) {
        if (value === null || typeof value !== 'object') {
            return (typeof value === 'function' || value === undefined) ? undefined : value;
        }
        if (value instanceof Date) {
            return { __type: 'Date', iso: value.toISOString() };
        }

        seen = seen || new WeakSet();
        if (seen.has(value)) return undefined;
        seen.add(value);

        let result;
        if (Array.isArray(value)) {
            result = value.map(item => {
                const serialized = serializeValue(item, seen);
                return serialized === undefined ? null : serialized;
            });
        } else {
            result = {};
            for (const key of Object.keys(value)) {
                const serialized = serializeValue(value[key], seen);
                if (serialized !== undefined) result[key] = serialized;
            }
        }
        seen.delete(value);
        return result;
    }

    /**
     * Reverse of serializeValue: rebuilds Date instances from tagged objects.
     */
    function reviveValue(value) {
        if (value === null || typeof value !== 'object') return value;
        if (value instanceof Date) return value; // migrations may emit real Dates
        if (value.__type === 'Date' && typeof value.iso === 'string') {
            return new Date(value.iso);
        }
        if (Array.isArray(value)) return value.map(reviveValue);
        const result = {};
        for (const key of Object.keys(value)) {
            result[key] = reviveValue(value[key]);
        }
        return result;
    }

    /**
     * Shrink the state before serializing (CODE-009).
     * Consumed scripts can never be optioned again, so only their ids are
     * kept; unbounded history arrays are capped to the most recent entries.
     * Returns a shallow copy — the live state is never mutated.
     */
    function pruneStateForSave(gameState) {
        const pruned = { ...gameState };

        if (Array.isArray(pruned.availableScripts)) {
            pruned.availableScripts = pruned.availableScripts.map(script => {
                if (script && typeof script === 'object' &&
                    (script.optioned || script.available === false)) {
                    return {
                        id: script.id,
                        title: script.title,
                        available: false,
                        optioned: !!script.optioned
                    };
                }
                return script;
            });
        }

        if (Array.isArray(pruned.events) && pruned.events.length > MAX_SAVED_EVENTS) {
            pruned.events = pruned.events.slice(-MAX_SAVED_EVENTS);
        }
        if (Array.isArray(pruned.currentEvents) && pruned.currentEvents.length > MAX_SAVED_ALERTS) {
            pruned.currentEvents = pruned.currentEvents.slice(-MAX_SAVED_ALERTS);
        }

        return pruned;
    }

    /**
     * QUOTA-SAFE STORAGE WRITES (CODE-009)
     */

    function isQuotaError(error) {
        return !!error && (
            error.name === 'QuotaExceededError' ||
            error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
            error.code === 22 ||
            error.code === 1014 ||
            /quota/i.test(String(error.message))
        );
    }

    function notifyQuotaExceeded() {
        showAutoSaveIndicator('Save Failed — Storage Full');
        if (window.HollywoodMogul && window.HollywoodMogul.addAlert) {
            window.HollywoodMogul.addAlert({
                type: 'danger',
                icon: '💾',
                message: 'Save failed: browser storage is full. Your previous save is intact — delete or export old saves to free space.',
                priority: 'high'
            });
        }
    }

    /**
     * localStorage.setItem is atomic per key: on failure the previous value
     * survives, so an existing save is never corrupted by a failed write.
     * On quota exhaustion the (expendable) backup store is sacrificed and the
     * write retried once; a final failure is reported to the player.
     */
    function safeSetItem(key, value, options = {}) {
        try {
            localStorage.setItem(key, value);
            return { success: true };
        } catch (error) {
            let finalError = error;
            if (isQuotaError(error) && key !== BACKUP_KEY) {
                try {
                    localStorage.removeItem(BACKUP_KEY);
                    localStorage.setItem(key, value);
                    return { success: true, backupsPurged: true };
                } catch (retryError) {
                    finalError = retryError;
                }
            }

            const quota = isQuotaError(finalError);
            if (!options.silent) {
                console.error(`Storage write failed for ${key}:`, finalError);
                if (quota) notifyQuotaExceeded();
            }

            return {
                success: false,
                quotaExceeded: quota,
                message: quota ?
                    'Save failed: browser storage is full. Your previous save is intact — delete or export old saves to free space.' :
                    'Save failed: ' + finalError.message
            };
        }
    }

    /**
     * SAVE DATA CREATION & RESTORATION
     */

    /**
     * Create save data object from game state.
     * Header fields (name, dates, cash, ...) exist for slot lists, integrity
     * checks and migrations; the complete gameplay state lives under `state`,
     * serialized generically so no field is ever silently dropped (CODE-007).
     */
    function createSaveData(gameState, customName = null) {
        const saveDate = new Date();

        return {
            version: SAVE_VERSION,
            name: customName || generateSaveName(gameState),
            saveDate: saveDate.toISOString(),

            // Header metadata
            currentDate: gameState.currentDate.toISOString(),
            gameDate: window.TimeSystem ?
                window.TimeSystem.formatDate(gameState.currentDate, 'full') :
                gameState.currentDate.toDateString(),
            gameWeek: gameState.gameWeek,
            gameYear: gameState.gameYear,
            year: gameState.gameYear, // For quick reference
            cash: gameState.cash,
            studioName: gameState.studioName,
            stats: { ...gameState.stats },

            // The entire live game state, pruned and deep-copied
            state: serializeValue(pruneStateForSave(gameState))
        };
    }

    /**
     * SAVE MIGRATIONS
     * Applied in sequence on load until the data reaches SAVE_VERSION.
     * Unknown (e.g. future) versions abort the load with a clear message
     * instead of silently corrupting the running game.
     */

    /**
     * The complete new-game state shape, mirroring
     * HollywoodMogul.startNewGameWithScenario (js/core/game-state.js).
     * v2 saves are filled with these defaults so they load playable
     * instead of half-initialized.
     */
    function defaultStateFields() {
        return {
            currentDate: new Date(1933, 0, 1),
            gameWeek: 1,
            gameYear: 1933,
            cash: 600000,
            monthlyBurn: 20000,
            totalRevenue: 0,
            totalExpenses: 0,
            studioName: 'Mogul Pictures',
            reputation: 50,
            activeFilms: [],
            completedFilms: [],
            contractPlayers: [],
            availableScripts: [],
            currentEvents: [],
            soundStages: 1,
            backlots: { western: false, nyc: false, jungle: false },
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
            events: [],
            scenario: null,
            technologies: [],
            franchises: [],
            studioLot: null
        };
    }

    // Header-only fields on a v2 save that are not gameplay state
    const V2_METADATA_KEYS = ['version', 'name', 'saveDate', 'gameDate', 'year', 'ironman'];

    /**
     * v2 (and the structurally identical 1.x) saves stored a flat whitelist
     * of fields. Rebuild the v3 shape: defaults for everything, overlaid with
     * whatever the old save actually captured.
     */
    function migrateV2toV3(saveData) {
        const state = defaultStateFields();
        const defaultStats = state.stats;

        for (const key of Object.keys(saveData)) {
            if (V2_METADATA_KEYS.indexOf(key) !== -1) continue;
            if (saveData[key] === undefined || saveData[key] === null) continue;
            state[key] = saveData[key];
        }

        state.currentDate = new Date(saveData.currentDate);
        state.stats = { ...defaultStats, ...(saveData.stats || {}) };

        return {
            version: '3.0',
            name: saveData.name,
            saveDate: saveData.saveDate,
            currentDate: saveData.currentDate,
            gameDate: saveData.gameDate,
            gameWeek: state.gameWeek,
            gameYear: state.gameYear,
            year: state.gameYear,
            cash: state.cash,
            studioName: state.studioName,
            stats: { ...state.stats },
            ironman: saveData.ironman,
            state: state
        };
    }

    const MIGRATIONS = {
        '2.0': migrateV2toV3
    };

    function migrateSaveData(saveData) {
        let current = saveData;
        let version = current.version || '1.0';

        // 1.x saves share the flat v2 shape; route them through the v2 migration
        if (version.indexOf('1.') === 0) version = '2.0';

        while (version !== SAVE_VERSION) {
            const migrate = MIGRATIONS[version];
            if (!migrate) {
                throw new Error(
                    `Save version "${current.version}" is not supported by this game (current: ${SAVE_VERSION}). ` +
                    'Loading was aborted; the save file was not modified.'
                );
            }
            current = migrate(current);
            version = current.version;
        }

        if (!current.state || typeof current.state !== 'object') {
            throw new Error('Save data has no game state payload');
        }

        return current;
    }

    /**
     * Restore game state from save data (migrating older versions first)
     */
    function restoreGameState(saveData) {
        const migrated = migrateSaveData(saveData);
        const gameState = reviveValue(migrated.state);

        // Safety net: currentDate must always come back as a Date
        if (!(gameState.currentDate instanceof Date) || isNaN(gameState.currentDate.getTime())) {
            gameState.currentDate = new Date(migrated.currentDate);
        }

        return gameState;
    }

    /**
     * Apply a loaded state onto the live gameState object (CODE-008).
     * Preserves object identity — systems hold references to the live
     * object — but removes every stale key first so the current session
     * cannot contaminate the loaded game.
     */
    function applyLoadedState(loadedState) {
        if (!loadedState) return null;

        const live = (window.HollywoodMogul && window.HollywoodMogul.getGameState) ?
            window.HollywoodMogul.getGameState() : null;
        if (!live) return loadedState;

        for (const key of Object.keys(live)) {
            delete live[key];
        }
        Object.assign(live, loadedState);
        return live;
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
        
    }
    
    /**
     * Stop auto-save timer
     */
    function stopAutoSave() {
        if (autoSaveTimer) {
            clearInterval(autoSaveTimer);
            autoSaveTimer = null;
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
                    const writeResult = safeSetItem(STORAGE_KEY, JSON.stringify(saves));
                    if (!writeResult.success) {
                        resolve({
                            success: false,
                            message: writeResult.message
                        });
                        return;
                    }

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
        // saveSettings first: its getSettings() call reloads the stored flag
        // into memory, which would clobber an in-memory-only change
        saveSettings({ ironmanMode: true });
        ironmanMode = true;
        return {
            success: true,
            message: 'Ironman mode enabled'
        };
    }

    /**
     * Disable Ironman mode
     */
    function disableIronmanMode() {
        saveSettings({ ironmanMode: false });
        ironmanMode = false;
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

            const writeResult = safeSetItem(IRONMAN_KEY, JSON.stringify(saveData));
            if (!writeResult.success) {
                return {
                    success: false,
                    message: writeResult.message
                };
            }

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

            // Backups are expendable: a quota failure here must never block
            // (or alert about) the real save that follows (CODE-009).
            const writeResult = safeSetItem(BACKUP_KEY, JSON.stringify(backups), { silent: true });
            if (!writeResult.success && writeResult.quotaExceeded) {
                localStorage.removeItem(BACKUP_KEY);
            }

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
            const writeResult = safeSetItem(key, backup.data);
            if (!writeResult.success) {
                return {
                    success: false,
                    message: writeResult.message
                };
            }

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
            'availableScripts', 'currentEvents', 'technologies', 'franchises'
        ],
        objectFields: ['backlots', 'stats'],
        numberRanges: {
            gameYear: { min: 1933, max: 2011 },
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
            if (saveData[field] !== undefined && saveData[field] !== null && !Array.isArray(saveData[field])) {
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
            safeSetItem(SETTINGS_KEY, JSON.stringify(updatedSettings), { silent: true });
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
        applyLoadedState,

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