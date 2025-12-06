/**
 * HOLLYWOOD MOGUL - TEST SCREENING SYSTEM
 * Audience previews and feedback during post-production
 */

window.TestScreeningSystem = (function() {
    'use strict';

    /**
     * Run a test screening for a film
     * Returns audience feedback object
     */
    function testScreening(film) {
        const feedback = generateAudienceFeedback(film);
        return feedback;
    }

    /**
     * Generate audience feedback based on film quality components
     */
    function generateAudienceFeedback(film) {
        // Base overall score on current quality with some randomness
        const baseScore = film.currentQuality / 10; // Convert 0-100 to 0-10
        const randomVariance = (Math.random() * 2) - 1; // -1 to +1
        const overallScore = Math.max(1, Math.min(10, baseScore + randomVariance));

        // Identify strengths and weaknesses
        const strengths = [];
        const weaknesses = [];

        // Analyze each component
        const components = {
            story: film.scriptQuality || film.qualityComponents.script,
            performances: film.castChemistry || film.qualityComponents.performances || 50,
            pacing: 50 + (film.directorSkill - 70) * 0.5,
            ending: film.scriptQuality || 60,
            humor: film.genre === 'Comedy' ? 70 : 40,
            emotion: film.genre === 'Drama' ? 70 : 40
        };

        // Determine strengths (above 70)
        if (components.story > 70) strengths.push('Compelling storyline');
        if (components.performances > 70) strengths.push('Outstanding performances');
        if (components.pacing > 70) strengths.push('Excellent pacing');
        if (components.ending > 70) strengths.push('Satisfying ending');
        if (components.humor > 70) strengths.push('Great comedic timing');
        if (components.emotion > 70) strengths.push('Emotionally powerful');

        // Determine weaknesses (below 50)
        if (components.story < 50) weaknesses.push('Story feels weak or confusing');
        if (components.performances < 50) weaknesses.push('Performances lack chemistry');
        if (components.pacing < 50) weaknesses.push('Pacing drags in places');
        if (components.ending < 50) weaknesses.push('Unsatisfying ending');
        if (components.humor < 40 && film.genre === 'Comedy') weaknesses.push('Jokes fall flat');
        if (components.emotion < 40 && film.genre === 'Drama') weaknesses.push('Lacks emotional impact');

        // Ensure at least one strength and one weakness
        if (strengths.length === 0) {
            strengths.push('Professional production values');
        }
        if (weaknesses.length === 0 && overallScore < 8) {
            weaknesses.push('Could use minor polish');
        }

        return {
            overall: Math.round(overallScore * 10) / 10, // Round to 1 decimal
            strengths: strengths,
            weaknesses: weaknesses,
            components: components,
            audienceReaction: getAudienceReaction(overallScore),
            recommendation: getRecommendation(overallScore, weaknesses.length)
        };
    }

    /**
     * Get audience reaction description based on score
     */
    function getAudienceReaction(score) {
        if (score >= 9) return 'Standing ovation! Audience raved about the film.';
        if (score >= 8) return 'Very positive response with enthusiastic applause.';
        if (score >= 7) return 'Positive reception with solid applause.';
        if (score >= 6) return 'Mixed but generally favorable reactions.';
        if (score >= 5) return 'Polite applause, some audience members seemed disappointed.';
        if (score >= 4) return 'Lukewarm response, many walked out early.';
        return 'Poor reception, significant walkouts and negative feedback.';
    }

    /**
     * Get recommendation based on screening results
     */
    function getRecommendation(score, weaknessCount) {
        if (score >= 8) {
            return 'Film is ready for release. Minimal changes needed.';
        } else if (score >= 6.5) {
            return 'Film is solid but could benefit from minor tweaks.';
        } else if (score >= 5) {
            return 'Consider targeted reshoots to address weak points.';
        } else {
            return 'Serious issues detected. Major reshoots or re-editing recommended.';
        }
    }

    /**
     * Show test screening results modal
     */
    function showTestScreeningModal(film, results, gameState) {
        const scoreClass = results.overall >= 7 ? 'good' : results.overall >= 5 ? 'average' : 'poor';

        const modalContent = `
            <div class="test-screening-results">
                <h2>Test Screening Results - "${film.title}"</h2>
                <p class="screening-context">A preview audience of 200 people watched your film.</p>

                <div class="overall-score ${scoreClass}">
                    <h3>Overall Audience Score</h3>
                    <div class="score-display">${results.overall}/10</div>
                    <div class="audience-reaction">${results.audienceReaction}</div>
                </div>

                <div class="feedback-sections">
                    <div class="feedback-column strengths">
                        <h4>Strengths</h4>
                        <ul class="feedback-list">
                            ${results.strengths.map(s => `<li class="strength-item">${s}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="feedback-column weaknesses">
                        <h4>Weaknesses</h4>
                        <ul class="feedback-list">
                            ${results.weaknesses.length > 0
                                ? results.weaknesses.map(w => `<li class="weakness-item">${w}</li>`).join('')
                                : '<li class="no-weaknesses">No major issues identified</li>'
                            }
                        </ul>
                    </div>
                </div>

                <div class="category-breakdown">
                    <h4>Detailed Feedback</h4>
                    ${createCategoryBar('Story', results.components.story)}
                    ${createCategoryBar('Performances', results.components.performances)}
                    ${createCategoryBar('Pacing', results.components.pacing)}
                    ${createCategoryBar('Ending', results.components.ending)}
                </div>

                <div class="recommendation-box">
                    <h4>Recommendation</h4>
                    <p class="recommendation-text">${results.recommendation}</p>
                </div>

                <div class="screening-actions">
                    <button class="action-btn" onclick="TestScreeningSystem.handleScreeningChoice('${film.id}', 'accept')">
                        Accept Results & Continue
                    </button>
                    <button class="action-btn secondary" onclick="TestScreeningSystem.handleScreeningChoice('${film.id}', 'reshoots')">
                        Order Reshoots (+cost, +time)
                    </button>
                    <button class="action-btn secondary" onclick="TestScreeningSystem.handleScreeningChoice('${film.id}', 'reedit')">
                        Re-edit Film (-time)
                    </button>
                </div>
            </div>
        `;

        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalContent);
        }

        // Store current film for choices
        window._testScreeningFilm = film;
        window._testScreeningGameState = gameState;
    }

    /**
     * Create a category rating bar
     */
    function createCategoryBar(categoryName, score) {
        const percentage = Math.max(0, Math.min(100, score));
        const colorClass = score >= 70 ? 'good' : score >= 50 ? 'average' : 'poor';

        return `
            <div class="category-rating">
                <span class="category-label">${categoryName}</span>
                <div class="rating-bar">
                    <div class="rating-fill ${colorClass}" style="width: ${percentage}%"></div>
                </div>
                <span class="category-score">${Math.round(score)}/100</span>
            </div>
        `;
    }

    /**
     * Handle player's choice after test screening
     */
    function handleScreeningChoice(filmId, choice) {
        const film = window._testScreeningFilm;
        const gameState = window._testScreeningGameState;

        if (!film || !gameState) return;

        let message = '';

        switch(choice) {
            case 'accept':
                message = `"${film.title}": Test screening results accepted. Moving forward.`;
                break;

            case 'reshoots':
                // Trigger reshoot decision
                showReshootOptionsModal(film, gameState);
                return; // Don't close modal yet

            case 'reedit':
                // Re-edit: saves time but risks quality
                film.weeksInCurrentPhase = Math.min(
                    film.weeksInCurrentPhase + 1,
                    6 // POST_PRODUCTION duration
                );

                // 40% chance to improve quality through better editing
                if (Math.random() < 0.4) {
                    film.currentQuality = Math.min(100, film.currentQuality + 3);
                    film.qualityComponents.editing = Math.min(100, film.qualityComponents.editing + 10);
                    message = `"${film.title}": Re-edit successful! Film improved through clever editing.`;
                } else {
                    message = `"${film.title}": Re-edit completed but no major improvements achieved.`;
                }
                break;
        }

        // Close modal and show alert
        if (window.HollywoodMogul) {
            window.HollywoodMogul.closeModal();
            window.HollywoodMogul.addAlert({
                type: 'production',
                icon: '🎭',
                message: message,
                priority: 'medium'
            });
        }

        // Clean up
        delete window._testScreeningFilm;
        delete window._testScreeningGameState;
    }

    /**
     * Show reshoot options modal after test screening
     */
    function showReshootOptionsModal(film, gameState) {
        const canAffordMinor = gameState.cash >= 20000;
        const canAffordMajor = gameState.cash >= 50000;

        const modalContent = `
            <div class="reshoot-options">
                <h2>Reshoot Options - "${film.title}"</h2>
                <p class="context">Choose the scope of reshoots based on test screening feedback.</p>

                <div class="current-status">
                    <p><strong>Available Cash:</strong> $${gameState.cash.toLocaleString()}</p>
                    <p><strong>Current Quality:</strong> ${film.currentQuality}/100</p>
                </div>

                <div class="reshoot-choices">
                    <button class="choice-btn ${!canAffordMinor ? 'disabled' : ''}"
                            onclick="TestScreeningSystem.executeReshoots('${film.id}', 'minor')"
                            ${!canAffordMinor ? 'disabled' : ''}>
                        <div class="choice-title">Minor Reshoots</div>
                        <div class="choice-desc">Address specific weak scenes</div>
                        <div class="choice-cost">Cost: $20,000 | +2 weeks</div>
                        <div class="choice-chance">60% chance +0.5 quality</div>
                    </button>

                    <button class="choice-btn ${!canAffordMajor ? 'disabled' : ''}"
                            onclick="TestScreeningSystem.executeReshoots('${film.id}', 'major')"
                            ${!canAffordMajor ? 'disabled' : ''}>
                        <div class="choice-title">Major Reshoots</div>
                        <div class="choice-desc">Re-film entire sequences</div>
                        <div class="choice-cost">Cost: $50,000 | +4 weeks</div>
                        <div class="choice-chance">70% chance +1.0 quality</div>
                    </button>

                    <button class="choice-btn secondary" onclick="TestScreeningSystem.handleScreeningChoice('${film.id}', 'accept')">
                        Cancel - Accept Current Cut
                    </button>
                </div>
            </div>
        `;

        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalContent);
        }
    }

    /**
     * Execute reshoots from test screening
     */
    function executeReshoots(filmId, scope) {
        if (window.ProductionSystem && window.ProductionSystem.orderReshoots) {
            const message = window.ProductionSystem.orderReshoots(filmId, scope);

            if (window.HollywoodMogul) {
                window.HollywoodMogul.closeModal();
                window.HollywoodMogul.addAlert({
                    type: 'production',
                    icon: '🎬',
                    message: message,
                    priority: 'high'
                });
            }

            // Clean up
            delete window._testScreeningFilm;
            delete window._testScreeningGameState;
        }
    }

    /**
     * Public API
     */
    return {
        testScreening,
        showTestScreeningModal,
        handleScreeningChoice,
        executeReshoots
    };
})();
