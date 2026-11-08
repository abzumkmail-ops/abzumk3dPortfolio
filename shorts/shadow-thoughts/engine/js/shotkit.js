// shotkit.js — helpers for writing shots + the shot registry.
// Story projects call shots(() => [...shot objects]) from shots/partN.js files (one per parallel agent).
'use strict';
const P = o => basePose(o);
function C(ctx, name, p, face, T) { drawShadow(ctx, p); drawCharacter(ctx, name, p, face, T); }
const camAt = (x, y, z, rot = 0) => ({ x, y, z, rot });
const KIDS = ['kidA', 'kidB', 'kidC', 'kidD', 'kidE', 'kidF'];

function holdTray(ctx) { box(ctx, -150, 30, 300, 26, 10, '#B8C2CC', 7); for (let i = 0; i < 4; i++) { circle(ctx, -100 + i * 66, 22, 28, '#C98B4B', 6); for (let k = 0; k < 3; k++) circle(ctx, -110 + i * 66 + k * 9, 14 + k * 5, 4, '#4A2810'); } }
function holdMic(ctx) { box(ctx, -10, -40, 20, 70, 8, '#333', 5); circle(ctx, 0, -50, 22, '#AAB', 6); }
function holdBucket(ctx) { ctx.save(); ctx.translate(0, 40); box(ctx, -60, 0, 120, 110, 16, '#FF8528', 8); for (let i = 0; i < 4; i++) box(ctx, -50 + i * 28, -16, 26, 18, 8, PCOLORS[i], 4); ctx.restore(); }
function holdBook(ctx) { box(ctx, -50, 10, 100, 120, 8, '#7B4BFF', 7); box(ctx, -40, 22, 80, 10, 4, '#fff', 0); }
function holdSign(txtS) { return ctx => { ctx.save(); ctx.rotate(-.05); box(ctx, -150, -260, 300, 180, 14, '#FFF8E0', 8); txt(ctx, txtS, 0, -172, 84, '#30A045', OUTLINE, 0); ctx.restore(); }; }
function thread(ctx, x1, y1, x2, y2, k, T, col = '#FF7AC0') {
  if (k <= 0) return;
  const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 260;
  ctx.save(); ctx.lineCap = 'round';
  const N = 60, n = Math.floor(N * clamp(k));
  const pt = i => { const u = i / N; return [lerp(lerp(x1, mx, u), lerp(mx, x2, u), u), lerp(lerp(y1, my, u), lerp(my, y2, u), u)]; };
  ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.strokeStyle = col; ctx.lineWidth = 16;
  ctx.beginPath(); for (let i = 0; i <= n; i++) { const [x, y] = pt(i); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
  ctx.shadowBlur = 0; ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.stroke();
  for (let j = 0; j < 4; j++) { const u = ((T * .6 + j / 4) % 1) * clamp(k); const [x, y] = pt(Math.floor(u * N)); heartPath(ctx, x, y, 20); fillStroke(ctx, '#fff', 4); }
  ctx.restore();
}
function spotlight(ctx, x, a = .75, col = '255,240,200') { // screen-space cone
  ctx.save(); const g = ctx.createRadialGradient(x, 1150, 60, x, 1150, 620); g.addColorStop(0, `rgba(${col},.30)`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = `rgba(5,4,20,${a})`; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 90, 0); ctx.lineTo(x + 90, 0); ctx.lineTo(x + 420, 1700); ctx.lineTo(x - 420, 1700); ctx.fill(); ctx.restore();
}
function danceP(i, T) { const p = P({}); const k = (T * 2 + i * .37) % 1; p.armL = 1.2 + Math.sin(T * 8 + i) * 1; p.armR = 1.2 - Math.sin(T * 8 + i) * 1; p.bodyY = -Math.abs(Math.sin(T * 8 + i)) * 26; p.head = Math.sin(T * 4 + i) * .12; p.lean = Math.sin(T * 4 + i * 2) * .08; return p; }


// ---------------- word-anchored timing helpers ----------------
const ws = (id, w, o = 0) => wordT(id, w, o);          // start time of the o-th occurrence of word w in line id
const we = (id, w, o = 0) => wordT(id, w, o, 'e');     // end time of that word
const st = id => LINE[id].start - .08;                 // a shot that starts on line id cuts in just before its first word

// ---------------- story hooks (story.js overrides these) ----------------
window.STORY = {
  hud: null,                       // (T) => {have, goal, day, danger, done, alpha, pulse} | null  — goal tracker at the top
  hudDraw: null,                   // (ctx, T) => custom screen-space HUD (takes priority over hud)
  music: () => [[0, 'main']],      // () => [[time, mood], ...]  moods: main | tense | calm | party | love
  capColors: {},                   // { green: [...words], yellow: [...], red: [...], pink: [...] } merged over defaults
  capOverride: {},                 // { 'L5:word': 'red' | 'white' | null }
};

// ---------------- shot registry ----------------
const SHOT_PARTS = [];
function shots(fn) { SHOT_PARTS.push(fn); }
function buildTimeline() {
  const S = [];
  for (const f of SHOT_PARTS) { try { S.push(...f()); } catch (e) { console.error('shot part failed: ' + e.message); throw e; } }
  S.sort((a, b) => a.start - b.start);
  // A part can be tested before the parts that precede it exist: fill the gap with a neutral placeholder shot.
  if (!S.length || S[0].start > .001) S.unshift({ id: 'S00-placeholder', start: 0, trans: 'cut', capY: 1600,
    bg: (ctx) => { ctx.fillStyle = '#24225B'; ctx.fillRect(-3000, -3000, 9000, 9000); }, cam: () => camAt(540, 960, 1), draw() {} });
  S.forEach((s, i) => s.end = i < S.length - 1 ? S[i + 1].start : END);
  return S;
}
