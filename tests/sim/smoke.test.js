/**
 * @jest-environment node
 *
 * Guards the simulation harness itself (not game balance — see README.md).
 * The harness creates its own jsdom window, so this suite runs in the node
 * environment (jsdom-in-jsdom breaks whatwg-url). If module load order,
 * boot, or the tick pipeline breaks, this fails fast.
 */

const { createGame } = require('./harness');
const { strategies } = require('./strategies');

describe('sim harness', () => {
    test('boots the full game headlessly', () => {
        const game = createGame({ seed: 1 });
        const s = game.snapshot();
        expect(s.year).toBe(1933);
        expect(s.cash).toBeGreaterThan(0);
        expect(game.availableScripts().length).toBeGreaterThan(0);
        // No module should fail to load (init-time console.errors are game
        // bugs tracked by the audit; load failures are harness breakage).
        const loadFailures = game.errors.filter(e => e.where.startsWith('load:'));
        expect(loadFailures).toEqual([]);
    });

    test('advances a full game-year deterministically', () => {
        const a = createGame({ seed: 42 });
        const b = createGame({ seed: 42 });
        for (let i = 0; i < 52; i++) {
            a.tickWeek();
            b.tickWeek();
        }
        expect(a.snapshot()).toEqual(b.snapshot());
        // The shipped game may end (bankruptcy) before week 52 — see
        // docs/audit/ECON.md — so only assert time actually advanced.
        expect(a.snapshot().week).toBeGreaterThan(1);
    });

    test('strategies can act without throwing harness errors', () => {
        for (const name of Object.keys(strategies)) {
            const game = createGame({ seed: 7, fidelity: 'patched' });
            const rng = () => 0.5;
            for (let i = 0; i < 26 && !game.state.gameEnded; i++) {
                strategies[name].actWeekly(game, rng);
                game.tickWeek();
            }
            const harnessErrors = game.errors.filter(e =>
                e.where.startsWith('tickWeek') ||
                e.where.startsWith('greenlight') ||
                e.where.startsWith('release'));
            expect({ strategy: name, harnessErrors }).toEqual({ strategy: name, harnessErrors: [] });
        }
    });
});
