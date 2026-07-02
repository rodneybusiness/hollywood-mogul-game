/**
 * SaveLoadSystem v3 — save-corruption / data-loss defect coverage
 * (audit CODE-007, CODE-008, CODE-009, TEST-003; BUILD-PLAN-3.0 Phase 1).
 *
 * The shared tests/setup.js localStorage mock is non-functional (jest.fn()
 * returning undefined), so this file installs a real in-memory mock.
 */

describe('SaveLoadSystem v3', () => {
    let mockStorage;
    let originalLocalStorage;
    let addAlertMock;

    const STORAGE_KEY = 'hollywood-mogul-saves';
    const AUTO_SAVE_KEY = 'hollywood-mogul-autosave';
    const BACKUP_KEY = 'hollywood-mogul-backup';
    const IRONMAN_KEY = 'hollywood-mogul-ironman';

    beforeEach(() => {
        jest.resetModules();

        mockStorage = {};
        originalLocalStorage = window.localStorage;
        const mockLS = {
            getItem: jest.fn(function(key) {
                return Object.prototype.hasOwnProperty.call(mockStorage, key) ? mockStorage[key] : null;
            }),
            setItem: jest.fn(function(key, value) { mockStorage[key] = String(value); }),
            removeItem: jest.fn(function(key) { delete mockStorage[key]; }),
            clear: jest.fn(function() { mockStorage = {}; })
        };
        Object.defineProperty(window, 'localStorage', { value: mockLS, writable: true, configurable: true });

        addAlertMock = jest.fn();
        window.HollywoodMogul = {
            getGameState: jest.fn(),
            addAlert: addAlertMock
        };

        require('../js/core/constants.js');
        require('../js/core/save-load.js');
    });

    afterEach(() => {
        Object.defineProperty(window, 'localStorage', { value: originalLocalStorage, writable: true, configurable: true });
        delete window.HollywoodMogul;
        delete window.DashboardUI;
    });

    /**
     * A late-game state exercising every category CODE-007 dropped:
     * dated films, finances with loans, rivals, technologies, historical
     * event registry, Oscar history, scenario, crisis and wartime state.
     */
    function createLateGameState(overrides) {
        return Object.assign({
            currentDate: new Date(1947, 3, 12),
            gameWeek: 745,
            gameYear: 1947,
            cash: 2450000,
            monthlyBurn: 85000,
            totalRevenue: 12000000,
            totalExpenses: 9000000,
            studioName: 'Late Game Studios',
            reputation: 82,
            activeFilms: [{
                id: 'af1', title: 'Desert Winds', budget: 900000, quality: 71,
                phase: 'PRODUCTION', startDate: new Date(1947, 1, 3)
            }],
            completedFilms: [{
                id: 'cf1', title: 'City of Shadows', inTheaters: false,
                releaseDate: new Date(1946, 10, 21), studioRevenue: 1550000,
                boxOffice: { domestic: 3100000, weeklyGross: [400000, 350000, 220000] }
            }],
            contractPlayers: [{
                id: 'star1', name: 'Vivian Marsh', salary: 2000,
                contractEnd: new Date(1949, 0, 1)
            }],
            availableScripts: [{
                id: 'script1', title: 'The Long Night', genre: 'Noir',
                quality: 74, recommendedBudget: 400000, available: true, optioned: false
            }],
            currentEvents: [{ id: 1, type: 'info', message: 'A quiet week', timestamp: new Date(1947, 3, 5) }],
            events: [{ id: 'e1', headline: 'Studio expands', date: new Date(1946, 2, 1) }],
            soundStages: 4,
            backlots: { western: true, nyc: true, jungle: false },
            gameStarted: true,
            gameEnded: false,
            endingType: null,
            stats: { filmsProduced: 38, oscarsWon: 3, boxOfficeTotal: 41000000, scandalsHandled: 6, yearsSurvived: 14 },
            scenario: { id: 'classic_start', name: 'Classic Start' },
            technologies: [{ id: 'color_film', name: 'Technicolor', purchaseYear: 1939 }],
            franchises: [{ id: 'f1', name: 'The Falcon', filmCount: 3, audienceLoyalty: 0.8 }],
            studioLot: { facilities: [{ id: 'stage1', level: 2 }] },
            // ---- fields the v2 whitelist silently dropped (CODE-007) ----
            finances: {
                creditRating: 'B',
                loans: [{
                    id: 'loan1', type: 'BANK', principal: 500000, remainingBalance: 320000,
                    interestRate: 0.06, originationDate: new Date(1945, 6, 1)
                }]
            },
            rivalStudios: [{ id: 'rival1', name: 'Pinnacle Pictures', prestige: 77 }],
            competitionData: { marketShare: 0.18 },
            historicalEvents: { pearl_harbor: true, huac_hearings: true },
            oscarCeremonies: { 1946: { bestPicture: 'City of Shadows' } },
            wartime: false,
            warEndYear: 1945,
            blacklistRisk: 12,
            crises: [{ id: 'c1', type: 'scandal', resolved: true }],
            achievementsUnlocked: ['first_hit', 'oscar_winner'],
            maxBudget: 2000000,
            costMultiplier: 1.1
        }, overrides || {});
    }

    describe('full round-trip (CODE-007)', () => {
        test('a complex late-game state survives save → load deeply equal', () => {
            const state = createLateGameState();
            const saveResult = window.SaveLoadSystem.saveGame(1, state, 'Late Game');
            expect(saveResult.success).toBe(true);

            const loadResult = window.SaveLoadSystem.loadGame(1);
            expect(loadResult.success).toBe(true);
            expect(loadResult.gameState).toEqual(state);
        });

        test('loans and debt are not erased on reload (the exploit)', () => {
            const state = createLateGameState();
            window.SaveLoadSystem.saveGame(2, state);

            const restored = window.SaveLoadSystem.loadGame(2).gameState;
            expect(restored.finances.loans).toHaveLength(1);
            expect(restored.finances.loans[0].remainingBalance).toBe(320000);
        });

        test('triggered historical events and Oscar history persist', () => {
            const state = createLateGameState();
            window.SaveLoadSystem.saveGame(1, state);

            const restored = window.SaveLoadSystem.loadGame(1).gameState;
            expect(restored.historicalEvents).toEqual({ pearl_harbor: true, huac_hearings: true });
            expect(restored.oscarCeremonies['1946'].bestPicture).toBe('City of Shadows');
            expect(restored.rivalStudios[0].name).toBe('Pinnacle Pictures');
            expect(restored.scenario.id).toBe('classic_start');
            expect(restored.achievementsUnlocked).toEqual(['first_hit', 'oscar_winner']);
        });

        test('all nested dates revive as Date instances', () => {
            const state = createLateGameState();
            window.SaveLoadSystem.saveGame(1, state);

            const restored = window.SaveLoadSystem.loadGame(1).gameState;
            expect(restored.currentDate).toBeInstanceOf(Date);
            expect(restored.currentDate.getTime()).toBe(state.currentDate.getTime());
            expect(restored.activeFilms[0].startDate).toBeInstanceOf(Date);
            expect(restored.completedFilms[0].releaseDate).toBeInstanceOf(Date);
            expect(restored.finances.loans[0].originationDate).toBeInstanceOf(Date);
            expect(restored.contractPlayers[0].contractEnd).toBeInstanceOf(Date);
            expect(restored.currentEvents[0].timestamp).toBeInstanceOf(Date);
        });

        test('functions and circular references are dropped without breaking the save', () => {
            const state = createLateGameState();
            state.updateCallback = function() {};
            state.competitionData.self = state.competitionData; // cycle

            const saveResult = window.SaveLoadSystem.saveGame(1, state);
            expect(saveResult.success).toBe(true);

            const restored = window.SaveLoadSystem.loadGame(1).gameState;
            expect(restored.updateCallback).toBeUndefined();
            expect(restored.competitionData.marketShare).toBe(0.18);
            expect(restored.competitionData.self).toBeUndefined();
        });
    });

    describe('applyLoadedState (CODE-008)', () => {
        test('deletes stale keys and preserves live object identity', () => {
            const live = createLateGameState();
            live.junkFromCurrentSession = { debt: 999999 };
            live.anotherStaleKey = 'stale';
            window.HollywoodMogul.getGameState.mockReturnValue(live);

            const loaded = { currentDate: new Date(1934, 0, 1), gameYear: 1934, cash: 100 };
            const result = window.SaveLoadSystem.applyLoadedState(loaded);

            expect(result).toBe(live); // identity preserved for systems holding refs
            expect(live.junkFromCurrentSession).toBeUndefined();
            expect(live.anotherStaleKey).toBeUndefined();
            expect(live.finances).toBeUndefined(); // pre-load session field gone too
            expect(live.gameYear).toBe(1934);
            expect(live.cash).toBe(100);
        });

        test('returns the loaded state unchanged when no live state exists', () => {
            delete window.HollywoodMogul;
            const loaded = { gameYear: 1940 };
            expect(window.SaveLoadSystem.applyLoadedState(loaded)).toBe(loaded);
        });

        test('returns null for a null payload', () => {
            expect(window.SaveLoadSystem.applyLoadedState(null)).toBeNull();
        });
    });

    describe('v2 → v3 migration', () => {
        function createV2SaveData(overrides) {
            return Object.assign({
                version: '2.0',
                name: 'Old v2 Save',
                saveDate: new Date().toISOString(),
                currentDate: new Date(1941, 5, 10).toISOString(),
                gameDate: 'June 10, 1941',
                gameWeek: 440,
                gameYear: 1941,
                year: 1941,
                cash: 425000,
                monthlyBurn: 30000,
                totalRevenue: 900000,
                totalExpenses: 700000,
                studioName: 'Vintage Pictures',
                reputation: 61,
                soundStages: 2,
                backlots: { western: true, nyc: false, jungle: false },
                activeFilms: [{ id: 'v2f1', title: 'Old Film', budget: 100000 }],
                completedFilms: [],
                contractPlayers: [],
                availableScripts: [],
                currentEvents: [],
                events: [],
                technologies: null,
                franchises: null,
                gameStarted: true,
                gameEnded: false,
                endingType: null,
                stats: { filmsProduced: 9, oscarsWon: 1, boxOfficeTotal: 2500000, scandalsHandled: 2, yearsSurvived: 8 }
            }, overrides || {});
        }

        test('a v2 save loads with its data preserved and missing fields defaulted', () => {
            mockStorage[STORAGE_KEY] = JSON.stringify({ slot_1: createV2SaveData() });

            const result = window.SaveLoadSystem.loadGame(1);
            expect(result.success).toBe(true);

            const gs = result.gameState;
            // preserved v2 data
            expect(gs.cash).toBe(425000);
            expect(gs.studioName).toBe('Vintage Pictures');
            expect(gs.reputation).toBe(61);
            expect(gs.activeFilms).toHaveLength(1);
            expect(gs.currentDate).toBeInstanceOf(Date);
            expect(gs.currentDate.getFullYear()).toBe(1941);
            expect(gs.stats.filmsProduced).toBe(9);
            // fields missing/null in v2 filled with new-game defaults
            expect(gs.technologies).toEqual([]);
            expect(gs.franchises).toEqual([]);
            expect(gs.studioLot).toBeNull();
            expect(gs.scenario).toBeNull();
            expect(gs.events).toEqual([]);
        });

        test('a 1.x save (same flat shape) also migrates', () => {
            mockStorage[STORAGE_KEY] = JSON.stringify({
                slot_2: createV2SaveData({ version: '1.0', name: 'Ancient Save' })
            });

            const result = window.SaveLoadSystem.loadGame(2);
            expect(result.success).toBe(true);
            expect(result.gameState.cash).toBe(425000);
            expect(result.gameState.technologies).toEqual([]);
        });

        test('partial stats objects are merged with defaults', () => {
            mockStorage[STORAGE_KEY] = JSON.stringify({
                slot_1: createV2SaveData({ stats: { filmsProduced: 4 } })
            });

            const gs = window.SaveLoadSystem.loadGame(1).gameState;
            expect(gs.stats.filmsProduced).toBe(4);
            expect(gs.stats.oscarsWon).toBe(0);
            expect(gs.stats.yearsSurvived).toBe(0);
        });

        test('a v2 auto-save loads through the same migration', () => {
            mockStorage[AUTO_SAVE_KEY] = JSON.stringify(createV2SaveData({ name: 'Auto Save' }));

            const result = window.SaveLoadSystem.loadAutoSave();
            expect(result.success).toBe(true);
            expect(result.gameState.studioName).toBe('Vintage Pictures');
            expect(result.gameState.franchises).toEqual([]);
        });

        test('unknown future version fails with a clear message and corrupts nothing', () => {
            const futureSave = createV2SaveData({ version: '99.0', name: 'From The Future' });
            const rawBefore = JSON.stringify({ slot_1: futureSave });
            mockStorage[STORAGE_KEY] = rawBefore;

            const result = window.SaveLoadSystem.loadGame(1);
            expect(result.success).toBe(false);
            expect(result.message).toMatch(/version "99\.0" is not supported/);
            expect(mockStorage[STORAGE_KEY]).toBe(rawBefore); // untouched
        });

        test('a v3 save missing its state payload is rejected', () => {
            const broken = createV2SaveData({ version: '3.0' }); // v3 header, no `state`
            mockStorage[STORAGE_KEY] = JSON.stringify({ slot_1: broken });

            const result = window.SaveLoadSystem.loadGame(1);
            expect(result.success).toBe(false);
            expect(result.message).toMatch(/no game state payload/);
        });
    });

    describe('save-size pruning (CODE-009)', () => {
        test('optioned/unavailable scripts shrink to id stubs; live scripts keep full data', () => {
            const consumed = [];
            for (let i = 0; i < 100; i++) {
                consumed.push({
                    id: 'used_' + i, title: 'Used Script ' + i, available: false, optioned: true,
                    logline: 'x'.repeat(500), genre: 'Drama', quality: 60, recommendedBudget: 250000
                });
            }
            const state = createLateGameState({
                availableScripts: consumed.concat([{
                    id: 'live1', title: 'Fresh Script', available: true, optioned: false,
                    logline: 'A story', genre: 'Western', quality: 70, recommendedBudget: 300000
                }])
            });
            window.SaveLoadSystem.saveGame(1, state);

            const slot = JSON.parse(mockStorage[STORAGE_KEY]).slot_1;
            const savedScripts = slot.state.availableScripts;
            expect(savedScripts).toHaveLength(101);
            expect(savedScripts[0]).toEqual({ id: 'used_0', title: 'Used Script 0', available: false, optioned: true });
            expect(savedScripts[100].logline).toBe('A story');
            expect(savedScripts[100].quality).toBe(70);
            // the live state itself is never mutated by pruning
            expect(state.availableScripts[0].logline).toHaveLength(500);
        });

        test('events and alert history are capped to the most recent entries', () => {
            const events = [];
            for (let i = 0; i < 250; i++) events.push({ id: i, headline: 'Event ' + i });
            const alerts = [];
            for (let i = 0; i < 40; i++) alerts.push({ id: i, message: 'Alert ' + i });

            const state = createLateGameState({ events: events, currentEvents: alerts });
            window.SaveLoadSystem.saveGame(1, state);

            const saved = JSON.parse(mockStorage[STORAGE_KEY]).slot_1.state;
            expect(saved.events).toHaveLength(100);
            expect(saved.events[99].id).toBe(249); // most recent kept
            expect(saved.currentEvents).toHaveLength(20);
            expect(saved.currentEvents[19].id).toBe(39);
        });
    });

    describe('quota exhaustion (CODE-009)', () => {
        function quotaError() {
            const error = new Error('The quota has been exceeded.');
            error.name = 'QuotaExceededError';
            return error;
        }

        test('saveGame fails gracefully, alerts the player, and the old save survives', () => {
            const state = createLateGameState();
            window.SaveLoadSystem.saveGame(1, state, 'Original Save');
            const rawBefore = mockStorage[STORAGE_KEY];

            window.localStorage.setItem.mockImplementation(() => { throw quotaError(); });

            const result = window.SaveLoadSystem.saveGame(1, createLateGameState({ cash: 1 }), 'Doomed Save');
            expect(result.success).toBe(false);
            expect(result.message).toMatch(/storage is full/i);
            expect(addAlertMock).toHaveBeenCalledWith(expect.objectContaining({
                type: 'danger',
                priority: 'high',
                message: expect.stringMatching(/storage is full/i)
            }));

            // Old save untouched and still loadable
            window.localStorage.setItem.mockImplementation(function(key, value) { mockStorage[key] = String(value); });
            expect(mockStorage[STORAGE_KEY]).toBe(rawBefore);
            const load = window.SaveLoadSystem.loadGame(1);
            expect(load.success).toBe(true);
            expect(load.saveInfo.name).toBe('Original Save');
        });

        test('on quota failure the expendable backup store is sacrificed and the write retried', () => {
            mockStorage[BACKUP_KEY] = 'x'.repeat(1000); // hog the quota
            window.localStorage.setItem.mockImplementation(function(key, value) {
                if (key !== BACKUP_KEY && mockStorage[BACKUP_KEY] !== undefined) throw quotaError();
                mockStorage[key] = String(value);
            });

            const result = window.SaveLoadSystem.saveGame(1, createLateGameState(), 'Squeezed In');
            expect(result.success).toBe(true);
            expect(mockStorage[BACKUP_KEY]).toBeUndefined(); // purged to make room
            expect(JSON.parse(mockStorage[STORAGE_KEY]).slot_1.name).toBe('Squeezed In');
        });

        test('autoSave returns false instead of throwing when storage is full', () => {
            window.localStorage.setItem.mockImplementation(() => { throw quotaError(); });
            expect(window.SaveLoadSystem.autoSave(createLateGameState())).toBe(false);
            expect(mockStorage[AUTO_SAVE_KEY]).toBeUndefined();
        });

        test('a quota failure while writing a backup never blocks the real save', () => {
            const state = createLateGameState();
            window.SaveLoadSystem.saveGame(1, state, 'First');

            // Backups fail on quota; everything else fits.
            window.localStorage.setItem.mockImplementation(function(key, value) {
                if (key === BACKUP_KEY) throw quotaError();
                mockStorage[key] = String(value);
            });

            const result = window.SaveLoadSystem.saveGame(1, state, 'Second'); // overwrites → attempts backup
            expect(result.success).toBe(true);
            expect(JSON.parse(mockStorage[STORAGE_KEY]).slot_1.name).toBe('Second');
            expect(addAlertMock).not.toHaveBeenCalled(); // backup failure is silent
        });

        test('non-quota storage errors also fail gracefully', () => {
            window.localStorage.setItem.mockImplementation(() => { throw new Error('SecurityError: denied'); });
            const result = window.SaveLoadSystem.saveGame(1, createLateGameState());
            expect(result.success).toBe(false);
            expect(result.message).toMatch(/denied/);
        });
    });

    describe('corrupted saves', () => {
        test('corrupted saves JSON yields a clean failure, not a crash', () => {
            mockStorage[STORAGE_KEY] = '{this is not json';
            const result = window.SaveLoadSystem.loadGame(1);
            expect(result.success).toBe(false);
            expect(result.message).toMatch(/No save found/);
        });

        test('corrupted auto-save JSON yields a clean failure', () => {
            mockStorage[AUTO_SAVE_KEY] = '{broken';
            const result = window.SaveLoadSystem.loadAutoSave();
            expect(result.success).toBe(false);
            expect(result.message).toMatch(/Failed to load auto-save/);
        });

        test('a save failing integrity checks triggers recovery, which fails cleanly with no backup', () => {
            mockStorage[STORAGE_KEY] = JSON.stringify({ slot_1: { version: '3.0' } }); // missing everything
            const result = window.SaveLoadSystem.loadGame(1);
            expect(result.success).toBe(false);
            expect(result.corrupted).toBe(true);
        });

        test('corrupted backup store degrades to empty', () => {
            mockStorage[BACKUP_KEY] = '{nope';
            expect(window.SaveLoadSystem.getBackups()).toEqual({});
        });
    });

    describe('backup and recovery', () => {
        test('overwriting a slot creates a backup; restoreFromBackup brings it back', () => {
            const state = createLateGameState();
            window.SaveLoadSystem.autoSave(state);
            const firstAutoSave = mockStorage[AUTO_SAVE_KEY];
            window.SaveLoadSystem.autoSave(createLateGameState({ cash: 42 })); // backs up the first

            const backups = window.SaveLoadSystem.getBackups();
            expect(backups[AUTO_SAVE_KEY]).toHaveLength(1);

            const result = window.SaveLoadSystem.restoreFromBackup(AUTO_SAVE_KEY, 0);
            expect(result.success).toBe(true);
            expect(mockStorage[AUTO_SAVE_KEY]).toBe(firstAutoSave);
        });

        test('restoreFromBackup fails cleanly for unknown keys and bad indices', () => {
            expect(window.SaveLoadSystem.restoreFromBackup('nothing-here').success).toBe(false);

            window.SaveLoadSystem.autoSave(createLateGameState());
            window.SaveLoadSystem.autoSave(createLateGameState());
            expect(window.SaveLoadSystem.restoreFromBackup(AUTO_SAVE_KEY, 99).success).toBe(false);
        });

        test('a corrupted ironman save recovers from its backup', () => {
            window.SaveLoadSystem.enableIronmanMode();
            const state = createLateGameState();
            window.SaveLoadSystem.ironmanSave(state);
            window.SaveLoadSystem.ironmanSave(state); // second save backs up the first

            mockStorage[IRONMAN_KEY] = JSON.stringify({ version: '3.0' }); // corrupt it

            const result = window.SaveLoadSystem.loadIronmanSave();
            expect(result.success).toBe(true);
            expect(result.recovered).toBe(true);
            expect(result.gameState.cash).toBe(state.cash);
        });
    });

    describe('ironman mode', () => {
        test('enable/disable toggles state', () => {
            expect(window.SaveLoadSystem.enableIronmanMode().success).toBe(true);
            expect(window.SaveLoadSystem.isIronmanMode()).toBe(true);
            expect(window.SaveLoadSystem.disableIronmanMode().success).toBe(true);
            expect(window.SaveLoadSystem.isIronmanMode()).toBe(false);
        });

        test('ironmanSave requires ironman mode', () => {
            expect(window.SaveLoadSystem.ironmanSave(createLateGameState()).success).toBe(false);
        });

        test('ironman save/load round-trips the full state', () => {
            window.SaveLoadSystem.enableIronmanMode();
            const state = createLateGameState();
            expect(window.SaveLoadSystem.ironmanSave(state).success).toBe(true);

            const result = window.SaveLoadSystem.loadIronmanSave();
            expect(result.success).toBe(true);
            expect(result.gameState).toEqual(state);
        });

        test('loadIronmanSave fails cleanly with no save', () => {
            expect(window.SaveLoadSystem.loadIronmanSave().success).toBe(false);
        });

        test('autoSave routes to the ironman slot in ironman mode', () => {
            window.SaveLoadSystem.enableIronmanMode();
            expect(window.SaveLoadSystem.autoSave(createLateGameState())).toBe(true);
            expect(mockStorage[IRONMAN_KEY]).toBeDefined();
            expect(mockStorage[AUTO_SAVE_KEY]).toBeUndefined();
        });

        test('ironman quota failure is reported, not swallowed', () => {
            window.SaveLoadSystem.enableIronmanMode();
            const error = new Error('quota exceeded');
            error.name = 'QuotaExceededError';
            window.localStorage.setItem.mockImplementation(() => { throw error; });

            const result = window.SaveLoadSystem.ironmanSave(createLateGameState());
            expect(result.success).toBe(false);
            expect(result.message).toMatch(/storage is full/i);
        });
    });

    describe('quick save/load and settings', () => {
        test('quickSave/quickLoad use the last slot', () => {
            expect(window.SaveLoadSystem.setQuickSaveSlot(3)).toBe(true);
            const state = createLateGameState();
            expect(window.SaveLoadSystem.quickSave(state).success).toBe(true);
            expect(window.SaveLoadSystem.getLastQuickSaveSlot()).toBe(3);

            const result = window.SaveLoadSystem.quickLoad();
            expect(result.success).toBe(true);
            expect(result.slot).toBe(3);
            expect(result.gameState.cash).toBe(state.cash);
        });

        test('setQuickSaveSlot rejects out-of-range slots', () => {
            expect(window.SaveLoadSystem.setQuickSaveSlot(0)).toBe(false);
            expect(window.SaveLoadSystem.setQuickSaveSlot(99)).toBe(false);
        });

        test('settings persist and reload', () => {
            window.SaveLoadSystem.saveSettings({ ironmanMode: true, lastQuickSaveSlot: 4 });
            const settings = window.SaveLoadSystem.getSettings();
            expect(settings.ironmanMode).toBe(true);
            expect(settings.lastQuickSaveSlot).toBe(4);
        });

        test('corrupted settings degrade to empty object', () => {
            mockStorage['hollywood-mogul-save-settings'] = '{bad';
            expect(window.SaveLoadSystem.getSettings()).toEqual({});
        });

        test('init loads settings without throwing', () => {
            expect(() => window.SaveLoadSystem.init()).not.toThrow();
        });
    });

    describe('slot management', () => {
        test('getSaveSlotInfo reports filled and empty slots', () => {
            window.SaveLoadSystem.saveGame(2, createLateGameState(), 'Slot Two');
            const slots = window.SaveLoadSystem.getSaveSlotInfo();
            expect(slots).toHaveLength(5);
            expect(slots[1].exists).toBe(true);
            expect(slots[1].name).toBe('Slot Two');
            expect(slots[1].filmsProduced).toBe(38);
            expect(slots[0].exists).toBe(false);
            expect(slots[0].name).toBe('Empty Slot');
        });

        test('clearAllSaves removes slots and auto-save', () => {
            window.SaveLoadSystem.saveGame(1, createLateGameState());
            window.SaveLoadSystem.autoSave(createLateGameState());
            expect(window.SaveLoadSystem.clearAllSaves().success).toBe(true);
            expect(mockStorage[STORAGE_KEY]).toBeUndefined();
            expect(mockStorage[AUTO_SAVE_KEY]).toBeUndefined();
        });

        test('generateSaveName handles negative cash', () => {
            const state = createLateGameState({ cash: -50000 });
            window.SaveLoadSystem.saveGame(1, state); // no custom name
            const slot = JSON.parse(mockStorage[STORAGE_KEY]).slot_1;
            expect(slot.name).toMatch(/-\$50k/);
        });
    });

    describe('auto-save timer', () => {
        test('startAutoSave saves on the interval; stopAutoSave halts it', () => {
            const state = createLateGameState();
            window.HollywoodMogul.getGameState.mockReturnValue(state);

            window.SaveLoadSystem.startAutoSave(state);
            jest.advanceTimersByTime(window.SaveLoadSystem.AUTO_SAVE_INTERVAL);
            expect(mockStorage[AUTO_SAVE_KEY]).toBeDefined();

            delete mockStorage[AUTO_SAVE_KEY];
            window.SaveLoadSystem.stopAutoSave();
            jest.advanceTimersByTime(window.SaveLoadSystem.AUTO_SAVE_INTERVAL * 2);
            expect(mockStorage[AUTO_SAVE_KEY]).toBeUndefined();
        });

        test('the timer skips ended games', () => {
            const state = createLateGameState({ gameEnded: true });
            window.HollywoodMogul.getGameState.mockReturnValue(state);

            window.SaveLoadSystem.startAutoSave(state);
            jest.advanceTimersByTime(window.SaveLoadSystem.AUTO_SAVE_INTERVAL);
            expect(mockStorage[AUTO_SAVE_KEY]).toBeUndefined();
            window.SaveLoadSystem.stopAutoSave();
        });
    });

    describe('export/import', () => {
        let originalFileReader;
        let originalCreateObjectURL;
        let originalRevokeObjectURL;

        beforeEach(() => {
            originalFileReader = global.FileReader;
            originalCreateObjectURL = global.URL.createObjectURL;
            originalRevokeObjectURL = global.URL.revokeObjectURL;
            global.URL.createObjectURL = jest.fn(() => 'blob:mock');
            global.URL.revokeObjectURL = jest.fn();
            global.FileReader = class {
                readAsText(file) {
                    const self = this;
                    if (file && file.__error) { self.onerror(); return; }
                    self.onload({ target: { result: file.__content } });
                }
            };
        });

        afterEach(() => {
            global.FileReader = originalFileReader;
            global.URL.createObjectURL = originalCreateObjectURL;
            global.URL.revokeObjectURL = originalRevokeObjectURL;
        });

        test('exportSave downloads an existing slot', () => {
            window.SaveLoadSystem.saveGame(1, createLateGameState(), 'Exported');
            const result = window.SaveLoadSystem.exportSave(1);
            expect(result.success).toBe(true);
            expect(global.URL.createObjectURL).toHaveBeenCalled();
        });

        test('exportSave fails for an empty slot', () => {
            expect(window.SaveLoadSystem.exportSave(4).success).toBe(false);
        });

        test('importSave round-trips an exported save', async () => {
            window.SaveLoadSystem.saveGame(1, createLateGameState(), 'To Export');
            const slotData = JSON.parse(mockStorage[STORAGE_KEY]).slot_1;
            const file = {
                __content: JSON.stringify({
                    game: 'Hollywood Mogul',
                    version: '1.0',
                    exportDate: new Date().toISOString(),
                    saveData: slotData
                })
            };

            const result = await window.SaveLoadSystem.importSave(file, 5);
            expect(result.success).toBe(true);

            const load = window.SaveLoadSystem.loadGame(5);
            expect(load.success).toBe(true);
            expect(load.gameState.finances.loans).toHaveLength(1);
        });

        test('importSave rejects non-Hollywood-Mogul files', async () => {
            const result = await window.SaveLoadSystem.importSave({ __content: JSON.stringify({ game: 'Other' }) }, 1);
            expect(result.success).toBe(false);
            expect(result.message).toMatch(/not a Hollywood Mogul save/);
        });

        test('importSave rejects files without saveData', async () => {
            const result = await window.SaveLoadSystem.importSave({ __content: JSON.stringify({ game: 'Hollywood Mogul' }) }, 1);
            expect(result.success).toBe(false);
        });

        test('importSave rejects schema-invalid save data', async () => {
            const result = await window.SaveLoadSystem.importSave({
                __content: JSON.stringify({ game: 'Hollywood Mogul', saveData: { version: '3.0' } })
            }, 1);
            expect(result.success).toBe(false);
            expect(result.message).toMatch(/validation failed/);
        });

        test('importSave handles unparsable files and reader errors', async () => {
            const bad = await window.SaveLoadSystem.importSave({ __content: '{nope' }, 1);
            expect(bad.success).toBe(false);

            const readError = await window.SaveLoadSystem.importSave({ __error: true }, 1);
            expect(readError.success).toBe(false);

            const noFile = await window.SaveLoadSystem.importSave(null, 1);
            expect(noFile.success).toBe(false);
        });
    });

    describe('storage availability', () => {
        test('reports usage when storage works', () => {
            const info = window.SaveLoadSystem.checkStorageAvailability();
            expect(info.available).toBe(true);
            expect(info.percentUsed).toBeGreaterThanOrEqual(0);
        });

        test('reports unavailable when storage throws', () => {
            window.localStorage.setItem.mockImplementation(() => { throw new Error('blocked'); });
            const info = window.SaveLoadSystem.checkStorageAvailability();
            expect(info.available).toBe(false);
        });
    });

    describe('auto-save indicator', () => {
        test('shows and hides the indicator element', () => {
            document.body.innerHTML = '<div id="autosave-indicator"></div>';
            window.DashboardUI = { showNotification: jest.fn() };

            window.SaveLoadSystem.showAutoSaveIndicator('Test Message');
            const indicator = document.getElementById('autosave-indicator');
            expect(indicator.textContent).toBe('Test Message');
            expect(indicator.classList.contains('visible')).toBe(true);
            expect(window.DashboardUI.showNotification).toHaveBeenCalled();

            jest.advanceTimersByTime(2000);
            expect(indicator.classList.contains('visible')).toBe(false);
        });
    });
});
