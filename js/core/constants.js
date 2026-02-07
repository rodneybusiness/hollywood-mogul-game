/**
 * HOLLYWOOD MOGUL - GAME CONSTANTS
 * Central repository for all game configuration values.
 * Changing values here affects the entire game without hunting through code.
 */

window.GameConstants = (function() {
    'use strict';

    // ================================================================
    // FINANCIAL
    // ================================================================
    const FINANCIAL = {
        STARTING_CASH: 600000,
        BASE_MONTHLY_BURN: 20000,
        SOUND_STAGE_COST: 10000,
        OVERHEAD_COST: 3000,
        CONTRACT_PLAYERS_COST: 7000,

        // Runway thresholds (in weeks)
        RUNWAY_DANGER_WEEKS: 8,
        RUNWAY_WARNING_WEEKS: 16,
        RUNWAY_INFINITY_THRESHOLD: 100, // Display "∞" when runway exceeds this

        // Bank loan monthly interest rate (was 8%, reduced for balance)
        BANK_LOAN_INTEREST_RATE: 0.04,
        PRIVATE_INVESTOR_INTEREST_RATE: 0.05,
        MOB_LOAN_INTEREST_RATE: 0,

        // Investment costs
        THEATER_CHAIN_COST: 250000,   // Reduced from 500k for accessibility
        RADIO_STATION_COST: 150000,
        RESTAURANT_CHAIN_COST: 200000,

        // Investment monthly revenue
        THEATER_CHAIN_REVENUE: 25000,
        RADIO_STATION_REVENUE: 8000,
        RESTAURANT_CHAIN_REVENUE: 12000
    };

    // ================================================================
    // TIME
    // ================================================================
    const TIME = {
        WEEKS_PER_MONTH: 4,
        MONTHS_PER_YEAR: 12,
        GAME_START_YEAR: 1933,
        GAME_END_YEAR: 2010,
        LOADING_SCREEN_DURATION_MS: 3000,
        HAYS_CODE_ENFORCEMENT_DATE: new Date(1934, 6, 1) // July 1, 1934
    };

    // ================================================================
    // REPUTATION
    // ================================================================
    const REPUTATION = {
        MIN: 0,
        MAX: 100,
        STARTING: 50,
        CENSORED_FILM_PENALTY: -2,
        REJECTED_FILM_PENALTY: -15
    };

    // ================================================================
    // BOX OFFICE
    // ================================================================
    const BOX_OFFICE = {
        // Base gross = script quality * this multiplier
        QUALITY_MULTIPLIER: 2000,

        // Distribution strategy multipliers
        WIDE_RELEASE_MULTIPLIER: 1.8,
        LIMITED_RELEASE_MULTIPLIER: 1.5,
        STATES_RIGHTS_MULTIPLIER: 1.0,

        // Theater revenue cuts (studio keeps the remainder)
        WIDE_RELEASE_THEATER_CUT: 0.45,
        LIMITED_RELEASE_THEATER_CUT: 0.30,
        STATES_RIGHTS_THEATER_CUT: 0.60,

        // Marketing costs
        WIDE_RELEASE_MARKETING: 20000,
        LIMITED_RELEASE_MARKETING: 5000,
        STATES_RIGHTS_MARKETING: 0,

        // Weekly box office decay curve (must sum to ~1.0)
        WEEKLY_DECAY: [0.45, 0.25, 0.18, 0.12],

        // Critical reception multipliers
        CRITICAL_MULTIPLIERS: {
            rave: 1.4,
            positive: 1.2,
            mixed: 1.0,
            negative: 0.8,
            savage: 0.6
        }
    };

    // ================================================================
    // CENSORSHIP (Hays Code)
    // ================================================================
    const CENSORSHIP = {
        // Noir/crime automatic crime violation probability
        NOIR_CRIME_VIOLATION_CHANCE: 0.35,

        // Final review rejection probability
        FINAL_REVIEW_REJECTION_CHANCE: 0.10,
        FINAL_REVIEW_RESHOOT_COST: 15000,

        // Era adjustments to base censor risk
        // Positive = stricter, Negative = more permissive
        // Post-1968: MPAA ratings replace Hays Code (see CONTENT_REGULATION)
        ERA_ADJUSTMENTS: {
            PRE_CODE: -20,       // 1933-1934: lax enforcement
            GOLDEN_AGE: 15,      // 1935-1941: strict enforcement
            WAR_YEARS: 0,        // 1942-1945: patriotic priority
            POST_WAR: -10,       // 1946-1949: gradually relaxing
            TV_THREAT: -5,       // 1950-1959: Code still enforced but weakening
            NEW_WAVE: -15,       // 1960-1966: Code crumbling, exemptions granted
            RATINGS_ERA: -30,    // 1967-1972: MPAA replaces Code, creative freedom
            NEW_HOLLYWOOD: -35,  // 1973-1979: Almost anything goes
            BLOCKBUSTER_AGE: -25,// 1980-1989: PG-13 introduced, some self-regulation
            INDIE_BOOM: -30,     // 1990-1996: NC-17 replaces X, indie freedom
            DIGITAL_DAWN: -25,   // 1997-2004: Studio self-censorship for PG-13 profits
            CONVERGENCE: -20     // 2005-2010: Studios target PG-13 for global market
        },

        // Content regulation system type by era
        // 'hays_code' = Hays Code with violation risk
        // 'mpaa' = MPAA ratings system (choose your rating)
        CONTENT_REGULATION: {
            PRE_CODE: 'hays_code',
            GOLDEN_AGE: 'hays_code',
            WAR_YEARS: 'hays_code',
            POST_WAR: 'hays_code',
            TV_THREAT: 'hays_code',
            NEW_WAVE: 'hays_code_weak',
            RATINGS_ERA: 'mpaa',
            NEW_HOLLYWOOD: 'mpaa',
            BLOCKBUSTER_AGE: 'mpaa',
            INDIE_BOOM: 'mpaa',
            DIGITAL_DAWN: 'mpaa',
            CONVERGENCE: 'mpaa'
        }
    };

    // ================================================================
    // PRODUCTION
    // ================================================================
    const PRODUCTION = {
        // Phase cost multipliers (relative to average weekly cost)
        PHASE_COSTS: {
            PRE_PRODUCTION: 0.3,
            PRODUCTION: 1.0,
            POST_PRODUCTION: 0.5
        },

        // Random event probability per week during production
        EVENT_PROBABILITY: 0.08,

        // Maximum active productions
        MAX_SIMULTANEOUS_PRODUCTIONS: 5
    };

    // ================================================================
    // TALENT
    // ================================================================
    const TALENT = {
        // Star power midpoint for box office calculations
        STAR_POWER_MIDPOINT: 50,
        STAR_POWER_SCALE: 100,

        // Mob favor system
        MOB_FAVOR_MONTHLY_TRIGGER_CHANCE: 0.15,
        MOB_FAVOR_REFUSAL_PENALTY: 2 // Additional favors owed on refusal
    };

    // ================================================================
    // UI
    // ================================================================
    const UI = {
        MAX_ALERTS: 10,
        DASHBOARD_UPDATE_INTERVAL_MS: 3000,
        NEWSPAPER_DELAY_MS: 300,
        AUTO_SAVE_INTERVAL_MS: 300000, // 5 minutes
        MAX_SAVE_SLOTS: 5,
        MAX_BACKUPS: 3
    };

    // ================================================================
    // ERA FINANCIAL SCALING
    // Multipliers relative to 1933 base values. Applied to budgets,
    // revenues, costs, and salaries as the game progresses through decades.
    // Based on real Hollywood economics and CPI data.
    // ================================================================
    const ERA_SCALING = {
        PRE_CODE:        { inflationMult: 1.0,  budgetRange: [50000, 500000],      monthlyBurnMult: 1.0,  marketingMult: 1.0  },
        GOLDEN_AGE:      { inflationMult: 1.1,  budgetRange: [100000, 1000000],    monthlyBurnMult: 1.1,  marketingMult: 1.2  },
        WAR_YEARS:       { inflationMult: 1.3,  budgetRange: [150000, 1500000],    monthlyBurnMult: 1.2,  marketingMult: 1.3  },
        POST_WAR:        { inflationMult: 1.5,  budgetRange: [200000, 2000000],    monthlyBurnMult: 1.4,  marketingMult: 1.5  },
        TV_THREAT:       { inflationMult: 2.0,  budgetRange: [500000, 5000000],    monthlyBurnMult: 1.8,  marketingMult: 2.0  },
        NEW_WAVE:        { inflationMult: 2.8,  budgetRange: [1000000, 10000000],  monthlyBurnMult: 2.5,  marketingMult: 3.0  },
        RATINGS_ERA:     { inflationMult: 3.5,  budgetRange: [500000, 8000000],    monthlyBurnMult: 3.0,  marketingMult: 3.5  },
        NEW_HOLLYWOOD:   { inflationMult: 5.0,  budgetRange: [2000000, 20000000],  monthlyBurnMult: 4.0,  marketingMult: 5.0  },
        BLOCKBUSTER_AGE: { inflationMult: 8.0,  budgetRange: [5000000, 50000000],  monthlyBurnMult: 6.0,  marketingMult: 10.0 },
        INDIE_BOOM:      { inflationMult: 11.0, budgetRange: [10000000, 80000000], monthlyBurnMult: 8.0,  marketingMult: 15.0 },
        DIGITAL_DAWN:    { inflationMult: 13.0, budgetRange: [20000000, 150000000],monthlyBurnMult: 10.0, marketingMult: 20.0 },
        CONVERGENCE:     { inflationMult: 16.0, budgetRange: [30000000, 250000000],monthlyBurnMult: 12.0, marketingMult: 25.0 }
    };

    return {
        FINANCIAL,
        TIME,
        REPUTATION,
        BOX_OFFICE,
        CENSORSHIP,
        PRODUCTION,
        TALENT,
        UI,
        ERA_SCALING
    };
})();
