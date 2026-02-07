/**
 * HOLLYWOOD MOGUL - TIME SYSTEM
 * Handles date progression, historical periods, and time-based events
 */

window.TimeSystem = (function() {
    'use strict';
    
    // Historical Periods — 12 eras covering 1933-2010
    const HISTORICAL_PERIODS = {
        PRE_CODE:        { start: 1933, end: 1934, name: "Pre-Code Era",
            description: "Before strict Hays Code enforcement. Gangster films and risqué content flourish." },
        GOLDEN_AGE:      { start: 1935, end: 1941, name: "Golden Age",
            description: "The studio system at its peak. Lavish musicals, screwball comedies, and prestige epics." },
        WAR_YEARS:       { start: 1942, end: 1945, name: "War Years",
            description: "Hollywood mobilizes for WWII. Propaganda films, material rationing, male stars drafted." },
        POST_WAR:        { start: 1946, end: 1949, name: "Post-War Era",
            description: "Film noir emerges. Peak attendance year 1946. HUAC hearings and Paramount decree shake the industry." },
        TV_THREAT:       { start: 1950, end: 1959, name: "Television Threat",
            description: "TV steals audiences. Studios fight back with CinemaScope, Technicolor spectacles, and drive-ins." },
        NEW_WAVE:        { start: 1960, end: 1966, name: "New Wave",
            description: "Old Hollywood crumbles. European art film influences American cinema. The Hays Code weakens." },
        RATINGS_ERA:     { start: 1967, end: 1972, name: "Ratings Era",
            description: "MPAA ratings replace the Hays Code. Counterculture cinema breaks all the rules." },
        NEW_HOLLYWOOD:   { start: 1973, end: 1979, name: "New Hollywood",
            description: "Director-driven auteur cinema. Jaws and Star Wars invent the modern blockbuster." },
        BLOCKBUSTER_AGE: { start: 1980, end: 1989, name: "Blockbuster Age",
            description: "High-concept films, sequels, and VHS revolution. Star salaries explode. Action dominates." },
        INDIE_BOOM:      { start: 1990, end: 1996, name: "Indie Boom",
            description: "Sundance launches careers. Miramax model. CGI dawn with Jurassic Park and Toy Story." },
        DIGITAL_DAWN:    { start: 1997, end: 2004, name: "Digital Dawn",
            description: "DVD revenue surpasses theatrical. Internet transforms marketing. Franchise era begins." },
        CONVERGENCE:     { start: 2005, end: 2010, name: "Convergence Era",
            description: "Streaming disrupts everything. Superhero franchises dominate. Social media marketing. 3D revival." }
    };
    
    // Season definitions (affects box office)
    const SEASONS = {
        SPRING: { months: [2, 3, 4], name: "Spring", modifier: 0.9 },
        SUMMER: { months: [5, 6, 7], name: "Summer", modifier: 1.1 },
        FALL: { months: [8, 9, 10], name: "Fall", modifier: 1.0 },
        WINTER: { months: [11, 0, 1], name: "Winter", modifier: 0.95 }
    };
    
    // Holiday periods (special box office modifiers)
    const HOLIDAYS = {
        CHRISTMAS: { month: 11, startDay: 20, endDay: 31, modifier: 1.3, name: "Christmas Season" },
        THANKSGIVING: { month: 10, startDay: 20, endDay: 30, modifier: 1.15, name: "Thanksgiving" },
        EASTER: { modifier: 1.1, name: "Easter Weekend" }, // Date varies, calculated dynamically
        JULY_FOURTH: { month: 6, startDay: 1, endDay: 7, modifier: 1.2, name: "July 4th Week" }
    };
    
    /**
     * Get current historical period
     */
    function getCurrentPeriod(year) {
        for (const [key, period] of Object.entries(HISTORICAL_PERIODS)) {
            if (year >= period.start && year <= period.end) {
                return { key, ...period };
            }
        }
        return null;
    }
    
    /**
     * Get current season
     */
    function getCurrentSeason(month) {
        for (const [key, season] of Object.entries(SEASONS)) {
            if (season.months.includes(month)) {
                return { key, ...season };
            }
        }
        return SEASONS.FALL; // Default fallback
    }
    
    /**
     * Check if current date is during a holiday period
     */
    function getCurrentHoliday(date) {
        const month = date.getMonth();
        const day = date.getDate();
        
        for (const [key, holiday] of Object.entries(HOLIDAYS)) {
            if (holiday.month === month && 
                day >= holiday.startDay && 
                day <= holiday.endDay) {
                return { key, ...holiday };
            }
        }
        
        return null;
    }
    
    /**
     * Calculate box office modifier based on time of year
     */
    function getTimeBasedBoxOfficeModifier(date) {
        let modifier = 1.0;
        
        // Season modifier
        const season = getCurrentSeason(date.getMonth());
        modifier *= season.modifier;
        
        // Holiday modifier
        const holiday = getCurrentHoliday(date);
        if (holiday) {
            modifier *= holiday.modifier;
        }
        
        return modifier;
    }
    
    /**
     * Get era-specific genre preferences.
     * Delegates to BoxOfficeSystem for per-year precision when available.
     * Falls back to era-level averages otherwise.
     */
    function getEraGenreModifiers(year) {
        // Prefer BoxOfficeSystem's per-year data (single source of truth)
        if (window.BoxOfficeSystem && window.BoxOfficeSystem.getGenreHeatForYear) {
            var yearData = window.BoxOfficeSystem.getGenreHeatForYear(year);
            if (yearData && Object.keys(yearData).length > 0) {
                return yearData;
            }
        }

        // Fallback: era-level averages
        const period = getCurrentPeriod(year);

        switch (period?.key) {
            case 'PRE_CODE':
                return {
                    gangster: 1.3,
                    crime: 1.2,
                    romance: 1.1,
                    comedy: 1.0,
                    western: 0.9,
                    musical: 0.8,
                    drama: 1.0,
                    horror: 1.1
                };
                
            case 'GOLDEN_AGE':
                return {
                    musical: 1.3,
                    comedy: 1.2,
                    romance: 1.2,
                    western: 1.1,
                    drama: 1.0,
                    gangster: 0.8, // Post-Hays Code
                    crime: 0.9,
                    horror: 0.7
                };
                
            case 'WAR_YEARS':
                return {
                    drama: 1.2, // War dramas popular
                    musical: 1.3, // Escapism
                    comedy: 1.1,
                    romance: 1.0,
                    western: 0.9,
                    gangster: 0.7,
                    crime: 0.8,
                    horror: 0.6 // Not appropriate during wartime
                };
                
            case 'POST_WAR':
                return {
                    noir: 1.4, drama: 1.2, crime: 1.1, western: 1.0,
                    comedy: 0.9, musical: 0.8, romance: 1.0, horror: 0.8
                };

            case 'TV_THREAT':
                return {
                    western: 1.4, drama: 1.1, musical: 1.0, sci_fi: 0.9,
                    comedy: 1.0, noir: 1.1, crime: 0.9, horror: 0.8,
                    romance: 0.9, war: 0.8
                };

            case 'NEW_WAVE':
                return {
                    drama: 1.2, thriller: 1.1, western: 1.0, comedy: 1.0,
                    crime: 0.9, musical: 0.7, sci_fi: 0.7, horror: 0.9,
                    romance: 1.0, war: 0.7
                };

            case 'RATINGS_ERA':
                return {
                    drama: 1.3, crime: 1.1, thriller: 1.2, horror: 1.1,
                    comedy: 1.0, western: 0.8, sci_fi: 0.8, musical: 0.4,
                    romance: 0.9, war: 0.7, action: 0.6
                };

            case 'NEW_HOLLYWOOD':
                return {
                    drama: 1.2, sci_fi: 1.4, thriller: 1.2, horror: 1.2,
                    comedy: 1.0, action: 0.8, crime: 1.0, western: 0.6,
                    musical: 0.3, romance: 0.9, war: 0.7
                };

            case 'BLOCKBUSTER_AGE':
                return {
                    action: 1.6, sci_fi: 1.4, comedy: 1.2, horror: 1.0,
                    drama: 1.0, thriller: 1.1, romance: 1.0, crime: 0.9,
                    western: 0.4, musical: 0.3, war: 0.6
                };

            case 'INDIE_BOOM':
                return {
                    drama: 1.2, action: 1.4, thriller: 1.2, comedy: 1.1,
                    sci_fi: 1.2, horror: 0.9, crime: 1.1, romance: 1.1,
                    animated: 1.0, western: 0.3, musical: 0.3, war: 0.5
                };

            case 'DIGITAL_DAWN':
                return {
                    action: 1.4, sci_fi: 1.3, drama: 1.1, comedy: 1.1,
                    thriller: 1.1, animated: 1.2, horror: 0.9, crime: 1.0,
                    romance: 1.0, superhero: 0.9, fantasy: 1.2,
                    western: 0.3, musical: 0.3, war: 0.7
                };

            case 'CONVERGENCE':
                return {
                    superhero: 1.6, action: 1.3, animated: 1.3, sci_fi: 1.2,
                    comedy: 1.0, drama: 1.0, thriller: 1.0, horror: 0.9,
                    crime: 0.9, romance: 0.8, fantasy: 1.1,
                    western: 0.3, musical: 0.4, war: 0.6
                };

            default:
                return {
                    drama: 1.0, comedy: 1.0, romance: 1.0, western: 1.0,
                    musical: 1.0, crime: 1.0, horror: 1.0, action: 1.0,
                    sci_fi: 1.0, thriller: 1.0, animated: 1.0, superhero: 1.0
                };
        }
    }
    
    /**
     * Check for major historical events on specific dates
     */
    function checkForHistoricalMilestones(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // JavaScript months are 0-based
        const day = date.getDate();
        
        // Major film industry milestones
        const milestones = [
            {
                year: 1934,
                month: 7,
                day: 1,
                event: 'hays_code_enforcement',
                title: 'Hays Code Enforcement Begins',
                description: 'The Motion Picture Production Code is now strictly enforced. All films must comply with moral standards.',
                impact: 'Censorship restrictions tightened significantly.'
            },
            {
                year: 1937,
                month: 6,
                day: 1,
                event: 'technicolor_available',
                title: 'Technicolor Technology Available',
                description: 'Advanced color film technology is now available for major productions.',
                impact: 'Color films possible but expensive (+50% production cost, +40% box office potential).'
            },
            {
                year: 1941,
                month: 12,
                day: 7,
                event: 'pearl_harbor',
                title: 'Pearl Harbor Attack',
                description: 'America enters World War II. The film industry must adapt to wartime conditions.',
                impact: 'Government seeks propaganda films. Male actors being drafted. Material shortages expected.'
            },
            {
                year: 1947,
                month: 10,
                day: 20,
                event: 'huac_hearings_begin',
                title: 'HUAC Hollywood Hearings Begin',
                description: 'House Un-American Activities Committee begins investigating communist influence in Hollywood.',
                impact: 'Writers, directors, and actors may be blacklisted. Political loyalty becomes crucial.'
            },
            {
                year: 1948,
                month: 5,
                day: 3,
                event: 'paramount_decision',
                title: 'Paramount Antitrust Decision',
                description: 'Supreme Court rules studios must divest their theater chains.',
                impact: 'Studio system begins to crumble. Theater ownership no longer possible.'
            }
        ];
        
        return milestones.find(milestone => 
            milestone.year === year && 
            milestone.month === month && 
            milestone.day === day
        );
    }
    
    /**
     * Get time period description for UI
     */
    function getTimePeriodDescription(date) {
        const period = getCurrentPeriod(date.getFullYear());
        const season = getCurrentSeason(date.getMonth());
        const holiday = getCurrentHoliday(date);
        
        let description = period ? period.name : 'Unknown Era';
        
        if (holiday) {
            description += ` (${holiday.name})`;
        } else {
            description += ` - ${season.name}`;
        }
        
        return description;
    }
    
    /**
     * Calculate days between two dates
     */
    function daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        return Math.round(Math.abs((date1 - date2) / oneDay));
    }
    
    /**
     * Add days to a date
     */
    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    
    /**
     * Add weeks to a date
     */
    function addWeeks(date, weeks) {
        return addDays(date, weeks * 7);
    }
    
    /**
     * Add months to a date
     */
    function addMonths(date, months) {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    }
    
    /**
     * Format date for display
     */
    function formatDate(date, format = 'long') {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const shortMonths = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        switch (format) {
            case 'short':
                return `${shortMonths[date.getMonth()]} ${date.getFullYear()}`;
            case 'full':
                return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
            case 'long':
            default:
                return `${months[date.getMonth()]} ${date.getFullYear()}`;
        }
    }
    
    /**
     * Get week of year
     */
    function getWeekOfYear(date) {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const daysDiff = daysBetween(date, startOfYear);
        return Math.ceil((daysDiff + startOfYear.getDay()) / 7);
    }
    
    /**
     * Check if year is leap year
     */
    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }
    
    /**
     * Get days in month
     */
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }
    
    /**
     * Public API
     */
    return {
        // Period functions
        getCurrentPeriod,
        getCurrentSeason,
        getCurrentHoliday,
        getTimePeriodDescription,
        
        // Modifier functions
        getTimeBasedBoxOfficeModifier,
        getEraGenreModifiers,
        
        // Historical functions
        checkForHistoricalMilestones,
        
        // Date utility functions
        formatDate,
        daysBetween,
        addDays,
        addWeeks,
        addMonths,
        getWeekOfYear,
        isLeapYear,
        getDaysInMonth,
        
        // Constants
        PERIODS: HISTORICAL_PERIODS,
        SEASONS,
        HOLIDAYS
    };
})();