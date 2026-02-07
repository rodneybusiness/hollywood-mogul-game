/**
 * HOLLYWOOD MOGUL - EVENT BUS
 * Lightweight pub/sub system for decoupling game systems.
 * Any module can emit or listen for events without direct references.
 *
 * Usage:
 *   EventBus.on('financial:updated', (data) => updateUI(data));
 *   EventBus.emit('financial:updated', { cash: 500000 });
 *   const unsub = EventBus.on('time:advanced', handler);
 *   unsub(); // unsubscribe
 */

window.EventBus = (function() {
    'use strict';

    const listeners = {};

    /**
     * Subscribe to an event.
     * @param {string} event - Event name (use namespace:action convention)
     * @param {Function} callback - Handler function
     * @returns {Function} Unsubscribe function
     */
    function on(event, callback) {
        if (!listeners[event]) {
            listeners[event] = [];
        }
        listeners[event].push(callback);
        return function unsubscribe() {
            off(event, callback);
        };
    }

    /**
     * Subscribe to an event, but only fire once.
     * @param {string} event - Event name
     * @param {Function} callback - Handler function
     * @returns {Function} Unsubscribe function
     */
    function once(event, callback) {
        function wrapper(data) {
            off(event, wrapper);
            callback(data);
        }
        return on(event, wrapper);
    }

    /**
     * Unsubscribe from an event.
     * @param {string} event - Event name
     * @param {Function} callback - Handler to remove
     */
    function off(event, callback) {
        if (!listeners[event]) return;
        listeners[event] = listeners[event].filter(function(cb) {
            return cb !== callback;
        });
        if (listeners[event].length === 0) {
            delete listeners[event];
        }
    }

    /**
     * Emit an event to all subscribers.
     * @param {string} event - Event name
     * @param {*} data - Payload to pass to handlers
     */
    function emit(event, data) {
        if (!listeners[event]) return;
        // Copy array to prevent issues if a handler unsubscribes during iteration
        var handlers = listeners[event].slice();
        for (var i = 0; i < handlers.length; i++) {
            try {
                handlers[i](data);
            } catch (e) {
                console.error('EventBus error on "' + event + '":', e);
            }
        }
    }

    /**
     * Remove all listeners. Used during game reset/teardown.
     */
    function clear() {
        var keys = Object.keys(listeners);
        for (var i = 0; i < keys.length; i++) {
            delete listeners[keys[i]];
        }
    }

    /**
     * Get count of listeners for an event (useful for debugging).
     * @param {string} event - Event name (optional, returns all counts if omitted)
     * @returns {number|Object}
     */
    function listenerCount(event) {
        if (event) {
            return listeners[event] ? listeners[event].length : 0;
        }
        var counts = {};
        var keys = Object.keys(listeners);
        for (var i = 0; i < keys.length; i++) {
            counts[keys[i]] = listeners[keys[i]].length;
        }
        return counts;
    }

    return {
        on: on,
        once: once,
        off: off,
        emit: emit,
        clear: clear,
        listenerCount: listenerCount
    };
})();
