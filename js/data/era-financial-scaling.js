/**
 * DEPRECATED: Reference data only. The active scaling data lives in
 * js/core/constants.js → ERA_SCALING (with keys: inflationMult,
 * budgetRange, monthlyBurnMult, marketingMult). This file is kept
 * for historical reference and detailed sourcing notes.
 *
 * HOLLYWOOD MOGUL - ERA FINANCIAL SCALING DATA
 * Historically authentic economic data for 12 eras (1933-2010)
 * All values based on real CPI data, NATO ticket price records,
 * studio salary archives, and industry financial reports.
 *
 * inflationMultiplier: relative to 1933 CPI base (13.0). Source: BLS CPI-U.
 * avgTicketPrice: Source: NATO (National Association of Theatre Owners).
 * starSalaryRange: Monthly equivalent for contract/per-film talent.
 * marketingCostMultiplier: Grows faster than inflation (TV ads, saturation marketing).
 */

var ERA_FINANCIAL_SCALING = {
    PRE_CODE: {
        years: [1933, 1934],
        inflationMultiplier: 1.0,
        avgBudgetRange: [50000, 500000],
        avgTicketPrice: 0.23,
        monthlyBurnMultiplier: 1.0,
        starSalaryRange: [500, 5000],
        marketingCostMultiplier: 1.0,
        description: "Depression-era Hollywood. Low costs, modest returns, no content restrictions."
    },

    GOLDEN_AGE: {
        years: [1935, 1941],
        inflationMultiplier: 1.1,
        avgBudgetRange: [300000, 1000000],
        avgTicketPrice: 0.25,
        monthlyBurnMultiplier: 1.15,
        starSalaryRange: [750, 10000],
        marketingCostMultiplier: 1.2,
        description: "Studio system at its peak. Hays Code enforced. Prestige pictures and star power reign."
    },

    WAR_YEARS: {
        years: [1942, 1945],
        inflationMultiplier: 1.33,
        avgBudgetRange: [500000, 1500000],
        avgTicketPrice: 0.27,
        monthlyBurnMultiplier: 1.35,
        starSalaryRange: [1000, 15000],
        marketingCostMultiplier: 1.5,
        description: "Material rationing but record attendance. Patriotic films and war bonds drive the box office."
    },

    POST_WAR: {
        years: [1946, 1949],
        inflationMultiplier: 1.69,
        avgBudgetRange: [800000, 2000000],
        avgTicketPrice: 0.40,
        monthlyBurnMultiplier: 1.7,
        starSalaryRange: [1500, 25000],
        marketingCostMultiplier: 2.0,
        description: "Peak attendance year 1946: 90M weekly tickets. Film noir flourishes. Paramount decree looms."
    },

    TV_THREAT: {
        years: [1950, 1959],
        inflationMultiplier: 2.06,
        avgBudgetRange: [1000000, 5000000],
        avgTicketPrice: 0.55,
        monthlyBurnMultiplier: 2.2,
        starSalaryRange: [2500, 50000],
        marketingCostMultiplier: 4.0,
        description: "Attendance drops 50% as TV invades. Studios fight back with CinemaScope, 3-D, and epics."
    },

    NEW_WAVE: {
        years: [1960, 1966],
        inflationMultiplier: 2.38,
        avgBudgetRange: [2000000, 8000000],
        avgTicketPrice: 0.85,
        monthlyBurnMultiplier: 2.5,
        starSalaryRange: [5000, 100000],
        marketingCostMultiplier: 6.0,
        description: "Old Hollywood crumbles. Big-budget epics fail spectacularly. International art cinema rises."
    },

    RATINGS_ERA: {
        years: [1967, 1972],
        inflationMultiplier: 2.89,
        avgBudgetRange: [1000000, 5000000],
        avgTicketPrice: 1.46,
        monthlyBurnMultiplier: 3.0,
        starSalaryRange: [3000, 75000],
        marketingCostMultiplier: 5.0,
        description: "MPAA ratings replace the Hays Code. Low-budget revolution. Easy Rider changes everything."
    },

    NEW_HOLLYWOOD: {
        years: [1973, 1979],
        inflationMultiplier: 4.38,
        avgBudgetRange: [3000000, 15000000],
        avgTicketPrice: 2.20,
        monthlyBurnMultiplier: 4.5,
        starSalaryRange: [8000, 150000],
        marketingCostMultiplier: 12.0,
        description: "The auteurs take over. Jaws and Star Wars invent the modern blockbuster and saturation release."
    },

    BLOCKBUSTER_AGE: {
        years: [1980, 1989],
        inflationMultiplier: 8.23,
        avgBudgetRange: [10000000, 40000000],
        avgTicketPrice: 3.55,
        monthlyBurnMultiplier: 8.5,
        starSalaryRange: [15000, 500000],
        marketingCostMultiplier: 25.0,
        description: "High concept rules. Star salaries explode past $10M. VHS home video becomes a massive revenue stream."
    },

    INDIE_BOOM: {
        years: [1990, 1996],
        inflationMultiplier: 11.0,
        avgBudgetRange: [30000000, 70000000],
        avgTicketPrice: 4.35,
        monthlyBurnMultiplier: 11.5,
        starSalaryRange: [25000, 1000000],
        marketingCostMultiplier: 40.0,
        description: "Sundance and Miramax prove indie films can profit. Studio tentpoles grow ever larger."
    },

    DIGITAL_DAWN: {
        years: [1997, 2004],
        inflationMultiplier: 13.46,
        avgBudgetRange: [50000000, 120000000],
        avgTicketPrice: 5.65,
        monthlyBurnMultiplier: 14.0,
        starSalaryRange: [30000, 1500000],
        marketingCostMultiplier: 65.0,
        description: "Titanic shatters records. DVD revenue surpasses theatrical. CGI transforms filmmaking forever."
    },

    CONVERGENCE: {
        years: [2005, 2010],
        inflationMultiplier: 15.92,
        avgBudgetRange: [70000000, 200000000],
        avgTicketPrice: 7.18,
        monthlyBurnMultiplier: 16.5,
        starSalaryRange: [40000, 2000000],
        marketingCostMultiplier: 90.0,
        description: "Franchise IP dominates. Avatar redefines spectacle. Digital projection replaces 35mm film."
    }
};
