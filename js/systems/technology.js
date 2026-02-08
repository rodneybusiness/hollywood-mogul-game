/**
 * HOLLYWOOD MOGUL - TECHNOLOGY SYSTEM
 * Studio technology tree from Technicolor through CGI and 3D.
 * Each technology has a cost, year of availability, prerequisites,
 * and benefits that affect production quality and box office.
 *
 * Technologies are purchased from the studio lot screen and stored
 * in gameState.technologies[].
 */
window.TechnologySystem = (function() {
    'use strict';

    // ================================================================
    // TECHNOLOGY DEFINITIONS
    // Each tech: id, name, cost, yearAvailable, prerequisites[],
    //   maintenanceCost, benefits{}, description
    // ================================================================

    var TECHNOLOGIES = {
        COLOR_FILM: {
            id: 'color_film',
            name: 'Technicolor Process',
            cost: 200000,
            yearAvailable: 1935,
            prerequisites: [],
            maintenanceCost: 3000,
            description: 'Three-strip Technicolor — vivid color that dazzles audiences and commands premium ticket prices.',
            benefits: {
                qualityBonus: 5,
                revenueMultiplier: 1.20,
                budgetMultiplier: 1.15 // Color films cost ~15% more
            }
        },
        WIDESCREEN: {
            id: 'widescreen',
            name: 'CinemaScope Widescreen',
            cost: 350000,
            yearAvailable: 1953,
            prerequisites: [],
            maintenanceCost: 4000,
            description: 'Anamorphic widescreen — the ultimate weapon against television. Audiences flock to see the big picture.',
            benefits: {
                qualityBonus: 4,
                revenueMultiplier: 1.25,
                tvDefenseBonus: 0.15, // Reduces TV competition penalty by 15%
                budgetMultiplier: 1.10
            }
        },
        STEREO_SOUND: {
            id: 'stereo_sound',
            name: 'Stereophonic Sound',
            cost: 150000,
            yearAvailable: 1958,
            prerequisites: [],
            maintenanceCost: 2000,
            description: 'Multi-channel stereo sound — immersive audio that television simply cannot match.',
            benefits: {
                qualityBonus: 3,
                revenueMultiplier: 1.08,
                tvDefenseBonus: 0.05
            }
        },
        SPECIAL_EFFECTS: {
            id: 'special_effects',
            name: 'Special Effects Department',
            cost: 400000,
            yearAvailable: 1963,
            prerequisites: [],
            maintenanceCost: 6000,
            description: 'Miniatures, matte paintings, and optical compositing — bring impossible worlds to life.',
            benefits: {
                qualityBonus: 6,
                revenueMultiplier: 1.15,
                genreBonus: { sci_fi: 0.20, action: 0.10, adventure: 0.10 }
            }
        },
        DOLBY_STEREO: {
            id: 'dolby_stereo',
            name: 'Dolby Stereo',
            cost: 250000,
            yearAvailable: 1977,
            prerequisites: ['stereo_sound'],
            maintenanceCost: 3000,
            description: 'Dolby noise reduction and four-channel surround — the cinema sound revolution.',
            benefits: {
                qualityBonus: 4,
                revenueMultiplier: 1.10,
                genreBonus: { action: 0.10, sci_fi: 0.08, horror: 0.05 }
            }
        },
        CGI_BASIC: {
            id: 'cgi_basic',
            name: 'Computer Graphics (Basic CGI)',
            cost: 2000000,
            yearAvailable: 1993,
            prerequisites: ['special_effects'],
            maintenanceCost: 15000,
            description: 'Digital visual effects — create creatures, environments, and spectacles previously impossible.',
            benefits: {
                qualityBonus: 8,
                revenueMultiplier: 1.20,
                genreBonus: { sci_fi: 0.25, action: 0.15, animated: 0.30, superhero: 0.20 }
            }
        },
        DIGITAL_FILMMAKING: {
            id: 'digital_filmmaking',
            name: 'Digital Filmmaking',
            cost: 1500000,
            yearAvailable: 2002,
            prerequisites: [],
            maintenanceCost: 8000,
            description: 'Digital cameras and non-linear editing — faster production, lower costs, more creative freedom.',
            benefits: {
                qualityBonus: 3,
                revenueMultiplier: 1.05,
                budgetMultiplier: 0.85, // 15% budget savings
                productionSpeedBonus: 15 // 15% faster production
            }
        },
        CGI_ADVANCED: {
            id: 'cgi_advanced',
            name: 'Advanced CGI & Motion Capture',
            cost: 5000000,
            yearAvailable: 2004,
            prerequisites: ['cgi_basic', 'digital_filmmaking'],
            maintenanceCost: 25000,
            description: 'Performance capture, photorealistic rendering — fully digital characters and environments.',
            benefits: {
                qualityBonus: 10,
                revenueMultiplier: 1.30,
                genreBonus: { sci_fi: 0.30, action: 0.25, animated: 0.40, superhero: 0.35 }
            }
        },
        THREE_D: {
            id: 'three_d',
            name: '3D Projection (RealD)',
            cost: 3000000,
            yearAvailable: 2009,
            prerequisites: ['cgi_advanced'],
            maintenanceCost: 12000,
            description: 'Stereoscopic 3D — premium ticket prices and spectacle audiences crave.',
            benefits: {
                qualityBonus: 2,
                revenueMultiplier: 1.25,
                genreBonus: { action: 0.15, animated: 0.20, sci_fi: 0.15 }
            }
        }
    };

    // ================================================================
    // CORE FUNCTIONS
    // ================================================================

    /**
     * Initialize technology state
     */
    function initializeTechnologies(gameState) {
        if (!gameState.technologies) {
            gameState.technologies = [];
        }
    }

    /**
     * Check if a specific technology is owned
     */
    function hasTechnology(techId, gameState) {
        if (!gameState.technologies) return false;
        return gameState.technologies.some(function(t) { return t.id === techId; });
    }

    /**
     * Get all owned technology IDs
     */
    function getOwnedTechIds(gameState) {
        if (!gameState.technologies) return [];
        return gameState.technologies.map(function(t) { return t.id; });
    }

    /**
     * Purchase a technology
     */
    function purchaseTechnology(techKey, gameState) {
        var tech = TECHNOLOGIES[techKey];
        if (!tech) {
            return { success: false, message: 'Unknown technology' };
        }

        // Already owned?
        if (hasTechnology(tech.id, gameState)) {
            return { success: false, message: 'Already researched' };
        }

        // Year gate
        if (gameState.gameYear < tech.yearAvailable) {
            return { success: false, message: 'Not available until ' + tech.yearAvailable };
        }

        // Prerequisites
        var owned = getOwnedTechIds(gameState);
        for (var i = 0; i < tech.prerequisites.length; i++) {
            if (owned.indexOf(tech.prerequisites[i]) === -1) {
                var prereqDef = findTechById(tech.prerequisites[i]);
                var prereqName = prereqDef ? prereqDef.name : tech.prerequisites[i];
                return { success: false, message: 'Requires: ' + prereqName };
            }
        }

        // Afford check (scale cost by era inflation)
        var scaledCost = tech.cost;
        if (window.GameConstants && window.GameConstants.getEraScalingForYear) {
            var scaling = window.GameConstants.getEraScalingForYear(gameState.gameYear);
            // Tech costs are already era-appropriate, so only apply mild scaling
            // for techs available in multiple eras
            var techEraScaling = window.GameConstants.getEraScalingForYear(tech.yearAvailable);
            var relativeMult = scaling.inflationMult / (techEraScaling.inflationMult || 1);
            if (relativeMult > 1.5) {
                scaledCost = Math.floor(tech.cost * Math.min(relativeMult, 3.0));
            }
        }

        if (gameState.cash < scaledCost) {
            return { success: false, message: 'Insufficient funds. Need $' + scaledCost.toLocaleString() };
        }

        // Purchase
        gameState.cash -= scaledCost;
        if (!gameState.technologies) gameState.technologies = [];
        gameState.technologies.push({
            id: tech.id,
            name: tech.name,
            purchaseDate: new Date(gameState.currentDate),
            purchaseYear: gameState.gameYear,
            cost: scaledCost,
            maintenanceCost: tech.maintenanceCost,
            benefits: tech.benefits
        });

        // Alert
        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'success',
                icon: '\u2699\uFE0F',
                message: 'Technology acquired: ' + tech.name + ' ($' + scaledCost.toLocaleString() + ')',
                priority: 'high'
            });
        }

        return { success: true, message: tech.name + ' is now available for your productions!', tech: tech };
    }

    /**
     * Get technologies available for purchase
     */
    function getAvailableTechnologies(gameState) {
        var available = [];
        var owned = getOwnedTechIds(gameState);

        for (var key in TECHNOLOGIES) {
            var tech = TECHNOLOGIES[key];
            if (owned.indexOf(tech.id) !== -1) continue; // Already owned

            var prereqsMet = true;
            for (var i = 0; i < tech.prerequisites.length; i++) {
                if (owned.indexOf(tech.prerequisites[i]) === -1) {
                    prereqsMet = false;
                    break;
                }
            }

            var yearOk = gameState.gameYear >= tech.yearAvailable;

            available.push({
                key: key,
                id: tech.id,
                name: tech.name,
                cost: tech.cost,
                yearAvailable: tech.yearAvailable,
                description: tech.description,
                benefits: tech.benefits,
                maintenanceCost: tech.maintenanceCost,
                prerequisites: tech.prerequisites,
                prereqsMet: prereqsMet,
                yearMet: yearOk,
                canPurchase: prereqsMet && yearOk && gameState.cash >= tech.cost
            });
        }

        return available;
    }

    // ================================================================
    // BENEFIT CALCULATORS — called by other systems
    // ================================================================

    /**
     * Get total quality bonus from all owned technologies
     */
    function getTotalQualityBonus(gameState) {
        if (!gameState.technologies) return 0;
        var bonus = 0;
        for (var i = 0; i < gameState.technologies.length; i++) {
            bonus += gameState.technologies[i].benefits.qualityBonus || 0;
        }
        return bonus;
    }

    /**
     * Get combined revenue multiplier from all owned technologies
     */
    function getTotalRevenueMultiplier(gameState) {
        if (!gameState.technologies) return 1.0;
        var mult = 1.0;
        for (var i = 0; i < gameState.technologies.length; i++) {
            var rm = gameState.technologies[i].benefits.revenueMultiplier;
            if (rm && rm !== 1.0) {
                // Diminishing stacking: each tech adds (mult-1)*0.5 after the first
                if (mult === 1.0) {
                    mult = rm;
                } else {
                    mult += (rm - 1.0) * 0.5;
                }
            }
        }
        return mult;
    }

    /**
     * Get genre-specific bonus from owned technologies
     */
    function getGenreBonus(genre, gameState) {
        if (!gameState.technologies) return 0;
        var lowerGenre = (genre || '').toLowerCase();
        var bonus = 0;
        for (var i = 0; i < gameState.technologies.length; i++) {
            var gb = gameState.technologies[i].benefits.genreBonus;
            if (gb && gb[lowerGenre]) {
                bonus += gb[lowerGenre];
            }
        }
        return bonus;
    }

    /**
     * Get TV defense bonus (reduces TV competition penalty)
     */
    function getTvDefenseBonus(gameState) {
        if (!gameState.technologies) return 0;
        var bonus = 0;
        for (var i = 0; i < gameState.technologies.length; i++) {
            bonus += gameState.technologies[i].benefits.tvDefenseBonus || 0;
        }
        return Math.min(bonus, 0.5); // Cap at 50% reduction
    }

    /**
     * Get budget cost multiplier from technology (e.g. digital filmmaking = cheaper)
     */
    function getBudgetMultiplier(gameState) {
        if (!gameState.technologies) return 1.0;
        var mult = 1.0;
        for (var i = 0; i < gameState.technologies.length; i++) {
            var bm = gameState.technologies[i].benefits.budgetMultiplier;
            if (bm) {
                mult *= bm;
            }
        }
        return mult;
    }

    /**
     * Get production speed bonus percentage
     */
    function getProductionSpeedBonus(gameState) {
        if (!gameState.technologies) return 0;
        var bonus = 0;
        for (var i = 0; i < gameState.technologies.length; i++) {
            bonus += gameState.technologies[i].benefits.productionSpeedBonus || 0;
        }
        return bonus;
    }

    /**
     * Get total monthly maintenance from owned technologies
     */
    function getTotalMaintenanceCost(gameState) {
        if (!gameState.technologies) return 0;
        var cost = 0;
        for (var i = 0; i < gameState.technologies.length; i++) {
            cost += gameState.technologies[i].maintenanceCost || 0;
        }
        return cost;
    }

    // ================================================================
    // HELPERS
    // ================================================================

    function findTechById(techId) {
        for (var key in TECHNOLOGIES) {
            if (TECHNOLOGIES[key].id === techId) return TECHNOLOGIES[key];
        }
        return null;
    }

    // ================================================================
    // PUBLIC API
    // ================================================================

    return {
        initializeTechnologies: initializeTechnologies,
        purchaseTechnology: purchaseTechnology,
        hasTechnology: hasTechnology,
        getAvailableTechnologies: getAvailableTechnologies,
        getOwnedTechIds: getOwnedTechIds,

        // Benefit calculators for other systems
        getTotalQualityBonus: getTotalQualityBonus,
        getTotalRevenueMultiplier: getTotalRevenueMultiplier,
        getGenreBonus: getGenreBonus,
        getTvDefenseBonus: getTvDefenseBonus,
        getBudgetMultiplier: getBudgetMultiplier,
        getProductionSpeedBonus: getProductionSpeedBonus,
        getTotalMaintenanceCost: getTotalMaintenanceCost,

        // Data
        TECHNOLOGIES: TECHNOLOGIES
    };
})();
