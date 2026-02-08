/**
 * HOLLYWOOD MOGUL - ENHANCED INTERACTIVE TUTORIAL SYSTEM
 * Comprehensive tutorial with guided missions, interactive steps, and spotlight features
 * Teaches game mechanics, UI navigation, and key concepts
 */
window.TutorialSystem = (function() {
    'use strict';

    // Tutorial state
    let currentStep = 0;
    let tutorialActive = false;
    let tutorialOverlay = null;
    let spotlightOverlay = null;
    let tooltipElement = null;
    let waitingForAction = false;
    let actionCompleted = false;
    let tutorialMissions = {};

    /**
     * Tutorial Missions - Optional guided objectives
     */
    const TUTORIAL_MISSIONS = {
        firstFeature: {
            id: 'first_feature',
            title: 'First Feature',
            description: 'Produce and release your first film',
            icon: '🎬',
            requirement: 'complete_first_film',
            reward: 'Unlock: Production insights',
            completed: false
        },
        inTheBlack: {
            id: 'in_the_black',
            title: 'In the Black',
            description: 'End a month with positive cash flow',
            icon: '💰',
            requirement: 'positive_cash_flow',
            reward: 'Unlock: Financial strategies',
            completed: false
        },
        criticalAcclaim: {
            id: 'critical_acclaim',
            title: 'Critical Acclaim',
            description: 'Release a film with quality 75+',
            icon: '⭐',
            requirement: 'high_quality_film',
            reward: 'Unlock: Quality filmmaking tips',
            completed: false
        },
        boxOfficeHit: {
            id: 'box_office_hit',
            title: 'Box Office Hit',
            description: 'Gross $100,000+ on a single film',
            icon: '📊',
            requirement: 'gross_100k',
            reward: 'Unlock: Marketing insights',
            completed: false
        },
        studioGrowth: {
            id: 'studio_growth',
            title: 'Studio Growth',
            description: 'Purchase your first facility upgrade',
            icon: '🏗️',
            requirement: 'purchase_facility',
            reward: 'Unlock: Studio expansion guide',
            completed: false
        },
        starPower: {
            id: 'star_power',
            title: 'Star Power',
            description: 'Sign a major talent to a contract',
            icon: '🌟',
            requirement: 'sign_talent',
            reward: 'Unlock: Talent management guide',
            completed: false
        }
    };

    /**
     * Tutorial steps - comprehensive 12-step guided tour
     */
    const TUTORIAL_STEPS = [
        // Step 1: Welcome
        {
            id: 'welcome',
            title: 'Welcome to Hollywood',
            content: `
                <h2>Welcome to MOGUL!</h2>
                <p>You're the head of a Hollywood studio in 1933, at the dawn of cinema's Golden Age.</p>
                <p><strong>Your goal:</strong> Survive through Hollywood history (1933-2010), producing legendary films and building your studio empire.</p>
                <p>This interactive tutorial will guide you through the essentials. Click <strong>Next</strong> to continue, or <strong>Skip Tutorial</strong> to start playing immediately.</p>
                <div class="tutorial-tip">💡 You can replay this tutorial anytime from the Help menu (? button).</div>
            `,
            highlight: null,
            position: 'center',
            spotlightMode: false,
            requiresAction: false,
            actionType: null,
            actions: ['Next', 'Skip Tutorial']
        },

        // Step 2: Your First Script
        {
            id: 'first_script',
            title: 'Your First Script',
            content: `
                <h3>Finding Your First Film</h3>
                <p>Every great studio starts with a great story. Let's find your first script to produce.</p>
                <p><strong>Click the "SCRIPTS" button</strong> in the navigation bar to browse available screenplays.</p>
                <div class="tutorial-action-required">
                    <span class="action-icon">👉</span>
                    <span class="action-text">Action Required: Navigate to Scripts section</span>
                </div>
            `,
            highlight: '[data-section="scripts"]',
            position: 'below',
            spotlightMode: true,
            requiresAction: true,
            actionType: 'navigate_scripts',
            actions: []
        },

        // Step 3: Understanding Genres
        {
            id: 'genres',
            title: 'Understanding Scripts',
            content: `
                <h3>Choosing the Right Script</h3>
                <p>Each script shows important information:</p>
                <ul>
                    <li><strong>Budget:</strong> Production cost (affects quality potential)</li>
                    <li><strong>Genre:</strong> Drama, Comedy, Western, Noir, etc.</li>
                    <li><strong>Quality:</strong> The script's inherent quality (0-100)</li>
                    <li><strong>Censor Risk:</strong> How likely it is to face censorship</li>
                </ul>
                <div class="tutorial-tip">💡 <strong>Smart Start:</strong> Pick a mid-budget film ($50,000-$75,000) to minimize risk while learning.</div>
            `,
            highlight: '#available-scripts',
            position: 'above',
            spotlightMode: true,
            requiresAction: false,
            actions: ['Next']
        },

        // Step 4: Greenlight a Picture
        {
            id: 'greenlight',
            title: 'Greenlight a Picture',
            content: `
                <h3>Start Production</h3>
                <p>Ready to make your first film? <strong>Click the "GREENLIGHT" button</strong> on any script you like.</p>
                <p>When you greenlight:</p>
                <ul>
                    <li>Budget is deducted from your cash</li>
                    <li>Film enters production (12-16 weeks)</li>
                    <li>Production events may occur</li>
                </ul>
                <div class="tutorial-action-required">
                    <span class="action-icon">👉</span>
                    <span class="action-text">Action Required: Greenlight a script</span>
                </div>
            `,
            highlight: '.greenlight-btn',
            position: 'above',
            spotlightMode: true,
            requiresAction: true,
            actionType: 'greenlight_film',
            actions: []
        },

        // Step 5: Production Phases
        {
            id: 'production_phases',
            title: 'Production Phases',
            content: `
                <h3>The 5 Phases of Production</h3>
                <p>Your film will progress through these stages:</p>
                <ol>
                    <li><strong>Pre-Production:</strong> Planning and preparation</li>
                    <li><strong>Principal Photography:</strong> Actual filming (shooting days)</li>
                    <li><strong>Post-Production:</strong> Editing and sound</li>
                    <li><strong>Ready for Release:</strong> Film complete, awaiting distribution</li>
                    <li><strong>In Theaters:</strong> Box office run (8-12 weeks)</li>
                </ol>
                <p>You can track progress in the Dashboard section.</p>
            `,
            highlight: '#films-in-production',
            position: 'below',
            spotlightMode: true,
            requiresAction: false,
            actions: ['Next']
        },

        // Step 6: Making Decisions (Production Events)
        {
            id: 'decisions',
            title: 'Making Decisions',
            content: `
                <h3>Production Events</h3>
                <p>During filming, you'll face random events and decisions:</p>
                <ul>
                    <li>🎭 <strong>Creative choices:</strong> Casting, script changes, reshoots</li>
                    <li>💰 <strong>Budget decisions:</strong> Go over budget for better quality?</li>
                    <li>⚠️ <strong>Crises:</strong> Accidents, scandals, weather delays</li>
                    <li>✨ <strong>Opportunities:</strong> Unexpected good fortune</li>
                </ul>
                <div class="tutorial-tip">💡 Your decisions affect film quality, budget, and reputation!</div>
            `,
            highlight: null,
            position: 'center',
            spotlightMode: false,
            requiresAction: false,
            actions: ['Next']
        },

        // Step 7: Distribution Strategy
        {
            id: 'distribution',
            title: 'Distribution',
            content: `
                <h3>Releasing Your Film</h3>
                <p>When production completes, choose a distribution strategy:</p>
                <ul>
                    <li><strong>Wide Release:</strong> 500+ theaters, high marketing costs, maximum potential</li>
                    <li><strong>Limited Release:</strong> 100-300 theaters, modest costs, build word-of-mouth</li>
                    <li><strong>States Rights:</strong> Sell distribution rights for guaranteed payment (low risk)</li>
                </ul>
                <p>Match your strategy to the film's quality and your cash situation.</p>
            `,
            highlight: null,
            position: 'center',
            spotlightMode: false,
            requiresAction: false,
            actions: ['Next']
        },

        // Step 8: Box Office Performance
        {
            id: 'box_office',
            title: 'Box Office',
            content: `
                <h3>Making Money</h3>
                <p>Box office revenue depends on several factors:</p>
                <ul>
                    <li>📊 <strong>Film Quality:</strong> Higher quality = more revenue</li>
                    <li>🎭 <strong>Genre Appeal:</strong> Some genres are more popular</li>
                    <li>📣 <strong>Distribution:</strong> Wide release reaches bigger audience</li>
                    <li>🗣️ <strong>Word of Mouth:</strong> Good films hold better week-to-week</li>
                    <li>🌟 <strong>Star Power:</strong> Big names attract audiences</li>
                </ul>
                <div class="tutorial-tip">💡 A quality 75+ film can earn 3-5x its budget!</div>
            `,
            highlight: '#films-in-theaters',
            position: 'above',
            spotlightMode: true,
            requiresAction: false,
            actions: ['Next']
        },

        // Step 9: Financial Health
        {
            id: 'financial_health',
            title: 'Financial Health',
            content: `
                <h3>Understanding Your Finances</h3>
                <p>Watch these three critical numbers:</p>
                <ul>
                    <li><strong>CASH ON HAND:</strong> Your current available funds</li>
                    <li><strong>MONTHLY BURN:</strong> Fixed costs ($30,000/month to start)</li>
                    <li><strong>RUNWAY:</strong> How many weeks until bankruptcy</li>
                </ul>
                <div class="tutorial-warning">⚠️ <strong>CRITICAL:</strong> If runway drops below 4 weeks, take emergency action!</div>
                <p>You can take loans from the <strong>FINANCES</strong> section if needed.</p>
            `,
            highlight: '#financial-dashboard',
            position: 'below',
            spotlightMode: true,
            requiresAction: false,
            actions: ['Next']
        },

        // Step 10: Building Your Studio
        {
            id: 'studio_tour',
            title: 'Building Your Studio',
            content: `
                <h3>Studio Facilities</h3>
                <p>As you grow, invest in studio infrastructure:</p>
                <ul>
                    <li>🎬 <strong>Sound Stages:</strong> Produce multiple films simultaneously</li>
                    <li>🎭 <strong>Back Lot:</strong> Reduce production costs</li>
                    <li>🎞️ <strong>Post-Production:</strong> Improve film quality</li>
                    <li>🌟 <strong>Talent Bungalows:</strong> Attract better stars</li>
                </ul>
                <p>Facilities increase your monthly burn but provide long-term advantages.</p>
            `,
            highlight: '[data-section="studio"]',
            position: 'below',
            spotlightMode: true,
            requiresAction: false,
            actions: ['Next']
        },

        // Step 11: Signing Talent
        {
            id: 'talent',
            title: 'Signing Talent',
            content: `
                <h3>The Contract System</h3>
                <p>Build a stable of stars and directors:</p>
                <ul>
                    <li>⭐ <strong>Freelance:</strong> Hire per-film, no commitment</li>
                    <li>📜 <strong>Long-term Contract:</strong> Lock in talent, add to monthly burn</li>
                    <li>🌟 <strong>Star System:</strong> Develop unknown talent into stars</li>
                </ul>
                <p><strong>Star Power</strong> boosts box office appeal significantly!</p>
                <div class="tutorial-tip">💡 Major stars can increase opening weekend by 50%+!</div>
            `,
            highlight: '[data-section="talent"]',
            position: 'below',
            spotlightMode: true,
            requiresAction: false,
            actions: ['Next']
        },

        // Step 12: Historical Events
        {
            id: 'historical',
            title: 'Historical Events',
            content: `
                <h3>Living Through History</h3>
                <p>The game spans 1933-2010, covering 12 historical eras. Major events will impact your studio:</p>
                <ul>
                    <li>📜 <strong>1934:</strong> Hays Code enforcement (strict censorship)</li>
                    <li>🎖️ <strong>1941-1945:</strong> World War II (rationing, propaganda films)</li>
                    <li>📺 <strong>1950s:</strong> Television threatens Hollywood attendance</li>
                    <li>🎬 <strong>1968:</strong> MPAA ratings replace the Hays Code</li>
                    <li>🦈 <strong>1975-1977:</strong> Jaws and Star Wars invent the blockbuster</li>
                    <li>📼 <strong>1980s:</strong> Home video revolutionizes revenue</li>
                    <li>💻 <strong>2000s:</strong> Digital filmmaking and streaming arrive</li>
                </ul>
                <p>Navigate these challenges with wisdom and integrity.</p>
            `,
            highlight: null,
            position: 'center',
            spotlightMode: false,
            requiresAction: false,
            actions: ['Next']
        },

        // Step 13: You're Ready!
        {
            id: 'ready',
            title: "You're Ready!",
            content: `
                <h2>Tutorial Complete!</h2>
                <p>You now have the knowledge to run a Hollywood studio. Remember:</p>
                <ul>
                    <li>✅ Watch your cash runway constantly</li>
                    <li>✅ Start with modest-budget films</li>
                    <li>✅ Quality matters more than quantity</li>
                    <li>✅ Historical events require tough choices</li>
                    <li>✅ Save often (auto-save happens each week)</li>
                </ul>
                <p><em>Good luck, and may your studio create legendary films!</em></p>
                <div class="tutorial-tip">💡 Press the <strong>?</strong> button anytime for the Help & Codex system!</div>
            `,
            highlight: null,
            position: 'center',
            spotlightMode: false,
            requiresAction: false,
            actions: ['Start Playing!']
        }
    ];

    /**
     * Initialize tutorial system
     */
    function init() {
        loadTutorialState();
        initializeMissions();
    }

    /**
     * Initialize missions from saved state or defaults
     */
    function initializeMissions() {
        const gameState = window.HollywoodMogul?.getGameState();
        if (gameState && gameState.tutorialMissions) {
            tutorialMissions = gameState.tutorialMissions;
        } else {
            tutorialMissions = JSON.parse(JSON.stringify(TUTORIAL_MISSIONS));
        }
    }

    /**
     * Load tutorial state from game save
     */
    function loadTutorialState() {
        const gameState = window.HollywoodMogul?.getGameState();
        if (gameState && gameState.tutorialState) {
            currentStep = gameState.tutorialState.currentStep || 0;
        }
    }

    /**
     * Save tutorial state to game
     */
    function saveTutorialState() {
        const gameState = window.HollywoodMogul?.getGameState();
        if (gameState) {
            gameState.tutorialState = {
                currentStep: currentStep,
                completed: gameState.tutorialCompleted || false
            };
            gameState.tutorialMissions = tutorialMissions;
        }
    }

    /**
     * Start the tutorial
     */
    function startTutorial() {
        tutorialActive = true;
        currentStep = 0;
        createTutorialOverlay();
        createSpotlightOverlay();
        showStep(0);
    }

    /**
     * Create main tutorial overlay
     */
    function createTutorialOverlay() {
        if (tutorialOverlay) {
            tutorialOverlay.remove();
        }

        tutorialOverlay = document.createElement('div');
        tutorialOverlay.id = 'tutorial-overlay';
        tutorialOverlay.className = 'tutorial-overlay';
        document.body.appendChild(tutorialOverlay);
    }

    /**
     * Create spotlight overlay (dims everything except highlighted element)
     */
    function createSpotlightOverlay() {
        if (spotlightOverlay) {
            spotlightOverlay.remove();
        }

        spotlightOverlay = document.createElement('div');
        spotlightOverlay.id = 'tutorial-spotlight';
        spotlightOverlay.className = 'tutorial-spotlight-overlay';
        document.body.appendChild(spotlightOverlay);
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

        // Clear previous state
        clearHighlights();
        hideSpotlight();
        removeTooltip();

        // Reset action state
        waitingForAction = step.requiresAction || false;
        actionCompleted = false;

        // Apply spotlight if needed
        if (step.spotlightMode && step.highlight) {
            showSpotlight(step.highlight);
        }

        // Highlight element if specified
        if (step.highlight) {
            const element = document.querySelector(step.highlight);
            if (element) {
                element.classList.add('tutorial-highlight');
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Show tooltip instead of modal for interactive steps
                if (step.requiresAction) {
                    showTooltip(element, step);
                    return; // Don't show modal for action-required steps
                }
            }
        }

        // Show tutorial modal
        showTutorialModal(step);
        saveTutorialState();
    }

    /**
     * Show tutorial modal box
     */
    function showTutorialModal(step) {
        const position = step.position || 'center';
        const actionsHTML = generateActionButtons(step.actions);
        const progressHTML = `
            <div class="tutorial-progress">
                <div class="tutorial-progress-text">Step ${currentStep + 1} of ${TUTORIAL_STEPS.length}</div>
                <div class="tutorial-progress-bar">
                    <div class="tutorial-progress-fill" style="width: ${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%"></div>
                </div>
            </div>
        `;

        tutorialOverlay.innerHTML = `
            <div class="tutorial-box ${position}">
                <button class="tutorial-close" onclick="TutorialSystem.skipTutorial()">×</button>
                ${progressHTML}
                <div class="tutorial-content">
                    <h2 class="tutorial-title">${step.title}</h2>
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
     * Show tooltip for interactive steps
     */
    function showTooltip(element, step) {
        removeTooltip();

        tooltipElement = document.createElement('div');
        tooltipElement.className = 'tutorial-tooltip';

        const rect = element.getBoundingClientRect();
        const position = step.position || 'below';

        tooltipElement.innerHTML = `
            <div class="tutorial-tooltip-arrow ${position}"></div>
            <div class="tutorial-tooltip-content">
                <h3>${step.title}</h3>
                ${step.content}
            </div>
            <div class="tutorial-tooltip-progress">Step ${currentStep + 1} of ${TUTORIAL_STEPS.length}</div>
        `;

        document.body.appendChild(tooltipElement);
        positionTooltip(tooltipElement, rect, position);
    }

    /**
     * Position tooltip relative to highlighted element
     */
    function positionTooltip(tooltip, elementRect, position) {
        const tooltipRect = tooltip.getBoundingClientRect();
        const padding = 20;

        let top, left;

        switch(position) {
            case 'above':
                top = elementRect.top - tooltipRect.height - padding;
                left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'below':
                top = elementRect.bottom + padding;
                left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'left':
                top = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
                left = elementRect.left - tooltipRect.width - padding;
                break;
            case 'right':
                top = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
                left = elementRect.right + padding;
                break;
            default:
                top = elementRect.bottom + padding;
                left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
        }

        // Keep tooltip on screen
        top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10));
        left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    }

    /**
     * Remove tooltip
     */
    function removeTooltip() {
        if (tooltipElement) {
            tooltipElement.remove();
            tooltipElement = null;
        }
    }

    /**
     * Show spotlight on element (dim everything else)
     */
    function showSpotlight(selector) {
        const element = document.querySelector(selector);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const padding = 10;

        spotlightOverlay.style.display = 'block';
        spotlightOverlay.style.clipPath = `polygon(
            0% 0%,
            0% 100%,
            ${rect.left - padding}px 100%,
            ${rect.left - padding}px ${rect.top - padding}px,
            ${rect.right + padding}px ${rect.top - padding}px,
            ${rect.right + padding}px ${rect.bottom + padding}px,
            ${rect.left - padding}px ${rect.bottom + padding}px,
            ${rect.left - padding}px 100%,
            100% 100%,
            100% 0%
        )`;

        // Make highlighted element appear above spotlight
        element.style.position = 'relative';
        element.style.zIndex = '10001';
    }

    /**
     * Hide spotlight overlay
     */
    function hideSpotlight() {
        if (spotlightOverlay) {
            spotlightOverlay.style.display = 'none';
        }
    }

    /**
     * Generate action buttons HTML
     */
    function generateActionButtons(actions) {
        if (!actions || actions.length === 0) return '';

        return actions.map(action => {
            if (action === 'Skip Tutorial') {
                return `<button onclick="TutorialSystem.skipTutorial()" class="tutorial-btn secondary">Skip Tutorial</button>`;
            } else if (action === 'Next') {
                return `<button onclick="TutorialSystem.nextStep()" class="tutorial-btn primary">Next</button>`;
            } else if (action === 'Start Playing!') {
                return `<button onclick="TutorialSystem.endTutorial()" class="tutorial-btn primary">Start Playing!</button>`;
            }
            return `<button onclick="TutorialSystem.nextStep()" class="tutorial-btn primary">${action}</button>`;
        }).join('');
    }

    /**
     * Handle action completion
     */
    function completeAction(actionType) {
        const step = TUTORIAL_STEPS[currentStep];

        if (waitingForAction && step.actionType === actionType) {
            actionCompleted = true;
            waitingForAction = false;

            // Auto-advance to next step after action
            setTimeout(() => {
                nextStep();
            }, 500);
        }
    }

    /**
     * Go to next step
     */
    function nextStep() {
        const step = TUTORIAL_STEPS[currentStep];

        // Don't advance if waiting for required action
        if (step.requiresAction && !actionCompleted) {
            return;
        }

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
     * Skip tutorial with confirmation
     */
    function skipTutorial() {
        if (confirm('Are you sure you want to skip the tutorial? You can replay it anytime from the Help menu (? button).')) {
            endTutorial();
        }
    }

    /**
     * End tutorial
     */
    function endTutorial() {
        tutorialActive = false;

        // Remove overlays
        if (tutorialOverlay) {
            tutorialOverlay.remove();
            tutorialOverlay = null;
        }
        if (spotlightOverlay) {
            spotlightOverlay.remove();
            spotlightOverlay = null;
        }
        removeTooltip();
        clearHighlights();

        // Mark tutorial as completed
        const gameState = window.HollywoodMogul?.getGameState();
        if (gameState) {
            gameState.tutorialCompleted = true;
            saveTutorialState();
        }

        // Show tutorial missions panel
        showTutorialMissions();

    }

    /**
     * Clear all highlights
     */
    function clearHighlights() {
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
            el.style.position = '';
            el.style.zIndex = '';
        });
    }

    /**
     * Check if tutorial should auto-start
     */
    function checkAutoStart(gameState) {
        if (!gameState.tutorialCompleted && gameState.gameWeek === 1) {
            setTimeout(startTutorial, 1000);
        } else if (gameState.tutorialCompleted && !gameState.missionsShown) {
            showTutorialMissions();
            gameState.missionsShown = true;
        }
    }

    /**
     * Show tutorial missions panel
     */
    function showTutorialMissions() {
        if (!document.getElementById('tutorial-missions-panel')) {
            createMissionsPanel();
        }
        updateMissionsDisplay();
    }

    /**
     * Create tutorial missions panel
     */
    function createMissionsPanel() {
        const panel = document.createElement('div');
        panel.id = 'tutorial-missions-panel';
        panel.className = 'tutorial-missions-panel collapsed';
        panel.innerHTML = `
            <div class="missions-header" onclick="TutorialSystem.toggleMissionsPanel()">
                <span class="missions-icon">🎯</span>
                <span class="missions-title">Tutorial Missions</span>
                <span class="missions-toggle">▼</span>
            </div>
            <div class="missions-content">
                <div id="missions-list"></div>
            </div>
        `;
        document.body.appendChild(panel);
    }

    /**
     * Toggle missions panel
     */
    function toggleMissionsPanel() {
        const panel = document.getElementById('tutorial-missions-panel');
        if (panel) {
            panel.classList.toggle('collapsed');
        }
    }

    /**
     * Update missions display
     */
    function updateMissionsDisplay() {
        const container = document.getElementById('missions-list');
        if (!container) return;

        const missionsHTML = Object.values(tutorialMissions).map(mission => {
            const completedClass = mission.completed ? 'completed' : '';
            const completedIcon = mission.completed ? '✓' : '';

            return `
                <div class="mission-card ${completedClass}">
                    <div class="mission-header">
                        <span class="mission-icon">${mission.icon}</span>
                        <span class="mission-title">${mission.title}</span>
                        ${completedIcon ? `<span class="mission-completed-icon">${completedIcon}</span>` : ''}
                    </div>
                    <div class="mission-description">${mission.description}</div>
                    <div class="mission-reward">${mission.reward}</div>
                </div>
            `;
        }).join('');

        container.innerHTML = missionsHTML;
    }

    /**
     * Check and update mission progress
     */
    function checkMissionProgress(gameState) {
        let anyCompleted = false;

        // Check each mission
        if (!tutorialMissions.firstFeature.completed) {
            const completedFilms = (gameState.completedFilms || []).length;
            if (completedFilms > 0) {
                tutorialMissions.firstFeature.completed = true;
                anyCompleted = true;
                showMissionComplete('firstFeature');
            }
        }

        if (!tutorialMissions.inTheBlack.completed) {
            // Check if monthly cash flow is positive
            if (gameState.lastMonthRevenue && gameState.lastMonthRevenue > gameState.monthlyBurn) {
                tutorialMissions.inTheBlack.completed = true;
                anyCompleted = true;
                showMissionComplete('inTheBlack');
            }
        }

        if (!tutorialMissions.criticalAcclaim.completed) {
            const highQualityFilm = (gameState.completedFilms || []).find(f => f.scriptQuality >= 75);
            if (highQualityFilm) {
                tutorialMissions.criticalAcclaim.completed = true;
                anyCompleted = true;
                showMissionComplete('criticalAcclaim');
            }
        }

        if (!tutorialMissions.boxOfficeHit.completed) {
            const bigHit = (gameState.completedFilms || []).find(f => {
                const gross = f.totalBoxOffice || 0;
                return gross >= 100000;
            });
            if (bigHit) {
                tutorialMissions.boxOfficeHit.completed = true;
                anyCompleted = true;
                showMissionComplete('boxOfficeHit');
            }
        }

        if (!tutorialMissions.studioGrowth.completed && gameState.facilities) {
            const hasFacility = Object.values(gameState.facilities).some(f => f.owned);
            if (hasFacility) {
                tutorialMissions.studioGrowth.completed = true;
                anyCompleted = true;
                showMissionComplete('studioGrowth');
            }
        }

        if (!tutorialMissions.starPower.completed && gameState.contractTalent) {
            if (gameState.contractTalent.length > 0) {
                tutorialMissions.starPower.completed = true;
                anyCompleted = true;
                showMissionComplete('starPower');
            }
        }

        if (anyCompleted) {
            updateMissionsDisplay();
            saveTutorialState();
        }
    }

    /**
     * Show mission completion notification
     */
    function showMissionComplete(missionKey) {
        const mission = tutorialMissions[missionKey];
        if (!mission) return;

        const notification = document.createElement('div');
        notification.className = 'mission-complete-notification';
        notification.innerHTML = `
            <div class="mission-complete-content">
                <div class="mission-complete-icon">${mission.icon}</div>
                <div class="mission-complete-text">
                    <h3>Mission Complete!</h3>
                    <p>${mission.title}</p>
                    <p class="mission-complete-reward">${mission.reward}</p>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 4000);

        // Play sound if available
        if (window.AudioSystem) {
            window.AudioSystem.playSound('achievement');
        }
    }

    /**
     * Get tutorial status
     */
    function isActive() {
        return tutorialActive;
    }

    /**
     * Get missions status
     */
    function getMissions() {
        return tutorialMissions;
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
        showStep,
        completeAction,
        toggleMissionsPanel,
        showTutorialMissions,
        checkMissionProgress,
        getMissions
    };
})();
