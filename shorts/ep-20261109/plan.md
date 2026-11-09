# Bad Jokes Do Real Damage — shape B (family chaos, dad spotlight), supermarket → livingRoom, kicker ending, no love
Helpers in story.js: punPressure(T), drawPunMeter (auto HUD L8–L16), dmgPop(ctx,txt,x,y,t0,T,col) for game damage numbers.

## Continuity
- nubi wears bubble wrap from L5 on: draw translucent bubbly overlay (white circles, alpha .35) over his body every shot after L5.
- dad: red face/puffed cheeks build with punPressure; holdShoppingBag in store. Thief = dad2 with dark beanie/mask look (catalog style if any, else plain dad2 + black eye-mask rect), lady = neighborGranny holdShoppingBag (purse).
- cashier gets launched twice (L11 melons, L18 freezer again). mom immune = flat eye-roll, never moves.
- Store = supermarket set throughout L8–L20; home = livingRoom L21–L25 with dog.

## Shots (id | line | set | who/where | action @word | trans | sfx)
S1 | L0 | supermarket | dad R, kidG L | dad says pun, kidG flies off left @damage, dmgPop -999 | cut | whoosh, impact
S2 | L1 | frontYard | uncle+kidH | worse joke → bigger knockback, kidH spins over fence @hit | wipe | crash
S3 | L2 | classroom | kidA knock-knock → kidB slight shove @sting (dmgPop -5); kidC pun → kidD rockets up @flying | cut | pop, whoosh
S4 | L3 | kitchen | mom, dad pun at her; mom eye-roll @roll, joke bounces off "IMMUNE" stamp | cut | ding
S5 | L4 | livingRoom | dad grinning, wall behind has dad-shaped hole? no: framed "WORST JOKES IN TOWN" trophy @worst | zoom | record
S6 | L5 | kidsBedroom | nubi wraps self in bubble wrap @everywhere, record-scratch freeze popText YEP. THAT'S ME. | zoom | record, pop
S7 | L6 | hallway | kids point and laugh, label "BUBBLE BOY" popText @boy | cut | laugh
S8 | L7 | frontYard | mom at door finger up "RULE 1: NO JOKES" sign @jokes; dad+nubi salute | cut | ding
S9 | L8 | supermarket | dad sees lettuce, face goes red @red, meter appears | cut | buzz
S10 | L9 | supermarket | bread shelf, dad cheeks puff huge @puffed | cut | pop
S11 | L10 | supermarket | nubi clamps dad's mouth @covered; small joke text "lettuce romaine calm" puffs out of ear @ear | cut | whoosh
S12 | L11 | supermarket | cashier backflips into melon pile @melons, dmgPop -50, L stamp | cut | crash, sad_trombone
S13 | L12 | supermarket | slow push-in, dramatic CHEESE AISLE sign, spotlight @cheese | zoom | impact
S14 | L13 | supermarket | CTA: nubi to camera, cheese wheels everywhere, subscribe popText @subscribe | cut | ding
S15 | L14 | supermarket | thief (dad2) snatches purse from neighborGranny @grabbed, runs | flash | glitch
S16 | L15 | supermarket | close-up nubi bruh stare noBlink @dad, then nod @now; meter READY | cut | impact
S17 | L16 | supermarket | dad steps forward, delivers joke, shockwave rings @getaway | zoom | whoosh
S18 | L17 | supermarket | thief flies into freezer @freezer, frost puff, dmgPop -9999 | cut | crash
S19 | L18 | supermarket | wide: all shoppers + cashier blown flat @again, cashier dmgPop -50 again | cut | crash, laugh
S20 | L19 | supermarket | only nubi standing in bubble wrap, bubbles pop @wrap, W stamp | cut | pop, cheer
S21 | L20 | supermarket | dad gets SECURITY badge from cashier (bandaged) @security, granny hugs purse | cut | cheer
S22 | L21 | livingRoom | mom arms crossed on couch @jokes | wipe | none
S23 | L22 | livingRoom | dad innocent grin @cheesy | cut | pop
S24 | L23-L24 | livingRoom | mom eye-roll, unmoved @immune; dog launched out window @not, dmgPop -1 | cut | whoosh, crash
S25 | L25 | livingRoom | closing CTA, dad + nubi wave, dog peeks back in window (loop to S1 vibe) @subscribe | cut | ding

## Jokes and memes
L2 sting → dmgPop -5 vs pun rocket (scale contrast)
L3 immune ↔ L23 eye-roll (callback A)
L5 bubble wrap record-scratch YEP. THAT'S ME. ↔ L19 only one standing (callback B)
L10 joke leaks out of ear (absurd)
L11 cashier melons ↔ L18 cashier "again" (callback C)
L11 L stamp, L19 W stamp
L15 bruh stare
L24 dog kicker, dmgPop -1

## Parts
Part 1: S1–S8 (L0–L7) · Part 2: S9–S16 (L8–L15) · Part 3: S17–S25 (L16–L25)
