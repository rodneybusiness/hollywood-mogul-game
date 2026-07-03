/**
 * GameDialogs: non-blocking confirm. Sandboxed embeds return false from
 * window.confirm() without showing anything, so confirm-gated actions must
 * go through an in-page dialog instead — and nothing in js/ may call the
 * blocking primitives at all.
 */

const fs = require('fs');
const path = require('path');

describe('GameDialogs.confirm', () => {
    beforeAll(() => {
        require('../js/ui/dialogs.js');
    });

    afterEach(() => {
        window.GameDialogs.close();
        document.body.innerHTML = '';
    });

    test('renders the message and fires onConfirm', () => {
        const onConfirm = jest.fn();
        window.GameDialogs.confirm('Sell the backlot?', onConfirm);
        const modal = document.getElementById('game-confirm-modal');
        expect(modal.textContent).toMatch(/Sell the backlot\?/);
        [...modal.querySelectorAll('button')].find(b => b.textContent === 'CONFIRM').click();
        expect(onConfirm).toHaveBeenCalled();
        expect(document.getElementById('game-confirm-modal')).toBeNull();
    });

    test('cancel and backdrop click fire onCancel, never onConfirm', () => {
        const onConfirm = jest.fn();
        const onCancel = jest.fn();
        window.GameDialogs.confirm('Enable Ironman?', onConfirm, onCancel);
        [...document.querySelectorAll('#game-confirm-modal button')]
            .find(b => b.textContent === 'CANCEL').click();
        expect(onCancel).toHaveBeenCalledTimes(1);

        window.GameDialogs.confirm('Enable Ironman?', onConfirm, onCancel);
        const modal = document.getElementById('game-confirm-modal');
        modal.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(onCancel).toHaveBeenCalledTimes(2);
        expect(onConfirm).not.toHaveBeenCalled();
    });

    test('custom labels and danger styling apply', () => {
        window.GameDialogs.confirm('Delete everything?', null, null,
            { title: 'LAST WARNING', confirmLabel: 'DELETE EVERYTHING', danger: true });
        const modal = document.getElementById('game-confirm-modal');
        expect(modal.querySelector('h2').textContent).toBe('LAST WARNING');
        const yes = [...modal.querySelectorAll('button')]
            .find(b => b.textContent === 'DELETE EVERYTHING');
        expect(yes.className).toMatch(/danger/);
    });
});

describe('no blocking dialogs in game code', () => {
    test('js/ never calls window.confirm/alert/prompt', () => {
        const offenders = [];
        const walk = dir => {
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                const p = path.join(dir, entry.name);
                if (entry.isDirectory()) { walk(p); continue; }
                if (!entry.name.endsWith('.js')) continue;
                const src = fs.readFileSync(p, 'utf8')
                    .replace(/\/\*[\s\S]*?\*\//g, '')
                    .replace(/\/\/.*$/gm, '');
                // bare or window-qualified calls to the blocking primitives
                if (/(?<![\w.'"])(?:window\.)?(?:confirm|prompt)\s*\(/.test(src)) {
                    offenders.push(path.relative(process.cwd(), p));
                }
            }
        };
        walk(path.join(__dirname, '..', 'js'));
        expect(offenders).toEqual([]);
    });
});
