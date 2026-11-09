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
  ctx.save(); ctx.translate(1175, 1196 + dy);
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
