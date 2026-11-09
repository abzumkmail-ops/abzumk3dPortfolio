// shots/part2.js — S20–S39 (L20–L39), 16:9 landscape.
'use strict';
shots(() => {
  const S = [];
  const rel = (id, w, n = 0) => ws(id, w, n) - st(id);

  // ---- local helpers
  const flake = (ctx, x, y, r, rot, a = 1) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= a; ctx.lineCap = 'round';
    for (const [col, w] of [['#6FA8DC', r * .26], ['#fff', r * .13]]) {
      ctx.strokeStyle = col; ctx.lineWidth = w;
      for (let k = 0; k < 6; k++) { ctx.save(); ctx.rotate(k * TAU / 6); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r);
        ctx.moveTo(0, -r * .55); ctx.lineTo(-r * .27, -r * .82); ctx.moveTo(0, -r * .55); ctx.lineTo(r * .27, -r * .82); ctx.stroke(); ctx.restore(); }
    }
    ctx.restore();
  };
  // guy toppling over like a plank. u from fall start tf; dir +1 falls toward +x
  const dropGuy = (ctx, name, x, s, tf, T, dir, face = {}) => {
    const u = clamp((T - tf) / .5), e = u * u;
    const p = P({ x, y: 1500, s, view: 'q34' });
    if (T < tf) { idle(p, T, x); p.rot = Math.sin(T * 5 + x) * .03; } else { p.rot = dir * 1.5708 * e; p.bodyY = (RIG.legH - 40) * s * e; p.armL = .2; p.armR = .2; }
    C(ctx, name, p, Object.assign({ expr: T < tf ? 'neutral' : 'neutral', eyes: { open: T < tf ? 1 : 0 }, noBlink: T >= tf }, face), T);
    if (T > tf + .5) zzz(ctx, x + dir * 260 * s, 1400, T, s * 1.2, x);
    return T > tf && T < tf + .55 ? 1 : 0;
  };
  const GUYS = [['dad', 80], ['grandpa', 290], ['coach', 500], ['kidB', 710], ['kidD', 920], ['uncle', 1130]];
  const bus = (ctx, x, y, s) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    box(ctx, -330, -330, 660, 260, 30, '#FFC83D', 9);
    for (let i = 0; i < 5; i++) box(ctx, -300 + i * 100, -300, 80, 80, 10, '#9BD8FF', 6);
    box(ctx, 220, -300, 90, 130, 10, '#9BD8FF', 6); box(ctx, -330, -190, 660, 18, 0, '#222331', 0);
    txt(ctx, 'SCHOOL BUS', -60, -140, 40, OUTLINE, OUTLINE, 0);
    circle(ctx, -200, -70, 48, '#222331', 8); circle(ctx, 190, -70, 48, '#222331', 8); circle(ctx, -200, -70, 20, '#bbb'); circle(ctx, 190, -70, 20, '#bbb');
    ctx.restore();
  };
  const girlsHall = ['kidA', 'kidC', 'kidE', 'kidF', 'lily', 'teenSister', 'kidI', 'kidK'];

  // ===== S20 — first snowflake falls (slow-mo) =====
  const fellS = ws('L20', 'fell'), snowS = ws('L20', 'snowflake');
  S.push({ id: 'S20', start: st('L20'), trans: 'cut',
    bg: (ctx, T, cam) => envSnowyStreet(ctx, T, cam, { snow: false }),
    cam: lt => camAt(540 + lt * 6, 1130, 1.0 + lt * .02),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 780, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 1);
      C(ctx, 'nubi', np, { expr: T > snowS ? 'surprised' : 'neutral', lookY: -.8, lookX: -.3 }, T);
    },
    ui(ctx, T, lt) {
      const u = clamp(inv(st('L20') + .3, fellS + .3, T)), x = 960 + Math.sin(u * 6) * 220 * (1 - u * .8), y = lerp(-120, 520, u);
      flake(ctx, x, y, 90, Math.sin(u * 5) * .8 + u * 2, T > fellS + 1 ? Math.max(0, 1 - (T - fellS - 1)) : 1);
      if (T > fellS + .3) burst(ctx, 960, 520, T - fellS - .3, { kind: 'sparkle', n: 12, speed: 300, gravity: 0, life: 1.0, size: 16, seed: 2 });
    },
    sfx: [[snowS - st('L20'), 'sparkle', .5]] });

  // ===== S21 — Brayden, favorite thing: talking about himself =====
  const talkT = ws('L21', 'talking');
  S.push({ id: 'S21', start: st('L21'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(740 + lt * 5, 1160, 1.0 + lt * .02),
    draw(ctx, T, lt) {
      for (const [n, x] of [['kidA', 820], ['kidC', 960], ['kidE', 1100]]) {
        const gp = idle(P({ x, y: 1500, s: .76, flip: -1, view: 'q34' }), T, x); gp.armL = .5;
        C(ctx, n, gp, { expr: T > talkT ? 'love' : 'happy' }, T);
      }
      const bp = talk(P({ x: 560, y: 1500, s: .84, view: 'q34' }), T, 3, .6); bp.armR = 1.9; bp.handR = .4; bp.lean = -.08;
      C(ctx, 'brayden', bp, { expr: 'smug' }, T);
      burst(ctx, 590, 1000, T - ws('L21', 'favorite'), { kind: 'sparkle', n: 10, speed: 500, gravity: 100, life: .8, size: 20, seed: 4 });
      const k = smooth(inv(talkT - .2, talkT + .2, T));
      const np = idle(P({ x: 1330, y: 1500, s: .74, flip: -1, view: 'q34' }), T, 8);
      C(ctx, 'nubi', np, { expr: 'neutral', mouth: 'flat', eyes: { open: 1 }, lookX: Math.sin((T - talkT) * 3) * .9 * k, lookY: -.7 * k }, T);
    },
    sfx: [[rel('L21', 'favorite'), 'sparkle', .35]] });

  // ===== S22 — Brayden's brag, snowflake on nose =====
  const mostT = ws('L22', 'most'), honestT = ws('L22', 'honest');
  S.push({ id: 'S22', start: st('L22'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1170, 2.4 + lt * .03),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .8 }), T, 3), T, 3, .5);
      p.head = lerp(0, .35, smooth(inv(mostT, mostT + .5, T))); p.armR = 1.5; p.handR = .4;
      C(ctx, 'brayden', p, { expr: T > mostT + .2 ? 'neutral' : 'smug', mouth: lipShape(T, ['L22']), eyes: { open: 1 - smooth(inv(mostT + .05, mostT + .45, T)) }, noBlink: T > mostT }, T);
    },
    ui(ctx, T, lt) {
      const u = clamp(inv(honestT, mostT, T)), x = lerp(1040, 972, u) + Math.sin(u * 7) * 40 * (1 - u), y = lerp(-60, 470, u * u * .5 + u * .5);
      flake(ctx, x, y, lerp(70, 26, u), u * 4, T > mostT ? Math.max(0, 1 - (T - mostT) * 1.2) : 1);
    },
    sfx: [[mostT - st('L22'), 'sparkle', .5]] });

  // ===== S23 — face first into the snow =====
  const faceT = ws('L23', 'face'), snowT = ws('L23', 'snow');
  S.push({ id: 'S23', start: st('L23'), trans: 'cut',
    bg: (ctx, T, cam) => envSnowyStreet(ctx, T, cam, { snow: true }),
    cam: lt => camAt(560, 1220, 1.4),
    draw(ctx, T, lt) {
      const u = clamp((T - faceT) / .55), e = u * u;
      const p = P({ x: 480, y: 1500, s: .8, view: 'q34' });
      if (T < faceT) talk(p, T, 3, .5); else { p.rot = 2.9 * e; p.bodyY = -Math.max(0, RIG.torsoH + 120 - RIG.legH) * .8 * e; p.armL = lerp(.5, 1.2, u); p.armR = lerp(.5, 1.2, u); }
      C(ctx, 'brayden', p, { expr: T < faceT ? 'smug' : 'neutral', eyes: { open: T < faceT ? 1 : 0 }, noBlink: T >= faceT }, T);
      if (T > faceT + .5) { ellipse(ctx, 520, 1498, 130, 36, '#fff', 8); zzz(ctx, 640, 1250, T, 1.2, 5); }
      burst(ctx, 520, 1480, T - faceT - .5, { kind: 'dust', n: 18, speed: 500, gravity: 600, life: .7, size: 22, colors: ['#fff', '#DDEEFF'], angle: -1.57, spread: 1.4, seed: 3 });
    },
    sfx: [[faceT + .5 - st('L23'), 'thud', .7]] });

  // ===== S24 — dad asleep on the couch with pizza =====
  S.push({ id: 'S24', start: st('L24'), trans: 'cut',
    bg: (ctx, T, cam) => envLivingRoom(ctx, T, cam, { night: false }),
    cam: lt => camAt(430, 1250, 1.5 + lt * .03),
    draw(ctx, T, lt) {
      const p = P({ x: 400, y: 1455, s: .8, view: 'q34' }); p.legL = 1.4; p.legR = 1.4; p.head = -.2 + Math.sin(T * 1.6) * .03; p.armL = .4; p.armR = .4; p.bodyY = 24;
      C(ctx, 'dad', p, { expr: 'neutral', eyes: { open: 0 }, mouth: 'smallOpen', noBlink: true }, T);
      // pizza slice hanging from his mouth
      ctx.save(); ctx.translate(470, 1215 + Math.sin(T * 1.6) * 3); ctx.rotate(.5);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(70, -26); ctx.lineTo(70, 26); ctx.closePath(); fillStroke(ctx, '#FFC83D', 6);
      circle(ctx, 40, -8, 7, '#EE384A'); circle(ctx, 48, 12, 7, '#EE384A'); ctx.restore();
      zzz(ctx, 520, 1100, T, 1.5, 9);
    },
    sfx: [[.5, 'buzz', .2], [2, 'buzz', .2]] });

  // ===== S25 — coach asleep mid whistle =====
  const threeT = ws('L25', 'three'), hoursE = we('L25', 'hours'), whistleT = ws('L25', 'whistle');
  S.push({ id: 'S25', start: st('L25'), trans: 'whip',
    bg: (ctx, T, cam) => envSoccerField(ctx, T, cam, { cheer: 0 }),
    cam: lt => camAt(540, 1150, 1.3 + lt * .02),
    draw(ctx, T, lt) {
      const p = P({ x: 540, y: 1500, s: .8, view: 'q34' }); idle(p, T, 2); p.head = .15 + Math.sin(T * 1.5) * .03; p.rot = Math.sin(T * 1.5) * .02;
      C(ctx, 'coach', p, { expr: 'neutral', eyes: { open: 0 }, mouth: 'round', noBlink: true }, T);
      zzz(ctx, 620, 1050, T, 1.3, 3);
      if (T > whistleT) for (let i = 0; i < 3; i++) { const k = (T * 2 + i / 3) % 1; ctx.save(); ctx.globalAlpha *= 1 - k; ctx.strokeStyle = '#fff'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(620, 1135, 25 + k * 70, -.7, .7); ctx.stroke(); ctx.restore(); }
    },
    ui(ctx, T, lt) {
      if (T < threeT - .1) return;
      const u = easeInOut(clamp(inv(threeT, hoursE, T)));
      ctx.save(); ctx.translate(960, 190); circle(ctx, 0, 0, 100, '#fff', 9);
      for (let i = 0; i < 12; i++) { const a = i * TAU / 12; ctx.strokeStyle = OUTLINE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(Math.sin(a) * 80, -Math.cos(a) * 80); ctx.lineTo(Math.sin(a) * 92, -Math.cos(a) * 92); ctx.stroke(); }
      for (const [a, l, w] of [[u * TAU * 3, 78, 7], [u * TAU * 36, 60, 5]]) { ctx.strokeStyle = '#EE384A'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(a) * l, -Math.cos(a) * l); ctx.stroke(); }
      circle(ctx, 0, 0, 8, OUTLINE); ctx.restore();
      popText(ctx, '3 HOURS LATER', 960, 420, T - hoursE + .2, { size: 90, fill: '#FFD447' });
    },
    sfx: [[whistleT - st('L25'), 'buzz', .4], [hoursE - st('L25'), 'ding', .5]] });

  // ===== S26 — every guy topples like dominoes =====
  const fiveT = ws('L26', 'five'), coldT = ws('L26', 'cold');
  const fallTimes = GUYS.map((g, i) => lerp(fiveT, coldT, i / 5));
  S.push({ id: 'S26', start: st('L26'), trans: 'cut',
    bg: (ctx, T, cam) => envSnowyStreet(ctx, T, cam, { snow: true }),
    cam: lt => camAt(600, 1190, 0.9 + lt * .015),
    draw(ctx, T, lt) {
      for (let i = GUYS.length - 1; i >= 0; i--) dropGuy(ctx, GUYS[i][0], GUYS[i][1], .7, fallTimes[i], T, 1);
    },
    sfx: fallTimes.slice(0, 4).map(t => [t + .45 - st('L26'), 'thud', .5]) });

  // ===== S27 — only nubi standing =====
  const meT = ws('L27', 'me');
  S.push({ id: 'S27', start: st('L27'), trans: 'zoom',
    bg: (ctx, T, cam) => envSnowyStreet(ctx, T, cam, { snow: true }),
    cam: lt => camAt(600, 1190, 0.9 + lt * .03),
    draw(ctx, T, lt) {
      GUYS.forEach(([n, x]) => dropGuy(ctx, n, x, .7, -1e9, T, 1));
      const p = idle(P({ x: 600, y: 1480, s: .8 }), T, 4);
      C(ctx, 'nubi', p, { expr: 'nervous', sweat: T > meT, lookX: Math.sin(T * 1.7) * .8 }, T);
      snowfall(ctx, T, 0);
    },
    ui(ctx, T, lt) { spotlight(ctx, 960, .65 * smooth(inv(meT - .3, meT + .1, T)), '0,0,0'); snowfall(ctx, T, .5); },
    sfx: [[meT - st('L27'), 'impact', .5]] });

  // ===== S28 — mom leaning in =====
  S.push({ id: 'S28', start: st('L28'), trans: 'cut',
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam, {}),
    cam: lt => camAt(560, 1230, 1.5 + lt * .04),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 300, y: 1500, s: .8, view: 'q34' }), T, 2);
      C(ctx, 'nubi', np, { expr: 'nervous', sweat: true }, T);
      const mp = talk(P({ x: 760, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 6, .7); mp.lean = .28 + Math.sin(T * 3) * .02; mp.armR = 1.0;
      C(ctx, 'mom', mp, { expr: 'smug', mouth: lipShape(T, ['L28']) }, T);
    } });

  // ===== S29 — gamer fantasy =====
  const monthsT = ws('L29', 'months');
  S.push({ id: 'S29', start: st('L29'), trans: 'cut',
    bg: (ctx, T) => envBurst(ctx, T, '#7B4BFF', '#FF5B9B', .5),
    cam: lt => camAt(540, 1150, 1.7 + lt * .04),
    draw(ctx, T, lt) {
      const p = celebrate(P({ x: 540, y: 1500, s: .8 }), T, 1);
      C(ctx, 'nubi', p, { expr: 'excited', mouth: lipShape(T, ['L29']), holding: { R: holdGameController } }, T);
      burst(ctx, 540, 800, T - monthsT, { kind: 'star', n: 24, speed: 800, gravity: 300, life: 1.0, size: 22, seed: 5 });
    },
    ui(ctx, T, lt) { popText(ctx, '4 MONTHS OF GAMES', 960, 190, T - monthsT, { size: 80, fill: '#FFD447' }); },
    sfx: [[monthsT - st('L29'), 'sparkle', .5]] });

  // ===== S30 — mom points at the bus =====
  const schoolT = ws('L30', 'school');
  S.push({ id: 'S30', start: st('L30'), trans: 'zoom',
    bg: (ctx, T, cam) => envFrontYard(ctx, T, cam, { snow: true }),
    cam: lt => camAt(620, 1240, 1.3 + lt * .03),
    draw(ctx, T, lt) {
      const bx = lerp(1700, 960, easeOut(inv(schoolT - .3, schoolT + .9, T)));
      bus(ctx, bx, 1620, .75);
      const np = idle(P({ x: 260, y: 1500, s: .8, view: 'q34' }), T, 2);
      C(ctx, 'nubi', np, { expr: T > schoolT ? 'terrified' : 'sad' }, T);
      const mp = idle(P({ x: 520, y: 1500, s: .8, view: 'q34' }), T, 6); mp.armR = 1.57; mp.armL = .2;
      C(ctx, 'mom', mp, { expr: 'neutral', mouth: 'flat', eyes: { open: .55 }, lipSync: 0 }, T);
    },
    sfx: [[schoolT - st('L30'), 'record', .6]] });

  // ===== S31 — walks into Maple High =====
  S.push({ id: 'S31', start: st('L31'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(lerp(380, 820, clamp(lt / 4.5)), 1160, 1.0 + lt * .015),
    draw(ctx, T, lt) {
      ctx.save(); ctx.translate(700, 600); box(ctx, -270, -60, 540, 120, 16, '#2E6BD8', 9); txt(ctx, 'MAPLE HIGH', 0, 0, 74, '#fff', OUTLINE, 9); ctx.restore();
      ['kidA', 'kidE', 'kidK'].forEach((n, i) => { const x = 980 + i * 150; const p = idle(P({ x, y: 1430, s: .6, flip: lt > 2 + i * .3 ? -1 : 1, view: 'q34' }), T, i); C(ctx, n, p, { expr: lt > 2 + i * .3 ? 'surprised' : 'happy' }, T); });
      const nx = lerp(40, 640, clamp(lt / 4.5)), np = walk(P({ x: nx, y: 1500, s: .8, view: 'q34' }), T, 1.1);
      C(ctx, 'nubi', np, { expr: 'nervous' }, T);
    },
    sfx: [[.3, 'step', .3], [1.0, 'step', .3], [1.7, 'step', .3], [2.4, 'step', .3]] });

  // ===== S32 — 600 : 1 =====
  const sixT = ws('L32', 'six');
  S.push({ id: 'S32', start: st('L32'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1130, .85 + lt * .015),
    draw(ctx, T, lt) {
      const back = [20, 230, 430, 650, 850, 1050], front = [-60, 150, 330, 750, 930, 1110];
      back.forEach((x, i) => C(ctx, girlsHall[i % 8], idle(P({ x, y: 1410, s: .6, flip: x < 540 ? 1 : -1, view: 'q34' }), T, i), { expr: 'happy', lookX: x < 540 ? .8 : -.8 }, T));
      front.forEach((x, i) => C(ctx, girlsHall[(i + 3) % 8], idle(P({ x, y: 1500, s: .72, flip: x < 540 ? 1 : -1, view: 'q34' }), T, i + 9), { expr: 'excited', lookX: x < 540 ? .8 : -.8 }, T));
      const np = idle(P({ x: 540, y: 1500, s: .6 }), T, 3); C(ctx, 'nubi', np, { expr: 'nervous', sweat: true }, T);
    },
    ui(ctx, T) { popText(ctx, '600 : 1', 960, 240, T - sixT, { size: 110, fill: '#30CE65' }); },
    sfx: [[sixT - st('L32'), 'ding', .5]] });

  // ===== S33 — the bruh stare =====
  const tenT = ws('L33', 'ten');
  S.push({ id: 'S33', start: st('L33'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(595, 1190, 1.3 + lt * .02),
    draw(ctx, T, lt) {
      [['kidA', 250], ['kidC', 480], ['kidE', 710], ['kidF', 940]].forEach(([n, x]) => {
        const p = P({ x, y: 1500, s: .8, flip: -1, view: 'q34' });
        C(ctx, n, p, { expr: 'neutral', mouth: 'flat', eyes: { open: 1, pupil: .7 }, noBlink: true, lookX: -1 }, T);
      });
    },
    ui(ctx, T, lt) {
      const secs = Math.round(10 * clamp(inv(st('L33') + .8, tenT, T)));
      box(ctx, 960 - 200, 90, 400, 90, 20, '#222331', 8); txt(ctx, `SILENCE: ${secs}s`, 960, 136, 48, '#fff', OUTLINE, 8);
    },
    sfx: [[.8, 'tick', .4], [1.8, 'tick', .4], [2.8, 'tick', .4]] });

  // ===== S34 — girls rush him =====
  const evT = ws('L34', 'everyone'), qT = ws('L34', 'questions');
  S.push({ id: 'S34', start: st('L34'), trans: 'whip',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(720, 1180, 1.0),
    draw(ctx, T, lt) {
      const names = ['kidA', 'kidC', 'kidE', 'kidF', 'kidI', 'kidK'];
      names.forEach((n, i) => { const t1 = evT + i * .12, x = lerp(1800 + i * 90, 560 + (i % 3) * 110, easeOut(inv(t1, t1 + 1.1, T))), moving = T > t1 && T < t1 + 1.1;
        const p = moving ? run(P({ x, y: i % 2 ? 1430 : 1500, s: i % 2 ? .66 : .78, flip: -1, view: 'q34' }), T, 1.4) : idle(P({ x, y: i % 2 ? 1430 : 1500, s: i % 2 ? .66 : .78, flip: -1, view: 'q34' }), T, i);
        if (T > t1 + 1.1) p.armL = 2.4; C(ctx, n, p, { expr: 'excited' }, T); });
      const np = idle(P({ x: 260, y: 1500, s: .8, view: 'q34' }), T, 1); if (T > evT + .3) surprise(np, T - evT - .3);
      C(ctx, 'nubi', np, { expr: T > evT + .3 ? 'terrified' : 'neutral', sweat: T > qT }, T);
    },
    sfx: [[0, 'whoosh', .4]] });

  // ===== S35 — three questions =====
  const q = (id, sid, who, x, text, trans, extra) => S.push({ id: sid, start: sid === 'S35' ? st('L35') : ws('L35', extra.w) - .08, trans,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1170, 2.4 + lt * .04),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .8 }), T, x), T, x, .6);
      C(ctx, who, p, { expr: extra.expr, mouth: lipShape(T, ['L35']), holding: extra.hold }, T);
    },
    ui(ctx, T, lt) { popText(ctx, text, 960, 170, lt, { size: 64, fill: '#fff' }); },
    sfx: [[.1, 'pop', .5]] });
  q('L35', 'S35', 'kidA', 3, "WHY AREN'T YOU ASLEEP?", 'cut', { expr: 'confused' });
  q('L35', 'S35b', 'kidC', 5, 'ARE YOU A VAMPIRE?', 'cut', { w: 'are', expr: 'excited' });
  q('L35', 'S35c', 'kidE', 7, 'CAN YOU OPEN THIS JAR?', 'cut', { w: 'can', expr: 'happy', hold: { R: holdJar } });

  // ===== S36 — guy stuff checklist =====
  const onlyT = ws('L36', 'only'), expertT = ws('L36', 'expert'), stuffT = ws('L36', 'stuff'), guyT = ws('L36', 'guy', 1);
  S.push({ id: 'S36', start: st('L36'), trans: 'cut',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(660, 1220, 1.4 + lt * .02),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 420, y: 1500, s: .8, view: 'q34' }), T, 1);
      C(ctx, 'nubi', p, { expr: 'nervous', sweat: true, lookX: .6 }, T);
    },
    ui(ctx, T, lt) {
      const k = smooth(inv(onlyT - .2, onlyT + .2, T)); ctx.save(); ctx.globalAlpha *= k; ctx.translate(1380, 470 + (1 - k) * 40);
      box(ctx, -270, -210, 540, 420, 24, '#FFF8E0', 9); txt(ctx, 'GUY STUFF:', 0, -160, 56, '#7B4BFF', OUTLINE, 0);
      [['JARS', expertT], ['SPIDERS', expertT + .5], ['TECH', stuffT]].forEach(([s, t], i) => {
        if (T < t - .1) return; const y = -70 + i * 100; box(ctx, -230, y - 32, 64, 64, 10, '#fff', 7); txt(ctx, s, 20, y, 54, OUTLINE, OUTLINE, 0);
        if (T > t) { ctx.strokeStyle = '#30CE65'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-222, y); ctx.lineTo(-200, y + 22); ctx.lineTo(-170, y - 26); ctx.stroke(); } });
      ctx.restore();
    },
    sfx: [[expertT - st('L36'), 'hud', .5], [expertT + .5 - st('L36'), 'tick', .4], [stuffT - st('L36'), 'tick', .4]] });

  // ===== S37 — ATTEMPT 1 title card =====
  S.push({ id: 'S37', start: st('L37'), trans: 'flash',
    bg: (ctx, T) => envBurst(ctx, T, '#EE384A', '#FF8528', .6),
    cam: lt => camAt(540, 1130, 1.0 + lt * .03),
    draw(ctx, T, lt) { ctx.save(); ctx.translate(540, 1270 + Math.sin(T * 3) * 8); ctx.rotate(Math.sin(T * 2) * .05); ctx.scale(3.4, 3.4); holdJar(ctx); ctx.restore(); },
    ui(ctx, T, lt) { stamp(ctx, 'ATTEMPT 1: THE JAR', 960, 330, lt, '#FFD447', 1.3); },
    sfx: [[.1, 'impact', .7]] });

  // ===== S38 — pulling so hard, ancestors =====
  const ancT = ws('L38', 'ancestors'), notT = ws('L38', 'not');
  S.push({ id: 'S38', start: st('L38'), trans: 'cut',
    bg: (ctx, T, cam) => envClassroom(ctx, T, cam, {}),
    cam: lt => camAt(540, 1200, 1.6 + lt * .03),
    draw(ctx, T, lt) {
      const ga = smooth(inv(ancT - .1, ancT + .5, T)) * .55;
      if (ga > 0) [[250, .7], [830, .7], [90, .55], [990, .55]].forEach(([x, s], i) => { const gp = P({ x, y: 1440 - (i > 1 ? 50 : 0), s, view: 'q34', flip: x < 540 ? 1 : -1 }); idle(gp, T, i);
        drawSilhouette(ctx, c2 => drawCharacter(c2, 'grandpa', gp, { expr: 'neutral' }, T), ga, '#BFE8FF'); });
      const eff = clamp(inv(st('L38') + .3, notT, T)), sh = Math.sin(T * 38) * 5 * eff;
      const p = idle(P({ x: 540 + sh, y: 1500, s: .8 }), T, 1); p.lean = .12 * eff; p.armL = 1.1; p.armR = 1.1; p.bodyY += Math.abs(Math.sin(T * 19)) * 4 * eff;
      C(ctx, 'nubi', p, { expr: 'determined', red: eff, vein: eff > .3, sweat: eff > .4, holding: { L: holdJar } }, T);
    },
    ui(ctx, T, lt) { popText(ctx, 'NOPE.', 960, 250, T - notT, { size: 100, fill: '#EE384A' }); },
    sfx: [[.2, 'slip', .4], [notT - st('L38'), 'buzz', .4]] });

  // ===== S39 — she opens it one-handed =====
  const oneT = ws('L39', 'one'), textT = ws('L39', 'texting');
  S.push({ id: 'S39', start: st('L39'), trans: 'cut',
    bg: (ctx, T, cam) => envClassroom(ctx, T, cam, {}),
    cam: lt => camAt(560, 1230, 1.5 + lt * .02),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 1); np.head = .1; np.armL = .1; np.armR = .1;
      C(ctx, 'nubi', np, { expr: 'sad' }, T);
      const cp = idle(P({ x: 760, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 3); cp.armR = 1.3 + (T > oneT + .5 ? Math.sin((T - oneT) * 14) * .12 : 0); cp.armL = 1.2;
      C(ctx, 'kidC', cp, { expr: 'neutral', mouth: 'flat', eyes: { open: .7 }, lookY: .8, lookX: .3, holding: { R: holdJar, L: holdPhone } }, T);
      burst(ctx, 640, 1110, T - oneT - .7, { kind: 'star', n: 10, speed: 500, gravity: 400, life: .6, size: 16, seed: 8 });
    },
    ui(ctx, T, lt) { stamp(ctx, 'L', 960, 380, T - textT, '#EE384A', 2.2); },
    sfx: [[oneT + .7 - st('L39'), 'pop', .6], [textT - st('L39'), 'sad_trombone', .5]] });

  return S;
});
