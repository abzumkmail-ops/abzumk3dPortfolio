// shots/part3.js — S18–S25 (L17–L24): the gasp, the realization, "Lily, I like you", "...finally", hand-holding shadows, loop.
'use strict';
shots(() => {
  const S = [];
  const SY = 1190;                                   // stage floor
  const sx = (wx, c) => (wx - c.x) * c.z + 540;      // world x -> screen x for a camera
  // warm pool of light on the curtain behind a performer (world space, drawn before the shadow)
  const lightPool = (ctx, x, y, r, a = .5, col = '255,236,190') => { ctx.save(); const g = ctx.createRadialGradient(x, y, 30, x, y, r);
    g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(.7, `rgba(${col},${a * .55})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); };
  // Nubi's giant shadow on the curtain: same rig, feet on the stage floor
  const giant = (ctx, pose, T, o = {}) => shadowOf(ctx, 'nubi', Object.assign({}, pose, { y: SY }), T, Object.assign({ k: 2.5, alpha: .72, face: { hoodie: false } }, o));
  const steam = (ctx, x, y, dt, s = 1) => { if (dt < 0) return; for (let i = 0; i < 8; i++) { const side = i % 2 ? 1 : -1, ph = (dt * 1.4 + i / 8) % 1;
    if (dt < ph / 1.4) continue; ctx.save(); ctx.globalAlpha = (1 - ph) * .9; circle(ctx, x + side * (120 + ph * 70) * s, y - ph * 220 * s, (18 + ph * 34) * s, '#fff', 0); ctx.restore(); } };
  const micStand = (ctx, x, withMic) => { box(ctx, x - 60, SY - 14, 120, 20, 10, '#333', 6); box(ctx, x - 7, 870, 14, SY - 870, 5, '#555', 5);
    if (withMic) { ctx.save(); ctx.translate(x, 860); ctx.rotate(-.5); holdMic(ctx); ctx.restore(); } };

  // ===== S18 — Everyone gasped. (audience wide) =====
  const gaspT = ws('L17', 'gasped'), brayT = ws('L17', 'brayden'), turnT = ws('L17', 'turned'), redT = ws('L17', 'red');
  const cam18 = lt => camAt(520 + lt * 14, 1230, 1.18 + lt * .07);
  S.push({ id: 'S18', start: st('L17'), trans: 'cut', capY: 1650,
    bg: (ctx, T, cam) => envAudience(ctx, T, cam),
    cam: cam18,
    draw(ctx, T, lt) {
      const g = T - gaspT;
      [['kidF', 40], ['kidB', 270], ['kidD', 485], ['kidE', 700]].forEach(([n, x], i) => { const d = g - .04 * i; const p = idle(P({ x, y: 1390, s: .6 }), T, i + 2);
        if (d > 0) surprise(p, d); C(ctx, n, p, { expr: d > 0 ? 'surprised' : 'neutral', mouth: d > 0 ? 'round' : null, lookX: .8 }, T); });
      [['kidA', 160], ['lily', 375], ['kidC', 590]].forEach(([n, x], i) => { const d = g - .06 * i; const p = idle(P({ x, y: 1500, s: .74 }), T, i + 7);
        if (d > 0) surprise(p, d); C(ctx, n, p, { expr: d > 0 ? 'surprised' : 'neutral', mouth: d > 0 ? 'round' : null, lookX: .8, holding: n === 'lily' ? { R: holdBook } : undefined }, T); });
      const bp = idle(P({ x: 860, y: 1540, s: .8, view: 'q34', flip: -1 }), T, 3, .5); bp.armL = 2.5; bp.armR = 2.3; bp.handL = .9; bp.handR = .9; bp.head = .06;
      C(ctx, 'brayden', bp, { expr: 'nervous', red: .35 * smooth(inv(gaspT, brayT, T)), lookX: -.5 }, T);
    },
    ui(ctx, T, lt) { spotlight(ctx, sx(860, cam18(lt)), .32); },
    sfx: [[gaspT - st('L17'), 'scratch', .5]] });

  // ===== S18b — Brayden turned bright red. (close-up; split from S18 so the red has time to read) =====
  S.push({ id: 'S18b', start: brayT - .08, trans: 'zoom', capY: 1690,
    bg: (ctx, T, cam) => { envAudience(ctx, T, cam); const k = smooth(inv(redT - .05, redT + .15, T));
      if (k > 0) { ctx.save(); ctx.globalAlpha = k * .85; ctx.translate(cam.x - 540, cam.y - 900); envBurst(ctx, T, '#FF8A8A', '#EE384A', .4); ctx.restore(); } },
    cam: lt => { const T = lt + brayT - .08; const sh = T > redT ? Math.sin(T * 60) * 9 * Math.exp(-(T - redT) * 4) : 0; return camAt(540 + sh, 1130, 2.15 + lt * .08); },
    draw(ctx, T, lt) {
      const bp = idle(P({ x: 540, y: 1500, s: .8 }), T, 3, .5);
      const r = smooth(inv(turnT, redT + .1, T)); bp.armL = 2.75; bp.armR = 2.75; bp.handL = 1.4; bp.handR = 1.4;
      if (T > redT) { bp.squash = 1 + .05 * Math.sin((T - redT) * 40) * Math.exp(-(T - redT) * 5); bp.headY = -6 * spring(T - redT); }
      C(ctx, 'brayden', bp, { expr: T > redT ? 'crying' : 'nervous', red: r, sweat: true }, T);
      steam(ctx, 540, 1060, T - redT, 1);
    },
    ui(ctx, T) { spotlight(ctx, 540, .28); vignette(ctx, .55 * smooth(inv(turnT, redT, T)), '238,56,74'); },
    sfx: [[redT - brayT + .08, 'poof', .6]] });

  // ===== S19 — That's when I realized something. Shadows only say what you hide. =====
  const realT = ws('L18', 'realized'), hideT = ws('L18', 'hide'), shadT = ws('L18', 'shadows');
  const cam19 = lt => camAt(540, 980 - lt * 12, .85 + lt * .045);
  S.push({ id: 'S19', start: st('L18'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envStage(ctx, T, cam, { dim: .7 }),
    cam: cam19,
    draw(ctx, T, lt) {
      lightPool(ctx, 540, 820, 760, .32);
      const turned = T > realT + .05;
      const np = idle(P({ x: 560, y: SY, s: .8, view: turned ? 'q34' : 'back', flip: -1 }), T, 1, .4);
      if (!turned) np.head = -.12; else np.headY = -8 * spring(T - realT);
      // the shadow looks gently down at him; happy eyes on "hide"
      const sp = idle(P({ x: 560, y: SY, s: .8 }), T, 4, .5); sp.head = .14 + Math.sin(T * 1.2) * .03; sp.armL = .25; sp.armR = .25;
      giant(ctx, sp, T, { eyes: T > hideT ? 'happy' : 'normal', mouth: T > hideT ? 'smile' : 'closed' });
      C(ctx, 'nubi', np, { expr: turned ? (T > hideT ? 'happy' : 'surprised') : 'sad', hoodie: false, lookY: -1, lookX: turned ? -.6 : 0 }, T);
      burst(ctx, 680, 790, T - realT, { kind: 'sparkle', n: 12, speed: 650, gravity: 0, life: .8, size: 28, colors: ['#FFD447', '#fff'] });
      burst(ctx, 560, 380, T - hideT, { kind: 'sparkle', n: 10, speed: 500, gravity: 0, life: .9, size: 24, colors: ['#B9A6FF', '#fff'] });
    },
    ui(ctx, T, lt) { spotlight(ctx, sx(560, cam19(lt)), .42); },
    sfx: [[realT - st('L18'), 'magic', .55], [hideT - st('L18'), 'sparkle', .35]] });

  // ===== S20 — So I stopped hiding. (turns to the audience, steps forward; shadow copies him) =====
  const stopT = ws('L19', 'stopped'), hidingT = ws('L19', 'hiding');
  const cam20 = lt => camAt(540, 830 - lt * 10, 1.14 + lt * .05);
  S.push({ id: 'S20', start: st('L19'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envStage(ctx, T, cam, { dim: .6 }),
    cam: cam20,
    draw(ctx, T, lt) {
      lightPool(ctx, 540, 760, 700, .3);
      const u = inv(stopT - .05, hidingT + .15, T), front = T > stopT - .1;
      const np = P({ x: 540, y: SY + 18 * easeOut(u), s: .8 + .03 * easeOut(u), view: front ? 'front' : 'q34', flip: -1 });
      if (u > 0 && u < 1) walk(np, T, 1.8, .7); else idle(np, T, 1, .5);
      if (T > hidingT) { const k = spring(T - hidingT); np.armL = .28 * k; np.armR = .28 * k; np.headY = -6 * k; }
      giant(ctx, np, T, { eyes: T > hidingT ? 'normal' : 'happy' });
      C(ctx, 'nubi', np, { expr: front ? 'determined' : 'happy', hoodie: false, lookY: front ? 0 : -1 }, T);
      burst(ctx, 540, SY, T - hidingT, { kind: 'dust', n: 12, speed: 380, gravity: 0, life: .45, size: 18, angle: Math.PI, spread: .6, seed: 3 }); burst(ctx, 540, SY, T - hidingT, { kind: 'dust', n: 12, speed: 380, gravity: 0, life: .45, size: 18, angle: 0, spread: .6, colors: ['#fff', '#FFE6BD'] });
    },
    ui(ctx, T, lt) { spotlight(ctx, sx(540, cam20(lt)), .4); },
    sfx: [[stopT - st('L19'), 'step', .5], [hidingT - st('L19'), 'swell', .55]] });

  // ===== S21 — I grabbed the mic and said it myself. Lily, I like you. =====
  const grabT = ws('L20', 'grabbed'), micT = ws('L20', 'mic'), lilyT = ws('L20', 'lily'), likeT = ws('L20', 'like'), youT = ws('L20', 'you');
  S.push({ id: 'S21', start: st('L20'), trans: 'zoom', capY: 1690,
    bg: (ctx, T, cam) => envStage(ctx, T, cam, { dim: .6 }),
    cam: lt => { const T = lt + st('L20'); const k = easeInOut(inv(st('L20'), lilyT, T)); return camAt(lerp(570, 545, k), lerp(910, 850, k), lerp(1.75, 2.1, k) + lt * .03); },
    draw(ctx, T, lt) {
      lightPool(ctx, 540, 760, 700, .3);
      const has = T > micT;
      const np = idle(P({ x: 520, y: SY, s: .8, view: 'q34' }), T, 1, .5);
      const reach = smooth(inv(grabT, micT, T));
      if (!has) { np.armR = .1 + 1.5 * reach; np.handR = -.3 * reach; }
      else { const k = smooth(inv(micT, micT + .25, T)); np.armR = lerp(1.6, 1.25, k); np.handR = lerp(-.3, -1.0, k); }
      giant(ctx, np, T, { eyes: T > lilyT ? 'happy' : 'normal' });
      micStand(ctx, 690, !has);
      const fc = T > lilyT ? 'shy' : 'determined';
      C(ctx, 'nubi', np, { expr: fc, hoodie: false, blush: T > lilyT, mouth: lipShape(T, ['L20']), holding: has ? { R: holdMic } : undefined }, T);
      burst(ctx, 380, 690, T - youT, { kind: 'heart', n: 12, speed: 520, gravity: -220, life: 1.1, size: 26, angle: -Math.PI / 2, spread: 2.2 });
      burst(ctx, 700, 690, T - youT - .05, { kind: 'heart', n: 10, speed: 480, gravity: -220, life: 1.1, size: 24, angle: -Math.PI / 2, spread: 2.2, seed: 5 });
    },
    ui(ctx, T) { spotlight(ctx, 540, .36, T > lilyT ? '255,190,225' : '255,240,200'); },
    sfx: [[micT - st('L20'), 'click', .4], [lilyT - st('L20'), 'swell', .6], [youT - st('L20'), 'sparkle', .45]] });

  // ===== S22 — My shadow just shrugged. Yeah, what he said. =====
  const shrugT = ws('L21', 'shrugged'), yeahT = ws('L21', 'yeah');
  const cam22 = lt => camAt(540, 905 - lt * 8, 1.0 + lt * .03);
  S.push({ id: 'S22', start: st('L21'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envStage(ctx, T, cam, { dim: .6 }),
    cam: cam22,
    draw(ctx, T, lt) {
      lightPool(ctx, 520, 760, 780, .34);
      const np = idle(P({ x: 600, y: SY, s: .8, view: 'q34', flip: -1 }), T, 1, .5); np.armR = 1.3; np.handR = -1.0;
      // the shadow ignores Nubi's pose: a big shrug, hands out
      const sp = idle(P({ x: 600, y: SY, s: .8 }), T, 4, .4); const k = spring(T - shrugT) * (T > shrugT ? 1 : 0);
      sp.armL = .25 + .75 * k; sp.armR = .25 + .75 * k; sp.handL = -1.0 * k; sp.handR = -1.0 * k; sp.head = .16 * k; sp.headY = 10 * k; sp.bodyY -= 8 * k;
      if (T > yeahT) talk(sp, T, 4, .3);
      giant(ctx, sp, T, { dx: -80, eyes: T > shrugT ? 'closed' : 'normal', lines: T > yeahT - .03 ? ['L21'] : null, mouth: T > yeahT - .03 ? null : (T > shrugT ? 'smile' : 'closed') });
      C(ctx, 'nubi', np, { expr: T > shrugT ? 'shy' : 'happy', hoodie: false, blush: T > shrugT, lookY: T > shrugT ? -.8 : 0, lookX: -.4, holding: { R: holdMic } }, T);
    },
    ui(ctx, T, lt) { spotlight(ctx, sx(560, cam22(lt)), .38);
      ctx.save(); ctx.shadowColor = '#B9A6FF'; ctx.shadowBlur = 40; speechBubble(ctx, 540, 600, 'YEAH, WHAT HE SAID.', T - yeahT, { size: 62, dark: true, tail: -40, rot: -.04 }); ctx.restore(); },
    sfx: [[shrugT - st('L21'), 'boing', .5], [yeahT - st('L21'), 'pop', .4]] });

  // ===== S23 — Then Lily's shadow whispered... finally. =====
  const lsT = ws('L22', "lily's"), whispT = ws('L22', 'whispered'), finT = ws('L22', 'finally');
  S.push({ id: 'S23', start: st('L22'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => envAudience(ctx, T, cam),
    cam: lt => camAt(560 + lt * 10, 1150, 1.45 + lt * .05),
    draw(ctx, T, lt) {
      // pink glow on the wall behind her
      lightPool(ctx, 600, 1150, 650, .45, '255,140,200');
      const u = inv(lsT - .1, lsT + .35, T);
      const lp = idle(P({ x: 380, y: 1500, s: .8 }), T, 2, .6); lp.squash = lerp(.84, 1, easeOut(u)) + (u > 0 && u < 1 ? .04 * Math.sin(u * Math.PI) : 0);
      lp.armL = .05; lp.armR = .05; lp.head = .08;
      // her shadow (on the wall, behind everyone) leans in to whisper
      const lean = smooth(inv(whispT - .1, finT, T));
      const sp = Object.assign({}, lp, { view: 'q34', head: .15 * lean, armL: .3, armR: .3 + 1.9 * lean, handR: -1.2 * lean });
      shadowOf(ctx, 'lily', sp, T, { k: 1.4, dx: 240, alpha: .66, skew: -.22 * lean, eyes: T > finT + .2 ? 'happy' : 'shy', lines: ['L22'] });
      const kd = idle(P({ x: 170, y: 1390, s: .6 }), T, 5); C(ctx, 'kidD', kd, { expr: T > finT ? 'surprised' : 'happy', lookX: .8 }, T);
      const kf = idle(P({ x: 960, y: 1390, s: .6 }), T, 6); C(ctx, 'kidF', kf, { expr: T > finT ? 'surprised' : 'happy', lookX: -.8 }, T);
      C(ctx, 'lily', lp, { expr: 'shy', blush: true, lookY: .4, holding: { R: holdBook } }, T);
      burst(ctx, 820, 800, T - finT, { kind: 'heart', n: 16, speed: 600, gravity: -180, life: 1.2, size: 26 });
    },
    ui(ctx, T) { ctx.save(); ctx.shadowColor = '#FFB3D1'; ctx.shadowBlur = 30; speechBubble(ctx, 790, 640, '...finally ♥', T - finT, { size: 50, dark: true, tail: -90, rot: .05 }); ctx.restore(); },
    sfx: [[lsT - st('L22'), 'chime', .45], [finT - st('L22'), 'sparkle', .55]] });

  // ===== S24 — Now we walk in the sun together. Our shadows hold hands. =====
  const sunT = ws('L23', 'sun'), togT = ws('L23', 'together'), holdT = ws('L23', 'hold'), handsT = ws('L23', 'hands');
  const WY = 1660, SK = 1.7, SDX = 30;                                   // they walk on the grass; their shadows climb the fence (base y 1500)
  const x24 = T => 290 + (T - st('L23')) * 110;
  const cam24 = lt => { const T = lt + st('L23'); return camAt(x24(T) + 210, 1130, 1.0 + lt * .03); };
  S.push({ id: 'S24', start: st('L23'), trans: 'whip', capY: 1660,
    bg: (ctx, T, cam) => envBackyard(ctx, T, cam),
    cam: cam24,
    draw(ctx, T, lt) {
      const c = cam24(lt), nx = x24(T), lx = nx + 380;
      // sun
      const sxw = c.x - 330, syw = c.y - 800;
      ctx.save(); ctx.translate(sxw, syw); ctx.rotate(T * .4); for (let i = 0; i < 10; i++) { ctx.rotate(TAU / 10); box(ctx, 120, -12, 70, 24, 12, '#FFD447', 0); } ctx.restore();
      circle(ctx, sxw, syw, 100, '#FFD447', 9);
      burst(ctx, sxw, syw, T - sunT, { kind: 'sparkle', n: 10, speed: 500, gravity: 0, life: .7, size: 26 });
      const np = walk(P({ x: nx, y: WY, s: .8, view: 'q34' }), T, 1.1);
      const lp = walk(P({ x: lx, y: WY, s: .78, view: 'q34' }), T + .08, 1.1);
      // shadows on the fence: arms reach until the hands meet on "hold"
      const r = smooth(inv(holdT - .3, holdT + .05, T));
      // front-view silhouettes: Nubi's shadow reaches out with armL (screen right), Lily's with armR (screen left)
      const ns = walk(P({ x: nx, y: 1500, s: .8 }), T, 1.1); ns.armL = lerp(ns.armL, .6, r); ns.handL = lerp(0, .5, r);
      const ls = walk(P({ x: lx, y: 1500, s: .78 }), T + .08, 1.1); ls.armR = lerp(ls.armR, .6, r); ls.handR = lerp(0, .5, r);
      shadowOf(ctx, 'nubi', ns, T, { k: SK, dx: SDX, alpha: .5, eyes: T > holdT ? 'happy' : 'normal', face: { hoodie: false } });
      shadowOf(ctx, 'lily', ls, T, { k: SK, dx: SDX, alpha: .5, eyes: T > holdT ? 'happy' : 'shy', seed: 3 });
      const hx = (nx + lx) / 2 + SDX, hy = 1300;
      if (T > handsT - .1) { ctx.save(); ctx.translate(hx, hy - 260 - (T - handsT) * 40); const s = pop(T - handsT + .1); ctx.scale(s, s);
        heartPath(ctx, 0, 0, 40); fillStroke(ctx, '#FF5B9B', 7); ctx.restore(); }
      C(ctx, 'nubi', np, { expr: 'shy', hoodie: false, blush: true, lookX: .6, lookY: .2 }, T);
      C(ctx, 'lily', lp, { expr: 'shy', blush: true, lookX: -.6, lookY: .3 }, T);
      burst(ctx, hx, hy - 280, T - handsT, { kind: 'heart', n: 12, speed: 450, gravity: -200, life: 1.1, size: 22 });
    },
    sfx: [[togT - st('L23'), 'swell', .55], [handsT - st('L23'), 'chime', .5]] });

  // ===== S25 — Subscribe if your shadow knows your secret too. (push into the shadow's face -> loops to S01) =====
  const knowsT = ws('L24', 'knows'), secT = ws('L24', 'secret');
  const nx25 = T => 300 + (T - st('L24')) * 55;
  const FY25 = 1500 - 429 * .8 * 1.6;                                      // shadow face height on the lockers
  const cam25 = lt => { const T = lt + st('L24'); const k = easeInOut(inv(st('L24') + .3, END, T)); const fx = nx25(T) + 110;
    return camAt(lerp(560, fx, k), lerp(1060, FY25 + 10, k), lerp(1.0, 1.7, k)); };
  S.push({ id: 'S25', start: st('L24'), trans: 'cut', capY: 1720,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: cam25,
    draw(ctx, T, lt) {
      const np = walk(P({ x: nx25(T), y: 1500, s: .8, view: 'q34' }), T, .9, .8); np.lean -= .06;
      shadowOf(ctx, 'nubi', np, T, { k: 1.6, dx: 110, alpha: .45, eyes: 'happy', mouth: 'smile', face: { hoodie: false } });
      C(ctx, 'nubi', np, { expr: 'happy', hoodie: false }, T);
      burst(ctx, nx25(T) + 250, 640, T - knowsT, { kind: 'heart', n: 8, speed: 380, gravity: -160, life: 1, size: 22 });
    },
    ui(ctx, T, lt) { drawSubscribe(ctx, lt - .05, 1.4);
      const c = cam25(lt), bx = sx(nx25(T) + 190, c), by = (FY25 - 250 - c.y) * c.z + 960;
      ctx.save(); ctx.shadowColor = '#FFB3D1'; ctx.shadowBlur = 30; speechBubble(ctx, bx, by, '♥ LILY', T - knowsT, { size: 66, dark: true, tail: -70 }); ctx.restore(); },
    sfx: [[.6, 'click', .5], [knowsT - st('L24'), 'pop', .45], [secT - st('L24'), 'whoosh', .4]] });

  return S;
});
