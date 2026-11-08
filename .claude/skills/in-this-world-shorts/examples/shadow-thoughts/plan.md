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
