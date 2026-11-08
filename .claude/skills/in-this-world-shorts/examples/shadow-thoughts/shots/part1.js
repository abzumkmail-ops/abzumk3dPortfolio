// shots/part1.js — S01–S09 (L0–L8): the world of talking shadows, and Nubi's tiny, secret-keeping shadow.
'use strict';
shots(() => {
  const S = [];
  // a shadow "chattering" (talking mouth that isn't tied to the narration)
  const chatter = (T, seed = 0) => ['smallOpen', 'wideOpen', 'round', 'teethOpen', 'closed'][Math.floor(T * 9 + seed * 3) % 5];
  // Nubi's tiny shadow at his feet (k .4), holding the same umbrella if he does
  const tinyShadow = (ctx, p, T, o = {}) => shadowOf(ctx, 'nubi', p, T, Object.assign({ k: .42, dx: 125, alpha: .6, seed: 3 }, o));
  // Umbrella held straight up over the head: undo the arm/hand/lean rotation so it stays upright, tilt the top toward
  // the head, and use a stick of length L (rig units). Shorter L = umbrella pulled lower. Use with p.armR ≈ 2.9.
  const umb = (p, L = 200, tilt = .5) => ctx => { ctx.save(); ctx.rotate(p.armR + p.handR - p.lean - tilt);
    box(ctx, -6, -L, 12, L + 40, 5, '#333', 4);
    ctx.translate(0, -L + 300); ctx.beginPath(); ctx.moveTo(-230, -300); ctx.quadraticCurveTo(0, -470, 230, -300);
    for (let i = 4; i >= 0; i--) ctx.quadraticCurveTo(-230 + (i + .5) * 92, -270, -230 + i * 92, -300); ctx.closePath(); fillStroke(ctx, '#24225B', 8);
    circle(ctx, 0, -388, 10, '#24225B', 5); ctx.restore(); };
  const umbArm = p => { p.armR = 2.9; p.handR = 0; return p; };
  const dimHall = (ctx, a) => { ctx.fillStyle = `rgba(28,20,70,${a})`; ctx.fillRect(-3000, -2000, 9000, 6000); };

  // ===== S01 — L0 "In this world, your shadow says what you're really thinking." (HOOK) =====
  const s01Says = ws('L0', 'says');
  S.push({ id: 'S01', start: 0, trans: 'none', capY: 1620,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const c = track([[0, camAt(255, 1010, 1.7)], [.35, camAt(255, 1010, 1.66)], [1.4, camAt(540, 1060, 1.0)]], lt); c.z += Math.max(0, lt - 1.4) * .03; return c; },
    draw(ctx, T, lt) {
      // wall shadows first (light comes from the windows on the left → shadows fall right, onto the lockers)
      const ap = idle(P({ x: 160, y: 1500, s: .8 }), T, 2); ap.armL = .35; ap.handL = .5;
      const cp = idle(P({ x: 860, y: 1500, s: .8 }), T, 4, .6); cp.head = -.08 + Math.sin(T * 1.3) * .03;
      shadowOf(ctx, 'kidA', ap, T, { k: 1.6, dx: 95, mouth: chatter(T, 1), seed: 1 });
      shadowOf(ctx, 'kidC', cp, T, { k: 1.55, dx: 70, mouth: T > s01Says ? chatter(T, 2) : 'closed', eyes: 'closed', seed: 2 });
      const np = idle(P({ x: 520, y: 1500, s: .78 }), T, 1, .5); np.headY = 14; np.armL = .02; np.armR = .02; np.squash = .97;
      tinyShadow(ctx, np, T, { k: .38, dx: 120 });
      C(ctx, 'kidA', ap, { expr: 'neutral', eyes: { open: .8 }, lookX: .2 }, T);
      C(ctx, 'kidC', cp, { expr: 'neutral', eyes: { open: .55 }, lookX: -.2 }, T);
      C(ctx, 'nubi', np, { expr: 'nervous', lookX: .5, lookY: .5, hoodie: nubiHoodie(T) }, T);
      speechBubble(ctx, 300, 700, "I'M HUNGRY", T + .2, { dark: true, size: 56, tail: -20 });
      speechBubble(ctx, 770, 690, 'THIS IS BORING', T - s01Says, { dark: true, size: 52, tail: 30 });
    },
    sfx: [[0, 'bell', .45], [.05, 'pop', .5], [s01Says, 'pop', .5]] });

  // ===== S02 — L1 "Out loud." kidC's shadow shouts BORING!! =====
  const s02Loud = ws('L1', 'loud');
  S.push({ id: 'S02', start: st('L1'), trans: 'zoom', capY: 1660,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => { const T = lt + st('L1'); const sh = Math.sin(T * 60) * 9 * Math.exp(-(T - s02Loud) * 4) * (T > s02Loud ? 1 : 0); return camAt(800 + sh, 1060, 1.38 + lt * .08); },
    draw(ctx, T, lt) {
      const t0 = st('L1');
      const cp = idle(P({ x: 860, y: 1500, s: .8 }), T, 4, .6);
      const grow = 1.55 + .2 * spring(T - t0, 2.5, 6);
      shadowOf(ctx, 'kidC', cp, T, { k: grow, dx: 70, mouth: 'scream', eyes: 'wide', seed: 2 });
      // teacher in the back row turns around at "loud"
      const turned = T > s02Loud;
      const tp = idle(P({ x: 560, y: 1400, s: .62, view: turned ? 'q34' : 'back' }), T, 6, .5);
      if (turned) surprise(tp, T - s02Loud);
      C(ctx, 'teacher', tp, { expr: 'surprised', lookX: .6 }, T);
      cp.armL = .5; cp.armR = .5;
      C(ctx, 'kidC', cp, { expr: 'nervous', eyes: { open: 1.2 }, lookX: .5, lookY: -.4 }, T);
      speechBubble(ctx, 770, 650, 'BORING!!', T - t0 - .02, { dark: true, size: 90, tail: 40, rot: -.05 });
    },
    sfx: [[.05, 'boing', .6]] });

  // ===== S03 — L2 "Shadows can't lie. And the bigger the shadow, the louder it gets." =====
  const s03Shadows = ws('L2', 'shadows'), s03Bigger = ws('L2', 'bigger'), s03Louder = ws('L2', 'louder');
  S.push({ id: 'S03', start: st('L2'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(540 + lt * 6, 1050, 1.0 + lt * .03),
    draw(ctx, T, lt) {
      // kidB: small shadow, whispering
      const bp = idle(P({ x: 190, y: 1500, s: .76, view: 'q34' }), T, 3);
      shadowOf(ctx, 'kidB', bp, T, { k: .95, dx: 120, mouth: T > s03Shadows && T < s03Bigger ? (Math.floor(T * 6) % 2 ? 'smallOpen' : 'closed') : 'closed', seed: 5 });
      // kidD: steps toward the window light at "bigger", his shadow grows 0.9 → 2.2
      const u = inv(s03Bigger, s03Louder + .15, T), dx0 = lerp(780, 600, easeInOut(u));
      let dp = P({ x: dx0, y: 1500, s: .78, view: 'q34', flip: -1 });
      if (u > 0 && u < 1) walk(dp, T, 1.4); else idle(dp, T, 7);
      const k = lerp(.9, 2.25, easeInOut(u));
      shadowOf(ctx, 'kidD', dp, T, { k, dx: lerp(110, 190, u), mouth: T > s03Louder ? chatter(T, 4) : 'closed', eyes: T > s03Louder ? 'happy' : 'normal', seed: 6 });
      C(ctx, 'kidB', bp, { expr: 'neutral', lookX: .3 }, T);
      C(ctx, 'kidD', dp, { expr: T > s03Louder + .2 ? 'shy' : 'neutral', lookX: T > s03Louder + .2 ? .7 : 0, lookY: T > s03Louder + .2 ? -.5 : 0 }, T);
      speechBubble(ctx, 370, 1040, 'psst...', T - s03Shadows, { dark: true, size: 46, dur: s03Bigger - s03Shadows, tail: -10 });
      const bs = lerp(56, 82, smooth(inv(s03Louder, s03Louder + .6, T)));
      speechBubble(ctx, 600, 470, 'I LOVE PIZZA!!!', T - s03Louder, { dark: true, size: bs, tail: 50 });
    },
    sfx: [[s03Shadows - st('L2'), 'pop', .3], [s03Bigger - st('L2'), 'whoosh', .5], [s03Louder - st('L2'), 'pop', .6]] });

  // ===== S04 — L3 "My dog's shadow just yells squirrel!" =====
  const s04Sq = ws('L3', 'squirrel');
  const squirrel = (ctx, x, y, s, T) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.save(); ctx.translate(-30, -30); ctx.rotate(-.3 + Math.sin(T * 9) * .12); box(ctx, -26, -110, 52, 120, 26, '#B5733F', 7); ctx.restore();
    ellipse(ctx, 10, -30, 34, 38, '#C98B4B', 7); circle(ctx, 30, -76, 26, '#C98B4B', 7); circle(ctx, 22, -100, 9, '#C98B4B', 5);
    circle(ctx, 38, -80, 5, OUTLINE); circle(ctx, 54, -72, 5, OUTLINE); ctx.restore(); };
  S.push({ id: 'S04', start: st('L3'), trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envBackyard(ctx, T, cam),
    cam: lt => { const T = lt + st('L3'); const sh = T > s04Sq ? Math.sin(T * 55) * 10 * Math.exp(-(T - s04Sq) * 5) : 0; return camAt(640 + sh, 1180, 1.2 + lt * .04); },
    draw(ctx, T, lt) {
      const jump = T > s04Sq ? Math.max(0, Math.sin(clamp((T - s04Sq) / .35) * Math.PI)) * 60 : 0;
      const ss = lerp(1.25, 1.75, easeOut(inv(s04Sq - .1, s04Sq + .2, T)));
      dogShadow(ctx, 540, 1430 - jump * 1.6, ss, T, { lines: T > s04Sq - .05 ? ['L3'] : [], alpha: .72 });
      // squirrel on the fence top (well clear of the shadow's face)
      const sqIn = easeOut(inv(s04Sq - .5, s04Sq - .1, T));
      if (sqIn > 0) squirrel(ctx, lerp(1250, 990, sqIn), 965, .9, T);
      drawDog(ctx, 400, 1500 - jump, .95, T);
      speechBubble(ctx, 700, 760, 'SQUIRREL!', T - s04Sq, { dark: true, size: 84, tail: 20, rot: -.04 });
    },
    sfx: [[s04Sq - st('L3'), 'bark', .7]] });

  // ===== S05 — L4 "And Mom loves my drawings. Her shadow says... it's a potato." =====
  const s05Loves = ws('L4', 'loves'), s05Shadow = ws('L4', 'shadow'), s05Its = ws('L4', "it's"), s05Potato = ws('L4', 'potato');
  S.push({ id: 'S05', start: st('L4'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam),
    cam: lt => { const T = lt + st('L4'); const k = smooth(inv(s05Shadow - .1, s05Shadow + .5, T)); return camAt(lerp(520, 590, k), lerp(1090, 1050, k), 1.18 + lt * .025); },
    draw(ctx, T, lt) {
      const mp = idle(P({ x: 650, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 4); mp.armR = 1.5; mp.handR = -.3;
      const sa = smooth(inv(s05Shadow, s05Shadow + .3, T));
      if (sa > 0) shadowOf(ctx, 'mom', mp, T, { k: 1.4, dx: 230, alpha: .6 * sa, eyes: 'normal', mouth: T > s05Its - .02 ? (lipShape(T, ['L4']) || 'flat') : 'flat', face: { holding: { R: holdDrawing } }, seed: 4 });
      const np = idle(P({ x: 250, y: 1500, s: .8, view: 'q34' }), T, 1);
      const conf = T > s05Potato;
      if (!conf) { np.armL = -.25; np.armR = -.25; np.bodyY -= 6; np.lean = -.06; } else { np.head = .14; np.armR = .9; }
      C(ctx, 'nubi', np, { expr: conf ? 'confused' : 'excited', hoodie: nubiHoodie(T) }, T);
      C(ctx, 'mom', mp, { expr: 'happy', holding: { R: holdDrawing } }, T);
      if (T > s05Loves && T < s05Shadow) burst(ctx, 640, 1000, T - s05Loves, { kind: 'heart', n: 6, speed: 300, gravity: -200, life: 1, size: 22, seed: 5 });
      speechBubble(ctx, 790, 690, "IT'S A POTATO.", T - s05Potato + .05, { dark: true, size: 50, tail: 60 });
    },
    sfx: [[s05Loves - st('L4'), 'ding', .5], [s05Potato - st('L4') + .15, 'sad_trombone', .55]] });

  // ===== S06 — L5 "Me? I keep my shadow tiny. I stay out of the light." (Nubi close-up, lip-sync) =====
  const s06Tiny = ws('L5', 'tiny'), s06Light = ws('L5', 'light');
  S.push({ id: 'S06', start: st('L5'), trans: 'zoom', capY: 1700,
    bg: (ctx, T, cam) => { envHallway(ctx, T, cam); dimHall(ctx, .38); },
    cam: lt => camAt(560, 1210, 1.95 + lt * .06),
    draw(ctx, T, lt) {
      const lo = easeOut(inv(s06Light - .1, s06Light + .25, T)), L = lerp(210, 120, lo);
      const np = talk(idle(P({ x: 540, y: 1500, s: .8, flip: -1 }), T, 1), T, 1, .4); umbArm(np);
      // at "tiny" he points down at his tiny shadow
      const pt = smooth(inv(s06Tiny - .15, s06Tiny + .1, T)) * (1 - smooth(inv(s06Tiny + .9, s06Tiny + 1.2, T)));
      np.armL = lerp(np.armL, 1.0, pt); np.handL = lerp(0, -.5, pt);
      np.headY += lo * 10; np.squash = 1 - lo * .04;
      const um = umb(np, L);
      tinyShadow(ctx, np, T, { k: .4, dx: 150, eyes: T > s06Light ? 'wide' : 'normal', face: { holding: { R: um } } });
      const expr = T > s06Light - .05 ? 'nervous' : T > s06Tiny - .1 ? 'smug' : 'happy';
      C(ctx, 'nubi', np, { expr, mouth: lipShape(T, ['L5']), lookX: pt > .3 ? -.6 : 0, lookY: pt > .3 ? .6 : T > s06Light ? -.6 : 0, hoodie: nubiHoodie(T), holding: { R: um } }, T);
    },
    sfx: [[s06Light - st('L5'), 'step', .5]] });

  // ===== S07 — L6 "Kids call me Vampire Nubi." =====
  const s07Vamp = ws('L6', 'vampire');
  S.push({ id: 'S07', start: st('L6'), trans: 'cut', capY: 1630,
    bg: (ctx, T, cam) => envBackyard(ctx, T, cam),
    cam: lt => camAt(660 + lt * 8, 1110, 1.04 + lt * .03),
    draw(ctx, T, lt) {
      const t0 = st('L6');
      const nx = lerp(250, 370, inv(t0, s07Vamp + .2, T));
      const np = T < s07Vamp + .2 ? walk(P({ x: nx, y: 1500, s: .78, view: 'q34' }), T, 1.1, .7) : idle(P({ x: nx, y: 1500, s: .78, view: 'q34' }), T, 1);
      umbArm(np); np.headY += 12; np.lean += .08;
      if (T > s07Vamp) { np.squash = .95; np.headY += 6; }
      const um = umb(np, T > s07Vamp ? 150 : 190);
      tinyShadow(ctx, np, T, { k: .38, dx: 110, face: { holding: { R: um } } });
      C(ctx, 'nubi', np, { expr: T > s07Vamp ? 'sad' : 'nervous', lookX: .4, lookY: .5, hoodie: nubiHoodie(T), holding: { R: um } }, T);
      // kidB laughing
      const bp = laugh(P({ x: 845, y: 1500, s: .7, view: 'q34', flip: -1 }), T, T > s07Vamp ? 1 : .3);
      C(ctx, 'kidB', bp, { expr: 'laughing' }, T);
      // kidA points and laughs
      const ap = P({ x: 640, y: 1500, s: .74, view: 'q34', flip: -1 }); idle(ap, T, 2);
      if (T > t0 + .3) { laugh(ap, T, .6); ap.armR = 1.65 + Math.sin(T * 10) * .08; ap.handR = .1; }
      C(ctx, 'kidA', ap, { expr: T > t0 + .3 ? 'laughing' : 'smug' }, T);
      // kidE: "fangs" — hands up like claws at "vampire"
      const ep = idle(P({ x: 1040, y: 1500, s: .74, view: 'q34', flip: -1 }), T, 5);
      const f = smooth(inv(s07Vamp - .1, s07Vamp + .15, T));
      ep.armL = lerp(ep.armL, 2.5, f); ep.armR = lerp(ep.armR, 2.3, f); ep.handL = -1.1 * f; ep.handR = -1.1 * f; ep.lean += .12 * f; ep.bodyY -= 10 * f;
      C(ctx, 'kidE', ep, { expr: f > .5 ? 'excited' : 'laughing', mouth: f > .5 ? 'teethOpen' : null }, T);
      speechBubble(ctx, 960, 880, 'VAMPIRE!', T - s07Vamp, { size: 62, tail: 10, rot: .05 });
    },
    sfx: [[s07Vamp - st('L6'), 'laugh', .6]] });

  // ===== S08 — L7 "Because my shadow has one big secret." (HUD pops in at "secret") =====
  const s08Shadow = ws('L7', 'shadow'), s08Secret = ws('L7', 'secret');
  S.push({ id: 'S08', start: st('L7'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => { envHallway(ctx, T, cam); dimHall(ctx, .25); },
    cam: lt => { const T = lt + st('L7'); const k = smooth(inv(s08Shadow - .2, s08Shadow + .6, T)); return camAt(lerp(560, 600, k), lerp(1190, 1230, k), 1.55 + lt * .05); },
    draw(ctx, T, lt) {
      const np = idle(P({ x: 520, y: 1500, s: .8, view: 'q34' }), T, 1, .5); umbArm(np); np.headY += 14; np.head = .1;
      const um = umb(np, 170), sec = T > s08Secret;
      const jit = sec ? Math.sin(T * 47) * 3 : 0;
      tinyShadow(ctx, np, T, { k: .5, dx: 150 + jit, eyes: sec ? 'wide' : 'normal', mouth: sec ? 'flat' : 'closed', face: { holding: { R: um } } });
      C(ctx, 'nubi', np, { expr: 'nervous', lookX: .7, lookY: .9, hoodie: nubiHoodie(T), holding: { R: um } }, T);
      // a nervous "!" over the tiny shadow at "secret"
      if (sec) popText(ctx, '!', 700, 1220, T - s08Secret, { size: 90, fill: '#FFD447', rot: .1 });
    },
    sfx: [[s08Secret - st('L7'), 'hud', .6]] });

  // ===== S09 — L8 "Lily." She walks past; Nubi blushes; his tiny shadow bursts hearts =====
  const s09Lily = ws('L8', 'lily');
  S.push({ id: 'S09', start: st('L8'), trans: 'zoom', capY: 1660,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(580, 1210, 1.4 + lt * .06),
    draw(ctx, T, lt) {
      const t0 = st('L8');
      const lx = lerp(1060, 800, easeOut(inv(t0, t0 + 1.1, T)));
      const lp = walk(P({ x: lx, y: 1500, s: .78, view: 'q34', flip: -1 }), T, 1.1, .8);
      const np = idle(P({ x: 360, y: 1500, s: .8, view: 'q34' }), T, 1, .5); umbArm(np);
      const shy = T > s09Lily + .1, um = umb(np, 180);
      if (shy) { np.squash = .97; np.head = -.08; }
      tinyShadow(ctx, np, T, { k: .45, dx: 140, eyes: shy ? 'happy' : 'normal', face: { holding: { R: um } } });
      C(ctx, 'nubi', np, { expr: shy ? 'shy' : 'surprised', lookX: .8, lookY: shy ? .2 : 0, blush: shy ? 1 : 0, hoodie: nubiHoodie(T), holding: { R: um } }, T);
      lp.armL = .5;
      C(ctx, 'lily', lp, { expr: 'happy', lookX: .2, holding: { L: holdBook } }, T);
      // sparkles around Lily
      for (let i = 0; i < 7; i++) { const a = hash(i + 5) * TAU + T * .8, r = 170 + hash(i + 9) * 90, tw = Math.max(0, Math.sin(T * 6 + i * 1.7));
        starPath(ctx, lx + Math.cos(a) * r, 1220 + Math.sin(a) * r * .9, 22 * tw + 4, 6 * tw + 1, 4); fillStroke(ctx, '#FFF6B0', 0); }
      burst(ctx, 500, 1370, T - s09Lily - .12, { kind: 'heart', n: 9, speed: 520, angle: -Math.PI / 2, spread: 1.4, gravity: 300, life: 1.0, size: 24, seed: 11 });
    },
    sfx: [[s09Lily - st('L8'), 'chime', .55], [s09Lily - st('L8') + .15, 'sparkle', .5]] });

  return S;
});
