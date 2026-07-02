/**
 * @jest-environment node
 *
 * Save/load integration against the real, fully-booted game (CODE-007/008).
 * Plays 20 game-years with the prestige strategy, saves, wipes the live
 * state by starting a new game, loads, and asserts cash/debt/films survive.
 */

const { createGame } = require('./harness');
const { strategies } = require('./strategies');

jest.setTimeout(120000);

describe('save/load in a full game', () => {
    test('a 20-year prestige campaign survives save → wipe → load', () => {
        const game = createGame({ seed: 11, fidelity: 'patched' });
        const w = game.window;
        const rng = () => 0.5;

        for (let i = 0; i < 20 * 52 && !game.state.gameEnded; i++) {
            // The shipped economy bankrupts every strategy within ~3 years
            // (audit ECON findings; Phase 3 work) — float the studio with
            // loans so save/load can be exercised against a real 20-year
            // late-game state.
            if (game.state.cash < 300000) game.takeLoan('MOB', 1000000);
            strategies.prestige.actWeekly(game, rng);
            game.tickWeek();
        }

        // Ensure there is real debt on the books (the CODE-007 exploit was
        // that reloading erased it).
        game.takeLoan('MOB', 500000);

        const s = game.state;
        const before = {
            cash: s.cash,
            debt: game.outstandingDebt(),
            year: s.gameYear,
            week: s.gameWeek,
            completedFilms: (s.completedFilms || []).length,
            activeFilms: (s.activeFilms || []).length,
            filmsProduced: s.stats.filmsProduced,
            reputation: s.reputation,
            technologies: (s.technologies || []).length,
        };
        expect(before.year).toBeGreaterThan(1933);
        expect(before.debt).toBeGreaterThan(0);
        expect(before.completedFilms).toBeGreaterThan(0);

        const saveResult = w.SaveLoadSystem.saveGame(1, s);
        expect(saveResult.success).toBe(true);

        // Wipe: brand-new game replaces the state contents, then contaminate
        // the live object with a stale session key.
        w.HollywoodMogul.startNewGameWithScenario('classic_start');
        const live = w.HollywoodMogul.getGameState();
        live.__staleSessionKey = 'junk';
        expect(live.gameYear).toBe(1933);

        const loadResult = w.SaveLoadSystem.loadGame(1);
        expect(loadResult.success).toBe(true);

        const applied = w.SaveLoadSystem.applyLoadedState(loadResult.gameState);

        // Identity preserved: systems keep their references
        expect(applied).toBe(w.HollywoodMogul.getGameState());
        // Stale session state gone (CODE-008)
        expect(applied.__staleSessionKey).toBeUndefined();

        // The campaign came back intact (CODE-007)
        expect(applied.cash).toBe(before.cash);
        expect(game.outstandingDebt()).toBe(before.debt);
        expect(applied.gameYear).toBe(before.year);
        expect(applied.gameWeek).toBe(before.week);
        expect((applied.completedFilms || []).length).toBe(before.completedFilms);
        expect((applied.activeFilms || []).length).toBe(before.activeFilms);
        expect(applied.stats.filmsProduced).toBe(before.filmsProduced);
        expect(applied.reputation).toBe(before.reputation);
        expect((applied.technologies || []).length).toBe(before.technologies);

        // Dates revive as (the game window's) Date instances
        expect(applied.currentDate instanceof w.Date).toBe(true);
        expect(applied.currentDate.getFullYear()).toBe(before.year);

        // And the game keeps ticking from the restored point
        const yearBefore = applied.gameYear;
        game.tickWeek();
        expect(game.errors.filter(e => e.where.startsWith('tickWeek@' + yearBefore))).toEqual([]);
        expect(applied.gameWeek).toBe(before.week + 1);
    });
});
