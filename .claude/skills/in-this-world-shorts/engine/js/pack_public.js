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
