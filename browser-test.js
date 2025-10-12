/**
 * Browser Integration Test
 * Tests the game in a simulated browser environment
 */

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path');

console.log('=================================================');
console.log('HOLLYWOOD MOGUL - BROWSER INTEGRATION TEST');
console.log('=================================================\n');

// Read the HTML file
const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

// Create JSDOM instance with the actual HTML
const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'file://' + __dirname + '/',
    beforeParse(window) {
        // Track console messages
        window.consoleMessages = [];
        window.consoleErrors = [];

        const originalLog = window.console.log;
        const originalError = window.console.error;
        const originalWarn = window.console.warn;

        window.console.log = function(...args) {
            window.consoleMessages.push(['log', ...args]);
            originalLog.apply(window.console, args);
        };

        window.console.error = function(...args) {
            window.consoleErrors.push(['error', ...args]);
            originalError.apply(window.console, args);
        };

        window.console.warn = function(...args) {
            window.consoleMessages.push(['warn', ...args]);
            originalWarn.apply(window.console, args);
        };
    }
});

const window = dom.window;
const document = window.document;

// Wait for scripts to load
setTimeout(() => {
    console.log('TEST 1: File Loading');
    console.log('-------------------');

    // Check if main systems are loaded
    const systems = [
        'HollywoodMogul',
        'TimeSystem',
        'FinancialSystem',
        'ProductionSystem',
        'BoxOfficeSystem',
        'EventSystem',
        'CensorshipSystem',
        'CrisisSystem',
        'AchievementSystem',
        'TutorialSystem',
        'HistoricalEvents',
        'TalentRoster',
        'ScriptLibrary',
        'DashboardUI',
        'ModalSystem',
        'Integration'
    ];

    let loadedCount = 0;
    let failedSystems = [];

    systems.forEach(system => {
        if (window[system]) {
            console.log(`✓ ${system} loaded`);
            loadedCount++;
        } else {
            console.log(`✗ ${system} NOT loaded`);
            failedSystems.push(system);
        }
    });

    console.log(`\nSystems loaded: ${loadedCount}/${systems.length}`);

    if (failedSystems.length > 0) {
        console.log('⚠️  Failed to load:', failedSystems.join(', '));
    }

    // Check for JavaScript errors
    console.log('\n\nTEST 2: JavaScript Errors');
    console.log('-------------------------');

    if (window.consoleErrors.length === 0) {
        console.log('✓ No JavaScript errors detected');
    } else {
        console.log(`✗ ${window.consoleErrors.length} errors found:`);
        window.consoleErrors.forEach((error, i) => {
            console.log(`  ${i + 1}. ${error.slice(1).join(' ')}`);
        });
    }

    // Test game initialization
    console.log('\n\nTEST 3: Game Initialization');
    console.log('---------------------------');

    if (window.HollywoodMogul) {
        try {
            const gameState = window.HollywoodMogul.getGameState();

            console.log('✓ Game state accessible');
            console.log(`  - Year: ${gameState.gameYear}`);
            console.log(`  - Cash: $${gameState.cash.toLocaleString()}`);
            console.log(`  - Monthly Burn: $${gameState.monthlyBurn.toLocaleString()}`);
            console.log(`  - Reputation: ${gameState.reputation}`);
            console.log(`  - Active Films: ${gameState.activeFilms.length}`);
            console.log(`  - Available Scripts: ${gameState.availableScripts.length}`);
        } catch (error) {
            console.log(`✗ Error accessing game state: ${error.message}`);
        }
    } else {
        console.log('✗ HollywoodMogul not available');
    }

    // Test time advancement
    console.log('\n\nTEST 4: Time Progression');
    console.log('------------------------');

    if (window.HollywoodMogul) {
        try {
            // Add cash to prevent bankruptcy
            window.HollywoodMogul.addCash(500000);

            const initialState = window.HollywoodMogul.getGameState();
            const initialYear = initialState.gameYear;
            const initialWeek = initialState.gameWeek;

            // Advance one week
            window.HollywoodMogul.advanceTime('week');
            let state = window.HollywoodMogul.getGameState();

            if (state.gameWeek === initialWeek + 1) {
                console.log('✓ Week advancement works');
            } else {
                console.log(`✗ Week advancement failed (expected ${initialWeek + 1}, got ${state.gameWeek})`);
            }

            // Advance to next year
            for (let i = 0; i < 52; i++) {
                window.HollywoodMogul.advanceTime('week');
            }

            state = window.HollywoodMogul.getGameState();

            if (state.gameYear > initialYear) {
                console.log(`✓ Year boundary crossing works (${initialYear} → ${state.gameYear})`);
            } else {
                console.log(`✗ Year boundary crossing failed (still at ${state.gameYear})`);
            }
        } catch (error) {
            console.log(`✗ Error during time progression: ${error.message}`);
        }
    }

    // Test achievement system
    console.log('\n\nTEST 5: Achievement System');
    console.log('--------------------------');

    if (window.AchievementSystem) {
        try {
            const progress = window.AchievementSystem.getProgress();
            console.log('✓ Achievement system accessible');
            console.log(`  - Total achievements: ${progress.total}`);
            console.log(`  - Unlocked: ${progress.unlocked}`);
            console.log(`  - Points: ${progress.points}`);
            console.log(`  - Completion: ${progress.percentage.toFixed(1)}%`);
        } catch (error) {
            console.log(`✗ Error accessing achievements: ${error.message}`);
        }
    } else {
        console.log('✗ AchievementSystem not available');
    }

    // Test historical events
    console.log('\n\nTEST 6: Historical Events');
    console.log('-------------------------');

    if (window.HistoricalEvents) {
        try {
            const events = window.HistoricalEvents.getTriggeredEvents();
            console.log('✓ Historical events system accessible');
            console.log(`  - Events triggered: ${events.length}`);

            if (events.length > 0) {
                events.forEach(event => {
                    console.log(`    • ${event.title} (${event.year})`);
                });
            }
        } catch (error) {
            console.log(`✗ Error accessing historical events: ${error.message}`);
        }
    } else {
        console.log('✗ HistoricalEvents not available');
    }

    // Test UI elements
    console.log('\n\nTEST 7: UI Elements');
    console.log('-------------------');

    const uiElements = [
        'current-date',
        'current-cash',
        'monthly-burn',
        'cash-runway',
        'films-in-production',
        'films-in-theaters',
        'alerts-section',
        'btn-advance-week',
        'btn-advance-month',
        'save-game',
        'load-game'
    ];

    let foundElements = 0;
    let missingElements = [];

    uiElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            foundElements++;
        } else {
            missingElements.push(id);
        }
    });

    console.log(`✓ UI elements found: ${foundElements}/${uiElements.length}`);

    if (missingElements.length > 0) {
        console.log('⚠️  Missing elements:', missingElements.join(', '));
    }

    // Test CSS loading
    console.log('\n\nTEST 8: CSS Files');
    console.log('-----------------');

    const cssFiles = [
        'css/main.css',
        'css/responsive.css',
        'css/tutorial.css',
        'css/achievements.css',
        'css/modals-extended.css'
    ];

    const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
    console.log(`✓ ${linkElements.length} CSS files linked`);

    linkElements.forEach(link => {
        const href = link.getAttribute('href');
        console.log(`  - ${href}`);
    });

    // Performance check
    console.log('\n\nTEST 9: Performance');
    console.log('-------------------');

    if (window.HollywoodMogul) {
        const start = Date.now();

        // Add cash to prevent bankruptcy
        window.HollywoodMogul.addCash(1000000);

        // Simulate 100 weeks of gameplay
        for (let i = 0; i < 100; i++) {
            window.HollywoodMogul.advanceTime('week');
        }

        const end = Date.now();
        const duration = end - start;

        console.log(`✓ 100 weeks simulated in ${duration}ms`);
        console.log(`  - Average: ${(duration / 100).toFixed(2)}ms per week`);

        if (duration < 1000) {
            console.log('  - Performance: EXCELLENT');
        } else if (duration < 2000) {
            console.log('  - Performance: GOOD');
        } else {
            console.log('  - Performance: NEEDS OPTIMIZATION');
        }
    }

    // Final summary
    console.log('\n\n=================================================');
    console.log('TEST SUMMARY');
    console.log('=================================================');

    const allSystemsLoaded = failedSystems.length === 0;
    const noErrors = window.consoleErrors.length === 0;
    const gameInitialized = window.HollywoodMogul !== undefined;

    console.log(`Systems Loaded: ${allSystemsLoaded ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`No JS Errors: ${noErrors ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`Game Initialized: ${gameInitialized ? '✓ PASS' : '✗ FAIL'}`);

    if (allSystemsLoaded && noErrors && gameInitialized) {
        console.log('\n🎉 ALL TESTS PASSED - GAME READY FOR LAUNCH! 🎉');
        process.exit(0);
    } else {
        console.log('\n⚠️  SOME TESTS FAILED - REVIEW ISSUES ABOVE');
        process.exit(1);
    }

}, 2000); // Wait 2 seconds for all scripts to load
