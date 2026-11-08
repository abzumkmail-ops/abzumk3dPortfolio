# Reference Video Analysis

Source: `65026726-20261108-1524-22.7812667.mp4` (user upload). Analysis only — no frames, characters or dialogue from it are reused.

## 1. Technical specs (ffprobe)

| Property | Actual value | Your brief said |
|---|---|---|
| Resolution | **508 × 900** (≈9:16; 127:225) | 1080 × 1920 |
| Frame rate | **30 fps** constant (1491 frames) | 60 fps |
| Duration | **49.70 s** | ~50 s ✅ |
| Video | H.264 Main, yuv420p, ~1.94 Mb/s | |
| Audio | 1 stream, AAC-LC, 48 kHz stereo, 192 kb/s | |
| Loudness | −15.3 LUFS integrated (loud, Shorts-typical) | |

The upload is a downscaled re-encode; the original was likely 1080×1920. We will still produce 1080×1920 @ 60 fps as you specified.

## 2. Narration (faster-whisper `small`, word timestamps)

127 words, speech spans 0.0–48.5 s → **≈157 words per minute**. Nearly wall-to-wall narration; gaps are ≤0.9 s and only at punchlines.

Structure (paraphrased, not reused): parent gives kid a 10-second limit → kid reveals he's a speedrunner → one absurd event per remaining second (obby, boss, currency, shop, crowd, pet egg) → timer goes red, parent closes in → kid finds a "+10 seconds" purchase → parent dives in slow-mo → purchase lands → parent despairs → "Comment LOOP" CTA → rewind to frame 1.

Two voices: a narrator/kid voice and a separate parent voice for the parent's lines.

## 3. Pacing

- 26 detected cuts (scene-score > 0.25) plus many in-shot beats → **average shot ≈ 1.9 s**; a new visual beat roughly every **1–1.5 s**.
- Motion energy (mean frame-difference per second) is low in the bedroom (1.5–6), spikes in the game world (10–21), drops during the panic/slow-mo (1.4–2), spikes at the purchase (7–8) and the rewind (15).
- Each "second" beat is ~2.5–3.5 s of screen time — the on-screen timer is **narrative time**, not real time (10 "seconds" last ~37 s).

## 4. Visual style

- **Characters**: 2D flat-vector blocky avatars. Huge rounded-square head (≈40% of body height), thick dark-brown/black outline (~1.2% of frame width), flat fill + one soft highlight on the face, simple cel shadow under hair. Rectangular torso/arms/legs, mitten hands.
- **Faces**: big eyes with white highlight dots, thick independent eyebrows, mouth shapes swap per word, blush ovals, sweat drops, cartoon tears, anger vein, "dead/zombie" palette swap (green-blue face) for shock.
- **Kid**: brown bowl hair, red outfit with a lightning-bolt chest emblem. **Parent**: hair bun with curlers, purple robe, pearl necklace, holds a red alarm clock.
- **Backgrounds**: night bedroom (navy/purple wall, moon window, checkered blanket, teal oval rug, warm lamp/door light cone); obby over orange lava with pastel floating blocks; purple boss arena; bright green "plaza" with blocky crowd; dark shop UI over game.
- **Color**: highly saturated, high contrast; bedroom uses cool navy with warm yellow accents; game world is bright daylight; critical moments add a red vignette/tint.

## 5. Animation techniques observed

The reference **is real puppet animation**, not stills:
- Parent's arm swings between poses each word, eyebrows/mouth change per word (row 1 of `motion.jpg`).
- Kid runs, jumps between platforms, lands with squash, arms up in celebration (row 2).
- Parent's dive is a slow-mo translate + rotate across the room with motion lines; kid's face holds a frozen expression (row 3).
- Pose-to-pose with snappy easing (few in-betweens, overshoot on arrival) — typical of After-Effects puppet rigs.
- Frequent **punch-in close-ups** on faces for reactions; subtle continuous camera drift so no frame is static.
- Particles: coins, confetti, sparkles, smoke puffs on transformation, speed lines, ring "shockwave" on reveals.

## 6. HUD / UI

- **Persistent timer** pill top-center (dark → **red** from "4"), stopwatch icon, `0:10` format. Changes only on story beats.
- **"SECOND N" reveal card**: big rounded badge with stopwatch + giant numeral, pops in with scale overshoot + radial burst, then flies out — this is the chapter-marker device.
- Stage progress bar, boss HP bar, currency counter rolling up, shop grid with green **OWNED** stamps, purchase dialog with **BUY / Cancel**, "Purchase successful" toast, system chat message, fake comment section for the CTA.
- All UI text is crisp vector text.

## 7. Captions

- Lower-middle (~60–65% down the frame), never over the face in close-ups (they move up/down per shot).
- **One to three words at a time**, word-synced, heavy rounded display font (Lilita One / Luckiest-Guy-like), white with thick black stroke + drop shadow.
- Keyword color: red (danger, "TEN", "FOUR…"), yellow (named things: "NOOB KING", "TOASTER"), green (wins: "SPEEDRUNNER", "ROBUX!", "+10 SECONDS"), pink (comedy/drama: "BED", "AGAIN!").
- Pop-in scale overshoot (~110% → 100%), slight rotation on emphasized words, elongated words stretched ("THAAAAAAT!").

## 8. Audio

Constant upbeat music bed under narration; heavy SFX layer: ticks on timer changes, whooshes on every cut, pop on caption emphasis, coin cascades, punch impact, "ding", record-scratch/slow-mo, cash register "ka-ching", rewind sound at the loop point.

## 9. Why it works (techniques to recreate with original assets)

1. **Hook in the first sentence** — the restriction and the stakes are stated at 0.0 s, with the parent on screen.
2. **Countdown as chapter structure** — every beat is labelled ("SECOND 7"), so viewers always know how far along they are.
3. **Escalation ladder** — each beat is bigger and sillier than the last (skill → boss → money → shopping → transformation → crowd → rare pet).
4. **Callback twist** — the parent's limit is beaten by the game's own mechanic (buying time).
5. **Red-shift for urgency** — timer, vignette and music all change at the same moment.
6. **Slow-motion beat** right before the payoff to stretch tension.
7. **Seamless loop** — the final frame rewinds to the first shot; the CTA explicitly asks people to loop.
8. **Persistent HUD** ties real-world and game-world scenes into one continuous "game".

## Files

- `contact_full.jpg` — 50 frames, 1 per second
- `contact_cuts.jpg` — 20 frames, one after each major cut
- `motion.jpg` — consecutive-frame strips proving in-shot puppet animation
- `words.json` — word-level transcript timestamps
