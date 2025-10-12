/**
 * HOLLYWOOD MOGUL - SAVE/LOAD SYSTEM
 * Handles game state persistence using localStorage
 */

window.SaveLoadSystem = (function() {
    'use strict';
    
    const STORAGE_KEY = 'hollywood-mogul-saves';
    const AUTO_SAVE_KEY = 'hollywood-mogul-autosave';
    const MAX_SAVE_SLOTS = 5;
    const AUTO_SAVE_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    let autoSaveTimer = null;
    
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
            
            saves[`slot_${slotNumber}`] = saveData;
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
            
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
            const gameState = restoreGameState(saveData);
            
            return {
                success: true,
                message: `Game loaded from slot ${slotNumber}`,
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
        try {
            const saveData = createSaveData(gameState, 'Auto Save');
            localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData));
            
            console.log('Auto-save completed');
            return true;
            
        } catch (error) {
            console.error('Auto-save failed:', error);
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
            version: '1.0',
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
        if (!saveData.version || saveData.version !== '1.0') {
            console.warn('Save data version mismatch, attempting compatibility mode');
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
                    
                    // Validate import data
                    if (!importData.game || importData.game !== 'Hollywood Mogul') {
                        resolve({
                            success: false,
                            message: 'Invalid save file format'
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
                        }
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
     * Public API
     */
    return {
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
        
        // Import/Export
        exportSave,
        importSave,
        
        // Utility
        checkStorageAvailability,
        
        // Constants
        MAX_SAVE_SLOTS,
        AUTO_SAVE_INTERVAL
    };
})();