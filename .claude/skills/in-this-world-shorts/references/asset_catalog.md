# Nubiverse asset catalog

Generated from the live engine registries (4 asset packs loaded). Pictures: `catalog_people_*.png`, `catalog_sets_*.png`.

## How to use in a shot
```js
bg: (ctx, T, cam) => PACK_SETS.pool.draw(ctx, T, cam, {}),          // or call envPool(ctx, T, cam, {}) directly
draw(ctx, T, lt) { C(ctx, 'dad', P({ x: 300, y: 1500, s: .8 }), { expr: 'happy', holding: { R: holdMug } }, T);
  C(ctx, 'nubi', P({ x: 640, y: 1500, s: .8 }), { expr: 'excited', style: STYLE.swim('nubi') }, T);   // costume change
  envPoolFront(ctx, T, cam, {}); }                                     // front layers go AFTER the characters
```

## Characters (46)
| id | hair | outfit | size | pack |
|---|---|---|---|---|
| `nubi` | nubi |  | 1 | base |
| `lily` | lily |  | 1 | base |
| `brayden` | brayden |  | 1.06 | base |
| `mom` | mom |  | 1.12 | base |
| `grandma` | grandma |  | 1.02 | base |
| `teacher` | teacher |  | 1.12 | base |
| `popstar` | popstar |  | 1.1 | base |
| `lunchlady` | hairnet |  | 1.1 | base |
| `kidA` | puff |  | 1 | base |
| `kidB` | cap |  | 1 | base |
| `kidC` | pony |  | 1 | base |
| `kidD` | buzz |  | 1 | base |
| `kidE` | curls |  | 1 | base |
| `kidF` | bob |  | 1 | base |
| `dad` | shortSide | polo | 1.14 | pack |
| `grandpa` | grandpa | cardigan | 1.05 | pack |
| `teenSister` | topBun | hoodie | 1.08 | pack |
| `littleBrother` | messy | graphicTee | 0.8 | pack |
| `babySister` | babyTuft | onesie | 0.58 | pack |
| `aunt` | curlyLong | dress | 1.1 | pack |
| `uncle` | backwardsCap | hawaiian | 1.15 | pack |
| `cousin` | braids | overalls | 1 | pack |
| `mom2` | afro | cardigan | 1.12 | pack |
| `dad2` | flatTop | workShirt | 1.16 | pack |
| `lifeguard` | shortSide | tankTop | 1.14 | pack |
| `coach` | cap | tracksuit | 1.14 | pack |
| `doctor` | pony | labCoat | 1.12 | pack |
| `nurse` | shortSide | scrubs | 1.12 | pack |
| `police` | policeCap | policeUniform | 1.15 | pack |
| `firefighter` | fireHelmet | fireJacket | 1.16 | pack |
| `cashier` | pony | apron | 1.1 | pack |
| `principal` | shortSide | suitTie | 1.16 | pack |
| `librarian` | topBun | cardigan | 1.1 | pack |
| `busDriver` | policeCap | workShirt | 1.14 | pack |
| `iceCreamVendor` | paperHat | apron | 1.12 | pack |
| `babysitter` | longWavy | graphicTee | 1.08 | pack |
| `neighborGranny` | curlers | robe | 1 | pack |
| `chef` | chefHat | chefJacket | 1.14 | pack |
| `streamer` | headsetOn | hoodie | 1 | pack |
| `djKid` | backwardsCap | graphicTee | 1 | pack |
| `kidG` | afroPuff | stripedTee | 1 | pack |
| `kidH` | mohawk | jersey | 1 | pack |
| `kidI` | boxBraids | graphicTee | 1 | pack |
| `kidJ` | shortSide | sweaterVest | 1 | pack |
| `kidK` | headscarf | dress | 1 | pack |
| `kidL` | beanie | hoodie | 1 | pack |

## Sets (31)
| id | tags | description | options |
|---|---|---|---|
| `hallway` | school | School hallway: lockers, windows, bulletin board | {posters:false, photo:fn} |
| `concert` | city, night | Concert stage at night with spotlights and a LIVE screen (add concertCrowd in front) |  |
| `backyard` | home, outdoor | Sunny backyard: picket fence, tree, dog house, grass |  |
| `kitchen` | home | Home kitchen: window, cabinets, fridge, counter (also works as a cafeteria serving area) | {night} |
| `gym` | school | School gym / dance: banner, stage with curtains (stage floor y 1190), disco ball | {dim, noLights, banner:'TEXT', bannerC} |
| `livingRoom` | home | Living room: couch (x 66..714, seat top y 1330 → sit with feet at y 1455, x 200..600), TV with animated cartoon (x 770..1170), rug, floor lamp, bookshelf, window, photo frames, console + controllers | {night, tv:false, screen:fn(ctx,x,y,w,h,T), couch:'#hex'} |
| `kidsBedroom` | home | Kid's bedroom: bed with patchwork quilt (top y 1250, sit feet y 1375 at x 90..230), desk + glowing gaming PC (x 780..1060), gaming chair (seat y 1350, x 670), posters, window, toy box, rug, string lights | {night} |
| `bathroom` | home | Bathroom: tiles, sink + arched mirror, towel rack, claw-foot bubble bath (rim y 1240, x 500..1270), rubber duck. FRONT: envBathroomFront(ctx,T,cam,o) after a character at x 760..1000, y 1490 = sitting in the bath | {night} |
| `diningRoom` | home | Dining room: dinner table (top y 1270..1330) with chicken, spaghetti, plates; 3 chairs (x 250/540/830), pendant lamp, window, hutch. FRONT: envDiningRoomFront(ctx,T,cam,o) after characters standing (y 1500) or sitting (feet y 1455) behind the table | {night, table:false} |
| `garage` | home | Garage: roll-up door (x 180..900, o.open 0..1 shows the street), red car (x 680..1440), workbench + pegboard tools, bike, shelves of boxes, tube lights | {night, open:0..1} |
| `carInside` | home, outdoor | Inside the family car looking forward: windshield with road + scenery rushing by, dashboard, wheel, front seats. Kids in the back seat at x ~270 / ~810, feet y 1560, then envCarInsideFront(ctx,T,cam,{belts:[270,810]}). Parent turned around: bg {noSeats:true}, draw parent at x 290, y 1450, then envCarFrontSeats | {night, speed, noSeats, belts:[x]} (belts → envCarInsideFront) |
| `frontYard` | home, outdoor | Front yard / street: colourful houses, lawns, sidewalk (stand y 1500), street (y 1615+), mailbox (x 1010), tree (x 40), car in driveway, street lamps; night = moon, stars, lit windows | {night} |
| `treehouse` | home, outdoor | Backyard treehouse: cabin on a platform (y 880) with sign, rope ladder (x 980..1060), leaves, fence. {inside:true} = plank interior with leafy window, lantern, beanbag (top y 1370, x 80..330), crate table | {night, inside, sign:'TEXT'} |
| `pool` | outdoor | Outdoor swimming pool: far deck w/ loungers, umbrella, lifeguard chair, diving board, water slide; near deck = FLOOR. Call envPoolFront after characters to put them IN the water (waterline y 1310 = waist-deep; o.swimmers:[x] ripples) | {night, sign:'POOL', swimmers:[x], waterline} |
| `beach` | outdoor | Sunny beach: animated waves + foam, boat & island on horizon, lifeguard tower (left), umbrella + towel (right), sandcastle, seagulls. Optional envBeachFront = dunes in the bottom corners | {night} |
| `playground` | outdoor | Park playground: slide (left), swinging swings (right, seats y≈1320), monkey bars + bench (back), sandbox (front right) | {night, swing:false} |
| `amusementPark` | outdoor, city | Fun fair: rotating ferris wheel, roller coaster w/ moving carts, striped big top, snack stand + balloons, string lights (night = glowing bulbs + fireworks) | {night} |
| `campsite` | outdoor, night | Forest campsite (NIGHT by default): stars, moon, tents, log seats (top y≈1428), campfire at x 540 (envCampsiteFront draws it in front; pass fireFront:true) | {day, fire:false, fireX, fireFront} |
| `snowyStreet` | outdoor | Snowy winter street: snow-roofed houses w/ smoking chimneys, snowman (right), sled, street lamp, falling snow. envSnowyStreetFront = near flakes | {night, snow:false} |
| `soccerField` | outdoor, school | Soccer stadium: bleachers w/ cheering fans, ad boards, scoreboard (o.score), floodlights, goal (left), pitch lines | {night, score:'2 - 1', home, away, clock, cheer, ball:false} |
| `downtown` | outdoor, city | City street: skyline, PIZZA / TOYS / ICE CREAM / BOOKS shops, traffic light, bus stop, crosswalk; sidewalk = FLOOR (road below) | {night, car} |
| `farm` | outdoor | Farm: red barn + silo, cow, chickens, hay bales, fence, crop rows, red tractor, turning windpump | {night} |
| `classroom` | school | Classroom: chalkboard, alphabet strip, clock, cubbies, teacher desk w/ globe; FRONT envClassroomFront = student desks at o.desks (kids look seated) | {board:'TEXT', doodles:false} front:{desks:[380,700]} |
| `cafeteria` | school | School cafeteria: window, menu board, serving line with food + sneeze guard, bins; FRONT envCafeteriaFront = long lunch table + bench with trays | {board:'LUNCH MENU', menu:['PIZZA',...]} front:{trays:[380,700]} |
| `library` | school, public | Library: tall bookshelves, arched window, QUIET sign, low shelf + globe, reading table + lamp, beanbags, rug | {sign:'QUIET PLEASE'} |
| `supermarket` | public | Supermarket aisle: freezers with glow, product shelves, SALE signs, hanging aisle sign, cart, checkout lane; FRONT envSupermarketFront = checkout counter at o.x | {sign:'SNACKS', aisle:5} front:{x:700} |
| `doctorOffice` | public | Doctor's office: cabinets, eye chart, height chart, exam bed with paper, poster, window, sink, scale | {poster:'WASH YOUR HANDS!'} |
| `birthdayParty` | public, home | Birthday party room: banner, bunting, bobbing balloons, presents, cake table, confetti; FRONT envBirthdayPartyFront = cake table at o.x | {text:'HAPPY BIRTHDAY!', falling} front:{x:540, candles:5, lit:false} |
| `movieTheater` | public, night | Movie theater: glowing screen, curtains, projector beam, back seat row; FRONT envMovieTheaterFront = seat backs so kids look seated | {screen:'#hex'/fn, text:'THE END', dark:.5} front:{popcorn:[540]} |
| `arcade` | public, night | Arcade: neon ARCADE sign, blinking game cabinets, claw machine, prize counter + plush wall, neon carpet | {sign:'ARCADE'} |
| `pizzeria` | public | Pizzeria: brick oven with fire, PIZZA neon, menu board, counter with pizza display; FRONT envPizzeriaFront = checkered table w/ pizza (or kind:counter) | {board:'MENU', menu:[['PIZZA','$3']], sign:'PIZZA'} front:{x:540, kind:'table'/'counter'} |

**Front layers** (call after drawing characters): `envBathroomFront`, `envDiningRoomFront`, `envCarInsideFront`, `envClassroomFront`, `envCafeteriaFront`, `envSupermarketFront`, `envBirthdayPartyFront`, `envMovieTheaterFront`, `envPizzeriaFront`

## Wardrobe and props
- **Hair and hats (29):** `bald`, `grandpa`, `shortSide`, `messy`, `flatTop`, `topBun`, `braids`, `boxBraids`, `afro`, `afroPuff`, `mohawk`, `pigtails`, `babyTuft`, `longWavy`, `longStraight`, `curlyLong`, `curlers`, `headscarf`, `hijab`, `backwardsCap`, `beanie`, `chefHat`, `policeCap`, `fireHelmet`, `sunHat`, `paperHat`, `partyHat`, `nightcap`, `headsetOn` (plus the base styles)
- **Outfits (25):** `polo`, `hoodie`, `graphicTee`, `stripedTee`, `suitTie`, `labCoat`, `scrubs`, `policeUniform`, `fireJacket`, `apron`, `hawaiian`, `overalls`, `jersey`, `onesie`, `cardigan`, `tankTop`, `swimTrunksTop`, `pajamas`, `winterCoat`, `tracksuit`, `dress`, `robe`, `chefJacket`, `workShirt`, `sweaterVest`
- **Face extras (10):** `beard`, `mustache`, `bigMustache`, `stubble`, `blushMakeup`, `sunglasses`, `squareGlasses`, `pacifier`, `wrinkles`, `heavyLids`
- **Accessories (12):** `tie`, `bowtie`, `whistle`, `stethoscope`, `badge`, `nameTag`, `scarf`, `neckerchief`, `backpack`, `necklace`, `headphones`, `medal`
- **Costume helpers (any character, per shot via face.style):** `STYLE.isGirl(name)`, `STYLE.swim(name)`, `STYLE.beach(name)`, `STYLE.pajamas(name)`, `STYLE.winter(name)`, `STYLE.party(name)`, `STYLE.sports(name)`, `STYLE.pacifier(name)`
- **Props (16, for face.holding):** `holdPhone`, `holdCane`, `holdMug`, `holdBabyBottle`, `holdBall`, `holdIceCream`, `holdBalloon`, `holdPizzaSlice`, `holdGameController`, `holdPopcorn`, `holdShoppingBag`, `holdFlashlight`, `holdPresent`, `holdSpatula`, `holdWand`, `holdToothbrush`

