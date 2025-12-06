/**
 * HOLLYWOOD MOGUL - FILM PREMIERE SYSTEM
 * Creates dramatic reveal of opening weekend box office results
 */
window.PremiereSystem = (function() {
    'use strict';

    /**
     * Hook into box office theatrical run start
     * Called when a film is released to theaters
     */
    function startTheatricalRun(film, boxOfficeResults) {
        // Show premiere modal after brief delay for drama
        setTimeout(() => {
            showPremiereModal(film, boxOfficeResults);
        }, 500);
    }

    /**
     * Show dramatic premiere modal with staged reveal
     */
    function showPremiereModal(film, boxOfficeResults) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay premiere-overlay';
        modal.innerHTML = `
            <div class="modal premiere-modal">
                <div class="premiere-header">
                    <h2 class="premiere-title">"${film.title}" PREMIERE</h2>
                    <div class="premiere-date">${formatPremiereDate()}</div>
                </div>
                <div class="premiere-content">
                    <div class="premiere-stage" id="premiere-stage-1">
                        <div class="stage-title">THURSDAY PREVIEWS</div>
                        <div class="stage-subtitle">Industry screening estimates...</div>
                        <div class="preview-amount" id="preview-amount">
                            <div class="loading-dots">
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        </div>
                    </div>

                    <div class="premiere-stage hidden" id="premiere-stage-2">
                        <div class="stage-title">FRIDAY OPENING</div>
                        <div class="stage-subtitle">First day actuals</div>
                        <div class="friday-amount" id="friday-amount"></div>
                        <div class="critical-reception" id="critical-reception"></div>
                    </div>

                    <div class="premiere-stage hidden" id="premiere-stage-3">
                        <div class="stage-title">OPENING WEEKEND TOTAL</div>
                        <div class="weekend-amount" id="weekend-amount"></div>
                        <div class="weekend-reaction" id="weekend-reaction"></div>
                        <div class="box-office-breakdown" id="box-office-breakdown"></div>
                    </div>

                    <div class="premiere-actions hidden" id="premiere-actions">
                        <button class="premiere-btn cta-button" id="premiere-continue">
                            CONTINUE TO BOX OFFICE TRACKING
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Start the staged reveal
        animatePremiereReveal(film, boxOfficeResults, modal);

        // Handle continue button
        document.getElementById('premiere-continue').addEventListener('click', () => {
            modal.remove();
            // Update talent morale based on results
            if (window.TalentRoster && window.TalentRoster.updateTalentMorale) {
                window.TalentRoster.updateTalentMorale(film, boxOfficeResults);
            }
        });
    }

    /**
     * Animate the premiere reveal in stages
     */
    function animatePremiereReveal(film, boxOfficeResults, modal) {
        const firstWeekGross = boxOfficeResults.weeks[0].grossRevenue;
        const totalGross = boxOfficeResults.totalGross;

        // Calculate estimates
        const thursdayPreview = Math.floor(firstWeekGross * 0.12); // ~12% of week 1
        const fridayActuals = Math.floor(firstWeekGross * 0.35); // ~35% of week 1
        const weekendTotal = Math.floor(firstWeekGross * 0.85); // ~85% of week 1

        // Stage 1: Thursday Previews (1.5 seconds)
        setTimeout(() => {
            const previewEl = document.getElementById('preview-amount');
            previewEl.innerHTML = `<span class="amount-value">$${thursdayPreview.toLocaleString()}</span>`;
            previewEl.classList.add('reveal-animate');

            // Add industry buzz
            const buzzText = getIndustryBuzz(thursdayPreview, film.scriptQuality);
            previewEl.insertAdjacentHTML('afterend',
                `<div class="industry-buzz fade-in">${buzzText}</div>`
            );
        }, 1500);

        // Stage 2: Friday Actuals (3.5 seconds)
        setTimeout(() => {
            document.getElementById('premiere-stage-1').classList.add('fade-out');
            setTimeout(() => {
                document.getElementById('premiere-stage-1').classList.add('hidden');
                const stage2 = document.getElementById('premiere-stage-2');
                stage2.classList.remove('hidden');
                stage2.classList.add('fade-in');

                document.getElementById('friday-amount').innerHTML =
                    `<span class="amount-value-large">$${fridayActuals.toLocaleString()}</span>`;

                document.getElementById('critical-reception').innerHTML =
                    `<div class="reception-badge ${boxOfficeResults.criticalReception.type}">
                        ${boxOfficeResults.criticalReception.description}
                    </div>`;
            }, 500);
        }, 3500);

        // Stage 3: Weekend Total with celebration/disappointment (6 seconds)
        setTimeout(() => {
            document.getElementById('premiere-stage-2').classList.add('fade-out');
            setTimeout(() => {
                document.getElementById('premiere-stage-2').classList.add('hidden');
                const stage3 = document.getElementById('premiere-stage-3');
                stage3.classList.remove('hidden');
                stage3.classList.add('fade-in');

                const weekendEl = document.getElementById('weekend-amount');
                weekendEl.innerHTML =
                    `<span class="amount-value-huge ${getPerformanceClass(weekendTotal, film)}">
                        $${weekendTotal.toLocaleString()}
                    </span>`;

                // Reaction
                const reaction = getWeekendReaction(weekendTotal, film, boxOfficeResults);
                document.getElementById('weekend-reaction').innerHTML =
                    `<div class="reaction-message ${reaction.type}">
                        <div class="reaction-icon">${reaction.icon}</div>
                        <div class="reaction-text">${reaction.message}</div>
                    </div>`;

                // Breakdown
                document.getElementById('box-office-breakdown').innerHTML = `
                    <div class="breakdown-grid">
                        <div class="breakdown-item">
                            <span class="breakdown-label">Opening Weekend</span>
                            <span class="breakdown-value">$${weekendTotal.toLocaleString()}</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">Theater Count</span>
                            <span class="breakdown-value">${boxOfficeResults.strategy === 'wide' ? '500' : '100'} theaters</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">Per-Theater Average</span>
                            <span class="breakdown-value">$${Math.floor(weekendTotal / (boxOfficeResults.strategy === 'wide' ? 500 : 100)).toLocaleString()}</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">Studio Share</span>
                            <span class="breakdown-value">$${boxOfficeResults.weeks[0].studioRevenue.toLocaleString()}</span>
                        </div>
                    </div>
                `;

                // Show continue button
                document.getElementById('premiere-actions').classList.remove('hidden');
                document.getElementById('premiere-actions').classList.add('fade-in');
            }, 500);
        }, 6000);
    }

    /**
     * Get industry buzz text based on preview performance
     */
    function getIndustryBuzz(previewAmount, quality) {
        if (previewAmount > 15000) {
            return '"Industry insiders calling it a phenomenon" - Variety';
        } else if (previewAmount > 8000) {
            return '"Strong word of mouth from preview audiences" - Hollywood Reporter';
        } else if (previewAmount > 4000) {
            return '"Solid reception at industry screenings" - Exhibitor\'s Herald';
        } else {
            return '"Mixed reactions at preview screenings" - Box Office Digest';
        }
    }

    /**
     * Get weekend reaction message
     */
    function getWeekendReaction(weekendTotal, film, boxOfficeResults) {
        const budget = film.actualBudget || film.currentBudget || film.originalBudget || 0;
        const multiplier = weekendTotal / budget;

        let reaction = {
            type: 'neutral',
            icon: '🎬',
            message: 'The picture has opened to moderate business.'
        };

        if (multiplier >= 0.8) {
            reaction = {
                type: 'triumph',
                icon: '🏆',
                message: 'A SMASH HIT! The box office is on fire! This could be your biggest picture yet!'
            };
        } else if (multiplier >= 0.5) {
            reaction = {
                type: 'success',
                icon: '⭐',
                message: 'Strong opening! Exhibitors are calling for more prints. This picture has legs!'
            };
        } else if (multiplier >= 0.3) {
            reaction = {
                type: 'positive',
                icon: '📈',
                message: 'Solid opening. With good word of mouth, this could turn a profit.'
            };
        } else if (multiplier >= 0.15) {
            reaction = {
                type: 'disappointing',
                icon: '📉',
                message: 'Disappointing turnout. The picture is underperforming expectations.'
            };
        } else {
            reaction = {
                type: 'disaster',
                icon: '💥',
                message: 'DISASTER AT THE BOX OFFICE. Theaters are already pulling the picture.'
            };
        }

        return reaction;
    }

    /**
     * Get performance class for styling
     */
    function getPerformanceClass(weekendTotal, film) {
        const budget = film.actualBudget || film.currentBudget || film.originalBudget || 0;
        const multiplier = weekendTotal / budget;

        if (multiplier >= 0.8) return 'triumph';
        if (multiplier >= 0.5) return 'success';
        if (multiplier >= 0.3) return 'positive';
        if (multiplier >= 0.15) return 'neutral';
        return 'disaster';
    }

    /**
     * Format premiere date
     */
    function formatPremiereDate() {
        if (window.TimeSystem && window.TimeSystem.getCurrentDate) {
            const date = window.TimeSystem.getCurrentDate();
            const months = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
            return `${months[date.month - 1]} ${date.year}`;
        }
        return 'Opening Night';
    }

    // Public API
    return {
        startTheatricalRun: startTheatricalRun
    };
})();
