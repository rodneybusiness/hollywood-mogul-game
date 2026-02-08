/**
 * HOLLYWOOD MOGUL - GAME CONTROLLER
 * Orchestrates the game loop: time advancement, expense processing,
 * event dispatching, and end conditions.
 *
 * Extracted from game-state.js to separate game logic from state management.
 * Communicates via EventBus so UI modules can react without coupling.
 *
 * Dependencies: EventBus, GameConstants, TimeSystem (optional), HollywoodMogul (state)
 */

window.GameController = (function() {
    'use strict';

    var constants;

    function getConstants() {
        if (!constants) {
            constants = window.GameConstants || {};
        }
        return constants;
    }

    // ================================================================
    // TIME ADVANCEMENT
    // ================================================================

    /**
     * Advance game time by the specified period.
     * @param {string} period - 'week' or 'month'
     */
    function advanceTime(period) {
        var gameState = window.HollywoodMogul.getGameState();
        if (gameState.gameEnded) return;

        if (period === 'week') {
            advanceWeek(gameState);
        } else if (period === 'month') {
            advanceMonth(gameState);
        }

        // Emit after all processing is done
        window.EventBus.emit('time:advanced', {
            period: period,
            date: gameState.currentDate,
            week: gameState.gameWeek,
            year: gameState.gameYear
        });

        window.EventBus.emit('state:changed', gameState);
        checkGameEndConditions(gameState);
    }

    /**
     * Advance by one week.
     */
    function advanceWeek(gameState) {
        var C = getConstants();
        var oldYear = gameState.gameYear;
        var oldMonth = gameState.currentDate.getMonth();

        gameState.gameWeek += 1;
        gameState.currentDate.setDate(gameState.currentDate.getDate() + 7);
        gameState.gameYear = gameState.currentDate.getFullYear();

        // Check if we crossed a month boundary
        var newMonth = gameState.currentDate.getMonth();
        var weeksPerMonth = (C.TIME && C.TIME.WEEKS_PER_MONTH) || 4;

        if (gameState.gameYear !== oldYear || newMonth !== oldMonth || gameState.gameWeek % weeksPerMonth === 1) {
            processMonthlyExpenses(gameState);
        }

        // Detect era transitions on year change
        if (gameState.gameYear !== oldYear) {
            checkEraTransition(oldYear, gameState.gameYear);
        }

        processWeeklyEvents(gameState);
    }

    /**
     * Advance by one month (4 weeks).
     */
    function advanceMonth(gameState) {
        var C = getConstants();
        var weeksPerMonth = (C.TIME && C.TIME.WEEKS_PER_MONTH) || 4;

        gameState.gameWeek += weeksPerMonth;
        gameState.currentDate.setMonth(gameState.currentDate.getMonth() + 1);
        gameState.gameYear = gameState.currentDate.getFullYear();

        processMonthlyExpenses(gameState);
        processMonthlyEvents(gameState);
    }

    // ================================================================
    // EXPENSE PROCESSING
    // ================================================================

    /**
     * Process monthly studio expenses.
     */
    function processMonthlyExpenses(gameState) {
        var monthlyBurn = calculateMonthlyBurn(gameState);
        gameState.cash -= monthlyBurn;
        gameState.totalExpenses += monthlyBurn;

        window.EventBus.emit('financial:expenses', {
            amount: monthlyBurn,
            cash: gameState.cash
        });

        // Also add alert through unified system
        window.HollywoodMogul.addAlert({
            type: 'financial',
            icon: '\uD83D\uDCB0',
            message: 'Monthly expenses: -$' + monthlyBurn.toLocaleString(),
            priority: 'medium'
        });
    }

    /**
     * Calculate current monthly burn rate from all studio costs.
     */
    function calculateMonthlyBurn(gameState) {
        var C = getConstants();
        var F = C.FINANCIAL || {};

        var burn = (F.SOUND_STAGE_COST || 10000) * gameState.soundStages;
        burn += (F.OVERHEAD_COST || 3000);
        burn += (F.CONTRACT_PLAYERS_COST || 7000);

        // Contract player salaries
        if (gameState.contractPlayers) {
            for (var i = 0; i < gameState.contractPlayers.length; i++) {
                burn += gameState.contractPlayers[i].monthlySalary || 0;
            }
        }

        // Studio lot maintenance
        if (gameState.studioLot && gameState.studioLot.totalMaintenanceCost) {
            burn += gameState.studioLot.totalMaintenanceCost;
        }

        // Technology maintenance costs
        if (window.TechnologySystem && window.TechnologySystem.getTotalMaintenanceCost) {
            burn += window.TechnologySystem.getTotalMaintenanceCost(gameState);
        }

        // Apply era financial scaling (costs rise with inflation over decades)
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

    /**
     * Dispatch weekly events to all game systems.
     */
    function processWeeklyEvents(gameState) {
        // Film production
        if (window.ProductionSystem && window.ProductionSystem.processWeeklyProduction) {
            window.ProductionSystem.processWeeklyProduction(gameState);
        }

        // Box office
        if (window.BoxOfficeSystem && window.BoxOfficeSystem.processWeeklyBoxOffice) {
            window.BoxOfficeSystem.processWeeklyBoxOffice(gameState);
        }

        // Random events
        var eventProb = (C.PRODUCTION && C.PRODUCTION.EVENT_PROBABILITY) || 0.08;
        if (Math.random() < eventProb) {
            if (window.EventSystem && window.EventSystem.generateRandomEvent) {
                window.EventSystem.generateRandomEvent(gameState);
            }
        }

        // Rival studios
        if (window.RivalStudios && window.RivalStudios.processWeeklyRivalUpdates) {
            window.RivalStudios.processWeeklyRivalUpdates(gameState);
        }

        // Achievements
        if (window.AchievementSystem && window.AchievementSystem.checkAchievements) {
            window.AchievementSystem.checkAchievements(gameState);
        }

        window.EventBus.emit('week:processed', {
            week: gameState.gameWeek,
            date: gameState.currentDate
        });
    }

    /**
     * Dispatch monthly events to all game systems.
     */
    function processMonthlyEvents(gameState) {
        // Newspaper
        if (window.NewspaperSystem && window.NewspaperSystem.showNewspaper) {
            setTimeout(function() {
                window.NewspaperSystem.showNewspaper(gameState);
            }, 300);
        }

        // New scripts
        if (window.ScriptLibrary && window.ScriptLibrary.generateMonthlyScripts) {
            var newScripts = window.ScriptLibrary.generateMonthlyScripts(gameState);
            if (newScripts && newScripts.length > 0) {
                gameState.availableScripts.push.apply(gameState.availableScripts, newScripts);
                window.HollywoodMogul.addAlert({
                    type: 'info',
                    icon: '\uD83D\uDCDC',
                    message: newScripts.length + ' new script(s) available for review',
                    priority: 'medium'
                });
            }
        }

        // Historical events
        if (window.HistoricalEvents && window.HistoricalEvents.checkForEvents) {
            window.HistoricalEvents.checkForEvents(gameState);
        }

        // Loan interest
        if (window.FinancialSystem && window.FinancialSystem.processMonthlyLoans) {
            window.FinancialSystem.processMonthlyLoans(gameState);
        }

        // Academy Awards (March, starting 1934)
        if (window.AwardsSystem && window.AwardsSystem.shouldTriggerOscars) {
            if (window.AwardsSystem.shouldTriggerOscars(gameState)) {
                window.AwardsSystem.triggerOscarCeremony(gameState);
            }
        }

        // Achievements
        if (window.AchievementSystem && window.AchievementSystem.checkAchievements) {
            window.AchievementSystem.checkAchievements(gameState);
        }

        // TV competition events (1950-1970)
        if (window.TVCompetitionSystem && window.TVCompetitionSystem.checkForTvEvents) {
            var tvEvent = window.TVCompetitionSystem.checkForTvEvents(gameState);
            if (tvEvent && window.HollywoodMogul) {
                window.HollywoodMogul.addAlert({
                    type: 'warning',
                    icon: '\uD83D\uDCFA',
                    message: tvEvent.message,
                    priority: 'medium'
                });
            }
        }

        // Scenario victory conditions
        if (window.ScenarioUI && window.ScenarioUI.checkVictoryConditions) {
            window.ScenarioUI.checkVictoryConditions(gameState);
        }

        // Update years survived stat
        var startDate = new Date(1933, 0, 1);
        var daysSurvived = Math.floor((gameState.currentDate - startDate) / (1000 * 60 * 60 * 24));
        gameState.stats.yearsSurvived = daysSurvived / 365.25;

        window.EventBus.emit('month:processed', {
            date: gameState.currentDate,
            year: gameState.gameYear
        });
    }

    // ================================================================
    // ERA TRANSITIONS
    // ================================================================

    /**
     * Check if the year change caused an era transition.
     */
    function checkEraTransition(oldYear, newYear) {
        var C = getConstants();
        if (!C.getEraKeyForYear) return;

        var oldEra = C.getEraKeyForYear(oldYear);
        var newEra = C.getEraKeyForYear(newYear);

        if (oldEra !== newEra && window.EventBus) {
            var eraInfo = null;
            if (window.TimeSystem && window.TimeSystem.getCurrentPeriod) {
                eraInfo = window.TimeSystem.getCurrentPeriod(newYear);
            }
            window.EventBus.emit('era:changed', {
                oldEra: oldEra,
                newEra: newEra,
                year: newYear,
                eraInfo: eraInfo
            });
        }
    }

    // ================================================================
    // GAME END CONDITIONS
    // ================================================================

    /**
     * Check if the game should end.
     */
    function checkGameEndConditions(gameState) {
        var C = getConstants();
        var endYear = (C.TIME && C.TIME.GAME_END_YEAR) || 2010;

        // Bankruptcy
        if (gameState.cash < 0) {
            endGame(gameState, 'bankruptcy');
            return;
        }

        // Reached end year
        if (gameState.gameYear >= endYear) {
            endGame(gameState, 'survived');
            return;
        }

        // Financial warnings
        updateFinancialWarnings(gameState);
    }

    /**
     * End the game.
     */
    function endGame(gameState, endingType) {
        gameState.gameEnded = true;
        gameState.endingType = endingType;

        window.EventBus.emit('game:ended', {
            type: endingType,
            stats: gameState.stats,
            cash: gameState.cash
        });
    }

    /**
     * Emit financial warning alerts when cash runway is low.
     */
    function updateFinancialWarnings(gameState) {
        var C = getConstants();
        var dangerWeeks = (C.FINANCIAL && C.FINANCIAL.RUNWAY_DANGER_WEEKS) || 8;
        var warningWeeks = (C.FINANCIAL && C.FINANCIAL.RUNWAY_WARNING_WEEKS) || 16;

        var runway = calculateRunwayWeeks(gameState);

        if (runway <= dangerWeeks && runway > 0) {
            window.HollywoodMogul.addAlert({
                type: 'danger',
                icon: '\u26A0\uFE0F',
                message: 'CRITICAL: Only ' + runway + ' weeks of cash remaining!',
                priority: 'critical'
            });
        } else if (runway <= warningWeeks) {
            window.HollywoodMogul.addAlert({
                type: 'warning',
                icon: '\uD83D\uDCB8',
                message: 'Cash running low: ' + runway + ' weeks remaining',
                priority: 'high'
            });
        }
    }

    /**
     * Calculate cash runway in weeks.
     */
    function calculateRunwayWeeks(gameState) {
        var C = getConstants();
        var weeksPerMonth = (C.TIME && C.TIME.WEEKS_PER_MONTH) || 4;

        if (gameState.monthlyBurn <= 0) return 999;
        var weeklyBurn = gameState.monthlyBurn / weeksPerMonth;
        return Math.floor(gameState.cash / weeklyBurn);
    }

    // ================================================================
    // PUBLIC API
    // ================================================================

    return {
        advanceTime: advanceTime,
        calculateMonthlyBurn: calculateMonthlyBurn,
        calculateRunwayWeeks: calculateRunwayWeeks,
        checkGameEndConditions: checkGameEndConditions,
        endGame: function(endingType) {
            var gameState = window.HollywoodMogul.getGameState();
            endGame(gameState, endingType);
        }
    };
})();
