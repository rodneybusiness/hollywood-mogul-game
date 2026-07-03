/**
 * @jest-environment node
 *
 * Phase 5 presentation verification (ROADMAP P5.2/P5.3/P5.4/P5.10).
 */

const fs = require('fs');
const { createGame } = require('./harness');

jest.setTimeout(120000);

describe('era score (P5.2 / AUDIO-005)', () => {
    test('the audio track agrees with the canonical era for every playable year', () => {
        const game = createGame({ seed: 41 });
        const w = game.window;
        const expected = {
            PRE_CODE: 'pre_code', GOLDEN_AGE: 'code_era', WAR_YEARS: 'war_era', POST_WAR: 'post_war',
        };
        for (let y = 1933; y <= 1949; y++) {
            const era = w.GameConstants.getEraKeyForYear(y);
            expect({ year: y, track: w.AudioSystem.getTrackForYear(y) })
                .toEqual({ year: y, track: expected[era] });
        }
    });

    test('every era track has a generative style and every SFX hook a synth spec', () => {
        const game = createGame({ seed: 42 });
        const w = game.window;
        // music: every track name reachable in 1933–49 + context tracks
        for (const t of ['menu', 'pre_code', 'code_era', 'war_era', 'post_war', 'tension', 'success', 'crisis']) {
            expect({ track: t, hasStyle: !!w.AudioSystem.MUSIC_STYLES[t] })
                .toEqual({ track: t, hasStyle: true });
        }
        // sfx: two-way coverage — the phantom 'newspaper' included (AUDIO-007)
        for (const s of ['greenlight', 'film_release', 'cash_register', 'money_positive',
            'money_negative', 'alert_warning', 'alert_info', 'alert_critical', 'achievement',
            'fanfare', 'applause', 'newspaper', 'clock_tick', 'calendar_flip', 'button_click',
            'typewriter', 'phone_ring', 'camera_roll', 'marquee', 'coins', 'navigation']) {
            expect({ sfx: s, hasSpec: !!w.AudioSystem.SFX_SPECS[s] })
                .toEqual({ sfx: s, hasSpec: true });
        }
    });
});

describe('first five minutes (P5.4 / SHIP-002)', () => {
    test('studio-name sanitization strips markup, collapses noise, never returns empty', () => {
        const game = createGame({ seed: 43 });
        const w = game.window;
        expect(w.MainMenu.sanitizeName('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
        expect(w.MainMenu.sanitizeName('   Grand   Illusion  Pictures   ')).toBe('Grand Illusion Pictures');
        expect(w.MainMenu.sanitizeName('')).toBe('Mogul Pictures');
        expect(w.MainMenu.sanitizeName('x'.repeat(100)).length).toBeLessThanOrEqual(28);
    });

    test('the fake 3-second loading wait is gone', () => {
        const game = createGame({ seed: 44 });
        expect(game.window.GameConstants.TIME.LOADING_SCREEN_DURATION_MS).toBeLessThanOrEqual(600);
    });
});

describe('ship hygiene (P5.10 / SHIP-001)', () => {
    test('no external requests: fonts are self-hosted and the CDN link is gone', () => {
        const html = fs.readFileSync('index.html', 'utf8');
        expect(html).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/);
        expect(html).toMatch(/css\/fonts\.css/);
        const fontCss = fs.readFileSync('css/fonts.css', 'utf8');
        const files = [...fontCss.matchAll(/url\('\.\.\/(assets\/fonts\/[^']+)'\)/g)].map(m => m[1]);
        expect(files.length).toBeGreaterThanOrEqual(6);
        for (const f of files) {
            expect({ file: f, exists: fs.existsSync(f) }).toEqual({ file: f, exists: true });
        }
    });
});
