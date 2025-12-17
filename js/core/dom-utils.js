/**
 * HOLLYWOOD MOGUL - SAFE DOM UTILITIES
 * Provides XSS-safe DOM manipulation methods
 * Use these instead of innerHTML where possible
 */

window.DOMUtils = (function() {
    'use strict';

    /**
     * Escape HTML entities to prevent XSS
     * @param {string} text - Raw text that may contain HTML
     * @returns {string} - Escaped safe string
     */
    function escapeHTML(text) {
        if (text === null || text === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    /**
     * Create an element with safe text content
     * @param {string} tag - HTML tag name
     * @param {Object} options - Element options
     * @param {string} options.text - Text content (escaped automatically)
     * @param {string} options.className - CSS class(es)
     * @param {string} options.id - Element ID
     * @param {Object} options.attrs - Additional attributes
     * @param {Array} options.children - Child elements to append
     * @returns {HTMLElement}
     */
    function createElement(tag, options = {}) {
        const element = document.createElement(tag);

        if (options.text !== undefined) {
            element.textContent = options.text;
        }

        if (options.className) {
            element.className = options.className;
        }

        if (options.id) {
            element.id = options.id;
        }

        if (options.attrs) {
            for (const [key, value] of Object.entries(options.attrs)) {
                element.setAttribute(key, value);
            }
        }

        if (options.children) {
            options.children.forEach(child => {
                if (child instanceof Node) {
                    element.appendChild(child);
                }
            });
        }

        if (options.onClick) {
            element.addEventListener('click', options.onClick);
        }

        return element;
    }

    /**
     * Safely set element content by clearing and appending children
     * @param {HTMLElement} parent - Parent element to populate
     * @param {Array<HTMLElement>} children - Child elements
     */
    function setChildren(parent, children) {
        parent.innerHTML = ''; // Clear existing content safely
        children.forEach(child => {
            if (child instanceof Node) {
                parent.appendChild(child);
            }
        });
    }

    /**
     * Create a text node
     * @param {string} text - Text content
     * @returns {Text}
     */
    function createText(text) {
        return document.createTextNode(String(text));
    }

    /**
     * Create an alert item element (common pattern in this codebase)
     * @param {Object} alert - Alert data
     * @returns {HTMLElement}
     */
    function createAlertItem(alert) {
        const item = createElement('div', {
            className: `alert-item ${alert.type || ''}`
        });

        const icon = createElement('div', {
            className: 'alert-icon',
            text: alert.icon || '!'
        });

        const text = createElement('div', {
            className: 'alert-text',
            text: alert.message || ''
        });

        item.appendChild(icon);
        item.appendChild(text);

        return item;
    }

    /**
     * Create a production item element
     * @param {Object} film - Film data
     * @returns {HTMLElement}
     */
    function createProductionItem(film) {
        const item = createElement('div', { className: 'production-item' });

        const title = createElement('h3', { text: film.title });
        const status = createElement('p', { text: `Status: ${film.status}` });
        const budget = createElement('p', {
            text: `Budget: $${(film.budget || 0).toLocaleString()}`
        });

        item.appendChild(title);
        item.appendChild(status);
        item.appendChild(budget);

        return item;
    }

    /**
     * Create a theater film item element
     * @param {Object} film - Film data
     * @returns {HTMLElement}
     */
    function createTheaterItem(film) {
        const item = createElement('div', { className: 'theater-item' });

        const title = createElement('h3', { text: film.title });
        const week = createElement('p', {
            text: `Week ${film.theaterWeek || 1} in theaters`
        });
        const revenue = createElement('p', {
            text: `This week: $${(film.weeklyRevenue || 0).toLocaleString()}`
        });

        item.appendChild(title);
        item.appendChild(week);
        item.appendChild(revenue);

        return item;
    }

    /**
     * Create a button element
     * @param {string} text - Button text
     * @param {string} className - CSS classes
     * @param {Function} onClick - Click handler
     * @returns {HTMLElement}
     */
    function createButton(text, className, onClick) {
        const button = createElement('button', {
            text: text,
            className: className
        });
        if (onClick) {
            button.addEventListener('click', onClick);
        }
        return button;
    }

    /**
     * Create a stat display row
     * @param {string} label - Label text
     * @param {string|number} value - Value to display
     * @returns {HTMLElement}
     */
    function createStatRow(label, value) {
        const row = createElement('p');
        row.appendChild(createText(`${label}: ${value}`));
        return row;
    }

    /**
     * Create a card element (common UI pattern)
     * @param {Object} options - Card options
     * @returns {HTMLElement}
     */
    function createCard(options = {}) {
        const card = createElement('div', { className: options.className || 'card' });

        if (options.title) {
            const title = createElement('h3', { text: options.title });
            card.appendChild(title);
        }

        if (options.content) {
            if (typeof options.content === 'string') {
                const p = createElement('p', { text: options.content });
                card.appendChild(p);
            } else if (options.content instanceof Node) {
                card.appendChild(options.content);
            }
        }

        return card;
    }

    /**
     * Safely update an element's text content
     * @param {string} elementId - Element ID
     * @param {string} text - New text content
     */
    function updateText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    /**
     * Safely update an element's content with children
     * @param {string} elementId - Element ID
     * @param {Array<HTMLElement>} children - Child elements
     */
    function updateContent(elementId, children) {
        const element = document.getElementById(elementId);
        if (element) {
            setChildren(element, children);
        }
    }

    // Public API
    return {
        escapeHTML,
        createElement,
        createText,
        setChildren,
        createAlertItem,
        createProductionItem,
        createTheaterItem,
        createButton,
        createStatRow,
        createCard,
        updateText,
        updateContent
    };
})();
