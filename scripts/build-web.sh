#!/usr/bin/env bash
# Build the itch.io web package (ROADMAP P7.2): the game is buildless,
# so the web "build" is a curated copy of runtime files into dist/,
# zipped for upload. Also the input for the Tauri desktop shell.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist
mkdir -p dist
cp index.html dist/
cp -r js css assets audio dist/
# strip dev-only content from the package
rm -rf dist/audio/AUDIO_GUIDE.md 2>/dev/null || true
find dist -name '*.md' ! -name 'AUDIO_CREDITS.md' -delete

VERSION=$(grep -o "GAME_VERSION = '[^']*'" js/core/constants.js | cut -d"'" -f2)
( cd dist && zip -qr "../mogul-web-v${VERSION}.zip" . )
echo "dist/ ready; package: mogul-web-v${VERSION}.zip ($(du -h "mogul-web-v${VERSION}.zip" | cut -f1))"
