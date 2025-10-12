/**
 * HOLLYWOOD MOGUL - HISTORICAL EVENTS SYSTEM
 * Major milestones and historical moments from 1933-1949
 * Includes: Hays Code (1934), WWII (1941-1945), HUAC (1947-1949)
 */

window.HistoricalEvents = (function() {
    'use strict';

    // Track which events have already been triggered
    let triggeredEvents = new Set();

    /**
     * Complete historical event database organized by year
     */
    const HISTORICAL_EVENTS = {
        // 1933 - Game Start
        1933: {
            month: 1,
            id: 'game_start',
            title: 'The Golden Age Begins',
            description: 'Welcome to Hollywood in 1933. The talkies have revolutionized cinema, and the studio system is at its peak. But challenges lie ahead...',
            type: 'milestone',
            effects: {},
            modal: {
                title: 'Welcome to Hollywood - 1933',
                content: `
                    <div class="historical-event">
                        <p><strong>The Golden Age of Hollywood has begun.</strong></p>
                        <p>Sound pictures have revolutionized the industry. Studios control everything: production, distribution, and exhibition. You have the opportunity to build a legendary studio.</p>
                        <h3>Key Facts:</h3>
                        <ul>
                            <li>Average film budget: $50,000-$150,000</li>
                            <li>No content restrictions yet (Pre-Code era)</li>
                            <li>Stars earn $1,000-$5,000 per week</li>
                            <li>Roosevelt's New Deal is reshaping America</li>
                        </ul>
                        <p><em>The next 16 years will test your business acumen, artistic vision, and moral compass.</em></p>
                    </div>
                `
            }
        },

        // 1934 - Hays Code Enforcement
        1934: {
            month: 7,
            id: 'hays_code_enforced',
            title: 'Production Code Administration Established',
            description: 'Joseph Breen\'s Production Code Administration begins enforcing strict moral guidelines. All scripts must now be approved before filming.',
            type: 'censorship',
            effects: {
                censorship_active: true,
                reputation_requirement: 40
            },
            modal: {
                title: '⚖️ The Hays Code - July 1934',
                content: `
                    <div class="historical-event">
                        <p><strong>The Production Code Administration (PCA) is now in effect.</strong></p>
                        <p>Joseph Breen will review all scripts for moral content. Films depicting crime, sex, or irreligion must be handled with "good taste."</p>
                        <h3>New Rules:</h3>
                        <ul>
                            <li>❌ No explicit sexuality or nudity</li>
                            <li>❌ Crime cannot be glorified</li>
                            <li>❌ Adultery must be punished</li>
                            <li>❌ Religious mockery forbidden</li>
                            <li>❌ Interracial relationships prohibited</li>
                            <li>⚠️ Scripts must receive PCA seal before filming</li>
                        </ul>
                        <p><strong>Impact on your studio:</strong></p>
                        <ul>
                            <li>Some scripts will now be flagged for content</li>
                            <li>You may need to make script changes</li>
                            <li>Reshoots may be required</li>
                            <li>Films without the seal cannot be exhibited</li>
                        </ul>
                        <p><em>"The Pre-Code era is over. Welcome to the age of moral enforcement."</em></p>
                    </div>
                `
            }
        },

        // 1939 - Gone with the Wind
        1939: {
            month: 12,
            id: 'gone_with_wind',
            title: 'Gone with the Wind Premieres',
            description: 'David O. Selznick\'s epic sets new standards for production values and box office success. The industry is forever changed.',
            type: 'industry',
            effects: {
                audience_expectations: 10,
                epic_genre_boost: 1.2
            },
            modal: {
                title: '🎬 Gone with the Wind - December 1939',
                content: `
                    <div class="historical-event">
                        <p><strong>Gone with the Wind has premiered to unprecedented success.</strong></p>
                        <p>Budget: $3.9 million (enormous for the era)<br>
                        Box office: Expected to gross over $30 million</p>
                        <h3>Industry Impact:</h3>
                        <ul>
                            <li>Audiences now expect higher production values</li>
                            <li>Epic films become more viable</li>
                            <li>Technicolor gains prominence</li>
                            <li>Budget expectations are rising</li>
                        </ul>
                        <p><strong>Effect on your studio:</strong></p>
                        <ul>
                            <li>Audience expectations increased by 10%</li>
                            <li>Epic genre films get 20% box office boost</li>
                            <li>Higher quality standards expected</li>
                        </ul>
                    </div>
                `
            }
        },

        // 1941 - Pearl Harbor / WWII Begins
        1941: {
            month: 12,
            id: 'pearl_harbor',
            title: 'Pearl Harbor - America Enters WWII',
            description: 'The attack on Pearl Harbor brings America into World War II. Hollywood will now play a crucial role in the war effort.',
            type: 'war',
            effects: {
                war_active: true,
                morale_films_boost: 1.3,
                military_censorship: true,
                actor_draft_risk: 0.15
            },
            modal: {
                title: '🎖️ Pearl Harbor - December 7, 1941',
                content: `
                    <div class="historical-event">
                        <p><strong>America is at war.</strong></p>
                        <p>The Japanese attack on Pearl Harbor has thrust the nation into World War II. Hollywood must now support the war effort.</p>
                        <h3>New Reality:</h3>
                        <ul>
                            <li>⚠️ Male actors may be drafted</li>
                            <li>📽️ War bond films are highly encouraged</li>
                            <li>🎖️ Patriotic films receive box office boost</li>
                            <li>❌ Anti-war sentiment is not acceptable</li>
                            <li>⚠️ Material rationing affects production</li>
                            <li>🎬 Film stock may be limited</li>
                        </ul>
                        <p><strong>Your studio's role:</strong></p>
                        <ul>
                            <li>Produce morale-boosting content</li>
                            <li>Support war bond sales</li>
                            <li>Avoid controversial war topics</li>
                            <li>Expect actor availability issues</li>
                        </ul>
                        <p><em>"The motion picture industry is now an essential part of the war effort."</em></p>
                    </div>
                `
            }
        },

        // 1942 - Casablanca
        1942: {
            month: 11,
            id: 'casablanca_premiere',
            title: 'Casablanca Premieres',
            description: 'Warner Bros.\' wartime romance becomes an instant classic, showing how propaganda and art can merge successfully.',
            type: 'industry',
            effects: {
                war_romance_boost: 1.25,
                propaganda_acceptance: 10
            },
            modal: {
                title: '🎬 Casablanca - November 1942',
                content: `
                    <div class="historical-event">
                        <p><strong>Casablanca proves wartime films can be both art and propaganda.</strong></p>
                        <h3>Industry Impact:</h3>
                        <ul>
                            <li>War-themed romance films gain popularity</li>
                            <li>Audiences accept pro-Allied messaging</li>
                            <li>European refugee actors gain prominence</li>
                            <li>Quality doesn't suffer from war themes</li>
                        </ul>
                        <p><strong>Effect on your studio:</strong></p>
                        <ul>
                            <li>War romance genre gets 25% boost</li>
                            <li>Patriotic themes are box office gold</li>
                        </ul>
                    </div>
                `
            }
        },

        // 1945 - WWII Ends
        1945: {
            month: 8,
            id: 'wwii_ends',
            title: 'World War II Ends',
            description: 'Victory over Japan brings WWII to a close. Hollywood must now adapt to peacetime again as soldiers return home.',
            type: 'war',
            effects: {
                war_active: false,
                returning_veterans: true,
                audience_tastes_shift: true,
                actor_draft_risk: 0
            },
            modal: {
                title: '🕊️ Victory - August 1945',
                content: `
                    <div class="historical-event">
                        <p><strong>The war is over. Victory in Europe and the Pacific.</strong></p>
                        <h3>Post-War Hollywood:</h3>
                        <ul>
                            <li>✅ Actors returning from military service</li>
                            <li>✅ Material rationing ending</li>
                            <li>✅ Full production capacity restored</li>
                            <li>⚠️ Audience tastes are changing</li>
                            <li>⚠️ Veterans want darker, realistic stories</li>
                            <li>📉 Propaganda films no longer popular</li>
                        </ul>
                        <p><strong>New Challenges:</strong></p>
                        <ul>
                            <li>Film noir gains popularity</li>
                            <li>Social realism emerges</li>
                            <li>Escapist musicals still work</li>
                            <li>War films must be respectful</li>
                        </ul>
                        <p><em>"The world has changed. Hollywood must change with it."</em></p>
                    </div>
                `
            }
        },

        // 1947 - HUAC Hearings Begin
        1947: {
            month: 10,
            id: 'huac_begins',
            title: 'HUAC Hollywood Hearings Begin',
            description: 'The House Un-American Activities Committee begins investigating Communist influence in Hollywood. The Red Scare has arrived.',
            type: 'political',
            effects: {
                huac_active: true,
                political_risk: 30,
                blacklist_begins: true,
                social_films_risky: true
            },
            modal: {
                title: '⚠️ HUAC Hearings - October 1947',
                content: `
                    <div class="historical-event">
                        <p><strong>The House Un-American Activities Committee is investigating Hollywood.</strong></p>
                        <p>Congress is hunting for Communist sympathizers in the film industry. Careers are being destroyed.</p>
                        <h3>The Hollywood Ten:</h3>
                        <ul>
                            <li>10 screenwriters and directors cited for contempt</li>
                            <li>They refused to answer: "Are you now or have you ever been a member of the Communist Party?"</li>
                            <li>All will be blacklisted and imprisoned</li>
                        </ul>
                        <h3>Impact on Your Studio:</h3>
                        <ul>
                            <li>⚠️ Social justice films are now dangerous</li>
                            <li>⚠️ Politically active talent may be investigated</li>
                            <li>❌ Working with blacklisted artists is forbidden</li>
                            <li>🎬 Stick to safe, non-controversial content</li>
                            <li>⚠️ Your own films may draw HUAC attention</li>
                        </ul>
                        <p><strong>Studio Policy Options:</strong></p>
                        <ul>
                            <li><strong>Cooperate:</strong> Provide names, protect your studio</li>
                            <li><strong>Resist:</strong> Defend artistic freedom, risk investigation</li>
                            <li><strong>Stay Silent:</strong> Make safe films, avoid controversy</li>
                        </ul>
                        <p><em>"In Hollywood, you're either a friendly witness or a red."</em></p>
                    </div>
                `
            }
        },

        // 1948 - Paramount Decree
        1948: {
            month: 5,
            id: 'paramount_decree',
            title: 'Supreme Court Rules Against Studios',
            description: 'The Paramount Antitrust Decision forces studios to divest their theater chains. The studio system begins to crumble.',
            type: 'business',
            effects: {
                vertical_integration_ends: true,
                distribution_harder: true,
                independent_producers_rise: true,
                box_office_uncertainty: 0.15
            },
            modal: {
                title: '⚖️ Paramount Decision - May 1948',
                content: `
                    <div class="historical-event">
                        <p><strong>The Supreme Court has ruled against the studios.</strong></p>
                        <p>The golden age of vertical integration is over. Studios must sell their theater chains.</p>
                        <h3>The Decision:</h3>
                        <ul>
                            <li>❌ Studios can no longer own theaters</li>
                            <li>❌ Block booking is illegal</li>
                            <li>❌ Guaranteed distribution is ending</li>
                            <li>⚠️ Competition from independent producers</li>
                        </ul>
                        <h3>Impact on Your Studio:</h3>
                        <ul>
                            <li>📉 Box office revenue more uncertain (+15% variance)</li>
                            <li>⚠️ Must compete for theater bookings</li>
                            <li>💰 Distribution costs may increase</li>
                            <li>🎬 Quality matters more than ever</li>
                            <li>⚠️ Independent producers become rivals</li>
                        </ul>
                        <p><em>"The studio system is dying. Adapt or perish."</em></p>
                    </div>
                `
            }
        },

        // 1949 - Game End
        1949: {
            month: 12,
            id: 'game_end',
            title: 'End of an Era',
            description: 'You have survived the Golden Age of Hollywood. The studio system is changing, but your legacy is secure.',
            type: 'milestone',
            effects: {
                game_complete: true
            },
            modal: {
                title: '🎬 The End of the Golden Age - December 1949',
                content: `
                    <div class="historical-event">
                        <p><strong>You have survived 16 years in Hollywood's Golden Age.</strong></p>
                        <h3>What You Experienced:</h3>
                        <ul>
                            <li>✅ The end of the Pre-Code era (1934)</li>
                            <li>✅ World War II and Hollywood's war effort (1941-1945)</li>
                            <li>✅ The Red Scare and HUAC hearings (1947-1949)</li>
                            <li>✅ The Paramount Decision (1948)</li>
                        </ul>
                        <h3>What Comes Next:</h3>
                        <ul>
                            <li>📺 Television will soon threaten movie theaters</li>
                            <li>🎬 The studio system will continue to decline</li>
                            <li>⭐ The star system will replace the studio system</li>
                            <li>🎨 Independent producers will flourish</li>
                            <li>🌍 International co-productions will rise</li>
                        </ul>
                        <p><em>Your final statistics and studio legacy will determine your ending...</em></p>
                    </div>
                `
            }
        }
    };

    /**
     * Check if a historical event should trigger
     */
    function checkForEvents(gameState) {
        const currentYear = gameState.gameYear;
        const currentMonth = gameState.currentDate.getMonth() + 1;

        // Check if there's an event for this year
        const event = HISTORICAL_EVENTS[currentYear];

        if (!event) return null;

        // Check if event already triggered
        if (triggeredEvents.has(event.id)) return null;

        // Check if it's the right month
        if (currentMonth < event.month) return null;

        // Trigger the event
        triggeredEvents.add(event.id);
        return triggerEvent(event, gameState);
    }

    /**
     * Trigger a historical event
     */
    function triggerEvent(event, gameState) {
        console.log(`Historical event triggered: ${event.title} (${event.id})`);

        // Apply event effects to game state
        applyEventEffects(event, gameState);

        // Show modal if present
        if (event.modal) {
            showEventModal(event);
        }

        // Add alert
        window.HollywoodMogul.addAlert({
            type: event.type === 'censorship' || event.type === 'political' ? 'warning' : 'info',
            icon: getEventIcon(event.type),
            message: event.title,
            priority: 'high'
        });

        // Record in game state
        if (!gameState.historicalEvents) {
            gameState.historicalEvents = [];
        }
        gameState.historicalEvents.push({
            id: event.id,
            year: gameState.gameYear,
            month: gameState.currentDate.getMonth() + 1,
            title: event.title
        });

        return event;
    }

    /**
     * Apply event effects to game state
     */
    function applyEventEffects(event, gameState) {
        const effects = event.effects || {};

        // Censorship effects
        if (effects.censorship_active !== undefined) {
            gameState.censorshipActive = effects.censorship_active;
        }

        // War effects
        if (effects.war_active !== undefined) {
            gameState.warActive = effects.war_active;
        }

        if (effects.actor_draft_risk !== undefined) {
            gameState.actorDraftRisk = effects.actor_draft_risk;
        }

        // HUAC effects
        if (effects.huac_active !== undefined) {
            gameState.huacActive = effects.huac_active;
        }

        if (effects.political_risk !== undefined) {
            gameState.politicalRisk = (gameState.politicalRisk || 0) + effects.political_risk;
        }

        if (effects.blacklist_begins !== undefined) {
            gameState.blacklistActive = effects.blacklist_begins;
        }

        // Business effects
        if (effects.vertical_integration_ends !== undefined) {
            gameState.verticalIntegration = !effects.vertical_integration_ends;
        }

        if (effects.box_office_uncertainty !== undefined) {
            gameState.boxOfficeVariance = (gameState.boxOfficeVariance || 0) + effects.box_office_uncertainty;
        }

        // Industry effects
        if (effects.audience_expectations !== undefined) {
            gameState.audienceExpectations = (gameState.audienceExpectations || 50) + effects.audience_expectations;
        }

        // Game completion
        if (effects.game_complete !== undefined) {
            gameState.gameComplete = effects.game_complete;
        }
    }

    /**
     * Show event modal
     */
    function showEventModal(event) {
        const modal = event.modal;

        window.HollywoodMogul.showModal(`
            <div class="historical-event-modal">
                <h2>${modal.title}</h2>
                ${modal.content}
                <div class="modal-actions">
                    <button onclick="HollywoodMogul.closeModal()" class="action-btn primary">
                        CONTINUE
                    </button>
                </div>
            </div>
        `);
    }

    /**
     * Get icon for event type
     */
    function getEventIcon(type) {
        const icons = {
            milestone: '🎬',
            censorship: '⚖️',
            industry: '🎞️',
            war: '🎖️',
            political: '⚠️',
            business: '💼'
        };
        return icons[type] || '📰';
    }

    /**
     * Get all triggered events (returns full event objects with title, year, etc.)
     */
    function getTriggeredEvents() {
        return Array.from(triggeredEvents).map(eventId => {
            const fullEvent = getEventById(eventId);
            if (fullEvent) {
                // Find the year for this event
                for (const year in HISTORICAL_EVENTS) {
                    if (HISTORICAL_EVENTS[year].id === eventId) {
                        return {
                            ...fullEvent,
                            year: parseInt(year)
                        };
                    }
                }
            }
            return fullEvent;
        }).filter(event => event !== null);
    }

    /**
     * Reset triggered events (for new game)
     */
    function reset() {
        triggeredEvents.clear();
    }

    /**
     * Get event by ID
     */
    function getEventById(id) {
        for (const year in HISTORICAL_EVENTS) {
            const event = HISTORICAL_EVENTS[year];
            if (event.id === id) {
                return event;
            }
        }
        return null;
    }

    /**
     * Get all events for a specific year
     */
    function getEventsForYear(year) {
        return HISTORICAL_EVENTS[year] || null;
    }

    // Public API
    return {
        checkForEvents,
        triggerEvent,
        getTriggeredEvents,
        getEventById,
        getEventsForYear,
        reset,
        HISTORICAL_EVENTS
    };
})();
