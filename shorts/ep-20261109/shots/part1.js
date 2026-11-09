// shots/part1.js: S1-S8 (L0-L7)
'use strict';
shots(() => {
  const S = [];
  // translucent bubble-wrap overlay on a character pose (nubi wears it from L5 on)
  const wrap = (ctx, p, T, k = 1) => {
    const cx = p.x, cy = p.y - 250 * p.s, r = 17 * p.s;
    ctx.save(); ctx.globalAlpha = .38 * k;
    for (let j = -6; j <= 6; j++) for (let i = -3; i <= 3; i++) {
      const x = cx + i * r * 2.3 + (j & 1) * r, y = cy + j * r * 2.0;
      if (Math.abs(i * 2.3 * r + (j & 1) * r) > 78 * p.s + (j > 2 ? 0 : 20 * p.s)) continue;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = '#ffffff'; ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = '#bfe6ff'; ctx.stroke();
    }
    ctx.restore();
  };
  const fly = (x0, y0, t0, T, dir, spd) => { const e = Math.max(0, T - t0); return { x: x0 + dir * e * spd, y: y0 - 900 * e + 1700 * e * e, rot: dir * e * 9 }; };

  // ===== S1: supermarket, dad's pun launches kidG =====
  const dmg = ws('L0', 'damage'), jk = ws('L0', 'joke');
  S.push({ id: 'S1', start: 0, trans: 'none', capY: 1640,
    bg: (ctx, T, cam) => envSupermarket(ctx, T, cam, { sign: 'SNACKS' }),
    cam: lt => { const T = lt; const sh = T > dmg ? Math.sin(T * 60) * 9 * Math.exp(-(T - dmg) * 5) : 0; return camAt(540 + sh, 1070, 1.15 + lt * .03); },
    draw(ctx, T, lt) {
      const dp = idle(P({ x: 760, y: 1500, s: .82, view: 'q34', flip: -1 }), T, 2);
      if (T > jk - .3 && T < dmg) { talk(dp, T, 2, .8); dp.armR = 1.6; }
      if (T > dmg) { laugh(dp, T, .6); dp.lean += .1; }
      C(ctx, 'dad', dp, { expr: T > dmg ? 'smug' : T > jk - .3 ? 'excited' : 'happy', holding: { L: holdShoppingBag } }, T);
      if (T < dmg) {
        const kp = idle(P({ x: 300, y: 1500, s: .74, view: 'q34' }), T, 5); if (T > dmg - .15) surprise(kp, T - dmg + .15);
        C(ctx, 'kidG', kp, { expr: T > dmg - .2 ? 'surprised' : 'neutral' }, T);
      } else {
        const f = fly(300, 1500, dmg, T, -1, 1500);
        const kp = P({ x: f.x, y: f.y, s: .74, view: 'q34', rot: f.rot }); kp.armL = 2.5; kp.armR = 2.5;
        C(ctx, 'kidG', kp, { expr: 'screaming' }, T);
      }
      burst(ctx, 420, 1200, T - dmg, { kind: 'star', n: 12, speed: 700, gravity: 300, life: .6, size: 22, seed: 4 });
      dmgPop(ctx, '-999', 420, 1100, dmg, T, '#FF4D5E');
    },
    ui(ctx, T, lt) { popText(ctx, 'BAD JOKE!', 760, 560, T - jk, { size: 80, fill: '#FFD447', rot: .1, dur: 1.2 }); },
    sfx: [[jk - 0, 'pop', .4], [dmg, 'whoosh', .6], [dmg + .05, 'impact', .7]] });

  // ===== S2: front yard, uncle's worse joke, kidH over fence =====
  const hit = ws('L1', 'hit'), worse = ws('L1', 'worse');
  S.push({ id: 'S2', start: st('L1'), trans: 'whip', capY: 1640,
    bg: (ctx, T, cam) => envFrontYard(ctx, T, cam, {}),
    cam: lt => { const T = lt + st('L1'); const sh = T > hit ? Math.sin(T * 60) * 12 * Math.exp(-(T - hit) * 4) : 0; return camAt(540 + sh, 1090, 1.15 + lt * .03); },
    draw(ctx, T, lt) {
      const up = idle(P({ x: 800, y: 1500, s: .86, view: 'q34', flip: -1 }), T, 3);
      if (T > worse - .2 && T < hit) { talk(up, T, 3, .9); up.armR = 1.8; up.lean += .12; }
      if (T > hit) laugh(up, T, .8);
      C(ctx, 'uncle', up, { expr: T > hit ? 'laughing' : 'smug' }, T);
      if (T < hit) { const kp = idle(P({ x: 330, y: 1500, s: .74, view: 'q34' }), T, 6); C(ctx, 'kidH', kp, { expr: 'nervous' }, T); }
      else {
        const e = T - hit, x = 330 - e * 1100, y = 1500 - 1300 * e + 1500 * e * e;
        const kp = P({ x, y, s: .74, view: 'q34', rot: -e * 14 }); kp.armL = 2.6; kp.armR = 2.6;
        C(ctx, 'kidH', kp, { expr: 'screaming' }, T);
      }
      burst(ctx, 360, 1250, T - hit, { kind: 'star', n: 18, speed: 900, gravity: 300, life: .7, size: 26, seed: 7 });
      dmgPop(ctx, '-2500', 380, 1080, hit, T, '#FF4D5E');
    },
    ui(ctx, T) { popText(ctx, 'WORSE JOKE', 780, 560, T - worse, { size: 70, fill: '#FFD447', rot: -.08, dur: 1.4 }); },
    sfx: [[0, 'whoosh', .3], [hit - st('L1'), 'crash', .7]] });

  // ===== S3: classroom, knock-knock sting vs pun rocket =====
  const jokes = ws('L3' === 'x' ? 'L2' : 'L2', 'jokes'), sting = ws('L2', 'sting'), puns = ws('L2', 'puns'), flying = ws('L2', 'flying');
  S.push({ id: 'S3', start: st('L2'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envClassroom(ctx, T, cam, { board: 'KNOCK KNOCK' }),
    cam: lt => { const T = lt + st('L2'); const k = smooth(inv(puns - .3, puns + .2, T)); return camAt(lerp(300, 740, k), lerp(1090, 1000, smooth(inv(flying - .1, flying + .6, T))), lerp(1.35, 1.1, k)); },
    draw(ctx, T, lt) {
      // left pair: kidA knock-knock, kidB slight shove
      const ap = idle(P({ x: 170, y: 1500, s: .78, view: 'q34' }), T, 1); if (T > jokes - .4 && T < sting) { talk(ap, T, 1, .8); ap.armR = 2.0; }
      C(ctx, 'kidA', ap, { expr: 'smug' }, T);
      const sh = T > sting ? Math.exp(-(T - sting) * 8) * -1 : 0;
      const bp = idle(P({ x: 430 + sh * 30, y: 1500, s: .78, view: 'q34', flip: -1, lean: -.15 * Math.exp(-(T - sting) * 6) * (T > sting ? 1 : 0) }), T, 2);
      C(ctx, 'kidB', bp, { expr: T > sting ? 'sad' : 'neutral' }, T);
      dmgPop(ctx, '-5', 430, 1100, sting, T, '#FFB02E');
      // right pair: kidC pun, kidD rockets up
      const cp = idle(P({ x: 840, y: 1500, s: .78, view: 'q34' }), T, 3); if (T > puns - .3 && T < flying) { talk(cp, T, 3, .8); cp.armR = 2.0; }
      C(ctx, 'kidC', cp, { expr: T > puns - .3 ? 'smug' : 'neutral' }, T);
      if (T < flying) { const dp = idle(P({ x: 1090, y: 1500, s: .78, view: 'q34', flip: -1 }), T, 4); C(ctx, 'kidD', dp, { expr: 'nervous' }, T); }
      else {
        const e = T - flying, y = 1500 - e * 2600 + e * e * 500;
        const dp = P({ x: 1090, y, s: .78, view: 'front', rot: e * 6 }); dp.armL = 2.6; dp.armR = 2.6;
        C(ctx, 'kidD', dp, { expr: 'screaming' }, T);
        burst(ctx, 1090, 1500, e, { kind: 'dust', n: 14, speed: 500, gravity: 300, life: .7, size: 26, seed: 2 });
      }
    },
    ui(ctx, T) { popText(ctx, 'STING', 300, 700, T - sting, { size: 70, fill: '#FFB02E', dur: 1.2 }); popText(ctx, 'ROCKET!', 560, 700, T - flying, { size: 84, fill: '#EE384A', rot: .08, dur: 1.3 }); },
    sfx: [[sting - st('L2'), 'pop', .5], [flying - st('L2'), 'whoosh', .65]] });

  // ===== S4: kitchen, mom immune =====
  const roll = ws('L3', 'roll'), imm = ws('L3', 'immune');
  S.push({ id: 'S4', start: st('L3'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envKitchen(ctx, T, cam, {}),
    cam: lt => camAt(540, 1080, 1.25 + lt * .04),
    draw(ctx, T, lt) {
      const dp = idle(P({ x: 270, y: 1500, s: .8, view: 'q34' }), T, 2);
      if (T < roll) { talk(dp, T, 2, .8); dp.armR = 1.8; }
      C(ctx, 'dad', dp, { expr: T > roll + .2 ? 'sad' : 'excited' }, T);
      const mp = idle(P({ x: 780, y: 1500, s: .8, view: 'q34', flip: -1 }), T, 1, .2);
      const rl = T > roll - .3 && T < roll + .8 ? Math.sin(inv(roll - .3, roll + .8, T) * TAU) * .25 : 0;
      mp.head = rl;
      C(ctx, 'mom', mp, { expr: 'neutral', mouth: 'flat', lookY: -Math.abs(rl) * 3, lookX: rl * 4 }, T);
      // joke bounces off the immune shield
      const bt = imm - .5, e = T - bt;
      if (e > 0 && e < 1.4) {
        const x = e < .5 ? lerp(330, 640, e / .5) : lerp(640, 300, easeOut((e - .5) / .9)), y = 1100 - (e > .5 ? Math.sin((e - .5) * 3) * 80 : 0);
        txt(ctx, 'PUN!', x, y, 64, '#FFD447', '#1b1b2a', 12);
      }
    },
    ui(ctx, T) { stamp(ctx, 'IMMUNE', 540, 560, T - imm, '#30CE65', 1.0); },
    sfx: [[imm - st('L3'), 'ding', .6]] });

  // ===== S5: living room, trophy =====
  const worst = ws('L4', 'worst');
  S.push({ id: 'S5', start: st('L4'), trans: 'zoom', capY: 1660,
    bg: (ctx, T, cam) => envLivingRoom(ctx, T, cam, {}),
    cam: lt => camAt(540, 1090, 1.2 + lt * .06),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .84 }), T, 2); p.armR = 0; if (T > worst) { p.armL = 1.2; p.armR = 1.2; }
      C(ctx, 'dad', p, { expr: 'smug' }, T);
      // trophy plaque on wall above him
      const e = T - worst, sc = e > 0 ? 1 + .3 * Math.exp(-e * 6) * Math.sin(e * 20) : 1;
      ctx.save(); ctx.translate(540, 760); ctx.scale(sc, sc);
      ctx.fillStyle = '#FFD447'; ctx.strokeStyle = OUTLINE; ctx.lineWidth = 9; roundRect(ctx, -300, -80, 600, 160, 24); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#7a4b12'; ctx.font = '900 56px Fredoka, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('WORST JOKES', 0, -22); ctx.fillText('IN TOWN', 0, 34);
      ctx.restore();
      burst(ctx, 540, 760, e, { kind: 'sparkle', n: 14, speed: 500, gravity: 0, life: .8, size: 22, seed: 9 });
    },
    sfx: [[worst - st('L4') - .1, 'record', .5], [worst - st('L4'), 'bling', .5]] });

  // ===== S6: bedroom, bubble wrap, record scratch =====
  const every = ws('L5', 'everywhere'), wrapT = ws('L5', 'wrap');
  S.push({ id: 'S6', start: st('L5'), trans: 'zoom', capY: 1660,
    bg: (ctx, T, cam) => envKidsBedroom(ctx, T, cam, {}),
    cam: lt => camAt(540, 1100, 1.5 + smooth(inv(0, 2, lt)) * .35),
    draw(ctx, T, lt) {
      const p = idle(P({ x: 540, y: 1500, s: .84 }), T, 1);
      if (T < every) { const sp = (T - wrapT) * 5; p.armL = 1.0 + Math.sin(sp) * .8; p.armR = 1.0 + Math.cos(sp) * .8; p.rot = Math.sin(sp * .5) * .12; }
      else { p.armL = .5; p.armR = .5; }
      C(ctx, 'nubi', p, { expr: T > every ? 'smug' : 'determined', mouth: T > every ? 'smallSmile' : null }, T);
      wrap(ctx, p, T, clamp((T - wrapT + .5) * 2));
    },
    ui(ctx, T) { if (T > every + .2) { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(0, 0, 1080, 1920); popText(ctx, "YEP. THAT'S ME.", 540, 520, T - every - .2, { size: 92, fill: '#fff', rot: -.04, dur: 3 }); } },
    sfx: [[wrapT - st('L5'), 'rip', .5], [every - st('L5'), 'record', .6], [every - st('L5') + .25, 'pop', .5]] });

  // ===== S7: hallway, Bubble Boy =====
  const boy = ws('L6', 'boy'), kids = ws('L6', 'kids');
  S.push({ id: 'S7', start: st('L6'), trans: 'cut', capY: 1640,
    bg: (ctx, T, cam) => envHallway(ctx, T, cam),
    cam: lt => camAt(480, 1070, 1.1 + lt * .04),
    draw(ctx, T, lt) {
      const np = idle(P({ x: 340, y: 1500, s: .84, view: 'q34' }), T, 1); np.armL = .2;
      C(ctx, 'nubi', np, { expr: 'sad' }, T); wrap(ctx, np, T);
      [['kidA', 620, 0], ['kidD', 790, .2], ['kidF', 960, .4]].forEach(([n, x, d]) => {
        const lp = laugh(P({ x, y: 1500, s: .76, view: 'q34', flip: -1 }), T + d, 1); lp.armL = 2.2 + Math.sin((T + d) * 12) * .2;
        C(ctx, n, lp, { expr: 'laughing' }, T);
      });
    },
    ui(ctx, T) { popText(ctx, 'BUBBLE BOY', 560, 520, T - boy, { size: 110, fill: '#FFD447', rot: -.05, dur: 2.5 }); },
    sfx: [[kids - st('L6'), 'laugh', .5], [boy - st('L6'), 'pop', .5]] });

  // ===== S8: front yard, mom's rule =====
  const jk7 = ws('L7', 'jokes'), rule = ws('L7', 'rule'), mom = ws('L7', 'mom');
  S.push({ id: 'S8', start: st('L7'), trans: 'cut', capY: 1660,
    bg: (ctx, T, cam) => envFrontYard(ctx, T, cam, {}),
    cam: lt => camAt(540, 1080, 1.25 + lt * .04),
    draw(ctx, T, lt) {
      const mp = talk(idle(P({ x: 780, y: 1500, s: .86, view: 'q34', flip: -1 }), T, 1), T, 1, .6);
      mp.armR = T > rule - .1 ? 2.6 : .3;
      C(ctx, 'mom', mp, { expr: 'determined', mouth: lipShape(T, ['L7']) }, T);
      const dp = idle(P({ x: 200, y: 1500, s: .8, view: 'q34' }), T, 2); const sal = T > jk7 + .1;
      if (sal) { dp.armR = 2.5; dp.handR = -.6; }
      C(ctx, 'dad', dp, { expr: sal ? 'determined' : 'nervous' }, T);
      const np = idle(P({ x: 430, y: 1500, s: .8, view: 'q34' }), T, 3);
      if (sal) { np.armR = 2.5; np.handR = -.6; }
      C(ctx, 'nubi', np, { expr: sal ? 'determined' : 'neutral' }, T); wrap(ctx, np, T);
    },
    ui(ctx, T) {
      const e = T - rule; if (e < 0) return;
      const s = 1 + .25 * Math.exp(-e * 7) * Math.cos(e * 18);
      ctx.save(); ctx.translate(540, 520); ctx.scale(s, s); ctx.rotate(-.04);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = OUTLINE; ctx.lineWidth = 10; roundRect(ctx, -400, -110, 800, 220, 28); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#EE384A'; ctx.font = '900 84px Fredoka, Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('RULE 1:', 0, -42); ctx.fillText('NO JOKES', 0, 42);
      ctx.restore();
    },
    sfx: [[rule - st('L7'), 'pop', .5], [jk7 - st('L7') + .1, 'ding', .55]] });

  return S;
});
