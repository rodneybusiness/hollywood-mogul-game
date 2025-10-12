/**
 * HOLLYWOOD MOGUL - SCRIPT LIBRARY
 * Historically authentic film scripts spanning 1933-1949
 */

window.ScriptLibrary = (function() {
    'use strict';
    
    // Master script database with historical authenticity
    const SCRIPT_DATABASE = {
        // PRE-CODE ERA (1933-1934) - Risqué content, fewer restrictions
        preCode: [
            {
                title: "Manhattan Underworld",
                genre: "gangster",
                year: 1933,
                budget: 85000,
                quality: 78,
                description: "A hard-hitting tale of bootleggers and corrupt cops in Depression-era New York.",
                censorRisk: 85, // High risk - violence and crime
                shootingDays: 16,
                themes: ["crime", "corruption", "urban decay"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 4 },
                locationNeeds: ["urban_street", "speakeasy", "police_station"],
                historicalNotes: "Pre-Code gangster films were extremely popular but would face restrictions after 1934"
            },
            
            {
                title: "Scarlet Nights",
                genre: "drama",
                year: 1933,
                budget: 75000,
                quality: 72,
                description: "A provocative story of a woman's rise from poverty to society through questionable means.",
                censorRisk: 90, // Very high - sexual content
                shootingDays: 18,
                themes: ["sexuality", "class", "morality"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 5 },
                locationNeeds: ["mansion", "nightclub", "tenement"],
                historicalNotes: "This type of 'fallen woman' narrative would be banned under the Hays Code"
            },
            
            {
                title: "Gold Diggers of Broadway",
                genre: "musical",
                year: 1933,
                budget: 125000,
                quality: 80,
                description: "Chorus girls scheme to marry wealthy men during the Depression.",
                censorRisk: 60, // Medium - suggestive themes
                shootingDays: 25,
                themes: ["depression", "survival", "romance"],
                castRequirements: { male_lead: 3, female_lead: 4, dancers: 12 },
                locationNeeds: ["theater", "luxury_hotel", "rehearsal_hall"],
                historicalNotes: "Early musical revues often featured elaborate production numbers"
            }
        ],
        
        // GOLDEN AGE (1935-1941) - Studio system peak, Hays Code in effect
        goldenAge: [
            {
                title: "Western Justice",
                genre: "western",
                year: 1936,
                budget: 95000,
                quality: 75,
                description: "A noble sheriff brings law and order to a corrupt frontier town.",
                censorRisk: 20, // Low risk - morally clear
                shootingDays: 20,
                themes: ["justice", "frontier", "good_vs_evil"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["western_town", "saloon", "desert"],
                historicalNotes: "Westerns became the quintessential American genre during this period"
            },
            
            {
                title: "Screwball Society",
                genre: "comedy",
                year: 1937,
                budget: 110000,
                quality: 85,
                description: "A wealthy heiress and a common reporter engage in witty romantic warfare.",
                censorRisk: 15, // Very low - sophisticated comedy
                shootingDays: 22,
                themes: ["class_differences", "romance", "wit"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["mansion", "newspaper_office", "yacht"],
                historicalNotes: "Screwball comedies defined sophisticated entertainment in the late 1930s"
            },
            
            {
                title: "Technicolor Dreams",
                genre: "musical",
                year: 1938,
                budget: 200000, // Color films were expensive
                quality: 88,
                description: "A Broadway producer stages the most spectacular musical revue ever conceived.",
                censorRisk: 10, // Very low - wholesome entertainment
                shootingDays: 35,
                themes: ["ambition", "showbusiness", "spectacle"],
                castRequirements: { male_lead: 2, female_lead: 2, dancers: 20 },
                locationNeeds: ["theater", "rehearsal_hall", "backstage"],
                specialRequirements: ["technicolor", "elaborate_sets"],
                historicalNotes: "Color films were rare and expensive but drew huge audiences"
            },
            
            {
                title: "The Grapes of Hope",
                genre: "drama",
                year: 1939,
                budget: 150000,
                quality: 92, // Potential Oscar winner
                description: "A migrant family struggles to survive during the Great Depression.",
                censorRisk: 35, // Medium - social commentary
                shootingDays: 28,
                themes: ["depression", "family", "resilience"],
                castRequirements: { male_lead: 1, female_lead: 1, children: 3, supporting: 8 },
                locationNeeds: ["farm", "migrant_camp", "highway"],
                historicalNotes: "Social realist dramas addressed Depression hardships"
            },
            
            {
                title: "Adventure in the Amazon",
                genre: "adventure",
                year: 1940,
                budget: 130000,
                quality: 70,
                description: "Explorers search for a lost city deep in the dangerous Amazon jungle.",
                censorRisk: 25, // Low-medium - adventure violence
                shootingDays: 30,
                themes: ["exploration", "danger", "discovery"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 5 },
                locationNeeds: ["jungle", "river", "native_village"],
                specialRequirements: ["animal_handlers", "stunt_coordinators"],
                historicalNotes: "Exotic adventure films were popular escapist entertainment"
            }
        ],
        
        // WAR YEARS (1941-1945) - Propaganda, patriotism, wartime themes
        warYears: [
            {
                title: "Wings Over the Pacific",
                genre: "war",
                year: 1942,
                budget: 175000,
                quality: 82,
                description: "Navy pilots fight heroically in the Pacific Theater against overwhelming odds.",
                censorRisk: 5, // Very low - patriotic
                shootingDays: 32,
                themes: ["patriotism", "sacrifice", "brotherhood"],
                castRequirements: { male_lead: 3, female_lead: 1, supporting: 10 },
                locationNeeds: ["aircraft_carrier", "airfield", "pacific_island"],
                specialRequirements: ["aircraft", "military_cooperation"],
                governmentSupport: true, // Government subsidized
                historicalNotes: "Government actively encouraged war films and provided military equipment"
            },
            
            {
                title: "Rosie the Riveter",
                genre: "drama",
                year: 1943,
                budget: 90000,
                quality: 78,
                description: "Women take over factory jobs while their men fight overseas.",
                censorRisk: 10, // Low - patriotic message
                shootingDays: 20,
                themes: ["women_workforce", "homefront", "independence"],
                castRequirements: { male_lead: 1, female_lead: 3, supporting: 8 },
                locationNeeds: ["factory", "neighborhood", "train_station"],
                governmentSupport: true,
                historicalNotes: "Films about women's wartime contributions were encouraged"
            },
            
            {
                title: "Casablanca Nights",
                genre: "romance",
                year: 1943,
                budget: 105000,
                quality: 90, // Potential classic
                description: "Love and espionage intersect in wartime Morocco.",
                censorRisk: 20, // Low-medium - wartime intrigue
                shootingDays: 24,
                themes: ["love", "sacrifice", "resistance"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 8 },
                locationNeeds: ["nightclub", "airport", "hotel"],
                historicalNotes: "Wartime romances often featured exotic locations and moral complexity"
            },
            
            {
                title: "Victory Garden",
                genre: "comedy",
                year: 1944,
                budget: 75000,
                quality: 65,
                description: "A bumbling civilian tries to help the war effort with disastrous comic results.",
                censorRisk: 5, // Very low - light comedy
                shootingDays: 16,
                themes: ["homefront", "patriotism", "comedy"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["suburban_home", "factory", "garden"],
                governmentSupport: true,
                historicalNotes: "Light comedies helped maintain morale during wartime"
            }
        ],
        
        // POST-WAR (1946-1949) - Film noir, cynicism, changing world
        postWar: [
            {
                title: "City of Shadows",
                genre: "noir",
                year: 1946,
                budget: 120000,
                quality: 85,
                description: "A war veteran returns home to find his city corrupted by crime and betrayal.",
                censorRisk: 45, // Medium-high - dark themes
                shootingDays: 26,
                themes: ["corruption", "disillusionment", "urban_decay"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 7 },
                locationNeeds: ["dark_alley", "police_station", "nightclub"],
                specialRequirements: ["night_shooting", "atmospheric_lighting"],
                historicalNotes: "Film noir emerged from post-war disillusionment and anxiety"
            },
            
            {
                title: "The Blacklist",
                genre: "drama",
                year: 1947,
                budget: 100000,
                quality: 88,
                description: "A Hollywood writer faces persecution during the communist witch hunts.",
                censorRisk: 95, // Extremely high - political content
                shootingDays: 22,
                themes: ["mccarthyism", "censorship", "integrity"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 10 },
                locationNeeds: ["studio", "courtroom", "blacklisted_writer_home"],
                riskWarning: "EXTREMELY CONTROVERSIAL - Could trigger HUAC investigation",
                historicalNotes: "Few films dared address HUAC directly due to industry fear"
            },
            
            {
                title: "Suburban Dreams",
                genre: "drama",
                year: 1948,
                budget: 85000,
                quality: 75,
                description: "A returning veteran struggles to adjust to peacetime family life.",
                censorRisk: 25, // Low-medium - psychological themes
                shootingDays: 18,
                themes: ["ptsd", "family", "adjustment"],
                castRequirements: { male_lead: 1, female_lead: 1, children: 2, supporting: 5 },
                locationNeeds: ["suburban_home", "factory", "va_hospital"],
                historicalNotes: "Post-war adjustment became a major theme in late 1940s cinema"
            },
            
            {
                title: "Television Blues",
                genre: "comedy",
                year: 1949,
                budget: 95000,
                quality: 70,
                description: "A radio comedian tries to adapt his act for the new medium of television.",
                censorRisk: 15, // Low - industry satire
                shootingDays: 20,
                themes: ["technology", "change", "showbusiness"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["tv_studio", "radio_station", "apartment"],
                historicalNotes: "Television's emergence threatened Hollywood's dominance"
            },
            
            {
                title: "The Last Frontier",
                genre: "western",
                year: 1949,
                budget: 110000,
                quality: 80,
                description: "The old West gives way to modern civilization in this elegiac Western.",
                censorRisk: 20, // Low - traditional themes
                shootingDays: 25,
                themes: ["progress", "nostalgia", "civilization"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 8 },
                locationNeeds: ["frontier_town", "railroad", "ranch"],
                historicalNotes: "Late 1940s Westerns began exploring themes of change and loss"
            }
        ],
        
        // B-MOVIES - Low budget quickies for double features
        bMovies: [
            {
                title: "Midnight Terror",
                genre: "horror",
                year: 1935,
                budget: 35000,
                quality: 55,
                description: "A mad scientist creates monsters in his secret laboratory.",
                censorRisk: 40, // Medium - horror content
                shootingDays: 12,
                themes: ["science", "horror", "madness"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 4 },
                locationNeeds: ["laboratory", "castle", "village"],
                budgetCategory: "B-movie",
                historicalNotes: "Horror B-movies were profitable with low production costs"
            },
            
            {
                title: "Range Riders",
                genre: "western",
                year: 1940,
                budget: 45000,
                quality: 60,
                description: "Cowboys protect a frontier town from cattle rustlers.",
                censorRisk: 10, // Very low - formula Western
                shootingDays: 14,
                themes: ["justice", "frontier", "cattle"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["ranch", "desert", "small_town"],
                budgetCategory: "B-movie",
                historicalNotes: "B-Westerns were the backbone of many studios' output"
            },
            
            {
                title: "Jungle Goddess",
                genre: "adventure",
                year: 1942,
                budget: 40000,
                quality: 50,
                description: "Explorers discover a lost civilization ruled by a beautiful queen.",
                censorRisk: 30, // Medium - exotic content
                shootingDays: 16,
                themes: ["adventure", "exotic", "discovery"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 6 },
                locationNeeds: ["jungle", "temple", "native_village"],
                budgetCategory: "B-movie",
                historicalNotes: "Exotic adventures were cheap to produce using studio backlots"
            }
        ]
    };
    
    // Script generation parameters by era
    const ERA_PARAMETERS = {
        1933: { preCodeChance: 0.7, bMovieChance: 0.4 },
        1934: { preCodeChance: 0.3, bMovieChance: 0.5 }, // Transition year
        1935: { goldenAgeChance: 0.6, bMovieChance: 0.4 },
        1938: { technicolorAvailable: true, goldenAgeChance: 0.8 },
        1942: { warYearsChance: 0.6, propagandaBonus: true },
        1943: { warYearsChance: 0.8, propagandaBonus: true },
        1946: { postWarChance: 0.4, noirChance: 0.3 },
        1947: { postWarChance: 0.7, huacRisk: true },
        1948: { postWarChance: 0.8, tvCompetition: true },
        1949: { postWarChance: 0.9, industryChange: true }
    };
    
    /**
     * Generate initial script selection for game start
     */
    function generateInitialScripts() {
        const scripts = [];
        
        // Always include a mix of budgets and genres for 1933
        scripts.push(selectScriptByType('preCode', 'low_budget'));
        scripts.push(selectScriptByType('preCode', 'medium_budget')); 
        scripts.push(selectScriptByType('bMovies', 'b_movie'));
        scripts.push(selectScriptByType('preCode', 'high_risk'));
        scripts.push(selectScriptByType('goldenAge', 'safe_bet')); // Early transitional script
        
        return scripts.map(addScriptMetadata);
    }
    
    /**
     * Generate new scripts monthly based on current year and industry conditions
     */
    function generateMonthlyScripts(gameState) {
        const year = gameState.gameYear;
        const params = getEraParameters(year);
        const scripts = [];
        
        // Generate 2-4 new scripts per month
        const scriptCount = 2 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < scriptCount; i++) {
            const script = generateScriptForYear(year, params, gameState);
            if (script) {
                scripts.push(addScriptMetadata(script));
            }
        }
        
        return scripts;
    }
    
    /**
     * Generate a script appropriate for the current year
     */
    function generateScriptForYear(year, params, gameState) {
        const availableCategories = [];
        
        // Determine available script categories based on year
        if (year <= 1934 && Math.random() < params.preCodeChance) {
            availableCategories.push('preCode');
        }
        
        if (year >= 1935 && year <= 1941 && Math.random() < params.goldenAgeChance) {
            availableCategories.push('goldenAge');
        }
        
        if (year >= 1941 && year <= 1945 && Math.random() < params.warYearsChance) {
            availableCategories.push('warYears');
        }
        
        if (year >= 1946 && Math.random() < params.postWarChance) {
            availableCategories.push('postWar');
        }
        
        // B-movies available throughout
        if (Math.random() < params.bMovieChance) {
            availableCategories.push('bMovies');
        }
        
        // Default to golden age if no category selected
        if (availableCategories.length === 0) {
            availableCategories.push('goldenAge');
        }
        
        // Select category and script
        const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        const scripts = SCRIPT_DATABASE[category];
        
        if (!scripts || scripts.length === 0) return null;
        
        // Filter by year appropriateness
        const appropriateScripts = scripts.filter(script => 
            Math.abs(script.year - year) <= 2
        );
        
        const selectedScripts = appropriateScripts.length > 0 ? appropriateScripts : scripts;
        const baseScript = selectedScripts[Math.floor(Math.random() * selectedScripts.length)];
        
        // Create variation of base script
        return createScriptVariation(baseScript, year, gameState);
    }
    
    /**
     * Create a variation of an existing script
     */
    function createScriptVariation(baseScript, currentYear, gameState) {
        const variation = { ...baseScript };
        
        // Adjust for current year
        variation.year = currentYear;
        
        // Budget variations (+/- 20%)
        const budgetVariation = 0.8 + (Math.random() * 0.4);
        variation.budget = Math.floor(baseScript.budget * budgetVariation);
        
        // Quality variations (+/- 15 points)
        const qualityVariation = -15 + (Math.random() * 30);
        variation.quality = Math.max(30, Math.min(95, baseScript.quality + qualityVariation));
        
        // Title variations
        variation.title = generateVariationTitle(baseScript.title, baseScript.genre);
        
        // Description variations
        variation.description = generateVariationDescription(baseScript, variation.title);
        
        // Adjust censor risk based on current era
        variation.censorRisk = adjustCensorRiskForEra(baseScript.censorRisk, currentYear);
        
        return variation;
    }
    
    /**
     * Generate title variations
     */
    function generateVariationTitle(baseTitle, genre) {
        const titleVariations = {
            gangster: [
                "Big City Rackets", "Underworld Empire", "Crime Does Pay", "The Mob's Revenge", 
                "Bullets and Betrayal", "Gang War", "City of Sin", "The Last Heist"
            ],
            western: [
                "Frontier Justice", "Badlands Showdown", "The Lone Gunman", "Desert Vengeance",
                "Trail of Justice", "Six-Gun Territory", "The Last Outlaw", "Sunset Ridge"
            ],
            romance: [
                "Love's Sweet Promise", "Hearts Divided", "Passion's Price", "Love Conquers All",
                "Stolen Hearts", "Romance in Paris", "Love's True Test", "Hearts on Fire"
            ],
            comedy: [
                "Crazy About You", "Love and Laughter", "The Dizzy Blonde", "Comedy of Errors",
                "Laughing All the Way", "The Merry Mix-Up", "Fun and Games", "The Comic Relief"
            ],
            drama: [
                "Life's Turning Point", "The Human Condition", "Tears of Joy", "The Price of Fame",
                "Dreams and Struggles", "The Test of Time", "Life's Greatest Challenge", "The Final Act"
            ],
            horror: [
                "Chamber of Horrors", "The Midnight Monster", "Terror in the Night", "The Haunted House",
                "Creature Feature", "The Mad Doctor", "Nightmare Alley", "The Thing from Hell"
            ],
            musical: [
                "Broadway Melody", "Song and Dance", "The Musical Revue", "Dancing Queen",
                "Melody Lane", "The Big Show", "Lights and Music", "The Star is Born"
            ],
            war: [
                "Victory at Dawn", "Heroes of the Pacific", "The Great Sacrifice", "Battle Cry",
                "Wings of Freedom", "The Longest Day", "Valor and Victory", "For God and Country"
            ],
            noir: [
                "Dark Alley", "City of Shadows", "The Night Watch", "Dangerous Game",
                "Shadow Play", "The Dark Side", "Midnight Confession", "The Long Goodbye"
            ],
            adventure: [
                "Jungle Quest", "Lost Treasure", "The Great Adventure", "Into the Unknown",
                "The Explorer", "Dangerous Journey", "The Lost World", "Adventure Calls"
            ]
        };
        
        const variations = titleVariations[genre] || titleVariations.drama;
        return variations[Math.floor(Math.random() * variations.length)];
    }
    
    /**
     * Generate description variations
     */
    function generateVariationDescription(baseScript, newTitle) {
        const templates = {
            gangster: [
                `A ruthless crime boss builds an empire of vice and corruption in the big city.`,
                `Rival gangs battle for control of the lucrative bootlegging trade.`,
                `A cop goes undercover to infiltrate the city's most dangerous crime syndicate.`,
                `From the slums to penthouse suites, one man's rise through organized crime.`
            ],
            western: [
                `A lone cowboy brings justice to a lawless frontier town.`,
                `Cattlemen and homesteaders clash over water rights in the Old West.`,
                `A sheriff faces down a gang of outlaws in a final showdown.`,
                `Gold rush fever brings adventure and danger to the frontier.`
            ],
            romance: [
                `Two hearts from different worlds find love against all odds.`,
                `A society woman falls for a common working man.`,
                `Love blooms during a chance encounter on a cross-country train.`,
                `Can true love survive the test of time and circumstance?`
            ],
            comedy: [
                `Mistaken identities lead to hilarious romantic complications.`,
                `A bumbling hero accidentally becomes the town's greatest celebrity.`,
                `Screwball antics ensue when high society meets small-town values.`,
                `A comedy of errors involving love, money, and misunderstandings.`
            ],
            drama: [
                `A powerful story of one family's struggle through hard times.`,
                `Dreams clash with reality in this moving human drama.`,
                `The price of ambition is explored in this gripping tale.`,
                `A character study of ordinary people facing extraordinary challenges.`
            ]
        };
        
        const genreTemplates = templates[baseScript.genre] || templates.drama;
        return genreTemplates[Math.floor(Math.random() * genreTemplates.length)];
    }
    
    /**
     * Adjust censor risk based on current era
     */
    function adjustCensorRiskForEra(baseCensorRisk, year) {
        // Pre-Code era (1933-1934): Lower censorship
        if (year <= 1934) {
            return Math.max(5, baseCensorRisk - 20);
        }
        
        // Hays Code enforcement (1935-1941): Higher censorship
        if (year >= 1935 && year <= 1941) {
            return Math.min(95, baseCensorRisk + 15);
        }
        
        // War years (1942-1945): Moderate, patriotic content encouraged
        if (year >= 1942 && year <= 1945) {
            return baseCensorRisk; // No change
        }
        
        // Post-war (1946-1949): Increasing social commentary, some relaxation
        if (year >= 1946) {
            return Math.max(5, baseCensorRisk - 5);
        }
        
        return baseCensorRisk;
    }
    
    /**
     * Add metadata to script for game use
     */
    function addScriptMetadata(script) {
        return {
            ...script,
            id: generateScriptId(),
            available: true,
            optioned: false,
            optionDate: null,
            optionExpiry: null,
            recommendedBudget: calculateRecommendedBudget(script),
            profitProjection: calculateProfitProjection(script),
            riskAssessment: assessRisk(script),
            marketAppeal: assessMarketAppeal(script)
        };
    }
    
    /**
     * Calculate recommended production budget
     */
    function calculateRecommendedBudget(script) {
        let budget = script.budget;
        
        // Adjust for special requirements
        if (script.specialRequirements) {
            script.specialRequirements.forEach(req => {
                switch (req) {
                    case 'technicolor':
                        budget *= 1.5;
                        break;
                    case 'elaborate_sets':
                        budget *= 1.3;
                        break;
                    case 'animal_handlers':
                    case 'stunt_coordinators':
                        budget *= 1.2;
                        break;
                }
            });
        }
        
        // Adjust for cast requirements
        const totalCast = Object.values(script.castRequirements).reduce((sum, count) => 
            sum + (typeof count === 'number' ? count : 0), 0
        );
        
        if (totalCast > 10) {
            budget *= 1.1;
        }
        
        return Math.floor(budget);
    }
    
    /**
     * Calculate profit projection
     */
    function calculateProfitProjection(script) {
        const budget = script.budget;
        let projection = budget * 1.3; // Conservative 30% profit
        
        // Quality bonus
        if (script.quality > 80) {
            projection *= 1.5;
        } else if (script.quality > 70) {
            projection *= 1.2;
        }
        
        // Genre popularity (simplified)
        const genreMultipliers = {
            musical: 1.4,
            comedy: 1.3,
            western: 1.2,
            romance: 1.2,
            drama: 1.1,
            adventure: 1.1,
            gangster: 1.0,
            war: 1.3, // During war years
            noir: 1.0,
            horror: 0.9
        };
        
        projection *= (genreMultipliers[script.genre] || 1.0);
        
        // Censor risk penalty
        if (script.censorRisk > 70) {
            projection *= 0.8;
        } else if (script.censorRisk > 50) {
            projection *= 0.9;
        }
        
        return Math.floor(projection);
    }
    
    /**
     * Assess production risk
     */
    function assessRisk(script) {
        let riskScore = 0;
        
        // Budget risk
        if (script.budget > 150000) riskScore += 30;
        else if (script.budget > 100000) riskScore += 20;
        else if (script.budget > 50000) riskScore += 10;
        
        // Censor risk
        riskScore += Math.floor(script.censorRisk / 3);
        
        // Special requirements risk
        if (script.specialRequirements) {
            riskScore += script.specialRequirements.length * 5;
        }
        
        // Shooting complexity
        if (script.shootingDays > 30) riskScore += 15;
        else if (script.shootingDays > 20) riskScore += 10;
        
        // Quality uncertainty
        if (script.quality < 60) riskScore += 20;
        else if (script.quality < 70) riskScore += 10;
        
        if (riskScore <= 20) return 'LOW';
        if (riskScore <= 40) return 'MEDIUM';
        if (riskScore <= 60) return 'HIGH';
        return 'EXTREME';
    }
    
    /**
     * Assess market appeal
     */
    function assessMarketAppeal(script) {
        let appealScore = script.quality;
        
        // Genre appeal (era-specific)
        const currentGenreHeat = getGenreHeat(script.genre, script.year);
        appealScore += (currentGenreHeat - 100) / 2;
        
        // Censor risk penalty
        appealScore -= script.censorRisk / 4;
        
        // Special bonuses
        if (script.governmentSupport) appealScore += 10;
        if (script.budgetCategory === 'B-movie') appealScore -= 15; // Lower expectations
        
        if (appealScore >= 80) return 'EXCELLENT';
        if (appealScore >= 70) return 'GOOD';
        if (appealScore >= 60) return 'FAIR';
        return 'POOR';
    }
    
    /**
     * Show script selection interface
     */
    function showScriptSelection(gameState) {
        const availableScripts = gameState.availableScripts.filter(script => 
            script.available && !script.optioned
        );
        
        if (availableScripts.length === 0) {
            if (window.HollywoodMogul) {
                window.HollywoodMogul.showModal(`
                    <h2>No Scripts Available</h2>
                    <p>No new scripts are available this month. Try advancing time to get new submissions.</p>
                    <button onclick="HollywoodMogul.closeModal()" class="action-btn primary">Close</button>
                `);
            }
            return;
        }
        
        let modalContent = `
            <div class="script-library">
                <h2>Available Scripts - ${window.TimeSystem ? window.TimeSystem.formatDate(gameState.currentDate) : gameState.gameYear}</h2>
                <p class="library-subtitle">Select a script to greenlight for production</p>
                
                <div class="scripts-grid">
                    ${availableScripts.slice(0, 6).map(script => createScriptCard(script, gameState)).join('')}
                </div>
                
                <div class="library-footer">
                    <button onclick="HollywoodMogul.closeModal()" class="action-btn secondary">Cancel</button>
                </div>
            </div>
        `;
        
        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalContent);
        }
    }
    
    /**
     * Create script card HTML
     */
    function createScriptCard(script, gameState) {
        const canAfford = gameState.cash >= script.recommendedBudget;
        const riskColor = {
            'LOW': 'success',
            'MEDIUM': 'warning', 
            'HIGH': 'danger',
            'EXTREME': 'danger'
        };
        
        return `
            <div class="script-card ${canAfford ? '' : 'unaffordable'}">
                <div class="script-header">
                    <h3 class="script-title">${script.title}</h3>
                    <div class="script-genre">${script.genre.toUpperCase()}</div>
                </div>
                
                <div class="script-details">
                    <p class="script-description">${script.description}</p>
                    
                    <div class="script-stats">
                        <div class="stat-row">
                            <span class="stat-label">Budget:</span>
                            <span class="stat-value">$${script.recommendedBudget.toLocaleString()}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Quality:</span>
                            <span class="stat-value">${script.quality}/100</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Shooting Days:</span>
                            <span class="stat-value">${script.shootingDays} days</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Censor Risk:</span>
                            <span class="stat-value risk-${script.censorRisk > 70 ? 'high' : script.censorRisk > 40 ? 'medium' : 'low'}">
                                ${script.censorRisk}%
                            </span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Risk Level:</span>
                            <span class="stat-value text-${riskColor[script.riskAssessment]}">${script.riskAssessment}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Market Appeal:</span>
                            <span class="stat-value">${script.marketAppeal}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Projected Revenue:</span>
                            <span class="stat-value">$${script.profitProjection.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    ${script.riskWarning ? `
                        <div class="risk-warning">
                            ⚠️ ${script.riskWarning}
                        </div>
                    ` : ''}
                    
                    ${script.historicalNotes ? `
                        <div class="historical-notes">
                            📚 ${script.historicalNotes}
                        </div>
                    ` : ''}
                </div>
                
                <div class="script-actions">
                    <button onclick="ScriptLibrary.greenlightScript('${script.id}')" 
                            class="action-btn ${canAfford ? 'primary' : 'disabled'}"
                            ${canAfford ? '' : 'disabled'}>
                        ${canAfford ? 'GREENLIGHT' : 'INSUFFICIENT FUNDS'}
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Greenlight a script for production
     */
    function greenlightScript(scriptId) {
        const gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        if (!gameState) return;
        
        const script = gameState.availableScripts.find(s => s.id === scriptId);
        if (!script) return;
        
        // Check if can afford
        if (gameState.cash < script.recommendedBudget) {
            if (window.HollywoodMogul) {
                window.HollywoodMogul.addAlert({
                    type: 'warning',
                    icon: '💸',
                    message: `Cannot afford "${script.title}" - need $${script.recommendedBudget.toLocaleString()}`,
                    priority: 'high'
                });
            }
            return;
        }
        
        // Start production
        if (window.ProductionSystem) {
            window.ProductionSystem.startProduction(script, gameState);
            
            // Remove from available scripts
            script.available = false;
            script.optioned = true;
            script.optionDate = new Date(gameState.currentDate);
        }
        
        if (window.HollywoodMogul) {
            window.HollywoodMogul.closeModal();
        }
        
        console.log(`Greenlit "${script.title}" for production`);
    }
    
    /**
     * Helper functions
     */
    
    function getEraParameters(year) {
        return ERA_PARAMETERS[year] || {
            goldenAgeChance: 0.6,
            bMovieChance: 0.3
        };
    }
    
    function selectScriptByType(category, type) {
        const scripts = SCRIPT_DATABASE[category] || [];
        
        if (type === 'low_budget') {
            return scripts.find(s => s.budget < 75000) || scripts[0];
        }
        if (type === 'medium_budget') {
            return scripts.find(s => s.budget >= 75000 && s.budget < 150000) || scripts[0];
        }
        if (type === 'high_budget') {
            return scripts.find(s => s.budget >= 150000) || scripts[0];
        }
        if (type === 'high_risk') {
            return scripts.find(s => s.censorRisk > 70) || scripts[0];
        }
        if (type === 'safe_bet') {
            return scripts.find(s => s.censorRisk < 30) || scripts[0];
        }
        if (type === 'b_movie') {
            return scripts[Math.floor(Math.random() * scripts.length)];
        }
        
        return scripts[0];
    }
    
    function getGenreHeat(genre, year) {
        if (window.TimeSystem) {
            const modifiers = window.TimeSystem.getEraGenreModifiers(year);
            return (modifiers[genre] || 1.0) * 100;
        }
        return 100;
    }
    
    function generateScriptId() {
        return 'script_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }
    
    /**
     * Public API
     */
    return {
        generateInitialScripts,
        generateMonthlyScripts,
        showScriptSelection,
        greenlightScript,
        
        // For external systems
        getScriptDatabase: () => SCRIPT_DATABASE,
        getEraParameters: (year) => getEraParameters(year)
    };
})();