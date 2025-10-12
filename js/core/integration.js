/**
 * HOLLYWOOD MOGUL - INTEGRATION LAYER
 * Wires all game systems together and synchronizes state with UI
 */

window.Integration = (function() {
    'use strict';

    let isInitialized = false;

    /**
     * Initialize all game systems and wire them together
     */
    function init() {
        if (isInitialized) {
            console.warn('Integration already initialized');
            return;
        }

        console.log('Initializing game integration...');

        // Initialize all systems in correct order
        initializeSystems();

        // Wire event listeners
        wireEventListeners();

        // Set up periodic updates
        setupPeriodicUpdates();

        // Sync initial state to UI
        syncAllToUI();

        // Hide loading screen after initialization
        hideLoadingScreen();

        isInitialized = true;
        console.log('Game integration complete!');
    }

    /**
     * Hide the loading screen
     */
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                console.log('Loading screen hidden');
            }, 500);
        }
    }

    /**
     * Initialize all game systems
     */
    function initializeSystems() {
        // Initialize dashboard UI
        if (window.DashboardUI && window.DashboardUI.init) {
            window.DashboardUI.init();
        }

        // Initialize game state (already done in game-state.js)
        if (window.HollywoodMogul) {
            console.log('Game state initialized');
        }

        // Other systems initialize on demand
    }

    /**
     * Wire all event listeners
     */
    function wireEventListeners() {
        // Time advancement
        wireTimeControls();

        // Script management
        wireScriptControls();

        // Production management
        wireProductionControls();

        // Financial controls
        wireFinancialControls();

        // Modal controls
        wireModalControls();
    }

    /**
     * Wire time control buttons
     */
    function wireTimeControls() {
        const advanceWeekBtn = document.getElementById('btn-advance-week');
        const advanceMonthBtn = document.getElementById('btn-advance-month');

        if (advanceWeekBtn) {
            advanceWeekBtn.addEventListener('click', () => {
                handleTimeAdvance('week');
            });
        }

        if (advanceMonthBtn) {
            advanceMonthBtn.addEventListener('click', () => {
                handleTimeAdvance('month');
            });
        }
    }

    /**
     * Wire script/film controls
     */
    function wireScriptControls() {
        const reviewScriptsBtn = document.getElementById('btn-new-script');

        if (reviewScriptsBtn) {
            reviewScriptsBtn.addEventListener('click', () => {
                showScriptLibrary();
            });
        }

        // Dynamically created buttons use event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('greenlight-btn')) {
                const scriptId = e.target.dataset.scriptId;
                handleScriptGreenlight(scriptId);
            }
        });
    }

    /**
     * Wire production controls
     */
    function wireProductionControls() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('distribute-btn')) {
                const filmId = e.target.dataset.filmId;
                handleDistribution(filmId);
            }
        });
    }

    /**
     * Wire financial controls
     */
    function wireFinancialControls() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('loan-btn')) {
                const loanType = e.target.dataset.loanType;
                const amount = parseInt(e.target.dataset.amount);
                handleLoan(loanType, amount);
            }
        });
    }

    /**
     * Wire modal controls
     */
    function wireModalControls() {
        const modalOverlay = document.getElementById('modal-overlay');

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target.id === 'modal-overlay') {
                    window.HollywoodMogul.closeModal();
                }
            });
        }

        // ESC key closes modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.HollywoodMogul.closeModal();
            }
        });
    }

    /**
     * Handle time advancement
     */
    function handleTimeAdvance(period) {
        const gameState = window.HollywoodMogul.getGameState();

        if (gameState.gameEnded) {
            console.log('Game has ended, cannot advance time');
            return;
        }

        console.log(`Advancing time: ${period}`);

        // Advance the time
        window.HollywoodMogul.advanceTime(period);

        // Process weekly/monthly systems
        if (period === 'week') {
            processWeeklyUpdates(gameState);
        } else if (period === 'month') {
            processMonthlyUpdates(gameState);
        }

        // Sync to UI
        syncAllToUI();

        // Check for game end conditions
        window.HollywoodMogul.checkGameEndConditions();
    }

    /**
     * Process weekly game updates
     */
    function processWeeklyUpdates(gameState) {
        // Process film productions
        if (window.ProductionSystem && window.ProductionSystem.processWeeklyProduction) {
            window.ProductionSystem.processWeeklyProduction(gameState);
        }

        // Process box office
        if (window.BoxOfficeSystem && window.BoxOfficeSystem.processWeeklyBoxOffice) {
            window.BoxOfficeSystem.processWeeklyBoxOffice(gameState);
        }

        // Process random events
        if (window.EventSystem && window.EventSystem.processWeeklyEventCheck) {
            window.EventSystem.processWeeklyEventCheck(gameState);
        }
    }

    /**
     * Process monthly game updates
     */
    function processMonthlyUpdates(gameState) {
        // Generate new scripts
        if (window.ScriptLibrary && window.ScriptLibrary.generateMonthlyScripts) {
            const newScripts = window.ScriptLibrary.generateMonthlyScripts(gameState);
            if (newScripts && newScripts.length > 0) {
                gameState.availableScripts.push(...newScripts);
                window.HollywoodMogul.addAlert({
                    type: 'info',
                    icon: '📜',
                    message: `${newScripts.length} new script(s) available for review`,
                    priority: 'medium'
                });
            }
        }

        // Check for historical events
        if (window.HistoricalEvents && window.HistoricalEvents.checkForEvents) {
            window.HistoricalEvents.checkForEvents(gameState);
        }

        // Process loans
        if (window.FinancialSystem && window.FinancialSystem.processMonthlyLoans) {
            window.FinancialSystem.processMonthlyLoans(gameState);
        }
    }

    /**
     * Show script library modal
     */
    function showScriptLibrary() {
        const gameState = window.HollywoodMogul.getGameState();

        if (window.ScriptLibrary && window.ScriptLibrary.showScriptSelection) {
            window.ScriptLibrary.showScriptSelection(gameState);
        } else {
            window.HollywoodMogul.showModal(`
                <h2>Script Library</h2>
                <p>Script selection system not available.</p>
                <button onclick="HollywoodMogul.closeModal()" class="action-btn primary">Close</button>
            `);
        }
    }

    /**
     * Handle script greenlight
     */
    function handleScriptGreenlight(scriptId) {
        const gameState = window.HollywoodMogul.getGameState();
        const script = gameState.availableScripts.find(s => s.id === scriptId);

        if (!script) {
            console.error('Script not found:', scriptId);
            return;
        }

        // Check if we have enough cash
        const minBudget = script.budget?.min || script.budget || 50000;
        if (gameState.cash < minBudget) {
            window.HollywoodMogul.addAlert({
                type: 'warning',
                icon: '⚠️',
                message: `Insufficient funds for "${script.title}". Need $${minBudget.toLocaleString()}.`,
                priority: 'high'
            });
            return;
        }

        // Start production via ProductionSystem
        if (window.ProductionSystem && window.ProductionSystem.startProduction) {
            const budget = script.budget?.min || script.budget;
            window.ProductionSystem.startProduction(scriptId, budget);

            window.HollywoodMogul.addAlert({
                type: 'success',
                icon: '🎬',
                message: `Production begins on "${script.title}"!`,
                priority: 'high'
            });

            window.HollywoodMogul.closeModal();
            syncAllToUI();
        } else {
            console.error('ProductionSystem not available');
        }
    }

    /**
     * Handle film distribution
     */
    function handleDistribution(filmId) {
        const gameState = window.HollywoodMogul.getGameState();
        const film = (gameState.completedFilms || []).find(f => f.id === filmId);

        if (!film) {
            console.error('Film not found:', filmId);
            return;
        }

        // Show distribution strategy modal
        if (window.BoxOfficeSystem && window.BoxOfficeSystem.showDistributionModal) {
            window.BoxOfficeSystem.showDistributionModal(filmId);
        } else {
            // Simple distribution
            window.HollywoodMogul.showModal(`
                <h2>Distribute "${film.title}"</h2>
                <p>Select distribution strategy:</p>
                <button onclick="Integration.executeDistribution('${filmId}', 'wide')" class="action-btn primary">
                    Wide Release
                </button>
                <button onclick="Integration.executeDistribution('${filmId}', 'limited')" class="action-btn secondary">
                    Limited Release
                </button>
                <button onclick="HollywoodMogul.closeModal()" class="action-btn secondary">
                    Cancel
                </button>
            `);
        }
    }

    /**
     * Execute distribution strategy
     */
    function executeDistribution(filmId, strategy) {
        if (window.BoxOfficeSystem && window.BoxOfficeSystem.releaseFilm) {
            const result = window.BoxOfficeSystem.releaseFilm(filmId, strategy);

            if (result && result.success) {
                window.HollywoodMogul.addAlert({
                    type: 'success',
                    icon: '🎞️',
                    message: `Film released with ${strategy} distribution`,
                    priority: 'high'
                });
            }
        }

        window.HollywoodMogul.closeModal();
        syncAllToUI();
    }

    /**
     * Handle loan application
     */
    function handleLoan(loanType, amount) {
        if (window.FinancialSystem && window.FinancialSystem.takeLoan) {
            const result = window.FinancialSystem.takeLoan(loanType, amount);

            if (result && result.success) {
                window.HollywoodMogul.addAlert({
                    type: 'info',
                    icon: '💰',
                    message: `Loan approved: $${amount.toLocaleString()}`,
                    priority: 'medium'
                });
                syncAllToUI();
            } else {
                window.HollywoodMogul.addAlert({
                    type: 'warning',
                    icon: '⚠️',
                    message: result?.message || 'Loan application denied',
                    priority: 'medium'
                });
            }
        }
    }

    /**
     * Set up periodic UI updates
     */
    function setupPeriodicUpdates() {
        // Update UI every 5 seconds (for any background changes)
        setInterval(() => {
            if (!window.HollywoodMogul.getGameState().gameEnded) {
                syncAllToUI();
            }
        }, 5000);
    }

    /**
     * Sync all game state to UI
     */
    function syncAllToUI() {
        const gameState = window.HollywoodMogul.getGameState();

        // Update dashboard if available
        if (window.DashboardUI && window.DashboardUI.updateAll) {
            window.DashboardUI.updateAll(gameState);
        } else if (window.DashboardUI && window.DashboardUI.updateDashboard) {
            window.DashboardUI.updateDashboard();
        }

        // Update individual components (fallback)
        updateFinancialDisplay(gameState);
        updateProductionDisplay(gameState);
        updateTimeDisplay(gameState);
    }

    /**
     * Update financial display (fallback if DashboardUI not available)
     */
    function updateFinancialDisplay(gameState) {
        const cashElement = document.getElementById('cash-display');
        if (cashElement) {
            cashElement.textContent = `$${gameState.cash.toLocaleString()}`;
            cashElement.className = gameState.cash < 0 ? 'card-value negative' : 'card-value';
        }

        const burnElement = document.getElementById('burn-display');
        if (burnElement) {
            burnElement.textContent = `-$${(gameState.monthlyBurn || 30000).toLocaleString()}`;
        }

        const runwayElement = document.getElementById('runway-display');
        if (runwayElement && window.HollywoodMogul.calculateRunwayWeeks) {
            const runway = window.HollywoodMogul.calculateRunwayWeeks();
            runwayElement.textContent = runway > 100 ? '∞' : `${runway} weeks`;
        }
    }

    /**
     * Update production display (fallback)
     */
    function updateProductionDisplay(gameState) {
        const container = document.getElementById('active-productions');
        if (!container) return;

        if (!gameState.activeFilms || gameState.activeFilms.length === 0) {
            container.innerHTML = `
                <div class="no-productions">
                    <p>No films currently in production</p>
                    <button id="btn-new-script" class="action-btn primary">REVIEW SCRIPTS</button>
                </div>
            `;
            // Re-wire button
            const btn = document.getElementById('btn-new-script');
            if (btn) {
                btn.addEventListener('click', showScriptLibrary);
            }
        } else {
            container.innerHTML = gameState.activeFilms.map(film => `
                <div class="production-item">
                    <h3>${film.title}</h3>
                    <p>Status: ${film.status || 'In Production'}</p>
                    <p>Budget: $${(film.budget || 50000).toLocaleString()}</p>
                    <p>Quality: ${film.quality || 50}/100</p>
                </div>
            `).join('');
        }
    }

    /**
     * Update time display (fallback)
     */
    function updateTimeDisplay(gameState) {
        const dateElement = document.getElementById('current-date');
        if (dateElement && window.HollywoodMogul.formatDate) {
            dateElement.textContent = window.HollywoodMogul.formatDate(gameState.currentDate);
        }
    }

    /**
     * Public API
     */
    return {
        init,
        handleTimeAdvance,
        handleScriptGreenlight,
        handleDistribution,
        executeDistribution,
        handleLoan,
        syncAllToUI,
        showScriptLibrary
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.Integration.init(), 100);
    });
} else {
    // DOM already loaded
    setTimeout(() => window.Integration.init(), 100);
}
