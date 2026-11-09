// shots/part1.js — s01–s08 (L0–L7)
'use strict';
shots(() => {
  const S = [];
  const sc = (cx, cy, z, x, y) => [540 + (x - cx) * z, 960 + (y - cy) * z];
  const GOLD = '#FFC531', GREY = '#9AA3AD';
  const crunch = (T, k = 14) => Math.sin(T * k) > 0 ? 'smallOpen' : 'closed';

  // ===== S01 — L0: POV, kidB crunching in the spotlight =====
  const tMain = ws('L0', 'main');
  S.push({ id: 'S01', start: 0, trans: 'none', capY: 1680,
    bg: (ctx, T, cam) => envMovieTheater(ctx, T, cam, {}),
    cam: lt => camAt(540, 1080, 1.25 + lt * .02),
    draw(ctx, T, lt) {
      const side = [['kidA', 270, 'neutral'], ['kidD', 810, 'neutral']];
      for (const [n, x, e] of side) C(ctx, n, idle(P({ x, y: 1455, s: .72 }), T, x), { expr: e }, T);
      const p = idle(P({ x: 540, y: 1455, s: .8 }), T, 2); p.armR = 1.9 + Math.sin(T * 7) * .25; p.armL = .3;
      C(ctx, 'kidB', p, { expr: 'happy', mouth: crunch(T), holding: { R: holdPopcorn } }, T);
      envMovieTheaterFront(ctx, T, camAt(540, 1080, 1.25 + lt * .02), {});
      burst(ctx, 540, 980, T * .7, { kind: 'candy', n: 10, speed: 260, gravity: 900, life: .7, size: 12, angle: -1.57, spread: 1.4, seed: 5 });
    },
    ui(ctx, T, lt) {
      const [sx, sy] = sc(540, 1080, 1.25 + lt * .02, 540, 1250);
      spotlight(ctx, [{ x: sx, y: sy, r: 270 }], clamp(lt / .12 + .6, 0, 1));
      roleTag(ctx, 'MAIN CHARACTER', 540, 800, GOLD, lt);
      popText(ctx, 'POV:', 540, 470, lt - .05, { size: 130, fill: '#fff', rot: -.05, dur: 1.4 });
    },
    sfx: [[0, 'pop', .5], [.3, 'tick', .4], [tMain - 0, 'ding', .45]] });

  // ===== S02 — L1: spotlight follows kidC =====
  const t2 = st('L1'), tFollow = ws('L1', 'follows');
  S.push({ id: 'S02', start: t2, trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envDowntown(ctx, T, cam, {}),
    cam: lt => camAt(280 + lt * 170 + 120, 1080, 1.2),
    draw(ctx, T, lt) {
      for (const [n, x, v] of [['kidA', 520, 0], ['kidE', 900, 1]]) { const p = idle(P({ x, y: 1500, s: .7, view: 'q34', flip: v ? -1 : 1 }), T, x); C(ctx, n, p, { expr: 'neutral' }, T); }
      const kx = 200 + (T - t2) * 170;
      const p = walk(P({ x: kx, y: 1500, s: .8, view: 'q34' }), T, 1.1); p.armR = 1.9 + Math.sin(T * 9) * .2;
      C(ctx, 'kidC', p, { expr: 'smug', mouth: crunch(T, 12), holding: { R: holdPopcorn } }, T);
    },
    ui(ctx, T, lt) {
      const z = 1.2, kx = 200 + lt * 170, [sx, sy] = sc(280 + lt * 170 + 120, 1080, z, kx, 1290);
      spotlight(ctx, [{ x: sx, y: sy, r: 250 }], 1);
      const [tx, ty] = sc(280 + lt * 170 + 120, 1080, z, kx, 1040);
      roleTag(ctx, 'MAIN CHARACTER', tx, ty, GOLD, 1, 42);
      if (T > tFollow) popText(ctx, 'FOLLOWS', 540, 420, T - tFollow, { size: 90, fill: '#FFD447', rot: .04, dur: 1.0 });
    },
    sfx: [[0, 'whoosh', .5], [tFollow - t2, 'swell', .35]] });

  // ===== S03 — L2: wind indoors, bruh stare =====
  const tInd = ws('L2', 'indoors'), tWind = ws('L2', 'wind');
  S.push({ id: 'S03', start: st('L2'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => envLivingRoom(ctx, T, cam, {}),
    cam: lt => camAt(540, 1110, 1.8 + lt * .05),
    draw(ctx, T, lt) {
      const bruh = T > tInd - .05;
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 4, .4);
      if (!bruh) { p.lean = -.12; p.armL = .9 + Math.sin(T * 3) * .1; p.armR = 1.6; p.head = Math.sin(T * 3) * .06; }
      else { p.armL = .15; p.armR = .15; p.head = 0; }
      C(ctx, 'kidC', p, { expr: bruh ? 'neutral' : 'determined', noBlink: bruh, eyes: bruh ? { open: .55, pupil: .8 } : undefined, lookX: 0, mouth: bruh ? 'flat' : 'smile' }, T);
    },
    ui(ctx, T, lt) {
      const [sx, sy] = [540, 1180];
      spotlight(ctx, [{ x: sx, y: sy, r: 340 }], 1, .5);
      if (T < tInd - .05) {
        ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
        for (let i = 0; i < 14; i++) { const y = 300 + hash(i) * 1200, x = ((T * 1400 * (.7 + hash(i + 9) * .6) + hash(i + 3) * 1500) % 1700) - 300; ctx.beginPath(); ctx.moveTo(1080 - x, y); ctx.lineTo(1080 - x - 160 - hash(i + 5) * 100, y); ctx.stroke(); }
        ctx.restore();
        popText(ctx, 'DRAMATIC', 540, 400, T - st('L2'), { size: 90, fill: '#fff', dur: 1.2 });
      } else roleTag(ctx, 'INDOORS.', 540, 520, GREY, T - tInd, 56);
    },
    sfx: [[tWind - st('L2'), 'whoosh', .4], [tInd - st('L2'), 'impact', .7]] });

  // ===== S04 — L3: grandpa kernel, car chase =====
  const tAte = ws('L3', 'ate'), tChase = ws('L3', 'chase');
  S.push({ id: 'S04', start: st('L3'), trans: 'zoom', capY: 1680,
    bg: (ctx, T, cam) => envCarInside(ctx, T, cam, { speed: T > tChase ? 2.4 : .6, noSeats: false }),
    cam: lt => camAt(540, 1100, 1.15 + lt * .05 + (lt > tChase - st('L3') ? .1 : 0)),
    draw(ctx, T, lt) {
      const ate = T > tAte + .35, chase = T > tChase - .05;
      const p = idle(P({ x: 380, y: 1450, s: .8 }), T, 1); p.armL = 1.3; p.armR = 1.3; p.handL = -1; p.handR = -1;
      if (T < tAte + .35) p.armR = 2.0;
      if (chase) { p.bodyY -= Math.abs(Math.sin(T * 25)) * 6; }
      C(ctx, 'grandpa', p, { expr: chase ? 'excited' : (ate ? 'happy' : 'neutral'), mouth: chase ? 'grin' : (ate ? crunch(T, 18) : null) || undefined }, T);
      envCarInsideFront(ctx, T, camAt(540, 1100, 1.15 + lt * .05), {});
    },
    ui(ctx, T, lt) {
      if (T < tChase - .05) { spotlight(ctx, [{ x: 400, y: 1180, r: 260 }], 1, .45); roleTag(ctx, 'MAIN CHARACTER', 400, 760, GOLD, T - tAte - .3, 40); }
      else {
        speedLines(ctx, 540, 900, T, .7);
        const a = Math.sin(T * 14) > 0; ctx.save(); ctx.globalAlpha = .28; ctx.fillStyle = a ? '#EE384A' : '#2E7BFF'; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
        popText(ctx, 'CAR CHASE', 540, 480, T - tChase, { size: 110, fill: '#FF4A5A', rot: -.05, dur: 1.2 });
      }
    },
    sfx: [[tAte - st('L3'), 'pop', .5], [tChase - st('L3'), 'alarm', .35], [tChase - st('L3'), 'whoosh', .5]] });

  // ===== S05 — L4: popstar bucket, sequel =====
  const tSeq = ws('L4', 'sequel');
  S.push({ id: 'S05', start: st('L4'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => envConcert(ctx, T, cam, {}),
    cam: lt => camAt(540, 1060, 1.2 + lt * .04),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .85 }), T, 2); p.armR = 1.9 + Math.sin(T * 8) * .2; p.armL = 1.0 + Math.sin(T * 3) * .2;
      C(ctx, 'popstar', p, { expr: T > tSeq ? 'excited' : 'happy', mouth: T > tSeq ? undefined : crunch(T, 12), holding: { R: holdBucket } }, T);
      concertCrowd(ctx, T);
      burst(ctx, 540, 900, T - tSeq, { kind: 'confetti', n: 40, speed: 700, gravity: 600, life: 1.4, size: 16, angle: -1.57, spread: 1.6, seed: 8 });
    },
    ui(ctx, T, lt) {
      spotlight(ctx, [{ x: 540, y: 1200, r: 300 }], 1, .35);
      roleTag(ctx, 'MAIN CHARACTER', 540, 700, GOLD, lt - .6, 42);
      stamp(ctx, 'PART 2', 540, 520, T - tSeq, GOLD, 1.0);
    },
    sfx: [[0, 'cheer', .4], [tSeq - st('L4'), 'bling', .55]] });

  // ===== S06 — L5: nubi alone, zero pieces =====
  const tPiece = ws('L5', 'piece'), tNever = ws('L5', 'never');
  S.push({ id: 'S06', start: st('L5'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => envMovieTheater(ctx, T, cam, {}),
    cam: lt => camAt(540, 1100, 1.45 + lt * .03),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1455, s: .8 }), T, 1); p.armL = .25; p.armR = .25;
      if (T > tPiece) p.head = .1;
      C(ctx, 'nubi', p, { expr: T > tNever ? 'sad' : 'confused', lookY: .3 }, T);
      envMovieTheaterFront(ctx, T, camAt(540, 1100, 1.45 + lt * .03), { popcorn: [] });
    },
    ui(ctx, T, lt) {
      popText(ctx, '0 PIECES', 540, 560, T - tPiece, { size: 120, fill: GREY, rot: -.04, dur: 2.0 });
    },
    sfx: [[tPiece - st('L5') + .1, 'sad_trombone', .5]] });

  // ===== S07 — L6: sister shovels it all =====
  const tAll = ws('L6', 'all'), tFirst = ws('L6', 'first');
  S.push({ id: 'S07', start: st('L6'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => envLivingRoom(ctx, T, cam, { tv: false }),
    cam: lt => camAt(520, 1090, 1.2 + lt * .03),
    draw(ctx, T, lt) {
      const empty = T > tAll + .3;
      const sp = idle(P({ x: 400, y: 1455, s: .85, view: 'q34' }), T, 2);
      sp.armR = empty ? .5 : 1.6 + Math.sin(T * 14) * .5; sp.armL = .6; sp.lean = empty ? -.1 : .08;
      if (T > tFirst) sp.rot = 0;
      C(ctx, 'teenSister', sp, { expr: T > tFirst ? 'smug' : 'happy', mouth: empty ? (T > tFirst ? 'smirk' : 'flat') : crunch(T, 16), holding: { R: empty ? holdBucket : holdPopcorn } }, T);
      const np = idle(P({ x: 780, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 3); np.armR = 1.4 + Math.sin(T * 5) * .25; np.lean = .12;
      C(ctx, 'nubi', np, { expr: empty ? 'sad' : 'nervous', lookX: -.5 }, T);
      if (!empty) burst(ctx, 470, 1120, T * .8, { kind: 'candy', n: 12, speed: 500, gravity: 1400, life: .8, size: 12, angle: -.3, spread: 1.0, seed: 4 });
    },
    ui(ctx, T, lt) {
      if (T > tFirst) popText(ctx, 'BURP', 400, 600, T - tFirst, { size: 100, fill: '#9BE05A', rot: .06, dur: 1.2 });
      else if (T > tAll) popText(ctx, 'EMPTY', 420, 600, T - tAll, { size: 90, fill: GREY, dur: .9 });
    },
    sfx: [[.1, 'tick', .4], [.5, 'tick', .4], [tAll - st('L6') + .2, 'thud', .5], [tFirst - st('L6') + .1, 'poof', .5]] });

  // ===== S08 — L7: kids block him, Extra #7 =====
  const tSev = ws('L7', 'seven');
  S.push({ id: 'S08', start: st('L7'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1090, 1.1 + lt * .03),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 540, y: 1470, s: .7 }), T, 1); np.armL = .2; np.armR = .2;
      C(ctx, 'nubi', np, { expr: T > ws('L7', 'extra') ? 'sad' : 'nervous', lookX: .3 }, T);
      const t0 = st('L7');
      const walkers = [['kidA', 0, 1, 1.05], ['kidD', .55, -1, 1.1], ['kidF', 1.1, 1, 1.0], ['kidB', 1.7, -1, 1.1]];
      for (const [n, d, dir, sp] of walkers) {
        const u = (T - t0 - d) * sp * .55; if (u < 0 || u > 1.2) continue;
        const x = dir > 0 ? lerp(-160, 1260, u) : lerp(1260, -160, u);
        const wp = walk(P({ x, y: 1560, s: .95, view: 'q34', flip: dir }), T, 1.2); C(ctx, n, wp, { expr: 'smug' }, T);
      }
    },
    ui(ctx, T, lt) {
      roleTag(ctx, 'EXTRA #7', 540, 900, GREY, T - tSev, 58);
    },
    sfx: [[.4, 'step', .3], [1.1, 'step', .3], [tSev - st('L7'), 'pop', .55]] });

  return S;
});
