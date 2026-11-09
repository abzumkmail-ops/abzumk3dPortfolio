# Dad Jokes Deal Real Damage — plan (helpers in story.js: dmgPop, helmet, lettuce, melon, milkCarton)
Continuity: hero=nubi (teal hoodie, never named). Dad=`dad` (hero's dad), Lily's dad=`dad2`, Mom=`mom` ALWAYS wears helmet() when on screen. Supermarket shots share one camera layout: Lily stands right side (x≈780), shelves behind.
Damage pops: red '-N' for groans/puns, grey '0' for hero's jokes, green '+N' for laughs. Every joke hit = knockback + shake + dmgPop.
id | line | set | who and where | action @word | trans | sfx
s01 | L0 | supermarket | dad center grinning finger-guns, nubi R facepalm; cereal boxes raining, cart on side | frame1 already wrecked; @sentence dmgPop '-9999' huge | cut | crash, impact
s02 | L1 | frontYard | dad L tells pun to neighborGranny R | @damage granny knocked back, dmgPop '-50' | whip | punch
s03 | L2 | hallway | kidA groans (expr disgusted) flies backward out of frame | @punch knockback + shake, popText 'UGHHH' | cut | punch, impact
s04 | L3 | frontYard | dad to uncle: @Ten small '-10'; @Knock/@explode house window shatters, glass shards, uncle blown back | cut | pop, glass/crash
s05 | L4 | diningRoom | mom seated with helmet eating spaghetti calmly, dad laughing, nubi | @helmet zoom on mom's helmet, deadpan | zoom | ding
s06 | L5 | classroom | nubi at front telling joke, kids bored | @zero grey dmgPop '0'; @groans crickets popText '*cricket*' | cut | crickets/none
s07 | L6 | hallway | kids point at nubi | @Zero stamp 'ZERO DAMAGE' grey #9AA3AD; nubi sad | cut | sad_trombone
s08 | L7 | supermarket | nubi L pushing cart; Lily R browsing | @Lily nubi heart-eyes, sparkles around Lily | cut | sparkle
s09 | L8 | supermarket | dad pops up behind nubi, evil grin eyebrows | @dad record-scratch freeze, popText "YEP. THAT'S MY DAD." | zoom | record
s10 | L9 | supermarket | dad grabs lettuce() from produce, wind-up pose | @lettuce lettuce rises into hand | cut | whoosh
s11 | L10 | supermarket | close-up dad, lettuce raised high | talking; @ourselves white shockwave ring expands | cut | whoosh
s12 | L11 | supermarket | wide; Lily ducks, nubi braces | @Boom shake, shelves burst, cereal boxes fly, dmgPops '-500' x3 | flash | explosion/crash
s13 | L12 | supermarket | nubi hand over dad's mouth | @licked nubi recoils expr disgusted, stamp 'L' red | cut | slurp?/sad_trombone
s14 | L13 | supermarket freezer glow | nubi peeks from freezer frost; dad leans in | @chill ice shards blast, dmgPop '-200', stamp 'L' red | cut | crash, sad_trombone
s15 | L14 | supermarket | dad2 appears far end holding melon(), dramatic zoom, standoff | @melon zoom on melon | zoom | record/impact
s16 | L15 | supermarket | dad L vs dad2 R facing, lettuce vs melon | 'VS' and popText 'PUN BATTLE' @battle, lightning sparks | cut | impact
s17 | L16 | supermarket | shopping carts fly across screen | @orbit milkCarton() shoots up off top, star twinkle; dmgPops | cut | whoosh, crash
s18 | L17 | supermarket (dim, wrecked) | nubi alone thinking | @realized lightbulb popText | cut | ding
s19 | L18 | supermarket | split: dad groaning kid '-100' red @hurt; kidB laughing '+100' green sparkles @heal | cut | punch, sparkle
s20 | L19 | supermarket | nubi walks to Lily (sheltering behind cart), nervous | sweat drops | cut | step
s21 | L20 | supermarket | nubi telling joke to Lily, popText 'WHY DID THE COOKIE SEE A DOCTOR?' | @crummy rimshot pause, Lily neutral | cut | drum/ding
s22 | L21 | supermarket | Lily laughs big | @Zero grey '0' over Lily; @laughed green '+999'; stamp 'W' green | flash | cheer
s23 | L22 | supermarket | everyone healed, green '+' pops over dad, dad2, shoppers | @milk milkCarton falls from top into dad's hand | cut | sparkle, pop
s24 | L23 | supermarket | close two-shot Lily blush + nubi heart-eyes, hearts float | @favorite hearts burst | zoom | love/sparkle
s25 | L24 | supermarket | mom walks in wearing helmet + shopping bag, dads freeze | @helmet deadpan bruh stare | cut | impact .7
s26 | L25 | supermarket | dad finger-guns to camera, nubi+Lily giggle behind | @weapon dmgPop '-9999' + screen crack lines (echo s01) | cut | punch
## Jokes and memes
L0 sentence: wrecked store, -9999 (callback in L25) · L4 helmet: mom's helmet (pays off L24) · L5/L6 zero: grey 0 + ZERO DAMAGE stamp (pays off L21 '0' becomes good)
L8 dad: record-scratch freeze "YEP. THAT'S MY DAD." · L12 licked + L13 chill: L stamps · L16 orbit: milk launches (pays off L22 milk falls back)
L15 battle: VS / PUN BATTLE · L21 laughed: W stamp · L24 helmet: bruh stare kicker
## Parts
P1 s01–s09 (L0–L8) · P2 s10–s17 (L9–L16) · P3 s18–s26 (L17–L25)
