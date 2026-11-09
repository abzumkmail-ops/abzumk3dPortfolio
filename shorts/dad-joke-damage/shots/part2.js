// shots/part2.js — S10–S17 (L9–L16): lettuce, boom, lick, freezer, melon dad, pun battle, carts + milk orbit
'use strict';
shots(() => {
  const S = [];
  const MARKET = (ctx, T, cam) => envSupermarket(ctx, T, cam, { sign: 'SNACKS', aisle: 5 });
  const shake = (T, t0, a, k = 5) => (T > t0 ? Math.sin(T * 62) * a * Math.exp(-(T - t0) * k) : 0);
  function cereal(ctx, x, y, rot, col) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 5;
    ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-26, -38, 52, 76, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(0, -4, 14, 0, 7); ctx.fill(); ctx.restore();
  }
  function cart(ctx, x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 7; ctx.lineJoin = 'round';
    ctx.fillStyle = '#C9D1DA'; ctx.beginPath(); ctx.moveTo(-70, -60); ctx.lineTo(80, -60); ctx.lineTo(55, 30); ctx.lineTo(-45, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-70, -60); ctx.lineTo(-95, -90); ctx.stroke();
    ctx.fillStyle = '#EE384A'; ctx.fillRect(-60, -50, 130, 14);
    for (const wx of [-30, 38]) { ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(wx, 52, 14, 0, 7); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  }
  function zig(ctx, x1, y1, x2, y2, T, w, seed) {
    const r = rng(seed + (T * 14 | 0)); ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (const [lw, c] of [[w * 2.4, '#1b1b2a'], [w, '#FFE45C']]) {
      ctx.lineWidth = lw; ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(x1, y1);
      const rr = rng(seed + (T * 14 | 0));
      for (let i = 1; i < 7; i++) { const u = i / 7; ctx.lineTo(lerp(x1, x2, u) + (rr() - .5) * 80, lerp(y1, y2, u) + (rr() - .5) * 90); }
      ctx.lineTo(x2, y2); ctx.stroke();
    }
    ctx.restore();
  }

  // ===== S10 — grabbed a lettuce and said... =====
  const grabT = ws('L9', 'grabbed'), letT = ws('L9', 'lettuce');
  S.push({ id: 'S10', start: st('L9'), trans: 'cut', capY: 1640,
    bg: MARKET,
    cam: lt => camAt(560 + lt * 6, 1060, 1.05 + lt * .03),
    draw(ctx, T, lt) {
      // produce crate on the right
      ctx.save(); ctx.fillStyle = '#B07A3E'; ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.roundRect(880, 1330, 220, 170, 10); ctx.fill(); ctx.stroke(); ctx.restore();
      lettuce(ctx, 940, 1325, .7); lettuce(ctx, 1040, 1330, .7);
      const np = idle(P({ x: 170, y: 1500, s: .74, view: 'q34' }), T, 1); if (T > letT) np.armL = .6;
      C(ctx, 'nubi', np, { expr: T > letT ? 'terrified' : 'nervous', sweat: T > letT }, T);
      const lp = idle(P({ x: 700, y: 1500, s: .7, flip: -1, view: 'q34' }), T, 5);
      C(ctx, 'lily', lp, { expr: 'happy' }, T);
      // dad: reach right, grab, wind up
      const dp = idle(P({ x: 520, y: 1500, s: .8, view: 'q34' }), T, 3);
      const rise = easeOut(inv(letT, letT + .5, T));
      if (T < letT) { anticipate(dp, T - grabT, .2); dp.armR = lerp(.4, 1.5, smooth(inv(grabT, letT, T))); dp.lean = .1; }
      else { dp.armR = lerp(1.5, 2.5, rise); dp.lean = lerp(.1, -.18, rise); dp.bodyY -= 8 * spring(T - letT, 3, 5); }
      C(ctx, 'dad', dp, { expr: T > letT ? 'smug' : 'happy', holding: T > letT + .45 ? { R: c => lettuce(c, 0, 34, .55) } : null }, T);
      if (T <= letT + .45) {
        const u = inv(letT - .05, letT + .45, T);
        const fx = lerp(950, 650, easeOut(u)), fy = lerp(1320, 1130, u) - Math.sin(u * Math.PI) * 140;
        if (T > letT - .05) lettuce(ctx, fx, fy, .7);
      }
    },
    sfx: [[0, 'step', .3], [letT - st('L9'), 'whoosh', .5]] });

  // ===== S11 — Lettuce introduce ourselves! =====
  const ourT = ws('L10', 'ourselves');
  S.push({ id: 'S11', start: st('L10'), trans: 'cut', capY: 1680,
    bg: MARKET,
    cam: lt => camAt(540, 1110, 2.0 + lt * .08),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .8 }), T, 3), T, 3, .5); p.armR = 2.6; p.handR = .2;
      p.armL = .5; if (T > ourT) p.bodyY -= 14 * Math.exp(-(T - ourT) * 5);
      C(ctx, 'dad', p, { expr: 'excited', mouth: lipShape(T, ['L10']), holding: { R: c => lettuce(c, 0, 34, .55) } }, T);
      const t = T - ourT;
      if (t > 0 && t < .8) {
        ctx.save(); const r = 80 + t * 1300; ctx.globalAlpha = 1 - t / .8;
        ctx.lineWidth = 30 * (1 - t / .8) + 4; ctx.strokeStyle = '#FFF'; ctx.beginPath(); ctx.arc(540, 1150, r, 0, TAU); ctx.stroke(); ctx.restore();
      }
    },
    sfx: [[ourT - st('L10'), 'zoom', .55]] });

  // ===== S12 — Boom. Cereal everywhere. =====
  const boomT = ws('L11', 'boom');
  S.push({ id: 'S12', start: st('L11'), trans: 'flash', capY: 1660,
    bg: MARKET,
    cam: lt => { const T = lt + st('L11'); return camAt(540 + shake(T, boomT, 16), 1060 + shake(T + .3, boomT, 10), 1.0 + lt * .03); },
    draw(ctx, T, lt) {
      const lp = idle(P({ x: 800, y: 1500, s: .76, flip: -1, view: 'q34' }), T, 5);
      if (T > boomT) { lp.squash = lerp(1, .72, smooth(inv(boomT, boomT + .15, T))); lp.armL = .5; lp.armR = .5; lp.head = .2; }
      C(ctx, 'lily', lp, { expr: T > boomT ? 'terrified' : 'neutral' }, T);
      const dp = idle(P({ x: 540, y: 1500, s: .8 }), T, 3); dp.armR = T < boomT ? 2.6 : lerp(2.6, .9, easeOut(inv(boomT, boomT + .2, T)));
      C(ctx, 'dad', dp, { expr: T > boomT ? 'laughing' : 'smug', holding: T < boomT ? { R: c => lettuce(c, 0, 34, .55) } : null }, T);
      const np = idle(P({ x: 270, y: 1500, s: .76 }), T, 1); if (T > boomT) { np.armL = 1.3; np.armR = 1.3; np.handL = -1.2; np.handR = -1.2; np.lean = -.12; }
      C(ctx, 'nubi', np, { expr: T > boomT ? 'screaming' : 'nervous' }, T);
      // exploding cereal boxes
      if (T > boomT) {
        const t = T - boomT, r = rng(11), cols = ['#EE384A', '#FFC531', '#3E9BFF', '#30CE65', '#FF8528'];
        for (let i = 0; i < 26; i++) {
          const x0 = 120 + r() * 840, y0 = 1100 + r() * 200, vx = (x0 - 540) * 1.4 + (r() - .5) * 300, vy = -500 - r() * 800;
          const x = x0 + vx * t, y = Math.min(1520, y0 + vy * t + 1300 * t * t);
          cereal(ctx, x, y, t * (r() * 14 - 7), cols[i % 5]);
        }
      }
      if (T > boomT) burst(ctx, 540, 1200, T - boomT, { kind: 'star', n: 20, speed: 900, gravity: 300, life: .6, size: 26, seed: 4 });
    },
    ui(ctx, T) {
      dmgPop(ctx, '-500', 300, 1000, T - boomT - .05);
      dmgPop(ctx, '-500', 540, 880, T - boomT - .2);
      dmgPop(ctx, '-500', 790, 1000, T - boomT - .35);
    },
    sfx: [[boomT - st('L11'), 'crash', .7], [boomT - st('L11'), 'impact', .6]] });

  // ===== S13 — covered his mouth, he licked my hand =====
  const covT = ws('L12', 'covered'), lickT = ws('L12', 'licked');
  S.push({ id: 'S13', start: st('L12'), trans: 'cut', capY: 1660,
    bg: MARKET,
    cam: lt => camAt(540, 1110, 1.7 + lt * .05),
    draw(ctx, T, lt) {
      const rec = easeOut(inv(lickT, lickT + .25, T));
      const dp = idle(P({ x: 690, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 3);
      const nx = lerp(430, 330, rec);
      C(ctx, 'dad', dp, { expr: T > lickT ? 'laughing' : 'smug', mouth: T > lickT ? 'laugh' : 'flat' }, T);
      const np = idle(P({ x: nx, y: 1500, s: .8, view: 'q34' }), T, 1);
      np.armR = T < covT ? lerp(.2, 1.75, smooth(inv(covT - .3, covT + .2, T))) : (T < lickT ? 1.75 : lerp(1.75, .9, rec));
      if (T > lickT) { np.lean = -.18 * rec; np.armL = .6; np.handR = 1.5; }
      C(ctx, 'nubi', np, { expr: T > lickT ? 'terrified' : 'determined', sweat: T > lickT }, T);
      if (T > lickT) burst(ctx, nx + 90, 1160, T - lickT, { kind: 'dust', n: 8, speed: 260, gravity: 200, life: .5, size: 18, seed: 2, colors: ['#9BE15D', '#C8F28A'] });
    },
    ui(ctx, T) { stamp(ctx, 'L', 540, 600, T - lickT - .1, '#EE384A', 1.1); },
    sfx: [[lickT - st('L12'), 'poof', .5], [lickT - st('L12') + .1, 'sad_trombone', .5]] });

  // ===== S14 — hid in the freezer, "chill out" =====
  const hidT = ws('L13', 'hid'), chillT = ws('L13', 'chill');
  S.push({ id: 'S14', start: st('L13'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => envSupermarket(ctx, T, cam, { sign: 'FROZEN', aisle: 3 }),
    cam: lt => { const T = lt + st('L13'); return camAt(520 + shake(T, chillT, 12), 1090, 1.4 + lt * .04); },
    draw(ctx, T, lt) {
      // freezer door frame behind Nubi
      ctx.save(); ctx.fillStyle = 'rgba(140,230,255,.45)'; ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.roundRect(110, 960, 380, 560, 14); ctx.fill(); ctx.stroke(); ctx.restore();
      const peek = easeOut(inv(hidT, hidT + .4, T));
      const np = idle(P({ x: lerp(220, 310, peek), y: 1500, s: .8, view: 'q34' }), T, 1); np.armL = 1.2; np.armR = .5; np.squash = .9;
      if (T > chillT) { np.lean = -.2; np.armL = 1.4; }
      C(ctx, 'nubi', np, { expr: T > chillT ? 'terrified' : 'nervous', sweat: true, pale: .5 }, T);
      const lean = easeOut(inv(chillT - .4, chillT, T));
      const dp = idle(P({ x: lerp(950, 700, lean), y: 1500, s: .8, flip: -1, view: 'q34' }), T, 3); dp.lean = .25 * lean; dp.armR = .8;
      C(ctx, 'dad', dp, { expr: T > chillT ? 'laughing' : 'smug', mouth: lipShape(T, ['L13']) }, T);
      // frost mist over the door
      ctx.save(); ctx.fillStyle = 'rgba(200,245,255,.28)'; ctx.fillRect(110, 960, 380, 560); ctx.restore();
      if (T > chillT) {
        burst(ctx, 460, 1200, T - chillT, { kind: 'sparkle', n: 24, speed: 1100, gravity: 500, life: .8, size: 30, colors: ['#BFF1FF', '#7FD8FF', '#FFFFFF'], seed: 8 });
        const r = rng(5);
        for (let i = 0; i < 8; i++) {
          const t = T - chillT, a = -.9 + r() * 1.8, sp = 500 + r() * 700, x = 480 + Math.cos(a) * sp * t, y = 1200 + Math.sin(a) * sp * t + 400 * t * t;
          ctx.save(); ctx.translate(x, y); ctx.rotate(t * 6 + i); ctx.fillStyle = '#CFF5FF'; ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(10, 0); ctx.lineTo(0, 22); ctx.lineTo(-10, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
        }
      }
    },
    ui(ctx, T) { dmgPop(ctx, '-200', 330, 900, T - chillT); stamp(ctx, 'L', 700, 600, T - chillT - .25, '#EE384A', 1.0); },
    sfx: [[hidT - st('L13'), 'thud', .4], [chillT - st('L13'), 'crash', .55], [chillT - st('L13') + .25, 'sad_trombone', .5]] });

  // ===== S15 — Lily's dad with a melon =====
  const subT = ws('L14', 'subscribe'), melT = ws('L14', 'melon');
  S.push({ id: 'S15', start: st('L14'), trans: 'zoom', capY: 1720,
    bg: MARKET,
    cam: lt => { const T = lt + st('L14'); const k = smooth(inv(melT - .5, melT + .3, T)); return camAt(lerp(540, 880, k), lerp(1060, 1290, k), lerp(1.0, 2.1, k) + lt * .02); },
    draw(ctx, T, lt) {
      const dp = idle(P({ x: 260, y: 1500, s: .8, view: 'q34' }), T, 3); C(ctx, 'dad', dp, { expr: T > melT ? 'surprised' : 'smug' }, T);
      const np = idle(P({ x: 110, y: 1500, s: .72, view: 'q34' }), T, 1); C(ctx, 'nubi', np, { expr: 'nervous', sweat: T > melT }, T);
      const d2 = P({ x: lerp(1150, 880, easeOut(inv(st('L14') + .3, melT, T))), y: 1420, s: .66, flip: -1, view: 'q34' });
      if (T < melT) walk(d2, T, 1.1); else idle(d2, T, 6);
      d2.armR = 1.6;
      C(ctx, 'dad2', d2, { expr: T > melT ? 'determined' : 'neutral', holding: { R: c => melon(c, 0, 34, .5) } }, T);
    },
    ui(ctx, T, lt) { drawSubscribe(ctx, T - subT, 2.0, 1460); },
    sfx: [[melT - st('L14'), 'record', .5], [melT - st('L14') + .1, 'impact', .5]] });

  // ===== S16 — Two dads. One aisle. Pun battle. =====
  const twoT = ws('L15', 'two'), vsT = ws('L15', 'one'), batT = ws('L15', 'battle');
  S.push({ id: 'S16', start: st('L15'), trans: 'cut', capY: 1680,
    bg: MARKET,
    cam: lt => camAt(540, 1090, 1.2 + lt * .05),
    draw(ctx, T, lt) {
      const a = idle(P({ x: 270, y: 1500, s: .8, view: 'q34' }), T, 3), b = idle(P({ x: 810, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 7);
      a.armR = 2.3 + Math.sin(T * 8) * .12; b.armR = 2.3 + Math.sin(T * 8 + 1) * .12; a.lean = b.lean = .1;
      C(ctx, 'dad', a, { expr: T > batT ? 'angry' : 'determined', holding: { R: c => lettuce(c, 0, 34, .55) } }, T);
      C(ctx, 'dad2', b, { expr: T > batT ? 'angry' : 'determined', holding: { R: c => melon(c, 0, 34, .5) } }, T);
      if (T > batT - .1) zig(ctx, 400, 1160, 680, 1160, T, 9, 3);
      if (T > batT) burst(ctx, 540, 1160, T - batT, { kind: 'star', n: 16, speed: 700, gravity: 200, life: .6, size: 24, seed: 6 });
    },
    ui(ctx, T) {
      if (T > vsT) popText(ctx, 'VS', 540, 560, T - vsT, { size: 200, fill: '#FFE45C', rot: -.08, dur: 5 });
      popText(ctx, 'PUN BATTLE', 540, 800, T - batT, { size: 120, fill: '#EE384A', rot: .05, dur: 1.5 });
    },
    sfx: [[twoT - st('L15'), 'impact', .5], [batT - st('L15'), 'power', .6]] });

  // ===== S17 — carts flew, the milk hit orbit =====
  const cartT = ws('L16', 'carts'), orbT = ws('L16', 'orbit'), milkT = ws('L16', 'milk');
  S.push({ id: 'S17', start: st('L16'), trans: 'cut', capY: 1700,
    bg: MARKET,
    cam: lt => camAt(540 + shake(lt + st('L16'), cartT, 10, 3), 1040, 1.0),
    draw(ctx, T, lt) {
      const fl = (dad, x, flip, nm, off) => { const p = idle(P({ x, y: 1500, s: .74, flip, view: 'q34' }), T, off); p.armL = p.armR = 1.2; p.lean = -.1; C(ctx, nm, p, { expr: 'terrified' }, T); };
      fl(0, 200, 1, 'dad', 3); fl(0, 880, -1, 'dad2', 7);
      // flying carts across the screen
      for (let i = 0; i < 4; i++) {
        const t0 = cartT + i * .22, t = T - t0; if (t < 0) continue;
        const dir = i % 2 ? -1 : 1, x = dir > 0 ? -150 + t * 900 : 1230 - t * 900, y = 1380 - i * 90 - Math.sin(clamp(t / 1.2) * Math.PI) * 160;
        cart(ctx, x, y, .9, dir * (t * 5));
      }
      // milk shoots off the top
      const mt = T - orbT;
      if (mt > 0 && mt < 1.4) { const y = 1250 - 2100 * (mt / 1.2) ** 1.5; milkCarton(ctx, 540 + Math.sin(mt * 6) * 30, y, 1.1, mt * 7); }
      if (mt > .5) { const tw = Math.sin((T - orbT) * 12) * .5 + .5; ctx.save(); ctx.globalAlpha = tw; starPath(ctx, 540, 140, 40, 16); fillStroke(ctx, '#FFE45C', 5); ctx.restore(); }
    },
    ui(ctx, T) {
      dmgPop(ctx, '-300', 200, 1000, T - cartT - .3);
      dmgPop(ctx, '-300', 880, 1000, T - cartT - .5);
    },
    sfx: [[cartT - st('L16'), 'whoosh', .5], [cartT - st('L16') + .3, 'crash', .5], [orbT - st('L16'), 'whoosh', .6]] });

  return S;
});
