# Audio Credits

The current score and sound effects are **generated at runtime** by the
WebAudio synthesis engine in `js/systems/audio.js` (see `MUSIC_STYLES` and
`SFX_SPECS`) — no recorded assets ship, so there are no third-party audio
licenses in this build.

To replace the generative score with licensed recordings: place files at the
paths declared in `MUSIC_LIBRARY`/`SFX_LIBRARY`, set `FILE_AUDIO_ENABLED =
true` in `js/systems/audio.js`, and record each asset's license here
(verify the *recording's* status, not just the composition's — pre-1923
compositions do not make a recording public domain).
