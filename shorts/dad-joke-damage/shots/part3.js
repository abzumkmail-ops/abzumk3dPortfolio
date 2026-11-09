// shots/part3.js — s18..s26 (L17..L25): the realization, the joke, the heal, the helmet kicker.
'use strict';
shots(() => {
  const S = [];
  const shake = (T, t, a) => T > t ? Math.sin(T * 60) * a * Math.exp(-(T - t) * 5) : 0;
  const market = (ctx, T, cam, o, dim) => {
    PACK_SETS.supermarket.draw(ctx, T, cam, o || {});
    // wrecked store: fallen cereal boxes on the floor
    const spots = [[90, 1560, .3], [250, 1585, -.6], [430, 1600, 1.1], [610, 1570, -.2], [820, 1595, .8], [960, 1565, -1.0], [1040, 1600, .4]];
    spots.forEach(([x, y, r], i) => { ctx.save(); ctx.translate(x, y); ctx.rotate(r); box(ctx, -24, -16, 48, 32, 6, PCOLORS[(i * 3) % PCOLORS.length], 5); ctx.restore(); });
    if (dim) { ctx.fillStyle = 'rgba(12,14,48,' + dim + ')'; ctx.fillRect(-600, -200, 2400, 2400); }
  };
  const cart = (ctx, x, y, s = 1) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 7; ctx.lineJoin = 'round';
    ctx.fillStyle = '#B8C2CF'; ctx.beginPath(); ctx.moveTo(-120, -190); ctx.lineTo(120, -190); ctx.lineTo(95, -70); ctx.lineTo(-95, -70); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#6E7A8A'; ctx.lineWidth = 4; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 44, -186); ctx.lineTo(i * 36, -74); ctx.stroke(); }
    ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-120, -190); ctx.lineTo(-160, -230); ctx.stroke();
    ctx.fillStyle = '#EE384A'; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-190, -246, 60, 20, 8); ctx.fill(); ctx.stroke();
    for (const wx of [-70, 70]) { ctx.fillStyle = '#2B2F3A'; ctx.beginPath(); ctx.arc(wx, -34, 26, 0, 7); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  };
  const bulb = (ctx, x, y, s, a) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= a;
    ctx.strokeStyle = '#FFD447'; ctx.lineWidth = 10; ctx.lineCap = 'round';
    for (let i = 0; i < 9; i++) { const an = -Math.PI + i * Math.PI / 8; ctx.beginPath(); ctx.moveTo(Math.cos(an) * 92, Math.sin(an) * 92); ctx.lineTo(Math.cos(an) * 128, Math.sin(an) * 128); ctx.stroke(); }
    ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 7; ctx.fillStyle = '#FFE680';
    ctx.beginPath(); ctx.arc(0, 0, 62, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#9AA3AD'; ctx.beginPath(); ctx.roundRect(-26, 56, 52, 34, 8); ctx.fill(); ctx.stroke();
    ctx.restore();
  };

  // ===== s18 — L17: nubi alone, dim wrecked store, the realization =====
  const real = ws('L17', 'realized');
  S.push({ id: 's18', start: st('L17'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => market(ctx, T, cam, {}, .38),
    cam: lt => camAt(540, 1100, 1.25 + lt * .05),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .8, view: 'q34' }), T, 1);
      if (T < real) { p.armR = 2.0; p.handR = .5; p.head = .12; }
      else { surprise(p, T - real); }
      C(ctx, 'nubi', p, { expr: T > real ? 'excited' : 'confused', lookY: T > real ? 0 : -.5, lookX: T > real ? 0 : .4, mouth: T > real ? 'smallOpen' : undefined }, T);
      const u = T - real; if (u > 0) bulb(ctx, 560, 880 - 40 * easeOut(clamp(u / .4)), .7 + .5 * pop(u), 1);
    },
    ui(ctx, T) { popText(ctx, 'AHA!', 540, 430, T - real, { size: 130, fill: '#FFD447', rot: -.08, dur: 1.4 }); },
    sfx: [[real - st('L17'), 'ding', .6]] });

  // ===== s19 — L18: groans hurt (-100 red), real laughs heal (+100 green) =====
  const hurt = ws('L18', 'hurt'), heal = ws('L18', 'heal'), laughs = ws('L18', 'laughs');
  S.push({ id: 's19', start: st('L18'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => market(ctx, T, cam, {}, .08),
    cam: lt => camAt(540, 1080, 1.05 + lt * .03),
    draw(ctx, T, lt) {
      // left: a groaning kid takes the hit
      const kx = 320 - 90 * easeOut(clamp((T - hurt) / .35)) * (T > hurt ? 1 : 0);
      const kp = idle(P({ x: kx, y: 1500, s: .8, view: 'q34', rot: T > hurt ? -.35 * Math.exp(-(T - hurt) * 2) : 0 }), T, 2);
      if (T > hurt) surprise(kp, T - hurt);
      C(ctx, 'kidA', kp, { expr: T > hurt ? 'angry' : 'sad', mouth: T > hurt ? 'wail' : 'frown', sweat: T > hurt }, T);
      // right: a kid laughing, healing
      const lp = idle(P({ x: 760, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 5);
      if (T > laughs) laugh(lp, T, 1);
      C(ctx, 'kidB', lp, { expr: T > laughs ? 'laughing' : 'neutral' }, T);
      burst(ctx, 760, 1180, T - heal, { kind: 'sparkle', n: 18, speed: 520, gravity: 100, life: .9, size: 22, colors: ['#3DDC84', '#FFFFFF', '#FFD447'], seed: 7 });
      dmgPop(ctx, '-100', kx, 1080, T - hurt, '#EE384A', 120);
      dmgPop(ctx, '+100', 780, 1080, T - heal, '#3DDC84', 120);
    },
    ui(ctx, T) { ctx.save(); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 6; ctx.fillRect(534, 380, 12, 1100); ctx.restore(); },
    sfx: [[hurt - st('L18'), 'impact', .55], [heal - st('L18'), 'sparkle', .55]] });

  // ===== s20 — L19: walks to Lily who shelters behind a cart, nervous =====
  const told = ws('L19', 'told');
  S.push({ id: 's20', start: st('L19'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => market(ctx, T, cam, {}),
    cam: lt => camAt(560, 1090, 1.15 + lt * .06),
    draw(ctx, T, lt) {
      const t0 = st('L19'), u = easeOut(inv(t0, told + .3, T));
      const lp = idle(P({ x: 800, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 2); lp.head = .08;
      C(ctx, 'lily', lp, { expr: 'nervous', lookX: -.5 }, T);
      cart(ctx, 900, 1530, 1.15);
      const moving = T < told + .3;
      const np = moving ? walk(P({ x: lerp(160, 470, u), y: 1500, s: .8, view: 'q34' }), T, 1.1, 1) : idle(P({ x: 470, y: 1500, s: .8, view: 'q34' }), T, 3);
      np.lean = (np.lean || 0) + .08;
      C(ctx, 'nubi', np, { expr: 'nervous', sweat: true, lookX: .5 }, T);
      for (let i = 0; i < 3; i++) { const ph = ((T * 1.4 + i / 3) % 1); ctx.save(); ctx.globalAlpha = 1 - ph; ctx.fillStyle = '#7FD4FF'; ctx.strokeStyle = '#1b1b2a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(np.x + (i - 1) * 40 + 30, 1080 + ph * 60, 9, 14, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); }
    },
    sfx: [[.1, 'step', .4], [.4, 'step', .4], [.7, 'step', .4]] });

  // ===== s21 — L20: the cookie joke, rimshot pause =====
  const joke1 = ws('L20', 'why'), doc = we('L20', 'doctor'), crum = ws('L20', 'crummy');
  S.push({ id: 's21', start: st('L20'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => market(ctx, T, cam, {}),
    cam: lt => camAt(540, 1090, 1.3 + lt * .05),
    draw(ctx, T, lt) {
      const np = talk(idle(P({ x: 340, y: 1500, s: .8, view: 'q34' }), T, 1), T, 1, .6);
      C(ctx, 'nubi', np, { expr: T > crum ? 'smug' : 'nervous', mouth: lipShape(T, ['L20']), sweat: T < crum }, T);
      const lp = idle(P({ x: 740, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 4);
      C(ctx, 'lily', lp, { expr: 'neutral', mouth: 'flat', eyes: { open: T > crum + .5 ? .55 : 1 } }, T);
    },
    ui(ctx, T) {
      if (T < crum) { popText(ctx, 'WHY DID THE COOKIE', 540, 380, T - joke1, { size: 62, fill: '#FFFFFF', rot: -.03, dur: crum - joke1 + .1 }); popText(ctx, 'SEE A DOCTOR?', 540, 460, T - joke1 - .15, { size: 62, fill: '#FFD447', rot: -.03, dur: crum - joke1 }); }
      popText(ctx, 'IT FELT CRUMMY.', 540, 420, T - crum, { size: 78, fill: '#FF9F3D', rot: .04, dur: 2.2 });
    },
    sfx: [[crum - st('L20') + .35, 'click', .6], [crum - st('L20') + .5, 'click', .6], [crum - st('L20') + .75, 'ding', .5]] });

  // ===== s22 — L21: zero damage -> she laughed -> +999, W stamp =====
  const zero = ws('L21', 'zero'), lau = ws('L21', 'laughed');
  S.push({ id: 's22', start: st('L21'), trans: 'flash', capY: 1680,
    bg: (ctx, T, cam) => market(ctx, T, cam, {}),
    cam: lt => camAt(560 + shake(lt + st('L21'), lau, 8), 1100, 1.25 + lt * .06),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 330, y: 1500, s: .8, view: 'q34' }), T, 1);
      C(ctx, 'nubi', np, { expr: T > lau ? 'excited' : 'nervous' }, T);
      const lp = idle(P({ x: 740, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 3);
      if (T > lau) laugh(lp, T, 1.2);
      C(ctx, 'lily', lp, { expr: T > lau ? 'laughing' : 'happy' }, T);
      dmgPop(ctx, '0', 740, 1040, T - zero, '#9AA3AD', 130);
      dmgPop(ctx, '+999', 740, 1040, T - lau, '#3DDC84', 150);
      burst(ctx, 740, 1000, T - lau, { kind: 'sparkle', n: 24, speed: 700, gravity: 200, life: .9, size: 24, colors: ['#3DDC84', '#FFFFFF'], seed: 11, spread: Math.PI * 2 });
    },
    ui(ctx, T) { stamp(ctx, 'W', 540, 600, T - lau - .25, '#3DDC84', 1.2); },
    sfx: [[lau - st('L21'), 'cheer', .6], [lau - st('L21') + .1, 'bling', .5]] });

  // ===== s23 — L22: everyone healed, milk falls back into dad's hand =====
  const healed = ws('L22', 'healed'), milk = ws('L22', 'milk'), down = we('L22', 'down');
  S.push({ id: 's23', start: st('L22'), trans: 'cut', capY: 1650,
    bg: (ctx, T, cam) => market(ctx, T, cam, {}),
    cam: lt => camAt(540, 1060, 1.0 + lt * .03),
    draw(ctx, T, lt) {
      const catchT = down - .05, caught = T >= catchT;
      const who = [['dad', 210, 1500, .8, '+50', 0], ['dad2', 430, 1500, .8, '+75', .15], ['kidC', 650, 1400, .62, '+25', .3], ['lily', 850, 1500, .78, '+30', .45]];
      who.forEach(([n, x, y, s, val, d]) => {
        const hh = T > healed + d;
        const p = idle(P({ x, y, s, view: 'q34', flip: n === 'lily' || n === 'kidC' ? -1 : 1 }), T, x);
        if (!hh) { p.lean = -.12; p.head = .15; }
        if (n === 'dad') { const up = clamp(inv(milk, catchT, T)); p.armR = 1.6 * up + (caught ? .3 : 0); }
        const face = { expr: hh ? 'happy' : 'dazed' };
        if (n === 'dad' && caught) face.holding = { R: c => milkCarton(c, 0, -20, .55) };
        C(ctx, n, p, face, T);
        dmgPop(ctx, val, x, y - 480 * s, T - healed - d, '#3DDC84', 80);
      });
      // falling milk carton
      if (T > milk && !caught) { const u = inv(milk, catchT, T); milkCarton(ctx, lerp(300, 280, u), lerp(-150, 1130, u * u), .9, lerp(.6, 0, u) + Math.sin(T * 10) * .1); }
      burst(ctx, 540, 1000, T - healed, { kind: 'sparkle', n: 22, speed: 600, gravity: 120, life: 1.0, size: 22, colors: ['#3DDC84', '#FFFFFF', '#FFD447'], seed: 5 });
      if (caught) burst(ctx, 270, 1180, T - catchT, { kind: 'star', n: 10, speed: 400, gravity: 300, life: .6, size: 20, seed: 9 });
    },
    sfx: [[healed - st('L22'), 'sparkle', .55], [catchT0(), 'pop', .6]] });
  function catchT0() { return we('L22', 'down') - .05 - st('L22'); }

  // ===== s24 — L23: she says it, hearts =====
  const fav = ws('L23', 'favorite');
  S.push({ id: 's24', start: st('L23'), trans: 'zoom', capY: 1700,
    bg: (ctx, T, cam) => market(ctx, T, cam, {}, .05),
    cam: lt => camAt(540, 1110, 1.6 + lt * .08),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 350, y: 1500, s: .8, view: 'q34' }), T, 1); np.head = .08;
      C(ctx, 'nubi', np, { expr: 'love', blush: 1 }, T);
      const lp = idle(P({ x: 730, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 2); lp.head = -.06;
      C(ctx, 'lily', lp, { expr: T > fav ? 'shy' : 'happy', blush: 1, mouth: lipShape(T, ['L23']) }, T);
      burst(ctx, 540, 900, T - fav, { kind: 'heart', n: 30, speed: 700, gravity: -150, life: 1.4, size: 30, seed: 4, angle: -Math.PI / 2, spread: 2.4 });
      burst(ctx, 540, 900, T - st('L23') - .3, { kind: 'heart', n: 6, speed: 300, gravity: -120, life: 1.4, size: 22, seed: 8, angle: -Math.PI / 2, spread: 1.2 });
    },
    sfx: [[.1, 'sparkle', .4], [fav - st('L23'), 'chime', .6]] });

  // ===== s25 — L24: mom in a helmet, bruh stare =====
  const momT = ws('L24', 'showed'), helmT = ws('L24', 'helmet');
  S.push({ id: 's25', start: st('L24'), trans: 'cut', capY: 1680,
    bg: (ctx, T, cam) => market(ctx, T, cam, {}),
    cam: lt => { const T = lt + st('L24'); const k = smooth(inv(helmT - .3, helmT + .5, T)); return camAt(lerp(600, 780, k), lerp(1060, 1080, k), lerp(1.0, 1.55, k) + shake(T, helmT, .02)); },
    draw(ctx, T, lt) {
      for (const [n, x, fl] of [['dad', 230, 1], ['dad2', 440, 1]]) {
        const p = P({ x, y: 1500, s: .8, view: 'q34', flip: fl }); p.armL = .5; p.armR = .5; p.head = -.1;
        const fr = idle(p, T, x, .2);
        C(ctx, n, fr, { expr: 'terrified', sweat: true, noBlink: true, lookX: .9 }, T);
      }
      const t0 = st('L24'), mx = lerp(1350, 800, easeOut(inv(t0, helmT - .1, T)));
      const mp = T < helmT - .1 ? walk(P({ x: mx, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 1, 1) : idle(P({ x: 800, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 6, .3);
      C(ctx, 'mom', mp, { expr: 'neutral', mouth: 'flat', eyes: { open: T > helmT ? .45 : 1 }, noBlink: T > helmT, holding: { R: holdShoppingBag } }, T);
      helmet(ctx, mp.x + 6, mp.y - 540 * .8 * 1.12 + 40, 150 * .8);
    },
    sfx: [[helmT - st('L24'), 'impact', .7]] });

  // ===== s26 — L25: finger-gun kicker, echo of s01 =====
  const weap = ws('L25', 'weapon'), subT = ws('L25', 'subscribe');
  S.push({ id: 's26', start: st('L25'), trans: 'cut', capY: 1740,
    bg: (ctx, T, cam) => market(ctx, T, cam, {}),
    cam: lt => camAt(540 + shake(lt + st('L25'), weap, 10), 1150, 1.3),
    draw(ctx, T, lt) {
      for (const [n, x, fl, sd] of [['nubi', 300, 1, 1], ['lily', 780, -1, 2]]) {
        const gp = idle(P({ x, y: 1400, s: .6, view: 'q34', flip: fl }), T, sd); laugh(gp, T, .6);
        C(ctx, n, gp, { expr: 'laughing' }, T);
      }
      const p = idle(P({ x: 540, y: 1500, s: .8 }), T, 3);
      const aim = T > weap ? 1 : smooth(inv(subT, weap, T));
      p.armL = 1.4 + .2 * aim; p.armR = 1.4 + .2 * aim; p.handL = -.3; p.handR = .3;
      if (T > weap) p.bodyY -= 10 * Math.max(0, 1 - (T - weap) * 6);
      C(ctx, 'dad', p, { expr: 'smug', mouth: 'smirk' }, T);
      dmgPop(ctx, '-9999', 540, 960, T - weap, '#EE384A', 170);
    },
    ui(ctx, T, lt) {
      drawSubscribe(ctx, lt - .05, 3.5, 1460);
      const t = T - weap; if (t > 0) {
        const r = rng(21); ctx.save(); ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 5; ctx.lineJoin = 'round';
        for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + r() * .3; let x = 540, y = 760, len = (200 + r() * 350) * smooth(clamp(t / .15)); ctx.beginPath(); ctx.moveTo(x, y); for (let k = 1; k <= 5; k++) { const d = len * k / 5; ctx.lineTo(540 + Math.cos(a) * d + (r() - .5) * 40, 760 + Math.sin(a) * d + (r() - .5) * 40); } ctx.stroke(); }
        ctx.restore();
      }
    },
    sfx: [[weap - st('L25'), 'impact', .7], [weap - st('L25'), 'crash', .4]] });

  return S;
});
