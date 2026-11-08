#!/usr/bin/env bash
# Inspect an exported video: streams, frame count vs duration, black frames, frozen spans, loudness.
set -euo pipefail
F=${1:-out/final_video.mp4}
ffprobe -v error -show_entries stream=codec_name,profile,width,height,pix_fmt,r_frame_rate,nb_frames,bit_rate,sample_rate,channels:format=duration,size -of compact "$F"
echo "--- black frames (>=0.05s):"; ffmpeg -v info -i "$F" -vf "blackdetect=d=0.05:pix_th=0.08" -an -f null - 2>&1 | grep -o "black_start.*" || echo none
echo "--- frozen spans (>=1.0s):"; ffmpeg -v info -i "$F" -vf "freezedetect=n=0.001:d=1.0" -an -f null - 2>&1 | grep -oE "freeze_(start|duration): [0-9.]+" | paste - - || echo none
echo "--- loudness:"; ffmpeg -i "$F" -af ebur128=peak=true -vn -f null - 2>&1 | grep -A12 Summary | grep -E "I:|Peak:" 
echo "--- silence in audio (>=1.5s):"; ffmpeg -i "$F" -af silencedetect=n=-45dB:d=1.5 -vn -f null - 2>&1 | grep -o "silence_start.*\|silence_duration.*" || echo none
