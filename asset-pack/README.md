# Nubiverse asset pack

One drop-in file with every extra character, outfit, prop and place for the Nubiverse Shorts engine.

| File | What it is |
|---|---|
| `nubiverse_asset_pack.js` | All four packs combined (people, home, outdoor, public places) |
| `ASSET_CATALOG.md` | Every asset id with a description, its options, and how to use it in a shot |
| `catalog_people_*.png` | All 46 characters (base cast + 32 new) |
| `catalog_sets_*.png` | All 31 places by tag (home, outdoor, public, school, city, night), drawn with front layers |

## What's inside
- **Family:** dad, grandpa, teenSister, littleBrother, babySister, aunt, uncle, cousin, plus a second family (mom2, dad2). Mom and Grandma are in the base cast.
- **Community:** lifeguard, coach, doctor, nurse, police, firefighter, cashier, principal, librarian, busDriver, iceCreamVendor, babysitter, neighborGranny, chef, streamer, djKid.
- **More kids:** kidG–kidL.
- **Costumes for ANY character:** `STYLE.swim(name)`, `STYLE.pajamas(name)`, `STYLE.winter(name)`, `STYLE.party(name)`, `STYLE.sports(name, number)`.
- **Home:** livingRoom, kidsBedroom, bathroom, diningRoom, garage, carInside, frontYard, treehouse (plus the base kitchen and backyard).
- **Outdoor:** pool, beach, playground, amusementPark, campsite, snowyStreet, soccerField, downtown, farm.
- **Public:** classroom, cafeteria, library, supermarket, doctorOffice, birthdayParty, movieTheater, arcade, pizzeria (plus the base hallway, gym and concert).
- **Wardrobe and props:** 29 hairstyles and hats, 25 outfits, 10 face extras (beards, mustaches, sunglasses…), 12 accessories, 16 props.

## Use it
In the skill (`.claude/skills/in-this-world-shorts/engine/js/pack_*.js`), the packs load automatically in every new project.
Elsewhere, load `nubiverse_asset_pack.js` after the engine's `core.js`, `characters.js`, `env.js` and `fx_ui.js`, and before `shotkit.js`.

```js
bg: (ctx, T, cam) => envPool(ctx, T, cam, {}),
draw(ctx, T, lt) {
  C(ctx, 'dad', P({ x: 300, y: 1500, s: .8 }), { expr: 'happy', holding: { R: holdMug } }, T);
  C(ctx, 'nubi', P({ x: 640, y: 1500, s: .8 }), { expr: 'excited', style: STYLE.swim('nubi') }, T);
  envPoolFront(ctx, T, cam, {});   // front layers (water, desks, tables, seats) go AFTER the characters
}
```
To regenerate this folder: `node .claude/skills/in-this-world-shorts/scripts/make_catalog.js asset-pack`
