#!/bin/bash

echo "============================================"
echo "HOLLYWOOD MOGUL - AUDIO SYSTEM VERIFICATION"
echo "============================================"
echo ""

# Check audio system files
echo "📁 Checking Audio System Files..."
echo ""

files=(
    "js/systems/audio.js"
    "js/systems/audio-integration.js"
    "audio/AUDIO_GUIDE.md"
    "audio/music/README.md"
    "audio/sfx/README.md"
    "AUDIO_SYSTEM_SUMMARY.md"
)

all_found=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        echo "✅ $file (${size} bytes)"
    else
        echo "❌ $file - NOT FOUND"
        all_found=false
    fi
done

echo ""
echo "📂 Checking Directory Structure..."
echo ""

dirs=(
    "audio"
    "audio/music"
    "audio/sfx"
)

for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ /$dir/"
    else
        echo "❌ /$dir/ - NOT FOUND"
        all_found=false
    fi
done

echo ""
echo "🔍 Checking HTML Integration..."
echo ""

html_checks=(
    "audio-mute-toggle"
    "audio-settings-toggle"
    "audio-master-volume"
    "audio-music-volume"
    "audio-sfx-volume"
    'src="js/systems/audio.js"'
    'src="js/systems/audio-integration.js"'
)

for check in "${html_checks[@]}"; do
    if grep -q "$check" index.html; then
        echo "✅ Found: $check"
    else
        echo "❌ Missing: $check"
        all_found=false
    fi
done

echo ""
echo "🎨 Checking CSS Integration..."
echo ""

css_checks=(
    ".audio-controls"
    ".audio-btn"
    ".audio-settings-panel"
    ".volume-control"
)

for check in "${css_checks[@]}"; do
    if grep -q "$check" css/main.css; then
        echo "✅ Found: $check"
    else
        echo "❌ Missing: $check"
        all_found=false
    fi
done

echo ""
echo "🔧 JavaScript API Check..."
echo ""

if grep -q "window.AudioSystem" js/systems/audio.js; then
    echo "✅ AudioSystem namespace defined"
else
    echo "❌ AudioSystem namespace not found"
    all_found=false
fi

if grep -q "playMusic" js/systems/audio.js; then
    echo "✅ playMusic function defined"
else
    echo "❌ playMusic function not found"
    all_found=false
fi

if grep -q "playSFX" js/systems/audio.js; then
    echo "✅ playSFX function defined"
else
    echo "❌ playSFX function not found"
    all_found=false
fi

if grep -q "updateMusicForGameState" js/systems/audio.js; then
    echo "✅ updateMusicForGameState function defined"
else
    echo "❌ updateMusicForGameState function not found"
    all_found=false
fi

echo ""
echo "📊 Statistics..."
echo ""

echo "Audio System Code:"
wc -l js/systems/audio.js | awk '{print "  • audio.js: " $1 " lines"}'
wc -l js/systems/audio-integration.js | awk '{print "  • audio-integration.js: " $1 " lines"}'

echo ""
echo "Audio CSS:"
grep -c "audio" css/main.css | awk '{print "  • " $1 " audio-related rules in main.css"}'

echo ""
echo "Documentation:"
wc -l audio/AUDIO_GUIDE.md | awk '{print "  • AUDIO_GUIDE.md: " $1 " lines"}'

echo ""
echo "============================================"

if [ "$all_found" = true ]; then
    echo "✅ VERIFICATION COMPLETE - ALL SYSTEMS GO!"
    echo ""
    echo "🎵 The audio system is fully integrated!"
    echo "📝 Next step: Add audio files to /audio/music/ and /audio/sfx/"
    echo "📖 See /audio/AUDIO_GUIDE.md for details"
else
    echo "⚠️  VERIFICATION INCOMPLETE - SOME ISSUES FOUND"
    echo "Please review the errors above."
fi

echo "============================================"
