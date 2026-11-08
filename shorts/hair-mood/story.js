// story.js — "In This World, Your Hair Changes Color With Your Mood"
// Shared systems for all shot parts: mood hair, Nubi's cap, hair HUD, picture-day set, props, flash, music, captions.
'use strict';

// ---------------- Mood hair ----------------
// Every character's hair shows their mood. Pass it through the face object: face.hair = mood name or hex color.
//   C(ctx, 'grandma', p, { expr:'angry', hair:'mad' }, T)
// Smooth change: face.hair = hairShift('sad', 'love', T, ws('L14','pink'))  (0.25 s blend + use hairPop for the burst)
// face.cap = true draws Nubi's orange cap (hides his hair).  face.hairGlow = true adds a glowing aura to the hair (SUPER pink).
const MOOD = { happy: '#FFD447', mad: '#EE384A', sad: '#3F7BEA', love: '#FF4FA3', scared: '#8EDB4A', calm: '#B9A6FF', normal: null };
const MOOD_LABEL = { happy: 'YELLOW', mad: 'RED', sad: 'BLUE', love: 'PINK', scared: 'GREEN', calm: 'PURPLE' };
function hexRgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function mixHex(a, b, k) { const A = hexRgb(a), B = hexRgb(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); }
function moodHex(name, m) { if (!m) return null; if (m[0] === '#') return m; return MOOD[m] || null; }
function hairShift(from, to, T, t0, dur = .25) {
  const a = (from[0] === '#' ? from : MOOD[from]), b = (to[0] === '#' ? to : MOOD[to]);
  return mixHex(a, b, smooth(inv(t0, t0 + dur, T)));
}
const _drawCharacter = drawCharacter;
drawCharacter = function (ctx, name, pose, face = {}, t = 0) {
  const c = CAST[name]; if (!c || !face) return _drawCharacter(ctx, name, pose, face, t);
  const keep = { hairC: c.hairC, hair: c.hair, capC: c.capC, brow: c.brow };
  const col = moodHex(name, face.hair);
  if (col) { c.hairC = col; if (name === 'nubi' || !c.brow) c.brow = shade(col, -.35); }
  if (face.cap) { c.hair = 'cap'; c.capC = '#FF8528'; }
  try {
    if (face.hairGlow && col) { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 60 * (pose.s || 1); _drawCharacter(ctx, name, pose, face, t); ctx.restore(); }
    else _drawCharacter(ctx, name, pose, face, t);
  } finally { Object.assign(c, keep); }
};
// Burst of colored sparkles around a head when hair changes (world space). dt = T - changeTime.
function hairPop(ctx, x, y, mood, dt, s = 1) {
  if (dt < 0 || dt > .6) return; const col = moodHex('', mood) || '#fff', k = dt / .6;
  ctx.save(); ctx.globalAlpha *= 1 - k;
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + .3, r = (60 + 220 * Math.sqrt(k)) * s;
    star(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r * .8, (26 - 14 * k) * s, col); }
  ctx.restore();
}
function star(ctx, x, y, r, col) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * .45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); fillStroke(ctx, col, Math.max(3, r * .22)); }

// ---------------- Nubi continuity (single source of truth) ----------------
// Nubi's mood over the story. Use face: { hair: nubiHair(T), cap: nubiCap(T) } in EVERY Nubi shot.
function nubiMoodAt(T) {
  if (!LINE.L5) return 'happy';
  const steps = [[0, 'happy'], [ws('L5', 'lily'), 'love'], [ws('L8', 'picture'), 'scared'], [ws('L11', 'lily'), 'love'],
    [ws('L13', 'blue'), 'sad'], [ws('L14', 'pink'), 'love'], [ws('L15', 'blue'), 'sad'], [ws('L16', 'super'), 'love']];
  let m = 'happy', since = 0, prev = 'happy';
  for (const [t, v] of steps) if (T >= t) { prev = m; m = v; since = t; }
  return { mood: m, prev, since };
}
function nubiHair(T) { const s = nubiMoodAt(T); if (typeof s === 'string') return s; return hairShift(s.prev, s.mood, T, s.since - .05, .2); }
const nubiCap = T => LINE.L6 ? (T >= ws('L6', 'cap') - .05 && T < ws('L9', 'off')) : false;
const nubiGlow = T => LINE.L16 ? T >= ws('L16', 'super') : false;   // SUPER pink glow from L16 on
// Lily's hair is pink whenever Nubi is near her (the hidden clue: he never looked up). Brown only when she is away from him.
const LILY_PINK = 'love';

// ---------------- Hair HUD (top centre): "NUBI'S HAIR: BLUE" ----------------
STORY.hudDraw = (ctx, T) => {
  if (!LINE.L9) return;
  const t0 = ws('L9', 'off'), tEnd = LINE.L20.start;
  const a = smooth(inv(t0 - .05, t0 + .25, T)) * (1 - smooth(inv(tEnd, tEnd + .4, T)));
  if (a <= 0) return;
  const st = nubiMoodAt(T), col = MOOD[st.mood], label = "NUBI'S HAIR: " + MOOD_LABEL[st.mood] + (nubiGlow(T) ? '!!' : '');
  const pulse = 1 + Math.max(0, .3 - (T - st.since)) * .8;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(540, 150 - (1 - a) * 120); ctx.scale(pulse, pulse);
  ctx.font = '58px "Lilita One"'; const w = ctx.measureText(label).width + 150;
  box(ctx, -w / 2 + 6, -56, w, 120, 60, 'rgba(0,0,0,.3)', 0); box(ctx, -w / 2, -64, w, 120, 60, '#24225B', 9);
  circle(ctx, -w / 2 + 64, -4, 30, col, 6);
  txt(ctx, label, 36, -2, 58, col, OUTLINE, 9);
  ctx.restore();
};
// HUD covers screen y 80–220 from L9 "off" until L20: keep heads below ~300 then.

// ---------------- Picture-day set ----------------
// Gym with a PICTURE DAY banner, the classic mottled blue photo backdrop (x 90–990, y 520–1490) and 2 wooden risers.
// Kids stand on the floor (y 1500) or on the riser top (y 1390). Photographer stands off-camera right / faces the class.
function envPhoto(ctx, T, cam, o = {}) {
  envGym(ctx, T, cam, Object.assign({ banner: 'PICTURE DAY', bannerC: '#2E62C9', noLights: true, dim: 0 }, o));
  const { dx } = par(cam, .95);
  ctx.save(); ctx.translate(dx, 0);
  // backdrop on stands
  box(ctx, 70, 470, 16, 1030, 6, '#555', 5); box(ctx, 994, 470, 16, 1030, 6, '#555', 5);
  const g = ctx.createRadialGradient(540, 900, 80, 540, 900, 700); g.addColorStop(0, '#9EC3F0'); g.addColorStop(1, '#3E5C99');
  box(ctx, 90, 500, 900, 1000, 6, g, 7);
  ctx.globalAlpha *= .18; for (let i = 0; i < 26; i++) { const x = 140 + (i * 337) % 800, y = 560 + (i * 211) % 880; ellipse(ctx, x, y, 90, 60, '#fff'); } ctx.globalAlpha /= .18;
  if (!o.noRisers) { box(ctx, 160, 1390, 760, 110, 8, '#C98B4B', 7); box(ctx, 160, 1390, 760, 22, 8, '#E0A86A', 5); }
  ctx.restore();
}
// Camera flash (ui): white fade from t0.
function cameraFlash(ctx, T, t0) { const d = T - t0; if (d < 0 || d > .5) return; ctx.save(); ctx.globalAlpha = (1 - d / .5) ** 2; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.restore(); }

// ---------------- One-off: the photographer ----------------
CAST.photographer = Object.assign({}, CAST.teacher, { skin: '#E9B48A', shirt: '#3A3F55', sleeve: '#3A3F55', inner: '#FFD447', hair: 'buzz', hairC: '#6B3A1E', brow: '#6B3A1E', glasses: false, lashes: false, seed: 21, tall: 1.12 });
// Kayla = kidC (purple shirt, ponytail). Brayden's crush.

// ---------------- Props (face.holding) ----------------
function holdCamera(ctx) { ctx.save(); ctx.translate(0, 30);
  box(ctx, -90, -70, 180, 120, 18, '#2B2B33', 7); box(ctx, -60, -96, 60, 32, 8, '#2B2B33', 6);
  circle(ctx, 10, -10, 44, '#555', 7); circle(ctx, 10, -10, 26, '#80CDF5', 6); circle(ctx, 2, -18, 8, '#fff');
  box(ctx, 40, -90, 40, 22, 5, '#FFD447', 5); ctx.restore(); }
function holdRemote(ctx) { ctx.save(); ctx.translate(0, 40); box(ctx, -22, -90, 44, 130, 12, '#333', 6); circle(ctx, 0, -66, 9, '#EE384A', 3); for (let i = 0; i < 3; i++) circle(ctx, 0, -36 + i * 24, 7, '#aaa', 3); ctx.restore(); }
function holdBroccoli(ctx) { ctx.save(); ctx.translate(0, 30); box(ctx, -12, -40, 24, 80, 8, '#7FC24A', 6);
  for (const [x, y, r] of [[-30, -60, 30], [30, -60, 30], [0, -86, 34], [0, -50, 30]]) circle(ctx, x, y, r, '#2F9E44', 6); ctx.restore(); }
function holdHomework(ctx) { ctx.save(); ctx.translate(0, 40); ctx.rotate(.05); box(ctx, -100, -150, 200, 170, 8, '#fff', 7);
  ctx.strokeStyle = '#80CDF5'; ctx.lineWidth = 4; ctx.beginPath(); for (let i = 0; i < 5; i++) { ctx.moveTo(-80, -120 + i * 28); ctx.lineTo(80, -120 + i * 28); } ctx.stroke();
  txt(ctx, '2x+7=?', 0, -95, 40, '#EE384A'); ctx.restore(); }

// ---------------- Music + captions ----------------
STORY.music = () => [[0, 'main'], [ws('L9', 'hats'), 'tense'], [ws('L17', 'pointed'), 'tense'], [LINE.L20.start - .1, 'calm'], [ws('L22', 'mine'), 'love']];
STORY.capColors = {
  yellow: ['yellow', 'happy', 'cap', 'hat', 'hats', 'picture', 'photographer', 'photo', 'click', 'remote', 'homework', 'broccoli'],
  red: ['red', 'mad', 'snitch', 'yelled', 'subscribe', 'off', 'boy'],
  blue: ['blue', 'sad', 'monday'],
  pink: ['pink', 'lily', 'like', 'likes', 'someone', 'somebody', 'mine', 'kayla', 'giggled'],
  green: ['realized', 'hide', 'everybody'],
};
STORY.capOverride = { 'L9:everybody': 'white' };
CAP_HEX.blue = '#5AA8FF';
