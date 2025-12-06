/**
 * HOLLYWOOD MOGUL - FINANCIAL FORECAST WIDGET
 * Look into the future: Will you survive the next 12 weeks?
 * Chain D Feature #13 - FEEDBACK & CLARITY
 */

window.ForecastWidget = (function() {
    'use strict';

    /**
     * Calculate financial forecast for next N weeks
     * @param {number} weeks - Number of weeks to project
     * @returns {Object} Forecast data with weekly projections
     */
    function calculateForecast(weeks = 12) {
        const gameState = window.HollywoodMogul.getGameState();

        const forecast = {
            weeks: [],
            currentCash: gameState.cash,
            projectedMinimum: gameState.cash,
            dangerZoneWeek: null,
            bankruptcyWeek: null,
            warnings: []
        };

        let projectedCash = gameState.cash;
        const weeklyBurn = gameState.monthlyBurn / 4; // Convert monthly to weekly

        // Get all active films and their expected revenues
        const activeFilms = getAllActiveFilms(gameState);
        const filmsInTheaters = getFilmsInTheaters(gameState);

        // Calculate weekly loan payments
        const weeklyLoanPayment = calculateWeeklyLoanPayments(gameState);

        for (let week = 1; week <= weeks; week++) {
            // Base weekly burn
            let weekRevenue = 0;
            let weekExpenses = weeklyBurn + weeklyLoanPayment;

            // Add box office revenue from films in theaters
            filmsInTheaters.forEach(film => {
                const weeksSinceRelease = (film.distribution?.currentWeek || 0) + week - 1;
                if (weeksSinceRelease <= 12) { // Films typically run 12 weeks
                    const estimatedRevenue = estimateWeeklyBoxOffice(film, weeksSinceRelease);
                    weekRevenue += estimatedRevenue;
                }
            });

            // Check for films completing production (potential distribution costs)
            activeFilms.forEach(film => {
                const weeksUntilComplete = estimateWeeksToCompletion(film);
                if (weeksUntilComplete === week) {
                    // Film completing - needs marketing/distribution budget
                    const distributionCost = estimateDistributionCost(film);
                    weekExpenses += distributionCost;
                }
            });

            // Update projected cash
            projectedCash += weekRevenue - weekExpenses;

            // Track minimum
            if (projectedCash < forecast.projectedMinimum) {
                forecast.projectedMinimum = projectedCash;
            }

            // Check for danger zone (under $10k)
            if (!forecast.dangerZoneWeek && projectedCash < 10000) {
                forecast.dangerZoneWeek = week;
            }

            // Check for bankruptcy ($0)
            if (!forecast.bankruptcyWeek && projectedCash <= 0) {
                forecast.bankruptcyWeek = week;
            }

            forecast.weeks.push({
                week: week,
                projectedCash: Math.floor(projectedCash),
                revenue: Math.floor(weekRevenue),
                expenses: Math.floor(weekExpenses),
                netFlow: Math.floor(weekRevenue - weekExpenses)
            });
        }

        // Generate warnings
        forecast.warnings = generateWarnings(forecast);

        return forecast;
    }

    /**
     * Render forecast widget to DOM
     */
    function renderForecastWidget(containerId = 'forecast-widget') {
        const forecast = calculateForecast(12);
        const container = document.getElementById(containerId);

        if (!container) {
            console.error('Forecast widget container not found:', containerId);
            return;
        }

        container.innerHTML = `
            <div class="forecast-widget">
                <div class="forecast-header">
                    <h3 class="forecast-title">FINANCIAL FORECAST</h3>
                    <span class="forecast-subtitle">Next 12 Weeks Projection</span>
                </div>

                <div class="forecast-summary">
                    <div class="forecast-stat">
                        <span class="stat-label">Current Cash</span>
                        <span class="stat-value current">${formatCurrency(forecast.currentCash)}</span>
                    </div>
                    <div class="forecast-stat">
                        <span class="stat-label">Projected Minimum</span>
                        <span class="stat-value ${getMinimumClass(forecast.projectedMinimum)}">${formatCurrency(forecast.projectedMinimum)}</span>
                    </div>
                    ${forecast.dangerZoneWeek ? `
                        <div class="forecast-stat danger">
                            <span class="stat-label">⚠️ Danger Zone</span>
                            <span class="stat-value">Week ${forecast.dangerZoneWeek}</span>
                        </div>
                    ` : ''}
                </div>

                ${renderForecastChart(forecast)}

                ${forecast.warnings.length > 0 ? `
                    <div class="forecast-warnings">
                        ${forecast.warnings.map(warning => `
                            <div class="forecast-warning ${warning.severity}">
                                <span class="warning-icon">${warning.icon}</span>
                                <span class="warning-text">${warning.message}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="forecast-footer">
                    <button class="forecast-details-btn" onclick="ForecastWidget.showDetailedForecast()">
                        View Detailed Breakdown
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Render forecast chart as ASCII-style bars
     */
    function renderForecastChart(forecast) {
        const maxCash = Math.max(...forecast.weeks.map(w => w.projectedCash), forecast.currentCash);
        const minCash = Math.min(...forecast.weeks.map(w => w.projectedCash), 0);
        const range = maxCash - minCash;

        return `
            <div class="forecast-chart">
                <div class="chart-title">Cash Flow Projection</div>
                <div class="chart-bars">
                    ${forecast.weeks.map((week, index) => {
                        const height = ((week.projectedCash - minCash) / range) * 100;
                        const barClass = getBarClass(week.projectedCash);

                        return `
                            <div class="chart-bar-container" title="Week ${week.week}: ${formatCurrency(week.projectedCash)}">
                                <div class="chart-bar ${barClass}" style="height: ${height}%">
                                    <span class="bar-value">${formatCurrencyShort(week.projectedCash)}</span>
                                </div>
                                <div class="chart-label">W${week.week}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="chart-legend">
                    <div class="legend-item">
                        <span class="legend-color safe"></span>
                        <span>Safe (>$50k)</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color warning"></span>
                        <span>Warning ($10k-$50k)</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color danger"></span>
                        <span>Danger (<$10k)</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Show detailed forecast modal
     */
    function showDetailedForecast() {
        const forecast = calculateForecast(12);

        const modalContent = `
            <div class="forecast-modal">
                <div class="modal-header">
                    <h2>Detailed Financial Forecast</h2>
                    <button class="modal-close" onclick="window.HollywoodMogul.closeModal()">×</button>
                </div>

                <div class="modal-content">
                    <div class="forecast-table-wrapper">
                        <table class="forecast-table">
                            <thead>
                                <tr>
                                    <th>Week</th>
                                    <th>Revenue</th>
                                    <th>Expenses</th>
                                    <th>Net Flow</th>
                                    <th>Projected Cash</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${forecast.weeks.map(week => `
                                    <tr class="${week.projectedCash < 10000 ? 'danger-row' : ''}">
                                        <td>Week ${week.week}</td>
                                        <td class="revenue">+${formatCurrency(week.revenue)}</td>
                                        <td class="expense">-${formatCurrency(week.expenses)}</td>
                                        <td class="${week.netFlow >= 0 ? 'positive' : 'negative'}">
                                            ${week.netFlow >= 0 ? '+' : ''}${formatCurrency(week.netFlow)}
                                        </td>
                                        <td class="cash ${getMinimumClass(week.projectedCash)}">
                                            ${formatCurrency(week.projectedCash)}
                                        </td>
                                        <td>${getStatusIndicator(week.projectedCash)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="forecast-summary-details">
                        <h3>Summary</h3>
                        <p><strong>Current Cash:</strong> ${formatCurrency(forecast.currentCash)}</p>
                        <p><strong>Projected Minimum:</strong> ${formatCurrency(forecast.projectedMinimum)}</p>
                        ${forecast.bankruptcyWeek ? `
                            <p class="danger"><strong>⚠️ Bankruptcy Risk:</strong> Week ${forecast.bankruptcyWeek}</p>
                        ` : forecast.dangerZoneWeek ? `
                            <p class="warning"><strong>⚠️ Danger Zone:</strong> Week ${forecast.dangerZoneWeek}</p>
                        ` : `
                            <p class="safe"><strong>✓ Financial Outlook:</strong> Stable</p>
                        `}
                    </div>

                    <div class="forecast-assumptions">
                        <h4>Assumptions</h4>
                        <ul>
                            <li>Weekly expenses include studio operations and loan payments</li>
                            <li>Box office projections based on current films in theaters</li>
                            <li>Distribution costs estimated for films completing production</li>
                            <li>Does not account for new film greenlights or unexpected events</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        if (window.HollywoodMogul && window.HollywoodMogul.showModal) {
            window.HollywoodMogul.showModal(modalContent);
        }
    }

    /**
     * Update forecast widget (called weekly)
     */
    function updateForecastWidget() {
        renderForecastWidget();
    }

    // ========== HELPER FUNCTIONS ==========

    function getAllActiveFilms(gameState) {
        const films = [];
        if (Array.isArray(gameState.films)) films.push(...gameState.films);
        if (Array.isArray(gameState.activeFilms)) films.push(...gameState.activeFilms);

        return films.filter(f => {
            const phase = (f.phase || '').toLowerCase();
            return phase !== 'completed' && phase !== 'in_theaters';
        });
    }

    function getFilmsInTheaters(gameState) {
        const boxOfficeData = window.BoxOfficeSystem?.getCurrentBoxOfficeData?.() || [];
        return boxOfficeData.filter(f => f.phase === 'in_theaters');
    }

    function calculateWeeklyLoanPayments(gameState) {
        if (!gameState.finances || !gameState.finances.loans) return 0;

        const monthlyTotal = gameState.finances.loans.reduce((total, loan) => {
            return total + (loan.monthlyInterest || 0) + (loan.monthlyPrincipal || 0);
        }, 0);

        return monthlyTotal / 4; // Convert to weekly
    }

    function estimateWeeklyBoxOffice(film, weekNumber) {
        if (!film.distribution || !film.distribution.boxOfficeResults) return 0;

        // Use actual data if available, otherwise estimate
        const weekData = film.distribution.boxOfficeResults.weeks[weekNumber - 1];
        if (weekData) {
            return weekData.studioRevenue || 0;
        }

        // Estimate with dropoff
        const openingWeek = film.distribution.boxOfficeResults.weeks[0];
        if (!openingWeek) return 0;

        const dropoffRate = 0.35; // 35% weekly dropoff
        const estimatedGross = openingWeek.grossRevenue * Math.pow(1 - dropoffRate, weekNumber - 1);
        const studioShare = film.distribution.strategy === 'wide' ? 0.5 : 0.6;

        return estimatedGross * studioShare;
    }

    function estimateWeeksToCompletion(film) {
        const phase = (film.phase || '').toLowerCase();

        if (phase === 'shooting') {
            const daysRemaining = (film.shootingDays || 30) - (film.productionDay || 0);
            return Math.ceil(daysRemaining / 7);
        }

        if (phase === 'post_production' || phase === 'post-production') {
            return 4; // Estimate 4 weeks for post
        }

        if (phase === 'pre_production' || phase === 'pre-production') {
            return 8; // Estimate 2 weeks prep + 4 weeks shooting + 2 weeks post
        }

        return 12; // Default estimate
    }

    function estimateDistributionCost(film) {
        const budget = film.actualBudget || film.currentBudget || film.originalBudget || 50000;

        // Marketing typically 30-50% of budget for wide release
        return Math.floor(budget * 0.4);
    }

    function generateWarnings(forecast) {
        const warnings = [];

        if (forecast.bankruptcyWeek && forecast.bankruptcyWeek <= 12) {
            warnings.push({
                severity: 'critical',
                icon: '🚨',
                message: `CRITICAL: Projected to hit $0 in Week ${forecast.bankruptcyWeek}! Take immediate action.`
            });
        } else if (forecast.dangerZoneWeek && forecast.dangerZoneWeek <= 12) {
            warnings.push({
                severity: 'warning',
                icon: '⚠️',
                message: `Warning: Cash will drop below $10,000 in Week ${forecast.dangerZoneWeek}. Consider delaying expenses or securing financing.`
            });
        }

        if (forecast.projectedMinimum < 25000 && !forecast.bankruptcyWeek) {
            warnings.push({
                severity: 'warning',
                icon: '💰',
                message: `Low cash projected. Minimum balance: ${formatCurrency(forecast.projectedMinimum)}. Consider taking a loan or selling distribution rights.`
            });
        }

        const gameState = window.HollywoodMogul.getGameState();
        const filmsReadyForDistribution = getAllActiveFilms(gameState).filter(f =>
            (f.phase || '').toLowerCase() === 'post_production_complete'
        );

        if (filmsReadyForDistribution.length > 0 && forecast.currentCash < 50000) {
            warnings.push({
                severity: 'info',
                icon: '🎬',
                message: `${filmsReadyForDistribution.length} film(s) ready for distribution. Ensure you have cash for marketing costs.`
            });
        }

        return warnings;
    }

    function formatCurrency(amount) {
        if (amount < 0) {
            return `-$${Math.abs(amount).toLocaleString()}`;
        }
        return `$${amount.toLocaleString()}`;
    }

    function formatCurrencyShort(amount) {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        }
        if (amount >= 1000) {
            return `$${Math.floor(amount / 1000)}k`;
        }
        return `$${amount}`;
    }

    function getMinimumClass(cash) {
        if (cash <= 0) return 'critical';
        if (cash < 10000) return 'danger';
        if (cash < 50000) return 'warning';
        return 'safe';
    }

    function getBarClass(cash) {
        if (cash < 10000) return 'danger';
        if (cash < 50000) return 'warning';
        return 'safe';
    }

    function getStatusIndicator(cash) {
        if (cash <= 0) return '🚨 Critical';
        if (cash < 10000) return '⚠️ Danger';
        if (cash < 50000) return '⚡ Warning';
        return '✓ Safe';
    }

    // Public API
    return {
        calculateForecast,
        renderForecastWidget,
        showDetailedForecast,
        updateForecastWidget
    };
})();
