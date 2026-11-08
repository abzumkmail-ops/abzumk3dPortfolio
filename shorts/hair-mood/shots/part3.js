// shots/part3.js — S20–S28 (L18–L26): the class turns, everybody goes pink, Lily's reveal, Click, loop.
'use strict';
shots(() => {
  const S = [];
  const NUBI = T => ({ hair: nubiHair(T), cap: nubiCap(T), hairGlow: nubiGlow(T) });
  const BRAY_PINK = T => hairShift('#F2D45C', 'love', T, ws('L19', 'pink'));
  // Class line-up (plan.md Continuity). Front row on the floor, back row on the riser.
  const FRONT = [['kidA', 200], ['nubi', 430], ['lily', 650], ['kidF', 860]];
  const BACK = [['kidB', 260], ['brayden', 470], ['kidC', 690], ['kidE', 880]];
  // Draw the whole line-up; fn(name, pose, face) customises each member and returns the face.
  function lineup(ctx, T, fn, o = {}) {
    const sF = o.sF || .78, sB = o.sB || .72, out = {};
    for (const [n, x] of BACK) { const p = idle(P({ x, y: 1390, s: sB }), T, x); const f = fn(n, p, {}) || {}; C(ctx, n, p, f, T); out[n] = p; }
    for (const [n, x] of FRONT) { const p = idle(P({ x, y: 1500, s: sF }), T, x); const f = fn(n, p, {}) || {}; C(ctx, n, p, f, T); out[n] = p; }
    return out;
  }
  const headY = (name, p) => headTop(name, p) + 100 * p.s;     // roughly the hair/head centre
  // Speech bubble (world space). Tail points to (tx, ty).
  function bubble(ctx, s, x, y, tx, ty, dt, o = {}) {
    if (dt < 0) return; const k = pop(dt, .25), size = o.size || 70;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(o.rot || 0);
    ctx.font = `${size}px "Lilita One"`; const w = ctx.measureText(s).width + 90, h = size * 1.7;
    ctx.beginPath(); ctx.moveTo(-30, h / 2 - 10); ctx.lineTo((tx - x) / k, (ty - y) / k); ctx.lineTo(30, h / 2 - 10); ctx.closePath(); fillStroke(ctx, o.bg || '#fff', 8);
    box(ctx, -w / 2, -h / 2, w, h, h / 2, o.bg || '#fff', 8);
    if (o.dash) { ctx.setLineDash([16, 12]); rr(ctx, -w / 2 + 14, -h / 2 + 14, w - 28, h - 28, h / 2 - 14); ctx.lineWidth = 4; ctx.strokeStyle = '#FF4FA3'; ctx.stroke(); ctx.setLineDash([]); }
    txt(ctx, s, 0, 4, size, o.fill || '#24225B', OUTLINE, 0);
    ctx.restore();
  }
  // Nubi's orange cap as a held prop / flying prop.
  function capShape(ctx) { ctx.beginPath(); ctx.arc(0, 0, 60, Math.PI, 0); ctx.closePath(); fillStroke(ctx, '#FF8528', 7);
    box(ctx, 20, -10, 90, 22, 10, '#E2681A', 6); circle(ctx, 0, -58, 9, '#E2681A', 4); }
  const holdCap = ctx => { ctx.save(); ctx.translate(0, 50); ctx.rotate(-.4); capShape(ctx); ctx.restore(); };
  const pinkWash = (ctx, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; vignette(ctx, .45, '255,79,163'); ctx.restore(); };

  // ===== S20 — L18 "The whole class turned around." =====
  const tTurn = ws('L18', 'turned');
  S.push({ id: 'S20', start: st('L18'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam),
    cam: lt => { const T = lt + st('L18'); const sh = T > tTurn ? Math.sin(T * 50) * 5 * Math.exp(-(T - tTurn) * 6) : 0; return camAt(540 + sh, 1090, 1.0 + lt * .04); },
    draw(ctx, T, lt) {
      lineup(ctx, T, (n, p) => {
        if (n === 'nubi') {
          const k = smooth(inv(tTurn, tTurn + .4, T)); p.squash = 1 - .1 * k; p.headY = 10 * k; p.armL = .15; p.armR = .15;
          return { ...NUBI(T), expr: T > tTurn ? 'nervous' : 'shy', sweat: T > tTurn, blush: true, lookY: .4 };
        }
        if (n === 'brayden') { p.view = 'q34'; p.flip = -1; p.armR = 1.1; p.handR = .3; laugh(p, T, .6);
          return { expr: 'laughing' }; }
        const x = p.x, d = hash(x) * .25, turned = T > tTurn + d;
        if (turned) { p.view = 'q34'; p.flip = x < 430 ? 1 : -1; surprise(p, T - tTurn - d); }
        if (n === 'lily') return { hair: LILY_PINK, expr: turned ? 'surprised' : 'neutral' };
        return { expr: turned ? 'surprised' : 'neutral' };
      });
    },
    sfx: [[tTurn - st('L18'), 'whoosh', .55]] });

  // ===== S21 — L19 Brayden's hair goes pink; Kayla waved =====
  const tPinkB = ws('L19', 'pink'), tKayla = ws('L19', 'kayla'), tWave = ws('L19', 'waved');
  S.push({ id: 'S21', start: st('L19'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam),
    cam: lt => { const T = lt + st('L19'); const k = smooth(inv(tKayla - .3, tKayla + .3, T));
      const sh = T > tPinkB ? Math.sin(T * 60) * 6 * Math.exp(-(T - tPinkB) * 6) : 0;
      return camAt(lerp(500, 590, k) + sh, 1110, 1.5 + lt * .04); },
    draw(ctx, T, lt) {
      const ps = lineup(ctx, T, (n, p) => {
        if (n === 'brayden') {
          p.view = 'q34'; p.flip = -1;
          if (T < tWave) { p.armR = 1.1; p.handR = .3; laugh(p, T, T < tPinkB ? .6 : .1); }
          else { p.armR = 1.1 + .2 * Math.exp(-(T - tWave) * 6); p.handR = .3; p.flip = 1; p.head = .05; } // freezes mid-point, turns to Kayla
          return { hair: BRAY_PINK(T), expr: T > tWave ? 'love' : T > tPinkB ? 'surprised' : 'laughing', red: T > tWave ? .8 : 0, blush: T > tPinkB, sweat: T > tPinkB && T < tWave };
        }
        if (n === 'kidC') { p.view = 'q34'; p.flip = -1;
          if (T > tWave) { p.armR = 2.2 + Math.sin((T - tWave) * 14) * .35; p.handR = -.2; }
          return { expr: T > tWave ? 'happy' : 'neutral', blush: T > tWave }; }
        if (n === 'nubi') { p.squash = .92; return { ...NUBI(T), expr: T > tPinkB ? 'surprised' : 'nervous', lookY: -.6, lookX: .3 }; }
        if (n === 'lily') { p.view = 'q34'; p.flip = -1; return { hair: LILY_PINK, expr: 'surprised', lookY: -.6 }; }
        if (n === 'kidA' || n === 'kidB') { p.view = 'q34'; return { expr: T > tPinkB ? 'surprised' : 'neutral' }; }
        p.view = 'q34'; p.flip = -1; return { expr: T > tPinkB ? 'surprised' : 'neutral' };
      });
      const b = ps.brayden; hairPop(ctx, b.x, headY('brayden', b) - 40, 'love', T - tPinkB, .9);
      const k = ps.kidC; burst(ctx, k.x + 120, headY('kidC', k) - 80, T - tWave, { kind: 'heart', n: 10, speed: 380, gravity: -100, life: 1, size: 26, seed: 7 });
    },
    ui(ctx, T) { popText(ctx, 'PINK?!', 540, 520, T - tPinkB, { size: 110, fill: '#FF4FA3', rot: -.08, dur: 1.2 }); },
    sfx: [[tPinkB - st('L19'), 'boing', .6], [tWave - st('L19'), 'chime', .55]] });

  // ===== S22 — L20 "Everybody goes pink for someone." (HUD gone) =====
  const tReal = ws('L20', 'realized');
  const waves = [['kidA', 'everybody'], ['kidF', 'goes'], ['kidB', 'pink'], ['kidE', 'for'], ['kidC', 'someone']].map(([n, w]) => [n, ws('L20', w)]);
  const waveT = Object.fromEntries(waves);
  S.push({ id: 'S22', start: st('L20'), trans: 'cut', capY: 1650,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam, { dim: .25 }),
    cam: lt => { const k = smooth(clamp(lt / 2.6)); return camAt(lerp(470, 540, k), lerp(1150, 1080, k), lerp(1.3, 1.0, k)); },
    draw(ctx, T, lt) {
      const ps = lineup(ctx, T, (n, p) => {
        if (n === 'nubi') {
          const look = Math.sin((T - st('L20')) * 3.2);
          if (T > tReal) { p.bodyY -= 8 * pop(T - tReal); }
          return { ...NUBI(T), expr: T > tReal + .3 ? 'happy' : 'surprised', lookX: T < tReal + .3 ? .3 : look * .8, lookY: -.2 };
        }
        if (n === 'lily') return { hair: LILY_PINK, expr: 'happy' };
        if (n === 'brayden') return { hair: BRAY_PINK(T), expr: 'shy', blush: true };
        const t0 = waveT[n];
        if (t0 !== undefined) return { hair: T > t0 ? hairShift(CAST[n].hairC || '#6B3A1E', 'love', T, t0) : undefined, expr: T > t0 ? 'shy' : 'neutral', blush: T > t0 };
        return { expr: 'neutral' };
      });
      for (const [n, t0] of waves) { const p = ps[n]; hairPop(ctx, p.x, headY(n, p) - 30, 'love', T - t0, .7); }
      const np = ps.nubi; burst(ctx, np.x, headY('nubi', np) - 120, T - tReal, { kind: 'sparkle', n: 16, speed: 420, gravity: 0, life: .9, size: 24, seed: 4 });
    },
    sfx: [[tReal - st('L20'), 'magic', .55], [waves[0][1] - st('L20'), 'pop', .35], [waves[2][1] - st('L20'), 'pop', .35], [waves[4][1] - st('L20'), 'sparkle', .4]] });

  // ===== S23 — L21 "So why hide it?" Nubi stands tall, tosses the cap =====
  const tHide = ws('L21', 'hide');
  S.push({ id: 'S23', start: st('L21'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam),
    cam: lt => camAt(470, 1130, 1.45 + lt * .06),
    draw(ctx, T, lt) {
      const tossed = T > tHide;
      const ps = lineup(ctx, T, (n, p) => {
        if (n === 'nubi') {
          p.bodyY -= 10; p.squash = 1.04;
          if (!tossed) { p.armL = -.35; p.handL = 1.2; p.armR = .4 + 1.6 * smooth(inv(tHide - .35, tHide, T)); p.handR = -.3; }
          else { const u = clamp((T - tHide) / .25); p.armR = lerp(2.4, -.35, easeOut(u)); p.handR = lerp(-.3, 1.2, u); p.armL = -.35; p.handL = 1.2; }
          return { ...NUBI(T), expr: tossed ? 'determined' : 'happy', mouth: lipShape(T, ['L21']), holding: tossed ? null : { R: holdCap } };
        }
        if (n === 'lily') { p.view = 'q34'; p.flip = -1; return { hair: LILY_PINK, expr: 'happy', blush: true }; }
        if (n === 'brayden') return { hair: 'love', expr: 'shy', blush: true };
        return { hair: 'love', expr: 'happy' };
      });
      if (tossed) { const d = T - tHide, np = ps.nubi;
        ctx.save(); ctx.translate(np.x + 160 + d * 700, headY('nubi', np) - 120 - d * 900 + d * d * 900); ctx.rotate(d * 9); capShape(ctx); ctx.restore(); }
      hairPop(ctx, ps.nubi.x, headY('nubi', ps.nubi) - 40, 'love', T - tHide, .9);
    },
    sfx: [[tHide - st('L21'), 'whoosh', .6], [tHide - st('L21') + .1, 'swell', .45]] });

  // ===== S24 — L22 "Then Lily whispered... look at mine." =====
  const tWh = ws('L22', 'whispered'), tLook = ws('L22', 'look'), tMine = ws('L22', 'mine');
  S.push({ id: 'S24', start: st('L22'), trans: 'zoom', capY: 1700,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam, { dim: .2 }),
    cam: lt => camAt(540, 1140, 1.7 + lt * .05),
    draw(ctx, T, lt) {
      const lean = smooth(inv(tWh - .2, tWh + .3, T));
      const np = idle(P({ x: 430, y: 1500, s: .78, view: 'q34' }), T, 1); np.lean = -.04;
      const lookUp = T > tMine + .15;
      C(ctx, 'nubi', np, { ...NUBI(T), expr: lookUp ? 'surprised' : 'shy', lookY: lookUp ? -.5 : .5, lookX: lookUp ? .4 : .2, blush: true }, T);
      const lp = idle(P({ x: lerp(650, 610, lean), y: 1500, s: .78, view: 'q34', flip: -1 }), T, 2); lp.lean = .12 * lean;
      if (T > tMine) { lp.armR = 2.6; lp.handR = -.6; }
      C(ctx, 'lily', lp, { hair: LILY_PINK, expr: 'shy', mouth: T > tLook - .05 ? lipShape(T, ['L22']) : null, hairGlow: T > tMine, lookX: -.4 }, T);
      bubble(ctx, 'look at mine...', 720, 900, 640, 1010, T - tLook, { size: 52, dash: true, fill: '#FF4FA3' });
      burst(ctx, lp.x, headY('lily', lp) - 120, T - tMine, { kind: 'sparkle', n: 14, speed: 300, gravity: 0, life: 1, size: 20, seed: 9 });
    },
    ui(ctx, T) { pinkWash(ctx, .6 + .4 * smooth(inv(tMine, tMine + .4, T))); },
    sfx: [[tLook - st('L22'), 'chime', .5], [tMine - st('L22'), 'sparkle', .45]] });

  // ===== S25 — L23 "Her hair was pink. It had been pink all year." =====
  const tPink1 = ws('L23', 'pink'), tAll = ws('L23', 'all'), tBeen = ws('L23', 'been');
  S.push({ id: 'S25', start: st('L23'), trans: 'cut', capY: 1700,
    bg: (ctx, T) => envSoft(ctx, T, '#FFB3D1', '#FF4FA3'),
    cam: lt => camAt(540, 1140, 2.0 + lt * .06),
    draw(ctx, T, lt) {
      const lp = idle(P({ x: 540, y: 1500, s: .8 }), T, 2); lp.head = .06;
      C(ctx, 'lily', lp, { hair: LILY_PINK, hairGlow: true, expr: T > tBeen ? 'shy' : 'happy' }, T);
      hairPop(ctx, 540, headY('lily', lp) - 30, 'love', T - tPink1, .8);
    },
    ui(ctx, T) {
      // flashback inset: Lily pink next to Nubi, who stares at the floor (months tick by)
      const dt = T - tBeen; if (dt < 0) return;
      const k = pop(dt, .3);
      ctx.save(); ctx.translate(540, 470); ctx.rotate(-.04); ctx.scale(k, k);
      box(ctx, -330, -230, 660, 440, 18, '#FFFDF6', 9);
      ctx.save(); rr(ctx, -300, -200, 600, 330, 8); ctx.clip();
      ctx.fillStyle = '#7FB8E8'; ctx.fillRect(-300, -200, 600, 330); ctx.fillStyle = '#C9A06B'; ctx.fillRect(-300, 70, 600, 60);
      for (let i = 0; i < 5; i++) box(ctx, -290 + i * 120, -190, 100, 250, 6, '#4C7BC7', 5);
      const sc = .55; ctx.translate(0, 95); ctx.scale(sc, sc); ctx.translate(-540, -1500);
      const np = P({ x: 400, y: 1500, s: .8, view: 'q34' }); np.head = .25;
      drawCharacter(ctx, 'nubi', np, { ...NUBI(T), expr: 'sad', lookY: 1, lookX: .2 }, T);
      const lp = P({ x: 700, y: 1500, s: .8, view: 'q34', flip: -1 }); lp.armR = 2.4 + Math.sin(T * 12) * .3;
      drawCharacter(ctx, 'lily', lp, { hair: LILY_PINK, expr: 'happy', blush: true }, T);
      ctx.restore();
      const months = ['SEPT', 'NOV', 'FEB', 'MAY'], m = months[Math.min(3, Math.max(0, Math.floor((T - tAll) / .22)))];
      txt(ctx, T < tAll ? 'SEPT' : m, 0, 172, 56, '#FF4FA3', OUTLINE, 0);
      ctx.restore();
    },
    sfx: [[tPink1 - st('L23'), 'sparkle', .5], [tBeen - st('L23'), 'pop', .45]] });

  // ===== S26 — L24 "I just never looked up from my shoes." =====
  const tNever = ws('L24', 'never'), tShoes = ws('L24', 'shoes');
  S.push({ id: 'S26', start: st('L24'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const T = lt + st('L24'); const x = lerp(440, 640, inv(st('L24'), LINE.L24.end, T)), k = smooth(inv(tShoes - .1, tShoes + .3, T));
      return camAt(x + 80 * k, lerp(1110, 1240, k), lerp(1.3, 1.55, k)); },
    draw(ctx, T, lt) {
      const t0 = st('L24'), u = T - t0;
      const lp = walk(P({ x: 340 + u * 150, y: 1500, s: .78, view: 'q34' }), T, .9); lp.armR = 2.3 + Math.sin(T * 12) * .35; lp.handR = -.2;
      C(ctx, 'lily', lp, { hair: LILY_PINK, expr: 'happy', blush: true, mouth: 'smallOpen' }, T);
      const np = walk(P({ x: 640 + u * 150, y: 1500, s: .8, view: 'q34' }), T, .9); np.head = .28; np.lean = .08;
      C(ctx, 'nubi', np, { ...NUBI(T), expr: 'shy', lookY: 1, lookX: .3 }, T);
      if (T > tNever) { // dotted eye-line down to his shoes
        ctx.save(); ctx.globalAlpha *= smooth(inv(tNever, tNever + .3, T)); ctx.setLineDash([14, 14]); ctx.lineWidth = 6; ctx.strokeStyle = '#fff';
        ctx.beginPath(); ctx.moveTo(np.x + 50, headY('nubi', np) + 40); ctx.lineTo(np.x + 30, 1480); ctx.stroke(); ctx.restore(); }
      burst(ctx, lp.x + 60, headY('lily', lp) - 100, T - t0 - .3, { kind: 'heart', n: 6, speed: 200, gravity: -120, life: 1.2, size: 20, seed: 2 });
    },
    sfx: [[tShoes - st('L24'), 'sad_trombone', .3]] });

  // ===== S27 — L25 "Click. Best class photo ever." =====
  const tClick = ws('L25', 'click'), tBest = ws('L25', 'best');
  S.push({ id: 'S27', start: st('L25'), trans: 'flash', capY: 1700,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam),
    cam: lt => { const T = lt + st('L25'); return camAt(540, 1110, T < tClick ? 1.05 : 1.0 + (T - tClick) * .02); },
    draw(ctx, T, lt) {
      const Tf = Math.min(T, tClick + .02);   // freeze-frame at the click
      lineup(ctx, Tf, (n, p) => {
        celebrate(p, Tf, .35);
        if (n === 'nubi') { p.armR = 2.4; p.armL = .3; return { ...NUBI(T), expr: 'excited', lookX: .25 }; }
        if (n === 'lily') { p.armL = 2.4; p.armR = .3; return { hair: LILY_PINK, hairGlow: true, expr: 'happy', blush: true }; }
        if (n === 'brayden') { p.view = 'q34'; return { hair: 'love', expr: 'love', blush: true }; }
        if (n === 'kidC') { p.view = 'q34'; p.flip = -1; return { hair: 'love', expr: 'happy', blush: true }; }
        return { hair: 'love', expr: 'happy' };
      });
    },
    ui(ctx, T) {
      cameraFlash(ctx, T, tClick);
      const dt = T - tClick - .12; if (dt < 0) return;
      const k = 1 + .08 * (1 - pop(dt, .3));
      ctx.save(); ctx.translate(540, 960); ctx.scale(k, k); ctx.rotate(-.025 * pop(dt, .3)); ctx.translate(-540, -960);
      ctx.fillStyle = '#FFFDF6';
      ctx.fillRect(-200, -200, 1480, 470); ctx.fillRect(-200, 1460, 1480, 700); ctx.fillRect(-200, -200, 260, 2400); ctx.fillRect(1020, -200, 260, 2400);
      ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.strokeRect(60, 270, 960, 1190);
      txt(ctx, 'CLASS OF 6B', 540, 190, 70, '#FF4FA3', OUTLINE, 0);
      ctx.restore();
      burst(ctx, 540, 260, T - tBest, { kind: 'confetti', n: 40, speed: 900, angle: Math.PI / 2, spread: 2.4, gravity: 900, life: 1.4, size: 18, seed: 5 });
    },
    sfx: [[tClick - st('L25'), 'click', .7], [tBest - st('L25'), 'cheer', .45], [tBest - st('L25'), 'confetti', .4]] });

  // ===== S28 — L26 "Subscribe if your hair would go pink too." → push into Nubi's head (loops to S01) =====
  const tSub = ws('L26', 'subscribe'), tPinkEnd = ws('L26', 'pink'), tEnd = LINE.L26.end + .1;
  S.push({ id: 'S28', start: st('L26'), trans: 'cut', capY: 1720,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam),
    cam: lt => { const T = lt + st('L26'); const k = easeInOut(inv(tSub + .3, tEnd, T)); return camAt(lerp(540, 430, k), lerp(1110, 1140, k), lerp(1.25, 1.85, k)); },
    draw(ctx, T, lt) {
      const lp = idle(P({ x: 640, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 2); lp.lean = .05;
      C(ctx, 'lily', lp, { hair: LILY_PINK, hairGlow: true, expr: 'happy', blush: true, lookX: -.4 }, T);
      const np = idle(P({ x: 430, y: 1500, s: .8 }), T, 1);
      if (T > tPinkEnd) np.bodyY -= 14 * pop(T - tPinkEnd);
      C(ctx, 'nubi', np, { ...NUBI(T), expr: T > tPinkEnd ? 'excited' : 'happy', blush: true }, T);
      hairPop(ctx, np.x, headY('nubi', np) - 40, 'love', T - tPinkEnd, .9);
      burst(ctx, 540, 1000, T - st('L26') - .1, { kind: 'heart', n: 10, speed: 300, gravity: -150, life: 1.6, size: 22, seed: 11 });
    },
    ui(ctx, T) { drawSubscribe(ctx, T - tSub, 1.7, 1460); },
    sfx: [[tSub - st('L26') + .55, 'click', .6], [tPinkEnd - st('L26'), 'sparkle', .5]] });

  return S;
});
