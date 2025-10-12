/**
 * Jest Test Setup
 * Global configuration and utilities for all tests
 */

// Extend Jest matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Global test utilities
global.testUtils = {
  /**
   * Create a mock DOM structure for game
   */
  createMockDOM() {
    document.body.innerHTML = `
      <div id="loading-screen" style="display: none;"></div>
      <div id="game-over-screen" class="hidden">
        <h2 id="game-over-title"></h2>
        <p id="game-over-message"></p>
        <div id="final-stats"></div>
      </div>
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
      <div class="nav-btn" data-section="theater"></div>
      <div class="nav-btn" data-section="talent"></div>
      <div class="nav-btn" data-section="studio"></div>
    `;
  },

  /**
   * Clean up DOM
   */
  cleanupDOM() {
    document.body.innerHTML = '';
  },

  /**
   * Create a mock game state
   */
  createMockGameState(overrides = {}) {
    return {
      currentDate: new Date(1933, 0, 1),
      gameWeek: 1,
      gameYear: 1933,
      cash: 75000,
      monthlyBurn: 30000,
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
      ...overrides
    };
  },

  /**
   * Create a mock film object
   */
  createMockFilm(overrides = {}) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Test Film',
      genre: 'Drama',
      budget: 50000,
      weeklyProgress: 0,
      totalWeeks: 12,
      status: 'pre-production',
      quality: 50,
      ...overrides
    };
  },

  /**
   * Create a mock alert
   */
  createMockAlert(overrides = {}) {
    return {
      id: Date.now() + Math.random(),
      type: 'info',
      icon: '📢',
      message: 'Test alert',
      priority: 'medium',
      timestamp: new Date(),
      ...overrides
    };
  },

  /**
   * Advance game time by specified periods
   */
  advanceGameTime(game, weeks = 0, months = 0) {
    for (let i = 0; i < months; i++) {
      game.advanceTime('month');
    }
    for (let i = 0; i < weeks; i++) {
      game.advanceTime('week');
    }
  },

  /**
   * Wait for async operations
   */
  async waitFor(conditionFn, timeout = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (conditionFn()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error('Timeout waiting for condition');
  }
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock setTimeout/setInterval for faster tests
jest.useFakeTimers();

// Global beforeEach
beforeEach(() => {
  // Clear all mocks
  jest.clearAllMocks();

  // Reset timers
  jest.clearAllTimers();
});

// Global afterEach
afterEach(() => {
  // Clean up DOM
  global.testUtils.cleanupDOM();

  // Clear localStorage
  localStorageMock.clear();
});

console.info('Test environment initialized');
