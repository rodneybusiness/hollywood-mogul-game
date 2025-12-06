# Hollywood Mogul - Enhanced Save/Load System Documentation

## Overview
The Hollywood Mogul game now features a comprehensive save/load system with multiple save slots, auto-save functionality, Ironman mode, and robust backup/recovery features.

## Features Implemented

### 1. Multiple Save Slots
- **5 Save Slots**: Players can maintain up to 5 different save games
- **Named Saves**: Each save displays the studio name, current year, cash on hand, and films produced
- **Save Metadata**: Saves include complete game state, timestamp, and version information
- **Empty Slot Detection**: Clearly shows which slots are available

### 2. Auto-Save System
- **Automatic Saves**: Game auto-saves every 5 minutes
- **Visual Indicator**: Auto-save indicator appears in the top-right corner
- **Non-Intrusive**: Auto-save runs in the background without interrupting gameplay
- **Separate Storage**: Auto-saves stored separately from manual saves

### 3. Quick Save/Load
- **Keyboard Shortcuts**:
  - `Ctrl+S` - Quick Save to last used slot
  - `Ctrl+L` - Quick Load from last used slot
  - `Ctrl+Shift+S` - Open Save Modal
  - `Ctrl+Shift+L` - Open Load Modal
  - `ESC` - Close any open modal

### 4. Ironman Mode
- **Single Save Slot**: Only one save, forcing commitment to decisions
- **Auto-Save on Actions**: Automatically saves after every major action
- **No Manual Saves**: Quick save/load disabled in Ironman mode
- **Cannot be Disabled**: Once enabled for a save, it's permanent
- **For Hardcore Players**: Adds challenge and consequence to gameplay

### 5. Import/Export Functionality
- **Export Saves**: Download save files as JSON for backup
- **Import Saves**: Load saved files from other sessions or share with friends
- **Cross-Platform**: Save files work across different browsers and devices
- **Slot Selection**: Choose which slot to export from or import to

### 6. Backup & Recovery System
- **Automatic Backups**: Creates backup before overwriting any save
- **3-Layer Backup**: Keeps last 3 versions of each save slot
- **Corruption Detection**: Verifies save integrity on load
- **Auto-Recovery**: Automatically attempts to restore from backup if corruption detected
- **Version Tracking**: Tracks save format version for compatibility

### 7. Storage Management
- **Storage Info**: Shows localStorage usage percentage
- **Usage Visualization**: Progress bar displays storage consumption
- **Clear All Saves**: Emergency option to delete all save data

### 8. User Interface

#### Save/Load Modal
- **Tabbed Interface**:
  - Save Tab: Quick save and manual save to slots
  - Load Tab: Quick load, slot loading, and auto-save loading
  - Manage Tab: Ironman mode, import/export, and storage info

#### Save Slot Cards
- **Rich Information Display**:
  - Studio name
  - Current in-game year
  - Cash on hand
  - Number of films produced
  - Last saved date/time

#### Visual Feedback
- **Auto-Save Indicator**: Animated notification during saves
- **Success Notifications**: Toast notifications for all save/load operations
- **Error Handling**: Clear error messages if save/load fails

### 9. Technical Features

#### Save Data Version Control
- **Version 2.0**: Enhanced save format with additional metadata
- **Backward Compatibility**: Can load older save formats
- **Future-Proof**: Version checking for game updates

#### Data Integrity
- **Validation**: Checks for required fields and correct data types
- **Array Verification**: Ensures collections are properly structured
- **Type Safety**: Validates cash, year, and other critical values

#### Performance
- **Efficient Storage**: Only saves essential game state
- **Deep Copy**: Prevents reference issues in saved data
- **Optimized Loading**: Fast restoration of game state

## File Structure

### JavaScript Files
- `/js/core/save-load.js` - Core save/load system logic
- `/js/ui/save-load-ui.js` - UI integration and modal management
- `/js/ui/keyboard-shortcuts.js` - Keyboard shortcut handling

### CSS Files
- `/css/modals-extended.css` - Complete styling for save/load UI

### HTML Structure
- Save/Load modal with 3 tabs
- Auto-save indicator element
- Delete confirmation modal

## Usage Guide

### For Players

#### Manual Save
1. Click the "SAVE" button in time controls
2. Select "Save to Slot" section
3. Click on any slot (1-5) to save
4. Or use Quick Save (Ctrl+S) to save to last used slot

#### Loading a Save
1. Click the "LOAD" button in time controls
2. Select "Load from Slot" section
3. Click on a save slot to load
4. Or use Quick Load (Ctrl+L) to load last save

#### Enabling Ironman Mode
1. Click "SAVE" or "LOAD" button
2. Switch to "MANAGE" tab
3. Toggle the Ironman Mode switch
4. Confirm the warning (cannot be undone!)

#### Export/Import
1. Go to "MANAGE" tab in save modal
2. **Export**: Select slot, click "EXPORT SAVE"
3. **Import**: Click "IMPORT SAVE", select file, choose target slot

### For Developers

#### Initialize System
```javascript
// Automatically initialized in integration.js
window.SaveLoadUI.init();
window.KeyboardShortcuts.init();
```

#### Programmatic Save
```javascript
const gameState = window.HollywoodMogul.getGameState();
const result = window.SaveLoadSystem.saveGame(1, gameState, "My Save");
```

#### Programmatic Load
```javascript
const result = window.SaveLoadSystem.loadGame(1);
if (result.success) {
    // Apply loaded state
    Object.assign(currentState, result.gameState);
}
```

#### Enable Ironman
```javascript
const result = window.SaveLoadSystem.enableIronmanMode();
```

## API Reference

### SaveLoadSystem Public Methods

- `init()` - Initialize the save system
- `saveGame(slotNumber, gameState, customName)` - Save to specific slot
- `loadGame(slotNumber)` - Load from specific slot
- `quickSave(gameState)` - Save to last used slot
- `quickLoad()` - Load from last used slot
- `autoSave(gameState)` - Perform auto-save
- `loadAutoSave()` - Load auto-save
- `enableIronmanMode()` - Enable Ironman mode
- `disableIronmanMode()` - Disable Ironman mode
- `isIronmanMode()` - Check if Ironman mode is active
- `ironmanSave(gameState)` - Ironman save
- `loadIronmanSave()` - Load Ironman save
- `getSaveSlotInfo()` - Get info for all save slots
- `deleteSave(slotNumber)` - Delete specific save
- `clearAllSaves()` - Delete all saves
- `exportSave(slotNumber)` - Export save to file
- `importSave(file, targetSlot)` - Import save from file
- `verifySaveIntegrity(saveData)` - Verify save data
- `attemptRecovery(key)` - Attempt to recover corrupted save
- `checkStorageAvailability()` - Check storage status

### SaveLoadUI Public Methods

- `init()` - Initialize save/load UI
- `showSaveModal(tab)` - Show save modal (tab: 'save', 'load', or 'manage')
- `closeSaveModal()` - Close save modal

### KeyboardShortcuts Public Methods

- `init()` - Initialize keyboard shortcuts

## Save Data Structure

```json
{
  "version": "2.0",
  "name": "Studio Name - Jan 1935 ($150k)",
  "saveDate": "2024-01-15T10:30:00.000Z",
  "currentDate": "1935-01-01T00:00:00.000Z",
  "gameDate": "January 1935",
  "gameWeek": 104,
  "gameYear": 1935,
  "year": 1935,
  "cash": 150000,
  "monthlyBurn": 30000,
  "totalRevenue": 500000,
  "totalExpenses": 350000,
  "studioName": "Studio Name",
  "reputation": 75,
  "soundStages": 2,
  "backlots": { "western": true, "nyc": false, "jungle": false },
  "activeFilms": [...],
  "completedFilms": [...],
  "contractPlayers": [...],
  "availableScripts": [...],
  "currentEvents": [...],
  "gameStarted": true,
  "gameEnded": false,
  "endingType": null,
  "stats": {
    "filmsProduced": 15,
    "oscarsWon": 2,
    "boxOfficeTotal": 2500000,
    "scandalsHandled": 3,
    "yearsSurvived": 2.5
  }
}
```

## Storage Limits

- **LocalStorage Limit**: Typically 5-10MB per domain
- **Max Save Slots**: 5 manual slots + 1 auto-save + 1 Ironman slot
- **Backup Storage**: 3 backups per slot
- **Typical Save Size**: ~20-50KB per save

## Best Practices

1. **Save Often**: Use auto-save or quick save regularly
2. **Use Multiple Slots**: Keep saves at different points in your game
3. **Export Important Saves**: Back up your best runs externally
4. **Monitor Storage**: Check storage usage in the Manage tab
5. **Ironman Warning**: Only enable Ironman if you're ready for permanent consequences

## Troubleshooting

### Save Not Loading
- Check if save slot has data
- Look for corruption recovery message
- Try loading from backup (automatic)
- Check browser console for errors

### Auto-Save Not Working
- Verify localStorage is enabled in browser
- Check if private/incognito mode is blocking storage
- Ensure game is actively running

### Storage Full
- Delete unused save slots
- Export and remove old saves
- Use "Clear All Saves" (last resort)

## Future Enhancements

Potential additions for future versions:
- Cloud sync integration
- Save game screenshots
- Save comparison tool
- Statistics dashboard
- Achievement tracking in saves
- Replay system from saves

## Credits

Enhanced Save/Load System v2.0
Built for Hollywood Mogul - Golden Age Tycoon Game
