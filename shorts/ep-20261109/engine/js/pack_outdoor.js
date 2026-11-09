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
