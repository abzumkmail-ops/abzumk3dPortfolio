#!/usr/bin/env bash
# Full pipeline from inside a project:  tools/build.sh [external_narration.mp3]
#   FPS=60 tools/build.sh      → 60 fps (default 30: half the render time, same look for this flat-colour style)
#   PREVIEW=1 tools/build.sh   → 540x960@30 quick version
# voice (if missing) → ev.json → [frames render ‖ audio mix] → mux → QA
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -n "${1:-}" ]; then python3 tools/make_voice.py --external "$1" --speed "${SPEED:-1.25}"
elif [ ! -f data/words.js ]; then python3 tools/make_voice.py; fi
node tools/render.js --ev-only
python3 tools/make_audio.py &  AUD=$!
if [ "${PREVIEW:-0}" = "1" ]; then node tools/render.js --w 540 --fps 30 --crf 21 --out out/video_noaudio.mp4; OUT=out/preview.mp4
else node tools/render.js --w 1920 --fps "${FPS:-30}" --crf 17 --out out/video_noaudio.mp4; OUT=out/final_video.mp4; fi
wait $AUD
ffmpeg -v error -y -i out/video_noaudio.mp4 -i out/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 \
  -af "loudnorm=I=-14:TP=-1.0:LRA=11" -shortest -movflags +faststart "$OUT"
bash tools/qa_final.sh "$OUT"
echo "DONE → $OUT"
