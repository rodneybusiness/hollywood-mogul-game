/**
 * Test browser initialization to debug loading screen stuck issue
 */

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path');

console.log('=================================================');
console.log('HOLLYWOOD MOGUL - BROWSER INITIALIZATION TEST');
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

// Monitor console output
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.log('\n--- Browser Console Output ---\n');

window.console.log = (...args) => {
    originalConsoleLog('[Browser]', ...args);
};

window.console.error = (...args) => {
    originalConsoleError('[Browser ERROR]', ...args);
};

// Wait for initialization
setTimeout(() => {
    console.log('\n--- Initialization Check ---\n');

    // Check if systems loaded
    const systems = [
        'HollywoodMogul',
        'TimeSystem',
        'ScriptLibrary',
        'FinancialSystem',
        'ProductionSystem',
        'BoxOfficeSystem',
        'DashboardUI',
        'ModalSystem'
    ];

    systems.forEach(system => {
        if (window[system]) {
            console.log(`✓ ${system} loaded`);
        } else {
            console.log(`✗ ${system} NOT loaded`);
        }
    });

    // Check loading screen state
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        console.log(`\nLoading screen display: ${loadingScreen.style.display}`);
        if (loadingScreen.style.display === 'none' || !loadingScreen.style.display) {
            console.log('✓ Loading screen hidden successfully');
        } else {
            console.log('✗ Loading screen still visible');
        }
    } else {
        console.log('✗ Loading screen element not found');
    }

    // Check game state
    if (window.HollywoodMogul && window.HollywoodMogul.getGameState) {
        try {
            const gameState = window.HollywoodMogul.getGameState();
            console.log('\nGame State:');
            console.log(`  - Year: ${gameState.gameYear}`);
            console.log(`  - Cash: $${gameState.cash.toLocaleString()}`);
            console.log(`  - Game Started: ${!gameState.gameEnded}`);
        } catch (error) {
            console.log(`\n✗ Error getting game state: ${error.message}`);
        }
    }

    console.log('\n=================================================');
    console.log('TEST COMPLETE');
    console.log('=================================================\n');

    process.exit(0);
}, 5000); // Wait 5 seconds for initialization
