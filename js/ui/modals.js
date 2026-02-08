/**
 * HOLLYWOOD MOGUL - MODAL SYSTEMS
 * Interactive dialogs and decision points
 */
window.ModalSystem = (function() {
    'use strict';

    /**
     * Show production event modal with choices
     */
    function showProductionEventModal(film, event) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal event-modal">
                <div class="modal-header">
                    <h3>Production Crisis: "${film.title}"</h3>
                    <div class="crisis-severity ${event.severity}">${event.severity.toUpperCase()}</div>
                </div>
                <div class="modal-content">
                    <div class="event-description">
                        <p class="event-text">${event.description}</p>
                        ${event.context ? `<p class="event-context">${event.context}</p>` : ''}
                    </div>
                    <div class="current-situation">
                        <div class="situation-stat">
                            <span class="stat-label">Current Budget:</span>
                            <span class="stat-value">$${film.actualBudget.toLocaleString()}</span>
                        </div>
                        <div class="situation-stat">
                            <span class="stat-label">Days Remaining:</span>
                            <span class="stat-value">${film.shootingDays - (film.productionDay || 0)}</span>
                        </div>
                        <div class="situation-stat">
                            <span class="stat-label">Quality Status:</span>
                            <span class="stat-value quality-${getQualityLevel(film.scriptQuality)}">${film.scriptQuality}/100</span>
                        </div>
                    </div>
                    <div class="event-choices">
                        ${event.choices.map((choice, index) => createEventChoiceCard(choice, index, film.id, event.id)).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    /**
     * Create event choice card
     */
    function createEventChoiceCard(choice, index, filmId, eventId) {
        const gameState = window.HollywoodMogul.getGameState();
        const canAfford = choice.cost ? gameState.cash >= Math.abs(choice.cost) : true;
        
        return `
            <div class="choice-card ${!canAfford ? 'unaffordable' : ''}">
                <div class="choice-header">
                    <h4 class="choice-title">${choice.title}</h4>
                    ${choice.cost ? `<span class="choice-cost ${choice.cost > 0 ? 'income' : 'expense'}">
                        ${choice.cost > 0 ? '+' : ''}$${Math.abs(choice.cost).toLocaleString()}
                    </span>` : ''}
                </div>
                <div class="choice-description">
                    <p>${choice.description}</p>
                </div>
                <div class="choice-consequences">
                    <h5>Consequences:</h5>
                    <ul class="consequence-list">
                        ${choice.consequences.map(consequence => 
                            `<li class="consequence-item ${consequence.type}">${consequence.description}</li>`
                        ).join('')}
                    </ul>
                </div>
                <div class="choice-risk">
                    <span class="risk-label">Risk Level:</span>
                    <span class="risk-indicator risk-${choice.risk.toLowerCase()}">${choice.risk}</span>
                </div>
                <button class="choice-btn ${canAfford ? 'cta-button' : 'disabled-button'}" 
                        data-film-id="${filmId}" 
                        data-event-id="${eventId}" 
                        data-choice-index="${index}"
                        ${!canAfford ? 'disabled' : ''}>
                    ${canAfford ? 'CHOOSE THIS' : 'CANNOT AFFORD'}
                </button>
            </div>
        `;
    }

    /**
     * Show historical event modal
     */
    function showHistoricalEventModal(event) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal historical-modal">
                <div class="modal-header">
                    <h3>${event.title}</h3>
                    <div class="event-date">${formatHistoricalDate(event.date)}</div>
                </div>
                <div class="modal-content">
                    <div class="historical-context">
                        <p class="event-description">${event.description}</p>
                        ${event.historicalBackground ? 
                            `<div class="historical-background">
                                <h4>Historical Context</h4>
                                <p>${event.historicalBackground}</p>
                            </div>` : ''
                        }
                    </div>
                    <div class="industry-impact">
                        <h4>Impact on Hollywood</h4>
                        <ul class="impact-list">
                            ${event.industryImpacts.map(impact => 
                                `<li class="impact-item">${impact}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    ${event.choices && event.choices.length > 0 ? `
                        <div class="historical-choices">
                            <h4>Your Studio's Response</h4>
                            <div class="choice-grid">
                                ${event.choices.map((choice, index) => 
                                    createHistoricalChoiceCard(choice, index, event.id)
                                ).join('')}
                            </div>
                        </div>
                    ` : `
                        <div class="modal-actions">
                            <button class="acknowledge-btn cta-button">UNDERSTOOD</button>
                        </div>
                    `}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    /**
     * Create historical choice card
     */
    function createHistoricalChoiceCard(choice, index, eventId) {
        return `
            <div class="historical-choice-card">
                <div class="choice-header">
                    <h5 class="choice-title">${choice.title}</h5>
                    <span class="choice-philosophy ${choice.philosophy.toLowerCase()}">${choice.philosophy}</span>
                </div>
                <div class="choice-description">
                    <p>${choice.description}</p>
                </div>
                <div class="choice-outcomes">
                    <h6>Immediate Effects:</h6>
                    <ul class="outcome-list">
                        ${choice.immediateEffects.map(effect => 
                            `<li class="outcome-item">${effect}</li>`
                        ).join('')}
                    </ul>
                    <h6>Long-term Consequences:</h6>
                    <ul class="outcome-list">
                        ${choice.longTermEffects.map(effect => 
                            `<li class="outcome-item">${effect}</li>`
                        ).join('')}
                    </ul>
                </div>
                <button class="historical-choice-btn cta-button" 
                        data-event-id="${eventId}" 
                        data-choice-index="${index}">
                    MAKE THIS CHOICE
                </button>
            </div>
        `;
    }

    /**
     * Show film performance summary modal
     */
    function showFilmPerformanceModal(film) {
        const distribution = film.distribution;
        const isProfit = distribution.netProfit >= 0;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal performance-modal">
                <div class="modal-header">
                    <h3>"${film.title}" - Final Performance</h3>
                    <span class="performance-indicator ${isProfit ? 'profit' : 'loss'}">
                        ${isProfit ? 'PROFITABLE' : 'LOSS'}
                    </span>
                </div>
                <div class="modal-content">
                    <div class="performance-summary">
                        <div class="perf-stat-grid">
                            <div class="perf-stat">
                                <span class="perf-label">Production Budget</span>
                                <span class="perf-value budget">$${film.actualBudget.toLocaleString()}</span>
                            </div>
                            <div class="perf-stat">
                                <span class="perf-label">Marketing Spend</span>
                                <span class="perf-value marketing">$${distribution.marketingCost.toLocaleString()}</span>
                            </div>
                            <div class="perf-stat">
                                <span class="perf-label">Total Investment</span>
                                <span class="perf-value investment">$${(film.actualBudget + distribution.marketingCost).toLocaleString()}</span>
                            </div>
                            <div class="perf-stat">
                                <span class="perf-label">Box Office Gross</span>
                                <span class="perf-value gross">$${distribution.boxOfficeResults.totalGross.toLocaleString()}</span>
                            </div>
                            <div class="perf-stat">
                                <span class="perf-label">Studio Revenue</span>
                                <span class="perf-value revenue">$${distribution.totalRevenue.toLocaleString()}</span>
                            </div>
                            <div class="perf-stat final-stat">
                                <span class="perf-label">Net ${isProfit ? 'Profit' : 'Loss'}</span>
                                <span class="perf-value ${isProfit ? 'profit' : 'loss'}">
                                    ${isProfit ? '+' : ''}$${distribution.netProfit.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    ${createWeeklyBoxOfficeChart(distribution.boxOfficeResults)}
                    
                    <div class="performance-factors">
                        <h4>Performance Factors</h4>
                        <div class="factor-grid">
                            <div class="factor-item">
                                <span class="factor-label">Script Quality</span>
                                <span class="factor-value">${film.scriptQuality}/100</span>
                            </div>
                            <div class="factor-item">
                                <span class="factor-label">Distribution Strategy</span>
                                <span class="factor-value">${formatDistributionStrategy(distribution.strategy)}</span>
                            </div>
                            <div class="factor-item">
                                <span class="factor-label">Critical Reception</span>
                                <span class="factor-value">${distribution.boxOfficeResults.criticalReception.type}</span>
                            </div>
                            <div class="factor-item">
                                <span class="factor-label">Genre</span>
                                <span class="factor-value">${film.genre}</span>
                            </div>
                        </div>
                    </div>
                    
                    ${distribution.boxOfficeResults.events.length > 0 ? `
                        <div class="market-events">
                            <h4>Market Events</h4>
                            <ul class="event-list">
                                ${distribution.boxOfficeResults.events.map(event => 
                                    `<li class="market-event">${event.description}</li>`
                                ).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-actions">
                    <button class="close-performance-btn cta-button">CONTINUE</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    /**
     * Create weekly box office chart visualization
     */
    function createWeeklyBoxOfficeChart(boxOfficeResults) {
        const weeks = boxOfficeResults.weeks;
        const maxGross = Math.max(...weeks.map(w => w.grossRevenue));
        
        return `
            <div class="box-office-chart">
                <h4>Weekly Box Office Performance</h4>
                <div class="chart-container">
                    <div class="chart-bars">
                        ${weeks.map((week, index) => {
                            const height = (week.grossRevenue / maxGross) * 100;
                            return `
                                <div class="chart-bar-container">
                                    <div class="chart-bar" style="height: ${height}%">
                                        <span class="bar-value">$${(week.grossRevenue / 1000).toFixed(0)}k</span>
                                    </div>
                                    <span class="bar-label">Week ${week.week}</span>
                                    ${week.dropoff > 0 ? 
                                        `<span class="bar-dropoff">↓${week.dropoff}%</span>` : ''
                                    }
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Show save/load game modal
     */
    function showSaveLoadModal() {
        const saves = window.SaveLoadSystem.listSaves();
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal save-load-modal">
                <div class="modal-header">
                    <h3>Save / Load Game</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-content">
                    <div class="save-section">
                        <h4>Save Current Game</h4>
                        <div class="save-input-group">
                            <input type="text" id="save-name-input" placeholder="Enter save name..." maxlength="50">
                            <button class="save-game-btn cta-button">SAVE</button>
                        </div>
                    </div>
                    
                    <div class="load-section">
                        <h4>Load Saved Game</h4>
                        ${saves.length === 0 ? 
                            '<div class="no-saves">No saved games found</div>' :
                            `<div class="saves-list">
                                ${saves.map(save => createSaveSlotCard(save)).join('')}
                            </div>`
                        }
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    /**
     * Create save slot card
     */
    function createSaveSlotCard(save) {
        const date = new Date(save.timestamp);
        const gameDate = save.gameState.currentDate;
        
        const filmCount = Array.isArray(save.gameState.films)
            ? save.gameState.films.length
            : ((save.gameState.activeFilms || []).length + (save.gameState.completedFilms || []).length);

        return `
            <div class="save-slot">
                <div class="save-info">
                    <h5 class="save-name">${save.name}</h5>
                    <div class="save-details">
                        <span class="save-date">Game Date: ${getMonthName(gameDate.month)} ${gameDate.year}</span>
                        <span class="save-cash">Cash: $${save.gameState.cash.toLocaleString()}</span>
                        <span class="save-films">Films: ${filmCount}</span>
                    </div>
                    <div class="save-timestamp">Saved: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}</div>
                </div>
                <div class="save-actions">
                    <button class="load-save-btn cta-button" data-save-id="${save.id}">LOAD</button>
                    <button class="delete-save-btn danger-button" data-save-id="${save.id}">DELETE</button>
                </div>
            </div>
        `;
    }

    /**
     * Show settings modal
     */
    function showSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal settings-modal">
                <div class="modal-header">
                    <h3>Game Settings</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-content">
                    <div class="settings-section">
                        <h4>Display Settings</h4>
                        <div class="setting-item">
                            <label class="setting-label">
                                <input type="checkbox" id="show-tooltips" checked>
                                Show Help Tooltips
                            </label>
                        </div>
                        <div class="setting-item">
                            <label class="setting-label">
                                <input type="checkbox" id="auto-save" checked>
                                Auto-save Every Month
                            </label>
                        </div>
                        <div class="setting-item">
                            <label class="setting-label">
                                <input type="checkbox" id="confirm-actions" checked>
                                Confirm Important Actions
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h4>Audio Settings</h4>
                        <div class="setting-item">
                            <label class="setting-label">
                                Music Volume
                                <input type="range" id="music-volume" min="0" max="100" value="70">
                            </label>
                        </div>
                        <div class="setting-item">
                            <label class="setting-label">
                                Sound Effects
                                <input type="range" id="sfx-volume" min="0" max="100" value="80">
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h4>Game Data</h4>
                        <div class="setting-actions">
                            <button class="export-data-btn secondary-button">EXPORT SAVE DATA</button>
                            <button class="import-data-btn secondary-button">IMPORT SAVE DATA</button>
                            <button class="reset-game-btn danger-button">RESET ALL DATA</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    /**
     * Show confirmation dialog
     */
    function showConfirmationDialog(title, message, confirmText = 'CONFIRM', cancelText = 'CANCEL') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal confirmation-modal">
                    <div class="modal-header">
                        <h3>${title}</h3>
                    </div>
                    <div class="modal-content">
                        <p class="confirmation-message">${message}</p>
                    </div>
                    <div class="modal-actions">
                        <button class="cancel-btn secondary-button">${cancelText}</button>
                        <button class="confirm-btn cta-button">${confirmText}</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Handle button clicks
            modal.querySelector('.confirm-btn').onclick = () => {
                modal.remove();
                resolve(true);
            };
            
            modal.querySelector('.cancel-btn').onclick = () => {
                modal.remove();
                resolve(false);
            };
            
            // Handle backdrop click
            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(false);
                }
            };
        });
    }

    /**
     * Bind modal event handlers
     */
    function bindEventHandlers() {
        if (boundClickHandler) {
            document.removeEventListener('click', boundClickHandler);
        }
        boundClickHandler = function(e) {
            // Production event choices
            if (e.target.matches('.choice-btn')) {
                const filmId = e.target.dataset.filmId;
                const eventId = e.target.dataset.eventId;
                const choiceIndex = parseInt(e.target.dataset.choiceIndex);
                handleProductionEventChoice(filmId, eventId, choiceIndex);
                closeModal(e.target.closest('.modal-overlay'));
            }
            
            // Historical event choices
            if (e.target.matches('.historical-choice-btn')) {
                const eventId = e.target.dataset.eventId;
                const choiceIndex = parseInt(e.target.dataset.choiceIndex);
                handleHistoricalEventChoice(eventId, choiceIndex);
                closeModal(e.target.closest('.modal-overlay'));
            }
            
            // Acknowledge buttons
            if (e.target.matches('.acknowledge-btn') || e.target.matches('.close-performance-btn')) {
                closeModal(e.target.closest('.modal-overlay'));
            }
            
            // Save/Load actions
            if (e.target.matches('.save-game-btn')) {
                const nameInput = document.getElementById('save-name-input');
                const saveName = nameInput.value.trim() || `Save ${new Date().toLocaleString()}`;
                window.SaveLoadSystem.saveGame(saveName);
                closeModal(e.target.closest('.modal-overlay'));
                window.DashboardUI.showNotification('Game Saved', `Saved as "${saveName}"`, 'success');
            }
            
            if (e.target.matches('.load-save-btn')) {
                const saveId = e.target.dataset.saveId;
                if (window.SaveLoadSystem.loadGame(saveId)) {
                    closeModal(e.target.closest('.modal-overlay'));
                    window.DashboardUI.showNotification('Game Loaded', 'Save game loaded successfully', 'success');
                    window.DashboardUI.updateDashboard();
                }
            }
            
            if (e.target.matches('.delete-save-btn')) {
                const saveId = e.target.dataset.saveId;
                showConfirmationDialog(
                    'Delete Save',
                    'Are you sure you want to delete this save? This cannot be undone.',
                    'DELETE',
                    'CANCEL'
                ).then(confirmed => {
                    if (confirmed) {
                        window.SaveLoadSystem.deleteSave(saveId);
                        // Refresh the modal
                        closeModal(e.target.closest('.modal-overlay'));
                        showSaveLoadModal();
                    }
                });
            }
        };
        document.addEventListener('click', boundClickHandler);
    }

    /**
     * Handle production event choice
     */
    function handleProductionEventChoice(filmId, eventId, choiceIndex) {
        const result = window.ProductionSystem.resolveProductionEvent(filmId, eventId, choiceIndex);
        
        if (result.success) {
            window.DashboardUI.updateDashboard();
            window.DashboardUI.showNotification(
                'Decision Made',
                result.message,
                result.outcome === 'positive' ? 'success' : 'warning'
            );
        }
    }

    /**
     * Handle historical event choice
     */
    function handleHistoricalEventChoice(eventId, choiceIndex) {
        // Historical events would be handled by the events system
        // Historical event choice handled by events system
        window.DashboardUI.updateDashboard();
    }

    /**
     * Close specific modal
     */
    function closeModal(modal) {
        if (modal) {
            modal.remove();
        }
    }

    /**
     * Close all modals
     */
    function closeAllModals() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => modal.remove());
    }

    // Helper functions
    function getQualityLevel(quality) {
        if (quality >= 80) return 'excellent';
        if (quality >= 60) return 'good';
        if (quality >= 40) return 'average';
        return 'poor';
    }

    function formatHistoricalDate(date) {
        return `${getMonthName(date.month)} ${date.year}`;
    }

    function formatDistributionStrategy(strategy) {
        const names = {
            'wide': 'Wide Release',
            'limited': 'Limited Release',
            'states_rights': 'States\' Rights Sale'
        };
        return names[strategy] || strategy;
    }

    function getMonthName(monthNum) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNum - 1] || 'Unknown';
    }

    var isInitialized = false;
    var boundClickHandler = null;

    // Initialize event handlers
    function init() {
        if (isInitialized) return;
        bindEventHandlers();
        isInitialized = true;
    }

    function destroy() {
        if (boundClickHandler) {
            document.removeEventListener('click', boundClickHandler);
            boundClickHandler = null;
        }
        isInitialized = false;
    }

    // Public API
    return {
        init: init,
        destroy: destroy,
        showProductionEventModal: showProductionEventModal,
        showHistoricalEventModal: showHistoricalEventModal,
        showFilmPerformanceModal: showFilmPerformanceModal,
        showSaveLoadModal: showSaveLoadModal,
        showSettingsModal: showSettingsModal,
        showConfirmationDialog: showConfirmationDialog,
        closeAllModals: closeAllModals
    };
})();