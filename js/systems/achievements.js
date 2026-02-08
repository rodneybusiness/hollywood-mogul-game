/**
 * HOLLYWOOD MOGUL - ACHIEVEMENT SYSTEM
 * 30+ achievements tracking milestones, secrets, and player accomplishments
 */

window.AchievementSystem = (function() {
    'use strict';

    /**
     * Achievement database - 30+ achievements across categories
     */
    const ACHIEVEMENTS = {
        // Production Achievements
        first_film: {
            id: 'first_film',
            title: 'Lights, Camera, Action!',
            description: 'Greenlight your first film',
            icon: '🎬',
            category: 'production',
            points: 10,
            checkCondition: (gameState) => {
                return gameState.stats.filmsProduced >= 1;
            }
        },

        prolific_producer: {
            id: 'prolific_producer',
            title: 'Prolific Producer',
            description: 'Produce 10 films',
            icon: '🎞️',
            category: 'production',
            points: 25,
            checkCondition: (gameState) => {
                return gameState.stats.filmsProduced >= 10;
            }
        },

        hollywood_legend: {
            id: 'hollywood_legend',
            title: 'Hollywood Legend',
            description: 'Produce 25+ films',
            icon: '🏆',
            category: 'production',
            points: 50,
            checkCondition: (gameState) => {
                return gameState.stats.filmsProduced >= 25;
            }
        },

        quality_over_quantity: {
            id: 'quality_over_quantity',
            title: 'Quality Over Quantity',
            description: 'Produce a film with quality 90+',
            icon: '⭐',
            category: 'production',
            points: 30,
            checkCondition: (gameState) => {
                return (gameState.completedFilms || []).some(f => f.quality >= 90);
            }
        },

        masterpiece: {
            id: 'masterpiece',
            title: 'Masterpiece',
            description: 'Produce a film with quality 95+',
            icon: '💎',
            category: 'production',
            points: 50,
            secret: true,
            checkCondition: (gameState) => {
                return (gameState.completedFilms || []).some(f => f.quality >= 95);
            }
        },

        // Financial Achievements
        first_profit: {
            id: 'first_profit',
            title: 'In the Black',
            description: 'Earn your first profit from a film',
            icon: '💰',
            category: 'financial',
            points: 15,
            checkCondition: (gameState) => {
                return gameState.totalRevenue > 0;
            }
        },

        deep_pockets: {
            id: 'deep_pockets',
            title: 'Deep Pockets',
            description: 'Have $250,000+ cash on hand',
            icon: '💵',
            category: 'financial',
            points: 30,
            checkCondition: (gameState) => {
                return gameState.cash >= 250000;
            }
        },

        movie_mogul: {
            id: 'movie_mogul',
            title: 'Movie Mogul',
            description: 'Have $500,000+ cash on hand',
            icon: '🏛️',
            category: 'financial',
            points: 50,
            checkCondition: (gameState) => {
                return gameState.cash >= 500000;
            }
        },

        box_office_king: {
            id: 'box_office_king',
            title: 'Box Office King',
            description: 'Earn $1,000,000+ total box office revenue',
            icon: '👑',
            category: 'financial',
            points: 40,
            checkCondition: (gameState) => {
                return (gameState.stats.boxOfficeTotal || 0) >= 1000000;
            }
        },

        blockbuster: {
            id: 'blockbuster',
            title: 'Blockbuster!',
            description: 'A single film earns $200,000+',
            icon: '💥',
            category: 'financial',
            points: 35,
            checkCondition: (gameState) => {
                return (gameState.completedFilms || []).some(f => (f.totalRevenue || 0) >= 200000);
            }
        },

        // Survival Achievements
        survived_depression: {
            id: 'survived_depression',
            title: 'Depression Survivor',
            description: 'Make it to 1940',
            icon: '📰',
            category: 'survival',
            points: 20,
            checkCondition: (gameState) => {
                return gameState.gameYear >= 1940;
            }
        },

        survived_war: {
            id: 'survived_war',
            title: 'War Years Veteran',
            description: 'Survive WWII (1941-1945)',
            icon: '🎖️',
            category: 'survival',
            points: 30,
            checkCondition: (gameState) => {
                return gameState.gameYear >= 1946;
            }
        },

        survived_huac: {
            id: 'survived_huac',
            title: 'Red Scare Survivor',
            description: 'Make it through HUAC era (1947-1949)',
            icon: '⚠️',
            category: 'survival',
            points: 40,
            checkCondition: (gameState) => {
                return gameState.gameYear >= 1949;
            }
        },

        golden_age_complete: {
            id: 'golden_age_complete',
            title: 'Golden Age Complete',
            description: 'Survive all 16 years (1933-1949)',
            icon: '🏅',
            category: 'survival',
            points: 100,
            checkCondition: (gameState) => {
                return gameState.gameYear >= 1949 && !gameState.gameEnded;
            }
        },

        // Reputation Achievements
        rising_star: {
            id: 'rising_star',
            title: 'Rising Star',
            description: 'Reach reputation 60',
            icon: '🌟',
            category: 'reputation',
            points: 20,
            checkCondition: (gameState) => {
                return gameState.reputation >= 60;
            }
        },

        industry_respect: {
            id: 'industry_respect',
            title: 'Industry Respect',
            description: 'Reach reputation 80',
            icon: '🎭',
            category: 'reputation',
            points: 35,
            checkCondition: (gameState) => {
                return gameState.reputation >= 80;
            }
        },

        legendary_studio: {
            id: 'legendary_studio',
            title: 'Legendary Studio',
            description: 'Reach reputation 95+',
            icon: '👑',
            category: 'reputation',
            points: 50,
            secret: true,
            checkCondition: (gameState) => {
                return gameState.reputation >= 95;
            }
        },

        // Historical Achievements
        pre_code_pioneer: {
            id: 'pre_code_pioneer',
            title: 'Pre-Code Pioneer',
            description: 'Produce 3+ films before Hays Code (1934)',
            icon: '🎭',
            category: 'historical',
            points: 25,
            checkCondition: (gameState) => {
                const preCodeFilms = (gameState.completedFilms || []).filter(f =>
                    f.yearReleased < 1934
                );
                return preCodeFilms.length >= 3;
            }
        },

        wartime_patriot: {
            id: 'wartime_patriot',
            title: 'Wartime Patriot',
            description: 'Produce 5+ war films during WWII (1941-1945)',
            icon: '🎖️',
            category: 'historical',
            points: 30,
            checkCondition: (gameState) => {
                const warFilms = (gameState.completedFilms || []).filter(f =>
                    f.genre === 'war' && f.yearReleased >= 1941 && f.yearReleased <= 1945
                );
                return warFilms.length >= 5;
            }
        },

        friendly_witness: {
            id: 'friendly_witness',
            title: 'Friendly Witness',
            description: 'Cooperate with HUAC',
            icon: '⚖️',
            category: 'historical',
            points: 20,
            secret: true,
            checkCondition: (gameState) => {
                return (gameState.longTermEffects || []).includes('cooperative_witness');
            }
        },

        artistic_integrity: {
            id: 'artistic_integrity',
            title: 'Artistic Integrity',
            description: 'Defy HUAC and protect your employees',
            icon: '🎨',
            category: 'historical',
            points: 50,
            secret: true,
            checkCondition: (gameState) => {
                return (gameState.longTermEffects || []).includes('blacklisted') ||
                       (gameState.longTermEffects || []).includes('huac_target');
            }
        },

        // Oscar Achievements
        oscar_nominated: {
            id: 'oscar_nominated',
            title: 'Oscar Nominated',
            description: 'Receive your first Oscar nomination',
            icon: '🏆',
            category: 'oscars',
            points: 25,
            checkCondition: (gameState) => {
                return (gameState.stats.oscarNominations || 0) >= 1;
            }
        },

        oscar_winner: {
            id: 'oscar_winner',
            title: 'Oscar Winner',
            description: 'Win your first Oscar',
            icon: '🏆',
            category: 'oscars',
            points: 40,
            checkCondition: (gameState) => {
                return (gameState.stats.oscarsWon || 0) >= 1;
            }
        },

        oscar_dynasty: {
            id: 'oscar_dynasty',
            title: 'Oscar Dynasty',
            description: 'Win 5+ Oscars',
            icon: '👑',
            category: 'oscars',
            points: 75,
            checkCondition: (gameState) => {
                return (gameState.stats.oscarsWon || 0) >= 5;
            }
        },

        // Genre Achievements
        genre_specialist_noir: {
            id: 'genre_specialist_noir',
            title: 'Noir Specialist',
            description: 'Produce 5+ film noir pictures',
            icon: '🕵️',
            category: 'genre',
            points: 30,
            checkCondition: (gameState) => {
                const noirFilms = (gameState.completedFilms || []).filter(f => f.genre === 'noir');
                return noirFilms.length >= 5;
            }
        },

        genre_specialist_musical: {
            id: 'genre_specialist_musical',
            title: 'Musical Maestro',
            description: 'Produce 5+ musicals',
            icon: '🎵',
            category: 'genre',
            points: 30,
            checkCondition: (gameState) => {
                const musicals = (gameState.completedFilms || []).filter(f => f.genre === 'musical');
                return musicals.length >= 5;
            }
        },

        renaissance_studio: {
            id: 'renaissance_studio',
            title: 'Renaissance Studio',
            description: 'Produce films in 8+ different genres',
            icon: '🎬',
            category: 'genre',
            points: 40,
            checkCondition: (gameState) => {
                const genres = new Set((gameState.completedFilms || []).map(f => f.genre));
                return genres.size >= 8;
            }
        },

        // Challenge Achievements
        bootstrapper: {
            id: 'bootstrapper',
            title: 'Bootstrapper',
            description: 'Complete the game without taking any loans',
            icon: '💪',
            category: 'challenge',
            points: 50,
            secret: true,
            checkCondition: (gameState) => {
                var endYear = (window.GameConstants && window.GameConstants.GAME_END_YEAR) || 2010;
                return gameState.gameYear >= endYear &&
                       (!gameState.loans || gameState.loans.length === 0);
            }
        },

        perfectionist: {
            id: 'perfectionist',
            title: 'Perfectionist',
            description: 'Complete the game with no films below quality 60',
            icon: '⭐',
            category: 'challenge',
            points: 60,
            secret: true,
            checkCondition: (gameState) => {
                var endYear = (window.GameConstants && window.GameConstants.GAME_END_YEAR) || 2010;
                if (gameState.gameYear < endYear) return false;
                const lowQualityFilms = (gameState.completedFilms || []).filter(f => f.quality < 60);
                return lowQualityFilms.length === 0 && gameState.stats.filmsProduced >= 10;
            }
        },

        risk_taker: {
            id: 'risk_taker',
            title: 'Risk Taker',
            description: 'Survive bankruptcy with less than $5,000 cash',
            icon: '🎲',
            category: 'challenge',
            points: 30,
            checkCondition: (gameState) => {
                // Track minimum cash reached
                if (!gameState.minCashReached) gameState.minCashReached = gameState.cash;
                if (gameState.cash < gameState.minCashReached) {
                    gameState.minCashReached = gameState.cash;
                }
                return gameState.minCashReached < 5000 && gameState.cash > 10000;
            }
        },

        speed_runner: {
            id: 'speed_runner',
            title: 'Speed Runner',
            description: 'Reach 2010 in under 4000 weeks',
            icon: '⚡',
            category: 'challenge',
            points: 40,
            secret: true,
            checkCondition: (gameState) => {
                var endYear = (window.GameConstants && window.GameConstants.GAME_END_YEAR) || 2010;
                return gameState.gameYear >= endYear && gameState.gameWeek < 4000;
            }
        },

        // Secret/Easter Egg Achievements
        orson_welles: {
            id: 'orson_welles',
            title: 'Citizen Kane',
            description: 'Produce a masterpiece that loses money',
            icon: '🎭',
            category: 'secret',
            points: 35,
            secret: true,
            checkCondition: (gameState) => {
                const criticalFlops = (gameState.completedFilms || []).filter(f =>
                    f.quality >= 90 && (f.totalRevenue || 0) < f.budget
                );
                return criticalFlops.length >= 1;
            }
        },

        b_movie_factory: {
            id: 'b_movie_factory',
            title: 'B-Movie Factory',
            description: 'Produce 10 films with budgets under $50,000',
            icon: '📼',
            category: 'secret',
            points: 25,
            secret: true,
            checkCondition: (gameState) => {
                const bMovies = (gameState.completedFilms || []).filter(f => f.budget < 50000);
                return bMovies.length >= 10;
            }
        },

        epic_ambition: {
            id: 'epic_ambition',
            title: 'Epic Ambition',
            description: 'Produce a film with a $200,000+ budget',
            icon: '🎪',
            category: 'secret',
            points: 35,
            secret: true,
            checkCondition: (gameState) => {
                return (gameState.completedFilms || []).some(f => f.budget >= 200000);
            }
        },

        scandal_survivor: {
            id: 'scandal_survivor',
            title: 'Scandal Survivor',
            description: 'Navigate 5+ crisis events successfully',
            icon: '🎭',
            category: 'secret',
            points: 40,
            secret: true,
            checkCondition: (gameState) => {
                return (gameState.crises || []).filter(c => c.resolved).length >= 5;
            }
        }
    };

    // Track unlocked achievements
    let unlockedAchievements = new Set();

    /**
     * Check all achievements against current game state
     */
    function checkAchievements(gameState) {
        const newlyUnlocked = [];

        for (const achievementId in ACHIEVEMENTS) {
            const achievement = ACHIEVEMENTS[achievementId];

            // Skip if already unlocked
            if (unlockedAchievements.has(achievementId)) {
                continue;
            }

            // Check if condition is met
            if (achievement.checkCondition(gameState)) {
                unlockAchievement(achievementId, gameState);
                newlyUnlocked.push(achievement);
            }
        }

        return newlyUnlocked;
    }

    /**
     * Unlock an achievement
     */
    function unlockAchievement(achievementId, gameState) {
        if (unlockedAchievements.has(achievementId)) return;

        unlockedAchievements.add(achievementId);
        const achievement = ACHIEVEMENTS[achievementId];


        // Show notification
        showAchievementNotification(achievement);

        // Add to game state
        if (!gameState.achievementsUnlocked) {
            gameState.achievementsUnlocked = [];
        }
        gameState.achievementsUnlocked.push({
            id: achievementId,
            unlockedAt: new Date(gameState.currentDate),
            gameWeek: gameState.gameWeek,
            gameYear: gameState.gameYear
        });

        // Add points to total
        if (!gameState.achievementPoints) {
            gameState.achievementPoints = 0;
        }
        gameState.achievementPoints += achievement.points;
    }

    /**
     * Show achievement notification
     */
    function showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-details">
                <div class="achievement-title">🏆 Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.title}</div>
                <div class="achievement-description">${achievement.description}</div>
                <div class="achievement-points">+${achievement.points} points</div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 5000);

        // Also add to alert system
        window.HollywoodMogul.addAlert({
            type: 'success',
            icon: achievement.icon,
            message: `Achievement: ${achievement.title}`,
            priority: 'medium'
        });
    }

    /**
     * Get all achievements
     */
    function getAllAchievements() {
        return ACHIEVEMENTS;
    }

    /**
     * Get unlocked achievements
     */
    function getUnlockedAchievements() {
        return Array.from(unlockedAchievements).map(id => ACHIEVEMENTS[id]);
    }

    /**
     * Get achievement progress
     */
    function getProgress() {
        const total = Object.keys(ACHIEVEMENTS).length;
        const unlocked = unlockedAchievements.size;
        const percentage = Math.round((unlocked / total) * 100);

        return {
            total,
            unlocked,
            percentage,
            remaining: total - unlocked
        };
    }

    /**
     * Get achievements by category
     */
    function getAchievementsByCategory(category) {
        const achievements = [];

        for (const id in ACHIEVEMENTS) {
            const achievement = ACHIEVEMENTS[id];
            if (achievement.category === category) {
                achievements.push({
                    ...achievement,
                    unlocked: unlockedAchievements.has(id)
                });
            }
        }

        return achievements;
    }

    /**
     * Get total achievement points
     */
    function getTotalPoints() {
        let total = 0;
        for (const id of unlockedAchievements) {
            total += ACHIEVEMENTS[id].points;
        }
        return total;
    }

    /**
     * Reset achievements (for new game)
     */
    function reset() {
        unlockedAchievements.clear();
    }

    /**
     * Load achievements from game state
     */
    function loadFromGameState(gameState) {
        unlockedAchievements.clear();

        if (gameState.achievementsUnlocked) {
            for (const record of gameState.achievementsUnlocked) {
                unlockedAchievements.add(record.id);
            }
        }
    }

    // Public API
    return {
        checkAchievements,
        unlockAchievement,
        getAllAchievements,
        getUnlockedAchievements,
        getProgress,
        getAchievementsByCategory,
        getTotalPoints,
        reset,
        loadFromGameState,
        ACHIEVEMENTS
    };
})();
