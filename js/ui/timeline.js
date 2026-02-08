/**
 * HOLLYWOOD MOGUL - INTERACTIVE TIMELINE UI
 * Visual timeline showing progression through Hollywood history (1933-1949)
 */

window.TimelineUI = (function() {
    'use strict';

    // Historical events with their icons and descriptions
    const TIMELINE_EVENTS = {
        1934: {
            month: 7,
            title: 'Hays Code Enforcement',
            icon: '⚖️',
            description: 'Production Code Administration begins strict moral censorship of all films.',
            impact: 'All scripts must now be approved. Controversial content is forbidden.',
            color: '#8B0000'
        },
        1937: {
            month: 6,
            title: 'Technicolor Available',
            icon: '🎨',
            description: 'Advanced color film technology becomes available for major productions.',
            impact: '+50% production cost, +40% box office potential for color films.',
            color: '#DAA520'
        },
        1939: {
            month: 12,
            title: 'Gone With the Wind',
            icon: '🏆',
            description: 'Epic film sets new standards for production values and box office success.',
            impact: 'Audience expectations increase. Epic genre gets major boost.',
            color: '#006400'
        },
        1941: {
            month: 12,
            title: 'Pearl Harbor',
            icon: '🎖️',
            description: 'America enters WWII. Hollywood becomes part of the war effort.',
            impact: 'Patriotic films encouraged. Male actors face draft. Material rationing.',
            color: '#8B0000'
        },
        1947: {
            month: 10,
            title: 'HUAC Begins',
            icon: '⚠️',
            description: 'House Un-American Activities Committee investigates Hollywood for communism.',
            impact: 'Political content is dangerous. Blacklisting begins. Careers destroyed.',
            color: '#FF4500'
        },
        1948: {
            month: 5,
            title: 'Paramount Decision',
            icon: '⚖️',
            description: 'Supreme Court forces studios to divest their theater chains.',
            impact: 'Studio system begins to crumble. Independent producers rise.',
            color: '#4B0082'
        }
    };

    // Era definitions with styling
    const ERAS = {
        PRE_CODE: {
            name: 'Pre-Code Era',
            startYear: 1933,
            endYear: 1934,
            color: '#B8860B',
            description: 'Unregulated content, creative freedom, gangster films thrive'
        },
        GOLDEN_AGE: {
            name: 'Golden Age',
            startYear: 1935,
            endYear: 1940,
            color: '#DAA520',
            description: 'Peak studio system, musicals and comedies dominate'
        },
        WAR_YEARS: {
            name: 'War Years',
            startYear: 1941,
            endYear: 1945,
            color: '#8B4513',
            description: 'Patriotic films, actor shortages, material rationing'
        },
        POST_WAR: {
            name: 'Post-War Era',
            startYear: 1946,
            endYear: 1949,
            color: '#4B0082',
            description: 'Film noir emerges, HUAC hearings, studio system declines'
        }
    };

    let currentFilter = 'both'; // 'films', 'events', 'both'
    let selectedFilm = null;

    /**
     * Initialize the timeline UI
     */
    function init() {
    }

    /**
     * Render the complete timeline
     */
    function renderTimeline() {
        const gameState = window.HollywoodMogul.getGameState();
        const currentYear = gameState.currentDate.getFullYear();
        const currentMonth = gameState.currentDate.getMonth() + 1;

        const container = document.getElementById('timeline-visualization');
        if (!container) return;

        container.innerHTML = `
            ${renderFilterControls()}
            ${renderTimelineHeader(currentYear)}
            <div class="timeline-scroll-container">
                ${renderYearTimeline(currentYear, currentMonth, gameState)}
            </div>
            ${renderTimelineLegend()}
            ${renderSelectedFilmDetails()}
        `;

        // Scroll to current year
        scrollToCurrentYear(currentYear);

        // Attach event listeners
        attachTimelineEventListeners();
    }

    /**
     * Render filter controls
     */
    function renderFilterControls() {
        return `
            <div class="timeline-filters">
                <button class="filter-btn ${currentFilter === 'both' ? 'active' : ''}" data-filter="both">
                    📊 Show All
                </button>
                <button class="filter-btn ${currentFilter === 'films' ? 'active' : ''}" data-filter="films">
                    🎬 Films Only
                </button>
                <button class="filter-btn ${currentFilter === 'events' ? 'active' : ''}" data-filter="events">
                    📰 Events Only
                </button>
            </div>
        `;
    }

    /**
     * Render timeline header with current position
     */
    function renderTimelineHeader(currentYear) {
        const era = getEraForYear(currentYear);
        return `
            <div class="timeline-header">
                <h3 class="timeline-title">HOLLYWOOD HISTORY TIMELINE</h3>
                <div class="timeline-current-position">
                    <span class="current-indicator">YOU ARE HERE ►</span>
                    <span class="current-year">${currentYear}</span>
                    <span class="current-era" style="color: ${era.color}">${era.name}</span>
                </div>
            </div>
        `;
    }

    /**
     * Render the main year-based timeline
     */
    function renderYearTimeline(currentYear, currentMonth, gameState) {
        let html = '<div class="timeline-years">';

        for (let year = 1933; year <= 1949; year++) {
            const era = getEraForYear(year);
            const isPast = year < currentYear || (year === currentYear && currentMonth >= 12);
            const isCurrent = year === currentYear;
            const isFuture = year > currentYear;

            html += `
                <div class="timeline-year ${isCurrent ? 'current-year' : ''} ${isFuture ? 'future-year' : ''}"
                     data-year="${year}">
                    <!-- Era marker -->
                    ${isEraStart(year) ? `<div class="era-marker" style="background: ${era.color}">${era.name}</div>` : ''}

                    <!-- Year label -->
                    <div class="year-label" style="border-color: ${era.color}">
                        ${year}
                        ${isCurrent ? '<span class="you-are-here">★</span>' : ''}
                    </div>

                    <!-- Events track -->
                    ${(currentFilter === 'both' || currentFilter === 'events') ? renderEventsTrack(year, isPast, isFuture) : ''}

                    <!-- Films track -->
                    ${(currentFilter === 'both' || currentFilter === 'films') ? renderFilmsTrack(year, gameState, isPast, isFuture) : ''}

                    <!-- Box office bar chart -->
                    ${renderBoxOfficeBar(year, gameState, isPast, isFuture)}
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    /**
     * Render events track for a specific year
     */
    function renderEventsTrack(year, isPast, isFuture) {
        const event = TIMELINE_EVENTS[year];

        if (!event) {
            return '<div class="events-track"></div>';
        }

        const opacity = isFuture ? 0.4 : 1.0;
        const classes = isFuture ? 'event-marker future' : 'event-marker';

        return `
            <div class="events-track">
                <div class="${classes}"
                     data-year="${year}"
                     data-event-id="${year}"
                     style="background: ${event.color}; opacity: ${opacity};"
                     title="${event.title}">
                    <span class="event-icon">${event.icon}</span>
                    <span class="event-title">${event.title}</span>
                </div>
            </div>
        `;
    }

    /**
     * Render films track for a specific year
     */
    function renderFilmsTrack(year, gameState, isPast, isFuture) {
        const films = getFilmsReleasedInYear(year, gameState);

        if (films.length === 0) {
            return '<div class="films-track"></div>';
        }

        const opacity = isFuture ? 0.3 : 1.0;

        let html = '<div class="films-track">';
        films.forEach(film => {
            const success = getFilmSuccessLevel(film);
            html += `
                <div class="film-marker ${success.class}"
                     data-film-id="${film.id}"
                     style="opacity: ${opacity};"
                     title="${film.title}">
                    <span class="film-dot">🎬</span>
                    <span class="film-name">${film.title}</span>
                </div>
            `;
        });
        html += '</div>';

        return html;
    }

    /**
     * Render box office performance bar for a year
     */
    function renderBoxOfficeBar(year, gameState, isPast, isFuture) {
        if (isFuture || !isPast) {
            return '<div class="boxoffice-bar"></div>';
        }

        const revenue = getYearlyBoxOfficeRevenue(year, gameState);
        const maxRevenue = getMaxYearlyRevenue(gameState);
        const heightPercent = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;

        if (revenue === 0) {
            return '<div class="boxoffice-bar"></div>';
        }

        return `
            <div class="boxoffice-bar">
                <div class="revenue-bar"
                     style="height: ${Math.min(heightPercent, 100)}%"
                     title="Box Office: $${revenue.toLocaleString()}">
                    <span class="revenue-amount">$${formatRevenue(revenue)}</span>
                </div>
            </div>
        `;
    }

    /**
     * Render timeline legend
     */
    function renderTimelineLegend() {
        return `
            <div class="timeline-legend">
                <div class="legend-section">
                    <h4>Eras</h4>
                    ${Object.values(ERAS).map(era => `
                        <div class="legend-item">
                            <span class="legend-color" style="background: ${era.color}"></span>
                            <span class="legend-label">${era.name} (${era.startYear}-${era.endYear})</span>
                        </div>
                    `).join('')}
                </div>
                <div class="legend-section">
                    <h4>Film Performance</h4>
                    <div class="legend-item">
                        <span class="legend-color success"></span>
                        <span class="legend-label">Hit (Profitable)</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color moderate"></span>
                        <span class="legend-label">Moderate Success</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color flop"></span>
                        <span class="legend-label">Flop (Lost Money)</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render selected film details panel
     */
    function renderSelectedFilmDetails() {
        if (!selectedFilm) {
            return '<div id="film-details-panel" class="film-details-panel hidden"></div>';
        }

        const success = getFilmSuccessLevel(selectedFilm);
        const budget = selectedFilm.actualBudget || selectedFilm.currentBudget || selectedFilm.originalBudget || 0;
        const revenue = calculateFilmRevenue(selectedFilm);
        const profit = revenue - budget;

        return `
            <div id="film-details-panel" class="film-details-panel">
                <button class="close-details">×</button>
                <h3 class="film-details-title">${selectedFilm.title}</h3>
                <div class="film-details-content">
                    <div class="detail-row">
                        <span class="detail-label">Genre:</span>
                        <span class="detail-value">${selectedFilm.genre}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Budget:</span>
                        <span class="detail-value">$${budget.toLocaleString()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Box Office:</span>
                        <span class="detail-value">$${revenue.toLocaleString()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Profit/Loss:</span>
                        <span class="detail-value ${profit >= 0 ? 'profit' : 'loss'}">
                            ${profit >= 0 ? '+' : ''}$${profit.toLocaleString()}
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Result:</span>
                        <span class="detail-value ${success.class}">${success.label}</span>
                    </div>
                    ${selectedFilm.distribution ? `
                        <div class="detail-row">
                            <span class="detail-label">Strategy:</span>
                            <span class="detail-value">${formatDistributionStrategy(selectedFilm.distribution.strategy)}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners to timeline elements
     */
    function attachTimelineEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentFilter = e.target.dataset.filter;
                renderTimeline();
            });
        });

        // Event markers (hover for details)
        document.querySelectorAll('.event-marker').forEach(marker => {
            marker.addEventListener('mouseenter', (e) => {
                const year = parseInt(e.currentTarget.dataset.year);
                showEventTooltip(e.currentTarget, year);
            });
        });

        // Film markers (click for details)
        document.querySelectorAll('.film-marker').forEach(marker => {
            marker.addEventListener('click', (e) => {
                const filmId = e.currentTarget.dataset.filmId;
                const gameState = window.HollywoodMogul.getGameState();
                selectedFilm = findFilmById(filmId, gameState);
                renderTimeline();
            });
        });

        // Close details panel
        const closeBtn = document.querySelector('.close-details');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                selectedFilm = null;
                renderTimeline();
            });
        }
    }

    /**
     * Show event tooltip
     */
    function showEventTooltip(element, year) {
        const event = TIMELINE_EVENTS[year];
        if (!event) return;

        // Create or update tooltip
        let tooltip = document.getElementById('event-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'event-tooltip';
            tooltip.className = 'event-tooltip';
            document.body.appendChild(tooltip);
        }

        tooltip.innerHTML = `
            <div class="tooltip-header">
                <span class="tooltip-icon">${event.icon}</span>
                <h4>${event.title}</h4>
            </div>
            <p class="tooltip-description">${event.description}</p>
            <p class="tooltip-impact"><strong>Impact:</strong> ${event.impact}</p>
        `;

        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.display = 'block';

        // Remove on mouse leave
        element.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        }, { once: true });
    }

    /**
     * Scroll timeline to current year
     */
    function scrollToCurrentYear(currentYear) {
        setTimeout(() => {
            const currentYearElement = document.querySelector('.timeline-year.current-year');
            if (currentYearElement) {
                currentYearElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
        }, 100);
    }

    /**
     * Helper: Get era for a specific year
     */
    function getEraForYear(year) {
        for (const era of Object.values(ERAS)) {
            if (year >= era.startYear && year <= era.endYear) {
                return era;
            }
        }
        return ERAS.PRE_CODE; // fallback
    }

    /**
     * Helper: Check if year is start of an era
     */
    function isEraStart(year) {
        return Object.values(ERAS).some(era => era.startYear === year);
    }

    /**
     * Helper: Get all films released in a specific year
     */
    function getFilmsReleasedInYear(year, gameState) {
        const allFilms = getAllFilms(gameState);
        return allFilms.filter(film => {
            if (film.releaseDate) {
                const releaseYear = film.releaseDate.getFullYear
                    ? film.releaseDate.getFullYear()
                    : film.releaseDate.year;
                return releaseYear === year;
            }
            return false;
        });
    }

    /**
     * Helper: Get all films from game state
     */
    function getAllFilms(gameState) {
        const collections = [];
        if (Array.isArray(gameState.films)) collections.push(...gameState.films);
        if (Array.isArray(gameState.activeFilms)) collections.push(...gameState.activeFilms);
        if (Array.isArray(gameState.completedFilms)) collections.push(...gameState.completedFilms);

        const uniqueFilms = new Map();
        collections.forEach(film => {
            if (film && film.id && !uniqueFilms.has(film.id)) {
                uniqueFilms.set(film.id, film);
            }
        });

        return Array.from(uniqueFilms.values());
    }

    /**
     * Helper: Find film by ID
     */
    function findFilmById(filmId, gameState) {
        return getAllFilms(gameState).find(film => film.id === filmId);
    }

    /**
     * Helper: Calculate film revenue
     */
    function calculateFilmRevenue(film) {
        if (film.distribution && film.distribution.boxOfficeResults) {
            const weeks = film.distribution.boxOfficeResults.weeks || [];
            return weeks.reduce((sum, week) => sum + (week.studioRevenue || 0), 0);
        }
        return 0;
    }

    /**
     * Helper: Determine film success level
     */
    function getFilmSuccessLevel(film) {
        const budget = film.actualBudget || film.currentBudget || film.originalBudget || 0;
        const revenue = calculateFilmRevenue(film);
        const profit = revenue - budget;
        const roi = budget > 0 ? (profit / budget) * 100 : 0;

        if (roi >= 50) {
            return { class: 'success', label: 'Major Hit' };
        } else if (roi >= 0) {
            return { class: 'moderate', label: 'Profitable' };
        } else {
            return { class: 'flop', label: 'Flop' };
        }
    }

    /**
     * Helper: Get yearly box office revenue
     */
    function getYearlyBoxOfficeRevenue(year, gameState) {
        const films = getFilmsReleasedInYear(year, gameState);
        return films.reduce((sum, film) => sum + calculateFilmRevenue(film), 0);
    }

    /**
     * Helper: Get maximum yearly revenue (for bar chart scaling)
     */
    function getMaxYearlyRevenue(gameState) {
        let max = 0;
        for (let year = 1933; year <= 1949; year++) {
            const revenue = getYearlyBoxOfficeRevenue(year, gameState);
            max = Math.max(max, revenue);
        }
        return max || 1000000; // Prevent division by zero
    }

    /**
     * Helper: Format revenue for display
     */
    function formatRevenue(amount) {
        if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `${(amount / 1000).toFixed(0)}K`;
        }
        return amount.toString();
    }

    /**
     * Helper: Format distribution strategy
     */
    function formatDistributionStrategy(strategy) {
        const names = {
            wide: 'Wide Release',
            limited: 'Limited Release',
            states_rights: "States' Rights Sale"
        };
        return names[strategy] || strategy;
    }

    /**
     * Public API
     */
    return {
        init,
        renderTimeline
    };
})();
