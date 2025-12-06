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

            // Quality Components (for detailed breakdown)
            qualityComponents: {
                script: script.quality,
                direction: 0,
                performances: 0,
                productionValue: 0,
                editing: 0
            },

            // Reshoot tracking
            reshootHistory: [],
            hasTestScreening: false,
            testScreeningResults: null
            
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
        
        // Spend initial development costs
        const developmentCost = Math.floor(film.originalBudget * 0.1);
        gameState.cash -= developmentCost;
        film.spentToDate += developmentCost;
        
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
            
            // Calculate weekly costs
            const weeklyCost = calculateWeeklyCost(film, gameState);
            gameState.cash -= weeklyCost;
            film.spentToDate += weeklyCost;
            
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

                // Check for production decision points
                checkProductionDecisionPoints(film, gameState);
                break;
                
            case 'POST_PRODUCTION':
                // Editing, sound, music
                if (Math.random() < 0.15) {
                    // Chance for quality improvements in editing
                    film.currentQuality = Math.min(100, film.currentQuality + 1);
                }

                // Trigger test screening at midpoint of post-production
                if (film.weeksInCurrentPhase === 3 && !film.hasTestScreening) {
                    triggerTestScreening(film, gameState);
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
        let modalContent = `
            <div class="production-event">
                <h2 class="event-title">${event.title}</h2>
                <p class="event-description">${event.description}</p>
                
                <div class="event-choices">
                    ${event.choices.map((choice, index) => `
                        <button class="choice-btn" onclick="ProductionSystem.resolveEvent(${film.id}, ${index}, '${event.title}')" 
                                data-cost="${choice.cost}">
                            <div class="choice-text">${choice.text}</div>
                            <div class="choice-cost">Cost: $${choice.cost.toLocaleString()}</div>
                        </button>
                    `).join('')}
                </div>
                
                <div class="current-status">
                    <p><strong>Current Budget:</strong> $${film.spentToDate.toLocaleString()} / $${film.currentBudget.toLocaleString()}</p>
                    <p><strong>Weeks in Production:</strong> ${film.totalWeeks}</p>
                    <p><strong>Current Phase:</strong> ${film.phase.replace('_', ' ')}</p>
                </div>
            </div>
        `;
        
        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalContent);
        }
        
        // Store event for resolution
        window._currentProductionEvent = {
            event: event,
            film: film,
            gameState: gameState
        };
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
     * Check for production decision points during principal photography
     */
    function checkProductionDecisionPoints(film, gameState) {
        // Decision points at weeks 2, 6, 10, 14 of principal photography
        const week = film.weeksInCurrentPhase;
        const decisionWeeks = [2, 6, 10, 14];

        if (!decisionWeeks.includes(week)) return;

        // Mark that we've shown this decision
        if (!film.decisionPointsShown) {
            film.decisionPointsShown = [];
        }

        if (film.decisionPointsShown.includes(week)) return;
        film.decisionPointsShown.push(week);

        // Show appropriate decision point
        switch(week) {
            case 2:
                showCastingConfirmationDecision(film, gameState);
                break;
            case 6:
                showFirstCutScreeningDecision(film, gameState);
                break;
            case 10:
                showMarketingStrategyDecision(film, gameState);
                break;
            case 14:
                showFinalCutDecision(film, gameState);
                break;
        }
    }

    /**
     * Decision Point 1: Casting Confirmation (Week 2)
     */
    function showCastingConfirmationDecision(film, gameState) {
        const leadActor = film.leadActors[0]?.name || 'Unknown Actor';

        const modalContent = `
            <div class="production-decision">
                <h2>Casting Confirmation - "${film.title}"</h2>
                <p class="decision-context">Week 2 of shooting. Early dailies show ${leadActor}'s performance.</p>

                <div class="current-status">
                    <p><strong>Lead Actor:</strong> ${leadActor}</p>
                    <p><strong>Cast Chemistry:</strong> ${film.castChemistry}/100</p>
                    <p><strong>Current Quality:</strong> ${film.currentQuality}/100</p>
                </div>

                <div class="decision-choices">
                    <button class="choice-btn" onclick="ProductionSystem.resolveDecision(${film.id}, 'casting', 0)">
                        <div class="choice-title">Keep Current Cast</div>
                        <div class="choice-desc">Trust your initial instincts</div>
                        <div class="choice-cost">No cost</div>
                    </button>

                    <button class="choice-btn" onclick="ProductionSystem.resolveDecision(${film.id}, 'casting', 1)">
                        <div class="choice-title">Recast Supporting Roles</div>
                        <div class="choice-desc">Try to improve chemistry with new supporting cast</div>
                        <div class="choice-cost">Cost: $5,000 | +1 week delay</div>
                    </button>

                    <button class="choice-btn danger" onclick="ProductionSystem.resolveDecision(${film.id}, 'casting', 2)">
                        <div class="choice-title">Replace Lead Actor</div>
                        <div class="choice-desc">Risky move - restart shooting with new lead</div>
                        <div class="choice-cost">Cost: $15,000 | +3 weeks delay</div>
                    </button>
                </div>
            </div>
        `;

        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalContent);
        }
    }

    /**
     * Decision Point 2: First Cut Screening (Week 6)
     */
    function showFirstCutScreeningDecision(film, gameState) {
        const qualityPreview = film.currentQuality + Math.floor(Math.random() * 10 - 5);

        const modalContent = `
            <div class="production-decision">
                <h2>First Cut Screening - "${film.title}"</h2>
                <p class="decision-context">Internal screening of rough footage. The film is taking shape.</p>

                <div class="quality-preview">
                    <h3>Early Quality Estimate: ${qualityPreview}/100</h3>
                    <div class="quality-bar">
                        <div class="quality-fill" style="width: ${qualityPreview}%"></div>
                    </div>
                </div>

                <div class="decision-choices">
                    <button class="choice-btn" onclick="ProductionSystem.resolveDecision(${film.id}, 'firstcut', 0)">
                        <div class="choice-title">Proceed As Planned</div>
                        <div class="choice-desc">Footage looks good, stay on schedule</div>
                        <div class="choice-cost">No cost</div>
                    </button>

                    <button class="choice-btn" onclick="ProductionSystem.resolveDecision(${film.id}, 'firstcut', 1)">
                        <div class="choice-title">Add Polish Scenes</div>
                        <div class="choice-desc">Shoot additional character moments</div>
                        <div class="choice-cost">Cost: $8,000 | 60% chance +0.5 quality</div>
                    </button>

                    <button class="choice-btn" onclick="ProductionSystem.resolveDecision(${film.id}, 'firstcut', 2)">
                        <div class="choice-title">Concerned - Add Safety Coverage</div>
                        <div class="choice-desc">Shoot alternate takes and angles for editing options</div>
                        <div class="choice-cost">Cost: $12,000 | +1 week | Better editing options later</div>
                    </button>
                </div>
            </div>
        `;

        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalContent);
        }
    }

    /**
     * Decision Point 3: Marketing Strategy (Week 10)
     */
    function showMarketingStrategyDecision(film, gameState) {
        const modalContent = `
            <div class="production-decision">
                <h2>Marketing Strategy - "${film.title}"</h2>
                <p class="decision-context">Shooting wraps soon. Time to plan your release strategy.</p>

                <div class="current-status">
                    <p><strong>Genre:</strong> ${film.genre}</p>
                    <p><strong>Current Quality:</strong> ${film.currentQuality}/100</p>
                    <p><strong>Budget Spent:</strong> $${film.spentToDate.toLocaleString()}</p>
                </div>

                <div class="decision-choices">
                    <button class="choice-btn" onclick="ProductionSystem.resolveDecision(${film.id}, 'marketing', 0)">
                        <div class="choice-title">Wide Release Strategy</div>
                        <div class="choice-desc">500+ theaters, big marketing push</div>
                        <div class="choice-cost">Reserve $25,000 for marketing</div>
                    </button>

                    <button class="choice-btn" onclick="ProductionSystem.resolveDecision(${film.id}, 'marketing', 1)">
                        <div class="choice-title">Limited Release Strategy</div>
                        <div class="choice-desc">100 select theaters, word-of-mouth</div>
                        <div class="choice-cost">Reserve $8,000 for marketing</div>
                    </button>

                    <button class="choice-btn" onclick="ProductionSystem.resolveDecision(${film.id}, 'marketing', 2)">
                        <div class="choice-title">Platform Release</div>
                        <div class="choice-desc">Start small, expand if successful</div>
                        <div class="choice-cost">Reserve $15,000 for marketing</div>
                    </button>
                </div>
            </div>
        `;

        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalContent);
        }
    }

    /**
     * Decision Point 4: Final Cut (Week 14)
     */
    function showFinalCutDecision(film, gameState) {
        const canAffordReshoots = gameState.cash >= 20000;

        const modalContent = `
            <div class="production-decision">
                <h2>Final Cut Decision - "${film.title}"</h2>
                <p class="decision-context">Last chance to make changes before post-production.</p>

                <div class="current-status">
                    <p><strong>Current Quality:</strong> ${film.currentQuality}/100</p>
                    <p><strong>Available Cash:</strong> $${gameState.cash.toLocaleString()}</p>
                    <p><strong>Delay Tolerance:</strong> ${film.onSchedule ? 'On Schedule' : 'Behind Schedule'}</p>
                </div>

                <div class="decision-choices">
                    <button class="choice-btn" onclick="ProductionSystem.resolveDecision(${film.id}, 'finalcut', 0)">
                        <div class="choice-title">Accept Current Cut</div>
                        <div class="choice-desc">Move to post-production as planned</div>
                        <div class="choice-cost">No cost</div>
                    </button>

                    <button class="choice-btn ${!canAffordReshoots ? 'disabled' : ''}"
                            onclick="ProductionSystem.resolveDecision(${film.id}, 'finalcut', 1)"
                            ${!canAffordReshoots ? 'disabled' : ''}>
                        <div class="choice-title">Minor Reshoots</div>
                        <div class="choice-desc">Fix a few problematic scenes</div>
                        <div class="choice-cost">Cost: $20,000 | +2 weeks | 60% chance +0.5 quality</div>
                    </button>

                    <button class="choice-btn ${gameState.cash < 50000 ? 'disabled' : ''}"
                            onclick="ProductionSystem.resolveDecision(${film.id}, 'finalcut', 2)"
                            ${gameState.cash < 50000 ? 'disabled' : ''}>
                        <div class="choice-title">Major Reshoots</div>
                        <div class="choice-desc">Re-film entire sequences</div>
                        <div class="choice-cost">Cost: $50,000 | +4 weeks | 70% chance +1.0 quality</div>
                    </button>
                </div>
            </div>
        `;

        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalContent);
        }
    }

    /**
     * Resolve production decision point
     */
    function resolveDecision(filmId, decisionType, choiceIndex) {
        const film = window._currentProductionFilm ||
                      window.HollywoodMogul.getGameState().activeFilms.find(f => f.id === filmId);
        const gameState = window.HollywoodMogul.getGameState();

        if (!film) return;

        let message = '';

        switch(decisionType) {
            case 'casting':
                message = resolveCastingDecision(film, gameState, choiceIndex);
                break;
            case 'firstcut':
                message = resolveFirstCutDecision(film, gameState, choiceIndex);
                break;
            case 'marketing':
                message = resolveMarketingDecision(film, gameState, choiceIndex);
                break;
            case 'finalcut':
                message = resolveFinalCutDecision(film, gameState, choiceIndex);
                break;
        }

        if (window.HollywoodMogul) {
            window.HollywoodMogul.closeModal();
            window.HollywoodMogul.addAlert({
                type: 'production',
                icon: '🎬',
                message: message,
                priority: 'medium'
            });
        }
    }

    function resolveCastingDecision(film, gameState, choice) {
        switch(choice) {
            case 0: // Keep current cast
                return `"${film.title}": Cast confirmed. Moving forward.`;
            case 1: // Recast supporting
                gameState.cash -= 5000;
                film.spentToDate += 5000;
                film.delayWeeks += 1;
                film.castChemistry = Math.min(100, film.castChemistry + 10);
                return `"${film.title}": Supporting cast recast. Chemistry improved!`;
            case 2: // Replace lead
                gameState.cash -= 15000;
                film.spentToDate += 15000;
                film.delayWeeks += 3;
                film.castChemistry = Math.floor(Math.random() * 30) + 60; // Random 60-90
                return `"${film.title}": New lead actor. Major gamble taken!`;
        }
    }

    function resolveFirstCutDecision(film, gameState, choice) {
        switch(choice) {
            case 0: // Proceed as planned
                return `"${film.title}": Proceeding with current footage.`;
            case 1: // Add polish scenes
                gameState.cash -= 8000;
                film.spentToDate += 8000;
                if (Math.random() < 0.6) {
                    film.currentQuality = Math.min(100, film.currentQuality + 5);
                    return `"${film.title}": Polish scenes improved the film!`;
                }
                return `"${film.title}": Polish scenes added, minor improvement.`;
            case 2: // Safety coverage
                gameState.cash -= 12000;
                film.spentToDate += 12000;
                film.delayWeeks += 1;
                film.qualityComponents.editing = Math.min(100, film.qualityComponents.editing + 15);
                return `"${film.title}": Extra coverage will help in editing.`;
        }
    }

    function resolveMarketingDecision(film, gameState, choice) {
        switch(choice) {
            case 0: // Wide release
                film.plannedDistribution = 'wide';
                return `"${film.title}": Planning wide release strategy.`;
            case 1: // Limited release
                film.plannedDistribution = 'limited';
                return `"${film.title}": Planning limited release strategy.`;
            case 2: // Platform release
                film.plannedDistribution = 'platform';
                return `"${film.title}": Planning platform release strategy.`;
        }
    }

    function resolveFinalCutDecision(film, gameState, choice) {
        switch(choice) {
            case 0: // Accept
                return `"${film.title}": Final cut approved. Moving to post-production.`;
            case 1: // Minor reshoots
                return orderReshoots(film.id, 'minor');
            case 2: // Major reshoots
                return orderReshoots(film.id, 'major');
        }
    }

    /**
     * Order reshoots for a film
     */
    function orderReshoots(filmId, scope) {
        const film = window.HollywoodMogul.getGameState().activeFilms.find(f => f.id === filmId);
        const gameState = window.HollywoodMogul.getGameState();

        if (!film) return 'Film not found';

        const reshoot = {
            scope: scope,
            timestamp: new Date(gameState.currentDate),
            week: film.totalWeeks
        };

        if (scope === 'minor') {
            gameState.cash -= 20000;
            film.spentToDate += 20000;
            film.delayWeeks += 2;

            // 60% chance +0.5 quality
            if (Math.random() < 0.6) {
                film.currentQuality = Math.min(100, film.currentQuality + 5);
                film.qualityComponents.performances = Math.min(100, film.qualityComponents.performances + 10);
                reshoot.result = 'improved';
            } else {
                reshoot.result = 'no_change';
            }
        } else if (scope === 'major') {
            gameState.cash -= 50000;
            film.spentToDate += 50000;
            film.delayWeeks += 4;

            // 70% chance +1.0 quality, 30% chance +0.5
            if (Math.random() < 0.7) {
                film.currentQuality = Math.min(100, film.currentQuality + 10);
                film.qualityComponents.performances = Math.min(100, film.qualityComponents.performances + 15);
                reshoot.result = 'major_improvement';
            } else {
                film.currentQuality = Math.min(100, film.currentQuality + 5);
                film.qualityComponents.performances = Math.min(100, film.qualityComponents.performances + 8);
                reshoot.result = 'minor_improvement';
            }
        }

        film.reshootHistory.push(reshoot);
        updateBudgetStatus(film);

        const resultMessages = {
            'improved': `"${film.title}": Minor reshoots successful! Quality improved.`,
            'no_change': `"${film.title}": Minor reshoots completed with minimal impact.`,
            'major_improvement': `"${film.title}": Major reshoots dramatically improved the film!`,
            'minor_improvement': `"${film.title}": Major reshoots helped, but less than hoped.`
        };

        return resultMessages[reshoot.result];
    }

    /**
     * Rush editing to save time
     */
    function rushEdit(filmId) {
        const film = window.HollywoodMogul.getGameState().activeFilms.find(f => f.id === filmId);

        if (!film || film.phase !== 'POST_PRODUCTION') {
            return { success: false, message: 'Film not in post-production' };
        }

        // Reduce post-production time by 2 weeks
        film.weeksInCurrentPhase = Math.min(
            film.weeksInCurrentPhase + 2,
            PRODUCTION_PHASES.POST_PRODUCTION.duration
        );

        // 30% chance to lose quality
        if (Math.random() < 0.3) {
            film.currentQuality = Math.max(0, film.currentQuality - 5);
            film.qualityComponents.editing = Math.max(0, film.qualityComponents.editing - 10);
            return {
                success: true,
                message: `"${film.title}": Rush editing completed but quality suffered.`
            };
        }

        return {
            success: true,
            message: `"${film.title}": Rush editing successful without quality loss!`
        };
    }

    /**
     * Trigger test screening
     */
    function triggerTestScreening(film, gameState) {
        if (!window.TestScreeningSystem) {
            film.hasTestScreening = true;
            return;
        }

        const results = window.TestScreeningSystem.testScreening(film);
        film.hasTestScreening = true;
        film.testScreeningResults = results;

        // Show test screening modal
        window.TestScreeningSystem.showTestScreeningModal(film, results, gameState);
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
            { id: 'clark_gable', name: 'Clark Gable', starPower: 95, chemistry: 80, loyalty: 50 },
            { id: 'bette_davis', name: 'Bette Davis', starPower: 90, chemistry: 85, loyalty: 50 },
            { id: 'james_stewart', name: 'James Stewart', starPower: 88, chemistry: 90, loyalty: 50 },
            { id: 'katharine_hepburn', name: 'Katharine Hepburn', starPower: 90, chemistry: 75, loyalty: 50 }
        ];

        // Assign random lead actor for now
        const leadActor = actors[Math.floor(Math.random() * actors.length)];
        film.leadActors.push(leadActor);
        film.castChemistry = leadActor.chemistry;

        // If using real talent system, get actual loyalty
        if (window.TalentRoster && window.TalentRoster.getActorById) {
            const actualActor = window.TalentRoster.getActorById(leadActor.id);
            if (actualActor) {
                film.leadActors[0].loyalty = actualActor.loyalty || 50;
            }
        }

        // Check for star vehicle condition after casting
        checkStarVehicle(film);
    }

    /**
     * Check if film qualifies as a star vehicle
     * Requires: A-list talent (starPower >= 80) with loyalty >= 70
     */
    function checkStarVehicle(film) {
        film.starVehicle = false;

        // Check lead actors
        if (film.leadActors && film.leadActors.length > 0) {
            film.leadActors.forEach(actor => {
                if (actor.starPower >= 80 && actor.loyalty >= 70) {
                    film.starVehicle = true;
                    film.starVehicleActor = actor.name;
                }
            });
        }

        // Check director (if they have star power equivalent)
        if (film.director && film.director.talent >= 90) {
            // Get director loyalty if using talent system
            if (window.TalentRoster && window.TalentRoster.getDirectorById) {
                const actualDirector = window.TalentRoster.getDirectorById(film.director.id);
                if (actualDirector && actualDirector.loyalty >= 70) {
                    film.starVehicle = true;
                    film.starVehicleDirector = film.director.name;
                }
            }
        }

        // Apply star vehicle bonuses
        if (film.starVehicle) {
            film.starVehicleBonus = {
                boxOfficeBonus: 0.15, // +15% box office
                awardBonus: 0.10 // +10% award consideration
            };

            // Add notification
            if (window.HollywoodMogul && typeof window.HollywoodMogul.addEvent === 'function') {
                window.HollywoodMogul.addEvent({
                    type: 'production',
                    title: 'Star Vehicle Detected!',
                    message: `"${film.title}" is being crafted as a star vehicle for ${film.starVehicleActor || film.starVehicleDirector}!`,
                    severity: 'success'
                });
            }
        }

        return film.starVehicle;
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
        // Initialize quality components if not set
        if (!film.qualityComponents) {
            film.qualityComponents = {
                script: film.scriptQuality,
                direction: 0,
                performances: 0,
                productionValue: 0,
                editing: 0
            };
        }

        // Calculate each component
        // 1. Script (base quality)
        film.qualityComponents.script = film.scriptQuality;

        // 2. Direction (based on director skill)
        film.qualityComponents.direction = Math.max(0, Math.min(100,
            film.directorSkill + (film.onSchedule ? 5 : -10)
        ));

        // 3. Performances (based on cast chemistry)
        film.qualityComponents.performances = Math.max(0, Math.min(100,
            film.castChemistry - (film.crisisCount * 5)
        ));

        // 4. Production Value (based on budget and efficiency)
        const budgetQuality = Math.min(100, (film.originalBudget / 50000) * 40 + 40);
        film.qualityComponents.productionValue = Math.max(0, Math.min(100,
            budgetQuality * (film.crewEfficiency / 100) - (film.onBudget ? 0 : 15)
        ));

        // 5. Editing (default 60, modified by decisions and reshoots)
        if (film.qualityComponents.editing === 0) {
            film.qualityComponents.editing = 60;
        }

        // Calculate weighted average
        // Script: 30%, Direction: 25%, Performances: 25%, Production: 10%, Editing: 10%
        let finalQuality = (
            film.qualityComponents.script * 0.30 +
            film.qualityComponents.direction * 0.25 +
            film.qualityComponents.performances * 0.25 +
            film.qualityComponents.productionValue * 0.10 +
            film.qualityComponents.editing * 0.10
        );

        // Star vehicle bonus (+10% award consideration translates to quality boost)
        if (film.starVehicle && film.starVehicleBonus) {
            finalQuality += finalQuality * film.starVehicleBonus.awardBonus;
        }

        // Talent morale impact (if talent system available)
        if (window.TalentRoster && window.TalentRoster.getTalentPerformanceModifier) {
            if (film.leadActors && film.leadActors.length > 0) {
                const actorModifier = window.TalentRoster.getTalentPerformanceModifier(film.leadActors[0].id, true);
                finalQuality *= actorModifier;
            }
            if (film.director && film.director.id) {
                const directorModifier = window.TalentRoster.getTalentPerformanceModifier(film.director.id, false);
                finalQuality *= directorModifier;
            }
        }

        return Math.max(10, Math.min(100, Math.floor(finalQuality)));
    }
    
    function calculateProjectedEarnings(film, gameState) {
        const baseEarnings = film.originalBudget * 1.5; // Conservative 1.5x budget
        const qualityMultiplier = film.finalQuality / 70; // 70 is baseline
        const genreMultiplier = film.genreHeat / 100;

        // Star vehicle box office bonus (+15%)
        const starVehicleMultiplier = film.starVehicle ? 1.15 : 1.0;

        const wide = Math.floor(baseEarnings * qualityMultiplier * genreMultiplier * 1.5 * starVehicleMultiplier);
        const limited = Math.floor(baseEarnings * qualityMultiplier * genreMultiplier * 0.8 * starVehicleMultiplier);
        const sellRights = Math.floor(film.originalBudget * 0.6); // 60% of budget

        return { wide, limited, sellRights };
    }
    
    function scheduleBoxOfficeRun(film, gameState, projectedGross) {
        // This will be handled by BoxOfficeSystem in a future update
        film.inTheaters = true;
        film.theaterWeek = 1;
        film.projectedGross = projectedGross;
        
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
     * Public API
     */
    return {
        startProduction,
        processWeeklyProduction,
        resolveEvent,
        chooseDistribution,
        checkStarVehicle,

        // Decision system
        resolveDecision,
        orderReshoots,
        rushEdit,

        // Helper functions for external systems
        calculateWeeklyBurn,
        calculateShootingDays,
        getGenreHeat,

        // Constants for other systems
        PRODUCTION_PHASES,
        EVENT_PROBABILITIES
    };
})();