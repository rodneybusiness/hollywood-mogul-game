# Building MOGUL for release

## Web (itch.io HTML5 upload)
```bash
scripts/build-web.sh          # -> dist/ + mogul-web-v<version>.zip
```
Upload the zip; set "This file will be played in the browser";
viewport 1440x900 (min 1280x800). The game is fully offline — no CSP
or external-host issues.

## Desktop (Tauri 2.x, Win/macOS/Linux)
Prereqs: Rust stable + platform toolchain + `cargo install tauri-cli`.
```bash
scripts/build-web.sh          # produce dist/ (frontendDist)
cd src-tauri && cargo tauri build
```
Artifacts land in `src-tauri/target/release/bundle/`. An app icon is
required at `src-tauri/icons/icon.png` (1024x1024) before bundling.

Remaining desktop work before Steam (tracked in ROADMAP P7.1/Steam
prep): file-backed saves via the existing SaveLoadSystem
export/import path (Steam Cloud syncs files, not localStorage), and
Steamworks achievement mapping from js/systems/achievements.js.

## Release checks
`npm test` (all suites incl. balance gates) and
`npm run sim -- --matrix --seeds 5` must be green;
docs/RELEASE/SHIP-CHECKLIST.md is the gate record.
