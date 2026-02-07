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
        GAME_END_YEAR: 1949,
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
        ERA_ADJUSTMENTS: {
            PRE_CODE: -20,       // 1933-1934: lax enforcement
            GOLDEN_AGE: 15,      // 1935-1941: strict enforcement
            WAR_YEARS: 0,        // 1942-1945: patriotic priority
            POST_WAR: -10        // 1946-1949: gradually relaxing
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

    return {
        FINANCIAL,
        TIME,
        REPUTATION,
        BOX_OFFICE,
        CENSORSHIP,
        PRODUCTION,
        TALENT,
        UI
    };
})();
