"""Build ONE self-contained Markdown file with everything needed to recreate The Nubiverse Shorts:
brand, owner preferences, specs, workflow, lessons learned, asset-recreation commands, and every source file
(with a tiny unpacker that rebuilds the folder tree).

  python3 make_handoff.py <repo_root> <out.md>
"""
import os, sys, glob, datetime

ROOT, OUT = sys.argv[1], sys.argv[2]
SK = ".claude/skills/in-this-world-shorts"
FENCE = "~" * 8

FILES = []
def add(pattern):
    for p in sorted(glob.glob(os.path.join(ROOT, pattern), recursive=True)):
        if os.path.isfile(p): FILES.append(os.path.relpath(p, ROOT))

for pat in [f"{SK}/SKILL.md", f"{SK}/references/*.md", f"{SK}/engine/index.html", f"{SK}/engine/sheet.html", f"{SK}/engine/catalog.html", f"{SK}/engine/js/*.js",
            f"{SK}/engine/fonts/OFL.txt", f"{SK}/scripts/*", f"{SK}/examples/**/*", f"{SK}/evals/**/*",
            "channel-branding/branding.html", "channel-branding/README.md", "asset-pack/README.md"]:
    add(pat)
FILES = [f for f in dict.fromkeys(FILES) if not f.endswith((".png", ".jpg", ".mp4", ".wav", ".ttf", ".onnx", ".bin", ".pyc", "make_handoff.py"))]

LANG = {".js": "js", ".py": "python", ".sh": "bash", ".md": "markdown", ".json": "json", ".html": "html", ".yaml": "yaml", ".txt": "text"}

HEADER = f"""# The Nubiverse: complete production handoff

*Generated {datetime.date.today().isoformat()}. One file containing everything an AI (or a person) needs to recreate and continue the animated
"In This World…" YouTube Shorts series: brand, the owner's preferences, specs, the production workflow, lessons learned,
how to recreate binary assets, and every source file.*

## 0. How to use this file (read first)
1. Save this file as `NUBIVERSE_HANDOFF.md`.
2. Copy the Python block in **section 10** into `unpack.py`, then run `python3 unpack.py NUBIVERSE_HANDOFF.md <target_dir>`.
   This writes every file from section 11 into its original path:
   `.claude/skills/in-this-world-shorts/…` (the production kit) and `channel-branding/…`.
3. Recreate the binary assets with the commands in **section 9** (fonts, voice model, sound library).
4. Read **sections 1–8**. To make a video, follow `.claude/skills/in-this-world-shorts/SKILL.md` (included in section 11).
   With Claude Code, this folder is a ready-to-use skill: open the target dir as a project and say "make the next video…".

## 1. What this is
A series of ~55 s vertical (1080×1920, 60 fps) animated Shorts. Each episode explores **one magical world rule**
("In this world, your shadow says what you're really thinking"), narrated in **first person by Nubi**, a 6th grader.
Everything is **drawn by code**: a deterministic HTML-Canvas engine with a reusable rig, so characters stay identical in every frame.
There are no AI-generated images. Rendering uses headless Chromium (Playwright) and FFmpeg. The narration is TTS, aligned word by word
with faster-whisper. Captions, lip-sync, sound effects and cuts are all anchored to narration words, so swapping the voice re-times the whole video.

## 2. Channel and brand
- **Channel name:** The Nubiverse · **handle:** @TheNubiverse (formerly @NubiRobloxx) · tagline: "In this world… every week".
- **Look:** blocky Roblox-*style* cartoon characters (big rounded-square heads, thick dark outlines, flat bright colours),
  but **stories are general premises, not Roblox gameplay**. Don't use Roblox logos or official icons.
- **Recurring cast:** Nubi (hero: black spiky hair, teal hoodie with white star), Lily (quiet crush: long brown hair, pink headband,
  yellow cardigan), Brayden (show-off rival: blond spikes, sunglasses on head, red puffer vest), classmates kidA–kidF, Mom, Grandma,
  Teacher, Lunch lady, Pop star, the dog.
- **Channel art** (`channel-branding/branding.html`): a 2560×1440 banner (title "THE NUBIVERSE", pill "IN THIS WORLD... EVERY WEEK",
  @TheNubiverse, with the cast in the hallway and Nubi's talking shadow) and an 800×800 icon (Nubi waving with his "♥ 1" counter).
  Render both with `node .claude/skills/in-this-world-shorts/scripts/shot.js "file://$PWD/channel-branding/branding.html?mode=banner" banner.png`
  (modes: banner, banner_safe, icon, icon_preview).
- **Title style:** short, curiosity-driven, one emoji: "In This World, Everyone Has A Like Counter ❤️", "Your Shadow Says What You're REALLY Thinking 👀".
  Description: 2 lines plus "Subscribe to The Nubiverse for a new 'In this world…' story every week!" and `#shorts #animation #inthisworld`.

## 3. The owner's preferences (learned the hard way, so respect them)
- **Deliver the finished MP4.** The owner doesn't want approval stops. Decide, deliver, then iterate on feedback.
- **Speed matters.** Use the parallel workflow: the voice generates while 3 shot-writer agents animate, and the audio mixes while frames render.
- **Voice:** a *male kid* voice, high-pitched but **easy to listen to** (not squeaky), at about **1.25x** speed. **One narrator voices every character**,
  the same as the channel's original Shorts. The preferred ElevenLabs voice is **"Valf – Anime Protagonist Charismatic"** (a library voice).
  The default free voice is a Kokoro blend (am_eric 0.6 + af_heart 0.4, pitched +4 semitones, which also speeds it up ~1.26x).
- **ElevenLabs free plan limits** (verified): library voices *cannot* be used through the API, only on the website. Voice design through the API is paid-only.
  Output formats above 128 kbps need the Creator plan. **Never spend the owner's credits without asking.** To use Valf, the owner generates the narration
  on elevenlabs.io and uploads the MP3, then you run `make_voice.py --external file.mp3 --speed 1.25`. The free plan also requires attribution and has no commercial licence.
- **Story:** a general "In this world" premise, a small love subplot with Lily that pays off sweetly at the end, a twist where the rule backfires, and a kind or clever resolution
  that uses the rule. Keep it kid-friendly for ages 9–13.
- **Don't scrape YouTube** (the bot check blocks cloud machines, and getting around it isn't OK). If you need the channel's style, ask the owner for MP3s.

## 4. Video specs
1080×1920 · 60 fps · H.264 (libx264, CRF 17, yuv420p) · AAC 192 kb/s 48 kHz · loudness −14 LUFS (true peak −1) · 45–56 s ·
captions in Lilita One (white with a thick black stroke, 1–3 words, emphasis colours green/yellow/red/pink) · a cut or new beat every 1–3 s.

## 5. Story formula (summary; the full guide is `references/story_style.md`)
Rule hook ("In this world…") → "You see…" mechanics plus 2 world jokes → "Me? …" underdog plus "Kids call me…" → "Then one day…" stakes
(often a goal or countdown HUD) → quick failed attempts → **mid-video "Subscribe, because…" at the cliffhanger** → twist →
"That's when I realized something." → resolution using the rule → **Lily love payoff** → "Subscribe if…" plus a last image that loops to the first.
185–200 words. Logic-check the rule (e.g. "family doesn't count", so "my one was never Mom" didn't imply Mom doesn't love him).

## 6. Production pipeline (summary; the full playbook is `SKILL.md`)
1. `scripts/setup.sh` (once): Python deps, Kokoro model to `~/.cache/itw-shorts/kokoro`, Whisper warm-up.
2. `scripts/new_project.sh <dir>` copies the engine, tools and audio library into a self-contained project.
3. Write `data/script_lines.json`, then **start `tools/make_voice.py` in the background** (~2–3 min). It produces `audio/vo.wav` and `data/words.js`.
4. Meanwhile write `story.js` (shared state: HUD, counters, recurring visual devices, music moods, caption colours) and `plan.md` (the shot table).
5. Spawn **3 shot-writer agents at once**, each writing `shots/partN.js` for a third of the lines and self-checking with contact sheets.
6. QA: `node tools/contact.js --check` (JS errors), `node tools/contact.js out.png --n 32` (look at it), then fix continuity across parts.
7. `bash tools/build.sh` writes ev.json, renders frames **while** the audio mixes, muxes, then runs `qa_final.sh` (frame count, black and frozen frames, loudness, silence).

## 7. Architecture
- `engine/js/core.js` – easing, springs, seeded RNG, `track()` keyframes, canvas helpers, word-time lookup (`wordT`, `lineT`).
- `engine/js/characters.js` – **one rig for everyone**: head, torso, 2 arms with separate hands, 2 legs, hair front/back layers, eyes, brows, mouth, with stable pivots.
  `CAST` holds style data per character. Views: front, q34, side, back. 17 expressions, 15 mouth shapes, jittered blinks, `lipShape()` lip-sync,
  actions (idle, talk, walk, run, celebrate, surprise, laugh, anticipate), a dog rig, and `drawSilhouette()` (fast shadows).
- `engine/js/env.js` – vector sets with parallax: hallway, concert, backyard, kitchen, gym/stage (custom banner), burst and soft backdrops.
- `engine/js/fx_ui.js` – deterministic particles, counter badges, goal HUD, subscribe button, stamps, pop text, word-synced captions.
- `engine/js/shotkit.js` – shot helpers (`P`, `C`, `camAt`, `ws`, `st`, props, thread, spotlight), `STORY` hooks, and the shot registry with a placeholder for missing parts.
- `engine/js/main.js` – `window.seek(t)`, `READY`, `END`, `EV` (events for the audio mixer). Transitions: cut, whip, zoom, flash.
- `scripts/` – make_voice.py (Kokoro or external MP3, per-line Whisper alignment), render.js (parallel deterministic capture),
  contact.js (QA sheets and --check), build_audio_library.py (synthesizes the 37 SFX and 5 music-mood loops), make_audio.py (mix with ducking), build.sh, qa_final.sh, setup.sh, new_project.sh, shot.js.

## 8. Lessons learned (each one cost real time)
1. **Never use `ctx.filter`.** Frames went from 0.15 s to 6 s (28-minute renders). Use `drawSilhouette()`.
2. JPEG frame capture (q 0.96) is visually identical to PNG (SSIM 0.996, PSNR 47 dB) and 1.6x faster.
3. Whisper sometimes collapses several lines onto one timestamp. Align per line using the known TTS line boundaries, and repair zero-length words.
4. Shared continuity (HUD, recurring devices, outfits, which set a location uses) must be in `story.js` and `plan.md` **before** agents start. Parallel agents can't see each other.
   When an agent invents a shared asset (e.g. an "audience side of the gym" backdrop), move it into story.js and update the other parts.
5. Crowds: at most 5 people across at scale 0.8, with badges at `bs: .82`. The HUD covers screen y 80–220, so keep faces and badges below about 300 while it's up.
6. In q34 and side views, arm angle + means forward. In front view, + means outward.
7. Long hair has a "back" layer drawn **behind the torso**. Otherwise it reads as a beard.
8. Caption emphasis words must not stay scaled up, or neighbouring words collide. Use word spacing of 44 px.
9. Props are drawn in hand space and rotate with the arm. For things that must stay upright (an umbrella), draw them in world space.
   The rig draws the head over the arms, so "hands over mouth" has to be drawn after the character.
10. Python 3.13: the `kokoro` pip package fails to build. Use **`kokoro-onnx`**.
11. Audio: music at 0.24 with voice ducking, SFX at volume × 0.75, then loudnorm to −14 LUFS. Whisper intelligibility of the mix should match the voice alone.
12. Logic-check every story for accidental sad implications (see the like-counter family rule).

## 9. Recreate the binary assets (not stored in this text file)
```bash
cd <target_dir>/.claude/skills/in-this-world-shorts
# fonts (SIL OFL)
curl -sSL -o engine/fonts/LilitaOne-Regular.ttf https://raw.githubusercontent.com/google/fonts/main/ofl/lilitaone/LilitaOne-Regular.ttf
curl -sSL -o engine/fonts/Fredoka-Variable.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/fredoka/Fredoka%5Bwdth,wght%5D.ttf"
# sound library (37 SFX + 5 music loops, all synthesized, ~3 s)
pip install numpy scipy soundfile && python3 scripts/build_audio_library.py assets/audio
# voice model (~350 MB, cached once per machine), Python deps, Whisper warm-up
bash scripts/setup.sh
```
Also needed: Node with `playwright` and Chromium, and `ffmpeg`.

## 10. Unpacker
```python
# unpack.py — usage: python3 unpack.py NUBIVERSE_HANDOFF.md <target_dir>
import re, sys, os
md = open(sys.argv[1], encoding="utf-8").read(); out = sys.argv[2]
n = 0
for m in re.finditer(r"^### FILE: (\\S+)\\n~{{8}}[^\\n]*\\n(.*?)\\n~{{8}}$", md, re.S | re.M):
    path = os.path.join(out, m.group(1)); os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w", encoding="utf-8").write(m.group(2) + "\\n")
    if path.endswith(".sh"): os.chmod(path, 0o755)
    n += 1
print(f"wrote {{n}} files into {{out}}")
```

## 11. Files
Every text file of the production kit, at its path relative to the target dir.
"""

def episodes():
    return """
## 8b. Episodes so far
| # | Title | Folder in the kit | Notes |
|---|---|---|---|
| 1 | In This World, Everyone Has A Like Counter ❤️ | `examples/like-counter/` | 28 shots, goal-tracker HUD, lunch-lady red herring, Lily payoff |
| 2 | Your Shadow Says What You're REALLY Thinking 👀 | `examples/shadow-thoughts/` (+ `plan.md`) | 27 shots by 3 parallel agents, talking-shadow system, SECRET HUD |
Recreate an episode: `bash scripts/new_project.sh my_ep --example like-counter`, then `cd my_ep && bash tools/build.sh`.
(For shadow-thoughts, also copy `examples/shadow-thoughts/plan.md` if you want the shot plan alongside it.)
"""

with open(OUT, "w", encoding="utf-8") as f:
    f.write(HEADER.replace("## 9. Recreate", episodes().lstrip() + "\n## 9. Recreate"))
    f.write(f"\n{len(FILES)} files:\n\n" + "\n".join(f"- `{p}`" for p in FILES) + "\n\n")
    for p in FILES:
        txt = open(os.path.join(ROOT, p), encoding="utf-8").read().rstrip("\n")
        assert FENCE not in txt, p
        lang = LANG.get(os.path.splitext(p)[1], "")
        f.write(f"### FILE: {p}\n{FENCE} {lang}\n{txt}\n{FENCE}\n\n")
print(f"{OUT}: {len(FILES)} files, {os.path.getsize(OUT) / 1024:.0f} KB")
