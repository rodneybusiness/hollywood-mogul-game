/**
 * HOLLYWOOD MOGUL - INLINE HANDLER COMPATIBILITY
 * Some embedding hosts serve the game under a CSP with script-src-attr 'none',
 * which silently refuses to compile onclick="..."/oninput="..." attributes and
 * leaves every generated button dead (first seen: scenario selection screen).
 * Every inline handler in the game is a single call of the form
 * Namespace.method(<literal args>), so a delegated listener can dispatch them
 * without eval. Inert in browsers that compiled the attribute natively.
 */

window.InlineHandlerCompat = (function () {
    'use strict';

    var CALL = /^\s*([A-Za-z_$][\w$]*)\.([\w$]+)\s*\(([\s\S]*)\)\s*;?\s*$/;

    function parseArgs(src, el) {
        var s = src.trim();
        if (!s) return [];
        // Top-level comma split; string literals never nest parens/commas here.
        var parts = s.match(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|[^,]+/g) || [];
        var args = [];
        for (var i = 0; i < parts.length; i++) {
            var p = parts[i].trim();
            if (!p) continue;
            if (p.charAt(0) === "'" || p.charAt(0) === '"') {
                args.push(p.slice(1, -1).replace(/\\(['"\\])/g, '$1'));
            } else if (p === 'this.value') {
                args.push(el ? el.value : undefined);
            } else if (p === 'true' || p === 'false') {
                args.push(p === 'true');
            } else if (p === 'null') {
                args.push(null);
            } else if (!isNaN(parseFloat(p))) {
                args.push(parseFloat(p));
            } else {
                return null; // unrecognized argument shape - refuse to dispatch
            }
        }
        return args;
    }

    /** Execute an inline-handler attribute on el. Returns true if dispatched. */
    function run(el, attr) {
        var code = el.getAttribute(attr);
        if (!code) return false;
        var m = CALL.exec(code);
        if (!m) return false;
        var ns = window[m[1]];
        var fn = ns && ns[m[2]];
        if (typeof fn !== 'function') return false;
        var args = parseArgs(m[3], el);
        if (args === null) return false;
        fn.apply(ns, args);
        return true;
    }

    document.addEventListener('click', function (e) {
        var t = e.target;
        var el = t && t.closest ? t.closest('[onclick]') : null;
        // If the attribute compiled into a real handler, the native path fired.
        if (!el || typeof el.onclick === 'function') return;
        run(el, 'onclick');
    }, false);

    document.addEventListener('input', function (e) {
        var el = e.target;
        if (!el || !el.getAttribute || typeof el.oninput === 'function') return;
        run(el, 'oninput');
    }, false);

    return { run: run, _parseArgs: parseArgs };
})();
