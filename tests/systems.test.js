/**
 * HOLLYWOOD MOGUL - SYSTEMS TEST SUITE
 * Comprehensive tests for Technology, TV Competition, Franchise, and Save/Load systems.
 */

// ================================================================
// TECHNOLOGY SYSTEM TESTS
// ================================================================

describe('TechnologySystem', () => {
    let gameState;

    beforeEach(() => {
        // Load modules in dependency order (require caches, so IIFEs only run once)
        jest.resetModules();
        require('../js/core/constants.js');
        require('../js/systems/technology.js');

        gameState = {
            gameYear: 1960,
            cash: 5000000,
            currentDate: new Date(1960, 0, 1),
            technologies: []
        };
    });

    describe('purchaseTechnology', () => {
        test('should succeed with valid tech key, sufficient funds, and correct year', () => {
            gameState.gameYear = 1936;
            gameState.cash = 500000;
            const result = window.TechnologySystem.purchaseTechnology('COLOR_FILM', gameState);

            expect(result.success).toBe(true);
            expect(result.tech).toBeDefined();
            expect(result.tech.id).toBe('color_film');
            expect(gameState.technologies.length).toBe(1);
            expect(gameState.technologies[0].id).toBe('color_film');
            expect(gameState.cash).toBeLessThan(500000);
        });

        test('should deduct the correct cost from cash', () => {
            gameState.gameYear = 1935;
            gameState.cash = 500000;
            const result = window.TechnologySystem.purchaseTechnology('COLOR_FILM', gameState);

            expect(result.success).toBe(true);
            // COLOR_FILM costs 200000
            expect(gameState.cash).toBe(300000);
        });

        test('should store purchase metadata on the technology entry', () => {
            gameState.gameYear = 1953;
            gameState.cash = 1000000;
            const result = window.TechnologySystem.purchaseTechnology('WIDESCREEN', gameState);

            expect(result.success).toBe(true);
            const owned = gameState.technologies[0];
            expect(owned.id).toBe('widescreen');
            expect(owned.name).toBe('CinemaScope Widescreen');
            expect(owned.purchaseYear).toBe(1953);
            expect(owned.benefits).toBeDefined();
            expect(owned.benefits.qualityBonus).toBe(4);
        });

        test('should fail with unknown tech key', () => {
            const result = window.TechnologySystem.purchaseTechnology('HOLOGRAM_PROJECTOR', gameState);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Unknown technology');
            expect(gameState.technologies.length).toBe(0);
        });

        test('should fail when already owned', () => {
            gameState.gameYear = 1958;
            gameState.cash = 1000000;
            window.TechnologySystem.purchaseTechnology('STEREO_SOUND', gameState);
            const result = window.TechnologySystem.purchaseTechnology('STEREO_SOUND', gameState);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Already researched');
        });

        test('should fail with insufficient funds', () => {
            gameState.gameYear = 1953;
            gameState.cash = 100; // Not enough for WIDESCREEN (350000)
            const result = window.TechnologySystem.purchaseTechnology('WIDESCREEN', gameState);

            expect(result.success).toBe(false);
            expect(result.message).toMatch(/Insufficient funds/);
            expect(gameState.technologies.length).toBe(0);
            expect(gameState.cash).toBe(100); // Unchanged
        });
    });

    describe('year gating', () => {
        test('should fail when year is before yearAvailable', () => {
            gameState.gameYear = 1934; // COLOR_FILM available 1935
            gameState.cash = 500000;
            const result = window.TechnologySystem.purchaseTechnology('COLOR_FILM', gameState);

            expect(result.success).toBe(false);
            expect(result.message).toMatch(/Not available until 1935/);
        });

        test('should succeed when year matches yearAvailable exactly', () => {
            gameState.gameYear = 1935;
            gameState.cash = 500000;
            const result = window.TechnologySystem.purchaseTechnology('COLOR_FILM', gameState);

            expect(result.success).toBe(true);
        });

        test('should succeed when year is after yearAvailable', () => {
            gameState.gameYear = 1960;
            gameState.cash = 5000000;
            const result = window.TechnologySystem.purchaseTechnology('COLOR_FILM', gameState);

            expect(result.success).toBe(true);
        });

        test('should block future techs even with enough cash', () => {
            gameState.gameYear = 1950;
            gameState.cash = 100000000;
            const result = window.TechnologySystem.purchaseTechnology('CGI_BASIC', gameState);

            expect(result.success).toBe(false);
            expect(result.message).toMatch(/Not available until 1993/);
        });
    });

    describe('prerequisites', () => {
        test('should fail when prerequisite is not owned', () => {
            // CGI_BASIC requires special_effects
            gameState.gameYear = 1993;
            gameState.cash = 10000000;
            const result = window.TechnologySystem.purchaseTechnology('CGI_BASIC', gameState);

            expect(result.success).toBe(false);
            expect(result.message).toMatch(/Requires/);
        });

        test('should succeed when single prerequisite is met', () => {
            gameState.gameYear = 1993;
            gameState.cash = 10000000;

            // Buy SPECIAL_EFFECTS first (available 1963, no prereqs)
            const prereqResult = window.TechnologySystem.purchaseTechnology('SPECIAL_EFFECTS', gameState);
            expect(prereqResult.success).toBe(true);

            const result = window.TechnologySystem.purchaseTechnology('CGI_BASIC', gameState);
            expect(result.success).toBe(true);
        });

        test('should fail when only one of multiple prerequisites is met', () => {
            // CGI_ADVANCED requires both cgi_basic and digital_filmmaking
            gameState.gameYear = 2004;
            gameState.cash = 50000000;

            // Buy chain up to CGI_BASIC but not DIGITAL_FILMMAKING
            window.TechnologySystem.purchaseTechnology('SPECIAL_EFFECTS', gameState);
            window.TechnologySystem.purchaseTechnology('CGI_BASIC', gameState);

            const result = window.TechnologySystem.purchaseTechnology('CGI_ADVANCED', gameState);
            expect(result.success).toBe(false);
            expect(result.message).toMatch(/Requires/);
        });

        test('should succeed when all multiple prerequisites are met', () => {
            gameState.gameYear = 2004;
            gameState.cash = 50000000;

            window.TechnologySystem.purchaseTechnology('SPECIAL_EFFECTS', gameState);
            window.TechnologySystem.purchaseTechnology('CGI_BASIC', gameState);
            window.TechnologySystem.purchaseTechnology('DIGITAL_FILMMAKING', gameState);

            const result = window.TechnologySystem.purchaseTechnology('CGI_ADVANCED', gameState);
            expect(result.success).toBe(true);
        });

        test('should enforce prerequisite chain for DOLBY_STEREO', () => {
            gameState.gameYear = 1977;
            gameState.cash = 10000000;

            // DOLBY_STEREO requires stereo_sound
            const result = window.TechnologySystem.purchaseTechnology('DOLBY_STEREO', gameState);
            expect(result.success).toBe(false);

            window.TechnologySystem.purchaseTechnology('STEREO_SOUND', gameState);
            const result2 = window.TechnologySystem.purchaseTechnology('DOLBY_STEREO', gameState);
            expect(result2.success).toBe(true);
        });

        test('should enforce full chain for THREE_D', () => {
            // THREE_D requires cgi_advanced -> requires cgi_basic + digital_filmmaking
            // cgi_basic requires special_effects
            gameState.gameYear = 2009;
            gameState.cash = 100000000;

            // Skip to end should fail
            const directResult = window.TechnologySystem.purchaseTechnology('THREE_D', gameState);
            expect(directResult.success).toBe(false);

            // Build entire chain
            window.TechnologySystem.purchaseTechnology('SPECIAL_EFFECTS', gameState);
            window.TechnologySystem.purchaseTechnology('CGI_BASIC', gameState);
            window.TechnologySystem.purchaseTechnology('DIGITAL_FILMMAKING', gameState);
            window.TechnologySystem.purchaseTechnology('CGI_ADVANCED', gameState);

            const result = window.TechnologySystem.purchaseTechnology('THREE_D', gameState);
            expect(result.success).toBe(true);
        });
    });

    describe('getTotalQualityBonus', () => {
        test('should return 0 with no technologies', () => {
            const bonus = window.TechnologySystem.getTotalQualityBonus(gameState);
            expect(bonus).toBe(0);
        });

        test('should return 0 with null technologies array', () => {
            gameState.technologies = null;
            const bonus = window.TechnologySystem.getTotalQualityBonus(gameState);
            expect(bonus).toBe(0);
        });

        test('should return correct bonus for one technology', () => {
            gameState.technologies = [
                { id: 'color_film', benefits: { qualityBonus: 5, revenueMultiplier: 1.20 } }
            ];
            const bonus = window.TechnologySystem.getTotalQualityBonus(gameState);
            expect(bonus).toBe(5);
        });

        test('should sum bonuses from multiple technologies', () => {
            gameState.technologies = [
                { id: 'color_film', benefits: { qualityBonus: 5 } },
                { id: 'widescreen', benefits: { qualityBonus: 4 } },
                { id: 'stereo_sound', benefits: { qualityBonus: 3 } }
            ];
            const bonus = window.TechnologySystem.getTotalQualityBonus(gameState);
            expect(bonus).toBe(12);
        });

        test('should handle missing qualityBonus in benefits', () => {
            gameState.technologies = [
                { id: 'test', benefits: {} }
            ];
            const bonus = window.TechnologySystem.getTotalQualityBonus(gameState);
            expect(bonus).toBe(0);
        });
    });

    describe('getTotalRevenueMultiplier', () => {
        test('should return 1.0 with no technologies', () => {
            const mult = window.TechnologySystem.getTotalRevenueMultiplier(gameState);
            expect(mult).toBe(1.0);
        });

        test('should return 1.0 with null technologies array', () => {
            gameState.technologies = null;
            const mult = window.TechnologySystem.getTotalRevenueMultiplier(gameState);
            expect(mult).toBe(1.0);
        });

        test('should return exact multiplier for single tech', () => {
            // COLOR_FILM has revenueMultiplier 1.20
            gameState.technologies = [
                { id: 'color_film', benefits: { revenueMultiplier: 1.20 } }
            ];
            const mult = window.TechnologySystem.getTotalRevenueMultiplier(gameState);
            expect(mult).toBeCloseTo(1.20, 2);
        });

        test('should apply diminishing stacking for multiple techs', () => {
            // First tech: full multiplier. Second+: (mult-1)*0.5
            gameState.technologies = [
                { id: 'color_film', benefits: { revenueMultiplier: 1.20 } },
                { id: 'widescreen', benefits: { revenueMultiplier: 1.25 } }
            ];
            // First: 1.20. Second adds (1.25-1.0)*0.5 = 0.125. Total = 1.325
            const mult = window.TechnologySystem.getTotalRevenueMultiplier(gameState);
            expect(mult).toBeCloseTo(1.325, 3);
        });

        test('should apply diminishing stacking for three techs', () => {
            gameState.technologies = [
                { id: 'color_film', benefits: { revenueMultiplier: 1.20 } },
                { id: 'widescreen', benefits: { revenueMultiplier: 1.25 } },
                { id: 'stereo_sound', benefits: { revenueMultiplier: 1.08 } }
            ];
            // First: 1.20. Second: +0.125. Third: +(0.08)*0.5 = +0.04. Total = 1.365
            const mult = window.TechnologySystem.getTotalRevenueMultiplier(gameState);
            expect(mult).toBeCloseTo(1.365, 3);
        });

        test('should ignore techs with no revenueMultiplier', () => {
            gameState.technologies = [
                { id: 'test_no_mult', benefits: { qualityBonus: 5 } }
            ];
            const mult = window.TechnologySystem.getTotalRevenueMultiplier(gameState);
            expect(mult).toBe(1.0);
        });

        test('should ignore techs with revenueMultiplier of exactly 1.0', () => {
            gameState.technologies = [
                { id: 'test_1', benefits: { revenueMultiplier: 1.0 } }
            ];
            const mult = window.TechnologySystem.getTotalRevenueMultiplier(gameState);
            expect(mult).toBe(1.0);
        });
    });

    describe('getGenreBonus', () => {
        test('should return 0 with no technologies', () => {
            const bonus = window.TechnologySystem.getGenreBonus('sci_fi', gameState);
            expect(bonus).toBe(0);
        });

        test('should return 0 with null technologies', () => {
            gameState.technologies = null;
            const bonus = window.TechnologySystem.getGenreBonus('action', gameState);
            expect(bonus).toBe(0);
        });

        test('should return correct bonus for matching genre', () => {
            // SPECIAL_EFFECTS has genreBonus: { sci_fi: 0.20, action: 0.10, adventure: 0.10 }
            gameState.technologies = [
                { id: 'special_effects', benefits: { genreBonus: { sci_fi: 0.20, action: 0.10, adventure: 0.10 } } }
            ];
            expect(window.TechnologySystem.getGenreBonus('sci_fi', gameState)).toBeCloseTo(0.20, 2);
            expect(window.TechnologySystem.getGenreBonus('action', gameState)).toBeCloseTo(0.10, 2);
        });

        test('should return 0 for non-matching genre', () => {
            gameState.technologies = [
                { id: 'special_effects', benefits: { genreBonus: { sci_fi: 0.20 } } }
            ];
            expect(window.TechnologySystem.getGenreBonus('drama', gameState)).toBe(0);
        });

        test('should sum bonuses from multiple technologies for same genre', () => {
            // CGI_BASIC sci_fi: 0.25, DOLBY_STEREO sci_fi: 0.08
            gameState.technologies = [
                { id: 'cgi_basic', benefits: { genreBonus: { sci_fi: 0.25, action: 0.15 } } },
                { id: 'dolby_stereo', benefits: { genreBonus: { sci_fi: 0.08, action: 0.10 } } }
            ];
            expect(window.TechnologySystem.getGenreBonus('sci_fi', gameState)).toBeCloseTo(0.33, 2);
            expect(window.TechnologySystem.getGenreBonus('action', gameState)).toBeCloseTo(0.25, 2);
        });

        test('should handle case-insensitive genre names', () => {
            gameState.technologies = [
                { id: 'special_effects', benefits: { genreBonus: { sci_fi: 0.20 } } }
            ];
            // The function lowercases genre input
            expect(window.TechnologySystem.getGenreBonus('SCI_FI', gameState)).toBeCloseTo(0.20, 2);
        });

        test('should handle null or empty genre gracefully', () => {
            gameState.technologies = [
                { id: 'special_effects', benefits: { genreBonus: { sci_fi: 0.20 } } }
            ];
            expect(window.TechnologySystem.getGenreBonus(null, gameState)).toBe(0);
            expect(window.TechnologySystem.getGenreBonus('', gameState)).toBe(0);
        });

        test('should return 0 for tech without genreBonus', () => {
            gameState.technologies = [
                { id: 'color_film', benefits: { qualityBonus: 5 } }
            ];
            expect(window.TechnologySystem.getGenreBonus('sci_fi', gameState)).toBe(0);
        });
    });

    describe('getTvDefenseBonus', () => {
        test('should return 0 with no technologies', () => {
            const bonus = window.TechnologySystem.getTvDefenseBonus(gameState);
            expect(bonus).toBe(0);
        });

        test('should return 0 with null technologies', () => {
            gameState.technologies = null;
            const bonus = window.TechnologySystem.getTvDefenseBonus(gameState);
            expect(bonus).toBe(0);
        });

        test('should return correct bonus for single tech with tvDefenseBonus', () => {
            // WIDESCREEN has tvDefenseBonus: 0.15
            gameState.technologies = [
                { id: 'widescreen', benefits: { tvDefenseBonus: 0.15 } }
            ];
            expect(window.TechnologySystem.getTvDefenseBonus(gameState)).toBeCloseTo(0.15, 2);
        });

        test('should sum bonuses from multiple techs', () => {
            // WIDESCREEN: 0.15, STEREO_SOUND: 0.05
            gameState.technologies = [
                { id: 'widescreen', benefits: { tvDefenseBonus: 0.15 } },
                { id: 'stereo_sound', benefits: { tvDefenseBonus: 0.05 } }
            ];
            expect(window.TechnologySystem.getTvDefenseBonus(gameState)).toBeCloseTo(0.20, 2);
        });

        test('should cap at 0.5 (50%)', () => {
            gameState.technologies = [
                { id: 'tech1', benefits: { tvDefenseBonus: 0.30 } },
                { id: 'tech2', benefits: { tvDefenseBonus: 0.30 } }
            ];
            // Sum would be 0.60, but capped at 0.50
            expect(window.TechnologySystem.getTvDefenseBonus(gameState)).toBe(0.5);
        });

        test('should ignore techs without tvDefenseBonus', () => {
            gameState.technologies = [
                { id: 'color_film', benefits: { qualityBonus: 5, revenueMultiplier: 1.20 } }
            ];
            expect(window.TechnologySystem.getTvDefenseBonus(gameState)).toBe(0);
        });
    });

    describe('getBudgetMultiplier', () => {
        test('should return 1.0 with no technologies', () => {
            expect(window.TechnologySystem.getBudgetMultiplier(gameState)).toBe(1.0);
        });

        test('should return 1.0 with null technologies', () => {
            gameState.technologies = null;
            expect(window.TechnologySystem.getBudgetMultiplier(gameState)).toBe(1.0);
        });

        test('should return budgetMultiplier for a single tech', () => {
            // COLOR_FILM: budgetMultiplier 1.15 (color films cost 15% more)
            gameState.technologies = [
                { id: 'color_film', benefits: { budgetMultiplier: 1.15 } }
            ];
            expect(window.TechnologySystem.getBudgetMultiplier(gameState)).toBeCloseTo(1.15, 2);
        });

        test('should multiply budgetMultipliers from multiple techs', () => {
            // COLOR_FILM 1.15, WIDESCREEN 1.10
            gameState.technologies = [
                { id: 'color_film', benefits: { budgetMultiplier: 1.15 } },
                { id: 'widescreen', benefits: { budgetMultiplier: 1.10 } }
            ];
            // 1.15 * 1.10 = 1.265
            expect(window.TechnologySystem.getBudgetMultiplier(gameState)).toBeCloseTo(1.265, 3);
        });

        test('should allow budget savings (multiplier < 1.0)', () => {
            // DIGITAL_FILMMAKING: budgetMultiplier 0.85 (15% savings)
            gameState.technologies = [
                { id: 'digital_filmmaking', benefits: { budgetMultiplier: 0.85 } }
            ];
            expect(window.TechnologySystem.getBudgetMultiplier(gameState)).toBeCloseTo(0.85, 2);
        });

        test('should ignore techs without budgetMultiplier', () => {
            gameState.technologies = [
                { id: 'stereo_sound', benefits: { qualityBonus: 3, revenueMultiplier: 1.08 } }
            ];
            expect(window.TechnologySystem.getBudgetMultiplier(gameState)).toBe(1.0);
        });
    });

    describe('hasTechnology and getOwnedTechIds', () => {
        test('hasTechnology returns false when not owned', () => {
            expect(window.TechnologySystem.hasTechnology('color_film', gameState)).toBe(false);
        });

        test('hasTechnology returns true when owned', () => {
            gameState.technologies = [{ id: 'color_film' }];
            expect(window.TechnologySystem.hasTechnology('color_film', gameState)).toBe(true);
        });

        test('hasTechnology handles null technologies array', () => {
            gameState.technologies = null;
            expect(window.TechnologySystem.hasTechnology('color_film', gameState)).toBe(false);
        });

        test('getOwnedTechIds returns empty array when none owned', () => {
            expect(window.TechnologySystem.getOwnedTechIds(gameState)).toEqual([]);
        });

        test('getOwnedTechIds returns correct IDs', () => {
            gameState.technologies = [
                { id: 'color_film' },
                { id: 'widescreen' }
            ];
            expect(window.TechnologySystem.getOwnedTechIds(gameState)).toEqual(['color_film', 'widescreen']);
        });
    });

    describe('initializeTechnologies', () => {
        test('should create empty technologies array when missing', () => {
            const state = { cash: 100 };
            window.TechnologySystem.initializeTechnologies(state);
            expect(state.technologies).toEqual([]);
        });

        test('should not overwrite existing technologies', () => {
            const state = { technologies: [{ id: 'color_film' }] };
            window.TechnologySystem.initializeTechnologies(state);
            expect(state.technologies.length).toBe(1);
        });
    });

    describe('getAvailableTechnologies', () => {
        test('should return all techs with canPurchase info', () => {
            gameState.gameYear = 2010;
            gameState.cash = 100000000;
            // Buy full chain to test filtering
            const available = window.TechnologySystem.getAvailableTechnologies(gameState);
            expect(available.length).toBeGreaterThan(0);
            available.forEach(function(tech) {
                expect(tech).toHaveProperty('key');
                expect(tech).toHaveProperty('id');
                expect(tech).toHaveProperty('canPurchase');
                expect(tech).toHaveProperty('prereqsMet');
                expect(tech).toHaveProperty('yearMet');
            });
        });

        test('should exclude already-owned technologies', () => {
            gameState.gameYear = 1936;
            gameState.cash = 500000;
            window.TechnologySystem.purchaseTechnology('COLOR_FILM', gameState);

            const available = window.TechnologySystem.getAvailableTechnologies(gameState);
            const colorFilm = available.find(function(t) { return t.id === 'color_film'; });
            expect(colorFilm).toBeUndefined();
        });
    });

    describe('getTotalMaintenanceCost', () => {
        test('should return 0 with no technologies', () => {
            expect(window.TechnologySystem.getTotalMaintenanceCost(gameState)).toBe(0);
        });

        test('should sum maintenance costs from multiple techs', () => {
            gameState.technologies = [
                { id: 'color_film', maintenanceCost: 3000 },
                { id: 'widescreen', maintenanceCost: 4000 }
            ];
            expect(window.TechnologySystem.getTotalMaintenanceCost(gameState)).toBe(7000);
        });
    });

    describe('TECHNOLOGIES data', () => {
        test('should expose TECHNOLOGIES constant with known keys', () => {
            const techs = window.TechnologySystem.TECHNOLOGIES;
            expect(techs).toBeDefined();
            expect(techs.COLOR_FILM).toBeDefined();
            expect(techs.WIDESCREEN).toBeDefined();
            expect(techs.STEREO_SOUND).toBeDefined();
            expect(techs.SPECIAL_EFFECTS).toBeDefined();
            expect(techs.DOLBY_STEREO).toBeDefined();
            expect(techs.CGI_BASIC).toBeDefined();
            expect(techs.DIGITAL_FILMMAKING).toBeDefined();
            expect(techs.CGI_ADVANCED).toBeDefined();
            expect(techs.THREE_D).toBeDefined();
        });

        test('each technology should have required fields', () => {
            const techs = window.TechnologySystem.TECHNOLOGIES;
            for (var key in techs) {
                var tech = techs[key];
                expect(tech.id).toBeDefined();
                expect(tech.name).toBeDefined();
                expect(typeof tech.cost).toBe('number');
                expect(typeof tech.yearAvailable).toBe('number');
                expect(Array.isArray(tech.prerequisites)).toBe(true);
                expect(tech.benefits).toBeDefined();
                expect(typeof tech.benefits.qualityBonus).toBe('number');
            }
        });
    });
});

// ================================================================
// TV COMPETITION SYSTEM TESTS
// ================================================================

describe('TVCompetitionSystem', () => {
    let gameState;

    beforeEach(() => {
        jest.resetModules();
        require('../js/core/constants.js');
        require('../js/systems/technology.js');
        require('../js/systems/tv-competition.js');

        gameState = {
            gameYear: 1955,
            cash: 1000000,
            technologies: []
        };
    });

    describe('getTvPenetration', () => {
        test('should return 0 before 1948', () => {
            expect(window.TVCompetitionSystem.getTvPenetration(1933)).toBe(0);
            expect(window.TVCompetitionSystem.getTvPenetration(1940)).toBe(0);
            expect(window.TVCompetitionSystem.getTvPenetration(1947)).toBe(0);
        });

        test('should return small value in 1948 (early TV)', () => {
            const pen = window.TVCompetitionSystem.getTvPenetration(1948);
            expect(pen).toBeCloseTo(0.02, 2);
        });

        test('should return growing values through 1950s', () => {
            const pen1950 = window.TVCompetitionSystem.getTvPenetration(1950);
            const pen1955 = window.TVCompetitionSystem.getTvPenetration(1955);
            const pen1960 = window.TVCompetitionSystem.getTvPenetration(1960);

            expect(pen1950).toBeCloseTo(0.09, 2);
            expect(pen1955).toBeCloseTo(0.65, 2);
            expect(pen1960).toBeCloseTo(0.87, 2);

            // Penetration should increase over time
            expect(pen1955).toBeGreaterThan(pen1950);
            expect(pen1960).toBeGreaterThan(pen1955);
        });

        test('should return 0.95 after 1970', () => {
            expect(window.TVCompetitionSystem.getTvPenetration(1971)).toBe(0.95);
            expect(window.TVCompetitionSystem.getTvPenetration(1980)).toBe(0.95);
            expect(window.TVCompetitionSystem.getTvPenetration(2010)).toBe(0.95);
        });

        test('should return 0.95 at exactly 1970', () => {
            expect(window.TVCompetitionSystem.getTvPenetration(1970)).toBeCloseTo(0.95, 2);
        });

        test('should return correct known historical values', () => {
            // Spot check specific known data points from TV_PENETRATION table
            expect(window.TVCompetitionSystem.getTvPenetration(1953)).toBeCloseTo(0.45, 2);
            expect(window.TVCompetitionSystem.getTvPenetration(1957)).toBeCloseTo(0.79, 2);
            expect(window.TVCompetitionSystem.getTvPenetration(1965)).toBeCloseTo(0.93, 2);
        });
    });

    describe('getBoxOfficePenalty', () => {
        test('should return 1.0 before TV era (no penalty)', () => {
            const penalty = window.TVCompetitionSystem.getBoxOfficePenalty(1933, gameState);
            expect(penalty).toBe(1.0);
        });

        test('should return 1.0 in 1940 (pre-TV)', () => {
            const penalty = window.TVCompetitionSystem.getBoxOfficePenalty(1940, gameState);
            expect(penalty).toBe(1.0);
        });

        test('should return less than 1.0 during 1950s (TV competition)', () => {
            const penalty = window.TVCompetitionSystem.getBoxOfficePenalty(1955, gameState);
            expect(penalty).toBeLessThan(1.0);
            expect(penalty).toBeGreaterThan(0.5); // Should not go below floor of 0.5
        });

        test('should have a heavier penalty in late 1950s vs early 1950s', () => {
            const early = window.TVCompetitionSystem.getBoxOfficePenalty(1950, gameState);
            const late = window.TVCompetitionSystem.getBoxOfficePenalty(1958, gameState);
            expect(late).toBeLessThan(early);
        });

        test('should never drop below 0.5', () => {
            // Even worst case scenario
            const penalty = window.TVCompetitionSystem.getBoxOfficePenalty(1959, gameState);
            expect(penalty).toBeGreaterThanOrEqual(0.5);
        });

        test('should return value closer to 1.0 in later decades as studios adapt', () => {
            const fifties = window.TVCompetitionSystem.getBoxOfficePenalty(1958, gameState);
            const eighties = window.TVCompetitionSystem.getBoxOfficePenalty(1985, gameState);
            expect(eighties).toBeGreaterThan(fifties);
        });

        test('should handle null gameState gracefully', () => {
            // When gameState is null, tech defense is 0 so raw penalty applies
            const penalty = window.TVCompetitionSystem.getBoxOfficePenalty(1955, null);
            expect(typeof penalty).toBe('number');
            expect(penalty).toBeLessThanOrEqual(1.0);
            expect(penalty).toBeGreaterThanOrEqual(0.5);
        });

        test('should reduce penalty when player has TV defense technologies', () => {
            // Buy WIDESCREEN (tvDefenseBonus: 0.15)
            gameState.gameYear = 1958;
            gameState.technologies = [
                { id: 'widescreen', benefits: { tvDefenseBonus: 0.15 } }
            ];

            const withoutTech = window.TVCompetitionSystem.getBoxOfficePenalty(1958, { technologies: [] });
            const withTech = window.TVCompetitionSystem.getBoxOfficePenalty(1958, gameState);

            // With tech defense, the penalty should be smaller (multiplier should be closer to 1.0)
            expect(withTech).toBeGreaterThan(withoutTech);
        });
    });

    describe('getTvCompetitionStatus', () => {
        test('should return none level before 1948', () => {
            const status = window.TVCompetitionSystem.getTvCompetitionStatus(1940, gameState);
            expect(status.level).toBe('none');
            expect(status.label).toBe('No TV Competition');
            expect(status.penalty).toBe(0);
        });

        test('should return a status object with expected fields for TV era', () => {
            const status = window.TVCompetitionSystem.getTvCompetitionStatus(1955, gameState);
            expect(status).toHaveProperty('level');
            expect(status).toHaveProperty('label');
            expect(status).toHaveProperty('penalty');
            expect(status).toHaveProperty('penetration');
            expect(typeof status.penalty).toBe('number');
            expect(typeof status.penetration).toBe('number');
        });

        test('should show higher penalty in peak TV threat era', () => {
            const status = window.TVCompetitionSystem.getTvCompetitionStatus(1958, gameState);
            expect(status.penalty).toBeGreaterThan(0);
            expect(status.penetration).toBeGreaterThan(0);
        });
    });

    describe('TV_PENETRATION data', () => {
        test('should expose TV_PENETRATION data', () => {
            const data = window.TVCompetitionSystem.TV_PENETRATION;
            expect(data).toBeDefined();
            expect(data[1948]).toBeDefined();
            expect(data[1970]).toBeDefined();
        });

        test('penetration values should be monotonically non-decreasing', () => {
            const data = window.TVCompetitionSystem.TV_PENETRATION;
            let prevValue = 0;
            for (let year = 1948; year <= 1970; year++) {
                if (data[year] !== undefined) {
                    expect(data[year]).toBeGreaterThanOrEqual(prevValue);
                    prevValue = data[year];
                }
            }
        });

        test('all penetration values should be between 0 and 1', () => {
            const data = window.TVCompetitionSystem.TV_PENETRATION;
            for (var year in data) {
                expect(data[year]).toBeGreaterThanOrEqual(0);
                expect(data[year]).toBeLessThanOrEqual(1.0);
            }
        });
    });

    describe('ERA_TV_IMPACT data', () => {
        test('should expose ERA_TV_IMPACT data', () => {
            const impact = window.TVCompetitionSystem.ERA_TV_IMPACT;
            expect(impact).toBeDefined();
            expect(impact.PRE_CODE).toBe(0);
            expect(impact.TV_THREAT).toBeGreaterThan(0);
        });

        test('TV_THREAT era should have highest impact', () => {
            const impact = window.TVCompetitionSystem.ERA_TV_IMPACT;
            const maxImpact = Math.max(...Object.values(impact));
            expect(impact.TV_THREAT).toBe(maxImpact);
        });
    });

    describe('checkForTvEvents', () => {
        test('should return null before 1950', () => {
            gameState.gameYear = 1945;
            const event = window.TVCompetitionSystem.checkForTvEvents(gameState);
            expect(event).toBeNull();
        });

        test('should return null after 1970', () => {
            gameState.gameYear = 1975;
            const event = window.TVCompetitionSystem.checkForTvEvents(gameState);
            expect(event).toBeNull();
        });

        test('should return event or null during TV era (probabilistic)', () => {
            gameState.gameYear = 1955;
            // Run many times to check structure when event fires
            let gotEvent = false;
            for (let i = 0; i < 200; i++) {
                const event = window.TVCompetitionSystem.checkForTvEvents(gameState);
                if (event !== null) {
                    gotEvent = true;
                    expect(event.type).toBe('tv_competition');
                    expect(event.title).toBe('Television Threat');
                    expect(event.message).toBeDefined();
                    expect(event.severity).toBe('warning');
                    break;
                }
            }
            // With 8% chance per call, 200 calls should almost certainly trigger one
            expect(gotEvent).toBe(true);
        });
    });
});

// ================================================================
// FRANCHISE SYSTEM TESTS
// ================================================================

describe('FranchiseSystem', () => {
    let gameState;

    beforeEach(() => {
        jest.resetModules();
        require('../js/core/constants.js');
        require('../js/systems/franchise.js');

        gameState = {
            gameYear: 1990,
            cash: 5000000,
            currentDate: new Date(1990, 0, 1),
            technologies: [],
            franchises: [],
            completedFilms: [],
            activeFilms: [],
            availableScripts: []
        };
    });

    function createHitFilm(overrides) {
        return Object.assign({
            id: 'film_' + Math.floor(Math.random() * 100000),
            title: 'Galactic Warriors',
            genre: 'sci_fi',
            originalBudget: 500000,
            actualBudget: 500000,
            currentBudget: 500000,
            scriptQuality: 75,
            finalQuality: 78,
            distribution: {
                totalRevenue: 1500000 // 3x budget = qualifies
            },
            ancillaryRevenue: null
        }, overrides || {});
    }

    function createFlopFilm(overrides) {
        return Object.assign({
            id: 'film_flop_' + Math.floor(Math.random() * 100000),
            title: 'Boring Dramas',
            genre: 'drama',
            originalBudget: 500000,
            actualBudget: 500000,
            currentBudget: 500000,
            scriptQuality: 30,
            finalQuality: 25,
            distribution: {
                totalRevenue: 400000 // Less than 2x budget = does NOT qualify
            },
            ancillaryRevenue: null
        }, overrides || {});
    }

    describe('qualifiesForFranchise', () => {
        test('should return true when film earns > 2x budget', () => {
            const film = createHitFilm();
            expect(window.FranchiseSystem.qualifiesForFranchise(film)).toBe(true);
        });

        test('should return false when film earns < 2x budget', () => {
            const film = createFlopFilm();
            expect(window.FranchiseSystem.qualifiesForFranchise(film)).toBe(false);
        });

        test('should return true when film earns exactly 2x budget', () => {
            const film = createHitFilm({
                actualBudget: 500000,
                distribution: { totalRevenue: 1000000 }
            });
            expect(window.FranchiseSystem.qualifiesForFranchise(film)).toBe(true);
        });

        test('should return false for null film', () => {
            expect(window.FranchiseSystem.qualifiesForFranchise(null)).toBe(false);
        });

        test('should return false for film without distribution data', () => {
            const film = createHitFilm({ distribution: null });
            expect(window.FranchiseSystem.qualifiesForFranchise(film)).toBe(false);
        });

        test('should return false for film without totalRevenue', () => {
            const film = createHitFilm({ distribution: {} });
            expect(window.FranchiseSystem.qualifiesForFranchise(film)).toBe(false);
        });

        test('should return false when budget is 0', () => {
            const film = createHitFilm({
                actualBudget: 0,
                originalBudget: 0,
                currentBudget: 0,
                distribution: { totalRevenue: 1000000 }
            });
            expect(window.FranchiseSystem.qualifiesForFranchise(film)).toBe(false);
        });

        test('should include ancillary revenue in qualification calculation', () => {
            const film = createHitFilm({
                actualBudget: 1000000,
                distribution: { totalRevenue: 1500000 }, // Only 1.5x on its own
                ancillaryRevenue: { total: 600000 }       // + ancillary = 2.1x
            });
            expect(window.FranchiseSystem.qualifiesForFranchise(film)).toBe(true);
        });

        test('should fall back through budget fields', () => {
            // Test that it uses actualBudget, then currentBudget, then originalBudget
            const film = createHitFilm({
                actualBudget: undefined,
                currentBudget: undefined,
                originalBudget: 400000,
                distribution: { totalRevenue: 900000 } // 2.25x of 400000
            });
            expect(window.FranchiseSystem.qualifiesForFranchise(film)).toBe(true);
        });
    });

    describe('createOrExtendFranchise', () => {
        test('should create a new franchise from a hit film', () => {
            const film = createHitFilm();
            const franchise = window.FranchiseSystem.createOrExtendFranchise(film, gameState);

            expect(franchise).toBeDefined();
            expect(franchise.id).toBeDefined();
            expect(franchise.name).toBe('Galactic Warriors');
            expect(franchise.filmCount).toBe(1);
            expect(franchise.audienceLoyalty).toBe(1.0);
            expect(franchise.genre).toBe('sci_fi');
            expect(franchise.createdYear).toBe(1990);
            expect(franchise.totalRevenue).toBe(1500000);
            expect(gameState.franchises.length).toBe(1);
        });

        test('should set franchiseId on the film', () => {
            const film = createHitFilm();
            const franchise = window.FranchiseSystem.createOrExtendFranchise(film, gameState);
            expect(film.franchiseId).toBe(franchise.id);
        });

        test('should extend existing franchise when film has franchiseId', () => {
            // Create initial franchise
            const film1 = createHitFilm();
            const franchise = window.FranchiseSystem.createOrExtendFranchise(film1, gameState);

            // Create sequel with franchiseId
            const film2 = createHitFilm({
                title: 'Galactic Warriors II',
                franchiseId: franchise.id,
                distribution: { totalRevenue: 2000000 }
            });

            const extended = window.FranchiseSystem.createOrExtendFranchise(film2, gameState);

            expect(extended.id).toBe(franchise.id);
            expect(extended.filmCount).toBe(2);
            expect(extended.totalRevenue).toBe(3500000); // 1.5M + 2M
            expect(gameState.franchises.length).toBe(1); // Still one franchise
        });

        test('should decay audienceLoyalty on franchise extension', () => {
            const film1 = createHitFilm();
            const franchise = window.FranchiseSystem.createOrExtendFranchise(film1, gameState);
            expect(franchise.audienceLoyalty).toBe(1.0);

            const film2 = createHitFilm({
                franchiseId: franchise.id,
                distribution: { totalRevenue: 1200000 }
            });
            window.FranchiseSystem.createOrExtendFranchise(film2, gameState);

            // SEQUEL_AUDIENCE_RETENTION = 0.85
            expect(franchise.audienceLoyalty).toBeCloseTo(0.85, 2);
        });

        test('should initialize franchises array if missing', () => {
            delete gameState.franchises;
            const film = createHitFilm();
            window.FranchiseSystem.createOrExtendFranchise(film, gameState);
            expect(Array.isArray(gameState.franchises)).toBe(true);
            expect(gameState.franchises.length).toBe(1);
        });
    });

    describe('generateSequelScript', () => {
        test('should produce a valid script object', () => {
            const film = createHitFilm();
            const franchise = window.FranchiseSystem.createOrExtendFranchise(film, gameState);
            const script = window.FranchiseSystem.generateSequelScript(franchise, gameState);

            expect(script).toBeDefined();
            expect(script.id).toBeDefined();
            expect(script.title).toBeDefined();
            expect(script.genre).toBe('sci_fi');
            expect(typeof script.budget).toBe('number');
            expect(script.budget).toBeGreaterThan(0);
            expect(typeof script.quality).toBe('number');
            expect(script.quality).toBeGreaterThan(0);
            expect(typeof script.shootingDays).toBe('number');
            expect(script.isSequel).toBe(true);
            expect(script.franchiseId).toBe(franchise.id);
            expect(script.sequelNumber).toBe(2); // First sequel = #2
        });

        test('should set sequelNumber based on franchise filmCount', () => {
            const film = createHitFilm();
            const franchise = window.FranchiseSystem.createOrExtendFranchise(film, gameState);
            franchise.filmCount = 3;

            const script = window.FranchiseSystem.generateSequelScript(franchise, gameState);
            expect(script.sequelNumber).toBe(4); // filmCount + 1
        });

        test('should have diminishing quality ceiling for later sequels', () => {
            const film = createHitFilm({ scriptQuality: 80 });
            const franchise = window.FranchiseSystem.createOrExtendFranchise(film, gameState);

            // Sequel #2: max quality = baseQuality + (2-1)*(-5) = 80 - 5 = 75
            // Sequel #5: max quality = baseQuality + (5-1)*(-5) = 80 - 20 = 60
            franchise.filmCount = 1;
            const script2 = window.FranchiseSystem.generateSequelScript(franchise, gameState);

            franchise.filmCount = 4;
            const script5 = window.FranchiseSystem.generateSequelScript(franchise, gameState);

            // script5 quality should be <= 60, script2 should be <= 75
            // Due to randomness (75-100% of max), check maximum possible
            expect(script2.quality).toBeLessThanOrEqual(75);
            expect(script5.quality).toBeLessThanOrEqual(60);
        });

        test('should not let quality ceiling drop below 40', () => {
            const film = createHitFilm({ scriptQuality: 50 });
            const franchise = window.FranchiseSystem.createOrExtendFranchise(film, gameState);

            // With baseQuality 50 and sequel #8: 50 + (8-1)*(-5) = 50 - 35 = 15
            // But clamped at 40
            franchise.filmCount = 7;
            const script = window.FranchiseSystem.generateSequelScript(franchise, gameState);
            expect(script.quality).toBeGreaterThanOrEqual(30); // 75% of 40 = 30
            expect(script.quality).toBeLessThanOrEqual(40);
        });

        test('should include audienceBonus in sequel script', () => {
            const film = createHitFilm();
            const franchise = window.FranchiseSystem.createOrExtendFranchise(film, gameState);
            const script = window.FranchiseSystem.generateSequelScript(franchise, gameState);

            expect(script.audienceBonus).toBeDefined();
            expect(typeof script.audienceBonus).toBe('number');
            expect(script.audienceBonus).toBeGreaterThan(0);
        });

        test('should set censor risk based on genre', () => {
            const horrorFilm = createHitFilm({ genre: 'horror' });
            const dramaFilm = createHitFilm({ genre: 'drama' });

            const horrorFranchise = window.FranchiseSystem.createOrExtendFranchise(horrorFilm, gameState);
            const dramaFranchise = window.FranchiseSystem.createOrExtendFranchise(dramaFilm, gameState);

            const horrorScript = window.FranchiseSystem.generateSequelScript(horrorFranchise, gameState);
            const dramaScript = window.FranchiseSystem.generateSequelScript(dramaFranchise, gameState);

            // horror gets 55 censor risk, default gets 30
            expect(horrorScript.censorRisk).toBe(55);
            expect(dramaScript.censorRisk).toBe(30);
        });

        test('should have description mentioning sequel number', () => {
            const film = createHitFilm();
            const franchise = window.FranchiseSystem.createOrExtendFranchise(film, gameState);
            const script = window.FranchiseSystem.generateSequelScript(franchise, gameState);
            expect(script.description).toMatch(/Sequel #2/);
        });
    });

    describe('getFranchiseBoxOfficeMultiplier', () => {
        test('should return 1.0 for non-franchise film', () => {
            const film = createHitFilm();
            const mult = window.FranchiseSystem.getFranchiseBoxOfficeMultiplier(film, gameState);
            expect(mult).toBe(1.0);
        });

        test('should return 1.0 for film without isSequel flag', () => {
            const film = createHitFilm({ franchiseId: 'some_franchise' });
            // franchiseId set but isSequel is not true
            const mult = window.FranchiseSystem.getFranchiseBoxOfficeMultiplier(film, gameState);
            expect(mult).toBe(1.0);
        });

        test('should return era-appropriate multiplier for franchise sequel', () => {
            const originalFilm = createHitFilm();
            const franchise = window.FranchiseSystem.createOrExtendFranchise(originalFilm, gameState);

            const sequelFilm = {
                franchiseId: franchise.id,
                isSequel: true
            };

            const mult = window.FranchiseSystem.getFranchiseBoxOfficeMultiplier(sequelFilm, gameState);
            expect(mult).toBeGreaterThan(1.0); // INDIE_BOOM era = 1.50 * 1.0 loyalty
        });

        test('should decay with audience loyalty', () => {
            const originalFilm = createHitFilm();
            const franchise = window.FranchiseSystem.createOrExtendFranchise(originalFilm, gameState);

            // Simulate audience loyalty decay from multiple sequels
            franchise.audienceLoyalty = 0.5;

            const sequelFilm = {
                franchiseId: franchise.id,
                isSequel: true
            };

            const mult = window.FranchiseSystem.getFranchiseBoxOfficeMultiplier(sequelFilm, gameState);
            // Era bonus (INDIE_BOOM = 1.50) * loyalty (0.5) = 0.75
            expect(mult).toBeCloseTo(0.75, 2);
        });

        test('should return 1.0 if franchise not found in gameState', () => {
            const sequelFilm = {
                franchiseId: 'nonexistent_franchise',
                isSequel: true
            };
            const mult = window.FranchiseSystem.getFranchiseBoxOfficeMultiplier(sequelFilm, gameState);
            expect(mult).toBe(1.0);
        });

        test('should return higher multiplier in later eras', () => {
            const originalFilm = createHitFilm();
            const franchise = window.FranchiseSystem.createOrExtendFranchise(originalFilm, gameState);
            franchise.audienceLoyalty = 1.0;

            const sequelFilm = {
                franchiseId: franchise.id,
                isSequel: true
            };

            // Test in GOLDEN_AGE (1940) vs CONVERGENCE (2008)
            gameState.gameYear = 1940;
            const earlyMult = window.FranchiseSystem.getFranchiseBoxOfficeMultiplier(sequelFilm, gameState);

            gameState.gameYear = 2008;
            const lateMult = window.FranchiseSystem.getFranchiseBoxOfficeMultiplier(sequelFilm, gameState);

            expect(lateMult).toBeGreaterThan(earlyMult);
        });
    });

    describe('audienceLoyalty decay', () => {
        test('should start at 1.0 for new franchise', () => {
            const film = createHitFilm();
            const franchise = window.FranchiseSystem.createOrExtendFranchise(film, gameState);
            expect(franchise.audienceLoyalty).toBe(1.0);
        });

        test('should decay by SEQUEL_AUDIENCE_RETENTION on each extension', () => {
            const film1 = createHitFilm();
            const franchise = window.FranchiseSystem.createOrExtendFranchise(film1, gameState);

            // First extension: 1.0 * 0.85 = 0.85
            const film2 = createHitFilm({ franchiseId: franchise.id, distribution: { totalRevenue: 1200000 } });
            window.FranchiseSystem.createOrExtendFranchise(film2, gameState);
            expect(franchise.audienceLoyalty).toBeCloseTo(0.85, 2);

            // Second extension: 0.85 * 0.85 = 0.7225
            const film3 = createHitFilm({ franchiseId: franchise.id, distribution: { totalRevenue: 1100000 } });
            window.FranchiseSystem.createOrExtendFranchise(film3, gameState);
            expect(franchise.audienceLoyalty).toBeCloseTo(0.7225, 3);
        });

        test('should allow loyalty to drop very low after many sequels', () => {
            const film1 = createHitFilm();
            const franchise = window.FranchiseSystem.createOrExtendFranchise(film1, gameState);

            // Simulate 6 more sequels (total 7 films)
            for (let i = 0; i < 6; i++) {
                const sequel = createHitFilm({
                    franchiseId: franchise.id,
                    distribution: { totalRevenue: 1200000 }
                });
                window.FranchiseSystem.createOrExtendFranchise(sequel, gameState);
            }

            // 0.85^6 = ~0.377
            expect(franchise.audienceLoyalty).toBeCloseTo(Math.pow(0.85, 6), 2);
            expect(franchise.audienceLoyalty).toBeLessThan(0.4);
        });

        test('SEQUEL_AUDIENCE_RETENTION constant should be 0.85', () => {
            expect(window.FranchiseSystem.SEQUEL_AUDIENCE_RETENTION).toBe(0.85);
        });
    });

    describe('SEQUEL_QUALITY_PENALTY constant', () => {
        test('should be -5', () => {
            expect(window.FranchiseSystem.SEQUEL_QUALITY_PENALTY).toBe(-5);
        });
    });

    describe('FRANCHISE_ERA_BONUS data', () => {
        test('should expose era bonuses', () => {
            const bonuses = window.FranchiseSystem.FRANCHISE_ERA_BONUS;
            expect(bonuses).toBeDefined();
            expect(bonuses.PRE_CODE).toBeDefined();
            expect(bonuses.CONVERGENCE).toBeDefined();
        });

        test('franchise bonuses should increase over time', () => {
            const bonuses = window.FranchiseSystem.FRANCHISE_ERA_BONUS;
            expect(bonuses.CONVERGENCE).toBeGreaterThan(bonuses.PRE_CODE);
            expect(bonuses.BLOCKBUSTER_AGE).toBeGreaterThan(bonuses.GOLDEN_AGE);
        });
    });

    describe('initializeFranchises', () => {
        test('should create empty franchises array when missing', () => {
            const state = {};
            window.FranchiseSystem.initializeFranchises(state);
            expect(state.franchises).toEqual([]);
        });

        test('should not overwrite existing franchises', () => {
            const state = { franchises: [{ id: 'existing' }] };
            window.FranchiseSystem.initializeFranchises(state);
            expect(state.franchises.length).toBe(1);
        });
    });

    describe('canMakeSequel', () => {
        test('should return false if filmCount >= 8', () => {
            const franchise = { filmCount: 8, audienceLoyalty: 1.0, lastFilmYear: 1985 };
            gameState.gameYear = 1990;
            expect(window.FranchiseSystem.canMakeSequel(franchise, gameState)).toBe(false);
        });

        test('should return false if audience loyalty < 0.3', () => {
            const franchise = { filmCount: 3, audienceLoyalty: 0.2, lastFilmYear: 1985 };
            gameState.gameYear = 1990;
            expect(window.FranchiseSystem.canMakeSequel(franchise, gameState)).toBe(false);
        });

        test('should return false if less than 1 year since last film', () => {
            const franchise = { filmCount: 2, audienceLoyalty: 0.8, lastFilmYear: 1990 };
            gameState.gameYear = 1990;
            expect(window.FranchiseSystem.canMakeSequel(franchise, gameState)).toBe(false);
        });

        test('should return true when all conditions met', () => {
            const franchise = { filmCount: 2, audienceLoyalty: 0.8, lastFilmYear: 1988 };
            gameState.gameYear = 1990;
            expect(window.FranchiseSystem.canMakeSequel(franchise, gameState)).toBe(true);
        });
    });

    describe('getActiveFranchises', () => {
        test('should return empty array when no franchises', () => {
            expect(window.FranchiseSystem.getActiveFranchises(gameState)).toEqual([]);
        });

        test('should return franchise info with canMakeSequel flag', () => {
            const film = createHitFilm();
            window.FranchiseSystem.createOrExtendFranchise(film, gameState);

            // Need to set lastFilmYear to allow sequel
            gameState.franchises[0].lastFilmYear = 1988;
            gameState.gameYear = 1990;

            const active = window.FranchiseSystem.getActiveFranchises(gameState);
            expect(active.length).toBe(1);
            expect(active[0].name).toBe('Galactic Warriors');
            expect(active[0]).toHaveProperty('canMakeSequel');
            expect(active[0].audienceLoyalty).toBe(100); // 1.0 * 100 = 100%
        });
    });

    describe('checkAndOfferSequel', () => {
        test('should return null for non-qualifying film', () => {
            const film = createFlopFilm();
            const result = window.FranchiseSystem.checkAndOfferSequel(film, gameState);
            expect(result).toBeNull();
        });

        test('should create franchise and sequel script for qualifying film', () => {
            const film = createHitFilm();
            const result = window.FranchiseSystem.checkAndOfferSequel(film, gameState);

            expect(result).not.toBeNull();
            expect(result.franchise).toBeDefined();
            expect(result.sequelScript).toBeDefined();
            expect(result.sequelScript.isSequel).toBe(true);
            expect(gameState.availableScripts.length).toBe(1);
        });
    });
});

// ================================================================
// SAVE/LOAD SYSTEM TESTS
// ================================================================

describe('SaveLoadSystem', () => {
    let mockStorage;
    let originalLocalStorage;

    beforeEach(() => {
        jest.resetModules();

        // Replace localStorage with a mock implementation
        mockStorage = {};
        originalLocalStorage = window.localStorage;
        const mockLS = {
            getItem: jest.fn(function(key) { return mockStorage[key] || null; }),
            setItem: jest.fn(function(key, value) { mockStorage[key] = String(value); }),
            removeItem: jest.fn(function(key) { delete mockStorage[key]; }),
            clear: jest.fn(function() { mockStorage = {}; })
        };
        Object.defineProperty(window, 'localStorage', { value: mockLS, writable: true, configurable: true });

        require('../js/core/constants.js');
        require('../js/core/save-load.js');
    });

    afterEach(() => {
        Object.defineProperty(window, 'localStorage', { value: originalLocalStorage, writable: true, configurable: true });
    });

    function createTestGameState(overrides) {
        return Object.assign({
            currentDate: new Date(1940, 5, 15),
            gameWeek: 390,
            gameYear: 1940,
            cash: 750000,
            monthlyBurn: 25000,
            totalRevenue: 500000,
            totalExpenses: 350000,
            studioName: 'Test Studio',
            reputation: 65,
            soundStages: 2,
            backlots: { western: true, nyc: false, jungle: false },
            activeFilms: [],
            completedFilms: [{ id: 'film1', title: 'Test Film' }],
            contractPlayers: [],
            availableScripts: [],
            currentEvents: [],
            events: [],
            technologies: [],
            franchises: [],
            studioLot: null,
            gameStarted: true,
            gameEnded: false,
            endingType: null,
            scenario: null,
            stats: {
                filmsProduced: 5,
                oscarsWon: 1,
                boxOfficeTotal: 2000000,
                scandalsHandled: 2,
                yearsSurvived: 7
            }
        }, overrides || {});
    }

    describe('createSaveData', () => {
        test('should include version and name', () => {
            const state = createTestGameState();
            const saveData = window.SaveLoadSystem.saveGame(1, state, 'My Save');

            expect(saveData.success).toBe(true);
            const saved = JSON.parse(mockStorage['hollywood-mogul-saves']);
            const slotData = saved['slot_1'];

            expect(slotData.version).toBe('2.0');
            expect(slotData.name).toBe('My Save');
        });

        test('should include technologies array', () => {
            const techs = [
                { id: 'color_film', name: 'Technicolor Process', purchaseYear: 1936, benefits: { qualityBonus: 5 }, maintenanceCost: 3000 },
                { id: 'widescreen', name: 'CinemaScope', purchaseYear: 1954, benefits: { qualityBonus: 4 }, maintenanceCost: 4000 }
            ];
            const state = createTestGameState({ technologies: techs });
            window.SaveLoadSystem.saveGame(1, state);

            const saved = JSON.parse(mockStorage['hollywood-mogul-saves']);
            const slotData = saved['slot_1'];

            expect(slotData.technologies).toBeDefined();
            expect(slotData.technologies.length).toBe(2);
            expect(slotData.technologies[0].id).toBe('color_film');
            expect(slotData.technologies[1].id).toBe('widescreen');
        });

        test('should include franchises array', () => {
            const franchises = [
                { id: 'franchise_1', name: 'Space Wars', filmCount: 3, audienceLoyalty: 0.72 }
            ];
            const state = createTestGameState({ franchises: franchises });
            window.SaveLoadSystem.saveGame(1, state);

            const saved = JSON.parse(mockStorage['hollywood-mogul-saves']);
            const slotData = saved['slot_1'];

            expect(slotData.franchises).toBeDefined();
            expect(slotData.franchises.length).toBe(1);
            expect(slotData.franchises[0].name).toBe('Space Wars');
            expect(slotData.franchises[0].audienceLoyalty).toBeCloseTo(0.72, 2);
        });

        test('should include core game state fields', () => {
            const state = createTestGameState();
            window.SaveLoadSystem.saveGame(1, state);

            const saved = JSON.parse(mockStorage['hollywood-mogul-saves']);
            const slotData = saved['slot_1'];

            expect(slotData.gameYear).toBe(1940);
            expect(slotData.cash).toBe(750000);
            expect(slotData.studioName).toBe('Test Studio');
            expect(slotData.reputation).toBe(65);
            expect(slotData.stats.filmsProduced).toBe(5);
        });

        test('should deep copy arrays to avoid reference issues', () => {
            const state = createTestGameState({
                technologies: [{ id: 'color_film', benefits: { qualityBonus: 5 } }]
            });
            window.SaveLoadSystem.saveGame(1, state);

            // Modify original array
            state.technologies.push({ id: 'new_tech', benefits: {} });

            // Saved data should not be affected
            const saved = JSON.parse(mockStorage['hollywood-mogul-saves']);
            const slotData = saved['slot_1'];
            expect(slotData.technologies.length).toBe(1);
        });

        test('should handle empty technologies and franchises', () => {
            const state = createTestGameState({ technologies: [], franchises: [] });
            window.SaveLoadSystem.saveGame(1, state);

            const saved = JSON.parse(mockStorage['hollywood-mogul-saves']);
            const slotData = saved['slot_1'];

            expect(slotData.technologies).toEqual([]);
            expect(slotData.franchises).toEqual([]);
        });
    });

    describe('restoreGameState (via loadGame)', () => {
        test('should restore technologies from save data', () => {
            const techs = [
                { id: 'color_film', name: 'Technicolor', purchaseYear: 1936, benefits: { qualityBonus: 5 }, maintenanceCost: 3000 }
            ];
            const state = createTestGameState({ technologies: techs });
            window.SaveLoadSystem.saveGame(1, state);

            const result = window.SaveLoadSystem.loadGame(1);
            expect(result.success).toBe(true);
            expect(result.gameState.technologies).toBeDefined();
            expect(result.gameState.technologies.length).toBe(1);
            expect(result.gameState.technologies[0].id).toBe('color_film');
        });

        test('should restore franchises from save data', () => {
            const franchises = [
                { id: 'franchise_1', name: 'Space Wars', filmCount: 3, audienceLoyalty: 0.72 }
            ];
            const state = createTestGameState({ franchises: franchises });
            window.SaveLoadSystem.saveGame(1, state);

            const result = window.SaveLoadSystem.loadGame(1);
            expect(result.success).toBe(true);
            expect(result.gameState.franchises).toBeDefined();
            expect(result.gameState.franchises.length).toBe(1);
            expect(result.gameState.franchises[0].name).toBe('Space Wars');
        });

        test('should restore currentDate as Date object', () => {
            const state = createTestGameState();
            window.SaveLoadSystem.saveGame(1, state);

            const result = window.SaveLoadSystem.loadGame(1);
            expect(result.gameState.currentDate).toBeInstanceOf(Date);
            expect(result.gameState.currentDate.getFullYear()).toBe(1940);
        });

        test('should restore all core fields', () => {
            const state = createTestGameState();
            window.SaveLoadSystem.saveGame(1, state);

            const result = window.SaveLoadSystem.loadGame(1);
            const gs = result.gameState;

            expect(gs.gameYear).toBe(1940);
            expect(gs.gameWeek).toBe(390);
            expect(gs.cash).toBe(750000);
            expect(gs.monthlyBurn).toBe(25000);
            expect(gs.studioName).toBe('Test Studio');
            expect(gs.reputation).toBe(65);
            expect(gs.soundStages).toBe(2);
            expect(gs.gameStarted).toBe(true);
            expect(gs.gameEnded).toBe(false);
            expect(gs.stats.oscarsWon).toBe(1);
        });

        test('should return failure for empty slot', () => {
            const result = window.SaveLoadSystem.loadGame(3);
            expect(result.success).toBe(false);
            expect(result.message).toMatch(/No save found/);
        });
    });

    describe('schema validation', () => {
        test('should allow gameYear up to 2011', () => {
            const validation = window.SaveLoadSystem.validateSaveSchema({
                version: '2.0',
                name: 'Late game save',
                saveDate: new Date().toISOString(),
                currentDate: new Date(2010, 11, 31).toISOString(),
                gameWeek: 4000,
                gameYear: 2010,
                cash: 50000000,
                studioName: 'Test Studio',
                monthlyBurn: 100000,
                totalRevenue: 100000000,
                totalExpenses: 80000000,
                reputation: 90,
                soundStages: 5,
                gameStarted: true,
                gameEnded: false
            });

            expect(validation.valid).toBe(true);
            // gameYear: 2010 is within { min: 1933, max: 2011 }
            // Check no warnings about gameYear range
            const yearWarnings = validation.warnings.filter(function(w) {
                return w.includes('gameYear');
            });
            expect(yearWarnings.length).toBe(0);
        });

        test('should allow gameYear of exactly 2011 (end state)', () => {
            const validation = window.SaveLoadSystem.validateSaveSchema({
                version: '2.0',
                name: 'End game save',
                saveDate: new Date().toISOString(),
                currentDate: new Date(2011, 0, 1).toISOString(),
                gameWeek: 4100,
                gameYear: 2011,
                cash: 50000000,
                studioName: 'Test Studio',
                monthlyBurn: 100000,
                totalRevenue: 100000000,
                totalExpenses: 80000000,
                reputation: 90,
                soundStages: 5,
                gameStarted: true,
                gameEnded: true
            });

            expect(validation.valid).toBe(true);
        });

        test('should warn for gameYear above 2011', () => {
            const validation = window.SaveLoadSystem.validateSaveSchema({
                version: '2.0',
                name: 'Invalid save',
                saveDate: new Date().toISOString(),
                currentDate: new Date(2020, 0, 1).toISOString(),
                gameWeek: 5000,
                gameYear: 2020,
                cash: 50000000,
                studioName: 'Test Studio',
                monthlyBurn: 100000,
                totalRevenue: 100000000,
                totalExpenses: 80000000,
                reputation: 90,
                soundStages: 5,
                gameStarted: true,
                gameEnded: true
            });

            // Range violations are warnings, not errors
            const yearWarnings = validation.warnings.filter(function(w) {
                return w.includes('gameYear');
            });
            expect(yearWarnings.length).toBeGreaterThan(0);
        });

        test('should fail validation for missing required fields', () => {
            const validation = window.SaveLoadSystem.validateSaveSchema({
                version: '2.0'
                // Missing name, saveDate, currentDate, gameWeek, gameYear, cash, studioName
            });

            expect(validation.valid).toBe(false);
            expect(validation.errors.length).toBeGreaterThan(0);
        });

        test('should fail validation for wrong field types', () => {
            const validation = window.SaveLoadSystem.validateSaveSchema({
                version: '2.0',
                name: 'Test',
                saveDate: new Date().toISOString(),
                currentDate: new Date().toISOString(),
                gameWeek: 'not a number', // Should be number
                gameYear: 1940,
                cash: 500000,
                studioName: 'Test'
            });

            expect(validation.valid).toBe(false);
            const typeErrors = validation.errors.filter(function(e) {
                return e.includes('gameWeek');
            });
            expect(typeErrors.length).toBeGreaterThan(0);
        });

        test('should validate technologies as array', () => {
            const validation = window.SaveLoadSystem.validateSaveSchema({
                version: '2.0',
                name: 'Test',
                saveDate: new Date().toISOString(),
                currentDate: new Date().toISOString(),
                gameWeek: 100,
                gameYear: 1940,
                cash: 500000,
                studioName: 'Test',
                technologies: 'not an array'
            });

            expect(validation.valid).toBe(false);
            const techErrors = validation.errors.filter(function(e) {
                return e.includes('technologies');
            });
            expect(techErrors.length).toBeGreaterThan(0);
        });

        test('should validate franchises as array', () => {
            const validation = window.SaveLoadSystem.validateSaveSchema({
                version: '2.0',
                name: 'Test',
                saveDate: new Date().toISOString(),
                currentDate: new Date().toISOString(),
                gameWeek: 100,
                gameYear: 1940,
                cash: 500000,
                studioName: 'Test',
                franchises: { not: 'an array' }
            });

            expect(validation.valid).toBe(false);
            const franchiseErrors = validation.errors.filter(function(e) {
                return e.includes('franchises');
            });
            expect(franchiseErrors.length).toBeGreaterThan(0);
        });

        test('should validate date string format', () => {
            const validation = window.SaveLoadSystem.validateSaveSchema({
                version: '2.0',
                name: 'Test',
                saveDate: 'not-a-date',
                currentDate: new Date().toISOString(),
                gameWeek: 100,
                gameYear: 1940,
                cash: 500000,
                studioName: 'Test'
            });

            expect(validation.valid).toBe(false);
        });
    });

    describe('backward compatibility', () => {
        test('should restore save without technologies field (defaults to empty array)', () => {
            // Simulate a v1 save without technologies
            const oldSaveData = {
                version: '1.0',
                name: 'Old Save',
                saveDate: new Date().toISOString(),
                currentDate: new Date(1940, 0, 1).toISOString(),
                gameWeek: 390,
                gameYear: 1940,
                year: 1940,
                cash: 500000,
                monthlyBurn: 20000,
                totalRevenue: 200000,
                totalExpenses: 100000,
                studioName: 'Old Studio',
                reputation: 50,
                soundStages: 1,
                backlots: { western: false, nyc: false, jungle: false },
                activeFilms: [],
                completedFilms: [],
                contractPlayers: [],
                availableScripts: [],
                currentEvents: [],
                events: [],
                // No technologies field
                // No franchises field
                gameStarted: true,
                gameEnded: false,
                endingType: null,
                stats: {
                    filmsProduced: 3,
                    oscarsWon: 0,
                    boxOfficeTotal: 500000,
                    scandalsHandled: 1,
                    yearsSurvived: 5
                }
            };

            // Manually put save data into storage
            const saves = {};
            saves['slot_2'] = oldSaveData;
            mockStorage['hollywood-mogul-saves'] = JSON.stringify(saves);

            const result = window.SaveLoadSystem.loadGame(2);
            expect(result.success).toBe(true);
            expect(result.gameState.technologies).toEqual([]);
            expect(result.gameState.franchises).toEqual([]);
        });

        test('should restore save with null technologies field', () => {
            const saveData = {
                version: '1.5',
                name: 'Mid-migration Save',
                saveDate: new Date().toISOString(),
                currentDate: new Date(1945, 0, 1).toISOString(),
                gameWeek: 600,
                gameYear: 1945,
                year: 1945,
                cash: 800000,
                monthlyBurn: 20000,
                totalRevenue: 400000,
                totalExpenses: 200000,
                studioName: 'Mid Studio',
                reputation: 55,
                soundStages: 1,
                backlots: { western: false, nyc: false, jungle: false },
                activeFilms: [],
                completedFilms: [],
                contractPlayers: [],
                availableScripts: [],
                currentEvents: [],
                events: [],
                technologies: null,
                franchises: null,
                gameStarted: true,
                gameEnded: false,
                endingType: null,
                stats: {
                    filmsProduced: 2,
                    oscarsWon: 0,
                    boxOfficeTotal: 300000,
                    scandalsHandled: 0,
                    yearsSurvived: 3
                }
            };

            const saves = {};
            saves['slot_3'] = saveData;
            mockStorage['hollywood-mogul-saves'] = JSON.stringify(saves);

            const result = window.SaveLoadSystem.loadGame(3);
            expect(result.success).toBe(true);
            // restoreGameState treats null as empty array via ternary
            expect(result.gameState.technologies).toEqual([]);
            expect(result.gameState.franchises).toEqual([]);
        });
    });

    describe('saveGame and loadGame round-trip', () => {
        test('should preserve all data through save and load cycle', () => {
            const state = createTestGameState({
                technologies: [
                    { id: 'color_film', name: 'Technicolor', purchaseYear: 1936, benefits: { qualityBonus: 5 }, maintenanceCost: 3000 }
                ],
                franchises: [
                    { id: 'f1', name: 'The Hero', filmCount: 2, audienceLoyalty: 0.85, genre: 'action', createdYear: 1938, lastFilmYear: 1939, totalRevenue: 3000000, baseQuality: 75 }
                ]
            });

            const saveResult = window.SaveLoadSystem.saveGame(1, state, 'Round Trip Test');
            expect(saveResult.success).toBe(true);

            const loadResult = window.SaveLoadSystem.loadGame(1);
            expect(loadResult.success).toBe(true);

            const restored = loadResult.gameState;
            expect(restored.gameYear).toBe(state.gameYear);
            expect(restored.cash).toBe(state.cash);
            expect(restored.studioName).toBe(state.studioName);
            expect(restored.technologies.length).toBe(1);
            expect(restored.technologies[0].id).toBe('color_film');
            expect(restored.franchises.length).toBe(1);
            expect(restored.franchises[0].name).toBe('The Hero');
            expect(restored.franchises[0].audienceLoyalty).toBeCloseTo(0.85, 2);
            expect(restored.stats.filmsProduced).toBe(state.stats.filmsProduced);
        });
    });

    describe('invalid slot handling', () => {
        test('should fail for slot number below 1', () => {
            const state = createTestGameState();
            const result = window.SaveLoadSystem.saveGame(0, state);
            expect(result.success).toBe(false);
        });

        test('should fail for slot number above MAX_SAVE_SLOTS', () => {
            const state = createTestGameState();
            const result = window.SaveLoadSystem.saveGame(6, state);
            expect(result.success).toBe(false);
        });
    });

    describe('deleteSave', () => {
        test('should delete an existing save', () => {
            const state = createTestGameState();
            window.SaveLoadSystem.saveGame(1, state);

            const deleteResult = window.SaveLoadSystem.deleteSave(1);
            expect(deleteResult.success).toBe(true);

            const loadResult = window.SaveLoadSystem.loadGame(1);
            expect(loadResult.success).toBe(false);
        });

        test('should return failure for empty slot', () => {
            const result = window.SaveLoadSystem.deleteSave(5);
            expect(result.success).toBe(false);
        });
    });

    describe('autoSave', () => {
        test('should create auto save', () => {
            const state = createTestGameState();
            const result = window.SaveLoadSystem.autoSave(state);
            expect(result).toBe(true);
            expect(mockStorage['hollywood-mogul-autosave']).toBeDefined();
        });

        test('should load auto save', () => {
            const state = createTestGameState({
                technologies: [{ id: 'color_film', benefits: { qualityBonus: 5 } }]
            });
            window.SaveLoadSystem.autoSave(state);

            const result = window.SaveLoadSystem.loadAutoSave();
            expect(result.success).toBe(true);
            expect(result.gameState.technologies.length).toBe(1);
        });
    });

    describe('verifySaveIntegrity', () => {
        test('should return true for valid save data', () => {
            const state = createTestGameState();
            window.SaveLoadSystem.saveGame(1, state);

            const saved = JSON.parse(mockStorage['hollywood-mogul-saves']);
            const slotData = saved['slot_1'];

            expect(window.SaveLoadSystem.verifySaveIntegrity(slotData)).toBe(true);
        });

        test('should return false for corrupted save data', () => {
            const corrupted = {
                version: '2.0',
                // Missing most required fields
            };
            expect(window.SaveLoadSystem.verifySaveIntegrity(corrupted)).toBe(false);
        });
    });

    describe('SAVE_VERSION constant', () => {
        test('should be version 2.0', () => {
            expect(window.SaveLoadSystem.SAVE_VERSION).toBe('2.0');
        });
    });
});
