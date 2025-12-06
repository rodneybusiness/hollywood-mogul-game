/**
 * HOLLYWOOD MOGUL - RIVAL STUDIOS AI COMPETITIVE SYSTEM
 * Make the player feel the competitive pressure of the Golden Age studio system
 */

window.RivalStudios = (function() {
    'use strict';

    // Define the 4 major rival studios with authentic personalities
    const RIVAL_STUDIOS = {
        mgm: {
            id: 'mgm',
            name: 'Metro-Goldwyn-Mayer',
            nickname: 'MGM',
            slogan: 'More Stars Than There Are In Heaven',
            personality: {
                aggression: 0.85,        // Very aggressive bidding
                prestige: 0.95,          // Loves prestige films
                riskTolerance: 0.60,     // Moderate risk tolerance
                genrePreference: ['drama', 'musical', 'romance'],
                budgetStrategy: 'high',  // Spends big
                competitiveness: 0.90    // Highly competitive
            },
            startingCash: 800000,
            startingReputation: 95,
            monthlyIncome: 50000,
            color: '#C41E3A',           // MGM red
            description: 'The industry giant. Known for lavish productions and the biggest stars.'
        },

        warner: {
            id: 'warner',
            name: 'Warner Bros. Pictures',
            nickname: 'Warner Bros',
            slogan: 'Combining Good Citizenship with Good Picture Making',
            personality: {
                aggression: 0.70,
                prestige: 0.60,
                riskTolerance: 0.75,     // Willing to take risks
                genrePreference: ['gangster', 'crime', 'musical', 'war'],
                budgetStrategy: 'medium',
                competitiveness: 0.80
            },
            startingCash: 600000,
            startingReputation: 85,
            monthlyIncome: 40000,
            color: '#0066CC',           // Warner blue
            description: 'Gritty, urban films. Pioneered early talkies and crime pictures.'
        },

        rko: {
            id: 'rko',
            name: 'RKO Pictures',
            nickname: 'RKO',
            slogan: 'It\'s an RKO Radio Picture!',
            personality: {
                aggression: 0.60,
                prestige: 0.70,
                riskTolerance: 0.85,     // Most experimental
                genrePreference: ['horror', 'noir', 'comedy', 'adventure'],
                budgetStrategy: 'medium',
                competitiveness: 0.70
            },
            startingCash: 500000,
            startingReputation: 75,
            monthlyIncome: 35000,
            color: '#666666',           // RKO gray
            description: 'Innovative and experimental. Known for horror and artistic films.'
        },

        paramount: {
            id: 'paramount',
            name: 'Paramount Pictures',
            nickname: 'Paramount',
            slogan: 'If It\'s a Paramount Picture, It\'s the Best Show in Town!',
            personality: {
                aggression: 0.75,
                prestige: 0.85,
                riskTolerance: 0.55,     // Conservative
                genrePreference: ['comedy', 'romance', 'drama', 'western'],
                budgetStrategy: 'high',
                competitiveness: 0.85
            },
            startingCash: 700000,
            startingReputation: 90,
            monthlyIncome: 45000,
            color: '#003087',           // Paramount blue
            description: 'Sophisticated comedies and European flair. Class and elegance.'
        }
    };

    // Competition event types
    const COMPETITION_EVENTS = [
        {
            type: 'rival_film_announced',
            template: '{studio} announces production on "{title}", a {genre} picture',
            impact: 'awareness',
            severity: 'info'
        },
        {
            type: 'rival_outbid_script',
            template: '{studio} outbids you for script "{title}"!',
            impact: 'lost_opportunity',
            severity: 'warning'
        },
        {
            type: 'rival_signs_talent',
            template: '{studio} signs {talent} to exclusive contract',
            impact: 'talent_unavailable',
            severity: 'info'
        },
        {
            type: 'rival_release_same_weekend',
            template: '{studio} releases "{title}" same weekend as your film!',
            impact: 'box_office_competition',
            severity: 'warning'
        },
        {
            type: 'rival_critical_success',
            template: '{studio}\'s "{title}" receives rave reviews from critics',
            impact: 'reputation',
            severity: 'info'
        },
        {
            type: 'rival_box_office_hit',
            template: '{studio}\'s "{title}" breaks box office records!',
            impact: 'market_share',
            severity: 'warning'
        },
        {
            type: 'rival_financial_trouble',
            template: '{studio} facing financial difficulties, scaling back production',
            impact: 'opportunity',
            severity: 'success'
        },
        {
            type: 'rival_studio_expansion',
            template: '{studio} expands production facilities, increasing output',
            impact: 'increased_competition',
            severity: 'warning'
        }
    ];

    // Talent pool for rival studios to sign
    const TALENT_POOL = [
        { name: 'Clark Gable', type: 'actor', starPower: 95, salary: 5000 },
        { name: 'Bette Davis', type: 'actress', starPower: 90, salary: 4500 },
        { name: 'James Cagney', type: 'actor', starPower: 88, salary: 4200 },
        { name: 'Katharine Hepburn', type: 'actress', starPower: 92, salary: 4800 },
        { name: 'Humphrey Bogart', type: 'actor', starPower: 85, salary: 4000 },
        { name: 'Greta Garbo', type: 'actress', starPower: 93, salary: 5200 },
        { name: 'James Stewart', type: 'actor', starPower: 87, salary: 4100 },
        { name: 'Joan Crawford', type: 'actress', starPower: 89, salary: 4300 },
        { name: 'Gary Cooper', type: 'actor', starPower: 91, salary: 4600 },
        { name: 'Barbara Stanwyck', type: 'actress', starPower: 86, salary: 3900 }
    ];

    /**
     * Initialize the rival studios system
     */
    function init(gameState) {
        if (!gameState.rivalStudios) {
            gameState.rivalStudios = {};

            // Initialize each rival studio
            Object.keys(RIVAL_STUDIOS).forEach(studioId => {
                const template = RIVAL_STUDIOS[studioId];
                gameState.rivalStudios[studioId] = createRivalStudio(template);
            });

            // Initialize competition tracking
            gameState.competitionData = {
                marketShare: {
                    player: 20,
                    mgm: 30,
                    warner: 25,
                    rko: 15,
                    paramount: 10
                },
                industryNews: [],
                lastUpdate: new Date(gameState.currentDate)
            };

            console.log('Rival studios initialized:', gameState.rivalStudios);
        }

        // Register weekly callback with TimeSystem
        if (window.TimeSystem && typeof window.TimeSystem.addWeeklyCallback === 'function') {
            window.TimeSystem.addWeeklyCallback(() => processWeeklyRivalUpdates(gameState));
        }

        return gameState.rivalStudios;
    }

    /**
     * Create a rival studio instance from template
     */
    function createRivalStudio(template) {
        return {
            ...template,
            cash: template.startingCash,
            reputation: template.startingReputation,
            activeProductions: [],
            completedFilms: [],
            upcomingReleases: [],
            contractTalent: [],
            monthlyBurn: 25000,
            filmsThisYear: 0,
            boxOfficeTotal: 0,
            stats: {
                filmsReleased: 0,
                averageBoxOffice: 0,
                criticalHits: 0,
                boxOfficeFlops: 0
            }
        };
    }

    /**
     * Process weekly AI updates for all rival studios
     */
    function processWeeklyRivalUpdates(gameState) {
        if (!gameState.rivalStudios) {
            init(gameState);
        }

        Object.keys(gameState.rivalStudios).forEach(studioId => {
            const studio = gameState.rivalStudios[studioId];

            // Update existing productions
            updateRivalProductions(studio, gameState);

            // Make strategic decisions
            makeStrategicDecisions(studio, gameState);

            // Process releases
            processRivalReleases(studio, gameState);

            // Update financial state
            updateRivalFinancials(studio, gameState);
        });

        // Update market share
        updateMarketShare(gameState);

        // Trim news to last 20 items
        if (gameState.competitionData.industryNews.length > 20) {
            gameState.competitionData.industryNews = gameState.competitionData.industryNews.slice(-20);
        }
    }

    /**
     * Update rival studio productions
     */
    function updateRivalProductions(studio, gameState) {
        studio.activeProductions.forEach(production => {
            production.weeksInProduction = (production.weeksInProduction || 0) + 1;

            // Simple production timeline: 12-20 weeks total
            if (production.weeksInProduction >= production.productionLength) {
                completeRivalProduction(studio, production, gameState);
            }
        });
    }

    /**
     * Complete a rival studio production
     */
    function completeRivalProduction(studio, production, gameState) {
        // Move to completed
        const index = studio.activeProductions.indexOf(production);
        if (index >= 0) {
            studio.activeProductions.splice(index, 1);
        }

        production.status = 'completed';
        production.completionDate = new Date(gameState.currentDate);
        studio.completedFilms.push(production);

        // Schedule release in 2-4 weeks
        const weeksUntilRelease = 2 + Math.floor(Math.random() * 3);
        production.scheduledRelease = new Date(gameState.currentDate);
        production.scheduledRelease.setDate(production.scheduledRelease.getDate() + (weeksUntilRelease * 7));
        studio.upcomingReleases.push(production);

        // Generate news event
        addIndustryNews(gameState, {
            type: 'rival_film_completed',
            studio: studio.nickname,
            title: production.title,
            genre: production.genre,
            message: `${studio.nickname} completes production on "${production.title}", set for release soon`
        });
    }

    /**
     * Process rival film releases
     */
    function processRivalReleases(studio, gameState) {
        const now = new Date(gameState.currentDate);

        studio.upcomingReleases.forEach(film => {
            if (film.scheduledRelease && now >= film.scheduledRelease) {
                releaseRivalFilm(studio, film, gameState);
            }
        });

        // Remove released films from upcoming
        studio.upcomingReleases = studio.upcomingReleases.filter(f =>
            f.scheduledRelease && now < f.scheduledRelease
        );
    }

    /**
     * Release a rival studio film
     */
    function releaseRivalFilm(studio, film, gameState) {
        film.status = 'released';
        film.releaseDate = new Date(gameState.currentDate);

        // Calculate box office based on film quality and studio reputation
        const baseGross = film.budget * (1.2 + Math.random() * 1.5);
        const qualityMultiplier = film.quality / 70;
        const reputationMultiplier = studio.reputation / 80;

        film.boxOfficeGross = Math.floor(baseGross * qualityMultiplier * reputationMultiplier);
        film.studioRevenue = Math.floor(film.boxOfficeGross * 0.55); // Studio's cut

        // Update studio financials
        studio.cash += film.studioRevenue;
        studio.boxOfficeTotal += film.boxOfficeGross;
        studio.stats.filmsReleased += 1;
        studio.stats.averageBoxOffice = Math.floor(studio.boxOfficeTotal / studio.stats.filmsReleased);

        // Track hit or flop
        const profitMargin = (film.studioRevenue - film.budget) / film.budget;
        if (profitMargin > 0.5) {
            studio.stats.criticalHits += 1;
            studio.reputation = Math.min(100, studio.reputation + 2);

            addIndustryNews(gameState, {
                type: 'rival_box_office_hit',
                studio: studio.nickname,
                title: film.title,
                gross: film.boxOfficeGross,
                message: `${studio.nickname}'s "${film.title}" becomes a box office sensation! Gross: $${film.boxOfficeGross.toLocaleString()}`
            });
        } else if (profitMargin < -0.2) {
            studio.stats.boxOfficeFlops += 1;
            studio.reputation = Math.max(30, studio.reputation - 1);
        }

        // Check for same-weekend competition with player films
        checkWeekendCompetition(studio, film, gameState);
    }

    /**
     * Check if rival release competes with player's films
     */
    function checkWeekendCompetition(studio, rivalFilm, gameState) {
        const playerFilmsInTheaters = (gameState.completedFilms || []).filter(f =>
            f.inTheaters &&
            f.releaseDate &&
            Math.abs(new Date(rivalFilm.releaseDate) - new Date(f.releaseDate)) < 7 * 24 * 60 * 60 * 1000
        );

        if (playerFilmsInTheaters.length > 0) {
            playerFilmsInTheaters.forEach(playerFilm => {
                // Apply competition penalty to player's film
                if (!playerFilm.competitionPenalty) {
                    playerFilm.competitionPenalty = 0;
                }

                // Stronger competition if same genre
                const penalty = rivalFilm.genre === playerFilm.genre ? 0.20 : 0.10;
                playerFilm.competitionPenalty += penalty;

                addIndustryNews(gameState, {
                    type: 'rival_release_same_weekend',
                    studio: studio.nickname,
                    title: rivalFilm.title,
                    message: `${studio.nickname} releases "${rivalFilm.title}" same weekend as your "${playerFilm.title}"! Box office competition expected.`,
                    severity: 'warning'
                });

                if (window.HollywoodMogul && typeof window.HollywoodMogul.addAlert === 'function') {
                    window.HollywoodMogul.addAlert({
                        type: 'warning',
                        icon: '⚔️',
                        message: `${studio.nickname}'s "${rivalFilm.title}" opening same weekend as "${playerFilm.title}"!`,
                        priority: 'high'
                    });
                }
            });
        }
    }

    /**
     * Make strategic AI decisions
     */
    function makeStrategicDecisions(studio, gameState) {
        const personality = studio.personality;

        // Decision 1: Should we greenlight a new film?
        if (shouldGreenlightFilm(studio, gameState)) {
            greenlightRivalFilm(studio, gameState);
        }

        // Decision 2: Should we sign talent? (10% chance per week)
        if (Math.random() < 0.10 * personality.aggression) {
            signTalentToContract(studio, gameState);
        }

        // Decision 3: React to player actions
        if (Math.random() < 0.15 * personality.competitiveness) {
            reactToPlayer(studio, gameState);
        }
    }

    /**
     * Determine if rival should greenlight a new film
     */
    function shouldGreenlightFilm(studio, gameState) {
        // Don't produce if too many active productions
        if (studio.activeProductions.length >= 3) {
            return false;
        }

        // Don't produce if low on cash
        if (studio.cash < 100000) {
            return false;
        }

        // Base chance 25% per week
        let chance = 0.25;

        // Adjust by aggression
        chance *= studio.personality.aggression;

        // Higher chance early in year
        const month = new Date(gameState.currentDate).getMonth();
        if (month < 3) {
            chance *= 1.3;
        }

        return Math.random() < chance;
    }

    /**
     * Greenlight a film for rival studio
     */
    function greenlightRivalFilm(studio, gameState) {
        const personality = studio.personality;

        // Select genre based on studio preference
        const genre = selectRivalGenre(personality.genrePreference);

        // Determine budget based on strategy
        let budget;
        if (personality.budgetStrategy === 'high') {
            budget = 100000 + Math.floor(Math.random() * 150000);
        } else if (personality.budgetStrategy === 'medium') {
            budget = 60000 + Math.floor(Math.random() * 80000);
        } else {
            budget = 30000 + Math.floor(Math.random() * 50000);
        }

        // Adjust budget based on cash reserves
        budget = Math.min(budget, studio.cash * 0.4);

        // Determine quality (influenced by studio reputation)
        const baseQuality = 50 + Math.floor(Math.random() * 30);
        const quality = Math.min(95, Math.floor(baseQuality + (studio.reputation - 70) * 0.3));

        // Generate film title
        const title = generateRivalFilmTitle(genre);

        // Create production
        const production = {
            id: 'rival_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title: title,
            genre: genre,
            budget: budget,
            quality: quality,
            studio: studio.id,
            studioName: studio.nickname,
            productionLength: 12 + Math.floor(Math.random() * 8),
            weeksInProduction: 0,
            status: 'in_production',
            startDate: new Date(gameState.currentDate)
        };

        // Spend initial costs
        studio.cash -= Math.floor(budget * 0.2); // 20% upfront

        // Add to active productions
        studio.activeProductions.push(production);
        studio.filmsThisYear += 1;

        // Generate news
        addIndustryNews(gameState, {
            type: 'rival_film_announced',
            studio: studio.nickname,
            title: title,
            genre: genre,
            budget: budget,
            message: `${studio.nickname} greenlights "${title}", a ${genre} picture with $${budget.toLocaleString()} budget`
        });

        console.log(`${studio.nickname} greenlit "${title}" (${genre}, $${budget.toLocaleString()})`);
    }

    /**
     * Select genre for rival based on preferences
     */
    function selectRivalGenre(preferences) {
        if (Math.random() < 0.7 && preferences.length > 0) {
            // 70% chance to pick preferred genre
            return preferences[Math.floor(Math.random() * preferences.length)];
        } else {
            // 30% chance to pick any genre
            const allGenres = ['drama', 'comedy', 'western', 'musical', 'gangster', 'crime', 'romance', 'horror', 'noir', 'war', 'adventure'];
            return allGenres[Math.floor(Math.random() * allGenres.length)];
        }
    }

    /**
     * Generate rival film title
     */
    function generateRivalFilmTitle(genre) {
        const titleTemplates = {
            drama: ['The Human Heart', 'Life\'s Journey', 'The Final Chapter', 'Tomorrow\'s Promise', 'The Turning Point'],
            comedy: ['Laughing All the Way', 'The Merry Mixup', 'Love and Laughter', 'The Gay Divorcee', 'Bachelor\'s Delight'],
            western: ['Thunder Valley', 'The Lone Ranger', 'Sunset Trail', 'Desert Justice', 'The Quick Draw'],
            musical: ['Broadway Rhythm', 'Melody Time', 'Dancing Through Life', 'The Song is You', 'Star Spangled Rhythm'],
            gangster: ['The Underworld', 'City Streets', 'The Big Shot', 'Mob Rule', 'The Racket'],
            crime: ['The Setup', 'Night Beat', 'The Whistler', 'Crime Wave', 'The Dragnet'],
            romance: ['Love\'s Eternal Flame', 'Hearts Entwined', 'The Way We Were', 'Forever Yours', 'Stardust Romance'],
            horror: ['The Haunting', 'Midnight Terror', 'The Unknown', 'Chamber of Horrors', 'The Mad Doctor'],
            noir: ['Shadow of Doubt', 'The Dark Corner', 'City of Fear', 'The Prowler', 'Night Without Sleep'],
            war: ['Wings of Victory', 'The Battle Cry', 'Heroes at War', 'The Longest Night', 'Destination Unknown'],
            adventure: ['The Lost Expedition', 'Jungle Quest', 'High Adventure', 'The Treasure Seekers', 'Perilous Journey']
        };

        const templates = titleTemplates[genre] || titleTemplates.drama;
        return templates[Math.floor(Math.random() * templates.length)];
    }

    /**
     * Sign talent to exclusive contract
     */
    function signTalentToContract(studio, gameState) {
        // Find available talent not already under contract
        const availableTalent = TALENT_POOL.filter(talent =>
            !studio.contractTalent.find(t => t.name === talent.name) &&
            !Object.values(gameState.rivalStudios || {}).some(s =>
                s.contractTalent && s.contractTalent.find(t => t.name === talent.name)
            )
        );

        if (availableTalent.length === 0) return;

        // Select talent based on star power and affordability
        const talent = availableTalent[Math.floor(Math.random() * Math.min(3, availableTalent.length))];

        // Check if can afford
        if (studio.cash < talent.salary * 12) return;

        // Sign to 2-year contract
        studio.contractTalent.push({
            ...talent,
            contractStart: new Date(gameState.currentDate),
            contractEnd: new Date(new Date(gameState.currentDate).setFullYear(gameState.currentDate.getFullYear() + 2)),
            monthlySalary: talent.salary
        });

        studio.monthlyBurn += talent.salary;

        addIndustryNews(gameState, {
            type: 'rival_signs_talent',
            studio: studio.nickname,
            talent: talent.name,
            message: `${studio.nickname} signs ${talent.name} (${talent.type}) to exclusive contract`
        });
    }

    /**
     * React to player actions
     */
    function reactToPlayer(studio, gameState) {
        const personality = studio.personality;

        // Check if player recently had a hit
        const playerRecentHits = (gameState.completedFilms || []).filter(f =>
            f.boxOfficeGross > f.budget * 2 &&
            f.releaseDate &&
            (new Date(gameState.currentDate) - new Date(f.releaseDate)) < 90 * 24 * 60 * 60 * 1000
        );

        if (playerRecentHits.length > 0 && Math.random() < personality.competitiveness) {
            // React by greenlighting similar film
            const hitFilm = playerRecentHits[0];

            addIndustryNews(gameState, {
                type: 'rival_competitive_response',
                studio: studio.nickname,
                message: `${studio.nickname} announces plans to produce competing ${hitFilm.genre} picture in response to your success`
            });

            // Chance to actually greenlight
            if (Math.random() < 0.6) {
                greenlightRivalFilm(studio, gameState);
            }
        }
    }

    /**
     * Update rival studio financials
     */
    function updateRivalFinancials(studio, gameState) {
        // Weekly income
        const weeklyIncome = studio.monthlyIncome / 4;
        studio.cash += weeklyIncome;

        // Weekly burn for overhead and productions
        const weeklyBurn = studio.monthlyBurn / 4;
        studio.cash -= weeklyBurn;

        // Production costs for active films
        studio.activeProductions.forEach(production => {
            const weeklyProductionCost = production.budget / production.productionLength;
            studio.cash -= weeklyProductionCost;
        });

        // Financial trouble warning
        if (studio.cash < 50000 && studio.cash > 0 && Math.random() < 0.1) {
            addIndustryNews(gameState, {
                type: 'rival_financial_trouble',
                studio: studio.nickname,
                message: `${studio.nickname} facing financial difficulties, scaling back production plans`,
                severity: 'info'
            });

            studio.monthlyBurn = Math.floor(studio.monthlyBurn * 0.8);
        }

        // Prevent bankruptcy (AI bailout)
        if (studio.cash < 0) {
            studio.cash = 100000;
            studio.reputation = Math.max(30, studio.reputation - 10);
        }
    }

    /**
     * Update market share based on box office performance
     */
    function updateMarketShare(gameState) {
        if (!gameState.competitionData) return;

        const marketShare = gameState.competitionData.marketShare;

        // Calculate total industry box office
        let totalIndustryGross = 0;
        let playerGross = 0;

        // Player's contribution
        (gameState.completedFilms || []).forEach(film => {
            if (film.boxOfficeGross) {
                playerGross += film.boxOfficeGross;
                totalIndustryGross += film.boxOfficeGross;
            }
        });

        // Rivals' contribution
        Object.values(gameState.rivalStudios || {}).forEach(studio => {
            totalIndustryGross += studio.boxOfficeTotal;
        });

        // Update market share (slowly shift based on performance)
        if (totalIndustryGross > 0) {
            const newPlayerShare = (playerGross / totalIndustryGross) * 100;
            marketShare.player = Math.floor(marketShare.player * 0.9 + newPlayerShare * 0.1);

            // Redistribute among rivals
            const remainingShare = 100 - marketShare.player;
            Object.keys(gameState.rivalStudios || {}).forEach(studioId => {
                const studio = gameState.rivalStudios[studioId];
                const studioShare = (studio.boxOfficeTotal / totalIndustryGross) * 100;
                marketShare[studioId] = Math.floor((marketShare[studioId] * 0.9 + studioShare * 0.1) * (remainingShare / 100));
            });
        }
    }

    /**
     * Add industry news item
     */
    function addIndustryNews(gameState, newsData) {
        if (!gameState.competitionData) {
            gameState.competitionData = { industryNews: [] };
        }

        const newsItem = {
            ...newsData,
            timestamp: new Date(gameState.currentDate),
            id: Date.now() + Math.random()
        };

        gameState.competitionData.industryNews.push(newsItem);

        // Also add as game event if HollywoodMogul is available
        if (window.HollywoodMogul && typeof window.HollywoodMogul.addEvent === 'function') {
            window.HollywoodMogul.addEvent({
                type: 'market',
                title: 'Industry News',
                message: newsData.message,
                severity: newsData.severity || 'info'
            });
        }
    }

    /**
     * Get industry news for display
     */
    function getIndustryNews(gameState, limit = 10) {
        if (!gameState.competitionData || !gameState.competitionData.industryNews) {
            return [];
        }

        return gameState.competitionData.industryNews
            .slice(-limit)
            .reverse();
    }

    /**
     * Get market share data
     */
    function getMarketShare(gameState) {
        if (!gameState.competitionData || !gameState.competitionData.marketShare) {
            return null;
        }

        return gameState.competitionData.marketShare;
    }

    /**
     * Get all rival studios data
     */
    function getRivalStudios(gameState) {
        return gameState.rivalStudios || {};
    }

    /**
     * Get specific rival studio
     */
    function getRivalStudio(gameState, studioId) {
        return gameState.rivalStudios ? gameState.rivalStudios[studioId] : null;
    }

    /**
     * Get competition summary for dashboard
     */
    function getCompetitionSummary(gameState) {
        const rivals = getRivalStudios(gameState);
        const marketShare = getMarketShare(gameState);

        const summary = {
            totalRivals: Object.keys(rivals).length,
            activeCompetingFilms: 0,
            upcomingReleases: 0,
            marketShare: marketShare,
            topRival: null,
            recentNews: getIndustryNews(gameState, 5)
        };

        // Count active films and upcoming releases
        Object.values(rivals).forEach(studio => {
            summary.activeCompetingFilms += studio.activeProductions.length;
            summary.upcomingReleases += studio.upcomingReleases.length;
        });

        // Find top rival by market share
        if (marketShare) {
            let maxShare = 0;
            Object.entries(marketShare).forEach(([studioId, share]) => {
                if (studioId !== 'player' && share > maxShare) {
                    maxShare = share;
                    summary.topRival = {
                        id: studioId,
                        name: rivals[studioId]?.nickname || studioId,
                        share: share
                    };
                }
            });
        }

        return summary;
    }

    /**
     * Simulate rival bid on script (for future competitive bidding)
     */
    function simulateRivalBid(script, gameState) {
        // Check if any rival would bid on this script
        const interestedRivals = Object.values(gameState.rivalStudios || {}).filter(studio => {
            const personality = studio.personality;

            // Check genre preference
            const genreMatch = personality.genrePreference.includes(script.genre);

            // Check if can afford
            const canAfford = studio.cash >= script.budget * 1.2;

            // Check aggression level
            const aggressive = Math.random() < personality.aggression;

            return canAfford && (genreMatch || aggressive);
        });

        if (interestedRivals.length === 0) {
            return null;
        }

        // Select most aggressive/interested rival
        const bidder = interestedRivals.reduce((prev, current) =>
            current.personality.aggression > prev.personality.aggression ? current : prev
        );

        return {
            studio: bidder,
            bidAmount: Math.floor(script.budget * (1.1 + Math.random() * 0.3))
        };
    }

    /**
     * Public API
     */
    return {
        init,
        processWeeklyRivalUpdates,
        getIndustryNews,
        getMarketShare,
        getRivalStudios,
        getRivalStudio,
        getCompetitionSummary,
        simulateRivalBid,

        // Constants for external use
        RIVAL_STUDIOS_DATA: RIVAL_STUDIOS,
        TALENT_POOL: TALENT_POOL
    };
})();
