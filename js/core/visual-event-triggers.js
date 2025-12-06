/**
 * HOLLYWOOD MOGUL - VISUAL EVENT TRIGGERS
 * Helper functions to trigger visual events from game systems
 */

window.VisualEvents = (function() {
    'use strict';

    /**
     * Trigger film phase advancement animation
     */
    function triggerPhaseAdvancement(filmTitle, phaseName) {
        const event = new CustomEvent('filmPhaseAdvanced', {
            detail: { filmTitle, phaseName }
        });
        window.dispatchEvent(event);
    }

    /**
     * Trigger production event modal
     */
    function triggerProductionEvent(eventData, film) {
        const event = new CustomEvent('productionEventTriggered', {
            detail: { eventData, film }
        });
        window.dispatchEvent(event);
    }

    /**
     * Trigger weekly box office update animation
     */
    function triggerWeeklyBoxOfficeUpdate(filmTitle, weekNumber, grossRevenue, lastWeekRevenue, totalGross) {
        const event = new CustomEvent('weeklyBoxOfficeUpdate', {
            detail: { filmTitle, weekNumber, grossRevenue, lastWeekRevenue, totalGross }
        });
        window.dispatchEvent(event);
    }

    // Public API
    return {
        triggerPhaseAdvancement,
        triggerProductionEvent,
        triggerWeeklyBoxOfficeUpdate
    };
})();
