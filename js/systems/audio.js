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

    // No music/SFX asset files ship yet — every file request 404s (audit
    // AUDIO-004). Procedural WebAudio SFX still play. Flip this when real
    // assets land (build plan Phase 5).
    const FILE_AUDIO_ENABLED = false;

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
        'tv_threat': {
            url: 'audio/music/1950s-cinema.mp3', // 1950-1957: Widescreen spectacle
            description: '1950s Widescreen Cinema Theme'
        },
        'new_wave': {
            url: 'audio/music/1960s-revolution.mp3', // 1958-1966: Rebellious new wave
            description: '1960s New Wave Theme'
        },
        'ratings_era': {
            url: 'audio/music/1970s-gritty.mp3', // 1967-1974: Gritty new Hollywood
            description: '1970s Gritty Realism Theme'
        },
        'new_hollywood': {
            url: 'audio/music/1970s-epic.mp3', // 1975-1982: Epic blockbusters
            description: 'Late 1970s Blockbuster Theme'
        },
        'blockbuster_age': {
            url: 'audio/music/1980s-synth.mp3', // 1983-1993: Synth-driven blockbusters
            description: '1980s Blockbuster Age Theme'
        },
        'indie_boom': {
            url: 'audio/music/1990s-eclectic.mp3', // 1994-1999: Eclectic indie sound
            description: '1990s Indie Boom Theme'
        },
        'digital_dawn': {
            url: 'audio/music/2000s-digital.mp3', // 2000-2004: Digital transition
            description: '2000s Digital Era Theme'
        },
        'convergence': {
            url: 'audio/music/2000s-modern.mp3', // 2005-2010: Modern convergence
            description: '2000s Convergence Theme'
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


        // Create Web Audio Context
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioState.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }

        // Browsers create the context suspended until a user gesture;
        // without this, even procedural SFX are silent forever (audit
        // AUDIO-003). Resume once on the first interaction.
        function resumeAudioContext() {
            if (audioState.audioContext && audioState.audioContext.state === 'suspended') {
                audioState.audioContext.resume().catch(function () {});
            }
            document.removeEventListener('click', resumeAudioContext);
            document.removeEventListener('keydown', resumeAudioContext);
        }
        document.addEventListener('click', resumeAudioContext);
        document.addEventListener('keydown', resumeAudioContext);

        // Load audio preferences from localStorage
        loadAudioPreferences();

        // Preload critical audio files
        preloadAudio();

        // Set up UI event listeners
        bindAudioControls();

        audioState.initialized = true;

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


    // ================================================================
    // GENERATIVE PERIOD SCORE (ROADMAP P5.1, in-session form)
    // No licensed recordings ship yet, so the score is synthesized:
    // era-flavored generative loops (progression + bass + melody) through
    // WebAudio. Real recordings can replace this wholesale by setting
    // FILE_AUDIO_ENABLED = true and dropping files in audio/music/.
    // Volume/mute flow through the same audioState the sliders control.
    // ================================================================

    const MUSIC_STYLES = {
        menu:            { tempo: 88,  root: 261.63, minor: false, swing: 0.28, wave: 'triangle', progression: [0, 5, 3, 4] },
        pre_code:        { tempo: 138, root: 233.08, minor: false, swing: 0.33, wave: 'square',   progression: [0, 0, 3, 4] },
        code_era:        { tempo: 112, root: 261.63, minor: false, swing: 0.30, wave: 'triangle', progression: [0, 5, 1, 4] },
        war_era:         { tempo: 118, root: 196.00, minor: false, swing: 0.0,  wave: 'sawtooth', progression: [0, 3, 0, 4] },
        post_war:        { tempo: 74,  root: 220.00, minor: true,  swing: 0.2,  wave: 'sine',     progression: [0, 3, 4, 0] },
        tension:         { tempo: 60,  root: 174.61, minor: true,  swing: 0.0,  wave: 'sine',     progression: [0, 1, 0, 4] },
        success:         { tempo: 124, root: 293.66, minor: false, swing: 0.25, wave: 'triangle', progression: [0, 4, 5, 4] },
        crisis:          { tempo: 68,  root: 185.00, minor: true,  swing: 0.0,  wave: 'sine',     progression: [0, 1, 3, 1] },
        tv_threat:       { tempo: 104, root: 246.94, minor: false, swing: 0.25, wave: 'triangle', progression: [0, 5, 3, 4] },
        new_wave:        { tempo: 96,  root: 220.00, minor: true,  swing: 0.15, wave: 'triangle', progression: [0, 3, 5, 4] },
        ratings_era:     { tempo: 100, root: 220.00, minor: true,  swing: 0.1,  wave: 'sawtooth', progression: [0, 3, 4, 4] },
        new_hollywood:   { tempo: 92,  root: 233.08, minor: true,  swing: 0.1,  wave: 'sawtooth', progression: [0, 5, 3, 4] },
        blockbuster_age: { tempo: 128, root: 261.63, minor: false, swing: 0.0,  wave: 'sawtooth', progression: [0, 4, 5, 4] },
        indie_boom:      { tempo: 100, root: 246.94, minor: false, swing: 0.2,  wave: 'triangle', progression: [0, 5, 1, 4] },
        digital_dawn:    { tempo: 110, root: 261.63, minor: false, swing: 0.0,  wave: 'triangle', progression: [0, 5, 3, 4] },
        convergence:     { tempo: 116, root: 261.63, minor: false, swing: 0.0,  wave: 'sawtooth', progression: [0, 4, 5, 4] }
    };


    // Canonical year -> track mapping (audit AUDIO-005: the old hardcoded
    // thresholds disagreed with constants.js in 15 of 78 years - war music
    // a year early, etc.). Pure and exported so tests can pin it.
    const ERA_TRACK_MAP = {
        PRE_CODE: 'pre_code', GOLDEN_AGE: 'code_era', WAR_YEARS: 'war_era',
        POST_WAR: 'post_war', TV_THREAT: 'tv_threat', NEW_WAVE: 'new_wave',
        RATINGS_ERA: 'ratings_era', NEW_HOLLYWOOD: 'new_hollywood',
        BLOCKBUSTER_AGE: 'blockbuster_age', INDIE_BOOM: 'indie_boom',
        DIGITAL_DAWN: 'digital_dawn', CONVERGENCE: 'convergence'
    };

    function getTrackForYear(year) {
        if (window.GameConstants && window.GameConstants.getEraKeyForYear) {
            return ERA_TRACK_MAP[window.GameConstants.getEraKeyForYear(year)] || 'pre_code';
        }
        return 'pre_code';
    }

    let musicEngine = null; // { timer, gain, track }

    function scaleFreq(root, degree, minor) {
        const maj = [0, 2, 4, 5, 7, 9, 11];
        const min = [0, 2, 3, 5, 7, 8, 10];
        const steps = minor ? min : maj;
        const oct = Math.floor(degree / 7);
        const semis = steps[((degree % 7) + 7) % 7] + oct * 12;
        return root * Math.pow(2, semis / 12);
    }

    function stopProceduralMusic() {
        if (!musicEngine) return;
        clearInterval(musicEngine.timer);
        try { musicEngine.gain.disconnect(); } catch (e) {}
        musicEngine = null;
    }

    function startProceduralMusic(trackName) {
        const ctx = audioState.audioContext;
        const style = MUSIC_STYLES[trackName];
        if (!ctx || !style) return;
        if (musicEngine && musicEngine.track === trackName) return;
        stopProceduralMusic();

        const gain = ctx.createGain();
        gain.gain.value = calculateMusicVolume() * 0.5;
        gain.connect(ctx.destination);

        const beat = 60 / style.tempo;
        const barLen = beat * 4;
        let nextBar = ctx.currentTime + 0.1;
        let barIndex = 0;

        function note(freq, t, dur, wave, vol) {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = wave;
            o.frequency.value = freq;
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(vol, t + 0.02);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            o.connect(g); g.connect(gain);
            o.start(t); o.stop(t + dur + 0.05);
        }

        function scheduleBar() {
            if (!musicEngine) return;
            while (nextBar < ctx.currentTime + barLen * 2) {
                const t = nextBar;
                const chordDeg = style.progression[barIndex % style.progression.length];
                // bass: root on 1 and 3 (walking feel on swing styles)
                note(scaleFreq(style.root / 2, chordDeg, style.minor), t, beat * 0.9, 'sine', 0.5);
                note(scaleFreq(style.root / 2, chordDeg + (style.swing ? 2 : 0), style.minor), t + beat * 2, beat * 0.9, 'sine', 0.45);
                // chord pad: triad on beats 2 and 4
                for (const iv of [0, 2, 4]) {
                    note(scaleFreq(style.root, chordDeg + iv, style.minor), t + beat, beat * 0.6, 'triangle', 0.10);
                    note(scaleFreq(style.root, chordDeg + iv, style.minor), t + beat * 3, beat * 0.6, 'triangle', 0.10);
                }
                // melody: four gently random steps, swung
                for (let i = 0; i < 4; i++) {
                    const deg = chordDeg + [0, 2, 4, 5, 7][Math.floor(Math.random() * 5)];
                    const swingOff = (i % 2 === 1) ? beat * style.swing : 0;
                    note(scaleFreq(style.root * 2, deg, style.minor),
                        t + i * beat + swingOff, beat * 0.5, style.wave, 0.09);
                }
                nextBar += barLen;
                barIndex++;
            }
        }

        musicEngine = { timer: null, gain, track: trackName };
        scheduleBar();
        musicEngine.timer = setInterval(scheduleBar, Math.max(250, barLen * 500));
        audioState.currentTrack = trackName;
    }

    /** Live volume for the running generative score. */
    function refreshProceduralVolume() {
        if (musicEngine) {
            musicEngine.gain.gain.value = audioState.muted ? 0 : calculateMusicVolume() * 0.5;
        }
    }

    // Data-driven procedural SFX (P5.3: every hook makes a sound; the spec
    // is [freqStart, freqEnd, duration, wave, volume] per blip).
    const SFX_SPECS = {
        click:          [[800, 800, 0.08, 'square', 0.25]],
        button_click:   [[800, 800, 0.08, 'square', 0.25]],
        navigation:     [[600, 750, 0.09, 'square', 0.2]],
        ding:           [[880, 880, 0.4, 'sine', 0.3]],
        greenlight:     [[523, 784, 0.25, 'triangle', 0.35]],
        cash_register:  [[988, 988, 0.07, 'square', 0.3], [1319, 1319, 0.18, 'square', 0.3]],
        money_positive: [[659, 988, 0.2, 'triangle', 0.3]],
        money_negative: [[440, 220, 0.3, 'sawtooth', 0.25]],
        coins:          [[1175, 1175, 0.06, 'square', 0.25], [1568, 1568, 0.1, 'square', 0.22]],
        film_release:   [[523, 523, 0.12, 'triangle', 0.3], [659, 659, 0.12, 'triangle', 0.3], [784, 1047, 0.3, 'triangle', 0.35]],
        fanfare:        [[523, 523, 0.15, 'sawtooth', 0.25], [659, 659, 0.15, 'sawtooth', 0.25], [784, 784, 0.35, 'sawtooth', 0.3]],
        applause:       [[3000, 1500, 0.5, 'sawtooth', 0.08], [2600, 1400, 0.5, 'sawtooth', 0.08]],
        achievement:    [[784, 1175, 0.3, 'triangle', 0.35]],
        alert_warning:  [[554, 466, 0.25, 'square', 0.25]],
        alert_info:     [[698, 698, 0.15, 'sine', 0.22]],
        alert_critical: [[466, 466, 0.15, 'square', 0.3], [466, 466, 0.15, 'square', 0.3]],
        crisis:         [[311, 233, 0.5, 'sawtooth', 0.25]],
        newspaper:      [[1200, 400, 0.18, 'square', 0.18]],
        typewriter:     [[1400, 1400, 0.04, 'square', 0.2]],
        phone_ring:     [[880, 880, 0.12, 'sine', 0.25], [880, 880, 0.12, 'sine', 0.25]],
        clock_tick:     [[1000, 1000, 0.03, 'square', 0.18]],
        calendar_flip:  [[900, 500, 0.1, 'triangle', 0.2]],
        camera_roll:    [[700, 700, 0.05, 'square', 0.15], [700, 700, 0.05, 'square', 0.15], [700, 700, 0.05, 'square', 0.15]],
        marquee:        [[659, 1047, 0.35, 'triangle', 0.3]],
        success:        [[659, 988, 0.3, 'triangle', 0.3]],
        error:          [[300, 180, 0.3, 'sawtooth', 0.25]]
    };

    function playSpecSFX(name) {
        const ctx = audioState.audioContext;
        const spec = SFX_SPECS[name];
        if (!ctx || !spec) return false;
        let t = ctx.currentTime;
        for (const [f0, f1, dur, wave, vol] of spec) {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = wave;
            o.frequency.setValueAtTime(f0, t);
            if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
            g.gain.setValueAtTime(calculateSFXVolume() * vol, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            o.connect(g); g.connect(ctx.destination);
            o.start(t); o.stop(t + dur + 0.02);
            t += dur * 0.9;
        }
        return true;
    }

    /**
     * Play background music by track name
     */
    function playMusic(trackName, fadeInDuration = 2000) {
        if (!FILE_AUDIO_ENABLED) {
            // No licensed recordings ship yet - play the generative period
            // score instead of silence (audit AUDIO-001/SHIP-003).
            if (audioState.musicEnabled && !audioState.muted) {
                startProceduralMusic(trackName);
            }
            return;
        }
        if (!audioState.musicEnabled || audioState.muted) return;
        if (audioState.currentTrack === trackName && currentMusic) return;

        const track = MUSIC_LIBRARY[trackName];
        if (!track) {
            console.warn(`Music track not found: ${trackName}`);
            return;
        }


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
        if (!sfx || !FILE_AUDIO_ENABLED) {
            // No asset files shipped yet (audit AUDIO-004): every file
            // request 404s, so route everything through the procedural
            // WebAudio synth until real assets land (build plan Phase 5).
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
        if (playSpecSFX(type)) return; // data-driven synth covers every hook

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

        // Era-based music from the canonical era table (audit AUDIO-005)
        let eraTrack = getTrackForYear(year);

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

        // Era score
        getTrackForYear,
        MUSIC_STYLES,
        SFX_SPECS,

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
