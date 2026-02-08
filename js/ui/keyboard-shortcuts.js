/**
 * HOLLYWOOD MOGUL - KEYBOARD SHORTCUTS
 * Handles keyboard shortcuts for the game
 */

window.KeyboardShortcuts = (function() {
    'use strict';

    var isInitialized = false;

    /**
     * Initialize keyboard shortcuts
     */
    function init() {
        if (isInitialized) return;
        document.addEventListener('keydown', handleKeyDown);
        isInitialized = true;
    }

    /**
     * Clean up keyboard shortcuts
     */
    function destroy() {
        document.removeEventListener('keydown', handleKeyDown);
        isInitialized = false;
    }

    /**
     * Handle keydown events
     */
    function handleKeyDown(event) {
        // Don't trigger shortcuts when typing in input fields
        if (event.target.tagName === 'INPUT' ||
            event.target.tagName === 'TEXTAREA' ||
            event.target.isContentEditable) {
            return;
        }

        // Ctrl+S: Quick Save
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            handleQuickSave();
            return;
        }

        // Ctrl+L: Quick Load
        if (event.ctrlKey && event.key === 'l') {
            event.preventDefault();
            handleQuickLoad();
            return;
        }

        // Ctrl+Shift+S: Open Save Modal
        if (event.ctrlKey && event.shiftKey && event.key === 'S') {
            event.preventDefault();
            if (window.SaveLoadUI) {
                window.SaveLoadUI.showSaveModal('save');
            }
            return;
        }

        // Ctrl+Shift+L: Open Load Modal
        if (event.ctrlKey && event.shiftKey && event.key === 'L') {
            event.preventDefault();
            if (window.SaveLoadUI) {
                window.SaveLoadUI.showSaveModal('load');
            }
            return;
        }

        // ESC: Close modals
        if (event.key === 'Escape') {
            if (window.SaveLoadUI) {
                window.SaveLoadUI.closeSaveModal();
            }
            // Also close other modals if needed
            const modals = document.querySelectorAll('.modal-overlay:not(.hidden)');
            modals.forEach(modal => {
                modal.classList.add('hidden');
            });
            return;
        }
    }

    /**
     * Handle quick save shortcut
     */
    function handleQuickSave() {
        if (!window.SaveLoadSystem || !window.HollywoodMogul) {
            return;
        }

        const gameState = window.HollywoodMogul.getGameState();

        // If Ironman mode, use Ironman save
        if (window.SaveLoadSystem.isIronmanMode()) {
            const result = window.SaveLoadSystem.ironmanSave(gameState);
            if (result.success && window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Ironman Save', 'Game saved (Ironman mode)', 'success');
            }
        } else {
            const result = window.SaveLoadSystem.quickSave(gameState);
            if (result.success && window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Quick Save', 'Game saved successfully', 'success');
            }
        }
    }

    /**
     * Handle quick load shortcut
     */
    function handleQuickLoad() {
        if (!window.SaveLoadSystem) {
            return;
        }

        // Check if Ironman mode
        if (window.SaveLoadSystem.isIronmanMode()) {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Quick Load Disabled', 'Quick load is disabled in Ironman mode', 'warning');
            }
            return;
        }

        const result = window.SaveLoadSystem.quickLoad();

        if (result.success) {
            // Apply loaded state
            if (window.HollywoodMogul && result.gameState) {
                const currentState = window.HollywoodMogul.getGameState();
                Object.assign(currentState, result.gameState);

                // Refresh UI
                if (window.DashboardUI && window.DashboardUI.updateDashboard) {
                    window.DashboardUI.updateDashboard();
                }

                if (window.DashboardUI && window.DashboardUI.showNotification) {
                    window.DashboardUI.showNotification('Quick Load', 'Game loaded successfully', 'success');
                }
            }
        } else {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Quick Load Failed', result.message, 'error');
            }
        }
    }

    /**
     * Public API
     */
    return {
        init: init,
        destroy: destroy
    };
})();
