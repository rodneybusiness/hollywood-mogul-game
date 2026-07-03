/**
 * HOLLYWOOD MOGUL - RUN RNG
 * Deterministic per-run variety (ROADMAP P6.5): every campaign gets a
 * runSeed; systems derive stable per-key values from it so two campaigns
 * differ meaningfully while save/load and the sim harness stay reproducible
 * (save-scumming is bounded — re-rolling the same key gives the same answer).
 */

window.GameRNG = (function () {
    'use strict';

    function hashStr(str) {
        let h = 2166136261;
        for (let i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return h >>> 0;
    }

    function mulberry32(a) {
        a |= 0;
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    /** Uniform [0,1) for (seed, key) — stable across calls. */
    function forKey(seed, key) {
        return mulberry32(hashStr(String(seed) + ':' + key));
    }

    /** Integer in [min, max] inclusive for (seed, key). */
    function intInRange(seed, key, min, max) {
        return min + Math.floor(forKey(seed, key) * (max - min + 1));
    }

    return { forKey, intInRange, hashStr };
})();
