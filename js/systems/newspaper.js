/**
 * HOLLYWOOD MOGUL - NEWSPAPER SYSTEM
 * Period-authentic headlines bringing the Golden Age of Hollywood to life
 * Features 200+ headlines across multiple categories
 */

window.NewspaperSystem = (function() {
    'use strict';

    // Newspaper mastheads that rotate
    const MASTHEADS = [
        'THE HOLLYWOOD REPORTER',
        'VARIETY',
        'THE MOTION PICTURE HERALD',
        'FILM DAILY',
        'BILLBOARD'
    ];

    // Famous columnists of the era
    const COLUMNISTS = [
        { name: 'Louella Parsons', publication: 'Hearst Newspapers' },
        { name: 'Hedda Hopper', publication: 'Los Angeles Times' },
        { name: 'Walter Winchell', publication: 'Daily Mirror' },
        { name: 'Sheilah Graham', publication: 'Hollywood Reporter' },
        { name: 'Sidney Skolsky', publication: 'New York Daily News' }
    ];

    // BOX OFFICE HEADLINES (40+)
    const BOX_OFFICE_HEADLINES = [
        'BOFFO! {FILM} BREAKS ALL RECORDS!',
        '{STUDIO} DOMINATES BOX OFFICE THIS WEEK',
        'FLOP! {FILM} DISAPPOINTS AT WICKETS',
        'AUDIENCES LINE UP FOR {GENRE} SENSATION',
        'THEATERS PACKED FOR HOLIDAY WEEKEND',
        'SUMMER SLUMP HITS HOLLYWOOD HARD',
        '{FILM} LEGS IT INTO SECOND WEEK',
        'SOCKO B.O. FOR {STUDIO}\'S LATEST PIX',
        'ROAD SHOW STRATEGY PAYS OFF BIG',
        'SMALL TOWN CROWDS FLOCK TO {FILM}',
        '{FILM} OPENS TO SRO CROWDS',
        'REPEAT BUSINESS STRONG FOR {FILM}',
        'WORD OF MOUTH BUILDING FOR SLEEPER HIT',
        '{FILM} CROSSES $1 MILLION MARK!',
        'EXHIBITORS CLAMOR FOR {FILM} BOOKINGS',
        'DOUBLE BILL STRATEGY BOOSTS ATTENDANCE',
        '{GENRE} PICTURES LOSING STEAM',
        'CRITICS RAVE, PUBLIC STAYS HOME',
        'UNEXPECTED HIT: {FILM} SURPRISES INDUSTRY',
        'SATURATION BOOKING PAYS OFF',
        '{STUDIO} GAMBLE PAYS DIVIDENDS',
        'HOLDOVER BUSINESS UNPRECEDENTED',
        'MIDWEST MARKETS EMBRACE {FILM}',
        'URBAN CENTERS COOL TO LATEST RELEASE',
        'MATINEE CROWDS SWARM THEATERS',
        'RAIN HURTS WEEKEND BOX OFFICE',
        'HEAT WAVE BOOSTS THEATER ATTENDANCE',
        'GRIND HOUSES REPORT RECORD WEEK',
        'PRESTIGE PICTURES PACK \'EM IN',
        'B-PICTURES OUTPERFORM EXPECTATIONS',
        'DOUBLE FEATURES DRAW FAMILY CROWDS',
        'LATE SHOWS ADDED BY POPULAR DEMAND',
        '{FILM} HEADING FOR CLASSIC STATUS',
        'FOREIGN MARKETS EMBRACE HOLLYWOOD',
        'CENSORSHIP CUTS HURT BOX OFFICE',
        'STAR POWER PROVES BOX OFFICE GOLD',
        'PRODUCTION VALUES PAY OFF AT WICKETS',
        'MUSICAL NUMBERS DELIGHT AUDIENCES',
        'ACTION SEQUENCES THRILL MOVIEGOERS',
        'ROMANCE PROVES TIMELESS DRAW',
        'HORROR FANS TURN OUT IN DROVES'
    ];

    // INDUSTRY NEWS HEADLINES (40+)
    const INDUSTRY_NEWS = [
        '{STUDIO} SIGNS {STAR} TO 7-YEAR PACT',
        'MERGER TALKS BETWEEN MAJOR STUDIOS',
        'NEW SOUND TECHNOLOGY REVOLUTIONIZES FILM',
        'TECHNICOLOR EXPANSION CONTINUES APACE',
        'INDEPENDENT PRODUCERS ON THE RISE',
        'THEATER CHAINS EXPANDING NATIONWIDE',
        'STUDIO BUILDS NEW SOUND STAGES',
        'PRODUCTION SLATE ANNOUNCED FOR NEXT SEASON',
        'DIRECTORS\' GUILD FORMED IN HOLLYWOOD',
        'SCREEN ACTORS DEMAND BETTER CONDITIONS',
        'WRITERS SEEK RECOGNITION, FORM GUILD',
        'DOUBLE FEATURES NOW STANDARD PRACTICE',
        'B-PICTURE UNITS EXPANDING AT MAJORS',
        'CARTOON SHORTS GAINING POPULARITY',
        'NEWSREELS PROVIDE VITAL WAR COVERAGE',
        'TALENT RAIDS BETWEEN RIVAL STUDIOS',
        'CONTRACT SYSTEM UNDER FIRE FROM STARS',
        'EUROPEAN DIRECTORS FLOCK TO HOLLYWOOD',
        'STAGE STARS MAKE TRANSITION TO TALKIES',
        'RADIO PERSONALITIES EYE FILM CAREERS',
        'STUDIO ORCHESTRAS EXPAND FOR MUSICALS',
        'COSTUME DEPARTMENTS WORKING OVERTIME',
        'SPECIAL EFFECTS WIZARDS CREATE MAGIC',
        'LOCATION SHOOTING BECOMES MORE COMMON',
        'STUDIO COMMISSARIES FEED THOUSANDS DAILY',
        'PUBLICITY DEPARTMENTS LAUNCH CAMPAIGNS',
        'PREMIERE CULTURE CREATES MOVIE MAGIC',
        'FAN MAGAZINES MULTIPLY ACROSS NATION',
        'AUTOGRAPH SEEKERS SWARM STUDIO GATES',
        'STUDIO TOURS PROVE POPULAR WITH PUBLIC',
        'BACKLOT CONSTRUCTION CREATES WORLDS',
        'EDITING ROOMS WORK AROUND THE CLOCK',
        'CASTING CALLS DRAW HOPEFUL THOUSANDS',
        'TALENT SCOUTS COMB NATION FOR STARS',
        'SCREEN TESTS DETERMINE STAR POTENTIAL',
        'MAKEUP ARTISTS TRANSFORM PERFORMERS',
        'CINEMATOGRAPHERS PUSH TECHNICAL LIMITS',
        'SCRIPT DEPARTMENTS SEEK BESTSELLERS',
        'RIGHTS TO BROADWAY HITS COSTLY',
        'ORIGINAL SCREENPLAYS IN HIGH DEMAND',
        'SEQUEL FEVER GRIPS HOLLYWOOD'
    ];

    // SCANDAL & GOSSIP HEADLINES (40+)
    const SCANDAL_HEADLINES = [
        '{STAR}\'S SECRET ROMANCE REVEALED!',
        'HOLLYWOOD WEDDING OF THE YEAR!',
        'DIVORCE ROCKS TINSELTOWN',
        '{STAR} CHECKS INTO SANITARIUM',
        'ARREST SHOCKS HOLLYWOOD ELITE',
        'CUSTODY BATTLE TURNS UGLY',
        'WHICH BLONDE BOMBSHELL SEEN AT CIRO\'S?',
        'STAR\'S MALIBU BEACH HOUSE RAIDED',
        'PATERNITY SUIT FILED AGAINST LEADING MAN',
        'STUDIO HUSHING UP SCANDAL',
        'LOVE TRIANGLE THREATENS PRODUCTION',
        '{STAR} VANISHES FROM PUBLIC EYE',
        'ELOPEMENT TO YUMA SURPRISES FANS',
        'QUICKIE DIVORCE IN RENO',
        'AFFAIRS OF THE HEART HALT FILMING',
        'DRUNKEN BRAWL AT BROWN DERBY',
        'STARLET DISCOVERED AT SCHWAB\'S',
        'MYSTERIOUS ILLNESS SIDELINES STAR',
        'PLASTIC SURGERY RUMORS SWIRL',
        'AGE FALSIFICATION SCANDAL ERUPTS',
        'MORALS CLAUSE INVOKED BY STUDIO',
        'STAR SUSPENDED FOR MISCONDUCT',
        'WILD PARTY AT HEARST CASTLE',
        'GAMBLING DEBTS THREATEN CAREER',
        'STAR\'S PAST REVEALED BY TABLOID',
        'STUDIO FIXER WORKS OVERTIME',
        'ARRANGED MARRIAGE FOOLS NO ONE',
        'LAVENDER MARRIAGE PROTECTS CAREERS',
        'BEACH HOUSE RENDEZVOUS PHOTOGRAPHED',
        'NIGHTCLUB FIGHT MAKES HEADLINES',
        'STAR CHECKS OUT OF CURE CLINIC',
        'RECONCILIATION AFTER PUBLIC SPAT',
        'ENGAGEMENT RING SIZE OF SKATING RINK',
        'JEWELS STOLEN FROM STAR\'S BOUDOIR',
        'MYSTERIOUS BENEFACTOR PAYS DEBTS',
        'STAR ADOPTS ORPHAN CHILD',
        'CHARITY WORK REHABILITATES IMAGE',
        'RELIGIOUS CONVERSION ANNOUNCED',
        'STAR JOINS SOCIETY SET',
        'COUNTRY ESTATE PURCHASED',
        'YACHT PARTY ENDS IN SCANDAL'
    ];

    // HISTORICAL HEADLINES (40+)
    const HISTORICAL_HEADLINES = {
        1933: [
            'ROOSEVELT INAUGURATED, PROMISES NEW DEAL',
            'PROHIBITION REPEAL IMMINENT!',
            'BANKING CRISIS GRIPS NATION',
            'NRA LAUNCHES INDUSTRIAL RECOVERY',
            'FIRESIDE CHAT REASSURES MILLIONS'
        ],
        1934: [
            'HAYS CODE ENFORCEMENT BEGINS TODAY',
            'PUBLIC ENEMY DILLINGER SHOT DEAD',
            'DUST BOWL DEVASTATES MIDWEST',
            'PRODUCTION CODE TIGHTENS CENSORSHIP',
            'MOTION PICTURE CODE STRICTLY ENFORCED'
        ],
        1935: [
            'SOCIAL SECURITY ACT SIGNED INTO LAW',
            'LABOR MOVEMENT GAINS STRENGTH',
            'WILL ROGERS KILLED IN PLANE CRASH',
            'ITALY INVADES ETHIOPIA',
            'WPA PUTS MILLIONS TO WORK'
        ],
        1936: [
            'ROOSEVELT WINS LANDSLIDE REELECTION',
            'ABDICATION CRISIS ROCKS BRITAIN',
            'SPANISH CIVIL WAR BEGINS',
            'JESSE OWENS TRIUMPHS IN BERLIN',
            'HINDENBURG DISASTER SHOCKS WORLD'
        ],
        1937: [
            'AMELIA EARHART LOST OVER PACIFIC',
            'GOLDEN GATE BRIDGE OPENS',
            'RECESSION THREATENS RECOVERY',
            'SINO-JAPANESE WAR ESCALATES',
            'DISNEY\'S SNOW WHITE PREMIERES'
        ],
        1938: [
            'HITLER ANNEXES AUSTRIA',
            'MUNICH PACT APPEASES GERMANY',
            'WAR OF THE WORLDS PANICS NATION',
            'HURRICANE DEVASTATES NEW ENGLAND',
            'FAIR LABOR STANDARDS ACT PASSED'
        ],
        1939: [
            'WORLD\'S FAIR OPENS IN NEW YORK',
            'GERMANY INVADES POLAND - WAR!',
            'BRITAIN, FRANCE DECLARE WAR',
            'GONE WITH THE WIND PREMIERES',
            'EINSTEIN WARNS OF ATOMIC BOMB'
        ],
        1940: [
            'NAZIS CONQUER FRANCE',
            'BATTLE OF BRITAIN RAGES',
            'ROOSEVELT BREAKS TRADITION, SEEKS 3RD TERM',
            'SELECTIVE SERVICE ACT PASSED',
            'LONDON BLITZ CONTINUES'
        ],
        1941: [
            'LEND-LEASE ACT AIDS BRITAIN',
            'NAZIS INVADE SOVIET UNION',
            'JAPAN ATTACKS PEARL HARBOR!',
            'AMERICA ENTERS WORLD WAR!',
            'WAR DECLARED ON AXIS POWERS'
        ],
        1942: [
            'RATIONING BEGINS ACROSS AMERICA',
            'DOOLITTLE RAIDS STRIKE TOKYO',
            'BATTLE OF MIDWAY TURNS TIDE',
            'MANHATTAN PROJECT LAUNCHED IN SECRET',
            'INTERNMENT OF JAPANESE AMERICANS'
        ],
        1943: [
            'ALLIES INVADE SICILY',
            'ITALY SURRENDERS TO ALLIES',
            'TEHRAN CONFERENCE CONVENES',
            'WAR BONDS DRIVE BREAKS RECORDS',
            'MEAT RATIONING EXPANDED'
        ],
        1944: [
            'D-DAY! ALLIES INVADE NORMANDY',
            'PARIS LIBERATED FROM NAZIS',
            'ROOSEVELT WINS 4TH TERM',
            'BATTLE OF THE BULGE BEGINS',
            'V-1 ROCKETS STRIKE LONDON'
        ],
        1945: [
            'ROOSEVELT DIES, TRUMAN SWORN IN',
            'GERMANY SURRENDERS - V-E DAY!',
            'ATOMIC BOMB DESTROYS HIROSHIMA',
            'JAPAN SURRENDERS - WAR ENDS!',
            'UNITED NATIONS CHARTER SIGNED'
        ],
        1946: [
            'CHURCHILL WARNS OF IRON CURTAIN',
            'NUREMBERG TRIALS CONCLUDE',
            'ATOMIC TESTS AT BIKINI ATOLL',
            'BABY BOOM ACCELERATES',
            'STRIKES PLAGUE INDUSTRIES'
        ],
        1947: [
            'TRUMAN DOCTRINE ANNOUNCED',
            'MARSHALL PLAN PROPOSED',
            'REDS IN HOLLYWOOD? HUAC INVESTIGATES',
            'HOLLYWOOD TEN REFUSE TO TESTIFY',
            'TAFT-HARTLEY ACT RESTRICTS UNIONS'
        ],
        1948: [
            'PARAMOUNT DECISION ENDS BLOCK BOOKING',
            'SUPREME COURT BREAKS UP STUDIO SYSTEM',
            'BERLIN AIRLIFT BEGINS',
            'ISRAEL DECLARES INDEPENDENCE',
            'TRUMAN UPSETS DEWEY'
        ],
        1949: [
            'NATO ALLIANCE FORMED',
            'SOVIETS TEST ATOMIC BOMB',
            'COMMUNISTS WIN IN CHINA',
            'MINIMUM WAGE RAISED TO 75 CENTS',
            'TELEVISION SALES SKYROCKET'
        ]
    };

    // GOSSIP COLUMN ITEMS (40+)
    const GOSSIP_ITEMS = [
        'Which blonde bombshell was seen at Ciro\'s with a married producer?',
        'Word is {STUDIO} is in financial trouble...',
        'Insiders say {STAR}\'s next picture will be her last...',
        'Rumors of a feud between rival leading ladies',
        'Contract negotiations not going well for top star',
        'Which leading man can\'t remember his lines?',
        'A certain studio head was seen at the races, again',
        'That quickie marriage won\'t last past the premiere',
        'Studio covering up embarrassing incident',
        'Star\'s drinking problem common knowledge on set',
        'Secret screen test for untested newcomer',
        'Big star demanding percentage of profits',
        'Director and producer at loggerheads',
        'Someone\'s getting too big for their britches',
        'Rival studios in bidding war for hot property',
        'Star planning to ankle current studio',
        'Production halted due to "creative differences"',
        'Leading man\'s latest romance already over',
        'Star spending beyond their means, again',
        'Certain starlet not as young as publicity claims',
        'Which actor is Hollywood\'s worst poker player?',
        'Star\'s entourage growing by the week',
        'Someone needs a new agent, badly',
        'Studio regretting that seven-year contract',
        'Aging star desperate for comeback role',
        'Plastic surgeon making fortune off vanity',
        'Star\'s beach house party went too far',
        'Which couple is just for the cameras?',
        'Career on the skids despite brave face',
        'Someone\'s been spending time at the track',
        'Star mortgaged to the hilt, they say',
        'Real age finally revealed by census',
        'Accent completely phony, sources say',
        'Studio apartment vs mansion in publicity',
        'Star\'s degree from prestigious school? Fake!',
        'Mysterious benefactor paying star\'s bills',
        'Someone angling for that Oscar nomination',
        'Star studying method acting in New York',
        'Career move or true love? Time will tell',
        'Studio grooming replacement for aging star'
    ];

    // Period slang for authentic flavor
    const PERIOD_SLANG = {
        boxOffice: ['boffo', 'socko', 'whammo', 'smash', 'click'],
        good: ['jake', 'swell', 'keen', 'nifty', 'peachy'],
        bad: ['turkey', 'lemon', 'dud', 'flop', 'egg'],
        money: ['clams', 'mazuma', 'scratch', 'kale', 'lettuce'],
        people: ['mug', 'joe', 'tomato', 'dame', 'gent'],
        films: ['pix', 'flicker', 'photoplay', 'picture', 'talkie']
    };

    /**
     * Generate newspaper for current game week
     */
    function generateNewspaper(gameState) {
        const currentDate = gameState.currentDate || new Date(1933, 0, 1);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const newspaper = {
            date: formatNewspaperDate(currentDate),
            masthead: getRandomMasthead(),
            mainHeadline: generateMainHeadline(gameState),
            industryNews: generateIndustryNews(gameState),
            boxOfficeSection: generateBoxOfficeSection(gameState),
            gossipColumn: generateGossipColumn(gameState),
            historicalNews: generateHistoricalNews(year, month),
            columnistByline: getRandomColumnist()
        };

        return newspaper;
    }

    /**
     * Generate main headline based on player's recent actions
     */
    function generateMainHeadline(gameState) {
        // Check for player's most significant recent event
        const recentFilms = getRecentFilms(gameState);

        if (recentFilms.length > 0) {
            const topFilm = recentFilms[0];

            // Film just released
            if (topFilm.phase === 'in_theaters' && topFilm.distribution?.currentWeek === 1) {
                const performance = calculatePerformance(topFilm);

                if (performance > 0.8) {
                    return {
                        title: `${gameState.studioName.toUpperCase()}'S "${topFilm.title.toUpperCase()}" SMASHES RECORDS!`,
                        subtitle: `Opening Weekend Grosses ${formatCurrency(topFilm.distribution.boxOfficeResults.weeks[0]?.grossRevenue || 0)}`,
                        article: generateSuccessArticle(topFilm, gameState)
                    };
                } else if (performance < 0.3) {
                    return {
                        title: `"${topFilm.title.toUpperCase()}" DISAPPOINTS AT BOX OFFICE`,
                        subtitle: `${gameState.studioName} Faces Losses on Latest Release`,
                        article: generateFlopArticle(topFilm, gameState)
                    };
                }
            }
        }

        // Financial news about player
        const runway = calculateRunway(gameState);
        if (runway < 8) {
            return {
                title: `${gameState.studioName.toUpperCase()} FACES FINANCIAL PRESSURE`,
                subtitle: 'Industry Insiders Express Concern',
                article: `Sources close to ${gameState.studioName} report that the independent studio is facing mounting financial pressures. With limited cash reserves and an uncertain production slate, industry watchers are speculating about the studio's future prospects...`
            };
        }

        // Default: Generic industry headline
        return {
            title: getRandomElement(INDUSTRY_NEWS).replace('{STUDIO}', 'MAJOR STUDIO').replace('{STAR}', 'TOP STAR'),
            subtitle: 'Hollywood Continues Production Boom',
            article: 'The motion picture industry shows no signs of slowing down as studios announce ambitious production slates for the coming season. Audiences continue to flock to theaters nationwide...'
        };
    }

    /**
     * Generate industry news section
     */
    function generateIndustryNews(gameState) {
        const newsItems = [];
        const count = 3 + Math.floor(Math.random() * 3); // 3-5 items

        for (let i = 0; i < count; i++) {
            let headline = getRandomElement(INDUSTRY_NEWS);

            // Replace placeholders
            headline = headline.replace('{STUDIO}', getRandomStudioName());
            headline = headline.replace('{STAR}', getRandomStarName());

            newsItems.push({
                headline: headline,
                brief: generateBriefText()
            });
        }

        return newsItems;
    }

    /**
     * Generate box office section
     */
    function generateBoxOfficeSection(gameState) {
        const topFive = [];

        // Include player's films if in theaters
        const playerFilms = (gameState.activeFilms || [])
            .filter(f => f.phase === 'in_theaters')
            .map(f => ({
                title: f.title,
                gross: f.distribution?.boxOfficeResults?.weeks[f.distribution.currentWeek - 1]?.grossRevenue || 0,
                studio: gameState.studioName,
                isPlayer: true
            }));

        // Add fictional films to fill top 5
        const fictionalFilms = generateFictionalBoxOffice(5 - playerFilms.length, gameState);

        const combined = [...playerFilms, ...fictionalFilms]
            .sort((a, b) => b.gross - a.gross)
            .slice(0, 5);

        return {
            topFive: combined,
            totalWeekly: formatCurrency(combined.reduce((sum, f) => sum + f.gross, 0) * 20), // Approximate total market
            headline: getRandomElement(BOX_OFFICE_HEADLINES)
                .replace('{FILM}', combined[0]?.title || 'TOP FILM')
                .replace('{STUDIO}', combined[0]?.studio || 'MAJOR STUDIO')
                .replace('{GENRE}', getRandomGenre())
        };
    }

    /**
     * Generate gossip column
     */
    function generateGossipColumn(gameState) {
        const columnist = getRandomColumnist();
        const itemCount = 4 + Math.floor(Math.random() * 3); // 4-6 items
        const items = [];

        for (let i = 0; i < itemCount; i++) {
            let item = getRandomElement(GOSSIP_ITEMS);

            // Replace placeholders
            item = item.replace('{STUDIO}', gameState.studioName);
            item = item.replace('{STAR}', getRandomStarName());

            items.push(item);
        }

        return {
            author: columnist.name,
            publication: columnist.publication,
            items: items
        };
    }

    /**
     * Generate historical news for the era
     */
    function generateHistoricalNews(year, month) {
        const yearHeadlines = HISTORICAL_HEADLINES[year];

        if (!yearHeadlines || yearHeadlines.length === 0) {
            return null;
        }

        // Return 1-2 historical headlines
        const count = Math.random() > 0.6 ? 2 : 1;
        const selected = [];

        for (let i = 0; i < count && i < yearHeadlines.length; i++) {
            const headline = getRandomElement(yearHeadlines);
            if (!selected.includes(headline)) {
                selected.push(headline);
            }
        }

        return selected;
    }

    /**
     * Show newspaper modal
     */
    function showNewspaper(gameState) {
        const newspaper = generateNewspaper(gameState);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay newspaper-modal-overlay';
        modal.id = 'newspaper-modal';
        modal.innerHTML = createNewspaperHTML(newspaper);

        document.body.appendChild(modal);

        // Add close handlers
        const closeBtn = modal.querySelector('.newspaper-close');
        if (closeBtn) {
            closeBtn.onclick = () => closeNewspaper();
        }

        modal.onclick = (e) => {
            if (e.target === modal) {
                closeNewspaper();
            }
        };

        // Play newspaper sound effect if available
        if (window.AudioSystem && window.AudioSystem.playSFX) {
            window.AudioSystem.playSFX('newspaper');
        }
    }

    /**
     * Create newspaper HTML
     */
    function createNewspaperHTML(newspaper) {
        return `
            <div class="newspaper-container">
                <div class="newspaper-page">
                    <!-- Masthead -->
                    <div class="newspaper-masthead">
                        <div class="masthead-decoration">★ ★ ★</div>
                        <h1 class="masthead-title">${newspaper.masthead}</h1>
                        <div class="masthead-subtitle">Hollywood's Leading Trade Paper</div>
                        <div class="masthead-date">${newspaper.date}</div>
                        <div class="masthead-decoration">★ ★ ★</div>
                    </div>

                    <!-- Main Headline -->
                    <div class="newspaper-main-headline">
                        <h2 class="main-headline-title">${newspaper.mainHeadline.title}</h2>
                        <h3 class="main-headline-subtitle">${newspaper.mainHeadline.subtitle}</h3>
                        <div class="main-headline-article">
                            <p>${newspaper.mainHeadline.article}</p>
                        </div>
                    </div>

                    <div class="newspaper-columns">
                        <!-- Left Column -->
                        <div class="newspaper-column">
                            <!-- Box Office Section -->
                            <div class="newspaper-section box-office-section">
                                <h4 class="section-title">📊 BOX OFFICE REPORT</h4>
                                <p class="box-office-headline">${newspaper.boxOfficeSection.headline}</p>
                                <div class="box-office-chart">
                                    <table class="box-office-table">
                                        <thead>
                                            <tr>
                                                <th>RANK</th>
                                                <th>PICTURE</th>
                                                <th>STUDIO</th>
                                                <th>GROSS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${newspaper.boxOfficeSection.topFive.map((film, index) => `
                                                <tr class="${film.isPlayer ? 'player-film' : ''}">
                                                    <td>${index + 1}.</td>
                                                    <td>${film.title}</td>
                                                    <td>${film.studio}</td>
                                                    <td>${formatCurrency(film.gross)}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                    <div class="box-office-total">
                                        <strong>WEEKLY TOTAL:</strong> ${newspaper.boxOfficeSection.totalWeekly}
                                    </div>
                                </div>
                            </div>

                            <!-- Industry News -->
                            <div class="newspaper-section industry-section">
                                <h4 class="section-title">🎬 INDUSTRY NEWS</h4>
                                ${newspaper.industryNews.map(item => `
                                    <div class="news-item">
                                        <h5 class="news-headline">${item.headline}</h5>
                                        <p class="news-brief">${item.brief}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Right Column -->
                        <div class="newspaper-column">
                            <!-- Gossip Column -->
                            <div class="newspaper-section gossip-section">
                                <h4 class="section-title">💋 ${newspaper.gossipColumn.author}'s Column</h4>
                                <p class="columnist-byline">Exclusive to ${newspaper.gossipColumn.publication}</p>
                                <div class="gossip-items">
                                    ${newspaper.gossipColumn.items.map(item => `
                                        <p class="gossip-item">• ${item}</p>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Historical News -->
                            ${newspaper.historicalNews && newspaper.historicalNews.length > 0 ? `
                                <div class="newspaper-section historical-section">
                                    <h4 class="section-title">🌍 WORLD NEWS</h4>
                                    ${newspaper.historicalNews.map(headline => `
                                        <div class="historical-item">
                                            <h5 class="historical-headline">${headline}</h5>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}

                            <!-- Period Advertisement -->
                            <div class="newspaper-ad">
                                <div class="ad-border">
                                    <h5>SCHWAB'S PHARMACY</h5>
                                    <p>Where Stars Are Discovered!</p>
                                    <p class="ad-small">Sunset Boulevard • Hollywood</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Close Button -->
                    <div class="newspaper-footer">
                        <button class="newspaper-close cta-button">CONTINUE</button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Close newspaper modal
     */
    function closeNewspaper() {
        const modal = document.getElementById('newspaper-modal');
        if (modal) {
            modal.remove();
        }
    }

    // HELPER FUNCTIONS

    function formatNewspaperDate(date) {
        const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
                       'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    function getRandomMasthead() {
        return getRandomElement(MASTHEADS);
    }

    function getRandomColumnist() {
        return getRandomElement(COLUMNISTS);
    }

    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function getRandomStudioName() {
        const studios = ['MGM', 'WARNER BROS.', 'PARAMOUNT', '20TH CENTURY-FOX',
                        'RKO', 'COLUMBIA', 'UNIVERSAL', 'UNITED ARTISTS'];
        return getRandomElement(studios);
    }

    function getRandomStarName() {
        const firstNames = ['Clark', 'Cary', 'James', 'Bette', 'Joan', 'Katharine',
                           'Spencer', 'Humphrey', 'Barbara', 'Rita'];
        const lastNames = ['Gable', 'Grant', 'Stewart', 'Davis', 'Crawford', 'Hepburn',
                          'Tracy', 'Bogart', 'Stanwyck', 'Hayworth'];
        return `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
    }

    function getRandomGenre() {
        const genres = ['DRAMA', 'COMEDY', 'WESTERN', 'MUSICAL', 'ROMANCE',
                       'GANGSTER', 'NOIR', 'HORROR'];
        return getRandomElement(genres);
    }

    function generateBriefText() {
        const briefs = [
            'Industry insiders report significant developments in the ongoing negotiations.',
            'Sources indicate that the deal will be finalized within the coming weeks.',
            'The announcement has sent ripples through the Hollywood community.',
            'Exhibitors are expressing enthusiasm about the latest developments.',
            'Trade papers report unprecedented interest in the new venture.',
            'The move represents a significant shift in industry dynamics.',
            'Observers suggest this could set a new precedent for the business.',
            'Studio executives are remaining tight-lipped about specific details.'
        ];
        return getRandomElement(briefs);
    }

    function generateFictionalBoxOffice(count, gameState) {
        const films = [];
        const titles = [
            'Desert Thunder', 'Manhattan Melody', 'The Lost Squadron',
            'Dangerous Lady', 'Trail of Vengeance', 'Midnight Confession',
            'Broadway Serenade', 'The Silver Chalice', 'Wings of Glory',
            'Forbidden Paradise', 'The Scarlet Hour', 'Phantom Empire'
        ];

        for (let i = 0; i < count; i++) {
            films.push({
                title: getRandomElement(titles),
                gross: 50000 + Math.random() * 200000,
                studio: getRandomStudioName(),
                isPlayer: false
            });
        }

        return films;
    }

    function getRecentFilms(gameState) {
        return (gameState.activeFilms || [])
            .filter(f => f.phase === 'in_theaters' || f.phase === 'completed')
            .slice(-3)
            .reverse();
    }

    function calculatePerformance(film) {
        if (!film.distribution || !film.distribution.boxOfficeResults) return 0.5;

        const weeks = film.distribution.boxOfficeResults.weeks || [];
        if (weeks.length === 0) return 0.5;

        const totalGross = weeks.reduce((sum, w) => sum + (w.grossRevenue || 0), 0);
        const budget = film.actualBudget || film.originalBudget || 100000;

        return Math.min(1.0, totalGross / (budget * 2));
    }

    function calculateRunway(gameState) {
        if (!gameState.monthlyBurn || gameState.monthlyBurn === 0) return 999;
        return (gameState.cash / gameState.monthlyBurn) * 4; // Convert to weeks
    }

    function formatCurrency(amount) {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        }
        return `$${Math.round(amount).toLocaleString()}`;
    }

    function generateSuccessArticle(film, gameState) {
        return `${gameState.studioName}'s latest release "${film.title}" has taken Hollywood by storm, opening to packed houses across the nation. The ${film.genre} picture has exceeded all expectations, with audiences responding enthusiastically to the studio's bold vision. Industry analysts are calling it one of the breakout hits of the season. Theater owners report strong word-of-mouth and predict the film will have legs well into its theatrical run. This success marks a significant milestone for the independent studio and positions it as a major player in the competitive Hollywood landscape.`;
    }

    function generateFlopArticle(film, gameState) {
        return `Despite high hopes and a substantial marketing campaign, "${film.title}" has failed to connect with audiences in its opening weekend. The ${film.genre} from ${gameState.studioName} drew sparse crowds at theaters nationwide, leaving exhibitors disappointed and the studio facing significant losses. Industry insiders suggest that market timing and audience preferences may have worked against the production. The disappointing performance raises questions about ${gameState.studioName}'s future production strategy and financial stability.`;
    }

    // Public API
    return {
        showNewspaper: showNewspaper,
        generateNewspaper: generateNewspaper,
        closeNewspaper: closeNewspaper,

        // For testing/debugging
        getHeadlineCount: () => {
            return {
                boxOffice: BOX_OFFICE_HEADLINES.length,
                industry: INDUSTRY_NEWS.length,
                scandal: SCANDAL_HEADLINES.length,
                historical: Object.values(HISTORICAL_HEADLINES).flat().length,
                gossip: GOSSIP_ITEMS.length,
                total: BOX_OFFICE_HEADLINES.length +
                       INDUSTRY_NEWS.length +
                       SCANDAL_HEADLINES.length +
                       Object.values(HISTORICAL_HEADLINES).flat().length +
                       GOSSIP_ITEMS.length
            };
        }
    };
})();
