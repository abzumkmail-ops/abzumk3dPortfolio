#!/usr/bin/env bash
# Create a self-contained Short project with the shared engine, cast, audio library and tools.
#   new_project.sh <project_dir> [--example like-counter]
set -euo pipefail
SK="$(cd "$(dirname "$0")/.." && pwd)"; P="$1"; EX="${3:-}"
mkdir -p "$P"/{data,shots,audio/lib,out,tools}
cp -r "$SK/engine" "$P/engine"; mv "$P/engine/index.html" "$P/index.html"
cp -r "$SK/assets/audio/sfx" "$SK/assets/audio/music" "$P/audio/lib/"
cp "$SK"/scripts/{make_voice.py,make_audio.py,render.js,contact.js,qa_final.sh,build.sh,setup.sh,shot.js} "$P/tools/"
chmod +x "$P"/tools/*.sh
printf "out/*\n!out/final_video.mp4\n__pycache__/\n" > "$P/.gitignore"
if [ -n "$EX" ]; then cp "$SK/examples/$EX/script_lines.json" "$P/data/"; cp "$SK/examples/$EX/story.js" "$P/"; cp "$SK/examples/$EX/shots/"*.js "$P/shots/";
else printf "// story.js — story-level state shared by all shot parts (HUD, counters, music moods, caption colors)\n'use strict';\n" > "$P/story.js"; fi
echo "project ready: $P"
