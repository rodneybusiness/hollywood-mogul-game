/**
 * HOLLYWOOD MOGUL - GLOBAL ERROR BOUNDARY
 * Catches uncaught exceptions and promise rejections that would otherwise
 * leave the game half-ticked with no feedback (audit CODE-010), and shows a
 * recovery overlay: save-and-reload, or dismiss and keep playing.
 *
 * Loaded first in index.html so it observes every later script.
 */

window.ErrorBoundary = (function () {
    'use strict';

    // Release console gating (ROADMAP P7.1): informational logging is
    // silenced unless the player opts into debug mode
    // (localStorage.MOGUL_DEBUG = '1'). console.error stays live - the
    // boundary and bug reports depend on it.
    try {
        var debugOn = false;
        try { debugOn = window.localStorage && window.localStorage.getItem('MOGUL_DEBUG') === '1'; } catch (e) {}
        if (!debugOn) {
            var noop = function () {};
            console.log = noop;
            console.info = noop;
            console.debug = noop;
        }
    } catch (e) {}

    var recentErrors = [];
    var overlayVisible = false;
    var MAX_REPORTS = 20; // stop collecting after this many (avoid loops)

    function record(message, source, stack) {
        if (recentErrors.length >= MAX_REPORTS) return;
        recentErrors.push({
            message: String(message),
            source: source || '',
            stack: stack || '',
            at: new Date().toISOString()
        });
    }

    function buildOverlay(entry) {
        var overlay = document.createElement('div');
        overlay.id = 'error-boundary-overlay';
        overlay.setAttribute('role', 'alertdialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.style.cssText =
            'position:fixed;inset:0;z-index:99999;background:rgba(10,10,10,0.92);' +
            'display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;color:#f5e9d0;';

        var panel = document.createElement('div');
        panel.style.cssText =
            'max-width:560px;padding:32px;border:2px solid #c9a227;background:#1a1712;text-align:center;';

        var h = document.createElement('h2');
        h.textContent = 'FIRE ON THE BACKLOT!';
        h.style.cssText = 'margin:0 0 12px;letter-spacing:2px;color:#c9a227;';
        panel.appendChild(h);

        var p = document.createElement('p');
        p.textContent = 'Something went wrong behind the scenes. Your studio is safe — ' +
            'save your progress and reload, or press on at your own risk.';
        p.style.cssText = 'margin:0 0 16px;line-height:1.5;';
        panel.appendChild(p);

        var details = document.createElement('details');
        details.style.cssText = 'text-align:left;margin:0 0 20px;font-family:monospace;font-size:12px;color:#b8a888;';
        var summary = document.createElement('summary');
        summary.textContent = 'Technical details (for bug reports)';
        summary.style.cursor = 'pointer';
        details.appendChild(summary);
        var pre = document.createElement('pre');
        pre.style.cssText = 'white-space:pre-wrap;word-break:break-word;max-height:180px;overflow:auto;';
        pre.textContent = entry.message + '\n' + (entry.source || '') + '\n' + (entry.stack || '');
        details.appendChild(pre);
        panel.appendChild(details);

        var copyBtn = document.createElement('button');
        copyBtn.textContent = 'COPY BUG REPORT';
        copyBtn.style.cssText = 'margin:0 0 14px;padding:8px 14px;background:transparent;color:#b8ab8c;border:1px solid #8a7a55;cursor:pointer;font-size:12px;';
        copyBtn.addEventListener('click', function () {
            var version = (window.GameConstants && window.GameConstants.GAME_VERSION) || 'dev';
            var s = null;
            try { s = window.HollywoodMogul && window.HollywoodMogul.getGameState(); } catch (e) {}
            var report = 'MOGUL v' + version + ' bug report\n' +
                'When: ' + new Date().toISOString() + '\n' +
                (s ? 'Game: year ' + s.gameYear + ', week ' + s.gameWeek + ', cash ' + s.cash +
                    ', films ' + (s.stats && s.stats.filmsProduced) + ', scenario ' +
                    (s.scenario && s.scenario.id || 'classic') + '\n' : '') +
                'Error: ' + entry.message + '\n' + (entry.source || '') + '\n' + (entry.stack || '');
            try {
                if (navigator.clipboard) navigator.clipboard.writeText(report);
                copyBtn.textContent = 'COPIED — PASTE INTO A BUG REPORT';
            } catch (e) {
                copyBtn.textContent = 'SELECT THE DETAILS ABOVE TO COPY';
            }
        });
        panel.appendChild(copyBtn);

        var btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;gap:12px;justify-content:center;';

        var saveBtn = document.createElement('button');
        saveBtn.textContent = 'SAVE & RELOAD';
        saveBtn.style.cssText = 'padding:10px 18px;background:#c9a227;color:#1a1712;border:0;cursor:pointer;font-weight:bold;';
        saveBtn.addEventListener('click', function () {
            try {
                if (window.SaveLoadSystem && window.SaveLoadSystem.autoSave && window.HollywoodMogul) {
                    window.SaveLoadSystem.autoSave(window.HollywoodMogul.getGameState());
                }
            } catch (e) { /* the save itself may be what broke */ }
            window.location.reload();
        });
        btnRow.appendChild(saveBtn);

        var dismissBtn = document.createElement('button');
        dismissBtn.textContent = 'KEEP PLAYING';
        dismissBtn.style.cssText = 'padding:10px 18px;background:transparent;color:#f5e9d0;border:1px solid #f5e9d0;cursor:pointer;';
        dismissBtn.addEventListener('click', function () {
            overlay.remove();
            overlayVisible = false;
        });
        btnRow.appendChild(dismissBtn);

        panel.appendChild(btnRow);
        overlay.appendChild(panel);
        return overlay;
    }

    function show(entry) {
        if (overlayVisible || !document.body) return;
        overlayVisible = true;
        document.body.appendChild(buildOverlay(entry));
    }

    function handle(message, source, stack) {
        record(message, source, stack);
        show(recentErrors[recentErrors.length - 1]);
    }

    window.addEventListener('error', function (event) {
        // Ignore resource-load errors (missing images/audio report here too);
        // only real script errors have an error object or a message.
        if (event.error || (event.message && event.filename !== undefined)) {
            handle(event.message,
                (event.filename || '') + ':' + (event.lineno || 0),
                event.error && event.error.stack);
        }
    });

    window.addEventListener('unhandledrejection', function (event) {
        var reason = event.reason || {};
        handle(reason.message || String(reason), 'unhandled promise rejection', reason.stack);
    });

    return {
        /** Manually report a caught-but-serious error. */
        report: function (err, context) {
            handle((context ? context + ': ' : '') + (err && err.message || err), '', err && err.stack);
        },
        getRecentErrors: function () { return recentErrors.slice(); },
        _reset: function () { recentErrors = []; overlayVisible = false; }
    };
})();
