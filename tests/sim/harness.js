/**
 * Headless economy simulation harness (AUDIT-PLAN.md §1, BUILD-PLAN-3.0.md Phase 0).
 *
 * Boots the real game — index.html DOM plus every <script src="js/..."> in page
 * order — inside jsdom, with a seeded Math.random so runs are reproducible.
 * Exposes the player-level actions (greenlight, release, loan) that scripted
 * strategies need, and records anything that throws instead of crashing the run.
 *
 * Fidelity modes:
 *   'browser' (default) — replicates the shipped boot sequence, including its
 *     bugs: Integration.init() subscribes EventBus handlers, then
 *     startNewGameWithScenario() calls EventBus.clear() and wipes them, and
 *     RivalStudios keeps its reference to the pre-new-game state object.
 *   'patched' — re-subscribes the monthly loan processing and re-inits
 *     RivalStudios with the fresh state, so the cost of those bugs can be
 *     measured as a diff against 'browser' runs.
 *
 * setTimeout/setInterval inside the game window are no-ops: the sim performs
 * distribution choices directly instead of waiting on modal timers, and the
 * 3-second loading-screen init must not re-enter mid-run. Anything the game
 * only does through a timer therefore does not happen in the sim — that is
 * faithful to nothing ever awaiting those timers headlessly, and is documented
 * in tests/sim/README.md.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..', '..');

function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
        a |= 0;
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function loadScriptSources() {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const srcs = [...html.matchAll(/<script\s+src="(js\/[^"]+)"/g)].map(m => m[1]);
    return { html, srcs };
}

function createGame(options = {}) {
    const {
        seed = 1,
        scenario = 'classic_start',
        fidelity = 'browser',
    } = options;

    const { html, srcs } = loadScriptSources();
    const dom = new JSDOM(html, {
        url: 'file://' + ROOT + '/index.html',
        runScripts: 'outside-only',
        pretendToBeVisual: true,
    });
    const w = dom.window;

    const errors = [];
    function recordError(where, err) {
        errors.push({ where, message: String(err && err.message || err), stack: err && err.stack });
    }

    // Deterministic RNG for everything the game rolls.
    w.Math.random = mulberry32(seed);

    // jsdom shims (environment gaps, not game behavior):
    // HTMLMediaElement.play is unimplemented in jsdom; the game calls
    // .play().catch(...) at audio init.
    w.HTMLMediaElement.prototype.play = function () { return Promise.resolve(); };
    w.HTMLMediaElement.prototype.pause = function () {};
    // localStorage can throw on opaque origins; give the game a memory-backed one.
    try {
        w.localStorage.getItem('probe');
    } catch (_) {
        const store = {};
        Object.defineProperty(w, 'localStorage', {
            value: {
                getItem: k => (k in store ? store[k] : null),
                setItem: (k, v) => { store[k] = String(v); },
                removeItem: k => { delete store[k]; },
                clear: () => { for (const k of Object.keys(store)) delete store[k]; },
            },
        });
    }

    // Neutralize timers (see file header).
    w.setTimeout = function () { return 0; };
    w.setInterval = function () { return 0; };
    w.clearTimeout = function () {};
    w.clearInterval = function () {};

    // Silence game logging, but keep console.error as evidence.
    const noop = function () {};
    w.console = {
        log: noop, info: noop, debug: noop, warn: noop,
        error: function () { recordError('console.error', [...arguments].join(' ')); },
    };

    // Load every game script in page order.
    for (const src of srcs) {
        const code = fs.readFileSync(path.join(ROOT, src), 'utf8');
        try {
            w.eval(code + '\n//# sourceURL=' + src);
        } catch (err) {
            recordError('load:' + src, err);
        }
    }

    // Boot, mirroring the browser sequence (minus timers).
    try {
        if (w.Integration && typeof w.Integration.init === 'function') w.Integration.init();
    } catch (err) {
        recordError('Integration.init', err);
    }
    try {
        w.HollywoodMogul.startNewGameWithScenario(scenario);
    } catch (err) {
        recordError('startNewGame', err);
    }

    if (fidelity === 'patched') {
        // Re-point RivalStudios at the post-new-game state object.
        if (w.RivalStudios && typeof w.RivalStudios.init === 'function') {
            try { w.RivalStudios.init(w.HollywoodMogul.getGameState()); } catch (err) { recordError('RivalStudios.reinit', err); }
        }
    }

    /**
     * The intended-but-unwired monthly pipeline. In the shipped game,
     * advanceWeek() never runs processMonthlyEvents (new scripts, historical
     * events, Oscars) — those only fire from the "advance month" path, which
     * in turn never runs weekly production/box office. 'patched' fidelity
     * runs this on month boundaries during weekly play so the matrix can
     * measure the economy as designed rather than as wired.
     */
    function runMonthlyPipeline() {
        const s = w.HollywoodMogul.getGameState();
        try {
            if (w.ScriptLibrary && w.ScriptLibrary.generateMonthlyScripts) {
                const fresh = w.ScriptLibrary.generateMonthlyScripts(s);
                if (fresh && fresh.length) s.availableScripts.push(...fresh);
            }
            if (w.HistoricalEvents && w.HistoricalEvents.checkForEvents) {
                w.HistoricalEvents.checkForEvents(s);
            }
            if (w.AwardsSystem && w.AwardsSystem.shouldTriggerOscars && w.AwardsSystem.shouldTriggerOscars(s)) {
                w.AwardsSystem.triggerOscarCeremony(s);
            }
            const fin = w.FinancialSystem;
            if (fin) {
                const fn = fin.processMonthlyLoans || fin.processMonthlyFinances;
                if (fn) fn(s);
            }
        } catch (err) {
            recordError('monthlyPipeline@' + s.gameYear, err);
        }
    }

    const game = {
        window: w,
        errors,
        seed,
        fidelity,

        get state() {
            return w.HollywoodMogul.getGameState();
        },

        tickWeek() {
            const monthBefore = this.state.currentDate.getMonth();
            try {
                w.HollywoodMogul.advanceTime('week');
            } catch (err) {
                recordError('tickWeek@' + this.state.gameYear, err);
            }
            if (fidelity === 'patched' && !this.state.gameEnded &&
                this.state.currentDate.getMonth() !== monthBefore) {
                runMonthlyPipeline();
            }
        },

        /** Scripts a player could actually option right now. */
        availableScripts() {
            return (this.state.availableScripts || []).filter(s => s.available !== false && !s.optioned);
        },

        /**
         * Greenlight via the canonical path (Integration → censorship →
         * ProductionSystem). When the Hays evaluation raises a modal, the
         * sim auto-approves — exactly what the modal's proceed button does.
         * Returns the film if production started.
         */
        greenlight(script) {
            const before = this.state.activeFilms.length;
            try {
                if (w.Integration && w.Integration.handleScriptGreenlight) {
                    w.Integration.handleScriptGreenlight(script.id);
                    if (this.state.activeFilms.length === before &&
                        w.Integration.completeIntegrationGreenlight) {
                        w.Integration.completeIntegrationGreenlight();
                    }
                } else {
                    w.ScriptLibrary.greenlightScript(script.id);
                }
            } catch (err) {
                recordError('greenlight:' + script.title, err);
            }
            const films = this.state.activeFilms;
            return films.length > before ? films[films.length - 1] : null;
        },

        /** Finished films waiting on a distribution decision. */
        pendingReleases() {
            return (this.state.completedFilms || []).filter(f =>
                f.phase === 'COMPLETED' && !f.inTheaters && !f.distributionStrategy);
        },

        /**
         * Release through the one distribution executor,
         * BoxOfficeSystem.releaseFilm — the same call the dashboard's
         * strategy buttons make. Legacy names map: sell → states_rights.
         */
        release(film, strategy) {
            const map = { sell: 'states_rights', wide: 'wide', limited: 'limited' };
            try {
                return w.BoxOfficeSystem.releaseFilm(film.id, map[strategy] || strategy);
            } catch (err) {
                recordError('release:' + film.title, err);
                return { success: false };
            }
        },

        /**
         * Take a loan through FinancialSystem.submitLoanApplication, which
         * reads its amount from a #loan-amount input — inject one, as the
         * loan modal would.
         */
        takeLoan(loanKey, amount) {
            try {
                const s = this.state;
                if (!s.finances && w.FinancialSystem.initializeFinancialSystem) {
                    w.FinancialSystem.initializeFinancialSystem(s);
                }
                let slider = w.document.getElementById('loan-amount');
                if (!slider) {
                    slider = w.document.createElement('input');
                    slider.id = 'loan-amount';
                    w.document.body.appendChild(slider);
                }
                slider.value = String(amount);
                const before = s.cash;
                w.FinancialSystem.submitLoanApplication(loanKey);
                return this.state.cash > before;
            } catch (err) {
                recordError('takeLoan:' + loanKey, err);
                return false;
            }
        },

        outstandingDebt() {
            const fin = this.state.finances;
            if (!fin || !fin.loans) return 0;
            return fin.loans.reduce((sum, l) => sum + (l.remainingBalance || 0), 0);
        },

        snapshot() {
            const s = this.state;
            return {
                year: s.gameYear,
                month: s.currentDate.getMonth() + 1,
                week: s.gameWeek,
                cash: s.cash,
                debt: this.outstandingDebt(),
                reputation: s.reputation,
                activeFilms: s.activeFilms.length,
                inTheaters: (s.completedFilms || []).filter(f => f.inTheaters).length,
                filmsProduced: s.stats.filmsProduced,
                totalRevenue: s.totalRevenue,
                totalExpenses: s.totalExpenses,
                gameEnded: s.gameEnded,
                endingType: s.endingType,
                scriptsAvailable: (s.availableScripts || []).filter(sc => sc.available !== false && !sc.optioned).length,
            };
        },

        /** Released-film ROI ledger for the summary (reads both the legacy
         *  fields and BoxOfficeSystem.releaseFilm's film.distribution shape). */
        filmLedger() {
            return (this.state.completedFilms || []).map(f => {
                const dist = f.distribution || {};
                const box = dist.boxOfficeResults || {};
                return {
                    title: f.title,
                    genre: f.genre,
                    year: f.releaseDate ? new Date(f.releaseDate).getFullYear() : null,
                    budget: f.originalBudget,
                    marketing: f.marketingBudget || dist.marketingCost || 0,
                    revenue: f.studioRevenue || dist.totalRevenue || box.totalStudioRevenue || 0,
                    quality: f.finalQuality,
                    strategy: f.distributionStrategy || dist.strategy || null,
                };
            });
        },
    };

    return game;
}

module.exports = { createGame, mulberry32 };
