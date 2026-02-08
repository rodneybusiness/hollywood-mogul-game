/**
 * HOLLYWOOD MOGUL - CONTENT REGULATION SYSTEM
 * Hays Code / PCA enforcement (1934-1968) and MPAA ratings (1968-2010)
 * Scripts must be approved under Hays Code; under MPAA, player chooses rating
 */

window.CensorshipSystem = (function() {
    'use strict';

    // ================================================================
    // HAYS CODE (1934-1968) — Content violations that the PCA rejects
    // ================================================================

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

    // ================================================================
    // MPAA RATINGS (1968-2010) — Player chooses rating, affects marketability
    // ================================================================

    const MPAA_RATINGS = {
        G: {
            name: 'G - General Audiences',
            yearIntroduced: 1968,
            audienceMultiplier: 1.2,
            contentFreedom: 0.2,
            prestigeModifier: -5,
            maxCensorRisk: 15,
            description: 'All ages admitted. Family-friendly content only.',
            boxOfficeNote: 'Broadest audience but limited creative freedom'
        },
        PG: {
            name: 'PG - Parental Guidance',
            yearIntroduced: 1968,
            audienceMultiplier: 1.15,
            contentFreedom: 0.4,
            prestigeModifier: 0,
            maxCensorRisk: 35,
            description: 'Some material may not be suitable for children.',
            boxOfficeNote: 'Wide audience, moderate creative freedom'
        },
        PG13: {
            name: 'PG-13 - Parents Strongly Cautioned',
            yearIntroduced: 1984,
            audienceMultiplier: 1.35,
            contentFreedom: 0.6,
            prestigeModifier: 0,
            maxCensorRisk: 55,
            description: 'Some material may be inappropriate for children under 13.',
            boxOfficeNote: 'The blockbuster sweet spot — maximum commercial potential'
        },
        R: {
            name: 'R - Restricted',
            yearIntroduced: 1968,
            audienceMultiplier: 0.75,
            contentFreedom: 0.85,
            prestigeModifier: 5,
            maxCensorRisk: 85,
            description: 'Under 17 requires accompanying parent or adult guardian.',
            boxOfficeNote: 'Limits teen audience but allows serious, mature content'
        },
        NC17: {
            name: 'NC-17 - Adults Only',
            yearIntroduced: 1990,
            audienceMultiplier: 0.25,
            contentFreedom: 1.0,
            prestigeModifier: -10,
            maxCensorRisk: 100,
            description: 'No one 17 and under admitted. Many theaters refuse to book.',
            boxOfficeNote: 'Severely limits distribution — only for art-house fare'
        }
    };

    // ================================================================
    // ERA DETECTION
    // ================================================================

    function getRegulationType(gameState) {
        if (window.GameConstants && window.GameConstants.getContentRegulationForYear) {
            return window.GameConstants.getContentRegulationForYear(gameState.gameYear || 1933);
        }
        // Fallback
        if (!gameState.censorshipActive) return 'none';
        return 'hays_code';
    }

    // ================================================================
    // UNIFIED EVALUATE SCRIPT — routes to Hays Code or MPAA
    // ================================================================

    function evaluateScript(script, gameState) {
        var regulation = getRegulationType(gameState);

        if (regulation === 'none') {
            return {
                approved: true,
                violations: [],
                regulationType: 'none',
                message: 'Pre-Code era - no restrictions'
            };
        }

        if (regulation === 'mpaa') {
            return evaluateScriptMPAA(script, gameState);
        }

        // hays_code or hays_code_weak
        return evaluateScriptHaysCode(script, gameState, regulation === 'hays_code_weak');
    }

    // ================================================================
    // HAYS CODE EVALUATION
    // ================================================================

    function evaluateScriptHaysCode(script, gameState, isWeak) {
        const violations = [];
        const textToCheck = (script.description + ' ' + (script.synopsis || '') + ' ' + (script.themes || []).join(' ')).toLowerCase();

        for (const violationType in CONTENT_VIOLATIONS) {
            const violation = CONTENT_VIOLATIONS[violationType];
            const pattern = new RegExp(
                violation.keywords.map(k => '\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').join('|'),
                'i'
            );
            if (pattern.test(textToCheck)) {
                // Weak Code: downgrade severity and reduce penalties
                if (isWeak) {
                    var weakPenalty = {
                        quality: Math.floor(violation.penalty.quality * 0.5),
                        budget: Math.floor(violation.penalty.budget * 0.5),
                        weeks: Math.max(0, violation.penalty.weeks - 1)
                    };
                    var weakSeverity = violation.severity === 'extreme' ? 'high' :
                                      violation.severity === 'high' ? 'medium' : 'low';
                    violations.push({
                        type: violationType,
                        severity: weakSeverity,
                        description: violation.description,
                        penalty: weakPenalty
                    });
                } else {
                    violations.push({
                        type: violationType,
                        severity: violation.severity,
                        description: violation.description,
                        penalty: violation.penalty
                    });
                }
            }
        }

        // Genre-specific risks
        if (script.genre === 'noir' || script.genre === 'crime') {
            if (Math.random() < 0.35 && !violations.some(v => v.type === 'crime')) {
                violations.push({
                    type: 'crime',
                    severity: isWeak ? 'low' : 'medium',
                    description: 'Criminal protagonist concerns',
                    penalty: isWeak
                        ? { quality: -5, budget: 4000, weeks: 0 }
                        : { quality: -10, budget: 8000, weeks: 1 }
                });
            }
        }

        // Weak Code is more lenient: needs extreme + 3+ violations for rejection
        var extremeViolations = violations.filter(v => v.severity === 'extreme');
        var approved;
        if (isWeak) {
            approved = extremeViolations.length === 0;
        } else {
            approved = extremeViolations.length === 0 && violations.length < 3;
        }

        return {
            approved: approved,
            violations: violations,
            regulationType: isWeak ? 'hays_code_weak' : 'hays_code',
            requiresChanges: violations.length > 0,
            message: generatePCAMessage(approved, violations, isWeak)
        };
    }

    // ================================================================
    // MPAA EVALUATION — suggests rating based on content analysis
    // ================================================================

    function evaluateScriptMPAA(script, gameState) {
        var censorRisk = script.censorRisk || 30;
        var suggestedRating = getSuggestedRating(censorRisk, gameState.gameYear);
        var availableRatings = getAvailableRatings(gameState.gameYear);

        return {
            approved: true,
            violations: [],
            regulationType: 'mpaa',
            requiresChanges: false,
            suggestedRating: suggestedRating,
            availableRatings: availableRatings,
            censorRisk: censorRisk,
            message: 'MPAA era - choose your film\'s rating. Rating affects audience size and content freedom.'
        };
    }

    function getSuggestedRating(censorRisk, year) {
        var ratings = getAvailableRatings(year);
        // Find the lowest rating that accommodates the content
        for (var i = 0; i < ratings.length; i++) {
            if (censorRisk <= MPAA_RATINGS[ratings[i]].maxCensorRisk) {
                return ratings[i];
            }
        }
        return ratings[ratings.length - 1]; // Default to highest available
    }

    function getAvailableRatings(year) {
        var ratings = [];
        for (var key in MPAA_RATINGS) {
            if (year >= MPAA_RATINGS[key].yearIntroduced) {
                ratings.push(key);
            }
        }
        return ratings;
    }

    /**
     * Apply chosen MPAA rating to a film
     * Returns multipliers that affect box office and prestige
     */
    function applyMPAARating(film, ratingKey) {
        var rating = MPAA_RATINGS[ratingKey];
        if (!rating) return film;

        film.mpaaRating = ratingKey;
        film.mpaaRatingName = rating.name;
        film.audienceMultiplier = rating.audienceMultiplier;
        film.contentFreedom = rating.contentFreedom;

        // If script's content exceeds chosen rating, quality penalty (must cut content)
        var censorRisk = film.censorRisk || 30;
        if (censorRisk > rating.maxCensorRisk) {
            var excess = censorRisk - rating.maxCensorRisk;
            var qualityLoss = Math.floor(excess / 10) * 3;
            film.currentQuality = Math.max(20, (film.currentQuality || film.scriptQuality || 50) - qualityLoss);
            film.contentCut = true;
            film.contentCutAmount = qualityLoss;
        }

        // Prestige modifier
        if (window.HollywoodMogul) {
            var gs = window.HollywoodMogul.getGameState();
            if (gs) {
                gs.reputation = Math.max(0, Math.min(100, gs.reputation + rating.prestigeModifier));
            }
        }

        return film;
    }

    // ================================================================
    // PCA MESSAGE GENERATION
    // ================================================================

    function generatePCAMessage(approved, violations, isWeak) {
        var prefix = isWeak ? 'The weakening Production Code Administration' : 'The Production Code Administration';

        if (approved && violations.length === 0) {
            return 'Script approved without reservations. Proceed with production.';
        }
        if (approved && violations.length > 0) {
            return prefix + ` has flagged ${violations.length} issue(s). Minor changes required before filming.`;
        }
        return prefix + ` has REJECTED this script. ${violations.length} serious violation(s) identified. Major revisions required.`;
    }

    // ================================================================
    // UI MODALS
    // ================================================================

    function showPCAEvaluationModal(script, evaluation, onApprove, onReject) {
        // Route to MPAA modal if applicable
        if (evaluation.regulationType === 'mpaa') {
            return showMPAARatingModal(script, evaluation, onApprove, onReject);
        }

        var isWeak = evaluation.regulationType === 'hays_code_weak';
        var violationsHTML = '';

        if (evaluation.violations.length > 0) {
            var heading = isWeak ? 'Code Concerns (Enforcement Weakening):' : 'Code Violations:';
            violationsHTML = '<h3>' + heading + '</h3><ul class="violations-list">';
            for (var i = 0; i < evaluation.violations.length; i++) {
                var violation = evaluation.violations[i];
                var icon = violation.severity === 'extreme' ? '&#x1F6AB;' :
                          violation.severity === 'high' ? '&#x26A0;&#xFE0F;' : '&#x26A1;';

                violationsHTML += '<li class="violation ' + violation.severity + '">' +
                    '<strong>' + icon + ' ' + violation.type.toUpperCase() + ':</strong> ' +
                    violation.description + '<br>' +
                    '<em>Penalty: -' + violation.penalty.quality + ' quality, +$' +
                    violation.penalty.budget.toLocaleString() + ', +' + violation.penalty.weeks + ' weeks</em>' +
                    '</li>';
            }
            violationsHTML += '</ul>';
        }

        var totalQuality = evaluation.violations.reduce(function(sum, v) { return sum + v.penalty.quality; }, 0);
        var totalBudget = evaluation.violations.reduce(function(sum, v) { return sum + v.penalty.budget; }, 0);
        var totalWeeks = evaluation.violations.reduce(function(sum, v) { return sum + v.penalty.weeks; }, 0);

        var content = '<div class="pca-evaluation">' +
            '<h2>' + (isWeak ? 'Production Code (Weakening)' : 'Production Code Administration') + '</h2>' +
            '<h3>Script: "' + script.title + '"</h3>' +
            '<div class="pca-verdict ' + (evaluation.approved ? 'approved' : 'rejected') + '">' +
            '<p><strong>' + evaluation.message + '</strong></p></div>' +
            violationsHTML;

        if (evaluation.requiresChanges) {
            content += '<div class="pca-options"><h3>Your Options:</h3>' +
                '<div class="option-card"><h4>1. Make Required Changes</h4>' +
                '<p>Revise the script to comply. Costs time and money but ensures PCA seal.</p>' +
                '<ul><li>Total penalty: ' + totalQuality + ' quality</li>' +
                '<li>Additional cost: $' + totalBudget.toLocaleString() + '</li>' +
                '<li>Delay: +' + totalWeeks + ' weeks</li></ul></div>' +
                '<div class="option-card risky"><h4>2. Proceed Anyway (Risky)</h4>' +
                '<p>Ignore PCA. <strong>Film cannot be widely exhibited without PCA seal.</strong></p></div>' +
                '<div class="option-card"><h4>3. Abandon Project</h4>' +
                '<p>Cancel production and return script to library.</p></div></div>';
        } else {
            content += '<div class="pca-approved"><p>No changes required. Proceed to production with confidence.</p></div>';
        }

        content += '<div class="modal-actions">';
        if (evaluation.requiresChanges) {
            content += '<button onclick="' + onApprove + '" class="action-btn primary">MAKE CHANGES &amp; PROCEED</button>' +
                '<button onclick="' + onReject + '" class="action-btn secondary">ABANDON PROJECT</button>';
        } else {
            content += '<button onclick="' + onApprove + '" class="action-btn primary">PROCEED TO PRODUCTION</button>';
        }
        content += '</div></div>';

        window.HollywoodMogul.showModal(content);
        return evaluation;
    }

    function showMPAARatingModal(script, evaluation, onApprove, onReject) {
        var ratings = evaluation.availableRatings;
        var suggested = evaluation.suggestedRating;
        var censorRisk = evaluation.censorRisk;

        var content = '<div class="mpaa-evaluation">' +
            '<h2>MPAA Rating Selection</h2>' +
            '<h3>Script: "' + script.title + '"</h3>' +
            '<p>Content intensity: <strong>' + censorRisk + '/100</strong> &mdash; ' +
            'Suggested rating: <strong>' + suggested + '</strong></p>' +
            '<p class="mpaa-instructions">Choose a rating for your film. ' +
            'Lower ratings reach wider audiences but may require cutting content. ' +
            'Higher ratings preserve artistic vision but limit distribution.</p>' +
            '<div class="mpaa-ratings-grid">';

        for (var i = 0; i < ratings.length; i++) {
            var key = ratings[i];
            var r = MPAA_RATINGS[key];
            var isSuggested = key === suggested;
            var willCut = censorRisk > r.maxCensorRisk;
            var qualityLoss = willCut ? Math.floor((censorRisk - r.maxCensorRisk) / 10) * 3 : 0;
            var audiencePct = Math.round(r.audienceMultiplier * 100);

            content += '<div class="mpaa-rating-card ' + (isSuggested ? 'suggested' : '') + (willCut ? ' will-cut' : '') + '">' +
                '<div class="rating-badge rating-' + key.toLowerCase() + '">' + key.replace('13', '-13').replace('17', '-17') + '</div>' +
                '<h4>' + r.name + '</h4>' +
                '<p class="rating-desc">' + r.description + '</p>' +
                '<div class="rating-stats">' +
                '<div>Audience reach: <strong>' + audiencePct + '%</strong></div>' +
                '<div>Creative freedom: <strong>' + Math.round(r.contentFreedom * 100) + '%</strong></div>';

            if (willCut) {
                content += '<div class="content-cut-warning">Content cuts required: <strong>-' + qualityLoss + ' quality</strong></div>';
            }

            content += '</div>' +
                '<p class="box-office-note">' + r.boxOfficeNote + '</p>' +
                '<button onclick="CensorshipSystem.selectRating(\'' + script.id + '\', \'' + key + '\')" ' +
                'class="action-btn ' + (isSuggested ? 'primary' : 'secondary') + '">' +
                (isSuggested ? 'SELECT (Recommended)' : 'SELECT') + '</button>' +
                '</div>';
        }

        content += '</div>' +
            '<div class="modal-actions">' +
            '<button onclick="' + onReject + '" class="action-btn secondary">ABANDON PROJECT</button>' +
            '</div></div>';

        window.HollywoodMogul.showModal(content);
        return evaluation;
    }

    /**
     * Called when player selects an MPAA rating from the modal
     */
    function selectRating(scriptId, ratingKey) {
        var gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        if (!gameState) return;

        // Store the chosen rating on the script so production can use it
        var script = gameState.availableScripts.find(function(s) { return s.id === scriptId; });
        if (script) {
            script.mpaaRating = ratingKey;
            script.audienceMultiplier = MPAA_RATINGS[ratingKey].audienceMultiplier;
        }

        // Also store on any active film with this title
        var film = gameState.activeFilms.find(function(f) { return f.title === (script && script.title); });
        if (film) {
            applyMPAARating(film, ratingKey);
        }

        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'production',
                icon: '&#x1F3AC;',
                message: '"' + (script ? script.title : 'Film') + '" rated ' + MPAA_RATINGS[ratingKey].name + '.',
                priority: 'medium'
            });
            window.HollywoodMogul.closeModal();
        }
    }

    // ================================================================
    // PCA PENALTIES (Hays Code only)
    // ================================================================

    function applyPCAPenalties(film, violations) {
        if (!violations || violations.length === 0) return film;

        var totalQualityPenalty = 0;
        var totalBudgetPenalty = 0;
        var totalWeeksPenalty = 0;

        for (var i = 0; i < violations.length; i++) {
            totalQualityPenalty += violations[i].penalty.quality;
            totalBudgetPenalty += violations[i].penalty.budget;
            totalWeeksPenalty += violations[i].penalty.weeks;
        }

        film.quality = Math.max(0, (film.quality || 50) - totalQualityPenalty);
        film.budgetSpent = (film.budgetSpent || 0) + totalBudgetPenalty;
        film.weeksRemaining = (film.weeksRemaining || 12) + totalWeeksPenalty;

        film.pcaCensored = true;
        film.pcaViolations = violations.length;

        window.HollywoodMogul.spendCash(totalBudgetPenalty);
        return film;
    }

    // ================================================================
    // FINAL REVIEW (before release)
    // ================================================================

    function finalPCAReview(film, gameState) {
        var regulation = getRegulationType(gameState);

        // Pre-Code or MPAA: no final review needed
        if (regulation === 'none' || regulation === 'mpaa') {
            return {
                passed: true,
                seal: regulation === 'mpaa' ? false : true,
                rated: film.mpaaRating || null,
                message: regulation === 'mpaa'
                    ? 'Film rated ' + (film.mpaaRatingName || film.mpaaRating || 'N/A') + '. Ready for release.'
                    : 'Pre-Code era - no review required'
            };
        }

        // Hays Code: if already censored, auto-pass
        if (film.pcaCensored) {
            return {
                passed: true,
                seal: true,
                message: 'PCA seal granted. Film approved for exhibition.'
            };
        }

        // Weak code: lower rejection chance
        var rejectionChance = regulation === 'hays_code_weak' ? 0.05 : 0.10;
        if (Math.random() < rejectionChance) {
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

    // ================================================================
    // FILM REJECTION
    // ================================================================

    function handleRejectedFilm(film, gameState) {
        window.HollywoodMogul.addAlert({
            type: 'warning',
            icon: '&#x1F6AB;',
            message: '"' + film.title + '" REJECTED by PCA. Cannot be released.',
            priority: 'high'
        });

        film.unmarketable = true;
        film.pcaRejected = true;
        gameState.reputation = Math.max(0, gameState.reputation - 15);

        var activeIndex = gameState.activeFilms.indexOf(film);
        if (activeIndex >= 0) {
            gameState.activeFilms.splice(activeIndex, 1);
            gameState.completedFilms.push(film);
        }
    }

    // ================================================================
    // STATUS REPORTING
    // ================================================================

    function getCensorshipStatus(gameState) {
        var regulation = getRegulationType(gameState);

        if (regulation === 'none') {
            return {
                active: false,
                era: 'Pre-Code',
                regulationType: 'none',
                description: 'No content restrictions in effect. Films can explore controversial themes freely.',
                icon: '&#x1F3AD;'
            };
        }

        if (regulation === 'mpaa') {
            return {
                active: true,
                era: 'MPAA Ratings',
                regulationType: 'mpaa',
                description: 'The MPAA ratings system is in effect. Choose your film\'s rating to balance audience reach and creative freedom.',
                icon: '&#x1F3AC;',
                availableRatings: getAvailableRatings(gameState.gameYear || 1968)
            };
        }

        if (regulation === 'hays_code_weak') {
            return {
                active: true,
                era: 'Production Code (Weakening)',
                regulationType: 'hays_code_weak',
                description: 'The Hays Code is losing its grip. Enforcement is inconsistent and exemptions are granted for prestige films.',
                icon: '&#x2696;&#xFE0F;'
            };
        }

        return {
            active: true,
            era: 'Production Code',
            regulationType: 'hays_code',
            description: 'Joseph Breen\'s Production Code Administration enforces strict moral guidelines. All scripts must be approved.',
            icon: '&#x2696;&#xFE0F;'
        };
    }

    function calculateReputationImpact(gameState) {
        var censoredFilms = (gameState.completedFilms || []).filter(function(f) { return f.pcaCensored; });
        var rejectedFilms = (gameState.completedFilms || []).filter(function(f) { return f.pcaRejected; });
        var impact = 0;
        impact -= censoredFilms.length * 2;
        impact -= rejectedFilms.length * 15;
        return impact;
    }

    // ================================================================
    // PUBLIC API
    // ================================================================
    return {
        evaluateScript: evaluateScript,
        showPCAEvaluationModal: showPCAEvaluationModal,
        applyPCAPenalties: applyPCAPenalties,
        applyMPAARating: applyMPAARating,
        finalPCAReview: finalPCAReview,
        handleRejectedFilm: handleRejectedFilm,
        getCensorshipStatus: getCensorshipStatus,
        calculateReputationImpact: calculateReputationImpact,
        selectRating: selectRating,
        getAvailableRatings: getAvailableRatings,
        CONTENT_VIOLATIONS: CONTENT_VIOLATIONS,
        MPAA_RATINGS: MPAA_RATINGS
    };
})();
