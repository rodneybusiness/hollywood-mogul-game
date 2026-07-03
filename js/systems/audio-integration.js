/**
 * HOLLYWOOD MOGUL - AUDIO INTEGRATION
 * Wires the audio system to the game through the EventBus.
 *
 * Rewritten for ROADMAP P5.2/P5.3 (audit AUDIO-006): the old version
 * polled cash every second, polled the era every five seconds, and
 * sniffed CSS classes with a MutationObserver. Now every sound comes
 * from a real game event, and all handles are lifecycle-safe.
 */

window.AudioIntegration = (function () {
    'use strict';

    let initialized = false;
    let busUnsubs = [];
    let clickHandler = null;

    function initAudioIntegration() {
        if (initialized) return;
        if (!window.AudioSystem) return;

        window.AudioSystem.init();
        subscribe();
        wireClicks();
        initialized = true;
    }

    function subscribe() {
        if (!window.EventBus) return;

        // Era transitions → score change the same tick as the era modal
        busUnsubs.push(window.EventBus.on('era:changed', function () {
            refreshMusic();
        }));

        // Game start → era score
        busUnsubs.push(window.EventBus.on('game:started', function () {
            refreshMusic();
        }));

        // Weekly tick → clock; also catches tension/crisis music transitions
        busUnsubs.push(window.EventBus.on('time:advanced', function () {
            window.AudioSystem.playSFX('clock_tick', 0.5);
            refreshMusic();
        }));

        busUnsubs.push(window.EventBus.on('month:processed', function () {
            window.AudioSystem.playSFX('calendar_flip', 0.7);
        }));

        // Money movement → register/coins by direction and size
        busUnsubs.push(window.EventBus.on('financial:updated', function (data) {
            if (!data || typeof data.change !== 'number' || data.change === 0) return;
            if (Math.abs(data.change) < 5000) return; // ignore pocket change
            window.AudioSystem.playSFX(data.change > 0 ? 'money_positive' : 'money_negative', 0.8);
        }));

        // A finished film wants a decision
        busUnsubs.push(window.EventBus.on('film:readyForDistribution', function () {
            window.AudioSystem.playSFX('phone_ring', 0.7);
        }));

        // Receivership drama
        busUnsubs.push(window.EventBus.on('financial:receivership', function () {
            window.AudioSystem.playSFX('alert_critical', 1.0);
        }));

        // Endgame sting
        busUnsubs.push(window.EventBus.on('game:ended', function (data) {
            window.AudioSystem.playSFX(
                data && data.type === 'survived' ? 'fanfare' : 'crisis', 1.0);
        }));
    }

    function wireClicks() {
        // One delegated listener replaces the old MutationObserver +
        // CSS-class sniffing. Buttons click; primary actions get their own
        // voice (the greenlight/release sounds of the feedback inventory).
        clickHandler = function (e) {
            const btn = e.target.closest ? e.target.closest('button') : null;
            if (!btn) return;
            if (btn.classList.contains('greenlight-btn')) {
                window.AudioSystem.playSFX('greenlight', 1.0);
            } else if (btn.classList.contains('strategy-btn') || btn.classList.contains('distribute-btn')) {
                window.AudioSystem.playSFX('film_release', 1.0);
            } else {
                window.AudioSystem.playSFX('button_click', 0.4);
            }
        };
        document.addEventListener('click', clickHandler);
    }

    function currentState() {
        return window.HollywoodMogul && window.HollywoodMogul.getGameState
            ? window.HollywoodMogul.getGameState() : null;
    }

    function refreshMusic() {
        const s = currentState();
        if (s && window.AudioSystem.updateMusicForGameState) {
            window.AudioSystem.updateMusicForGameState(s);
        }
    }

    function destroy() {
        busUnsubs.forEach(function (u) { try { u(); } catch (e) {} });
        busUnsubs = [];
        if (clickHandler) {
            document.removeEventListener('click', clickHandler);
            clickHandler = null;
        }
        initialized = false;
    }

    // Boot when the page is ready (idempotent)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAudioIntegration);
    } else {
        initAudioIntegration();
    }

    return {
        init: initAudioIntegration,
        destroy: destroy
    };
})();
