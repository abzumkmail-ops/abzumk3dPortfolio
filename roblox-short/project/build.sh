#!/usr/bin/env bash
# One-command rebuild of the Short.
#   ./build.sh                      → placeholder Kokoro voice, final 1080x1920@60
#   ./build.sh path/to/valf.mp3     → use your ElevenLabs narration (sped up 1.25x), everything re-times automatically
#   PREVIEW=1 ./build.sh [...]      → fast 540x960@30 preview
set -euo pipefail
cd "$(dirname "$0")"
if [ "${1:-}" != "" ]; then python3 tools/make_voice.py --external "$1" --speed "${SPEED:-1.25}"; else [ -f audio/vo.wav ] || python3 tools/make_voice.py; fi
if [ "${PREVIEW:-0}" = "1" ]; then node tools/render.js --w 540 --fps 30 --fmt jpeg --crf 20 --workers 4 --out out/preview_noaudio.mp4; V=out/preview_noaudio.mp4; OUT=out/preview.mp4
else node tools/render.js --w 1080 --fps 60 --fmt png --crf 17 --workers 4 --out out/video_noaudio.mp4; V=out/video_noaudio.mp4; OUT=out/final_video.mp4; fi
python3 tools/make_audio.py
ffmpeg -v error -y -i "$V" -i out/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -af "loudnorm=I=-14:TP=-1.0:LRA=11" -shortest -movflags +faststart "$OUT"
echo "done → $OUT"
