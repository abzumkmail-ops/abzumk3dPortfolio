# The Nubiverse: complete production handoff

*Generated 2026-11-08. One file containing everything an AI (or a person) needs to recreate and continue the animated
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

## 8b. Episodes so far
| # | Title | Folder in the kit | Notes |
|---|---|---|---|
| 1 | In This World, Everyone Has A Like Counter ❤️ | `examples/like-counter/` | 28 shots, goal-tracker HUD, lunch-lady red herring, Lily payoff |
| 2 | Your Shadow Says What You're REALLY Thinking 👀 | `examples/shadow-thoughts/` (+ `plan.md`) | 27 shots by 3 parallel agents, talking-shadow system, SECRET HUD |
Recreate an episode: `bash scripts/new_project.sh my_ep --example like-counter`, then `cd my_ep && bash tools/build.sh`.
(For shadow-thoughts, also copy `examples/shadow-thoughts/plan.md` if you want the shot plan alongside it.)

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
for m in re.finditer(r"^### FILE: (\S+)\n~{8}[^\n]*\n(.*?)\n~{8}$", md, re.S | re.M):
    path = os.path.join(out, m.group(1)); os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w", encoding="utf-8").write(m.group(2) + "\n")
    if path.endswith(".sh"): os.chmod(path, 0o755)
    n += 1
print(f"wrote {n} files into {out}")
```

## 11. Files
Every text file of the production kit, at its path relative to the target dir.

46 files:

- `.claude/skills/in-this-world-shorts/SKILL.md`
- `.claude/skills/in-this-world-shorts/references/shot_api.md`
- `.claude/skills/in-this-world-shorts/references/story_style.md`
- `.claude/skills/in-this-world-shorts/engine/index.html`
- `.claude/skills/in-this-world-shorts/engine/sheet.html`
- `.claude/skills/in-this-world-shorts/engine/js/characters.js`
- `.claude/skills/in-this-world-shorts/engine/js/core.js`
- `.claude/skills/in-this-world-shorts/engine/js/env.js`
- `.claude/skills/in-this-world-shorts/engine/js/fx_ui.js`
- `.claude/skills/in-this-world-shorts/engine/js/main.js`
- `.claude/skills/in-this-world-shorts/engine/js/shotkit.js`
- `.claude/skills/in-this-world-shorts/engine/fonts/OFL.txt`
- `.claude/skills/in-this-world-shorts/scripts/build.sh`
- `.claude/skills/in-this-world-shorts/scripts/build_audio_library.py`
- `.claude/skills/in-this-world-shorts/scripts/contact.js`
- `.claude/skills/in-this-world-shorts/scripts/make_audio.py`
- `.claude/skills/in-this-world-shorts/scripts/make_voice.py`
- `.claude/skills/in-this-world-shorts/scripts/new_project.sh`
- `.claude/skills/in-this-world-shorts/scripts/qa_final.sh`
- `.claude/skills/in-this-world-shorts/scripts/render.js`
- `.claude/skills/in-this-world-shorts/scripts/setup.sh`
- `.claude/skills/in-this-world-shorts/scripts/shot.js`
- `.claude/skills/in-this-world-shorts/examples/like-counter/script_lines.json`
- `.claude/skills/in-this-world-shorts/examples/like-counter/shots/part1.js`
- `.claude/skills/in-this-world-shorts/examples/like-counter/shots/part2.js`
- `.claude/skills/in-this-world-shorts/examples/like-counter/shots/part3.js`
- `.claude/skills/in-this-world-shorts/examples/like-counter/story.js`
- `.claude/skills/in-this-world-shorts/examples/shadow-thoughts/plan.md`
- `.claude/skills/in-this-world-shorts/examples/shadow-thoughts/script_lines.json`
- `.claude/skills/in-this-world-shorts/examples/shadow-thoughts/shots/part1.js`
- `.claude/skills/in-this-world-shorts/examples/shadow-thoughts/shots/part2.js`
- `.claude/skills/in-this-world-shorts/examples/shadow-thoughts/shots/part3.js`
- `.claude/skills/in-this-world-shorts/examples/shadow-thoughts/story.js`
- `.claude/skills/in-this-world-shorts/evals/new-episode-from-premise/case.yaml`
- `.claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/01-the-final-mp4-is-1080x1920-at-60-fps-h-2.md`
- `.claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/02-the-final-mp4-lasts-between-45-and-56-se.md`
- `.claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/03-the-exported-video-has-no-black-frames-a.md`
- `.claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/04-the-script-s-first-line-starts-with-in-t.md`
- `.claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/05-the-script-contains-a-mid-video-line-sta.md`
- `.claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/06-the-last-quarter-of-the-story-contains-a.md`
- `.claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/07-shots-are-split-across-at-least-three-sh.md`
- `.claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/08-characters-are-drawn-with-the-shared-rig.md`
- `.claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/09-wall-clock-time-from-the-request-to-the.md`
- `.claude/skills/in-this-world-shorts/evals/new-episode-from-premise/prompt.md`
- `channel-branding/branding.html`
- `channel-branding/README.md`

### FILE: .claude/skills/in-this-world-shorts/SKILL.md
~~~~~~~~ markdown
---
name: in-this-world-shorts
description: Produce a complete, fully animated vertical YouTube Short (1080×1920, 60 fps, ~50 s MP4 with kid narrator voice, word-synced captions, SFX and music) in the "In This World…" story format of the channel The Nubiverse (@TheNubiverse, formerly NubiRobloxx), using a ready-made code animation engine with a recurring cast of blocky Roblox-style characters (Nubi, Lily, Brayden, classmates, family). Use this skill whenever the user wants a new Short, episode, animated story video, "In this world" / "what if" story, or anything with Nubi and his friends, even if they only give a premise ("make one about shadows that talk") or just say "make the next video". Also use it to re-voice, re-edit or re-render an existing Short made with this engine.
---

# "In This World" Shorts: fast production

Every Short reuses the same engine, characters, sets, captions, HUD, sound library, music and narrator voice. A new video only needs
**a script**, **a story file** and **shot files**. The slow parts run in parallel: the voice generates while three shot-writer agents
animate their thirds of the story, and the audio mix runs while frames render. Target: **finished MP4 in about 25–35 minutes**.

Channel: **The Nubiverse** (@TheNubiverse). Video titles follow the pattern "Your Shadow Says What You're REALLY Thinking 👀" / "In This World, Everyone Has A Like Counter ❤️".

The user wants the **final product**, not a series of approval stops. Make good decisions yourself, deliver the video, then iterate on
feedback. (If the user explicitly asks to approve the script first, show it and wait.)

## Layout
```
<skill>/engine/        index.html, js/{core,characters,env,fx_ui,shotkit,main}.js, fonts/, sheet.html  (shared: don't fork per video)
<skill>/assets/audio/  sfx/*.wav (37 sounds), music/{main,tense,calm,party,love}.wav (8 s seamless loops)
<skill>/scripts/       setup.sh, new_project.sh, make_voice.py, render.js, contact.js, make_audio.py, build.sh, qa_final.sh
<skill>/references/    story_style.md (writing formula), shot_api.md (everything a shot writer needs)
<skill>/examples/like-counter/   a complete finished episode: script_lines.json, story.js, shots/part1-3.js
```
A project (one video) is self-contained: `new_project.sh` copies the engine, tools and audio library into it.

## Workflow

### Phase 0: setup (first time on a machine only, in the background)
`bash <skill>/scripts/setup.sh` installs the Python packages, downloads the Kokoro voice model (~350 MB) to `~/.cache/itw-shorts/kokoro`, and warms Whisper.
Start it in the background right away and write the story while it runs.

### Phase 1: story (you, about 3–5 min)
1. Read `references/story_style.md`. If the user gave no premise, pick one from the seeds or invent one in the same format.
2. Create the project: `bash <skill>/scripts/new_project.sh <project_dir>`. Use a folder the user can open, e.g. `<repo>/shorts/<slug>/`.
3. Write `data/script_lines.json` (185–200 words, 22–28 lines). Logic-check the rule.
4. **Start the voice immediately in the background**: `cd <project> && python3 tools/make_voice.py` (about 2–3 min). It produces `audio/vo.wav` and `data/words.js`.
   If the user supplied a narration MP3 (e.g. ElevenLabs "Valf" made on their website), use `python3 tools/make_voice.py --external file.mp3 --speed 1.25` instead.
   **Never spend the user's ElevenLabs API credits without asking.** Their free plan can't use library voices through the API anyway.
5. While the voice runs, write **`story.js`**: anything that spans several shots, so parallel agents stay consistent:
   counters or HUD (`STORY.hud` for the built-in goal tracker, or `STORY.hudDraw(ctx,T)` for a custom one), story state helpers (e.g. `nubiLikes(T)`), music moods (`STORY.music = () => [[0,'main'], [ws('L15','wrong'),'tense'], …]`),
   caption emphasis words (`STORY.capColors`, `STORY.capOverride`), and any one-off characters or new sets. Model it on `examples/like-counter/story.js`.
   Moods: main (bouncy comedy), tense (problem or countdown), calm (realization), party (win), love (ending).
   If the premise needs a recurring visual device (talking shadows, counters, a meter), build it here as a helper function so all agents draw it the same way.
6. Write **`plan.md`**: the contract for the shot writers. Include one row per shot (id, line id, set, characters and positions, action on which word, camera, transition, sfx).
   Also list continuity facts: who wears what when, counter values over time, and where recurring characters stand.
   Aim for a new visual beat every 1–3 s, about 25–30 shots. Mix wides, two-shots and close-ups, and put a reaction close-up after each big moment.
   Split the rows into **3 contiguous parts** of roughly equal duration.

### Phase 2: shots, in parallel (3 agents, about 8–15 min)
Spawn **three subagents in a single message** (general-purpose), one per part. Use this prompt for each, filled in:

```
You are a shot writer for an animated Short. Project: <project_dir>. Write ONLY <project_dir>/shots/part<N>.js.
1. Read <skill>/references/shot_api.md fully, then skim <skill>/examples/like-counter/shots/part2.js for style.
2. Read <project_dir>/plan.md, <project_dir>/story.js and <project_dir>/data/script_lines.json.
3. Implement shots <first id>–<last id> (lines <Lx>–<Ly>) exactly as planned, staging them so they read clearly with the sound off.
   Anchor every action and expression change to words with ws()/st(). <If N==1: "Your first shot must start at 0.">
4. Self-check as described at the end of shot_api.md (--check, then render a contact sheet of your lines and LOOK at it). Fix and repeat until clean.
Do not edit engine files, story.js, plan.md or other parts. If you need shared state that is missing, say so in your final message.
Reply with: the shots you wrote, anything you changed from the plan and why, and the path of your final contact sheet.
```
While they work, you have nothing blocking. If the voice finished, run `node tools/render.js --ev-only` once all parts exist.

### Phase 3: assemble, QA, render (you, about 10–15 min)
1. `node tools/contact.js --check` across the whole video, then `node tools/contact.js /tmp/full.png --n 32 --w 270` and **look at it**.
   Check continuity across part boundaries (outfits, counter values, positions), the readability of captions and counters, and that the first frame is a strong hook.
   Fix small issues yourself. Re-spawn an agent only for a large rework.
2. Render with `bash tools/build.sh`. It makes `ev.json`, then renders frames (4 parallel browser pages, JPEG capture) **while** the audio mixes, muxes the result and runs `qa_final.sh`.
   Run it in the background. Expect about 1,000 s for 55 s at 1080p60 on 4 cores. `PREVIEW=1` gives a 540p30 version in about 2 min, if you want an early look.
3. Check the QA output: the frame count matches duration × 60, there are no black frames, no frozen spans of 1 s or more, loudness is about −14 LUFS, and there's no audio silence of 1.5 s or more.
4. Make a contact sheet from the **exported file** (ffmpeg `fps=32/<dur>,scale=270:-1,tile=8x4`) and look at it.

### Phase 4: deliver
Copy `out/final_video.mp4` next to the project (or where the user wants it). Send the user the video plus the contact sheet.
Say plainly which voice was used (Kokoro placeholder or their MP3), and list anything you couldn't do. If the project is in a git repo and the user works with commits, commit the project (it has a `.gitignore`-friendly layout; skip `out/` except the final MP4).

## Re-voicing an existing Short (e.g. the user uploads the Valf MP3 later)
`cd <project> && python3 tools/make_voice.py --external valf.mp3 --speed 1.25 && bash tools/build.sh`. Everything re-times automatically because shots are anchored to words.
If the user changes a line's text, edit `script_lines.json`, regenerate the voice, and check the shots that reference changed words. `wordT` warns in the console if a word is missing.

## Why things are set up this way
- **Word-anchored timing** (`ws('L9','laughed')`) means the voice can change without re-editing animation, and it lets shot agents work before the voice exists.
- **One rig for everyone** keeps characters identical across scenes and episodes. Never draw a character by hand inside a shot.
- **story.js before agents**: parallel writers can't see each other's work, so all shared continuity has to be decided up front.
- **Contact sheets, not real-time playback**: frames are reproducible by seeking, so a 32-frame sheet is the fastest whole-video review.
- **Pre-built audio library**: the SFX and music loops are original synthesized sounds (`assets/audio`, rebuildable with `scripts/build_audio_library.py`), so there's nothing to license.
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/references/shot_api.md
~~~~~~~~ markdown
# Shot-writing API (for shot-writer agents)

You write one file, `shots/partN.js`, containing the shots for a range of script lines. The engine, cast, sets, captions,
HUD and audio already exist. Your job is staging: who stands where, what they do on which word, and where the camera looks.
Good worked examples are in the skill's `examples/like-counter/shots/part1.js`, `part2.js` and `part3.js`. Skim one before writing.

## File shape
```js
'use strict';
shots(() => {
  const S = [];
  const t1 = ws('L9', 'laughed');                 // word-anchored times: compute once, use in several places
  S.push({ id: 'S10', start: st('L9'), trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(560, 1080, 1.2),              // lt = seconds since this shot started
    draw(ctx, T, lt) { /* world-space drawing: characters, props, particles */ },
    ui(ctx, T, lt) { /* optional: screen-space pop-ups, stamps, spotlight */ },
    sfx: [[t1 - st('L9'), 'laugh', .6]] });       // [time relative to shot start, sfx name, volume 0..1]
  return S;
});
```
- You can test your part before the earlier parts exist: the engine fills the gap before your first shot with a placeholder.
- **Every frame is a pure function of `T`** (global seconds). Keep no state between frames. For randomness use `rng(seed)` or `hash(n)`, never `Math.random`.
- `st('L9')` is the line's first word minus 0.08 s (the cut lands just before the word). **The first shot of the video must have `start: 0`.**
  Usually there's one shot per line, but split a long line into two shots with `start: ws('L9','word') - .08`.
- `ws(id, word, n=0)` and `we(...)` give the start and end time of the n-th occurrence of `word` (lowercase, no punctuation) in that line. `LINE[id].start` and `.end` are also available.
  Anchor every action to words like this, so a different voice take re-times everything automatically.
- `end` is computed for you. A shot lasts until the next shot starts.

## Space and camera
- Logical canvas: 1080×1920. Drawing in `draw()` is in **world space**, where the floor line is **y = 1500** (`FLOOR`). On a gym stage the floor is y ≈ 1190.
- `camAt(x, y, zoom)` puts world point (x, y) at the screen centre (540, 960). Reference framings:
  | Framing | camera | character scale `s` |
  |---|---|---|
  | wide group (4–6 people) | `camAt(540, 1060, 1.0)` | .72–.8 |
  | medium / two-shot | `camAt(540, 1080, 1.2–1.4)` | .8 |
  | face close-up | `camAt(540, 1110, 2.0–2.3)` (character at x 540, y 1500, s .8) | .8 |
  | stage (y 1190) | `camAt(540, 1010, 1.35)` | .8 |
- Move the camera with `track([[0, camAt(...)], [1.2, camAt(...)]], lt)` (eased) or with a formula of `lt`. Add a slow drift (`z + lt * .05`) so no shot is static.
  For a shake, add `Math.sin(T * 60) * 8 * Math.exp(-(T - tHit) * 5)` to x, starting at an impact.
- **Keep heads and counters below screen y ≈ 300 while the goal HUD is visible**, because the HUD covers y 80–220. If a close-up pushes the badge too high, lower the camera's y.
- `capY` sets the caption line's screen y (default 1600). Keep it **below chins**: use 1640–1720 for close-ups and 1600–1660 for wides. If the shot has a subscribe button (at y 1460), use 1720.

## Characters (all share one rig, so designs never drift)
`C(ctx, name, pose, face, T)` draws the shadow and the character. `P({...})` makes a pose.

| name | look | role |
|---|---|---|
| `nubi` | black spiky hair, teal hoodie with white star (face `hoodie:false` gives an orange "1" tee) | narrator, 6th-grade hero |
| `lily` | long brown hair, pink headband, yellow cardigan, freckles | quiet crush (love payoff at the end) |
| `brayden` | blond spikes, sunglasses on head, red puffer vest | show-off rival (`ripped:true`, `waistHoodie:true` available) |
| `mom` | big curly red hair, green cardigan | parent |
| `grandma` | grey bun, glasses, purple cardigan + apron | grandparent |
| `teacher` | bun with pencil, glasses, blue blazer | teacher |
| `lunchlady` | hairnet, teal top + apron | cafeteria |
| `popstar` | pink swoop hair, sparkly purple jacket | celebrity |
| `kidA`…`kidF` | 6 classmates, each with distinct hair and colours (`KIDS` array) | crowds, friends |
| dog | `drawDog(ctx, x, y, s, T, {flip})` | pet |

New one-off characters: add an entry to `CAST` in **story.js**, not engine files, e.g. `CAST.coach = {...CAST.teacher, shirt:'#30CE65', sleeve:'#30CE65', hair:'cap', capC:'#EE384A', seed: 40};`.
Hair styles: nubi, lily, brayden, mom, grandma, teacher, popstar, hairnet, puff, cap, pony, buzz, curls, bob.

### Pose fields: `P({ x, y, s, flip, view, ... })`
- `x, y` are the feet in world space. `s` is the scale (.8 is standard; the full body is about 520·s px tall).
- `view`: `'front'` (default), `'q34'` (three-quarter, facing +x), `'side'`, or `'back'`. `flip: -1` mirrors to face −x.
- Arms (radians): `armL`, `armR`, plus hand tilt `handL` and `handR`.
  **In `front` view, + raises the arm outward. In `q34` and `side` views, + swings it forward**, toward the facing direction (2.2 ≈ thumbs-up or reaching up and forward).
- Legs: `legL`, `legR` swing. `liftL` and `liftR` (px) lift the feet in front view.
- Body: `bodyY` (negative is up; use it for jumps), `lean` (+ leans forward), `rot` (whole-body spin about the hips, e.g. `-TAU` for a backflip), `squash` (1 is normal; .5 is flattened), `head` (tilt), `headY`, `alpha`.

### Actions (they mutate and return the pose, so you can chain them)
`idle(p, T, seed, amt)` · `talk(p, T, seed, amt)` · `walk(p, T, speed, amt)` · `run(p, T, speed)` · `celebrate(p, T, amt)` · `surprise(p, T - tHit)` · `laugh(p, T, amt)` · `anticipate(p, T - t0, dur)` · `danceP(i, T)` (returns a dancing pose)
Typical pattern: `const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); if (T > tHit) surprise(p, T - tHit);`
Use **anticipation → action → overshoot/settle**: crouch with `anticipate` before a jump, and use `spring(T - t)` or `pop(T - t)` for snaps.
Moving across the floor: `x: lerp(x0, x1, easeOut(inv(tStart, tEnd, T)))` together with `walk(...)` while moving, then `idle` after.

### Face object
`{ expr, mouth, eyes:{open,pupil,shape}, lookX, lookY, blush, sweat, tears, red, pale, vein, noBlink, holding:{L: fn, R: fn} }`
- `expr`: neutral, happy, excited, surprised, angry, sad, crying, terrified, confused, smug, screaming, laughing, determined, love (heart eyes), shy, nervous, dazed (X eyes).
- Change expressions **on story words**, not randomly. For example: `expr: T > tHit ? 'surprised' : 'happy'`.
- **Lip-sync**: when a character speaks a line on screen (dialogue, or Nubi talking to camera in a close-up), set `mouth: lipShape(T, ['L10'])`.
  It returns null between words, which falls back to the expression's mouth. In wide narration shots, leave the mouth alone.
- Mouths: closed, smile, smallSmile, frown, flat, smirk, wavy, smallOpen, round, wideOpen, teethOpen, teeth, grin, laugh, scream, wail.
- Blinking is automatic (jittered every 2.5–4 s).
- Props go in `holding` (drawn in hand space): `holdTray`, `holdMic`, `holdBucket`, `holdBook`, `holdSign('TEXT')`, or your own `ctx => {...}`.

## Sets: `bg(ctx, T, cam)`
`envHallway(ctx,T,cam)` (lockers, posters) · `envKitchen(ctx,T,cam,{night})` (also the cafeteria, if you draw a serving counter in `draw`) · `envBackyard` · `envConcert` (+ `concertCrowd(ctx,T)` in front, inside `draw`) ·
`envGym(ctx,T,cam,{dim:0..1, noLights, banner:'TALENT SHOW', bannerC})` (school dance / assemblies, stage at y 1190) · `envBurst(ctx,T,c1,c2,spin)` (radial rays for hype close-ups) · `envSoft(ctx,T,c1,c2)` (floating hearts for emotional or love beats).
Need a new place? Draw it in story.js as a function `envX(ctx, T, cam)` in the same style: flat colours, 8–10 px dark outlines (`OUTLINE`), floor at 1500, and `par(cam, k)` for parallax.

## FX and UI
- `burst(ctx, x, y, T - t0, {kind, n, speed, gravity, life, size, angle, spread, colors, seed})` where kind is confetti, star, heart, dust, candy or sparkle.
- `speedLines(ctx, 540, 900, T, alpha)` (in `ui`) · `thread(ctx, x1, y1, x2, y2, progress0..1, T)` (glowing heart line) · `spotlight(ctx, x, darkness, 'r,g,b')` (in `ui`).
- Counter badge over a head: `badgeOver(ctx, name, pose, value, {state:'normal'|'gold'|'red'|'green', pop, glow, glowC, bs, t:T})`.
  Use `bs: .82` in crowds so badges don't overlap. `counterAt([[t, v], ...], T)` gives step values; `drawBadge(...)` draws a badge anywhere.
- Pop-ups (in `ui`): `popText(ctx, 'TEXT', x, y, T - t0, {size, fill, rot, dur})` · `stamp(ctx, 'STILL 1', 540, 620, T - t0, '#EE384A', 1.0)` ·
  `drawSubscribe(ctx, lt - .05, dur, y)` · `vignette(ctx, a, '238,56,74')` (red alarm).
- Text helper: `txt(ctx, s, x, y, size, fill, stroke, lineWidth)`. Always use code text for numbers, names and signs; never use images of text.

## Transitions (`trans`)
`'cut'` (default: hard cut with a tiny flash) · `'whip'` (whip pan with motion blur, adds a whoosh automatically) · `'zoom'` (punch-in, adds a zoom sound) · `'flash'` (white flash, for big time jumps) · `'none'` (first shot only).
Use mostly cuts. Use whip for location changes, zoom for reveals and reactions, and flash at most once or twice per video.

## SFX names (`sfx: [[relTime, name, vol]]`)
pop, tick, click, whoosh, zoom, ding, ding2, ding3, chime, bling, sparkle, magic, swell, power, boing, buzz, sad_trombone, poof, thud, crash,
impact, slip, rip, scratch, record, alarm, glitch, fall, hud, flash, step, toss, confetti, bell, bark, laugh, cheer.
Aim for one or two per shot, on the word that causes them. Typical volume is .4–.7.

## Performance (renders must stay fast)
- **Never use `ctx.filter`** (brightness, blur, etc.) in shots. It made frames about 40x slower (6 s instead of 0.15 s each) and turned a 4-minute render into 28 minutes.
  For dark silhouettes and shadow people, use `drawSilhouette(ctx, c2 => drawCharacter(c2, ...), alpha, color)`. It's fast and looks the same.
- Use `shadowBlur` glows sparingly (a few small elements per frame). Keep particle counts at 60 or fewer per burst.
- Profile if in doubt: `seek(t)` should take under about 80 ms at 1080p.

## Layout rules learned the hard way
1. At most 5 characters across at s .8, with x spacing of 190 px or more. Put extra people in a back row (y 1390, s .6).
2. Counters on tall hair (brayden, mom, teacher, popstar, grandma, lunchlady) sit higher automatically. Still check close-ups against the HUD.
3. Two-shot: put people at x ≈ 260–400 and 680–820, both in `q34`, with the right-hand person at `flip: -1` so they face each other.
4. Fixed rule: Nubi's hoodie state follows the story. Once he gives it away, every later shot uses `hoodie:false`. Ask the orchestrator or check story.js for state like this.
5. Particles that cover a face for more than about 0.3 s hide the reaction. Burst beside or above heads, not on them.

## Self-check before you hand back (required)
```bash
node tools/contact.js --check --lines L9-L17                     # JS errors anywhere in your lines → fix them
node tools/contact.js /tmp/partN.png --lines L9-L17 --n 12 --w 270  # then LOOK at the image (Read tool)
```
Look for: faces cut off or covered by captions, counters under the HUD, overlapping badges, characters floating above the floor,
limbs pointing the wrong way, empty or static framing. Fix, re-render the sheet, and look again. If `data/words.js` doesn't exist yet,
the voice is still generating. Write your code first, then wait (poll every 10 s, up to 5 min) before testing.
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/references/story_style.md
~~~~~~~~ markdown
# Story style: the "In This World" series (channel: The Nubiverse, @TheNubiverse, formerly @NubiRobloxx)

This is distilled from transcripts of the channel's own Shorts ("In This World, Paintings Can Talk" and "Hugging Charges Your Battery")
and the user's direction. The series uses **one magical world rule** told by **a 5th–7th grade kid in first person**,
with blocky Roblox-style cartoon visuals. **Stories are general premises, not Roblox-gameplay topics**
(the user explicitly rejected "your Roblox avatar…" stories). A **small love subplot** runs in the background and pays off sweetly at the very end.

## Title formats
"In This World, ___" · "Every ___ Comes With ___" · "Your ___ Decides ___" · "___ Makes You ___".
Examples from the channel: Your Name Is Your Superpower · Laughing Makes You FLY · You Only Get 1,000 Words · Hugging Charges Your Battery ·
Dogs Never Stop Growing · Every House Comes With A Ghost · Borrowed Items Fly Home At Midnight · Adults Can't See Kids.

## Beat formula (about 50 s, 22–28 lines, one visual beat per line)
| Time | Beat | Signature phrasing |
|---|---|---|
| 0–3 s | **Rule hook**: the rule in one breath, shown on screen from frame 1 | "In this world, …" |
| 3–9 s | **How it works + 2 world jokes** (pets, grandma, pop stars, teachers…) | "You see, …" |
| 9–14 s | **Underdog Nubi** + nickname | "Me? I …" / "Kids call me …" |
| 14–20 s | **Inciting event / rival / stakes**, often with a countdown or goal (HUD) | "Then one day, …" |
| 20–27 s | **Tries and fails**: quick comic attempts ("Still one.") | short fragments |
| 27–30 s | **Mid-video CTA at the cliffhanger** | "Subscribe, because …" |
| 30–36 s | **Twist**: the rule backfires or turns on someone | |
| 36–44 s | **Realization**: Nubi wins by using the world's own rule in a kind or clever way | "That's when I realized something." |
| 44–52 s | **Love payoff**: the quiet crush (usually Lily) and the rule reveal they like each other | short, sweet, no kissing |
| 52–55 s | **Closing CTA + loop**: last image echoes the first | "Subscribe if …" |

## Writing rules
- Write first person, Nubi speaking. **One narrator voices everyone**: dialogue lines are short and attributed by the visuals, not by "he said".
- Keep sentences short. Every line must be drawable. If you can't picture the shot, rewrite the line.
- Escalate: each beat should be bigger or sillier than the last.
- **Logic check the rule** before finishing. Ask "does any line accidentally imply something sad or wrong?"
  (Example from the like-counter story: "my one was never Mom" implied Mom didn't like him. That was fixed by adding "family doesn't count" and making the red herring the lunch lady.)
- Keep it kid-friendly (the audience is about 9–13): no romance beyond blushing, holding hands or heart-eyes, no meanness that isn't resolved, no real brands except "Roblox" in passing.
- Don't claim real Roblox features. Everything is a fictional world rule.
- Words for TTS: spell numbers as words ("nine hundred"), avoid symbols and abbreviations, use "..." for a dramatic pause, and use phonetic spellings in the voice text if needed.

## Length budget
The default narrator (Kokoro kid voice, pitched +4 st) runs about **215 wpm including pauses**, so **185–200 words gives about 52–55 s**.
An ElevenLabs "Valf" take at 1.25x is about the same pace. If the voice comes back over 56 s, cut a world joke. Don't speed the voice up further.

## `data/script_lines.json` format
```json
[
 {"id": "L0", "text": "In this world, everyone has a number above their head."},
 {"id": "L10", "text": "Bet you can't hit ten by Friday.", "speaker": "brayden", "gap": 0.2}
]
```
`id` values are L0, L1, … in order. `speaker` is informational, for lip-sync planning. `gap` is extra silence after the line in seconds (0.2–0.35 before reveals and punchlines).

## Recurring cast (keep them consistent across episodes)
Nubi (hero, teal hoodie) · Lily (quiet crush, yellow cardigan) · Brayden (show-off rival who usually gets humbled and then redeemed) ·
kidA–kidF (classmates) · Mom, Grandma, Teacher, Lunch lady · the dog. Reuse them before inventing new people. New one-offs go in story.js.

## Premise seeds (unused)
Your Shadow Says What You're Really Thinking · Every Lie Makes Your Nose Glow · Homework Does Itself If You Compliment It ·
Your Height Shows How Brave You Are · Every Kid Gets One Wish On Their 12th Birthday · Sneezing Swaps Bodies For 1 Minute ·
Your Hair Color Changes With Your Mood · Pets Can Vote · The Weather Copies The Teacher's Mood.
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/engine/index.html
~~~~~~~~ html
<!doctype html>
<html><head><meta charset="utf-8"><title>In This World Short</title>
<style>
@font-face{font-family:'Lilita One';src:url(engine/fonts/LilitaOne-Regular.ttf)}
@font-face{font-family:'Fredoka';src:url(engine/fonts/Fredoka-Variable.ttf);font-weight:300 700}
html,body{margin:0;background:#111}canvas{display:block;max-height:100vh;margin:auto}
</style></head>
<body><canvas id="c"></canvas>
<script src="data/words.js"></script>
<script src="engine/js/core.js"></script>
<script src="engine/js/characters.js"></script>
<script src="engine/js/env.js"></script>
<script src="engine/js/fx_ui.js"></script>
<script src="engine/js/shotkit.js"></script>
<script src="story.js"></script>
<!-- one file per shot-writer agent; missing files are simply skipped -->
<script src="shots/part1.js"></script>
<script src="shots/part2.js"></script>
<script src="shots/part3.js"></script>
<script src="shots/part4.js"></script>
<script src="shots/part5.js"></script>
<script src="engine/js/main.js"></script>
<script>
// Open index.html?play=1 in a browser to watch it live (no audio); index.html?t=12.5 shows one frame.
if (new URLSearchParams(location.search).has('play')) { const t0 = performance.now();
  const loop = () => { if (window.READY) seek(((performance.now() - t0) / 1000) % window.END); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
</script>
</body></html>
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/engine/sheet.html
~~~~~~~~ html
<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Lilita One';src:url(fonts/LilitaOne-Regular.ttf)}
@font-face{font-family:'Fredoka';src:url(fonts/Fredoka-Variable.ttf);font-weight:300 700}
body{margin:0;background:#333}</style></head><body><canvas id="c"></canvas>
<script src="js/core.js"></script><script src="js/characters.js"></script>
<script>
// Character / expression / pose QA sheet. ?mode=cast|expr|poses|views
const q=new URLSearchParams(location.search), mode=q.get('mode')||'cast';
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
async function go(){ await document.fonts.load('40px "Lilita One"');
 const label=(s,x,y)=>{ctx.font='34px Lilita One';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.strokeStyle='#000';ctx.lineWidth=6;ctx.strokeText(s,x,y);ctx.fillText(s,x,y);};
 if(mode==='cast'){ const names=Object.keys(CAST); cv.width=2400; cv.height=1500; ctx.fillStyle='#80CDF5';ctx.fillRect(0,0,cv.width,cv.height);
   names.forEach((n,i)=>{const x=170+(i%7)*340,y=680+Math.floor(i/7)*740; drawShadow(ctx,basePose({x,y,s:.55})); drawCharacter(ctx,n,basePose({x,y,s:.55}),{expr:'happy'},0.5); label(n,x,y+60);});
   drawDog(ctx,2050,1420,.6,0.3);}
 if(mode==='expr'){ const ex=Object.keys(EXPR); cv.width=2400; cv.height=1600; ctx.fillStyle='#24225B';ctx.fillRect(0,0,cv.width,cv.height);
   ex.forEach((e,i)=>{const x=170+(i%6)*400,y=480+Math.floor(i/6)*540; drawCharacter(ctx,i%2?'lily':'nubi',basePose({x,y:y+40,s:.9}),{expr:e,noBlink:true},1); label(e,x,y+80);});}
 if(mode==='poses'){ cv.width=2400; cv.height=1500; ctx.fillStyle='#65C75A';ctx.fillRect(0,0,cv.width,cv.height);
   const P=[['idle',p=>idle(p,1)],['walk',p=>walk(Object.assign(p,{view:'q34'}),.2)],['run',p=>run(Object.assign(p,{view:'side'}),.15)],['jump',p=>{p.bodyY=-120;p.legL=.5;p.legR=-.4;p.armL=2.2;p.armR=2.2;return p}],
     ['surprised',p=>surprise(p,.25)],['angry',p=>{p.lean=.12;p.armL=.9;p.armR=.9;return p}],['celebrate',p=>celebrate(p,.1)],['laugh',p=>laugh(p,.1)],['talk',p=>talk(p,.7)],['side view',p=>Object.assign(p,{view:'side'})],['3/4 view',p=>Object.assign(p,{view:'q34'})],['back view',p=>Object.assign(p,{view:'back'})]];
   const ex={surprised:'surprised',angry:'angry',celebrate:'excited',laugh:'laughing',talk:'happy'};
   P.forEach(([n,f],i)=>{const x=200+(i%6)*400,y=640+Math.floor(i/6)*720; const p=f(basePose({x,y,s:.6})); drawShadow(ctx,p); drawCharacter(ctx,'nubi',p,{expr:ex[n]||'neutral',mouth:n==='talk'?'wideOpen':undefined},1); label(n,x,y+60);});}
 window.DONE=true;}
go();
</script></body></html>
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/engine/js/characters.js
~~~~~~~~ js
// characters.js — reusable blocky character rig, faces, expressions, lip-sync and body actions.
'use strict';

// ---------------- Rig geometry (front view, feet at y=0) ----------------
const RIG = {
  headW: 232, headH: 206, headR: 54,
  torsoW: 192, torsoH: 176,
  armW: 64, armH: 168, handH: 52,
  legW: 90, legH: 150,
  get hipY() { return -this.legH; },
  get torsoTop() { return -this.legH - this.torsoH; },
};

// ---------------- Cast (style data only; all share the same rig) ----------------
const CAST = {
  nubi: { skin: '#F7C9A0', shirt: '#20BDBB', sleeve: '#20BDBB', pants: '#6B7080', shoes: '#F4F4F4', hair: 'nubi', hairC: '#2A2033',
          top: 'hoodie', tee: '#FF8528', brow: '#2A2033', seed: 1 },
  lily: { skin: '#F3C4A6', shirt: '#FFD447', sleeve: '#FFD447', pants: '#3E5BA9', shoes: '#FF5B9B', hair: 'lily', hairC: '#8A5A2B',
          top: 'cardigan', inner: '#FFFFFF', freckles: true, brow: '#6B4220', lashes: true, seed: 2 },
  brayden: { skin: '#F1C08E', shirt: '#FFFFFF', sleeve: '#FFFFFF', vest: '#EE384A', pants: '#C9A877', shoes: '#222331', hair: 'brayden', hairC: '#F2D45C',
             brow: '#C79A2E', seed: 3, tall: 1.06 },
  mom: { skin: '#E9B48A', shirt: '#4FA36B', sleeve: '#4FA36B', pants: '#2F3A5C', shoes: '#7A4B33', hair: 'mom', hairC: '#D9572B', brow: '#A8401E', lashes: true, seed: 4, tall: 1.12 },
  grandma: { skin: '#F2CDB0', shirt: '#9B6BC9', sleeve: '#9B6BC9', apron: '#FFFFFF', pants: '#6B5A7A', shoes: '#4A3A3A', hair: 'grandma', hairC: '#D8D8E0', brow: '#A0A0AA', glasses: true, lashes: true, seed: 5, tall: 1.02 },
  teacher: { skin: '#8D5A3B', shirt: '#2E62C9', sleeve: '#2E62C9', inner: '#F4F4F4', pants: '#23284A', shoes: '#111', hair: 'teacher', hairC: '#1E1414', brow: '#1E1414', glasses: true, lashes: true, seed: 6, tall: 1.12 },
  popstar: { skin: '#C98E66', shirt: '#B44BFF', sleeve: '#B44BFF', pants: '#1E1B33', shoes: '#FFD447', hair: 'popstar', hairC: '#FF5B9B', brow: '#5A1E3A', shades: true, sparkle: true, seed: 7, tall: 1.1 },
  lunchlady: { skin: '#E0A57E', shirt: '#30A08A', sleeve: '#30A08A', apron: '#FFFFFF', pants: '#2F3A5C', shoes: '#fff', hair: 'hairnet', hairC: '#6B3A1E', brow: '#4A2810', lashes: true, seed: 8, tall: 1.1 },
  kidA: { skin: '#C68B5E', shirt: '#FF5B9B', sleeve: '#FF5B9B', pants: '#2F3A5C', shoes: '#fff', hair: 'puff', hairC: '#2A1A12', brow: '#2A1A12', seed: 11 },
  kidB: { skin: '#F7D2B0', shirt: '#30CE65', sleeve: '#30CE65', pants: '#3A3F55', shoes: '#EE384A', hair: 'cap', hairC: '#5A3A1A', capC: '#2E62C9', brow: '#5A3A1A', seed: 12 },
  kidC: { skin: '#E8B48C', shirt: '#7B4BFF', sleeve: '#7B4BFF', pants: '#4A4F66', shoes: '#fff', hair: 'pony', hairC: '#1E1414', brow: '#1E1414', lashes: true, seed: 13 },
  kidD: { skin: '#9A6440', shirt: '#FFC83D', sleeve: '#FFC83D', pants: '#26324F', shoes: '#30CE65', hair: 'buzz', hairC: '#1A1210', brow: '#1A1210', seed: 14 },
  kidE: { skin: '#F2C29A', shirt: '#FF8528', sleeve: '#FF8528', pants: '#5B6B8C', shoes: '#fff', hair: 'curls', hairC: '#C1272D', brow: '#8A1E22', seed: 15 },
  kidF: { skin: '#D9A27A', shirt: '#80CDF5', sleeve: '#80CDF5', pants: '#3B3B4F', shoes: '#FF5B9B', hair: 'bob', hairC: '#2B2B2B', brow: '#2B2B2B', lashes: true, seed: 16 },
};

// ---------------- Expressions ----------------
// brow: raise(px), angle(rad, + = angry/inward-down), asym(px raise diff L-R)
// eyes: open(0..1.5), pupil(scale), shape
const EXPR = {
  neutral:   { brow: [0, 0, 0],      eyes: { open: 1, pupil: 1 },     mouth: 'closed' },
  happy:     { brow: [8, -.05, 0],   eyes: { open: .9, pupil: 1 },    mouth: 'smile' },
  excited:   { brow: [16, -.1, 0],   eyes: { open: 1.15, pupil: 1.05, shape: 'sparkle' }, mouth: 'grin' },
  surprised: { brow: [26, -.12, 0],  eyes: { open: 1.32, pupil: .72 }, mouth: 'round' },
  angry:     { brow: [-8, .42, 0],   eyes: { open: .8, pupil: .95 },  mouth: 'teeth' },
  sad:       { brow: [6, -.38, 0],   eyes: { open: .85, pupil: 1.05, lookY: .5 }, mouth: 'frown' },
  crying:    { brow: [8, -.42, 0],   eyes: { open: .7, pupil: 1.1, lookY: .3 }, mouth: 'wail', tears: true },
  terrified: { brow: [24, -.45, 0],  eyes: { open: 1.38, pupil: .55 }, mouth: 'scream', pale: true, sweat: true },
  confused:  { brow: [6, .1, 18],    eyes: { open: 1, pupil: .95 },   mouth: 'wavy' },
  smug:      { brow: [0, .12, -16],  eyes: { open: .58, pupil: 1, lookX: .3 }, mouth: 'smirk' },
  screaming: { brow: [22, -.3, 0],   eyes: { open: 1.4, pupil: .6 },  mouth: 'scream' },
  laughing:  { brow: [12, -.1, 0],   eyes: { shape: 'happy' },        mouth: 'laugh' },
  determined:{ brow: [-4, .25, 0],   eyes: { open: .92, pupil: 1 },   mouth: 'flat' },
  love:      { brow: [14, -.2, 0],   eyes: { shape: 'heart' },        mouth: 'smile', blush: true },
  shy:       { brow: [8, -.25, 0],   eyes: { open: .85, pupil: 1.05, lookX: -.4, lookY: .3 }, mouth: 'smallSmile', blush: true },
  nervous:   { brow: [10, -.35, 0],  eyes: { open: 1.05, pupil: .85 }, mouth: 'wavy', sweat: true },
  dazed:     { brow: [6, 0, 10],     eyes: { shape: 'x' },            mouth: 'wavy' },
};

// ---------------- Blink (deterministic, 2.5–4 s jittered) ----------------
function blinkAmt(seed, t) {
  const r = rng(seed * 7919 + 13); let bt = r() * 2;
  while (bt < t + 1) { const d = t - bt; if (d >= 0 && d < .14) return 1 - Math.sin(d / .14 * Math.PI) * .95; bt += 2.5 + r() * 1.5; }
  return 1;
}

// ---------------- Lip-sync from word timings ----------------
const VOWEL_SHAPE = { a: 'wideOpen', e: 'teethOpen', i: 'teethOpen', o: 'round', u: 'round', y: 'smallOpen' };
function lipShape(t, lineIds) {
  for (const id of lineIds) {
    const l = LINE[id]; if (!l || t < l.start - .02 || t > l.end + .03) continue;
    for (const w of l.words) {
      if (t < w.s || t > w.e) continue;
      const word = w.w.toLowerCase().replace(/[^a-z]/g, '');
      const groups = word.match(/[aeiouy]+|[^aeiouy]+/g) || ['a'];
      const k = Math.min(groups.length - 1, Math.floor((t - w.s) / Math.max(.01, w.e - w.s) * groups.length));
      const g = groups[k];
      if (/[aeiouy]/.test(g[0])) return VOWEL_SHAPE[g[0]] || 'smallOpen';
      if (/[mbp]/.test(g)) return 'closed';
      if (/[fv]/.test(g)) return 'teeth';
      return 'smallOpen';
    }
    return null; // between words in an active line
  }
  return null;
}

// ---------------- Pose helpers ----------------
function basePose(o = {}) {
  return Object.assign({ x: 0, y: 0, s: 1, flip: 1, rot: 0, lean: 0, bodyY: 0, squash: 1, head: 0, headY: 0,
    armL: .08, armR: .08, handL: 0, handR: 0, legL: .02, legR: .02, liftL: 0, liftR: 0, view: 'front', alpha: 1 }, o);
}
function idle(p, t, seed = 1, amt = 1) {
  const ph = seed * 1.7;
  p.bodyY += Math.sin(t * 2.4 + ph) * 4 * amt;
  p.head += Math.sin(t * 1.3 + ph) * .035 * amt;
  p.armL += Math.sin(t * 1.9 + ph) * .04 * amt; p.armR += Math.sin(t * 1.7 + ph + 1) * .04 * amt;
  return p;
}
function talk(p, t, seed = 1, amt = 1) { // speaking gestures
  const n1 = noise1(t * 2.2 + seed * 10), n2 = noise1(t * 2.6 + seed * 20 + 5);
  p.armR += (.25 + n1 * .35) * amt; p.armL += (.12 + n2 * .25) * amt;
  p.head += noise1(t * 1.8 + seed) * .07 * amt; p.headY += Math.abs(noise1(t * 4 + seed)) * -4 * amt;
  return p;
}
function walk(p, t, speed = 1, amt = 1) {
  const ph = t * speed * TAU;
  const sw = Math.sin(ph);
  if (p.view === 'front') { p.liftL = Math.max(0, sw) * 22 * amt; p.liftR = Math.max(0, -sw) * 22 * amt; p.legL += sw * .06; p.legR -= sw * .06; }
  else { p.legL = sw * .5 * amt; p.legR = -sw * .5 * amt; }
  p.armL = (p.view === 'front' ? .1 : 0) - sw * .55 * amt; p.armR = (p.view === 'front' ? .1 : 0) + sw * .55 * amt;
  p.bodyY -= Math.abs(Math.cos(ph)) * 10 * amt; p.lean += .04 * amt;
  return p;
}
function run(p, t, speed = 1.6) {
  const ph = t * speed * TAU, sw = Math.sin(ph);
  p.legL = sw * .85; p.legR = -sw * .85; p.armL = -sw * 1.1; p.armR = sw * 1.1;
  p.bodyY -= Math.abs(Math.cos(ph)) * 22; p.lean += .16; return p;
}
function celebrate(p, t, amt = 1) {
  const b = Math.abs(Math.sin(t * 7));
  p.armL = lerp(p.armL, 2.6 + Math.sin(t * 9) * .2, amt); p.armR = lerp(p.armR, 2.6 + Math.cos(t * 9) * .2, amt);
  p.bodyY -= b * 34 * amt; p.squash = 1 + (b - .5) * .06 * amt; p.head += Math.sin(t * 5) * .08 * amt; return p;
}
function surprise(p, dt) { // dt = time since trigger
  if (dt < 0) return p;
  const k = spring(dt, 2.6, 6);
  p.lean -= .16 * k * Math.exp(-dt * 1.5); p.armL = lerp(p.armL, 1.25, Math.min(1, k)); p.armR = lerp(p.armR, 1.25, Math.min(1, k));
  p.bodyY -= Math.max(0, Math.sin(Math.min(dt, .3) / .3 * Math.PI)) * 30; p.headY -= 10 * Math.exp(-dt * 3);
  return p;
}
function laugh(p, t, amt = 1) {
  p.bodyY += Math.abs(Math.sin(t * 16)) * -10 * amt; p.lean += (.12 + Math.sin(t * 16) * .03) * amt;
  p.armL = lerp(p.armL, -.35, amt); p.armR = lerp(p.armR, -.35, amt); p.head += Math.sin(t * 16) * .05 * amt; return p;
}
function anticipate(p, dt, dur = .18) { // crouch before an action
  const k = Math.sin(clamp(dt / dur) * Math.PI); p.squash = 1 - .14 * k; p.armL -= .3 * k; p.armR -= .3 * k; return p;
}

// ---------------- Drawing ----------------
function drawShadow(ctx, p) {
  ctx.save(); ctx.globalAlpha = .22 * p.alpha; ctx.translate(p.x, p.y);
  const h = Math.max(0, -p.bodyY);
  ellipse(ctx, 0, 0, 150 * p.s * (1 - Math.min(.5, h / 600)), 26 * p.s, '#000');
  ctx.restore();
}

function drawCharacter(ctx, chName, pose, face = {}, t = 0) {
  const c = CAST[chName], p = pose, R = RIG;
  ctx.save();
  ctx.globalAlpha = p.alpha;
  const S = p.s * (c.tall || 1);
  ctx.translate(p.x, p.y + p.bodyY * p.s);
  ctx.scale(S * p.flip, S);
  if (p.rot) { ctx.translate(0, -260); ctx.rotate(p.rot); ctx.translate(0, 260); }
  ctx.scale(1 / Math.sqrt(p.squash), p.squash);
  const view = p.view, side = view === 'side', q = view === 'q34';
  const tw = R.torsoW * (side ? .62 : q ? .88 : 1);
  const tx = side ? 0 : 0;
  const shoulderX = tw / 2 + R.armW / 2 - 8;
  const hipY = R.hipY, tTop = R.torsoTop;

  // --- far arm (side/3q) behind torso
  const armDraw = (which, ax, ang, hand, dim) => {
    ctx.save(); ctx.translate(ax, tTop + 26); ctx.rotate(ang);
    const sleeve = dim ? shade(c.sleeve, -.18) : c.sleeve;
    const skin = dim ? shade(c.skin, -.15) : c.skin;
    const hoodie = chName === 'nubi' && (face.hoodie ?? true);
    const sl = hoodie ? sleeve : (chName === 'nubi' ? c.tee : sleeve);
    const sleeveLen = (chName === 'nubi' && !hoodie) ? 70 : R.armH - R.handH + 6;
    if (sleeveLen < R.armH - R.handH) { box(ctx, -R.armW / 2, -26, R.armW, R.armH - R.handH + 20, 18, skin, 8); }
    box(ctx, -R.armW / 2, -26, R.armW, sleeveLen + 26, 20, sl, 8);
    ctx.translate(0, R.armH - R.handH); ctx.rotate(hand);
    box(ctx, -R.armW / 2 + 2, -4, R.armW - 4, R.handH + 6, 18, skin, 8);
    if (face.holding && face.holding[which]) face.holding[which](ctx);
    ctx.restore();
  };
  const legDraw = (lx, ang, lift, dim) => {
    ctx.save(); ctx.translate(lx, hipY - lift * .3); ctx.rotate(ang);
    const len = R.legH - lift;
    const pc = dim ? shade(c.pants, -.15) : c.pants;
    box(ctx, -R.legW / 2, -10, R.legW, len + 10, 14, pc, 8);
    if (face.ripped) { // torn pants → heart boxers
      ctx.save(); rr(ctx, -R.legW / 2 + 6, -6, R.legW - 12, 52, 10); ctx.clip();
      ctx.fillStyle = '#FF8FC0'; ctx.fillRect(-60, -20, 120, 90);
      for (let i = 0; i < 4; i++) { heartPath(ctx, -22 + (i % 2) * 40, 10 + Math.floor(i / 2) * 26, 9); ctx.fillStyle = '#EE384A'; ctx.fill(); }
      ctx.restore();
      ctx.beginPath(); ctx.moveTo(-R.legW / 2 + 4, 46); for (let i = 0; i <= 6; i++) ctx.lineTo(-R.legW / 2 + 4 + i * (R.legW - 8) / 6, 46 + (i % 2 ? 10 : -4));
      ctx.lineWidth = 6; ctx.strokeStyle = OUTLINE; ctx.stroke();
    }
    box(ctx, -R.legW / 2 - 4, len - 30, R.legW + 10, 34, 12, dim ? shade(c.shoes, -.15) : c.shoes, 8);
    ctx.restore();
  };

  if (side || q) {
    armDraw('L', side ? 6 : -shoulderX * .8, -p.armL, -p.handL, true);   // side/3q: + = forward
    legDraw(side ? 8 : -R.legW / 2 + 6, p.legL, p.liftL, true);
    legDraw(side ? -8 : R.legW / 2 - 6, p.legR, p.liftR, false);
  } else {
    legDraw(-R.legW / 2 - 1, p.legL, p.liftL, false);
    legDraw(R.legW / 2 + 1, -p.legR, p.liftR, false);
  }
  // --- torso
  ctx.save(); ctx.translate(0, hipY); ctx.rotate(p.lean); ctx.translate(0, -hipY);
  // long hair / buns sit behind the body
  ctx.save(); ctx.translate(0, tTop + 8 + p.headY); ctx.rotate(p.head);
  drawHair(ctx, c, 'back', R.headW * (side ? .86 : q ? .94 : 1), R.headH, view); ctx.restore();
  drawTorso(ctx, chName, c, tw, face, view);
  if (!(side || q)) { armDraw('L', -shoulderX, p.armL, p.handL, false); armDraw('R', shoulderX, -p.armR, -p.handR, false); }
  else armDraw('R', side ? -4 : shoulderX * .85, -p.armR, -p.handR, false);
  // --- head
  ctx.save(); ctx.translate(0, tTop + 8 + p.headY); ctx.rotate(p.head);
  drawHead(ctx, chName, c, face, view, t);
  ctx.restore();
  ctx.restore();
  ctx.restore();
}

function drawTorso(ctx, name, c, tw, face, view) {
  const R = RIG, x = -tw / 2, y = R.torsoTop, h = R.torsoH;
  if (name === 'nubi') {
    const hoodie = face.hoodie ?? true;
    if (hoodie) {
      box(ctx, x, y, tw, h + 6, 22, c.shirt, 8);
      if (view !== 'side') {
        rr(ctx, -tw * .32, y + h * .58, tw * .64, h * .3, 14); fillStroke(ctx, shade(c.shirt, -.12), 6);   // pocket
        starPath(ctx, -tw * .2, y + h * .34, 22, 10); fillStroke(ctx, '#fff', 5);                       // star patch
        ctx.lineWidth = 6; ctx.strokeStyle = '#fff';
        ctx.beginPath(); ctx.moveTo(-14, y + 12); ctx.lineTo(-16, y + 52); ctx.moveTo(14, y + 12); ctx.lineTo(16, y + 52); ctx.stroke();
      }
    } else {
      box(ctx, x, y, tw, h + 6, 22, c.tee, 8);
      if (view !== 'side') { ctx.font = '700 46px Lilita One'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.fillText('1', 0, y + 100); }
    }
  } else if (name === 'brayden') {
    box(ctx, x, y, tw, h + 6, 22, c.shirt, 8);
    rr(ctx, x, y, tw * .36, h + 6, 20); fillStroke(ctx, c.vest, 8);
    rr(ctx, x + tw * .64, y, tw * .36, h + 6, 20); fillStroke(ctx, c.vest, 8);
    ctx.strokeStyle = shade(c.vest, -.25); ctx.lineWidth = 4;
    for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x + 4, y + i * h / 4); ctx.lineTo(x + tw * .36 - 4, y + i * h / 4); ctx.moveTo(x + tw * .64 + 4, y + i * h / 4); ctx.lineTo(x + tw - 4, y + i * h / 4); ctx.stroke(); }
    if (face.waistHoodie) { // Nubi's hoodie tied around the waist
      const hc = CAST.nubi.shirt;
      box(ctx, x - 10, y + h - 30, tw + 20, 46, 18, hc, 8);
      box(ctx, -26, y + h - 26, 52, 40, 16, shade(hc, -.15), 7);
      box(ctx, -40, y + h + 8, 34, 80, 14, hc, 7); box(ctx, 6, y + h + 8, 34, 70, 14, hc, 7);
    }
  } else if (c.top === 'cardigan' || name === 'teacher') {
    box(ctx, x, y, tw, h + 6, 22, c.inner || '#fff', 8);
    rr(ctx, x, y, tw * .38, h + 6, 20); fillStroke(ctx, c.shirt, 8);
    rr(ctx, x + tw * .62, y, tw * .38, h + 6, 20); fillStroke(ctx, c.shirt, 8);
    if (name === 'lily') { circle(ctx, x + tw * .3, y + 60, 6, '#fff', 3); circle(ctx, x + tw * .3, y + 110, 6, '#fff', 3); }
  } else {
    box(ctx, x, y, tw, h + 6, 22, c.shirt, 8);
    if (c.apron) { rr(ctx, -tw * .34, y + 40, tw * .68, h - 30, 14); fillStroke(ctx, c.apron, 6); heartPath(ctx, 0, y + 105, 18); fillStroke(ctx, '#FF5B9B', 4); }
    if (c.sparkle) { for (let i = 0; i < 7; i++) { starPath(ctx, x + 25 + (i * 53) % (tw - 40), y + 30 + (i * 37) % (h - 40), 10, 4); fillStroke(ctx, '#FFD447', 0); } }
    if (name === 'mom') { ctx.fillStyle = shade(c.shirt, -.15); ctx.fillRect(-4, y + 6, 8, h - 6); }
  }
}

function drawHair(ctx, c, layer, hw, hh, view) {
  const col = c.hairC, top = -hh + 8;
  const ox = view === 'side' ? -hw * .1 : view === 'q34' ? -hw * .05 : 0;
  ctx.save(); ctx.translate(ox, 0);
  switch (c.hair) {
    case 'nubi': if (layer === 'front') {
      ctx.beginPath(); ctx.moveTo(-hw / 2 - 8, top + hh * .42);
      ctx.lineTo(-hw / 2 - 12, top + 30); ctx.quadraticCurveTo(-hw / 2 - 6, top - 26, -hw * .1, top - 30);
      ctx.quadraticCurveTo(hw * .35, top - 34, hw / 2 + 10, top + 20); ctx.lineTo(hw / 2 + 10, top + hh * .38);
      ctx.lineTo(hw * .36, top + 52); ctx.lineTo(hw * .26, top + 78); ctx.lineTo(hw * .14, top + 50); ctx.lineTo(0, top + 84);
      ctx.lineTo(-hw * .1, top + 52); ctx.lineTo(-hw * .24, top + 80); ctx.lineTo(-hw * .32, top + 52); ctx.lineTo(-hw * .42, top + 70);
      ctx.closePath(); fillStroke(ctx, col, 8);
      ctx.strokeStyle = shade(col, .25); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-hw * .25, top - 8); ctx.quadraticCurveTo(0, top - 18, hw * .2, top - 6); ctx.stroke();
    } break;
    case 'lily':
      if (layer === 'back') { rr(ctx, -hw / 2 - 34, top + 6, hw + 68, hh + 60, 46); fillStroke(ctx, col, 8); }
      else {
        ctx.beginPath(); ctx.moveTo(-hw / 2 - 14, top + hh * .62); ctx.quadraticCurveTo(-hw / 2 - 18, top - 26, 0, top - 22);
        ctx.quadraticCurveTo(hw / 2 + 18, top - 26, hw / 2 + 14, top + hh * .62); ctx.lineTo(hw / 2 - 16, top + hh * .5);
        ctx.quadraticCurveTo(hw * .2, top + 40, -hw * .05, top + 66); ctx.quadraticCurveTo(-hw * .3, top + 50, -hw / 2 + 14, top + hh * .55); ctx.closePath();
        fillStroke(ctx, col, 8);
        ctx.lineWidth = 16; ctx.strokeStyle = '#FF5B9B'; ctx.beginPath(); ctx.moveTo(-hw / 2 - 8, top + 22); ctx.quadraticCurveTo(0, top - 30, hw / 2 + 8, top + 22); ctx.stroke();
        ctx.lineWidth = 4; ctx.strokeStyle = OUTLINE; ctx.stroke();
      } break;
    case 'brayden': if (layer === 'front') {
      ctx.beginPath(); ctx.moveTo(-hw / 2 - 6, top + 50);
      const pts = 7; for (let i = 0; i <= pts; i++) { const x = -hw / 2 - 6 + i * (hw + 12) / pts; ctx.lineTo(x, top - 46 - (i % 2 ? 0 : 26) + Math.abs(i - 3.5) * 6); ctx.lineTo(x + (hw + 12) / pts / 2, top + 4); }
      ctx.lineTo(hw / 2 + 6, top + 50); ctx.quadraticCurveTo(0, top + 30, -hw / 2 - 6, top + 50); ctx.closePath(); fillStroke(ctx, col, 8);
      box(ctx, -hw * .42, top + 2, hw * .36, 30, 12, '#222331', 6); box(ctx, hw * .06, top + 2, hw * .36, 30, 12, '#222331', 6);
      ctx.fillStyle = '#80CDF5'; ctx.fillRect(-hw * .38, top + 8, 18, 6); ctx.fillRect(hw * .1, top + 8, 18, 6);
    } break;
    case 'mom':
      if (layer === 'back') { for (let i = 0; i < 9; i++) { const a = Math.PI * (.95 + i * .14); circle(ctx, Math.cos(a) * hw * .62, top + hh * .4 + Math.sin(a) * hh * .62, 46, col, 8); } }
      else { for (let i = 0; i < 6; i++) circle(ctx, -hw * .44 + i * hw * .176, top + 4 + (i % 2) * 10, 34, col, 7); }
      break;
    case 'grandma':
      if (layer === 'back') circle(ctx, 0, top - 30, 46, col, 8);
      else { ctx.beginPath(); ctx.moveTo(-hw / 2 - 6, top + 60); ctx.quadraticCurveTo(-hw / 2, top - 16, 0, top - 14); ctx.quadraticCurveTo(hw / 2, top - 16, hw / 2 + 6, top + 60);
        ctx.quadraticCurveTo(hw * .2, top + 22, 0, top + 30); ctx.quadraticCurveTo(-hw * .2, top + 22, -hw / 2 - 6, top + 60); fillStroke(ctx, col, 8); }
      break;
    case 'teacher':
      if (layer === 'back') { circle(ctx, 0, top - 34, 44, col, 8); ctx.save(); ctx.translate(0, top - 40); ctx.rotate(.5); box(ctx, -60, -7, 120, 14, 4, '#FFC83D', 5); ctx.restore(); }
      else { ctx.beginPath(); ctx.moveTo(-hw / 2 - 4, top + 50); ctx.quadraticCurveTo(-hw / 2, top - 14, 0, top - 12); ctx.quadraticCurveTo(hw / 2, top - 14, hw / 2 + 4, top + 50);
        ctx.quadraticCurveTo(0, top + 6, -hw / 2 - 4, top + 50); fillStroke(ctx, col, 8); }
      break;
    case 'popstar': if (layer === 'front') {
      ctx.beginPath(); ctx.moveTo(-hw / 2 - 8, top + 70); ctx.quadraticCurveTo(-hw / 2 - 30, top - 50, hw * .2, top - 50);
      ctx.quadraticCurveTo(hw / 2 + 50, top - 40, hw / 2 + 8, top + 60); ctx.quadraticCurveTo(hw * .1, top + 10, -hw / 2 - 8, top + 70); fillStroke(ctx, col, 8);
    } break;
    case 'hairnet':
      if (layer === 'front') { ctx.beginPath(); ctx.moveTo(-hw / 2 - 10, top + 50); ctx.quadraticCurveTo(-hw / 2 - 6, top - 50, 0, top - 52); ctx.quadraticCurveTo(hw / 2 + 6, top - 50, hw / 2 + 10, top + 50);
        ctx.quadraticCurveTo(0, top + 20, -hw / 2 - 10, top + 50); fillStroke(ctx, col, 8);
        ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3;
        for (let i = -8; i < 9; i++) { ctx.beginPath(); ctx.moveTo(i * 26, top - 60); ctx.lineTo(i * 26 + 80, top + 60); ctx.moveTo(i * 26, top - 60); ctx.lineTo(i * 26 - 80, top + 60); ctx.stroke(); } ctx.restore(); }
      break;
    case 'puff': if (layer === 'back') { circle(ctx, -hw * .42, top + 6, 54, col, 8); circle(ctx, hw * .42, top + 6, 54, col, 8); }
      else { ctx.beginPath(); ctx.moveTo(-hw / 2, top + 40); ctx.quadraticCurveTo(0, top - 30, hw / 2, top + 40); ctx.quadraticCurveTo(0, top + 18, -hw / 2, top + 40); fillStroke(ctx, col, 7); } break;
    case 'cap': if (layer === 'front') {
      ctx.beginPath(); ctx.moveTo(-hw / 2 - 6, top + 46); ctx.quadraticCurveTo(0, top - 50, hw / 2 + 6, top + 46); ctx.closePath(); fillStroke(ctx, c.capC, 8);
      box(ctx, -hw * .1, top + 30, hw * .72, 24, 10, shade(c.capC, -.2), 7); circle(ctx, 0, top - 14, 8, '#fff', 4);
    } break;
    case 'pony':
      if (layer === 'back') { ctx.save(); ctx.translate(hw / 2 + 10, top + 50); ctx.rotate(.4); box(ctx, -24, 0, 48, 120, 24, col, 8); ctx.restore(); }
      else { ctx.beginPath(); ctx.moveTo(-hw / 2 - 6, top + 56); ctx.quadraticCurveTo(-hw / 2, top - 18, 0, top - 16); ctx.quadraticCurveTo(hw / 2, top - 18, hw / 2 + 6, top + 56);
        ctx.quadraticCurveTo(hw * .1, top + 16, -hw / 2 - 6, top + 56); fillStroke(ctx, col, 8); } break;
    case 'buzz': if (layer === 'front') { ctx.beginPath(); ctx.moveTo(-hw / 2, top + 34); ctx.quadraticCurveTo(0, top - 18, hw / 2, top + 34); ctx.quadraticCurveTo(0, top + 14, -hw / 2, top + 34); fillStroke(ctx, col, 6); } break;
    case 'curls': if (layer === 'front') { for (let i = 0; i < 7; i++) circle(ctx, -hw * .48 + i * hw * .16, top + 2 + (i % 2) * 8, 26, col, 6); } break;
    case 'bob':
      if (layer === 'back') { rr(ctx, -hw / 2 - 18, top - 4, hw + 36, hh * .78, 40); fillStroke(ctx, col, 8); }
      else { ctx.beginPath(); ctx.moveTo(-hw / 2 - 14, top + 80); ctx.quadraticCurveTo(-hw / 2 - 10, top - 20, 0, top - 18); ctx.quadraticCurveTo(hw / 2 + 10, top - 20, hw / 2 + 14, top + 80);
        ctx.lineTo(hw / 2 - 10, top + 50); ctx.lineTo(-hw / 2 + 10, top + 50); ctx.closePath(); fillStroke(ctx, col, 8); } break;
  }
  ctx.restore();
}

function drawHead(ctx, name, c, f, view, t) {
  const R = RIG, side = view === 'side', q = view === 'q34', back = view === 'back';
  const hw = R.headW * (side ? .86 : q ? .94 : 1), hh = R.headH;
  const top = -hh + 8;
  let skin = c.skin;
  if (f.pale) skin = '#BFE3D8';
  box(ctx, -hw / 2, top, hw, hh, R.headR, skin, 9);
  // subtle cel highlight & jaw shade
  ctx.save(); rr(ctx, -hw / 2, top, hw, hh, R.headR); ctx.clip();
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ellipse(ctx, -hw * .22, top + hh * .28, hw * .22, hh * .16, 'rgba(255,255,255,.16)');
  ctx.fillStyle = 'rgba(80,30,40,.10)'; ctx.fillRect(-hw / 2, top + hh * .86, hw, hh * .2);
  if (f.red) { ctx.fillStyle = `rgba(238,56,74,${.35 * f.red})`; ctx.fillRect(-hw / 2, top, hw, hh); }
  ctx.restore();
  if (back) { rr(ctx, -hw / 2 - 4, top - 6, hw + 8, hh * .78, R.headR); fillStroke(ctx, c.hairC, 8); drawHair(ctx, c, 'front', hw, hh, view); return; }
  // face center (shifts toward facing direction)
  const fx = side ? hw * .2 : q ? hw * .1 : 0, fy = top + hh * .56;
  const E = EXPR[f.expr || 'neutral'];
  const eyes = Object.assign({ open: 1, pupil: 1, shape: null, lookX: 0, lookY: 0 }, E.eyes, f.eyes || {});
  const blink = f.noBlink ? 1 : blinkAmt(c.seed, t);
  const sep = side ? 0 : 50 * (q ? .92 : 1);
  const ey = fy - 20;
  const eyeList = side ? [fx + 20] : [fx - sep, fx + sep];
  for (let i = 0; i < eyeList.length; i++) drawEye(ctx, eyeList[i], ey, eyes, blink, f.lookX ?? eyes.lookX, f.lookY ?? eyes.lookY, c);
  // brows
  const [raise, ang, asym] = f.brow || E.brow;
  ctx.lineCap = 'round'; ctx.strokeStyle = c.brow; ctx.lineWidth = 12;
  for (let i = 0; i < eyeList.length; i++) {
    const L = side ? 1 : (i === 0 ? -1 : 1);
    const bx = eyeList[i], by = ey - 44 - raise - (L < 0 ? asym : 0) * .5 + (L > 0 ? asym : 0) * .5;
    ctx.save(); ctx.translate(bx, by); ctx.rotate(-L * ang);
    ctx.beginPath(); ctx.moveTo(-22, 2); ctx.quadraticCurveTo(0, -6, 22, 2); ctx.stroke(); ctx.restore();
  }
  if (c.glasses) { ctx.lineWidth = 6; ctx.strokeStyle = '#3b2a20'; for (const x of eyeList) { ctx.beginPath(); ctx.arc(x, ey, 34, 0, TAU); ctx.stroke(); } if (!side) { ctx.beginPath(); ctx.moveTo(eyeList[0] + 34, ey); ctx.lineTo(eyeList[1] - 34, ey); ctx.stroke(); } }
  if (c.shades) { for (const x of eyeList) box(ctx, x - 40, ey - 70, 80, 26, 10, '#222331', 5); }
  // cheeks / freckles / blush
  if (c.freckles) { ctx.fillStyle = '#B5733F'; for (const s of [-1, 1]) for (let k = 0; k < 3; k++) circle(ctx, fx + s * (62 + k * 9), fy + 14 + (k % 2) * 7, 3, '#B5733F'); }
  if (f.blush || E.blush) { ctx.globalAlpha *= .55; ellipse(ctx, fx - 70, fy + 20, 22, 12, '#FF5B9B'); ellipse(ctx, fx + 70, fy + 20, 22, 12, '#FF5B9B'); ctx.globalAlpha /= .55; }
  // mouth
  const shape = f.mouth || E.mouth;
  drawMouth(ctx, fx + (side ? 26 : 0), fy + 48, shape, f.mouthScale || 1);
  // extras
  if (f.sweat || E.sweat) { ctx.save(); ctx.translate(hw / 2 - 26, top + 54 + ((t * 40) % 20)); ctx.beginPath(); ctx.moveTo(0, -18); ctx.quadraticCurveTo(14, 4, 0, 12); ctx.quadraticCurveTo(-14, 4, 0, -18); fillStroke(ctx, '#7FD3FF', 5); ctx.restore(); }
  if (f.tears || E.tears) for (const s of side ? [1] : [-1, 1]) { const x = fx + s * (side ? 20 : sep); const k = (t * 1.6) % 1;
    ctx.save(); ctx.globalAlpha *= .9; box(ctx, x - 10, ey + 18, 20, 30 + k * 60, 10, '#6CC8FF', 4); ctx.restore(); }
  if (f.vein) { ctx.save(); ctx.translate(hw * .3, top + 40); ctx.strokeStyle = '#EE384A'; ctx.lineWidth = 7;
    for (const r of [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]) { ctx.save(); ctx.rotate(r); ctx.beginPath(); ctx.moveTo(4, 4); ctx.quadraticCurveTo(14, 4, 14, 14); ctx.stroke(); ctx.restore(); } ctx.restore(); }
  drawHair(ctx, c, 'front', hw, hh, view);
}

function drawEye(ctx, x, y, e, blink, lx, ly, c) {
  const shape = e.shape;
  if (shape === 'happy') { ctx.lineWidth = 9; ctx.strokeStyle = OUTLINE; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y + 10, 20, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); return; }
  if (shape === 'x') { ctx.lineWidth = 9; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.moveTo(x - 16, y - 16); ctx.lineTo(x + 16, y + 16); ctx.moveTo(x + 16, y - 16); ctx.lineTo(x - 16, y + 16); ctx.stroke(); return; }
  if (shape === 'heart') { heartPath(ctx, x, y + 6, 30); fillStroke(ctx, '#FF3D7F', 6); circle(ctx, x - 10, y - 6, 5, '#fff'); return; }
  const open = e.open * blink;
  const rx = 25, ry = 30 * open;
  if (open < .18) { ctx.lineWidth = 8; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.moveTo(x - 20, y + 2); ctx.quadraticCurveTo(x, y + 8, x + 20, y + 2); ctx.stroke(); return; }
  ctx.save();
  ellipse(ctx, x, y, rx, ry, '#fff', 5);
  ctx.beginPath(); ctx.ellipse(x, y, rx - 2, Math.max(1, ry - 2), 0, 0, TAU); ctx.clip();
  const px = x + lx * 9, py = y + ly * 10 + 3, pr = e.pupil;
  ellipse(ctx, px, py, 16 * pr, 20 * pr, '#2b1d16');
  circle(ctx, px - 6 * pr, py - 8 * pr, 6 * pr, '#fff'); circle(ctx, px + 5 * pr, py + 6 * pr, 2.6 * pr, '#fff');
  if (shape === 'sparkle') { starPath(ctx, px + 2, py - 2, 9, 3.5, 4); fillStroke(ctx, '#fff', 0); }
  ctx.restore();
  if (c.lashes) { ctx.lineWidth = 5; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.moveTo(x + (x > 0 ? 18 : -18), y - ry * .8); ctx.lineTo(x + (x > 0 ? 30 : -30), y - ry * .8 - 10); ctx.stroke(); }
}

function drawMouth(ctx, x, y, shape, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = OUTLINE;
  const dark = '#5a1424', tongue = '#FF7A8A';
  switch (shape) {
    case 'closed': ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-20, -2); ctx.quadraticCurveTo(0, 6, 20, -2); ctx.stroke(); break;
    case 'smile': ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-32, -8); ctx.quadraticCurveTo(0, 22, 32, -8); ctx.stroke(); break;
    case 'smallSmile': ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-18, -2); ctx.quadraticCurveTo(0, 12, 18, -2); ctx.stroke(); break;
    case 'frown': ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-28, 10); ctx.quadraticCurveTo(0, -12, 28, 10); ctx.stroke(); break;
    case 'flat': ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-22, 2); ctx.lineTo(22, 2); ctx.stroke(); break;
    case 'smirk': ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-24, 4); ctx.quadraticCurveTo(6, 10, 28, -10); ctx.stroke(); break;
    case 'wavy': ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-28, 2); for (let i = 1; i <= 6; i++) ctx.lineTo(-28 + i * 9.4, i % 2 ? -6 : 6); ctx.stroke(); break;
    case 'smallOpen': ellipse(ctx, 0, 2, 14, 11, dark, 7); break;
    case 'round': ellipse(ctx, 0, 4, 16, 20, dark, 7); ellipse(ctx, 0, 14, 9, 6, tongue); break;
    case 'wideOpen': ctx.beginPath(); ctx.moveTo(-28, -8); ctx.quadraticCurveTo(0, -12, 28, -8); ctx.quadraticCurveTo(26, 34, 0, 34); ctx.quadraticCurveTo(-26, 34, -28, -8); fillStroke(ctx, dark, 7);
      ellipse(ctx, 0, 24, 14, 8, tongue); break;
    case 'teethOpen': box(ctx, -26, -10, 52, 30, 12, dark, 7); ctx.fillStyle = '#fff'; ctx.fillRect(-21, -6, 42, 9); break;
    case 'teeth': box(ctx, -30, -12, 60, 26, 10, '#fff', 7); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-26, 1); ctx.lineTo(26, 1); ctx.stroke(); break;
    case 'grin': case 'laugh': {
      const k = shape === 'laugh' ? 1.3 : 1;
      ctx.beginPath(); ctx.moveTo(-36 * k, -10); ctx.lineTo(36 * k, -10); ctx.quadraticCurveTo(34 * k, 34 * k, 0, 36 * k); ctx.quadraticCurveTo(-34 * k, 34 * k, -36 * k, -10); fillStroke(ctx, dark, 8);
      ctx.save(); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(-40 * k, -10, 80 * k, 12); ellipse(ctx, 0, 30 * k, 18 * k, 12, tongue); ctx.restore(); break; }
    case 'scream': box(ctx, -28, -16, 56, 66, 26, dark, 8); ctx.save(); rr(ctx, -28, -16, 56, 66, 26); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(-28, -16, 56, 10); ellipse(ctx, 0, 44, 20, 12, tongue); ctx.restore(); break;
    case 'wail': ctx.beginPath(); ctx.moveTo(-34, 22); ctx.quadraticCurveTo(0, -26, 34, 22); ctx.quadraticCurveTo(0, 14, -34, 22); fillStroke(ctx, dark, 8); break;
  }
  ctx.restore();
}

// ---------------- Dog (quadruped rig) ----------------
function drawDog(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s);
  const bob = Math.abs(Math.sin(t * 6)) * 6, tail = Math.sin(t * 18) * .6;
  const fur = '#E2A35C', dark = '#9B6230';
  ctx.save(); ctx.globalAlpha = .2; ellipse(ctx, 0, 0, 170, 22, '#000'); ctx.restore();
  for (const [lx, ph] of [[-95, 0], [-55, 1], [55, 2], [95, 3]]) box(ctx, lx - 18, -78, 36, 78 + Math.sin(t * 6 + ph) * 2, 10, ph % 2 ? fur : dark, 7);
  ctx.save(); ctx.translate(-120, -150 - bob); ctx.rotate(-.6 + tail); box(ctx, -12, -70, 24, 74, 12, fur, 7); ctx.restore();
  box(ctx, -140, -170 - bob, 260, 110, 34, fur, 8);
  ellipse(ctx, -10, -110 - bob, 50, 30, '#F6D6A8');
  ctx.save(); ctx.translate(110, -210 - bob); ctx.rotate(Math.sin(t * 2) * .08);
  box(ctx, -70, -80, 150, 130, 34, fur, 8);
  box(ctx, -78, -90, 40, 80, 16, dark, 7); box(ctx, 52, -90, 40, 80, 16, dark, 7);  // ears
  box(ctx, 20, -10, 76, 56, 22, '#F6D6A8', 7); ellipse(ctx, 74, 0, 14, 10, OUTLINE);
  const bl = blinkAmt(99, t);
  for (const ex of [-14, 40]) { if (bl < .3) { ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(ex - 10, -30); ctx.lineTo(ex + 10, -30); ctx.stroke(); } else { ellipse(ctx, ex, -30, 11, 14 * bl, OUTLINE); circle(ctx, ex - 3, -35, 4, '#fff'); } }
  ctx.beginPath(); ctx.moveTo(40, 28); ctx.quadraticCurveTo(56, 70, 72, 30); fillStroke(ctx, '#FF7A8A', 6);
  ctx.restore();
  ctx.restore();
}

// ---------------- Fast silhouettes ----------------
// Draws `drawFn(ctx)` as a flat-colour silhouette. Much faster than ctx.filter = 'brightness(0)' (which re-rasterises
// every path through a filter): draw once to a reusable offscreen layer, tint it with 'source-in', composite back.
let _silCv = null;
function drawSilhouette(ctx, drawFn, alpha = .62, color = '#000') {
  const cv = ctx.canvas;
  if (!_silCv || _silCv.width !== cv.width || _silCv.height !== cv.height) { _silCv = document.createElement('canvas'); _silCv.width = cv.width; _silCv.height = cv.height; }
  const s = _silCv.getContext('2d');
  s.setTransform(1, 0, 0, 1, 0, 0); s.globalCompositeOperation = 'source-over'; s.globalAlpha = 1; s.clearRect(0, 0, cv.width, cv.height);
  s.setTransform(ctx.getTransform());
  drawFn(s);
  s.setTransform(1, 0, 0, 1, 0, 0); s.globalCompositeOperation = 'source-in'; s.fillStyle = color; s.fillRect(0, 0, cv.width, cv.height);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= alpha; ctx.drawImage(_silCv, 0, 0); ctx.restore();
}
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/engine/js/core.js
~~~~~~~~ js
// core.js — math, easing, deterministic randomness, drawing helpers.
// Everything is a pure function of time so any frame can be rendered by seeking directly.
'use strict';
const W = 1080, H = 1920;
const TAU = Math.PI * 2;
const OUTLINE = '#1b1530';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const inv = (a, b, v) => clamp((v - a) / (b - a));
const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
const easeIn = t => Math.pow(clamp(t), 3);
const easeInOut = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const backOut = (t, s = 1.9) => { t = clamp(t) - 1; return 1 + t * t * ((s + 1) * t + s); };
// Damped spring 0→1 with overshoot. t in seconds.
const spring = (t, f = 3.2, d = 7) => t <= 0 ? 0 : 1 - Math.exp(-d * t) * Math.cos(TAU * f * t);
// Pop-in scale: 0 → overshoot → 1
const pop = (t, dur = .32) => t <= 0 ? 0 : t >= dur * 2.5 ? 1 : spring(t / dur * .45, 2.2, 5.5);

// Deterministic hash noise
function hash(n) { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }
function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function noise1(x) { const i = Math.floor(x), f = x - i; return lerp(hash(i), hash(i + 1), f * f * (3 - 2 * f)) * 2 - 1; }

// Keyframe track: [[t, value, ease?], ...] → value at t (numbers or objects of numbers)
function track(keys, t) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1], [t1, v1, e] = keys[i];
      const k = (e || easeInOut)((t - t0) / (t1 - t0));
      if (typeof v0 === 'number') return lerp(v0, v1, k);
      const o = {}; for (const key in v1) o[key] = lerp(v0[key] ?? v1[key], v1[key], k); return o;
    }
  }
  return keys[keys.length - 1][1];
}

// ---------- canvas helpers ----------
function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function fillStroke(ctx, fill, lw = 8, stroke = OUTLINE) {
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
}
function box(ctx, x, y, w, h, r, fill, lw = 8) { rr(ctx, x, y, w, h, r); fillStroke(ctx, fill, lw); }
function circle(ctx, x, y, r, fill, lw = 0, stroke = OUTLINE) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); fillStroke(ctx, fill, lw, stroke); }
function ellipse(ctx, x, y, rx, ry, fill, lw = 0, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, TAU); fillStroke(ctx, fill, lw); }
function shade(hex, amt) { // amt -1..1 darken/lighten
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round(lerp(r, f, p)); g = Math.round(lerp(g, f, p)); b = Math.round(lerp(b, f, p));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function heartPath(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * .35);
  ctx.bezierCurveTo(x - s * 1.05, y - s * .35, x - s * .55, y - s * 1.05, x, y - s * .5);
  ctx.bezierCurveTo(x + s * .55, y - s * 1.05, x + s * 1.05, y - s * .35, x, y + s * .35);
  ctx.closePath();
}
function starPath(ctx, x, y, r1, r2, n = 5, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) { const r = i % 2 ? r2 : r1, a = rot + i * Math.PI / n; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
  ctx.closePath();
}
// Offscreen cache for static layers
const CACHE = {};
function cached(key, w, h, draw) {
  if (!CACHE[key]) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d')); CACHE[key] = c;
  }
  return CACHE[key];
}
function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

// ---------- narration timing ----------
let WORDS = null;           // data/words.json
const LINE = {};            // id → line
function lineT(id, wi = 0, edge = 's') { const l = LINE[id]; if (!l) return 0; const w = l.words[Math.max(0, Math.min(l.words.length - 1, wi < 0 ? l.words.length + wi : wi))]; return w[edge]; }
function wordT(id, word, occ = 0, edge = 's') { // time of the occ-th word in line matching `word`
  const l = LINE[id]; let c = 0;
  for (const w of l.words) if (w.w.toLowerCase().replace(/[^a-z0-9']/g, '') === word.toLowerCase()) { if (c++ === occ) return w[edge]; }
  console.warn('word not found', id, word); return l.start;
}
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/engine/js/env.js
~~~~~~~~ js
// env.js — layered vector environments. Each env draws in WORLD coordinates (floor line ~ y=1500)
// and takes the camera so far layers can parallax.
'use strict';
const FLOOR = 1500;

function par(cam, k) { return { dx: (cam.x - 540) * (1 - k), dy: (cam.y - 960) * (1 - k) * .5 }; }

function txt(ctx, s, x, y, size, fill, stroke = OUTLINE, lw = 0, font = 'Lilita One', align = 'center') {
  ctx.font = `${size}px "${font}"`; ctx.textAlign = align; ctx.textBaseline = 'middle';
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
  ctx.fillStyle = fill; ctx.fillText(s, x, y);
}

// ---------------- School hallway (day) ----------------
function envHallway(ctx, t, cam, o = {}) {
  ctx.fillStyle = '#FFE6BD'; ctx.fillRect(-3000, -2000, 9000, 6000);
  // far wall: windows with sky (parallax .5)
  let { dx } = par(cam, .55);
  ctx.save(); ctx.translate(dx, 0);
  for (let i = -3; i < 9; i++) {
    const x = i * 560 + 60;
    box(ctx, x, 180, 300, 420, 24, '#80CDF5', 10);
    ctx.fillStyle = '#fff'; ellipse(ctx, x + 90, 300, 60, 22, 'rgba(255,255,255,.9)'); ellipse(ctx, x + 200, 420, 46, 16, 'rgba(255,255,255,.8)');
    ctx.fillStyle = OUTLINE; ctx.fillRect(x + 146, 180, 8, 420); ctx.fillRect(x, 386, 300, 8);
  }
  ctx.restore();
  ctx.fillStyle = '#F2A65A'; ctx.fillRect(-3000, 700, 9000, 40);
  // lockers (parallax .85)
  ({ dx } = par(cam, .85));
  ctx.save(); ctx.translate(dx, 0);
  for (let i = -8; i < 26; i++) {
    const x = i * 150, col = i % 7 === 3 ? '#FF8528' : '#2E9CCA';
    box(ctx, x, 760, 146, 740, 10, col, 8);
    ctx.fillStyle = shade(col, -.25);
    for (let k = 0; k < 4; k++) box(ctx, x + 36, 800 + k * 22, 74, 8, 4, shade(col, -.25), 0);
    box(ctx, x + 112, 1040, 14, 70, 6, '#D8DDE8', 5);
  }
  // bulletin board + posters (o.board to show the final photo)
  if (o.posters !== false) {
    box(ctx, 860, 250, 520, 380, 20, '#C98B4B', 10);
    box(ctx, 890, 280, 220, 150, 8, '#FF5B9B', 6); txt(ctx, 'SCHOOL', 1000, 330, 46, '#fff'); txt(ctx, 'DANCE', 1000, 380, 46, '#FFD447');
    box(ctx, 1140, 300, 210, 130, 8, '#fff', 6); txt(ctx, 'FRIDAY', 1245, 365, 48, '#EE384A');
    box(ctx, 900, 460, 200, 140, 8, '#30CE65', 6); txt(ctx, 'BE KIND', 1000, 530, 44, '#fff');
    if (o.photo) o.photo(ctx);
  }
  ctx.restore();
  // floor
  const g = ctx.createLinearGradient(0, FLOOR, 0, FLOOR + 600); g.addColorStop(0, '#E9D3B0'); g.addColorStop(1, '#D9BE95');
  ctx.fillStyle = g; ctx.fillRect(-3000, FLOOR, 9000, 2000);
  ctx.strokeStyle = 'rgba(120,80,40,.25)'; ctx.lineWidth = 5;
  for (let i = -30; i < 40; i++) { ctx.beginPath(); ctx.moveTo(i * 160, FLOOR); ctx.lineTo(i * 160 + (i * 160 - cam.x) * .9, FLOOR + 900); ctx.stroke(); }
  for (let k = 1; k < 6; k++) { const y = FLOOR + k * k * 22; ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(6000, y); ctx.stroke(); }
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - 4, 9000, 10);
}

// ---------------- Concert stage (night) ----------------
function envConcert(ctx, t, cam) {
  const g = ctx.createLinearGradient(0, -400, 0, 1900); g.addColorStop(0, '#120C33'); g.addColorStop(1, '#3B1670');
  ctx.fillStyle = g; ctx.fillRect(-3000, -2000, 9000, 6000);
  // spotlights
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const cols = ['#FF5B9B', '#20BDBB', '#FFD447', '#7B4BFF'];
  for (let i = 0; i < 4; i++) {
    const a = Math.sin(t * 1.4 + i * 1.7) * .35, x = 100 + i * 300;
    ctx.save(); ctx.translate(x, -100); ctx.rotate(a);
    const lg = ctx.createLinearGradient(0, 0, 0, 1600); lg.addColorStop(0, cols[i] + 'aa'); lg.addColorStop(1, cols[i] + '00');
    ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.lineTo(260, 1600); ctx.lineTo(-260, 1600); ctx.fill(); ctx.restore();
  }
  ctx.restore();
  // big screen
  box(ctx, 140, 160, 800, 420, 30, '#24225B', 12);
  for (let i = 0; i < 30; i++) { const r = rng(i + 3); starPath(ctx, 180 + r() * 720, 200 + r() * 340, 12 + r() * 10, 5, 4, t * 2 + i); fillStroke(ctx, `hsla(${(i * 40 + t * 120) % 360},90%,70%,.85)`, 0); }
  txt(ctx, 'LIVE!', 540, 370, 150, '#FFD447', OUTLINE, 18);
  // stage
  box(ctx, -600, FLOOR - 60, 2300, 120, 10, '#2A1E4F', 10);
  ctx.fillStyle = '#FFD447'; for (let i = 0; i < 18; i++) circle(ctx, -400 + i * 120, FLOOR - 4, 10, (Math.floor(t * 6) + i) % 2 ? '#FFD447' : '#FF8528');
  ctx.fillStyle = '#1A1238'; ctx.fillRect(-3000, FLOOR + 60, 9000, 2000);
}
function concertCrowd(ctx, t) { // foreground silhouettes with phone lights
  for (let i = 0; i < 14; i++) {
    const x = -60 + i * 90, y = 1820 + (i % 3) * 30 + Math.sin(t * 6 + i) * 12;
    box(ctx, x - 50, y - 90, 100, 90, 22, '#0D0A22', 0); box(ctx, x - 60, y, 120, 200, 20, '#0D0A22', 0);
    if (i % 3 === 0) { ctx.save(); ctx.translate(x + 40, y - 140); ctx.rotate(Math.sin(t * 3 + i) * .3); box(ctx, -12, -30, 24, 44, 5, '#0D0A22', 0); circle(ctx, 0, -18, 8, '#FFF6C8'); ctx.restore(); }
  }
}

// ---------------- Backyard ----------------
function envBackyard(ctx, t, cam) {
  const g = ctx.createLinearGradient(0, -300, 0, FLOOR); g.addColorStop(0, '#5EB8F0'); g.addColorStop(1, '#BDE8FF');
  ctx.fillStyle = g; ctx.fillRect(-3000, -2000, 9000, 6000);
  let { dx } = par(cam, .3);
  ctx.save(); ctx.translate(dx, 0);
  for (let i = 0; i < 5; i++) { const x = ((i * 520 + t * 20) % 2600) - 600, y = 220 + (i % 2) * 160; for (const [ox, r] of [[0, 60], [60, 80], [130, 56]]) circle(ctx, x + ox, y, r, '#fff'); }
  ctx.restore();
  ({ dx } = par(cam, .7));
  ctx.save(); ctx.translate(dx, 0);
  for (let i = -6; i < 20; i++) { box(ctx, i * 110, 950, 96, 560, 14, '#F4E3C3', 7); ctx.beginPath(); ctx.moveTo(i * 110, 960); ctx.lineTo(i * 110 + 48, 900); ctx.lineTo(i * 110 + 96, 960); fillStroke(ctx, '#F4E3C3', 7); }
  box(ctx, -800, 1080, 3000, 30, 6, '#E2CBA4', 6); box(ctx, -800, 1340, 3000, 30, 6, '#E2CBA4', 6);
  // tree
  box(ctx, 900, 700, 90, 800, 16, '#8A5A2B', 8);
  for (const [x, y, r] of [[945, 640, 190], [820, 760, 140], [1080, 760, 150]]) { rr(ctx, x - r, y - r, r * 2, r * 2, 60); fillStroke(ctx, '#3FA34D', 9); }
  ctx.restore();
  // dog house
  box(ctx, -60, 1180, 340, 320, 14, '#EE384A', 9);
  ctx.beginPath(); ctx.moveTo(-100, 1200); ctx.lineTo(110, 1020); ctx.lineTo(320, 1200); ctx.closePath(); fillStroke(ctx, '#7B4BFF', 9);
  rr(ctx, 50, 1300, 120, 200, 60); fillStroke(ctx, '#2A1E1E', 8);
  ctx.fillStyle = '#65C75A'; ctx.fillRect(-3000, FLOOR, 9000, 2000);
  for (let i = 0; i < 80; i++) { const r = rng(i * 13); const x = -800 + r() * 2800, y = FLOOR + 20 + r() * 380; ctx.strokeStyle = '#4DAE45'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y - 22); ctx.moveTo(x, y); ctx.lineTo(x + 8, y - 20); ctx.stroke(); }
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - 3, 9000, 8);
}

// ---------------- Kitchen ----------------
function envKitchen(ctx, t, cam, o = {}) {
  ctx.fillStyle = o.night ? '#5A5F9A' : '#9FD8CB'; ctx.fillRect(-3000, -2000, 9000, 6000);
  // checker backsplash
  for (let i = -10; i < 30; i++) for (let k = 0; k < 4; k++) { ctx.fillStyle = (i + k) % 2 ? '#FFFFFF' : '#F2E8D5'; ctx.fillRect(i * 70, 860 + k * 70, 70, 70); }
  // window
  box(ctx, 340, 240, 400, 440, 24, o.night ? '#24225B' : '#BDE8FF', 10);
  if (o.night) { circle(ctx, 640, 340, 46, '#F2C786'); } else { circle(ctx, 450, 340, 50, '#FFD447'); }
  ctx.fillStyle = OUTLINE; ctx.fillRect(536, 240, 8, 440); ctx.fillRect(340, 456, 400, 8);
  box(ctx, 300, 200, 480, 60, 20, '#FF8528', 9);
  // upper cabinets
  for (let i = 0; i < 3; i++) { box(ctx, -560 + i * 280, 240, 260, 360, 16, '#F2C786', 9); box(ctx, -560 + i * 280 + 110, 500, 40, 14, 6, '#8A5A2B', 5); }
  for (let i = 0; i < 2; i++) { box(ctx, 980 + i * 280, 240, 260, 360, 16, '#F2C786', 9); }
  // fridge
  box(ctx, 1560, 360, 360, 1140, 30, '#E8F2F7', 10); box(ctx, 1560, 360, 360, 400, 30, '#E8F2F7', 10); box(ctx, 1600, 600, 22, 110, 8, '#B8C2CC', 5);
  // counter
  box(ctx, -900, 1140, 2440, 60, 12, '#FF5B9B', 9); box(ctx, -880, 1200, 2400, 300, 12, '#F2C786', 9);
  for (let i = 0; i < 8; i++) box(ctx, -860 + i * 300, 1230, 270, 250, 12, shade('#F2C786', -.06), 7);
  ctx.fillStyle = '#C9785B'; ctx.fillRect(-3000, FLOOR, 9000, 2000);
  for (let i = -20; i < 40; i++) { ctx.fillStyle = i % 2 ? '#B8664A' : '#C9785B'; ctx.fillRect(i * 140, FLOOR, 140, 900); }
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - 3, 9000, 8);
}

// ---------------- Gym / school dance (night) ----------------
function envGym(ctx, t, cam, o = {}) {
  const dim = o.dim || 0;
  const g = ctx.createLinearGradient(0, -200, 0, FLOOR); g.addColorStop(0, '#1D1846'); g.addColorStop(1, '#3A2C78');
  ctx.fillStyle = g; ctx.fillRect(-3000, -2000, 9000, 6000);
  let { dx } = par(cam, .6);
  ctx.save(); ctx.translate(dx, 0);
  // banner + bunting
  box(ctx, 140, 120, 800, 170, 26, o.bannerC || '#FF5B9B', 10); txt(ctx, o.banner || 'SCHOOL DANCE', 540, 210, 104, '#fff', OUTLINE, 14);
  for (let i = -6; i < 16; i++) { ctx.beginPath(); ctx.moveTo(i * 120, 330); ctx.lineTo(i * 120 + 120, 330); ctx.lineTo(i * 120 + 60, 410); ctx.closePath(); fillStroke(ctx, ['#FFD447', '#20BDBB', '#FF8528', '#30CE65'][(i + 12) % 4], 6); }
  // stage with curtains
  box(ctx, -200, 560, 1480, 640, 20, '#2B1E5C', 10);
  for (const s of [-1, 1]) { const x = s < 0 ? -200 : 1060; box(ctx, x, 560, 220, 640, 20, '#B3263A', 10); for (let k = 1; k < 4; k++) { ctx.strokeStyle = '#7E1A29'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x + k * 55, 580); ctx.lineTo(x + k * 55, 1180); ctx.stroke(); } }
  box(ctx, -260, 1180, 1600, 80, 10, '#8A5A2B', 10);
  ctx.restore();
  // disco ball
  const bx = 540 + dx * .3, by = 520;
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bx, -100); ctx.lineTo(bx, by - 90); ctx.stroke();
  circle(ctx, bx, by, 90, '#C8D2E8', 9);
  ctx.save(); ctx.beginPath(); ctx.arc(bx, by, 86, 0, TAU); ctx.clip();
  for (let i = -5; i < 6; i++) for (let k = -5; k < 6; k++) { const on = hash(i * 7 + k * 13 + Math.floor(t * 8)) > .6; ctx.fillStyle = on ? '#fff' : (i + k) % 2 ? '#9AA6C4' : '#B6C0DA'; ctx.fillRect(bx + i * 18 + ((t * 40) % 18), by + k * 18, 16, 16); }
  ctx.restore();
  // colored light beams
  if (!o.noLights) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1 - dim;
    const cols = ['#FF5B9B', '#20BDBB', '#FFD447', '#7B4BFF', '#30CE65'];
    for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(bx, by); ctx.rotate(t * .8 + i * TAU / 5);
      const lg = ctx.createLinearGradient(0, 0, 1400, 0); lg.addColorStop(0, cols[i] + '88'); lg.addColorStop(1, cols[i] + '00');
      ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -120); ctx.lineTo(1400, 120); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.restore();
  }
  // wood floor with light spots
  const fg = ctx.createLinearGradient(0, FLOOR, 0, FLOOR + 600); fg.addColorStop(0, '#C9874A'); fg.addColorStop(1, '#A86A35');
  ctx.fillStyle = fg; ctx.fillRect(-3000, FLOOR, 9000, 2000);
  ctx.strokeStyle = 'rgba(80,40,10,.3)'; ctx.lineWidth = 4;
  for (let i = -30; i < 40; i++) { ctx.beginPath(); ctx.moveTo(i * 120, FLOOR); ctx.lineTo(i * 120 + (i * 120 - cam.x) * .8, FLOOR + 800); ctx.stroke(); }
  if (!o.noLights) { ctx.save(); ctx.globalAlpha = .35 * (1 - dim); for (let i = 0; i < 8; i++) { const x = 540 + Math.sin(t * 1.3 + i * 2.1) * 700, y = FLOOR + 140 + (i % 3) * 110; ellipse(ctx, x, y, 110, 34, ['#FF5B9B', '#20BDBB', '#FFD447', '#7B4BFF'][i % 4]); } ctx.restore(); }
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - 3, 9000, 8);
  if (dim) { ctx.fillStyle = `rgba(10,8,30,${dim * .55})`; ctx.fillRect(-3000, -2000, 9000, 6000); }
}

// ---------------- Reaction backdrops (screen space) ----------------
function envBurst(ctx, t, c1 = '#FFD447', c2 = '#FF8528', spin = .3) {
  ctx.fillStyle = c1; ctx.fillRect(-2000, -2000, 6000, 6000);
  ctx.save(); ctx.translate(540, 900); ctx.rotate(t * spin); ctx.fillStyle = c2;
  for (let i = 0; i < 16; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 2400, i * TAU / 16, i * TAU / 16 + TAU / 32); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
function envSoft(ctx, t, c1 = '#FFB3D1', c2 = '#7B4BFF') {
  const g = ctx.createRadialGradient(540, 900, 50, 540, 900, 1400); g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(-2000, -2000, 6000, 6000);
  for (let i = 0; i < 24; i++) { const r = rng(i * 5 + 1); const x = r() * 1080, y = ((r() * 1920 - t * (40 + r() * 60)) % 2100 + 2100) % 2100 - 100;
    ctx.save(); ctx.globalAlpha = .35; heartPath(ctx, x, y, 18 + r() * 26); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore(); }
}
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/engine/js/fx_ui.js
~~~~~~~~ js
// fx_ui.js — deterministic particles, the like-counter badge, HUD, pop-ups and captions.
'use strict';

// ---------------- Particles (pure function of time since spawn) ----------------
const PCOLORS = ['#FF5B9B', '#FFD447', '#20BDBB', '#30CE65', '#FF8528', '#7B4BFF', '#fff'];
function burst(ctx, x, y, dt, o = {}) {
  if (dt < 0) return;
  const n = o.n || 24, life = o.life || 1.2, sp = o.speed || 900, gr = o.gravity ?? 1400, kind = o.kind || 'confetti';
  const r = rng(o.seed || 7);
  for (let i = 0; i < n; i++) {
    const a = (o.angle ?? -Math.PI / 2) + (r() - .5) * (o.spread ?? TAU), v = sp * (.45 + r() * .7), L = life * (.6 + r() * .5);
    const col = (o.colors || PCOLORS)[i % (o.colors || PCOLORS).length], rot = r() * TAU, size = (o.size || 18) * (.6 + r() * .8);
    if (dt > L) { r(); continue; }
    const px = x + Math.cos(a) * v * dt, py = y + Math.sin(a) * v * dt + .5 * gr * dt * dt;
    const k = dt / L;
    ctx.save(); ctx.globalAlpha *= 1 - easeIn(k); ctx.translate(px, py); ctx.rotate(rot + dt * (r() * 10 - 5));
    if (kind === 'confetti') { ctx.fillStyle = col; ctx.fillRect(-size / 2, -size / 4, size, size / 2); }
    else if (kind === 'star') { starPath(ctx, 0, 0, size, size * .45); fillStroke(ctx, col, 4); }
    else if (kind === 'heart') { heartPath(ctx, 0, 0, size); fillStroke(ctx, o.colors ? col : '#FF5B9B', 4); }
    else if (kind === 'dust') { ctx.globalAlpha *= .8; circle(ctx, 0, 0, size * (1 + k * 1.5), o.colors ? col : '#FFFFFF'); }
    else if (kind === 'candy') { box(ctx, -size, -size * .55, size * 2, size * 1.1, size * .5, col, 4); }
    else if (kind === 'sparkle') { starPath(ctx, 0, 0, size, size * .25, 4); fillStroke(ctx, '#FFF6B0', 0); }
    ctx.restore();
  }
}
function speedLines(ctx, cx, cy, t, a = 1, col = '#fff') {
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineCap = 'round';
  for (let i = 0; i < 28; i++) { const r = rng(i + Math.floor(t * 20) * 100); const ang = r() * TAU, r0 = 520 + r() * 300;
    ctx.lineWidth = 6 + r() * 10; ctx.beginPath(); ctx.moveTo(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0); ctx.lineTo(cx + Math.cos(ang) * (r0 + 500), cy + Math.sin(ang) * (r0 + 500)); ctx.stroke(); }
  ctx.restore();
}

// ---------------- Like-counter badge ----------------
// value: number or string. state: 'normal' | 'gold' | 'red' | 'glow'
function drawBadge(ctx, x, y, value, o = {}) {
  const s = (o.s || 1) * (o.pop ?? 1);
  if (s <= .01) return;
  const label = typeof value === 'number' ? fmt(value) : value;
  ctx.save(); ctx.translate(x, y + Math.sin((o.t || 0) * 3 + (o.seed || 0)) * 6); ctx.scale(s, s); ctx.rotate(o.rot || 0);
  ctx.font = '84px "Lilita One"';
  const tw = ctx.measureText(label).width, w = tw + 150, h = 112;
  const st = o.state || 'normal';
  const bg = st === 'gold' ? '#FFC83D' : st === 'red' ? '#EE384A' : st === 'green' ? '#30CE65' : '#222331';
  if (o.glow) { ctx.save(); ctx.shadowColor = o.glowC || '#FF5B9B'; ctx.shadowBlur = 50 * o.glow; box(ctx, -w / 2, -h / 2, w, h, h / 2, bg, 0); ctx.restore(); }
  box(ctx, -w / 2 + 6, -h / 2 + 10, w, h, h / 2, 'rgba(0,0,0,.25)', 0);
  box(ctx, -w / 2, -h / 2, w, h, h / 2, bg, 9);
  ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fillRect(-w / 2, -h / 2, w, h * .42); ctx.restore();
  heartPath(ctx, -w / 2 + 62, 4, 34); fillStroke(ctx, st === 'red' ? '#fff' : '#FF5B9B', 6);
  txt(ctx, label, -w / 2 + 112 + tw / 2, 6, 84, st === 'gold' ? '#3a2400' : '#fff', OUTLINE, st === 'gold' ? 0 : 10);
  ctx.beginPath(); ctx.moveTo(-18, h / 2 - 2); ctx.lineTo(0, h / 2 + 22); ctx.lineTo(18, h / 2 - 2); fillStroke(ctx, bg, 0);
  ctx.restore();
}
// world position of the top of a character's head
function headTop(name, p) { const c = CAST[name]; return p.y + (p.bodyY - (RIG.legH + RIG.torsoH + RIG.headH)) * p.s * (c.tall || 1); }
const HAIR_LIFT = { brayden: 62, mom: 40, teacher: 50, popstar: 48, grandma: 44, lunchlady: 46, kidA: 22, kidE: 14 };
function badgeOver(ctx, name, p, value, o = {}) { drawBadge(ctx, p.x, headTop(name, p) - (90 + (HAIR_LIFT[name] || 0)) * p.s - (o.lift || 0), value, Object.assign({ s: p.s * (o.bs || 1.0) }, o)); }

// Counter value animation helper: list of [time, value] steps (snap with a pop)
function counterAt(steps, t) { let v = steps[0][1], tt = -99; for (const [st, sv] of steps) if (t >= st) { v = sv; tt = st; } return { v, since: t - tt }; }

// ---------------- Pop-ups / stamps ----------------
function popText(ctx, s, x, y, dt, o = {}) {
  if (dt < 0 || (o.dur && dt > o.dur)) return;
  const k = pop(dt, .28) * (o.dur ? 1 - smooth(inv(o.dur - .2, o.dur, dt)) : 1);
  ctx.save(); ctx.translate(x, y - (o.rise || 0) * dt); ctx.rotate(o.rot || 0); ctx.scale(k, k);
  if (o.bg) { ctx.font = `${o.size || 110}px "Lilita One"`; const w = ctx.measureText(s).width + 80; box(ctx, -w / 2, -(o.size || 110) * .7, w, (o.size || 110) * 1.4, 34, o.bg, 10); }
  txt(ctx, s, 0, 0, o.size || 110, o.fill || '#fff', OUTLINE, o.lw ?? 20);
  ctx.restore();
}
function stamp(ctx, s, x, y, dt, col = '#EE384A', dur = 1.2) { // slam-in rubber stamp
  if (dt < 0 || dt > dur) return;
  const k = dt < .12 ? lerp(2.4, 1, easeOut(dt / .12)) : 1;
  ctx.save(); ctx.globalAlpha *= 1 - smooth(inv(dur - .2, dur, dt)); ctx.translate(x, y); ctx.rotate(-.14); ctx.scale(k, k);
  ctx.font = '120px "Lilita One"'; const w = ctx.measureText(s).width + 70;
  rr(ctx, -w / 2, -88, w, 170, 26); ctx.lineWidth = 16; ctx.strokeStyle = col; ctx.stroke();
  txt(ctx, s, 0, 4, 120, col, '#fff', 0);
  ctx.restore();
}

// ---------------- HUD: goal tracker (screen space, top) ----------------
function drawGoalHUD(ctx, o) { // o: {have, goal, day, alpha, done, pulse, danger}
  if (!o || o.alpha <= 0) return;
  ctx.save(); ctx.globalAlpha *= o.alpha; ctx.translate(540, 150 - (1 - o.alpha) * 120);
  const s = 1 + (o.pulse || 0) * .12; ctx.scale(s, s);
  const bg = o.done ? '#30CE65' : o.danger ? '#EE384A' : '#222331';
  box(ctx, -330, -66, 660, 132, 66, 'rgba(0,0,0,.3)', 0);
  box(ctx, -336, -74, 660, 132, 66, bg, 9);
  heartPath(ctx, -262, -2, 34); fillStroke(ctx, '#FF5B9B', 6);
  txt(ctx, o.done ? 'GOAL COMPLETE!' : `GOAL  ${o.have}/${o.goal}`, -200, -6, 62, '#fff', OUTLINE, 9, 'Lilita One', 'left');
  if (!o.done) { box(ctx, 150, -50, 150, 84, 30, o.danger ? '#fff' : '#FFC83D', 7); txt(ctx, o.day, 225, -6, 42, o.danger ? '#EE384A' : '#3a2400', OUTLINE, 0); }
  ctx.restore();
}
function drawSubscribe(ctx, dt, dur = 1.6, y = 1460) {
  if (dt < 0 || dt > dur) return;
  const k = pop(dt, .25) * (1 - smooth(inv(dur - .2, dur, dt)));
  ctx.save(); ctx.translate(540, y); ctx.scale(k, k);
  const pressed = dt > .55 && dt < .75;
  const col = dt > .7 ? '#555A70' : '#EE384A';
  box(ctx, -300, -80 + (pressed ? 8 : 0), 600, 160, 80, col, 10);
  txt(ctx, dt > .7 ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 2 + (pressed ? 8 : 0), 78, '#fff', OUTLINE, 10);
  // cursor hand
  const cx = lerp(380, 120, easeOut(inv(.15, .55, dt))), cy = lerp(220, 40, easeOut(inv(.15, .55, dt)));
  ctx.save(); ctx.translate(cx, cy + (pressed ? 10 : 0)); ctx.rotate(-.3);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 70); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 64); ctx.lineTo(70, 62); ctx.closePath(); fillStroke(ctx, '#fff', 8);
  ctx.restore();
  ctx.restore();
}
function vignette(ctx, a = .35, col = '0,0,0') {
  if (a <= 0) return;
  const g = ctx.createRadialGradient(540, 960, 500, 540, 960, 1250); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// ---------------- Captions ----------------
// Caption emphasis colors. Defaults below; story.js adds words via STORY.capColors / STORY.capOverride.
const CAP_DEFAULT = { red: ['subscribe', 'never', 'wrong', 'no'], green: ['yes', 'win', 'won'], yellow: [], pink: ['love'] };
const CAP_HEX = { white: '#FFFFFF', green: '#4BF07A', yellow: '#FFD447', red: '#FF4558', pink: '#FF7AC0' };
function capColor(lineId, w) {
  const k = w.toLowerCase().replace(/[^a-z']/g, '');
  const ov = (STORY.capOverride || {})[lineId + ':' + k]; if (ov !== undefined) return ov ? CAP_HEX[ov] : '#fff';
  for (const c in CAP_HEX) if (((STORY.capColors || {})[c] || []).includes(k) || (CAP_DEFAULT[c] || []).includes(k)) return CAP_HEX[c];
  return '#fff';
}
let CHUNKS = [];
function buildChunks() {
  CHUNKS = [];
  for (const l of WORDS.lines) {
    let cur = [];
    const flush = () => { if (cur.length) CHUNKS.push({ line: l.id, words: cur }); cur = []; };
    l.words.forEach((w, i) => {
      cur.push(w);
      const chars = cur.reduce((a, x) => a + x.w.length + 1, 0);
      const punct = /[.?!,…]$/.test(w.w), next = l.words[i + 1];
      if (punct || cur.length >= 3 || chars > 15 || (next && chars + next.w.length > 17)) flush();
    });
    flush();
  }
  CHUNKS.forEach((c, i) => { c.s = c.words[0].s; const nx = CHUNKS[i + 1]; c.e = Math.min(c.words[c.words.length - 1].e + .45, nx ? nx.words[0].s : 1e9); });
}
function drawCaptions(ctx, t, y = 1270, hidden = false) {
  if (hidden) return;
  const c = CHUNKS.find(c => t >= c.s - .02 && t < c.e); if (!c) return;
  const size = 104;
  ctx.font = `${size}px "Lilita One"`;
  const words = c.words.map(w => ({ ...w, text: w.w.toUpperCase().replace(/…/g, '...') }));
  const space = 44, widths = words.map(w => ctx.measureText(w.text).width);
  // wrap into rows of max 940px
  const rows = [[]]; let rw = 0;
  words.forEach((w, i) => { if (rw + widths[i] > 940 && rows[rows.length - 1].length) { rows.push([]); rw = 0; } rows[rows.length - 1].push(i); rw += widths[i] + space; });
  rows.forEach((row, ri) => {
    const total = row.reduce((a, i) => a + widths[i], 0) + space * (row.length - 1);
    let x = 540 - total / 2; const yy = y + (ri - (rows.length - 1) / 2) * (size * 1.05);
    row.forEach(i => {
      const w = words[i], dt = t - w.s;
      if (dt < -.02) { x += widths[i] + space; return; }
      const col = capColor(c.line, w.w), emph = col !== '#fff';
      const k = pop(dt + .02, emph ? .24 : .2);
      const rot = emph ? Math.sin(hash(w.s * 100) * 6) * .06 * Math.exp(-dt * 6) : 0;
      ctx.save(); ctx.translate(x + widths[i] / 2, yy); ctx.rotate(rot); ctx.scale(k, k);
      ctx.font = `${size}px "Lilita One"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillText(w.text, 6, 10);
      ctx.lineWidth = 22; ctx.strokeStyle = '#000'; ctx.strokeText(w.text, 0, 0);
      ctx.fillStyle = col; ctx.fillText(w.text, 0, 0);
      ctx.restore();
      x += widths[i] + space;
    });
  });
}
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/engine/js/main.js
~~~~~~~~ js
// main.js — deterministic renderer. Exposes window.seek(t), window.READY, window.END, window.EV.
// Loads after: data/words.js, engine js, story.js, shots/part*.js
'use strict';
let END = 60, SHOTS = [];
const cv = document.getElementById('c');
const Q = new URLSearchParams(location.search);
const OUT_W = +(Q.get('w') || 1080);
cv.width = OUT_W; cv.height = Math.round(OUT_W * 16 / 9);
const ctx = cv.getContext('2d');
const K = OUT_W / W;

function shotAt(t) { let s = SHOTS[0]; for (const x of SHOTS) if (t >= x.start) s = x; return s; }

function seek(t) {
  t = clamp(t, 0, END - 1e-4);
  const s = shotAt(t), lt = t - s.start;
  let cam = s.cam(lt);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.setTransform(K, 0, 0, K, 0, 0);

  // --- transition-in modifiers
  let ox = 0, zmul = 1, blur = 0;
  if (s.trans === 'whip' && lt < .2) { const k = 1 - easeOut(lt / .2); ox = k * 1100; blur = k * 26; }
  if (s.trans === 'zoom' && lt < .22) { zmul = 1 + (1 - easeOut(lt / .22)) * .45; blur = (1 - lt / .22) * 10; }

  ctx.save();
  if (blur > .5) ctx.filter = `blur(${(blur * K).toFixed(1)}px)`;
  ctx.translate(W / 2 + ox, H / 2); ctx.rotate(cam.rot || 0); ctx.scale(cam.z * zmul, cam.z * zmul); ctx.translate(-cam.x, -cam.y);
  s.bg(ctx, t, cam);
  s.draw(ctx, t, lt);
  ctx.restore();
  ctx.filter = 'none';

  // --- screen-space layers
  if (s.ui) s.ui(ctx, t, lt);
  if (STORY.hudDraw) STORY.hudDraw(ctx, t); else if (STORY.hud) drawGoalHUD(ctx, STORY.hud(t));
  vignette(ctx, .22);
  drawCaptions(ctx, t, s.capY || 1600);
  if (s.trans === 'whip' && lt < .2) { ctx.save(); ctx.globalAlpha = (1 - lt / .2) * .5; ctx.fillStyle = '#fff'; for (let i = 0; i < 9; i++) ctx.fillRect(0, hash(i + 3) * H, W, 6 + hash(i) * 18); ctx.restore(); }
  if (s.trans === 'flash' && lt < .3) { ctx.fillStyle = `rgba(255,255,255,${1 - lt / .3})`; ctx.fillRect(0, 0, W, H); }
  if (s.trans === 'cut' && lt < .06) { ctx.fillStyle = `rgba(255,255,255,${.12 * (1 - lt / .06)})`; ctx.fillRect(0, 0, W, H); }
}

async function init() {
  WORDS = window.WORDS_DATA;
  for (const l of WORDS.lines) LINE[l.id] = l;
  END = +(WORDS.lines[WORDS.lines.length - 1].end + .65).toFixed(3);
  await Promise.all([document.fonts.load('100px "Lilita One"'), document.fonts.load('700 60px "Fredoka"')]);
  buildChunks();
  SHOTS = buildTimeline();
  // Event list for the audio mixer (and for editors): narration lines, shot cuts, SFX cues, music cues
  const EV = [];
  for (const l of WORDS.lines) EV.push({ t: l.start, type: 'line', id: l.id, text: l.text, end: l.end });
  for (const s of SHOTS) {
    EV.push({ t: +s.start.toFixed(3), type: 'shot', id: s.id, trans: s.trans, end: +s.end.toFixed(3) });
    for (const [rt, name, vol] of (s.sfx || [])) EV.push({ t: +(s.start + rt).toFixed(3), type: 'sfx', name, vol });
    if (s.trans === 'whip') EV.push({ t: +s.start.toFixed(3), type: 'sfx', name: 'whoosh', vol: .35 });
    if (s.trans === 'zoom') EV.push({ t: +s.start.toFixed(3), type: 'sfx', name: 'zoom', vol: .35 });
  }
  for (const c of CHUNKS) for (const w of c.words) if (capColor(c.line, w.w) !== '#fff') EV.push({ t: w.s, type: 'sfx', name: 'tick', vol: .12 });
  for (const [t, mode] of STORY.music()) EV.push({ t: +t.toFixed(3), type: 'music', mode });
  EV.push({ t: END, type: 'music', mode: 'end' });
  EV.sort((a, b) => a.t - b.t);
  window.EV = EV; window.END = END; window.seek = seek;
  seek(Q.has('t') ? +Q.get('t') : 0);
  window.READY = true; window.DONE = true;
}
init();
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/engine/js/shotkit.js
~~~~~~~~ js
// shotkit.js — helpers for writing shots + the shot registry.
// Story projects call shots(() => [...shot objects]) from shots/partN.js files (one per parallel agent).
'use strict';
const P = o => basePose(o);
function C(ctx, name, p, face, T) { drawShadow(ctx, p); drawCharacter(ctx, name, p, face, T); }
const camAt = (x, y, z, rot = 0) => ({ x, y, z, rot });
const KIDS = ['kidA', 'kidB', 'kidC', 'kidD', 'kidE', 'kidF'];

function holdTray(ctx) { box(ctx, -150, 30, 300, 26, 10, '#B8C2CC', 7); for (let i = 0; i < 4; i++) { circle(ctx, -100 + i * 66, 22, 28, '#C98B4B', 6); for (let k = 0; k < 3; k++) circle(ctx, -110 + i * 66 + k * 9, 14 + k * 5, 4, '#4A2810'); } }
function holdMic(ctx) { box(ctx, -10, -40, 20, 70, 8, '#333', 5); circle(ctx, 0, -50, 22, '#AAB', 6); }
function holdBucket(ctx) { ctx.save(); ctx.translate(0, 40); box(ctx, -60, 0, 120, 110, 16, '#FF8528', 8); for (let i = 0; i < 4; i++) box(ctx, -50 + i * 28, -16, 26, 18, 8, PCOLORS[i], 4); ctx.restore(); }
function holdBook(ctx) { box(ctx, -50, 10, 100, 120, 8, '#7B4BFF', 7); box(ctx, -40, 22, 80, 10, 4, '#fff', 0); }
function holdSign(txtS) { return ctx => { ctx.save(); ctx.rotate(-.05); box(ctx, -150, -260, 300, 180, 14, '#FFF8E0', 8); txt(ctx, txtS, 0, -172, 84, '#30A045', OUTLINE, 0); ctx.restore(); }; }
function thread(ctx, x1, y1, x2, y2, k, T, col = '#FF7AC0') {
  if (k <= 0) return;
  const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 260;
  ctx.save(); ctx.lineCap = 'round';
  const N = 60, n = Math.floor(N * clamp(k));
  const pt = i => { const u = i / N; return [lerp(lerp(x1, mx, u), lerp(mx, x2, u), u), lerp(lerp(y1, my, u), lerp(my, y2, u), u)]; };
  ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.strokeStyle = col; ctx.lineWidth = 16;
  ctx.beginPath(); for (let i = 0; i <= n; i++) { const [x, y] = pt(i); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
  ctx.shadowBlur = 0; ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.stroke();
  for (let j = 0; j < 4; j++) { const u = ((T * .6 + j / 4) % 1) * clamp(k); const [x, y] = pt(Math.floor(u * N)); heartPath(ctx, x, y, 20); fillStroke(ctx, '#fff', 4); }
  ctx.restore();
}
function spotlight(ctx, x, a = .75, col = '255,240,200') { // screen-space cone
  ctx.save(); const g = ctx.createRadialGradient(x, 1150, 60, x, 1150, 620); g.addColorStop(0, `rgba(${col},.30)`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = `rgba(5,4,20,${a})`; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 90, 0); ctx.lineTo(x + 90, 0); ctx.lineTo(x + 420, 1700); ctx.lineTo(x - 420, 1700); ctx.fill(); ctx.restore();
}
function danceP(i, T) { const p = P({}); const k = (T * 2 + i * .37) % 1; p.armL = 1.2 + Math.sin(T * 8 + i) * 1; p.armR = 1.2 - Math.sin(T * 8 + i) * 1; p.bodyY = -Math.abs(Math.sin(T * 8 + i)) * 26; p.head = Math.sin(T * 4 + i) * .12; p.lean = Math.sin(T * 4 + i * 2) * .08; return p; }


// ---------------- word-anchored timing helpers ----------------
const ws = (id, w, o = 0) => wordT(id, w, o);          // start time of the o-th occurrence of word w in line id
const we = (id, w, o = 0) => wordT(id, w, o, 'e');     // end time of that word
const st = id => LINE[id].start - .08;                 // a shot that starts on line id cuts in just before its first word

// ---------------- story hooks (story.js overrides these) ----------------
window.STORY = {
  hud: null,                       // (T) => {have, goal, day, danger, done, alpha, pulse} | null  — goal tracker at the top
  hudDraw: null,                   // (ctx, T) => custom screen-space HUD (takes priority over hud)
  music: () => [[0, 'main']],      // () => [[time, mood], ...]  moods: main | tense | calm | party | love
  capColors: {},                   // { green: [...words], yellow: [...], red: [...], pink: [...] } merged over defaults
  capOverride: {},                 // { 'L5:word': 'red' | 'white' | null }
};

// ---------------- shot registry ----------------
const SHOT_PARTS = [];
function shots(fn) { SHOT_PARTS.push(fn); }
function buildTimeline() {
  const S = [];
  for (const f of SHOT_PARTS) { try { S.push(...f()); } catch (e) { console.error('shot part failed: ' + e.message); throw e; } }
  S.sort((a, b) => a.start - b.start);
  // A part can be tested before the parts that precede it exist: fill the gap with a neutral placeholder shot.
  if (!S.length || S[0].start > .001) S.unshift({ id: 'S00-placeholder', start: 0, trans: 'cut', capY: 1600,
    bg: (ctx) => { ctx.fillStyle = '#24225B'; ctx.fillRect(-3000, -3000, 9000, 9000); }, cam: () => camAt(540, 960, 1), draw() {} });
  S.forEach((s, i) => s.end = i < S.length - 1 ? S[i + 1].start : END);
  return S;
}
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/engine/fonts/OFL.txt
~~~~~~~~ text
Copyright (c) 2011 Juan Montoreano (juan@remolacha.biz), 
with Reserved Font Name Lilita

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded, 
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/scripts/build.sh
~~~~~~~~ bash
#!/usr/bin/env bash
# Full pipeline from inside a project:  tools/build.sh [external_narration.mp3]
#   PREVIEW=1 tools/build.sh   → 540x960@30 quick version
# voice (if missing) → ev.json → [frames render ‖ audio mix] → mux → QA
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -n "${1:-}" ]; then python3 tools/make_voice.py --external "$1" --speed "${SPEED:-1.25}"
elif [ ! -f data/words.js ]; then python3 tools/make_voice.py; fi
node tools/render.js --ev-only
python3 tools/make_audio.py &  AUD=$!
if [ "${PREVIEW:-0}" = "1" ]; then node tools/render.js --w 540 --fps 30 --crf 21 --out out/video_noaudio.mp4; OUT=out/preview.mp4
else node tools/render.js --w 1080 --fps 60 --crf 17 --out out/video_noaudio.mp4; OUT=out/final_video.mp4; fi
wait $AUD
ffmpeg -v error -y -i out/video_noaudio.mp4 -i out/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 \
  -af "loudnorm=I=-14:TP=-1.0:LRA=11" -shortest -movflags +faststart "$OUT"
bash tools/qa_final.sh "$OUT"
echo "DONE → $OUT"
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/scripts/build_audio_library.py
~~~~~~~~ python
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
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/scripts/contact.js
~~~~~~~~ js
// QA contact sheet: renders frames by seeking directly (proves every frame is reproducible) and tiles them with timestamps.
//   node tools/contact.js out.png                         24 frames across the whole video
//   node tools/contact.js out.png --lines L9-L17 --n 12   only the part of the video covering lines L9..L17
//   node tools/contact.js out.png --range 20-31.5 --n 10  a time range
//   node tools/contact.js out.png --times 1.2,5,9.75      exact times
//   node tools/contact.js --check [--lines L9-L17]        no image: seek every 0.1 s and report JS errors (fast smoke test)
// Options: --w 300 (frame width px), --cols 8
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
const argv = process.argv.slice(2), out = argv[0] && !argv[0].startsWith('--') ? argv[0] : null;
const A = {}; argv.forEach((x, i) => { if (x.startsWith('--')) A[x.slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true; });
(async () => {
  const w = +(A.w || 300), b = await chromium.launch(), p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) errs.push(m.text()); });
  p.on('requestfailed', r => { if (!/shots\/part\d+\.js$/.test(r.url())) errs.push('missing file: ' + r.url()); });
  await p.goto('file://' + path.resolve(__dirname, '../index.html') + '?w=' + w);
  await p.waitForFunction('window.READY===true', null, { timeout: 30000 }).catch(() => errs.push('page never became READY (see errors above)'));
  if (errs.length) { console.log('ERRORS:\n' + [...new Set(errs)].join('\n')); await b.close(); process.exit(1); }
  const END = await p.evaluate('window.END');
  let t0 = 0, t1 = END - .05;
  if (A.lines) { const [a, z] = String(A.lines).split('-'); [t0, t1] = await p.evaluate(([a, z]) => [LINE[a].start - .1, LINE[z || a].end + .1], [a, z]); }
  if (A.range) [t0, t1] = String(A.range).split('-').map(Number);
  const n = +(A.n || 24);
  let ts = A.times ? String(A.times).split(',').map(Number) : Array.from({ length: n }, (_, i) => +(t0 + i * (t1 - t0) / Math.max(1, n - 1)).toFixed(2));
  if (A.check) {
    const bad = await p.evaluate(([t0, t1]) => { const bad = []; for (let t = t0; t <= t1; t += .1) { try { seek(t); } catch (e) { bad.push(t.toFixed(1) + 's: ' + e.message); if (bad.length > 8) break; } } return bad; }, [t0, t1]);
    await b.close();
    if (bad.length || errs.length) { console.log('ERRORS:\n' + [...bad, ...new Set(errs)].join('\n')); process.exit(1); }
    console.log(`OK: ${t0.toFixed(1)}–${t1.toFixed(1)}s renders without errors (END=${END})`); return;
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cs_')); const files = [];
  for (const t of ts) {
    const d = await p.evaluate(t => { seek(t); return document.getElementById('c').toDataURL('image/jpeg', .9); }, t);
    const f = `${dir}/${String(files.length).padStart(3, '0')}.jpg`; fs.writeFileSync(f, Buffer.from(d.split(',')[1], 'base64')); files.push([f, t]);
  }
  await b.close();
  if (errs.length) console.log('ERRORS:\n' + [...new Set(errs)].join('\n'));
  const cols = Math.min(+(A.cols || 8), files.length);
  execFileSync('python3', ['-c', `
from PIL import Image, ImageDraw
fs=${JSON.stringify(files)}; cols=${cols}
ims=[Image.open(f) for f,_ in fs]; w,h=ims[0].size; rows=(len(ims)+cols-1)//cols
S=Image.new('RGB',(cols*w,rows*h),'black'); d=ImageDraw.Draw(S)
for i,(im,(f,t)) in enumerate(zip(ims,fs)):
    x,y=(i%cols)*w,(i//cols)*h; S.paste(im,(x,y)); d.rectangle([x,y,x+64,y+20],fill='black'); d.text((x+4,y+4),f'{t:.2f}s',fill='yellow')
S.save('${out || 'contact.png'}')`]);
  console.log(`END ${END}s, ${files.length} frames (${ts[0]}–${ts[ts.length - 1]}s) -> ${out || 'contact.png'}`);
})();
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/scripts/make_audio.py
~~~~~~~~ python
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
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/scripts/make_voice.py
~~~~~~~~ python
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
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/scripts/new_project.sh
~~~~~~~~ bash
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
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/scripts/qa_final.sh
~~~~~~~~ bash
#!/usr/bin/env bash
# Inspect an exported video: streams, frame count vs duration, black frames, frozen spans, loudness.
set -euo pipefail
F=${1:-out/final_video.mp4}
ffprobe -v error -show_entries stream=codec_name,profile,width,height,pix_fmt,r_frame_rate,nb_frames,bit_rate,sample_rate,channels:format=duration,size -of compact "$F"
echo "--- black frames (>=0.05s):"; ffmpeg -v info -i "$F" -vf "blackdetect=d=0.05:pix_th=0.08" -an -f null - 2>&1 | grep -o "black_start.*" || echo none
echo "--- frozen spans (>=1.0s):"; ffmpeg -v info -i "$F" -vf "freezedetect=n=0.001:d=1.0" -an -f null - 2>&1 | grep -oE "freeze_(start|duration): [0-9.]+" | paste - - || echo none
echo "--- loudness:"; ffmpeg -i "$F" -af ebur128=peak=true -vn -f null - 2>&1 | grep -A12 Summary | grep -E "I:|Peak:" 
echo "--- silence in audio (>=1.5s):"; ffmpeg -i "$F" -af silencedetect=n=-45dB:d=1.5 -vn -f null - 2>&1 | grep -o "silence_start.*\|silence_duration.*" || echo none
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/scripts/render.js
~~~~~~~~ js
// node tools/render.js [--w 1080] [--fps 60] [--crf 17] [--from 0] [--to END] [--workers 4] [--fmt jpeg|png] [--q .96] [--preset fast] [--out out/video_noaudio.mp4]
//                      [--ev-only]   → only write data/ev.json (seconds) so the audio mix can run while frames render
// Deterministic frame capture: each worker page seeks directly to its frames → H.264 segments → concat (stream copy).
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), { spawn, execFileSync } = require('child_process');
const A = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => (x.startsWith('--') && a.push([x.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]), a), []));
const Wd = +(A.w || 1080), FPS = +(A.fps || 60), CRF = A.crf || '17', WORKERS = +(A.workers || require('os').cpus().length || 4), FMT = A.fmt || 'jpeg', Q = +(A.q || .96), PRESET = A.preset || 'fast';
const ROOT = path.resolve(__dirname, '..'), OUT = path.resolve(ROOT, A.out || 'out/video_noaudio.mp4');
const URL = 'file://' + ROOT + '/index.html?w=' + Wd;
(async () => {
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync'] });
  const probe = await browser.newPage(); const errs = [];
  probe.on('pageerror', e => errs.push(e.message));
  await probe.goto(URL); await probe.waitForFunction('window.READY===true', null, { timeout: 60000 });
  if (errs.length) throw new Error(errs.join('\n'));
  const END = await probe.evaluate('window.END'); const EV = await probe.evaluate('window.EV');
  fs.writeFileSync(ROOT + '/data/ev.json', JSON.stringify({ END, fps: FPS, events: EV }, null, 1));
  await probe.close();
  if ('ev-only' in A) { console.log(`ev.json written (END=${END}s, ${EV.length} events)`); await browser.close(); return; }
  const from = +(A.from || 0), to = Math.min(+(A.to || END), END);
  const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS); const total = f1 - f0;
  console.log(`END=${END}s  frames ${f0}..${f1} (${total}) @${FPS}fps ${Wd}px  workers=${WORKERS}`);
  const segDir = ROOT + '/out/frames'; fs.mkdirSync(segDir, { recursive: true });
  const per = Math.ceil(total / WORKERS); const t0 = Date.now(); let done = 0;
  const segs = await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
    const a = f0 + w * per, b = Math.min(f1, a + per); if (a >= b) return null;
    const seg = `${segDir}/seg_${w}.mp4`;
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', FMT === 'png' ? 'png' : 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', PRESET, '-crf', CRF, '-pix_fmt', 'yuv420p', '-r', String(FPS), seg], { stdio: ['pipe', 'inherit', 'inherit'] });
    const page = await browser.newPage(); page.on('pageerror', e => console.log('pageerror', e.message));
    await page.goto(URL); await page.waitForFunction('window.READY===true', null, { timeout: 60000 });
    for (let f = a; f < b; f++) {
      const d = await page.evaluate(([t, fmt, q]) => { seek(t); return document.getElementById('c').toDataURL(fmt === 'png' ? 'image/png' : 'image/jpeg', q); }, [f / FPS, FMT, Q]);
      const buf = Buffer.from(d.slice(d.indexOf(',') + 1), 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (++done % 300 === 0) console.log(`  ${done}/${total} frames  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); await page.close(); return seg;
  }));
  await browser.close();
  const list = segDir + '/list.txt'; fs.writeFileSync(list, segs.filter(Boolean).map(s => `file '${s}'`).join('\n'));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', OUT]);
  console.log(`wrote ${OUT} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
})().catch(e => { console.error(e); process.exit(1); });
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/scripts/setup.sh
~~~~~~~~ bash
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
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/scripts/shot.js
~~~~~~~~ js
// node tools/shot.js <url> <out.png>  — screenshot the canvas of a page (QA helper)
const { chromium } = require('playwright');
(async () => {
  const [url, out] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage();
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('console:', m.text()); });
  p.on('pageerror', e => console.log('pageerror:', e.message));
  await p.goto(url); await p.waitForFunction('window.DONE===true || window.READY===true', null, { timeout: 30000 });
  await (await p.$('canvas')).screenshot({ path: out }); await b.close();
})();
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/examples/like-counter/script_lines.json
~~~~~~~~ json
[
 {
  "id": "L0",
  "text": "In this world, everyone has a number above their head."
 },
 {
  "id": "L1",
  "text": "It shows how many people really like you.",
  "gap": 0.15
 },
 {
  "id": "L2",
  "text": "You see, you can't fake it. And family doesn't count."
 },
 {
  "id": "L3",
  "text": "Pop stars have millions."
 },
 {
  "id": "L4",
  "text": "My dog has six."
 },
 {
  "id": "L5",
  "text": "And Grandma? Four hundred. She bakes cookies.",
  "gap": 0.12
 },
 {
  "id": "L6",
  "text": "Me? I have exactly one."
 },
 {
  "id": "L7",
  "text": "Kids call me Lonely One.",
  "gap": 0.15
 },
 {
  "id": "L8",
  "text": "I always figured my one was the lunch lady.",
  "gap": 0.25
 },
 {
  "id": "L9",
  "text": "Then one day, Brayden, nine hundred likes, laughed in my face."
 },
 {
  "id": "L10",
  "text": "Bet you can't hit ten by Friday.",
  "speaker": "brayden",
  "gap": 0.2
 },
 {
  "id": "L11",
  "text": "So I tried everything."
 },
 {
  "id": "L12",
  "text": "Free candy. Still one."
 },
 {
  "id": "L13",
  "text": "A backflip... onto the teacher. Still one.",
  "gap": 0.2
 },
 {
  "id": "L14",
  "text": "Friday. School dance. My number? One.",
  "gap": 0.3
 },
 {
  "id": "L15",
  "text": "Subscribe, because that's when everything went wrong.",
  "gap": 0.2
 },
 {
  "id": "L16",
  "text": "Brayden slipped on stage. His pants ripped. Everyone laughed."
 },
 {
  "id": "L17",
  "text": "His number started falling. Nine hundred. Two hundred. Ten.",
  "gap": 0.3
 },
 {
  "id": "L18",
  "text": "That's when I realized something."
 },
 {
  "id": "L19",
  "text": "Likes aren't something you get. They're something you give.",
  "gap": 0.25
 },
 {
  "id": "L20",
  "text": "So I walked up, tied my hoodie around his waist, and said, nice moves, man.",
  "gap": 0.2
 },
 {
  "id": "L21",
  "text": "Ding. Ding. Ding. Two. Twenty. Fifty!",
  "gap": 0.3
 },
 {
  "id": "L22",
  "text": "But nobody was looking at my number."
 },
 {
  "id": "L23",
  "text": "They were looking at Lily, the quiet girl in the back.",
  "gap": 0.15
 },
 {
  "id": "L24",
  "text": "Her number was one too.",
  "gap": 0.35
 },
 {
  "id": "L25",
  "text": "My one was never the lunch lady. It was her.",
  "gap": 0.2
 },
 {
  "id": "L26",
  "text": "And her one... was me.",
  "gap": 0.35
 },
 {
  "id": "L27",
  "text": "Subscribe if you've got a one."
 }
]
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/examples/like-counter/shots/part1.js
~~~~~~~~ js
// shots/part1.js — written independently of the other parts (one agent per part).
'use strict';
shots(() => {
  const S = [];

  // ===== S01 HOOK — pull back from Nubi's "1" to a hallway full of numbers =====
  S.push({ id: 'S01', start: 0, trans: 'none', capY: 1600,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => lt < 1.3 ? track([[0, camAt(540, 1000, 2.6)], [1.3, camAt(540, 1060, 1)]], lt) : camAt(540, 1060 - (lt - 1.3) * 10, 1 + (lt - 1.3) * .04),
    draw(ctx, T, lt) {
      const back = [['kidE', 250, 64, .45], ['kidF', 840, 19, .6]], front = [['kidA', 105, 37, .25], ['kidB', 300, 152, .75], ['kidC', 780, 88, .95], ['kidD', 975, 210, 1.15]];
      for (const [n, x, v, pt] of back) { const p = idle(P({ x, y: 1390, s: .62 }), T, x); C(ctx, n, p, { expr: 'happy', lookX: x < 540 ? .5 : -.5 }, T); badgeOver(ctx, n, p, v, { pop: pop(lt - pt), t: T, seed: x, bs: .85 }); }
      for (const [n, x, v, pt] of front) { const p = idle(P({ x, y: 1500, s: .8, view: 'q34', flip: x < 540 ? 1 : -1 }), T, x); C(ctx, n, p, { expr: 'happy' }, T); badgeOver(ctx, n, p, v, { pop: pop(lt - pt), t: T, seed: x, bs: .82 }); }
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); C(ctx, 'nubi', p, { expr: lt > 1.4 ? 'nervous' : 'neutral', lookY: lt > 1.4 ? -.8 : 0 }, T);
      badgeOver(ctx, 'nubi', p, 1, { t: 0 });
    },
    sfx: [[0, 'bell', .5], [.25, 'pop', .5], [.45, 'pop', .5], [.6, 'pop', .5], [.75, 'pop', .5], [.95, 'pop', .5], [1.15, 'pop', .5], [0.05, 'whoosh', .5]] });

  // ===== S02 — numbers = how many people REALLY like you (hearts fly into kidB's counter) =====
  S.push({ id: 'S02', start: st('L1'), trans: 'zoom', capY: 1620,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1080 - lt * 15, 1.55 + lt * .05),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 3); C(ctx, 'kidB', p, { expr: 'excited', lookY: -.7 }, T);
      const arrivals = [.35, .7, 1.05, 1.35];
      const got = arrivals.filter(a => lt > a + .35).length, bx = 540, by = headTop('kidB', p) - 72;
      arrivals.forEach((a, i) => { const u = inv(a, a + .35, lt); if (u <= 0 || u >= 1) return; const sx = i % 2 ? 1250 : -150, sy = 1250 + i * 60;
        const x = lerp(sx, bx, easeInOut(u)), y = lerp(sy, by, easeInOut(u)) - Math.sin(u * Math.PI) * 220; heartPath(ctx, x, y, 34); fillStroke(ctx, '#FF5B9B', 7); });
      const lastA = arrivals.filter(a => lt > a + .35).pop();
      badgeOver(ctx, 'kidB', p, 152 + got, { t: T, seed: 2, pop: 1 + (lastA ? Math.max(0, .25 - (lt - lastA - .35)) : 0) });
    },
    sfx: [[.7, 'ding', .45], [1.05, 'ding', .45], [1.4, 'ding', .45], [1.7, 'ding', .45]] });

  // ===== S03 — you can't fake it; family doesn't count =====
  const fakeT = ws('L2', 'fake'), famT = ws('L2', 'family');
  S.push({ id: 'S03', start: st('L2'), trans: 'whip', capY: 1620,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(560, 1060, 1.35),
    draw(ctx, T, lt) {
      const t = T;
      const momX = lerp(1250, 830, easeOut(inv(famT - .25, famT + .2, t)));
      if (t > famT - .3) { const mp = walk(P({ x: momX, y: 1500, s: .78, flip: -1, view: 'q34' }), t, 1, t < famT + .2 ? 1 : 0); if (t > famT + .2) { mp.armL = 1.2; mp.armR = .9; } C(ctx, 'mom', mp, { expr: 'happy' }, t); }
      const p = idle(P({ x: 470, y: 1500, s: .8 }), t, 5);
      const faking = t < fakeT;
      if (faking) { p.armR = 2.5; }
      C(ctx, 'kidE', p, { expr: faking ? 'smug' : t < famT ? 'nervous' : 'shy', holding: faking ? { R: holdSign('9,999') } : null }, t);
      badgeOver(ctx, 'kidE', p, 2, { t, seed: 5, pop: faking ? 0 : pop(t - fakeT) });
      burst(ctx, 470, headTop('kidE', p) - 80, t - fakeT, { kind: 'dust', n: 18, speed: 500, gravity: -200, life: .6, size: 30, colors: ['#fff', '#ddd'] });
      // family heart bounces off the counter
      const hu = inv(famT + .25, famT + .75, t);
      if (hu > 0 && hu < 1.6) { const bx = 470, by = headTop('kidE', p) - 70;
        let x, y; if (hu < 1) { x = lerp(830, bx + 40, hu); y = lerp(1180, by, hu) - Math.sin(hu * Math.PI) * 160; } else { const v = (hu - 1) / .6; x = bx + 40 + v * 380; y = by - v * 260 + v * v * 500; }
        ctx.save(); ctx.globalAlpha = hu > 1.3 ? 1 - (hu - 1.3) / .3 : 1; heartPath(ctx, x, y, 36); fillStroke(ctx, '#FF5B9B', 7); ctx.restore(); }
    },
    ui(ctx, T) { stamp(ctx, 'FAKE!', 540, 640, T - fakeT - .05, '#EE384A', 1.0); popText(ctx, 'FAMILY = 0', 540, 600, T - famT - .75, { size: 92, fill: '#FFD447', dur: 1.0, rot: -.05 }); },
    sfx: [[fakeT - st('L2'), 'poof', .7], [fakeT - st('L2') + .05, 'buzz', .45], [famT - st('L2') + .75, 'boing', .6]] });

  // ===== S04 — pop stars have millions =====
  S.push({ id: 'S04', start: st('L3'), trans: 'cut', capY: 1650,
    bg: (ctx, T, cam) => envConcert(ctx, T, cam),
    cam: lt => { const z = 1.05 + lt * .08; return camAt(540 + Math.sin(lt * 10) * 4, 1050, z); },
    draw(ctx, T, lt) {
      const p = celebrate(P({ x: 540, y: 1440, s: .85 }), T, .8); p.armR = 2.0;
      C(ctx, 'popstar', p, { expr: 'excited', mouth: Math.floor(T * 7) % 2 ? 'wideOpen' : 'round', holding: { R: holdMic } }, T);
      const v = Math.floor(lerp(1250000, 2481000, easeOut(clamp(lt / 1.1))) / 1000) * 1000;
      badgeOver(ctx, 'popstar', p, v, { state: 'gold', t: T, pop: pop(lt) * 1.1, glow: 1, glowC: '#FFD447' });
      burst(ctx, 540, 700, lt - .1, { kind: 'sparkle', n: 30, speed: 1100, gravity: 300, life: 1.2, size: 26 });
      concertCrowd(ctx, T);
    },
    sfx: [[0, 'cheer', .55], [0.05, 'sparkle', .5]] });

  // ===== S05 — my dog has six =====
  S.push({ id: 'S05', start: st('L4'), trans: 'whip', capY: 1650,
    bg: (ctx, T, cam) => envBackyard(ctx, T, cam),
    cam: lt => camAt(600, 1150, 1.25 + lt * .05),
    draw(ctx, T, lt) { drawDog(ctx, 520, 1520, 1.25, T); drawBadge(ctx, 520 + 140 * 1.25, 1520 - 380 * 1.25, 6, { s: 1.1, t: T, pop: pop(lt - .25) }); burst(ctx, 690, 1150, lt - .3, { kind: 'heart', n: 6, speed: 400, gravity: -300, life: 1, size: 22 }); },
    sfx: [[.25, 'pop', .5], [.3, 'bark', .6]] });

  // ===== S06 — grandma: four hundred, she bakes cookies =====
  const gmT = ws('L5', 'four'), ckT = ws('L5', 'cookies');
  S.push({ id: 'S06', start: st('L5'), trans: 'cut', capY: 1650,
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam),
    cam: lt => camAt(540, 1080, 1.12),
    draw(ctx, T, lt) {
      for (const [n, x, f] of [['kidA', 180, 1], ['kidC', 900, -1]]) { const kp = idle(P({ x, y: 1500, s: .72, flip: f, view: 'q34' }), T, x); if (T > ckT) { kp.armR = 1.3 + Math.sin(T * 10) * .2; kp.bodyY -= Math.abs(Math.sin(T * 9)) * 18; } C(ctx, n, kp, { expr: T > ckT ? 'love' : 'happy' }, T); }
      const p = idle(P({ x: 540, y: 1500, s: .82 }), T, 6); p.armL = .35; p.armR = .35;
      C(ctx, 'grandma', p, { expr: 'happy' }, T);
      ctx.save(); ctx.translate(540, 1500 - 175 * .82 * 1.02); ctx.scale(.82, .82); holdTray(ctx);
      for (let i = 0; i < 3; i++) { ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 8; ctx.beginPath(); const x = -70 + i * 70; ctx.moveTo(x, 0); ctx.bezierCurveTo(x - 20, -40 - (T * 60 % 40), x + 20, -70, x, -110); ctx.stroke(); }
      ctx.restore();
      badgeOver(ctx, 'grandma', p, 400, { t: T, pop: pop(T - gmT), state: 'green' });
      burst(ctx, 540, 900, T - ckT, { kind: 'heart', n: 10, speed: 600, gravity: -100, life: 1, size: 26 });
    },
    sfx: [[gmT - st('L5'), 'ding', .55], [ckT - st('L5'), 'cheer', .35]] });

  // ===== S07 — Me? I have exactly one (close-up) =====
  const oneT = ws('L6', 'one');
  S.push({ id: 'S07', start: st('L6'), trans: 'zoom', capY: 1640,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1110, 2.05 + lt * .06),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); const sh = smooth(inv(oneT - .3, oneT, T)); p.armL = .1 + .7 * sh; p.armR = .1 + .7 * sh; p.handL = -.6 * sh; p.handR = -.6 * sh; p.headY = 6 * sh;
      C(ctx, 'nubi', p, { expr: T > oneT ? 'sad' : 'nervous', mouth: lipShape(T, ['L6']) }, T);
      badgeOver(ctx, 'nubi', p, 1, { t: T, pop: T > oneT ? 1 - .25 * Math.sin(clamp((T - oneT) / .4) * Math.PI) : 1 });
    },
    sfx: [[oneT - st('L6'), 'sad_trombone', .55]] });

  // ===== S08 — kids call me Lonely One =====
  S.push({ id: 'S08', start: st('L7'), trans: 'cut', capY: 1620,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const sh = lt > .3 ? Math.sin(lt * 50) * 4 * Math.exp(-(lt - .3) * 4) : 0; return camAt(540 + sh, 1060, 1.02); },
    draw(ctx, T, lt) {
      const kids = [['kidA', 110, 1, 37], ['kidB', 300, 1, 153], ['kidC', 780, -1, 88], ['kidD', 970, -1, 210]];
      for (const [n, x, f, v] of kids) { const kp = laugh(P({ x, y: 1500, s: .76, flip: f, view: 'q34' }), T + x, 1); kp.armR = 1.35; kp.handR = -.3; C(ctx, n, kp, { expr: 'laughing' }, T); badgeOver(ctx, n, kp, v, { t: T, seed: x, bs: .82 }); }
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1, .5); p.headY = 8; C(ctx, 'nubi', p, { expr: 'sad' }, T); badgeOver(ctx, 'nubi', p, 1, { t: T });
    },
    sfx: [[.15, 'laugh', .55]] });

  // ===== S09 — I figured my one was the lunch lady =====
  S.push({ id: 'S09', start: st('L8'), trans: 'whip', capY: 1650,
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam),
    cam: lt => camAt(560, 1070, 1.1 + lt * .03),
    draw(ctx, T, lt) {
      const lp = idle(P({ x: 720, y: 1420, s: .82 }), T, 8); lp.armR = 1.1 + Math.sin(T * 5) * .3;
      C(ctx, 'lunchlady', lp, { expr: 'smug', eyes: { open: .58 } }, T);
      badgeOver(ctx, 'lunchlady', lp, 312, { t: T, seed: 9 });
      box(ctx, 400, 1260, 720, 260, 16, '#B8C2CC', 9); box(ctx, 380, 1240, 760, 40, 12, '#E8F2F7', 8);
      for (let i = 0; i < 3; i++) { box(ctx, 450 + i * 210, 1215, 170, 40, 10, ['#FFD447', '#30CE65', '#FF8528'][i], 6); }
      const np = idle(P({ x: 230, y: 1520, s: .82, view: 'q34' }), T, 1); np.armL = .5; np.armR = .5;
      C(ctx, 'nubi', np, { expr: 'love' }, T);
      const nb = { x: 230, y: headTop('nubi', np) - 74 };
      badgeOver(ctx, 'nubi', np, 1, { t: T });
      ctx.save(); ctx.setLineDash([18, 16]); ctx.lineDashOffset = -T * 60; ctx.strokeStyle = '#FF5B9B'; ctx.lineWidth = 8;
      const k = smooth(inv(.3, 1.0, lt)); ctx.beginPath(); ctx.moveTo(nb.x + 90, nb.y); ctx.quadraticCurveTo(470, 640, lerp(nb.x + 90, 640, k), lerp(nb.y, 1050, k)); ctx.stroke(); ctx.restore();
      if (lt > 1) popText(ctx, '?', 470, 640, lt - 1, { size: 140, fill: '#FFD447' });
    },
    sfx: [[.3, 'magic', .4]] });

  return S;
});
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/examples/like-counter/shots/part2.js
~~~~~~~~ js
// shots/part2.js — written independently of the other parts (one agent per part).
'use strict';
shots(() => {
  const S = [];

  // ===== S10 — Brayden, nine hundred likes, laughed in my face =====
  const b900 = ws('L9', 'nine'), blaugh = ws('L9', 'laughed');
  S.push({ id: 'S10', start: st('L9'), trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const T = lt + st('L9'); const k = smooth(inv(blaugh - .2, blaugh + .2, T)); const sh = T > blaugh ? Math.sin(T * 60) * 6 * Math.exp(-(T - blaugh) * 5) : 0; return camAt(lerp(660, 560, k) + sh, lerp(1060, 1120, k), lerp(1, 1.35, k)); },
    draw(ctx, T, lt) {
      const t0 = st('L9'), bx = lerp(1350, 700, easeOut(inv(t0, t0 + 1.0, T)));
      for (const [n, dx, s] of [['kidD', 230, .66], ['kidF', 400, .66]]) { const fp = walk(P({ x: bx + dx, y: 1430, s, flip: -1, view: 'q34' }), T, 1.1, T < t0 + 1.0 ? 1 : 0); C(ctx, n, fp, { expr: T > blaugh ? 'laughing' : 'smug' }, T); }
      const np = idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 1); surprise(np, T - blaugh);
      C(ctx, 'nubi', np, { expr: T > blaugh ? 'surprised' : 'nervous' }, T); badgeOver(ctx, 'nubi', np, 1, { t: T });
      let bp = P({ x: bx, y: 1500, s: .84, flip: -1, view: 'q34' });
      if (T < t0 + 1.0) walk(bp, T, 1.1); else idle(bp, T, 3);
      if (T > blaugh) { laugh(bp, T, 1); bp.lean += .22; }
      C(ctx, 'brayden', bp, { expr: T > blaugh ? 'laughing' : 'smug' }, T);
      badgeOver(ctx, 'brayden', bp, 900, { state: 'gold', t: T, pop: pop(T - b900), glow: .6, glowC: '#FFD447' });
      burst(ctx, bx, 960, T - b900, { kind: 'sparkle', n: 14, speed: 600, gravity: 200, life: .8, size: 22 });
    },
    sfx: [[0, 'whoosh', .4], [b900 - st('L9'), 'bling', .6], [blaugh - st('L9'), 'laugh', .55]] });

  // ===== S11 — "Bet you can't hit ten by Friday." (Brayden close-up) =====
  S.push({ id: 'S11', start: st('L10'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1120, 2.0 + lt * .08),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .84 }), T, 3), T, 3, .5); p.armR = 1.55; p.handR = .4;
      C(ctx, 'brayden', p, { expr: 'smug', mouth: lipShape(T, ['L10']) }, T);
      badgeOver(ctx, 'brayden', p, 900, { state: 'gold', t: T });
    },
    sfx: [[ws('L10', 'ten') - st('L10'), 'hud', .6]] });

  // ===== S12 — So I tried everything (determined) =====
  S.push({ id: 'S12', start: st('L11'), trans: 'zoom', capY: 1660,
    bg: (ctx, T) => envBurst(ctx, T, '#FF8528', '#FFC83D', .6),
    cam: lt => camAt(540, 1110 + Math.sin(lt * 40) * 3, 1.9 + lt * .1),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); anticipate(p, lt, .2); if (lt > .2) { p.armL = 1.3; p.armR = 1.3; p.handL = -1.2; p.handR = -1.2; p.bodyY -= 12; }
      C(ctx, 'nubi', p, { expr: 'determined', mouth: lipShape(T, ['L11']) }, T); badgeOver(ctx, 'nubi', p, 1, { t: T });
    },
    ui: (ctx, T, lt) => speedLines(ctx, 540, 900, T, .6),
    sfx: [[.15, 'power', .5]] });

  // ===== S13 — Free candy. Still one. =====
  const candyT = ws('L12', 'candy'), still1 = ws('L12', 'still');
  S.push({ id: 'S13', start: st('L12'), trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(600, 1060, 1.05),
    draw(ctx, T, lt) {
      for (const [n, x0, d] of [['kidA', 760, 0], ['kidC', 900, .15], ['kidE', 1040, .3]]) {
        const grab = candyT + .25 + d, x = T > grab ? x0 + (T - grab) * 520 : x0;
        const kp = T > grab ? walk(P({ x, y: 1500, s: .74, view: 'q34' }), T, 1.3) : idle(P({ x, y: 1500, s: .74, flip: -1, view: 'q34' }), T, x);
        if (T > grab) kp.armL = 2.3; C(ctx, n, kp, { expr: T > grab ? 'excited' : 'neutral', holding: T > grab ? { L: c => box(c, -22, 30, 44, 26, 12, PCOLORS[d * 20 | 0], 5) } : null }, T);
      }
      const p = idle(P({ x: 360, y: 1500, s: .8, view: 'q34' }), T, 1); p.armL = .3; const th = (T - candyT) * 3; p.armR = T > candyT ? 1.2 + Math.sin(th * TAU) * .9 : .2;
      C(ctx, 'nubi', p, { expr: T > still1 ? 'sad' : 'excited', holding: { L: holdBucket } }, T);
      badgeOver(ctx, 'nubi', p, 1, { t: T, pop: T > still1 ? 1 - .2 * Math.sin(clamp((T - still1) / .3) * Math.PI) : 1 });
      burst(ctx, 470, 1150, T - candyT, { kind: 'candy', n: 14, speed: 1000, angle: -.7, spread: 1.0, gravity: 1800, life: .9, size: 18, seed: 3 });
    },
    ui(ctx, T) { stamp(ctx, 'STILL 1', 540, 620, T - still1, '#EE384A', 1.0); },
    sfx: [[candyT - st('L12'), 'toss', .5], [still1 - st('L12'), 'buzz', .55]] });

  // ===== S14 — A backflip... onto the teacher. Still one. =====
  const flipT = ws('L13', 'backflip'), landT = ws('L13', 'teacher'), still2 = ws('L13', 'still');
  S.push({ id: 'S14', start: st('L13'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { noLights: true }),
    cam: lt => { const T = lt + st('L13'); const x = lerp(380, 640, smooth(inv(flipT, landT, T))); const sh = T > landT ? Math.sin(T * 70) * 10 * Math.exp(-(T - landT) * 6) : 0; return camAt(x + sh, 1080, 1.1); },
    draw(ctx, T, lt) {
      // teacher walks in under the landing spot
      const tx = lerp(1250, 720, easeOut(inv(st('L13'), landT, T)));
      const tp = T < landT ? walk(P({ x: tx, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 1) : P({ x: 720, y: 1500, s: .8, flip: -1, view: 'q34', squash: lerp(.45, .55, spring(T - landT, 3, 5)) });
      C(ctx, 'teacher', tp, { expr: T > landT ? 'dazed' : 'neutral' }, T);
      if (T > landT) for (let i = 0; i < 3; i++) { const a = T * 6 + i * TAU / 3; starPath(ctx, 720 + Math.cos(a) * 110, 1300 + Math.sin(a) * 30, 22, 9); fillStroke(ctx, '#FFD447', 5); }
      // Nubi flip
      const u = inv(flipT + .12, landT, T);
      let p = P({ x: lerp(360, 720, smooth(u)), y: 1500, s: .8, view: 'side' });
      if (T < flipT + .12) { anticipate(p, T - flipT, .12); p.view = 'q34'; }
      else if (T < landT) { p.bodyY = -Math.sin(u * Math.PI) * 520; p.rot = -TAU * easeInOut(u); p.legL = .6; p.legR = .9; p.armL = 2.4; p.armR = 2.4; }
      else { p.x = 720; p.y = 1500 - 520 * .8 * .5 + 60; p.view = 'q34'; p.armL = 1.6; p.armR = 1.6; }
      C(ctx, 'nubi', p, { expr: T > landT ? 'nervous' : T > flipT + .12 ? 'excited' : 'determined' }, T);
      badgeOver(ctx, 'nubi', p, 1, { t: T });
      burst(ctx, 720, 1460, T - landT, { kind: 'dust', n: 16, speed: 700, angle: -Math.PI / 2, spread: 2.6, gravity: 400, life: .6, size: 34 });
    },
    ui(ctx, T) { stamp(ctx, 'STILL 1', 540, 620, T - still2, '#EE384A', 1.0); },
    sfx: [[flipT - st('L13'), 'whoosh', .6], [landT - st('L13'), 'crash', .65], [still2 - st('L13'), 'buzz', .55]] });

  // ===== S15 — Friday. School dance. My number? One. =====
  const one3 = ws('L14', 'one');
  S.push({ id: 'S15', start: st('L14'), trans: 'flash', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam),
    cam: lt => { const T = lt + st('L14'); const k = easeOut(inv(one3 - .05, one3 + .12, T)); return camAt(lerp(560, 300, k), lerp(1020, 1110, k), lerp(.95, 2.0, k)); },
    draw(ctx, T, lt) {
      KIDS.forEach((n, i) => { const dp = danceP(i, T); Object.assign(dp, { x: 470 + (i % 3) * 230 + (i > 2 ? 110 : 0), y: i > 2 ? 1420 : 1520, s: i > 2 ? .62 : .72 }); dp.armL = .6 + dp.armL * .6; C(ctx, n, dp, { expr: i % 2 ? 'excited' : 'laughing' }, T); });
      const p = idle(P({ x: 210, y: 1500, s: .8, view: 'q34' }), T, 1, .4); p.headY = 8;
      C(ctx, 'nubi', p, { expr: 'sad', lookX: .6 }, T); badgeOver(ctx, 'nubi', p, 1, { t: T, state: T > one3 ? 'red' : 'normal' });
    },
    sfx: [[0, 'flash', .4], [one3 - st('L14'), 'impact', .6]] });

  // ===== S16 — Subscribe, because that's when everything went wrong =====
  const wrongT = ws('L15', 'wrong');
  S.push({ id: 'S16', start: st('L15'), trans: 'cut', capY: 1720,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .6 }),
    cam: lt => { const T = lt + st('L15'); const sh = T > wrongT ? Math.sin(T * 70) * 12 * Math.exp(-(T - wrongT) * 4) : 0; return camAt(540 + sh, 1110, T > wrongT ? 2.3 : 2.0 + lt * .1); },
    draw(ctx, T, lt) { const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); if (T > wrongT) surprise(p, T - wrongT);
      C(ctx, 'nubi', p, { expr: T > wrongT ? 'terrified' : 'nervous', lookX: T > wrongT ? 0 : .7, mouth: T < wrongT ? lipShape(T, ['L15']) : null }, T); badgeOver(ctx, 'nubi', p, 1, { t: T }); },
    ui(ctx, T, lt) { drawSubscribe(ctx, lt - .05, wrongT - st('L15') - .1); if (T > wrongT) { vignette(ctx, .7 * Math.max(.4, 1 - (T - wrongT)), '238,56,74'); } },
    sfx: [[.6, 'click', .6], [wrongT - st('L15'), 'alarm', .5], [wrongT - st('L15'), 'scratch', .5]] });

  // ===== S17 — Brayden slipped on stage. His pants ripped. Everyone laughed. =====
  const slipT = ws('L16', 'slipped'), ripT = ws('L16', 'ripped'), laughT = ws('L16', 'laughed');
  S.push({ id: 'S17', start: st('L16'), trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envGym(ctx, T, cam),
    cam: lt => { const T = lt + st('L16');
      if (T < ripT) return camAt(540, 1010, 1.35 + lt * .04);
      if (T < laughT) { const k = easeOut(inv(ripT, ripT + .15, T)); return camAt(540, lerp(1010, 985, k), lerp(1.4, 1.95, k)); }
      const k = easeOut(inv(laughT, laughT + .2, T)); return camAt(540, 1100, lerp(1.95, 1.08, k)); },
    draw(ctx, T, lt) {
      const y0 = 1190; let p = P({ x: 540, y: y0, s: .8 });
      if (T < slipT) { Object.assign(p, danceP(2, T), { x: 540, y: y0, s: .8 }); }
      else if (T < ripT) { const u = clamp((T - slipT) / .3); p.rot = -1.35 * easeIn(u) * (1 - smooth(inv(.35, .6, T - slipT))); p.legL = .9 * u; p.legR = 1.2 * u; p.armL = 2 * u; p.armR = 2 * u; p.bodyY = -Math.sin(u * Math.PI) * 60; }
      else { p.armL = -.15; p.armR = -.15; p.handL = .3; p.handR = .3; p.legL = -.06; p.legR = -.06; p.squash = .96; }
      C(ctx, 'brayden', p, { expr: T < slipT ? 'excited' : T < ripT ? 'terrified' : 'terrified', ripped: T >= ripT, red: T >= ripT ? 1 : 0 }, T);
      badgeOver(ctx, 'brayden', p, 900, { state: 'gold', t: T });
      burst(ctx, 540, y0, T - slipT - .3, { kind: 'dust', n: 14, speed: 600, angle: -Math.PI / 2, spread: 2.4, gravity: 300, life: .5, size: 30 });
      if (T > laughT) { [['kidA', 120], ['kidC', 380], ['kidB', 700], ['kidD', 960]].forEach(([n, x], i) => { const kp = laugh(P({ x, y: 1880, s: 1.05, view: 'back' }), T + i, 1); kp.armR = 1.3 + Math.sin(T * 12 + i) * .2; C(ctx, n, kp, { expr: 'laughing' }, T); }); }
    },
    ui(ctx, T) { popText(ctx, 'RIIIP!', 790, 1300, T - ripT, { size: 120, fill: '#FF7AC0', rot: -.12, dur: .9 }); },
    sfx: [[slipT - st('L16'), 'slip', .6], [slipT - st('L16') + .3, 'thud', .6], [ripT - st('L16'), 'rip', .75], [laughT - st('L16'), 'laugh', .7]] });

  // ===== S18 — His number started falling. 900 → 200 → 10 =====
  const fall0 = ws('L17', 'falling'), f200 = ws('L17', 'two'), f10 = ws('L17', 'ten');
  S.push({ id: 'S18', start: st('L17'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .5 }),
    cam: lt => { const T = lt + st('L17'); let sh = 0; for (const s of [fall0, f200, f10]) if (T > s) sh += Math.sin(T * 80) * 9 * Math.exp(-(T - s) * 7); return camAt(540 + sh, 1110, 2.0 + lt * .06); },
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .84 }), T, 3, .5); p.headY = 10;
      C(ctx, 'brayden', p, { expr: 'crying', ripped: true }, T);
      let v = 900; if (T > fall0) v = lerp(900, 200, easeInOut(inv(fall0, f200, T))); if (T > f200) v = lerp(200, 10, easeInOut(inv(f200, f10, T)));
      v = Math.round(v / (v > 100 ? 10 : 1)) * (v > 100 ? 10 : 1);
      badgeOver(ctx, 'brayden', p, v, { state: T > fall0 ? 'red' : 'gold', t: T, rot: T > fall0 ? Math.sin(T * 40) * .03 : 0 });
      for (let i = 0; i < 2; i++) { const u = ((T * 1.4 + i / 2) % 1); if (T < fall0) break; ctx.save(); ctx.globalAlpha = 1 - u; ctx.translate(i ? 840 : 240, 900 + u * 220);
        ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.lineTo(26, 40); ctx.lineTo(48, 40); ctx.lineTo(0, 90); ctx.lineTo(-48, 40); ctx.lineTo(-26, 40); ctx.closePath(); fillStroke(ctx, '#EE384A', 6); ctx.restore(); }
    },
    sfx: [[fall0 - st('L17'), 'fall', .55], [f200 - st('L17'), 'glitch', .5], [f10 - st('L17'), 'glitch', .55]] });

  return S;
});
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/examples/like-counter/shots/part3.js
~~~~~~~~ js
// shots/part3.js — written independently of the other parts (one agent per part).
'use strict';
shots(() => {
  const S = [];

  // ===== S19 — That's when I realized something =====
  const realT = ws('L18', 'realized');
  S.push({ id: 'S19', start: st('L18'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .7, noLights: true }),
    cam: lt => camAt(540, 1100, 1.25 + lt * .35),
    draw(ctx, T, lt) { const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1, .4); if (T > realT) { p.headY = -10 * spring(T - realT); }
      C(ctx, 'nubi', p, { expr: T > realT ? 'surprised' : 'sad' }, T); badgeOver(ctx, 'nubi', p, 1, { t: T });
      burst(ctx, 540, 1060, T - realT, { kind: 'sparkle', n: 10, speed: 700, gravity: 0, life: .7, size: 26 }); },
    ui(ctx, T) { spotlight(ctx, 540, .38); },
    sfx: [[realT - st('L18'), 'magic', .55]] });

  // ===== S20 — Likes aren't something you get. They're something you give. =====
  const giveT = ws('L19', 'give');
  S.push({ id: 'S20', start: st('L19'), trans: 'zoom', capY: 1660,
    bg: (ctx, T) => envSoft(ctx, T, '#FFC2DD', '#5B3FB0'),
    cam: lt => camAt(540, 1130, 1.85 + lt * .05),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); const k = smooth(inv(giveT - .4, giveT, T)); p.armL = .1 + .5 * k; p.armR = .1 + .5 * k; p.handL = -1.0 * k; p.handR = -1.0 * k;
      C(ctx, 'nubi', p, { expr: T > giveT ? 'happy' : 'determined', mouth: lipShape(T, ['L19']) }, T); badgeOver(ctx, 'nubi', p, 1, { t: T });
      if (k > 0) { ctx.save(); ctx.translate(540, 1260); const s = k * (1 + Math.sin(T * 8) * .05); ctx.scale(s, s); ctx.shadowColor = '#FF5B9B'; ctx.shadowBlur = 60; heartPath(ctx, 0, 0, 90); fillStroke(ctx, '#FF5B9B', 9); ctx.restore(); }
      burst(ctx, 540, 1240, T - giveT, { kind: 'heart', n: 10, speed: 500, gravity: -200, life: 1, size: 22 });
    },
    sfx: [[giveT - st('L19'), 'swell', .55]] });

  // ===== S21 — walked up, tied my hoodie around his waist, "nice moves, man" =====
  const tiedT = ws('L20', 'tied'), niceT = ws('L20', 'nice');
  S.push({ id: 'S21', start: st('L20'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .25 }),
    cam: lt => { const T = lt + st('L20'); const k = smooth(inv(niceT - .3, niceT, T)); return camAt(lerp(450, 560, k), lerp(1010, 990, k), lerp(1.3, 1.7, k)); },
    draw(ctx, T, lt) {
      const y0 = 1190, t0 = st('L20');
      const tied = T > tiedT + .15;
      const bp = idle(P({ x: 690, y: y0, s: .8, flip: -1, view: 'q34' }), T, 3, .4);
      if (T > niceT) { bp.armL = .2; bp.armR = .2; }
      C(ctx, 'brayden', bp, { expr: T > niceT + .3 ? 'happy' : tied ? 'surprised' : 'crying', ripped: !tied, waistHoodie: tied }, T);
      badgeOver(ctx, 'brayden', bp, 10, { state: 'red', t: T });
      const nx = lerp(130, 420, smooth(inv(t0, tiedT - .1, T)));
      let np = P({ x: nx, y: y0, s: .8, view: T < tiedT - .1 ? 'side' : 'q34' });
      if (T < tiedT - .1) walk(np, T, 1.3); else idle(np, T, 1);
      if (T > tiedT - .1 && T < tiedT + .5) { np.armR = 1.4; np.armL = .4; }
      if (T > niceT) { np.armR = 2.2; np.handR = .4; }
      C(ctx, 'nubi', np, { expr: T > niceT ? 'happy' : 'determined', hoodie: !tied, mouth: T > niceT ? lipShape(T, ['L20']) : null }, T);
      badgeOver(ctx, 'nubi', np, 1, { t: T });
      burst(ctx, 690, 1060, T - tiedT, { kind: 'dust', n: 18, speed: 500, gravity: 0, life: .5, size: 34, colors: ['#fff', '#20BDBB'] });
    },
    sfx: [[0, 'step', .3], [tiedT - st('L20'), 'poof', .6], [niceT - st('L20'), 'ding', .4]] });

  // ===== S22 — Ding. Ding. Ding. Two. Twenty. Fifty! =====
  const d1 = ws('L21', 'ding', 0), d2 = ws('L21', 'ding', 1), d3 = ws('L21', 'ding', 2), fifty = ws('L21', 'fifty');
  S.push({ id: 'S22', start: st('L21'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => envGym(ctx, T, cam),
    cam: lt => { const T = lt + st('L21'); const sh = T > fifty ? Math.sin(T * 60) * 10 * Math.exp(-(T - fifty) * 4) : 0; return camAt(540 + sh, 1090, 1.2 + lt * .05); },
    draw(ctx, T, lt) {
      KIDS.forEach((n, i) => { const cp = celebrate(P({ x: 120 + i * 168, y: 1390, s: .58 }), T + i * .2, T > d1 ? 1 : .2); C(ctx, n, cp, { expr: T > d1 ? 'excited' : 'happy' }, T); });
      const bp = idle(P({ x: 850, y: 1520, s: .76, flip: -1, view: 'q34' }), T, 3); if (T > fifty) celebrate(bp, T, .7);
      C(ctx, 'brayden', bp, { expr: 'happy', waistHoodie: true }, T);
      badgeOver(ctx, 'brayden', bp, Math.round(lerp(10, 31, smooth(inv(d2, fifty, T)))), { state: 'normal', t: T });
      const np = idle(P({ x: 470, y: 1540, s: .84 }), T, 1); if (T > fifty) celebrate(np, T); else if (T > d1) { np.armL = .9; np.armR = .9; }
      C(ctx, 'nubi', np, { expr: T > fifty ? 'excited' : T > d1 ? 'surprised' : 'happy', hoodie: false, lookY: -.6 }, T);
      const nl = nubiLikes(T); const dsince = Math.min(...[d1, d2, d3, ws('L21', 'two'), ws('L21', 'twenty'), fifty].map(d => T > d ? T - d : 9));
      badgeOver(ctx, 'nubi', np, nl.v, { t: T, state: nl.v >= 10 ? 'green' : 'normal', pop: 1 + Math.max(0, .3 - dsince), glow: nl.v >= 10 ? 1 : 0, glowC: '#30CE65' });
      for (const d of [d1, d2, d3]) for (let i = 0; i < 3; i++) { const u = inv(d - .3 + i * .05, d, T); if (u <= 0 || u >= 1) continue; const sx = 150 + i * 380;
        heartPath(ctx, lerp(sx, 470, u), lerp(1100, 920, u) - Math.sin(u * Math.PI) * 120, 26); fillStroke(ctx, '#FF5B9B', 5); }
      burst(ctx, 470, 860, T - fifty, { kind: 'confetti', n: 60, speed: 1400, gravity: 1500, life: 1.8, size: 26 });
    },
    sfx: [[d1 - st('L21'), 'ding', .6], [d2 - st('L21'), 'ding2', .6], [d3 - st('L21'), 'ding3', .6], [fifty - st('L21'), 'cheer', .7], [fifty - st('L21'), 'confetti', .6]] });

  // ===== S23 — But nobody was looking at my number =====
  const nobodyT = ws('L22', 'nobody');
  S.push({ id: 'S23', start: st('L22'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .3 }),
    cam: lt => camAt(540, 1080, 1.25 + lt * .08),
    draw(ctx, T, lt) {
      KIDS.slice(0, 4).forEach((n, i) => { const turned = T > nobodyT + i * .07; const kp = idle(P({ x: 150 + i * 260, y: 1400, s: .6, view: turned ? 'q34' : 'front' }), T, i); C(ctx, n, kp, { expr: turned ? 'surprised' : 'happy', lookX: turned ? 1 : 0 }, T); });
      const np = idle(P({ x: 540, y: 1520, s: .84 }), T, 1); C(ctx, 'nubi', np, { expr: T > nobodyT + .3 ? 'confused' : 'excited', hoodie: false, lookY: T > nobodyT + .3 ? 0 : -.6, lookX: T > nobodyT + .3 ? .8 : 0 }, T);
      badgeOver(ctx, 'nubi', np, 50, { t: T, state: 'green' });
    },
    sfx: [[nobodyT - st('L22'), 'record', .5]] });

  // ===== S24 — They were looking at Lily, the quiet girl in the back =====
  const lilyT = ws('L23', 'lily');
  S.push({ id: 'S24', start: st('L23'), trans: 'whip', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .5, noLights: true }),
    cam: lt => camAt(760, 1080, 1.15 + lt * .1),
    draw(ctx, T, lt) {
      const t0 = st('L23');
      for (const [n, x0, x1] of [['kidC', 620, 300], ['kidD', 900, 1240]]) { const u = inv(t0, lilyT + .2, T); const kp = u < 1 ? walk(P({ x: lerp(x0, x1, easeOut(u)), y: 1560, s: .8, view: 'q34', flip: x1 < x0 ? -1 : 1 }), T, 1.2) : idle(P({ x: x1, y: 1560, s: .8, view: 'q34', flip: x1 < x0 ? 1 : -1 }), T, x0); C(ctx, n, kp, { expr: 'surprised' }, T); }
      const lp = idle(P({ x: 760, y: 1440, s: .74 }), T, 2); lp.armL = .05; lp.armR = .05;
      C(ctx, 'lily', lp, { expr: 'shy', holding: { R: holdBook } }, T);
    },
    ui(ctx, T) { spotlight(ctx, 540, .35, '255,180,220'); },
    sfx: [[0, 'whoosh', .5], [lilyT - st('L23'), 'chime', .5]] });

  // ===== S25 — Her number was one too =====
  const lone = ws('L24', 'one');
  S.push({ id: 'S25', start: st('L24'), trans: 'zoom', capY: 1660,
    bg: (ctx, T) => envSoft(ctx, T, '#FFC2DD', '#7B4BFF'),
    cam: lt => camAt(540, 1080, 2.0 + lt * .06),
    draw(ctx, T, lt) { const lp = idle(P({ x: 540, y: 1500, s: .8 }), T, 2); C(ctx, 'lily', lp, { expr: T > lone ? 'shy' : 'neutral', lookY: -.5, holding: { R: holdBook } }, T);
      badgeOver(ctx, 'lily', lp, 1, { t: T, pop: pop(T - lone), glow: 1 }); burst(ctx, 540, 900, T - lone, { kind: 'heart', n: 8, speed: 500, gravity: -200, life: 1, size: 22 }); },
    sfx: [[lone - st('L24'), 'pop', .55], [lone - st('L24') + .05, 'chime', .4]] });

  // ===== S26 — My one was never the lunch lady. It was her. =====
  const ladyT = ws('L25', 'lady'), herT = ws('L25', 'her');
  S.push({ id: 'S26', start: st('L25'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .55, noLights: true }),
    cam: lt => camAt(540, 1060, 1.12),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 260, y: 1500, s: .8, view: 'q34' }), T, 1); C(ctx, 'nubi', np, { expr: T > herT ? 'surprised' : 'confused', hoodie: false }, T);
      const lp = idle(P({ x: 820, y: 1500, s: .76, view: 'q34', flip: -1 }), T, 2); C(ctx, 'lily', lp, { expr: 'shy', holding: { L: holdBook } }, T);
      badgeOver(ctx, 'nubi', np, 50, { t: T, state: 'green' }); badgeOver(ctx, 'lily', lp, 1, { t: T, glow: .8 });
      // thought bubble with the lunch lady + X
      const bk = pop(T - st('L25') - .05) * (1 - smooth(inv(herT - .25, herT, T)));
      if (bk > .01) { ctx.save(); ctx.translate(380, 640); ctx.scale(bk, bk); for (const [x, y, r] of [[-120, 190, 18], [-80, 150, 28]]) circle(ctx, x, y, r, '#fff', 7);
        rr(ctx, -200, -170, 400, 300, 120); fillStroke(ctx, '#fff', 9); ctx.save(); rr(ctx, -200, -170, 400, 300, 120); ctx.clip();
        drawCharacter(ctx, 'lunchlady', P({ x: 0, y: 300, s: .55 }), { expr: 'smug' }, T); ctx.restore();
        if (T > ladyT) { const k = Math.min(1, (T - ladyT) / .12); ctx.strokeStyle = '#EE384A'; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-120, -110); ctx.lineTo(lerp(-120, 120, k), lerp(-110, 90, k)); ctx.moveTo(120, -110); ctx.lineTo(lerp(120, -120, k), lerp(-110, 90, k)); ctx.stroke(); }
        ctx.restore(); }
      thread(ctx, 820, 1250, 260, headTop('nubi', np) - 80, inv(herT - .1, herT + .5, T), T);
    },
    sfx: [[ladyT - st('L25'), 'buzz', .45], [herT - st('L25'), 'swell', .6]] });

  // ===== S27 — And her one... was me =====
  const meT = ws('L26', 'me');
  S.push({ id: 'S27', start: st('L26'), trans: 'cut', capY: 1660,
    bg: (ctx, T) => envSoft(ctx, T, '#FFC2DD', '#B44BFF'),
    cam: lt => camAt(540, 1100, 1.35 + lt * .12),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 1); const lp = idle(P({ x: 750, y: 1500, s: .76, view: 'q34', flip: -1 }), T, 2);
      C(ctx, 'nubi', np, { expr: T > meT ? 'love' : 'shy', hoodie: false }, T); C(ctx, 'lily', lp, { expr: T > meT ? 'love' : 'shy' }, T);
      badgeOver(ctx, 'nubi', np, 50, { t: T, state: 'green' }); badgeOver(ctx, 'lily', lp, 1, { t: T, glow: 1 });
      thread(ctx, 330, 1250, 750, headTop('lily', lp) - 80, inv(st('L26') + .1, meT, T), T);
      burst(ctx, 540, 1000, T - meT, { kind: 'heart', n: 20, speed: 800, gravity: -100, life: 1.4, size: 28 });
    },
    sfx: [[meT - st('L26'), 'sparkle', .6], [meT - st('L26'), 'chime', .5]] });

  // ===== S28 — Subscribe if you've got a one (push into the "1" → loops to frame 1) =====
  const lastOne = ws('L27', 'one');
  S.push({ id: 'S28', start: st('L27'), trans: 'cut', capY: 1720,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const T = lt + st('L27'); const k = easeInOut(inv(lastOne - .2, END, T)); return camAt(lerp(540, 680, k), lerp(1080, 1000, k), lerp(1.15, 2.6, k)); },
    draw(ctx, T, lt) {
      const np = idle(P({ x: 400, y: 1500, s: .8, view: 'q34' }), T, 1); const lp = idle(P({ x: 680, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 2);
      np.armR = .35; lp.armR = .35;
      C(ctx, 'nubi', np, { expr: 'happy', hoodie: false }, T); C(ctx, 'lily', lp, { expr: 'happy' }, T);
      badgeOver(ctx, 'nubi', np, 50, { t: T, state: 'green' }); badgeOver(ctx, 'lily', lp, 1, { t: 0, glow: 1 - smooth(inv(lastOne, END, T)) });
    },
    ui(ctx, T, lt) { drawSubscribe(ctx, lt - .05, Math.min(1.4, lastOne - st('L27') + .1)); },
    sfx: [[.6, 'click', .5], [lastOne - st('L27'), 'whoosh', .4]] });


  return S;
});
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/examples/like-counter/story.js
~~~~~~~~ js
// story.js — story-level state for "In This World, Everyone Has A Like Counter".
// Things that span many shots live here (counters, HUD, music moods, caption colors), so parallel shot agents share them.
'use strict';
function nubiLikes(T) {
  if (!LINE.L21) return 1;
  return counterAt([[0, 1], [wordT('L21', 'two'), 2], [wordT('L21', 'twenty'), 20], [wordT('L21', 'fifty'), 50]], T);
}
function hudState(T) {
  const t0 = wordT('L10', 'ten'), tEnd = lineT('L22', 0) + .5;
  if (T < t0 - .05 || T > tEnd + .4) return null;
  const nl = nubiLikes(T);
  let day = '3 DAYS', danger = false;
  if (T >= lineT('L12')) day = '2 DAYS';
  if (T >= lineT('L13')) day = '1 DAY';
  if (T >= lineT('L14')) { day = 'TODAY!'; danger = true; }
  const lastStep = nl.since;
  return { have: nl.v, goal: 10, day, danger, done: nl.v >= 10, alpha: smooth(inv(t0 - .05, t0 + .25, T)) * (1 - smooth(inv(tEnd, tEnd + .4, T))),
    pulse: Math.max(0, 1 - lastStep * 4) * (T > wordT('L21', 'two') - .01 ? 1 : 0) };
}

STORY.hud = hudState;
STORY.music = () => [[0, 'main'], [wordT('L15', 'wrong'), 'tense'], [LINE.L18.start - .1, 'calm'], [wordT('L21', 'ding'), 'party'], [LINE.L23.start - .1, 'love']];
STORY.capColors = {
  green: ['likes', 'give', 'ding', 'fifty', 'twenty', 'two', 'millions', 'hundred', 'cookies', 'six'],
  yellow: ['number', 'candy', 'backflip', 'friday', 'dance', 'hoodie', 'grandma', 'dog', 'lunch', 'lady'],
  red: ['fake', 'one', 'lonely', 'still', 'wrong', 'slipped', 'ripped', 'falling', 'ten', 'laughed', 'subscribe', 'family'],
  pink: ['lily', 'her', 'me', 'really', 'together', 'quiet', 'teacher', 'pants'],
};
STORY.capOverride = { 'L17:hundred': 'red', 'L21:two': 'green', 'L24:one': 'pink', 'L26:me': 'pink', 'L25:her': 'pink', 'L27:one': 'pink', 'L8:one': 'yellow',
  'L25:one': 'pink', 'L13:teacher': 'pink', 'L6:me': 'white', 'L22:my': 'white', 'L9:hundred': 'yellow', 'L5:hundred': 'green', 'L9:one': 'white' };
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/examples/shadow-thoughts/plan.md
~~~~~~~~ markdown
# Plan: "In This World, Your Shadow Says What You're Really Thinking"

~54 s · 25 lines (L0–L24) · voice: Kokoro kid narrator (one voice reads every line, shadows included)

## Shared systems (already in story.js; use these, don't reinvent)
- `shadowOf(ctx, name, pose, T, {k, dx, dy, alpha, lines, eyes, mouth, skew, face})` draws the talking cast shadow (silhouette from the same rig plus glowing eyes and a mouth).
  `lines:['L16']` lip-syncs the shadow's mouth. `eyes`: normal, happy, wide, shy, closed. Draw shadows **before** the character, so the character is in front.
  A shadow on a wall or locker behind someone: same feet y, `dx` 40–120, k 1.3–1.8. On the talent-show curtain: k 2.4–2.8 (huge, "ten feet tall").
- `dogShadow(ctx, x, y, s, T, {lines, flip})` · `speechBubble(ctx, x, y, 'TEXT', T - t0, {size, dark:true, dur, tail, rot})`. A **dark** bubble means a shadow is talking. Keep bubbles short, in CAPS.
- Props: `holdUmbrella`, `holdTeddy`, `holdDrawing` (Nubi's potato drawing), plus engine `holdMic`, `holdBook`.
- Sets: `envHallway` (sunny, windows on the left side are the light source), `envBackyard` (also works as the schoolyard), `envKitchen`,
  `envStage(ctx,T,cam,{dim})` (gym with a TALENT SHOW banner; **stage floor y 1190**, curtain wall y 560–1180), `envSoft`, `envBurst`.
- `emergencyLights(ctx, T, a)` (ui) · `spotlight(ctx, x, darkness, 'r,g,b')` (ui).
- HUD: "SECRET: SAFE / DANGER! / OUT ♥" is automatic, from L7 "secret" until L23. It covers screen y 80–220, so keep faces and shadow faces below about 300 during that time.
- `nubiHoodie(T)`: Nubi wears the teal hoodie until L13 "hoodie", and after that **never** (face `hoodie: nubiHoodie(T)` everywhere).

## Continuity
- Nubi's own shadow is **tiny** (k 0.35–0.5, right under him) in L5–L9 because he avoids light. On stage (L10–L21) it is **huge** on the curtain behind him.
- Lily: hallway passer-by (L8). Then she's in the front row of the audience at the gym floor (y 1500), sitting or standing in front view, with a book. Pink headband, always the same rig.
- Brayden: pushes Nubi on stage (L9). Then he stands in the audience aisle, to the right of the front row.
- Lip-sync: Nubi talks to camera in close-ups (L5, L20). Shadows lip-sync their own lines (L4 after "says", L16, L21 after "yeah", L22 "finally").

## Shots
| id | line | set | action (anchor words) | camera | trans | sfx |
|---|---|---|---|---|---|---|
| **Part 1** ||||||
| S01 | L0 | hallway, sunny | HOOK from frame 1: kidA (x 160) and kidC (x 900) stand at the lockers; their big shadows on the lockers talk with dark bubbles ("I'M HUNGRY", "THIS IS BORING"). Nubi in the middle hunches with a tiny shadow. | start 1.7x on kidA's talking shadow face → pull back to a 1.0x wide by 1.4 s | none | bell, pop |
| S02 | L1 | hallway | "Out loud": kidC's shadow shouts huge "BORING!!" (bubble size 90). The teacher behind turns, surprised | zoom-in close on the shadow | zoom | boing |
| S03 | L2 | hallway | kidB's small shadow whispers ("psst", small bubble). At "bigger", kidD steps toward the window and his shadow grows k 0.9 → 2.2 with a growing bubble "I LOVE PIZZA!!!" at "louder" | wide, slight push | cut | whoosh (grow), pop |
| S04 | L3 | backyard | dog wags; at "squirrel" its shadow on the fence (big) yells, with bubble "SQUIRREL!" | 1.2x | whip | bark |
| S05 | L4 | kitchen | Mom smiles and holds `holdDrawing`. Nubi (x 260, q34) is proud. At "shadow", Mom's wall shadow appears (dx +260); at "potato", bubble "IT'S A POTATO." Nubi → confused | medium two-shot | cut | ding, sad_trombone |
| S06 | L5 | hallway (dim end) | Nubi close-up talking to camera (lip-sync L5), under `holdUmbrella`, tiny shadow at his feet. At "light", he pulls the umbrella lower | 2.0x | zoom | step |
| S07 | L6 | backyard as schoolyard | Nubi walks hunched under the umbrella. kidA, kidB and kidE point and laugh (kidE makes "fangs" with hands up). | wide | cut | laugh |
| S08 | L7 | hallway | Nubi nervous, looking down at his tiny shadow, whose eyes go wide. HUD pops in at "secret" | 1.6x | cut | hud |
| S09 | L8 | hallway | "Lily.": Lily walks past (q34, flip -1) with sparkles. Nubi blushes (shy). His tiny shadow's eyes go happy with hearts bursting from it | 1.4x | zoom | chime, sparkle |
| **Part 2** ||||||
| S10 | L9 | stage | Brayden (smug) shoves Nubi from the left onto the stage (Nubi stumbles, surprise, flails to centre x 540) | 1.2x stage | whip | whoosh, thud |
| S11 | L10 | stage | at "spotlight": the spotlight slams on (ui spotlight) and Nubi freezes (terrified). His shadow appears on the curtain | low angle, 1.4x | cut | impact |
| S12 | L11 | stage | "ten feet tall": pull back to reveal the giant shadow (k 2.6) towering on the curtain, eyes wide | pull back to ~0.85x | cut | magic (low) |
| S12b | L11 from "and" | gym floor | front row: Lily (centre, holding book, looks up, shy), kidA, kidC; Brayden standing at the right smirking | 1.2x | cut | chime |
| S13 | L12 | stage | the giant shadow inhales (scales up about 12%, mouth round). Nubi screams. Subscribe button; red vignette pulses | 1.1x | zoom | click, alarm |
| S14 | L13 | stage | Nubi pulls off his hoodie at "hoodie" (nubiHoodie flips) and it lands over the shadow's face (draw teal cloth on the curtain). At "peeked", the shadow's glowing eyes peek above it | 1.0x | cut | poof, boing |
| S15 | L14 | stage | Nubi hits a light switch (side of stage). At "off", everything goes black except glowing shadow eyes. At "emergency", `emergencyLights`, and the shadow is back and even bigger, red-lit | 1.0x + shake | cut | click, alarm |
| S16 | L15 | gym floor aisle | the spotlight swings to Brayden (ui spotlight at his x). His shadow rises on the gym wall behind him. Smug → surprised at "said" | 1.3x | whip | whoosh |
| S17 | L16 | gym floor | Brayden's shadow talks (lip-sync L16) with dark bubble "MISTER SNUGGLES!" and a small teddy (holdTeddy) popping beside it. Brayden in front covers his mouth, horrified | 1.6x on the shadow → Brayden | zoom | pop, record |
| **Part 3** ||||||
| S18 | L17 | gym floor | audience (kidA–kidF, front view) gasp with round mouths at "gasped". At "red", cut to a Brayden close-up with `red: 1`, steam puffs | wide → close | cut | scratch, poof |
| S19 | L18 | stage, dim | calm. Nubi looks back at his giant shadow, which looks gently down at him (eyes normal → happy at "hide"). Sparkle at "realized" | slow push | cut | magic |
| S20 | L19 | stage | Nubi turns to the audience, steps forward, determined. The shadow follows his pose | 1.4x | cut | step, swell |
| S21 | L20 | stage | at "mic", Nubi grabs the mic (`holdMic`). Close-up, lip-sync "Lily, I like you" (L20). HUD becomes OUT ♥ at "lily". Hearts at "you" | 2.0x | zoom | swell |
| S22 | L21 | stage | the giant shadow shrugs (hands out), lip-syncs after "yeah", dark bubble "YEAH, WHAT HE SAID." Nubi blushes | 1.0x | cut | boing |
| S23 | L22 | gym floor, pink glow | Lily stands up shy. Her shadow on the wall leans in and whispers a small bubble "...finally ♥" at "finally". Hearts burst | 1.5x | cut | chime, sparkle |
| S24 | L23 | backyard as sunny park | Nubi (no hoodie) and Lily walk right together, blushing. Their big shadows on the fence **hold hands** (shadow poses with arms reaching, hands meeting) | tracking wide | whip | swell |
| S25 | L24 | hallway, sunny (same as S01) | Nubi walks proudly in the sunlight. His big shadow on the lockers smiles (happy eyes) with bubble "♥ LILY". Subscribe button. Push in to the shadow's glowing face at about 1.7x by the end (loops to S01) | 1.0x → 1.7x | cut | click, whoosh |

Part 1 = S01–S09 (L0–L8, 0–17.2 s) · Part 2 = S10–S17 (L9–L16, 17.2–35.9 s) · Part 3 = S18–S25 (L17–L24, 35.9–54 s)
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/examples/shadow-thoughts/script_lines.json
~~~~~~~~ json
[
 {"id": "L0", "text": "In this world, your shadow says what you're really thinking."},
 {"id": "L1", "text": "Out loud."},
 {"id": "L2", "text": "You see, shadows can't lie. And the bigger the shadow, the louder it gets."},
 {"id": "L3", "text": "My dog's shadow just yells squirrel!"},
 {"id": "L4", "text": "And Mom loves my drawings. Her shadow says... it's a potato.", "gap": 0.15},
 {"id": "L5", "text": "Me? I keep my shadow tiny. I stay out of the light."},
 {"id": "L6", "text": "Kids call me Vampire Nubi."},
 {"id": "L7", "text": "Because my shadow has one big secret.", "gap": 0.25},
 {"id": "L8", "text": "Lily.", "gap": 0.3},
 {"id": "L9", "text": "Then one day, Brayden pushed me onto the talent show stage."},
 {"id": "L10", "text": "Right under the biggest spotlight in school."},
 {"id": "L11", "text": "My shadow was ten feet tall. And Lily was in the front row.", "gap": 0.2},
 {"id": "L12", "text": "Subscribe, because my shadow just took a deep breath.", "gap": 0.2},
 {"id": "L13", "text": "I covered it with my hoodie. It peeked out."},
 {"id": "L14", "text": "I turned off the lights. The emergency lights turned on."},
 {"id": "L15", "text": "Then the spotlight hit Brayden, and his shadow said...", "gap": 0.25},
 {"id": "L16", "text": "I still sleep with a teddy bear named Mister Snuggles.", "speaker": "brayden-shadow", "gap": 0.2},
 {"id": "L17", "text": "Everyone gasped. Brayden turned bright red."},
 {"id": "L18", "text": "That's when I realized something. Shadows only say what you hide."},
 {"id": "L19", "text": "So I stopped hiding.", "gap": 0.2},
 {"id": "L20", "text": "I grabbed the mic and said it myself. Lily, I like you.", "speaker": "nubi", "gap": 0.3},
 {"id": "L21", "text": "My shadow just shrugged. Yeah, what he said.", "speaker": "nubi-shadow", "gap": 0.25},
 {"id": "L22", "text": "Then Lily's shadow whispered... finally.", "speaker": "lily-shadow", "gap": 0.35},
 {"id": "L23", "text": "Now we walk in the sun together. Our shadows hold hands."},
 {"id": "L24", "text": "Subscribe if your shadow knows your secret too."}
]
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/examples/shadow-thoughts/shots/part1.js
~~~~~~~~ js
// shots/part1.js — S01–S09 (L0–L8): the world of talking shadows, and Nubi's tiny, secret-keeping shadow.
'use strict';
shots(() => {
  const S = [];
  // a shadow "chattering" (talking mouth that isn't tied to the narration)
  const chatter = (T, seed = 0) => ['smallOpen', 'wideOpen', 'round', 'teethOpen', 'closed'][Math.floor(T * 9 + seed * 3) % 5];
  // Nubi's tiny shadow at his feet (k .4), holding the same umbrella if he does
  const tinyShadow = (ctx, p, T, o = {}) => shadowOf(ctx, 'nubi', p, T, Object.assign({ k: .42, dx: 125, alpha: .6, seed: 3 }, o));
  // Umbrella held straight up over the head: undo the arm/hand/lean rotation so it stays upright, tilt the top toward
  // the head, and use a stick of length L (rig units). Shorter L = umbrella pulled lower. Use with p.armR ≈ 2.9.
  const umb = (p, L = 200, tilt = .5) => ctx => { ctx.save(); ctx.rotate(p.armR + p.handR - p.lean - tilt);
    box(ctx, -6, -L, 12, L + 40, 5, '#333', 4);
    ctx.translate(0, -L + 300); ctx.beginPath(); ctx.moveTo(-230, -300); ctx.quadraticCurveTo(0, -470, 230, -300);
    for (let i = 4; i >= 0; i--) ctx.quadraticCurveTo(-230 + (i + .5) * 92, -270, -230 + i * 92, -300); ctx.closePath(); fillStroke(ctx, '#24225B', 8);
    circle(ctx, 0, -388, 10, '#24225B', 5); ctx.restore(); };
  const umbArm = p => { p.armR = 2.9; p.handR = 0; return p; };
  const dimHall = (ctx, a) => { ctx.fillStyle = `rgba(28,20,70,${a})`; ctx.fillRect(-3000, -2000, 9000, 6000); };

  // ===== S01 — L0 "In this world, your shadow says what you're really thinking." (HOOK) =====
  const s01Says = ws('L0', 'says');
  S.push({ id: 'S01', start: 0, trans: 'none', capY: 1620,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const c = track([[0, camAt(255, 1010, 1.7)], [.35, camAt(255, 1010, 1.66)], [1.4, camAt(540, 1060, 1.0)]], lt); c.z += Math.max(0, lt - 1.4) * .03; return c; },
    draw(ctx, T, lt) {
      // wall shadows first (light comes from the windows on the left → shadows fall right, onto the lockers)
      const ap = idle(P({ x: 160, y: 1500, s: .8 }), T, 2); ap.armL = .35; ap.handL = .5;
      const cp = idle(P({ x: 860, y: 1500, s: .8 }), T, 4, .6); cp.head = -.08 + Math.sin(T * 1.3) * .03;
      shadowOf(ctx, 'kidA', ap, T, { k: 1.6, dx: 95, mouth: chatter(T, 1), seed: 1 });
      shadowOf(ctx, 'kidC', cp, T, { k: 1.55, dx: 70, mouth: T > s01Says ? chatter(T, 2) : 'closed', eyes: 'closed', seed: 2 });
      const np = idle(P({ x: 520, y: 1500, s: .78 }), T, 1, .5); np.headY = 14; np.armL = .02; np.armR = .02; np.squash = .97;
      tinyShadow(ctx, np, T, { k: .38, dx: 120 });
      C(ctx, 'kidA', ap, { expr: 'neutral', eyes: { open: .8 }, lookX: .2 }, T);
      C(ctx, 'kidC', cp, { expr: 'neutral', eyes: { open: .55 }, lookX: -.2 }, T);
      C(ctx, 'nubi', np, { expr: 'nervous', lookX: .5, lookY: .5, hoodie: nubiHoodie(T) }, T);
      speechBubble(ctx, 300, 700, "I'M HUNGRY", T + .2, { dark: true, size: 56, tail: -20 });
      speechBubble(ctx, 770, 690, 'THIS IS BORING', T - s01Says, { dark: true, size: 52, tail: 30 });
    },
    sfx: [[0, 'bell', .45], [.05, 'pop', .5], [s01Says, 'pop', .5]] });

  // ===== S02 — L1 "Out loud." kidC's shadow shouts BORING!! =====
  const s02Loud = ws('L1', 'loud');
  S.push({ id: 'S02', start: st('L1'), trans: 'zoom', capY: 1660,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const T = lt + st('L1'); const sh = Math.sin(T * 60) * 9 * Math.exp(-(T - s02Loud) * 4) * (T > s02Loud ? 1 : 0); return camAt(800 + sh, 1060, 1.38 + lt * .08); },
    draw(ctx, T, lt) {
      const t0 = st('L1');
      const cp = idle(P({ x: 860, y: 1500, s: .8 }), T, 4, .6);
      const grow = 1.55 + .2 * spring(T - t0, 2.5, 6);
      shadowOf(ctx, 'kidC', cp, T, { k: grow, dx: 70, mouth: 'scream', eyes: 'wide', seed: 2 });
      // teacher in the back row turns around at "loud"
      const turned = T > s02Loud;
      const tp = idle(P({ x: 560, y: 1400, s: .62, view: turned ? 'q34' : 'back' }), T, 6, .5);
      if (turned) surprise(tp, T - s02Loud);
      C(ctx, 'teacher', tp, { expr: 'surprised', lookX: .6 }, T);
      cp.armL = .5; cp.armR = .5;
      C(ctx, 'kidC', cp, { expr: 'nervous', eyes: { open: 1.2 }, lookX: .5, lookY: -.4 }, T);
      speechBubble(ctx, 770, 650, 'BORING!!', T - t0 - .02, { dark: true, size: 90, tail: 40, rot: -.05 });
    },
    sfx: [[.05, 'boing', .6]] });

  // ===== S03 — L2 "Shadows can't lie. And the bigger the shadow, the louder it gets." =====
  const s03Shadows = ws('L2', 'shadows'), s03Bigger = ws('L2', 'bigger'), s03Louder = ws('L2', 'louder');
  S.push({ id: 'S03', start: st('L2'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540 + lt * 6, 1050, 1.0 + lt * .03),
    draw(ctx, T, lt) {
      // kidB: small shadow, whispering
      const bp = idle(P({ x: 190, y: 1500, s: .76, view: 'q34' }), T, 3);
      shadowOf(ctx, 'kidB', bp, T, { k: .95, dx: 120, mouth: T > s03Shadows && T < s03Bigger ? (Math.floor(T * 6) % 2 ? 'smallOpen' : 'closed') : 'closed', seed: 5 });
      // kidD: steps toward the window light at "bigger", his shadow grows 0.9 → 2.2
      const u = inv(s03Bigger, s03Louder + .15, T), dx0 = lerp(780, 600, easeInOut(u));
      let dp = P({ x: dx0, y: 1500, s: .78, view: 'q34', flip: -1 });
      if (u > 0 && u < 1) walk(dp, T, 1.4); else idle(dp, T, 7);
      const k = lerp(.9, 2.25, easeInOut(u));
      shadowOf(ctx, 'kidD', dp, T, { k, dx: lerp(110, 190, u), mouth: T > s03Louder ? chatter(T, 4) : 'closed', eyes: T > s03Louder ? 'happy' : 'normal', seed: 6 });
      C(ctx, 'kidB', bp, { expr: 'neutral', lookX: .3 }, T);
      C(ctx, 'kidD', dp, { expr: T > s03Louder + .2 ? 'shy' : 'neutral', lookX: T > s03Louder + .2 ? .7 : 0, lookY: T > s03Louder + .2 ? -.5 : 0 }, T);
      speechBubble(ctx, 370, 1040, 'psst...', T - s03Shadows, { dark: true, size: 46, dur: s03Bigger - s03Shadows, tail: -10 });
      const bs = lerp(56, 82, smooth(inv(s03Louder, s03Louder + .6, T)));
      speechBubble(ctx, 600, 470, 'I LOVE PIZZA!!!', T - s03Louder, { dark: true, size: bs, tail: 50 });
    },
    sfx: [[s03Shadows - st('L2'), 'pop', .3], [s03Bigger - st('L2'), 'whoosh', .5], [s03Louder - st('L2'), 'pop', .6]] });

  // ===== S04 — L3 "My dog's shadow just yells squirrel!" =====
  const s04Sq = ws('L3', 'squirrel');
  const squirrel = (ctx, x, y, s, T) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.save(); ctx.translate(-30, -30); ctx.rotate(-.3 + Math.sin(T * 9) * .12); box(ctx, -26, -110, 52, 120, 26, '#B5733F', 7); ctx.restore();
    ellipse(ctx, 10, -30, 34, 38, '#C98B4B', 7); circle(ctx, 30, -76, 26, '#C98B4B', 7); circle(ctx, 22, -100, 9, '#C98B4B', 5);
    circle(ctx, 38, -80, 5, OUTLINE); circle(ctx, 54, -72, 5, OUTLINE); ctx.restore(); };
  S.push({ id: 'S04', start: st('L3'), trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envBackyard(ctx, T, cam),
    cam: lt => { const T = lt + st('L3'); const sh = T > s04Sq ? Math.sin(T * 55) * 10 * Math.exp(-(T - s04Sq) * 5) : 0; return camAt(640 + sh, 1180, 1.2 + lt * .04); },
    draw(ctx, T, lt) {
      const jump = T > s04Sq ? Math.max(0, Math.sin(clamp((T - s04Sq) / .35) * Math.PI)) * 60 : 0;
      const ss = lerp(1.25, 1.75, easeOut(inv(s04Sq - .1, s04Sq + .2, T)));
      dogShadow(ctx, 540, 1430 - jump * 1.6, ss, T, { lines: T > s04Sq - .05 ? ['L3'] : [], alpha: .72 });
      // squirrel on the fence top (well clear of the shadow's face)
      const sqIn = easeOut(inv(s04Sq - .5, s04Sq - .1, T));
      if (sqIn > 0) squirrel(ctx, lerp(1250, 990, sqIn), 965, .9, T);
      drawDog(ctx, 400, 1500 - jump, .95, T);
      speechBubble(ctx, 700, 760, 'SQUIRREL!', T - s04Sq, { dark: true, size: 84, tail: 20, rot: -.04 });
    },
    sfx: [[s04Sq - st('L3'), 'bark', .7]] });

  // ===== S05 — L4 "And Mom loves my drawings. Her shadow says... it's a potato." =====
  const s05Loves = ws('L4', 'loves'), s05Shadow = ws('L4', 'shadow'), s05Its = ws('L4', "it's"), s05Potato = ws('L4', 'potato');
  S.push({ id: 'S05', start: st('L4'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam),
    cam: lt => { const T = lt + st('L4'); const k = smooth(inv(s05Shadow - .1, s05Shadow + .5, T)); return camAt(lerp(520, 590, k), lerp(1090, 1050, k), 1.18 + lt * .025); },
    draw(ctx, T, lt) {
      const mp = idle(P({ x: 650, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 4); mp.armR = 1.5; mp.handR = -.3;
      const sa = smooth(inv(s05Shadow, s05Shadow + .3, T));
      if (sa > 0) shadowOf(ctx, 'mom', mp, T, { k: 1.4, dx: 230, alpha: .6 * sa, eyes: 'normal', mouth: T > s05Its - .02 ? (lipShape(T, ['L4']) || 'flat') : 'flat', face: { holding: { R: holdDrawing } }, seed: 4 });
      const np = idle(P({ x: 250, y: 1500, s: .8, view: 'q34' }), T, 1);
      const conf = T > s05Potato;
      if (!conf) { np.armL = -.25; np.armR = -.25; np.bodyY -= 6; np.lean = -.06; } else { np.head = .14; np.armR = .9; }
      C(ctx, 'nubi', np, { expr: conf ? 'confused' : 'excited', hoodie: nubiHoodie(T) }, T);
      C(ctx, 'mom', mp, { expr: 'happy', holding: { R: holdDrawing } }, T);
      if (T > s05Loves && T < s05Shadow) burst(ctx, 640, 1000, T - s05Loves, { kind: 'heart', n: 6, speed: 300, gravity: -200, life: 1, size: 22, seed: 5 });
      speechBubble(ctx, 790, 690, "IT'S A POTATO.", T - s05Potato + .05, { dark: true, size: 50, tail: 60 });
    },
    sfx: [[s05Loves - st('L4'), 'ding', .5], [s05Potato - st('L4') + .15, 'sad_trombone', .55]] });

  // ===== S06 — L5 "Me? I keep my shadow tiny. I stay out of the light." (Nubi close-up, lip-sync) =====
  const s06Tiny = ws('L5', 'tiny'), s06Light = ws('L5', 'light');
  S.push({ id: 'S06', start: st('L5'), trans: 'zoom', capY: 1700,
    bg: (ctx, T, cam) => { envHallway(ctx, T, cam); dimHall(ctx, .38); },
    cam: lt => camAt(560, 1210, 1.95 + lt * .06),
    draw(ctx, T, lt) {
      const lo = easeOut(inv(s06Light - .1, s06Light + .25, T)), L = lerp(210, 120, lo);
      const np = talk(idle(P({ x: 540, y: 1500, s: .8, flip: -1 }), T, 1), T, 1, .4); umbArm(np);
      // at "tiny" he points down at his tiny shadow
      const pt = smooth(inv(s06Tiny - .15, s06Tiny + .1, T)) * (1 - smooth(inv(s06Tiny + .9, s06Tiny + 1.2, T)));
      np.armL = lerp(np.armL, 1.0, pt); np.handL = lerp(0, -.5, pt);
      np.headY += lo * 10; np.squash = 1 - lo * .04;
      const um = umb(np, L);
      tinyShadow(ctx, np, T, { k: .4, dx: 150, eyes: T > s06Light ? 'wide' : 'normal', face: { holding: { R: um } } });
      const expr = T > s06Light - .05 ? 'nervous' : T > s06Tiny - .1 ? 'smug' : 'happy';
      C(ctx, 'nubi', np, { expr, mouth: lipShape(T, ['L5']), lookX: pt > .3 ? -.6 : 0, lookY: pt > .3 ? .6 : T > s06Light ? -.6 : 0, hoodie: nubiHoodie(T), holding: { R: um } }, T);
    },
    sfx: [[s06Light - st('L5'), 'step', .5]] });

  // ===== S07 — L6 "Kids call me Vampire Nubi." =====
  const s07Vamp = ws('L6', 'vampire');
  S.push({ id: 'S07', start: st('L6'), trans: 'cut', capY: 1630,
    bg: (ctx, T, cam) => envBackyard(ctx, T, cam),
    cam: lt => camAt(660 + lt * 8, 1110, 1.04 + lt * .03),
    draw(ctx, T, lt) {
      const t0 = st('L6');
      const nx = lerp(250, 370, inv(t0, s07Vamp + .2, T));
      const np = T < s07Vamp + .2 ? walk(P({ x: nx, y: 1500, s: .78, view: 'q34' }), T, 1.1, .7) : idle(P({ x: nx, y: 1500, s: .78, view: 'q34' }), T, 1);
      umbArm(np); np.headY += 12; np.lean += .08;
      if (T > s07Vamp) { np.squash = .95; np.headY += 6; }
      const um = umb(np, T > s07Vamp ? 150 : 190);
      tinyShadow(ctx, np, T, { k: .38, dx: 110, face: { holding: { R: um } } });
      C(ctx, 'nubi', np, { expr: T > s07Vamp ? 'sad' : 'nervous', lookX: .4, lookY: .5, hoodie: nubiHoodie(T), holding: { R: um } }, T);
      // kidB laughing
      const bp = laugh(P({ x: 845, y: 1500, s: .7, view: 'q34', flip: -1 }), T, T > s07Vamp ? 1 : .3);
      C(ctx, 'kidB', bp, { expr: 'laughing' }, T);
      // kidA points and laughs
      const ap = P({ x: 640, y: 1500, s: .74, view: 'q34', flip: -1 }); idle(ap, T, 2);
      if (T > t0 + .3) { laugh(ap, T, .6); ap.armR = 1.65 + Math.sin(T * 10) * .08; ap.handR = .1; }
      C(ctx, 'kidA', ap, { expr: T > t0 + .3 ? 'laughing' : 'smug' }, T);
      // kidE: "fangs" — hands up like claws at "vampire"
      const ep = idle(P({ x: 1040, y: 1500, s: .74, view: 'q34', flip: -1 }), T, 5);
      const f = smooth(inv(s07Vamp - .1, s07Vamp + .15, T));
      ep.armL = lerp(ep.armL, 2.5, f); ep.armR = lerp(ep.armR, 2.3, f); ep.handL = -1.1 * f; ep.handR = -1.1 * f; ep.lean += .12 * f; ep.bodyY -= 10 * f;
      C(ctx, 'kidE', ep, { expr: f > .5 ? 'excited' : 'laughing', mouth: f > .5 ? 'teethOpen' : null }, T);
      speechBubble(ctx, 960, 880, 'VAMPIRE!', T - s07Vamp, { size: 62, tail: 10, rot: .05 });
    },
    sfx: [[s07Vamp - st('L6'), 'laugh', .6]] });

  // ===== S08 — L7 "Because my shadow has one big secret." (HUD pops in at "secret") =====
  const s08Shadow = ws('L7', 'shadow'), s08Secret = ws('L7', 'secret');
  S.push({ id: 'S08', start: st('L7'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => { envHallway(ctx, T, cam); dimHall(ctx, .25); },
    cam: lt => { const T = lt + st('L7'); const k = smooth(inv(s08Shadow - .2, s08Shadow + .6, T)); return camAt(lerp(560, 600, k), lerp(1190, 1230, k), 1.55 + lt * .05); },
    draw(ctx, T, lt) {
      const np = idle(P({ x: 520, y: 1500, s: .8, view: 'q34' }), T, 1, .5); umbArm(np); np.headY += 14; np.head = .1;
      const um = umb(np, 170), sec = T > s08Secret;
      const jit = sec ? Math.sin(T * 47) * 3 : 0;
      tinyShadow(ctx, np, T, { k: .5, dx: 150 + jit, eyes: sec ? 'wide' : 'normal', mouth: sec ? 'flat' : 'closed', face: { holding: { R: um } } });
      C(ctx, 'nubi', np, { expr: 'nervous', lookX: .7, lookY: .9, hoodie: nubiHoodie(T), holding: { R: um } }, T);
      // a nervous "!" over the tiny shadow at "secret"
      if (sec) popText(ctx, '!', 700, 1220, T - s08Secret, { size: 90, fill: '#FFD447', rot: .1 });
    },
    sfx: [[s08Secret - st('L7'), 'hud', .6]] });

  // ===== S09 — L8 "Lily." She walks past; Nubi blushes; his tiny shadow bursts hearts =====
  const s09Lily = ws('L8', 'lily');
  S.push({ id: 'S09', start: st('L8'), trans: 'zoom', capY: 1660,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(580, 1210, 1.4 + lt * .06),
    draw(ctx, T, lt) {
      const t0 = st('L8');
      const lx = lerp(1060, 800, easeOut(inv(t0, t0 + 1.1, T)));
      const lp = walk(P({ x: lx, y: 1500, s: .78, view: 'q34', flip: -1 }), T, 1.1, .8);
      const np = idle(P({ x: 360, y: 1500, s: .8, view: 'q34' }), T, 1, .5); umbArm(np);
      const shy = T > s09Lily + .1, um = umb(np, 180);
      if (shy) { np.squash = .97; np.head = -.08; }
      tinyShadow(ctx, np, T, { k: .45, dx: 140, eyes: shy ? 'happy' : 'normal', face: { holding: { R: um } } });
      C(ctx, 'nubi', np, { expr: shy ? 'shy' : 'surprised', lookX: .8, lookY: shy ? .2 : 0, blush: shy ? 1 : 0, hoodie: nubiHoodie(T), holding: { R: um } }, T);
      lp.armL = .5;
      C(ctx, 'lily', lp, { expr: 'happy', lookX: .2, holding: { L: holdBook } }, T);
      // sparkles around Lily
      for (let i = 0; i < 7; i++) { const a = hash(i + 5) * TAU + T * .8, r = 170 + hash(i + 9) * 90, tw = Math.max(0, Math.sin(T * 6 + i * 1.7));
        starPath(ctx, lx + Math.cos(a) * r, 1220 + Math.sin(a) * r * .9, 22 * tw + 4, 6 * tw + 1, 4); fillStroke(ctx, '#FFF6B0', 0); }
      burst(ctx, 500, 1370, T - s09Lily - .12, { kind: 'heart', n: 9, speed: 520, angle: -Math.PI / 2, spread: 1.4, gravity: 300, life: 1.0, size: 24, seed: 11 });
    },
    sfx: [[s09Lily - st('L8'), 'chime', .55], [s09Lily - st('L8') + .15, 'sparkle', .5]] });

  return S;
});
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/examples/shadow-thoughts/shots/part2.js
~~~~~~~~ js
// shots/part2.js — S10–S17 (L9–L16): the talent-show stage, the giant shadow, and Brayden's shadow spilling his secret.
'use strict';
shots(() => {
  const S = [];
  const STAGE = 1190;                       // stage floor (envStage)
  const toScr = (cam, x, y) => [(x - cam.x) * cam.z + 540, (y - cam.y) * cam.z + 960];

  // ---------- local helpers (part 2 only) ----------
  // Where a shadowOf() head lands (same maths as story.js shadowOf).
  const shHead = (name, pose, k, dx = 0) => { const S = pose.s * k * (CAST[name].tall || 1);
    return { x: pose.x + dx + (pose.view === 'q34' ? RIG.headW * .1 * S * pose.flip : 0), y: pose.y + (pose.bodyY - RIG.legH - RIG.torsoH - RIG.headH * .45) * S, S }; };
  // Soft elliptical pool of light on a wall/curtain (world space, additive).
  function wallLight(ctx, x, y, rx, ry, a, col = '255,226,160') {
    if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(rx, ry);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, `rgba(${col},${.42 * a})`); g.addColorStop(.6, `rgba(${col},${.22 * a})`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill(); ctx.restore();
  }
  // Dark backs-of-heads audience in front of the stage (world space, below the stage lip).
  function crowdBacks(ctx, T, y = 1960, s = .95) {
    // flat dark silhouettes (fast; ctx.filter is extremely slow to render)
    drawSilhouette(ctx, c2 => [[90, 'kidB'], [320, 'kidE'], [540, 'kidD'], [760, 'kidF'], [990, 'kidA']].forEach(([x, n], i) => {
      const p = idle(P({ x, y: y + (i % 2) * 40, s, view: 'back' }), T, i + 4, .7); drawCharacter(c2, n, p, {}, T); }), .95 * ctx.globalAlpha, '#1B1733');
  }
  // Gym floor seen from the stage: cinder-block back wall (light enough for shadows to read), blue wall mats, EXIT sign.
  // envAudience() lives in story.js (shared with part 3)
  // Nubi's teal hoodie as a loose cloth (thrown / draped over the giant shadow's face).
  function hoodieCloth(ctx, x, y, sc, rot = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
    const c = '#20BDBB';
    ctx.save(); ctx.translate(-112, -70); ctx.rotate(.35); box(ctx, -30, 0, 60, 170, 24, shade(c, -.12), 8); ctx.restore();
    ctx.save(); ctx.translate(112, -70); ctx.rotate(-.35); box(ctx, -30, 0, 60, 170, 24, shade(c, -.12), 8); ctx.restore();
    box(ctx, -120, -84, 240, 200, 28, c, 8);
    starPath(ctx, -46, -20, 30, 13); fillStroke(ctx, '#fff', 5);
    rr(ctx, -74, 52, 148, 48, 14); fillStroke(ctx, shade(c, -.12), 6);
    ctx.restore();
  }
  // White eyes in a blackout (world space).
  function darkEyes(ctx, name, p, T) {
    const S = p.s * (CAST[name].tall || 1), q = p.view === 'q34', fx = q ? RIG.headW * .94 * .1 : 0, sep = 50 * (q ? .92 : 1);
    const y = p.y + p.bodyY * p.s + (-421 + p.headY) * S, bl = blinkAmt(CAST[name].seed, T);
    ctx.save(); ctx.shadowColor = '#fff'; ctx.shadowBlur = 12;
    for (const e of [-sep, sep]) ellipse(ctx, p.x + (fx + e) * S * p.flip, y, 15 * S, 22 * S * bl, '#fff');
    ctx.restore();
  }

  // ===== S10 — Then one day, Brayden pushed me onto the talent show stage. =====
  const s10 = st('L9'), tBray = ws('L9', 'brayden'), tPush = ws('L9', 'pushed'), tStage = ws('L9', 'stage');
  const cam10 = lt => { const T = lt + s10, k = smooth(inv(tPush, tStage + .25, T));
    const sh = T > tStage ? Math.sin(T * 60) * 8 * Math.exp(-(T - tStage) * 5) : 0;
    return camAt(lerp(400, 540, k) + sh, 1020, 1.3 + lt * .03); };
  S.push({ id: 'S10', start: s10, trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envStage(ctx, T, cam),
    cam: cam10,
    draw(ctx, T, lt) {
      // Brayden sneaks out of the left wing, winds up on "Brayden", shoves on "pushed", then dusts his hands and backs off
      const bx = T < tPush ? lerp(40, 170, easeOut(inv(s10, tPush, T))) : T < tStage + .1 ? 170 : lerp(170, 40, easeInOut(inv(tStage + .1, tStage + .8, T)));
      const bp = P({ x: bx, y: STAGE, s: .8, view: 'q34' });
      if (T < tBray) { idle(bp, T, 3); if (T < tPush) walk(bp, T, 1.1, .5); }
      else if (T < tPush) { anticipate(bp, T - tBray, tPush - tBray); bp.armL = -.55; bp.armR = -.45; bp.lean = -.12; }
      else if (T < tStage + .1) { const k = easeOut(inv(tPush, tPush + .1, T)); bp.armL = lerp(-.55, 1.6, k); bp.armR = lerp(-.45, 1.5, k); bp.lean = .25 * (1 - inv(tPush + .2, tStage, T)); }
      else { idle(bp, T, 3); walk(bp, T, 1.2, .6); bp.armL = .5 + Math.sin(T * 22) * .25; bp.armR = .5 - Math.sin(T * 22) * .25; }
      // Nubi: resisting at the wing edge → launched, flailing, to centre → lands on "stage"
      const nx = T < tPush ? 330 : lerp(330, 540, easeOut(inv(tPush, tStage, T)));
      let np = P({ x: nx, y: STAGE, s: .8, view: 'q34' });
      let nf = { expr: 'nervous', lookX: T > tBray ? -.7 : 0, hoodie: nubiHoodie(T) };
      if (T < tPush) { idle(np, T, 1); np.lean = -.1; }
      else if (T < tStage) { run(np, T, 2.6); np.armL = 2.4 + Math.sin(T * 34) * .9; np.armR = 1.7 + Math.cos(T * 34) * 1.0; np.lean = .32; nf = { expr: 'screaming', hoodie: nubiHoodie(T) }; }
      else { const d = T - tStage; np.view = 'front'; np.squash = lerp(.8, 1, spring(d, 3, 6)); np.armL = .2 + 1.2 * Math.exp(-d * 3) * (1 + Math.sin(d * 18) * .3); np.armR = .2 + 1.2 * Math.exp(-d * 3) * (1 - Math.sin(d * 18) * .3); idle(np, T, 1, .5);
        nf = { expr: 'terrified', lookY: .15, hoodie: nubiHoodie(T) }; }
      // tiny shadow at his feet (he still keeps it small)
      shadowOf(ctx, 'nubi', np, T, { k: .4, dx: 80, eyes: T > tPush ? 'wide' : 'normal', face: { hoodie: nubiHoodie(T) } });
      C(ctx, 'brayden', bp, { expr: T > tPush ? 'laughing' : 'smug' }, T);
      C(ctx, 'nubi', np, nf, T);
      burst(ctx, 540, STAGE, T - tStage, { kind: 'dust', n: 16, speed: 650, angle: -Math.PI / 2, spread: 2.6, gravity: 400, life: .6, size: 30 });
      crowdBacks(ctx, T);
    },
    ui(ctx, T) { popText(ctx, 'SHOVE!', 330, 700, T - tPush, { size: 96, fill: '#FFD447', rot: -.15, dur: .8 }); },
    sfx: [[tPush - s10, 'whoosh', .6], [tStage - s10, 'thud', .65]] });

  // ===== S11 — Right under the biggest spotlight in school. =====
  const s11 = st('L10'), tSpot = ws('L10', 'spotlight');
  const cam11 = lt => { const T = lt + s11, k = easeOut(inv(tSpot, tSpot + .15, T));
    const sh = T > tSpot ? Math.sin(T * 70) * 10 * Math.exp(-(T - tSpot) * 6) : 0;
    return camAt(540 + sh, 1130, lerp(1.4 + lt * .03, 1.5 + lt * .03, k), -.05 * k); };
  const nubiK = (T, t0) => T < t0 ? .45 : lerp(.45, 2.6, easeOut(inv(t0, t0 + .45, T)));
  S.push({ id: 'S11', start: s11, trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envStage(ctx, T, cam),
    cam: cam11,
    draw(ctx, T, lt) {
      const on = T >= tSpot;
      const p = P({ x: 540, y: STAGE, s: .8 });
      if (!on) idle(p, T, 1); else { surprise(p, T - tSpot); p.armL = lerp(p.armL, .1, inv(tSpot + .25, tSpot + .5, T)); p.armR = lerp(p.armR, .1, inv(tSpot + .25, tSpot + .5, T)); p.x += Math.sin(T * 55) * 2; }
      wallLight(ctx, 540, 820, 700, 520, on ? smooth(inv(tSpot, tSpot + .1, T)) : 0);
      const k = nubiK(T, tSpot);
      shadowOf(ctx, 'nubi', p, T, { k, dx: lerp(80, 40, inv(.45, 2.6, k)), eyes: 'wide', face: { hoodie: nubiHoodie(T) } });
      C(ctx, 'nubi', p, { expr: on ? 'terrified' : 'nervous', lookX: on ? 0 : Math.sin(T * 3) * .7, noBlink: on, hoodie: nubiHoodie(T) }, T);
      crowdBacks(ctx, T);
    },
    ui(ctx, T) {
      if (T < tSpot) return;
      spotlight(ctx, 540, .62);
      const f = 1 - inv(tSpot, tSpot + .15, T); if (f > 0) { ctx.fillStyle = `rgba(255,248,220,${.7 * f})`; ctx.fillRect(0, 0, W, H); }
    },
    sfx: [[tSpot - s11, 'impact', .7]] });

  // ===== S12 — My shadow was ten feet tall. (pull back to reveal the giant) =====
  const s12 = st('L11'), tTen = ws('L11', 'ten'), tFeet = ws('L11', 'feet'), tTall = ws('L11', 'tall'), s12b = ws('L11', 'and') - .08;
  const cam12 = lt => { const T = lt + s12, k = easeInOut(inv(s12 + .05, tTall + .25, T));
    return camAt(540, lerp(1120, 960, k), lerp(1.4, .85, k) - lt * .01); };
  S.push({ id: 'S12', start: s12, trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envStage(ctx, T, cam),
    cam: cam12,
    draw(ctx, T, lt) {
      const p = P({ x: 540, y: STAGE, s: .8 }); p.armL = .1; p.armR = .1; p.x += Math.sin(T * 55) * 2;
      if (T > tTall) { surprise(p, T - tTall); }
      wallLight(ctx, 540, 820, 700, 520, 1);
      const sp = Object.assign({}, p, { bodyY: Math.sin(T * 2) * 5 });
      shadowOf(ctx, 'nubi', sp, T, { k: 2.6, dx: 40, eyes: 'wide', face: { hoodie: nubiHoodie(T) } });
      C(ctx, 'nubi', p, { expr: 'terrified', lookY: T > tTen ? -.8 : 0, hoodie: nubiHoodie(T) }, T);
      // "ten feet" measuring arrow beside the shadow
      const h = shHead('nubi', sp, 2.6, 40), top = h.y - RIG.headH * .6 * h.S, u = easeOut(inv(tTen, tFeet + .2, T));
      if (u > 0) { const yT = lerp(STAGE, top, u); ctx.save(); ctx.strokeStyle = '#FFD447'; ctx.lineWidth = 12; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(940, STAGE); ctx.lineTo(940, yT); ctx.stroke(); ctx.beginPath(); ctx.moveTo(900, yT); ctx.lineTo(980, yT); ctx.moveTo(900, STAGE); ctx.lineTo(980, STAGE); ctx.stroke(); ctx.restore(); }
      crowdBacks(ctx, T);
    },
    ui(ctx, T, lt) {
      spotlight(ctx, 540, .62);
      const cam = cam12(lt), [x, y] = toScr(cam, 940, 620);
      popText(ctx, '10 FT!', Math.min(x, 900), y, T - tFeet, { size: 110, fill: '#FFD447', rot: .1, dur: 1.3 });
    },
    sfx: [[tTen - s12, 'magic', .4]] });

  // ===== S12b — And Lily was in the front row. (reverse: the audience) =====
  const tLily = ws('L11', 'lily'), tRow = ws('L11', 'row');
  S.push({ id: 'S12b', start: s12b, trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envAudience(ctx, T, cam, { dim: .35 }),
    cam: lt => camAt(580, 1230, 1.2 + lt * .05),
    draw(ctx, T, lt) {
      // back row (smaller) then front row
      for (const [n, x, i] of [['kidD', 370, 0], ['kidF', 600, 1]]) { const kp = idle(P({ x, y: 1395, s: .6 }), T, 7 + i); C(ctx, n, kp, { expr: 'surprised', lookY: -.7 }, T); }
      wallLight(ctx, 480, 1150, 330, 420, smooth(inv(tLily - .1, tLily + .3, T)), '255,120,190');
      for (const [n, x, i] of [['kidA', 260, 0], ['kidC', 700, 1]]) { const kp = idle(P({ x, y: 1500, s: .8 }), T, 2 + i); C(ctx, n, kp, { expr: 'surprised', lookY: -.8, lookX: i ? -.2 : .2 }, T); }
      const lp = idle(P({ x: 480, y: 1500, s: .8 }), T, 2, .6); lp.armL = -.55; lp.handL = .4; lp.armR = -.35;
      const up = T > tLily;
      if (up) lp.headY = -6 * spring(T - tLily, 2, 5);
      C(ctx, 'lily', lp, { expr: up ? 'shy' : 'neutral', lookY: up ? -.75 : .7, lookX: 0, holding: { L: holdBook } }, T);
      // Brayden at the right, arms crossed, smirking
      const bp = idle(P({ x: 915, y: 1470, s: .78 }), T, 3, .5); bp.armL = -1.0; bp.armR = -1.0; bp.handL = -.6; bp.handR = -.6;
      C(ctx, 'brayden', bp, { expr: 'smug', lookX: -.6 }, T);
      burst(ctx, 480, 960, T - tLily, { kind: 'sparkle', n: 12, speed: 520, gravity: 120, life: .9, size: 22, colors: ['#FF7AC0', '#FFD447', '#fff'] });
    },
    ui(ctx, T) { vignette(ctx, .45); },
    sfx: [[tLily - s12b, 'chime', .55]] });

  // ===== S13 — Subscribe, because my shadow just took a deep breath. =====
  const s13 = st('L12'), tShad13 = ws('L12', 'shadow'), tTook = ws('L12', 'took'), tDeep = ws('L12', 'deep'), tBreath = ws('L12', 'breath');
  const cam13 = lt => { const T = lt + s13, sh = T > tDeep ? Math.sin(T * 50) * 6 * smooth(inv(tDeep, tDeep + .2, T)) : 0;
    const u = easeInOut(inv(tTook, tBreath + .3, T)); return camAt(540 + sh, 800 - 60 * u, 1.1 + lt * .03); };
  S.push({ id: 'S13', start: s13, trans: 'zoom', capY: 1720,
    bg: (ctx, T, cam) => envStage(ctx, T, cam),
    cam: cam13,
    draw(ctx, T, lt) {
      const p = P({ x: 540, y: STAGE, s: .8 }); p.armL = .1; p.armR = .1; p.x += Math.sin(T * 55) * 2;
      const scream = T > tDeep;
      if (scream) { surprise(p, T - tDeep); p.armL = 2.6 + Math.sin(T * 30) * .15; p.armR = 2.6 - Math.sin(T * 30) * .15; p.bodyY -= 20 * Math.abs(Math.sin(T * 14)); }
      wallLight(ctx, 540, 820, 720, 540, 1);
      // the inhale: grows ~12%, chest puffs, arms lift, mouth round
      const u = easeInOut(inv(tTook, tBreath + .3, T));
      const sp = Object.assign({}, p, { armL: .1 + .7 * u, armR: .1 + .7 * u, squash: 1 + .05 * u, bodyY: -10 * u, x: 540 });
      shadowOf(ctx, 'nubi', sp, T, { k: 2.6 * (1 + .12 * u), dx: 40, eyes: 'wide', mouth: u > .02 ? 'round' : 'closed', face: { hoodie: nubiHoodie(T) } });
      C(ctx, 'nubi', p, { expr: scream ? 'screaming' : 'terrified', lookY: scream ? 0 : -.85, hoodie: nubiHoodie(T) }, T);
      // air being sucked in towards the shadow's mouth
      if (u > 0 && u < 1) { const h = shHead('nubi', sp, 2.6 * (1 + .12 * u), 40); ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 8; ctx.lineCap = 'round';
        for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + .3, f = (T * 2.5 + i / 6) % 1, r0 = lerp(520, 140, f); ctx.globalAlpha = Math.sin(f * Math.PI) * .8;
          ctx.beginPath(); ctx.moveTo(h.x + Math.cos(a) * r0, h.y + 100 + Math.sin(a) * r0 * .7); ctx.lineTo(h.x + Math.cos(a) * (r0 - 90), h.y + 100 + Math.sin(a) * (r0 - 90) * .7); ctx.stroke(); }
        ctx.restore(); }
      crowdBacks(ctx, T);
    },
    ui(ctx, T, lt) {
      spotlight(ctx, 540, .6);
      if (T > tDeep) vignette(ctx, .55 + .3 * Math.sin((T - tDeep) * 12), '238,56,74');
      drawSubscribe(ctx, lt - .05, tTook - s13);
    },
    sfx: [[.65, 'click', .6], [tDeep - s13, 'alarm', .5]] });

  // ===== S14 — I covered it with my hoodie. It peeked out. =====
  const s14 = st('L13'), tCover = ws('L13', 'covered'), tHood = ws('L13', 'hoodie'), tOff = tHood + .1, tPeek = ws('L13', 'peeked');
  const tStick = tOff + .35;
  S.push({ id: 'S14', start: s14, trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envStage(ctx, T, cam),
    cam: lt => { const T = lt + s14, sh = T > tPeek ? Math.sin(T * 60) * 6 * Math.exp(-(T - tPeek) * 6) : 0; return camAt(540 + sh, 880, 1.0 + lt * .03); },
    draw(ctx, T, lt) {
      const hood = nubiHoodie(T);
      const p = idle(P({ x: 540, y: STAGE, s: .8 }), T, 1, .6);
      let face = { expr: 'determined', lookY: -.6, hoodie: hood };
      if (T >= tCover && T < tOff) { const k = easeInOut(inv(tCover, tOff, T)); p.armL = lerp(-.4, 2.9, k); p.armR = lerp(-.4, 2.9, k); p.handL = p.handR = -.3; p.headY = 10 * k; }
      else if (T >= tOff && T < tStick + .15) { p.armL = 2.9; p.armR = lerp(2.9, 2.4, inv(tOff, tOff + .2, T)); anticipate(p, T - tOff, .15); }
      else if (T >= tStick + .15) { const d = T - tStick - .15; p.armL = lerp(2.9, .15, smooth(d / .3)); p.armR = lerp(2.4, .15, smooth(d / .3)); face = { expr: 'smug', lookY: -.6, hoodie: hood }; }
      if (T > tPeek) { surprise(p, T - tPeek); face = { expr: 'terrified', lookY: -.8, hoodie: hood }; }
      wallLight(ctx, 540, 820, 700, 520, 1);
      const sp = Object.assign({}, p, { armL: .1, armR: .1, handL: 0, handR: 0, headY: 0, bodyY: Math.sin(T * 2) * 5 });
      shadowOf(ctx, 'nubi', sp, T, { k: 2.6, dx: 40, eyes: T > tPeek ? 'normal' : 'wide', face: { hoodie: hood } });
      // the hoodie: flies from his hands to the shadow's face, sticks; on "peeked" it slips down and the eyes peek over it
      const h = shHead('nubi', sp, 2.6, 40);
      if (T >= tOff) {
        const f = easeOut(inv(tOff, tStick, T)), sx = 540, sy = STAGE - 640;
        const x = lerp(sx, h.x, f), y = lerp(sy, h.y + 40, f) - Math.sin(f * Math.PI) * 160;
        const slip = T > tPeek ? 180 * easeOut(inv(tPeek, tPeek + .18, T)) : 0;
        const wob = T > tStick ? Math.sin((T - tStick) * 20) * .06 * Math.exp(-(T - tStick) * 5) : 0;
        hoodieCloth(ctx, x, y + slip, lerp(.7, 2.15, f), (1 - f) * 5 + wob + (T > tPeek ? .06 : 0));
      }
      C(ctx, 'nubi', p, face, T);
      if (T > tPeek) { ctx.save(); ctx.globalAlpha = 1 - inv(tPeek + .3, tPeek + .6, T); txt(ctx, '!', h.x + 300, h.y - 60, 160, '#fff', OUTLINE, 12); ctx.restore(); }
      burst(ctx, 640, STAGE - 700, T - tOff, { kind: 'dust', n: 14, speed: 600, gravity: 100, life: .45, size: 34, colors: ['#BFF3F2', '#fff', '#20BDBB'] });
      crowdBacks(ctx, T);
    },
    ui(ctx, T) { spotlight(ctx, 540, .6); },
    sfx: [[tOff - s14, 'poof', .6], [tPeek - s14, 'boing', .6]] });

  // ===== S15 — I turned off the lights. The emergency lights turned on. =====
  const s15 = st('L14'), tOffL = ws('L14', 'off'), tEm = ws('L14', 'emergency');
  const cam15 = lt => { const T = lt + s15, k = easeOut(inv(tEm, tEm + .3, T));
    const sh = T > tEm ? Math.sin(T * 55) * 12 * (Math.exp(-(T - tEm) * 3) + .25) : 0;
    return camAt(lerp(660, 620, k) + sh, lerp(880, 730, k), 1.0 + lt * .02); };
  S.push({ id: 'S15', start: s15, trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envStage(ctx, T, cam),
    cam: cam15,
    draw(ctx, T, lt) {
      const em = T >= tEm, dark = T >= tOffL && !em;
      // light switch on the back wall, stage right
      const swOn = T < tOffL || em;
      box(ctx, 860, 790, 110, 160, 14, '#FFD447', 8); box(ctx, 880, 810, 70, 120, 10, '#E8E4F2', 6); box(ctx, 900, swOn ? 822 : 872, 30, 46, 8, swOn ? '#30CE65' : '#EE384A', 5);
      // Nubi dashes to the switch, slaps it on "off", then spins round on "emergency"
      const nx = lerp(560, 790, easeOut(inv(s15, tOffL - .1, T)));
      let p = P({ x: nx, y: STAGE, s: .8, view: 'q34' }); let face = { expr: 'determined', hoodie: nubiHoodie(T) };
      if (T < tOffL - .1) run(p, T, 2.2);
      else if (!em) { idle(p, T, 1, .5); p.armR = lerp(1.2, 2.25, easeOut(inv(tOffL - .1, tOffL, T))); p.handR = -.4; face = { expr: 'smug', hoodie: nubiHoodie(T) }; }
      else { p.flip = -1; surprise(p, T - tEm); p.armL = 2.5 + Math.sin(T * 30) * .1; p.armR = 2.3; p.lean = -.2; face = { expr: 'terrified', lookY: -.5, hoodie: nubiHoodie(T) }; }
      if (em) wallLight(ctx, 500, 700, 760, 620, 1, '255,60,70');
      else wallLight(ctx, 540, 820, 700, 520, 1);
      const k = em ? lerp(2.6, 2.9, easeOut(inv(tEm, tEm + .3, T))) : 2.6, sdx = -260;
      const sp = Object.assign({}, p, { bodyY: Math.sin(T * 2) * 5 + (em ? -20 * Math.abs(Math.sin(T * 6)) : 0) });
      shadowOf(ctx, 'nubi', sp, T, { k, dx: sdx, eyes: 'wide', alpha: em ? .78 : .62, face: { hoodie: nubiHoodie(T) } });
      C(ctx, 'nubi', p, face, T);
      crowdBacks(ctx, T);
      if (dark) { // blackout: only the shadow's glowing eyes (and Nubi's) remain
        ctx.fillStyle = 'rgba(2,2,8,.97)'; ctx.fillRect(-3000, -3000, 9000, 9000);
        const h = shHead('nubi', sp, k, sdx); shadowFace(ctx, h.x, h.y, h.S, T, { eyes: 'wide' });
        darkEyes(ctx, 'nubi', p, T);
      }
    },
    ui(ctx, T) {
      if (T < tOffL) spotlight(ctx, 540, .6);
      if (T >= tEm) emergencyLights(ctx, T, smooth(inv(tEm, tEm + .12, T)));
      else if (T >= tOffL) popText(ctx, 'CLICK!', 760, 560, T - tOffL, { size: 90, fill: '#fff', rot: .1, dur: .6 });
    },
    sfx: [[tOffL - s15, 'click', .7], [tEm - s15, 'alarm', .6]] });

  // ===== S16 — Then the spotlight hit Brayden, and his shadow said... =====
  const s16 = st('L15'), tHit = ws('L15', 'hit'), tHisSh = ws('L15', 'shadow'), tSaid = ws('L15', 'said');
  const BX = 680, BSDX = 70;                                  // Brayden in the aisle; his shadow on the wall just behind/right
  const cam16 = lt => { const T = lt + s16; const sh = T > tHit ? Math.sin(T * 60) * 6 * Math.exp(-(T - tHit) * 6) : 0; return camAt(640 + sh, 1170, 1.3 + lt * .04); };
  const braydenK = T => lerp(.45, 1.7, easeOut(inv(tHit + .1, tHisSh + .1, T)));
  S.push({ id: 'S16', start: s16, trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envAudience(ctx, T, cam, { dim: .3 }),
    cam: cam16,
    draw(ctx, T, lt) {
      // a couple of classmates at the left, in the dark
      const kp = idle(P({ x: 330, y: 1500, s: .78 }), T, 5); C(ctx, 'kidF', kp, { expr: 'surprised', lookX: .8 }, T);
      const bp = idle(P({ x: BX, y: 1500, s: .8 }), T, 3, .6);
      const surp = T > tSaid;
      if (!surp) { bp.armL = -1.0; bp.armR = -1.0; bp.handL = -.6; bp.handR = -.6; } else surprise(bp, T - tSaid);
      if (T > tHit) wallLight(ctx, BX + BSDX, 1050, 420, 520, smooth(inv(tHit, tHit + .1, T)));
      shadowOf(ctx, 'brayden', bp, T, { k: braydenK(T), dx: BSDX * inv(tHit, tHisSh, T), eyes: T > tHisSh ? 'wide' : 'closed', alpha: .66 * smooth(inv(tHit, tHit + .2, T)) });
      C(ctx, 'brayden', bp, { expr: surp ? 'surprised' : 'smug', lookX: surp ? .6 : 0, lookY: surp ? -.3 : 0 }, T);
    },
    ui(ctx, T, lt) {
      const cam = cam16(lt), [bx] = toScr(cam, BX + 30, 0);
      spotlight(ctx, lerp(80, bx, easeInOut(inv(s16 + .15, tHit, T))), .66);
    },
    sfx: [[tHit - s16, 'impact', .45], [tHisSh - s16, 'whoosh', .5]] });

  // ===== S17 — "I still sleep with a teddy bear named Mister Snuggles." (Brayden's shadow) =====
  const s17 = st('L16'), tStill = ws('L16', 'still'), tTeddy = ws('L16', 'teddy'), tNamed = ws('L16', 'named'), tMister = ws('L16', 'mister'), tSnug = ws('L16', 'snuggles');
  const bShadow = T => { const bp = P({ x: BX, y: 1500, s: .8 }); bp.bodyY = Math.sin(T * 2.2) * 6; bp.head = Math.sin(T * 2.6) * .08; bp.armL = -1.1; bp.armR = -1.1; bp.handL = -.5; bp.handR = -.5; return bp; };
  const H17 = shHead('brayden', bShadow(0), 1.7, BSDX);
  const cam17 = lt => { const T = lt + s17, k = easeInOut(inv(tNamed - .1, tNamed + .35, T));
    return camAt(lerp(H17.x + 40, 720, k), lerp(H17.y + 80, 1060, k), lerp(1.8 + lt * .05, 1.4, k)); };
  S.push({ id: 'S17', start: s17, trans: 'zoom', capY: 1660,
    bg: (ctx, T, cam) => envAudience(ctx, T, cam, { dim: .3 }),
    cam: cam17,
    draw(ctx, T, lt) {
      wallLight(ctx, BX + BSDX, 1050, 420, 520, 1);
      // the shadow sways dreamily, hugging itself, and confesses (lip-sync L16)
      const sp = bShadow(T);
      shadowOf(ctx, 'brayden', sp, T, { k: 1.7, dx: BSDX, eyes: 'happy', lines: ['L16'], alpha: .7 });
      const h = shHead('brayden', sp, 1.7, BSDX);
      // teddy pops beside the shadow's head on "teddy"
      if (T > tTeddy) { const k = pop(T - tTeddy, .3); ctx.save(); ctx.translate(h.x + 215, h.y + 30); ctx.rotate(Math.sin(T * 4) * .12); ctx.scale(1.25 * k, 1.25 * k); holdTeddy(ctx); ctx.restore();
        burst(ctx, h.x + 215, h.y - 40, T - tTeddy, { kind: 'heart', n: 6, speed: 300, gravity: -100, life: 1.0, size: 22 }); }
      // Brayden in front: hands clamp over his mouth, horrified (arms reach to the face; hands drawn over the mouth)
      const bp = idle(P({ x: BX, y: 1500, s: .8 }), T, 3, .4); const c = clamp(spring(T - tStill, 2.5, 6), 0, 1.15);
      bp.armL = lerp(1.2, -2.1, c); bp.armR = lerp(1.2, -2.1, c); bp.x += Math.sin(T * 50) * 2;
      C(ctx, 'brayden', bp, { expr: 'terrified', red: T > tMister ? smooth(inv(tMister, tSnug + .3, T)) : 0 }, T);
      if (T > tStill) { const S2 = bp.s * CAST.brayden.tall, mx = bp.x, my = bp.y + bp.bodyY * bp.s + (-353 + bp.headY) * S2, k = smooth(inv(tStill, tStill + .15, T));
        ctx.save(); ctx.globalAlpha = k; box(ctx, mx - 62 * S2, my - 30 * S2, 70 * S2, 60 * S2, 22 * S2, CAST.brayden.skin, 8); box(ctx, mx - 6 * S2, my - 26 * S2, 70 * S2, 60 * S2, 22 * S2, CAST.brayden.skin, 8); ctx.restore(); }
    },
    ui(ctx, T, lt) {
      const cam = cam17(lt), [bx] = toScr(cam, BX + 30, 0);
      spotlight(ctx, bx, .66);
      const [x, y] = toScr(cam, H17.x - 40, H17.y - 290);
      speechBubble(ctx, clamp(x, 400, 680), Math.max(y, 380), 'MISTER SNUGGLES!', T - tMister, { size: 80, dark: true, tail: 30 });
    },
    sfx: [[tTeddy - s17, 'pop', .6], [tSnug - s17, 'record', .6]] });

  return S;
});
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/examples/shadow-thoughts/shots/part3.js
~~~~~~~~ js
// shots/part3.js — S18–S25 (L17–L24): the gasp, the realization, "Lily, I like you", "...finally", hand-holding shadows, loop.
'use strict';
shots(() => {
  const S = [];
  const SY = 1190;                                   // stage floor
  const sx = (wx, c) => (wx - c.x) * c.z + 540;      // world x -> screen x for a camera
  // warm pool of light on the curtain behind a performer (world space, drawn before the shadow)
  const lightPool = (ctx, x, y, r, a = .5, col = '255,236,190') => { ctx.save(); const g = ctx.createRadialGradient(x, y, 30, x, y, r);
    g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(.7, `rgba(${col},${a * .55})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); };
  // Nubi's giant shadow on the curtain: same rig, feet on the stage floor
  const giant = (ctx, pose, T, o = {}) => shadowOf(ctx, 'nubi', Object.assign({}, pose, { y: SY }), T, Object.assign({ k: 2.5, alpha: .72, face: { hoodie: false } }, o));
  const steam = (ctx, x, y, dt, s = 1) => { if (dt < 0) return; for (let i = 0; i < 8; i++) { const side = i % 2 ? 1 : -1, ph = (dt * 1.4 + i / 8) % 1;
    if (dt < ph / 1.4) continue; ctx.save(); ctx.globalAlpha = (1 - ph) * .9; circle(ctx, x + side * (120 + ph * 70) * s, y - ph * 220 * s, (18 + ph * 34) * s, '#fff', 0); ctx.restore(); } };
  const micStand = (ctx, x, withMic) => { box(ctx, x - 60, SY - 14, 120, 20, 10, '#333', 6); box(ctx, x - 7, 870, 14, SY - 870, 5, '#555', 5);
    if (withMic) { ctx.save(); ctx.translate(x, 860); ctx.rotate(-.5); holdMic(ctx); ctx.restore(); } };

  // ===== S18 — Everyone gasped. (audience wide) =====
  const gaspT = ws('L17', 'gasped'), brayT = ws('L17', 'brayden'), turnT = ws('L17', 'turned'), redT = ws('L17', 'red');
  const cam18 = lt => camAt(520 + lt * 14, 1230, 1.18 + lt * .07);
  S.push({ id: 'S18', start: st('L17'), trans: 'cut', capY: 1650,
    bg: (ctx, T, cam) => envAudience(ctx, T, cam),
    cam: cam18,
    draw(ctx, T, lt) {
      const g = T - gaspT;
      [['kidF', 40], ['kidB', 270], ['kidD', 485], ['kidE', 700]].forEach(([n, x], i) => { const d = g - .04 * i; const p = idle(P({ x, y: 1390, s: .6 }), T, i + 2);
        if (d > 0) surprise(p, d); C(ctx, n, p, { expr: d > 0 ? 'surprised' : 'neutral', mouth: d > 0 ? 'round' : null, lookX: .8 }, T); });
      [['kidA', 160], ['lily', 375], ['kidC', 590]].forEach(([n, x], i) => { const d = g - .06 * i; const p = idle(P({ x, y: 1500, s: .74 }), T, i + 7);
        if (d > 0) surprise(p, d); C(ctx, n, p, { expr: d > 0 ? 'surprised' : 'neutral', mouth: d > 0 ? 'round' : null, lookX: .8, holding: n === 'lily' ? { R: holdBook } : undefined }, T); });
      const bp = idle(P({ x: 860, y: 1540, s: .8, view: 'q34', flip: -1 }), T, 3, .5); bp.armL = 2.5; bp.armR = 2.3; bp.handL = .9; bp.handR = .9; bp.head = .06;
      C(ctx, 'brayden', bp, { expr: 'nervous', red: .35 * smooth(inv(gaspT, brayT, T)), lookX: -.5 }, T);
    },
    ui(ctx, T, lt) { spotlight(ctx, sx(860, cam18(lt)), .32); },
    sfx: [[gaspT - st('L17'), 'scratch', .5]] });

  // ===== S18b — Brayden turned bright red. (close-up; split from S18 so the red has time to read) =====
  S.push({ id: 'S18b', start: brayT - .08, trans: 'zoom', capY: 1690,
    bg: (ctx, T, cam) => { envAudience(ctx, T, cam); const k = smooth(inv(redT - .05, redT + .15, T));
      if (k > 0) { ctx.save(); ctx.globalAlpha = k * .85; ctx.translate(cam.x - 540, cam.y - 900); envBurst(ctx, T, '#FF8A8A', '#EE384A', .4); ctx.restore(); } },
    cam: lt => { const T = lt + brayT - .08; const sh = T > redT ? Math.sin(T * 60) * 9 * Math.exp(-(T - redT) * 4) : 0; return camAt(540 + sh, 1130, 2.15 + lt * .08); },
    draw(ctx, T, lt) {
      const bp = idle(P({ x: 540, y: 1500, s: .8 }), T, 3, .5);
      const r = smooth(inv(turnT, redT + .1, T)); bp.armL = 2.75; bp.armR = 2.75; bp.handL = 1.4; bp.handR = 1.4;
      if (T > redT) { bp.squash = 1 + .05 * Math.sin((T - redT) * 40) * Math.exp(-(T - redT) * 5); bp.headY = -6 * spring(T - redT); }
      C(ctx, 'brayden', bp, { expr: T > redT ? 'crying' : 'nervous', red: r, sweat: true }, T);
      steam(ctx, 540, 1060, T - redT, 1);
    },
    ui(ctx, T) { spotlight(ctx, 540, .28); vignette(ctx, .55 * smooth(inv(turnT, redT, T)), '238,56,74'); },
    sfx: [[redT - brayT + .08, 'poof', .6]] });

  // ===== S19 — That's when I realized something. Shadows only say what you hide. =====
  const realT = ws('L18', 'realized'), hideT = ws('L18', 'hide'), shadT = ws('L18', 'shadows');
  const cam19 = lt => camAt(540, 980 - lt * 12, .85 + lt * .045);
  S.push({ id: 'S19', start: st('L18'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envStage(ctx, T, cam, { dim: .7 }),
    cam: cam19,
    draw(ctx, T, lt) {
      lightPool(ctx, 540, 820, 760, .32);
      const turned = T > realT + .05;
      const np = idle(P({ x: 560, y: SY, s: .8, view: turned ? 'q34' : 'back', flip: -1 }), T, 1, .4);
      if (!turned) np.head = -.12; else np.headY = -8 * spring(T - realT);
      // the shadow looks gently down at him; happy eyes on "hide"
      const sp = idle(P({ x: 560, y: SY, s: .8 }), T, 4, .5); sp.head = .14 + Math.sin(T * 1.2) * .03; sp.armL = .25; sp.armR = .25;
      giant(ctx, sp, T, { eyes: T > hideT ? 'happy' : 'normal', mouth: T > hideT ? 'smile' : 'closed' });
      C(ctx, 'nubi', np, { expr: turned ? (T > hideT ? 'happy' : 'surprised') : 'sad', hoodie: false, lookY: -1, lookX: turned ? -.6 : 0 }, T);
      burst(ctx, 680, 790, T - realT, { kind: 'sparkle', n: 12, speed: 650, gravity: 0, life: .8, size: 28, colors: ['#FFD447', '#fff'] });
      burst(ctx, 560, 380, T - hideT, { kind: 'sparkle', n: 10, speed: 500, gravity: 0, life: .9, size: 24, colors: ['#B9A6FF', '#fff'] });
    },
    ui(ctx, T, lt) { spotlight(ctx, sx(560, cam19(lt)), .42); },
    sfx: [[realT - st('L18'), 'magic', .55], [hideT - st('L18'), 'sparkle', .35]] });

  // ===== S20 — So I stopped hiding. (turns to the audience, steps forward; shadow copies him) =====
  const stopT = ws('L19', 'stopped'), hidingT = ws('L19', 'hiding');
  const cam20 = lt => camAt(540, 830 - lt * 10, 1.14 + lt * .05);
  S.push({ id: 'S20', start: st('L19'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envStage(ctx, T, cam, { dim: .6 }),
    cam: cam20,
    draw(ctx, T, lt) {
      lightPool(ctx, 540, 760, 700, .3);
      const u = inv(stopT - .05, hidingT + .15, T), front = T > stopT - .1;
      const np = P({ x: 540, y: SY + 18 * easeOut(u), s: .8 + .03 * easeOut(u), view: front ? 'front' : 'q34', flip: -1 });
      if (u > 0 && u < 1) walk(np, T, 1.8, .7); else idle(np, T, 1, .5);
      if (T > hidingT) { const k = spring(T - hidingT); np.armL = .28 * k; np.armR = .28 * k; np.headY = -6 * k; }
      giant(ctx, np, T, { eyes: T > hidingT ? 'normal' : 'happy' });
      C(ctx, 'nubi', np, { expr: front ? 'determined' : 'happy', hoodie: false, lookY: front ? 0 : -1 }, T);
      burst(ctx, 540, SY, T - hidingT, { kind: 'dust', n: 12, speed: 380, gravity: 0, life: .45, size: 18, angle: Math.PI, spread: .6, seed: 3 }); burst(ctx, 540, SY, T - hidingT, { kind: 'dust', n: 12, speed: 380, gravity: 0, life: .45, size: 18, angle: 0, spread: .6, colors: ['#fff', '#FFE6BD'] });
    },
    ui(ctx, T, lt) { spotlight(ctx, sx(540, cam20(lt)), .4); },
    sfx: [[stopT - st('L19'), 'step', .5], [hidingT - st('L19'), 'swell', .55]] });

  // ===== S21 — I grabbed the mic and said it myself. Lily, I like you. =====
  const grabT = ws('L20', 'grabbed'), micT = ws('L20', 'mic'), lilyT = ws('L20', 'lily'), likeT = ws('L20', 'like'), youT = ws('L20', 'you');
  S.push({ id: 'S21', start: st('L20'), trans: 'zoom', capY: 1690,
    bg: (ctx, T, cam) => envStage(ctx, T, cam, { dim: .6 }),
    cam: lt => { const T = lt + st('L20'); const k = easeInOut(inv(st('L20'), lilyT, T)); return camAt(lerp(570, 545, k), lerp(910, 850, k), lerp(1.75, 2.1, k) + lt * .03); },
    draw(ctx, T, lt) {
      lightPool(ctx, 540, 760, 700, .3);
      const has = T > micT;
      const np = idle(P({ x: 520, y: SY, s: .8, view: 'q34' }), T, 1, .5);
      const reach = smooth(inv(grabT, micT, T));
      if (!has) { np.armR = .1 + 1.5 * reach; np.handR = -.3 * reach; }
      else { const k = smooth(inv(micT, micT + .25, T)); np.armR = lerp(1.6, 1.25, k); np.handR = lerp(-.3, -1.0, k); }
      giant(ctx, np, T, { eyes: T > lilyT ? 'happy' : 'normal' });
      micStand(ctx, 690, !has);
      const fc = T > lilyT ? 'shy' : 'determined';
      C(ctx, 'nubi', np, { expr: fc, hoodie: false, blush: T > lilyT, mouth: lipShape(T, ['L20']), holding: has ? { R: holdMic } : undefined }, T);
      burst(ctx, 380, 690, T - youT, { kind: 'heart', n: 12, speed: 520, gravity: -220, life: 1.1, size: 26, angle: -Math.PI / 2, spread: 2.2 });
      burst(ctx, 700, 690, T - youT - .05, { kind: 'heart', n: 10, speed: 480, gravity: -220, life: 1.1, size: 24, angle: -Math.PI / 2, spread: 2.2, seed: 5 });
    },
    ui(ctx, T) { spotlight(ctx, 540, .36, T > lilyT ? '255,190,225' : '255,240,200'); },
    sfx: [[micT - st('L20'), 'click', .4], [lilyT - st('L20'), 'swell', .6], [youT - st('L20'), 'sparkle', .45]] });

  // ===== S22 — My shadow just shrugged. Yeah, what he said. =====
  const shrugT = ws('L21', 'shrugged'), yeahT = ws('L21', 'yeah');
  const cam22 = lt => camAt(540, 905 - lt * 8, 1.0 + lt * .03);
  S.push({ id: 'S22', start: st('L21'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envStage(ctx, T, cam, { dim: .6 }),
    cam: cam22,
    draw(ctx, T, lt) {
      lightPool(ctx, 520, 760, 780, .34);
      const np = idle(P({ x: 600, y: SY, s: .8, view: 'q34', flip: -1 }), T, 1, .5); np.armR = 1.3; np.handR = -1.0;
      // the shadow ignores Nubi's pose: a big shrug, hands out
      const sp = idle(P({ x: 600, y: SY, s: .8 }), T, 4, .4); const k = spring(T - shrugT) * (T > shrugT ? 1 : 0);
      sp.armL = .25 + .75 * k; sp.armR = .25 + .75 * k; sp.handL = -1.0 * k; sp.handR = -1.0 * k; sp.head = .16 * k; sp.headY = 10 * k; sp.bodyY -= 8 * k;
      if (T > yeahT) talk(sp, T, 4, .3);
      giant(ctx, sp, T, { dx: -80, eyes: T > shrugT ? 'closed' : 'normal', lines: T > yeahT - .03 ? ['L21'] : null, mouth: T > yeahT - .03 ? null : (T > shrugT ? 'smile' : 'closed') });
      C(ctx, 'nubi', np, { expr: T > shrugT ? 'shy' : 'happy', hoodie: false, blush: T > shrugT, lookY: T > shrugT ? -.8 : 0, lookX: -.4, holding: { R: holdMic } }, T);
    },
    ui(ctx, T, lt) { spotlight(ctx, sx(560, cam22(lt)), .38);
      ctx.save(); ctx.shadowColor = '#B9A6FF'; ctx.shadowBlur = 40; speechBubble(ctx, 540, 600, 'YEAH, WHAT HE SAID.', T - yeahT, { size: 62, dark: true, tail: -40, rot: -.04 }); ctx.restore(); },
    sfx: [[shrugT - st('L21'), 'boing', .5], [yeahT - st('L21'), 'pop', .4]] });

  // ===== S23 — Then Lily's shadow whispered... finally. =====
  const lsT = ws('L22', "lily's"), whispT = ws('L22', 'whispered'), finT = ws('L22', 'finally');
  S.push({ id: 'S23', start: st('L22'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => envAudience(ctx, T, cam),
    cam: lt => camAt(560 + lt * 10, 1150, 1.45 + lt * .05),
    draw(ctx, T, lt) {
      // pink glow on the wall behind her
      lightPool(ctx, 600, 1150, 650, .45, '255,140,200');
      const u = inv(lsT - .1, lsT + .35, T);
      const lp = idle(P({ x: 380, y: 1500, s: .8 }), T, 2, .6); lp.squash = lerp(.84, 1, easeOut(u)) + (u > 0 && u < 1 ? .04 * Math.sin(u * Math.PI) : 0);
      lp.armL = .05; lp.armR = .05; lp.head = .08;
      // her shadow (on the wall, behind everyone) leans in to whisper
      const lean = smooth(inv(whispT - .1, finT, T));
      const sp = Object.assign({}, lp, { view: 'q34', head: .15 * lean, armL: .3, armR: .3 + 1.9 * lean, handR: -1.2 * lean });
      shadowOf(ctx, 'lily', sp, T, { k: 1.4, dx: 240, alpha: .66, skew: -.22 * lean, eyes: T > finT + .2 ? 'happy' : 'shy', lines: ['L22'] });
      const kd = idle(P({ x: 170, y: 1390, s: .6 }), T, 5); C(ctx, 'kidD', kd, { expr: T > finT ? 'surprised' : 'happy', lookX: .8 }, T);
      const kf = idle(P({ x: 960, y: 1390, s: .6 }), T, 6); C(ctx, 'kidF', kf, { expr: T > finT ? 'surprised' : 'happy', lookX: -.8 }, T);
      C(ctx, 'lily', lp, { expr: 'shy', blush: true, lookY: .4, holding: { R: holdBook } }, T);
      burst(ctx, 820, 800, T - finT, { kind: 'heart', n: 16, speed: 600, gravity: -180, life: 1.2, size: 26 });
    },
    ui(ctx, T) { ctx.save(); ctx.shadowColor = '#FFB3D1'; ctx.shadowBlur = 30; speechBubble(ctx, 790, 640, '...finally ♥', T - finT, { size: 50, dark: true, tail: -90, rot: .05 }); ctx.restore(); },
    sfx: [[lsT - st('L22'), 'chime', .45], [finT - st('L22'), 'sparkle', .55]] });

  // ===== S24 — Now we walk in the sun together. Our shadows hold hands. =====
  const sunT = ws('L23', 'sun'), togT = ws('L23', 'together'), holdT = ws('L23', 'hold'), handsT = ws('L23', 'hands');
  const WY = 1660, SK = 1.7, SDX = 30;                                   // they walk on the grass; their shadows climb the fence (base y 1500)
  const x24 = T => 290 + (T - st('L23')) * 110;
  const cam24 = lt => { const T = lt + st('L23'); return camAt(x24(T) + 210, 1130, 1.0 + lt * .03); };
  S.push({ id: 'S24', start: st('L23'), trans: 'whip', capY: 1660,
    bg: (ctx, T, cam) => envBackyard(ctx, T, cam),
    cam: cam24,
    draw(ctx, T, lt) {
      const c = cam24(lt), nx = x24(T), lx = nx + 380;
      // sun
      const sxw = c.x - 330, syw = c.y - 800;
      ctx.save(); ctx.translate(sxw, syw); ctx.rotate(T * .4); for (let i = 0; i < 10; i++) { ctx.rotate(TAU / 10); box(ctx, 120, -12, 70, 24, 12, '#FFD447', 0); } ctx.restore();
      circle(ctx, sxw, syw, 100, '#FFD447', 9);
      burst(ctx, sxw, syw, T - sunT, { kind: 'sparkle', n: 10, speed: 500, gravity: 0, life: .7, size: 26 });
      const np = walk(P({ x: nx, y: WY, s: .8, view: 'q34' }), T, 1.1);
      const lp = walk(P({ x: lx, y: WY, s: .78, view: 'q34' }), T + .08, 1.1);
      // shadows on the fence: arms reach until the hands meet on "hold"
      const r = smooth(inv(holdT - .3, holdT + .05, T));
      // front-view silhouettes: Nubi's shadow reaches out with armL (screen right), Lily's with armR (screen left)
      const ns = walk(P({ x: nx, y: 1500, s: .8 }), T, 1.1); ns.armL = lerp(ns.armL, .6, r); ns.handL = lerp(0, .5, r);
      const ls = walk(P({ x: lx, y: 1500, s: .78 }), T + .08, 1.1); ls.armR = lerp(ls.armR, .6, r); ls.handR = lerp(0, .5, r);
      shadowOf(ctx, 'nubi', ns, T, { k: SK, dx: SDX, alpha: .5, eyes: T > holdT ? 'happy' : 'normal', face: { hoodie: false } });
      shadowOf(ctx, 'lily', ls, T, { k: SK, dx: SDX, alpha: .5, eyes: T > holdT ? 'happy' : 'shy', seed: 3 });
      const hx = (nx + lx) / 2 + SDX, hy = 1300;
      if (T > handsT - .1) { ctx.save(); ctx.translate(hx, hy - 260 - (T - handsT) * 40); const s = pop(T - handsT + .1); ctx.scale(s, s);
        heartPath(ctx, 0, 0, 40); fillStroke(ctx, '#FF5B9B', 7); ctx.restore(); }
      C(ctx, 'nubi', np, { expr: 'shy', hoodie: false, blush: true, lookX: .6, lookY: .2 }, T);
      C(ctx, 'lily', lp, { expr: 'shy', blush: true, lookX: -.6, lookY: .3 }, T);
      burst(ctx, hx, hy - 280, T - handsT, { kind: 'heart', n: 12, speed: 450, gravity: -200, life: 1.1, size: 22 });
    },
    sfx: [[togT - st('L23'), 'swell', .55], [handsT - st('L23'), 'chime', .5]] });

  // ===== S25 — Subscribe if your shadow knows your secret too. (push into the shadow's face -> loops to S01) =====
  const knowsT = ws('L24', 'knows'), secT = ws('L24', 'secret');
  const nx25 = T => 300 + (T - st('L24')) * 55;
  const FY25 = 1500 - 429 * .8 * 1.6;                                      // shadow face height on the lockers
  const cam25 = lt => { const T = lt + st('L24'); const k = easeInOut(inv(st('L24') + .3, END, T)); const fx = nx25(T) + 110;
    return camAt(lerp(560, fx, k), lerp(1060, FY25 + 10, k), lerp(1.0, 1.7, k)); };
  S.push({ id: 'S25', start: st('L24'), trans: 'cut', capY: 1720,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: cam25,
    draw(ctx, T, lt) {
      const np = walk(P({ x: nx25(T), y: 1500, s: .8, view: 'q34' }), T, .9, .8); np.lean -= .06;
      shadowOf(ctx, 'nubi', np, T, { k: 1.6, dx: 110, alpha: .45, eyes: 'happy', mouth: 'smile', face: { hoodie: false } });
      C(ctx, 'nubi', np, { expr: 'happy', hoodie: false }, T);
      burst(ctx, nx25(T) + 250, 640, T - knowsT, { kind: 'heart', n: 8, speed: 380, gravity: -160, life: 1, size: 22 });
    },
    ui(ctx, T, lt) { drawSubscribe(ctx, lt - .05, 1.4);
      const c = cam25(lt), bx = sx(nx25(T) + 190, c), by = (FY25 - 250 - c.y) * c.z + 960;
      ctx.save(); ctx.shadowColor = '#FFB3D1'; ctx.shadowBlur = 30; speechBubble(ctx, bx, by, '♥ LILY', T - knowsT, { size: 66, dark: true, tail: -70 }); ctx.restore(); },
    sfx: [[.6, 'click', .5], [knowsT - st('L24'), 'pop', .45], [secT - st('L24'), 'whoosh', .4]] });

  return S;
});
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/examples/shadow-thoughts/story.js
~~~~~~~~ js
// story.js — "In This World, Your Shadow Says What You're Really Thinking"
// Shared systems for all shot parts: talking shadows, speech bubbles, the SECRET HUD, props, the stage set, music, captions.
'use strict';

// ---------------- Talking shadows ----------------
// A cast shadow is the character's silhouette (same rig, so it matches every pose), scaled by k from the feet and
// offset onto a wall/curtain. It has glowing white eyes and a white mouth that lip-syncs to `lines`.
// o: { k=1.5, dx=0, dy=0, alpha=.62, lines=[], eyes:'normal'|'happy'|'wide'|'shy'|'closed', mouth (override shape name), skew=0 }
function shadowOf(ctx, name, pose, T, o = {}) {
  const k = o.k ?? 1.5, sp = Object.assign({}, pose, { x: pose.x + (o.dx || 0), y: pose.y + (o.dy || 0), s: pose.s * k, alpha: 1 });
  drawSilhouette(ctx, c2 => {
    if (o.skew) { c2.translate(sp.x, sp.y); c2.transform(1, 0, o.skew, 1, 0, 0); c2.translate(-sp.x, -sp.y); }
    drawCharacter(c2, name, sp, Object.assign({ expr: 'neutral' }, o.face || {}), T);
  }, Math.min(1, (o.alpha ?? .62) * 1.45) * (pose.alpha ?? 1) * ctx.globalAlpha);   // flat silhouette: ×1.45 matches the old stacked-alpha darkness
  // glowing face on the shadow's head
  const c = CAST[name], S = sp.s * (c.tall || 1);
  const hx = sp.x + (o.skew ? -o.skew * (RIG.legH + RIG.torsoH + RIG.headH * .45) * S : 0) + (sp.view === 'q34' ? RIG.headW * .1 * S * sp.flip : 0);
  const hy = sp.y + (sp.bodyY - RIG.legH - RIG.torsoH - RIG.headH * .45) * S;
  shadowFace(ctx, hx, hy, S, T, o);
}
function shadowFace(ctx, x, y, S, T, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(S, S);
  ctx.shadowColor = '#B9A6FF'; ctx.shadowBlur = 18;
  const eyes = o.eyes || 'normal', bl = blinkAmt(77 + (o.seed || 0), T);
  for (const ex of [-48, 48]) {
    if (eyes === 'happy' || eyes === 'closed') { ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(ex, eyes === 'happy' ? 6 : -4, 18, eyes === 'happy' ? Math.PI * 1.1 : .15, eyes === 'happy' ? Math.PI * 1.9 : Math.PI - .15); ctx.stroke(); }
    else { const ry = (eyes === 'wide' ? 30 : eyes === 'shy' ? 16 : 24) * bl; ellipse(ctx, ex + (eyes === 'shy' ? -6 : 0), -14, eyes === 'wide' ? 22 : 18, Math.max(2, ry), '#fff'); }
  }
  const shape = o.mouth || (o.lines ? lipShape(T, o.lines) : null) || (eyes === 'happy' ? 'smile' : 'closed');
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round'; ctx.lineWidth = 9;
  const my = 48;
  if (shape === 'closed' || shape === 'flat') { ctx.beginPath(); ctx.moveTo(-20, my); ctx.lineTo(20, my); ctx.stroke(); }
  else if (shape === 'smile' || shape === 'smallSmile') { ctx.beginPath(); ctx.moveTo(-28, my - 6); ctx.quadraticCurveTo(0, my + 18, 28, my - 6); ctx.stroke(); }
  else { const big = { wideOpen: [26, 22], round: [16, 20], teethOpen: [24, 14], smallOpen: [14, 10], teeth: [26, 9], scream: [26, 30] }[shape] || [16, 12]; ellipse(ctx, 0, my + 4, big[0], big[1], '#fff'); }
  ctx.restore();
}
// Dog shadow (the dog rig drawn as a silhouette)
function dogShadow(ctx, x, y, s, T, o = {}) {
  drawSilhouette(ctx, c2 => drawDog(c2, x, y, s, T, o), Math.min(1, (o.alpha ?? .62) * 1.45) * ctx.globalAlpha);
  shadowFace(ctx, x + 125 * s, y - 225 * s, s * .55, T, { lines: o.lines, eyes: 'wide', seed: 9 });
}

// ---------------- Speech bubble (what a shadow is saying, readable without sound) ----------------
function speechBubble(ctx, x, y, text, dt, o = {}) {
  if (dt < 0 || (o.dur && dt > o.dur)) return;
  const k = pop(dt, .25) * (o.dur ? 1 - smooth(inv(o.dur - .15, o.dur, dt)) : 1);
  const size = o.size || 54; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(o.rot || 0);
  ctx.font = `${size}px "Lilita One"`; const w = ctx.measureText(text).width + 60, h = size * 1.6;
  const dark = o.dark; // dark bubble = a shadow talking
  ctx.beginPath(); ctx.moveTo(-20 + (o.tail || 0) * .3, h / 2 - 4); ctx.lineTo((o.tail || -30), h / 2 + 40); ctx.lineTo(24, h / 2 - 4); fillStroke(ctx, dark ? '#24225B' : '#fff', 8);
  box(ctx, -w / 2, -h / 2, w, h, h / 2, dark ? '#24225B' : '#fff', 8);
  txt(ctx, text, 0, 4, size, dark ? '#fff' : '#24225B', OUTLINE, 0);
  ctx.restore();
}

// ---------------- Props (use in face.holding or draw in world space) ----------------
function holdUmbrella(ctx) { ctx.save(); ctx.translate(0, 20); box(ctx, -5, -330, 10, 340, 4, '#333', 4);
  ctx.beginPath(); ctx.moveTo(-230, -300); ctx.quadraticCurveTo(0, -470, 230, -300); for (let i = 4; i >= 0; i--) ctx.quadraticCurveTo(-230 + (i + .5) * 92, -270, -230 + i * 92, -300); ctx.closePath(); fillStroke(ctx, '#24225B', 8);
  ctx.restore(); }
function holdTeddy(ctx) { ctx.save(); ctx.translate(0, 70); circle(ctx, -34, -58, 20, '#B5733F', 6); circle(ctx, 34, -58, 20, '#B5733F', 6); box(ctx, -50, -60, 100, 90, 34, '#C98B4B', 7);
  box(ctx, -40, 20, 80, 80, 28, '#C98B4B', 7); circle(ctx, -16, -24, 6, OUTLINE); circle(ctx, 16, -24, 6, OUTLINE); ellipse(ctx, 0, -2, 14, 10, '#7A4B2A'); ctx.restore(); }
function holdDrawing(ctx) { ctx.save(); ctx.translate(0, 40); ctx.rotate(-.06); box(ctx, -110, -150, 220, 170, 8, '#FFF8E0', 7);
  ellipse(ctx, 0, -66, 66, 44, '#C98B4B', 6); circle(ctx, -24, -76, 6, OUTLINE); circle(ctx, 20, -78, 6, OUTLINE); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, -60, 18, .3, Math.PI - .3); ctx.stroke(); ctx.restore(); }

// ---------------- Talent-show stage (gym set with its own banner; stage floor at y 1190) ----------------
function envStage(ctx, T, cam, o = {}) { envGym(ctx, T, cam, Object.assign({ banner: 'TALENT SHOW', bannerC: '#7B4BFF', noLights: true, dim: .35 }, o)); }
// Reverse angle: the audience side of the gym (light back wall, mats, EXIT sign) — for crowd and Brayden shots.
function envAudience(ctx, T, cam, o = {}) {
  envGym(ctx, T, cam, { noLights: true, banner: 'TALENT SHOW', bannerC: '#7B4BFF' });   // reuse the gym floor
  const { dx } = par(cam, .92);
  ctx.save(); ctx.translate(dx, 0);
  const g = ctx.createLinearGradient(0, 200, 0, FLOOR); g.addColorStop(0, '#4A3E86'); g.addColorStop(1, '#7464B6');
  ctx.fillStyle = g; ctx.fillRect(-2500, -2500, 6500, FLOOR + 2500 - 2);
  ctx.strokeStyle = 'rgba(20,10,50,.2)'; ctx.lineWidth = 4; ctx.beginPath();
  for (let r = 0; r < 22; r++) { const y = 150 + r * 64; ctx.moveTo(-2500, y); ctx.lineTo(4000, y); if (y < 1240) for (let i = -18; i < 30; i++) { const x = i * 140 + (r % 2) * 70; ctx.moveTo(x, y); ctx.lineTo(x, y + 64); } }
  ctx.stroke();
  box(ctx, -200, 300, 1500, 70, 10, '#2B1E5C', 8);                                  // painted stripe
  txt(ctx, 'GO TIGERS', 540, 336, 54, '#FFD447', OUTLINE, 8);
  box(ctx, 60, 520, 170, 78, 10, '#1E7A3A', 7); txt(ctx, 'EXIT', 145, 561, 48, '#9BFFB4');
  for (let i = -8; i < 16; i++) box(ctx, i * 200, 1236, 196, 266, 14, '#2E62C9', 7);   // wall mats
  ctx.restore();
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - 3, 9000, 8);
  ctx.fillStyle = `rgba(10,8,30,${o.dim ?? .3})`; ctx.fillRect(-3000, -3000, 9000, 9000);
}

// Emergency lights: red rotating beams + tint (screen space, use in ui)
function emergencyLights(ctx, T, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = 'rgba(120,0,20,.45)'; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';
  for (const [x, ph] of [[150, 0], [930, 1.5]]) { ctx.save(); ctx.translate(x, 130); ctx.rotate(T * 5 + ph);
    const g = ctx.createLinearGradient(0, 0, 1400, 0); g.addColorStop(0, 'rgba(255,40,60,.7)'); g.addColorStop(1, 'rgba(255,40,60,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -160); ctx.lineTo(1400, 160); ctx.fill(); ctx.restore();
    circle(ctx, x, 130, 34, '#FF3B4E', 6); }
  ctx.restore();
}

// ---------------- SECRET status HUD (top centre) ----------------
STORY.hudDraw = (ctx, T) => {
  if (!LINE.L7) return;
  const t0 = ws('L7', 'secret'), tEnd = LINE.L23.start + .3;
  const a = smooth(inv(t0 - .1, t0 + .2, T)) * (1 - smooth(inv(tEnd, tEnd + .4, T)));
  if (a <= 0) return;
  const danger = T >= ws('L10', 'spotlight'), out = T >= ws('L20', 'lily');
  const label = out ? 'SECRET: OUT ♥' : danger ? 'SECRET: DANGER!' : 'SECRET: SAFE';
  const bg = out ? '#FF5B9B' : danger ? '#EE384A' : '#30A045';
  const pulse = danger && !out ? 1 + Math.max(0, Math.sin(T * 9)) * .06 : 1 + Math.max(0, .25 - (T - ws('L20', 'lily'))) * (out ? 1 : 0);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(540, 150 - (1 - a) * 120); ctx.scale(pulse, pulse);
  ctx.font = '62px "Lilita One"'; const w = ctx.measureText(label).width + 150;
  box(ctx, -w / 2 + 6, -56, w, 124, 62, 'rgba(0,0,0,.3)', 0); box(ctx, -w / 2, -64, w, 124, 62, bg, 9);
  // lock / heart icon
  if (out) { heartPath(ctx, -w / 2 + 62, -2, 30); fillStroke(ctx, '#fff', 5); }
  else { box(ctx, -w / 2 + 40, -18, 44, 38, 8, '#FFC83D', 5); ctx.lineWidth = 7; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.arc(-w / 2 + 62, -18, 14, Math.PI, 0); ctx.stroke(); }
  txt(ctx, label, 36, -2, 62, '#fff', OUTLINE, 9);
  ctx.restore();
};
// HUD covers screen y 80–220: keep heads below ~300 while it is visible (from L7 "secret" to L23).

// ---------------- Continuity helpers ----------------
const nubiHoodie = T => T < ws('L13', 'hoodie') + .1;   // Nubi takes the hoodie off in L13 and never puts it back on

// ---------------- Music + captions ----------------
STORY.music = () => [[0, 'main'], [ws('L11', 'ten'), 'tense'], [LINE.L18.start - .1, 'calm'], [ws('L20', 'like'), 'love']];
STORY.capColors = {
  yellow: ['shadow', 'shadows', 'spotlight', 'stage', 'mic', 'hoodie', 'lights', 'squirrel', 'potato', 'snuggles', 'teddy'],
  red: ['lie', 'louder', 'tall', 'emergency', 'gasped', 'red', 'hide', 'hiding', 'vampire'],
  pink: ['lily', 'like', 'finally', 'together', 'hands', 'secret'],
  green: ['sun', 'myself'],
};
STORY.capOverride = { 'L22:shadow': 'pink' };
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/evals/new-episode-from-premise/case.yaml
~~~~~~~~ yaml
schema_version: "1.1"
name: new-episode-from-premise
expected_outcome: |
  A finished, fully animated 1080x1920 60 fps MP4 Short (45-56 s) built with the shared engine and recurring cast,
  in the channel's "In this world" first-person format with a mid-video subscribe line, a twist, a small Lily love payoff
  at the end and a closing "Subscribe if" line; shots written by three parallel shot agents; delivered quickly (under ~45 min).
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/01-the-final-mp4-is-1080x1920-at-60-fps-h-2.md
~~~~~~~~ markdown
---
type: llm
focus: trace
weight: 1
---

The final MP4 is 1080x1920 at 60 fps, H.264 video with an AAC audio track
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/02-the-final-mp4-lasts-between-45-and-56-se.md
~~~~~~~~ markdown
---
type: llm
focus: trace
weight: 1
---

The final MP4 lasts between 45 and 56 seconds
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/03-the-exported-video-has-no-black-frames-a.md
~~~~~~~~ markdown
---
type: llm
focus: trace
weight: 1
---

The exported video has no black frames and no frozen spans of 1 second or longer
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/04-the-script-s-first-line-starts-with-in-t.md
~~~~~~~~ markdown
---
type: llm
focus: trace
weight: 1
---

The script's first line starts with "In this world" and it is narrated in first person by Nubi
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/05-the-script-contains-a-mid-video-line-sta.md
~~~~~~~~ markdown
---
type: llm
focus: trace
weight: 1
---

The script contains a mid-video line starting with "Subscribe" and ends with a line starting with "Subscribe if"
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/06-the-last-quarter-of-the-story-contains-a.md
~~~~~~~~ markdown
---
type: llm
focus: trace
weight: 1
---

The last quarter of the story contains a love payoff between Nubi and Lily
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/07-shots-are-split-across-at-least-three-sh.md
~~~~~~~~ markdown
---
type: llm
focus: trace
weight: 1
---

Shots are split across at least three shots/partN.js files, each written by a separate subagent spawned in one message
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/08-characters-are-drawn-with-the-shared-rig.md
~~~~~~~~ markdown
---
type: llm
focus: trace
weight: 1
---

Characters are drawn with the shared rig (C(ctx, 'nubi', ...)) rather than custom per-shot character drawing
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/evals/new-episode-from-premise/graders/09-wall-clock-time-from-the-request-to-the.md
~~~~~~~~ markdown
---
type: llm
focus: trace
weight: 1
---

Wall-clock time from the request to the delivered MP4 is under 45 minutes
~~~~~~~~

### FILE: .claude/skills/in-this-world-shorts/evals/new-episode-from-premise/prompt.md
~~~~~~~~ markdown
---
tags: [skill-creator]
max_turns: 200
timeout_seconds: 3600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash, Agent]
---

make the next video! in this world your shadow says what you're really thinking. same nubi characters, final mp4 please
~~~~~~~~

### FILE: channel-branding/branding.html
~~~~~~~~ html
<!doctype html><html><head><meta charset="utf-8"><title>Channel branding</title>
<style>
@font-face{font-family:'Lilita One';src:url(../.claude/skills/in-this-world-shorts/engine/fonts/LilitaOne-Regular.ttf)}
@font-face{font-family:'Fredoka';src:url(../.claude/skills/in-this-world-shorts/engine/fonts/Fredoka-Variable.ttf);font-weight:300 700}
body{margin:0;background:#222}</style></head><body><canvas id="c"></canvas>
<script src="../.claude/skills/in-this-world-shorts/engine/js/core.js"></script>
<script src="../.claude/skills/in-this-world-shorts/engine/js/characters.js"></script>
<script src="../.claude/skills/in-this-world-shorts/engine/js/env.js"></script>
<script src="../.claude/skills/in-this-world-shorts/engine/js/fx_ui.js"></script>
<script>
// Channel art drawn with the same rig/sets as the Shorts. ?mode=banner|banner_safe|icon|icon_preview
const mode = new URLSearchParams(location.search).get('mode') || 'banner';
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
window.STORY = { capColors: {}, capOverride: {} };
const T = 1.3; // a frozen moment (blinks open)
function ch(name, x, y, s, o = {}, face = {}) { const p = basePose(Object.assign({ x, y, s }, o)); drawShadow(ctx, p); drawCharacter(ctx, name, p, Object.assign({ noBlink: true }, face), T); return p; }
function silhouette(name, p, k, dx, eyes = 'happy') {   // talking-shadow look from the "shadow" episode
  const sp = Object.assign({}, p, { x: p.x + dx, s: p.s * k });
  ctx.save(); ctx.globalAlpha = .55; ctx.filter = 'brightness(0)'; drawCharacter(ctx, name, sp, { expr: 'neutral', noBlink: true }, T); ctx.restore(); ctx.filter = 'none';
  const S = sp.s, hx = sp.x, hy = sp.y - (RIG.legH + RIG.torsoH + RIG.headH * .45) * S;
  ctx.save(); ctx.translate(hx, hy); ctx.scale(S, S); ctx.shadowColor = '#B9A6FF'; ctx.shadowBlur = 18; ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  for (const ex of [-48, 48]) { ctx.beginPath(); ctx.arc(ex, 6, 18, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-28, 42); ctx.quadraticCurveTo(0, 66, 28, 42); ctx.stroke(); ctx.restore();
}
function title(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.03);
  txt(ctx, 'THE', -222, -86, 90, '#fff', '#000', 22);
  txt(ctx, 'NUBIVERSE', 0, 30, 138, '#FFD447', '#000', 30);
  ctx.restore();
}
async function go() {
  await document.fonts.load('100px "Lilita One"');
  if (mode.startsWith('banner')) {
    cv.width = 2560; cv.height = 1440;
    const cam = { x: 1280, y: 1200, z: 1 };
    ctx.save(); ctx.translate(0, -420); envHallway(ctx, T, cam, { posters: false }); ctx.restore();
    // colour wash + rays behind the title for punch
    const g = ctx.createLinearGradient(0, 0, 0, 1440); g.addColorStop(0, 'rgba(36,34,91,.55)'); g.addColorStop(.55, 'rgba(36,34,91,.15)'); g.addColorStop(1, 'rgba(36,34,91,.45)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 2560, 1440);
    ctx.save(); ctx.translate(890, 700); ctx.globalAlpha = .16; ctx.fillStyle = '#FFD447';
    for (let i = 0; i < 18; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 900, i * TAU / 18, i * TAU / 18 + TAU / 36); ctx.closePath(); ctx.fill(); } ctx.restore();
    const FL = 1080; // floor line in banner space
    // outer crowd (desktop / TV only)
    const crowd = [['kidA', 150, 37, 'happy'], ['kidB', 360, 152, 'excited'], ['kidC', 2220, 88, 'happy'], ['kidD', 2440, 210, 'laughing']];
    for (const [n, x, v, e] of crowd) { const p = ch(n, x, FL, .72, { view: 'q34', flip: x < 1280 ? 1 : -1 }, { expr: e }); badgeOver(ctx, n, p, v, { t: T, bs: .9 }); }
    // hero group inside the mobile safe area (x 507–2053, y 508–931)
    const np = basePose({ x: 1520, y: FL, s: .74 });
    silhouette('nubi', np, 1.7, -190);
    const lp = ch('lily', 1790, FL, .7, { view: 'q34', flip: -1 }, { expr: 'shy', holding: { R: holdBookB } });
    const bp = ch('brayden', 1985, FL, .7, { view: 'q34', flip: -1 }, { expr: 'smug' });
    np.armR = 2.2; np.handR = .3; np.armL = .25;
    drawShadow(ctx, np); drawCharacter(ctx, 'nubi', np, { expr: 'excited', noBlink: true }, T);
    badgeOver(ctx, 'nubi', np, 1, { t: T, glow: .8 });
    badgeOver(ctx, 'lily', lp, 1, { t: T, glow: .8, bs: .95 });
    badgeOver(ctx, 'brayden', bp, 900, { t: T, state: 'gold', bs: .9 });
    drawDog(ctx, 1140, FL + 10, .62, T);
    for (const [x, y, r] of [[1655, 700, 20], [1690, 660, 14], [1720, 715, 12]]) { heartPath(ctx, x, y, r); fillStroke(ctx, '#FF5B9B', 4); }
    // title block
    title(905, 660, 1.0);
    box(ctx, 530, 790, 720, 84, 42, '#FF5B9B', 8); txt(ctx, 'IN THIS WORLD... EVERY WEEK', 890, 834, 50, '#fff', '#000', 8);
    txt(ctx, '@TheNubiverse', 890, 912, 50, '#fff', '#000', 10);
    if (mode === 'banner_safe') { ctx.setLineDash([24, 16]); ctx.lineWidth = 6; ctx.strokeStyle = '#30CE65'; ctx.strokeRect(507, 508, 1546, 423); ctx.strokeStyle = '#EE384A'; ctx.strokeRect(0, 509, 2560, 423);
      txt(ctx, 'mobile + desktop safe area', 1280, 480, 34, '#30CE65', '#000', 6); }
  } else {
    cv.width = 800; cv.height = 800;
    envBurst(ctx, T * 0, '#20BDBB', '#2FD6D3', 0);
    ctx.save(); ctx.translate(400, 400); ctx.globalAlpha = .35; circle(ctx, 0, 0, 330, '#fff'); ctx.restore();
    const p = basePose({ x: 400, y: 1310, s: 2.25 }); p.armR = 2.4; p.handR = .2;
    drawCharacter(ctx, 'nubi', p, { expr: 'excited', noBlink: true }, T);
    drawBadge(ctx, 590, 150, 1, { s: 1.15, t: 0, glow: .9 });
    if (mode === 'icon_preview') { ctx.globalCompositeOperation = 'destination-in'; circle(ctx, 400, 400, 400, '#000'); ctx.globalCompositeOperation = 'source-over'; }
  }
  window.DONE = true;
}
function holdBookB(c) { box(c, -50, 10, 100, 120, 8, '#7B4BFF', 7); box(c, -40, 22, 80, 10, 4, '#fff', 0); }
go();
</script></body></html>
~~~~~~~~

### FILE: channel-branding/README.md
~~~~~~~~ markdown
# Channel packaging: The Nubiverse (@TheNubiverse)

All art is drawn with the same code characters as the videos, so the channel and the Shorts match exactly.
To regenerate, open `branding.html?mode=banner|banner_safe|icon|icon_preview`, or run
`node ../.claude/skills/in-this-world-shorts/scripts/shot.js "file://$PWD/branding.html?mode=banner" banner.png`.

| File | Use | Spec |
|---|---|---|
| `banner.png` | **Upload this as the banner** | 2560×1440 PNG (YouTube's recommended size, well under the 6 MB limit) |
| `banner_mobile_view.png` | Preview of what phones show (center 1546×423) | The title, Nubi, Lily and Brayden are all inside it |
| `banner_safe.png` | Same banner with the safe area drawn on | Reference only, don't upload |
| `icon.png` | **Upload this as the profile picture** | 800×800 PNG |
| `icon_preview.png` | How it looks in YouTube's circle crop | Reference only |

## Name and handle (chosen)

- **Channel name:** `The Nubiverse`
- **Handle:** `@TheNubiverse`
- **Tagline (on the banner):** "In this world… every week"

On the day this was made, `youtube.com/@TheNubiverse` had no channel. Plain `@Nubiverse` was taken.
YouTube confirms availability when you claim the handle in **YouTube Studio → Customization → Basic info**. Claim it soon.
Once you switch, links that use the old @NubiRobloxx handle may stop working, so update any links you've shared.

## Channel description (copy-paste)

> In this world… anything can happen. 🌎
> Welcome to The Nubiverse! Nubi is an ordinary 6th grader in a world with one magical rule per episode: shadows that say what you're thinking, numbers that show who really likes you, and more.
> New animated story every week. Comment the next "In this world…" rule you want to see!
~~~~~~~~

