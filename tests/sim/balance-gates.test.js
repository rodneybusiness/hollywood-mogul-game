/**
 * @jest-environment node
 *
 * Phase 3 balance gates (BUILD-PLAN §Definition of Sellable, ROADMAP P3.4).
 * These pin the tuned 1933–1949 economy with deterministic seeds:
 *
 *   - passivity is fatal, random play usually is;
 *   - cautious cheap-film play is viable but precarious (dies late if it dies);
 *   - skilled prestige play survives with real danger en route;
 *   - the loan exploit is survivable but never dominant;
 *   - no strategy is cash-unconstrained before the mid-1940s.
 *
 * If a balance change breaks one of these, that is the sim gate doing its
 * job — retune, don't delete the assertion.
 */

const { createGame, mulberry32 } = require('./harness');
const { strategies } = require('./strategies');

jest.setTimeout(300000);

const SEEDS = [1, 2, 3, 4, 5];
const UNCONSTRAINED = 10000000;

function runCampaign(strategyName, seed) {
    const game = createGame({ seed });
    const rng = mulberry32(seed * 7919 + 17);
    const strategy = strategies[strategyName];
    let unconstrainedYear = null;
    let minCash = Infinity;
    let weeks = 0;

    while (!game.state.gameEnded && weeks < 18 * 53) {
        strategy.actWeekly(game, rng);
        game.tickWeek();
        weeks++;
        const s = game.state;
        minCash = Math.min(minCash, s.cash);
        if (unconstrainedYear === null && s.cash >= UNCONSTRAINED) unconstrainedYear = s.gameYear;
    }

    return {
        survived: game.state.endingType === 'survived',
        deathYear: game.state.endingType === 'bankruptcy' ? game.state.gameYear : null,
        finalCash: game.state.cash,
        minCash,
        unconstrainedYear,
        errors: game.errors.length,
    };
}

describe('economy balance gates (1933–1949)', () => {
    const results = {};
    beforeAll(() => {
        for (const name of ['nothing', 'conservative', 'prestige', 'exploit', 'random']) {
            results[name] = SEEDS.map(seed => runCampaign(name, seed));
        }
    });

    test('no run produces errors', () => {
        for (const [name, runs] of Object.entries(results)) {
            expect({ name, errors: runs.map(r => r.errors) })
                .toEqual({ name, errors: [0, 0, 0, 0, 0] });
        }
    });

    test('doing nothing always loses, and quickly', () => {
        expect(results.nothing.filter(r => r.survived)).toHaveLength(0);
        for (const r of results.nothing) expect(r.deathYear).toBeLessThanOrEqual(1935);
    });

    test('random play usually loses', () => {
        expect(results.random.filter(r => r.survived).length).toBeLessThanOrEqual(1);
    });

    test('cautious play is viable but precarious: lives into the 1940s when it dies', () => {
        const survivors = results.conservative.filter(r => r.survived).length;
        expect(survivors).toBeGreaterThanOrEqual(1);
        const deaths = results.conservative.filter(r => !r.survived).map(r => r.deathYear).sort();
        if (deaths.length) {
            const median = deaths[Math.floor(deaths.length / 2)];
            expect(median).toBeGreaterThanOrEqual(1939);
        }
    });

    test('skilled prestige play survives to 1949 — with genuine danger en route', () => {
        expect(results.prestige.filter(r => r.survived).length).toBeGreaterThanOrEqual(4);
        const sweated = results.prestige.filter(r => r.minCash < 200000).length;
        expect(sweated).toBeGreaterThanOrEqual(3);
    });

    test('nobody is cash-unconstrained before the mid-1940s', () => {
        for (const runs of Object.values(results)) {
            for (const r of runs) {
                if (r.unconstrainedYear !== null) {
                    expect(r.unconstrainedYear).toBeGreaterThanOrEqual(1945);
                }
            }
        }
    });

    test('the mob-loan exploit is never the best line of play', () => {
        const exploitBest = Math.max(...results.exploit.map(r => r.finalCash));
        // Compare against the prestige MEDIAN: with per-run market variety
        // (P6.5) a prestige run can die to a bad opening market, and one
        // death must not vacuously pass/fail dominance.
        const sorted = results.prestige.map(r => r.finalCash).sort((a, b) => a - b);
        const prestigeMedian = sorted[Math.floor(sorted.length / 2)];
        expect(exploitBest).toBeLessThan(prestigeMedian);
        // and it lives on borrowed money the whole way
        for (const r of results.exploit) expect(r.minCash).toBeLessThan(-100000);
    });
});
