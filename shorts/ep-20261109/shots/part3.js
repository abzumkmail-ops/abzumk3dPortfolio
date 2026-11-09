// shots/part3.js — S17-S25 (L16-L25). Written independently of the other parts.
'use strict';
shots(() => {
  const S = [];
  const bg = (ctx, T, cam) => envSupermarket(ctx, T, cam, { sign: 'SNACKS', aisle: 5 });
  const bgHome = (ctx, T, cam) => envLivingRoom(ctx, T, cam, {});
  // translucent bubble wrap over nubi's body
  function wrap(ctx, p, T) {
    ctx.save(); ctx.globalAlpha = .35;
    for (let i = 0; i < 14; i++) {
      const a = i * 2.4, r = (22 + (i % 3) * 5) * p.s, bx = p.x + Math.sin(a * 1.7) * 62 * p.s, by = p.y + (p.bodyY || 0) - (60 + (i * 31) % 330) * p.s;
      ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#bfe8ff'; ctx.stroke();
    }
    ctx.restore();
  }
  const nubiP = (T, x, y, view, flip) => idle(P({ x, y, s: .8, view: view || 'front', flip: flip || 1 }), T, 1);
  const thiefFace = (e) => ({ expr: e });
  function mask(ctx, p) { const y = p.y + (p.bodyY || 0) - 440 * p.s; ctx.fillStyle = '#16161e'; ctx.fillRect(p.x - 52 * p.s, y, 104 * p.s, 30 * p.s); }
  function bandage(ctx, p) { const y = p.y + (p.bodyY || 0) - 485 * p.s; ctx.fillStyle = '#fff'; ctx.fillRect(p.x - 56 * p.s, y, 112 * p.s, 26 * p.s); ctx.fillStyle = '#EE384A'; ctx.fillRect(p.x - 6 * p.s, y, 12 * p.s, 26 * p.s); }

  // ===== S17 — Dad delivers the joke, shockwave @getaway =====
  const gaway = ws('L16', 'getaway'), bath = ws('L16', 'bath');
  S.push({ id: 'S17', start: st('L16'), trans: 'zoom', capY: 1660,
    bg,
    cam: lt => { const T = lt + st('L16'); const sh = T > gaway ? Math.sin(T * 60) * 9 * Math.exp(-(T - gaway) * 5) : 0; return camAt(500 + sh, 1090, 1.2 + lt * .03 + (T > gaway ? .12 : 0)); },
    draw(ctx, T, lt) {
      const t0 = st('L16');
      const gp = idle(P({ x: 900, y: 1500, s: .74, flip: -1, view: 'q34' }), T, 5); C(ctx, 'dad2', gp, thiefFace(T > gaway ? 'terrified' : 'smug'), T); mask(ctx, gp);
      const np = nubiP(T, 220, 1500, 'q34'); C(ctx, 'nubi', np, { expr: T > gaway ? 'terrified' : 'determined', noBlink: true }, T); wrap(ctx, np, T);
      const dx = lerp(420, 560, easeOut(inv(t0, t0 + .6, T)));
      const dp = talk(P({ x: dx, y: 1500, s: .84, view: 'q34' }), T, 2, .6); dp.armR = T > gaway ? 2.2 : 1.2; dp.lean = T > gaway ? .25 : .05;
      C(ctx, 'dad', dp, { expr: T > gaway ? 'screaming' : 'smug', red: .5, mouth: lipShape(T, ['L16']) }, T);
      for (let i = 0; i < 3; i++) { const e = T - gaway - i * .12; if (e < 0 || e > .8) continue; ctx.beginPath(); ctx.ellipse(dx, 1200, 120 + e * 1100, 80 + e * 700, 0, 0, TAU); ctx.lineWidth = 22 * (1 - e); ctx.strokeStyle = `rgba(255,212,71,${1 - e / .8})`; ctx.stroke(); }
      burst(ctx, dx + 120, 1150, T - gaway, { kind: 'star', n: 16, speed: 900, gravity: 300, life: .7, size: 24 });
    },
    sfx: [[.05, 'whoosh', .4], [bath - st('L16'), 'pop', .4], [gaway - st('L16'), 'impact', .7]] });

  // ===== S18 — Thief flies into freezer @freezer =====
  const boom = st('L17'), frz = ws('L17', 'freezer');
  S.push({ id: 'S18', start: st('L17'), trans: 'cut', capY: 1660,
    bg,
    cam: lt => { const T = lt + st('L17'); const k = smooth(inv(boom, frz, T)); const sh = T > frz ? Math.sin(T * 70) * 12 * Math.exp(-(T - frz) * 5) : 0; return camAt(lerp(420, 800, k) + sh, 1080, 1.1 + lt * .03); },
    draw(ctx, T, lt) {
      const u = inv(boom + .1, frz, T), fx = lerp(560, 1080, u * u * (3 - 2 * u));
      const np = nubiP(T, 220, 1500, 'q34'); C(ctx, 'nubi', np, { expr: 'surprised' }, T); wrap(ctx, np, T);
      const dp = P({ x: 420, y: 1500, s: .84, view: 'q34', lean: -.15 }); dp.armR = 2.2; C(ctx, 'dad', dp, { expr: 'smug', red: .3 }, T);
      let tp;
      if (T < frz) { tp = P({ x: fx, y: 1500, s: .74, view: 'side', flip: -1, bodyY: -140 - Math.sin(u * Math.PI) * 120, rot: -u * TAU * 1.2 }); tp.armL = 2; tp.armR = 2; }
      else tp = P({ x: 1080, y: 1500, s: .74, view: 'front', bodyY: -160, rot: -.3, squash: lerp(.6, .85, spring(T - frz, 3, 5)) });
      C(ctx, 'dad2', tp, { expr: T < frz ? 'screaming' : 'dazed' }, T); mask(ctx, tp);
      burst(ctx, 1040, 1250, T - frz, { kind: 'dust', n: 24, speed: 700, gravity: 100, life: .9, size: 40, colors: ['#ffffff', '#cdeeff'], seed: 4 });
      dmgPop(ctx, '-9999', 900, 1000, frz, T, '#FF4D5E');
    },
    sfx: [[.05, 'impact', .6], [frz - boom, 'crash', .7]] });

  // ===== S19 — wide, everyone flattened, cashier again =====
  const agn = ws('L18', 'again'), t18 = st('L18');
  S.push({ id: 'S19', start: st('L18'), trans: 'cut', capY: 1650,
    bg,
    cam: lt => camAt(540, 1060, 1.0 + lt * .03),
    draw(ctx, T, lt) {
      const hit = ws('L18', 'shoppers');
      const list = [['kidG', 150, 0], ['neighborGranny', 360, .08], ['kidH', 780, .12], ['cashier', 940, agn - hit]];
      for (const [n, x, d] of list) {
        const e = T - (n === 'cashier' ? agn : hit + d);
        const flat = e > 0 ? easeOut(clamp(e / .25)) : 0;
        const p = P({ x, y: 1500, s: .72, view: 'q34', flip: x > 540 ? -1 : 1, squash: lerp(1, .32, flat), rot: flat * (x > 540 ? .25 : -.25), bodyY: n === 'cashier' && e > 0 && e < .6 ? -Math.sin(e / .6 * Math.PI) * 220 : 0 });
        C(ctx, n, p, { expr: e > 0 ? 'dazed' : 'neutral', holding: n === 'neighborGranny' ? { R: holdShoppingBag } : null }, T);
        if (n === 'cashier' && e > 0) bandage(ctx, p);
      }
      const dp = P({ x: 540, y: 1500, s: .8 }); idle(dp, T, 2); C(ctx, 'dad', dp, { expr: 'smug', red: .2 }, T);
      const np = nubiP(T, 400, 1500, 'q34'); C(ctx, 'nubi', np, { expr: 'nervous' }, T); wrap(ctx, np, T);
      dmgPop(ctx, '-50', 940, 1000, agn, T, '#FF4D5E');
      burst(ctx, 540, 1300, T - hit, { kind: 'dust', n: 20, speed: 800, gravity: 200, life: .8, size: 36, seed: 7 });
    },
    ui(ctx, T) { popText(ctx, 'AGAIN!', 540, 480, T - agn, { size: 120, fill: '#FFD447', rot: -.08, dur: 1.2 }); },
    sfx: [[ws('L18', 'shoppers') - t18, 'crash', .6], [agn - t18, 'laugh', .5]] });

  // ===== S20 — only I was standing =====
  const stand = ws('L19', 'standing'), wr = ws('L19', 'wrap');
  S.push({ id: 'S20', start: st('L19'), trans: 'cut', capY: 1660,
    bg,
    cam: lt => camAt(540, 1080, 1.3 + lt * .06),
    draw(ctx, T, lt) {
      for (const [n, x, r] of [['kidG', 120, 1.5], ['kidH', 960, -1.5]]) { const p = P({ x, y: 1500, s: .66, rot: r, squash: .5 }); C(ctx, n, p, { expr: 'dazed' }, T); }
      const dp = P({ x: 130, y: 1500, s: .66, rot: -1.4 }); C(ctx, 'dad', dp, { expr: 'dazed' }, T);
      const np = celebrate(idle(P({ x: 540, y: 1500, s: .8 }), T, 1), T, T > wr ? .8 : 0);
      C(ctx, 'nubi', np, { expr: T > wr ? 'happy' : 'smug', mouth: undefined }, T); wrap(ctx, np, T);
      burst(ctx, 540, 1150, T - wr, { kind: 'sparkle', n: 28, speed: 900, gravity: 300, life: .9, size: 26, colors: ['#ffffff', '#bfe8ff'], seed: 2 });
    },
    ui(ctx, T) { stamp(ctx, 'W', 540, 560, T - wr, '#30CE65', 1.0); },
    sfx: [[wr - st('L19'), 'pop', .6], [wr - st('L19') + .2, 'cheer', .45]] });

  // ===== S21 — head of security =====
  const sec = ws('L20', 'security');
  S.push({ id: 'S21', start: st('L20'), trans: 'cut', capY: 1660,
    bg,
    cam: lt => camAt(560, 1070, 1.2 + lt * .04),
    draw(ctx, T, lt) {
      const gp = idle(P({ x: 880, y: 1500, s: .76, flip: -1, view: 'q34' }), T, 3); C(ctx, 'neighborGranny', gp, { expr: 'happy', holding: { R: holdShoppingBag } }, T);
      const cp = P({ x: 240, y: 1500, s: .8, view: 'q34' }); idle(cp, T, 4); cp.armR = T > sec - .4 ? 1.8 : .2;
      C(ctx, 'cashier', cp, { expr: 'smug', holding: T > sec - .4 && T < sec + .1 ? null : null }, T); bandage(ctx, cp);
      const dp = P({ x: 560, y: 1500, s: .84 }); idle(dp, T, 2); if (T > sec) celebrate(dp, T, .6);
      C(ctx, 'dad', dp, { expr: T > sec ? 'excited' : 'happy' }, T);
      if (T > sec) { const k = pop(T - sec), cx = 560 - 38 * dp.s, cy = 1500 - 290 * dp.s; ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.fillStyle = '#FFD447'; ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(26, -14); ctx.lineTo(22, 20); ctx.lineTo(0, 34); ctx.lineTo(-22, 20); ctx.lineTo(-26, -14); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
      const np = nubiP(T, 740, 1500, 'q34', -1); C(ctx, 'nubi', np, { expr: 'happy' }, T); wrap(ctx, np, T);
      envSupermarketFront(ctx, T, null, { x: 560 });
    },
    ui(ctx, T) { popText(ctx, 'SECURITY', 540, 520, T - sec, { size: 130, fill: '#FFD447', rot: -.05, dur: 1.4 }); },
    sfx: [[sec - st('L20'), 'ding', .6], [sec - st('L20') + .15, 'cheer', .4]] });

  // ===== S22 — At home, mom arms crossed =====
  const jk = ws('L21', 'jokes');
  S.push({ id: 'S22', start: st('L21'), trans: 'whip', capY: 1660,
    bg: bgHome,
    cam: lt => camAt(400, 1090, 1.5 + lt * .04),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 400, y: 1455, s: .84 }), T, 6); p.armL = -.9; p.armR = -.9; p.handL = .5; p.handR = -.5; if (T > ws('L21', 'asked') - .1) talk(p, T, 6, .4);
      C(ctx, 'mom', p, { expr: T > jk ? 'flat' !== 'x' && 'neutral' : 'neutral', mouth: lipShape(T, ['L21']), lookX: 0 }, T);
      popText2(ctx, T);
    },
    ui(ctx, T) { popText(ctx, 'ANY JOKES?', 540, 520, T - jk, { size: 100, fill: '#ffffff', rot: .04, dur: 1.4 }); },
    sfx: [[0, 'whoosh', .35]] });
  function popText2() {}

  // ===== S23 — dad innocent grin @cheesy =====
  const chz = ws('L22', 'cheesy');
  S.push({ id: 'S23', start: st('L22'), trans: 'cut', capY: 1660,
    bg: bgHome,
    cam: lt => camAt(540, 1110, 2.0 + lt * .06),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .84 }), T, 3), T, 3, .35);
      C(ctx, 'dad', p, { expr: T > chz ? 'smug' : 'happy', mouth: lipShape(T, ['L22']) || (T > chz ? 'grin' : undefined), sweat: T > chz ? 1 : 0, lookX: T > chz ? 0 : .3 }, T);
    },
    sfx: [[chz - st('L22'), 'pop', .5]] });

  // ===== S24 — mom immune; dog launched out window @not =====
  const immune = ws('L23', 'immune'), roll = ws('L23', 'rolled'), nt = ws('L24', 'not');
  S.push({ id: 'S24', start: st('L23'), trans: 'cut', capY: 1660,
    bg: bgHome,
    cam: lt => { const T = lt + st('L23'); const k = smooth(inv(nt - .3, nt + .3, T)); const sh = T > nt ? Math.sin(T * 70) * 8 * Math.exp(-(T - nt) * 5) : 0; return camAt(lerp(480, 640, k) + sh, 1100, lerp(1.3, 1.1, k)); },
    draw(ctx, T, lt) {
      const mp = P({ x: 300, y: 1455, s: .8 }); idle(mp, T, 6); mp.armL = -.9; mp.armR = -.9;
      const look = T > roll ? Math.sin(clamp((T - roll) / .7) * Math.PI) * -.9 : 0;
      C(ctx, 'mom', mp, { expr: 'neutral', lookY: -Math.abs(look), lookX: look * .5, noBlink: true }, T);
      const dp = idle(P({ x: 520, y: 1455, s: .8 }), T, 7); C(ctx, 'dad', dp, { expr: 'smug', sweat: 1 }, T);
      // dog
      if (T < nt) drawDog(ctx, 760, 1480, .8, T, { flip: -1 });
      else { const e = T - nt; drawDog(ctx, 760 + e * 900, 1480 - e * 700 + e * e * 500, .8, T + e * 8, { flip: -1 }); }
      dmgPop(ctx, '-1', 1050, 1120, nt + .1, T, '#FF4D5E');
      if (T > immune) burst(ctx, 300, 1000, T - immune, { kind: 'sparkle', n: 8, speed: 300, gravity: 0, life: .7, size: 18 });
    },
    ui(ctx, T) { stamp(ctx, 'IMMUNE', 540, 620, T - immune, '#30CE65', 1.0); },
    sfx: [[immune - st('L23'), 'ding', .5], [nt - st('L23'), 'whoosh', .5], [nt - st('L23') + .25, 'crash', .5]] });

  // ===== S25 — closing CTA =====
  const sub = ws('L25', 'subscribe');
  S.push({ id: 'S25', start: st('L25'), trans: 'cut', capY: 1720,
    bg: bgHome,
    cam: lt => camAt(540, 1080, 1.15 + lt * .03),
    draw(ctx, T, lt) {
      const np = P({ x: 380, y: 1500, s: .8, view: 'q34' }); idle(np, T, 1); np.armL = 2.2 + Math.sin(T * 9) * .3;
      C(ctx, 'nubi', np, { expr: 'happy', mouth: lipShape(T, ['L25']) }, T); wrap(ctx, np, T);
      const dp = P({ x: 700, y: 1500, s: .84, view: 'q34', flip: -1 }); idle(dp, T, 2); dp.armL = 2.2 + Math.sin(T * 9 + 1) * .3;
      C(ctx, 'dad', dp, { expr: 'happy' }, T);
      const peek = smooth(inv(sub + .3, sub + 1.0, T));
      drawDog(ctx, 920, 1250 - (1 - peek) * 260 + 240, .5, T, { flip: -1 });
      dmgPop(ctx, '-1', 900, 1100, sub + 1.2, T, '#FF4D5E');
    },
    ui(ctx, T, lt) { drawSubscribe(ctx, lt - .05, 4, 1460); },
    sfx: [[sub - st('L25'), 'ding', .6], [sub - st('L25') + 1.0, 'bark', .4]] });

  return S;
});
