// nubiverse_asset_pack.js — ALL asset packs in one file (pack_people.js, pack_home.js, pack_outdoor.js, pack_public.js).
// Load after engine/js/{core,characters,env,fx_ui}.js and before shotkit.js. Generated 2026-11-09.

// ======================= pack_people.js =======================
// pack_people.js — PEOPLE asset pack: extra cast (family, community helpers, more classmates), hair styles & hats,
// outfits, face extras, accessories, costume helpers (STYLE.*) and hand props (hold*). Loads after characters.js.
//
// ============================================================================================================
// QUICK REFERENCE (everything below is global; use it in shots without reading the code)
// ============================================================================================================
// CHARACTERS  drawCharacter(ctx, '<id>', pose, face, T)
//   FAMILY (Nubi's family + relatives; base cast already has mom, grandma)
//     dad            brown side-part hair, beard, square glasses, blue polo + khakis
//     grandpa        bald top + white side tufts, big white mustache, glasses, brown cardigan (tall 1.05; lean pose ~.08 for "bent")
//     teenSister     older sister (tall 1.08): messy top bun, lavender hoodie, half-lidded "bored" eyes (heavyLids)
//     littleBrother  little brother (tall .8): messy hair, green dino tee, shorts
//     babySister     baby (tall .58): pink onesie + bib, tiny hair tuft with bow (add pacifier: style:STYLE.pacifier('babySister'))
//     aunt           long curly hair, yellow polka-dot sundress, necklace, blush
//     uncle          backwards red cap, teal hawaiian shirt, khaki shorts, stubble
//     cousin         kid girl: two braids with beads, yellow tee + denim overalls
//     mom2           second family mom: big afro, orange cardigan, necklace (dark skin)
//     dad2           second family dad: flat-top, mustache, light-blue work shirt + navy tie (dark skin)
//   COMMUNITY
//     lifeguard      white tank w/ red cross, red swim shorts, sunglasses, whistle, barefoot
//     coach          red cap, blue tracksuit, whistle, mustache
//     doctor         ponytail, white lab coat over blue scrubs, stethoscope, glasses
//     nurse          teal scrubs (short sleeves), name tag
//     police         navy uniform, police cap with badge, belt, chest badge
//     firefighter    red helmet with shield, tan jacket with reflective stripes
//     cashier        ponytail, green store apron, name tag
//     principal      grey hair, glasses, mustache, dark suit + red tie
//     librarian      bun with pencil, glasses, green cardigan, necklace
//     busDriver      blue driver cap, light-blue work shirt with patch, tie, beard
//     iceCreamVendor white paper hat, pink-striped apron, curly mustache
//     babysitter     teen with long wavy hair, pink heart tee
//     neighborGranny hair curlers, pink polka-dot robe, glasses, wrinkles
//     chef           chef hat, double-breasted white jacket, red neckerchief, mustache
//     streamer       kid gamer: headset on head (with mic), purple hoodie with bolt
//     djKid          kid DJ: backwards cap, sunglasses, headphones around neck, black graphic tee
//   MORE KIDS (classmates)
//     kidG  afro puff + pink tie, yellow/pink striped tee          kidH  mohawk with blue tips, red #7 jersey
//     kidI  long box braids with beads, teal star tee              kidJ  ginger side-part, glasses + freckles, sweater vest, backpack
//     kidK  pink headscarf (hijab), blue long-sleeve polka dress   kidL  yellow beanie with pom-pom, red hoodie
//
// HAIR_STYLES (c.hair = '<name>'; each draws 'back' + 'front' layers). Hats honour c.hairUnder (hair drawn under the hat).
//   hair:  bald, grandpa, shortSide, messy, flatTop, topBun (c.bunTie, c.bunPencil, c.bunStrands), braids (c.beadC),
//          boxBraids (c.beadC), afro, afroPuff (c.puffTie), mohawk (c.tipC), pigtails (c.tieC), babyTuft (c.bowC),
//          longWavy, longStraight, curlyLong, curlers (c.curlerC, c.curlerC2), headscarf (alias hijab; c.scarfC)
//   hats:  backwardsCap (c.capC), beanie (c.capC, c.pomC), chefHat, policeCap (c.capC, c.badgeC), fireHelmet (c.helmetC),
//          sunHat (c.hatC, c.ribbonC), paperHat (c.hatC, c.stripeC), partyHat (c.partyC), nightcap (c.capC), headsetOn (c.headsetC)
// OUTFITS (c.outfit = '<name>'): suitTie (c.tieC), labCoat (c.inner = scrubs colour), policeUniform, fireJacket, apron
//   (c.apronC, c.apronStripes), hawaiian (c.flowerC), overalls (pants colour = denim), jersey (c.number, c.trimC), onesie
//   (c.dotC, c.bibC), cardigan (V-neck, c.inner), tankTop (c.crossC), swimTrunksTop (boys: bare chest + trunks; girls:
//   c.swimC one-piece; c.rashGuard = full-cover), pajamas (c.pjPattern stars|dots|hearts|moons|stripes, c.pjDot), winterCoat
//   (puffy, c.furC), tracksuit (c.stripeC), dress (c.dotC, c.sashC, c.dressStraps, c.collarC), polo (c.collarC), hoodie
//   (c.graphic), graphicTee (c.graphic dino|star|heart|bolt|smile|planet, c.graphicC), stripedTee (c.stripeC), robe (c.dotC,
//   c.beltC), chefJacket, scrubs, workShirt (c.patchC), sweaterVest (c.vestC)
// FACE_EXTRAS (c.facial = '<name>' | [names]): beard (c.beardC), mustache (c.mustacheStyle 'curly'), bigMustache, stubble,
//   blushMakeup, sunglasses (c.shadesC), pacifier (c.paciC), wrinkles, heavyLids (bored half-closed lids on calm expressions),
//   squareGlasses (c.glassesC). Mouth is always drawn on top of beards/mustaches.
// ACCESSORIES (c.acc = [names]): tie (c.tieC), whistle (c.lanyardC), stethoscope, badge (c.badgeShape 'shield'|'star'),
//   nameTag (c.tagC), scarf (c.mufflerC, c.mufflerStripe), backpack (c.bagC), necklace (c.necklaceC), headphones (c.headphoneC),
//   bowtie (c.tieC), neckerchief (c.kerchiefC), medal
// STYLE (per-shot costume: drawCharacter(ctx, 'nubi', pose, { expr:'happy', style: STYLE.swim('nubi') }, T))
//   STYLE.swim(name[, over])          swimwear (boys trunks, girls one-piece, headscarf wearers full-cover rash guard), barefoot
//   STYLE.pajamas(name[, over])       patterned PJs + slippers; over = { nightcap:true } adds a nightcap
//   STYLE.winter(name[, over])        puffy coat + scarf + beanie (hair kept under the beanie)
//   STYLE.party(name[, over])         party hat on top of the usual hair
//   STYLE.sports(name, number[, over])jersey with number + shorts; over = { color:'#EE384A' }
//   STYLE.beach(name)  swim + sunglasses        STYLE.pacifier(name)  adds a pacifier
//   STYLE.isGirl(name) helper. All helpers take an optional last object merged on top (any CAST field).
// PROPS for face.holding {L: fn, R: fn} (hand space). Each works bare (holdPhone) or as a factory with options
//   (holdBalloon('#FF5B9B'), holdPresent({ color:'#30CE65' }), holdFlashlight(false) = off):
//   holdPhone, holdCane, holdMug, holdBabyBottle, holdBall ('basket'|'soccer'|'beach'), holdIceCream, holdBalloon(colour),
//   holdPizzaSlice, holdGameController, holdPopcorn, holdShoppingBag, holdFlashlight, holdPresent, holdSpatula, holdWand,
//   holdToothbrush. Cups / cones / balloons / bags / canes auto-orient to world-up (gravity) whatever the arm angle.
// ============================================================================================================
'use strict';

// ---------------- shared helpers (pp_ prefix = pack_people) ----------------
const PP_HATS = new Set(['cap', 'hairnet', 'backwardsCap', 'beanie', 'chefHat', 'policeCap', 'fireHelmet', 'sunHat', 'paperHat', 'partyHat', 'nightcap', 'headsetOn']);
// how far (px, head space) each hair style rises above the head top — used to seat party hats
const PP_HAT_LIFT = { brayden: 62, mom: 30, teacher: 50, grandma: 50, popstar: 44, hairnet: 46, puff: 4, curls: 14, nubi: 24, lily: 18, pony: 10, bob: 14,
  buzz: 4, cap: 34, grandpa: 0, bald: 0, topBun: 66, afro: 76, afroPuff: 100, mohawk: 84, flatTop: 56, messy: 30, curlyLong: 32, curlers: 30,
  babyTuft: 30, longWavy: 22, longStraight: 18, boxBraids: 16, braids: 14, pigtails: 18, shortSide: 18, headscarf: 24 };

function pp_ox(hw, view) { return view === 'side' ? -hw * .1 : view === 'q34' ? -hw * .05 : 0; }        // drawHair's x offset
function pp_fxo(hw, view) { return view === 'side' ? hw * .2 : view === 'q34' ? hw * .1 : 0; }         // face centre offset
function pp_nf(view) { return view === 'side' || view === 'back'; }                                // no front details
function pp_tcx(tw, view) { return view === 'side' ? tw * .18 : view === 'q34' ? tw * .07 : 0; }       // torso detail centre
function pp_shape(ctx, s) {
  if (typeof s === 'function') { ctx.beginPath(); s(ctx); return; }
  if (s.rr) { rr(ctx, s.rr[0], s.rr[1], s.rr[2], s.rr[3], s.rr[4]); return; }
  ctx.beginPath(); if (s.length === 3) ctx.arc(s[0], s[1], s[2], 0, TAU); else ctx.ellipse(s[0], s[1], s[2], s[3], s[4] || 0, 0, TAU);
}
// fill several shapes as ONE outlined blob (outline only on the outside)
function pp_union(ctx, shapes, fill, lw = 8) {
  ctx.save(); ctx.lineJoin = 'round'; ctx.strokeStyle = OUTLINE; ctx.lineWidth = lw * 2;
  for (const s of shapes) { pp_shape(ctx, s); ctx.stroke(); }
  ctx.fillStyle = fill; for (const s of shapes) { pp_shape(ctx, s); ctx.fill(); }
  ctx.restore();
}
// outlined thick line (cartoon cord / strap)
function pp_cord(ctx, pathFn, col, w = 8) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pathFn(ctx); ctx.strokeStyle = OUTLINE; ctx.lineWidth = w + 8; ctx.stroke();
  ctx.beginPath(); pathFn(ctx); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
  ctx.restore();
}
function pp_eyes(fx, fy, view) { const side = view === 'side', sep = side ? 0 : 50 * (view === 'q34' ? .92 : 1); return { ey: fy - 20, xs: side ? [fx + 20] : [fx - sep, fx + sep] }; }
function pp_mouth(fx, fy, view) { return { mx: fx + (view === 'side' ? 26 : 0), my: fy + 48 }; }
// crescent hair cap covering the top of the head
function pp_crescent(ctx, hw, top, depth, col, lw = 8, peak = -18, inner = 16) {
  ctx.beginPath(); ctx.moveTo(-hw / 2 - 6, top + depth); ctx.quadraticCurveTo(-hw / 2, top + peak, 0, top + peak + 2);
  ctx.quadraticCurveTo(hw / 2, top + peak, hw / 2 + 6, top + depth); ctx.quadraticCurveTo(0, top + inner, -hw / 2 - 6, top + depth); ctx.closePath();
  fillStroke(ctx, col, lw);
}
// hair drawn under a hat: c.hairUnder, or the hat's default
function pp_under(ctx, c, layer, hw, hh, view, def) {
  const st = c.hairUnder || def; if (!st || PP_HATS.has(st)) return false;
  ctx.save(); ctx.translate(-pp_ox(hw, view), 0);
  drawHair(ctx, Object.assign({}, c, { hair: st, hairUnder: null }), layer, hw, hh, view);
  ctx.restore(); return true;
}
function pp_sideTufts(ctx, c, hw, top, y0 = 40, y1 = 76) {
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * (hw / 2 + 6), top + y0); ctx.lineTo(s * (hw / 2 + 8), top + y1); ctx.lineTo(s * (hw / 2 - 12), top + y1 - 8);
    ctx.lineTo(s * (hw / 2 - 14), top + y0); ctx.closePath(); fillStroke(ctx, c.hairC, 6); }
}
function pp_shield(ctx, x, y, s, col) {
  ctx.beginPath(); ctx.moveTo(x - s, y - s * .8); ctx.quadraticCurveTo(x, y - s * 1.15, x + s, y - s * .8); ctx.lineTo(x + s * .9, y + s * .1);
  ctx.quadraticCurveTo(x + s * .6, y + s * .8, x, y + s * 1.1); ctx.quadraticCurveTo(x - s * .6, y + s * .8, x - s * .9, y + s * .1); ctx.closePath();
  fillStroke(ctx, col, Math.max(4, s * .22));
}
function pp_text(ctx, s, x, y, size, fill, lw = 7) {
  ctx.save(); ctx.font = size + 'px "Lilita One"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = OUTLINE; ctx.strokeText(s, x, y); }
  ctx.fillStyle = fill; ctx.fillText(s, x, y); ctx.restore();
}
function pp_body(ctx, x, y, tw, h, col, ext = 6) { box(ctx, x, y, tw, h + ext, 22, col, 8); }
function pp_clipBody(ctx, x, y, tw, h, ext = 6) { rr(ctx, x, y, tw, h + ext, 22); ctx.clip(); }
function pp_collar(ctx, cx, y, col, span = 44, drop = 34) {   // two pointed shirt-collar flaps
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx, y + 18); ctx.lineTo(cx + s * span, y + 8); ctx.lineTo(cx + s * (span - 8), y + drop + 8); ctx.closePath(); fillStroke(ctx, col, 6); }
}
function pp_graphic(ctx, kind, x, y, s = 1, col = '#2E9E5B') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  switch (kind) {
    case 'dino':
      circle(ctx, 0, 0, 46, '#FFFFFF', 6);
      ctx.beginPath(); ctx.moveTo(-38, 18); ctx.quadraticCurveTo(-24, 0, -12, 2); ctx.lineTo(-10, -14); ctx.quadraticCurveTo(-6, -32, 12, -30);
      ctx.lineTo(30, -26); ctx.quadraticCurveTo(36, -14, 24, -10); ctx.lineTo(10, -10); ctx.quadraticCurveTo(14, 4, 10, 14);
      ctx.lineTo(12, 30); ctx.lineTo(2, 30); ctx.lineTo(0, 20); ctx.lineTo(-8, 20); ctx.lineTo(-8, 30); ctx.lineTo(-18, 30); ctx.lineTo(-18, 18); ctx.closePath();
      fillStroke(ctx, col, 4); circle(ctx, 14, -22, 3.5, OUTLINE);
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-14 + i * 0, -6 - i * 9); ctx.lineTo(-22 + i * 2, -10 - i * 9); ctx.lineTo(-12 + i * 2, -14 - i * 9); ctx.closePath(); fillStroke(ctx, shade(col, .35), 3); }
      break;
    case 'star': starPath(ctx, 0, 2, 40, 18); fillStroke(ctx, col, 6); break;
    case 'heart': heartPath(ctx, 0, 6, 46); fillStroke(ctx, col, 6); break;
    case 'bolt': ctx.beginPath(); ctx.moveTo(8, -42); ctx.lineTo(-24, 6); ctx.lineTo(-2, 6); ctx.lineTo(-10, 42); ctx.lineTo(24, -8); ctx.lineTo(2, -8); ctx.closePath(); fillStroke(ctx, col, 6); break;
    case 'smile': circle(ctx, 0, 0, 36, col, 6); circle(ctx, -12, -8, 5, OUTLINE); circle(ctx, 12, -8, 5, OUTLINE);
      ctx.lineWidth = 6; ctx.strokeStyle = OUTLINE; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 2, 18, .2, Math.PI - .2); ctx.stroke(); break;
    case 'planet': circle(ctx, 0, 0, 28, col, 6); ctx.save(); ctx.rotate(-.35); ctx.beginPath(); ctx.ellipse(0, 0, 50, 13, 0, 0, TAU);
      ctx.lineWidth = 12; ctx.strokeStyle = OUTLINE; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#FFD447'; ctx.stroke(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(-60, -60, 120, 58); ctx.clip(); circle(ctx, 0, 0, 28, col, 6); ctx.restore(); break;
  }
  ctx.restore();
}
function pp_tie(ctx, cx, y, col, len = 112) {
  ctx.beginPath(); ctx.moveTo(cx - 15, y + 14); ctx.lineTo(cx + 15, y + 14); ctx.lineTo(cx + 10, y + 36); ctx.lineTo(cx - 10, y + 36); ctx.closePath(); fillStroke(ctx, shade(col, -.12), 6);
  ctx.beginPath(); ctx.moveTo(cx - 10, y + 36); ctx.lineTo(cx - 20, y + 20 + len); ctx.lineTo(cx, y + 42 + len); ctx.lineTo(cx + 20, y + 20 + len); ctx.lineTo(cx + 10, y + 36); ctx.closePath(); fillStroke(ctx, col, 6);
  ctx.save(); ctx.clip(); ctx.strokeStyle = shade(col, -.22); ctx.lineWidth = 6;
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(cx - 30, y + 40 + i * 24); ctx.lineTo(cx + 30, y + 16 + i * 24); ctx.stroke(); } ctx.restore();
}
function pp_pattern(ctx, kind, x0, y0, w, h, col, sz = 1) {   // repeating motif fill inside the current clip
  ctx.save();
  if (kind === 'stripes') { ctx.fillStyle = col; for (let xx = x0 + 10; xx < x0 + w; xx += 34) ctx.fillRect(xx, y0, 13, h); ctx.restore(); return; }
  for (let r = 0, yy = y0 + 18; yy < y0 + h + 20; r++, yy += 40 * sz) for (let xx = x0 + 14 + (r % 2) * 22 * sz; xx < x0 + w + 20; xx += 44 * sz) {
    if (kind === 'stars') { starPath(ctx, xx, yy, 11 * sz, 5 * sz); fillStroke(ctx, col, 0); }
    else if (kind === 'hearts') { heartPath(ctx, xx, yy, 13 * sz); fillStroke(ctx, col, 0); }
    else if (kind === 'moons') { ctx.beginPath(); ctx.arc(xx, yy, 10 * sz, .6, TAU - .6); ctx.arc(xx + 7 * sz, yy - 2 * sz, 8 * sz, TAU - .9, .9, true); ctx.closePath(); fillStroke(ctx, col, 0); }
    else circle(ctx, xx, yy, 7 * sz, col);
  }
  ctx.restore();
}

// ============================================================================================================
// HAIR STYLES & HATS  — (ctx, c, layer, hw, hh, view, top)
// ============================================================================================================
HAIR_STYLES.bald = (ctx, c, layer, hw, hh, view, top) => {
  if (layer !== 'front') return;
  ctx.save(); ctx.globalAlpha *= .4; ellipse(ctx, -hw * .2, top + 24, 36, 13, '#FFFFFF', 0, -.25); ctx.restore();
};
HAIR_STYLES.grandpa = (ctx, c, layer, hw, hh, view, top) => {
  if (layer !== 'front') return;
  HAIR_STYLES.bald(ctx, c, layer, hw, hh, view, top);
  for (const s of (view === 'side' ? [-1] : [-1, 1])) {
    const bx = s * (hw / 2 + 2);
    pp_union(ctx, [[bx - s * 10, top + 50, 18], [bx, top + 70, 24], [bx + s * 8, top + 98, 26], [bx + s * 2, top + 124, 19]], c.hairC, 7);
  }
  pp_cord(ctx, k => { k.moveTo(-6, top + 2); k.quadraticCurveTo(-4, top - 26, 14, top - 26); k.quadraticCurveTo(26, top - 22, 18, top - 12); }, c.hairC, 6);
};
HAIR_STYLES.shortSide = (ctx, c, layer, hw, hh, view, top) => {
  if (layer !== 'front') return;
  const col = c.hairC;
  ctx.beginPath(); ctx.moveTo(-hw / 2 - 6, top + 72); ctx.lineTo(-hw / 2 - 8, top + 24);
  ctx.quadraticCurveTo(-hw / 2 - 4, top - 24, -hw * .05, top - 24); ctx.quadraticCurveTo(hw / 2 + 8, top - 26, hw / 2 + 8, top + 28);
  ctx.lineTo(hw / 2 + 6, top + 72); ctx.lineTo(hw / 2 - 10, top + 66); ctx.lineTo(hw / 2 - 12, top + 40);
  ctx.quadraticCurveTo(hw * .16, top + 20, -hw * .12, top + 46); ctx.quadraticCurveTo(-hw * .3, top + 28, -hw / 2 + 12, top + 40);
  ctx.lineTo(-hw / 2 + 10, top + 68); ctx.closePath(); fillStroke(ctx, col, 8);
  ctx.lineCap = 'round'; ctx.strokeStyle = shade(col, -.3); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(-hw * .24, top - 14); ctx.quadraticCurveTo(-hw * .2, top + 10, -hw * .13, top + 30); ctx.stroke();
  ctx.strokeStyle = shade(col, .25); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(hw * .0, top - 10); ctx.quadraticCurveTo(hw * .2, top - 12, hw * .32, top + 2); ctx.stroke();
};
HAIR_STYLES.messy = (ctx, c, layer, hw, hh, view, top) => {
  if (layer !== 'front') return;
  const col = c.hairC;
  ctx.beginPath(); ctx.moveTo(-hw / 2 - 6, top + 76);
  const N = 10;
  for (let i = 0; i <= N; i++) { const a = Math.PI + i / N * Math.PI, r = 1 + (i % 2 ? .1 + .16 * Math.abs(Math.sin(a)) : 0);
    ctx.lineTo(Math.cos(a) * (hw / 2 + 8) * r, top + 46 + Math.sin(a) * 74 * r); }
  ctx.lineTo(hw / 2 + 6, top + 76);
  const B = 8; for (let i = 0; i <= B; i++) ctx.lineTo(hw / 2 - 10 - i * (hw - 20) / B, top + (i % 2 ? 70 : 40) - (i === B ? 0 : 0));
  ctx.closePath(); fillStroke(ctx, col, 8);
  ctx.strokeStyle = shade(col, .25); ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-hw * .22, top - 6); ctx.quadraticCurveTo(0, top - 18, hw * .18, top - 6); ctx.stroke();
};
HAIR_STYLES.flatTop = (ctx, c, layer, hw, hh, view, top) => {
  if (layer !== 'front') return;
  const col = c.hairC;
  ctx.beginPath(); ctx.moveTo(-hw / 2 - 6, top + 60); ctx.lineTo(-hw / 2 - 4, top - 40); ctx.quadraticCurveTo(-hw / 2 - 4, top - 60, -hw / 2 + 16, top - 60);
  ctx.lineTo(hw / 2 - 16, top - 60); ctx.quadraticCurveTo(hw / 2 + 4, top - 60, hw / 2 + 4, top - 40); ctx.lineTo(hw / 2 + 6, top + 60);
  ctx.lineTo(hw / 2 - 10, top + 54); ctx.lineTo(hw / 2 - 14, top + 26); ctx.lineTo(-hw / 2 + 14, top + 26); ctx.lineTo(-hw / 2 + 10, top + 54); ctx.closePath();
  fillStroke(ctx, col, 8);
  ctx.strokeStyle = shade(col, .22); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-hw * .3, top - 40); ctx.lineTo(hw * .3, top - 40); ctx.stroke();
};
HAIR_STYLES.topBun = (ctx, c, layer, hw, hh, view, top) => {
  const col = c.hairC;
  if (layer === 'back') {
    if (c.bunPencil) { ctx.save(); ctx.translate(0, top - 44); ctx.rotate(-.55); box(ctx, -64, -7, 128, 14, 4, '#FFC83D', 5); ctx.beginPath(); ctx.moveTo(64, -7); ctx.lineTo(80, 0); ctx.lineTo(64, 7); ctx.closePath(); fillStroke(ctx, '#F2D3A0', 4); ctx.restore(); }
    pp_union(ctx, [[0, top - 44, 42], [-22, top - 30, 26], [22, top - 30, 26]], col, 8);
    ctx.strokeStyle = shade(col, .22); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, top - 44, 24, Math.PI * 1.1, Math.PI * 1.75); ctx.stroke();
    if (c.bunStrands) { ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(18, top - 80); ctx.quadraticCurveTo(34, top - 96, 44, top - 84); ctx.moveTo(-14, top - 82); ctx.quadraticCurveTo(-30, top - 100, -40, top - 88); ctx.stroke(); }
  } else {
    ctx.beginPath(); ctx.moveTo(-hw / 2 - 6, top + 56); ctx.quadraticCurveTo(-hw / 2, top - 18, 0, top - 16); ctx.quadraticCurveTo(hw / 2, top - 18, hw / 2 + 6, top + 56);
    ctx.quadraticCurveTo(hw * .3, top + 18, 0, top + 20); ctx.quadraticCurveTo(-hw * .3, top + 18, -hw / 2 - 6, top + 56); ctx.closePath(); fillStroke(ctx, col, 8);
    ctx.strokeStyle = shade(col, .22); ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * hw * .3, top + 18); ctx.quadraticCurveTo(s * hw * .18, top - 2, s * 10, top - 10); ctx.stroke(); }
    box(ctx, -28, top - 30, 56, 20, 9, c.bunTie || '#FF5B9B', 6);
    if (c.bunStrands) for (const s of [-1, 1]) pp_cord(ctx, k => { k.moveTo(s * (hw / 2 - 6), top + 40); k.quadraticCurveTo(s * (hw / 2 + 6), top + 80, s * (hw / 2 - 4), top + 112); }, col, 6);
  }
};
HAIR_STYLES.braids = (ctx, c, layer, hw, hh, view, top) => {
  if (layer !== 'front') return;
  const col = c.hairC;
  for (const s of (view === 'side' ? [-1] : [-1, 1])) {
    const bx = s * (hw / 2 + 2), y0 = top + 84;
    for (let k = 0; k < 6; k++) ellipse(ctx, bx + (k % 2 ? s * 3 : -s * 3), y0 + k * 28, 20, 18, col, 6);
    ctx.beginPath(); ctx.moveTo(bx - 10, y0 + 5 * 28 + 26); ctx.lineTo(bx, y0 + 5 * 28 + 52); ctx.lineTo(bx + 10, y0 + 5 * 28 + 26); ctx.closePath(); fillStroke(ctx, col, 5);
    circle(ctx, bx, y0 + 5 * 28 + 22, 11, c.beadC || '#FF5B9B', 5);
  }
  pp_crescent(ctx, hw, top, 60, col, 8, -18, 20);
  ctx.strokeStyle = shade(col, -.4); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, top - 14); ctx.lineTo(0, top + 18); ctx.stroke();
};
HAIR_STYLES.boxBraids = (ctx, c, layer, hw, hh, view, top) => {
  const col = c.hairC, bead = c.beadC || '#FFD447';
  if (layer === 'back') {
    rr(ctx, -hw / 2 - 30, top - 12, hw + 60, hh + 100, 52); fillStroke(ctx, col, 8);
    ctx.save(); rr(ctx, -hw / 2 - 30, top - 12, hw + 60, hh + 100, 52); ctx.clip(); ctx.strokeStyle = shade(col, .2); ctx.lineWidth = 4;
    for (let xx = -hw / 2 - 20; xx < hw / 2 + 30; xx += 20) { ctx.beginPath(); ctx.moveTo(xx, top); ctx.lineTo(xx, top + hh + 100); ctx.stroke(); }
    ctx.restore();
    return;
  }
  for (const s of (view === 'side' ? [-1] : [-1, 1])) for (let j = 0; j < 2; j++) {
    const x = s * (hw / 2 - 2 + j * 18), len = hh - 10 + j * 18;
    box(ctx, x - 9, top + 60, 18, len, 9, col, 5);
    ctx.strokeStyle = shade(col, .25); ctx.lineWidth = 3;
    for (let k = 0; k < len - 20; k += 16) { ctx.beginPath(); ctx.moveTo(x - 6, top + 70 + k); ctx.lineTo(x + 6, top + 78 + k); ctx.stroke(); }
    circle(ctx, x, top + 66 + len, 9, j ? '#FFFFFF' : bead, 4);
  }
  pp_crescent(ctx, hw, top, 64, col, 8, -20, 22);
  ctx.strokeStyle = shade(col, .25); ctx.lineWidth = 4;
  for (const s of [-1, 1]) for (let k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(s * k * 22, top + 22); ctx.quadraticCurveTo(s * k * 30, top, s * k * 26, top - 14); ctx.stroke(); }
};
HAIR_STYLES.afro = (ctx, c, layer, hw, hh, view, top) => {
  const col = c.hairC;
  if (layer === 'back') {
    const cy = top + hh * .34, R = hw * .66, sh = [[0, cy, R * .92]];
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; sh.push([Math.cos(a) * R * .88, cy + Math.sin(a) * R * .88 * .92, R * .2]); }
    pp_union(ctx, sh, col, 8);
    return;
  }
  const sh = [];
  for (let i = 0; i < 8; i++) { const x = -hw / 2 + 4 + i * (hw - 8) / 7; sh.push([x, top + 22 + Math.pow(Math.abs(x) / (hw / 2), 2) * 26, 20]); }
  pp_union(ctx, sh, col, 7); pp_shape(ctx, { rr: [-hw / 2 - 2, top - 24, hw + 4, 50, 22] }); ctx.fillStyle = col; ctx.fill();
};
HAIR_STYLES.afroPuff = (ctx, c, layer, hw, hh, view, top) => {
  const col = c.hairC;
  if (layer === 'back') {
    const cy = top - 52, R = 66, sh = [[0, cy, R * .9]];
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; sh.push([Math.cos(a) * R * .82, cy + Math.sin(a) * R * .82, R * .26]); }
    pp_union(ctx, sh, col, 8);
    return;
  }
  pp_crescent(ctx, hw, top, 46, col, 8, -16, 18);
  ctx.strokeStyle = shade(col, .25); ctx.lineWidth = 4; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * hw * .36, top + 22); ctx.quadraticCurveTo(s * hw * .2, top, s * 12, top - 8); ctx.stroke(); }
  box(ctx, -34, top - 26, 68, 22, 10, c.puffTie || '#FF5B9B', 6);
};
HAIR_STYLES.mohawk = (ctx, c, layer, hw, hh, view, top) => {
  if (layer !== 'front') return;
  const col = c.hairC;
  ctx.save(); ctx.globalAlpha *= .45; pp_crescent(ctx, hw, top, 46, col, 0, -10, 20); ctx.restore();
  const path = k => {
    k.beginPath();
    if (view === 'side') {
      k.moveTo(-hw / 2 - 4, top + 50); const xs = [-hw / 2 - 18, -hw * .32, -hw * .18, -hw * .02, hw * .14, hw * .28];
      xs.forEach((x, i) => { k.lineTo(x, top - 56 - (i % 2) * 6 + i * 4); k.lineTo(x + hw * .08, top - 10 + i * 2); }); k.lineTo(hw * .38, top + 30); k.closePath();
    } else {
      const pts = [[-44, 30], [-56, -20], [-48, -76], [-24, -52], [-16, -100], [0, -66], [16, -108], [24, -54], [48, -82], [56, -22], [44, 30]];
      pts.forEach(([x, y], i) => i ? k.lineTo(x, top + y) : k.moveTo(x, top + y)); k.closePath();
    }
  };
  path(ctx); fillStroke(ctx, col, 8);
  if (c.tipC) { ctx.save(); path(ctx); ctx.clip(); ctx.fillStyle = c.tipC; ctx.fillRect(-hw, top - 120, hw * 2, 70); ctx.restore(); path(ctx); fillStroke(ctx, null, 8); }
};
HAIR_STYLES.pigtails = (ctx, c, layer, hw, hh, view, top) => {
  const col = c.hairC, tie = c.tieC || '#FF5B9B';
  if (layer === 'back') {
    for (const s of [-1, 1]) { ctx.save(); ctx.translate(s * (hw / 2 + 2), top + 50); ctx.rotate(-s * .75);
      pp_union(ctx, [[0, 58, 30, 58], [s * 4, 112, 16, 22]], col, 8); ctx.restore(); }
    return;
  }
  ctx.beginPath(); ctx.moveTo(-hw / 2 - 10, top + 76); ctx.quadraticCurveTo(-hw / 2 - 8, top - 22, 0, top - 20); ctx.quadraticCurveTo(hw / 2 + 8, top - 22, hw / 2 + 10, top + 76);
  ctx.lineTo(hw / 2 - 12, top + 70); ctx.lineTo(hw / 2 - 14, top + 46);
  for (let i = 1; i <= 6; i++) ctx.lineTo(hw / 2 - 14 - i * (hw - 28) / 6, top + (i % 2 ? 56 : 44));
  ctx.lineTo(-hw / 2 + 12, top + 70); ctx.closePath(); fillStroke(ctx, col, 8);
  for (const s of (view === 'side' ? [-1] : [-1, 1])) circle(ctx, s * (hw / 2 + 4), top + 50, 15, tie, 6);
};
HAIR_STYLES.babyTuft = (ctx, c, layer, hw, hh, view, top) => {
  if (layer !== 'front') return;
  ctx.beginPath(); ctx.moveTo(-16, top + 10); ctx.quadraticCurveTo(-20, top - 30, 10, top - 38); ctx.quadraticCurveTo(28, top - 40, 24, top - 22);
  ctx.quadraticCurveTo(18, top - 8, 8, top - 18); ctx.quadraticCurveTo(2, top - 2, 14, top + 10); ctx.closePath(); fillStroke(ctx, c.hairC, 6);
  const bx = hw * .28, by = top + 12, bc = c.bowC || '#FF5B9B';
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + s * 30, by - 18); ctx.quadraticCurveTo(bx + s * 38, by, bx + s * 30, by + 18); ctx.closePath(); fillStroke(ctx, bc, 6); }
  circle(ctx, bx, by, 10, shade(bc, -.12), 5);
};
HAIR_STYLES.longWavy = (ctx, c, layer, hw, hh, view, top) => {
  const col = c.hairC;
  if (layer === 'back') {
    const L = -hw / 2 - 30, R = hw / 2 + 30, bot = top + hh + 66;
    ctx.beginPath(); ctx.moveTo(L + 4, top + 30); ctx.quadraticCurveTo(L, top - 30, 0, top - 26); ctx.quadraticCurveTo(R, top - 30, R - 4, top + 30);
    for (let k = 0; k < 4; k++) { const y0 = top + 30 + k * (bot - top - 30) / 4, y1 = y0 + (bot - top - 30) / 4; ctx.quadraticCurveTo(R + (k % 2 ? -10 : 18), (y0 + y1) / 2, R + (k % 2 ? 4 : -2), y1); }
    for (let k = 0; k < 5; k++) { const x0 = R - k * (R - L) / 5, x1 = x0 - (R - L) / 5; ctx.quadraticCurveTo((x0 + x1) / 2, bot + 26, x1, bot); }
    for (let k = 0; k < 4; k++) { const y0 = bot - k * (bot - top - 30) / 4, y1 = y0 - (bot - top - 30) / 4; ctx.quadraticCurveTo(L + (k % 2 ? 10 : -18), (y0 + y1) / 2, L + (k % 2 ? -4 : 2), y1); }
    ctx.closePath(); fillStroke(ctx, col, 8);
    return;
  }
  ctx.beginPath(); ctx.moveTo(-hw / 2 - 14, top + hh * .64); ctx.quadraticCurveTo(-hw / 2 - 18, top - 26, 0, top - 24); ctx.quadraticCurveTo(hw / 2 + 18, top - 26, hw / 2 + 14, top + hh * .64);
  ctx.lineTo(hw / 2 - 14, top + hh * .52); ctx.quadraticCurveTo(hw / 2 - 10, top + 34, hw * .12, top + 28);
  ctx.quadraticCurveTo(-hw * .3, top + 26, -hw * .44, top + 74); ctx.lineTo(-hw / 2 + 12, top + hh * .56); ctx.closePath(); fillStroke(ctx, col, 8);
  ctx.strokeStyle = shade(col, .28); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-hw * .3, top - 6); ctx.quadraticCurveTo(0, top - 16, hw * .26, top - 4); ctx.stroke();
};
HAIR_STYLES.longStraight = (ctx, c, layer, hw, hh, view, top) => {
  const col = c.hairC;
  if (layer === 'back') { rr(ctx, -hw / 2 - 26, top - 8, hw + 52, hh + 84, 44); fillStroke(ctx, col, 8); return; }
  ctx.beginPath(); ctx.moveTo(-hw / 2 - 12, top + hh * .72); ctx.quadraticCurveTo(-hw / 2 - 14, top - 24, 0, top - 22); ctx.quadraticCurveTo(hw / 2 + 14, top - 24, hw / 2 + 12, top + hh * .72);
  ctx.lineTo(hw / 2 - 12, top + hh * .72); ctx.quadraticCurveTo(hw / 2 - 12, top + 28, 4, top + 16); ctx.lineTo(-4, top + 16);
  ctx.quadraticCurveTo(-hw / 2 + 12, top + 28, -hw / 2 + 12, top + hh * .72); ctx.closePath(); fillStroke(ctx, col, 8);
  ctx.strokeStyle = shade(col, .28); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-hw * .3, top - 4); ctx.quadraticCurveTo(-hw * .15, top - 14, -12, top - 12); ctx.stroke();
};
HAIR_STYLES.curlyLong = (ctx, c, layer, hw, hh, view, top) => {
  const col = c.hairC;
  if (layer === 'back') {
    const sh = [];
    for (let i = 0; i < 11; i++) { const a = Math.PI * (.9 + i * .12); sh.push([Math.cos(a) * hw * .6, top + hh * .36 + Math.sin(a) * hh * .58, 40]); }
    for (const s of [-1, 1]) for (let j = 0; j < 4; j++) sh.push([s * (hw / 2 + 14 - j * 3), top + hh * .5 + j * 40, 36 - j * 2]);
    pp_union(ctx, sh, col, 8);
    return;
  }
  const sh = []; for (let i = 0; i < 7; i++) sh.push([-hw * .45 + i * hw * .15, top + 4 + (i % 2) * 12, 28]);
  pp_union(ctx, sh, col, 7); pp_shape(ctx, { rr: [-hw / 2 + 4, top - 30, hw - 8, 34, 14] }); ctx.fillStyle = col; ctx.fill();
};
HAIR_STYLES.curlers = (ctx, c, layer, hw, hh, view, top) => {
  if (layer !== 'front') return;
  const col = c.hairC, sh = [{ rr: [-hw / 2 - 4, top - 18, hw + 8, 40, 20] }];
  for (let i = 0; i < 8; i++) { const x = -hw / 2 + i * hw / 7; sh.push([x, top + 26 + Math.pow(Math.abs(x) / (hw / 2), 2) * 26, 16]); }
  pp_union(ctx, sh, col, 7);
  const rolls = [[-hw * .34, top - 8, -.4], [-hw * .12, top - 24, -.12], [hw * .12, top - 24, .12], [hw * .34, top - 8, .4]];
  rolls.forEach(([x, y, r], i) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(r);
    const rc = i % 2 ? (c.curlerC2 || '#80CDF5') : (c.curlerC || '#FF8FC0');
    box(ctx, -27, -17, 54, 34, 12, rc, 6);
    ctx.strokeStyle = shade(rc, -.25); ctx.lineWidth = 4; for (const k of [-12, 0, 12]) { ctx.beginPath(); ctx.moveTo(k, -12); ctx.lineTo(k, 12); ctx.stroke(); }
    ctx.restore();
  });
};
HAIR_STYLES.headscarf = (ctx, c, layer, hw, hh, view, top) => {
  if (layer !== 'front') return;
  const col = c.scarfC || c.hairC, back = view === 'back';
  const hx = pp_fxo(hw, view) - pp_ox(hw, view), hwid = hw * (view === 'side' ? .62 : .86);
  // drape (outer) with face opening (evenodd)
  const p = new Path2D();
  const oR = 82, ox0 = -hw / 2 - 22, oy0 = top - 26, ow = hw + 44, oh = hh + 92;
  pp_rrPath(p, ox0, oy0, ow, oh, oR);
  if (!back) pp_rrPath(p, hx - hwid / 2, top + 16, hwid, hh - 14, 56);
  ctx.fillStyle = col; ctx.fill(p, 'evenodd'); ctx.lineWidth = 8; ctx.strokeStyle = OUTLINE; ctx.lineJoin = 'round'; ctx.stroke(p);
  if (!back) { const q = new Path2D(); pp_rrPath(q, hx - hwid / 2 - 12, top + 6, hwid + 24, hh + 4, 62); ctx.lineWidth = 4; ctx.strokeStyle = shade(col, -.22); ctx.stroke(q); }
  // pin
  if (!back && view !== 'side') circle(ctx, hx + hwid / 2 + 2, top + hh - 6, 7, c.pinC || '#FFD447', 4);
};
HAIR_STYLES.hijab = HAIR_STYLES.headscarf;
function pp_rrPath(p, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  p.moveTo(x + r, y); p.arcTo(x + w, y, x + w, y + h, r); p.arcTo(x + w, y + h, x, y + h, r); p.arcTo(x, y + h, x, y, r); p.arcTo(x, y, x + w, y, r); p.closePath();
}

// ---- hats ----
HAIR_STYLES.backwardsCap = (ctx, c, layer, hw, hh, view, top) => {
  const capC = c.capC || '#EE384A';
  if (layer === 'back') { pp_under(ctx, c, layer, hw, hh, view, null); if (view === 'side' || view === 'q34') box(ctx, -hw / 2 - 50, top + 18, 80, 22, 10, shade(capC, -.2), 7); return; }
  if (!pp_under(ctx, c, layer, hw, hh, view, null)) pp_sideTufts(ctx, c, hw, top, 36, 74);
  ctx.beginPath(); ctx.moveTo(-hw / 2 - 8, top + 48); ctx.quadraticCurveTo(0, top - 58, hw / 2 + 8, top + 48); ctx.closePath(); fillStroke(ctx, capC, 8);
  ctx.strokeStyle = shade(capC, -.2); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, top - 4); ctx.lineTo(0, top + 30); ctx.stroke();
  if (view !== 'side' && view !== 'back') {
    ctx.beginPath(); ctx.moveTo(-30, top + 48); ctx.lineTo(-30, top + 30); ctx.quadraticCurveTo(0, top + 6, 30, top + 30); ctx.lineTo(30, top + 48); ctx.closePath(); fillStroke(ctx, c.hairC, 6);
    box(ctx, -36, top + 34, 72, 12, 5, shade(capC, -.3), 4);
  }
  circle(ctx, 0, top - 8, 8, shade(capC, -.15), 4);
  if (view === 'back') { ctx.beginPath(); ctx.moveTo(-hw * .36, top + 40); ctx.quadraticCurveTo(0, top + 76, hw * .36, top + 40); ctx.closePath(); fillStroke(ctx, shade(capC, -.2), 7); }
};
HAIR_STYLES.beanie = (ctx, c, layer, hw, hh, view, top) => {
  const capC = c.capC || '#FFD447';
  if (layer === 'back') { pp_under(ctx, c, layer, hw, hh, view, null); return; }
  if (!pp_under(ctx, c, layer, hw, hh, view, null)) pp_sideTufts(ctx, c, hw, top, 26, 62);
  const dome = k => { k.beginPath(); k.moveTo(-hw / 2 - 8, top + 22); k.lineTo(-hw / 2 - 8, top - 2); k.quadraticCurveTo(-hw / 2 - 6, top - 76, 0, top - 78);
    k.quadraticCurveTo(hw / 2 + 6, top - 76, hw / 2 + 8, top - 2); k.lineTo(hw / 2 + 8, top + 22); k.closePath(); };
  dome(ctx); fillStroke(ctx, capC, 8);
  ctx.save(); dome(ctx); ctx.clip(); ctx.strokeStyle = shade(capC, -.14); ctx.lineWidth = 4;
  for (let x = -hw / 2; x < hw / 2; x += 22) { ctx.beginPath(); ctx.moveTo(x, top - 80); ctx.lineTo(x, top + 20); ctx.stroke(); } ctx.restore();
  box(ctx, -hw / 2 - 12, top - 6, hw + 24, 38, 16, shade(capC, -.1), 8);
  ctx.strokeStyle = shade(capC, -.3); ctx.lineWidth = 4; for (let x = -hw / 2; x < hw / 2 + 6; x += 18) { ctx.beginPath(); ctx.moveTo(x, top + 2); ctx.lineTo(x, top + 24); ctx.stroke(); }
  const pc = c.pomC || '#FFFFFF', sh = [[0, top - 86, 24]];
  for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; sh.push([Math.cos(a) * 20, top - 86 + Math.sin(a) * 20, 11]); }
  pp_union(ctx, sh, pc, 6);
};
HAIR_STYLES.chefHat = (ctx, c, layer, hw, hh, view, top) => {
  if (layer === 'back') { pp_under(ctx, c, layer, hw, hh, view, null); return; }
  pp_under(ctx, c, layer, hw, hh, view, 'shortSide');
  const hc = c.hatC || '#FFFFFF';
  pp_union(ctx, [[-hw * .3, top - 92, 50], [hw * .3, top - 92, 50], [0, top - 122, 58], { rr: [-hw * .38, top - 100, hw * .76, 90, 10] }], hc, 8);
  ctx.strokeStyle = shade(hc, -.16); ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * hw * .14, top - 40); ctx.quadraticCurveTo(s * hw * .18, top - 80, s * hw * .1, top - 112); ctx.stroke(); }
  box(ctx, -hw / 2 + 4, top - 38, hw - 8, 54, 14, hc, 8);
  ctx.beginPath(); ctx.moveTo(-hw / 2 + 14, top - 12); ctx.lineTo(hw / 2 - 14, top - 12); ctx.stroke();
};
HAIR_STYLES.policeCap = (ctx, c, layer, hw, hh, view, top) => {
  if (layer === 'back') { pp_under(ctx, c, layer, hw, hh, view, null); return; }
  pp_under(ctx, c, layer, hw, hh, view, 'shortSide');
  const cc = c.capC || '#1E2747';
  ctx.beginPath(); ctx.moveTo(-hw / 2 + 6, top + 20); ctx.lineTo(-hw / 2 - 16, top - 40); ctx.quadraticCurveTo(-hw / 2 - 16, top - 62, -hw / 2 + 10, top - 64);
  ctx.quadraticCurveTo(0, top - 76, hw / 2 - 10, top - 64); ctx.quadraticCurveTo(hw / 2 + 16, top - 62, hw / 2 + 16, top - 40); ctx.lineTo(hw / 2 - 6, top + 20); ctx.closePath();
  fillStroke(ctx, cc, 8);
  box(ctx, -hw / 2 + 4, top - 8, hw - 8, 30, 6, shade(cc, -.35), 7);
  if (view !== 'back') pp_shield(ctx, view === 'side' ? hw * .2 : 0, top - 34, 20, c.badgeC || '#FFD447');
  ctx.beginPath();
  if (view === 'side') { ctx.moveTo(-hw * .05, top + 20); ctx.quadraticCurveTo(hw * .45, top + 44, hw / 2 + 46, top + 22); ctx.lineTo(hw / 2 - 4, top + 14); }
  else { ctx.moveTo(-hw / 2 + 8, top + 18); ctx.quadraticCurveTo(0, top + 52, hw / 2 - 8, top + 18); }
  ctx.closePath(); fillStroke(ctx, '#15151F', 7);
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-hw * .2, top + 26); ctx.quadraticCurveTo(0, top + 34, hw * .2, top + 26); ctx.stroke();
};
HAIR_STYLES.fireHelmet = (ctx, c, layer, hw, hh, view, top) => {
  if (layer === 'back') { pp_under(ctx, c, layer, hw, hh, view, null); return; }
  pp_under(ctx, c, layer, hw, hh, view, 'shortSide');
  const hc = c.helmetC || '#EE384A';
  ctx.beginPath(); ctx.ellipse(0, top + 22, hw / 2 + 12, 102, 0, Math.PI, TAU); ctx.closePath(); fillStroke(ctx, hc, 8);
  box(ctx, -13, top - 84, 26, 104, 10, shade(hc, -.18), 6);
  ellipse(ctx, view === 'side' ? -hw * .1 : 0, top + 24, hw / 2 + (view === 'side' ? 52 : 36), 18, shade(hc, -.1), 8);
  if (view !== 'back') { const sx = view === 'side' ? hw * .22 : view === 'q34' ? hw * .08 : 0; pp_shield(ctx, sx, top - 30, 30, c.shieldC || '#FFD447'); pp_text(ctx, String(c.number ?? 1), sx, top - 28, 34, '#EE384A', 5); }
  ctx.save(); ctx.globalAlpha *= .35; ellipse(ctx, -hw * .22, top - 40, 22, 12, '#FFFFFF', 0, -.5); ctx.restore();
};
HAIR_STYLES.sunHat = (ctx, c, layer, hw, hh, view, top) => {
  if (layer === 'back') { pp_under(ctx, c, layer, hw, hh, view, 'longWavy'); return; }
  pp_under(ctx, c, layer, hw, hh, view, 'longWavy');
  const hc = c.hatC || '#F2D27A';
  ellipse(ctx, 0, top - 4, hw / 2 + 78, 28, hc, 8);
  ctx.save(); ctx.globalAlpha *= .5; ctx.strokeStyle = shade(hc, -.25); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, top - 4, hw / 2 + 56, 19, 0, 0, TAU); ctx.stroke(); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-hw * .36, top - 2); ctx.lineTo(-hw * .34, top - 62); ctx.quadraticCurveTo(0, top - 86, hw * .34, top - 62); ctx.lineTo(hw * .36, top - 2);
  ctx.quadraticCurveTo(0, top + 10, -hw * .36, top - 2); ctx.closePath(); fillStroke(ctx, hc, 8);
  ctx.save(); ctx.clip(); ctx.fillStyle = c.ribbonC || '#FF5B9B'; ctx.fillRect(-hw, top - 32, hw * 2, 22); ctx.restore();
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-hw * .35, top - 32); ctx.lineTo(hw * .35, top - 32); ctx.moveTo(-hw * .36, top - 10); ctx.lineTo(hw * .36, top - 10); ctx.stroke();
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; circle(ctx, hw * .3 + Math.cos(a) * 11, top - 22 + Math.sin(a) * 11, 9, '#FFFFFF', 4); } circle(ctx, hw * .3, top - 22, 7, '#FFD447', 4);
};
HAIR_STYLES.paperHat = (ctx, c, layer, hw, hh, view, top) => {
  if (layer === 'back') { pp_under(ctx, c, layer, hw, hh, view, null); return; }
  pp_under(ctx, c, layer, hw, hh, view, 'shortSide');
  const path = k => { k.beginPath(); k.moveTo(-hw / 2 + 2, top + 14); k.lineTo(-hw / 2 + 24, top - 48); k.quadraticCurveTo(0, top - 60, hw / 2 - 24, top - 48); k.lineTo(hw / 2 - 2, top + 14); k.quadraticCurveTo(0, top - 2, -hw / 2 + 2, top + 14); k.closePath(); };
  path(ctx); fillStroke(ctx, c.hatC || '#FFFFFF', 8);
  ctx.save(); path(ctx); ctx.clip(); ctx.fillStyle = c.stripeC || '#FF5B9B'; ctx.fillRect(-hw, top - 18, hw * 2, 16); ctx.restore();
  path(ctx); fillStroke(ctx, null, 8);
  ctx.strokeStyle = shade('#FFFFFF', -.2); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, top - 52); ctx.lineTo(0, top - 22); ctx.stroke();
};
HAIR_STYLES.partyHat = (ctx, c, layer, hw, hh, view, top) => {
  if (layer === 'back') { pp_under(ctx, c, layer, hw, hh, view, null); return; }
  pp_under(ctx, c, layer, hw, hh, view, 'shortSide');
  const lift = PP_HAT_LIFT[c.hairUnder || 'shortSide'] ?? 16, pc = c.partyC || '#7B4BFF', pc2 = c.partyC2 || '#FFD447';
  ctx.save(); ctx.translate(hw * .12, top - lift + 10); ctx.rotate(.16);
  const cone = k => { k.beginPath(); k.moveTo(-44, 0); k.lineTo(0, -128); k.lineTo(44, 0); k.quadraticCurveTo(0, 14, -44, 0); k.closePath(); };
  cone(ctx); fillStroke(ctx, pc, 8);
  ctx.save(); cone(ctx); ctx.clip(); ctx.strokeStyle = pc2; ctx.lineWidth = 12;
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-60, -10 - i * 34); ctx.lineTo(60, -40 - i * 34); ctx.stroke(); }
  for (let i = 0; i < 4; i++) circle(ctx, -14 + (i % 2) * 24, -22 - i * 24, 5, '#FFFFFF');
  ctx.restore(); cone(ctx); fillStroke(ctx, null, 8);
  const sh = [[0, -132, 16]]; for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; sh.push([Math.cos(a) * 14, -132 + Math.sin(a) * 14, 9]); }
  pp_union(ctx, sh, c.pomC || '#FF5B9B', 6);
  ctx.restore();
};
HAIR_STYLES.nightcap = (ctx, c, layer, hw, hh, view, top) => {
  if (layer === 'back') { pp_under(ctx, c, layer, hw, hh, view, null); return; }
  pp_under(ctx, c, layer, hw, hh, view, 'shortSide');
  const cc = c.capC || '#80CDF5';
  const cone = k => { k.beginPath(); k.moveTo(-hw / 2 - 2, top + 6); k.quadraticCurveTo(-hw * .36, top - 116, hw * .14, top - 112);
    k.quadraticCurveTo(hw / 2 + 34, top - 104, hw / 2 + 52, top + 22); k.lineTo(hw / 2 + 30, top + 18); k.quadraticCurveTo(hw / 2 + 8, top - 50, hw / 2 - 4, top + 6); k.closePath(); };
  cone(ctx); fillStroke(ctx, cc, 8);
  ctx.save(); cone(ctx); ctx.clip(); pp_pattern(ctx, 'stars', -hw, top - 130, hw * 2, 150, '#FFFFFF', .9); ctx.restore();
  box(ctx, -hw / 2 - 8, top - 10, hw + 16, 34, 16, '#FFFFFF', 8);
  const sh = [[hw / 2 + 42, top + 30, 18]]; for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; sh.push([hw / 2 + 42 + Math.cos(a) * 15, top + 30 + Math.sin(a) * 15, 9]); }
  pp_union(ctx, sh, '#FFFFFF', 6);
};
HAIR_STYLES.headsetOn = (ctx, c, layer, hw, hh, view, top) => {
  if (layer === 'back') { pp_under(ctx, c, layer, hw, hh, view, null); return; }
  pp_under(ctx, c, layer, hw, hh, view, 'messy');
  const hc = c.headsetC || '#222331', side = view === 'side';
  pp_cord(ctx, k => k.ellipse(0, top + 86, hw / 2 + 10, 122, 0, Math.PI * 1.06, Math.PI * 1.94), hc, 18);
  for (const s of (side ? [0] : [-1, 1])) {
    const x = side ? -hw * .02 : s * (hw / 2 + 6);
    box(ctx, x - 22, top + 62, 44, 78, 18, hc, 8); box(ctx, x - 12, top + 76, 24, 50, 10, c.ledC || '#30CE65', 4);
  }
  if (!side) { pp_cord(ctx, k => { k.moveTo(-hw / 2 - 4, top + 124); k.quadraticCurveTo(-hw / 2 + 4, top + hh - 18, -hw * .26, top + hh - 34); }, '#3A3F55', 6);
    circle(ctx, -hw * .26, top + hh - 34, 11, '#3A3F55', 5); }
};

// ============================================================================================================
// OUTFITS  — (ctx, c, x, y, tw, h, face, view)
// ============================================================================================================
OUTFITS.polo = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view); pp_body(ctx, x, y, tw, h, c.shirt);
  if (pp_nf(view)) return;
  box(ctx, cx - 11, y + 14, 22, 58, 8, shade(c.shirt, -.08), 4); circle(ctx, cx, y + 36, 4, '#FFFFFF', 2); circle(ctx, cx, y + 56, 4, '#FFFFFF', 2);
  pp_collar(ctx, cx, y, c.collarC || shade(c.shirt, .25), 46, 30);
  circle(ctx, cx + tw * .26, y + 66, 9, c.logoC || '#FFD447', 4);
  ctx.strokeStyle = shade(c.shirt, -.25); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 10, y + h - 10); ctx.lineTo(x + tw - 10, y + h - 10); ctx.stroke();
};
OUTFITS.hoodie = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view); pp_body(ctx, x, y, tw, h, c.shirt);
  box(ctx, -tw * .42, y + 2, tw * .84, 40, 20, shade(c.shirt, -.14), 7);
  if (pp_nf(view)) return;
  rr(ctx, cx - tw * .32, y + h * .58, tw * .64, h * .3, 14); fillStroke(ctx, shade(c.shirt, -.1), 6);
  if (c.graphic) pp_graphic(ctx, c.graphic, cx, y + h * .4, .6, c.graphicC || '#FFD447');
  for (const s of [-1, 1]) { ctx.lineCap = 'round'; ctx.strokeStyle = c.stringC || '#FFFFFF'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx + s * 16, y + 30); ctx.lineTo(cx + s * 18, y + 70); ctx.stroke(); circle(ctx, cx + s * 18, y + 72, 5, c.stringC || '#FFFFFF', 3); }
  ctx.strokeStyle = shade(c.shirt, -.25); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 10, y + h - 8); ctx.lineTo(x + tw - 10, y + h - 8); ctx.stroke();
};
OUTFITS.graphicTee = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view); pp_body(ctx, x, y, tw, h, c.shirt);
  ctx.strokeStyle = shade(c.shirt, -.22); ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(cx, y + 8, 46, 22, 0, .1, Math.PI - .1); ctx.stroke();
  if (!pp_nf(view) && c.graphic) pp_graphic(ctx, c.graphic, cx, y + h * .54, .9, c.graphicC || '#2E9E5B');
};
OUTFITS.stripedTee = (ctx, c, x, y, tw, h, f, view) => {
  pp_body(ctx, x, y, tw, h, c.shirt);
  ctx.save(); pp_clipBody(ctx, x, y, tw, h); ctx.fillStyle = c.stripeC || '#FFFFFF';
  for (let yy = y + 30; yy < y + h + 6; yy += 38) ctx.fillRect(x, yy, tw, 16); ctx.restore();
  pp_body(ctx, x, y, tw, h, null);
  const cx = pp_tcx(tw, view); ctx.strokeStyle = shade(c.shirt, -.22); ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(cx, y + 8, 46, 22, 0, .1, Math.PI - .1); ctx.stroke();
};
OUTFITS.suitTie = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view); pp_body(ctx, x, y, tw, h, c.shirt);
  if (pp_nf(view)) return;
  ctx.beginPath(); ctx.moveTo(cx - 42, y + 2); ctx.lineTo(cx + 42, y + 2); ctx.lineTo(cx, y + 112); ctx.closePath(); fillStroke(ctx, c.inner || '#FFFFFF', 6);
  pp_tie(ctx, cx, y, c.tieC || '#EE384A', 74);
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx + s * 42, y + 2); ctx.lineTo(cx + s * 30, y + 52); ctx.lineTo(cx + s * 46, y + 60); ctx.lineTo(cx + s * 2, y + 116); ctx.lineTo(cx + s * 4, y + 112); ctx.lineTo(cx + s * 38, y + 46); ctx.closePath(); fillStroke(ctx, shade(c.shirt, -.15), 5); }
  circle(ctx, cx, y + 134, 6, shade(c.shirt, -.4), 3); circle(ctx, cx, y + 158, 6, shade(c.shirt, -.4), 3);
  ctx.beginPath(); ctx.moveTo(cx + tw * .2, y + 70); ctx.lineTo(cx + tw * .36, y + 70); ctx.lineTo(cx + tw * .3, y + 56); ctx.closePath(); fillStroke(ctx, c.pocketSq || '#FFFFFF', 4);
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx + tw * .18, y + 70); ctx.lineTo(cx + tw * .38, y + 70); ctx.stroke();
};
OUTFITS.labCoat = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view), coat = c.coatC || '#FDFDFD';
  pp_body(ctx, x, y, tw, h, c.inner || '#80CDF5');
  if (!pp_nf(view)) { ctx.strokeStyle = shade(c.inner || '#80CDF5', -.25); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx - 24, y + 12); ctx.lineTo(cx, y + 46); ctx.lineTo(cx + 24, y + 12); ctx.stroke(); }
  const gap = view === 'side' ? 0 : 26;
  rr(ctx, x - 6, y, cx - x + 6 - gap / 2 + 6, h + 56, 20); fillStroke(ctx, coat, 8);
  rr(ctx, cx + gap / 2 - 6, y, x + tw + 6 - (cx + gap / 2 - 6), h + 56, 20); fillStroke(ctx, coat, 8);
  if (pp_nf(view)) return;
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx + s * (gap / 2 + 2), y + 4); ctx.lineTo(cx + s * (gap / 2 + 30), y + 4); ctx.lineTo(cx + s * (gap / 2 + 4), y + 76); ctx.closePath(); fillStroke(ctx, shade(coat, -.08), 5); }
  box(ctx, cx + tw * .18, y + 74, 46, 36, 6, shade(coat, -.04), 5);
  box(ctx, cx + tw * .2 + 4, y + 58, 8, 26, 3, '#2E62C9', 3); box(ctx, cx + tw * .2 + 16, y + 62, 8, 22, 3, '#EE384A', 3);
  box(ctx, cx - tw * .42, y + h - 4, 48, 34, 6, shade(coat, -.04), 5);
  box(ctx, cx + tw * .18, y + h - 4, 48, 34, 6, shade(coat, -.04), 5);
};
OUTFITS.scrubs = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view); pp_body(ctx, x, y, tw, h, c.shirt);
  if (pp_nf(view)) return;
  pp_cord(ctx, k => { k.moveTo(cx - 34, y + 8); k.lineTo(cx, y + 58); k.lineTo(cx + 34, y + 8); }, shade(c.shirt, -.15), 8);
  box(ctx, cx - tw * .38, y + 74, 46, 40, 6, shade(c.shirt, -.06), 5); box(ctx, cx - tw * .38 + 10, y + 60, 8, 22, 3, '#FFFFFF', 3);
};
OUTFITS.policeUniform = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view); pp_body(ctx, x, y, tw, h, c.shirt);
  box(ctx, x + 2, y + 4, 44, 16, 6, shade(c.shirt, -.25), 5); box(ctx, x + tw - 46, y + 4, 44, 16, 6, shade(c.shirt, -.25), 5);
  if (!pp_nf(view)) {
    for (const s of [-1, 1]) { box(ctx, cx + s * tw * .26 - 26, y + 78, 52, 42, 6, shade(c.shirt, -.06), 5); box(ctx, cx + s * tw * .26 - 28, y + 74, 56, 16, 5, shade(c.shirt, -.15), 5); }
    ctx.strokeStyle = shade(c.shirt, -.35); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, y + 30); ctx.lineTo(cx, y + h - 24); ctx.stroke();
    for (let i = 0; i < 4; i++) circle(ctx, cx + 8, y + 50 + i * 30, 5, '#FFD447', 3);
    pp_collar(ctx, cx, y, shade(c.shirt, -.1), 44, 30);
  }
  box(ctx, x - 2, y + h - 26, tw + 4, 30, 8, '#1B1B25', 7);
  if (!pp_nf(view)) box(ctx, cx - 16, y + h - 24, 32, 26, 5, '#D9D9E0', 5);
};
OUTFITS.fireJacket = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view); pp_body(ctx, x, y, tw, h, c.shirt, 26);
  ctx.save(); pp_clipBody(ctx, x, y, tw, h, 26);
  for (const yy of [y + h * .5, y + h * .86]) { ctx.fillStyle = '#FFD447'; ctx.fillRect(x, yy, tw, 24); ctx.fillStyle = '#D8E0E8'; ctx.fillRect(x, yy + 8, tw, 8);
    ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.strokeRect(x - 10, yy, tw + 20, 24); }
  ctx.restore(); pp_body(ctx, x, y, tw, h, null, 26);
  box(ctx, cx - 54, y + 4, 108, 32, 12, shade(c.shirt, -.15), 7);
  if (pp_nf(view)) return;
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx, y + 36); ctx.lineTo(cx, y + h + 28); ctx.stroke();
  for (let i = 0; i < 3; i++) box(ctx, cx - 4, y + 52 + i * 40, 20, 12, 4, '#3A3A3A', 3);
};
OUTFITS.apron = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view), ac = c.apronC || '#30A08A';
  pp_body(ctx, x, y, tw, h, c.shirt);
  ctx.strokeStyle = shade(c.shirt, -.22); ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(cx, y + 8, 44, 20, 0, .1, Math.PI - .1); ctx.stroke();
  box(ctx, x - 2, y + 92, tw + 4, 16, 6, ac, 5);
  for (const s of [-1, 1]) pp_cord(ctx, k => { k.moveTo(cx + s * tw * .28, y + 44); k.lineTo(cx + s * tw * .22, y + 6); }, ac, 9);
  const bib = k => { rr(k, cx - tw * .34, y + 40, tw * .68, h + 30 - 40 + 6, 14); };
  bib(ctx); fillStroke(ctx, ac, 7);
  if (c.apronStripes) { ctx.save(); bib(ctx); ctx.clip(); ctx.fillStyle = c.apronStripes; for (let xx = cx - tw * .34 + 8; xx < cx + tw * .34; xx += 26) ctx.fillRect(xx, y + 30, 12, h + 20); ctx.restore(); bib(ctx); fillStroke(ctx, null, 7); }
  if (!pp_nf(view)) { box(ctx, cx - 36, y + h - 12, 72, 32, 8, shade(ac, -.12), 5); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, y + h - 12); ctx.lineTo(cx, y + h + 20); ctx.stroke(); }
};
OUTFITS.hawaiian = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view), fl = c.flowerC || '#FFD447';
  pp_body(ctx, x, y, tw, h, c.shirt);
  ctx.save(); pp_clipBody(ctx, x, y, tw, h);
  const spots = [[.18, .28, .3], [.72, .18, 1.2], [.46, .56, 2.1], [.88, .62, .7], [.12, .84, 1.6], [.62, .92, 2.6], [.36, .1, .4], [.95, .3, 1.9]];
  for (const [u, v, r] of spots) {
    const fx = x + u * tw, fy = y + v * (h + 6);
    ctx.save(); ctx.translate(fx, fy); ctx.rotate(r);
    ellipse(ctx, 18, 8, 16, 7, '#2E9E5B', 3, .5);
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; circle(ctx, Math.cos(a) * 11, Math.sin(a) * 11, 9, fl, 3); }
    circle(ctx, 0, 0, 6, '#FFFFFF', 3); ctx.restore();
  }
  ctx.restore(); pp_body(ctx, x, y, tw, h, null);
  if (pp_nf(view)) return;
  ctx.beginPath(); ctx.moveTo(cx - 32, y + 2); ctx.lineTo(cx, y + 56); ctx.lineTo(cx + 32, y + 2); ctx.closePath(); fillStroke(ctx, c.skin, 6);
  pp_collar(ctx, cx, y, shade(c.shirt, .2), 46, 26);
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, y + 56); ctx.lineTo(cx, y + h + 6); ctx.stroke();
  for (let i = 0; i < 3; i++) circle(ctx, cx + 8, y + 80 + i * 32, 4, '#FFFFFF', 2);
};
OUTFITS.overalls = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view), den = c.pants;
  pp_body(ctx, x, y, tw, h, c.shirt);
  ctx.strokeStyle = shade(c.shirt, -.22); ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(cx, y + 8, 44, 20, 0, .1, Math.PI - .1); ctx.stroke();
  for (const s of [-1, 1]) pp_cord(ctx, k => { k.moveTo(cx + s * tw * .26, y + 72); k.lineTo(cx + s * tw * .34, y + 4); }, den, 14);
  box(ctx, x, y + h - 40, tw, 46, 14, den, 8);
  box(ctx, cx - tw * .31, y + 64, tw * .62, h - 64 - 20, 12, den, 7);
  ctx.fillStyle = den; ctx.fillRect(cx - tw * .31 + 4, y + h - 46, tw * .62 - 8, 30);
  if (!pp_nf(view)) { box(ctx, cx - 26, y + 84, 52, 36, 6, shade(den, -.1), 5); for (const s of [-1, 1]) circle(ctx, cx + s * tw * .26, y + 74, 8, '#FFD447', 4); }
};
OUTFITS.jersey = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view), tc = c.trimC || '#FFFFFF';
  pp_body(ctx, x, y, tw, h, c.shirt);
  ctx.save(); pp_clipBody(ctx, x, y, tw, h); ctx.fillStyle = tc; ctx.fillRect(x + 8, y, 12, h + 6); ctx.fillRect(x + tw - 20, y, 12, h + 6); ctx.restore();
  pp_body(ctx, x, y, tw, h, null);
  pp_cord(ctx, k => { k.moveTo(cx - 36, y + 6); k.lineTo(cx, y + 50); k.lineTo(cx + 36, y + 6); }, tc, 10);
  if (!pp_nf(view)) pp_text(ctx, String(c.number ?? 10), cx, y + h * .66, 80, tc, 9);
};
OUTFITS.onesie = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view); pp_body(ctx, x, y, tw, h, c.shirt);
  ctx.save(); pp_clipBody(ctx, x, y, tw, h); pp_pattern(ctx, 'stars', x, y + 50, tw, h, c.dotC || '#FFFFFF', .8); ctx.restore();
  pp_body(ctx, x, y, tw, h, null);
  if (pp_nf(view)) return;
  ellipse(ctx, cx, y + 42, 56, 38, c.bibC || '#FFFFFF', 6); heartPath(ctx, cx, y + 50, 16); fillStroke(ctx, c.bowC || '#FF5B9B', 4);
  for (const s of [-1, 0, 1]) circle(ctx, cx + s * 22, y + h - 8, 5, '#FFFFFF', 3);
};
OUTFITS.cardigan = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view), col = c.shirt;
  pp_body(ctx, x, y, tw, h, c.inner || '#FFF3D6');
  for (const s of [-1, 1]) {
    const ex = s < 0 ? x : x + tw;
    ctx.beginPath(); ctx.moveTo(ex, y + 22); ctx.quadraticCurveTo(ex, y, ex - s * 22, y); ctx.lineTo(cx + s * 34, y); ctx.lineTo(cx + s * 4, y + h * .62); ctx.lineTo(cx + s * 4, y + h + 6);
    ctx.lineTo(ex - s * 22, y + h + 6); ctx.quadraticCurveTo(ex, y + h + 6, ex, y + h - 16); ctx.closePath(); fillStroke(ctx, col, 8);
  }
  if (pp_nf(view)) return;
  for (let i = 0; i < 3; i++) circle(ctx, cx + 14, y + h * .64 + i * 22, 6, c.buttonC || shade(col, .45), 3);
  for (const s of [-1, 1]) box(ctx, cx + s * tw * .26 - 22, y + h - 40, 44, 34, 6, shade(col, -.1), 5);
  ctx.strokeStyle = shade(col, -.25); ctx.lineWidth = 3;
  for (let xx = x + 12; xx < x + tw - 8; xx += 12) { if (Math.abs(xx - cx) < 8) continue; ctx.beginPath(); ctx.moveTo(xx, y + h - 6); ctx.lineTo(xx, y + h + 4); ctx.stroke(); }
};
OUTFITS.tankTop = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view); pp_body(ctx, x, y, tw, h, c.skin);
  ctx.beginPath(); ctx.moveTo(x + 24, y); ctx.lineTo(x + 58, y); ctx.quadraticCurveTo(cx, y + 86, x + tw - 58, y); ctx.lineTo(x + tw - 24, y);
  ctx.quadraticCurveTo(x + tw - 10, y + 40, x + tw - 2, y + 64); ctx.lineTo(x + tw, y + h - 16); ctx.quadraticCurveTo(x + tw, y + h + 6, x + tw - 22, y + h + 6);
  ctx.lineTo(x + 22, y + h + 6); ctx.quadraticCurveTo(x, y + h + 6, x, y + h - 16); ctx.lineTo(x + 2, y + 64); ctx.quadraticCurveTo(x + 10, y + 40, x + 24, y); ctx.closePath();
  fillStroke(ctx, c.shirt, 8);
  if (c.crossC && !pp_nf(view)) { box(ctx, cx - 12, y + 84, 24, 64, 4, c.crossC, 5); box(ctx, cx - 32, y + 104, 64, 24, 4, c.crossC, 5); ctx.fillStyle = c.crossC; ctx.fillRect(cx - 9, y + 101, 18, 30); }
};
OUTFITS.swimTrunksTop = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view);
  if (c.rashGuard) {   // full-cover swimwear
    const sc = c.swimC || c.shirt; pp_body(ctx, x, y, tw, h, sc);
    ctx.save(); pp_clipBody(ctx, x, y, tw, h); ctx.fillStyle = shade(sc, .35); ctx.fillRect(x, y + 70, tw, 20); ctx.restore(); pp_body(ctx, x, y, tw, h, null);
    box(ctx, cx - 30, y + 8, 60, 22, 10, shade(sc, -.2), 5);
    if (!pp_nf(view)) { ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, y + 30); ctx.lineTo(cx, y + 64); ctx.stroke(); }
    return;
  }
  pp_body(ctx, x, y, tw, h, c.skin);
  if (c.swimC) {   // one-piece swimsuit
    const sc = c.swimC;
    const suit = k => { k.beginPath(); k.moveTo(x + 30, y); k.lineTo(x + 56, y); k.quadraticCurveTo(cx, y + 64, x + tw - 56, y); k.lineTo(x + tw - 30, y);
      k.quadraticCurveTo(x + tw - 10, y + 40, x + tw - 2, y + 62); k.lineTo(x + tw, y + h - 16); k.quadraticCurveTo(x + tw, y + h + 6, x + tw - 22, y + h + 6);
      k.lineTo(x + 22, y + h + 6); k.quadraticCurveTo(x, y + h + 6, x, y + h - 16); k.lineTo(x + 2, y + 62); k.quadraticCurveTo(x + 10, y + 40, x + 30, y); k.closePath(); };
    suit(ctx); fillStroke(ctx, sc, 8);
    ctx.save(); suit(ctx); ctx.clip(); pp_pattern(ctx, c.swimPattern || 'dots', x, y + 40, tw, h, shade(sc, .45), .9); ctx.restore(); suit(ctx); fillStroke(ctx, null, 8);
    const rs = []; for (let i = 0; i < 6; i++) rs.push([x + 6 + i * (tw - 12) / 5, y + h + 2, 16]);
    pp_union(ctx, rs, shade(sc, .2), 6);
    return;
  }
  // bare chest + trunks waistband (kid-simple: no anatomy beyond a belly button)
  if (!pp_nf(view)) { ctx.strokeStyle = shade(c.skin, -.35); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx, y + h - 46, 5, .3, Math.PI - .3); ctx.stroke(); }
  box(ctx, x - 2, y + h - 18, tw + 4, 28, 8, c.pants, 7);
  if (!pp_nf(view)) pp_cord(ctx, k => { k.moveTo(cx - 6, y + h - 4); k.lineTo(cx - 12, y + h + 22); k.moveTo(cx + 6, y + h - 4); k.lineTo(cx + 12, y + h + 22); }, '#FFFFFF', 4);
};
OUTFITS.pajamas = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view); pp_body(ctx, x, y, tw, h, c.shirt);
  ctx.save(); pp_clipBody(ctx, x, y, tw, h); ctx.globalAlpha *= .8; pp_pattern(ctx, c.pjPattern || 'stars', x, y + 10, tw, h, c.pjDot || '#FFFFFF'); ctx.restore();
  pp_body(ctx, x, y, tw, h, null);
  if (pp_nf(view)) return;
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, y + 34); ctx.lineTo(cx, y + h + 6); ctx.stroke();
  for (let i = 0; i < 4; i++) circle(ctx, cx + 9, y + 50 + i * 32, 5, '#FFFFFF', 3);
  pp_collar(ctx, cx, y, c.pjTrim || '#FFFFFF', 44, 30);
  box(ctx, cx - tw * .4, y + 58, 42, 36, 6, null, 4);
};
OUTFITS.winterCoat = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view), cc = c.coatC || c.shirt;
  box(ctx, x - 8, y - 2, tw + 16, h + 32, 30, cc, 8);
  ctx.save(); rr(ctx, x - 8, y - 2, tw + 16, h + 32, 30); ctx.clip(); ctx.strokeStyle = shade(cc, -.2); ctx.lineWidth = 5;
  for (const yy of [y + 50, y + 96, y + 142]) { ctx.beginPath(); ctx.moveTo(x - 10, yy); ctx.quadraticCurveTo(x + tw * .25, yy + 12, cx, yy); ctx.quadraticCurveTo(x + tw * .75, yy + 12, x + tw + 10, yy); ctx.stroke(); }
  ctx.restore();
  if (!pp_nf(view)) {
    ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx, y + 30); ctx.lineTo(cx, y + h + 30); ctx.stroke();
    ctx.lineWidth = 3; for (let yy = y + 40; yy < y + h + 24; yy += 9) { ctx.beginPath(); ctx.moveTo(cx - 5, yy); ctx.lineTo(cx + 5, yy); ctx.stroke(); }
    box(ctx, cx - 7, y + 60, 14, 26, 5, '#D9D9E0', 4);
    for (const s of [-1, 1]) box(ctx, cx + s * tw * .27 - 22, y + h - 20, 44, 12, 5, shade(cc, -.15), 4);
  }
  const fur = c.furC || '#F4EDE0', sh = [];
  for (let i = 0; i < 9; i++) sh.push([-tw * .44 + i * tw * .11, y + 12 + Math.abs(i - 4) * -1.5, 18]);
  pp_union(ctx, sh, fur, 6);
};
OUTFITS.tracksuit = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view), st = c.stripeC || '#FFFFFF';
  pp_body(ctx, x, y, tw, h, c.shirt);
  ctx.save(); pp_clipBody(ctx, x, y, tw, h); ctx.fillStyle = st; for (const xx of [x + 12, x + 26, x + tw - 22, x + tw - 36]) ctx.fillRect(xx, y, 8, h + 6); ctx.restore();
  pp_body(ctx, x, y, tw, h, null);
  box(ctx, cx - 48, y + 4, 96, 28, 10, shade(c.shirt, -.15), 6);
  if (pp_nf(view)) return;
  ctx.strokeStyle = st; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx, y + 32); ctx.lineTo(cx, y + h + 6); ctx.stroke();
  box(ctx, cx - 6, y + 40, 12, 22, 4, st, 3);
  box(ctx, x + 4, y + h - 16, tw - 8, 20, 8, shade(c.shirt, -.15), 5);
};
OUTFITS.dress = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view), dc = c.shirt;
  const skirt = k => { k.beginPath(); k.moveTo(x + 6, y + h - 54); k.lineTo(x + tw - 6, y + h - 54); k.lineTo(x + tw + 28, y + h + 64); k.quadraticCurveTo(cx, y + h + 80, x - 28, y + h + 64); k.closePath(); };
  if (c.dressStraps) {
    pp_body(ctx, x, y, tw, h, c.skin);
    for (const s of [-1, 1]) pp_cord(ctx, k => { k.moveTo(cx + s * 44, y + 40); k.lineTo(cx + s * 50, y + 2); }, dc, 10);
    box(ctx, x + 4, y + 32, tw - 8, h - 20, 18, dc, 8);
  } else pp_body(ctx, x, y, tw, h, dc);
  skirt(ctx); fillStroke(ctx, dc, 8);
  if (c.dotC) {
    ctx.save(); skirt(ctx); ctx.clip(); pp_pattern(ctx, 'dots', x - 30, y + h - 50, tw + 60, 140, c.dotC); ctx.restore(); skirt(ctx); fillStroke(ctx, null, 8);
    ctx.save(); rr(ctx, x + 4, y + (c.dressStraps ? 32 : 0), tw - 8, h, 18); ctx.clip(); pp_pattern(ctx, 'dots', x, y + 40, tw, h - 90, c.dotC); ctx.restore();
  }
  box(ctx, x + 2, y + h - 64, tw - 4, 22, 8, c.sashC || shade(dc, -.22), 6);
  if (!c.dressStraps && !pp_nf(view)) for (const s of [-1, 1]) ellipse(ctx, cx + s * 24, y + 22, 28, 16, c.collarC || '#FFFFFF', 5, s * .25);
};
OUTFITS.robe = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view), rc = c.shirt;
  const body = k => rr(k, x - 6, y, tw + 12, h + 112, 26);
  body(ctx); fillStroke(ctx, rc, 8);
  if (c.dotC) { ctx.save(); body(ctx); ctx.clip(); pp_pattern(ctx, 'hearts', x - 6, y + 30, tw + 12, h + 90, c.dotC, .8); ctx.restore(); body(ctx); fillStroke(ctx, null, 8); }
  if (!pp_nf(view)) {
    ctx.beginPath(); ctx.moveTo(cx - 46, y + 2); ctx.lineTo(cx - 18, y + 2); ctx.lineTo(cx + 26, y + h - 30); ctx.lineTo(cx + 4, y + h - 30); ctx.closePath(); fillStroke(ctx, shade(rc, .3), 6);
    ctx.beginPath(); ctx.moveTo(cx + 46, y + 2); ctx.lineTo(cx + 18, y + 2); ctx.lineTo(cx + 2, y + 40); ctx.lineTo(cx + 18, y + 52); ctx.closePath(); fillStroke(ctx, shade(rc, .3), 6);
    ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx + 14, y + h - 30); ctx.lineTo(cx + 14, y + h + 108); ctx.stroke();
  }
  const bc = c.beltC || shade(rc, -.2);
  box(ctx, x - 8, y + h - 40, tw + 16, 22, 8, bc, 6);
  if (!pp_nf(view)) { box(ctx, cx - 30, y + h - 30, 16, 60, 6, bc, 5); box(ctx, cx - 14, y + h - 30, 16, 50, 6, bc, 5); circle(ctx, cx - 18, y + h - 30, 12, bc, 5); }
};
OUTFITS.chefJacket = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view), jc = c.shirt || '#FFFFFF';
  pp_body(ctx, x, y, tw, h, jc);
  box(ctx, cx - 46, y + 4, 92, 26, 8, jc, 6);
  if (pp_nf(view)) return;
  ctx.strokeStyle = shade(jc, -.2); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx + tw * .26, y + 30); ctx.lineTo(cx + tw * .26, y + h + 6); ctx.stroke();
  for (let i = 0; i < 3; i++) for (const xx of [cx - tw * .04, cx + tw * .16]) circle(ctx, xx, y + 56 + i * 38, 6, '#3A3A3A', 3);
};
OUTFITS.workShirt = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view); pp_body(ctx, x, y, tw, h, c.shirt);
  if (pp_nf(view)) return;
  ctx.strokeStyle = shade(c.shirt, -.3); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, y + 30); ctx.lineTo(cx, y + h + 6); ctx.stroke();
  for (let i = 0; i < 4; i++) circle(ctx, cx + 7, y + 48 + i * 32, 4, '#FFFFFF', 2);
  for (const s of [-1, 1]) { box(ctx, cx + s * tw * .25 - 24, y + 62, 48, 40, 6, shade(c.shirt, -.05), 4); box(ctx, cx + s * tw * .25 - 26, y + 58, 52, 14, 5, shade(c.shirt, -.12), 4); }
  if (c.patchC) ellipse(ctx, cx - tw * .25, y + 116, 22, 14, c.patchC, 4);
  pp_collar(ctx, cx, y, shade(c.shirt, .2), 46, 30);
};
OUTFITS.sweaterVest = (ctx, c, x, y, tw, h, f, view) => {
  const cx = pp_tcx(tw, view), vc = c.vestC || '#2E9E5B';
  pp_body(ctx, x, y, tw, h, c.shirt);
  const vest = k => { k.beginPath(); k.moveTo(x + 22, y); k.lineTo(cx - 36, y); k.lineTo(cx, y + 68); k.lineTo(cx + 36, y); k.lineTo(x + tw - 22, y);
    k.quadraticCurveTo(x + tw, y, x + tw, y + 22); k.lineTo(x + tw, y + h - 16); k.quadraticCurveTo(x + tw, y + h + 6, x + tw - 22, y + h + 6);
    k.lineTo(x + 22, y + h + 6); k.quadraticCurveTo(x, y + h + 6, x, y + h - 16); k.lineTo(x, y + 22); k.quadraticCurveTo(x, y, x + 22, y); k.closePath(); };
  vest(ctx); fillStroke(ctx, vc, 8);
  ctx.save(); vest(ctx); ctx.clip(); ctx.fillStyle = shade(vc, .18);
  for (let r = 0; r < 4; r++) for (let k = -1; k < 5; k++) { const dx = x + k * 52 + (r % 2) * 26, dy = y + 60 + r * 40; ctx.beginPath(); ctx.moveTo(dx, dy - 20); ctx.lineTo(dx + 14, dy); ctx.lineTo(dx, dy + 20); ctx.lineTo(dx - 14, dy); ctx.closePath(); ctx.fill(); }
  ctx.restore(); vest(ctx); fillStroke(ctx, null, 8);
  ctx.strokeStyle = shade(vc, -.3); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 8, y + h - 12); ctx.lineTo(x + tw - 8, y + h - 12); ctx.stroke();
  if (!pp_nf(view)) pp_collar(ctx, cx, y, '#FFFFFF', 40, 26);
};

// ============================================================================================================
// FACE EXTRAS — (ctx, c, fx, fy, hw, hh, view, face, phase)   phase 'under' = before the mouth, 'over' = after it
// ============================================================================================================
// in side view keep facial hair inside the head silhouette (face edge = +hw/2)
function pp_sideClip(ctx, hw, hh, view) { if (view !== 'side') return; ctx.beginPath(); ctx.rect(-hw, -hh - 200, hw * 1.5 + 2, hh + 400); ctx.clip(); }
function pp_stache(ctx, mx, my, col, s = 1, curly = false) {
  ctx.save(); ctx.translate(mx, my - 20); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, -6); ctx.quadraticCurveTo(-20, -16, -40, -6); ctx.quadraticCurveTo(-52, 2, -46, 12); ctx.quadraticCurveTo(-28, 4, 0, 6);
  ctx.quadraticCurveTo(28, 4, 46, 12); ctx.quadraticCurveTo(52, 2, 40, -6); ctx.quadraticCurveTo(20, -16, 0, -6); ctx.closePath(); fillStroke(ctx, col, 6 / s);
  if (curly) for (const d of [-1, 1]) pp_cord(ctx, k => { k.moveTo(d * 44, 8); k.quadraticCurveTo(d * 62, 4, d * 60, -10); k.quadraticCurveTo(d * 56, -18, d * 50, -10); }, col, 5);
  ctx.restore();
}
FACE_EXTRAS.beard = (ctx, c, fx, fy, hw, hh, view, f, phase) => {
  if (phase !== 'under') return; pp_sideClip(ctx, hw, hh, view);
  const col = c.beardC || c.hairC, top = -hh + 8, bot = top + hh, { mx, my } = pp_mouth(fx, fy, view);
  const L = view === 'side' ? -hw * .06 : -hw / 2 + 2, R = hw / 2 - 2;
  ctx.beginPath(); ctx.moveTo(L, fy - 36); ctx.lineTo(L, bot - 46); ctx.quadraticCurveTo(L + 4, bot + 22, mx, bot + 26); ctx.quadraticCurveTo(R - 4, bot + 22, R, bot - 46);
  ctx.lineTo(R, fy - 36); ctx.lineTo(R - 18, fy - 36); ctx.lineTo(R - 20, fy + 2);
  ctx.quadraticCurveTo(mx + 66, fy + 18, mx + 50, my + 6); ctx.quadraticCurveTo(mx + 40, my + 38, mx, my + 38); ctx.quadraticCurveTo(mx - 40, my + 38, mx - 50, my + 6);
  ctx.quadraticCurveTo(mx - 66, fy + 18, L + 18, fy + 2); ctx.lineTo(L + 18, fy - 36); ctx.closePath(); fillStroke(ctx, col, 7);
  ctx.strokeStyle = shade(col, .2); ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(mx + s * 66, my + 6); ctx.lineTo(mx + s * 60, my + 22); ctx.moveTo(mx + s * 20, my + 50); ctx.lineTo(mx + s * 16, my + 62); ctx.stroke(); }
  pp_stache(ctx, mx, my, col, 1);
};
FACE_EXTRAS.mustache = (ctx, c, fx, fy, hw, hh, view, f, phase) => {
  if (phase !== 'under') return; pp_sideClip(ctx, hw, hh, view); const { mx, my } = pp_mouth(fx, fy, view);
  pp_stache(ctx, mx, my, c.mustacheC || c.beardC || c.hairC, 1, c.mustacheStyle === 'curly');
};
FACE_EXTRAS.bigMustache = (ctx, c, fx, fy, hw, hh, view, f, phase) => {
  if (phase !== 'under') return; pp_sideClip(ctx, hw, hh, view); const { mx, my } = pp_mouth(fx, fy, view), col = c.mustacheC || c.beardC || c.hairC;
  const sh = [];
  for (let i = -3; i <= 3; i++) sh.push([mx + i * 17, my - 24 + Math.abs(i) * 3, 20 - Math.abs(i) * 1.2]);
  sh.push([mx - 64, my - 10, 14], [mx + 64, my - 10, 14]);
  pp_union(ctx, sh, col, 6);
  ctx.strokeStyle = shade(col, -.2); ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(mx + s * (10 + k * 18), my - 30); ctx.lineTo(mx + s * (14 + k * 18), my - 14); ctx.stroke(); }
};
FACE_EXTRAS.stubble = (ctx, c, fx, fy, hw, hh, view, f, phase) => {
  if (phase !== 'under') return; pp_sideClip(ctx, hw, hh, view);
  const top = -hh + 8, bot = top + hh, L = view === 'side' ? -hw * .06 : -hw / 2 + 4, R = hw / 2 - 4, col = c.beardC || c.hairC;
  ctx.save(); ctx.beginPath(); ctx.moveTo(L, fy); ctx.lineTo(R, fy); ctx.lineTo(R, bot - 50); ctx.quadraticCurveTo(R, bot - 2, R - 50, bot - 2); ctx.lineTo(L + 50, bot - 2); ctx.quadraticCurveTo(L, bot - 2, L, bot - 50); ctx.closePath();
  ctx.clip(); ctx.fillStyle = 'rgba(60,40,40,.10)'; ctx.fillRect(L, fy, R - L, bot - fy);
  ctx.fillStyle = col; ctx.globalAlpha *= .45;
  for (let r = 0, yy = fy + 8; yy < bot; r++, yy += 9) for (let xx = L + 6 + (r % 2) * 5; xx < R; xx += 11) { ctx.beginPath(); ctx.arc(xx, yy, 1.8, 0, TAU); ctx.fill(); }
  ctx.restore();
};
FACE_EXTRAS.blushMakeup = (ctx, c, fx, fy, hw, hh, view, f, phase) => {
  if (phase !== 'under') return;
  ctx.save(); ctx.globalAlpha *= .5;
  for (const s of (view === 'side' ? [1] : [-1, 1])) ellipse(ctx, fx + s * 66 - (view === 'side' ? 40 : 0), fy + 16, 22, 12, c.blushC || '#FF6FA0');
  ctx.restore();
};
FACE_EXTRAS.sunglasses = (ctx, c, fx, fy, hw, hh, view, f, phase) => {
  if (phase !== 'over') return;
  const { ey, xs } = pp_eyes(fx, fy, view), col = c.shadesC || '#1E1E2A';
  ctx.lineCap = 'round'; ctx.strokeStyle = OUTLINE; ctx.lineWidth = 7;
  if (xs.length > 1) { ctx.beginPath(); ctx.moveTo(xs[0] + 36, ey - 8); ctx.quadraticCurveTo(fx, ey - 18, xs[1] - 36, ey - 8); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(xs[0] - 40, ey - 12); ctx.lineTo(view === 'side' ? -hw * .1 : -hw / 2 + 2, ey - 16); if (xs.length > 1) { ctx.moveTo(xs[1] + 40, ey - 12); ctx.lineTo(hw / 2 - 2, ey - 16); } ctx.stroke();
  for (const x of xs) {
    box(ctx, x - 40, ey - 28, 80, 54, 20, col, 7);
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 24, ey - 6); ctx.lineTo(x - 10, ey - 18); ctx.stroke();
  }
};
FACE_EXTRAS.squareGlasses = (ctx, c, fx, fy, hw, hh, view, f, phase) => {
  if (phase !== 'under') return;
  const { ey, xs } = pp_eyes(fx, fy, view), col = c.glassesC || '#2B2B3A';
  ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineJoin = 'round';
  for (const x of xs) { rr(ctx, x - 37, ey - 31, 74, 60, 14); ctx.stroke(); }
  ctx.beginPath(); if (xs.length > 1) { ctx.moveTo(xs[0] + 37, ey - 6); ctx.lineTo(xs[1] - 37, ey - 6); }
  ctx.moveTo(xs[0] - 37, ey - 10); ctx.lineTo(view === 'side' ? -hw * .1 : -hw / 2 + 2, ey - 14); if (xs.length > 1) { ctx.moveTo(xs[1] + 37, ey - 10); ctx.lineTo(hw / 2 - 2, ey - 14); } ctx.stroke();
};
FACE_EXTRAS.pacifier = (ctx, c, fx, fy, hw, hh, view, f, phase) => {
  if (phase !== 'over') return;
  const { mx, my } = pp_mouth(fx, fy, view), pc = c.paciC || '#7FD3FF';
  pp_cord(ctx, k => k.arc(mx, my + 24, 15, 0, TAU), shade(pc, -.1), 6);
  ellipse(ctx, mx, my + 2, 38, 22, pc, 7); circle(ctx, mx, my + 4, 12, shade(pc, .45), 5);
  ctx.save(); ctx.globalAlpha *= .6; ellipse(ctx, mx - 18, my - 6, 9, 5, '#FFFFFF'); ctx.restore();
};
FACE_EXTRAS.wrinkles = (ctx, c, fx, fy, hw, hh, view, f, phase) => {
  if (phase !== 'under') return;
  const { ey, xs } = pp_eyes(fx, fy, view), { mx, my } = pp_mouth(fx, fy, view);
  ctx.strokeStyle = shade(c.skin, -.32); ctx.lineWidth = 4; ctx.lineCap = 'round';
  xs.forEach((x, i) => { const s = xs.length > 1 ? (i ? 1 : -1) : 1; ctx.beginPath();
    for (const dy of [-10, 2, 14]) { ctx.moveTo(x + s * 34, ey + dy * .4); ctx.lineTo(x + s * 48, ey + dy); } ctx.stroke(); });
  for (const s of (view === 'side' ? [-1] : [-1, 1])) { ctx.beginPath(); ctx.moveTo(mx + s * 40, my - 30); ctx.quadraticCurveTo(mx + s * 50, my - 14, mx + s * 46, my + 2); ctx.stroke(); }
};
FACE_EXTRAS.heavyLids = (ctx, c, fx, fy, hw, hh, view, f, phase) => {
  if (phase !== 'over') return;
  const E = EXPR[f.expr || 'neutral'] || EXPR.neutral, eo = Object.assign({ open: 1 }, E.eyes, f.eyes || {});
  if (eo.shape || eo.open > 1.05 || f.noLids) return;
  const { ey, xs } = pp_eyes(fx, fy, view), ry = 30 * eo.open;
  for (const x of xs) {
    ctx.beginPath(); ctx.ellipse(x, ey, 28, ry + 3, 0, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = f.pale ? '#BFE3D8' : c.skin; ctx.fill();
    ctx.strokeStyle = OUTLINE; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 26, ey + 1); ctx.quadraticCurveTo(x, ey - 3, x + 26, ey + 1); ctx.stroke();
  }
};

// ============================================================================================================
// ACCESSORIES — (ctx, c, x, y, tw, h, view)   drawn over the torso, under the arms
// ============================================================================================================
ACCESSORIES.tie = (ctx, c, x, y, tw, h, view) => { if (!pp_nf(view)) pp_tie(ctx, pp_tcx(tw, view), y, c.tieC || '#EE384A', 104); };
ACCESSORIES.bowtie = (ctx, c, x, y, tw, h, view) => {
  if (pp_nf(view)) return; const cx = pp_tcx(tw, view), col = c.tieC || '#EE384A';
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx, y + 30); ctx.lineTo(cx + s * 34, y + 14); ctx.quadraticCurveTo(cx + s * 40, y + 30, cx + s * 34, y + 46); ctx.closePath(); fillStroke(ctx, col, 6); }
  box(ctx, cx - 10, y + 20, 20, 20, 6, shade(col, -.15), 5);
};
ACCESSORIES.whistle = (ctx, c, x, y, tw, h, view) => {
  const cx = pp_tcx(tw, view), lc = c.lanyardC || '#EE384A';
  pp_cord(ctx, k => { k.moveTo(cx - 36, y + 10); k.lineTo(cx - 2, y + 90); k.lineTo(cx + 36, y + 10); }, lc, 7);
  circle(ctx, cx, y + 94, 9, '#C9D2DC', 4);
  box(ctx, cx - 8, y + 98, 50, 28, 12, '#C9D2DC', 6); box(ctx, cx + 34, y + 102, 22, 14, 4, '#AEB8C4', 5);
  ctx.save(); ctx.globalAlpha *= .6; ellipse(ctx, cx + 8, y + 106, 10, 4, '#FFFFFF'); ctx.restore();
};
ACCESSORIES.stethoscope = (ctx, c, x, y, tw, h, view) => {
  const cx = pp_tcx(tw, view), tc = c.stethoC || '#3A3F55';
  pp_cord(ctx, k => { k.moveTo(cx - 52, y + 10); k.quadraticCurveTo(cx - 62, y + 80, cx - 30, y + 116); }, tc, 7);
  pp_cord(ctx, k => { k.moveTo(cx + 52, y + 10); k.quadraticCurveTo(cx + 60, y + 60, cx + 40, y + 84); }, tc, 7);
  circle(ctx, cx - 28, y + 124, 15, '#C9D2DC', 6); circle(ctx, cx - 28, y + 124, 6, '#9AA4B0', 3);
  circle(ctx, cx + 38, y + 88, 7, '#C9D2DC', 4);
};
ACCESSORIES.badge = (ctx, c, x, y, tw, h, view) => {
  if (pp_nf(view)) return; const bx = pp_tcx(tw, view) + tw * .26, by = y + 62, col = c.badgeC || '#FFD447';
  if (c.badgeShape === 'star') { starPath(ctx, bx, by, 24, 11); fillStroke(ctx, col, 5); circle(ctx, bx, by, 6, shade(col, -.2), 3); }
  else { pp_shield(ctx, bx, by, 20, col); starPath(ctx, bx, by + 2, 9, 4); fillStroke(ctx, shade(col, -.25), 0); }
};
ACCESSORIES.nameTag = (ctx, c, x, y, tw, h, view) => {
  if (pp_nf(view)) return; const nx = pp_tcx(tw, view) - tw * .38, ny = y + 54;
  box(ctx, nx, ny, 58, 40, 6, '#FFFFFF', 5);
  ctx.save(); rr(ctx, nx, ny, 58, 40, 6); ctx.clip(); ctx.fillStyle = c.tagC || '#EE384A'; ctx.fillRect(nx, ny, 58, 13); ctx.restore(); rr(ctx, nx, ny, 58, 40, 6); fillStroke(ctx, null, 5);
  ctx.strokeStyle = '#9AA4B0'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(nx + 10, ny + 22); ctx.lineTo(nx + 46, ny + 22); ctx.moveTo(nx + 10, ny + 31); ctx.lineTo(nx + 34, ny + 31); ctx.stroke();
};
ACCESSORIES.scarf = (ctx, c, x, y, tw, h, view) => {
  const cx = pp_tcx(tw, view), sc = c.mufflerC || '#EE384A', st = c.mufflerStripe || '#FFFFFF';
  const tail = k => rr(k, cx + tw * .1, y + 26, 40, 104, 10);
  if (view !== 'back') {
  tail(ctx); fillStroke(ctx, sc, 7);
  ctx.save(); tail(ctx); ctx.clip(); ctx.fillStyle = st; for (let yy = y + 44; yy < y + 130; yy += 30) ctx.fillRect(cx, yy, 80, 12); ctx.restore(); tail(ctx); fillStroke(ctx, null, 7);
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(cx + tw * .1 + 6 + i * 9, y + 130); ctx.lineTo(cx + tw * .1 + 6 + i * 9, y + 144); ctx.stroke(); }
  }
  const wrap = k => rr(k, cx - tw * .46, y + 4, tw * .92, 42, 20);
  wrap(ctx); fillStroke(ctx, sc, 8);
  ctx.save(); wrap(ctx); ctx.clip(); ctx.fillStyle = st; for (let xx = cx - tw * .46 + 14; xx < cx + tw * .46; xx += 34) ctx.fillRect(xx, y, 12, 60); ctx.restore(); wrap(ctx); fillStroke(ctx, null, 8);
};
ACCESSORIES.neckerchief = (ctx, c, x, y, tw, h, view) => {
  const cx = pp_tcx(tw, view), kc = c.kerchiefC || '#EE384A';
  ctx.beginPath(); ctx.moveTo(cx - 46, y + 18); ctx.lineTo(cx + 46, y + 18); ctx.lineTo(cx + 4, y + 70); ctx.closePath(); fillStroke(ctx, kc, 6);
  box(ctx, cx - 50, y + 8, 100, 20, 9, kc, 6); circle(ctx, cx, y + 26, 11, shade(kc, -.15), 5);
};
ACCESSORIES.backpack = (ctx, c, x, y, tw, h, view) => {
  const cx = pp_tcx(tw, view), bc = c.bagC || '#FF8528';
  if (view === 'back') { box(ctx, x + 14, y + 18, tw - 28, h - 4, 26, bc, 8); box(ctx, x + 34, y + h * .5, tw - 68, h * .4, 14, shade(bc, -.12), 6); return; }
  if (view === 'side' || view === 'q34') { box(ctx, x - (view === 'side' ? 40 : 30), y + 22, view === 'side' ? 60 : 40, h - 18, 18, bc, 8); if (view === 'side') box(ctx, x - 46, y + 80, 30, 54, 10, shade(bc, -.15), 6); }
  for (const s of (view === 'side' ? [0] : [-1, 1])) {
    const sx = cx + s * tw * .3;
    box(ctx, sx - 12, y + 4, 24, h - 26, 10, shade(bc, -.12), 6);
    box(ctx, sx - 15, y + h * .5, 30, 14, 4, '#3A3F55', 4);
  }
};
ACCESSORIES.necklace = (ctx, c, x, y, tw, h, view) => {
  if (pp_nf(view)) return; const cx = pp_tcx(tw, view), nc = c.necklaceC || '#FFFFFF';
  for (let i = 0; i <= 10; i++) { const a = Math.PI * (.12 + i * .076); circle(ctx, cx + Math.cos(a) * 46, y + 14 + Math.sin(a) * 38, 6, nc, 3); }
  heartPath(ctx, cx, y + 64, 16); fillStroke(ctx, c.pendantC || '#FF5B9B', 4);
};
ACCESSORIES.headphones = (ctx, c, x, y, tw, h, view) => {
  const cx = pp_tcx(tw, view), hc = c.headphoneC || '#222331';
  pp_cord(ctx, k => { k.moveTo(cx - 58, y + 26); k.quadraticCurveTo(cx, y + 66, cx + 58, y + 26); }, hc, 12);
  for (const s of (view === 'side' ? [1] : [-1, 1])) { ctx.save(); ctx.translate(cx + s * 62, y + 26); ctx.rotate(s * .35); box(ctx, -20, -26, 40, 52, 16, hc, 7); box(ctx, -11, -16, 22, 32, 8, c.ledC || '#20BDBB', 4); ctx.restore(); }
};
ACCESSORIES.medal = (ctx, c, x, y, tw, h, view) => {
  const cx = pp_tcx(tw, view);
  pp_cord(ctx, k => { k.moveTo(cx - 34, y + 10); k.lineTo(cx, y + 92); k.lineTo(cx + 34, y + 10); }, c.ribbonC || '#2E62C9', 10);
  circle(ctx, cx, y + 108, 22, c.medalC || '#FFD447', 6); starPath(ctx, cx, y + 108, 11, 5); fillStroke(ctx, shade(c.medalC || '#FFD447', -.25), 0);
};

// chest-front accessories are hidden when the character is seen from behind
for (const k of ['tie', 'bowtie', 'whistle', 'stethoscope', 'badge', 'nameTag', 'neckerchief', 'necklace', 'headphones', 'medal']) {
  const fn = ACCESSORIES[k]; ACCESSORIES[k] = (ctx, c, x, y, tw, h, view) => { if (view !== 'back') fn(ctx, c, x, y, tw, h, view); };
}

// ============================================================================================================
// CAST — new characters (all fields the rig reads + pack fields)
// ============================================================================================================
Object.assign(CAST, {
  // ---- family ----
  dad: { skin: '#EDB98A', shirt: '#2E62C9', sleeve: '#2E62C9', pants: '#C9A877', shoes: '#5A3A22', hair: 'shortSide', hairC: '#5A3A22', brow: '#3E2614',
         outfit: 'polo', collarC: '#FFFFFF', shortSleeves: true, facial: ['beard', 'squareGlasses'], seed: 100, tall: 1.14 },
  grandpa: { skin: '#F2CDB0', shirt: '#A0623A', sleeve: '#A0623A', inner: '#F0E6C8', pants: '#6B6B7A', shoes: '#3A2A22', hair: 'grandpa', hairC: '#ECECF2', brow: '#C8C8D0',
             outfit: 'cardigan', buttonC: '#F0E6C8', glasses: true, facial: ['bigMustache', 'wrinkles'], seed: 101, tall: 1.05 },
  teenSister: { skin: '#F3C4A6', shirt: '#B9A3FF', sleeve: '#B9A3FF', pants: '#2B2B3A', shoes: '#FFFFFF', hair: 'topBun', hairC: '#3A2418', brow: '#3A2418',
                bunTie: '#20BDBB', bunStrands: true, outfit: 'hoodie', facial: ['heavyLids'], girl: true, seed: 102, tall: 1.08 },
  littleBrother: { skin: '#EDB98A', shirt: '#30CE65', sleeve: '#30CE65', pants: '#2E62C9', shoes: '#FF8528', hair: 'messy', hairC: '#5A3A22', brow: '#3E2614',
                   outfit: 'graphicTee', graphic: 'dino', graphicC: '#2E9E5B', shortSleeves: true, shorts: true, seed: 103, tall: .8 },
  babySister: { skin: '#F7D2B0', shirt: '#FFB3D1', sleeve: '#FFB3D1', pants: '#FFB3D1', shoes: '#FFB3D1', hair: 'babyTuft', hairC: '#5A3A22', brow: '#8A5A3A',
                bowC: '#FF5B9B', outfit: 'onesie', barefoot: true, lashes: true, girl: true, seed: 104, tall: .58 },
  aunt: { skin: '#C98E66', shirt: '#FFC83D', sleeve: '#FFC83D', pants: '#C98E66', shoes: '#E07A3A', hair: 'curlyLong', hairC: '#2A1A12', brow: '#2A1A12',
          outfit: 'dress', dressStraps: true, dotC: '#FFFFFF', sashC: '#FF8528', sleeveless: true, lashes: true, facial: ['blushMakeup'], acc: ['necklace'], necklaceC: '#FFFFFF', girl: true, seed: 106, tall: 1.1 },
  uncle: { skin: '#F1C08E', shirt: '#20BDBB', sleeve: '#20BDBB', pants: '#C9A877', shoes: '#F4F4F4', hair: 'backwardsCap', hairC: '#7A4B2A', capC: '#EE384A', brow: '#5A3418',
           outfit: 'hawaiian', flowerC: '#FFD447', shortSleeves: true, shorts: true, facial: ['stubble'], seed: 107, tall: 1.15 },
  cousin: { skin: '#C68B5E', shirt: '#FFD447', sleeve: '#FFD447', pants: '#3E5BA9', shoes: '#FF5B9B', hair: 'braids', hairC: '#2A1A12', brow: '#2A1A12', beadC: '#FF5B9B',
            outfit: 'overalls', shortSleeves: true, lashes: true, girl: true, seed: 108 },
  mom2: { skin: '#7A4A2E', shirt: '#FF8528', sleeve: '#FF8528', inner: '#FFF3D6', pants: '#2F3A5C', shoes: '#7A4B33', hair: 'afro', hairC: '#1A1210', brow: '#1A1210',
          outfit: 'cardigan', lashes: true, acc: ['necklace'], necklaceC: '#FFD447', pendantC: '#20BDBB', girl: true, seed: 109, tall: 1.12 },
  dad2: { skin: '#5E3A24', shirt: '#8FB8E8', sleeve: '#8FB8E8', pants: '#3A3F55', shoes: '#2A1A12', hair: 'flatTop', hairC: '#14100E', brow: '#14100E',
          outfit: 'workShirt', acc: ['tie'], tieC: '#2E3A8C', facial: ['mustache'], seed: 110, tall: 1.16 },
  // ---- community ----
  lifeguard: { skin: '#D9A27A', shirt: '#FFFFFF', sleeve: '#FFFFFF', pants: '#EE384A', shoes: '#fff', hair: 'shortSide', hairC: '#E8C24A', brow: '#B08A2A',
               outfit: 'tankTop', crossC: '#EE384A', sleeveless: true, shorts: true, barefoot: true, facial: ['sunglasses'], acc: ['whistle'], lanyardC: '#FFD447', seed: 120, tall: 1.14 },
  coach: { skin: '#E8B48C', shirt: '#2E62C9', sleeve: '#2E62C9', pants: '#2E62C9', shoes: '#FFFFFF', hair: 'cap', hairC: '#5A3A22', capC: '#EE384A', brow: '#3E2614',
           outfit: 'tracksuit', stripeC: '#FFFFFF', facial: ['mustache'], acc: ['whistle'], seed: 121, tall: 1.14 },
  doctor: { skin: '#C68B5E', shirt: '#FDFDFD', sleeve: '#FDFDFD', inner: '#80CDF5', pants: '#3A4A6A', shoes: '#2B2B3A', hair: 'pony', hairC: '#2A1A12', brow: '#2A1A12',
            outfit: 'labCoat', glasses: true, lashes: true, acc: ['stethoscope'], girl: true, seed: 122, tall: 1.12 },
  nurse: { skin: '#E8B48C', shirt: '#4FC3B8', sleeve: '#4FC3B8', pants: '#4FC3B8', shoes: '#FFFFFF', hair: 'shortSide', hairC: '#1E1414', brow: '#1E1414',
           outfit: 'scrubs', shortSleeves: true, acc: ['nameTag'], tagC: '#2E62C9', seed: 123, tall: 1.12 },
  police: { skin: '#F1C08E', shirt: '#2B3F7A', sleeve: '#2B3F7A', pants: '#1E2747', shoes: '#111111', hair: 'policeCap', hairC: '#3A2418', capC: '#1E2747', brow: '#3A2418',
            outfit: 'policeUniform', acc: ['badge'], seed: 124, tall: 1.15 },
  firefighter: { skin: '#9A6440', shirt: '#D9A83A', sleeve: '#D9A83A', pants: '#D9A83A', shoes: '#222331', hair: 'fireHelmet', hairC: '#1A1210', helmetC: '#EE384A', brow: '#1A1210',
                 outfit: 'fireJacket', number: 7, seed: 125, tall: 1.16 },
  cashier: { skin: '#F2C29A', shirt: '#FFFFFF', sleeve: '#FFFFFF', pants: '#2F3A5C', shoes: '#30CE65', hair: 'pony', hairC: '#D9572B', brow: '#A8401E',
             outfit: 'apron', apronC: '#2E9E5B', shortSleeves: true, freckles: true, lashes: true, acc: ['nameTag'], tagC: '#FFD447', girl: true, seed: 126, tall: 1.1 },
  principal: { skin: '#E0A57E', shirt: '#3A3F55', sleeve: '#3A3F55', pants: '#3A3F55', shoes: '#111111', hair: 'shortSide', hairC: '#A4A4B0', brow: '#7A7A86',
               outfit: 'suitTie', tieC: '#EE384A', glasses: true, facial: ['mustache'], seed: 127, tall: 1.16 },
  librarian: { skin: '#F2C29A', shirt: '#6FA052', sleeve: '#6FA052', inner: '#FFF3D6', pants: '#6B5A4A', shoes: '#7A4B33', hair: 'topBun', hairC: '#6B4220', brow: '#4A2810',
               bunTie: '#B44BFF', bunPencil: true, outfit: 'cardigan', glasses: true, lashes: true, acc: ['necklace'], necklaceC: '#FFD447', pendantC: '#B44BFF', girl: true, seed: 128, tall: 1.1 },
  busDriver: { skin: '#8D5A3B', shirt: '#80CDF5', sleeve: '#80CDF5', pants: '#3A3F55', shoes: '#111111', hair: 'policeCap', hairC: '#1E1414', capC: '#3E5BA9', badgeC: '#FFD447', brow: '#1E1414',
               outfit: 'workShirt', patchC: '#FFC83D', shortSleeves: true, facial: ['beard'], acc: ['tie'], tieC: '#3E5BA9', seed: 129, tall: 1.14 },
  iceCreamVendor: { skin: '#F7D2B0', shirt: '#FFFFFF', sleeve: '#FFFFFF', pants: '#3E5BA9', shoes: '#FFFFFF', hair: 'paperHat', hairC: '#3A2418', stripeC: '#FF5B9B', brow: '#3A2418',
                    outfit: 'apron', apronC: '#FF8FC0', apronStripes: '#FFFFFF', shortSleeves: true, facial: ['mustache'], mustacheStyle: 'curly', acc: ['bowtie'], tieC: '#FF5B9B', seed: 130, tall: 1.12 },
  babysitter: { skin: '#E8B48C', shirt: '#FF8FC0', sleeve: '#FF8FC0', pants: '#3E5BA9', shoes: '#FFFFFF', hair: 'longWavy', hairC: '#C98A3A', brow: '#8A5A20',
                outfit: 'graphicTee', graphic: 'heart', graphicC: '#FFFFFF', shortSleeves: true, lashes: true, girl: true, seed: 131, tall: 1.08 },
  neighborGranny: { skin: '#E9B48A', shirt: '#FF8FC0', sleeve: '#FF8FC0', pants: '#FF8FC0', shoes: '#FFD1E3', hair: 'curlers', hairC: '#B8B8C4', brow: '#9A9AA6',
                    outfit: 'robe', dotC: '#FFFFFF', beltC: '#E05A8A', glasses: true, lashes: true, facial: ['wrinkles'], girl: true, seed: 132, tall: 1.0 },
  chef: { skin: '#E0A57E', shirt: '#FFFFFF', sleeve: '#FFFFFF', pants: '#3A3A3A', shoes: '#111111', hair: 'chefHat', hairC: '#3A2418', brow: '#3A2418',
          outfit: 'chefJacket', facial: ['mustache'], mustacheStyle: 'curly', acc: ['neckerchief'], seed: 133, tall: 1.14 },
  streamer: { skin: '#F2C29A', shirt: '#7B4BFF', sleeve: '#7B4BFF', pants: '#2B2B3A', shoes: '#30CE65', hair: 'headsetOn', hairUnder: 'messy', hairC: '#2A2033', brow: '#2A2033',
              headsetC: '#222331', outfit: 'hoodie', graphic: 'bolt', graphicC: '#FFD447', seed: 134 },
  djKid: { skin: '#B5774E', shirt: '#2B2B3A', sleeve: '#2B2B3A', pants: '#3E5BA9', shoes: '#FF5B9B', hair: 'backwardsCap', hairC: '#1A1210', capC: '#30CE65', brow: '#1A1210',
           outfit: 'graphicTee', graphic: 'planet', graphicC: '#FF5B9B', shortSleeves: true, facial: ['sunglasses'], shadesC: '#7B4BFF', acc: ['headphones'], seed: 135 },
  // ---- more classmates ----
  kidG: { skin: '#7A4A2E', shirt: '#FFD447', sleeve: '#FFD447', pants: '#3E5BA9', shoes: '#FFFFFF', hair: 'afroPuff', hairC: '#1A1210', brow: '#1A1210', puffTie: '#FF5B9B',
          outfit: 'stripedTee', stripeC: '#FF5B9B', lashes: true, girl: true, seed: 140 },
  kidH: { skin: '#F2C29A', shirt: '#EE384A', sleeve: '#EE384A', pants: '#222331', shoes: '#FFD447', hair: 'mohawk', hairC: '#2B2B2B', tipC: '#2E9BFF', brow: '#2B2B2B',
          outfit: 'jersey', number: 7, trimC: '#FFFFFF', shortSleeves: true, seed: 141 },
  kidI: { skin: '#5E3A24', shirt: '#20BDBB', sleeve: '#20BDBB', pants: '#2F3A5C', shoes: '#FF5B9B', hair: 'boxBraids', hairC: '#1A1210', beadC: '#FFD447', brow: '#1A1210',
          outfit: 'graphicTee', graphic: 'star', graphicC: '#FFD447', shortSleeves: true, lashes: true, girl: true, seed: 142 },
  kidJ: { skin: '#F7D2B0', shirt: '#FFFFFF', sleeve: '#FFFFFF', pants: '#C9A877', shoes: '#7A4B33', hair: 'shortSide', hairC: '#D9572B', brow: '#A8401E',
          outfit: 'sweaterVest', vestC: '#2E9E5B', glasses: true, freckles: true, acc: ['backpack'], bagC: '#FF8528', seed: 143 },
  kidK: { skin: '#D9A27A', shirt: '#2E62C9', sleeve: '#2E62C9', pants: '#2F3A5C', shoes: '#FFFFFF', hair: 'headscarf', hairC: '#FF5B9B', scarfC: '#FF5B9B', brow: '#3A2418',
          outfit: 'dress', dotC: '#FFD447', sashC: '#FFD447', collarC: '#FFFFFF', lashes: true, girl: true, seed: 144 },
  kidL: { skin: '#F7D2B0', shirt: '#EE384A', sleeve: '#EE384A', pants: '#3A3F55', shoes: '#FFFFFF', hair: 'beanie', hairC: '#8A5A2B', capC: '#FFC83D', pomC: '#FFFFFF', brow: '#6B4220',
          outfit: 'hoodie', seed: 145 },
});
// badge/label height over the hair (fx_ui.js badgeOver)
if (typeof HAIR_LIFT !== 'undefined') Object.assign(HAIR_LIFT, { teenSister: 70, aunt: 34, uncle: 10, mom2: 76, dad2: 56, coach: 30, doctor: 10, police: 70,
  firefighter: 84, principal: 18, librarian: 66, busDriver: 70, iceCreamVendor: 54, chef: 176, streamer: 30, kidG: 104, kidH: 92, kidL: 100, littleBrother: 30, neighborGranny: 34, dad: 22 });

// ============================================================================================================
// STYLE — per-shot costume overrides (face.style). Works for ANY cast member.
// ============================================================================================================
const PP_PAL = ['#EE384A', '#2E62C9', '#FFC83D', '#30A08A', '#FF5B9B', '#7B4BFF', '#FF8528', '#20BDBB'];
function pp_pick(name, arr, k = 0) { const c = CAST[name] || {}; return arr[((c.seed || 1) * 7 + k * 3) % arr.length]; }
function pp_hatless(c) { if (!PP_HATS.has(c.hair)) return {}; return { hair: c.hairUnder && !PP_HATS.has(c.hairUnder) ? c.hairUnder : 'shortSide', hairUnder: null }; }
function pp_baseHair(c) { if (c.hair === 'headscarf' || c.hair === 'hijab') return null; return PP_HATS.has(c.hair) ? (c.hairUnder && !PP_HATS.has(c.hairUnder) ? c.hairUnder : 'shortSide') : c.hair; }
const STYLE = {
  isGirl(name) { const c = CAST[name] || {}; return c.girl ?? !!(c.lashes || name === 'kidA'); },
  swim(name, over = {}) {
    const c = CAST[name] || {}, col = over.color || pp_pick(name, PP_PAL), scarf = c.hair === 'headscarf' || c.hair === 'hijab';
    const base = { outfit: 'swimTrunksTop', acc: [], barefoot: true, glasses: c.glasses, ...pp_hatless(c) };
    if (scarf) return Object.assign(base, { rashGuard: true, swimC: col, sleeve: col, pants: col, sleeveless: false, shortSleeves: false, shorts: false }, over);
    if (STYLE.isGirl(name)) return Object.assign(base, { swimC: col, pants: col, sleeveless: true, shorts: true, swimPattern: pp_pick(name, ['dots', 'stars', 'hearts']) }, over);
    return Object.assign(base, { swimC: null, rashGuard: false, pants: col, sleeveless: true, shorts: true }, over);
  },
  beach(name, over = {}) { const s = STYLE.swim(name); const f = [].concat((CAST[name] || {}).facial || []); if (!f.includes('sunglasses')) f.push('sunglasses'); return Object.assign(s, { facial: f }, over); },
  pajamas(name, over = {}) {
    const c = CAST[name] || {}, girl = STYLE.isGirl(name);
    const col = over.color || pp_pick(name, girl ? ['#FFB3D1', '#B9A3FF', '#9FE3B4', '#80CDF5'] : ['#80CDF5', '#9FE3B4', '#B9A3FF', '#FFD98A']);
    const st = { outfit: 'pajamas', shirt: col, sleeve: col, pants: col, shoes: '#F4EDE0', pjPattern: pp_pick(name, girl ? ['hearts', 'dots', 'stars'] : ['stars', 'moons', 'stripes']),
      acc: [], shortSleeves: false, sleeveless: false, shorts: false, barefoot: false, ...pp_hatless(c) };
    if (over.nightcap && c.hair !== 'headscarf') Object.assign(st, { hair: 'nightcap', hairUnder: pp_baseHair(c), capC: shade(col, -.15) });
    const o = Object.assign({}, over); delete o.nightcap; delete o.color;
    return Object.assign(st, o);
  },
  winter(name, over = {}) {
    const c = CAST[name] || {}, coat = over.color || pp_pick(name, PP_PAL), scarf = pp_pick(name, PP_PAL, 3) === coat ? '#FFFFFF' : pp_pick(name, PP_PAL, 3);
    const st = { outfit: 'winterCoat', coatC: coat, shirt: coat, sleeve: coat, acc: ['scarf'], mufflerC: scarf, mufflerStripe: '#FFFFFF', shortSleeves: false, sleeveless: false, shorts: false, barefoot: false };
    if (c.hair !== 'headscarf' && c.hair !== 'hijab') Object.assign(st, { hair: 'beanie', hairUnder: pp_baseHair(c), capC: scarf, pomC: '#FFFFFF' });
    const o = Object.assign({}, over); delete o.color; return Object.assign(st, o);
  },
  party(name, over = {}) {
    const c = CAST[name] || {};
    if (c.hair === 'headscarf' || c.hair === 'hijab') return Object.assign({}, over);
    return Object.assign({ hair: 'partyHat', hairUnder: pp_baseHair(c), partyC: pp_pick(name, PP_PAL, 1), partyC2: '#FFD447', pomC: pp_pick(name, PP_PAL, 2) }, over);
  },
  sports(name, number = 10, over = {}) {
    const c = CAST[name] || {}, col = over.color || pp_pick(name, PP_PAL, 4);
    const st = { outfit: 'jersey', number, shirt: col, sleeve: col, trimC: '#FFFFFF', pants: col === '#FFC83D' ? '#2E62C9' : '#FFFFFF', shortSleeves: true, sleeveless: false,
      shorts: c.hair !== 'headscarf', barefoot: false, acc: [], shoes: '#222331' };
    const o = Object.assign({}, over); delete o.color; return Object.assign(st, o);
  },
  pacifier(name, over = {}) { const f = [].concat((CAST[name] || {}).facial || []); if (!f.includes('pacifier')) f.push('pacifier'); return Object.assign({ facial: f }, over); },
};

// ============================================================================================================
// PROPS — hand space (origin = hand, +y along the arm away from the shoulder). holdX or holdX(options)
// ============================================================================================================
function pp_isCtx(a) { return !!a && typeof a.fillRect === 'function' && typeof a.beginPath === 'function'; }
function pp_prop(a, draw, defaults) {
  if (pp_isCtx(a)) { a.save(); draw(a, defaults); a.restore(); return; }
  const o = Object.assign({}, defaults, typeof a === 'string' ? { color: a } : typeof a === 'boolean' ? { on: a } : typeof a === 'number' ? { n: a } : (a || {}));
  return ctx => { ctx.save(); draw(ctx, o); ctx.restore(); };
}
// rotate the hand frame so local -y points to world-up (gravity-aware props)
function pp_upright(ctx, amt = 1) {
  const m = ctx.getTransform(), det = m.a * m.d - m.b * m.c; if (!det) return;
  ctx.rotate(Math.atan2(m.c / det, m.a / det) * amt);
}
function holdPhone(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 22); pp_upright(ctx, .85);
  box(ctx, -32, -74, 64, 108, 14, o.case || '#222331', 7);
  rr(ctx, -24, -64, 48, 84, 6); ctx.fillStyle = o.color || '#80CDF5'; ctx.fill();
  const tiles = ['#FF5B9B', '#FFD447', '#30CE65', '#7B4BFF', '#FF8528', '#FFFFFF'];
  for (let i = 0; i < 6; i++) box(ctx, -18 + (i % 2) * 20, -56 + Math.floor(i / 2) * 22, 16, 16, 4, tiles[i], 0);
  circle(ctx, 0, 27, 4, '#555A6A');
}, {}); }
function holdCane(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 26); pp_upright(ctx);
  pp_cord(ctx, k => { k.moveTo(0, 190); k.lineTo(0, -6); k.quadraticCurveTo(0, -46, 30, -46); k.quadraticCurveTo(56, -46, 56, -18); }, o.color || '#8B5A2B', 14);
  box(ctx, -10, 180, 20, 18, 6, '#3A3A3A', 5);
}, {}); }
function holdMug(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 22); pp_upright(ctx);
  pp_cord(ctx, k => { k.moveTo(30, -36); k.quadraticCurveTo(62, -36, 60, -10); k.quadraticCurveTo(58, 12, 30, 10); }, o.color || '#EE384A', 10);
  box(ctx, -36, -56, 72, 80, 14, o.color || '#EE384A', 7);
  ellipse(ctx, 0, -54, 30, 8, '#6B3A1E', 4);
  heartPath(ctx, 0, -14, 16); fillStroke(ctx, '#FFFFFF', 0);
  if (o.steam !== false) { ctx.save(); ctx.globalAlpha *= .6; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 12, -72); ctx.quadraticCurveTo(s * 12 + 12, -88, s * 12, -104); ctx.quadraticCurveTo(s * 12 - 12, -120, s * 12, -134); ctx.stroke(); } ctx.restore(); }
}, {}); }
function holdBabyBottle(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 26); pp_upright(ctx, .8);
  ctx.beginPath(); ctx.moveTo(-12, -92); ctx.quadraticCurveTo(0, -122, 12, -92); ctx.closePath(); fillStroke(ctx, '#F4C98A', 5);
  box(ctx, -26, -96, 52, 22, 8, o.color || '#FF8FC0', 6);
  box(ctx, -28, -76, 56, 100, 18, '#EAF6FF', 7);
  ctx.save(); rr(ctx, -28, -76, 56, 100, 18); ctx.clip(); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-30, -40, 60, 70); ctx.restore(); box(ctx, -28, -76, 56, 100, 18, null, 7);
  ctx.strokeStyle = '#9AA4B0'; ctx.lineWidth = 3; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(10, -60 + i * 20); ctx.lineTo(22, -60 + i * 20); ctx.stroke(); }
}, {}); }
function holdBall(a) { return pp_prop(a, (ctx, o) => {
  const k = o.kind || o.color || 'basket'; ctx.translate(0, 64); pp_upright(ctx);
  if (k === 'soccer') { circle(ctx, 0, 0, 46, '#FFFFFF', 7); ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.clip();
    for (const [x, y] of [[0, 0], [-34, -24], [34, -24], [-30, 30], [30, 30], [0, -46]]) { starPath(ctx, x, y, 14, 13, 5); fillStroke(ctx, OUTLINE, 0); } ctx.restore(); circle(ctx, 0, 0, 46, null, 7); }
  else if (k === 'beach') { circle(ctx, 0, 0, 48, '#FFFFFF', 7); ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); ctx.clip();
    ['#EE384A', '#FFD447', '#2E62C9'].forEach((cl, i) => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 50, i * TAU / 3, i * TAU / 3 + TAU / 6); ctx.closePath(); ctx.fillStyle = cl; ctx.fill(); });
    ctx.restore(); circle(ctx, 0, 0, 48, null, 7); circle(ctx, 0, 0, 9, '#FFFFFF', 4); }
  else { circle(ctx, 0, 0, 46, '#FF8528', 7); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-46, 0); ctx.lineTo(46, 0); ctx.moveTo(0, -46); ctx.lineTo(0, 46); ctx.moveTo(-30, -34); ctx.quadraticCurveTo(-8, 0, -30, 34); ctx.moveTo(30, -34); ctx.quadraticCurveTo(8, 0, 30, 34); ctx.stroke(); }
  ctx.save(); ctx.globalAlpha *= .35; ellipse(ctx, -16, -20, 12, 7, '#FFFFFF', 0, -.6); ctx.restore();
}, {}); }
function holdIceCream(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 22); pp_upright(ctx);
  ctx.beginPath(); ctx.moveTo(-28, -30); ctx.lineTo(28, -30); ctx.lineTo(0, 44); ctx.closePath(); fillStroke(ctx, '#E8A85A', 7);
  ctx.save(); ctx.clip(); ctx.strokeStyle = '#B87A36'; ctx.lineWidth = 3; for (let i = -3; i < 4; i++) { ctx.beginPath(); ctx.moveTo(i * 14 - 20, -30); ctx.lineTo(i * 14 + 20, 44); ctx.moveTo(i * 14 + 20, -30); ctx.lineTo(i * 14 - 20, 44); ctx.stroke(); } ctx.restore();
  const s1 = o.color || '#FF8FC0', s2 = o.color2 || '#FFF3D6';
  pp_union(ctx, [[0, -44, 32], [-22, -34, 16], [22, -34, 16]], s2, 7);
  pp_union(ctx, [[0, -86, 28], [-18, -74, 14], [18, -74, 14]], s1, 7);
  const sp = ['#FFD447', '#30CE65', '#2E62C9', '#FFFFFF']; for (let i = 0; i < 6; i++) box(ctx, -18 + (i * 13) % 36, -100 + (i * 17) % 30, 8, 3, 1.5, sp[i % 4], 0);
  circle(ctx, 4, -116, 10, '#EE384A', 5); pp_cord(ctx, k => { k.moveTo(6, -124); k.quadraticCurveTo(10, -136, 20, -140); }, '#2E9E5B', 3);
}, {}); }
function holdBalloon(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 18); pp_upright(ctx);
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-18, -110, 6, -230); ctx.stroke();
  const col = o.color || '#FF5B9B';
  ctx.beginPath(); ctx.moveTo(6, -228); ctx.lineTo(-4, -216); ctx.lineTo(16, -216); ctx.closePath(); fillStroke(ctx, col, 5);
  ellipse(ctx, 6, -300, 58, 72, col, 7);
  ctx.save(); ctx.globalAlpha *= .5; ellipse(ctx, -14, -326, 12, 22, '#FFFFFF', 0, .3); ctx.restore();
}, {}); }
function holdPizzaSlice(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 24); pp_upright(ctx, .7);
  ctx.beginPath(); ctx.moveTo(-44, -6); ctx.lineTo(44, -6); ctx.lineTo(4, -150); ctx.closePath(); fillStroke(ctx, '#FFD15C', 7);
  box(ctx, -50, -18, 100, 30, 14, '#D9893A', 7);
  for (const [x, y] of [[-12, -46], [14, -70], [0, -104], [-18, -78]]) circle(ctx, x, y, 9, '#E0423A', 4);
  ctx.save(); ctx.beginPath(); ctx.moveTo(-6, -6); ctx.quadraticCurveTo(-8, 18, -2, 28); ctx.lineWidth = 8; ctx.strokeStyle = '#FFD15C'; ctx.stroke(); ctx.restore();
}, {}); }
function holdGameController(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 34); pp_upright(ctx);
  pp_union(ctx, [{ rr: [-64, -26, 128, 46, 22] }, [-50, 14, 24], [50, 14, 24]], o.color || '#3A3F55', 7);
  box(ctx, -52, -10, 30, 10, 3, OUTLINE, 0); box(ctx, -42, -20, 10, 30, 3, OUTLINE, 0);
  circle(ctx, 38, -14, 7, '#EE384A', 3); circle(ctx, 52, -2, 7, '#30CE65', 3); circle(ctx, 24, -2, 7, '#2E62C9', 3); circle(ctx, 38, 10, 7, '#FFD447', 3);
  circle(ctx, -14, 12, 9, '#222331', 3); circle(ctx, 14, 12, 9, '#222331', 3);
}, {}); }
function holdPopcorn(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 34); pp_upright(ctx);
  const sh = []; for (let i = 0; i < 7; i++) sh.push([-36 + i * 12, -62 - (i % 2) * 12, 15]); sh.push([-14, -80, 14], [12, -82, 15]);
  pp_union(ctx, sh, '#FFF6D8', 5);
  const bucket = k => { k.beginPath(); k.moveTo(-46, -60); k.lineTo(46, -60); k.lineTo(34, 40); k.lineTo(-34, 40); k.closePath(); };
  bucket(ctx); fillStroke(ctx, '#FFFFFF', 7);
  ctx.save(); bucket(ctx); ctx.clip(); ctx.fillStyle = o.color || '#EE384A'; for (let x = -46; x < 46; x += 26) { ctx.beginPath(); ctx.moveTo(x, -60); ctx.lineTo(x + 13, -60); ctx.lineTo(x + 10, 40); ctx.lineTo(x - 2, 40); ctx.closePath(); ctx.fill(); } ctx.restore();
  bucket(ctx); fillStroke(ctx, null, 7);
}, {}); }
function holdShoppingBag(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 30); pp_upright(ctx);
  const col = o.color || '#FF8528';
  pp_cord(ctx, k => { k.moveTo(-30, 46); k.quadraticCurveTo(-26, -6, 0, -6); k.quadraticCurveTo(26, -6, 30, 46); }, shade(col, -.2), 6);
  box(ctx, -58, 40, 116, 120, 10, col, 7);
  ctx.beginPath(); ctx.moveTo(-58, 58); ctx.lineTo(58, 58); ctx.strokeStyle = shade(col, -.2); ctx.lineWidth = 4; ctx.stroke();
  heartPath(ctx, 0, 104, 22); fillStroke(ctx, '#FFFFFF', 0);
}, {}); }
function holdFlashlight(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 10);
  if (o.on !== false) { ctx.save(); ctx.globalAlpha *= .35; ctx.beginPath(); ctx.moveTo(-26, 110); ctx.lineTo(-150, 520); ctx.quadraticCurveTo(0, 560, 150, 520); ctx.lineTo(26, 110); ctx.closePath();
    ctx.fillStyle = o.color || '#FFF2A8'; ctx.fill(); ctx.restore(); }
  box(ctx, -16, -16, 32, 100, 10, o.body || '#3A3F55', 7);
  ctx.beginPath(); ctx.moveTo(-18, 80); ctx.lineTo(18, 80); ctx.lineTo(30, 110); ctx.lineTo(-30, 110); ctx.closePath(); fillStroke(ctx, o.body || '#3A3F55', 7);
  ellipse(ctx, 0, 110, 28, 8, o.on !== false ? '#FFF7C8' : '#C9D2DC', 5);
  box(ctx, -6, 14, 12, 20, 4, '#EE384A', 3);
}, {}); }
function holdPresent(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 30); pp_upright(ctx);
  const col = o.color || '#2E62C9', rb = o.ribbon || '#FFD447';
  box(ctx, -56, -96, 112, 104, 10, col, 7);
  ctx.fillStyle = rb; ctx.fillRect(-10, -96, 20, 104); ctx.fillRect(-56, -54, 112, 18); box(ctx, -56, -96, 112, 104, 10, null, 7);
  box(ctx, -62, -108, 124, 26, 8, shade(col, -.1), 7); ctx.fillStyle = rb; ctx.fillRect(-10, -106, 20, 22);
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, -110); ctx.quadraticCurveTo(s * 40, -150, s * 34, -110); ctx.closePath(); fillStroke(ctx, rb, 6); }
  circle(ctx, 0, -112, 9, shade(rb, -.15), 5);
}, {}); }
function holdSpatula(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 26); pp_upright(ctx); ctx.rotate(.22); ctx.translate(0, 40);
  box(ctx, -8, -120, 16, 160, 7, o.handle || '#8B5A2B', 6);
  box(ctx, -32, -200, 64, 86, 10, o.color || '#C9D2DC', 7);
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; for (const x of [-14, 0, 14]) { ctx.beginPath(); ctx.moveTo(x, -186); ctx.lineTo(x, -136); ctx.stroke(); }
}, {}); }
function holdWand(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 26); pp_upright(ctx); ctx.rotate(.22); ctx.translate(0, 40);
  box(ctx, -7, -130, 14, 170, 6, o.stick || '#B44BFF', 5);
  starPath(ctx, 0, -158, 38, 17); fillStroke(ctx, o.color || '#FFD447', 7);
  ctx.save(); ctx.globalAlpha *= .9; for (const [x, y, r] of [[-46, -196, 9], [44, -204, 7], [52, -140, 6], [-50, -128, 6]]) { starPath(ctx, x, y, r, r * .4, 4); fillStroke(ctx, '#FFFFFF', 0); } ctx.restore();
}, {}); }
function holdToothbrush(a) { return pp_prop(a, (ctx, o) => {
  ctx.translate(0, 26); pp_upright(ctx); ctx.rotate(.22); ctx.translate(0, 40);
  box(ctx, -9, -100, 18, 140, 8, o.color || '#20BDBB', 6);
  box(ctx, -9, -150, 18, 56, 6, o.color || '#20BDBB', 6);
  box(ctx, 8, -148, 22, 46, 4, '#FFFFFF', 5);
  ctx.strokeStyle = '#C9D2DC'; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(10, -140 + i * 10); ctx.lineTo(28, -140 + i * 10); ctx.stroke(); }
  if (o.paste !== false) pp_union(ctx, [[34, -136, 9], [36, -122, 10], [34, -108, 9]], '#7FD3FF', 4);
}, {}); }


// ======================= pack_home.js =======================
// pack_home.js — HOME environment sets (all registered with tag 'home').
// Load after core.js + env.js. Everything is drawn in WORLD space: floor line y = 1500 (FLOOR), default camera camAt(540,1060,1)
// shows x 0..1080; the background is filled for x -3000..6000, y -2000..4000. Characters (s .8, ~420 px tall) stand on y 1500, x 150..930.
//
//  SET ID        FUNCTION(S)                                   SHOWS / NOTES                                                     OPTIONS
//  livingRoom    envLivingRoom                                 couch (x 66..714, seat top y 1330), TV on stand (x 770..1170) with  {night, tv:false, screen:fn(ctx,x,y,w,h,T), couch:'#hex'}
//                                                              animated cartoon, rug, floor lamp, bookshelf, window, photo frames,
//                                                              clock, console + controllers. SIT on couch: x 200..600, feet y 1455.
//  kidsBedroom   envKidsBedroom                                bed with patchwork quilt (x -380..356, top y 1250), desk + glowing   {night}
//                                                              PC monitor (x 780..1060), gaming chair (seat y 1350, x 660), posters,
//                                                              window, toy box, rug, string lights (glow at night), lava lamp.
//                                                              SIT on bed: x 80..250, feet y 1375.
//  bathroom      envBathroom + envBathroomFront                tiled walls, sink + mirror (x -70..210), towel rack, claw-foot tub   {night}
//                                                              with bubbles (x 500..1270, rim y 1240), rubber duck, shower curtain.
//                                                              IN THE BATH: draw the character at x 760..1000, y 1490 (s .8), then
//                                                              call envBathroomFront → only head + shoulders show above the rim.
//  diningRoom    envDiningRoom + envDiningRoomFront            table with a family dinner (x 30..1050, top y 1270..1330), 3 chairs  {night, table:false}
//                                                              (backs at x 250/540/830), pendant lamp, window, hutch with plates.
//                                                              AT THE TABLE: stand at y 1500 or sit at feet y 1455 (x 250/540/830),
//                                                              then call envDiningRoomFront (redraws the table over their bodies).
//  garage        envGarage                                     roll-up door (x 180..900, can open), red car (x 680..1440), work-   {night, open:0..1}
//                                                              bench + pegboard tools, bike, metal shelves with boxes, tube light.
//  carInside     envCarInside + envCarInsideFront              looking forward from the back seat: windshield with a road and       {night, speed:1, noSeats, belts:[x..]}
//                (+ envCarFrontSeats)                          scenery rushing past (animated), dashboard, wheel, mirror, front
//                                                              seats. KIDS in the back seat: x ~270 and ~810, feet y 1560 (s .8),
//                                                              then envCarInsideFront (back-seat bench + optional seat belts at
//                                                              o.belts x positions). PARENT TURNED AROUND: bg with {noSeats:true},
//                                                              draw the parent at x 290 (driver) / 790, y ~1450, then
//                                                              envCarFrontSeats → only the head peeks over the seat.
//  frontYard     envFrontYard                                  street of colourful houses, lawns, sidewalk (stand y 1500), street   {night}
//                                                              in front (y 1615+), mailbox (x 1010), big tree (x 40), car in
//                                                              driveway, street lamps, clouds/sun or moon+stars + lit windows.
//  treehouse     envTreehouse                                  outside: tree trunk (x 590..740), cabin on a platform (y 880), sign, {night, inside, sign:'TEXT'}
//                                                              rope ladder (x 980..1060), leaves, backyard fence. {inside:true}:
//                                                              plank interior with leafy window, sign, lantern, beanbag (top y
//                                                              1370, x 80..330), crate table with comics (x 830..1070),
//                                                              open floor hatch with rope ladder (front floor, x 300..720).
//
// HOME_SPOTS holds the same numbers in code (seat tops / feet y for sitting / x positions).
// Sitting with the current rig = legs hang straight down: feet y = seat top + 125 (at s .8). Skip drawShadow when sitting.
// Front layers apply the night colours themselves (pass the same {night} you gave the background).
'use strict';

const HOME_SPOTS = {
  livingRoom: { couchSeatTop: 1330, sitFeetY: 1455, couchX: [210, 390, 570], tv: { x: 970, y: 1095 } },
  kidsBedroom: { bedTop: 1250, sitBedFeetY: 1375, bedX: [90, 230], chairSeatTop: 1350, chairX: 670, chairFeetY: 1475, monitor: { x: 920, y: 1085 } },
  bathroom: { tubX: [760, 1000], tubFeetY: 1490, rimY: 1240, sinkX: 70 },
  diningRoom: { seatX: [250, 540, 830], sitFeetY: 1455, standY: 1500, tableTop: 1270 },
  garage: { carX: 1060, doorX: [180, 900], benchX: 30 },
  carInside: { kidsX: [270, 810], kidsFeetY: 1560, driverX: 290, passengerX: 790, parentFeetY: 1450 },
  frontYard: { mailboxX: 1010, treeX: 40, streetY: 1615 },
  treehouse: { ladderX: 1020, platformY: 880, beanbagTop: 1370, beanbagX: 200 },
};

// ---------------- shared helpers (prefixed hm* to avoid clashes with other packs) ----------------
const HM_TINT = '#6E6CB4';   // night multiply colour
function hmRgb(hex) { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function hmA(hex, a) { const [r, g, b] = hmRgb(hex); return `rgba(${r},${g},${b},${a})`; }
function hmMul(hex) { const a = hmRgb(hex), b = hmRgb(HM_TINT); return '#' + ((1 << 24) + (Math.round(a[0] * b[0] / 255) << 16) + (Math.round(a[1] * b[1] / 255) << 8) + Math.round(a[2] * b[2] / 255)).toString(16).slice(1); }
const hmId = c => c;
function hmNight(ctx, col = HM_TINT) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = col; ctx.fillRect(-3000, -2000, 9000, 6000); ctx.restore(); }
function hmGlow(ctx, x, y, r, col, a = .5) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hmA(col, a)); g.addColorStop(.45, hmA(col, a * .45)); g.addColorStop(1, hmA(col, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}
function hmRng(seed) { return rng(Math.floor(hash(seed * .731 + .17) * 4294967000) + 1); }  // decorrelated seeds (rng(n) and rng(n+1) start almost equal)
function hmPoly(ctx, pts) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); }
function hmCloud(ctx, x, y, s, col = '#FFFFFF') { for (const [ox, oy, r] of [[-56, 12, 38], [-4, -10, 54], [52, 8, 42], [4, 22, 40]]) circle(ctx, x + ox * s, y + oy * s, r * s, col); }
function hmCeil(ctx, col, y = 140, trim = '#FFFFFF') {
  ctx.fillStyle = col; ctx.fillRect(-3000, -2000, 9000, 2000 + y);
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, y - 4, 9000, 6); ctx.fillStyle = trim; ctx.fillRect(-3000, y + 2, 9000, 22);
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, y + 24, 9000, 6);
}
function hmBase(ctx, col = '#FFFFFF', h = 46) { ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - h - 5, 9000, 7); ctx.fillStyle = col; ctx.fillRect(-3000, FLOOR - h + 2, 9000, h); }
function hmFloorWood(ctx, cam, c1, c2, sp = 130) {
  const g = ctx.createLinearGradient(0, FLOOR, 0, FLOOR + 650); g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(-3000, FLOOR, 9000, 2600);
  ctx.strokeStyle = 'rgba(80,40,10,.25)'; ctx.lineWidth = 5;
  for (let i = -30; i < 52; i++) { const x = i * sp; ctx.beginPath(); ctx.moveTo(x, FLOOR); ctx.lineTo(x + (x - cam.x) * .9, FLOOR + 900); ctx.stroke(); }
  // staggered plank joints
  for (let k = 1; k < 8; k++) { const y0 = FLOOR + k * k * 18 + k * 10, y1 = FLOOR + (k + 1) * (k + 1) * 18 + (k + 1) * 10, ym = (y0 + y1) / 2;
    for (let i = -30; i < 52; i++) { if ((i + k * 3) % 4) continue; const x = i * sp, f = (ym - FLOOR) / 900, xa = x + (x - cam.x) * .9 * f, xb = x + sp + (x + sp - cam.x) * .9 * f;
      ctx.beginPath(); ctx.moveTo(lerp(xa, xb, .1), ym); ctx.lineTo(lerp(xa, xb, .9), ym); ctx.stroke(); } }
  ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(-3000, FLOOR, 9000, 40);
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - 4, 9000, 9);
}
function hmFloorChecker(ctx, cam, c1, c2, sz = 120) {
  ctx.fillStyle = c1; ctx.fillRect(-3000, FLOOR, 9000, 2600);
  const X = (i, y) => i * sz + (i * sz - cam.x) * .9 * (y - FLOOR) / 900, E = k => FLOOR + k * k * 14 + k * 30;
  ctx.fillStyle = c2;
  for (let k = 0; k < 10; k++) { const ya = E(k), yb = E(k + 1);
    for (let i = -28; i < 52; i++) { if ((i + k) % 2 === 0) continue; hmPoly(ctx, [[X(i, ya), ya], [X(i + 1, ya), ya], [X(i + 1, yb), yb], [X(i, yb), yb]]); ctx.fill(); } }
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - 4, 9000, 9);
}

// window with outside view (parallax .25). o: night, frame, bars:false, hills:false, round
function hmSky(ctx, x, y, w, h, T, cam, o, litOnly) {
  const { dx, dy } = par(cam, .25), n = o.night;
  if (!litOnly) { const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, n ? '#1B1A4A' : '#5DB9F2'); g.addColorStop(1, n ? '#41388A' : '#CFEFFF'); ctx.fillStyle = g; ctx.fillRect(x - 10, y - 10, w + 20, h + 20); }
  ctx.save(); ctx.translate(dx * .6, dy * .4);
  if (n) {
    const r = hmRng(Math.round(x * 7 + y)), cnt = Math.round(w * h / 9000);
    for (let i = 0; i < cnt; i++) { const sx = x - 60 + r() * (w + 120), sy = y + r() * h * .7, tw = .55 + .45 * Math.sin(T * 2.6 + i * 1.9);
      starPath(ctx, sx, sy, 7 + r() * 5, 3, 4); fillStroke(ctx, hmA('#FFF6C8', tw), 0); }
    const mx = x + w * .74, my = y + h * .24, mr = Math.min(w, h) * .11;
    circle(ctx, mx, my, mr, '#FFF2B8'); circle(ctx, mx - mr * .3, my - mr * .2, mr * .22, '#EADB9C'); circle(ctx, mx + mr * .35, my + mr * .3, mr * .16, '#EADB9C');
  } else if (!litOnly) {
    circle(ctx, x + w * .78, y + h * .2, Math.min(w, h) * .1, '#FFE066');
    for (let i = 0; i < 3; i++) { const span = w + 360, cx = x - 180 + (((i * 170 + T * 14 + hash(x) * 300) % span) + span) % span, cy = y + h * (.18 + .2 * (i % 2)); hmCloud(ctx, cx, cy, Math.min(w, 300) / 300 * (.75 + .2 * (i % 2))); }
  }
  if (!litOnly && o.hills !== false) {
    ellipse(ctx, x + w * .2, y + h + h * .1, w * .9, h * .32, n ? '#2B3F6A' : '#86D57A');
    ellipse(ctx, x + w * .95, y + h + h * .16, w * .8, h * .3, n ? '#233457' : '#5DBF62');
    for (let i = 0; i < 4; i++) { const tx = x - 40 + i * w * .38, ty = y + h * .84 - (i % 2) * h * .05; circle(ctx, tx, ty, w * .09, n ? '#1E2E4E' : '#3FA34D'); }
  }
  ctx.restore();
}
function hmWindow(ctx, x, y, w, h, T, cam, o = {}) {
  const fc = o.frame || '#FFFFFF';
  box(ctx, x - 20, y - 20, w + 40, h + 40, 20, fc, 9);
  ctx.save(); rr(ctx, x, y, w, h, 10); ctx.clip(); hmSky(ctx, x, y, w, h, T, cam, o, false);
  ctx.fillStyle = 'rgba(255,255,255,.16)'; hmPoly(ctx, [[x + w * .2, y], [x + w * .42, y], [x + w * .02, y + h], [x - w * .2, y + h]]); ctx.fill();
  ctx.restore();
  rr(ctx, x, y, w, h, 10); fillStroke(ctx, null, 7);
  if (o.bars !== false) { box(ctx, x + w / 2 - 8, y - 4, 16, h + 8, 4, fc, 6); box(ctx, x - 4, y + h * .5 - 8, w + 8, 16, 4, fc, 6); }
  box(ctx, x - 40, y + h + 12, w + 80, 30, 10, fc, 9);
}
function hmWindowLit(ctx, x, y, w, h, T, cam, o = {}) { // after hmNight: re-light moon & stars
  ctx.save(); rr(ctx, x, y, w, h, 10); ctx.clip(); hmSky(ctx, x, y, w, h, T, cam, { night: true }, true); ctx.restore();
  if (o.bars !== false) { const fc = hmMul(o.frame || '#FFFFFF'); box(ctx, x + w / 2 - 8, y - 4, 16, h + 8, 4, fc, 6); box(ctx, x - 4, y + h * .5 - 8, w + 8, 16, 4, fc, 6); }
  hmGlow(ctx, x + w * .74, y + h * .24, Math.min(w, h) * .4, '#BFC8FF', .25);
}
function hmCurtains(ctx, x, y, w, h, col, T, o = {}) {
  const dk = shade(col, -.22), rodY = y - 52, pw = o.pw || w * .3, bot = y + h + 70;
  for (const s of [0, 1]) {
    const sway = Math.sin(T * 1.2 + s * 2.1) * 8;
    const outer = s ? x + w + 52 : x - 52, inner = s ? outer - pw : outer + pw, dir = s ? 1 : -1; // dir points inner → outer
    const tieY = y + h * .6, tieX = inner + dir * pw * .58, botIn = inner + dir * pw * .12 + sway;
    ctx.beginPath(); ctx.moveTo(outer, rodY); ctx.lineTo(inner, rodY);
    ctx.quadraticCurveTo(inner + dir * 6, tieY - h * .3, tieX, tieY);
    ctx.quadraticCurveTo(tieX - dir * pw * .2, tieY + 60, botIn, bot);
    ctx.lineTo(outer + sway * .3, bot); ctx.closePath(); fillStroke(ctx, col, 8);
    ctx.strokeStyle = dk; ctx.lineWidth = 6;
    for (const f of [.33, .66]) { ctx.beginPath(); ctx.moveTo(lerp(outer, inner, f), rodY + 14); ctx.lineTo(lerp(outer, tieX, f), tieY - 10); ctx.moveTo(lerp(outer, tieX, f), tieY + 16); ctx.lineTo(lerp(outer + sway * .3, botIn, f), bot - 10); ctx.stroke(); }
    box(ctx, Math.min(outer, tieX) - 4, tieY - 13, Math.abs(tieX - outer) + 8, 26, 12, shade(col, .35), 6);
  }
  box(ctx, x - 90, rodY - 12, w + 180, 18, 9, '#8A5A2B', 6); circle(ctx, x - 92, rodY - 3, 15, '#FFD447', 6); circle(ctx, x + w + 92, rodY - 3, 15, '#FFD447', 6);
}
function hmPlant(ctx, x, y, s = 1, pot = '#E8784A') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < 7; i++) { const a = -1.15 + i * 2.3 / 6, L = 92 - Math.abs(i - 3) * 6;
    ellipse(ctx, Math.sin(a) * L * .9, -120 - Math.cos(a) * L, 30, 78, i % 2 ? '#3FA34D' : '#57C25E', 7, a);
    ctx.strokeStyle = 'rgba(20,70,30,.45)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -112); ctx.lineTo(Math.sin(a) * L * 1.5, -120 - Math.cos(a) * L * 1.6); ctx.stroke(); }
  hmPoly(ctx, [[-56, -112], [56, -112], [42, 0], [-42, 0]]); fillStroke(ctx, pot, 8);
  box(ctx, -66, -126, 132, 28, 10, shade(pot, .15), 8);
  ctx.restore();
}
function hmFrame(ctx, x, y, w, h, fc, inner, draw) {
  box(ctx, x, y, w, h, 10, fc, 8);
  const ix = x + 16, iy = y + 16, iw = w - 32, ih = h - 32;
  rr(ctx, ix, iy, iw, ih, 6); ctx.save(); ctx.clip(); ctx.fillStyle = inner; ctx.fillRect(ix, iy, iw, ih); if (draw) draw(ix, iy, iw, ih); ctx.restore();
  rr(ctx, ix, iy, iw, ih, 6); fillStroke(ctx, null, 5);
}
function hmFamily(ctx, x, y, w, h) {
  ellipse(ctx, x + w / 2, y + h + 6, w * .7, h * .32, '#7FD07A');
  const ppl = [['#E9B48A', '#5A3A1E', '#2E62C9', 1.15], ['#E9B48A', '#D9572B', '#4FA36B', 1.08], ['#F7C9A0', '#2A2033', '#20BDBB', .9], ['#F3C4A6', '#8A5A2B', '#FF5B9B', .78]];
  ppl.forEach(([sk, hc, sh, s], i) => { const cx = x + w * (.17 + i * .22), b = y + h - 4;
    box(ctx, cx - 13 * s, b - 38 * s, 26 * s, 40 * s, 6, sh, 3); box(ctx, cx - 14 * s, b - 66 * s, 28 * s, 26 * s, 7, sk, 3);
    box(ctx, cx - 15 * s, b - 70 * s, 30 * s, 10 * s, 5, hc, 3);
    ctx.fillStyle = OUTLINE; ctx.fillRect(cx - 7 * s, b - 56 * s, 3, 4); ctx.fillRect(cx + 4 * s, b - 56 * s, 3, 4); });
}
function hmDogPic(ctx, x, y) {
  ellipse(ctx, x - 26, y - 10, 12, 24, '#8A5A2B', 4, .3); ellipse(ctx, x + 26, y - 10, 12, 24, '#8A5A2B', 4, -.3);
  circle(ctx, x, y, 28, '#D9A06A', 4); ellipse(ctx, x, y + 12, 14, 10, '#F2D3B0', 0);
  circle(ctx, x - 10, y - 6, 4, OUTLINE); circle(ctx, x + 10, y - 6, 4, OUTLINE); ellipse(ctx, x, y + 6, 6, 4, OUTLINE);
}
function hmKidDrawing(ctx, x, y, w, h) {
  ctx.lineWidth = 4; ctx.lineCap = 'round';
  circle(ctx, x + 22, y + 22, 13, '#FFD447'); ctx.strokeStyle = '#FFB000';
  for (let i = 0; i < 8; i++) { const a = i * TAU / 8; ctx.beginPath(); ctx.moveTo(x + 22 + Math.cos(a) * 17, y + 22 + Math.sin(a) * 17); ctx.lineTo(x + 22 + Math.cos(a) * 24, y + 22 + Math.sin(a) * 24); ctx.stroke(); }
  ctx.strokeStyle = '#EE384A'; ctx.strokeRect(x + w * .45, y + h * .48, w * .32, h * .4);
  ctx.beginPath(); ctx.moveTo(x + w * .41, y + h * .5); ctx.lineTo(x + w * .61, y + h * .2); ctx.lineTo(x + w * .81, y + h * .5); ctx.stroke();
  ctx.strokeStyle = '#2E62C9'; const sx = x + w * .22, sy = y + h * .62;
  ctx.beginPath(); ctx.arc(sx, sy - 10, 7, 0, TAU); ctx.moveTo(sx, sy - 3); ctx.lineTo(sx, sy + 14); ctx.moveTo(sx - 9, sy + 4); ctx.lineTo(sx + 9, sy + 4); ctx.moveTo(sx, sy + 14); ctx.lineTo(sx - 7, sy + 24); ctx.moveTo(sx, sy + 14); ctx.lineTo(sx + 7, sy + 24); ctx.stroke();
  ctx.strokeStyle = '#30CE65'; ctx.beginPath(); ctx.moveTo(x, y + h - 6); ctx.lineTo(x + w, y + h - 6); ctx.stroke();
}
function hmClock(ctx, x, y, r, T, C = hmId) {
  circle(ctx, x, y, r + 12, C('#FF5B9B'), 9); circle(ctx, x, y, r, C('#FFFFFF'), 6);
  ctx.fillStyle = OUTLINE; for (let i = 0; i < 12; i++) { const a = i * TAU / 12; ctx.beginPath(); ctx.arc(x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8, i % 3 ? 3 : 5, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = OUTLINE; ctx.lineCap = 'round';
  const hA = -Math.PI / 2 + 2.1 + T * .02, mA = -Math.PI / 2 + T * .25;
  ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(hA) * r * .45, y + Math.sin(hA) * r * .45); ctx.stroke();
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(mA) * r * .7, y + Math.sin(mA) * r * .7); ctx.stroke();
  circle(ctx, x, y, 7, C('#EE384A'), 4);
}
function hmController(ctx, x, y, s, col = '#2E2A44', rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ellipse(ctx, -44, 14, 24, 32, col, 7, .35); ellipse(ctx, 44, 14, 24, 32, col, 7, -.35);
  box(ctx, -64, -30, 128, 50, 24, col, 7);
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-48, -10, 26, 8); ctx.fillRect(-39, -19, 8, 26);
  circle(ctx, 34, -16, 6, '#EE384A'); circle(ctx, 46, -5, 6, '#30CE65'); circle(ctx, 22, -5, 6, '#2E9CCA'); circle(ctx, 34, 6, 6, '#FFD447');
  ctx.restore();
}
function hmBookshelf(ctx, x, y, w, h, seed, C = hmId) {
  box(ctx, x, y, w, h, 12, C('#A8693A'), 10);
  const rows = 4, ih = (h - 30) / rows, pal = ['#EE384A', '#2E62C9', '#FFD447', '#30CE65', '#FF8528', '#7B4BFF', '#20BDBB', '#FF5B9B'];
  for (let r = 0; r < rows; r++) {
    const ry = y + 18 + r * ih, R = hmRng(seed * 31 + r * 17);
    box(ctx, x + 18, ry, w - 36, ih - 14, 6, C('#6E4325'), 6);
    let bx = x + 28;
    while (true) {
      if (R() < .1) { // ornament
        if (bx + 60 > x + w - 26) break;
        if (R() < .5) circle(ctx, bx + 28, ry + ih - 50, 24, C('#80CDF5'), 6); else box(ctx, bx + 6, ry + ih - 76, 44, 56, 8, C('#FFD447'), 6);
        bx += 62; continue;
      }
      const bw = 22 + R() * 20, bh = ih * .5 + R() * ih * .32;
      if (bx + bw > x + w - 26) break;
      const col = pal[Math.floor(R() * pal.length)];
      box(ctx, bx, ry + ih - 18 - bh, bw, bh, 4, C(col), 5);
      ctx.fillStyle = C(shade(col, .4)); ctx.fillRect(bx + 4, ry + ih - 18 - bh + 14, bw - 8, 6);
      bx += bw + 3;
    }
    box(ctx, x + 8, ry + ih - 22, w - 16, 22, 4, C('#C98B4B'), 6);
  }
}
function hmFloorLamp(ctx, x, lit, shadeOnly = false) {
  if (!shadeOnly) { ellipse(ctx, x, 1488, 64, 16, '#3A3550', 7); box(ctx, x - 8, 860, 16, 630, 6, '#3A3550', 6); }
  hmPoly(ctx, [[x - 62, 738], [x + 62, 738], [x + 100, 872], [x - 100, 872]]); fillStroke(ctx, lit ? '#FFF1B8' : '#FFD87A', 9);
  ctx.strokeStyle = lit ? '#FFD87A' : '#F2B84A'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 92, 846); ctx.lineTo(x + 92, 846); ctx.stroke();
}
function hmTvScreen(ctx, x, y, w, h, T, o = {}) {
  ctx.save(); rr(ctx, x, y, w, h, 10); ctx.clip();
  if (o.tv === false) { ctx.fillStyle = '#1B1830'; ctx.fillRect(x, y, w, h); }
  else if (o.screen) o.screen(ctx, x, y, w, h, T);
  else {
    const sc = Math.floor(T / 4) % 2;
    if (sc === 0) { // sunny cartoon: bouncing blob
      ctx.fillStyle = '#7FD3FF'; ctx.fillRect(x, y, w, h);
      ctx.save(); ctx.translate(x + w * .82, y + h * .24); ctx.rotate(T * .8); ctx.fillStyle = '#FFE066';
      for (let i = 0; i < 10; i++) { ctx.rotate(TAU / 10); ctx.fillRect(28, -5, 18, 10); } ctx.restore();
      circle(ctx, x + w * .82, y + h * .24, 24, '#FFD447', 4);
      hmCloud(ctx, x + ((T * 30) % (w + 120)) - 60 + x * 0, y + h * .2, .45);
      ellipse(ctx, x + w * .5, y + h * 1.05, w * .75, h * .32, '#5DD06A', 5);
      const b = Math.abs(Math.sin(T * 4)), bx = x + w * .4 + Math.sin(T * 1.3) * w * .2, by = y + h * .76 - b * h * .32, sq = 1 - (1 - b) * .25;
      ellipse(ctx, bx, y + h * .8, 36 * (1.2 - b * .4), 8, 'rgba(0,0,0,.18)');
      ctx.save(); ctx.translate(bx, by); ctx.scale(1 / sq, sq);
      ellipse(ctx, 0, -30, 40, 34, '#FF5B9B', 5); ellipse(ctx, -12, -36, 9, 11, '#FFFFFF', 3); ellipse(ctx, 12, -36, 9, 11, '#FFFFFF', 3);
      circle(ctx, -10, -34, 4, OUTLINE); circle(ctx, 14, -34, 4, OUTLINE);
      ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, -24, 10, .2, Math.PI - .2); ctx.stroke(); ctx.restore();
    } else { // space show: rocket + scrolling stars
      ctx.fillStyle = '#2B1E5C'; ctx.fillRect(x, y, w, h);
      for (let i = 0; i < 26; i++) { const r = hmRng(i * 9 + 4), sx = x + (((r() * w - T * (40 + r() * 80)) % w) + w) % w, sy = y + r() * h; circle(ctx, sx, sy, 2 + r() * 3, '#FFFFFF'); }
      circle(ctx, x + w * .8, y + h * .72, 46, '#FF8528', 5); ctx.strokeStyle = '#FFD447'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x + w * .8, y + h * .72, 74, 16, -.3, 0, TAU); ctx.stroke();
      ctx.save(); ctx.translate(x + w * .36, y + h * .48 + Math.sin(T * 3) * 14); ctx.rotate(.5 + Math.sin(T * 2) * .08);
      ellipse(ctx, -56, 0, 22 + Math.sin(T * 30) * 5, 12, '#FFB000', 0); ellipse(ctx, -50, 0, 12, 7, '#FFF3A8', 0);
      hmPoly(ctx, [[-40, -20], [-40, 20], [-60, 30], [-60, -30]]); fillStroke(ctx, '#EE384A', 4);
      ellipse(ctx, 0, 0, 52, 22, '#F4F4F7', 4); circle(ctx, 8, 0, 9, '#80CDF5', 4);
      hmPoly(ctx, [[40, -14], [64, 0], [40, 14]]); fillStroke(ctx, '#EE384A', 4); ctx.restore();
    }
    ctx.fillStyle = `rgba(255,255,255,${.03 + .05 * hash(Math.floor(T * 12))})`; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(0,0,0,.07)'; for (let k = y; k < y + h; k += 8) ctx.fillRect(x, k, w, 3);
  }
  ctx.fillStyle = 'rgba(255,255,255,.12)'; hmPoly(ctx, [[x + w * .55, y], [x + w * .75, y], [x + w * .45, y + h], [x + w * .25, y + h]]); ctx.fill();
  ctx.restore();
  rr(ctx, x, y, w, h, 10); fillStroke(ctx, null, 6);
}

// ======================================================================================
// 1. LIVING ROOM
// ======================================================================================
function envLivingRoom(ctx, T, cam, o = {}) {
  const N = !!o.night;
  ctx.fillStyle = '#FFD7A3'; ctx.fillRect(-3000, -2000, 9000, 6000);
  ctx.fillStyle = '#FBCA8E'; for (let i = -25; i < 50; i++) ctx.fillRect(i * 120 + 37, 140, 46, FLOOR);
  for (let i = -25; i < 50; i++) for (let k = 0; k < 11; k++) circle(ctx, i * 120, 230 + k * 120 + (i % 2 ? 60 : 0), 7, '#FFE9CC');
  hmCeil(ctx, '#FFF0DC', 140);
  hmBase(ctx);
  hmFloorWood(ctx, cam, '#C98A55', '#A86B3A');
  hmBookshelf(ctx, -470, 620, 350, 880, 11);
  hmPlant(ctx, -295, 620, .7, '#30A08A');
  hmWindow(ctx, 200, 300, 320, 440, T, cam, { night: N });
  hmCurtains(ctx, 200, 300, 320, 440, '#2EAFA0', T);
  hmFrame(ctx, 585, 370, 180, 150, '#C98B4B', '#BDE8FF', (x, y, w, h) => hmFamily(ctx, x, y, w, h));
  hmFrame(ctx, 785, 392, 112, 128, '#FF8528', '#FFF3D6', (x, y, w, h) => hmDogPic(ctx, x + w / 2, y + h / 2 + 4));
  hmFrame(ctx, 592, 548, 120, 116, '#30A08A', '#FFE3EE', (x, y, w, h) => { heartPath(ctx, x + w / 2, y + h / 2 + 6, 30); fillStroke(ctx, '#FF5B9B', 5); });
  hmFrame(ctx, 735, 545, 160, 125, '#7B4BFF', '#FFFFFF', (x, y, w, h) => hmKidDrawing(ctx, x, y, w, h));
  hmClock(ctx, 1000, 760, 60, T);
  hmFloorLamp(ctx, 20, false);
  // couch (seat top 1330)
  const cc = o.couch || '#6A5FD6', cd = shade(cc, -.2), cl = shade(cc, .12);
  box(ctx, 120, 1148, 540, 230, 40, cd, 9);
  box(ctx, 138, 1166, 248, 190, 34, cc, 8); box(ctx, 394, 1166, 248, 190, 34, cc, 8);
  ellipse(ctx, 262, 1200, 80, 14, 'rgba(255,255,255,.16)'); ellipse(ctx, 518, 1200, 80, 14, 'rgba(255,255,255,.16)');
  box(ctx, 100, 1372, 580, 100, 22, cd, 9);
  box(ctx, 140, 1330, 252, 62, 24, cl, 8); box(ctx, 388, 1330, 252, 62, 24, cl, 8);
  for (const x of [100, 650]) box(ctx, x, 1466, 30, 32, 6, '#5A3A1E', 6);
  box(ctx, 66, 1238, 100, 236, 44, cc, 9); box(ctx, 614, 1238, 100, 236, 44, cc, 9);
  ellipse(ctx, 116, 1262, 34, 10, 'rgba(255,255,255,.2)'); ellipse(ctx, 664, 1262, 34, 10, 'rgba(255,255,255,.2)');
  ctx.save(); ctx.translate(212, 1272); ctx.rotate(-.2); box(ctx, -58, -52, 116, 104, 30, '#FFD447', 8); starPath(ctx, 0, 0, 26, 11); fillStroke(ctx, '#FF8528', 0); ctx.restore();
  ctx.save(); ctx.translate(566, 1274); ctx.rotate(.18); box(ctx, -56, -50, 112, 100, 30, '#FF5B9B', 8); heartPath(ctx, 0, 4, 26); fillStroke(ctx, '#FFFFFF', 0); ctx.restore();
  // TV stand + console
  box(ctx, 750, 1300, 440, 172, 14, '#B5753F', 9);
  box(ctx, 736, 1284, 468, 28, 10, '#C98B4B', 9);
  box(ctx, 768, 1330, 120, 124, 10, '#A8693A', 7); circle(ctx, 872, 1392, 7, '#FFD447', 4);
  box(ctx, 1052, 1330, 120, 124, 10, '#A8693A', 7); circle(ctx, 1068, 1392, 7, '#FFD447', 4);
  box(ctx, 902, 1330, 136, 124, 8, '#4A2E1A', 7);
  box(ctx, 914, 1344, 92, 16, 4, '#EE384A', 4); box(ctx, 918, 1362, 86, 16, 4, '#2E62C9', 4);
  box(ctx, 912, 1390, 116, 50, 10, '#F4F4F7', 6); ctx.fillStyle = '#4FC3F7'; ctx.fillRect(926, 1424, 54, 6); circle(ctx, 1008, 1415, 5, '#30CE65');
  for (const x of [762, 1154]) box(ctx, x, 1466, 24, 32, 6, '#5A3A1E', 6);
  hmController(ctx, 1120, 1268, .62, '#EE384A', -.08);
  // TV
  box(ctx, 905, 1268, 130, 18, 8, '#2A2540', 6); box(ctx, 950, 1236, 40, 40, 6, '#2A2540', 6);
  box(ctx, 770, 950, 400, 296, 22, '#2A2540', 10);
  hmTvScreen(ctx, 790, 970, 360, 252, T, o);
  circle(ctx, 970, 1236, 4, '#EE384A');
  hmPlant(ctx, 1290, 1500, 1.25, '#FF5B9B');
  // rug + controller on the floor
  ellipse(ctx, 430, 1600, 560, 104, '#E85D4A', 9); ellipse(ctx, 430, 1600, 480, 84, '#FFD447'); ellipse(ctx, 430, 1600, 400, 66, '#E85D4A');
  ellipse(ctx, 430, 1600, 300, 46, '#20BDBB'); ellipse(ctx, 430, 1600, 180, 26, '#FFF3D6');
  hmController(ctx, 905, 1676, .9, '#2E62C9', .35);
  if (N) {
    hmNight(ctx);
    hmWindowLit(ctx, 200, 300, 320, 440, T, cam);
    hmFloorLamp(ctx, 20, true, true); hmGlow(ctx, 20, 900, 560, '#FFB347', .5); hmGlow(ctx, 20, 1500, 300, '#FFB347', .2);
    hmTvScreen(ctx, 790, 970, 360, 252, T, o); hmGlow(ctx, 970, 1100, 600, '#6FB4FF', .2 + .06 * noise1(T * 6));
    circle(ctx, 1008, 1415, 5, '#30CE65'); hmGlow(ctx, 953, 1427, 40, '#4FC3F7', .5);
  }
}

// ======================================================================================
// 2. KID'S BEDROOM
// ======================================================================================
function hmStringLights(ctx, x0, x1, y, sag, T, lit) {
  const seg = 270, cols = ['#FF5B9B', '#FFD447', '#20BDBB', '#7B4BFF', '#30CE65', '#FF8528'];
  let n = 0;
  for (let sx = x0; sx < x1; sx += seg) {
    const P = t => { const a = 1 - t; return [a * a * sx + 2 * a * t * (sx + seg / 2) + t * t * (sx + seg), a * a * y + 2 * a * t * (y + sag * 2) + t * t * y]; };
    if (!lit) { ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(sx, y); ctx.quadraticCurveTo(sx + seg / 2, y + sag * 2, sx + seg, y); ctx.stroke(); }
    for (let k = 1; k < 6; k += 1) {
      const [bx, by] = P(k / 6), col = cols[(n++) % cols.length];
      const on = .7 + .3 * Math.sin(T * 3 + n * 1.3);
      if (lit) hmGlow(ctx, bx, by + 18, 70, col, .45 * on);
      box(ctx, bx - 7, by - 2, 14, 12, 3, lit ? '#9AA0B8' : '#C8D2E8', 4);
      ellipse(ctx, bx, by + 22, 11, 15, lit ? shade(col, .45 * on) : shade(col, .25), 5);
    }
  }
}
function hmGameScreen(ctx, x, y, w, h, T) {
  ctx.save(); rr(ctx, x, y, w, h, 6); ctx.clip();
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#4FC3F7'); g.addColorStop(1, '#C8F0FF'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  const sc = T * 70;
  for (let i = 0; i < 4; i++) hmCloud(ctx, x + ((((i * 140 - sc * .3) % (w + 140)) + w + 140) % (w + 140)) - 70, y + 26 + (i % 2) * 18, .32);
  for (let i = 0; i < 9; i++) { const bx = x + ((((i * 40 - sc) % (w + 40)) + w + 40) % (w + 40)) - 40, hh = 26 + (i % 3 === 0 ? 22 : 0);
    box(ctx, bx, y + h - hh, 40, hh + 8, 3, '#B5753F', 3); ctx.fillStyle = '#30CE65'; ctx.fillRect(bx + 2, y + h - hh + 1, 36, 9); }
  for (let i = 0; i < 3; i++) { const cx = x + ((((i * 110 + 60 - sc) % (w + 60)) + w + 60) % (w + 60)) - 30; ellipse(ctx, cx, y + h * .42, 9 * Math.abs(Math.cos(T * 4 + i)) + 1, 10, '#FFD447', 3); }
  const j = Math.abs(Math.sin(T * 3.2)) * 46; box(ctx, x + w * .3, y + h - 74 - j, 26, 26, 5, '#EE384A', 3); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x + w * .3 + 15, y + h - 68 - j, 6, 7);
  ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.font = '18px "Lilita One"'; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText('★ ' + (120 + Math.floor(T * 7) * 10), x + 8, y + 6);
  ctx.restore(); rr(ctx, x, y, w, h, 6); fillStroke(ctx, null, 5);
}
function hmLavaLamp(ctx, x, y, T, lit) {
  hmPoly(ctx, [[x - 18, y - 150], [x + 18, y - 150], [x + 30, y - 40], [x - 30, y - 40]]); fillStroke(ctx, lit ? '#FF9AD0' : '#E87BC0', 6);
  for (let i = 0; i < 3; i++) { const by = y - 60 - ((T * 18 + i * 34) % 90); ellipse(ctx, x + Math.sin(T + i) * 6, by, 9 + i * 2, 12, lit ? '#FFE066' : '#FFB000'); }
  hmPoly(ctx, [[x - 30, y - 40], [x + 30, y - 40], [x + 22, y], [x - 22, y]]); fillStroke(ctx, '#7B4BFF', 6);
  hmPoly(ctx, [[x - 18, y - 150], [x + 18, y - 150], [x + 12, y - 170], [x - 12, y - 170]]); fillStroke(ctx, '#7B4BFF', 6);
}
function envKidsBedroom(ctx, T, cam, o = {}) {
  const N = !!o.night;
  ctx.fillStyle = '#BDB2F2'; ctx.fillRect(-3000, -2000, 9000, 6000);
  for (let i = -20; i < 40; i++) for (let k = 0; k < 9; k++) { starPath(ctx, i * 150 + (k % 2) * 75, 260 + k * 140, 13, 6); fillStroke(ctx, '#CEC6F7', 0); }
  hmCeil(ctx, '#DCD6FB', 140);
  hmBase(ctx);
  hmFloorWood(ctx, cam, '#E0A86E', '#C08550');
  // posters
  ctx.save(); ctx.translate(-150, 640); ctx.rotate(-.04);
  box(ctx, -120, -160, 240, 320, 8, '#24225B', 8);
  for (let i = 0; i < 12; i++) { const r = hmRng(i + 40); circle(ctx, -100 + r() * 200, -140 + r() * 280, 3 + r() * 3, '#FFF6C8'); }
  circle(ctx, 50, 90, 50, '#FF8528', 6); ctx.strokeStyle = '#FFD447'; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(50, 90, 80, 18, -.3, 0, TAU); ctx.stroke();
  ctx.save(); ctx.translate(-30, -30); ctx.rotate(.6);
  hmPoly(ctx, [[-22, 40], [22, 40], [36, 70], [-36, 70]]); fillStroke(ctx, '#EE384A', 6);
  ellipse(ctx, 0, 0, 28, 62, '#F4F4F7', 6); circle(ctx, 0, -10, 13, '#80CDF5', 5); ellipse(ctx, 0, 84, 12, 18 + Math.sin(T * 20) * 4, '#FFB000'); ctx.restore();
  txt(ctx, 'SPACE', 0, -118, 40, '#FFD447', OUTLINE, 7);
  for (const [tx, ty] of [[-110, -150], [110, -150]]) { ctx.save(); ctx.translate(tx, ty); ctx.rotate(tx > 0 ? .5 : -.5); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillRect(-22, -9, 44, 18); ctx.restore(); }
  ctx.restore();
  ctx.save(); ctx.translate(140, 650); ctx.rotate(.05);
  box(ctx, -100, -125, 200, 250, 8, '#FF8528', 8);
  txt(ctx, 'GAME', 0, -70, 52, '#FFFFFF', OUTLINE, 8); txt(ctx, 'ON!', 0, -18, 58, '#FFD447', OUTLINE, 8);
  hmController(ctx, 0, 62, .95, '#2A2540', 0);
  ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillRect(-18, -134, 36, 16);
  ctx.restore();
  // window
  hmWindow(ctx, 300, 320, 300, 420, T, cam, { night: N });
  hmCurtains(ctx, 300, 320, 300, 420, '#3FA9F5', T);
  // shelf above desk
  box(ctx, 720, 790, 420, 24, 8, '#FFFFFF', 7);
  hmPoly(ctx, [[770, 700], [830, 700], [818, 742], [782, 742]]); fillStroke(ctx, '#FFD447', 6); box(ctx, 788, 742, 24, 22, 4, '#FFD447', 5); box(ctx, 770, 762, 60, 26, 6, '#8A5A2B', 6);
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(768, 718, 14, Math.PI * .5, Math.PI * 1.5); ctx.arc(832, 718, 14, -Math.PI * .5, Math.PI * .5); ctx.stroke();
  for (let i = 0; i < 4; i++) box(ctx, 860 + i * 26, 712 + (i % 2) * 10, 24, 78 - (i % 2) * 10, 4, ['#EE384A', '#2E62C9', '#30CE65', '#7B4BFF'][i], 5);
  box(ctx, 1000, 712, 74, 66, 12, '#C8D2E8', 6); circle(ctx, 1022, 742, 8, '#4FC3F7', 4); circle(ctx, 1052, 742, 8, '#4FC3F7', 4); box(ctx, 1032, 690, 10, 22, 4, '#C8D2E8', 4); circle(ctx, 1037, 686, 8, '#EE384A', 4);
  // desk
  box(ctx, 690, 1222, 570, 30, 8, '#FFFFFF', 9);
  box(ctx, 710, 1250, 26, 250, 6, '#E4E4F0', 7);
  box(ctx, 1090, 1250, 150, 250, 10, '#F2F2F8', 9); box(ctx, 1106, 1270, 118, 100, 8, '#FFFFFF', 6); box(ctx, 1106, 1382, 118, 100, 8, '#FFFFFF', 6);
  box(ctx, 1145, 1310, 40, 12, 6, '#7B4BFF', 4); box(ctx, 1145, 1422, 40, 12, 6, '#7B4BFF', 4);
  hmLavaLamp(ctx, 735, 1222, T, false);
  box(ctx, 900, 1178, 40, 46, 6, '#2A2540', 6); box(ctx, 866, 1210, 108, 16, 6, '#2A2540', 6);
  box(ctx, 778, 986, 284, 196, 16, '#2A2540', 10);
  hmGameScreen(ctx, 794, 1002, 252, 160, T);
  box(ctx, 800, 1200, 200, 20, 6, '#3A3550', 6);
  for (let i = 0; i < 9; i++) { ctx.fillStyle = `hsl(${(i * 40 + T * 120) % 360},90%,62%)`; ctx.fillRect(810 + i * 20, 1206, 16, 6); }
  ellipse(ctx, 1040, 1210, 18, 11, '#3A3550', 5);
  box(ctx, 1090, 1022, 120, 200, 12, '#2A2540', 9);
  for (let i = 0; i < 2; i++) { circle(ctx, 1150, 1070 + i * 64, 24, `hsl(${(T * 90 + i * 120) % 360},90%,62%)`, 5); circle(ctx, 1150, 1070 + i * 64, 8, '#2A2540'); }
  // gaming chair (side view, facing the desk)
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(596, 1478); ctx.lineTo(744, 1478); ctx.stroke();
  for (const x of [600, 670, 740]) circle(ctx, x, 1486, 13, '#3A3550', 6);
  box(ctx, 660, 1380, 20, 100, 6, '#6B7080', 6);
  box(ctx, 586, 1018, 64, 360, 26, '#2A2540', 9); box(ctx, 600, 1050, 36, 300, 14, '#EE384A', 0);
  box(ctx, 594, 1060, 48, 60, 16, '#F4F4F7', 6);
  box(ctx, 590, 1348, 190, 44, 16, '#2A2540', 9); box(ctx, 610, 1356, 150, 10, 5, '#EE384A', 0);
  box(ctx, 650, 1290, 96, 16, 8, '#3A3550', 6); box(ctx, 690, 1300, 14, 50, 4, '#3A3550', 5);
  // bed
  const fc = '#4FA3E0';
  box(ctx, -420, 960, 64, 540, 24, fc, 9); circle(ctx, -388, 960, 30, '#FFD447', 8);
  box(ctx, -392, 1398, 720, 72, 14, fc, 9);
  for (const x of [-380, 300]) box(ctx, x, 1466, 26, 32, 6, shade(fc, -.25), 6);
  box(ctx, -380, 1248, 700, 160, 22, '#FFFFFF', 8);
  ellipse(ctx, -296, 1222, 80, 38, '#FFFFFF', 8); ellipse(ctx, -296, 1214, 56, 14, '#E8F2F7');
  // teddy
  circle(ctx, -168, 1176, 20, '#C98B4B', 6); circle(ctx, -206, 1176, 20, '#C98B4B', 6);
  ellipse(ctx, -186, 1240, 46, 40, '#C98B4B', 7); circle(ctx, -186, 1198, 34, '#C98B4B', 7); ellipse(ctx, -186, 1210, 14, 10, '#F2D3B0');
  circle(ctx, -198, 1192, 4, OUTLINE); circle(ctx, -174, 1192, 4, OUTLINE); circle(ctx, -186, 1206, 4, OUTLINE);
  // quilt
  ctx.beginPath(); ctx.moveTo(-250, 1232); ctx.lineTo(330, 1232); ctx.quadraticCurveTo(352, 1236, 350, 1260); ctx.lineTo(350, 1420);
  for (let i = 0; i <= 12; i++) { const xx = 350 - i * 50; ctx.quadraticCurveTo(xx - 25, 1440, xx - 50, 1420); }
  ctx.lineTo(-250, 1232); ctx.closePath();
  ctx.save(); ctx.clip();
  const qc = ['#FF5B9B', '#FFD447', '#20BDBB', '#7B4BFF', '#30CE65', '#FF8528'];
  for (let i = 0; i < 10; i++) for (let k = 0; k < 4; k++) { ctx.fillStyle = qc[(i * 2 + k * 3) % 6]; ctx.fillRect(-260 + i * 64, 1226 + k * 64, 64, 64);
    if ((i + k) % 3 === 0) { heartPath(ctx, -228 + i * 64, 1262 + k * 64, 14); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill(); } }
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3; ctx.setLineDash([8, 8]);
  for (let i = 0; i < 11; i++) { ctx.beginPath(); ctx.moveTo(-260 + i * 64, 1226); ctx.lineTo(-260 + i * 64, 1500); ctx.stroke(); }
  for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(-260, 1226 + k * 64); ctx.lineTo(400, 1226 + k * 64); ctx.stroke(); }
  ctx.setLineDash([]); ctx.restore();
  ctx.lineWidth = 8; ctx.strokeStyle = OUTLINE; ctx.stroke();
  box(ctx, 300, 1170, 56, 330, 22, fc, 9); circle(ctx, 328, 1170, 26, '#FFD447', 8);
  // toy box
  ctx.save(); ctx.translate(1270, 1316); ctx.rotate(-.25); box(ctx, 0, -20, 230, 26, 8, '#FF8528', 8); ctx.restore();
  circle(ctx, 1320, 1300, 34, '#FFD447', 7); ctx.strokeStyle = '#EE384A'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(1320, 1300, 34, -1.9, -.9); ctx.stroke();
  box(ctx, 1380, 1250, 20, 70, 6, '#30CE65', 6); starPath(ctx, 1390, 1240, 26, 12); fillStroke(ctx, '#FFD447', 6);
  circle(ctx, 1440, 1290, 22, '#C98B4B', 6);
  box(ctx, 1270, 1310, 230, 190, 16, '#EE384A', 9); box(ctx, 1270, 1310, 230, 30, 10, shade('#EE384A', -.15), 7);
  txt(ctx, 'TOYS', 1385, 1415, 54, '#FFFFFF', OUTLINE, 8);
  // rug + floor stuff
  ellipse(ctx, 470, 1600, 470, 96, '#20BDBB', 9); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.setLineDash([22, 16]);
  ctx.beginPath(); ctx.ellipse(470, 1600, 400, 74, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]); ellipse(ctx, 470, 1600, 250, 42, '#7FE0D8');
  ellipse(ctx, 920, 1700, 36, 36, '#FF8528', 7); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(884, 1700); ctx.lineTo(956, 1700); ctx.moveTo(920, 1664); ctx.lineTo(920, 1736); ctx.stroke();
  hmStringLights(ctx, -540, 1700, 200, 34, T, false);
  if (N) {
    hmNight(ctx);
    hmWindowLit(ctx, 300, 320, 300, 420, T, cam);
    hmStringLights(ctx, -540, 1700, 200, 34, T, true);
    hmGameScreen(ctx, 794, 1002, 252, 160, T); hmGlow(ctx, 920, 1090, 460, '#5FB8FF', .28);
    hmLavaLamp(ctx, 735, 1222, T, true); hmGlow(ctx, 735, 1130, 200, '#FF7AC8', .45);
    for (let i = 0; i < 2; i++) { circle(ctx, 1150, 1070 + i * 64, 24, `hsl(${(T * 90 + i * 120) % 360},90%,62%)`, 5); circle(ctx, 1150, 1070 + i * 64, 8, '#2A2540'); }
    hmGlow(ctx, 1150, 1100, 140, '#B080FF', .3);
  }
}

// ======================================================================================
// 3. BATHROOM  (envBathroomFront = tub front, rim, bubbles, duck — call after a character in the bath)
// ======================================================================================
function hmTub(ctx, T, C, bgPass) {
  ctx.save(); ctx.translate(-60, 0);
  // tub body (claw-foot), rim y 1240
  if (bgPass) { // bubbles behind the bather
    const r = hmRng(77);
    for (let i = 0; i < 16; i++) { const bx = 610 + r() * 680, br = 26 + r() * 30, by = 1218 - r() * 50 + Math.sin(T * 2 + i) * 3; circle(ctx, bx, by, br, C('#FFFFFF'), 5, C('#9FD8EE')); }
  }
  for (const x of [640, 1250]) { box(ctx, x - 26, 1486, 52, 46, 16, C('#FFD447'), 7); for (let k = -1; k <= 1; k++) circle(ctx, x + k * 16, 1530, 10, C('#FFD447'), 5); }
  ctx.beginPath(); ctx.moveTo(574, 1252); ctx.lineTo(1316, 1252); ctx.lineTo(1300, 1420); ctx.quadraticCurveTo(1290, 1500, 1200, 1504); ctx.lineTo(690, 1504); ctx.quadraticCurveTo(600, 1500, 590, 1420); ctx.closePath();
  fillStroke(ctx, C('#FF8FB8'), 9);
  ctx.save(); ctx.clip(); ctx.fillStyle = C('#FFB3D0'); ctx.fillRect(560, 1252, 780, 40);
  ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(560, 1300, 780, 18); ctx.restore();
  box(ctx, 552, 1232, 786, 40, 20, C('#FFFFFF'), 9);
  // front bubbles on the rim (kept low in the middle so a bather's face stays clear)
  const pts = [[600, 1226, 30], [648, 1214, 36], [700, 1230, 26], [740, 1236, 20], [1150, 1228, 28], [1200, 1214, 36], [1260, 1224, 30], [1300, 1236, 22], [830, 1244, 16], [960, 1246, 14], [1040, 1244, 16]];
  for (const [x, y, rr_] of pts) { circle(ctx, x, y + Math.sin(T * 2.4 + x) * 2.5, rr_, C('#FFFFFF'), 5, C('#9FD8EE')); circle(ctx, x - rr_ * .35, y - rr_ * .35, rr_ * .22, C('#E6F7FF')); }
  // rubber duck on the rim
  const dy = Math.sin(T * 1.6) * 3;
  ctx.save(); ctx.translate(655, 1192 + dy);
  ellipse(ctx, 0, 0, 44, 30, C('#FFD447'), 7); circle(ctx, -24, -32, 22, C('#FFD447'), 7);
  hmPoly(ctx, [[-44, -34], [-62, -28], [-44, -22]]); fillStroke(ctx, C('#FF8528'), 5);
  circle(ctx, -28, -38, 4, OUTLINE); ellipse(ctx, 14, -6, 18, 10, C('#FFE680'), 0, -.3);
  ctx.restore();
  ctx.restore();
}
function envBathroom(ctx, T, cam, o = {}) {
  const N = !!o.night;
  ctx.fillStyle = '#E3F6FF'; ctx.fillRect(-3000, -2000, 9000, 6000);
  hmCeil(ctx, '#F2FBFF', 140);
  // tiles
  ctx.fillStyle = '#A6E3EF'; ctx.fillRect(-3000, 840, 9000, 660);
  ctx.strokeStyle = '#86CADC'; ctx.lineWidth = 5;
  for (let y = 900; y < 1500; y += 80) { ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(6000, y); ctx.stroke(); }
  for (let x = -3000; x < 6000; x += 80) { ctx.beginPath(); ctx.moveTo(x, 900); ctx.lineTo(x, 1500); ctx.stroke(); }
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 836, 9000, 6);
  for (let i = -40; i < 80; i++) { ctx.fillStyle = i % 2 ? '#2EAFC9' : '#FFFFFF'; ctx.fillRect(i * 80, 842, 80, 54); }
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 896, 9000, 5);
  hmFloorChecker(ctx, cam, '#FFFFFF', '#9ED8E8');
  // frosted window above the tub
  hmWindow(ctx, 820, 330, 240, 220, T, cam, { night: N, hills: false });
  ctx.fillStyle = 'rgba(235,248,255,.35)'; ctx.fillRect(820, 330, 240, 220);
  // mirror + sink
  ctx.beginPath(); ctx.moveTo(-60, 1040); ctx.lineTo(-60, 820); ctx.arc(70, 820, 130, Math.PI, 0); ctx.lineTo(200, 1040); ctx.closePath(); fillStroke(ctx, '#FFD447', 9);
  ctx.beginPath(); ctx.moveTo(-38, 1020); ctx.lineTo(-38, 820); ctx.arc(70, 820, 108, Math.PI, 0); ctx.lineTo(178, 1020); ctx.closePath(); fillStroke(ctx, '#CDEFFF', 6);
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.55)'; hmPoly(ctx, [[-10, 1020], [30, 1020], [150, 720], [110, 720]]); ctx.fill(); hmPoly(ctx, [[50, 1020], [64, 1020], [184, 720], [170, 720]]); ctx.fill(); ctx.restore();
  for (let i = 0; i < 3; i++) { circle(ctx, 0 + i * 70, 664, 18, '#FFF3A8', 6); }
  box(ctx, -40, 650, 220, 14, 6, '#C8D2E8', 5);
  box(ctx, 40, 1220, 60, 280, 14, '#FFFFFF', 9);
  ctx.beginPath(); ctx.moveTo(-74, 1176); ctx.lineTo(214, 1176); ctx.quadraticCurveTo(210, 1262, 70, 1262); ctx.quadraticCurveTo(-70, 1262, -74, 1176); ctx.closePath(); fillStroke(ctx, '#FFFFFF', 9);
  box(ctx, -84, 1160, 308, 30, 14, '#FFFFFF', 9);
  box(ctx, 58, 1110, 24, 54, 8, '#C8D2E8', 6); box(ctx, 58, 1104, 64, 18, 8, '#C8D2E8', 6); circle(ctx, 30, 1146, 10, '#C8D2E8', 5); circle(ctx, 110, 1146, 10, '#C8D2E8', 5);
  const drip = (T * .7) % 1; if (drip > .5) circle(ctx, 116, 1124 + (drip - .5) * 2 * 40, 5, '#80CDF5', 3);
  box(ctx, -60, 1110, 40, 50, 8, '#20BDBB', 6); ctx.save(); ctx.translate(-48, 1100); ctx.rotate(-.2); box(ctx, -4, -40, 9, 48, 4, '#FF5B9B', 4); ctx.restore(); ctx.save(); ctx.translate(-34, 1100); ctx.rotate(.2); box(ctx, -4, -44, 9, 50, 4, '#FFD447', 4); ctx.restore();
  box(ctx, 160, 1108, 36, 52, 10, '#FF8FB8', 6); box(ctx, 172, 1090, 12, 20, 4, '#FFFFFF', 4);
  // linen cabinet + laundry basket (far left)
  box(ctx, -470, 700, 260, 800, 14, '#FFFFFF', 9); box(ctx, -452, 720, 224, 330, 8, '#E3F6FF', 6);
  for (let k = 0; k < 2; k++) for (let i = 0; i < 3; i++) { const c = ['#FF8FB8', '#80CDF5', '#FFD447'][(i + k) % 3]; box(ctx, -440 + i * 70, 820 + k * 150 - 70, 64, 40, 12, c, 5); box(ctx, -440 + i * 70, 820 + k * 150 - 34, 64, 40, 12, shade(c, -.08), 5); }
  box(ctx, -452, 816, 224, 12, 4, '#C8D2E8', 5); box(ctx, -452, 966, 224, 12, 4, '#C8D2E8', 5);
  box(ctx, -452, 1070, 224, 410, 8, '#F2F8FF', 6); circle(ctx, -250, 1270, 9, '#C8D2E8', 5);
  hmPoly(ctx, [[-180, 1360], [-40, 1360], [-56, 1500], [-164, 1500]]); fillStroke(ctx, '#E2B56E', 8);
  ctx.strokeStyle = 'rgba(120,70,20,.4)'; ctx.lineWidth = 4; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(-178 + k * 2, 1360 + k * 35); ctx.lineTo(-42 - k * 2, 1360 + k * 35); ctx.stroke(); }
  ellipse(ctx, -130, 1352, 40, 18, '#FF5B9B', 6); ellipse(ctx, -84, 1348, 30, 14, '#30CE65', 6);
  // shelf + towel rack
  box(ctx, 300, 780, 230, 18, 6, '#FFFFFF', 7);
  box(ctx, 318, 716, 34, 64, 10, '#FF5B9B', 6); box(ctx, 362, 730, 30, 50, 10, '#30CE65', 6); box(ctx, 404, 708, 38, 72, 12, '#7B4BFF', 6);
  hmPlant(ctx, 486, 780, .42, '#FFD447');
  for (const x of [300, 512]) box(ctx, x, 948, 20, 30, 6, '#C8D2E8', 6);
  box(ctx, 296, 956, 240, 16, 8, '#C8D2E8', 6);
  box(ctx, 332, 946, 168, 270, 18, '#FF5B9B', 8);
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(338, 1150, 156, 14); ctx.fillRect(338, 1172, 156, 8);
  box(ctx, 326, 940, 180, 50, 16, shade('#FF5B9B', .15), 8);
  // shower curtain + head
  box(ctx, 560, 640, 780, 16, 8, '#C8D2E8', 6);
  box(ctx, 600, 700, 18, 80, 6, '#C8D2E8', 6); ctx.save(); ctx.translate(626, 700); ctx.rotate(.5); box(ctx, -10, -8, 60, 26, 10, '#C8D2E8', 6); ctx.restore();
  for (let i = 0; i < 5; i++) circle(ctx, 1220 + i * 26, 650, 10, null, 5);
  ctx.beginPath(); ctx.moveTo(1210, 650); ctx.lineTo(1340, 650); ctx.lineTo(1350, 1230);
  for (let i = 0; i < 5; i++) ctx.quadraticCurveTo(1337 - i * 30, 1250, 1324 - i * 30, 1230);
  ctx.quadraticCurveTo(1190, 940, 1210, 650); ctx.closePath(); fillStroke(ctx, '#FFFFFF', 8);
  ctx.save(); ctx.clip(); for (let i = 0; i < 6; i++) { ctx.fillStyle = '#80CDF5'; ctx.fillRect(1196 + i * 30, 640, 12, 620); } ctx.restore();
  ctx.beginPath(); ctx.moveTo(1210, 650); ctx.lineTo(1340, 650); ctx.lineTo(1350, 1230); fillStroke(ctx, null, 8);
  // tub (also drawn by envBathroomFront)
  hmTub(ctx, T, hmId, true);
  // rising bubbles
  for (let i = 0; i < 7; i++) { const ph = (T * .25 + i / 7) % 1, x = 640 + i * 90 + Math.sin(T * 2 + i) * 20, y = 1180 - ph * 520; ctx.save(); ctx.globalAlpha = 1 - ph; circle(ctx, x, y, 9 + (i % 3) * 5, 'rgba(255,255,255,.7)', 4, '#86CADC'); ctx.restore(); }
  // bath mat
  box(ctx, 160, 1540, 300, 70, 30, '#7FE0D8', 8); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5; ctx.setLineDash([12, 10]); rr(ctx, 176, 1554, 268, 42, 18); ctx.stroke(); ctx.setLineDash([]);
  if (N) { hmNight(ctx, '#7A7AC0'); hmWindowLit(ctx, 820, 330, 240, 220, T, cam); for (let i = 0; i < 3; i++) hmGlow(ctx, i * 70, 664, 160, '#FFE6A0', .45); hmGlow(ctx, 70, 900, 420, '#FFE6A0', .18); }
}
function envBathroomFront(ctx, T, cam, o = {}) {
  hmTub(ctx, T, o.night ? (c => { const a = hmRgb(c), b = hmRgb('#7A7AC0'); return '#' + ((1 << 24) + (Math.round(a[0] * b[0] / 255) << 16) + (Math.round(a[1] * b[1] / 255) << 8) + Math.round(a[2] * b[2] / 255)).toString(16).slice(1); }) : hmId, false);
}

// ======================================================================================
// 4. DINING ROOM  (envDiningRoomFront = the table + dinner, drawn over characters behind it)
// ======================================================================================
function hmDiningTable(ctx, T, C) {
  for (const x of [80, 960]) box(ctx, x, 1390, 40, 112, 8, C('#8A5A2B'), 8);
  hmPoly(ctx, [[90, 1266], [990, 1266], [1052, 1330], [28, 1330]]); fillStroke(ctx, C('#FFFFFF'), 9);
  ctx.save(); hmPoly(ctx, [[90, 1266], [990, 1266], [1052, 1330], [28, 1330]]); ctx.clip();
  ctx.fillStyle = C('#FFE1E1'); for (let i = -2; i < 26; i++) ctx.fillRect(40 + i * 44, 1260, 20, 80);
  ctx.restore();
  // gingham drape
  ctx.beginPath(); ctx.moveTo(22, 1326); ctx.lineTo(1058, 1326); ctx.lineTo(1058, 1400);
  for (let i = 0; i < 14; i++) { const x = 1058 - i * 74; ctx.quadraticCurveTo(x - 37, 1432, x - 74, 1400); }
  ctx.closePath(); ctx.save(); ctx.clip();
  ctx.fillStyle = C('#FFFFFF'); ctx.fillRect(0, 1320, 1080, 130);
  ctx.fillStyle = C('#FFB3B3'); for (let i = 0; i < 26; i++) ctx.fillRect(22 + i * 44, 1320, 22, 130);
  for (let k = 0; k < 4; k++) ctx.fillRect(0, 1330 + k * 30, 1080, 15);
  ctx.fillStyle = C('#F25C5C'); for (let i = 0; i < 26; i++) for (let k = 0; k < 4; k++) ctx.fillRect(22 + i * 44, 1330 + k * 30, 22, 15);
  ctx.restore(); ctx.lineWidth = 8; ctx.strokeStyle = OUTLINE; ctx.stroke();
  // plates + cups at the three seats
  for (const x of [250, 540, 830]) {
    ellipse(ctx, x, 1300, 86, 22, C('#FFFFFF'), 6); ellipse(ctx, x, 1298, 60, 14, C('#BDE8FF'));
    ellipse(ctx, x - 18, 1290, 26, 14, C('#FFF3C4'), 4); for (let k = 0; k < 4; k++) circle(ctx, x + 14 + k * 9, 1296 - (k % 2) * 5, 5, C('#30CE65'), 2);
    box(ctx, x - 112, 1276, 8, 40, 4, C('#C8D2E8'), 3); box(ctx, x + 104, 1276, 8, 40, 4, C('#C8D2E8'), 3);
  }
  for (const x of [150, 650, 930]) { box(ctx, x - 16, 1238, 32, 60, 8, C('#DFF4FF'), 5); ctx.fillStyle = C('#FFA436'); ctx.fillRect(x - 12, 1258, 24, 36); }
  // roast chicken
  ellipse(ctx, 395, 1306, 100, 22, C('#E8F2F7'), 6);
  for (const s of [-1, 1]) { ctx.save(); ctx.translate(395 + s * 56, 1262); ctx.rotate(s * .6); box(ctx, -8, -40, 16, 30, 6, C('#FFFFFF'), 4); circle(ctx, -6, -42, 8, C('#FFFFFF'), 4); circle(ctx, 6, -42, 8, C('#FFFFFF'), 4); ctx.restore(); }
  ellipse(ctx, 395, 1266, 72, 44, C('#D9893A'), 7); ellipse(ctx, 375, 1252, 32, 14, C('#F2B266')); ellipse(ctx, 395, 1300, 66, 8, C('#B8692A'));
  // spaghetti bowl
  ctx.beginPath(); ctx.ellipse(690, 1262, 64, 30, 0, Math.PI, 0); fillStroke(ctx, C('#FFE08A'), 6);
  ctx.strokeStyle = C('#E8B84A'); ctx.lineWidth = 4; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(660 + k * 20, 1256, 12, Math.PI, TAU); ctx.stroke(); }
  for (const [x, y] of [[668, 1246], [700, 1238], [720, 1252]]) circle(ctx, x, y, 10, C('#8A4A2A'), 4);
  ellipse(ctx, 694, 1236, 20, 8, C('#E8432F'));
  ctx.beginPath(); ctx.moveTo(620, 1262); ctx.lineTo(760, 1262); ctx.quadraticCurveTo(752, 1306, 690, 1306); ctx.quadraticCurveTo(628, 1306, 620, 1262); ctx.closePath(); fillStroke(ctx, C('#4FA3E0'), 7);
  ctx.fillStyle = C('#FFFFFF'); for (let k = 0; k < 4; k++) circle(ctx, 650 + k * 26, 1282, 5, C('#FFFFFF'));
  // bread basket + juice pitcher
  ctx.save(); ctx.translate(990, 1262); ctx.rotate(-.25); box(ctx, -40, -14, 80, 26, 13, C('#E8A04A'), 5); ctx.restore();
  ctx.save(); ctx.translate(1000, 1262); ctx.rotate(.2); box(ctx, -38, -12, 76, 24, 12, C('#F2B266'), 5); ctx.restore();
  ctx.beginPath(); ctx.moveTo(938, 1270); ctx.lineTo(1040, 1270); ctx.lineTo(1024, 1306); ctx.lineTo(954, 1306); ctx.closePath(); fillStroke(ctx, C('#C98B4B'), 6);
  ctx.beginPath(); ctx.moveTo(70, 1204); ctx.lineTo(110, 1204); ctx.lineTo(118, 1296); ctx.lineTo(62, 1296); ctx.closePath(); fillStroke(ctx, C('#DFF4FF'), 6);
  ctx.fillStyle = C('#FF9A2E'); ctx.fillRect(66, 1236, 48, 56);
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(118, 1244, 18, -1.3, 1.3); ctx.stroke();
}
function envDiningRoom(ctx, T, cam, o = {}) {
  const N = !!o.night;
  ctx.fillStyle = '#FFE3A3'; ctx.fillRect(-3000, -2000, 9000, 6000);
  ctx.fillStyle = '#FCD98E'; for (let i = -30; i < 60; i++) ctx.fillRect(i * 100, 140, 6, 1000);
  hmCeil(ctx, '#FFF2D6', 140);
  // wainscoting
  ctx.fillStyle = '#F7F2FF'; ctx.fillRect(-3000, 1060, 9000, 440);
  for (let i = -20; i < 40; i++) box(ctx, i * 200 + 20, 1110, 160, 330, 8, '#EDE6FA', 5);
  box(ctx, -3000, 1046, 9000, 28, 6, '#C98B4B', 7);
  hmBase(ctx, '#F7F2FF');
  hmFloorWood(ctx, cam, '#B97A47', '#94582C', 110);
  // window + curtains
  hmWindow(ctx, 120, 300, 290, 430, T, cam, { night: N });
  hmCurtains(ctx, 120, 300, 290, 430, '#EE5A6F', T);
  // painting
  hmFrame(ctx, 680, 360, 200, 170, '#C98B4B', '#BDE8FF', (x, y, w, h) => {
    ellipse(ctx, x + w / 2, y + h + 10, w * .7, h * .4, '#8B5A2B'); for (const [fx, fy, c] of [[-.18, .62, '#EE384A'], [.05, .58, '#FFD447'], [.22, .64, '#30CE65'], [0, .45, '#FF8528']]) circle(ctx, x + w * (.5 + fx), y + h * fy, 20, c, 4);
  });
  hmClock(ctx, -170, 560, 56, T);
  hmPlant(ctx, -150, 1500, 1.3, '#4FA3E0');
  // pendant lamp
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(540, -2000); ctx.lineTo(540, 600); ctx.stroke();
  box(ctx, 524, 590, 32, 24, 6, '#3A3550', 5);
  ctx.beginPath(); ctx.moveTo(420, 720); ctx.quadraticCurveTo(430, 604, 540, 604); ctx.quadraticCurveTo(650, 604, 660, 720); ctx.closePath(); fillStroke(ctx, '#FF8528', 9);
  ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.ellipse(500, 650, 30, 12, -.5, 0, TAU); ctx.fill();
  ellipse(ctx, 540, 722, 40, 16, '#FFF3B0', 6);
  // hutch with plates
  box(ctx, 900, 640, 400, 560, 14, '#A8693A', 10);
  box(ctx, 870, 620, 460, 34, 10, '#C98B4B', 9);
  for (let s = 0; s < 2; s++) { const sx = 920 + s * 185; box(ctx, sx, 670, 175, 500, 10, '#6E4325', 7);
    for (let k = 0; k < 3; k++) { const sy = 670 + (k + 1) * 160; box(ctx, sx + 6, sy - 14, 163, 14, 4, '#C98B4B', 5);
      if (k < 2) for (let p = 0; p < 2; p++) { circle(ctx, sx + 48 + p * 80, sy - 62, 42, '#FFFFFF', 6); circle(ctx, sx + 48 + p * 80, sy - 62, 30, '#BDE8FF'); circle(ctx, sx + 48 + p * 80, sy - 62, 20, '#FFFFFF'); }
      else for (let p = 0; p < 3; p++) { box(ctx, sx + 22 + p * 50, sy - 66, 38, 50, 10, ['#FF5B9B', '#FFD447', '#20BDBB'][p], 6); } }
    ctx.fillStyle = 'rgba(220,240,255,.18)'; ctx.fillRect(sx, 670, 175, 500); }
  box(ctx, 880, 1190, 440, 30, 8, '#C98B4B', 9);
  box(ctx, 900, 1220, 400, 280, 10, '#A8693A', 10);
  box(ctx, 918, 1240, 172, 240, 8, '#B5753F', 6); box(ctx, 1110, 1240, 172, 240, 8, '#B5753F', 6);
  circle(ctx, 1076, 1360, 8, '#FFD447', 4); circle(ctx, 1124, 1360, 8, '#FFD447', 4);
  // fruit bowl on the hutch
  for (const [fx, c] of [[1070, '#EE384A'], [1110, '#FFD447'], [1150, '#FF8528'], [1092, '#30CE65']]) circle(ctx, fx, 1160 - (fx === 1092 ? 24 : 0), 22, c, 5);
  ctx.beginPath(); ctx.ellipse(1110, 1170, 80, 26, 0, 0, Math.PI); fillStroke(ctx, '#4FA3E0', 6);
  // chairs (backs show above the table)
  for (const x of [250, 540, 830]) {
    box(ctx, x - 104, 1110, 26, 390, 8, '#2EAFA0', 8); box(ctx, x + 78, 1110, 26, 390, 8, '#2EAFA0', 8);
    for (let k = 0; k < 3; k++) box(ctx, x - 52 + k * 40, 1150, 24, 190, 6, '#2EAFA0', 6);
    box(ctx, x - 118, 1094, 236, 50, 20, '#2EAFA0', 8); ellipse(ctx, x, 1106, 70, 8, 'rgba(255,255,255,.3)');
    box(ctx, x - 112, 1336, 224, 30, 10, '#FF8528', 7);
  }
  // rug
  box(ctx, -60, 1530, 1200, 150, 30, '#7B4BFF', 9); box(ctx, -30, 1550, 1140, 110, 22, '#9B7BFF', 0);
  ctx.strokeStyle = '#FFD447'; ctx.lineWidth = 6; ctx.setLineDash([20, 14]); rr(ctx, -20, 1560, 1120, 90, 18); ctx.stroke(); ctx.setLineDash([]);
  if (o.table !== false) hmDiningTable(ctx, T, hmId);
  if (N) {
    hmNight(ctx);
    hmWindowLit(ctx, 120, 300, 290, 430, T, cam);
    ellipse(ctx, 540, 722, 40, 16, '#FFF8D0', 6);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, 720, 0, 1400); g.addColorStop(0, 'rgba(255,190,90,.35)'); g.addColorStop(1, 'rgba(255,190,90,0)');
    ctx.fillStyle = g; hmPoly(ctx, [[440, 722], [640, 722], [1000, 1400], [80, 1400]]); ctx.fill(); ctx.restore();
    hmGlow(ctx, 540, 740, 420, '#FFB347', .4);
  }
}
function envDiningRoomFront(ctx, T, cam, o = {}) {
  hmDiningTable(ctx, T, o.night ? hmMul : hmId);
  if (o.night) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,180,90,.12)'; hmPoly(ctx, [[90, 1266], [990, 1266], [1052, 1330], [28, 1330]]); ctx.fill(); ctx.restore(); }
}

// ======================================================================================
// 5. GARAGE
// ======================================================================================
function hmCar(ctx, x, y, s, col, o = {}) { // side view, facing left; x = centre, y = ground; ~800*s long
  const C = o.C || hmId, dk = shade(col, -.22);
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s);
  ctx.beginPath(); ctx.moveTo(-250, -236); ctx.lineTo(-150, -370); ctx.lineTo(170, -370); ctx.lineTo(270, -236); ctx.closePath(); fillStroke(ctx, C(col), 9);
  hmPoly(ctx, [[-226, -240], [-138, -350], [8, -350], [8, -240]]); fillStroke(ctx, C(o.night ? '#3D4A7A' : '#BDE8FF'), 7);
  hmPoly(ctx, [[30, -240], [30, -350], [160, -350], [244, -240]]); fillStroke(ctx, C(o.night ? '#3D4A7A' : '#BDE8FF'), 7);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; hmPoly(ctx, [[-120, -350], [-90, -350], [-160, -246], [-190, -246]]); ctx.fill();
  rr(ctx, -400, -260, 800, 176, 56); fillStroke(ctx, C(col), 9);
  ctx.fillStyle = 'rgba(255,255,255,.22)'; rr(ctx, -360, -246, 620, 18, 9); ctx.fill();
  for (const wx of [-230, 230]) { ctx.beginPath(); ctx.arc(wx, -84, 98, Math.PI, 0); ctx.closePath(); fillStroke(ctx, C(dk), 7); }
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(18, -250); ctx.lineTo(18, -110); ctx.stroke();
  box(ctx, -60, -206, 40, 12, 6, C('#C8D2E8'), 4); box(ctx, 70, -206, 40, 12, 6, C('#C8D2E8'), 4);
  box(ctx, -408, -214, 44, 44, 14, C('#FFF3A8'), 6); box(ctx, 372, -218, 32, 50, 10, C('#EE384A'), 6);
  box(ctx, -420, -130, 140, 34, 14, C('#C8D2E8'), 7); box(ctx, 290, -130, 130, 34, 14, C('#C8D2E8'), 7);
  for (const wx of [-230, 230]) { circle(ctx, wx, -80, 80, C('#2A2540'), 9); circle(ctx, wx, -80, 40, C('#C8D2E8'), 7);
    ctx.save(); ctx.translate(wx, -80); ctx.rotate(o.spin || 0); ctx.fillStyle = C('#8A93A8'); for (let k = 0; k < 5; k++) { ctx.rotate(TAU / 5); ctx.fillRect(-4, 10, 8, 24); } ctx.restore(); circle(ctx, wx, -80, 12, C('#8A93A8'), 5); }
  ctx.restore();
}
function hmBike(ctx, x, y, col) {
  for (const wx of [x - 120, x + 120]) { ctx.lineWidth = 18; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.arc(wx, y - 74, 70, 0, TAU); ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = '#3A3550'; ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = '#9AA0B8'; for (let k = 0; k < 8; k++) { const a = k * TAU / 8; ctx.beginPath(); ctx.moveTo(wx, y - 74); ctx.lineTo(wx + Math.cos(a) * 62, y - 74 + Math.sin(a) * 62); ctx.stroke(); } circle(ctx, wx, y - 74, 9, '#C8D2E8', 4); }
  const pts = [[x - 120, y - 74], [x - 30, y - 210], [x + 90, y - 200], [x - 10, y - 80], [x - 120, y - 74]];
  for (const [lw, c] of [[22, OUTLINE], [12, col]]) { ctx.lineWidth = lw; ctx.strokeStyle = c; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.moveTo(x - 30, y - 210); ctx.lineTo(x - 10, y - 80); ctx.moveTo(x + 90, y - 200); ctx.lineTo(x + 120, y - 74); ctx.moveTo(x + 90, y - 200); ctx.lineTo(x + 80, y - 250); ctx.stroke(); }
  box(ctx, x - 80, y - 236, 90, 24, 12, '#2A2540', 6);
  ctx.lineWidth = 10; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.moveTo(x + 50, y - 252); ctx.lineTo(x + 112, y - 256); ctx.stroke();
  ctx.strokeStyle = '#FF5B9B'; ctx.lineWidth = 5; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(x + 112, y - 256); ctx.lineTo(x + 130 + k * 4, y - 226 + k * 8); ctx.stroke(); }
  box(ctx, x - 26, y - 102, 36, 36, 18, '#3A3550', 5);
}
function envGarage(ctx, T, cam, o = {}) {
  const N = !!o.night, open = clamp(o.open ?? 0);
  ctx.fillStyle = '#C9CED8'; ctx.fillRect(-3000, -2000, 9000, 6000);
  ctx.strokeStyle = 'rgba(70,80,105,.18)'; ctx.lineWidth = 4;
  for (let k = 0; k < 22; k++) { const y = 150 + k * 66; ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(6000, y); ctx.stroke(); for (let i = -20; i < 40; i++) { const x = i * 160 + (k % 2) * 80; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 66); ctx.stroke(); } }
  hmCeil(ctx, '#9AA2B2', 120, '#D8DCE6');
  // floor (concrete)
  const fg = ctx.createLinearGradient(0, FLOOR, 0, FLOOR + 700); fg.addColorStop(0, '#B4B9C4'); fg.addColorStop(1, '#989EAB'); ctx.fillStyle = fg; ctx.fillRect(-3000, FLOOR, 9000, 2600);
  ctx.strokeStyle = 'rgba(60,66,86,.25)'; ctx.lineWidth = 5;
  for (let i = -10; i < 16; i++) { const x = i * 480; ctx.beginPath(); ctx.moveTo(x, FLOOR); ctx.lineTo(x + (x - cam.x) * .9, FLOOR + 900); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-3000, FLOOR + 260); ctx.lineTo(6000, FLOOR + 260); ctx.stroke();
  ellipse(ctx, 1100, 1600, 260, 40, 'rgba(40,40,70,.16)'); ellipse(ctx, 980, 1640, 90, 18, 'rgba(40,40,70,.14)');
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - 4, 9000, 9);
  // roll-up door (opening x 180..900, y 400..1500)
  const dx0 = 180, dx1 = 900, dy0 = 400;
  ctx.save(); ctx.beginPath(); ctx.rect(dx0, dy0, dx1 - dx0, FLOOR - dy0); ctx.clip();
  const { dx } = par(cam, .35);
  const sg = ctx.createLinearGradient(0, dy0, 0, 1300); sg.addColorStop(0, N ? '#16143E' : '#5DB9F2'); sg.addColorStop(1, N ? '#3B3480' : '#CFEFFF'); ctx.fillStyle = sg; ctx.fillRect(dx0, dy0, dx1 - dx0, 1100);
  ctx.save(); ctx.translate(dx, 0);
  if (N) { circle(ctx, 760, 520, 40, '#FFF2B8'); for (let i = 0; i < 10; i++) { const r = hmRng(i + 90); circle(ctx, 160 + r() * 760, 430 + r() * 300, 3, '#FFF6C8'); } }
  else { hmCloud(ctx, 330 + (T * 12) % 300, 520, .8); circle(ctx, 780, 500, 40, '#FFE066'); }
  hmHouse(ctx, 250, 1280, 300, 220, N ? '#7C7AB0' : '#FF9AB4', N ? '#3E3A6A' : '#7B4BFF', { night: N });
  hmHouse(ctx, 640, 1280, 300, 200, N ? '#6A86A8' : '#9BE07A', N ? '#3E3A6A' : '#EE384A', { night: N });
  ctx.fillStyle = N ? '#2B5A3A' : '#65C75A'; ctx.fillRect(-400, 1280, 2000, 100); ctx.restore();
  ctx.fillStyle = N ? '#4A4E66' : '#A9AEBA'; hmPoly(ctx, [[260, 1380], [820, 1380], [960, 1500], [120, 1500]]); ctx.fill();
  ctx.fillStyle = N ? '#3A3E58' : '#8F95A3'; ctx.fillRect(dx0, 1370, dx1 - dx0, 14);
  // door panel
  const bot = FLOOR - open * 1060;
  if (bot > dy0 + 10) {
    ctx.fillStyle = '#F2F2F6'; ctx.fillRect(dx0, dy0, dx1 - dx0, bot - dy0);
    for (let y = bot; y > dy0; y -= 92) { ctx.fillStyle = OUTLINE; ctx.fillRect(dx0, y - 6, dx1 - dx0, 6); ctx.fillStyle = '#DDE0E8'; ctx.fillRect(dx0, y - 30, dx1 - dx0, 18); }
    const wy = bot - 92 * 9 - 70; if (wy > dy0) for (let i = 0; i < 4; i++) box(ctx, dx0 + 40 + i * 172, wy, 120, 50, 8, N ? '#3D4A7A' : '#BDE8FF', 6);
    box(ctx, 510, bot - 50, 60, 16, 6, '#8A93A8', 5);
    ctx.fillStyle = OUTLINE; ctx.fillRect(dx0, bot - 6, dx1 - dx0, 8);
  }
  ctx.restore();
  box(ctx, dx0 - 30, dy0 - 30, 30, FLOOR - dy0 + 30, 6, '#F2C94C', 8); box(ctx, dx1, dy0 - 30, 30, FLOOR - dy0 + 30, 6, '#F2C94C', 8);
  box(ctx, dx0 - 40, dy0 - 60, dx1 - dx0 + 80, 40, 8, '#F2C94C', 8);
  box(ctx, 470, 180, 140, 60, 10, '#8A93A8', 7); ctx.strokeStyle = '#6B7080'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(540, 240); ctx.lineTo(540, dy0 - 60); ctx.stroke();
  // tube lights
  for (const lx of [100, 1000]) { ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(lx + 40, 140); ctx.lineTo(lx + 40, 190); ctx.moveTo(lx + 300, 140); ctx.lineTo(lx + 300, 190); ctx.stroke();
    box(ctx, lx, 186, 340, 34, 14, '#F4F8FF', 7); }
  // metal shelves with boxes
  for (const sx of [-460, -150]) box(ctx, sx, 560, 22, 940, 6, '#6B7080', 7);
  const boxesC = ['#D9A85C', '#E2B56E', '#C9944A'];
  for (let k = 0; k < 4; k++) { const sy = 760 + k * 220; box(ctx, -470, sy, 362, 20, 4, '#8A93A8', 6);
    const R = hmRng(k * 7 + 3); let bx = -430;
    while (bx < -170) { const bw = 70 + R() * 50, bh = 80 + R() * 80; if (bx + bw > -150) break;
      if (R() < .25) { box(ctx, bx, sy - 64, 56, 64, 8, ['#EE384A', '#2E62C9', '#30CE65'][k % 3], 6); box(ctx, bx - 2, sy - 72, 60, 14, 5, '#C8D2E8', 5); bx += 66; continue; }
      box(ctx, bx, sy - bh, bw, bh, 6, boxesC[Math.floor(R() * 3)], 6); ctx.fillStyle = '#B88A44'; ctx.fillRect(bx + bw / 2 - 8, sy - bh + 3, 16, bh - 6);
      box(ctx, bx + 10, sy - bh * .55, bw * .4, 20, 3, '#FFFFFF', 3); bx += bw + 8; } }
  circle(ctx, -300, 525, 34, '#FF8528', 7); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-334, 525); ctx.lineTo(-266, 525); ctx.stroke();
  // pegboard + workbench
  box(ctx, -100, 740, 260, 420, 8, '#D9A85C', 8);
  ctx.fillStyle = '#B88A44'; for (let i = 0; i < 8; i++) for (let k = 0; k < 13; k++) circle(ctx, -80 + i * 31, 760 + k * 31, 3.5, '#B88A44');
  ctx.save(); ctx.translate(-40, 860); ctx.rotate(-.5); box(ctx, -8, -10, 16, 120, 6, '#C98B4B', 5); box(ctx, -32, -26, 64, 26, 6, '#6B7080', 6); ctx.restore();
  ctx.save(); ctx.translate(60, 840); ctx.rotate(.4); box(ctx, -10, -10, 20, 110, 8, '#C8D2E8', 5); circle(ctx, 0, -12, 22, '#C8D2E8', 5); circle(ctx, 0, -16, 10, '#D9A85C'); ctx.restore();
  ctx.save(); ctx.translate(120, 860); box(ctx, -8, -40, 16, 40, 6, '#EE384A', 5); box(ctx, -3, 0, 6, 60, 3, '#C8D2E8', 3); ctx.restore();
  ctx.save(); ctx.translate(-30, 1020); hmPoly(ctx, [[0, -26], [150, -26], [150, 10], [20, 30], [0, 30]]); fillStroke(ctx, '#C8D2E8', 6);
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i < 12; i++) { ctx.moveTo(24 + i * 10, 18 - i * .8); ctx.lineTo(28 + i * 10, 26 - i * .8); } ctx.stroke(); box(ctx, -40, -30, 46, 62, 14, '#FF8528', 6); ctx.restore();
  box(ctx, -130, 1196, 320, 36, 8, '#B5753F', 9);
  for (const x of [-116, 154]) box(ctx, x, 1230, 24, 270, 6, '#8A5A2B', 7);
  box(ctx, -110, 1400, 280, 18, 4, '#8A5A2B', 6);
  box(ctx, -96, 1340, 50, 60, 8, '#2E62C9', 6); box(ctx, -36, 1350, 50, 50, 8, '#EE384A', 6);
  box(ctx, 20, 1126, 120, 72, 10, '#EE384A', 8); box(ctx, 50, 1106, 60, 24, 8, null, 7); ctx.fillStyle = '#C8D2E8'; ctx.fillRect(28, 1150, 104, 8);
  box(ctx, -110, 1150, 70, 46, 8, '#6B7080', 7); box(ctx, -96, 1132, 42, 20, 4, '#6B7080', 6);
  // tire + stuff on right wall
  circle(ctx, 1240, 520, 92, '#2A2540', 9); circle(ctx, 1240, 520, 50, '#C9CED8', 7); ctx.strokeStyle = '#4A4560'; ctx.lineWidth = 5;
  for (let k = 0; k < 12; k++) { const a = k * TAU / 12; ctx.beginPath(); ctx.moveTo(1240 + Math.cos(a) * 58, 520 + Math.sin(a) * 58); ctx.lineTo(1240 + Math.cos(a) * 84, 520 + Math.sin(a) * 84); ctx.stroke(); }
  box(ctx, 960, 760, 420, 20, 4, '#8A93A8', 6);
  for (let i = 0; i < 4; i++) { const px = 990 + i * 92; box(ctx, px, 680, 64, 80, 8, ['#FFD447', '#20BDBB', '#FF5B9B', '#C8D2E8'][i], 6); box(ctx, px - 3, 674, 70, 14, 5, '#C8D2E8', 5); }
  box(ctx, 990, 420, 120, 60, 8, '#FFFFFF', 7); txt(ctx, 'STOP', 1050, 452, 34, '#EE384A');
  // floor props: parking line, drain, skateboard, ball, cones
  ctx.fillStyle = '#F2C94C'; hmPoly(ctx, [[600, 1520], [624, 1520], [624 + (624 - cam.x) * .5, 1970], [600 + (600 - cam.x) * .5, 1970]]); ctx.fill();
  circle(ctx, 470, 1760, 34, '#7D8494', 6); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(452, 1760 + k * 9); ctx.lineTo(488, 1760 + k * 9); ctx.stroke(); }
  ctx.save(); ctx.translate(150, 1700); ctx.rotate(-.06); box(ctx, -120, -18, 240, 26, 13, '#7B4BFF', 7); box(ctx, -96, -14, 50, 8, 4, '#FFD447', 0); box(ctx, 40, -14, 50, 8, 4, '#FF5B9B', 0);
  for (const wx of [-80, 80]) circle(ctx, wx, 20, 15, '#FFD447', 6); ctx.restore();
  circle(ctx, 300, 1640, 44, '#FF8528', 7); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(256, 1640); ctx.lineTo(344, 1640); ctx.moveTo(300, 1596); ctx.lineTo(300, 1684); ctx.stroke();
  for (const [kx, ky] of [[880, 1650], [960, 1690]]) { hmPoly(ctx, [[kx - 18, ky - 90], [kx + 18, ky - 90], [kx + 40, ky], [kx - 40, ky]]); fillStroke(ctx, '#FF8528', 7); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(kx - 26, ky - 50, 52, 14); box(ctx, kx - 52, ky - 6, 104, 16, 6, '#FF8528', 6); }
  // bike + car
  hmBike(ctx, 380, 1496, '#30CE65');
  box(ctx, 560, 1484, 120, 22, 8, '#F2C94C', 7);
  hmCar(ctx, 1080, 1500, 1, '#EE384A', { night: N });
  if (N) {
    hmNight(ctx, '#7471B8');
    for (const lx of [100, 1000]) { box(ctx, lx, 186, 340, 34, 14, '#FFFFFF', 7); hmGlow(ctx, lx + 170, 220, 500, '#E6F0FF', .35); }
    if (open > .05) { ctx.save(); ctx.beginPath(); ctx.rect(dx0, dy0, dx1 - dx0, FLOOR - open * 1060 < dy0 ? FLOOR - dy0 : 0); ctx.restore(); }
  }
}
function hmHouse(ctx, x, y, w, h, col, roof, o = {}) { // x = left, y = ground
  const C = o.C || hmId, lit = o.night;
  if (o.litOnly) { // only re-light windows (after hmNight)
    for (const wx of [x + w * .1, x + w * .64]) { box(ctx, wx, y - h + h * .2, w * .26, h * .3, 6, '#FFD98A', 6); ctx.fillStyle = OUTLINE; ctx.fillRect(wx + w * .13 - 3, y - h + h * .2, 6, h * .3); ctx.fillRect(wx, y - h + h * .35 - 3, w * .26, 6); hmGlow(ctx, wx + w * .13, y - h + h * .35, w * .35, '#FFC86A', .35); }
    return;
  }
  if (o.chimney) box(ctx, x + w * .68, y - h - h * .55, w * .12, h * .4, 6, C(shade(roof, .2)), 8);
  hmPoly(ctx, [[x - 34, y - h + 12], [x + w / 2, y - h - h * .62], [x + w + 34, y - h + 12]]); fillStroke(ctx, C(roof), 9);
  ctx.strokeStyle = C(shade(roof, -.2)); ctx.lineWidth = 5; for (let k = 1; k < 4; k++) { const t = k / 4, yy = lerp(y - h - h * .62, y - h + 12, t), hw = lerp(0, w / 2 + 34, t); ctx.beginPath(); ctx.moveTo(x + w / 2 - hw + 6, yy); ctx.lineTo(x + w / 2 + hw - 6, yy); ctx.stroke(); }
  box(ctx, x, y - h, w, h, 6, C(col), 9);
  const dw = Math.min(70, w * .2), dh = Math.min(h * .55, 130); box(ctx, x + w / 2 - dw / 2, y - dh, dw, dh + 4, 10, C(o.door || '#FFFFFF'), 7); circle(ctx, x + w / 2 + dw * .25, y - dh * .5, 5, C('#FFD447'), 3);
  for (const wx of [x + w * .1, x + w * .64]) { box(ctx, wx - 12, y - h + h * .2, 12, h * .3, 4, C(shade(col, -.25)), 5); box(ctx, wx + w * .26, y - h + h * .2, 12, h * .3, 4, C(shade(col, -.25)), 5);
    box(ctx, wx, y - h + h * .2, w * .26, h * .3, 6, C(lit ? '#3D4A7A' : '#BDE8FF'), 6); ctx.fillStyle = C('#FFFFFF'); ctx.fillRect(wx + w * .13 - 3, y - h + h * .2, 6, h * .3); ctx.fillRect(wx, y - h + h * .35 - 3, w * .26, 6); }
}

// ======================================================================================
// 6. CAR INSIDE  (looking forward from the back seat)
// ======================================================================================
function hmRoad(ctx, T, sp, N) {
  const hy = 610, by = 900, vx = 540 + Math.sin(T * .3) * 40;
  const g = ctx.createLinearGradient(0, 300, 0, hy); g.addColorStop(0, N ? '#0F0E2E' : '#4DAFF0'); g.addColorStop(1, N ? '#2C2868' : '#D6F1FF'); ctx.fillStyle = g; ctx.fillRect(-300, 280, 1700, hy - 280);
  if (N) { for (let i = 0; i < 24; i++) { const r = hmRng(i + 300); circle(ctx, -100 + r() * 1300, 320 + r() * 240, 2 + r() * 2, '#FFF6C8'); } circle(ctx, 820, 420, 34, '#FFF2B8'); }
  else { circle(ctx, 830, 420, 40, '#FFE066'); for (let i = 0; i < 4; i++) hmCloud(ctx, ((((i * 380 - T * 10 * sp) % 1600) + 1600) % 1600) - 200, 380 + (i % 2) * 60, .7); }
  // mountains + hills
  for (const [mx, mh, mw] of [[150, 170, 260], [420, 120, 220], [760, 190, 300], [1050, 140, 240]]) { hmPoly(ctx, [[mx - mw, hy], [mx, hy - mh], [mx + mw, hy]]); fillStroke(ctx, N ? '#2A2F5E' : '#8BB6E0', 6);
    if (!N) { hmPoly(ctx, [[mx - mw * .25, hy - mh * .75], [mx, hy - mh], [mx + mw * .25, hy - mh * .75]]); fillStroke(ctx, '#FFFFFF', 0); } }
  ctx.fillStyle = N ? '#1F3A33' : '#7CCB6A'; ctx.fillRect(-300, hy, 1700, by - hy + 60);
  ctx.fillStyle = OUTLINE; ctx.fillRect(-300, hy - 2, 1700, 5);
  // road
  hmPoly(ctx, [[vx - 14, hy], [vx + 14, hy], [1300, by + 40], [-220, by + 40]]); fillStroke(ctx, N ? '#30334A' : '#5B5F6E', 6);
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(vx - 10, hy); ctx.lineTo(-140, by + 40); ctx.moveTo(vx + 10, hy); ctx.lineTo(1220, by + 40); ctx.stroke();
  const P = p => hy + (by + 40 - hy) * p, XC = p => lerp(vx, 540, p);
  for (let k = 0; k < 10; k++) { const z = ((k / 10 + T * sp * .45) % 1), p = z * z, p2 = Math.min(1.05, (z + .045) * (z + .045)), w1 = 2 + 22 * p, w2 = 2 + 22 * p2;
    hmPoly(ctx, [[XC(p) - w1, P(p)], [XC(p) + w1, P(p)], [XC(p2) + w2, P(p2)], [XC(p2) - w2, P(p2)]]); ctx.fillStyle = '#FFD447'; ctx.fill(); }
  // roadside trees and poles, far → near
  const items = [];
  for (const side of [-1, 1]) for (let k = 0; k < 7; k++) { const z = ((k / 7 + T * sp * .45 + (side > 0 ? .07 : 0)) % 1); items.push([z * z, side, k]); }
  items.sort((a, b) => a[0] - b[0]);
  for (const [p, side, k] of items) {
    const y = P(p), x = lerp(vx, 540, p) + side * (40 + 1100 * p), s = .08 + 1.5 * p;
    if (k % 3 === 2) { box(ctx, x - 6 * s, y - 330 * s, 12 * s, 330 * s, 3, '#8A6A4A', Math.max(2, 5 * s)); box(ctx, x - 50 * s, y - 320 * s, 100 * s, 10 * s, 3, '#8A6A4A', Math.max(2, 4 * s)); if (N) hmGlow(ctx, x, y - 320 * s, 90 * s, '#FFD98A', .5); }
    else { box(ctx, x - 12 * s, y - 120 * s, 24 * s, 120 * s, 4, N ? '#4A3A2A' : '#8A5A2B', Math.max(2, 6 * s)); circle(ctx, x, y - 170 * s, 80 * s, N ? '#1E4A3A' : (k % 2 ? '#3FA34D' : '#57C25E'), Math.max(2, 7 * s)); }
  }
  if (N) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const hg = ctx.createLinearGradient(0, by, 0, hy); hg.addColorStop(0, 'rgba(255,240,170,.35)'); hg.addColorStop(1, 'rgba(255,240,170,0)'); ctx.fillStyle = hg; hmPoly(ctx, [[vx - 60, hy + 40], [vx + 60, hy + 40], [1100, by + 40], [-20, by + 40]]); ctx.fill(); ctx.restore(); }
}
function hmCarSeats(ctx, T, C) {
  for (const sx of [290, 790]) {
    box(ctx, sx - 12, 1000, 24, 50, 6, C('#9AA0B8'), 5); box(ctx, sx + 24, 1000, 0, 0, 0, null, 0);
    box(ctx, sx - 84, 888, 168, 128, 40, C('#3D4160'), 9); ellipse(ctx, sx, 912, 50, 10, 'rgba(255,255,255,.12)');
    box(ctx, sx - 170, 1030, 340, 600, 70, C('#3D4160'), 10);
    box(ctx, sx - 110, 1070, 220, 520, 50, C('#4D5378'), 6);
    ctx.strokeStyle = C('#2E3150'); ctx.lineWidth = 5; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(sx - 104, 1070 + k * 120); ctx.lineTo(sx + 104, 1070 + k * 120); ctx.stroke(); }
    box(ctx, sx - 60, 1110, 120, 60, 16, C('#2E3150'), 6);
  }
  box(ctx, 470, 1200, 140, 400, 24, C('#2E3150'), 9); box(ctx, 480, 1214, 120, 40, 14, C('#3D4160'), 6);
  circle(ctx, 512, 1290, 18, C('#1E2038'), 5); circle(ctx, 568, 1290, 18, C('#1E2038'), 5);
}
function envCarFrontSeats(ctx, T, cam, o = {}) { hmCarSeats(ctx, T, o.night ? hmMul : hmId); }
function envCarInside(ctx, T, cam, o = {}) {
  const N = !!o.night, sp = o.speed ?? 1;
  ctx.fillStyle = '#6E7391'; ctx.fillRect(-3000, -2000, 9000, 6000);
  ctx.fillStyle = '#A3A8BE'; ctx.fillRect(-3000, -2000, 9000, 2300);
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 296, 9000, 6);
  // side windows (motion streaks)
  for (const s of [-1, 1]) {
    const pts = s < 0 ? [[-700, 340], [-90, 340], [-250, 960], [-700, 960]] : [[1170, 340], [1780, 340], [1780, 960], [1330, 960]];
    ctx.save(); hmPoly(ctx, pts); ctx.clip(); ctx.fillStyle = N ? '#20204A' : '#9ED8F5'; ctx.fillRect(-800, 300, 2700, 700);
    for (let i = 0; i < 9; i++) { const yy = 520 + (i % 4) * 90, len = 200 + (i % 3) * 120, xx = ((((s < 0 ? 1 : -1) * T * 1400 * sp + i * 337) % 1400) + 1400) % 1400 + (s < 0 ? -900 : 1100); box(ctx, xx, yy, len, 30 + (i % 2) * 30, 15, N ? '#2E4A5A' : (i % 2 ? '#57C25E' : '#3FA34D'), 0); }
    ctx.restore(); hmPoly(ctx, pts); fillStroke(ctx, null, 9);
  }
  // windshield
  const WS = [[160, 330], [920, 330], [1110, 930], [-30, 930]];
  ctx.save(); hmPoly(ctx, WS); ctx.clip(); hmRoad(ctx, T, sp, N);
  ctx.fillStyle = 'rgba(255,255,255,.12)'; hmPoly(ctx, [[640, 330], [760, 330], [520, 930], [400, 930]]); ctx.fill(); ctx.restore();
  hmPoly(ctx, WS); fillStroke(ctx, null, 10);
  hmPoly(ctx, [[160, 330], [60, 330], [-150, 960], [-30, 960]]); fillStroke(ctx, '#575C78', 9);
  hmPoly(ctx, [[920, 330], [1020, 330], [1230, 960], [1110, 960]]); fillStroke(ctx, '#575C78', 9);
  box(ctx, -3000, 290, 9000, 50, 0, '#8E93AA', 0); ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 336, 9000, 6);
  for (const vx of [150, 760]) { ctx.save(); ctx.translate(vx + 85, 360); ctx.rotate(vx < 500 ? .1 : -.1); box(ctx, -85, -14, 170, 46, 12, '#8E93AA', 7); ctx.restore(); }
  // mirror + air freshener
  box(ctx, 528, 330, 24, 40, 6, '#3A3D52', 6); box(ctx, 450, 362, 180, 54, 16, '#3A3D52', 8); box(ctx, 462, 372, 156, 34, 10, N ? '#3B4880' : '#BDE8FF', 5);
  ctx.save(); ctx.translate(540, 416); ctx.rotate(Math.sin(T * 2.2) * .25); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 60); ctx.stroke();
  hmPoly(ctx, [[0, 56], [22, 94], [10, 94], [26, 120], [-26, 120], [-10, 94], [-22, 94]]); fillStroke(ctx, '#30CE65', 5); ctx.restore();
  // dashboard
  ctx.beginPath(); ctx.moveTo(-800, 920); ctx.quadraticCurveTo(540, 850, 1880, 920); ctx.lineTo(1880, 1300); ctx.lineTo(-800, 1300); ctx.closePath(); fillStroke(ctx, '#3A3D52', 10);
  ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-700, 930); ctx.quadraticCurveTo(540, 866, 1780, 930); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(140, 930); ctx.quadraticCurveTo(290, 840, 440, 930); ctx.closePath(); fillStroke(ctx, '#2A2C3E', 8);
  for (const gx of [230, 350]) { circle(ctx, gx, 920, 34, N ? '#1E2850' : '#1E2038', 6); ctx.strokeStyle = N ? '#5FE0FF' : '#9AA0B8'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(gx, 920); ctx.lineTo(gx + Math.cos(-2.4 + Math.sin(T * .7 + gx) * .4 + 1.2) * 24, 920 + Math.sin(-2.4 + Math.sin(T * .7 + gx) * .4 + 1.2) * 24); ctx.stroke(); }
  box(ctx, 464, 940, 152, 96, 12, '#1E2038', 8); hmCarScreen(ctx, 474, 950, 132, 76, T, N);
  for (const vx of [-80, 680, 1010]) { box(ctx, vx, 960, 120, 40, 10, '#2A2C3E', 6); ctx.fillStyle = '#4A4E66'; for (let k = 0; k < 3; k++) ctx.fillRect(vx + 12, 968 + k * 10, 96, 4); }
  box(ctx, 680, 1030, 280, 90, 18, '#45485F', 7);
  // steering wheel (driver = left)
  ctx.lineWidth = 46; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.ellipse(290, 1000, 150, 130, 0, 0, TAU); ctx.stroke();
  ctx.lineWidth = 30; ctx.strokeStyle = '#2A2C3E'; ctx.stroke();
  if (!o.noSeats) hmCarSeats(ctx, T, hmId);
  if (N) {
    hmNight(ctx);
    hmCarScreen(ctx, 474, 950, 132, 76, T, N); hmGlow(ctx, 540, 990, 200, '#5FE0FF', .3);
    for (const gx of [230, 350]) hmGlow(ctx, gx, 920, 60, '#5FE0FF', .35);
    ctx.save(); hmPoly(ctx, WS); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; const hg = ctx.createLinearGradient(0, 930, 0, 620); hg.addColorStop(0, 'rgba(255,240,170,.25)'); hg.addColorStop(1, 'rgba(255,240,170,0)'); ctx.fillStyle = hg; ctx.fillRect(-100, 600, 1300, 340); ctx.restore();
  }
}
function hmCarScreen(ctx, x, y, w, h, T, N) {
  ctx.save(); rr(ctx, x, y, w, h, 6); ctx.clip();
  ctx.fillStyle = N ? '#1E2850' : '#CFE8D8'; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = N ? '#3E5A9A' : '#FFFFFF'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x + w * .5, y + h + 10); ctx.lineTo(x + w * .5, y + h * .4); ctx.quadraticCurveTo(x + w * .5, y + h * .1, x + w + 10, y + h * .15 + Math.sin(T * .5) * 6); ctx.stroke();
  ctx.strokeStyle = '#2E9CCA'; ctx.lineWidth = 6; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -T * 30; ctx.beginPath(); ctx.moveTo(x + w * .5, y + h + 10); ctx.lineTo(x + w * .5, y + h * .4); ctx.quadraticCurveTo(x + w * .5, y + h * .1, x + w + 10, y + h * .15); ctx.stroke(); ctx.setLineDash([]);
  hmPoly(ctx, [[x + w * .5, y + h * .62], [x + w * .5 + 10, y + h * .86], [x + w * .5, y + h * .8], [x + w * .5 - 10, y + h * .86]]); fillStroke(ctx, '#EE384A', 3);
  ctx.restore(); rr(ctx, x, y, w, h, 6); fillStroke(ctx, null, 5);
}
function envCarInsideFront(ctx, T, cam, o = {}) {
  const C = o.night ? hmMul : hmId;
  ctx.beginPath(); ctx.moveTo(-800, 1470); ctx.quadraticCurveTo(-700, 1430, -500, 1432); ctx.lineTo(1580, 1432); ctx.quadraticCurveTo(1780, 1430, 1880, 1470); ctx.lineTo(1880, 4000); ctx.lineTo(-800, 4000); ctx.closePath(); fillStroke(ctx, C('#3D4160'), 10);
  for (const cx of [270, 810]) { box(ctx, cx - 230, 1440, 460, 130, 50, C('#4D5378'), 8); ctx.strokeStyle = C('#2E3150'); ctx.lineWidth = 5; ctx.setLineDash([14, 10]); rr(ctx, cx - 210, 1456, 420, 98, 40); ctx.stroke(); ctx.setLineDash([]); }
  ctx.strokeStyle = C('#2E3150'); ctx.lineWidth = 6; for (let i = -6; i < 16; i++) { if (i === 3 || i === 4) continue; ctx.beginPath(); ctx.moveTo(i * 90 + 20, 1600); ctx.lineTo(i * 90 + 20 + (i * 90 - 520) * .25, 2200); ctx.stroke(); }
  ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(-800, 1600, 2700, 30);
  // middle armrest with cup holders + juice box
  box(ctx, 470, 1470, 140, 700, 30, C('#2E3150'), 9); circle(ctx, 512, 1530, 22, C('#1E2038'), 5); circle(ctx, 568, 1530, 22, C('#1E2038'), 5);
  box(ctx, 494, 1460, 38, 64, 6, C('#FF8528'), 6); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(522, 1462); ctx.lineTo(530, 1434); ctx.stroke(); box(ctx, 498, 1484, 30, 18, 4, C('#FFFFFF'), 3);
  // snack bag on the seat
  ctx.save(); ctx.translate(980, 1520); ctx.rotate(.3); box(ctx, -38, -50, 76, 96, 10, C('#EE384A'), 7); txt(ctx, 'CHIPS', 0, 0, 20, C('#FFD447')); ctx.restore();
  for (const s of [-1, 1]) { const px = s < 0 ? -700 : 1180; box(ctx, px, 1100, 600, 1200, 40, C('#575C78'), 10); box(ctx, px + (s < 0 ? 460 : 30), 1260, 90, 30, 14, C('#C8D2E8'), 6); }
  for (const bx of o.belts || []) {
    ctx.lineCap = 'butt'; ctx.lineWidth = 34; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.moveTo(bx - 90, 1250); ctx.lineTo(bx + 80, 1445); ctx.stroke();
    ctx.lineWidth = 22; ctx.strokeStyle = C('#4A4E66'); ctx.stroke(); ctx.lineCap = 'round';
    box(ctx, bx + 60, 1424, 50, 36, 8, C('#C8D2E8'), 6); box(ctx, bx + 70, 1434, 30, 14, 4, C('#EE384A'), 3);
  }
}

// ======================================================================================
// 7. FRONT YARD
// ======================================================================================
function hmStreetLamp(ctx, x, lit) {
  box(ctx, x - 10, 760, 20, 740, 6, '#3A3550', 7); ellipse(ctx, x, 1496, 36, 10, '#3A3550', 6);
  box(ctx, x - 40, 712, 80, 20, 8, '#3A3550', 7); hmPoly(ctx, [[x - 30, 730], [x + 30, 730], [x + 22, 790], [x - 22, 790]]); fillStroke(ctx, lit ? '#FFF1B8' : '#E8F2F7', 7);
}
const HM_HOUSES = [['#FF8FA8', '#7B4BFF'], ['#FFD447', '#EE384A'], ['#80CDF5', '#2E62C9'], ['#9BE07A', '#FF8528'], ['#C9A6FF', '#30A08A'], ['#FFB070', '#5A3A6A']];
function hmYardHouses(ctx, T, cam, N, litOnly) {
  const { dx } = par(cam, .75);
  ctx.save(); ctx.translate(dx, 0);
  for (let i = -4; i < 7; i++) {
    const [col, roof] = HM_HOUSES[((i % 6) + 6) % 6], hx = i * 560 - 180, w = i === 1 ? 460 : 400, h = i === 1 ? 300 : 270, x = hx + (i === 1 ? 0 : 30);
    if (litOnly) { hmHouse(ctx, x, 1310, w, h, col, roof, { litOnly: true }); if ((i + 4) % 3 === 0) hmGlow(ctx, x + w / 2, 1310 - Math.min(h * .55, 130) - 20, 80, '#FFD98A', .5); continue; }
    hmHouse(ctx, x, 1310, w, h, col, roof, { night: N, chimney: i % 2 === 0, door: ['#EE384A', '#2E62C9', '#30A08A', '#FFFFFF'][((i % 4) + 4) % 4] });
    ctx.fillStyle = '#D9D9E2'; hmPoly(ctx, [[x + w / 2 - 34, 1310], [x + w / 2 + 34, 1310], [x + w / 2 + 50, 1460], [x + w / 2 - 50, 1460]]); ctx.fill();
    for (let b = 0; b < 2; b++) { const bx = x + (b ? w * .78 : w * .05); for (const [ox, r] of [[0, 34], [40, 42], [84, 34]]) circle(ctx, bx + ox, 1306, r, '#3FA34D', 7);
      for (let f = 0; f < 3; f++) circle(ctx, bx + 10 + f * 34, 1286 + (f % 2) * 10, 7, ['#FF5B9B', '#FFD447', '#FFFFFF'][f]); }
  }
  // car in the driveway of the house at i = 2
  if (!litOnly) hmCar(ctx, 2 * 560 - 180 + 30 + 200, 1400, .5, '#2E62C9', { night: N });
  ctx.restore();
}
function envFrontYard(ctx, T, cam, o = {}) {
  const N = !!o.night;
  const g = ctx.createLinearGradient(0, -200, 0, 1350); g.addColorStop(0, N ? '#100E34' : '#4DAFF0'); g.addColorStop(1, N ? '#3A3480' : '#CFEFFF');
  ctx.fillStyle = g; ctx.fillRect(-3000, -2000, 9000, 6000);
  let { dx } = par(cam, .15);
  ctx.save(); ctx.translate(dx, 0);
  if (!N) { circle(ctx, 880, 360, 70, '#FFE066'); hmGlow(ctx, 880, 360, 200, '#FFF3A8', .3); for (let i = 0; i < 6; i++) hmCloud(ctx, ((((i * 520 + T * 18) % 3000) + 3000) % 3000) - 900, 380 + (i % 3) * 120, 1 + (i % 2) * .3); }
  ctx.restore();
  ({ dx } = par(cam, .4));
  ctx.save(); ctx.translate(dx, 0);
  for (let i = -6; i < 12; i++) ellipse(ctx, i * 330, 1300, 260, 150 + (i % 3) * 30, N ? '#24345A' : (i % 2 ? '#8FD08A' : '#7CC67A'));
  for (let i = -10; i < 20; i++) circle(ctx, i * 190 + 60, 1190 + (i % 2) * 30, 60, N ? '#1C2A4A' : '#5DBF62');
  ctx.restore();
  ctx.fillStyle = N ? '#2B5A3A' : '#65C75A'; ctx.fillRect(-3000, 1290, 9000, 220);
  hmYardHouses(ctx, T, cam, N, false);
  // sidewalk, curb, street
  ctx.fillStyle = '#D9D9E2'; ctx.fillRect(-3000, 1460, 9000, 125);
  ctx.strokeStyle = 'rgba(80,80,110,.3)'; ctx.lineWidth = 5;
  for (let i = -20; i < 40; i++) { const x = i * 220; ctx.beginPath(); ctx.moveTo(x, 1460); ctx.lineTo(x + (x - cam.x) * .12, 1585); ctx.stroke(); }
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 1456, 9000, 7);
  ctx.fillStyle = '#BFC0CC'; ctx.fillRect(-3000, 1585, 9000, 34); ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 1582, 9000, 6); ctx.fillRect(-3000, 1616, 9000, 6);
  ctx.fillStyle = N ? '#3E4156' : '#5B5F6E'; ctx.fillRect(-3000, 1622, 9000, 2400);
  ctx.fillStyle = '#FFD447'; for (let i = -20; i < 40; i++) { const x = i * 260; hmPoly(ctx, [[x, 1840], [x + 150, 1840], [x + 150 + (x + 150 - cam.x) * .05, 1862], [x + (x - cam.x) * .05, 1862]]); ctx.fill(); }
  // tree
  box(ctx, -10, 860, 90, 620, 18, '#8A5A2B', 9);
  ctx.strokeStyle = '#6E4325'; ctx.lineWidth = 6; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(20 + k * 14, 1000 + k * 110); ctx.lineTo(28 + k * 14, 1060 + k * 110); ctx.stroke(); }
  const sw = Math.sin(T * 1.1) * 6;
  for (const [x, y, r] of [[-120, 820, 150], [180, 820, 150], [30, 700, 190], [-60, 920, 120], [130, 930, 120]]) { rr(ctx, x - r + sw, y - r, r * 2, r * 2, r * .55); fillStroke(ctx, N ? '#1F5A35' : '#3FA34D', 9); }
  for (const [x, y] of [[-40, 640], [110, 760], [-130, 800]]) ellipse(ctx, x + sw, y, 40, 16, N ? '#2E6E45' : '#6FCC6A', 0, -.4);
  // mailbox
  box(ctx, 1000, 1250, 22, 230, 6, '#8A5A2B', 7);
  ctx.beginPath(); ctx.moveTo(940, 1270); ctx.lineTo(940, 1210); ctx.arc(980, 1210, 40, Math.PI, 0); ctx.lineTo(1100, 1170); ctx.arc(1100 - 0, 1210, 40, -Math.PI / 2, 0); ctx.lineTo(1140, 1270); ctx.closePath();
  box(ctx, 940, 1170, 200, 100, 40, '#2E62C9', 9); box(ctx, 1124, 1180, 24, 80, 10, '#2E62C9', 7);
  ctx.save(); ctx.translate(1080, 1200); ctx.rotate(-.1 + Math.sin(T * 2) * .04); box(ctx, -6, -70, 12, 80, 4, '#EE384A', 6); box(ctx, -6, -76, 44, 30, 4, '#EE384A', 6); ctx.restore();
  txt(ctx, '42', 1010, 1226, 40, '#FFFFFF', OUTLINE, 6);
  // street lamps + hydrant
  hmStreetLamp(ctx, -330, false); hmStreetLamp(ctx, 1380, false);
  box(ctx, 1220, 1430, 44, 70, 12, '#EE384A', 7); box(ctx, 1210, 1416, 64, 20, 8, '#EE384A', 6); circle(ctx, 1242, 1410, 14, '#EE384A', 6); box(ctx, 1206, 1446, 72, 14, 6, '#C42234', 5);
  if (N) {
    hmNight(ctx);
    ({ dx } = par(cam, .15)); ctx.save(); ctx.translate(dx, 0);
    for (let i = 0; i < 40; i++) { const r = hmRng(i + 500), tw = .5 + .5 * Math.sin(T * 2.5 + i); starPath(ctx, -600 + r() * 2400, 120 + r() * 700, 8 + r() * 6, 3, 4); fillStroke(ctx, hmA('#FFF6C8', tw), 0); }
    circle(ctx, 860, 340, 64, '#FFF2B8'); circle(ctx, 836, 322, 12, '#EADB9C'); circle(ctx, 884, 368, 9, '#EADB9C'); hmGlow(ctx, 860, 340, 260, '#BFC8FF', .3);
    ctx.restore();
    hmYardHouses(ctx, T, cam, N, true);
    for (const lx of [-330, 1380]) { hmStreetLamp(ctx, lx, true); hmGlow(ctx, lx, 780, 300, '#FFD98A', .5); hmGlow(ctx, lx, 1500, 260, '#FFD98A', .2); }
  }
}

// ======================================================================================
// 8. TREEHOUSE (outside by default, o.inside for the interior)
// ======================================================================================
function hmLeaves(ctx, x, y, r, T, N, k = 0) {
  const sw = Math.sin(T * 1.3 + k) * 5;
  rr(ctx, x - r + sw, y - r, r * 2, r * 2, r * .6); fillStroke(ctx, N ? '#1F5A35' : (k % 2 ? '#3FA34D' : '#4CB252'), 9);
  ellipse(ctx, x - r * .3 + sw, y - r * .45, r * .35, r * .14, N ? '#2E6E45' : '#78D46E', 0, -.3);
}
function hmSign(ctx, x, y, text, rot = -.04, size = 46) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.font = `${size}px "Lilita One"`; const w = Math.max(160, ctx.measureText(text).width + 50);
  box(ctx, -w / 2, -size * .8, w, size * 1.6, 8, '#E2B56E', 8);
  ctx.strokeStyle = 'rgba(120,70,20,.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w / 2 + 10, -size * .1); ctx.lineTo(w / 2 - 10, -size * .1); ctx.stroke();
  circle(ctx, -w / 2 + 14, -size * .5, 5, '#6B7080'); circle(ctx, w / 2 - 14, -size * .5, 5, '#6B7080');
  txt(ctx, text, 0, 4, size, '#EE384A', OUTLINE, 0);
  ctx.restore();
}
function hmRopeLadder(ctx, x, top, bot, T, w = 80) {
  const sway = Math.sin(T * 1.3) * 14;
  ctx.strokeStyle = '#C9A06A'; ctx.lineWidth = 10;
  for (const s of [0, w]) { ctx.strokeStyle = OUTLINE; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(x + s, top); ctx.quadraticCurveTo(x + s + sway * .3, (top + bot) / 2, x + s + sway, bot); ctx.stroke(); ctx.strokeStyle = '#D9B47A'; ctx.lineWidth = 7; ctx.stroke(); }
  for (let y = top + 50; y < bot - 10; y += 72) { const f = (y - top) / (bot - top), o = sway * f * f * .9 + sway * .1 * f; box(ctx, x - 12 + o, y - 8, w + 24, 18, 8, '#B5753F', 6); }
}
function envTreehouse(ctx, T, cam, o = {}) {
  const N = !!o.night, sign = o.sign || 'CLUB HOUSE';
  if (o.inside) return hmTreehouseInside(ctx, T, cam, o);
  const g = ctx.createLinearGradient(0, -300, 0, FLOOR); g.addColorStop(0, N ? '#100E34' : '#5EB8F0'); g.addColorStop(1, N ? '#3A3480' : '#BDE8FF');
  ctx.fillStyle = g; ctx.fillRect(-3000, -2000, 9000, 6000);
  let { dx } = par(cam, .3);
  ctx.save(); ctx.translate(dx, 0);
  if (!N) for (let i = 0; i < 5; i++) hmCloud(ctx, ((((i * 560 + T * 16) % 2800) + 2800) % 2800) - 800, 260 + (i % 2) * 170, 1.1);
  else { for (let i = 0; i < 30; i++) { const r = hmRng(i + 700); starPath(ctx, -500 + r() * 2200, 100 + r() * 600, 8 + r() * 5, 3, 4); fillStroke(ctx, '#FFF6C8', 0); } }
  for (let i = -10; i < 20; i++) circle(ctx, i * 200, 1260 + (i % 2) * 30, 130, N ? '#1C2A4A' : '#5DBF62', 0);
  ctx.restore();
  ({ dx } = par(cam, .7));
  ctx.save(); ctx.translate(dx, 0);
  for (let i = -8; i < 22; i++) { box(ctx, i * 110, 1200, 96, 310, 12, '#F4E3C3', 7); hmPoly(ctx, [[i * 110, 1210], [i * 110 + 48, 1160], [i * 110 + 96, 1210]]); fillStroke(ctx, '#F4E3C3', 7); }
  box(ctx, -1000, 1270, 3400, 26, 6, '#E2CBA4', 6);
  ctx.restore();
  ctx.fillStyle = N ? '#2E6A3A' : '#65C75A'; ctx.fillRect(-3000, FLOOR, 9000, 2600);
  for (let i = 0; i < 90; i++) { const r = hmRng(i * 13 + 5); const x = -900 + r() * 2900, y = FLOOR + 20 + r() * 420; ctx.strokeStyle = N ? '#245A30' : '#4DAE45'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y - 22); ctx.moveTo(x, y); ctx.lineTo(x + 8, y - 20); ctx.stroke(); }
  for (let i = 0; i < 12; i++) { const r = hmRng(i * 7 + 99), x = -400 + r() * 1900, y = FLOOR + 60 + r() * 360; for (let p = 0; p < 5; p++) circle(ctx, x + Math.cos(p * TAU / 5) * 10, y + Math.sin(p * TAU / 5) * 10, 8, ['#FFFFFF', '#FFD447', '#FF8FB8'][i % 3]); circle(ctx, x, y, 6, '#FFB000'); }
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - 3, 9000, 8);
  // back leaves
  for (const [x, y, r, k] of [[640, 300, 230, 0], [300, 420, 180, 1], [990, 400, 190, 2], [140, 640, 140, 3], [1200, 640, 150, 4]]) hmLeaves(ctx, x, y, r, T, N, k);
  // trunk
  ctx.beginPath(); ctx.moveTo(560, 1504); ctx.quadraticCurveTo(600, 1440, 600, 1300); ctx.lineTo(610, 380); ctx.lineTo(730, 380); ctx.lineTo(740, 1300); ctx.quadraticCurveTo(740, 1440, 790, 1504); ctx.closePath(); fillStroke(ctx, '#8A5A2B', 9);
  ctx.strokeStyle = '#6E4325'; ctx.lineWidth = 6; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(630 + (k % 3) * 30, 960 + k * 90); ctx.quadraticCurveTo(640 + (k % 3) * 30, 990 + k * 90, 632 + (k % 3) * 30, 1020 + k * 90); ctx.stroke(); }
  ellipse(ctx, 670, 1150, 18, 26, '#3A2410', 6);
  // supports + platform
  for (const [ax, bx] of [[300, 610], [1040, 730]]) { ctx.strokeStyle = OUTLINE; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(ax, 916); ctx.lineTo(bx, 1110); ctx.stroke(); ctx.strokeStyle = '#A8693A'; ctx.lineWidth = 20; ctx.stroke(); }
  box(ctx, 240, 876, 840, 46, 8, '#B5753F', 9); ctx.strokeStyle = 'rgba(80,40,10,.35)'; ctx.lineWidth = 4; for (let i = 1; i < 10; i++) { ctx.beginPath(); ctx.moveTo(240 + i * 84, 880); ctx.lineTo(240 + i * 84, 918); ctx.stroke(); }
  // cabin
  box(ctx, 310, 560, 600, 320, 10, '#C98B4B', 9);
  ctx.save(); rr(ctx, 310, 560, 600, 320, 10); ctx.clip(); for (let k = 0; k < 8; k++) { ctx.fillStyle = k % 2 ? '#BD7F42' : '#D49556'; ctx.fillRect(310, 560 + k * 40, 600, 40); ctx.fillStyle = 'rgba(80,40,10,.35)'; ctx.fillRect(310, 598 + k * 40, 600, 4); } ctx.restore();
  rr(ctx, 310, 560, 600, 320, 10); fillStroke(ctx, null, 9);
  hmPoly(ctx, [[270, 590], [610, 380], [950, 590]]); fillStroke(ctx, '#EE384A', 10);
  ctx.strokeStyle = '#C42234'; ctx.lineWidth = 6; for (let k = 1; k < 4; k++) { const t = k / 4, yy = lerp(380, 590, t), hw = lerp(0, 340, t); ctx.beginPath(); ctx.moveTo(610 - hw + 10, yy); ctx.lineTo(610 + hw - 10, yy); ctx.stroke(); }
  // window with shutters + door opening
  box(ctx, 360, 640, 130, 120, 8, N ? '#FFD98A' : '#3A2A1A', 8); box(ctx, 316, 636, 44, 128, 6, '#30A08A', 7); box(ctx, 490, 636, 44, 128, 6, '#30A08A', 7);
  if (!N) { circle(ctx, 420, 720, 26, '#FFD447', 5); circle(ctx, 412, 714, 4, OUTLINE); circle(ctx, 430, 714, 4, OUTLINE); } // peeking plush
  box(ctx, 760, 640, 120, 240, 10, '#3A2A1A', 8);
  ctx.beginPath(); ctx.moveTo(762, 644); ctx.lineTo(878, 644); ctx.quadraticCurveTo(850 + Math.sin(T * 1.5) * 6, 760, 870, 878); ctx.lineTo(842, 878); ctx.quadraticCurveTo(820, 760, 790, 700); ctx.closePath(); fillStroke(ctx, '#7B4BFF', 6);
  hmSign(ctx, 625, 600 + 92, sign, -.04, 42);
  // railing
  for (let i = 0; i < 11; i++) box(ctx, 250 + i * 80, 806, 16, 76, 4, '#A8693A', 6);
  box(ctx, 240, 796, 840, 20, 6, '#B5753F', 7);
  // little sign on the trunk + pennants
  ctx.save(); ctx.translate(670, 1040); ctx.rotate(.06); box(ctx, -70, -26, 140, 52, 6, '#FFFFFF', 7); txt(ctx, 'NO ADULTS', 0, 2, 24, '#EE384A'); ctx.restore();
  for (let i = 0; i < 7; i++) { const px = 330 + i * 86; hmPoly(ctx, [[px, 572], [px + 70, 572], [px + 35, 612]]); fillStroke(ctx, ['#FFD447', '#20BDBB', '#FF5B9B', '#30CE65'][i % 4], 5); }
  // rope ladder
  hmRopeLadder(ctx, 980, 900, 1480, T);
  // front leaves
  for (const [x, y, r, k] of [[220, 520, 120, 5], [1010, 470, 130, 6], [610, 300, 120, 7]]) hmLeaves(ctx, x, y, r, T, N, k);
  if (N) {
    hmNight(ctx);
    box(ctx, 360, 640, 130, 120, 8, '#FFD98A', 8); hmGlow(ctx, 425, 700, 220, '#FFC86A', .5);
    for (let i = 0; i < 14; i++) { const r = hmRng(i * 3 + 1), fx = -200 + r() * 1500 + Math.sin(T * .8 + i) * 40, fy = 700 + r() * 900 + Math.cos(T * .6 + i * 2) * 30, a = .5 + .5 * Math.sin(T * 3 + i * 1.7);
      hmGlow(ctx, fx, fy, 34, '#E8FF7A', .6 * a); circle(ctx, fx, fy, 5, hmA('#F6FFB0', a)); }
  }
}
function hmTreehouseInside(ctx, T, cam, o) {
  const N = !!o.night, sign = o.sign || 'CLUB HOUSE';
  ctx.fillStyle = '#C98B4B'; ctx.fillRect(-3000, -2000, 9000, 6000);
  for (let i = -30; i < 60; i++) { ctx.fillStyle = i % 2 ? '#BD7F42' : '#D49556'; ctx.fillRect(i * 90, 0, 90, FLOOR); ctx.fillStyle = 'rgba(80,40,10,.35)'; ctx.fillRect(i * 90 - 2, 0, 5, FLOOR);
    circle(ctx, i * 90 + 45, 300 + (i % 3) * 40, 4, '#6E4325'); circle(ctx, i * 90 + 45, 1200 - (i % 2) * 30, 4, '#6E4325'); }
  // A-frame roof beams
  for (const s of [-1, 1]) { hmPoly(ctx, [[540, -400], [540 + s * 3000, 2200], [540 + s * 3000, -2000], [540, -2000]]); fillStroke(ctx, '#6E4325', 10); }
  for (const s of [-1, 1]) { ctx.strokeStyle = OUTLINE; ctx.lineWidth = 48; ctx.beginPath(); ctx.moveTo(540, -400); ctx.lineTo(540 + s * 3000, 2200); ctx.stroke(); ctx.strokeStyle = '#8A5A2B'; ctx.lineWidth = 32; ctx.stroke(); }
  hmFloorWood(ctx, cam, '#B5753F', '#8F5A2C', 100);
  // window (open, leaves outside)
  const wx = 370, wy = 380, ww = 340, wh = 300;
  box(ctx, wx - 24, wy - 24, ww + 48, wh + 48, 10, '#8A5A2B', 9);
  ctx.save(); rr(ctx, wx, wy, ww, wh, 6); ctx.clip(); hmSky(ctx, wx, wy, ww, wh, T, cam, { night: N, hills: false }, false);
  const { dx } = par(cam, .5); for (const [lx, ly, r, k] of [[wx + 20, wy + 40, 90, 1], [wx + ww - 10, wy + 60, 100, 2], [wx + 60, wy + wh, 110, 3], [wx + ww - 40, wy + wh + 20, 120, 4]]) hmLeaves(ctx, lx + dx, ly, r, T, N, k);
  ctx.restore(); rr(ctx, wx, wy, ww, wh, 6); fillStroke(ctx, null, 8);
  box(ctx, wx - 90, wy - 10, 76, wh + 20, 6, '#30A08A', 8); box(ctx, wx + ww + 14, wy - 10, 76, wh + 20, 6, '#30A08A', 8);
  box(ctx, wx - 40, wy + wh + 16, ww + 80, 30, 6, '#8A5A2B', 8);
  hmSign(ctx, 540, 280, sign, .03, 54);
  // pennant string
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-300, 170); ctx.quadraticCurveTo(540, 260, 1400, 170); ctx.stroke();
  for (let i = 0; i < 14; i++) { const t = i / 13, px = lerp(-300, 1400, t), py = 170 + 4 * t * (1 - t) * 45 + 20 * 0; hmPoly(ctx, [[px - 30, py], [px + 30, py], [px, py + 54]]); fillStroke(ctx, ['#FFD447', '#20BDBB', '#FF5B9B', '#30CE65', '#FF8528'][i % 5], 5); }
  // kid drawings + map
  ctx.save(); ctx.translate(120, 620); ctx.rotate(-.06); box(ctx, -90, -80, 180, 160, 4, '#FFFFFF', 6); hmKidDrawing(ctx, -80, -70, 160, 140); circle(ctx, 0, -84, 8, '#EE384A', 4); ctx.restore();
  ctx.save(); ctx.translate(960, 620); ctx.rotate(.05); box(ctx, -110, -90, 220, 180, 6, '#F2E2B0', 6);
  ctx.strokeStyle = '#8A5A2B'; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(-80, 50); ctx.quadraticCurveTo(-20, -60, 60, 10); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = '#EE384A'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(52, 2); ctx.lineTo(72, 22); ctx.moveTo(72, 2); ctx.lineTo(52, 22); ctx.stroke(); txt(ctx, 'MAP', 0, -60, 32, '#8A5A2B'); circle(ctx, -100, -82, 8, '#2E62C9', 4); ctx.restore();
  // lantern
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(800, 0); ctx.lineTo(800, 400); ctx.stroke();
  ctx.save(); ctx.translate(800, 400); ctx.rotate(Math.sin(T * 1.4) * .06);
  box(ctx, -36, 12, 72, 90, 14, N ? '#FFE8A0' : '#FFD98A', 7); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-12, 12); ctx.lineTo(-12, 102); ctx.moveTo(12, 12); ctx.lineTo(12, 102); ctx.stroke();
  box(ctx, -44, 0, 88, 20, 8, '#3A3550', 6); box(ctx, -44, 98, 88, 16, 8, '#3A3550', 6); ctx.restore();
  // beanbag (left) + crate table (right)
  ctx.save(); ctx.translate(60, 0); ctx.beginPath(); ctx.moveTo(20, 1500); ctx.quadraticCurveTo(-10, 1380, 80, 1370); ctx.quadraticCurveTo(140, 1300, 210, 1370); ctx.quadraticCurveTo(290, 1390, 270, 1500); ctx.closePath(); fillStroke(ctx, '#EE384A', 9);
  ellipse(ctx, 110, 1360, 50, 14, 'rgba(255,255,255,.25)', 0, -.3); ctx.restore();
  ctx.save(); ctx.translate(-70, 0);
  box(ctx, 900, 1340, 240, 160, 8, '#D9A85C', 9); ctx.strokeStyle = '#B88A44'; ctx.lineWidth = 6; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(906, 1340 + k * 40); ctx.lineTo(1134, 1340 + k * 40); ctx.stroke(); }
  for (let k = 0; k < 3; k++) { ctx.save(); ctx.translate(960, 1330 - k * 14); ctx.rotate((k - 1) * .06); box(ctx, -50, -8, 100, 16, 4, ['#FFD447', '#2E62C9', '#FF5B9B'][k], 5); ctx.restore(); }
  box(ctx, 1050, 1270, 60, 70, 10, '#FF8528', 6); txt(ctx, 'YUM', 1080, 1305, 20, '#FFFFFF');
  ctx.save(); ctx.translate(1010, 1320); ctx.rotate(-.2); box(ctx, -10, -40, 20, 46, 6, '#3A3550', 5); box(ctx, -14, -52, 28, 16, 5, '#C8D2E8', 5); ctx.restore();
  ctx.restore();
  // floor hatch with rope ladder
  // floor hatch (open) with the rope ladder going down
  hmPoly(ctx, [[330, 1640], [690, 1640], [720, 1730], [300, 1730]]); fillStroke(ctx, '#2A1A0C', 9);
  ctx.save(); ctx.beginPath(); ctx.rect(300, 1640, 420, 90); ctx.clip(); ellipse(ctx, 510, 1760, 160, 40, '#3FA34D'); ctx.restore();
  for (const rx of [440, 580]) { ctx.strokeStyle = OUTLINE; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(rx, 1600); ctx.lineTo(rx, 1730); ctx.stroke(); ctx.strokeStyle = '#D9B47A'; ctx.lineWidth = 7; ctx.stroke(); }
  box(ctx, 426, 1670, 168, 16, 7, '#B5753F', 6); box(ctx, 426, 1608, 168, 14, 6, '#B5753F', 6);
  hmPoly(ctx, [[330, 1640], [690, 1640], [700, 1560], [320, 1560]]); fillStroke(ctx, '#A8693A', 9);
  ctx.strokeStyle = 'rgba(80,40,10,.35)'; ctx.lineWidth = 5; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(325 + k * 95, 1564); ctx.lineTo(330 + k * 90, 1636); ctx.stroke(); }
  box(ctx, 488, 1590, 44, 14, 6, '#6B7080', 5);
  if (N) {
    hmNight(ctx);
    ctx.save(); rr(ctx, wx, wy, ww, wh, 6); ctx.clip(); hmSky(ctx, wx, wy, ww, wh, T, cam, { night: true }, true); ctx.restore();
    box(ctx, 764, 412, 72, 90, 14, '#FFF1B8', 7); hmGlow(ctx, 800, 460, 560, '#FFB347', .5); hmGlow(ctx, 800, 460, 120, '#FFF1B8', .5);
  }
}

// ---------------- registry ----------------
registerSet('livingRoom', envLivingRoom, 'Living room: couch (x 66..714, seat top y 1330 → sit with feet at y 1455, x 200..600), TV with animated cartoon (x 770..1170), rug, floor lamp, bookshelf, window, photo frames, console + controllers', "{night, tv:false, screen:fn(ctx,x,y,w,h,T), couch:'#hex'}", ['home']);
registerSet('kidsBedroom', envKidsBedroom, "Kid's bedroom: bed with patchwork quilt (top y 1250, sit feet y 1375 at x 90..230), desk + glowing gaming PC (x 780..1060), gaming chair (seat y 1350, x 670), posters, window, toy box, rug, string lights", '{night}', ['home']);
registerSet('bathroom', envBathroom, 'Bathroom: tiles, sink + arched mirror, towel rack, claw-foot bubble bath (rim y 1240, x 500..1270), rubber duck. FRONT: envBathroomFront(ctx,T,cam,o) after a character at x 760..1000, y 1490 = sitting in the bath', '{night}', ['home']);
registerSet('diningRoom', envDiningRoom, 'Dining room: dinner table (top y 1270..1330) with chicken, spaghetti, plates; 3 chairs (x 250/540/830), pendant lamp, window, hutch. FRONT: envDiningRoomFront(ctx,T,cam,o) after characters standing (y 1500) or sitting (feet y 1455) behind the table', '{night, table:false}', ['home']);
registerSet('garage', envGarage, 'Garage: roll-up door (x 180..900, o.open 0..1 shows the street), red car (x 680..1440), workbench + pegboard tools, bike, shelves of boxes, tube lights', '{night, open:0..1}', ['home']);
registerSet('carInside', envCarInside, 'Inside the family car looking forward: windshield with road + scenery rushing by, dashboard, wheel, front seats. Kids in the back seat at x ~270 / ~810, feet y 1560, then envCarInsideFront(ctx,T,cam,{belts:[270,810]}). Parent turned around: bg {noSeats:true}, draw parent at x 290, y 1450, then envCarFrontSeats', '{night, speed, noSeats, belts:[x]} (belts → envCarInsideFront)', ['home', 'outdoor']);
registerSet('frontYard', envFrontYard, 'Front yard / street: colourful houses, lawns, sidewalk (stand y 1500), street (y 1615+), mailbox (x 1010), tree (x 40), car in driveway, street lamps; night = moon, stars, lit windows', '{night}', ['home', 'outdoor']);
registerSet('treehouse', envTreehouse, "Backyard treehouse: cabin on a platform (y 880) with sign, rope ladder (x 980..1060), leaves, fence. {inside:true} = plank interior with leafy window, lantern, beanbag (top y 1370, x 80..330), crate table", "{night, inside, sign:'TEXT'}", ['home', 'outdoor']);


// ======================= pack_outdoor.js =======================
// pack_outdoor.js — OUTDOOR environment sets (sunny, chunky, thick-outline cartoon style).
// Load after core.js + env.js. Every set draws in WORLD space: ground/floor line y = FLOOR (1500),
// default camera camAt(540,1060,1) shows x 0..1080. Backgrounds are filled over x -3000..6000, y -2000..4000
// so zoom-outs (0.85x) and pans never show black. Far layers parallax with par(cam,k).
// Characters (scale .8, ~540 px tall: head top ≈ y 960, waist ≈ y 1300) stand on y 1500 between x ~150..930;
// big set pieces sit at the sides / back. All animation is a pure function of T (no Math.random).
// Every set accepts o.night (dark-blue palette + stars/moon + lights). Campsite is night by default (o.day for day).
//
// SET ID         SHOWS / KEY POSITIONS (world coords)                                          OPTIONS                FRONT LAYER
// pool           backyard swimming pool. Far deck y 1005..1165: umbrella + 2 loungers (x 60..450), {night, sign:'POOL',   envPoolFront(ctx,T,cam,o)
//                POOL sign (x 610, above head height), lifeguard chair (x 850..960, seat y≈790),    swimmers:[x,..],
//                diving board (left, tip x≈180 y≈960), water slide (tower x 1190..1360, splash     waterline:1310}
//                x≈1060), ladder (x 620..750). Back water band y 1207..1490, near coping
//                y 1488..1518 (= FLOOR), near deck tiles below.
//                -> WITHOUT the front layer, characters on y 1500 stand on the near deck, pool behind them.
//                -> WITH envPoolFront (call it AFTER drawing characters, same o) they are IN the pool, waist-deep:
//                   water surface at POOL_WATERLINE = 1310 (o.waterline overrides; ~1200 = chest-deep,
//                   ~1400 = knee-deep). Below the surface legs show faintly through the water.
//                   o.swimmers = [380, 700] draws ripple rings around those x at the waterline.
// beach          sea horizon y≈985 (boat + island parallax), animated wave crests, foam wash        {night}                envBeachFront (optional): sand dunes +
//                at y≈1330, dry sand from y≈1392. Lifeguard tower (x -210..170, hut y 920..1120),                       grass tufts in the bottom corners only
//                sandcastle (x -30..190, y 1610), bucket+spade (x 230..330), umbrella + towel                          (y>1790) — never covers characters
//                (x 810..1130), palm (x 1290), seagulls, starfish/shells (low contrast).
// playground     slide (left: tower x -330..-80, platform y 1030, chute ends x≈250 y 1470),         {night, swing:false}   —
//                monkey bars (x -800..-364, pan left to see), swings (frame x 800..1330, seats
//                at x 965 / 1165, seat y≈1320 at rest, sway ±0.3 rad), kite in the sky,
//                bench (back x 650..880, seat y≈1300), sandbox (x 870..1190, y 1560..1670).
// amusementPark  ferris wheel (centre x 780 y 520, R 340, rotating, parallax .8; lowest cabin      {night}                —
//                above head height), roller coaster with 2 moving trains (back-left, parallax .6),
//                striped big-top tent (x -280..280, ground 1450), SNACKS stand (x 820..1170) with
//                balloons above it, string lights. Night: glowing bulbs, lit wheel, fireworks.
// campsite       forest clearing, NIGHT BY DEFAULT (o.day:true for daytime): stars, shooting star, {day, fire:false,      envCampsiteFront(ctx,T,cam,o) draws the
//                moon, mountains, pines, fireflies, lantern post (x 205). Tents x -230..190 and       fireX:540, fireFront}  campfire IN FRONT of characters. Pass
//                x 890..1330 (base 1440). Log seats x 110..340 and x 740..970 (seat top y≈1428).                         the same o with fireFront:true to both
//                Campfire at (o.fireX ?? 540, 1590) with flicker, sparks and warm night glow.                          calls so the back layer skips it.
// snowyStreet    row of snow-roofed houses (base y 1340, lit windows + glow at night, chimney     {night, snow:false}    envSnowyStreetFront: big near
//                smoke), snowy pines, street lamp (x 150), snowman (x 965, ~500 tall incl. hat),                       snowflakes over everything (optional)
//                sled (x 30..280, y≈1595), deterministic falling snow. Snow ground from y 1330.
// soccerField    bleachers (y 900..1230) with cheering blocky fans, ad boards (y 1230..1320),      {night, score:'2 - 1', —
//                scoreboard (x 580..1020, y 250..510), floodlights (x -180 / 1280), goal (left       home:'HOME', away:'AWAY',
//                x -300..190, crossbar y 1020), striped pitch from y 1320, centre circle (540,1700). clock:'45:00', cheer:true,
//                                                                                                  ball:false}
// downtown       skyline (parallax .35); shops on y 1360: BAKERY (x -930), PIZZA (x -470..-30),  {night, car:true}      —
//                TOYS (x -10..520), ICE CREAM (x 540..1020, giant cone on roof), BOOKS (x 1040);
//                traffic light (x 40, cycles R/Y/G every 3 s), hydrant (x 960), bus stop (x 1080..1420).
//                Sidewalk y 1360..1556 (characters stand on it at 1500), curb y 1556, road + crosswalk
//                below. o.car: a red car drives past on the road.
// farm           red barn (x -220..320) + silo (x -400), cow (x 30..290, chewing + tail swish),     {night}                —
//                hay bales (x 330..670), wooden fence (back, y 1250..1410), crop rows + patchwork
//                hills, red tractor (x 805..1150), chickens pecking (x 150, 960, 1080), windpump
//                windmill turning (x 970, wheel centre y 540, above head height).
//
// Notes for shot writers: register names are the ids above (PACK_SETS[id].draw). Call the env as the shot's bg:
//   bg: (ctx, T, cam) => envPool(ctx, T, cam, { night: false })
//   draw: (ctx, T, lt) => { C(ctx,'nubi',P({x:380,y:1500,s:.8}),{},T); envPoolFront(ctx, T, camOfThisShot, { swimmers:[380] }); }
// Bottom of screen (world y ≈ 1650..1800 at the default camera) is kept calm because captions sit there.
'use strict';
const POOL_WATERLINE = 1310;
let envPool, envPoolFront, envBeach, envBeachFront, envPlayground, envAmusementPark, envCampsite, envCampsiteFront,
  envSnowyStreet, envSnowyStreetFront, envSoccerField, envDowntown, envFarm;

(function () {
  // ---------------------------------------------------------------- palette / night mapping
  let NIGHT = false;
  const NC = {};
  const LIT = new Set(['#FFD98A', '#FFE9A8', '#FFE08A', '#FFFDE8', '#FFF6C8', '#FFF3C4']); // light sources: never darkened
  function N(c) { // day colour → night colour (multiplied towards deep blue) when NIGHT
    if (!NIGHT || typeof c !== 'string' || c[0] !== '#' || c.length !== 7 || c === OUTLINE || LIT.has(c)) return c;
    let v = NC[c]; if (v) return v;
    const n = parseInt(c.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const R = Math.min(255, Math.round(r * .42 + 12)), G = Math.min(255, Math.round(g * .44 + 16)), Bl = Math.min(255, Math.round(b * .6 + 46));
    v = '#' + ((1 << 24) + (R << 16) + (G << 8) + Bl).toString(16).slice(1);
    return (NC[c] = v);
  }
  const PAL = ['#EE384A', '#FF8528', '#FFD447', '#30CE65', '#20BDBB', '#2E9CCA', '#7B4BFF', '#FF5B9B'];
  const SKINS = ['#F5C9A0', '#E0A878', '#B87A50', '#8A5634', '#FAD9B8'];
  const HAIRS = ['#2A1E1E', '#6B3A1E', '#C98B4B', '#1B1530', '#E8B84A'];

  // ---------------------------------------------------------------- tiny drawing helpers (night-aware)
  const B = (ctx, x, y, w, h, r, f, lw = 8) => box(ctx, x, y, w, h, r, N(f), lw);
  const Ci = (ctx, x, y, r, f, lw = 0) => circle(ctx, x, y, r, N(f), lw);
  const El = (ctx, x, y, rx, ry, f, lw = 0, rot = 0) => ellipse(ctx, x, y, rx, ry, N(f), lw, rot);
  const FS = (ctx, f, lw = 8) => fillStroke(ctx, N(f), lw);
  function poly(ctx, pts) { ctx.beginPath(); for (let i = 0; i < pts.length; i++) i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]); ctx.closePath(); }
  function ln(ctx, x1, y1, x2, y2, col, lw) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = N(col); ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke(); }
  function bar(ctx, x1, y1, x2, y2, col, w, lw = 7) { ln(ctx, x1, y1, x2, y2, OUTLINE, w + lw * 2); ln(ctx, x1, y1, x2, y2, col, w); }
  function rrp(ctx, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  // union of circles / rounded rects with ONE outer outline (stroke at 2×lw first, then fill)
  function blob(ctx, cs, fill, lw = 8) {
    ctx.beginPath(); for (const [x, y, r] of cs) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); }
    if (lw) { ctx.lineWidth = lw * 2; ctx.strokeStyle = OUTLINE; ctx.lineJoin = 'round'; ctx.stroke(); }
    ctx.fillStyle = N(fill); ctx.fill();
  }
  function blobR(ctx, rs, fill, lw = 8) {
    ctx.beginPath(); for (const [x, y, w, h, r] of rs) rrp(ctx, x, y, w, h, r);
    if (lw) { ctx.lineWidth = lw * 2; ctx.strokeStyle = OUTLINE; ctx.lineJoin = 'round'; ctx.stroke(); }
    ctx.fillStyle = N(fill); ctx.fill();
  }
  function sky(ctx, c1, c2, y0 = -200, y1 = FLOOR) { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-3000, -2000, 9000, 6000); }
  function ground(ctx, col, y) { ctx.fillStyle = N(col); ctx.fillRect(-3000, y, 9000, 4000 - y); }
  function glow(ctx, x, y, r, col = '255,214,120', a = .55) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
  }
  function withPar(ctx, cam, k, fn) { const { dx, dy } = par(cam, k); ctx.save(); ctx.translate(dx, dy); fn(); ctx.restore(); }
  const mod = (a, n) => ((a % n) + n) % n;

  function sun(ctx, x, y, r, T) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(T * .12); ctx.fillStyle = 'rgba(255,236,140,.6)';
    for (let i = 0; i < 12; i++) { const a = i * TAU / 12; ctx.beginPath(); ctx.moveTo(Math.cos(a - .13) * r * 1.2, Math.sin(a - .13) * r * 1.2); ctx.lineTo(Math.cos(a) * r * 1.8, Math.sin(a) * r * 1.8); ctx.lineTo(Math.cos(a + .13) * r * 1.2, Math.sin(a + .13) * r * 1.2); ctx.fill(); }
    ctx.restore();
    circle(ctx, x, y, r * 1.14, 'rgba(255,240,170,.55)'); circle(ctx, x, y, r, '#FFD447', 8);
    circle(ctx, x - r * .32, y - r * .32, r * .26, 'rgba(255,255,255,.55)');
  }
  function moon(ctx, x, y, r) {
    glow(ctx, x, y, r * 3.2, '255,245,200', .22);
    circle(ctx, x, y, r, '#FFF3C4', 8);
    for (const [ox, oy, s] of [[.3, -.2, .2], [-.35, .3, .14], [-.1, -.45, .1], [.25, .45, .12]]) circle(ctx, x + ox * r, y + oy * r, s * r, '#F0DC9A');
  }
  function stars(ctx, T, cam, n = 90, seed = 7, y0 = -600, y1 = 950) {
    const { dx, dy } = par(cam, .06); ctx.save(); ctx.translate(dx, dy);
    const r = rng(seed);
    for (let i = 0; i < n; i++) {
      const x = -1500 + r() * 4100, y = y0 + r() * (y1 - y0), s = 2.5 + r() * 6, sp = 1.2 + r() * 2.5;
      ctx.globalAlpha = .55 + .45 * Math.sin(T * sp + i);
      if (s > 7) { starPath(ctx, x, y, s * 1.7, s * .45, 4, 0); ctx.fillStyle = '#FFF6C8'; ctx.fill(); }
      else { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x - s * .5, y - s * .5, s, s); }
    }
    ctx.globalAlpha = 1; ctx.restore();
  }
  function cloud(ctx, x, y, s, col = '#FFFFFF') {
    ctx.fillStyle = N(col); ctx.beginPath();
    for (const [ox, oy, r] of [[-92, 8, 52], [-30, -24, 72], [52, -8, 62], [108, 14, 44]]) { ctx.moveTo(x + (ox + r) * s, y + oy * s); ctx.arc(x + ox * s, y + oy * s, r * s, 0, TAU); }
    rrp(ctx, x - 140 * s, y, 290 * s, 58 * s, 29 * s); ctx.fill();
  }
  function clouds(ctx, T, cam, k, n, seed, y0, y1, sc = 1, alpha = 1) {
    const { dx, dy } = par(cam, k); ctx.save(); ctx.translate(dx, dy); ctx.globalAlpha = alpha;
    const r = rng(seed), span = 3800;
    for (let i = 0; i < n; i++) { const bx = r() * span, y = y0 + r() * (y1 - y0), s = sc * (.7 + r() * .55), v = 7 + r() * 12; cloud(ctx, mod(bx + T * v, span) - 1300, y, s); }
    ctx.restore();
  }
  function hills(ctx, cam, k, y, amp, col, seed = 1, lw = 8, f = 1) {
    const { dx, dy } = par(cam, k); ctx.save(); ctx.translate(dx, dy);
    ctx.beginPath(); ctx.moveTo(-3000, 4000);
    for (let x = -3000; x <= 6000; x += 40) ctx.lineTo(x, y - amp * (.6 * Math.sin(x * .004 * f + seed) + .4 * Math.sin(x * .0105 * f + seed * 2.3)));
    ctx.lineTo(6000, 4000); ctx.closePath(); FS(ctx, col, lw); ctx.restore();
  }
  function tree(ctx, x, y, s = 1, leaf = '#3FA34D', trunk = '#8A5A2B', lw = 8) {
    B(ctx, x - 24 * s, y - 250 * s, 48 * s, 250 * s, 12 * s, trunk, lw);
    blobR(ctx, [[x - 115 * s, y - 440 * s, 230 * s, 210 * s, 64 * s], [x - 175 * s, y - 330 * s, 175 * s, 150 * s, 55 * s], [x, y - 340 * s, 180 * s, 160 * s, 55 * s]], leaf, lw);
    ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); rrp(ctx, x - 80 * s, y - 410 * s, 90 * s, 38 * s, 19 * s); ctx.fill();
  }
  function roundTree(ctx, x, y, s = 1, leaf = '#3FA34D', lw = 7) {
    B(ctx, x - 16 * s, y - 150 * s, 32 * s, 150 * s, 10 * s, '#8A5A2B', lw);
    blob(ctx, [[x, y - 230 * s, 95 * s], [x - 70 * s, y - 170 * s, 70 * s], [x + 72 * s, y - 175 * s, 72 * s]], leaf, lw);
  }
  function pine(ctx, x, y, s = 1, col = '#2F8F5B', snow = false, lw = 7) {
    B(ctx, x - 16 * s, y - 70 * s, 32 * s, 70 * s, 6 * s, '#7A4A22', lw);
    for (let k = 0; k < 3; k++) {
      const by = y - 50 * s - k * 92 * s, w = (150 - k * 36) * s, h = 160 * s;
      poly(ctx, [[x - w, by], [x, by - h], [x + w, by]]); FS(ctx, k % 2 ? shade(col, .07) : col, lw);
      if (snow) { poly(ctx, [[x - w * .5, by - h * .5], [x, by - h], [x + w * .5, by - h * .5], [x + w * .25, by - h * .42], [x + w * .05, by - h * .52], [x - w * .2, by - h * .42]]); FS(ctx, '#FFFFFF', 0); }
    }
  }
  function bush(ctx, x, y, s = 1, col = '#3FA34D', lw = 7) { blob(ctx, [[x - 50 * s, y - 34 * s, 42 * s], [x, y - 52 * s, 52 * s], [x + 52 * s, y - 32 * s, 40 * s]], col, lw); ctx.fillStyle = N(col); ctx.fillRect(x - 92 * s, y - 34 * s, 184 * s, 34 * s); }
  function fan(ctx, x, y, s, i, T, cheerAll = 0) { // blocky spectator, feet/seat at y
    const r = rng(i * 31 + 7); const shirt = PAL[Math.floor(r() * 8)], skin = SKINS[Math.floor(r() * 5)], hair = HAIRS[Math.floor(r() * 5)];
    const cheer = cheerAll || Math.sin(T * 2.3 + i * 2.7) > .45; const b = cheer ? Math.abs(Math.sin(T * 8 + i)) * 12 * s : 0; const yy = y - b;
    if (cheer) { bar(ctx, x - 22 * s, yy - 48 * s, x - 40 * s, yy - 104 * s, skin, 12 * s, 4); bar(ctx, x + 22 * s, yy - 48 * s, x + 40 * s, yy - 104 * s, skin, 12 * s, 4); }
    B(ctx, x - 28 * s, yy - 60 * s, 56 * s, 60 * s, 12 * s, shirt, 5);
    B(ctx, x - 25 * s, yy - 108 * s, 50 * s, 48 * s, 12 * s, skin, 5);
    B(ctx, x - 27 * s, yy - 112 * s, 54 * s, 18 * s, 8 * s, hair, 0);
    ctx.fillStyle = OUTLINE; ctx.fillRect(x - 13 * s, yy - 86 * s, 6 * s, 8 * s); ctx.fillRect(x + 7 * s, yy - 86 * s, 6 * s, 8 * s);
  }
  function bulbString(ctx, x1, y1, x2, y2, sag, n, T, lit, cols = ['#FFD447', '#FF5B9B', '#20BDBB', '#30CE65', '#FF8528']) {
    const pt = u => [lerp(x1, x2, u), lerp(y1, y2, u) + sag * 4 * u * (1 - u)];
    ctx.beginPath(); for (let i = 0; i <= 24; i++) { const [x, y] = pt(i / 24); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.stroke();
    for (let i = 1; i < n; i++) {
      const [x, y] = pt(i / n), c = cols[i % cols.length], on = !lit || (Math.floor(T * 2.5) + i) % 4 !== 0;
      if (lit && on) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .35; circle(ctx, x, y + 14, 30, c); ctx.restore(); }
      circle(ctx, x, y + 14, 11, lit ? (on ? c : shade(c, -.4)) : N(c), 4);
    }
  }
  function bunting(ctx, x1, y1, x2, y2, sag, n, T, cols = ['#FFD447', '#20BDBB', '#FF5B9B', '#30CE65', '#FF8528']) {
    const pt = u => [lerp(x1, x2, u), lerp(y1, y2, u) + sag * 4 * u * (1 - u)];
    ctx.beginPath(); for (let i = 0; i <= 24; i++) { const [x, y] = pt(i / 24); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.stroke();
    for (let i = 0; i < n; i++) {
      const [ax, ay] = pt(i / n), [bx, by] = pt((i + .8) / n), sw = Math.sin(T * 3 + i) * 6;
      poly(ctx, [[ax, ay], [bx, by], [(ax + bx) / 2 + sw, (ay + by) / 2 + 60]]); FS(ctx, cols[i % cols.length], 5);
    }
  }
  function flag(ctx, x, y, T, col = '#EE384A', s = 1) { // pole top at (x,y), flag waving to the right
    ln(ctx, x, y, x, y + 110 * s, OUTLINE, 7);
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let i = 0; i <= 8; i++) ctx.lineTo(x + i * 10 * s, y + Math.sin(T * 6 - i * .7) * 5 * s * (i / 8));
    for (let i = 8; i >= 0; i--) ctx.lineTo(x + i * 10 * s, y + 46 * s + Math.sin(T * 6 - i * .7) * 5 * s * (i / 8));
    ctx.closePath(); FS(ctx, col, 5);
  }
  // world-locked tiling particles that always cover the visible area
  function snowfall(ctx, T, cam, n, seed, r0, r1, v, alpha = 1) {
    const z = cam.z || 1, hw = 720 / z, hh = 1150 / z, W2 = hw * 2, H2 = hh * 2, r = rng(seed);
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = '#FFFFFF'; ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const rx = r(), ry = r(), rs = r(), ph = r() * TAU, sz = r0 + rs * (r1 - r0), sp = v * (.6 + rs * .8);
      const x = cam.x - hw + mod(rx * 3000 + Math.sin(T * .9 + ph) * 30 + T * 18 - (cam.x - hw), W2);
      const y = cam.y - hh + mod(ry * 3000 + T * sp - (cam.y - hh), H2);
      ctx.moveTo(x + sz, y); ctx.arc(x, y, sz, 0, TAU);
    }
    ctx.fill(); ctx.restore();
  }
  function setNight(o, def = false) { NIGHT = o.night != null ? !!o.night : (o.day != null ? !o.day : def); return NIGHT; }
  const DAY_SKY = ['#3FAEF0', '#C4ECFF'], NIGHT_SKY = ['#0C1042', '#3B2A7A'];
  function skyAndSun(ctx, T, cam, sunX = 860, sunY = 270, y1 = 1100) {
    if (NIGHT) { sky(ctx, NIGHT_SKY[0], NIGHT_SKY[1], -300, y1); stars(ctx, T, cam); withPar(ctx, cam, .1, () => moon(ctx, sunX, sunY, 66)); }
    else { sky(ctx, DAY_SKY[0], DAY_SKY[1], -300, y1); withPar(ctx, cam, .1, () => sun(ctx, sunX, sunY, 86, T)); }
  }

  // ================================================================= 1. POOL
  function waterNet(ctx, y0, y1, T, a = .28, x0 = -1600, x1 = 2700) { // light caustic network
    ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineWidth = 5; ctx.lineCap = 'round';
    const rows = Math.max(2, Math.round((y1 - y0) / 52));
    for (let j = 0; j < rows; j++) {
      const yb = y0 + (j + .5) * (y1 - y0) / rows, amp = 7 + j * 1.5;
      ctx.beginPath();
      for (let x = x0; x <= x1; x += 26) { const y = yb + Math.sin(x * .028 + T * 1.9 + j * 1.7) * amp + Math.sin(x * .011 - T * 1.1 + j) * amp * .6; x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.setLineDash([46, 34]); ctx.lineDashOffset = -T * 30 * (j % 2 ? 1 : -1) - j * 20; ctx.stroke();
    }
    ctx.restore();
  }
  function lounger(ctx, x, y, col) { // feet on y, ~170 wide
    bar(ctx, x + 10, y - 30, x + 10, y, '#B8C2CC', 6, 4); bar(ctx, x + 150, y - 30, x + 150, y, '#B8C2CC', 6, 4);
    B(ctx, x, y - 48, 170, 22, 9, col, 6);
    ctx.save(); ctx.translate(x + 8, y - 40); ctx.rotate(-1.05); B(ctx, 0, -11, 90, 22, 9, col, 6); ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 1; i < 5; i++) ctx.fillRect(x + i * 32, y - 46, 6, 18);
  }
  function umbrella(ctx, x, top, bottom, w, cols, T, tilt = 0) {
    ctx.save(); ctx.translate(x, bottom); ctx.rotate(tilt);
    const h = bottom - top; bar(ctx, 0, 0, 0, -h, '#F4E3C3', 10, 4);
    const ty = -h, n = 8;
    ctx.beginPath(); ctx.moveTo(-w / 2, ty + 70);
    for (let i = 0; i < n; i++) { const xa = -w / 2 + i * w / n, xb = xa + w / n; ctx.quadraticCurveTo((xa + xb) / 2, ty + 92, xb, ty + 70); }
    ctx.quadraticCurveTo(w * .42, ty - 30, 0, ty - 52); ctx.quadraticCurveTo(-w * .42, ty - 30, -w / 2, ty + 70); ctx.closePath();
    ctx.save(); ctx.clip();
    for (let i = 0; i < n; i++) { const xa = -w / 2 + i * w / n; poly(ctx, [[0, ty - 60], [xa, ty + 100], [xa + w / n, ty + 100]]); ctx.fillStyle = N(cols[i % cols.length]); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(-w / 2, ty - 60, w, 40);
    ctx.restore();
    ctx.lineWidth = 8; ctx.strokeStyle = OUTLINE; ctx.lineJoin = 'round'; ctx.stroke();
    Ci(ctx, 0, ty - 56, 11, '#F4E3C3', 5);
    ctx.restore();
  }
  function ringBuoy(ctx, x, y, r) {
    ctx.lineWidth = r * .55;
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(x, y, r, i * TAU / 8, (i + 1) * TAU / 8); ctx.strokeStyle = N(i % 2 ? '#FFFFFF' : '#EE384A'); ctx.stroke(); }
    ctx.lineWidth = 6; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.arc(x, y, r * 1.28, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, r * .72, 0, TAU); ctx.stroke();
  }
  function duck(ctx, x, y, s, T) {
    const b = Math.sin(T * 2.4 + x) * 5; ctx.save(); ctx.translate(x, y + b); ctx.rotate(Math.sin(T * 2 + x) * .08);
    blob(ctx, [[0, 0, 38 * s], [-30 * s, -10 * s, 30 * s]], '#FFD447', 6);
    Ci(ctx, 22 * s, -42 * s, 26 * s, '#FFD447', 6); ctx.fillStyle = N('#FFD447'); ctx.beginPath(); ctx.arc(0, 0, 36 * s, 0, TAU); ctx.fill();
    El(ctx, 46 * s, -36 * s, 16 * s, 8 * s, '#FF8528', 5); Ci(ctx, 28 * s, -48 * s, 5 * s, OUTLINE);
    ctx.restore();
  }

  envPool = function (ctx, T, cam, o = {}) {
    const nt = setNight(o);
    skyAndSun(ctx, T, cam, 860, 250, 1000);
    clouds(ctx, T, cam, .25, 6, 11, 120, 520, 1, nt ? .35 : 1);
    // far trees
    withPar(ctx, cam, .55, () => { for (let i = -5; i < 14; i++) tree(ctx, -500 + i * 230 + hash(i) * 60, 960, .75 + hash(i + 9) * .3, ['#3FA34D', '#33985A', '#4DB84A'][mod(i, 3)]); });
    withPar(ctx, cam, .75, () => { // cabana / pool house (left)
      B(ctx, -720, 640, 470, 380, 16, '#F4E3C3', 9); B(ctx, -760, 600, 550, 60, 14, '#20BDBB', 9);
      for (let i = 0; i < 7; i++) { ctx.fillStyle = N(i % 2 ? '#FFFFFF' : '#20BDBB'); ctx.fillRect(-740 + i * 72, 660, 72, 60); }
      ctx.beginPath(); for (let i = 0; i < 7; i++) ctx.arc(-704 + i * 72, 720, 36, 0, Math.PI); FS(ctx, null, 0);
      for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(-704 + i * 72, 720, 36, 0, Math.PI); FS(ctx, i % 2 ? '#FFFFFF' : '#20BDBB', 7); }
      B(ctx, -650, 790, 140, 230, 12, '#8A5A2B', 8); B(ctx, -470, 790, 160, 120, 12, nt ? '#FFD98A' : '#80CDF5', 8);
      if (nt) glow(ctx, -390, 850, 170);
    });
    // hedge + fence
    const hc = [];
    for (let x = -3000; x < 6000; x += 75) hc.push([x, 905 + Math.sin(x * .05) * 6, 52]);
    blob(ctx, hc, '#3E9E4A', 7); ctx.fillStyle = N('#3E9E4A'); ctx.fillRect(-3000, 905, 9000, 110);
    for (let i = 0; i < 60; i++) { const x = -800 + hash(i * 3.1) * 3000, y = 900 + hash(i * 7.7) * 90; Ci(ctx, x, y, 8, ['#FF5B9B', '#FFD447', '#FFFFFF'][i % 3], 0); }
    // POOL sign
    bar(ctx, 610, 830, 610, 1000, '#F4E3C3', 10, 5);
    B(ctx, 500, 800, 220, 84, 18, '#FFFFFF', 8); txt(ctx, o.sign || 'POOL', 610, 845, 58, N('#2E9CCA'));
    if (nt) bulbString(ctx, -400, 760, 1500, 760, 70, 22, T, true);
    // far deck
    ctx.fillStyle = N('#F6E7C8'); ctx.fillRect(-3000, 1005, 9000, 160);
    ctx.strokeStyle = 'rgba(150,110,60,.22)'; ctx.lineWidth = 4;
    ctx.beginPath(); for (const y of [1050, 1100]) { ctx.moveTo(-3000, y); ctx.lineTo(6000, y); } for (let x = -1600; x < 2800; x += 110) { ctx.moveTo(x, 1005); ctx.lineTo(x + (x - cam.x) * .12, 1165); } ctx.stroke();
    ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 1001, 9000, 7);
    // umbrella + loungers
    umbrella(ctx, 250, 770, 1140, 360, ['#FF5B9B', '#FFFFFF', '#FFD447', '#FFFFFF'], T);
    lounger(ctx, 60, 1140, '#20BDBB'); lounger(ctx, 285, 1140, '#FFD447');
    B(ctx, 232, 1090, 40, 50, 8, '#FFFFFF', 5); // little table
    // lifeguard chair
    bar(ctx, 850, 1150, 878, 800, '#FFFFFF', 14, 6); bar(ctx, 950, 1150, 922, 800, '#FFFFFF', 14, 6);
    for (let k = 0; k < 3; k++) bar(ctx, 856 + k * 6, 1080 - k * 90, 944 - k * 6, 1080 - k * 90, '#FFFFFF', 8, 5);
    B(ctx, 845, 780, 110, 30, 10, '#EE384A', 8); B(ctx, 858, 690, 84, 100, 12, '#EE384A', 8);
    txt(ctx, 'LIFE', 900, 728, 30, N('#FFFFFF')); txt(ctx, 'GUARD', 900, 760, 24, N('#FFFFFF'));
    ringBuoy(ctx, 960, 960, 30);
    // diving board (left)
    B(ctx, -260, 960, 130, 190, 14, '#2E9CCA', 8);
    for (let k = 0; k < 4; k++) bar(ctx, -290, 1140 - k * 50, -255, 1140 - k * 50, '#D8DDE8', 6, 4);
    bar(ctx, -290, 1150, -290, 930, '#D8DDE8', 8, 4);
    const tip = Math.sin(T * 7) * 4;
    ctx.beginPath(); ctx.moveTo(-220, 948); ctx.quadraticCurveTo(-20, 950, 180, 952 + tip); ctx.lineTo(180, 976 + tip); ctx.quadraticCurveTo(-20, 974, -220, 972); ctx.closePath(); FS(ctx, '#FFFFFF', 8);
    ctx.fillStyle = N('#20BDBB'); ctx.fillRect(-200, 956, 360, 6);
    // water slide (right)
    B(ctx, 1190, 560, 170, 40, 10, '#FF8528', 8);
    for (const x of [1200, 1340]) bar(ctx, x, 600, x, 1150, '#20BDBB', 16, 6);
    for (let k = 0; k < 6; k++) bar(ctx, 1210, 650 + k * 85, 1330, 650 + k * 85, '#20BDBB', 6, 4);
    const tube = () => { ctx.beginPath(); ctx.moveTo(1210, 600); ctx.bezierCurveTo(950, 640, 900, 760, 1110, 860); ctx.bezierCurveTo(1300, 950, 1220, 1080, 1060, 1180); };
    ctx.lineCap = 'round'; tube(); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 86; ctx.stroke(); tube(); ctx.strokeStyle = N('#FFD447'); ctx.lineWidth = 68; ctx.stroke();
    tube(); ctx.strokeStyle = N('#FFE98A'); ctx.lineWidth = 16; ctx.setLineDash([60, 40]); ctx.lineDashOffset = -T * 160; ctx.stroke(); ctx.setLineDash([]);
    // far coping + tile band
    B(ctx, -3000, 1160, 9000, 28, 6, '#FFFFFF', 7);
    for (let i = -40; i < 60; i++) { ctx.fillStyle = N(i % 2 ? '#1D6FB8' : '#2E9CCA'); ctx.fillRect(i * 44, 1188, 44, 20); }
    // water band (back)
    const g = ctx.createLinearGradient(0, 1206, 0, 1500); g.addColorStop(0, N(nt ? '#46D8F5' : '#5FD8F7')); g.addColorStop(1, N(nt ? '#1B8FD8' : '#239FE4'));
    ctx.fillStyle = g; ctx.fillRect(-3000, 1206, 9000, 290);
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(-3000, 1206, 9000, 5);
    if (nt) for (let i = -2; i < 6; i++) { glow(ctx, i * 360 + 20, 1290, 210, '120,240,255', .55); Ci(ctx, i * 360 + 20, 1290, 18, '#E8FFFF', 5); }
    waterNet(ctx, 1220, 1480, T, nt ? .35 : .3);
    // ladder (x 640)
    for (const x of [620, 690]) {
      ctx.beginPath(); ctx.moveTo(x, 1150); ctx.quadraticCurveTo(x, 1110, x + 30, 1110); ctx.quadraticCurveTo(x + 60, 1110, x + 60, 1170); ctx.lineTo(x + 60, 1210);
      ctx.strokeStyle = OUTLINE; ctx.lineWidth = 22; ctx.stroke(); ctx.strokeStyle = N('#D8DDE8'); ctx.lineWidth = 11; ctx.stroke();
      ctx.save(); ctx.globalAlpha = .5; ln(ctx, x + 60, 1210, x + 60, 1360, '#D8DDE8', 11); ctx.restore();
    }
    ctx.save(); ctx.globalAlpha = .45; for (let k = 0; k < 2; k++) ln(ctx, 680, 1260 + k * 70, 750, 1260 + k * 70, '#D8DDE8', 9); ctx.restore();
    // splash at slide exit
    for (let i = 0; i < 6; i++) { const u = mod(T * 1.4 + i / 6, 1); Ci(ctx, 1060 + Math.cos(i * 1.1) * 60 * u, 1215 - Math.sin(u * Math.PI) * 60 - i * 4, 14 * (1 - u) + 4, '#FFFFFF'); }
    El(ctx, 1060, 1225, 80, 16, '#E8FBFF', 0);
    // floaties
    { const b = Math.sin(T * 2.2) * 6; ctx.save(); ctx.translate(40, 1330 + b); ctx.rotate(Math.sin(T * 1.7) * .06);
      El(ctx, 0, 0, 90, 34, '#FF5B9B', 8); El(ctx, 0, -4, 42, 12, '#2DB3EA', 6);
      for (let i = 0; i < 8; i++) { const a = i * TAU / 8; ctx.fillStyle = N(PAL[i % 8]); ctx.fillRect(Math.cos(a) * 66 - 5, Math.sin(a) * 22 - 6, 10, 5); }
      ctx.restore(); }
    duck(ctx, 545, 1250, .8, T);
    { const b = Math.sin(T * 2.6 + 1) * 6; ctx.save(); ctx.translate(990, 1350 + b); ctx.rotate(T * .3);
      Ci(ctx, 0, 0, 44, '#FFFFFF', 7); ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.clip();
      for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 50, i * TAU / 6, i * TAU / 6 + TAU / 12); ctx.closePath(); ctx.fillStyle = N(['#EE384A', '#FFD447', '#2E9CCA'][i % 3]); ctx.fill(); }
      ctx.restore(); circle(ctx, 0, 0, 44, null, 7); ctx.restore(); }
    // near coping + deck
    ground(ctx, '#F6E7C8', 1515);
    ctx.strokeStyle = 'rgba(150,110,60,.22)'; ctx.lineWidth = 5; ctx.beginPath();
    for (let i = -30; i < 40; i++) { ctx.moveTo(i * 150, 1515); ctx.lineTo(i * 150 + (i * 150 - cam.x) * 1.1, 2600); }
    for (let k = 1; k < 7; k++) { const y = 1515 + k * k * 22; ctx.moveTo(-3000, y); ctx.lineTo(6000, y); } ctx.stroke();
    B(ctx, -3000, 1488, 9000, 30, 6, '#FFFFFF', 8);
    // flip-flops + towel on near deck (right, out of the acting area)
    ctx.save(); ctx.translate(1010, 1640); ctx.rotate(-.2); El(ctx, 0, 0, 22, 44, '#FF5B9B', 6); El(ctx, 50, 8, 22, 44, '#FF5B9B', 6); ctx.restore();
  };

  envPoolFront = function (ctx, T, cam, o = {}) {
    setNight(o);
    const WL = o.waterline ?? POOL_WATERLINE, z = cam.z || 1, x0 = cam.x - 800 / z, x1 = cam.x + 800 / z;
    const top = x => WL + Math.sin(x * .017 + T * 2.6) * 5 + Math.sin(x * .043 - T * 3.3) * 3;
    ctx.beginPath(); ctx.moveTo(x0, 4000); for (let x = x0; x <= x1; x += 20) ctx.lineTo(x, top(x)); ctx.lineTo(x1, 4000); ctx.closePath();
    const g = ctx.createLinearGradient(0, WL, 0, WL + 420);
    g.addColorStop(0, NIGHT ? 'rgba(40,150,215,.6)' : 'rgba(70,205,248,.6)'); g.addColorStop(.35, NIGHT ? 'rgba(24,110,190,.86)' : 'rgba(38,165,232,.86)'); g.addColorStop(.7, NIGHT ? 'rgba(14,70,150,.97)' : 'rgba(26,130,215,.97)'); g.addColorStop(1, NIGHT ? 'rgb(12,60,140)' : 'rgb(24,122,208)');
    ctx.fillStyle = g; ctx.fill();
    ctx.save(); ctx.clip(); waterNet(ctx, WL + 40, WL + 700, T * 1.1, .26, x0, x1); ctx.restore();
    // surface line
    ctx.beginPath(); for (let x = x0; x <= x1; x += 20) x === x0 ? ctx.moveTo(x, top(x)) : ctx.lineTo(x, top(x));
    ctx.strokeStyle = 'rgba(27,21,48,.55)'; ctx.lineWidth = 7; ctx.stroke();
    ctx.translate(0, 8); ctx.strokeStyle = 'rgba(230,252,255,.85)'; ctx.lineWidth = 7; ctx.stroke(); ctx.translate(0, -8);
    // ripples round swimmers
    for (const sx of (o.swimmers || [])) for (let k = 0; k < 3; k++) {
      const u = mod(T * .7 + k / 3, 1); ctx.save(); ctx.globalAlpha = (1 - u) * .8;
      ellipse(ctx, sx, top(sx) + 6, 110 + u * 130, 16 + u * 14, null, 0); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
    }
    // sparkles
    for (let i = 0; i < 9; i++) { const x = x0 + hash(i * 5.3) * (x1 - x0), y = top(x) + 30 + hash(i * 2.1) * 260, a = Math.max(0, Math.sin(T * 3 + i * 2.2));
      ctx.save(); ctx.globalAlpha = a * .8; starPath(ctx, x, y, 16, 4, 4, 0); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.restore(); }
  };

  // ================================================================= 2. BEACH
  function gull(ctx, x, y, s, T, ph) {
    const f = Math.sin(T * 7 + ph) * .5;
    ctx.beginPath(); ctx.moveTo(x - 60 * s, y - 20 * s - f * 40 * s); ctx.quadraticCurveTo(x - 28 * s, y - 34 * s - f * 20 * s, x, y);
    ctx.quadraticCurveTo(x + 28 * s, y - 34 * s - f * 20 * s, x + 60 * s, y - 20 * s - f * 40 * s);
    ctx.strokeStyle = OUTLINE; ctx.lineWidth = 15 * s; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.strokeStyle = N('#FFFFFF'); ctx.lineWidth = 7 * s; ctx.stroke();
  }
  function palm(ctx, x, y, s, T) {
    ctx.beginPath(); ctx.moveTo(x - 20 * s, y); ctx.quadraticCurveTo(x - 10 * s, y - 300 * s, x + 80 * s, y - 520 * s); ctx.lineTo(x + 116 * s, y - 510 * s); ctx.quadraticCurveTo(x + 30 * s, y - 300 * s, x + 30 * s, y); ctx.closePath(); FS(ctx, '#C98B4B', 8);
    for (let k = 1; k < 7; k++) ln(ctx, x - 14 * s + k * 14 * s, y - k * 75 * s, x + 26 * s + k * 14 * s, y - k * 75 * s - 6 * s, '#9C6A36', 5);
    const cx = x + 98 * s, cy = y - 520 * s;
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI / 2 + (i - 2.5) * .62 + Math.sin(T * 1.6 + i) * .05, L = 230 * s;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(L * .5, -50 * s, L, 40 * s); ctx.quadraticCurveTo(L * .5, 20 * s, 0, 0); FS(ctx, i % 2 ? '#3FA34D' : '#30CE65', 7);
      ctx.restore();
    }
    for (const [ox, oy] of [[-16, 14], [14, 18], [0, 30]]) Ci(ctx, cx + ox * s, cy + oy * s, 18 * s, '#8A5A2B', 5);
  }
  envBeach = function (ctx, T, cam, o = {}) {
    const nt = setNight(o);
    if (nt) { sky(ctx, NIGHT_SKY[0], '#5A3C8E', -300, 1000); stars(ctx, T, cam); withPar(ctx, cam, .1, () => moon(ctx, 820, 300, 66)); }
    else { sky(ctx, '#3BAEF2', '#D3F3FF', -300, 1000); withPar(ctx, cam, .1, () => sun(ctx, 820, 290, 92, T)); }
    clouds(ctx, T, cam, .25, 6, 21, 140, 560, 1, nt ? .3 : 1);
    // sea
    const g = ctx.createLinearGradient(0, 985, 0, 1400); g.addColorStop(0, N('#1C78D0')); g.addColorStop(1, N('#3ACFE6'));
    ctx.fillStyle = g; ctx.fillRect(-3000, 985, 9000, 500);
    if (nt) { ctx.save(); ctx.globalAlpha = .5; for (let k = 0; k < 8; k++) { const w = 80 - k * 6; ctx.fillStyle = '#FFF3C4'; ctx.fillRect(820 - w / 2 + Math.sin(T * 2 + k) * 14 + par(cam, .1).dx, 1000 + k * 28, w, 7); } ctx.restore(); }
    withPar(ctx, cam, .2, () => { // island + boat on the horizon
      ctx.beginPath(); ctx.ellipse(1000, 990, 190, 46, 0, Math.PI, TAU); FS(ctx, '#4DB84A', 7);
      palm(ctx, 990, 960, .32, T);
      const bx = 160 + Math.sin(T * .15) * 60, by = 985 + Math.sin(T * 1.6) * 3;
      ctx.beginPath(); ctx.moveTo(bx - 70, by - 16); ctx.lineTo(bx + 70, by - 16); ctx.lineTo(bx + 46, by + 12); ctx.lineTo(bx - 46, by + 12); ctx.closePath(); FS(ctx, '#EE384A', 6);
      ln(ctx, bx, by - 16, bx, by - 130, OUTLINE, 6);
      poly(ctx, [[bx + 4, by - 126], [bx + 70, by - 28], [bx + 4, by - 28]]); FS(ctx, '#FFFFFF', 6);
      poly(ctx, [[bx - 4, by - 110], [bx - 50, by - 28], [bx - 4, by - 28]]); FS(ctx, '#FFD447', 6);
    });
    ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 982, 9000, 6);
    // wave crests
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineCap = 'round';
    for (let j = 0; j < 5; j++) {
      const y = 1030 + j * j * 13 + j * 22, sp = 26 + j * 10, w = 60 + j * 22; ctx.lineWidth = 4 + j * 1.5;
      ctx.beginPath(); for (let i = -14; i < 30; i++) { const x = i * w * 2.2 + mod(T * sp * (j % 2 ? 1 : -1) + j * 70, w * 2.2) - 600 + hash(i * 3 + j) * 50; ctx.moveTo(x - w * .5, y); ctx.quadraticCurveTo(x, y - 8 - j * 2, x + w * .5, y); } ctx.stroke();
    }
    ctx.restore();
    // wet sand + foam wash
    const wash = Math.sin(T * .9) * 24, S = x => 1330 + wash + Math.sin(x * .012 + T * 1.2) * 8;
    ctx.beginPath(); ctx.moveTo(-3000, 4000); for (let x = -3000; x <= 6000; x += 60) ctx.lineTo(x, S(x)); ctx.lineTo(6000, 4000); ctx.closePath(); ctx.fillStyle = N('#E2B566'); ctx.fill();
    ctx.beginPath(); for (let x = -3000; x <= 6000; x += 60) x === -3000 ? ctx.moveTo(x, S(x) - 4) : ctx.lineTo(x, S(x) - 4);
    ctx.strokeStyle = N('#FFFFFF'); ctx.lineWidth = 16; ctx.stroke();
    ctx.save(); ctx.globalAlpha = .6; for (let i = 0; i < 40; i++) { const x = -900 + i * 80 + Math.sin(T + i) * 10; Ci(ctx, x, S(x) + 10, 6 + hash(i) * 6, '#FFFFFF'); } ctx.restore();
    // dry sand
    const D = x => 1392 + Math.sin(x * .02) * 6;
    ctx.beginPath(); ctx.moveTo(-3000, 4000); for (let x = -3000; x <= 6000; x += 60) ctx.lineTo(x, D(x)); ctx.lineTo(6000, 4000); ctx.closePath();
    const sg = ctx.createLinearGradient(0, 1390, 0, 2100); sg.addColorStop(0, N('#F7DA8E')); sg.addColorStop(1, N('#F2C977')); ctx.fillStyle = sg; ctx.fill();
    ctx.strokeStyle = N('#D9AD5C'); ctx.lineWidth = 6; ctx.stroke();
    { const r = rng(5); ctx.fillStyle = N('#E3B868'); for (let i = 0; i < 110; i++) { const x = -1200 + r() * 3600, y = 1420 + r() * 700; ctx.fillRect(x, y, 6 + r() * 6, 5); } }
    // lifeguard tower (left)
    ctx.save(); ctx.translate(90, 0);
    for (const [x1, x2] of [[-300, -250], [-10, -60]]) bar(ctx, x1, 1430, x2, 1130, '#FFFFFF', 14, 6);
    bar(ctx, -270, 1300, -40, 1300, '#FFFFFF', 10, 5);
    B(ctx, -320, 1110, 330, 30, 8, '#F4E3C3', 8);
    B(ctx, -290, 920, 270, 200, 16, '#FFD447', 9); B(ctx, -250, 960, 190, 80, 10, nt ? '#FFD98A' : '#80CDF5', 7);
    poly(ctx, [[-330, 930], [-155, 840], [20, 930]]); FS(ctx, '#EE384A', 9);
    txt(ctx, 'LIFEGUARD', -155, 1080, 30, N('#EE384A'));
    flag(ctx, -155, 740, T, '#EE384A', 1.1); ln(ctx, -155, 740, -155, 845, OUTLINE, 7);
    for (let k = 0; k < 4; k++) bar(ctx, 30, 1160 + k * 70, 80, 1160 + k * 70, '#FFFFFF', 6, 4);
    bar(ctx, 30, 1430, 30, 1130, '#FFFFFF', 7, 4); bar(ctx, 80, 1430, 80, 1130, '#FFFFFF', 7, 4);
    ctx.restore();
    // palm (far right)
    palm(ctx, 1290, 1420, 1, T);
    // umbrella + towel (right)
    poly(ctx, [[840, 1545], [1090, 1545], [1120, 1625], [810, 1625]]); FS(ctx, '#20BDBB', 7);
    ctx.save(); poly(ctx, [[840, 1545], [1090, 1545], [1120, 1625], [810, 1625]]); ctx.clip();
    for (let i = 0; i < 6; i++) { ctx.fillStyle = N(i % 2 ? '#FFFFFF' : '#FFD447'); ctx.fillRect(820 + i * 60, 1540, 22, 100); } ctx.restore();
    umbrella(ctx, 950, 1040, 1560, 380, ['#EE384A', '#FFFFFF', '#2E9CCA', '#FFFFFF'], T, .07);
    // sandcastle (left front)
    const sc = '#F2C25E', sx = 80, sy = 1610;
    B(ctx, sx - 110, sy - 100, 220, 100, 8, sc, 8);
    for (const tx of [-100, 60]) { B(ctx, sx + tx, sy - 170, 50, 170, 6, sc, 8); for (let k = 0; k < 2; k++) B(ctx, sx + tx + k * 30, sy - 186, 20, 20, 3, sc, 6); }
    B(ctx, sx - 35, sy - 220, 70, 120, 6, sc, 8); for (let k = 0; k < 3; k++) B(ctx, sx - 35 + k * 25, sy - 238, 20, 22, 3, sc, 6);
    rr(ctx, sx - 20, sy - 60, 40, 60, 20); FS(ctx, '#B98A3A', 6);
    flag(ctx, sx, sy - 330, T, '#FF5B9B', .8);
    // bucket + spade
    poly(ctx, [[230, 1560], [290, 1560], [282, 1620], [238, 1620]]); FS(ctx, '#2E9CCA', 7);
    ctx.beginPath(); ctx.arc(260, 1560, 30, Math.PI, TAU); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.stroke();
    ctx.save(); ctx.translate(320, 1600); ctx.rotate(.5); B(ctx, -5, -70, 10, 60, 4, '#FFD447', 4); B(ctx, -16, -16, 32, 32, 8, '#EE384A', 5); ctx.restore();
    // shells + starfish (low contrast)
    starPath(ctx, 1040, 1760, 26, 12, 5, T * .0 - .3); FS(ctx, '#FF8A7A', 5);
    for (const [x, y] of [[520, 1820], [-60, 1760], [760, 1790]]) { ctx.beginPath(); ctx.arc(x, y, 16, Math.PI, TAU); ctx.closePath(); FS(ctx, '#FFE3EC', 5); }
    // seagulls
    withPar(ctx, cam, .6, () => { for (let i = 0; i < 4; i++) { const x = mod(i * 760 + T * (45 + i * 8), 2800) - 800, y = 470 + i * 70 + Math.sin(T * 1.3 + i) * 20; gull(ctx, x, y, .8 + (i % 2) * .25, T, i * 2); } });
  };
  envBeachFront = function (ctx, T, cam, o = {}) {
    setNight(o);
    for (const [cx, dir] of [[-120, 1], [1200, -1]]) {
      blob(ctx, [[cx, 2000, 230], [cx + dir * 220, 2070, 190], [cx - dir * 200, 1960, 200]], '#F2CC7A', 8);
      for (let i = 0; i < 5; i++) { const x = cx + dir * (i * 40 - 60), y = 1800 + Math.abs(i - 2) * 26; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(T * 2 + i) * .08 + (i - 2) * .2);
        ctx.beginPath(); ctx.moveTo(-8, 30); ctx.quadraticCurveTo(-4, -60, 6, -110); ctx.quadraticCurveTo(6, -50, 10, 30); ctx.closePath(); FS(ctx, '#4DB84A', 5); ctx.restore(); }
    }
  };

  // ================================================================= 3. PLAYGROUND
  envPlayground = function (ctx, T, cam, o = {}) {
    const nt = setNight(o);
    skyAndSun(ctx, T, cam, 170, 260, 1150);
    clouds(ctx, T, cam, .25, 6, 31, 120, 520, 1, nt ? .35 : 1);
    hills(ctx, cam, .3, 1080, 80, '#9EDC72', 1.1, 8);
    withPar(ctx, cam, .45, () => { for (let i = -4; i < 12; i++) roundTree(ctx, -700 + i * 260 + hash(i * 2) * 80, 1170, .8 + hash(i) * .3, ['#3FA34D', '#4DB84A', '#2F9A55'][mod(i, 3)], 7); });
    hills(ctx, cam, .55, 1210, 30, '#78CF5E', 3.2, 8, .7);
    // low fence
    withPar(ctx, cam, .8, () => {
      for (let x = -1400; x < 2600; x += 120) B(ctx, x, 1180, 22, 120, 6, '#2E9CCA', 6);
      B(ctx, -1500, 1200, 4200, 16, 6, '#2E9CCA', 6); B(ctx, -1500, 1255, 4200, 16, 6, '#2E9CCA', 6);
    });
    ground(ctx, '#65C75A', 1300);
    ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 1297, 9000, 6);
    // play-area wood chips / soft surface
    ctx.beginPath(); ctx.moveTo(-3000, 1440); ctx.lineTo(6000, 1440); ctx.lineTo(6000, 4000); ctx.lineTo(-3000, 4000); ctx.closePath(); ctx.fillStyle = N('#E8B87A'); ctx.fill();
    ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 1437, 9000, 6);
    { const r = rng(17); ctx.fillStyle = N('#D59C5C'); for (let i = 0; i < 140; i++) { const x = -1200 + r() * 3600, y = 1460 + r() * 700; ctx.save(); ctx.translate(x, y); ctx.rotate(r() * 3); ctx.fillRect(-9, -3, 18, 6); ctx.restore(); } }
    // grass tufts
    for (let i = 0; i < 40; i++) { const x = -800 + hash(i * 1.7) * 2800, y = 1320 + hash(i * 3.3) * 100; ln(ctx, x, y, x - 8, y - 20, '#4DAE45', 6); ln(ctx, x, y, x + 8, y - 18, '#4DAE45', 6); }
    // path
    ctx.beginPath(); ctx.moveTo(500, 1300); ctx.quadraticCurveTo(470, 1380, 400, 1440); ctx.lineTo(680, 1440); ctx.quadraticCurveTo(650, 1380, 620, 1300); ctx.closePath(); FS(ctx, '#F4E3C3', 6);
    // monkey bars (back)
    { const c = '#7B4BFF', y0 = 1020, y1 = 1490, xa = -800, xb = -400;
      for (const x of [xa, xb]) { bar(ctx, x, y0, x, y1, c, 16, 6); bar(ctx, x + 36, y0, x + 36, y1, c, 16, 6); for (let k = 1; k < 8; k++) bar(ctx, x, y0 + k * 58, x + 36, y0 + k * 58, '#FFD447', 8, 4); }
      bar(ctx, xa, y0, xb + 36, y0, c, 14, 6); bar(ctx, xa, y0 + 30, xb + 36, y0 + 30, c, 14, 6);
      for (let k = 1; k < 12; k++) bar(ctx, xa + k * 36, y0, xa + k * 36, y0 + 30, '#FFD447', 8, 3); }
    // kite
    { const kx = 640 + Math.sin(T * .8) * 40 + par(cam, .4).dx, ky = 420 + Math.sin(T * 1.3) * 26, a = Math.sin(T * 1.1) * .18;
      ctx.beginPath(); ctx.moveTo(kx, ky + 70); ctx.bezierCurveTo(kx + 60, ky + 300, kx + 160, ky + 500, kx + 260, ky + 900); ctx.strokeStyle = 'rgba(27,21,48,.5)'; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(kx, ky + 70); for (let i = 1; i <= 8; i++) ctx.lineTo(kx + Math.sin(T * 4 + i) * 16, ky + 70 + i * 22); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.stroke();
      for (let i = 1; i <= 3; i++) { const bx = kx + Math.sin(T * 4 + i * 2.6) * 16, by = ky + 70 + i * 44; poly(ctx, [[bx - 14, by - 8], [bx + 14, by + 8], [bx + 14, by - 8], [bx - 14, by + 8]]); FS(ctx, PAL[i * 2], 3); }
      ctx.save(); ctx.translate(kx, ky); ctx.rotate(a);
      poly(ctx, [[0, -90], [64, -10], [0, 70], [-64, -10]]); FS(ctx, '#FF5B9B', 7);
      poly(ctx, [[0, -90], [64, -10], [0, -10]]); FS(ctx, '#FFD447', 0); poly(ctx, [[0, 70], [-64, -10], [0, -10]]); FS(ctx, '#FFD447', 0);
      poly(ctx, [[0, -90], [64, -10], [0, 70], [-64, -10]]); FS(ctx, null, 7); ln(ctx, 0, -90, 0, 70, OUTLINE, 4); ln(ctx, -64, -10, 64, -10, OUTLINE, 4);
      ctx.restore(); }
    // bench (back right)
    bar(ctx, 680, 1300, 680, 1350, '#3A3A55', 8, 4); bar(ctx, 850, 1300, 850, 1350, '#3A3A55', 8, 4);
    B(ctx, 650, 1240, 230, 22, 8, '#30A045', 7); B(ctx, 650, 1272, 230, 22, 8, '#30A045', 7); B(ctx, 650, 1300, 230, 24, 8, '#30A045', 7);
    // slide (left)
    for (const x of [-290, -80]) bar(ctx, x, 1490, x, 1010, '#EE384A', 16, 6);
    for (let k = 0; k < 7; k++) bar(ctx, -330, 1450 - k * 66, -290, 1450 - k * 66, '#FFD447', 8, 4);
    bar(ctx, -330, 1490, -330, 1000, '#EE384A', 12, 5);
    B(ctx, -310, 1030, 250, 30, 8, '#2E9CCA', 8);
    for (let k = 0; k < 4; k++) bar(ctx, -280 + k * 60, 1030, -280 + k * 60, 960, '#FFD447', 6, 4);
    bar(ctx, -300, 960, -80, 960, '#FFD447', 8, 4);
    poly(ctx, [[-330, 920], [-185, 790], [-40, 920]]); FS(ctx, '#FF8528', 9);
    const chute = () => { ctx.beginPath(); ctx.moveTo(-70, 1045); ctx.bezierCurveTo(60, 1080, 60, 1440, 250, 1470); };
    ctx.lineCap = 'round'; chute(); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 74; ctx.stroke(); chute(); ctx.strokeStyle = N('#FFD447'); ctx.lineWidth = 56; ctx.stroke();
    chute(); ctx.strokeStyle = N('#FFF1A8'); ctx.lineWidth = 16; ctx.stroke();
    // swings (right)
    { const L = 430, py = 885;
      bar(ctx, 860, py, 800, 1495, '#FF8528', 16, 6); bar(ctx, 860, py, 920, 1495, '#FF8528', 16, 6);
      bar(ctx, 1270, py, 1210, 1495, '#FF8528', 16, 6); bar(ctx, 1270, py, 1330, 1495, '#FF8528', 16, 6);
      B(ctx, 830, py - 18, 470, 30, 12, '#2E9CCA', 8);
      [[965, 0], [1165, 1.7]].forEach(([x, ph], i) => {
        const a = o.swing === false ? 0 : Math.sin(T * 2.3 + ph) * (.32 - i * .06);
        ctx.save(); ctx.translate(x, py + 4); ctx.rotate(a);
        for (const cx of [-34, 34]) { ln(ctx, cx, 0, cx, L, OUTLINE, 9); ln(ctx, cx, 0, cx, L, '#B8C2CC', 4); }
        B(ctx, -54, L - 6, 108, 24, 10, i ? '#30CE65' : '#EE384A', 7); ctx.restore();
      }); }
    // sandbox (front right)
    B(ctx, 870, 1560, 320, 110, 16, '#C98B4B', 8); B(ctx, 892, 1576, 276, 76, 10, '#F7DA8E', 5);
    blob(ctx, [[960, 1610, 30], [1000, 1600, 34]], '#F2C25E', 4);
    poly(ctx, [[1060, 1574], [1110, 1574], [1104, 1622], [1066, 1622]]); FS(ctx, '#FF5B9B', 6);
    // flowers
    for (let i = 0; i < 16; i++) { const x = -700 + hash(i * 9.1) * 2600, y = 1330 + hash(i * 4.4) * 90; if (x > 250 && x < 900) continue; Ci(ctx, x, y, 9, ['#FF5B9B', '#FFD447', '#FFFFFF'][i % 3], 4); }
    if (nt) { // park lamps
      for (const x of [-120, 1460]) { bar(ctx, x, 1440, x, 820, '#3A3A55', 10, 5); B(ctx, x - 30, 780, 60, 60, 14, '#FFE9A8', 6); glow(ctx, x, 810, 300); }
    }
  };

  // ================================================================= 4. AMUSEMENT PARK
  envAmusementPark = function (ctx, T, cam, o = {}) {
    const nt = setNight(o);
    if (nt) { sky(ctx, '#140D3A', '#55207A', -300, 1300); stars(ctx, T, cam, 70); }
    else { sky(ctx, '#45B2F2', '#FFE7C2', -300, 1300); withPar(ctx, cam, .1, () => sun(ctx, 140, 230, 78, T)); }
    clouds(ctx, T, cam, .2, 5, 41, 120, 480, .9, nt ? .25 : 1);
    if (nt) for (let k = 0; k < 3; k++) { // fireworks
      const cyc = 2.4, tt = T + k * .83, n = Math.floor(tt / cyc), u = (tt % cyc) / cyc;
      if (u < .7) { const fx = -150 + hash(n * 3 + k) * 1400, fy = 150 + hash(n * 7 + k) * 260, R = easeOut(u / .7) * 150, a = 1 - u / .7, col = PAL[(n + k) % 8];
        ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 14; i++) { const an = i * TAU / 14; circle(ctx, fx + Math.cos(an) * R, fy + Math.sin(an) * R + u * 40, 8, col); circle(ctx, fx + Math.cos(an) * R * .6, fy + Math.sin(an) * R * .6 + u * 30, 5, '#FFFFFF'); }
        ctx.restore(); }
    }
    // roller coaster (back left)
    withPar(ctx, cam, .6, () => {
      const ty = x => x > 420 ? lerp(ty(420), 1380, smooth((x - 420) / 260)) : 640 + 190 * Math.sin(x * .0062 + 1.1) + 70 * Math.sin(x * .017 + 1.3);
      for (let x = -1300; x <= 660; x += 75) { bar(ctx, x, ty(x) + 10, x, 1420, '#FFFFFF', 6, 4); }
      for (let x = -1300; x < 660; x += 150) { ln(ctx, x, ty(x) + 60, x + 75, 1400, '#FFFFFF', 4); }
      const path = () => { ctx.beginPath(); for (let x = -1400; x <= 680; x += 20) x === -1400 ? ctx.moveTo(x, ty(x)) : ctx.lineTo(x, ty(x)); };
      path(); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 30; ctx.lineJoin = 'round'; ctx.stroke(); path(); ctx.strokeStyle = N('#EE384A'); ctx.lineWidth = 16; ctx.stroke();
      if (nt) { for (let x = -1300; x < 660; x += 60) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; circle(ctx, x, ty(x), 7, PAL[mod(x / 60 + Math.floor(T * 4), 8)]); ctx.restore(); } }
      for (let c = 0; c < 2; c++) { // train of 3 carts
        const head = -1300 + mod(T * 330 + c * 1000, 1900);
        for (let k = 0; k < 3; k++) {
          const x = head - k * 70; if (x < -1350 || x > 640) continue;
          const y = ty(x), a = Math.atan2(ty(x + 4) - ty(x - 4), 8);
          ctx.save(); ctx.translate(x, y); ctx.rotate(a);
          B(ctx, -32, -52, 64, 40, 10, ['#FFD447', '#20BDBB', '#FF5B9B'][k], 6);
          Ci(ctx, -10, -64, 14, SKINS[(k + c) % 5], 5); bar(ctx, -2, -62, 8, -92, SKINS[(k + c) % 5], 6, 3);
          ctx.restore();
        }
      }
    });
    // ferris wheel
    withPar(ctx, cam, .8, () => {
      const cx = 780, cy = 520, R = 340, rot = T * .22;
      bar(ctx, cx, cy, cx - 230, 1440, '#E8F2F7', 18, 7); bar(ctx, cx, cy, cx + 230, 1440, '#E8F2F7', 18, 7);
      bar(ctx, cx - 160, 1150, cx + 160, 1150, '#E8F2F7', 10, 5);
      for (let i = 0; i < 16; i++) { const a = rot + i * TAU / 16; ln(ctx, cx, cy, cx + Math.cos(a) * R, cy + Math.sin(a) * R, OUTLINE, 11); ln(ctx, cx, cy, cx + Math.cos(a) * R, cy + Math.sin(a) * R, '#FFFFFF', 5); }
      for (const [rad, col, w] of [[R, '#FF5B9B', 18], [R * .72, '#FFD447', 10]]) { ctx.beginPath(); ctx.arc(cx, cy, rad, 0, TAU); ctx.strokeStyle = OUTLINE; ctx.lineWidth = w + 14; ctx.stroke(); ctx.strokeStyle = N(col); ctx.lineWidth = w; ctx.stroke(); }
      if (nt) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const a = rot + i * TAU / 40; const on = (i + Math.floor(T * 6)) % 3; circle(ctx, cx + Math.cos(a) * R, cy + Math.sin(a) * R, on ? 9 : 14, on ? '#FFE9A8' : '#FF9AD0'); } ctx.restore(); glow(ctx, cx, cy, R * 1.25, '255,120,200', .18); }
      Ci(ctx, cx, cy, 46, '#FFD447', 9); Ci(ctx, cx, cy, 16, '#FF8528', 6);
      for (let i = 0; i < 10; i++) {
        const a = rot + i * TAU / 10, gx = cx + Math.cos(a) * R, gy = cy + Math.sin(a) * R, sw = Math.sin(T * 2 + i) * .08;
        ctx.save(); ctx.translate(gx, gy); ctx.rotate(sw);
        ln(ctx, 0, 0, 0, 24, OUTLINE, 6);
        B(ctx, -44, 20, 88, 74, 16, PAL[i % 8], 8); B(ctx, -32, 32, 64, 26, 8, nt ? '#FFE9A8' : '#BDE8FF', 5);
        rr(ctx, -50, 14, 100, 16, 8); FS(ctx, shade(PAL[i % 8], -.2), 6);
        ctx.restore();
      }
    });
    // hedge row + ground
    withPar(ctx, cam, .9, () => { for (let x = -1500; x < 2700; x += 150) bush(ctx, x, 1440, 1, '#3FA34D', 7); });
    ground(ctx, '#F6DCAA', 1430);
    ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 1427, 9000, 6);
    ctx.strokeStyle = N('#E8C68C'); ctx.lineWidth = 5; ctx.beginPath();
    for (let k = 0; k < 8; k++) { const y = 1430 + k * k * 16 + k * 30; ctx.moveTo(-3000, y); ctx.lineTo(6000, y); }
    for (let i = -20; i < 30; i++) { ctx.moveTo(i * 180, 1430); ctx.lineTo(i * 180 + (i * 180 - cam.x) * 1.2, 2600); } ctx.stroke();
    // big-top tent (left)
    { const x = 0, base = 1450, cols = ['#EE384A', '#FFFFFF'];
      ctx.save(); rr(ctx, x - 240, 1190, 480, base - 1190, 10); ctx.clip(); for (let i = 0; i < 8; i++) { ctx.fillStyle = N(cols[i % 2]); ctx.fillRect(x - 240 + i * 60, 1190, 60, 300); } ctx.restore();
      rr(ctx, x - 240, 1190, 480, base - 1190, 10); FS(ctx, null, 9);
      ctx.beginPath(); ctx.moveTo(x - 70, base); ctx.lineTo(x - 70, 1310); ctx.quadraticCurveTo(x, 1250, x + 70, 1310); ctx.lineTo(x + 70, base); ctx.closePath(); FS(ctx, '#3A1E4F', 8);
      poly(ctx, [[x - 280, 1200], [x, 920], [x + 280, 1200]]); ctx.save(); ctx.clip();
      for (let i = -5; i < 5; i++) { poly(ctx, [[x, 900], [x + i * 70, 1210], [x + i * 70 + 70, 1210]]); ctx.fillStyle = N(cols[mod(i, 2)]); ctx.fill(); } ctx.restore();
      poly(ctx, [[x - 280, 1200], [x, 920], [x + 280, 1200]]); FS(ctx, null, 9);
      ctx.beginPath(); for (let i = 0; i < 8; i++) ctx.arc(x - 245 + i * 70, 1200, 35, 0, Math.PI); FS(ctx, '#FFD447', 7);
      flag(ctx, x, 830, T, '#FFD447', 1);
      if (nt) bulbString(ctx, x - 280, 1200, x, 920, 0, 6, T, true), bulbString(ctx, x, 920, x + 280, 1200, 0, 6, T, true); }
    // snack stand (right)
    { const x = 835;
      B(ctx, x, 1250, 320, 210, 12, '#FFF3D6', 9); B(ctx, x - 14, 1250, 348, 40, 10, '#FF8528', 8);
      B(ctx, x + 30, 1300, 260, 90, 8, nt ? '#FFE9A8' : '#7A4A22', 7);
      for (let i = 0; i < 3; i++) { const cx = x + 80 + i * 80; poly(ctx, [[cx - 14, 1360], [cx + 14, 1360], [cx, 1400]]); FS(ctx, '#F4E3C3', 4); blob(ctx, [[cx, 1340, 26], [cx - 16, 1350, 18], [cx + 16, 1350, 18]], ['#FFB3D1', '#B9A4FF', '#9EE6F0'][i], 4); }
      for (let k = 0; k < 2; k++) bar(ctx, x + 10 + k * 300, 1250, x + 10 + k * 300, 1090, '#FFFFFF', 8, 4);
      ctx.save(); rr(ctx, x - 30, 1050, 380, 70, 10); ctx.clip(); for (let i = 0; i < 8; i++) { ctx.fillStyle = N(i % 2 ? '#FFFFFF' : '#20BDBB'); ctx.fillRect(x - 30 + i * 48, 1050, 48, 70); } ctx.restore(); rr(ctx, x - 30, 1050, 380, 70, 10); FS(ctx, null, 8);
      ctx.beginPath(); for (let i = 0; i < 8; i++) ctx.arc(x - 6 + i * 48, 1120, 24, 0, Math.PI); FS(ctx, '#20BDBB', 7);
      B(ctx, x + 30, 960, 260, 80, 16, '#FF5B9B', 8); txt(ctx, 'SNACKS', x + 160, 1002, 46, nt ? '#FFF6C8' : N('#FFFFFF'));
      if (nt) glow(ctx, x + 160, 1000, 200, '255,120,200', .4);
      // balloons
      const bcol = ['#EE384A', '#FFD447', '#2E9CCA', '#30CE65', '#7B4BFF', '#FF5B9B'];
      for (let i = 0; i < 6; i++) {
        const bx = x - 20 + (i % 3) * 55 + Math.sin(T * 1.5 + i) * 8, by = 880 + Math.floor(i / 3) * 70 - (i % 2) * 30 + Math.sin(T * 2 + i * 1.3) * 6;
        ctx.beginPath(); ctx.moveTo(x - 20, 1270); ctx.quadraticCurveTo((bx + x - 20) / 2 + 10, (by + 1270) / 2, bx, by + 44); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 3; ctx.stroke();
        El(ctx, bx, by, 34, 42, bcol[i], 6); El(ctx, bx - 10, by - 14, 8, 12, 'rgba(255,255,255,.6)');
      }
      B(ctx, x - 40, 1270, 40, 190, 8, '#B8C2CC', 6); }
    // string lights across
    bulbString(ctx, -400, 700, 1500, 700, 110, 24, T, nt);
  };

  // ================================================================= 5. CAMPSITE
  function tent(ctx, x, base, w, h, col, door = '#3A1E2E') {
    poly(ctx, [[x - w / 2, base], [x, base - h], [x + w / 2, base]]); FS(ctx, col, 9);
    poly(ctx, [[x - w * .2, base], [x, base - h * .85], [x + w * .2, base]]); FS(ctx, door, 7);
    poly(ctx, [[x, base - h * .85], [x + w * .2, base], [x + w * .34, base]]); FS(ctx, shade(col, -.2), 7);
    ln(ctx, x, base - h, x, base - h - 30, OUTLINE, 8);
    for (const s of [-1, 1]) { ln(ctx, x + s * w * .25, base - h * .5, x + s * (w / 2 + 70), base, OUTLINE, 3); }
    ctx.fillStyle = 'rgba(255,255,255,.2)'; poly(ctx, [[x - w / 2 + 30, base - 10], [x - 8, base - h + 30], [x - 30, base - h + 70], [x - w / 2 + 70, base - 10]]); ctx.fill();
  }
  function log(ctx, x, y, w, r = 36) { // seat top at y - r*2
    B(ctx, x, y - r * 2, w, r * 2, r, '#9C6A36', 8);
    ln(ctx, x + 30, y - r * 1.3, x + w - 60, y - r * 1.3, '#7A4A22', 5); ln(ctx, x + 60, y - r * .7, x + w - 30, y - r * .7, '#7A4A22', 5);
    El(ctx, x + w - r * .6, y - r, r * .6, r * .95, '#E8B87A', 7); El(ctx, x + w - r * .6, y - r, r * .25, r * .4, '#C98B4B', 0);
  }
  function campfire(ctx, x, y, T, s = 1) {
    for (let i = 0; i < 9; i++) { const a = Math.PI + i * Math.PI / 8; El(ctx, x + Math.cos(a) * 110 * s, y + 8 * s + Math.sin(a) * -10 * s, 30 * s, 20 * s, ['#9AA3B8', '#B8C2CC'][i % 2], 6); }
    ctx.save(); ctx.translate(x, y); ctx.rotate(.35); B(ctx, -110 * s, -18 * s, 220 * s, 36 * s, 18 * s, '#8A5A2B', 7); ctx.restore();
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.35); B(ctx, -110 * s, -18 * s, 220 * s, 36 * s, 18 * s, '#9C6A36', 7); ctx.restore();
    const fl = (ox, h, w, col, lw, ph) => {
      const f = noise1(T * 7 + ph) * .18, sw = noise1(T * 5 + ph + 9) * 14 * s;
      const H = h * s * (1 + f), Wd = w * s;
      ctx.beginPath(); ctx.moveTo(x + ox - Wd, y - 6 * s);
      ctx.bezierCurveTo(x + ox - Wd * 1.1, y - H * .5, x + ox - Wd * .2 + sw, y - H * .7, x + ox + sw * 1.4, y - H);
      ctx.bezierCurveTo(x + ox + Wd * .3 + sw, y - H * .6, x + ox + Wd * 1.1, y - H * .45, x + ox + Wd, y - 6 * s); ctx.closePath();
      fillStroke(ctx, col, lw);
    };
    fl(-34 * s, 170, 46, '#FF5B2E', 7, 1); fl(34 * s, 160, 46, '#FF5B2E', 7, 4); fl(0, 240, 70, '#FF5B2E', 8, 2);
    fl(0, 185, 50, '#FF9A28', 0, 3); fl(-28 * s, 120, 28, '#FF9A28', 0, 5); fl(28 * s, 115, 28, '#FF9A28', 0, 6);
    fl(0, 120, 30, '#FFE066', 0, 7);
    for (let i = 0; i < 8; i++) { const u = mod(T * .8 + i / 8, 1); const sx = x + Math.sin(i * 2.3 + u * 6) * 50 * s, sy = y - 160 * s - u * 380 * s;
      ctx.save(); ctx.globalAlpha = 1 - u; circle(ctx, sx, sy, 6 * s * (1 - u * .5), '#FFD447'); ctx.restore(); }
  }
  envCampsite = function (ctx, T, cam, o = {}) {
    const nt = setNight(o, true);
    if (nt) { sky(ctx, '#0A0E35', '#40307A', -300, 1250); stars(ctx, T, cam, 140, 9, -700, 1000); withPar(ctx, cam, .1, () => moon(ctx, 830, 300, 70));
      const u = mod(T, 7) / 1.1; if (u < 1) { const { dx } = par(cam, .1); const sx = -100 + u * 700 + dx, sy = 120 + u * 260; ctx.save(); const g2 = ctx.createLinearGradient(sx - 200, sy - 75, sx, sy); g2.addColorStop(0, 'rgba(255,255,255,0)'); g2.addColorStop(1, `rgba(255,255,255,${1 - u})`); ctx.strokeStyle = g2; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(sx - 200, sy - 75); ctx.lineTo(sx, sy); ctx.stroke(); ctx.restore(); } }
    else { sky(ctx, '#4DB3F0', '#D2F0FF', -300, 1250); withPar(ctx, cam, .1, () => sun(ctx, 830, 280, 84, T)); clouds(ctx, T, cam, .25, 5, 51, 120, 460); }
    // mountains
    withPar(ctx, cam, .2, () => {
      const pk = [[-900, 560], [-500, 700], [-120, 520], [300, 680], [700, 500], [1100, 650], [1500, 540], [1900, 690], [2300, 560]];
      for (const [x, h] of pk) { poly(ctx, [[x - 420, 1150], [x, 1150 - h], [x + 420, 1150]]); FS(ctx, '#7C8FD0', 8);
        poly(ctx, [[x - 118, 1150 - h * .72], [x, 1150 - h], [x + 118, 1150 - h * .72], [x + 50, 1150 - h * .78], [x, 1150 - h * .7], [x - 50, 1150 - h * .78]]); FS(ctx, '#F2F6FF', 0); }
    });
    withPar(ctx, cam, .45, () => { for (let i = -8; i < 22; i++) pine(ctx, -900 + i * 130 + hash(i) * 50, 1260, .75 + hash(i + 3) * .25, '#2F7F5B', false, 6); });
    ground(ctx, '#5FAE48', 1240);
    withPar(ctx, cam, .7, () => { for (let i = -6; i < 16; i++) { const x = -700 + i * 190 + hash(i * 7) * 60; if (x > 300 && x < 780) continue; pine(ctx, x, 1360, 1.05 + hash(i + 11) * .35, '#2F9A55', false, 7); } });
    ctx.fillStyle = N('#6DBB4F'); ctx.fillRect(-3000, 1330, 9000, 2700); ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 1327, 9000, 6);
    // dirt clearing
    El(ctx, 540, 1640, 820, 230, '#C9A06A', 0); El(ctx, 540, 1640, 640, 170, '#D6AE76', 0);
    for (let i = 0; i < 26; i++) { const x = -700 + hash(i * 2.9) * 2600, y = 1350 + hash(i * 5.1) * 120; ln(ctx, x, y, x - 8, y - 22, '#4D9A3C', 6); ln(ctx, x, y, x + 8, y - 20, '#4D9A3C', 6); }
    // tents
    tent(ctx, -20, 1440, 420, 330, '#FF8528');
    tent(ctx, 1110, 1440, 440, 340, '#30CE65');
    // lantern on a post (right of left tent)
    bar(ctx, 205, 1440, 205, 1180, '#7A4A22', 8, 4); bar(ctx, 205, 1180, 245, 1180, '#7A4A22', 6, 4);
    B(ctx, 225, 1190, 40, 56, 8, nt ? '#FFE08A' : '#FFF3C4', 6); if (nt) glow(ctx, 245, 1218, 140, '255,210,120', .5);
    // logs
    log(ctx, 110, 1500, 230); log(ctx, 740, 1500, 230);
    // backpack + cooler
    B(ctx, 930, 1450, 120, 80, 12, '#2E9CCA', 8); B(ctx, 930, 1450, 120, 24, 10, '#FFFFFF', 7);
    // fire
    if (o.fire !== false && !o.fireFront) campfire(ctx, o.fireX ?? 540, 1590, T, .9);
    if (nt) { // fireflies + warm ground glow
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 16; i++) { const x = -300 + hash(i * 3.7) * 1700 + Math.sin(T * .7 + i) * 60, y = 1050 + hash(i * 8.1) * 350 + Math.cos(T * .9 + i * 2) * 40, a = .4 + .6 * Math.max(0, Math.sin(T * 2.5 + i * 1.9));
        ctx.globalAlpha = a; circle(ctx, x, y, 14, 'rgba(220,255,120,.35)'); circle(ctx, x, y, 5, '#F4FF9A'); }
      ctx.restore();
      if (o.fire !== false) { const f = 1 + noise1(T * 6) * .08; glow(ctx, o.fireX ?? 540, 1520, 620 * f, '255,150,60', .38); }
    }
  };
  envCampsiteFront = function (ctx, T, cam, o = {}) {
    setNight(o, true);
    const x = o.fireX ?? 540;
    campfire(ctx, x, 1590, T, .9);
    if (NIGHT) glow(ctx, x, 1480, 260, '255,190,90', .3);
  };

  // ================================================================= 6. SNOWY STREET
  function house(ctx, x, w, h, wall, roof, T, i) {
    const base = 1340, top = base - h, lit = NIGHT;
    B(ctx, x + w * .62, top - 200, 54, 150, 6, '#B3263A', 8); B(ctx, x + w * .62 - 8, top - 210, 70, 22, 8, '#FFFFFF', 6);
    for (let k = 0; k < 4; k++) { const u = mod(T * .35 + k / 4, 1); ctx.save(); ctx.globalAlpha = (1 - u) * .7; circle(ctx, x + w * .62 + 27 + Math.sin(u * 5 + i) * 26, top - 230 - u * 260, 20 + u * 34, NIGHT ? '#8A90C0' : '#FFFFFF'); ctx.restore(); }
    B(ctx, x, top, w, h, 10, wall, 9);
    for (let k = 1; k < 6; k++) { ctx.fillStyle = 'rgba(0,0,0,.06)'; ctx.fillRect(x + 6, top + k * h / 6, w - 12, 5); }
    poly(ctx, [[x - 40, top + 10], [x + w / 2, top - 210], [x + w + 40, top + 10]]); FS(ctx, roof, 9);
    // snow on roof
    ctx.beginPath(); ctx.moveTo(x - 46, top + 14); ctx.lineTo(x + w / 2, top - 222); ctx.lineTo(x + w + 46, top + 14);
    for (let k = 0; k <= 8; k++) { const px = x + w + 46 - k * (w + 92) / 8, py = top + 14 + (k % 2 ? 22 : 6); ctx.lineTo(px, py); }
    ctx.closePath(); FS(ctx, '#FFFFFF', 8);
    for (let k = 0; k < 6; k++) { const ix = x - 20 + k * (w + 40) / 5; poly(ctx, [[ix - 7, top + 22], [ix + 7, top + 22], [ix, top + 50 + (k % 3) * 10]]); FS(ctx, '#CFEFFF', 4); }
    // windows + door
    const win = (wx, wy) => { B(ctx, wx, wy, 100, 100, 10, lit ? '#FFD98A' : '#BDE8FF', 8); ctx.fillStyle = OUTLINE; ctx.fillRect(wx + 46, wy, 8, 100); ctx.fillRect(wx, wy + 46, 100, 8); if (lit) glow(ctx, wx + 50, wy + 50, 150, '255,200,110', .35); B(ctx, wx - 8, wy + 96, 116, 20, 8, '#FFFFFF', 6); };
    win(x + 34, top + 50); if (w > 300) win(x + w - 134, top + 50);
    B(ctx, x + w / 2 - 50, base - 170, 100, 170, 12, shade(wall, -.35), 8);
    Ci(ctx, x + w / 2 + 28, base - 84, 7, '#FFD447', 3);
    ctx.beginPath(); ctx.arc(x + w / 2, base - 130, 26, 0, TAU); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 22; ctx.stroke(); ctx.strokeStyle = N('#30A045'); ctx.lineWidth = 12; ctx.stroke();
    Ci(ctx, x + w / 2, base - 104, 9, '#EE384A', 4);
  }
  function snowman(ctx, x, y, T) {
    blob(ctx, [[x, y - 95, 100], [x, y - 245, 76], [x, y - 360, 56]], '#FFFFFF', 8);
    ctx.fillStyle = 'rgba(120,160,220,.18)'; ctx.beginPath(); ctx.arc(x + 20, y - 80, 80, 0, TAU); ctx.fill();
    bar(ctx, x - 70, y - 260, x - 125, y - 340, '#7A4A22', 7, 4); bar(ctx, x + 70, y - 260, x + 165, y - 320, '#7A4A22', 7, 4); bar(ctx, x + 140, y - 305, x + 150, y - 345, '#7A4A22', 5, 3);
    Ci(ctx, x - 20, y - 372, 8, OUTLINE); Ci(ctx, x + 20, y - 372, 8, OUTLINE);
    poly(ctx, [[x - 4, y - 360], [x + 62, y - 348], [x - 4, y - 344]]); FS(ctx, '#FF8528', 5);
    for (let k = 0; k < 5; k++) { const a = .35 + k * .1; Ci(ctx, x - 30 + k * 15, y - 330 + Math.sin(a * 6) * 4 + Math.abs(k - 2) * -3 + 6, 5, OUTLINE); }
    for (let k = 0; k < 3; k++) Ci(ctx, x, y - 280 + k * 45, 9, OUTLINE);
    B(ctx, x - 70, y - 312, 140, 30, 14, '#EE384A', 7);
    ctx.save(); ctx.translate(x + 40, y - 296); ctx.rotate(.2 + Math.sin(T * 3) * .12); B(ctx, -14, 0, 28, 90, 10, '#EE384A', 7); ctx.restore();
    B(ctx, x - 70, y - 420, 140, 20, 6, '#24225B', 7); B(ctx, x - 44, y - 500, 88, 84, 10, '#24225B', 7); B(ctx, x - 44, y - 440, 88, 16, 4, '#EE384A', 0);
  }
  envSnowyStreet = function (ctx, T, cam, o = {}) {
    const nt = setNight(o);
    if (nt) { sky(ctx, '#121845', '#3F3A88', -300, 1250); stars(ctx, T, cam, 70); withPar(ctx, cam, .1, () => moon(ctx, 860, 240, 62)); }
    else sky(ctx, '#8ECFF5', '#E8F7FF', -300, 1250);
    clouds(ctx, T, cam, .25, 5, 61, 100, 420, 1, nt ? .3 : .9);
    hills(ctx, cam, .3, 1080, 70, '#E3F0FF', 2.1, 8);
    withPar(ctx, cam, .5, () => { for (let i = -6; i < 16; i++) pine(ctx, -700 + i * 210 + hash(i) * 70, 1140, .7 + hash(i * 3) * .2, '#2F8F6B', true, 6); });
    // houses
    const H = [[-860, 400, 470, '#2E9CCA', '#7B4BFF'], [-420, 400, 520, '#EE384A', '#4A3A6A'], [30, 390, 470, '#FFD447', '#2E9CCA'], [480, 420, 540, '#30CE65', '#B3263A'], [960, 380, 480, '#FF8A5C', '#4A3A6A'], [1400, 400, 500, '#20BDBB', '#7B4BFF']];
    H.forEach(([x, w, h, wall, roof], i) => house(ctx, x, w, h, wall, roof, T, i));
    // snowbank + ground
    ground(ctx, '#EEF6FF', 1330);
    const bank = []; for (let x = -3000; x < 6000; x += 90) bank.push([x, 1345 + Math.sin(x * .03) * 8, 50]);
    blob(ctx, bank, '#FFFFFF', 7); ctx.fillStyle = N('#EEF6FF'); ctx.fillRect(-3000, 1345, 9000, 60);
    ctx.fillStyle = N('#D9E9FA'); for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.ellipse(-700 + i * 330, 1560 + (i % 3) * 90, 180, 26, 0, 0, TAU); ctx.fill(); }
    // sled tracks
    ctx.strokeStyle = N('#C8DDF2'); ctx.lineWidth = 8; ctx.beginPath(); for (const off of [0, 40]) { ctx.moveTo(-600, 1700 + off); ctx.quadraticCurveTo(200, 1620 + off, 420, 1640 + off); } ctx.stroke();
    // street lamp
    bar(ctx, 150, 1420, 150, 790, '#24225B', 12, 6); B(ctx, 112, 740, 76, 70, 18, nt ? '#FFE9A8' : '#E8F2F7', 7); B(ctx, 100, 726, 100, 22, 10, '#24225B', 6);
    blob(ctx, [[150, 722, 30]], '#FFFFFF', 5);
    if (nt) { glow(ctx, 150, 790, 360, '255,220,140', .45); }
    B(ctx, 120, 1410, 60, 24, 8, '#24225B', 6);
    // snowman + sled
    snowman(ctx, 965, 1545, T);
    ctx.save(); ctx.translate(140, 1595); ctx.rotate(-.04);
    B(ctx, -110, -40, 220, 34, 12, '#EE384A', 8);
    ctx.beginPath(); ctx.moveTo(-120, 10); ctx.lineTo(100, 10); ctx.quadraticCurveTo(140, 10, 136, -30); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = N('#B8C2CC'); ctx.lineWidth = 7; ctx.stroke();
    for (const sx of [-70, 50]) ln(ctx, sx, -8, sx, 10, OUTLINE, 6);
    ctx.restore();
    if (o.snow !== false) { snowfall(ctx, T, cam, 110, 5, 4, 9, 120, .9); }
  };
  envSnowyStreetFront = function (ctx, T, cam, o = {}) { snowfall(ctx, T, cam, 26, 99, 9, 15, 230, .95); };

  // ================================================================= 7. SOCCER FIELD
  envSoccerField = function (ctx, T, cam, o = {}) {
    const nt = setNight(o);
    if (nt) { sky(ctx, '#0C1042', '#2E2A72', -300, 1000); stars(ctx, T, cam, 50); }
    else { sky(ctx, '#3FAEF0', '#C8EEFF', -300, 1000); clouds(ctx, T, cam, .25, 5, 71, 100, 380); }
    // floodlights
    withPar(ctx, cam, .8, () => { for (const x of [-180, 1280]) {
      bar(ctx, x, 1000, x, 260, '#B8C2CC', 16, 6); B(ctx, x - 100, 160, 200, 120, 14, '#24225B', 8);
      for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) Ci(ctx, x - 62 + c * 62, 196 + r * 50, 20, nt ? '#FFFDE8' : '#E8F2F7', 5);
      if (nt) { glow(ctx, x, 220, 340, '255,250,220', .55); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, 260, 0, 1600); g.addColorStop(0, 'rgba(255,250,220,.18)'); g.addColorStop(1, 'rgba(255,250,220,0)'); ctx.fillStyle = g; poly(ctx, [[x - 60, 260], [x + 60, 260], [540 + (x - 540) * .2 + 500, 1700], [540 + (x - 540) * .2 - 500, 1700]]); ctx.fill(); ctx.restore(); }
    } });
    // scoreboard
    withPar(ctx, cam, .85, () => {
      for (const x of [700, 900]) bar(ctx, x, 500, x, 900, '#B8C2CC', 12, 5);
      B(ctx, 580, 250, 440, 260, 22, '#24225B', 10); B(ctx, 600, 270, 400, 54, 12, '#3B3A80', 0);
      txt(ctx, o.home || 'HOME', 690, 298, 40, '#FFFFFF'); txt(ctx, o.away || 'AWAY', 910, 298, 40, '#FFFFFF');
      txt(ctx, o.score || '2 - 1', 800, 400, 104, '#FFD447', OUTLINE, 10);
      txt(ctx, (o.clock || '45:00'), 800, 476, 30, '#FF8528');
    });
    // bleachers
    ctx.fillStyle = N('#5A5F9A'); ctx.fillRect(-3000, 880, 9000, 400);
    const rows = 5;
    for (let j = 0; j < rows; j++) {
      const y = 900 + j * 66; B(ctx, -3000, y, 9000, 66, 0, j % 2 ? '#2E9CCA' : '#20BDBB', 6);
      ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(-3000, y + 6, 9000, 8);
      const step = 76;
      for (let i = 0; i < 40; i++) {
        const x = -700 + i * step + (j % 2) * 38; const id = i * 7 + j * 131;
        if (hash(id) < .45) continue;
        fan(ctx, x, y + 50, .78, id, T, o.cheer ? 1 : 0);
      }
    }
    // ad boards
    const ads = [['GO TEAM!', '#EE384A'], ['GOAL!', '#FF8528'], ['NUBI FC', '#7B4BFF'], ['PLAY FAIR', '#30A045'], ['SNACKS', '#FF5B9B'], ['GO TEAM!', '#2E9CCA']];
    for (let i = -4; i < 12; i++) B(ctx, i * 300 - 60, 1230, 300, 90, 0, ads[mod(i, ads.length)][1], 7);
    for (let i = -4; i < 12; i++) { const s = ads[mod(i, ads.length)][0]; txt(ctx, s, i * 300 + 90, 1277, Math.min(44, 380 / s.length), N('#FFFFFF')); }
    // pitch stripes
    let y = 1320, k = 0, hgt = 50; while (y < 4000) { ctx.fillStyle = N(k % 2 ? '#56B848' : '#62C552'); ctx.fillRect(-3000, y, 9000, hgt); y += hgt; hgt *= 1.32; k++; }
    ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 1317, 9000, 6);
    // lines
    ctx.strokeStyle = N('#FFFFFF'); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-3000, 1352); ctx.lineTo(6000, 1352);
    ctx.moveTo(540, 1352); ctx.lineTo(540, 4000); ctx.stroke();
    ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(540, 1700, 480, 150, 0, 0, TAU); ctx.stroke();
    El(ctx, 540, 1700, 18, 7, '#FFFFFF');
    if (nt) { glow(ctx, 540, 1650, 900, '170,255,170', .16); }
    // goal (left)
    { const gx0 = -300, gx1 = 190, gy0 = 1020, gy1 = 1505, bx0 = -250, bx1 = 140, by0 = 1080, by1 = 1400;
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 3; ctx.beginPath();
      for (let i = 0; i <= 12; i++) { const u = i / 12; ctx.moveTo(lerp(bx0, bx1, u), by0); ctx.lineTo(lerp(bx0, bx1, u), by1); ctx.moveTo(lerp(gx0, gx1, u), gy0); ctx.lineTo(lerp(bx0, bx1, u), by0); }
      for (let i = 0; i <= 10; i++) { const u = i / 10; ctx.moveTo(bx0, lerp(by0, by1, u)); ctx.lineTo(bx1, lerp(by0, by1, u)); ctx.moveTo(gx0, lerp(gy0, gy1, u)); ctx.lineTo(bx0, lerp(by0, by1, u)); ctx.moveTo(gx1, lerp(gy0, gy1, u)); ctx.lineTo(bx1, lerp(by0, by1, u)); }
      ctx.stroke(); ctx.restore();
      bar(ctx, bx0, by0, bx1, by0, '#E8F2F7', 6, 4); bar(ctx, gx0, gy0, bx0, by0, '#E8F2F7', 6, 4); bar(ctx, gx1, gy0, bx1, by0, '#E8F2F7', 6, 4);
      bar(ctx, gx0, gy1, gx0, gy0, '#FFFFFF', 18, 6); bar(ctx, gx1, gy1, gx1, gy0, '#FFFFFF', 18, 6); bar(ctx, gx0, gy0, gx1, gy0, '#FFFFFF', 18, 6); }
    // ball
    if (o.ball !== false) { const bx = 1010, by = 1600; ellipse(ctx, bx, by + 40, 50, 10, 'rgba(0,0,0,.2)'); Ci(ctx, bx, by, 42, '#FFFFFF', 7);
      for (const [ox, oy, r] of [[0, 0, 13], [-26, -22, 9], [26, -22, 9], [-28, 20, 9], [28, 20, 9]]) { starPath(ctx, bx + ox, by + oy, r, r * .8, 5, 0); FS(ctx, '#24225B', 0); } }
    // corner flag
    flag(ctx, 1400, 1180, T, '#FFD447', 1); bar(ctx, 1400, 1180, 1400, 1360, '#FFFFFF', 6, 4);
  };

  // ================================================================= 8. DOWNTOWN
  function shop(ctx, x, w, h, wall, awn, sign, signCol, T, deco) {
    const base = 1360, top = base - h, lit = NIGHT;
    B(ctx, x, top, w, h, 6, wall, 9);
    B(ctx, x - 14, top - 26, w + 28, 40, 8, shade(wall, -.25), 8);
    // upper windows
    const nW = Math.max(2, Math.floor(w / 130));
    for (let i = 0; i < nW; i++) for (let r = 0; r < Math.floor((h - 420) / 140); r++) {
      const wx = x + (w - nW * 100) / (nW + 1) * (i + 1) + i * 100, wy = top + 40 + r * 140, on = lit && hash(i * 13 + r * 7 + x) > .3;
      B(ctx, wx, wy, 100, 100, 10, on ? '#FFD98A' : '#BDE8FF', 7); ctx.fillStyle = OUTLINE; ctx.fillRect(wx + 46, wy, 8, 100);
      if (on) glow(ctx, wx + 50, wy + 50, 120, '255,200,110', .3);
    }
    // sign
    B(ctx, x + 30, base - 410, w - 60, 90, 16, signCol, 8);
    txt(ctx, sign, x + w / 2, base - 362, Math.min(70, (w - 90) / sign.length * 1.7), lit ? '#FFF6C8' : '#FFFFFF', OUTLINE, 8);
    if (lit) glow(ctx, x + w / 2, base - 365, w * .6, '255,170,220', .3);
    // awning
    const ay = base - 310; ctx.save(); rr(ctx, x + 10, ay, w - 20, 60, 6); ctx.clip();
    for (let i = 0; i * 50 < w; i++) { ctx.fillStyle = N(i % 2 ? '#FFFFFF' : awn); ctx.fillRect(x + 10 + i * 50, ay, 50, 60); } ctx.restore();
    rr(ctx, x + 10, ay, w - 20, 60, 6); FS(ctx, null, 8);
    ctx.beginPath(); for (let i = 0; i * 50 < w - 20; i++) ctx.arc(x + 35 + i * 50, ay + 60, 25, 0, Math.PI); FS(ctx, awn, 7);
    // shop window + door
    const dw = 100, wx = x + 30, ww = w - 60 - dw - 20;
    B(ctx, wx, base - 230, ww, 200, 10, lit ? '#FFE9A8' : '#BDE8FF', 8);
    if (!lit) { ctx.fillStyle = 'rgba(255,255,255,.5)'; poly(ctx, [[wx + 20, base - 220], [wx + 60, base - 220], [wx + 10, base - 120], [wx + 10, base - 160]]); ctx.fill(); }
    if (deco) deco(wx, base - 230, ww, 200);
    B(ctx, x + w - 30 - dw, base - 240, dw, 240, 10, shade(wall, -.3), 8); B(ctx, x + w - 30 - dw + 16, base - 220, dw - 32, 110, 6, lit ? '#FFE9A8' : '#BDE8FF', 5);
    if (lit) glow(ctx, wx + ww / 2, base - 130, ww * .8, '255,220,140', .35);
  }
  envDowntown = function (ctx, T, cam, o = {}) {
    const nt = setNight(o);
    if (nt) { sky(ctx, '#0E1240', '#4A2A80', -300, 1100); stars(ctx, T, cam, 50); withPar(ctx, cam, .1, () => moon(ctx, 880, 200, 56)); }
    else { sky(ctx, '#45B2F2', '#D6F2FF', -300, 1100); withPar(ctx, cam, .1, () => sun(ctx, 930, 230, 74, T)); }
    clouds(ctx, T, cam, .2, 5, 81, 80, 360, .9, nt ? .25 : 1);
    // skyline
    withPar(ctx, cam, .35, () => {
      const r = rng(8); let x = -1700;
      while (x < 2900) { const w = 150 + r() * 160, h = 380 + r() * 520, c = ['#8FA8E8', '#A99BE6', '#7FC4E8', '#9DB4F0'][Math.floor(r() * 4)];
        B(ctx, x, 1150 - h, w, h + 100, 6, c, 7);
        if (r() < .3) { bar(ctx, x + w / 2, 1150 - h, x + w / 2, 1150 - h - 90, '#C8D2E8', 5, 4); if (nt) circle(ctx, x + w / 2, 1150 - h - 92, 7, '#FF5B5B'); }
        for (let yy = 1150 - h + 30; yy < 1060; yy += 56) for (let xx = x + 20; xx < x + w - 30; xx += 40) { const on = nt ? hash(xx * .7 + yy * 1.3) > .45 : true; ctx.fillStyle = on ? (nt ? '#FFD98A' : 'rgba(255,255,255,.45)') : 'rgba(0,0,0,.15)'; ctx.fillRect(xx, yy, 20, 28); }
        x += w + 20 + r() * 40; }
    });
    // shops
    shop(ctx, -930, 440, 760, '#9C8CD8', '#7B4BFF', 'BAKERY', '#FF8528', T);
    shop(ctx, -470, 440, 660, '#E86A4A', '#30A045', 'PIZZA', '#EE384A', T, (wx, wy, ww) => {
      for (let i = 0; i < 2; i++) { const px = wx + 70 + i * 120, py = wy + 110; ctx.beginPath(); ctx.moveTo(px - 40, py - 50); ctx.lineTo(px + 40, py - 50); ctx.lineTo(px, py + 50); ctx.closePath(); FS(ctx, '#FFD447', 6); Ci(ctx, px - 10, py - 20, 10, '#EE384A'); Ci(ctx, px + 12, py - 30, 9, '#EE384A'); Ci(ctx, px, py + 6, 8, '#EE384A'); B(ctx, px - 46, py - 64, 92, 18, 9, '#E8A050', 5); }
    });
    // pizza slice on sign
    ctx.save(); ctx.translate(-30, 830); ctx.rotate(.3); poly(ctx, [[-50, -60], [50, -60], [0, 70]]); FS(ctx, '#FFD447', 7); B(ctx, -56, -76, 112, 24, 12, '#E8A050', 7); Ci(ctx, -12, -30, 12, '#EE384A', 4); Ci(ctx, 14, -16, 10, '#EE384A', 4); Ci(ctx, 0, 14, 9, '#EE384A', 4); ctx.restore();
    shop(ctx, -10, 530, 720, '#2E9CCA', '#FFD447', 'TOYS', '#7B4BFF', T, (wx, wy, ww) => {
      const bx = wx + 50, by = wy + 190; // teddy
      blob(ctx, [[bx + 10, by - 110, 22], [bx + 70, by - 110, 22]], '#C98B4B', 5); Ci(ctx, bx + 40, by - 80, 46, '#C98B4B', 6); El(ctx, bx + 40, by - 20, 52, 40, '#C98B4B', 6); El(ctx, bx + 40, by - 68, 16, 12, '#F4E3C3', 0); Ci(ctx, bx + 26, by - 92, 5, OUTLINE); Ci(ctx, bx + 54, by - 92, 5, OUTLINE);
      for (let i = 0; i < 3; i++) B(ctx, wx + 170 + i * 52, wy + 140, 48, 48, 6, PAL[i * 2], 5);
      B(ctx, wx + 196, wy + 92, 48, 48, 6, '#30CE65', 5);
      const rx = wx + ww - 50; ctx.save(); ctx.translate(rx, wy + 100 + Math.sin(T * 2) * 6); poly(ctx, [[-20, 40], [-20, -20], [0, -55], [20, -20], [20, 40]]); FS(ctx, '#FFFFFF', 6); Ci(ctx, 0, -4, 9, '#2E9CCA', 4); poly(ctx, [[-20, 20], [-36, 46], [-20, 40]]); FS(ctx, '#EE384A', 5); poly(ctx, [[20, 20], [36, 46], [20, 40]]); FS(ctx, '#EE384A', 5); ctx.restore();
    });
    // colourful TOYS letters already on sign; ice cream
    shop(ctx, 540, 480, 680, '#FFB3D1', '#FF5B9B', 'ICE CREAM', '#20BDBB', T, (wx, wy, ww) => {
      for (let i = 0; i < 3; i++) { const cx = wx + 50 + i * (ww - 100) / 2, cy = wy + 120; poly(ctx, [[cx - 24, cy], [cx + 24, cy], [cx, cy + 70]]); FS(ctx, '#E8A050', 5); blob(ctx, [[cx, cy - 18, 28]], ['#FFB3D1', '#FFF3D6', '#9B5A3C'][i], 5); }
    });
    // giant cone on roof
    { const cx = 780, cy = 590, b = Math.sin(T * 2) * 4; poly(ctx, [[cx - 60, cy + b], [cx + 60, cy + b], [cx, cy + 150]]); FS(ctx, '#E8A050', 8);
      ctx.strokeStyle = 'rgba(120,70,20,.4)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - 40, cy + 20); ctx.lineTo(cx + 20, cy + 100); ctx.moveTo(cx + 40, cy + 20); ctx.lineTo(cx - 20, cy + 100); ctx.stroke();
      blob(ctx, [[cx - 34, cy - 20 + b, 44], [cx + 34, cy - 20 + b, 44], [cx, cy - 70 + b, 52]], '#FF8AC0', 8); Ci(ctx, cx, cy - 136 + b, 18, '#EE384A', 6);
      for (let i = 0; i < 6; i++) { ctx.fillStyle = N(PAL[i]); ctx.fillRect(cx - 40 + i * 15, cy - 60 + b + (i % 2) * 20, 9, 4); } }
    shop(ctx, 1040, 420, 700, '#30CE65', '#2E9CCA', 'BOOKS', '#FF8528', T, (wx, wy, ww) => { for (let i = 0; i < 8; i++) B(ctx, wx + 20 + i * 24, wy + 110 - (i % 3) * 12, 20, 80 + (i % 3) * 12, 3, PAL[i], 4); });
    // sidewalk
    ground(ctx, '#D9D4CC', 1360);
    ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 1357, 9000, 6);
    ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 5; ctx.beginPath();
    for (let i = -20; i < 30; i++) { ctx.moveTo(i * 200, 1360); ctx.lineTo(i * 200 + (i * 200 - cam.x) * .25, 1560); } ctx.moveTo(-3000, 1450); ctx.lineTo(6000, 1450); ctx.stroke();
    // curb + road
    B(ctx, -3000, 1556, 9000, 32, 0, '#B8B2A8', 7);
    ctx.fillStyle = N('#55596E'); ctx.fillRect(-3000, 1590, 9000, 2400);
    // crosswalk
    let cy = 1610, ch = 26; for (let k = 0; k < 7; k++) { const half = 300 + k * 60; ctx.fillStyle = N('#E4E6EE'); ctx.fillRect(540 - half, cy, half * 2, ch); cy += ch * 2.1; ch *= 1.3; }
    ctx.fillStyle = N('#FFD447'); for (let i = -20; i < 40; i++) { if (Math.abs(i * 220 - 540) < 450) continue; ctx.fillRect(i * 220, 1930, 130, 18); }
    // car
    if (o.car) { const cx = -1100 + mod(T * 520, 2900), cyy = 1760;
      B(ctx, cx - 160, cyy - 100, 320, 100, 30, '#EE384A', 9); B(ctx, cx - 90, cyy - 170, 190, 80, 26, '#EE384A', 9); B(ctx, cx - 70, cyy - 154, 70, 54, 10, '#BDE8FF', 6); B(ctx, cx + 10, cyy - 154, 70, 54, 10, '#BDE8FF', 6);
      for (const wx of [-90, 90]) { Ci(ctx, cx + wx, cyy, 40, '#24225B', 8); Ci(ctx, cx + wx, cyy, 16, '#B8C2CC', 5); }
      B(ctx, cx + 140, cyy - 80, 24, 20, 6, '#FFE9A8', 5); }
    // traffic light (x 40)
    { const x = 40; bar(ctx, x, 1560, x, 830, '#3A3A55', 14, 6); B(ctx, x - 50, 780, 100, 250, 18, '#24225B', 9);
      const ph = Math.floor(mod(T, 9) / 3), cols = [['#EE384A', 2], ['#FFD447', 1], ['#30CE65', 0]];
      cols.forEach(([c, idx], i) => { const on = idx === ph; Ci(ctx, x, 830 + i * 75, 28, on ? c : shade(N(c), -.55), 6); if (on) glow(ctx, x, 830 + i * 75, 90, c === '#EE384A' ? '255,80,80' : c === '#FFD447' ? '255,220,80' : '80,255,120', .5); }); }
    // hydrant
    { const x = 960; B(ctx, x - 30, 1440, 60, 100, 12, '#EE384A', 8); B(ctx, x - 40, 1420, 80, 30, 10, '#EE384A', 8); Ci(ctx, x, 1416, 22, '#EE384A', 7); B(ctx, x - 50, 1470, 100, 24, 8, '#C42A3A', 7); B(ctx, x - 44, 1532, 88, 22, 6, '#C42A3A', 7); }
    // bus stop
    { const x = 1120; B(ctx, x, 1100, 300, 30, 10, '#2E9CCA', 8); bar(ctx, x + 20, 1130, x + 20, 1520, '#B8C2CC', 8, 4); bar(ctx, x + 280, 1130, x + 280, 1520, '#B8C2CC', 8, 4);
      ctx.save(); ctx.globalAlpha = .45; B(ctx, x + 30, 1140, 240, 220, 8, '#CFEFFF', 0); ctx.restore(); rr(ctx, x + 30, 1140, 240, 220, 8); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 6; ctx.stroke();
      B(ctx, x + 40, 1400, 220, 26, 8, '#FF8528', 7); bar(ctx, x + 70, 1426, x + 70, 1500, '#3A3A55', 6, 3); bar(ctx, x + 230, 1426, x + 230, 1500, '#3A3A55', 6, 3);
      bar(ctx, x - 40, 1530, x - 40, 1050, '#3A3A55', 8, 4); Ci(ctx, x - 40, 1030, 46, '#FFFFFF', 7); txt(ctx, 'BUS', x - 40, 1032, 36, N('#2E9CCA')); }
    // street lamps
    for (const x of [-560, 1560]) { bar(ctx, x, 1550, x, 820, '#3A3A55', 12, 5); bar(ctx, x, 830, x + 70, 830, '#3A3A55', 8, 4); B(ctx, x + 40, 830, 70, 40, 12, nt ? '#FFE9A8' : '#E8F2F7', 6); if (nt) glow(ctx, x + 75, 870, 300, '255,220,140', .45); }
    // planter tree
    B(ctx, -300, 1450, 120, 100, 12, '#C98B4B', 8); roundTree(ctx, -240, 1460, .9, '#3FA34D', 7);
  };

  // ================================================================= 9. FARM
  function cow(ctx, x, y, T) { // facing left; hooves at y
    const chew = Math.sin(T * 3) * 3, tail = Math.sin(T * 2.2) * .4;
    ctx.save(); ctx.translate(x + 230, y - 170); ctx.rotate(.3 + tail); bar(ctx, 0, 0, 10, 90, '#FFFFFF', 7, 4); Ci(ctx, 12, 96, 12, '#2A1E1E', 4); ctx.restore();
    for (const lx of [50, 90, 180, 215]) B(ctx, x + lx, y - 90, 32, 90, 6, '#FFFFFF', 7);
    for (const lx of [50, 90, 180, 215]) B(ctx, x + lx, y - 20, 32, 20, 5, '#2A1E1E', 6);
    B(ctx, x + 30, y - 220, 230, 140, 30, '#FFFFFF', 8);
    ctx.save(); rr(ctx, x + 30, y - 220, 230, 140, 30); ctx.clip();
    for (const [sx, sy, r] of [[110, -200, 40], [210, -120, 46], [60, -110, 26]]) blob(ctx, [[x + sx, y + sy, r], [x + sx + 26, y + sy + 12, r * .7]], '#2A1E1E', 0);
    ctx.restore(); rr(ctx, x + 30, y - 220, 230, 140, 30); FS(ctx, null, 8);
    El(ctx, x + 140, y - 76, 30, 18, '#FFB3D1', 6);
    ctx.save(); ctx.translate(x + 30, y - 190 + chew); ctx.rotate(-.12);
    for (const s of [-1, 1]) { poly(ctx, [[s * 30 - 8, -76], [s * 50, -110], [s * 30 + 8, -70]]); FS(ctx, '#F4E3C3', 5); El(ctx, s * 66, -50, 26, 12, '#FFFFFF', 6, s * .3); }
    B(ctx, -56, -84, 112, 120, 30, '#FFFFFF', 8);
    B(ctx, -50, 0, 100, 56, 24, '#FFB3D1', 7); Ci(ctx, -20, 26, 7, '#C46A8A'); Ci(ctx, 20, 26, 7, '#C46A8A');
    Ci(ctx, -24, -36, 9, OUTLINE); Ci(ctx, 24, -36, 9, OUTLINE); Ci(ctx, -21, -39, 3, '#FFFFFF'); Ci(ctx, 27, -39, 3, '#FFFFFF');
    B(ctx, 4, -84, 52, 34, 14, '#2A1E1E', 0);
    ctx.restore();
  }
  function chicken(ctx, x, y, T, ph, flip = 1) {
    const peck = Math.max(0, Math.sin(T * 3 + ph)) ** 6;
    ctx.save(); ctx.translate(x, y); ctx.scale(flip, 1);
    ln(ctx, -10, -20, -12, 0, '#FF8528', 5); ln(ctx, 10, -20, 12, 0, '#FF8528', 5);
    blob(ctx, [[0, -46, 34], [24, -60, 18]], '#FFFFFF', 6);
    poly(ctx, [[-30, -60], [-50, -82], [-40, -52]]); FS(ctx, '#FFFFFF', 5);
    ctx.save(); ctx.translate(-22, -70); ctx.rotate(-peck * 1.1);
    Ci(ctx, 0, -14, 20, '#FFFFFF', 6); ctx.fillStyle = N('#FFFFFF'); ctx.beginPath(); ctx.arc(0, -14, 18, 0, TAU); ctx.fill();
    blob(ctx, [[2, -38, 8], [-8, -36, 7]], '#EE384A', 4); poly(ctx, [[-18, -16], [-34, -10], [-18, -6]]); FS(ctx, '#FFD447', 4); Ci(ctx, -6, -18, 4, OUTLINE);
    ctx.restore(); ctx.restore();
  }
  envFarm = function (ctx, T, cam, o = {}) {
    const nt = setNight(o);
    skyAndSun(ctx, T, cam, 170, 250, 1150);
    clouds(ctx, T, cam, .25, 6, 91, 120, 480, 1, nt ? .3 : 1);
    // patchwork hills
    withPar(ctx, cam, .3, () => {
      const hy = x => 1060 - 70 * (.6 * Math.sin(x * .004 + 1.3) + .4 * Math.sin(x * .0105 + 3));
      ctx.beginPath(); ctx.moveTo(-3000, 4000); for (let x = -3000; x <= 6000; x += 40) ctx.lineTo(x, hy(x)); ctx.lineTo(6000, 4000); ctx.closePath(); FS(ctx, '#9EDC72', 8);
      ctx.save(); ctx.clip(); const pc = ['#C8E27A', '#E7C85A', '#86CF5E', '#B5D96A'];
      for (let i = -12; i < 22; i++) { const x = i * 220; poly(ctx, [[x, 1010], [x + 220, 1010], [x + 260, 1300], [x + 40, 1300]]); ctx.fillStyle = N(pc[mod(i, 4)]); ctx.fill(); ctx.strokeStyle = 'rgba(60,110,40,.35)'; ctx.lineWidth = 4; ctx.stroke(); }
      ctx.restore();
      ctx.beginPath(); for (let x = -3000; x <= 6000; x += 40) x === -3000 ? ctx.moveTo(x, hy(x)) : ctx.lineTo(x, hy(x)); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 8; ctx.stroke();
      for (let i = -3; i < 10; i++) roundTree(ctx, -500 + i * 330 + hash(i) * 90, 1080 + hash(i * 5) * 40, .55, '#3FA34D', 6);
    });
    // crop field
    ground(ctx, '#7CC456', 1180); ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 1177, 9000, 6);
    { let y = 1190, h = 18, k = 0; while (y < 1420) { ctx.fillStyle = N(k % 2 ? '#6FB84C' : '#8ED062'); ctx.fillRect(-3000, y, 9000, h); if (k % 2) { ctx.fillStyle = N('#4D9A3C'); for (let x = -1400 + (k * 37) % 60; x < 2700; x += 60) { ctx.beginPath(); ctx.arc(x, y + h / 2, h * .45, 0, TAU); ctx.fill(); } } y += h; h *= 1.18; k++; } }
    // windpump windmill (right)
    withPar(ctx, cam, .9, () => {
      const wx = 970, wy = 540;
      bar(ctx, wx - 70, 1380, wx - 12, wy + 40, '#B8C2CC', 10, 5); bar(ctx, wx + 70, 1380, wx + 12, wy + 40, '#B8C2CC', 10, 5);
      for (let k = 0; k < 5; k++) { const y = 1300 - k * 150, s = lerp(70, 18, (1300 - y) / 740); bar(ctx, wx - s, y, wx + s, y, '#B8C2CC', 6, 4); }
      poly(ctx, [[wx + 10, wy - 10], [wx + 190, wy - 40], [wx + 190, wy + 30], [wx + 10, wy + 10]]); FS(ctx, '#EE384A', 7);
      ctx.save(); ctx.translate(wx, wy); ctx.rotate(T * 1.3);
      for (let i = 0; i < 14; i++) { ctx.save(); ctx.rotate(i * TAU / 14); poly(ctx, [[30, -10], [170, -26], [170, 26], [30, 10]]); FS(ctx, i % 2 ? '#FFFFFF' : '#E8F2F7', 5); ctx.fillStyle = N('#EE384A'); ctx.fillRect(140, -24, 28, 48); ctx.restore(); }
      ctx.beginPath(); ctx.arc(0, 0, 172, 0, TAU); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 6; ctx.stroke();
      ctx.restore(); Ci(ctx, wx, wy, 26, '#24225B', 6);
    });
    // silo + barn (left)
    { B(ctx, -400, 820, 170, 560, 10, '#B8C2CC', 9); ctx.beginPath(); ctx.arc(-315, 822, 85, Math.PI, TAU); ctx.closePath(); FS(ctx, '#8E2A2A', 9);
      for (let k = 1; k < 6; k++) ln(ctx, -392, 820 + k * 90, -238, 820 + k * 90, '#9AA3B8', 5);
      const x0 = -220, x1 = 320, top = 960, base = 1385, mx = (x0 + x1) / 2;
      B(ctx, x0, top, x1 - x0, base - top, 6, '#D8433A', 9);
      ctx.save(); rr(ctx, x0, top, x1 - x0, base - top, 6); ctx.clip(); for (let x = x0 + 45; x < x1; x += 45) ln(ctx, x, top, x, base, '#B83A32', 5); ctx.restore();
      poly(ctx, [[x0 - 40, top + 10], [x0 + 30, 830], [mx, 730], [x1 - 30, 830], [x1 + 40, top + 10]]); FS(ctx, '#8E2A2A', 9);
      ctx.beginPath(); ctx.moveTo(x0 - 26, top + 2); ctx.lineTo(x0 + 34, 846); ctx.lineTo(mx, 752); ctx.lineTo(x1 - 34, 846); ctx.lineTo(x1 + 26, top + 2); ctx.strokeStyle = N('#FFFFFF'); ctx.lineWidth = 10; ctx.stroke();
      B(ctx, mx - 55, 830, 110, 100, 8, nt ? '#FFD98A' : '#3A1E1E', 8); if (nt) glow(ctx, mx, 880, 160); else { for (let i = 0; i < 6; i++) ln(ctx, mx - 40 + i * 16, 925, mx - 46 + i * 18, 945, '#E8C85A', 6); }
      const dx0 = mx - 140, dy0 = 1110;
      B(ctx, dx0, dy0, 280, base - dy0, 4, '#C2382F', 9);
      for (const sx of [dx0, dx0 + 140]) { ctx.strokeStyle = N('#FFFFFF'); ctx.lineWidth = 12; ctx.beginPath(); ctx.rect(sx + 8, dy0 + 8, 124, base - dy0 - 16); ctx.moveTo(sx + 8, dy0 + 8); ctx.lineTo(sx + 132, base - 8); ctx.moveTo(sx + 132, dy0 + 8); ctx.lineTo(sx + 8, base - 8); ctx.stroke(); }
      ln(ctx, mx, dy0, mx, base, OUTLINE, 7);
      ctx.strokeStyle = N('#FFFFFF'); ctx.lineWidth = 12; ctx.strokeRect(x0 + 8, top + 8, x1 - x0 - 16, base - top - 16); }
    // fence
    { const posts = []; for (let x = -3000; x < 6000; x += 150) if (x < -430 || x > 330) posts.push(x);
      for (const y of [1290, 1350]) { B(ctx, -3000, y, 2570, 20, 6, '#C98B4B', 6); B(ctx, 330, y, 5670, 20, 6, '#C98B4B', 6); }
      for (const x of posts) B(ctx, x, 1250, 26, 160, 6, '#B07840', 6); }
    ground(ctx, '#78C850', 1410); ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, 1407, 9000, 6);
    { const r = rng(23); for (let i = 0; i < 50; i++) { const x = -900 + r() * 3000, y = 1430 + r() * 600; ln(ctx, x, y, x - 8, y - 20, '#5FAE45', 6); ln(ctx, x, y, x + 8, y - 18, '#5FAE45', 6); } }
    // dirt path
    ctx.beginPath(); ctx.moveTo(40, 1410); ctx.lineTo(240, 1410); ctx.quadraticCurveTo(420, 1600, 760, 2100); ctx.lineTo(220, 2100); ctx.quadraticCurveTo(180, 1600, 40, 1410); ctx.closePath(); FS(ctx, '#D6AE76', 0);
    // hay bales
    { const hb = (x, y, w, h) => { B(ctx, x, y - h, w, h, 10, '#F2C94C', 8); ctx.strokeStyle = N('#D9A93A'); ctx.lineWidth = 5; ctx.beginPath(); for (let k = 1; k < 4; k++) { ctx.moveTo(x + 10, y - h + k * h / 4); ctx.lineTo(x + w - 10, y - h + k * h / 4); } ctx.stroke(); ln(ctx, x + w * .33, y - h, x + w * .33, y, '#B07840', 5); ln(ctx, x + w * .66, y - h, x + w * .66, y, '#B07840', 5); };
      hb(330, 1440, 170, 90); hb(500, 1440, 170, 90); hb(410, 1350, 170, 90); }
    // tractor
    { const x = 815, y = 1500, puff = mod(T * .9, 1);
      for (let k = 0; k < 3; k++) { const u = mod(T * .6 + k / 3, 1); ctx.save(); ctx.globalAlpha = (1 - u) * .6; circle(ctx, x + 155 + u * 40, y - 330 - u * 200, 14 + u * 30, NIGHT ? '#8A90C0' : '#E8EEF5'); ctx.restore(); }
      bar(ctx, x + 150, y - 260, x + 150, y - 330, '#3A3A55', 10, 4);
      B(ctx, x - 10, y - 210, 260, 100, 18, '#EE384A', 9);
      B(ctx, x + 170, y - 360, 150, 170, 14, '#EE384A', 9); B(ctx, x + 190, y - 340, 110, 80, 10, nt ? '#FFE9A8' : '#BDE8FF', 7);
      B(ctx, x + 160, y - 375, 170, 26, 10, '#FFFFFF', 8);
      ctx.fillStyle = OUTLINE; for (let k = 0; k < 3; k++) ctx.fillRect(x + 10, y - 190 + k * 22, 60, 8);
      B(ctx, x - 22, y - 160, 30, 26, 8, '#FFE9A8', 6);
      const wr = (cx, cy, r) => { Ci(ctx, cx, cy, r, '#2A2A3A', 9); Ci(ctx, cx, cy, r * .55, '#FFD447', 7); Ci(ctx, cx, cy, r * .18, '#2A2A3A'); ctx.save(); ctx.translate(cx, cy); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; for (let i = 0; i < 10; i++) { ctx.rotate(TAU / 10); ctx.beginPath(); ctx.moveTo(r * .78, 0); ctx.lineTo(r * 1.02, 0); ctx.stroke(); } ctx.restore(); };
      wr(x + 50, y - 55, 58); wr(x + 250, y - 105, 108); }
    // cow + chickens
    cow(ctx, 30, 1520, T);
    chicken(ctx, 150, 1630, T, 0, 1); chicken(ctx, 960, 1600, T, 1.7, -1); chicken(ctx, 1080, 1570, T, 3.1, 1);
  };

  registerSet('pool', envPool, 'Outdoor swimming pool: far deck w/ loungers, umbrella, lifeguard chair, diving board, water slide; near deck = FLOOR. Call envPoolFront after characters to put them IN the water (waterline y 1310 = waist-deep; o.swimmers:[x] ripples)', "{night, sign:'POOL', swimmers:[x], waterline}", ['outdoor']);
  registerSet('beach', envBeach, 'Sunny beach: animated waves + foam, boat & island on horizon, lifeguard tower (left), umbrella + towel (right), sandcastle, seagulls. Optional envBeachFront = dunes in the bottom corners', '{night}', ['outdoor']);
  registerSet('playground', envPlayground, 'Park playground: slide (left), swinging swings (right, seats y≈1320), monkey bars + bench (back), sandbox (front right)', '{night, swing:false}', ['outdoor']);
  registerSet('amusementPark', envAmusementPark, 'Fun fair: rotating ferris wheel, roller coaster w/ moving carts, striped big top, snack stand + balloons, string lights (night = glowing bulbs + fireworks)', '{night}', ['outdoor', 'city']);
  registerSet('campsite', envCampsite, 'Forest campsite (NIGHT by default): stars, moon, tents, log seats (top y≈1428), campfire at x 540 (envCampsiteFront draws it in front; pass fireFront:true)', '{day, fire:false, fireX, fireFront}', ['outdoor', 'night']);
  registerSet('snowyStreet', envSnowyStreet, 'Snowy winter street: snow-roofed houses w/ smoking chimneys, snowman (right), sled, street lamp, falling snow. envSnowyStreetFront = near flakes', '{night, snow:false}', ['outdoor']);
  registerSet('soccerField', envSoccerField, 'Soccer stadium: bleachers w/ cheering fans, ad boards, scoreboard (o.score), floodlights, goal (left), pitch lines', "{night, score:'2 - 1', home, away, clock, cheer, ball:false}", ['outdoor', 'school']);
  registerSet('downtown', envDowntown, 'City street: skyline, PIZZA / TOYS / ICE CREAM / BOOKS shops, traffic light, bus stop, crosswalk; sidewalk = FLOOR (road below)', '{night, car}', ['outdoor', 'city']);
  registerSet('farm', envFarm, 'Farm: red barn + silo, cow, chickens, hay bales, fence, crop rows, red tractor, turning windpump', '{night}', ['outdoor']);
})();


// ======================= pack_public.js =======================
// pack_public.js — PUBLIC-PLACE environment sets (school + town places).
// Loads after core.js + env.js. Every set is drawn in WORLD space: floor line y = FLOOR (1500), background filled
// x -3000..6000 / y -2000..4000, detail across x ≈ -800..1800. Characters stand on y 1500 between x ≈ 150..930 (s .8, ~420 px tall).
// Wall decor sits on a par(cam,.9) layer, floor furniture is not parallaxed. All animation is a pure function of T.
//
// SET ID         FUNCTION(S)                                  WHAT IT SHOWS / OPTIONS / KEY POSITIONS
// classroom      envClassroom + envClassroomFront             Chalkboard x 140..900 y 270..760 (o.board text, '\n' = 2 lines; o.doodles:false hides chalk doodles),
//                                                             alphabet strip y 150..240, clock (1000,330), cubbies x -360..180, teacher's desk x 780..1200 (top y 1225)
//                                                             with apple/books/globe, windows x -700..-60. FRONT: student desks o.desks = [x,...] (default [380,700]),
//                                                             desk top y 1330 (o.deskY) — kids standing at those x look SEATED at desks. o.items:false = empty desks.
// cafeteria      envCafeteria + envCafeteriaFront             Big window x -40..460, menu board x 540..1060 y 200..640 (o.board title, o.menu = ['PIZZA',...]),
//                                                             serving line x 480..1600 (sneeze guard, food pans, tray stack), trash/recycle bins x 60..240.
//                                                             FRONT: long table + bench, table top y 1345 (o.tableY), x o.x0..o.x1 (default -500..1600),
//                                                             lunch trays o.trays = [x,...] (default [380,700]).
// library        envLibrary                                   Tall bookshelves x -630..90 and x 930..1650, arched window x 300..780 y 300..880, QUIET sign
//                                                             above it (o.sign, default 'QUIET PLEASE'), low shelf x 180..900 (top 1160) with globe (850),
//                                                             reading table x -220..260 with lamp, beanbags x 940..1190 / -470..-230, round rug.
// supermarket    envSupermarket + envSupermarketFront         Freezers (blue glow) x -560..200, product shelves x 200..920 (top 520) with price tags and SALE!
//                                                             starbursts, hanging aisle sign (o.sign, default 'SNACKS'; o.aisle number), cart x 30..290,
//                                                             checkout lane x 930..1500. FRONT: checkout counter at o.x (default 700): a cashier standing at
//                                                             that x is behind the counter (top y 1330).
// doctorOffice   envDoctorOffice                              Upper cabinets x 80..600, diploma + blood-pressure gauge, exam bed x -330..220 (top 1250) with
//                                                             paper, eye chart x 720..960 y 250..770, height chart x 950..1040, poster x 1120..1420
//                                                             (o.poster, default 'WASH YOUR HANDS!'), window x 1480..1880, sink x -640..-280, scale, stool.
// birthdayParty  envBirthdayParty + envBirthdayPartyFront     Ribbon banner y 160..330 (o.text, default 'HAPPY BIRTHDAY!'), bunting, gently bobbing balloon
//                                                             clusters (x ≈ 110 / 975), window with curtains, side table x 860..1260 with cake + party hats,
//                                                             presents x -80..250, confetti on floor (o.falling:true adds falling confetti).
//                                                             FRONT: table with a cake at o.x (default 540; o.candles count, o.lit:false blows them out,
//                                                             o.cakeText) — the kid standing at that x is right behind the cake (blow-out-the-candles shot).
// movieTheater   envMovieTheater + envMovieTheaterFront       Big screen x 70..1010 y 200..720 (o.screen = colour string (plain glow) OR fn(ctx,x,y,w,h,T);
//                                                             default = cartoon rocket film; o.text on the
//                                                             screen), red curtains, flickering projector beam from (1240,40), back row of seats (top y 1235),
//                                                             aisle lights, EXIT signs. o.dark (0..1) dims the room. FRONT: row of seat backs (top y 1300,
//                                                             o.seatY), seat centres at 380 + k*160 (o.seatX0, o.seatW) so kids at x 380/540/700/860 look
//                                                             SEATED; o.popcorn = [x,...] buckets (default [540] = the empty seat between kids at 380/700).
// arcade         envArcade                                    Neon 'ARCADE' sign (o.sign) y ≈ 200, claw machine x -30..310 (moving claw, plushies), arcade
//                                                             cabinets with blinking game screens at x 340 / 560 (+ more off-frame), prize counter x 820..1300
//                                                             with plush wall and 'PRIZES' neon, HI-SCORE board (x 360..740 y 560..750), neon carpet.
// pizzeria       envPizzeria + envPizzeriaFront               Brick oven (centre x 60, fire glow), 'PIZZA' neon (o.sign), hanging lamps, menu board x 560..1050
//                                                             y 200..620 (o.board title, o.menu = [['PIZZA','$3'],...]), counter x 700..1500 with pizza display,
//                                                             back tables at x -600 / 1650. FRONT: o.kind 'table' (default; checkered table with pizza at
//                                                             o.x = 540) or 'counter' (order counter at o.x, worker stands behind it).
//
// Shot usage:  bg: (ctx, T, cam) => envClassroom(ctx, T, cam, { board: 'NO HOMEWORK!' }),
//              draw: (ctx, T) => { C(ctx, 'nubi', P({ x: 380, y: 1500, s: .8 }), {}, T); envClassroomFront(ctx, T, null, { desks: [380, 700] }); }
// Front functions ignore cam (pass the shot's cam or null). Keep characters at the front-layer x positions so they line up.
'use strict';

const _PUB_PAL = ['#EE384A', '#FF8528', '#FFD447', '#30CE65', '#20BDBB', '#2E9CCA', '#7B4BFF', '#FF5B9B'];
const _PUB_BOOK = ['#EE384A', '#FF8528', '#FFD447', '#30CE65', '#20BDBB', '#2E9CCA', '#7B4BFF', '#FF5B9B', '#8A5A2B', '#F4F0E6'];

// ---------------- shared helpers ----------------
function _pubBg(ctx, col) { ctx.fillStyle = col; ctx.fillRect(-3000, -2000, 9000, 6000); }
function _pubFloorLine(ctx) { ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - 4, 9000, 9); }
function _pubShadow(ctx, x, w, y = FLOOR + 6, a = .16) { ellipse(ctx, x, y, w / 2, 16, `rgba(20,10,40,${a})`); }
function _pubPX(X, y, cx, k = .9) { return X + (X - cx) * k * (y - FLOOR) / 900; }
function _pubFit(ctx, s, x, y, maxW, size, fill, stroke = OUTLINE, lw = 0, align = 'center') {
  ctx.font = `${size}px "Lilita One"`; const w = ctx.measureText(s).width;
  if (w > maxW) { lw *= maxW / w; size *= maxW / w; }
  txt(ctx, s, x, y, size, fill, stroke, lw, 'Lilita One', align); ctx.textAlign = 'center'; return size;
}
// Checker tile floor in perspective (vanishing toward cam.x, like the hallway floor)
function _pubChecker(ctx, cam, a, b, cell = 160, k = .9) {
  const cx = cam ? cam.x : 540;
  ctx.fillStyle = a; ctx.fillRect(-3000, FLOOR, 9000, 2600);
  const rows = []; for (let r = 0; r < 15; r++) rows.push(FLOOR + r * r * 20 + r * 34);
  ctx.fillStyle = b;
  const i0 = Math.floor((cx - 2600) / cell), i1 = Math.ceil((cx + 2600) / cell);
  ctx.beginPath();
  for (let r = 0; r < rows.length - 1; r++) for (let i = i0; i < i1; i++) {
    if ((i + r) & 1) continue;
    const X0 = i * cell, X1 = X0 + cell, y0 = rows[r], y1 = rows[r + 1];
    ctx.moveTo(_pubPX(X0, y0, cx, k), y0); ctx.lineTo(_pubPX(X1, y0, cx, k), y0); ctx.lineTo(_pubPX(X1, y1, cx, k), y1); ctx.lineTo(_pubPX(X0, y1, cx, k), y1); ctx.closePath();
  }
  ctx.fill();
  const g = ctx.createLinearGradient(0, FLOOR, 0, FLOOR + 160); g.addColorStop(0, 'rgba(30,20,60,.13)'); g.addColorStop(1, 'rgba(30,20,60,0)');
  ctx.fillStyle = g; ctx.fillRect(-3000, FLOOR, 9000, 160);
}
// Wood plank floor in perspective
function _pubWood(ctx, cam, c1, c2, step = 120) {
  const cx = cam ? cam.x : 540;
  const g = ctx.createLinearGradient(0, FLOOR, 0, FLOOR + 700); g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(-3000, FLOOR, 9000, 2600);
  ctx.strokeStyle = 'rgba(70,35,10,.28)'; ctx.lineWidth = 4; ctx.beginPath();
  const i0 = Math.floor((cx - 2600) / step), i1 = Math.ceil((cx + 2600) / step);
  for (let i = i0; i < i1; i++) { ctx.moveTo(i * step, FLOOR); ctx.lineTo(_pubPX(i * step, FLOOR + 2700, cx, .8), FLOOR + 2700); }
  for (let r = 1; r < 12; r++) {
    const y0 = FLOOR + (r - 1) * (r - 1) * 22 + (r - 1) * 30, y1 = FLOOR + r * r * 22 + r * 30;
    for (let i = i0; i < i1; i++) if ((i + r * 3) % 4 === 0) { const y = (y0 + y1) / 2; ctx.moveTo(_pubPX(i * step, y, cx, .8), y); ctx.lineTo(_pubPX((i + 1) * step, y, cx, .8), y); }
  }
  ctx.stroke();
  const sg = ctx.createLinearGradient(0, FLOOR, 0, FLOOR + 140); sg.addColorStop(0, 'rgba(40,20,10,.16)'); sg.addColorStop(1, 'rgba(40,20,10,0)');
  ctx.fillStyle = sg; ctx.fillRect(-3000, FLOOR, 9000, 140);
}
// Patterned carpet (flat world-space motif grid)
function _pubCarpet(ctx, cam, base, cols, seed = 1, cell = 150) {
  ctx.fillStyle = base; ctx.fillRect(-3000, FLOOR, 9000, 2600);
  const cx = cam ? cam.x : 540, i0 = Math.floor((cx - 1800) / cell), i1 = Math.ceil((cx + 1800) / cell);
  ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let r = 0; r < 9; r++) for (let i = i0; i < i1; i++) {
    const h = hash(i * 31.7 + r * 7.3 + seed), x = i * cell + 30 + hash(i * 3.1 + r) * (cell - 60), y = FLOOR + 40 + r * 120 + hash(i + r * 9.7) * 60;
    const col = cols[Math.floor(h * 97) % cols.length], kind = Math.floor(h * 13) % 4;
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.beginPath();
    if (kind === 0) { ctx.arc(x, y, 14, 0, TAU); ctx.stroke(); }
    else if (kind === 1) { ctx.moveTo(x - 26, y + 8); ctx.lineTo(x - 9, y - 10); ctx.lineTo(x + 9, y + 8); ctx.lineTo(x + 26, y - 10); ctx.stroke(); }
    else if (kind === 2) { ctx.moveTo(x, y - 16); ctx.lineTo(x + 16, y + 12); ctx.lineTo(x - 16, y + 12); ctx.closePath(); ctx.stroke(); }
    else { ctx.moveTo(x - 24, y); ctx.bezierCurveTo(x - 10, y - 22, x + 10, y + 22, x + 24, y); ctx.stroke(); }
  }
  const g = ctx.createLinearGradient(0, FLOOR, 0, FLOOR + 160); g.addColorStop(0, 'rgba(0,0,0,.22)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(-3000, FLOOR, 9000, 160);
}
function _pubCloud(ctx, x, y, s) { for (const [ox, oy, r] of [[0, 0, 34], [36, -14, 42], [76, 0, 32]]) circle(ctx, x + ox * s, y + oy * s, r * s, 'rgba(255,255,255,.95)'); }
// Window with sky, drifting clouds, hills and mullions
function _pubWindow(ctx, x, y, w, h, T, o = {}) {
  const r = o.r ?? 18;
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, o.night ? '#1D1846' : '#5EBBF2'); g.addColorStop(1, o.night ? '#4A3A8C' : '#CFF0FF');
  rr(ctx, x, y, w, h, r); ctx.fillStyle = g; ctx.fill();
  ctx.save(); rr(ctx, x, y, w, h, r); ctx.clip();
  const sd = o.seed || 1;
  if (o.night) { for (let i = 0; i < 10; i++) { starPath(ctx, x + hash(i + sd) * w, y + hash(i * 3 + sd) * h * .6, 7, 3, 4); fillStroke(ctx, '#FFF6C8', 0); } }
  else for (let i = 0; i < 2; i++) { const cx = x - 120 + (((hash(sd + i) * w + T * 14 + i * w * .6) % (w + 240)) + w + 240) % (w + 240); _pubCloud(ctx, cx, y + h * (.2 + i * .22), w / 420); }
  if (o.hills !== false) {
    ellipse(ctx, x + w * .25, y + h + h * .05, w * .55, h * .24, o.night ? '#2C5A55' : '#7ED36A');
    ellipse(ctx, x + w * .85, y + h + h * .08, w * .5, h * .2, o.night ? '#244A47' : '#5CBF57');
    if (o.tree) { box(ctx, x + w * .72, y + h * .62, 16, h * .3, 4, '#8A5A2B', 0); circle(ctx, x + w * .72 + 8, y + h * .6, w * .12, o.night ? '#2E6B4A' : '#3FA34D'); }
  }
  ctx.globalAlpha = .28; ctx.fillStyle = '#fff'; ctx.beginPath();
  ctx.moveTo(x + w * .15, y); ctx.lineTo(x + w * .32, y); ctx.lineTo(x, y + h * .42); ctx.lineTo(x, y + h * .2); ctx.closePath(); ctx.fill();
  ctx.restore();
  rr(ctx, x, y, w, h, r); fillStroke(ctx, null, 10);
  ctx.fillStyle = OUTLINE;
  if (o.cols !== 1) ctx.fillRect(x + w / 2 - 4, y, 8, h);
  if (o.rows !== 1) ctx.fillRect(x, y + h * .5 - 4, w, 8);
  if (o.sill !== false) box(ctx, x - 22, y + h - 4, w + 44, 26, 8, o.sill || '#FFFFFF', 8);
}
function _pubClock(ctx, x, y, r, T, rim = '#EE384A') {
  circle(ctx, x, y, r + 12, rim, 9); circle(ctx, x, y, r, '#FFFFFF', 6);
  ctx.strokeStyle = OUTLINE; ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const a = i * TAU / 12, l = i % 3 ? 7 : 13; ctx.lineWidth = i % 3 ? 4 : 6; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * (r - 6), y + Math.sin(a) * (r - 6)); ctx.lineTo(x + Math.cos(a) * (r - 6 - l), y + Math.sin(a) * (r - 6 - l)); ctx.stroke(); }
  const hand = (a, l, lw, c) => { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke(); };
  hand(-Math.PI / 2 + 2.1 + T * .01, r * .5, 8, OUTLINE);
  hand(-Math.PI / 2 + 4.4 + T * .12, r * .75, 6, OUTLINE);
  hand(-Math.PI / 2 + Math.floor(T) * TAU / 60, r * .82, 3, '#EE384A');
  circle(ctx, x, y, 6, OUTLINE);
}
function _pubBooks(ctx, x0, yb, w, hmax, seed) {
  const r = rng(seed * 977 + 13); let x = x0;
  while (x < x0 + w - 16) {
    if (r() < .06) { x += 14 + r() * 14; continue; }
    const bw = 18 + r() * 15; if (x + bw > x0 + w) break;
    const bh = hmax * (.68 + r() * .32), col = _PUB_BOOK[Math.floor(r() * _PUB_BOOK.length)];
    if (r() < .07 && x + bw + 30 < x0 + w) { // leaning book
      ctx.save(); ctx.translate(x + 4, yb); ctx.rotate(.28); box(ctx, 0, -bh, bw, bh, 3, col, 4); ctx.restore(); x += bw + bh * .28; continue;
    }
    box(ctx, x, yb - bh, bw, bh, 3, col, 4);
    ctx.fillStyle = shade(col, -.28); ctx.fillRect(x + 3, yb - bh + bh * .16, bw - 6, 5); ctx.fillRect(x + 3, yb - bh * .2, bw - 6, 5);
    x += bw;
  }
}
function _pubBookcase(ctx, x, y, w, h, seed, wood = '#A8653A') {
  _pubShadow(ctx, x + w / 2, w + 20);
  box(ctx, x, y, w, h, 10, wood, 9);
  box(ctx, x + 18, y + 22, w - 36, h - 40, 4, '#5E3418', 0);
  const n = Math.max(1, Math.round((h - 40) / 175)), sp = (h - 40) / n;
  for (let k = 0; k < n; k++) {
    const yb = y + 22 + sp * (k + 1);
    _pubBooks(ctx, x + 22, yb - 6, w - 44, sp - 34, seed * 11 + k);
    box(ctx, x + 8, yb - 8, w - 16, 18, 4, shade(wood, .1), 6);
  }
  box(ctx, x - 8, y - 10, w + 16, 30, 8, shade(wood, .12), 8);
}
function _pubPlant(ctx, x, yb, s = 1, pot = '#FF8528') {
  for (const [a, l] of [[-.6, 70], [-.2, 90], [.25, 85], [.65, 66]]) {
    ctx.save(); ctx.translate(x, yb - 50 * s); ctx.rotate(a); ellipse(ctx, 0, -l * s * .5, 17 * s, l * s * .55, '#3FA34D', 6); ctx.restore();
  }
  ctx.beginPath(); ctx.moveTo(x - 36 * s, yb - 58 * s); ctx.lineTo(x + 36 * s, yb - 58 * s); ctx.lineTo(x + 27 * s, yb); ctx.lineTo(x - 27 * s, yb); ctx.closePath(); fillStroke(ctx, pot, 7);
  box(ctx, x - 40 * s, yb - 66 * s, 80 * s, 18 * s, 5, shade(pot, .15), 6);
}
function _pubNeon(ctx, s, x, y, size, col, on = 1) {
  ctx.font = `${size}px "Lilita One"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  if (on > 0) {
    ctx.save(); ctx.strokeStyle = col;
    ctx.globalAlpha = .13 * on; ctx.lineWidth = size * .55; ctx.strokeText(s, x, y);
    ctx.globalAlpha = .28 * on; ctx.lineWidth = size * .28; ctx.strokeText(s, x, y);
    ctx.restore();
  }
  ctx.lineWidth = size * .12; ctx.strokeStyle = on > 0 ? col : shade(col, -.6); ctx.strokeText(s, x, y);
  ctx.fillStyle = on > 0 ? shade(col, .72) : shade(col, -.35); ctx.fillText(s, x, y);
}
function _pubGlow(ctx, x, y, r, col, a = .5) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}
function _pubApple(ctx, x, y, s = 1) {
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y - 24 * s); ctx.lineTo(x + 4 * s, y - 40 * s); ctx.stroke();
  ellipse(ctx, x + 16 * s, y - 36 * s, 13 * s, 7 * s, '#30CE65', 5, -.5);
  circle(ctx, x, y, 28 * s, '#EE384A', 7); ellipse(ctx, x - 10 * s, y - 9 * s, 7 * s, 10 * s, 'rgba(255,255,255,.6)', 0, .4);
}
function _pubGlobe(ctx, x, y, r, T = 0) {
  box(ctx, x - 40, y + r + 22, 80, 22, 8, '#8A5A2B', 7);
  box(ctx, x - 7, y + r, 14, 30, 4, '#8A5A2B', 6);
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x, y, r + 14, Math.PI * .55, Math.PI * 1.45); ctx.stroke();
  ctx.strokeStyle = '#E8A93C'; ctx.lineWidth = 6; ctx.stroke();
  circle(ctx, x, y, r, '#4FB3F0', 8);
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r - 4, 0, TAU); ctx.clip();
  const sp = (T * 12) % (r * 4);
  for (const [ox, oy, rx, ry] of [[-20, -18, 24, 16], [18, 14, 18, 26], [-30, 26, 14, 10], [44, -24, 16, 12]]) for (const w of [-r * 4, 0]) ellipse(ctx, x + ox + sp + w, y + oy, rx, ry, '#5BC85A');
  ellipse(ctx, x - r * .35, y - r * .4, r * .22, r * .14, 'rgba(255,255,255,.5)', 0, -.5);
  ctx.restore();
  circle(ctx, x, y, r, null, 8);
}

// ================= 1. CLASSROOM =================
function envClassroom(ctx, T, cam, o = {}) {
  _pubBg(ctx, '#FFF0CC');
  ctx.fillStyle = '#F5DCA5'; ctx.fillRect(-3000, -2000, 9000, 2060); box(ctx, -3000, 40, 9000, 26, 0, '#E89A4F', 8);
  const { dx } = par(cam, .9);
  ctx.save(); ctx.translate(dx, 0);
  // wainscot
  ctx.fillStyle = '#86D0BE'; ctx.fillRect(-3000, 1090, 9000, 420);
  ctx.strokeStyle = 'rgba(20,60,50,.12)'; ctx.lineWidth = 5; ctx.beginPath(); for (let i = -25; i < 50; i++) { ctx.moveTo(i * 130, 1110); ctx.lineTo(i * 130, 1500); } ctx.stroke();
  box(ctx, -3000, 1070, 9000, 32, 0, '#F2A65A', 8);
  // alphabet strip
  for (let i = -10; i < 22; i++) {
    const x = i * 104 + 6, c = _PUB_PAL[((i % 8) + 8) % 8];
    box(ctx, x, 140, 92, 92, 12, c, 6); txt(ctx, String.fromCharCode(65 + ((i % 26) + 26) % 26), x + 46, 190, 64, '#fff', OUTLINE, 8);
  }
  // windows (left wall)
  _pubWindow(ctx, -720, 300, 300, 560, T, { seed: 1, tree: true }); _pubWindow(ctx, -380, 300, 300, 560, T, { seed: 2 });
  // rainbow poster
  box(ctx, -40, 330, 150, 200, 10, '#FFFFFF', 8);
  for (let k = 0; k < 4; k++) { ctx.strokeStyle = ['#EE384A', '#FFD447', '#30CE65', '#2E9CCA'][k]; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(35, 470, 56 - k * 12, Math.PI, TAU); ctx.stroke(); }
  _pubCloud(ctx, -8, 470, .4); _pubCloud(ctx, 52, 470, .4);
  txt(ctx, 'SMILE', 35, 380, 34, '#FF5B9B');
  // chalkboard
  box(ctx, 132, 262, 776, 506, 20, '#B9783F', 10);
  box(ctx, 158, 288, 724, 454, 8, '#2F6B4F', 7);
  ctx.save(); ctx.globalAlpha = .07; for (let i = 0; i < 6; i++) ellipse(ctx, 230 + i * 120, 330 + (i % 3) * 120, 90, 30, '#fff', 0, -.2); ctx.restore();
  const chalk = '#F6F8EE';
  const lines = String(o.board ?? 'WELCOME BACK!').split('\n');
  if (lines.length === 1) _pubFit(ctx, lines[0], 520, 460, 660, 116, chalk);
  else lines.slice(0, 2).forEach((s, i) => _pubFit(ctx, s, 520, 405 + i * 120, 660, 100, chalk));
  if (o.doodles !== false) {
    txt(ctx, '2 + 2 = 4', 330, 650, 56, 'rgba(246,248,238,.85)');
    ctx.strokeStyle = 'rgba(246,248,238,.85)'; ctx.lineWidth = 6;
    starPath(ctx, 640, 650, 34, 15); ctx.stroke();
    ctx.beginPath(); ctx.arc(770, 650, 36, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(770, 656, 20, .2, Math.PI - .2); ctx.stroke();
    circle(ctx, 758, 640, 5, 'rgba(246,248,238,.85)'); circle(ctx, 782, 640, 5, 'rgba(246,248,238,.85)');
  }
  box(ctx, 150, 758, 740, 24, 6, '#A8653A', 7);
  box(ctx, 300, 746, 34, 14, 5, '#fff', 4); box(ctx, 352, 748, 26, 12, 5, '#FFD447', 4); box(ctx, 620, 738, 96, 24, 6, '#2E9CCA', 6); box(ctx, 620, 752, 96, 10, 3, '#555', 0);
  // kids' art on a string
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(150, 846); ctx.quadraticCurveTo(520, 900, 890, 846); ctx.stroke();
  [['sun', '#FFF8E0'], ['house', '#E8F6FF'], ['heart', '#FFF0F6'], ['tree', '#F0FFE8'], ['cat', '#FFF8E0']].forEach(([k, bgc], i) => {
    const x = 200 + i * 160, y = 856 + Math.sin((i + .5) / 5 * Math.PI) * 26, rot = (i % 2 ? .05 : -.05);
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); box(ctx, -56, 0, 112, 120, 4, bgc, 6);
    if (k === 'sun') { circle(ctx, 0, 60, 26, '#FFD447', 5); ctx.strokeStyle = '#FF8528'; ctx.lineWidth = 5; ctx.beginPath(); for (let a = 0; a < 8; a++) { ctx.moveTo(Math.cos(a * .785) * 32, 60 + Math.sin(a * .785) * 32); ctx.lineTo(Math.cos(a * .785) * 44, 60 + Math.sin(a * .785) * 44); } ctx.stroke(); }
    else if (k === 'house') { box(ctx, -30, 52, 60, 50, 3, '#EE384A', 5); ctx.beginPath(); ctx.moveTo(-40, 56); ctx.lineTo(0, 22); ctx.lineTo(40, 56); ctx.closePath(); fillStroke(ctx, '#7B4BFF', 5); box(ctx, -8, 74, 16, 28, 2, '#FFD447', 4); }
    else if (k === 'heart') { heartPath(ctx, 0, 66, 36); fillStroke(ctx, '#FF5B9B', 5); }
    else if (k === 'tree') { box(ctx, -7, 66, 14, 40, 3, '#8A5A2B', 4); circle(ctx, 0, 54, 28, '#30CE65', 5); }
    else { circle(ctx, 0, 66, 30, '#FF8528', 5); ctx.beginPath(); ctx.moveTo(-26, 52); ctx.lineTo(-22, 26); ctx.lineTo(-6, 40); ctx.moveTo(6, 40); ctx.lineTo(22, 26); ctx.lineTo(26, 52); fillStroke(ctx, '#FF8528', 5); circle(ctx, -10, 62, 4, OUTLINE); circle(ctx, 10, 62, 4, OUTLINE); }
    box(ctx, -8, -10, 16, 22, 3, '#EE384A', 4); ctx.restore(); });
  // clock + star poster
  _pubClock(ctx, 1000, 330, 54, T);
  box(ctx, 935, 470, 140, 196, 10, '#7B4BFF', 8); starPath(ctx, 1005, 548, 48, 21); fillStroke(ctx, '#FFD447', 7);
  txt(ctx, 'STAR', 1005, 630, 38, '#fff', OUTLINE, 6);
  // right wall: solar system + BE KIND posters, window
  box(ctx, 1150, 300, 330, 230, 12, '#24225B', 8);
  for (let i = 0; i < 5; i++) { ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(1190, 415, 60 + i * 55, 40 + i * 25, 0, -1, 1); ctx.stroke(); }
  circle(ctx, 1190, 415, 40, '#FFD447', 6);
  for (const [x, y, r, c] of [[1255, 395, 12, '#FF8528'], [1300, 450, 16, '#2E9CCA'], [1360, 385, 14, '#EE384A'], [1420, 450, 24, '#F2C786']]) circle(ctx, x, y, r, c, 5);
  box(ctx, 1170, 580, 240, 200, 12, '#FF5B9B', 8); heartPath(ctx, 1290, 660, 54); fillStroke(ctx, '#fff', 7); txt(ctx, 'BE KIND', 1290, 740, 46, '#fff', OUTLINE, 7);
  _pubWindow(ctx, 1540, 300, 300, 560, T, { seed: 3 });
  ctx.restore();
  // floor
  _pubChecker(ctx, cam, '#DCE8EE', '#C3D5E0');
  _pubFloorLine(ctx);
  // cubbies (left)
  _pubShadow(ctx, -90, 560);
  box(ctx, -370, 1120, 560, 380, 12, '#F2A65A', 9);
  { const r = rng(55);
    for (let c = 0; c < 4; c++) for (let k = 0; k < 3; k++) {
      const x = -352 + c * 133, y = 1138 + k * 120;
      box(ctx, x, y, 122, 106, 6, '#B8743A', 6);
      const kind = Math.floor(r() * 3), col = _PUB_PAL[Math.floor(r() * 8)];
      if (kind === 0) { box(ctx, x + 10, y + 34, 102, 66, 10, col, 6); box(ctx, x + 40, y + 50, 42, 10, 5, shade(col, -.3), 0); }
      else if (kind === 1) { box(ctx, x + 24, y + 16, 74, 86, 20, col, 6); box(ctx, x + 36, y + 56, 50, 34, 8, shade(col, -.18), 5); ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x + 61, y + 18, 14, Math.PI, TAU); ctx.stroke(); }
      else { _pubBooks(ctx, x + 10, y + 100, 102, 70, c * 7 + k); }
    } }
  _pubPlant(ctx, 120, 1120, .9, '#2E9CCA');
  box(ctx, -320, 1094, 150, 26, 5, '#EE384A', 6); box(ctx, -310, 1070, 130, 26, 5, '#FFD447', 6);
  // teacher's desk (right)
  _pubShadow(ctx, 990, 440);
  box(ctx, 800, 1260, 380, 240, 8, '#B87335', 9);
  box(ctx, 828, 1286, 160, 214, 6, '#8E5426', 0);
  for (let k = 0; k < 2; k++) { box(ctx, 1010, 1286 + k * 104, 148, 92, 8, '#C98B4B', 7); box(ctx, 1062, 1326 + k * 104, 44, 12, 5, '#6E3E1E', 0); }
  box(ctx, 780, 1222, 420, 44, 12, '#D99A55', 9);
  _pubApple(ctx, 850, 1190);
  box(ctx, 905, 1188, 120, 32, 6, '#2E9CCA', 6); box(ctx, 912, 1158, 108, 30, 6, '#FFD447', 6); box(ctx, 900, 1130, 116, 28, 6, '#30CE65', 6);
  for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(1062 + i * 10, 1160); ctx.rotate(-.25 + i * .2); box(ctx, -5, -44, 10, 50, 3, ['#FFD447', '#EE384A', '#2E9CCA'][i], 4); ctx.restore(); }
  box(ctx, 1040, 1158, 50, 64, 8, '#FF8528', 6);
  _pubGlobe(ctx, 1150, 1112, 52, T);
}
// Front row of student desks: o.desks = [x,...] (default [380,700]), o.deskY (top, default 1330), o.items:false
function envClassroomFront(ctx, T, cam, o = {}) {
  const y = o.deskY ?? 1330;
  (o.desks || [380, 700]).forEach((x, i) => {
    ellipse(ctx, x, y + 262, 170, 18, 'rgba(20,10,40,.16)');
    box(ctx, x - 130, y + 96, 22, 166, 6, '#9AA6B8', 7); box(ctx, x + 108, y + 96, 22, 166, 6, '#9AA6B8', 7);
    box(ctx, x - 140, y + 248, 42, 16, 6, '#5A6274', 6); box(ctx, x + 98, y + 248, 42, 16, 6, '#5A6274', 6);
    box(ctx, x - 142, y + 30, 284, 86, 12, '#2E9CCA', 8);
    box(ctx, x - 118, y + 48, 236, 30, 8, '#1F6E95', 0);
    box(ctx, x - 168, y, 336, 42, 14, '#F2C786', 9);
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(x - 150, y + 8, 300, 6);
    if (o.items !== false) {
      const k = (i + (o.seed || 0)) % 3;
      if (k === 0) { box(ctx, x - 100, y - 14, 130, 18, 5, '#FFFFFF', 5); box(ctx, x - 100, y - 14, 130, 6, 3, '#EE384A', 0); ctx.save(); ctx.translate(x + 70, y - 8); ctx.rotate(-.12); box(ctx, -40, -6, 80, 12, 5, '#FFD447', 4); ctx.restore(); }
      else if (k === 1) { box(ctx, x - 70, y - 22, 110, 24, 5, '#7B4BFF', 6); box(ctx, x - 64, y - 44, 100, 24, 5, '#30CE65', 6); _pubApple(ctx, x + 90, y - 28, .7); }
      else { box(ctx, x - 90, y - 26, 120, 28, 12, '#FF5B9B', 6); box(ctx, x - 40, y - 20, 22, 10, 4, '#FFD447', 0); ctx.save(); ctx.translate(x + 70, y - 8); ctx.rotate(.1); box(ctx, -36, -6, 72, 12, 5, '#30CE65', 4); ctx.restore(); }
    }
  });
}

// ================= 2. CAFETERIA =================
function _pubFoodPan(ctx, x, y, kind) {
  box(ctx, x, y, 150, 34, 6, '#D8DDE8', 7);
  ctx.save(); rr(ctx, x + 8, y - 30, 134, 40, 10); ctx.clip();
  const r = rng(kind * 17 + 3);
  if (kind === 0) { ellipse(ctx, x + 75, y + 4, 62, 30, '#FFF8E6', 6); ellipse(ctx, x + 75, y - 18, 16, 8, '#FFD447', 4); }
  else if (kind === 1) { ellipse(ctx, x + 75, y + 6, 66, 22, '#3FA34D', 0); for (let i = 0; i < 22; i++) circle(ctx, x + 18 + r() * 114, y - 8 + r() * 16, 8, '#5BC85A', 3); }
  else if (kind === 2) { for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x + 14 + i * 42, y + 10); ctx.lineTo(x + 56 + i * 42, y + 10); ctx.lineTo(x + 35 + i * 42, y - 24); ctx.closePath(); fillStroke(ctx, '#FFD45C', 5); circle(ctx, x + 35 + i * 42, y - 2, 6, '#D9473E', 0); } }
  else if (kind === 3) { ellipse(ctx, x + 75, y + 6, 66, 22, '#F2B705', 0); for (let i = 0; i < 26; i++) circle(ctx, x + 16 + r() * 118, y - 6 + r() * 14, 6, '#FFD447', 2); }
  else { for (let i = 0; i < 6; i++) box(ctx, x + 14 + (i % 3) * 42, y - 18 + Math.floor(i / 3) * 18, 36, 26, 10, '#C98B4B', 5); }
  ctx.restore();
  rr(ctx, x, y, 150, 34, 6); fillStroke(ctx, null, 7);
}
function envCafeteria(ctx, T, cam, o = {}) {
  _pubBg(ctx, '#FFE1A8');
  const { dx } = par(cam, .9);
  ctx.save(); ctx.translate(dx, 0);
  // tile wainscot
  ctx.fillStyle = '#B9E3F2'; ctx.fillRect(-3000, 900, 9000, 620);
  ctx.strokeStyle = 'rgba(40,90,120,.18)'; ctx.lineWidth = 4; ctx.beginPath();
  for (let i = -60; i < 120; i++) { ctx.moveTo(i * 60, 900); ctx.lineTo(i * 60, 1500); } for (let k = 1; k < 10; k++) { ctx.moveTo(-3000, 900 + k * 60); ctx.lineTo(6000, 900 + k * 60); } ctx.stroke();
  box(ctx, -3000, 884, 9000, 30, 0, '#FF8528', 8);
  // windows
  _pubWindow(ctx, -40, 230, 500, 540, T, { seed: 4, tree: true, r: 22 });
  _pubWindow(ctx, -700, 230, 500, 540, T, { seed: 5 });
  // menu board
  box(ctx, 540, 200, 520, 440, 22, '#8A5A2B', 10);
  box(ctx, 566, 226, 468, 388, 10, '#26324E', 7);
  _pubFit(ctx, o.board ?? 'LUNCH MENU', 800, 290, 420, 72, '#FFD447', OUTLINE, 9);
  const menu = o.menu || ['PIZZA', 'TACOS', 'CORN', 'MILK'];
  menu.slice(0, 4).forEach((s, i) => { const y = 380 + i * 66; circle(ctx, 622, y, 16, _PUB_PAL[(i * 3 + 1) % 8], 5); _pubFit(ctx, s, 654, y + 2, 360, 52, '#FFFFFF', OUTLINE, 0, 'left'); });
  // clock + poster right
  _pubClock(ctx, 1190, 330, 60, T, '#2E9CCA');
  box(ctx, 1300, 230, 260, 300, 12, '#30CE65', 8); txt(ctx, 'EAT YOUR', 1430, 290, 44, '#fff', OUTLINE, 7); txt(ctx, 'VEGGIES!', 1430, 340, 50, '#FFD447', OUTLINE, 7);
  ellipse(ctx, 1400, 440, 30, 50, '#FF8528', 6, .5); ellipse(ctx, 1468, 446, 34, 34, '#30CE65', 6);
  _pubWindow(ctx, 1620, 230, 500, 540, T, { seed: 6 });
  ctx.restore();
  _pubChecker(ctx, cam, '#F1E6D2', '#E2CFAF');
  _pubFloorLine(ctx);
  // bins
  for (const [x, c, l] of [[60, '#30CE65', 'RECYCLE'], [-140, '#7A8396', 'TRASH']]) {
    _pubShadow(ctx, x + 90, 180);
    box(ctx, x + 6, 1270, 168, 230, 14, c, 9); box(ctx, x - 6, 1246, 192, 38, 12, shade(c, -.2), 9);
    _pubFit(ctx, l, x + 90, 1350, 140, 34, '#fff', OUTLINE, 6);
    if (l === 'RECYCLE') { ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(x + 90, 1420, 30, .3, TAU - .5); ctx.stroke(); }
  }
  // serving line
  const x0 = 480, x1 = 1640;
  _pubShadow(ctx, (x0 + x1) / 2, x1 - x0 + 30);
  box(ctx, x0, 1196, x1 - x0, 304, 10, '#B8C2CC', 9);
  for (let x = x0 + 20; x < x1 - 120; x += 190) box(ctx, x, 1290, 170, 190, 10, '#CBD3DC', 6);
  box(ctx, x0 - 30, 1252, x1 - x0 + 60, 30, 8, '#8C96A8', 8);
  box(ctx, x0 - 10, 1180, x1 - x0 + 20, 26, 8, '#E6EBF0', 8);
  // tray stack
  for (let k = 0; k < 5; k++) box(ctx, x0 + 10, 1160 - k * 16, 120, 20, 6, k % 2 ? '#FF8528' : '#FF9A45', 6);
  // food pans + sneeze guard
  [0, 1, 2, 3, 4, 1].forEach((k, i) => _pubFoodPan(ctx, x0 + 150 + i * 166, 1150, k));
  for (const x of [x0 + 140, x0 + 640, x1 - 40]) box(ctx, x - 7, 1000, 14, 186, 5, '#8C96A8', 6);
  rr(ctx, x0 + 120, 990, x1 - x0 - 140, 26, 8); fillStroke(ctx, 'rgba(210,240,255,.55)', 7);
  ctx.save(); ctx.globalAlpha = .45; ctx.fillStyle = '#fff'; for (let i = 0; i < 6; i++) ctx.fillRect(x0 + 180 + i * 190, 996, 60, 8); ctx.restore();
  // steam
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) { const x = x0 + 220 + i * 166, ph = T * 2 + i; ctx.beginPath(); for (let k = 0; k <= 8; k++) { const yy = 1110 - k * 9, xx = x + Math.sin(ph + k * .6) * 9; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.globalAlpha = .45 + .25 * Math.sin(ph); ctx.stroke(); }
  ctx.restore();
}
function _pubLunchTray(ctx, x, y, seed = 0) {
  box(ctx, x - 110, y - 18, 220, 24, 8, '#FF8528', 7);
  ctx.beginPath(); ctx.moveTo(x - 66, y - 14); ctx.lineTo(x - 18, y - 14); ctx.lineTo(x - 42, y - 58); ctx.closePath(); fillStroke(ctx, '#FFD45C', 6);
  circle(ctx, x - 44, y - 30, 6, '#D9473E'); circle(ctx, x - 36, y - 44, 5, '#D9473E');
  if (seed % 2) _pubApple(ctx, x + 6, y - 40, .75); else { ellipse(ctx, x + 4, y - 24, 30, 14, '#5BC85A', 5); }
  box(ctx, x + 44, y - 82, 50, 68, 4, '#FFFFFF', 6);
  ctx.beginPath(); ctx.moveTo(x + 44, y - 82); ctx.lineTo(x + 69, y - 104); ctx.lineTo(x + 94, y - 82); ctx.closePath(); fillStroke(ctx, '#FFFFFF', 6);
  box(ctx, x + 50, y - 62, 38, 22, 3, '#2E9CCA', 0);
  txt(ctx, 'MILK', x + 69, y - 51, 16, '#fff');
}
// Long lunch table + bench in front of the characters. o.tableY (top, 1345), o.x0/o.x1, o.trays = [x,...]
function envCafeteriaFront(ctx, T, cam, o = {}) {
  const y = o.tableY ?? 1345, x0 = o.x0 ?? -500, x1 = o.x1 ?? 1600;
  ellipse(ctx, (x0 + x1) / 2, y + 290, (x1 - x0) / 2, 22, 'rgba(20,10,40,.14)');
  for (let x = x0 + 120; x < x1 - 60; x += 520) { box(ctx, x, y + 40, 26, 250, 6, '#7A8396', 7); box(ctx, x + 300, y + 40, 26, 250, 6, '#7A8396', 7); }
  // bench
  box(ctx, x0 + 30, y + 180, x1 - x0 - 60, 40, 12, '#2E9CCA', 9);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x0 + 50, y + 188, x1 - x0 - 100, 6);
  for (let x = x0 + 200; x < x1 - 100; x += 520) box(ctx, x, y + 220, 22, 70, 6, '#7A8396', 7);
  // table top
  box(ctx, x0, y + 18, x1 - x0, 30, 8, '#2E86B0', 9);
  box(ctx, x0 - 10, y - 8, x1 - x0 + 20, 36, 14, '#8FDBF0', 9);
  ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(x0 + 10, y, x1 - x0 - 20, 6);
  (o.trays || [380, 700]).forEach((x, i) => _pubLunchTray(ctx, x, y - 6, i));
}

// ================= 3. LIBRARY =================
function _pubBeanbag(ctx, x, yb, col, s = 1) {
  _pubShadow(ctx, x, 240 * s);
  ctx.beginPath(); ctx.moveTo(x - 120 * s, yb);
  ctx.bezierCurveTo(x - 140 * s, yb - 80 * s, x - 90 * s, yb - 160 * s, x - 10 * s, yb - 150 * s);
  ctx.bezierCurveTo(x + 70 * s, yb - 170 * s, x + 140 * s, yb - 90 * s, x + 120 * s, yb);
  ctx.closePath(); fillStroke(ctx, col, 9);
  ctx.strokeStyle = shade(col, -.3); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 70 * s, yb - 70 * s); ctx.quadraticCurveTo(x, yb - 40 * s, x + 66 * s, yb - 80 * s); ctx.stroke();
  ellipse(ctx, x - 40 * s, yb - 118 * s, 34 * s, 16 * s, 'rgba(255,255,255,.35)', 0, -.3);
}
function envLibrary(ctx, T, cam, o = {}) {
  _pubBg(ctx, '#F4DDB0');
  const { dx } = par(cam, .9);
  ctx.save(); ctx.translate(dx, 0);
  // wallpaper stripes + wainscot
  ctx.fillStyle = 'rgba(200,140,70,.13)'; for (let i = -40; i < 80; i++) ctx.fillRect(i * 80, -2000, 36, 3500);
  ctx.fillStyle = '#9C5C33'; ctx.fillRect(-3000, 1150, 9000, 360); box(ctx, -3000, 1134, 9000, 28, 0, '#C98B4B', 8);
  // QUIET sign
  box(ctx, 320, 140, 440, 120, 24, '#30A045', 10);
  box(ctx, 334, 154, 412, 92, 16, null, 4);
  _pubFit(ctx, o.sign ?? 'QUIET PLEASE', 540, 202, 380, 70, '#FFFFFF', OUTLINE, 9);
  // arched window
  ctx.save(); ctx.beginPath(); ctx.moveTo(300, 880); ctx.lineTo(300, 540); ctx.arc(540, 540, 240, Math.PI, TAU); ctx.lineTo(780, 880); ctx.closePath(); ctx.clip();
  _pubWindow(ctx, 300, 300, 480, 600, T, { seed: 7, sill: false, rows: 1, r: 0, tree: true }); ctx.restore();
  ctx.beginPath(); ctx.moveTo(300, 880); ctx.lineTo(300, 540); ctx.arc(540, 540, 240, Math.PI, TAU); ctx.lineTo(780, 880); ctx.closePath(); fillStroke(ctx, null, 12);
  ctx.fillStyle = OUTLINE; ctx.fillRect(536, 300, 8, 580); ctx.fillRect(300, 620, 480, 8);
  box(ctx, 276, 872, 528, 28, 8, '#C98B4B', 8);
  // READ poster between shelves
  box(ctx, 1700, 300, 220, 300, 12, '#FF5B9B', 8); txt(ctx, 'READ!', 1810, 380, 66, '#fff', OUTLINE, 8); box(ctx, 1750, 440, 120, 100, 8, '#FFD447', 7); ctx.fillStyle = OUTLINE; ctx.fillRect(1806, 440, 8, 100);
  ctx.restore();
  _pubWood(ctx, cam, '#C98B4B', '#A86A35');
  // rug
  ellipse(ctx, 540, 1640, 660, 112, '#FFD447', 9); ellipse(ctx, 540, 1640, 590, 90, '#7B4BFF', 6); ellipse(ctx, 540, 1640, 470, 64, '#9A70FF', 0);
  _pubFloorLine(ctx);
  // bookcases
  for (let i = 0; i < 3; i++) _pubBookcase(ctx, -630 + i * 240, 300, 240, 1200, 3 + i);
  for (let i = 0; i < 3; i++) _pubBookcase(ctx, 930 + i * 240, 300, 240, 1200, 9 + i);
  // ladder
  ctx.save(); ctx.translate(1260, 1500); ctx.rotate(-.12);
  box(ctx, -60, -980, 18, 980, 6, '#D99A55', 7); box(ctx, 40, -980, 18, 980, 6, '#D99A55', 7);
  for (let k = 1; k < 9; k++) box(ctx, -50, -k * 110, 100, 14, 4, '#D99A55', 6);
  ctx.restore();
  // low shelf under the window
  _pubShadow(ctx, 540, 740);
  box(ctx, 170, 1160, 740, 340, 10, '#A8653A', 9);
  box(ctx, 188, 1180, 704, 300, 4, '#5E3418', 0);
  _pubBooks(ctx, 192, 1322, 700, 120, 41); box(ctx, 178, 1316, 724, 16, 4, '#B87A47', 6);
  _pubBooks(ctx, 192, 1476, 700, 130, 42);
  box(ctx, 160, 1146, 760, 28, 8, '#C98B4B', 8);
  _pubPlant(ctx, 250, 1146, .8, '#FF5B9B');
  _pubGlobe(ctx, 850, 1056, 50, T);
  box(ctx, 340, 1118, 110, 28, 5, '#2E9CCA', 6); box(ctx, 350, 1092, 96, 26, 5, '#EE384A', 6);
  // reading table + lamp
  _pubShadow(ctx, 20, 520);
  box(ctx, -200, 1290, 26, 210, 6, '#8A5A2B', 7); box(ctx, 214, 1290, 26, 210, 6, '#8A5A2B', 7);
  box(ctx, -240, 1258, 520, 42, 12, '#C98B4B', 9);
  box(ctx, -150, 1236, 70, 24, 8, '#D99A55', 6); box(ctx, -122, 1100, 14, 140, 4, '#D99A55', 6);
  ctx.beginPath(); ctx.moveTo(-190, 1140); ctx.lineTo(-40, 1140); ctx.lineTo(-60, 1080); ctx.lineTo(-170, 1080); ctx.closePath(); fillStroke(ctx, '#30A045', 8);
  _pubGlow(ctx, -115, 1180, 150, '#FFE9A0', .5);
  // open book
  ctx.beginPath(); ctx.moveTo(30, 1258); ctx.quadraticCurveTo(80, 1236, 130, 1248); ctx.lineTo(130, 1258); ctx.closePath(); fillStroke(ctx, '#FFFFFF', 6);
  ctx.beginPath(); ctx.moveTo(230, 1258); ctx.quadraticCurveTo(180, 1236, 130, 1248); ctx.lineTo(130, 1258); ctx.closePath(); fillStroke(ctx, '#FFFFFF', 6);
  box(ctx, 160, 1220, 90, 18, 4, '#7B4BFF', 5);
  // beanbags
  _pubBeanbag(ctx, 1065, 1500, '#EE384A'); _pubBeanbag(ctx, -350, 1500, '#FFD447', .9);
}

// ================= 4. SUPERMARKET =================
function _pubProducts(ctx, x0, yb, w, kind, seed) {
  const r = rng(seed * 131 + 7); let x = x0, col = _PUB_PAL[0], n = 0;
  while (true) {
    if (n % 3 === 0) col = _PUB_PAL[Math.floor(r() * 8)];
    n++;
    if (kind === 0) { // cereal boxes
      if (x + 64 > x0 + w) break;
      box(ctx, x, yb - 118, 62, 118, 5, col, 5); circle(ctx, x + 31, yb - 66, 18, '#FFFFFF', 4); circle(ctx, x + 31, yb - 66, 8, shade(col, -.2)); box(ctx, x + 8, yb - 108, 46, 14, 4, '#FFFFFF', 0); x += 66;
    } else if (kind === 1) { // cans
      if (x + 48 > x0 + w) break;
      box(ctx, x, yb - 66, 46, 66, 8, col, 5); box(ctx, x + 2, yb - 46, 42, 24, 0, '#FFFFFF', 0); ctx.fillStyle = col; ctx.fillRect(x + 14, yb - 40, 18, 12); x += 50;
    } else if (kind === 2) { // bottles
      if (x + 44 > x0 + w) break;
      box(ctx, x + 14, yb - 120, 16, 30, 4, col, 4); box(ctx, x + 12, yb - 128, 20, 12, 4, '#FFFFFF', 4);
      box(ctx, x, yb - 96, 44, 96, 14, col, 5); box(ctx, x + 4, yb - 66, 36, 30, 4, '#FFFFFF', 0); x += 48;
    } else if (kind === 3) { // chip bags
      if (x + 76 > x0 + w) break;
      box(ctx, x, yb - 104, 72, 104, 18, col, 5); ellipse(ctx, x + 36, yb - 56, 22, 16, '#FFD447', 4);
      ctx.strokeStyle = OUTLINE; ctx.lineWidth = 3; ctx.beginPath(); for (let k = 0; k <= 8; k++) ctx.lineTo(x + 6 + k * 7.5, yb - 94 + (k % 2) * 7); ctx.stroke(); x += 76;
    } else { // jars
      if (x + 54 > x0 + w) break;
      box(ctx, x, yb - 70, 52, 70, 12, shade(col, .1), 5); box(ctx, x + 4, yb - 84, 44, 18, 5, '#FFD447', 4); box(ctx, x + 8, yb - 50, 36, 26, 4, '#FFFFFF', 0); x += 56;
    }
  }
}
function _pubSale(ctx, x, y, T, s = 1, label = 'SALE!') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(T * 2.2 + x) * .06); ctx.scale(s, s);
  starPath(ctx, 0, 0, 74, 56, 14); fillStroke(ctx, '#FFD447', 7); _pubFit(ctx, label, 0, 3, 110, 40, '#EE384A', OUTLINE, 0);
  ctx.restore();
}
function _pubCart(ctx, x, yb, s = 1) { // x = left edge of the basket
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  _pubShadow(ctx, 120, 260, 6);
  circle(ctx, 40, -24, 22, '#3B3550', 7); circle(ctx, 200, -24, 22, '#3B3550', 7);
  box(ctx, 20, -64, 210, 16, 6, '#9AA6B8', 6);
  ctx.beginPath(); ctx.moveTo(-10, -250); ctx.lineTo(250, -250); ctx.lineTo(220, -90); ctx.lineTo(20, -90); ctx.closePath(); fillStroke(ctx, 'rgba(210,225,240,.55)', 8);
  ctx.strokeStyle = 'rgba(27,21,48,.55)'; ctx.lineWidth = 4; ctx.beginPath();
  for (let i = 1; i < 6; i++) { ctx.moveTo(-10 + i * 43, -250); ctx.lineTo(20 + i * 33, -90); } for (let k = 1; k < 4; k++) { const yy = -250 + k * 40, f = k / 4; ctx.moveTo(-10 + 30 * f, yy); ctx.lineTo(250 - 30 * f, yy); } ctx.stroke();
  box(ctx, 230, -66, 14, 30, 4, '#9AA6B8', 5);
  box(ctx, 240, -300, 16, 60, 6, '#9AA6B8', 6); box(ctx, 230, -310, 60, 20, 8, '#EE384A', 6);
  // groceries peeking out
  box(ctx, 20, -300, 60, 80, 5, '#FF8528', 5); circle(ctx, 50, -268, 14, '#fff', 4);
  box(ctx, 96, -320, 26, 70, 8, '#2E9CCA', 5); ellipse(ctx, 160, -270, 34, 22, '#FFD447', 5, -.3); circle(ctx, 200, -272, 20, '#EE384A', 5);
  rr(ctx, -10, -250, 260, 20, 6); fillStroke(ctx, '#C8D2E8', 6);
  ctx.restore();
}
function envSupermarket(ctx, T, cam, o = {}) {
  _pubBg(ctx, '#EAF6FF');
  // ceiling
  ctx.fillStyle = '#F8FBFF'; ctx.fillRect(-3000, -2000, 9000, 2100);
  for (let i = -8; i < 16; i++) { box(ctx, i * 420 + 60, 40, 300, 34, 10, '#FFFDE8', 6); }
  box(ctx, -3000, 96, 9000, 22, 0, '#30CE65', 7);
  const { dx } = par(cam, .9);
  ctx.save(); ctx.translate(dx, 0);
  ctx.fillStyle = '#D8ECFA'; ctx.fillRect(-3000, 1380, 9000, 140);
  // hanging aisle sign
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(430, 118); ctx.lineTo(430, 190); ctx.moveTo(650, 118); ctx.lineTo(650, 190); ctx.stroke();
  const sw = Math.sin(T * 1.1) * .015;
  ctx.save(); ctx.translate(540, 190); ctx.rotate(sw);
  box(ctx, -200, 0, 400, 190, 18, '#2E9CCA', 10);
  circle(ctx, -128, 95, 52, '#FFD447', 7); txt(ctx, String(o.aisle ?? 5), -128, 100, 70, OUTLINE);
  txt(ctx, 'AISLE', 60, 58, 40, '#BDE8FF');
  _pubFit(ctx, o.sign ?? 'SNACKS', 60, 122, 230, 70, '#FFFFFF', OUTLINE, 9);
  ctx.restore();
  ctx.restore();
  _pubChecker(ctx, cam, '#F6F8FA', '#E3E9EF', 140);
  // glossy floor reflection streaks
  ctx.save(); ctx.globalAlpha = .35; ctx.fillStyle = '#FFFFFF'; for (let i = -6; i < 14; i++) { ctx.beginPath(); ctx.moveTo(i * 300, FLOOR + 30); ctx.lineTo(i * 300 + 80, FLOOR + 30); ctx.lineTo(i * 300 + 20, FLOOR + 300); ctx.lineTo(i * 300 - 60, FLOOR + 300); ctx.closePath(); ctx.fill(); } ctx.restore();
  _pubFloorLine(ctx);
  // freezers (left)
  _pubShadow(ctx, -180, 800);
  box(ctx, -580, 380, 800, 1120, 14, '#C8D2E8', 9);
  box(ctx, -580, 380, 800, 90, 14, '#2E9CCA', 9); txt(ctx, 'FROZEN', -180, 428, 62, '#FFFFFF', OUTLINE, 8);
  for (let i = 0; i < 3; i++) {
    const x = -556 + i * 254;
    ctx.save(); rr(ctx, x, 490, 238, 900, 10); ctx.clip();
    const g = ctx.createLinearGradient(0, 490, 0, 1390); g.addColorStop(0, '#BFF3FF'); g.addColorStop(1, '#6CC8F0'); ctx.fillStyle = g; ctx.fillRect(x, 490, 238, 900);
    for (let k = 0; k < 4; k++) { box(ctx, x + 8, 690 + k * 200, 222, 12, 3, '#9FDCF2', 0); _pubProducts(ctx, x + 12, 688 + k * 200, 214, k % 2 ? 0 : 4, i * 5 + k); }
    ctx.globalAlpha = .3; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x + 40, 490); ctx.lineTo(x + 100, 490); ctx.lineTo(x, 760); ctx.lineTo(x, 640); ctx.fill();
    ctx.restore();
    rr(ctx, x, 490, 238, 900, 10); fillStroke(ctx, null, 8);
    box(ctx, x + 200, 860, 16, 160, 6, '#E6EBF0', 5);
  }
  _pubGlow(ctx, -180, 940, 640, '#9FE8FF', .35 + .05 * Math.sin(T * 3));
  // product shelving
  const sx0 = 230, sx1 = 920;
  _pubShadow(ctx, (sx0 + sx1) / 2, sx1 - sx0 + 20);
  box(ctx, sx0, 520, sx1 - sx0, 980, 10, '#E6EBF0', 9);
  box(ctx, sx0 - 10, 500, sx1 - sx0 + 20, 70, 12, '#EE384A', 9);
  _pubFit(ctx, 'YUMMY STUFF', (sx0 + sx1) / 2, 538, 500, 48, '#FFFFFF', OUTLINE, 7);
  const shelfY = [760, 960, 1160, 1360];
  const kinds = [0, 3, 2, 1];
  for (let k = 0; k < 4; k++) {
    const y = shelfY[k];
    _pubProducts(ctx, sx0 + 18, y - 6, sx1 - sx0 - 36, kinds[k], k + 2);
    box(ctx, sx0 + 4, y - 8, sx1 - sx0 - 8, 30, 4, '#B8C2CC', 7);
    for (let x = sx0 + 40; x < sx1 - 60; x += 170) { box(ctx, x, y - 4, 54, 24, 4, '#FFF7A8', 4); txt(ctx, '$' + (1 + Math.floor(hash(x + k) * 8)), x + 27, y + 9, 20, OUTLINE); }
  }
  box(ctx, sx0 + 4, 1420, sx1 - sx0 - 8, 80, 6, '#7A8396', 7);
  _pubSale(ctx, sx0 + 70, 860, T, 1);
  _pubSale(ctx, sx1 - 70, 1260, T, .9, '2 FOR 1');
  // checkout lane (right)
  _pubShadow(ctx, 1210, 560);
  box(ctx, 1390, 760, 26, 500, 8, '#9AA6B8', 7);
  box(ctx, 1340, 690, 126, 90, 16, '#30CE65', 9); txt(ctx, '1', 1403, 738, 64, '#FFFFFF', OUTLINE, 8);
  box(ctx, 940, 1250, 560, 250, 12, '#FF8528', 9);
  box(ctx, 960, 1270, 520, 30, 6, shade('#FF8528', -.15), 0);
  box(ctx, 930, 1220, 380, 40, 10, '#3B3550', 9);
  ctx.fillStyle = '#5A5470'; for (let x = 950 + ((T * 60) % 40); x < 1300; x += 40) ctx.fillRect(x, 1226, 6, 28);
  box(ctx, 1310, 1210, 200, 50, 10, '#D8DDE8', 9);
  box(ctx, 1350, 1100, 120, 100, 12, '#3B3550', 8); box(ctx, 1364, 1114, 92, 62, 6, '#7EE3B0', 0); txt(ctx, '$4.99', 1410, 1145, 26, '#14532D');
  box(ctx, 1398, 1196, 24, 20, 4, '#3B3550', 5);
  ctx.save(); ctx.globalAlpha = .6 + .4 * Math.sin(T * 9); ctx.fillStyle = '#FF3B3B'; ctx.fillRect(1320, 1218, 180, 5); ctx.restore();
  box(ctx, 1000, 1160, 60, 62, 6, '#FFD447', 6); box(ctx, 1080, 1180, 40, 42, 8, '#30CE65', 6);
  // cart
  _pubCart(ctx, 30, 1500);
}
// Checkout counter in front: o.x (centre, default 700). A cashier standing at o.x is behind it.
function envSupermarketFront(ctx, T, cam, o = {}) {
  const x = o.x ?? 700, y = 1330;
  ellipse(ctx, x, y + 262, 330, 20, 'rgba(20,10,40,.15)');
  box(ctx, x - 300, y + 30, 600, 230, 14, '#FF8528', 9);
  box(ctx, x - 280, y + 60, 560, 30, 6, shade('#FF8528', -.15), 0);
  txt(ctx, o.text ?? 'CHECKOUT', x, y + 170, 64, '#FFFFFF', OUTLINE, 9);
  box(ctx, x - 320, y - 6, 640, 46, 12, '#3B3550', 9);
  ctx.fillStyle = '#5A5470'; for (let xx = x - 300 + ((T * 60) % 40); xx < x + 300; xx += 40) ctx.fillRect(xx, y + 2, 6, 28);
  box(ctx, x - 250, y - 66, 60, 62, 6, '#FFD447', 6); circle(ctx, x - 220, y - 36, 14, '#fff', 4);
  box(ctx, x - 160, y - 96, 34, 92, 10, '#2E9CCA', 6); _pubApple(ctx, x + 200, y - 34, .8);
  box(ctx, x + 236, y - 140, 20, 140, 6, '#9AA6B8', 6); box(ctx, x + 196, y - 210, 110, 80, 12, '#3B3550', 8); box(ctx, x + 208, y - 198, 86, 50, 6, '#7EE3B0', 0); txt(ctx, '$7.50', x + 251, y - 172, 24, '#14532D');
}

// ================= 5. DOCTOR'S OFFICE =================
function envDoctorOffice(ctx, T, cam, o = {}) {
  _pubBg(ctx, '#D3F1EC');
  const { dx } = par(cam, .9);
  ctx.save(); ctx.translate(dx, 0);
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-3000, 1120, 9000, 400);
  ctx.strokeStyle = 'rgba(32,189,187,.18)'; ctx.lineWidth = 5; ctx.beginPath(); for (let i = -25; i < 50; i++) { ctx.moveTo(i * 120, 1140); ctx.lineTo(i * 120, 1500); } ctx.stroke();
  box(ctx, -3000, 1100, 9000, 30, 0, '#20BDBB', 8);
  // upper cabinets with glass doors
  _pubShadow(ctx, 340, 520, 530, .1);
  box(ctx, 80, 230, 520, 290, 12, '#F4F8FA', 9);
  for (let i = 0; i < 3; i++) {
    const x = 98 + i * 166;
    box(ctx, x, 248, 152, 254, 8, '#DDF4F8', 7);
    box(ctx, x + 10, 370, 132, 10, 3, '#B8D6DC', 0);
    if (i === 0) { for (let k = 0; k < 2; k++) { box(ctx, x + 18 + k * 64, 290, 52, 78, 12, 'rgba(255,255,255,.8)', 5); circle(ctx, x + 44 + k * 64, 322, 14, '#FFFFFF', 3); circle(ctx, x + 36 + k * 64, 340, 12, '#FFFFFF', 3); } box(ctx, x + 20, 410, 110, 70, 6, '#FF8528', 5); txt(ctx, '+', x + 75, 444, 50, '#fff'); }
    else if (i === 1) { box(ctx, x + 22, 296, 50, 72, 10, '#FFD447', 5); for (let k = 0; k < 6; k++) box(ctx, x + 30 + k * 6, 280 + (k % 2) * 6, 6, 40, 2, '#E8C9A0', 2); box(ctx, x + 84, 300, 46, 68, 12, '#FF5B9B', 5); box(ctx, x + 22, 406, 108, 74, 8, '#30CE65', 5); txt(ctx, 'BAND-AIDS', x + 76, 444, 18, '#fff'); }
    else { for (let k = 0; k < 3; k++) box(ctx, x + 18 + k * 40, 310, 34, 58, 10, ['#2E9CCA', '#EE384A', '#7B4BFF'][k], 5); box(ctx, x + 20, 412, 112, 66, 10, 'rgba(255,255,255,.8)', 5); circle(ctx, x + 50, 444, 16, '#FF5B9B', 3); circle(ctx, x + 98, 444, 16, '#20BDBB', 3); }
    ctx.save(); ctx.globalAlpha = .4; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x + 20, 248); ctx.lineTo(x + 60, 248); ctx.lineTo(x, 330); ctx.lineTo(x, 290); ctx.fill(); ctx.restore();
    box(ctx, x + (i === 1 ? 136 : 8), 360, 10, 40, 4, '#9AA6B8', 4);
  }
  // diploma + BP gauge
  box(ctx, 110, 600, 200, 150, 8, '#C98B4B', 8); box(ctx, 126, 616, 168, 118, 4, '#FFF8E0', 0);
  txt(ctx, 'DOCTOR', 210, 650, 34, '#2E9CCA'); ctx.fillStyle = '#C9B48A'; ctx.fillRect(150, 680, 120, 6); ctx.fillRect(150, 696, 90, 6); circle(ctx, 266, 712, 14, '#EE384A', 4);
  box(ctx, 400, 610, 130, 130, 18, '#F4F8FA', 8); circle(ctx, 465, 668, 42, '#FFFFFF', 6);
  ctx.strokeStyle = '#EE384A'; ctx.lineWidth = 5; ctx.beginPath(); const na = -2.4 + Math.sin(T * 1.6) * .25 + 1.2; ctx.moveTo(465, 668); ctx.lineTo(465 + Math.cos(na) * 32, 668 + Math.sin(na) * 32); ctx.stroke(); circle(ctx, 465, 668, 5, OUTLINE);
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(465, 740); ctx.bezierCurveTo(470, 820, 380, 820, 400, 900); ctx.stroke(); box(ctx, 362, 890, 90, 120, 14, '#2E9CCA', 7);
  // heart poster + sanitizer
  box(ctx, 560, 800, 130, 170, 10, '#FFFFFF', 8); heartPath(ctx, 625, 880, 46); fillStroke(ctx, '#EE384A', 7);
  ctx.strokeStyle = '#EE384A'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(574, 940); ctx.lineTo(600, 940); ctx.lineTo(612, 918); ctx.lineTo(628, 958); ctx.lineTo(640, 940); ctx.lineTo(676, 940); ctx.stroke();
  box(ctx, 160, 840, 70, 110, 12, '#F4F8FA', 7); box(ctx, 176, 940, 38, 22, 6, '#20BDBB', 6); box(ctx, 172, 860, 46, 50, 8, '#BDE8FF', 5);
  // eye chart
  box(ctx, 720, 250, 240, 520, 10, '#FFFFFF', 9);
  const rows = [['E', 104], ['F P', 62], ['T O Z', 46], ['L P E D', 34], ['P E C F D', 26], ['E D F C Z P', 20]];
  let yy = 318; rows.forEach(([s, sz], i) => { txt(ctx, s, 840, yy, sz, OUTLINE, OUTLINE, 0, 'Lilita One'); yy += sz * .95 + 26; if (i === 3) { ctx.fillStyle = '#EE384A'; ctx.fillRect(740, yy - 18, 200, 4); } });
  // height chart
  box(ctx, 950, 760, 92, 740, 10, '#FFFFFF', 8);
  for (let k = 0; k < 7; k++) { ctx.fillStyle = _PUB_PAL[k]; ctx.fillRect(958, 768 + k * 104, 18, 104); }
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 4; ctx.beginPath(); for (let k = 0; k < 28; k++) { const y = 790 + k * 26; ctx.moveTo(976, y); ctx.lineTo(k % 4 ? 996 : 1016, y); } ctx.stroke();
  // giraffe topper
  ellipse(ctx, 996, 732, 40, 30, '#FFD447', 7); circle(ctx, 984, 726, 6, OUTLINE); circle(ctx, 1004, 742, 7, '#E8A93C'); box(ctx, 980, 686, 8, 22, 4, '#E8A93C', 4); box(ctx, 1004, 686, 8, 22, 4, '#E8A93C', 4);
  // poster + window
  box(ctx, 1120, 260, 300, 420, 14, '#2E9CCA', 9);
  const pl = String(o.poster ?? 'WASH YOUR HANDS!').split(' ');
  const half = Math.ceil(pl.length / 2);
  _pubFit(ctx, pl.slice(0, half).join(' '), 1270, 320, 260, 54, '#FFFFFF', OUTLINE, 7);
  _pubFit(ctx, pl.slice(half).join(' '), 1270, 380, 260, 54, '#FFD447', OUTLINE, 7);
  for (let i = 0; i < 4; i++) box(ctx, 1222 + i * 26, 452 - (i === 1 || i === 2 ? 14 : 0), 24, 80, 12, '#FFD9B8', 6);
  ctx.save(); ctx.translate(1222, 560); ctx.rotate(-.7); box(ctx, -12, -70, 26, 74, 12, '#FFD9B8', 6); ctx.restore();
  box(ctx, 1216, 500, 112, 96, 34, '#FFD9B8', 7);
  for (const [bx, by, br] of [[1162, 470, 20], [1180, 600, 14], [1370, 460, 18], [1380, 560, 24], [1345, 640, 12], [1160, 540, 10]]) { circle(ctx, bx, by, br, 'rgba(255,255,255,.85)', 4); circle(ctx, bx - br * .35, by - br * .35, br * .25, '#FFFFFF'); }
  _pubWindow(ctx, 1480, 280, 400, 520, T, { seed: 8, tree: true });
  // sink (left)
  ctx.restore();
  _pubChecker(ctx, cam, '#EEF4F7', '#D3E3EB');
  _pubFloorLine(ctx);
  _pubShadow(ctx, -460, 380);
  box(ctx, -660, 1190, 400, 310, 10, '#F4F8FA', 9);
  for (let k = 0; k < 2; k++) { box(ctx, -640 + k * 190, 1220, 170, 260, 8, '#E6EEF2', 6); box(ctx, -560 + k * 190 - 30, 1250, 50, 12, 5, '#9AA6B8', 0); }
  box(ctx, -680, 1160, 440, 40, 10, '#C8D2E8', 9);
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-460, 1160); ctx.lineTo(-460, 1080); ctx.quadraticCurveTo(-460, 1050, -420, 1050); ctx.lineTo(-400, 1070); ctx.stroke();
  ctx.strokeStyle = '#D8DDE8'; ctx.lineWidth = 7; ctx.stroke();
  box(ctx, -620, 1100, 46, 60, 10, '#FF5B9B', 6); box(ctx, -606, 1082, 18, 22, 4, '#FFFFFF', 4);
  // exam bed
  ctx.save(); ctx.translate(-70, 0);
  _pubShadow(ctx, 15, 560);
  box(ctx, -230, 1300, 490, 200, 10, '#E6EEF2', 9);
  for (let k = 0; k < 2; k++) { box(ctx, -200 + k * 240, 1330, 200, 70, 8, '#F4F8FA', 6); box(ctx, -130 + k * 240, 1356, 60, 12, 5, '#9AA6B8', 0); }
  box(ctx, 60, 1420, 160, 70, 8, '#C8D2E8', 7);
  box(ctx, -260, 1238, 550, 70, 22, '#20BDBB', 9);
  ctx.save(); ctx.translate(-250, 1246); ctx.rotate(-.42); box(ctx, 0, -60, 190, 64, 22, '#20BDBB', 9); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-120, 1236); for (let k = 0; k <= 10; k++) ctx.lineTo(-120 + k * 38, 1234 + Math.sin(k * 1.7) * 3); ctx.lineTo(290, 1268); ctx.lineTo(-120, 1268); ctx.closePath(); fillStroke(ctx, '#FFFFFF', 6);
  ctx.save(); ctx.translate(-200, 1180); ctx.rotate(-.42); box(ctx, 40, -40, 120, 30, 10, '#FFFFFF', 5); ctx.restore();
  box(ctx, 255, 1210, 46, 70, 16, '#E6EBF0', 7);
  ctx.restore();
  // stethoscope hook on wall right of bed? (on eye chart side) + scale + stool (right, off acting area)
  _pubShadow(ctx, 1200, 180);
  box(ctx, 1120, 1450, 170, 50, 12, '#D8DDE8', 8); box(ctx, 1260, 1120, 22, 340, 8, '#9AA6B8', 7); box(ctx, 1220, 1080, 110, 70, 12, '#F4F8FA', 8); txt(ctx, '42', 1275, 1116, 36, '#2E9CCA');
  _pubShadow(ctx, 1460, 200);
  for (const a of [-.7, 0, .7]) { ctx.save(); ctx.translate(1460, 1400); ctx.rotate(a); box(ctx, -8, 0, 16, 96, 6, '#9AA6B8', 6); ctx.restore(); }
  box(ctx, 1450, 1300, 20, 110, 6, '#9AA6B8', 6); ellipse(ctx, 1460, 1290, 90, 26, '#2E9CCA', 8);
}

// ================= 6. BIRTHDAY PARTY =================
function _pubBalloon(ctx, x, y, col, ax, ay) {
  ctx.strokeStyle = 'rgba(27,21,48,.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y + 80); ctx.bezierCurveTo(x - 20, y + 160, ax + 20, ay - 120, ax, ay); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y + 72); ctx.lineTo(x - 10, y + 88); ctx.lineTo(x + 10, y + 88); ctx.closePath(); fillStroke(ctx, col, 5);
  ellipse(ctx, x, y, 60, 72, col, 8);
  ellipse(ctx, x - 22, y - 28, 11, 20, 'rgba(255,255,255,.55)', 0, .45);
}
function _pubBalloons(ctx, T, cx, cy, ax, ay, seed) {
  const r = rng(seed); const pts = [[-70, 30], [60, 20], [0, -60], [-30, 120], [80, 130]];
  pts.forEach(([ox, oy], i) => { const ph = r() * 6; _pubBalloon(ctx, cx + ox + Math.sin(T * .9 + ph) * 6, cy + oy + Math.sin(T * 1.6 + ph) * 11, _PUB_PAL[Math.floor(r() * 8)], ax, ay); });
}
function _pubGift(ctx, x, yb, w, h, col, rib) {
  box(ctx, x, yb - h, w, h, 8, col, 8);
  ctx.fillStyle = rib; ctx.fillRect(x + w / 2 - 10, yb - h + 4, 20, h - 8);
  box(ctx, x - 8, yb - h - 4, w + 16, h * .26, 8, shade(col, .1), 8);
  ctx.fillStyle = rib; ctx.fillRect(x + w / 2 - 10, yb - h, 20, h * .26 - 8);
  ellipse(ctx, x + w / 2 - 22, yb - h - 18, 22, 14, rib, 6, .4); ellipse(ctx, x + w / 2 + 22, yb - h - 18, 22, 14, rib, 6, -.4); circle(ctx, x + w / 2, yb - h - 12, 9, rib, 5);
}
function _pubHat(ctx, x, yb, h, col, rot = 0) {
  ctx.save(); ctx.translate(x, yb); ctx.rotate(rot);
  ctx.beginPath(); ctx.moveTo(-h * .38, 0); ctx.lineTo(0, -h); ctx.lineTo(h * .38, 0); ctx.closePath(); fillStroke(ctx, col, 7);
  ctx.save(); ctx.clip(); for (let k = 0; k < 4; k++) circle(ctx, (k % 2 ? 1 : -1) * h * .1, -h * (.2 + k * .18), h * .06, '#FFFFFF'); ctx.restore();
  circle(ctx, 0, -h, h * .12, '#FFD447', 5);
  ctx.restore();
}
function _pubCake(ctx, x, yb, T, o = {}) {
  ellipse(ctx, x, yb, 170, 22, '#FFFFFF', 7);
  box(ctx, x - 140, yb - 100, 280, 96, 18, '#FF8FB8', 8);
  ctx.beginPath(); ctx.moveTo(x - 140, yb - 80); for (let k = 0; k <= 7; k++) { const xx = x - 140 + k * 40; ctx.lineTo(xx, yb - 80); ctx.quadraticCurveTo(xx + 20, yb - 40 - (k % 2) * 14, xx + 40, yb - 80); } ctx.lineTo(x + 140, yb - 100); ctx.lineTo(x - 140, yb - 100); ctx.closePath(); fillStroke(ctx, '#FFFFFF', 0);
  box(ctx, x - 140, yb - 104, 280, 30, 14, '#FFFFFF', 8);
  box(ctx, x - 96, yb - 178, 192, 80, 16, '#FFF0D6', 8);
  box(ctx, x - 100, yb - 182, 200, 24, 12, '#FF5B9B', 7);
  for (let i = 0; i < 9; i++) { ctx.save(); ctx.translate(x - 80 + i * 20, yb - 128 + (i % 3) * 12); ctx.rotate(i); box(ctx, -7, -2.5, 14, 5, 2, _PUB_PAL[i % 8], 0); ctx.restore(); }
  if (o.cakeText) _pubFit(ctx, o.cakeText, x, yb - 52, 240, 34, '#FF5B9B');
  const n = o.candles ?? 5;
  for (let i = 0; i < n; i++) {
    const cx = x - (n - 1) * 17 + i * 34;
    box(ctx, cx - 7, yb - 236, 14, 56, 4, _PUB_PAL[(i * 3) % 8], 4);
    if (o.lit !== false) {
      const f = 1 + noise1(T * 9 + i * 3) * .18;
      _pubGlow(ctx, cx, yb - 256, 50, '#FFD447', .55);
      ctx.save(); ctx.translate(cx, yb - 240); ctx.scale(1, f);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-14, -10, -6, -26, 0, -36); ctx.bezierCurveTo(6, -26, 14, -10, 0, 0); fillStroke(ctx, '#FF8528', 4);
      ellipse(ctx, 0, -10, 4, 8, '#FFF3A0'); ctx.restore();
    } else { ctx.save(); ctx.globalAlpha = .6; ctx.strokeStyle = '#B8C2CC'; ctx.lineWidth = 5; ctx.beginPath(); for (let k = 0; k < 8; k++) ctx.lineTo(cx + Math.sin(T * 3 + k) * 8, yb - 240 - k * 10); ctx.stroke(); ctx.restore(); }
  }
}
function envBirthdayParty(ctx, T, cam, o = {}) {
  _pubBg(ctx, '#FFE3EE');
  const { dx } = par(cam, .9);
  ctx.save(); ctx.translate(dx, 0);
  ctx.fillStyle = '#FFD1E2'; for (let i = -40; i < 80; i++) ctx.fillRect(i * 100, -2000, 50, 3500);
  ctx.fillStyle = '#B9E6FF'; ctx.fillRect(-3000, 1160, 9000, 360); box(ctx, -3000, 1140, 9000, 30, 0, '#FFFFFF', 8);
  // window with curtains
  _pubWindow(ctx, 330, 420, 420, 440, T, { seed: 9, tree: true });
  for (const s of [-1, 1]) {
    const x = s < 0 ? 290 : 790; ctx.beginPath(); ctx.moveTo(x - 50, 380); ctx.lineTo(x + 50, 380); ctx.quadraticCurveTo(x + s * 20 + 30, 700, x + 30 * -s + 30, 920); ctx.lineTo(x - 50 + (s < 0 ? 0 : 20), 920); ctx.closePath(); fillStroke(ctx, '#7B4BFF', 8);
  }
  box(ctx, 220, 366, 640, 26, 10, '#FFD447', 8);
  // bunting
  const bunt = (y0, sag, xs, xe, seed) => { const n = Math.round((xe - xs) / 90);
    for (let i = 0; i < n; i++) { const u0 = i / n, u1 = (i + 1) / n, um = (i + .5) / n, yA = y0 + Math.sin(u0 * Math.PI) * sag, yB = y0 + Math.sin(u1 * Math.PI) * sag, yM = y0 + Math.sin(um * Math.PI) * sag;
      ctx.beginPath(); ctx.moveTo(xs + u0 * (xe - xs), yA); ctx.lineTo(xs + u1 * (xe - xs), yB); ctx.lineTo(xs + um * (xe - xs), yM + 70); ctx.closePath(); fillStroke(ctx, _PUB_PAL[(i + seed) % 8], 6); } };
  bunt(110, 40, -900, 110, 1); bunt(110, 40, 970, 1980, 3); bunt(360, 50, -900, 200, 5); bunt(360, 50, 880, 1980, 2);
  // banner
  box(ctx, 40, 170, 1000, 170, 30, '#FF5B9B', 10);
  for (const s of [-1, 1]) { const x = s < 0 ? 40 : 1040; ctx.beginPath(); ctx.moveTo(x, 200); ctx.lineTo(x + s * 70, 210); ctx.lineTo(x + s * 40, 260); ctx.lineTo(x + s * 70, 320); ctx.lineTo(x, 310); ctx.closePath(); fillStroke(ctx, '#E03F82', 9); }
  box(ctx, 40, 170, 1000, 170, 30, null, 10);
  _pubFit(ctx, o.text ?? 'HAPPY BIRTHDAY!', 540, 258, 900, 112, '#FFFFFF', OUTLINE, 14);
  for (let i = 0; i < 8; i++) { starPath(ctx, 80 + i * 132 + (i % 2) * 20, 186 + (i % 2) * 140, 12, 5); fillStroke(ctx, '#FFD447', 0); }
  ctx.restore();
  _pubWood(ctx, cam, '#E7AE70', '#C98B4B');
  // confetti on the floor
  { const r = rng(77); for (let i = 0; i < 260; i++) { const x = -900 + r() * 2900, y = FLOOR + 14 + r() * r() * 700, c = _PUB_PAL[Math.floor(r() * 8)], a = r() * 3;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = c; if (i % 3) ctx.fillRect(-9, -4, 18, 8); else { ctx.beginPath(); ctx.arc(0, 0, 6, 0, TAU); ctx.fill(); } ctx.restore(); } }
  _pubFloorLine(ctx);
  // balloons
  _pubBalloons(ctx, T, 110, 600, 150, 1300, 3);
  _pubBalloons(ctx, T, 975, 560, 1000, 1210, 8);
  _pubBalloons(ctx, T, -420, 520, -400, 1200, 12);
  _pubBalloons(ctx, T, 1500, 520, 1480, 1200, 21);
  // presents (left)
  _pubShadow(ctx, 80, 380);
  _pubGift(ctx, -80, 1500, 170, 150, '#2E9CCA', '#FFD447'); _pubGift(ctx, 100, 1500, 140, 110, '#30CE65', '#FF5B9B');
  _pubGift(ctx, -40, 1350, 120, 100, '#FF8528', '#7B4BFF'); _pubGift(ctx, 150, 1390, 90, 80, '#EE384A', '#FFFFFF');
  // side table (right) with cake + hats
  _pubShadow(ctx, 1060, 440);
  box(ctx, 900, 1250, 20, 250, 6, '#8A5A2B', 7); box(ctx, 1200, 1250, 20, 250, 6, '#8A5A2B', 7);
  box(ctx, 860, 1220, 400, 40, 10, '#FFFFFF', 9);
  ctx.beginPath(); ctx.moveTo(860, 1250); for (let k = 0; k < 10; k++) ctx.quadraticCurveTo(880 + k * 40, 1330, 900 + k * 40, 1250); ctx.lineTo(860, 1250); fillStroke(ctx, '#FF5B9B', 8);
  _pubCake(ctx, 1060, 1222, T, { candles: 3 });
  _pubHat(ctx, 905, 1222, 100, '#2E9CCA', -.1); _pubHat(ctx, 1220, 1222, 90, '#FFD447', .12);
  _pubHat(ctx, 300, 1520, 90, '#30CE65', 1.3);
  // streamers
  ctx.lineCap = 'round';
  for (let s = 0; s < 4; s++) { ctx.strokeStyle = _PUB_PAL[(s * 2 + 1) % 8]; ctx.lineWidth = 12; ctx.beginPath(); const x0 = s < 2 ? -40 + s * 60 : 1000 + (s - 2) * 60;
    for (let k = 0; k <= 30; k++) { const y = 60 + k * 14, xx = x0 + Math.sin(k * .8 + T * 1.4 + s) * 14; k ? ctx.lineTo(xx, y) : ctx.moveTo(xx, y); } ctx.stroke(); }
  if (o.falling) { const r = rng(5); for (let i = 0; i < 40; i++) { const x = r() * 1300 - 110, sp = 120 + r() * 160, y = ((r() * 2200 + T * sp) % 2200) - 150, c = _PUB_PAL[Math.floor(r() * 8)];
      ctx.save(); ctx.translate(x + Math.sin(T * 2 + i) * 30, y); ctx.rotate(T * 3 + i); ctx.fillStyle = c; ctx.fillRect(-10, -5, 20, 10); ctx.restore(); } }
}
// Party table with a cake in front: o.x (default 540), o.candles (5), o.lit (true), o.cakeText, o.gifts (true)
function envBirthdayPartyFront(ctx, T, cam, o = {}) {
  const x = o.x ?? 540, y = 1360;
  ellipse(ctx, x, y + 240, 290, 20, 'rgba(20,10,40,.15)');
  box(ctx, x - 260, y + 30, 24, 210, 6, '#8A5A2B', 7); box(ctx, x + 236, y + 30, 24, 210, 6, '#8A5A2B', 7);
  box(ctx, x - 290, y, 580, 44, 12, '#FFFFFF', 9);
  ctx.beginPath(); ctx.moveTo(x - 290, y + 34); for (let k = 0; k < 14; k++) ctx.quadraticCurveTo(x - 290 + k * 41.4 + 20.7, y + 110, x - 290 + (k + 1) * 41.4, y + 34); ctx.lineTo(x - 290, y + 34); fillStroke(ctx, '#7B4BFF', 8);
  for (let k = 0; k < 14; k++) circle(ctx, x - 269 + k * 41.4, y + 74, 6, '#FFD447');
  _pubCake(ctx, x, y + 2, T, o);
  if (o.gifts !== false) { _pubGift(ctx, x - 270, y + 2, 90, 70, '#30CE65', '#FF5B9B'); _pubHat(ctx, x + 230, y + 2, 90, '#FF8528', .1); }
}

// ================= 7. MOVIE THEATER =================
function _pubSeatRow(ctx, x0, x1, y, h, sw, col, armCol, cx0) {
  const k0 = Math.floor((x0 - cx0) / sw), k1 = Math.ceil((x1 - cx0) / sw);
  for (let k = k0; k <= k1; k++) {
    const x = cx0 + k * sw;
    box(ctx, x - sw / 2 + 8, y, sw - 16, h, 30, col, 9);
    box(ctx, x - sw / 2 + 28, y + 24, sw - 56, h * .55, 20, shade(col, .14), 0);
    ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(x - sw / 2 + 36, y + 14, sw - 72, 7);
  }
  for (let k = k0; k <= k1 + 1; k++) { const x = cx0 + (k - .5) * sw; box(ctx, x - 13, y + h * .42, 26, h * .62, 8, armCol, 7); ellipse(ctx, x, y + h * .42, 20, 9, shade(armCol, -.4), 5); }
}
function _pubPopcorn(ctx, x, yb, s = 1) {
  ctx.save(); ctx.translate(x, yb); ctx.scale(s, s);
  for (let i = 0; i < 9; i++) circle(ctx, -44 + (i % 5) * 22 + (i > 4 ? 11 : 0), -126 - (i > 4 ? 22 : 0) + Math.sin(i * 2.3) * 5, 17, '#FFF3C4', 5);
  ctx.beginPath(); ctx.moveTo(-56, -122); ctx.lineTo(56, -122); ctx.lineTo(42, 0); ctx.lineTo(-42, 0); ctx.closePath(); fillStroke(ctx, '#FFFFFF', 7);
  ctx.save(); ctx.clip(); ctx.fillStyle = '#EE384A'; for (let k = -2; k < 3; k++) ctx.fillRect(-10 + k * 30, -130, 15, 140); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-56, -122); ctx.lineTo(56, -122); ctx.lineTo(42, 0); ctx.lineTo(-42, 0); ctx.closePath(); fillStroke(ctx, null, 7);
  ctx.restore();
}
function _pubMovie(ctx, x, y, w, h, T, text) { // default film: a cartoon rocket crossing a starry sky
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#3B2C8C'); g.addColorStop(1, '#FF9AB8');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  for (let i = 0; i < 30; i++) { const a = .5 + .5 * Math.sin(T * 3 + i * 1.7); starPath(ctx, x + hash(i * 1.3) * w, y + hash(i * 2.9) * h * .6, 9, 4, 4); fillStroke(ctx, `rgba(255,246,200,${a})`, 0); }
  circle(ctx, x + w * .8, y + h * .28, 70, '#FFF3C4', 7); circle(ctx, x + w * .8 - 22, y + h * .28 - 10, 14, '#F2DFA0'); circle(ctx, x + w * .8 + 20, y + h * .28 + 22, 10, '#F2DFA0');
  ellipse(ctx, x + w * .25, y + h + 40, w * .45, 150, '#5A3FA8', 8); ellipse(ctx, x + w * .8, y + h + 60, w * .4, 140, '#7B4BFF', 8);
  const u = ((T * .08 + .35) % 1.3) - .15, rx = x + u * w, ry = y + h * .62 - Math.sin(u * Math.PI) * h * .35;
  ctx.save(); ctx.translate(rx, ry); ctx.rotate(-.5 + u * .9);
  ctx.beginPath(); ctx.moveTo(-70, -16); ctx.lineTo(-104 - Math.sin(T * 20) * 10, 0); ctx.lineTo(-70, 16); ctx.closePath(); fillStroke(ctx, '#FFB020', 5);
  box(ctx, -72, -26, 110, 52, 26, '#FFFFFF', 7); ctx.beginPath(); ctx.moveTo(36, -24); ctx.quadraticCurveTo(80, 0, 36, 24); ctx.closePath(); fillStroke(ctx, '#EE384A', 7);
  circle(ctx, 0, 0, 14, '#4FB3F0', 6); ctx.beginPath(); ctx.moveTo(-60, -26); ctx.lineTo(-76, -50); ctx.lineTo(-40, -26); ctx.closePath(); fillStroke(ctx, '#EE384A', 6);
  ctx.restore();
  if (text) _pubFit(ctx, text, x + w / 2, y + h / 2, w * .85, 140, '#FFFFFF', OUTLINE, 16);
}
function envMovieTheater(ctx, T, cam, o = {}) {
  const g = ctx.createLinearGradient(0, -200, 0, FLOOR); g.addColorStop(0, '#170B2E'); g.addColorStop(1, '#3A1650');
  ctx.fillStyle = g; ctx.fillRect(-3000, -2000, 9000, 6000);
  const { dx } = par(cam, .9);
  ctx.save(); ctx.translate(dx, 0);
  ctx.fillStyle = 'rgba(0,0,0,.18)'; for (let i = -30; i < 60; i++) if (i % 2) ctx.fillRect(i * 110, -2000, 110, 3500);
  // wall sconces
  for (const x of [-640, -1000, 1640, 2000]) { _pubGlow(ctx, x, 600, 220, '#FF9A5A', .55); box(ctx, x - 40, 560, 80, 90, 30, '#FFB36B', 8); }
  // EXIT signs
  for (const x of [-560, 1620]) { box(ctx, x - 90, 240, 180, 80, 12, '#0F3D22', 8); _pubNeon(ctx, 'EXIT', x, 282, 54, '#3DFF7A'); }
  // screen
  const sx = 70, sy = 200, sw = 940, sh = 520;
  box(ctx, sx - 24, sy - 24, sw + 48, sh + 48, 16, '#0B0618', 10);
  const flick = .94 + .06 * Math.sin(T * 31) * Math.sin(T * 7.3);
  ctx.save(); rr(ctx, sx, sy, sw, sh, 8); ctx.clip();
  if (typeof o.screen === 'function') o.screen(ctx, sx, sy, sw, sh, T);
  else if (!o.screen) _pubMovie(ctx, sx, sy, sw, sh, T, o.text);
  else {
    const c = o.screen || '#BFE8FF';
    const sg = ctx.createRadialGradient(540, 460, 40, 540, 460, 620); sg.addColorStop(0, '#FFFFFF'); sg.addColorStop(1, c);
    ctx.fillStyle = sg; ctx.fillRect(sx, sy, sw, sh);
    if (o.text) _pubFit(ctx, o.text, 540, 470, 800, 140, '#FFFFFF', OUTLINE, 16);
  }
  ctx.fillStyle = `rgba(0,0,0,${(1 - flick) * 1.5})`; ctx.fillRect(sx, sy, sw, sh);
  ctx.restore();
  rr(ctx, sx, sy, sw, sh, 8); fillStroke(ctx, null, 8);
  // curtains + valance
  for (const s of [-1, 1]) {
    const x = s < 0 ? -40 : 1000;
    const ex = s < 0 ? x - 380 : x + 110;
    box(ctx, ex, 150, 390, 640, 0, '#9A1F31', 9);
    ctx.strokeStyle = '#6E1622'; ctx.lineWidth = 7; ctx.beginPath(); for (let k = 1; k < 8; k++) { ctx.moveTo(ex + k * 48, 170); ctx.lineTo(ex + k * 48, 780); } ctx.stroke();
    box(ctx, x, 150, 120, 640, 20, '#B3263A', 10);
    ctx.strokeStyle = '#7E1A29'; ctx.lineWidth = 8; ctx.beginPath(); for (let k = 1; k < 3; k++) { ctx.moveTo(x + k * 40, 180); ctx.lineTo(x + k * 40, 770); } ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(-400, 130); ctx.lineTo(1480, 130); ctx.lineTo(1480, 190);
  for (let k = 0; k < 16; k++) { const x = 1480 - k * 117.5; ctx.quadraticCurveTo(x - 58, 250, x - 117.5, 190); } ctx.closePath(); fillStroke(ctx, '#C42F45', 10);
  for (let k = 0; k < 16; k++) circle(ctx, 1480 - k * 117.5 - 58, 228, 9, '#FFD447', 4);
  // stage lip under the screen + a further row of seats with audience silhouettes
  box(ctx, -400, 760, 1880, 50, 8, '#4A1B3C', 9);
  for (let i = 0; i < 20; i++) circle(ctx, -360 + i * 96, 785, 6, `rgba(255,190,80,${.6 + .4 * Math.sin(T * 2 + i * .7)})`);
  for (let k = -6; k < 16; k++) { const x = 300 + k * 130; box(ctx, x - 58, 1040, 116, 150, 24, '#5E1626', 8); }
  for (const x of [-80, 430, 820, 1210]) { ellipse(ctx, x, 1060, 62, 40, '#1A0E28'); circle(ctx, x, 990, 44, '#1A0E28'); }
  // projector window
  box(ctx, 1200, 0, 90, 70, 10, '#0B0618', 8); circle(ctx, 1245, 36, 20, '#FFF6C8');
  ctx.restore();
  // projector beam (flicker)
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .85 * flick;
  const px = 1245 + dx, py = 36;
  const bg = ctx.createLinearGradient(px, py, 300, 600); bg.addColorStop(0, 'rgba(255,250,220,.6)'); bg.addColorStop(.5, 'rgba(220,230,255,.14)'); bg.addColorStop(1, 'rgba(180,210,255,.03)');
  ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(px, py - 14); ctx.lineTo(sx + dx, sy); ctx.lineTo(sx + dx, sy + sh); ctx.lineTo(sx + sw + dx, sy + sh); ctx.lineTo(px, py + 14); ctx.closePath(); ctx.fill();
  for (let i = 0; i < 26; i++) { const u = (hash(i * 3.3) + T * .03 * (1 + hash(i))) % 1, v = hash(i * 7.1); const x = lerp(px, sx + dx + v * sw * .8, u), y = lerp(py, sy + 40 + v * sh * .9, u) + Math.sin(T + i) * 10; circle(ctx, x, y, 3 + hash(i) * 3, 'rgba(255,255,230,.6)'); }
  ctx.restore();
  // floor: dark carpet
  _pubCarpet(ctx, cam, '#2A1446', ['#4A2470', '#5B2A5E', '#3B2B78'], 3, 170);
  _pubFloorLine(ctx);
  // back row of seats (behind the characters)
  _pubSeatRow(ctx, -700, 1800, 1235, 265, o.seatW ?? 160, '#8E1F33', '#2A1424', o.seatX0 ?? 380);
  // aisle lights
  for (let i = -8; i < 20; i++) { const on = .7 + .3 * Math.sin(T * 2 + i); circle(ctx, i * 120 + 20, 1530, 7, `rgba(255,190,80,${on})`); }
  for (const x of [-760, 1840]) for (let k = 0; k < 6; k++) circle(ctx, x, 1250 + k * 50, 8, '#FFC456', 3);
  if (o.dark) { ctx.fillStyle = `rgba(8,4,20,${o.dark * .6})`; ctx.fillRect(-3000, -2000, 9000, 6000); }
}
// Seat backs in front of the characters (kids look seated). o.seatY (1300), o.seatX0 (380), o.seatW (160), o.popcorn [x,...]
function envMovieTheaterFront(ctx, T, cam, o = {}) {
  const y = o.seatY ?? 1300;
  _pubSeatRow(ctx, -800, 1900, y, 330, o.seatW ?? 160, '#B3263A', '#3A1F2E', o.seatX0 ?? 380);
  (o.popcorn || [540]).forEach(x => _pubPopcorn(ctx, x, y + 150, .8));
  if (o.dark) { ctx.fillStyle = `rgba(8,4,20,${o.dark * .45})`; ctx.fillRect(-3000, y - 60, 9000, 3000); }
}

// ================= 8. ARCADE =================
function _pubArcadeScreen(ctx, x, y, w, h, kind, T, seed) {
  ctx.save(); rr(ctx, x, y, w, h, 10); ctx.clip();
  ctx.fillStyle = '#0B0820'; ctx.fillRect(x, y, w, h);
  const px = 8;
  if (kind === 0) { // invaders
    const ox = Math.sin(T * 1.5 + seed) * 18;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const ax = x + 22 + c * 34 + ox, ay = y + 20 + r * 26; ctx.fillStyle = ['#FF5B9B', '#FFD447', '#30CE65'][r]; ctx.fillRect(ax, ay, 22, 12); if (Math.floor(T * 3) % 2) { ctx.fillRect(ax - 4, ay + 10, 6, 6); ctx.fillRect(ax + 20, ay + 10, 6, 6); } else { ctx.fillRect(ax + 2, ay + 12, 5, 6); ctx.fillRect(ax + 15, ay + 12, 5, 6); } }
    const sx = x + w / 2 + Math.sin(T * 2.3 + seed) * (w * .32);
    ctx.fillStyle = '#20E0FF'; ctx.fillRect(sx - 14, y + h - 24, 28, 12); ctx.fillRect(sx - 4, y + h - 32, 8, 8);
    ctx.fillStyle = '#fff'; ctx.fillRect(sx - 2, y + h - 40 - ((T * 220) % (h - 40)), 4, 12);
  } else if (kind === 1) { // pong
    const u = (T * .9 + seed) % 2, bx = x + 20 + (u < 1 ? u : 2 - u) * (w - 40), v = (T * 1.3 + seed) % 2, by = y + 14 + (v < 1 ? v : 2 - v) * (h - 28);
    ctx.fillStyle = '#fff'; ctx.fillRect(x + 8, by - 20, 8, 40); ctx.fillRect(x + w - 16, clamp(by - 20 + Math.sin(T * 3) * 14, y, y + h - 40), 8, 40); ctx.fillRect(bx - 6, by - 6, 12, 12);
    for (let k = 0; k < h; k += 18) ctx.fillRect(x + w / 2 - 2, y + k, 4, 10);
  } else if (kind === 2) { // maze muncher
    ctx.strokeStyle = '#3B5BFF'; ctx.lineWidth = 6; ctx.strokeRect(x + 10, y + 10, w - 20, h - 20); ctx.strokeRect(x + 40, y + 40, w - 80, h - 80);
    const u = (T * .25 + seed) % 1, mx = x + 25 + u * (w - 50), my = y + 25;
    for (let k = 0; k < 8; k++) { const dxk = x + 25 + k * (w - 50) / 7; if (dxk > mx) circle(ctx, dxk, my, 4, '#FFD447'); }
    const m = Math.abs(Math.sin(T * 10)) * .7; ctx.fillStyle = '#FFD447'; ctx.beginPath(); ctx.moveTo(mx, my); ctx.arc(mx, my, 14, m, TAU - m); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FF5B9B'; ctx.beginPath(); const gx = x + w - 30, gy = y + 25 + ((T * 40) % (h - 50)); ctx.arc(gx, gy, 12, Math.PI, TAU); ctx.lineTo(gx + 12, gy + 12); ctx.lineTo(gx - 12, gy + 12); ctx.fill();
  } else { // racer
    ctx.fillStyle = '#30CE65'; ctx.fillRect(x, y, w, h); ctx.fillStyle = '#555'; ctx.beginPath(); ctx.moveTo(x + w * .4, y); ctx.lineTo(x + w * .6, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.fill();
    ctx.fillStyle = '#fff'; for (let k = 0; k < 4; k++) { const v = ((T * 1.4 + k / 4) % 1), yy = y + v * v * h; ctx.fillRect(x + w / 2 - 2 - v * 3, yy, 4 + v * 6, 6 + v * 14); }
    ctx.fillStyle = '#EE384A'; const cx = x + w / 2 + Math.sin(T * 1.8 + seed) * w * .2; ctx.fillRect(cx - 16, y + h - 34, 32, 22); ctx.fillStyle = '#FFD447'; ctx.fillRect(cx - 10, y + h - 40, 20, 8);
  }
  if (hash(Math.floor(T * 5) + seed * 13) > .88) { ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(x, y, w, h); }
  ctx.fillStyle = 'rgba(0,0,0,.18)'; for (let k = 0; k < h; k += 8) ctx.fillRect(x, y + k, w, 3);
  ctx.restore();
}
function _pubCabinet(ctx, x, col, T, seed, title) { // x = left edge, 200 wide
  _pubShadow(ctx, x + 100, 220);
  _pubGlow(ctx, x + 100, 1040, 200, col, .3);
  box(ctx, x, 880, 200, 620, 16, shade(col, -.35), 9);
  box(ctx, x + 14, 900, 172, 600, 10, '#241A44', 0);
  box(ctx, x - 6, 850, 212, 84, 14, col, 9);
  const lit = .75 + .25 * Math.sin(T * 4 + seed);
  ctx.save(); ctx.globalAlpha = lit; _pubFit(ctx, title, x + 100, 893, 170, 40, '#FFFFFF', OUTLINE, 6); ctx.restore();
  box(ctx, x + 14, 950, 172, 200, 12, '#0B0820', 8);
  _pubArcadeScreen(ctx, x + 22, 958, 156, 184, seed % 4, T, seed);
  ctx.beginPath(); ctx.moveTo(x - 10, 1170); ctx.lineTo(x + 210, 1170); ctx.lineTo(x + 222, 1236); ctx.lineTo(x - 22, 1236); ctx.closePath(); fillStroke(ctx, shade(col, -.15), 8);
  box(ctx, x + 40, 1146, 10, 44, 4, '#B8C2CC', 5); circle(ctx, x + 45, 1142, 14, '#EE384A', 5);
  for (let i = 0; i < 3; i++) circle(ctx, x + 110 + i * 30, 1200, 11, ['#FFD447', '#30CE65', '#2E9CCA'][i], 5);
  box(ctx, x + 64, 1310, 72, 100, 8, '#3B3550', 7);
  for (let i = 0; i < 2; i++) { box(ctx, x + 76 + i * 28, 1330, 20, 30, 4, (Math.floor(T * 2) + i + seed) % 2 ? '#FF8528' : '#FFD447', 4); }
}
function _pubPlush(ctx, x, y, col, kind, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (kind === 1) { starPath(ctx, 0, 0, 36, 18); fillStroke(ctx, col, 6); }
  else {
    if (kind === 0) { circle(ctx, -22, -24, 13, col, 6); circle(ctx, 22, -24, 13, col, 6); }
    else { ctx.beginPath(); ctx.moveTo(-20, -18); ctx.lineTo(-12, -40); ctx.lineTo(-2, -22); ctx.moveTo(4, -22); ctx.lineTo(14, -40); ctx.lineTo(22, -18); fillStroke(ctx, col, 6); }
    circle(ctx, 0, 0, 30, col, 6); ellipse(ctx, 0, 10, 13, 9, shade(col, .4));
  }
  circle(ctx, -9, -4, 4.5, OUTLINE); circle(ctx, 9, -4, 4.5, OUTLINE);
  ctx.restore();
}
function envArcade(ctx, T, cam, o = {}) {
  const g = ctx.createLinearGradient(0, -200, 0, FLOOR); g.addColorStop(0, '#120C2E'); g.addColorStop(1, '#2C1B5E');
  ctx.fillStyle = g; ctx.fillRect(-3000, -2000, 9000, 6000);
  const { dx } = par(cam, .9);
  ctx.save(); ctx.translate(dx, 0);
  // neon wall stripes + pixel invaders
  ctx.save(); ctx.globalAlpha = .9; for (const [y, c] of [[440, '#FF5B9B'], [470, '#20BDBB']]) { ctx.strokeStyle = c; ctx.globalAlpha = .25; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(6000, y); ctx.stroke(); ctx.globalAlpha = 1; ctx.lineWidth = 6; ctx.strokeStyle = shade(c, .5); ctx.stroke(); } ctx.restore();
  const inv = [[0, 1, 0, 0, 0, 1, 0], [0, 0, 1, 1, 1, 0, 0], [0, 1, 1, 1, 1, 1, 0], [1, 1, 0, 1, 0, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 0, 1, 0, 1, 0, 1]];
  for (const [ix, iy, c, ph] of [[20, 540, '#30CE65', 5], [210, 560, '#FF8528', 6], [-480, 600, '#30CE65', 0], [1460, 600, '#FFD447', 1], [-180, 180, '#7B4BFF', 2], [1220, 170, '#FF8528', 3], [1720, 230, '#20BDBB', 4]]) {
    const on = hash(Math.floor(T * 2) + ph) > .15; ctx.fillStyle = on ? c : shade(c, -.6);
    inv.forEach((row, r) => row.forEach((v, k) => { if (v) ctx.fillRect(ix + k * 18, iy + r * 18, 16, 16); }));
  }
  // ARCADE neon sign
  box(ctx, 160, 120, 760, 200, 30, '#1A1240', 9);
  const sgn = o.sign ?? 'ARCADE', flickIdx = Math.floor(hash(Math.floor(T * 6)) * sgn.length * 4);
  ctx.font = '150px "Lilita One"'; const totalW = ctx.measureText(sgn).width, fs = Math.min(150, 150 * 680 / totalW);
  ctx.font = `${fs}px "Lilita One"`; let cxp = 540 - ctx.measureText(sgn).width / 2;
  for (let i = 0; i < sgn.length; i++) { const cw = ctx.measureText(sgn[i]).width; _pubNeon(ctx, sgn[i], cxp + cw / 2, 222, fs, i % 2 ? '#20E0FF' : '#FF4FA0', i === flickIdx ? 0 : 1); ctx.font = `${fs}px "Lilita One"`; cxp += cw; }
  for (let i = 0; i < 12; i++) circle(ctx, 190 + i * 64, 132, 7, (Math.floor(T * 5) + i) % 3 ? '#FFD447' : '#FF8528');
  for (let i = 0; i < 12; i++) circle(ctx, 190 + i * 64, 308, 7, (Math.floor(T * 5) + i + 1) % 3 ? '#FFD447' : '#FF8528');
  // hi-score board above the centre cabinets
  box(ctx, 360, 560, 380, 190, 18, '#0B0820', 9);
  _pubNeon(ctx, 'HI-SCORE', 550, 612, 50, '#20E0FF');
  { const sc = String(90000 + Math.floor(T * 37) % 10000); for (let i = 0; i < sc.length; i++) { const on = (Math.floor(T * 4) + i) % 7 !== 0; txt(ctx, sc[i], 450 + i * 50, 692, 64, on ? '#FFD447' : '#6A5A20'); } }
  // prize wall
  box(ctx, 800, 520, 520, 600, 16, '#3A2A70', 9);
  _pubNeon(ctx, 'PRIZES', 930, 590, 64, '#FFD447', hash(Math.floor(T * 3) + 9) > .1 ? 1 : .3);
  for (let r = 0; r < 3; r++) {
    const y = 760 + r * 140; box(ctx, 816, y + 36, 488, 16, 4, '#8A6AD8', 6);
    for (let k = 0; k < 6; k++) _pubPlush(ctx, 860 + k * 80, y, _PUB_PAL[(r * 3 + k * 5) % 8], (r + k) % 3, .95);
  }
  ctx.restore();
  // carpet
  _pubCarpet(ctx, cam, '#17123A', ['#FF4FA0', '#20E0FF', '#FFD447', '#8A5BFF'], 7, 150);
  _pubFloorLine(ctx);
  // extra cabinets (left / right, off main frame)
  _pubCabinet(ctx, -520, '#30CE65', T, 5, 'RACER'); _pubCabinet(ctx, -300, '#FF8528', T, 6, 'BLASTER');
  _pubCabinet(ctx, 1340, '#7B4BFF', T, 7, 'GHOST'); _pubCabinet(ctx, 1560, '#EE384A', T, 4, 'SPACE');
  // center cabinets
  _pubCabinet(ctx, 340, '#2E9CCA', T, 0, 'SPACE'); _pubCabinet(ctx, 560, '#FF5B9B', T, 1, 'PONG');
  // claw machine
  const cx0 = -30, cw = 340;
  _pubShadow(ctx, cx0 + cw / 2, cw + 30);
  _pubGlow(ctx, cx0 + cw / 2, 1000, 280, '#FF5B9B', .3);
  box(ctx, cx0, 1210, cw, 290, 16, '#FF5B9B', 9);
  box(ctx, cx0 + 30, 1300, 110, 120, 12, '#3B3550', 7); box(ctx, cx0 + 40, 1310, 90, 40, 6, '#120C2E', 0);
  box(ctx, cx0 + 180, 1240, 130, 50, 10, '#E03F82', 7); box(ctx, cx0 + 216, 1214, 10, 40, 4, '#B8C2CC', 5); circle(ctx, cx0 + 221, 1210, 14, '#FFD447', 5); circle(ctx, cx0 + 280, 1264, 14, '#30CE65', 5);
  ctx.save(); rr(ctx, cx0 + 14, 800, cw - 28, 410, 8); ctx.clip();
  ctx.fillStyle = 'rgba(150,220,255,.22)'; ctx.fillRect(cx0, 800, cw, 410);
  const pr = rng(31);
  for (let i = 0; i < 14; i++) { const px = cx0 + 50 + (i % 5) * 60 + (Math.floor(i / 5) % 2) * 28, py = 1180 - Math.floor(i / 5) * 46; _pubPlush(ctx, px, py, _PUB_PAL[Math.floor(pr() * 8)], Math.floor(pr() * 3), .9); }
  const clx = cx0 + cw / 2 + Math.sin(T * .7) * 110, cly = 900 + (Math.sin(T * .5) * .5 + .5) * 120;
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(clx, 800); ctx.lineTo(clx, cly); ctx.stroke();
  box(ctx, clx - 20, cly - 8, 40, 26, 6, '#B8C2CC', 6);
  ctx.lineWidth = 7; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.moveTo(clx - 14, cly + 16); ctx.quadraticCurveTo(clx - 40, cly + 40, clx - 18, cly + 62); ctx.moveTo(clx + 14, cly + 16); ctx.quadraticCurveTo(clx + 40, cly + 40, clx + 18, cly + 62); ctx.stroke();
  ctx.strokeStyle = '#D8DDE8'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.beginPath(); ctx.moveTo(cx0 + 40, 800); ctx.lineTo(cx0 + 100, 800); ctx.lineTo(cx0 + 14, 960); ctx.lineTo(cx0 + 14, 880); ctx.fill();
  ctx.restore();
  rr(ctx, cx0 + 14, 800, cw - 28, 410, 8); fillStroke(ctx, null, 8);
  box(ctx, cx0 - 10, 690, cw + 20, 120, 18, '#FF5B9B', 9);
  _pubNeon(ctx, 'CLAW', cx0 + cw / 2, 752, 66, '#FFD447');
  for (let i = 0; i < 8; i++) circle(ctx, cx0 + 20 + i * 43, 700, 7, (Math.floor(T * 6) + i) % 2 ? '#FFFFFF' : '#20E0FF');
  box(ctx, cx0 + 2, 800, 12, 410, 4, '#E03F82', 6); box(ctx, cx0 + cw - 14, 800, 12, 410, 4, '#E03F82', 6);
  // prize counter (glass case)
  _pubShadow(ctx, 1060, 520);
  box(ctx, 800, 1200, 520, 300, 14, '#2E1F5C', 9);
  ctx.save(); rr(ctx, 818, 1220, 484, 150, 8); ctx.clip(); ctx.fillStyle = 'rgba(150,220,255,.25)'; ctx.fillRect(818, 1220, 484, 150);
  const qr = rng(9); for (let i = 0; i < 9; i++) { const x = 850 + i * 52, y = 1340; const k = i % 3; if (k === 0) circle(ctx, x, y, 20, _PUB_PAL[Math.floor(qr() * 8)], 5); else if (k === 1) { box(ctx, x - 22, y - 12, 44, 24, 10, _PUB_PAL[Math.floor(qr() * 8)], 5); } else { starPath(ctx, x, y - 4, 22, 10); fillStroke(ctx, '#FFD447', 5); } }
  ctx.restore(); rr(ctx, 818, 1220, 484, 150, 8); fillStroke(ctx, null, 7);
  box(ctx, 784, 1180, 552, 32, 10, '#8A6AD8', 9);
  box(ctx, 1150, 1080, 140, 100, 12, '#120C2E', 8); txt(ctx, 'TICKETS', 1220, 1108, 26, '#FFD447'); txt(ctx, String(1200 + Math.floor(T * 7) % 100), 1220, 1146, 40, '#FF4FA0');
  for (let i = 0; i < 6; i++) { ctx.save(); ctx.translate(880 + i * 10, 1180); ctx.rotate(-.2 + i * .05); box(ctx, -18, -26 - i * 4, 36, 22, 3, '#FF8528', 4); ctx.restore(); }
}

// ================= 9. PIZZERIA =================
function _pubPizza(ctx, x, y, rx, ry, slicesMissing = 0) {
  ellipse(ctx, x, y, rx, ry, '#E3A04F', 8);
  ellipse(ctx, x, y, rx * .86, ry * .84, '#FFD45C', 0);
  const r = rng(Math.round(x));
  for (let i = 0; i < 9; i++) { const a = r() * TAU, d = .25 + r() * .55; ellipse(ctx, x + Math.cos(a) * rx * d * .86, y + Math.sin(a) * ry * d * .84, rx * .1, ry * .1, '#D9473E', 4); }
  for (let i = 0; i < 6; i++) { const a = r() * TAU, d = .2 + r() * .6; ellipse(ctx, x + Math.cos(a) * rx * d * .8, y + Math.sin(a) * ry * d * .8, rx * .04, ry * .03, '#3FA34D'); }
  ctx.strokeStyle = 'rgba(160,90,30,.6)'; ctx.lineWidth = 4; ctx.beginPath();
  for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; ctx.moveTo(x - Math.cos(a) * rx * .86, y - Math.sin(a) * ry * .84); ctx.lineTo(x + Math.cos(a) * rx * .86, y + Math.sin(a) * ry * .84); } ctx.stroke();
}
function envPizzeria(ctx, T, cam, o = {}) {
  _pubBg(ctx, '#FFE7B8');
  const { dx } = par(cam, .9);
  ctx.save(); ctx.translate(dx, 0);
  // wainscot: red/white tiles
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-3000, 1060, 9000, 460);
  ctx.fillStyle = '#E04A3F'; for (let i = -60; i < 120; i++) for (let k = 0; k < 8; k++) if ((i + k) % 2) ctx.fillRect(i * 60, 1080 + k * 60, 60, 60);
  box(ctx, -3000, 1050, 9000, 32, 0, '#2F8F5B', 8);
  // hanging lamps
  for (const x of [400, 760, -420, 1500]) {
    const sw = Math.sin(T * 1.2 + x) * 4;
    ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, -400); ctx.lineTo(x + sw, 330); ctx.stroke();
    _pubGlow(ctx, x + sw, 400, 200, '#FFD98A', .5);
    ctx.beginPath(); ctx.moveTo(x + sw - 26, 330); ctx.lineTo(x + sw + 26, 330); ctx.lineTo(x + sw + 64, 390); ctx.lineTo(x + sw - 64, 390); ctx.closePath(); fillStroke(ctx, '#2F8F5B', 8);
    ellipse(ctx, x + sw, 394, 26, 12, '#FFF6C8', 5);
  }
  // menu board
  box(ctx, 560, 200, 490, 420, 20, '#6E3E1E', 10);
  box(ctx, 584, 224, 442, 372, 10, '#2B2B2B', 7);
  _pubFit(ctx, o.board ?? 'MENU', 805, 288, 380, 76, '#FFD447', OUTLINE, 9);
  const menu = o.menu || [['PIZZA', '$3'], ['SLICE', '$1'], ['SODA', '$1'], ['SALAD', '$2']];
  menu.slice(0, 4).forEach(([a, b], i) => { const y = 378 + i * 60; _pubFit(ctx, a, 720, y, 220, 46, '#FFFFFF'); txt(ctx, b, 940, y, 46, '#7EE3B0'); ctx.fillStyle = 'rgba(255,255,255,.3)'; for (let k = 0; k < 5; k++) ctx.fillRect(840 + k * 14, y + 8, 6, 4); });
  // PIZZA neon over the oven
  box(ctx, 40, 150, 440, 150, 26, '#2B1A12', 9);
  { ctx.font = '104px "Lilita One"'; const sw = ctx.measureText(o.sign ?? 'PIZZA').width;
    _pubNeon(ctx, o.sign ?? 'PIZZA', 260, 228, Math.min(104, 104 * 380 / sw), '#FF5040', hash(Math.floor(T * 4)) > .06 ? 1 : .2); }
  // window right
  _pubWindow(ctx, 1220, 300, 420, 520, T, { seed: 10, tree: true });
  box(ctx, 1200, 280, 460, 50, 16, '#E04A3F', 8); for (let k = 0; k < 8; k++) { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(1214 + k * 56, 288, 28, 34); }
  ctx.restore();
  _pubChecker(ctx, cam, '#F4E6CC', '#D9895F', 150);
  _pubFloorLine(ctx);
  // brick oven
  const ox = 60;
  _pubShadow(ctx, ox, 520);
  box(ctx, ox - 30, 340, 90, 360, 6, '#B04A32', 9);
  ctx.beginPath(); ctx.moveTo(ox - 250, 1500); ctx.lineTo(ox - 250, 880); ctx.bezierCurveTo(ox - 250, 650, ox + 250, 650, ox + 250, 880); ctx.lineTo(ox + 250, 1500); ctx.closePath(); fillStroke(ctx, '#C9583C', 10);
  ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(110,40,20,.45)'; ctx.lineWidth = 4; ctx.beginPath();
  for (let r = 0; r < 18; r++) { const y = 700 + r * 46; ctx.moveTo(ox - 260, y); ctx.lineTo(ox + 260, y); for (let c = 0; c < 8; c++) { const x = ox - 260 + c * 80 + (r % 2) * 40; ctx.moveTo(x, y); ctx.lineTo(x, y + 46); } } ctx.stroke(); ctx.restore();
  box(ctx, ox - 270, 1150, 540, 40, 10, '#8A5A2B', 9);
  // mouth + fire
  ctx.beginPath(); ctx.moveTo(ox - 130, 1150); ctx.lineTo(ox - 130, 1000); ctx.arc(ox, 1000, 130, Math.PI, TAU); ctx.lineTo(ox + 130, 1150); ctx.closePath(); fillStroke(ctx, '#2A1410', 10);
  ctx.save(); ctx.clip();
  _pubGlow(ctx, ox, 1120, 200, '#FF8528', .9);
  for (let i = 0; i < 6; i++) { const fx = ox - 90 + i * 36, fh = 70 + noise1(T * 5 + i * 2.3) * 26 + (i % 2) * 16;
    ctx.beginPath(); ctx.moveTo(fx - 26, 1150); ctx.quadraticCurveTo(fx - 22, 1150 - fh * .6, fx + Math.sin(T * 6 + i) * 6, 1150 - fh); ctx.quadraticCurveTo(fx + 22, 1150 - fh * .6, fx + 26, 1150); ctx.closePath(); fillStroke(ctx, i % 2 ? '#FFB020' : '#FF6A20', 0);
    ctx.beginPath(); ctx.moveTo(fx - 12, 1150); ctx.quadraticCurveTo(fx, 1150 - fh * .6, fx + 12, 1150); ctx.fillStyle = '#FFE680'; ctx.fill(); }
  ctx.restore();
  _pubGlow(ctx, ox, 1080, 320, '#FF9A40', .35 + .08 * Math.sin(T * 7));
  // logs + peel
  for (let i = 0; i < 3; i++) { box(ctx, ox - 230 + i * 30, 1420 - i * 34, 150, 34, 16, '#8A5A2B', 7); circle(ctx, ox - 230 + i * 30 + 135, 1437 - i * 34, 14, '#D99A55', 5); }
  ctx.save(); ctx.translate(ox + 200, 1500); ctx.rotate(.22); box(ctx, -8, -420, 16, 300, 6, '#D99A55', 7); ellipse(ctx, 0, -100, 60, 90, '#E0B070', 8); ctx.restore();
  // counter with pizza display (right)
  _pubShadow(ctx, 1100, 820);
  box(ctx, 700, 1210, 800, 290, 12, '#E04A3F', 9);
  box(ctx, 700, 1290, 800, 34, 0, '#FFFFFF', 7);
  box(ctx, 680, 1190, 840, 34, 10, '#F4F0E6', 9);
  ctx.save(); rr(ctx, 720, 1040, 380, 150, 10); ctx.clip(); ctx.fillStyle = 'rgba(190,235,255,.35)'; ctx.fillRect(720, 1040, 380, 150);
  _pubPizza(ctx, 830, 1150, 95, 30); _pubPizza(ctx, 1000, 1150, 90, 28);
  ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.moveTo(760, 1040); ctx.lineTo(800, 1040); ctx.lineTo(730, 1190); ctx.lineTo(720, 1150); ctx.fill();
  ctx.restore(); rr(ctx, 720, 1040, 380, 150, 10); fillStroke(ctx, null, 7);
  box(ctx, 1160, 1100, 140, 90, 12, '#3B3550', 8); box(ctx, 1176, 1114, 108, 46, 6, '#7EE3B0', 0); txt(ctx, '$3.00', 1230, 1138, 28, '#14532D');
  for (let k = 0; k < 3; k++) box(ctx, 1340, 1180 - k * 22, 140, 22, 4, '#F4F0E6', 6);
  box(ctx, 1370, 1112, 80, 4, 2, '#E04A3F', 0);
  // back tables with checkered cloths (far left / right)
  for (const x of [-620, 1720]) _pubCheckTable(ctx, x, 1290, 300, T, false);
}
function _pubCheckTable(ctx, x, y, w, T, pizza = true) {
  _pubShadow(ctx, x, w + 40);
  box(ctx, x - 16, y + 60, 32, 1500 - y - 60, 6, '#3B3550', 7); box(ctx, x - 70, 1484, 140, 18, 6, '#3B3550', 6);
  const top = y, hang = 120;
  ctx.save(); rr(ctx, x - w / 2, top, w, hang, 10); ctx.clip();
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x - w / 2, top, w, hang); ctx.fillStyle = '#E04A3F';
  for (let i = 0; i < Math.ceil(w / 30); i++) for (let k = 0; k < 5; k++) if ((i + k) % 2) ctx.fillRect(x - w / 2 + i * 30, top + k * 30, 30, 30);
  ctx.fillStyle = 'rgba(224,74,63,.35)'; for (let i = 0; i < Math.ceil(w / 30); i++) ctx.fillRect(x - w / 2 + i * 30, top, 15, hang);
  ctx.restore(); rr(ctx, x - w / 2, top, w, hang, 10); fillStroke(ctx, null, 8);
  box(ctx, x - w / 2 - 8, top - 10, w + 16, 22, 8, '#FFFFFF', 8);
  if (pizza) {
    box(ctx, x - 8, top - 40, 16, 32, 4, '#B8C2CC', 5); _pubPizza(ctx, x, top - 50, w * .3, 28);
    for (const s of [-1, 1]) { const cx = x + s * w * .38; box(ctx, cx - 22, top - 70, 44, 62, 8, s < 0 ? '#2E9CCA' : '#FF5B9B', 6); ctx.save(); ctx.translate(cx + 6, top - 70); ctx.rotate(.25); box(ctx, -4, -40, 8, 44, 3, '#FFFFFF', 4); ctx.restore(); }
  }
}
// Front layer: o.kind 'table' (default; checkered table with pizza at o.x = 540, o.w 560) or 'counter' (order counter at o.x)
function envPizzeriaFront(ctx, T, cam, o = {}) {
  const x = o.x ?? 540;
  if (o.kind === 'counter') {
    const y = 1330;
    ellipse(ctx, x, y + 262, 330, 20, 'rgba(20,10,40,.15)');
    box(ctx, x - 300, y + 30, 600, 230, 12, '#E04A3F', 9); box(ctx, x - 300, y + 100, 600, 34, 0, '#FFFFFF', 7);
    box(ctx, x - 320, y, 640, 40, 10, '#F4F0E6', 9);
    for (let k = 0; k < 3; k++) box(ctx, x - 260, y - 22 - k * 22, 180, 22, 4, '#F4F0E6', 6);
    box(ctx, x - 210, y - 82, 80, 4, 2, '#E04A3F', 0);
    box(ctx, x + 150, y - 90, 140, 90, 12, '#3B3550', 8); box(ctx, x + 166, y - 76, 108, 46, 6, '#7EE3B0', 0); txt(ctx, '$3.00', x + 220, y - 52, 28, '#14532D');
    return;
  }
  _pubCheckTable(ctx, x, 1350, o.w ?? 560, T, true);
}

registerSet('classroom', envClassroom, 'Classroom: chalkboard, alphabet strip, clock, cubbies, teacher desk w/ globe; FRONT envClassroomFront = student desks at o.desks (kids look seated)', "{board:'TEXT', doodles:false} front:{desks:[380,700]}", ['school']);
registerSet('cafeteria', envCafeteria, 'School cafeteria: window, menu board, serving line with food + sneeze guard, bins; FRONT envCafeteriaFront = long lunch table + bench with trays', "{board:'LUNCH MENU', menu:['PIZZA',...]} front:{trays:[380,700]}", ['school']);
registerSet('library', envLibrary, 'Library: tall bookshelves, arched window, QUIET sign, low shelf + globe, reading table + lamp, beanbags, rug', "{sign:'QUIET PLEASE'}", ['school', 'public']);
registerSet('supermarket', envSupermarket, 'Supermarket aisle: freezers with glow, product shelves, SALE signs, hanging aisle sign, cart, checkout lane; FRONT envSupermarketFront = checkout counter at o.x', "{sign:'SNACKS', aisle:5} front:{x:700}", ['public']);
registerSet('doctorOffice', envDoctorOffice, "Doctor's office: cabinets, eye chart, height chart, exam bed with paper, poster, window, sink, scale", "{poster:'WASH YOUR HANDS!'}", ['public']);
registerSet('birthdayParty', envBirthdayParty, 'Birthday party room: banner, bunting, bobbing balloons, presents, cake table, confetti; FRONT envBirthdayPartyFront = cake table at o.x', "{text:'HAPPY BIRTHDAY!', falling} front:{x:540, candles:5, lit:false}", ['public', 'home']);
registerSet('movieTheater', envMovieTheater, 'Movie theater: glowing screen, curtains, projector beam, back seat row; FRONT envMovieTheaterFront = seat backs so kids look seated', "{screen:'#hex'|fn, text:'THE END', dark:.5} front:{popcorn:[540]}", ['public', 'night']);
registerSet('arcade', envArcade, 'Arcade: neon ARCADE sign, blinking game cabinets, claw machine, prize counter + plush wall, neon carpet', "{sign:'ARCADE'}", ['public', 'night']);
registerSet('pizzeria', envPizzeria, 'Pizzeria: brick oven with fire, PIZZA neon, menu board, counter with pizza display; FRONT envPizzeriaFront = checkered table w/ pizza (or kind:counter)', "{board:'MENU', menu:[['PIZZA','$3']], sign:'PIZZA'} front:{x:540, kind:'table'|'counter'}", ['public']);
