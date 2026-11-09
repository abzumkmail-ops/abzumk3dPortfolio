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

## Asset packs (lots more people and places)
`references/asset_catalog.md` lists **46 characters** (family: dad, grandpa, teenSister, littleBrother, babySister, aunt, uncle, cousin,
mom2/dad2; community: lifeguard, coach, doctor, police, firefighter, chef…; kids kidA–kidL) and **31 sets**: home (livingRoom,
kidsBedroom, bathroom, diningRoom, garage, carInside, frontYard, treehouse), outdoor (pool, beach, playground, amusementPark, campsite,
snowyStreet, soccerField, downtown, farm) and public (classroom, cafeteria, library, supermarket, doctorOffice, birthdayParty,
movieTheater, arcade, pizzeria). It also has outfits, hats, beards, props (`holdMug`, `holdPhone`, …) and costume changes for anyone:
`{ style: STYLE.swim('nubi') }` (also pajamas, winter, party, sports). Sets with a front layer (`envPoolFront`, `envClassroomFront`,
`envDiningRoomFront`, `envCarInsideFront`, `envMovieTheaterFront`, …) need that function called **after** drawing the characters.
Each pack file's top comment block gives exact seat heights, water lines and stand positions. To see everything:
`engine/catalog.html?mode=people|sets|set&name=pool`.

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
