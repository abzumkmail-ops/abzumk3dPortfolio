// fx_ui.js — deterministic particles, the like-counter badge, HUD, pop-ups and captions.
'use strict';

// ---------------- Particles (pure function of time since spawn) ----------------
const PCOLORS = ['#FF5B9B', '#FFD447', '#20BDBB', '#30CE65', '#FF8528', '#7B4BFF', '#fff'];
function burst(ctx, x, y, dt, o = {}) {
  if (dt < 0) return;
  const n = o.n || 24, life = o.life || 1.2, sp = o.speed || 900, gr = o.gravity ?? 1400, kind = o.kind || 'confetti';
  const r = rng(o.seed || 7);
  for (let i = 0; i < n; i++) {
    const a = (o.angle ?? -Math.PI / 2) + (r() - .5) * (o.spread ?? TAU), v = sp * (.45 + r() * .7), L = life * (.6 + r() * .5);
    const col = (o.colors || PCOLORS)[i % (o.colors || PCOLORS).length], rot = r() * TAU, size = (o.size || 18) * (.6 + r() * .8);
    if (dt > L) { r(); continue; }
    const px = x + Math.cos(a) * v * dt, py = y + Math.sin(a) * v * dt + .5 * gr * dt * dt;
    const k = dt / L;
    ctx.save(); ctx.globalAlpha *= 1 - easeIn(k); ctx.translate(px, py); ctx.rotate(rot + dt * (r() * 10 - 5));
    if (kind === 'confetti') { ctx.fillStyle = col; ctx.fillRect(-size / 2, -size / 4, size, size / 2); }
    else if (kind === 'star') { starPath(ctx, 0, 0, size, size * .45); fillStroke(ctx, col, 4); }
    else if (kind === 'heart') { heartPath(ctx, 0, 0, size); fillStroke(ctx, o.colors ? col : '#FF5B9B', 4); }
    else if (kind === 'dust') { ctx.globalAlpha *= .8; circle(ctx, 0, 0, size * (1 + k * 1.5), o.colors ? col : '#FFFFFF'); }
    else if (kind === 'candy') { box(ctx, -size, -size * .55, size * 2, size * 1.1, size * .5, col, 4); }
    else if (kind === 'sparkle') { starPath(ctx, 0, 0, size, size * .25, 4); fillStroke(ctx, '#FFF6B0', 0); }
    ctx.restore();
  }
}
function speedLines(ctx, cx, cy, t, a = 1, col = '#fff') {
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineCap = 'round';
  for (let i = 0; i < 28; i++) { const r = rng(i + Math.floor(t * 20) * 100); const ang = r() * TAU, r0 = 520 + r() * 300;
    ctx.lineWidth = 6 + r() * 10; ctx.beginPath(); ctx.moveTo(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0); ctx.lineTo(cx + Math.cos(ang) * (r0 + 500), cy + Math.sin(ang) * (r0 + 500)); ctx.stroke(); }
  ctx.restore();
}

// ---------------- Like-counter badge ----------------
// value: number or string. state: 'normal' | 'gold' | 'red' | 'glow'
function drawBadge(ctx, x, y, value, o = {}) {
  const s = (o.s || 1) * (o.pop ?? 1);
  if (s <= .01) return;
  const label = typeof value === 'number' ? fmt(value) : value;
  ctx.save(); ctx.translate(x, y + Math.sin((o.t || 0) * 3 + (o.seed || 0)) * 6); ctx.scale(s, s); ctx.rotate(o.rot || 0);
  ctx.font = '84px "Lilita One"';
  const tw = ctx.measureText(label).width, w = tw + 150, h = 112;
  const st = o.state || 'normal';
  const bg = st === 'gold' ? '#FFC83D' : st === 'red' ? '#EE384A' : st === 'green' ? '#30CE65' : '#222331';
  if (o.glow) { ctx.save(); ctx.shadowColor = o.glowC || '#FF5B9B'; ctx.shadowBlur = 50 * o.glow; box(ctx, -w / 2, -h / 2, w, h, h / 2, bg, 0); ctx.restore(); }
  box(ctx, -w / 2 + 6, -h / 2 + 10, w, h, h / 2, 'rgba(0,0,0,.25)', 0);
  box(ctx, -w / 2, -h / 2, w, h, h / 2, bg, 9);
  ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fillRect(-w / 2, -h / 2, w, h * .42); ctx.restore();
  heartPath(ctx, -w / 2 + 62, 4, 34); fillStroke(ctx, st === 'red' ? '#fff' : '#FF5B9B', 6);
  txt(ctx, label, -w / 2 + 112 + tw / 2, 6, 84, st === 'gold' ? '#3a2400' : '#fff', OUTLINE, st === 'gold' ? 0 : 10);
  ctx.beginPath(); ctx.moveTo(-18, h / 2 - 2); ctx.lineTo(0, h / 2 + 22); ctx.lineTo(18, h / 2 - 2); fillStroke(ctx, bg, 0);
  ctx.restore();
}
// world position of the top of a character's head
function headTop(name, p) { const c = CAST[name]; return p.y + (p.bodyY - (RIG.legH + RIG.torsoH + RIG.headH)) * p.s * (c.tall || 1); }
const HAIR_LIFT = { brayden: 62, mom: 40, teacher: 50, popstar: 48, grandma: 44, lunchlady: 46, kidA: 22, kidE: 14 };
function badgeOver(ctx, name, p, value, o = {}) { drawBadge(ctx, p.x, headTop(name, p) - (90 + (HAIR_LIFT[name] || 0)) * p.s - (o.lift || 0), value, Object.assign({ s: p.s * (o.bs || 1.0) }, o)); }

// Counter value animation helper: list of [time, value] steps (snap with a pop)
function counterAt(steps, t) { let v = steps[0][1], tt = -99; for (const [st, sv] of steps) if (t >= st) { v = sv; tt = st; } return { v, since: t - tt }; }

// ---------------- Pop-ups / stamps ----------------
function popText(ctx, s, x, y, dt, o = {}) {
  if (dt < 0 || (o.dur && dt > o.dur)) return;
  const k = pop(dt, .28) * (o.dur ? 1 - smooth(inv(o.dur - .2, o.dur, dt)) : 1);
  ctx.save(); ctx.translate(x, y - (o.rise || 0) * dt); ctx.rotate(o.rot || 0); ctx.scale(k, k);
  if (o.bg) { ctx.font = `${o.size || 110}px "Lilita One"`; const w = ctx.measureText(s).width + 80; box(ctx, -w / 2, -(o.size || 110) * .7, w, (o.size || 110) * 1.4, 34, o.bg, 10); }
  txt(ctx, s, 0, 0, o.size || 110, o.fill || '#fff', OUTLINE, o.lw ?? 20);
  ctx.restore();
}
function stamp(ctx, s, x, y, dt, col = '#EE384A', dur = 1.2) { // slam-in rubber stamp
  if (dt < 0 || dt > dur) return;
  const k = dt < .12 ? lerp(2.4, 1, easeOut(dt / .12)) : 1;
  ctx.save(); ctx.globalAlpha *= 1 - smooth(inv(dur - .2, dur, dt)); ctx.translate(x, y); ctx.rotate(-.14); ctx.scale(k, k);
  ctx.font = '120px "Lilita One"'; const w = ctx.measureText(s).width + 70;
  rr(ctx, -w / 2, -88, w, 170, 26); ctx.lineWidth = 16; ctx.strokeStyle = col; ctx.stroke();
  txt(ctx, s, 0, 4, 120, col, '#fff', 0);
  ctx.restore();
}

// ---------------- HUD: goal tracker (screen space, top) ----------------
function drawGoalHUD(ctx, o) { // o: {have, goal, day, alpha, done, pulse, danger}
  if (!o || o.alpha <= 0) return;
  ctx.save(); ctx.globalAlpha *= o.alpha; ctx.translate(540, 150 - (1 - o.alpha) * 120);
  const s = 1 + (o.pulse || 0) * .12; ctx.scale(s, s);
  const bg = o.done ? '#30CE65' : o.danger ? '#EE384A' : '#222331';
  box(ctx, -330, -66, 660, 132, 66, 'rgba(0,0,0,.3)', 0);
  box(ctx, -336, -74, 660, 132, 66, bg, 9);
  heartPath(ctx, -262, -2, 34); fillStroke(ctx, '#FF5B9B', 6);
  txt(ctx, o.done ? 'GOAL COMPLETE!' : `GOAL  ${o.have}/${o.goal}`, -200, -6, 62, '#fff', OUTLINE, 9, 'Lilita One', 'left');
  if (!o.done) { box(ctx, 150, -50, 150, 84, 30, o.danger ? '#fff' : '#FFC83D', 7); txt(ctx, o.day, 225, -6, 42, o.danger ? '#EE384A' : '#3a2400', OUTLINE, 0); }
  ctx.restore();
}
function drawSubscribe(ctx, dt, dur = 1.6, y = 1460) {
  if (dt < 0 || dt > dur) return;
  const k = pop(dt, .25) * (1 - smooth(inv(dur - .2, dur, dt)));
  ctx.save(); ctx.translate(540, y); ctx.scale(k, k);
  const pressed = dt > .55 && dt < .75;
  const col = dt > .7 ? '#555A70' : '#EE384A';
  box(ctx, -300, -80 + (pressed ? 8 : 0), 600, 160, 80, col, 10);
  txt(ctx, dt > .7 ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 2 + (pressed ? 8 : 0), 78, '#fff', OUTLINE, 10);
  // cursor hand
  const cx = lerp(380, 120, easeOut(inv(.15, .55, dt))), cy = lerp(220, 40, easeOut(inv(.15, .55, dt)));
  ctx.save(); ctx.translate(cx, cy + (pressed ? 10 : 0)); ctx.rotate(-.3);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.lineTo(24, 70); ctx.lineTo(42, 108); ctx.lineTo(58, 100); ctx.lineTo(40, 64); ctx.lineTo(70, 62); ctx.closePath(); fillStroke(ctx, '#fff', 8);
  ctx.restore();
  ctx.restore();
}
function vignette(ctx, a = .35, col = '0,0,0') {
  if (a <= 0) return;
  const g = ctx.createRadialGradient(540, 960, 500, 540, 960, 1250); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// ---------------- Captions ----------------
// Caption emphasis colors. Defaults below; story.js adds words via STORY.capColors / STORY.capOverride.
const CAP_DEFAULT = { red: ['subscribe', 'never', 'wrong', 'no'], green: ['yes', 'win', 'won'], yellow: [], pink: ['love'] };
const CAP_HEX = { white: '#FFFFFF', green: '#4BF07A', yellow: '#FFD447', red: '#FF4558', pink: '#FF7AC0' };
function capColor(lineId, w) {
  const k = w.toLowerCase().replace(/[^a-z']/g, '');
  const ov = (STORY.capOverride || {})[lineId + ':' + k]; if (ov !== undefined) return ov ? CAP_HEX[ov] : '#fff';
  for (const c in CAP_HEX) if (((STORY.capColors || {})[c] || []).includes(k) || (CAP_DEFAULT[c] || []).includes(k)) return CAP_HEX[c];
  return '#fff';
}
let CHUNKS = [];
function buildChunks() {
  CHUNKS = [];
  for (const l of WORDS.lines) {
    let cur = [];
    const flush = () => { if (cur.length) CHUNKS.push({ line: l.id, words: cur }); cur = []; };
    l.words.forEach((w, i) => {
      cur.push(w);
      const chars = cur.reduce((a, x) => a + x.w.length + 1, 0);
      const punct = /[.?!,…]$/.test(w.w), next = l.words[i + 1];
      if (punct || cur.length >= 3 || chars > 15 || (next && chars + next.w.length > 17)) flush();
    });
    flush();
  }
  CHUNKS.forEach((c, i) => { c.s = c.words[0].s; const nx = CHUNKS[i + 1]; c.e = Math.min(c.words[c.words.length - 1].e + .45, nx ? nx.words[0].s : 1e9); });
}
function drawCaptions(ctx, t, y = 1270, hidden = false) {
  if (hidden) return;
  const c = CHUNKS.find(c => t >= c.s - .02 && t < c.e); if (!c) return;
  const size = 104;
  ctx.font = `${size}px "Lilita One"`;
  const words = c.words.map(w => ({ ...w, text: w.w.toUpperCase().replace(/…/g, '...') }));
  const space = 44, widths = words.map(w => ctx.measureText(w.text).width);
  // wrap into rows of max 940px
  const rows = [[]]; let rw = 0;
  words.forEach((w, i) => { if (rw + widths[i] > 940 && rows[rows.length - 1].length) { rows.push([]); rw = 0; } rows[rows.length - 1].push(i); rw += widths[i] + space; });
  rows.forEach((row, ri) => {
    const total = row.reduce((a, i) => a + widths[i], 0) + space * (row.length - 1);
    let x = 540 - total / 2; const yy = y + (ri - (rows.length - 1) / 2) * (size * 1.05);
    row.forEach(i => {
      const w = words[i], dt = t - w.s;
      if (dt < -.02) { x += widths[i] + space; return; }
      const col = capColor(c.line, w.w), emph = col !== '#fff';
      const k = pop(dt + .02, emph ? .24 : .2);
      const rot = emph ? Math.sin(hash(w.s * 100) * 6) * .06 * Math.exp(-dt * 6) : 0;
      ctx.save(); ctx.translate(x + widths[i] / 2, yy); ctx.rotate(rot); ctx.scale(k, k);
      ctx.font = `${size}px "Lilita One"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillText(w.text, 6, 10);
      ctx.lineWidth = 22; ctx.strokeStyle = '#000'; ctx.strokeText(w.text, 0, 0);
      ctx.fillStyle = col; ctx.fillText(w.text, 0, 0);
      ctx.restore();
      x += widths[i] + space;
    });
  });
}
