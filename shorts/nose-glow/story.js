// story.js — "In This World, Every Lie Makes Your Nose Glow".
// Shared helpers so all three shot parts draw the glowing nose, blackout, shades, boats and fire truck identically.
'use strict';

// ---------- one-off cast ----------
CAST.dentist = { ...CAST.teacher, shirt: '#F4F7FA', sleeve: '#F4F7FA', hair: 'bob', seed: 41 };

// ---------- nose position (front / q34 / side; ignores p.rot and head tilt, so don't glow a spinning body) ----------
function noseAt(name, p) {
  const c = CAST[name], k = p.s * (c.tall || 1), v = p.view || 'front', f = p.flip || 1;
  const fx = v === 'side' ? RIG.headW * .86 * .2 + 20 : v === 'q34' ? RIG.headW * .94 * .1 : 0;
  return { x: p.x + fx * f * k, y: headTop(name, p) + (16 + RIG.headH * .56 + (p.headY || 0)) * k, k };
}

// THE recurring device. Call right AFTER C(ctx, name, p, face, T) (and after blackout() in dark shots).
// amt: 0 off · .3 small lie "blink" · 1 normal lie · 1.6 lighthouse (adds rotating rays) · 2.5 "lit up the sky".
// o.col: glow colour 'r,g,b' (default red '255,64,64'; Lily's love glow uses '255,110,170').
function noseGlow(ctx, name, p, amt, T, o = {}) {
  if (!(amt > 0)) return;
  const n = noseAt(name, p), col = o.col || '255,64,64';
  const fl = 1 + .07 * Math.sin(T * 23 + n.x) + .05 * Math.sin(T * 37);
  const R = (70 + 150 * amt) * n.k * fl;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  if (amt >= 1.5) { // lighthouse rays
    const nr = 10, L = R * (2.2 + amt * .6);
    for (let i = 0; i < nr; i++) {
      const a = T * .9 + i * TAU / nr;
      ctx.fillStyle = `rgba(${col},${.16 * Math.min(1, amt - 1.4)})`;
      ctx.beginPath(); ctx.moveTo(n.x, n.y);
      ctx.lineTo(n.x + Math.cos(a - .07) * L, n.y + Math.sin(a - .07) * L);
      ctx.lineTo(n.x + Math.cos(a + .07) * L, n.y + Math.sin(a + .07) * L);
      ctx.closePath(); ctx.fill();
    }
  }
  const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, R);
  g.addColorStop(0, `rgba(${col},${Math.min(.95, .55 + .3 * amt)})`);
  g.addColorStop(.35, `rgba(${col},${Math.min(.5, .22 + .15 * amt)})`);
  g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, R, 0, TAU); ctx.fill();
  ctx.restore();
  // the bulb itself
  const br = (13 + 5 * Math.min(amt, 1.5)) * n.k;
  ctx.save();
  ellipse(ctx, n.x, n.y, br, br * .9, `rgb(${col})`, 4 * n.k);
  ellipse(ctx, n.x - br * .3, n.y - br * .3, br * .35, br * .3, 'rgba(255,255,255,.85)');
  ctx.restore();
}

// Night-time darkness over the whole frame (call after characters, before noseGlow). a: 0..1
function blackout(ctx, a) {
  if (!(a > 0)) return;
  ctx.save(); ctx.fillStyle = `rgba(6,8,24,${a})`; ctx.fillRect(-6000, -6000, 14000, 14000); ctx.restore();
}
// Story darkness of the gym: lights go out on L13 "out", noses relight it, Grandma's "daylight" ends it.
function gymDark(T) {
  if (!LINE.L13) return 0;
  const tOut = wordT('L13', 'out'), tHw = wordT('L18', 'homework'), tJoin = wordT('L19', 'joined'), tDay = wordT('L20', 'daylight');
  if (T < tOut) return 0;
  if (T < tHw) return .9 * smooth(inv(tOut, tOut + .12, T));
  if (T < tJoin) return .9 - .18 * smooth(inv(tHw, tHw + .3, T));
  if (T < tDay) return .72 - .22 * smooth(inv(tJoin, wordT('L19', 'unicorn') + .3, T));
  return .5 * (1 - smooth(inv(tDay, tDay + .35, T)));
}

// Sunglasses on a face (Lily puts them on in L12 at "sunglasses"). Call after C().
function drawShades(ctx, name, p) {
  const n = noseAt(name, p), k = n.k, sep = (p.view === 'q34' ? .92 : 1) * 50 * k, ey = n.y - 22 * k;
  ctx.save();
  ctx.lineWidth = 6 * k; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.moveTo(n.x - sep, ey); ctx.lineTo(n.x + sep, ey); ctx.stroke();
  for (const sx of [-1, 1]) { box(ctx, n.x + sx * sep - 34 * k, ey - 20 * k, 68 * k, 42 * k, 12 * k, '#16131f', 5 * k);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(n.x + sx * sep - 24 * k, ey - 12 * k, 14 * k, 8 * k); }
  ctx.restore();
}

// Falling rain streaks (L10 "pouring", seen through the gym window or full-frame). a: 0..1
function rain(ctx, T, a = 1, x0 = -200, x1 = 1280, y0 = -200, y1 = 2000) {
  ctx.save(); ctx.strokeStyle = `rgba(190,215,255,${.55 * a})`; ctx.lineWidth = 5;
  for (let i = 0; i < 90; i++) {
    const x = x0 + ((i * 137.5) % (x1 - x0)), sp = 1700 + (i % 7) * 120, y = y0 + ((T * sp + i * 271) % (y1 - y0));
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 18, y + 70); ctx.stroke();
  }
  ctx.restore();
}

// Little sailboat (L4 boats steering by Grandma's nose).
function drawBoat(ctx, x, y, s, T, col = '#EE384A') {
  ctx.save(); ctx.translate(x, y + Math.sin(T * 2.2 + x) * 8 * s); ctx.rotate(Math.sin(T * 1.7 + x) * .05); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-120, 0); ctx.lineTo(120, 0); ctx.lineTo(85, 55); ctx.lineTo(-85, 55); ctx.closePath(); fillStroke(ctx, col, 8);
  box(ctx, -6, -190, 12, 192, 4, '#6b4a2b', 6);
  ctx.beginPath(); ctx.moveTo(10, -180); ctx.lineTo(10, -20); ctx.lineTo(105, -20); ctx.closePath(); fillStroke(ctx, '#F4F7FA', 7);
  ctx.restore();
}

// Fire truck (L6 "fire department"). Faces +x; pass s negative-free, use flip for -x.
function drawFireTruck(ctx, x, y, s, T, flip = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * flip, s);
  box(ctx, -260, -210, 360, 170, 18, '#E8333F', 9);           // body
  box(ctx, 100, -250, 150, 210, 24, '#E8333F', 9);           // cab
  box(ctx, 130, -225, 95, 75, 12, '#9fd8ff', 7);             // window
  box(ctx, -240, -250, 320, 26, 8, '#d9dde6', 7);            // ladder
  for (let i = 0; i < 8; i++) { ctx.fillStyle = OUTLINE; ctx.fillRect(-225 + i * 40, -250, 7, 26); }
  const on = Math.sin(T * 18) > 0;
  ellipse(ctx, 175, -265, 26, 18, on ? '#4fb3ff' : '#ff4d4d', 6);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(175, -265, 0, 175, -265, 160); g.addColorStop(0, on ? 'rgba(80,170,255,.6)' : 'rgba(255,70,70,.6)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(175, -265, 160, 0, TAU); ctx.fill(); ctx.restore();
  for (const wx of [-170, 160]) { ellipse(ctx, wx, -35, 48, 48, '#2a2433', 8); ellipse(ctx, wx, -35, 18, 18, '#b9bfcc', 5); }
  ctx.restore();
}

// Night shore set for L4 (dark sea, stars, a cliff top at floor 1500 where Grandma stands on the right).
function envShore(ctx, T, cam) {
  const p = par(cam, .4);
  ctx.fillStyle = '#141a3d'; ctx.fillRect(-2000, -2000, 5080, 5920);
  ctx.save(); ctx.translate(p.dx, p.dy);
  for (let i = 0; i < 40; i++) { const x = (i * 211) % 1400 - 160, y = 120 + (i * 97) % 760, tw = .5 + .5 * Math.sin(T * 3 + i);
    ellipse(ctx, x, y, 4 + 3 * tw, 4 + 3 * tw, `rgba(255,255,230,${.4 + .5 * tw})`); }
  ellipse(ctx, 860, 300, 70, 70, '#f6f0c8', 0);
  ctx.restore();
  ctx.fillStyle = '#1d3f78'; ctx.fillRect(-2000, 1160, 5080, 3000);
  for (let r = 0; r < 6; r++) { ctx.strokeStyle = 'rgba(140,190,255,.35)'; ctx.lineWidth = 6; ctx.beginPath();
    for (let x = -300; x <= 1400; x += 30) { const y = 1200 + r * 70 + Math.sin(x * .02 + T * 2 + r) * 10; x === -300 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(560, 3000); ctx.lineTo(560, 1560); ctx.quadraticCurveTo(600, 1500, 680, 1500); ctx.lineTo(2000, 1500); ctx.lineTo(2000, 3000); ctx.closePath();
  fillStroke(ctx, '#3b3550', 9);
}

// Dentist "disco" set for L2: envBurst-style rays + a mirror ball. Use with CAST.dentist and a nervous kid in the chair.
function envDisco(ctx, T, cam) {
  envBurst(ctx, T, '#3a1f6e', '#7a2ca8', .6);
  const bx = 540, by = 260;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const cols = ['255,80,200', '80,200,255', '255,230,80', '120,255,140'];
  for (let i = 0; i < 8; i++) { const a = T * 1.4 + i * TAU / 8; ctx.fillStyle = `rgba(${cols[i % 4]},.18)`;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(a - .12) * 1800, by + Math.sin(a - .12) * 1800); ctx.lineTo(bx + Math.cos(a + .12) * 1800, by + Math.sin(a + .12) * 1800); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bx, -200); ctx.lineTo(bx, by - 80); ctx.stroke();
  ellipse(ctx, bx, by, 80, 80, '#cfd6e6', 8);
  for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i * i + j * j < 6) { ctx.fillStyle = (i + j + Math.floor(T * 6)) % 2 ? '#ffffff' : '#8c97b5'; ctx.fillRect(bx + i * 26 - 10, by + j * 26 - 10, 20, 20); }
}

// ---------- music & captions ----------
STORY.music = () => [[0, 'main'], [LINE.L14.start - .1, 'tense'], [LINE.L16.start - .1, 'calm'], [wordT('L18', 'homework'), 'party'], [LINE.L21.start - .1, 'love']];
STORY.capColors = {
  red: ['lie', 'lies', 'glow', 'glowing', 'lighthouse', 'brighter', 'fire', 'pouring', 'out', 'darkness', 'screamed', 'nope', 'worst', 'subscribe', 'scared'],
  yellow: ['grandma', 'thirty', 'nine', 'dentists', 'discos', 'dance', 'homework', 'broccoli', 'unicorn', 'sunglasses', 'birthday', 'candle', 'boats', 'brayden', 'hurt'],
  green: ['daylight', 'brightest', 'compliment', 'joined', 'relaxed', 'night', 'light', 'blink'],
  pink: ['lily', 'her', 'anyone', 'neither', 'too', 'glowed', 'sky'],
};
STORY.capOverride = { 'L25:night': 'pink', 'L25:light': 'pink', 'L24:glowed': 'pink', 'L26:glowed': 'red', 'L8:lily': 'pink', 'L12:lily': 'pink' };
