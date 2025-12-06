/**
 * HOLLYWOOD MOGUL - MAIN DASHBOARD UI SYSTEM
 * The nerve center of your studio empire
 */
window.DashboardUI = (function() {
    'use strict';

    let updateInterval;
    let isInitialized = false;

    /**
     * Initialize the dashboard system
     */
    function init() {
        if (isInitialized) return;
        
        updateDashboard();
        bindEventHandlers();
        
        // Update dashboard every few seconds
        updateInterval = setInterval(updateDashboard, 3000);
        isInitialized = true;
        
        console.log('Dashboard UI initialized');
    }

    /**
     * Bind all dashboard event handlers
     */
    function bindEventHandlers() {
        // Navigation buttons
        document.addEventListener('click', function(e) {
            if (e.target.matches('.nav-button')) {
                const section = e.target.dataset.section;
                showSection(section);
            }
            
            // Time progression buttons  
            if (e.target.matches('#advance-week')) {
                window.TimeSystem.advanceWeek();
                updateDashboard();
            }
            
            if (e.target.matches('#advance-month')) {
                window.TimeSystem.advanceMonth();
                updateDashboard();
            }

            // Script actions
            if (e.target.matches('.greenlight-btn')) {
                const scriptId = e.target.dataset.scriptId;
                greenlightScript(scriptId);
            }

            // Film actions
            if (e.target.matches('.distribute-btn')) {
                const filmId = e.target.dataset.filmId;
                showDistributionModal(filmId);
            }

            // Distribution strategy selection
            if (e.target.matches('.strategy-btn')) {
                const filmId = e.target.dataset.filmId;
                const strategy = e.target.dataset.strategy;
                executeDistribution(filmId, strategy);
            }

            // Loan actions
            if (e.target.matches('.loan-btn')) {
                const loanType = e.target.dataset.loanType;
                const amount = parseInt(e.target.dataset.amount);
                takeLoan(loanType, amount);
            }
        });

        // Modal close handlers
        document.addEventListener('click', function(e) {
            if (e.target.matches('.modal-close') || e.target.matches('.modal-overlay')) {
                closeAllModals();
            }
        });

        // ESC key closes modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAllModals();
            }
        });
    }

    /**
     * Update all dashboard components
     */
    function updateDashboard() {
        updateFinancialSummary();
        updateKPIHeroRow();
        updateNextBigDecision();
        updateFilmsInProduction();
        updateFilmsInTheaters();
        updateTalentSnapshot();
        updateAlertsAndEvents();
        updateAlerts();
        updateTimeDisplay();
        updateEventsLog();
        updateGenreHeat();

        // Update Chain D widgets if available
        if (window.ForecastWidget && window.ForecastWidget.updateForecastWidget) {
            window.ForecastWidget.updateForecastWidget();
        }
        if (window.AchievementShowcase && window.AchievementShowcase.updateShowcase) {
            window.AchievementShowcase.updateShowcase();
        }
    }

    /**
     * Update financial summary section
     */
    function updateFinancialSummary() {
        const gameState = window.HollywoodMogul.getGameState();
        const runway = window.HollywoodMogul.calculateRunwayWeeks();

        const cashElement = document.getElementById('current-cash');
        const burnElement = document.getElementById('monthly-burn');
        const runwayElement = document.getElementById('cash-runway');

        if (cashElement) {
            cashElement.textContent = `$${gameState.cash.toLocaleString()}`;
            cashElement.className = `cash-amount ${getCashStatusClass(gameState.cash, runway)}`;
        }

        if (burnElement) {
            burnElement.textContent = `-$${gameState.monthlyBurn.toLocaleString()}/mo`;
        }

        if (runwayElement) {
            const runwayWeeks = Math.floor(runway);
            runwayElement.textContent = `${runwayWeeks} weeks`;
            runwayElement.className = `runway-indicator ${getRunwayStatusClass(runwayWeeks)}`;
        }
    }

    /**
     * Update films in production section
     */
    function updateFilmsInProduction() {
        const gameState = window.HollywoodMogul.getGameState();
        const productionFilms = getAllFilms(gameState).filter(film => {
            const phase = normalizePhase(film.phase);
            return phase && phase !== 'completed' && phase !== 'in_theaters';
        });
        
        const container = document.getElementById('films-in-production');
        if (!container) return;
        
        if (productionFilms.length === 0) {
            container.innerHTML = '<div class="no-content">No films in production</div>';
            return;
        }
        
        container.innerHTML = productionFilms.map(film => createFilmProductionCard(film)).join('');
    }

    /**
     * Update films in theaters section
     */
    function updateFilmsInTheaters() {
        const boxOfficeData = window.BoxOfficeSystem && typeof window.BoxOfficeSystem.getCurrentBoxOfficeData === 'function'
            ? window.BoxOfficeSystem.getCurrentBoxOfficeData()
            : [];
        const container = document.getElementById('films-in-theaters');
        
        if (!container) return;
        
        const inTheatersFilms = boxOfficeData.filter(f => f.phase === 'in_theaters');
        
        if (inTheatersFilms.length === 0) {
            container.innerHTML = '<div class="no-content">No films currently in theaters</div>';
            return;
        }
        
        container.innerHTML = inTheatersFilms.map(film => createBoxOfficeCard(film)).join('');
    }

    /**
     * Create production film card HTML
     */
    function createFilmProductionCard(film) {
        const progressPercent = getProductionProgress(film);
        const statusColor = getProductionStatusColor(film.phase);
        const normalizedPhase = normalizePhase(film.phase);
        const budget = film.actualBudget ?? film.currentBudget ?? film.originalBudget ?? 0;

        return `
            <div class="film-card production-card">
                <div class="film-header">
                    <h4 class="film-title">${film.title}</h4>
                    <span class="film-budget">$${budget.toLocaleString()}</span>
                </div>
                <div class="film-info">
                    <span class="genre-tag">${film.genre}</span>
                    <span class="phase-indicator ${statusColor}">${formatPhase(normalizedPhase)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="film-details">
                    ${getFilmPhaseDetails(film)}
                </div>
                ${normalizedPhase === 'post_production_complete' ?
                    `<button class="distribute-btn cta-button" data-film-id="${film.id}">DISTRIBUTE</button>` : ''
                }
            </div>
        `;
    }

    /**
     * Create box office performance card
     */
    function createBoxOfficeCard(film) {
        const distribution = film.distribution;
        const currentWeek = distribution.currentWeek;
        const weekData = distribution.boxOfficeResults.weeks[currentWeek - 1];
        
        if (!weekData) return '';
        
        const totalGross = distribution.boxOfficeResults.weeks
            .slice(0, currentWeek)
            .reduce((sum, week) => sum + week.grossRevenue, 0);
            
        const totalStudioRevenue = distribution.boxOfficeResults.weeks
            .slice(0, currentWeek)
            .reduce((sum, week) => sum + week.studioRevenue, 0);
            
        return `
            <div class="film-card box-office-card">
                <div class="film-header">
                    <h4 class="film-title">${film.title}</h4>
                    <span class="week-indicator">Week ${currentWeek}</span>
                </div>
                <div class="box-office-stats">
                    <div class="stat-row">
                        <span class="stat-label">This Week:</span>
                        <span class="stat-value">${weekData.grossRevenue.toLocaleString()}</span>
                        ${weekData.dropoff > 0 ? `<span class="dropoff">↓${weekData.dropoff}%</span>` : ''}
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Total Gross:</span>
                        <span class="stat-value">$${totalGross.toLocaleString()}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Your Revenue:</span>
                        <span class="stat-value revenue">$${totalStudioRevenue.toLocaleString()}</span>
                    </div>
                </div>
                <div class="film-info">
                    <span class="strategy-tag">${formatDistributionStrategy(distribution.strategy)}</span>
                </div>
            </div>
        `;
    }

    /**
     * Show specific section of the game
     */
    function showSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.game-section');
        sections.forEach(section => section.style.display = 'none');
        
        // Show requested section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.style.display = 'block';
            
            // Update section content
            switch(sectionName) {
                case 'scripts':
                    updateScriptsSection();
                    break;
                case 'finances':
                    updateFinancesSection();
                    break;
                case 'studio':
                    updateStudioSection();
                    break;
            }
        }
        
        // Update navigation active state
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');
    }

    /**
     * Update scripts section
     */
    function updateScriptsSection() {
        const availableScripts = window.ScriptLibrary.getAvailableScripts();
        const container = document.getElementById('available-scripts');
        
        if (!container) return;
        
        container.innerHTML = availableScripts.map(script => createScriptCard(script)).join('');
    }

    /**
     * Create script selection card
     */
    function createScriptCard(script) {
        const gameState = window.HollywoodMogul.getGameState();
        const canAfford = gameState.cash >= script.budget;
        
        return `
            <div class="script-card ${!canAfford ? 'unaffordable' : ''}">
                <div class="script-header">
                    <h4 class="script-title">${script.title}</h4>
                    <span class="script-budget">$${script.budget.toLocaleString()}</span>
                </div>
                <div class="script-info">
                    <span class="genre-tag">${script.genre}</span>
                    <span class="quality-rating">Quality: ${script.quality}/100</span>
                </div>
                <div class="script-details">
                    <p class="script-logline">${script.logline}</p>
                    <div class="script-requirements">
                        <div class="req-item">
                            <span class="req-label">Shooting Schedule:</span>
                            <span class="req-value">${script.shootingDays} days</span>
                        </div>
                        <div class="req-item">
                            <span class="req-label">Censor Risk:</span>
                            <span class="risk-indicator ${script.censorRisk.toLowerCase()}">${script.censorRisk}</span>
                        </div>
                    </div>
                </div>
                <div class="script-projection">
                    <p class="projection-label">Projected Box Office:</p>
                    <p class="projection-range">$${script.boxOfficeProjection.min.toLocaleString()} - $${script.boxOfficeProjection.max.toLocaleString()}</p>
                </div>
                <button class="greenlight-btn ${canAfford ? 'cta-button' : 'disabled-button'}" 
                        data-script-id="${script.id}" 
                        ${!canAfford ? 'disabled' : ''}>
                    ${canAfford ? 'GREENLIGHT' : 'INSUFFICIENT FUNDS'}
                </button>
            </div>
        `;
    }

    /**
     * Update finances section
     */
    function updateFinancesSection() {
        const gameState = window.HollywoodMogul.getGameState();
        const runway = window.HollywoodMogul.calculateRunwayWeeks();
        const financial = {
            monthlyBurn: gameState.monthlyBurn,
            runway: runway
        };
        const container = document.getElementById('financial-details');

        if (!container) return;
        
        container.innerHTML = `
            <div class="financial-overview">
                <div class="financial-card">
                    <h4>Monthly Cash Flow</h4>
                    <div class="cash-flow-breakdown">
                        <div class="flow-item income">
                            <span class="flow-label">Box Office Revenue</span>
                            <span class="flow-value">+$${financial.monthlyRevenue.toLocaleString()}</span>
                        </div>
                        <div class="flow-item expense">
                            <span class="flow-label">Studio Operations</span>
                            <span class="flow-value">-$${financial.monthlyBurn.toLocaleString()}</span>
                        </div>
                        <div class="flow-item ${financial.netFlow >= 0 ? 'profit' : 'loss'}">
                            <span class="flow-label">Net Flow</span>
                            <span class="flow-value">${financial.netFlow >= 0 ? '+' : ''}$${financial.netFlow.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                ${createLoansSection(financial)}
                ${createRecentTransactionsSection()}
            </div>
        `;
    }

    /**
     * Create loans and credit section
     */
    function createLoansSection(financial) {
        const gameState = window.HollywoodMogul.getGameState();
        const availableLoans = window.FinancialSystem.getAvailableLoans();
        
        let loansHTML = '<div class="financial-card"><h4>Loans & Credit</h4>';
        
        if (gameState.loans && gameState.loans.length > 0) {
            loansHTML += '<div class="active-loans">';
            gameState.loans.forEach(loan => {
                loansHTML += `
                    <div class="loan-item">
                        <span class="loan-type">${loan.type === 'bank' ? 'Bank Loan' : 'Mob Loan'}</span>
                        <span class="loan-balance">$${loan.balance.toLocaleString()}</span>
                        <span class="loan-payment">$${loan.monthlyPayment.toLocaleString()}/mo</span>
                    </div>
                `;
            });
            loansHTML += '</div>';
        }
        
        if (availableLoans.length > 0) {
            loansHTML += '<div class="available-loans"><h5>Available Credit</h5>';
            availableLoans.forEach(loan => {
                loansHTML += `
                    <div class="loan-offer">
                        <div class="loan-details">
                            <span class="loan-name">${loan.name}</span>
                            <span class="loan-terms">${loan.terms}</span>
                        </div>
                        <button class="loan-btn cta-button" 
                                data-loan-type="${loan.type}" 
                                data-amount="${loan.maxAmount}">
                            Borrow $${loan.maxAmount.toLocaleString()}
                        </button>
                    </div>
                `;
            });
            loansHTML += '</div>';
        }
        
        return loansHTML + '</div>';
    }

    /**
     * Create recent transactions section
     */
    function createRecentTransactionsSection() {
        const transactions = window.FinancialSystem.getRecentTransactions(10);
        
        let html = '<div class="financial-card"><h4>Recent Transactions</h4>';
        
        if (transactions.length === 0) {
            html += '<div class="no-content">No recent transactions</div>';
        } else {
            html += '<div class="transactions-list">';
            transactions.forEach(transaction => {
                const amountClass = transaction.amount >= 0 ? 'income' : 'expense';
                const sign = transaction.amount >= 0 ? '+' : '';
                html += `
                    <div class="transaction-item">
                        <span class="transaction-desc">${transaction.description}</span>
                        <span class="transaction-amount ${amountClass}">${sign}$${transaction.amount.toLocaleString()}</span>
                        <span class="transaction-date">${formatDate(transaction.date)}</span>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        return html + '</div>';
    }

    /**
     * Update alerts section
     */
    function updateAlerts() {
        const gameState = window.HollywoodMogul.getGameState();
        const alerts = generateCurrentAlerts(gameState);
        const container = document.getElementById('alerts-section');
        
        if (!container) return;
        
        if (alerts.length === 0) {
            container.innerHTML = '<div class="no-alerts">All systems running smoothly</div>';
            return;
        }
        
        container.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.severity}">
                <div class="alert-content">
                    <h4 class="alert-title">${alert.title}</h4>
                    <p class="alert-message">${alert.message}</p>
                </div>
                ${alert.action ? `<button class="alert-action">${alert.action}</button>` : ''}
            </div>
        `).join('');
    }

    /**
     * Update time display
     */
    function updateTimeDisplay() {
        const currentDate = window.TimeSystem.getCurrentDate();
        const element = document.getElementById('current-date');
        
        if (element) {
            element.textContent = `${getMonthName(currentDate.month)} ${currentDate.year}`;
        }
        
        // Update era indicator
        const eraElement = document.getElementById('current-era');
        if (eraElement) {
            const era = window.TimeSystem.getCurrentPeriod();
            eraElement.textContent = era.name;
            eraElement.className = `era-indicator era-${era.key}`;
        }
    }

    /**
     * Update events log
     */
    function updateEventsLog() {
        const gameState = window.HollywoodMogul.getGameState();
        const eventLog = Array.isArray(gameState.events) ? gameState.events : [];
        const recentEvents = eventLog.slice(-5).reverse();
        const container = document.getElementById('events-log');

        if (!container) return;
        
        if (recentEvents.length === 0) {
            container.innerHTML = '<div class="no-content">No recent events</div>';
            return;
        }
        
        container.innerHTML = recentEvents.map(event => `
            <div class="event-item ${event.type}">
                <div class="event-icon">${getEventIcon(event.type)}</div>
                <div class="event-content">
                    <h4 class="event-title">${event.title}</h4>
                    <p class="event-message">${event.message}</p>
                    <span class="event-date">${formatDate(event.date)}</span>
                </div>
            </div>
        `).join('');
    }

    /**
     * Greenlight a script (start production)
     */
    function greenlightScript(scriptId) {
        const result = window.ProductionSystem.greenlightScript(scriptId);
        
        if (result.success) {
            updateDashboard();
            showSection('dashboard'); // Return to main view
            
            // Show success notification
            showNotification('Script Greenlit!', `Production begins on "${result.film.title}"`, 'success');
        } else {
            showNotification('Cannot Greenlight', result.message, 'error');
        }
    }

    /**
     * Show distribution modal for completed film
     */
    function showDistributionModal(filmId) {
        const gameState = window.HollywoodMogul.getGameState();
        const film = findFilmById(gameState, filmId);

        if (!film) return;

        const strategies = window.BoxOfficeSystem.getDistributionStrategies(film);
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal distribution-modal">
                <div class="modal-header">
                    <h3>Distribute "${film.title}"</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-content">
                    <div class="film-summary">
                        <p><strong>Budget:</strong> $${(film.actualBudget ?? film.currentBudget ?? film.originalBudget ?? 0).toLocaleString()}</p>
                        <p><strong>Genre:</strong> ${film.genre}</p>
                        <p><strong>Quality:</strong> ${film.scriptQuality}/100</p>
                    </div>
                    <div class="distribution-strategies">
                        ${Object.keys(strategies).map(key => createStrategyCard(key, strategies[key], filmId)).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Create distribution strategy card
     */
    function createStrategyCard(key, strategy, filmId) {
        const isAffordable = strategy.canAfford;
        
        return `
            <div class="strategy-card ${!isAffordable ? 'unaffordable' : ''}">
                <h4>${strategy.name}</h4>
                <p class="strategy-desc">${strategy.description}</p>
                <div class="strategy-stats">
                    ${strategy.marketingCost > 0 ? 
                        `<div class="stat">Marketing: $${strategy.marketingCost.toLocaleString()}</div>` : ''
                    }
                    ${strategy.guaranteedPayment ? 
                        `<div class="stat">Guaranteed: $${strategy.guaranteedPayment.toLocaleString()}</div>` :
                        `<div class="stat">Projected Gross: $${strategy.projectedGross.toLocaleString()}</div>`
                    }
                    <div class="stat profit ${strategy.projectedProfit >= 0 ? 'positive' : 'negative'}">
                        Expected ${strategy.projectedProfit >= 0 ? 'Profit' : 'Loss'}: $${Math.abs(strategy.projectedProfit).toLocaleString()}
                    </div>
                </div>
                <button class="strategy-btn ${isAffordable ? 'cta-button' : 'disabled-button'}" 
                        data-film-id="${filmId}" 
                        data-strategy="${key}"
                        ${!isAffordable ? 'disabled' : ''}>
                    ${isAffordable ? 'SELECT' : 'CANNOT AFFORD'}
                </button>
            </div>
        `;
    }

    /**
     * Execute distribution strategy
     */
    function executeDistribution(filmId, strategy) {
        const result = window.BoxOfficeSystem.releaseFilm(filmId, strategy);
        
        closeAllModals();
        
        if (result.success) {
            updateDashboard();
            const message = strategy === 'states_rights' ?
                `Rights sold for $${result.payment.toLocaleString()}` :
                `Film released with ${getStrategyName(strategy)}`;
            showNotification('Film Released!', message, 'success');
        } else {
            showNotification('Distribution Failed', result.message, 'error');
        }
    }

    /**
     * Take out a loan
     */
    function takeLoan(loanType, amount) {
        const result = window.FinancialSystem.takeLoan(loanType, amount);
        
        if (result.success) {
            updateDashboard();
            showNotification('Loan Approved', `Received $${amount.toLocaleString()}`, 'success');
        } else {
            showNotification('Loan Denied', result.message, 'error');
        }
    }

    /**
     * Close all modals
     */
    function closeAllModals() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => modal.remove());
    }

    /**
     * Show notification toast
     */
    function showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <h4 class="notification-title">${title}</h4>
                <p class="notification-message">${message}</p>
            </div>
            <button class="notification-close">×</button>
        `;
        
        // Add to page
        const container = document.getElementById('notifications') || document.body;
        container.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        // Manual close
        notification.querySelector('.notification-close').onclick = () => {
            notification.remove();
        };
    }

    // Helper functions
    function getCashStatusClass(cash, runway) {
        if (runway < 4) return 'critical';
        if (runway < 8) return 'warning';
        if (cash > 500000) return 'excellent';
        return 'normal';
    }

    function getRunwayStatusClass(weeks) {
        if (weeks < 4) return 'critical';
        if (weeks < 8) return 'warning'; 
        if (weeks > 20) return 'excellent';
        return 'normal';
    }

    function getProductionProgress(film) {
        const phases = ['greenlit', 'pre_production', 'shooting', 'post_production', 'post_production_complete'];
        const normalizedPhase = normalizePhase(film.phase);
        const currentIndex = phases.indexOf(normalizedPhase);
        return currentIndex >= 0 ? ((currentIndex + 1) / phases.length) * 100 : 0;
    }

    function getProductionStatusColor(phase) {
        phase = normalizePhase(phase);
        const colors = {
            'greenlit': 'phase-greenlit',
            'pre_production': 'phase-prep',
            'shooting': 'phase-shooting',
            'post_production': 'phase-post',
            'post_production_complete': 'phase-complete',
            'in_theaters': 'phase-theaters',
            'completed': 'phase-completed'
        };
        return colors[phase] || 'phase-unknown';
    }

    function formatPhase(phase) {
        phase = normalizePhase(phase);
        const formats = {
            'greenlit': 'Greenlit',
            'pre_production': 'Pre-Production',
            'shooting': 'Shooting',
            'post_production': 'Post-Production',
            'post_production_complete': 'Ready for Release',
            'in_theaters': 'In Theaters',
            'completed': 'Completed'
        };
        return formats[phase] || phase;
    }

    function getFilmPhaseDetails(film) {
        const phase = normalizePhase(film.phase);
        switch(phase) {
            case 'shooting':
                return `<div class="phase-details">Day ${film.productionDay || 1} of ${film.shootingDays}</div>`;
            case 'post_production':
                return `<div class="phase-details">Editing in progress...</div>`;
            case 'post_production_complete':
                return `<div class="phase-details">Ready for distribution</div>`;
            default:
                return '';
        }
    }

    function formatDistributionStrategy(strategy) {
        const names = {
            'wide': 'Wide Release',
            'limited': 'Limited',
            'states_rights': 'States Rights'
        };
        return names[strategy] || strategy;
    }

    function generateCurrentAlerts(gameState) {
        const alerts = [];
        const runway = window.HollywoodMogul.calculateRunwayWeeks();

        // Financial alerts
        if (runway < 4) {
            alerts.push({
                title: 'CRITICAL: Cash Crisis',
                message: `Only ${Math.floor(runway)} weeks of cash remaining!`,
                severity: 'critical'
            });
        } else if (runway < 8) {
            alerts.push({
                title: 'WARNING: Low Cash',
                message: `${Math.floor(runway)} weeks of runway remaining`,
                severity: 'warning'
            });
        }
        
        // Production alerts
        const readyForDistribution = getAllFilms(gameState).filter(f =>
            normalizePhase(f.phase) === 'post_production_complete'
        );
        if (readyForDistribution.length > 0) {
            alerts.push({
                title: 'Films Ready for Release',
                message: `${readyForDistribution.length} film(s) awaiting distribution decision`,
                severity: 'info'
            });
        }

        return alerts;
    }

    function getStrategyName(strategy) {
        const names = {
            wide: 'Wide Release',
            limited: 'Limited Release',
            states_rights: "States' Rights Sale"
        };
        return names[strategy] || strategy;
    }

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

    function getEventIcon(eventType) {
        const icons = {
            'financial': '💰',
            'production': '🎬', 
            'market': '📊',
            'historical': '📰',
            'crisis': '⚠️'
        };
        return icons[eventType] || '📋';
    }

    function formatDate(date) {
        if (!date) return '—';

        if (date instanceof Date) {
            return `${getMonthName(date.getMonth() + 1)} ${date.getFullYear()}`;
        }

        if (typeof date === 'object' && typeof date.month === 'number' && typeof date.year === 'number') {
            return `${getMonthName(date.month)} ${date.year}`;
        }

        return String(date);
    }

    function getMonthName(monthNum) {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return months[(monthNum || 0) - 1] || months[monthNum] || 'Unknown';
    }

    // ========== CHAIN D FEATURE #15: DASHBOARD REDESIGN ==========

    /**
     * Update KPI Hero Row - Top 4 key metrics
     * Implementation of UI-REDESIGN-SPEC.md KPI Hero Row
     */
    function updateKPIHeroRow() {
        const gameState = window.HollywoodMogul.getGameState();
        const runway = window.HollywoodMogul.calculateRunwayWeeks();

        const container = document.getElementById('kpi-hero-row');
        if (!container) return;

        const kpis = [
            {
                label: 'CASH ON HAND',
                value: `$${gameState.cash.toLocaleString()}`,
                trend: calculateCashTrend(gameState),
                status: getCashStatusClass(gameState.cash, runway)
            },
            {
                label: 'MONTHLY BURN',
                value: `-$${gameState.monthlyBurn.toLocaleString()}`,
                trend: '─ steady',
                status: 'normal'
            },
            {
                label: 'RUNWAY',
                value: `${Math.floor(runway)} weeks`,
                trend: calculateRunwayTrend(gameState),
                status: getRunwayStatusClass(Math.floor(runway))
            },
            {
                label: 'REPUTATION',
                value: `${Math.floor(gameState.reputation)}/100`,
                trend: calculateReputationTrend(gameState),
                status: gameState.reputation >= 70 ? 'excellent' : 'normal'
            }
        ];

        container.innerHTML = kpis.map(kpi => `
            <div class="kpi-card ${kpi.status}">
                <div class="kpi-label">${kpi.label}</div>
                <div class="kpi-value">${kpi.value}</div>
                <div class="kpi-trend">${kpi.trend}</div>
            </div>
        `).join('');
    }

    /**
     * Update Next Big Decision Card - Primary CTA
     */
    function updateNextBigDecision() {
        const gameState = window.HollywoodMogul.getGameState();
        const container = document.getElementById('next-big-decision');
        if (!container) return;

        const decision = determineNextBigDecision(gameState);

        container.innerHTML = `
            <div class="decision-card">
                <h3 class="decision-title">NEXT BIG DECISION</h3>
                <div class="decision-content">
                    <div class="decision-icon">${decision.icon}</div>
                    <div class="decision-details">
                        <h4 class="decision-name">${decision.title}</h4>
                        <p class="decision-description">${decision.description}</p>
                    </div>
                </div>
                <button class="decision-cta primary-btn" onclick="${decision.action}">
                    ${decision.cta}
                </button>
            </div>
        `;
    }

    /**
     * Update Talent Snapshot - 4 talent thumbnails
     */
    function updateTalentSnapshot() {
        const container = document.getElementById('talent-snapshot');
        if (!container) return;

        // Get top 4 talent (placeholder - would integrate with talent system)
        const talents = getTopTalent(4);

        if (talents.length === 0) {
            container.innerHTML = `
                <div class="talent-snapshot-card">
                    <h3>TALENT SNAPSHOT</h3>
                    <div class="no-talent">No talent currently under contract</div>
                    <button class="view-all-btn" onclick="DashboardUI.showSection('talent')">
                        VIEW ALL TALENT
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="talent-snapshot-card">
                <h3>TALENT SNAPSHOT</h3>
                <div class="talent-thumbnails">
                    ${talents.map(talent => `
                        <div class="talent-thumb" title="${talent.name}">
                            <div class="talent-avatar">${talent.icon}</div>
                            <div class="talent-name">${talent.shortName}</div>
                        </div>
                    `).join('')}
                    ${talents.length > 4 ? `
                        <div class="talent-thumb more-talent">
                            <div class="talent-avatar">+${talents.length - 4}</div>
                            <div class="talent-name">MORE</div>
                        </div>
                    ` : ''}
                </div>
                <button class="view-all-btn" onclick="DashboardUI.showSection('talent')">
                    VIEW ALL TALENT
                </button>
            </div>
        `;
    }

    /**
     * Update Alerts & Events Feed - Combined view
     */
    function updateAlertsAndEvents() {
        const container = document.getElementById('alerts-events-feed');
        if (!container) return;

        const gameState = window.HollywoodMogul.getGameState();
        const alerts = generateCurrentAlerts(gameState).slice(0, 3);
        const events = (gameState.events || []).slice(-2);

        const items = [
            ...alerts.map(alert => ({
                type: 'alert',
                icon: getAlertIcon(alert.severity),
                text: alert.message,
                class: alert.severity
            })),
            ...events.map(event => ({
                type: 'event',
                icon: event.icon || '📋',
                text: event.message || event.title,
                class: 'event'
            }))
        ].slice(0, 5);

        container.innerHTML = `
            <div class="alerts-events-card">
                <h3>ALERTS & EVENTS</h3>
                <div class="feed-items">
                    ${items.length > 0 ?
                        items.map(item => `
                            <div class="feed-item ${item.class}">
                                <span class="feed-icon">${item.icon}</span>
                                <span class="feed-text">${item.text}</span>
                            </div>
                        `).join('') :
                        '<div class="no-items">All quiet on the lot</div>'
                    }
                </div>
                <button class="view-all-btn" onclick="DashboardUI.showAlertsModal()">
                    VIEW ALL ALERTS
                </button>
            </div>
        `;
    }

    /**
     * Show all alerts modal
     */
    function showAlertsModal() {
        const gameState = window.HollywoodMogul.getGameState();
        const alerts = generateCurrentAlerts(gameState);

        const modalContent = `
            <div class="alerts-modal">
                <div class="modal-header">
                    <h2>All Alerts</h2>
                    <button class="modal-close" onclick="window.HollywoodMogul.closeModal()">×</button>
                </div>
                <div class="modal-content">
                    ${alerts.length > 0 ?
                        alerts.map(alert => `
                            <div class="alert-item-full ${alert.severity}">
                                <h4>${alert.title}</h4>
                                <p>${alert.message}</p>
                            </div>
                        `).join('') :
                        '<p>No alerts at this time</p>'
                    }
                </div>
            </div>
        `;

        if (window.HollywoodMogul && window.HollywoodMogul.showModal) {
            window.HollywoodMogul.showModal(modalContent);
        }
    }

    // ========== HELPER FUNCTIONS FOR DASHBOARD REDESIGN ==========

    function calculateCashTrend(gameState) {
        // Placeholder - would calculate based on history
        const change = 5000;
        return change >= 0 ? `▲ +$${change.toLocaleString()}` : `▼ -$${Math.abs(change).toLocaleString()}`;
    }

    function calculateRunwayTrend(gameState) {
        // Placeholder - would calculate based on history
        return '▼ -2 wks';
    }

    function calculateReputationTrend(gameState) {
        // Placeholder - would calculate based on history
        const change = 5;
        return change >= 0 ? `▲ +${change}` : `▼ ${change}`;
    }

    function determineNextBigDecision(gameState) {
        // Priority order: 1. Films ready to distribute, 2. Low cash, 3. New scripts
        const filmsReady = getAllFilms(gameState).filter(f =>
            normalizePhase(f.phase) === 'post_production_complete'
        );

        if (filmsReady.length > 0) {
            return {
                icon: '🎬',
                title: 'Film Ready for Distribution',
                description: `"${filmsReady[0].title}" is complete and awaiting distribution decision`,
                cta: 'DISTRIBUTE NOW',
                action: `DashboardUI.showDistributionModal('${filmsReady[0].id}')`
            };
        }

        const runway = window.HollywoodMogul.calculateRunwayWeeks();
        if (runway < 8) {
            return {
                icon: '💰',
                title: 'Low Cash Warning',
                description: `Only ${Math.floor(runway)} weeks of cash remaining. Consider securing financing.`,
                cta: 'VIEW LOAN OPTIONS',
                action: 'window.FinancialSystem.showLoanOptions(window.HollywoodMogul.getGameState())'
            };
        }

        const activeProductions = getAllFilms(gameState).filter(f => {
            const phase = normalizePhase(f.phase);
            return phase && phase !== 'completed' && phase !== 'in_theaters';
        });

        if (activeProductions.length === 0) {
            return {
                icon: '📜',
                title: 'No Films in Production',
                description: 'Your studio is idle. Review scripts and greenlight your next project.',
                cta: 'REVIEW SCRIPTS',
                action: 'DashboardUI.showSection("scripts")'
            };
        }

        return {
            icon: '📅',
            title: 'Continue Production',
            description: `${activeProductions.length} film(s) in production. Everything on schedule.`,
            cta: 'ADVANCE TIME',
            action: 'window.TimeSystem.advanceWeek(); DashboardUI.updateDashboard();'
        };
    }

    function getTopTalent(count) {
        // Placeholder - would integrate with talent system when available
        return [
            { name: 'Clark Gable', shortName: 'Gable', icon: '👤' },
            { name: 'Bette Davis', shortName: 'Davis', icon: '👤' },
            { name: 'Humphrey Bogart', shortName: 'Bogart', icon: '👤' },
            { name: 'Joan Crawford', shortName: 'Crawford', icon: '👤' }
        ].slice(0, count);
    }

    function getAlertIcon(severity) {
        const icons = {
            'critical': '🚨',
            'warning': '⚠️',
            'info': '📋',
            'success': '✓'
        };
        return icons[severity] || '📋';
    }

    // Add to public API for new functions
    function showDistributionModal(filmId) {
        // Call existing implementation
        const gameState = window.HollywoodMogul.getGameState();
        const film = findFilmById(gameState, filmId);

        if (!film) return;

        const strategies = window.BoxOfficeSystem.getDistributionStrategies(film);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal distribution-modal">
                <div class="modal-header">
                    <h3>Distribute "${film.title}"</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-content">
                    <div class="film-summary">
                        <p><strong>Budget:</strong> $${(film.actualBudget ?? film.currentBudget ?? film.originalBudget ?? 0).toLocaleString()}</p>
                        <p><strong>Genre:</strong> ${film.genre}</p>
                        <p><strong>Quality:</strong> ${film.scriptQuality}/100</p>
                    </div>
                    <div class="distribution-strategies">
                        ${Object.keys(strategies).map(key => createStrategyCard(key, strategies[key], filmId)).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Update genre heat display
     */
    function updateGenreHeat() {
        const container = document.getElementById('genre-heat-display');
        if (!container) return;

        const gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        if (!gameState) return;

        const currentYear = gameState.currentDate?.year || gameState.gameYear || 1933;
        const genreHeatData = getGenreHeatForYear(currentYear);
        const previousYear = currentYear - 1;
        const previousHeatData = getGenreHeatForYear(previousYear);

        container.innerHTML = `
            <div class="market-trends-panel">
                <h3 class="panel-subtitle">Market Trends - ${currentYear}</h3>
                <div class="genre-heat-grid">
                    ${Object.keys(genreHeatData)
                        .sort((a, b) => genreHeatData[b] - genreHeatData[a])
                        .map(genre => createGenreHeatCard(genre, genreHeatData[genre], previousHeatData[genre]))
                        .join('')}
                </div>
            </div>
        `;
    }

    /**
     * Get genre heat data for a specific year
     */
    function getGenreHeatForYear(year) {
        // Historical genre heat data
        const historicalGenreHeat = {
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
            1949: { western: 1.2, crime: 1.0, musical: 1.0, drama: 1.0, comedy: 1.1, horror: 1.0, romance: 1.0, noir: 1.3, war: 0.3 }
        };

        return historicalGenreHeat[year] || historicalGenreHeat[1949];
    }

    /**
     * Create genre heat card with visual indicator
     */
    function createGenreHeatCard(genre, currentHeat, previousHeat = 1.0) {
        const heatLevel = getHeatLevel(currentHeat);
        const trend = getTrend(currentHeat, previousHeat);
        const heatBar = Math.round(currentHeat * 10);
        const explanation = getGenreExplanation(genre, currentHeat, trend.direction);

        return `
            <div class="genre-heat-card ${heatLevel.class}" title="${explanation}">
                <div class="genre-header">
                    <span class="genre-name">${capitalizeGenre(genre)}</span>
                    <span class="trend-arrow ${trend.class}">${trend.arrow}</span>
                </div>
                <div class="heat-bar-container">
                    <div class="heat-bar" style="width: ${Math.min(heatBar * 10, 100)}%">
                        <span class="heat-value">${heatBar}/10</span>
                    </div>
                </div>
                <div class="heat-label ${heatLevel.class}">${heatLevel.label}</div>
            </div>
        `;
    }

    /**
     * Determine heat level and styling
     */
    function getHeatLevel(heat) {
        if (heat >= 1.3) {
            return { label: 'HOT', class: 'heat-hot' };
        } else if (heat >= 1.0) {
            return { label: 'WARM', class: 'heat-warm' };
        } else if (heat >= 0.7) {
            return { label: 'COOL', class: 'heat-cool' };
        } else {
            return { label: 'COLD', class: 'heat-cold' };
        }
    }

    /**
     * Determine trend direction
     */
    function getTrend(currentHeat, previousHeat) {
        const diff = currentHeat - previousHeat;

        if (diff > 0.1) {
            return { arrow: '↑', class: 'trend-up', direction: 'rising' };
        } else if (diff < -0.1) {
            return { arrow: '↓', class: 'trend-down', direction: 'falling' };
        } else {
            return { arrow: '→', class: 'trend-stable', direction: 'stable' };
        }
    }

    /**
     * Get explanation for genre heat
     */
    function getGenreExplanation(genre, heat, trend) {
        const explanations = {
            war: {
                rising: 'War films gaining popularity as America mobilizes',
                falling: 'Postwar audiences tire of combat stories',
                stable: 'War films maintain steady appeal'
            },
            musical: {
                rising: 'Audiences seek escapist entertainment',
                falling: 'Darker times favor more serious fare',
                stable: 'Musicals remain a reliable crowd-pleaser'
            },
            noir: {
                rising: 'Postwar cynicism fuels noir popularity',
                falling: 'Market shifting away from dark themes',
                stable: 'Film noir holds steady appeal'
            },
            crime: {
                rising: 'Crime dramas gaining audience interest',
                falling: 'Code enforcement limiting crime content',
                stable: 'Crime films maintain steady following'
            },
            western: {
                rising: 'Western genre experiencing resurgence',
                falling: 'Westerns declining due to war focus',
                stable: 'Westerns remain American favorite'
            },
            horror: {
                rising: 'Horror making a comeback',
                falling: 'Wartime mood not suitable for horror',
                stable: 'Horror maintains niche appeal'
            },
            comedy: {
                rising: 'Comedy hot as audiences need laughs',
                falling: 'Comedy cooling in favor of drama',
                stable: 'Comedy remains dependable choice'
            },
            drama: {
                rising: 'Prestige dramas in high demand',
                falling: 'Drama giving way to lighter fare',
                stable: 'Drama maintains strong position'
            },
            romance: {
                rising: 'Romance surging in popularity',
                falling: 'Romance declining in current climate',
                stable: 'Romance holds steady appeal'
            }
        };

        const genreExplanations = explanations[genre] || {
            rising: `${capitalizeGenre(genre)} films gaining popularity`,
            falling: `${capitalizeGenre(genre)} films declining`,
            stable: `${capitalizeGenre(genre)} films holding steady`
        };

        return genreExplanations[trend] || genreExplanations.stable;
    }

    /**
     * Capitalize genre name
     */
    function capitalizeGenre(genre) {
        if (genre === 'noir') return 'Film Noir';
        return genre.charAt(0).toUpperCase() + genre.slice(1);
    }

    // Public API
    return {
        init: init,
        updateDashboard: updateDashboard,
        showSection: showSection,
        showNotification: showNotification,
        showDistributionModal: showDistributionModal,
        showAlertsModal: showAlertsModal
    };
})();