/**
 * HOLLYWOOD MOGUL - CRISIS MANAGEMENT SYSTEM
 * Major decisions, scandals, HUAC testimony, industry crises
 * Player choices with long-term consequences
 */

window.CrisisSystem = (function() {
    'use strict';

    /**
     * Crisis database - major events requiring player decisions
     */
    const CRISIS_SCENARIOS = {
        // Scandal Crises
        star_scandal: {
            id: 'star_scandal',
            title: 'Star Scandal Erupts',
            description: 'One of your contracted stars has been caught in a compromising situation. The press is having a field day.',
            trigger: {
                probability: 0.08,
                requiresActiveFilm: true,
                minReputation: 0
            },
            choices: [
                {
                    id: 'support_star',
                    text: 'Stand By Your Star',
                    description: 'Issue a public statement supporting the actor. Show loyalty.',
                    effects: {
                        reputation: -8,
                        starLoyalty: 20,
                        boxOffice: -0.15,
                        message: 'Your star is grateful, but some audiences are staying away.'
                    }
                },
                {
                    id: 'distance_studio',
                    text: 'Distance the Studio',
                    description: 'Issue a statement condemning the behavior. Protect the brand.',
                    effects: {
                        reputation: 3,
                        starLoyalty: -30,
                        boxOffice: -0.05,
                        message: 'Reputation protected, but you\'ve made an enemy.'
                    }
                },
                {
                    id: 'hire_pr',
                    text: 'Hire PR Firm ($25,000)',
                    description: 'Bring in professionals to manage the crisis.',
                    effects: {
                        cash: -25000,
                        reputation: 0,
                        boxOffice: -0.03,
                        message: 'Crisis expertly managed. Damage minimized.'
                    },
                    requiresCash: 25000
                }
            ]
        },

        // HUAC Crises
        huac_investigation: {
            id: 'huac_investigation',
            title: 'HUAC Calls You to Testify',
            description: 'The House Un-American Activities Committee wants you to testify about Communist influence in your studio.',
            trigger: {
                probability: 0.15,
                requiresHUAC: true,
                years: [1947, 1948, 1949]
            },
            choices: [
                {
                    id: 'cooperate_name_names',
                    text: 'Cooperate - Name Names',
                    description: 'Provide names of suspected Communists. Protect your studio.',
                    effects: {
                        reputation: -25,
                        huacRisk: -50,
                        blacklistKarma: 30,
                        industryRelations: -20,
                        message: 'You are now a "friendly witness." Many in Hollywood despise you.'
                    },
                    longTermEffect: 'cooperative_witness'
                },
                {
                    id: 'plead_fifth',
                    text: 'Plead the Fifth Amendment',
                    description: 'Refuse to answer on constitutional grounds.',
                    effects: {
                        reputation: -10,
                        huacRisk: 20,
                        blacklistRisk: 40,
                        message: 'You\'ve invoked your rights, but HUAC is suspicious.'
                    },
                    longTermEffect: 'suspicious_witness'
                },
                {
                    id: 'defiant_stand',
                    text: 'Take a Defiant Stand',
                    description: 'Publicly denounce the hearings as un-American.',
                    effects: {
                        reputation: 15,
                        huacRisk: 80,
                        blacklistRisk: 90,
                        industryRelations: 10,
                        message: 'You\'re a hero to some, but HUAC will come after you hard.'
                    },
                    longTermEffect: 'blacklisted'
                }
            ]
        },

        huac_employee_accused: {
            id: 'huac_employee_accused',
            title: 'Your Employee Accused of Communism',
            description: 'A talented writer/director on your payroll has been named as a Communist sympathizer.',
            trigger: {
                probability: 0.20,
                requiresHUAC: true,
                years: [1947, 1948, 1949]
            },
            choices: [
                {
                    id: 'fire_immediately',
                    text: 'Fire Them Immediately',
                    description: 'Cut ties to protect the studio from investigation.',
                    effects: {
                        reputation: -5,
                        huacRisk: -20,
                        talentPool: -10,
                        message: 'You\'ve fired an innocent person to save yourself.'
                    }
                },
                {
                    id: 'defend_employee',
                    text: 'Defend Your Employee',
                    description: 'Stand up for them. Refuse to participate in witch hunts.',
                    effects: {
                        reputation: 12,
                        huacRisk: 35,
                        talentLoyalty: 25,
                        message: 'Talent respects your integrity, but HUAC is watching.'
                    },
                    longTermEffect: 'huac_target'
                },
                {
                    id: 'quiet_dismissal',
                    text: 'Quiet Dismissal',
                    description: 'Let them go quietly. Don\'t make waves.',
                    effects: {
                        reputation: -2,
                        huacRisk: -10,
                        message: 'Cowardly, but pragmatic.'
                    }
                }
            ]
        },

        // Financial Crises
        near_bankruptcy: {
            id: 'near_bankruptcy',
            title: 'Studio on Brink of Bankruptcy',
            description: 'Your cash reserves are critically low. Creditors are circling.',
            trigger: {
                probability: 1.0,
                cashThreshold: 10000
            },
            choices: [
                {
                    id: 'emergency_loan',
                    text: 'Take Emergency Loan (40% interest)',
                    description: 'Borrow $50,000 at predatory rates to stay afloat.',
                    effects: {
                        cash: 50000,
                        loan: { amount: 50000, interest: 0.40, term: 12 },
                        message: 'You\'re drowning in debt, but still in business.'
                    }
                },
                {
                    id: 'sell_assets',
                    text: 'Sell Studio Assets',
                    description: 'Liquidate equipment and property for quick cash.',
                    effects: {
                        cash: 75000,
                        monthlyBurn: 5000, // Higher operating costs
                        reputation: -10,
                        message: 'Quick cash, but you\'ve gutted the studio.'
                    }
                },
                {
                    id: 'find_investor',
                    text: 'Find Silent Partner',
                    description: 'Bring in an investor for 30% equity stake.',
                    effects: {
                        cash: 100000,
                        equityLoss: 30,
                        profitShare: 0.70, // Only keep 70% of future profits
                        message: 'Saved, but you no longer fully own your studio.'
                    },
                    longTermEffect: 'partnership'
                }
            ]
        },

        // Industry Crises
        union_strike: {
            id: 'union_strike',
            title: 'Studio Workers Go on Strike',
            description: 'Crew members are striking for better wages and working conditions.',
            trigger: {
                probability: 0.10,
                requiresActiveFilm: true,
                years: [1945, 1946, 1947] // Post-war labor unrest
            },
            choices: [
                {
                    id: 'meet_demands',
                    text: 'Meet Their Demands',
                    description: 'Agree to raises and better conditions.',
                    effects: {
                        monthlyBurn: 8000,
                        reputation: 8,
                        laborRelations: 30,
                        message: 'Workers return immediately. Morale is high.'
                    }
                },
                {
                    id: 'hire_scabs',
                    text: 'Hire Replacement Workers',
                    description: 'Break the strike with strikebreakers.',
                    effects: {
                        reputation: -15,
                        laborRelations: -50,
                        productionDelay: 4,
                        message: 'Strike broken, but you\'ve made permanent enemies.'
                    }
                },
                {
                    id: 'negotiate',
                    text: 'Negotiate Compromise',
                    description: 'Find middle ground with union leaders.',
                    effects: {
                        monthlyBurn: 4000,
                        reputation: 2,
                        productionDelay: 2,
                        message: 'Reasonable compromise reached.'
                    }
                }
            ]
        },

        // Moral Crises
        controversial_film: {
            id: 'controversial_film',
            title: 'Your Film Sparks Controversy',
            description: 'A completed film is drawing condemnation from religious groups and politicians.',
            trigger: {
                probability: 0.12,
                requiresCompletedFilm: true
            },
            choices: [
                {
                    id: 'defend_film',
                    text: 'Defend Artistic Freedom',
                    description: 'Refuse to cave to pressure. Release as planned.',
                    effects: {
                        reputation: 10,
                        boxOffice: -0.20,
                        controversy: 50,
                        message: 'Free speech victory, but boycotts will hurt revenue.'
                    }
                },
                {
                    id: 'cut_scenes',
                    text: 'Cut Controversial Scenes',
                    description: 'Edit the film to appease critics.',
                    effects: {
                        reputation: -8,
                        quality: -15,
                        boxOffice: 0.05,
                        message: 'Film neutered, but it will get wider distribution.'
                    }
                },
                {
                    id: 'cancel_release',
                    text: 'Shelve the Film',
                    description: 'Pull it from distribution entirely.',
                    effects: {
                        reputation: -12,
                        cash: -50000, // Total loss
                        message: 'Cowardly surrender. The film will never be seen.'
                    }
                }
            ]
        },

        // Competition Crises
        rival_studio_bid: {
            id: 'rival_studio_bid',
            title: 'Rival Studio Tries to Poach Your Star',
            description: 'A competing studio is offering your top contracted star twice what you\'re paying.',
            trigger: {
                probability: 0.08,
                minReputation: 40
            },
            choices: [
                {
                    id: 'match_offer',
                    text: 'Match Their Offer',
                    description: 'Double your star\'s salary to keep them.',
                    effects: {
                        monthlyBurn: 3000,
                        starLoyalty: 15,
                        message: 'Star stays, but your payroll just exploded.'
                    }
                },
                {
                    id: 'let_them_go',
                    text: 'Let Them Go',
                    description: 'Release them from contract. Find someone cheaper.',
                    effects: {
                        reputation: -5,
                        boxOffice: -0.10,
                        message: 'You\'ve lost a valuable asset to a rival.'
                    }
                },
                {
                    id: 'long_term_deal',
                    text: 'Offer Long-Term Deal',
                    description: 'Smaller raise but multi-picture commitment.',
                    effects: {
                        monthlyBurn: 1500,
                        starLoyalty: 20,
                        contractLength: 5,
                        message: 'Star signs 5-picture deal. Smart negotiation.'
                    }
                }
            ]
        }
    };

    /**
     * Check if a crisis should trigger
     */
    function checkForCrisis(gameState) {
        const currentYear = gameState.gameYear;

        // Iterate through all crisis scenarios
        for (const crisisId in CRISIS_SCENARIOS) {
            const crisis = CRISIS_SCENARIOS[crisisId];
            const trigger = crisis.trigger;

            // Check probability
            if (Math.random() > trigger.probability) continue;

            // Check year restrictions
            if (trigger.years && !trigger.years.includes(currentYear)) continue;

            // Check HUAC requirement
            if (trigger.requiresHUAC && !gameState.huacActive) continue;

            // Check active film requirement
            if (trigger.requiresActiveFilm && (!gameState.activeFilms || gameState.activeFilms.length === 0)) continue;

            // Check completed film requirement
            if (trigger.requiresCompletedFilm && (!gameState.completedFilms || gameState.completedFilms.length === 0)) continue;

            // Check cash threshold
            if (trigger.cashThreshold && gameState.cash > trigger.cashThreshold) continue;

            // Check reputation requirement
            if (trigger.minReputation && gameState.reputation < trigger.minReputation) continue;

            // Trigger the crisis
            return triggerCrisis(crisis, gameState);
        }

        return null;
    }

    /**
     * Trigger a crisis
     */
    function triggerCrisis(crisis, gameState) {
        // Show crisis modal
        showCrisisModal(crisis, gameState);

        // Add alert
        window.HollywoodMogul.addAlert({
            type: 'warning',
            icon: '⚠️',
            message: `CRISIS: ${crisis.title}`,
            priority: 'high'
        });

        // Record in game state
        if (!gameState.crises) {
            gameState.crises = [];
        }
        gameState.crises.push({
            id: crisis.id,
            year: gameState.gameYear,
            month: gameState.currentDate.getMonth() + 1,
            title: crisis.title,
            resolved: false
        });

        return crisis;
    }

    /**
     * Show crisis modal with choices
     */
    function showCrisisModal(crisis, gameState) {
        let choicesHTML = '';

        for (let i = 0; i < crisis.choices.length; i++) {
            const choice = crisis.choices[i];

            const disabled = choice.requiresCash && gameState.cash < choice.requiresCash ? 'disabled' : '';
            const disabledNote = choice.requiresCash && gameState.cash < choice.requiresCash ?
                `<p class="disabled-note">(Insufficient cash: Need $${choice.requiresCash.toLocaleString()})</p>` : '';

            choicesHTML += `
                <div class="crisis-choice ${disabled}">
                    <button onclick="CrisisSystem.handleCrisisChoice('${crisis.id}', ${i})"
                            class="action-btn ${i === 0 ? 'primary' : 'secondary'}"
                            ${disabled}>
                        ${choice.text}
                    </button>
                    <p class="choice-description">${choice.description}</p>
                    ${disabledNote}
                </div>
            `;
        }

        window.HollywoodMogul.showModal(`
            <div class="crisis-modal">
                <h2>⚠️ CRISIS: ${crisis.title}</h2>
                <div class="crisis-description">
                    <p>${crisis.description}</p>
                </div>

                <div class="crisis-choices">
                    <h3>How do you respond?</h3>
                    ${choicesHTML}
                </div>

                <p class="crisis-warning"><em>This decision will have lasting consequences.</em></p>
            </div>
        `);
    }

    /**
     * Handle player's crisis choice
     */
    function handleCrisisChoice(crisisId, choiceIndex) {
        const gameState = window.HollywoodMogul.getGameState();
        const crisis = CRISIS_SCENARIOS[crisisId];
        const choice = crisis.choices[choiceIndex];

        if (!choice) {
            console.error('Invalid choice index');
            return;
        }

        // Check cash requirement
        if (choice.requiresCash && gameState.cash < choice.requiresCash) {
            window.HollywoodMogul.addAlert({
                type: 'warning',
                icon: '💰',
                message: 'Insufficient funds for this option',
                priority: 'medium'
            });
            return;
        }

        // Apply choice effects
        applyChoiceEffects(choice, gameState);

        // Mark crisis as resolved
        const crisisRecord = gameState.crises.find(c => c.id === crisisId && !c.resolved);
        if (crisisRecord) {
            crisisRecord.resolved = true;
            crisisRecord.choice = choice.id;
        }

        // Show result message
        window.HollywoodMogul.addAlert({
            type: 'info',
            icon: '✓',
            message: choice.effects.message,
            priority: 'high'
        });

        // Close modal
        window.HollywoodMogul.closeModal();

        // Update UI
        if (window.Integration && window.Integration.syncAllToUI) {
            window.Integration.syncAllToUI();
        }
    }

    /**
     * Apply crisis choice effects to game state
     */
    function applyChoiceEffects(choice, gameState) {
        const effects = choice.effects;

        // Cash effects
        if (effects.cash) {
            window.HollywoodMogul.addCash(effects.cash);
        }

        // Reputation effects
        if (effects.reputation) {
            gameState.reputation = Math.max(0, Math.min(100, gameState.reputation + effects.reputation));
        }

        // Monthly burn effects
        if (effects.monthlyBurn) {
            gameState.monthlyBurn += effects.monthlyBurn;
        }

        // HUAC risk effects
        if (effects.huacRisk) {
            gameState.huacRisk = (gameState.huacRisk || 0) + effects.huacRisk;
        }

        // Blacklist risk effects
        if (effects.blacklistRisk) {
            gameState.blacklistRisk = (gameState.blacklistRisk || 0) + effects.blacklistRisk;
        }

        // Long-term effects
        if (choice.longTermEffect) {
            if (!gameState.longTermEffects) {
                gameState.longTermEffects = [];
            }
            gameState.longTermEffects.push(choice.longTermEffect);
        }

        // Loan effects
        if (effects.loan) {
            if (!gameState.loans) {
                gameState.loans = [];
            }
            gameState.loans.push(effects.loan);
        }

        // Box office effects on active films
        if (effects.boxOffice && gameState.activeFilms) {
            for (const film of gameState.activeFilms) {
                film.boxOfficeModifier = (film.boxOfficeModifier || 1.0) + effects.boxOffice;
            }
        }

        // Production delay effects
        if (effects.productionDelay && gameState.activeFilms) {
            for (const film of gameState.activeFilms) {
                film.weeksRemaining = (film.weeksRemaining || 12) + effects.productionDelay;
            }
        }

        // Quality effects on active films
        if (effects.quality && gameState.activeFilms && gameState.activeFilms.length > 0) {
            // Apply to most recent film
            const film = gameState.activeFilms[gameState.activeFilms.length - 1];
            film.quality = Math.max(0, Math.min(100, (film.quality || 50) + effects.quality));
        }
    }

    /**
     * Get crisis history
     */
    function getCrisisHistory(gameState) {
        return gameState.crises || [];
    }

    /**
     * Check if player has specific long-term effect
     */
    function hasLongTermEffect(gameState, effect) {
        return (gameState.longTermEffects || []).includes(effect);
    }

    // Public API
    return {
        checkForCrisis,
        handleCrisisChoice,
        getCrisisHistory,
        hasLongTermEffect,
        CRISIS_SCENARIOS
    };
})();
