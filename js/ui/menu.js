/**
 * HOLLYWOOD MOGUL - MAIN MENU
 * The first five minutes (ROADMAP P5.4, audit SHIP-002): title screen with
 * Continue / New Studio (with naming) / Load / Settings / Credits.
 * Self-contained overlay; leans on the design-token palette.
 */

window.MainMenu = (function () {
    'use strict';

    let overlay = null;
    let pendingName = null;

    function sanitizeName(raw) {
        // First real text input in the game (security.md): strip markup,
        // collapse whitespace, cap length, never empty.
        const clean = String(raw || '')
            .replace(/[<>&"'`]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 28);
        return clean || 'Mogul Pictures';
    }

    function el(tag, css, text) {
        const node = document.createElement(tag);
        if (css) node.style.cssText = css;
        if (text) node.textContent = text;
        return node;
    }

    function button(label, onClick, primary) {
        const b = el('button',
            'display:block;width:280px;margin:10px auto;padding:14px 0;cursor:pointer;' +
            'font-family:Cinzel,Georgia,serif;font-size:16px;letter-spacing:3px;' +
            (primary
                ? 'background:#c9a227;color:#1a1712;border:none;font-weight:bold;'
                : 'background:transparent;color:#f5e9d0;border:1px solid #8a7a55;'),
            label);
        b.addEventListener('click', onClick);
        return b;
    }

    function latestSaveSlot() {
        try {
            if (!window.SaveLoadSystem || !window.SaveLoadSystem.getSaveSlots) return null;
            const slots = window.SaveLoadSystem.getSaveSlots();
            const used = (slots || []).filter(s => s && !s.isEmpty && s.slot !== undefined);
            if (!used.length) return null;
            used.sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0));
            return used[0].slot;
        } catch (e) { return null; }
    }

    function show() {
        hide();
        overlay = el('div',
            'position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;' +
            'background:radial-gradient(ellipse at center, #241f16 0%, #12100b 75%);');
        overlay.id = 'main-menu';
        overlay.setAttribute('role', 'dialog');

        const panel = el('div', 'text-align:center;color:#f5e9d0;max-width:440px;padding:24px;');
        panel.appendChild(el('div', 'font-family:Cinzel,Georgia,serif;font-size:14px;letter-spacing:6px;color:#8a7a55;', 'A HOLLYWOOD STORY'));
        panel.appendChild(el('h1', 'font-family:"Playfair Display",Georgia,serif;font-size:64px;margin:8px 0 2px;color:#c9a227;letter-spacing:8px;', 'MOGUL'));
        panel.appendChild(el('div', 'font-family:Cinzel,Georgia,serif;font-size:13px;letter-spacing:4px;margin-bottom:28px;', '1933 – 1949 · THE GOLDEN AGE'));

        const cont = latestSaveSlot();
        if (cont !== null && window.SaveLoadSystem.loadGame) {
            panel.appendChild(button('CONTINUE', function () {
                const r = window.SaveLoadSystem.loadGame(cont);
                if (r && r.success && window.SaveLoadSystem.applyLoadedState) {
                    window.SaveLoadSystem.applyLoadedState(r.gameState);
                    hide();
                }
            }, true));
        }

        panel.appendChild(button('NEW STUDIO', showNaming, cont === null));

        panel.appendChild(button('LOAD GAME', function () {
            if (window.SaveLoadUI && window.SaveLoadUI.showLoadModal) {
                window.SaveLoadUI.showLoadModal();
            } else if (window.HollywoodMogul) {
                hide();
                window.HollywoodMogul.startNewGame();
            }
        }));

        panel.appendChild(button('SETTINGS', function () {
            const p = document.getElementById('audio-settings');
            if (p) p.classList.toggle('hidden');
        }));

        panel.appendChild(button('CREDITS', function () {
            alertBox('MOGUL', 'A historically grounded studio-management game.\nAll studio personnel are fictional; the history is real.');
        }));

        var version = (window.GameConstants && window.GameConstants.GAME_VERSION) || 'dev';
        panel.appendChild(el('div', 'margin-top:22px;font-size:11px;letter-spacing:2px;color:#8a7a55;', 'v' + version));

        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    function showNaming() {
        const panel = overlay.firstChild;
        panel.innerHTML = '';
        panel.appendChild(el('h2', 'font-family:Cinzel,Georgia,serif;letter-spacing:4px;color:#c9a227;margin-bottom:6px;', 'NAME YOUR STUDIO'));
        panel.appendChild(el('p', 'color:#b8a888;margin-bottom:18px;', 'Painted above the gate, printed on every one-sheet.'));

        const input = el('input',
            'display:block;width:280px;margin:0 auto 16px;padding:12px;text-align:center;' +
            'background:#1a1712;color:#f5e9d0;border:1px solid #8a7a55;font-family:Cinzel,Georgia,serif;' +
            'font-size:18px;letter-spacing:2px;');
        input.id = 'studio-name-input';
        input.maxLength = 28;
        input.value = 'Mogul Pictures';
        panel.appendChild(input);

        const start = button('FOUND THE STUDIO', function () {
            pendingName = sanitizeName(input.value);
            hide();
            if (window.HollywoodMogul) window.HollywoodMogul.startNewGame();
        }, true);
        panel.appendChild(start);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') start.click();
        });
        input.focus();
        input.select();
    }

    function alertBox(title, msg) {
        const panel = overlay.firstChild;
        const note = el('div', 'margin-top:14px;color:#b8a888;white-space:pre-line;font-size:14px;', title + '\n' + msg);
        panel.appendChild(note);
        setTimeout(function () { note.remove(); }, 6000);
    }

    function hide() {
        if (overlay) { overlay.remove(); overlay = null; }
    }

    // Apply the chosen studio name once the game actually starts
    if (window.EventBus) {
        window.EventBus.on('game:started', function () {
            hide(); // a game started by any path dismisses the menu
            if (!pendingName) return;
            const s = window.HollywoodMogul.getGameState();
            s.studioName = pendingName;
            const logo = document.querySelector('.studio-logo h1');
            if (logo) logo.textContent = pendingName.toUpperCase();
            pendingName = null;
        });
    }

    return { show: show, hide: hide, sanitizeName: sanitizeName };
})();
