/**
 * HOLLYWOOD MOGUL - AUDIO SYSTEM
 * Period-appropriate music and immersive sound effects for the golden age of Hollywood
 *
 * Features:
 * - Background music management with era transitions
 * - Sound effect triggers for game actions
 * - Separate volume controls for music and SFX
 * - Mute toggle with state persistence
 * - Cross-fade transitions between music tracks
 * - Web Audio API for procedural sounds
 */

window.AudioSystem = (function() {
    'use strict';

    // Audio State
    let audioState = {
        initialized: false,
        muted: false,
        masterVolume: 0.7,
        musicVolume: 0.5,
        sfxVolume: 0.8,
        currentTrack: null,
        currentEra: null,
        audioContext: null,
        musicEnabled: true,
        sfxEnabled: true
    };

    // Audio Elements Storage
    const audioElements = {
        music: {},
        sfx: {}
    };

    // Current playing elements
    let currentMusic = null;
    let nextMusic = null;
    let fadeInterval = null;

    /**
     * Audio library references
     * Replace these URLs with actual royalty-free music sources
     * Recommended sources: FreePD.com, Incompetech.com, Free Music Archive
     */
    const MUSIC_LIBRARY = {
        // Main Themes by Era
        'pre_code': {
            url: 'audio/music/1930s-jazz-theme.mp3', // 1933-1934: Upbeat jazz/swing
            description: '1930s Jazz & Swing - Pre-Code Era'
        },
        'code_era': {
            url: 'audio/music/1930s-orchestral.mp3', // 1934-1941: More refined orchestral
            description: '1930s Orchestral - Production Code Era'
        },
        'war_era': {
            url: 'audio/music/1940s-patriotic.mp3', // 1941-1945: Patriotic undertones
            description: '1940s Wartime Theme'
        },
        'post_war': {
            url: 'audio/music/1940s-optimistic.mp3', // 1945-1949: Optimistic post-war
            description: 'Late 1940s Post-War Theme'
        },

        // Context-Specific Music
        'tension': {
            url: 'audio/music/tension-low-finances.mp3',
            description: 'Tension Music - Low Finances'
        },
        'success': {
            url: 'audio/music/success-fanfare.mp3',
            description: 'Success Fanfare'
        },
        'crisis': {
            url: 'audio/music/crisis-dramatic.mp3',
            description: 'Crisis - Dramatic Decision Music'
        },
        'menu': {
            url: 'audio/music/menu-theme.mp3',
            description: 'Main Menu Theme'
        }
    };

    /**
     * Sound Effects Library
     * Many of these can be created with Web Audio API or short audio files
     */
    const SFX_LIBRARY = {
        // UI Sounds
        'button_click': {
            url: 'audio/sfx/art-deco-ding.mp3',
            description: 'Art Deco button click - soft "ding"'
        },
        'navigation': {
            url: 'audio/sfx/page-turn.mp3',
            description: 'Page turn sound for navigation'
        },

        // Production Sounds
        'greenlight': {
            url: 'audio/sfx/film-projector-start.mp3',
            description: 'Film projector starting up'
        },
        'camera_roll': {
            url: 'audio/sfx/camera-rolling.mp3',
            description: 'Camera rolling - "Action!"'
        },
        'typewriter': {
            url: 'audio/sfx/typewriter.mp3',
            description: 'Typewriter clacking'
        },
        'phone_ring': {
            url: 'audio/sfx/vintage-phone-ring.mp3',
            description: 'Vintage telephone ring'
        },

        // Time & Events
        'clock_tick': {
            url: 'audio/sfx/clock-tick.mp3',
            description: 'Clock ticking - week advance'
        },
        'calendar_flip': {
            url: 'audio/sfx/calendar-page.mp3',
            description: 'Calendar page flip - month advance'
        },

        // Financial Sounds
        'cash_register': {
            url: 'audio/sfx/cash-register.mp3',
            description: 'Vintage cash register - money transactions'
        },
        'coins': {
            url: 'audio/sfx/coins-clink.mp3',
            description: 'Coins clinking'
        },
        'money_positive': {
            url: 'audio/sfx/money-in.mp3',
            description: 'Positive transaction sound'
        },
        'money_negative': {
            url: 'audio/sfx/money-out.mp3',
            description: 'Negative transaction sound'
        },

        // Film Release & Box Office
        'film_release': {
            url: 'audio/sfx/crowd-cheer.mp3',
            description: 'Crowd cheering - film premiere'
        },
        'applause': {
            url: 'audio/sfx/theater-applause.mp3',
            description: 'Theater applause'
        },
        'marquee': {
            url: 'audio/sfx/neon-buzz.mp3',
            description: 'Theater marquee neon buzz'
        },

        // Achievement & Success
        'achievement': {
            url: 'audio/sfx/orchestra-hit.mp3',
            description: 'Orchestra hit - achievement unlocked'
        },
        'fanfare': {
            url: 'audio/sfx/trumpet-fanfare.mp3',
            description: 'Trumpet fanfare - major success'
        },

        // Alerts & Warnings
        'alert_info': {
            url: 'audio/sfx/notification-soft.mp3',
            description: 'Soft notification chime'
        },
        'alert_warning': {
            url: 'audio/sfx/warning-bell.mp3',
            description: 'Warning bell'
        },
        'alert_critical': {
            url: 'audio/sfx/alarm-urgent.mp3',
            description: 'Critical alert - urgent'
        }
    };

    /**
     * Initialize the audio system
     */
    function init() {
        if (audioState.initialized) return;

        console.log('Initializing Audio System...');

        // Create Web Audio Context
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioState.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }

        // Load audio preferences from localStorage
        loadAudioPreferences();

        // Preload critical audio files
        preloadAudio();

        // Set up UI event listeners
        bindAudioControls();

        audioState.initialized = true;
        console.log('Audio System initialized successfully');

        // Start with appropriate music based on game state
        if (audioState.musicEnabled && !audioState.muted) {
            playMenuMusic();
        }
    }

    /**
     * Load audio preferences from localStorage
     */
    function loadAudioPreferences() {
        try {
            const saved = localStorage.getItem('hollywoodMogul_audioPrefs');
            if (saved) {
                const prefs = JSON.parse(saved);
                audioState.muted = prefs.muted || false;
                audioState.masterVolume = prefs.masterVolume !== undefined ? prefs.masterVolume : 0.7;
                audioState.musicVolume = prefs.musicVolume !== undefined ? prefs.musicVolume : 0.5;
                audioState.sfxVolume = prefs.sfxVolume !== undefined ? prefs.sfxVolume : 0.8;
                audioState.musicEnabled = prefs.musicEnabled !== undefined ? prefs.musicEnabled : true;
                audioState.sfxEnabled = prefs.sfxEnabled !== undefined ? prefs.sfxEnabled : true;

                console.log('Loaded audio preferences:', prefs);
            }
        } catch (e) {
            console.warn('Could not load audio preferences', e);
        }
    }

    /**
     * Save audio preferences to localStorage
     */
    function saveAudioPreferences() {
        try {
            const prefs = {
                muted: audioState.muted,
                masterVolume: audioState.masterVolume,
                musicVolume: audioState.musicVolume,
                sfxVolume: audioState.sfxVolume,
                musicEnabled: audioState.musicEnabled,
                sfxEnabled: audioState.sfxEnabled
            };
            localStorage.setItem('hollywoodMogul_audioPrefs', JSON.stringify(prefs));
        } catch (e) {
            console.warn('Could not save audio preferences', e);
        }
    }

    /**
     * Preload critical audio files
     */
    function preloadAudio() {
        // Preload menu music and common SFX
        // In production, you would actually load the files here
        // For now, we'll just prepare the audio elements

        console.log('Audio files ready for loading');
        console.log('Music tracks:', Object.keys(MUSIC_LIBRARY));
        console.log('Sound effects:', Object.keys(SFX_LIBRARY));
    }

    /**
     * Bind audio control UI elements
     */
    function bindAudioControls() {
        // Mute toggle
        const muteBtn = document.getElementById('audio-mute-toggle');
        if (muteBtn) {
            muteBtn.addEventListener('click', toggleMute);
            updateMuteButton();
        }

        // Volume sliders
        const masterSlider = document.getElementById('audio-master-volume');
        const musicSlider = document.getElementById('audio-music-volume');
        const sfxSlider = document.getElementById('audio-sfx-volume');

        if (masterSlider) {
            masterSlider.value = audioState.masterVolume * 100;
            masterSlider.addEventListener('input', (e) => {
                setMasterVolume(e.target.value / 100);
            });
        }

        if (musicSlider) {
            musicSlider.value = audioState.musicVolume * 100;
            musicSlider.addEventListener('input', (e) => {
                setMusicVolume(e.target.value / 100);
            });
        }

        if (sfxSlider) {
            sfxSlider.value = audioState.sfxVolume * 100;
            sfxSlider.addEventListener('input', (e) => {
                setSFXVolume(e.target.value / 100);
            });
        }
    }

    /**
     * Play background music by track name
     */
    function playMusic(trackName, fadeInDuration = 2000) {
        if (!audioState.musicEnabled || audioState.muted) return;
        if (audioState.currentTrack === trackName && currentMusic) return;

        const track = MUSIC_LIBRARY[trackName];
        if (!track) {
            console.warn(`Music track not found: ${trackName}`);
            return;
        }

        console.log(`Playing music: ${track.description}`);

        // Create audio element if it doesn't exist
        if (!audioElements.music[trackName]) {
            const audio = new Audio(track.url);
            audio.loop = true;
            audio.volume = 0; // Start at 0 for fade in
            audioElements.music[trackName] = audio;
        }

        const newMusic = audioElements.music[trackName];

        // Handle crossfade
        if (currentMusic && currentMusic !== newMusic) {
            crossfadeMusic(currentMusic, newMusic, fadeInDuration);
        } else {
            newMusic.volume = 0;
            newMusic.play().catch(e => console.warn('Could not play music:', e));
            fadeInMusic(newMusic, fadeInDuration);
        }

        currentMusic = newMusic;
        audioState.currentTrack = trackName;
    }

    /**
     * Crossfade between two music tracks
     */
    function crossfadeMusic(oldMusic, newMusic, duration) {
        const steps = 50;
        const interval = duration / steps;
        let step = 0;

        const oldVolume = oldMusic.volume;
        const targetVolume = calculateMusicVolume();

        // Start new track
        newMusic.volume = 0;
        newMusic.play().catch(e => console.warn('Could not play music:', e));

        if (fadeInterval) clearInterval(fadeInterval);

        fadeInterval = setInterval(() => {
            step++;
            const progress = step / steps;

            // Fade out old track
            oldMusic.volume = oldVolume * (1 - progress);

            // Fade in new track
            newMusic.volume = targetVolume * progress;

            if (step >= steps) {
                clearInterval(fadeInterval);
                oldMusic.pause();
                oldMusic.currentTime = 0;
                newMusic.volume = targetVolume;
            }
        }, interval);
    }

    /**
     * Fade in music track
     */
    function fadeInMusic(music, duration) {
        const steps = 50;
        const interval = duration / steps;
        let step = 0;
        const targetVolume = calculateMusicVolume();

        if (fadeInterval) clearInterval(fadeInterval);

        fadeInterval = setInterval(() => {
            step++;
            music.volume = targetVolume * (step / steps);

            if (step >= steps) {
                clearInterval(fadeInterval);
                music.volume = targetVolume;
            }
        }, interval);
    }

    /**
     * Calculate actual music volume based on settings
     */
    function calculateMusicVolume() {
        return audioState.masterVolume * audioState.musicVolume;
    }

    /**
     * Calculate actual SFX volume based on settings
     */
    function calculateSFXVolume() {
        return audioState.masterVolume * audioState.sfxVolume;
    }

    /**
     * Play a sound effect
     */
    function playSFX(sfxName, volume = 1.0) {
        if (!audioState.sfxEnabled || audioState.muted) return;

        const sfx = SFX_LIBRARY[sfxName];
        if (!sfx) {
            // Try to generate procedural sound
            playProceduralSFX(sfxName);
            return;
        }

        // Create audio element if it doesn't exist
        if (!audioElements.sfx[sfxName]) {
            const audio = new Audio(sfx.url);
            audio.volume = calculateSFXVolume() * volume;
            audioElements.sfx[sfxName] = audio;
        }

        const sound = audioElements.sfx[sfxName].cloneNode();
        sound.volume = calculateSFXVolume() * volume;
        sound.play().catch(e => console.warn(`Could not play SFX ${sfxName}:`, e));
    }

    /**
     * Play procedural sound effect using Web Audio API
     */
    function playProceduralSFX(type) {
        if (!audioState.audioContext) return;

        const ctx = audioState.audioContext;
        const now = ctx.currentTime;

        switch(type) {
            case 'click':
                // Simple click sound
                const clickOsc = ctx.createOscillator();
                const clickGain = ctx.createGain();
                clickOsc.connect(clickGain);
                clickGain.connect(ctx.destination);

                clickOsc.frequency.value = 800;
                clickGain.gain.setValueAtTime(calculateSFXVolume() * 0.3, now);
                clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

                clickOsc.start(now);
                clickOsc.stop(now + 0.1);
                break;

            case 'ding':
                // Art deco ding
                const dingOsc = ctx.createOscillator();
                const dingGain = ctx.createGain();
                dingOsc.connect(dingGain);
                dingGain.connect(ctx.destination);

                dingOsc.frequency.setValueAtTime(1000, now);
                dingOsc.frequency.exponentialRampToValueAtTime(500, now + 0.3);
                dingGain.gain.setValueAtTime(calculateSFXVolume() * 0.5, now);
                dingGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

                dingOsc.start(now);
                dingOsc.stop(now + 0.3);
                break;

            case 'success':
                // Success sound (ascending notes)
                [400, 500, 600].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    const startTime = now + (i * 0.1);
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(calculateSFXVolume() * 0.3, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

                    osc.start(startTime);
                    osc.stop(startTime + 0.2);
                });
                break;

            case 'error':
                // Error sound (descending buzz)
                const errorOsc = ctx.createOscillator();
                const errorGain = ctx.createGain();
                errorOsc.connect(errorGain);
                errorGain.connect(ctx.destination);

                errorOsc.frequency.setValueAtTime(300, now);
                errorOsc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
                errorGain.gain.setValueAtTime(calculateSFXVolume() * 0.4, now);
                errorGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

                errorOsc.start(now);
                errorOsc.stop(now + 0.3);
                break;
        }
    }

    /**
     * Update music based on game state and era
     */
    function updateMusicForGameState(gameState) {
        if (!gameState) return;

        // Determine appropriate music based on game state
        const year = gameState.gameYear || 1933;
        const cash = gameState.cash || 0;
        const runway = window.HollywoodMogul ? window.HollywoodMogul.calculateRunwayWeeks() : 999;

        // Crisis music takes priority
        if (runway < 8 && cash < 100000) {
            if (audioState.currentTrack !== 'tension') {
                playMusic('tension', 1000);
            }
            return;
        }

        // Era-based music
        let eraTrack;
        if (year >= 1945) {
            eraTrack = 'post_war';
        } else if (year >= 1941) {
            eraTrack = 'war_era';
        } else if (year >= 1934) {
            eraTrack = 'code_era';
        } else {
            eraTrack = 'pre_code';
        }

        if (audioState.currentTrack !== eraTrack && audioState.currentEra !== eraTrack) {
            playMusic(eraTrack, 3000);
            audioState.currentEra = eraTrack;
        }
    }

    /**
     * Play menu/loading music
     */
    function playMenuMusic() {
        playMusic('menu', 2000);
    }

    /**
     * Stop all music
     */
    function stopMusic(fadeOutDuration = 1000) {
        if (!currentMusic) return;

        const steps = 30;
        const interval = fadeOutDuration / steps;
        let step = 0;
        const startVolume = currentMusic.volume;

        if (fadeInterval) clearInterval(fadeInterval);

        fadeInterval = setInterval(() => {
            step++;
            currentMusic.volume = startVolume * (1 - (step / steps));

            if (step >= steps) {
                clearInterval(fadeInterval);
                currentMusic.pause();
                currentMusic.currentTime = 0;
                currentMusic = null;
                audioState.currentTrack = null;
            }
        }, interval);
    }

    /**
     * Toggle mute
     */
    function toggleMute() {
        audioState.muted = !audioState.muted;

        if (audioState.muted) {
            if (currentMusic) currentMusic.volume = 0;
        } else {
            if (currentMusic) currentMusic.volume = calculateMusicVolume();
        }

        updateMuteButton();
        saveAudioPreferences();

        // Play feedback sound when unmuting
        if (!audioState.muted) {
            playProceduralSFX('ding');
        }
    }

    /**
     * Update mute button UI
     */
    function updateMuteButton() {
        const muteBtn = document.getElementById('audio-mute-toggle');
        if (!muteBtn) return;

        if (audioState.muted) {
            muteBtn.innerHTML = '🔇';
            muteBtn.setAttribute('title', 'Unmute Audio');
            muteBtn.classList.add('muted');
        } else {
            muteBtn.innerHTML = '🔊';
            muteBtn.setAttribute('title', 'Mute Audio');
            muteBtn.classList.remove('muted');
        }
    }

    /**
     * Set master volume
     */
    function setMasterVolume(volume) {
        audioState.masterVolume = Math.max(0, Math.min(1, volume));
        if (currentMusic) {
            currentMusic.volume = calculateMusicVolume();
        }
        saveAudioPreferences();
    }

    /**
     * Set music volume
     */
    function setMusicVolume(volume) {
        audioState.musicVolume = Math.max(0, Math.min(1, volume));
        if (currentMusic) {
            currentMusic.volume = calculateMusicVolume();
        }
        saveAudioPreferences();
    }

    /**
     * Set SFX volume
     */
    function setSFXVolume(volume) {
        audioState.sfxVolume = Math.max(0, Math.min(1, volume));
        saveAudioPreferences();
    }

    /**
     * Public API
     */
    return {
        // Initialization
        init,

        // Music controls
        playMusic,
        stopMusic,
        updateMusicForGameState,
        playMenuMusic,

        // Sound effects
        playSFX,
        playProceduralSFX,

        // Volume controls
        setMasterVolume,
        setMusicVolume,
        setSFXVolume,
        toggleMute,

        // State
        getState: () => audioState,
        isMuted: () => audioState.muted,

        // Audio libraries (for reference/documentation)
        getMusicLibrary: () => MUSIC_LIBRARY,
        getSFXLibrary: () => SFX_LIBRARY
    };
})();
