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
        updateFilmsInProduction();
        updateFilmsInTheaters();
        updateAlerts();
        updateTimeDisplay();
        updateEventsLog();
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
        const productionFilms = gameState.films.filter(f => 
            f.phase !== 'completed' && f.phase !== 'in_theaters'
        );
        
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
        const boxOfficeData = window.BoxOfficeSystem.getCurrentBoxOfficeData();
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
        
        return `
            <div class="film-card production-card">
                <div class="film-header">
                    <h4 class="film-title">${film.title}</h4>
                    <span class="film-budget">$${film.actualBudget.toLocaleString()}</span>
                </div>
                <div class="film-info">
                    <span class="genre-tag">${film.genre}</span>
                    <span class="phase-indicator ${statusColor}">${formatPhase(film.phase)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="film-details">
                    ${getFilmPhaseDetails(film)}
                </div>
                ${film.phase === 'post_production_complete' ? 
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
        const recentEvents = gameState.events.slice(-5).reverse();
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
        const film = gameState.films.find(f => f.id === filmId);
        
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
                        <p><strong>Budget:</strong> $${film.actualBudget.toLocaleString()}</p>
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
                `Film released with ${DISTRIBUTION_STRATEGIES[strategy]?.name || strategy}`;
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
        const currentIndex = phases.indexOf(film.phase);
        return (currentIndex + 1) / phases.length * 100;
    }

    function getProductionStatusColor(phase) {
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
        switch(film.phase) {
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
        const readyForDistribution = gameState.films.filter(f => f.phase === 'post_production_complete');
        if (readyForDistribution.length > 0) {
            alerts.push({
                title: 'Films Ready for Release',
                message: `${readyForDistribution.length} film(s) awaiting distribution decision`,
                severity: 'info'
            });
        }
        
        return alerts;
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
        return `${getMonthName(date.month)} ${date.year}`;
    }

    function getMonthName(monthNum) {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return months[monthNum - 1] || 'Unknown';
    }

    // Public API
    return {
        init: init,
        updateDashboard: updateDashboard,
        showSection: showSection,
        showNotification: showNotification
    };
})();