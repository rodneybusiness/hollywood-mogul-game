/**
 * HOLLYWOOD MOGUL - SAVE/LOAD UI INTEGRATION
 * Handles the save/load modal and all related UI interactions
 */

window.SaveLoadUI = (function() {
    'use strict';

    /**
     * Initialize save/load system
     */
    function init() {
        // Initialize SaveLoadSystem
        if (window.SaveLoadSystem && window.SaveLoadSystem.init) {
            window.SaveLoadSystem.init();
        }

        // Bind save/load button events
        const saveBtn = document.getElementById('save-game');
        const loadBtn = document.getElementById('load-game');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => showSaveModal('save'));
        }

        if (loadBtn) {
            loadBtn.addEventListener('click', () => showSaveModal('load'));
        }

        // Bind modal controls
        bindSaveModalControls();

        // Start auto-save
        if (window.SaveLoadSystem && window.SaveLoadSystem.startAutoSave) {
            window.SaveLoadSystem.startAutoSave();
        }

    }

    /**
     * Show save/load modal
     */
    function showSaveModal(initialTab) {
        const modal = document.getElementById('save-load-modal');
        if (!modal) return;

        // Update title
        const title = document.getElementById('save-load-title');
        if (title) {
            title.textContent = initialTab === 'save' ? 'SAVE GAME' : 'LOAD GAME';
        }

        // Switch to appropriate tab
        switchSaveTab(initialTab);

        // Populate save slots
        populateSaveSlots();

        // Update storage info
        updateStorageInfo();

        // Show modal
        modal.classList.remove('hidden');
    }

    /**
     * Close save/load modal
     */
    function closeSaveModal() {
        const modal = document.getElementById('save-load-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Bind save modal controls
     */
    function bindSaveModalControls() {
        // Close button
        const closeBtn = document.getElementById('close-save-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeSaveModal);
        }

        // Tab buttons
        const tabButtons = document.querySelectorAll('.save-tab');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                switchSaveTab(tab);
            });
        });

        // Quick save button
        const quickSaveBtn = document.getElementById('btn-quick-save');
        if (quickSaveBtn) {
            quickSaveBtn.addEventListener('click', handleQuickSave);
        }

        // Quick load button
        const quickLoadBtn = document.getElementById('btn-quick-load');
        if (quickLoadBtn) {
            quickLoadBtn.addEventListener('click', handleQuickLoad);
        }

        // Export button
        const exportBtn = document.getElementById('btn-export-save');
        if (exportBtn) {
            exportBtn.addEventListener('click', handleExportSave);
        }

        // Import button
        const importBtn = document.getElementById('btn-import-save');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                const fileInput = document.getElementById('import-file-input');
                if (fileInput) fileInput.click();
            });
        }

        // Import file input
        const fileInput = document.getElementById('import-file-input');
        if (fileInput) {
            fileInput.addEventListener('change', handleImportSave);
        }

        // Ironman toggle
        const ironmanToggle = document.getElementById('ironman-mode-toggle');
        if (ironmanToggle) {
            ironmanToggle.addEventListener('change', handleIronmanToggle);
            // Set initial state
            ironmanToggle.checked = window.SaveLoadSystem ? window.SaveLoadSystem.isIronmanMode() : false;
        }

        // Clear all saves button
        const clearAllBtn = document.getElementById('btn-clear-all-saves');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', handleClearAllSaves);
        }
    }

    /**
     * Switch between save/load tabs
     */
    function switchSaveTab(tabName) {
        // Update tab buttons
        const tabButtons = document.querySelectorAll('.save-tab');
        tabButtons.forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        const activeContent = document.getElementById(tabName + '-tab-content');
        if (activeContent) {
            activeContent.classList.add('active');
        }

        // Refresh slot displays when switching tabs
        if (tabName === 'save' || tabName === 'load') {
            populateSaveSlots();
        }
    }

    /**
     * Populate save slots
     */
    function populateSaveSlots() {
        if (!window.SaveLoadSystem) return;

        const saveContainer = document.getElementById('save-slots-container');
        const loadContainer = document.getElementById('load-slots-container');
        const autoSaveContainer = document.getElementById('autosave-slot');

        const slots = window.SaveLoadSystem.getSaveSlotInfo();

        // Populate save slots
        if (saveContainer) {
            saveContainer.innerHTML = slots.map(slot => createSaveSlotHTML(slot, 'save')).join('');
            // Bind click events
            saveContainer.querySelectorAll('.save-slot').forEach((el, idx) => {
                el.addEventListener('click', () => handleSaveToSlot(idx + 1));
            });
        }

        // Populate load slots
        if (loadContainer) {
            loadContainer.innerHTML = slots.map(slot => createSaveSlotHTML(slot, 'load')).join('');
            // Bind click and delete events
            loadContainer.querySelectorAll('.save-slot').forEach((el, idx) => {
                if (slots[idx].exists) {
                    el.addEventListener('click', () => handleLoadFromSlot(idx + 1));
                    const deleteBtn = el.querySelector('.slot-delete');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            showDeleteConfirmation(idx + 1);
                        });
                    }
                }
            });
        }

        // Populate auto-save slot
        if (autoSaveContainer) {
            const autoSaveResult = window.SaveLoadSystem.loadAutoSave();
            if (autoSaveResult.success && autoSaveResult.saveInfo) {
                const autoSaveSlot = {
                    slot: 'Auto',
                    exists: true,
                    name: autoSaveResult.saveInfo.name,
                    date: new Date(autoSaveResult.saveInfo.date),
                    gameDate: autoSaveResult.saveInfo.gameDate,
                    cash: autoSaveResult.saveInfo.cash,
                    year: autoSaveResult.saveInfo.year
                };
                autoSaveContainer.innerHTML = createSaveSlotHTML(autoSaveSlot, 'autosave');
                autoSaveContainer.querySelector('.save-slot').addEventListener('click', handleLoadAutoSave);
            } else {
                autoSaveContainer.innerHTML = '<div class="empty-slot-text">No auto-save available</div>';
            }
        }
    }

    /**
     * Create save slot HTML
     */
    function createSaveSlotHTML(slot, slotType) {
        if (!slot.exists) {
            return '<div class="save-slot empty" data-slot="' + slot.slot + '">' +
                '<div class="slot-header">' +
                '<span class="slot-number">SLOT ' + slot.slot + '</span>' +
                '</div>' +
                '<div class="empty-slot-text">Empty Slot - Click to ' + (slotType === 'save' ? 'Save' : 'No Save') + '</div>' +
                '</div>';
        }

        const deleteBtn = slotType === 'load' ? '<button class="slot-delete" title="Delete Save">×</button>' : '';
        const slotLabel = typeof slot.slot === 'number' ? 'SLOT ' + slot.slot : slot.slot;

        return '<div class="save-slot" data-slot="' + slot.slot + '">' +
            '<div class="slot-header">' +
            '<span class="slot-number">' + slotLabel + '</span>' +
            deleteBtn +
            '</div>' +
            '<div class="slot-name">' + (slot.name || slot.studioName || 'Unnamed Save') + '</div>' +
            '<div class="slot-info">' +
            '<div><strong>Year:</strong> ' + (slot.year || 'N/A') + '</div>' +
            '<div><strong>Cash:</strong> $' + ((slot.cash || 0).toLocaleString()) + '</div>' +
            '<div><strong>Films:</strong> ' + (slot.filmsProduced || 0) + '</div>' +
            '</div>' +
            '<div class="slot-date">' + (slot.date ? new Date(slot.date).toLocaleString() : 'N/A') + '</div>' +
            '</div>';
    }

    /**
     * Handle quick save
     */
    function handleQuickSave() {
        if (!window.HollywoodMogul || !window.SaveLoadSystem) return;

        const gameState = window.HollywoodMogul.getGameState();
        const result = window.SaveLoadSystem.quickSave(gameState);

        if (result.success) {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Quick Save', result.message, 'success');
            }
            populateSaveSlots();
        } else {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Save Failed', result.message, 'error');
            }
        }
    }

    /**
     * Handle quick load
     */
    function handleQuickLoad() {
        if (!window.SaveLoadSystem) return;

        const result = window.SaveLoadSystem.quickLoad();

        if (result.success) {
            applyLoadedGameState(result.gameState);
            closeSaveModal();
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Quick Load', result.message, 'success');
            }
        } else {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Load Failed', result.message, 'error');
            }
        }
    }

    /**
     * Handle save to slot
     */
    function handleSaveToSlot(slotNumber) {
        if (!window.HollywoodMogul || !window.SaveLoadSystem) return;

        const gameState = window.HollywoodMogul.getGameState();
        const result = window.SaveLoadSystem.saveGame(slotNumber, gameState);

        if (result.success) {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Game Saved', 'Saved to slot ' + slotNumber, 'success');
            }
            populateSaveSlots();
        } else {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Save Failed', result.message, 'error');
            }
        }
    }

    /**
     * Handle load from slot
     */
    function handleLoadFromSlot(slotNumber) {
        if (!window.SaveLoadSystem) return;

        const result = window.SaveLoadSystem.loadGame(slotNumber);

        if (result.success) {
            applyLoadedGameState(result.gameState);
            closeSaveModal();
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Game Loaded', 'Loaded from slot ' + slotNumber, 'success');
            }

            if (result.recovered) {
                if (window.DashboardUI && window.DashboardUI.showNotification) {
                    window.DashboardUI.showNotification('Save Recovered', 'Save was corrupted but recovered from backup', 'warning');
                }
            }
        } else {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Load Failed', result.message, 'error');
            }
        }
    }

    /**
     * Handle load auto-save
     */
    function handleLoadAutoSave() {
        if (!window.SaveLoadSystem) return;

        const result = window.SaveLoadSystem.loadAutoSave();

        if (result.success) {
            applyLoadedGameState(result.gameState);
            closeSaveModal();
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Auto-Save Loaded', 'Game restored from auto-save', 'success');
            }
        } else {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Load Failed', result.message, 'error');
            }
        }
    }

    /**
     * Apply loaded game state
     */
    function applyLoadedGameState(gameState) {
        if (!window.HollywoodMogul || !gameState) return;

        // Update global game state
        const currentState = window.HollywoodMogul.getGameState();
        Object.assign(currentState, gameState);

        // Refresh all UI components
        if (window.DashboardUI && window.DashboardUI.updateDashboard) {
            window.DashboardUI.updateDashboard();
        }

    }

    /**
     * Handle export save
     */
    function handleExportSave() {
        if (!window.SaveLoadSystem) return;

        const slotSelect = document.getElementById('export-slot-select');
        const slotNumber = parseInt(slotSelect.value);

        const result = window.SaveLoadSystem.exportSave(slotNumber);

        if (result.success) {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Export Successful', result.message, 'success');
            }
        } else {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Export Failed', result.message, 'error');
            }
        }
    }

    /**
     * Handle import save
     */
    function handleImportSave(event) {
        if (!window.SaveLoadSystem) return;

        const file = event.target.files[0];
        if (!file) return;

        const slotSelect = document.getElementById('import-slot-select');
        const targetSlot = parseInt(slotSelect.value);

        window.SaveLoadSystem.importSave(file, targetSlot).then(result => {
            if (result.success) {
                if (window.DashboardUI && window.DashboardUI.showNotification) {
                    window.DashboardUI.showNotification('Import Successful', result.message, 'success');
                }
                populateSaveSlots();
            } else {
                if (window.DashboardUI && window.DashboardUI.showNotification) {
                    window.DashboardUI.showNotification('Import Failed', result.message, 'error');
                }
            }

            // Reset file input
            event.target.value = '';
        });
    }

    /**
     * Handle Ironman mode toggle
     */
    function handleIronmanToggle(event) {
        if (!window.SaveLoadSystem) return;

        const enabled = event.target.checked;

        if (enabled) {
            if (confirm('Enable Ironman Mode? This will create a single save slot with auto-save on every action. This cannot be undone!')) {
                const result = window.SaveLoadSystem.enableIronmanMode();
                if (result.success) {
                    if (window.DashboardUI && window.DashboardUI.showNotification) {
                        window.DashboardUI.showNotification('Ironman Mode', 'Ironman mode enabled', 'warning');
                    }
                }
            } else {
                event.target.checked = false;
            }
        } else {
            const result = window.SaveLoadSystem.disableIronmanMode();
            if (result.success) {
                if (window.DashboardUI && window.DashboardUI.showNotification) {
                    window.DashboardUI.showNotification('Ironman Mode', 'Ironman mode disabled', 'info');
                }
            }
        }
    }

    /**
     * Show delete confirmation
     */
    function showDeleteConfirmation(slotNumber) {
        const modal = document.getElementById('delete-confirm-modal');
        const message = document.getElementById('delete-confirm-message');
        const confirmBtn = document.getElementById('btn-confirm-delete');
        const cancelBtn = document.getElementById('btn-cancel-delete');

        if (!modal || !message || !confirmBtn || !cancelBtn) return;

        message.textContent = 'Are you sure you want to delete the save in Slot ' + slotNumber + '? This action cannot be undone.';

        modal.classList.remove('hidden');

        // Remove old listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        const newCancelBtn = cancelBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        // Add new listeners
        newConfirmBtn.addEventListener('click', () => {
            handleDeleteSave(slotNumber);
            closeDeleteConfirmModal();
        });

        newCancelBtn.addEventListener('click', closeDeleteConfirmModal);
    }

    /**
     * Close delete confirmation modal
     */
    function closeDeleteConfirmModal() {
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Handle delete save
     */
    function handleDeleteSave(slotNumber) {
        if (!window.SaveLoadSystem) return;

        const result = window.SaveLoadSystem.deleteSave(slotNumber);

        if (result.success) {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Save Deleted', result.message, 'info');
            }
            populateSaveSlots();
        } else {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Delete Failed', result.message, 'error');
            }
        }
    }

    /**
     * Handle clear all saves
     */
    function handleClearAllSaves() {
        if (!confirm('Are you ABSOLUTELY SURE you want to delete ALL save data? This cannot be undone!')) {
            return;
        }

        if (!confirm('This is your last warning. All saves will be permanently deleted. Continue?')) {
            return;
        }

        if (!window.SaveLoadSystem) return;

        const result = window.SaveLoadSystem.clearAllSaves();

        if (result.success) {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('All Saves Cleared', result.message, 'warning');
            }
            populateSaveSlots();
            updateStorageInfo();
        } else {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Clear Failed', result.message, 'error');
            }
        }
    }

    /**
     * Update storage info
     */
    function updateStorageInfo() {
        if (!window.SaveLoadSystem) return;

        const storageInfo = window.SaveLoadSystem.checkStorageAvailability();
        const storageBar = document.querySelector('.storage-fill');
        const storageText = document.querySelector('.storage-text');

        if (!storageBar || !storageText) return;

        if (storageInfo.available) {
            const percentUsed = storageInfo.percentUsed;
            storageBar.style.width = percentUsed + '%';
            storageText.textContent = 'Using ' + percentUsed + '% of available localStorage (~' + Math.round(storageInfo.usedSpace / 1024) + 'KB used)';
        } else {
            storageText.textContent = 'Storage unavailable: ' + storageInfo.error;
        }
    }

    /**
     * Public API
     */
    return {
        init: init,
        showSaveModal: showSaveModal,
        closeSaveModal: closeSaveModal
    };
})();
