// shots/part2.js — S12–S22, lines L9–L16 (the dance, the L stamps, the blackout, the realization).
'use strict';
shots(() => {
  const S = [];

  // inset window used in S13: sunny, then it pours
  function drawWindow(ctx, T, tPour) {
    const x = 300, y = 300, w = 480, h = 400, wet = T >= tPour - .05;
    box(ctx, x - 14, y - 14, w + 28, h + 28, 18, '#cfd6e6', 8);
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = wet ? '#46567a' : '#8fd3ff'; ctx.fillRect(x, y, w, h);
    if (!wet) { ellipse(ctx, x + 370, y + 95, 56 + Math.sin(T * 3) * 3, 56 + Math.sin(T * 3) * 3, '#FFD447', 6); }
    else {
      for (const [cx, cy, r] of [[x + 110, y + 60, 80], [x + 230, y + 40, 95], [x + 360, y + 70, 85]]) ellipse(ctx, cx, cy, r, r * .55, '#2f3a58', 0);
      rain(ctx, T, 1, x, x + w, y, y + h);
    }
    ctx.restore();
    ctx.strokeStyle = OUTLINE; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.stroke();
    if (wet) txt(ctx, 'POURING', x + w / 2, y + h + 70, 54, '#9fd0ff', OUTLINE, 9);
  }

  // ===== S12 — Brayden dares him (L9) =====
  const tGlowing = ws('L9', 'glowing');
  S.push({ id: 'S12', start: st('L9'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => camAt(540, 1110, 2.0 + lt * .06),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .84 }), T, 3), T, 3, .4);
      if (T > tGlowing - .15) { p.armR = 1.5; p.armL = 1.5; p.handR = Math.sin(T * 38) * .7; p.handL = -Math.sin(T * 38) * .7; }
      C(ctx, 'brayden', p, { expr: 'smug', mouth: lipShape(T, ['L9']) }, T);
    },
    ui(ctx, T) { if (T > tGlowing) popText(ctx, '*glowing*', 800, 560, T - tGlowing, { size: 70, fill: '#FF5B5B', rot: .12, dur: 1.0 }); },
    sfx: [] });

  // ===== S13 — "Nice weather, huh? It was pouring." =====
  const tPour = ws('L10', 'pouring'), tGlow = ws('L10', 'glow');
  S.push({ id: 'S13', start: st('L10'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => camAt(540, 1010, 1.2 + lt * .03),
    draw(ctx, T, lt) {
      drawWindow(ctx, T, tPour);
      const hp = talk(idle(P({ x: 340, y: 1500, s: .8, view: 'q34' }), T, 1), T, 1, .4);
      C(ctx, 'nubi', hp, { expr: T > tPour ? 'nervous' : 'happy', mouth: lipShape(T, ['L10']), sweat: T > tPour }, T);
      const lp = idle(P({ x: 740, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 2);
      C(ctx, 'lily', lp, { expr: T > tPour ? 'confused' : 'shy', lookY: T > tPour ? -.4 : 0 }, T);
    },
    sfx: [[tPour - st('L10') - .05, 'thud', .3]] });

  // ===== S14 — "Glow." L #1 =====
  S.push({ id: 'S14', start: tGlow - .08, trans: 'zoom', capY: 1700,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => camAt(540, 1110, 2.1 + lt * .06),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); if (T > tGlow) surprise(p, T - tGlow);
      C(ctx, 'nubi', p, { expr: T > tGlow ? 'sad' : 'nervous', sweat: true, mouth: lipShape(T, ['L10']) }, T);
      noseGlow(ctx, 'nubi', p, .7 * clamp((T - tGlow) * 8), T);
    },
    ui(ctx, T) { stamp(ctx, 'L', 540, 600, T - tGlow - .1, '#EE384A', 1.0); },
    sfx: [[.1, 'sad_trombone', .5]] });

  // ===== S15 — "I'm totally relaxed. Brighter." L #2 =====
  const tBright = ws('L11', 'brighter');
  S.push({ id: 'S15', start: st('L11'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => camAt(540, 1060, 1.35 + lt * .03),
    draw(ctx, T, lt) {
      const hp = talk(idle(P({ x: 340, y: 1500, s: .8, view: 'q34' }), T, 1), T, 1, .5); hp.armL = .5;
      C(ctx, 'nubi', hp, { expr: 'nervous', sweat: true, mouth: lipShape(T, ['L11']) }, T);
      noseGlow(ctx, 'nubi', hp, lerp(.7, 1.2, smooth(inv(tBright, tBright + .25, T))), T);
      const lp = idle(P({ x: 740, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 2);
      const sq = T > tBright;
      C(ctx, 'lily', lp, { expr: 'neutral', eyes: { open: sq ? .3 : 1 }, lookX: -.3 }, T);
    },
    ui(ctx, T) { stamp(ctx, 'L', 540, 560, T - tBright - .1, '#EE384A', 1.4); },
    sfx: [[tBright - st('L11'), 'buzz', .5]] });

  // ===== S16 — "I definitely didn't practice this." =====
  const tPrac = ws('L12', 'practice');
  S.push({ id: 'S16', start: st('L12'), trans: 'cut', capY: 1700,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => camAt(540, 1130, 2.0 + lt * .07),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .8 }), T, 1), T, 1, .5);
      C(ctx, 'nubi', p, { expr: 'nervous', sweat: true, mouth: lipShape(T, ['L12']), lookX: T > tPrac ? .4 : 0 }, T);
      noseGlow(ctx, 'nubi', p, lerp(1.2, 1.8, smooth(inv(tPrac, tPrac + .2, T))), T);
    },
    ui(ctx, T) {
      if (T > tPrac) popText(ctx, 'LIES', 800, 520, T - tPrac, { size: 80, fill: '#FF5B5B', rot: .1, dur: 1.0 });
    },
    sfx: [[tPrac - st('L12'), 'power', .5]] });

  // ===== S17 — Lily puts on sunglasses. L #3 =====
  const tShade = ws('L12', 'sunglasses');
  S.push({ id: 'S17', start: ws('L12', 'lily') - .08, trans: 'zoom', capY: 1700,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => camAt(540, 1110, 2.1 + lt * .05),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 2);
      if (T < tShade) { p.armR = lerp(.2, 1.9, smooth(inv(tShade - .5, tShade - .05, T))); p.handR = -1; }
      else p.armR = lerp(1.9, .2, smooth(inv(tShade + .2, tShade + .6, T)));
      C(ctx, 'lily', p, { expr: 'neutral', mouth: 'flat', noBlink: true }, T);
      if (T >= tShade) { ctx.save(); ctx.translate(0, -lerp(160, 0, easeOut(inv(tShade, tShade + .15, T)))); drawShades(ctx, 'lily', p); ctx.restore(); }
    },
    ui(ctx, T) { stamp(ctx, 'L', 540, 560, T - tShade - .1, '#EE384A', 1.9); },
    sfx: [[tShade - (ws('L12', 'lily') - .08), 'bling', .7]] });

  // ===== S18 — Subscribe CTA, lights out =====
  const tOut = ws('L13', 'out');
  S.push({ id: 'S18', start: st('L13'), trans: 'cut', capY: 1720,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => { const T = lt + st('L13'); const sh = T > tOut ? Math.sin(T * 70) * 8 * Math.exp(-(T - tOut) * 6) : 0; return camAt(540 + sh, 1060, 1.35 + lt * .02); },
    draw(ctx, T, lt) {
      const hp = idle(P({ x: 340, y: 1500, s: .8, view: 'q34' }), T, 1); if (T > tOut) surprise(hp, T - tOut);
      C(ctx, 'nubi', hp, { expr: T > tOut ? 'terrified' : 'nervous', sweat: true }, T);
      const lp = idle(P({ x: 740, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 2);
      C(ctx, 'lily', lp, { expr: 'neutral', mouth: 'flat' }, T); drawShades(ctx, 'lily', lp);
      blackout(ctx, gymDark(T));
      const amt = T < tOut ? 1.0 : .45 * (1 - smooth(inv(tOut + .3, tOut + 1.3, T)));
      noseGlow(ctx, 'nubi', hp, amt, T);
    },
    ui(ctx, T, lt) { drawSubscribe(ctx, lt - .05, 1.6, 1460); },
    sfx: [[tOut - st('L13'), 'thud', .8], [tOut - st('L13'), 'glitch', .4]] });

  // ===== S19 — Total darkness, someone screamed =====
  const tScream = ws('L14', 'screamed');
  S.push({ id: 'S19', start: st('L14'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { noLights: true }),
    cam: lt => camAt(540, 1060, 1.0 + lt * .02),
    draw(ctx, T, lt) {
      const crowd = [['kidA', 140, 1500, .74, 'front'], ['kidB', 240, 1390, .6, 'front'], ['kidD', 640, 1390, .6, 'front'], ['kidE', 840, 1390, .6, 'front'], ['lily', 740, 1500, .8, 'front'], ['kidC', 940, 1500, .74, 'front']];
      for (const [n, x, y, s] of crowd) C(ctx, n, idle(P({ x, y, s }), T, x), { expr: 'nervous' }, T);
      const bp = idle(P({ x: 340, y: 1500, s: .84 }), T, 3); if (T > tScream) { bp.armL = 2.0; bp.armR = 2.0; bp.bodyY -= 14 * Math.abs(Math.sin((T - tScream) * 20)); }
      C(ctx, 'brayden', bp, { expr: 'nervous' }, T);
      C(ctx, 'nubi', idle(P({ x: 540, y: 1500, s: .8 }), T, 1), { expr: 'nervous', sweat: true }, T);
      blackout(ctx, .9);
      // Brayden's scream pops through the dark for a moment
      if (T > tScream && T < tScream + .7) { const bp2 = idle(P({ x: 340, y: 1500, s: .84 }), T, 3); bp2.armL = 2.0; bp2.armR = 2.0; bp2.bodyY -= 14 * Math.abs(Math.sin((T - tScream) * 20)); C(ctx, 'brayden', bp2, { expr: 'screaming' }, T); }
    },
    ui(ctx, T) {
      if (T > tScream && T < tScream + .1) { ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
      if (T > tScream) popText(ctx, 'AAAAH!', 330, 760, T - tScream, { size: 110, fill: '#FFFFFF', rot: -.1, dur: 1.2 });
    },
    sfx: [[tScream - st('L14'), 'impact', .7]] });

  // ===== S20 — It was Brayden. Bruh stare. =====
  const tIt = ws('L14', 'it');
  S.push({ id: 'S20', start: tIt - .08, trans: 'zoom', capY: 1700,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { noLights: true }),
    cam: lt => camAt(540, 1110, 2.3 + lt * .03),
    draw(ctx, T, lt) {
      const p = P({ x: 540, y: 1500, s: .8 }); idle(p, T, 1, .3);
      C(ctx, 'nubi', p, { expr: 'neutral', mouth: 'flat', noBlink: true, eyes: { open: .75 } }, T);
      blackout(ctx, .75);
    },
    ui(ctx, T) { const t0 = tIt + .5; if (T > t0) popText(ctx, 'bruh.', 540, 500, T - t0, { size: 90, fill: '#FFFFFF', dur: 2.5 }); },
    sfx: [[0, 'impact', .7]] });

  // ===== S21 — "I'm not scared! His nose? Birthday candle." =====
  const tScared = ws('L15', 'scared'), tCandle = ws('L15', 'candle');
  S.push({ id: 'S21', start: st('L15'), trans: 'cut', capY: 1700,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { noLights: true }),
    cam: lt => camAt(540, 1130, 2.0 + lt * .05),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .84 }), T, 3), T, 3, .4);
      C(ctx, 'brayden', p, { expr: 'terrified', sweat: true, mouth: lipShape(T, ['L15']) }, T);
      blackout(ctx, .72);
      if (T > tScared) noseGlow(ctx, 'brayden', p, .25 + .06 * Math.sin(T * 17), T);
      if (T > tCandle) { // little candle flame on the nose
        const n = noseAt('brayden', p), k = n.k, fl = 1 + .12 * Math.sin(T * 25);
        ctx.save(); ctx.translate(n.x, n.y - 30 * k); ctx.scale(fl, fl);
        ctx.beginPath(); ctx.moveTo(0, -46 * k); ctx.quadraticCurveTo(22 * k, -12 * k, 0, 8 * k); ctx.quadraticCurveTo(-22 * k, -12 * k, 0, -46 * k); fillStroke(ctx, '#FFD447', 4);
        ctx.restore();
      }
    },
    ui(ctx, T) { if (T > tCandle) popText(ctx, 'BIRTHDAY CANDLE', 540, 560, T - tCandle, { size: 72, fill: '#FFD447', dur: 1.8 }); },
    sfx: [[tCandle - st('L15'), 'sad_trombone', .5]] });

  // ===== S22 — "That's when I realized something." =====
  const tReal = ws('L16', 'realized');
  S.push({ id: 'S22', start: st('L16'), trans: 'cut', capY: 1700,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { noLights: true }),
    cam: lt => camAt(540, 1115, 1.9 + lt * .12),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .8 }), T, 1), T, 1, .3); if (T > tReal) surprise(p, T - tReal);
      C(ctx, 'nubi', p, { expr: T > tReal ? 'surprised' : 'determined', mouth: lipShape(T, ['L16']) }, T);
      blackout(ctx, .85);
      if (T > tReal) { // eyes catch a light
        for (const sx of [-1, 1]) { const k = clamp((T - tReal) * 5); ellipse(ctx, 540 + sx * 50, 1180, 10 * k, 10 * k, 'rgba(255,255,255,.9)', 0); }
      }
      burst(ctx, 800, 1090, T - tReal, { kind: 'sparkle', n: 24, speed: 500, gravity: 100, life: 1.0, size: 20, seed: 7 });
    },
    sfx: [[tReal - st('L16'), 'chime', .6]] });

  return S;
});
