// env.js — layered vector environments. Each env draws in WORLD coordinates (floor line ~ y=1500)
// and takes the camera so far layers can parallax.
'use strict';
const FLOOR = 1500;
// ---- set registry (packs call registerSet; PACK_SETS[id].draw is the background fn) ----
const PACK_SETS = {};
function registerSet(id, draw, desc = '', options = '', tags = []) { PACK_SETS[id] = { id, draw, desc, options, tags: [].concat(tags) }; }

function par(cam, k) { return { dx: (cam.x - 540) * (1 - k), dy: (cam.y - 960) * (1 - k) * .5 }; }

function txt(ctx, s, x, y, size, fill, stroke = OUTLINE, lw = 0, font = 'Lilita One', align = 'center') {
  ctx.font = `${size}px "${font}"`; ctx.textAlign = align; ctx.textBaseline = 'middle';
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
  ctx.fillStyle = fill; ctx.fillText(s, x, y);
}

// ---------------- School hallway (day) ----------------
function envHallway(ctx, t, cam, o = {}) {
  ctx.fillStyle = '#FFE6BD'; ctx.fillRect(-3000, -2000, 9000, 6000);
  // far wall: windows with sky (parallax .5)
  let { dx } = par(cam, .55);
  ctx.save(); ctx.translate(dx, 0);
  for (let i = -3; i < 9; i++) {
    const x = i * 560 + 60;
    box(ctx, x, 180, 300, 420, 24, '#80CDF5', 10);
    ctx.fillStyle = '#fff'; ellipse(ctx, x + 90, 300, 60, 22, 'rgba(255,255,255,.9)'); ellipse(ctx, x + 200, 420, 46, 16, 'rgba(255,255,255,.8)');
    ctx.fillStyle = OUTLINE; ctx.fillRect(x + 146, 180, 8, 420); ctx.fillRect(x, 386, 300, 8);
  }
  ctx.restore();
  ctx.fillStyle = '#F2A65A'; ctx.fillRect(-3000, 700, 9000, 40);
  // lockers (parallax .85)
  ({ dx } = par(cam, .85));
  ctx.save(); ctx.translate(dx, 0);
  for (let i = -8; i < 26; i++) {
    const x = i * 150, col = i % 7 === 3 ? '#FF8528' : '#2E9CCA';
    box(ctx, x, 760, 146, 740, 10, col, 8);
    ctx.fillStyle = shade(col, -.25);
    for (let k = 0; k < 4; k++) box(ctx, x + 36, 800 + k * 22, 74, 8, 4, shade(col, -.25), 0);
    box(ctx, x + 112, 1040, 14, 70, 6, '#D8DDE8', 5);
  }
  // bulletin board + posters (o.board to show the final photo)
  if (o.posters !== false) {
    box(ctx, 860, 250, 520, 380, 20, '#C98B4B', 10);
    box(ctx, 890, 280, 220, 150, 8, '#FF5B9B', 6); txt(ctx, 'SCHOOL', 1000, 330, 46, '#fff'); txt(ctx, 'DANCE', 1000, 380, 46, '#FFD447');
    box(ctx, 1140, 300, 210, 130, 8, '#fff', 6); txt(ctx, 'FRIDAY', 1245, 365, 48, '#EE384A');
    box(ctx, 900, 460, 200, 140, 8, '#30CE65', 6); txt(ctx, 'BE KIND', 1000, 530, 44, '#fff');
    if (o.photo) o.photo(ctx);
  }
  ctx.restore();
  // floor
  const g = ctx.createLinearGradient(0, FLOOR, 0, FLOOR + 600); g.addColorStop(0, '#E9D3B0'); g.addColorStop(1, '#D9BE95');
  ctx.fillStyle = g; ctx.fillRect(-3000, FLOOR, 9000, 2000);
  ctx.strokeStyle = 'rgba(120,80,40,.25)'; ctx.lineWidth = 5;
  for (let i = -30; i < 40; i++) { ctx.beginPath(); ctx.moveTo(i * 160, FLOOR); ctx.lineTo(i * 160 + (i * 160 - cam.x) * .9, FLOOR + 900); ctx.stroke(); }
  for (let k = 1; k < 6; k++) { const y = FLOOR + k * k * 22; ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(6000, y); ctx.stroke(); }
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - 4, 9000, 10);
}

// ---------------- Concert stage (night) ----------------
function envConcert(ctx, t, cam) {
  const g = ctx.createLinearGradient(0, -400, 0, 1900); g.addColorStop(0, '#120C33'); g.addColorStop(1, '#3B1670');
  ctx.fillStyle = g; ctx.fillRect(-3000, -2000, 9000, 6000);
  // spotlights
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const cols = ['#FF5B9B', '#20BDBB', '#FFD447', '#7B4BFF'];
  for (let i = 0; i < 4; i++) {
    const a = Math.sin(t * 1.4 + i * 1.7) * .35, x = 100 + i * 300;
    ctx.save(); ctx.translate(x, -100); ctx.rotate(a);
    const lg = ctx.createLinearGradient(0, 0, 0, 1600); lg.addColorStop(0, cols[i] + 'aa'); lg.addColorStop(1, cols[i] + '00');
    ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.lineTo(260, 1600); ctx.lineTo(-260, 1600); ctx.fill(); ctx.restore();
  }
  ctx.restore();
  // big screen
  box(ctx, 140, 160, 800, 420, 30, '#24225B', 12);
  for (let i = 0; i < 30; i++) { const r = rng(i + 3); starPath(ctx, 180 + r() * 720, 200 + r() * 340, 12 + r() * 10, 5, 4, t * 2 + i); fillStroke(ctx, `hsla(${(i * 40 + t * 120) % 360},90%,70%,.85)`, 0); }
  txt(ctx, 'LIVE!', 540, 370, 150, '#FFD447', OUTLINE, 18);
  // stage
  box(ctx, -600, FLOOR - 60, 2300, 120, 10, '#2A1E4F', 10);
  ctx.fillStyle = '#FFD447'; for (let i = 0; i < 18; i++) circle(ctx, -400 + i * 120, FLOOR - 4, 10, (Math.floor(t * 6) + i) % 2 ? '#FFD447' : '#FF8528');
  ctx.fillStyle = '#1A1238'; ctx.fillRect(-3000, FLOOR + 60, 9000, 2000);
}
function concertCrowd(ctx, t) { // foreground silhouettes with phone lights
  for (let i = 0; i < 14; i++) {
    const x = -60 + i * 90, y = 1820 + (i % 3) * 30 + Math.sin(t * 6 + i) * 12;
    box(ctx, x - 50, y - 90, 100, 90, 22, '#0D0A22', 0); box(ctx, x - 60, y, 120, 200, 20, '#0D0A22', 0);
    if (i % 3 === 0) { ctx.save(); ctx.translate(x + 40, y - 140); ctx.rotate(Math.sin(t * 3 + i) * .3); box(ctx, -12, -30, 24, 44, 5, '#0D0A22', 0); circle(ctx, 0, -18, 8, '#FFF6C8'); ctx.restore(); }
  }
}

// ---------------- Backyard ----------------
function envBackyard(ctx, t, cam) {
  const g = ctx.createLinearGradient(0, -300, 0, FLOOR); g.addColorStop(0, '#5EB8F0'); g.addColorStop(1, '#BDE8FF');
  ctx.fillStyle = g; ctx.fillRect(-3000, -2000, 9000, 6000);
  let { dx } = par(cam, .3);
  ctx.save(); ctx.translate(dx, 0);
  for (let i = 0; i < 5; i++) { const x = ((i * 520 + t * 20) % 2600) - 600, y = 220 + (i % 2) * 160; for (const [ox, r] of [[0, 60], [60, 80], [130, 56]]) circle(ctx, x + ox, y, r, '#fff'); }
  ctx.restore();
  ({ dx } = par(cam, .7));
  ctx.save(); ctx.translate(dx, 0);
  for (let i = -6; i < 20; i++) { box(ctx, i * 110, 950, 96, 560, 14, '#F4E3C3', 7); ctx.beginPath(); ctx.moveTo(i * 110, 960); ctx.lineTo(i * 110 + 48, 900); ctx.lineTo(i * 110 + 96, 960); fillStroke(ctx, '#F4E3C3', 7); }
  box(ctx, -800, 1080, 3000, 30, 6, '#E2CBA4', 6); box(ctx, -800, 1340, 3000, 30, 6, '#E2CBA4', 6);
  // tree
  box(ctx, 900, 700, 90, 800, 16, '#8A5A2B', 8);
  for (const [x, y, r] of [[945, 640, 190], [820, 760, 140], [1080, 760, 150]]) { rr(ctx, x - r, y - r, r * 2, r * 2, 60); fillStroke(ctx, '#3FA34D', 9); }
  ctx.restore();
  // dog house
  box(ctx, -60, 1180, 340, 320, 14, '#EE384A', 9);
  ctx.beginPath(); ctx.moveTo(-100, 1200); ctx.lineTo(110, 1020); ctx.lineTo(320, 1200); ctx.closePath(); fillStroke(ctx, '#7B4BFF', 9);
  rr(ctx, 50, 1300, 120, 200, 60); fillStroke(ctx, '#2A1E1E', 8);
  ctx.fillStyle = '#65C75A'; ctx.fillRect(-3000, FLOOR, 9000, 2000);
  for (let i = 0; i < 80; i++) { const r = rng(i * 13); const x = -800 + r() * 2800, y = FLOOR + 20 + r() * 380; ctx.strokeStyle = '#4DAE45'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y - 22); ctx.moveTo(x, y); ctx.lineTo(x + 8, y - 20); ctx.stroke(); }
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - 3, 9000, 8);
}

// ---------------- Kitchen ----------------
function envKitchen(ctx, t, cam, o = {}) {
  ctx.fillStyle = o.night ? '#5A5F9A' : '#9FD8CB'; ctx.fillRect(-3000, -2000, 9000, 6000);
  // checker backsplash
  for (let i = -10; i < 30; i++) for (let k = 0; k < 4; k++) { ctx.fillStyle = (i + k) % 2 ? '#FFFFFF' : '#F2E8D5'; ctx.fillRect(i * 70, 860 + k * 70, 70, 70); }
  // window
  box(ctx, 340, 240, 400, 440, 24, o.night ? '#24225B' : '#BDE8FF', 10);
  if (o.night) { circle(ctx, 640, 340, 46, '#F2C786'); } else { circle(ctx, 450, 340, 50, '#FFD447'); }
  ctx.fillStyle = OUTLINE; ctx.fillRect(536, 240, 8, 440); ctx.fillRect(340, 456, 400, 8);
  box(ctx, 300, 200, 480, 60, 20, '#FF8528', 9);
  // upper cabinets
  for (let i = 0; i < 3; i++) { box(ctx, -560 + i * 280, 240, 260, 360, 16, '#F2C786', 9); box(ctx, -560 + i * 280 + 110, 500, 40, 14, 6, '#8A5A2B', 5); }
  for (let i = 0; i < 2; i++) { box(ctx, 980 + i * 280, 240, 260, 360, 16, '#F2C786', 9); }
  // fridge
  box(ctx, 1560, 360, 360, 1140, 30, '#E8F2F7', 10); box(ctx, 1560, 360, 360, 400, 30, '#E8F2F7', 10); box(ctx, 1600, 600, 22, 110, 8, '#B8C2CC', 5);
  // counter
  box(ctx, -900, 1140, 2440, 60, 12, '#FF5B9B', 9); box(ctx, -880, 1200, 2400, 300, 12, '#F2C786', 9);
  for (let i = 0; i < 8; i++) box(ctx, -860 + i * 300, 1230, 270, 250, 12, shade('#F2C786', -.06), 7);
  ctx.fillStyle = '#C9785B'; ctx.fillRect(-3000, FLOOR, 9000, 2000);
  for (let i = -20; i < 40; i++) { ctx.fillStyle = i % 2 ? '#B8664A' : '#C9785B'; ctx.fillRect(i * 140, FLOOR, 140, 900); }
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - 3, 9000, 8);
}

// ---------------- Gym / school dance (night) ----------------
function envGym(ctx, t, cam, o = {}) {
  const dim = o.dim || 0;
  const g = ctx.createLinearGradient(0, -200, 0, FLOOR); g.addColorStop(0, '#1D1846'); g.addColorStop(1, '#3A2C78');
  ctx.fillStyle = g; ctx.fillRect(-3000, -2000, 9000, 6000);
  let { dx } = par(cam, .6);
  ctx.save(); ctx.translate(dx, 0);
  // banner + bunting
  box(ctx, 140, 120, 800, 170, 26, o.bannerC || '#FF5B9B', 10); txt(ctx, o.banner || 'SCHOOL DANCE', 540, 210, 104, '#fff', OUTLINE, 14);
  for (let i = -6; i < 16; i++) { ctx.beginPath(); ctx.moveTo(i * 120, 330); ctx.lineTo(i * 120 + 120, 330); ctx.lineTo(i * 120 + 60, 410); ctx.closePath(); fillStroke(ctx, ['#FFD447', '#20BDBB', '#FF8528', '#30CE65'][(i + 12) % 4], 6); }
  // stage with curtains
  box(ctx, -200, 560, 1480, 640, 20, '#2B1E5C', 10);
  for (const s of [-1, 1]) { const x = s < 0 ? -200 : 1060; box(ctx, x, 560, 220, 640, 20, '#B3263A', 10); for (let k = 1; k < 4; k++) { ctx.strokeStyle = '#7E1A29'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x + k * 55, 580); ctx.lineTo(x + k * 55, 1180); ctx.stroke(); } }
  box(ctx, -260, 1180, 1600, 80, 10, '#8A5A2B', 10);
  ctx.restore();
  // disco ball
  const bx = 540 + dx * .3, by = 520;
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bx, -100); ctx.lineTo(bx, by - 90); ctx.stroke();
  circle(ctx, bx, by, 90, '#C8D2E8', 9);
  ctx.save(); ctx.beginPath(); ctx.arc(bx, by, 86, 0, TAU); ctx.clip();
  for (let i = -5; i < 6; i++) for (let k = -5; k < 6; k++) { const on = hash(i * 7 + k * 13 + Math.floor(t * 8)) > .6; ctx.fillStyle = on ? '#fff' : (i + k) % 2 ? '#9AA6C4' : '#B6C0DA'; ctx.fillRect(bx + i * 18 + ((t * 40) % 18), by + k * 18, 16, 16); }
  ctx.restore();
  // colored light beams
  if (!o.noLights) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1 - dim;
    const cols = ['#FF5B9B', '#20BDBB', '#FFD447', '#7B4BFF', '#30CE65'];
    for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(bx, by); ctx.rotate(t * .8 + i * TAU / 5);
      const lg = ctx.createLinearGradient(0, 0, 1400, 0); lg.addColorStop(0, cols[i] + '88'); lg.addColorStop(1, cols[i] + '00');
      ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -120); ctx.lineTo(1400, 120); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.restore();
  }
  // wood floor with light spots
  const fg = ctx.createLinearGradient(0, FLOOR, 0, FLOOR + 600); fg.addColorStop(0, '#C9874A'); fg.addColorStop(1, '#A86A35');
  ctx.fillStyle = fg; ctx.fillRect(-3000, FLOOR, 9000, 2000);
  ctx.strokeStyle = 'rgba(80,40,10,.3)'; ctx.lineWidth = 4;
  for (let i = -30; i < 40; i++) { ctx.beginPath(); ctx.moveTo(i * 120, FLOOR); ctx.lineTo(i * 120 + (i * 120 - cam.x) * .8, FLOOR + 800); ctx.stroke(); }
  if (!o.noLights) { ctx.save(); ctx.globalAlpha = .35 * (1 - dim); for (let i = 0; i < 8; i++) { const x = 540 + Math.sin(t * 1.3 + i * 2.1) * 700, y = FLOOR + 140 + (i % 3) * 110; ellipse(ctx, x, y, 110, 34, ['#FF5B9B', '#20BDBB', '#FFD447', '#7B4BFF'][i % 4]); } ctx.restore(); }
  ctx.fillStyle = OUTLINE; ctx.fillRect(-3000, FLOOR - 3, 9000, 8);
  if (dim) { ctx.fillStyle = `rgba(10,8,30,${dim * .55})`; ctx.fillRect(-3000, -2000, 9000, 6000); }
}

// ---------------- Reaction backdrops (screen space) ----------------
function envBurst(ctx, t, c1 = '#FFD447', c2 = '#FF8528', spin = .3) {
  ctx.fillStyle = c1; ctx.fillRect(-2000, -2000, 6000, 6000);
  ctx.save(); ctx.translate(540, 900); ctx.rotate(t * spin); ctx.fillStyle = c2;
  for (let i = 0; i < 16; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 2400, i * TAU / 16, i * TAU / 16 + TAU / 32); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
function envSoft(ctx, t, c1 = '#FFB3D1', c2 = '#7B4BFF') {
  const g = ctx.createRadialGradient(540, 900, 50, 540, 900, 1400); g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(-2000, -2000, 6000, 6000);
  for (let i = 0; i < 24; i++) { const r = rng(i * 5 + 1); const x = r() * 1080, y = ((r() * 1920 - t * (40 + r() * 60)) % 2100 + 2100) % 2100 - 100;
    ctx.save(); ctx.globalAlpha = .35; heartPath(ctx, x, y, 18 + r() * 26); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore(); }
}

registerSet('hallway', envHallway, 'School hallway: lockers, windows, bulletin board', '{posters:false, photo:fn}', ['school']);
registerSet('concert', envConcert, 'Concert stage at night with spotlights and a LIVE screen (add concertCrowd in front)', '', ['city', 'night']);
registerSet('backyard', envBackyard, 'Sunny backyard: picket fence, tree, dog house, grass', '', ['home', 'outdoor']);
registerSet('kitchen', envKitchen, 'Home kitchen: window, cabinets, fridge, counter (also works as a cafeteria serving area)', '{night}', ['home']);
registerSet('gym', envGym, 'School gym / dance: banner, stage with curtains (stage floor y 1190), disco ball', "{dim, noLights, banner:'TEXT', bannerC}", ['school']);
