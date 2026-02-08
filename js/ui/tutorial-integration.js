/**
 * HOLLYWOOD MOGUL - TUTORIAL & HELP SYSTEM INTEGRATION
 * Integrates tutorial and help systems with the main game
 */

(function() {
    'use strict';

    /**
     * Initialize tutorial and help systems when game loads
     */
    function initializeSystems() {
        // Initialize tutorial system
        if (window.TutorialSystem) {
            window.TutorialSystem.init();
        }

        // Initialize help system
        if (window.HelpSystem) {
            window.HelpSystem.init();
        }

        // Check if tutorial should auto-start
        const gameState = window.HollywoodMogul?.getGameState();
        if (gameState && window.TutorialSystem) {
            window.TutorialSystem.checkAutoStart(gameState);
        }
    }

    /**
     * Add tutorial hooks to dashboard navigation
     */
    function addNavigationHooks() {
        // Hook into navigation buttons
        document.addEventListener('click', function(e) {
            if (!window.TutorialSystem || !window.TutorialSystem.isActive()) return;

            // Check for scripts navigation
            if (e.target.matches('[data-section="scripts"]') ||
                e.target.closest('[data-section="scripts"]')) {
                setTimeout(() => {
                    window.TutorialSystem.completeAction('navigate_scripts');
                }, 100);
            }
        });
    }

    /**
     * Add tutorial hooks to greenlight actions
     */
    function addGreenlightHooks() {
        // Hook into greenlight buttons
        document.addEventListener('click', function(e) {
            if (!window.TutorialSystem || !window.TutorialSystem.isActive()) return;

            if (e.target.matches('.greenlight-btn') ||
                e.target.closest('.greenlight-btn')) {
                // Wait for greenlight to complete
                setTimeout(() => {
                    window.TutorialSystem.completeAction('greenlight_film');
                }, 500);
            }
        });
    }

    /**
     * Add mission progress tracking
     */
    function addMissionTracking() {
        // Check missions on time advancement
        document.addEventListener('click', function(e) {
            if (e.target.matches('#btn-advance-week') ||
                e.target.matches('#btn-advance-month') ||
                e.target.closest('#btn-advance-week') ||
                e.target.closest('#btn-advance-month')) {

                // Check mission progress after time advances
                setTimeout(() => {
                    const gameState = window.HollywoodMogul?.getGameState();
                    if (gameState && window.TutorialSystem) {
                        window.TutorialSystem.checkMissionProgress(gameState);
                    }
                }, 1000);
            }
        });

        // Check missions periodically
        setInterval(() => {
            const gameState = window.HollywoodMogul?.getGameState();
            if (gameState && window.TutorialSystem && gameState.tutorialCompleted) {
                window.TutorialSystem.checkMissionProgress(gameState);
            }
        }, 5000);
    }

    /**
     * Initialize integration when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeSystems();
            addNavigationHooks();
            addGreenlightHooks();
            addMissionTracking();
        });
    } else {
        // DOM already loaded
        setTimeout(() => {
            initializeSystems();
            addNavigationHooks();
            addGreenlightHooks();
            addMissionTracking();
        }, 500);
    }
})();
