/**
 * HOLLYWOOD MOGUL - DASHBOARD RIVAL STUDIOS EXTENSIONS
 * UI components for displaying rival studio activity and competition
 */

window.DashboardRivalExtensions = (function() {
    'use strict';

    /**
     * Initialize rival studios dashboard extensions
     */
    function init() {
        // Add update hooks to existing dashboard if available
        if (window.DashboardUI) {
            const originalUpdate = window.DashboardUI.updateDashboard;
            if (originalUpdate) {
                window.DashboardUI.updateDashboard = function() {
                    originalUpdate.call(window.DashboardUI);
                    updateIndustryNews();
                    updateMarketShare();
                    updateRivalActivity();
                };
            }
        }

    }

    /**
     * Update industry news section
     */
    function updateIndustryNews() {
        if (!window.RivalStudios || !window.HollywoodMogul) return;

        const gameState = window.HollywoodMogul.getGameState();
        const news = window.RivalStudios.getIndustryNews(gameState, 8);
        const container = document.getElementById('industry-news');

        if (!container) return;

        if (news.length === 0) {
            container.innerHTML = '<div class="no-content">No industry news yet</div>';
            return;
        }

        container.innerHTML = news.map(item => `
            <div class="news-item ${item.severity || 'info'}">
                <div class="news-icon">${getNewsIcon(item.type)}</div>
                <div class="news-content">
                    <p class="news-message">${item.message}</p>
                    <span class="news-date">${formatDate(item.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    /**
     * Update market share display
     */
    function updateMarketShare() {
        if (!window.RivalStudios || !window.HollywoodMogul) return;

        const gameState = window.HollywoodMogul.getGameState();
        const marketShare = window.RivalStudios.getMarketShare(gameState);
        const container = document.getElementById('market-share');

        if (!container || !marketShare) return;

        const studios = [
            { id: 'player', name: 'Your Studio', share: marketShare.player || 0 },
            { id: 'mgm', name: 'MGM', share: marketShare.mgm || 0 },
            { id: 'warner', name: 'Warner Bros', share: marketShare.warner || 0 },
            { id: 'rko', name: 'RKO', share: marketShare.rko || 0 },
            { id: 'paramount', name: 'Paramount', share: marketShare.paramount || 0 }
        ].sort((a, b) => b.share - a.share);

        container.innerHTML = `
            <div class="market-share-header">
                <h4>Market Share</h4>
            </div>
            <div class="market-share-bars">
                ${studios.map((studio, index) => `
                    <div class="share-row ${studio.id === 'player' ? 'player-row' : ''}">
                        <span class="share-rank">#${index + 1}</span>
                        <span class="share-name">${studio.name}</span>
                        <div class="share-bar-container">
                            <div class="share-bar" style="width: ${studio.share}%; background-color: ${getStudioColor(studio.id)}">
                            </div>
                        </div>
                        <span class="share-percent">${studio.share}%</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Update rival activity summary
     */
    function updateRivalActivity() {
        if (!window.RivalStudios || !window.HollywoodMogul) return;

        const gameState = window.HollywoodMogul.getGameState();
        const summary = window.RivalStudios.getCompetitionSummary(gameState);
        const container = document.getElementById('rival-activity');

        if (!container) return;

        container.innerHTML = `
            <div class="rival-stats">
                <div class="rival-stat-item">
                    <span class="stat-label">Active Rival Productions:</span>
                    <span class="stat-value">${summary.activeCompetingFilms}</span>
                </div>
                <div class="rival-stat-item">
                    <span class="stat-label">Upcoming Rival Releases:</span>
                    <span class="stat-value">${summary.upcomingReleases}</span>
                </div>
                ${summary.topRival ? `
                    <div class="rival-stat-item">
                        <span class="stat-label">Market Leader:</span>
                        <span class="stat-value">${summary.topRival.name} (${summary.topRival.share}%)</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Show detailed rival studio info modal
     */
    function showRivalStudioModal(studioId) {
        if (!window.RivalStudios || !window.HollywoodMogul) return;

        const gameState = window.HollywoodMogul.getGameState();
        const studio = window.RivalStudios.getRivalStudio(gameState, studioId);

        if (!studio) return;

        const modalContent = `
            <div class="rival-studio-modal">
                <div class="modal-header" style="border-bottom: 3px solid ${studio.color}">
                    <h2>${studio.name}</h2>
                    <p class="studio-slogan">"${studio.slogan}"</p>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-content">
                    <div class="studio-description">
                        <p>${studio.description}</p>
                    </div>

                    <div class="studio-stats">
                        <h3>Studio Overview</h3>
                        <div class="stat-grid">
                            <div class="stat-box">
                                <span class="stat-label">Cash Reserves</span>
                                <span class="stat-value">$${studio.cash.toLocaleString()}</span>
                            </div>
                            <div class="stat-box">
                                <span class="stat-label">Reputation</span>
                                <span class="stat-value">${studio.reputation}/100</span>
                            </div>
                            <div class="stat-box">
                                <span class="stat-label">Active Productions</span>
                                <span class="stat-value">${studio.activeProductions.length}</span>
                            </div>
                            <div class="stat-box">
                                <span class="stat-label">Films This Year</span>
                                <span class="stat-value">${studio.filmsThisYear}</span>
                            </div>
                        </div>
                    </div>

                    ${studio.activeProductions.length > 0 ? `
                        <div class="studio-productions">
                            <h3>Active Productions</h3>
                            ${studio.activeProductions.map(prod => `
                                <div class="production-item">
                                    <h4>${prod.title}</h4>
                                    <p>${prod.genre} | Budget: $${prod.budget.toLocaleString()} | Week ${prod.weeksInProduction}/${prod.productionLength}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${studio.upcomingReleases.length > 0 ? `
                        <div class="studio-releases">
                            <h3>Upcoming Releases</h3>
                            ${studio.upcomingReleases.map(film => `
                                <div class="release-item">
                                    <h4>${film.title}</h4>
                                    <p>${film.genre} | Releasing: ${formatDate(film.scheduledRelease)}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${studio.contractTalent.length > 0 ? `
                        <div class="studio-talent">
                            <h3>Contract Talent</h3>
                            <div class="talent-list">
                                ${studio.contractTalent.map(talent => `
                                    <span class="talent-badge">${talent.name} (${talent.type})</span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div class="studio-personality">
                        <h3>Studio Style</h3>
                        <div class="personality-traits">
                            <div class="trait">
                                <span class="trait-name">Aggression:</span>
                                <div class="trait-bar">
                                    <div class="trait-fill" style="width: ${studio.personality.aggression * 100}%"></div>
                                </div>
                            </div>
                            <div class="trait">
                                <span class="trait-name">Prestige Focus:</span>
                                <div class="trait-bar">
                                    <div class="trait-fill" style="width: ${studio.personality.prestige * 100}%"></div>
                                </div>
                            </div>
                            <div class="trait">
                                <span class="trait-name">Risk Tolerance:</span>
                                <div class="trait-bar">
                                    <div class="trait-fill" style="width: ${studio.personality.riskTolerance * 100}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="genre-preferences">
                            <strong>Preferred Genres:</strong>
                            ${studio.personality.genrePreference.map(genre =>
                                `<span class="genre-badge">${genre}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (window.HollywoodMogul && typeof window.HollywoodMogul.showModal === 'function') {
            window.HollywoodMogul.showModal(modalContent);
        }
    }

    /**
     * Get icon for news type
     */
    function getNewsIcon(type) {
        const icons = {
            'rival_film_announced': '🎬',
            'rival_film_completed': '✅',
            'rival_outbid_script': '💸',
            'rival_signs_talent': '⭐',
            'rival_release_same_weekend': '⚔️',
            'rival_critical_success': '🏆',
            'rival_box_office_hit': '💰',
            'rival_financial_trouble': '📉',
            'rival_studio_expansion': '🏭',
            'rival_competitive_response': '🎯'
        };
        return icons[type] || '📰';
    }

    /**
     * Get studio color for market share bars
     */
    function getStudioColor(studioId) {
        const colors = {
            'player': '#28a745',
            'mgm': '#C41E3A',
            'warner': '#0066CC',
            'rko': '#666666',
            'paramount': '#003087'
        };
        return colors[studioId] || '#999999';
    }

    /**
     * Format date for display
     */
    function formatDate(date) {
        if (!date) return '—';

        if (date instanceof Date) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[date.getMonth()]} ${date.getFullYear()}`;
        }

        if (typeof date === 'object' && typeof date.month === 'number' && typeof date.year === 'number') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[(date.month || 1) - 1]} ${date.year}`;
        }

        return String(date);
    }

    /**
     * Public API
     */
    return {
        init,
        updateIndustryNews,
        updateMarketShare,
        updateRivalActivity,
        showRivalStudioModal
    };
})();
