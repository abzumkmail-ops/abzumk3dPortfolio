// shots/part2.js — written independently of the other parts (one agent per part).
'use strict';
shots(() => {
  const S = [];

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

  return S;
});
