// shots/part3.js — S23..S32, lines L17..L26. Written independently of the other parts.
'use strict';
shots(() => {
  const S = [];
  const GOLD = '#FFD447', GREEN = '#30CE65', PINK = '255,110,170';
  const dark = (ctx, T, k = 1) => blackout(ctx, gymDark(T) * k);
  // additive spotlight cone from the ceiling onto a point
  const cone = (ctx, x, y, a, T) => {
    if (!(a > 0)) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(x, -300, x, y + 80);
    g.addColorStop(0, `rgba(255,244,200,${.05 * a})`); g.addColorStop(1, `rgba(255,244,200,${.34 * a})`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 60, -300); ctx.lineTo(x + 60, -300); ctx.lineTo(x + 300, y + 80); ctx.lineTo(x - 300, y + 80); ctx.closePath(); ctx.fill();
    ctx.restore();
  };

  // ===== S23 — "I'm the worst liar here... so I'm the brightest." =====
  const bright = ws('L17', 'brightest');
  S.push({ id: 'S23', start: st('L17'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => camAt(540, 1100, 1.6 + lt * .06),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .8 }), T, 2), T, 2, .3);
      if (T > bright - .1) { p.armR = 1.5 + .4 * spring(T - bright, 3, 5); p.handR = .5; p.bodyY -= 8 * pop(T - bright); }
      C(ctx, 'nubi', p, { expr: T > bright - .3 ? 'determined' : 'smug', mouth: lipShape(T, ['L17']) }, T);
      dark(ctx, T, .8);
      // nose is still dark: a tiny hopeful flicker only
      noseGlow(ctx, 'nubi', p, T > bright ? .12 + .1 * Math.sin(T * 30) : 0, T);
    },
    ui(ctx, T, lt) { popText(ctx, 'BRIGHTEST', 540, 430, T - bright, { size: 120, fill: GREEN, rot: -.06, dur: 1.6 }); },
    sfx: [[bright - st('L17'), 'power', .4]] });

  // ===== S24 — biggest lie ever... I love homework! (stage jump, spotlight) =====
  const tYell = ws('L18', 'yelled'), tHw = ws('L18', 'homework');
  S.push({ id: 'S24', start: st('L18'), trans: 'whip', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => { const T = lt + st('L18'); const sh = T > tHw ? Math.sin(T * 60) * 8 * Math.exp(-(T - tHw) * 5) : 0; return camAt(540 + sh, 1050 - 20 * smooth(inv(tYell, tHw, T)), 1.0 + lt * .03); },
    draw(ctx, T, lt) {
      const u = inv(tYell, tYell + .55, T), landed = u >= 1;
      const p = P({ x: 540, y: lerp(1500, 1190, smooth(u)), s: .8 });
      idle(p, T, 1);
      if (T < tYell) anticipate(p, T - (tYell - .25), .25);
      else if (!landed) { p.bodyY -= Math.sin(u * Math.PI) * 230; p.armL = p.armR = 2.4; }
      else { p.armL = 2.7 + Math.sin(T * 12) * .15; p.armR = 2.7 - Math.sin(T * 12) * .15; p.bodyY -= 10 * spring(T - (tYell + .55), 3, 5); }
      C(ctx, 'nubi', p, { expr: T > tHw - .2 ? 'excited' : 'determined', mouth: lipShape(T, ['L18']) }, T);
      // crowd silhouettes in front
      [['kidA', 150], ['kidB', 330], ['kidC', 750], ['kidE', 930]].forEach(([n, x], i) => {
        const kp = idle(P({ x, y: 1580, s: .9, view: 'front' }), T, i + 3);
        if (T > tHw) surprise(kp, T - tHw - i * .04);
        C(ctx, n, kp, { expr: T > tHw ? 'surprised' : 'nervous' }, T);
      });
      dark(ctx, T);
      cone(ctx, 540, 1190, smooth(inv(tHw - .1, tHw + .3, T)), T);
      noseGlow(ctx, 'nubi', p, T > tHw ? 2.2 : 0, T);
    },
    ui(ctx, T, lt) { if (T > tHw) speedLines(ctx, 540, 800, T, .3 * Math.exp(-(T - tHw) * 1.5)); },
    sfx: [[0, 'whoosh', .4], [tYell - st('L18'), 'swell', .5], [tHw - st('L18'), 'power', 1.0]] });

  // ===== S25 — Everyone joined in. Broccoli! Unicorn! =====
  const tJoin = ws('L19', 'joined'), tBro = ws('L19', 'broccoli'), tUni = ws('L19', 'unicorn');
  S.push({ id: 'S25', start: st('L19'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => camAt(540, 1060, 1.0 + lt * .03),
    draw(ctx, T, lt) {
      const glows = [];
      const place = (n, x, y, s, i, onT, amt, extra) => {
        const kp = Object.assign(danceP(i, T), { x, y, s, view: 'front', flip: 1 });
        if (extra) extra(kp);
        C(ctx, n, kp, { expr: T > onT ? 'excited' : 'surprised' }, T);
        glows.push([n, kp, T > onT ? amt : 0]);
      };
      [['kidD', 330, 0], ['kidF', 540, 1], ['kidB', 740, 2]].forEach(([n, x, i]) => place(n, x, 1390, .6, i + 1, tJoin + .2 + i * .25, .8));
      place('kidA', 240, 1500, .8, 0, tBro, 1.2);
      place('kidC', 480, 1500, .8, 3, tJoin + .1, .8);
      place('brayden', 790, 1500, .84, 4, tUni, 1.4, kp => { if (T > tUni) { kp.armL = kp.armR = 2.5; kp.bodyY -= 14 * Math.abs(Math.sin(T * 9)); } });
      dark(ctx, T);
      for (const [n, kp, a] of glows) noseGlow(ctx, n, kp, a, T);
      if (T > tUni) burst(ctx, 790, 930, T - tUni, { kind: 'star', n: 16, speed: 500, gravity: 300, life: .8, size: 20, seed: 5 });
    },
    ui(ctx, T) {
      popText(ctx, 'I LOVE BROCCOLI!', 330, 520, T - tBro, { size: 78, fill: GREEN, rot: -.05, dur: 1.4 });
      popText(ctx, "I'M A UNICORN!", 700, 700, T - tUni, { size: 78, fill: '#FF7BD0', rot: .05, dur: 1.5 });
    },
    sfx: [[tJoin - st('L19'), 'cheer', .4], [tBro - st('L19'), 'ding2', .6], [tUni - st('L19'), 'ding3', .65]] });

  // ===== S26 — Grandma, thirty-nine, DAYLIGHT (callback A) =====
  const tThirty = ws('L20', 'thirty'), tNine = ws('L20', 'nine'), tDay = ws('L20', 'daylight');
  S.push({ id: 'S26', start: st('L20'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => { const T = lt + st('L20'); return camAt(lerp(620, 540, smooth(inv(tDay - .3, tDay + .8, T))), 1070, lerp(1.3, .95, smooth(inv(tDay - .4, tDay + .8, T))) + lt * .01); },
    draw(ctx, T, lt) {
      // punch table (behind grandma, right)
      box(ctx, 840, 1330, 240, 170, 12, '#C9503E', 8); box(ctx, 870, 1275, 80, 60, 14, '#F4F7FA', 6); ellipse(ctx, 910, 1285, 34, 10, '#FF5B7A', 4);
      const lit = T > tDay, shield = lit && T < tDay + 1.0;
      const kids = [['nubi', 260, 1500, .8], ['kidA', 470, 1500, .78], ['kidC', 960, 1400, .66], ['kidB', 120, 1420, .62]];
      kids.forEach(([n, x, y, s], i) => {
        const kp = idle(P({ x, y, s, view: 'q34', flip: x > 700 ? -1 : 1 }), T, i + 1);
        if (shield) { kp.armL = kp.armR = 2.0; } else if (lit) celebrate(kp, T, .8);
        C(ctx, n, kp, { expr: lit ? 'happy' : 'nervous' }, T);
      });
      const gp = idle(P({ x: 700, y: 1500, s: .82, view: 'q34', flip: -1 }), T, 6);
      if (T > tNine) { gp.armR = 2.0 + .2 * Math.sin(T * 10); gp.bodyY -= 6 * pop(T - tNine); }
      C(ctx, 'grandma', gp, { expr: lit ? 'happy' : 'smug' }, T);
      dark(ctx, T);
      noseGlow(ctx, 'grandma', gp, T > tNine ? 3.0 : T > tThirty ? 1.0 : 0, T);
      if (lit) burst(ctx, 540, 500, T - tDay, { kind: 'confetti', n: 55, speed: 900, gravity: 700, life: 2, size: 18, angle: Math.PI / 2, spread: 2.6, seed: 8 });
    },
    ui(ctx, T) {
      const a = T > tDay ? Math.exp(-(T - tDay) * 4.5) : 0;
      if (a > .01) { ctx.save(); ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
    },
    sfx: [[tNine - st('L20'), 'swell', .5], [tDay - st('L20'), 'flash', .7], [tDay - st('L20') + .05, 'cheer', .6]] });

  // ===== S27 — Lily walks over =====
  const tWalk0 = st('L21'), tWalk1 = ws('L21', 'over');
  S.push({ id: 'S27', start: st('L21'), trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .3, banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => camAt(540 + lt * 8, 1070, 1.1 + lt * .03),
    draw(ctx, T, lt) {
      const hp = idle(P({ x: 340, y: 1500, s: .8, view: 'q34' }), T, 1);
      C(ctx, 'nubi', hp, { expr: T > ws('L21', 'lily') ? 'love' : 'nervous' }, T);
      const k = easeOut(inv(tWalk0, tWalk1 + .2, T)), moving = k < 1;
      const lx = lerp(950, 720, k);
      const lp = moving ? walk(P({ x: lx, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 1.0) : idle(P({ x: lx, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 4);
      C(ctx, 'lily', lp, { expr: 'shy', blush: .7 }, T);
      if (!moving) burst(ctx, 540, 900, T - tWalk1, { kind: 'heart', n: 8, speed: 300, gravity: -60, life: 1.4, size: 24, seed: 2 });
    },
    sfx: [[0, 'whoosh', .35], [.2, 'step', .4], [.6, 'step', .4], [1.0, 'step', .4]] });

  // ===== S28 — "Do you like anyone?" (Lily close-up) =====
  const tAny = ws('L22', 'anyone');
  S.push({ id: 'S28', start: st('L22'), trans: 'cut', capY: 1700,
    bg: (ctx, T) => envSoft(ctx, T, '#FFB3D1', '#FF7FB0'),
    cam: lt => camAt(540, 1110, 2.1 + lt * .06),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .8 }), T, 3), T, 3, .3); p.head = .05 * Math.sin(T * 2);
      C(ctx, 'lily', p, { expr: 'shy', blush: .9, mouth: lipShape(T, ['L22']) }, T);
    },
    sfx: [[tAny - st('L22'), 'sparkle', .35]] });

  // ===== S29 — "Nope." RECORD SCRATCH freeze, nose lit up the sky =====
  const tNope = ws('L23', 'nope'), tNose = ws('L23', 'nose'), tSky = ws('L23', 'sky');
  const frz = T => T < tNope ? T : T < tNose ? tNope : T - (tNose - tNope);
  S.push({ id: 'S29', start: st('L23'), trans: 'zoom', capY: 1700,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => { const T = frz(lt + st('L23')); const fz = T >= tNope && lt + st('L23') < tNose; return camAt(540, 1110, 2.0 + (T - st('L23')) * .05 + (fz ? .12 : 0)); },
    draw(ctx, T, lt) {
      const f = T > tNope && T < tNose, Tf = frz(T);
      const p = idle(P({ x: 540, y: 1500, s: .8 }), Tf, 1);
      if (f) { p.head = -.08; p.armL = 1.2; p.armR = 1.2; }
      C(ctx, 'nubi', p, { expr: Tf >= tNope ? 'nervous' : 'smug', mouth: f ? 'wideOpen' : lipShape(T, ['L23']), sweat: Tf >= tNope ? 1 : 0, noBlink: f }, Tf);
      noseGlow(ctx, 'nubi', p, Tf >= tNope ? 2.5 : 0, Tf);
      if (T > tSky) burst(ctx, 540, 560, T - tSky, { kind: 'star', n: 24, speed: 700, gravity: 120, life: 1.2, size: 26, angle: -Math.PI / 2, spread: 2.2, seed: 11 });
    },
    ui(ctx, T) {
      popText(ctx, "YEP. THAT'S ME.", 540, 450, T - tNope, { size: 92, fill: '#FF4B4B', rot: -.04, dur: tNose - tNope + .8 });
      if (T > tNope && T < tNose) vignette(ctx, .35, '238,56,74');
    },
    sfx: [[tNope - st('L23'), 'record', .7], [tNose - st('L23'), 'power', 1.0]] });

  // ===== S30 — "Me neither." Her nose glowed too — heart thread =====
  const tMe = ws('L24', 'me'), tNei = we('L24', 'neither'), tGl = ws('L24', 'glowed');
  S.push({ id: 'S30', start: st('L24'), trans: 'cut', capY: 1660,
    bg: (ctx, T) => envSoft(ctx, T, '#FFB3D1', '#FF7FB0'),
    cam: lt => camAt(540, 1080, 1.3 + lt * .03),
    draw(ctx, T, lt) {
      const on = T > tGl;
      const hp = idle(P({ x: 340, y: 1500, s: .8, view: 'q34' }), T, 1);
      const lp = idle(P({ x: 740, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 2);
      const said = T > tMe - .05 && T < tNei + .1;
      C(ctx, 'nubi', hp, { expr: on ? 'love' : 'happy' }, T);
      C(ctx, 'lily', lp, { expr: on ? 'love' : 'shy', blush: .8, mouth: said ? lipShape(T, ['L24']) : null }, T);
      if (on) {
        const a = noseAt('nubi', hp), b = noseAt('lily', lp);
        thread(ctx, a.x, a.y, b.x, b.y, smooth(inv(tGl, tGl + .7, T)), T);
        noseGlow(ctx, 'nubi', hp, .6, T);
        noseGlow(ctx, 'lily', lp, 1.2, T, { col: PINK });
        burst(ctx, 540, 760, T - tGl - .5, { kind: 'heart', n: 10, speed: 350, gravity: -80, life: 1.4, size: 26, seed: 4 });
      }
    },
    sfx: [[tGl - st('L24'), 'magic', .6]] });

  // ===== S31 — NIGHT LIGHT is a compliment now (callback B) =====
  const tNight = ws('L25', 'night');
  S.push({ id: 'S31', start: st('L25'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'SCHOOL DANCE', bannerC: '#FF5B9B' }),
    cam: lt => camAt(540, 1070, 1.05 + lt * .03),
    draw(ctx, T, lt) {
      [['kidA', 330, 0], ['kidB', 770, 1], ['kidC', 930, 2], ['kidD', 120, 3]].forEach(([n, x, i]) => {
        const kp = celebrate(P({ x, y: 1390, s: .6 }), T + i * .3, .8);
        C(ctx, n, kp, { expr: 'excited' }, T);
      });
      const bp = idle(P({ x: 190, y: 1500, s: .8 }), T, 3); bp.armR = 2.2; bp.handR = .3;
      C(ctx, 'brayden', bp, { expr: 'happy' }, T);
      const hp = idle(P({ x: 490, y: 1500, s: .8, view: 'q34' }), T, 1); hp.armR = 1.1;
      const lp = idle(P({ x: 620, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 2); lp.armR = 1.1;
      C(ctx, 'nubi', hp, { expr: 'happy' }, T); C(ctx, 'lily', lp, { expr: 'love', blush: .7 }, T);
      noseGlow(ctx, 'nubi', hp, .6, T);
      burst(ctx, 540, 700, T - tNight, { kind: 'star', n: 18, speed: 600, gravity: 150, life: 1.0, size: 22, seed: 6 });
    },
    ui(ctx, T) { popText(ctx, 'NIGHT LIGHT', 540, 480, T - tNight, { size: 120, fill: GOLD, rot: -.04, dur: 2.2 }); },
    sfx: [[0, 'cheer', .5], [tNight - st('L25'), 'bling', .45]] });

  // ===== S32 — Subscribe if you've ever glowed (loop echo of S1) =====
  const tGlowed = ws('L26', 'glowed');
  S.push({ id: 'S32', start: st('L26'), trans: 'zoom', capY: 1720,
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam),
    cam: lt => camAt(540, 1110, 2.1 + lt * .02),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1);
      C(ctx, 'nubi', p, { expr: 'happy', mouth: lipShape(T, ['L26']) }, T);
      const n = noseAt('nubi', p);
      for (let i = 0; i < 6; i++) { const r = hash(i + 3); ellipse(ctx, n.x - 36 + i * 14 + r * 6, n.y + 74 + (i % 2) * 12, 4, 4, '#8A5A2B', 0); }
      noseGlow(ctx, 'nubi', p, T > tGlowed ? .6 + 1.0 * smooth(inv(tGlowed, tGlowed + .4, T)) : .6, T);
    },
    ui(ctx, T, lt) { drawSubscribe(ctx, lt - .05, 1.6, 1460); },
    sfx: [[0, 'bling', .5], [tGlowed - st('L26'), 'power', .4]] });

  return S;
});
