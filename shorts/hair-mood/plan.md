# Plan: "In This World, Your Hair Changes Color With Your Mood"

~54 s · 27 lines (L0–L26) · voice: Kokoro kid narrator (one voice reads every line)

## Shared systems (in story.js; use these, don't reinvent)
- **Mood hair** goes through the face object of `C()` / `drawCharacter`: `face.hair = 'happy'|'mad'|'sad'|'love'|'scared'|'calm'` or a hex.
  Colors: happy yellow, mad red, sad blue, love PINK, scared green, calm purple. Smooth change: `hair: hairShift('sad','love',T,t0)`.
  `face.hairGlow = true` = glowing aura ("super pink"). `hairPop(ctx, x, headY, mood, T - t0, s)` = colored star burst at a head when the hair changes (world space, draw after the character).
  Without `face.hair` a character keeps their normal hair color (use that for calm background kids).
- **Nubi (every Nubi shot)**: `{ hair: nubiHair(T), cap: nubiCap(T), hairGlow: nubiGlow(T), ... }`. These encode the whole timeline:
  happy → L5 "Lily" pink → (cap on from L6 "cap" until L9 "off") → L8 "picture" green (scared) → L11 "Lily" pink → L13 "Blue" blue → L14 "Pink" pink → L15 "Blue" blue → L16 "super" pink + glow forever.
  Add `hairPop` at those change words in the shots that show them.
- **Lily**: hair `LILY_PINK` ('love') in EVERY shot where she is near Nubi (the hidden clue; nobody comments on it until L22). Nubi never looks at her hair:
  in her shots before L22 he is looking down, eyes closed, or sideways. Only L1/L2-type world-rule shots with no Nubi use other moods.
- **Brayden**: smug, normal blond hair until L19 "pink" → pink (`hairShift('#F2D45C','love',T,ws('L19','pink'))`). Kayla = **kidC** (purple shirt, ponytail).
- **HUD** "NUBI'S HAIR: <COLOR>" is automatic from L9 "off" to L20 start. It covers screen y 80–220 then: keep faces below ~300.
- **Sets**: `envPhoto(ctx,T,cam,{noRisers})` = gym with PICTURE DAY banner + mottled blue photo backdrop (x 90–990, y 500–1500) + wooden riser (top y 1390, x 160–920).
  Also `envHallway`, `envKitchen`, `envBackyard` (schoolyard), `envSoft`, `envBurst`, `envGym`.
- **Props** (face.holding): `holdCamera` (photographer), `holdRemote`, `holdBroccoli`, `holdHomework`, engine `holdBook`, `holdMic`.
- **One-off**: `CAST.photographer` (dark shirt, buzz cut). `cameraFlash(ctx,T,t0)` in ui.

## Continuity
- Class-photo line-up in envPhoto (L9–L25), front view, floor y 1500 unless noted: kidA x 200 · **Nubi x 430** · **Lily x 650** · kidF x 860 on the floor;
  back row on the riser (y 1390): kidB x 260 · **Brayden x 470** · **Kayla(kidC) x 690** · kidE x 880. Photographer off-camera; when shown, he stands at x 540 facing the class (reverse shot, envGym with noLights).
- Nubi wears the orange cap only L6 "cap" → L9 "off". At L9 he takes it off and holds it (or drops it).
- Teacher hair blue in L4 only. Grandma red in L3.

## Shots
| id | line | set | action (anchor words) | camera | trans | sfx |
|---|---|---|---|---|---|---|
| **Part 1** ||||||
| S01 | L0 | hallway | HOOK frame 1: Nubi centre, front, hair YELLOW, big grin. At "changes", hair cycles yellow→red→blue→pink (0.25 s each, hairPop each), back to yellow on "mood". | start 1.8x on Nubi's head → 1.2x by "mood" | none | pop ×4 |
| S02 | L1 | hallway | 3 kids in a row, each pops on their word: kidD "Happy… yellow" (happy, yellow hair), kidE "Mad… red" (angry, red), kidF "Sad… blue" (sad, blue). Each hairPop | wide 1.0, small pan L→R | cut | ding, boing, sad_trombone (short) |
| S03 | L2 | envSoft pink | kidA and kidB facing each other, both blush, hair → pink at "pink" (first), hearts at "someone" | 1.4x | zoom | chime, sparkle |
| S04 | L3 | kitchen | Grandma searches couch cushions, angry; hair red at "red" with steam puffs; at "remote" she throws her hands up; the TV remote (holdRemote drawn in world space) is visibly sticking out of her own hair bun — gag | 1.2x | whip | scratch, poof |
| S05 | L4 | classroom = hallway with board? use envHallway | Teacher with a coffee mug (or holdBook), droopy; hair BLUE at "blue"; a "MONDAY" sign/calendar pops | 1.4x | cut | sad_trombone |
| S06 | L5 | hallway | Nubi at locker (left), hair yellow. At "Lily" Lily walks by (right, q34, hair pink, LILY_PINK). Nubi's hair BLASTS pink (hairPop, hearts) — he looks at the floor, blushing | 1.3x two-shot | cut | boing, sparkle |
| S07 | L6 | hallway | close: Nubi slams the orange cap on at "cap" (nubiCap flips), pulls it low, relieved. "every single day": quick 3-beat (calendar pages flip behind / or 3 fast cuts of him in cap) | 1.8x | zoom | poof |
| S08 | L7 | backyard as schoolyard | kidA, kidB, kidE point and laugh, sign/bubble "HAT BOY!". Nubi in cap shrugs | wide | cut | laugh |
| S09 | L8 | envPhoto (no kids) | "picture day": the PICTURE DAY banner + backdrop reveal; Nubi walks in, Nubi (cap on) walks in; at "picture" he freezes, gulps, sweat drop (cap hides his green hair) | push in 1.0→1.3 | whip | swell, bell |
| **Part 2** ||||||
| S10 | L9 | envGym reverse | Photographer (holdCamera) yells, big speech bubble "HATS OFF!" at "hats". | 1.5x | cut | whistle/impact |
| S11 | L9 "off"→ | envPhoto line-up | Nubi pulls the cap off at "off" (nubiCap flips) — GREEN hair revealed (hairPop green). HUD appears. Other kids in line-up (positions above) | 1.2x | cut | poof |
| S12 | L10 | envPhoto | Nubi looks slowly to his right… camera pans right toward x 650 (Lily not yet revealed: frame stops at her shoulder / blur) | 1.6x pan | cut | whoosh slow |
| S13 | L11 | envPhoto | "Lily.": Lily close-up, sweet smile, sparkles, hair pink. Then Nubi's hair goes PINK (hairPop), eyes wide, sweating, looks at the ceiling | 1.8x → two-shot | zoom | chime, boing |
| S14 | L12 | envPhoto | Nubi panics, holds his head; red vignette pulse; Subscribe button. "snitch": a tiny alarm siren over his pink hair | 1.4x | cut | alarm, click |
| S15 | L13 | envSoft blue / thought bubble | Nubi eyes shut, thinking hard; thought bubble with holdHomework image; hair BLUE at "Blue" (hairPop), relieved | 1.6x | zoom | ding |
| S16 | L14 | envPhoto two-shot | Lily waves "hi" (bubble "HI!"); at "Pink" Nubi's hair snaps back PINK (hairPop) — Nubi looking down | 1.3x | cut | boing |
| S17 | L15 | envSoft green/blue | Nubi grimaces holding broccoli thought; hair BLUE at "Blue" | 1.6x | zoom | ding |
| S18 | L16 | envPhoto two-shot | Lily giggles (laugh, hand to mouth). At "super" Nubi's hair goes SUPER pink with glow (nubiGlow), hairPop big, hearts burst, small shake | 1.3x → 1.6x | cut | sparkle, boing |
| S19 | L17 | envPhoto | Brayden on the riser behind points down at Nubi, laughing, bubble "NUBI LIKES SOMEBODY!" at "yelled" | 1.4x low on Brayden | whip | scratch |
| **Part 3** ||||||
| S20 | L18 | envPhoto wide | whole line-up turns to look at Nubi (heads/q34 toward him), surprise faces; Nubi shrinks | wide 1.0 | cut | gasp/whoosh |
| S21 | L19 | envPhoto | sequence: at "pink" Brayden's hair goes PINK (hairPop), at "waved" Kayla waves, Brayden blushes red-faced, freezes mid-point | 1.5x on Brayden+Kayla | cut | boing, chime |
| S22 | L20 | envPhoto, calm, slight dim | Nubi looks around — every kid's hair slowly turns pink one by one on "Everybody… pink… someone" (kidA, kidF, kidB, kidE). Nubi smiles realizing; sparkle at "realized" | slow pull back 1.3→1.0 | cut | magic |
| S23 | L21 | envPhoto | Nubi stands tall, proud, hands on hips; tosses the cap away (cap prop flying) at "hide" | 1.4x | cut | whoosh, swell |
| S24 | L22 | envPhoto two-shot, pink glow | Lily leans in, whisper bubble "look at mine…" at "mine", points at her own hair | 1.7x | zoom | chime |
| S25 | L23 | envSoft pink | Close-up Lily, pink hair glowing; a quick flashback inset: Lily pink near Nubi earlier, Nubi staring down | 1.6x | cut | sparkle |
| S26 | L24 | hallway | flashback-ish: Nubi walking staring at his shoes, Lily behind with pink hair waving (he doesn't see) — "shoes" | 1.3x | cut | sad_trombone soft |
| S27 | L25 | envPhoto | "Click": cameraFlash at "Click"; freeze into a polaroid/photo frame: whole class, Nubi + Lily both pink and smiling, Brayden + Kayla pink | 1.0 | flash | camera/click, party |
| S28 | L26 | envPhoto | Nubi and Lily close, both pink, hair glow; Subscribe button; push to Nubi's head 1.8x by end (loops to S01) | 1.2→1.8x | cut | click, sparkle |

Part 1 = S01–S09 (L0–L8, 0 → L9 start ≈17.4 s) · Part 2 = S10–S19 (L9–L17, L9 start → L18 start ≈32.5 s) · Part 3 = S20–S28 (L18–L26, L18 start → end ≈49.8 s).
Each part covers its whole time range with no gaps: a part's first shot starts at the previous part's boundary (line start), its last shot runs until the next part's first line starts.
