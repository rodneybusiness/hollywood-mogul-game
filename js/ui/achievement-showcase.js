/**
 * HOLLYWOOD MOGUL - ACHIEVEMENT SHOWCASE WIDGET
 * Celebrate your accomplishments and track progress
 * Chain D Feature #16 - FEEDBACK & CLARITY
 */

window.AchievementShowcase = (function() {
    'use strict';

    let lastUnlockedCount = 0;

    /**
     * Render achievement showcase widget
     */
    function renderShowcase(containerId = 'achievement-showcase') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Achievement showcase container not found:', containerId);
            return;
        }

        const gameState = window.HollywoodMogul.getGameState();
        const recentUnlocks = window.AchievementSystem.getRecentAchievements(gameState, 3);
        const closestToComplete = window.AchievementSystem.getClosestAchievements(gameState, 3);
        const totalPoints = window.AchievementSystem.getTotalPoints();
        const progress = window.AchievementSystem.getProgress();

        container.innerHTML = `
            <div class="achievement-showcase">
                <div class="showcase-header">
                    <div class="showcase-title-section">
                        <h3 class="showcase-title">ACHIEVEMENTS</h3>
                        <div class="total-points">
                            <span class="points-value">${totalPoints}</span>
                            <span class="points-label">points</span>
                        </div>
                    </div>
                    <div class="showcase-stats">
                        <span class="stat">${progress.unlocked}/${progress.total} unlocked</span>
                        <span class="stat-separator">•</span>
                        <span class="stat">${progress.percentage}%</span>
                    </div>
                </div>

                ${recentUnlocks.length > 0 ? `
                    <div class="showcase-section recent-section">
                        <h4 class="section-title">Recently Unlocked</h4>
                        <div class="achievements-grid">
                            ${recentUnlocks.map(achievement => renderAchievementCard(achievement, true)).join('')}
                        </div>
                    </div>
                ` : ''}

                ${closestToComplete.length > 0 ? `
                    <div class="showcase-section progress-section">
                        <h4 class="section-title">Almost There</h4>
                        <div class="achievements-list">
                            ${closestToComplete.map(item => renderProgressAchievement(item)).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="showcase-footer">
                    <button class="view-all-achievements-btn" onclick="AchievementShowcase.showFullAchievements()">
                        VIEW ALL ACHIEVEMENTS
                    </button>
                </div>
            </div>
        `;

        // Check for new achievements
        checkForNewAchievements(recentUnlocks.length);
    }

    /**
     * Render single achievement card
     */
    function renderAchievementCard(achievement, unlocked) {
        return `
            <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'} ${achievement.secret && !unlocked ? 'secret' : ''}">
                <div class="achievement-icon ${unlocked ? 'glow' : ''}">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">${achievement.secret && !unlocked ? '???' : achievement.title}</div>
                    <div class="achievement-description">${achievement.secret && !unlocked ? 'Secret Achievement' : achievement.description}</div>
                    <div class="achievement-points">+${achievement.points} pts</div>
                </div>
            </div>
        `;
    }

    /**
     * Render achievement with progress bar
     */
    function renderProgressAchievement(item) {
        const { achievement, progress } = item;

        return `
            <div class="progress-achievement">
                <div class="progress-achievement-header">
                    <div class="progress-icon">${achievement.icon}</div>
                    <div class="progress-info">
                        <div class="progress-title">${achievement.title}</div>
                        <div class="progress-description">${achievement.description}</div>
                    </div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${progress.percentage}%">
                        <span class="progress-percentage">${progress.percentage}%</span>
                    </div>
                </div>
                <div class="progress-details">
                    <span class="progress-count">${progress.description}</span>
                    <span class="progress-points">+${achievement.points} pts</span>
                </div>
            </div>
        `;
    }

    /**
     * Update showcase (called periodically)
     */
    function updateShowcase() {
        renderShowcase();
    }

    /**
     * Check for new achievements and add glow animation
     */
    function checkForNewAchievements(currentUnlockedCount) {
        if (currentUnlockedCount > lastUnlockedCount) {
            // New achievement unlocked - add animation
            const showcase = document.querySelector('.achievement-showcase');
            if (showcase) {
                showcase.classList.add('new-achievement');
                setTimeout(() => {
                    showcase.classList.remove('new-achievement');
                }, 3000);
            }
        }
        lastUnlockedCount = currentUnlockedCount;
    }

    /**
     * Show full achievements modal
     */
    function showFullAchievements() {
        const gameState = window.HollywoodMogul.getGameState();
        const allAchievements = window.AchievementSystem.getAllAchievements();
        const unlockedSet = new Set(
            window.AchievementSystem.getUnlockedAchievements().map(a => a.id)
        );

        // Group by category
        const categories = {};
        for (const id in allAchievements) {
            const achievement = allAchievements[id];
            const category = achievement.category;

            if (!categories[category]) {
                categories[category] = [];
            }

            const isUnlocked = unlockedSet.has(id);
            const progress = isUnlocked ? null : window.AchievementSystem.getAchievementProgress(id, gameState);

            categories[category].push({
                ...achievement,
                unlocked: isUnlocked,
                progress
            });
        }

        const modalContent = `
            <div class="achievements-modal">
                <div class="modal-header">
                    <h2>All Achievements</h2>
                    <button class="modal-close" onclick="window.HollywoodMogul.closeModal()">×</button>
                </div>

                <div class="modal-content">
                    <div class="achievements-summary">
                        <div class="summary-stat">
                            <span class="summary-label">Total Points:</span>
                            <span class="summary-value">${window.AchievementSystem.getTotalPoints()}</span>
                        </div>
                        <div class="summary-stat">
                            <span class="summary-label">Unlocked:</span>
                            <span class="summary-value">${window.AchievementSystem.getProgress().unlocked}/${window.AchievementSystem.getProgress().total}</span>
                        </div>
                        <div class="summary-stat">
                            <span class="summary-label">Completion:</span>
                            <span class="summary-value">${window.AchievementSystem.getProgress().percentage}%</span>
                        </div>
                    </div>

                    ${Object.entries(categories).map(([category, achievements]) => `
                        <div class="achievements-category">
                            <h3 class="category-title">${formatCategoryName(category)}</h3>
                            <div class="achievements-grid-modal">
                                ${achievements.map(achievement =>
                                    renderModalAchievementCard(achievement)
                                ).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        if (window.HollywoodMogul && window.HollywoodMogul.showModal) {
            window.HollywoodMogul.showModal(modalContent);
        }
    }

    /**
     * Render achievement card for modal
     */
    function renderModalAchievementCard(achievement) {
        const isSecret = achievement.secret && !achievement.unlocked;

        return `
            <div class="achievement-card-modal ${achievement.unlocked ? 'unlocked' : 'locked'} ${isSecret ? 'secret' : ''}">
                <div class="achievement-icon-large ${achievement.unlocked ? 'glow' : ''}">${isSecret ? '❓' : achievement.icon}</div>
                <div class="achievement-details">
                    <h4 class="achievement-title-modal">${isSecret ? '???' : achievement.title}</h4>
                    <p class="achievement-description-modal">${isSecret ? 'Secret Achievement - Keep playing to discover!' : achievement.description}</p>
                    <div class="achievement-meta">
                        <span class="achievement-category">${formatCategoryName(achievement.category)}</span>
                        <span class="achievement-points-modal">+${achievement.points} pts</span>
                    </div>
                    ${achievement.progress && !achievement.unlocked && !isSecret ? `
                        <div class="achievement-progress-bar">
                            <div class="progress-bar-fill-modal" style="width: ${achievement.progress.percentage}%"></div>
                            <span class="progress-text">${achievement.progress.description} (${achievement.progress.percentage}%)</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Format category name for display
     */
    function formatCategoryName(category) {
        const names = {
            'production': 'Production',
            'financial': 'Financial',
            'survival': 'Survival',
            'reputation': 'Reputation',
            'historical': 'Historical',
            'oscars': 'Awards',
            'genre': 'Genre Master',
            'challenge': 'Challenges',
            'secret': 'Secrets'
        };
        return names[category] || category;
    }

    // Public API
    return {
        renderShowcase,
        updateShowcase,
        showFullAchievements
    };
})();
