"""Per-video mix using the prebuilt audio library (fast: a few seconds).

  python tools/make_audio.py      # needs data/ev.json (tools/render.js --ev-only) and audio/vo.wav

Music: each mood cue in ev.json tiles that mood's 8 s loop (audio/lib/music/<mood>.wav), crossfading between moods.
SFX:   every {type:'sfx', name, vol} event places audio/lib/sfx/<name>.wav.
Mix:   narration on top, music ducked under the voice, soft limiter. Output: out/mix.wav (48 kHz stereo)
"""
import json, os, glob
import numpy as np, soundfile as sf
from scipy import signal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB = os.path.join(ROOT, 'audio', 'lib')
SR = 48000

def lp(x, f): return signal.sosfilt(signal.butter(2, f, 'low', fs=SR, output='sos'), x)
def load(p):
    x, sr = sf.read(p, dtype='float32'); x = x.mean(1) if x.ndim > 1 else x
    assert sr == SR, p; return x

def main():
    ev = json.load(open(f"{ROOT}/data/ev.json")); END = ev['END']; events = ev['events']
    total = int((END + .3) * SR)
    S = {os.path.basename(p)[:-4]: load(p) for p in glob.glob(f"{LIB}/sfx/*.wav")}
    stems = {os.path.basename(p)[:-4]: load(p) for p in glob.glob(f"{LIB}/music/*.wav")}
    # music bed
    M = np.zeros(total); cues = [e for e in events if e['type'] == 'music']
    for i, c in enumerate(cues):
        if c['mode'] == 'end' or c['mode'] not in stems: continue
        t0 = c['t']; t1 = cues[i + 1]['t'] if i + 1 < len(cues) else END
        n = int((t1 - t0 + .25) * SR); st = stems[c['mode']]
        x = np.tile(st, n // len(st) + 1)[:n].copy()
        fi, fo = int(.03 * SR), int(.25 * SR); x[:fi] *= np.linspace(0, 1, fi); x[-fo:] *= np.linspace(1, 0, fo)
        s = int(t0 * SR); e = min(total, s + n); M[s:e] += x[:e - s]
    # narration + ducking
    vo = load(f"{ROOT}/audio/vo.wav"); V = np.zeros(total); V[:min(total, len(vo))] = vo[:total]
    envv = np.sqrt(np.maximum(lp(V ** 2, 8), 0))
    duck = lp(1 - .55 * np.clip(envv / (envv.max() * .25 + 1e-9), 0, 1), 4)
    mix = V + M / (np.abs(M).max() + 1e-9) * .24 * duck
    missing = set()
    for e in events:
        if e['type'] != 'sfx': continue
        if e['name'] not in S: missing.add(e['name']); continue
        x = S[e['name']] * e.get('vol', .5) * .75; s = int(e['t'] * SR); en = min(total, s + len(x))
        if 0 <= s < total: mix[s:en] += x[:en - s]
    mix[-int(.25 * SR):] *= np.linspace(1, 0, int(.25 * SR))
    mix = mix / (np.abs(mix).max() + 1e-9) * .97
    os.makedirs(f"{ROOT}/out", exist_ok=True)
    sf.write(f"{ROOT}/out/mix.wav", np.stack([mix, mix], 1).astype(np.float32), SR)
    print(f"mix {total / SR:.2f}s, {sum(e['type'] == 'sfx' for e in events)} sfx cues" + (f", MISSING sfx: {sorted(missing)}" if missing else ""))

if __name__ == '__main__':
    main()
