/**
 * HOLLYWOOD MOGUL - FRANCHISE / SEQUEL SYSTEM
 * When a film performs well at the box office, the player can
 * develop sequels. Franchises provide built-in audience bonuses
 * but face diminishing creative returns.
 *
 * Key mechanics:
 * - Films earning > 2× budget qualify for franchise creation
 * - Sequel scripts auto-generated with higher budgets, built-in audience
 * - Each sequel has -5 quality ceiling (diminishing creative returns)
 * - Franchise awareness provides box office multiplier
 * - Late eras (1990s+) reward franchise films heavily
 */
window.FranchiseSystem = (function() {
    'use strict';

    // ================================================================
    // FRANCHISE ERA BONUSES
    // How much extra revenue franchise films earn by era
    // (reflects the cultural shift toward franchise-driven cinema)
    // ================================================================

    var FRANCHISE_ERA_BONUS = {
        PRE_CODE: 1.05,        // Sequels uncommon
        GOLDEN_AGE: 1.10,      // Series films exist (Andy Hardy, Thin Man)
        WAR_YEARS: 1.10,
        POST_WAR: 1.10,
        TV_THREAT: 1.15,       // Sequels help brand recognition
        NEW_WAVE: 1.12,        // Auteur era — sequels less valued
        RATINGS_ERA: 1.15,
        NEW_HOLLYWOOD: 1.25,   // Star Wars, Godfather II prove sequel power
        BLOCKBUSTER_AGE: 1.40, // Franchise era begins (Indiana Jones, Aliens, etc.)
        INDIE_BOOM: 1.50,      // Franchise + indie coexist
        DIGITAL_DAWN: 1.65,    // Lord of the Rings, Harry Potter, Spider-Man
        CONVERGENCE: 1.80      // MCU dominance — franchises are the business model
    };

    // Diminishing returns per sequel number
    var SEQUEL_QUALITY_PENALTY = -5;     // Each sequel loses 5 max quality
    var SEQUEL_AUDIENCE_RETENTION = 0.85; // Each sequel retains 85% of previous audience
    var MIN_PROFIT_RATIO = 2.0;           // Film must earn 2× budget to qualify

    // ================================================================
    // CORE FUNCTIONS
    // ================================================================

    /**
     * Initialize franchise tracking in game state
     */
    function initializeFranchises(gameState) {
        if (!gameState.franchises) {
            gameState.franchises = [];
        }
    }

    /**
     * Check if a completed film qualifies for franchise creation.
     * Called after box office run completes.
     * @returns {boolean}
     */
    function qualifiesForFranchise(film) {
        if (!film) return false;

        // Must have completed theatrical run
        if (!film.distribution || !film.distribution.totalRevenue) return false;

        // Must not already be part of a franchise (unless it's a sequel that performed well)
        // Actually sequels can still qualify — the franchise just grows

        var budget = film.actualBudget || film.currentBudget || film.originalBudget || 0;
        if (budget <= 0) return false;

        var totalRevenue = film.distribution.totalRevenue || 0;
        // Include ancillary revenue if available
        if (film.ancillaryRevenue && film.ancillaryRevenue.total) {
            totalRevenue += film.ancillaryRevenue.total;
        }

        return totalRevenue >= budget * MIN_PROFIT_RATIO;
    }

    /**
     * Create a new franchise from a hit film, or add to existing franchise.
     */
    function createOrExtendFranchise(film, gameState) {
        if (!gameState.franchises) gameState.franchises = [];

        // Check if film is already part of a franchise
        var existingFranchise = null;
        if (film.franchiseId) {
            existingFranchise = gameState.franchises.find(function(f) {
                return f.id === film.franchiseId;
            });
        }

        if (existingFranchise) {
            // Extend existing franchise
            existingFranchise.filmCount += 1;
            existingFranchise.totalRevenue += (film.distribution.totalRevenue || 0);
            if (film.ancillaryRevenue) {
                existingFranchise.totalRevenue += film.ancillaryRevenue.total || 0;
            }
            existingFranchise.lastFilmYear = gameState.gameYear;
            existingFranchise.audienceLoyalty *= SEQUEL_AUDIENCE_RETENTION;

            return existingFranchise;
        } else {
            // Create new franchise
            var franchise = {
                id: 'franchise_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                name: film.title,
                originalFilmId: film.id,
                genre: film.genre,
                filmCount: 1,
                totalRevenue: (film.distribution.totalRevenue || 0) + (film.ancillaryRevenue ? film.ancillaryRevenue.total || 0 : 0),
                createdYear: gameState.gameYear,
                lastFilmYear: gameState.gameYear,
                audienceLoyalty: 1.0, // Starts at 100%
                baseQuality: film.scriptQuality || film.finalQuality || 70
            };

            gameState.franchises.push(franchise);
            film.franchiseId = franchise.id;

            return franchise;
        }
    }

    /**
     * Generate a sequel script for a franchise.
     * Returns a script object suitable for the script library.
     */
    function generateSequelScript(franchise, gameState) {
        var sequelNumber = franchise.filmCount + 1;
        var title = generateSequelTitle(franchise.name, sequelNumber);

        // Quality ceiling drops with each sequel
        var maxQuality = Math.max(40, franchise.baseQuality + (sequelNumber - 1) * SEQUEL_QUALITY_PENALTY);
        var quality = Math.floor(maxQuality * (0.75 + Math.random() * 0.25)); // 75-100% of max

        // Budget scales up with each sequel
        var budgetMultiplier = 1.0 + (sequelNumber - 1) * 0.3; // Each sequel 30% more expensive

        // Get era-appropriate base budget
        var baseBudget = 100000;
        if (window.GameConstants && window.GameConstants.getEraScalingForYear) {
            var scaling = window.GameConstants.getEraScalingForYear(gameState.gameYear);
            baseBudget = Math.floor((scaling.budgetRange[0] + scaling.budgetRange[1]) / 3);
        }
        var budget = Math.floor(baseBudget * budgetMultiplier);

        // Shooting days scale with budget
        var shootingDays = 18 + Math.floor(sequelNumber * 3);

        // Censor risk inherits from franchise genre
        var censorRisk = 30;
        var genre = franchise.genre || 'action';
        if (genre === 'horror' || genre === 'crime') censorRisk = 55;
        if (genre === 'action' || genre === 'thriller') censorRisk = 40;

        return {
            id: 'sequel_' + franchise.id + '_' + sequelNumber + '_' + Date.now(),
            title: title,
            genre: franchise.genre,
            budget: budget,
            quality: quality,
            shootingDays: shootingDays,
            censorRisk: censorRisk,
            description: 'Sequel #' + sequelNumber + ' in the "' + franchise.name + '" franchise. Built-in audience but creative pressure mounts.',
            historicalNotes: 'Franchise sequel — audiences expect bigger and better.',
            isSequel: true,
            franchiseId: franchise.id,
            sequelNumber: sequelNumber,
            audienceBonus: franchise.audienceLoyalty * getEraFranchiseBonus(gameState.gameYear)
        };
    }

    /**
     * Get the box office multiplier for a franchise film.
     * Applied in box office calculations.
     */
    function getFranchiseBoxOfficeMultiplier(film, gameState) {
        if (!film.franchiseId || !film.isSequel) return 1.0;

        var franchise = null;
        if (gameState.franchises) {
            franchise = gameState.franchises.find(function(f) { return f.id === film.franchiseId; });
        }
        if (!franchise) return 1.0;

        // Base franchise bonus from era
        var eraBonus = getEraFranchiseBonus(gameState.gameYear);

        // Audience loyalty decays per sequel
        var loyalty = franchise.audienceLoyalty;

        // Combined multiplier
        return eraBonus * loyalty;
    }

    /**
     * Get franchise-eligible completed films (for UI display).
     */
    function getFranchiseEligibleFilms(gameState) {
        if (!gameState.completedFilms) return [];

        return gameState.completedFilms.filter(function(film) {
            // Only films not already in a franchise with sequels pending
            return qualifiesForFranchise(film) && !hasSequelInProgress(film, gameState);
        });
    }

    /**
     * Get all active franchises with stats.
     */
    function getActiveFranchises(gameState) {
        if (!gameState.franchises) return [];

        return gameState.franchises.map(function(f) {
            return {
                id: f.id,
                name: f.name,
                filmCount: f.filmCount,
                totalRevenue: f.totalRevenue,
                audienceLoyalty: Math.round(f.audienceLoyalty * 100),
                createdYear: f.createdYear,
                lastFilmYear: f.lastFilmYear,
                genre: f.genre,
                canMakeSequel: canMakeSequel(f, gameState)
            };
        });
    }

    /**
     * Offer sequel to player after a hit film completes.
     * Called from box office system when theatrical run ends.
     */
    function checkAndOfferSequel(film, gameState) {
        if (!qualifiesForFranchise(film)) return null;

        var franchise = createOrExtendFranchise(film, gameState);

        // Generate sequel script
        var sequelScript = generateSequelScript(franchise, gameState);

        // Add to available scripts
        if (!gameState.availableScripts) gameState.availableScripts = [];
        gameState.availableScripts.push(sequelScript);

        // Alert player
        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'success',
                icon: '\uD83C\uDFAC',
                message: '"' + film.title + '" is a hit! Sequel script "' + sequelScript.title + '" now available.',
                priority: 'high'
            });
        }

        return { franchise: franchise, sequelScript: sequelScript };
    }

    // ================================================================
    // HELPERS
    // ================================================================

    function getEraFranchiseBonus(year) {
        var eraKey = 'PRE_CODE';
        if (window.GameConstants && window.GameConstants.getEraKeyForYear) {
            eraKey = window.GameConstants.getEraKeyForYear(year);
        }
        return FRANCHISE_ERA_BONUS[eraKey] || 1.0;
    }

    function generateSequelTitle(originalTitle, sequelNumber) {
        if (sequelNumber === 2) {
            var suffixes = [
                originalTitle + ' II',
                originalTitle + ': The Sequel',
                'Return of ' + originalTitle,
                originalTitle + ' Returns',
                originalTitle + ' 2'
            ];
            return suffixes[Math.floor(Math.random() * suffixes.length)];
        }
        if (sequelNumber === 3) {
            var tri = [
                originalTitle + ' III',
                originalTitle + ' 3',
                originalTitle + ': The Final Chapter'
            ];
            return tri[Math.floor(Math.random() * tri.length)];
        }
        // 4+
        return originalTitle + ' ' + sequelNumber;
    }

    function canMakeSequel(franchise, gameState) {
        // Don't allow sequels if too many already
        if (franchise.filmCount >= 8) return false;
        // Don't allow if audience loyalty is too low
        if (franchise.audienceLoyalty < 0.3) return false;
        // Must have been at least 1 year since last film
        if (gameState.gameYear - franchise.lastFilmYear < 1) return false;
        return true;
    }

    function hasSequelInProgress(film, gameState) {
        if (!film.franchiseId) return false;
        // Check if there's already a sequel script available or in production
        var franchiseId = film.franchiseId;
        var hasScript = (gameState.availableScripts || []).some(function(s) {
            return s.franchiseId === franchiseId;
        });
        var hasActive = (gameState.activeFilms || []).some(function(f) {
            return f.franchiseId === franchiseId;
        });
        return hasScript || hasActive;
    }

    // ================================================================
    // PUBLIC API
    // ================================================================

    return {
        initializeFranchises: initializeFranchises,
        qualifiesForFranchise: qualifiesForFranchise,
        createOrExtendFranchise: createOrExtendFranchise,
        generateSequelScript: generateSequelScript,
        getFranchiseBoxOfficeMultiplier: getFranchiseBoxOfficeMultiplier,
        getFranchiseEligibleFilms: getFranchiseEligibleFilms,
        getActiveFranchises: getActiveFranchises,
        checkAndOfferSequel: checkAndOfferSequel,
        canMakeSequel: canMakeSequel,

        // Data
        FRANCHISE_ERA_BONUS: FRANCHISE_ERA_BONUS,
        SEQUEL_QUALITY_PENALTY: SEQUEL_QUALITY_PENALTY,
        SEQUEL_AUDIENCE_RETENTION: SEQUEL_AUDIENCE_RETENTION
    };
})();
