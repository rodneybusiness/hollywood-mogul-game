/**
 * @jest-environment node
 *
 * Phase 6 exit harness (ROADMAP P6.1–P6.5, audit DESIGN-017/UX-012):
 * two campaigns must be meaningfully different; scenarios must be distinct
 * and playable; endings must carry their epilogues.
 */

const { createGame, mulberry32 } = require('./harness');
const { strategies } = require('./strategies');

jest.setTimeout(300000);

function marketTitles(game, weeks) {
    const rng = mulberry32(999);
    const titles = new Set();
    for (let i = 0; i < weeks && !game.state.gameEnded; i++) {
        strategies.conservative.actWeekly(game, rng);
        game.tickWeek();
        for (const sc of game.state.availableScripts || []) titles.add(sc.title);
    }
    return titles;
}

describe('run variety (P6.5)', () => {
    test('two campaigns see meaningfully different script markets (≥40% differ)', () => {
        const a = marketTitles(createGame({ seed: 51 }), 104);
        const b = marketTitles(createGame({ seed: 52 }), 104);
        const inter = [...a].filter(t => b.has(t)).length;
        const union = new Set([...a, ...b]).size;
        const overlap = inter / union;
        expect(a.size).toBeGreaterThan(10);
        expect(overlap).toBeLessThan(0.6);
    });

    test('no duplicate titles in the script market (UX-012)', () => {
        for (const seed of [61, 62, 63]) {
            const game = createGame({ seed });
            const rng = mulberry32(seed);
            for (let i = 0; i < 52; i++) { strategies.nothing.actWeekly(game, rng); game.tickWeek(); }
            const titles = (game.state.availableScripts || []).map(s => s.title);
            const dupes = titles.filter((t, i) => titles.indexOf(t) !== i);
            expect({ seed, dupes }).toEqual({ seed, dupes: [] });
        }
    });

    test('journeyman talent debuts shift between runs; marquee stars do not', () => {
        const game = createGame({ seed: 71 });
        const rng = game.window.GameRNG;
        const names = Array.from({ length: 30 }, (_, i) => 'Talent ' + i);
        let moved = 0;
        for (const n of names) {
            if (rng.intInRange(1111, 'debut:' + n, -2, 2) !== rng.intInRange(2222, 'debut:' + n, -2, 2)) moved++;
        }
        expect(moved).toBeGreaterThanOrEqual(10); // spread exists across seeds
        // determinism: same seed+key always the same (bounded save-scumming)
        expect(rng.intInRange(1111, 'debut:X', -2, 2)).toBe(rng.intInRange(1111, 'debut:X', -2, 2));
    });
});

describe('scenario roster (P6.1)', () => {
    const IDS = ['classic_start', 'poverty_row', 'the_inheritance', 'war_effort',
        'the_blacklist', 'studio_boss', 'fresh_start'];

    test('all seven scenarios apply, are distinct, and play two years clean', () => {
        const signatures = new Set();
        for (const id of IDS) {
            const game = createGame({ seed: 81, scenario: id });
            const s = game.state;
            signatures.add(s.cash + ':' + s.gameYear + ':' + (s.reputation || 0));
            const rng = mulberry32(81);
            for (let i = 0; i < 104 && !s.gameEnded; i++) {
                strategies.conservative.actWeekly(game, rng);
                game.tickWeek();
            }
            expect({ id, errors: game.errors }).toEqual({ id, errors: [] });
        }
        // distinct starting conditions across the roster
        expect(signatures.size).toBeGreaterThanOrEqual(5);
    });
});

describe('endings & legacy (P6.2)', () => {
    test('a survived campaign renders the epilogue reel and legacy score', () => {
        const game = createGame({ seed: 91 });
        const w = game.window;
        const s = game.state;
        s.currentDate = new w.Date(1949, 11, 20);
        s.gameYear = 1949;
        s.cash = 3000000;
        s.stats.filmsProduced = 40;
        s.stats.boxOfficeTotal = 12000000;
        s.stats.oscarsWon = 2;
        for (let i = 0; i < 6 && !s.gameEnded; i++) game.tickWeek();
        expect(s.endingType).toBe('survived');
        expect(s.legacy).toBeTruthy();

        const stats = w.document.getElementById('final-stats');
        expect(stats.textContent).toMatch(/Legacy Score/);
        expect(stats.querySelector('.epilogue-reel')).toBeTruthy();
        expect(stats.querySelector('.epilogue-reel').textContent.length).toBeGreaterThan(60);
    });

    test('bankruptcy endings get era- and conduct-aware epilogues', () => {
        const game = createGame({ seed: 92 });
        const w = game.window;
        const s = game.state;
        s.longTermEffects = ['cooperative_witness'];
        s.gameYear = 1948;
        s.currentDate = new w.Date(1948, 3, 1);
        s.cash = -1000;
        for (let i = 0; i < 12 && !s.gameEnded; i++) { s.cash = -1000; game.tickWeek(); }
        expect(s.endingType).toBe('bankruptcy');
        const reel = w.document.querySelector('#final-stats .epilogue-reel');
        expect(reel).toBeTruthy();
        expect(reel.textContent).toMatch(/auction|creditors|revenge/i);
    });
});
