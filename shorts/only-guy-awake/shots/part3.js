// shots/part3.js — S40–S59 (L40–L59)
'use strict';
shots(() => {
  const S = [];
  const guard = (T, t0) => T >= t0;

  // ---- local props (names prefixed p3 to avoid clashes)
  function p3Spider(ctx, x, y, s, T, thread) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (thread) { ctx.beginPath(); ctx.moveTo(0, -thread); ctx.lineTo(0, 0); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.stroke(); }
    ctx.strokeStyle = OUTLINE; ctx.lineWidth = 8; ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) for (const d of [-1, 1]) { const w = Math.sin(T * 9 + i) * 6; ctx.beginPath(); ctx.moveTo(d * 14, 0); ctx.lineTo(d * (50 + i * 6), -26 + i * 14 + w); ctx.lineTo(d * (70 + i * 8), 14 + i * 14); ctx.stroke(); }
    circle(ctx, 0, 0, 30, '#2B1B3A', 7); circle(ctx, -9, -6, 6, '#fff'); circle(ctx, 9, -6, 6, '#fff'); circle(ctx, -9, -6, 2.5, OUTLINE); circle(ctx, 9, -6, 2.5, OUTLINE);
    ctx.restore();
  }
  function p3Dots(ctx, T, t0, a) { // sprinkler drops (screen space)
    if (T < t0) return; ctx.save(); ctx.globalAlpha *= a * Math.min(1, (T - t0) * 3);
    for (let i = 0; i < 90; i++) { const r = rng(i * 13 + 4); const sp = 1100 + r() * 700; const x = r() * W, y = ((T - t0) * sp + r() * H * 2) % (H + 60) - 30; ctx.fillStyle = '#7FD4FF'; ctx.fillRect(x, y, 5, 26 + r() * 20); }
    ctx.restore();
  }
  const attempt = (id, line, label, c1, c2, withSpider) => {
    S.push({ id, start: st(line), trans: 'flash', capY: 960,
      bg: (ctx, T) => envBurst(ctx, T, c1, c2, .5),
      cam: lt => camAt(540, 1180, 1.7 + lt * .05),
      draw(ctx, T, lt) {
        const t0 = st(line);
        const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); anticipate(p, lt, .25); if (lt > .25) { p.armL = 1.2; p.armR = 1.2; p.handL = -1; p.handR = -1; }
        C(ctx, 'nubi', p, { expr: 'determined', mouth: lipShape(T, [line]) }, T);
        if (withSpider) p3Spider(ctx, 330, 1250 + Math.sin(T * 3) * 30, 1.4, T, 700);
      },
      ui(ctx, T, lt) { stamp(ctx, label, 960, 250, T - st(line), '#FFC83D', 1.0); speedLines(ctx, 960, 540, T, .4); },
      sfx: [[0, 'impact', .6]] });
  };

  // ===== S40 — Attempt two: the spider =====
  attempt('S40', 'L40', 'ATTEMPT 2: THE SPIDER', '#FF8528', '#FFC83D', true);

  // ===== S41 — I screamed louder than the entire class combined =====
  const scr = ws('L41', 'screamed'), comb = ws('L41', 'combined');
  const cam41 = lt => camAt(700, 1190, 1.05 + lt * .02);
  S.push({ id: 'S41', start: st('L41'), trans: 'cut',
    bg: (ctx, T, cam) => envClassroom(ctx, T, cam, { board: 'SCIENCE' }),
    cam: cam41,
    draw(ctx, T, lt) {
      // spider dangling in the middle of the room
      const sy = lerp(1000, 1250, easeOut(inv(st('L41'), st('L41') + .6, T))) + Math.sin(T * 3) * 12;
      const np = idle(P({ x: 430, y: 1500, s: .8, view: 'q34' }), T, 1);
      if (T > scr) { np.armL = 2.6; np.armR = 2.6; np.lean = -.25; np.bodyY = -Math.abs(Math.sin((T - scr) * 14)) * 22; }
      C(ctx, 'nubi', np, { expr: T > scr ? 'screaming' : 'terrified', mouth: T > scr ? 'scream' : undefined, pale: 1, sweat: T > scr ? 1 : 0 }, T);
      for (const [n, x, ph] of [['kidA', 850, 1], ['kidC', 1010, 2], ['kidE', 1170, 3]]) {
        const p = idle(P({ x, y: 1500, s: .74, view: 'q34', flip: -1 }), T, ph);
        C(ctx, n, p, { expr: 'neutral', eyes: { open: .55 }, holding: { R: holdPhone }, lookX: -.3 }, T);
      }
      p3Spider(ctx, 650, sy, 1.3, T, 700);
    },
    ui(ctx, T, lt) {
      if (T > scr) { ctx.save(); ctx.translate(0, 0); ctx.restore(); }
      if (T > comb) stamp(ctx, 'L', 960, 300, T - comb, '#EE384A', 1.3);
    },
    sfx: [[scr - st('L41'), 'impact', .6], [comb - st('L41'), 'sad_trombone', .5], [comb - st('L41') - .1, 'crash', .4]] });

  // ===== S42 — Attempt three: the projector =====
  attempt('S42', 'L42', 'ATTEMPT 3: THE PROJECTOR', '#2E6BD8', '#7FD4FF', false);

  // ===== S43 — one button, fire alarm =====
  const btn = ws('L43', 'button'), alm = ws('L43', 'alarm');
  S.push({ id: 'S43', start: st('L43'), trans: 'cut',
    bg: (ctx, T, cam) => envClassroom(ctx, T, cam, {}),
    cam: lt => camAt(700, 1190, 1.0 + lt * .02),
    draw(ctx, T, lt) {
      // projector on a cart
      box(ctx, 560, 1330, 320, 24, 6, '#8A5A2B', 7); box(ctx, 590, 1354, 18, 146, 0, '#555', 5); box(ctx, 830, 1354, 18, 146, 0, '#555', 5);
      box(ctx, 600, 1240, 240, 92, 18, '#4A4F66', 8); circle(ctx, 640, 1286, 30, '#222', 6); circle(ctx, 640, 1286, 14, '#7FD4FF');
      const pulse = T > btn ? .5 + .5 * Math.sin(T * 14) : 0;
      circle(ctx, 790, 1236, 16 + pulse * 3, T > btn ? '#EE384A' : '#A82033', 5);
      const reach = smooth(inv(btn - .35, btn, T));
      const np = idle(P({ x: 520, y: 1500, s: .8, view: 'q34' }), T, 1); np.armR = 1.1 + reach * 1.0; np.lean = reach * .1;
      if (T > alm) { surprise(np, T - alm); np.armR = 1.1; }
      C(ctx, 'nubi', np, { expr: T > alm ? 'terrified' : 'determined', sweat: T > alm ? 1 : 0 }, T);
      for (const [n, x0, d] of [['kidA', 1000, 0], ['kidC', 1120, .12], ['kidE', 1240, .25]]) {
        const go = alm + .3 + d, x = T > go ? x0 + (T - go) * 520 : x0;
        const p = T > go ? run(P({ x, y: 1500, s: .74, view: 'q34' }), T, 1.2) : idle(P({ x, y: 1500, s: .74, view: 'q34', flip: -1 }), T, x);
        C(ctx, n, p, { expr: T > go ? 'terrified' : 'neutral' }, T);
      }
    },
    ui(ctx, T, lt) {
      if (T > alm) { vignette(ctx, .5 + .3 * Math.sin(T * 10), '238,56,74'); p3Dots(ctx, T, alm + .4, .8); stamp(ctx, 'L', 960, 300, T - alm - .8, '#EE384A', 1.3); }
    },
    sfx: [[btn - st('L43'), 'click', .6], [alm - st('L43'), 'alarm', .5]] });

  // ===== S44 — big sister in the hallway =====
  S.push({ id: 'S44', start: st('L44'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(560, 1170, 1.15 + lt * .02),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 280, y: 1500, s: .8, view: 'q34' }), T, 1);
      C(ctx, 'nubi', np, { expr: 'nervous' }, T);
      const sp = idle(P({ x: 800, y: 1500, s: .86, view: 'q34', flip: -1 }), T, 5); sp.armL = 1.0; sp.armR = 1.0; sp.handL = .8; sp.handR = -.8;
      C(ctx, 'teenSister', sp, { expr: 'angry', eyes: { open: .7 } }, T);
    },
    sfx: [[.1, 'step', .5]] });

  // ===== S45 — "You are embarrassing the entire male species." =====
  const roll = ws('L45', 'embarrassing');
  S.push({ id: 'S45', start: st('L45'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1170, 2.6 + lt * .05),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .8 }), T, 5), T, 5, .4);
      const u = inv(roll - .3, roll + .5, T), a = u * TAU;
      C(ctx, 'teenSister', p, { expr: 'neutral', mouth: lipShape(T, ['L45']), eyes: { open: .75 }, lookX: u > 0 && u < 1 ? Math.sin(a) * .8 : 0, lookY: u > 0 && u < 1 ? -Math.cos(a) * .8 : 0 }, T);
    } });

  // ===== S46 — Technically... =====
  const tech = ws('L46', 'technically');
  S.push({ id: 'S46', start: st('L46'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1220, 1.5 + lt * .03),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .8 }), T, 1), T, 1, .3);
      p.armR = 2.7; p.handR = 0; p.armL = .3; p.head = Math.sin(T * 2) * .04;
      C(ctx, 'nubi', p, { expr: 'smug', eyes: { open: .7 } }, T);
    },
    ui(ctx, T) { if (T > tech) popText(ctx, 'TECHNICALLY...', 960, 220, T - tech, { size: 90, fill: '#FFC83D', rot: -.04 }); },
    sfx: [[tech - st('L46') + .1, 'ding', .5]] });

  // ===== S47 — principal at the mic in the cafeteria =====
  const cam47 = lt => camAt(680, 1190, 1.0 + lt * .02);
  S.push({ id: 'S47', start: st('L47'), trans: 'cut',
    bg: (ctx, T, cam) => envCafeteria(ctx, T, cam, {}),
    cam: cam47,
    draw(ctx, T, lt) {
      const pr = talk(idle(P({ x: 1010, y: 1500, s: .82, view: 'q34', flip: -1 }), T, 3), T, 3, .3); pr.armL = 1.7;
      C(ctx, 'principalF', pr, { expr: 'happy', holding: { L: holdMic } }, T);
      for (const [n, x, ph] of [['kidA', 380, 1], ['kidC', 560, 2], ['kidF', 740, 3]]) {
        const p = idle(P({ x, y: 1455, s: .72, view: 'q34' }), T, ph);
        C(ctx, n, p, { expr: 'neutral' }, T);
      }
      envCafeteriaFront(ctx, T, cam47(lt), { trays: [380, 740] });
    },
    sfx: [[.3, 'buzz', .2]] });

  // ===== S48 — Winter Dance announcement =====
  const wint = ws('L48', 'winter');
  S.push({ id: 'S48', start: st('L48'), trans: 'cut',
    bg: (ctx, T, cam) => envCafeteria(ctx, T, cam, {}),
    cam: lt => camAt(540, 1230, 2.1 + lt * .03),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .82 }), T, 3), T, 3, .5);
      C(ctx, 'principalF', p, { expr: 'happy', mouth: lipShape(T, ['L48']), holding: { R: holdMic } }, T);
    },
    ui(ctx, T) {
      if (T < wint) return; const k = pop(T - wint);
      ctx.save(); ctx.translate(960, 130); ctx.scale(k, k); ctx.rotate(-.02);
      box(ctx, -330, -60, 660, 120, 20, '#7B4BFF', 9); txt(ctx, 'WINTER DANCE', 0, 2, 84, '#fff', OUTLINE, 10); ctx.restore();
    },
    sfx: [[wint - st('L48'), 'chime', .6]] });

  // ===== S49 — six hundred heads turned =====
  const heads = ws('L49', 'heads'), toward = ws('L49', 'toward');
  const crowd49 = [];
  const pool49 = ['kidA', 'kidC', 'kidE', 'kidF', 'lily', 'teenSister', 'mom', 'teacher', 'lunchlady', 'principalF', 'kidK', 'kidI'];
  [[1500, .8, 5, 230], [1410, .66, 6, 200], [1330, .55, 8, 160]].forEach(([y, s, n, dx], r) => { for (let i = 0; i < n; i++) crowd49.push({ y, s, x: 540 + (i - (n - 1) / 2) * dx + (r % 2) * 40, name: pool49[(r * 5 + i) % pool49.length], i: crowd49.length }); });
  S.push({ id: 'S49', start: st('L49'), trans: 'none',
    bg: (ctx, T, cam) => envCafeteria(ctx, T, cam, {}),
    cam: lt => camAt(540, 1130, .9 + lt * .02),
    draw(ctx, T, lt) {
      for (const c of crowd49.slice().sort((a, b) => a.y - b.y)) {
        const tt = lerp(heads + .1, toward, (c.i * 7 % 19) / 19);
        const v = T < tt ? 'back' : T < tt + .18 ? 'q34' : 'front';
        const p = idle(P({ x: c.x, y: c.y, s: c.s, view: v }), T, c.i);
        C(ctx, c.name, p, { expr: v === 'front' ? 'neutral' : 'neutral', eyes: v === 'front' ? { open: .8 } : undefined, lookX: 0 }, T);
      }
    },
    sfx: [[toward - st('L49'), 'impact', .6]] });

  // ===== S50 — one partner available: me =====
  const me50 = ws('L50', 'me');
  S.push({ id: 'S50', start: st('L50'), trans: 'zoom',
    bg: (ctx, T, cam) => envCafeteria(ctx, T, cam, {}),
    cam: lt => camAt(540, 1190, 1.8 + lt * .04),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); p.head = Math.sin(T * 3) * .05;
      C(ctx, 'nubi', p, { expr: 'nervous', sweat: 1, eyes: { open: 1 }, lookX: Math.sin(T * 1.5) * .5 }, T);
    },
    ui(ctx, T) {
      spotlight(ctx, 960, .8, '0,0,0');
      if (T > me50) popText(ctx, 'AVAILABLE PARTNERS: 1', 960, 200, T - me50, { size: 80, fill: '#30CE65' });
    },
    sfx: [[0, 'impact', .5]] });

  // ===== S51 — sign-up sheet on my locker =====
  const sign51 = ws('L51', 'sign');
  const cam51 = lt => camAt(560, 1190, 1.3 + lt * .02);
  S.push({ id: 'S51', start: st('L51'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: cam51,
    draw(ctx, T, lt) {
      const k = easeOut(inv(sign51 - .2, sign51 + .15, T)), dy = (1 - k) * -300;
      const np = idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 1); if (T > sign51 + .2) surprise(np, T - sign51 - .2);
      C(ctx, 'nubi', np, { expr: T > sign51 + .2 ? 'surprised' : 'neutral' }, T);
      if (T > sign51 - .2) { signupSheet(ctx, 700, 1180 + dy, 4, 1.3); box(ctx, 660, 1020 + dy, 80, 26, 3, 'rgba(240,230,160,.9)', 0); }
    },
    sfx: [[sign51 - st('L51'), 'rip', .5]] });

  // ===== S52 — 200, 500 =====
  const two = ws('L52', 'two'), five = ws('L52', 'five');
  S.push({ id: 'S52', start: st('L52'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(640, 1210, 1.0 + lt * .02),
    draw(ctx, T, lt) {
      const t0 = st('L52'), tEnd = LINE['L52'].end;
      const n = Math.round(lerp(4, 28, easeIn(inv(t0, tEnd, T))));
      const cnt = 1 + Math.floor(clamp(inv(t0, tEnd, T)) * 9);
      for (let i = 0; i < Math.min(cnt, 10); i++) { const col = i % 5, row = Math.floor(i / 5); signupSheet(ctx, 280 + col * 190 + row * 40, 1130 + row * 230, n, .62); }
      const np = idle(P({ x: 100, y: 1500, s: .8, view: 'q34' }), T, 1);
      C(ctx, 'nubi', np, { expr: T > five ? 'terrified' : 'surprised', sweat: T > five ? 1 : 0 }, T);
    },
    ui(ctx, T) {
      if (T > two && T < five) popText(ctx, '200', 960, 230, T - two, { size: 120, fill: '#FFC83D' });
      if (T >= five) popText(ctx, '500', 960, 230, T - five, { size: 140, fill: '#EE384A' });
    },
    sfx: [[two - st('L52'), 'pop', .6], [five - st('L52'), 'pop', .7]] });

  // ===== S53 — sister signs then crosses out =====
  const cross = ws('L53', 'out');
  S.push({ id: 'S53', start: st('L53'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(700, 1210, 1.35 + lt * .02),
    draw(ctx, T, lt) {
      const t0 = st('L53'), wr = inv(t0 + .3, cross - .5, T);
      signupSheet(ctx, 900, 1170, 26, 1.5);
      // her name line, written progressively, then crossed out
      ctx.save(); ctx.strokeStyle = '#7B4BFF'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(740, 1330);
      for (let k = 1; k <= 12 * wr; k++) ctx.lineTo(740 + k * 14, 1330 + Math.sin(k * 1.7) * 7); ctx.stroke();
      const cx = inv(cross, cross + .25, T);
      if (cx > 0) { ctx.strokeStyle = '#EE384A'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(730, 1335); ctx.lineTo(730 + 190 * clamp(cx), 1335 - 4 * clamp(cx)); ctx.stroke(); }
      ctx.restore();
      const sp = idle(P({ x: 500, y: 1500, s: .84, view: 'q34' }), T, 5);
      sp.armR = T < cross ? 1.7 + Math.sin(T * 14) * .2 : 1.7;
      if (T > cross) sp.armR = 1.9 + Math.sin((T - cross) * 30) * .4 * (1 - clamp(inv(cross, cross + .3, T)));
      C(ctx, 'teenSister', sp, { expr: T > cross ? 'smug' : 'neutral', mouth: T > cross ? 'smirk' : undefined }, T);
    },
    sfx: [[cross - st('L53'), 'scratch', .5]] });

  // ===== S54 — only one name I cared about =====
  S.push({ id: 'S54', start: st('L54'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(lerp(600, 780, lt / 4), 1170, 1.1),
    draw(ctx, T, lt) {
      const t0 = st('L54');
      const x = lerp(520, 1000, inv(t0, t0 + 4.5, T));
      for (const [n, cx, ph] of [['kidA', 80, 1], ['kidC', 220, 2], ['kidE', 360, 3], ['kidF', 120, 4]]) {
        const p = idle(P({ x: cx, y: n === 'kidF' ? 1420 : 1500, s: n === 'kidF' ? .62 : .74, view: 'q34' }), T, ph);
        C(ctx, n, p, { expr: 'happy', holding: ph % 2 ? { R: holdPhone } : null }, T);
      }
      const np = walk(P({ x, y: 1500, s: .8, view: 'q34' }), T, 1.0, 1);
      C(ctx, 'nubi', np, { expr: 'shy', blush: .6 }, T);
      burst(ctx, x - 60, 1000, (T - t0) % 1.2, { kind: 'heart', n: 5, speed: 120, gravity: -60, life: 1.2, size: 26, seed: 2 });
    },
    ui(ctx, T) { ctx.save(); ctx.fillStyle = 'rgba(255,140,190,.14)'; ctx.fillRect(0, 0, W, H); ctx.restore(); } });

  // ===== S55 — Lily draws in the back of art class =====
  const cam55 = lt => camAt(700, 1250, 1.5 + lt * .03);
  S.push({ id: 'S55', start: st('L55'), trans: 'cut',
    bg: (ctx, T, cam) => envClassroom(ctx, T, cam, { board: 'ART', doodles: true }),
    cam: cam55,
    draw(ctx, T, lt) {
      const p = idle(P({ x: 700, y: 1455, s: .8 }), T, 2); p.armR = 1.1 + Math.sin(T * 5) * .12; p.head = .12 + Math.sin(T * 1.2) * .03;
      C(ctx, 'lily', p, { expr: 'happy', mouth: 'smallSmile', lookY: .5, holding: { L: holdSketchbook } }, T);
      envClassroomFront(ctx, T, cam55(lt), { desks: [700] });
      burst(ctx, 820, 1050, (T * .8) % 1.5, { kind: 'heart', n: 4, speed: 90, gravity: -50, life: 1.5, size: 22, seed: 7 });
    },
    sfx: [[.4, 'sparkle', .35]] });

  // ===== S56 — she never asked me for anything =====
  const glance = ws('L56', 'only'), away = ws('L56', 'never');
  const cam56 = lt => camAt(660, 1250, 1.3 + lt * .02);
  S.push({ id: 'S56', start: st('L56'), trans: 'cut',
    bg: (ctx, T, cam) => envClassroom(ctx, T, cam, { doodles: true }),
    cam: cam56,
    draw(ctx, T, lt) {
      const g = T > glance && T < away + .1;
      const lp = idle(P({ x: 390, y: 1455, s: .8, view: 'q34' }), T, 2); lp.head = g ? -.08 : .1;
      C(ctx, 'lily', lp, { expr: 'shy', blush: g ? 1 : .4, lookX: g ? .9 : 0, lookY: g ? -.2 : .6, holding: { L: holdSketchbook } }, T);
      const np = idle(P({ x: 920, y: 1455, s: .8, view: 'q34', flip: -1 }), T, 4);
      C(ctx, 'nubi', np, { expr: g ? 'shy' : 'neutral', blush: g ? 1 : .2, lookX: g ? -.7 : 0 }, T);
      envClassroomFront(ctx, T, cam56(lt), { desks: [390, 920] });
      if (g) burst(ctx, 920, 1000, T - glance, { kind: 'heart', n: 4, speed: 100, gravity: -60, life: 1, size: 22, seed: 3 });
    },
    sfx: [] });

  // ===== S57 — hot chocolate with a snowflake, every morning =====
  const tA = ws('L57', 'every'), tB = ws('L57', 'waiting'), snw = ws('L57', 'snowflake');
  S.push({ id: 'S57', start: st('L57'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const T = lt + st('L57'); const k = smooth(inv(snw - .4, snw + .2, T)); return camAt(700, lerp(1200, 1160, k), lerp(1.2, 2.3, k) + lt * .01); },
    draw(ctx, T, lt) {
      box(ctx, 480, 880, 440, 620, 10, '#6E8FB3', 9); for (let i = 0; i < 5; i++) box(ctx, 520, 930 + i * 14, 360, 5, 0, '#4F6D8E', 0);
      box(ctx, 540, 1245, 320, 18, 4, '#E9E2CC', 6);
      const mid = (tA + tB) / 2, dayK = T < tA ? 0 : T < mid ? 1 : 2;
      const appear = pop(T - (dayK === 0 ? st('L57') + .1 : dayK === 1 ? tA : mid));
      ctx.save(); ctx.translate(700, 1130 + (1 - Math.min(1, appear)) * -40); ctx.scale(1.5, 1.5); holdCocoa(ctx); ctx.restore();
      if (T > snw) burst(ctx, 700, 1190, T - snw, { kind: 'sparkle', n: 10, speed: 300, gravity: 0, life: .8, size: 20, seed: 4 });
    },
    ui(ctx, T) {
      const mid = (tA + tB) / 2, d = T < tA ? 1 : T < mid ? 2 : 3, t0 = d === 1 ? st('L57') : d === 2 ? tA : mid;
      ctx.save(); ctx.translate(960, 170); const k = pop(T - t0); ctx.scale(k, k); box(ctx, -160, -50, 320, 100, 24, '#FF5B9B', 8); txt(ctx, 'MORNING ' + d, 0, 2, 52, '#fff', OUTLINE, 8); ctx.restore();
    },
    sfx: [[tA - st('L57'), 'chime', .4], [(tA + tB) / 2 - st('L57'), 'chime', .4], [snw - st('L57'), 'sparkle', .5]] });

  // ===== S58 — who is it from? =====
  const idea = ws('L58', 'idea');
  S.push({ id: 'S58', start: st('L58'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1200, 1.8 + lt * .03),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); p.armR = 1.5; p.handR = .3; p.head = Math.sin(T * 2.2) * .08;
      C(ctx, 'nubi', p, { expr: 'confused', lookX: Math.sin(T * 2) * .8, holding: { R: holdCocoa } }, T);
    },
    ui(ctx, T) { if (T > idea - .3) popText(ctx, '?', 1250, 300, T - idea + .3, { size: 160, fill: '#FFC83D' }); } });

  // ===== S59 — mid CTA =====
  const dur59 = LINE['L59'].end - st('L59') + .6;
  S.push({ id: 'S59', start: st('L59'), trans: 'zoom',
    bg: (ctx, T) => envBurst(ctx, T, '#7B4BFF', '#FF5B9B', .5),
    cam: lt => camAt(540, 1200, 1.2),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 40, y: 1500, s: .8, view: 'q34' }), T, 1), T, 1, .3); p.armR = 1.6 + Math.sin(T * 6) * .1; p.handR = 0;
      C(ctx, 'nubi', p, { expr: 'excited' }, T);
    },
    ui(ctx, T, lt) { drawSubscribe(ctx, lt - .05, dur59, 760); },
    sfx: [[.3, 'click', .5], [.6, 'ding', .5]] });

  return S;
});
