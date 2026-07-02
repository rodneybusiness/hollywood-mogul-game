/**
 * Scripted player strategies for the economy simulation (AUDIT-PLAN.md §1).
 *
 * Each strategy exposes actWeekly(game, rng) and is called once per game-week
 * before the tick. rng is a dedicated seeded PRNG so strategy choices don't
 * perturb the game's own RNG stream.
 */

'use strict';

function cheapestAffordable(game, cushionWeeks) {
    const s = game.state;
    const cushion = (s.monthlyBurn / 4) * cushionWeeks;
    return game.availableScripts()
        .filter(sc => s.cash > sc.recommendedBudget + cushion)
        .sort((a, b) => a.recommendedBudget - b.recommendedBudget)[0] || null;
}

function bestQualityAffordable(game, cushionWeeks) {
    const s = game.state;
    const cushion = (s.monthlyBurn / 4) * cushionWeeks;
    return game.availableScripts()
        .filter(sc => s.cash > sc.recommendedBudget + cushion)
        .sort((a, b) => (b.quality || 0) - (a.quality || 0))[0] || null;
}

const strategies = {
    /** Does the game ever punish total inaction? */
    nothing: {
        description: 'Never acts. Measures whether passivity is survivable.',
        actWeekly() {},
    },

    /** Cheap films, one at a time, low-risk releases. */
    conservative: {
        description: 'One cheap film at a time, limited releases, sells bad films.',
        actWeekly(game) {
            for (const film of game.pendingReleases()) {
                game.release(film, (film.finalQuality || 0) < 40 ? 'sell' : 'limited');
            }
            if (game.state.activeFilms.length < 1) {
                const script = cheapestAffordable(game, 24);
                if (script) game.greenlight(script);
            }
        },
    },

    /** Big-budget quality pictures, wide releases. */
    prestige: {
        description: 'Highest-quality scripts affordable, up to two at once, always wide.',
        actWeekly(game) {
            for (const film of game.pendingReleases()) {
                game.release(film, 'wide');
            }
            if (game.state.activeFilms.length < 2) {
                const script = bestQualityAffordable(game, 12);
                if (script) game.greenlight(script);
            }
        },
    },

    /**
     * Probes known exploit candidates:
     *  - MOB loans (0% interest, no requirements) whenever cash is low —
     *    if loan payments never process, this is an infinite money printer.
     *  - Unlimited parallel productions (startProduction has no capacity check).
     *  - Sell-rights arbitrage: instant guaranteed payment on completion.
     */
    exploit: {
        description: 'Mob-loan cycling + unbounded parallel production + sell-rights arbitrage.',
        actWeekly(game) {
            const s = game.state;
            if (s.cash < 200000) {
                game.takeLoan('MOB', 1000000);
            }
            for (const film of game.pendingReleases()) {
                game.release(film, 'sell');
            }
            let guard = 8;
            while (s.activeFilms.length < 8 && guard-- > 0) {
                const script = cheapestAffordable(game, 0);
                if (!script) break;
                game.greenlight(script);
            }
        },
    },

    /** Noise baseline. */
    random: {
        description: 'Random affordable greenlights and random release strategies.',
        actWeekly(game, rng) {
            for (const film of game.pendingReleases()) {
                const pick = ['wide', 'limited', 'sell'][Math.floor(rng() * 3)];
                game.release(film, pick);
            }
            if (rng() < 0.3) {
                const scripts = game.availableScripts()
                    .filter(sc => game.state.cash > sc.recommendedBudget * 1.2);
                if (scripts.length) {
                    game.greenlight(scripts[Math.floor(rng() * scripts.length)]);
                }
            }
        },
    },
};

module.exports = { strategies };
