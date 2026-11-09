// story.js — "In This World, Dad Jokes Deal Real Damage": shared helpers (damage pops, helmet, produce props), music, captions.
'use strict';
// Floating RPG damage number. t = T - t0. col: red '#EE384A' (damage), green '#3DDC84' (heal), grey '#9AA3AD' (zero).
function dmgPop(ctx, txt, x, y, t, col = '#EE384A', size = 110) {
  if (t < 0 || t > 1.3) return;
  const a = 1 - smooth(inv(0.85, 1.3, t)), sc = t < 0.12 ? 0.4 + 0.6 * (t / 0.12) * 1.25 : 1 + 0.25 * Math.max(0, 1 - (t - 0.12) * 6);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y - 160 * smooth(Math.min(1, t / 1.1))); ctx.scale(sc, sc); ctx.rotate(-0.08);
  ctx.font = `${size}px 'Lilita One'`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round'; ctx.lineWidth = size * 0.16; ctx.strokeStyle = '#1b1b2a'; ctx.strokeText(txt, 0, 0);
  ctx.fillStyle = col; ctx.fillText(txt, 0, 0); ctx.restore();
}
// Yellow hard hat; cx = head centre x, top = y of the top of the head, w = head width.
function helmet(ctx, cx, top, w) {
  ctx.save(); ctx.fillStyle = '#FFC531'; ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = w * 0.05;
  ctx.beginPath(); ctx.ellipse(cx, top + w * 0.12, w * 0.55, w * 0.5, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(cx - w * 0.72, top + w * 0.08, w * 1.44, w * 0.14, w * 0.07); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#E8A300'; ctx.fillRect(cx - w * 0.07, top - w * 0.36, w * 0.14, w * 0.42); ctx.restore();
}
function lettuce(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 5;
  [['#4CAF50', 0, 0, 62], ['#7BD65A', -16, -10, 44], ['#A6EB7A', 10, -14, 30]].forEach(([c, dx, dy, r]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(dx, dy, r, 0, 7); ctx.fill(); ctx.stroke(); });
  ctx.restore();
}
function melon(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 5;
  ctx.fillStyle = '#3E9B3A'; ctx.beginPath(); ctx.ellipse(0, 0, 78, 60, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#225F22'; ctx.lineWidth = 7; for (const k of [-45, -15, 15, 45]) { ctx.beginPath(); ctx.ellipse(k * 0.6, 0, 12, 56, 0, 0, 7); ctx.stroke(); }
  ctx.restore();
}
function milkCarton(ctx, x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 5;
  ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.rect(-34, -40, 68, 100); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#E8ECF2'; ctx.beginPath(); ctx.moveTo(-34, -40); ctx.lineTo(0, -78); ctx.lineTo(34, -40); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3B82F6'; ctx.fillRect(-34, 0, 68, 26); ctx.fillStyle = '#fff'; ctx.font = "22px 'Lilita One'"; ctx.textAlign = 'center'; ctx.fillText('MILK', 0, 22);
  ctx.restore();
}
STORY.music = () => [[0, 'main'], [LINE.L14.start - .05, 'tense'], [LINE.L17.start - .1, 'calm'], [wordT('L21', 'laughed'), 'party'], [LINE.L23.start - .1, 'love']];
STORY.capColors = {
  red: ['destroyed', 'damage', 'punch', 'explode', 'helmet', 'boom', 'licked', 'hurt', 'weapon', 'subscribe', 'orbit', 'battle'],
  yellow: ['dad', 'jokes', 'pun', 'lettuce', 'cereal', 'freezer', 'chill', 'melon', 'milk', 'carts', 'cookie', 'crummy'],
  green: ['heal', 'healed', 'laughed', 'real', 'favorite'],
  pink: ['lily', 'she', 'her', 'mom', 'zero'],
};
STORY.capOverride = { 'L21:zero': 'green', 'L5:zero': 'red', 'L6:zero': 'red' };
