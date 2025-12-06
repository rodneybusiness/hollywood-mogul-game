# Sound Effects Directory

Place all sound effect files here. The audio system expects the following files:

## UI Sounds (2 files)

1. `art-deco-ding.mp3` - Button click sound
2. `page-turn.mp3` - Navigation sound

## Production Sounds (4 files)

3. `film-projector-start.mp3` - Greenlight script
4. `camera-rolling.mp3` - Production milestone
5. `typewriter.mp3` - Script actions
6. `vintage-phone-ring.mp3` - Event notifications

## Time & Calendar (2 files)

7. `clock-tick.mp3` - Week advance
8. `calendar-page.mp3` - Month advance

## Financial Sounds (4 files)

9. `cash-register.mp3` - Money transactions
10. `coins-clink.mp3` - Small payments
11. `money-in.mp3` - Positive transactions
12. `money-out.mp3` - Expenses

## Film Release (3 files)

13. `crowd-cheer.mp3` - Film premiere
14. `theater-applause.mp3` - Box office success
15. `neon-buzz.mp3` - Theater ambience

## Achievement (2 files)

16. `orchestra-hit.mp3` - Achievement unlocked
17. `trumpet-fanfare.mp3` - Major success

## Alerts (3 files)

18. `notification-soft.mp3` - Info alerts
19. `warning-bell.mp3` - Warning alerts
20. `alarm-urgent.mp3` - Critical alerts

## Royalty-Free SFX Sources

- **Freesound.org** - Large community library
- **Zapsplat.com** - Free sound effects
- **BBC Sound Effects** - Public domain sounds
- **Soundsnap** - Professional sound library

## Format Requirements

- **Format**: MP3 or OGG
- **Bitrate**: 96-128 kbps
- **Sample Rate**: 44.1 kHz
- **Channels**: Mono or Stereo
- **Duration**: Under 5 seconds (except ambience)

## Note on Procedural Audio

If sound files are not available, the system will attempt to generate simple sounds using the Web Audio API. However, actual audio files provide much better quality and period authenticity.

See `/audio/AUDIO_GUIDE.md` for detailed implementation guide.
