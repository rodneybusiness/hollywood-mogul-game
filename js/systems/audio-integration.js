/**
 * HOLLYWOOD MOGUL - AUDIO INTEGRATION
 * Connects audio system with game UI interactions
 */

(function() {
    'use strict';

    // Wait for audio system to be available
    function initAudioIntegration() {
        if (!window.AudioSystem) {
            console.warn('AudioSystem not available');
            return;
        }

        console.log('Initializing Audio Integration...');

        // Initialize the audio system
        window.AudioSystem.init();

        // Set up event listeners for audio triggers
        setupAudioTriggers();

        // Update volume displays when sliders change
        setupVolumeDisplays();

        console.log('Audio Integration complete');
    }

    /**
     * Set up audio trigger event listeners
     */
    function setupAudioTriggers() {
        // Use event delegation for better performance
        document.addEventListener('click', function(e) {
            const target = e.target;

            // Navigation buttons
            if (target.closest('.nav-button')) {
                window.AudioSystem.playSFX('navigation');
            }

            // Time advancement buttons
            if (target.matches('#btn-advance-week')) {
                window.AudioSystem.playSFX('clock_tick');
            }

            if (target.matches('#btn-advance-month')) {
                window.AudioSystem.playSFX('calendar_flip');
            }

            // Greenlight button
            if (target.matches('.greenlight-btn') && !target.disabled) {
                window.AudioSystem.playSFX('greenlight');
                setTimeout(() => {
                    window.AudioSystem.playSFX('cash_register');
                }, 200);
            }

            // Distribution button
            if (target.matches('.distribute-btn')) {
                window.AudioSystem.playProceduralSFX('click');
            }

            // Strategy selection
            if (target.matches('.strategy-btn') && !target.disabled) {
                window.AudioSystem.playSFX('film_release');
            }

            // Loan buttons
            if (target.matches('.loan-btn') && !target.disabled) {
                window.AudioSystem.playSFX('money_positive');
                setTimeout(() => {
                    window.AudioSystem.playSFX('cash_register');
                }, 150);
            }

            // General action buttons (fallback for any uncaught buttons)
            if ((target.matches('.action-btn') || target.matches('.cta-button') ||
                 target.matches('.time-btn') || target.matches('.utility-btn')) &&
                !target.disabled) {
                window.AudioSystem.playProceduralSFX('click');
            }

            // Modal close buttons
            if (target.matches('.modal-close')) {
                window.AudioSystem.playProceduralSFX('click');
            }

            // Audio settings toggle
            if (target.matches('#audio-settings-toggle')) {
                const panel = document.getElementById('audio-settings');
                if (panel) {
                    panel.classList.toggle('hidden');
                }
            }
        });

        // Listen for custom game events
        listenForGameEvents();
    }

    /**
     * Listen for custom game events and play appropriate audio
     */
    function listenForGameEvents() {
        // Create a MutationObserver to detect notifications
        const notificationsContainer = document.getElementById('notifications');
        if (notificationsContainer) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.classList) {
                            if (node.classList.contains('notification')) {
                                playNotificationSound(node);
                            }
                        }
                    });
                });
            });

            observer.observe(notificationsContainer, {
                childList: true,
                subtree: true
            });
        }

        // Listen for financial changes (via polling)
        let lastCash = null;
        setInterval(() => {
            if (window.HollywoodMogul) {
                const gameState = window.HollywoodMogul.getGameState();
                if (gameState && gameState.cash !== null) {
                    if (lastCash !== null && lastCash !== gameState.cash) {
                        // Cash changed
                        if (gameState.cash > lastCash) {
                            // Money received (box office, loan, etc.)
                            // Skip sound if it's a very small change
                            if (gameState.cash - lastCash > 1000) {
                                // Already played by specific action
                            }
                        } else if (gameState.cash < lastCash) {
                            // Money spent (production cost, expenses)
                            if (lastCash - gameState.cash > 10000) {
                                // Large expense
                                window.AudioSystem.playSFX('money_negative');
                            }
                        }
                    }
                    lastCash = gameState.cash;

                    // Update background music based on game state
                    window.AudioSystem.updateMusicForGameState(gameState);
                }
            }
        }, 5000); // Check every 5 seconds
    }

    /**
     * Play notification sound based on type
     */
    function playNotificationSound(notificationElement) {
        if (notificationElement.classList.contains('success')) {
            window.AudioSystem.playProceduralSFX('success');
        } else if (notificationElement.classList.contains('error')) {
            window.AudioSystem.playProceduralSFX('error');
        } else if (notificationElement.classList.contains('warning')) {
            window.AudioSystem.playSFX('alert_warning');
        } else {
            window.AudioSystem.playSFX('alert_info');
        }
    }

    /**
     * Set up volume display updates
     */
    function setupVolumeDisplays() {
        const masterSlider = document.getElementById('audio-master-volume');
        const musicSlider = document.getElementById('audio-music-volume');
        const sfxSlider = document.getElementById('audio-sfx-volume');

        const masterDisplay = document.getElementById('master-volume-display');
        const musicDisplay = document.getElementById('music-volume-display');
        const sfxDisplay = document.getElementById('sfx-volume-display');

        if (masterSlider && masterDisplay) {
            masterSlider.addEventListener('input', function() {
                masterDisplay.textContent = masterSlider.value + '%';
            });
        }

        if (musicSlider && musicDisplay) {
            musicSlider.addEventListener('input', function() {
                musicDisplay.textContent = musicSlider.value + '%';
            });
        }

        if (sfxSlider && sfxDisplay) {
            sfxSlider.addEventListener('input', function() {
                sfxDisplay.textContent = sfxSlider.value + '%';
                // Play a test sound when adjusting SFX volume
                window.AudioSystem.playProceduralSFX('ding');
            });
        }
    }

    /**
     * Enhance DashboardUI with audio methods if it exists
     */
    function enhanceDashboardUI() {
        if (window.DashboardUI) {
            // Store original showNotification if it exists
            const originalShowNotification = window.DashboardUI.showNotification;

            if (originalShowNotification) {
                window.DashboardUI.showNotification = function(title, message, type) {
                    // Play sound based on notification type
                    if (window.AudioSystem) {
                        switch(type) {
                            case 'success':
                                window.AudioSystem.playProceduralSFX('success');
                                break;
                            case 'error':
                                window.AudioSystem.playProceduralSFX('error');
                                break;
                            case 'warning':
                                window.AudioSystem.playSFX('alert_warning');
                                break;
                            default:
                                window.AudioSystem.playSFX('alert_info');
                        }
                    }

                    // Call original function
                    return originalShowNotification.call(this, title, message, type);
                };
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initAudioIntegration();
            enhanceDashboardUI();
        });
    } else {
        initAudioIntegration();
        enhanceDashboardUI();
    }
})();
