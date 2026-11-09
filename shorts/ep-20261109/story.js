// story.js: "In This World, Bad Jokes Do Real Damage". Shared device: Dad's PUN PRESSURE gauge + game-style damage numbers.
'use strict';
// Pressure 0..100 of the joke Dad is holding in (L8 lettuce -> L16 release).
function punPressure(T) {
  if (!LINE.L8) return 0;
  const k = [[0, 0], [wordT('L8', 'red'), 35], [wordT('L9', 'puffed'), 60], [wordT('L10', 'ear'), 45],
    [wordT('L12', 'cheese'), 85], [wordT('L15', 'now'), 99], [wordT('L16', 'getaway'), 0]];
  let v = 0; for (const [t, p] of k) if (T >= t) v = p;
  return v;
}
// Gauge visible L8 start .. L17 start. Screen-space, top-centre (below safe area).
function drawPunMeter(ctx, T) {
  if (!LINE.L8) return;
  const t0 = lineT('L8', 0), t1 = lineT('L17', 0);
  const a = smooth(inv(t0 - .1, t0 + .25, T)) * (1 - smooth(inv(t1, t1 + .3, T)));
  if (a <= 0) return;
  const p = punPressure(T), shake = p > 80 ? Math.sin(T * 70) * (p - 80) * .4 : 0;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(540 + shake, 250);
  ctx.fillStyle = 'rgba(20,20,35,.82)'; roundRect(ctx, -330, -70, 660, 140, 34); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '900 44px Fredoka, Arial'; ctx.textAlign = 'center';
  ctx.fillText(p >= 99 ? 'DAD JOKE: READY 💥' : 'DAD JOKE PRESSURE', 0, -18);
  ctx.fillStyle = '#333'; roundRect(ctx, -290, 6, 580, 40, 20); ctx.fill();
  ctx.fillStyle = p > 80 ? '#EE384A' : p > 50 ? '#FFB02E' : '#5BD16B';
  roundRect(ctx, -290, 6, 580 * p / 100, 40, 20); ctx.fill();
  ctx.restore();
}
function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
// Game-style damage number that pops up and floats at (x,y) from time t0. Call from a shot's draw (world or screen space).
function dmgPop(ctx, txt, x, y, t0, T, col) {
  const e = T - t0; if (e < 0 || e > 1.1) return;
  const s = e < .15 ? .6 + e / .15 * .6 : 1.2 - Math.min(.2, (e - .15)), a = 1 - smooth(inv(.8, 1.1, e));
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y - e * 120); ctx.scale(s, s);
  ctx.font = '900 92px Fredoka, Arial'; ctx.textAlign = 'center'; ctx.lineWidth = 14; ctx.strokeStyle = '#1b1b2a';
  ctx.strokeText(txt, 0, 0); ctx.fillStyle = col || '#FF4D5E'; ctx.fillText(txt, 0, 0); ctx.restore();
}
STORY.hudDraw = drawPunMeter;
STORY.music = () => [[0, 'main'], [lineT('L8', 0), 'tense'], [wordT('L17', 'boom'), 'party'], [lineT('L21', 0) - .1, 'calm']];
STORY.capColors = {
  red: ['damage', 'hit', 'flying', 'worst', 'thief', 'boom', 'freezer', 'red', 'ear', 'now', 'not'],
  yellow: ['joke', 'jokes', 'puns', 'cheese', 'bubble', 'wrap', 'melons', 'getaway', 'cheesy', 'security'],
  green: ['immune', 'standing', 'subscribe'],
  pink: ['mom', 'dad', 'dog'],
};
