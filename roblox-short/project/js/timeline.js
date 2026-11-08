// timeline.js — the shot list. Every shot is anchored to narration word timestamps,
// so swapping the voiceover automatically re-times the whole video.
'use strict';
const P = o => basePose(o);
function C(ctx, name, p, face, T) { drawShadow(ctx, p); drawCharacter(ctx, name, p, face, T); }
const camAt = (x, y, z, rot = 0) => ({ x, y, z, rot });
const KIDS = ['kidA', 'kidB', 'kidC', 'kidD', 'kidE', 'kidF'];

// ---- global story state ----
function nubiLikes(T) {
  if (!LINE.L21) return 1;
  return counterAt([[0, 1], [wordT('L21', 'two'), 2], [wordT('L21', 'twenty'), 20], [wordT('L21', 'fifty'), 50]], T);
}
function hudState(T) {
  const t0 = wordT('L10', 'ten'), tEnd = lineT('L22', 0) + .5;
  if (T < t0 - .05 || T > tEnd + .4) return null;
  const nl = nubiLikes(T);
  let day = '3 DAYS', danger = false;
  if (T >= lineT('L12')) day = '2 DAYS';
  if (T >= lineT('L13')) day = '1 DAY';
  if (T >= lineT('L14')) { day = 'TODAY!'; danger = true; }
  const lastStep = nl.since;
  return { have: nl.v, goal: 10, day, danger, done: nl.v >= 10, alpha: smooth(inv(t0 - .05, t0 + .25, T)) * (1 - smooth(inv(tEnd, tEnd + .4, T))),
    pulse: Math.max(0, 1 - lastStep * 4) * (T > wordT('L21', 'two') - .01 ? 1 : 0) };
}
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

function buildTimeline() {
  const L = LINE, ws = (id, w, o = 0) => wordT(id, w, o), we = (id, w, o = 0) => wordT(id, w, o, 'e');
  const st = id => L[id].start - .08;
  const S = [];

  // ===== S01 HOOK — pull back from Nubi's "1" to a hallway full of numbers =====
  S.push({ id: 'S01', start: 0, trans: 'none', capY: 1600,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => lt < 1.3 ? track([[0, camAt(540, 1000, 2.6)], [1.3, camAt(540, 1060, 1)]], lt) : camAt(540, 1060 - (lt - 1.3) * 10, 1 + (lt - 1.3) * .04),
    draw(ctx, T, lt) {
      const back = [['kidE', 250, 64, .45], ['kidF', 840, 19, .6]], front = [['kidA', 105, 37, .25], ['kidB', 300, 152, .75], ['kidC', 780, 88, .95], ['kidD', 975, 210, 1.15]];
      for (const [n, x, v, pt] of back) { const p = idle(P({ x, y: 1390, s: .62 }), T, x); C(ctx, n, p, { expr: 'happy', lookX: x < 540 ? .5 : -.5 }, T); badgeOver(ctx, n, p, v, { pop: pop(lt - pt), t: T, seed: x, bs: .85 }); }
      for (const [n, x, v, pt] of front) { const p = idle(P({ x, y: 1500, s: .8, view: 'q34', flip: x < 540 ? 1 : -1 }), T, x); C(ctx, n, p, { expr: 'happy' }, T); badgeOver(ctx, n, p, v, { pop: pop(lt - pt), t: T, seed: x, bs: .82 }); }
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); C(ctx, 'nubi', p, { expr: lt > 1.4 ? 'nervous' : 'neutral', lookY: lt > 1.4 ? -.8 : 0 }, T);
      badgeOver(ctx, 'nubi', p, 1, { t: 0 });
    },
    sfx: [[0, 'bell', .5], [.25, 'pop', .5], [.45, 'pop', .5], [.6, 'pop', .5], [.75, 'pop', .5], [.95, 'pop', .5], [1.15, 'pop', .5], [0.05, 'whoosh', .5]] });

  // ===== S02 — numbers = how many people REALLY like you (hearts fly into kidB's counter) =====
  S.push({ id: 'S02', start: st('L1'), trans: 'zoom', capY: 1620,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1080 - lt * 15, 1.55 + lt * .05),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 3); C(ctx, 'kidB', p, { expr: 'excited', lookY: -.7 }, T);
      const arrivals = [.35, .7, 1.05, 1.35];
      const got = arrivals.filter(a => lt > a + .35).length, bx = 540, by = headTop('kidB', p) - 72;
      arrivals.forEach((a, i) => { const u = inv(a, a + .35, lt); if (u <= 0 || u >= 1) return; const sx = i % 2 ? 1250 : -150, sy = 1250 + i * 60;
        const x = lerp(sx, bx, easeInOut(u)), y = lerp(sy, by, easeInOut(u)) - Math.sin(u * Math.PI) * 220; heartPath(ctx, x, y, 34); fillStroke(ctx, '#FF5B9B', 7); });
      const lastA = arrivals.filter(a => lt > a + .35).pop();
      badgeOver(ctx, 'kidB', p, 152 + got, { t: T, seed: 2, pop: 1 + (lastA ? Math.max(0, .25 - (lt - lastA - .35)) : 0) });
    },
    sfx: [[.7, 'ding', .45], [1.05, 'ding', .45], [1.4, 'ding', .45], [1.7, 'ding', .45]] });

  // ===== S03 — you can't fake it; family doesn't count =====
  const fakeT = ws('L2', 'fake'), famT = ws('L2', 'family');
  S.push({ id: 'S03', start: st('L2'), trans: 'whip', capY: 1620,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(560, 1060, 1.35),
    draw(ctx, T, lt) {
      const t = T;
      const momX = lerp(1250, 830, easeOut(inv(famT - .25, famT + .2, t)));
      if (t > famT - .3) { const mp = walk(P({ x: momX, y: 1500, s: .78, flip: -1, view: 'q34' }), t, 1, t < famT + .2 ? 1 : 0); if (t > famT + .2) { mp.armL = 1.2; mp.armR = .9; } C(ctx, 'mom', mp, { expr: 'happy' }, t); }
      const p = idle(P({ x: 470, y: 1500, s: .8 }), t, 5);
      const faking = t < fakeT;
      if (faking) { p.armR = 2.5; }
      C(ctx, 'kidE', p, { expr: faking ? 'smug' : t < famT ? 'nervous' : 'shy', holding: faking ? { R: holdSign('9,999') } : null }, t);
      badgeOver(ctx, 'kidE', p, 2, { t, seed: 5, pop: faking ? 0 : pop(t - fakeT) });
      burst(ctx, 470, headTop('kidE', p) - 80, t - fakeT, { kind: 'dust', n: 18, speed: 500, gravity: -200, life: .6, size: 30, colors: ['#fff', '#ddd'] });
      // family heart bounces off the counter
      const hu = inv(famT + .25, famT + .75, t);
      if (hu > 0 && hu < 1.6) { const bx = 470, by = headTop('kidE', p) - 70;
        let x, y; if (hu < 1) { x = lerp(830, bx + 40, hu); y = lerp(1180, by, hu) - Math.sin(hu * Math.PI) * 160; } else { const v = (hu - 1) / .6; x = bx + 40 + v * 380; y = by - v * 260 + v * v * 500; }
        ctx.save(); ctx.globalAlpha = hu > 1.3 ? 1 - (hu - 1.3) / .3 : 1; heartPath(ctx, x, y, 36); fillStroke(ctx, '#FF5B9B', 7); ctx.restore(); }
    },
    ui(ctx, T) { stamp(ctx, 'FAKE!', 540, 640, T - fakeT - .05, '#EE384A', 1.0); popText(ctx, 'FAMILY = 0', 540, 600, T - famT - .75, { size: 92, fill: '#FFD447', dur: 1.0, rot: -.05 }); },
    sfx: [[fakeT - st('L2'), 'poof', .7], [fakeT - st('L2') + .05, 'buzz', .45], [famT - st('L2') + .75, 'boing', .6]] });

  // ===== S04 — pop stars have millions =====
  S.push({ id: 'S04', start: st('L3'), trans: 'cut', capY: 1650,
    bg: (ctx, T, cam) => envConcert(ctx, T, cam),
    cam: lt => { const z = 1.05 + lt * .08; return camAt(540 + Math.sin(lt * 10) * 4, 1050, z); },
    draw(ctx, T, lt) {
      const p = celebrate(P({ x: 540, y: 1440, s: .85 }), T, .8); p.armR = 2.0;
      C(ctx, 'popstar', p, { expr: 'excited', mouth: Math.floor(T * 7) % 2 ? 'wideOpen' : 'round', holding: { R: holdMic } }, T);
      const v = Math.floor(lerp(1250000, 2481000, easeOut(clamp(lt / 1.1))) / 1000) * 1000;
      badgeOver(ctx, 'popstar', p, v, { state: 'gold', t: T, pop: pop(lt) * 1.1, glow: 1, glowC: '#FFD447' });
      burst(ctx, 540, 700, lt - .1, { kind: 'sparkle', n: 30, speed: 1100, gravity: 300, life: 1.2, size: 26 });
      concertCrowd(ctx, T);
    },
    sfx: [[0, 'cheer', .55], [0.05, 'sparkle', .5]] });

  // ===== S05 — my dog has six =====
  S.push({ id: 'S05', start: st('L4'), trans: 'whip', capY: 1650,
    bg: (ctx, T, cam) => envBackyard(ctx, T, cam),
    cam: lt => camAt(600, 1150, 1.25 + lt * .05),
    draw(ctx, T, lt) { drawDog(ctx, 520, 1520, 1.25, T); drawBadge(ctx, 520 + 140 * 1.25, 1520 - 380 * 1.25, 6, { s: 1.1, t: T, pop: pop(lt - .25) }); burst(ctx, 690, 1150, lt - .3, { kind: 'heart', n: 6, speed: 400, gravity: -300, life: 1, size: 22 }); },
    sfx: [[.25, 'pop', .5], [.3, 'bark', .6]] });

  // ===== S06 — grandma: four hundred, she bakes cookies =====
  const gmT = ws('L5', 'four'), ckT = ws('L5', 'cookies');
  S.push({ id: 'S06', start: st('L5'), trans: 'cut', capY: 1650,
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam),
    cam: lt => camAt(540, 1080, 1.12),
    draw(ctx, T, lt) {
      for (const [n, x, f] of [['kidA', 180, 1], ['kidC', 900, -1]]) { const kp = idle(P({ x, y: 1500, s: .72, flip: f, view: 'q34' }), T, x); if (T > ckT) { kp.armR = 1.3 + Math.sin(T * 10) * .2; kp.bodyY -= Math.abs(Math.sin(T * 9)) * 18; } C(ctx, n, kp, { expr: T > ckT ? 'love' : 'happy' }, T); }
      const p = idle(P({ x: 540, y: 1500, s: .82 }), T, 6); p.armL = .35; p.armR = .35;
      C(ctx, 'grandma', p, { expr: 'happy' }, T);
      ctx.save(); ctx.translate(540, 1500 - 175 * .82 * 1.02); ctx.scale(.82, .82); holdTray(ctx);
      for (let i = 0; i < 3; i++) { ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 8; ctx.beginPath(); const x = -70 + i * 70; ctx.moveTo(x, 0); ctx.bezierCurveTo(x - 20, -40 - (T * 60 % 40), x + 20, -70, x, -110); ctx.stroke(); }
      ctx.restore();
      badgeOver(ctx, 'grandma', p, 400, { t: T, pop: pop(T - gmT), state: 'green' });
      burst(ctx, 540, 900, T - ckT, { kind: 'heart', n: 10, speed: 600, gravity: -100, life: 1, size: 26 });
    },
    sfx: [[gmT - st('L5'), 'ding', .55], [ckT - st('L5'), 'cheer', .35]] });

  // ===== S07 — Me? I have exactly one (close-up) =====
  const oneT = ws('L6', 'one');
  S.push({ id: 'S07', start: st('L6'), trans: 'zoom', capY: 1640,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1110, 2.05 + lt * .06),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); const sh = smooth(inv(oneT - .3, oneT, T)); p.armL = .1 + .7 * sh; p.armR = .1 + .7 * sh; p.handL = -.6 * sh; p.handR = -.6 * sh; p.headY = 6 * sh;
      C(ctx, 'nubi', p, { expr: T > oneT ? 'sad' : 'nervous', mouth: lipShape(T, ['L6']) }, T);
      badgeOver(ctx, 'nubi', p, 1, { t: T, pop: T > oneT ? 1 - .25 * Math.sin(clamp((T - oneT) / .4) * Math.PI) : 1 });
    },
    sfx: [[oneT - st('L6'), 'sad_trombone', .55]] });

  // ===== S08 — kids call me Lonely One =====
  S.push({ id: 'S08', start: st('L7'), trans: 'cut', capY: 1620,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const sh = lt > .3 ? Math.sin(lt * 50) * 4 * Math.exp(-(lt - .3) * 4) : 0; return camAt(540 + sh, 1060, 1.02); },
    draw(ctx, T, lt) {
      const kids = [['kidA', 110, 1, 37], ['kidB', 300, 1, 153], ['kidC', 780, -1, 88], ['kidD', 970, -1, 210]];
      for (const [n, x, f, v] of kids) { const kp = laugh(P({ x, y: 1500, s: .76, flip: f, view: 'q34' }), T + x, 1); kp.armR = 1.35; kp.handR = -.3; C(ctx, n, kp, { expr: 'laughing' }, T); badgeOver(ctx, n, kp, v, { t: T, seed: x, bs: .82 }); }
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1, .5); p.headY = 8; C(ctx, 'nubi', p, { expr: 'sad' }, T); badgeOver(ctx, 'nubi', p, 1, { t: T });
    },
    sfx: [[.15, 'laugh', .55]] });

  // ===== S09 — I figured my one was the lunch lady =====
  S.push({ id: 'S09', start: st('L8'), trans: 'whip', capY: 1650,
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam),
    cam: lt => camAt(560, 1070, 1.1 + lt * .03),
    draw(ctx, T, lt) {
      const lp = idle(P({ x: 720, y: 1420, s: .82 }), T, 8); lp.armR = 1.1 + Math.sin(T * 5) * .3;
      C(ctx, 'lunchlady', lp, { expr: 'smug', eyes: { open: .58 } }, T);
      badgeOver(ctx, 'lunchlady', lp, 312, { t: T, seed: 9 });
      box(ctx, 400, 1260, 720, 260, 16, '#B8C2CC', 9); box(ctx, 380, 1240, 760, 40, 12, '#E8F2F7', 8);
      for (let i = 0; i < 3; i++) { box(ctx, 450 + i * 210, 1215, 170, 40, 10, ['#FFD447', '#30CE65', '#FF8528'][i], 6); }
      const np = idle(P({ x: 230, y: 1520, s: .82, view: 'q34' }), T, 1); np.armL = .5; np.armR = .5;
      C(ctx, 'nubi', np, { expr: 'love' }, T);
      const nb = { x: 230, y: headTop('nubi', np) - 74 };
      badgeOver(ctx, 'nubi', np, 1, { t: T });
      ctx.save(); ctx.setLineDash([18, 16]); ctx.lineDashOffset = -T * 60; ctx.strokeStyle = '#FF5B9B'; ctx.lineWidth = 8;
      const k = smooth(inv(.3, 1.0, lt)); ctx.beginPath(); ctx.moveTo(nb.x + 90, nb.y); ctx.quadraticCurveTo(470, 640, lerp(nb.x + 90, 640, k), lerp(nb.y, 1050, k)); ctx.stroke(); ctx.restore();
      if (lt > 1) popText(ctx, '?', 470, 640, lt - 1, { size: 140, fill: '#FFD447' });
    },
    sfx: [[.3, 'magic', .4]] });

  // ===== S10 — Brayden, nine hundred likes, laughed in my face =====
  const b900 = ws('L9', 'nine'), blaugh = ws('L9', 'laughed');
  S.push({ id: 'S10', start: st('L9'), trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const T = lt + st('L9'); const k = smooth(inv(blaugh - .2, blaugh + .2, T)); const sh = T > blaugh ? Math.sin(T * 60) * 6 * Math.exp(-(T - blaugh) * 5) : 0; return camAt(lerp(660, 560, k) + sh, lerp(1060, 1120, k), lerp(1, 1.35, k)); },
    draw(ctx, T, lt) {
      const t0 = st('L9'), bx = lerp(1350, 700, easeOut(inv(t0, t0 + 1.0, T)));
      for (const [n, dx, s] of [['kidD', 230, .66], ['kidF', 400, .66]]) { const fp = walk(P({ x: bx + dx, y: 1430, s, flip: -1, view: 'q34' }), T, 1.1, T < t0 + 1.0 ? 1 : 0); C(ctx, n, fp, { expr: T > blaugh ? 'laughing' : 'smug' }, T); }
      const np = idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 1); surprise(np, T - blaugh);
      C(ctx, 'nubi', np, { expr: T > blaugh ? 'surprised' : 'nervous' }, T); badgeOver(ctx, 'nubi', np, 1, { t: T });
      let bp = P({ x: bx, y: 1500, s: .84, flip: -1, view: 'q34' });
      if (T < t0 + 1.0) walk(bp, T, 1.1); else idle(bp, T, 3);
      if (T > blaugh) { laugh(bp, T, 1); bp.lean += .22; }
      C(ctx, 'brayden', bp, { expr: T > blaugh ? 'laughing' : 'smug' }, T);
      badgeOver(ctx, 'brayden', bp, 900, { state: 'gold', t: T, pop: pop(T - b900), glow: .6, glowC: '#FFD447' });
      burst(ctx, bx, 960, T - b900, { kind: 'sparkle', n: 14, speed: 600, gravity: 200, life: .8, size: 22 });
    },
    sfx: [[0, 'whoosh', .4], [b900 - st('L9'), 'bling', .6], [blaugh - st('L9'), 'laugh', .55]] });

  // ===== S11 — "Bet you can't hit ten by Friday." (Brayden close-up) =====
  S.push({ id: 'S11', start: st('L10'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1120, 2.0 + lt * .08),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .84 }), T, 3), T, 3, .5); p.armR = 1.55; p.handR = .4;
      C(ctx, 'brayden', p, { expr: 'smug', mouth: lipShape(T, ['L10']) }, T);
      badgeOver(ctx, 'brayden', p, 900, { state: 'gold', t: T });
    },
    sfx: [[ws('L10', 'ten') - st('L10'), 'hud', .6]] });

  // ===== S12 — So I tried everything (determined) =====
  S.push({ id: 'S12', start: st('L11'), trans: 'zoom', capY: 1660,
    bg: (ctx, T) => envBurst(ctx, T, '#FF8528', '#FFC83D', .6),
    cam: lt => camAt(540, 1110 + Math.sin(lt * 40) * 3, 1.9 + lt * .1),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); anticipate(p, lt, .2); if (lt > .2) { p.armL = 1.3; p.armR = 1.3; p.handL = -1.2; p.handR = -1.2; p.bodyY -= 12; }
      C(ctx, 'nubi', p, { expr: 'determined', mouth: lipShape(T, ['L11']) }, T); badgeOver(ctx, 'nubi', p, 1, { t: T });
    },
    ui: (ctx, T, lt) => speedLines(ctx, 540, 900, T, .6),
    sfx: [[.15, 'power', .5]] });

  // ===== S13 — Free candy. Still one. =====
  const candyT = ws('L12', 'candy'), still1 = ws('L12', 'still');
  S.push({ id: 'S13', start: st('L12'), trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(600, 1060, 1.05),
    draw(ctx, T, lt) {
      for (const [n, x0, d] of [['kidA', 760, 0], ['kidC', 900, .15], ['kidE', 1040, .3]]) {
        const grab = candyT + .25 + d, x = T > grab ? x0 + (T - grab) * 520 : x0;
        const kp = T > grab ? walk(P({ x, y: 1500, s: .74, view: 'q34' }), T, 1.3) : idle(P({ x, y: 1500, s: .74, flip: -1, view: 'q34' }), T, x);
        if (T > grab) kp.armL = 2.3; C(ctx, n, kp, { expr: T > grab ? 'excited' : 'neutral', holding: T > grab ? { L: c => box(c, -22, 30, 44, 26, 12, PCOLORS[d * 20 | 0], 5) } : null }, T);
      }
      const p = idle(P({ x: 360, y: 1500, s: .8, view: 'q34' }), T, 1); p.armL = .3; const th = (T - candyT) * 3; p.armR = T > candyT ? 1.2 + Math.sin(th * TAU) * .9 : .2;
      C(ctx, 'nubi', p, { expr: T > still1 ? 'sad' : 'excited', holding: { L: holdBucket } }, T);
      badgeOver(ctx, 'nubi', p, 1, { t: T, pop: T > still1 ? 1 - .2 * Math.sin(clamp((T - still1) / .3) * Math.PI) : 1 });
      burst(ctx, 470, 1150, T - candyT, { kind: 'candy', n: 14, speed: 1000, angle: -.7, spread: 1.0, gravity: 1800, life: .9, size: 18, seed: 3 });
    },
    ui(ctx, T) { stamp(ctx, 'STILL 1', 540, 620, T - still1, '#EE384A', 1.0); },
    sfx: [[candyT - st('L12'), 'toss', .5], [still1 - st('L12'), 'buzz', .55]] });

  // ===== S14 — A backflip... onto the teacher. Still one. =====
  const flipT = ws('L13', 'backflip'), landT = ws('L13', 'teacher'), still2 = ws('L13', 'still');
  S.push({ id: 'S14', start: st('L13'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { noLights: true }),
    cam: lt => { const T = lt + st('L13'); const x = lerp(380, 640, smooth(inv(flipT, landT, T))); const sh = T > landT ? Math.sin(T * 70) * 10 * Math.exp(-(T - landT) * 6) : 0; return camAt(x + sh, 1080, 1.1); },
    draw(ctx, T, lt) {
      // teacher walks in under the landing spot
      const tx = lerp(1250, 720, easeOut(inv(st('L13'), landT, T)));
      const tp = T < landT ? walk(P({ x: tx, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 1) : P({ x: 720, y: 1500, s: .8, flip: -1, view: 'q34', squash: lerp(.45, .55, spring(T - landT, 3, 5)) });
      C(ctx, 'teacher', tp, { expr: T > landT ? 'dazed' : 'neutral' }, T);
      if (T > landT) for (let i = 0; i < 3; i++) { const a = T * 6 + i * TAU / 3; starPath(ctx, 720 + Math.cos(a) * 110, 1300 + Math.sin(a) * 30, 22, 9); fillStroke(ctx, '#FFD447', 5); }
      // Nubi flip
      const u = inv(flipT + .12, landT, T);
      let p = P({ x: lerp(360, 720, smooth(u)), y: 1500, s: .8, view: 'side' });
      if (T < flipT + .12) { anticipate(p, T - flipT, .12); p.view = 'q34'; }
      else if (T < landT) { p.bodyY = -Math.sin(u * Math.PI) * 520; p.rot = -TAU * easeInOut(u); p.legL = .6; p.legR = .9; p.armL = 2.4; p.armR = 2.4; }
      else { p.x = 720; p.y = 1500 - 520 * .8 * .5 + 60; p.view = 'q34'; p.armL = 1.6; p.armR = 1.6; }
      C(ctx, 'nubi', p, { expr: T > landT ? 'nervous' : T > flipT + .12 ? 'excited' : 'determined' }, T);
      badgeOver(ctx, 'nubi', p, 1, { t: T });
      burst(ctx, 720, 1460, T - landT, { kind: 'dust', n: 16, speed: 700, angle: -Math.PI / 2, spread: 2.6, gravity: 400, life: .6, size: 34 });
    },
    ui(ctx, T) { stamp(ctx, 'STILL 1', 540, 620, T - still2, '#EE384A', 1.0); },
    sfx: [[flipT - st('L13'), 'whoosh', .6], [landT - st('L13'), 'crash', .65], [still2 - st('L13'), 'buzz', .55]] });

  // ===== S15 — Friday. School dance. My number? One. =====
  const one3 = ws('L14', 'one');
  S.push({ id: 'S15', start: st('L14'), trans: 'flash', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam),
    cam: lt => { const T = lt + st('L14'); const k = easeOut(inv(one3 - .05, one3 + .12, T)); return camAt(lerp(560, 300, k), lerp(1020, 1110, k), lerp(.95, 2.0, k)); },
    draw(ctx, T, lt) {
      KIDS.forEach((n, i) => { const dp = danceP(i, T); Object.assign(dp, { x: 470 + (i % 3) * 230 + (i > 2 ? 110 : 0), y: i > 2 ? 1420 : 1520, s: i > 2 ? .62 : .72 }); dp.armL = .6 + dp.armL * .6; C(ctx, n, dp, { expr: i % 2 ? 'excited' : 'laughing' }, T); });
      const p = idle(P({ x: 210, y: 1500, s: .8, view: 'q34' }), T, 1, .4); p.headY = 8;
      C(ctx, 'nubi', p, { expr: 'sad', lookX: .6 }, T); badgeOver(ctx, 'nubi', p, 1, { t: T, state: T > one3 ? 'red' : 'normal' });
    },
    sfx: [[0, 'flash', .4], [one3 - st('L14'), 'impact', .6]] });

  // ===== S16 — Subscribe, because that's when everything went wrong =====
  const wrongT = ws('L15', 'wrong');
  S.push({ id: 'S16', start: st('L15'), trans: 'cut', capY: 1720,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .6 }),
    cam: lt => { const T = lt + st('L15'); const sh = T > wrongT ? Math.sin(T * 70) * 12 * Math.exp(-(T - wrongT) * 4) : 0; return camAt(540 + sh, 1110, T > wrongT ? 2.3 : 2.0 + lt * .1); },
    draw(ctx, T, lt) { const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); if (T > wrongT) surprise(p, T - wrongT);
      C(ctx, 'nubi', p, { expr: T > wrongT ? 'terrified' : 'nervous', lookX: T > wrongT ? 0 : .7, mouth: T < wrongT ? lipShape(T, ['L15']) : null }, T); badgeOver(ctx, 'nubi', p, 1, { t: T }); },
    ui(ctx, T, lt) { drawSubscribe(ctx, lt - .05, wrongT - st('L15') - .1); if (T > wrongT) { vignette(ctx, .7 * Math.max(.4, 1 - (T - wrongT)), '238,56,74'); } },
    sfx: [[.6, 'click', .6], [wrongT - st('L15'), 'alarm', .5], [wrongT - st('L15'), 'scratch', .5]] });

  // ===== S17 — Brayden slipped on stage. His pants ripped. Everyone laughed. =====
  const slipT = ws('L16', 'slipped'), ripT = ws('L16', 'ripped'), laughT = ws('L16', 'laughed');
  S.push({ id: 'S17', start: st('L16'), trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envGym(ctx, T, cam),
    cam: lt => { const T = lt + st('L16');
      if (T < ripT) return camAt(540, 1010, 1.35 + lt * .04);
      if (T < laughT) { const k = easeOut(inv(ripT, ripT + .15, T)); return camAt(540, lerp(1010, 985, k), lerp(1.4, 1.95, k)); }
      const k = easeOut(inv(laughT, laughT + .2, T)); return camAt(540, 1100, lerp(1.95, 1.08, k)); },
    draw(ctx, T, lt) {
      const y0 = 1190; let p = P({ x: 540, y: y0, s: .8 });
      if (T < slipT) { Object.assign(p, danceP(2, T), { x: 540, y: y0, s: .8 }); }
      else if (T < ripT) { const u = clamp((T - slipT) / .3); p.rot = -1.35 * easeIn(u) * (1 - smooth(inv(.35, .6, T - slipT))); p.legL = .9 * u; p.legR = 1.2 * u; p.armL = 2 * u; p.armR = 2 * u; p.bodyY = -Math.sin(u * Math.PI) * 60; }
      else { p.armL = -.15; p.armR = -.15; p.handL = .3; p.handR = .3; p.legL = -.06; p.legR = -.06; p.squash = .96; }
      C(ctx, 'brayden', p, { expr: T < slipT ? 'excited' : T < ripT ? 'terrified' : 'terrified', ripped: T >= ripT, red: T >= ripT ? 1 : 0 }, T);
      badgeOver(ctx, 'brayden', p, 900, { state: 'gold', t: T });
      burst(ctx, 540, y0, T - slipT - .3, { kind: 'dust', n: 14, speed: 600, angle: -Math.PI / 2, spread: 2.4, gravity: 300, life: .5, size: 30 });
      if (T > laughT) { [['kidA', 120], ['kidC', 380], ['kidB', 700], ['kidD', 960]].forEach(([n, x], i) => { const kp = laugh(P({ x, y: 1880, s: 1.05, view: 'back' }), T + i, 1); kp.armR = 1.3 + Math.sin(T * 12 + i) * .2; C(ctx, n, kp, { expr: 'laughing' }, T); }); }
    },
    ui(ctx, T) { popText(ctx, 'RIIIP!', 790, 1300, T - ripT, { size: 120, fill: '#FF7AC0', rot: -.12, dur: .9 }); },
    sfx: [[slipT - st('L16'), 'slip', .6], [slipT - st('L16') + .3, 'thud', .6], [ripT - st('L16'), 'rip', .75], [laughT - st('L16'), 'laugh', .7]] });

  // ===== S18 — His number started falling. 900 → 200 → 10 =====
  const fall0 = ws('L17', 'falling'), f200 = ws('L17', 'two'), f10 = ws('L17', 'ten');
  S.push({ id: 'S18', start: st('L17'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .5 }),
    cam: lt => { const T = lt + st('L17'); let sh = 0; for (const s of [fall0, f200, f10]) if (T > s) sh += Math.sin(T * 80) * 9 * Math.exp(-(T - s) * 7); return camAt(540 + sh, 1110, 2.0 + lt * .06); },
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .84 }), T, 3, .5); p.headY = 10;
      C(ctx, 'brayden', p, { expr: 'crying', ripped: true }, T);
      let v = 900; if (T > fall0) v = lerp(900, 200, easeInOut(inv(fall0, f200, T))); if (T > f200) v = lerp(200, 10, easeInOut(inv(f200, f10, T)));
      v = Math.round(v / (v > 100 ? 10 : 1)) * (v > 100 ? 10 : 1);
      badgeOver(ctx, 'brayden', p, v, { state: T > fall0 ? 'red' : 'gold', t: T, rot: T > fall0 ? Math.sin(T * 40) * .03 : 0 });
      for (let i = 0; i < 2; i++) { const u = ((T * 1.4 + i / 2) % 1); if (T < fall0) break; ctx.save(); ctx.globalAlpha = 1 - u; ctx.translate(i ? 840 : 240, 900 + u * 220);
        ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.lineTo(26, 40); ctx.lineTo(48, 40); ctx.lineTo(0, 90); ctx.lineTo(-48, 40); ctx.lineTo(-26, 40); ctx.closePath(); fillStroke(ctx, '#EE384A', 6); ctx.restore(); }
    },
    sfx: [[fall0 - st('L17'), 'fall', .55], [f200 - st('L17'), 'glitch', .5], [f10 - st('L17'), 'glitch', .55]] });

  // ===== S19 — That's when I realized something =====
  const realT = ws('L18', 'realized');
  S.push({ id: 'S19', start: st('L18'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .7, noLights: true }),
    cam: lt => camAt(540, 1100, 1.25 + lt * .35),
    draw(ctx, T, lt) { const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1, .4); if (T > realT) { p.headY = -10 * spring(T - realT); }
      C(ctx, 'nubi', p, { expr: T > realT ? 'surprised' : 'sad' }, T); badgeOver(ctx, 'nubi', p, 1, { t: T });
      burst(ctx, 540, 1060, T - realT, { kind: 'sparkle', n: 10, speed: 700, gravity: 0, life: .7, size: 26 }); },
    ui(ctx, T) { spotlight(ctx, 540, .38); },
    sfx: [[realT - st('L18'), 'magic', .55]] });

  // ===== S20 — Likes aren't something you get. They're something you give. =====
  const giveT = ws('L19', 'give');
  S.push({ id: 'S20', start: st('L19'), trans: 'zoom', capY: 1660,
    bg: (ctx, T) => envSoft(ctx, T, '#FFC2DD', '#5B3FB0'),
    cam: lt => camAt(540, 1130, 1.85 + lt * .05),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); const k = smooth(inv(giveT - .4, giveT, T)); p.armL = .1 + .5 * k; p.armR = .1 + .5 * k; p.handL = -1.0 * k; p.handR = -1.0 * k;
      C(ctx, 'nubi', p, { expr: T > giveT ? 'happy' : 'determined', mouth: lipShape(T, ['L19']) }, T); badgeOver(ctx, 'nubi', p, 1, { t: T });
      if (k > 0) { ctx.save(); ctx.translate(540, 1260); const s = k * (1 + Math.sin(T * 8) * .05); ctx.scale(s, s); ctx.shadowColor = '#FF5B9B'; ctx.shadowBlur = 60; heartPath(ctx, 0, 0, 90); fillStroke(ctx, '#FF5B9B', 9); ctx.restore(); }
      burst(ctx, 540, 1240, T - giveT, { kind: 'heart', n: 10, speed: 500, gravity: -200, life: 1, size: 22 });
    },
    sfx: [[giveT - st('L19'), 'swell', .55]] });

  // ===== S21 — walked up, tied my hoodie around his waist, "nice moves, man" =====
  const tiedT = ws('L20', 'tied'), niceT = ws('L20', 'nice');
  S.push({ id: 'S21', start: st('L20'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .25 }),
    cam: lt => { const T = lt + st('L20'); const k = smooth(inv(niceT - .3, niceT, T)); return camAt(lerp(450, 560, k), lerp(1010, 990, k), lerp(1.3, 1.7, k)); },
    draw(ctx, T, lt) {
      const y0 = 1190, t0 = st('L20');
      const tied = T > tiedT + .15;
      const bp = idle(P({ x: 690, y: y0, s: .8, flip: -1, view: 'q34' }), T, 3, .4);
      if (T > niceT) { bp.armL = .2; bp.armR = .2; }
      C(ctx, 'brayden', bp, { expr: T > niceT + .3 ? 'happy' : tied ? 'surprised' : 'crying', ripped: !tied, waistHoodie: tied }, T);
      badgeOver(ctx, 'brayden', bp, 10, { state: 'red', t: T });
      const nx = lerp(130, 420, smooth(inv(t0, tiedT - .1, T)));
      let np = P({ x: nx, y: y0, s: .8, view: T < tiedT - .1 ? 'side' : 'q34' });
      if (T < tiedT - .1) walk(np, T, 1.3); else idle(np, T, 1);
      if (T > tiedT - .1 && T < tiedT + .5) { np.armR = 1.4; np.armL = .4; }
      if (T > niceT) { np.armR = 2.2; np.handR = .4; }
      C(ctx, 'nubi', np, { expr: T > niceT ? 'happy' : 'determined', hoodie: !tied, mouth: T > niceT ? lipShape(T, ['L20']) : null }, T);
      badgeOver(ctx, 'nubi', np, 1, { t: T });
      burst(ctx, 690, 1060, T - tiedT, { kind: 'dust', n: 18, speed: 500, gravity: 0, life: .5, size: 34, colors: ['#fff', '#20BDBB'] });
    },
    sfx: [[0, 'step', .3], [tiedT - st('L20'), 'poof', .6], [niceT - st('L20'), 'ding', .4]] });

  // ===== S22 — Ding. Ding. Ding. Two. Twenty. Fifty! =====
  const d1 = ws('L21', 'ding', 0), d2 = ws('L21', 'ding', 1), d3 = ws('L21', 'ding', 2), fifty = ws('L21', 'fifty');
  S.push({ id: 'S22', start: st('L21'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => envGym(ctx, T, cam),
    cam: lt => { const T = lt + st('L21'); const sh = T > fifty ? Math.sin(T * 60) * 10 * Math.exp(-(T - fifty) * 4) : 0; return camAt(540 + sh, 1090, 1.2 + lt * .05); },
    draw(ctx, T, lt) {
      KIDS.forEach((n, i) => { const cp = celebrate(P({ x: 120 + i * 168, y: 1390, s: .58 }), T + i * .2, T > d1 ? 1 : .2); C(ctx, n, cp, { expr: T > d1 ? 'excited' : 'happy' }, T); });
      const bp = idle(P({ x: 850, y: 1520, s: .76, flip: -1, view: 'q34' }), T, 3); if (T > fifty) celebrate(bp, T, .7);
      C(ctx, 'brayden', bp, { expr: 'happy', waistHoodie: true }, T);
      badgeOver(ctx, 'brayden', bp, Math.round(lerp(10, 31, smooth(inv(d2, fifty, T)))), { state: 'normal', t: T });
      const np = idle(P({ x: 470, y: 1540, s: .84 }), T, 1); if (T > fifty) celebrate(np, T); else if (T > d1) { np.armL = .9; np.armR = .9; }
      C(ctx, 'nubi', np, { expr: T > fifty ? 'excited' : T > d1 ? 'surprised' : 'happy', hoodie: false, lookY: -.6 }, T);
      const nl = nubiLikes(T); const dsince = Math.min(...[d1, d2, d3, ws('L21', 'two'), ws('L21', 'twenty'), fifty].map(d => T > d ? T - d : 9));
      badgeOver(ctx, 'nubi', np, nl.v, { t: T, state: nl.v >= 10 ? 'green' : 'normal', pop: 1 + Math.max(0, .3 - dsince), glow: nl.v >= 10 ? 1 : 0, glowC: '#30CE65' });
      for (const d of [d1, d2, d3]) for (let i = 0; i < 3; i++) { const u = inv(d - .3 + i * .05, d, T); if (u <= 0 || u >= 1) continue; const sx = 150 + i * 380;
        heartPath(ctx, lerp(sx, 470, u), lerp(1100, 920, u) - Math.sin(u * Math.PI) * 120, 26); fillStroke(ctx, '#FF5B9B', 5); }
      burst(ctx, 470, 860, T - fifty, { kind: 'confetti', n: 60, speed: 1400, gravity: 1500, life: 1.8, size: 26 });
    },
    sfx: [[d1 - st('L21'), 'ding', .6], [d2 - st('L21'), 'ding2', .6], [d3 - st('L21'), 'ding3', .6], [fifty - st('L21'), 'cheer', .7], [fifty - st('L21'), 'confetti', .6]] });

  // ===== S23 — But nobody was looking at my number =====
  const nobodyT = ws('L22', 'nobody');
  S.push({ id: 'S23', start: st('L22'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .3 }),
    cam: lt => camAt(540, 1080, 1.25 + lt * .08),
    draw(ctx, T, lt) {
      KIDS.slice(0, 4).forEach((n, i) => { const turned = T > nobodyT + i * .07; const kp = idle(P({ x: 150 + i * 260, y: 1400, s: .6, view: turned ? 'q34' : 'front' }), T, i); C(ctx, n, kp, { expr: turned ? 'surprised' : 'happy', lookX: turned ? 1 : 0 }, T); });
      const np = idle(P({ x: 540, y: 1520, s: .84 }), T, 1); C(ctx, 'nubi', np, { expr: T > nobodyT + .3 ? 'confused' : 'excited', hoodie: false, lookY: T > nobodyT + .3 ? 0 : -.6, lookX: T > nobodyT + .3 ? .8 : 0 }, T);
      badgeOver(ctx, 'nubi', np, 50, { t: T, state: 'green' });
    },
    sfx: [[nobodyT - st('L22'), 'record', .5]] });

  // ===== S24 — They were looking at Lily, the quiet girl in the back =====
  const lilyT = ws('L23', 'lily');
  S.push({ id: 'S24', start: st('L23'), trans: 'whip', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .5, noLights: true }),
    cam: lt => camAt(760, 1080, 1.15 + lt * .1),
    draw(ctx, T, lt) {
      const t0 = st('L23');
      for (const [n, x0, x1] of [['kidC', 620, 300], ['kidD', 900, 1240]]) { const u = inv(t0, lilyT + .2, T); const kp = u < 1 ? walk(P({ x: lerp(x0, x1, easeOut(u)), y: 1560, s: .8, view: 'q34', flip: x1 < x0 ? -1 : 1 }), T, 1.2) : idle(P({ x: x1, y: 1560, s: .8, view: 'q34', flip: x1 < x0 ? 1 : -1 }), T, x0); C(ctx, n, kp, { expr: 'surprised' }, T); }
      const lp = idle(P({ x: 760, y: 1440, s: .74 }), T, 2); lp.armL = .05; lp.armR = .05;
      C(ctx, 'lily', lp, { expr: 'shy', holding: { R: holdBook } }, T);
    },
    ui(ctx, T) { spotlight(ctx, 540, .35, '255,180,220'); },
    sfx: [[0, 'whoosh', .5], [lilyT - st('L23'), 'chime', .5]] });

  // ===== S25 — Her number was one too =====
  const lone = ws('L24', 'one');
  S.push({ id: 'S25', start: st('L24'), trans: 'zoom', capY: 1660,
    bg: (ctx, T) => envSoft(ctx, T, '#FFC2DD', '#7B4BFF'),
    cam: lt => camAt(540, 1080, 2.0 + lt * .06),
    draw(ctx, T, lt) { const lp = idle(P({ x: 540, y: 1500, s: .8 }), T, 2); C(ctx, 'lily', lp, { expr: T > lone ? 'shy' : 'neutral', lookY: -.5, holding: { R: holdBook } }, T);
      badgeOver(ctx, 'lily', lp, 1, { t: T, pop: pop(T - lone), glow: 1 }); burst(ctx, 540, 900, T - lone, { kind: 'heart', n: 8, speed: 500, gravity: -200, life: 1, size: 22 }); },
    sfx: [[lone - st('L24'), 'pop', .55], [lone - st('L24') + .05, 'chime', .4]] });

  // ===== S26 — My one was never the lunch lady. It was her. =====
  const ladyT = ws('L25', 'lady'), herT = ws('L25', 'her');
  S.push({ id: 'S26', start: st('L25'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .55, noLights: true }),
    cam: lt => camAt(540, 1060, 1.12),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 260, y: 1500, s: .8, view: 'q34' }), T, 1); C(ctx, 'nubi', np, { expr: T > herT ? 'surprised' : 'confused', hoodie: false }, T);
      const lp = idle(P({ x: 820, y: 1500, s: .76, view: 'q34', flip: -1 }), T, 2); C(ctx, 'lily', lp, { expr: 'shy', holding: { L: holdBook } }, T);
      badgeOver(ctx, 'nubi', np, 50, { t: T, state: 'green' }); badgeOver(ctx, 'lily', lp, 1, { t: T, glow: .8 });
      // thought bubble with the lunch lady + X
      const bk = pop(T - st('L25') - .05) * (1 - smooth(inv(herT - .25, herT, T)));
      if (bk > .01) { ctx.save(); ctx.translate(380, 640); ctx.scale(bk, bk); for (const [x, y, r] of [[-120, 190, 18], [-80, 150, 28]]) circle(ctx, x, y, r, '#fff', 7);
        rr(ctx, -200, -170, 400, 300, 120); fillStroke(ctx, '#fff', 9); ctx.save(); rr(ctx, -200, -170, 400, 300, 120); ctx.clip();
        drawCharacter(ctx, 'lunchlady', P({ x: 0, y: 300, s: .55 }), { expr: 'smug' }, T); ctx.restore();
        if (T > ladyT) { const k = Math.min(1, (T - ladyT) / .12); ctx.strokeStyle = '#EE384A'; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-120, -110); ctx.lineTo(lerp(-120, 120, k), lerp(-110, 90, k)); ctx.moveTo(120, -110); ctx.lineTo(lerp(120, -120, k), lerp(-110, 90, k)); ctx.stroke(); }
        ctx.restore(); }
      thread(ctx, 820, 1250, 260, headTop('nubi', np) - 80, inv(herT - .1, herT + .5, T), T);
    },
    sfx: [[ladyT - st('L25'), 'buzz', .45], [herT - st('L25'), 'swell', .6]] });

  // ===== S27 — And her one... was me =====
  const meT = ws('L26', 'me');
  S.push({ id: 'S27', start: st('L26'), trans: 'cut', capY: 1660,
    bg: (ctx, T) => envSoft(ctx, T, '#FFC2DD', '#B44BFF'),
    cam: lt => camAt(540, 1100, 1.35 + lt * .12),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 1); const lp = idle(P({ x: 750, y: 1500, s: .76, view: 'q34', flip: -1 }), T, 2);
      C(ctx, 'nubi', np, { expr: T > meT ? 'love' : 'shy', hoodie: false }, T); C(ctx, 'lily', lp, { expr: T > meT ? 'love' : 'shy' }, T);
      badgeOver(ctx, 'nubi', np, 50, { t: T, state: 'green' }); badgeOver(ctx, 'lily', lp, 1, { t: T, glow: 1 });
      thread(ctx, 330, 1250, 750, headTop('lily', lp) - 80, inv(st('L26') + .1, meT, T), T);
      burst(ctx, 540, 1000, T - meT, { kind: 'heart', n: 20, speed: 800, gravity: -100, life: 1.4, size: 28 });
    },
    sfx: [[meT - st('L26'), 'sparkle', .6], [meT - st('L26'), 'chime', .5]] });

  // ===== S28 — Subscribe if you've got a one (push into the "1" → loops to frame 1) =====
  const lastOne = ws('L27', 'one');
  S.push({ id: 'S28', start: st('L27'), trans: 'cut', capY: 1720,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const T = lt + st('L27'); const k = easeInOut(inv(lastOne - .2, END, T)); return camAt(lerp(540, 680, k), lerp(1080, 1000, k), lerp(1.15, 2.6, k)); },
    draw(ctx, T, lt) {
      const np = idle(P({ x: 400, y: 1500, s: .8, view: 'q34' }), T, 1); const lp = idle(P({ x: 680, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 2);
      np.armR = .35; lp.armR = .35;
      C(ctx, 'nubi', np, { expr: 'happy', hoodie: false }, T); C(ctx, 'lily', lp, { expr: 'happy' }, T);
      badgeOver(ctx, 'nubi', np, 50, { t: T, state: 'green' }); badgeOver(ctx, 'lily', lp, 1, { t: 0, glow: 1 - smooth(inv(lastOne, END, T)) });
    },
    ui(ctx, T, lt) { drawSubscribe(ctx, lt - .05, Math.min(1.4, lastOne - st('L27') + .1)); },
    sfx: [[.6, 'click', .5], [lastOne - st('L27'), 'whoosh', .4]] });

  // compute ends
  S.forEach((s, i) => s.end = i < S.length - 1 ? S[i + 1].start : END);
  return S;
}
