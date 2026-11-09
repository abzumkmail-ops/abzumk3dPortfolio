#!/usr/bin/env bash
# Inspect an exported video: streams, frame count vs duration, black frames, frozen spans, loudness, silence.
# Fast: one video pass (detectors on a 270 px-wide copy) and one audio pass.
set -euo pipefail
F=${1:-out/final_video.mp4}
ffprobe -v error -show_entries stream=codec_name,profile,width,height,pix_fmt,r_frame_rate,nb_frames,bit_rate,sample_rate,channels:format=duration,size -of compact "$F"
V=$(ffmpeg -v info -i "$F" -vf "scale=270:-2,blackdetect=d=0.05:pix_th=0.08,freezedetect=n=0.001:d=1.0" -an -f null - 2>&1 || true)
echo "--- black frames (>=0.05s):"; echo "$V" | grep -o "black_start.*" || echo none
echo "--- frozen spans (>=1.0s):"; echo "$V" | grep -oE "freeze_(start|duration): [0-9.]+" | paste - - || echo none
A=$(ffmpeg -i "$F" -af "ebur128=peak=true,silencedetect=n=-45dB:d=1.5" -vn -f null - 2>&1 || true)
echo "--- loudness:"; echo "$A" | grep -A12 Summary | grep -E "I:|Peak:"
echo "--- silence in audio (>=1.5s):"; echo "$A" | grep -o "silence_start.*\|silence_duration.*" || echo none
