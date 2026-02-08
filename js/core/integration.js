/**
 * HOLLYWOOD MOGUL - INTEGRATION LAYER
 * Wires all game systems together. Handles orchestration that doesn't
 * belong in any single system: script greenlighting, distribution,
 * loans, and system initialization.
 *
 * Phase 2 refactor:
 * - Removed duplicate UI rendering (game-state.js owns its DOM elements)
 * - Removed duplicate event processing (game-state.js dispatches to systems)
 * - Removed 5-second polling timer (EventBus replaces it)
 * - Removed duplicate event listeners (game-state.js binds them)
 * - Consolidated era classification to use TimeSystem
 */

window.Integration = (function() {
    'use strict';

    var isInitialized = false;
    var boundDelegationHandler = null;

    // ================================================================
    // INITIALIZATION
    // ================================================================

    function init() {
        if (isInitialized) {
            console.warn('Integration already initialized');
            return;
        }

        console.log('Initializing game integration...');

        initializeSystems();
        wireEventDelegation();
        subscribeToEvents();

        isInitialized = true;
        console.log('Game integration complete!');
    }

    /**
     * Initialize all optional game systems in correct order.
     */
    function initializeSystems() {
        var systems = [
            { name: 'DashboardUI', ref: window.DashboardUI },
            { name: 'TimelineUI', ref: window.TimelineUI },
            { name: 'HollywoodMogul', ref: window.HollywoodMogul },
            { name: 'RivalStudios', ref: window.RivalStudios, needsState: true },
            { name: 'DashboardRivalExtensions', ref: window.DashboardRivalExtensions },
            { name: 'SaveLoadUI', ref: window.SaveLoadUI },
            { name: 'KeyboardShortcuts', ref: window.KeyboardShortcuts },
            { name: 'ScenarioUI', ref: window.ScenarioUI }
        ];

        systems.forEach(function(sys) {
            if (sys.ref && typeof sys.ref.init === 'function') {
                try {
                    if (sys.needsState && window.HollywoodMogul) {
                        sys.ref.init(window.HollywoodMogul.getGameState());
                    } else {
                        sys.ref.init();
                    }
                    console.log(sys.name + ' initialized');
                } catch (error) {
                    console.error('Failed to initialize ' + sys.name, error);
                }
            }
        });
    }

    // ================================================================
    // EVENT DELEGATION
    // Uses document-level event delegation for dynamically created buttons.
    // Static buttons are handled by game-state.js.
    // ================================================================

    function wireEventDelegation() {
        // Remove previous listener to prevent accumulation
        if (boundDelegationHandler) {
            document.removeEventListener('click', boundDelegationHandler);
        }

        boundDelegationHandler = function(e) {
            // Greenlight script buttons
            if (e.target.classList.contains('greenlight-btn') && e.target.dataset.scriptId) {
                handleScriptGreenlight(e.target.dataset.scriptId);
            }

            // Distribution buttons
            if (e.target.classList.contains('distribute-btn')) {
                handleDistribution(e.target.dataset.filmId);
            }

            // Loan buttons
            if (e.target.classList.contains('loan-btn')) {
                handleLoan(e.target.dataset.loanType, parseInt(e.target.dataset.amount));
            }
        };

        document.addEventListener('click', boundDelegationHandler);
    }

    // ================================================================
    // EVENTBUS SUBSCRIPTIONS
    // React to state changes without polling or duplicating rendering.
    // ================================================================

    function subscribeToEvents() {
        if (!window.EventBus) return;

        // After time advances, handle integration-specific updates
        window.EventBus.on('time:advanced', function(data) {
            var gameState = window.HollywoodMogul.getGameState();

            // Ironman auto-save
            if (window.SaveLoadSystem && window.SaveLoadSystem.isIronmanMode) {
                if (window.SaveLoadSystem.isIronmanMode()) {
                    window.SaveLoadSystem.ironmanSave(gameState);
                }
            }
        });

        // After monthly processing, handle integration-specific monthly tasks
        window.EventBus.on('month:processed', function(data) {
            var gameState = window.HollywoodMogul.getGameState();

            // Newspaper
            if (window.NewspaperSystem && window.NewspaperSystem.showNewspaper) {
                setTimeout(function() {
                    window.NewspaperSystem.showNewspaper(gameState);
                }, 300);
            }

            // Monthly loan processing
            if (window.FinancialSystem && window.FinancialSystem.processMonthlyLoans) {
                window.FinancialSystem.processMonthlyLoans(gameState);
            }

            // Scenario victory checks
            if (window.ScenarioUI && window.ScenarioUI.checkVictoryConditions) {
                window.ScenarioUI.checkVictoryConditions(gameState);
            }
        });

        // Update era display when time changes
        window.EventBus.on('state:changed', function(gameState) {
            updateEraDisplay(gameState);
        });

        // Game end handling
        window.EventBus.on('game:ended', function(data) {
            console.log('Game ended:', data.type);
        });
    }

    // ================================================================
    // ERA DISPLAY (uses TimeSystem as single source of truth)
    // ================================================================

    function updateEraDisplay(gameState) {
        var eraElement = document.getElementById('current-era');
        if (!eraElement) return;

        if (window.TimeSystem && window.TimeSystem.getCurrentPeriod) {
            var year = gameState.currentDate ? gameState.currentDate.getFullYear() : gameState.gameYear;
            var era = window.TimeSystem.getCurrentPeriod(year);
            if (era) {
                eraElement.textContent = era.name;
                eraElement.className = 'era-indicator era-' + era.key.toLowerCase();
            }
        }
    }

    // ================================================================
    // ORCHESTRATION: SCRIPT GREENLIGHTING
    // ================================================================

    function handleScriptGreenlight(scriptId) {
        var gameState = window.HollywoodMogul.getGameState();
        var script = gameState.availableScripts.find(function(s) { return s.id === scriptId; });

        if (!script) {
            console.error('Script not found:', scriptId);
            return;
        }

        var minBudget = script.budget && script.budget.min ? script.budget.min : (script.budget || 50000);
        if (gameState.cash < minBudget) {
            window.HollywoodMogul.addAlert({
                type: 'warning',
                icon: '\u26A0\uFE0F',
                message: 'Insufficient funds for "' + script.title + '". Need $' + minBudget.toLocaleString() + '.',
                priority: 'high'
            });
            return;
        }

        if (window.ProductionSystem && window.ProductionSystem.startProduction) {
            var budget = script.budget && script.budget.min ? script.budget.min : script.budget;
            window.ProductionSystem.startProduction(scriptId, budget);

            window.HollywoodMogul.addAlert({
                type: 'success',
                icon: '\uD83C\uDFAC',
                message: 'Production begins on "' + script.title + '"!',
                priority: 'high'
            });

            window.HollywoodMogul.closeModal();

            // Ironman auto-save
            if (window.SaveLoadSystem && window.SaveLoadSystem.isIronmanMode) {
                if (window.SaveLoadSystem.isIronmanMode()) {
                    window.SaveLoadSystem.ironmanSave(gameState);
                }
            }
        }
    }

    // ================================================================
    // ORCHESTRATION: DISTRIBUTION
    // ================================================================

    function handleDistribution(filmId) {
        var gameState = window.HollywoodMogul.getGameState();
        var allFilms = [].concat(gameState.activeFilms || [], gameState.completedFilms || []);
        var film = allFilms.find(function(f) { return f.id === filmId; });

        if (!film) {
            console.error('Film not found:', filmId);
            return;
        }

        if (window.BoxOfficeSystem && window.BoxOfficeSystem.showDistributionModal) {
            window.BoxOfficeSystem.showDistributionModal(filmId);
        } else {
            showSimpleDistributionModal(film, filmId);
        }
    }

    function showSimpleDistributionModal(film, filmId) {
        var modalContent = document.getElementById('modal-content');
        var modalOverlay = document.getElementById('modal-overlay');
        if (!modalContent || !modalOverlay) return;

        modalContent.innerHTML = '';

        var h2 = document.createElement('h2');
        h2.textContent = 'Distribute "' + film.title + '"';
        modalContent.appendChild(h2);

        var p = document.createElement('p');
        p.textContent = 'Select distribution strategy:';
        modalContent.appendChild(p);

        var strategies = [
            { key: 'wide', label: 'Wide Release' },
            { key: 'limited', label: 'Limited Release' }
        ];

        strategies.forEach(function(strat) {
            var btn = document.createElement('button');
            btn.className = 'action-btn primary';
            btn.textContent = strat.label;
            btn.addEventListener('click', function() {
                executeDistribution(filmId, strat.key);
            });
            modalContent.appendChild(btn);
        });

        var cancelBtn = document.createElement('button');
        cancelBtn.className = 'action-btn secondary';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', function() {
            window.HollywoodMogul.closeModal();
        });
        modalContent.appendChild(cancelBtn);

        modalOverlay.classList.remove('hidden');
    }

    function executeDistribution(filmId, strategy) {
        if (window.BoxOfficeSystem && window.BoxOfficeSystem.releaseFilm) {
            var result = window.BoxOfficeSystem.releaseFilm(filmId, strategy);

            if (result && result.success) {
                window.HollywoodMogul.addAlert({
                    type: 'success',
                    icon: '\uD83C\uDF9E\uFE0F',
                    message: 'Film released with ' + strategy + ' distribution',
                    priority: 'high'
                });
            }
        }

        window.HollywoodMogul.closeModal();
    }

    // ================================================================
    // ORCHESTRATION: LOANS
    // ================================================================

    function handleLoan(loanType, amount) {
        if (window.FinancialSystem && window.FinancialSystem.takeLoan) {
            var result = window.FinancialSystem.takeLoan(loanType, amount);

            if (result && result.success) {
                window.HollywoodMogul.addAlert({
                    type: 'info',
                    icon: '\uD83D\uDCB0',
                    message: 'Loan approved: $' + amount.toLocaleString(),
                    priority: 'medium'
                });
            } else {
                window.HollywoodMogul.addAlert({
                    type: 'warning',
                    icon: '\u26A0\uFE0F',
                    message: (result && result.message) || 'Loan application denied',
                    priority: 'medium'
                });
            }
        }
    }

    // ================================================================
    // HELPERS
    // ================================================================

    function formatProductionPhase(phase) {
        if (!phase) return 'In Production';

        var normalized = phase.toString().toLowerCase();
        var mapping = {
            'development': 'Development',
            'pre_production': 'Pre-Production',
            'preproduction': 'Pre-Production',
            'principal_photography': 'Principal Photography',
            'shooting': 'Principal Photography',
            'post_production': 'Post-Production',
            'distribution_prep': 'Distribution Prep',
            'post_production_complete': 'Ready for Release',
            'completed': 'Completed',
            'in_theaters': 'In Theaters'
        };

        return mapping[normalized] || phase;
    }

    // ================================================================
    // PUBLIC API
    // ================================================================

    return {
        init: init,
        handleScriptGreenlight: handleScriptGreenlight,
        handleDistribution: handleDistribution,
        executeDistribution: executeDistribution,
        handleLoan: handleLoan,
        formatProductionPhase: formatProductionPhase
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() { window.Integration.init(); }, 100);
    });
} else {
    setTimeout(function() { window.Integration.init(); }, 100);
}
