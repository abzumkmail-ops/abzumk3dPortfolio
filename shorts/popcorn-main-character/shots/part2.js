// shots/part2.js — s09–s16 (L8–L15)
'use strict';
shots(() => {
  const S = [];
  const W = (id, w, n = 0) => { try { const v = ws(id, w, n); return isFinite(v) ? v : LINE[id].start + .3; } catch (e) { return LINE[id].start + .3; } };
  const sc = (c, x, y) => [540 + (x - c.x) * c.z, 960 + (y - c.y) * c.z];   // world -> screen
  const cm = c => camAt(c.x, c.y, c.z);
  const bucket = (ctx, x, y, s = 1, lvl = 1) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 6; ctx.lineJoin = 'round';
    if (lvl > 0) { ctx.fillStyle = '#FFF4D6'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(-40 + i * 16, -70 - (i % 2) * 12, 20, 0, 7); ctx.fill(); ctx.stroke(); } }
    ctx.beginPath(); ctx.moveTo(-50, -60); ctx.lineTo(50, -60); ctx.lineTo(38, 40); ctx.lineTo(-38, 40); ctx.closePath(); ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#EE384A'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-44 + i * 34, -57); ctx.lineTo(-27 + i * 34, -57); ctx.lineTo(-22 + i * 24, 37); ctx.lineTo(-33 + i * 24, 37); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  };
  // seats in the theater: sister left, nubi right of her, Lily further right
  const SX = 380, NX = 600, LX = 850;

  // ===== s09 — she took me to the movies. Lily was there. =====
  const lilyT = W('L8', 'lily'), t8 = st('L8'), walkEnd = Math.min(lilyT - .25, t8 + 2.6);
  S.push({ id: 'S09', start: t8, trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envMovieTheater(ctx, T, cam, {}),
    cam: lt => cm({ x: 540 + lt * 8, y: 1060, z: 1.0 + lt * .03 }),
    draw(ctx, T, lt) {
      const k = easeOut(inv(t8, walkEnd, T)), mv = T < walkEnd ? 1 : 0;
      const sp = mv ? walk(P({ x: lerp(-150, SX, k), y: 1500, s: .8, view: 'q34' }), T, 1.1) : idle(P({ x: SX, y: 1500, s: .8 }), T, 2);
      C(ctx, 'teenSister', sp, { expr: 'smug', holding: { R: holdPhone } }, T);
      const np = mv ? walk(P({ x: lerp(-330, NX, k), y: 1500, s: .8, view: 'q34' }), T, 1.1) : idle(P({ x: NX, y: 1500, s: .8 }), T, 1);
      const seen = T > lilyT;
      if (seen) { np.view = 'front'; np.flip = 1; }
      C(ctx, 'nubi', np, { expr: seen ? 'love' : 'happy' }, T);
      const lp = idle(P({ x: LX, y: 1500, s: .8 }), T, 4); if (seen) { lp.armL = 1.4; lp.handL = .4; }
      C(ctx, 'lily', lp, { expr: seen ? 'shy' : 'neutral', blush: seen ? .8 : 0 }, T);
      envMovieTheaterFront(ctx, T, null, {});
      if (seen) { burst(ctx, LX, 1040, T - lilyT, { kind: 'sparkle', n: 20, speed: 500, gravity: -50, life: 1.0, size: 22, seed: 5 }); burst(ctx, NX, 1000, T - lilyT, { kind: 'heart', n: 8, speed: 350, gravity: -200, life: 1.1, size: 26, seed: 6 }); }
    },
    sfx: [[.1, 'step', .3], [lilyT - t8, 'sparkle', .6]] });

  // ===== s10 — DON'T. EMBARRASS. ME. =====
  const wD = W('L9', "don't") === LINE.L9.start + .3 ? W('L9', 'dont') : W('L9', "don't"), wE = W('L9', 'embarrass'), wM = W('L9', 'me');
  S.push({ id: 'S10', start: st('L9'), trans: 'zoom', capY: 1680,
    bg: (ctx, T, cam) => envMovieTheater(ctx, T, cam, {}),
    cam: lt => cm({ x: 540, y: 1110, z: 2.0 + lt * .05 }),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .8 }), T, 3), T, 3, .4);
      const wag = Math.sin(T * 14) * .35; p.armR = 1.9 + wag; p.handR = wag;
      C(ctx, 'teenSister', p, { expr: 'angry', mouth: lipShape(T, ['L9']) }, T);
    },
    ui(ctx, T) {
      popText(ctx, "DON'T", 300, 560, T - wD, { size: 120, fill: '#FFC531', rot: -.12, dur: wE - wD });
      popText(ctx, 'EMBARRASS', 640, 760, T - wE, { size: 110, fill: '#EE384A', rot: .08, dur: wM - wE });
      popText(ctx, 'ME', 540, 560, T - wM, { size: 170, fill: '#fff', rot: -.05, dur: 1.5 });
    },
    sfx: [[.05, 'whoosh', .3], [wD - st('L9'), 'impact', .55], [wE - st('L9'), 'impact', .55], [wM - st('L9'), 'impact', .65]] });

  // ===== s11 — I reached for the popcorn =====
  const t10 = st('L10'), reach = W('L10', 'reached'), pc = W('L10', 'popcorn');
  const c11 = { x: 500, y: 1120, z: 1.45 };
  S.push({ id: 'S11', start: t10, trans: 'cut', capY: 1700,
    bg: (ctx, T, cam) => envMovieTheater(ctx, T, cam, {}),
    cam: lt => cm({ x: c11.x + lt * 10, y: c11.y, z: c11.z + lt * .06 }),
    draw(ctx, T, lt) {
      const sp = idle(P({ x: 400, y: 1500, s: .8 }), T, 2); sp.armL = .4; sp.armR = .5;
      C(ctx, 'teenSister', sp, { expr: 'neutral', lookX: -.3 }, T);
      const k = inv(reach, pc + .3, T), np = idle(P({ x: 690, y: 1500, s: .8 }), T, 1);
      np.armL = lerp(.2, 1.0, k * k) + Math.sin(T * 18) * .03 * k; np.handL = Math.sin(T * 12) * .2 * k;
      C(ctx, 'nubi', np, { expr: T > reach ? 'nervous' : 'neutral', lookX: -.6, sweat: T > reach ? 1 : 0 }, T);
      bucket(ctx, 505, 1380, 1.0, 1);
      envMovieTheaterFront(ctx, T, null, {});
      roleTag(ctx, 'EXTRA #7', 690, 940, '#9AA3AD', T - t10 - .1, 40);
    },
    sfx: [[reach - t10, 'tick', .4], [reach - t10 + .5, 'tick', .45], [reach - t10 + 1.0, 'tick', .5]] });

  // ===== s12 — slapped. Mine. =====
  const t11 = st('L11'), slap = W('L11', 'slapped'), mine = W('L11', 'mine');
  const c12 = { x: 520, y: 1120, z: 1.45 };
  S.push({ id: 'S12', start: t11, trans: 'cut', capY: 1700,
    bg: (ctx, T, cam) => envMovieTheater(ctx, T, cam, {}),
    cam: lt => { const T = lt + t11; const sh = T > slap ? Math.sin(T * 70) * 12 * Math.exp(-(T - slap) * 6) : 0; return cm({ x: c12.x + sh, y: c12.y, z: c12.z + lt * .04 }); },
    draw(ctx, T, lt) {
      const sp = idle(P({ x: 400, y: 1500, s: .8 }), T, 2);
      if (T < slap - .12) { sp.armL = .4; sp.armR = .5; } else if (T < mine) { sp.armL = 1.5; sp.armR = 1.2; sp.lean = .12; } else { sp.armL = -.3; sp.armR = -.3; sp.lean = .25; }
      C(ctx, 'teenSister', sp, { expr: T > slap - .12 ? 'angry' : 'neutral', mouth: T > mine - .05 ? lipShape(T, ['L11']) : null }, T);
      const np = idle(P({ x: 690, y: 1500, s: .8 }), T, 1);
      if (T < slap) np.armL = lerp(.2, 1.0, inv(t11, slap, T)); else { np.armL = .3; np.handL = Math.sin((T - slap) * 30) * .5 * Math.exp(-(T - slap) * 3); surprise(np, T - slap); }
      C(ctx, 'nubi', np, { expr: T > slap ? 'surprised' : 'nervous', lookX: -.4 }, T);
      bucket(ctx, T > mine - .1 ? 440 : 505, T > mine - .1 ? 1370 : 1380, 1.0, 1);
      envMovieTheaterFront(ctx, T, null, {});
      roleTag(ctx, 'EXTRA #7', 690, 940, '#9AA3AD', 1, 40);
      if (T > slap) burst(ctx, 580, 1180, T - slap, { kind: 'star', n: 10, speed: 700, gravity: 200, life: .6, size: 26, seed: 8 });
    },
    ui(ctx, T) {
      popText(ctx, 'SLAP!', 760, 520, T - slap, { size: 110, fill: '#FFC531', rot: .1, dur: .9 });
      popText(ctx, 'MINE.', 400, 560, T - mine, { size: 150, fill: '#EE384A', rot: -.08, dur: 1.8 });
      stamp(ctx, 'L', 800, 760, T - mine - .5, '#EE384A', 1.0);
    },
    sfx: [[slap - t11 - .02, 'impact', .65], [slap - t11, 'toss', .3], [mine - t11 + .5, 'sad_trombone', .5]] });

  // ===== s13 — sneaky straw. She sat on the bucket. =====
  const t12 = st('L12'), sneak = W('L12', 'sneaky'), sat = W('L12', 'sat');
  const c13 = { x: 520, y: 1160, z: 1.35 };
  S.push({ id: 'S13', start: t12, trans: 'cut', capY: 1700,
    bg: (ctx, T, cam) => envMovieTheater(ctx, T, cam, {}),
    cam: lt => cm({ x: c13.x, y: c13.y, z: c13.z + lt * .04 }),
    draw(ctx, T, lt) {
      const sitK = spring(T - sat, 3, 5), sitting = T > sat;
      const sp = idle(P({ x: 400, y: 1500, s: .8 }), T, 2);
      if (!sitting) { sp.armL = .3; sp.armR = .3; sp.lean = .1; } else { sp.bodyY = 20 * Math.min(1, sitK); sp.squash = .9; sp.armL = 1.2; sp.armR = 1.2; sp.lean = -.05; }
      C(ctx, 'teenSister', sp, { expr: sitting ? 'smug' : 'neutral', lookX: -.2 }, T);
      const np = idle(P({ x: 690, y: 1500, s: .8 }), T, 1);
      const ext = easeOut(inv(sneak - .2, sneak + .8, T));
      np.armL = 1.0 + ext * .2; np.armR = .3;
      C(ctx, 'nubi', np, { expr: sitting ? 'sad' : 'smug', lookX: -.5 }, T);
      // bucket (under her after she sits)
      bucket(ctx, 440, sitting ? 1420 : 1380, 1.0, sitting ? 0 : 1);
      // long bendy straw from nubi's hand to the bucket
      const hx = 640, hy = 1230, bx = lerp(hx, 470, ext), by = lerp(hy, 1320, ext);
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const [w, c] of [[16, '#1b1b2a'], [9, '#EE384A']]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.bezierCurveTo(hx - 40, hy - 120 * ext, bx + 60, by - 150 * ext, bx, by); ctx.stroke(); }
      ctx.restore();
      envMovieTheaterFront(ctx, T, null, {});
      roleTag(ctx, 'EXTRA #7', 690, 940, '#9AA3AD', 1, 40);
      if (sitting) burst(ctx, 440, 1380, T - sat, { kind: 'dust', n: 10, speed: 400, gravity: 100, life: .6, size: 22, seed: 4 });
    },
    ui(ctx, T) { stamp(ctx, 'L', 800, 700, T - sat - .35, '#EE384A', 1.0); },
    sfx: [[sneak - t12, 'tick', .4], [sat - t12, 'boing', .6], [sat - t12 + .6, 'sad_trombone', .5]] });

  // ===== s14 — Subscribe, because then she ate all of it =====
  const t13 = st('L13'), subT = W('L13', 'subscribe'), tip = W('L13', 'ate'), allT = W('L13', 'all');
  const c14 = { x: 540, y: 1100, z: 1.3 };
  S.push({ id: 'S14', start: t13, trans: 'cut', capY: 1740,
    bg: (ctx, T, cam) => envMovieTheater(ctx, T, cam, {}),
    cam: lt => cm({ x: c14.x, y: c14.y, z: c14.z + lt * .03 }),
    draw(ctx, T, lt) {
      const u = inv(tip - .3, tip + .5, T), nd = inv(allT, LINE.L13.end, T);
      const sp = idle(P({ x: 540, y: 1500, s: .8 }), T, 2);
      sp.armR = lerp(.4, 2.5, smooth(u)); sp.armL = lerp(.4, 1.9, smooth(u)); sp.head = -.35 * smooth(u); sp.lean = -.12 * smooth(u);
      const chew = T > tip + .3 ? Math.sin(T * 22) * .02 : 0; sp.squash = 1 + chew;
      C(ctx, 'teenSister', sp, { expr: T > tip ? 'excited' : 'smug', mouth: T > tip ? (Math.sin(T * 22) > 0 ? 'teethOpen' : 'grin') : null }, T);
      // bucket tipped over her face, kernels falling
      if (T < tip + 1.4) { ctx.save(); ctx.translate(lerp(640, 585, smooth(u)), lerp(1380, 1000, smooth(u))); ctx.rotate(lerp(0, 2.6, smooth(u))); bucket(ctx, 0, 0, .85, 1); ctx.restore(); }
      for (let i = 0; i < 9; i++) { const t0 = tip + .1 + i * .13, d = T - t0; if (d > 0 && d < .6) kernel(ctx, 560 + (i % 3 - 1) * 20, 1030 + d * d * 1500, .6); }
      // cheek puffs
      const pf = smooth(nd); ctx.save(); ctx.fillStyle = '#F6C9A0'; ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 6;
      for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(540 + sx * (60 + 40 * pf), 1010 + 10 * pf, 14 + 38 * pf, 0, 7); if (pf > .05) { ctx.fill(); ctx.stroke(); } }
      ctx.restore();
      roleTag(ctx, 'MAIN CHARACTER', 540, 790, '#FFC531', T - allT - .15, 44);
    },
    ui(ctx, T) {
      const r = lerp(150, 430, easeOut(inv(allT, allT + 1.0, T))); const [sx, sy] = sc(c14, 540, 1230);
      spotlight(ctx, [{ x: sx, y: sy, r }], smooth(inv(allT - .1, allT + .3, T)));
      drawSubscribe(ctx, T - subT - .05, 1.6, 1460);
    },
    sfx: [[subT - t13, 'pop', .5], [tip - t13 + .1, 'toss', .4], [tip - t13 + .4, 'thud', .5], [allT - t13, 'power', .5]] });

  // ===== s15 — so main character, the movie noticed =====
  const t14 = st('L14'), gotT = W('L14', 'got'), mainT = W('L14', 'main'), charT = W('L14', 'character'), noticed = W('L14', 'noticed');
  const c15 = { x: 540, y: 1000, z: 1.1 };
  S.push({ id: 'S15', start: t14, trans: 'cut', capY: 1700,
    bg: (ctx, T, cam) => envMovieTheater(ctx, T, cam, {}),
    cam: lt => cm({ x: c15.x, y: c15.y, z: c15.z + lt * .03 }),
    draw(ctx, T, lt) {
      const stop = T > noticed, wk = T < noticed ? 1 : 0;
      dino(ctx, T < noticed ? lerp(300, 540, inv(t14, noticed, T)) : 540, 900, .75, stop ? 1 : 0, 0);
      const sp = idle(P({ x: 540, y: 1500, s: .8 }), T, 2); sp.armL = .6; sp.armR = .6; sp.bodyY = Math.sin(T * 3) * 6;
      C(ctx, 'teenSister', sp, { expr: 'smug', mouth: null, lookX: 0, lookY: -.3 }, T);
      envMovieTheaterFront(ctx, T, null, {});
      // stacked tags
      [[gotT, 790], [mainT, 700], [charT, 610]].forEach(([tt, y], i) => roleTag(ctx, 'MAIN CHARACTER', 540, y, '#FFC531', T - tt, 44 - i * 2));
      if (stop) { ctx.save(); ctx.strokeStyle = '#EE384A'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(540, 780, 34 + (T - noticed) * 4, 0, 7); ctx.globalAlpha = .0; ctx.stroke(); ctx.restore(); }
    },
    ui(ctx, T) {
      const [sx, sy] = sc(c15, 540, 1230);
      spotlight(ctx, [{ x: sx, y: sy, r: 360 }], 1, .5);
      speedLines(ctx, 540, 900, T, .25);
      if (T > noticed) popText(ctx, '!', 700, 420, T - noticed, { size: 180, fill: '#EE384A', rot: .1, dur: 1.2 });
    },
    sfx: [[mainT - t14, 'sparkle', .5], [noticed - t14, 'scratch', .5]] });

  // ===== s16 — The dinosaur turned around... and roared =====
  const t15 = st('L15'), turned = W('L15', 'turned'), roared = W('L15', 'roared');
  const c16 = { x: 540, y: 1080, z: 1.05 };
  S.push({ id: 'S16', start: t15, trans: 'flash', capY: 1720,
    bg: (ctx, T, cam) => envMovieTheater(ctx, T, cam, {}),
    cam: lt => { const T = lt + t15; const sh = T > roared ? Math.sin(T * 65) * 14 * Math.exp(-(T - roared) * 2.5) : 0; return cm({ x: c16.x + sh, y: c16.y, z: c16.z + inv(t15, roared, T) * .12 }); },
    draw(ctx, T, lt) {
      const tu = smooth(inv(turned - .1, turned + .5, T)), ro = T > roared ? smooth(inv(roared, roared + .25, T)) : 0;
      const ds = lerp(.75, 1.15, tu + ro * .3);
      dino(ctx, 540, 960, ds * (1 + (T > roared ? Math.sin(T * 50) * .02 : 0)), tu, ro);
      const hit = T > roared;
      const sp = idle(P({ x: 540, y: 1500, s: .8 }), T, 2);
      if (hit) { sp.lean = -.3 * Math.min(1, (T - roared) * 6); sp.armL = 1.6; sp.armR = 1.6; sp.head = -.2; sp.bodyY = -10; } else { sp.armL = .5; sp.armR = .5; }
      C(ctx, 'teenSister', sp, { expr: hit ? 'terrified' : (T > turned ? 'surprised' : 'smug'), mouth: hit ? 'scream' : null }, T);
      envMovieTheaterFront(ctx, T, null, {});
      roleTag(ctx, 'MAIN CHARACTER', 540, 790, '#FFC531', 1, 44);
      // wind of the roar: horizontal streaks
      if (hit) { ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 8; ctx.lineCap = 'round'; for (let i = 0; i < 8; i++) { const y = 900 + i * 70, x0 = 620 + ((T * 1400 + i * 190) % 560); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 140, y + 10); ctx.stroke(); } ctx.restore(); }
    },
    ui(ctx, T) {
      if (T > roared) { stamp(ctx, 'PLOT TWIST', 540, 420, T - roared - .25, '#EE384A', 1.0); vignette(ctx, .35, '238,56,74'); }
    },
    sfx: [[.1, 'whoosh', .3], [turned - t15, 'thud', .5], [roared - t15, 'glitch', .4], [roared - t15 + .05, 'impact', .8], [roared - t15 + .1, 'crash', .5]] });

  return S;
});
