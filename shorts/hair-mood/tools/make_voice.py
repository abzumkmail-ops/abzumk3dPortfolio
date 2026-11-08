"""Build the narration track + word-level timing.

Usage:
  python tools/make_voice.py                     # free offline Kokoro kid voice (the series' default narrator voice)
  python tools/make_voice.py --external vo.mp3   # use a narration you generated elsewhere (e.g. ElevenLabs Valf)
         [--speed 1.25]                          # tempo applied to the external file (pitch preserved)

Outputs:
  audio/vo.wav          48 kHz mono narration
  data/words.json       {duration, lines:[{id,text,start,end,words:[{w,s,e}]}]}
"""
import argparse, json, os, re, subprocess, sys, difflib
import numpy as np, soundfile as sf, librosa

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
LINES = json.load(open(f"{ROOT}/data/script_lines.json"))

# Silence after each line: 0.10 s, plus the optional "gap" field of that line in script_lines.json
# (use 0.2–0.35 before punchlines / reveals for comedic timing).
GAP_DEFAULT = 0.10
KOKORO_DIR = os.environ.get("KOKORO_DIR", os.path.expanduser("~/.cache/itw-shorts/kokoro"))

ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()

def num_words(n):
    n = int(n)
    if n < 20: return ONES[n]
    if n < 100: return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
    if n < 1000: return ONES[n // 100] + " hundred" + ("" if n % 100 == 0 else " " + num_words(n % 100))
    if n < 1_000_000: return num_words(n // 1000) + " thousand" + ("" if n % 1000 == 0 else " " + num_words(n % 1000))
    return num_words(n // 1_000_000) + " million" + ("" if n % 1_000_000 == 0 else " " + num_words(n % 1_000_000))

def norm(tok):
    tok = tok.lower().replace("’", "'")
    tok = re.sub(r"[^a-z0-9']", "", tok)
    return tok

def kokoro_line_audio(kok, style, text):
    a, sr = kok.create(text, voice=style, speed=1.0, lang="en-us")
    # Kid voice: raise pitch + formants by 4 semitones. This also speeds speech up ~1.26x.
    ratio = 2 ** (4 / 12)
    a = librosa.resample(a.astype(np.float32), orig_sr=sr * ratio, target_sr=sr)
    a = librosa.resample(a, orig_sr=sr, target_sr=SR)
    a, _ = librosa.effects.trim(a, top_db=38)
    return a

def build_kokoro():
    from kokoro_onnx import Kokoro
    m = KOKORO_DIR + "/"
    if not os.path.exists(m + "kokoro-v1.0.onnx"): sys.exit(f"Kokoro model missing in {m}: run tools/setup.sh first")
    kok = Kokoro(m + "kokoro-v1.0.onnx", m + "voices-v1.0.bin")
    style = kok.get_voice_style("am_eric") * 0.6 + kok.get_voice_style("af_heart") * 0.4
    parts = [np.zeros(int(0.15 * SR), np.float32)]; spans = []; pos = len(parts[0])
    for ln in LINES:
        txt = ln["text"].replace("...", "…")
        a = kokoro_line_audio(kok, style, txt)
        gap = np.zeros(int((GAP_DEFAULT + ln.get("gap", 0)) * SR), np.float32)
        spans.append((pos / SR, (pos + len(a)) / SR)); pos += len(a) + len(gap)
        parts += [a, gap]
        print(ln["id"], f"{len(a)/SR:.2f}s")
    y = np.concatenate(parts)
    return y / (np.abs(y).max() + 1e-6) * 0.89, spans

def load_external(path, speed):
    tmp = f"{ROOT}/out/_ext.wav"
    flt = f"atempo={speed}" if abs(speed - 1) > 1e-3 else "anull"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-af", flt, "-ac", "1", "-ar", str(SR), tmp], check=True)
    y, _ = sf.read(tmp, dtype="float32")
    y, _ = librosa.effects.trim(y, top_db=40)
    y = np.concatenate([np.zeros(int(0.15 * SR), np.float32), y, np.zeros(int(0.4 * SR), np.float32)])
    return y / (np.abs(y).max() + 1e-6) * 0.89, None

def align(y, spans=None):
    """Word timings. With known line spans (Kokoro), each line is aligned on its own clip, so one bad Whisper
    segment can never shift other lines. Without spans (external MP3), align globally and repair degenerate words."""
    if spans:
        from faster_whisper import WhisperModel
        model = WhisperModel("small", device="cpu", compute_type="int8")
        out = []
        for ln, (s0, s1) in zip(LINES, spans):
            clip = librosa.resample(y[int(s0 * SR):int(s1 * SR)], orig_sr=SR, target_sr=16000).astype(np.float32)
            words = ln["text"].split(); rt = [norm(w) for w in words]
            segs, _ = model.transcribe(np.concatenate([np.zeros(3200, np.float32), clip, np.zeros(3200, np.float32)]),
                                       word_timestamps=True, initial_prompt=ln["text"], language="en")
            hyp = expand_hyp([(w.word, w.start - .2, w.end - .2) for sg in segs for w in sg.words])
            times = match(rt, hyp, 0.0, s1 - s0)
            ws_ = [{"w": w, "s": round(s0 + max(0, a), 3), "e": round(s0 + min(s1 - s0, b), 3)} for w, (a, b) in zip(words, times)]
            out.append({**ln, "start": round(s0, 3), "end": round(s1, 3), "words": ws_})
        print("aligned per line (exact line boundaries)")
        return out
    return align_global(y)

def expand_hyp(raw):
    hyp = []
    for word, a, b in raw:
        t = norm(word)
        if not t: continue
        if re.fullmatch(r"\d+(,\d+)*", t):
            ws_ = num_words(t.replace(",", "")).split(); d = (b - a) / len(ws_)
            hyp += [(x, a + i * d, a + (i + 1) * d) for i, x in enumerate(ws_)]
        else: hyp.append((t, a, b))
    return hyp

def match(rt, hyp, t_lo, t_hi):
    """Map reference tokens to hypothesis timings (difflib), drop degenerate/non-monotonic hits, interpolate the rest."""
    times = [None] * len(rt)
    sm = difflib.SequenceMatcher(a=rt, b=[h[0] for h in hyp], autojunk=False)
    for a0, b0, n in sm.get_matching_blocks():
        for k in range(n): times[a0 + k] = (hyp[b0 + k][1], hyp[b0 + k][2])
    last = t_lo
    for i, t in enumerate(times):  # degenerate (zero length) or going backwards → unknown
        if t is None: continue
        if t[1] - t[0] < .03 or t[0] < last - .01: times[i] = None
        else: last = t[1]
    i = 0
    while i < len(times):
        if times[i] is not None: i += 1; continue
        j = i
        while j < len(times) and times[j] is None: j += 1
        a = times[i - 1][1] if i > 0 else t_lo
        b = times[j][0] if j < len(times) else t_hi
        lens = [max(1, len(rt[k])) for k in range(i, j)]; tot = sum(lens); acc = a
        for k, Ln in zip(range(i, j), lens):
            d = (b - a) * Ln / tot; times[k] = (acc, acc + d); acc += d
        i = j
    return times

def align_global(y):
    from faster_whisper import WhisperModel
    y16 = librosa.resample(y, orig_sr=SR, target_sr=16000).astype(np.float32)
    model = WhisperModel("small", device="cpu", compute_type="int8")
    prompt = " ".join(l["text"] for l in LINES)
    segs, _ = model.transcribe(y16, word_timestamps=True, initial_prompt=prompt[:800], language="en")
    hyp = []  # (token, s, e)
    for s in segs:
        for w in s.words:
            t = norm(w.word)
            if not t: continue
            if t.isdigit() or re.fullmatch(r"\d+(,\d+)*", t):
                ws = num_words(t.replace(",", "")).split()
                d = (w.end - w.start) / len(ws)
                for i, x in enumerate(ws): hyp.append((x, w.start + i * d, w.start + (i + 1) * d))
            else:
                hyp.append((t, w.start, w.end))
    ref = []  # (line_idx, display_word)
    for li, ln in enumerate(LINES):
        for w in ln["text"].split():
            ref.append((li, w))
    rt = [norm(w) for _, w in ref]
    total = len(y) / SR
    times = match(rt, hyp, 0.15, total - 0.3)
    matched = len(rt)
    out = []
    for li, ln in enumerate(LINES):
        ws = [{"w": w, "s": round(times[k][0], 3), "e": round(times[k][1], 3)} for k, (l2, w) in enumerate(ref) if l2 == li]
        out.append({**ln, "start": ws[0]["s"], "end": ws[-1]["e"], "words": ws})
    print("aligned globally (degenerate timestamps repaired)")
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--external")
    ap.add_argument("--speed", type=float, default=1.25)
    a = ap.parse_args()
    y, spans = load_external(a.external, a.speed) if a.external else build_kokoro()
    sf.write(f"{ROOT}/audio/vo.wav", y, SR)
    lines = align(y, spans)
    json.dump({"duration": round(len(y) / SR, 3), "source": a.external or "kokoro-placeholder", "lines": lines},
              open(f"{ROOT}/data/words.json", "w"), indent=1)
    open(f"{ROOT}/data/words.js", "w").write("window.WORDS_DATA = " + open(f"{ROOT}/data/words.json").read() + ";\n")
    print("duration", round(len(y) / SR, 2))

if __name__ == "__main__":
    main()
