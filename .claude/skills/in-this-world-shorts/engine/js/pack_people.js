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
