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

        // Tutorial auto-start waits for a real game (audit UX-006: it used
        // to open on top of the scenario picker at boot and eat every
        // pointer event). Offer it shortly after the campaign begins.
        if (window.EventBus && window.TutorialSystem) {
            window.EventBus.on('game:started', function () {
                setTimeout(function () {
                    const gs = window.HollywoodMogul?.getGameState();
                    if (gs) window.TutorialSystem.checkAutoStart(gs);
                }, 1500);
            });
        }

        // Escape always dismisses the tutorial overlay (UX-006)
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && window.TutorialSystem &&
                window.TutorialSystem.isActive && window.TutorialSystem.isActive()) {
                window.TutorialSystem.skipTutorial();
            }
        });
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
