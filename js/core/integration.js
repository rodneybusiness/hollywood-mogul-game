/**
 * HOLLYWOOD MOGUL - INTEGRATION LAYER
 * Wires all game systems together and synchronizes state with UI
 */

window.Integration = (function() {
    'use strict';

    let isInitialized = false;
    let dashboardReady = false;

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
        // Initialize dashboard UI (optional module)
        if (window.DashboardUI && typeof window.DashboardUI.init === 'function') {
            try {
                window.DashboardUI.init();
                dashboardReady = true;
            } catch (error) {
                dashboardReady = false;
                console.error('Dashboard UI failed to initialize. Falling back to integration renderer.', error);
            }
        }

        // Initialize timeline UI (optional module)
        if (window.TimelineUI && typeof window.TimelineUI.init === 'function') {
            try {
                window.TimelineUI.init();
                console.log('Timeline UI initialized');
            } catch (error) {
                console.error('Timeline UI failed to initialize', error);
            }
        }

        // Initialize core game state if available
        if (window.HollywoodMogul && typeof window.HollywoodMogul.init === 'function') {
            try {
                window.HollywoodMogul.init();
            } catch (error) {
                console.error('Failed to initialize Hollywood Mogul core systems', error);
            }
        }

        // Initialize rival studios system
        if (window.RivalStudios && typeof window.RivalStudios.init === 'function') {
            try {
                const gameState = window.HollywoodMogul.getGameState();
                window.RivalStudios.init(gameState);
                console.log('Rival Studios system initialized');
            } catch (error) {
                console.error('Failed to initialize Rival Studios system', error);
            }
        }

        // Initialize dashboard rival extensions
        if (window.DashboardRivalExtensions && typeof window.DashboardRivalExtensions.init === 'function') {
            try {
                window.DashboardRivalExtensions.init();
                console.log('Dashboard Rival Extensions initialized');
            } catch (error) {
                console.error('Failed to initialize Dashboard Rival Extensions', error);
            }
        }

        // Initialize Save/Load UI
        if (window.SaveLoadUI && typeof window.SaveLoadUI.init === 'function') {
            try {
                window.SaveLoadUI.init();
                console.log('Save/Load UI initialized');
            } catch (error) {
                console.error('Failed to initialize Save/Load UI', error);
            }
        }

        // Initialize Keyboard Shortcuts
        if (window.KeyboardShortcuts && typeof window.KeyboardShortcuts.init === 'function') {
            try {
                window.KeyboardShortcuts.init();
                console.log('Keyboard Shortcuts initialized');
            } catch (error) {
                console.error('Failed to initialize Keyboard Shortcuts', error);
            }
        }

        // Initialize Scenario UI
        if (window.ScenarioUI && typeof window.ScenarioUI.init === 'function') {
            try {
                window.ScenarioUI.init();
                console.log('Scenario UI initialized');
            } catch (error) {
                console.error('Failed to initialize Scenario UI', error);
            }
        }
    }

    /**
     * Wire all event listeners
     */
    function wireEventListeners() {
        // Time advancement
        wireTimeControls();

        // Navigation controls
        wireNavigationControls();

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
     * Wire navigation controls
     */
    function wireNavigationControls() {
        const navButtons = document.querySelectorAll('.nav-button');

        if (navButtons.length === 0) {
            return;
        }

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSection = button.dataset.section;
                showSection(targetSection);
            });
        });

        // Ensure the default dashboard section is visible on load
        showSection('dashboard');
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

        // Ironman mode auto-save on every action
        if (window.SaveLoadSystem && window.SaveLoadSystem.isIronmanMode()) {
            window.SaveLoadSystem.ironmanSave(gameState);
        }

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

        // Process rival studios
        if (window.RivalStudios && window.RivalStudios.processWeeklyRivalUpdates) {
            window.RivalStudios.processWeeklyRivalUpdates(gameState);
        }

        // Check for achievement unlocks
        if (window.AchievementSystem && window.AchievementSystem.checkAchievements) {
            window.AchievementSystem.checkAchievements(gameState);
        }
    }

    /**
     * Process monthly game updates
     */
    function processMonthlyUpdates(gameState) {
        // Show newspaper at start of each month
        if (window.NewspaperSystem && window.NewspaperSystem.showNewspaper) {
            // Delay newspaper slightly to allow other updates to process
            setTimeout(() => {
                window.NewspaperSystem.showNewspaper(gameState);
            }, 300);
        }

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

        // Check for achievement unlocks
        if (window.AchievementSystem && window.AchievementSystem.checkAchievements) {
            window.AchievementSystem.checkAchievements(gameState);
        }

        // Check scenario victory conditions
        if (window.ScenarioUI && window.ScenarioUI.checkVictoryConditions) {
            window.ScenarioUI.checkVictoryConditions(gameState);
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

            // Ironman mode auto-save on every action
            if (window.SaveLoadSystem && window.SaveLoadSystem.isIronmanMode()) {
                window.SaveLoadSystem.ironmanSave(gameState);
            }
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

        // Update dashboard module if it successfully initialized
        if (dashboardReady && window.DashboardUI && typeof window.DashboardUI.updateAll === 'function') {
            try {
                window.DashboardUI.updateAll(gameState);
            } catch (error) {
                dashboardReady = false;
                console.error('Dashboard UI update failed. Disabling dashboard module.', error);
            }
        }

        // Update integration-managed UI
        updateFinancialDisplay(gameState);
        updateProductionDisplay(gameState);
        updateTheaterDisplay(gameState);
        updateAlertsDisplay(gameState);
        updateEventsLog(gameState);
        updateTimeDisplay(gameState);
    }

    /**
     * Update financial display (fallback if DashboardUI not available)
     */
    function updateFinancialDisplay(gameState) {
        const cashElement = document.getElementById('current-cash');
        if (cashElement) {
            cashElement.textContent = `$${gameState.cash.toLocaleString()}`;
            cashElement.className = `card-value${gameState.cash < 0 ? ' negative' : ''}`;
        }

        const burnElement = document.getElementById('monthly-burn');
        if (burnElement) {
            burnElement.textContent = `-$${(gameState.monthlyBurn || 30000).toLocaleString()}`;
        }

        const runwayElement = document.getElementById('cash-runway');
        if (runwayElement && window.HollywoodMogul.calculateRunwayWeeks) {
            const runway = window.HollywoodMogul.calculateRunwayWeeks();
            runwayElement.textContent = runway > 100 ? '∞' : `${runway} weeks`;
        }
    }

    /**
     * Update production display (fallback)
     */
    function updateProductionDisplay(gameState) {
        const container = document.getElementById('films-in-production');
        if (!container) return;

        const activeFilms = Array.isArray(gameState.activeFilms) ? gameState.activeFilms : [];

        if (activeFilms.length === 0) {
            container.innerHTML = `
                <div class="no-content">
                    <p>No films currently in production</p>
                    <button id="btn-new-script" class="action-btn primary">REVIEW SCRIPTS</button>
                </div>
            `;

            const btn = document.getElementById('btn-new-script');
            if (btn) {
                btn.addEventListener('click', showScriptLibrary);
            }
            return;
        }

        container.innerHTML = activeFilms.map(film => {
            const phase = formatProductionPhase(film.phase || film.status);
            const budget = film.currentBudget || film.budget || film.originalBudget || 0;
            const progress = Math.min(100, Math.max(0, Math.round((film.completion || 0))));

            return `
                <div class="film-card">
                    <div class="film-header">
                        <h3 class="film-title">${film.title}</h3>
                        <span class="film-budget">$${budget.toLocaleString()}</span>
                    </div>
                    <div class="film-status">${phase}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="film-details">
                        <p>Genre: ${film.genre || 'Unknown'}</p>
                        <p>Quality: ${film.currentQuality || film.scriptQuality || 50}/100</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Update films in theaters display (fallback)
     */
    function updateTheaterDisplay(gameState) {
        const container = document.getElementById('films-in-theaters');
        if (!container) return;

        const completedFilms = Array.isArray(gameState.completedFilms) ? gameState.completedFilms : [];
        const inTheaters = completedFilms.filter(film => film.inTheaters);

        if (inTheaters.length === 0) {
            container.innerHTML = '<div class="no-content">No films currently in theaters</div>';
            return;
        }

        container.innerHTML = inTheaters.map(film => {
            const week = film.theaterWeek || 1;
            const gross = film.weeklyRevenue || film.projectedGross || 0;
            return `
                <div class="film-card">
                    <div class="film-header">
                        <h3 class="film-title">${film.title}</h3>
                        <span class="week-indicator">Week ${week}</span>
                    </div>
                    <div class="film-details">
                        <p>Weekly Gross: $${gross.toLocaleString()}</p>
                        <p>Total Gross: $${(film.totalGross || 0).toLocaleString()}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Update alerts display (fallback)
     */
    function updateAlertsDisplay(gameState) {
        const container = document.getElementById('alerts-section');
        if (!container) return;

        const alerts = Array.isArray(gameState.currentEvents) ? [...gameState.currentEvents] : [];

        if (alerts.length === 0) {
            container.innerHTML = `
                <div class="no-content">No recent alerts</div>
            `;
            return;
        }

        const latestAlerts = alerts.slice(-3).reverse();

        container.innerHTML = latestAlerts.map(alert => `
            <div class="alert-item ${alert.type || ''}">
                <div class="alert-icon">${alert.icon || '📢'}</div>
                <div class="alert-text">${alert.message || ''}</div>
            </div>
        `).join('');
    }

    /**
     * Update events log (fallback)
     */
    function updateEventsLog(gameState) {
        const container = document.getElementById('events-log');
        if (!container) return;

        const events = Array.isArray(gameState.currentEvents) ? [...gameState.currentEvents] : [];

        if (events.length === 0) {
            container.innerHTML = '<div class="no-content">No recent events</div>';
            return;
        }

        const recent = events.slice(-5).reverse();

        container.innerHTML = recent.map(event => `
            <div class="event-item ${event.type || ''}">
                <div class="event-icon">${event.icon || '📜'}</div>
                <div class="event-details">
                    <p class="event-message">${event.message || 'Event'}</p>
                    <span class="event-time">${formatEventTimestamp(event.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    /**
     * Update time display (fallback)
     */
    function updateTimeDisplay(gameState) {
        const dateElement = document.getElementById('current-date');
        if (dateElement && window.HollywoodMogul.formatDate) {
            dateElement.textContent = window.HollywoodMogul.formatDate(gameState.currentDate);
        }

        const eraElement = document.getElementById('current-era');
        if (eraElement) {
            const era = getEraForYear(gameState.currentDate.getFullYear());
            eraElement.textContent = era.label;
            eraElement.className = `era-indicator ${era.className}`;
        }
    }

    function showSection(section) {
        const sections = document.querySelectorAll('.game-section');
        sections.forEach(sec => {
            if (sec.id === `${section}-section`) {
                sec.classList.add('active');
                sec.style.display = 'block';
            } else {
                sec.classList.remove('active');
                sec.style.display = 'none';
            }
        });

        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(btn => {
            if (btn.dataset.section === section) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function formatProductionPhase(phase) {
        if (!phase) return 'In Production';

        const normalized = phase.toString().toLowerCase();
        const mapping = {
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

    function formatEventTimestamp(timestamp) {
        if (!timestamp) {
            return '';
        }

        try {
            const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } catch (error) {
            return '';
        }
    }

    function getEraForYear(year) {
        if (year <= 1934) {
            return { label: 'Pre-Code Era', className: 'era-precode' };
        }
        if (year <= 1941) {
            return { label: 'Golden Age', className: 'era-golden' };
        }
        if (year <= 1945) {
            return { label: 'War Years', className: 'era-war' };
        }
        return { label: 'Post-War Era', className: 'era-postwar' };
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
        showScriptLibrary,
        showSection
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
