---
name: in-this-world-shorts
description: Produce a complete, fully animated vertical YouTube Short (1080×1920, 60 fps, ~50 s MP4 with kid narrator voice, word-synced captions, SFX and music) in the "In This World…" story format of the NubiRobloxx channel, using a ready-made code animation engine with a recurring cast of blocky Roblox-style characters (Nubi, Lily, Brayden, classmates, family). Use this skill whenever the user wants a new Short, episode, animated story video, "In this world" / "what if" story, or anything with Nubi and his friends, even if they only give a premise ("make one about shadows that talk") or just say "make the next video". Also use it to re-voice, re-edit or re-render an existing Short made with this engine.
---

# "In This World" Shorts: fast production

Every Short reuses the same engine, characters, sets, captions, HUD, sound library, music and narrator voice. A new video only needs
**a script**, **a story file** and **shot files**. The slow parts run in parallel: the voice generates while three shot-writer agents
animate their thirds of the story, and the audio mix runs while frames render. Target: **finished MP4 in about 25–35 minutes**.

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
