/**
 * HOLLYWOOD MOGUL - STARTING SCENARIOS SYSTEM
 * Provides multiple starting scenarios for enhanced replayability
 */

window.ScenarioSystem = (function() {
    'use strict';

    // All available scenarios
    const SCENARIOS = {
        classic_start: {
            id: 'classic_start',
            name: 'Classic Start',
            difficulty: 'normal',
            shortDescription: 'Build your studio from scratch during the Golden Age',
            longDescription: 'Start with a clean slate in 1933 at the dawn of Hollywood\'s Golden Age. You have adequate capital and a modest reputation. The future is yours to shape - will you focus on prestige pictures, commercial hits, or build a balanced empire?',
            flavorText: 'January 1933. The Depression grips America, but Hollywood dreams eternal. Your studio awaits...',

            startYear: 1933,
            startMonth: 0, // January (0-indexed)

            initialState: {
                cash: 410000,
                reputation: 50,
                debt: 0,
                soundStages: 1,
                backlots: {
                    western: false,
                    nyc: false,
                    jungle: false
                },
                contractPlayers: [],
                restrictions: [],
                bonuses: []
            },

            victoryConditions: {
                description: 'Build a successful studio across Hollywood history (1933-2010)',
                cash: 250000,
                reputation: 40,
                films: 5
            },

            specialRules: [],

            startingScripts: [], // Uses default script generation

            tips: [
                'Balance prestige and profit to build lasting success',
                'Invest in sound stages early to increase production capacity',
                'Watch your monthly burn rate carefully'
            ]
        },

        poverty_row: {
            id: 'poverty_row',
            name: 'Poverty Row',
            difficulty: 'hard',
            shortDescription: 'Start as a struggling B-movie studio and work your way up',
            longDescription: 'You run a small Poverty Row studio cranking out quickie westerns, horror films, and serials. The major studios dismiss you as a joke, but you have ambition. Produce cheap films fast, build your reputation, and prove you can compete with the big boys.',
            flavorText: 'The majors laugh at your shoestring operation. Show them what grit and determination can achieve...',

            startYear: 1935,
            startMonth: 0,

            initialState: {
                cash: 150000,
                reputation: 25,
                debt: 0,
                soundStages: 1,
                backlots: {
                    western: true, // Start with western backlot for cheap westerns
                    nyc: false,
                    jungle: false
                },
                contractPlayers: [],
                restrictions: ['b_movies_only'],
                bonuses: ['fast_production', 'b_movie_revenue_bonus']
            },

            victoryConditions: {
                description: 'Reach $500,000 cash, 50 reputation, and produce 15 films to prove yourself',
                cash: 500000,
                reputation: 50,
                films: 15
            },

            specialRules: [
                'Cannot greenlight films over $75,000 until reputation reaches 40',
                'Production time reduced by 20%',
                'B-movie revenue bonus: +15%',
                'Maximum budget increases as reputation grows'
            ],

            startingScripts: ['b_movie_western', 'b_movie_horror', 'b_movie_adventure', 'b_movie_mystery'],

            tips: [
                'Churn out cheap films quickly to build cash reserves',
                'Every successful film improves your reputation',
                'Once you hit 40 reputation, you can make bigger films'
            ]
        },

        the_inheritance: {
            id: 'the_inheritance',
            name: 'The Inheritance',
            difficulty: 'hard',
            shortDescription: 'You\'ve inherited a famous studio drowning in debt',
            longDescription: 'Your uncle left you a prestigious studio with a sterling reputation - and massive debts. The bank is breathing down your neck, demanding $500,000. You must balance making prestige films to maintain your reputation while generating enough revenue to pay off the debt before time runs out.',
            flavorText: 'Your uncle built a legend. Now the creditors are at the door. Can you save his legacy?',

            startYear: 1938,
            startMonth: 0,

            initialState: {
                cash: 800000,
                reputation: 70,
                debt: 500000, // Must pay this off!
                soundStages: 2,
                backlots: {
                    western: true,
                    nyc: true,
                    jungle: false
                },
                contractPlayers: [], // Could add 1-2 legacy contract players
                restrictions: ['prestige_pressure'],
                bonuses: ['high_reputation_boost']
            },

            victoryConditions: {
                description: 'Pay off the $500,000 debt while maintaining reputation above 60',
                cash: 0, // Just survive
                reputation: 60,
                debtFree: true
            },

            specialRules: [
                'Debt payment of $50,000 due every 6 months',
                'If reputation drops below 50, lose prestige bonus',
                'High-quality films essential to maintain reputation',
                'Bank will foreclose if debt grows above $700,000'
            ],

            startingScripts: ['prestige_drama', 'romantic_epic', 'historical_drama'],

            tips: [
                'Make at least one commercial hit between prestige films',
                'Don\'t let reputation drop - it\'s your greatest asset',
                'Plan debt payments carefully around film releases'
            ]
        },

        war_effort: {
            id: 'war_effort',
            name: 'War Effort',
            difficulty: 'normal',
            shortDescription: 'Navigate Hollywood during World War II',
            longDescription: 'December 1942. America is at war. The government needs propaganda films and morale boosters. Many of your potential stars are serving overseas. Material shortages affect production. But patriotic films are in demand, and the government pays well for training and propaganda pictures.',
            flavorText: 'The world is at war. Hollywood must do its part. Lights, camera, victory!',

            startYear: 1942,
            startMonth: 11, // December

            initialState: {
                cash: 350000,
                reputation: 45,
                debt: 0,
                soundStages: 1,
                backlots: {
                    western: false,
                    nyc: true,
                    jungle: false
                },
                contractPlayers: [],
                restrictions: ['wartime_limitations'],
                bonuses: ['government_contracts', 'patriotic_boost']
            },

            victoryConditions: {
                description: 'Survive WWII, transition to peacetime, and produce 10+ films with 3 patriotic',
                cash: 300000,
                reputation: 50,
                films: 10,
                patrioticFilms: 3
            },

            specialRules: [
                'Government contracts available for war-themed films',
                'Reduced availability of male actors (draft)',
                'Patriotic films receive +25% box office bonus',
                'Material shortages: +10% production costs 1942-1945',
                'Censorship: all films must support war effort',
                'Post-1945: transition bonus for peacetime films'
            ],

            startingScripts: ['war_drama', 'home_front_story', 'combat_film', 'musical_morale'],

            tips: [
                'Government contracts provide steady income',
                'Use more female leads during wartime',
                'Plan for the peacetime transition in 1945-1946'
            ]
        },

        the_blacklist: {
            id: 'the_blacklist',
            name: 'The Blacklist',
            difficulty: 'very_hard',
            shortDescription: 'Survive the Red Scare without losing your soul',
            longDescription: 'October 1947. The House Un-American Activities Committee is investigating Hollywood. Several of your best talents are under suspicion. You must make impossible choices: cooperate with HUAC and betray friends, resist and face industry blackballing, or try to navigate the middle ground. Your choices will define your legacy.',
            flavorText: 'The Hollywood Ten face prison. The blacklist grows daily. Where do you stand?',

            startYear: 1947,
            startMonth: 9, // October

            initialState: {
                cash: 500000,
                reputation: 60,
                debt: 0,
                soundStages: 2,
                backlots: {
                    western: true,
                    nyc: false,
                    jungle: false
                },
                contractPlayers: [], // Some will be "suspect"
                restrictions: ['blacklist_era'],
                bonuses: []
            },

            victoryConditions: {
                description: 'Navigate the Red Scare while maintaining moral integrity',
                cash: 200000,
                reputation: 40,
                films: 5,
                integrityScore: 50 // New metric
            },

            specialRules: [
                'Random talent may be called before HUAC',
                'Choice events: cooperate, resist, or stay neutral',
                'Cooperation damages integrity but protects reputation',
                'Resistance damages reputation but maintains integrity',
                'Blacklisted talent cannot work on films',
                'Public opinion affects box office based on choices',
                'Multiple endings based on integrity vs success balance'
            ],

            startingScripts: ['social_drama', 'film_noir', 'safe_musical', 'western'],

            tips: [
                'There are no perfect choices, only consequences',
                'Some talent will be worth defending despite the cost',
                'Safe, apolitical films reduce scrutiny',
                'Your choices will affect your final score'
            ]
        },

        studio_boss: {
            id: 'studio_boss',
            name: 'Studio Boss',
            difficulty: 'normal',
            shortDescription: 'You\'re tied to a genius director who\'s difficult to work with',
            longDescription: 'You\'ve signed an exclusive contract with one of Hollywood\'s most brilliant directors. Their vision is extraordinary, but they demand complete creative control, refuse to compromise, and have an explosive temper. Can you manage their genius while building a successful studio around their difficult personality?',
            flavorText: 'Genius is never easy to manage. But brilliance could make you both legends...',

            startYear: 1933,
            startMonth: 0,

            initialState: {
                cash: 250000,
                reputation: 40,
                debt: 0,
                soundStages: 1,
                backlots: {
                    western: false,
                    nyc: false,
                    jungle: false
                },
                contractPlayers: [], // Will include legendary director
                restrictions: ['director_demands'],
                bonuses: ['director_genius']
            },

            victoryConditions: {
                description: 'Win 3 Oscars with your director before they leave',
                cash: 200000,
                reputation: 55,
                oscarWins: 3,
                directorFilms: 8
            },

            specialRules: [
                'Legendary Director starts under exclusive contract',
                'Director demands: +30% budget, final cut, hand-picked cast',
                'Director bonus: +20 quality to all their films',
                'Random events: director tantrums, walk-offs, brilliance',
                'Must make at least 1 film per year with director or they leave',
                'Director leaves if reputation drops below 35',
                'High Oscar potential on all director films'
            ],

            startingScripts: ['auteur_drama', 'artistic_vision', 'character_study'],

            // Special: Include legendary director in starting state
            legendaryDirector: {
                name: 'Orson Wexler', // Fictional Orson Welles-inspired
                type: 'director',
                quality: 90,
                salary: 15000,
                temperament: 'volatile',
                specialty: 'drama',
                oscarPotential: 25
            },

            tips: [
                'Give your director what they need - they\'re worth it',
                'Budget for high costs but expect high returns',
                'Make commercial films between director projects',
                'Keep them happy or lose your golden goose'
            ]
        },

        fresh_start: {
            id: 'fresh_start',
            name: 'Fresh Start',
            difficulty: 'very_hard',
            shortDescription: 'The hardest challenge - prove yourself from nothing',
            longDescription: 'You have minimal capital, no contracts, no facilities beyond the basics, and higher costs than established studios. Every decision matters. Every dollar counts. This is Hollywood on hard mode. Can you build an empire from absolutely nothing?',
            flavorText: 'No connections. No favors. No second chances. Just you versus Hollywood.',

            startYear: 1933,
            startMonth: 0,

            initialState: {
                cash: 200000,
                reputation: 30,
                debt: 0,
                soundStages: 1,
                backlots: {
                    western: false,
                    nyc: false,
                    jungle: false
                },
                contractPlayers: [],
                restrictions: ['hard_mode'],
                bonuses: []
            },

            victoryConditions: {
                description: 'Build a studio from nothing — reach $100K, reputation 40, and 20 films',
                cash: 100000,
                reputation: 40,
                films: 20
            },

            specialRules: [
                'All costs increased by 15%',
                'No starting contracts or scripts',
                'Lower quality scripts available initially',
                'Slower reputation gains',
                'Actors demand higher salaries',
                'Banks charge higher interest rates',
                'Achievement unlocked for completing this mode'
            ],

            startingScripts: [], // Must acquire scripts the hard way

            tips: [
                'Start with the cheapest films available',
                'Build cash reserves before taking risks',
                'Avoid debt at all costs - interest rates are brutal',
                'This is the ultimate challenge - good luck!'
            ]
        }
    };

    /**
     * Get all available scenarios
     */
    function getAllScenarios() {
        return Object.values(SCENARIOS);
    }

    /**
     * Get scenario by ID
     */
    function getScenarioById(id) {
        return SCENARIOS[id] || SCENARIOS.classic_start;
    }

    /**
     * Get difficulty color/class
     */
    function getDifficultyClass(difficulty) {
        const mapping = {
            'normal': 'difficulty-normal',
            'hard': 'difficulty-hard',
            'very_hard': 'difficulty-very-hard'
        };
        return mapping[difficulty] || 'difficulty-normal';
    }

    /**
     * Get difficulty display name
     */
    function getDifficultyDisplay(difficulty) {
        const mapping = {
            'normal': 'NORMAL',
            'hard': 'HARD',
            'very_hard': 'VERY HARD'
        };
        return mapping[difficulty] || 'NORMAL';
    }

    /**
     * Apply scenario to game state
     */
    function applyScenario(scenarioId, gameState) {
        const scenario = getScenarioById(scenarioId);

        if (!scenario) {
            console.error('Scenario not found:', scenarioId);
            return false;
        }


        // Apply basic state
        gameState.currentDate = new Date(scenario.startYear, scenario.startMonth, 1);
        gameState.gameYear = scenario.startYear;
        gameState.cash = scenario.initialState.cash;
        gameState.reputation = scenario.initialState.reputation;
        gameState.debt = scenario.initialState.debt || 0;
        gameState.soundStages = scenario.initialState.soundStages;
        gameState.backlots = { ...scenario.initialState.backlots };

        // Store scenario info
        gameState.scenario = {
            id: scenario.id,
            name: scenario.name,
            difficulty: scenario.difficulty,
            victoryConditions: scenario.victoryConditions,
            specialRules: scenario.specialRules,
            restrictions: scenario.initialState.restrictions,
            bonuses: scenario.initialState.bonuses,
            startDate: new Date(scenario.startYear, scenario.startMonth, 1)
        };

        // Apply special scenario logic
        applyScenarioSpecials(scenario, gameState);

        // Generate starting scripts
        generateStartingScripts(scenario, gameState);

        // Add welcome alert
        window.HollywoodMogul.addAlert({
            type: 'info',
            icon: '🎬',
            message: `${scenario.name}: ${scenario.shortDescription}`,
            priority: 'high'
        });

        return true;
    }

    /**
     * Apply scenario-specific special rules and bonuses
     */
    function applyScenarioSpecials(scenario, gameState) {
        switch(scenario.id) {
            case 'studio_boss':
                // Add legendary director to contracts
                if (scenario.legendaryDirector) {
                    gameState.contractPlayers = gameState.contractPlayers || [];
                    gameState.contractPlayers.push({
                        id: 'legendary_director_' + Date.now(),
                        ...scenario.legendaryDirector,
                        contractWeeksRemaining: 520, // 10 years
                        isLegendary: true
                    });
                }
                break;

            case 'the_inheritance':
                // Set up debt payment schedule
                gameState.debtPaymentSchedule = {
                    amount: 50000,
                    frequency: 26, // Every 26 weeks (6 months)
                    nextPayment: 26
                };
                break;

            case 'war_effort':
                // Mark war period
                gameState.wartime = true;
                gameState.warEndYear = 1945;
                break;

            case 'the_blacklist':
                // Initialize integrity system
                gameState.integrityScore = 75; // Start neutral-high
                gameState.blacklistChoices = [];
                break;

            case 'poverty_row':
                // Set budget restrictions
                gameState.maxBudget = 75000;
                break;

            case 'fresh_start':
                // Apply cost multiplier
                gameState.costMultiplier = 1.15;
                break;
        }
    }

    /**
     * Generate starting scripts based on scenario
     */
    function generateStartingScripts(scenario, gameState) {
        if (!window.ScriptLibrary) {
            console.warn('ScriptLibrary not available for scenario script generation');
            return;
        }

        gameState.availableScripts = gameState.availableScripts || [];

        // If scenario has specific starting scripts, generate them
        if (scenario.startingScripts && scenario.startingScripts.length > 0) {
            // This would integrate with your existing ScriptLibrary
            // For now, just generate normal scripts
            if (window.ScriptLibrary.generateInitialScripts) {
                const scripts = window.ScriptLibrary.generateInitialScripts(gameState);
                gameState.availableScripts = scripts;
            }
        } else {
            // Generate default scripts
            if (window.ScriptLibrary.generateInitialScripts) {
                const scripts = window.ScriptLibrary.generateInitialScripts(gameState);
                gameState.availableScripts = scripts;
            }
        }
    }

    /**
     * Check victory conditions for current scenario
     */
    function checkVictoryConditions(gameState) {
        if (!gameState.scenario || !gameState.scenario.victoryConditions) {
            return false;
        }

        const conditions = gameState.scenario.victoryConditions;
        const stats = gameState.stats || {};

        // Check each condition
        const checks = {
            cash: !conditions.cash || gameState.cash >= conditions.cash,
            reputation: !conditions.reputation || gameState.reputation >= conditions.reputation,
            films: !conditions.films || stats.filmsProduced >= conditions.films,
            debtFree: !conditions.debtFree || !gameState.debt || gameState.debt <= 0,
            oscarWins: !conditions.oscarWins || stats.oscarsWon >= conditions.oscarWins,
            integrityScore: !conditions.integrityScore || (gameState.integrityScore || 0) >= conditions.integrityScore
        };

        return Object.values(checks).every(check => check === true);
    }

    /**
     * Get victory progress for UI display
     */
    function getVictoryProgress(gameState) {
        if (!gameState.scenario || !gameState.scenario.victoryConditions) {
            return null;
        }

        const conditions = gameState.scenario.victoryConditions;
        const stats = gameState.stats || {};

        return {
            cash: {
                current: gameState.cash,
                required: conditions.cash || 0,
                met: !conditions.cash || gameState.cash >= conditions.cash
            },
            reputation: {
                current: gameState.reputation,
                required: conditions.reputation || 0,
                met: !conditions.reputation || gameState.reputation >= conditions.reputation
            },
            films: {
                current: stats.filmsProduced || 0,
                required: conditions.films || 0,
                met: !conditions.films || stats.filmsProduced >= conditions.films
            },
            debtFree: {
                current: gameState.debt || 0,
                required: 0,
                met: !conditions.debtFree || !gameState.debt || gameState.debt <= 0
            }
        };
    }

    /**
     * Show scenario selection modal
     */
    function showScenarioSelection() {
        const scenarios = getAllScenarios();

        let html = `
            <div class="scenario-selection">
                <h2>SELECT YOUR SCENARIO</h2>
                <p class="selection-description">Choose your starting scenario. Each offers a unique challenge and path to success.</p>

                <div class="scenarios-grid">
        `;

        scenarios.forEach(scenario => {
            const difficultyClass = getDifficultyClass(scenario.difficulty);
            const difficultyText = getDifficultyDisplay(scenario.difficulty);

            html += `
                <div class="scenario-card" data-scenario="${scenario.id}">
                    <div class="scenario-header">
                        <h3>${scenario.name}</h3>
                        <span class="difficulty-badge ${difficultyClass}">${difficultyText}</span>
                    </div>

                    <div class="scenario-content">
                        <p class="scenario-short-desc">${scenario.shortDescription}</p>

                        <div class="scenario-stats">
                            <div class="stat-item">
                                <span class="stat-label">Year:</span>
                                <span class="stat-value">${scenario.startYear}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Cash:</span>
                                <span class="stat-value">$${scenario.initialState.cash.toLocaleString()}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Reputation:</span>
                                <span class="stat-value">${scenario.initialState.reputation}/100</span>
                            </div>
                            ${scenario.initialState.debt ? `
                            <div class="stat-item debt">
                                <span class="stat-label">Debt:</span>
                                <span class="stat-value negative">$${scenario.initialState.debt.toLocaleString()}</span>
                            </div>
                            ` : ''}
                        </div>

                        <button class="action-btn primary select-scenario-btn"
                                data-scenario="${scenario.id}"
                                onclick="ScenarioSystem.selectScenario('${scenario.id}')">
                            SELECT SCENARIO
                        </button>

                        <button class="action-btn secondary details-btn"
                                onclick="ScenarioSystem.showScenarioDetails('${scenario.id}')">
                            MORE INFO
                        </button>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        if (window.HollywoodMogul && window.HollywoodMogul.showModal) {
            window.HollywoodMogul.showModal(html);
        }
    }

    /**
     * Show detailed scenario information
     */
    function showScenarioDetails(scenarioId) {
        const scenario = getScenarioById(scenarioId);
        const difficultyClass = getDifficultyClass(scenario.difficulty);
        const difficultyText = getDifficultyDisplay(scenario.difficulty);

        let html = `
            <div class="scenario-details">
                <div class="details-header">
                    <h2>${scenario.name}</h2>
                    <span class="difficulty-badge ${difficultyClass}">${difficultyText}</span>
                </div>

                <div class="flavor-text">
                    <em>"${scenario.flavorText}"</em>
                </div>

                <div class="long-description">
                    <p>${scenario.longDescription}</p>
                </div>

                <div class="starting-conditions">
                    <h3>Starting Conditions</h3>
                    <ul>
                        <li><strong>Year:</strong> ${scenario.startYear}</li>
                        <li><strong>Cash:</strong> $${scenario.initialState.cash.toLocaleString()}</li>
                        <li><strong>Reputation:</strong> ${scenario.initialState.reputation}/100</li>
                        <li><strong>Sound Stages:</strong> ${scenario.initialState.soundStages}</li>
                        ${scenario.initialState.debt ? `<li><strong>Debt:</strong> <span class="negative">$${scenario.initialState.debt.toLocaleString()}</span></li>` : ''}
                    </ul>
                </div>

                ${scenario.specialRules && scenario.specialRules.length > 0 ? `
                <div class="special-rules">
                    <h3>Special Rules</h3>
                    <ul>
                        ${scenario.specialRules.map(rule => `<li>${rule}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                <div class="victory-conditions">
                    <h3>Victory Conditions</h3>
                    <p>${scenario.victoryConditions.description}</p>
                    <ul>
                        ${scenario.victoryConditions.cash ? `<li>Cash: $${scenario.victoryConditions.cash.toLocaleString()}+</li>` : ''}
                        ${scenario.victoryConditions.reputation ? `<li>Reputation: ${scenario.victoryConditions.reputation}+</li>` : ''}
                        ${scenario.victoryConditions.films ? `<li>Films Produced: ${scenario.victoryConditions.films}+</li>` : ''}
                        ${scenario.victoryConditions.oscarWins ? `<li>Oscar Wins: ${scenario.victoryConditions.oscarWins}+</li>` : ''}
                        ${scenario.victoryConditions.debtFree ? `<li>Pay off all debts</li>` : ''}
                    </ul>
                </div>

                ${scenario.tips && scenario.tips.length > 0 ? `
                <div class="scenario-tips">
                    <h3>Tips for Success</h3>
                    <ul>
                        ${scenario.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                <div class="details-actions">
                    <button class="action-btn primary" onclick="ScenarioSystem.selectScenario('${scenario.id}')">
                        START THIS SCENARIO
                    </button>
                    <button class="action-btn secondary" onclick="ScenarioSystem.showScenarioSelection()">
                        BACK TO SELECTION
                    </button>
                </div>
            </div>
        `;

        if (window.HollywoodMogul && window.HollywoodMogul.showModal) {
            window.HollywoodMogul.showModal(html);
        }
    }

    /**
     * Select and start a scenario
     */
    function selectScenario(scenarioId) {

        // Close modal
        if (window.HollywoodMogul && window.HollywoodMogul.closeModal) {
            window.HollywoodMogul.closeModal();
        }

        // Start new game with selected scenario
        if (window.HollywoodMogul && window.HollywoodMogul.startNewGameWithScenario) {
            window.HollywoodMogul.startNewGameWithScenario(scenarioId);
        }
    }

    /**
     * Public API
     */
    return {
        getAllScenarios,
        getScenarioById,
        applyScenario,
        checkVictoryConditions,
        getVictoryProgress,
        showScenarioSelection,
        showScenarioDetails,
        selectScenario,
        getDifficultyClass,
        getDifficultyDisplay
    };
})();
