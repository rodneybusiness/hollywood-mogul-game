/**
 * HOLLYWOOD MOGUL - ACADEMY AWARDS SYSTEM
 * Annual Oscar ceremonies, nominations, and industry prestige
 */

window.AwardsSystem = (function() {
    'use strict';

    // Oscar categories
    const CATEGORIES = {
        BEST_PICTURE: {
            id: 'best_picture',
            name: 'Best Picture',
            nominees: 5,
            prestige: 100,
            icon: '🏆'
        },
        BEST_DIRECTOR: {
            id: 'best_director',
            name: 'Best Director',
            nominees: 5,
            prestige: 80,
            icon: '🎬'
        },
        BEST_ACTOR: {
            id: 'best_actor',
            name: 'Best Actor',
            nominees: 5,
            prestige: 70,
            icon: '🎭'
        },
        BEST_ACTRESS: {
            id: 'best_actress',
            name: 'Best Actress',
            nominees: 5,
            prestige: 70,
            icon: '🎭'
        },
        BEST_SCREENPLAY: {
            id: 'best_screenplay',
            name: 'Best Original Screenplay',
            nominees: 5,
            prestige: 60,
            icon: '📝'
        },
        SPECIAL_ACHIEVEMENT: {
            id: 'special_achievement',
            name: 'Special Achievement',
            nominees: 3,
            prestige: 50,
            icon: '⭐'
        }
    };

    // Historical Oscar winners (1934-1949) - Real data for historical accuracy
    const HISTORICAL_WINNERS = {
        1934: {
            best_picture: 'It Happened One Night',
            best_director: 'Frank Capra',
            studio: 'Columbia Pictures'
        },
        1935: {
            best_picture: 'Mutiny on the Bounty',
            best_director: 'John Ford (The Informer)',
            studio: 'Metro-Goldwyn-Mayer'
        },
        1936: {
            best_picture: 'The Great Ziegfeld',
            best_director: 'Frank Capra (Mr. Deeds Goes to Town)',
            studio: 'Metro-Goldwyn-Mayer'
        },
        1937: {
            best_picture: 'The Life of Emile Zola',
            best_director: 'Leo McCarey (The Awful Truth)',
            studio: 'Warner Bros.'
        },
        1938: {
            best_picture: 'You Can\'t Take It with You',
            best_director: 'Frank Capra',
            studio: 'Columbia Pictures'
        },
        1939: {
            best_picture: 'Gone with the Wind',
            best_director: 'Victor Fleming',
            studio: 'Selznick International / MGM'
        },
        1940: {
            best_picture: 'Rebecca',
            best_director: 'John Ford (The Grapes of Wrath)',
            studio: 'Selznick International'
        },
        1941: {
            best_picture: 'How Green Was My Valley',
            best_director: 'John Ford',
            studio: '20th Century Fox'
        },
        1942: {
            best_picture: 'Mrs. Miniver',
            best_director: 'William Wyler',
            studio: 'Metro-Goldwyn-Mayer'
        },
        1943: {
            best_picture: 'Casablanca',
            best_director: 'Michael Curtiz',
            studio: 'Warner Bros.'
        },
        1944: {
            best_picture: 'Going My Way',
            best_director: 'Leo McCarey',
            studio: 'Paramount Pictures'
        },
        1945: {
            best_picture: 'The Lost Weekend',
            best_director: 'Billy Wilder',
            studio: 'Paramount Pictures'
        },
        1946: {
            best_picture: 'The Best Years of Our Lives',
            best_director: 'William Wyler',
            studio: 'Samuel Goldwyn Productions'
        },
        1947: {
            best_picture: 'Gentleman\'s Agreement',
            best_director: 'Elia Kazan',
            studio: '20th Century Fox'
        },
        1948: {
            best_picture: 'Hamlet',
            best_director: 'John Huston (The Treasure of the Sierra Madre)',
            studio: 'J. Arthur Rank'
        },
        1949: {
            best_picture: 'All the King\'s Men',
            best_director: 'Joseph L. Mankiewicz (A Letter to Three Wives)',
            studio: 'Columbia Pictures'
        },
        1950: {
            best_picture: 'All About Eve',
            best_director: 'Joseph L. Mankiewicz',
            studio: '20th Century Fox'
        },
        1951: {
            best_picture: 'An American in Paris',
            best_director: 'Vincente Minnelli',
            studio: 'Metro-Goldwyn-Mayer'
        },
        1952: {
            best_picture: 'The Greatest Show on Earth',
            best_director: 'Cecil B. DeMille',
            studio: 'Paramount Pictures'
        },
        1953: {
            best_picture: 'From Here to Eternity',
            best_director: 'Fred Zinnemann',
            studio: 'Columbia Pictures'
        },
        1954: {
            best_picture: 'On the Waterfront',
            best_director: 'Elia Kazan',
            studio: 'Columbia Pictures'
        },
        1955: {
            best_picture: 'Marty',
            best_director: 'Delbert Mann',
            studio: 'United Artists'
        },
        1956: {
            best_picture: 'Around the World in 80 Days',
            best_director: 'Michael Anderson',
            studio: 'United Artists'
        },
        1957: {
            best_picture: 'The Bridge on the River Kwai',
            best_director: 'David Lean',
            studio: 'Columbia Pictures'
        },
        1958: {
            best_picture: 'Gigi',
            best_director: 'Vincente Minnelli',
            studio: 'Metro-Goldwyn-Mayer'
        },
        1959: {
            best_picture: 'Ben-Hur',
            best_director: 'William Wyler',
            studio: 'Metro-Goldwyn-Mayer'
        },
        1960: {
            best_picture: 'The Apartment',
            best_director: 'Billy Wilder',
            studio: 'United Artists'
        },
        1961: {
            best_picture: 'West Side Story',
            best_director: 'Robert Wise / Jerome Robbins',
            studio: 'United Artists'
        },
        1962: {
            best_picture: 'Lawrence of Arabia',
            best_director: 'David Lean',
            studio: 'Columbia Pictures'
        },
        1963: {
            best_picture: 'Tom Jones',
            best_director: 'Tony Richardson',
            studio: 'United Artists'
        },
        1964: {
            best_picture: 'My Fair Lady',
            best_director: 'George Cukor',
            studio: 'Warner Bros.'
        },
        1965: {
            best_picture: 'The Sound of Music',
            best_director: 'Robert Wise',
            studio: '20th Century Fox'
        },
        1966: {
            best_picture: 'A Man for All Seasons',
            best_director: 'Fred Zinnemann',
            studio: 'Columbia Pictures'
        },
        1967: {
            best_picture: 'In the Heat of the Night',
            best_director: 'Norman Jewison',
            studio: 'United Artists'
        },
        1968: {
            best_picture: 'Oliver!',
            best_director: 'Carol Reed',
            studio: 'Columbia Pictures'
        },
        1969: {
            best_picture: 'Midnight Cowboy',
            best_director: 'John Schlesinger',
            studio: 'United Artists'
        },
        1970: {
            best_picture: 'Patton',
            best_director: 'Franklin J. Schaffner',
            studio: '20th Century Fox'
        },
        1971: {
            best_picture: 'The French Connection',
            best_director: 'William Friedkin',
            studio: '20th Century Fox'
        },
        1972: {
            best_picture: 'The Godfather',
            best_director: 'Francis Ford Coppola',
            studio: 'Paramount Pictures'
        },
        1973: {
            best_picture: 'The Sting',
            best_director: 'George Roy Hill',
            studio: 'Universal Pictures'
        },
        1974: {
            best_picture: 'The Godfather Part II',
            best_director: 'Francis Ford Coppola',
            studio: 'Paramount Pictures'
        },
        1975: {
            best_picture: 'One Flew Over the Cuckoo\'s Nest',
            best_director: 'Milos Forman',
            studio: 'United Artists'
        },
        1976: {
            best_picture: 'Rocky',
            best_director: 'John G. Avildsen',
            studio: 'United Artists'
        },
        1977: {
            best_picture: 'Annie Hall',
            best_director: 'Woody Allen',
            studio: 'United Artists'
        },
        1978: {
            best_picture: 'The Deer Hunter',
            best_director: 'Michael Cimino',
            studio: 'Universal Pictures'
        },
        1979: {
            best_picture: 'Kramer vs. Kramer',
            best_director: 'Robert Benton',
            studio: 'Columbia Pictures'
        },
        1980: {
            best_picture: 'Ordinary People',
            best_director: 'Robert Redford',
            studio: 'Paramount Pictures'
        },
        1981: {
            best_picture: 'Chariots of Fire',
            best_director: 'Hugh Hudson',
            studio: 'Warner Bros.'
        },
        1982: {
            best_picture: 'Gandhi',
            best_director: 'Richard Attenborough',
            studio: 'Columbia Pictures'
        },
        1983: {
            best_picture: 'Terms of Endearment',
            best_director: 'James L. Brooks',
            studio: 'Paramount Pictures'
        },
        1984: {
            best_picture: 'Amadeus',
            best_director: 'Milos Forman',
            studio: 'Orion Pictures'
        },
        1985: {
            best_picture: 'Out of Africa',
            best_director: 'Sydney Pollack',
            studio: 'Universal Pictures'
        },
        1986: {
            best_picture: 'Platoon',
            best_director: 'Oliver Stone',
            studio: 'Orion Pictures'
        },
        1987: {
            best_picture: 'The Last Emperor',
            best_director: 'Bernardo Bertolucci',
            studio: 'Columbia Pictures'
        },
        1988: {
            best_picture: 'Rain Man',
            best_director: 'Barry Levinson',
            studio: 'United Artists'
        },
        1989: {
            best_picture: 'Driving Miss Daisy',
            best_director: 'Bruce Beresford',
            studio: 'Warner Bros.'
        },
        1990: {
            best_picture: 'Dances with Wolves',
            best_director: 'Kevin Costner',
            studio: 'Orion Pictures'
        },
        1991: {
            best_picture: 'The Silence of the Lambs',
            best_director: 'Jonathan Demme',
            studio: 'Orion Pictures'
        },
        1992: {
            best_picture: 'Unforgiven',
            best_director: 'Clint Eastwood',
            studio: 'Warner Bros.'
        },
        1993: {
            best_picture: 'Schindler\'s List',
            best_director: 'Steven Spielberg',
            studio: 'Universal Pictures'
        },
        1994: {
            best_picture: 'Forrest Gump',
            best_director: 'Robert Zemeckis',
            studio: 'Paramount Pictures'
        },
        1995: {
            best_picture: 'Braveheart',
            best_director: 'Mel Gibson',
            studio: 'Paramount Pictures'
        },
        1996: {
            best_picture: 'The English Patient',
            best_director: 'Anthony Minghella',
            studio: 'Miramax'
        },
        1997: {
            best_picture: 'Titanic',
            best_director: 'James Cameron',
            studio: 'Paramount Pictures / 20th Century Fox'
        },
        1998: {
            best_picture: 'Shakespeare in Love',
            best_director: 'John Madden',
            studio: 'Miramax'
        },
        1999: {
            best_picture: 'American Beauty',
            best_director: 'Sam Mendes',
            studio: 'DreamWorks'
        },
        2000: {
            best_picture: 'Gladiator',
            best_director: 'Ridley Scott',
            studio: 'DreamWorks'
        },
        2001: {
            best_picture: 'A Beautiful Mind',
            best_director: 'Ron Howard',
            studio: 'Universal Pictures'
        },
        2002: {
            best_picture: 'Chicago',
            best_director: 'Rob Marshall',
            studio: 'Miramax'
        },
        2003: {
            best_picture: 'The Lord of the Rings: The Return of the King',
            best_director: 'Peter Jackson',
            studio: 'New Line Cinema'
        },
        2004: {
            best_picture: 'Million Dollar Baby',
            best_director: 'Clint Eastwood',
            studio: 'Warner Bros.'
        },
        2005: {
            best_picture: 'Crash',
            best_director: 'Paul Haggis',
            studio: 'Lionsgate'
        },
        2006: {
            best_picture: 'The Departed',
            best_director: 'Martin Scorsese',
            studio: 'Warner Bros.'
        },
        2007: {
            best_picture: 'No Country for Old Men',
            best_director: 'Joel Coen / Ethan Coen',
            studio: 'Miramax'
        },
        2008: {
            best_picture: 'Slumdog Millionaire',
            best_director: 'Danny Boyle',
            studio: 'Fox Searchlight'
        },
        2009: {
            best_picture: 'The Hurt Locker',
            best_director: 'Kathryn Bigelow',
            studio: 'Summit Entertainment'
        },
        2010: {
            best_picture: 'The King\'s Speech',
            best_director: 'Tom Hooper',
            studio: 'The Weinstein Company'
        }
    };

    /**
     * Check if it's time for Oscar ceremony (March each year)
     */
    function shouldTriggerOscars(gameState) {
        const date = gameState.currentDate;
        const month = date.getMonth(); // 0-based
        const year = date.getFullYear();

        // First Oscar ceremony was in 1934 (for 1933 films)
        if (year < 1934) return false;

        // Ceremony in March (month 2)
        if (month === 2) {
            // Check if we've already done ceremony this year
            if (!gameState.oscarCeremonies) {
                gameState.oscarCeremonies = [];
            }

            const alreadyDone = gameState.oscarCeremonies.some(c => c.year === year);
            return !alreadyDone;
        }

        return false;
    }

    /**
     * Trigger annual Oscar ceremony
     */
    function triggerOscarCeremony(gameState) {
        const ceremonyYear = gameState.currentDate.getFullYear();
        const eligibleYear = ceremonyYear - 1; // Oscars honor previous year's films


        // Get eligible films (released in previous calendar year)
        const eligibleFilms = getEligibleFilms(gameState, eligibleYear);

        if (eligibleFilms.length === 0) {
            // No player films eligible, show historical winner
            showHistoricalOscarNotification(ceremonyYear, gameState);
            return;
        }

        // Generate AI rival films for competition
        const rivalFilms = generateRivalFilms(eligibleYear, gameState);
        const allFilms = [...eligibleFilms, ...rivalFilms];

        // Generate nominations
        const nominations = generateNominations(allFilms, ceremonyYear);

        // Determine winners
        const winners = determineWinners(nominations, gameState);

        // Record ceremony results
        const ceremony = {
            year: ceremonyYear,
            honoringYear: eligibleYear,
            nominations: nominations,
            winners: winners,
            playerNominations: countPlayerNominations(nominations, gameState),
            playerWins: countPlayerWins(winners, gameState)
        };

        if (!gameState.oscarCeremonies) {
            gameState.oscarCeremonies = [];
        }
        gameState.oscarCeremonies.push(ceremony);

        // Show ceremony modal with dramatic reveals
        showOscarCeremonyModal(ceremony, gameState);

        // Apply Oscar benefits
        applyOscarBenefits(ceremony, gameState);

        // Update statistics
        updateOscarStats(ceremony, gameState);

        // Check for Oscar achievements
        if (window.AchievementSystem) {
            window.AchievementSystem.checkAchievements(gameState);
        }
    }

    /**
     * Get films eligible for Oscars (released in specified year)
     */
    function getEligibleFilms(gameState, year) {
        const eligible = [];

        // Check completed films
        if (gameState.completedFilms) {
            gameState.completedFilms.forEach(film => {
                const releaseYear = film.releaseDate ? new Date(film.releaseDate).getFullYear() :
                                   film.yearReleased ||
                                   (film.startDate ? new Date(film.startDate).getFullYear() : null);

                if (releaseYear === year && film.phase === 'COMPLETED') {
                    eligible.push(film);
                }
            });
        }

        return eligible;
    }

    /**
     * Generate AI rival films for Oscar competition
     */
    function generateRivalFilms(year, gameState) {
        const rivals = [];
        const numRivals = 8 + Math.floor(Math.random() * 5); // 8-12 rival films

        const titles = [
            'The Magnificent Journey', 'Shadows of Tomorrow', 'Golden Dreams',
            'The Last Paradise', 'Echoes of Eternity', 'City of Angels',
            'The Wandering Heart', 'Midnight Serenade', 'The Silver Crown',
            'Beyond the Horizon', 'The Crimson Rose', 'Starlight Symphony',
            'The Velvet Touch', 'Whispers in the Dark', 'The Grand Illusion'
        ];

        const directors = [
            'Frank Capra', 'John Ford', 'Howard Hawks', 'William Wyler',
            'Billy Wilder', 'Alfred Hitchcock', 'Orson Welles', 'Michael Curtiz',
            'George Cukor', 'John Huston', 'Elia Kazan', 'Victor Fleming'
        ];

        const genres = ['drama', 'romance', 'comedy', 'western', 'noir', 'musical', 'war'];

        for (let i = 0; i < numRivals; i++) {
            const quality = 40 + Math.floor(Math.random() * 50); // 40-90 quality
            const boxOffice = 50000 + Math.floor(Math.random() * 300000);

            rivals.push({
                id: `rival_${year}_${i}`,
                title: titles[i % titles.length] + (i >= titles.length ? ` ${Math.floor(i / titles.length) + 1}` : ''),
                genre: genres[Math.floor(Math.random() * genres.length)],
                director: { name: directors[Math.floor(Math.random() * directors.length)] },
                quality: quality,
                scriptQuality: quality,
                finalQuality: quality,
                boxOfficeGross: boxOffice,
                yearReleased: year,
                isRival: true,
                studio: getRandomStudio()
            });
        }

        return rivals;
    }

    /**
     * Generate Oscar nominations across all categories
     */
    function generateNominations(films, ceremonyYear) {
        const nominations = {};

        // Best Picture - top 5 by combined quality + box office
        nominations.best_picture = selectNominees(films, 5, (film) => {
            const quality = film.finalQuality || film.quality || film.scriptQuality || 50;
            const boxOffice = film.boxOfficeGross || film.totalGross || 0;
            return quality * 0.6 + (boxOffice / 10000) * 0.4;
        });

        // Best Director - top 5 directors
        nominations.best_director = selectNominees(films, 5, (film) => {
            const quality = film.finalQuality || film.quality || film.scriptQuality || 50;
            const directorSkill = film.directorSkill || 70;
            return quality * 0.5 + directorSkill * 0.5;
        });

        // Best Actor/Actress - based on film quality and star power
        nominations.best_actor = selectNominees(films, 5, (film) => {
            const quality = film.finalQuality || film.quality || film.scriptQuality || 50;
            return quality + Math.random() * 20;
        });

        nominations.best_actress = selectNominees(films, 5, (film) => {
            const quality = film.finalQuality || film.quality || film.scriptQuality || 50;
            return quality + Math.random() * 20;
        });

        // Best Screenplay - quality focused
        nominations.best_screenplay = selectNominees(films, 5, (film) => {
            return film.scriptQuality || film.quality || 50;
        });

        // Special Achievement - technical films
        nominations.special_achievement = selectNominees(films, 3, (film) => {
            const isTechnical = ['musical', 'western', 'adventure'].includes(film.genre);
            const quality = film.finalQuality || film.quality || 50;
            return quality + (isTechnical ? 20 : 0);
        });

        return nominations;
    }

    /**
     * Select nominees using scoring function
     */
    function selectNominees(films, count, scoringFunc) {
        const scored = films.map(film => ({
            film: film,
            score: scoringFunc(film)
        }));

        // Sort by score descending
        scored.sort((a, b) => b.score - a.score);

        // Return top N
        return scored.slice(0, count).map(s => s.film);
    }

    /**
     * Determine winners from nominees
     */
    function determineWinners(nominations, gameState) {
        const winners = {};

        for (const category in nominations) {
            const nominees = nominations[category];
            if (nominees.length === 0) continue;

            // Score each nominee
            const scores = nominees.map(film => {
                let score = 0;

                // Quality is primary factor
                const quality = film.finalQuality || film.quality || film.scriptQuality || 50;
                score += quality * 0.5;

                // Box office success helps
                const boxOffice = film.boxOfficeGross || film.totalGross || 0;
                score += (boxOffice / 100000) * 0.2;

                // Genre bias (dramas favored for Best Picture)
                if (category === 'best_picture' && film.genre === 'drama') {
                    score += 15;
                }

                // Random factor (Academy is unpredictable!)
                score += Math.random() * 20;

                // Slight bias against player (winning should be earned)
                if (!film.isRival) {
                    score -= 5;
                }

                return { film, score };
            });

            // Sort and pick winner
            scores.sort((a, b) => b.score - a.score);
            winners[category] = scores[0].film;
        }

        return winners;
    }

    /**
     * Show Oscar ceremony with dramatic reveals
     */
    function showOscarCeremonyModal(ceremony, gameState) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay oscar-ceremony-modal';

        const playerNoms = ceremony.playerNominations;
        const playerWins = ceremony.playerWins;

        modal.innerHTML = `
            <div class="modal oscar-modal">
                <div class="oscar-header">
                    <div class="oscar-statue">🏆</div>
                    <h2 class="oscar-title">Academy Awards ${ceremony.year}</h2>
                    <p class="oscar-subtitle">Honoring films of ${ceremony.honoringYear}</p>
                </div>

                <div class="modal-content oscar-content">
                    ${playerNoms > 0 ? `
                        <div class="oscar-summary">
                            <div class="summary-stat">
                                <span class="stat-label">Your Nominations</span>
                                <span class="stat-value">${playerNoms}</span>
                            </div>
                            <div class="summary-stat">
                                <span class="stat-label">Your Wins</span>
                                <span class="stat-value wins">${playerWins}</span>
                            </div>
                        </div>
                    ` : `
                        <div class="no-nominations">
                            <p>Your studio had no nominations this year.</p>
                            <p class="historical-note">The competition was fierce in ${ceremony.honoringYear}.</p>
                        </div>
                    `}

                    <div class="oscar-categories">
                        ${Object.keys(CATEGORIES).map(categoryKey => {
                            const category = CATEGORIES[categoryKey];
                            const nominees = ceremony.nominations[category.id] || [];
                            const winner = ceremony.winners[category.id];

                            if (!winner) return '';

                            const isPlayerWin = winner && !winner.isRival;

                            return `
                                <div class="oscar-category ${isPlayerWin ? 'player-win' : ''}">
                                    <div class="category-header">
                                        <span class="category-icon">${category.icon}</span>
                                        <h3 class="category-name">${category.name}</h3>
                                    </div>

                                    <div class="nominees-list">
                                        ${nominees.map(film => {
                                            const isWinner = film.id === winner.id;
                                            const isPlayerFilm = !film.isRival;
                                            return `
                                                <div class="nominee ${isWinner ? 'winner' : ''} ${isPlayerFilm ? 'player-film' : ''}">
                                                    ${isWinner ? '<span class="winner-badge">WINNER</span>' : ''}
                                                    <span class="film-title">${film.title}</span>
                                                    ${isPlayerFilm ? '<span class="studio-badge">YOUR STUDIO</span>' : ''}
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>

                                    ${isPlayerWin ? `
                                        <div class="win-celebration">
                                            <div class="confetti">🎉</div>
                                            <p class="win-message">Congratulations! "${winner.title}" wins ${category.name}!</p>
                                        </div>
                                    ` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>

                    ${getHistoricalContext(ceremony.year)}
                </div>

                <div class="modal-actions">
                    <button class="close-oscar-btn cta-button">CONTINUE</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Bind close button
        modal.querySelector('.close-oscar-btn').onclick = () => {
            modal.remove();

            // Show achievement if won Oscar
            if (playerWins > 0) {
                if (window.DashboardUI) {
                    window.DashboardUI.showNotification(
                        'Oscar Winner!',
                        `Your studio won ${playerWins} Academy Award${playerWins > 1 ? 's' : ''}!`,
                        'success'
                    );
                }
            }
        };

        // Close on overlay click
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }

    /**
     * Show historical Oscar notification when player not nominated
     */
    function showHistoricalOscarNotification(year, gameState) {
        const historical = HISTORICAL_WINNERS[year];

        if (!historical) return;

        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'historical',
                icon: '🏆',
                message: `Academy Awards ${year}: "${historical.best_picture}" wins Best Picture`,
                priority: 'medium'
            });
        }

        // Still record the ceremony
        if (!gameState.oscarCeremonies) {
            gameState.oscarCeremonies = [];
        }

        gameState.oscarCeremonies.push({
            year: year,
            honoringYear: year - 1,
            historicalOnly: true,
            winner: historical.best_picture
        });
    }

    /**
     * Apply benefits from Oscar wins/nominations
     */
    function applyOscarBenefits(ceremony, gameState) {
        const wins = ceremony.playerWins;
        const nominations = ceremony.playerNominations;

        if (nominations === 0) return;

        // Reputation boost for nominations
        const reputationBoost = (nominations * 2) + (wins * 5);
        gameState.reputation = Math.min(100, gameState.reputation + reputationBoost);

        // Box office bump for Oscar-nominated films still in theaters
        if (gameState.completedFilms) {
            gameState.completedFilms.forEach(film => {
                if (isFilmNominated(film, ceremony)) {
                    // Mark film as Oscar-nominated for box office boost
                    film.oscarNominated = true;
                    film.oscarNominations = countFilmNominations(film, ceremony);

                    if (isFilmWinner(film, ceremony)) {
                        film.oscarWinner = true;
                        film.oscarWins = countFilmWins(film, ceremony);
                    }
                }
            });
        }

        // Increase salaries for Oscar-winning talent (future mechanic)
        // This will be used when talent system is fully implemented

        // Achievement: Oscar-Winning Studio
        if (wins > 0) {
            gameState.isOscarWinningStudio = true;
        }

    }

    /**
     * Update Oscar statistics in game state
     */
    function updateOscarStats(ceremony, gameState) {
        if (!gameState.stats) {
            gameState.stats = {};
        }

        gameState.stats.oscarNominations = (gameState.stats.oscarNominations || 0) + ceremony.playerNominations;
        gameState.stats.oscarsWon = (gameState.stats.oscarsWon || 0) + ceremony.playerWins;

    }

    /**
     * Check if film was nominated
     */
    function isFilmNominated(film, ceremony) {
        for (const category in ceremony.nominations) {
            const nominees = ceremony.nominations[category];
            if (nominees.some(n => n.id === film.id)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if film won any awards
     */
    function isFilmWinner(film, ceremony) {
        for (const category in ceremony.winners) {
            const winner = ceremony.winners[category];
            if (winner && winner.id === film.id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Count nominations for specific film
     */
    function countFilmNominations(film, ceremony) {
        let count = 0;
        for (const category in ceremony.nominations) {
            const nominees = ceremony.nominations[category];
            if (nominees.some(n => n.id === film.id)) {
                count++;
            }
        }
        return count;
    }

    /**
     * Count wins for specific film
     */
    function countFilmWins(film, ceremony) {
        let count = 0;
        for (const category in ceremony.winners) {
            const winner = ceremony.winners[category];
            if (winner && winner.id === film.id) {
                count++;
            }
        }
        return count;
    }

    /**
     * Count player nominations across all categories
     */
    function countPlayerNominations(nominations, gameState) {
        let count = 0;
        for (const category in nominations) {
            const nominees = nominations[category];
            nominees.forEach(film => {
                if (!film.isRival) {
                    count++;
                }
            });
        }
        return count;
    }

    /**
     * Count player wins across all categories
     */
    function countPlayerWins(winners, gameState) {
        let count = 0;
        for (const category in winners) {
            const winner = winners[category];
            if (winner && !winner.isRival) {
                count++;
            }
        }
        return count;
    }

    /**
     * Get historical context for ceremony year
     */
    function getHistoricalContext(year) {
        const historical = HISTORICAL_WINNERS[year];

        if (!historical) return '';

        return `
            <div class="historical-context">
                <h4>Historical Note</h4>
                <p>In reality, <strong>"${historical.best_picture}"</strong> won Best Picture at the ${year} Academy Awards.</p>
                <p>Directed by ${historical.best_director}, produced by ${historical.studio}.</p>
            </div>
        `;
    }

    /**
     * Get random studio name for rival films
     */
    function getRandomStudio() {
        const studios = [
            'Metro-Goldwyn-Mayer',
            'Warner Bros.',
            'Paramount Pictures',
            '20th Century Fox',
            'RKO Pictures',
            'Columbia Pictures',
            'Universal Pictures',
            'United Artists'
        ];
        return studios[Math.floor(Math.random() * studios.length)];
    }

    /**
     * Get Oscar count for film (for UI display)
     */
    function getFilmOscarCount(film) {
        return {
            nominations: film.oscarNominations || 0,
            wins: film.oscarWins || 0
        };
    }

    /**
     * Get total studio Oscar stats
     */
    function getStudioOscarStats(gameState) {
        return {
            totalNominations: gameState.stats?.oscarNominations || 0,
            totalWins: gameState.stats?.oscarsWon || 0,
            ceremonies: gameState.oscarCeremonies?.length || 0
        };
    }

    // Public API
    return {
        shouldTriggerOscars,
        triggerOscarCeremony,
        getFilmOscarCount,
        getStudioOscarStats,
        CATEGORIES,
        HISTORICAL_WINNERS
    };
})();
