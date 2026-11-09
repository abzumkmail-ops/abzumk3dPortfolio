# LANDSCAPE (16:9) OVERRIDES — read this; it beats shot_api.md wherever they disagree
This project renders **1920×1080 landscape**, long-form (~7.5 min). Engine is patched; the world is unchanged.
- **World space is the same** (floor y = 1500, set furniture around x 0..1080, walls/floors extend forever sideways). Character height ≈ 520·s.
- **Camera**: `camAt(x, y, z)` puts world (x,y) at screen centre (960, 540). At z = 1 the screen shows **≈1477 × 831 world units**.
  | Framing | camera | s |
  |---|---|---|
  | establishing wide (set + 5–8 people) | `camAt(540, 1130, .8–.9)` | .7–.8 |
  | wide / group | `camAt(540, 1160, 1.0)` | .8 |
  | medium two-shot | `camAt(x, 1230, 1.4–1.6)` | .8 |
  | face close-up | `camAt(x, 1170, 2.4–2.8)` (char feet y 1500, s .8) | .8 |
  Stay inside the furniture: with z < .9 keep cam x near 540. Use horizontal space: two people talking stand ~350–500 apart; crowds spread x -200..1280 at z .8.
- **Screen space (ui)** is **1920 × 1080** (`W`=1920, `H`=1080). Centre is (960, 540). popText/stamp: x ≈ 960, y 200–380, size 70–100. `drawSubscribe(ctx, dt, dur)` defaults to y 760.
- **Captions** sit at screen y **960** (default; don't set capY unless something important is at the bottom — then 120 for top). Keep faces out of the bottom 170 px.
- The countdown clock HUD (top-right) appears automatically on L93–L99.
- Long form pacing: shots are 2–6 s. Every shot needs motion (slow cam drift `z + lt*.02`, idle/talk). Use cuts mostly; `whip`/`zoom`/`flash` for gags only.
- Teens: everyone is a high-schooler; use phones (`holdPhone`) and hoodies. Narrator = `nubi` (never type "Nubi" on screen).
- **Winter rule**: from L20 'fell' until L97 (midnight), every male (nubi excepted, grandpa only secretly) is ASLEEP: use `sleeper(ctx,name,x,y,s,T,{bag})` lying on the floor or `eyes:{open:0}` + `zzz()` if seated. Awake people in winter are girls/women only: lily, kidA, kidC, kidE, kidF, teenSister, mom, teacher, principalF, lunchlady, grandma, + `STYLE.isGirl(name)` kids from the catalog. Males: brayden, dad, grandpa, coach, principal, kidB, kidD, uncle…
- Shared helpers in story.js (use them, don't redefine): `snowfall(ctx,T,a)` (ui), `zzz(ctx,x,y,T,s,seed)`, `sleeper(...)`, props `holdCocoa holdSketchbook holdJar holdCookie holdPhoto`, `loadingBar(ctx,x,y,w,pct)` (ui), `snackStash(ctx,x,y,{open,empty})` (world, ~300 wide, sign above), `signupSheet(ctx,x,y,n,s)`, `GIRLS`.
- Shot ids: `S<line number>` (e.g. S37 starts at `st('L37')`); split long lines into `S37b` etc. at a word.
