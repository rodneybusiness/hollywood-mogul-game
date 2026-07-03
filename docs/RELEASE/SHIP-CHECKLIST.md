# Definition of Sellable — gate record (BUILD-PLAN §1)

Dated 2026-07-03, v3.0.0, evidence per line. UNCHECKED items are the
human/elapsed-time gates that block the actual launch.

- [x] Zero S0 findings open; zero uncaught exceptions across the hostile
      protocol — Playwright hostile pass clean incl. console (Phases 1–5
      PR records); error boundary + copyable bug reports live.
- [x] Simulation gates — tests/sim/balance-gates.test.js (7 gates, green
      in CI-equivalent `npm test`): passivity dies, random usually dies,
      cautious viable-but-precarious, prestige survives with danger,
      no one cash-unconstrained before 1945, loan exploit never best.
- [ ] Blind first-hour test 4/5 fresh players — **outstanding human
      gate**; protocol ready in docs/RELEASE/beta-protocol.md.
- [x] Full campaign playable start→end — sim: 98-film campaigns to the
      Jan 1950 epilogue across strategies/seeds; no interaction-free
      dead-zone mechanism remains (weekly events + monthly pipeline).
- [x] Real audio — generative period score + full SFX through the
      volume/mute controls (tests/sim/presentation.test.js); licensed
      recordings optional post-launch via FILE_AUDIO_ENABLED
      (audio/AUDIO_CREDITS.md).
- [x] Save round-trip + v2→v3 migration + quota safety —
      tests/save-load.test.js (54 tests) + 12-year campaign round-trip.
- [x] Fully offline — fonts self-hosted; zero external requests
      (tests/sim/presentation.test.js pins it).
- [ ] Legal pass on the fictionalized roster — packet ready
      (docs/FICTIONALIZATION-MAP.md); **counsel review outstanding**
      (budgeted $500–1,500).
- [~] Browser matrix — Chromium verified throughout; **Firefox/Safari/
      Edge runs outstanding** (not installable in the build container).
- [x] Ship hygiene — version display, CHANGELOG v3.0.0, release console
      gating, crash-report copy button, web package builds
      (scripts/build-web.sh, 3.4MB), Tauri scaffold (src-tauri/).

**Launch sequence** (docs/RELEASE/BUILD.md): counsel sign-off → beta
per protocol → Firefox/Safari/Edge pass → itch.io draft page
(docs/RELEASE/itch-page.md) → launch at $19.99.
