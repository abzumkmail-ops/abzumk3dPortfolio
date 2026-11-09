// shots/part1.js — S01–S09 (L0–L8)
'use strict';
shots(() => {
  const S = [];
  const shk = (T, t0, a = 10, d = 5) => T > t0 ? Math.sin(T * 62) * a * Math.exp(-(T - t0) * d) : 0;
  const SM = (ctx, T, cam) => PACK_SETS.supermarket.draw(ctx, T, cam, {});
  const box2 = (ctx, x, y, rot, col) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); box(ctx, -30, -40, 60, 80, 8, col, 5); ctx.restore(); };
  const cart = (ctx, x, y, rot = 0, s = 1) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 6; ctx.fillStyle = '#C9D1DA';
    ctx.beginPath(); ctx.moveTo(-80, -90); ctx.lineTo(80, -90); ctx.lineTo(55, -10); ctx.lineTo(-55, -10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-80, -90); ctx.lineTo(-100, -125); ctx.stroke();
    for (const wx of [-40, 40]) { ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(wx, 8, 14, 0, 7); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  };

  // ===== S01 — wrecked supermarket, one sentence =====
  const sent = ws('L0', 'sentence');
  S.push({ id: 'S01', start: 0, trans: 'none', capY: 1640,
    bg: SM,
    cam: lt => { const T = lt; return camAt(540 + shk(T, sent, 14), 1060, 1.05 + lt * .03); },
    draw(ctx, T, lt) {
      cart(ctx, 850, 1480, -1.35, 1.2);
      for (let i = 0; i < 18; i++) {
        const sx = 80 + hash(i) * 920, per = 1.6 + hash(i + 40), ph = (T * .9 + hash(i + 9) * per) % per, y = -100 + ph / per * 1700;
        box2(ctx, sx, y, T * 2 + i, PCOLORS[i % PCOLORS.length]);
      }
      for (let i = 0; i < 5; i++) box2(ctx, 140 + i * 190, 1470 + hash(i) * 10, hash(i + 3) * 3, PCOLORS[(i + 2) % PCOLORS.length]);
      const dp = idle(P({ x: 520, y: 1500, s: .84 }), T, 2); dp.armL = 1.5; dp.armR = 1.5; dp.handL = .5; dp.handR = -.5;
      if (T > sent) dp.bodyY -= 14 * pop(T - sent);
      C(ctx, 'dad', dp, { expr: 'smug', mouth: 'grin' }, T);
      const np = idle(P({ x: 830, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 1); np.armR = 2.5; np.handR = 1.2; np.head = .2;
      C(ctx, 'nubi', np, { expr: 'sad' }, T);
    },
    ui: (ctx, T, lt) => { dmgPop(ctx, '-9999', 540, 700, T - sent, '#EE384A', 220); },
    sfx: [[.1, 'crash', .5], [sent - 0, 'impact', .7]] });

  // ===== S02 — dad tells pun to neighbor =====
  const dmg = ws('L1', 'damage');
  S.push({ id: 'S02', start: st('L1'), trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => PACK_SETS.frontYard.draw(ctx, T, cam, {}),
    cam: lt => { const T = lt + st('L1'); return camAt(540 + shk(T, dmg, 12), 1080, 1.2 + lt * .03); },
    draw(ctx, T, lt) {
      const dp = talk(idle(P({ x: 300, y: 1500, s: .84, view: 'q34' }), T, 1), T, 1, .5); if (T > dmg - .1) { dp.armR = 2.0; dp.handR = .4; }
      C(ctx, 'dad', dp, { expr: 'smug', mouth: lipShape(T, ['L1']) }, T);
      const k = easeOut(inv(dmg, dmg + .5, T));
      const gp = idle(P({ x: 760 + k * 170, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 4); if (T > dmg) { gp.lean = -.3 * k; gp.rot = -.25 * k; gp.armL = 2.2; gp.armR = 2.2; }
      C(ctx, 'neighborGranny', gp, { expr: T > dmg ? 'surprised' : 'neutral' }, T);
      if (T > dmg) burst(ctx, 700, 1100, T - dmg, { kind: 'star', n: 10, speed: 500, gravity: 300, life: .6, size: 22 });
    },
    ui: (ctx, T) => { dmgPop(ctx, '-50', 740, 950, T - dmg, '#EE384A', 130); },
    sfx: [[dmg - st('L1'), 'impact', .6]] });

  // ===== S03 — groan hits like a punch =====
  const pun = ws('L2', 'punch');
  S.push({ id: 'S03', start: st('L2'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const T = lt + st('L2'); return camAt(540 + shk(T, pun, 16), 1080, 1.15); },
    draw(ctx, T, lt) {
      const bp = idle(P({ x: 880, y: 1500, s: .74, flip: -1, view: 'q34' }), T, 5);
      C(ctx, 'kidB', bp, { expr: T > pun ? 'surprised' : 'neutral' }, T);
      const u = easeIn(inv(pun, pun + .7, T));
      const x = 520 - (T < pun ? 0 : -u * 1100), y = 1500 - (T < pun ? 0 : Math.sin(u * Math.PI) * 180);
      const kp = T < pun ? talk(idle(P({ x: 520, y: 1500, s: .8, view: 'q34' }), T, 2), T, 2, .3) : P({ x, y, s: .8, view: 'q34', rot: u * 4 });
      if (T < pun) kp.head = .1;
      C(ctx, 'kidA', kp, { expr: T < pun - .3 ? 'sad' : T < pun ? 'angry' : 'screaming' }, T);
      if (T > pun - .05 && T < pun + .2) { ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(600, 1150, 90 * (1 - (T - pun) * 3), 0, 7); ctx.fill(); ctx.restore(); }
    },
    ui: (ctx, T) => { popText(ctx, 'UGHHH', 540, 520, T - pun, { size: 190, fill: '#FFD447', rot: -.1, dur: 1.2 }); if (T > pun && T < pun + .5) speedLines(ctx, 540, 900, T, .5); },
    sfx: [[pun - st('L2'), 'impact', .7], [pun - st('L2') - .02, 'thud', .5]] });

  // ===== S04 — tiny pun, knock knock windows explode =====
  const ten = ws('L3', 'ten'), kn = ws('L3', 'knock'), ex = ws('L3', 'explode');
  S.push({ id: 'S04', start: st('L3'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => PACK_SETS.frontYard.draw(ctx, T, cam, {}),
    cam: lt => { const T = lt + st('L3'); return camAt(540 + shk(T, ten, 8) + shk(T, ex, 18), 1060, 1.12 + lt * .02); },
    draw(ctx, T, lt) {
      // house window
      if (T < ex) { ctx.save(); ctx.fillStyle = '#9fd8f5'; ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 9; ctx.fillRect(740, 780, 220, 200); ctx.strokeRect(740, 780, 220, 200); ctx.beginPath(); ctx.moveTo(850, 780); ctx.lineTo(850, 980); ctx.moveTo(740, 880); ctx.lineTo(960, 880); ctx.stroke(); ctx.restore(); }
      else for (let i = 0; i < 16; i++) { const t = T - ex, a = hash(i) * 6.28, v = 300 + hash(i + 7) * 600; ctx.save(); ctx.translate(850 + Math.cos(a) * v * t, 880 + Math.sin(a) * v * t + 900 * t * t); ctx.rotate(t * 8 + i); ctx.globalAlpha = 1 - smooth(inv(.6, 1.1, t)); ctx.fillStyle = '#bfe8fb'; ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(14, 12); ctx.lineTo(-12, 8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
      const dp = talk(idle(P({ x: 230, y: 1500, s: .84, view: 'q34' }), T, 1), T, 1, .5);
      if (T > kn && T < ex) { const kk = Math.sin((T - kn) * 22) > 0 ? 1 : 0; dp.armR = 1.6 + kk * .3; dp.handR = .5; }
      C(ctx, 'dad', dp, { expr: 'smug', mouth: lipShape(T, ['L3']) }, T);
      const u = easeOut(inv(ex, ex + .6, T));
      const up = T > ex ? P({ x: 560 + u * 480, y: 1500 - Math.sin(u * Math.PI) * 120, s: .84, flip: -1, view: 'q34', rot: -u * 1.2, bodyY: 0 }) : idle(P({ x: 560, y: 1500, s: .84, flip: -1, view: 'q34' }), T, 6);
      C(ctx, 'uncle', up, { expr: T > ex ? 'screaming' : T > kn ? 'nervous' : 'neutral' }, T);
    },
    ui: (ctx, T) => { dmgPop(ctx, '-10', 300, 900, T - ten, '#EE384A', 110); if (T > ex) speedLines(ctx, 540, 900, T, .35); },
    sfx: [[ten - st('L3'), 'pop', .5], [kn - st('L3'), 'tick', .5], [ex - st('L3'), 'crash', .7]] });

  // ===== S05 — mom's helmet =====
  const hel = ws('L4', 'helmet');
  const zoomK = T => smooth(inv(hel - .15, hel + .35, T));
  S.push({ id: 'S05', start: st('L4'), trans: 'zoom', capY: 1640,
    bg: (ctx, T, cam) => PACK_SETS.diningRoom.draw(ctx, T, cam, {}),
    cam: lt => { const T = lt + st('L4'), k = zoomK(T); return camAt(lerp(540, 540, k), lerp(1130, 1090, k), lerp(1.0, 2.1, k) + lt * .02); },
    draw(ctx, T, lt) {
      const dp = laugh(P({ x: 250, y: 1455, s: .8, view: 'q34' }), T, 1);
      C(ctx, 'dad', dp, { expr: 'laughing' }, T);
      const np = idle(P({ x: 830, y: 1455, s: .8, flip: -1, view: 'q34' }), T, 3);
      C(ctx, 'nubi', np, { expr: 'nervous', sweat: true }, T);
      const mp = idle(P({ x: 540, y: 1455, s: .8 }), T, 7); mp.armL = .6; mp.armR = .6; mp.bodyY += Math.sin(T * 5) * 2;
      C(ctx, 'mom', mp, { expr: 'neutral', mouth: Math.sin(T * 4) > .6 ? 'smallOpen' : 'flat', lookX: 0, eyes: { open: .55 } }, T);
      helmet(ctx, 540, 1000 + mp.bodyY, 150);
      envDiningRoomFront(ctx, T, null, {});
    },
    sfx: [[hel - st('L4'), 'ding', .6]] });

  // ===== S06 — zero damage, nobody groans =====
  const zero5 = ws('L5', 'zero'), gr5 = ws('L5', 'groans');
  S.push({ id: 'S06', start: st('L5'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => PACK_SETS.classroom.draw(ctx, T, cam, {}),
    cam: lt => camAt(560, 1060, 1.12 + lt * .03),
    draw(ctx, T, lt) {
      const np = talk(idle(P({ x: 880, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 1), T, 1, .5); np.armR = 1.4 + Math.sin(T * 5) * .3; np.handR = .5;
      C(ctx, 'nubi', np, { expr: 'happy', mouth: lipShape(T, ['L5']) }, T);
      for (const [n, x] of [['kidA', 380], ['kidC', 700]]) { const kp = idle(P({ x, y: 1500, s: .74, view: 'q34' }), T, x); kp.head = .15; C(ctx, n, kp, { expr: 'neutral', eyes: { open: .5 }, mouth: 'flat' }, T); }
      envClassroomFront(ctx, T, null, { desks: [380, 700] });
    },
    ui: (ctx, T) => { dmgPop(ctx, '0', 760, 800, T - zero5, '#9AA3AD', 170); popText(ctx, '*cricket*', 420, 560, T - gr5, { size: 90, fill: '#cfd6dd', rot: -.05, dur: 1.4 }); },
    sfx: [[zero5 - st('L5'), 'tick', .5], [gr5 - st('L5'), 'tick', .4]] });

  // ===== S07 — Zero Damage nickname =====
  const zero6 = ws('L6', 'zero');
  S.push({ id: 'S07', start: st('L6'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1070, 1.15 + lt * .04),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); np.head = .1;
      C(ctx, 'nubi', np, { expr: T > zero6 ? 'sad' : 'nervous' }, T);
      for (const [n, x, fl, d] of [['kidA', 190, 1, 0], ['kidD', 860, -1, .1], ['kidF', 340, 1, .2]]) {
        const kp = idle(P({ x, y: x === 340 ? 1420 : 1500, s: x === 340 ? .62 : .74, flip: fl, view: 'q34' }), T, x); kp.armL = 1.9 + Math.sin(T * 9 + d * 10) * .15; kp.handL = .3;
        C(ctx, n, kp, { expr: T > zero6 ? 'laughing' : 'smug' }, T);
      }
    },
    ui: (ctx, T) => { stamp(ctx, 'ZERO DAMAGE', 540, 520, T - zero6, '#9AA3AD', 1.0); },
    sfx: [[zero6 - st('L6') + .3, 'sad_trombone', .5]] });

  // ===== S08 — saw Lily =====
  const lil = ws('L7', 'lily');
  S.push({ id: 'S08', start: st('L7'), trans: 'cut', capY: 1640,
    bg: SM,
    cam: lt => camAt(lerp(500, 560, smooth(inv(0, 2, lt))), 1070, 1.15 + lt * .02),
    draw(ctx, T, lt) {
      const np = walk(P({ x: 300, y: 1500, s: .8, view: 'q34' }), T, .6, .4); np.armL = 1.0; np.armR = 1.0;
      C(ctx, 'nubi', np, { expr: T > lil ? 'love' : 'happy' }, T);
      cart(ctx, 400, 1450, 0, 1.1);
      const lp = idle(P({ x: 780, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 3); lp.armR = 1.3; lp.handR = .3;
      C(ctx, 'lily', lp, { expr: 'happy', lookX: -.3 }, T);
      burst(ctx, 780, 1050, T - lil, { kind: 'sparkle', n: 18, speed: 380, gravity: -40, life: 1.2, size: 20, seed: 5 });
      burst(ctx, 300, 1000, T - lil - .05, { kind: 'heart', n: 6, speed: 250, gravity: -120, life: 1.0, size: 22, seed: 2 });
    },
    sfx: [[lil - st('L7'), 'sparkle', .6]] });

  // ===== S09 — so did my dad (record scratch freeze) =====
  const dadT = ws('L8', 'dad');
  const FT = dadT + .3;
  S.push({ id: 'S09', start: st('L8'), trans: 'zoom', capY: 1660,
    bg: SM,
    cam: lt => { const T = lt + st('L8'); return camAt(540, 1060, 1.2 + .5 * smooth(inv(dadT - .2, FT, T))); },
    draw(ctx, T, lt) {
      const Tf = Math.min(T, FT + .01);
      const u = easeOut(inv(dadT - .3, dadT + .15, T));
      const dp = idle(P({ x: 540, y: lerp(1800, 1500, u), s: .84 }), Tf, 2);
      C(ctx, 'dad', dp, { expr: 'smug', mouth: 'grin', eyes: { shape: 'angry' } }, Tf);
      // evil eyebrows
      ctx.save(); ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 12; ctx.lineCap = 'round'; const hy = dp.y - 440 * .84 * 1.14 + 40;
      if (u > .9) { ctx.beginPath(); ctx.moveTo(485, hy - 4); ctx.lineTo(525, hy + 8); ctx.moveTo(595, hy - 4); ctx.lineTo(555, hy + 8); ctx.stroke(); } ctx.restore();
      const np = idle(P({ x: 300, y: 1500, s: .8, view: 'q34' }), Tf, 1);
      C(ctx, 'nubi', np, { expr: 'happy' }, Tf);
      const lp = idle(P({ x: 800, y: 1500, s: .74, flip: -1, view: 'q34' }), Tf, 3);
      C(ctx, 'lily', lp, { expr: 'happy' }, Tf);
      if (T > FT) { ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(-200, 0, 1500, 2000); ctx.restore(); }
    },
    ui: (ctx, T, lt) => { if (T > FT) popText(ctx, "YEP. THAT'S MY DAD.", 540, 420, T - FT, { size: 100, fill: '#FFD447', rot: -.04, dur: 2 }); },
    sfx: [[dadT - st('L8') - .1, 'whoosh', .4], [FT - st('L8'), 'record', .7]] });

  return S;
});
