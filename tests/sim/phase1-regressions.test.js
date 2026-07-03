/**
 * @jest-environment node
 *
 * Phase 1 regression suite — every test here pins a fix for an S0 from
 * docs/AUDIT-REPORT.md against the full game booted headlessly.
 * If one of these fails, a stabilization fix has regressed.
 */

const { createGame } = require('./harness');

describe('Phase 1 stabilization regressions', () => {
    test('boots with zero init errors (crash quartet: CODE-003/004/005)', () => {
        const game = createGame({ seed: 11 });
        expect(game.errors).toEqual([]);
    });

    test('monthly overhead bills exactly once per calendar month (ECON-002)', () => {
        const game = createGame({ seed: 11 });
        let charges = 0;
        game.window.EventBus.on('financial:expenses', () => charges++);
        for (let i = 0; i < 48; i++) game.tickWeek(); // ~11 month boundaries
        expect(charges).toBeGreaterThanOrEqual(10);
        expect(charges).toBeLessThanOrEqual(12);
    });

    test('weekly play delivers new scripts and monthly events (ECON-003/CODE-001)', () => {
        const game = createGame({ seed: 11 });
        const initial = game.availableScripts().length;
        for (let i = 0; i < 26; i++) game.tickWeek();
        expect(game.availableScripts().length).toBeGreaterThan(initial);
    });

    test('advance-month progresses film production (CODE-001/UX-002)', () => {
        const game = createGame({ seed: 12 });
        const script = game.availableScripts()[0];
        game.greenlight(script);
        const film = game.state.activeFilms[0];
        const startPhase = film.phase;
        for (let i = 0; i < 4; i++) game.window.HollywoodMogul.advanceTime('month');
        const moved = film.phase !== startPhase || film.totalWeeks > 0;
        expect(moved).toBe(true);
    });

    test('EventBus subscriptions survive starting a new game (CODE-002)', () => {
        const game = createGame({ seed: 13 });
        let fired = 0;
        game.window.EventBus.on('month:processed', () => fired++);
        game.window.HollywoodMogul.startNewGameWithScenario('classic_start');
        for (let i = 0; i < 10; i++) game.tickWeek();
        expect(fired).toBeGreaterThan(0);
    });

    test('loan payments actually process: mob loans are no longer free money (ECON-004)', () => {
        const game = createGame({ seed: 14 });
        const took = game.takeLoan('MOB', 500000);
        expect(took).toBe(true);
        const debtBefore = game.outstandingDebt();
        for (let i = 0; i < 20; i++) game.tickWeek();
        // Repayment/consequences must be running: balance moves (or cash is
        // being drained by payments) instead of sitting inert forever.
        const state = game.state;
        const paymentsHappened = game.outstandingDebt() !== debtBefore ||
            (state.finances.loans[0] && state.finances.loans[0].paymentsRemaining <
                state.finances.loans[0].termMonths);
        expect(paymentsHappened).toBe(true);
    });

    test('the full loop closes: greenlight → produce → release → revenue (DESIGN-001)', () => {
        const game = createGame({ seed: 15 });
        const script = game.availableScripts()[0];
        expect(game.greenlight(script)).toBeTruthy();
        let revenue = 0;
        for (let i = 0; i < 60 && !revenue; i++) {
            game.tickWeek();
            const done = game.pendingReleases()[0];
            if (done) {
                const r = game.window.BoxOfficeSystem.releaseFilm(done.id, 'wide');
                expect(r.success).toBe(true);
            }
            const released = (game.state.completedFilms || [])
                .find(f => f.distribution && f.distribution.boxOfficeResults);
            if (released) revenue = released.distribution.boxOfficeResults.totalStudioRevenue;
        }
        expect(revenue).toBeGreaterThan(0);
    });

    test('dashboard renders through a full year without throwing (CODE-003/UX-001/UX-004)', () => {
        const game = createGame({ seed: 16 });
        game.greenlight(game.availableScripts()[0]);
        for (let i = 0; i < 52; i++) {
            game.tickWeek();
            game.window.DashboardUI.updateDashboard();
        }
        expect(game.errors).toEqual([]);
    });
});
