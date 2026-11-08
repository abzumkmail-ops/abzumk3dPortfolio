// shots/part2.js — S10–S19 (L9–L17): hats off, green hair, Lily, the blue/pink battle, Brayden yells.
'use strict';
shots(() => {
  const S = [];

  // ---------- local helpers ----------
  const nf = (T, extra = {}) => Object.assign({ hair: nubiHair(T), cap: nubiCap(T), hairGlow: nubiGlow(T) }, extra);
  // Class-photo line-up (plan Continuity). Back row on the riser first, then the front row.
  const ROW = [['kidB', 260, 1390, .78, 11], ['brayden', 470, 1390, .8, 3], ['kidC', 690, 1390, .78, 13], ['kidE', 880, 1390, .78, 15],
    ['kidA', 200, 1500, .8, 21], ['nubi', 430, 1500, .8, 1], ['lily', 650, 1500, .8, 2], ['kidF', 860, 1500, .8, 17]];
  // mods[name](pose, face) mutates pose/face; face.sil = draws as a dark silhouette; mods[name] === false skips.
  function lineup(ctx, T, mods = {}) {
    const out = {};
    for (const [n, x, y, s, seed] of ROW) {
      const m = mods[n]; if (m === false) continue;
      const p = idle(P({ x, y, s }), T, seed, .6);
      const f = n === 'nubi' ? nf(T, { expr: 'nervous' }) : n === 'lily' ? { expr: 'happy', hair: LILY_PINK } : n === 'brayden' ? { expr: 'smug' } : { expr: 'happy' };
      if (m) m(p, f);
      if (f.sil) drawSilhouette(ctx, c2 => C(c2, n, p, f, T), 1, '#1E1A3A'); else C(ctx, n, p, f, T);
      out[n] = p;
    }
    return out;
  }
  // Nubi's orange cap held in the hand (hand space).
  const capProp = ctx => { ctx.save(); ctx.translate(0, 46); ctx.rotate(.4);
    ctx.beginPath(); ctx.arc(0, 0, 56, Math.PI, 0); ctx.closePath(); fillStroke(ctx, '#FF8528', 7);
    box(ctx, -8, -2, 108, 22, 10, '#E06A12', 6); ctx.restore(); };
  // Screen-space speech / thought bubble. (tx, ty) = tail tip relative to the bubble centre.
  function bubble(ctx, lines, x, y, dt, o = {}) {
    if (dt < 0) return; const size = o.size || 72, k = pop(dt, .22) * (o.dur ? 1 - smooth(inv(o.dur - .15, o.dur, dt)) : 1); if (k <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(o.rot || 0);
    ctx.font = `${size}px "Lilita One"`;
    const w = o.w || Math.max(...lines.map(l => ctx.measureText(l).width)) + 80, h = o.h || lines.length * size * 1.08 + 44;
    const tx = o.tx ?? -w * .2, ty = o.ty ?? h * .5 + 70;
    if (o.thought) {
      for (let i = 0; i < 3; i++) { const u = .35 + i * .25; circle(ctx, tx * u, ty * u + (1 - u) * h * .1, 26 - i * 7, '#fff', 6); }
      for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; circle(ctx, Math.cos(a) * w * .48, Math.sin(a) * h * .48, Math.min(w, h) * .26, '#fff', 7); }
      ellipse(ctx, 0, 0, w * .52, h * .52, '#fff');
    } else {
      ctx.beginPath(); ctx.moveTo(-34, h / 2 - 10); ctx.lineTo(tx, ty); ctx.lineTo(30, h / 2 - 10); ctx.closePath(); fillStroke(ctx, o.fill || '#fff', 8);
      box(ctx, -w / 2, -h / 2, w, h, Math.min(60, h / 2), o.fill || '#fff', 9);
      ctx.beginPath(); ctx.moveTo(-36, h / 2 - 14); ctx.lineTo(tx * .9, ty * .9); ctx.lineTo(28, h / 2 - 14); ctx.closePath(); ctx.fillStyle = o.fill || '#fff'; ctx.fill();
    }
    if (o.draw) o.draw(ctx);
    else lines.forEach((l, i) => txt(ctx, l, 0, (i - (lines.length - 1) / 2) * size * 1.08 + 4, size, o.col || '#24225B'));
    ctx.restore();
  }
  // Tiny police siren sitting on a head (world space), flashing.
  function siren(ctx, x, y, T, dt) {
    if (dt < 0) return; const k = pop(dt, .2), on = Math.floor(T * 8) % 2;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.save(); ctx.globalAlpha *= .55; ctx.fillStyle = on ? '#FF5B5B' : '#FFD447';
    for (let i = 0; i < 2; i++) { const a = T * 9 + i * Math.PI; ctx.beginPath(); ctx.moveTo(0, -40); ctx.arc(0, -40, 230, a - .28, a + .28); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    box(ctx, -52, -14, 104, 26, 8, '#555A70', 6);
    ctx.beginPath(); ctx.arc(0, -14, 42, Math.PI, 0); ctx.closePath(); fillStroke(ctx, on ? '#FF3B3B' : '#C42235', 7);
    ellipse(ctx, -14, -34, 9, 14, 'rgba(255,255,255,.7)');
    ctx.restore();
  }
  const shake = (T, t0, amp = 8, f = 60, d = 5) => T > t0 ? Math.sin(T * f) * amp * Math.exp(-(T - t0) * d) : 0;

  // ===== S10 — The photographer yelled, "HATS OFF!" (reverse shot) =====
  const yellT = ws('L9', 'yelled'), hatsT = ws('L9', 'hats'), offT = ws('L9', 'off');
  S.push({ id: 'S10', start: st('L9'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { noLights: true, banner: 'PICTURE DAY', bannerC: '#2E62C9' }),
    cam: lt => { const T = lt + st('L9'); return camAt(540 + shake(T, yellT, 7), 1180, 1.42 + lt * .08); },
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 21);
      p.armL = .55; p.handL = -.3;
      if (T > yellT) { surprise(p, T - yellT); p.armR = lerp(.3, 2.6, easeOut(inv(yellT, yellT + .15, T))); p.handR = .4; p.lean = -.06; }
      C(ctx, 'photographer', p, { expr: T > yellT ? 'screaming' : 'neutral', holding: { L: holdCamera } }, T);
      // the class from behind, in the foreground
      const k1 = idle(P({ x: 210, y: 1900, s: 1.05, view: 'back' }), T, 4); C(ctx, 'kidE', k1, {}, T);
      const k2 = idle(P({ x: 860, y: 1900, s: 1.05, view: 'back' }), T, 1); C(ctx, 'nubi', k2, nf(T), T);
    },
    ui(ctx, T) { bubble(ctx, ['HATS', 'OFF!'], 760, 520, T - yellT, { size: 92, tx: -150, ty: 170, rot: .06, fill: '#FFD447' }); },
    sfx: [[yellT - st('L9'), 'impact', .55]] });

  // ===== S11 — "...off, everybody!" Nubi pulls the cap off: GREEN hair =====
  S.push({ id: 'S11', start: hatsT - .08, trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam),
    cam: lt => { const T = lt + hatsT - .08; return camAt(320 + shake(T, offT, 6), 1170, 1.72 + lt * .05); },
    draw(ctx, T, lt) {
      const reactT = offT + .25;
      const ps = lineup(ctx, T, {
        nubi: (p, f) => {
          const u = easeOut(inv(hatsT - .1, offT, T)), d = easeInOut(inv(offT + .15, offT + .55, T));
          if (T > offT) surprise(p, T - offT);
          p.armL = lerp(.3, 2.55, u) - (T > offT ? lerp(0, 1.25, d) : 0); p.handL = lerp(0, -.6, u);
          if (T > offT) f.holding = { L: capProp };
          Object.assign(f, { expr: T > offT ? 'terrified' : 'nervous', sweat: T > offT });
        },
        kidA: (p, f) => { if (T > reactT) { surprise(p, T - reactT); f.expr = 'surprised'; f.lookX = .9; } },
        brayden: (p, f) => { if (T > reactT) { f.lookY = 1; f.lookX = -.4; f.expr = 'smug'; } },
        kidB: (p, f) => { if (T > reactT) { f.expr = 'surprised'; f.lookX = .8; f.lookY = .6; } },
        kidE: (p, f) => { f.expr = 'neutral'; }, kidF: (p, f) => { f.expr = 'neutral'; }, kidC: (p, f) => { f.expr = 'neutral'; },
        lily: (p, f) => { f.expr = 'neutral'; },
      });
      hairPop(ctx, 430, headTop('nubi', ps.nubi) + 40, 'scared', T - offT, .9);
    },
    sfx: [[offT - (hatsT - .08), 'poof', .6]] });

  // ===== S12 — And guess who was standing right next to me? (mystery silhouette) =====
  const guessT = ws('L10', 'guess'), whoT = ws('L10', 'who'), rightT = ws('L10', 'right'), meT = ws('L10', 'me');
  S.push({ id: 'S12', start: st('L10'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam),
    cam: lt => { const T = lt + st('L10'); const k = smooth(inv(guessT, meT + .2, T)); return camAt(lerp(420, 570, k), 1160, 1.6 + lt * .04); },
    draw(ctx, T, lt) {
      const k = smooth(inv(guessT, rightT, T));
      lineup(ctx, T, {
        nubi: (p, f) => { p.head = lerp(0, -.08, k); p.armL = .15; p.armR = .15;
          Object.assign(f, { expr: 'nervous', sweat: true, lookX: lerp(0, 1, k), lookY: .1 }); },
        lily: (p, f) => { f.sil = true; f.expr = 'neutral'; },
        kidF: (p, f) => { f.expr = 'neutral'; },
      });
      // question marks over the mystery classmate
      for (const [t0, x, y, sz, r] of [[whoT, 650, 960, 170, -.1], [meT, 760, 900, 110, .2], [meT + .12, 560, 900, 90, -.25]]) {
        const dt = T - t0; if (dt < 0) continue; const s = pop(dt, .25);
        ctx.save(); ctx.translate(x, y + Math.sin(T * 3 + x) * 8); ctx.rotate(r); ctx.scale(s, s); txt(ctx, '?', 0, 0, sz, '#FFD447', OUTLINE, 12); ctx.restore();
      }
    },
    ui(ctx, T) { vignette(ctx, .45 * smooth(inv(guessT, whoT + .4, T))); },
    sfx: [[guessT - st('L10'), 'whoosh', .35], [whoT - st('L10'), 'tick', .5], [meT - st('L10'), 'tick', .55]] });

  // ===== S13 — "Lily." Close-up reveal, then Nubi goes PINK =====
  const lilyT = ws('L11', 'lily'), popT = lilyT + .32;
  S.push({ id: 'S13', start: st('L11'), trans: 'zoom', capY: 1680,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam),
    cam: lt => { const T = lt + st('L11'); const k = easeInOut(inv(popT - .1, popT + .2, T));
      return camAt(lerp(650, 540, k) + shake(T, popT, 6), lerp(1150, 1170, k), lerp(2.1 + lt * .1, 1.42, k)); },
    draw(ctx, T, lt) {
      const ps = lineup(ctx, T, {
        lily: (p, f) => { p.head = .06; Object.assign(f, { expr: 'happy', eyes: { shape: T < popT ? 'sparkle' : null }, lookX: -.5, blush: true }); },
        nubi: (p, f) => { if (T > popT) { surprise(p, T - popT); p.armL = .5; p.armR = .5; }
          Object.assign(f, { expr: T > popT ? 'surprised' : 'nervous', sweat: true, blush: T > popT, lookY: T > popT ? -1 : 0, lookX: T > popT ? -.3 : .6 }); },
        kidF: (p, f) => { f.expr = 'neutral'; },
      });
      burst(ctx, 650, 960, T - lilyT, { kind: 'sparkle', n: 14, speed: 420, gravity: 0, life: .9, size: 20, seed: 4 });
      hairPop(ctx, 430, headTop('nubi', ps.nubi) + 40, 'love', T - popT, 1.0);
      burst(ctx, 430, 1000, T - popT, { kind: 'heart', n: 10, speed: 500, angle: -Math.PI / 2, spread: 1.6, gravity: -100, life: .8, size: 26, seed: 7 });
    },
    sfx: [[lilyT - st('L11'), 'chime', .6], [popT - st('L11'), 'boing', .6]] });

  // ===== S14 — Subscribe, because my hair was about to snitch. =====
  const snitchT = ws('L12', 'snitch'), becauseT = ws('L12', 'because');
  S.push({ id: 'S14', start: st('L12'), trans: 'cut', capY: 1720,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam),
    cam: lt => { const T = lt + st('L12'); return camAt(480 + shake(T, snitchT, 9, 70, 4), 1170, 1.38 + lt * .04); },
    draw(ctx, T, lt) {
      const ps = lineup(ctx, T, {
        nubi: (p, f) => {
          const g = easeOut(inv(becauseT - .1, becauseT + .2, T));
          p.armL = lerp(.2, 2.35, g) + Math.sin(T * 14) * .12 * g; p.armR = lerp(.2, 2.35, g) + Math.sin(T * 14 + 1) * .12 * g;
          p.handL = -.6 * g; p.handR = -.6 * g; p.x += Math.sin(T * 30) * 3 * g;
          if (T > snitchT) surprise(p, T - snitchT);
          Object.assign(f, { expr: T > snitchT ? 'terrified' : 'nervous', sweat: true, blush: true, lookY: -.3 });
        },
        lily: (p, f) => { f.lookX = -.3; },
        kidF: (p, f) => { f.expr = 'neutral'; },
      });
      siren(ctx, 430, headTop('nubi', ps.nubi) - 6, T, T - snitchT);
    },
    ui(ctx, T, lt) {
      drawSubscribe(ctx, lt - .05, snitchT - st('L12') - .15);
      if (T > snitchT) vignette(ctx, .45 + .25 * Math.max(0, Math.sin((T - snitchT) * 16)), '238,56,74');
    },
    sfx: [[.6, 'click', .6], [snitchT - st('L12'), 'alarm', .5]] });

  // ===== S15 — I thought about homework. BLUE! =====
  const hwT = ws('L13', 'homework'), thoughtT = ws('L13', 'thought'), blue1 = ws('L13', 'blue');
  S.push({ id: 'S15', start: st('L13'), trans: 'zoom', capY: 1680,
    bg: (ctx, T) => { const k = smooth(inv(blue1 - .05, blue1 + .2, T)); envBurst(ctx, T, mixHex('#FF9CCB', '#8CC4FF', k), mixHex('#FF4FA3', '#3F7BEA', k), .25); },
    cam: lt => { const T = lt + st('L13'); return camAt(560, 1130 + shake(T, blue1, 5), 1.7 + lt * .06); },
    draw(ctx, T, lt) {
      const p = idle(P({ x: 430, y: 1500, s: .8 }), T, 1, .5);
      const relief = T > blue1;
      if (!relief) { p.armL = .35 + Math.sin(T * 20) * .03; p.armR = .35; p.handL = 1.2; p.handR = 1.2; p.squash = .97; }
      else { anticipate(p, T - blue1 - .05, .12); p.armL = .25; p.armR = .25; }
      C(ctx, 'nubi', p, nf(T, { expr: relief ? 'happy' : 'determined', eyes: relief ? undefined : { open: 0 }, noBlink: !relief, sweat: relief, mouth: relief ? 'grin' : 'flat' }), T);
      hairPop(ctx, 430, headTop('nubi', p) + 10, 'sad', T - blue1, .75);
    },
    ui(ctx, T) {
      const dt = T - thoughtT;
      bubble(ctx, [''], 760, 600, dt, { thought: true, w: 360, h: 300, tx: -250, ty: 290, draw: c => { if (T > hwT - .1) { const s = pop(T - hwT + .1, .2); c.save(); c.scale(s * 1.15, s * 1.15); holdHomework(c); c.restore(); } } });
    },
    sfx: [[thoughtT - st('L13'), 'pop', .4], [blue1 - st('L13'), 'ding', .6]] });

  // ===== S16 — Then Lily said hi. PINK! =====
  const saidT = ws('L14', 'said'), hiT = ws('L14', 'hi'), pink1 = ws('L14', 'pink');
  S.push({ id: 'S16', start: st('L14'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam),
    cam: lt => { const T = lt + st('L14'); return camAt(545 + shake(T, pink1, 6), 1170, 1.36 + lt * .05); },
    draw(ctx, T, lt) {
      const ps = lineup(ctx, T, {
        lily: (p, f) => { p.view = 'q34'; p.flip = -1; const w = easeOut(inv(saidT - .05, saidT + .15, T));
          p.armL = lerp(.2, 2.5, w) + Math.sin(T * 14) * .3 * w; p.handL = -.3; Object.assign(f, { expr: 'happy', lookX: .3, mouth: T > hiT - .05 && T < hiT + .25 ? 'smallOpen' : null }); },
        nubi: (p, f) => { const pk = T > pink1; if (pk) { surprise(p, T - pink1); p.headY = 6; }
          Object.assign(f, { expr: pk ? 'shy' : 'happy', blush: pk, sweat: pk, lookY: pk ? 1 : 0, lookX: pk ? -.4 : .2 }); },
        kidF: (p, f) => { f.expr = 'neutral'; },
      });
      hairPop(ctx, 430, headTop('nubi', ps.nubi) + 40, 'love', T - pink1, 1.0);
    },
    ui(ctx, T) { bubble(ctx, ['HI!'], 840, 560, T - hiT + .05, { size: 96, tx: -70, ty: 140, fill: '#FFD1E8', col: '#D6337F' }); },
    sfx: [[hiT - st('L14'), 'pop', .45], [pink1 - st('L14'), 'boing', .6]] });

  // ===== S17 — I thought about broccoli. BLUE! =====
  const brocT = ws('L15', 'broccoli'), blue2 = ws('L15', 'blue');
  S.push({ id: 'S17', start: st('L15'), trans: 'zoom', capY: 1680,
    bg: (ctx, T) => { const k = smooth(inv(blue2 - .05, blue2 + .2, T)); envBurst(ctx, T, mixHex('#C9F2A4', '#8CC4FF', k), mixHex('#2F9E44', '#3F7BEA', k), -.25); },
    cam: lt => { const T = lt + st('L15'); return camAt(540, 1130 + shake(T, blue2, 5), 1.72 + lt * .06); },
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1, .5);
      const relief = T > blue2, up = easeOut(inv(brocT - .25, brocT + .05, T));
      p.armL = lerp(.2, 1.75, up); p.handL = lerp(0, -1.5, up); p.armR = .3;
      if (relief) anticipate(p, T - blue2 - .05, .12);
      C(ctx, 'nubi', p, nf(T, { expr: relief ? 'happy' : 'confused', mouth: relief ? 'grin' : 'wavy', lookX: relief ? 0 : 1, lookY: relief ? 0 : -.2, sweat: true, holding: { L: holdBroccoli } }), T);
      hairPop(ctx, 540, headTop('nubi', p) + 10, 'sad', T - blue2, .75);
    },
    ui(ctx, T) { popText(ctx, 'EWW', 300, 560, T - brocT - .1, { size: 96, fill: '#8EDB4A', rot: -.15, dur: .9 }); },
    sfx: [[brocT - st('L15'), 'pop', .45], [blue2 - st('L15'), 'ding', .6]] });

  // ===== S18 — Lily giggled. SUPER PINK! =====
  const gigT = ws('L16', 'giggled'), superT = ws('L16', 'super');
  S.push({ id: 'S18', start: st('L16'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam),
    cam: lt => { const T = lt + st('L16'); const k = easeOut(inv(superT - .05, superT + .2, T));
      return camAt(lerp(545, 470, k) + shake(T, superT, 10, 70, 4), lerp(1170, 1160, k), lerp(1.32 + lt * .04, 1.62, k)); },
    draw(ctx, T, lt) {
      const ps = lineup(ctx, T, {
        lily: (p, f) => { p.view = 'q34'; p.flip = -1;
          if (T > gigT) { laugh(p, T, .8); p.armL = 2.35; p.handL = -1.2; }
          Object.assign(f, { expr: T > gigT ? 'laughing' : 'happy', blush: true }); },
        nubi: (p, f) => { const sp = T > superT;
          if (sp) { surprise(p, T - superT); p.bodyY -= 22 * Math.exp(-(T - superT) * 3); }
          Object.assign(f, { expr: sp ? 'love' : 'shy', blush: true, lookY: sp ? -.6 : 1, lookX: -.3, sweat: !sp }); },
        kidF: (p, f) => { f.expr = 'neutral'; },
      });
      const hy = headTop('nubi', ps.nubi);
      burst(ctx, 790, 1020, T - gigT, { kind: 'sparkle', n: 10, speed: 320, gravity: 0, life: .8, size: 16, seed: 9 });
      hairPop(ctx, 430, hy + 40, 'love', T - superT, 1.5);
      burst(ctx, 430, hy - 20, T - superT, { kind: 'heart', n: 22, speed: 900, angle: -Math.PI / 2, spread: 2.2, gravity: 500, life: 1.1, size: 30, seed: 11 });
    },
    ui(ctx, T) { popText(ctx, 'hee hee', 860, 640, T - gigT, { size: 70, fill: '#FF9CCB', rot: .12, dur: 1.0 }); },
    sfx: [[gigT - st('L16'), 'sparkle', .45], [superT - st('L16'), 'boing', .65], [superT - st('L16') + .05, 'sparkle', .55]] });

  // ===== S19 — Brayden pointed and yelled, "NUBI LIKES SOMEBODY!" =====
  const pointT = ws('L17', 'pointed'), yell2 = ws('L17', 'yelled'), nubiW = ws('L17', 'nubi');
  S.push({ id: 'S19', start: st('L17'), trans: 'whip', capY: 1680,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam),
    cam: lt => { const T = lt + st('L17'); return camAt(510 + shake(T, nubiW, 7), 1130, 1.58 + lt * .05); },
    draw(ctx, T, lt) {
      lineup(ctx, T, {
        brayden: (p, f) => { p.view = 'q34'; p.flip = -1;
          const pt = easeOut(inv(pointT - .05, pointT + .15, T)), up = easeOut(inv(st('L17'), pointT, T));
          p.x = lerp(470, 545, up); p.bodyY = -95 * up;
          if (T > yell2) laugh(p, T, .7);
          p.armR = lerp(.2, 1.35, pt) + (T > yell2 ? Math.sin(T * 18) * .08 : 0); p.handR = .3; p.lean = .18 * pt;
          Object.assign(f, { expr: T > yell2 ? 'laughing' : 'smug', lookY: .8, lookX: .4, mouth: T > nubiW ? lipShape(T, ['L17']) : null }); },
        nubi: (p, f) => { const k = smooth(inv(nubiW, nubiW + .3, T)); p.squash = 1 - .06 * k; p.headY = 8 * k; p.armL = .1; p.armR = .1;
          Object.assign(f, { expr: T > nubiW ? 'terrified' : 'shy', blush: true, sweat: true, lookY: .8 }); },
        lily: (p, f) => { f.lookX = -.4; if (T > nubiW + .2) f.expr = 'surprised'; },
        kidC: (p, f) => { f.expr = T > nubiW + .2 ? 'surprised' : 'neutral'; f.lookX = -.5; },
        kidA: (p, f) => { if (T > nubiW + .2) { f.expr = 'surprised'; f.lookX = .8; } },
        kidB: (p, f) => { if (T > nubiW + .2) { f.expr = 'surprised'; f.lookX = .8; } },
        kidF: (p, f) => { f.expr = T > nubiW + .2 ? 'surprised' : 'neutral'; f.lookX = -.8; },
      });
    },
    ui(ctx, T) { bubble(ctx, ['NUBI LIKES', 'SOMEBODY!'], 640, 470, T - yell2, { size: 78, tx: -110, ty: 150, rot: -.04, fill: '#fff', col: '#EE384A' }); },
    sfx: [[pointT - st('L17'), 'scratch', .5], [yell2 - st('L17'), 'laugh', .45]] });

  return S;
});
