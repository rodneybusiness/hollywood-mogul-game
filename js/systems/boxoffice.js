/**
 * HOLLYWOOD MOGUL - BOX OFFICE SIMULATION SYSTEM
 * The brutal mathematics of movie success and failure
 */
window.BoxOfficeSystem = (function() {
    'use strict';

    // Genre heat trends - changes over time based on historical data
    const GENRE_HEAT = {
        1933: { western: 0.8, crime: 1.2, musical: 0.9, drama: 1.0, comedy: 1.1, horror: 0.7, romance: 1.0, war: 0.3 },
        1934: { western: 0.9, crime: 1.0, musical: 1.1, drama: 1.0, comedy: 1.2, horror: 0.8, romance: 1.0, war: 0.4 },
        1935: { western: 1.0, crime: 0.9, musical: 1.3, drama: 1.1, comedy: 1.2, horror: 0.8, romance: 1.0, war: 0.4 },
        1936: { western: 1.1, crime: 0.8, musical: 1.2, drama: 1.0, comedy: 1.1, horror: 0.9, romance: 1.1, war: 0.5 },
        1937: { western: 1.2, crime: 0.7, musical: 1.4, drama: 1.1, comedy: 1.0, horror: 0.8, romance: 1.2, war: 0.6 },
        1938: { western: 1.1, crime: 0.8, musical: 1.3, drama: 1.2, comedy: 1.1, horror: 0.9, romance: 1.1, war: 0.7 },
        1939: { western: 1.0, crime: 0.9, musical: 1.2, drama: 1.4, comedy: 1.0, horror: 0.8, romance: 1.0, war: 0.8 },
        1940: { western: 0.9, crime: 1.0, musical: 1.1, drama: 1.3, comedy: 1.0, horror: 0.9, romance: 1.0, war: 1.0 },
        1941: { western: 0.8, crime: 1.0, musical: 1.0, drama: 1.2, comedy: 0.9, horror: 0.8, romance: 0.9, war: 1.4 },
        1942: { western: 0.7, crime: 0.9, musical: 1.1, drama: 1.1, comedy: 1.0, horror: 0.7, romance: 1.0, war: 1.6 },
        1943: { western: 0.8, crime: 0.8, musical: 1.2, drama: 1.0, comedy: 1.1, horror: 0.6, romance: 1.1, war: 1.5 },
        1944: { western: 0.9, crime: 0.9, musical: 1.1, drama: 1.1, comedy: 1.0, horror: 0.7, romance: 1.0, war: 1.3 },
        1945: { western: 1.0, crime: 1.0, musical: 1.0, drama: 1.2, comedy: 1.1, horror: 0.8, romance: 1.2, war: 1.0 },
        1946: { western: 1.1, crime: 1.1, musical: 0.9, drama: 1.3, comedy: 1.0, horror: 0.9, romance: 1.1, noir: 1.4, war: 0.7 },
        1947: { western: 1.2, crime: 1.2, musical: 0.8, drama: 1.2, comedy: 0.9, horror: 1.0, romance: 1.0, noir: 1.6, war: 0.5 },
        1948: { western: 1.3, crime: 1.1, musical: 0.9, drama: 1.1, comedy: 1.0, horror: 1.1, romance: 0.9, noir: 1.5, war: 0.4 },
        1949: { western: 1.2, crime: 1.0, musical: 1.0, drama: 1.0, comedy: 1.1, horror: 1.0, romance: 1.0, noir: 1.3, war: 0.3 },

        // ============================================================
        // 1950s: TELEVISION THREAT — CinemaScope spectacles, westerns peak, sci-fi emerges
        // ============================================================
        1950: { western: 1.3, crime: 1.1, musical: 1.1, drama: 1.0, comedy: 1.0, horror: 0.8, romance: 0.9, war: 1.2, noir: 1.3, sci_fi: 0.8 },
        1951: { western: 1.4, crime: 1.0, musical: 1.1, drama: 1.0, comedy: 1.0, horror: 0.8, romance: 0.9, war: 1.3, noir: 1.3, sci_fi: 0.9 },
        1952: { western: 1.5, crime: 1.0, musical: 1.2, drama: 1.0, comedy: 1.0, horror: 0.8, romance: 0.9, war: 1.2, noir: 1.2, sci_fi: 0.9 },
        1953: { western: 1.5, crime: 0.9, musical: 1.1, drama: 1.1, comedy: 1.0, horror: 0.8, romance: 0.9, war: 1.1, noir: 1.2, sci_fi: 1.0 },
        1954: { western: 1.6, crime: 0.9, musical: 1.0, drama: 1.1, comedy: 1.0, horror: 0.9, romance: 0.9, war: 0.9, noir: 1.1, sci_fi: 1.1 },
        1955: { western: 1.5, crime: 0.9, musical: 1.0, drama: 1.2, comedy: 1.1, horror: 0.9, romance: 0.9, war: 0.8, noir: 1.0, sci_fi: 1.1 },
        1956: { western: 1.5, crime: 0.8, musical: 1.1, drama: 1.1, comedy: 1.1, horror: 0.9, romance: 1.0, war: 0.7, noir: 0.9, sci_fi: 1.2 },
        1957: { western: 1.4, crime: 0.9, musical: 1.0, drama: 1.1, comedy: 1.0, horror: 0.9, romance: 1.0, war: 0.7, noir: 0.8, sci_fi: 1.1 },
        1958: { western: 1.3, crime: 0.9, musical: 0.9, drama: 1.1, comedy: 1.0, horror: 0.9, romance: 1.0, war: 0.6, noir: 0.7, sci_fi: 1.0 },
        1959: { western: 1.3, crime: 0.9, musical: 0.9, drama: 1.2, comedy: 1.0, horror: 0.8, romance: 1.0, war: 0.6, noir: 0.6, sci_fi: 0.9 },

        // ============================================================
        // 1960s: NEW WAVE — Hitchcock thrillers, Hays Code crumbles, musicals peak then crash
        // ============================================================
        1960: { western: 1.2, crime: 0.9, musical: 0.9, drama: 1.2, comedy: 1.0, horror: 1.0, romance: 1.0, war: 0.7, sci_fi: 0.7, thriller: 1.1 },
        1961: { western: 1.1, crime: 0.9, musical: 1.0, drama: 1.1, comedy: 1.0, horror: 0.9, romance: 1.0, war: 0.7, sci_fi: 0.7, thriller: 1.0 },
        1962: { western: 1.1, crime: 0.9, musical: 0.9, drama: 1.1, comedy: 1.0, horror: 0.8, romance: 1.0, war: 0.8, sci_fi: 0.7, thriller: 1.1 },
        1963: { western: 1.0, crime: 0.9, musical: 0.8, drama: 1.2, comedy: 1.1, horror: 0.9, romance: 1.0, war: 0.7, sci_fi: 0.6, thriller: 1.1 },
        1964: { western: 1.1, crime: 0.9, musical: 0.9, drama: 1.1, comedy: 1.1, horror: 0.8, romance: 1.0, war: 0.7, sci_fi: 0.6, thriller: 1.2 },
        1965: { western: 1.0, crime: 0.8, musical: 1.3, drama: 1.1, comedy: 1.0, horror: 0.8, romance: 1.1, war: 0.7, sci_fi: 0.7, thriller: 1.1 },
        1966: { western: 1.1, crime: 0.9, musical: 1.0, drama: 1.1, comedy: 1.0, horror: 0.8, romance: 1.0, war: 0.6, sci_fi: 0.7, thriller: 1.1 },
        1967: { western: 1.0, crime: 1.0, musical: 0.8, drama: 1.2, comedy: 1.0, horror: 0.9, romance: 0.9, war: 0.7, sci_fi: 0.7, thriller: 1.2 },
        1968: { western: 0.9, crime: 1.0, musical: 0.6, drama: 1.3, comedy: 1.0, horror: 1.0, romance: 0.9, war: 0.7, sci_fi: 0.8, thriller: 1.2 },
        1969: { western: 0.9, crime: 1.0, musical: 0.5, drama: 1.3, comedy: 1.0, horror: 0.9, romance: 0.9, war: 0.6, sci_fi: 0.7, thriller: 1.1 },

        // ============================================================
        // 1970s: NEW HOLLYWOOD — Auteurs, blockbusters born, action emerges, horror golden age
        // ============================================================
        1970: { western: 0.8, crime: 1.1, musical: 0.4, drama: 1.2, comedy: 1.0, horror: 1.0, romance: 0.9, war: 0.8, sci_fi: 0.7, thriller: 1.2, action: 0.5 },
        1971: { western: 0.8, crime: 1.1, musical: 0.4, drama: 1.2, comedy: 1.0, horror: 1.0, romance: 0.9, war: 0.7, sci_fi: 0.7, thriller: 1.3, action: 0.5 },
        1972: { western: 0.7, crime: 1.3, musical: 0.4, drama: 1.2, comedy: 1.0, horror: 1.0, romance: 0.9, war: 0.7, sci_fi: 0.7, thriller: 1.3, action: 0.6 },
        1973: { western: 0.7, crime: 1.2, musical: 0.3, drama: 1.2, comedy: 1.0, horror: 1.3, romance: 0.9, war: 0.7, sci_fi: 0.8, thriller: 1.4, action: 0.7 },
        1974: { western: 0.7, crime: 1.1, musical: 0.3, drama: 1.1, comedy: 1.1, horror: 1.2, romance: 0.9, war: 0.6, sci_fi: 0.8, thriller: 1.4, action: 0.7 },
        1975: { western: 0.6, crime: 1.0, musical: 0.3, drama: 1.1, comedy: 1.0, horror: 1.2, romance: 0.9, war: 0.6, sci_fi: 0.9, thriller: 1.3, action: 0.8 },
        1976: { western: 0.6, crime: 1.0, musical: 0.3, drama: 1.2, comedy: 1.0, horror: 1.1, romance: 1.0, war: 0.6, sci_fi: 0.9, thriller: 1.2, action: 0.8 },
        1977: { western: 0.5, crime: 0.9, musical: 0.3, drama: 1.1, comedy: 1.1, horror: 1.1, romance: 0.9, war: 0.6, sci_fi: 1.6, thriller: 1.1, action: 0.9 },
        1978: { western: 0.5, crime: 0.9, musical: 0.3, drama: 1.1, comedy: 1.1, horror: 1.3, romance: 0.9, war: 0.7, sci_fi: 1.5, thriller: 1.1, action: 0.9 },
        1979: { western: 0.4, crime: 0.9, musical: 0.3, drama: 1.1, comedy: 1.1, horror: 1.2, romance: 0.9, war: 0.8, sci_fi: 1.4, thriller: 1.1, action: 1.0 },

        // ============================================================
        // 1980s: BLOCKBUSTER AGE — Action peak, sci-fi huge, teen comedies, slasher horror
        // ============================================================
        1980: { western: 0.4, crime: 0.9, musical: 0.3, drama: 1.0, comedy: 1.2, horror: 1.2, romance: 0.9, war: 0.6, sci_fi: 1.4, thriller: 1.1, action: 1.2 },
        1981: { western: 0.4, crime: 0.9, musical: 0.3, drama: 1.0, comedy: 1.1, horror: 1.2, romance: 0.9, war: 0.5, sci_fi: 1.3, thriller: 1.1, action: 1.3 },
        1982: { western: 0.3, crime: 0.9, musical: 0.3, drama: 1.0, comedy: 1.2, horror: 1.1, romance: 0.9, war: 0.5, sci_fi: 1.5, thriller: 1.1, action: 1.4 },
        1983: { western: 0.3, crime: 0.8, musical: 0.3, drama: 1.0, comedy: 1.2, horror: 1.0, romance: 0.9, war: 0.5, sci_fi: 1.4, thriller: 1.1, action: 1.5 },
        1984: { western: 0.3, crime: 0.8, musical: 0.2, drama: 1.0, comedy: 1.3, horror: 1.0, romance: 0.9, war: 0.5, sci_fi: 1.4, thriller: 1.1, action: 1.6 },
        1985: { western: 0.3, crime: 0.8, musical: 0.2, drama: 1.0, comedy: 1.3, horror: 0.9, romance: 1.0, war: 0.5, sci_fi: 1.3, thriller: 1.0, action: 1.7 },
        1986: { western: 0.3, crime: 0.9, musical: 0.2, drama: 1.0, comedy: 1.2, horror: 0.9, romance: 1.0, war: 0.6, sci_fi: 1.3, thriller: 1.1, action: 1.8 },
        1987: { western: 0.3, crime: 0.9, musical: 0.2, drama: 1.0, comedy: 1.2, horror: 0.9, romance: 1.0, war: 0.5, sci_fi: 1.2, thriller: 1.2, action: 1.7 },
        1988: { western: 0.3, crime: 0.9, musical: 0.2, drama: 1.0, comedy: 1.2, horror: 0.8, romance: 1.0, war: 0.5, sci_fi: 1.2, thriller: 1.2, action: 1.7 },
        1989: { western: 0.3, crime: 0.9, musical: 0.2, drama: 1.0, comedy: 1.1, horror: 0.8, romance: 1.0, war: 0.5, sci_fi: 1.2, thriller: 1.2, action: 1.6, animated: 0.8, superhero: 0.5 },

        // ============================================================
        // 1990s: INDIE BOOM — Disney Renaissance, Tarantino, CGI revolution, rom-com peak
        // ============================================================
        1990: { western: 0.4, crime: 1.0, musical: 0.3, drama: 1.1, comedy: 1.1, horror: 0.8, romance: 1.1, war: 0.5, sci_fi: 1.2, thriller: 1.2, action: 1.5, animated: 0.9, superhero: 0.4 },
        1991: { western: 0.4, crime: 1.0, musical: 0.3, drama: 1.1, comedy: 1.1, horror: 0.9, romance: 1.1, war: 0.5, sci_fi: 1.3, thriller: 1.3, action: 1.5, animated: 1.0, superhero: 0.3 },
        1992: { western: 0.6, crime: 1.0, musical: 0.3, drama: 1.1, comedy: 1.1, horror: 0.8, romance: 1.1, war: 0.5, sci_fi: 1.2, thriller: 1.2, action: 1.4, animated: 1.1, superhero: 0.4 },
        1993: { western: 0.4, crime: 1.0, musical: 0.3, drama: 1.2, comedy: 1.1, horror: 0.8, romance: 1.1, war: 0.5, sci_fi: 1.4, thriller: 1.2, action: 1.4, animated: 1.0, superhero: 0.3 },
        1994: { western: 0.4, crime: 1.2, musical: 0.3, drama: 1.2, comedy: 1.1, horror: 0.8, romance: 1.1, war: 0.5, sci_fi: 1.2, thriller: 1.2, action: 1.4, animated: 1.2, superhero: 0.3 },
        1995: { western: 0.3, crime: 1.1, musical: 0.3, drama: 1.2, comedy: 1.1, horror: 0.8, romance: 1.2, war: 0.5, sci_fi: 1.2, thriller: 1.2, action: 1.4, animated: 1.3, superhero: 0.4 },
        1996: { western: 0.3, crime: 1.0, musical: 0.3, drama: 1.1, comedy: 1.2, horror: 1.1, romance: 1.2, war: 0.5, sci_fi: 1.3, thriller: 1.1, action: 1.3, animated: 1.1, superhero: 0.3 },

        // ============================================================
        // 1997-2004: DIGITAL DAWN — DVD boom, franchise era, internet, CGI standard
        // ============================================================
        1997: { western: 0.3, crime: 1.0, musical: 0.3, drama: 1.2, comedy: 1.1, horror: 0.9, romance: 1.2, war: 0.6, sci_fi: 1.2, thriller: 1.1, action: 1.3, animated: 1.1, superhero: 0.4 },
        1998: { western: 0.3, crime: 1.0, musical: 0.3, drama: 1.1, comedy: 1.1, horror: 0.9, romance: 1.2, war: 1.1, sci_fi: 1.2, thriller: 1.1, action: 1.3, animated: 1.2, superhero: 0.4 },
        1999: { western: 0.3, crime: 1.0, musical: 0.3, drama: 1.1, comedy: 1.1, horror: 1.0, romance: 1.1, war: 0.7, sci_fi: 1.3, thriller: 1.1, action: 1.3, animated: 1.2, superhero: 0.4 },
        2000: { western: 0.3, crime: 1.0, musical: 0.3, drama: 1.1, comedy: 1.1, horror: 0.9, romance: 1.1, war: 0.6, sci_fi: 1.2, thriller: 1.1, action: 1.3, animated: 1.2, superhero: 0.6 },
        2001: { western: 0.3, crime: 1.0, musical: 0.4, drama: 1.1, comedy: 1.0, horror: 0.9, romance: 1.0, war: 0.7, sci_fi: 1.1, thriller: 1.0, action: 1.2, animated: 1.3, superhero: 0.7 },
        2002: { western: 0.3, crime: 1.0, musical: 0.4, drama: 1.1, comedy: 1.1, horror: 0.9, romance: 1.0, war: 0.8, sci_fi: 1.2, thriller: 1.1, action: 1.2, animated: 1.3, superhero: 0.9 },
        2003: { western: 0.3, crime: 1.0, musical: 0.3, drama: 1.0, comedy: 1.1, horror: 0.9, romance: 1.0, war: 0.7, sci_fi: 1.2, thriller: 1.1, action: 1.2, animated: 1.3, superhero: 1.0 },
        2004: { western: 0.3, crime: 1.0, musical: 0.3, drama: 1.1, comedy: 1.1, horror: 0.9, romance: 1.0, war: 0.6, sci_fi: 1.1, thriller: 1.1, action: 1.3, animated: 1.4, superhero: 1.1 },

        // ============================================================
        // 2005-2010: CONVERGENCE — Superhero dominance, streaming disrupts, 3D revival
        // ============================================================
        2005: { western: 0.3, crime: 0.9, musical: 0.4, drama: 1.0, comedy: 1.1, horror: 0.9, romance: 0.9, war: 0.6, sci_fi: 1.2, thriller: 1.0, action: 1.3, animated: 1.3, superhero: 1.2 },
        2006: { western: 0.3, crime: 1.0, musical: 0.4, drama: 1.1, comedy: 1.1, horror: 0.9, romance: 0.9, war: 0.6, sci_fi: 1.1, thriller: 1.1, action: 1.3, animated: 1.3, superhero: 1.2 },
        2007: { western: 0.4, crime: 1.0, musical: 0.4, drama: 1.1, comedy: 1.0, horror: 0.9, romance: 0.9, war: 0.6, sci_fi: 1.2, thriller: 1.0, action: 1.3, animated: 1.3, superhero: 1.3 },
        2008: { western: 0.3, crime: 1.0, musical: 0.3, drama: 1.0, comedy: 1.0, horror: 0.9, romance: 0.8, war: 0.6, sci_fi: 1.2, thriller: 1.0, action: 1.3, animated: 1.4, superhero: 1.5 },
        2009: { western: 0.3, crime: 0.9, musical: 0.3, drama: 1.0, comedy: 1.0, horror: 0.9, romance: 0.8, war: 0.7, sci_fi: 1.3, thriller: 1.0, action: 1.3, animated: 1.4, superhero: 1.5 },
        2010: { western: 0.3, crime: 0.9, musical: 0.3, drama: 1.0, comedy: 1.0, horror: 0.9, romance: 0.8, war: 0.6, sci_fi: 1.2, thriller: 1.0, action: 1.3, animated: 1.4, superhero: 1.6 }
    };

    // Critical reception impact (random but influenced by quality)
    const CRITICAL_IMPACT = {
        'rave': { multiplier: 1.4, probability: 0.05 },
        'positive': { multiplier: 1.2, probability: 0.25 },
        'mixed': { multiplier: 1.0, probability: 0.50 },
        'negative': { multiplier: 0.8, probability: 0.15 },
        'savage': { multiplier: 0.6, probability: 0.05 }
    };

    // Competition events (random market factors)
    const COMPETITION_EVENTS = [
        { name: "MGM releases major epic same weekend", impact: -0.35, probability: 0.08 },
        { name: "Warner Bros floods market with B-pictures", impact: -0.25, probability: 0.12 },
        { name: "RKO delays major release, clear weekend", impact: 0.20, probability: 0.10 },
        { name: "Real-world scandal dominates headlines", impact: -0.15, probability: 0.15 },
        { name: "Major star dies, industry mourning", impact: -0.40, probability: 0.02 },
        { name: "Economic upturn, people spending on entertainment", impact: 0.25, probability: 0.08 },
        { name: "Heat wave keeps people away from theaters", impact: -0.20, probability: 0.06 },
        { name: "Holiday weekend boosts attendance", impact: 0.30, probability: 0.12 }
    ];

    // Distribution strategies with realistic costs and returns
    const DISTRIBUTION_STRATEGIES = {
        wide: {
            name: "Wide Release",
            theaters: 500,
            marketingCost: 20000,
            theaterCut: 0.45,
            potential: { min: 150000, max: 600000 },
            description: "500 theaters nationwide - Maximum exposure, high risk/reward"
        },
        limited: {
            name: "Limited Release",
            theaters: 100,
            marketingCost: 5000,
            theaterCut: 0.30,
            prestigeBonus: 10,
            potential: { min: 80000, max: 250000 },
            description: "100 select theaters - Lower cost, builds prestige and Oscar buzz"
        },
        states_rights: {
            name: "States' Rights Sale",
            theaters: 0,
            marketingCost: 0,
            theaterCut: 0,
            potential: { min: 80000, max: 150000 },
            description: "Sell regional rights immediately - Guaranteed profit, no risk"
        }
    };

    function normalizePhase(phase) {
        if (!phase) return '';
        const mapping = {
            'DEVELOPMENT': 'greenlit',
            'PRE_PRODUCTION': 'pre_production',
            'PRINCIPAL_PHOTOGRAPHY': 'shooting',
            'POST_PRODUCTION': 'post_production',
            'DISTRIBUTION_PREP': 'post_production_complete',
            'COMPLETED': 'post_production_complete'
        };
        const normalized = mapping[phase] || phase;
        return typeof normalized === 'string' ? normalized.toLowerCase() : '';
    }

    function getAllFilms(gameState) {
        const collections = [];
        if (Array.isArray(gameState.films) && gameState.films.length > 0) {
            collections.push(...gameState.films);
        }
        if (Array.isArray(gameState.activeFilms)) {
            collections.push(...gameState.activeFilms);
        }
        if (Array.isArray(gameState.completedFilms)) {
            collections.push(...gameState.completedFilms);
        }

        const uniqueFilms = new Map();
        collections.forEach(film => {
            if (film && film.id && !uniqueFilms.has(film.id)) {
                uniqueFilms.set(film.id, film);
            }
        });

        return Array.from(uniqueFilms.values());
    }

    function findFilmById(gameState, filmId) {
        return getAllFilms(gameState).find(film => film.id === filmId);
    }

    /**
     * Calculate base box office potential based on film quality factors
     */
    function calculateBaseBoxOffice(film, strategy) {
        if (strategy === 'states_rights') {
            // States rights is based on film quality, not box office simulation
            const qualityMultiplier = Math.max(0.5, film.scriptQuality / 100);
            const baseValue = 50000;
            return Math.floor(baseValue + (30000 * qualityMultiplier) + (Math.random() * 10000));
        }

        // Base calculation starts with script quality
        let baseGross = film.scriptQuality * 2000; // $2000 per quality point

        // Apply star power (total cast influence)
        if (film.cast && film.cast.length > 0) {
            const totalStarPower = film.cast.reduce((sum, actor) => sum + (actor.starPower || 50), 0);
            const avgStarPower = totalStarPower / film.cast.length;
            baseGross *= (1 + (avgStarPower - 50) / 100);
        }

        // Apply genre heat for current year
        const currentYear = window.TimeSystem.getCurrentDate().year;
        const yearHeat = GENRE_HEAT[currentYear] || GENRE_HEAT[1949];
        const genreMultiplier = yearHeat[film.genre.toLowerCase()] || 1.0;
        baseGross *= genreMultiplier;

        // Apply distribution strategy multiplier
        const strategyData = DISTRIBUTION_STRATEGIES[strategy];
        if (strategy === 'wide') {
            baseGross *= 1.8; // Wide release - maximum audience potential
        } else if (strategy === 'limited') {
            baseGross *= 1.5; // Limited release - focused audience, better per-screen
        } else if (strategy === 'states_rights') {
            baseGross *= 1.0; // States' rights - flat guaranteed sale
        }

        return Math.floor(baseGross);
    }

    /**
     * Generate random events that affect box office performance
     */
    function generateMarketEvents() {
        const events = [];
        
        // Competition event (20% chance)
        if (Math.random() < 0.20) {
            const competitionEvent = COMPETITION_EVENTS[Math.floor(Math.random() * COMPETITION_EVENTS.length)];
            if (Math.random() < competitionEvent.probability) {
                events.push({
                    type: 'competition',
                    description: competitionEvent.name,
                    impact: competitionEvent.impact
                });
            }
        }

        // Weather/external factors (15% chance)
        if (Math.random() < 0.15) {
            const weatherEvents = [
                { desc: "Perfect weather drives people to outdoor activities", impact: -0.10 },
                { desc: "Rainy weekend keeps audiences in theaters", impact: 0.15 },
                { desc: "Major sporting event distracts audiences", impact: -0.20 },
                { desc: "Transit strike affects downtown theater attendance", impact: -0.25 }
            ];
            const event = weatherEvents[Math.floor(Math.random() * weatherEvents.length)];
            events.push({
                type: 'external',
                description: event.desc,
                impact: event.impact
            });
        }

        return events;
    }

    /**
     * Determine critical reception based on film quality
     */
    function generateCriticalReception(film) {
        const quality = film.scriptQuality;
        let receptionType;

        // Higher quality films more likely to get good reviews
        const rand = Math.random();
        if (quality >= 90 && rand < 0.30) {
            receptionType = 'rave';
        } else if (quality >= 80 && rand < 0.40) {
            receptionType = 'positive';  
        } else if (quality >= 60) {
            receptionType = 'mixed';
        } else if (quality >= 40) {
            receptionType = 'negative';
        } else {
            receptionType = 'savage';
        }

        const reception = CRITICAL_IMPACT[receptionType];
        return {
            type: receptionType,
            description: getCriticalDescription(receptionType, film.title),
            multiplier: reception.multiplier
        };
    }

    function getCriticalDescription(type, filmTitle) {
        const descriptions = {
            'rave': `Critics hail "${filmTitle}" as a masterpiece!`,
            'positive': `"${filmTitle}" earns solid reviews from critics`,
            'mixed': `Critics divided on "${filmTitle}" - mixed reception`,
            'negative': `Critics pan "${filmTitle}" - harsh reviews`,
            'savage': `"${filmTitle}" savaged by critics - devastating reviews`
        };
        return descriptions[type] || descriptions['mixed'];
    }

    /**
     * Simulate week-by-week box office performance
     */
    function simulateWeeklyBoxOffice(film, strategy, totalProjectedGross) {
        const weeks = [];
        const events = generateMarketEvents();
        const criticalReception = generateCriticalReception(film);
        
        // Apply critical and event multipliers to total gross
        let adjustedTotal = totalProjectedGross * criticalReception.multiplier;
        
        events.forEach(event => {
            adjustedTotal *= (1 + event.impact);
        });

        // Ensure it stays within reasonable bounds
        const strategyData = DISTRIBUTION_STRATEGIES[strategy];
        adjustedTotal = Math.max(
            strategyData.potential.min * 0.3, 
            Math.min(adjustedTotal, strategyData.potential.max * 1.5)
        );

        // Week-by-week breakdown (typical box office curve)
        const weeklyPercentages = [0.45, 0.25, 0.18, 0.12]; // Week 1, 2, 3, 4
        let runningTotal = 0;
        const theaterCut = strategyData.theaterCut;

        weeklyPercentages.forEach((percentage, weekIndex) => {
            const weekGross = Math.floor(adjustedTotal * percentage);
            const studioRevenue = Math.floor(weekGross * (1 - theaterCut));
            
            weeks.push({
                week: weekIndex + 1,
                grossRevenue: weekGross,
                studioRevenue: studioRevenue,
                theaterCut: weekGross - studioRevenue,
                dropoff: weekIndex > 0 ? 
                    Math.floor(((weeks[weekIndex-1].grossRevenue - weekGross) / weeks[weekIndex-1].grossRevenue) * 100) : 0
            });
            
            runningTotal += studioRevenue;
        });

        return {
            weeks: weeks,
            totalGross: adjustedTotal,
            totalStudioRevenue: runningTotal,
            marketingCost: strategyData.marketingCost,
            netRevenue: runningTotal - strategyData.marketingCost,
            events: events,
            criticalReception: criticalReception,
            strategy: strategy
        };
    }

    /**
     * Handle film release and distribution choice
     */
    function releaseFilm(filmId, strategy) {
        const gameState = window.HollywoodMogul.getGameState();
        const film = findFilmById(gameState, filmId);
        const phase = normalizePhase(film?.phase);

        if (!film || (phase !== 'post_production_complete' && phase !== 'completed')) {
            return { success: false, message: "Film not ready for release" };
        }

        const budget = film.actualBudget ?? film.currentBudget ?? film.originalBudget ?? 0;

        // For states' rights, immediate payment
        if (strategy === 'states_rights') {
            const payment = calculateBaseBoxOffice(film, strategy);
            gameState.cash += payment;
            gameState.totalRevenue += payment;
            window.FinancialSystem.addTransaction(payment, `States' Rights sale: ${film.title}`);

            film.phase = 'completed';
            film.distribution = {
                strategy: 'states_rights',
                totalRevenue: payment,
                netProfit: payment - budget,
                completedDate: window.TimeSystem.getCurrentDate()
            };

            if (window.HollywoodMogul && typeof window.HollywoodMogul.addEvent === 'function') {
                window.HollywoodMogul.addEvent({
                    type: 'financial',
                    title: 'Film Rights Sold',
                    message: `Sold distribution rights for "${film.title}" for $${payment.toLocaleString()}`,
                    severity: 'info'
                });
            }

            return { success: true, payment: payment };
        }

        // For theatrical releases, start box office simulation
        const projectedGross = calculateBaseBoxOffice(film, strategy);
        const boxOfficeResults = simulateWeeklyBoxOffice(film, strategy, projectedGross);
        
        // Pay marketing costs upfront
        const marketingCost = DISTRIBUTION_STRATEGIES[strategy].marketingCost;
        if (!window.FinancialSystem.canAfford(marketingCost)) {
            return { success: false, message: `Cannot afford $${marketingCost.toLocaleString()} marketing cost` };
        }

        gameState.cash -= marketingCost;
        window.FinancialSystem.addTransaction(-marketingCost, `Marketing: ${film.title}`);
        
        film.phase = 'in_theaters';
        film.distribution = {
            strategy: strategy,
            boxOfficeResults: boxOfficeResults,
            currentWeek: 0,
            releaseDate: window.TimeSystem.getCurrentDate(),
            marketingCost: marketingCost
        };

        // Limited release builds prestige and Oscar buzz
        if (strategy === 'limited' && DISTRIBUTION_STRATEGIES.limited.prestigeBonus) {
            gameState.reputation = Math.min(100, gameState.reputation + DISTRIBUTION_STRATEGIES.limited.prestigeBonus);
            if (window.HollywoodMogul) {
                window.HollywoodMogul.addAlert({
                    type: 'success',
                    icon: '🎭',
                    message: `Limited release of "${film.title}" builds critical prestige! (+${DISTRIBUTION_STRATEGIES.limited.prestigeBonus} reputation)`,
                    priority: 'medium'
                });
            }
        }

        // Add initial event
        if (window.HollywoodMogul && typeof window.HollywoodMogul.addEvent === 'function') {
            window.HollywoodMogul.addEvent({
                type: 'production',
                title: 'Film Released!',
                message: `"${film.title}" opens in theaters with ${DISTRIBUTION_STRATEGIES[strategy].name}`,
                severity: 'success'
            });
        }

        // Add critical reception event
        if (boxOfficeResults.criticalReception && window.HollywoodMogul && typeof window.HollywoodMogul.addEvent === 'function') {
            window.HollywoodMogul.addEvent({
                type: 'production',
                title: 'Critical Reception',
                message: boxOfficeResults.criticalReception.description,
                severity: boxOfficeResults.criticalReception.type === 'rave' || boxOfficeResults.criticalReception.type === 'positive' ? 'success' : 'warning'
            });
        }

        // Add market events
        if (window.HollywoodMogul && typeof window.HollywoodMogul.addEvent === 'function') {
            boxOfficeResults.events.forEach(event => {
                window.HollywoodMogul.addEvent({
                    type: 'market',
                    title: 'Market Conditions',
                    message: event.description,
                    severity: event.impact > 0 ? 'success' : 'warning'
                });
            });
        }

        return { success: true, results: boxOfficeResults };
    }

    /**
     * Process weekly box office updates for films in theaters
     */
    function processWeeklyBoxOffice() {
        const gameState = window.HollywoodMogul.getGameState();
        const filmsInTheaters = getAllFilms(gameState).filter(f => normalizePhase(f.phase) === 'in_theaters');

        filmsInTheaters.forEach(film => {
            const distribution = film.distribution;
            const currentWeek = distribution.currentWeek;
            
            if (currentWeek < distribution.boxOfficeResults.weeks.length) {
                const weekData = distribution.boxOfficeResults.weeks[currentWeek];

                // Add studio revenue to cash
                gameState.cash += weekData.studioRevenue;
                gameState.totalRevenue += weekData.studioRevenue;
                window.FinancialSystem.addTransaction(
                    weekData.studioRevenue,
                    `Box office: ${film.title} (Week ${weekData.week})`
                );
                
                distribution.currentWeek++;
                
                // Create box office update event
                const dropoffText = weekData.dropoff > 0 ? ` (↓${weekData.dropoff}%)` : '';
                if (window.HollywoodMogul && typeof window.HollywoodMogul.addEvent === 'function') {
                    window.HollywoodMogul.addEvent({
                        type: 'financial',
                        title: `Box Office Update`,
                        message: `"${film.title}" Week ${weekData.week}: $${weekData.grossRevenue.toLocaleString()} gross${dropoffText}`,
                        severity: weekData.grossRevenue > 50000 ? 'success' : 'info'
                    });
                }

                // Check if film run is complete
                if (distribution.currentWeek >= distribution.boxOfficeResults.weeks.length) {
                    film.phase = 'completed';
                    film.inTheaters = false;
                    const totalRevenue = distribution.boxOfficeResults.totalStudioRevenue;
                    const totalGross = distribution.boxOfficeResults.totalGross;
                    const budget = film.actualBudget ?? film.currentBudget ?? film.originalBudget ?? 0;
                    const netProfit = totalRevenue - budget - distribution.marketingCost;

                    // Update film and game stats
                    film.totalGross = totalGross;
                    film.studioRevenue = totalRevenue;
                    gameState.stats.boxOfficeTotal += totalGross;

                    film.distribution.totalRevenue = totalRevenue;
                    film.distribution.netProfit = netProfit;
                    film.distribution.completedDate = new Date(gameState.currentDate);

                    if (window.HollywoodMogul && typeof window.HollywoodMogul.addEvent === 'function') {
                        window.HollywoodMogul.addEvent({
                            type: 'production',
                            title: 'Theatrical Run Complete',
                            message: `"${film.title}" finishes theatrical run. Total revenue: $${totalRevenue.toLocaleString()}. ${netProfit >= 0 ? 'Profit' : 'Loss'}: $${Math.abs(netProfit).toLocaleString()}`,
                            severity: netProfit >= 0 ? 'success' : 'warning'
                        });
                    }
                }
            }
        });
    }

    /**
     * Get available distribution strategies for a film
     */
    function getDistributionStrategies(film) {
        const strategies = {};
        const gameState = window.HollywoodMogul.getGameState();
        const budget = film.actualBudget ?? film.currentBudget ?? film.originalBudget ?? film.budget ?? 0;

        Object.keys(DISTRIBUTION_STRATEGIES).forEach(key => {
            const strategy = { ...DISTRIBUTION_STRATEGIES[key] };

            // Calculate projected returns for this film
            if (key !== 'states_rights') {
                const baseGross = calculateBaseBoxOffice(film, key);
                strategy.projectedGross = baseGross;
                strategy.projectedStudioRevenue = Math.floor(baseGross * (1 - strategy.theaterCut));
                strategy.projectedProfit = strategy.projectedStudioRevenue - strategy.marketingCost - budget;
            } else {
                strategy.guaranteedPayment = calculateBaseBoxOffice(film, key);
                strategy.projectedProfit = strategy.guaranteedPayment - budget;
            }
            
            // Check affordability
            strategy.canAfford = strategy.marketingCost === 0 || window.FinancialSystem.canAfford(strategy.marketingCost);
            
            strategies[key] = strategy;
        });
        
        return strategies;
    }

    /**
     * Get current box office performance for films in theaters
     */
    function getCurrentBoxOfficeData() {
        const gameState = window.HollywoodMogul.getGameState();
        return getAllFilms(gameState)
            .filter(f => {
                const phase = normalizePhase(f.phase);
                return phase === 'in_theaters' || phase === 'completed';
            })
            .map(film => ({
                id: film.id,
                title: film.title,
                phase: normalizePhase(film.phase),
                distribution: film.distribution,
                actualBudget: film.actualBudget ?? film.currentBudget ?? film.originalBudget ?? 0
            }));
    }

    // Initialize system
    function init() {
        // Register weekly update callback
        if (window.TimeSystem) {
            window.TimeSystem.addWeeklyCallback(processWeeklyBoxOffice);
        }
    }

    // Public API
    /**
     * Get genre heat multipliers for a specific year.
     * This is the single source of truth for per-year genre popularity.
     * TimeSystem.getEraGenreModifiers delegates here when available.
     * @param {number} year
     * @returns {Object} genre -> multiplier map
     */
    function getGenreHeatForYear(year) {
        return GENRE_HEAT[year] || GENRE_HEAT[2010] || {};
    }

    return {
        init: init,
        releaseFilm: releaseFilm,
        getDistributionStrategies: getDistributionStrategies,
        getCurrentBoxOfficeData: getCurrentBoxOfficeData,
        calculateBaseBoxOffice: calculateBaseBoxOffice,
        simulateWeeklyBoxOffice: simulateWeeklyBoxOffice,
        processWeeklyBoxOffice: processWeeklyBoxOffice,
        getGenreHeatForYear: getGenreHeatForYear,
        GENRE_HEAT: GENRE_HEAT
    };
})();