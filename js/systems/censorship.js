/**
 * HOLLYWOOD MOGUL - CENSORSHIP SYSTEM
 * Production Code Administration (PCA) / Hays Code enforcement (1934-1968)
 * Scripts must be approved, films can be rejected, reshoots required
 */

window.CensorshipSystem = (function() {
    'use strict';

    /**
     * Content violations database - what the PCA rejects
     */
    const CONTENT_VIOLATIONS = {
        sexuality: {
            severity: 'high',
            keywords: ['affair', 'mistress', 'seduction', 'prostitute', 'adultery', 'lust'],
            description: 'Sexual content or suggestiveness',
            penalty: { quality: -15, budget: 12000, weeks: 2 }
        },
        crime: {
            severity: 'high',
            keywords: ['murder', 'robbery', 'gangster', 'criminal', 'violence', 'gun'],
            description: 'Crime depicted sympathetically',
            penalty: { quality: -10, budget: 8000, weeks: 1 }
        },
        religion: {
            severity: 'extreme',
            keywords: ['blasphemy', 'sacrilege', 'mockery', 'religion'],
            description: 'Religious mockery or irreverence',
            penalty: { quality: -20, budget: 15000, weeks: 3 }
        },
        authority: {
            severity: 'medium',
            keywords: ['corrupt', 'law enforcement', 'government', 'rebel'],
            description: 'Disrespect for law and order',
            penalty: { quality: -8, budget: 5000, weeks: 1 }
        },
        drugs: {
            severity: 'extreme',
            keywords: ['narcotics', 'drugs', 'opium', 'addiction'],
            description: 'Drug use depicted',
            penalty: { quality: -18, budget: 10000, weeks: 2 }
        },
        interracial: {
            severity: 'extreme',
            keywords: ['miscegenation', 'interracial', 'mixed race'],
            description: 'Interracial relationships',
            penalty: { quality: -25, budget: 20000, weeks: 4 }
        },
        profanity: {
            severity: 'medium',
            keywords: ['damn', 'hell', 'profanity', 'curse'],
            description: 'Profane language',
            penalty: { quality: -5, budget: 3000, weeks: 1 }
        }
    };

    /**
     * Evaluate script for PCA violations
     */
    function evaluateScript(script, gameState) {
        // No censorship before July 1934
        if (!gameState.censorshipActive) {
            return {
                approved: true,
                violations: [],
                message: 'Pre-Code era - no restrictions'
            };
        }

        const violations = [];

        // Check script description and themes for violations
        const textToCheck = (script.description + ' ' + script.synopsis + ' ' + (script.themes || []).join(' ')).toLowerCase();

        for (const violationType in CONTENT_VIOLATIONS) {
            const violation = CONTENT_VIOLATIONS[violationType];

            // Check for keywords
            for (const keyword of violation.keywords) {
                if (textToCheck.includes(keyword)) {
                    violations.push({
                        type: violationType,
                        severity: violation.severity,
                        description: violation.description,
                        penalty: violation.penalty
                    });
                    break; // Only add each violation type once
                }
            }
        }

        // Check genre-specific risks
        if (script.genre === 'noir' || script.genre === 'crime') {
            // Noir films almost always have some issues
            if (Math.random() < 0.6 && !violations.some(v => v.type === 'crime')) {
                violations.push({
                    type: 'crime',
                    severity: 'medium',
                    description: 'Criminal protagonist concerns',
                    penalty: { quality: -10, budget: 8000, weeks: 1 }
                });
            }
        }

        // Determine approval status
        const extremeViolations = violations.filter(v => v.severity === 'extreme');
        const approved = extremeViolations.length === 0 && violations.length < 3;

        return {
            approved: approved,
            violations: violations,
            requiresChanges: violations.length > 0,
            message: generatePCAMessage(approved, violations)
        };
    }

    /**
     * Generate PCA response message
     */
    function generatePCAMessage(approved, violations) {
        if (approved && violations.length === 0) {
            return 'Script approved without reservations. Proceed with production.';
        }

        if (approved && violations.length > 0) {
            return `Script approved with minor changes required. ${violations.length} issue(s) must be addressed before filming.`;
        }

        return `Script REJECTED by the Production Code Administration. Major revisions required. ${violations.length} serious violation(s) identified.`;
    }

    /**
     * Show PCA evaluation modal
     */
    function showPCAEvaluationModal(script, evaluation, onApprove, onReject) {
        let violationsHTML = '';

        if (evaluation.violations.length > 0) {
            violationsHTML = '<h3>⚠️ Code Violations:</h3><ul class="violations-list">';
            for (const violation of evaluation.violations) {
                const icon = violation.severity === 'extreme' ? '🚫' :
                            violation.severity === 'high' ? '⚠️' : '⚡';

                violationsHTML += `
                    <li class="violation ${violation.severity}">
                        <strong>${icon} ${violation.type.toUpperCase()}:</strong>
                        ${violation.description}
                        <br>
                        <em>Penalty: -${violation.penalty.quality} quality, +$${violation.penalty.budget.toLocaleString()}, +${violation.penalty.weeks} weeks</em>
                    </li>
                `;
            }
            violationsHTML += '</ul>';
        }

        const content = `
            <div class="pca-evaluation">
                <h2>🏛️ Production Code Administration</h2>
                <h3>Script: "${script.title}"</h3>

                <div class="pca-verdict ${evaluation.approved ? 'approved' : 'rejected'}">
                    <p><strong>${evaluation.message}</strong></p>
                </div>

                ${violationsHTML}

                ${evaluation.requiresChanges ? `
                    <div class="pca-options">
                        <h3>Your Options:</h3>
                        <div class="option-card">
                            <h4>1. Make Required Changes</h4>
                            <p>Revise the script to comply with the Code. Costs time and money, but ensures PCA seal.</p>
                            <ul>
                                <li>Total penalty: -${evaluation.violations.reduce((sum, v) => sum + v.penalty.quality, 0)} quality</li>
                                <li>Additional cost: $${evaluation.violations.reduce((sum, v) => sum + v.penalty.budget, 0).toLocaleString()}</li>
                                <li>Delay: +${evaluation.violations.reduce((sum, v) => sum + v.penalty.weeks, 0)} weeks</li>
                            </ul>
                        </div>

                        <div class="option-card risky">
                            <h4>2. Proceed Anyway (Not Recommended)</h4>
                            <p>Ignore PCA and film the script as written. <strong>Film cannot be exhibited without PCA seal.</strong></p>
                            <ul>
                                <li>⚠️ Film will be unmarketable</li>
                                <li>⚠️ Reputation damage: -20</li>
                                <li>⚠️ Theater chains will refuse booking</li>
                                <li>❌ Almost certain financial loss</li>
                            </ul>
                        </div>

                        <div class="option-card">
                            <h4>3. Abandon Project</h4>
                            <p>Cancel production and return script to library.</p>
                        </div>
                    </div>
                ` : `
                    <div class="pca-approved">
                        <p>✅ No changes required. You may proceed to production with confidence.</p>
                    </div>
                `}

                <div class="modal-actions">
                    ${evaluation.requiresChanges ? `
                        <button onclick="${onApprove}" class="action-btn primary">
                            MAKE CHANGES & PROCEED
                        </button>
                        <button onclick="${onReject}" class="action-btn secondary">
                            ABANDON PROJECT
                        </button>
                    ` : `
                        <button onclick="${onApprove}" class="action-btn primary">
                            PROCEED TO PRODUCTION
                        </button>
                    `}
                </div>
            </div>
        `;

        window.HollywoodMogul.showModal(content);

        return evaluation;
    }

    /**
     * Apply PCA penalties to a film
     */
    function applyPCAPenalties(film, violations) {
        if (!violations || violations.length === 0) return film;

        let totalQualityPenalty = 0;
        let totalBudgetPenalty = 0;
        let totalWeeksPenalty = 0;

        for (const violation of violations) {
            totalQualityPenalty += violation.penalty.quality;
            totalBudgetPenalty += violation.penalty.budget;
            totalWeeksPenalty += violation.penalty.weeks;
        }

        // Apply penalties
        film.quality = Math.max(0, (film.quality || 50) - totalQualityPenalty);
        film.budgetSpent = (film.budgetSpent || 0) + totalBudgetPenalty;
        film.weeksRemaining = (film.weeksRemaining || 12) + totalWeeksPenalty;

        // Mark as censored
        film.pcaCensored = true;
        film.pcaViolations = violations.length;

        // Add to game state cash impact
        window.HollywoodMogul.spendCash(totalBudgetPenalty);

        return film;
    }

    /**
     * Check if film passes final PCA review (before release)
     */
    function finalPCAReview(film, gameState) {
        if (!gameState.censorshipActive) {
            return {
                passed: true,
                seal: true,
                message: 'Pre-Code era - no review required'
            };
        }

        // If already censored during production, should pass
        if (film.pcaCensored) {
            return {
                passed: true,
                seal: true,
                message: 'PCA seal granted. Film approved for exhibition.'
            };
        }

        // Random chance of last-minute issues
        if (Math.random() < 0.1) {
            return {
                passed: false,
                seal: false,
                message: 'PCA seal DENIED. Last-minute content concerns. Film cannot be released.',
                requiresReshoots: true,
                reshootCost: 15000
            };
        }

        return {
            passed: true,
            seal: true,
            message: 'PCA seal granted. Film approved for exhibition.'
        };
    }

    /**
     * Handle film rejected at final review
     */
    function handleRejectedFilm(film, gameState) {
        window.HollywoodMogul.addAlert({
            type: 'warning',
            icon: '🚫',
            message: `"${film.title}" REJECTED by PCA. Cannot be released.`,
            priority: 'high'
        });

        // Film is unmarketable
        film.unmarketable = true;
        film.pcaRejected = true;

        // Reputation damage
        gameState.reputation = Math.max(0, gameState.reputation - 15);

        // Move to completed but can't distribute
        const activeIndex = gameState.activeFilms.indexOf(film);
        if (activeIndex >= 0) {
            gameState.activeFilms.splice(activeIndex, 1);
            gameState.completedFilms.push(film);
        }
    }

    /**
     * Get censorship status message
     */
    function getCensorshipStatus(gameState) {
        if (!gameState.censorshipActive) {
            return {
                active: false,
                era: 'Pre-Code',
                description: 'No content restrictions in effect. Films can explore controversial themes freely.',
                icon: '🎭'
            };
        }

        return {
            active: true,
            era: 'Production Code',
            description: 'Joseph Breen\'s Production Code Administration enforces strict moral guidelines. All scripts must be approved.',
            icon: '⚖️'
        };
    }

    /**
     * Calculate reputation impact of censorship history
     */
    function calculateReputationImpact(gameState) {
        const censoredFilms = (gameState.completedFilms || []).filter(f => f.pcaCensored);
        const rejectedFilms = (gameState.completedFilms || []).filter(f => f.pcaRejected);

        let impact = 0;

        // Each censored film slightly hurts artistic reputation
        impact -= censoredFilms.length * 2;

        // Rejected films seriously hurt reputation
        impact -= rejectedFilms.length * 15;

        return impact;
    }

    // Public API
    return {
        evaluateScript,
        showPCAEvaluationModal,
        applyPCAPenalties,
        finalPCAReview,
        handleRejectedFilm,
        getCensorshipStatus,
        calculateReputationImpact,
        CONTENT_VIOLATIONS
    };
})();
