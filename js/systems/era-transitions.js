/**
 * HOLLYWOOD MOGUL - ERA TRANSITION SYSTEM
 * Full-screen modals for historical period changes
 */

window.EraTransitions = (function() {
    'use strict';

    // Era transition data with historical context
    const ERA_TRANSITIONS = {
        'PRE_CODE_to_GOLDEN_AGE': {
            title: 'The Hays Code Era Begins',
            subtitle: 'July 1934',
            description: 'The Motion Picture Production Code is now strictly enforced under Joseph Breen\'s Production Code Administration.',
            image: '🎭',
            whatChanges: [
                'All scripts now face strict moral censorship',
                'Crime cannot be glorified - criminals must be punished',
                'Sexual content and suggestive dialogue are banned',
                'Religious figures and institutions must be respected',
                'Profanity and vulgar expressions are forbidden'
            ],
            strategicTips: [
                'Focus on wholesome genres: musicals, westerns, screwball comedies',
                'Adapt risqué scripts to meet Code standards or abandon them',
                'Family-friendly content will dominate the box office',
                'Work with censors early to avoid costly reshoots'
            ],
            theme: 'golden-age'
        },

        'GOLDEN_AGE_to_WAR_YEARS': {
            title: 'America Enters World War II',
            subtitle: 'December 1941',
            description: 'The attack on Pearl Harbor transforms America and Hollywood. The nation mobilizes for total war.',
            image: '🎖️',
            whatChanges: [
                'Government actively seeks patriotic and propaganda films',
                'Male stars and crew are being drafted into military service',
                'Film stock and materials face wartime rationing',
                'War bond drives and patriotic content encouraged',
                'Escapist entertainment provides morale boost for home front'
            ],
            strategicTips: [
                'War films receive government support and subsidies',
                'Musicals and comedies help audiences escape wartime stress',
                'Women take leading roles as men go to war',
                'Partner with War Department for access to equipment',
                'Avoid anything that could be seen as unpatriotic'
            ],
            theme: 'war-years'
        },

        'WAR_YEARS_to_POST_WAR': {
            title: 'Victory and a Changed World',
            subtitle: 'September 1945',
            description: 'World War II has ended. America emerges victorious but changed, facing new uncertainties and anxieties.',
            image: '🕯️',
            whatChanges: [
                'Veterans return home struggling with adjustment',
                'Darker, more cynical films reflect postwar mood',
                'Film noir emerges as a major genre',
                'HUAC begins investigating "communist influence" in Hollywood',
                'Television threatens theatrical attendance'
            ],
            strategicTips: [
                'Film noir offers sophisticated adult entertainment',
                'Social problem films address postwar challenges',
                'Be cautious with political content - blacklisting looms',
                'Psychological dramas appeal to mature audiences',
                'Western genre remains a reliable safe bet'
            ],
            theme: 'post-war'
        }
    };

    /**
     * Show era transition modal
     */
    function showTransition(fromEra, toEra, year) {
        const transitionKey = `${fromEra}_to_${toEra}`;
        const transitionData = ERA_TRANSITIONS[transitionKey];

        if (!transitionData) {
            console.log(`No transition data for ${transitionKey}`);
            return;
        }

        createTransitionModal(transitionData);
    }

    /**
     * Create and display the transition modal
     */
    function createTransitionModal(data) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'era-transition-overlay';
        overlay.innerHTML = `
            <div class="era-transition-modal">
                <div class="era-transition-content">
                    <div class="era-icon">${data.image}</div>
                    <h1 class="era-title">${data.title}</h1>
                    <h2 class="era-subtitle">${data.subtitle}</h2>
                    <p class="era-description">${data.description}</p>

                    <div class="era-changes-section">
                        <h3>What Changes:</h3>
                        <ul class="era-changes-list">
                            ${data.whatChanges.map(change => `<li>${change}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="era-tips-section">
                        <h3>Strategic Tips:</h3>
                        <ul class="era-tips-list">
                            ${data.strategicTips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>

                    <button class="era-transition-btn" onclick="EraTransitions.closeTransition()">
                        Continue to ${data.title.split(' ')[0] === 'The' ? data.title.split(' ').slice(1, 3).join(' ') : data.title.split(' ')[0]}
                    </button>
                </div>
            </div>
        `;

        // Add styles if not already present
        addTransitionStyles();

        // Add to document
        document.body.appendChild(overlay);

        // Trigger fade-in animation
        setTimeout(() => {
            overlay.classList.add('visible');
        }, 10);

        // Add event to HollywoodMogul if it exists
        if (window.HollywoodMogul && typeof window.HollywoodMogul.addEvent === 'function') {
            window.HollywoodMogul.addEvent({
                type: 'historical',
                title: 'Era Change',
                message: data.title,
                severity: 'info'
            });
        }
    }

    /**
     * Close transition modal
     */
    function closeTransition() {
        const overlay = document.querySelector('.era-transition-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
            setTimeout(() => {
                overlay.remove();
            }, 500);
        }
    }

    /**
     * Add CSS styles for transitions
     */
    function addTransitionStyles() {
        // Check if styles already exist
        if (document.getElementById('era-transition-styles')) return;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'era-transition-styles';
        styleSheet.textContent = `
            .era-transition-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
            }

            .era-transition-overlay.visible {
                opacity: 1;
            }

            .era-transition-modal {
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                padding: 2rem;
                animation: eraSlideIn 0.8s ease-out;
            }

            @keyframes eraSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .era-transition-content {
                background: linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%);
                border: 3px solid var(--era-primary-gold, #B8860B);
                border-radius: 8px;
                padding: 3rem;
                text-align: center;
                box-shadow: 0 10px 50px rgba(0, 0, 0, 0.8), 0 0 100px rgba(184, 134, 11, 0.3);
            }

            .era-icon {
                font-size: 6rem;
                margin-bottom: 1rem;
                animation: eraIconPulse 2s ease-in-out infinite;
            }

            @keyframes eraIconPulse {
                0%, 100% {
                    transform: scale(1);
                    filter: brightness(1);
                }
                50% {
                    transform: scale(1.1);
                    filter: brightness(1.2);
                }
            }

            .era-title {
                font-family: var(--font-accent, 'Cinzel', serif);
                font-size: 3rem;
                color: var(--era-primary-gold, #B8860B);
                margin-bottom: 0.5rem;
                letter-spacing: 0.1em;
                text-shadow: 2px 2px 8px rgba(184, 134, 11, 0.5);
                line-height: 1.2;
            }

            .era-subtitle {
                font-family: var(--font-heading, 'Playfair Display', serif);
                font-size: 1.5rem;
                color: var(--era-secondary-gold, #DAA520);
                margin-bottom: 1.5rem;
                letter-spacing: 0.15em;
                text-transform: uppercase;
            }

            .era-description {
                font-family: var(--font-body, 'Lato', sans-serif);
                font-size: 1.25rem;
                color: var(--era-ivory, #FFFFF0);
                margin-bottom: 2.5rem;
                line-height: 1.6;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            }

            .era-changes-section,
            .era-tips-section {
                margin-bottom: 2rem;
                text-align: left;
            }

            .era-changes-section h3,
            .era-tips-section h3 {
                font-family: var(--font-accent, 'Cinzel', serif);
                font-size: 1.5rem;
                color: var(--era-primary-gold, #B8860B);
                margin-bottom: 1rem;
                text-align: center;
                letter-spacing: 0.1em;
            }

            .era-changes-list,
            .era-tips-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .era-changes-list li,
            .era-tips-list li {
                font-family: var(--font-body, 'Lato', sans-serif);
                font-size: 1.1rem;
                color: var(--era-ivory, #FFFFF0);
                margin-bottom: 0.75rem;
                padding-left: 2rem;
                position: relative;
                line-height: 1.5;
            }

            .era-changes-list li::before {
                content: '⚠️';
                position: absolute;
                left: 0;
                top: 0;
            }

            .era-tips-list li::before {
                content: '💡';
                position: absolute;
                left: 0;
                top: 0;
            }

            .era-transition-btn {
                font-family: var(--font-accent, 'Cinzel', serif);
                font-size: 1.25rem;
                font-weight: 600;
                padding: 1rem 3rem;
                margin-top: 2rem;
                border: 3px solid var(--era-primary-gold, #B8860B);
                border-radius: 4px;
                background: linear-gradient(135deg, var(--era-primary-gold, #B8860B) 0%, var(--era-secondary-gold, #DAA520) 100%);
                color: var(--primary-black, #0A0A0A);
                cursor: pointer;
                transition: all 0.3s ease;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                box-shadow: 0 4px 16px rgba(184, 134, 11, 0.4);
            }

            .era-transition-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 24px rgba(184, 134, 11, 0.6);
                background: linear-gradient(135deg, var(--era-secondary-gold, #DAA520) 0%, var(--era-primary-gold, #B8860B) 100%);
            }

            .era-transition-btn:active {
                transform: translateY(0);
            }

            /* Responsive design */
            @media (max-width: 768px) {
                .era-transition-modal {
                    padding: 1rem;
                }

                .era-transition-content {
                    padding: 2rem 1.5rem;
                }

                .era-title {
                    font-size: 2rem;
                }

                .era-subtitle {
                    font-size: 1.25rem;
                }

                .era-description {
                    font-size: 1rem;
                }

                .era-changes-list li,
                .era-tips-list li {
                    font-size: 1rem;
                }

                .era-icon {
                    font-size: 4rem;
                }
            }

            /* Scrollbar styling */
            .era-transition-modal::-webkit-scrollbar {
                width: 8px;
            }

            .era-transition-modal::-webkit-scrollbar-track {
                background: rgba(10, 10, 10, 0.5);
                border-radius: 4px;
            }

            .era-transition-modal::-webkit-scrollbar-thumb {
                background: var(--era-primary-gold, #B8860B);
                border-radius: 4px;
            }

            .era-transition-modal::-webkit-scrollbar-thumb:hover {
                background: var(--era-secondary-gold, #DAA520);
            }
        `;

        document.head.appendChild(styleSheet);
    }

    /**
     * Public API
     */
    return {
        showTransition,
        closeTransition
    };
})();
