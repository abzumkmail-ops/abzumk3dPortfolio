// shots/part6.js — L101–L118 (dance, Lily, snack stash payoff, grandpa, end CTA)
'use strict';
shots(() => {
  const S = [];
  const flake = (ctx, x, y, r, col = '#7FD4FF', lw = 5) => {
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
      for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sg * r * .55, 0); ctx.lineTo(sg * r * .8, -r * .28); ctx.moveTo(sg * r * .55, 0); ctx.lineTo(sg * r * .8, r * .28); ctx.stroke(); } }
    ctx.restore();
  };
  const openBook = (k) => ctx => { box(ctx, -80, -20, 160, 120, 10, '#2E6BD8', 7);
    const w = 150 * k; box(ctx, -75 + (150 - w) / 2, -10, w, 100, 6, '#FFF8E0', 5); if (k > .5) flake(ctx, 0, 40, 28 * k, '#7FD4FF', 4); };
  const dancer = (ctx, T, name, i, x, y, s, flip, face = {}) => {
    const p = Object.assign(danceP(i, T), { x, y, s, flip });
    C(ctx, name, p, Object.assign({ expr: 'happy' }, face), T);
  };
  const kitchenBG = (ctx, T, cam) => envKitchen(ctx, T, cam, {});
  const crumbs = (ctx, x, y, n, seed) => { for (let i = 0; i < n; i++) { const r = rng(seed + i); ellipse(ctx, x + (r() - .5) * 220, y + r() * 14, 8 + r() * 6, 5, '#D9A15A', 3); } };

  // ===== S101 — everyone dances in pairs =====
  const crazyT = ws('L101', 'crazy'), partnerT = ws('L101', 'partner');
  S.push({ id: 'S101', start: st('L101'), trans: 'cut',
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'WINTER DANCE' }),
    cam: lt => camAt(540, 1130, .85 + lt * .015),
    draw(ctx, T, lt) {
      const prs = [['brayden', 'kidA'], ['kidB', 'kidC'], ['kidD', 'kidE'], ['coach', 'kidF']];
      prs.forEach(([a, b], k) => { const x = -60 + k * 440, y = 1500 - (k % 2) * 40, s = k % 2 ? .66 : .72;
        const st2 = (n) => n === 'brayden' ? { style: STYLE.pajamas('brayden') } : {};
        dancer(ctx, T, a, k * 2, x, y, s, 1, Object.assign({ expr: T > partnerT ? 'excited' : 'happy' }, st2(a)));
        dancer(ctx, T, b, k * 2 + 1, x + 175, y, s, -1, { expr: 'laughing' }); });
      burst(ctx, 540, 700, T - crazyT, { kind: 'confetti', n: 50, speed: 900, angle: -Math.PI / 2, spread: 2.4, gravity: 900, life: 2, size: 16, seed: 4 });
    },
    sfx: [[partnerT - st('L101'), 'cheer', .5], [crazyT - st('L101'), 'confetti', .55]] });

  // ===== S102 — back of the gym, nubi walks to Lily =====
  const backT = ws('L102', 'back');
  S.push({ id: 'S102', start: st('L102'), trans: 'cut',
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .6, noLights: true, banner: 'WINTER DANCE' }),
    cam: lt => camAt(540 + lt * 14, 1150, 1.0),
    draw(ctx, T, lt) {
      const t0 = st('L102'), nx = lerp(60, 430, easeOut(inv(t0, t0 + 2.2, T))), moving = T < t0 + 2.2;
      const lp = idle(P({ x: 820, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 2);
      C(ctx, 'lily', lp, { expr: 'shy', blush: .6, holding: { R: holdSketchbook } }, T);
      const np = moving ? walk(P({ x: nx, y: 1500, s: .8, view: 'q34' }), T, 1) : idle(P({ x: nx, y: 1500, s: .8, view: 'q34' }), T, 1);
      C(ctx, 'nubi', np, { expr: 'nervous', holding: { R: holdCocoa } }, T);
      for (let i = 0; i < 3; i++) dancer(ctx, T, ['kidD', 'kidE', 'kidB'][i], i + 2, -100 + i * 150, 1400, .5, i % 2 ? -1 : 1, { expr: 'happy' });
    },
    sfx: [[.2, 'step', .25]] });

  // ===== S103 — "Was it you? The hot chocolate?" =====
  const hotT = ws('L103', 'hot');
  S.push({ id: 'S103', start: st('L103'), trans: 'cut',
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .6, noLights: true, banner: 'WINTER DANCE' }),
    cam: lt => camAt(580, 1230, 1.5 + lt * .03),
    draw(ctx, T, lt) {
      const lp = idle(P({ x: 760, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 2);
      C(ctx, 'lily', lp, { expr: T > hotT ? 'surprised' : 'shy', blush: .5 }, T);
      const np = talk(idle(P({ x: 400, y: 1500, s: .8, view: 'q34' }), T, 1), T, 1, .5); np.armR = 1.0;
      C(ctx, 'nubi', np, { expr: 'nervous', mouth: lipShape(T, ['L103']), holding: { R: holdCocoa } }, T);
    },
    sfx: [[hotT - st('L103'), 'pop', .4]] });

  // ===== S104 — she slowly opens the sketchbook =====
  const openT = ws('L104', 'opened'), sketchT = ws('L104', 'sketchbook');
  S.push({ id: 'S104', start: st('L104'), trans: 'cut',
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .6, noLights: true, banner: 'WINTER DANCE' }),
    cam: lt => camAt(620, 1210, 1.6 + lt * .04),
    draw(ctx, T, lt) {
      const k = smooth(inv(openT - .3, sketchT + .6, T));
      const lp = idle(P({ x: 760, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 2); lp.armR = 1.0 + k * .5;
      C(ctx, 'lily', lp, { expr: 'shy', blush: .6, lookY: .3, holding: { R: openBook(k) } }, T);
      const np = idle(P({ x: 400, y: 1500, s: .8, view: 'q34' }), T, 1);
      C(ctx, 'nubi', np, { expr: 'nervous', lookX: .4, holding: { R: holdCocoa } }, T);
    },
    sfx: [[sketchT - st('L104') + .1, 'rip', .2]] });

  // ===== S105 — sketchbook pages (screen space) =====
  const flakesT = ws('L105', 'snowflakes'), drawT = ws('L105', 'drawings'), jarT = ws('L105', 'jar');
  S.push({ id: 'S105', start: st('L105'), trans: 'zoom',
    bg: (ctx, T) => envSoft(ctx, T, '#2E6BD8', '#7FD4FF'),
    cam: lt => camAt(540, 1130, 1),
    draw() {},
    ui(ctx, T, lt) {
      const flip = smooth(inv(drawT - .35, drawT + .2, T)), sx = Math.abs(Math.cos(flip * Math.PI * .5 + (flip > .5 ? Math.PI : 0)));
      ctx.save(); ctx.translate(W / 2, H / 2 - 40); ctx.rotate(-.03 + Math.sin(T) * .005);
      box(ctx, -560, -380, 1120, 760, 24, '#2E6BD8', 10);
      ctx.save(); ctx.scale(Math.max(.02, Math.abs(1 - flip * 2 + (flip > .5 ? 0 : 0)) * 0 + (flip < .5 ? 1 - flip * 2 : flip * 2 - 1)), 1);
      box(ctx, -520, -340, 1040, 680, 14, '#FFF8E0', 0);
      if (flip < .5) {
        const n = clamp(Math.floor((T - (flakesT - .3)) * 8), 0, 8);
        for (let i = 0; i < n; i++) { const r = rng(i + 31); flake(ctx, -400 + (i % 4) * 270 + (r() - .5) * 40, -170 + Math.floor(i / 4) * 300, 70 + r() * 30, ['#7FD4FF', '#2E6BD8', '#9B7BFF'][i % 3], 6); }
      } else {
        const sh = T > jarT ? Math.sin(T * 40) * 3 : 0;
        // doodle: stick nubi straining at a jar, "L" scribble
        ctx.strokeStyle = '#27324F'; ctx.lineWidth = 8; ctx.lineCap = 'round';
        circle(ctx, -150, -140, 70, '#FFE0BD', 8);
        for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(-150 + i * 20, -200); ctx.lineTo(-150 + i * 24, -270 - (i % 2) * 20); ctx.stroke(); }
        box(ctx, -215, -60, 130, 170, 20, '#1FB5B0', 8);
        ctx.beginPath(); ctx.moveTo(-90, -20); ctx.lineTo(60 + sh, -60); ctx.moveTo(-215, -20); ctx.lineTo(-250, -90); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-190, 110); ctx.lineTo(-210, 270); ctx.moveTo(-110, 110); ctx.lineTo(-90, 270); ctx.stroke();
        box(ctx, 40 + sh, -150, 150, 190, 22, 'rgba(200,230,255,.9)', 8); box(ctx, 34 + sh, -185, 162, 44, 12, '#EE384A', 8);
        txt(ctx, 'JAR 1 - ME 0', 280, 240, 64, '#EE384A', OUTLINE, 0);
        for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-290 + i * 22, -190); ctx.lineTo(-300 + i * 22, -240); ctx.stroke(); }
        flake(ctx, 380, -240, 50, '#7FD4FF', 6);
      }
      ctx.restore(); ctx.restore();
    },
    sfx: [[flakesT - st('L105'), 'sparkle', .4], [drawT - st('L105'), 'rip', .25], [jarT - st('L105'), 'laugh', .3]] });

  // ===== S106 — Lily close-up: "You looked lonely" =====
  const lonelyT = ws('L106', 'lonely');
  S.push({ id: 'S106', start: st('L106'), trans: 'cut',
    bg: (ctx, T, cam) => envSoft(ctx, T, '#FFB7D5', '#FFE3F0'),
    cam: lt => camAt(540, 1170, 2.5 + lt * .04),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .8, view: 'q34' }), T, 2), T, 2, .35);
      C(ctx, 'lily', p, { expr: T > lonelyT ? 'sad' : 'shy', blush: .8, lookY: .25, mouth: lipShape(T, ['L106']) }, T);
    } });

  // ===== S107 — Lily smiles, hearts @chocolate =====
  const wantT = ws('L107', 'wanted'), chocT = ws('L107', 'chocolate');
  S.push({ id: 'S107', start: st('L107'), trans: 'cut',
    bg: (ctx, T, cam) => envSoft(ctx, T, '#FFB7D5', '#FFE3F0'),
    cam: lt => camAt(540, 1170, 2.4 + lt * .04),
    draw(ctx, T, lt) {
      const p = talk(idle(P({ x: 540, y: 1500, s: .8, view: 'q34' }), T, 2), T, 2, .4);
      C(ctx, 'lily', p, { expr: T > chocT - .3 ? 'happy' : 'shy', blush: .9, mouth: lipShape(T, ['L107']) }, T);
      burst(ctx, 330, 1000, T - chocT, { kind: 'heart', n: 10, speed: 400, angle: -Math.PI / 2, spread: 1.2, gravity: -60, life: 1.6, size: 30, seed: 7 });
      burst(ctx, 780, 1000, T - chocT, { kind: 'heart', n: 10, speed: 400, angle: -Math.PI / 2, spread: 1.2, gravity: -60, life: 1.6, size: 30, seed: 8 });
    },
    sfx: [[chocT - st('L107'), 'sparkle', .5]] });

  // ===== S108 — two-shot, nubi nervous, deep breath =====
  const qT = ws('L108', 'question');
  S.push({ id: 'S108', start: st('L108'), trans: 'cut',
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .6, noLights: true, banner: 'WINTER DANCE' }),
    cam: lt => camAt(580, 1230, 1.4 + lt * .03),
    draw(ctx, T, lt) {
      const br = Math.sin(T * 3.2) * .5 + .5;
      const lp = idle(P({ x: 760, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 2);
      C(ctx, 'lily', lp, { expr: 'shy', blush: .7 }, T);
      const np = idle(P({ x: 400, y: 1500, s: .8, view: 'q34' }), T, 1); np.bodyY -= br * 6; np.armL = .2 + br * .3;
      C(ctx, 'nubi', np, { expr: 'nervous', sweat: 1, lookX: .3 }, T);
    },
    ui(ctx, T, lt) { popText(ctx, 'GULP', 760, 300, T - qT, { size: 80, fill: '#fff', rot: -.08, dur: 1.2 }); },
    sfx: [[qT - st('L108'), 'pop', .4]] });

  // ===== S109 — "Do you want to dance?" offers hand =====
  const doT = ws('L109', 'dance');
  S.push({ id: 'S109', start: st('L109'), trans: 'cut',
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { dim: .5, noLights: true, banner: 'WINTER DANCE' }),
    cam: lt => camAt(580, 1230, 1.6 + lt * .04),
    draw(ctx, T, lt) {
      const lp = idle(P({ x: 760, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 2);
      C(ctx, 'lily', lp, { expr: 'surprised', blush: .9 }, T);
      const k = smooth(inv(doT - .6, doT, T));
      const np = talk(idle(P({ x: 400, y: 1500, s: .8, view: 'q34' }), T, 1), T, 1, .4); np.armR = lerp(.3, 1.65, k); np.handR = .3; np.lean += k * .08;
      C(ctx, 'nubi', np, { expr: 'shy', blush: .6, mouth: lipShape(T, ['L109']) }, T);
    },
    sfx: [[doT - st('L109') - .5, 'whoosh', .2]] });

  // ===== S110 — she takes his hand =====
  const neverT = ws('L110', 'never'), askT = ws('L110', 'ask');
  S.push({ id: 'S110', start: st('L110'), trans: 'cut',
    bg: (ctx, T) => envSoft(ctx, T, '#FFB7D5', '#FFE3F0'),
    cam: lt => camAt(580, 1230, 1.6 + lt * .04),
    draw(ctx, T, lt) {
      const k = smooth(inv(neverT, askT + .3, T));
      const lp = talk(idle(P({ x: 740, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 2), T, 2, .35); lp.armR = lerp(.4, 1.65, k);
      C(ctx, 'lily', lp, { expr: T > neverT ? 'love' : 'happy', blush: 1, mouth: lipShape(T, ['L110']) }, T);
      const np = idle(P({ x: 420, y: 1500, s: .8, view: 'q34' }), T, 1); np.armR = 1.65;
      C(ctx, 'nubi', np, { expr: T > neverT ? 'love' : 'shy', blush: .8 }, T);
      thread(ctx, 440, 1300, 720, 1300, k, T);
      burst(ctx, 580, 1230, T - (askT + .3), { kind: 'heart', n: 14, speed: 500, angle: -Math.PI / 2, spread: 1.6, gravity: -50, life: 1.6, size: 30, seed: 11 });
    },
    sfx: [[askT + .3 - st('L110'), 'swell', .5]] });

  // ===== S111 — slow dance, pull back to whole party =====
  const gladT = ws('L111', 'glad'), firstT = ws('L111', 'first');
  S.push({ id: 'S111', start: st('L111'), trans: 'cut',
    bg: (ctx, T, cam) => envGym(ctx, T, cam, { banner: 'WINTER DANCE' }),
    cam: lt => { const T = lt + st('L111'); return track([[0, camAt(540, 1230, 1.7)], [(we('L111', 'awake') - st('L111')) * .95, camAt(540, 1130, .85)]], lt); },
    draw(ctx, T, lt) {
      const prs = [['brayden', 'kidA'], ['kidB', 'kidC'], ['kidD', 'kidE'], ['coach', 'kidF']];
      prs.forEach(([a, b], k) => { const x = k < 2 ? -120 + k * 190 : 900 + (k - 2) * 190, y = 1420, s = .62;
        dancer(ctx, T, a, k * 2, x, y, s, 1, a === 'brayden' ? { style: STYLE.pajamas('brayden') } : {});
        dancer(ctx, T, b, k * 2 + 1, x + 90, y, s, -1); });
      const sway = Math.sin(T * 1.5) * 12;
      const lp = idle(P({ x: 600 + sway, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 2); lp.armR = 1.65; lp.rot = Math.sin(T * 1.5) * .03;
      const np = idle(P({ x: 450 + sway, y: 1500, s: .8, view: 'q34' }), T, 1); np.armR = 1.65; np.rot = Math.sin(T * 1.5) * .03;
      C(ctx, 'lily', lp, { expr: 'love', blush: 1 }, T); C(ctx, 'nubi', np, { expr: 'happy', blush: .7 }, T);
      burst(ctx, 525 + sway, 1000, T - firstT, { kind: 'heart', n: 24, speed: 450, angle: -Math.PI / 2, spread: 2.0, gravity: -40, life: 2.4, size: 30, seed: 13 });
    },
    sfx: [[firstT - st('L111'), 'sparkle', .5]] });

  // ===== S112 — morning kitchen, dad yawns to the stash =====
  const walkedT = ws('L112', 'walked'), woke = ws('L112', 'woke');
  S.push({ id: 'S112', start: st('L112'), trans: 'cut',
    bg: kitchenBG,
    cam: lt => camAt(560, 1150, 1.0 + lt * .02),
    draw(ctx, T, lt) {
      snackStash(ctx, 820, 1500, {});
      const t0 = st('L112'), mv = easeOut(inv(woke, we('L112', 'stash') - .2, T)), x = lerp(180, 560, mv);
      let p = P({ x, y: 1500, s: .8, view: 'q34' }); if (mv > 0 && mv < 1) walk(p, T, .8, .6); else idle(p, T, 4);
      const yawn = T < woke + 1.2;
      if (yawn) { p.armL = 1.9; p.armR = 1.9; }
      C(ctx, 'dad', p, { expr: yawn ? 'neutral' : 'determined', mouth: yawn ? 'wideOpen' : null, eyes: yawn ? { open: 0 } : undefined, style: STYLE.pajamas('dad') }, T);
    },
    sfx: [[walkedT - st('L112'), 'step', .35]] });

  // ===== S113 — stash fully empty =====
  const emptyT = ws('L113', 'empty'), stillT = ws('L113', 'still');
  S.push({ id: 'S113', start: st('L113'), trans: 'cut',
    bg: kitchenBG,
    cam: lt => camAt(lerp(680, 760, smooth(lt / 3)), 1230, 1.35 + lt * .03),
    draw(ctx, T, lt) {
      const op = smooth(inv(st('L113'), st('L113') + .5, T));
      snackStash(ctx, 820, 1500, { open: op, empty: 1 });
      crumbs(ctx, 780, 1495, 8, 3);
      const p = idle(P({ x: 460, y: 1500, s: .8, view: 'q34' }), T, 4);
      C(ctx, 'dad', p, { expr: T > emptyT ? 'sad' : 'surprised', style: STYLE.pajamas('dad') }, T);
    },
    sfx: [[emptyT - st('L113'), 'sad_trombone', .5]] });

  // ===== S114 — dad slowly turns: I'll know =====
  S.push({ id: 'S114', start: st('L114'), trans: 'zoom',
    bg: kitchenBG,
    cam: lt => camAt(540, 1130, 2.2 + lt * .06),
    draw(ctx, T, lt) {
      const view = lt < .45 ? 'back' : lt < .9 ? 'q34' : 'front';
      const p = idle(P({ x: 540, y: 1500, s: .8, view }), T, 4);
      C(ctx, 'dad', p, { expr: 'angry', vein: view === 'front' ? 1 : 0, mouth: lipShape(T, ['L114']), style: STYLE.pajamas('dad') }, T);
    },
    ui: (ctx, T, lt) => vignette(ctx, .35, '238,56,74'),
    sfx: [[.9, 'impact', .55]] });

  // ===== S115 — dad stares at nubi; nubi points at grandpa =====
  const lookedT = ws('L115', 'looked'), grandT = ws('L115', 'grandpa');
  S.push({ id: 'S115', start: st('L115'), trans: 'whip',
    bg: kitchenBG,
    cam: lt => camAt(540, 1200, 1.3 + lt * .02),
    draw(ctx, T, lt) {
      const dp = idle(P({ x: 760, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 4);
      C(ctx, 'dad', dp, { expr: 'angry', style: STYLE.pajamas('dad') }, T);
      const k = smooth(inv(grandT - .35, grandT, T));
      const np = idle(P({ x: 340, y: 1500, s: .8, view: 'q34' }), T, 1); np.armR = lerp(.2, 1.7, k);
      C(ctx, 'nubi', np, { expr: 'nervous', sweat: 1, lookX: k, holding: undefined }, T);
    },
    sfx: [[0, 'whoosh', .4], [grandT - st('L115'), 'pop', .4]] });

  // ===== S116 — grandpa fake snoring =====
  const snoreT = ws('L116', 'snoring');
  S.push({ id: 'S116', start: st('L116'), trans: 'whip',
    bg: (ctx, T, cam) => envLivingRoom(ctx, T, cam, {}),
    cam: lt => camAt(430, 1230, 1.5 + lt * .03),
    draw(ctx, T, lt) {
      box(ctx, 190, 1180, 480, 330, 40, '#8A3B3B', 8);
      const p = idle(P({ x: 430, y: 1455, s: .8 }), T, 5); p.bodyY += Math.sin(T * 5) * 3;
      C(ctx, 'grandpa', p, { expr: 'neutral', eyes: { open: 0 }, mouth: Math.sin(T * 5) > 0 ? 'wideOpen' : 'smallOpen', noBlink: true, style: STYLE.pajamas('grandpa') }, T);
      box(ctx, 190, 1360, 60, 140, 20, '#A34848', 8); box(ctx, 610, 1360, 60, 140, 20, '#A34848', 8);
      // speaker sticking out of pocket
      ctx.save(); ctx.translate(500, 1330); ctx.rotate(.2); box(ctx, -26, -50, 52, 80, 12, '#222331', 6); circle(ctx, 0, -10, 14, '#7FD4FF', 4); ctx.restore();
      crumbs(ctx, 430, 1300, 7, 9);
      zzz(ctx, 360, 1000, T, 1.6, 5);
    },
    sfx: [[snoreT - st('L116'), 'buzz', .3]] });

  // ===== S117 — one eye opens, wink, NEVER CAUGHT =====
  const caughtT = ws('L117', 'caught'), neverT2 = ws('L117', 'never');
  S.push({ id: 'S117', start: st('L117'), trans: 'zoom',
    bg: (ctx, T, cam) => envLivingRoom(ctx, T, cam, {}),
    cam: lt => camAt(430, 1180, 2.4 + lt * .04),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 430, y: 1455, s: .8 }), T, 5);
      const open = T < neverT2 ? 0 : (Math.sin((T - neverT2) * 10) > .6 && T < caughtT ? 0 : .9);
      C(ctx, 'grandpa', p, { expr: T > neverT2 ? 'smug' : 'neutral', eyes: { open }, noBlink: true, style: STYLE.pajamas('grandpa') }, T);
      if (T > caughtT) burst(ctx, 560, 1000, T - caughtT, { kind: 'sparkle', n: 12, speed: 350, gravity: 0, life: .9, size: 24, seed: 2 });
    },
    ui(ctx, T) { stamp(ctx, 'NEVER CAUGHT', 960, 250, T - caughtT, '#EE384A', 1.0); },
    sfx: [[caughtT - st('L117'), 'ding', .5]] });

  // ===== S118 — end CTA, wave, snowflake loop =====
  const subT = ws('L118', 'subscribe'), comT = ws('L118', 'comment');
  S.push({ id: 'S118', start: st('L118'), trans: 'cut',
    bg: (ctx, T, cam) => envBackyard(ctx, T, cam),
    cam: lt => camAt(540, 1160, 1.0 + lt * .01),
    draw(ctx, T, lt) {
      const wv = Math.sin(T * 7) * .35;
      const np = idle(P({ x: 120, y: 1500, s: .8, view: 'q34' }), T, 1); np.armR = 2.3 + wv;
      C(ctx, 'nubi', np, { expr: 'happy' }, T);
      const lp = idle(P({ x: 960, y: 1500, s: .8, flip: -1, view: 'q34' }), T, 2); lp.armR = 2.3 - wv;
      C(ctx, 'lily', lp, { expr: 'happy', blush: .6 }, T);
    },
    ui(ctx, T, lt) {
      drawSubscribe(ctx, lt - .05, LINE.L118.end - st('L118'), 760);
      const k = ((T - (LINE.L118.end - 4.5)) * .22);
      if (k > 0) { const f = k % 1; ctx.save(); ctx.globalAlpha *= Math.sin(clamp(f) * Math.PI) ; flake(ctx, 1560 + Math.sin(T * 2) * 40, -40 + f * 1000, 38, '#fff', 7); ctx.restore(); }
    },
    sfx: [[subT - st('L118'), 'click', .5], [comT - st('L118'), 'ding', .4]] });

  return S;
});
