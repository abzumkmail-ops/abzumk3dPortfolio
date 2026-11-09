// shots/part3.js — s17–s24 (L16–L23)
'use strict';
shots(() => {
  const S = [];
  const GOLD = '#FFC531', GREY = '#9AA3AD';
  // world -> screen for a camera [cx, cy, z]
  const prj = (c, x, y) => [540 + (x - c[0]) * c[2], 960 + (y - c[1]) * c[2]];
  const th = (p, hy = 400) => [p.x, p.y - hy * p.s]; // head world pos
  const seatBg = (dark) => (ctx, T, cam) => envMovieTheater(ctx, T, cam, { dark: dark });
  const bulb = (ctx, x, y, t) => { // lightbulb pop
    if (t < 0) return; const k = Math.min(1, t / .25), sc = (1 + .25 * Math.sin(k * Math.PI)) * (t < .25 ? k : 1);
    ctx.save(); ctx.translate(x, y); ctx.scale(sc * 1.6, sc * 1.6);
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.strokeStyle = '#FFD447'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 46, Math.sin(a) * 46); ctx.lineTo(Math.cos(a) * 64, Math.sin(a) * 64); ctx.stroke(); }
    ctx.fillStyle = '#FFF3A0'; ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 34, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#9AA3AD'; ctx.beginPath(); ctx.roundRect(-16, 30, 32, 22, 6); ctx.fill(); ctx.stroke(); ctx.restore();
  };

  // ===== s17 — L16 realized, dark theater, kernel glinting =====
  const real = ws('L16', 'realized');
  S.push({ id: 's17', start: st('L16'), trans: 'cut', capY: 1680,
    bg: seatBg(.8),
    cam: lt => camAt(620, 1230, 1.25 + lt * .04),
    draw(ctx, T, lt) {
      const sp = idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 5);
      C(ctx, 'teenSister', sp, { expr: 'happy', holding: { R: holdPopcorn } }, T);
      const np = idle(P({ x: 560, y: 1500, s: .8 }), T, 1); np.head = T > real ? 0 : .18;
      C(ctx, 'nubi', np, { expr: T > real ? 'surprised' : 'sad', lookY: T > real ? -.2 : .8, lookX: .4 }, T);
      envMovieTheaterFront(ctx, T, null, {});
      kernel(ctx, 760, 1545, .9, .55 + .45 * Math.sin(T * 6));
    },
    ui(ctx, T, lt) {
      const c = [620, 1230, 1.25 + lt * .04]; const [hx, hy] = prj(c, 560, 1500 - 400 * .8);
      spotlight(ctx, [{ x: prj(c, 560, 1260)[0], y: prj(c, 560, 1260)[1], r: 150 }], 1, .6);
      roleTag(ctx, 'EXTRA #7', hx, hy - 90, GREY, lt, 44);
      bulb(ctx, hx + 150, hy - 70, T - real);
    },
    sfx: [[real - st('L16'), 'ding', .6]] });

  // ===== s18 — L17 two main characters, second spotlight pops =====
  const two = ws('L17', 'two');
  S.push({ id: 's18', start: st('L17'), trans: 'cut', capY: 1680,
    bg: seatBg(.5),
    cam: lt => camAt(700, 1220, 1.15 + lt * .05),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 560, y: 1500, s: .8 }), T, 1); np.armL = .5; np.handL = 0;
      C(ctx, 'nubi', np, { expr: 'determined', lookX: .5 }, T);
      const lp = idle(P({ x: 850, y: 1500, s: .8 }), T, 2);
      C(ctx, 'lily', lp, { expr: T > two ? 'shy' : 'neutral', blush: T > two ? .7 : 0 }, T);
      envMovieTheaterFront(ctx, T, null, {});
    },
    ui(ctx, T, lt) {
      const c = [700, 1220, 1.15 + lt * .05]; const a = prj(c, 560, 1260), b = prj(c, 850, 1260);
      const sp = [{ x: a[0], y: a[1], r: 140 }]; if (T > two) sp.push({ x: b[0], y: b[1], r: 140 * Math.min(1, spring(T - two, 3, 6)) + 1 });
      spotlight(ctx, sp, 1, .62);
      roleTag(ctx, 'MAIN CHARACTER', a[0], a[1] - 300, GOLD, lt - .1, 40);
      if (T > two) roleTag(ctx, 'MAIN CHARACTER', b[0], b[1] - 300, GOLD, T - two, 40);
    },
    sfx: [[two - st('L17'), 'pop', .6]] });

  // ===== s19 — L18 found kernel, walks to Lily, offers it =====
  const found = ws('L18', 'found'), lilyT = ws('L18', 'lily');
  S.push({ id: 's19', start: st('L18'), trans: 'cut', capY: 1680,
    bg: seatBg(.4),
    cam: lt => camAt(lerp(600, 720, smooth(inv(0, 2.2, lt))), 1190, 1.3),
    draw(ctx, T, lt) {
      const u = easeOut(inv(found, lilyT + .1, T)), x = lerp(430, 680, u), moving = T > found && T < lilyT + .1;
      const lp = idle(P({ x: 880, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 2);
      C(ctx, 'lily', lp, { expr: T > lilyT ? 'love' : 'happy', blush: T > lilyT ? .8 : 0 }, T);
      const np = moving ? walk(P({ x, y: 1500, s: .8, view: 'q34' }), T, 1.1) : idle(P({ x, y: 1500, s: .8, view: 'q34' }), T, 1);
      np.armL = T > lilyT - .3 ? 1.9 : .5; if (T < found) np.lean = .2;
      C(ctx, 'nubi', np, { expr: T > lilyT ? 'shy' : 'determined', blush: T > lilyT ? .6 : 0 }, T);
      const kx = x + (T > lilyT - .3 ? 85 : 55), ky = T > lilyT - .3 ? 1250 : 1290;
      if (T > found - .3) kernel(ctx, kx, ky, .75, T > lilyT ? .6 + .4 * Math.sin(T * 9) : 0);
      envMovieTheaterFront(ctx, T, null, {});
      if (T > lilyT) burst(ctx, kx, ky - 30, T - lilyT, { kind: 'sparkle', n: 12, speed: 420, gravity: 0, life: .9, size: 18, seed: 4 });
    },
    sfx: [[found - st('L18'), 'pop', .4], [lilyT - st('L18'), 'sparkle', .6]] });

  // ===== s20 — L19 she breaks it in half =====
  const brk = ws('L19', 'broke'), half = ws('L19', 'half');
  S.push({ id: 's20', start: st('L19'), trans: 'cut', capY: 1690,
    bg: seatBg(.35),
    cam: lt => camAt(540, 1180, 1.5 + lt * .05),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 340, y: 1500, s: .8, view: 'q34' }), T, 1); np.armL = T > half ? 2.1 : .5;
      C(ctx, 'nubi', np, { expr: T > half ? 'excited' : 'shy', blush: .5 }, T);
      const lp = idle(P({ x: 740, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 3);
      lp.armL = 1.9; lp.armR = T > brk ? 1.8 : 1.9;
      C(ctx, 'lily', lp, { expr: T > half ? 'happy' : 'shy', blush: .8, mouth: lipShape(T, ['L19']) }, T);
      envMovieTheaterFront(ctx, T, null, {});
      if (T < brk) kernel(ctx, 660, 1245, .8, .5);
      else { const k = easeOut(inv(brk, half + .3, T)); kernel(ctx, lerp(660, 600, k) - 8, lerp(1245, 1240, k) - 6 * k, .6); kernel(ctx, lerp(660, 540, k) + 8, lerp(1245, 1250, k), .6);
        if (T < half + .2) burst(ctx, 660, 1240, T - brk, { kind: 'sparkle', n: 10, speed: 300, gravity: 0, life: .6, size: 16, seed: 8 }); }
    },
    sfx: [[brk - st('L19'), 'pop', .6], [half - st('L19'), 'sparkle', .5]] });

  // ===== s21 — L20 two spotlights, violins, slow motion =====
  const viol = ws('L20', 'violins');
  S.push({ id: 's21', start: st('L20'), trans: 'zoom', capY: 1700,
    bg: seatBg(.7),
    cam: lt => camAt(540, 1180, 1.35 + lt * .06),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 400, y: 1500, s: .8, view: 'q34' }), T, 1); np.lean = .05;
      C(ctx, 'nubi', np, { expr: 'love', holding: { L: c => kernel(c, 0, -10, .4) }, blush: .8 }, T);
      const lp = idle(P({ x: 680, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 2);
      C(ctx, 'lily', lp, { expr: 'love', blush: .9, holding: { R: c => kernel(c, 0, -10, .4) } }, T);
      envMovieTheaterFront(ctx, T, null, {});
      burst(ctx, 540, 1300, (T - viol) * .5, { kind: 'heart', n: 18, speed: 300, gravity: -120, life: 2, size: 30, angle: -Math.PI / 2, spread: 1.2, seed: 11 });
      burst(ctx, 540, 1050, (T * .5) % 3, { kind: 'sparkle', n: 20, speed: 200, gravity: 40, life: 2.5, size: 16, seed: 5 });
    },
    ui(ctx, T, lt) {
      const c = [540, 1180, 1.35 + lt * .06]; const a = prj(c, 400, 1260), b = prj(c, 680, 1260);
      spotlight(ctx, [{ x: a[0], y: a[1], r: 170 }, { x: b[0], y: b[1], r: 170 }], 1, .7);
    },
    sfx: [[0, 'swell', .5], [viol - st('L20'), 'chime', .5]] });

  // ===== s22 — L21 EXTRA #7 flips to LEAD =====
  const lead = ws('L21', 'lead');
  S.push({ id: 's22', start: st('L21'), trans: 'flash', capY: 1680,
    bg: seatBg(.6),
    cam: lt => camAt(540, 1130, 1.9 + lt * .05),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); if (T > lead) celebrate(p, T, .8);
      C(ctx, 'nubi', p, { expr: T > lead ? 'excited' : 'smug', mouth: lipShape(T, ['L21']) }, T);
      envMovieTheaterFront(ctx, T, null, {});
      if (T > lead) burst(ctx, 540, 1000, T - lead, { kind: 'confetti', n: 40, speed: 900, gravity: 1400, life: 1.4, size: 16, angle: -Math.PI / 2, spread: 1.4, seed: 2 });
    },
    ui(ctx, T, lt) {
      const c = [540, 1130, 1.9 + lt * .05]; const h = prj(c, 540, 1500 - 400 * .8), b = prj(c, 540, 1260);
      spotlight(ctx, [{ x: b[0], y: b[1], r: 230 }], 1, .6);
      const f = inv(lead - .1, lead + .2, T), sx = Math.abs(Math.cos(f * Math.PI));
      ctx.save(); ctx.translate(h[0], h[1] - 80); ctx.scale(Math.max(.05, f <= 0 || f >= 1 ? 1 : sx), 1); ctx.translate(-h[0], -(h[1] - 80));
      if (f < .5) roleTag(ctx, 'EXTRA #7', h[0], h[1] - 80, GREY, lt, 52); else roleTag(ctx, 'LEAD', h[0], h[1] - 80, GOLD, 1, 60);
      ctx.restore();
      stamp(ctx, 'W', 540, 560, T - lead, '#2FCB5C', 1.0);
    },
    sfx: [[lead - st('L21'), 'cheer', .55], [lead - st('L21'), 'bling', .5]] });

  // ===== s23 — L22 sister, background extra =====
  const bgx = ws('L22', 'background');
  S.push({ id: 's23', start: st('L22'), trans: 'cut', capY: 1690,
    bg: seatBg(.55),
    cam: lt => camAt(540, 1180, 1.3 + lt * .03),
    draw(ctx, T, lt) {
      // back-row seats: sister small, sulking, empty bucket
      const p = idle(P({ x: 540, y: 1400, s: .72 }), T, 4); p.head = .15; p.armL = .6; p.armR = .6;
      C(ctx, 'teenSister', p, { expr: T > bgx ? 'sad' : 'confused', eyes: { open: .6 }, holding: { R: holdBucket } }, T);
      envMovieTheaterFront(ctx, T, null, {});
    },
    ui(ctx, T, lt) {
      const c = [540, 1180, 1.3 + lt * .03]; const h = prj(c, 540, 1400 - 400 * .72);
      spotlight(ctx, [], 1, .5);
      ctx.save(); ctx.globalAlpha = .0; ctx.restore();
      roleTag(ctx, 'BACKGROUND EXTRA', h[0], h[1] - 70, GREY, T - bgx, 44);
    },
    sfx: [[bgx - st('L22') + .3, 'sad_trombone', .5]] });

  // ===== s24 — L23 sharing popcorn, sequel =====
  const seq = ws('L23', 'sequel');
  S.push({ id: 's24', start: st('L23'), trans: 'cut', capY: 1740,
    bg: seatBg(.7),
    cam: lt => camAt(540, 1150, 1.3 + lt * .03),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 400, y: 1500, s: .8, view: 'q34' }), T, 1); np.armL = 1.4;
      C(ctx, 'nubi', np, { expr: 'happy', holding: { L: c => kernel(c, 0, -10, .4) } }, T);
      const lp = idle(P({ x: 680, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 2); lp.armL = 1.4;
      C(ctx, 'lily', lp, { expr: 'happy', blush: .5, holding: { R: c => kernel(c, 0, -10, .4) } }, T);
      envMovieTheaterFront(ctx, T, null, {});
      burst(ctx, 540, 1000, T - st('L23'), { kind: 'sparkle', n: 16, speed: 260, gravity: 0, life: 1.6, size: 16, seed: 9 });
    },
    ui(ctx, T, lt) {
      const c = [540, 1150, 1.3 + lt * .03]; const a = prj(c, 400, 1260), b = prj(c, 680, 1260);
      spotlight(ctx, [{ x: a[0], y: a[1], r: 170 }, { x: b[0], y: b[1], r: 170 }], 1, .7);
      stamp(ctx, 'PART 2', 540, 520, T - seq, GOLD, 1.0);
      drawSubscribe(ctx, lt - .05, 3.5, 1460);
    },
    sfx: [[seq - st('L23'), 'cheer', .5]] });

  return S;
});
