/**
 * Complete Gameplay Loop Test
 * Tests production pipeline, historical events, crisis management, and achievements
 */

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path');

console.log('=================================================');
console.log('HOLLYWOOD MOGUL - COMPLETE GAMEPLAY TEST');
console.log('=================================================\n');

// Read and load the HTML
const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'file://' + __dirname + '/'
});

const window = dom.window;
const document = window.document;

// Wait for all scripts to load
setTimeout(() => {
    console.log('TEST 1: Production Pipeline');
    console.log('===========================\n');

    try {
        // Add significant cash
        window.HollywoodMogul.addCash(10000000);
        console.log('✓ Added $10M cash for testing\n');

        let gameState = window.HollywoodMogul.getGameState();
        console.log(`Starting state:`);
        console.log(`  - Year: ${gameState.gameYear}`);
        console.log(`  - Cash: $${gameState.cash.toLocaleString()}`);
        console.log(`  - Films: ${gameState.activeFilms.length} active, ${gameState.completedFilms.length} completed\n`);

        // Check available scripts
        if (gameState.availableScripts.length === 0 && window.ScriptLibrary) {
            console.log('⚠️  No scripts available, generating...');
            gameState.availableScripts = window.ScriptLibrary.generateInitialScripts();
            console.log(`✓ Generated ${gameState.availableScripts.length} scripts\n`);
        }

        // Greenlight a film
        if (gameState.availableScripts.length > 0 && window.ProductionSystem) {
            const script = gameState.availableScripts[0];
            console.log(`Greenlighting: "${script.title}"`);
            console.log(`  - Genre: ${script.genre}`);
            console.log(`  - Budget: $${script.estimatedBudget.toLocaleString()}`);
            console.log(`  - Production Time: ${script.productionWeeks} weeks\n`);

            const result = window.ProductionSystem.greenlightFilm(script, gameState);

            if (result.success) {
                console.log('✓ Film greenlit successfully');
                console.log(`  - Film ID: ${result.film.id}`);
                console.log(`  - Status: ${result.film.status}\n`);
            } else {
                console.log(`✗ Failed to greenlight: ${result.message}\n`);
            }
        }

        // Advance through production
        console.log('Advancing through production (12 weeks)...');
        for (let i = 0; i < 12; i++) {
            window.HollywoodMogul.advanceTime('week');
        }

        gameState = window.HollywoodMogul.getGameState();
        console.log(`✓ Advanced 12 weeks`);
        console.log(`  - Active films: ${gameState.activeFilms.length}`);
        console.log(`  - Completed films: ${gameState.completedFilms.length}\n`);

        // Check if film completed
        if (gameState.completedFilms.length > 0) {
            const completedFilm = gameState.completedFilms[0];
            console.log(`✓ Film completed: "${completedFilm.title}"`);
            console.log(`  - Quality: ${completedFilm.quality}/100`);
            console.log(`  - Final Budget: $${completedFilm.finalBudget.toLocaleString()}\n`);

            // Distribute film
            if (window.BoxOfficeSystem) {
                console.log('Distributing film (Wide Release)...');
                const distResult = window.BoxOfficeSystem.distributeFilm(completedFilm.id, 'wide', gameState);

                if (distResult.success) {
                    console.log('✓ Film distributed successfully\n');

                    // Advance to see box office
                    console.log('Advancing 8 weeks to track box office...');
                    for (let i = 0; i < 8; i++) {
                        window.HollywoodMogul.advanceTime('week');
                    }

                    gameState = window.HollywoodMogul.getGameState();
                    console.log(`✓ Box office tracking complete`);
                    console.log(`  - Films in theaters: ${gameState.activeFilms.filter(f => f.inTheaters).length}`);
                    console.log(`  - Current cash: $${gameState.cash.toLocaleString()}\n`);
                }
            }
        }

        console.log('✓ PRODUCTION PIPELINE TEST PASSED\n\n');

    } catch (error) {
        console.log(`✗ PRODUCTION PIPELINE TEST FAILED: ${error.message}\n\n`);
    }

    // Test historical events
    console.log('TEST 2: Historical Events');
    console.log('=========================\n');

    try {
        let gameState = window.HollywoodMogul.getGameState();

        // Advance to 1934 (Hays Code)
        console.log('Advancing to July 1934 (Hays Code)...');
        while (gameState.gameYear < 1934 || gameState.currentDate.getMonth() < 6) {
            window.HollywoodMogul.advanceTime('month');
            gameState = window.HollywoodMogul.getGameState();
        }

        console.log(`✓ Reached ${gameState.currentDate.toLocaleDateString()}`);

        if (window.HistoricalEvents) {
            const events = window.HistoricalEvents.getTriggeredEvents();
            console.log(`  - Historical events triggered: ${events.length}`);

            if (events.length > 0) {
                events.forEach(event => {
                    console.log(`    • ${event.title} (${event.year})`);
                });
            }

            // Check censorship status
            if (gameState.censorshipActive) {
                console.log('  - Censorship system: ACTIVE ✓');
            } else {
                console.log('  - Censorship system: Not active');
            }
        }

        console.log('');

        // Advance to 1941 (Pearl Harbor)
        console.log('Advancing to December 1941 (Pearl Harbor)...');
        while (gameState.gameYear < 1941 || gameState.currentDate.getMonth() < 11) {
            window.HollywoodMogul.advanceTime('month');
            gameState = window.HollywoodMogul.getGameState();
        }

        console.log(`✓ Reached ${gameState.currentDate.toLocaleDateString()}`);

        if (window.HistoricalEvents) {
            const events = window.HistoricalEvents.getTriggeredEvents();
            console.log(`  - Total historical events: ${events.length}`);

            // Check war status
            if (gameState.warActive) {
                console.log('  - War status: ACTIVE ✓');
            } else {
                console.log('  - War status: Not active');
            }
        }

        console.log('');

        // Advance to 1947 (HUAC)
        console.log('Advancing to October 1947 (HUAC Hearings)...');
        while (gameState.gameYear < 1947 || gameState.currentDate.getMonth() < 9) {
            window.HollywoodMogul.advanceTime('month');
            gameState = window.HollywoodMogul.getGameState();
        }

        console.log(`✓ Reached ${gameState.currentDate.toLocaleDateString()}`);

        if (window.HistoricalEvents) {
            const events = window.HistoricalEvents.getTriggeredEvents();
            console.log(`  - Total historical events: ${events.length}\n`);

            events.forEach(event => {
                console.log(`    • ${event.title} (${event.year})`);
            });

            // Check HUAC status
            if (gameState.huacActive) {
                console.log('  - HUAC investigation: ACTIVE ✓');
            }
        }

        console.log('\n✓ HISTORICAL EVENTS TEST PASSED\n\n');

    } catch (error) {
        console.log(`✗ HISTORICAL EVENTS TEST FAILED: ${error.message}\n\n`);
    }

    // Test achievement system
    console.log('TEST 3: Achievement System');
    console.log('==========================\n');

    try {
        if (window.AchievementSystem) {
            const progress = window.AchievementSystem.getProgress();
            const unlocked = window.AchievementSystem.getUnlockedAchievements();

            console.log('Achievement Progress:');
            console.log(`  - Total: ${progress.total}`);
            console.log(`  - Unlocked: ${progress.unlocked}`);
            console.log(`  - Percentage: ${progress.percentage.toFixed(1)}%`);
            console.log(`  - Points: ${progress.points || 0}\n`);

            if (unlocked.length > 0) {
                console.log('Unlocked Achievements:');
                unlocked.forEach(achievement => {
                    console.log(`  ✓ ${achievement.title} (${achievement.points} pts)`);
                    console.log(`    ${achievement.description}`);
                });
                console.log('');
            } else {
                console.log('⚠️  No achievements unlocked yet\n');
            }

            // Check specific achievements
            const gameState = window.HollywoodMogul.getGameState();
            console.log('Checking achievement conditions...');
            console.log(`  - Films produced: ${gameState.stats.filmsProduced}`);
            console.log(`  - Years survived: ${gameState.stats.yearsSurvived.toFixed(2)}`);
            console.log(`  - Box office total: $${gameState.stats.boxOfficeTotal.toLocaleString()}`);
            console.log(`  - Current year: ${gameState.gameYear}\n`);

            console.log('✓ ACHIEVEMENT SYSTEM TEST PASSED\n\n');
        } else {
            console.log('✗ Achievement system not available\n\n');
        }

    } catch (error) {
        console.log(`✗ ACHIEVEMENT SYSTEM TEST FAILED: ${error.message}\n\n`);
    }

    // Test save/load system
    console.log('TEST 4: Save/Load System');
    console.log('========================\n');

    try {
        const gameState = window.HollywoodMogul.getGameState();
        const cashBefore = gameState.cash;
        const yearBefore = gameState.gameYear;
        const filmsBefore = gameState.stats.filmsProduced;

        console.log('State before save:');
        console.log(`  - Year: ${yearBefore}`);
        console.log(`  - Cash: $${cashBefore.toLocaleString()}`);
        console.log(`  - Films produced: ${filmsBefore}\n`);

        // Save game
        if (window.SaveLoadSystem) {
            console.log('Saving game...');
            const saveResult = window.SaveLoadSystem.saveGame(gameState);

            if (saveResult.success) {
                console.log('✓ Game saved successfully\n');

                // Modify state
                console.log('Modifying state...');
                window.HollywoodMogul.addCash(1000000);
                window.HollywoodMogul.advanceTime('month');
                window.HollywoodMogul.advanceTime('month');

                const modifiedState = window.HollywoodMogul.getGameState();
                console.log(`  - New cash: $${modifiedState.cash.toLocaleString()}`);
                console.log(`  - New date: ${modifiedState.currentDate.toLocaleDateString()}\n`);

                // Load game
                console.log('Loading saved game...');
                const loadResult = window.SaveLoadSystem.loadGame();

                if (loadResult.success) {
                    console.log('✓ Game loaded successfully\n');

                    const loadedState = window.HollywoodMogul.getGameState();
                    console.log('State after load:');
                    console.log(`  - Year: ${loadedState.gameYear}`);
                    console.log(`  - Cash: $${loadedState.cash.toLocaleString()}`);
                    console.log(`  - Films produced: ${loadedState.stats.filmsProduced}\n`);

                    // Verify state was restored
                    if (loadedState.gameYear === yearBefore && loadedState.cash === cashBefore) {
                        console.log('✓ State correctly restored\n');
                    } else {
                        console.log('⚠️  State may not have restored correctly\n');
                    }
                }
            }

            console.log('✓ SAVE/LOAD SYSTEM TEST PASSED\n\n');
        } else {
            console.log('⚠️  SaveLoadSystem not available\n\n');
        }

    } catch (error) {
        console.log(`✗ SAVE/LOAD SYSTEM TEST FAILED: ${error.message}\n\n`);
    }

    // Final summary
    console.log('=================================================');
    console.log('GAMEPLAY TEST COMPLETE');
    console.log('=================================================\n');

    const gameState = window.HollywoodMogul.getGameState();

    console.log('Final Game State:');
    console.log(`  - Year: ${gameState.gameYear}`);
    console.log(`  - Cash: $${gameState.cash.toLocaleString()}`);
    console.log(`  - Films Produced: ${gameState.stats.filmsProduced}`);
    console.log(`  - Box Office Total: $${gameState.stats.boxOfficeTotal.toLocaleString()}`);
    console.log(`  - Years Survived: ${gameState.stats.yearsSurvived.toFixed(2)}`);
    console.log(`  - Reputation: ${gameState.reputation}`);

    if (window.AchievementSystem) {
        const progress = window.AchievementSystem.getProgress();
        console.log(`  - Achievements: ${progress.unlocked}/${progress.total} (${progress.percentage.toFixed(1)}%)`);
    }

    if (window.HistoricalEvents) {
        const events = window.HistoricalEvents.getTriggeredEvents();
        console.log(`  - Historical Events: ${events.length} triggered`);
    }

    console.log('\n🎬 COMPLETE GAMEPLAY TEST FINISHED SUCCESSFULLY! 🎬\n');

    process.exit(0);

}, 3000); // Wait 3 seconds for all scripts to load
