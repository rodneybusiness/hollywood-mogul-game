/**
 * Economy simulation runner (AUDIT-PLAN.md §1).
 *
 * Single run:
 *   node tests/sim/run.js --strategy prestige --seed 7 [--end 2010] [--fidelity browser|patched] [--monthly]
 * Full matrix (all strategies × seeds), summary table + JSON dump:
 *   node tests/sim/run.js --matrix [--seeds 10] [--end 2010] [--fidelity browser] [--out docs/audit/sim-results.json]
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { createGame, mulberry32 } = require('./harness');
const { strategies } = require('./strategies');

function parseArgs(argv) {
    const args = { strategy: 'nothing', seed: 1, end: 2010, fidelity: 'browser', matrix: false, seeds: 10, monthly: false, out: null };
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--matrix') args.matrix = true;
        else if (a === '--monthly') args.monthly = true;
        else if (a === '--strategy') args.strategy = argv[++i];
        else if (a === '--seed') args.seed = parseInt(argv[++i], 10);
        else if (a === '--seeds') args.seeds = parseInt(argv[++i], 10);
        else if (a === '--end') args.end = parseInt(argv[++i], 10);
        else if (a === '--fidelity') args.fidelity = argv[++i];
        else if (a === '--out') args.out = argv[++i];
    }
    return args;
}

const UNCONSTRAINED_CASH = 10000000; // $10M: budget stops being a real constraint

function runOne({ strategyName, seed, endYear, fidelity, monthly }) {
    const strategy = strategies[strategyName];
    if (!strategy) throw new Error('Unknown strategy: ' + strategyName + ' (have: ' + Object.keys(strategies).join(', ') + ')');

    const game = createGame({ seed, fidelity });
    const rng = mulberry32(seed * 7919 + 17);

    const monthlyLog = [];
    let lastMonthKey = '';
    let minCash = Infinity;
    let maxCash = -Infinity;
    let unconstrainedYear = null;
    let weeks = 0;
    const MAX_WEEKS = (endYear - 1933 + 1) * 53;

    while (!game.state.gameEnded && game.state.gameYear < endYear && weeks < MAX_WEEKS) {
        strategy.actWeekly(game, rng);
        game.tickWeek();
        weeks++;

        const s = game.state;
        minCash = Math.min(minCash, s.cash);
        maxCash = Math.max(maxCash, s.cash);
        if (unconstrainedYear === null && s.cash >= UNCONSTRAINED_CASH) unconstrainedYear = s.gameYear;

        const key = s.gameYear + '-' + s.currentDate.getMonth();
        if (key !== lastMonthKey) {
            lastMonthKey = key;
            monthlyLog.push(game.snapshot());
        }
    }

    const snap = game.snapshot();
    const ledger = game.filmLedger();
    const released = ledger.filter(f => f.revenue > 0 || f.strategy);
    const spent = released.reduce((t, f) => t + f.budget + f.marketing, 0);
    const earned = released.reduce((t, f) => t + f.revenue, 0);

    const summary = {
        strategy: strategyName,
        seed,
        fidelity,
        weeksSimulated: weeks,
        endYear: snap.year,
        gameEnded: snap.gameEnded,
        endingType: snap.endingType,
        finalCash: snap.cash,
        finalDebt: snap.debt,
        minCash,
        maxCash,
        unconstrainedYear,
        filmsProduced: snap.filmsProduced,
        filmsReleased: released.length,
        totalFilmSpend: spent,
        totalFilmRevenue: earned,
        aggregateROI: spent > 0 ? +(earned / spent).toFixed(2) : null,
        errorCount: game.errors.length,
        errorSample: game.errors.slice(0, 5),
    };

    return { summary, monthlyLog: monthly ? monthlyLog : undefined, ledger };
}

function fmtMoney(n) {
    if (n === null || n === undefined) return '-';
    const abs = Math.abs(n);
    const s = abs >= 1e9 ? (n / 1e9).toFixed(1) + 'B' : abs >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : abs >= 1e3 ? (n / 1e3).toFixed(0) + 'k' : String(n);
    return '$' + s;
}

function main() {
    const args = parseArgs(process.argv);

    if (!args.matrix) {
        const result = runOne({ strategyName: args.strategy, seed: args.seed, endYear: args.end, fidelity: args.fidelity, monthly: args.monthly });
        console.log(JSON.stringify(result, null, 2));
        return;
    }

    const names = Object.keys(strategies);
    const rows = [];
    for (const name of names) {
        for (let seed = 1; seed <= args.seeds; seed++) {
            const t0 = Date.now();
            const { summary } = runOne({ strategyName: name, seed, endYear: args.end, fidelity: args.fidelity, monthly: false });
            summary.wallMs = Date.now() - t0;
            rows.push(summary);
            console.error(`done ${name} seed=${seed} endYear=${summary.endYear} ending=${summary.endingType} cash=${fmtMoney(summary.finalCash)} films=${summary.filmsReleased} errs=${summary.errorCount} (${summary.wallMs}ms)`);
        }
    }

    console.log('\nstrategy      | seed | ending      | end yr | final cash | min cash  | uncstr yr | films | ROI  | errs');
    console.log('--------------|------|-------------|--------|------------|-----------|-----------|-------|------|-----');
    for (const r of rows) {
        console.log([
            r.strategy.padEnd(13),
            String(r.seed).padEnd(4),
            String(r.endingType || 'running').padEnd(11),
            String(r.endYear).padEnd(6),
            fmtMoney(r.finalCash).padEnd(10),
            fmtMoney(r.minCash).padEnd(9),
            String(r.unconstrainedYear || '-').padEnd(9),
            String(r.filmsReleased).padEnd(5),
            String(r.aggregateROI === null ? '-' : r.aggregateROI).padEnd(4),
            String(r.errorCount),
        ].join(' | '));
    }

    if (args.out) {
        const outPath = path.resolve(process.cwd(), args.out);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, JSON.stringify({ generatedFor: 'AUDIT-PLAN §1', fidelity: args.fidelity, endYear: args.end, runs: rows }, null, 2));
        console.error('\nwrote ' + outPath);
    }
}

main();
