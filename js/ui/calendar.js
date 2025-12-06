/**
 * HOLLYWOOD MOGUL - PRODUCTION CALENDAR VIEW
 * Timeline visualization of your entire studio operation
 * Chain D Feature #14 - FEEDBACK & CLARITY
 */

window.CalendarView = (function() {
    'use strict';

    let currentView = 'month'; // month, quarter, year
    let currentStartDate = null;

    /**
     * Initialize calendar view
     */
    function init() {
        const gameState = window.HollywoodMogul.getGameState();
        currentStartDate = new Date(gameState.currentDate);
    }

    /**
     * Render calendar timeline
     */
    function renderCalendar(containerId = 'calendar-view') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Calendar container not found:', containerId);
            return;
        }

        const gameState = window.HollywoodMogul.getGameState();
        if (!currentStartDate) {
            currentStartDate = new Date(gameState.currentDate);
        }

        const calendarData = buildCalendarData(gameState);

        container.innerHTML = `
            <div class="calendar-view">
                <div class="calendar-header">
                    <div class="calendar-title-section">
                        <h3 class="calendar-title">PRODUCTION CALENDAR</h3>
                        <span class="calendar-subtitle">Studio Timeline Overview</span>
                    </div>
                    <div class="calendar-controls">
                        <div class="view-selector">
                            <button class="view-btn ${currentView === 'month' ? 'active' : ''}"
                                    onclick="CalendarView.setView('month')">
                                Month
                            </button>
                            <button class="view-btn ${currentView === 'quarter' ? 'active' : ''}"
                                    onclick="CalendarView.setView('quarter')">
                                Quarter
                            </button>
                            <button class="view-btn ${currentView === 'year' ? 'active' : ''}"
                                    onclick="CalendarView.setView('year')">
                                Year
                            </button>
                        </div>
                        <div class="calendar-navigation">
                            <button class="nav-btn" onclick="CalendarView.navigate('prev')">‹</button>
                            <span class="current-period">${formatPeriod(currentStartDate, currentView)}</span>
                            <button class="nav-btn" onclick="CalendarView.navigate('next')">›</button>
                            <button class="nav-btn today" onclick="CalendarView.navigate('today')">Today</button>
                        </div>
                    </div>
                </div>

                ${renderTimeline(calendarData, gameState)}

                <div class="calendar-legend">
                    <div class="legend-group">
                        <span class="legend-title">Films:</span>
                        <div class="legend-item">
                            <span class="legend-bar production"></span>
                            <span>In Production</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-bar theaters"></span>
                            <span>In Theaters</span>
                        </div>
                    </div>
                    <div class="legend-group">
                        <span class="legend-title">Events:</span>
                        <div class="legend-item">
                            <span class="legend-marker historical">📰</span>
                            <span>Historical</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-marker awards">🏆</span>
                            <span>Awards</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-marker milestone">⭐</span>
                            <span>Milestone</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Build calendar data structure
     */
    function buildCalendarData(gameState) {
        const data = {
            films: [],
            events: [],
            timespan: getTimespan(currentStartDate, currentView)
        };

        // Get all films (active and in theaters)
        const allFilms = getAllFilms(gameState);

        allFilms.forEach(film => {
            const filmData = extractFilmTimelineData(film, gameState);
            if (filmData) {
                data.films.push(filmData);
            }
        });

        // Get historical events
        if (window.HistoricalEvents && window.HistoricalEvents.getAllEvents) {
            const historicalEvents = window.HistoricalEvents.getAllEvents();
            historicalEvents.forEach(event => {
                const eventData = extractEventTimelineData(event, 'historical');
                if (eventData && isInTimespan(eventData.date, data.timespan)) {
                    data.events.push(eventData);
                }
            });
        }

        // Get awards deadlines
        const awardsEvents = generateAwardsDeadlines(gameState);
        awardsEvents.forEach(event => {
            if (isInTimespan(event.date, data.timespan)) {
                data.events.push(event);
            }
        });

        return data;
    }

    /**
     * Render timeline visualization
     */
    function renderTimeline(calendarData, gameState) {
        const { timespan } = calendarData;
        const totalDays = (timespan.end - timespan.start) / (1000 * 60 * 60 * 24);

        return `
            <div class="timeline-container">
                <div class="timeline-header">
                    ${renderTimelineHeaders(timespan, currentView)}
                </div>

                <div class="timeline-content">
                    <!-- Films Section -->
                    <div class="timeline-section films-section">
                        <div class="section-label">Films</div>
                        <div class="timeline-rows">
                            ${calendarData.films.length > 0 ?
                                calendarData.films.map(film =>
                                    renderFilmBar(film, timespan, totalDays)
                                ).join('') :
                                '<div class="no-items">No films in timeline</div>'
                            }
                        </div>
                    </div>

                    <!-- Events Section -->
                    <div class="timeline-section events-section">
                        <div class="section-label">Events</div>
                        <div class="timeline-events">
                            ${renderTimelineEvents(calendarData.events, timespan, totalDays)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render timeline headers (time markers)
     */
    function renderTimelineHeaders(timespan, view) {
        const markers = generateTimeMarkers(timespan, view);

        return `
            <div class="timeline-markers">
                ${markers.map(marker => `
                    <div class="time-marker" style="left: ${marker.position}%">
                        <span class="marker-label">${marker.label}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render a film bar on the timeline
     */
    function renderFilmBar(film, timespan, totalDays) {
        const startPos = calculatePosition(film.startDate, timespan, totalDays);
        const endPos = calculatePosition(film.endDate, timespan, totalDays);
        const width = endPos - startPos;

        const statusClass = getFilmStatusClass(film.type);

        return `
            <div class="timeline-row" data-film-id="${film.id}">
                <div class="timeline-bar ${statusClass}"
                     style="left: ${startPos}%; width: ${width}%"
                     onclick="CalendarView.showFilmDetails('${film.id}')">
                    <div class="bar-content">
                        <span class="bar-title">${film.title}</span>
                        <span class="bar-subtitle">${film.subtitle}</span>
                    </div>
                    <div class="bar-tooltip">
                        <strong>${film.title}</strong><br>
                        ${film.subtitle}<br>
                        ${formatDate(film.startDate)} → ${formatDate(film.endDate)}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render timeline events
     */
    function renderTimelineEvents(events, timespan, totalDays) {
        if (events.length === 0) {
            return '<div class="no-items">No events in timeline</div>';
        }

        return events.map(event => {
            const position = calculatePosition(event.date, timespan, totalDays);

            return `
                <div class="timeline-event ${event.type}"
                     style="left: ${position}%"
                     onclick="CalendarView.showEventDetails('${event.id}')">
                    <div class="event-marker">${event.icon}</div>
                    <div class="event-label">${event.title}</div>
                    <div class="event-tooltip">
                        <strong>${event.title}</strong><br>
                        ${formatDate(event.date)}<br>
                        ${event.description || ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Show film details modal
     */
    function showFilmDetails(filmId) {
        const gameState = window.HollywoodMogul.getGameState();
        const allFilms = getAllFilms(gameState);
        const film = allFilms.find(f => f.id === filmId);

        if (!film) return;

        const modalContent = `
            <div class="film-details-modal">
                <div class="modal-header">
                    <h2>${film.title}</h2>
                    <button class="modal-close" onclick="window.HollywoodMogul.closeModal()">×</button>
                </div>
                <div class="modal-content">
                    <div class="film-info-grid">
                        <div class="info-item">
                            <span class="info-label">Genre:</span>
                            <span class="info-value">${film.genre}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Budget:</span>
                            <span class="info-value">${formatCurrency(film.budget || 0)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Phase:</span>
                            <span class="info-value">${formatPhase(film.phase)}</span>
                        </div>
                        ${film.quality ? `
                            <div class="info-item">
                                <span class="info-label">Quality:</span>
                                <span class="info-value">${film.quality}/100</span>
                            </div>
                        ` : ''}
                    </div>

                    ${film.distribution ? `
                        <div class="distribution-info">
                            <h4>Box Office Performance</h4>
                            <p>Total Gross: ${formatCurrency(film.distribution.boxOfficeResults?.totalGross || 0)}</p>
                            <p>Your Revenue: ${formatCurrency(film.distribution.boxOfficeResults?.totalStudioRevenue || 0)}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        if (window.HollywoodMogul && window.HollywoodMogul.showModal) {
            window.HollywoodMogul.showModal(modalContent);
        }
    }

    /**
     * Show event details modal
     */
    function showEventDetails(eventId) {
        // Implementation depends on event system
        console.log('Show event details for:', eventId);
    }

    /**
     * Change view (month/quarter/year)
     */
    function setView(view) {
        currentView = view;
        renderCalendar();
    }

    /**
     * Navigate timeline
     */
    function navigate(direction) {
        const increment = getNavigationIncrement(currentView);

        switch (direction) {
            case 'prev':
                currentStartDate = new Date(currentStartDate.setMonth(currentStartDate.getMonth() - increment));
                break;
            case 'next':
                currentStartDate = new Date(currentStartDate.setMonth(currentStartDate.getMonth() + increment));
                break;
            case 'today':
                const gameState = window.HollywoodMogul.getGameState();
                currentStartDate = new Date(gameState.currentDate);
                break;
        }

        renderCalendar();
    }

    // ========== HELPER FUNCTIONS ==========

    function getAllFilms(gameState) {
        const films = [];
        if (Array.isArray(gameState.films)) films.push(...gameState.films);
        if (Array.isArray(gameState.activeFilms)) films.push(...gameState.activeFilms);
        if (Array.isArray(gameState.completedFilms)) films.push(...gameState.completedFilms);

        const uniqueFilms = new Map();
        films.forEach(film => {
            if (film && film.id && !uniqueFilms.has(film.id)) {
                uniqueFilms.set(film.id, film);
            }
        });

        return Array.from(uniqueFilms.values());
    }

    function extractFilmTimelineData(film, gameState) {
        let startDate, endDate, type, subtitle;

        const phase = (film.phase || '').toLowerCase();
        const currentDate = new Date(gameState.currentDate);

        if (phase === 'in_theaters') {
            // Film in theaters
            if (film.distribution) {
                startDate = new Date(film.distribution.releaseDate);
                const weeksInTheaters = film.distribution.currentWeek || 1;
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + (weeksInTheaters * 7));

                type = 'theaters';
                subtitle = `Week ${weeksInTheaters} - ${film.distribution.strategy || 'wide'}`;
            }
        } else if (phase !== 'completed') {
            // Film in production
            startDate = film.productionStartDate ? new Date(film.productionStartDate) : currentDate;

            // Estimate end date based on phase
            endDate = estimateFilmEndDate(film, startDate);

            type = 'production';
            subtitle = formatPhase(phase);
        }

        if (!startDate || !endDate) return null;

        return {
            id: film.id,
            title: film.title,
            subtitle,
            startDate,
            endDate,
            type,
            genre: film.genre,
            budget: film.actualBudget || film.currentBudget || film.originalBudget,
            phase: film.phase,
            quality: film.quality || film.scriptQuality,
            distribution: film.distribution
        };
    }

    function extractEventTimelineData(event, type) {
        let date;

        if (event.date) {
            date = new Date(event.date);
        } else if (event.year && event.month) {
            date = new Date(event.year, event.month - 1, 1);
        } else {
            return null;
        }

        return {
            id: event.id || `event_${Date.now()}_${Math.random()}`,
            title: event.title || event.name,
            description: event.description,
            date,
            type,
            icon: getEventIcon(event, type)
        };
    }

    function generateAwardsDeadlines(gameState) {
        const events = [];
        const currentYear = new Date(gameState.currentDate).getFullYear();

        // Academy Awards (February each year)
        events.push({
            id: `oscars_${currentYear}`,
            title: 'Academy Awards',
            description: 'Annual Oscar ceremony',
            date: new Date(currentYear, 1, 15), // Feb 15
            type: 'awards',
            icon: '🏆'
        });

        return events;
    }

    function estimateFilmEndDate(film, startDate) {
        const phase = (film.phase || '').toLowerCase();
        const endDate = new Date(startDate);

        switch (phase) {
            case 'shooting':
            case 'principal_photography':
                const remainingDays = (film.shootingDays || 30) - (film.productionDay || 0);
                endDate.setDate(endDate.getDate() + remainingDays);
                break;
            case 'post_production':
            case 'post-production':
                endDate.setDate(endDate.getDate() + 28); // 4 weeks
                break;
            case 'pre_production':
            case 'pre-production':
                endDate.setDate(endDate.getDate() + 56); // 8 weeks
                break;
            default:
                endDate.setDate(endDate.getDate() + 84); // 12 weeks default
        }

        return endDate;
    }

    function getTimespan(startDate, view) {
        const start = new Date(startDate);
        const end = new Date(startDate);

        switch (view) {
            case 'month':
                start.setDate(1);
                end.setMonth(end.getMonth() + 1);
                end.setDate(0);
                break;
            case 'quarter':
                const quarterStart = Math.floor(start.getMonth() / 3) * 3;
                start.setMonth(quarterStart);
                start.setDate(1);
                end.setMonth(quarterStart + 3);
                end.setDate(0);
                break;
            case 'year':
                start.setMonth(0);
                start.setDate(1);
                end.setMonth(12);
                end.setDate(0);
                break;
        }

        return { start, end };
    }

    function generateTimeMarkers(timespan, view) {
        const markers = [];
        const { start, end } = timespan;
        const totalDays = (end - start) / (1000 * 60 * 60 * 24);

        if (view === 'month') {
            // Weekly markers
            const weeks = Math.ceil(totalDays / 7);
            for (let i = 0; i <= weeks; i++) {
                const date = new Date(start);
                date.setDate(date.getDate() + (i * 7));
                const position = ((date - start) / (end - start)) * 100;
                markers.push({
                    position,
                    label: `Week ${i + 1}`
                });
            }
        } else if (view === 'quarter') {
            // Monthly markers
            for (let i = 0; i < 3; i++) {
                const date = new Date(start);
                date.setMonth(date.getMonth() + i);
                const position = ((date - start) / (end - start)) * 100;
                markers.push({
                    position,
                    label: formatMonthShort(date)
                });
            }
        } else if (view === 'year') {
            // Monthly markers
            for (let i = 0; i < 12; i++) {
                const date = new Date(start);
                date.setMonth(i);
                const position = ((date - start) / (end - start)) * 100;
                markers.push({
                    position,
                    label: formatMonthShort(date)
                });
            }
        }

        return markers;
    }

    function calculatePosition(date, timespan, totalDays) {
        const { start, end } = timespan;
        const dateTime = new Date(date).getTime();
        const startTime = start.getTime();
        const endTime = end.getTime();

        if (dateTime < startTime) return 0;
        if (dateTime > endTime) return 100;

        return ((dateTime - startTime) / (endTime - startTime)) * 100;
    }

    function isInTimespan(date, timespan) {
        const dateTime = new Date(date).getTime();
        return dateTime >= timespan.start.getTime() && dateTime <= timespan.end.getTime();
    }

    function getNavigationIncrement(view) {
        switch (view) {
            case 'month': return 1;
            case 'quarter': return 3;
            case 'year': return 12;
            default: return 1;
        }
    }

    function formatPeriod(date, view) {
        const year = date.getFullYear();
        const month = date.getMonth();

        switch (view) {
            case 'month':
                return `${formatMonthLong(date)} ${year}`;
            case 'quarter':
                const quarter = Math.floor(month / 3) + 1;
                return `Q${quarter} ${year}`;
            case 'year':
                return `${year}`;
            default:
                return '';
        }
    }

    function formatMonthLong(date) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return months[date.getMonth()];
    }

    function formatMonthShort(date) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[date.getMonth()];
    }

    function formatDate(date) {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    }

    function formatPhase(phase) {
        const phases = {
            'greenlit': 'Greenlit',
            'pre_production': 'Pre-Production',
            'shooting': 'Shooting',
            'principal_photography': 'Shooting',
            'post_production': 'Post-Production',
            'post_production_complete': 'Ready for Release',
            'in_theaters': 'In Theaters',
            'completed': 'Completed'
        };
        return phases[phase?.toLowerCase()] || phase;
    }

    function formatCurrency(amount) {
        return `$${amount.toLocaleString()}`;
    }

    function getFilmStatusClass(type) {
        return type === 'theaters' ? 'status-theaters' : 'status-production';
    }

    function getEventIcon(event, type) {
        if (event.icon) return event.icon;

        switch (type) {
            case 'historical': return '📰';
            case 'awards': return '🏆';
            case 'milestone': return '⭐';
            default: return '📋';
        }
    }

    // Public API
    return {
        init,
        renderCalendar,
        setView,
        navigate,
        showFilmDetails,
        showEventDetails
    };
})();
