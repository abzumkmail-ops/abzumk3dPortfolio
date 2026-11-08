// shots/part1.js — S1..S11, lines L0..L8.
'use strict';
shots(() => {
  const S = [];
  const ramp = (a, d, T) => smooth(inv(a, a + d, T));

  // ===== S1 — POV: "I didn't eat it" + blazing nose on frame 1 =====
  const tGlow = ws('L0', 'glow');
  S.push({ id: 'S1', start: 0, trans: 'none', capY: 1700,
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam),
    cam: lt => camAt(540, 1110, 2.1 + lt * .03),
    draw(ctx, T, lt) {
      // counter + cookie jar
      box(ctx, 600, 1400, 400, 220, 10, '#8b6a4a', 8);
      box(ctx, 672, 1255, 118, 145, 24, '#E8B96A', 8); box(ctx, 690, 1215, 82, 40, 12, '#c98a3d', 8);
      txt(ctx, 'COOKIES', 731, 1340, 20, '#fff', '#3a2a1a', 5);
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1);
      const after = T > tGlow;
      C(ctx, 'nubi', p, { expr: after ? 'nervous' : 'neutral', sweat: after ? 1 : 0, lookX: .6 }, T);
      const n = noseAt('nubi', p);
      // cookie crumbs on the mouth
      for (let i = 0; i < 9; i++) { const r = hash(i + 5), r2 = hash(i + 50); ellipse(ctx, n.x + (r - .5) * 90 * n.k, n.y + (44 + r2 * 30) * n.k, (4 + r2 * 3) * n.k, (3.5 + r * 2) * n.k, '#7a4a22', 2); }
      noseGlow(ctx, 'nubi', p, 1.6 + .4 * ramp(tGlow, .15, T) + .1 * Math.sin((T - tGlow) * 14) * (after ? Math.exp(-(T - tGlow) * 2) : 0), T);
    },
    ui(ctx, T, lt) { popText(ctx, 'POV: "I DIDN\'T EAT IT"', 540, 420, T + .5, { size: 92, fill: '#FFFFFF', dur: 6 }); },
    sfx: [[tGlow, 'power', .5]] });

  // ===== S2 — Small lies? A blink. =====
  const tBlink = ws('L1', 'blink');
  S.push({ id: 'S2', start: st('L1'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(550, 1080, 1.25 + lt * .04),
    draw(ctx, T, lt) {
      const a = idle(P({ x: 380, y: 1500, s: .8, view: 'q34' }), T, 1);
      const b = idle(P({ x: 720, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 2);
      C(ctx, 'kidB', b, { expr: 'neutral' }, T);
      C(ctx, 'kidA', a, { expr: T > tBlink ? 'nervous' : 'neutral' }, T);
      const blink = T > tBlink && T < tBlink + .9 ? .3 + .1 * Math.sin((T - tBlink) * 20) : 0;
      noseGlow(ctx, 'kidA', a, blink, T);
    },
    ui(ctx, T) { if (T > tBlink && T < tBlink + 1.0) popText(ctx, 'blink', 380, 760, T - tBlink, { size: 50, fill: '#FF6B6B', dur: .9 }); },
    sfx: [[tBlink - st('L1'), 'tick', .6]] });

  // ===== S3 — Big lies? Lighthouse. =====
  const tBig = ws('L1', 'big') - .08, tLH = ws('L1', 'lighthouse');
  S.push({ id: 'S3', start: tBig, trans: 'zoom', capY: 1700,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(520, 1110, 1.8 + lt * .06),
    draw(ctx, T, lt) {
      const a = idle(P({ x: 250, y: 1500, s: .8, view: 'q34' }), T, 1);
      if (T > tLH) { a.armR = 2.4; a.armL = 2.2; a.handR = .4; a.handL = .4; a.lean -= .1; }
      const b = idle(P({ x: 600, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 2);
      C(ctx, 'kidA', a, { expr: T > tLH ? 'terrified' : 'nervous', eyes: T > tLH ? { open: .35 } : undefined }, T);
      C(ctx, 'kidB', b, { expr: T > tLH ? 'nervous' : 'neutral', sweat: T > tLH ? 1 : 0 }, T);
      noseGlow(ctx, 'kidB', b, 1.8 * ramp(tLH, .2, T), T);
    },
    ui(ctx, T) { popText(ctx, 'LIGHTHOUSE', 540, 560, T - tLH, { size: 78, fill: '#FFD447', dur: 1.2 }); },
    sfx: [[tLH - tBig, 'swell', .6]] });

  // ===== S4 — dentists / discos =====
  const tHurt = ws('L2', 'hurt'), tDisco = ws('L2', 'discos');
  S.push({ id: 'S4', start: st('L2'), trans: 'whip', capY: 1660,
    bg: (ctx, T, cam) => envDisco(ctx, T > tDisco ? tDisco + (T - tDisco) * 2.6 : T, cam),
    cam: lt => camAt(540, 1070, 1.2 + lt * .03),
    draw(ctx, T, lt) {
      box(ctx, 290, 1190, 180, 320, 20, '#4a8fd8', 8); box(ctx, 250, 1420, 300, 46, 14, '#3b78bb', 8); // dentist chair
      const dance = T > tDisco + .35;
      const kp = dance ? Object.assign(danceP(1, T), { x: 380, y: 1500, s: .8 }) : idle(P({ x: 380, y: 1500, s: .8, view: 'q34' }), T, 2);
      C(ctx, 'kidC', kp, { expr: dance ? 'excited' : T > tDisco ? 'confused' : 'terrified' }, T);
      const dp = idle(P({ x: 700, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 3); dp.armR = 1.9; dp.handR = .3;
      C(ctx, 'dentist', dp, { expr: 'happy', holding: { R: c => { c.strokeStyle = OUTLINE; c.lineWidth = 9; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -70); c.stroke(); c.strokeStyle = '#cfd6e6'; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -70); c.stroke(); ellipse(c, 0, -76, 9, 9, '#cfd6e6', 4); } } }, T);
      noseGlow(ctx, 'dentist', dp, 1.2 * ramp(tHurt, .15, T), T);
      burst(ctx, 540, 300, T - tDisco, { kind: 'confetti', n: 36, speed: 700, gravity: 500, life: 1.4, size: 16, spread: 3.0, angle: Math.PI / 2, seed: 4 });
    },
    sfx: [[tHurt - st('L2'), 'ding', .5], [tDisco - st('L2'), 'boing', .6]] });

  // ===== S5 — Grandma, thirty-nine =====
  const tThirty = ws('L3', 'thirty'), tNine = ws('L3', 'nine');
  S.push({ id: 'S5', start: st('L3'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam),
    cam: lt => camAt(660, 1080, 1.2 + lt * .04),
    draw(ctx, T, lt) {
      const g = idle(P({ x: 480, y: 1500, s: .8, view: 'q34' }), T, 1);
      const h = idle(P({ x: 840, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 2);
      C(ctx, 'nubi', h, { expr: 'neutral', lookX: -1, eyes: { shape: 'flat' } }, T);
      C(ctx, 'grandma', g, { expr: 'smug' }, T);
      noseGlow(ctx, 'grandma', g, T < tNine ? 1.0 * ramp(tThirty, .15, T) : 1.0 + .8 * ramp(tNine, .2, T), T);
    },
    sfx: [[tNine - st('L3'), 'swell', .5]] });

  // ===== S6 — Boats find the shore =====
  const tBoats = ws('L4', 'boats'), tShore = ws('L4', 'shore');
  S.push({ id: 'S6', start: st('L4'), trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envShore(ctx, T, cam),
    cam: lt => { const T = lt + st('L4'); const sh = T > tShore ? Math.sin(T * 60) * 7 * Math.exp(-(T - tShore) * 6) : 0; return camAt(520 + sh, 1060, 1.0 + lt * .02); },
    draw(ctx, T, lt) {
      const t0 = st('L4');
      [[1330, 450, .8, '#EE384A', 0], [1270, 230, .7, '#FFD447', .2], [1220, 40, .62, '#30CE65', .4]].forEach(([y, xT, s, col, d]) => {
        let x = lerp(-450, xT, easeOut(inv(t0 + d, tShore, T)));
        if (xT === 450 && T > tShore) x -= 26 * Math.exp(-(T - tShore) * 7) * Math.abs(Math.cos((T - tShore) * 14));
        drawBoat(ctx, x, y, s, T, col);
      });
      const g = idle(P({ x: 820, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 1);
      C(ctx, 'grandma', g, { expr: 'smug' }, T);
      noseGlow(ctx, 'grandma', g, 2.0, T);
    },
    ui(ctx, T) { if (T > tShore && T < tShore + .9) popText(ctx, 'BUMP!', 440, 1000, T - tShore, { size: 60, fill: '#FFFFFF', dur: .8 }); },
    sfx: [[tBoats - st('L4'), 'bell', .6], [tShore - st('L4'), 'thud', .6]] });

  // ===== S7 — worst liar alive =====
  const tWorst = ws('L5', 'worst');
  S.push({ id: 'S7', start: st('L5'), trans: 'zoom', capY: 1700,
    bg: (ctx, T) => envBurst(ctx, T, '#2bc4b8', '#1d8f96', .5),
    cam: lt => camAt(540, 1110, 2.1 + lt * .05),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); if (T > tWorst) surprise(p, T - tWorst);
      C(ctx, 'nubi', p, { expr: T > tWorst ? 'nervous' : 'smug', sweat: T > tWorst ? 1 : 0 }, T);
    },
    ui(ctx, T) { popText(ctx, 'WORST LIAR ALIVE', 540, 430, T - tWorst, { size: 70, fill: '#FF5B5B', dur: 2.5 }); },
    sfx: [[tWorst - st('L5'), 'impact', .5]] });

  // ===== S8 — "I said I'm fine" =====
  const tFine = ws('L6', 'fine'), tFineE = we('L6', 'fine'), tThe = ws('L6', 'the') - .08;
  S.push({ id: 'S8', start: st('L6'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envBackyard(ctx, T, cam),
    cam: lt => camAt(480, 1090, 1.3 + lt * .04),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 420, y: 1500, s: .8, view: 'q34' }), T, 1), T, 2, .3); p.armR = 2.2; p.handR = .3;
      C(ctx, 'nubi', p, { expr: 'nervous', sweat: T > tFine ? 1 : 0, mouth: T < tFineE + .05 ? lipShape(T, ['L6']) : undefined }, T);
      noseGlow(ctx, 'nubi', p, 2.0 * ramp(tFine, .15, T), T);
    },
    sfx: [[tFine - st('L6'), 'power', .6]] });

  // ===== S9 — fire department =====
  const tFire = ws('L6', 'fire'), tDept = ws('L6', 'department');
  S.push({ id: 'S9', start: tThe, trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envBackyard(ctx, T, cam),
    cam: lt => { const T = lt + tThe; const sh = T > tDept ? Math.sin(T * 60) * 7 * Math.exp(-(T - tDept) * 6) : 0; return camAt(560 + sh, 1060, 1.0 + lt * .02); },
    draw(ctx, T, lt) {
      const p = idle(P({ x: 320, y: 1500, s: .8, view: 'q34' }), T, 1);
      C(ctx, 'nubi', p, { expr: T > tFire ? 'terrified' : 'nervous', sweat: 1 }, T);
      noseGlow(ctx, 'nubi', p, 2.0, T);
      drawFireTruck(ctx, lerp(1500, 800, easeOut(inv(tThe, tDept + .1, T))), 1500, .62, T, -1);
    },
    sfx: [[tFire - tThe, 'alarm', .6], [tDept + .1 - tThe, 'crash', .3]] });

  // ===== S10 — Night Light =====
  const tNight = ws('L7', 'night');
  S.push({ id: 'S10', start: st('L7'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1080, 1.05 + lt * .03),
    draw(ctx, T, lt) {
      const kids = [['kidA', 170, 1, 'q34'], ['kidB', 360, 1, 'q34'], ['kidC', 720, -1, 'q34'], ['kidD', 910, -1, 'q34']];
      kids.forEach(([n, x, f, v], i) => {
        const p = laugh(idle(P({ x, y: 1500, s: .76, flip: f, view: v }), T, i + 5), T, 1); p.armR = 1.7; p.handR = .3;
        C(ctx, n, p, { expr: T > tNight ? 'laughing' : 'smug' }, T);
      });
      const h = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); h.head = .08;
      C(ctx, 'nubi', h, { expr: 'sad' }, T);
    },
    ui(ctx, T) { popText(ctx, 'NIGHT LIGHT', 540, 520, T - tNight, { size: 84, fill: '#FFD447', dur: 3 }); },
    sfx: [[tNight - st('L7') + .15, 'laugh', .6]] });

  // ===== S11 — the school dance. And Lily. =====
  const tLily = ws('L8', 'lily');
  S.push({ id: 'S11', start: st('L8'), trans: 'whip', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => { const T = lt + st('L8'); const k = ramp(tLily - .3, .8, T); return camAt(lerp(540, 780, k), lerp(1060, 1100, k), lerp(1.0, 1.3, k)); },
    draw(ctx, T, lt) {
      [['kidD', 150, 1400, .6, 2], ['kidF', 330, 1400, .6, 4], ['kidC', 1000, 1400, .6, 1]].forEach(([n, x, y, s, i]) => {
        C(ctx, n, Object.assign(danceP(i, T), { x, y, s }), { expr: 'happy' }, T);
      });
      const l = idle(P({ x: 860, y: 1440, s: .72, view: 'q34', flip: -1 }), T, 3);
      C(ctx, 'lily', l, { expr: 'shy', blush: 1 }, T);
      [['kidA', 190, 1500, .78, 0], ['kidE', 930, 1500, .78, 3]].forEach(([n, x, y, s, i]) => {
        C(ctx, n, Object.assign(danceP(i, T), { x, y, s }), { expr: 'excited' }, T);
      });
      const h = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); if (T > tLily) { h.bodyY -= 10 * Math.abs(Math.sin((T - tLily) * 6)) * .5; }
      C(ctx, 'nubi', h, { expr: T > tLily ? 'love' : 'happy' }, T);
      burst(ctx, 960, 1130, T - tLily, { kind: 'sparkle', n: 18, speed: 380, gravity: -60, life: 1.3, size: 20, seed: 2 });
      burst(ctx, 760, 1120, T - tLily - .1, { kind: 'heart', n: 8, speed: 300, gravity: -120, life: 1.4, size: 24, seed: 6 });
    },
    sfx: [[tLily - st('L8'), 'swell', .4]] });

  return S;
});
