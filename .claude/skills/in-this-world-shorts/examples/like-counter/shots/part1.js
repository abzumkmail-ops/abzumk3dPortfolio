// shots/part1.js — written independently of the other parts (one agent per part).
'use strict';
shots(() => {
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

  return S;
});
