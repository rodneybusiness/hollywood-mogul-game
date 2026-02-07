/**
 * HOLLYWOOD MOGUL - FILM PRODUCTION SYSTEM
 * The heart of the game - where dreams are made and budgets explode
 */

window.ProductionSystem = (function() {
    'use strict';
    
    // Production phases with realistic durations
    const PRODUCTION_PHASES = {
        DEVELOPMENT: { 
            name: 'Development', 
            duration: 2, // weeks
            description: 'Script revisions, casting, pre-production planning'
        },
        PRE_PRODUCTION: { 
            name: 'Pre-Production', 
            duration: 3,
            description: 'Set construction, rehearsals, final preparations'
        },
        PRINCIPAL_PHOTOGRAPHY: { 
            name: 'Principal Photography', 
            duration: 4, // Base duration, varies by budget
            description: 'Main filming with cast and crew'
        },
        POST_PRODUCTION: { 
            name: 'Post-Production', 
            duration: 6,
            description: 'Editing, sound mixing, musical scoring'
        },
        DISTRIBUTION_PREP: { 
            name: 'Distribution Prep', 
            duration: 2,
            description: 'Marketing materials, theater bookings'
        }
    };
    
    // Production event probabilities (per week during shooting)
    const EVENT_PROBABILITIES = {
        MINOR_DELAY: 0.3,      // 30% chance per week
        BUDGET_OVERRUN: 0.2,   // 20% chance per week  
        TALENT_ISSUE: 0.15,    // 15% chance per week
        EQUIPMENT_PROBLEM: 0.1, // 10% chance per week
        WEATHER_DELAY: 0.1,    // 10% chance per week (outdoor shoots)
        SCRIPT_CHANGES: 0.08,  // 8% chance per week
        UNION_TROUBLE: 0.05,   // 5% chance per week
        MAJOR_DISASTER: 0.02   // 2% chance per week
    };
    
    /**
     * Start production on a greenlit film
     */
    function startProduction(script, gameState) {
        const film = {
            id: generateFilmId(),
            title: script.title,
            genre: script.genre,
            
            // Budget & Financial
            originalBudget: script.budget,
            currentBudget: script.budget,
            spentToDate: 0,
            weeklyBurnRate: calculateWeeklyBurn(script),
            
            // Production Info
            phase: 'DEVELOPMENT',
            weeksInCurrentPhase: 0,
            totalWeeks: 0,
            shootingDays: calculateShootingDays(script.budget),
            
            // Quality & Success Factors
            scriptQuality: script.quality,
            currentQuality: script.quality,
            castChemistry: 50, // Will be set during casting
            directorSkill: 60, // Will be set when director assigned
            
            // Crew & Cast
            director: null,
            leadActors: [],
            supportingCast: [],
            crewEfficiency: 70,
            
            // Production Status
            status: 'In Development',
            completion: 0,
            onSchedule: true,
            onBudget: true,
            
            // Events & History
            productionEvents: [],
            crisisCount: 0,
            delayWeeks: 0,
            
            // Metadata
            startDate: new Date(gameState.currentDate),
            genreHeat: getGenreHeat(script.genre, gameState.gameYear),
            censorRisk: script.censorRisk,
            
            // Post-production data (set later)
            marketingBudget: 0,
            distributionStrategy: null,
            releaseDate: null,
            
            // Box office tracking (set during release)
            boxOfficeWeeks: [],
            totalGross: 0,
            studioRevenue: 0,
            inTheaters: false,
            theaterCount: 0
        };
        
        // Add to active films
        gameState.activeFilms.push(film);

        // Commit full production budget upfront (prepaid model).
        // Weekly costs are tracked in spentToDate but NOT re-deducted from cash.
        // Only cost overruns beyond originalBudget trigger additional cash deductions.
        gameState.cash -= film.originalBudget;
        film.spentToDate += Math.floor(film.originalBudget * 0.1); // Track 10% as initial dev spend
        
        // Add alert
        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'production',
                icon: '🎬',
                message: `"${film.title}" has entered development. Budget: $${film.originalBudget.toLocaleString()}`,
                priority: 'high'
            });
        }
        
        return film;
    }
    
    /**
     * Process weekly production updates for all active films
     */
    function processWeeklyProduction(gameState) {
        gameState.activeFilms.forEach(film => {
            if (film.phase === 'COMPLETED') return;

            // Advance time in current phase
            film.weeksInCurrentPhase += 1;
            film.totalWeeks += 1;

            // Track weekly costs against pre-paid budget (budget already deducted at greenlight)
            const weeklyCost = calculateWeeklyCost(film, gameState);
            film.spentToDate += weeklyCost;

            // Only deduct from cash if film goes over budget
            if (film.spentToDate > film.originalBudget) {
                const overage = Math.min(weeklyCost, film.spentToDate - film.originalBudget);
                gameState.cash -= overage;
            }
            
            // Check for budget status
            updateBudgetStatus(film);
            
            // Process phase-specific logic
            processPhaseLogic(film, gameState);
            
            // Check for random events (only during active production phases)
            if (shouldTriggerEvent(film)) {
                triggerProductionEvent(film, gameState);
            }
            
            // Update completion percentage
            updateCompletion(film);
            
            // Check if phase is complete
            if (isPhaseComplete(film)) {
                advanceToNextPhase(film, gameState);
            }
        });
    }
    
    /**
     * Calculate weekly production costs
     */
    function calculateWeeklyCost(film, gameState) {
        let baseCost = film.weeklyBurnRate;
        
        // Phase-specific multipliers
        const phaseMultipliers = {
            DEVELOPMENT: 0.3,
            PRE_PRODUCTION: 0.5,
            PRINCIPAL_PHOTOGRAPHY: 1.5, // Most expensive
            POST_PRODUCTION: 0.4,
            DISTRIBUTION_PREP: 0.2
        };
        
        baseCost *= (phaseMultipliers[film.phase] || 1.0);
        
        // Efficiency modifiers
        const efficiencyMultiplier = 0.5 + (film.crewEfficiency / 100);
        baseCost *= efficiencyMultiplier;
        
        // Delay penalties
        if (!film.onSchedule) {
            baseCost *= 1.3; // 30% penalty for being behind schedule
        }
        
        // Studio facility bonuses
        if (hasRelevantBacklot(film.genre, gameState)) {
            baseCost *= 0.85; // 15% savings with appropriate backlot
        }
        
        return Math.floor(baseCost);
    }
    
    /**
     * Process phase-specific production logic
     */
    function processPhaseLogic(film, gameState) {
        switch (film.phase) {
            case 'DEVELOPMENT':
                // Script polish, casting decisions
                if (film.weeksInCurrentPhase === 1) {
                    assignDirector(film, gameState);
                    doCasting(film, gameState);
                }
                break;
                
            case 'PRE_PRODUCTION':
                // Set construction, rehearsals
                if (Math.random() < 0.2) {
                    // Chance for script improvements
                    film.scriptQuality = Math.min(100, film.scriptQuality + 2);
                }
                break;
                
            case 'PRINCIPAL_PHOTOGRAPHY':
                // Main filming - most events happen here
                updateShootingProgress(film, gameState);
                break;
                
            case 'POST_PRODUCTION':
                // Editing, sound, music
                if (Math.random() < 0.15) {
                    // Chance for quality improvements in editing
                    film.currentQuality = Math.min(100, film.currentQuality + 1);
                }
                break;
                
            case 'DISTRIBUTION_PREP':
                // Marketing, theater booking
                if (film.weeksInCurrentPhase === 1) {
                    prepareDistribution(film, gameState);
                }
                break;
        }
    }
    
    /**
     * Check if a production event should trigger
     */
    function shouldTriggerEvent(film) {
        // Events more likely during principal photography
        let baseChance = film.phase === 'PRINCIPAL_PHOTOGRAPHY' ? 0.4 : 0.1;
        
        // Higher chance if already having problems
        if (!film.onSchedule || !film.onBudget) {
            baseChance *= 1.5;
        }
        
        // Lower chance with experienced director
        if (film.directorSkill > 80) {
            baseChance *= 0.7;
        }
        
        return Math.random() < baseChance;
    }
    
    /**
     * Trigger a random production event
     */
    function triggerProductionEvent(film, gameState) {
        const eventTypes = [
            'WEATHER_DELAY',
            'ACTOR_INJURY',
            'EQUIPMENT_FAILURE', 
            'SCRIPT_DISPUTE',
            'BUDGET_CRISIS',
            'CREATIVE_CONFLICT',
            'UNION_ISSUE',
            'LOCATION_PROBLEM',
            'STAR_TANTRUM',
            'TECHNICAL_DIFFICULTY'
        ];
        
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const event = generateEvent(eventType, film, gameState);
        
        film.productionEvents.push({
            week: film.totalWeeks,
            type: eventType,
            description: event.description,
            timestamp: new Date(gameState.currentDate)
        });
        
        // Show event to player
        showProductionEvent(event, film, gameState);
    }
    
    /**
     * Generate specific production events with choices
     */
    function generateEvent(eventType, film, gameState) {
        const events = {
            WEATHER_DELAY: {
                title: `Weather Delays on "${film.title}"`,
                description: `Heavy rain has shut down outdoor filming for "${film.title}". The crew is idle but still being paid.`,
                choices: [
                    {
                        text: 'Wait it out (Pay idle crew $3,000/day)',
                        cost: 3000 * 5, // Assume 5 days
                        effect: { delayWeeks: 1, crewMorale: -5 }
                    },
                    {
                        text: 'Shoot interior scenes (Reorganize schedule)',
                        cost: 2000, // Scheduling costs
                        effect: { quality: -2, crewEfficiency: -5 }
                    },
                    {
                        text: 'Move to studio backlot (Weather-proof but expensive)',
                        cost: 8000,
                        effect: { quality: -3 }
                    }
                ]
            },
            
            ACTOR_INJURY: {
                title: `Lead Actor Injured on "${film.title}"`,
                description: `${film.leadActors[0]?.name || 'The lead actor'} has been injured during a stunt scene. Doctor recommends 1-2 weeks recovery.`,
                choices: [
                    {
                        text: 'Pause production until recovery',
                        cost: film.weeklyBurnRate * 1.5, // 1.5 weeks of costs
                        effect: { delayWeeks: 2 }
                    },
                    {
                        text: 'Use body double and shoot around injury',
                        cost: 5000, // Double costs + rescheduling
                        effect: { quality: -5, crewEfficiency: -10 }
                    },
                    {
                        text: 'Push through filming (Risk lawsuit)',
                        cost: 0,
                        effect: { quality: -3, risk: 'lawsuit' }
                    }
                ]
            },
            
            BUDGET_CRISIS: {
                title: `Budget Crisis on "${film.title}"`,
                description: `Production costs have spiraled out of control. You're 25% over budget with 3 weeks of filming remaining.`,
                choices: [
                    {
                        text: 'Secure emergency funding',
                        cost: film.originalBudget * 0.3,
                        effect: { debt: film.originalBudget * 0.3 }
                    },
                    {
                        text: 'Cut scenes and wrap early',
                        cost: 0,
                        effect: { quality: -15, delayWeeks: -1 }
                    },
                    {
                        text: 'Negotiate with crew for deferred payment',
                        cost: film.originalBudget * 0.1,
                        effect: { crewMorale: -20, reputation: -5 }
                    }
                ]
            },
            
            STAR_TANTRUM: {
                title: `Star Demands on "${film.title}"`,
                description: `${film.leadActors[0]?.name || 'Your lead actor'} is refusing to work unless their dressing room demands are met and they receive script approval.`,
                choices: [
                    {
                        text: 'Give in to demands (Set dangerous precedent)',
                        cost: 15000,
                        effect: { starPower: 5, otherActorMorale: -10 }
                    },
                    {
                        text: 'Negotiate compromise',
                        cost: 7000,
                        effect: { delayWeeks: 1, crewEfficiency: -5 }
                    },
                    {
                        text: 'Stand firm and risk walkout',
                        cost: 0,
                        effect: { risk: 'star_walkout', quality: -10 }
                    }
                ]
            },
            
            CREATIVE_CONFLICT: {
                title: `Creative Differences on "${film.title}"`,
                description: `The director and lead actor are in heated disagreement about character motivation. Production has stopped while they argue.`,
                choices: [
                    {
                        text: 'Side with the director',
                        cost: 0,
                        effect: { directorLoyalty: 10, actorMorale: -15 }
                    },
                    {
                        text: 'Side with the actor',
                        cost: 0,
                        effect: { actorMorale: 10, directorMorale: -15 }
                    },
                    {
                        text: 'Hire script doctor to mediate ($5,000)',
                        cost: 5000,
                        effect: { delayWeeks: 1, quality: 3 }
                    }
                ]
            }
        };
        
        return events[eventType] || events.WEATHER_DELAY;
    }
    
    /**
     * Show production event modal to player
     */
    function showProductionEvent(event, film, gameState) {
        // Store event for resolution BEFORE building modal
        window._currentProductionEvent = {
            event: event,
            film: film,
            gameState: gameState
        };

        const modalDiv = document.createElement('div');
        modalDiv.className = 'production-event';

        const title = document.createElement('h2');
        title.className = 'event-title';
        title.textContent = event.title;
        modalDiv.appendChild(title);

        const desc = document.createElement('p');
        desc.className = 'event-description';
        desc.textContent = event.description;
        modalDiv.appendChild(desc);

        const choicesDiv = document.createElement('div');
        choicesDiv.className = 'event-choices';

        event.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.dataset.choiceIndex = index;

            const choiceText = document.createElement('div');
            choiceText.className = 'choice-text';
            choiceText.textContent = choice.text;
            btn.appendChild(choiceText);

            const choiceCost = document.createElement('div');
            choiceCost.className = 'choice-cost';
            choiceCost.textContent = `Cost: $${choice.cost.toLocaleString()}`;
            btn.appendChild(choiceCost);

            if (choice.effect) {
                const choiceEffect = document.createElement('div');
                choiceEffect.className = 'choice-effect';
                const effects = [];
                if (choice.effect.quality) effects.push(`Quality: ${choice.effect.quality > 0 ? '+' : ''}${choice.effect.quality}`);
                if (choice.effect.delayWeeks) effects.push(`Delay: ${choice.effect.delayWeeks} weeks`);
                if (effects.length > 0) {
                    choiceEffect.textContent = effects.join(' | ');
                    btn.appendChild(choiceEffect);
                }
            }

            btn.addEventListener('click', () => {
                resolveEvent(film.id, index, event.title);
            });

            choicesDiv.appendChild(btn);
        });

        modalDiv.appendChild(choicesDiv);

        const statusDiv = document.createElement('div');
        statusDiv.className = 'current-status';
        statusDiv.innerHTML = `
            <p><strong>Current Budget:</strong> $${film.spentToDate.toLocaleString()} / $${(film.currentBudget || film.originalBudget).toLocaleString()}</p>
            <p><strong>Weeks in Production:</strong> ${film.totalWeeks}</p>
            <p><strong>Current Phase:</strong> ${(film.phase || '').replace('_', ' ')}</p>
        `;
        modalDiv.appendChild(statusDiv);

        if (window.HollywoodMogul) {
            const modalOverlay = document.getElementById('modal-overlay');
            const modalContent = document.getElementById('modal-content');
            if (modalOverlay && modalContent) {
                modalContent.innerHTML = '';
                modalContent.appendChild(modalDiv);
                modalOverlay.classList.remove('hidden');
            }
        }
    }
    
    /**
     * Resolve player's choice in production event
     */
    function resolveEvent(filmId, choiceIndex, eventTitle) {
        const eventData = window._currentProductionEvent;
        if (!eventData) return;
        
        const { event, film, gameState } = eventData;
        const choice = event.choices[choiceIndex];
        
        // Apply financial cost
        gameState.cash -= choice.cost;
        film.spentToDate += choice.cost;
        
        // Apply effects
        if (choice.effect.delayWeeks) {
            film.delayWeeks += choice.effect.delayWeeks;
            if (choice.effect.delayWeeks > 0) {
                film.onSchedule = false;
            }
        }
        
        if (choice.effect.quality) {
            film.currentQuality = Math.max(0, Math.min(100, film.currentQuality + choice.effect.quality));
        }
        
        if (choice.effect.crewEfficiency) {
            film.crewEfficiency = Math.max(20, Math.min(100, film.crewEfficiency + choice.effect.crewEfficiency));
        }
        
        // Update budget status
        updateBudgetStatus(film);
        
        // Add resolution alert
        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'production',
                icon: '🎬',
                message: `"${film.title}": ${choice.text} - Cost: $${choice.cost.toLocaleString()}`,
                priority: 'medium'
            });
            
            window.HollywoodMogul.closeModal();
        }
        
        // Increment crisis count
        film.crisisCount += 1;
        
        // Clean up
        delete window._currentProductionEvent;
        
        console.log(`Production event resolved for "${film.title}": ${choice.text}`);
    }
    
    /**
     * Advance film to next production phase
     */
    function advanceToNextPhase(film, gameState) {
        const phases = Object.keys(PRODUCTION_PHASES);
        const currentIndex = phases.findIndex(phase => phase === film.phase);
        
        if (currentIndex < phases.length - 1) {
            const nextPhase = phases[currentIndex + 1];
            film.phase = nextPhase;
            film.weeksInCurrentPhase = 0;
            
            // Update status description
            film.status = PRODUCTION_PHASES[nextPhase].description;
            
            // Add phase transition alert
            if (window.HollywoodMogul) {
                window.HollywoodMogul.addAlert({
                    type: 'production',
                    icon: '🎭',
                    message: `"${film.title}" has advanced to ${PRODUCTION_PHASES[nextPhase].name}`,
                    priority: 'medium'
                });
            }
            
            console.log(`"${film.title}" advanced to ${nextPhase}`);
        } else {
            // Film completed!
            completeProduction(film, gameState);
        }
    }
    
    /**
     * Complete production and prepare for distribution
     */
    function completeProduction(film, gameState) {
        film.phase = 'COMPLETED';
        film.completion = 100;
        film.status = 'Ready for Distribution';
        
        // Calculate final quality based on production events
        film.finalQuality = calculateFinalQuality(film);
        
        // Move from active to completed
        const index = gameState.activeFilms.findIndex(f => f.id === film.id);
        if (index >= 0) {
            gameState.activeFilms.splice(index, 1);
            gameState.completedFilms.push(film);
        }
        
        // Update statistics
        gameState.stats.filmsProduced += 1;
        
        // Show completion notification
        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'success',
                icon: '🏆',
                message: `"${film.title}" production complete! Final cost: $${film.spentToDate.toLocaleString()}`,
                priority: 'high'
            });
        }
        
        // Show distribution options
        setTimeout(() => {
            showDistributionOptions(film, gameState);
        }, 2000);
        
        console.log(`"${film.title}" production completed. Final quality: ${film.finalQuality}`);
    }
    
    /**
     * Show distribution strategy options
     */
    function showDistributionOptions(film, gameState) {
        const projectedEarnings = calculateProjectedEarnings(film, gameState);
        
        const modalContent = `
            <div class="distribution-options">
                <h2>"${film.title}" - Choose Distribution Strategy</h2>
                <div class="film-summary">
                    <p><strong>Final Production Cost:</strong> $${film.spentToDate.toLocaleString()}</p>
                    <p><strong>Film Quality:</strong> ${film.finalQuality}/100</p>
                    <p><strong>Genre:</strong> ${film.genre}</p>
                    <p><strong>Production Issues:</strong> ${film.crisisCount} major events</p>
                </div>
                
                <div class="distribution-choices">
                    <div class="distribution-option">
                        <h3>Wide Release (500+ Theaters)</h3>
                        <p>Marketing Cost: <strong>$25,000</strong></p>
                        <p>Projected Gross: <strong>$${projectedEarnings.wide.toLocaleString()}</strong></p>
                        <p>Your Revenue (after theater cut): <strong>$${(projectedEarnings.wide * 0.5).toLocaleString()}</strong></p>
                        <button onclick="ProductionSystem.chooseDistribution(${film.id}, 'wide')" class="action-btn primary">
                            Go Wide
                        </button>
                    </div>
                    
                    <div class="distribution-option">
                        <h3>Limited Release (100 Theaters)</h3>
                        <p>Marketing Cost: <strong>$8,000</strong></p>
                        <p>Projected Gross: <strong>$${projectedEarnings.limited.toLocaleString()}</strong></p>
                        <p>Your Revenue (after theater cut): <strong>$${(projectedEarnings.limited * 0.6).toLocaleString()}</strong></p>
                        <button onclick="ProductionSystem.chooseDistribution(${film.id}, 'limited')" class="action-btn secondary">
                            Limited Release
                        </button>
                    </div>
                    
                    <div class="distribution-option">
                        <h3>Sell Distribution Rights</h3>
                        <p>Immediate Payment: <strong>$${projectedEarnings.sellRights.toLocaleString()}</strong></p>
                        <p>No marketing costs, no upside potential</p>
                        <p>Guaranteed money right now</p>
                        <button onclick="ProductionSystem.chooseDistribution(${film.id}, 'sell')" class="action-btn">
                            Sell Rights
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalContent);
        }
        
        // Store film reference for distribution choice
        window._distributionFilm = film;
        window._distributionGameState = gameState;
    }
    
    /**
     * Handle distribution choice
     */
    function chooseDistribution(filmId, strategy) {
        const film = window._distributionFilm;
        const gameState = window._distributionGameState;
        
        if (!film || film.id !== filmId) return;
        
        const projectedEarnings = calculateProjectedEarnings(film, gameState);
        
        switch (strategy) {
            case 'wide':
                film.distributionStrategy = 'wide';
                film.marketingBudget = 25000;
                film.theaterCount = 500;
                gameState.cash -= 25000;
                scheduleBoxOfficeRun(film, gameState, projectedEarnings.wide);
                break;
                
            case 'limited':
                film.distributionStrategy = 'limited';
                film.marketingBudget = 8000;
                film.theaterCount = 100;
                gameState.cash -= 8000;
                scheduleBoxOfficeRun(film, gameState, projectedEarnings.limited);
                break;
                
            case 'sell':
                film.distributionStrategy = 'sell_rights';
                const payment = projectedEarnings.sellRights;
                gameState.cash += payment;
                film.studioRevenue = payment;
                film.status = 'Rights Sold';
                
                if (window.HollywoodMogul) {
                    window.HollywoodMogul.addAlert({
                        type: 'financial',
                        icon: '💰',
                        message: `"${film.title}" rights sold for $${payment.toLocaleString()}`,
                        priority: 'high'
                    });
                }
                break;
        }
        
        if (window.HollywoodMogul) {
            window.HollywoodMogul.closeModal();
        }
        
        // Clean up
        delete window._distributionFilm;
        delete window._distributionGameState;
    }
    
    /**
     * HELPER FUNCTIONS
     */
    
    function generateFilmId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    }
    
    function calculateWeeklyBurn(script) {
        // Base weekly cost calculation
        const baseBurn = script.budget / 20; // Assume 20 weeks total production
        return Math.floor(baseBurn);
    }
    
    function calculateShootingDays(budget) {
        // Higher budget = more shooting days
        if (budget < 50000) return 12;      // B-movie
        if (budget < 100000) return 18;     // Standard
        if (budget < 200000) return 25;     // Prestige
        return 35;                          // Epic
    }
    
    function getGenreHeat(genre, year) {
        // Use TimeSystem for era-specific genre popularity
        if (window.TimeSystem) {
            const modifiers = window.TimeSystem.getEraGenreModifiers(year);
            return (modifiers[genre] || 1.0) * 100;
        }
        return 100; // Default neutral
    }
    
    function assignDirector(film, gameState) {
        // Placeholder - will be enhanced when talent system is built
        const directors = [
            { name: 'Frank Capra', skill: 90, specialty: 'drama' },
            { name: 'Howard Hawks', skill: 85, specialty: 'adventure' },
            { name: 'Billy Wilder', skill: 88, specialty: 'comedy' },
            { name: 'John Ford', skill: 92, specialty: 'western' }
        ];
        
        const director = directors[Math.floor(Math.random() * directors.length)];
        film.director = director;
        film.directorSkill = director.skill;
        
        // Genre specialty bonus
        if (director.specialty === film.genre.toLowerCase()) {
            film.directorSkill += 10;
        }
    }
    
    function doCasting(film, gameState) {
        // Placeholder casting - will be enhanced with talent system
        const actors = [
            { name: 'Clark Gable', starPower: 95, chemistry: 80 },
            { name: 'Greta Garbo', starPower: 90, chemistry: 85 },
            { name: 'James Stewart', starPower: 80, chemistry: 90 },
            { name: 'Katharine Hepburn', starPower: 88, chemistry: 75 }
        ];
        
        // Assign random lead actor for now
        const leadActor = actors[Math.floor(Math.random() * actors.length)];
        film.leadActors.push(leadActor);
        film.castChemistry = leadActor.chemistry;
    }
    
    function hasRelevantBacklot(genre, gameState) {
        const backlotMap = {
            'western': gameState.backlots.western,
            'crime': gameState.backlots.nyc,
            'gangster': gameState.backlots.nyc,
            'adventure': gameState.backlots.jungle
        };
        
        return backlotMap[genre.toLowerCase()] || false;
    }
    
    function updateBudgetStatus(film) {
        const overagePercent = ((film.spentToDate - film.originalBudget) / film.originalBudget) * 100;
        film.onBudget = overagePercent <= 10; // 10% tolerance
        
        if (overagePercent > 25) {
            film.currentBudget = film.spentToDate * 1.2; // Adjust budget upward
        }
    }
    
    function updateCompletion(film) {
        const phases = Object.keys(PRODUCTION_PHASES);
        const currentIndex = phases.findIndex(phase => phase === film.phase);
        const totalPhases = phases.length;
        
        const phaseProgress = film.weeksInCurrentPhase / PRODUCTION_PHASES[film.phase].duration;
        film.completion = Math.floor(((currentIndex + phaseProgress) / totalPhases) * 100);
    }
    
    function isPhaseComplete(film) {
        const phaseDuration = PRODUCTION_PHASES[film.phase]?.duration || 1;
        let adjustedDuration = phaseDuration;
        
        // Adjust duration for delays
        if (film.delayWeeks > 0) {
            adjustedDuration += Math.floor(film.delayWeeks);
        }
        
        return film.weeksInCurrentPhase >= adjustedDuration;
    }
    
    function updateShootingProgress(film, gameState) {
        // Track daily progress during principal photography
        const dailyProgress = 100 / film.shootingDays;
        film.shootingProgress = (film.shootingProgress || 0) + (dailyProgress / 7); // Per week
    }
    
    function prepareDistribution(film, gameState) {
        // Set estimated release date
        film.releaseDate = new Date(gameState.currentDate);
        film.releaseDate.setDate(film.releaseDate.getDate() + 14); // 2 weeks from now
    }
    
    function calculateFinalQuality(film) {
        let quality = film.scriptQuality;
        
        // Director skill impact
        quality += (film.directorSkill - 70) * 0.2;
        
        // Cast chemistry impact
        quality += (film.castChemistry - 70) * 0.1;
        
        // Production issues impact
        quality -= film.crisisCount * 3;
        
        // Crew efficiency impact
        quality += (film.crewEfficiency - 70) * 0.1;
        
        // Budget issues impact
        if (!film.onBudget) {
            quality -= 5;
        }
        
        if (!film.onSchedule) {
            quality -= 3;
        }
        
        return Math.max(10, Math.min(100, Math.floor(quality)));
    }
    
    function calculateProjectedEarnings(film, gameState) {
        const baseEarnings = film.originalBudget * 1.5; // Conservative 1.5x budget
        const qualityMultiplier = film.finalQuality / 70; // 70 is baseline
        const genreMultiplier = film.genreHeat / 100;
        
        const wide = Math.floor(baseEarnings * qualityMultiplier * genreMultiplier * 1.5);
        const limited = Math.floor(baseEarnings * qualityMultiplier * genreMultiplier * 0.8);
        const sellRights = Math.floor(film.originalBudget * 0.6); // 60% of budget
        
        return { wide, limited, sellRights };
    }
    
    function scheduleBoxOfficeRun(film, gameState, projectedGross) {
        film.inTheaters = true;
        film.theaterWeek = 1;
        film.projectedGross = projectedGross;

        // Set phase so BoxOfficeSystem can find this film
        film.phase = 'in_theaters';

        // Set up distribution data for BoxOfficeSystem.processWeeklyBoxOffice
        const strategy = film.distributionStrategy === 'limited' ? 'limited' : 'wide';
        if (window.BoxOfficeSystem) {
            const boxOfficeResults = window.BoxOfficeSystem.simulateWeeklyBoxOffice(
                film, strategy, projectedGross
            );
            film.distribution = {
                strategy: strategy,
                boxOfficeResults: boxOfficeResults,
                currentWeek: 0,
                releaseDate: new Date(gameState.currentDate),
                marketingCost: film.marketingBudget || 0
            };
        }

        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'release',
                icon: '🎭',
                message: `"${film.title}" now in theaters! ${film.theaterCount} locations.`,
                priority: 'high'
            });
        }
    }

    /**
     * Greenlight a script and start production
     * Called from UI when player selects a script
     */
    function greenlightScript(scriptId) {
        // Get game state
        const gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        if (!gameState) {
            return {
                success: false,
                message: 'Game state not available'
            };
        }

        // Get script from library
        const script = window.ScriptLibrary ? window.ScriptLibrary.getScriptById(scriptId) : null;
        if (!script) {
            return {
                success: false,
                message: 'Script not found'
            };
        }

        // Check if player can afford the budget
        if (gameState.cash < script.budget) {
            return {
                success: false,
                message: `Insufficient funds. Need $${script.budget.toLocaleString()}, have $${gameState.cash.toLocaleString()}`
            };
        }

        // Start production (handles budget deduction and adding to activeFilms)
        if (!gameState.activeFilms) {
            gameState.activeFilms = [];
        }
        const film = startProduction(script, gameState);

        // Track transaction
        if (window.FinancialSystem && typeof window.FinancialSystem.addTransaction === 'function') {
            window.FinancialSystem.addTransaction(-script.budget, `Greenlit "${script.title}"`);
        }

        // Remove script from available scripts
        if (window.ScriptLibrary && typeof window.ScriptLibrary.removeScript === 'function') {
            window.ScriptLibrary.removeScript(scriptId);
        }

        return {
            success: true,
            film: film,
            message: `Production begins on "${film.title}"`
        };
    }

    /**
     * Public API
     */
    return {
        startProduction,
        processWeeklyProduction,
        resolveEvent,
        chooseDistribution,
        greenlightScript,

        // Helper functions for external systems
        calculateWeeklyBurn,
        calculateShootingDays,
        getGenreHeat,

        // Constants for other systems
        PRODUCTION_PHASES,
        EVENT_PROBABILITIES
    };
})();