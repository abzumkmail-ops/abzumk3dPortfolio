// story.js — "In This World, Your Shadow Says What You're Really Thinking"
// Shared systems for all shot parts: talking shadows, speech bubbles, the SECRET HUD, props, the stage set, music, captions.
'use strict';

// ---------------- Talking shadows ----------------
// A cast shadow is the character's silhouette (same rig, so it matches every pose), scaled by k from the feet and
// offset onto a wall/curtain. It has glowing white eyes and a white mouth that lip-syncs to `lines`.
// o: { k=1.5, dx=0, dy=0, alpha=.62, lines=[], eyes:'normal'|'happy'|'wide'|'shy'|'closed', mouth (override shape name), skew=0 }
function shadowOf(ctx, name, pose, T, o = {}) {
  const k = o.k ?? 1.5, sp = Object.assign({}, pose, { x: pose.x + (o.dx || 0), y: pose.y + (o.dy || 0), s: pose.s * k, alpha: 1 });
  ctx.save(); ctx.globalAlpha = (o.alpha ?? .62) * (pose.alpha ?? 1);
  ctx.filter = 'brightness(0)';
  if (o.skew) { ctx.translate(sp.x, sp.y); ctx.transform(1, 0, o.skew, 1, 0, 0); ctx.translate(-sp.x, -sp.y); }
  drawCharacter(ctx, name, sp, Object.assign({ expr: 'neutral' }, o.face || {}), T);
  ctx.filter = 'none'; ctx.restore();
  // glowing face on the shadow's head
  const c = CAST[name], S = sp.s * (c.tall || 1);
  const hx = sp.x + (o.skew ? -o.skew * (RIG.legH + RIG.torsoH + RIG.headH * .45) * S : 0) + (sp.view === 'q34' ? RIG.headW * .1 * S * sp.flip : 0);
  const hy = sp.y + (sp.bodyY - RIG.legH - RIG.torsoH - RIG.headH * .45) * S;
  shadowFace(ctx, hx, hy, S, T, o);
}
function shadowFace(ctx, x, y, S, T, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(S, S);
  ctx.shadowColor = '#B9A6FF'; ctx.shadowBlur = 18;
  const eyes = o.eyes || 'normal', bl = blinkAmt(77 + (o.seed || 0), T);
  for (const ex of [-48, 48]) {
    if (eyes === 'happy' || eyes === 'closed') { ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(ex, eyes === 'happy' ? 6 : -4, 18, eyes === 'happy' ? Math.PI * 1.1 : .15, eyes === 'happy' ? Math.PI * 1.9 : Math.PI - .15); ctx.stroke(); }
    else { const ry = (eyes === 'wide' ? 30 : eyes === 'shy' ? 16 : 24) * bl; ellipse(ctx, ex + (eyes === 'shy' ? -6 : 0), -14, eyes === 'wide' ? 22 : 18, Math.max(2, ry), '#fff'); }
  }
  const shape = o.mouth || (o.lines ? lipShape(T, o.lines) : null) || (eyes === 'happy' ? 'smile' : 'closed');
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round'; ctx.lineWidth = 9;
  const my = 48;
  if (shape === 'closed' || shape === 'flat') { ctx.beginPath(); ctx.moveTo(-20, my); ctx.lineTo(20, my); ctx.stroke(); }
  else if (shape === 'smile' || shape === 'smallSmile') { ctx.beginPath(); ctx.moveTo(-28, my - 6); ctx.quadraticCurveTo(0, my + 18, 28, my - 6); ctx.stroke(); }
  else { const big = { wideOpen: [26, 22], round: [16, 20], teethOpen: [24, 14], smallOpen: [14, 10], teeth: [26, 9], scream: [26, 30] }[shape] || [16, 12]; ellipse(ctx, 0, my + 4, big[0], big[1], '#fff'); }
  ctx.restore();
}
// Dog shadow (the dog rig drawn as a silhouette)
function dogShadow(ctx, x, y, s, T, o = {}) {
  ctx.save(); ctx.globalAlpha = o.alpha ?? .62; ctx.filter = 'brightness(0)'; drawDog(ctx, x, y, s, T, o); ctx.filter = 'none'; ctx.restore();
  shadowFace(ctx, x + 125 * s, y - 225 * s, s * .55, T, { lines: o.lines, eyes: 'wide', seed: 9 });
}

// ---------------- Speech bubble (what a shadow is saying, readable without sound) ----------------
function speechBubble(ctx, x, y, text, dt, o = {}) {
  if (dt < 0 || (o.dur && dt > o.dur)) return;
  const k = pop(dt, .25) * (o.dur ? 1 - smooth(inv(o.dur - .15, o.dur, dt)) : 1);
  const size = o.size || 54; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(o.rot || 0);
  ctx.font = `${size}px "Lilita One"`; const w = ctx.measureText(text).width + 60, h = size * 1.6;
  const dark = o.dark; // dark bubble = a shadow talking
  ctx.beginPath(); ctx.moveTo(-20 + (o.tail || 0) * .3, h / 2 - 4); ctx.lineTo((o.tail || -30), h / 2 + 40); ctx.lineTo(24, h / 2 - 4); fillStroke(ctx, dark ? '#24225B' : '#fff', 8);
  box(ctx, -w / 2, -h / 2, w, h, h / 2, dark ? '#24225B' : '#fff', 8);
  txt(ctx, text, 0, 4, size, dark ? '#fff' : '#24225B', OUTLINE, 0);
  ctx.restore();
}

// ---------------- Props (use in face.holding or draw in world space) ----------------
function holdUmbrella(ctx) { ctx.save(); ctx.translate(0, 20); box(ctx, -5, -330, 10, 340, 4, '#333', 4);
  ctx.beginPath(); ctx.moveTo(-230, -300); ctx.quadraticCurveTo(0, -470, 230, -300); for (let i = 4; i >= 0; i--) ctx.quadraticCurveTo(-230 + (i + .5) * 92, -270, -230 + i * 92, -300); ctx.closePath(); fillStroke(ctx, '#24225B', 8);
  ctx.restore(); }
function holdTeddy(ctx) { ctx.save(); ctx.translate(0, 70); circle(ctx, -34, -58, 20, '#B5733F', 6); circle(ctx, 34, -58, 20, '#B5733F', 6); box(ctx, -50, -60, 100, 90, 34, '#C98B4B', 7);
  box(ctx, -40, 20, 80, 80, 28, '#C98B4B', 7); circle(ctx, -16, -24, 6, OUTLINE); circle(ctx, 16, -24, 6, OUTLINE); ellipse(ctx, 0, -2, 14, 10, '#7A4B2A'); ctx.restore(); }
function holdDrawing(ctx) { ctx.save(); ctx.translate(0, 40); ctx.rotate(-.06); box(ctx, -110, -150, 220, 170, 8, '#FFF8E0', 7);
  ellipse(ctx, 0, -66, 66, 44, '#C98B4B', 6); circle(ctx, -24, -76, 6, OUTLINE); circle(ctx, 20, -78, 6, OUTLINE); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, -60, 18, .3, Math.PI - .3); ctx.stroke(); ctx.restore(); }

// ---------------- Talent-show stage (gym set with its own banner; stage floor at y 1190) ----------------
function envStage(ctx, T, cam, o = {}) { envGym(ctx, T, cam, Object.assign({ banner: 'TALENT SHOW', bannerC: '#7B4BFF', noLights: true, dim: .35 }, o)); }
// Emergency lights: red rotating beams + tint (screen space, use in ui)
function emergencyLights(ctx, T, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = 'rgba(120,0,20,.45)'; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';
  for (const [x, ph] of [[150, 0], [930, 1.5]]) { ctx.save(); ctx.translate(x, 130); ctx.rotate(T * 5 + ph);
    const g = ctx.createLinearGradient(0, 0, 1400, 0); g.addColorStop(0, 'rgba(255,40,60,.7)'); g.addColorStop(1, 'rgba(255,40,60,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -160); ctx.lineTo(1400, 160); ctx.fill(); ctx.restore();
    circle(ctx, x, 130, 34, '#FF3B4E', 6); }
  ctx.restore();
}

// ---------------- SECRET status HUD (top centre) ----------------
STORY.hudDraw = (ctx, T) => {
  if (!LINE.L7) return;
  const t0 = ws('L7', 'secret'), tEnd = LINE.L23.start + .3;
  const a = smooth(inv(t0 - .1, t0 + .2, T)) * (1 - smooth(inv(tEnd, tEnd + .4, T)));
  if (a <= 0) return;
  const danger = T >= ws('L10', 'spotlight'), out = T >= ws('L20', 'lily');
  const label = out ? 'SECRET: OUT ♥' : danger ? 'SECRET: DANGER!' : 'SECRET: SAFE';
  const bg = out ? '#FF5B9B' : danger ? '#EE384A' : '#30A045';
  const pulse = danger && !out ? 1 + Math.max(0, Math.sin(T * 9)) * .06 : 1 + Math.max(0, .25 - (T - ws('L20', 'lily'))) * (out ? 1 : 0);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(540, 150 - (1 - a) * 120); ctx.scale(pulse, pulse);
  ctx.font = '62px "Lilita One"'; const w = ctx.measureText(label).width + 150;
  box(ctx, -w / 2 + 6, -56, w, 124, 62, 'rgba(0,0,0,.3)', 0); box(ctx, -w / 2, -64, w, 124, 62, bg, 9);
  // lock / heart icon
  if (out) { heartPath(ctx, -w / 2 + 62, -2, 30); fillStroke(ctx, '#fff', 5); }
  else { box(ctx, -w / 2 + 40, -18, 44, 38, 8, '#FFC83D', 5); ctx.lineWidth = 7; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.arc(-w / 2 + 62, -18, 14, Math.PI, 0); ctx.stroke(); }
  txt(ctx, label, 36, -2, 62, '#fff', OUTLINE, 9);
  ctx.restore();
};
// HUD covers screen y 80–220: keep heads below ~300 while it is visible (from L7 "secret" to L23).

// ---------------- Continuity helpers ----------------
const nubiHoodie = T => T < ws('L13', 'hoodie') + .1;   // Nubi takes the hoodie off in L13 and never puts it back on

// ---------------- Music + captions ----------------
STORY.music = () => [[0, 'main'], [ws('L11', 'ten'), 'tense'], [LINE.L18.start - .1, 'calm'], [ws('L20', 'like'), 'love']];
STORY.capColors = {
  yellow: ['shadow', 'shadows', 'spotlight', 'stage', 'mic', 'hoodie', 'lights', 'squirrel', 'potato', 'snuggles', 'teddy'],
  red: ['lie', 'louder', 'tall', 'emergency', 'gasped', 'red', 'hide', 'hiding', 'vampire'],
  pink: ['lily', 'like', 'finally', 'together', 'hands', 'secret'],
  green: ['sun', 'myself'],
};
STORY.capOverride = { 'L22:shadow': 'pink' };
