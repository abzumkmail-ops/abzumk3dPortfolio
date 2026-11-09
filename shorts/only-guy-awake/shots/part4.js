// shots/part4.js — L60–L80: the stash, the traps, Grandpa.
'use strict';
shots(() => {
  const S = [];
  const PJ = n => STYLE.pajamas(n);
  const kitchenN = (ctx, T, cam) => envKitchen(ctx, T, cam, { night: true });
  const kitchenD = (ctx, T, cam) => envKitchen(ctx, T, cam, {});
  const dim = (ctx, a) => { ctx.save(); ctx.fillStyle = `rgba(10,14,40,${a})`; ctx.fillRect(0, 0, W, H); ctx.restore(); };
  const drift = (lt, x, y, z) => camAt(x, y, z + lt * .02);

  // ===== S60 — 3 AM, sneaking =====
  const t60 = ws('L60', 'three');
  S.push({ id: 'S60', start: st('L60'), trans: 'cut',
    bg: kitchenN, cam: lt => drift(lt, 540, 1130, .9),
    draw(ctx, T, lt) {
      const t0 = st('L60'), x = lerp(150, 560, inv(t0, t0 + 3.2, T));
      const p = walk(P({ x, y: 1500, s: .78, view: 'q34' }), T, .7, .8); p.lean += .12;
      C(ctx, 'nubi', p, { expr: T > t60 ? 'nervous' : 'neutral', style: PJ('nubi'), holding: { R: holdFlashlight } }, T);
      badgeOver(ctx, 'nubi', p, 1, { t: T });
    },
    ui(ctx, T) { dim(ctx, .25); popText(ctx, '3:00 AM', 960, 250, T - t60, { size: 100, fill: '#FFD447' }); },
    sfx: [[t60 - st('L60'), 'tick', .5], [t60 - st('L60') + .6, 'tick', .4]] });

  // ===== S61 — stash open =====
  const t61 = ws('L61', 'open');
  S.push({ id: 'S61', start: st('L61'), trans: 'zoom',
    bg: kitchenN, cam: lt => camAt(lerp(700, 790, smooth(inv(0, 2, lt))), 1260, 1.5 + lt * .04),
    draw(ctx, T, lt) {
      snackStash(ctx, 820, 1500, { open: smooth(inv(t61 - .3, t61 + .3, T)) });
      const p = idle(P({ x: 480, y: 1500, s: .8, view: 'q34' }), T, 2); if (T > t61) surprise(p, T - t61);
      C(ctx, 'nubi', p, { expr: T > t61 ? 'surprised' : 'nervous', style: PJ('nubi') }, T);
    },
    ui: (ctx, T) => dim(ctx, .2),
    sfx: [[t61 - st('L61') - .2, 'scratch', .3]] });

  // ===== S62 — half gone =====
  const tHalf = ws('L62', 'half'), tSign = ws('L62', 'sign');
  S.push({ id: 'S62', start: st('L62'), trans: 'cut',
    bg: kitchenN, cam: lt => camAt(780, 1250, 1.45 + lt * .04),
    draw(ctx, T, lt) {
      snackStash(ctx, 820, 1500, { open: 1, empty: .5 * smooth(inv(tHalf - .2, tHalf + .5, T)) });
      burst(ctx, 820, 1480, T - tHalf, { kind: 'dust', n: 14, speed: 300, gravity: 600, life: .8, size: 12, colors: ['#D9A15A'], seed: 4 });
      const p = idle(P({ x: 470, y: 1500, s: .8, view: 'q34' }), T, 2);
      C(ctx, 'nubi', p, { expr: T > tSign ? 'confused' : 'sad', style: PJ('nubi') }, T);
    },
    ui: (ctx, T) => dim(ctx, .2),
    sfx: [[tHalf - st('L62'), 'pop', .4]] });

  // ===== S63 — "I'll know." ghost dad =====
  const t63 = st('L63');
  S.push({ id: 'S63', start: st('L63'), trans: 'flash',
    bg: kitchenN, cam: lt => camAt(780, 1230, 1.5 + lt * .05),
    draw(ctx, T, lt) {
      snackStash(ctx, 820, 1500, { open: 1, empty: .5 });
      const p = P({ x: 560, y: 1330, s: 1.05, view: 'front', alpha: .55 * smooth(inv(t63, t63 + .3, T)) });
      talk(p, T, 5, .5);
      C(ctx, 'dad', p, { expr: 'angry', mouth: lipShape(T, ['L63']), vein: true, noBlink: true }, T);
      const q = idle(P({ x: 1000, y: 1500, s: .7, view: 'q34', flip: -1 }), T, 3); anticipate(q, T - t63, .3);
      C(ctx, 'nubi', q, { expr: 'terrified', sweat: true, style: PJ('nubi') }, T);
    },
    ui(ctx, T, lt) { dim(ctx, .3); popText(ctx, "I'LL KNOW", 960, 230, T - t63, { size: 110, fill: '#EE384A' }); },
    sfx: [[0, 'impact', .6]] });

  // ===== S64 — dad asleep =====
  const t64 = ws('L64', 'asleep');
  S.push({ id: 'S64', start: st('L64'), trans: 'cut',
    bg: (ctx, T, cam) => envKidsBedroom(ctx, T, cam, { night: true }), cam: lt => drift(lt, 620, 1220, 1.3),
    draw(ctx, T, lt) {
      sleeper(ctx, 'dad', 780, 1500, .9, T, { bag: '#6B4FA0', face: { mouth: Math.sin(T * 3) > 0 ? 'wideOpen' : 'smallOpen' } });
      const p = idle(P({ x: 330, y: 1500, s: .75, view: 'q34' }), T, 2);
      C(ctx, 'nubi', p, { expr: 'confused', style: PJ('nubi'), lookX: 1 }, T);
    },
    ui: (ctx, T) => dim(ctx, .3),
    sfx: [[t64 - st('L64'), 'buzz', .2], [t64 - st('L64') + .9, 'buzz', .2]] });

  // ===== S65 — someone else is awake =====
  const t65 = ws('L65', 'someone');
  S.push({ id: 'S65', start: st('L65'), trans: 'zoom', capY: 975,
    bg: kitchenN, cam: lt => camAt(560, 1170, 2.3 + lt * .05),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 560, y: 1500, s: .8 }), T, 1), T, 1, .3);
      C(ctx, 'nubi', p, { expr: 'determined', eyes: { open: .45 }, style: PJ('nubi'), lookX: T > t65 + .8 ? -1 : 0, noBlink: true }, T);
    },
    ui(ctx, T) { dim(ctx, .25); popText(ctx, 'SOMEONE ELSE IS AWAKE', 960, 220, T - t65, { size: 84, fill: '#30CE65' }); },
    sfx: [[t65 - st('L65'), 'impact', .5]] });

  // ===== S66 — operation title =====
  const t66 = ws('L66', 'traps');
  S.push({ id: 'S66', start: st('L66'), trans: 'flash', capY: 975,
    bg: (ctx, T) => envBurst(ctx, T, '#2E3A8C', '#5A3AA8', .4), cam: lt => camAt(540, 1170, 2.0 + lt * .05),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 1); p.armL = 1.3; p.armR = 1.3; p.handL = -1.2; p.handR = -1.2;
      C(ctx, 'nubi', p, { expr: 'determined' }, T);
    },
    ui(ctx, T, lt) { stamp(ctx, 'OPERATION:', 960, 200, lt - .1, '#EE384A', 1.0); stamp(ctx, 'CATCH THE SNACK THIEF', 960, 330, lt - .5, '#FFD447', 1.0); },
    sfx: [[0, 'power', .5]] });

  // ===== S67 — flour footprints =====
  const t67f = ws('L67', 'flour'), t67 = ws('L67', 'fuzzy');
  S.push({ id: 'S67', start: st('L67'), trans: 'cut',
    bg: kitchenD, cam: lt => camAt(540 + lt * 8, 1280, 1.3),
    draw(ctx, T, lt) {
      ctx.save(); ctx.globalAlpha *= smooth(inv(t67f - .2, t67f + .4, T));
      ellipse(ctx, 540, 1540, 520, 38, '#F4F0E4', 0); ctx.restore();
      for (let i = 0; i < 6; i++) {
        const k = smooth(inv(t67 + i * .2 - .3, t67 + i * .2, T)); if (k <= 0) continue;
        ctx.save(); ctx.globalAlpha *= k; const x = 220 + i * 140, y = 1535 + (i % 2) * 18;
        ellipse(ctx, x, y, 38, 15, '#C9B8E8', 4); for (let j = -1; j <= 1; j++) circle(ctx, x + 34 + j * 6, y + j * 6 - 4, 6, '#C9B8E8', 2);
        ctx.restore();
      }
      const p = idle(P({ x: 1000, y: 1470, s: .7, view: 'q34', flip: -1 }), T, 2);
      C(ctx, 'nubi', p, { expr: T > t67 ? 'surprised' : 'neutral', style: PJ('nubi') }, T);
    },
    sfx: [[t67 - st('L67'), 'poof', .4]] });

  // ===== S68 — bell with a sock =====
  const t68 = ws('L68', 'sock');
  S.push({ id: 'S68', start: st('L68'), trans: 'cut',
    bg: kitchenD, cam: lt => camAt(540, 1180, 1.2 + smooth(inv(0, 2.2, lt)) * 1.0),
    draw(ctx, T, lt) {
      box(ctx, 440, 1150, 200, 110, 8, '#C98B4B', 8);
      ctx.save(); ctx.translate(540, 1275); const sw = T > t68 ? 0 : Math.sin(T * 8) * .15; ctx.rotate(sw);
      ctx.beginPath(); ctx.moveTo(-34, 0); ctx.quadraticCurveTo(-40, 56, -44, 70); ctx.lineTo(44, 70); ctx.quadraticCurveTo(40, 56, 34, 0); ctx.closePath(); fillStroke(ctx, '#FFC83D', 7);
      circle(ctx, 0, 76, 10, '#FFC83D', 5);
      if (T > t68 - .2) { const k = pop(T - t68 + .2); ctx.save(); ctx.scale(k, k); box(ctx, -30, 30, 60, 70, 18, '#FF5B9B', 6); box(ctx, -30, 30, 60, 16, 4, '#fff', 5); ctx.restore(); }
      ctx.restore();
    },
    ui: (ctx, T) => { if (T > t68) popText(ctx, 'SOCK', 960, 250, T - t68, { size: 90, fill: '#FF5B9B' }); },
    sfx: [[t68 - st('L68'), 'thud', .3]] });

  // ===== S69 — pantry peek =====
  const t69 = ws('L69', 'pantry');
  S.push({ id: 'S69', start: st('L69'), trans: 'cut',
    bg: (ctx, T) => { ctx.fillStyle = '#1A1630'; ctx.fillRect(0, 0, W, H); }, cam: lt => camAt(540, 1170, 1),
    draw() {},
    ui(ctx, T, lt) {
      const open = smooth(inv(t69 + .2, t69 + .7, T)), gw = 520, gh = 70 + open * 60, sh = Math.sin(T * 5) * 4;
      // peeking eyes in the gap
      ctx.save(); ctx.beginPath(); ctx.rect(960 - gw / 2, 540 - gh / 2, gw, gh); ctx.clip();
      ctx.fillStyle = '#2C2750'; ctx.fillRect(0, 0, W, H);
      ctx.translate(960 + sh, 540 + 40); ctx.scale(1.8, 1.8); ctx.translate(-540, -1170);
      C(ctx, 'nubi', P({ x: 540, y: 1500, s: .9 }), { expr: 'nervous', eyes: { open: 1, pupil: 1 }, lookX: Math.sin(T * 1.5) * .8, style: PJ('nubi'), noBlink: true }, T);
      ctx.restore();
      ctx.fillStyle = '#0B0A1A'; ctx.fillRect(0, 0, W, 540 - gh / 2); ctx.fillRect(0, 540 + gh / 2, W, H);
      ctx.fillRect(0, 0, 960 - gw / 2, H); ctx.fillRect(960 + gw / 2, 0, W, H);
      ctx.strokeStyle = '#3A3560'; ctx.lineWidth = 6; ctx.strokeRect(960 - gw / 2, 540 - gh / 2, gw, gh);
    },
    sfx: [[.4, 'tick', .4], [1.5, 'tick', .4], [2.6, 'tick', .4]] });

  // ===== S70 — fridge light =====
  const t70 = ws('L70', 'fridge');
  S.push({ id: 'S70', start: st('L70'), trans: 'cut',
    bg: kitchenN, cam: lt => drift(lt, 560, 1160, .95),
    draw(ctx, T, lt) {
      const k = smooth(inv(t70, t70 + .35, T));
      if (k > 0) { ctx.save(); ctx.globalAlpha *= .5 * k; ctx.beginPath(); ctx.moveTo(1050, 1000); ctx.lineTo(1050, 1500); ctx.lineTo(-100, 1560); ctx.lineTo(-100, 800); ctx.closePath(); ctx.fillStyle = '#FFF6C8'; ctx.fill(); ctx.restore(); }
    },
    ui: (ctx, T) => dim(ctx, .35 - .15 * smooth(inv(t70, t70 + .35, T))),
    sfx: [[t70 - st('L70'), 'click', .5], [t70 - st('L70') + .1, 'buzz', .15]] });

  // ===== S71 — silhouette eating cookies =====
  const t71 = ws('L71', 'cookies'), tb = ws('L71', 'bathrobe');
  S.push({ id: 'S71', start: st('L71'), trans: 'cut',
    bg: kitchenN, cam: lt => camAt(540, 1200, 1.15 + lt * .03),
    draw(ctx, T, lt) {
      ctx.save(); ctx.globalAlpha *= .4; ctx.beginPath(); ctx.moveTo(900, 1000); ctx.lineTo(900, 1500); ctx.lineTo(100, 1550); ctx.lineTo(100, 850); ctx.closePath(); ctx.fillStyle = '#FFF6C8'; ctx.fill(); ctx.restore();
      const p = idle(P({ x: 640, y: 1500, s: .85, view: 'q34', flip: -1 }), T, 4); p.armR = 2.0 + Math.sin(T * 7) * .15;
      drawSilhouette(ctx, c2 => C(c2, 'grandpa', p, { expr: 'neutral', style: PJ('grandpa'), holding: { R: holdCookie } }, T), .95, '#0B0A1A');
      burst(ctx, 600, 1200, T - t71, { kind: 'dust', n: 12, speed: 260, gravity: 700, life: .7, size: 10, colors: ['#D9A15A'], seed: 7 });
      const q = idle(P({ x: 1150, y: 1500, s: .55, view: 'q34', flip: -1 }), T, 2);
    },
    ui: (ctx, T) => dim(ctx, .15),
    sfx: [[tb - st('L71'), 'pop', .3], [t71 - st('L71'), 'pop', .3], [t71 - st('L71') + .4, 'pop', .25]] });

  // ===== S72 — PLOT TWIST =====
  const t72 = ws('L72', 'grandpa');
  S.push({ id: 'S72', start: st('L72'), trans: 'flash', capY: 975,
    bg: kitchenN, cam: lt => camAt(560, 1200, 1.2 + smooth(inv(0, 2, lt)) * .5),
    draw(ctx, T, lt) {
      const rev = T > t72;
      const p = idle(P({ x: 640, y: 1500, s: .85, view: rev ? 'front' : 'q34', flip: -1 }), T, 4);
      if (!rev) drawSilhouette(ctx, c2 => C(c2, 'grandpa', p, { expr: 'neutral', style: PJ('grandpa') }, T), .95, '#0B0A1A');
      else { p.armR = 2.0; C(ctx, 'grandpa', p, { expr: 'smug', style: PJ('grandpa'), holding: { R: holdCookie } }, T); burst(ctx, 640, 1100, T - t72, { kind: 'star', n: 14, speed: 600, gravity: 300, life: .9, size: 22 }); }
      const n = idle(P({ x: 1020, y: 1500, s: .7, view: 'q34', flip: -1 }), T, 3); if (rev) surprise(n, T - t72);
      C(ctx, 'nubi', n, { expr: rev ? 'surprised' : 'nervous', style: PJ('nubi') }, T);
    },
    ui(ctx, T) { if (T > t72) stamp(ctx, 'PLOT TWIST', 960, 260, T - t72, '#EE384A', 1.0); },
    sfx: [[t72 - st('L72'), 'glitch', .5]] });

  // ===== S73 — offers a cookie =====
  const tc = ws('L73', 'cookie');
  S.push({ id: 'S73', start: st('L73'), trans: 'cut', capY: 975,
    bg: kitchenN, cam: lt => camAt(560, 1180, 2.0 + lt * .04),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 560, y: 1500, s: .8 }), T, 4), T, 4, .4); p.armR = 1.9 + Math.sin(T * 3) * .1; p.handR = .3;
      C(ctx, 'grandpa', p, { expr: 'happy', mouth: lipShape(T, ['L73']), style: PJ('grandpa'), holding: { R: holdCookie } }, T);
    },
    ui: (ctx, T) => dim(ctx, .12),
    sfx: [[tc - st('L73'), 'ding', .3]] });

  // ===== S74 — "You're awake?" =====
  S.push({ id: 'S74', start: st('L74'), trans: 'zoom', capY: 975,
    bg: kitchenN, cam: lt => camAt(560 + Math.sin(lt * 50) * 4 * Math.exp(-lt * 4), 1170, 2.3 + lt * .05),
    draw(ctx, T, lt) {
      const p = surprise(talk(idle(P({ x: 560, y: 1500, s: .8 }), T, 1), T, 1, .3), T - st('L74'));
      C(ctx, 'nubi', p, { expr: 'surprised', mouth: lipShape(T, ['L74']), style: PJ('nubi') }, T);
    },
    ui: (ctx, T) => dim(ctx, .12),
    sfx: [[0, 'impact', .5]] });

  // ===== S75 — sixty winters =====
  const t75 = ws('L75', 'sixty');
  S.push({ id: 'S75', start: st('L75'), trans: 'cut', capY: 975,
    bg: kitchenN, cam: lt => camAt(560, 1180, 2.0 + lt * .04),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 560, y: 1500, s: .8 }), T, 4), T, 4, .4);
      const sr = smooth(inv(t75 - .3, t75 + .2, T)) * (1 - smooth(inv(t75 + .5, t75 + 1, T))); p.armL = 1.0 * sr; p.armR = 1.0 * sr; p.bodyY -= 10 * sr;
      C(ctx, 'grandpa', p, { expr: 'smug', mouth: lipShape(T, ['L75']), style: PJ('grandpa') }, T);
    },
    ui(ctx, T) { dim(ctx, .12); popText(ctx, '60 WINTERS', 960, 230, T - t75, { size: 100, fill: '#FFD447' }); },
    sfx: [[t75 - st('L75'), 'ding', .5]] });

  // ===== S76 — "But the earthquake snoring?" =====
  const t76 = ws('L76', 'earthquake');
  S.push({ id: 'S76', start: st('L76'), trans: 'cut', capY: 975,
    bg: kitchenN, cam: lt => camAt(560, 1170, 2.2 + lt * .04),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 560, y: 1500, s: .8 }), T, 1), T, 1, .4); p.head = .15 * smooth(inv(t76 - .2, t76 + .3, T));
      C(ctx, 'nubi', p, { expr: 'confused', mouth: lipShape(T, ['L76']), style: PJ('nubi') }, T);
    },
    ui(ctx, T) { dim(ctx, .12); popText(ctx, '?', 1300, 260, T - t76, { size: 130, fill: '#FFD447' }); } });

  // ===== S77 — Bluetooth speaker =====
  const t77 = ws('L77', 'bluetooth');
  S.push({ id: 'S77', start: st('L77'), trans: 'cut',
    bg: kitchenN, cam: lt => camAt(600, 1200, 1.4 + lt * .03),
    draw(ctx, T, lt) {
      const k = smooth(inv(t77 + .1, t77 + .6, T));
      const p = idle(P({ x: 520, y: 1500, s: .82 }), T, 4); p.armR = lerp(.3, 1.6, k); p.handR = .3;
      const spk = c => { box(c, -34, -20, 68, 90, 14, '#2E6BD8', 7); circle(c, 0, 18, 18, '#222331', 5); circle(c, 0, 18, 7, '#7FD4FF', 0); };
      C(ctx, 'grandpa', p, { expr: 'smug', style: PJ('grandpa'), holding: k > 0 ? { R: spk } : null }, T);
      if (k > 0) {
        const pulse = 1 + Math.sin(T * 14) * .06;
        zzz(ctx, 760, 1230, T, 2.6 * pulse, 3);
        for (let i = 0; i < 3; i++) { ctx.save(); ctx.globalAlpha *= .6 * (1 - ((T * 1.5 + i / 3) % 1)); ctx.strokeStyle = '#7FD4FF'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(740, 1300, 40 + ((T * 1.5 + i / 3) % 1) * 100, -.8, .8); ctx.stroke(); ctx.restore(); }
      }
      const n = idle(P({ x: 1000, y: 1500, s: .75, view: 'q34', flip: -1 }), T, 2);
      C(ctx, 'nubi', n, { expr: k > .5 ? 'surprised' : 'confused', style: PJ('nubi') }, T);
    },
    ui: (ctx, T) => dim(ctx, .12),
    sfx: [[t77 - st('L77') + .2, 'buzz', .45], [t77 - st('L77') + .9, 'buzz', .45]] });

  // ===== S78 — family tree =====
  const tg = ws('L78', 'generation'), tb78 = ws('L78', 'broken');
  S.push({ id: 'S78', start: st('L78'), trans: 'cut', capY: 975,
    bg: kitchenN, cam: lt => camAt(560, 1190, 1.9 + lt * .03),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 560, y: 1500, s: .8 }), T, 4), T, 4, .5); p.armL = .9; p.handL = .3;
      C(ctx, 'grandpa', p, { expr: 'neutral', mouth: lipShape(T, ['L78']), style: PJ('grandpa') }, T);
    },
    ui(ctx, T) {
      dim(ctx, .15);
      const node = (x, y, label, col, k, asleep) => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); box(ctx, -110, -40, 220, 80, 18, col, 8); txt(ctx, label, 0, 0, 36, '#fff', OUTLINE, 7); if (asleep) zzz(ctx, 70, -40, T, .8, 2); ctx.restore(); };
      const a = smooth(inv(tb78, tb78 + .3, T)), b = smooth(inv(tg - .2, tg + .2, T)), c = smooth(inv(tg + .4, tg + .8, T));
      ctx.strokeStyle = OUTLINE; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(1500, 340); ctx.lineTo(1500, 400); ctx.moveTo(1500, 480); ctx.lineTo(1500, 540); ctx.stroke();
      node(1500, 300, 'GRANDPA: AWAKE', '#30A045', a, false);
      node(1500, 440, 'DAD: ZZZ', '#7B4BFF', b, true);
      node(1500, 580, 'ME: AWAKE', '#30A045', c, false);
    },
    sfx: [[tb78 - st('L78'), 'hud', .4], [tg - st('L78'), 'hud', .4], [tg - st('L78') + .5, 'hud', .4]] });

  // ===== S79 — "Then why do you pretend?" =====
  S.push({ id: 'S79', start: st('L79'), trans: 'cut', capY: 975,
    bg: kitchenN, cam: lt => camAt(560, 1170, 2.2 + lt * .04),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 560, y: 1500, s: .8 }), T, 1), T, 1, .5); p.armL = .8;
      C(ctx, 'nubi', p, { expr: 'confused', mouth: lipShape(T, ['L79']), style: PJ('nubi') }, T);
    },
    ui: (ctx, T) => dim(ctx, .12) });

  // ===== S80 — everybody wants something (flashback panel) =====
  const t80 = ws('L80', 'everybody');
  S.push({ id: 'S80', start: st('L80'), trans: 'cut', capY: 975,
    bg: kitchenN, cam: lt => camAt(460, 1190, 1.9 + lt * .03),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 460, y: 1500, s: .8 }), T, 4), T, 4, .5); p.armL = .5 * Math.sin(T * 2); p.handL = .3;
      C(ctx, 'grandpa', p, { expr: 'sad', mouth: lipShape(T, ['L80']), style: PJ('grandpa') }, T);
    },
    ui(ctx, T, lt) {
      dim(ctx, .15);
      const k = smooth(inv(t80 - .1, t80 + .4, T)); if (k <= 0) return;
      ctx.save(); ctx.translate(1440, 420); ctx.scale(k, k); ctx.rotate(.03);
      box(ctx, -250, -190, 500, 380, 14, '#E8D8B0', 10);
      ctx.beginPath(); ctx.rect(-230, -170, 460, 340); ctx.clip();
      ctx.fillStyle = '#C9A97A'; ctx.fillRect(-230, -170, 460, 340);
      circle(ctx, 0, -10, 46, '#F0C9A0', 6); box(ctx, -34, 34, 68, 110, 14, '#7B6B5A', 6);
      for (const [dx, col] of [[-170, '#EE384A'], [-100, '#2E6BD8'], [100, '#30A045'], [170, '#FF5B9B']]) {
        const sw = Math.sin(T * 6 + dx) * 8, side = dx < 0 ? 1 : -1;
        circle(ctx, dx + sw, -30, 28, '#F0C9A0', 5); box(ctx, dx - 24 + sw, 0, 48, 100, 10, col, 5);
        ctx.strokeStyle = OUTLINE; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(dx + side * 24 + sw, 20); ctx.lineTo(side * -40 + sw * .5, 20 + (dx % 3)); ctx.stroke();
      }
      ctx.restore();
    } });

  return S;
});
