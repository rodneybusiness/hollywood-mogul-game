/**
 * HOLLYWOOD MOGUL - CORE GAME STATE MANAGEMENT
 * Pure state management + public API facade.
 * Game loop logic is coordinated here but will delegate to GameController
 * when available. Emits EventBus events for decoupled UI updates.
 *
 * Phase 2 refactor: removed duplicate constants, added EventBus integration,
 * unified alert/event systems.
 */

window.HollywoodMogul = (function() {
    'use strict';

    // ================================================================
    // GAME STATE
    // ================================================================

    var gameState = {
        currentDate: new Date(1933, 0, 1),
        gameWeek: 1,
        gameYear: 1933,

        cash: 600000,
        monthlyBurn: 20000,
        totalRevenue: 0,
        totalExpenses: 0,

        studioName: 'Mogul Pictures',
        reputation: 50,

        activeFilms: [],
        completedFilms: [],
        contractPlayers: [],
        availableScripts: [],
        currentEvents: [],

        soundStages: 1,
        backlots: { western: false, nyc: false, jungle: false },

        gameStarted: false,
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
        scenario: null,

        technologies: [],
        franchises: []
    };

    // ================================================================
    // CONSTANTS (facade over GameConstants for backward compatibility)
    // ================================================================

    function getC() {
        return window.GameConstants || {};
    }

    var GAME_CONSTANTS = {
        get STARTING_CASH() { var F = getC().FINANCIAL; return F ? F.STARTING_CASH : 600000; },
        get BASE_MONTHLY_BURN() { var F = getC().FINANCIAL; return F ? F.BASE_MONTHLY_BURN : 20000; },
        get SOUND_STAGE_COST() { var F = getC().FINANCIAL; return F ? F.SOUND_STAGE_COST : 10000; },
        get OVERHEAD_COST() { var F = getC().FINANCIAL; return F ? F.OVERHEAD_COST : 3000; },
        get CONTRACT_PLAYERS_COST() { var F = getC().FINANCIAL; return F ? F.CONTRACT_PLAYERS_COST : 7000; },
        get WEEKS_PER_MONTH() { var T = getC().TIME; return T ? T.WEEKS_PER_MONTH : 4; },
        get MONTHS_PER_YEAR() { var T = getC().TIME; return T ? T.MONTHS_PER_YEAR : 12; },
        get GAME_END_YEAR() { var T = getC().TIME; return T ? T.GAME_END_YEAR : 1949; },
        get RUNWAY_DANGER_WEEKS() { var F = getC().FINANCIAL; return F ? F.RUNWAY_DANGER_WEEKS : 8; },
        get RUNWAY_WARNING_WEEKS() { var F = getC().FINANCIAL; return F ? F.RUNWAY_WARNING_WEEKS : 16; },
        MIN_REPUTATION: 0,
        MAX_REPUTATION: 100
    };

    // DOM event listener tracking for cleanup
    var domListeners = {};

    // ================================================================
    // INITIALIZATION
    // ================================================================

    function init() {
        console.log('Initializing Hollywood Mogul...');
        showLoadingScreen();

        setTimeout(function() {
            initializeEventListeners();
            initializeUI();
            startNewGame();
            hideLoadingScreen();
            emitEvent('game:initialized');
            console.log('Hollywood Mogul initialized successfully!');
        }, 3000);
    }

    function initializeEventListeners() {
        addDOMListener('btn-advance-week', 'click', function() { advanceTime('week'); });
        addDOMListener('btn-advance-month', 'click', function() { advanceTime('month'); });

        var navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                var target = e.target.closest('.nav-button');
                if (target) switchSection(target.dataset.section);
            });
        });

        addDOMListener('modal-overlay', 'click', function(e) {
            if (e.target.id === 'modal-overlay') closeModal();
        });

        addDOMListener('btn-new-script', 'click', function() { showScriptLibrary(); });
        addDOMListener('btn-save-game', 'click', saveGame);
        addDOMListener('btn-load-game', 'click', showLoadDialog);
        addDOMListener('btn-restart', 'click', function() {
            hideGameOverScreen();
            startNewGame();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        });
    }

    function addDOMListener(elementId, event, handler) {
        var element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, handler);
            if (!domListeners[elementId]) domListeners[elementId] = [];
            domListeners[elementId].push({ event: event, handler: handler });
        }
    }

    function initializeUI() {
        updateFinancialDisplay();
        updateDateDisplay();
        updateActiveProductions();
        updateTheaterFilms();
        updateAlerts();
        updateStudioStatus();
    }

    // ================================================================
    // GAME START
    // ================================================================

    function startNewGame() {
        if (window.ScenarioSystem && window.ScenarioSystem.showScenarioSelection) {
            window.ScenarioSystem.showScenarioSelection();
            return;
        }
        startNewGameWithScenario('classic_start');
    }

    function startNewGameWithScenario(scenarioId) {
        scenarioId = scenarioId || 'classic_start';

        // Clear EventBus subscriptions from previous game
        if (window.EventBus) window.EventBus.clear();

        gameState = {
            currentDate: new Date(1933, 0, 1),
            gameWeek: 1,
            gameYear: 1933,
            cash: GAME_CONSTANTS.STARTING_CASH,
            monthlyBurn: GAME_CONSTANTS.BASE_MONTHLY_BURN,
            totalRevenue: 0,
            totalExpenses: 0,
            studioName: 'Mogul Pictures',
            reputation: 50,
            activeFilms: [],
            completedFilms: [],
            contractPlayers: [],
            availableScripts: [],
            currentEvents: [],
            soundStages: 1,
            backlots: { western: false, nyc: false, jungle: false },
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
            scenario: null,
            technologies: [],
            franchises: []
        };

        if (window.TechnologySystem && window.TechnologySystem.initializeTechnologies) {
            window.TechnologySystem.initializeTechnologies(gameState);
        }
        if (window.FranchiseSystem && window.FranchiseSystem.initializeFranchises) {
            window.FranchiseSystem.initializeFranchises(gameState);
        }

        if (window.ScenarioSystem && window.ScenarioSystem.applyScenario) {
            window.ScenarioSystem.applyScenario(scenarioId, gameState);
        } else if (window.ScriptLibrary && window.ScriptLibrary.generateInitialScripts) {
            gameState.availableScripts = window.ScriptLibrary.generateInitialScripts();
        }

        if (window.StudioLotSystem && window.StudioLotSystem.initializeStudioLot) {
            window.StudioLotSystem.initializeStudioLot(gameState);
        }

        if (!gameState.scenario) {
            addAlert({
                type: 'tutorial',
                icon: '\uD83C\uDFAC',
                message: 'Welcome to Mogul Pictures! Review available scripts to begin your Hollywood empire.',
                priority: 'high'
            });
        }

        initializeUI();
        switchSection('dashboard');
        emitEvent('game:started', { scenario: scenarioId });
        console.log('New game started with scenario:', scenarioId);
    }

    // ================================================================
    // TIME ADVANCEMENT
    // ================================================================

    function advanceTime(period) {
        if (gameState.gameEnded) return;

        if (period === 'week') {
            advanceWeek();
        } else if (period === 'month') {
            advanceMonth();
        }

        updateDateDisplay();
        updateFinancialDisplay();
        updateStudioStatus();
        checkGameEndConditions();

        emitEvent('time:advanced', {
            period: period,
            date: gameState.currentDate,
            week: gameState.gameWeek,
            year: gameState.gameYear
        });

        emitEvent('state:changed', gameState);
    }

    function advanceWeek() {
        var oldYear = gameState.gameYear;
        var oldMonth = gameState.currentDate.getMonth();

        gameState.gameWeek += 1;
        gameState.currentDate.setDate(gameState.currentDate.getDate() + 7);
        gameState.gameYear = gameState.currentDate.getFullYear();

        var newMonth = gameState.currentDate.getMonth();
        if (gameState.gameYear !== oldYear || newMonth !== oldMonth || gameState.gameWeek % GAME_CONSTANTS.WEEKS_PER_MONTH === 1) {
            processMonthlyExpenses();
        }

        processWeeklyEvents();
    }

    function advanceMonth() {
        gameState.gameWeek += GAME_CONSTANTS.WEEKS_PER_MONTH;
        gameState.currentDate.setMonth(gameState.currentDate.getMonth() + 1);
        gameState.gameYear = gameState.currentDate.getFullYear();

        processMonthlyExpenses();
        processMonthlyEvents();
    }

    // ================================================================
    // EXPENSE PROCESSING
    // ================================================================

    function processMonthlyExpenses() {
        var monthlyBurn = calculateMonthlyBurn();
        gameState.cash -= monthlyBurn;
        gameState.totalExpenses += monthlyBurn;

        addAlert({
            type: 'financial',
            icon: '\uD83D\uDCB0',
            message: 'Monthly expenses: -$' + monthlyBurn.toLocaleString(),
            priority: 'medium'
        });

        emitEvent('financial:expenses', { amount: monthlyBurn, cash: gameState.cash });
    }

    function calculateMonthlyBurn() {
        var burn = GAME_CONSTANTS.SOUND_STAGE_COST * gameState.soundStages;
        burn += GAME_CONSTANTS.OVERHEAD_COST;
        burn += GAME_CONSTANTS.CONTRACT_PLAYERS_COST;

        if (gameState.contractPlayers) {
            for (var i = 0; i < gameState.contractPlayers.length; i++) {
                burn += gameState.contractPlayers[i].monthlySalary || 0;
            }
        }

        if (gameState.studioLot && gameState.studioLot.totalMaintenanceCost) {
            burn += gameState.studioLot.totalMaintenanceCost;
        }

        // Technology maintenance costs
        if (window.TechnologySystem && window.TechnologySystem.getTotalMaintenanceCost) {
            burn += window.TechnologySystem.getTotalMaintenanceCost(gameState);
        }

        // Apply era financial scaling (costs rise with inflation over decades)
        var C = getC();
        if (C.getEraScalingForYear) {
            var scaling = C.getEraScalingForYear(gameState.gameYear);
            burn = Math.floor(burn * scaling.monthlyBurnMult);
        }

        gameState.monthlyBurn = burn;
        return burn;
    }

    // ================================================================
    // EVENT DISPATCHING
    // ================================================================

    function processWeeklyEvents() {
        if (window.ProductionSystem && window.ProductionSystem.processWeeklyProduction) {
            window.ProductionSystem.processWeeklyProduction(gameState);
        }
        if (window.BoxOfficeSystem && window.BoxOfficeSystem.processWeeklyBoxOffice) {
            window.BoxOfficeSystem.processWeeklyBoxOffice(gameState);
        }
        if (Math.random() < 0.1) {
            if (window.EventSystem && window.EventSystem.generateRandomEvent) {
                window.EventSystem.generateRandomEvent(gameState);
            }
        }

        emitEvent('week:processed', { week: gameState.gameWeek });
    }

    function processMonthlyEvents() {
        if (window.ScriptLibrary && window.ScriptLibrary.generateMonthlyScripts) {
            var newScripts = window.ScriptLibrary.generateMonthlyScripts(gameState);
            if (newScripts && newScripts.length > 0) {
                gameState.availableScripts.push.apply(gameState.availableScripts, newScripts);
            }
        }

        if (window.HistoricalEvents && window.HistoricalEvents.checkForEvents) {
            window.HistoricalEvents.checkForEvents(gameState);
        }

        if (window.AwardsSystem && window.AwardsSystem.shouldTriggerOscars) {
            if (window.AwardsSystem.shouldTriggerOscars(gameState)) {
                window.AwardsSystem.triggerOscarCeremony(gameState);
            }
        }

        var startDate = new Date(1933, 0, 1);
        var daysSurvived = Math.floor((gameState.currentDate - startDate) / (1000 * 60 * 60 * 24));
        gameState.stats.yearsSurvived = daysSurvived / 365.25;

        emitEvent('month:processed', { date: gameState.currentDate, year: gameState.gameYear });
    }

    // ================================================================
    // GAME END CONDITIONS
    // ================================================================

    function checkGameEndConditions() {
        if (gameState.cash < 0) {
            endGame('bankruptcy');
            return;
        }
        if (gameState.gameYear >= GAME_CONSTANTS.GAME_END_YEAR) {
            endGame('survived');
            return;
        }
        updateFinancialWarnings();
    }

    function endGame(endingType) {
        gameState.gameEnded = true;
        gameState.endingType = endingType;
        showGameOverScreen(endingType);
        emitEvent('game:ended', { type: endingType, stats: gameState.stats, cash: gameState.cash });
    }

    function updateFinancialWarnings() {
        var runway = calculateRunwayWeeks();
        if (runway <= GAME_CONSTANTS.RUNWAY_DANGER_WEEKS && runway > 0) {
            addAlert({
                type: 'danger',
                icon: '\u26A0\uFE0F',
                message: 'CRITICAL: Only ' + runway + ' weeks of cash remaining!',
                priority: 'critical'
            });
        } else if (runway <= GAME_CONSTANTS.RUNWAY_WARNING_WEEKS) {
            addAlert({
                type: 'warning',
                icon: '\uD83D\uDCB8',
                message: 'Cash running low: ' + runway + ' weeks remaining',
                priority: 'high'
            });
        }
    }

    function calculateRunwayWeeks() {
        if (gameState.monthlyBurn <= 0) return 999;
        var weeklyBurn = gameState.monthlyBurn / GAME_CONSTANTS.WEEKS_PER_MONTH;
        return Math.floor(gameState.cash / weeklyBurn);
    }

    // ================================================================
    // UNIFIED NOTIFICATION SYSTEM
    // Combines the old addAlert() and addEvent() into one system.
    // addAlert = urgent UI notifications (displayed in alerts panel)
    // addEvent = historical log entries (displayed in events log)
    // Both now go through the same pipeline and emit bus events.
    // ================================================================

    function addAlert(alert) {
        alert.id = Date.now() + Math.random();
        alert.timestamp = new Date(gameState.currentDate);

        gameState.currentEvents.push(alert);

        if (gameState.currentEvents.length > 10) {
            gameState.currentEvents = gameState.currentEvents.slice(-10);
        }

        updateAlerts();
        emitEvent('alert:added', alert);
    }

    function addEvent(event) {
        if (!gameState.events) gameState.events = [];
        event.date = new Date(gameState.currentDate);
        event.id = Date.now() + Math.random();
        gameState.events.push(event);

        if (gameState.events.length > 20) {
            gameState.events = gameState.events.slice(-20);
        }

        emitEvent('event:added', event);
    }

    // ================================================================
    // EVENTBUS HELPER
    // ================================================================

    function emitEvent(name, data) {
        if (window.EventBus && window.EventBus.emit) {
            window.EventBus.emit(name, data);
        }
    }

    // ================================================================
    // PUBLIC API
    // ================================================================

    return {
        init: init,
        getGameState: function() { return gameState; },

        advanceTime: advanceTime,
        getCurrentDate: function() { return gameState.currentDate; },
        formatDate: function(date) { return formatDate(date || gameState.currentDate); },

        getCash: function() { return gameState.cash; },
        addCash: function(amount) {
            gameState.cash += amount;
            gameState.totalRevenue += Math.max(0, amount);
            updateFinancialDisplay();
            emitEvent('financial:updated', { cash: gameState.cash, change: amount });
        },
        spendCash: function(amount) {
            gameState.cash -= amount;
            gameState.totalExpenses += amount;
            updateFinancialDisplay();
            emitEvent('financial:updated', { cash: gameState.cash, change: -amount });
        },
        calculateRunwayWeeks: calculateRunwayWeeks,

        addAlert: addAlert,
        addEvent: addEvent,
        endGame: endGame,
        startNewGame: startNewGame,
        startNewGameWithScenario: startNewGameWithScenario,

        showModal: function(content) { showModal(content); },
        closeModal: closeModal,
        switchSection: switchSection,

        CONSTANTS: GAME_CONSTANTS
    };

    // ================================================================
    // UI RENDERING
    // These functions handle DOM updates for game-state-owned elements.
    // Integration.js and DashboardUI handle their own elements separately.
    // EventBus events allow external modules to react without polling.
    // ================================================================

    function updateDateDisplay() {
        var dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = formatDate(gameState.currentDate);
        }
    }

    function updateFinancialDisplay() {
        var cashElement = document.getElementById('cash-display');
        if (cashElement) {
            cashElement.textContent = '$' + gameState.cash.toLocaleString();
            cashElement.className = gameState.cash < 0 ? 'card-value negative' : 'card-value';
        }

        var burnElement = document.getElementById('burn-display');
        if (burnElement) {
            burnElement.textContent = '-$' + gameState.monthlyBurn.toLocaleString();
        }

        var runwayElement = document.getElementById('runway-display');
        var runwayStatusElement = document.getElementById('runway-status');

        if (runwayElement && runwayStatusElement) {
            var runway = calculateRunwayWeeks();

            if (runway > 100) {
                runwayElement.textContent = '\u221E';
                runwayStatusElement.textContent = 'SAFE';
                runwayStatusElement.className = 'runway-status safe';
            } else {
                runwayElement.textContent = runway + ' weeks';

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
        var productionsElement = document.getElementById('active-productions');
        if (!productionsElement) return;

        productionsElement.innerHTML = '';

        if (gameState.activeFilms.length === 0) {
            var noProductions = document.createElement('div');
            noProductions.className = 'no-productions';

            var p = document.createElement('p');
            p.textContent = 'No films currently in production';
            noProductions.appendChild(p);

            var btn = document.createElement('button');
            btn.id = 'btn-new-script';
            btn.className = 'action-btn primary';
            btn.textContent = 'REVIEW SCRIPTS';
            btn.addEventListener('click', function() { showScriptLibrary(); });
            noProductions.appendChild(btn);

            productionsElement.appendChild(noProductions);
        } else {
            gameState.activeFilms.forEach(function(film) {
                var item = document.createElement('div');
                item.className = 'production-item';

                var title = document.createElement('h3');
                title.textContent = film.title;
                item.appendChild(title);

                var status = document.createElement('p');
                status.textContent = 'Status: ' + film.status;
                item.appendChild(status);

                var budget = document.createElement('p');
                budget.textContent = 'Budget: $' + (film.budget || 0).toLocaleString();
                item.appendChild(budget);

                productionsElement.appendChild(item);
            });
        }
    }

    function updateTheaterFilms() {
        var theaterElement = document.getElementById('theater-films');
        if (!theaterElement) return;

        theaterElement.innerHTML = '';

        var theaterFilms = gameState.completedFilms.filter(function(film) { return film.inTheaters; });

        if (theaterFilms.length === 0) {
            var noFilms = document.createElement('div');
            noFilms.className = 'no-films';

            var p = document.createElement('p');
            p.textContent = 'No films currently in theaters';
            noFilms.appendChild(p);

            theaterElement.appendChild(noFilms);
        } else {
            theaterFilms.forEach(function(film) {
                var item = document.createElement('div');
                item.className = 'theater-item';

                var title = document.createElement('h3');
                title.textContent = film.title;
                item.appendChild(title);

                var week = document.createElement('p');
                week.textContent = 'Week ' + (film.theaterWeek || 1) + ' in theaters';
                item.appendChild(week);

                var revenue = document.createElement('p');
                revenue.textContent = 'This week: $' + (film.weeklyRevenue || 0).toLocaleString();
                item.appendChild(revenue);

                theaterElement.appendChild(item);
            });
        }
    }

    function updateAlerts() {
        var alertsElement = document.getElementById('game-alerts');
        if (!alertsElement) return;

        alertsElement.innerHTML = '';

        if (gameState.currentEvents.length === 0) {
            var item = document.createElement('div');
            item.className = 'alert-item';

            var icon = document.createElement('div');
            icon.className = 'alert-icon';
            icon.textContent = '\u2705';
            item.appendChild(icon);

            var text = document.createElement('div');
            text.className = 'alert-text';
            text.textContent = 'No urgent matters require attention.';
            item.appendChild(text);

            alertsElement.appendChild(item);
        } else {
            var sortedAlerts = gameState.currentEvents
                .sort(function(a, b) { return getPriorityValue(b.priority) - getPriorityValue(a.priority); })
                .slice(0, 5);

            sortedAlerts.forEach(function(alert) {
                var item = document.createElement('div');
                item.className = 'alert-item ' + (alert.type || '');

                var icon = document.createElement('div');
                icon.className = 'alert-icon';
                icon.textContent = alert.icon || '!';
                item.appendChild(icon);

                var text = document.createElement('div');
                text.className = 'alert-text';
                text.textContent = alert.message || '';
                item.appendChild(text);

                alertsElement.appendChild(item);
            });
        }
    }

    function updateStudioStatus() {
        var repEl = document.getElementById('reputation-display');
        var filmsEl = document.getElementById('films-produced-display');
        var boxOfficeEl = document.getElementById('total-box-office-display');

        if (repEl) repEl.textContent = gameState.reputation || 50;
        if (filmsEl) filmsEl.textContent = (gameState.completedFilms || []).length;
        if (boxOfficeEl) {
            var total = gameState.stats ? (gameState.stats.boxOfficeTotal || 0) : 0;
            boxOfficeEl.textContent = '$' + total.toLocaleString();
        }
    }

    function getPriorityValue(priority) {
        var priorities = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorities[priority] || 1;
    }

    // ================================================================
    // UI HELPERS
    // ================================================================

    function formatDate(date) {
        var months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[date.getMonth()] + ' ' + date.getFullYear();
    }

    function showLoadingScreen() {
        var loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.style.display = 'flex';
    }

    function hideLoadingScreen() {
        var loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(function() { loadingScreen.style.display = 'none'; }, 500);
        }
    }

    function showGameOverScreen(endingType) {
        var gameOverScreen = document.getElementById('game-over-screen');
        var titleElement = document.getElementById('game-over-title');
        var messageElement = document.getElementById('game-over-message');
        var statsElement = document.getElementById('final-stats');

        if (!gameOverScreen) return;

        var title, message;
        switch (endingType) {
            case 'bankruptcy':
                title = 'BANKRUPTCY';
                message = 'Your studio has run out of money. The bank has foreclosed on your assets.';
                break;
            case 'survived':
                title = 'VICTORY';
                message = 'From the golden age through the digital revolution — your studio endured it all. A Hollywood legend.';
                break;
            default:
                title = 'THE END';
                message = 'Your Hollywood journey has come to an end.';
        }

        if (titleElement) titleElement.textContent = title;
        if (messageElement) messageElement.textContent = message;

        if (statsElement) {
            statsElement.innerHTML = '';

            var header = document.createElement('h3');
            header.textContent = 'Final Statistics';
            statsElement.appendChild(header);

            var statsList = [
                { label: 'Years Survived', value: gameState.stats.yearsSurvived.toFixed(1) },
                { label: 'Films Produced', value: gameState.stats.filmsProduced },
                { label: 'Total Box Office', value: '$' + gameState.stats.boxOfficeTotal.toLocaleString() },
                { label: 'Final Cash', value: '$' + gameState.cash.toLocaleString() }
            ];

            statsList.forEach(function(stat) {
                var p = document.createElement('p');
                p.textContent = stat.label + ': ' + stat.value;
                statsElement.appendChild(p);
            });
        }

        gameOverScreen.classList.remove('hidden');
    }

    function hideGameOverScreen() {
        var gameOverScreen = document.getElementById('game-over-screen');
        if (gameOverScreen) gameOverScreen.classList.add('hidden');
    }

    function showModal(content) {
        var modalOverlay = document.getElementById('modal-overlay');
        var modalContent = document.getElementById('modal-content');

        if (modalOverlay && modalContent) {
            modalContent.innerHTML = content;
            modalOverlay.classList.remove('hidden');
        }
    }

    function closeModal() {
        var modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) modalOverlay.classList.add('hidden');
    }

    function switchSection(section) {
        document.querySelectorAll('.nav-btn, .nav-button').forEach(function(btn) {
            btn.classList.remove('active');
        });

        var activeBtn = document.querySelector('[data-section="' + section + '"]');
        if (activeBtn) activeBtn.classList.add('active');

        document.querySelectorAll('.game-section').forEach(function(sec) {
            sec.classList.remove('active');
            sec.style.display = 'none';
        });

        var targetSection = document.getElementById(section + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
        }

        if (section === 'scripts') populateScriptsSection();

        emitEvent('section:changed', { section: section });
    }

    function populateScriptsSection() {
        var scriptsGrid = document.getElementById('available-scripts');
        if (!scriptsGrid) return;

        scriptsGrid.innerHTML = '';

        if (!gameState.availableScripts || gameState.availableScripts.length === 0) {
            var noContent = document.createElement('div');
            noContent.className = 'no-content';
            noContent.textContent = 'No scripts currently available. New scripts arrive monthly.';
            scriptsGrid.appendChild(noContent);
            return;
        }

        gameState.availableScripts.forEach(function(script, index) {
            var card = document.createElement('div');
            card.className = 'script-card';

            var riskClass = (script.censorRisk || 50) > 80 ? 'high-risk' :
                            (script.censorRisk || 50) > 50 ? 'medium-risk' : 'low-risk';

            card.innerHTML =
                '<div class="script-header">' +
                    '<h3 class="script-title">' + escapeHtml(script.title) + '</h3>' +
                    '<span class="script-genre">' + escapeHtml(script.genre || 'Drama') + '</span>' +
                '</div>' +
                '<p class="script-description">' + escapeHtml(script.description || '') + '</p>' +
                '<div class="script-stats">' +
                    '<div class="stat"><span class="stat-label">Budget:</span> $' + (script.budget || 0).toLocaleString() + '</div>' +
                    '<div class="stat"><span class="stat-label">Quality:</span> ' + (script.quality || '?') + '/100</div>' +
                    '<div class="stat"><span class="stat-label">Shooting Days:</span> ' + (script.shootingDays || '?') + '</div>' +
                    '<div class="stat ' + riskClass + '"><span class="stat-label">Censor Risk:</span> ' + (script.censorRisk || '?') + '%</div>' +
                '</div>' +
                (script.historicalNotes ? '<p class="script-notes">' + escapeHtml(script.historicalNotes) + '</p>' : '') +
                '<button class="action-btn primary greenlight-btn" data-script-index="' + index + '">GREENLIGHT</button>';

            var btn = card.querySelector('.greenlight-btn');
            btn.addEventListener('click', function() {
                if (window.ScriptLibrary && window.ScriptLibrary.greenlightScript) {
                    window.ScriptLibrary.greenlightScript(script.id);
                    populateScriptsSection();
                    updateFinancialDisplay();
                    updateActiveProductions();
                } else {
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
            showModalSafe('Script Library', 'Script library not available.');
        }
    }

    function showLoadDialog() {
        if (window.SaveLoadUI && window.SaveLoadUI.showLoadModal) {
            window.SaveLoadUI.showLoadModal();
        } else {
            showModalSafe('Load Game', 'Save/Load system loading...');
        }
    }

    function showModalSafe(title, message) {
        var modalOverlay = document.getElementById('modal-overlay');
        var modalContent = document.getElementById('modal-content');

        if (modalOverlay && modalContent) {
            modalContent.innerHTML = '';

            var h2 = document.createElement('h2');
            h2.textContent = title;
            modalContent.appendChild(h2);

            var p = document.createElement('p');
            p.textContent = message;
            modalContent.appendChild(p);

            var btn = document.createElement('button');
            btn.className = 'action-btn primary';
            btn.textContent = 'Close';
            btn.addEventListener('click', closeModal);
            modalContent.appendChild(btn);

            modalOverlay.classList.remove('hidden');
        }
    }

    function saveGame() {
        if (window.SaveLoadUI && window.SaveLoadUI.showSaveModal) {
            window.SaveLoadUI.showSaveModal();
        } else {
            addAlert({
                type: 'info',
                icon: '\uD83D\uDCBE',
                message: 'Save system loading...',
                priority: 'low'
            });
        }
    }

})();
