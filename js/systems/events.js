/**
 * HOLLYWOOD MOGUL - RANDOM EVENTS SYSTEM
 * Dynamic production events that affect film quality, budget, and schedule
 */

window.EventSystem = (function() {
    'use strict';

    // Event database categorized by type and impact
    const EVENT_DATABASE = {
        positive: [
            {
                id: 'test_screening_success',
                title: 'Test Screening Triumph',
                description: 'Early audiences are raving about the picture. Studio buzz is building.',
                effects: { reputation: 5, quality: 10, hype: 20 },
                probability: 0.15,
                phase: ['post_production']
            },
            {
                id: 'perfect_take',
                title: 'Perfect Take',
                description: 'The director captured magic in a single take. Ahead of schedule!',
                effects: { quality: 8, weeks: -1 },
                probability: 0.12,
                phase: ['production']
            },
            {
                id: 'star_chemistry',
                title: 'Natural Chemistry',
                description: 'The leads have incredible on-screen chemistry.',
                effects: { quality: 12, oscar_potential: 10 },
                probability: 0.10,
                phase: ['production']
            },
            {
                id: 'technical_innovation',
                title: 'Technical Breakthrough',
                description: 'Your cinematographer pioneered a new lighting technique.',
                effects: { quality: 15, reputation: 8, oscar_potential: 15 },
                probability: 0.08,
                phase: ['production', 'post_production']
            },
            {
                id: 'positive_coverage',
                title: 'Positive Press Coverage',
                description: 'Movie columnists are praising the production.',
                effects: { hype: 15, reputation: 5 },
                probability: 0.18,
                phase: ['production', 'post_production']
            }
        ],

        negative: [
            {
                id: 'weather_delay',
                title: 'Weather Shutdown',
                description: 'Heavy rain has forced production to halt for several days.',
                effects: { weeks: 1, budget: 8000 },
                probability: 0.20,
                phase: ['production']
            },
            {
                id: 'equipment_failure',
                title: 'Equipment Malfunction',
                description: 'A camera broke down during a crucial scene.',
                effects: { weeks: 1, budget: 5000, quality: -5 },
                probability: 0.15,
                phase: ['production']
            },
            {
                id: 'actor_illness',
                title: 'Lead Actor Ill',
                description: 'Your star is sick and unable to work this week.',
                effects: { weeks: 1, budget: 3000 },
                probability: 0.12,
                phase: ['production']
            },
            {
                id: 'script_problems',
                title: 'Script Issues',
                description: 'The script needs rewrites. The director is frustrated.',
                effects: { weeks: 2, quality: -10 },
                probability: 0.10,
                phase: ['pre_production', 'production']
            },
            {
                id: 'budget_overrun',
                title: 'Budget Overrun',
                description: 'Production costs are spiraling. Need additional funds.',
                effects: { budget: 15000 },
                probability: 0.18,
                phase: ['production']
            },
            {
                id: 'creative_conflict',
                title: 'Creative Differences',
                description: 'The director and producer are at odds.',
                effects: { weeks: 1, quality: -8, morale: -15 },
                probability: 0.14,
                phase: ['production']
            },
            {
                id: 'negative_buzz',
                title: 'Industry Skepticism',
                description: 'Hollywood insiders are expressing doubts about the project.',
                effects: { hype: -20, reputation: -3 },
                probability: 0.12,
                phase: ['production', 'post_production']
            }
        ],

        scandal: [
            {
                id: 'actor_scandal',
                title: 'Star\'s Personal Scandal',
                description: 'Your lead actor\'s personal life is making headlines.',
                effects: { reputation: -10, hype: -25, box_office_penalty: 0.15 },
                probability: 0.08,
                phase: ['production', 'post_production', 'release'],
                player_choice: true
            },
            {
                id: 'set_accident',
                title: 'On-Set Accident',
                description: 'A stunt went wrong. Someone was injured.',
                effects: { weeks: 2, budget: 10000, reputation: -8, morale: -25 },
                probability: 0.05,
                phase: ['production']
            }
        ],

        era_specific: {
            war_years: [
                {
                    id: 'rationing_shortage',
                    title: 'Material Rationing',
                    description: 'War rationing has limited access to film stock and materials.',
                    effects: { budget: 12000, quality: -5 },
                    probability: 0.25,
                    phase: ['production'],
                    years: [1942, 1943, 1944, 1945]
                },
                {
                    id: 'actor_drafted',
                    title: 'Actor Drafted',
                    description: 'Your male lead has been drafted into military service.',
                    effects: { weeks: 4, budget: 20000, recast: true },
                    probability: 0.15,
                    phase: ['pre_production', 'production'],
                    years: [1942, 1943, 1944, 1945]
                }
            ],
            post_war: [
                {
                    id: 'huac_investigation',
                    title: 'HUAC Suspicion',
                    description: 'Your project is drawing attention from HUAC investigators.',
                    effects: { reputation: -15, hype: -30, huac_risk: 50 },
                    probability: 0.12,
                    phase: ['production', 'post_production'],
                    years: [1947, 1948, 1949]
                }
            ]
        }
    };

    /**
     * Generate random event for a film
     */
    function generateRandomEvent(gameState) {
        // Don't generate events if no active films
        if (!gameState.activeFilms || gameState.activeFilms.length === 0) {
            return null;
        }

        // Select a random active film
        const film = gameState.activeFilms[Math.floor(Math.random() * gameState.activeFilms.length)];

        if (!film) return null;

        // Determine eligible events based on film phase and era
        const eligibleEvents = getEligibleEvents(film, gameState);

        if (eligibleEvents.length === 0) return null;

        // Roll for event occurrence
        const roll = Math.random();
        let cumulativeProbability = 0;

        for (const event of eligibleEvents) {
            cumulativeProbability += event.probability;
            if (roll < cumulativeProbability) {
                return applyEvent(event, film, gameState);
            }
        }

        return null;
    }

    /**
     * Get events eligible for current film and game state
     */
    function getEligibleEvents(film, gameState) {
        const events = [];
        const filmPhase = film.status || 'production';
        const currentYear = gameState.gameYear;

        // Add positive events
        events.push(...EVENT_DATABASE.positive.filter(e =>
            !e.phase || e.phase.includes(filmPhase)
        ));

        // Add negative events
        events.push(...EVENT_DATABASE.negative.filter(e =>
            !e.phase || e.phase.includes(filmPhase)
        ));

        // Add scandal events (lower probability)
        events.push(...EVENT_DATABASE.scandal.map(e => ({ ...e, probability: e.probability * 0.5 })).filter(e =>
            !e.phase || e.phase.includes(filmPhase)
        ));

        // Add era-specific events
        if (currentYear >= 1941 && currentYear <= 1945) {
            events.push(...EVENT_DATABASE.era_specific.war_years.filter(e =>
                e.years.includes(currentYear) && (!e.phase || e.phase.includes(filmPhase))
            ));
        } else if (currentYear >= 1947) {
            events.push(...EVENT_DATABASE.era_specific.post_war.filter(e =>
                e.years.includes(currentYear) && (!e.phase || e.phase.includes(filmPhase))
            ));
        }

        return events;
    }

    /**
     * Apply event effects to film and game state
     */
    function applyEvent(event, film, gameState) {
        const effects = { ...event.effects };

        // Apply effects to film
        if (effects.quality) {
            film.quality = Math.max(0, Math.min(100, (film.quality || 50) + effects.quality));
        }

        if (effects.weeks) {
            film.weeksRemaining = (film.weeksRemaining || 12) + effects.weeks;
        }

        if (effects.budget) {
            film.budgetSpent = (film.budgetSpent || 0) + effects.budget;
            window.HollywoodMogul.spendCash(effects.budget);
        }

        if (effects.oscar_potential) {
            film.oscarPotential = Math.max(0, Math.min(100, (film.oscarPotential || 50) + effects.oscar_potential));
        }

        if (effects.hype) {
            film.hype = Math.max(0, Math.min(100, (film.hype || 50) + effects.hype));
        }

        // Apply effects to game state
        if (effects.reputation) {
            gameState.reputation = Math.max(0, Math.min(100, gameState.reputation + effects.reputation));
        }

        if (effects.huac_risk) {
            film.huacRisk = (film.huacRisk || 0) + effects.huac_risk;
        }

        // Generate alert
        const alertType = effects.quality > 0 || effects.reputation > 0 ? 'success' :
                         effects.quality < 0 || effects.reputation < 0 ? 'warning' : 'info';

        window.HollywoodMogul.addAlert({
            type: alertType,
            icon: alertType === 'success' ? '✨' : alertType === 'warning' ? '⚠️' : '🎬',
            message: `${film.title}: ${event.description}`,
            priority: event.probability < 0.1 ? 'high' : 'medium'
        });

        console.log(`Event triggered: ${event.title} on ${film.title}`, effects);

        // Handle player choices if required
        if (event.player_choice) {
            showEventChoice(event, film, gameState);
        }

        return {
            event: event,
            film: film,
            effects: effects
        };
    }

    /**
     * Show event choice modal for player decisions
     */
    function showEventChoice(event, film, gameState) {
        const choices = getEventChoices(event);

        const choicesHTML = choices.map((choice, index) => `
            <div class="event-choice">
                <button onclick="EventSystem.handleEventChoice('${event.id}', '${film.id}', ${index})" class="action-btn ${choice.recommended ? 'primary' : 'secondary'}">
                    ${choice.text}
                </button>
                <p class="choice-consequences">${choice.consequences}</p>
            </div>
        `).join('');

        window.HollywoodMogul.showModal(`
            <h2>⚠️ Crisis: ${event.title}</h2>
            <div class="event-description">
                <p><strong>${film.title}</strong></p>
                <p>${event.description}</p>
            </div>
            <div class="event-choices">
                <h3>How do you respond?</h3>
                ${choicesHTML}
            </div>
        `);
    }

    /**
     * Get available choices for an event
     */
    function getEventChoices(event) {
        const choiceDatabase = {
            actor_scandal: [
                {
                    text: 'Issue public statement supporting the actor',
                    consequences: 'Loyalty +, Reputation may suffer',
                    effects: { reputation: -5, morale: 10, loyalty: 20 }
                },
                {
                    text: 'Distance the studio from the scandal',
                    consequences: 'Protect reputation, hurt morale',
                    effects: { reputation: 5, morale: -15, box_office_penalty: 0.10 }
                },
                {
                    text: 'Hire a PR firm to manage the crisis',
                    consequences: 'Costs $15,000, mitigates damage',
                    effects: { budget: 15000, reputation: 0, box_office_penalty: 0.05 },
                    recommended: true
                }
            ]
        };

        return choiceDatabase[event.id] || [];
    }

    /**
     * Handle player's event choice
     */
    function handleEventChoice(eventId, filmId, choiceIndex) {
        const gameState = window.HollywoodMogul.getGameState();
        const film = gameState.activeFilms.find(f => f.id === filmId);

        if (!film) return;

        const event = [...EVENT_DATABASE.positive, ...EVENT_DATABASE.negative, ...EVENT_DATABASE.scandal]
            .find(e => e.id === eventId);

        const choices = getEventChoices(event);
        const choice = choices[choiceIndex];

        if (choice && choice.effects) {
            // Apply choice effects
            if (choice.effects.budget) {
                window.HollywoodMogul.spendCash(choice.effects.budget);
            }
            if (choice.effects.reputation) {
                gameState.reputation += choice.effects.reputation;
            }
            if (choice.effects.box_office_penalty) {
                film.box_office_penalty = (film.box_office_penalty || 0) + choice.effects.box_office_penalty;
            }

            window.HollywoodMogul.addAlert({
                type: 'info',
                icon: '✓',
                message: `Decision made: ${choice.text}`,
                priority: 'medium'
            });
        }

        window.HollywoodMogul.closeModal();
    }

    /**
     * Process weekly events check
     */
    function processWeeklyEventCheck(gameState) {
        // 15% chance per week for an event
        if (Math.random() < 0.15) {
            generateRandomEvent(gameState);
        }
    }

    // Public API
    return {
        generateRandomEvent,
        processWeeklyEventCheck,
        handleEventChoice,
        getEventById: (id) => {
            const allEvents = [
                ...EVENT_DATABASE.positive,
                ...EVENT_DATABASE.negative,
                ...EVENT_DATABASE.scandal
            ];
            return allEvents.find(e => e.id === id);
        }
    };
})();
