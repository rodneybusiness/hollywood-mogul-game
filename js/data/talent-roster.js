/**
 * HOLLYWOOD MOGUL - TALENT ROSTER DATABASE
 * Historically accurate actors and directors from 1933-1949
 * Includes star power ratings, costs, and availability windows
 */

window.TalentRoster = (function() {
    'use strict';

    /**
     * Actor Database - 50+ stars from the Golden Age
     */
    const ACTORS = {
        // A-List Stars (Star Power: 85-95)
        clark_gable: {
            id: 'clark_gable',
            name: 'Clark Gable',
            gender: 'male',
            starPower: 95,
            weeklyRate: 5000,
            genres: ['drama', 'romance', 'adventure'],
            availableFrom: 1933,
            availableTo: 1949,
            draftRisk: true, // Served 1942-1944
            oscarWinner: true, // It Happened One Night (1934)
            description: 'The King of Hollywood',
            morale: 75,
            loyalty: 50
        },

        bette_davis: {
            id: 'bette_davis',
            name: 'Bette Davis',
            gender: 'female',
            starPower: 90,
            weeklyRate: 4500,
            genres: ['drama', 'melodrama', 'thriller'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Dangerous (1935), Jezebel (1938)
            description: 'First lady of the screen',
            morale: 75,
            loyalty: 50
        },

        humphrey_bogart: {
            id: 'humphrey_bogart',
            name: 'Humphrey Bogart',
            gender: 'male',
            starPower: 92,
            weeklyRate: 4800,
            genres: ['noir', 'crime', 'drama', 'war'],
            availableFrom: 1936,
            availableTo: 1949,
            oscarPotential: 20, // Won in 1952
            description: 'Tough guy with a heart'
        },

        katharine_hepburn: {
            id: 'katharine_hepburn',
            name: 'Katharine Hepburn',
            gender: 'female',
            starPower: 90,
            weeklyRate: 4500,
            genres: ['comedy', 'drama', 'romance'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Morning Glory (1933)
            description: 'Independent spirit'
        },

        cary_grant: {
            id: 'cary_grant',
            name: 'Cary Grant',
            gender: 'male',
            starPower: 93,
            weeklyRate: 4700,
            genres: ['comedy', 'romance', 'thriller'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 15,
            description: 'Sophisticated leading man'
        },

        james_stewart: {
            id: 'james_stewart',
            name: 'James Stewart',
            gender: 'male',
            starPower: 88,
            weeklyRate: 4000,
            genres: ['drama', 'western', 'comedy'],
            availableFrom: 1935,
            availableTo: 1949,
            draftRisk: true, // Served 1941-1945
            oscarWinner: true, // The Philadelphia Story (1940)
            description: 'Every man hero'
        },

        barbara_stanwyck: {
            id: 'barbara_stanwyck',
            name: 'Barbara Stanwyck',
            gender: 'female',
            starPower: 87,
            weeklyRate: 3800,
            genres: ['noir', 'western', 'drama', 'comedy'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 18,
            description: 'Versatile powerhouse'
        },

        gary_cooper: {
            id: 'gary_cooper',
            name: 'Gary Cooper',
            gender: 'male',
            starPower: 91,
            weeklyRate: 4500,
            genres: ['western', 'drama', 'war'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Sergeant York (1941)
            description: 'Strong silent type'
        },

        joan_crawford: {
            id: 'joan_crawford',
            name: 'Joan Crawford',
            gender: 'female',
            starPower: 89,
            weeklyRate: 4200,
            genres: ['drama', 'melodrama', 'noir'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Mildred Pierce (1945)
            description: 'Ambitious survivor'
        },

        spencer_tracy: {
            id: 'spencer_tracy',
            name: 'Spencer Tracy',
            gender: 'male',
            starPower: 90,
            weeklyRate: 4300,
            genres: ['drama', 'comedy', 'biography'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Captains Courageous (1937), Boys Town (1938)
            description: 'Dependable lead'
        },

        // B-List Stars (Star Power: 70-84)
        joan_fontaine: {
            id: 'joan_fontaine',
            name: 'Joan Fontaine',
            gender: 'female',
            starPower: 82,
            weeklyRate: 3200,
            genres: ['drama', 'thriller', 'romance'],
            availableFrom: 1937,
            availableTo: 1949,
            oscarWinner: true, // Suspicion (1941)
            description: 'Elegant beauty'
        },

        henry_fonda: {
            id: 'henry_fonda',
            name: 'Henry Fonda',
            gender: 'male',
            starPower: 84,
            weeklyRate: 3500,
            genres: ['drama', 'western', 'war'],
            availableFrom: 1935,
            availableTo: 1949,
            draftRisk: true, // Served 1942-1945
            oscarPotential: 15,
            description: 'Man of integrity'
        },

        ginger_rogers: {
            id: 'ginger_rogers',
            name: 'Ginger Rogers',
            gender: 'female',
            starPower: 85,
            weeklyRate: 3600,
            genres: ['musical', 'comedy', 'drama'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Kitty Foyle (1940)
            description: 'Dancing queen'
        },

        fred_astaire: {
            id: 'fred_astaire',
            name: 'Fred Astaire',
            gender: 'male',
            starPower: 84,
            weeklyRate: 3500,
            genres: ['musical', 'comedy', 'romance'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 10,
            description: 'Master dancer'
        },

        ingrid_bergman: {
            id: 'ingrid_bergman',
            name: 'Ingrid Bergman',
            gender: 'female',
            starPower: 88,
            weeklyRate: 4000,
            genres: ['drama', 'romance', 'thriller'],
            availableFrom: 1939,
            availableTo: 1949,
            oscarWinner: true, // Gaslight (1944)
            description: 'Luminous presence'
        },

        rita_hayworth: {
            id: 'rita_hayworth',
            name: 'Rita Hayworth',
            gender: 'female',
            starPower: 83,
            weeklyRate: 3400,
            genres: ['noir', 'musical', 'romance'],
            availableFrom: 1937,
            availableTo: 1949,
            oscarPotential: 12,
            description: 'Glamour goddess'
        },

        gregory_peck: {
            id: 'gregory_peck',
            name: 'Gregory Peck',
            gender: 'male',
            starPower: 80,
            weeklyRate: 3000,
            genres: ['drama', 'western', 'thriller'],
            availableFrom: 1944,
            availableTo: 1949,
            oscarPotential: 18,
            description: 'Dignified leading man'
        },

        lauren_bacall: {
            id: 'lauren_bacall',
            name: 'Lauren Bacall',
            gender: 'female',
            starPower: 78,
            weeklyRate: 2800,
            genres: ['noir', 'thriller', 'drama'],
            availableFrom: 1944,
            availableTo: 1949,
            oscarPotential: 10,
            description: 'Sultry newcomer'
        },

        // Supporting Players (Star Power: 55-69)
        peter_lorre: {
            id: 'peter_lorre',
            name: 'Peter Lorre',
            gender: 'male',
            starPower: 68,
            weeklyRate: 1800,
            genres: ['thriller', 'noir', 'horror'],
            availableFrom: 1935,
            availableTo: 1949,
            oscarPotential: 5,
            description: 'Character specialist'
        },

        sydney_greenstreet: {
            id: 'sydney_greenstreet',
            name: 'Sydney Greenstreet',
            gender: 'male',
            starPower: 65,
            weeklyRate: 1600,
            genres: ['noir', 'thriller', 'drama'],
            availableFrom: 1941,
            availableTo: 1949,
            oscarPotential: 8,
            description: 'Imposing villain'
        },

        claude_rains: {
            id: 'claude_rains',
            name: 'Claude Rains',
            gender: 'male',
            starPower: 72,
            weeklyRate: 2000,
            genres: ['drama', 'thriller', 'horror'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 10,
            description: 'Refined character actor'
        },

        agnes_moorehead: {
            id: 'agnes_moorehead',
            name: 'Agnes Moorehead',
            gender: 'female',
            starPower: 70,
            weeklyRate: 1900,
            genres: ['drama', 'thriller', 'horror'],
            availableFrom: 1941,
            availableTo: 1949,
            oscarPotential: 12,
            description: 'Powerful character actress'
        }
    };

    /**
     * Director Database - 30+ filmmakers from the Golden Age
     */
    const DIRECTORS = {
        // Master Directors (Talent: 90-100)
        frank_capra: {
            id: 'frank_capra',
            name: 'Frank Capra',
            talent: 95,
            weeklyRate: 5000,
            genres: ['comedy', 'drama', 'romance'],
            availableFrom: 1933,
            availableTo: 1949,
            draftRisk: true, // Made war documentaries 1942-1945
            oscarWinner: true, // It Happened One Night (1934), Mr. Deeds (1936), You Can't Take It With You (1938)
            specialties: ['uplifting', 'populist', 'heartwarming'],
            description: 'Master of Americana'
        },

        john_ford: {
            id: 'john_ford',
            name: 'John Ford',
            talent: 96,
            weeklyRate: 5200,
            genres: ['western', 'drama', 'war'],
            availableFrom: 1933,
            availableTo: 1949,
            draftRisk: true, // Made war documentaries 1941-1945
            oscarWinner: true, // The Informer (1935), Grapes of Wrath (1940), How Green Was My Valley (1941)
            specialties: ['visual poetry', 'americana', 'epic'],
            description: 'Poet of the West'
        },

        howard_hawks: {
            id: 'howard_hawks',
            name: 'Howard Hawks',
            talent: 94,
            weeklyRate: 4800,
            genres: ['comedy', 'western', 'noir', 'adventure'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 15,
            specialties: ['dialogue', 'professionalism', 'strong women'],
            description: 'Genre master'
        },

        alfred_hitchcock: {
            id: 'alfred_hitchcock',
            name: 'Alfred Hitchcock',
            talent: 98,
            weeklyRate: 6000,
            genres: ['thriller', 'noir', 'suspense'],
            availableFrom: 1940, // Came to Hollywood in 1939
            availableTo: 1949,
            oscarPotential: 20, // Never won competitive Oscar
            specialties: ['suspense', 'visual storytelling', 'psychology'],
            description: 'Master of Suspense'
        },

        billy_wilder: {
            id: 'billy_wilder',
            name: 'Billy Wilder',
            talent: 96,
            weeklyRate: 5000,
            genres: ['noir', 'comedy', 'drama'],
            availableFrom: 1942, // Directorial debut
            availableTo: 1949,
            oscarWinner: true, // The Lost Weekend (1945)
            specialties: ['cynicism', 'wit', 'dark comedy'],
            description: 'Cynical genius'
        },

        william_wyler: {
            id: 'william_wyler',
            name: 'William Wyler',
            talent: 94,
            weeklyRate: 4900,
            genres: ['drama', 'romance', 'war'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Mrs. Miniver (1942), The Best Years of Our Lives (1946)
            specialties: ['prestige', 'literary adaptations', 'depth'],
            description: 'Meticulous craftsman'
        },

        george_cukor: {
            id: 'george_cukor',
            name: 'George Cukor',
            talent: 91,
            weeklyRate: 4500,
            genres: ['comedy', 'drama', 'romance'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 15,
            specialties: ['women\'s pictures', 'sophisticated dialogue', 'actor direction'],
            description: 'Women\'s director'
        },

        // A-List Directors (Talent: 80-89)
        orson_welles: {
            id: 'orson_welles',
            name: 'Orson Welles',
            talent: 99, // Genius but difficult
            weeklyRate: 5500,
            genres: ['drama', 'noir', 'thriller'],
            availableFrom: 1941, // Citizen Kane
            availableTo: 1949,
            oscarWinner: true, // Citizen Kane screenplay (1941)
            specialties: ['innovation', 'visual brilliance', 'controversy'],
            budgetRisk: true, // Often over budget
            description: 'Enfant terrible'
        },

        preston_sturges: {
            id: 'preston_sturges',
            name: 'Preston Sturges',
            talent: 90,
            weeklyRate: 4300,
            genres: ['comedy', 'satire'],
            availableFrom: 1940,
            availableTo: 1949,
            oscarWinner: true, // The Great McGinty screenplay (1940)
            specialties: ['screwball', 'satire', 'rapid dialogue'],
            description: 'Comedy innovator'
        },

        john_huston: {
            id: 'john_huston',
            name: 'John Huston',
            talent: 92,
            weeklyRate: 4600,
            genres: ['noir', 'drama', 'adventure'],
            availableFrom: 1941,
            availableTo: 1949,
            draftRisk: true, // Made war documentaries 1942-1945
            oscarWinner: true, // The Treasure of the Sierra Madre (1948)
            specialties: ['hard-boiled', 'literary adaptation', 'male bonding'],
            description: 'Adventure storyteller'
        },

        michael_curtiz: {
            id: 'michael_curtiz',
            name: 'Michael Curtiz',
            talent: 88,
            weeklyRate: 4000,
            genres: ['drama', 'adventure', 'war', 'musical'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Casablanca (1943)
            specialties: ['versatility', 'pace', 'professionalism'],
            description: 'Studio workhorse'
        },

        ernst_lubitsch: {
            id: 'ernst_lubitsch',
            name: 'Ernst Lubitsch',
            talent: 93,
            weeklyRate: 4700,
            genres: ['comedy', 'romance', 'musical'],
            availableFrom: 1933,
            availableTo: 1947, // Died 1947
            oscarPotential: 18,
            specialties: ['sophistication', 'the lubitsch touch', 'wit'],
            description: 'Master of innuendo'
        },

        // B-List Directors (Talent: 70-79)
        jacques_tourneur: {
            id: 'jacques_tourneur',
            name: 'Jacques Tourneur',
            talent: 78,
            weeklyRate: 2800,
            genres: ['noir', 'horror', 'thriller'],
            availableFrom: 1939,
            availableTo: 1949,
            oscarPotential: 8,
            specialties: ['atmosphere', 'shadows', 'psychological horror'],
            description: 'Atmospheric stylist'
        },

        edward_dmytryk: {
            id: 'edward_dmytryk',
            name: 'Edward Dmytryk',
            talent: 76,
            weeklyRate: 2600,
            genres: ['noir', 'drama', 'thriller'],
            availableFrom: 1939,
            availableTo: 1949,
            huacRisk: true, // One of the Hollywood Ten
            oscarPotential: 10,
            specialties: ['social issues', 'noir style'],
            description: 'Social realist'
        },

        robert_siodmak: {
            id: 'robert_siodmak',
            name: 'Robert Siodmak',
            talent: 82,
            weeklyRate: 3200,
            genres: ['noir', 'thriller', 'crime'],
            availableFrom: 1940,
            availableTo: 1949,
            oscarPotential: 12,
            specialties: ['expressionism', 'shadows', 'fatalism'],
            description: 'Noir specialist'
        }
    };

    /**
     * Get available actors for a given year
     */
    function getAvailableActors(year, gameState) {
        const available = [];

        for (const actorId in ACTORS) {
            const actor = ACTORS[actorId];

            // Check availability window
            if (year < actor.availableFrom || year > actor.availableTo) {
                continue;
            }

            // Check if drafted (1942-1945 for draft-risk actors)
            if (actor.draftRisk && gameState.warActive && year >= 1942 && year <= 1945) {
                continue;
            }

            available.push(actor);
        }

        return available;
    }

    /**
     * Get available directors for a given year
     */
    function getAvailableDirectors(year, gameState) {
        const available = [];

        for (const directorId in DIRECTORS) {
            const director = DIRECTORS[directorId];

            // Check availability window
            if (year < director.availableFrom || year > director.availableTo) {
                continue;
            }

            // Check if drafted (1942-1945 for draft-risk directors)
            if (director.draftRisk && gameState.warActive && year >= 1942 && year <= 1945) {
                continue;
            }

            // Check HUAC blacklist
            if (director.huacRisk && gameState.blacklistActive) {
                continue;
            }

            available.push(director);
        }

        return available;
    }

    /**
     * Get talent by ID
     */
    function getActorById(id) {
        return ACTORS[id] || null;
    }

    function getDirectorById(id) {
        return DIRECTORS[id] || null;
    }

    /**
     * Calculate total cast cost
     */
    function calculateCastCost(actors, productionWeeks) {
        let totalCost = 0;

        for (const actorId of actors) {
            const actor = ACTORS[actorId];
            if (actor) {
                totalCost += actor.weeklyRate * productionWeeks;
            }
        }

        return totalCost;
    }

    /**
     * Calculate director cost
     */
    function calculateDirectorCost(directorId, productionWeeks) {
        const director = DIRECTORS[directorId];
        if (!director) return 0;

        return director.weeklyRate * productionWeeks;
    }

    /**
     * Calculate film quality bonus from talent
     */
    function calculateTalentQualityBonus(directorId, actorIds) {
        let qualityBonus = 0;

        // Director contribution (60% of talent impact)
        const director = DIRECTORS[directorId];
        if (director) {
            qualityBonus += (director.talent / 100) * 0.6 * 100;
        }

        // Actor contribution (40% of talent impact, averaged)
        if (actorIds && actorIds.length > 0) {
            let actorTotalPower = 0;
            for (const actorId of actorIds) {
                const actor = ACTORS[actorId];
                if (actor) {
                    actorTotalPower += actor.starPower;
                }
            }
            const avgActorPower = actorTotalPower / actorIds.length;
            qualityBonus += (avgActorPower / 100) * 0.4 * 100;
        }

        return Math.round(qualityBonus);
    }

    /**
     * Calculate box office appeal from cast
     */
    function calculateCastAppeal(actorIds) {
        if (!actorIds || actorIds.length === 0) return 0;

        let totalStarPower = 0;
        for (const actorId of actorIds) {
            const actor = ACTORS[actorId];
            if (actor) {
                totalStarPower += actor.starPower;
            }
        }

        // Return average star power as appeal multiplier
        return totalStarPower / actorIds.length / 100;
    }

    /**
     * Initialize morale and loyalty for all talent
     */
    function initializeTalentMorale() {
        // Initialize actors
        for (const actorId in ACTORS) {
            const actor = ACTORS[actorId];
            if (actor.morale === undefined) {
                actor.morale = 70 + Math.floor(Math.random() * 20); // 70-90
            }
            if (actor.loyalty === undefined) {
                actor.loyalty = 30 + Math.floor(Math.random() * 40); // 30-70
            }
        }

        // Initialize directors
        for (const directorId in DIRECTORS) {
            const director = DIRECTORS[directorId];
            if (director.morale === undefined) {
                director.morale = 70 + Math.floor(Math.random() * 20); // 70-90
            }
            if (director.loyalty === undefined) {
                director.loyalty = 30 + Math.floor(Math.random() * 40); // 30-70
            }
        }
    }

    /**
     * Update talent morale after film completion
     * Called when a film finishes its box office run
     */
    function updateTalentMorale(film, boxOfficeResults) {
        if (!film.cast && !film.director) return;

        const budget = film.actualBudget || film.currentBudget || film.originalBudget || 0;
        const netProfit = boxOfficeResults.netRevenue || 0;
        const isHit = netProfit > budget * 0.5; // 50% profit margin
        const isFlop = netProfit < 0;

        // Update cast morale
        if (film.cast && Array.isArray(film.cast)) {
            film.cast.forEach(castMember => {
                const actorId = castMember.id;
                const actor = ACTORS[actorId];
                if (actor) {
                    updateActorMorale(actor, film, isHit, isFlop, boxOfficeResults);
                }
            });
        }

        // Update director morale
        if (film.director && film.director.id) {
            const director = DIRECTORS[film.director.id];
            if (director) {
                updateDirectorMorale(director, film, isHit, isFlop, boxOfficeResults);
            }
        }
    }

    /**
     * Update actor morale and loyalty
     */
    function updateActorMorale(actor, film, isHit, isFlop, boxOfficeResults) {
        let moraleChange = 0;
        let loyaltyChange = 0;

        if (isHit) {
            moraleChange += 15;
            loyaltyChange += 10;
        } else if (isFlop) {
            moraleChange -= 10;
            loyaltyChange -= 5;
        }

        // Quality bonus/penalty
        const quality = film.finalQuality || film.scriptQuality || 50;
        if (quality >= 80) {
            moraleChange += 5;
        } else if (quality < 50) {
            moraleChange -= 5;
        }

        // Critical reception impact
        if (boxOfficeResults.criticalReception) {
            const reception = boxOfficeResults.criticalReception.type;
            if (reception === 'rave') {
                moraleChange += 10;
                loyaltyChange += 5;
            } else if (reception === 'savage') {
                moraleChange -= 10;
            }
        }

        // Production issues penalty
        if (film.crisisCount > 3) {
            moraleChange -= 5; // Overwork
            loyaltyChange -= 3;
        }

        // Apply changes
        actor.morale = Math.max(50, Math.min(100, actor.morale + moraleChange));
        actor.loyalty = Math.max(0, Math.min(100, actor.loyalty + loyaltyChange));
    }

    /**
     * Update director morale and loyalty
     */
    function updateDirectorMorale(director, film, isHit, isFlop, boxOfficeResults) {
        let moraleChange = 0;
        let loyaltyChange = 0;

        if (isHit) {
            moraleChange += 20;
            loyaltyChange += 15;
        } else if (isFlop) {
            moraleChange -= 15;
            loyaltyChange -= 8;
        }

        // Quality impact (directors care more about quality)
        const quality = film.finalQuality || film.scriptQuality || 50;
        if (quality >= 80) {
            moraleChange += 10;
            loyaltyChange += 5;
        } else if (quality < 50) {
            moraleChange -= 8;
            loyaltyChange -= 5;
        }

        // Critical reception (directors care about this)
        if (boxOfficeResults.criticalReception) {
            const reception = boxOfficeResults.criticalReception.type;
            if (reception === 'rave') {
                moraleChange += 15;
                loyaltyChange += 8;
            } else if (reception === 'savage') {
                moraleChange -= 15;
                loyaltyChange -= 5;
            }
        }

        // Budget overruns penalty
        if (!film.onBudget) {
            moraleChange -= 5;
        }

        // Apply changes
        director.morale = Math.max(50, Math.min(100, director.morale + moraleChange));
        director.loyalty = Math.max(0, Math.min(100, director.loyalty + loyaltyChange));
    }

    /**
     * Update morale after awards
     */
    function updateMoraleAfterAwards(winners, gameState) {
        // Boost morale for talent in winning films
        Object.values(winners).forEach(winningFilm => {
            if (winningFilm.cast) {
                winningFilm.cast.forEach(castMember => {
                    const actor = ACTORS[castMember.id];
                    if (actor) {
                        actor.morale = Math.min(100, actor.morale + 20);
                        actor.loyalty = Math.min(100, actor.loyalty + 15);
                    }
                });
            }

            if (winningFilm.director) {
                const director = DIRECTORS[winningFilm.director.id];
                if (director) {
                    director.morale = Math.min(100, director.morale + 25);
                    director.loyalty = Math.min(100, director.loyalty + 20);
                }
            }
        });
    }

    /**
     * Get talent performance modifier based on morale
     * Returns multiplier for quality (0.8 to 1.2)
     */
    function getTalentPerformanceModifier(talentId, isActor = true) {
        const talent = isActor ? ACTORS[talentId] : DIRECTORS[talentId];
        if (!talent) return 1.0;

        const morale = talent.morale || 75;

        // Morale affects performance quality
        // 50 morale = 0.8x, 75 morale = 1.0x, 100 morale = 1.2x
        return 0.8 + ((morale - 50) / 50) * 0.4;
    }

    // Initialize all talent morale on load
    initializeTalentMorale();

    // Public API
    return {
        ACTORS,
        DIRECTORS,
        getAvailableActors,
        getAvailableDirectors,
        getActorById,
        getDirectorById,
        calculateCastCost,
        calculateDirectorCost,
        calculateTalentQualityBonus,
        calculateCastAppeal,
        updateTalentMorale,
        updateMoraleAfterAwards,
        getTalentPerformanceModifier,
        initializeTalentMorale
    };
})();
