// shots/part2.js — S10–S17 (L9–L16): the talent-show stage, the giant shadow, and Brayden's shadow spilling his secret.
'use strict';
shots(() => {
  const S = [];
  const STAGE = 1190;                       // stage floor (envStage)
  const toScr = (cam, x, y) => [(x - cam.x) * cam.z + 540, (y - cam.y) * cam.z + 960];

  // ---------- local helpers (part 2 only) ----------
  // Where a shadowOf() head lands (same maths as story.js shadowOf).
  const shHead = (name, pose, k, dx = 0) => { const S = pose.s * k * (CAST[name].tall || 1);
    return { x: pose.x + dx + (pose.view === 'q34' ? RIG.headW * .1 * S * pose.flip : 0), y: pose.y + (pose.bodyY - RIG.legH - RIG.torsoH - RIG.headH * .45) * S, S }; };
  // Soft elliptical pool of light on a wall/curtain (world space, additive).
  function wallLight(ctx, x, y, rx, ry, a, col = '255,226,160') {
    if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(rx, ry);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, `rgba(${col},${.42 * a})`); g.addColorStop(.6, `rgba(${col},${.22 * a})`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill(); ctx.restore();
  }
  // Dark backs-of-heads audience in front of the stage (world space, below the stage lip).
  function crowdBacks(ctx, T, y = 1960, s = .95) {
    ctx.save(); ctx.filter = 'brightness(.3)';
    [[90, 'kidB'], [320, 'kidE'], [540, 'kidD'], [760, 'kidF'], [990, 'kidA']].forEach(([x, n], i) => {
      const p = idle(P({ x, y: y + (i % 2) * 40, s, view: 'back' }), T, i + 4, .7); drawCharacter(ctx, n, p, {}, T); });
    ctx.restore();
  }
  // Gym floor seen from the stage: cinder-block back wall (light enough for shadows to read), blue wall mats, EXIT sign.
  // envAudience() lives in story.js (shared with part 3)
  // Nubi's teal hoodie as a loose cloth (thrown / draped over the giant shadow's face).
  function hoodieCloth(ctx, x, y, sc, rot = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
    const c = '#20BDBB';
    ctx.save(); ctx.translate(-112, -70); ctx.rotate(.35); box(ctx, -30, 0, 60, 170, 24, shade(c, -.12), 8); ctx.restore();
    ctx.save(); ctx.translate(112, -70); ctx.rotate(-.35); box(ctx, -30, 0, 60, 170, 24, shade(c, -.12), 8); ctx.restore();
    box(ctx, -120, -84, 240, 200, 28, c, 8);
    starPath(ctx, -46, -20, 30, 13); fillStroke(ctx, '#fff', 5);
    rr(ctx, -74, 52, 148, 48, 14); fillStroke(ctx, shade(c, -.12), 6);
    ctx.restore();
  }
  // White eyes in a blackout (world space).
  function darkEyes(ctx, name, p, T) {
    const S = p.s * (CAST[name].tall || 1), q = p.view === 'q34', fx = q ? RIG.headW * .94 * .1 : 0, sep = 50 * (q ? .92 : 1);
    const y = p.y + p.bodyY * p.s + (-421 + p.headY) * S, bl = blinkAmt(CAST[name].seed, T);
    ctx.save(); ctx.shadowColor = '#fff'; ctx.shadowBlur = 12;
    for (const e of [-sep, sep]) ellipse(ctx, p.x + (fx + e) * S * p.flip, y, 15 * S, 22 * S * bl, '#fff');
    ctx.restore();
  }

  // ===== S10 — Then one day, Brayden pushed me onto the talent show stage. =====
  const s10 = st('L9'), tBray = ws('L9', 'brayden'), tPush = ws('L9', 'pushed'), tStage = ws('L9', 'stage');
  const cam10 = lt => { const T = lt + s10, k = smooth(inv(tPush, tStage + .25, T));
    const sh = T > tStage ? Math.sin(T * 60) * 8 * Math.exp(-(T - tStage) * 5) : 0;
    return camAt(lerp(400, 540, k) + sh, 1020, 1.3 + lt * .03); };
  S.push({ id: 'S10', start: s10, trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envStage(ctx, T, cam),
    cam: cam10,
    draw(ctx, T, lt) {
      // Brayden sneaks out of the left wing, winds up on "Brayden", shoves on "pushed", then dusts his hands and backs off
      const bx = T < tPush ? lerp(40, 170, easeOut(inv(s10, tPush, T))) : T < tStage + .1 ? 170 : lerp(170, 40, easeInOut(inv(tStage + .1, tStage + .8, T)));
      const bp = P({ x: bx, y: STAGE, s: .8, view: 'q34' });
      if (T < tBray) { idle(bp, T, 3); if (T < tPush) walk(bp, T, 1.1, .5); }
      else if (T < tPush) { anticipate(bp, T - tBray, tPush - tBray); bp.armL = -.55; bp.armR = -.45; bp.lean = -.12; }
      else if (T < tStage + .1) { const k = easeOut(inv(tPush, tPush + .1, T)); bp.armL = lerp(-.55, 1.6, k); bp.armR = lerp(-.45, 1.5, k); bp.lean = .25 * (1 - inv(tPush + .2, tStage, T)); }
      else { idle(bp, T, 3); walk(bp, T, 1.2, .6); bp.armL = .5 + Math.sin(T * 22) * .25; bp.armR = .5 - Math.sin(T * 22) * .25; }
      // Nubi: resisting at the wing edge → launched, flailing, to centre → lands on "stage"
      const nx = T < tPush ? 330 : lerp(330, 540, easeOut(inv(tPush, tStage, T)));
      let np = P({ x: nx, y: STAGE, s: .8, view: 'q34' });
      let nf = { expr: 'nervous', lookX: T > tBray ? -.7 : 0, hoodie: nubiHoodie(T) };
      if (T < tPush) { idle(np, T, 1); np.lean = -.1; }
      else if (T < tStage) { run(np, T, 2.6); np.armL = 2.4 + Math.sin(T * 34) * .9; np.armR = 1.7 + Math.cos(T * 34) * 1.0; np.lean = .32; nf = { expr: 'screaming', hoodie: nubiHoodie(T) }; }
      else { const d = T - tStage; np.view = 'front'; np.squash = lerp(.8, 1, spring(d, 3, 6)); np.armL = .2 + 1.2 * Math.exp(-d * 3) * (1 + Math.sin(d * 18) * .3); np.armR = .2 + 1.2 * Math.exp(-d * 3) * (1 - Math.sin(d * 18) * .3); idle(np, T, 1, .5);
        nf = { expr: 'terrified', lookY: .15, hoodie: nubiHoodie(T) }; }
      // tiny shadow at his feet (he still keeps it small)
      shadowOf(ctx, 'nubi', np, T, { k: .4, dx: 80, eyes: T > tPush ? 'wide' : 'normal', face: { hoodie: nubiHoodie(T) } });
      C(ctx, 'brayden', bp, { expr: T > tPush ? 'laughing' : 'smug' }, T);
      C(ctx, 'nubi', np, nf, T);
      burst(ctx, 540, STAGE, T - tStage, { kind: 'dust', n: 16, speed: 650, angle: -Math.PI / 2, spread: 2.6, gravity: 400, life: .6, size: 30 });
      crowdBacks(ctx, T);
    },
    ui(ctx, T) { popText(ctx, 'SHOVE!', 330, 700, T - tPush, { size: 96, fill: '#FFD447', rot: -.15, dur: .8 }); },
    sfx: [[tPush - s10, 'whoosh', .6], [tStage - s10, 'thud', .65]] });

  // ===== S11 — Right under the biggest spotlight in school. =====
  const s11 = st('L10'), tSpot = ws('L10', 'spotlight');
  const cam11 = lt => { const T = lt + s11, k = easeOut(inv(tSpot, tSpot + .15, T));
    const sh = T > tSpot ? Math.sin(T * 70) * 10 * Math.exp(-(T - tSpot) * 6) : 0;
    return camAt(540 + sh, 1130, lerp(1.4 + lt * .03, 1.5 + lt * .03, k), -.05 * k); };
  const nubiK = (T, t0) => T < t0 ? .45 : lerp(.45, 2.6, easeOut(inv(t0, t0 + .45, T)));
  S.push({ id: 'S11', start: s11, trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envStage(ctx, T, cam),
    cam: cam11,
    draw(ctx, T, lt) {
      const on = T >= tSpot;
      const p = P({ x: 540, y: STAGE, s: .8 });
      if (!on) idle(p, T, 1); else { surprise(p, T - tSpot); p.armL = lerp(p.armL, .1, inv(tSpot + .25, tSpot + .5, T)); p.armR = lerp(p.armR, .1, inv(tSpot + .25, tSpot + .5, T)); p.x += Math.sin(T * 55) * 2; }
      wallLight(ctx, 540, 820, 700, 520, on ? smooth(inv(tSpot, tSpot + .1, T)) : 0);
      const k = nubiK(T, tSpot);
      shadowOf(ctx, 'nubi', p, T, { k, dx: lerp(80, 40, inv(.45, 2.6, k)), eyes: 'wide', face: { hoodie: nubiHoodie(T) } });
      C(ctx, 'nubi', p, { expr: on ? 'terrified' : 'nervous', lookX: on ? 0 : Math.sin(T * 3) * .7, noBlink: on, hoodie: nubiHoodie(T) }, T);
      crowdBacks(ctx, T);
    },
    ui(ctx, T) {
      if (T < tSpot) return;
      spotlight(ctx, 540, .62);
      const f = 1 - inv(tSpot, tSpot + .15, T); if (f > 0) { ctx.fillStyle = `rgba(255,248,220,${.7 * f})`; ctx.fillRect(0, 0, W, H); }
    },
    sfx: [[tSpot - s11, 'impact', .7]] });

  // ===== S12 — My shadow was ten feet tall. (pull back to reveal the giant) =====
  const s12 = st('L11'), tTen = ws('L11', 'ten'), tFeet = ws('L11', 'feet'), tTall = ws('L11', 'tall'), s12b = ws('L11', 'and') - .08;
  const cam12 = lt => { const T = lt + s12, k = easeInOut(inv(s12 + .05, tTall + .25, T));
    return camAt(540, lerp(1120, 960, k), lerp(1.4, .85, k) - lt * .01); };
  S.push({ id: 'S12', start: s12, trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envStage(ctx, T, cam),
    cam: cam12,
    draw(ctx, T, lt) {
      const p = P({ x: 540, y: STAGE, s: .8 }); p.armL = .1; p.armR = .1; p.x += Math.sin(T * 55) * 2;
      if (T > tTall) { surprise(p, T - tTall); }
      wallLight(ctx, 540, 820, 700, 520, 1);
      const sp = Object.assign({}, p, { bodyY: Math.sin(T * 2) * 5 });
      shadowOf(ctx, 'nubi', sp, T, { k: 2.6, dx: 40, eyes: 'wide', face: { hoodie: nubiHoodie(T) } });
      C(ctx, 'nubi', p, { expr: 'terrified', lookY: T > tTen ? -.8 : 0, hoodie: nubiHoodie(T) }, T);
      // "ten feet" measuring arrow beside the shadow
      const h = shHead('nubi', sp, 2.6, 40), top = h.y - RIG.headH * .6 * h.S, u = easeOut(inv(tTen, tFeet + .2, T));
      if (u > 0) { const yT = lerp(STAGE, top, u); ctx.save(); ctx.strokeStyle = '#FFD447'; ctx.lineWidth = 12; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(940, STAGE); ctx.lineTo(940, yT); ctx.stroke(); ctx.beginPath(); ctx.moveTo(900, yT); ctx.lineTo(980, yT); ctx.moveTo(900, STAGE); ctx.lineTo(980, STAGE); ctx.stroke(); ctx.restore(); }
      crowdBacks(ctx, T);
    },
    ui(ctx, T, lt) {
      spotlight(ctx, 540, .62);
      const cam = cam12(lt), [x, y] = toScr(cam, 940, 620);
      popText(ctx, '10 FT!', Math.min(x, 900), y, T - tFeet, { size: 110, fill: '#FFD447', rot: .1, dur: 1.3 });
    },
    sfx: [[tTen - s12, 'magic', .4]] });

  // ===== S12b — And Lily was in the front row. (reverse: the audience) =====
  const tLily = ws('L11', 'lily'), tRow = ws('L11', 'row');
  S.push({ id: 'S12b', start: s12b, trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envAudience(ctx, T, cam, { dim: .35 }),
    cam: lt => camAt(580, 1230, 1.2 + lt * .05),
    draw(ctx, T, lt) {
      // back row (smaller) then front row
      for (const [n, x, i] of [['kidD', 370, 0], ['kidF', 600, 1]]) { const kp = idle(P({ x, y: 1395, s: .6 }), T, 7 + i); C(ctx, n, kp, { expr: 'surprised', lookY: -.7 }, T); }
      wallLight(ctx, 480, 1150, 330, 420, smooth(inv(tLily - .1, tLily + .3, T)), '255,120,190');
      for (const [n, x, i] of [['kidA', 260, 0], ['kidC', 700, 1]]) { const kp = idle(P({ x, y: 1500, s: .8 }), T, 2 + i); C(ctx, n, kp, { expr: 'surprised', lookY: -.8, lookX: i ? -.2 : .2 }, T); }
      const lp = idle(P({ x: 480, y: 1500, s: .8 }), T, 2, .6); lp.armL = -.55; lp.handL = .4; lp.armR = -.35;
      const up = T > tLily;
      if (up) lp.headY = -6 * spring(T - tLily, 2, 5);
      C(ctx, 'lily', lp, { expr: up ? 'shy' : 'neutral', lookY: up ? -.75 : .7, lookX: 0, holding: { L: holdBook } }, T);
      // Brayden at the right, arms crossed, smirking
      const bp = idle(P({ x: 915, y: 1470, s: .78 }), T, 3, .5); bp.armL = -1.0; bp.armR = -1.0; bp.handL = -.6; bp.handR = -.6;
      C(ctx, 'brayden', bp, { expr: 'smug', lookX: -.6 }, T);
      burst(ctx, 480, 960, T - tLily, { kind: 'sparkle', n: 12, speed: 520, gravity: 120, life: .9, size: 22, colors: ['#FF7AC0', '#FFD447', '#fff'] });
    },
    ui(ctx, T) { vignette(ctx, .45); },
    sfx: [[tLily - s12b, 'chime', .55]] });

  // ===== S13 — Subscribe, because my shadow just took a deep breath. =====
  const s13 = st('L12'), tShad13 = ws('L12', 'shadow'), tTook = ws('L12', 'took'), tDeep = ws('L12', 'deep'), tBreath = ws('L12', 'breath');
  const cam13 = lt => { const T = lt + s13, sh = T > tDeep ? Math.sin(T * 50) * 6 * smooth(inv(tDeep, tDeep + .2, T)) : 0;
    const u = easeInOut(inv(tTook, tBreath + .3, T)); return camAt(540 + sh, 800 - 60 * u, 1.1 + lt * .03); };
  S.push({ id: 'S13', start: s13, trans: 'zoom', capY: 1720,
    bg: (ctx, T, cam) => envStage(ctx, T, cam),
    cam: cam13,
    draw(ctx, T, lt) {
      const p = P({ x: 540, y: STAGE, s: .8 }); p.armL = .1; p.armR = .1; p.x += Math.sin(T * 55) * 2;
      const scream = T > tDeep;
      if (scream) { surprise(p, T - tDeep); p.armL = 2.6 + Math.sin(T * 30) * .15; p.armR = 2.6 - Math.sin(T * 30) * .15; p.bodyY -= 20 * Math.abs(Math.sin(T * 14)); }
      wallLight(ctx, 540, 820, 720, 540, 1);
      // the inhale: grows ~12%, chest puffs, arms lift, mouth round
      const u = easeInOut(inv(tTook, tBreath + .3, T));
      const sp = Object.assign({}, p, { armL: .1 + .7 * u, armR: .1 + .7 * u, squash: 1 + .05 * u, bodyY: -10 * u, x: 540 });
      shadowOf(ctx, 'nubi', sp, T, { k: 2.6 * (1 + .12 * u), dx: 40, eyes: 'wide', mouth: u > .02 ? 'round' : 'closed', face: { hoodie: nubiHoodie(T) } });
      C(ctx, 'nubi', p, { expr: scream ? 'screaming' : 'terrified', lookY: scream ? 0 : -.85, hoodie: nubiHoodie(T) }, T);
      // air being sucked in towards the shadow's mouth
      if (u > 0 && u < 1) { const h = shHead('nubi', sp, 2.6 * (1 + .12 * u), 40); ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 8; ctx.lineCap = 'round';
        for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + .3, f = (T * 2.5 + i / 6) % 1, r0 = lerp(520, 140, f); ctx.globalAlpha = Math.sin(f * Math.PI) * .8;
          ctx.beginPath(); ctx.moveTo(h.x + Math.cos(a) * r0, h.y + 100 + Math.sin(a) * r0 * .7); ctx.lineTo(h.x + Math.cos(a) * (r0 - 90), h.y + 100 + Math.sin(a) * (r0 - 90) * .7); ctx.stroke(); }
        ctx.restore(); }
      crowdBacks(ctx, T);
    },
    ui(ctx, T, lt) {
      spotlight(ctx, 540, .6);
      if (T > tDeep) vignette(ctx, .55 + .3 * Math.sin((T - tDeep) * 12), '238,56,74');
      drawSubscribe(ctx, lt - .05, tTook - s13);
    },
    sfx: [[.65, 'click', .6], [tDeep - s13, 'alarm', .5]] });

  // ===== S14 — I covered it with my hoodie. It peeked out. =====
  const s14 = st('L13'), tCover = ws('L13', 'covered'), tHood = ws('L13', 'hoodie'), tOff = tHood + .1, tPeek = ws('L13', 'peeked');
  const tStick = tOff + .35;
  S.push({ id: 'S14', start: s14, trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envStage(ctx, T, cam),
    cam: lt => { const T = lt + s14, sh = T > tPeek ? Math.sin(T * 60) * 6 * Math.exp(-(T - tPeek) * 6) : 0; return camAt(540 + sh, 880, 1.0 + lt * .03); },
    draw(ctx, T, lt) {
      const hood = nubiHoodie(T);
      const p = idle(P({ x: 540, y: STAGE, s: .8 }), T, 1, .6);
      let face = { expr: 'determined', lookY: -.6, hoodie: hood };
      if (T >= tCover && T < tOff) { const k = easeInOut(inv(tCover, tOff, T)); p.armL = lerp(-.4, 2.9, k); p.armR = lerp(-.4, 2.9, k); p.handL = p.handR = -.3; p.headY = 10 * k; }
      else if (T >= tOff && T < tStick + .15) { p.armL = 2.9; p.armR = lerp(2.9, 2.4, inv(tOff, tOff + .2, T)); anticipate(p, T - tOff, .15); }
      else if (T >= tStick + .15) { const d = T - tStick - .15; p.armL = lerp(2.9, .15, smooth(d / .3)); p.armR = lerp(2.4, .15, smooth(d / .3)); face = { expr: 'smug', lookY: -.6, hoodie: hood }; }
      if (T > tPeek) { surprise(p, T - tPeek); face = { expr: 'terrified', lookY: -.8, hoodie: hood }; }
      wallLight(ctx, 540, 820, 700, 520, 1);
      const sp = Object.assign({}, p, { armL: .1, armR: .1, handL: 0, handR: 0, headY: 0, bodyY: Math.sin(T * 2) * 5 });
      shadowOf(ctx, 'nubi', sp, T, { k: 2.6, dx: 40, eyes: T > tPeek ? 'normal' : 'wide', face: { hoodie: hood } });
      // the hoodie: flies from his hands to the shadow's face, sticks; on "peeked" it slips down and the eyes peek over it
      const h = shHead('nubi', sp, 2.6, 40);
      if (T >= tOff) {
        const f = easeOut(inv(tOff, tStick, T)), sx = 540, sy = STAGE - 640;
        const x = lerp(sx, h.x, f), y = lerp(sy, h.y + 40, f) - Math.sin(f * Math.PI) * 160;
        const slip = T > tPeek ? 180 * easeOut(inv(tPeek, tPeek + .18, T)) : 0;
        const wob = T > tStick ? Math.sin((T - tStick) * 20) * .06 * Math.exp(-(T - tStick) * 5) : 0;
        hoodieCloth(ctx, x, y + slip, lerp(.7, 2.15, f), (1 - f) * 5 + wob + (T > tPeek ? .06 : 0));
      }
      C(ctx, 'nubi', p, face, T);
      if (T > tPeek) { ctx.save(); ctx.globalAlpha = 1 - inv(tPeek + .3, tPeek + .6, T); txt(ctx, '!', h.x + 300, h.y - 60, 160, '#fff', OUTLINE, 12); ctx.restore(); }
      burst(ctx, 640, STAGE - 700, T - tOff, { kind: 'dust', n: 14, speed: 600, gravity: 100, life: .45, size: 34, colors: ['#BFF3F2', '#fff', '#20BDBB'] });
      crowdBacks(ctx, T);
    },
    ui(ctx, T) { spotlight(ctx, 540, .6); },
    sfx: [[tOff - s14, 'poof', .6], [tPeek - s14, 'boing', .6]] });

  // ===== S15 — I turned off the lights. The emergency lights turned on. =====
  const s15 = st('L14'), tOffL = ws('L14', 'off'), tEm = ws('L14', 'emergency');
  const cam15 = lt => { const T = lt + s15, k = easeOut(inv(tEm, tEm + .3, T));
    const sh = T > tEm ? Math.sin(T * 55) * 12 * (Math.exp(-(T - tEm) * 3) + .25) : 0;
    return camAt(lerp(660, 620, k) + sh, lerp(880, 730, k), 1.0 + lt * .02); };
  S.push({ id: 'S15', start: s15, trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envStage(ctx, T, cam),
    cam: cam15,
    draw(ctx, T, lt) {
      const em = T >= tEm, dark = T >= tOffL && !em;
      // light switch on the back wall, stage right
      const swOn = T < tOffL || em;
      box(ctx, 860, 790, 110, 160, 14, '#FFD447', 8); box(ctx, 880, 810, 70, 120, 10, '#E8E4F2', 6); box(ctx, 900, swOn ? 822 : 872, 30, 46, 8, swOn ? '#30CE65' : '#EE384A', 5);
      // Nubi dashes to the switch, slaps it on "off", then spins round on "emergency"
      const nx = lerp(560, 790, easeOut(inv(s15, tOffL - .1, T)));
      let p = P({ x: nx, y: STAGE, s: .8, view: 'q34' }); let face = { expr: 'determined', hoodie: nubiHoodie(T) };
      if (T < tOffL - .1) run(p, T, 2.2);
      else if (!em) { idle(p, T, 1, .5); p.armR = lerp(1.2, 2.25, easeOut(inv(tOffL - .1, tOffL, T))); p.handR = -.4; face = { expr: 'smug', hoodie: nubiHoodie(T) }; }
      else { p.flip = -1; surprise(p, T - tEm); p.armL = 2.5 + Math.sin(T * 30) * .1; p.armR = 2.3; p.lean = -.2; face = { expr: 'terrified', lookY: -.5, hoodie: nubiHoodie(T) }; }
      if (em) wallLight(ctx, 500, 700, 760, 620, 1, '255,60,70');
      else wallLight(ctx, 540, 820, 700, 520, 1);
      const k = em ? lerp(2.6, 2.9, easeOut(inv(tEm, tEm + .3, T))) : 2.6, sdx = -260;
      const sp = Object.assign({}, p, { bodyY: Math.sin(T * 2) * 5 + (em ? -20 * Math.abs(Math.sin(T * 6)) : 0) });
      shadowOf(ctx, 'nubi', sp, T, { k, dx: sdx, eyes: 'wide', alpha: em ? .78 : .62, face: { hoodie: nubiHoodie(T) } });
      C(ctx, 'nubi', p, face, T);
      crowdBacks(ctx, T);
      if (dark) { // blackout: only the shadow's glowing eyes (and Nubi's) remain
        ctx.fillStyle = 'rgba(2,2,8,.97)'; ctx.fillRect(-3000, -3000, 9000, 9000);
        const h = shHead('nubi', sp, k, sdx); shadowFace(ctx, h.x, h.y, h.S, T, { eyes: 'wide' });
        darkEyes(ctx, 'nubi', p, T);
      }
    },
    ui(ctx, T) {
      if (T < tOffL) spotlight(ctx, 540, .6);
      if (T >= tEm) emergencyLights(ctx, T, smooth(inv(tEm, tEm + .12, T)));
      else if (T >= tOffL) popText(ctx, 'CLICK!', 760, 560, T - tOffL, { size: 90, fill: '#fff', rot: .1, dur: .6 });
    },
    sfx: [[tOffL - s15, 'click', .7], [tEm - s15, 'alarm', .6]] });

  // ===== S16 — Then the spotlight hit Brayden, and his shadow said... =====
  const s16 = st('L15'), tHit = ws('L15', 'hit'), tHisSh = ws('L15', 'shadow'), tSaid = ws('L15', 'said');
  const BX = 680, BSDX = 70;                                  // Brayden in the aisle; his shadow on the wall just behind/right
  const cam16 = lt => { const T = lt + s16; const sh = T > tHit ? Math.sin(T * 60) * 6 * Math.exp(-(T - tHit) * 6) : 0; return camAt(640 + sh, 1170, 1.3 + lt * .04); };
  const braydenK = T => lerp(.45, 1.7, easeOut(inv(tHit + .1, tHisSh + .1, T)));
  S.push({ id: 'S16', start: s16, trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envAudience(ctx, T, cam, { dim: .3 }),
    cam: cam16,
    draw(ctx, T, lt) {
      // a couple of classmates at the left, in the dark
      const kp = idle(P({ x: 330, y: 1500, s: .78 }), T, 5); C(ctx, 'kidF', kp, { expr: 'surprised', lookX: .8 }, T);
      const bp = idle(P({ x: BX, y: 1500, s: .8 }), T, 3, .6);
      const surp = T > tSaid;
      if (!surp) { bp.armL = -1.0; bp.armR = -1.0; bp.handL = -.6; bp.handR = -.6; } else surprise(bp, T - tSaid);
      if (T > tHit) wallLight(ctx, BX + BSDX, 1050, 420, 520, smooth(inv(tHit, tHit + .1, T)));
      shadowOf(ctx, 'brayden', bp, T, { k: braydenK(T), dx: BSDX * inv(tHit, tHisSh, T), eyes: T > tHisSh ? 'wide' : 'closed', alpha: .66 * smooth(inv(tHit, tHit + .2, T)) });
      C(ctx, 'brayden', bp, { expr: surp ? 'surprised' : 'smug', lookX: surp ? .6 : 0, lookY: surp ? -.3 : 0 }, T);
    },
    ui(ctx, T, lt) {
      const cam = cam16(lt), [bx] = toScr(cam, BX + 30, 0);
      spotlight(ctx, lerp(80, bx, easeInOut(inv(s16 + .15, tHit, T))), .66);
    },
    sfx: [[tHit - s16, 'impact', .45], [tHisSh - s16, 'whoosh', .5]] });

  // ===== S17 — "I still sleep with a teddy bear named Mister Snuggles." (Brayden's shadow) =====
  const s17 = st('L16'), tStill = ws('L16', 'still'), tTeddy = ws('L16', 'teddy'), tNamed = ws('L16', 'named'), tMister = ws('L16', 'mister'), tSnug = ws('L16', 'snuggles');
  const bShadow = T => { const bp = P({ x: BX, y: 1500, s: .8 }); bp.bodyY = Math.sin(T * 2.2) * 6; bp.head = Math.sin(T * 2.6) * .08; bp.armL = -1.1; bp.armR = -1.1; bp.handL = -.5; bp.handR = -.5; return bp; };
  const H17 = shHead('brayden', bShadow(0), 1.7, BSDX);
  const cam17 = lt => { const T = lt + s17, k = easeInOut(inv(tNamed - .1, tNamed + .35, T));
    return camAt(lerp(H17.x + 40, 720, k), lerp(H17.y + 80, 1060, k), lerp(1.8 + lt * .05, 1.4, k)); };
  S.push({ id: 'S17', start: s17, trans: 'zoom', capY: 1660,
    bg: (ctx, T, cam) => envAudience(ctx, T, cam, { dim: .3 }),
    cam: cam17,
    draw(ctx, T, lt) {
      wallLight(ctx, BX + BSDX, 1050, 420, 520, 1);
      // the shadow sways dreamily, hugging itself, and confesses (lip-sync L16)
      const sp = bShadow(T);
      shadowOf(ctx, 'brayden', sp, T, { k: 1.7, dx: BSDX, eyes: 'happy', lines: ['L16'], alpha: .7 });
      const h = shHead('brayden', sp, 1.7, BSDX);
      // teddy pops beside the shadow's head on "teddy"
      if (T > tTeddy) { const k = pop(T - tTeddy, .3); ctx.save(); ctx.translate(h.x + 215, h.y + 30); ctx.rotate(Math.sin(T * 4) * .12); ctx.scale(1.25 * k, 1.25 * k); holdTeddy(ctx); ctx.restore();
        burst(ctx, h.x + 215, h.y - 40, T - tTeddy, { kind: 'heart', n: 6, speed: 300, gravity: -100, life: 1.0, size: 22 }); }
      // Brayden in front: hands clamp over his mouth, horrified (arms reach to the face; hands drawn over the mouth)
      const bp = idle(P({ x: BX, y: 1500, s: .8 }), T, 3, .4); const c = clamp(spring(T - tStill, 2.5, 6), 0, 1.15);
      bp.armL = lerp(1.2, -2.1, c); bp.armR = lerp(1.2, -2.1, c); bp.x += Math.sin(T * 50) * 2;
      C(ctx, 'brayden', bp, { expr: 'terrified', red: T > tMister ? smooth(inv(tMister, tSnug + .3, T)) : 0 }, T);
      if (T > tStill) { const S2 = bp.s * CAST.brayden.tall, mx = bp.x, my = bp.y + bp.bodyY * bp.s + (-353 + bp.headY) * S2, k = smooth(inv(tStill, tStill + .15, T));
        ctx.save(); ctx.globalAlpha = k; box(ctx, mx - 62 * S2, my - 30 * S2, 70 * S2, 60 * S2, 22 * S2, CAST.brayden.skin, 8); box(ctx, mx - 6 * S2, my - 26 * S2, 70 * S2, 60 * S2, 22 * S2, CAST.brayden.skin, 8); ctx.restore(); }
    },
    ui(ctx, T, lt) {
      const cam = cam17(lt), [bx] = toScr(cam, BX + 30, 0);
      spotlight(ctx, bx, .66);
      const [x, y] = toScr(cam, H17.x - 40, H17.y - 290);
      speechBubble(ctx, clamp(x, 400, 680), Math.max(y, 380), 'MISTER SNUGGLES!', T - tMister, { size: 80, dark: true, tail: 30 });
    },
    sfx: [[tTeddy - s17, 'pop', .6], [tSnug - s17, 'record', .6]] });

  return S;
});
