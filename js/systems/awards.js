/**
 * HOLLYWOOD MOGUL - ANNUAL AWARDS CEREMONY SYSTEM
 * Simulates Oscar-like awards for films released each calendar year
 */
window.AwardsSystem = (function() {
    'use strict';

    const AWARD_CATEGORIES = [
        { id: 'best_picture', name: 'Best Picture', icon: '🏆' },
        { id: 'best_director', name: 'Best Director', icon: '🎬' },
        { id: 'best_actor', name: 'Best Actor', icon: '🎭' },
        { id: 'best_actress', name: 'Best Actress', icon: '👑' },
        { id: 'best_screenplay', name: 'Best Screenplay', icon: '📜' }
    ];

    let pendingNominations = null;

    /**
     * Check if we should trigger awards events this month
     * Called from monthly event processing
     */
    function checkAwardsEvents(gameState) {
        const currentDate = window.TimeSystem ? window.TimeSystem.getCurrentDate() :
                          { month: gameState.currentDate.getMonth() + 1, year: gameState.currentDate.getFullYear() };

        // Nominations announced in January
        if (currentDate.month === 1 && !hasAnnouncedNominationsThisYear(gameState, currentDate.year)) {
            announceNominations(gameState, currentDate.year);
        }

        // Ceremony held in February
        if (currentDate.month === 2 && !hasHeldCeremonyThisYear(gameState, currentDate.year)) {
            holdAwardsCeremony(gameState, currentDate.year);
        }
    }

    /**
     * Announce award nominations in January
     */
    function announceNominations(gameState, currentYear) {
        const previousYear = currentYear - 1;
        const eligibleFilms = getEligibleFilms(gameState, previousYear);

        if (eligibleFilms.length === 0) {
            return; // No films to nominate
        }

        const nominations = generateNominations(eligibleFilms);
        pendingNominations = {
            year: previousYear,
            nominations: nominations,
            announced: true
        };

        // Store in game state
        if (!gameState.awardsHistory) {
            gameState.awardsHistory = [];
        }

        showNominationsModal(nominations, previousYear, eligibleFilms);

        // Add event notification
        if (window.HollywoodMogul && typeof window.HollywoodMogul.addEvent === 'function') {
            const playerNominations = countPlayerNominations(nominations, eligibleFilms);
            if (playerNominations > 0) {
                window.HollywoodMogul.addEvent({
                    type: 'awards',
                    title: 'Award Nominations Announced!',
                    message: `Your studio received ${playerNominations} nomination${playerNominations > 1 ? 's' : ''} for films from ${previousYear}`,
                    severity: 'success'
                });
            }
        }
    }

    /**
     * Hold awards ceremony in February
     */
    function holdAwardsCeremony(gameState, currentYear) {
        if (!pendingNominations) {
            return; // No nominations to award
        }

        const winners = determineWinners(pendingNominations.nominations);
        const ceremonyResults = {
            year: pendingNominations.year,
            winners: winners,
            held: true
        };

        // Store in awards history
        if (!gameState.awardsHistory) {
            gameState.awardsHistory = [];
        }
        gameState.awardsHistory.push(ceremonyResults);

        // Update player stats for wins
        const playerWins = countPlayerWins(winners, gameState);
        if (playerWins > 0) {
            gameState.stats.oscarsWon = (gameState.stats.oscarsWon || 0) + playerWins;
        }

        showCeremonyModal(winners, pendingNominations.year, pendingNominations.nominations, gameState);

        // Clear pending nominations
        pendingNominations = null;

        // Update talent morale based on wins
        if (window.TalentRoster && window.TalentRoster.updateMoraleAfterAwards) {
            window.TalentRoster.updateMoraleAfterAwards(winners, gameState);
        }
    }

    /**
     * Get films eligible for awards (released in previous calendar year)
     */
    function getEligibleFilms(gameState, year) {
        const allFilms = [
            ...(gameState.completedFilms || []),
            ...(gameState.films || [])
        ];

        return allFilms.filter(film => {
            if (!film.distribution || !film.distribution.releaseDate) {
                return false;
            }

            const releaseYear = film.distribution.releaseDate.year ||
                              new Date(film.distribution.releaseDate).getFullYear();

            return releaseYear === year;
        });
    }

    /**
     * Generate nominations using scoring formula
     */
    function generateNominations(eligibleFilms) {
        const nominations = {};

        AWARD_CATEGORIES.forEach(category => {
            const scores = eligibleFilms.map(film => ({
                film: film,
                score: calculateAwardScore(film, category.id)
            }));

            // Sort by score and take top 5
            scores.sort((a, b) => b.score - a.score);
            nominations[category.id] = scores.slice(0, 5).map(s => s.film);
        });

        return nominations;
    }

    /**
     * Calculate award score for a film in a category
     * Scoring: quality (40%), marketing (20%), cultural timing (20%), genre heat (20%)
     */
    function calculateAwardScore(film, categoryId) {
        let score = 0;

        // Quality component (40%)
        const quality = film.finalQuality || film.scriptQuality || 50;
        score += quality * 0.4;

        // Marketing component (20%)
        const marketingBudget = film.distribution?.marketingCost || 0;
        const marketingScore = Math.min(100, (marketingBudget / 50000) * 100);
        score += marketingScore * 0.2;

        // Cultural timing component (20%)
        const culturalScore = getCulturalTimingScore(film);
        score += culturalScore * 0.2;

        // Genre heat component (20%)
        const genreScore = getGenreAwardScore(film, categoryId);
        score += genreScore * 0.2;

        // Add random variance (±10%)
        const variance = (Math.random() - 0.5) * 20;
        score += variance;

        // Category-specific bonuses
        if (categoryId === 'best_director' && film.director) {
            score += (film.director.talent || 60) * 0.1;
        }

        if ((categoryId === 'best_actor' || categoryId === 'best_actress') && film.cast) {
            const castScore = film.cast.reduce((sum, actor) => sum + (actor.starPower || 50), 0) / film.cast.length;
            score += castScore * 0.1;
        }

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Get cultural timing score (prestige genres score higher)
     */
    function getCulturalTimingScore(film) {
        const prestigeGenres = {
            'drama': 90,
            'biography': 85,
            'war': 80,
            'historical': 85,
            'romance': 70,
            'thriller': 60,
            'noir': 75,
            'western': 65,
            'musical': 70,
            'comedy': 55,
            'crime': 60,
            'horror': 40
        };

        return prestigeGenres[film.genre?.toLowerCase()] || 50;
    }

    /**
     * Get genre award score
     */
    function getGenreAwardScore(film, categoryId) {
        // Drama and prestige films score higher in awards
        const genre = film.genre?.toLowerCase() || 'drama';

        if (['drama', 'biography', 'war', 'historical'].includes(genre)) {
            return 85;
        }
        if (['romance', 'noir', 'musical'].includes(genre)) {
            return 70;
        }
        if (['western', 'thriller', 'crime'].includes(genre)) {
            return 60;
        }
        return 50;
    }

    /**
     * Determine winners from nominations
     */
    function determineWinners(nominations) {
        const winners = {};

        AWARD_CATEGORIES.forEach(category => {
            const nominees = nominations[category.id];
            if (nominees && nominees.length > 0) {
                // Winner is based on score with some randomness
                const scores = nominees.map(film => ({
                    film: film,
                    score: calculateAwardScore(film, category.id) * (0.8 + Math.random() * 0.4)
                }));
                scores.sort((a, b) => b.score - a.score);
                winners[category.id] = scores[0].film;
            }
        });

        return winners;
    }

    /**
     * Count player nominations
     */
    function countPlayerNominations(nominations, eligibleFilms) {
        let count = 0;
        AWARD_CATEGORIES.forEach(category => {
            const nominees = nominations[category.id] || [];
            nominees.forEach(film => {
                if (isPlayerFilm(film, eligibleFilms)) {
                    count++;
                }
            });
        });
        return count;
    }

    /**
     * Count player wins
     */
    function countPlayerWins(winners, gameState) {
        let count = 0;
        const playerFilmIds = [
            ...(gameState.completedFilms || []),
            ...(gameState.films || [])
        ].map(f => f.id);

        AWARD_CATEGORIES.forEach(category => {
            const winner = winners[category.id];
            if (winner && playerFilmIds.includes(winner.id)) {
                count++;
            }
        });
        return count;
    }

    /**
     * Check if film is from player's studio
     */
    function isPlayerFilm(film, eligibleFilms) {
        return eligibleFilms.some(f => f.id === film.id);
    }

    /**
     * Show nominations modal
     */
    function showNominationsModal(nominations, year, eligibleFilms) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay awards-overlay';

        let nominationsHTML = '';
        AWARD_CATEGORIES.forEach(category => {
            const nominees = nominations[category.id] || [];
            nominationsHTML += `
                <div class="award-category">
                    <h3 class="category-title">
                        <span class="category-icon">${category.icon}</span>
                        ${category.name}
                    </h3>
                    <div class="nominees-list">
                        ${nominees.map(film => {
                            const isPlayer = isPlayerFilm(film, eligibleFilms);
                            return `
                                <div class="nominee-item ${isPlayer ? 'player-nominee' : ''}">
                                    <span class="nominee-title">"${film.title}"</span>
                                    ${isPlayer ? '<span class="player-badge">YOUR STUDIO</span>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        });

        modal.innerHTML = `
            <div class="modal awards-modal">
                <div class="awards-header nominations-header">
                    <h2 class="awards-title">AWARD NOMINATIONS ANNOUNCED</h2>
                    <div class="awards-year">For Films of ${year}</div>
                </div>
                <div class="awards-content">
                    <div class="nominations-intro">
                        The industry has spoken! Here are the nominees for this year's most prestigious awards.
                    </div>
                    ${nominationsHTML}
                    <div class="awards-actions">
                        <button class="awards-btn cta-button" id="close-nominations">
                            ACKNOWLEDGED
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('close-nominations').addEventListener('click', () => {
            modal.remove();
        });
    }

    /**
     * Show ceremony modal with winners
     */
    function showCeremonyModal(winners, year, nominations, gameState) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay awards-overlay ceremony-overlay';

        const playerWins = countPlayerWins(winners, gameState);

        let winnersHTML = '';
        AWARD_CATEGORIES.forEach(category => {
            const winner = winners[category.id];
            if (winner) {
                const isPlayer = isPlayerFilm(winner, gameState.completedFilms || []);
                winnersHTML += `
                    <div class="award-winner ${isPlayer ? 'player-winner' : ''}">
                        <div class="winner-category">
                            <span class="category-icon">${category.icon}</span>
                            ${category.name}
                        </div>
                        <div class="winner-film">
                            <div class="winner-title">"${winner.title}"</div>
                            ${isPlayer ?
                                '<div class="winner-badge">YOUR STUDIO WINS!</div>' :
                                `<div class="winner-studio">${getCompetitorStudio()}</div>`
                            }
                        </div>
                    </div>
                `;
            }
        });

        const ceremonyMessage = playerWins > 0 ?
            `Congratulations! Your studio won ${playerWins} award${playerWins > 1 ? 's' : ''}!` :
            'Better luck next year. Keep making great pictures!';

        modal.innerHTML = `
            <div class="modal awards-modal ceremony-modal">
                <div class="awards-header ceremony-header">
                    <h2 class="awards-title">AWARDS CEREMONY ${year}</h2>
                    <div class="ceremony-tagline">Hollywood's Biggest Night</div>
                </div>
                <div class="awards-content">
                    <div class="ceremony-intro ${playerWins > 0 ? 'triumph' : ''}">
                        ${ceremonyMessage}
                    </div>
                    <div class="winners-list">
                        ${winnersHTML}
                    </div>
                    ${playerWins > 0 ? `
                        <div class="player-wins-summary">
                            <div class="wins-count">${playerWins}</div>
                            <div class="wins-label">Award${playerWins > 1 ? 's' : ''} Won</div>
                            <div class="wins-impact">
                                Studio reputation has increased! Talent morale boosted!
                            </div>
                        </div>
                    ` : ''}
                    <div class="awards-actions">
                        <button class="awards-btn cta-button" id="close-ceremony">
                            CONTINUE
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('close-ceremony').addEventListener('click', () => {
            modal.remove();
        });

        // Add confetti effect for player wins
        if (playerWins > 0) {
            addConfettiEffect(modal);
        }
    }

    /**
     * Get random competitor studio name
     */
    function getCompetitorStudio() {
        const studios = ['MGM', 'Warner Bros.', 'Paramount', 'RKO', '20th Century Fox', 'Columbia', 'Universal'];
        return studios[Math.floor(Math.random() * studios.length)];
    }

    /**
     * Add confetti animation for wins
     */
    function addConfettiEffect(modal) {
        const ceremonyModal = modal.querySelector('.ceremony-modal');
        if (ceremonyModal) {
            ceremonyModal.classList.add('confetti-active');

            // Create confetti particles
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-particle';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.animationDelay = Math.random() * 3 + 's';
                confetti.style.backgroundColor = ['#B8860B', '#DAA520', '#FFD700'][Math.floor(Math.random() * 3)];
                ceremonyModal.appendChild(confetti);
            }
        }
    }

    /**
     * Check if nominations announced this year
     */
    function hasAnnouncedNominationsThisYear(gameState, year) {
        if (!gameState.awardsHistory) return false;
        return gameState.awardsHistory.some(a => a.year === year - 1 && a.announced);
    }

    /**
     * Check if ceremony held this year
     */
    function hasHeldCeremonyThisYear(gameState, year) {
        if (!gameState.awardsHistory) return false;
        return gameState.awardsHistory.some(a => a.year === year - 1 && a.held);
    }

    /**
     * Initialize system - register with monthly events
     */
    function init() {
        console.log('Awards System initialized');
    }

    // Public API
    return {
        init: init,
        checkAwardsEvents: checkAwardsEvents,
        calculateAwardScore: calculateAwardScore
    };
})();
