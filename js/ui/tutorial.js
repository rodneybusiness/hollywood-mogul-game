/**
 * HOLLYWOOD MOGUL - TUTORIAL SYSTEM
 * 15-20 step interactive tutorial for new players
 * Teaches game mechanics, UI navigation, and key concepts
 */

window.TutorialSystem = (function() {
    'use strict';

    let currentStep = 0;
    let tutorialActive = false;
    let tutorialOverlay = null;

    /**
     * Tutorial steps - sequential learning path
     */
    const TUTORIAL_STEPS = [
        {
            id: 'welcome',
            title: 'Welcome to Hollywood - 1933',
            content: `
                <h2>Welcome to MOGUL!</h2>
                <p>You're the head of a Hollywood studio in 1933, at the start of cinema's Golden Age.</p>
                <p><strong>Your goal:</strong> Survive 16 years of Hollywood history, producing great films and building your legacy.</p>
                <p>This tutorial will teach you the basics. You can skip it anytime by clicking "Skip Tutorial" below.</p>
            `,
            highlight: null,
            position: 'center',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'financial_dashboard',
            title: 'Your Financial Dashboard',
            content: `
                <h3>Cash is King</h3>
                <p><strong>CASH ON HAND:</strong> Your current funds ($75,000 to start)</p>
                <p><strong>MONTHLY BURN:</strong> Your fixed costs ($30,000/month for studio operations)</p>
                <p><strong>RUNWAY:</strong> How many weeks until bankruptcy if no revenue comes in</p>
                <p class="tutorial-tip">💡 <strong>Tip:</strong> Always keep an eye on your runway. If it drops below 4 weeks, you're in danger!</p>
            `,
            highlight: '#financial-dashboard',
            position: 'below',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'time_controls',
            title: 'Advancing Time',
            content: `
                <h3>Time Progression</h3>
                <p>Time only advances when you tell it to. Use these buttons:</p>
                <ul>
                    <li><strong>ADVANCE 1 WEEK:</strong> Move forward 7 days</li>
                    <li><strong>ADVANCE 1 MONTH:</strong> Jump ahead 4 weeks</li>
                </ul>
                <p>Films take time to produce, box office revenue comes in weekly, and monthly burn is deducted every 4 weeks.</p>
                <p class="tutorial-tip">💡 <strong>Tip:</strong> Use weeks for active management, months when you're waiting for films to complete.</p>
            `,
            highlight: '#time-controls',
            position: 'above',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'navigation',
            title: 'Navigation',
            content: `
                <h3>Studio Sections</h3>
                <p>Use the navigation bar to access different parts of your studio:</p>
                <ul>
                    <li>🏢 <strong>DASHBOARD:</strong> Overview of active productions and box office</li>
                    <li>📜 <strong>SCRIPTS:</strong> Browse and greenlight new films</li>
                    <li>🎬 <strong>STUDIO:</strong> Manage facilities (coming soon)</li>
                    <li>💰 <strong>FINANCES:</strong> View financial details and take loans</li>
                </ul>
            `,
            highlight: '#game-navigation',
            position: 'above',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'first_script',
            title: 'Your First Film',
            content: `
                <h3>Making Movies</h3>
                <p>To start producing, you need to find a script. Click the <strong>"REVIEW SCRIPTS"</strong> button to browse available screenplays.</p>
                <p>Each script shows:</p>
                <ul>
                    <li><strong>Budget:</strong> How much it will cost to produce</li>
                    <li><strong>Genre:</strong> Type of film (drama, comedy, noir, etc.)</li>
                    <li><strong>Quality Potential:</strong> How good the film could be</li>
                    <li><strong>Synopsis:</strong> What it's about</li>
                </ul>
                <p class="tutorial-tip">💡 <strong>Tip:</strong> Start with a lower-budget film ($50,000-$75,000) to minimize risk.</p>
            `,
            highlight: '#films-in-production',
            position: 'below',
            actions: ['Next', 'Skip Tutorial'],
            waitForAction: true
        },

        {
            id: 'greenlight',
            title: 'Greenlighting a Film',
            content: `
                <h3>Production Begins</h3>
                <p>When you greenlight a script:</p>
                <ol>
                    <li>Budget is deducted from your cash</li>
                    <li>Film enters production (12-16 weeks typically)</li>
                    <li>Random events may occur during filming</li>
                    <li>Film quality develops based on budget, genre, and luck</li>
                </ol>
                <p>You'll see your active films in the Dashboard.</p>
            `,
            highlight: null,
            position: 'center',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'production_phase',
            title: 'Production Phase',
            content: `
                <h3>While Films Are In Production</h3>
                <p>As you advance time, your films progress through production. Watch for:</p>
                <ul>
                    <li><strong>Weeks Remaining:</strong> When the film will be complete</li>
                    <li><strong>Quality Score:</strong> How good the film is (0-100)</li>
                    <li><strong>Random Events:</strong> Good and bad things happen during filming</li>
                </ul>
                <p class="tutorial-tip">💡 <strong>Tip:</strong> Higher quality films earn more at the box office!</p>
            `,
            highlight: '#films-in-production',
            position: 'below',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'distribution',
            title: 'Distribution Strategy',
            content: `
                <h3>Releasing Your Film</h3>
                <p>When production completes, you can distribute the film:</p>
                <ul>
                    <li><strong>Wide Release:</strong> 500+ theaters, higher costs, bigger potential</li>
                    <li><strong>Limited Release:</strong> 100-300 theaters, lower costs, build word-of-mouth</li>
                </ul>
                <p>Films stay in theaters for 8-12 weeks, earning revenue each week.</p>
            `,
            highlight: '#films-in-theaters',
            position: 'below',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'box_office',
            title: 'Box Office Revenue',
            content: `
                <h3>Making Money</h3>
                <p>Box office revenue depends on:</p>
                <ul>
                    <li><strong>Film Quality:</strong> Better films earn more</li>
                    <li><strong>Genre Appeal:</strong> Some genres are more popular</li>
                    <li><strong>Distribution:</strong> Wide release reaches more audience</li>
                    <li><strong>Word of Mouth:</strong> Revenue drops or holds based on reception</li>
                </ul>
                <p class="tutorial-tip">💡 <strong>Tip:</strong> A quality 70+ film can earn 3-5x its budget!</p>
            `,
            highlight: null,
            position: 'center',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'monthly_costs',
            title: 'Managing Your Burn Rate',
            content: `
                <h3>Monthly Expenses</h3>
                <p>Every 4 weeks (1 month), your studio pays:</p>
                <ul>
                    <li>Staff salaries</li>
                    <li>Studio lot maintenance</li>
                    <li>Equipment costs</li>
                    <li>Contract obligations</li>
                </ul>
                <p><strong>Starting burn rate: $30,000/month</strong></p>
                <p class="tutorial-tip">⚠️ <strong>Warning:</strong> If cash hits $0, you go bankrupt and lose!</p>
            `,
            highlight: '#monthly-burn',
            position: 'below',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'loans',
            title: 'Taking Loans',
            content: `
                <h3>Emergency Financing</h3>
                <p>If cash runs low, you can take out loans in the <strong>FINANCES</strong> section:</p>
                <ul>
                    <li><strong>Short-term:</strong> $25,000 at 10% monthly interest</li>
                    <li><strong>Long-term:</strong> $100,000 at 5% monthly interest</li>
                </ul>
                <p>Loan payments are deducted from your monthly burn.</p>
                <p class="tutorial-tip">💡 <strong>Tip:</strong> Only borrow if you have films about to release!</p>
            `,
            highlight: null,
            position: 'center',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'reputation',
            title: 'Studio Reputation',
            content: `
                <h3>Your Industry Standing</h3>
                <p>Reputation (0-100) affects:</p>
                <ul>
                    <li><strong>Script Quality:</strong> Better scripts appear with high reputation</li>
                    <li><strong>Talent Attraction:</strong> Stars want to work with respected studios</li>
                    <li><strong>Censorship Battles:</strong> High reputation helps with PCA</li>
                    <li><strong>Crisis Outcomes:</strong> Better options with high reputation</li>
                </ul>
                <p><strong>You start at reputation: 50</strong></p>
                <p>Build it by making quality films and smart decisions.</p>
            `,
            highlight: null,
            position: 'center',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'historical_events',
            title: 'Historical Context',
            content: `
                <h3>Living Through History</h3>
                <p>The game spans 1933-1949. You'll experience:</p>
                <ul>
                    <li>📜 <strong>1934:</strong> Hays Code enforcement begins (censorship)</li>
                    <li>🎖️ <strong>1941-1945:</strong> World War II (draft, rationing, propaganda)</li>
                    <li>⚠️ <strong>1947-1949:</strong> HUAC hearings (Red Scare, blacklists)</li>
                    <li>⚖️ <strong>1948:</strong> Paramount Decision (antitrust ruling)</li>
                </ul>
                <p>These events will challenge you with difficult choices.</p>
            `,
            highlight: null,
            position: 'center',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'victory_conditions',
            title: 'How to Win',
            content: `
                <h3>Your Goals</h3>
                <p><strong>Primary Goal:</strong> Survive until December 1949</p>
                <p><strong>Victory Paths:</strong></p>
                <ul>
                    <li>💰 <strong>Mogul Ending:</strong> $500,000+ cash, 20+ films</li>
                    <li>🏆 <strong>Prestige Ending:</strong> 5+ Oscars, reputation 80+</li>
                    <li>🎭 <strong>Integrity Ending:</strong> Refused to name names to HUAC</li>
                </ul>
                <p class="tutorial-tip">💡 <strong>Tip:</strong> You can achieve multiple endings!</p>
            `,
            highlight: null,
            position: 'center',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'lose_conditions',
            title: 'How to Lose',
            content: `
                <h3>Game Over Conditions</h3>
                <p>You lose if:</p>
                <ul>
                    <li>💸 <strong>Bankruptcy:</strong> Cash reaches $0 with no way to borrow</li>
                    <li>📛 <strong>Blacklisted:</strong> HUAC destroys your studio (if you resist)</li>
                    <li>🎬 <strong>All Films Fail:</strong> Multiple consecutive flops with no recovery</li>
                </ul>
                <p class="tutorial-tip">⚠️ <strong>Warning:</strong> Don't overspend on production early!</p>
            `,
            highlight: null,
            position: 'center',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'save_and_load',
            title: 'Saving Your Progress',
            content: `
                <h3>Save/Load System</h3>
                <p>Your game auto-saves every time you advance time.</p>
                <p>You can also manually:</p>
                <ul>
                    <li><strong>SAVE:</strong> Store current game state to browser storage</li>
                    <li><strong>LOAD:</strong> Restore your most recent save</li>
                </ul>
                <p class="tutorial-tip">💡 <strong>Tip:</strong> Save before making risky decisions!</p>
            `,
            highlight: '#time-controls',
            position: 'above',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'final_tips',
            title: 'Final Tips for Success',
            content: `
                <h3>Strategy Advice</h3>
                <p><strong>Early Game (1933-1936):</strong></p>
                <ul>
                    <li>Start with 2-3 low-budget films ($50-75K)</li>
                    <li>Build cash reserves before Hays Code (1934)</li>
                    <li>Focus on quality over quantity</li>
                </ul>
                <p><strong>Mid Game (1937-1944):</strong></p>
                <ul>
                    <li>Balance artistic and commercial films</li>
                    <li>Navigate WWII carefully (1941-1945)</li>
                    <li>Build reputation for late-game challenges</li>
                </ul>
                <p><strong>Late Game (1945-1949):</strong></p>
                <ul>
                    <li>HUAC hearings require moral choices</li>
                    <li>High reputation helps with crises</li>
                    <li>Sprint to your chosen victory condition</li>
                </ul>
            `,
            highlight: null,
            position: 'center',
            actions: ['Next', 'Skip Tutorial']
        },

        {
            id: 'tutorial_complete',
            title: 'You\'re Ready!',
            content: `
                <h2>Tutorial Complete!</h2>
                <p>You now know the basics of running a Hollywood studio.</p>
                <p><strong>Remember:</strong></p>
                <ul>
                    <li>✅ Watch your cash and runway</li>
                    <li>✅ Start with low-budget films</li>
                    <li>✅ Quality matters more than quantity</li>
                    <li>✅ Historical events will challenge you</li>
                    <li>✅ Save often!</li>
                </ul>
                <p><em>Good luck, and may your studio produce legendary films!</em></p>
                <p class="tutorial-tip">🎬 <strong>Tip:</strong> You can replay this tutorial anytime from the settings menu.</p>
            `,
            highlight: null,
            position: 'center',
            actions: ['Start Playing!']
        }
    ];

    /**
     * Initialize tutorial system
     */
    function init() {
        console.log('Tutorial system initialized');
    }

    /**
     * Start the tutorial
     */
    function startTutorial() {
        tutorialActive = true;
        currentStep = 0;

        // Create overlay
        createTutorialOverlay();

        // Show first step
        showStep(0);

        console.log('Tutorial started');
    }

    /**
     * Create tutorial overlay element
     */
    function createTutorialOverlay() {
        // Remove existing overlay if present
        if (tutorialOverlay) {
            tutorialOverlay.remove();
        }

        tutorialOverlay = document.createElement('div');
        tutorialOverlay.id = 'tutorial-overlay';
        tutorialOverlay.className = 'tutorial-overlay';

        document.body.appendChild(tutorialOverlay);
    }

    /**
     * Show specific tutorial step
     */
    function showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= TUTORIAL_STEPS.length) {
            endTutorial();
            return;
        }

        currentStep = stepIndex;
        const step = TUTORIAL_STEPS[stepIndex];

        // Clear previous highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });

        // Highlight element if specified
        if (step.highlight) {
            const element = document.querySelector(step.highlight);
            if (element) {
                element.classList.add('tutorial-highlight');
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        // Show tutorial box
        showTutorialBox(step);
    }

    /**
     * Show tutorial box with content
     */
    function showTutorialBox(step) {
        const position = step.position || 'center';
        const actionsHTML = step.actions.map((action, index) => {
            if (action === 'Skip Tutorial') {
                return `<button onclick="TutorialSystem.skipTutorial()" class="tutorial-btn secondary">${action}</button>`;
            } else if (action === 'Next') {
                return `<button onclick="TutorialSystem.nextStep()" class="tutorial-btn primary">${action}</button>`;
            } else if (action === 'Start Playing!') {
                return `<button onclick="TutorialSystem.endTutorial()" class="tutorial-btn primary">${action}</button>`;
            }
            return `<button onclick="TutorialSystem.nextStep()" class="tutorial-btn primary">${action}</button>`;
        }).join('');

        const progressHTML = `
            <div class="tutorial-progress">
                Step ${currentStep + 1} of ${TUTORIAL_STEPS.length}
            </div>
        `;

        tutorialOverlay.innerHTML = `
            <div class="tutorial-box ${position}">
                ${progressHTML}
                <div class="tutorial-content">
                    ${step.content}
                </div>
                <div class="tutorial-actions">
                    ${actionsHTML}
                </div>
            </div>
        `;

        tutorialOverlay.style.display = 'flex';
    }

    /**
     * Go to next step
     */
    function nextStep() {
        showStep(currentStep + 1);
    }

    /**
     * Go to previous step
     */
    function previousStep() {
        if (currentStep > 0) {
            showStep(currentStep - 1);
        }
    }

    /**
     * Skip tutorial
     */
    function skipTutorial() {
        if (confirm('Are you sure you want to skip the tutorial? You can restart it later from the settings menu.')) {
            endTutorial();
        }
    }

    /**
     * End tutorial
     */
    function endTutorial() {
        tutorialActive = false;

        // Remove overlay
        if (tutorialOverlay) {
            tutorialOverlay.remove();
            tutorialOverlay = null;
        }

        // Clear highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });

        // Mark tutorial as completed in game state
        const gameState = window.HollywoodMogul.getGameState();
        gameState.tutorialCompleted = true;

        console.log('Tutorial ended');
    }

    /**
     * Check if tutorial should auto-start
     */
    function checkAutoStart(gameState) {
        // Auto-start on first game
        if (!gameState.tutorialCompleted && gameState.gameWeek === 1) {
            // Delay slightly to let game initialize
            setTimeout(startTutorial, 1000);
        }
    }

    /**
     * Get tutorial status
     */
    function isActive() {
        return tutorialActive;
    }

    // Public API
    return {
        init,
        startTutorial,
        endTutorial,
        skipTutorial,
        nextStep,
        previousStep,
        checkAutoStart,
        isActive,
        showStep
    };
})();
