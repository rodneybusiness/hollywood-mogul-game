/**
 * HOLLYWOOD MOGUL - DASHBOARD VISUAL ENHANCEMENTS
 * Enhanced production visualization with animations
 */
window.DashboardVisuals = (function() {
    'use strict';

    /**
     * Generate phase icons HTML with animations
     */
    function getPhaseIconsHTML(currentPhase) {
        const phases = [
            { key: 'greenlit', label: 'Dev', icon: '📝' },
            { key: 'pre_production', label: 'Prep', icon: '🎭' },
            { key: 'shooting', label: 'Shoot', icon: '🎬' },
            { key: 'post_production', label: 'Post', icon: '✂️' },
            { key: 'post_production_complete', label: 'Ready', icon: '🎞️' }
        ];

        const currentIndex = phases.findIndex(p => p.key === currentPhase);

        return `
            <div class="phase-indicators">
                ${phases.map((phase, index) => {
                    let classList = 'phase-icon';
                    if (index < currentIndex) classList += ' completed';
                    if (index === currentIndex) classList += ' current';

                    return `
                        <div class="${classList}">
                            <div class="phase-icon-symbol">${phase.icon}</div>
                            <div class="phase-icon-label">${phase.label}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Create enhanced production film card HTML
     */
    function createEnhancedProductionCard(film) {
        // Calculate progress
        const phases = ['greenlit', 'pre_production', 'shooting', 'post_production', 'post_production_complete'];
        const normalizedPhase = normalizePhase(film.phase);
        const currentIndex = phases.indexOf(normalizedPhase);
        const progressPercent = currentIndex >= 0 ? ((currentIndex + 1) / phases.length) * 100 : 0;

        const budget = film.actualBudget ?? film.currentBudget ?? film.originalBudget ?? 0;
        const spentToDate = film.spentToDate ?? 0;
        const weeklyBurn = film.weeklyBurnRate ?? Math.floor(budget / 20);

        // Determine status badges
        const budgetOverrun = spentToDate > budget * 1.1;
        const behindSchedule = film.delayWeeks > 0 || !film.onSchedule;
        const onTrack = !budgetOverrun && !behindSchedule;

        // Get phase icons
        const phaseIcons = getPhaseIconsHTML(normalizedPhase);

        // Get talent information
        const director = film.director?.name || 'TBD';
        const leadActor = film.leadActors?.[0]?.name || 'TBD';

        // Get Oscar info if available
        const oscarInfo = typeof getFilmOscarInfo === 'function' ? getFilmOscarInfo(film) : { hasOscars: false, display: '' };

        return `
            <div class="film-card production-card ${oscarInfo.hasOscars ? 'oscar-winner' : ''}">
                <div class="film-header">
                    <h4 class="film-title">
                        ${film.title}
                        ${oscarInfo.display}
                    </h4>
                    <span class="film-budget">$${budget.toLocaleString()}</span>
                </div>
                <div class="film-info">
                    <span class="genre-tag">${film.genre}</span>
                    <span class="phase-indicator">${formatPhase(normalizedPhase)}</span>
                </div>

                <!-- Animated Progress Bar -->
                <div class="production-progress-container">
                    <div class="production-progress-bar">
                        <div class="production-progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>

                <!-- Phase Icons -->
                ${phaseIcons}

                <!-- Status Badges -->
                <div class="production-status-badges">
                    ${budgetOverrun ? '<span class="status-badge budget-overrun">💰 OVER BUDGET</span>' : ''}
                    ${behindSchedule ? '<span class="status-badge behind-schedule">⏰ BEHIND SCHEDULE</span>' : ''}
                    ${onTrack ? '<span class="status-badge on-track">✓ ON TRACK</span>' : ''}
                </div>

                <!-- Weekly Cost Burn -->
                <div class="weekly-burn-display">
                    <span class="burn-label">WEEKLY BURN RATE</span>
                    <span class="burn-amount">-$${weeklyBurn.toLocaleString()}</span>
                </div>

                <!-- Talent Information -->
                <div class="production-talent">
                    <div class="talent-row">
                        <span class="talent-role">Director:</span>
                        <span class="talent-name">${director}</span>
                    </div>
                    <div class="talent-row">
                        <span class="talent-role">Lead:</span>
                        <span class="talent-name">${leadActor}</span>
                    </div>
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
     * Show production milestone animation when film advances to new phase
     */
    function showProductionMilestone(filmTitle, phaseName) {
        // Create camera flash effect
        const flash = document.createElement('div');
        flash.className = 'camera-flash';
        document.body.appendChild(flash);

        // Remove flash after animation
        setTimeout(() => flash.remove(), 500);

        // Create milestone overlay
        const overlay = document.createElement('div');
        overlay.className = 'phase-milestone-overlay';

        const phaseIcon = getPhaseIcon(phaseName);

        overlay.innerHTML = `
            <div class="milestone-content">
                <div class="milestone-announcement">NOW ENTERING</div>
                <div class="milestone-phase">${phaseName}</div>
                <div class="milestone-icon">${phaseIcon}</div>
                <div class="film-reel-decoration">
                    <div class="reel-circle"></div>
                    <div class="reel-circle"></div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Remove after 3 seconds
        setTimeout(() => {
            overlay.style.animation = 'milestoneOverlayIn 0.5s ease-out reverse';
            setTimeout(() => overlay.remove(), 500);
        }, 3000);
    }

    /**
     * Show weekly box office update with animated ticker
     */
    function showWeeklyBoxOfficeUpdate(filmTitle, weekNumber, grossRevenue, lastWeekRevenue, totalGross) {
        const dropPercent = lastWeekRevenue > 0
            ? Math.round(((lastWeekRevenue - grossRevenue) / lastWeekRevenue) * 100)
            : 0;

        const popup = document.createElement('div');
        popup.className = 'weekly-update-popup';

        const dropArrow = dropPercent > 0 ? '<span class="ticker-arrow down">↓</span>' : '<span class="ticker-arrow up">↑</span>';
        const dropClass = dropPercent > 0 ? 'negative' : 'positive';

        popup.innerHTML = `
            <div class="box-office-ticker-container">
                <div class="ticker-header">BOX OFFICE WEEK ${weekNumber}</div>
                <h3 style="text-align: center; color: var(--secondary-gold); margin-bottom: var(--spacing-sm);">${filmTitle}</h3>

                <div class="ticker-main-amount">$${grossRevenue.toLocaleString()}</div>

                ${lastWeekRevenue > 0 ? `
                    <div class="ticker-comparison">
                        ${dropArrow}
                        <span class="ticker-percentage ${dropClass}">${Math.abs(dropPercent)}% vs last week</span>
                    </div>
                ` : ''}

                <div class="ticker-stats-grid">
                    <div class="ticker-stat">
                        <div class="ticker-stat-label">WEEK</div>
                        <div class="ticker-stat-value">${weekNumber}</div>
                    </div>
                    <div class="ticker-stat">
                        <div class="ticker-stat-label">TOTAL GROSS</div>
                        <div class="ticker-stat-value">$${totalGross.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Remove after 5 seconds with fade out
        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => popup.remove(), 400);
        }, 5000);
    }

    /**
     * Create enhanced production event modal
     */
    function showEnhancedProductionEvent(eventData, film) {
        const modal = document.createElement('div');
        modal.className = 'production-event-modal';

        const budget = film.actualBudget ?? film.currentBudget ?? film.originalBudget ?? 0;
        const spentToDate = film.spentToDate ?? 0;

        modal.innerHTML = `
            <div class="event-modal-content">
                <h2 class="event-modal-title">${eventData.title}</h2>
                <div class="event-modal-description">${eventData.description}</div>

                <div class="event-choices-container">
                    ${eventData.choices.map((choice, index) => `
                        <button class="event-choice-btn" data-choice-index="${index}">
                            <div class="event-choice-text">${choice.text}</div>
                            <div class="event-choice-cost">Cost: $${choice.cost.toLocaleString()}</div>
                            <div class="event-choice-effects">${formatEffects(choice.effect)}</div>
                        </button>
                    `).join('')}
                </div>

                <div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid rgba(184, 134, 11, 0.3);">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); text-align: center;">
                        <div>
                            <div style="font-size: 0.75rem; color: rgba(255, 255, 240, 0.6);">BUDGET</div>
                            <div style="font-size: 1.1rem; color: var(--ivory);">$${budget.toLocaleString()}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.75rem; color: rgba(255, 255, 240, 0.6);">SPENT TO DATE</div>
                            <div style="font-size: 1.1rem; color: ${spentToDate > budget ? 'var(--danger-red)' : 'var(--ivory)'};">$${spentToDate.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle choice selection
        modal.querySelectorAll('.event-choice-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const choiceIndex = parseInt(this.dataset.choiceIndex);
                // Call the existing ProductionSystem.resolveEvent function
                if (window.ProductionSystem && window.ProductionSystem.resolveEvent) {
                    window.ProductionSystem.resolveEvent(film.id, choiceIndex, eventData.title);
                }
                modal.remove();
            });
        });

        // Close on click outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Helper functions
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

    function formatPhase(phase) {
        phase = normalizePhase(phase);
        const formats = {
            'greenlit': 'Development',
            'pre_production': 'Pre-Production',
            'shooting': 'Principal Photography',
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

    function getPhaseIcon(phaseName) {
        const icons = {
            'DEVELOPMENT': '📝',
            'PRE_PRODUCTION': '🎭',
            'PRINCIPAL_PHOTOGRAPHY': '🎬',
            'POST_PRODUCTION': '✂️',
            'DISTRIBUTION_PREP': '🎞️'
        };
        return icons[phaseName] || '🎬';
    }

    function formatEffects(effects) {
        const parts = [];
        if (effects.delayWeeks) parts.push(`Delay: ${Math.abs(effects.delayWeeks)} week${Math.abs(effects.delayWeeks) !== 1 ? 's' : ''}`);
        if (effects.quality) parts.push(`Quality: ${effects.quality > 0 ? '+' : ''}${effects.quality}`);
        if (effects.crewEfficiency) parts.push(`Crew: ${effects.crewEfficiency > 0 ? '+' : ''}${effects.crewEfficiency}%`);
        if (effects.crewMorale) parts.push(`Morale: ${effects.crewMorale > 0 ? '+' : ''}${effects.crewMorale}%`);
        return parts.join(' • ') || 'No additional effects';
    }

    // Public API
    return {
        createEnhancedProductionCard: createEnhancedProductionCard,
        getPhaseIconsHTML: getPhaseIconsHTML,
        showProductionMilestone: showProductionMilestone,
        showWeeklyBoxOfficeUpdate: showWeeklyBoxOfficeUpdate,
        showEnhancedProductionEvent: showEnhancedProductionEvent
    };
})();
