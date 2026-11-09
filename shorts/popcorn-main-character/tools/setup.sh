#!/usr/bin/env bash
# One-time machine setup (idempotent, ~1–3 min the first time, instant afterwards).
set -euo pipefail
python3 -c "import numpy, scipy, soundfile, librosa, faster_whisper, kokoro_onnx, PIL" 2>/dev/null || \
  pip install -q numpy scipy soundfile librosa faster-whisper kokoro-onnx pillow
node -e "require('playwright')" 2>/dev/null || { echo "Playwright (Node) is required: npm i -g playwright && npx playwright install chromium"; exit 1; }
command -v ffmpeg >/dev/null || { echo "ffmpeg is required"; exit 1; }
K=${KOKORO_DIR:-$HOME/.cache/itw-shorts/kokoro}; mkdir -p "$K"
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  [ -s "$K/$f" ] || curl -sSL -o "$K/$f" "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f"
done
# warm the whisper model cache used for word alignment
python3 -c "from faster_whisper import WhisperModel; WhisperModel('small', device='cpu', compute_type='int8')" >/dev/null 2>&1 || true
echo "setup ok (kokoro models in $K)"
