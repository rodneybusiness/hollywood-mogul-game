/**
 * HOLLYWOOD MOGUL - SCANDAL & GOSSIP COLUMN SYSTEM
 * Brings Hollywood drama to life with 40+ unique scandals
 * Features Hedda Hopper/Louella Parsons style gossip columns
 */

window.ScandalSystem = (function() {
    'use strict';

    // ============================================================================
    // SCANDAL DATABASE - 40+ UNIQUE SCANDALS
    // ============================================================================

    const SCANDAL_DATABASE = {
        // ========== ROMANCE SCANDALS ==========
        romance: [
            {
                id: 'secret_affair',
                name: 'Forbidden Romance',
                description: '[STAR] caught in passionate affair with married [CO_STAR]!',
                gossipTease: 'Which blonde bombshell was spotted at a certain actor\'s bungalow at midnight?',
                severity: 'major',
                duration: { min: 8, max: 16 },
                affectedCount: 2,
                requirements: { minStarPower: 60, hasCoStar: true },
                effects: {
                    immediate: {
                        boxOffice: 15, // Scandal sells tickets!
                        reputation: -12,
                        oscarChance: -35,
                        publicInterest: 30
                    },
                    ongoing: {
                        weeklyReputation: -1,
                        castingDifficulty: 15
                    }
                },
                headlines: [
                    '[STAR] AND [CO_STAR] IN SECRET ROMANCE!',
                    'LOVE NEST DISCOVERED IN MALIBU',
                    'HUSBAND FILES FOR DIVORCE - NAMES [STAR]',
                    'PASSIONATE LETTERS REVEALED'
                ],
                gossipItems: [
                    'The chemistry on set wasn\'t just acting, dearies...',
                    'Your faithful correspondent has learned the affair began during reshoots',
                    'A little birdie says they were seen dining at Romanoff\'s',
                    'Sources confirm secret rendezvous at the Garden of Allah'
                ],
                resolutionOptions: [
                    {
                        id: 'suppress_story',
                        text: 'Protect your star - suppress the story',
                        cost: 30000,
                        effects: { scandal_hidden: 0.5, reputation: -8, favor_owed: true },
                        consequences: 'Story might leak anyway. Costs $30,000'
                    },
                    {
                        id: 'distance_studio',
                        text: 'Distance the studio from the scandal',
                        effects: { reputation: 8, talent_loyalty: -25, morale: -20 },
                        consequences: 'Protect reputation but hurt star relationship'
                    },
                    {
                        id: 'exploit_publicity',
                        text: 'Exploit it for publicity',
                        effects: { boxOffice: 30, reputation: -18, oscar_chance: -60 },
                        consequences: 'Major box office boost, Oscar hopes destroyed'
                    },
                    {
                        id: 'damage_control',
                        text: 'Hire crisis PR firm',
                        cost: 15000,
                        effects: { weeklyReputation: 0, oscarChance: -15, boxOffice: 5 },
                        consequences: 'Professional damage control. Costs $15,000'
                    }
                ],
                probability: 0.08
            },
            {
                id: 'divorce_announcement',
                name: 'Divorce Bombshell',
                description: '[STAR]\'s spouse files for divorce, citing cruelty',
                gossipTease: 'Trouble in paradise for one of Hollywood\'s golden couples...',
                severity: 'major',
                duration: { min: 6, max: 12 },
                affectedCount: 1,
                requirements: { minStarPower: 50 },
                effects: {
                    immediate: { boxOffice: 8, reputation: -8, oscarChance: -20 },
                    ongoing: { weeklyReputation: -1 }
                },
                headlines: [
                    '[STAR] MARRIAGE IN RUINS',
                    'DIVORCE PAPERS FILED IN LOS ANGELES',
                    'SPOUSE DEMANDS $100,000 SETTLEMENT'
                ],
                gossipItems: [
                    'The marriage has been on the rocks for months, dear readers',
                    'Friends say [STAR] has been impossible to live with'
                ],
                probability: 0.10
            },
            {
                id: 'shotgun_wedding',
                name: 'Hasty Marriage',
                description: '[STAR] announces sudden marriage - industry buzzes with rumors',
                gossipTease: 'A certain starlet just rushed to the altar. Wonder why?',
                severity: 'minor',
                duration: { min: 4, max: 8 },
                affectedCount: 1,
                requirements: { minStarPower: 40, gender: 'female' },
                effects: {
                    immediate: { boxOffice: 5, reputation: -5, oscarChance: -10 },
                    ongoing: { weeklyReputation: -0.5 }
                },
                headlines: [
                    '[STAR] WEDS IN SECRET CEREMONY',
                    'QUICKIE WEDDING SHOCKS HOLLYWOOD'
                ],
                probability: 0.07
            },
            {
                id: 'love_triangle',
                name: 'Love Triangle Exposed',
                description: '[STAR] caught between two lovers - the scandal sheets are having a field day',
                gossipTease: 'Which heartthrob can\'t decide between his leading ladies?',
                severity: 'major',
                duration: { min: 10, max: 18 },
                affectedCount: 3,
                requirements: { minStarPower: 65 },
                effects: {
                    immediate: { boxOffice: 20, reputation: -15, oscarChance: -40, publicInterest: 40 },
                    ongoing: { weeklyReputation: -2, castingDifficulty: 25 }
                },
                headlines: [
                    'HOLLYWOOD\'S MOST TANGLED LOVE TRIANGLE',
                    'TWO STARS FIGHT OVER [STAR]',
                    'ROMANTIC CHAOS ON SUNSET BOULEVARD'
                ],
                probability: 0.05
            },
            {
                id: 'age_gap_romance',
                name: 'Inappropriate Romance',
                description: '[STAR] dating someone half their age - morality groups outraged',
                gossipTease: 'A May-December romance is raising eyebrows at the Biltmore...',
                severity: 'moderate',
                duration: { min: 6, max: 14 },
                affectedCount: 2,
                requirements: { minStarPower: 55 },
                effects: {
                    immediate: { boxOffice: 10, reputation: -10, oscarChance: -25, censorship_attention: 20 },
                    ongoing: { weeklyReputation: -1 }
                },
                headlines: [
                    'SHOCKING AGE GAP IN [STAR] ROMANCE',
                    'MORALITY GROUPS CONDEMN RELATIONSHIP'
                ],
                probability: 0.06
            },
            {
                id: 'secret_marriage',
                name: 'Hidden Marriage Revealed',
                description: '[STAR]\'s secret marriage discovered - fans feel betrayed',
                gossipTease: 'Guess who\'s been wearing a wedding ring under their gloves?',
                severity: 'moderate',
                duration: { min: 5, max: 10 },
                affectedCount: 1,
                requirements: { minStarPower: 50 },
                effects: {
                    immediate: { boxOffice: -10, reputation: -6, fanLoyalty: -20 },
                    ongoing: { weeklyReputation: -0.5 }
                },
                headlines: [
                    '[STAR] SECRETLY MARRIED FOR MONTHS',
                    'FANS SHOCKED BY REVELATION'
                ],
                probability: 0.08
            }
        ],

        // ========== PERSONAL SCANDALS ==========
        personal: [
            {
                id: 'alcohol_problem',
                name: 'Drinking Problem',
                description: '[STAR] spotted drunk at Ciro\'s - behavior becoming erratic',
                gossipTease: 'Someone\'s been hitting the bottle a bit too hard lately...',
                severity: 'major',
                duration: { min: 8, max: 20 },
                affectedCount: 1,
                requirements: { minStarPower: 45 },
                effects: {
                    immediate: { reputation: -15, oscarChance: -30, reliability: -40 },
                    ongoing: { weeklyReputation: -2, productionDelays: 0.3, quality: -5 }
                },
                headlines: [
                    '[STAR] DRUNK AND DISORDERLY AT NIGHTCLUB',
                    'STAR\'S DRINKING OUT OF CONTROL',
                    'FRIENDS FEAR FOR [STAR]\'S HEALTH'
                ],
                gossipItems: [
                    'The bartender at Musso & Frank has stories to tell...',
                    'Word is [STAR] can\'t remember their lines anymore',
                    'The studio is hiring handlers to keep [STAR] sober'
                ],
                resolutionOptions: [
                    {
                        id: 'sanitarium',
                        text: 'Send to sanitarium for treatment',
                        cost: 20000,
                        effects: { reputation: 5, reliability: 40, weeksLost: 8 },
                        consequences: 'Lose 8 weeks but star returns healthy'
                    },
                    {
                        id: 'cover_up',
                        text: 'Cover it up, keep them working',
                        cost: 5000,
                        effects: { ongoing_risk: 0.8, quality: -10 },
                        consequences: 'Risk of worse scandal, poor performance'
                    },
                    {
                        id: 'public_recovery',
                        text: 'Public announcement and recovery',
                        effects: { reputation: -5, public_sympathy: 30, reliability: 20 },
                        consequences: 'Honest approach gains sympathy'
                    }
                ],
                probability: 0.09
            },
            {
                id: 'drug_scandal',
                name: 'Narcotic Scandal',
                description: '[STAR] linked to illegal narcotics - could face charges',
                gossipTease: 'Which star has been visiting that certain "doctor" on Wilshire?',
                severity: 'career-ending',
                duration: { min: 12, max: 30 },
                affectedCount: 1,
                requirements: { minStarPower: 50, year_min: 1935 },
                effects: {
                    immediate: { reputation: -25, oscarChance: -80, reliability: -60, legal_risk: 80 },
                    ongoing: { weeklyReputation: -3, censorship_attention: 40 }
                },
                headlines: [
                    '[STAR] LINKED TO DRUG RING',
                    'NARCOTICS INVESTIGATION WIDENS',
                    'STUDIO FACES MORALITY CRISIS'
                ],
                probability: 0.03
            },
            {
                id: 'mental_breakdown',
                name: 'Nervous Breakdown',
                description: '[STAR] suffers public breakdown - hospitalized for exhaustion',
                gossipTease: 'A certain star just checked into that discreet facility in Pasadena...',
                severity: 'major',
                duration: { min: 6, max: 16 },
                affectedCount: 1,
                requirements: { minStarPower: 55 },
                effects: {
                    immediate: { reputation: -10, oscarChance: -25, reliability: -50 },
                    ongoing: { weeklyReputation: -1, weeksLost: 6 }
                },
                headlines: [
                    '[STAR] HOSPITALIZED - NERVOUS EXHAUSTION',
                    'BREAKDOWN ON SUNSET BOULEVARD',
                    'FRIENDS RALLY AROUND TROUBLED STAR'
                ],
                gossipItems: [
                    'The pressures of stardom have taken their toll',
                    '[STAR] was found wandering Sunset in their nightclothes',
                    'Doctors say complete rest is essential'
                ],
                probability: 0.06
            },
            {
                id: 'domestic_violence',
                name: 'Domestic Violence Accusations',
                description: 'Police called to [STAR]\'s home - domestic disturbance reported',
                gossipTease: 'Neighbors heard quite a commotion at a certain star\'s mansion...',
                severity: 'career-ending',
                duration: { min: 10, max: 24 },
                affectedCount: 1,
                requirements: { minStarPower: 50 },
                effects: {
                    immediate: { reputation: -30, oscarChance: -90, boxOffice: -20, fanLoyalty: -50 },
                    ongoing: { weeklyReputation: -3, legal_risk: 60 }
                },
                headlines: [
                    '[STAR] ARRESTED IN DOMESTIC DISPUTE',
                    'SPOUSAL ABUSE ALLEGATIONS SURFACE',
                    'HOLLYWOOD SHOCKED BY VIOLENCE CLAIMS'
                ],
                probability: 0.04
            },
            {
                id: 'tax_evasion',
                name: 'Tax Evasion Scandal',
                description: 'IRS investigating [STAR] for tax fraud - owes $50,000',
                gossipTease: 'Uncle Sam is very interested in one star\'s finances...',
                severity: 'major',
                duration: { min: 12, max: 24 },
                affectedCount: 1,
                requirements: { minStarPower: 60, year_min: 1935 },
                effects: {
                    immediate: { reputation: -18, oscarChance: -40, legal_risk: 70 },
                    ongoing: { weeklyReputation: -1.5 }
                },
                headlines: [
                    '[STAR] FACES TAX FRAUD CHARGES',
                    'IRS SEIZES STAR\'S ASSETS',
                    'MILLION-DOLLAR TAX BILL LOOMS'
                ],
                probability: 0.07
            },
            {
                id: 'gambling_debts',
                name: 'Gambling Debts',
                description: '[STAR] owes thousands to mob-connected gambling dens',
                gossipTease: 'Someone\'s luck ran out at the offshore casino...',
                severity: 'major',
                duration: { min: 8, max: 16 },
                affectedCount: 1,
                requirements: { minStarPower: 50 },
                effects: {
                    immediate: { reputation: -12, mob_connection: 30 },
                    ongoing: { weeklyReputation: -1, personal_safety: -20 }
                },
                headlines: [
                    '[STAR] DROWNING IN GAMBLING DEBTS',
                    'MOB ENFORCERS LOOKING FOR STAR',
                    'DESPERATE GAMBLER LOSES FORTUNE'
                ],
                probability: 0.06
            },
            {
                id: 'secret_past',
                name: 'Criminal Past Exposed',
                description: '[STAR]\'s hidden criminal record discovered by press',
                gossipTease: 'Guess who isn\'t who they claimed to be?',
                severity: 'career-ending',
                duration: { min: 15, max: 30 },
                affectedCount: 1,
                requirements: { minStarPower: 55 },
                effects: {
                    immediate: { reputation: -20, oscarChance: -70, fanLoyalty: -40, authenticity: -60 },
                    ongoing: { weeklyReputation: -2 }
                },
                headlines: [
                    '[STAR]\'S SECRET PAST REVEALED',
                    'HOLLYWOOD STAR WAS CONVICTED CRIMINAL',
                    'STUDIO KNEW ABOUT HIDDEN RECORD'
                ],
                probability: 0.04
            }
        ],

        // ========== PROFESSIONAL SCANDALS ==========
        professional: [
            {
                id: 'contract_dispute',
                name: 'Contract War',
                description: '[STAR] sues studio over contract - demands release',
                gossipTease: 'Legal fireworks between a certain star and their studio...',
                severity: 'moderate',
                duration: { min: 8, max: 20 },
                affectedCount: 1,
                requirements: { hasContract: true },
                effects: {
                    immediate: { reputation: -8, talent_loyalty: -30, morale: -15 },
                    ongoing: { weeklyReputation: -0.5, legal_costs: 2000 }
                },
                headlines: [
                    '[STAR] SUES STUDIO FOR RELEASE',
                    'BITTER CONTRACT BATTLE BEGINS',
                    'STAR CLAIMS SLAVE LABOR CONDITIONS'
                ],
                probability: 0.10
            },
            {
                id: 'on_set_behavior',
                name: 'On-Set Tyranny',
                description: '[STAR] terrorizing crew - creating hostile work environment',
                gossipTease: 'The crew on a certain picture is ready to mutiny...',
                severity: 'moderate',
                duration: { min: 4, max: 12 },
                affectedCount: 1,
                requirements: { inProduction: true },
                effects: {
                    immediate: { reputation: -10, morale: -30, quality: -8 },
                    ongoing: { weeklyReputation: -1, productionDelays: 0.2 }
                },
                headlines: [
                    '[STAR] ACCUSED OF ON-SET ABUSE',
                    'CREW COMPLAINS OF IMPOSSIBLE DIVA',
                    'PRODUCTION NIGHTMARE CONTINUES'
                ],
                gossipItems: [
                    'The director is at wit\'s end with [STAR]\'s tantrums',
                    'Three crew members quit last week alone',
                    'Someone threw a chair at the cinematographer'
                ],
                probability: 0.12
            },
            {
                id: 'refusing_roles',
                name: 'Role Refusal Rebellion',
                description: '[STAR] refuses assigned role - holds up production',
                gossipTease: 'A certain star thinks they\'re too good for their latest script...',
                severity: 'moderate',
                duration: { min: 3, max: 8 },
                affectedCount: 1,
                requirements: { hasContract: true, inDevelopment: true },
                effects: {
                    immediate: { reputation: -6, talent_loyalty: -20, productionDelays: 0.4 },
                    ongoing: { legal_costs: 1000 }
                },
                headlines: [
                    '[STAR] REFUSES TO WORK',
                    'STUDIO SUSPENSION THREATENED',
                    'STANDOFF DELAYS MAJOR PRODUCTION'
                ],
                probability: 0.11
            },
            {
                id: 'studio_feud',
                name: 'Public Studio Feud',
                description: '[STAR] publicly attacks studio executives in press',
                gossipTease: 'Someone had choice words about their bosses at the Brown Derby...',
                severity: 'major',
                duration: { min: 6, max: 15 },
                affectedCount: 1,
                requirements: { minStarPower: 60 },
                effects: {
                    immediate: { reputation: -15, talent_loyalty: -40, future_casting: -50 },
                    ongoing: { weeklyReputation: -1.5 }
                },
                headlines: [
                    '[STAR] BLASTS STUDIO IN SHOCKING INTERVIEW',
                    'STAR CALLS EXECS "PHILISTINES"',
                    'BRIDGE-BURNING IN HOLLYWOOD'
                ],
                probability: 0.07
            },
            {
                id: 'impossible_demands',
                name: 'Outrageous Demands',
                description: '[STAR] demands private jet, gold fixtures - budget explodes',
                gossipTease: 'The demands coming from one star\'s dressing room are simply absurd...',
                severity: 'moderate',
                duration: { min: 4, max: 10 },
                affectedCount: 1,
                requirements: { inProduction: true, minStarPower: 70 },
                effects: {
                    immediate: { reputation: -8, budget_overrun: 25000, morale: -20 },
                    ongoing: { weeklyReputation: -1 }
                },
                headlines: [
                    '[STAR]\'S DEMANDS BREAK THE BANK',
                    'DIVA INSISTS ON ABSURD LUXURIES',
                    'PRODUCTION COSTS SPIRAL OUT OF CONTROL'
                ],
                probability: 0.09
            },
            {
                id: 'walking_off_set',
                name: 'Set Walkout',
                description: '[STAR] walks off set mid-production - filming halted',
                gossipTease: 'Production shut down when someone threw a tantrum and left...',
                severity: 'major',
                duration: { min: 2, max: 6 },
                affectedCount: 1,
                requirements: { inProduction: true },
                effects: {
                    immediate: { reputation: -12, productionDelays: 0.6, budget_overrun: 15000, quality: -10 },
                    ongoing: { weeklyReputation: -2 }
                },
                headlines: [
                    '[STAR] WALKS OFF SET IN RAGE',
                    'PRODUCTION SHUT DOWN INDEFINITELY',
                    'CRISIS ON SOUND STAGE 5'
                ],
                probability: 0.06
            }
        ],

        // ========== CRIMINAL SCANDALS ==========
        criminal: [
            {
                id: 'drunk_driving',
                name: 'Drunk Driving Arrest',
                description: '[STAR] arrested for drunk driving on Sunset Boulevard',
                gossipTease: 'Somebody spent last night in the drunk tank...',
                severity: 'major',
                duration: { min: 6, max: 14 },
                affectedCount: 1,
                requirements: { minStarPower: 45 },
                effects: {
                    immediate: { reputation: -15, oscarChance: -35, legal_risk: 40 },
                    ongoing: { weeklyReputation: -1.5 }
                },
                headlines: [
                    '[STAR] ARRESTED FOR DRUNK DRIVING',
                    'STAR FACES JAIL TIME',
                    'HOLLYWOOD SHAKEN BY DUI ARREST'
                ],
                probability: 0.11
            },
            {
                id: 'assault_charges',
                name: 'Assault Charges',
                description: '[STAR] charged with assaulting photographer',
                gossipTease: 'Someone\'s temper got the better of them outside the Mocambo...',
                severity: 'major',
                duration: { min: 8, max: 18 },
                affectedCount: 1,
                requirements: { minStarPower: 50 },
                effects: {
                    immediate: { reputation: -18, oscarChance: -50, legal_risk: 60, fanLoyalty: -25 },
                    ongoing: { weeklyReputation: -2 }
                },
                headlines: [
                    '[STAR] CHARGED WITH ASSAULT',
                    'PHOTOGRAPHER HOSPITALIZED IN ATTACK',
                    'STAR\'S VIOLENT OUTBURST SHOCKS TOWN'
                ],
                probability: 0.07
            },
            {
                id: 'mob_connections',
                name: 'Mob Connections Exposed',
                description: '[STAR] photographed with known mobsters',
                gossipTease: 'Interesting company at that private club in Beverly Hills...',
                severity: 'career-ending',
                duration: { min: 12, max: 30 },
                affectedCount: 1,
                requirements: { minStarPower: 55, year_min: 1935 },
                effects: {
                    immediate: { reputation: -25, oscarChance: -85, legal_risk: 70, fbi_attention: 60 },
                    ongoing: { weeklyReputation: -2.5 }
                },
                headlines: [
                    '[STAR] LINKED TO ORGANIZED CRIME',
                    'FBI INVESTIGATING STAR\'S MOB TIES',
                    'GANGLAND CONNECTIONS REVEALED'
                ],
                probability: 0.04
            },
            {
                id: 'theft_accusations',
                name: 'Theft Scandal',
                description: '[STAR] accused of stealing jewelry from set',
                gossipTease: 'Some very expensive props went missing...',
                severity: 'major',
                duration: { min: 6, max: 14 },
                affectedCount: 1,
                requirements: { inProduction: true },
                effects: {
                    immediate: { reputation: -20, legal_risk: 50, trust: -60 },
                    ongoing: { weeklyReputation: -2 }
                },
                headlines: [
                    '[STAR] ACCUSED OF THEFT',
                    'MISSING JEWELRY TRACED TO STAR',
                    'KLEPTOMANIAC CLAIMS SHOCK HOLLYWOOD'
                ],
                probability: 0.05
            },
            {
                id: 'paternity_suit',
                name: 'Paternity Suit',
                description: 'Woman sues [STAR] claiming he fathered her child',
                gossipTease: 'A certain leading man has a surprise delivery coming...',
                severity: 'major',
                duration: { min: 10, max: 20 },
                affectedCount: 1,
                requirements: { minStarPower: 60, gender: 'male' },
                effects: {
                    immediate: { reputation: -14, oscarChance: -30, boxOffice: -5, fanLoyalty: -30 },
                    ongoing: { weeklyReputation: -1.5, legal_costs: 3000 }
                },
                headlines: [
                    '[STAR] HIT WITH PATERNITY SUIT',
                    'WOMAN CLAIMS STAR FATHERED CHILD',
                    'DNA TESTS DEMANDED IN SCANDAL'
                ],
                probability: 0.08
            },
            {
                id: 'fraud_allegations',
                name: 'Fraud Investigation',
                description: '[STAR] under investigation for investment fraud',
                gossipTease: 'Federal investigators are asking questions about a certain star...',
                severity: 'career-ending',
                duration: { min: 15, max: 30 },
                affectedCount: 1,
                requirements: { minStarPower: 65 },
                effects: {
                    immediate: { reputation: -22, oscarChance: -75, legal_risk: 80 },
                    ongoing: { weeklyReputation: -2, legal_costs: 5000 }
                },
                headlines: [
                    '[STAR] INVESTIGATED FOR FRAUD',
                    'INVESTORS CLAIM MILLIONS LOST',
                    'PONZI SCHEME ALLEGATIONS SURFACE'
                ],
                probability: 0.03
            },
            {
                id: 'morals_charge',
                name: 'Morals Violation',
                description: '[STAR] arrested on morals charge - career in jeopardy',
                gossipTease: 'Vice squad made a very embarrassing arrest last night...',
                severity: 'career-ending',
                duration: { min: 12, max: 36 },
                affectedCount: 1,
                requirements: { minStarPower: 50, year_min: 1933, year_max: 1949 },
                effects: {
                    immediate: { reputation: -30, oscarChance: -95, boxOffice: -30, censorship_attention: 80 },
                    ongoing: { weeklyReputation: -3, blacklist_risk: 60 }
                },
                headlines: [
                    '[STAR] ARRESTED ON MORALS CHARGE',
                    'SCANDAL COULD END CAREER',
                    'STUDIO SEVERS ALL TIES'
                ],
                probability: 0.03
            }
        ],

        // ========== POLITICAL SCANDALS (1947+) ==========
        political: [
            {
                id: 'communist_associations',
                name: 'Red Scare Suspicion',
                description: '[STAR] named in HUAC investigation - Communist ties alleged',
                gossipTease: 'Someone\'s past political activities are catching up with them...',
                severity: 'career-ending',
                duration: { min: 20, max: 48 },
                affectedCount: 1,
                requirements: { minStarPower: 50, year_min: 1947 },
                effects: {
                    immediate: { reputation: -25, oscarChance: -90, blacklist_risk: 80, huac_attention: 90 },
                    ongoing: { weeklyReputation: -3, castingDifficulty: 60 }
                },
                headlines: [
                    '[STAR] NAMED IN COMMUNIST INVESTIGATION',
                    'HUAC SUMMONS HOLLYWOOD STAR',
                    'RED TIES ALLEGED IN SHOCKING TESTIMONY'
                ],
                gossipItems: [
                    'The House Committee wants answers about certain meetings',
                    'Former associates are naming names',
                    'Studio executives are keeping their distance'
                ],
                resolutionOptions: [
                    {
                        id: 'name_names',
                        text: 'Cooperate and name associates',
                        effects: { blacklist_risk: 0, reputation: -20, guilt: 100, friendships_lost: 10 },
                        consequences: 'Clear your name but betray colleagues'
                    },
                    {
                        id: 'take_fifth',
                        text: 'Refuse to testify (Fifth Amendment)',
                        effects: { blacklist_risk: 95, reputation: 10, integrity: 50 },
                        consequences: 'Likely blacklisted but keep your honor'
                    },
                    {
                        id: 'flee_country',
                        text: 'Leave for Europe',
                        effects: { blacklist_risk: 100, exile: true, european_career: 60 },
                        consequences: 'Permanent exile but possible European career'
                    }
                ],
                probability: 0.15,
                eraSpecific: { min: 1947, max: 1954 }
            },
            {
                id: 'huac_testimony',
                name: 'HUAC Testimony Disaster',
                description: '[STAR]\'s testimony before HUAC goes badly - committee hostile',
                gossipTease: 'The hearings in Washington didn\'t go well for a certain star...',
                severity: 'career-ending',
                duration: { min: 24, max: 60 },
                affectedCount: 1,
                requirements: { year_min: 1947, minStarPower: 55 },
                effects: {
                    immediate: { reputation: -20, blacklist_risk: 70, oscarChance: -85 },
                    ongoing: { weeklyReputation: -2.5, castingDifficulty: 70 }
                },
                headlines: [
                    '[STAR] TESTIMONY ANGERS COMMITTEE',
                    'UNCOOPERATIVE WITNESS FACES CONTEMPT',
                    'HOLLYWOOD STAR\'S DEFIANCE BACKFIRES'
                ],
                probability: 0.08,
                eraSpecific: { min: 1947, max: 1954 }
            },
            {
                id: 'antiwar_statement',
                name: 'Anti-War Controversy',
                description: '[STAR] makes anti-war statements - called unpatriotic',
                gossipTease: 'Someone\'s political opinions are making waves...',
                severity: 'major',
                duration: { min: 12, max: 24 },
                affectedCount: 1,
                requirements: { year_min: 1941, year_max: 1945, minStarPower: 60 },
                effects: {
                    immediate: { reputation: -18, patriotism: -60, boxOffice: -15 },
                    ongoing: { weeklyReputation: -2 }
                },
                headlines: [
                    '[STAR] OPPOSES WAR EFFORT',
                    'ACTOR CALLED UNPATRIOTIC',
                    'BOND RALLIES CANCELLED'
                ],
                probability: 0.06,
                eraSpecific: { min: 1941, max: 1945 }
            },
            {
                id: 'social_activism',
                name: 'Controversial Activism',
                description: '[STAR]\'s social activism alienates conservative audiences',
                gossipTease: 'One star\'s politics are a bit too progressive for some...',
                severity: 'moderate',
                duration: { min: 8, max: 16 },
                affectedCount: 1,
                requirements: { minStarPower: 65 },
                effects: {
                    immediate: { reputation: -10, boxOffice: -8, progressive_support: 30, conservative_boycott: 40 },
                    ongoing: { weeklyReputation: -1 }
                },
                headlines: [
                    '[STAR] SPEAKS OUT ON CONTROVERSIAL ISSUE',
                    'SOUTHERN THEATERS THREATEN BOYCOTT',
                    'STAR\'S ACTIVISM DIVIDES AUDIENCES'
                ],
                probability: 0.09
            }
        ],

        // ========== HISTORICAL SCANDAL TYPES ==========
        historical: [
            {
                id: 'arbuckle_tragedy',
                name: 'Party Death Scandal',
                description: 'Death at [STAR]\'s party - manslaughter investigation begins',
                gossipTease: 'A weekend party at a certain star\'s home ended in tragedy...',
                severity: 'career-ending',
                duration: { min: 24, max: 60 },
                affectedCount: 1,
                requirements: { minStarPower: 70, year_min: 1933, year_max: 1938 },
                effects: {
                    immediate: { reputation: -35, oscarChance: -100, legal_risk: 95, career_over: 0.8 },
                    ongoing: { weeklyReputation: -4, blacklist_risk: 90 }
                },
                headlines: [
                    'DEATH AT [STAR]\'S MANSION',
                    'MANSLAUGHTER CHARGES POSSIBLE',
                    'HOLLYWOOD\'S DARKEST SCANDAL',
                    'CAREER LIKELY OVER FOR DISGRACED STAR'
                ],
                probability: 0.01,
                eraSpecific: { min: 1933, max: 1938 }
            },
            {
                id: 'flynn_trial',
                name: 'Statutory Charges',
                description: '[STAR] on trial for statutory rape - tabloids feast',
                gossipTease: 'A certain swashbuckler is in very hot water...',
                severity: 'career-ending',
                duration: { min: 18, max: 36 },
                affectedCount: 1,
                requirements: { minStarPower: 75, gender: 'male', year_min: 1940 },
                effects: {
                    immediate: { reputation: -28, oscarChance: -95, legal_risk: 85, fanLoyalty: -50 },
                    ongoing: { weeklyReputation: -3, trial_ongoing: true }
                },
                headlines: [
                    '[STAR] ON TRIAL FOR STATUTORY RAPE',
                    'SHOCKING TESTIMONY IN STAR TRIAL',
                    'JURY DELIBERATES STAR\'S FATE'
                ],
                probability: 0.02,
                eraSpecific: { min: 1940, max: 1946 }
            },
            {
                id: 'bergman_scandal',
                name: 'International Affair Scandal',
                description: '[STAR] pregnant by Italian director while married - America outraged',
                gossipTease: 'A certain actress won\'t be returning from Rome anytime soon...',
                severity: 'career-ending',
                duration: { min: 30, max: 60 },
                affectedCount: 1,
                requirements: { minStarPower: 80, gender: 'female', year_min: 1949 },
                effects: {
                    immediate: { reputation: -30, oscarChance: -100, boxOffice: -40, american_exile: true },
                    ongoing: { weeklyReputation: -3, congressional_denunciation: true }
                },
                headlines: [
                    '[STAR] PREGNANT OUT OF WEDLOCK',
                    'SENATOR DENOUNCES ACTRESS ON FLOOR',
                    'HOLLYWOOD\'S GREATEST SAINT NOW PARIAH'
                ],
                probability: 0.01,
                eraSpecific: { min: 1949, max: 1949 }
            },
            {
                id: 'farmer_breakdown',
                name: 'Institutionalization Scandal',
                description: '[STAR] forcibly committed to asylum - studio involvement alleged',
                gossipTease: 'Someone was taken away in the night...',
                severity: 'career-ending',
                duration: { min: 20, max: 100 },
                affectedCount: 1,
                requirements: { minStarPower: 60, gender: 'female' },
                effects: {
                    immediate: { reputation: -15, career_over: 0.9, public_sympathy: 20 },
                    ongoing: { institutionalized: true }
                },
                headlines: [
                    '[STAR] COMMITTED TO ASYLUM',
                    'STUDIO DENIES INVOLVEMENT',
                    'DARK SIDE OF HOLLYWOOD EXPOSED'
                ],
                probability: 0.02
            }
        ]
    };

    // ============================================================================
    // GOSSIP COLUMN GENERATORS
    // ============================================================================

    const GOSSIP_COLUMNISTS = {
        hedda: {
            name: 'Hedda Hopper',
            style: 'catty',
            intros: [
                'Your faithful correspondent has learned...',
                'A little birdie tells me that...',
                'Word around the Brown Derby is...',
                'The latest from the Sunset Strip...',
                'Guess what I heard at Romanoff\'s last night...',
                'One simply must share this delicious morsel...'
            ],
            signoffs: [
                'You heard it here first, dearies.',
                'As always, yours in the know.',
                'Remember where you read it!',
                'That\'s all for now, darlings.',
                'Your Hedda knows all.'
            ]
        },
        louella: {
            name: 'Louella Parsons',
            style: 'breathless',
            intros: [
                'Can you believe it?',
                'Hold onto your hats, readers...',
                'The most sensational news just reached me...',
                'You won\'t believe what I discovered...',
                'This is simply too good to keep quiet...',
                'Breaking news from your Louella...'
            ],
            signoffs: [
                'More tomorrow, I promise!',
                'Stay tuned for developments...',
                'Your Louella has the scoop.',
                'Remember, you saw it in my column first!',
                'That\'s the news for now!'
            ]
        }
    };

    const GOSSIP_TEMPLATES = {
        blind_items: [
            'Which {STAR_TYPE} was spotted leaving {LOCATION} at 3 AM?',
            'A certain {STAR_TYPE} better watch their behavior at {LOCATION}...',
            'What {STAR_TYPE} has been making late-night phone calls to {PERSON}?',
            'Someone at {STUDIO} is about to have a very bad week...',
            'Which married {STAR_TYPE} was seen without their ring at {LOCATION}?',
            'A little bird says {STAR_TYPE} and {STAR_TYPE} can\'t stand each other...',
            'What {STAR_TYPE} is drinking too much at {LOCATION}?',
            'Whose marriage is on the rocks? Hint: They starred in {GENRE} pictures...',
            'Which director has been impossible to work with lately?',
            'What {STAR_TYPE} is about to get a very unwelcome visit from Uncle Sam?'
        ],
        locations: [
            'the Cocoanut Grove',
            'Ciro\'s',
            'Romanoff\'s',
            'the Brown Derby',
            'Musso & Frank',
            'the Mocambo',
            'the Garden of Allah',
            'the Chateau Marmont',
            'the Polo Lounge',
            'the Trocadero'
        ],
        star_types: [
            'leading man',
            'leading lady',
            'contract player',
            'blonde bombshell',
            'matinee idol',
            'character actor',
            'ingenue',
            'he-man star',
            'glamour queen'
        ]
    };

    // ============================================================================
    // CORE SCANDAL MANAGEMENT
    // ============================================================================

    let activeScandals = [];
    let scandalHistory = [];
    let weeklyGossipColumn = [];

    /**
     * Initialize scandal system
     */
    function initialize(gameState) {
        if (!gameState.scandals) {
            gameState.scandals = {
                active: [],
                history: [],
                reputation_impacts: {},
                blacklisted_talent: []
            };
        }

        activeScandals = gameState.scandals.active || [];
        scandalHistory = gameState.scandals.history || [];

        console.log('Scandal System initialized');
    }

    /**
     * Process weekly scandal checks
     */
    function processWeeklyUpdate(gameState) {
        // Update existing scandals
        updateActiveScandals(gameState);

        // Check for new scandals
        checkForNewScandal(gameState);

        // Generate weekly gossip column
        generateWeeklyGossip(gameState);

        // Save state
        gameState.scandals.active = activeScandals;
        gameState.scandals.history = scandalHistory;
    }

    /**
     * Update all active scandals
     */
    function updateActiveScandals(gameState) {
        activeScandals.forEach(scandal => {
            scandal.weeksRemaining--;

            // Apply ongoing effects
            if (scandal.effects.ongoing) {
                applyOngoingEffects(scandal, gameState);
            }

            // Check for resolution
            if (scandal.weeksRemaining <= 0) {
                resolveScandal(scandal, gameState);
            }

            // Generate occasional follow-up headlines
            if (Math.random() < 0.15 && scandal.headlines.length > 0) {
                const headline = scandal.headlines[Math.floor(Math.random() * scandal.headlines.length)];
                addNewspaperHeadline(headline, gameState);
            }
        });

        // Remove resolved scandals
        activeScandals = activeScandals.filter(s => s.weeksRemaining > 0);
    }

    /**
     * Check if new scandal should occur
     */
    function checkForNewScandal(gameState) {
        // Base 12% chance per week
        const baseChance = 0.12;

        // Modify based on number of contract players
        const talentCount = (gameState.contractPlayers || []).length;
        const talentModifier = talentCount * 0.02;

        // Modify based on number of active films
        const filmCount = (gameState.activeFilms || []).length;
        const filmModifier = filmCount * 0.01;

        const totalChance = Math.min(baseChance + talentModifier + filmModifier, 0.35);

        if (Math.random() < totalChance) {
            generateScandal(gameState);
        }
    }

    /**
     * Generate a new scandal
     */
    function generateScandal(gameState) {
        // Collect all possible scandals
        const allScandals = [
            ...SCANDAL_DATABASE.romance,
            ...SCANDAL_DATABASE.personal,
            ...SCANDAL_DATABASE.professional,
            ...SCANDAL_DATABASE.criminal,
            ...SCANDAL_DATABASE.political,
            ...SCANDAL_DATABASE.historical
        ];

        // Filter by era
        const currentYear = gameState.gameYear || 1933;
        const eraFiltered = allScandals.filter(scandal => {
            if (scandal.eraSpecific) {
                return currentYear >= scandal.eraSpecific.min && currentYear <= scandal.eraSpecific.max;
            }
            if (scandal.requirements?.year_min && currentYear < scandal.requirements.year_min) return false;
            if (scandal.requirements?.year_max && currentYear > scandal.requirements.year_max) return false;
            return true;
        });

        // Filter by requirements
        const eligible = eraFiltered.filter(scandal => {
            return checkScandalRequirements(scandal, gameState);
        });

        if (eligible.length === 0) return null;

        // Weighted random selection
        const selectedScandal = weightedRandomSelect(eligible);
        if (!selectedScandal) return null;

        // Create scandal instance
        const scandalInstance = createScandalInstance(selectedScandal, gameState);
        if (!scandalInstance) return null;

        // Add to active scandals
        activeScandals.push(scandalInstance);

        // Apply immediate effects
        applyImmediateEffects(scandalInstance, gameState);

        // Show player notification
        showScandalNotification(scandalInstance, gameState);

        // Add to history
        scandalHistory.push({
            id: scandalInstance.id,
            name: scandalInstance.name,
            year: currentYear,
            severity: scandalInstance.severity,
            affectedTalent: scandalInstance.affectedTalent
        });

        console.log(`Scandal generated: ${scandalInstance.name}`, scandalInstance);

        return scandalInstance;
    }

    /**
     * Check if scandal requirements are met
     */
    function checkScandalRequirements(scandal, gameState) {
        const req = scandal.requirements || {};

        // Check contract players
        if (req.hasContract && (!gameState.contractPlayers || gameState.contractPlayers.length === 0)) {
            return false;
        }

        // Check active production
        if (req.inProduction && (!gameState.activeFilms || gameState.activeFilms.length === 0)) {
            return false;
        }

        // Check available talent with requirements
        const availableTalent = getEligibleTalent(gameState, req);
        if (availableTalent.length === 0) return false;

        return true;
    }

    /**
     * Get eligible talent for scandal
     */
    function getEligibleTalent(gameState, requirements) {
        const eligible = [];

        // Check contract players first (more likely to generate scandals)
        if (gameState.contractPlayers) {
            gameState.contractPlayers.forEach(contract => {
                const talent = getTalentById(contract.talentId);
                if (talent && meetsTalentRequirements(talent, requirements)) {
                    eligible.push({ talent, contract, isContract: true });
                }
            });
        }

        // Also check talent in active productions
        if (gameState.activeFilms) {
            gameState.activeFilms.forEach(film => {
                if (film.leadActors) {
                    film.leadActors.forEach(actor => {
                        const talent = getTalentById(actor.talentId);
                        if (talent && meetsTalentRequirements(talent, requirements)) {
                            eligible.push({ talent, film, isContract: false });
                        }
                    });
                }
            });
        }

        return eligible;
    }

    /**
     * Check if talent meets scandal requirements
     */
    function meetsTalentRequirements(talent, requirements) {
        if (requirements.minStarPower && talent.starPower < requirements.minStarPower) {
            return false;
        }

        if (requirements.gender && talent.gender !== requirements.gender) {
            return false;
        }

        return true;
    }

    /**
     * Get talent by ID
     */
    function getTalentById(talentId) {
        if (window.TalentRoster) {
            return window.TalentRoster.getActorById(talentId) ||
                   window.TalentRoster.getDirectorById(talentId);
        }
        return null;
    }

    /**
     * Weighted random selection
     */
    function weightedRandomSelect(scandals) {
        const totalWeight = scandals.reduce((sum, s) => sum + (s.probability || 0.05), 0);
        let random = Math.random() * totalWeight;

        for (const scandal of scandals) {
            random -= (scandal.probability || 0.05);
            if (random <= 0) {
                return scandal;
            }
        }

        return scandals[0];
    }

    /**
     * Create scandal instance
     */
    function createScandalInstance(scandalTemplate, gameState) {
        const eligible = getEligibleTalent(gameState, scandalTemplate.requirements || {});
        if (eligible.length === 0) return null;

        // Select affected talent
        const affectedTalent = [];
        const numAffected = scandalTemplate.affectedCount || 1;

        for (let i = 0; i < Math.min(numAffected, eligible.length); i++) {
            const selected = eligible[Math.floor(Math.random() * eligible.length)];
            affectedTalent.push(selected);
            // Remove to avoid duplicates
            eligible.splice(eligible.indexOf(selected), 1);
        }

        // Calculate duration
        const duration = scandalTemplate.duration ?
            scandalTemplate.duration.min + Math.floor(Math.random() * (scandalTemplate.duration.max - scandalTemplate.duration.min)) :
            8;

        // Personalize scandal description
        const description = personalizeScandalText(scandalTemplate.description, affectedTalent);
        const headlines = scandalTemplate.headlines.map(h => personalizeScandalText(h, affectedTalent));
        const gossipItems = scandalTemplate.gossipItems?.map(g => personalizeScandalText(g, affectedTalent)) || [];

        return {
            ...scandalTemplate,
            instanceId: generateScandalId(),
            description: description,
            headlines: headlines,
            gossipItems: gossipItems,
            affectedTalent: affectedTalent,
            weeksRemaining: duration,
            totalDuration: duration,
            startWeek: gameState.weekNumber || 0,
            playerChoiceMade: false
        };
    }

    /**
     * Personalize scandal text with actual names
     */
    function personalizeScandalText(text, affectedTalent) {
        let personalized = text;

        if (affectedTalent.length > 0) {
            personalized = personalized.replace(/\[STAR\]/g, affectedTalent[0].talent.name);
        }

        if (affectedTalent.length > 1) {
            personalized = personalized.replace(/\[CO_STAR\]/g, affectedTalent[1].talent.name);
        }

        return personalized;
    }

    /**
     * Generate unique scandal ID
     */
    function generateScandalId() {
        return `scandal_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    }

    /**
     * Apply immediate scandal effects
     */
    function applyImmediateEffects(scandal, gameState) {
        const effects = scandal.effects.immediate;
        if (!effects) return;

        // Reputation
        if (effects.reputation) {
            gameState.reputation = Math.max(0, Math.min(100, gameState.reputation + effects.reputation));
        }

        // Apply effects to affected talent
        scandal.affectedTalent.forEach(({ talent, contract, film }) => {
            if (contract) {
                // Modify contract player stats
                if (effects.reliability) {
                    contract.reliability = Math.max(0, (contract.reliability || 100) + effects.reliability);
                }
                if (effects.talent_loyalty) {
                    contract.loyalty = Math.max(0, Math.min(100, contract.loyalty + effects.talent_loyalty));
                }
            }

            if (film) {
                // Modify film stats
                if (effects.boxOffice) {
                    film.scandalBoxOfficeModifier = (film.scandalBoxOfficeModifier || 0) + effects.boxOffice;
                }
                if (effects.oscarChance) {
                    film.oscarPotential = Math.max(0, (film.oscarPotential || 50) + effects.oscarChance);
                }
                if (effects.quality) {
                    film.quality = Math.max(0, Math.min(100, (film.quality || 50) + effects.quality));
                }
            }
        });

        console.log('Immediate scandal effects applied', effects);
    }

    /**
     * Apply ongoing scandal effects
     */
    function applyOngoingEffects(scandal, gameState) {
        const effects = scandal.effects.ongoing;
        if (!effects) return;

        // Weekly reputation drain
        if (effects.weeklyReputation) {
            gameState.reputation = Math.max(0, gameState.reputation + effects.weeklyReputation);
        }

        // Weekly legal costs
        if (effects.legal_costs) {
            gameState.cash -= effects.legal_costs;
        }
    }

    /**
     * Resolve scandal (when duration expires)
     */
    function resolveScandal(scandal, gameState) {
        console.log(`Scandal resolved: ${scandal.name}`);

        // Some scandals have lasting effects
        if (scandal.effects.resolution) {
            // Apply based on what happened during scandal
            // This is simplified - could be expanded with player choices
        }

        // Career-ending scandals
        if (scandal.severity === 'career-ending' && !scandal.playerChoiceMade) {
            scandal.affectedTalent.forEach(({ talent, contract }) => {
                if (contract) {
                    // Remove from contract
                    const index = gameState.contractPlayers.findIndex(c => c.talentId === talent.id);
                    if (index !== -1) {
                        gameState.contractPlayers.splice(index, 1);
                        addAlert(gameState, {
                            type: 'scandal',
                            icon: '⚠️',
                            message: `${talent.name} released from contract due to scandal`,
                            priority: 'high'
                        });
                    }
                }

                // Add to blacklist if applicable
                if (scandal.effects.immediate.blacklist_risk > 70) {
                    if (!gameState.scandals.blacklisted_talent) {
                        gameState.scandals.blacklisted_talent = [];
                    }
                    gameState.scandals.blacklisted_talent.push(talent.id);
                }
            });
        }

        // Show resolution message
        addAlert(gameState, {
            type: 'info',
            icon: '📰',
            message: `Scandal fading: "${scandal.name}" no longer front-page news`,
            priority: 'low'
        });
    }

    /**
     * Show scandal notification with player choices
     */
    function showScandalNotification(scandal, gameState) {
        // Add newspaper headline
        if (scandal.headlines && scandal.headlines.length > 0) {
            const headline = scandal.headlines[0];
            addNewspaperHeadline(headline, gameState);
        }

        // Alert player
        addAlert(gameState, {
            type: 'scandal',
            icon: '💥',
            message: `SCANDAL: ${scandal.description}`,
            priority: 'high'
        });

        // If scandal has player choices, show modal
        if (scandal.resolutionOptions && scandal.resolutionOptions.length > 0) {
            showScandalChoiceModal(scandal, gameState);
        }
    }

    /**
     * Show scandal choice modal
     */
    function showScandalChoiceModal(scandal, gameState) {
        if (!window.HollywoodMogul || !window.HollywoodMogul.showModal) {
            return;
        }

        const choicesHTML = scandal.resolutionOptions.map((choice, index) => {
            const costText = choice.cost ? `<span class="choice-cost">Cost: $${choice.cost.toLocaleString()}</span>` : '';
            return `
                <div class="scandal-choice-option">
                    <button
                        onclick="ScandalSystem.handleScandalChoice('${scandal.instanceId}', ${index})"
                        class="scandal-choice-btn"
                    >
                        ${choice.text}
                    </button>
                    <p class="choice-consequences">${choice.consequences}</p>
                    ${costText}
                </div>
            `;
        }).join('');

        const modalContent = `
            <div class="scandal-modal">
                <div class="scandal-header">
                    <span class="scandal-icon">💥</span>
                    <h2>SCANDAL BREAKS!</h2>
                </div>
                <div class="scandal-content">
                    <h3>${scandal.name}</h3>
                    <p class="scandal-description">${scandal.description}</p>
                    <div class="scandal-severity ${scandal.severity}">
                        Severity: <strong>${scandal.severity.toUpperCase()}</strong>
                    </div>
                    <div class="scandal-details">
                        <p>This scandal will dominate headlines for <strong>${scandal.weeksRemaining} weeks</strong>.</p>
                    </div>
                    <div class="scandal-choices">
                        <h4>How do you respond?</h4>
                        ${choicesHTML}
                    </div>
                    ${scandal.gossipItems && scandal.gossipItems.length > 0 ? `
                        <div class="gossip-preview">
                            <h4>What They're Saying:</h4>
                            <p class="gossip-item">"${scandal.gossipItems[0]}"</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        window.HollywoodMogul.showModal(modalContent);
    }

    /**
     * Handle player's scandal choice
     */
    function handleScandalChoice(scandalId, choiceIndex) {
        const gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        if (!gameState) return;

        const scandal = activeScandals.find(s => s.instanceId === scandalId);
        if (!scandal || !scandal.resolutionOptions) return;

        const choice = scandal.resolutionOptions[choiceIndex];
        if (!choice) return;

        // Check if can afford
        if (choice.cost && gameState.cash < choice.cost) {
            addAlert(gameState, {
                type: 'error',
                icon: '❌',
                message: `Cannot afford this option ($${choice.cost.toLocaleString()})`,
                priority: 'high'
            });
            return;
        }

        // Apply choice effects
        if (choice.cost) {
            gameState.cash -= choice.cost;
        }

        if (choice.effects) {
            applyChoiceEffects(choice.effects, scandal, gameState);
        }

        scandal.playerChoiceMade = true;
        scandal.choiceSelected = choice.id;

        // Modify scandal based on choice
        if (choice.effects.scandal_hidden && Math.random() < choice.effects.scandal_hidden) {
            // Scandal suppressed successfully
            scandal.weeksRemaining = Math.floor(scandal.weeksRemaining * 0.3);
            addAlert(gameState, {
                type: 'success',
                icon: '✓',
                message: `Scandal successfully suppressed`,
                priority: 'high'
            });
        }

        addAlert(gameState, {
            type: 'info',
            icon: '📋',
            message: `Decision made: ${choice.text}`,
            priority: 'medium'
        });

        // Close modal
        if (window.HollywoodMogul && window.HollywoodMogul.closeModal) {
            window.HollywoodMogul.closeModal();
        }
    }

    /**
     * Apply effects from player choice
     */
    function applyChoiceEffects(effects, scandal, gameState) {
        Object.keys(effects).forEach(effectKey => {
            const value = effects[effectKey];

            switch (effectKey) {
                case 'reputation':
                    gameState.reputation = Math.max(0, Math.min(100, gameState.reputation + value));
                    break;
                case 'boxOffice':
                    scandal.affectedTalent.forEach(({ film }) => {
                        if (film) {
                            film.scandalBoxOfficeModifier = (film.scandalBoxOfficeModifier || 0) + value;
                        }
                    });
                    break;
                case 'oscarChance':
                case 'oscar_chance':
                    scandal.affectedTalent.forEach(({ film }) => {
                        if (film) {
                            film.oscarPotential = Math.max(0, (film.oscarPotential || 50) + value);
                        }
                    });
                    break;
                case 'talent_loyalty':
                    scandal.affectedTalent.forEach(({ contract }) => {
                        if (contract) {
                            contract.loyalty = Math.max(0, Math.min(100, contract.loyalty + value));
                        }
                    });
                    break;
                case 'morale':
                    gameState.morale = Math.max(0, Math.min(100, (gameState.morale || 75) + value));
                    break;
                case 'weeklyReputation':
                    // Modify ongoing effects
                    scandal.effects.ongoing = scandal.effects.ongoing || {};
                    scandal.effects.ongoing.weeklyReputation = value;
                    break;
                case 'weeksLost':
                    scandal.affectedTalent.forEach(({ contract }) => {
                        if (contract) {
                            contract.unavailableWeeks = value;
                        }
                    });
                    break;
                case 'blacklist_risk':
                    scandal.effects.immediate.blacklist_risk = value;
                    break;
            }
        });
    }

    // ============================================================================
    // GOSSIP COLUMN SYSTEM
    // ============================================================================

    /**
     * Generate weekly gossip column
     */
    function generateWeeklyGossip(gameState) {
        weeklyGossipColumn = [];

        // Add scandal gossip
        activeScandals.forEach(scandal => {
            if (scandal.gossipItems && scandal.gossipItems.length > 0 && Math.random() < 0.4) {
                const item = scandal.gossipItems[Math.floor(Math.random() * scandal.gossipItems.length)];
                weeklyGossipColumn.push({
                    type: 'scandal',
                    text: item,
                    severity: scandal.severity
                });
            }
        });

        // Add blind items
        if (Math.random() < 0.3) {
            const blindItem = generateBlindItem(gameState);
            if (blindItem) {
                weeklyGossipColumn.push({
                    type: 'blind_item',
                    text: blindItem
                });
            }
        }

        // Add general industry gossip
        if (Math.random() < 0.5) {
            const industryGossip = generateIndustryGossip(gameState);
            if (industryGossip) {
                weeklyGossipColumn.push({
                    type: 'industry',
                    text: industryGossip
                });
            }
        }

        // Save to game state
        if (!gameState.gossipColumns) {
            gameState.gossipColumns = [];
        }

        if (weeklyGossipColumn.length > 0) {
            gameState.gossipColumns.push({
                week: gameState.weekNumber || 0,
                items: [...weeklyGossipColumn]
            });

            // Keep only last 20 weeks
            if (gameState.gossipColumns.length > 20) {
                gameState.gossipColumns = gameState.gossipColumns.slice(-20);
            }
        }
    }

    /**
     * Generate blind item gossip
     */
    function generateBlindItem(gameState) {
        const template = GOSSIP_TEMPLATES.blind_items[Math.floor(Math.random() * GOSSIP_TEMPLATES.blind_items.length)];

        let item = template;
        item = item.replace(/{STAR_TYPE}/g, () => {
            return GOSSIP_TEMPLATES.star_types[Math.floor(Math.random() * GOSSIP_TEMPLATES.star_types.length)];
        });
        item = item.replace(/{LOCATION}/g, () => {
            return GOSSIP_TEMPLATES.locations[Math.floor(Math.random() * GOSSIP_TEMPLATES.locations.length)];
        });
        item = item.replace(/{GENRE}/g, () => {
            const genres = ['romantic', 'western', 'crime', 'musical', 'drama'];
            return genres[Math.floor(Math.random() * genres.length)];
        });
        item = item.replace(/{STUDIO}/g, () => {
            const studios = ['MGM', 'Warner', 'Paramount', 'Fox', 'RKO'];
            return studios[Math.floor(Math.random() * studios.length)];
        });

        return item;
    }

    /**
     * Generate general industry gossip
     */
    function generateIndustryGossip(gameState) {
        const gossipItems = [
            'The word at the Polo Lounge is that someone\'s about to sign the biggest contract in town...',
            'A certain studio is shopping for a new leading lady. Wonder who it could be?',
            'Romance is blooming on Stage 7, or so I\'m told...',
            'The latest picture screening at the studio had executives scratching their heads...',
            'Someone better watch their behavior at the next Academy luncheon...',
            'A little bird tells me a major announcement is coming this week...',
            'The gossip at Schwab\'s is simply delicious this week, dearies...',
            'Your correspondent heard quite the commotion coming from a certain producer\'s office...',
            'Mark my words, there\'s going to be big news from the front office soon...',
            'The industry is buzzing about next month\'s releases...'
        ];

        return gossipItems[Math.floor(Math.random() * gossipItems.length)];
    }

    /**
     * Get formatted gossip column for display
     */
    function getWeeklyGossipColumn(columnist = 'hedda') {
        const columnistData = GOSSIP_COLUMNISTS[columnist];
        if (!columnistData || weeklyGossipColumn.length === 0) {
            return null;
        }

        const intro = columnistData.intros[Math.floor(Math.random() * columnistData.intros.length)];
        const signoff = columnistData.signoffs[Math.floor(Math.random() * columnistData.signoffs.length)];

        const items = weeklyGossipColumn.map(item => item.text);

        return {
            columnist: columnistData.name,
            intro: intro,
            items: items,
            signoff: signoff
        };
    }

    // ============================================================================
    // INTEGRATION HELPERS
    // ============================================================================

    /**
     * Add newspaper headline
     */
    function addNewspaperHeadline(headline, gameState) {
        if (window.NewsSystem && window.NewsSystem.addHeadline) {
            window.NewsSystem.addHeadline(headline, 'scandal');
        }
    }

    /**
     * Add alert to game
     */
    function addAlert(gameState, alert) {
        if (window.HollywoodMogul && window.HollywoodMogul.addAlert) {
            window.HollywoodMogul.addAlert(alert);
        }
    }

    /**
     * Get active scandals affecting a specific talent
     */
    function getActiveScandalsByTalent(talentId) {
        return activeScandals.filter(scandal => {
            return scandal.affectedTalent.some(({ talent }) => talent.id === talentId);
        });
    }

    /**
     * Get active scandals affecting a specific film
     */
    function getActiveScandalsByFilm(filmId) {
        return activeScandals.filter(scandal => {
            return scandal.affectedTalent.some(({ film }) => film && film.id === filmId);
        });
    }

    /**
     * Calculate scandal impact on box office
     */
    function calculateBoxOfficeImpact(film) {
        const scandals = getActiveScandalsByFilm(film.id);
        let totalImpact = 0;

        scandals.forEach(scandal => {
            if (scandal.effects.immediate.boxOffice) {
                totalImpact += scandal.effects.immediate.boxOffice;
            }
        });

        return totalImpact;
    }

    /**
     * Calculate scandal impact on Oscar chances
     */
    function calculateOscarImpact(film) {
        const scandals = getActiveScandalsByFilm(film.id);
        let totalImpact = 0;

        scandals.forEach(scandal => {
            if (scandal.effects.immediate.oscarChance) {
                totalImpact += scandal.effects.immediate.oscarChance;
            }
        });

        return totalImpact;
    }

    /**
     * Check if talent is blacklisted
     */
    function isTalentBlacklisted(talentId, gameState) {
        return gameState.scandals?.blacklisted_talent?.includes(talentId) || false;
    }

    /**
     * Get scandal statistics
     */
    function getScandalStats(gameState) {
        return {
            active: activeScandals.length,
            total_history: scandalHistory.length,
            career_ending: scandalHistory.filter(s => s.severity === 'career-ending').length,
            major: scandalHistory.filter(s => s.severity === 'major').length,
            blacklisted_talent: gameState.scandals?.blacklisted_talent?.length || 0
        };
    }

    // ============================================================================
    // PUBLIC API
    // ============================================================================

    return {
        initialize,
        processWeeklyUpdate,
        generateScandal,
        handleScandalChoice,
        getWeeklyGossipColumn,
        getActiveScandalsByTalent,
        getActiveScandalsByFilm,
        calculateBoxOfficeImpact,
        calculateOscarImpact,
        isTalentBlacklisted,
        getScandalStats,
        getActiveScandals: () => activeScandals,
        getScandalHistory: () => scandalHistory
    };
})();
