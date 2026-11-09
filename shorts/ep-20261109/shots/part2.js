// shots/part2.js — S9–S16 (L8–L15), supermarket
'use strict';
shots(() => {
  const S = [];
  const SM = (ctx, T, cam, o) => PACK_SETS.supermarket.draw(ctx, T, cam, o || {});
  // translucent bubble-wrap overlay on Nubi (continuity from L5)
  const wrap = (ctx, p, T) => {
    const s = p.s || .8, x = p.x, y = p.y + (p.bodyY || 0);
    ctx.save(); ctx.globalAlpha = .35;
    for (let i = 0; i < 22; i++) {
      const r = hash(i + 7), q = hash(i * 3 + 1);
      const bx = x + (r - .5) * 110 * s, by = y - (60 + q * 300) * s;
      ctx.beginPath(); ctx.arc(bx, by, 17 * s, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = '#cfe9ff'; ctx.stroke();
    }
    ctx.restore();
  };
  const cheese = (ctx, x, y, r) => {
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); fillStroke(ctx, '#FFC83D', 7);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, -.5, .6); ctx.closePath(); fillStroke(ctx, '#FFE07A', 5);
    for (const [dx, dy, rr] of [[-.4, -.2, .15], [.1, .45, .12], [-.2, .4, .09]]) { ctx.beginPath(); ctx.arc(x + dx * r, y + dy * r, rr * r, 0, TAU); fillStroke(ctx, '#E8A81F', 4); }
  };
  const melon = (ctx, x, y, r) => {
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); fillStroke(ctx, '#4CAF50', 7);
    ctx.save(); ctx.strokeStyle = '#2E7D32'; ctx.lineWidth = 6;
    for (const k of [-.45, 0, .45]) { ctx.beginPath(); ctx.ellipse(x, y, r * (1 - Math.abs(k)) , r, 0, -1.4, 1.4); ctx.stroke(); }
    ctx.restore();
  };
  const dadPose = (T, x, y, s, extra) => Object.assign(idle(P({ x, y, s, view: 'q34', flip: -1 }), T, 5), extra || {});

  // ===== S9 — lettuce, face goes red =====
  const lett = ws('L8', 'lettuce'), redT = ws('L8', 'red');
  S.push({ id: 'S9', start: st('L8'), trans: 'cut', capY: 1650,
    bg: (ctx, T, cam) => SM(ctx, T, cam, { sign: 'LETTUCE', aisle: 1 }),
    cam: lt => camAt(560, 1090, 1.15 + lt * .05 + .15 * smooth(inv(redT - .2, redT + .3, lt + st('L8')))),
    draw(ctx, T, lt) {
      // lettuce crates
      for (let i = 0; i < 4; i++) { const x = 560 + i * 110; ctx.beginPath(); ctx.arc(x, 1250 + (i % 2) * 6, 52, 0, TAU); fillStroke(ctx, '#7BD65B', 7);
        ctx.beginPath(); ctx.arc(x - 10, 1244, 26, 0, TAU); fillStroke(ctx, '#A6E87F', 5); }
      const k = smooth(inv(redT - .1, redT + .5, T));
      const np = idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 1);
      C(ctx, 'nubi', np, { expr: T > redT ? 'nervous' : 'neutral', sweat: T > redT ? 1 : 0 }, T); wrap(ctx, np, T); badgeOver(ctx, 'nubi', np, 1, { t: T });
      const dp = dadPose(T, 760, 1500, .84); if (T > lett) { dp.lean += .1; dp.head = .1 * Math.sin(T * 30) * k; }
      C(ctx, 'dad', dp, { expr: T > redT ? 'angry' : (T > lett ? 'nervous' : 'neutral'), red: k, vein: k > .5, holding: { L: holdShoppingBag } }, T);
      badgeOver(ctx, 'dad', dp, 0, { t: T, state: 'normal' });
      if (T > redT) burst(ctx, 760, 900, T - redT, { kind: 'star', n: 8, speed: 400, gravity: 0, life: .5, size: 18, colors: ['#EE384A', '#FFB02E'], seed: 2 });
    },
    ui(ctx, T) { if (T > redT) popText(ctx, '!!', 760, 640, T - redT, { size: 110, fill: '#EE384A', rot: .1, dur: .9 }); },
    sfx: [[redT - st('L8'), 'buzz', .55]] });

  // ===== S10 — bread, cheeks puff =====
  const puffT = ws('L9', 'puffed'), breadT = ws('L9', 'bread');
  S.push({ id: 'S10', start: st('L9'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => SM(ctx, T, cam, { sign: 'BREAD', aisle: 2 }),
    cam: lt => camAt(540, 1110, 1.9 + lt * .08 + .2 * smooth(inv(puffT - .1, puffT + .3, lt + st('L9')))),
    draw(ctx, T, lt) {
      // bread loaves behind
      for (let i = 0; i < 3; i++) { const x = 180 + i * 360; ctx.beginPath(); ctx.ellipse(x, 1210, 80, 40, 0, 0, TAU); fillStroke(ctx, '#D9954A', 7); }
      const k = pop(T - puffT), big = T > puffT ? 1 + .35 * Math.min(1, k) : 0;
      const p = talk(idle(P({ x: 540, y: 1500, s: .84 }), T, 5), T, 5, 0); if (T > puffT) p.head = .06 * Math.sin(T * 40);
      C(ctx, 'dad', p, { expr: T > puffT ? 'determined' : 'nervous', red: .5, mouth: T > puffT ? 'closed' : undefined }, T);
      if (T > puffT) for (const sx of [-1, 1]) {
        const cx = 540 + sx * 74 * .84, cy = 1500 - 405 * .84 + 46 * .84;
        ctx.beginPath(); ctx.arc(cx, cy, 44 * big, 0, TAU); fillStroke(ctx, '#F56B5C', 7);
        ctx.beginPath(); ctx.arc(cx - sx * 10, cy - 10, 12 * big, 0, TAU); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fill();
      }
      badgeOver(ctx, 'dad', p, 0, { t: T });
    },
    ui(ctx, T) { if (T > puffT) popText(ctx, 'PUFF!', 840, 560, T - puffT, { size: 100, fill: '#FFB02E', rot: .15, dur: 1 }); },
    sfx: [[puffT - st('L9'), 'pop', .6]] });

  // ===== S11 — covered mouth, joke leaks from ear =====
  const covT = ws('L10', 'covered'), earT = ws('L10', 'ear');
  S.push({ id: 'S11', start: st('L10'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => SM(ctx, T, cam, { sign: 'SNACKS', aisle: 3 }),
    cam: lt => camAt(540, 1090, 1.55 + lt * .06),
    draw(ctx, T, lt) {
      const dp = dadPose(T, 700, 1500, .84); dp.head = 0;
      C(ctx, 'dad', dp, { expr: 'determined', red: .6, mouth: 'closed' }, T);
      for (const sx of [-1, 1]) { const cx = 700 + sx * 62, cy = 1500 - 360 * .84; ctx.beginPath(); ctx.arc(cx, cy, 38, 0, TAU); fillStroke(ctx, '#F56B5C', 7); }
      const np = idle(P({ x: 380, y: 1500, s: .8, view: 'q34' }), T, 1);
      const reach = smooth(inv(covT - .2, covT + .15, T)); np.armR = lerp(.2, 2.1, reach); np.lean += .12 * reach;
      C(ctx, 'nubi', np, { expr: T > earT ? 'surprised' : 'determined' }, T); wrap(ctx, np, T); badgeOver(ctx, 'nubi', np, 1, { t: T });
      // hand clamp over mouth
      if (T > covT) { ctx.beginPath(); ctx.ellipse(676, 1500 - 300 * .84, 36, 26, 0, 0, TAU); fillStroke(ctx, '#FFD7B5', 7); }
      badgeOver(ctx, 'dad', dp, 0, { t: T });
    },
    ui(ctx, T) {
      if (T > earT) {
        const e = T - earT, a = 1 - smooth(inv(1.6, 2.2, e));
        ctx.save(); ctx.globalAlpha = a; txt(ctx, 'lettuce romaine calm', 800 + e * 18, 560 - Math.min(e, 1.4) * 70, 46, '#fff', '#1b1b2a', 10); ctx.restore();
        popText(ctx, 'PFFT!', 880, 700, e, { size: 70, fill: '#FFB02E', rot: .2, dur: .7 });
      }
    },
    sfx: [[covT - st('L10'), 'pop', .5], [earT - st('L10'), 'whoosh', .5]] });

  // ===== S12 — cashier backflips into melons =====
  const flipT = ws('L11', 'backflipped'), melT = ws('L11', 'melons');
  S.push({ id: 'S12', start: st('L11'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => SM(ctx, T, cam, { sign: 'FRUIT', aisle: 4 }),
    cam: lt => { const T = lt + st('L11'); const sh = T > melT ? Math.sin(T * 70) * 9 * Math.exp(-(T - melT) * 6) : 0; return camAt(lerp(700, 480, smooth(inv(flipT, melT, T))) + sh, 1070, 1.05); },
    draw(ctx, T, lt) {
      // melon pile (left)
      for (const [x, y, r] of [[240, 1480, 60], [360, 1485, 60], [300, 1425, 56], [180, 1495, 46]]) melon(ctx, x, y, r);
      const u = smooth(inv(flipT - .05, melT, T)), ar = Math.sin(u * Math.PI);
      let cp;
      if (T < flipT - .05) cp = idle(P({ x: 820, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 3);
      else if (T < melT) { cp = P({ x: lerp(820, 300, u), y: 1500, s: .8, view: 'side', flip: -1 }); cp.bodyY = -330 * ar; cp.rot = TAU * u; cp.armL = 2; cp.armR = 2; }
      else { cp = P({ x: 300, y: 1470, s: .8, view: 'q34', rot: -1.4, squash: lerp(.6, .75, spring(T - melT, 3, 5)) }); }
      C(ctx, 'cashier', cp, { expr: T < flipT - .05 ? 'smug' : T < melT ? 'screaming' : 'dazed' }, T);
      if (T > melT) burst(ctx, 300, 1330, T - melT, { kind: 'dust', n: 16, speed: 500, gravity: 400, life: .7, size: 20, seed: 4 });
      // dad bag-holder in background
      const dp = dadPose(T, 960, 1500, .8); C(ctx, 'dad', dp, { expr: 'determined', red: .7, mouth: 'closed' }, T);
      dmgPop(ctx, '-50', 330, 1100, melT, T);
    },
    ui(ctx, T) { stamp(ctx, 'L', 540, 620, T - melT - .15, '#EE384A', 1.0); },
    sfx: [[flipT - st('L11'), 'whoosh', .5], [melT - st('L11'), 'crash', .6], [melT - st('L11') + .35, 'sad_trombone', .45]] });

  // ===== S13 — the cheese aisle =====
  const chT = ws('L12', 'cheese');
  S.push({ id: 'S13', start: st('L12'), trans: 'zoom', capY: 1680,
    bg: (ctx, T, cam) => SM(ctx, T, cam, { sign: 'CHEESE', aisle: 5 }),
    cam: lt => camAt(540, lerp(1120, 960, smooth(inv(0, 2.2, lt))), lerp(1.0, 1.75, smooth(inv(0, 2.6, lt)))),
    draw(ctx, T, lt) {
      for (let i = 0; i < 5; i++) cheese(ctx, 120 + i * 210, 1240 + (i % 2) * 18, 50);
      // giant sign
      const sw = pop(T - chT);
      ctx.save(); ctx.translate(540, 760); ctx.scale(.9 + .2 * Math.min(1, sw), .9 + .2 * Math.min(1, sw));
      ctx.fillStyle = '#FFC83D'; roundRect(ctx, -300, -80, 600, 160, 30); ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = OUTLINE; ctx.stroke();
      txt(ctx, 'CHEESE AISLE', 0, 28, 84, '#7A3B00', '#fff', 8); ctx.restore();
      // tiny dad + nubi walking in from behind
      const w = easeOut(inv(0, 2.2, lt));
      const np = walk(P({ x: 420, y: lerp(1400, 1500, w), s: lerp(.5, .8, w), view: 'back' }), T, 1, 1);
      C(ctx, 'nubi', np, { expr: 'nervous' }, T); wrap(ctx, np, T);
      const dp = walk(P({ x: 660, y: lerp(1400, 1500, w), s: lerp(.52, .84, w), view: 'back' }), T, 1, 1);
      C(ctx, 'dad', dp, { expr: 'nervous' }, T);
    },
    ui(ctx, T, lt) { spotlight(ctx, 540, .45 * smooth(inv(chT - .3, chT + .2, T)), '0,0,0'); },
    sfx: [[0, 'zoom', .3], [chT - st('L12'), 'impact', .6]] });

  // ===== S14 — subscribe CTA =====
  const subT = ws('L13', 'subscribe'), surT = ws('L13', 'survives');
  S.push({ id: 'S14', start: st('L13'), trans: 'cut', capY: 1760,
    bg: (ctx, T, cam) => SM(ctx, T, cam, { sign: 'CHEESE', aisle: 5 }),
    cam: lt => camAt(540, 1100, 1.5 + lt * .05),
    draw(ctx, T, lt) {
      for (const [x, y, r] of [[110, 1320, 70], [250, 1440, 60], [830, 1330, 66], [960, 1450, 72], [690, 1470, 50], [400, 1470, 44]]) cheese(ctx, x, y, r);
      const p = talk(idle(P({ x: 540, y: 1500, s: .8 }), T, 1), T, 1, .5);
      if (T > subT) { p.armR = 2.0 + Math.sin(T * 12) * .15; p.handR = .3; }
      C(ctx, 'nubi', p, { expr: T > surT ? 'terrified' : 'smug', mouth: lipShape(T, ['L13']) }, T); wrap(ctx, p, T); badgeOver(ctx, 'nubi', p, 1, { t: T });
    },
    ui(ctx, T, lt) {
      if (T > subT) { popText(ctx, 'SUBSCRIBE', 540, 760, T - subT, { size: 96, fill: '#5BD16B', rot: -.06, dur: 1.4 }); }
      drawSubscribe(ctx, lt - .05, 99, 1460);
    },
    sfx: [[subT - st('L13'), 'ding', .5]] });

  // ===== S15 — thief grabs purse =====
  const grabT = ws('L14', 'grabbed'), thiefT = ws('L14', 'thief');
  S.push({ id: 'S15', start: st('L14'), trans: 'flash', capY: 1660,
    bg: (ctx, T, cam) => SM(ctx, T, cam, { sign: 'PRODUCE', aisle: 6 }),
    cam: lt => { const T = lt + st('L14'); return camAt(lerp(600, 520, smooth(inv(thiefT, grabT + .8, T))), 1080, 1.2); },
    draw(ctx, T, lt) {
      const run0 = grabT + .1;
      const gp = idle(P({ x: 700, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 2);
      if (T > grabT) { surprise(gp, T - grabT); gp.lean = -.15; }
      const hasBag = T < grabT;
      C(ctx, 'neighborGranny', gp, { expr: T > grabT ? 'screaming' : 'happy', holding: hasBag ? { L: holdShoppingBag } : null }, T);
      // thief sneaks in from right, then runs left
      const tx = T < grabT ? lerp(1250, 800, easeOut(inv(st('L14'), grabT, T))) : 800 - (T - grabT) * 900;
      const tp = T < grabT ? walk(P({ x: tx, y: 1500, s: .84, view: 'q34', flip: -1 }), T, 1.4, 1) : run(P({ x: tx, y: 1500, s: .84, view: 'q34', flip: -1 }), T, 1.3);
      if (T >= grabT - .05) tp.armL = 2.2;
      C(ctx, 'dad2', tp, { expr: T > grabT ? 'smug' : 'determined', holding: T > grabT ? { L: holdShoppingBag } : null }, T);
      // black eye-mask
      ctx.fillStyle = '#111'; ctx.fillRect(tx - 48 * .84 - 4, 1500 - 410 * .84, 100 * .84, 22 * .84);
      if (T > grabT) burst(ctx, 760, 1400, T - grabT, { kind: 'dust', n: 12, speed: 500, gravity: 200, life: .5, size: 18, seed: 9 });
    },
    ui(ctx, T) { if (T > grabT) popText(ctx, 'MY PURSE!', 400, 620, T - grabT, { size: 84, fill: '#FF4D5E', rot: -.08, dur: 1.1 }); },
    sfx: [[0, 'glitch', .35], [grabT - st('L14'), 'whoosh', .6]] });

  // ===== S16 — bruh stare, then the nod =====
  const dadT = ws('L15', 'dad', 1), nowT = ws('L15', 'now');
  S.push({ id: 'S16', start: st('L15'), trans: 'cut', capY: 1690,
    bg: (ctx, T, cam) => SM(ctx, T, cam, { sign: 'CHEESE', aisle: 5 }),
    cam: lt => { const T = lt + st('L15'); const toD = smooth(inv(dadT - .3, dadT + .1, T)), back = smooth(inv(nowT - .4, nowT - .1, T)); const x = lerp(lerp(380, 760, toD), 380, back); return camAt(x, 1110, lerp(1.9, 1.7, toD) + (nowT - T < .3 && T < nowT ? .15 : 0)); },
    draw(ctx, T, lt) {
      const k = smooth(inv(0, 2, lt));
      const dp = dadPose(T, 800, 1500, .84); dp.head = .07 * Math.sin(T * 38);
      C(ctx, 'dad', dp, { expr: 'determined', red: 1, vein: true, mouth: 'closed' }, T);
      for (const sx of [-1, 1]) { const cx = 800 + sx * 66, cy = 1500 - 360 * .84; ctx.beginPath(); ctx.arc(cx, cy, 50, 0, TAU); fillStroke(ctx, '#F0453A', 7); }
      const np = idle(P({ x: 380, y: 1500, s: .8, view: 'q34' }), T, 1);
      const nod = T > nowT ? Math.sin(clamp((T - nowT) / .35) * Math.PI) * .35 : 0; np.head = nod; np.headY = nod * 14;
      C(ctx, 'nubi', np, { expr: T > nowT ? 'determined' : 'neutral', eyes: T > nowT ? undefined : { open: .55, pupil: .8, shape: 'flat' }, noBlink: true, lookX: T > dadT - .1 ? 1 : 0, mouth: lipShape(T, ['L15']) }, T);
      wrap(ctx, np, T); badgeOver(ctx, 'nubi', np, 1, { t: T });
      badgeOver(ctx, 'dad', dp, 0, { t: T });
    },
    ui(ctx, T) { if (T > nowT) popText(ctx, 'NOW.', 380, 700, T - nowT, { size: 96, fill: '#EE384A', rot: -.05, dur: 1.2 }); },
    sfx: [[nowT - st('L15'), 'impact', .6]] });

  return S;
});
