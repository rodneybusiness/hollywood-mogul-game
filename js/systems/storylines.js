/**
 * HOLLYWOOD MOGUL - EMERGENT STORYLINE SYSTEM
 * Multi-chapter narrative arcs that create memorable game moments
 *
 * This system generates dynamic storylines based on player actions,
 * creating unique playthroughs with dramatic story arcs
 */

window.StorylineSystem = (function() {
    'use strict';

    // Active storylines in the current game
    let activeStorylines = [];
    let completedStorylines = [];
    let failedStorylines = [];

    /**
     * STORYLINE DATABASE
     * Organized by category: Talent Arcs, Production Sagas, Business Dramas, Historical Dramas
     */
    const STORYLINE_DATABASE = {

        // ============================================
        // TALENT ARC STORIES (15 storylines)
        // ============================================

        rise_of_a_star: {
            id: 'rise_of_a_star',
            category: 'talent',
            name: 'Rise of a Star',
            description: 'An unknown actor in your film becomes a sensation',

            triggerConditions: {
                hasFilmWithUnknownActor: true,
                filmQuality: { min: 75 },
                filmBoxOffice: { min: 150000 }
            },

            chapters: [
                {
                    id: 'discovery',
                    name: 'The Discovery',
                    description: '{ACTOR} has caught the public\'s eye in "{FILM}".',

                    modal: {
                        title: 'A Star is Born?',
                        content: 'Critics and audiences alike are buzzing about {ACTOR}\'s breakout performance in your latest picture. The fan mail is pouring in, and other studios are already circling.\n\nWhat do you do?'
                    },

                    effects: {
                        actorStarPower: 15,
                        studioReputation: 5
                    },

                    choices: [
                        {
                            text: 'Sign them to an exclusive 5-year contract immediately',
                            cost: 25000,
                            effects: {
                                contract: { years: 5, loyalty: 40 },
                                actorStarPower: 5,
                                reputation: 3
                            },
                            nextChapter: 'rising_exclusive'
                        },
                        {
                            text: 'Offer a shorter 2-year deal to see if they\'re the real thing',
                            cost: 15000,
                            effects: {
                                contract: { years: 2, loyalty: 25 },
                                actorStarPower: 5
                            },
                            nextChapter: 'rising_cautious'
                        },
                        {
                            text: 'Let them prove themselves in another film first',
                            effects: {
                                starRisk: 0.4, // 40% chance rival signs them
                                actorStarPower: 3
                            },
                            nextChapter: 'rising_gamble'
                        }
                    ],

                    nextChapter: 'rising'
                },

                {
                    id: 'rising_exclusive',
                    name: 'Building a Star',
                    triggerConditions: { weeksAfterPrevious: 12 },
                    description: '{ACTOR} is now under exclusive contract and their star is rising.',

                    modal: {
                        title: 'Rising Star',
                        content: '{ACTOR} has become one of your most valuable contract players. They\'re receiving offers for major roles, but their agent is pushing for better terms.\n\nTheir current happiness: {HAPPINESS}%'
                    },

                    choices: [
                        {
                            text: 'Give them a raise and better billing (+$500/week)',
                            cost: 10000,
                            effects: {
                                weeklyRateIncrease: 500,
                                loyalty: 20,
                                happiness: 25
                            },
                            nextChapter: 'at_the_top_loyal'
                        },
                        {
                            text: 'Loan them out to another studio for a big picture',
                            effects: {
                                cashBonus: 30000,
                                reputation: 8,
                                loyalty: -10,
                                happiness: -15
                            },
                            nextChapter: 'at_the_top_profit'
                        },
                        {
                            text: 'Hold firm on the original contract terms',
                            effects: {
                                loyalty: -15,
                                happiness: -20,
                                renegotiationRisk: 0.5
                            },
                            nextChapter: 'contract_conflict'
                        }
                    ]
                },

                {
                    id: 'rising_cautious',
                    name: 'Two-Year Deal',
                    triggerConditions: { weeksAfterPrevious: 12 },
                    description: '{ACTOR} is proving their worth, but the contract expires soon.',

                    modal: {
                        title: 'Contract Expiring',
                        content: '{ACTOR}\'s two-year deal is almost up. They\'ve become a major draw, and multiple studios are making offers. You need to act fast.'
                    },

                    choices: [
                        {
                            text: 'Offer a lucrative 7-year extension',
                            cost: 50000,
                            effects: {
                                contract: { years: 7, loyalty: 35 },
                                weeklyRateIncrease: 1000
                            },
                            nextChapter: 'at_the_top_loyal'
                        },
                        {
                            text: 'Match other offers but keep it short (3 years)',
                            cost: 35000,
                            effects: {
                                contract: { years: 3, loyalty: 20 },
                                weeklyRateIncrease: 750
                            },
                            nextChapter: 'at_the_top_profit'
                        },
                        {
                            text: 'Let them go - they\'re too expensive now',
                            effects: {
                                loseActor: true,
                                reputation: -10
                            },
                            nextChapter: 'failure_lost_star'
                        }
                    ]
                },

                {
                    id: 'rising_gamble',
                    name: 'The Gamble',
                    triggerConditions: { weeksAfterPrevious: 8 },
                    description: 'Your gamble on {ACTOR} pays off... or doesn\'t.',

                    modal: {
                        title: 'The Wait',
                        content: '{ACTOR} has been considering multiple offers while you waited to see if they were worth signing...'
                    },

                    // This chapter has conditional outcomes based on starRisk roll
                    conditionalOutcome: {
                        condition: 'starRisk',
                        onSuccess: {
                            modal: { content: '{ACTOR} has chosen to work with you again! Their loyalty is proven.' },
                            effects: { loyalty: 30, actorStarPower: 10 },
                            nextChapter: 'rising_exclusive'
                        },
                        onFailure: {
                            modal: { content: 'Bad news: {ACTOR} has signed with a rival studio. You missed your chance.' },
                            effects: { reputation: -15, loseActor: true },
                            nextChapter: 'failure_lost_star'
                        }
                    }
                },

                {
                    id: 'at_the_top_loyal',
                    name: 'A-List Star',
                    triggerConditions: {
                        actorStarPower: { min: 85 },
                        weeksAfterPrevious: 20
                    },
                    description: '{ACTOR} is now a major Hollywood star, and they\'re loyal to you.',
                    resolution: true,

                    modal: {
                        title: 'Star Power',
                        content: '{ACTOR} has become one of Hollywood\'s biggest names. Thanks to your careful management and investment in their career, they\'re a loyal contract player who brings prestige to every picture.\n\nTheir films consistently draw audiences, and their loyalty to your studio is unshakeable.'
                    },

                    effects: {
                        achievement: 'star_maker',
                        permanentBonus: {
                            actorLoyalty: 50,
                            studioReputation: 15
                        }
                    }
                },

                {
                    id: 'at_the_top_profit',
                    name: 'Money Machine',
                    triggerConditions: {
                        actorStarPower: { min: 80 },
                        weeksAfterPrevious: 20
                    },
                    description: '{ACTOR} is a major star, though the relationship is purely business.',
                    resolution: true,

                    modal: {
                        title: 'Box Office Gold',
                        content: '{ACTOR} has become a reliable money-maker. While your relationship is professional rather than warm, they understand the value of the partnership.\n\nTheir films are profitable, but their loyalty is... transactional.'
                    },

                    effects: {
                        achievement: 'profit_minded',
                        permanentBonus: {
                            actorLoyalty: 20,
                            boxOfficeBonus: 0.1
                        }
                    }
                },

                {
                    id: 'contract_conflict',
                    name: 'Holdout',
                    triggerConditions: { weeksAfterPrevious: 6 },
                    description: '{ACTOR} is refusing to report for their next picture.',

                    modal: {
                        title: 'Contract Dispute',
                        content: '{ACTOR}\'s agent has sent a letter: their client will not report for work until the contract is renegotiated. This is costing you money and reputation every week.\n\nWhat do you do?'
                    },

                    choices: [
                        {
                            text: 'Give in and renegotiate generous terms',
                            cost: 40000,
                            effects: {
                                happiness: 30,
                                loyalty: 15,
                                weeklyRateIncrease: 1000,
                                reputation: -5
                            },
                            nextChapter: 'at_the_top_loyal'
                        },
                        {
                            text: 'Suspend them without pay and take legal action',
                            cost: 15000,
                            effects: {
                                happiness: -50,
                                loyalty: -40,
                                reputation: -15,
                                actorSuspended: 12 // weeks
                            },
                            nextChapter: 'legal_battle'
                        },
                        {
                            text: 'Release them from contract to preserve reputation',
                            effects: {
                                loseActor: true,
                                reputation: 5
                            },
                            nextChapter: 'failure_lost_star'
                        }
                    ]
                },

                {
                    id: 'legal_battle',
                    name: 'In the Courts',
                    triggerConditions: { weeksAfterPrevious: 10 },
                    description: 'The contract dispute has gone to court.',
                    resolution: true,

                    modal: {
                        title: 'Legal Resolution',
                        content: 'After weeks in court, the judge has ruled in your favor. {ACTOR} must honor their contract.\n\nHowever, the relationship is permanently damaged. They fulfill their obligations mechanically, but the magic is gone.'
                    },

                    effects: {
                        happiness: -30,
                        loyalty: -30,
                        reputation: -10,
                        actorEfficiency: -25 // They phone it in
                    }
                },

                {
                    id: 'failure_lost_star',
                    name: 'The One That Got Away',
                    failure: true,
                    description: '{ACTOR} left to work for another studio.',

                    modal: {
                        title: 'Missed Opportunity',
                        content: 'You watch as {ACTOR} becomes a major star... for someone else. Every time you see their name on a marquee, you remember they could have been yours.'
                    }
                }
            ]
        },

        fall_from_grace: {
            id: 'fall_from_grace',
            category: 'talent',
            name: 'Fall from Grace',
            description: 'A major star\'s career and personal life spiral downward',

            triggerConditions: {
                hasAListActor: true,
                actorStarPower: { min: 80 }
            },

            chapters: [
                {
                    id: 'first_signs',
                    name: 'Troubling Signs',
                    description: '{ACTOR} has been showing up late to set and seems distracted.',

                    modal: {
                        title: 'Cause for Concern',
                        content: 'Your director reports that {ACTOR} has been arriving late and seems unfocused. There are rumors of personal troubles.\n\nThis is your biggest star - handle with care.'
                    },

                    choices: [
                        {
                            text: 'Have a private conversation and offer support',
                            effects: {
                                loyalty: 15,
                                happiness: 10,
                                personalIssuesReduced: 0.5
                            },
                            nextChapter: 'intervention'
                        },
                        {
                            text: 'Issue a stern warning about professionalism',
                            effects: {
                                loyalty: -10,
                                happiness: -15,
                                filmQuality: 5 // They shape up temporarily
                            },
                            nextChapter: 'downward_spiral'
                        },
                        {
                            text: 'Look the other way - they\'re a star',
                            effects: {
                                reputation: -5,
                                personalIssuesWorsen: 0.3
                            },
                            nextChapter: 'scandal_breaks'
                        }
                    ]
                },

                {
                    id: 'intervention',
                    name: 'Helping Hand',
                    triggerConditions: { weeksAfterPrevious: 6 },
                    description: 'Your support helps {ACTOR} face their demons.',

                    modal: {
                        title: 'Recovery',
                        content: '{ACTOR} opens up about their struggles. With your studio\'s support, they agree to seek help.\n\nThis will require them to take time off, but it might save their career.'
                    },

                    choices: [
                        {
                            text: 'Pay for private treatment facility ($30,000)',
                            cost: 30000,
                            effects: {
                                loyalty: 40,
                                happiness: 30,
                                actorUnavailable: 12, // weeks
                                recoveryChance: 0.8
                            },
                            nextChapter: 'recovery'
                        },
                        {
                            text: 'Give them time off but they pay for treatment',
                            effects: {
                                loyalty: 20,
                                happiness: 15,
                                actorUnavailable: 8,
                                recoveryChance: 0.6
                            },
                            nextChapter: 'recovery'
                        },
                        {
                            text: 'This is too much - release them from contract',
                            effects: {
                                loseActor: true,
                                reputation: -10
                            },
                            nextChapter: 'failure_abandoned'
                        }
                    ]
                },

                {
                    id: 'downward_spiral',
                    name: 'Worse',
                    triggerConditions: { weeksAfterPrevious: 4 },
                    description: '{ACTOR}\'s problems are getting worse.',

                    modal: {
                        title: 'Deteriorating',
                        content: 'Your tough love approach backfired. {ACTOR} is spiraling - missing days, erratic behavior. The press is starting to notice.'
                    },

                    choices: [
                        {
                            text: 'Step in now with support and treatment',
                            cost: 35000,
                            effects: {
                                loyalty: 15,
                                recoveryChance: 0.6,
                                actorUnavailable: 16
                            },
                            nextChapter: 'recovery'
                        },
                        {
                            text: 'Suspend them and let them hit rock bottom',
                            effects: {
                                loyalty: -30,
                                happiness: -40,
                                reputation: -15,
                                scandalgRisk: 0.7
                            },
                            nextChapter: 'scandal_breaks'
                        }
                    ]
                },

                {
                    id: 'scandal_breaks',
                    name: 'Public Scandal',
                    triggerConditions: { weeksAfterPrevious: 3 },
                    description: '{ACTOR}\'s problems have become public.',

                    modal: {
                        title: 'Front Page News',
                        content: 'The papers are running lurid stories about {ACTOR}\'s behavior. Photos of them leaving nightclubs. Rumors of addiction. Your studio\'s reputation is on the line.'
                    },

                    choices: [
                        {
                            text: 'Stand by them publicly and provide support',
                            cost: 40000,
                            effects: {
                                reputation: -20,
                                loyalty: 50,
                                recoveryChance: 0.7,
                                actorUnavailable: 20
                            },
                            nextChapter: 'recovery'
                        },
                        {
                            text: 'Cut ties immediately to protect the studio',
                            effects: {
                                loseActor: true,
                                reputation: 5,
                                industryGoodwill: -25
                            },
                            nextChapter: 'failure_abandoned'
                        }
                    ]
                },

                {
                    id: 'recovery',
                    name: 'The Long Road Back',
                    triggerConditions: { weeksAfterPrevious: 16 },
                    resolution: true,

                    modal: {
                        title: 'Comeback',
                        content: '{ACTOR} emerges from treatment. They\'re sober, focused, and grateful for your support.\n\nThe press loves a redemption story, and so does the public.'
                    },

                    conditionalOutcome: {
                        condition: 'recoveryChance',
                        onSuccess: {
                            modal: { content: '{ACTOR} is back and better than ever. Their performance in their comeback picture is the best work of their career.' },
                            effects: {
                                actorStarPower: 20,
                                loyalty: 60,
                                reputation: 25,
                                achievement: 'saved_a_star',
                                filmQualityBonus: 15
                            }
                        },
                        onFailure: {
                            modal: { content: '{ACTOR} relapsed. Despite your support, they couldn\'t overcome their demons.' },
                            effects: {
                                loseActor: true,
                                reputation: -15,
                                loyalty: 0
                            },
                            nextChapter: 'failure_lost_battle'
                        }
                    }
                },

                {
                    id: 'failure_abandoned',
                    name: 'Cut Loose',
                    failure: true,
                    description: 'You abandoned {ACTOR} when they needed help most.',

                    modal: {
                        title: 'Cold Business',
                        content: 'You made the business decision to cut ties with {ACTOR}. Your studio is protected, but you\'ll always wonder if you could have saved a great talent.'
                    }
                },

                {
                    id: 'failure_lost_battle',
                    name: 'Tragic End',
                    failure: true,
                    description: 'Despite your efforts, {ACTOR} couldn\'t be saved.',

                    modal: {
                        title: 'Tragedy',
                        content: 'You did everything you could, but {ACTOR} couldn\'t overcome their demons. It\'s a sobering reminder that not every story has a happy ending.'
                    },

                    effects: {
                        achievement: 'tried_to_help'
                    }
                }
            ]
        },

        the_comeback: {
            id: 'the_comeback',
            category: 'talent',
            name: 'The Comeback',
            description: 'A washed-up former star seeks redemption',

            triggerConditions: {
                studioReputation: { min: 50 },
                hasProducedFilms: { min: 5 }
            },

            chapters: [
                {
                    id: 'the_offer',
                    name: 'An Unexpected Visitor',
                    description: 'A once-great star asks for a chance.',

                    modal: {
                        title: 'The Old Star',
                        content: '{ACTOR} used to be one of Hollywood\'s biggest names. But that was years ago. Now they\'re in your office, hat in hand, asking for a role - any role.\n\n"I can still do it," they insist. "Just give me one more shot."'
                    },

                    choices: [
                        {
                            text: 'Cast them in a prestige picture - bet big on them',
                            cost: 15000,
                            effects: {
                                filmBudgetIncrease: 20000,
                                loyalty: 60,
                                comebackQuality: 'major_role'
                            },
                            nextChapter: 'major_role'
                        },
                        {
                            text: 'Give them a small supporting role - test the waters',
                            cost: 5000,
                            effects: {
                                loyalty: 35,
                                comebackQuality: 'supporting'
                            },
                            nextChapter: 'supporting_role'
                        },
                        {
                            text: 'It\'s too risky - turn them down gently',
                            effects: {
                                reputation: -5
                            },
                            nextChapter: 'failure_no_chance'
                        }
                    ]
                },

                {
                    id: 'major_role',
                    name: 'The Big Bet',
                    triggerConditions: { weeksAfterPrevious: 12 },
                    description: '{ACTOR} is carrying your picture. The pressure is immense.',

                    modal: {
                        title: 'All Eyes On Them',
                        content: 'You\'ve built an entire picture around {ACTOR}\'s comeback. The budget is significant. The cast is strong. The script is solid.\n\nEverything depends on whether they can still deliver.'
                    },

                    conditionalOutcome: {
                        condition: 'random', // 60% success rate
                        probability: 0.6,
                        onSuccess: {
                            modal: { content: 'They\'ve still got it! {ACTOR} delivers a powerhouse performance that reminds everyone why they were a star.' },
                            effects: {
                                filmQuality: 25,
                                actorStarPower: 40,
                                reputation: 20,
                                boxOfficeBonus: 0.3
                            },
                            nextChapter: 'triumph'
                        },
                        onFailure: {
                            modal: { content: '{ACTOR} tried their best, but the years show. The performance is... adequate. Not the comeback anyone hoped for.' },
                            effects: {
                                filmQuality: -10,
                                reputation: -10,
                                boxOfficePenalty: 0.2
                            },
                            nextChapter: 'disappointment'
                        }
                    }
                },

                {
                    id: 'supporting_role',
                    name: 'Proving Ground',
                    triggerConditions: { weeksAfterPrevious: 10 },
                    description: '{ACTOR} makes the most of their small role.',

                    modal: {
                        title: 'Scene Stealer',
                        content: 'Despite limited screen time, {ACTOR} brings depth and nuance to every scene. Critics are taking notice.\n\n"Give {ACTOR} a real role and watch what happens," one review reads.'
                    },

                    choices: [
                        {
                            text: 'Cast them as the lead in your next prestige picture',
                            cost: 25000,
                            effects: {
                                loyalty: 50,
                                comebackQuality: 'second_chance'
                            },
                            nextChapter: 'second_chance'
                        },
                        {
                            text: 'Keep them in supporting roles - play it safe',
                            cost: 8000,
                            effects: {
                                loyalty: 25,
                                steadyIncome: true
                            },
                            nextChapter: 'character_actor'
                        }
                    ]
                },

                {
                    id: 'second_chance',
                    name: 'The Second Act',
                    triggerConditions: { weeksAfterPrevious: 14 },
                    description: '{ACTOR} gets their big second chance.',
                    resolution: true,

                    modal: {
                        title: 'Redemption',
                        content: 'You gave {ACTOR} a second chance, and they made the most of it. Their performance is generating Oscar buzz.\n\nYou didn\'t just produce a hit - you restored a career.'
                    },

                    effects: {
                        filmQuality: 30,
                        actorStarPower: 50,
                        reputation: 25,
                        achievement: 'comeback_kid',
                        oscarPotential: 35
                    }
                },

                {
                    id: 'character_actor',
                    name: 'A New Path',
                    triggerConditions: { weeksAfterPrevious: 20 },
                    resolution: true,

                    modal: {
                        title: 'Reinvention',
                        content: '{ACTOR} has found a new niche as a character actor. They may not be the star anymore, but they bring quality to every picture.\n\nSometimes the best comebacks aren\'t about reclaiming past glory - they\'re about finding a new place to thrive.'
                    },

                    effects: {
                        permanentBonus: { characterActorAvailable: true },
                        reputation: 15,
                        achievement: 'character_building'
                    }
                },

                {
                    id: 'triumph',
                    name: 'Against All Odds',
                    resolution: true,
                    description: '{ACTOR}\'s comeback is the talk of Hollywood.',

                    modal: {
                        title: 'Hollywood Ending',
                        content: 'Against all odds, {ACTOR} has mounted one of the greatest comebacks in Hollywood history. Their performance is generating Oscar buzz, and every studio wants them.\n\nYou took a chance when no one else would, and it paid off spectacularly.'
                    },

                    effects: {
                        achievement: 'miracle_worker',
                        reputation: 30,
                        actorStarPower: 70,
                        oscarPotential: 40,
                        industryGoodwill: 40
                    }
                },

                {
                    id: 'disappointment',
                    name: 'Noble Failure',
                    resolution: true,
                    description: 'The comeback attempt fell short.',

                    modal: {
                        title: 'Not Every Story Has a Happy Ending',
                        content: '{ACTOR} gave it everything they had, but sometimes the moment passes. The film underperforms, and the comeback fizzles.\n\nStill, you gave them a chance. That means something.'
                    },

                    effects: {
                        reputation: -5,
                        achievement: 'gave_them_a_shot'
                    }
                },

                {
                    id: 'failure_no_chance',
                    name: 'The Road Not Taken',
                    failure: true,
                    description: 'You never gave {ACTOR} their shot.',

                    modal: {
                        title: 'What If?',
                        content: 'You turned {ACTOR} down. You\'ll never know if they could have made a triumphant return. Sometimes you wonder about that meeting in your office...'
                    }
                }
            ]
        },

        rival_stars: {
            id: 'rival_stars',
            category: 'talent',
            name: 'The Rivalry',
            description: 'Two of your stars are competing for the same roles',

            triggerConditions: {
                hasMultipleStars: { min: 2 },
                sameGenreActors: true
            },

            chapters: [
                {
                    id: 'first_conflict',
                    name: 'Competition',
                    description: '{ACTOR1} and {ACTOR2} both want the lead in your next picture.',

                    modal: {
                        title: 'Competing Stars',
                        content: 'Both {ACTOR1} and {ACTOR2} are perfect for the lead role in "{FILM}". Both are demanding it. Both are threatening to walk if they don\'t get it.\n\nYou can only cast one.'
                    },

                    choices: [
                        {
                            text: 'Cast {ACTOR1} - they\'re the better fit',
                            effects: {
                                actor1: { happiness: 20, loyalty: 10 },
                                actor2: { happiness: -30, loyalty: -20, rivalryIntensity: 40 }
                            },
                            nextChapter: 'escalation'
                        },
                        {
                            text: 'Cast {ACTOR2} - they\'ll bring more to the role',
                            effects: {
                                actor2: { happiness: 20, loyalty: 10 },
                                actor1: { happiness: -30, loyalty: -20, rivalryIntensity: 40 }
                            },
                            nextChapter: 'escalation'
                        },
                        {
                            text: 'Cast neither - develop a different project for each',
                            cost: 40000,
                            effects: {
                                actor1: { happiness: 10 },
                                actor2: { happiness: 10 },
                                rivalryIntensity: 20
                            },
                            nextChapter: 'separate_paths'
                        }
                    ]
                },

                {
                    id: 'escalation',
                    name: 'Feud',
                    triggerConditions: { weeksAfterPrevious: 8 },
                    description: 'The rejected star is making trouble.',

                    modal: {
                        title: 'Bad Blood',
                        content: 'The rivalry has turned ugly. Snide comments to the press. Refusing to attend the same events. Your contract player is actively undermining their rival.\n\nThis is affecting both their performances.'
                    },

                    choices: [
                        {
                            text: 'Force them to work together in a two-hander',
                            cost: 15000,
                            effects: {
                                resolution: 'forced_partnership',
                                bothActors: { happiness: -10 }
                            },
                            nextChapter: 'forced_together'
                        },
                        {
                            text: 'Keep them separated and manage both carefully',
                            cost: 10000,
                            effects: {
                                resolution: 'managed_rivalry',
                                weeklyManagementCost: 500
                            },
                            nextChapter: 'separate_paths'
                        },
                        {
                            text: 'Release one from their contract',
                            effects: {
                                loseOneActor: true,
                                reputation: -8
                            },
                            nextChapter: 'one_stays'
                        }
                    ]
                },

                {
                    id: 'forced_together',
                    name: 'Oil and Water',
                    triggerConditions: { weeksAfterPrevious: 12 },
                    resolution: true,

                    modal: {
                        title: 'On-Screen Chemistry',
                        content: 'You forced {ACTOR1} and {ACTOR2} to star opposite each other. The tension was palpable on set...'
                    },

                    conditionalOutcome: {
                        condition: 'random',
                        probability: 0.4, // 40% chance they work it out
                        onSuccess: {
                            modal: { content: '...and it created magic! Their real rivalry translates to incredible on-screen chemistry. The film is a smash, and they\'ve gained respect for each other.' },
                            effects: {
                                filmQuality: 35,
                                bothActors: { loyalty: 15, happiness: 20 },
                                reputation: 20,
                                achievement: 'turned_rivals_to_friends',
                                boxOfficeBonus: 0.4
                            }
                        },
                        onFailure: {
                            modal: { content: '...and it was a disaster. They could barely be in the same room. The film suffers from their mutual contempt. One of them quits the studio in disgust.' },
                            effects: {
                                filmQuality: -25,
                                loseOneActor: true,
                                reputation: -20,
                                boxOfficePenalty: 0.3
                            }
                        }
                    }
                },

                {
                    id: 'separate_paths',
                    name: 'Managed Competition',
                    triggerConditions: { weeksAfterPrevious: 20 },
                    resolution: true,

                    modal: {
                        title: 'Professional Distance',
                        content: 'You\'ve carefully managed both stars, keeping them in separate pictures and feeding both their egos. It\'s expensive and exhausting, but both remain productive.\n\nTheir rivalry still simmers, but it\'s contained. For now.'
                    },

                    effects: {
                        bothActors: { happiness: 15 },
                        reputation: 10,
                        achievement: 'diplomatic_studio_head',
                        ongoingCost: 500 // weekly
                    }
                },

                {
                    id: 'one_stays',
                    name: 'Victor',
                    triggerConditions: { weeksAfterPrevious: 4 },
                    resolution: true,

                    modal: {
                        title: 'The Remaining Star',
                        content: 'You released one star to end the feud. The remaining star is satisfied but also knows you\'ll cut talent when necessary.\n\nThe rivalry is over, but at a cost.'
                    },

                    effects: {
                        remainingActor: { happiness: 25, loyalty: -10 },
                        reputation: -10,
                        achievement: 'tough_choices'
                    }
                }
            ]
        },

        mentor_and_protege: {
            id: 'mentor_and_protege',
            category: 'talent',
            name: 'Mentor and Protégé',
            description: 'An aging star takes a newcomer under their wing',

            triggerConditions: {
                hasVeteranActor: true,
                hasNewActor: true,
                similarGenres: true
            },

            chapters: [
                {
                    id: 'the_partnership',
                    name: 'Unlikely Pair',
                    description: '{VETERAN} has taken an interest in {NEWCOMER}.',

                    modal: {
                        title: 'Mentorship',
                        content: 'Veteran star {VETERAN} has approached you about working with newcomer {NEWCOMER}.\n\n"I see something special in this kid," {VETERAN} says. "Let me show them the ropes."'
                    },

                    choices: [
                        {
                            text: 'Cast them together in a father-figure story',
                            cost: 20000,
                            effects: {
                                filmQuality: 15,
                                newcomer: { starPower: 20, loyalty: 30 },
                                veteran: { happiness: 25 }
                            },
                            nextChapter: 'mentorship_blossoms'
                        },
                        {
                            text: 'Let them work together but in separate films',
                            cost: 5000,
                            effects: {
                                newcomer: { starPower: 10, loyalty: 15 },
                                veteran: { happiness: 15 }
                            },
                            nextChapter: 'slow_growth'
                        },
                        {
                            text: 'Keep them separate - don\'t want newcomer depending on veteran',
                            effects: {
                                veteran: { happiness: -15 }
                            },
                            nextChapter: 'failure_refused'
                        }
                    ]
                },

                {
                    id: 'mentorship_blossoms',
                    name: 'Passing the Torch',
                    triggerConditions: { weeksAfterPrevious: 12 },
                    description: '{NEWCOMER} is learning from the best.',

                    modal: {
                        title: 'Learning',
                        content: 'On set, you watch {VETERAN} coaching {NEWCOMER} between takes. The younger actor is absorbing everything - technique, presence, professionalism.\n\nThe chemistry between them is elevating the entire picture.'
                    },

                    effects: {
                        filmQuality: 20,
                        newcomer: { starPower: 25, acting_skill: 15 },
                        veteran: { happiness: 30, legacy: true }
                    },

                    nextChapter: 'the_succession'
                },

                {
                    id: 'slow_growth',
                    name: 'Gradual Development',
                    triggerConditions: { weeksAfterPrevious: 16 },
                    description: '{NEWCOMER} is improving steadily.',

                    modal: {
                        title: 'Steady Progress',
                        content: '{VETERAN}\'s mentorship is paying off. {NEWCOMER} is more confident, more skilled. The growth is gradual but real.'
                    },

                    effects: {
                        newcomer: { starPower: 15, acting_skill: 10 }
                    },

                    nextChapter: 'the_succession'
                },

                {
                    id: 'the_succession',
                    name: 'The Next Generation',
                    triggerConditions: { weeksAfterPrevious: 20 },
                    resolution: true,

                    modal: {
                        title: 'Legacy',
                        content: '{VETERAN} is talking about retirement. But they\'re satisfied - they\'ve trained their successor.\n\n{NEWCOMER} has become a star in their own right, carrying on {VETERAN}\'s legacy. You\'ve witnessed something special: the passing of the torch from one generation to the next.'
                    },

                    effects: {
                        veteran: { retirement: true, legacy_bonus: 20 },
                        newcomer: { starPower: 40, loyalty: 50 },
                        reputation: 30,
                        achievement: 'legacy_builder',
                        permanentBonus: { mentorship_tradition: true }
                    }
                },

                {
                    id: 'failure_refused',
                    name: 'Missed Opportunity',
                    failure: true,
                    description: 'You passed on the mentorship opportunity.',

                    modal: {
                        title: 'Regret',
                        content: 'You kept them separate. {VETERAN} eventually retired, and {NEWCOMER} developed elsewhere. You wonder what might have been if you\'d let them work together.'
                    }
                }
            ]
        },

        // ============================================
        // PRODUCTION SAGA STORIES (10 storylines)
        // ============================================

        troubled_production: {
            id: 'troubled_production',
            category: 'production',
            name: 'The Troubled Production',
            description: 'Everything that can go wrong does go wrong',

            triggerConditions: {
                filmInProduction: true,
                filmBudget: { min: 100000 }
            },

            chapters: [
                {
                    id: 'first_problems',
                    name: 'Bad Omens',
                    description: 'Your big picture is having problems from day one.',

                    modal: {
                        title: 'Rough Start',
                        content: 'Production on "{FILM}" has been plagued with problems from the beginning. Weather delays. Equipment failures. Script issues.\n\nYour director is worried. Your producer is over budget. It\'s only week two.'
                    },

                    effects: {
                        filmQuality: -10,
                        budgetOverrun: 15000,
                        weeksDelay: 2
                    },

                    choices: [
                        {
                            text: 'Shut down production and regroup ($20,000)',
                            cost: 20000,
                            effects: {
                                weeksDelay: 4,
                                morale: 15,
                                problemsReduced: 0.5
                            },
                            nextChapter: 'regrouping'
                        },
                        {
                            text: 'Push through - we\'re committed now',
                            effects: {
                                morale: -15,
                                problemsIncrease: 0.3
                            },
                            nextChapter: 'crisis_deepens'
                        },
                        {
                            text: 'Replace the director',
                            cost: 25000,
                            effects: {
                                newDirector: true,
                                morale: -20,
                                weeksDelay: 3,
                                qualityUnknown: true
                            },
                            nextChapter: 'new_leadership'
                        }
                    ]
                },

                {
                    id: 'regrouping',
                    name: 'Back to Basics',
                    triggerConditions: { weeksAfterPrevious: 4 },
                    description: 'The break helped sort out the problems.',

                    modal: {
                        title: 'Fresh Start',
                        content: 'The shutdown gave everyone time to fix what was broken. New script pages. Better planning. Rested cast and crew.\n\nProduction resumes with renewed energy.'
                    },

                    effects: {
                        filmQuality: 20,
                        morale: 25
                    },

                    nextChapter: 'hard_fought_finish'
                },

                {
                    id: 'crisis_deepens',
                    name: 'Worse',
                    triggerConditions: { weeksAfterPrevious: 3 },
                    description: 'The problems are spiraling out of control.',

                    modal: {
                        title: 'Disaster',
                        content: 'Pushing forward was a mistake. The lead actor got injured. A key set burned down. The budget is blown. Morale is in the toilet.\n\nThis production is in serious trouble.'
                    },

                    effects: {
                        filmQuality: -25,
                        budgetOverrun: 40000,
                        weeksDelay: 6,
                        morale: -30
                    },

                    choices: [
                        {
                            text: 'Throw money at it to finish ($60,000)',
                            cost: 60000,
                            effects: {
                                filmCompletes: true,
                                reputation: -10
                            },
                            nextChapter: 'expensive_finish'
                        },
                        {
                            text: 'Cut our losses and cancel the picture',
                            effects: {
                                filmCancelled: true,
                                reputation: -25,
                                lossReduction: 0.5
                            },
                            nextChapter: 'failure_cancelled'
                        }
                    ]
                },

                {
                    id: 'new_leadership',
                    name: 'New Direction',
                    triggerConditions: { weeksAfterPrevious: 3 },
                    description: 'The new director is making changes.',

                    conditionalOutcome: {
                        condition: 'random',
                        probability: 0.5,
                        onSuccess: {
                            modal: {
                                title: 'Turnaround',
                                content: 'The new director brings fresh vision and firm leadership. They get the production back on track and deliver something special.'
                            },
                            effects: {
                                filmQuality: 25,
                                morale: 20,
                                reputation: 15
                            },
                            nextChapter: 'saved_by_vision'
                        },
                        onFailure: {
                            modal: {
                                title: 'Different Problems',
                                content: 'The new director has a different vision... which means reshoots, script changes, and more delays. You\'ve traded one set of problems for another.'
                            },
                            effects: {
                                filmQuality: -15,
                                budgetOverrun: 35000,
                                weeksDelay: 5
                            },
                            nextChapter: 'crisis_deepens'
                        }
                    }
                },

                {
                    id: 'hard_fought_finish',
                    name: 'Finished',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 16 },

                    modal: {
                        title: 'Against the Odds',
                        content: '"{FILM}" is finally complete. It wasn\'t pretty, but you got it done. The picture is good - maybe even better because of what everyone went through.\n\nSometimes the hardest productions create the best work.'
                    },

                    effects: {
                        filmQuality: 15,
                        reputation: 20,
                        achievement: 'crisis_manager',
                        teamBondingBonus: 20
                    }
                },

                {
                    id: 'expensive_finish',
                    name: 'Expensive Lesson',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 10 },

                    modal: {
                        title: 'Done',
                        content: 'You threw enough money at the problem to finish the picture. It\'s complete, but at what cost? The budget is astronomical, and the quality doesn\'t justify the expense.\n\nYou finished - but at a steep price.'
                    },

                    effects: {
                        filmQuality: -5,
                        reputation: -10,
                        achievement: 'survived_disaster'
                    }
                },

                {
                    id: 'saved_by_vision',
                    name: 'Rescued',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 14 },

                    modal: {
                        title: 'Miracle',
                        content: 'The new director saved your troubled production and turned it into something remarkable. What looked like a disaster became a triumph.\n\nHollywood loves these stories.'
                    },

                    effects: {
                        filmQuality: 30,
                        reputation: 30,
                        achievement: 'phoenix_from_ashes',
                        oscarPotential: 25
                    }
                },

                {
                    id: 'failure_cancelled',
                    name: 'Abandoned',
                    failure: true,

                    modal: {
                        title: 'Cancelled',
                        content: 'You pulled the plug on "{FILM}". It\'s a massive loss - money wasted, time lost, reputations damaged. But at least you stopped the bleeding before it got worse.'
                    },

                    effects: {
                        reputation: -25,
                        achievement: 'knew_when_to_fold'
                    }
                }
            ]
        },

        unexpected_hit: {
            id: 'unexpected_hit',
            category: 'production',
            name: 'The Unexpected Hit',
            description: 'A B-movie becomes a phenomenon',

            triggerConditions: {
                hasLowBudgetFilm: true,
                filmBudget: { max: 50000 },
                filmQuality: { min: 65 }
            },

            chapters: [
                {
                    id: 'modest_release',
                    name: 'Limited Expectations',
                    description: 'You release a modest picture with low expectations.',

                    modal: {
                        title: 'B-Picture Release',
                        content: '"{FILM}" was a quick, cheap production. You\'re releasing it in a handful of theaters just to get your money back.\n\nNobody expects much from this one.'
                    },

                    effects: {
                        theaterCount: { initial: 50 },
                        marketingBudget: { low: true }
                    },

                    nextChapter: 'word_spreads'
                },

                {
                    id: 'word_spreads',
                    name: 'Buzz',
                    triggerConditions: { weeksAfterPrevious: 2 },
                    description: 'Audiences are responding to your little picture.',

                    modal: {
                        title: 'Unexpected Response',
                        content: 'Something strange is happening. "{FILM}" is playing to packed houses. Word of mouth is strong. Exhibitors are calling for more prints.\n\nYour B-picture is becoming a hit!'
                    },

                    choices: [
                        {
                            text: 'Expand to 200+ theaters immediately',
                            cost: 30000,
                            effects: {
                                theaterExpansion: 'wide',
                                marketingPush: 'major',
                                boxOfficeMultiplier: 3.0
                            },
                            nextChapter: 'phenomenon'
                        },
                        {
                            text: 'Gradual expansion to 150 theaters',
                            cost: 15000,
                            effects: {
                                theaterExpansion: 'moderate',
                                marketingPush: 'steady',
                                boxOfficeMultiplier: 2.0
                            },
                            nextChapter: 'solid_hit'
                        },
                        {
                            text: 'Play it safe - slow expansion',
                            cost: 8000,
                            effects: {
                                theaterExpansion: 'cautious',
                                boxOfficeMultiplier: 1.5
                            },
                            nextChapter: 'missed_potential'
                        }
                    ]
                },

                {
                    id: 'phenomenon',
                    name: 'Cultural Moment',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 6 },

                    modal: {
                        title: 'Sensation',
                        content: '"{FILM}" has become a cultural phenomenon. It\'s the picture everyone is talking about. Made for peanuts, it\'s earning a fortune.\n\nYou gambled on a wide expansion and won big. This is the kind of success story Hollywood dreams about.'
                    },

                    effects: {
                        boxOfficeBonus: 0.5,
                        reputation: 35,
                        achievement: 'sleeper_hit',
                        castStarPowerBoost: 40,
                        sequelOpportunity: true
                    }
                },

                {
                    id: 'solid_hit',
                    name: 'Success',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 8 },

                    modal: {
                        title: 'Profitable Picture',
                        content: '"{FILM}" turned out to be a solid hit. It made several times its budget and boosted your reputation. \n\nNot every B-picture becomes a phenomenon, but this one definitely paid off.'
                    },

                    effects: {
                        boxOfficeBonus: 0.3,
                        reputation: 20,
                        achievement: 'savvy_producer',
                        castStarPowerBoost: 20
                    }
                },

                {
                    id: 'missed_potential',
                    name: 'Cautious',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 10 },

                    modal: {
                        title: 'Missed Opportunity',
                        content: '"{FILM}" was successful in limited release, but you played it too safe. By the time you expanded, the moment had passed.\n\nIt\'s profitable, but you left money on the table.'
                    },

                    effects: {
                        boxOfficeBonus: 0.15,
                        reputation: 10,
                        achievement: 'left_money_on_table'
                    }
                }
            ]
        },

        the_masterpiece: {
            id: 'the_masterpiece',
            category: 'production',
            name: 'The Masterpiece',
            description: 'Against all odds, you create art',

            triggerConditions: {
                filmQuality: { min: 90 },
                studioReputation: { min: 60 }
            },

            chapters: [
                {
                    id: 'recognition',
                    name: 'Something Special',
                    description: 'Everyone on set knows this film is special.',

                    modal: {
                        title: 'Magic',
                        content: 'As filming wraps on "{FILM}", there\'s a feeling on set you\'ve never experienced before. The cast. The crew. The director. Everyone knows they\'ve created something extraordinary.\n\nThis could be the picture that defines your career.'
                    },

                    effects: {
                        oscarPotential: 40,
                        morale: 50
                    },

                    choices: [
                        {
                            text: 'Massive Oscar campaign ($50,000)',
                            cost: 50000,
                            effects: {
                                oscarBoost: 30,
                                prestige: 'maximum',
                                nominationChance: 0.9
                            },
                            nextChapter: 'oscar_campaign'
                        },
                        {
                            text: 'Modest campaign - let the film speak for itself',
                            cost: 20000,
                            effects: {
                                oscarBoost: 15,
                                prestige: 'moderate',
                                nominationChance: 0.6
                            },
                            nextChapter: 'artistic_integrity'
                        }
                    ]
                },

                {
                    id: 'oscar_campaign',
                    name: 'For Your Consideration',
                    triggerConditions: { weeksAfterPrevious: 16 },
                    description: 'Your Oscar campaign is in full swing.',

                    modal: {
                        title: 'Awards Season',
                        content: 'Your aggressive Oscar campaign for "{FILM}" has Hollywood talking. Screenings. Parties. Trade ads. You\'re doing everything possible to get recognition for your masterpiece.'
                    },

                    nextChapter: 'oscar_night'
                },

                {
                    id: 'artistic_integrity',
                    name: 'Quiet Confidence',
                    triggerConditions: { weeksAfterPrevious: 16 },
                    description: 'You let the quality speak for itself.',

                    modal: {
                        title: 'Above the Fray',
                        content: 'While other studios are running expensive Oscar campaigns, you\'ve kept yours modest. "{FILM}" doesn\'t need hype - it has quality.\n\nThe critics agree. Whether the Academy does remains to be seen.'
                    },

                    nextChapter: 'oscar_night'
                },

                {
                    id: 'oscar_night',
                    name: 'The Academy Awards',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 8 },

                    modal: {
                        title: 'And the Oscar Goes To...',
                        content: 'The envelope is opened...'
                    },

                    conditionalOutcome: {
                        condition: 'nominationChance',
                        onSuccess: {
                            modal: {
                                title: 'Oscar Glory',
                                content: '"{FILM}" wins Best Picture!\n\nYour masterpiece has received the ultimate recognition. This is the pinnacle of your career - the night you created a picture that will be remembered forever.'
                            },
                            effects: {
                                oscarsWon: 1,
                                reputation: 50,
                                achievement: 'best_picture',
                                studioValue: 100000,
                                legacyPermanent: true
                            }
                        },
                        onFailure: {
                            modal: {
                                title: 'Critical Acclaim',
                                content: '"{FILM}" didn\'t win Best Picture, but everyone knows it\'s a masterpiece. The critics love it. Cinephiles worship it.\n\nSometimes the best films don\'t win Oscars - but they endure.'
                            },
                            effects: {
                                reputation: 30,
                                achievement: 'cult_classic',
                                oscarNominations: 5,
                                legacyPermanent: true
                            }
                        }
                    }
                }
            ]
        },

        // ============================================
        // BUSINESS DRAMA STORIES (10 storylines)
        // ============================================

        takeover_attempt: {
            id: 'takeover_attempt',
            category: 'business',
            name: 'Hostile Takeover',
            description: 'A corporate raider wants to buy your studio',

            triggerConditions: {
                studioValue: { min: 300000 },
                reputation: { min: 60 },
                gameYear: { min: 1940 }
            },

            chapters: [
                {
                    id: 'the_offer',
                    name: 'Unsolicited Offer',
                    description: 'A mysterious investor wants to buy your studio.',

                    modal: {
                        title: 'Takeover Bid',
                        content: 'You\'ve received a formal offer from Eastern Investment Corp. They want to buy your studio for $400,000.\n\nThe letter is polite but firm. They believe they can "better realize the studio\'s potential." Translation: they think they can run it better than you.'
                    },

                    choices: [
                        {
                            text: 'Reject the offer outright',
                            effects: {
                                buyoutRejected: true,
                                takeover_hostility: 50
                            },
                            nextChapter: 'hostile_tactics'
                        },
                        {
                            text: 'Open negotiations - hear them out',
                            effects: {
                                negotiationsOpen: true,
                                takeover_hostility: 25
                            },
                            nextChapter: 'negotiations'
                        },
                        {
                            text: 'Accept - take the money and walk away',
                            effects: {
                                gameEnds: 'buyout',
                                cashBonus: 400000
                            },
                            nextChapter: 'sold_out'
                        }
                    ]
                },

                {
                    id: 'hostile_tactics',
                    name: 'Playing Hardball',
                    triggerConditions: { weeksAfterPrevious: 4 },
                    description: 'The investors are using aggressive tactics.',

                    modal: {
                        title: 'Pressure Campaign',
                        content: 'Eastern Investment isn\'t taking no for an answer. They\'re contacting your investors, spreading rumors, interfering with your bank relationships.\n\nThey want your studio, and they\'re willing to fight dirty.'
                    },

                    choices: [
                        {
                            text: 'Fight back with PR campaign ($30,000)',
                            cost: 30000,
                            effects: {
                                reputation: 10,
                                takeover_resistance: 40
                            },
                            nextChapter: 'public_battle'
                        },
                        {
                            text: 'Find a white knight investor',
                            cost: 25000,
                            effects: {
                                whiteKnight: true,
                                independence: -20 // You\'ll have a new partner
                            },
                            nextChapter: 'white_knight'
                        },
                        {
                            text: 'Accept a revised offer - better than losing everything',
                            effects: {
                                cashBonus: 350000,
                                gameEnds: 'buyout'
                            },
                            nextChapter: 'sold_out'
                        }
                    ]
                },

                {
                    id: 'negotiations',
                    name: 'Terms',
                    triggerConditions: { weeksAfterPrevious: 6 },
                    description: 'You\'re negotiating the terms.',

                    modal: {
                        title: 'Deal Structure',
                        content: 'After weeks of negotiation, Eastern Investment has offered several deal structures:\n\n1. Full buyout: $450,000\n2. Partnership: They buy 60%, you retain 40% and control\n3. Investment: They invest $200,000 for 30% stake'
                    },

                    choices: [
                        {
                            text: 'Take the full buyout ($450,000)',
                            effects: {
                                cashBonus: 450000,
                                gameEnds: 'buyout'
                            },
                            nextChapter: 'sold_out'
                        },
                        {
                            text: 'Accept partnership - keep some control',
                            effects: {
                                cashBonus: 250000,
                                partner: 'eastern_investment',
                                controlShare: 40,
                                quarterlyDividends: true
                            },
                            nextChapter: 'partnership'
                        },
                        {
                            text: 'Take investment only - maintain independence',
                            effects: {
                                cashBonus: 200000,
                                partner: 'eastern_investment',
                                controlShare: 70,
                                investorPressure: true
                            },
                            nextChapter: 'investment_partner'
                        },
                        {
                            text: 'Walk away - no deal',
                            effects: {
                                reputation: 5
                            },
                            nextChapter: 'independent'
                        }
                    ]
                },

                {
                    id: 'public_battle',
                    name: 'War',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 8 },

                    modal: {
                        title: 'Victory',
                        content: 'Your public relations campaign worked. You exposed Eastern Investment\'s dirty tactics to the press and rallied support from talent and exhibitors.\n\nFaced with bad publicity, they\'ve withdrawn their offer. Your studio remains independent - bloodied but unbowed.'
                    },

                    effects: {
                        reputation: 25,
                        achievement: 'corporate_warrior',
                        industryRespect: 40,
                        permanentBonus: { independence: true }
                    }
                },

                {
                    id: 'white_knight',
                    name: 'New Partner',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 6 },

                    modal: {
                        title: 'Saved',
                        content: 'You found a friendlier investor - Hollywood veteran Marcus Loew. He bought 40% of your studio, giving you the financial backing to fend off Eastern Investment.\n\nYou\'re not fully independent anymore, but you maintained control and kept the vultures at bay.'
                    },

                    effects: {
                        cashBonus: 150000,
                        partner: 'marcus_loew',
                        controlShare: 60,
                        reputation: 15,
                        achievement: 'strategic_alliance'
                    }
                },

                {
                    id: 'partnership',
                    name: 'New Reality',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 4 },

                    modal: {
                        title: 'Partners',
                        content: 'You\'ve sold majority control but retained significant ownership and operational authority. You have capital to work with, but now you answer to partners.\n\nIt\'s a new chapter for your studio.'
                    },

                    effects: {
                        achievement: 'deal_maker',
                        quarterlyReview: true,
                        budgetIncrease: 100000,
                        autonomyReduced: true
                    }
                },

                {
                    id: 'investment_partner',
                    name: 'Growth Capital',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 4 },

                    modal: {
                        title: 'Capitalized',
                        content: 'You brought in investment capital while maintaining control. You have the resources to compete with the major studios, though you\'ll feel pressure to show returns.\n\nYou stayed independent where it counts.'
                    },

                    effects: {
                        achievement: 'smart_money',
                        budgetIncrease: 200000,
                        quarterlyPressure: true,
                        autonomy: 70
                    }
                },

                {
                    id: 'independent',
                    name: 'On Your Own',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 2 },

                    modal: {
                        title: 'Independence',
                        content: 'You walked away from the deal. Your studio remains 100% yours. You\'ll build it on your own terms, without interference from corporate raiders.\n\nIt\'s harder this way - but it\'s yours.'
                    },

                    effects: {
                        reputation: 15,
                        achievement: 'maverick',
                        permanentBonus: { full_independence: true }
                    }
                },

                {
                    id: 'sold_out',
                    name: 'Exit',
                    resolution: true,
                    failure: true,

                    modal: {
                        title: 'Sold',
                        content: 'You sold your studio. You walk away with a substantial sum, but your career as an independent Hollywood mogul is over.\n\nWas it worth it?'
                    },

                    effects: {
                        gameEnds: 'buyout',
                        achievement: 'cashed_out'
                    }
                }
            ]
        },

        financial_crisis: {
            id: 'financial_crisis',
            category: 'business',
            name: 'Financial Ruin',
            description: 'Bankruptcy looms - can you save your studio?',

            triggerConditions: {
                cash: { max: 20000 },
                loans: { min: 50000 },
                reputation: { min: 30 }
            },

            chapters: [
                {
                    id: 'the_crisis',
                    name: 'Edge of Collapse',
                    description: 'Your studio is on the brink of bankruptcy.',

                    modal: {
                        title: 'Financial Crisis',
                        content: 'Your accountant lays out the grim numbers. Cash: ${CASH}. Outstanding loans: ${LOANS}. Weekly expenses: ${WEEKLY_COST}.\n\n"Without immediate action," he says, "we\'ll be bankrupt in weeks."'
                    },

                    choices: [
                        {
                            text: 'Emergency loan from the bank (if available)',
                            cost: 0,
                            effects: {
                                loan: 50000,
                                loanPayment: 2500, // weekly
                                lastChance: true
                            },
                            nextChapter: 'last_chance'
                        },
                        {
                            text: 'Sell studio assets and equipment',
                            effects: {
                                cashBonus: 30000,
                                productionCapacity: -40,
                                reputation: -15
                            },
                            nextChapter: 'downsizing'
                        },
                        {
                            text: 'Release all contract players immediately',
                            effects: {
                                cashSavings: 'all_contracts',
                                reputation: -25,
                                talentLost: 'all'
                            },
                            nextChapter: 'desperate_measures'
                        },
                        {
                            text: 'Declare bankruptcy',
                            effects: {
                                gameEnds: 'bankruptcy'
                            },
                            nextChapter: 'failure_bankruptcy'
                        }
                    ]
                },

                {
                    id: 'last_chance',
                    name: 'Final Loan',
                    triggerConditions: { weeksAfterPrevious: 4 },
                    description: 'The bank gave you one last loan. Don\'t waste it.',

                    modal: {
                        title: 'Last Lifeline',
                        content: 'You have $50,000 in emergency financing. The banker made it clear this is the last time.\n\n"Make a hit," he said. "Or start looking for a new career."'
                    },

                    choices: [
                        {
                            text: 'Bet it all on a commercial picture',
                            cost: 45000,
                            effects: {
                                filmType: 'commercial',
                                allIn: true,
                                successChance: 0.6
                            },
                            nextChapter: 'all_in'
                        },
                        {
                            text: 'Make two modest pictures to diversify risk',
                            cost: 45000,
                            effects: {
                                filmType: 'diversified',
                                successChance: 0.7
                            },
                            nextChapter: 'hedged_bet'
                        }
                    ]
                },

                {
                    id: 'downsizing',
                    name: 'Smaller Operation',
                    triggerConditions: { weeksAfterPrevious: 4 },
                    description: 'You\'ve sold off assets to survive.',

                    modal: {
                        title: 'Leaner Studio',
                        content: 'You sold equipment, property, and vehicles. You have cash to operate, but you\'re now a much smaller operation.\n\nCan you rebuild from this diminished position?'
                    },

                    choices: [
                        {
                            text: 'Focus on low-budget pictures',
                            effects: {
                                strategy: 'poverty_row',
                                budgetReduction: true,
                                volumeIncrease: true
                            },
                            nextChapter: 'poverty_row'
                        },
                        {
                            text: 'Produce one quality picture to restore reputation',
                            cost: 35000,
                            effects: {
                                strategy: 'quality',
                                successChance: 0.5
                            },
                            nextChapter: 'quality_gamble'
                        }
                    ]
                },

                {
                    id: 'desperate_measures',
                    name: 'Burned Bridges',
                    triggerConditions: { weeksAfterPrevious: 2 },
                    description: 'You released all your contract players.',

                    modal: {
                        title: 'Desperate',
                        content: 'You cut loose everyone under contract. Word spreads fast in Hollywood. Talent won\'t trust you. Your reputation is in tatters.\n\nBut you have cash to survive a few more weeks. What you do with it determines everything.'
                    },

                    choices: [
                        {
                            text: 'Make one cheap picture with no-name talent',
                            cost: 15000,
                            effects: {
                                filmType: 'cheap',
                                talentQuality: 'low',
                                successChance: 0.4
                            },
                            nextChapter: 'rock_bottom'
                        },
                        {
                            text: 'Use remaining cash to rebuild slowly',
                            effects: {
                                strategy: 'rebuild',
                                timeRequired: 20 // weeks
                            },
                            nextChapter: 'slow_rebuild'
                        }
                    ]
                },

                {
                    id: 'all_in',
                    name: 'All or Nothing',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 16 },

                    modal: {
                        title: 'The Gamble',
                        content: 'You bet everything on one picture...'
                    },

                    conditionalOutcome: {
                        condition: 'successChance',
                        onSuccess: {
                            modal: {
                                title: 'Saved!',
                                content: 'Your picture is a hit! It\'s not a masterpiece, but it\'s commercial and profitable. You\'ve paid off the loan and have breathing room.\n\nYou stared into the abyss and pulled yourself back.'
                            },
                            effects: {
                                cashBonus: 120000,
                                reputation: 25,
                                achievement: 'back_from_brink',
                                loansCleared: true
                            }
                        },
                        onFailure: {
                            modal: {
                                title: 'Bankrupt',
                                content: 'Your gamble failed. The picture flopped. You\'re out of money, out of credit, and out of options.\n\nYour studio closes its doors.'
                            },
                            effects: {
                                gameEnds: 'bankruptcy'
                            },
                            nextChapter: 'failure_bankruptcy'
                        }
                    }
                },

                {
                    id: 'hedged_bet',
                    name: 'Playing It Safe',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 18 },

                    modal: {
                        title: 'Survival',
                        content: 'Your two pictures both performed modestly. Neither was a hit, but both made money. You\'ve stabilized the situation and paid down debt.\n\nYou survived by not swinging for the fences. Sometimes that\'s the smart play.'
                    },

                    effects: {
                        cashBonus: 80000,
                        reputation: 15,
                        achievement: 'survivor',
                        loansReduced: 0.6
                    }
                },

                {
                    id: 'poverty_row',
                    name: 'Cheap Pictures',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 24 },

                    modal: {
                        title: 'Volume Business',
                        content: 'You\'ve pivoted to producing cheap B-pictures in volume. The budgets are tiny, but so are the risks. You\'re grinding out a living.\n\nYou\'re no longer competing with the majors, but you\'re surviving.'
                    },

                    effects: {
                        reputation: 5,
                        achievement: 'poverty_row_producer',
                        permanentBonus: { lowBudgetFocus: true },
                        profitMargin: 'thin'
                    }
                },

                {
                    id: 'quality_gamble',
                    name: 'Quality Play',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 16 },

                    conditionalOutcome: {
                        condition: 'successChance',
                        onSuccess: {
                            modal: {
                                title: 'Respect Restored',
                                content: 'Your quality picture succeeded critically and commercially. You\'ve restored your reputation and put your studio back on solid footing.\n\nYou chose quality over quantity and it paid off.'
                            },
                            effects: {
                                cashBonus: 90000,
                                reputation: 30,
                                achievement: 'quality_comeback'
                            }
                        },
                        onFailure: {
                            modal: {
                                title: 'Not Enough',
                                content: 'Your picture was good but not good enough. It made a small profit, but you\'re still struggling financially. You\'ll survive, but barely.'
                            },
                            effects: {
                                cashBonus: 25000,
                                reputation: 5,
                                continuesStruggling: true
                            }
                        }
                    }
                },

                {
                    id: 'rock_bottom',
                    name: 'Bottom',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 14 },

                    modal: {
                        title: 'Limping Along',
                        content: 'Your cheap picture with no-name talent made a tiny profit. You\'re still in business, but just barely. Your reputation is shot. Your resources are minimal.\n\nBut you\'re still here. That counts for something.'
                    },

                    effects: {
                        reputation: -10,
                        cashBonus: 20000,
                        achievement: 'stubborn_survivor',
                        hardMode: true
                    }
                },

                {
                    id: 'slow_rebuild',
                    name: 'Rebuilding',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 20 },

                    modal: {
                        title: 'Patient Approach',
                        content: 'You spent months rebuilding slowly. Small projects. Building relationships. Restoring trust. It\'s been unglamorous and difficult.\n\nBut you\'re on more solid ground now. A foundation to build from.'
                    },

                    effects: {
                        reputation: 10,
                        achievement: 'patient_rebuild',
                        relationshipsRestored: 0.5,
                        stableBase: true
                    }
                },

                {
                    id: 'failure_bankruptcy',
                    name: 'The End',
                    resolution: true,
                    failure: true,

                    modal: {
                        title: 'Bankruptcy',
                        content: 'Your studio is bankrupt. The bank forecloses. Your equipment is auctioned off. Contract players are released.\n\nYour dream of running a Hollywood studio is over. Not every story has a happy ending.'
                    },

                    effects: {
                        gameEnds: 'bankruptcy',
                        achievement: 'went_down_swinging'
                    }
                }
            ]
        },

        // ============================================
        // HISTORICAL DRAMA STORIES (10 storylines)
        // ============================================

        huac_investigation: {
            id: 'huac_investigation',
            category: 'historical',
            name: 'The Investigation',
            description: 'HUAC comes for your studio',

            triggerConditions: {
                gameYear: { min: 1947, max: 1952 },
                reputation: { min: 40 }
            },

            chapters: [
                {
                    id: 'the_subpoena',
                    name: 'Called to Testify',
                    description: 'HUAC has sent you a subpoena.',

                    modal: {
                        title: 'House Un-American Activities Committee',
                        content: 'A federal agent delivered a subpoena today. The House Un-American Activities Committee wants you to testify about "communist infiltration" in Hollywood.\n\nThey want names. They want you to inform on people you\'ve worked with.\n\nThis is the nightmare every studio head feared.'
                    },

                    choices: [
                        {
                            text: 'Cooperate fully - name names',
                            effects: {
                                cooperation: 'full',
                                reputation: -30,
                                guilt: 100,
                                huacClear: true
                            },
                            nextChapter: 'friendly_witness'
                        },
                        {
                            text: 'Cooperate partially - give minimal information',
                            effects: {
                                cooperation: 'partial',
                                reputation: -15,
                                guilt: 50,
                                huacRisk: 40
                            },
                            nextChapter: 'careful_testimony'
                        },
                        {
                            text: 'Refuse to cooperate - take the Fifth',
                            effects: {
                                cooperation: 'none',
                                reputation: 25,
                                huacTarget: true,
                                blacklistRisk: 70
                            },
                            nextChapter: 'defiance'
                        }
                    ]
                },

                {
                    id: 'friendly_witness',
                    name: 'Informer',
                    triggerConditions: { weeksAfterPrevious: 4 },
                    description: 'You cooperated with HUAC.',

                    modal: {
                        title: 'Friendly Witness',
                        content: 'You testified. You named names. Writers. Directors. Actors. Some were friends.\n\nHUAC is satisfied. Your studio is cleared. But you\'ll have to live with what you did.\n\nThe people you named will be blacklisted. Unable to work. Their careers destroyed.\n\nYou protected your studio by destroying theirs.'
                    },

                    effects: {
                        huacCleared: true,
                        reputation: -25,
                        guilt: 100,
                        industryRelations: -50,
                        achievement: 'friendly_witness'
                    },

                    nextChapter: 'living_with_guilt'
                },

                {
                    id: 'careful_testimony',
                    name: 'Walking the Line',
                    triggerConditions: { weeksAfterPrevious: 4 },
                    description: 'You gave partial cooperation.',

                    modal: {
                        title: 'Measured Response',
                        content: 'You testified carefully. You answered some questions, evaded others. You gave them just enough to avoid being held in contempt, but not enough to destroy anyone.\n\nHUAC isn\'t entirely satisfied, but they move on to easier targets.'
                    },

                    choices: [
                        {
                            text: 'Keep your head down and wait for this to pass',
                            effects: {
                                lowProfile: true,
                                reputation: -5
                            },
                            nextChapter: 'weather_storm'
                        },
                        {
                            text: 'Quietly hire blacklisted talent under pseudonyms',
                            effects: {
                                blacklistResistance: true,
                                reputation: 10,
                                huacRisk: 30,
                                industryRespect: 25
                            },
                            nextChapter: 'quiet_resistance'
                        }
                    ]
                },

                {
                    id: 'defiance',
                    name: 'Standing Firm',
                    triggerConditions: { weeksAfterPrevious: 3 },
                    description: 'You refused to cooperate with HUAC.',

                    modal: {
                        title: 'Consequences',
                        content: 'You took the Fifth Amendment and refused to name names. HUAC is furious.\n\nNow they\'re targeting your studio. Investigating your films. Questioning your loyalty. Making your life hell.\n\nBut you can look yourself in the mirror.'
                    },

                    effects: {
                        huacTarget: true,
                        reputation: 30,
                        industryRespect: 50,
                        federalHarassment: true
                    },

                    choices: [
                        {
                            text: 'Continue defying them publicly',
                            effects: {
                                publicDefiance: true,
                                reputation: 20,
                                huacIntensifies: true,
                                achievement: 'stood_up_to_huac'
                            },
                            nextChapter: 'public_enemy'
                        },
                        {
                            text: 'Accept the consequences quietly',
                            effects: {
                                quietResistance: true,
                                reputation: 15
                            },
                            nextChapter: 'quiet_resistance'
                        }
                    ]
                },

                {
                    id: 'living_with_guilt',
                    name: 'The Price',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 20 },

                    modal: {
                        title: 'Haunted',
                        content: 'Years later, you\'re still haunted by your testimony. You see the people you named in your dreams. You read about their struggles.\n\nYour studio survived. Thrived, even. But there\'s a darkness in your success.\n\nHistory will remember what you did.'
                    },

                    effects: {
                        reputation: -20,
                        achievement: 'cooperated_with_huac',
                        permanentEffect: { guilt: true },
                        historicalLegacy: 'negative'
                    }
                },

                {
                    id: 'weather_storm',
                    name: 'Patience',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 30 },

                    modal: {
                        title: 'Survived',
                        content: 'You kept your head down during the witch hunt. You didn\'t make waves. You didn\'t take sides.\n\nYou survived the Red Scare without major damage to your studio or your conscience. Sometimes discretion is the better part of valor.'
                    },

                    effects: {
                        reputation: 10,
                        achievement: 'weathered_storm',
                        historicalLegacy: 'neutral'
                    }
                },

                {
                    id: 'quiet_resistance',
                    name: 'Secret Hero',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 40 },

                    modal: {
                        title: 'Underground Railroad',
                        content: 'For years, you quietly hired blacklisted writers and directors under fake names. You gave them work when no one else would. You risked your studio to do what was right.\n\nMost people will never know what you did. But the artists you saved will remember.\n\nHistory will be kind to you.'
                    },

                    effects: {
                        reputation: 25,
                        achievement: 'quiet_hero',
                        industryRespect: 60,
                        historicalLegacy: 'positive',
                        permanentBonus: { moralCourage: true }
                    }
                },

                {
                    id: 'public_enemy',
                    name: 'Target',
                    resolution: true,
                    triggerConditions: { weeksAfterPrevious: 25 },

                    modal: {
                        title: 'Persecution',
                        content: 'Your public defiance of HUAC made you a target. Federal agents investigate your studio. Your films are scrutinized. Your financing is questioned.\n\nIt\'s been hell. Your reputation in Washington is terrible, but in Hollywood - among the artists - you\'re a hero.\n\nYou stood up when others stayed silent.'
                    },

                    effects: {
                        reputation: 40,
                        achievement: 'defied_huac',
                        federalHostility: 50,
                        industryRespect: 80,
                        historicalLegacy: 'heroic',
                        oscarBonus: 15 // Academy respects your courage
                    }
                }
            ]
        },

        world_war_two: {
            id: 'world_war_two',
            category: 'historical',
            name: 'War Comes to Hollywood',
            description: 'World War II transforms your studio',

            triggerConditions: {
                gameYear: { exact: 1941 }
            },

            chapters: [
                {
                    id: 'pearl_harbor',
                    name: 'December 7th, 1941',
                    description: 'America enters the war.',

                    modal: {
                        title: 'Day of Infamy',
                        content: 'The news from Pearl Harbor is devastating. America is at war.\n\nHollywood will be transformed by this conflict. The government needs propaganda films. Your stars will enlist or sell war bonds. Material rationing will affect production.\n\nHow does your studio respond to the war effort?'
                    },

                    choices: [
                        {
                            text: 'Go all-in on war films and propaganda',
                            effects: {
                                strategy: 'war_focused',
                                patrioticBonus: 30,
                                genreRestriction: 'war_films',
                                governmentSupport: 50
                            },
                            nextChapter: 'war_studio'
                        },
                        {
                            text: 'Balance war films with escapist entertainment',
                            effects: {
                                strategy: 'balanced',
                                patrioticBonus: 15,
                                flexibility: true
                            },
                            nextChapter: 'balanced_approach'
                        },
                        {
                            text: 'Focus on morale-boosting musicals and comedies',
                            effects: {
                                strategy: 'escapist',
                                patrioticBonus: 10,
                                musicalFocus: true,
                                publicAppreciation: 25
                            },
                            nextChapter: 'escapist_focus'
                        }
                    ]
                },

                {
                    id: 'war_studio',
                    name: 'Arsenal of Entertainment',
                    triggerConditions: { weeksAfterPrevious: 8 },
                    description: 'Your studio is producing war films and propaganda.',

                    modal: {
                        title: 'War Effort',
                        content: 'Your studio has become part of the war effort. You\'re producing training films, propaganda, and patriotic features.\n\nThe government is supportive. Material rationing is waived for your war productions. But the creative constraints are significant.'
                    },

                    effects: {
                        governmentContracts: true,
                        cashBonus: 50000,
                        artisticFreedom: -30,
                        reputation: 20
                    },

                    nextChapter: 'homefront_challenges'
                },

                {
                    id: 'balanced_approach',
                    name: 'Doing Our Part',
                    triggerConditions: { weeksAfterPrevious: 8 },
                    description: 'You\'re producing both war films and entertainment.',

                    modal: {
                        title: 'Balance',
                        content: 'Your studio is contributing to the war effort while still entertaining audiences who need escape from wartime anxieties.\n\nIt\'s a pragmatic approach that serves both patriotism and profit.'
                    },

                    effects: {
                        cashBonus: 25000,
                        reputation: 15,
                        flexibility: true
                    },

                    nextChapter: 'homefront_challenges'
                },

                {
                    id: 'escapist_focus',
                    name: 'Morale Boost',
                    triggerConditions: { weeksAfterPrevious: 8 },
                    description: 'Your musicals and comedies lift spirits.',

                    modal: {
                        title: 'Entertainment Value',
                        content: 'While other studios churn out war films, your musicals and comedies are giving audiences relief from wartime stress.\n\nServicemen on leave pack theaters to see your pictures. You\'re contributing to morale in your own way.'
                    },

                    effects: {
                        boxOfficeBonus: 0.2,
                        reputation: 15,
                        musicalExpertise: 20,
                        achievement: 'morale_booster'
                    },

                    nextChapter: 'homefront_challenges'
                },

                {
                    id: 'homefront_challenges',
                    name: 'Wartime Production',
                    triggerConditions: { weeksAfterPrevious: 20 },
                    description: 'The war affects every aspect of production.',

                    modal: {
                        title: 'Challenges',
                        content: 'Film stock is rationed. Equipment is scarce. Your male stars are enlisting or being drafted. Building materials for sets are restricted.\n\nYet somehow, you\'re still making pictures.'
                    },

                    choices: [
                        {
                            text: 'Pivot to more female-led pictures',
                            effects: {
                                actressFocus: true,
                                innovative: true,
                                futureOpportunities: 'female_stars'
                            },
                            nextChapter: 'womens_pictures'
                        },
                        {
                            text: 'Work with actors exempt from service (age, health)',
                            effects: {
                                olderStars: true,
                                continuity: true
                            },
                            nextChapter: 'veteran_talent'
                        }
                    ]
                },

                {
                    id: 'womens_pictures',
                    name: 'New Stars',
                    triggerConditions: { weeksAfterPrevious: 20 },
                    description: 'Female stars shine in leading roles.',

                    modal: {
                        title: 'Women\'s Pictures',
                        content: 'With male stars at war, you\'ve built up a stable of talented actresses. Your female-led pictures are finding huge audiences.\n\nYou\'re discovering that women can carry pictures just as well as men - something Hollywood will need to remember after the war.'
                    },

                    effects: {
                        actressDevelopment: 40,
                        boxOfficeBonus: 0.15,
                        progressive: true,
                        achievement: 'ahead_of_times'
                    },

                    nextChapter: 'victory'
                },

                {
                    id: 'veteran_talent',
                    name: 'Experienced Hands',
                    triggerConditions: { weeksAfterPrevious: 20 },
                    description: 'Veteran talent keeps you in business.',

                    modal: {
                        title: 'Old Pros',
                        content: 'You\'re relying on older actors, character players, and established stars exempt from service. They may not be leading men anymore, but they bring professionalism and experience.\n\nYour wartime pictures have a different feel - less flash, more substance.'
                    },

                    effects: {
                        characterActorFocus: true,
                        qualityBonus: 10,
                        steadyProduction: true
                    },

                    nextChapter: 'victory'
                },

                {
                    id: 'victory',
                    name: 'V-J Day',
                    resolution: true,
                    triggerConditions: { gameYear: { exact: 1945 } },

                    modal: {
                        title: 'The War Ends',
                        content: 'Japan has surrendered. The war is over.\n\nYou navigated your studio through the most challenging period in Hollywood history. Your stars are coming home. Rationing will end. A new era begins.\n\nYou kept the cameras rolling when it mattered most.'
                    },

                    effects: {
                        reputation: 30,
                        achievement: 'war_survivor',
                        postWarBonus: true,
                        veteranStarsReturn: true,
                        historicalLegacy: 'wartime_contribution'
                    }
                }
            ]
        }

        // Additional storylines would go here:
        // - the_blacklist (talent arc)
        // - forbidden_love (talent arc)
        // - the_method (talent arc)
        // - contract_holdout (talent arc)
        // - directors_muse (talent arc)
        // - the_bomb (production saga)
        // - the_sequel (production saga)
        // - the_remake (production saga)
        // - the_epic (production saga)
        // - stolen_thunder (production saga)
        // - the_investor (business drama)
        // - the_merger (business drama)
        // - empire_expands (business drama)
        // - the_heir (business drama)
        // - changing_times (historical drama - TV)
        // - paramount_decree (historical drama)
        // - pre_code_era (historical drama)
        // - hays_code (historical drama)
    };

    /**
     * Initialize storyline system
     */
    function initialize(gameState) {
        if (!gameState.storylines) {
            gameState.storylines = {
                active: [],
                completed: [],
                failed: [],
                triggeredIds: new Set()
            };
        }

        // Load active storylines
        activeStorylines = gameState.storylines.active || [];
        completedStorylines = gameState.storylines.completed || [];
        failedStorylines = gameState.storylines.failed || [];

        console.log('Storyline System initialized');
    }

    /**
     * Check for new storylines that can trigger
     */
    function checkForNewStorylines(gameState) {
        const newStorylines = [];

        // Only check if not too many active storylines (max 3)
        if (activeStorylines.length >= 3) {
            return newStorylines;
        }

        // Check each storyline
        for (const id in STORYLINE_DATABASE) {
            const storyline = STORYLINE_DATABASE[id];

            // Skip if already active, completed, or failed
            if (gameState.storylines.triggeredIds.has(id)) {
                continue;
            }

            // Check trigger conditions
            if (checkTriggerConditions(storyline.triggerConditions, gameState)) {
                // Trigger the storyline!
                const activeStoryline = startStoryline(storyline, gameState);
                newStorylines.push(activeStoryline);

                gameState.storylines.triggeredIds.add(id);
            }
        }

        return newStorylines;
    }

    /**
     * Check if trigger conditions are met
     */
    function checkTriggerConditions(conditions, gameState) {
        if (!conditions) return true;

        // Check each condition
        for (const key in conditions) {
            const condition = conditions[key];

            switch (key) {
                case 'filmQuality':
                    if (!checkFilmCondition(gameState, 'quality', condition)) return false;
                    break;
                case 'filmBoxOffice':
                    if (!checkFilmCondition(gameState, 'boxOffice', condition)) return false;
                    break;
                case 'filmBudget':
                    if (!checkFilmCondition(gameState, 'budget', condition)) return false;
                    break;
                case 'studioReputation':
                    if (!checkNumericCondition(gameState.reputation, condition)) return false;
                    break;
                case 'cash':
                    if (!checkNumericCondition(gameState.cash, condition)) return false;
                    break;
                case 'gameYear':
                    if (condition.exact && gameState.gameYear !== condition.exact) return false;
                    if (!checkNumericCondition(gameState.gameYear, condition)) return false;
                    break;
                case 'hasAListActor':
                    if (!hasHighStarPowerActor(gameState, 80)) return false;
                    break;
                case 'hasMultipleStars':
                    if (!hasMultipleStars(gameState, condition.min)) return false;
                    break;
                // Add more condition types as needed
            }
        }

        return true;
    }

    /**
     * Check numeric condition (min, max)
     */
    function checkNumericCondition(value, condition) {
        if (condition.min !== undefined && value < condition.min) return false;
        if (condition.max !== undefined && value > condition.max) return false;
        return true;
    }

    /**
     * Check film-related condition
     */
    function checkFilmCondition(gameState, property, condition) {
        const films = [...(gameState.activeFilms || []), ...(gameState.completedFilms || [])];

        for (const film of films) {
            let value;
            if (property === 'quality') value = film.quality;
            if (property === 'boxOffice') value = film.totalGross || 0;
            if (property === 'budget') value = film.originalBudget || film.budget;

            if (checkNumericCondition(value, condition)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if has actor with high star power
     */
    function hasHighStarPowerActor(gameState, threshold) {
        if (!gameState.contractPlayers) return false;

        return gameState.contractPlayers.some(contract => {
            if (contract.talentType !== 'actor') return false;
            const actor = window.TalentRoster?.getActorById(contract.talentId);
            return actor && actor.starPower >= threshold;
        });
    }

    /**
     * Check if has multiple stars
     */
    function hasMultipleStars(gameState, minCount) {
        if (!gameState.contractPlayers) return false;

        const stars = gameState.contractPlayers.filter(contract => {
            if (contract.talentType !== 'actor') return false;
            const actor = window.TalentRoster?.getActorById(contract.talentId);
            return actor && actor.starPower >= 70;
        });

        return stars.length >= minCount;
    }

    /**
     * Start a new storyline
     */
    function startStoryline(storyline, gameState) {
        const activeStoryline = {
            id: storyline.id,
            name: storyline.name,
            category: storyline.category,
            description: storyline.description,
            currentChapterIndex: 0,
            startedWeek: gameState.gameWeek,
            startedYear: gameState.gameYear,
            chapterProgress: [],
            variables: {} // Storyline-specific variables
        };

        activeStorylines.push(activeStoryline);
        gameState.storylines.active = activeStorylines;

        // Trigger first chapter
        triggerChapter(activeStoryline, 0, gameState);

        // Alert player
        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'storyline',
                icon: '📖',
                message: `New Storyline: ${storyline.name}`,
                priority: 'high'
            });
        }

        console.log(`Storyline started: ${storyline.name}`);
        return activeStoryline;
    }

    /**
     * Trigger a specific chapter
     */
    function triggerChapter(activeStoryline, chapterIndex, gameState) {
        const storyline = STORYLINE_DATABASE[activeStoryline.id];
        const chapter = storyline.chapters[chapterIndex];

        if (!chapter) return;

        // Record chapter start
        activeStoryline.currentChapterIndex = chapterIndex;
        activeStoryline.chapterProgress.push({
            chapterId: chapter.id,
            startedWeek: gameState.gameWeek,
            completed: false
        });

        // Apply chapter effects
        if (chapter.effects) {
            applyEffects(chapter.effects, gameState, activeStoryline);
        }

        // Show modal to player
        if (chapter.modal) {
            showStorylineModal(activeStoryline, chapter, gameState);
        }

        // Check for conditional outcomes
        if (chapter.conditionalOutcome) {
            handleConditionalOutcome(activeStoryline, chapter, gameState);
        }

        // Check for resolution
        if (chapter.resolution) {
            resolveStoryline(activeStoryline, chapter.failure ? 'failed' : 'completed', gameState);
        }
    }

    /**
     * Show storyline modal to player
     */
    function showStorylineModal(activeStoryline, chapter, gameState) {
        const storyline = STORYLINE_DATABASE[activeStoryline.id];

        // Replace variables in content
        let content = chapter.modal.content;
        content = replaceStorylineVariables(content, activeStoryline, gameState);

        let modalHTML = `
            <div class="storyline-modal">
                <div class="storyline-header">
                    <span class="storyline-category">${storyline.category.toUpperCase()}</span>
                    <h2>${chapter.modal.title}</h2>
                </div>
                <div class="storyline-content">
                    <p>${content}</p>
                </div>
        `;

        // Add choices if available
        if (chapter.choices && chapter.choices.length > 0) {
            modalHTML += '<div class="storyline-choices"><h3>What do you do?</h3>';

            chapter.choices.forEach((choice, index) => {
                const costText = choice.cost ? ` ($${choice.cost.toLocaleString()})` : '';
                const disabled = choice.cost && gameState.cash < choice.cost ? 'disabled' : '';

                modalHTML += `
                    <button class="storyline-choice ${disabled}"
                            onclick="StorylineSystem.makeChoice('${activeStoryline.id}', ${index})">
                        ${choice.text}${costText}
                    </button>
                `;
            });

            modalHTML += '</div>';
        } else {
            // Just a continue button
            modalHTML += `
                <div class="storyline-actions">
                    <button class="action-btn primary" onclick="HollywoodMogul.closeModal()">
                        Continue
                    </button>
                </div>
            `;
        }

        modalHTML += '</div>';

        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalHTML);
        }
    }

    /**
     * Replace variables in storyline text
     */
    function replaceStorylineVariables(text, activeStoryline, gameState) {
        // Replace common variables
        text = text.replace(/{CASH}/g, gameState.cash.toLocaleString());
        text = text.replace(/{REPUTATION}/g, gameState.reputation);
        text = text.replace(/{YEAR}/g, gameState.gameYear);

        // Replace storyline-specific variables
        for (const key in activeStoryline.variables) {
            const regex = new RegExp(`{${key}}`, 'g');
            text = text.replace(regex, activeStoryline.variables[key]);
        }

        return text;
    }

    /**
     * Handle player choice in storyline
     */
    function makeChoice(storylineId, choiceIndex) {
        const gameState = window.HollywoodMogul?.getGameState();
        if (!gameState) return;

        const activeStoryline = activeStorylines.find(s => s.id === storylineId);
        if (!activeStoryline) return;

        const storyline = STORYLINE_DATABASE[storylineId];
        const chapter = storyline.chapters[activeStoryline.currentChapterIndex];
        const choice = chapter.choices[choiceIndex];

        if (!choice) return;

        // Check if can afford
        if (choice.cost && gameState.cash < choice.cost) {
            if (window.HollywoodMogul) {
                window.HollywoodMogul.addAlert({
                    type: 'error',
                    icon: '❌',
                    message: 'Insufficient funds for this choice',
                    priority: 'high'
                });
            }
            return;
        }

        // Apply cost
        if (choice.cost) {
            gameState.cash -= choice.cost;
        }

        // Apply choice effects
        if (choice.effects) {
            applyEffects(choice.effects, gameState, activeStoryline);
        }

        // Close modal
        if (window.HollywoodMogul) {
            window.HollywoodMogul.closeModal();
        }

        // Record choice
        const currentChapterProgress = activeStoryline.chapterProgress[activeStoryline.chapterProgress.length - 1];
        currentChapterProgress.choiceIndex = choiceIndex;
        currentChapterProgress.completed = true;

        // Move to next chapter if specified
        if (choice.nextChapter) {
            const nextChapterIndex = storyline.chapters.findIndex(c => c.id === choice.nextChapter);
            if (nextChapterIndex !== -1) {
                // Schedule next chapter based on trigger conditions
                const nextChapter = storyline.chapters[nextChapterIndex];
                if (nextChapter.triggerConditions) {
                    activeStoryline.nextChapterId = choice.nextChapter;
                    activeStoryline.nextChapterWaitStartWeek = gameState.gameWeek;
                } else {
                    // Trigger immediately
                    triggerChapter(activeStoryline, nextChapterIndex, gameState);
                }
            }
        }
    }

    /**
     * Apply effects from chapter or choice
     */
    function applyEffects(effects, gameState, activeStoryline) {
        // Apply various effects
        if (effects.reputation) {
            gameState.reputation = Math.max(0, Math.min(100, gameState.reputation + effects.reputation));
        }

        if (effects.cashBonus) {
            gameState.cash += effects.cashBonus;
        }

        if (effects.achievement) {
            if (window.AchievementSystem) {
                window.AchievementSystem.unlockAchievement(effects.achievement, gameState);
            }
        }

        // Store effects in storyline variables for later reference
        for (const key in effects) {
            if (!activeStoryline.variables[key]) {
                activeStoryline.variables[key] = effects[key];
            }
        }
    }

    /**
     * Handle conditional outcomes
     */
    function handleConditionalOutcome(activeStoryline, chapter, gameState) {
        const outcome = chapter.conditionalOutcome;
        let success = false;

        // Determine success/failure
        if (outcome.condition === 'random') {
            success = Math.random() < (outcome.probability || 0.5);
        } else {
            // Check stored variable
            const value = activeStoryline.variables[outcome.condition];
            if (typeof value === 'number') {
                success = Math.random() < value;
            }
        }

        // Apply appropriate outcome
        const result = success ? outcome.onSuccess : outcome.onFailure;

        if (result.modal) {
            // Update modal content
            chapter.modal = {
                ...chapter.modal,
                content: chapter.modal.content + '\n\n' + result.modal.content
            };
        }

        if (result.effects) {
            applyEffects(result.effects, gameState, activeStoryline);
        }

        if (result.nextChapter) {
            const storyline = STORYLINE_DATABASE[activeStoryline.id];
            const nextChapterIndex = storyline.chapters.findIndex(c => c.id === result.nextChapter);
            if (nextChapterIndex !== -1) {
                activeStoryline.nextChapterId = result.nextChapter;
                activeStoryline.nextChapterWaitStartWeek = gameState.gameWeek;
            }
        }
    }

    /**
     * Process weekly storyline updates
     */
    function processWeeklyUpdates(gameState) {
        activeStorylines.forEach(activeStoryline => {
            const storyline = STORYLINE_DATABASE[activeStoryline.id];

            // Check if waiting for next chapter
            if (activeStoryline.nextChapterId) {
                const nextChapterIndex = storyline.chapters.findIndex(c => c.id === activeStoryline.nextChapterId);
                const nextChapter = storyline.chapters[nextChapterIndex];

                if (nextChapter && nextChapter.triggerConditions) {
                    // Check if trigger conditions are met
                    if (checkChapterTriggerConditions(nextChapter.triggerConditions, activeStoryline, gameState)) {
                        // Trigger the chapter!
                        delete activeStoryline.nextChapterId;
                        delete activeStoryline.nextChapterWaitStartWeek;
                        triggerChapter(activeStoryline, nextChapterIndex, gameState);
                    }
                }
            }
        });
    }

    /**
     * Check chapter-specific trigger conditions
     */
    function checkChapterTriggerConditions(conditions, activeStoryline, gameState) {
        if (conditions.weeksAfterPrevious) {
            const waitStartWeek = activeStoryline.nextChapterWaitStartWeek || activeStoryline.startedWeek;
            const weeksPassed = gameState.gameWeek - waitStartWeek;
            if (weeksPassed < conditions.weeksAfterPrevious) {
                return false;
            }
        }

        // Check other conditions using main function
        return checkTriggerConditions(conditions, gameState);
    }

    /**
     * Resolve a storyline (completed or failed)
     */
    function resolveStoryline(activeStoryline, outcome, gameState) {
        // Remove from active
        const index = activeStorylines.findIndex(s => s.id === activeStoryline.id);
        if (index !== -1) {
            activeStorylines.splice(index, 1);
        }

        // Add to completed or failed
        activeStoryline.endedWeek = gameState.gameWeek;
        activeStoryline.endedYear = gameState.gameYear;
        activeStoryline.outcome = outcome;

        if (outcome === 'completed') {
            completedStorylines.push(activeStoryline);
            gameState.storylines.completed = completedStorylines;

            if (window.HollywoodMogul) {
                window.HollywoodMogul.addAlert({
                    type: 'success',
                    icon: '✨',
                    message: `Storyline Complete: ${activeStoryline.name}`,
                    priority: 'high'
                });
            }
        } else {
            failedStorylines.push(activeStoryline);
            gameState.storylines.failed = failedStorylines;

            if (window.HollywoodMogul) {
                window.HollywoodMogul.addAlert({
                    type: 'info',
                    icon: '📖',
                    message: `Storyline Ended: ${activeStoryline.name}`,
                    priority: 'medium'
                });
            }
        }

        // Update game state
        gameState.storylines.active = activeStorylines;

        console.log(`Storyline ${outcome}: ${activeStoryline.name}`);
    }

    /**
     * Get active storylines
     */
    function getActiveStorylines() {
        return activeStorylines;
    }

    /**
     * Get completed storylines
     */
    function getCompletedStorylines() {
        return completedStorylines;
    }

    /**
     * Get storyline statistics
     */
    function getStats() {
        return {
            active: activeStorylines.length,
            completed: completedStorylines.length,
            failed: failedStorylines.length,
            total: completedStorylines.length + failedStorylines.length
        };
    }

    // Public API
    return {
        initialize,
        checkForNewStorylines,
        processWeeklyUpdates,
        makeChoice,
        getActiveStorylines,
        getCompletedStorylines,
        getStats,
        STORYLINE_DATABASE
    };
})();
