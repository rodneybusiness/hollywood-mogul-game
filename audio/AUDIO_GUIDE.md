# Hollywood Mogul - Audio System Guide

## Overview

The Hollywood Mogul game features a complete audio system with period-appropriate music and immersive sound effects designed to transport players to the Golden Age of Hollywood (1933-1949).

## Audio System Architecture

### Components

1. **AudioSystem** (`js/systems/audio.js`)
   - Core audio engine
   - Music playback and crossfading
   - Sound effect management
   - Volume controls (Master, Music, SFX)
   - Web Audio API integration for procedural sounds
   - LocalStorage persistence for user preferences

2. **Audio Integration** (`js/systems/audio-integration.js`)
   - Connects audio to UI events
   - Automatic music changes based on game state
   - Event-driven sound effect triggers

3. **Audio Controls** (HTML/CSS)
   - Mute/unmute toggle
   - Volume sliders with real-time feedback
   - Collapsible settings panel

## Audio Files Needed

### Background Music (9 tracks)

Place all music files in `/audio/music/` directory:

#### Era-Based Themes

1. **1930s-jazz-theme.mp3** (Pre-Code Era: 1933-1934)
   - Style: Upbeat jazz and swing
   - Mood: Optimistic, energetic
   - Duration: 2-4 minutes (looping)
   - Reference: Benny Goodman, Duke Ellington style

2. **1930s-orchestral.mp3** (Production Code Era: 1934-1941)
   - Style: Refined orchestral
   - Mood: Sophisticated, elegant
   - Duration: 2-4 minutes (looping)
   - Reference: Film scores of the era

3. **1940s-patriotic.mp3** (War Era: 1941-1945)
   - Style: Orchestral with patriotic undertones
   - Mood: Determined, hopeful
   - Duration: 2-4 minutes (looping)
   - Reference: Glenn Miller, wartime film scores

4. **1940s-optimistic.mp3** (Post-War: 1945-1949)
   - Style: Bright orchestral and jazz fusion
   - Mood: Celebratory, forward-looking
   - Duration: 2-4 minutes (looping)
   - Reference: Post-war swing revival

#### Contextual Music

5. **tension-low-finances.mp3**
   - Style: Suspenseful strings, minor key
   - Mood: Anxious, urgent
   - Duration: 1-3 minutes (looping)
   - Triggered when: Cash runway < 8 weeks

6. **success-fanfare.mp3**
   - Style: Triumphant brass and orchestral
   - Mood: Victorious
   - Duration: 10-20 seconds
   - Triggered when: Major achievements, profitable film

7. **crisis-dramatic.mp3**
   - Style: Dramatic orchestral
   - Mood: Critical decision moment
   - Duration: 1-2 minutes
   - Triggered when: Major crisis events

8. **menu-theme.mp3**
   - Style: Elegant jazz piano
   - Mood: Inviting, sophisticated
   - Duration: 2-3 minutes (looping)
   - Triggered when: Loading screen, main menu

### Sound Effects (20+ effects)

Place all SFX files in `/audio/sfx/` directory:

#### UI Sounds

1. **art-deco-ding.mp3** - Button clicks (soft chime)
2. **page-turn.mp3** - Navigation between sections

#### Production Sounds

3. **film-projector-start.mp3** - Greenlight script action
4. **camera-rolling.mp3** - Film production milestone
5. **typewriter.mp3** - Script-related actions
6. **vintage-phone-ring.mp3** - Events, notifications

#### Time & Calendar

7. **clock-tick.mp3** - Week advancement
8. **calendar-page.mp3** - Month advancement

#### Financial Sounds

9. **cash-register.mp3** - Money transactions
10. **coins-clink.mp3** - Small transactions
11. **money-in.mp3** - Positive cash flow
12. **money-out.mp3** - Expenses, large payments

#### Film Release & Box Office

13. **crowd-cheer.mp3** - Film premiere
14. **theater-applause.mp3** - Box office success
15. **neon-buzz.mp3** - Marquee/theater ambience

#### Achievement & Success

16. **orchestra-hit.mp3** - Achievement unlocked
17. **trumpet-fanfare.mp3** - Major milestone

#### Alerts & Warnings

18. **notification-soft.mp3** - Info alerts
19. **warning-bell.mp3** - Warning alerts
20. **alarm-urgent.mp3** - Critical alerts

## Royalty-Free Audio Sources

### Recommended Sources for Music

1. **FreePD.com**
   - Public domain music
   - Good for classical and jazz
   - Free for commercial use

2. **Incompetech.com** (Kevin MacLeod)
   - Extensive library
   - Requires attribution (free) or license
   - Excellent 1930s-40s style options

3. **Free Music Archive**
   - Various artists
   - Check individual licenses
   - Good period music selection

4. **YouTube Audio Library**
   - Free for YouTube use
   - Check commercial use rights
   - Good variety

### Recommended Sources for SFX

1. **Freesound.org**
   - Large community-driven library
   - Requires account
   - Various CC licenses

2. **Zapsplat.com**
   - Free SFX library
   - Requires attribution
   - Extensive vintage sound collection

3. **BBC Sound Effects**
   - Public domain
   - High quality
   - Excellent vintage collection

## Audio Format Specifications

### Music Files
- Format: MP3 or OGG
- Bitrate: 128-192 kbps
- Sample Rate: 44.1 kHz
- Channels: Stereo
- Loop points: Clean (no pops/clicks)

### Sound Effects
- Format: MP3 or OGG
- Bitrate: 96-128 kbps
- Sample Rate: 44.1 kHz
- Channels: Mono or Stereo
- Duration: Keep under 5 seconds (except ambience)

## Procedural Audio (Web Audio API)

The system includes Web Audio API support for simple procedural sounds when audio files aren't available:

- **click** - Simple button click
- **ding** - Art deco style ding
- **success** - Ascending musical notes
- **error** - Descending buzz

These are automatically used as fallbacks.

## Implementation Guide

### Adding New Music Track

```javascript
// In audio.js, add to MUSIC_LIBRARY:
'my_new_track': {
    url: 'audio/music/my-track.mp3',
    description: 'Description of track'
}

// Play the track:
AudioSystem.playMusic('my_new_track', fadeInDuration);
```

### Adding New Sound Effect

```javascript
// In audio.js, add to SFX_LIBRARY:
'my_sfx': {
    url: 'audio/sfx/my-sound.mp3',
    description: 'Description of sound'
}

// Play the sound:
AudioSystem.playSFX('my_sfx', volume);
```

### Triggering Audio on Game Events

```javascript
// In your game code:
if (window.AudioSystem) {
    // Play a sound effect
    window.AudioSystem.playSFX('cash_register');

    // Play specific music
    window.AudioSystem.playMusic('success', 2000);

    // Update music based on game state
    window.AudioSystem.updateMusicForGameState(gameState);
}
```

## Audio Features

### Music System
- **Automatic crossfading** between tracks (configurable duration)
- **Era-based music** changes automatically with game year
- **Context-aware music** (tension music when low on cash)
- **Smooth volume transitions**
- **Loop management** for continuous playback

### Sound Effects
- **Spatial timing** for layered sounds
- **Volume variation** for natural feel
- **Procedural fallbacks** when files unavailable
- **No overlap** for rapid-fire events

### User Controls
- **Master volume** control (affects all audio)
- **Music volume** separate slider
- **SFX volume** separate slider
- **Mute toggle** quick silence
- **Persistent preferences** saved to localStorage

## Testing the Audio System

### Manual Testing

1. **Load the game** - Menu music should play
2. **Click buttons** - Should hear click sounds
3. **Greenlight a film** - Projector + cash register sounds
4. **Advance time** - Clock tick / calendar flip
5. **Run low on cash** - Music should shift to tension
6. **Mute button** - Should silence all audio
7. **Volume sliders** - Should adjust respective volumes

### Browser Console Testing

```javascript
// Test audio initialization
console.log(AudioSystem.getState());

// List available music
console.log(AudioSystem.getMusicLibrary());

// List available SFX
console.log(AudioSystem.getSFXLibrary());

// Test specific sound
AudioSystem.playSFX('cash_register');

// Test music playback
AudioSystem.playMusic('pre_code');
```

## Browser Compatibility

The audio system supports:
- Chrome 35+
- Firefox 40+
- Safari 9+
- Edge 12+

### Autoplay Policies

Modern browsers require user interaction before playing audio. The system handles this by:
1. Waiting for first user click
2. Initializing audio context on interaction
3. Displaying audio controls immediately

## Performance Considerations

- Music files are lazy-loaded (not preloaded)
- SFX are cloned for simultaneous playback
- Maximum 5 simultaneous SFX recommended
- Web Audio API used for simple procedural sounds
- Audio context resumed on user interaction

## Troubleshooting

### No Sound Playing

1. Check browser console for errors
2. Verify audio files exist at correct paths
3. Check browser autoplay policy
4. Ensure volume not muted or at 0
5. Check audio file format compatibility

### Music Not Transitioning

1. Verify `updateMusicForGameState()` is being called
2. Check game state values (year, cash, etc.)
3. Look for JavaScript errors in console

### Poor Performance

1. Reduce music bitrate to 128 kbps
2. Convert to OGG for Firefox
3. Limit simultaneous sound effects
4. Check for memory leaks in console

## Future Enhancements

Potential additions:
- Audio sprites for faster SFX loading
- Ambient soundscapes (studio lot, theater)
- Voice-over narration for tutorials
- Achievement unlocked jingles
- Film genre-specific music during production
- Historical event audio clips

## License Compliance

When adding audio files:
1. Keep track of all audio sources
2. Maintain attribution file (AUDIO_CREDITS.md)
3. Verify commercial use rights
4. Include required license text
5. Respect Creative Commons terms

## Credits Template

Create `/audio/AUDIO_CREDITS.md` with:

```markdown
# Audio Credits

## Music

### Pre-Code Era Theme
- Title: [Track Name]
- Artist: [Artist Name]
- Source: [URL]
- License: [License Type]

[Repeat for each track]

## Sound Effects

### Cash Register
- Source: [URL]
- License: [License Type]

[Repeat for each SFX]
```

---

**Remember:** The audio system is designed to enhance immersion. Choose music and sounds that evoke the glamour and drama of 1930s-1940s Hollywood!
