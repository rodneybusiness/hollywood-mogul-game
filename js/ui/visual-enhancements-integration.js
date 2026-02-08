/**
 * HOLLYWOOD MOGUL - VISUAL ENHANCEMENTS INTEGRATION
 * Patches existing systems to integrate visual animations
 */

(function() {
    'use strict';

    // Wait for all systems to load
    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeVisualEnhancements, 1000);
    });

    function initializeVisualEnhancements() {

        // Integrate with Dashboard UI
        if (window.DashboardUI && window.DashboardVisuals) {
            enhanceDashboardUI();
        }

        // Integrate with Production System
        if (window.ProductionSystem && window.DashboardVisuals) {
            enhanceProductionSystem();
        }

        // Integrate with Box Office System
        if (window.BoxOfficeSystem && window.DashboardVisuals) {
            enhanceBoxOfficeSystem();
        }

    }

    /**
     * Enhance Dashboard UI with visual production cards
     */
    function enhanceDashboardUI() {
        // Store original updateFilmsInProduction function
        const originalUpdate = window.DashboardUI.updateDashboard;

        // Wrap it to use enhanced production cards
        if (originalUpdate) {
            window.DashboardUI.updateDashboard = function() {
                // Call original update
                originalUpdate.call(this);

                // Enhance production cards
                enhanceProductionCards();
            };
        }

    }

    /**
     * Enhance production cards with visual elements
     */
    function enhanceProductionCards() {
        const productionContainer = document.getElementById('films-in-production');
        if (!productionContainer) return;

        const gameState = window.HollywoodMogul?.getGameState();
        if (!gameState) return;

        const productionFilms = getAllFilms(gameState).filter(film => {
            const phase = normalizePhase(film.phase);
            return phase && phase !== 'completed' && phase !== 'in_theaters';
        });

        if (productionFilms.length === 0) return;

        // Replace with enhanced cards
        productionContainer.innerHTML = productionFilms.map(film =>
            window.DashboardVisuals.createEnhancedProductionCard(film)
        ).join('');
    }

    /**
     * Enhance Production System with milestone animations
     */
    function enhanceProductionSystem() {
        // Hook into phase advancement
        if (window.ProductionSystem && window.ProductionSystem.PRODUCTION_PHASES) {
            // Create a custom event listener for phase changes
            window.addEventListener('filmPhaseAdvanced', function(event) {
                const { filmTitle, phaseName } = event.detail;
                if (window.DashboardVisuals && window.DashboardVisuals.showProductionMilestone) {
                    window.DashboardVisuals.showProductionMilestone(filmTitle, phaseName);
                }
            });

        }

        // Enhance production event modals
        if (window.ProductionSystem) {
            window.addEventListener('productionEventTriggered', function(event) {
                const { eventData, film } = event.detail;
                if (window.DashboardVisuals && window.DashboardVisuals.showEnhancedProductionEvent) {
                    window.DashboardVisuals.showEnhancedProductionEvent(eventData, film);
                }
            });

        }
    }

    /**
     * Enhance Box Office System with weekly update animations
     */
    function enhanceBoxOfficeSystem() {
        // Create event listener for weekly box office updates
        window.addEventListener('weeklyBoxOfficeUpdate', function(event) {
            const { filmTitle, weekNumber, grossRevenue, lastWeekRevenue, totalGross } = event.detail;

            if (window.DashboardVisuals && window.DashboardVisuals.showWeeklyBoxOfficeUpdate) {
                window.DashboardVisuals.showWeeklyBoxOfficeUpdate(
                    filmTitle,
                    weekNumber,
                    grossRevenue,
                    lastWeekRevenue,
                    totalGross
                );
            }
        });

    }

    // Helper functions
    function getAllFilms(gameState) {
        const collections = [];
        if (Array.isArray(gameState.films) && gameState.films.length > 0) {
            collections.push(...gameState.films);
        }
        if (Array.isArray(gameState.activeFilms)) {
            collections.push(...gameState.activeFilms);
        }
        if (Array.isArray(gameState.completedFilms)) {
            collections.push(...gameState.completedFilms);
        }

        const uniqueFilms = new Map();
        collections.forEach(film => {
            if (film && film.id && !uniqueFilms.has(film.id)) {
                uniqueFilms.set(film.id, film);
            }
        });

        return Array.from(uniqueFilms.values());
    }

    function normalizePhase(phase) {
        if (!phase) return '';
        const mapping = {
            'DEVELOPMENT': 'greenlit',
            'PRE_PRODUCTION': 'pre_production',
            'PRINCIPAL_PHOTOGRAPHY': 'shooting',
            'POST_PRODUCTION': 'post_production',
            'DISTRIBUTION_PREP': 'post_production_complete',
            'COMPLETED': 'post_production_complete'
        };
        const normalized = mapping[phase] || phase;
        return typeof normalized === 'string' ? normalized.toLowerCase() : '';
    }
})();
