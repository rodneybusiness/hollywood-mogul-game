/**
 * HOLLYWOOD MOGUL - CORE GAME STATE MANAGEMENT
 * Handles the central game state, initialization, and core game loop
 */

window.HollywoodMogul = (function() {
    'use strict';
    
    // Game State Object
    let gameState = {
        // Time & Date
        currentDate: new Date(1933, 0, 1), // January 1, 1933
        gameWeek: 1,
        gameYear: 1933,
        
        // Financial State
        cash: 600000,
        monthlyBurn: 20000,
        totalRevenue: 0,
        totalExpenses: 0,
        
        // Studio Information
        studioName: "Mogul Pictures",
        reputation: 50, // 0-100 scale
        
        // Collections
        activeFilms: [],
        completedFilms: [],
        contractPlayers: [],
        availableScripts: [],
        currentEvents: [],
        
        // Studio Assets
        soundStages: 1,
        backlots: {
            western: false,
            nyc: false,
            jungle: false
        },
        
        // Game Progress
        gameStarted: false,
        gameEnded: false,
        endingType: null,
        
        // Statistics
        stats: {
            filmsProduced: 0,
            oscarsWon: 0,
            boxOfficeTotal: 0,
            scandalsHandled: 0,
            yearsSurvived: 0
        }
    };
    
    // Game Constants
    const GAME_CONSTANTS = {
        STARTING_CASH: 600000,
        BASE_MONTHLY_BURN: 20000,
        SOUND_STAGE_COST: 10000,
        OVERHEAD_COST: 3000,
        CONTRACT_PLAYERS_COST: 7000,
        
        // Time
        WEEKS_PER_MONTH: 4,
        MONTHS_PER_YEAR: 12,
        GAME_END_YEAR: 1949,
        
        // Financial thresholds
        RUNWAY_DANGER_WEEKS: 8,
        RUNWAY_WARNING_WEEKS: 16,
        
        // Reputation
        MIN_REPUTATION: 0,
        MAX_REPUTATION: 100
    };
    
    // Event Listeners Storage
    const eventListeners = {};
    
    /**
     * Initialize the game
     */
    function init() {
        console.log('Initializing Hollywood Mogul...');
        
        // Show loading screen
        showLoadingScreen();
        
        // Initialize subsystems
        setTimeout(() => {
            initializeEventListeners();
            initializeUI();
            startNewGame();
            hideLoadingScreen();
            
            console.log('Hollywood Mogul initialized successfully!');
        }, 3000); // 3-second loading screen
    }
    
    /**
     * Set up event listeners for UI interactions
     */
    function initializeEventListeners() {
        // Time control buttons
        addEventListener('btn-advance-week', 'click', () => advanceTime('week'));
        addEventListener('btn-advance-month', 'click', () => advanceTime('month'));
        
        // Navigation buttons
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                switchSection(e.target.closest('.nav-button').dataset.section);
            });
        });
        
        // Modal and overlay handlers
        addEventListener('modal-overlay', 'click', (e) => {
            if (e.target.id === 'modal-overlay') {
                closeModal();
            }
        });
        
        // New script button
        addEventListener('btn-new-script', 'click', () => {
            showScriptLibrary();
        });
        
        // Save/Load buttons
        addEventListener('btn-save-game', 'click', saveGame);
        addEventListener('btn-load-game', 'click', showLoadDialog);
        
        // Game over restart
        addEventListener('btn-restart', 'click', () => {
            hideGameOverScreen();
            startNewGame();
        });
        
        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
    
    /**
     * Helper function to add event listeners with tracking
     */
    function addEventListener(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, handler);
            if (!eventListeners[elementId]) {
                eventListeners[elementId] = [];
            }
            eventListeners[elementId].push({ event, handler });
        }
    }
    
    /**
     * Initialize UI elements
     */
    function initializeUI() {
        updateFinancialDisplay();
        updateDateDisplay();
        updateActiveProductions();
        updateTheaterFilms();
        updateAlerts();
        updateStudioStatus();
    }
    
    /**
     * Start a new game
     */
    function startNewGame() {
        // Show scenario selection if ScenarioSystem is available
        if (window.ScenarioSystem && window.ScenarioSystem.showScenarioSelection) {
            window.ScenarioSystem.showScenarioSelection();
            return;
        }

        // Fallback to classic start if scenarios not available
        startNewGameWithScenario('classic_start');
    }

    /**
     * Start a new game with a specific scenario
     */
    function startNewGameWithScenario(scenarioId) {
        scenarioId = scenarioId || 'classic_start';

        // Reset game state with default values
        gameState = {
            currentDate: new Date(1933, 0, 1),
            gameWeek: 1,
            gameYear: 1933,
            cash: GAME_CONSTANTS.STARTING_CASH,
            monthlyBurn: GAME_CONSTANTS.BASE_MONTHLY_BURN,
            totalRevenue: 0,
            totalExpenses: 0,
            studioName: "Mogul Pictures",
            reputation: 50,
            activeFilms: [],
            completedFilms: [],
            contractPlayers: [],
            availableScripts: [],
            currentEvents: [],
            soundStages: 1,
            backlots: {
                western: false,
                nyc: false,
                jungle: false
            },
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
            scenario: null // Will be set by scenario system
        };

        // Apply scenario-specific changes
        if (window.ScenarioSystem && window.ScenarioSystem.applyScenario) {
            window.ScenarioSystem.applyScenario(scenarioId, gameState);
        } else {
            // Fallback: generate default scripts
            if (window.ScriptLibrary && window.ScriptLibrary.generateInitialScripts) {
                gameState.availableScripts = window.ScriptLibrary.generateInitialScripts();
            }
        }

        // Initialize studio lot management system
        if (window.StudioLotSystem && window.StudioLotSystem.initializeStudioLot) {
            window.StudioLotSystem.initializeStudioLot(gameState);
        }

        // Add welcome alert (scenario will have already added its own)
        if (!gameState.scenario) {
            addAlert({
                type: 'tutorial',
                icon: '🎬',
                message: 'Welcome to Mogul Pictures! Review available scripts to begin your Hollywood empire.',
                priority: 'high'
            });
        }

        // Update UI
        initializeUI();
        switchSection('dashboard');

        console.log('New game started with scenario:', scenarioId, gameState);
    }
    
    /**
     * Advance game time
     */
    function advanceTime(period) {
        if (gameState.gameEnded) return;
        
        if (period === 'week') {
            advanceWeek();
        } else if (period === 'month') {
            advanceMonth();
        }
        
        // Update UI
        updateDateDisplay();
        updateFinancialDisplay();
        updateStudioStatus();
        checkGameEndConditions();
    }
    
    /**
     * Advance by one week
     */
    function advanceWeek() {
        const oldYear = gameState.gameYear;
        const oldMonth = gameState.currentDate.getMonth();

        gameState.gameWeek += 1;
        gameState.currentDate.setDate(gameState.currentDate.getDate() + 7);

        // Update year after date change
        gameState.gameYear = gameState.currentDate.getFullYear();

        // Check if we've advanced to a new month
        const newMonth = gameState.currentDate.getMonth();

        if (gameState.gameYear !== oldYear || newMonth !== oldMonth || gameState.gameWeek % GAME_CONSTANTS.WEEKS_PER_MONTH === 1) {
            processMonthlyExpenses();
        }

        // Process weekly events
        processWeeklyEvents();

        console.log(`Advanced to week ${gameState.gameWeek}, ${formatDate(gameState.currentDate)}`);
    }
    
    /**
     * Advance by one month
     */
    function advanceMonth() {
        gameState.gameWeek += GAME_CONSTANTS.WEEKS_PER_MONTH;
        gameState.currentDate.setMonth(gameState.currentDate.getMonth() + 1);
        gameState.gameYear = gameState.currentDate.getFullYear();

        processMonthlyExpenses();
        processMonthlyEvents();

        console.log(`Advanced to month ${gameState.currentDate.getMonth() + 1}, year ${gameState.gameYear}`);
    }
    
    /**
     * Process monthly expenses
     */
    function processMonthlyExpenses() {
        const monthlyBurn = calculateMonthlyBurn();
        gameState.cash -= monthlyBurn;
        gameState.totalExpenses += monthlyBurn;
        
        addAlert({
            type: 'financial',
            icon: '💰',
            message: `Monthly expenses: -$${monthlyBurn.toLocaleString()}`,
            priority: 'medium'
        });
        
        console.log(`Monthly burn: $${monthlyBurn}, remaining cash: $${gameState.cash}`);
    }
    
    /**
     * Calculate current monthly burn rate
     */
    function calculateMonthlyBurn() {
        let burn = GAME_CONSTANTS.SOUND_STAGE_COST * gameState.soundStages;
        burn += GAME_CONSTANTS.OVERHEAD_COST;
        burn += GAME_CONSTANTS.CONTRACT_PLAYERS_COST; // Base contract costs

        // Add contract player specific costs
        gameState.contractPlayers.forEach(player => {
            burn += player.monthlySalary || 0;
        });

        // Add studio lot maintenance costs
        if (gameState.studioLot && gameState.studioLot.totalMaintenanceCost) {
            burn += gameState.studioLot.totalMaintenanceCost;
        }

        gameState.monthlyBurn = burn;
        return burn;
    }
    
    /**
     * Process weekly events (film production, box office, etc.)
     */
    function processWeeklyEvents() {
        // Process active film productions
        if (window.ProductionSystem && window.ProductionSystem.processWeeklyProduction) {
            window.ProductionSystem.processWeeklyProduction(gameState);
        }
        
        // Process box office for films in theaters
        if (window.BoxOfficeSystem && window.BoxOfficeSystem.processWeeklyBoxOffice) {
            window.BoxOfficeSystem.processWeeklyBoxOffice(gameState);
        }
        
        // Random events
        if (Math.random() < 0.1) { // 10% chance per week
            generateRandomEvent();
        }
    }
    
    /**
     * Process monthly events (historical events, new scripts, etc.)
     */
    function processMonthlyEvents() {
        // Generate new scripts monthly
        if (window.ScriptLibrary && window.ScriptLibrary.generateMonthlyScripts) {
            const newScripts = window.ScriptLibrary.generateMonthlyScripts(gameState);
            gameState.availableScripts.push(...newScripts);
        }

        // Historical events
        if (window.HistoricalEvents && window.HistoricalEvents.checkForEvents) {
            window.HistoricalEvents.checkForEvents(gameState);
        }

        // Academy Awards ceremony (March each year, starting 1934)
        if (window.AwardsSystem && window.AwardsSystem.shouldTriggerOscars) {
            if (window.AwardsSystem.shouldTriggerOscars(gameState)) {
                window.AwardsSystem.triggerOscarCeremony(gameState);
            }
        }

        // Update stats - calculate years survived based on current date
        const startDate = new Date(1933, 0, 1); // January 1, 1933
        const daysSurvived = Math.floor((gameState.currentDate - startDate) / (1000 * 60 * 60 * 24));
        gameState.stats.yearsSurvived = daysSurvived / 365.25;
    }
    
    /**
     * Generate random events
     */
    function generateRandomEvent() {
        if (window.EventSystem && window.EventSystem.generateRandomEvent) {
            window.EventSystem.generateRandomEvent(gameState);
        }
    }
    
    /**
     * Check for game end conditions
     */
    function checkGameEndConditions() {
        // Bankruptcy check
        if (gameState.cash < 0) {
            endGame('bankruptcy');
            return;
        }
        
        // Game completion check
        if (gameState.gameYear >= GAME_CONSTANTS.GAME_END_YEAR) {
            endGame('survived');
            return;
        }
        
        // Update financial warnings
        updateFinancialWarnings();
    }
    
    /**
     * End the game with specific ending
     */
    function endGame(endingType) {
        gameState.gameEnded = true;
        gameState.endingType = endingType;
        
        showGameOverScreen(endingType);
    }
    
    /**
     * Update financial warning alerts
     */
    function updateFinancialWarnings() {
        const runway = calculateRunwayWeeks();
        
        if (runway <= GAME_CONSTANTS.RUNWAY_DANGER_WEEKS && runway > 0) {
            addAlert({
                type: 'danger',
                icon: '⚠️',
                message: `CRITICAL: Only ${runway} weeks of cash remaining!`,
                priority: 'critical'
            });
        } else if (runway <= GAME_CONSTANTS.RUNWAY_WARNING_WEEKS) {
            addAlert({
                type: 'warning',
                icon: '💸',
                message: `Cash running low: ${runway} weeks remaining`,
                priority: 'high'
            });
        }
    }
    
    /**
     * Calculate cash runway in weeks
     */
    function calculateRunwayWeeks() {
        if (gameState.monthlyBurn <= 0) return 999;
        const weeklyBurn = gameState.monthlyBurn / GAME_CONSTANTS.WEEKS_PER_MONTH;
        return Math.floor(gameState.cash / weeklyBurn);
    }
    
    /**
     * Add an alert to the game
     */
    function addAlert(alert) {
        alert.id = Date.now() + Math.random();
        alert.timestamp = new Date(gameState.currentDate);
        
        gameState.currentEvents.push(alert);
        
        // Keep only last 10 alerts
        if (gameState.currentEvents.length > 10) {
            gameState.currentEvents = gameState.currentEvents.slice(-10);
        }
        
        updateAlerts();
    }
    
    /**
     * Add a game event to the events log (displayed in Recent Events panel)
     */
    function addEvent(event) {
        if (!gameState.events) {
            gameState.events = [];
        }
        event.date = new Date(gameState.currentDate);
        event.id = Date.now() + Math.random();
        gameState.events.push(event);

        // Keep only last 20 events
        if (gameState.events.length > 20) {
            gameState.events = gameState.events.slice(-20);
        }
    }

    /**
     * Public API
     */
    return {
        // Core functions
        init,
        getGameState: () => gameState,

        // Time functions
        advanceTime,
        getCurrentDate: () => gameState.currentDate,
        formatDate: (date) => formatDate(date || gameState.currentDate),

        // Financial functions
        getCash: () => gameState.cash,
        addCash: (amount) => {
            gameState.cash += amount;
            gameState.totalRevenue += Math.max(0, amount);
            updateFinancialDisplay();
        },
        spendCash: (amount) => {
            gameState.cash -= amount;
            gameState.totalExpenses += amount;
            updateFinancialDisplay();
        },
        calculateRunwayWeeks,

        // Game state functions
        addAlert,
        addEvent,
        endGame,
        startNewGame,
        startNewGameWithScenario,

        // UI functions
        showModal: (content) => showModal(content),
        closeModal,
        switchSection,

        // Utility functions
        CONSTANTS: GAME_CONSTANTS
    };
    
    /**
     * UI UPDATE FUNCTIONS
     */
    
    function updateDateDisplay() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = formatDate(gameState.currentDate);
        }
    }
    
    function updateFinancialDisplay() {
        // Cash display
        const cashElement = document.getElementById('cash-display');
        if (cashElement) {
            cashElement.textContent = `$${gameState.cash.toLocaleString()}`;
            cashElement.className = gameState.cash < 0 ? 'card-value negative' : 'card-value';
        }
        
        // Burn rate display
        const burnElement = document.getElementById('burn-display');
        if (burnElement) {
            burnElement.textContent = `-$${gameState.monthlyBurn.toLocaleString()}`;
        }
        
        // Runway display
        const runwayElement = document.getElementById('runway-display');
        const runwayStatusElement = document.getElementById('runway-status');
        
        if (runwayElement && runwayStatusElement) {
            const runway = calculateRunwayWeeks();
            
            if (runway > 100) {
                runwayElement.textContent = '∞';
                runwayStatusElement.textContent = 'SAFE';
                runwayStatusElement.className = 'runway-status safe';
            } else {
                runwayElement.textContent = `${runway} weeks`;
                
                if (runway <= GAME_CONSTANTS.RUNWAY_DANGER_WEEKS) {
                    runwayStatusElement.textContent = 'DANGER';
                    runwayStatusElement.className = 'runway-status danger';
                } else if (runway <= GAME_CONSTANTS.RUNWAY_WARNING_WEEKS) {
                    runwayStatusElement.textContent = 'WARNING';
                    runwayStatusElement.className = 'runway-status moderate';
                } else {
                    runwayStatusElement.textContent = 'SAFE';
                    runwayStatusElement.className = 'runway-status safe';
                }
            }
        }
    }
    
    function updateActiveProductions() {
        const productionsElement = document.getElementById('active-productions');
        if (!productionsElement) return;

        // Clear existing content safely
        productionsElement.innerHTML = '';

        if (gameState.activeFilms.length === 0) {
            const noProductions = document.createElement('div');
            noProductions.className = 'no-productions';

            const p = document.createElement('p');
            p.textContent = 'No films currently in production';
            noProductions.appendChild(p);

            const btn = document.createElement('button');
            btn.id = 'btn-new-script';
            btn.className = 'action-btn primary';
            btn.textContent = 'REVIEW SCRIPTS';
            btn.addEventListener('click', () => showScriptLibrary());
            noProductions.appendChild(btn);

            productionsElement.appendChild(noProductions);
        } else {
            gameState.activeFilms.forEach(film => {
                const item = document.createElement('div');
                item.className = 'production-item';

                const title = document.createElement('h3');
                title.textContent = film.title;
                item.appendChild(title);

                const status = document.createElement('p');
                status.textContent = `Status: ${film.status}`;
                item.appendChild(status);

                const budget = document.createElement('p');
                budget.textContent = `Budget: $${(film.budget || 0).toLocaleString()}`;
                item.appendChild(budget);

                productionsElement.appendChild(item);
            });
        }
    }
    
    function updateTheaterFilms() {
        const theaterElement = document.getElementById('theater-films');
        if (!theaterElement) return;

        // Clear existing content safely
        theaterElement.innerHTML = '';

        const theaterFilms = gameState.completedFilms.filter(film => film.inTheaters);

        if (theaterFilms.length === 0) {
            const noFilms = document.createElement('div');
            noFilms.className = 'no-films';

            const p = document.createElement('p');
            p.textContent = 'No films currently in theaters';
            noFilms.appendChild(p);

            theaterElement.appendChild(noFilms);
        } else {
            theaterFilms.forEach(film => {
                const item = document.createElement('div');
                item.className = 'theater-item';

                const title = document.createElement('h3');
                title.textContent = film.title;
                item.appendChild(title);

                const week = document.createElement('p');
                week.textContent = `Week ${film.theaterWeek || 1} in theaters`;
                item.appendChild(week);

                const revenue = document.createElement('p');
                revenue.textContent = `This week: $${(film.weeklyRevenue || 0).toLocaleString()}`;
                item.appendChild(revenue);

                theaterElement.appendChild(item);
            });
        }
    }
    
    function updateAlerts() {
        const alertsElement = document.getElementById('game-alerts');
        if (!alertsElement) return;

        // Clear existing content safely
        alertsElement.innerHTML = '';

        if (gameState.currentEvents.length === 0) {
            const item = document.createElement('div');
            item.className = 'alert-item';

            const icon = document.createElement('div');
            icon.className = 'alert-icon';
            icon.textContent = '\u2705'; // checkmark emoji
            item.appendChild(icon);

            const text = document.createElement('div');
            text.className = 'alert-text';
            text.textContent = 'No urgent matters require attention.';
            item.appendChild(text);

            alertsElement.appendChild(item);
        } else {
            const sortedAlerts = gameState.currentEvents
                .sort((a, b) => getPriorityValue(b.priority) - getPriorityValue(a.priority))
                .slice(0, 5); // Show only top 5 alerts

            sortedAlerts.forEach(alert => {
                const item = document.createElement('div');
                item.className = `alert-item ${alert.type || ''}`;

                const icon = document.createElement('div');
                icon.className = 'alert-icon';
                icon.textContent = alert.icon || '!';
                item.appendChild(icon);

                const text = document.createElement('div');
                text.className = 'alert-text';
                text.textContent = alert.message || '';
                item.appendChild(text);

                alertsElement.appendChild(item);
            });
        }
    }
    
    function updateStudioStatus() {
        const repEl = document.getElementById('reputation-display');
        const filmsEl = document.getElementById('films-produced-display');
        const boxOfficeEl = document.getElementById('total-box-office-display');

        if (repEl) repEl.textContent = gameState.reputation || 50;
        if (filmsEl) filmsEl.textContent = (gameState.completedFilms || []).length;
        if (boxOfficeEl) {
            const total = gameState.stats ? (gameState.stats.boxOfficeTotal || 0) : 0;
            boxOfficeEl.textContent = '$' + total.toLocaleString();
        }
    }

    function getPriorityValue(priority) {
        const priorities = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorities[priority] || 1;
    }
    
    /**
     * UI HELPER FUNCTIONS
     */
    
    function formatDate(date) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    
    function showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }
    
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    function showGameOverScreen(endingType) {
        const gameOverScreen = document.getElementById('game-over-screen');
        const titleElement = document.getElementById('game-over-title');
        const messageElement = document.getElementById('game-over-message');
        const statsElement = document.getElementById('final-stats');
        
        if (!gameOverScreen) return;
        
        let title, message;
        
        switch (endingType) {
            case 'bankruptcy':
                title = 'BANKRUPTCY';
                message = 'Your studio has run out of money. The bank has foreclosed on your assets.';
                break;
            case 'survived':
                title = 'VICTORY';
                message = 'You survived the golden age of Hollywood! Your legacy is secure.';
                break;
            default:
                title = 'THE END';
                message = 'Your Hollywood journey has come to an end.';
        }
        
        if (titleElement) titleElement.textContent = title;
        if (messageElement) messageElement.textContent = message;
        
        if (statsElement) {
            // Clear and rebuild stats safely
            statsElement.innerHTML = '';

            const header = document.createElement('h3');
            header.textContent = 'Final Statistics';
            statsElement.appendChild(header);

            const stats = [
                { label: 'Years Survived', value: gameState.stats.yearsSurvived.toFixed(1) },
                { label: 'Films Produced', value: gameState.stats.filmsProduced },
                { label: 'Total Box Office', value: `$${gameState.stats.boxOfficeTotal.toLocaleString()}` },
                { label: 'Final Cash', value: `$${gameState.cash.toLocaleString()}` }
            ];

            stats.forEach(stat => {
                const p = document.createElement('p');
                p.textContent = `${stat.label}: ${stat.value}`;
                statsElement.appendChild(p);
            });
        }
        
        gameOverScreen.classList.remove('hidden');
    }
    
    function hideGameOverScreen() {
        const gameOverScreen = document.getElementById('game-over-screen');
        if (gameOverScreen) {
            gameOverScreen.classList.add('hidden');
        }
    }
    
    function showModal(content) {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-content');
        
        if (modalOverlay && modalContent) {
            modalContent.innerHTML = content;
            modalOverlay.classList.remove('hidden');
        }
    }
    
    function closeModal() {
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.add('hidden');
        }
    }
    
    function switchSection(section) {
        // Update navigation buttons (handle both .nav-btn and .nav-button classes)
        document.querySelectorAll('.nav-btn, .nav-button').forEach(btn => {
            btn.classList.remove('active');
        });

        const activeBtn = document.querySelector(`[data-section="${section}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Hide all sections, show the selected one
        document.querySelectorAll('.game-section').forEach(sec => {
            sec.classList.remove('active');
            sec.style.display = 'none';
        });

        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
        }

        // Populate scripts tab on navigation
        if (section === 'scripts') {
            populateScriptsSection();
        }
    }

    function populateScriptsSection() {
        const scriptsGrid = document.getElementById('available-scripts');
        if (!scriptsGrid) return;

        scriptsGrid.innerHTML = '';

        if (!gameState.availableScripts || gameState.availableScripts.length === 0) {
            const noContent = document.createElement('div');
            noContent.className = 'no-content';
            noContent.textContent = 'No scripts currently available. New scripts arrive monthly.';
            scriptsGrid.appendChild(noContent);
            return;
        }

        gameState.availableScripts.forEach((script, index) => {
            const card = document.createElement('div');
            card.className = 'script-card';

            const riskClass = (script.censorRisk || 50) > 80 ? 'high-risk' :
                              (script.censorRisk || 50) > 50 ? 'medium-risk' : 'low-risk';

            card.innerHTML = `
                <div class="script-header">
                    <h3 class="script-title">${escapeHtml(script.title)}</h3>
                    <span class="script-genre">${escapeHtml(script.genre || 'Drama')}</span>
                </div>
                <p class="script-description">${escapeHtml(script.description || '')}</p>
                <div class="script-stats">
                    <div class="stat"><span class="stat-label">Budget:</span> $${(script.budget || 0).toLocaleString()}</div>
                    <div class="stat"><span class="stat-label">Quality:</span> ${script.quality || '?'}/100</div>
                    <div class="stat"><span class="stat-label">Shooting Days:</span> ${script.shootingDays || '?'}</div>
                    <div class="stat ${riskClass}"><span class="stat-label">Censor Risk:</span> ${script.censorRisk || '?'}%</div>
                </div>
                ${script.historicalNotes ? `<p class="script-notes">${escapeHtml(script.historicalNotes)}</p>` : ''}
                <button class="action-btn primary greenlight-btn" data-script-index="${index}">GREENLIGHT</button>
            `;

            // Bind greenlight button
            const btn = card.querySelector('.greenlight-btn');
            btn.addEventListener('click', () => {
                if (window.ScriptLibrary && window.ScriptLibrary.greenlightScript) {
                    window.ScriptLibrary.greenlightScript(script.id);
                    populateScriptsSection();
                    updateFinancialDisplay();
                    updateActiveProductions();
                } else {
                    // Fallback: use ScriptLibrary modal
                    showScriptLibrary();
                }
            });

            scriptsGrid.appendChild(card);
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
    
    function showScriptLibrary() {
        if (window.ScriptLibrary && window.ScriptLibrary.showScriptSelection) {
            window.ScriptLibrary.showScriptSelection(gameState);
        } else {
            showModalSafe('Script Library', 'Script selection system will be available in Phase 2.');
        }
    }

    function showLoadDialog() {
        showModalSafe('Load Game', 'Save/Load system will be implemented in Phase 4.');
    }

    /**
     * Display a simple modal with safe text content
     * @param {string} title - Modal title
     * @param {string} message - Modal message text
     */
    function showModalSafe(title, message) {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-content');

        if (modalOverlay && modalContent) {
            modalContent.innerHTML = '';

            const h2 = document.createElement('h2');
            h2.textContent = title;
            modalContent.appendChild(h2);

            const p = document.createElement('p');
            p.textContent = message;
            modalContent.appendChild(p);

            const btn = document.createElement('button');
            btn.className = 'action-btn primary';
            btn.textContent = 'Close';
            btn.addEventListener('click', closeModal);
            modalContent.appendChild(btn);

            modalOverlay.classList.remove('hidden');
        }
    }
    
    function saveGame() {
        // Placeholder for save functionality
        addAlert({
            type: 'info',
            icon: '💾',
            message: 'Save system will be available in Phase 4.',
            priority: 'low'
        });
    }
    
})();