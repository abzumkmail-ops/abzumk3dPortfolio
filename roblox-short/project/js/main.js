// main.js — deterministic renderer. Exposes window.seek(t), window.READY, window.END, window.EV.
'use strict';
let END = 60, SHOTS = [];
const cv = document.getElementById('c');
const Q = new URLSearchParams(location.search);
const OUT_W = +(Q.get('w') || 1080);
cv.width = OUT_W; cv.height = Math.round(OUT_W * 16 / 9);
const ctx = cv.getContext('2d');
const K = OUT_W / W;

function shotAt(t) { let s = SHOTS[0]; for (const x of SHOTS) if (t >= x.start) s = x; return s; }

function seek(t) {
  t = clamp(t, 0, END - 1e-4);
  const s = shotAt(t), lt = t - s.start;
  let cam = s.cam(lt);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.setTransform(K, 0, 0, K, 0, 0);

  // --- transition-in modifiers
  let ox = 0, zmul = 1, blur = 0;
  if (s.trans === 'whip' && lt < .2) { const k = 1 - easeOut(lt / .2); ox = k * 1100; blur = k * 26; }
  if (s.trans === 'zoom' && lt < .22) { zmul = 1 + (1 - easeOut(lt / .22)) * .45; blur = (1 - lt / .22) * 10; }

  ctx.save();
  if (blur > .5) ctx.filter = `blur(${(blur * K).toFixed(1)}px)`;
  ctx.translate(W / 2 + ox, H / 2); ctx.rotate(cam.rot || 0); ctx.scale(cam.z * zmul, cam.z * zmul); ctx.translate(-cam.x, -cam.y);
  s.bg(ctx, t, cam);
  s.draw(ctx, t, lt);
  ctx.restore();
  ctx.filter = 'none';

  // --- screen-space layers
  if (s.ui) s.ui(ctx, t, lt);
  drawGoalHUD(ctx, hudState(t));
  vignette(ctx, .22);
  drawCaptions(ctx, t, s.capY || 1600);
  if (s.trans === 'whip' && lt < .2) { ctx.save(); ctx.globalAlpha = (1 - lt / .2) * .5; ctx.fillStyle = '#fff'; for (let i = 0; i < 9; i++) ctx.fillRect(0, hash(i + 3) * H, W, 6 + hash(i) * 18); ctx.restore(); }
  if (s.trans === 'flash' && lt < .3) { ctx.fillStyle = `rgba(255,255,255,${1 - lt / .3})`; ctx.fillRect(0, 0, W, H); }
  if (s.trans === 'cut' && lt < .06) { ctx.fillStyle = `rgba(255,255,255,${.12 * (1 - lt / .06)})`; ctx.fillRect(0, 0, W, H); }
}

async function init() {
  WORDS = window.WORDS_DATA;
  for (const l of WORDS.lines) LINE[l.id] = l;
  END = +(WORDS.lines[WORDS.lines.length - 1].end + .65).toFixed(3);
  await Promise.all([document.fonts.load('100px "Lilita One"'), document.fonts.load('700 60px "Fredoka"')]);
  buildChunks();
  SHOTS = buildTimeline();
  // Event list for the audio mixer (and for editors): narration lines, shot cuts, SFX cues, music cues
  const EV = [];
  for (const l of WORDS.lines) EV.push({ t: l.start, type: 'line', id: l.id, text: l.text, end: l.end });
  for (const s of SHOTS) {
    EV.push({ t: +s.start.toFixed(3), type: 'shot', id: s.id, trans: s.trans, end: +s.end.toFixed(3) });
    for (const [rt, name, vol] of (s.sfx || [])) EV.push({ t: +(s.start + rt).toFixed(3), type: 'sfx', name, vol });
    if (s.trans === 'whip') EV.push({ t: +s.start.toFixed(3), type: 'sfx', name: 'whoosh', vol: .35 });
    if (s.trans === 'zoom') EV.push({ t: +s.start.toFixed(3), type: 'sfx', name: 'zoom', vol: .35 });
  }
  for (const c of CHUNKS) for (const w of c.words) if (capColor(c.line, w.w) !== '#fff') EV.push({ t: w.s, type: 'sfx', name: 'tick', vol: .12 });
  const mus = (t, mode) => EV.push({ t: +t.toFixed(3), type: 'music', mode });
  mus(0, 'main'); mus(wordT('L15', 'wrong'), 'tense'); mus(LINE.L18.start - .1, 'calm'); mus(wordT('L21', 'ding'), 'party');
  mus(LINE.L23.start - .1, 'love'); mus(END, 'end');
  EV.sort((a, b) => a.t - b.t);
  window.EV = EV; window.END = END; window.seek = seek;
  seek(Q.has('t') ? +Q.get('t') : 0);
  window.READY = true; window.DONE = true;
}
init();
