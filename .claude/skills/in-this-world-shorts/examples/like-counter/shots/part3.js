// shots/part3.js — written independently of the other parts (one agent per part).
'use strict';
shots(() => {
  const S = [];

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


  return S;
});
