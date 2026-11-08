// shots/part1.js — S01–S09 (L0–L8): the world rule, Nubi's pink problem, the cap, picture day.
'use strict';
shots(() => {
  const S = [];
  const NUBI = (T, extra = {}) => Object.assign({ hair: nubiHair(T), cap: nubiCap(T), hairGlow: nubiGlow(T) }, extra);
  const headC = (name, p) => headTop(name, p) + 70 * p.s;       // roughly the hair/head centre, for hairPop
  // speech bubble (world or screen space), pops in at t0
  function bubble(ctx, s, x, y, dt, o = {}) {
    if (dt < 0) return; const k = pop(dt, .28), size = o.size || 80;
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(k, k);
    ctx.font = size + 'px "Lilita One"'; const w = ctx.measureText(s).width + 80, h = size + 60, tx = o.tail || -1;
    ctx.beginPath(); ctx.moveTo(tx * 30, h / 2 - 6); ctx.lineTo(tx * 110, h / 2 + 70); ctx.lineTo(tx * 90, h / 2 - 6); ctx.closePath(); fillStroke(ctx, '#fff', 8);
    box(ctx, -w / 2, -h / 2, w, h, h / 2, '#fff', 8);
    txt(ctx, s, 0, 4, size, o.fill || '#EE384A', OUTLINE, 8);
    ctx.restore();
  }
  const capProp = ctx => { ctx.save(); ctx.translate(0, 20); ellipse(ctx, 0, 0, 70, 50, '#FF8528', 7); box(ctx, 30, 10, 90, 26, 12, '#E06A12', 6); ctx.restore(); };

  // ===== S01 — HOOK: "In this world, your hair changes color with your mood." =====
  const tCh = ws('L0', 'changes'), tMood = ws('L0', 'mood');
  const cyc = [['happy', 0], ['mad', tCh], ['sad', tCh + .25], ['love', tCh + .5], ['happy', tMood]];
  const cycHair = T => { let i = 0; for (let k = 0; k < cyc.length; k++) if (T >= cyc[k][1]) i = k; return i === 0 ? nubiHair(T) : hairShift(cyc[i - 1][0], cyc[i][0], T, cyc[i][1] - .04, .12); };
  S.push({ id: 'S01', start: 0, trans: 'none', capY: 1690,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const k = easeInOut(inv(0, tMood + .1, lt)); return camAt(540, lerp(1120, 1110, k), lerp(1.8, 1.25, k) + Math.sin(lt * 2) * .01); },
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1);
      if (T > tCh) { const w = T - tCh; p.head = Math.sin(w * 14) * .06 * Math.exp(-w * 1.5); p.bodyY -= 10 * Math.abs(Math.sin(w * 12.5)) * (T < tMood ? 1 : Math.exp(-(T - tMood) * 4)); }
      if (T > tMood) { p.armL = lerp(p.armL, 2.3, spring(T - tMood)); p.armR = lerp(p.armR, 2.3, spring(T - tMood)); }
      C(ctx, 'nubi', p, NUBI(T, { hair: cycHair(T), expr: T > tMood ? 'excited' : 'happy', mouth: T > tMood ? 'grin' : null }), T);
      for (let k = 1; k < cyc.length; k++) hairPop(ctx, 540, headC('nubi', p), cyc[k][0], T - cyc[k][1], .9);
    },
    sfx: cyc.slice(1).map(([, t], i) => [t, 'pop', .45 + i * .05]) });

  // ===== S02 — Happy is yellow. Mad is red. Sad is blue. =====
  const kids2 = [['kidD', 250, 'happy', 'happy', ws('L1', 'happy'), ws('L1', 'yellow')],
                 ['kidE', 540, 'mad', 'angry', ws('L1', 'mad'), ws('L1', 'red')],
                 ['kidF', 830, 'sad', 'sad', ws('L1', 'sad'), ws('L1', 'blue')]];
  S.push({ id: 'S02', start: st('L1'), trans: 'cut', capY: 1650,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(lerp(500, 580, smooth(lt / 2)), 1080, 1.06 + lt * .02),
    draw(ctx, T, lt) {
      for (const [n, x, mood, ex, tE, tH] of kids2) {
        const p = idle(P({ x, y: 1500, s: .78 }), T, x);
        if (T > tE) {
          if (mood === 'happy') { celebrate(p, T, .6); }
          if (mood === 'mad') { p.armL = -.35; p.armR = -.35; p.handL = .8; p.handR = .8; p.bodyY -= 14 * Math.exp(-(T - tE) * 6) * Math.abs(Math.sin((T - tE) * 30)); }
          if (mood === 'sad') { p.headY = 14; p.armL = -.08; p.armR = -.08; p.squash = .97; }
        }
        C(ctx, n, p, { expr: T > tE ? ex : 'neutral', hair: T > tH - .05 ? hairShift('#7A5230', mood, T, tH - .05, .2) : null, red: mood === 'mad' && T > tE ? .6 : 0, tears: mood === 'sad' && T > tE }, T);
        hairPop(ctx, x, headC(n, p), mood, T - tH, .85);
      }
    },
    sfx: [[ws('L1', 'yellow') - st('L1'), 'ding', .5], [ws('L1', 'red') - st('L1'), 'boing', .5], [ws('L1', 'blue') - st('L1'), 'sad_trombone', .35]] });

  // ===== S03 — And pink... means you like someone. =====
  const tPink = ws('L2', 'pink'), tSome = ws('L2', 'someone');
  S.push({ id: 'S03', start: st('L2'), trans: 'zoom', capY: 1660,
    bg: (ctx, T) => envSoft(ctx, T, '#FFC2DD', '#FF6FB0'),
    cam: lt => camAt(540, 1100, 1.4 + lt * .05),
    draw(ctx, T, lt) {
      const a = idle(P({ x: 380, y: 1500, s: .8, view: 'q34' }), T, 4), b = idle(P({ x: 700, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 6);
      if (T > tSome) { a.lean += .08; b.lean += .08; a.armR = .5; b.armR = .5; }
      const f = (sd) => ({ expr: T > tPink ? 'shy' : 'neutral', blush: T > tPink ? 1 : 0, hair: T > tPink - .05 ? hairShift(sd, 'love', T, tPink - .05, .25) : null });
      C(ctx, 'kidA', a, f('#4A2810'), T); C(ctx, 'kidF', b, f('#4A2810'), T);
      hairPop(ctx, 380, headC('kidA', a), 'love', T - tPink, .85); hairPop(ctx, 700, headC('kidF', b), 'love', T - tPink - .05, .85);
      burst(ctx, 540, 1000, T - tSome, { kind: 'heart', n: 14, speed: 520, angle: -Math.PI / 2, spread: 1.6, gravity: -60, life: 1.2, size: 30, seed: 2 });
    },
    sfx: [[tPink - st('L2'), 'chime', .5], [tSome - st('L2'), 'sparkle', .5]] });

  // ===== S04 — Grandma's hair goes red when she loses the TV remote. =====
  const tRed = ws('L3', 'red'), tRem = ws('L3', 'remote');
  S.push({ id: 'S04', start: st('L3'), trans: 'whip', capY: 1650,
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam),
    cam: lt => { const T = lt + st('L3'); const k = smooth(inv(tRem - .1, tRem + .3, T)); return camAt(lerp(600, 520, k), lerp(1110, 1080, k), lerp(1.15, 1.35, k) + lt * .02); },
    draw(ctx, T, lt) {
      // couch
      box(ctx, 600, 1240, 420, 140, 30, '#7B4BFF', 8); box(ctx, 600, 1340, 420, 120, 20, '#6436D9', 8);
      for (let i = 0; i < 2; i++) { const lift = i === 0 && T < tRem ? Math.abs(Math.sin(T * 7)) * 30 : 0; box(ctx, 620 + i * 195, 1300 - lift, 185, 70, 22, '#9C7BFF', 7); }
      box(ctx, 570, 1290, 60, 190, 24, '#6436D9', 8); box(ctx, 990, 1290, 60, 190, 24, '#6436D9', 8);
      box(ctx, 620, 1460, 26, 40, 6, '#4A2810', 5); box(ctx, 975, 1460, 26, 40, 6, '#4A2810', 5);
      const p = idle(P({ x: 450, y: 1500, s: .82, view: 'q34' }), T, 8);
      if (T < tRem) { p.lean = .35; p.armL = 1.4 + Math.sin(T * 9) * .3; p.armR = 1.2 - Math.sin(T * 9) * .3; }
      else { p.view = 'front'; const k = spring(T - tRem); p.armL = lerp(.3, 2.6, Math.min(1.1, k)); p.armR = lerp(.3, 2.6, Math.min(1.1, k)); p.handL = -.6; p.handR = -.6; p.bodyY -= 18 * Math.exp(-(T - tRem) * 5); }
      C(ctx, 'grandma', p, { expr: T > tRed ? 'angry' : 'confused', hair: T > tRed - .05 ? hairShift('#B9B9C6', 'mad', T, tRed - .05, .25) : null, red: T > tRed ? .7 : 0, vein: T > tRem }, T);
      // the remote, stuck in her own bun
      const ht = headTop('grandma', p);
      ctx.save(); ctx.translate(p.x + (p.view === 'front' ? 30 : 10), ht + 10); ctx.rotate(.5); ctx.scale(.85, .85); holdRemote(ctx); ctx.restore();
      hairPop(ctx, p.x, headC('grandma', p), 'mad', T - tRed, .9);
      if (T > tRed) for (let i = 0; i < 4; i++) { const u = ((T - tRed) * 1.3 + i / 4) % 1, sx = (i % 2 ? 1 : -1) * (110 + u * 50);
        ctx.save(); ctx.globalAlpha *= (1 - u) * .9; circle(ctx, p.x + sx, ht + 40 - u * 220, 26 + u * 26, '#fff', 5); ctx.restore(); }
    },
    ui(ctx, T) {
      // arrow pointing at the remote for the sound-off gag
      const dt = T - tRem - .25; if (dt < 0) return; const k = pop(dt, .3), b = Math.sin(T * 10) * 10;
      ctx.save(); ctx.translate(820 + b, 540); ctx.rotate(.55); ctx.scale(k, k);
      ctx.beginPath(); ctx.moveTo(-110, -22); ctx.lineTo(10, -22); ctx.lineTo(10, -60); ctx.lineTo(90, 0); ctx.lineTo(10, 60); ctx.lineTo(10, 22); ctx.lineTo(-110, 22); ctx.closePath();
      ctx.rotate(Math.PI); fillStroke(ctx, '#FFD447', 8); ctx.restore();
    },
    sfx: [[0, 'whoosh', .35], [tRed - st('L3'), 'scratch', .5], [tRem - st('L3'), 'poof', .55]] });

  // ===== S05 — And my teacher's hair turns blue every Monday morning. =====
  const tBlue = ws('L4', 'blue'), tMon = ws('L4', 'monday');
  const mug = ctx => { box(ctx, -36, -10, 72, 84, 12, '#fff', 7); ctx.beginPath(); ctx.arc(40, 30, 22, -1.3, 1.3); ctx.lineWidth = 9; ctx.strokeStyle = OUTLINE; ctx.stroke(); txt(ctx, ':(', 0, 34, 34, '#3F7BEA'); };
  S.push({ id: 'S05', start: st('L4'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(560, 1110, 1.4 + lt * .04),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 450, y: 1500, s: .82 }), T, 9, .5);
      const droop = smooth(inv(tBlue, tBlue + .5, T)); p.headY = 16 * droop; p.head = -.08 * droop; p.armL = .15; p.armR = 1.0; p.handR = -.9; p.squash = 1 - .03 * droop;
      C(ctx, 'teacher', p, { expr: T > tBlue ? 'sad' : 'neutral', eyes: T > tBlue ? { open: .55 } : undefined, hair: T > tBlue - .05 ? hairShift('#6B3A1E', 'sad', T, tBlue - .05, .3) : null, holding: { R: mug } }, T);
      hairPop(ctx, p.x, headC('teacher', p), 'sad', T - tBlue, .9);
      // MONDAY calendar on the wall
      const dt = T - tMon; if (dt > 0) { const k = pop(dt, .3); ctx.save(); ctx.translate(800, 900); ctx.rotate(.06); ctx.scale(k, k);
        box(ctx, -130, -120, 260, 250, 18, '#fff', 8); box(ctx, -130, -120, 260, 80, 18, '#3F7BEA', 8); txt(ctx, 'MONDAY', 0, -78, 52, '#fff', OUTLINE, 7); txt(ctx, ':(', 0, 50, 110, '#3F7BEA', OUTLINE, 8); ctx.restore(); }
    },
    sfx: [[tBlue - st('L4'), 'sad_trombone', .45], [tMon - st('L4'), 'pop', .45]] });

  // ===== S06 — Me? Every time I see Lily, my hair goes bright pink. =====
  const tLily = ws('L5', 'lily'), tBright = ws('L5', 'bright'), tEvery5 = ws('L5', 'every');
  S.push({ id: 'S06', start: st('L5'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const T = lt + st('L5'); const sh = T > tLily ? Math.sin(T * 60) * 7 * Math.exp(-(T - tLily) * 5) : 0; return camAt(560 + sh, 1090, 1.3 + lt * .03); },
    draw(ctx, T, lt) {
      // Lily walks in from the right and stops
      const lx = lerp(1180, 770, easeOut(inv(tEvery5, tLily + .1, T)));
      const lp = T < tLily + .1 ? walk(P({ x: lx, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 1) : idle(P({ x: lx, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 5);
      if (T > tLily + .2) { lp.armR = 2.0 + Math.sin(T * 9) * .25; }
      C(ctx, 'lily', lp, { expr: 'happy', hair: LILY_PINK }, T);
      const p = idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 1);
      const shy = T > tLily; if (shy) { p.headY = 14; p.head = .1; p.armL = .9; p.armR = .9; p.handL = -1.4; p.handR = -1.4; surprise(p, T - tLily); }
      C(ctx, 'nubi', p, NUBI(T, { expr: shy ? 'shy' : 'happy', blush: shy ? 1 : 0, lookY: shy ? 1 : 0, lookX: shy ? -.3 : .4, sweat: T > tBright }), T);
      hairPop(ctx, 330, headC('nubi', p), 'love', T - tLily, 1);
      hairPop(ctx, 330, headC('nubi', p), 'love', T - tBright, 1.2);
      burst(ctx, 330, headTop('nubi', p) - 40, T - tBright, { kind: 'heart', n: 12, speed: 500, angle: -Math.PI / 2, spread: 1.4, gravity: -50, life: 1, size: 28, seed: 5 });
    },
    sfx: [[tLily - st('L5'), 'boing', .55], [tBright - st('L5'), 'sparkle', .5]] });

  // ===== S07 — So I wear a cap. Every single day. =====
  const tCap = ws('L6', 'cap'), days = [[ws('L6', 'every'), 'MON'], [ws('L6', 'single'), 'TUE'], [ws('L6', 'day'), 'WED']];
  S.push({ id: 'S07', start: st('L6'), trans: 'zoom', capY: 1690,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const T = lt + st('L6'); const sh = T > tCap ? Math.sin(T * 70) * 8 * Math.exp(-(T - tCap) * 6) : 0; return camAt(540 + sh, 1110, 1.8 + lt * .05); },
    draw(ctx, T, lt) {
      // calendar flipping behind him
      if (T > days[0][0] - .05) { let d = days[0]; for (const x of days) if (T >= x[0] - .05) d = x; const k = pop(T - d[0] + .05, .2);
        ctx.save(); ctx.translate(700, 830); ctx.rotate(.08); ctx.scale(k * .68, k * .68); box(ctx, -110, -110, 220, 220, 16, '#fff', 8); box(ctx, -110, -110, 220, 70, 16, '#EE384A', 8);
        txt(ctx, d[1], 0, 40, 84, '#24225B', OUTLINE, 0); ctx.restore(); }
      const p = idle(P({ x: 470, y: 1500, s: .8 }), T, 1);
      const capOn = nubiCap(T);
      if (!capOn) { const u = smooth(inv(st('L6') + .1, tCap - .1, T)); p.armR = lerp(.3, 2.9, u); p.handR = lerp(0, -2.2, u); }
      else { const k = Math.exp(-(T - tCap) * 5); p.armR = lerp(.3, 2.9, k); p.armL = lerp(.3, 2.9, k * .8); p.headY = 6 + 8 * k; p.bodyY += 10 * k; }
      C(ctx, 'nubi', p, NUBI(T, { expr: capOn ? 'happy' : 'nervous', mouth: capOn ? 'smallSmile' : 'wavy', blush: capOn ? .3 : .8, eyes: capOn && T < tCap + .4 ? { open: .1 } : undefined, holding: capOn ? null : { R: capProp } }), T);
      burst(ctx, 470, headTop('nubi', p) - 40, T - tCap, { kind: 'dust', n: 12, speed: 500, spread: 3, gravity: 200, life: .5, size: 26, seed: 7 });
    },
    sfx: [[tCap - st('L6'), 'poof', .55], ...days.map(([t]) => [t - st('L6'), 'tick', .4])] });

  // ===== S08 — Kids call me Hat Boy. =====
  const tHat = ws('L7', 'hat'), tBoy = ws('L7', 'boy');
  S.push({ id: 'S08', start: st('L7'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envBackyard(ctx, T, cam),
    cam: lt => camAt(590, 1120, 1.0 + lt * .04),
    draw(ctx, T, lt) {
      [['kidA', 600, 0], ['kidB', 800, 1], ['kidE', 990, 2]].forEach(([n, x, i]) => {
        const kp = P({ x, y: 1500, s: .74, view: 'q34', flip: -1 }); if (T > tHat - .2) { laugh(kp, T + i, 1); kp.armR = 1.7 + Math.sin(T * 10 + i) * .15; kp.handR = .2; } else idle(kp, T, x);
        C(ctx, n, kp, { expr: T > tHat - .2 ? 'laughing' : 'smug' }, T);
      });
      const p = idle(P({ x: 240, y: 1500, s: .8 }), T, 1);
      if (T > tBoy) { const k = spring(T - tBoy); p.armL = lerp(.2, .9, Math.min(1, k)); p.armR = lerp(.2, .9, Math.min(1, k)); p.handL = 1.4; p.handR = 1.4; p.head = .12; p.headY = 6; }
      C(ctx, 'nubi', p, NUBI(T, { expr: T > tBoy ? 'nervous' : 'sad', mouth: T > tBoy ? 'wavy' : null, lookX: .8 }), T);
    },
    ui(ctx, T) { bubble(ctx, 'HAT BOY!', 700, 520, T - tHat, { size: 96, rot: -.06, tail: -1 }); },
    sfx: [[tHat - st('L7') - .1, 'laugh', .6], [tBoy - st('L7'), 'boing', .35]] });

  // ===== S09 — Then one day... picture day. =====
  const tPic = ws('L8', 'picture');
  S.push({ id: 'S09', start: st('L8'), trans: 'whip', capY: 1660,
    bg: (ctx, T, cam) => envPhoto(ctx, T, cam, { noRisers: true }),
    cam: lt => { const T = lt + st('L8'); const k = easeInOut(inv(st('L8') + .1, tPic + .2, T)); const sh = T > tPic ? Math.sin(T * 60) * 6 * Math.exp(-(T - tPic) * 5) : 0;
      return camAt(lerp(540, 470, k) + sh, lerp(960, 1110, k), lerp(1.0, 1.55, k) + lt * .03); },
    draw(ctx, T, lt) {
      const t0 = st('L8'), x = lerp(-120, 470, easeOut(inv(t0, tPic - .05, T)));
      let p = P({ x, y: 1500, s: .8, view: T < tPic - .05 ? 'q34' : 'front' });
      if (T < tPic - .05) walk(p, T, 1.1); else { idle(p, T, 1, .3); surprise(p, T - tPic); const g = T - tPic - .45; if (g > 0 && g < .3) p.headY = 8 * Math.sin(g / .3 * Math.PI); }
      C(ctx, 'nubi', p, NUBI(T, { expr: T > tPic ? 'terrified' : 'happy', sweat: T > tPic, mouth: T > tPic + .45 && T < tPic + .75 ? 'flat' : null }), T);
    },
    ui(ctx, T) { if (T > tPic) vignette(ctx, .25 * smooth(inv(tPic, tPic + .3, T)), '142,219,74'); },
    sfx: [[0, 'whoosh', .35], [0.05, 'swell', .4], [tPic - st('L8'), 'bell', .6]] });

  return S;
});
