// story.js — "I'm The Only Guy Awake In The World" (long-form 16:9). Shared helpers + state for all shot parts.
'use strict';
// Female principal (the male `principal` hibernates all winter like every guy).
CAST.principalF = { ...CAST.teacher, shirt: '#7B4BFF', sleeve: '#7B4BFF', seed: 77 };
const WINTER = () => [ws('L20', 'fell'), lineT('L97')];          // guys asleep between these times
const GIRLS = ['lily', 'kidA', 'kidC', 'kidE', 'kidF', 'teenSister', 'mom', 'teacher'];

// ---- falling snow (screen space, call in ui). a = 0..1 density
function snowfall(ctx, T, a = 1, seed = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= Math.min(1, a);
  for (let i = 0; i < Math.round(90 * a); i++) { const r = rng(seed * 97 + i); const sp = 60 + r() * 120, x0 = r() * W, y0 = r() * H, sz = 3 + r() * 7;
    const y = (y0 + T * sp) % (H + 20) - 10, x = (x0 + Math.sin(T * (.6 + r()) + i) * 30 + W) % W; circle(ctx, x, y, sz, '#fff'); }
  ctx.restore();
}
// ---- floating Zzz (world space)
function zzz(ctx, x, y, T, s = 1, seed = 0) {
  for (let i = 0; i < 3; i++) { const k = ((T * .5 + i / 3 + hash(seed) ) % 1);
    ctx.save(); ctx.globalAlpha *= Math.sin(k * Math.PI); txt(ctx, 'Z', x + k * 60 * s + Math.sin(T * 2 + i) * 8, y - k * 140 * s, (34 + i * 10) * s, '#fff', OUTLINE, 7 * s); ctx.restore(); }
}
// ---- a guy asleep in a sleeping bag on the floor; head to the left of x, feet at x. o: {bag, z, face}
function sleeper(ctx, name, x, y, s, T, o = {}) {
  const L = (RIG.legH + RIG.torsoH) * s * (CAST[name].tall || 1), breathe = Math.sin(T * 1.6 + x) * 4 * s;
  ctx.save(); ctx.translate(x, y - 75 * s); ctx.rotate(-Math.PI / 2);
  drawCharacter(ctx, name, P({ x: 0, y: 0, s, armL: .1, armR: .1 }), Object.assign({ expr: 'neutral', eyes: { open: 0 }, mouth: 'smallOpen', noBlink: true }, o.face || {}), T);
  ctx.restore();
  box(ctx, x - L - 30 * s, y - 150 * s - breathe, L + 110 * s, 150 * s + breathe, 60 * s, o.bag || '#3E7BD8', 8);
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(x - L - 10 * s, y - 120 * s - breathe, L + 40 * s, 14 * s);
  if (o.z !== false) zzz(ctx, x - L - 80 * s, y - 220 * s, T, s * 1.4, x);
}
// ---- props (hand space)
function holdCocoa(ctx) { box(ctx, -38, -10, 76, 90, 14, '#fff', 7); box(ctx, -38, 10, 76, 26, 0, '#EE384A', 0); ctx.beginPath(); ctx.arc(46, 35, 22, -1.2, 1.2); ctx.lineWidth = 9; ctx.strokeStyle = OUTLINE; ctx.stroke();
  ellipse(ctx, 0, -10, 36, 10, '#7A4A2A', 5); for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-18 + i * 18, -30); ctx.quadraticCurveTo(-8 + i * 18, -55, -18 + i * 18, -80); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.stroke(); }
  starPath(ctx, 0, 52, 14, 6, 6); fillStroke(ctx, '#7FD4FF', 3); }
function holdSketchbook(ctx) { box(ctx, -70, -10, 140, 110, 10, '#2E6BD8', 7); box(ctx, -60, 0, 120, 90, 6, '#FFF8E0', 0); starPath(ctx, 0, 45, 22, 9, 6); fillStroke(ctx, '#7FD4FF', 4); }
function holdJar(ctx) { box(ctx, -40, -20, 80, 100, 16, 'rgba(200,230,255,.85)', 7); box(ctx, -44, -40, 88, 26, 8, '#EE384A', 7); box(ctx, -30, 10, 60, 60, 10, '#B0336A', 0); }
function holdCookie(ctx) { circle(ctx, 0, 10, 30, '#D9A15A', 6); for (let i = 0; i < 4; i++) circle(ctx, -12 + (i % 2) * 22, i < 2 ? 0 : 20, 5, '#4A2810'); }
function holdPhoto(ctx) { ctx.save(); ctx.rotate(-.06); box(ctx, -90, -40, 180, 140, 6, '#F4E6C8', 7); box(ctx, -76, -28, 152, 104, 2, '#C9A97A', 0); txt(ctx, '♥', 0, 22, 54, '#FF5B9B', OUTLINE, 4); ctx.restore(); }
// ---- stuck loading bar (screen space)
function loadingBar(ctx, x, y, w, pct, label = 'SLEEP.EXE') {
  box(ctx, x - w / 2, y - 40, w, 80, 40, '#222331', 8); box(ctx, x - w / 2 + 12, y - 28, (w - 24) * pct, 56, 28, '#30CE65', 0);
  txt(ctx, `${label}  ${Math.round(pct * 100)}%`, x, y + 2, 44, '#fff', OUTLINE, 8);
}
// ---- Dad's snack stash: cupboard with padlock + sign. o: {open 0..1, empty 0..1(how much is gone)}
function snackStash(ctx, x, y, o = {}) {
  box(ctx, x - 150, y - 300, 300, 300, 14, '#B5763C', 8);
  const op = o.open || 0;
  if (op > 0) { box(ctx, x - 135, y - 285, 270, 270, 8, '#5A3418', 0); const left = 1 - (o.empty || 0);
    for (let i = 0; i < 6; i++) if (hash(i * 3.1) < left) box(ctx, x - 120 + (i % 3) * 82, y - 270 + Math.floor(i / 3) * 128, 70, 110, 8, PCOLORS[i], 6); }
  ctx.save(); ctx.translate(x - 150, 0); ctx.scale(1 - op * .85, 1); box(ctx, 0, y - 300, 150, 300, 10, '#C98B4B', 8); ctx.restore();
  ctx.save(); ctx.translate(x + 150, 0); ctx.scale(1 - op * .85, 1); box(ctx, -150, y - 300, 150, 300, 10, '#C98B4B', 8); ctx.restore();
  if (op < .5) { box(ctx, x - 26, y - 170, 52, 44, 8, '#FFC83D', 6); ctx.beginPath(); ctx.arc(x, y - 172, 18, Math.PI, 0); ctx.lineWidth = 9; ctx.strokeStyle = OUTLINE; ctx.stroke(); }
  ctx.save(); ctx.translate(x, y - 370); ctx.rotate(-.04); box(ctx, -170, -50, 340, 100, 10, '#FFF8E0', 7);
  txt(ctx, "DON'T TOUCH.", 0, -16, 36, '#EE384A', OUTLINE, 0); txt(ctx, "I'LL KNOW.  - DAD", 0, 24, 30, OUTLINE, OUTLINE, 0); ctx.restore();
}
// ---- dance sign-up sheet on a locker. n = names shown (0..40)
function signupSheet(ctx, x, y, n, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(.03); box(ctx, -110, -150, 220, 300, 6, '#FFFFFF', 7);
  txt(ctx, 'DANCE SIGN UP', 0, -122, 26, '#7B4BFF', OUTLINE, 0);
  for (let i = 0; i < Math.min(n, 28); i++) { const r = rng(i + 5); ctx.strokeStyle = ['#2E6BD8', '#EE384A', '#FF5B9B', '#30A045'][i % 4]; ctx.lineWidth = 3; ctx.beginPath();
    const yy = -95 + (i % 14) * 16, xx = i < 14 ? -96 : 6; ctx.moveTo(xx, yy); for (let k = 1; k < 8; k++) ctx.lineTo(xx + k * 11, yy + (r() - .5) * 8); ctx.stroke(); }
  ctx.restore();
}
// ---- countdown clock HUD (top-right) during the dance countdown
function clockHUD(ctx, T) {
  const a = lineT('L93') - .1, b = lineT('L99') + 1.5; if (T < a || T > b) return;
  const k = smooth(inv(a, a + .3, T)) * (1 - smooth(inv(b - .3, b, T)));
  const label = T < lineT('L96') - .05 ? '11:58' : T < lineT('L97') - .05 ? '11:59' : '12:00';
  const mid = label === '12:00';
  ctx.save(); ctx.globalAlpha *= k; ctx.translate(W - 210, 90); const pz = 1 + Math.max(0, 1 - (T - (mid ? lineT('L97') : lineT('L96'))) * 4) * .15; ctx.scale(pz, pz);
  box(ctx, -150, -55, 300, 110, 55, mid ? '#30CE65' : '#222331', 8); txt(ctx, label, 10, 4, 64, '#fff', OUTLINE, 9); ctx.restore();
}
STORY.hudDraw = (ctx, T) => clockHUD(ctx, T);

STORY.music = () => [[0, 'main'], [ws('L20', 'snowflake'), 'tense'], [lineT('L31') - .1, 'main'], [lineT('L49') - .1, 'tense'], [lineT('L54') - .1, 'love'],
  [lineT('L59') - .1, 'main'], [lineT('L60') - .1, 'tense'], [lineT('L74') - .1, 'calm'], [lineT('L81') - .1, 'love'], [lineT('L84') - .1, 'main'],
  [lineT('L93') - .1, 'tense'], [lineT('L97') - .05, 'party'], [lineT('L102') - .1, 'love'], [lineT('L112') - .1, 'main']];
STORY.capColors = {
  red: ['gone', 'asleep', 'hibernate', 'broken', 'fire', 'alarm', 'grandpa', 'midnight', 'weird', 'open', 'empty', 'caught', 'subscribe'],
  yellow: ['snow', 'snowflake', 'winter', 'dance', 'jar', 'spider', 'projector', 'sixty', 'fifty', 'bluetooth', 'speaker', 'traps', 'cookies'],
  green: ['awake', 'spring', 'partner', 'plan', 'melts', 'hundred', 'six'],
  pink: ['lily', 'chocolate', 'snowflakes', 'sketchbook', 'grandma', 'dance?', 'lonely', 'you'],
};
STORY.capOverride = { 'L0:guy': 'red', 'L2:me': 'yellow', 'L27:me': 'green', 'L32:me': 'green', 'L93:eleven': 'yellow', 'L96:eleven': 'yellow' };
