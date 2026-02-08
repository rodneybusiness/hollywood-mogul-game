/**
 * HOLLYWOOD MOGUL - TV COMPETITION SYSTEM
 * Models the rise of television from 1948-1970s and its impact on
 * theatrical box office. TV starts as an existential threat (1950s),
 * then becomes a revenue source (1970s+, via syndication in ancillary).
 *
 * Core mechanic: TV penetration reduces base box office. Player can
 * fight back by investing in spectacle technologies (widescreen, etc.)
 * and producing films with "event" qualities TV can't replicate.
 */
window.TVCompetitionSystem = (function() {
    'use strict';

    // ================================================================
    // TV PENETRATION DATA
    // Historical US household TV ownership percentages
    // ================================================================

    var TV_PENETRATION = {
        1948: 0.02,  // 2% — TV is a novelty
        1949: 0.06,
        1950: 0.09,
        1951: 0.24,
        1952: 0.34,
        1953: 0.45,
        1954: 0.56,
        1955: 0.65,
        1956: 0.72,
        1957: 0.79,
        1958: 0.83,
        1959: 0.86,
        1960: 0.87,
        1961: 0.89,
        1962: 0.90,
        1963: 0.91,
        1964: 0.92,
        1965: 0.93,
        1966: 0.93,
        1967: 0.94,
        1968: 0.94,
        1969: 0.95,
        1970: 0.95
        // After 1970: stays ~95%+, but impact changes character
    };

    // ================================================================
    // BOX OFFICE IMPACT
    // How much TV penetration hurts theatrical attendance.
    // The damage peaks in the late 1950s, then studios adapt.
    // ================================================================

    // Max box office penalty per era (as fraction of base revenue)
    var ERA_TV_IMPACT = {
        PRE_CODE: 0.00,     // No TV
        GOLDEN_AGE: 0.00,   // No TV
        WAR_YEARS: 0.00,    // No TV
        POST_WAR: 0.05,     // TV emerging, minimal impact
        TV_THREAT: 0.30,    // Peak damage — audiences stay home
        NEW_WAVE: 0.20,     // Studios adapting, art house grows
        RATINGS_ERA: 0.12,  // TV is settled, coexistence
        NEW_HOLLYWOOD: 0.08,// Blockbusters bring people back
        BLOCKBUSTER_AGE: 0.05, // Event films dominant
        INDIE_BOOM: 0.03,   // Cable TV new threat, but home video compensates
        DIGITAL_DAWN: 0.02, // DVD revenue dwarfs theatrical worry
        CONVERGENCE: 0.02   // Streaming emerging, but 3D/IMAX draw crowds
    };

    // ================================================================
    // CORE FUNCTIONS
    // ================================================================

    /**
     * Get TV penetration for a given year.
     * Before 1948: 0. After 1970: 0.95.
     */
    function getTvPenetration(year) {
        if (year < 1948) return 0;
        if (year > 1970) return 0.95;
        return TV_PENETRATION[year] || 0;
    }

    /**
     * Calculate the box office penalty multiplier from TV competition.
     * Returns a value between 0 and 1 that should be multiplied against
     * box office revenue. (1.0 = no impact, 0.7 = 30% penalty)
     *
     * The penalty is: eraTvImpact * tvPenetration * (1 - techDefense)
     *
     * @param {number} year - Current game year
     * @param {object} gameState - For checking tech defenses
     * @returns {number} Multiplier (0.7 to 1.0 typically)
     */
    function getBoxOfficePenalty(year, gameState) {
        var eraKey = 'PRE_CODE';
        if (window.GameConstants && window.GameConstants.getEraKeyForYear) {
            eraKey = window.GameConstants.getEraKeyForYear(year);
        }

        var maxImpact = ERA_TV_IMPACT[eraKey] || 0;
        if (maxImpact <= 0) return 1.0; // No TV impact

        var penetration = getTvPenetration(year);
        if (penetration <= 0) return 1.0;

        // Raw penalty
        var rawPenalty = maxImpact * penetration;

        // Tech defense (widescreen, stereo, etc. reduce the penalty)
        var techDefense = 0;
        if (gameState && window.TechnologySystem && window.TechnologySystem.getTvDefenseBonus) {
            techDefense = window.TechnologySystem.getTvDefenseBonus(gameState);
        }

        // Apply tech defense
        var adjustedPenalty = rawPenalty * (1 - techDefense);

        // Return multiplier (1.0 - penalty)
        return Math.max(0.5, 1.0 - adjustedPenalty);
    }

    /**
     * Get a human-readable TV competition status for the dashboard.
     */
    function getTvCompetitionStatus(year, gameState) {
        if (year < 1948) {
            return { level: 'none', label: 'No TV Competition', penalty: 0 };
        }

        var penalty = 1.0 - getBoxOfficePenalty(year, gameState);
        var penetration = getTvPenetration(year);

        var level, label;
        if (penalty <= 0.02) {
            level = 'minimal';
            label = 'TV Impact: Minimal';
        } else if (penalty <= 0.10) {
            level = 'moderate';
            label = 'TV Impact: Moderate (-' + Math.round(penalty * 100) + '%)';
        } else if (penalty <= 0.20) {
            level = 'significant';
            label = 'TV Impact: Significant (-' + Math.round(penalty * 100) + '%)';
        } else {
            level = 'severe';
            label = 'TV Impact: Severe (-' + Math.round(penalty * 100) + '%)';
        }

        return {
            level: level,
            label: label,
            penalty: Math.round(penalty * 100),
            penetration: Math.round(penetration * 100)
        };
    }

    /**
     * Check for TV-related events during monthly processing.
     * Returns an event object or null.
     */
    function checkForTvEvents(gameState) {
        var year = gameState.gameYear;

        // Only trigger TV events in the TV threat era
        if (year < 1950 || year > 1970) return null;

        // 8% chance per month
        if (Math.random() > 0.08) return null;

        var events = [
            { year: 1950, msg: 'Television sets are flying off shelves. Theater attendance drops as families stay home.', penalty: 0.02 },
            { year: 1951, msg: '"I Love Lucy" premieres — 40 million viewers. Hollywood executives panic.', penalty: 0.03 },
            { year: 1953, msg: 'TV networks launch prime-time schedules. The golden age of television begins.', penalty: 0.02 },
            { year: 1954, msg: '"Tonight Show" debuts on NBC. Late-night audiences abandon theaters.', penalty: 0.02 },
            { year: 1955, msg: '"Disneyland" TV show draws huge ratings. Walt Disney proves TV can promote films.', penalty: 0.01 },
            { year: 1956, msg: 'Elvis appears on Ed Sullivan — 60 million viewers. Television is king.', penalty: 0.03 },
            { year: 1957, msg: 'Average American watches 5 hours of TV daily. Theater closures accelerate.', penalty: 0.03 },
            { year: 1958, msg: 'TV westerns dominate — 30 western shows on air. Western films lose audience.', penalty: 0.02 },
            { year: 1960, msg: 'Kennedy-Nixon debate on TV — 70 million viewers. The medium is the message.', penalty: 0.01 },
            { year: 1962, msg: '"The Beverly Hillbillies" gets 57 million viewers. Sitcoms rule the airwaves.', penalty: 0.02 },
            { year: 1964, msg: 'The Beatles appear on Ed Sullivan — 73 million viewers. TV is the culture.', penalty: 0.01 },
            { year: 1966, msg: 'Color TV sales surge. Networks broadcast in full color. The threat intensifies.', penalty: 0.02 },
            { year: 1969, msg: 'Moon landing watched by 600 million worldwide on TV. Cinema can\'t compete with reality.', penalty: 0.01 }
        ];

        // Pick events eligible for this year
        var eligible = events.filter(function(e) { return Math.abs(e.year - year) <= 2; });
        if (eligible.length === 0) {
            eligible = [{ msg: 'Television ratings continue to climb. Theater owners plead for Hollywood to fight back.', penalty: 0.01 }];
        }

        var picked = eligible[Math.floor(Math.random() * eligible.length)];

        return {
            type: 'tv_competition',
            title: 'Television Threat',
            message: picked.msg,
            severity: 'warning'
        };
    }

    // ================================================================
    // PUBLIC API
    // ================================================================

    return {
        getTvPenetration: getTvPenetration,
        getBoxOfficePenalty: getBoxOfficePenalty,
        getTvCompetitionStatus: getTvCompetitionStatus,
        checkForTvEvents: checkForTvEvents,
        TV_PENETRATION: TV_PENETRATION,
        ERA_TV_IMPACT: ERA_TV_IMPACT
    };
})();
