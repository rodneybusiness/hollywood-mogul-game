/**
 * HOLLYWOOD MOGUL - IN-GAME DIALOGS
 * Non-blocking replacement for window.confirm(). Sandboxed embeds (itch.io
 * iframes, artifact hosts) silently return false from confirm(), which made
 * every confirm-gated action a dead button. Uses the same modal classes as
 * the rest of the UI.
 */

window.GameDialogs = (function () {
    'use strict';

    var current = null;

    /**
     * Themed yes/no dialog. onConfirm/onCancel are optional callbacks.
     * opts: { title, confirmLabel, cancelLabel, danger }
     */
    function confirmDialog(message, onConfirm, onCancel, opts) {
        opts = opts || {};
        close();

        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'game-confirm-modal';
        overlay.setAttribute('role', 'alertdialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.style.zIndex = '10500'; // above tutorial overlays

        var content = document.createElement('div');
        content.className = 'modal-content confirm-modal';

        var header = document.createElement('div');
        header.className = 'modal-header';
        var h = document.createElement('h2');
        h.textContent = opts.title || 'ARE YOU SURE?';
        header.appendChild(h);
        content.appendChild(header);

        var body = document.createElement('div');
        body.className = 'modal-body';
        var p = document.createElement('p');
        p.className = 'confirm-message';
        p.textContent = message;
        body.appendChild(p);
        content.appendChild(body);

        var actions = document.createElement('div');
        actions.className = 'modal-actions';

        var yes = document.createElement('button');
        yes.className = 'action-btn ' + (opts.danger ? 'danger' : 'primary');
        yes.textContent = opts.confirmLabel || 'CONFIRM';
        yes.addEventListener('click', function () {
            close();
            if (onConfirm) onConfirm();
        });

        var no = document.createElement('button');
        no.className = 'action-btn secondary';
        no.textContent = opts.cancelLabel || 'CANCEL';
        no.addEventListener('click', function () {
            close();
            if (onCancel) onCancel();
        });

        actions.appendChild(yes);
        actions.appendChild(no);
        content.appendChild(actions);
        overlay.appendChild(content);

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                close();
                if (onCancel) onCancel();
            }
        });

        document.body.appendChild(overlay);
        current = overlay;
        yes.focus();
    }

    function close() {
        if (current) {
            current.remove();
            current = null;
        }
    }

    return { confirm: confirmDialog, close: close };
})();
