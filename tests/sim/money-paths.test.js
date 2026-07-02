/**
 * @jest-environment node
 *
 * Money-path exact-delta tests (ROADMAP P2.6, audit TEST-001/TEST-007).
 * Every assertion is an exact cash delta or an invariant — never a pinned
 * balance constant, so retuning numbers does not break these.
 */

const { createGame } = require('./harness');

jest.setTimeout(120000);

function freshGame(seed = 21) {
    return createGame({ seed });
}

describe('money paths: exact deltas', () => {
    test('greenlight deducts exactly the script budget through the canonical path', () => {
        const game = freshGame();
        const script = game.availableScripts()[0];
        const before = game.state.cash;
        const film = game.greenlight(script);
        expect(film).toBeTruthy();
        expect(game.state.cash).toBe(before - film.originalBudget);
        expect(film.originalBudget).toBe(script.budget);
    });

    test('sound stages cap concurrent productions; building a stage raises the cap (ECON-006)', () => {
        const game = freshGame(22);
        const w = game.window;
        game.state.cash = 10000000; // affordability out of the equation
        const cap = (game.state.soundStages || 1) * 2;

        let started = 0;
        for (const script of game.availableScripts().slice(0, cap)) {
            if (game.greenlight(script)) started++;
        }
        expect(started).toBe(cap);

        const blockedScript = game.availableScripts()[0];
        const result = w.ProductionSystem.greenlightScript(blockedScript.id);
        expect(result.success).toBe(false);
        expect(result.message).toMatch(/sound stage/i);

        game.state.soundStages += 1;
        const unblocked = w.ProductionSystem.greenlightScript(blockedScript.id);
        expect(unblocked.success).toBe(true);
    });

    test('wide release deducts exactly the era-scaled marketing cost it records', () => {
        const game = freshGame(23);
        const w = game.window;
        const script = game.availableScripts()[0];
        game.greenlight(script);
        let released = null;
        for (let i = 0; i < 60 && !released; i++) {
            game.tickWeek();
            const done = game.pendingReleases()[0];
            if (done) {
                const before = game.state.cash;
                const r = w.BoxOfficeSystem.releaseFilm(done.id, 'wide');
                expect(r.success).toBe(true);
                expect(game.state.cash).toBe(before - done.distribution.marketingCost);
                released = done;
            }
        }
        expect(released).toBeTruthy();
    });

    test('states-rights sale pays a quality-dependent fraction of budget (ECON-005)', () => {
        const game = freshGame(24);
        const w = game.window;
        const script = game.availableScripts()[0];
        game.greenlight(script);
        let sold = null;
        for (let i = 0; i < 60 && !sold; i++) {
            game.tickWeek();
            const done = game.pendingReleases()[0];
            if (done) {
                const before = game.state.cash;
                const r = w.BoxOfficeSystem.releaseFilm(done.id, 'states_rights');
                expect(r.success).toBe(true);
                const paid = game.state.cash - before;
                expect(paid).toBe(r.payment);
                // floor: never a windfall, never total loss
                expect(paid).toBeGreaterThanOrEqual(Math.floor(done.originalBudget * 0.45));
                expect(paid).toBeLessThanOrEqual(Math.ceil(done.originalBudget * 1.15));
                sold = done;
            }
        }
        expect(sold).toBeTruthy();
    });

    test('takeLoan credits exactly the amount and books mob favors (DESIGN-004)', () => {
        const game = freshGame(25);
        const w = game.window;
        const before = game.state.cash;
        const result = w.FinancialSystem.takeLoan('MOB', 500000);
        expect(result.success).toBe(true);
        expect(game.state.cash).toBe(before + 500000);
        expect(game.state.finances.loans).toHaveLength(1);
        expect(game.state.finances.mobFavorsOwed).toBe(Math.ceil(500000 / 100000));
    });

    test('monthly finance processing debits exactly interest + principal (ECON-004)', () => {
        const game = freshGame(26);
        const w = game.window;
        w.FinancialSystem.takeLoan('MOB', 400000);
        const loan = game.state.finances.loans[0];
        const expectedPrincipal = Math.min(loan.monthlyPrincipal, loan.remainingBalance);
        const expectedInterest = loan.remainingBalance * loan.interestRate;
        const before = game.state.cash;
        const repBefore = game.state.reputation;

        w.FinancialSystem.processMonthlyFinances(game.state);

        // Cash delta is exactly payments (mob favor collection touches
        // reputation/FBI heat, never cash). The system floors sub-dollar
        // amounts, so allow <$2 of rounding.
        expect(Math.abs((before - game.state.cash) - (expectedInterest + expectedPrincipal))).toBeLessThan(2);
        expect(loan.paymentsRemaining).toBe(loan.termMonths - 1);
        expect(game.state.reputation).toBeLessThanOrEqual(repBefore);
    });

    test('box-office ceiling is era-scaled: a 1948 prestige picture can out-gross 1.5x a $600k budget (DESIGN-002)', () => {
        const game = freshGame(27);
        const w = game.window;
        const s = game.state;
        s.currentDate = new w.Date(1948, 5, 1);
        s.gameYear = 1948;

        const film = {
            id: 'test_1948', title: 'Test Epic', genre: 'western',
            scriptQuality: 85, currentQuality: 85, finalQuality: 85,
            originalBudget: 600000, cast: [],
        };
        const potential = w.BoxOfficeSystem.calculateBaseBoxOffice(film, 'wide');
        expect(potential).toBeGreaterThan(600000 * 1.5);

        // And the hard clamp itself moved: a huge projection is bounded by
        // an era-scaled ceiling above the old fixed $900k.
        const run = w.BoxOfficeSystem.simulateWeeklyBoxOffice(film, 'wide', 10000000);
        expect(run.totalGross).toBeGreaterThan(900000);
    });

    test('receivership: insolvency is a window, not instant death (ECON-008)', () => {
        const game = freshGame(28);
        game.state.cash = -1000;
        game.tickWeek();
        expect(game.state.gameEnded).toBe(false);
        expect(game.state.receivership).toBeTruthy();

        // recover → window closes
        game.state.cash = 50000;
        game.tickWeek();
        expect(game.state.receivership).toBeFalsy();
        expect(game.state.gameEnded).toBe(false);

        // relapse and stay under → foreclosure
        game.state.cash = -1000;
        for (let i = 0; i < 12 && !game.state.gameEnded; i++) {
            game.state.cash = -1000;
            game.tickWeek();
        }
        expect(game.state.gameEnded).toBe(true);
        expect(game.state.endingType).toBe('bankruptcy');
    });

    test('campaign ends with a scored epilogue at Jan 1950 (P3.13/D1)', () => {
        const game = freshGame(29);
        game.state.currentDate = new game.window.Date(1949, 11, 15);
        game.state.gameYear = 1949;
        game.state.cash = 2000000;
        for (let i = 0; i < 6 && !game.state.gameEnded; i++) game.tickWeek();
        expect(game.state.gameEnded).toBe(true);
        expect(game.state.endingType).toBe('survived');
        expect(game.state.legacy).toBeTruthy();
        expect(game.state.legacy.score).toBeGreaterThan(0);
        expect(typeof game.state.legacy.tier).toBe('string');
    });
});
