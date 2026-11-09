// shots/part5.js — S81..S100 (L81..L100)
'use strict';
shots(() => {
  const S = [];
  const MEN = ['brayden', 'dad', 'coach', 'kidB', 'kidD', 'uncle', 'dad2', 'lifeguard', 'principal', 'police', 'firefighter', 'busDriver'];
  const BAGS = ['#3E7BD8', '#E0533D', '#30A045', '#8B5BD8', '#E8A33D', '#2BB5B0'];
  const FRONT = [100, 430, 760, 1090], BACK = [160, 420, 680, 940, 1200];
  const end = id => LINE[id].end;

  // sleeper that sits up (stretching) at time tSit (+ small per-guy delay)
  function sitter(ctx, name, x, y, s, T, k, bag, face) {
    const px = x - 80 * s, ex = Math.sin(T * 9 + x) * .12;
    const p = P({ x: px, y: y + 90 * s, s, armL: 2.5 * k + ex, armR: 2.5 * k - ex, handL: -.6, handR: -.6, head: .08 * (1 - k) });
    C(ctx, name, p, Object.assign({ expr: k > .8 ? 'surprised' : 'neutral', eyes: { open: k > .15 ? 1 : 0 } }, face || {}), T);
    box(ctx, px - 120 * s, y - 100 * s, 240 * s, 200 * s, 60 * s, bag, 8);
  }
  // rows of 9 guys. mode: tSit null = all asleep; glow = 0..1 halo
  function hall(ctx, T, tSit, glow) {
    const rows = [[BACK, 1390, .55, 0], [FRONT, 1500, .7, 5]];
    for (const [xs, y, s, o] of rows) xs.forEach((x, i) => {
      const nm = MEN[(i + o) % MEN.length], bag = BAGS[(i + o) % BAGS.length], d = hash(x + o) * .35;
      if (glow > 0) { ctx.save(); ctx.globalAlpha *= glow * (.55 + .2 * Math.sin(T * 3 + i)); ellipse(ctx, x - 130 * s, y - 80 * s, 230 * s, 120 * s, '#FFE680', 0); ctx.restore(); }
      if (tSit != null && T > tSit + d) sitter(ctx, nm, x, y, s, T, easeOut(inv(tSit + d, tSit + d + .55, T)), bag);
      else sleeper(ctx, nm, x, y, s, T, { bag });
    });
  }
  const girlsRow = ['kidA', 'kidC', 'kidE', 'kidF', 'teenSister', 'kidK', 'aunt', 'cousin', 'babysitter', 'librarian'];

  // ===== S81 — grandpa wistful =====
  const gGirl = ws('L81', 'girl');
  S.push({ id: 'S81', start: st('L81'), trans: 'cut', capY: 960,
    bg: (ctx, T) => envSoft(ctx, T, '#FFD9B0', '#FF9BB5'),
    cam: lt => camAt(540, 1170, 2.3 + lt * .03),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .8 }), T, 2), T, 2, .35);
      C(ctx, 'grandpa', p, { expr: T > gGirl ? 'love' : 'sad', mouth: lipShape(T, ['L81']) }, T);
      burst(ctx, 700, 1000, T - gGirl, { kind: 'heart', n: 10, speed: 300, gravity: -60, life: 1.4, size: 24, angle: -1.57, spread: 1.2 });
    },
    sfx: [[0, 'swell', .4]] });

  // ===== S82 — photo, then sepia flashback dance =====
  const gPhoto = ws('L82', 'photo'), gCouple = ws('L82', 'couple');
  S.push({ id: 'S82', start: st('L82'), trans: 'zoom', capY: 960,
    bg: (ctx, T, cam) => envLivingRoom ? envLivingRoom(ctx, T, cam, { night: true }) : envSoft(ctx, T, '#FFD9B0', '#FF9BB5'),
    cam: lt => camAt(540, 1200, lerp(1.4, 1.7, smooth(inv(0, 2.5, lt)))),
    draw(ctx, T, lt) {
      const g = idle(P({ x: 400, y: 1500, s: .8, view: 'q34' }), T, 1); g.armR = 1.9 + Math.sin(T * 2) * .05; g.handR = .3;
      C(ctx, 'grandpa', g, { expr: 'happy', holding: { R: holdPhoto } }, T);
      const n = idle(P({ x: 780, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 3);
      C(ctx, 'nubi', n, { expr: 'happy', lookX: -.5 }, T);
    },
    sfx: [[0, 'whoosh', .3]] });
  S.push({ id: 'S82b', start: gCouple - .08, trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .5, banner: 'WINTER DANCE' }),
    cam: lt => camAt(540, 1200, 1.3 + lt * .03),
    draw(ctx, T, lt) {
      const a = danceP(0, T), b = danceP(1, T);
      Object.assign(a, { x: 450, y: 1500, s: .8 }); Object.assign(b, { x: 640, y: 1500, s: .8 });
      C(ctx, 'grandma', b, { expr: 'happy' }, T); C(ctx, 'grandpa', a, { expr: 'happy' }, T);
      burst(ctx, 540, 1000, T, { kind: 'heart', n: 6, speed: 150, gravity: -40, life: 2, size: 20, angle: -1.57, spread: .8, seed: 4 });
    },
    ui(ctx, T, lt) { ctx.fillStyle = 'rgba(150,100,40,.38)'; ctx.fillRect(0, 0, W, H); vignette(ctx, .5, '60,30,10');
      ctx.save(); ctx.globalAlpha *= .5; box(ctx, 60, 60, W - 120, H - 120, 0, 'rgba(0,0,0,0)', 14); ctx.restore(); },
    sfx: [[0, 'sparkle', .4]] });

  // ===== S83 — grandpa hand on shoulder =====
  const g6 = ws('L83', 'six'), g1 = ws('L83', 'one');
  S.push({ id: 'S83', start: st('L83'), trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam, { night: true }),
    cam: lt => camAt(540, 1230, 1.5 + lt * .02),
    draw(ctx, T, lt) {
      const g = talk(idle(P({ x: 360, y: 1500, s: .8, view: 'q34' }), T, 2), T, 2, .35); g.armR = 1.1; g.handR = .2;
      C(ctx, 'grandpa', g, { expr: 'happy', mouth: lipShape(T, ['L83']) }, T);
      const n = idle(P({ x: 700, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 5);
      C(ctx, 'nubi', n, { expr: T > g1 ? 'shy' : 'nervous', lookX: -.4 }, T);
    },
    ui(ctx, T) { popText(ctx, '600', 960, 250, T - g6, { size: 110, fill: '#FFD447', dur: g1 - g6 + .2 }); popText(ctx, 'ONLY 1', 960, 250, T - g1, { size: 100, fill: '#30CE65' }); },
    sfx: [[g6 - st('L83'), 'pop', .4], [g1 - st('L83'), 'ding', .5]] });

  // ===== S84 — lightbulb =====
  const rz = ws('L84', 'realized');
  S.push({ id: 'S84', start: st('L84'), trans: 'zoom', capY: 960,
    bg: (ctx, T) => envBurst(ctx, T, '#FFD447', '#FF9B3D', .5),
    cam: lt => camAt(540, 1170, 2.3 + lt * .05),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); if (T > rz) surprise(p, T - rz);
      C(ctx, 'nubi', p, { expr: T > rz ? 'excited' : 'confused', lookY: -.4, mouth: lipShape(T, ['L84']) }, T);
    },
    ui(ctx, T) { const k = pop(T - rz); if (k <= 0) return; ctx.save(); ctx.translate(1300, 260); ctx.scale(k, k);
      circle(ctx, 0, 0, 70, '#FFF27A', 8); box(ctx, -28, 62, 56, 40, 8, '#B8B8C8', 7);
      for (let i = 0; i < 8; i++) { const a = i * TAU / 8; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 95, Math.sin(a) * 95); ctx.lineTo(Math.cos(a) * 130, Math.sin(a) * 130); ctx.lineWidth = 8; ctx.strokeStyle = '#FFF27A'; ctx.stroke(); }
      ctx.restore(); },
    sfx: [[rz - st('L84'), 'ding', .6]] });

  // ===== S85 — names become PARTNER icons =====
  const nNeed = ws('L85', 'needed'), nPart = ws('L85', 'partner'), nAny = ws('L85', 'any');
  S.push({ id: 'S85', start: st('L85'), trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1130, 1.0 + lt * .02),
    draw(ctx, T, lt) { signupSheet(ctx, 540, 1150, 28, 1.6); },
    ui(ctx, T, lt) {
      const rows = 6, cols = 2;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const x = 960 + (c - .5) * 520, y = 170 + r * 120, t0 = nPart + (r * cols + c) * .06;
        box(ctx, x - 230, y - 42, 460, 84, 20, '#FFFFFF', 7);
        const k = pop(T - t0);
        if (T < t0) { const rr = rng(r * 7 + c); ctx.strokeStyle = ['#2E6BD8', '#EE384A', '#FF5B9B', '#30A045'][(r + c) % 4]; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 200, y); for (let q = 1; q < 14; q++) ctx.lineTo(x - 200 + q * 22, y + (rr() - .5) * 20); ctx.stroke();
          if (T > nNeed) { ctx.strokeStyle = '#EE384A'; ctx.beginPath(); ctx.moveTo(x - 210, y - 30); ctx.lineTo(x + 210, y + 30); ctx.stroke(); } }
        else { ctx.save(); ctx.translate(x, y); ctx.scale(Math.min(1.1, k), Math.min(1.1, k)); box(ctx, -225, -38, 450, 76, 18, '#30CE65', 7); circle(ctx, -170, -8, 16, '#fff', 4); ellipse(ctx, -170, 24, 26, 14, '#fff', 4); txt(ctx, 'PARTNER', 30, 2, 44, '#fff', OUTLINE, 8); ctx.restore(); }
      }
    },
    sfx: [[nNeed - st('L85'), 'buzz', .3], [nPart - st('L85'), 'pop', .5], [nAny - st('L85'), 'pop', .4]] });

  // ===== S86 — three hundred partners asleep =====
  const h3 = ws('L86', 'three'), hAs = ws('L86', 'asleep');
  S.push({ id: 'S86', start: st('L86'), trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .35, banner: 'HIBERNATION HALL' }),
    cam: lt => camAt(540, 1140, .85 + lt * .015),
    draw(ctx, T, lt) { hall(ctx, T, null, smooth(inv(hAs - .3, hAs + .2, T))); },
    ui(ctx, T) { popText(ctx, '300', 960, 230, T - h3, { size: 110, fill: '#FFD447', dur: 2.2 }); },
    sfx: [[h3 - st('L86'), 'pop', .5], [hAs - st('L86'), 'magic', .4]] });

  // ===== S87 — principal's office =====
  const walkT0 = st('L87');
  S.push({ id: 'S87', start: walkT0, trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envClassroom(ctx, T, cam, { board: 'PRINCIPAL' }),
    cam: lt => camAt(540, 1160, 1.0 + lt * .02),
    draw(ctx, T, lt) {
      const pr = idle(P({ x: 820, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 4); pr.armL = .2;
      C(ctx, 'principalF', pr, { expr: 'neutral' }, T);
      const k = easeOut(inv(walkT0, walkT0 + 1.6, T)), x = lerp(-150, 430, k);
      const n = k < 1 ? walk(P({ x, y: 1500, s: .8, view: 'q34' }), T, 1.2) : idle(P({ x, y: 1500, s: .8, view: 'q34' }), T, 2);
      C(ctx, 'nubi', n, { expr: 'determined' }, T);
    },
    sfx: [[.2, 'step', .4], [.7, 'step', .4], [1.2, 'step', .4]] });

  // ===== S88 — the pitch =====
  const w11 = ws('L88', 'eleven'), wLast = ws('L88', 'last'), wGym = ws('L88', 'gym'), wHib = ws('L88', 'hibernation');
  const items = [[w11, '11:30 PM  -  DANCE STARTS'], [wLast, 'LAST NIGHT OF WINTER'], [wGym, 'LOCATION: THE GYM'], [wHib, 'NEXT TO HIBERNATION HALL']];
  S.push({ id: 'S88', start: st('L88'), trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envClassroom(ctx, T, cam, { board: 'PRINCIPAL' }),
    cam: lt => camAt(540, 1230, 1.4 + lt * .015),
    draw(ctx, T, lt) {
      const n = talk(idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 2), T, 2, .4); n.armR = 1.5 + Math.sin(T * 3) * .15;
      C(ctx, 'nubi', n, { expr: 'determined', holding: { R: holdSign('PLAN') } }, T);
      C(ctx, 'principalF', idle(P({ x: 780, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 4), { expr: 'neutral' }, T);
    },
    ui(ctx, T) { items.forEach(([t0, s], i) => { const k = pop(T - t0); if (k <= 0) return; ctx.save(); ctx.translate(430, 190 + i * 100); ctx.scale(Math.min(1, k), Math.min(1, k));
      box(ctx, -380, -40, 760, 80, 18, '#FFF8E0', 7); txt(ctx, s, 0, 2, 38, OUTLINE, OUTLINE, 0); ctx.restore(); }); },
    sfx: items.map(([t0]) => [t0 - st('L88'), 'pop', .5]) });

  // ===== S89 — principal skeptical =====
  S.push({ id: 'S89', start: st('L89'), trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envClassroom(ctx, T, cam, { board: 'PRINCIPAL' }),
    cam: lt => camAt(540, 1170, 2.3 + lt * .04),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .8 }), T, 4), T, 4, .3); p.armL = .3; p.armR = .3; p.head = .08;
      C(ctx, 'principalF', p, { expr: 'confused', mouth: lipShape(T, ['L89']) }, T);
    } });

  // ===== S90 — forecast, principal smiles =====
  const fc = ws('L90', 'forecast'), mid = ws('L90', 'midnight');
  S.push({ id: 'S90', start: st('L90'), trans: 'zoom', capY: 960,
    bg: (ctx, T, cam) => envClassroom(ctx, T, cam, { board: 'PRINCIPAL' }),
    cam: lt => camAt(540, 1230, 1.4 + lt * .02),
    draw(ctx, T, lt) {
      const n = idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 2); n.armR = 1.6;
      C(ctx, 'nubi', n, { expr: 'smug', mouth: lipShape(T, ['L90']), holding: { R: holdPhone } }, T);
      const pr = idle(P({ x: 780, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 4);
      C(ctx, 'principalF', pr, { expr: T > mid ? 'happy' : 'confused' }, T);
    },
    ui(ctx, T) { const k = pop(T - fc); ctx.save(); ctx.translate(960, 150); ctx.scale(Math.min(1, k), Math.min(1, k));
      box(ctx, -480, -65, 960, 130, 28, '#1E2A4A', 8); circle(ctx, -400, 0, 34, '#fff', 5); txt(ctx, 'FORECAST', -120, -22, 32, '#7FD4FF', OUTLINE, 0); txt(ctx, 'SNOW MELTS 12:00 AM', 40, 22, 46, '#fff', OUTLINE, 8); ctx.restore();
      if (T > mid) burst(ctx, 1200, 330, T - mid, { kind: 'sparkle', n: 10, speed: 300, life: .8, size: 18 }); },
    sfx: [[fc - st('L90'), 'pop', .4], [mid - st('L90'), 'ding', .6]] });

  // ===== S91 — the dance =====
  S.push({ id: 'S91', start: st('L91'), trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .5, banner: 'WINTER DANCE' }),
    cam: lt => camAt(540, 1140, .85 + lt * .02),
    draw(ctx, T, lt) {
      for (let i = 0; i < 5; i++) { const x = 100 + i * 250; sleeper(ctx, MEN[i], x + 180, 1380, .55, T, { bag: BAGS[i] }); }
      [['kidA', 150], ['kidC', 400], ['kidE', 650], ['kidF', 900], ['teenSister', 1150]].forEach(([n, x], i) => {
        const p = danceP(i, T); Object.assign(p, { x, y: 1520, s: .7 }); C(ctx, n, p, { expr: 'happy' }, T); });
    },
    sfx: [[0, 'cheer', .3]] });

  // ===== S92 — the long line =====
  S.push({ id: 'S92', start: st('L92'), trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .5, banner: 'WINTER DANCE' }),
    cam: lt => camAt(lerp(380, 720, smooth(inv(0, 5, lt))), 1140, .85),
    draw(ctx, T, lt) {
      for (let i = 0; i < 6; i++) { const x = -250 + i * 170, p = idle(P({ x: x + 60, y: 1410, s: .55, view: 'q34' }), T, i + 20); C(ctx, girlsRow[(i + 4) % 10], p, { expr: 'excited', lookX: .6 }, T); }
      for (let i = 0; i < 6; i++) { const x = -150 + i * 170, p = idle(P({ x, y: 1510, s: .72, view: 'q34' }), T, i + 3); p.armL = Math.sin(T * 4 + i) * .2 + .3;
        C(ctx, girlsRow[i], p, { expr: 'excited', lookX: .6 }, T); if (i % 2 == 0) burst(ctx, x, 1090, T + i, { kind: 'heart', n: 1, speed: 100, life: 1.2, size: 20, angle: -1.57, spread: .3, gravity: -30 }); }
      const n = idle(P({ x: 1000, y: 1510, s: .72, view: 'q34', flip: -1 }), T, 1);
      C(ctx, 'nubi', n, { expr: T > ws('L92', 'waiting') ? 'nervous' : 'neutral', lookX: -.4 }, T);
    },
    sfx: [] });

  // ===== S93 — Lily alone, far back =====
  S.push({ id: 'S93', start: st('L93'), trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .6, banner: 'WINTER DANCE' }),
    cam: lt => camAt(540, lerp(1150, 1260, smooth(inv(0, 3.5, lt))), lerp(1.0, 1.7, smooth(inv(0, 3.5, lt)))),
    draw(ctx, T, lt) {
      const l = idle(P({ x: 540, y: 1400, s: .6, view: 'q34' }), T, 5); l.armR = 1.1 + Math.sin(T * 5) * .15; l.armL = .4;
      C(ctx, 'lily', l, { expr: 'happy', lookY: .4, holding: { L: holdSketchbook } }, T);
      for (const [n, x] of [['kidA', 150], ['kidC', 330], ['kidE', 780], ['kidF', 960]]) { const g = idle(P({ x, y: 1600, s: .95, view: 'back' }), T, x); C(ctx, n, g, { expr: 'happy' }, T); }
    },
    sfx: [[ws('L93', 'lily') - st('L93'), 'tick', .4]] });

  // ===== S94 — walking past the line =====
  const t95 = st('L95');
  S.push({ id: 'S94', start: st('L94'), trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .5, banner: 'WINTER DANCE' }),
    cam: lt => { const T = lt + st('L94'); return camAt(lerp(150, 950, inv(st('L94'), t95, T)) + 250, 1180, 1.0); },
    draw(ctx, T, lt) {
      const k = inv(st('L94'), t95, T), nx = lerp(100, 900, k);
      for (let i = 0; i < 9; i++) { const x = -100 + i * 200, f = nx > x ? 1 : -1; C(ctx, girlsRow[i], idle(P({ x, y: 1400, s: .62, view: 'q34', flip: f, head: -.12 * f }), T, i + 1), { expr: 'love', lookX: f * .7 }, T); }
      const n = walk(P({ x: nx, y: 1510, s: .8, view: 'q34' }), T, 1.1);
      C(ctx, 'nubi', n, { expr: 'determined' }, T);
    },
    sfx: [[.3, 'step', .3], [1.0, 'step', .3], [1.7, 'step', .3]] });

  // ===== S95 — "I'm taken. Well, I'm hoping." =====
  const taken = ws('L95', 'taken'), hoping = ws('L95', 'hoping');
  S.push({ id: 'S95', start: t95, trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .5, banner: 'WINTER DANCE' }),
    cam: lt => camAt(540, 1230, 1.5 + lt * .02),
    draw(ctx, T, lt) {
      const n = talk(idle(P({ x: 400, y: 1500, s: .8, view: 'q34' }), T, 2), T, 2, .35);
      C(ctx, 'nubi', n, { expr: T > hoping ? 'shy' : 'nervous', blush: T > taken ? .8 : 0, sweat: T > hoping, mouth: lipShape(T, ['L95']) }, T);
      for (const [nm, x, d] of [['kidA', 780, 0], ['kidC', 980, .1]]) { const g = idle(P({ x, y: 1500, s: .8, view: 'q34', flip: -1 }), T, x); C(ctx, nm, g, { expr: T > hoping + d ? 'love' : 'sad' }, T); }
    },
    ui(ctx, T) { popText(ctx, 'AWWW', 1350, 300, T - hoping - .2, { size: 90, fill: '#FF5B9B', rot: -.1 }); },
    sfx: [[hoping + .2 - t95, 'pop', .4]] });

  // ===== S96 — 11:59, clock + sleepers twitching =====
  const t96 = st('L96'), s59 = ws('L96', 'nine');
  S.push({ id: 'S96', start: t96, trans: 'zoom', capY: 960,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .6, banner: 'WINTER DANCE' }),
    cam: lt => camAt(540, 1280, 1.15 + lt * .02),
    draw(ctx, T, lt) {
      const j = Math.max(0, T - s59) > 0 ? 1 : .3;
      [0, 1, 2, 3].forEach(i => sleeper(ctx, MEN[i], 100 + i * 330 + Math.sin(T * 40 + i) * 3 * j, 1500, .7, T, { bag: BAGS[i], face: { expr: T > s59 ? 'angry' : 'neutral' } }));
    },
    ui(ctx, T, lt) {
      ctx.save(); ctx.translate(760, 330); circle(ctx, 0, 0, 190, '#FFF8E0', 10);
      for (let i = 0; i < 12; i++) { const a = i * TAU / 12; ctx.beginPath(); ctx.moveTo(Math.sin(a) * 160, -Math.cos(a) * 160); ctx.lineTo(Math.sin(a) * 178, -Math.cos(a) * 178); ctx.lineWidth = 6; ctx.strokeStyle = OUTLINE; ctx.stroke(); }
      const hand = (a, l, w, c) => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(a) * l, -Math.cos(a) * l); ctx.lineWidth = w; ctx.strokeStyle = c; ctx.lineCap = 'round'; ctx.stroke(); };
      hand(TAU * (59 / 60), 150, 8, OUTLINE); hand(TAU * (11.98 / 12), 100, 12, OUTLINE); hand((T - t96) * TAU / 1.2, 160, 4, '#EE384A'); circle(ctx, 0, 0, 12, OUTLINE); ctx.restore();
    },
    sfx: [[0, 'tick', .5], [.5, 'tick', .5], [1.0, 'tick', .5], [s59 - t96, 'hud', .4]] });

  // ===== S97 — MIDNIGHT, snow melts, flowers =====
  const t97 = st('L97');
  S.push({ id: 'S97', start: t97, trans: 'flash', capY: 960,
    bg: (ctx, T, cam) => envFrontYard(ctx, T, cam, {}),
    cam: lt => camAt(540, 1130, .9 + lt * .04),
    draw(ctx, T, lt) {
      const m = inv(t97, t97 + 1.4, T);
      for (let i = 0; i < 9; i++) ellipse(ctx, -100 + i * 170, 1535, 110 * (1 - m), 26 * (1 - m), '#fff', 5 * (1 - m));
      for (let i = 0; i < 14; i++) { const x = -150 + i * 115 + hash(i) * 40, k = easeOut(inv(t97 + .2 + i * .05, t97 + .7 + i * .05, T)); if (k <= 0) continue;
        const h = 90 * k, y = 1580 + hash(i + 9) * 50; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h); ctx.lineWidth = 8; ctx.strokeStyle = '#2E9B3A'; ctx.stroke();
        for (let q = 0; q < 5; q++) { const a = q * TAU / 5; circle(ctx, x + Math.cos(a) * 20 * k, y - h + Math.sin(a) * 20 * k, 14 * k, ['#FF5B9B', '#FFD447', '#fff', '#B58CFF'][i % 4], 4); } circle(ctx, x, y - h, 9 * k, '#FFC83D', 3); }
      burst(ctx, 540, 1300, T - t97, { kind: 'confetti', n: 40, speed: 900, gravity: 600, life: 1.4, size: 16, angle: -1.57, spread: 1.4 });
    },
    ui(ctx, T) { stamp(ctx, 'MIDNIGHT', 960, 330, T - t97, '#30CE65', 1.2); ctx.fillStyle = `rgba(255,255,255,${Math.exp(-(T - t97) * 3.5)})`; ctx.fillRect(0, 0, W, H); },
    sfx: [[0, 'bell', .6], [.3, 'magic', .5]] });

  // ===== S98 — three hundred guys sit up =====
  const mel = ws('L98', 'melted'), sat = ws('L98', 'sat');
  S.push({ id: 'S98', start: st('L98'), trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'WINTER DANCE' }),
    cam: lt => camAt(540, 1140, .85 + lt * .02),
    draw(ctx, T, lt) { hall(ctx, T, sat, 0); burst(ctx, 540, 1000, T - mel, { kind: 'dust', n: 20, speed: 300, life: 1, size: 14, colors: ['#fff'] }); },
    ui(ctx, T) { const c = inv(sat, sat + 1, T); if (c > 0) popText(ctx, '300 AT ONCE', 960, 230, T - sat, { size: 90, fill: '#FFD447' }); },
    sfx: [[mel - st('L98'), 'sparkle', .4], [sat - st('L98'), 'whoosh', .5], [sat - st('L98') + .1, 'cheer', .4]] });

  // ===== S99 — Brayden finishes his brag =====
  const hand = ws('L99', 'handsome');
  S.push({ id: 'S99', start: st('L99'), trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'WINTER DANCE' }),
    cam: lt => camAt(560, 1230, 1.4 + lt * .02),
    draw(ctx, T, lt) {
      const k = easeOut(inv(st('L99'), st('L99') + .5, T));
      for (const [nm, x] of [['kidA', 130], ['kidC', 300], ['kidE', 1000]]) { const g = idle(P({ x, y: 1500, s: .8, view: 'q34', flip: x < 500 ? 1 : -1 }), T, x); C(ctx, nm, g, { expr: 'confused', noBlink: true, lookX: x < 500 ? .6 : -.6 }, T); }
      const bx = 640, p = P({ x: bx - 65, y: 1500 + 72, s: .8, armL: 2.2 * k, armR: .6 + Math.sin(T * 4) * .15 }); talk(p, T, 6, .6);
      C(ctx, 'brayden', p, { expr: 'smug', mouth: lipShape(T, ['L99']), style: STYLE.pajamas('brayden') }, T);
      box(ctx, bx - 65 - 96, 1500 - 80, 192, 160, 48, '#E0533D', 8);
    },
    sfx: [[0, 'impact', .4]] });

  // ===== S100 — pajamas realization =====
  const fin = ws('L100', 'finished'), paj = ws('L100', 'pajamas'), later = ws('L100', 'later');
  S.push({ id: 'S100', start: st('L100'), trans: 'cut', capY: 960,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'WINTER DANCE' }),
    cam: lt => camAt(540, 1230, 1.4 + lt * .02),
    draw(ctx, T, lt) {
      for (const [nm, x, f] of [['kidA', 150, 1], ['kidC', 900, -1]]) { const g = laugh(idle(P({ x, y: 1500, s: .8, view: 'q34', flip: f }), T, x), T, 1); C(ctx, nm, g, { expr: 'laughing', holding: { R: holdPhone } }, T); }
      box(ctx, 380, 1450, 190, 56, 28, '#E0533D', 8);
      const p = P({ x: 540, y: 1500, s: .8 }); idle(p, T, 8);
      if (T > paj) { p.armL = -.7; p.armR = -.7; p.handL = 1; p.handR = 1; p.squash = .96 + Math.sin(T * 10) * .01; } else surprise(p, 0);
      C(ctx, 'brayden', p, { expr: T > paj ? 'shy' : 'neutral', blush: T > paj ? 1 : 0, red: T > paj, sweat: T > paj, style: STYLE.pajamas('brayden') }, T);
    },
    ui(ctx, T) { stamp(ctx, '4 MONTHS LATER', 960, 260, T - later, '#EE384A', 1.6); },
    sfx: [[paj - st('L100'), 'record', .5], [later - st('L100'), 'laugh', .4]] });

  return S;
});
