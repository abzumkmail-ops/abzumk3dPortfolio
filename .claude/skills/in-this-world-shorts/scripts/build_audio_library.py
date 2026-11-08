"""Builds the reusable audio library (run once; the skill ships its output in assets/audio/).
All sounds are synthesized here, so there are no licensing issues.

  python build_audio_library.py <out_dir>     → <out_dir>/sfx/*.wav and <out_dir>/music/<mood>.wav (8 s seamless loops)
"""
import json, os
import numpy as np, soundfile as sf
from scipy import signal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
R = np.random.default_rng(7)

def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a=.005, r=.1, curve=4):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    tt = np.linspace(0, 1, n); return e * np.exp(-curve * tt * (1 / max(r, 1e-3)) * (n / SR))
def adsr(n, a=.01, d=.1, s=.6, r=.1):
    e = np.ones(n) * s; na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na); e[na:na + nd] = np.linspace(1, s, len(e[na:na + nd])); e[-nr:] *= np.linspace(1, 0, nr); return e
def sine(f, d, ph=0): t = t_(d); return np.sin(2 * np.pi * np.cumsum(np.broadcast_to(f, t.shape)) / SR + ph)
def saw(f, d): t = t_(d); p = np.cumsum(np.broadcast_to(f, t.shape)) / SR; return 2 * (p % 1) - 1
def sq(f, d, duty=.5): t = t_(d); p = np.cumsum(np.broadcast_to(f, t.shape)) / SR; return np.where(p % 1 < duty, 1., -1.)
def noise(d): return R.standard_normal(int(d * SR))
def bp(x, lo, hi, o=2): return signal.sosfilt(signal.butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, 'high', fs=SR, output='sos'), x)
def norm(x, p=.9): return x / (np.abs(x).max() + 1e-9) * p
def glide(f0, f1, d, k=1): return f0 * (f1 / f0) ** (np.linspace(0, 1, int(d * SR)) ** k)
def cat(*xs): return np.concatenate(xs)
def sil(d): return np.zeros(int(d * SR))
def formant_voice(f0, d, vowel=(800, 1200), vib=6):
    t = t_(d); f = f0 * (1 + .03 * np.sin(2 * np.pi * vib * t)); src = saw(f, d)
    return bp(src, vowel[0] * .8, vowel[0] * 1.2) + .6 * bp(src, vowel[1] * .85, vowel[1] * 1.15)

# ---------------- SFX library ----------------
def sfx_all():
    S = {}
    def fit(x, d): n = int(d * SR); return np.pad(x, (0, max(0, n - len(x))))[:n]
    def at(x, o, d): return fit(np.pad(x, (int(o * SR), 0)), d)
    S['pop'] = norm(sine(glide(900, 300, .09, .5), .09) * env(int(.09 * SR), .002, .05))
    S['tick'] = norm(hp(noise(.02), 3000) * env(int(.02 * SR), .001, .01), .5)
    S['click'] = norm(cat(hp(noise(.012), 2500) * env(int(.012 * SR), .001, .006), sil(.04), .6 * hp(noise(.012), 2000) * env(int(.012 * SR), .001, .006)))
    w = noise(.45); S['whoosh'] = norm(bp(w, 300, 3000) * np.sin(np.linspace(0, np.pi, len(w))) ** 2 * np.linspace(.6, 1, len(w)))
    z = noise(.35); S['zoom'] = norm(bp(z, 600, 5000) * np.linspace(0, 1, len(z)) ** 2 * env(len(z), .001, 3, .3))
    def bell(fs, d=1.2): return norm(sum(sine(f, d) * env(int(d * SR), .002, d / (1 + i * 1.5)) * (1 / (1 + i)) for i, f in enumerate(fs)))
    S['ding'] = bell([1318, 2637, 3951, 5274], .9); S['ding2'] = bell([1568, 3136, 4704, 6272], .9); S['ding3'] = bell([2093, 4186, 6279, 8372], 1.0)
    S['chime'] = norm(sum(at(bell([f, f * 2.01, f * 3.0], 1.2), i * .09, 1.5) for i, f in enumerate([1047, 1319, 1568, 2093])))
    S['bling'] = norm(sum(at(bell([f, f * 2], .6), i * .05, .85) for i, f in enumerate([1568, 1976, 2349, 3136, 3951])))
    S['sparkle'] = norm(sum(at(sine(f, .25) * env(int(.25 * SR), .002, .1), o, .8) for f, o in zip(R.uniform(2500, 6000, 14), np.sort(R.uniform(0, .5, 14)))))
    S['magic'] = norm(sum(sine(glide(400 * k, 1600 * k, 1.0, .6), 1.0) / k for k in (1, 1.5, 2.01)) * adsr(SR, .05, .3, .5, .5) + .3 * fit(S['sparkle'], 1.0))
    S['swell'] = norm(sum(sine(f, 1.6) for f in (523, 659, 784, 1047)) * adsr(int(1.6 * SR), .5, .4, .7, .6) + .4 * fit(S['chime'], 1.6))
    S['power'] = norm(saw(glide(120, 900, .6, 1.5), .6) * adsr(int(.6 * SR), .01, .2, .7, .1) * .5 + bp(noise(.6), 500, 4000) * np.linspace(0, 1, int(.6 * SR)) * .5)
    S['boing'] = norm(sine(200 * (1 + .5 * np.sin(2 * np.pi * 14 * t_(.5)) * np.exp(-6 * t_(.5))) * glide(1, 1.8, .5), .5) * env(int(.5 * SR), .002, .4))
    S['buzz'] = norm(lp(sq(110, .45) + sq(116, .45), 2500) * adsr(int(.45 * SR), .005, .05, .9, .05), .7)
    S['sad_trombone'] = norm(cat(*[lp(saw(f * (1 + .02 * np.sin(2 * np.pi * 5 * t_(d))), d), 1800) * adsr(int(d * SR), .02, .05, .8, .08) for f, d in [(392, .28), (370, .28), (349, .28), (330, .9)]]))
    S['poof'] = norm(lp(noise(.4), 1800) * env(int(.4 * SR), .003, .25) + fit(sine(glide(180, 60, .2), .2) * env(int(.2 * SR), .001, .1), .4))
    S['thud'] = norm(sine(glide(140, 45, .3, .5), .3) * env(int(.3 * SR), .001, .2) + .4 * lp(noise(.3), 600) * env(int(.3 * SR), .001, .08))
    S['crash'] = norm(fit(S['thud'], .35) + .5 * hp(noise(.35), 1500) * env(int(.35 * SR), .001, .2))
    S['impact'] = norm(sine(glide(90, 40, .5), .5) * env(int(.5 * SR), .001, .5) + .5 * lp(noise(.5), 1200) * env(int(.5 * SR), .001, .12))
    S['slip'] = norm(sine(glide(600, 2400, .35, 2), .35) * adsr(int(.35 * SR), .01, .1, .8, .05) * .6 + .3 * bp(noise(.35), 2000, 6000) * env(int(.35 * SR), .01, .3))
    rp = bp(noise(.45), 800, 5000) * (np.abs(np.sin(2 * np.pi * 38 * t_(.45))) ** 3) * adsr(int(.45 * SR), .005, .1, .8, .1); S['rip'] = norm(rp)
    S['scratch'] = norm(bp(noise(.5), 300, 3000) * np.abs(np.sin(2 * np.pi * glide(6, 2, .5) * t_(.5))) * env(int(.5 * SR), .005, .5))
    S['record'] = norm(cat(S['scratch'][:int(.3 * SR)], sil(.05)))
    S['alarm'] = norm(cat(*[lp(sq(f, .18), 4000) * adsr(int(.18 * SR), .005, .02, .8, .02) for f in (880, 660, 880, 660)]), .6)
    S['glitch'] = norm(cat(*[lp(sq(R.uniform(80, 800), .04), 3000) for _ in range(8)]) * env(int(.32 * SR), .001, .3))
    S['fall'] = norm(lp(sq(glide(900, 120, 1.0), 1.0), 3000) * adsr(int(SR), .01, .1, .8, .2) * .5 + .4 * sine(glide(900, 120, 1.0), 1.0))
    S['hud'] = norm(cat(sine(880, .07) * env(int(.07 * SR), .001, .05), sine(1320, .12) * env(int(.12 * SR), .001, .1)))
    S['flash'] = norm(hp(noise(.25), 3000) * env(int(.25 * SR), .001, .12))
    S['step'] = norm(lp(noise(.08), 900) * env(int(.08 * SR), .001, .04))
    S['toss'] = norm(sum(at(S['pop'], o, .5) for o in (0, .08, .17, .24, .33)))
    S['confetti'] = norm(sum(at(hp(noise(.03), 2000) * env(int(.03 * SR), .001, .02), o, 1.2) for o in np.sort(R.uniform(0, 1.1, 40))) + .5 * fit(S['pop'], 1.2))
    S['bell'] = norm(sum(sine(f, 1.4) * (np.abs(np.sin(2 * np.pi * 18 * t_(1.4))) * .7 + .3) * env(int(1.4 * SR), .001, 1.2) / (i + 1) for i, f in enumerate((1180, 2370, 3560))), .6)
    # cartoon dog bark: two formant "ruff"s
    def ruff(): d = .13; return formant_voice(glide(520, 300, d), d, (700, 1500), 0) * env(int(d * SR), .003, .1)
    S['bark'] = norm(cat(ruff(), sil(.07), ruff()))
    # crowd laugh: many "ha" syllables from different voices
    def ha(f0, d=.11): return formant_voice(f0, d, (750, 1250)) * np.sin(np.linspace(0, np.pi, int(d * SR))) ** .5 + .15 * bp(noise(d), 800, 3000) * np.sin(np.linspace(0, np.pi, int(d * SR)))
    L = np.zeros(int(1.8 * SR))
    for v in range(9):
        f0 = R.uniform(170, 330); o = R.uniform(0, .25); n = R.integers(5, 9)
        for k in range(n):
            s = int((o + k * R.uniform(.15, .2)) * SR); x = ha(f0 * (1 - k * .03)) * (1 - k / n * .6)
            if s + len(x) < len(L): L[s:s + len(x)] += x
    S['laugh'] = norm(L)
    # crowd cheer: band-limited noise swell + "woo" glides
    n = int(2.0 * SR); C = bp(noise(2.0), 400, 3500) * adsr(n, .15, .4, .6, .8) * .6
    for v in range(7):
        d = R.uniform(.6, 1.1); o = R.uniform(0, .5); f0 = R.uniform(260, 520)
        x = formant_voice(glide(f0, f0 * 1.5, d, .6), d, (500, 900)) * adsr(int(d * SR), .05, .2, .7, .3)
        s = int(o * SR); C[s:s + len(x)] += x * .6
    S['cheer'] = norm(C)
    return S

# ---------------- Music ----------------
BPM = 120; BEAT = 60 / BPM
NOTE = lambda m: 440 * 2 ** ((m - 69) / 12)
PROG = {'main': [(60, 'M'), (67, 'M'), (69, 'm'), (65, 'M')], 'party': [(60, 'M'), (67, 'M'), (69, 'm'), (65, 'M')],
        'tense': [(57, 'm'), (53, 'M'), (50, 'm'), (52, 'M')], 'calm': [(65, 'M'), (60, 'M'), (62, 'm'), (58, 'M')],
        'love': [(65, 'M'), (60, 'M'), (62, 'm'), (58, 'M')]}
def chord(root, q): return [root, root + (4 if q == 'M' else 3), root + 7]
def kick(): d = .22; return sine(glide(130, 42, d, .4), d) * env(int(d * SR), .001, .18)
def snare(): d = .16; return .7 * bp(noise(d), 1200, 7000) * env(int(d * SR), .001, .09) + .4 * sine(190, d) * env(int(d * SR), .001, .06)
def hat(): d = .04; return hp(noise(d), 7000) * env(int(d * SR), .001, .02)
def pluck(f, d=.22): return lp(sq(f, d, .3), 3500) * env(int(d * SR), .002, .12)
def pad(fs, d): return lp(sum(saw(f * (1 + .003 * i), d) for i, f in enumerate(fs)), 1400) * adsr(int(d * SR), .25, .3, .8, .3)
def bell_n(f, d=.5): return (sine(f, d) + .3 * sine(2 * f, d)) * env(int(d * SR), .002, .3)

def section(mode, dur):
    n = int(dur * SR) + SR; out = np.zeros(n)
    def add(x, t, g=1.0):
        s = int(t * SR); e = min(n, s + len(x));
        if s < n: out[s:e] += x[:e - s] * g
    bar = 4 * BEAT; nb = int(np.ceil(dur / bar)) + 1
    for b in range(nb):
        root, q = PROG[mode][b % 4]; ch = chord(root, q); t0 = b * bar
        if mode in ('main', 'party'):
            for k in range(4): add(kick(), t0 + k * BEAT, .9 if k % 2 == 0 else .55)
            for k in (1, 3): add(snare(), t0 + k * BEAT, .55)
            for k in range(8): add(hat(), t0 + k * BEAT / 2, .25 if k % 2 else .15)
            for k in range(8): add(lp(sq(NOTE(root - 24 + (7 if k in (3, 7) else 0)), BEAT / 2 * .9, .5), 700) * adsr(int(BEAT / 2 * .9 * SR), .005, .05, .7, .03), t0 + k * BEAT / 2, .35)
            for k in (1, 3, 5, 7):
                for m in ch: add(pluck(NOTE(m)), t0 + k * BEAT / 2, .12)
            mel = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 24, ch[2] + 12, ch[1] + 12]
            for k, m in enumerate(mel):
                if mode == 'party' or k % 2 == 0: add(pluck(NOTE(m), .18), t0 + k * BEAT / 2, .16 if mode == 'party' else .1)
            if mode == 'party':
                for k in (1, 3): add(bp(noise(.08), 900, 4000) * env(int(.08 * SR), .001, .05), t0 + k * BEAT, .5)
        elif mode == 'tense':
            for k in range(8): add(lp(saw(NOTE(root - 12), BEAT / 2 * .8), 900) * adsr(int(BEAT / 2 * .8 * SR), .005, .05, .6, .05), t0 + k * BEAT / 2, .3)
            for k in range(4): add(kick(), t0 + k * BEAT, .5)
            for k in range(8): add(hat(), t0 + k * BEAT / 2, .2)
            add(pad([NOTE(m) for m in ch], bar), t0, .12)
        elif mode == 'calm':
            add(pad([NOTE(m) for m in ch], bar), t0, .16)
            for k in range(4): add(bell_n(NOTE(ch[k % 3] + 12), .9), t0 + k * BEAT, .08)
        elif mode == 'love':
            add(pad([NOTE(m) for m in ch] + [NOTE(ch[0] - 12)], bar), t0, .15)
            arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12] * 2
            for k, m in enumerate(arp): add(bell_n(NOTE(m), .7), t0 + k * BEAT / 2, .11)
            for k in (0, 2): add(kick() * .6, t0 + k * BEAT, .35)
            for k in (1, 3): add(.5 * bp(noise(.06), 1500, 6000) * env(int(.06 * SR), .001, .04), t0 + k * BEAT, .3)
    return out[:int(dur * SR)]


def loop_stem(mode):
    """Render 3 bars-cycles and keep the middle one: it already contains the tails of the previous cycle, so it tiles seamlessly."""
    cyc = 4 * 4 * BEAT                      # 4 bars = one chord progression = 8 s at 120 BPM
    x = section(mode, cyc * 3)
    return x[int(cyc * SR):int(2 * cyc * SR)]

if __name__ == '__main__':
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else 'audio_lib'
    os.makedirs(out + '/sfx', exist_ok=True); os.makedirs(out + '/music', exist_ok=True)
    for k, v in sfx_all().items(): sf.write(f"{out}/sfx/{k}.wav", v.astype(np.float32), SR)
    for m in PROG: sf.write(f"{out}/music/{m}.wav", norm(loop_stem(m), .9).astype(np.float32), SR)
    print('library written to', out)
