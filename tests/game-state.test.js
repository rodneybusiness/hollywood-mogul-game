/**
 * HOLLYWOOD MOGUL - GAME STATE TESTS
 * Comprehensive test suite for core game state management
 */

describe('HollywoodMogul Game State', () => {
    let mockDOM;

    beforeEach(() => {
        // Set up DOM mock
        document.body.innerHTML = `
            <div id="loading-screen" style="display: none;"></div>
            <div id="game-over-screen" class="hidden"></div>
            <div id="modal-overlay" class="hidden">
                <div id="modal-content"></div>
            </div>
            <div id="current-date"></div>
            <div id="cash-display"></div>
            <div id="burn-display"></div>
            <div id="runway-display"></div>
            <div id="runway-status"></div>
            <div id="active-productions"></div>
            <div id="theater-films"></div>
            <div id="game-alerts"></div>
            <button id="btn-advance-week"></button>
            <button id="btn-advance-month"></button>
            <button id="btn-new-script"></button>
            <button id="btn-save-game"></button>
            <button id="btn-load-game"></button>
            <button id="btn-restart"></button>
            <div class="nav-btn" data-section="dashboard"></div>
            <div class="nav-btn" data-section="production"></div>
        `;

        // Load the game state module
        require('../js/core/game-state.js');
    });

    afterEach(() => {
        // Clean up
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    describe('Initialization', () => {
        test('should initialize with correct default game state', () => {
            const gameState = window.HollywoodMogul.getGameState();

            expect(gameState.gameYear).toBe(1933);
            expect(gameState.cash).toBe(600000);
            expect(gameState.monthlyBurn).toBe(20000);
            expect(gameState.studioName).toBe('Mogul Pictures');
            expect(gameState.reputation).toBe(50);
            expect(gameState.soundStages).toBe(1);
            expect(gameState.activeFilms).toEqual([]);
            expect(gameState.completedFilms).toEqual([]);
        });

        test('should have correct game constants', () => {
            const constants = window.HollywoodMogul.CONSTANTS;

            expect(constants.STARTING_CASH).toBe(600000);
            expect(constants.BASE_MONTHLY_BURN).toBe(20000);
            expect(constants.GAME_END_YEAR).toBe(1949);
            expect(constants.WEEKS_PER_MONTH).toBe(4);
            expect(constants.RUNWAY_DANGER_WEEKS).toBe(8);
            expect(constants.RUNWAY_WARNING_WEEKS).toBe(16);
        });

        test('should start a new game correctly', () => {
            window.HollywoodMogul.startNewGame();
            const gameState = window.HollywoodMogul.getGameState();

            expect(gameState.gameStarted).toBe(true);
            expect(gameState.gameEnded).toBe(false);
            expect(gameState.currentDate.getFullYear()).toBe(1933);
            expect(gameState.currentDate.getMonth()).toBe(0); // January
        });
    });

    describe('Financial Functions', () => {
        beforeEach(() => {
            window.HollywoodMogul.startNewGame();
        });

        test('should correctly get current cash', () => {
            const cash = window.HollywoodMogul.getCash();
            expect(cash).toBe(600000);
        });

        test('should add cash correctly', () => {
            window.HollywoodMogul.addCash(25000);
            expect(window.HollywoodMogul.getCash()).toBe(625000);

            const gameState = window.HollywoodMogul.getGameState();
            expect(gameState.totalRevenue).toBe(25000);
        });

        test('should not add negative amounts to total revenue', () => {
            window.HollywoodMogul.addCash(-10000);
            expect(window.HollywoodMogul.getCash()).toBe(590000);

            const gameState = window.HollywoodMogul.getGameState();
            expect(gameState.totalRevenue).toBe(0);
        });

        test('should spend cash correctly', () => {
            window.HollywoodMogul.spendCash(15000);
            expect(window.HollywoodMogul.getCash()).toBe(585000);

            const gameState = window.HollywoodMogul.getGameState();
            expect(gameState.totalExpenses).toBe(15000);
        });

        test('should calculate runway weeks correctly with positive cash', () => {
            const runway = window.HollywoodMogul.calculateRunwayWeeks();
            // 600000 / (20000/4) = 600000 / 5000 = 120 weeks
            expect(runway).toBe(120);
        });

        test('should calculate runway weeks after spending', () => {
            window.HollywoodMogul.spendCash(100000);
            const runway = window.HollywoodMogul.calculateRunwayWeeks();
            // 500000 / (20000/4) = 500000 / 5000 = 100 weeks
            expect(runway).toBe(100);
        });

        test('should return 999 weeks when monthly burn is zero', () => {
            const gameState = window.HollywoodMogul.getGameState();
            gameState.monthlyBurn = 0;

            const runway = window.HollywoodMogul.calculateRunwayWeeks();
            expect(runway).toBe(999);
        });

        test('should handle negative cash runway', () => {
            window.HollywoodMogul.spendCash(700000); // Spend more than starting cash
            const runway = window.HollywoodMogul.calculateRunwayWeeks();
            expect(runway).toBeLessThan(0);
        });
    });

    describe('Time Progression', () => {
        beforeEach(() => {
            window.HollywoodMogul.startNewGame();
        });

        test('should advance time by one week', () => {
            const initialWeek = window.HollywoodMogul.getGameState().gameWeek;
            window.HollywoodMogul.advanceTime('week');

            const newWeek = window.HollywoodMogul.getGameState().gameWeek;
            expect(newWeek).toBe(initialWeek + 1);
        });

        test('should advance time by one month', () => {
            const initialDate = new Date(window.HollywoodMogul.getCurrentDate());
            window.HollywoodMogul.advanceTime('month');

            const newDate = window.HollywoodMogul.getCurrentDate();
            expect(newDate.getMonth()).toBe((initialDate.getMonth() + 1) % 12);
        });

        test('should deduct monthly expenses after 4 weeks', () => {
            const initialCash = window.HollywoodMogul.getCash();
            const gameState = window.HollywoodMogul.getGameState();
            const monthlyBurn = gameState.monthlyBurn;

            // Advance 4 weeks
            for (let i = 0; i < 4; i++) {
                window.HollywoodMogul.advanceTime('week');
            }

            const finalCash = window.HollywoodMogul.getCash();
            expect(finalCash).toBeLessThan(initialCash);
        });

        test('should update year when crossing year boundary', () => {
            // Add enough cash to survive 12 months (12 * $20,000 = $240,000)
            window.HollywoodMogul.addCash(400000);

            window.HollywoodMogul.advanceTime('month'); // Feb
            window.HollywoodMogul.advanceTime('month'); // Mar

            // Advance to next year
            for (let i = 0; i < 10; i++) {
                window.HollywoodMogul.advanceTime('month');
            }

            const gameState = window.HollywoodMogul.getGameState();
            expect(gameState.gameYear).toBe(1934);
        });

        test('should format date correctly', () => {
            const testDate = new Date(1935, 5, 15); // June 15, 1935
            const formatted = window.HollywoodMogul.formatDate(testDate);
            expect(formatted).toBe('June 1935');
        });
    });

    describe('Game End Conditions', () => {
        beforeEach(() => {
            window.HollywoodMogul.startNewGame();
        });

        test('should not end game when cash is positive', () => {
            window.HollywoodMogul.advanceTime('week');
            const gameState = window.HollywoodMogul.getGameState();
            expect(gameState.gameEnded).toBe(false);
        });

        test('should end game on bankruptcy', () => {
            window.HollywoodMogul.endGame('bankruptcy');
            const gameState = window.HollywoodMogul.getGameState();

            expect(gameState.gameEnded).toBe(true);
            expect(gameState.endingType).toBe('bankruptcy');
        });

        test('should end game on survival to 1949', () => {
            window.HollywoodMogul.endGame('survived');
            const gameState = window.HollywoodMogul.getGameState();

            expect(gameState.gameEnded).toBe(true);
            expect(gameState.endingType).toBe('survived');
        });

        test('should not advance time after game ends', () => {
            window.HollywoodMogul.endGame('bankruptcy');
            const weekBefore = window.HollywoodMogul.getGameState().gameWeek;

            window.HollywoodMogul.advanceTime('week');
            const weekAfter = window.HollywoodMogul.getGameState().gameWeek;

            expect(weekAfter).toBe(weekBefore);
        });
    });

    describe('Alert System', () => {
        beforeEach(() => {
            window.HollywoodMogul.startNewGame();
        });

        test('should add alert to game state', () => {
            window.HollywoodMogul.addAlert({
                type: 'info',
                icon: '📢',
                message: 'Test alert',
                priority: 'medium'
            });

            const gameState = window.HollywoodMogul.getGameState();
            expect(gameState.currentEvents.length).toBeGreaterThan(0);
            expect(gameState.currentEvents[gameState.currentEvents.length - 1].message).toBe('Test alert');
        });

        test('should limit alerts to 10 maximum', () => {
            for (let i = 0; i < 15; i++) {
                window.HollywoodMogul.addAlert({
                    type: 'info',
                    icon: '📢',
                    message: `Alert ${i}`,
                    priority: 'low'
                });
            }

            const gameState = window.HollywoodMogul.getGameState();
            expect(gameState.currentEvents.length).toBe(10);
        });

        test('should add timestamp and ID to alerts', () => {
            window.HollywoodMogul.addAlert({
                type: 'info',
                icon: '📢',
                message: 'Test alert',
                priority: 'medium'
            });

            const gameState = window.HollywoodMogul.getGameState();
            const alert = gameState.currentEvents[gameState.currentEvents.length - 1];

            expect(alert.id).toBeDefined();
            expect(alert.timestamp).toBeInstanceOf(Date);
        });
    });

    describe('Modal Functions', () => {
        beforeEach(() => {
            window.HollywoodMogul.startNewGame();
        });

        test('should show modal with content', () => {
            window.HollywoodMogul.showModal('<h2>Test Modal</h2>');

            const modalOverlay = document.getElementById('modal-overlay');
            const modalContent = document.getElementById('modal-content');

            expect(modalOverlay.classList.contains('hidden')).toBe(false);
            expect(modalContent.innerHTML).toBe('<h2>Test Modal</h2>');
        });

        test('should close modal', () => {
            window.HollywoodMogul.showModal('<h2>Test Modal</h2>');
            window.HollywoodMogul.closeModal();

            const modalOverlay = document.getElementById('modal-overlay');
            expect(modalOverlay.classList.contains('hidden')).toBe(true);
        });
    });

    describe('UI Updates', () => {
        beforeEach(() => {
            window.HollywoodMogul.startNewGame();
        });

        test('should update date display', () => {
            const dateElement = document.getElementById('current-date');
            expect(dateElement.textContent).toBe('January 1933');
        });

        test('should update cash display', () => {
            const cashElement = document.getElementById('cash-display');
            expect(cashElement.textContent).toBe('$600,000');
        });

        test('should update cash display after adding money', () => {
            window.HollywoodMogul.addCash(25000);
            const cashElement = document.getElementById('cash-display');
            expect(cashElement.textContent).toBe('$625,000');
        });

        test('should show negative cash with appropriate class', () => {
            window.HollywoodMogul.spendCash(700000); // Spend more than starting cash
            const cashElement = document.getElementById('cash-display');
            expect(cashElement.className).toContain('negative');
        });

        test('should update runway display', () => {
            // With 600k cash and 20k/month burn, runway is 120 weeks (> 100)
            // so the display shows infinity symbol
            const runwayElement = document.getElementById('runway-display');
            expect(runwayElement.textContent).toBe('∞');
        });

        test('should show danger status when runway is low', () => {
            // Spend enough to get runway below 8 weeks
            // Need cash < 8 * 5000 = 40000, so spend 600000 - 35000 = 565000
            window.HollywoodMogul.spendCash(565000);

            const runwayStatusElement = document.getElementById('runway-status');
            expect(runwayStatusElement.textContent).toBe('DANGER');
            expect(runwayStatusElement.className).toContain('danger');
        });
    });

    describe('Statistics Tracking', () => {
        beforeEach(() => {
            window.HollywoodMogul.startNewGame();
        });

        test('should initialize stats correctly', () => {
            const gameState = window.HollywoodMogul.getGameState();
            expect(gameState.stats.filmsProduced).toBe(0);
            expect(gameState.stats.oscarsWon).toBe(0);
            expect(gameState.stats.boxOfficeTotal).toBe(0);
            expect(gameState.stats.scandalsHandled).toBe(0);
            expect(gameState.stats.yearsSurvived).toBe(0);
        });

        test('should update years survived when advancing time', () => {
            // Add enough cash to survive 6 months (6 * $20,000 = $120,000)
            window.HollywoodMogul.addCash(200000);

            // Advance 6 months
            for (let i = 0; i < 6; i++) {
                window.HollywoodMogul.advanceTime('month');
            }

            const gameState = window.HollywoodMogul.getGameState();
            expect(gameState.stats.yearsSurvived).toBeGreaterThan(0);
            expect(gameState.stats.yearsSurvived).toBeCloseTo(0.5, 1);
        });
    });

    describe('Integration Tests', () => {
        test('should handle complete game flow from start to bankruptcy', () => {
            window.HollywoodMogul.startNewGame();

            // Spend all money to go negative (more than 600000)
            window.HollywoodMogul.spendCash(610000);

            // Try to advance time (should trigger bankruptcy check)
            window.HollywoodMogul.advanceTime('week');

            const gameState = window.HollywoodMogul.getGameState();
            expect(gameState.gameEnded).toBe(true);
        });

        test('should maintain data consistency across multiple time advances', () => {
            window.HollywoodMogul.startNewGame();

            // Add enough cash to survive 12 months (12 * $20,000 = $240,000)
            window.HollywoodMogul.addCash(400000);
            const initialCash = window.HollywoodMogul.getCash();

            // Advance 12 months
            for (let i = 0; i < 12; i++) {
                window.HollywoodMogul.advanceTime('month');
            }

            const finalCash = window.HollywoodMogul.getCash();
            const gameState = window.HollywoodMogul.getGameState();

            expect(finalCash).toBeLessThan(initialCash);
            expect(gameState.gameYear).toBe(1934);
            expect(gameState.totalExpenses).toBeGreaterThan(0);
        });

        test('should handle adding and spending cash in sequence', () => {
            window.HollywoodMogul.startNewGame();

            window.HollywoodMogul.addCash(50000);
            expect(window.HollywoodMogul.getCash()).toBe(650000);

            window.HollywoodMogul.spendCash(25000);
            expect(window.HollywoodMogul.getCash()).toBe(625000);

            const gameState = window.HollywoodMogul.getGameState();
            expect(gameState.totalRevenue).toBe(50000);
            expect(gameState.totalExpenses).toBe(25000);
        });
    });
});
