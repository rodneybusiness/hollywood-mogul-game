/**
 * HOLLYWOOD MOGUL - QUALITY BREAKDOWN UI COMPONENT
 * Detailed quality analysis and visualization for films
 */

window.QualityBreakdownUI = (function() {
    'use strict';

    /**
     * Show film detail modal with quality breakdown
     */
    function showFilmDetailModal(filmId) {
        const gameState = window.HollywoodMogul.getGameState();
        const film = findFilmById(gameState, filmId);

        if (!film) return;

        // Calculate final quality to update components
        const finalQuality = film.finalQuality || film.currentQuality || 50;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal film-detail-modal">
                <div class="modal-header">
                    <h3>"${film.title}" - Production Details</h3>
                    <button class="modal-close" onclick="QualityBreakdownUI.closeModal()">×</button>
                </div>
                <div class="modal-content">
                    ${createFilmDetailContent(film, finalQuality)}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Bind close handlers
        modal.querySelector('.modal-overlay')?.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    /**
     * Create film detail content with quality breakdown
     */
    function createFilmDetailContent(film, finalQuality) {
        const budget = film.actualBudget ?? film.currentBudget ?? film.originalBudget ?? 0;
        const phase = film.phase || 'DEVELOPMENT';

        return `
            <div class="film-detail-content">
                <div class="film-overview">
                    <div class="overview-stat">
                        <span class="stat-label">Genre</span>
                        <span class="stat-value">${film.genre}</span>
                    </div>
                    <div class="overview-stat">
                        <span class="stat-label">Budget</span>
                        <span class="stat-value">$${budget.toLocaleString()}</span>
                    </div>
                    <div class="overview-stat">
                        <span class="stat-label">Phase</span>
                        <span class="stat-value">${formatPhase(phase)}</span>
                    </div>
                    <div class="overview-stat">
                        <span class="stat-label">Weeks in Production</span>
                        <span class="stat-value">${film.totalWeeks || 0}</span>
                    </div>
                </div>

                ${createQualityBreakdown(film, finalQuality)}

                ${createProductionHistory(film)}

                ${createSuccessAnalysis(film, finalQuality)}
            </div>
        `;
    }

    /**
     * Create quality breakdown component
     */
    function createQualityBreakdown(film, finalQuality) {
        // Ensure quality components exist
        const components = film.qualityComponents || {
            script: film.scriptQuality || 50,
            direction: 50,
            performances: 50,
            productionValue: 50,
            editing: 50
        };

        return `
            <div class="quality-breakdown-section">
                <h4 class="section-title">Quality Breakdown</h4>

                <div class="overall-quality">
                    <span class="overall-label">Overall Quality</span>
                    <span class="overall-score ${getQualityClass(finalQuality)}">${finalQuality}/100</span>
                </div>

                <div class="quality-components">
                    ${createQualityBar('Script', components.script, 30)}
                    ${createQualityBar('Direction', components.direction, 25)}
                    ${createQualityBar('Performances', components.performances, 25)}
                    ${createQualityBar('Production Value', components.productionValue, 10)}
                    ${createQualityBar('Editing', components.editing, 10)}
                </div>

                <div class="quality-formula">
                    <p class="formula-title">Quality Formula:</p>
                    <p class="formula-text">Script (30%) + Direction (25%) + Performances (25%) + Production Value (10%) + Editing (10%)</p>
                </div>
            </div>
        `;
    }

    /**
     * Create individual quality bar
     */
    function createQualityBar(componentName, score, weight) {
        const percentage = Math.max(0, Math.min(100, score));
        const colorClass = getQualityClass(score);

        return `
            <div class="quality-component-row">
                <div class="component-header">
                    <span class="component-name">${componentName}</span>
                    <span class="component-weight">${weight}%</span>
                </div>
                <div class="component-bar-container">
                    <div class="component-bar">
                        <div class="component-fill ${colorClass}" style="width: ${percentage}%"></div>
                    </div>
                    <span class="component-score">${Math.round(score)}/100</span>
                </div>
            </div>
        `;
    }

    /**
     * Get quality color class based on score
     */
    function getQualityClass(score) {
        if (score >= 80) return 'quality-excellent';
        if (score >= 70) return 'quality-good';
        if (score >= 60) return 'quality-average';
        if (score >= 40) return 'quality-fair';
        return 'quality-poor';
    }

    /**
     * Create production history section
     */
    function createProductionHistory(film) {
        const events = film.productionEvents || [];
        const reshoots = film.reshootHistory || [];

        if (events.length === 0 && reshoots.length === 0 && film.onSchedule && film.onBudget) {
            return '';
        }

        return `
            <div class="production-history-section">
                <h4 class="section-title">Production History</h4>

                ${reshoots.length > 0 ? `
                    <div class="reshoots-list">
                        <h5>Reshoots:</h5>
                        ${reshoots.map(reshoot => `
                            <div class="history-item reshoot-item">
                                <span class="item-label">${reshoot.scope === 'major' ? 'Major' : 'Minor'} Reshoots</span>
                                <span class="item-result ${reshoot.result}">${formatReshootResult(reshoot.result)}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${(film.crisisCount || 0) > 0 ? `
                    <div class="crisis-summary">
                        <span class="crisis-label">Production Crises:</span>
                        <span class="crisis-count">${film.crisisCount} events</span>
                    </div>
                ` : ''}

                ${!film.onSchedule ? `
                    <div class="schedule-warning">
                        <span class="warning-icon">⚠️</span>
                        <span class="warning-text">Behind Schedule (+${film.delayWeeks || 0} weeks)</span>
                    </div>
                ` : ''}

                ${!film.onBudget ? `
                    <div class="budget-warning">
                        <span class="warning-icon">💰</span>
                        <span class="warning-text">Over Budget</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Create success/failure analysis
     */
    function createSuccessAnalysis(film, finalQuality) {
        const analysis = analyzeFilmSuccess(film, finalQuality);

        return `
            <div class="success-analysis-section">
                <h4 class="section-title">${analysis.title}</h4>
                <div class="analysis-content ${analysis.type}">
                    <p class="analysis-text">${analysis.message}</p>

                    ${analysis.strengths.length > 0 ? `
                        <div class="analysis-strengths">
                            <h6>Why This Works:</h6>
                            <ul>
                                ${analysis.strengths.map(s => `<li>${s}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${analysis.weaknesses.length > 0 ? `
                        <div class="analysis-weaknesses">
                            <h6>Problem Areas:</h6>
                            <ul>
                                ${analysis.weaknesses.map(w => `<li>${w}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Analyze film for success/failure reasons
     */
    function analyzeFilmSuccess(film, finalQuality) {
        const strengths = [];
        const weaknesses = [];
        const components = film.qualityComponents || {};

        // Identify strengths
        if (components.script >= 75) strengths.push('Excellent screenplay with strong story');
        if (components.direction >= 75) strengths.push('Masterful directorial vision');
        if (components.performances >= 75) strengths.push('Outstanding cast performances that elevate the material');
        if (components.productionValue >= 75) strengths.push('High production values visible on screen');
        if (components.editing >= 75) strengths.push('Skillful editing creates perfect pacing');
        if (film.onSchedule && film.onBudget) strengths.push('Smooth production with professional execution');

        // Identify weaknesses
        if (components.script < 50) weaknesses.push('Weak or poorly structured screenplay');
        if (components.direction < 50) weaknesses.push('Unfocused or ineffective direction');
        if (components.performances < 50) weaknesses.push('Lackluster or miscast performances');
        if (components.productionValue < 50) weaknesses.push('Low budget shows in production quality');
        if (components.editing < 50) weaknesses.push('Poor editing undermines the story');
        if ((film.crisisCount || 0) > 3) weaknesses.push('Too many production crises hurt quality');
        if (!film.onSchedule) weaknesses.push('Schedule delays damaged crew morale');
        if (!film.onBudget) weaknesses.push('Budget overruns forced compromises');

        // Determine overall assessment
        let title, message, type;
        if (finalQuality >= 80) {
            title = 'Why This Succeeds: Masterpiece Quality';
            message = 'Excellence across all production areas. This film has the hallmarks of a classic that will be remembered for years.';
            type = 'success';
        } else if (finalQuality >= 70) {
            title = 'Why This Succeeds: Strong Commercial Film';
            message = 'A well-crafted film with broad appeal. Should perform well with both audiences and critics.';
            type = 'good';
        } else if (finalQuality >= 60) {
            title = 'Analysis: Moderate Success Potential';
            message = 'A competent film with some good elements, but lacking the spark of greatness.';
            type = 'average';
        } else if (finalQuality >= 40) {
            title = 'Why This Struggles: Quality Issues';
            message = 'Significant weaknesses are holding this film back. Audiences will notice the problems.';
            type = 'warning';
        } else {
            title = 'Why This Failed: Critical Problems';
            message = 'Major issues throughout production have severely compromised quality. This will struggle to find an audience.';
            type = 'poor';
        }

        return {
            title,
            message,
            type,
            strengths,
            weaknesses
        };
    }

    /**
     * Format reshoot result for display
     */
    function formatReshootResult(result) {
        const resultLabels = {
            'improved': 'Successful',
            'no_change': 'No Impact',
            'major_improvement': 'Major Success',
            'minor_improvement': 'Minor Success'
        };
        return resultLabels[result] || result;
    }

    /**
     * Format phase for display
     */
    function formatPhase(phase) {
        const phaseMap = {
            'DEVELOPMENT': 'Development',
            'PRE_PRODUCTION': 'Pre-Production',
            'PRINCIPAL_PHOTOGRAPHY': 'Filming',
            'POST_PRODUCTION': 'Post-Production',
            'DISTRIBUTION_PREP': 'Distribution Prep',
            'COMPLETED': 'Completed'
        };
        return phaseMap[phase] || phase;
    }

    /**
     * Find film by ID in game state
     */
    function findFilmById(gameState, filmId) {
        const collections = [];

        if (Array.isArray(gameState.films)) {
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

        return Array.from(uniqueFilms.values()).find(film => film.id == filmId);
    }

    /**
     * Close modal
     */
    function closeModal() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => modal.remove());
    }

    /**
     * Public API
     */
    return {
        showFilmDetailModal,
        createQualityBreakdown,
        closeModal
    };
})();
