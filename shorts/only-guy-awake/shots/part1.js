// shots/part1.js — S0..S19 (L0..L19). Landscape 1920x1080.
'use strict';
shots(() => {
  const S = [];
  const setBg = (id, o) => (ctx, T, cam) => PACK_SETS[id].draw(ctx, T, cam, o || {});
  const sit = (p, top, size = 1) => { p.y = top + 156 * p.s * size; p.legL = 1.45; p.legR = 1.45; return p; };
  const fall = (ctx, name, x, y, s, k, dir, face, T) => {
    ellipse(ctx, x + dir * 150 * s * k, y, 40 * s + 170 * s * k, 14, 'rgba(0,0,0,.25)', 0);
    ctx.save(); ctx.translate(x, y - 75 * s * k); ctx.rotate(dir * k * Math.PI / 2);
    drawCharacter(ctx, name, P({ x: 0, y: 0, s }), face, T); ctx.restore();
  };
  const SN = ['brayden', 'dad', 'kidB', 'kidD', 'coach', 'uncle', 'grandpa', 'dad2', 'kidH', 'kidJ', 'principal', 'kidG', 'littleBrother'];
  const BAGS = ['#3E7BD8', '#30A045', '#EE384A', '#FFB02E', '#7B4BFF', '#2FB5B5', '#FF5B9B'];
  const rowDraw = (ctx, T, xs, y, s, off, z) => xs.forEach((x, i) => sleeper(ctx, SN[(off + i) % SN.length], x, y, s, T, { bag: BAGS[(off + i) % BAGS.length], z }));
  const ROWS = (ctx, T, z = true) => { rowDraw(ctx, T, [20, 340, 660, 980, 1300], 1345, .5, 0, false); rowDraw(ctx, T, [210, 630, 1050, 1470], 1420, .6, 5, z); rowDraw(ctx, T, [0, 420, 840, 1260], 1500, .7, 9, z); };
  const lip = (T, id) => lipShape(T, [id]);

  // ===== S0 — alone in the street =====
  const gone0 = ws('L0', 'gone');
  S.push({ id: 'S0', start: 0, trans: 'none',
    bg: setBg('frontYard'),
    cam: lt => camAt(540, 1160, 1.0 + lt * .02),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1);
      C(ctx, 'nubi', p, { expr: T > gone0 ? 'sad' : 'neutral', lookX: T > gone0 ? 0 : Math.sin(T * 1.6) * .9, style: STYLE.pajamas('nubi') }, T);
    },
    ui: (ctx, T, lt) => popText(ctx, 'POV: YOU ARE THE ONLY GUY', 960, 210, lt, { size: 80, dur: 3.4 }),
    sfx: [[0, 'whoosh', .3], [gone0 - 0, 'whoosh', .3]] });

  // ===== S1 — no dads / brothers / guys in the chat =====
  const a1 = st('L1'), b1 = ws('L1', 'brothers') - .1, c1 = ws('L1', 'annoying') - .1;
  const seg1 = T => T < b1 ? 0 : T < c1 ? 1 : 2;
  const chatUI = (ctx, T, t0) => {
    const k = clamp(pop(T - t0)); ctx.save(); ctx.translate(960, 480); ctx.scale(k, k); ctx.translate(-960, -480);
    box(ctx, 770, 50, 380, 850, 56, '#1E1F2B', 10); box(ctx, 788, 110, 344, 760, 24, '#F4F4FA', 0);
    txt(ctx, 'GROUP CHAT', 960, 82, 34, '#fff', OUTLINE, 6);
    const cols = ['#FF5B9B', '#7B4BFF', '#30A045', '#FFB02E'], msgs = ['omg lol', 'same!!', 'ok wait', 'hiii'];
    for (let i = 0; i < 4; i++) { const tt = t0 + .3 + i * .28; if (T < tt) continue; const kk = clamp(pop(T - tt)); const y = 190 + i * 140;
      ctx.save(); ctx.translate(960, y); ctx.scale(kk, kk); circle(ctx, -125, 0, 34, cols[i], 6); txt(ctx, ['M', 'Z', 'A', 'E'][i], -125, 2, 34, '#fff', OUTLINE, 5);
      box(ctx, -80, -38, 210, 76, 28, cols[i] + 'CC', 6); txt(ctx, msgs[i], 25, 0, 32, '#fff', OUTLINE, 6); ctx.restore(); }
    if (T > t0 + 1.5) { const kk = clamp(pop(T - t0 - 1.5)); ctx.save(); ctx.translate(960, 800); ctx.scale(kk, kk); box(ctx, -150, -34, 300, 68, 34, '#EE384A', 7); txt(ctx, '0 GUYS ONLINE', 0, 2, 30, '#fff', OUTLINE, 6); ctx.restore(); }
    ctx.restore();
  };
  S.push({ id: 'S1', start: a1, trans: 'cut',
    bg: (ctx, T, cam) => { const k = seg1(T); if (k === 0) PACK_SETS.livingRoom.draw(ctx, T, cam, {}); else if (k === 1) PACK_SETS.kidsBedroom.draw(ctx, T, cam, {}); else envSoft(ctx, T, '#7B4BFF', '#FF8CC8'); },
    cam: lt => { const T = lt + a1, k = seg1(T); return k === 0 ? camAt(760, 1250, 1.15 + lt * .03) : k === 1 ? camAt(330, 1250, 1.15 + (T - b1) * .03) : camAt(540, 1100, 1); },
    draw(ctx, T, lt) {
      const k = seg1(T);
      if (k === 0) { box(ctx, 800, 1340, 200, 160, 26, '#7A4A8A', 8); box(ctx, 780, 1230, 240, 130, 34, '#8A5A9A', 8); box(ctx, 770, 1340, 40, 130, 14, '#6A3A7A', 8); box(ctx, 990, 1340, 40, 130, 14, '#6A3A7A', 8);
        ellipse(ctx, 860, 1495, 34, 12, '#5A3A3A', 5); ellipse(ctx, 940, 1495, 34, 12, '#5A3A3A', 5); }
      else if (k === 1) { ellipse(ctx, 520, 1490, 40, 14, '#EE384A', 6); ellipse(ctx, 600, 1490, 40, 14, '#EE384A', 6); }
    },
    ui(ctx, T, lt) { const k = seg1(T);
      if (k === 0) popText(ctx, '?', 960, 250, T - a1, { size: 130, dur: 1.4 });
      else if (k === 1) popText(ctx, '?', 960, 250, T - b1, { size: 130, dur: 1.4 });
      else chatUI(ctx, T, c1); },
    sfx: [[0, 'pop', .5], [b1 - a1, 'pop', .5], [c1 - a1, 'pop', .5]] });

  // ===== S2 — Just me. (freeze) =====
  const me2 = ws('L2', 'me');
  S.push({ id: 'S2', start: st('L2'), trans: 'zoom', capY: 960,
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam, {}),
    cam: lt => camAt(540, 1170, 2.6 + Math.min(lt, me2 - st('L2')) * .03),
    draw(ctx, T, lt) {
      const Tf = Math.min(T, me2 + .05);
      const p = talk(idle(P({ x: 540, y: 1500, s: .8 }), Tf, 1), Tf, 1, .3);
      C(ctx, 'nubi', p, { expr: 'neutral', mouth: Tf < me2 + .05 ? (lip(Tf, 'L2') || 'flat') : 'flat' }, Tf);
    },
    ui(ctx, T, lt) { if (T > me2) { ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(0, 0, W, H); popText(ctx, 'YEP. JUST ME.', 960, 200, T - me2, { size: 86, dur: 3 }); } },
    sfx: [[me2 - st('L2'), 'record', .6]] });

  // ===== S3 — pull back: asleep =====
  const not3 = ws('L3', 'not'), asl3 = ws('L3', 'asleep');
  S.push({ id: 'S3', start: st('L3'), trans: 'cut',
    bg: (ctx, T, cam) => envGym(ctx, T, cam, {}),
    cam: lt => { const T = lt + st('L3'), u = smooth(inv(not3 - .1, asl3 + .3, T)); return camAt(540, lerp(1170, 1130, u), lerp(2.4, .8, u)); },
    draw(ctx, T, lt) {
      const show = T > not3 - .05;
      if (show) { rowDraw(ctx, T, [20, 340, 660, 980, 1300], 1345, .5, 0, false); rowDraw(ctx, T, [210, 630, 1050, 1470], 1420, .6, 5, true); }
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1);
      C(ctx, 'nubi', p, { expr: T > asl3 ? 'smug' : T > not3 ? 'confused' : 'neutral' }, T);
      if (show) { rowDraw(ctx, T, [-60, 1130], 1500, .7, 9, true); }
    },
    sfx: [[ws('L3', 'okay') - st('L3'), 'scratch', .5]] });

  // ===== S4 — title card =====
  const wor4 = ws('L4', 'world'), hib4 = ws('L4', 'hibernate');
  S.push({ id: 'S4', start: st('L4'), trans: 'flash',
    bg: (ctx, T) => envBurst(ctx, T, '#3E7BD8', '#7FD4FF', .4),
    cam: lt => camAt(540, 1100, 1),
    draw() {},
    ui(ctx, T, lt) {
      if (T > wor4 - .3) popText(ctx, 'IN THIS WORLD...', 960, 200, T - wor4 + .3, { size: 96, dur: 6 });
      if (T > hib4 - .1) { popText(ctx, 'GUYS HIBERNATE', 960, 340, T - hib4 + .1, { size: 96, dur: 6, fill: '#FFD447' });
        const k = clamp(pop(T - hib4)); ctx.save(); ctx.translate(960, 660); ctx.scale(k, k); ctx.rotate(Math.sin(T * 2) * .05);
        circle(ctx, -100, -100, 44, '#8A5A3A', 8); circle(ctx, 100, -100, 44, '#8A5A3A', 8); circle(ctx, 0, 0, 140, '#A8723F', 9);
        ellipse(ctx, 0, 40, 64, 48, '#E8C79A', 7); ellipse(ctx, 0, 22, 18, 12, '#2A1A10', 0);
        for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 50, -22, 18, .2, Math.PI - .2); ctx.lineWidth = 8; ctx.strokeStyle = OUTLINE; ctx.stroke(); }
        ctx.restore(); zzzUI(ctx, T, 1080, 560); }
    },
    sfx: [[0, 'impact', .5], [hib4 - st('L4'), 'magic', .5]] });
  function zzzUI(ctx, T, x, y) { for (let i = 0; i < 3; i++) { const k = (T * .5 + i / 3) % 1; ctx.save(); ctx.globalAlpha *= Math.sin(k * Math.PI); txt(ctx, 'Z', x + k * 80, y - k * 140, 40 + i * 14, '#fff', OUTLINE, 8); ctx.restore(); } }

  // ===== S5 — first snow, dad flops =====
  const land5 = we('L5', 'year'), fall5 = ws('L5', 'falls'), asl5 = ws('L5', 'asleep');
  S.push({ id: 'S5', start: st('L5'), trans: 'cut',
    bg: setBg('snowyStreet', { snow: true }),
    cam: lt => camAt(650, 1240, 1.0 + lt * .01),
    draw(ctx, T, lt) {
      const t0 = st('L5');
      const kC = T > asl5 + .1 ? clamp((T - asl5 - .1) / .4) ** 2 : 0, kG = T > asl5 + .3 ? clamp((T - asl5 - .3) / .4) ** 2 : 0;
      if (kC < 1) { const p = idle(P({ x: 300, y: 1420, s: .6, view: 'q34' }), T, 2); C(ctx, 'coach', p, { expr: 'happy' }, T); } else fall(ctx, 'coach', 300, 1420, .6, 1, -1, { expr: 'neutral', eyes: { open: 0 }, mouth: 'smallOpen', noBlink: true }, T);
      if (kC > 0 && kC < 1) { /* topple handled below */ }
      if (kC > 0 && kC < 1) fall(ctx, 'coach', 300, 1420, .6, kC, -1, { expr: 'surprised' }, T);
      if (kG < 1) { const p = idle(P({ x: 1000, y: 1420, s: .6, flip: -1, view: 'q34' }), T, 4); C(ctx, 'grandpa', p, { expr: 'happy' }, T); } else fall(ctx, 'grandpa', 1000, 1420, .6, 1, 1, { expr: 'neutral', eyes: { open: 0 }, mouth: 'smallOpen', noBlink: true }, T);
      if (kG > 0 && kG < 1) fall(ctx, 'grandpa', 1000, 1420, .6, kG, 1, { expr: 'surprised' }, T);
      // dad
      const kD = T > fall5 ? Math.min(1, ((T - fall5) / .4) ** 2) : 0;
      const eo = 1 - smooth(inv(land5, fall5, T));
      if (kD <= 0) { const p = idle(P({ x: 500, y: 1500, s: .8 }), T, 1); p.lean = Math.sin(T * 3) * .05 * (1 - eo + .1); C(ctx, 'dad', p, { expr: T > land5 ? 'confused' : 'happy', eyes: { open: Math.max(.05, eo) } }, T); }
      else fall(ctx, 'dad', 500, 1500, .8, kD, 1, kD >= 1 ? { expr: 'neutral', eyes: { open: 0 }, mouth: 'smallOpen', noBlink: true } : { expr: 'surprised' }, T);
      if (kD >= 1) zzz(ctx, 850, 1330, T, 1.2, 1);
      if (kC >= 1) zzz(ctx, 80, 1250, T, .9, 2);
      if (kG >= 1) zzz(ctx, 1330, 1250, T, .9, 3);
      // snowflake
      if (T < land5 + .3) { const u = inv(t0 + .4, land5, T), x = lerp(430, 505, u) + Math.sin(u * 9) * 22, y = lerp(650, 1112, u * u * .3 + u * .7);
        ctx.save(); ctx.translate(x, y); ctx.rotate(T * 2); for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI / 3); ctx.fillStyle = '#fff'; ctx.strokeStyle = OUTLINE; ctx.lineWidth = 3; ctx.fillRect(-3, -17, 6, 34); } circle(ctx, 0, 0, 7, '#fff', 3); ctx.restore(); }
      burst(ctx, 505, 1112, T - land5, { kind: 'sparkle', n: 8, speed: 300, gravity: 100, life: .6, size: 14 });
    },
    ui: (ctx, T) => snowfall(ctx, T, .8),
    sfx: [[fall5 - st('L5'), 'fall', .5], [fall5 - st('L5') + .4, 'thud', .6], [asl5 - st('L5') + .5, 'thud', .5]] });

  // ===== S6 — dad's overloaded cart =====
  const job6 = ws('L6', 'job'), t6 = st('L6');
  const cart = (ctx, x, T) => { for (let i = 0; i < 9; i++) { const w = Math.sin(T * 2 + i) * 4; box(ctx, x + 8 + w + (i % 2) * 8, 1330 - (i + 1) * 30, 176, 28, 4, i % 3 === 0 ? '#EE384A' : '#D9A15A', 5); circle(ctx, x + 96 + w, 1316 - (i + 1) * 30, 7, '#EE384A', 2); }
    box(ctx, x, 1330, 200, 100, 14, '#9AA3B5', 7); circle(ctx, x + 40, 1450, 20, '#333', 5); circle(ctx, x + 160, 1450, 20, '#333', 5); ctx.beginPath(); ctx.moveTo(x, 1340); ctx.lineTo(x - 50, 1270); ctx.lineWidth = 9; ctx.strokeStyle = OUTLINE; ctx.stroke(); };
  S.push({ id: 'S6', start: t6, trans: 'whip',
    bg: setBg('supermarket', {}),
    cam: lt => camAt(620, 1180, 1.0 + lt * .015),
    draw(ctx, T, lt) {
      const moving = T < job6, dx = lerp(80, 560, inv(t6, job6, T));
      const mp = idle(P({ x: 1130, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 5);
      if (T > job6) { mp.armR = 2.7; mp.handR = .6; }
      C(ctx, 'mom', mp, { expr: T > job6 ? 'sad' : 'neutral' }, T);
      cart(ctx, dx + 150, T);
      const dp = moving ? walk(P({ x: dx, y: 1500, s: .8, view: 'q34' }), T, 1.1) : idle(P({ x: dx, y: 1500, s: .8, view: 'q34' }), T, 6);
      C(ctx, 'dad', dp, { expr: 'happy' }, T);
    },
    sfx: [[0, 'whoosh', .4], [.6, 'step', .4], [job6 - t6, 'pop', .5]] });

  // ===== S7 — bulking season =====
  const bulk7 = ws('L7', 'bulking');
  S.push({ id: 'S7', start: st('L7'), trans: 'cut',
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam, {}),
    cam: lt => camAt(540, 1260, 1.25 + lt * .03),
    draw(ctx, T, lt) {
      const k = T > bulk7 ? 1 : 0, p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1);
      p.armL = 1.7; p.handL = 1.0; p.armR = 1.1; if (k) { p.bodyY -= Math.abs(Math.sin((T - bulk7) * 6)) * 14; p.squash = 1 + .04 * Math.sin((T - bulk7) * 12); }
      C(ctx, 'dad', p, { expr: k ? 'determined' : 'happy', mouth: k ? 'grin' : undefined, holding: { R: holdPizzaSlice } }, T);
      burst(ctx, 540, 1000, T - bulk7, { kind: 'sparkle', n: 14, speed: 600, gravity: 200, life: .8, size: 22 });
    },
    ui: (ctx, T) => { if (T > bulk7) popText(ctx, 'BULKING SEASON', 960, 220, T - bulk7, { size: 96, dur: 3 }); },
    sfx: [[bulk7 - st('L7'), 'boing', .6]] });

  // ===== S8 — fridge crisis =====
  const cri8 = ws('L8', 'crisis');
  S.push({ id: 'S8', start: st('L8'), trans: 'cut',
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam, {}),
    cam: lt => camAt(800, 1200, 1.1),
    draw(ctx, T, lt) {
      const tt = T - cri8, cols = ['#EE384A', '#FFB02E', '#30A045', '#3E7BD8', '#7B4BFF', '#FF5B9B'];
      box(ctx, 880, 840, 290, 660, 18, '#E8EEF5', 8); box(ctx, 905, 870, 240, 600, 8, '#3A3F55', 0);
      for (let i = 0; i < 12; i++) { const gone = tt > 0 && tt > i * .05; if (gone) continue;
        box(ctx, 915 + (i % 3) * 72 + Math.sin(T * 9 + i) * (T > cri8 - .6 ? 3 : 0), 880 + Math.floor(i / 3) * 140, 66, 120, 8, cols[i % 6], 6); }
      if (tt > 0) for (let i = 0; i < 12; i++) { const td = tt - i * .05; if (td < 0) continue; const x0 = 915 + (i % 3) * 72, y0 = 880 + Math.floor(i / 3) * 140, vx = (hash(i * 7) - .6) * 500;
        const y = Math.min(1500 - 66, y0 + -200 * td + 900 * td * td), x = x0 + vx * Math.min(td, .5); ctx.save(); ctx.translate(x + 33, y + 33); ctx.rotate(td * (hash(i) - .5) * 6 * (y < 1430 ? 1 : 0)); box(ctx, -33, -33, 66, 66, 8, cols[i % 6], 6); ctx.restore(); }
      const p = idle(P({ x: 640, y: 1500, s: .8, view: 'q34' }), T, 1);
      if (T > cri8) { p.armL = 2.6; p.armR = 2.6; } else { p.armR = 1.5; p.lean = .1; }
      C(ctx, 'mom', p, { expr: T > cri8 ? 'terrified' : 'determined' }, T);
    },
    ui: (ctx, T) => stamp(ctx, 'CRISIS', 960, 240, T - cri8, '#EE384A', 1.0),
    sfx: [[cri8 - st('L8'), 'crash', .6]] });

  // ===== S9 — pan to the stash =====
  const sta9 = ws('L9', 'stash'), lock9 = ws('L9', 'lock');
  S.push({ id: 'S9', start: st('L9'), trans: 'cut',
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam, {}),
    cam: lt => { const T = lt + st('L9'); return track([[0, camAt(450, 1200, 1.05)], [sta9 - st('L9') + .3, camAt(780, 1240, 1.3)]], lt); },
    draw(ctx, T, lt) {
      snackStash(ctx, 820, 1500, {});
      const p = idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 1); p.lean = .12; p.armR = .6;
      C(ctx, 'nubi', p, { expr: 'nervous', lookX: .9 }, T);
      burst(ctx, 820, 1330, T - lock9, { kind: 'sparkle', n: 10, speed: 400, gravity: 100, life: .7, size: 18 });
    },
    sfx: [[lock9 - st('L9'), 'click', .6]] });

  // ===== S10 — "Don't touch. I'll know." =====
  S.push({ id: 'S10', start: st('L10'), trans: 'zoom',
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam, {}),
    cam: lt => camAt(800, 1200, 1.6 + lt * .03),
    draw(ctx, T, lt) {
      snackStash(ctx, 640, 1500, {});
      const k = easeOut(inv(0, .35, lt)), p = talk(idle(P({ x: 1010, y: lerp(1780, 1500, k), s: .8 }), T, 2), T, 2, .4);
      const kn = ws('L10', 'know');
      if (T < kn - .5) { p.armR = 2.5; p.handR = .8; p.armL = .3; } else { p.armR = 1.5; p.handR = 0; p.armL = 2.5; p.handL = .8; }
      C(ctx, 'dad', p, { expr: 'angry', mouth: lip(T, 'L10') }, T);
    },
    sfx: [[0, 'whoosh', .4], [ws('L10', 'know') - st('L10'), 'impact', .6]] });

  // ===== S11 — hibernation hall =====
  const turn11 = ws('L11', 'turns'), hall11 = ws('L11', 'hall');
  S.push({ id: 'S11', start: st('L11'), trans: 'cut',
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'HIBERNATION HALL' }),
    cam: lt => camAt(540, 1130, .9 + lt * .01),
    draw(ctx, T, lt) {
      const jx = lerp(100, 1000, inv(turn11, hall11, T));
      const bags = (y, s, off, delay) => { for (let j = 0; j < 4; j++) { const left = 80 + j * 310, w = clamp(jx - delay - left, 0, 270); if (w <= 0) continue; box(ctx, left, y - 110 * s, w, 110 * s, 50 * s, BAGS[(j + off) % 7], 8); circle(ctx, left + w, y - 55 * s, 55 * s, BAGS[(j + off) % 7], 7); } };
      bags(1400, .8, 3, 120); bags(1500, 1, 0, 0);
      const wp = T < hall11 ? walk(P({ x: jx + 60, y: 1500, s: .8, view: 'q34' }), T, 1.4) : celebrate(P({ x: jx + 60, y: 1500, s: .8 }), T, .6);
      C(ctx, 'kidF', wp, { expr: 'happy' }, T);
      burst(ctx, 540, 900, T - hall11, { kind: 'star', n: 14, speed: 500, gravity: 100, life: .9, size: 22 });
    },
    sfx: [[0, 'whoosh', .4], [hall11 - st('L11'), 'pop', .5]] });

  // ===== S12 — three hundred guys, harmony =====
  const har12 = ws('L12', 'harmony'), sn12 = ws('L12', 'snoring') - st('L12');
  S.push({ id: 'S12', start: st('L12'), trans: 'cut',
    bg: (ctx, T, cam) => envGym(ctx, T, cam, {}),
    cam: lt => camAt(640, 1150, .8 + lt * .008),
    draw(ctx, T, lt) {
      ROWS(ctx, T, true);
      if (T > har12 - .2) for (let i = 0; i < 9; i++) { const k = ((T - har12) * .35 + i * .12) % 1; if (k < 0) continue; const x = 60 + i * 150 + Math.sin(T * 2 + i) * 20, y = 1250 - k * 600;
        ctx.save(); ctx.globalAlpha *= Math.sin(k * Math.PI); ellipse(ctx, x, y, 16, 12, ['#FFD447', '#FF5B9B', '#7FD4FF'][i % 3], 4); ctx.beginPath(); ctx.moveTo(x + 14, y); ctx.lineTo(x + 14, y - 60); ctx.lineWidth = 7; ctx.strokeStyle = OUTLINE; ctx.stroke(); ctx.restore(); }
    },
    sfx: [[sn12, 'buzz', .25], [sn12 + .7, 'buzz', .25], [sn12 + 1.4, 'buzz', .25]] });

  // ===== S13 — grandpa the earthquake =====
  const eq13 = ws('L13', 'earthquake');
  S.push({ id: 'S13', start: st('L13'), trans: 'cut',
    bg: setBg('livingRoom', {}),
    cam: lt => { const T = lt + st('L13'), env = Math.max(0, Math.sin(T * 3)) ** 2 * (T > eq13 ? 1.6 : .6); return camAt(640 + Math.sin(T * 55) * 7 * env, 1250 + Math.cos(T * 47) * 5 * env, 1.1); },
    draw(ctx, T, lt) {
      const p = sit(idle(P({ x: 400, y: 1455, s: .8, view: 'q34' }), T, 1), 1330, 1.05);
      p.head = .12;
      C(ctx, 'grandpa', p, { expr: 'neutral', eyes: { open: 0 }, mouth: Math.sin(T * 3) > 0 ? 'wideOpen' : 'smallOpen', noBlink: true }, T);
      zzz(ctx, 470, 1010, T, 2.4, 3);
    },
    ui(ctx, T, lt) { if (T > eq13 - .2) { const k = clamp(pop(T - eq13 + .2)), sh = Math.sin(T * 40) * 4; ctx.save(); ctx.translate(960 + sh, 150); ctx.scale(k, k);
        box(ctx, -560, -60, 1120, 120, 12, '#EE384A', 8); txt(ctx, 'BREAKING: EARTHQUAKE 7.8', 0, 4, 66, '#fff', OUTLINE, 9); ctx.restore(); } },
    sfx: [[.2, 'thud', .5], [eq13 - st('L13'), 'alarm', .3], [eq13 - st('L13') + .3, 'thud', .5]] });

  // ===== S14 — never hibernated, 0 / 15 =====
  const once14 = ws('L14', 'once'), fif14 = ws('L14', 'fifteen');
  S.push({ id: 'S14', start: st('L14'), trans: 'cut',
    bg: setBg('kidsBedroom', {}),
    cam: lt => camAt(560, 1240, 1.15 + lt * .01),
    draw(ctx, T, lt) {
      const p = sit(idle(P({ x: 170, y: 1375, s: .8, view: 'q34' }), T, 1), 1250);
      p.head = Math.sin(T * 5) * .08 * (T > ws('L14', 'never') && T < once14 ? 1 : 0);
      C(ctx, 'nubi', p, { expr: 'neutral', eyes: { open: 1.2 }, noBlink: T > ws('L14', 'never') }, T);
    },
    ui(ctx, T, lt) {
      const yr = Math.min(15, Math.max(0, Math.floor((T - once14) / (fif14 - once14) * 15) + 1)), ph = ((T - once14) / (fif14 - once14) * 15) % 1;
      ctx.save(); ctx.translate(1450, 380); box(ctx, -170, -190, 340, 380, 18, '#fff', 8); box(ctx, -170, -190, 340, 80, 18, '#EE384A', 8);
      txt(ctx, 'CALENDAR', 0, -150, 40, '#fff', OUTLINE, 6);
      if (T > once14 - .1) { const sq = Math.abs(Math.cos(ph * Math.PI)); ctx.save(); ctx.scale(1, .3 + .7 * sq); txt(ctx, 'YEAR ' + yr, 0, 0, 80, OUTLINE, '#fff', 0); ctx.restore(); } else txt(ctx, 'YEAR 1', 0, 0, 80, OUTLINE, '#fff', 0);
      ctx.restore();
      if (T > fif14) { stamp(ctx, '0 / 15', 960, 220, T - fif14, '#EE384A', 1.0); popText(ctx, 'WINTERS HIBERNATED', 960, 330, T - fif14, { size: 46, dur: 3 }); }
    },
    sfx: [[once14 - st('L14'), 'tick', .4], [once14 - st('L14') + .3, 'tick', .4], [once14 - st('L14') + .6, 'tick', .4], [fif14 - st('L14'), 'impact', .5]] });

  // ===== S15 — stuck at 99% =====
  const load15 = ws('L15', 'loading'), nin15 = ws('L15', 'ninety');
  S.push({ id: 'S15', start: st('L15'), trans: 'cut',
    bg: setBg('doctorOffice', {}),
    cam: lt => camAt(580, 1230, 1.2 + lt * .01),
    draw(ctx, T, lt) {
      const dp = talk(idle(P({ x: 800, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 2), T, 2, .3); dp.armR = 1.8;
      C(ctx, 'doctor', dp, { expr: 'neutral' }, T);
      const p = idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 1);
      C(ctx, 'nubi', p, { expr: T > ws('L15', 'broken') ? 'sad' : 'nervous' }, T);
    },
    ui(ctx, T, lt) { const pct = T < nin15 ? .99 * smooth(inv(load15, nin15, T)) : .99 - (Math.sin(T * 30) > .9 ? .01 : 0); if (T > load15 - .3) loadingBar(ctx, 960, 120, 1000, pct);
      if (T > nin15) popText(ctx, 'STUCK', 1500, 230, T - nin15, { size: 70, dur: 2.5, fill: '#EE384A' }); },
    sfx: [[nin15 - st('L15'), 'buzz', .5]] });

  // ===== S16 — alone at night, zzz in every window =====
  const t16 = st('L16');
  S.push({ id: 'S16', start: t16, trans: 'cut',
    bg: setBg('snowyStreet', { night: true, snow: true }),
    cam: lt => camAt(lerp(540, 900, inv(0, LINE['L16'].end - t16, lt)), 1180, 1.0),
    draw(ctx, T, lt) {
      [[100, 1010], [450, 1040], [800, 1000], [1150, 1040], [1500, 1010], [1850, 1040]].forEach(([x, y], i) => zzz(ctx, x, y, T, 1.3, i));
      const x = lerp(150, 1000, inv(t16, LINE['L16'].end, T)), p = walk(P({ x, y: 1500, s: .8, view: 'q34' }), T, 1.0);
      C(ctx, 'nubi', p, { expr: 'sad', style: STYLE.winter('nubi') }, T);
    },
    ui: (ctx, T) => snowfall(ctx, T, .8),
    sfx: [[0, 'whoosh', .2]] });

  // ===== S17 — The Night Shift =====
  const ngt17 = ws('L17', 'night'), sft17 = ws('L17', 'shift');
  S.push({ id: 'S17', start: st('L17'), trans: 'zoom',
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540, 1200, 1.2 + lt * .02),
    draw(ctx, T, lt) {
      const lf = T > ngt17;
      for (const [n, x, fl] of [['kidA', 140, 1], ['kidB', 330, 1], ['kidC', 760, -1], ['kidD', 950, -1]]) { const p = lf ? laugh(P({ x, y: 1500, s: .74, flip: fl, view: 'q34' }), T, 1) : idle(P({ x, y: 1500, s: .74, flip: fl, view: 'q34' }), T, x); C(ctx, n, p, { expr: lf ? 'laughing' : 'smug' }, T); }
      const p = idle(P({ x: 545, y: 1500, s: .8 }), T, 1); C(ctx, 'nubi', p, { expr: 'sad', mouth: 'flat' }, T);
      const k = clamp(pop(T - ngt17)); ctx.save(); ctx.translate(545, 1245); ctx.scale(k, k); box(ctx, -70, -30, 140, 60, 6, '#EE384A', 5); txt(ctx, 'HELLO', 0, -15, 20, '#fff', OUTLINE, 3); txt(ctx, 'NIGHT SHIFT', 0, 12, 18, '#fff', OUTLINE, 3); ctx.restore();
    },
    ui: (ctx, T) => { if (T > ngt17) popText(ctx, 'THE NIGHT SHIFT', 960, 200, T - ngt17, { size: 96, dur: 3 }); },
    sfx: [[sft17 - st('L17'), 'laugh', .55]] });

  // ===== S18 — games and silence =====
  const gam18 = ws('L18', 'games'), sil18 = ws('L18', 'silence');
  S.push({ id: 'S18', start: st('L18'), trans: 'cut',
    bg: setBg('kidsBedroom', {}),
    cam: lt => camAt(520, 1230, 1.1 + lt * .01),
    draw(ctx, T, lt) {
      const mp = idle(P({ x: 900, y: 1500, s: .8, flip: -1 }), T, 3); mp.armR = 2.2 + Math.sin(T * 9) * .4;
      C(ctx, 'mom', mp, { expr: 'happy' }, T);
      box(ctx, 290, 1330, 150, 20, 4, '#EE384A', 5); box(ctx, 290, 1318, 150, 14, 4, '#FFD447', 4);
      const p = sit(idle(P({ x: 170, y: 1375, s: .8, view: 'q34' }), T, 1), 1290); p.armL = 1.4; p.armR = 1.4;
      if (T > gam18) { p.armL += Math.sin(T * 14) * .1; p.head = Math.sin(T * 7) * .04; }
      C(ctx, 'nubi', p, { expr: T > sil18 ? 'sad' : 'happy', holding: { L: holdGameController, R: holdGameController } }, T);
    },
    ui: (ctx, T) => { if (T > sil18) popText(ctx, '. . .', 960, 220, T - sil18, { size: 110, dur: 2.5 }); },
    sfx: [[gam18 - st('L18'), 'click', .5], [gam18 - st('L18') + .2, 'click', .4]] });

  // ===== S19 — birthday: 15 =====
  const fif19 = ws('L19', 'fifteen'), and19 = ws('L19', 'and') - .08;
  S.push({ id: 'S19', start: st('L19'), trans: 'cut',
    bg: setBg('birthdayParty', {}),
    cam: lt => camAt(540, 1220, 1.2 + lt * .02),
    draw(ctx, T, lt) {
      box(ctx, 520, 1330, 360, 170, 12, '#A8723F', 8);
      box(ctx, 540, 1250, 320, 85, 12, '#FF8CC8', 8); box(ctx, 580, 1185, 240, 70, 12, '#FFF8E0', 8);
      const out = fif19 + .5;
      for (const [dx, ch] of [[-30, '1'], [30, '5']]) { const x = 700 + dx; box(ctx, x - 14, 1090, 28, 95, 4, '#7FD4FF', 6); txt(ctx, ch, x, 1135, 40, OUTLINE, '#fff', 0);
        if (T < out) { const f = 1 + Math.sin(T * 20 + dx) * .15; ellipse(ctx, x, 1070, 12 * f, 22 * f, '#FFB02E', 4); }
        else if (T < out + 1) { ctx.save(); ctx.globalAlpha *= 1 - (T - out); circle(ctx, x + Math.sin((T - out) * 6) * 8, 1060 - (T - out) * 90, 12 + (T - out) * 14, '#bbb', 0); ctx.restore(); } }
      const bl = T > fif19 - .2 && T < out + .3, p = idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 1); if (bl) p.lean = .15;
      C(ctx, 'nubi', p, { expr: T > out ? 'happy' : 'neutral', mouth: bl ? 'round' : undefined }, T);
    },
    sfx: [[out19(), 'tick', .3], [fif19 - st('L19') + .5, 'poof', .5]] });
  function out19() { return 0; }
  S.push({ id: 'S19b', start: and19, trans: 'zoom', capY: 960,
    bg: setBg('kidsBedroom', {}),
    cam: lt => camAt(540, 1150, 2.1 + lt * .04),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 3); p.armR = 1.2;
      const bag = c => { box(c, -50, -20, 100, 130, 24, '#2E6BD8', 7); box(c, -34, 40, 68, 40, 10, '#FFC83D', 5); };
      C(ctx, 'mom', p, { expr: 'smug', holding: { R: bag } }, T);
    },
    sfx: [[ws('L19', 'plans') - and19, 'ding', .5], [ws('L19', 'plans') - and19 + .1, 'impact', .5]] });

  return S;
});
