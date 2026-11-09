// story.js — "In This World, Popcorn Makes You The Main Character": spotlight device, role tags, popcorn, screen dinosaur, music, captions.
'use strict';
// Darkens everything except spotlit circles and draws a light cone from the top. spots: [{x, y, r}] (canvas px, y = centre of the lit circle).
function spotlight(ctx, spots, a = 1, dark = 0.62) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = `rgba(8,6,20,${dark})`;
  ctx.beginPath(); ctx.rect(0, 0, 1080, 1920); for (const s of spots) { ctx.moveTo(s.x + s.r, s.y); ctx.ellipse(s.x, s.y, s.r, s.r * 1.35, 0, 0, 7); }
  ctx.fill('evenodd');
  for (const s of spots) {
    const g = ctx.createLinearGradient(0, 0, 0, s.y); g.addColorStop(0, 'rgba(255,246,200,0.55)'); g.addColorStop(1, 'rgba(255,246,200,0.12)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(s.x - 40, -10); ctx.lineTo(s.x + 40, -10); ctx.lineTo(s.x + s.r, s.y); ctx.lineTo(s.x - s.r, s.y); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
// Role tag pill above a head, e.g. roleTag(ctx,'MAIN CHARACTER',x,y,'#FFC531') / 'EXTRA #7' grey '#9AA3AD' / 'BACKGROUND EXTRA'. t = time since it appears.
function roleTag(ctx, txt, x, y, col = '#FFC531', t = 1, size = 46) {
  if (t < 0) return; const sc = t < 0.15 ? 0.3 + 0.7 * t / 0.15 * 1.15 : 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.font = `${size}px 'Lilita One'`; const w = ctx.measureText(txt).width + size;
  ctx.fillStyle = col; ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 0.75, w, size * 1.5, size * 0.75); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#1b1b2a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 2); ctx.restore();
}
function kernel(ctx, x, y, s = 1, glint = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#FFF4D6'; ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 4;
  ctx.beginPath(); for (const [dx, dy, r] of [[-9, 0, 13], [9, -3, 14], [0, -12, 12], [2, 8, 11]]) { ctx.moveTo(dx + r, dy); ctx.arc(dx, dy, r, 0, 7); } ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#F2B531'; ctx.beginPath(); ctx.arc(0, 12, 6, 0, 7); ctx.fill();
  if (glint > 0) { ctx.globalAlpha *= glint; ctx.fillStyle = '#fff'; ctx.beginPath(); for (let i = 0; i < 4; i++) { const an = i * Math.PI / 2; ctx.moveTo(0, 0); ctx.lineTo(Math.cos(an) * 46, Math.sin(an) * 46); ctx.lineTo(Math.cos(an + .3) * 8, Math.sin(an + .3) * 8); } ctx.fill(); }
  ctx.restore();
}
// Blocky cartoon T-rex for the theater screen. turn 0 = side view walking, 1 = facing camera; roar 0..1 opens the jaw.
function dino(ctx, x, y, s = 1, turn = 0, roar = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (turn > .5 ? 1 : -1), s); ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 8; ctx.lineJoin = 'round';
  const body = '#5DBB4A', dark = '#3E8E34';
  const box = (c, X, Y, W, H) => { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(X, Y, W, H, 14); ctx.fill(); ctx.stroke(); };
  box(dark, -150, -40, 140, 40); box(body, -60, -120, 170, 150); box(dark, -20, 20, 40, 90); box(dark, 50, 20, 40, 90);
  box(body, 70, -230, 150, 90); box(body, 70, -150 + roar * 30, 150, 40 + roar * 10);
  ctx.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(90 + i * 26, -140); ctx.lineTo(102 + i * 26, -122); ctx.lineTo(114 + i * 26, -140); ctx.fill(); }
  ctx.beginPath(); ctx.arc(170, -200, 14, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#1b1b2a'; ctx.beginPath(); ctx.arc(173 + turn * 3, -200, 7, 0, 7); ctx.fill();
  box(body, 100, -60, 50, 18); ctx.restore();
}
STORY.music = () => [[0, 'main'], [LINE.L13.start - .05, 'tense'], [LINE.L16.start - .1, 'calm'], [LINE.L19.start - .1, 'love'], [LINE.L22.start - .05, 'party']];
STORY.capColors = {
  yellow: ['popcorn', 'spotlight', 'main', 'character', 'kernel', 'bucket', 'sequel', 'lead', 'chase', 'two'],
  red: ['dinosaur', 'roared', 'mine', 'slapped', 'sat', 'subscribe', "don't", 'embarrass', 'all', 'never'],
  green: ['half', 'violins', 'slow', 'motion', 'indoors'],
  pink: ['lily', 'me', 'she', 'sister', 'extra', 'seven'],
};
STORY.capOverride = { 'L22:sister': 'red', 'L22:extra': 'red', 'L9:me': 'red' };
