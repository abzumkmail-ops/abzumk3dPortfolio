# Plan — "In This World, Every Lie Makes Your Nose Glow" (54.3 s voice, END ≈ 54.9 s)

## Shared helpers (story.js — use them, never redraw them)
- `noseGlow(ctx, name, pose, amt, T, {col})` — call right AFTER `C(...)` for that character (and after `blackout`).
  amt: .3 blink · 1 normal lie · 1.6+ lighthouse rays · 2.5 "lit up the sky". Lily's love glow: `{col:'255,110,170'}`. Don't use with `rot`.
- `blackout(ctx, a)` full-frame darkness; `gymDark(T)` is the story's gym darkness (0 before L13 "out", .9 in blackout, fades as noses relight it, 0 after L20 "daylight").
  Dark gym shots: draw bg + characters, then `blackout(ctx, gymDark(T))`, then all `noseGlow` calls (so noses shine through the dark).
- `drawShades(ctx,'lily',pose)` (after C), `rain(ctx,T,a,x0,x1,y0,y1)`, `drawBoat(ctx,x,y,s,T,col)`, `drawFireTruck(ctx,x,y,s,T,flip)`,
  sets `envShore(ctx,T,cam)` (night sea; cliff top floor y 1500 for x > 680) and `envDisco(ctx,T,cam)` (dentist disco), cast `dentist`.
- Gym: `envGym(ctx,T,cam,{banner:'SCHOOL DANCE', bannerC:'#FF5B9B'})`.

## Continuity
- Hero (`nubi`) wears the teal hoodie the whole video. His nose is dark unless a row says otherwise.
- Lily: sunglasses ON from L12 "sunglasses" through the end of L13 only.
- Brayden at the dance stands left of the hero; Grandma is the dance chaperone by the punch table (right side) from L18 on.
- Hero's lie glow levels: L6 "fine" 2.0 · L10 "glow" .7 · L11 "brighter" 1.2 · L12 "sunglasses" 1.8 · L18 "homework" 2.2 · L23 "nope" 2.5. Ending L25–26: soft .6.

## Shots
| # | Line | Start | Set | Characters / positions | Action on word | Camera | Trans | SFX |
|---|---|---|---|---|---|---|---|---|
| **Part 1 (0 – st('L9'))** |
| S1 | L0 | 0 | envKitchen | hero x540 s.8 close, cookie crumbs on mouth (tiny brown dots), cookie jar on counter | frame 1: nose glow 1.6 already on; POV popText "POV: \"I DIDN'T EAT IT\"" y 420; at "glow" nose pulses to 2.0, hero `nervous`, sweat | camAt(540,1110,2.1) | none | power .5 at "glow" |
| S2 | L1 "Small lies" | st L1 | envHallway | kidA x380, kidB x720 (q34 facing each other) | kidA nose .3 blink at "blink" (pop) | medium two-shot | cut | tick |
| S3 | L1 "Big lies" | ws L1 big -.08 | envHallway | kidB close | at "lighthouse" nose 1.8 with rays, kidA shields eyes, popText "LIGHTHOUSE" | punch-in on kidB | zoom | swell .6 |
| S4 | L2 | st L2 | envDisco | dentist x700 holding a tool (simple line), kidC x380 in chair pose `terrified` | at "hurt" dentist nose 1.2; at "discos" disco rays/ball spin harder, kidC `confused`→dancing arms | medium | whip | ding, then party feel; boing at "discos" |
| S5 | L3 | st L3 | envKitchen | grandma x540 smug | at "thirty" nose 1.0, at "nine" 1.8 rays; hero x820 side-eye `neutral` | medium | cut | swell .5 at "nine" |
| S6 | L4 | st L4 | envShore | grandma x820 on cliff (y 1500) q34 flip -1 facing sea, nose 2.0 rays | 3 boats (drawBoat) sail from left toward her across the sea (y ≈1230–1330); at "shore" a boat bumps the cliff | wide | whip | bell at "boats", thud at "shore" |
| S7 | L5 | st L5 | envBurst('#2bc4b8','#1d8f96') | hero close, `smug` → at "worst" `nervous` | popText "WORST LIAR ALIVE" at "worst" | camAt close | zoom | record? no — impact .5 at "worst" |
| S8 | L6 "I said I'm fine" | st L6 | envBackyard | hero x420 `nervous` thumbs-up arm | at "fine" nose 2.0 rays (lighthouse), lipShape(T,['L6']) only for "I'm fine" words | medium | cut | power at "fine" |
| S9 | L6 "The neighbors…" | ws L6 the -.08 | envBackyard | hero x320 glowing 2.0, fire truck drives in from right (drawFireTruck, x 1500→800) | truck arrives on "fire department" with flashing light | wide | whip | alarm .6 at "fire", crash .3 on stop |
| S10 | L7 | st L7 | envHallway | hero centre `sad`, kidA–kidD around pointing + laughing | popText "NIGHT LIGHT" gold y 520 at "night" | medium | cut | laugh .6 |
| S11 | L8 | st L8 | envGym SCHOOL DANCE | crowd of kids dancing (bs n/a), hero x540 front; at "lily" cut-in feel: camera pans to Lily x860 in back, shy, `envSoft`-like sparkles near her | at "lily" hero `love` (heart eyes) | wide→pan right | whip | swell .4 at "lily" |
| **Part 2 (st('L9') – st('L17'))** |
| S12 | L9 | st L9 | envGym | brayden x540 close `smug`, lipShape(T,['L9']) | at "glowing" wiggles fingers | camAt close | cut | — |
| S13 | L10 "Nice weather" | st L10 | envGym | hero x340 q34, lily x740 q34 flip -1; hero lipShape | at "pouring" rain() over an inset window (box upper area, x 300–780, y 300–700) at full rain | two-shot | cut | — |
| S14 | L10 "Glow" | ws L10 glow -.08 | envGym | hero close | nose .7; stamp('L',…, '#EE384A') | close | zoom | sad_trombone .5 |
| S15 | L11 | st L11 | envGym | hero x340 sweat `nervous`, lily x740 | at "brighter" nose 1.2, lily squints; stamp 'L' | two-shot | cut | buzz .5 |
| S16 | L12 "I definitely…" | st L12 | envGym | hero close `nervous`, lipShape | at "practice" nose 1.8 rays | close | cut | power .5 |
| S17 | L12 "Lily put on…" | ws L12 lily -.08 | envGym | lily close `neutral` deadpan | at "sunglasses" drawShades on; stamp 'L' (third); noBlink | close | zoom | bling .7 |
| S18 | L13 CTA | st L13 | envGym | hero x340 glowing 1.0, lily x740 in shades | drawSubscribe(ctx, T-st('L13'), 1.6, 1460); at "out": everything goes black (gymDark), only hero's nose remains a dot, then it fades to 0 | two-shot | cut | at "out": thud .8 + glitch .4 |
| S19 | L14 | st L14 | envGym dark (.9) | silhouettes: crowd barely visible | at "screamed" brayden screaming face pops (lit by vignette white flash 0.1 s); at "brayden" cut | wide | cut | impact .7 at "screamed" |
| S20 | L14 "It was Brayden" | ws L14 it -.08 | envGym dark | **bruh stare**: hero close `neutral` noBlink in near-dark (blackout .75 so face readable) | hold | close | zoom | impact .7 on cut |
| S21 | L15 | st L15 | envGym dark | brayden close `terrified`, lipShape(['L15']) on "I'm not scared" | at "scared" nose .25 tiny flicker; at "candle" popText "BIRTHDAY CANDLE" small yellow | close | cut | sad_trombone .5 at "candle" |
| S22 | L16 | st L16 | envGym dark (.85) | hero close, `surprised` at "realized", eyes catch light | sparkle burst beside head at "realized" | slow push-in | cut | chime |
| **Part 3 (st('L17') – END)** |
| S23 | L17 | st L17 | envGym dark | hero `determined`, mid close | at "brightest" popText "BRIGHTEST" green; nose still dark | close | cut | power .4 |
| S24 | L18 | st L18 | envGym dark→gymDark | hero jumps onto stage (stage y 1190) x540, arms up; crowd silhouettes front | at "homework" nose 2.2 rays + spotlight; lipShape(['L18']) on "I love homework"; crowd `surprised` | wide low | whip | swell then power 1.0 at "homework" |
| S25 | L19 | st L19 | envGym (gymDark) | crowd: kidA x260 "I love broccoli" nose 1.2 at "broccoli", brayden x760 at "unicorn" nose 1.4; more kids' noses .8 popping on | popText "I LOVE BROCCOLI!" and "I'M A UNICORN!" | wide | cut | ding2, ding3, cheer .4 |
| S26 | L20 | st L20 | envGym | grandma x700 at punch table, kids around | at "nine" nose 3.0 rays (callback to S6 lighthouse); at "daylight" white flash then gym fully lit, kids shield eyes `happy`, confetti | medium→wide | cut (flash on daylight) | flash + cheer at "daylight" |
| S27 | L21 | st L21 | envGym normal, dim .3 | lily walks from x900 to x720, hero x340 | walk(), love mood | wide | whip | step |
| S28 | L22 | st L22 | envSoft | lily close `shy`, blush, lipShape(['L22']) | — | close | cut | — |
| S29 | L23 | st L23 | envGym | hero close; at "nope" **record-scratch freeze** (clamp T), nose 2.5 rays, popText "YEP. THAT'S ME."; unfreeze at "nose"; at "sky" star burst above | close | zoom | record at "nope", power 1.0 at "nose" |
| S30 | L24 | st L24 | envSoft | two-shot hero x340, lily x740; lily lipShape on "me neither" | at "glowed" lily nose 1.2 pink; thread() heart line from his nose to hers; both `love` | two-shot | cut | magic at "glowed" |
| S31 | L25 | st L25 | envGym lit | hero + lily holding hands centre, kids cheering behind, brayden thumbs-up | popText "NIGHT LIGHT" gold, small stars | wide | cut | cheer .5 |
| S32 | L26 CTA | st L26 | envKitchen (loop echo of S1) | hero close, wink `happy`, nose soft .6 | drawSubscribe(ctx, T-st('L26'), 1.6, 1460) | camAt(540,1110,2.1) | zoom | bling |

## Jokes and memes (implement every row)
| Line | Landing word | Visual gag | Callback |
|---|---|---|---|
| L0 | glow | POV pop text + crumbs + blazing nose on frame 1 (meme: POV caption) | loops with L26 |
| L1 | lighthouse | kidB nose with rotating rays, kidA shields eyes | plants lighthouse look |
| L2 | discos | dentist's nose lights a mirror-ball disco, patient dances | — |
| L3/L4 | nine / shore | Grandma's nose lighthouse; boats steer to her, one bumps the cliff | **Callback A** paid in L20 (rays, "daylight") |
| L6 | department | fire truck arrives for a glowing "I'm fine" | — |
| L7 | light | NIGHT LIGHT nickname pop text, kids laugh | **Callback B** paid in L25 (NIGHT LIGHT cheered) |
| L10–L12 | glow / brighter / sunglasses | **L stamps** ×3, each glow bigger (meme: W/L stamp) | — |
| L12 | sunglasses | Lily deadpan puts shades on | — |
| L14 | brayden | **bruh stare** hero close-up in the dark | — |
| L15 | candle | Brayden's tiny flicker vs. hero's lighthouse | — |
| L18 | homework | biggest lie = stage spotlight | — |
| L19 | unicorn | Brayden yells "I'm a unicorn" and lights up | Brayden redeemed |
| L23 | nope | **record-scratch freeze** "YEP. THAT'S ME." | — |
| L24 | glowed | Lily's nose glows pink too, heart thread between noses | love payoff |

## Parts
- Part 1: S1–S11, L0–L8 (0 → st('L9') ≈ 18.1 s)
- Part 2: S12–S22, L9–L16 (st('L9') → st('L17') ≈ 34.5 s)
- Part 3: S23–S32, L17–L26 (st('L17') → END)
