/**
 * HOLLYWOOD MOGUL - PRODUCTION CRISIS EVENTS SYSTEM
 * 50+ dramatic production events with meaningful player choices
 * Each crisis creates memorable moments and forces difficult decisions
 */

window.EventSystem = (function() {
    'use strict';

    // ========================================================================
    // COMPREHENSIVE EVENT DATABASE WITH BRANCHING CHOICES
    // ========================================================================

    const EVENT_DATABASE = {

        // ====================================================================
        // CAST PROBLEMS (12 events)
        // ====================================================================
        cast_problems: [
            {
                id: 'star_demands_rewrite',
                name: 'Star Demands Script Changes',
                description: 'Your lead actor storms into your office demanding the ending be rewritten. "My character wouldn\'t do this! I want script approval or I walk."',
                phase: ['PRODUCTION', 'PRE_PRODUCTION'],
                probability: 0.08,
                conditions: { minBudget: 50000 },
                choices: [
                    {
                        text: 'Give them script approval - keep the peace',
                        cost: 0,
                        effects: {
                            quality: -8,
                            weeks: 2,
                            morale: 10,
                            starPower: 5
                        },
                        outcome: 'The star is happy, but the script suffers from their meddling.'
                    },
                    {
                        text: 'Refuse and threaten breach of contract',
                        cost: 0,
                        effects: {
                            morale: -20,
                            reputation: -5,
                            quality: 10,
                            feudChance: 0.4
                        },
                        outcome: 'You maintain artistic control, but tension fills the set.'
                    },
                    {
                        text: 'Compromise - rewrite one scene only',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            weeks: 1,
                            quality: -3,
                            morale: 5
                        },
                        outcome: 'A diplomatic solution. The star gets their moment.'
                    },
                    {
                        text: 'Replace them immediately',
                        cost: 35000,
                        effects: {
                            budget: -35000,
                            weeks: 4,
                            quality: -15,
                            reputation: -10,
                            scandal: 30
                        },
                        outcome: 'A costly power move. Hollywood is watching.'
                    }
                ]
            },

            {
                id: 'star_scandal_arrest',
                name: 'Lead Actor Arrested',
                description: 'SCANDAL! Your star was arrested last night for a bar fight. Photos are all over the morning papers. The press is outside the studio gates.',
                phase: ['PRODUCTION', 'POST_PRODUCTION', 'RELEASE'],
                probability: 0.06,
                choices: [
                    {
                        text: 'Pay bail and hire the best lawyer in town',
                        cost: 20000,
                        effects: {
                            budget: -20000,
                            reputation: -8,
                            scandal: 20,
                            weeks: 1
                        },
                        outcome: 'The charges are reduced. The scandal slowly fades.'
                    },
                    {
                        text: 'Issue statement condemning their behavior',
                        cost: 0,
                        effects: {
                            reputation: 5,
                            morale: -25,
                            starPower: -15,
                            boxOfficeBoost: 0.85
                        },
                        outcome: 'You protect the studio\'s reputation at the star\'s expense.'
                    },
                    {
                        text: 'Spin it as publicity - "bad boy" image',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            hype: 25,
                            scandal: 40,
                            oscarChance: -0.3,
                            boxOfficeBoost: 1.2
                        },
                        outcome: 'The picture becomes notorious. Audiences are curious.'
                    },
                    {
                        text: 'Reshoot all their scenes with replacement',
                        cost: 60000,
                        effects: {
                            budget: -60000,
                            weeks: 8,
                            quality: -20,
                            reputation: 10
                        },
                        outcome: 'A drastic decision. The industry respects your principles.'
                    }
                ]
            },

            {
                id: 'actor_injured_stunt',
                name: 'Star Injured During Stunt',
                description: 'A stunt went wrong. Your lead actor was rushed to the hospital with a broken leg. Production has halted. The insurance company is investigating.',
                phase: ['PRODUCTION'],
                probability: 0.05,
                conditions: { hasActionScenes: true },
                choices: [
                    {
                        text: 'Wait for them to recover (6-8 weeks)',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            weeks: 7,
                            morale: -10,
                            loyalty: 15
                        },
                        outcome: 'The crew respects your loyalty. Time crawls by.'
                    },
                    {
                        text: 'Use a body double and camera tricks',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            weeks: 2,
                            quality: -12,
                            morale: -5
                        },
                        outcome: 'You finish on time, but some scenes lack authenticity.'
                    },
                    {
                        text: 'Rewrite remaining scenes to minimize action',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            weeks: 3,
                            quality: -8,
                            genreShift: true
                        },
                        outcome: 'The picture becomes more dramatic, less action-packed.'
                    },
                    {
                        text: 'Recast and reshoot everything',
                        cost: 50000,
                        effects: {
                            budget: -50000,
                            weeks: 10,
                            quality: -15,
                            scandal: 25
                        },
                        outcome: 'Starting fresh. This will haunt the production.'
                    }
                ]
            },

            {
                id: 'onset_romance',
                name: 'On-Set Romance Scandal',
                description: 'Your lead actor and actress have fallen in love. Both are married to other people. A reporter has photographs. This could be a disaster... or brilliant publicity.',
                phase: ['PRODUCTION', 'POST_PRODUCTION'],
                probability: 0.07,
                conditions: { hasMaleAndFemaleLead: true },
                choices: [
                    {
                        text: 'Pay the reporter to kill the story',
                        cost: 18000,
                        effects: {
                            budget: -18000,
                            reputation: -5,
                            scandalRisk: 0.35
                        },
                        outcome: 'The photos disappear... but you can never be sure.'
                    },
                    {
                        text: 'Leak it yourself - control the narrative',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            hype: 35,
                            reputation: -12,
                            oscarChance: -0.25,
                            boxOfficeBoost: 1.25,
                            chemistry: 20
                        },
                        outcome: 'SCANDAL! The romance becomes front-page news. Ticket sales surge.'
                    },
                    {
                        text: 'Separate them - different shooting schedules',
                        cost: 12000,
                        effects: {
                            budget: -12000,
                            weeks: 3,
                            quality: -10,
                            chemistry: -15,
                            morale: -15
                        },
                        outcome: 'You kill the romance and the on-screen chemistry with it.'
                    },
                    {
                        text: 'Embrace it - their chemistry is gold',
                        cost: 0,
                        effects: {
                            quality: 15,
                            chemistry: 25,
                            scandal: 50,
                            oscarChance: -0.2,
                            boxOfficeBoost: 1.15
                        },
                        outcome: 'Scandal and artistry intertwine. Hollywood loves a romance.'
                    }
                ]
            },

            {
                id: 'star_demands_raise',
                name: 'Star Demands More Money',
                description: 'Mid-production, your star\'s agent shows up. "My client is the only reason this picture will succeed. We want double the original salary or we walk."',
                phase: ['PRODUCTION'],
                probability: 0.09,
                conditions: { minBudget: 40000 },
                choices: [
                    {
                        text: 'Pay them - you have no choice',
                        cost: 25000,
                        effects: {
                            budget: -25000,
                            reputation: -8,
                            starPower: 10,
                            otherStarsMorale: -15
                        },
                        outcome: 'You cave. Other stars on your lot take note.'
                    },
                    {
                        text: 'Refuse and call their bluff',
                        cost: 0,
                        effects: {
                            morale: -30,
                            quality: -15,
                            reputation: 5,
                            walkoutRisk: 0.3
                        },
                        outcome: 'High stakes poker. Will they really walk?'
                    },
                    {
                        text: 'Offer profit points instead of cash',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            profitShare: 10,
                            reputation: 3,
                            morale: 5
                        },
                        outcome: 'A creative solution. They get rich if the film succeeds.'
                    },
                    {
                        text: 'Recast immediately as a lesson',
                        cost: 40000,
                        effects: {
                            budget: -40000,
                            weeks: 6,
                            quality: -18,
                            reputation: 15,
                            scandal: 35
                        },
                        outcome: 'You send a message: nobody holds you hostage.'
                    }
                ]
            },

            {
                id: 'director_star_feud',
                name: 'Director vs. Star Showdown',
                description: 'Your director and lead actor had a screaming match on set. "It\'s him or me," your star says. The director echoes the same. The crew is paralyzed.',
                phase: ['PRODUCTION'],
                probability: 0.08,
                choices: [
                    {
                        text: 'Side with the director - they\'re the artist',
                        cost: 30000,
                        effects: {
                            budget: -30000,
                            weeks: 5,
                            quality: 10,
                            reputation: 5,
                            starFeud: true
                        },
                        outcome: 'You recast the star. The director delivers a masterpiece.'
                    },
                    {
                        text: 'Side with the star - they sell tickets',
                        cost: 20000,
                        effects: {
                            budget: -20000,
                            weeks: 4,
                            quality: -12,
                            reputation: -5,
                            directorFeud: true
                        },
                        outcome: 'A new director finishes the picture. It\'s professional, not inspired.'
                    },
                    {
                        text: 'Lock them in a room until they reconcile',
                        cost: 0,
                        effects: {
                            weeks: 2,
                            morale: -10,
                            randomOutcome: true
                        },
                        outcome: 'You gamble on forced reconciliation. They emerge... changed.'
                    },
                    {
                        text: 'Fire both and start over',
                        cost: 75000,
                        effects: {
                            budget: -75000,
                            weeks: 12,
                            quality: -25,
                            reputation: -15,
                            scandal: 60
                        },
                        outcome: 'Nuclear option. Hollywood is stunned by your ruthlessness.'
                    }
                ]
            },

            {
                id: 'star_refuses_costar',
                name: 'Star Refuses to Work With Co-Star',
                description: 'Your leading lady discovers her ex-husband has been cast in a supporting role. "I will not work with that man," she declares. "Find someone else or count me out."',
                phase: ['PRE_PRODUCTION', 'PRODUCTION'],
                probability: 0.06,
                choices: [
                    {
                        text: 'Replace the supporting actor',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            weeks: 2,
                            quality: -5,
                            morale: 10
                        },
                        outcome: 'You accommodate your star. The new actor is fine.'
                    },
                    {
                        text: 'Keep both - professional is professional',
                        cost: 0,
                        effects: {
                            morale: -25,
                            quality: -15,
                            tension: 40,
                            dramaticScenes: 10
                        },
                        outcome: 'The tension is palpable. Some scenes crackle with real emotion.'
                    },
                    {
                        text: 'Use this real tension in the script',
                        cost: 3000,
                        effects: {
                            budget: -3000,
                            quality: 15,
                            morale: -15,
                            oscarPotential: 10,
                            scandal: 20
                        },
                        outcome: 'Art imitates life. The performances are raw and powerful.'
                    }
                ]
            },

            {
                id: 'actor_exhaustion',
                name: 'Star Collapses From Exhaustion',
                description: 'Fourteen-hour days have taken their toll. Your star collapsed on set and was rushed to the hospital. The doctor says complete rest for two weeks minimum.',
                phase: ['PRODUCTION'],
                probability: 0.07,
                choices: [
                    {
                        text: 'Mandatory two-week production break',
                        cost: 12000,
                        effects: {
                            budget: -12000,
                            weeks: 2,
                            morale: 10,
                            quality: 5,
                            loyalty: 20
                        },
                        outcome: 'The crew returns refreshed. Morale improves.'
                    },
                    {
                        text: 'Shoot around them with other actors',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            weeks: 1,
                            quality: -8,
                            morale: 5
                        },
                        outcome: 'You keep the cameras rolling. Time is money.'
                    },
                    {
                        text: 'Reduce daily hours for everyone',
                        cost: 18000,
                        effects: {
                            budget: -18000,
                            weeks: 4,
                            morale: 20,
                            quality: 8,
                            reputation: 10
                        },
                        outcome: 'A humane studio. Word spreads. Stars want to work with you.'
                    }
                ]
            },

            {
                id: 'star_better_offer',
                name: 'Star Gets Better Offer',
                description: 'A rival studio is offering your star triple the salary for their next picture. "Get me out of this contract," their agent demands. "Or we make this difficult."',
                phase: ['PRODUCTION'],
                probability: 0.05,
                conditions: { minStarPower: 60 },
                choices: [
                    {
                        text: 'Hold them to their contract',
                        cost: 10000,
                        effects: {
                            budget: -10000,
                            morale: -20,
                            quality: -12,
                            reputation: -5,
                            starFeud: true
                        },
                        outcome: 'They finish the picture, but the performances are lifeless.'
                    },
                    {
                        text: 'Release them in exchange for future film',
                        cost: 0,
                        effects: {
                            reputation: 10,
                            futureCommitment: true,
                            quality: -10,
                            weeks: 4
                        },
                        outcome: 'Gracious exit. They owe you one picture in the future.'
                    },
                    {
                        text: 'Match the rival offer',
                        cost: 35000,
                        effects: {
                            budget: -35000,
                            morale: 10,
                            quality: 5,
                            reputation: -5
                        },
                        outcome: 'You pay through the nose, but keep your star.'
                    }
                ]
            },

            {
                id: 'actress_pregnant',
                name: 'Leading Lady Pregnant',
                description: 'Your leading actress reveals she\'s three months pregnant. "I can hide it for maybe six more weeks," she says nervously. The costumes won\'t fit much longer.',
                phase: ['PRODUCTION'],
                probability: 0.04,
                conditions: { hasFemaleLead: true },
                choices: [
                    {
                        text: 'Rush remaining scenes with her',
                        cost: 20000,
                        effects: {
                            budget: -20000,
                            weeks: -1,
                            quality: -10,
                            morale: 10
                        },
                        outcome: 'Frantic shooting. You finish her scenes, but they\'re rushed.'
                    },
                    {
                        text: 'Creative costuming and camera angles',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            quality: -5,
                            morale: 15,
                            reputation: 8
                        },
                        outcome: 'Clever filmmaking hides the pregnancy. She\'s grateful.'
                    },
                    {
                        text: 'Recast the role entirely',
                        cost: 45000,
                        effects: {
                            budget: -45000,
                            weeks: 8,
                            quality: -20,
                            scandal: 30
                        },
                        outcome: 'Starting over. The trade papers have a field day.'
                    },
                    {
                        text: 'Rewrite the story to include pregnancy',
                        cost: 12000,
                        effects: {
                            budget: -12000,
                            weeks: 3,
                            quality: 10,
                            genreShift: true,
                            innovative: 15
                        },
                        outcome: 'Bold choice. The story becomes more human and real.'
                    }
                ]
            },

            {
                id: 'actor_drinking',
                name: 'Star\'s Drinking Problem',
                description: 'Your lead actor shows up drunk again. This is the third time this week. The crew is whispering. Yesterday\'s footage is unusable. Something must be done.',
                phase: ['PRODUCTION'],
                probability: 0.06,
                choices: [
                    {
                        text: 'Stage an intervention with the cast',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            weeks: 2,
                            morale: 5,
                            quality: -8,
                            recoveryChance: 0.6
                        },
                        outcome: 'You confront them with compassion. They enter treatment.'
                    },
                    {
                        text: 'Hire a handler to keep them sober',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            weeks: 1,
                            quality: -5,
                            morale: -10
                        },
                        outcome: 'A minder shadows them constantly. It helps, barely.'
                    },
                    {
                        text: 'Fire them and recast',
                        cost: 50000,
                        effects: {
                            budget: -50000,
                            weeks: 10,
                            quality: -15,
                            reputation: 5,
                            scandal: 40
                        },
                        outcome: 'You make an example. The new star is professional.'
                    },
                    {
                        text: 'Use their intoxication for certain scenes',
                        cost: 0,
                        effects: {
                            quality: 10,
                            oscarPotential: 15,
                            morale: -20,
                            reputation: -15,
                            exploitation: 30
                        },
                        outcome: 'Morally questionable. The performance is devastatingly real.'
                    }
                ]
            },

            {
                id: 'stars_feuding',
                name: 'Co-Stars Feuding',
                description: 'Your two leads refuse to speak to each other off-camera. They demanded separate trailers, separate makeup artists, and will only communicate through assistants.',
                phase: ['PRODUCTION'],
                probability: 0.08,
                choices: [
                    {
                        text: 'Accommodate both - separate everything',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            quality: -10,
                            morale: -15,
                            chemistry: -20
                        },
                        outcome: 'You enable their feud. The on-screen chemistry suffers.'
                    },
                    {
                        text: 'Force them to attend dinner together',
                        cost: 3000,
                        effects: {
                            budget: -3000,
                            randomOutcome: true,
                            weeks: 1
                        },
                        outcome: 'You play therapist. They either reconcile or explode.'
                    },
                    {
                        text: 'Minimize their scenes together',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            weeks: 2,
                            quality: -15,
                            chemistry: -25
                        },
                        outcome: 'Creative editing. The romance feels distant.'
                    },
                    {
                        text: 'Use the tension - it reads on camera',
                        cost: 0,
                        effects: {
                            quality: 12,
                            morale: -20,
                            oscarPotential: 10,
                            dynamicTension: 25
                        },
                        outcome: 'Real animosity creates electric performances.'
                    }
                ]
            }
        ],

        // ====================================================================
        // DIRECTOR ISSUES (8 events)
        // ====================================================================
        director_issues: [
            {
                id: 'director_demands_reshoots',
                name: 'Director Demands Expensive Reshoots',
                description: 'Your director bursts in with three weeks of footage. "It\'s not good enough. I need to reshoot everything with different lighting. This is my masterpiece."',
                phase: ['PRODUCTION', 'POST_PRODUCTION'],
                probability: 0.07,
                conditions: { minBudget: 60000 },
                choices: [
                    {
                        text: 'Approve the reshoots - trust their vision',
                        cost: 40000,
                        effects: {
                            budget: -40000,
                            weeks: 5,
                            quality: 20,
                            oscarPotential: 15,
                            morale: 10
                        },
                        outcome: 'The new footage is stunning. Genius requires sacrifice.'
                    },
                    {
                        text: 'Compromise - reshoot key scenes only',
                        cost: 18000,
                        effects: {
                            budget: -18000,
                            weeks: 2,
                            quality: 8,
                            morale: 5
                        },
                        outcome: 'A diplomatic middle ground. The director accepts reluctantly.'
                    },
                    {
                        text: 'Refuse - the footage is fine',
                        cost: 0,
                        effects: {
                            morale: -25,
                            quality: -10,
                            reputation: -8,
                            directorFeud: true
                        },
                        outcome: 'You put your foot down. The director finishes bitterly.'
                    },
                    {
                        text: 'Replace the director immediately',
                        cost: 35000,
                        effects: {
                            budget: -35000,
                            weeks: 6,
                            quality: -15,
                            scandal: 50,
                            reputation: -12
                        },
                        outcome: 'Drastic. The industry buzzes with speculation.'
                    }
                ]
            },

            {
                id: 'producer_director_clash',
                name: 'Producer vs. Director War',
                description: 'Your producer and director are at each other\'s throats. "They\'re destroying my artistic vision!" vs. "They\'re bankrupting the studio!" Both demand you choose a side.',
                phase: ['PRODUCTION'],
                probability: 0.08,
                choices: [
                    {
                        text: 'Side with the producer - business first',
                        cost: 0,
                        effects: {
                            budget: 10000,
                            quality: -15,
                            morale: -20,
                            weeks: -1
                        },
                        outcome: 'The director complies. The film is efficient but uninspired.'
                    },
                    {
                        text: 'Side with the director - art first',
                        cost: 25000,
                        effects: {
                            budget: -25000,
                            quality: 15,
                            weeks: 3,
                            oscarPotential: 10
                        },
                        outcome: 'You empower the artist. The budget swells but magic happens.'
                    },
                    {
                        text: 'Fire the producer, keep director',
                        cost: 20000,
                        effects: {
                            budget: -20000,
                            quality: 10,
                            morale: 5,
                            producerFeud: true
                        },
                        outcome: 'You believe in the director\'s vision. Expensive bet.'
                    },
                    {
                        text: 'Replace both with trusted veterans',
                        cost: 45000,
                        effects: {
                            budget: -45000,
                            weeks: 8,
                            quality: -10,
                            reputation: 5
                        },
                        outcome: 'You bring in professionals who can work together.'
                    }
                ]
            },

            {
                id: 'director_fired_mid_production',
                name: 'Director Fired - Who Takes Over?',
                description: 'The studio board has lost confidence in your director. "They\'re fired," the chairman says. "You\'re in charge now. Find someone to finish this picture."',
                phase: ['PRODUCTION'],
                probability: 0.04,
                choices: [
                    {
                        text: 'Hire an established veteran director',
                        cost: 30000,
                        effects: {
                            budget: -30000,
                            weeks: 3,
                            quality: 5,
                            reputation: 5
                        },
                        outcome: 'A safe pair of hands finishes professionally.'
                    },
                    {
                        text: 'Promote the assistant director',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            weeks: 1,
                            quality: -8,
                            morale: 10,
                            loyalDirector: true
                        },
                        outcome: 'Loyal but inexperienced. They owe you everything.'
                    },
                    {
                        text: 'Direct it yourself',
                        cost: 0,
                        effects: {
                            quality: -12,
                            weeks: 4,
                            reputation: 15,
                            stress: 50,
                            randomOutcome: true
                        },
                        outcome: 'You step behind the camera. Sink or swim.'
                    },
                    {
                        text: 'Bring back the original director',
                        cost: 50000,
                        effects: {
                            budget: -50000,
                            morale: -15,
                            quality: 10,
                            reputation: -10
                        },
                        outcome: 'Humiliating but effective. They return with leverage.'
                    }
                ]
            },

            {
                id: 'director_vision_exceeds_budget',
                name: 'Director\'s Vision Too Expensive',
                description: 'Your director presents plans for the climax: "I need 500 extras, a burning building, and a stampede of horses. It\'s essential to the story."',
                phase: ['PRE_PRODUCTION', 'PRODUCTION'],
                probability: 0.09,
                conditions: { minBudget: 40000 },
                choices: [
                    {
                        text: 'Give them the full budget they need',
                        cost: 45000,
                        effects: {
                            budget: -45000,
                            weeks: 4,
                            quality: 25,
                            oscarPotential: 20,
                            spectacle: 30
                        },
                        outcome: 'The climax is spectacular. Audiences will remember this.'
                    },
                    {
                        text: 'Scale it down to what\'s affordable',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            weeks: 2,
                            quality: -5,
                            morale: -10
                        },
                        outcome: 'Compromised vision. The scene is adequate, not amazing.'
                    },
                    {
                        text: 'Suggest creative alternatives (miniatures, etc)',
                        cost: 20000,
                        effects: {
                            budget: -20000,
                            weeks: 3,
                            quality: 10,
                            innovative: 15,
                            oscarPotential: 10
                        },
                        outcome: 'Innovative filmmaking creates something unique.'
                    },
                    {
                        text: 'Cut the scene entirely, rewrite ending',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            quality: -15,
                            morale: -25,
                            directorFeud: true
                        },
                        outcome: 'The director is furious. The ending feels rushed.'
                    }
                ]
            },

            {
                id: 'director_experimental_techniques',
                name: 'Director Wants Experimental Techniques',
                description: 'Your director wants to use radical new techniques: "Handheld cameras, no artificial lighting, improvised dialogue. This will revolutionize cinema!"',
                phase: ['PRE_PRODUCTION', 'PRODUCTION'],
                probability: 0.06,
                choices: [
                    {
                        text: 'Embrace the experiment - be bold',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            quality: 15,
                            oscarPotential: 20,
                            innovative: 30,
                            risk: 0.4
                        },
                        outcome: 'Revolutionary or disastrous? Time will tell.'
                    },
                    {
                        text: 'Allow limited experimentation only',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            quality: 8,
                            innovative: 10,
                            morale: 5
                        },
                        outcome: 'A few scenes use the technique. Fresh and different.'
                    },
                    {
                        text: 'Refuse - stick to proven methods',
                        cost: 0,
                        effects: {
                            quality: -5,
                            morale: -20,
                            reputation: -5,
                            directorFeud: true
                        },
                        outcome: 'Conservative choice. The director feels stifled.'
                    }
                ]
            },

            {
                id: 'director_changing_script',
                name: 'Director Secretly Changing Script',
                description: 'You discover your director has been rewriting scenes without authorization. The writer is furious. "This is sabotage of my work!"',
                phase: ['PRODUCTION'],
                probability: 0.07,
                choices: [
                    {
                        text: 'Confront director, restore original script',
                        cost: 12000,
                        effects: {
                            budget: -12000,
                            weeks: 2,
                            quality: -10,
                            morale: -15,
                            directorFeud: true
                        },
                        outcome: 'You side with the writer. Reshoots are needed.'
                    },
                    {
                        text: 'Keep director\'s changes, compensate writer',
                        cost: 10000,
                        effects: {
                            budget: -10000,
                            quality: 12,
                            reputation: -5,
                            writerFeud: true
                        },
                        outcome: 'The changes improve the film. The writer is paid off.'
                    },
                    {
                        text: 'Have them collaborate on final version',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            weeks: 1,
                            quality: 8,
                            morale: 5
                        },
                        outcome: 'Forced collaboration creates something better.'
                    }
                ]
            },

            {
                id: 'director_health_failing',
                name: 'Director\'s Health Crisis',
                description: 'Your director has been hospitalized with a heart condition. The doctor says they need complete rest. But only four weeks of shooting remain.',
                phase: ['PRODUCTION'],
                probability: 0.04,
                choices: [
                    {
                        text: 'Suspend production until they recover',
                        cost: 20000,
                        effects: {
                            budget: -20000,
                            weeks: 8,
                            morale: 10,
                            quality: 5,
                            loyalty: 20
                        },
                        outcome: 'Compassionate decision. They return grateful and energized.'
                    },
                    {
                        text: 'Have them direct from hospital via phone',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            weeks: 1,
                            quality: -12,
                            morale: -10
                        },
                        outcome: 'Awkward but functional. The vision remains intact.'
                    },
                    {
                        text: 'Assistant director finishes the picture',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            quality: -15,
                            morale: 5,
                            weeks: 2
                        },
                        outcome: 'Finished quickly but lacking the director\'s touch.'
                    }
                ]
            },

            {
                id: 'director_drunk_on_set',
                name: 'Director Drunk on Set',
                description: 'Your director showed up drunk at 6 AM call time. This is not the first time. Yesterday\'s dailies show confused, rambling direction. The crew is losing faith.',
                phase: ['PRODUCTION'],
                probability: 0.05,
                choices: [
                    {
                        text: 'Send them home, suspend for one week',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            weeks: 1,
                            quality: -8,
                            morale: 10
                        },
                        outcome: 'They return sober and ashamed. Professionalism restored.'
                    },
                    {
                        text: 'Fire them immediately',
                        cost: 35000,
                        effects: {
                            budget: -35000,
                            weeks: 6,
                            quality: -12,
                            scandal: 40,
                            reputation: 5
                        },
                        outcome: 'Zero tolerance. The replacement is competent but conventional.'
                    },
                    {
                        text: 'Assign a sober assistant to shadow them',
                        cost: 12000,
                        effects: {
                            budget: -12000,
                            quality: -10,
                            morale: -15,
                            weeks: 1
                        },
                        outcome: 'Band-aid solution. The drinking continues privately.'
                    }
                ]
            }
        ],

        // ====================================================================
        // TECHNICAL PROBLEMS (10 events)
        // ====================================================================
        technical_problems: [
            {
                id: 'sound_equipment_failure',
                name: 'Sound Equipment Malfunction',
                description: 'The sound recorder broke during yesterday\'s crucial dialogue scene. Three days of footage has no usable audio. The sound engineer is devastated.',
                phase: ['PRODUCTION'],
                probability: 0.09,
                choices: [
                    {
                        text: 'Reshoot all affected scenes',
                        cost: 18000,
                        effects: {
                            budget: -18000,
                            weeks: 3,
                            quality: 5,
                            morale: -10
                        },
                        outcome: 'Perfect audio, but time and money lost.'
                    },
                    {
                        text: 'Use ADR (looping) in post-production',
                        cost: 12000,
                        effects: {
                            budget: -12000,
                            weeks: 2,
                            quality: -8,
                            postProductionCost: 5000
                        },
                        outcome: 'The actors re-record dialogue. Lip sync is imperfect.'
                    },
                    {
                        text: 'Convert to silent film with title cards',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            quality: -20,
                            genreShift: true,
                            innovative: 10
                        },
                        outcome: 'Radical choice. An artistic decision born of necessity.'
                    }
                ]
            },

            {
                id: 'film_stock_damaged',
                name: 'Film Negative Destroyed',
                description: 'DISASTER! A fire in the lab destroyed two weeks of film negatives. Your cinematographer is in tears. "It\'s all gone," he says. "Everything."',
                phase: ['PRODUCTION', 'POST_PRODUCTION'],
                probability: 0.03,
                choices: [
                    {
                        text: 'Reshoot everything from memory',
                        cost: 50000,
                        effects: {
                            budget: -50000,
                            weeks: 10,
                            quality: -15,
                            morale: -30
                        },
                        outcome: 'Heartbreaking. You recreate the lost footage.'
                    },
                    {
                        text: 'Use existing footage and rewrite around it',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            weeks: 4,
                            quality: -25,
                            scriptChanges: true
                        },
                        outcome: 'Creative salvage. The story becomes something else.'
                    },
                    {
                        text: 'Cancel the entire production',
                        cost: 0,
                        effects: {
                            filmCancelled: true,
                            reputation: -30,
                            morale: -50
                        },
                        outcome: 'You cut your losses. The crew disperses in shock.'
                    },
                    {
                        text: 'Shoot only essential scenes, scale down',
                        cost: 25000,
                        effects: {
                            budget: -25000,
                            weeks: 6,
                            quality: -20,
                            morale: -15
                        },
                        outcome: 'A smaller, simpler film emerges from the ashes.'
                    }
                ]
            },

            {
                id: 'weather_delays',
                name: 'Weather Destroys Location Shoot',
                description: 'A hurricane has devastated your location. Sets are destroyed. The hotel is damaged. The local crew wants to go home to their families.',
                phase: ['PRODUCTION'],
                probability: 0.06,
                conditions: { hasLocationShoot: true },
                choices: [
                    {
                        text: 'Wait for weather to clear and rebuild',
                        cost: 30000,
                        effects: {
                            budget: -30000,
                            weeks: 6,
                            morale: -15,
                            quality: 5
                        },
                        outcome: 'Patient rebuilding. The location was worth it.'
                    },
                    {
                        text: 'Move production to studio backlot',
                        cost: 20000,
                        effects: {
                            budget: -20000,
                            weeks: 3,
                            quality: -15,
                            authentic: -20
                        },
                        outcome: 'Artificial but functional. The authenticity is lost.'
                    },
                    {
                        text: 'Find alternate location nearby',
                        cost: 25000,
                        effects: {
                            budget: -25000,
                            weeks: 4,
                            quality: -8,
                            morale: 5
                        },
                        outcome: 'Compromise location. Different but workable.'
                    }
                ]
            },

            {
                id: 'special_effects_failing',
                name: 'Special Effects Not Working',
                description: 'The special effects are laughably bad. Test audiences giggled at what should be the dramatic climax. "The wires are visible," someone wrote on a comment card.',
                phase: ['POST_PRODUCTION'],
                probability: 0.07,
                conditions: { hasSpecialEffects: true },
                choices: [
                    {
                        text: 'Hire expensive effects specialists',
                        cost: 35000,
                        effects: {
                            budget: -35000,
                            weeks: 6,
                            quality: 20,
                            spectacle: 25
                        },
                        outcome: 'State of the art effects. Worth every penny.'
                    },
                    {
                        text: 'Use creative editing to hide the problems',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            weeks: 2,
                            quality: -5,
                            clever: 10
                        },
                        outcome: 'What you don\'t see can\'t hurt. Mostly works.'
                    },
                    {
                        text: 'Cut the effects scenes entirely',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            quality: -15,
                            spectacle: -30,
                            weeks: 1
                        },
                        outcome: 'A simpler, more intimate film. Less spectacular.'
                    },
                    {
                        text: 'Release as is - embrace the B-movie charm',
                        cost: 0,
                        effects: {
                            quality: -20,
                            oscarChance: -0.5,
                            cultClassic: 0.3,
                            boxOfficeBoost: 0.7
                        },
                        outcome: 'Campy and cheap. Some audiences might love it ironically.'
                    }
                ]
            },

            {
                id: 'fire_on_set',
                name: 'Fire Destroys Main Set',
                description: 'A lighting rig sparked a fire that destroyed the main interior set. Thank God no one was seriously hurt. But three weeks of construction is ash.',
                phase: ['PRODUCTION'],
                probability: 0.04,
                choices: [
                    {
                        text: 'Rebuild the set identically',
                        cost: 40000,
                        effects: {
                            budget: -40000,
                            weeks: 5,
                            quality: 5,
                            morale: -10
                        },
                        outcome: 'Exact reconstruction. Expensive but necessary.'
                    },
                    {
                        text: 'Build simplified version of the set',
                        cost: 20000,
                        effects: {
                            budget: -20000,
                            weeks: 3,
                            quality: -10,
                            morale: -5
                        },
                        outcome: 'Cheaper, simpler. The grandeur is diminished.'
                    },
                    {
                        text: 'Shoot on practical locations instead',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            weeks: 4,
                            quality: 8,
                            authentic: 15
                        },
                        outcome: 'Real locations add documentary realism.'
                    },
                    {
                        text: 'Rewrite to eliminate those scenes',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            weeks: 2,
                            quality: -15,
                            scriptChanges: true
                        },
                        outcome: 'The story is restructured. Different but complete.'
                    }
                ]
            },

            {
                id: 'equipment_stolen',
                name: 'Camera Equipment Stolen',
                description: 'Thieves broke into the equipment truck last night. Three cameras, lenses, and lighting equipment - gone. The police say it\'s an organized ring.',
                phase: ['PRODUCTION'],
                probability: 0.05,
                choices: [
                    {
                        text: 'Buy replacement equipment immediately',
                        cost: 35000,
                        effects: {
                            budget: -35000,
                            weeks: 1,
                            quality: 5
                        },
                        outcome: 'New equipment. Production barely skips a beat.'
                    },
                    {
                        text: 'Rent equipment for remainder of shoot',
                        cost: 18000,
                        effects: {
                            budget: -18000,
                            weeks: 1,
                            quality: -5
                        },
                        outcome: 'Rental gear is adequate but unfamiliar.'
                    },
                    {
                        text: 'Work with what\'s left, improvise',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            weeks: 2,
                            quality: -15,
                            innovative: 10
                        },
                        outcome: 'Limitation breeds creativity. Mostly.'
                    }
                ]
            },

            {
                id: 'dailies_lighting_problems',
                name: 'Dailies Reveal Lighting Disaster',
                description: 'This morning\'s dailies are unwatchable. The cinematographer used the wrong film stock. Two weeks of footage is too dark to use. "I thought... I\'m sorry," they stammer.',
                phase: ['PRODUCTION'],
                probability: 0.06,
                choices: [
                    {
                        text: 'Reshoot all affected footage',
                        cost: 25000,
                        effects: {
                            budget: -25000,
                            weeks: 4,
                            quality: 5,
                            morale: -15
                        },
                        outcome: 'Painful but thorough. The footage will be perfect.'
                    },
                    {
                        text: 'Lab can salvage some with special processing',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            weeks: 2,
                            quality: -10,
                            grainy: true
                        },
                        outcome: 'Chemical magic saves most footage. It looks rough.'
                    },
                    {
                        text: 'Embrace the dark look as artistic choice',
                        cost: 3000,
                        effects: {
                            budget: -3000,
                            quality: -5,
                            innovative: 15,
                            noir: 20
                        },
                        outcome: 'Film noir aesthetic. Atmospheric shadows.'
                    },
                    {
                        text: 'Fire cinematographer, start over',
                        cost: 35000,
                        effects: {
                            budget: -35000,
                            weeks: 5,
                            quality: -8,
                            morale: -20
                        },
                        outcome: 'New cinematographer reshapes the visual style.'
                    }
                ]
            },

            {
                id: 'costume_delays',
                name: 'Costume Department Disaster',
                description: 'The costume designer quit. Their assistant reveals the period costumes are only half-finished. Principal photography starts in one week.',
                phase: ['PRE_PRODUCTION', 'PRODUCTION'],
                probability: 0.07,
                conditions: { isPeriodPiece: true },
                choices: [
                    {
                        text: 'Hire emergency costume team, pay premium',
                        cost: 30000,
                        effects: {
                            budget: -30000,
                            weeks: 2,
                            quality: 5,
                            period_authentic: 10
                        },
                        outcome: 'Crisis averted. The costumes are magnificent.'
                    },
                    {
                        text: 'Promote assistant, give them resources',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            weeks: 3,
                            quality: -5,
                            loyalty: 15
                        },
                        outcome: 'They rise to the challenge. Good enough.'
                    },
                    {
                        text: 'Rent costumes from other studios',
                        cost: 12000,
                        effects: {
                            budget: -12000,
                            weeks: 1,
                            quality: -10,
                            period_authentic: -15
                        },
                        outcome: 'Recycled costumes. Viewers might recognize them.'
                    },
                    {
                        text: 'Change to contemporary setting',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            quality: -15,
                            genreShift: true,
                            scriptChanges: true
                        },
                        outcome: 'Modern dress. The whole story changes.'
                    }
                ]
            },

            {
                id: 'miniatures_unconvincing',
                name: 'Miniatures Look Fake',
                description: 'The model ships for the naval battle look like toys. "We can see the strings," your producer says bluntly. The battle is the whole third act.',
                phase: ['PRODUCTION'],
                probability: 0.05,
                conditions: { hasMiniaturesWork: true },
                choices: [
                    {
                        text: 'Rebuild miniatures with expert team',
                        cost: 40000,
                        effects: {
                            budget: -40000,
                            weeks: 6,
                            quality: 20,
                            spectacle: 25
                        },
                        outcome: 'Museum-quality miniatures. The battle is epic.'
                    },
                    {
                        text: 'Use stock footage from navy',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            weeks: 2,
                            quality: 5,
                            authentic: 20
                        },
                        outcome: 'Real ships! The scale is impressive.'
                    },
                    {
                        text: 'Minimize battle, focus on characters',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            weeks: 1,
                            quality: -10,
                            spectacle: -20,
                            intimate: 15
                        },
                        outcome: 'Character drama over spectacle. More intimate.'
                    }
                ]
            },

            {
                id: 'technicolor_processing',
                name: 'Technicolor Processing Crisis',
                description: 'The Technicolor lab is backed up for 8 weeks. Your film needs processing. "First come, first served," they say. "Unless you pay rush fees."',
                phase: ['POST_PRODUCTION'],
                probability: 0.06,
                conditions: { isTechnicolor: true },
                choices: [
                    {
                        text: 'Pay rush processing fees',
                        cost: 25000,
                        effects: {
                            budget: -25000,
                            weeks: 2,
                            quality: 10,
                            color: 20
                        },
                        outcome: 'Glorious color, worth the premium.'
                    },
                    {
                        text: 'Wait the full 8 weeks',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            weeks: 8,
                            quality: 5,
                            releaseDate: 8
                        },
                        outcome: 'Perfect color, but you miss the summer season.'
                    },
                    {
                        text: 'Convert to black and white',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            quality: -15,
                            color: -30,
                            noir: 15
                        },
                        outcome: 'Dramatic black and white. Different vision.'
                    }
                ]
            }
        ],

        // ====================================================================
        // SCRIPT/STORY ISSUES (8 events)
        // ====================================================================
        script_issues: [
            {
                id: 'censor_board_demands',
                name: 'Censors Threaten to Withhold Seal',
                description: 'The Production Code office sent a letter. "The adultery subplot, the violence, and the bedroom scene are unacceptable. Remove them or receive no seal of approval."',
                phase: ['POST_PRODUCTION', 'PRODUCTION'],
                probability: 0.09,
                choices: [
                    {
                        text: 'Make all requested cuts',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            quality: -15,
                            weeks: 2,
                            censorApproval: 100
                        },
                        outcome: 'Sanitized and safe. Theaters will book it.'
                    },
                    {
                        text: 'Negotiate, make minimal changes',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            quality: -5,
                            weeks: 3,
                            censorApproval: 80
                        },
                        outcome: 'Compromise. The edge is dulled slightly.'
                    },
                    {
                        text: 'Fight it - release without seal',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            scandal: 60,
                            theatersAvailable: -50,
                            reputation: 15,
                            cultClassic: 0.4
                        },
                        outcome: 'Artistic integrity preserved. Many theaters won\'t screen it.'
                    },
                    {
                        text: 'Add footage implying consequences for sins',
                        cost: 12000,
                        effects: {
                            budget: -12000,
                            weeks: 3,
                            quality: -10,
                            censorApproval: 95,
                            moral: 20
                        },
                        outcome: 'Evil is punished. The censors are satisfied.'
                    }
                ]
            },

            {
                id: 'test_audience_hates_ending',
                name: 'Preview Audience Walks Out',
                description: 'The test screening was a disaster. Fifty people walked out during the ending. Comment cards say "depressing," "confusing," "we hated it." The studio is panicking.',
                phase: ['POST_PRODUCTION'],
                probability: 0.08,
                choices: [
                    {
                        text: 'Reshoot with happy ending',
                        cost: 30000,
                        effects: {
                            budget: -30000,
                            weeks: 4,
                            quality: -10,
                            oscarChance: -0.3,
                            boxOfficeBoost: 1.15
                        },
                        outcome: 'Crowd-pleasing finale. The artistry is compromised.'
                    },
                    {
                        text: 'Re-edit existing footage into new ending',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            weeks: 2,
                            quality: -5,
                            coherence: -10
                        },
                        outcome: 'Frankenstein editing. It sort of works.'
                    },
                    {
                        text: 'Keep original ending, add explanatory title card',
                        cost: 2000,
                        effects: {
                            budget: -2000,
                            quality: -3,
                            weeks: 1,
                            intellectual: 10
                        },
                        outcome: 'You trust the audience to understand eventually.'
                    },
                    {
                        text: 'Release as is - the audience is wrong',
                        cost: 0,
                        effects: {
                            quality: 10,
                            oscarChance: 0.2,
                            boxOfficeBoost: 0.6,
                            cultClassic: 0.5
                        },
                        outcome: 'Artistic vision intact. Commercial suicide?'
                    }
                ]
            },

            {
                id: 'real_world_controversy',
                name: 'Real Events Make Story Controversial',
                description: 'A tragedy in the news mirrors your film\'s plot. "Releasing this now would be tasteless," the studio head says. Protesters are already organizing.',
                phase: ['POST_PRODUCTION', 'RELEASE'],
                probability: 0.05,
                choices: [
                    {
                        text: 'Delay release for six months',
                        cost: 10000,
                        effects: {
                            budget: -10000,
                            weeks: 24,
                            hype: -20,
                            reputation: 10
                        },
                        outcome: 'Respectful decision. The moment passes.'
                    },
                    {
                        text: 'Add opening disclaimer, donate profits to charity',
                        cost: 20000,
                        effects: {
                            budget: -20000,
                            profitShare: -25,
                            reputation: 15,
                            controversy: 20
                        },
                        outcome: 'Sensitivity and generosity. Protesters back down.'
                    },
                    {
                        text: 'Release as planned - it\'s fiction',
                        cost: 0,
                        effects: {
                            scandal: 70,
                            reputation: -25,
                            controversy: 60,
                            boxOfficeBoost: 1.3
                        },
                        outcome: 'Condemned in the press. Enormous publicity.'
                    },
                    {
                        text: 'Shelve the film permanently',
                        cost: 0,
                        effects: {
                            filmCancelled: true,
                            reputation: 5,
                            morale: -40
                        },
                        outcome: 'The picture never sees light. The right thing?'
                    }
                ]
            },

            {
                id: 'rival_studio_similar_film',
                name: 'Rival Studio Announces Identical Story',
                description: 'MGM just announced a film with the same premise as yours. "They stole our ending from a spy on the lot," your writer claims. Their film releases two months before yours.',
                phase: ['PRODUCTION', 'POST_PRODUCTION'],
                probability: 0.07,
                choices: [
                    {
                        text: 'Rush to finish and release first',
                        cost: 40000,
                        effects: {
                            budget: -40000,
                            weeks: -4,
                            quality: -20,
                            boxOfficeBoost: 1.2
                        },
                        outcome: 'Frantic rush. You beat them but the film is rough.'
                    },
                    {
                        text: 'Completely rewrite the third act',
                        cost: 35000,
                        effects: {
                            budget: -35000,
                            weeks: 6,
                            quality: -10,
                            original: 20
                        },
                        outcome: 'Different ending. Your film stands apart.'
                    },
                    {
                        text: 'Sue for corporate espionage',
                        cost: 25000,
                        effects: {
                            budget: -25000,
                            weeks: 8,
                            scandal: 50,
                            reputation: -10,
                            legalBattle: true
                        },
                        outcome: 'Lawyers circle. The case drags on for months.'
                    },
                    {
                        text: 'Market yours as "the superior version"',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            hype: 20,
                            rivalry: 30,
                            comparison: true
                        },
                        outcome: 'Competition drives interest. Yours better be good.'
                    }
                ]
            },

            {
                id: 'writer_credit_dispute',
                name: 'Writer Credit War',
                description: 'Three writers claim credit for the screenplay. "I wrote the structure!" "I wrote the dialogue!" "I wrote the ending!" The Writers Guild is investigating.',
                phase: ['POST_PRODUCTION'],
                probability: 0.06,
                choices: [
                    {
                        text: 'Pay all three, share credit equally',
                        cost: 20000,
                        effects: {
                            budget: -20000,
                            reputation: 5,
                            writerRelations: 15
                        },
                        outcome: 'Diplomatic solution. Everyone is moderately happy.'
                    },
                    {
                        text: 'Let Writers Guild arbitrate',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            weeks: 4,
                            morale: -15,
                            writerFeud: true
                        },
                        outcome: 'Official ruling. Two writers feel betrayed.'
                    },
                    {
                        text: 'Credit only the first writer',
                        cost: 0,
                        effects: {
                            reputation: -15,
                            writerRelations: -30,
                            lawsuit: 0.4
                        },
                        outcome: 'Brutal decision. Lawsuits may follow.'
                    }
                ]
            },

            {
                id: 'historical_errors',
                name: 'Historical Consultant Finds Major Errors',
                description: 'Your historical consultant just informed you that the entire battle sequence is wrong. "This battle happened two years later," they say. "In a different country."',
                phase: ['PRODUCTION', 'POST_PRODUCTION'],
                probability: 0.05,
                conditions: { isHistorical: true },
                choices: [
                    {
                        text: 'Reshoot with correct history',
                        cost: 40000,
                        effects: {
                            budget: -40000,
                            weeks: 8,
                            quality: 10,
                            authentic: 30,
                            educational: 15
                        },
                        outcome: 'Historically accurate. Educators will praise it.'
                    },
                    {
                        text: 'Add opening card: "Inspired by true events"',
                        cost: 1000,
                        effects: {
                            budget: -1000,
                            authentic: -10,
                            quality: -5
                        },
                        outcome: 'Creative license claimed. Historians will grumble.'
                    },
                    {
                        text: 'Keep errors, most audiences won\'t know',
                        cost: 0,
                        effects: {
                            quality: -8,
                            authentic: -25,
                            scandal: 20
                        },
                        outcome: 'Historical fiction. The experts will roast you.'
                    }
                ]
            },

            {
                id: 'legal_threat_similarity',
                name: 'Plagiarism Lawsuit Threatened',
                description: 'A novelist claims your script plagiarized their unpublished manuscript. Their lawyer says "Settle for $50,000 now, or we sue for $500,000 and block the release."',
                phase: ['PRE_PRODUCTION', 'PRODUCTION', 'POST_PRODUCTION'],
                probability: 0.05,
                choices: [
                    {
                        text: 'Settle immediately to avoid trial',
                        cost: 50000,
                        effects: {
                            budget: -50000,
                            reputation: -10,
                            creditChange: true
                        },
                        outcome: 'Expensive peace. They get credit and cash.'
                    },
                    {
                        text: 'Fight it in court',
                        cost: 30000,
                        effects: {
                            budget: -30000,
                            weeks: 12,
                            scandal: 40,
                            legalBattle: true,
                            trialOutcome: 0.5
                        },
                        outcome: 'Legal war. The outcome is uncertain.'
                    },
                    {
                        text: 'Prove independent creation with documentation',
                        cost: 10000,
                        effects: {
                            budget: -10000,
                            weeks: 4,
                            reputation: 5
                        },
                        outcome: 'Your paper trail is solid. The claim collapses.'
                    }
                ]
            },

            {
                id: 'studio_head_demands_changes',
                name: 'Studio Chief Demands Rewrites',
                description: 'The studio head watched the rough cut. "I don\'t like the ending, the middle drags, and where are the laughs? Rewrite it." They own the final cut.',
                phase: ['POST_PRODUCTION'],
                probability: 0.10,
                choices: [
                    {
                        text: 'Make all demanded changes',
                        cost: 25000,
                        effects: {
                            budget: -25000,
                            weeks: 5,
                            quality: -15,
                            commercial: 15,
                            morale: -25
                        },
                        outcome: 'Committee-designed film. More commercial, less inspired.'
                    },
                    {
                        text: 'Convince them with test screening data',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            weeks: 2,
                            quality: 5,
                            reputation: 10
                        },
                        outcome: 'Data wins. The boss backs down reluctantly.'
                    },
                    {
                        text: 'Make token changes, keep core intact',
                        cost: 12000,
                        effects: {
                            budget: -12000,
                            weeks: 3,
                            quality: -5,
                            political: 15
                        },
                        outcome: 'Political maneuvering. They think they got their way.'
                    },
                    {
                        text: 'Quit and take your name off the film',
                        cost: 0,
                        effects: {
                            reputation: -20,
                            morale: -40,
                            directorCredit: false,
                            industry: -25
                        },
                        outcome: 'Principles intact. Career damaged.'
                    }
                ]
            }
        ],

        // ====================================================================
        // EXTERNAL PRESSURES (6 events)
        // ====================================================================
        external_pressures: [
            {
                id: 'government_propaganda',
                name: 'Government Wants Propaganda Added',
                description: 'A War Department representative arrives. "We need you to add scenes showing the military in a positive light. We can offer... incentives. Or make things difficult."',
                phase: ['PRODUCTION', 'POST_PRODUCTION'],
                probability: 0.06,
                conditions: { isWartime: true },
                choices: [
                    {
                        text: 'Cooperate fully - add propaganda scenes',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            weeks: 3,
                            quality: -10,
                            patriotic: 30,
                            governmentFavor: 50
                        },
                        outcome: 'Government approved. Access to military equipment granted.'
                    },
                    {
                        text: 'Add subtle patriotic elements only',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            weeks: 1,
                            quality: -3,
                            patriotic: 10,
                            governmentFavor: 20
                        },
                        outcome: 'Compromise. Both sides moderately satisfied.'
                    },
                    {
                        text: 'Refuse - artistic freedom matters',
                        cost: 0,
                        effects: {
                            reputation: 15,
                            governmentFavor: -50,
                            investigation: 0.4,
                            blacklistRisk: 20
                        },
                        outcome: 'Principled stand. Government agencies take note.'
                    }
                ]
            },

            {
                id: 'religious_boycott',
                name: 'Religious Groups Threaten Boycott',
                description: 'The Catholic Legion of Decency has condemned your film. Priests are telling congregations not to see it. "Morally objectionable," their statement reads.',
                phase: ['POST_PRODUCTION', 'RELEASE'],
                probability: 0.07,
                choices: [
                    {
                        text: 'Meet with church leaders, make cuts',
                        cost: 10000,
                        effects: {
                            budget: -10000,
                            quality: -12,
                            weeks: 2,
                            controversy: -30,
                            boxOfficeBoost: 0.9
                        },
                        outcome: 'Blessing secured. The boycott is cancelled.'
                    },
                    {
                        text: 'Ignore it - controversy sells tickets',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            scandal: 50,
                            controversy: 60,
                            oscarChance: -0.2,
                            boxOfficeBoost: 1.25
                        },
                        outcome: 'Forbidden fruit. Lines around the block.'
                    },
                    {
                        text: 'Add moral disclaimer at beginning',
                        cost: 2000,
                        effects: {
                            budget: -2000,
                            quality: -3,
                            controversy: -15
                        },
                        outcome: 'Fig leaf. The objections soften slightly.'
                    }
                ]
            },

            {
                id: 'foreign_ban',
                name: 'Foreign Markets Ban the Film',
                description: 'Britain has banned your film for "moral degeneracy." France, Italy and Germany follow. Forty percent of potential revenue just vanished.',
                phase: ['RELEASE'],
                probability: 0.05,
                choices: [
                    {
                        text: 'Create sanitized "international version"',
                        cost: 20000,
                        effects: {
                            budget: -20000,
                            weeks: 4,
                            quality: -8,
                            foreignRevenue: 30
                        },
                        outcome: 'Two versions. Foreign markets accept the cleaned version.'
                    },
                    {
                        text: 'Accept the ban, focus on domestic market',
                        cost: 0,
                        effects: {
                            foreignRevenue: -40,
                            quality: 5,
                            reputation: 10
                        },
                        outcome: 'Artistic integrity preserved. Profits suffer.'
                    },
                    {
                        text: 'Lobby governments through diplomatic channels',
                        cost: 35000,
                        effects: {
                            budget: -35000,
                            weeks: 8,
                            foreignRevenue: 20,
                            political: 20
                        },
                        outcome: 'Expensive diplomacy. Some bans are lifted.'
                    }
                ]
            },

            {
                id: 'huac_investigator',
                name: 'HUAC Investigator Asking Questions',
                description: 'A House Un-American Activities Committee investigator wants to discuss your writer\'s "associations." "We hear they attended certain meetings in the \'30s."',
                phase: ['PRODUCTION', 'POST_PRODUCTION'],
                probability: 0.08,
                conditions: { isRedScare: true },
                choices: [
                    {
                        text: 'Cooperate fully with investigation',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            reputation: -20,
                            writerRelations: -50,
                            blacklist: 0.6
                        },
                        outcome: 'Your writer is blacklisted. You\'re in the clear.'
                    },
                    {
                        text: 'Stand by your writer publicly',
                        cost: 10000,
                        effects: {
                            budget: -10000,
                            reputation: 15,
                            blacklistRisk: 40,
                            controversy: 50,
                            loyalty: 30
                        },
                        outcome: 'Brave stance. Your career may be over.'
                    },
                    {
                        text: 'Quietly remove writer\'s name, use pseudonym',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            reputation: -10,
                            writerRelations: -20,
                            scandal: 30
                        },
                        outcome: 'Cowardly compromise. The writer works uncredited.'
                    },
                    {
                        text: 'Hire new writer, reshoot affected scenes',
                        cost: 40000,
                        effects: {
                            budget: -40000,
                            weeks: 6,
                            quality: -15,
                            reputation: -15
                        },
                        outcome: 'Self-censorship. The new writer is safe and mediocre.'
                    }
                ]
            },

            {
                id: 'investor_pulls_out',
                name: 'Major Investor Withdraws Funding',
                description: 'Your primary investor just called. "I\'m out. The project is too risky." They\'re pulling $100,000. You\'re halfway through production.',
                phase: ['PRODUCTION'],
                probability: 0.04,
                conditions: { hasExternalInvestor: true },
                choices: [
                    {
                        text: 'Find replacement investor quickly',
                        cost: 20000,
                        effects: {
                            budget: -20000,
                            weeks: 3,
                            profitShare: -20,
                            quality: -5
                        },
                        outcome: 'New investor demands larger profit share.'
                    },
                    {
                        text: 'Studio covers the gap from reserves',
                        cost: 100000,
                        effects: {
                            budget: -100000,
                            quality: 5,
                            reputation: 10
                        },
                        outcome: 'Expensive but clean. You own the whole film.'
                    },
                    {
                        text: 'Scale down production drastically',
                        cost: 0,
                        effects: {
                            quality: -25,
                            spectacle: -30,
                            morale: -30,
                            weeks: 2
                        },
                        outcome: 'Smaller, cheaper film. The vision is compromised.'
                    },
                    {
                        text: 'Shut down production, cut losses',
                        cost: 0,
                        effects: {
                            filmCancelled: true,
                            reputation: -25,
                            morale: -50
                        },
                        outcome: 'The picture is abandoned. Careers are ruined.'
                    }
                ]
            },

            {
                id: 'war_rationing',
                name: 'War Rationing Affects Materials',
                description: 'New rationing restrictions limit film stock, lumber for sets, and gasoline for location shooting. "Essential war industries only," the government says.',
                phase: ['PRODUCTION'],
                probability: 0.10,
                conditions: { isWartime: true },
                choices: [
                    {
                        text: 'Apply for essential industry exemption',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            weeks: 4,
                            governmentFavor: -20,
                            bureaucracy: 30
                        },
                        outcome: 'Government red tape. Eventually approved.'
                    },
                    {
                        text: 'Black market purchase of materials',
                        cost: 40000,
                        effects: {
                            budget: -40000,
                            quality: 5,
                            scandal: 40,
                            investigation: 0.3
                        },
                        outcome: 'Expensive and risky. You get what you need.'
                    },
                    {
                        text: 'Adapt production to available materials',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            quality: -10,
                            innovative: 15,
                            patriotic: 10
                        },
                        outcome: 'Creative adaptation. Make do with less.'
                    },
                    {
                        text: 'Postpone production until after the war',
                        cost: 0,
                        effects: {
                            weeks: 52,
                            morale: -30,
                            reputation: -10
                        },
                        outcome: 'Shelved for the duration. Who knows when that is?'
                    }
                ]
            }
        ],

        // ====================================================================
        // POSITIVE EVENTS (6 events)
        // ====================================================================
        positive_events: [
            {
                id: 'test_screening_triumph',
                name: 'Test Screening Sensation',
                description: 'The preview audience went wild. Standing ovation. Comment cards say "masterpiece," "instant classic," "best film I\'ve ever seen." The studio is ecstatic.',
                phase: ['POST_PRODUCTION'],
                probability: 0.05,
                choices: [
                    {
                        text: 'Increase marketing budget to capitalize',
                        cost: 30000,
                        effects: {
                            budget: -30000,
                            hype: 40,
                            oscarPotential: 15,
                            boxOfficeBoost: 1.35
                        },
                        outcome: 'Massive marketing push. Everyone will know about this film.'
                    },
                    {
                        text: 'Let word of mouth build naturally',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            hype: 25,
                            oscarPotential: 10,
                            organic: 20
                        },
                        outcome: 'Buzz spreads organically. The mystique builds.'
                    },
                    {
                        text: 'Schedule more test screenings to build momentum',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            weeks: 2,
                            hype: 35,
                            oscarPotential: 12
                        },
                        outcome: 'More audiences, more raves. The excitement grows.'
                    }
                ]
            },

            {
                id: 'unexpected_chemistry',
                name: 'Lightning in a Bottle',
                description: 'The chemistry between your leads is extraordinary. Every take crackles with electricity. The crew is in awe. "This is special," your director whispers.',
                phase: ['PRODUCTION'],
                probability: 0.06,
                conditions: { hasMultipleLeads: true },
                choices: [
                    {
                        text: 'Expand their scenes together',
                        cost: 12000,
                        effects: {
                            budget: -12000,
                            weeks: 2,
                            quality: 20,
                            chemistry: 35,
                            oscarPotential: 15
                        },
                        outcome: 'More magic. The film transforms around their connection.'
                    },
                    {
                        text: 'Stick to original script',
                        cost: 0,
                        effects: {
                            quality: 15,
                            chemistry: 25
                        },
                        outcome: 'The existing scenes are perfect. Don\'t gild the lily.'
                    },
                    {
                        text: 'Feature them in marketing campaign',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            hype: 30,
                            starPower: 15
                        },
                        outcome: 'The chemistry becomes the selling point.'
                    }
                ]
            },

            {
                id: 'technical_breakthrough',
                name: 'Revolutionary Innovation',
                description: 'Your cinematographer just invented a new camera technique. "This has never been done before," they say excitedly. "We could change cinema."',
                phase: ['PRODUCTION'],
                probability: 0.04,
                choices: [
                    {
                        text: 'Invest in perfecting the technique',
                        cost: 25000,
                        effects: {
                            budget: -25000,
                            weeks: 4,
                            quality: 25,
                            oscarPotential: 25,
                            innovative: 40,
                            legendary: 20
                        },
                        outcome: 'Film history is made. Your name will be remembered.'
                    },
                    {
                        text: 'Use it sparingly for key scenes',
                        cost: 10000,
                        effects: {
                            budget: -10000,
                            weeks: 2,
                            quality: 15,
                            innovative: 20,
                            oscarPotential: 15
                        },
                        outcome: 'Tasteful innovation. The technique enhances without overwhelming.'
                    },
                    {
                        text: 'Patent it and license to other studios',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            quality: 10,
                            futureRevenue: 50000,
                            reputation: 20
                        },
                        outcome: 'Business opportunity. You\'ll earn royalties for years.'
                    }
                ]
            },

            {
                id: 'positive_press',
                name: 'Influential Critic Raves',
                description: 'A powerful columnist visited the set and wrote a glowing advance piece. "A masterpiece in the making," the headline reads. The industry is talking.',
                phase: ['PRODUCTION', 'POST_PRODUCTION'],
                probability: 0.08,
                choices: [
                    {
                        text: 'Invite more press to build momentum',
                        cost: 10000,
                        effects: {
                            budget: -10000,
                            hype: 35,
                            reputation: 15,
                            pressure: 20
                        },
                        outcome: 'Media circus. Expectations soar dangerously high.'
                    },
                    {
                        text: 'Keep production closed, maintain mystique',
                        cost: 2000,
                        effects: {
                            budget: -2000,
                            hype: 25,
                            mystique: 20
                        },
                        outcome: 'Selective access. The mystery deepens.'
                    },
                    {
                        text: 'Use quote in all marketing materials',
                        cost: 5000,
                        effects: {
                            budget: -5000,
                            hype: 30,
                            oscarPotential: 10
                        },
                        outcome: 'That quote is everywhere. Effective advertising.'
                    }
                ]
            },

            {
                id: 'star_cameo',
                name: 'Major Star Offers Cameo',
                description: 'Hollywood\'s biggest star just called. "I love this project. Let me do a cameo - one day, scale salary. I just want to be part of it."',
                phase: ['PRODUCTION'],
                probability: 0.03,
                choices: [
                    {
                        text: 'Accept - their name adds prestige',
                        cost: 8000,
                        effects: {
                            budget: -8000,
                            weeks: 1,
                            starPower: 25,
                            hype: 30,
                            boxOfficeBoost: 1.15
                        },
                        outcome: 'The cameo is announced. Ticket presales surge.'
                    },
                    {
                        text: 'Decline - don\'t want to overshadow leads',
                        cost: 0,
                        effects: {
                            quality: 5,
                            focus: 15,
                            starRelations: -10
                        },
                        outcome: 'Your leads remain the focus. The right call?'
                    },
                    {
                        text: 'Accept and expand their role',
                        cost: 20000,
                        effects: {
                            budget: -20000,
                            weeks: 3,
                            starPower: 40,
                            hype: 45,
                            quality: 10,
                            boxOfficeBoost: 1.25
                        },
                        outcome: 'Substantial role. The billing gets complicated.'
                    }
                ]
            },

            {
                id: 'perfect_location',
                name: 'Perfect Location Discovered',
                description: 'Your location scout found the ideal setting - exactly what the script describes. "It\'s like the place was waiting for us," they say. And it\'s available.',
                phase: ['PRE_PRODUCTION', 'PRODUCTION'],
                probability: 0.07,
                choices: [
                    {
                        text: 'Seize it - rewrite schedule to shoot there',
                        cost: 15000,
                        effects: {
                            budget: -15000,
                            weeks: 2,
                            quality: 18,
                            authentic: 25,
                            beautiful: 20
                        },
                        outcome: 'Stunning visuals. The location becomes a character.'
                    },
                    {
                        text: 'Stick with planned studio sets',
                        cost: 0,
                        effects: {
                            quality: -5,
                            authentic: -10,
                            opportunity: -20
                        },
                        outcome: 'Safe and controlled. But what might have been?'
                    },
                    {
                        text: 'Shoot both location and studio, use best',
                        cost: 30000,
                        effects: {
                            budget: -30000,
                            weeks: 4,
                            quality: 20,
                            options: 25
                        },
                        outcome: 'Maximum options. Expensive but comprehensive.'
                    }
                ]
            }
        ]
    };

    // ========================================================================
    // EVENT PROCESSING SYSTEM
    // ========================================================================

    /**
     * Get all eligible events for current game state
     */
    function getEligibleEvents(gameState, film) {
        const allEvents = [];
        const currentPhase = film.phase || 'PRODUCTION';
        const currentYear = gameState.year || 1940;

        // Gather all events from all categories
        for (const category in EVENT_DATABASE) {
            const categoryEvents = EVENT_DATABASE[category];
            categoryEvents.forEach(event => {
                // Check phase eligibility
                if (!event.phase || event.phase.includes(currentPhase)) {
                    // Check conditions
                    if (!event.conditions || checkConditions(event.conditions, film, gameState)) {
                        allEvents.push({
                            ...event,
                            category: category
                        });
                    }
                }
            });
        }

        return allEvents;
    }

    /**
     * Check if event conditions are met
     */
    function checkConditions(conditions, film, gameState) {
        for (const key in conditions) {
            switch(key) {
                case 'minBudget':
                    if ((film.budget || 0) < conditions[key]) return false;
                    break;
                case 'hasActionScenes':
                    if (conditions[key] && film.genre !== 'action') return false;
                    break;
                case 'hasMaleAndFemaleLead':
                    if (conditions[key] && !film.hasRomanticPlot) return false;
                    break;
                case 'minStarPower':
                    if ((film.starPower || 0) < conditions[key]) return false;
                    break;
                case 'hasFemaleLead':
                    if (conditions[key] && !film.hasFemaleLead) return false;
                    break;
                case 'isWartime':
                    if (conditions[key] && (gameState.year < 1941 || gameState.year > 1945)) return false;
                    break;
                case 'isRedScare':
                    if (conditions[key] && (gameState.year < 1947 || gameState.year > 1954)) return false;
                    break;
                case 'hasExternalInvestor':
                    if (conditions[key] && !film.hasInvestor) return false;
                    break;
                case 'isPeriodPiece':
                    if (conditions[key] && !film.isPeriod) return false;
                    break;
                case 'isHistorical':
                    if (conditions[key] && film.genre !== 'historical') return false;
                    break;
                case 'hasMiniaturesWork':
                    if (conditions[key] && !film.hasMinatures) return false;
                    break;
                case 'isTechnicolor':
                    if (conditions[key] && !film.isColor) return false;
                    break;
                case 'hasLocationShoot':
                    if (conditions[key] && !film.hasLocation) return false;
                    break;
                case 'hasSpecialEffects':
                    if (conditions[key] && !film.hasFX) return false;
                    break;
                case 'hasMultipleLeads':
                    if (conditions[key] && (film.castSize || 0) < 2) return false;
                    break;
            }
        }
        return true;
    }

    /**
     * Generate random event for weekly check
     */
    function generateRandomEvent(gameState) {
        if (!gameState.activeFilms || gameState.activeFilms.length === 0) {
            return null;
        }

        // Pick random active film
        const film = gameState.activeFilms[Math.floor(Math.random() * gameState.activeFilms.length)];
        const eligibleEvents = getEligibleEvents(gameState, film);

        if (eligibleEvents.length === 0) return null;

        // Weighted random selection based on probability
        let totalProbability = eligibleEvents.reduce((sum, e) => sum + (e.probability || 0.05), 0);
        let roll = Math.random() * totalProbability;
        let cumulative = 0;

        for (const event of eligibleEvents) {
            cumulative += (event.probability || 0.05);
            if (roll <= cumulative) {
                return triggerEvent(event, film, gameState);
            }
        }

        return null;
    }

    /**
     * Trigger an event and show choice modal
     */
    function triggerEvent(event, film, gameState) {
        // Store event context for choice handling
        window.EventSystem._currentEvent = {
            event: event,
            film: film,
            gameState: gameState
        };

        // Display event modal with choices
        showEventModal(event, film);

        return {
            event: event,
            film: film,
            triggered: true
        };
    }

    /**
     * Display event modal with dramatic choices
     */
    function showEventModal(event, film) {
        const choicesHTML = event.choices.map((choice, index) => {
            const costDisplay = choice.cost > 0 ? `<span class="choice-cost">Cost: $${choice.cost.toLocaleString()}</span>` : '';
            return `
                <div class="event-choice-card" onclick="EventSystem.selectChoice(${index})">
                    <div class="choice-header">
                        <h4>${choice.text}</h4>
                        ${costDisplay}
                    </div>
                    <div class="choice-effects">
                        ${formatEffects(choice.effects)}
                    </div>
                    <div class="choice-outcome">
                        <em>"${choice.outcome}"</em>
                    </div>
                </div>
            `;
        }).join('');

        const modalHTML = `
            <div class="crisis-event-modal">
                <div class="crisis-header">
                    <h2>🎬 PRODUCTION CRISIS</h2>
                    <h3>${event.name}</h3>
                </div>
                <div class="crisis-film">
                    <strong>Film:</strong> ${film.title}
                </div>
                <div class="crisis-description">
                    <p>${event.description}</p>
                </div>
                <div class="crisis-choices">
                    <h4>What do you do?</h4>
                    ${choicesHTML}
                </div>
            </div>
        `;

        if (window.HollywoodMogul && window.HollywoodMogul.showModal) {
            window.HollywoodMogul.showModal(modalHTML);
        } else {
            console.warn('[EVENT] Modal display system not available');
            // Fallback: auto-select first choice
            selectChoice(0);
        }
    }

    /**
     * Format effects for display
     */
    function formatEffects(effects) {
        const effectDescriptions = [];

        if (effects.budget < 0) effectDescriptions.push(`💰 Cost: $${Math.abs(effects.budget).toLocaleString()}`);
        if (effects.weeks > 0) effectDescriptions.push(`⏱️ Delay: +${effects.weeks} weeks`);
        if (effects.weeks < 0) effectDescriptions.push(`⏱️ Ahead: ${effects.weeks} weeks`);
        if (effects.quality > 0) effectDescriptions.push(`⭐ Quality: +${effects.quality}`);
        if (effects.quality < 0) effectDescriptions.push(`⭐ Quality: ${effects.quality}`);
        if (effects.reputation > 0) effectDescriptions.push(`🎭 Reputation: +${effects.reputation}`);
        if (effects.reputation < 0) effectDescriptions.push(`🎭 Reputation: ${effects.reputation}`);
        if (effects.scandal > 0) effectDescriptions.push(`📰 Scandal: +${effects.scandal}`);
        if (effects.hype > 0) effectDescriptions.push(`📢 Hype: +${effects.hype}`);
        if (effects.oscarPotential > 0) effectDescriptions.push(`🏆 Oscar Potential: +${effects.oscarPotential}`);
        if (effects.morale > 0) effectDescriptions.push(`😊 Morale: +${effects.morale}`);
        if (effects.morale < 0) effectDescriptions.push(`😞 Morale: ${effects.morale}`);
        if (effects.boxOfficeBoost > 1) effectDescriptions.push(`💵 Box Office: +${Math.round((effects.boxOfficeBoost - 1) * 100)}%`);
        if (effects.boxOfficeBoost < 1) effectDescriptions.push(`💵 Box Office: ${Math.round((effects.boxOfficeBoost - 1) * 100)}%`);
        if (effects.randomOutcome) effectDescriptions.push(`🎲 Random Outcome`);

        return effectDescriptions.join('<br>') || 'Various effects';
    }

    /**
     * Player selects a choice
     */
    function selectChoice(choiceIndex) {
        const context = window.EventSystem._currentEvent;
        if (!context) {
            console.error('[EVENT] No current event context');
            return;
        }

        const { event, film, gameState } = context;
        const choice = event.choices[choiceIndex];

        if (!choice) {
            console.error('[EVENT] Invalid choice index:', choiceIndex);
            return;
        }

        // Apply choice effects
        applyChoiceEffects(choice, film, gameState);

        // Show outcome
        if (window.HollywoodMogul && window.HollywoodMogul.addAlert) {
            window.HollywoodMogul.addAlert({
                type: 'info',
                icon: '🎬',
                message: `${film.title}: ${choice.outcome}`,
                priority: 'high'
            });
        }

        // Close modal
        if (window.HollywoodMogul && window.HollywoodMogul.closeModal) {
            window.HollywoodMogul.closeModal();
        }

        // Clear context
        window.EventSystem._currentEvent = null;

        // Update UI if available
        if (window.HollywoodMogul && window.HollywoodMogul.updateUI) {
            window.HollywoodMogul.updateUI();
        }
    }

    /**
     * Apply effects of player's choice
     */
    function applyChoiceEffects(choice, film, gameState) {
        const effects = choice.effects;

        // Apply to film
        if (effects.budget && window.HollywoodMogul && window.HollywoodMogul.spendCash) {
            window.HollywoodMogul.spendCash(Math.abs(effects.budget));
            film.budgetSpent = (film.budgetSpent || 0) + Math.abs(effects.budget);
        }

        if (effects.weeks) {
            film.weeksRemaining = (film.weeksRemaining || 12) + effects.weeks;
        }

        if (effects.quality) {
            film.quality = Math.max(0, Math.min(100, (film.quality || 50) + effects.quality));
        }

        if (effects.hype) {
            film.hype = Math.max(0, Math.min(100, (film.hype || 50) + effects.hype));
        }

        if (effects.oscarPotential) {
            film.oscarPotential = Math.max(0, Math.min(100, (film.oscarPotential || 50) + effects.oscarPotential));
        }

        if (effects.morale) {
            film.morale = Math.max(0, Math.min(100, (film.morale || 50) + effects.morale));
        }

        if (effects.scandal) {
            film.scandal = (film.scandal || 0) + effects.scandal;
        }

        if (effects.boxOfficeBoost) {
            film.boxOfficeMultiplier = (film.boxOfficeMultiplier || 1.0) * effects.boxOfficeBoost;
        }

        // Apply to game state
        if (effects.reputation && gameState) {
            gameState.reputation = Math.max(0, Math.min(100, (gameState.reputation || 50) + effects.reputation));
        }

        // Handle special effects
        if (effects.filmCancelled) {
            film.status = 'CANCELLED';
            film.active = false;
        }

        if (effects.randomOutcome) {
            handleRandomOutcome(film);
        }

    }

    /**
     * Handle random outcome events
     */
    function handleRandomOutcome(film) {
        const isPositive = Math.random() > 0.5;

        if (isPositive) {
            film.quality = Math.min(100, (film.quality || 50) + 15);
            film.morale = Math.min(100, (film.morale || 50) + 10);
            if (window.HollywoodMogul && window.HollywoodMogul.addAlert) {
                window.HollywoodMogul.addAlert({
                    type: 'success',
                    icon: '✨',
                    message: `${film.title}: The gamble paid off!`,
                    priority: 'medium'
                });
            }
        } else {
            film.quality = Math.max(0, (film.quality || 50) - 15);
            film.morale = Math.max(0, (film.morale || 50) - 15);
            if (window.HollywoodMogul && window.HollywoodMogul.addAlert) {
                window.HollywoodMogul.addAlert({
                    type: 'warning',
                    icon: '⚠️',
                    message: `${film.title}: Things went badly...`,
                    priority: 'medium'
                });
            }
        }
    }

    /**
     * Process weekly events check
     */
    function processWeeklyEventCheck(gameState) {
        // 20% chance per week for a production event
        if (Math.random() < 0.20) {
            generateRandomEvent(gameState);
        }
    }

    /**
     * Get event by ID (for testing/debugging)
     */
    function getEventById(eventId) {
        for (const category in EVENT_DATABASE) {
            const event = EVENT_DATABASE[category].find(e => e.id === eventId);
            if (event) return event;
        }
        return null;
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================
    return {
        generateRandomEvent,
        processWeeklyEventCheck,
        selectChoice,
        getEventById,
        getEligibleEvents,
        triggerEvent,

        // For debugging
        _database: EVENT_DATABASE,
        _currentEvent: null
    };
})();

