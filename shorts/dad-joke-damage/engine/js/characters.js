// characters.js — reusable blocky character rig, faces, expressions, lip-sync and body actions.
'use strict';

// ---------------- Rig geometry (front view, feet at y=0) ----------------
const RIG = {
  headW: 232, headH: 206, headR: 54,
  torsoW: 192, torsoH: 176,
  armW: 64, armH: 168, handH: 52,
  legW: 90, legH: 150,
  get hipY() { return -this.legH; },
  get torsoTop() { return -this.legH - this.torsoH; },
};

// ---------------- Cast (style data only; all share the same rig) ----------------
const CAST = {
  nubi: { skin: '#F7C9A0', shirt: '#20BDBB', sleeve: '#20BDBB', pants: '#6B7080', shoes: '#F4F4F4', hair: 'nubi', hairC: '#2A2033',
          top: 'hoodie', tee: '#FF8528', brow: '#2A2033', seed: 1 },
  lily: { skin: '#F3C4A6', shirt: '#FFD447', sleeve: '#FFD447', pants: '#3E5BA9', shoes: '#FF5B9B', hair: 'lily', hairC: '#8A5A2B',
          top: 'cardigan', inner: '#FFFFFF', freckles: true, brow: '#6B4220', lashes: true, seed: 2 },
  brayden: { skin: '#F1C08E', shirt: '#FFFFFF', sleeve: '#FFFFFF', vest: '#EE384A', pants: '#C9A877', shoes: '#222331', hair: 'brayden', hairC: '#F2D45C',
             brow: '#C79A2E', seed: 3, tall: 1.06 },
  mom: { skin: '#E9B48A', shirt: '#4FA36B', sleeve: '#4FA36B', pants: '#2F3A5C', shoes: '#7A4B33', hair: 'mom', hairC: '#D9572B', brow: '#A8401E', lashes: true, seed: 4, tall: 1.12 },
  grandma: { skin: '#F2CDB0', shirt: '#9B6BC9', sleeve: '#9B6BC9', apron: '#FFFFFF', pants: '#6B5A7A', shoes: '#4A3A3A', hair: 'grandma', hairC: '#D8D8E0', brow: '#A0A0AA', glasses: true, lashes: true, seed: 5, tall: 1.02 },
  teacher: { skin: '#8D5A3B', shirt: '#2E62C9', sleeve: '#2E62C9', inner: '#F4F4F4', pants: '#23284A', shoes: '#111', hair: 'teacher', hairC: '#1E1414', brow: '#1E1414', glasses: true, lashes: true, seed: 6, tall: 1.12 },
  popstar: { skin: '#C98E66', shirt: '#B44BFF', sleeve: '#B44BFF', pants: '#1E1B33', shoes: '#FFD447', hair: 'popstar', hairC: '#FF5B9B', brow: '#5A1E3A', shades: true, sparkle: true, seed: 7, tall: 1.1 },
  lunchlady: { skin: '#E0A57E', shirt: '#30A08A', sleeve: '#30A08A', apron: '#FFFFFF', pants: '#2F3A5C', shoes: '#fff', hair: 'hairnet', hairC: '#6B3A1E', brow: '#4A2810', lashes: true, seed: 8, tall: 1.1 },
  kidA: { skin: '#C68B5E', shirt: '#FF5B9B', sleeve: '#FF5B9B', pants: '#2F3A5C', shoes: '#fff', hair: 'puff', hairC: '#2A1A12', brow: '#2A1A12', seed: 11 },
  kidB: { skin: '#F7D2B0', shirt: '#30CE65', sleeve: '#30CE65', pants: '#3A3F55', shoes: '#EE384A', hair: 'cap', hairC: '#5A3A1A', capC: '#2E62C9', brow: '#5A3A1A', seed: 12 },
  kidC: { skin: '#E8B48C', shirt: '#7B4BFF', sleeve: '#7B4BFF', pants: '#4A4F66', shoes: '#fff', hair: 'pony', hairC: '#1E1414', brow: '#1E1414', lashes: true, seed: 13 },
  kidD: { skin: '#9A6440', shirt: '#FFC83D', sleeve: '#FFC83D', pants: '#26324F', shoes: '#30CE65', hair: 'buzz', hairC: '#1A1210', brow: '#1A1210', seed: 14 },
  kidE: { skin: '#F2C29A', shirt: '#FF8528', sleeve: '#FF8528', pants: '#5B6B8C', shoes: '#fff', hair: 'curls', hairC: '#C1272D', brow: '#8A1E22', seed: 15 },
  kidF: { skin: '#D9A27A', shirt: '#80CDF5', sleeve: '#80CDF5', pants: '#3B3B4F', shoes: '#FF5B9B', hair: 'bob', hairC: '#2B2B2B', brow: '#2B2B2B', lashes: true, seed: 16 },
};

// ---------------- Expressions ----------------
// brow: raise(px), angle(rad, + = angry/inward-down), asym(px raise diff L-R)
// eyes: open(0..1.5), pupil(scale), shape
const EXPR = {
  neutral:   { brow: [0, 0, 0],      eyes: { open: 1, pupil: 1 },     mouth: 'closed' },
  happy:     { brow: [8, -.05, 0],   eyes: { open: .9, pupil: 1 },    mouth: 'smile' },
  excited:   { brow: [16, -.1, 0],   eyes: { open: 1.15, pupil: 1.05, shape: 'sparkle' }, mouth: 'grin' },
  surprised: { brow: [26, -.12, 0],  eyes: { open: 1.32, pupil: .72 }, mouth: 'round' },
  angry:     { brow: [-8, .42, 0],   eyes: { open: .8, pupil: .95 },  mouth: 'teeth' },
  sad:       { brow: [6, -.38, 0],   eyes: { open: .85, pupil: 1.05, lookY: .5 }, mouth: 'frown' },
  crying:    { brow: [8, -.42, 0],   eyes: { open: .7, pupil: 1.1, lookY: .3 }, mouth: 'wail', tears: true },
  terrified: { brow: [24, -.45, 0],  eyes: { open: 1.38, pupil: .55 }, mouth: 'scream', pale: true, sweat: true },
  confused:  { brow: [6, .1, 18],    eyes: { open: 1, pupil: .95 },   mouth: 'wavy' },
  smug:      { brow: [0, .12, -16],  eyes: { open: .58, pupil: 1, lookX: .3 }, mouth: 'smirk' },
  screaming: { brow: [22, -.3, 0],   eyes: { open: 1.4, pupil: .6 },  mouth: 'scream' },
  laughing:  { brow: [12, -.1, 0],   eyes: { shape: 'happy' },        mouth: 'laugh' },
  determined:{ brow: [-4, .25, 0],   eyes: { open: .92, pupil: 1 },   mouth: 'flat' },
  love:      { brow: [14, -.2, 0],   eyes: { shape: 'heart' },        mouth: 'smile', blush: true },
  shy:       { brow: [8, -.25, 0],   eyes: { open: .85, pupil: 1.05, lookX: -.4, lookY: .3 }, mouth: 'smallSmile', blush: true },
  nervous:   { brow: [10, -.35, 0],  eyes: { open: 1.05, pupil: .85 }, mouth: 'wavy', sweat: true },
  dazed:     { brow: [6, 0, 10],     eyes: { shape: 'x' },            mouth: 'wavy' },
};

// ---------------- Blink (deterministic, 2.5–4 s jittered) ----------------
function blinkAmt(seed, t) {
  const r = rng(seed * 7919 + 13); let bt = r() * 2;
  while (bt < t + 1) { const d = t - bt; if (d >= 0 && d < .14) return 1 - Math.sin(d / .14 * Math.PI) * .95; bt += 2.5 + r() * 1.5; }
  return 1;
}

// ---------------- Lip-sync from word timings ----------------
const VOWEL_SHAPE = { a: 'wideOpen', e: 'teethOpen', i: 'teethOpen', o: 'round', u: 'round', y: 'smallOpen' };
function lipShape(t, lineIds) {
  for (const id of lineIds) {
    const l = LINE[id]; if (!l || t < l.start - .02 || t > l.end + .03) continue;
    for (const w of l.words) {
      if (t < w.s || t > w.e) continue;
      const word = w.w.toLowerCase().replace(/[^a-z]/g, '');
      const groups = word.match(/[aeiouy]+|[^aeiouy]+/g) || ['a'];
      const k = Math.min(groups.length - 1, Math.floor((t - w.s) / Math.max(.01, w.e - w.s) * groups.length));
      const g = groups[k];
      if (/[aeiouy]/.test(g[0])) return VOWEL_SHAPE[g[0]] || 'smallOpen';
      if (/[mbp]/.test(g)) return 'closed';
      if (/[fv]/.test(g)) return 'teeth';
      return 'smallOpen';
    }
    return null; // between words in an active line
  }
  return null;
}

// ---------------- Pose helpers ----------------
function basePose(o = {}) {
  return Object.assign({ x: 0, y: 0, s: 1, flip: 1, rot: 0, lean: 0, bodyY: 0, squash: 1, head: 0, headY: 0,
    armL: .08, armR: .08, handL: 0, handR: 0, legL: .02, legR: .02, liftL: 0, liftR: 0, view: 'front', alpha: 1 }, o);
}
function idle(p, t, seed = 1, amt = 1) {
  const ph = seed * 1.7;
  p.bodyY += Math.sin(t * 2.4 + ph) * 4 * amt;
  p.head += Math.sin(t * 1.3 + ph) * .035 * amt;
  p.armL += Math.sin(t * 1.9 + ph) * .04 * amt; p.armR += Math.sin(t * 1.7 + ph + 1) * .04 * amt;
  return p;
}
function talk(p, t, seed = 1, amt = 1) { // speaking gestures
  const n1 = noise1(t * 2.2 + seed * 10), n2 = noise1(t * 2.6 + seed * 20 + 5);
  p.armR += (.25 + n1 * .35) * amt; p.armL += (.12 + n2 * .25) * amt;
  p.head += noise1(t * 1.8 + seed) * .07 * amt; p.headY += Math.abs(noise1(t * 4 + seed)) * -4 * amt;
  return p;
}
function walk(p, t, speed = 1, amt = 1) {
  const ph = t * speed * TAU;
  const sw = Math.sin(ph);
  if (p.view === 'front') { p.liftL = Math.max(0, sw) * 22 * amt; p.liftR = Math.max(0, -sw) * 22 * amt; p.legL += sw * .06; p.legR -= sw * .06; }
  else { p.legL = sw * .5 * amt; p.legR = -sw * .5 * amt; }
  p.armL = (p.view === 'front' ? .1 : 0) - sw * .55 * amt; p.armR = (p.view === 'front' ? .1 : 0) + sw * .55 * amt;
  p.bodyY -= Math.abs(Math.cos(ph)) * 10 * amt; p.lean += .04 * amt;
  return p;
}
function run(p, t, speed = 1.6) {
  const ph = t * speed * TAU, sw = Math.sin(ph);
  p.legL = sw * .85; p.legR = -sw * .85; p.armL = -sw * 1.1; p.armR = sw * 1.1;
  p.bodyY -= Math.abs(Math.cos(ph)) * 22; p.lean += .16; return p;
}
function celebrate(p, t, amt = 1) {
  const b = Math.abs(Math.sin(t * 7));
  p.armL = lerp(p.armL, 2.6 + Math.sin(t * 9) * .2, amt); p.armR = lerp(p.armR, 2.6 + Math.cos(t * 9) * .2, amt);
  p.bodyY -= b * 34 * amt; p.squash = 1 + (b - .5) * .06 * amt; p.head += Math.sin(t * 5) * .08 * amt; return p;
}
function surprise(p, dt) { // dt = time since trigger
  if (dt < 0) return p;
  const k = spring(dt, 2.6, 6);
  p.lean -= .16 * k * Math.exp(-dt * 1.5); p.armL = lerp(p.armL, 1.25, Math.min(1, k)); p.armR = lerp(p.armR, 1.25, Math.min(1, k));
  p.bodyY -= Math.max(0, Math.sin(Math.min(dt, .3) / .3 * Math.PI)) * 30; p.headY -= 10 * Math.exp(-dt * 3);
  return p;
}
function laugh(p, t, amt = 1) {
  p.bodyY += Math.abs(Math.sin(t * 16)) * -10 * amt; p.lean += (.12 + Math.sin(t * 16) * .03) * amt;
  p.armL = lerp(p.armL, -.35, amt); p.armR = lerp(p.armR, -.35, amt); p.head += Math.sin(t * 16) * .05 * amt; return p;
}
function anticipate(p, dt, dur = .18) { // crouch before an action
  const k = Math.sin(clamp(dt / dur) * Math.PI); p.squash = 1 - .14 * k; p.armL -= .3 * k; p.armR -= .3 * k; return p;
}

// ---------------- Drawing ----------------
function drawShadow(ctx, p) {
  ctx.save(); ctx.globalAlpha = .22 * p.alpha; ctx.translate(p.x, p.y);
  const h = Math.max(0, -p.bodyY);
  ellipse(ctx, 0, 0, 150 * p.s * (1 - Math.min(.5, h / 600)), 26 * p.s, '#000');
  ctx.restore();
}

// ---- extension registries (filled by pack_people.js) ----
const HAIR_STYLES = {}, OUTFITS = {}, FACE_EXTRAS = {}, ACCESSORIES = {};

function drawCharacter(ctx, chName, pose, face = {}, t = 0) {
  // face.style = per-shot costume (STYLE.swim('nubi') etc.), merged over the cast entry
  const c = face.style ? Object.assign({}, CAST[chName], face.style) : CAST[chName], p = pose, R = RIG;
  ctx.save();
  ctx.globalAlpha = p.alpha;
  const S = p.s * (c.tall || 1);
  ctx.translate(p.x, p.y + p.bodyY * p.s);
  ctx.scale(S * p.flip, S);
  if (p.rot) { ctx.translate(0, -260); ctx.rotate(p.rot); ctx.translate(0, 260); }
  ctx.scale(1 / Math.sqrt(p.squash), p.squash);
  const view = p.view, side = view === 'side', q = view === 'q34';
  const tw = R.torsoW * (side ? .62 : q ? .88 : 1);
  const tx = side ? 0 : 0;
  const shoulderX = tw / 2 + R.armW / 2 - 8;
  const hipY = R.hipY, tTop = R.torsoTop;

  // --- far arm (side/3q) behind torso
  const armDraw = (which, ax, ang, hand, dim) => {
    ctx.save(); ctx.translate(ax, tTop + 26); ctx.rotate(ang);
    const sleeve = dim ? shade(c.sleeve, -.18) : c.sleeve;
    const skin = dim ? shade(c.skin, -.15) : c.skin;
    const nubiBase = chName === 'nubi' && !c.outfit;
    const hoodie = nubiBase && (face.hoodie ?? true);
    const sl = hoodie ? sleeve : (nubiBase ? c.tee : sleeve);
    let sleeveLen = (nubiBase && !hoodie) ? 70 : R.armH - R.handH + 6;
    if (c.shortSleeves) sleeveLen = 70;
    if (sleeveLen < R.armH - R.handH || c.sleeveless) { box(ctx, -R.armW / 2, -26, R.armW, R.armH - R.handH + 20, 18, skin, 8); }
    if (!c.sleeveless) box(ctx, -R.armW / 2, -26, R.armW, sleeveLen + 26, 20, sl, 8);
    ctx.translate(0, R.armH - R.handH); ctx.rotate(hand);
    box(ctx, -R.armW / 2 + 2, -4, R.armW - 4, R.handH + 6, 18, skin, 8);
    if (face.holding && face.holding[which]) face.holding[which](ctx);
    ctx.restore();
  };
  const legDraw = (lx, ang, lift, dim) => {
    ctx.save(); ctx.translate(lx, hipY - lift * .3); ctx.rotate(ang);
    const len = R.legH - lift;
    const pc = dim ? shade(c.pants, -.15) : c.pants;
    if (c.shorts) { box(ctx, -R.legW / 2 + 4, -10, R.legW - 8, len + 10, 12, dim ? shade(c.skin, -.15) : c.skin, 8); box(ctx, -R.legW / 2 - 2, -10, R.legW + 4, Math.round(len * .42) + 10, 12, pc, 8); }
    else box(ctx, -R.legW / 2, -10, R.legW, len + 10, 14, pc, 8);
    if (face.ripped) { // torn pants → heart boxers
      ctx.save(); rr(ctx, -R.legW / 2 + 6, -6, R.legW - 12, 52, 10); ctx.clip();
      ctx.fillStyle = '#FF8FC0'; ctx.fillRect(-60, -20, 120, 90);
      for (let i = 0; i < 4; i++) { heartPath(ctx, -22 + (i % 2) * 40, 10 + Math.floor(i / 2) * 26, 9); ctx.fillStyle = '#EE384A'; ctx.fill(); }
      ctx.restore();
      ctx.beginPath(); ctx.moveTo(-R.legW / 2 + 4, 46); for (let i = 0; i <= 6; i++) ctx.lineTo(-R.legW / 2 + 4 + i * (R.legW - 8) / 6, 46 + (i % 2 ? 10 : -4));
      ctx.lineWidth = 6; ctx.strokeStyle = OUTLINE; ctx.stroke();
    }
    const shoeC = c.barefoot ? c.skin : c.shoes;
    box(ctx, -R.legW / 2 - 4, len - 30, R.legW + 10, 34, 12, dim ? shade(shoeC, -.15) : shoeC, 8);
    ctx.restore();
  };

  if (side || q) {
    armDraw('L', side ? 6 : -shoulderX * .8, -p.armL, -p.handL, true);   // side/3q: + = forward
    legDraw(side ? 8 : -R.legW / 2 + 6, p.legL, p.liftL, true);
    legDraw(side ? -8 : R.legW / 2 - 6, p.legR, p.liftR, false);
  } else {
    legDraw(-R.legW / 2 - 1, p.legL, p.liftL, false);
    legDraw(R.legW / 2 + 1, -p.legR, p.liftR, false);
  }
  // --- torso
  ctx.save(); ctx.translate(0, hipY); ctx.rotate(p.lean); ctx.translate(0, -hipY);
  // long hair / buns sit behind the body
  ctx.save(); ctx.translate(0, tTop + 8 + p.headY); ctx.rotate(p.head);
  drawHair(ctx, c, 'back', R.headW * (side ? .86 : q ? .94 : 1), R.headH, view); ctx.restore();
  drawTorso(ctx, chName, c, tw, face, view);
  if (!(side || q)) { armDraw('L', -shoulderX, p.armL, p.handL, false); armDraw('R', shoulderX, -p.armR, -p.handR, false); }
  else armDraw('R', side ? -4 : shoulderX * .85, -p.armR, -p.handR, false);
  // --- head
  ctx.save(); ctx.translate(0, tTop + 8 + p.headY); ctx.rotate(p.head);
  drawHead(ctx, chName, c, face, view, t);
  ctx.restore();
  ctx.restore();
  ctx.restore();
}

function drawTorso(ctx, name, c, tw, face, view) {
  const R = RIG, x = -tw / 2, y = R.torsoTop, h = R.torsoH;
  if (c.outfit && OUTFITS[c.outfit]) {
    OUTFITS[c.outfit](ctx, c, x, y, tw, h, face, view);
  } else if (name === 'nubi') {
    const hoodie = face.hoodie ?? true;
    if (hoodie) {
      box(ctx, x, y, tw, h + 6, 22, c.shirt, 8);
      if (view !== 'side') {
        rr(ctx, -tw * .32, y + h * .58, tw * .64, h * .3, 14); fillStroke(ctx, shade(c.shirt, -.12), 6);   // pocket
        starPath(ctx, -tw * .2, y + h * .34, 22, 10); fillStroke(ctx, '#fff', 5);                       // star patch
        ctx.lineWidth = 6; ctx.strokeStyle = '#fff';
        ctx.beginPath(); ctx.moveTo(-14, y + 12); ctx.lineTo(-16, y + 52); ctx.moveTo(14, y + 12); ctx.lineTo(16, y + 52); ctx.stroke();
      }
    } else {
      box(ctx, x, y, tw, h + 6, 22, c.tee, 8);
      if (view !== 'side') { ctx.font = '700 46px Lilita One'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.fillText('1', 0, y + 100); }
    }
  } else if (name === 'brayden') {
    box(ctx, x, y, tw, h + 6, 22, c.shirt, 8);
    rr(ctx, x, y, tw * .36, h + 6, 20); fillStroke(ctx, c.vest, 8);
    rr(ctx, x + tw * .64, y, tw * .36, h + 6, 20); fillStroke(ctx, c.vest, 8);
    ctx.strokeStyle = shade(c.vest, -.25); ctx.lineWidth = 4;
    for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x + 4, y + i * h / 4); ctx.lineTo(x + tw * .36 - 4, y + i * h / 4); ctx.moveTo(x + tw * .64 + 4, y + i * h / 4); ctx.lineTo(x + tw - 4, y + i * h / 4); ctx.stroke(); }
    if (face.waistHoodie) { // Nubi's hoodie tied around the waist
      const hc = CAST.nubi.shirt;
      box(ctx, x - 10, y + h - 30, tw + 20, 46, 18, hc, 8);
      box(ctx, -26, y + h - 26, 52, 40, 16, shade(hc, -.15), 7);
      box(ctx, -40, y + h + 8, 34, 80, 14, hc, 7); box(ctx, 6, y + h + 8, 34, 70, 14, hc, 7);
    }
  } else if (c.top === 'cardigan' || name === 'teacher') {
    box(ctx, x, y, tw, h + 6, 22, c.inner || '#fff', 8);
    rr(ctx, x, y, tw * .38, h + 6, 20); fillStroke(ctx, c.shirt, 8);
    rr(ctx, x + tw * .62, y, tw * .38, h + 6, 20); fillStroke(ctx, c.shirt, 8);
    if (name === 'lily') { circle(ctx, x + tw * .3, y + 60, 6, '#fff', 3); circle(ctx, x + tw * .3, y + 110, 6, '#fff', 3); }
  } else {
    box(ctx, x, y, tw, h + 6, 22, c.shirt, 8);
    if (c.apron) { rr(ctx, -tw * .34, y + 40, tw * .68, h - 30, 14); fillStroke(ctx, c.apron, 6); heartPath(ctx, 0, y + 105, 18); fillStroke(ctx, '#FF5B9B', 4); }
    if (c.sparkle) { for (let i = 0; i < 7; i++) { starPath(ctx, x + 25 + (i * 53) % (tw - 40), y + 30 + (i * 37) % (h - 40), 10, 4); fillStroke(ctx, '#FFD447', 0); } }
    if (name === 'mom') { ctx.fillStyle = shade(c.shirt, -.15); ctx.fillRect(-4, y + 6, 8, h - 6); }
  }
  if (c.acc) for (const a of [].concat(c.acc)) if (ACCESSORIES[a]) ACCESSORIES[a](ctx, c, x, y, tw, h, view);
}

function drawHair(ctx, c, layer, hw, hh, view) {
  const col = c.hairC, top = -hh + 8;
  const ox = view === 'side' ? -hw * .1 : view === 'q34' ? -hw * .05 : 0;
  ctx.save(); ctx.translate(ox, 0);
  if (HAIR_STYLES[c.hair]) { HAIR_STYLES[c.hair](ctx, c, layer, hw, hh, view, top); ctx.restore(); return; }
  switch (c.hair) {
    case 'nubi': if (layer === 'front') {
      ctx.beginPath(); ctx.moveTo(-hw / 2 - 8, top + hh * .42);
      ctx.lineTo(-hw / 2 - 12, top + 30); ctx.quadraticCurveTo(-hw / 2 - 6, top - 26, -hw * .1, top - 30);
      ctx.quadraticCurveTo(hw * .35, top - 34, hw / 2 + 10, top + 20); ctx.lineTo(hw / 2 + 10, top + hh * .38);
      ctx.lineTo(hw * .36, top + 52); ctx.lineTo(hw * .26, top + 78); ctx.lineTo(hw * .14, top + 50); ctx.lineTo(0, top + 84);
      ctx.lineTo(-hw * .1, top + 52); ctx.lineTo(-hw * .24, top + 80); ctx.lineTo(-hw * .32, top + 52); ctx.lineTo(-hw * .42, top + 70);
      ctx.closePath(); fillStroke(ctx, col, 8);
      ctx.strokeStyle = shade(col, .25); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-hw * .25, top - 8); ctx.quadraticCurveTo(0, top - 18, hw * .2, top - 6); ctx.stroke();
    } break;
    case 'lily':
      if (layer === 'back') { rr(ctx, -hw / 2 - 34, top + 6, hw + 68, hh + 60, 46); fillStroke(ctx, col, 8); }
      else {
        ctx.beginPath(); ctx.moveTo(-hw / 2 - 14, top + hh * .62); ctx.quadraticCurveTo(-hw / 2 - 18, top - 26, 0, top - 22);
        ctx.quadraticCurveTo(hw / 2 + 18, top - 26, hw / 2 + 14, top + hh * .62); ctx.lineTo(hw / 2 - 16, top + hh * .5);
        ctx.quadraticCurveTo(hw * .2, top + 40, -hw * .05, top + 66); ctx.quadraticCurveTo(-hw * .3, top + 50, -hw / 2 + 14, top + hh * .55); ctx.closePath();
        fillStroke(ctx, col, 8);
        ctx.lineWidth = 16; ctx.strokeStyle = '#FF5B9B'; ctx.beginPath(); ctx.moveTo(-hw / 2 - 8, top + 22); ctx.quadraticCurveTo(0, top - 30, hw / 2 + 8, top + 22); ctx.stroke();
        ctx.lineWidth = 4; ctx.strokeStyle = OUTLINE; ctx.stroke();
      } break;
    case 'brayden': if (layer === 'front') {
      ctx.beginPath(); ctx.moveTo(-hw / 2 - 6, top + 50);
      const pts = 7; for (let i = 0; i <= pts; i++) { const x = -hw / 2 - 6 + i * (hw + 12) / pts; ctx.lineTo(x, top - 46 - (i % 2 ? 0 : 26) + Math.abs(i - 3.5) * 6); ctx.lineTo(x + (hw + 12) / pts / 2, top + 4); }
      ctx.lineTo(hw / 2 + 6, top + 50); ctx.quadraticCurveTo(0, top + 30, -hw / 2 - 6, top + 50); ctx.closePath(); fillStroke(ctx, col, 8);
      box(ctx, -hw * .42, top + 2, hw * .36, 30, 12, '#222331', 6); box(ctx, hw * .06, top + 2, hw * .36, 30, 12, '#222331', 6);
      ctx.fillStyle = '#80CDF5'; ctx.fillRect(-hw * .38, top + 8, 18, 6); ctx.fillRect(hw * .1, top + 8, 18, 6);
    } break;
    case 'mom':
      if (layer === 'back') { for (let i = 0; i < 9; i++) { const a = Math.PI * (.95 + i * .14); circle(ctx, Math.cos(a) * hw * .62, top + hh * .4 + Math.sin(a) * hh * .62, 46, col, 8); } }
      else { for (let i = 0; i < 6; i++) circle(ctx, -hw * .44 + i * hw * .176, top + 4 + (i % 2) * 10, 34, col, 7); }
      break;
    case 'grandma':
      if (layer === 'back') circle(ctx, 0, top - 30, 46, col, 8);
      else { ctx.beginPath(); ctx.moveTo(-hw / 2 - 6, top + 60); ctx.quadraticCurveTo(-hw / 2, top - 16, 0, top - 14); ctx.quadraticCurveTo(hw / 2, top - 16, hw / 2 + 6, top + 60);
        ctx.quadraticCurveTo(hw * .2, top + 22, 0, top + 30); ctx.quadraticCurveTo(-hw * .2, top + 22, -hw / 2 - 6, top + 60); fillStroke(ctx, col, 8); }
      break;
    case 'teacher':
      if (layer === 'back') { circle(ctx, 0, top - 34, 44, col, 8); ctx.save(); ctx.translate(0, top - 40); ctx.rotate(.5); box(ctx, -60, -7, 120, 14, 4, '#FFC83D', 5); ctx.restore(); }
      else { ctx.beginPath(); ctx.moveTo(-hw / 2 - 4, top + 50); ctx.quadraticCurveTo(-hw / 2, top - 14, 0, top - 12); ctx.quadraticCurveTo(hw / 2, top - 14, hw / 2 + 4, top + 50);
        ctx.quadraticCurveTo(0, top + 6, -hw / 2 - 4, top + 50); fillStroke(ctx, col, 8); }
      break;
    case 'popstar': if (layer === 'front') {
      ctx.beginPath(); ctx.moveTo(-hw / 2 - 8, top + 70); ctx.quadraticCurveTo(-hw / 2 - 30, top - 50, hw * .2, top - 50);
      ctx.quadraticCurveTo(hw / 2 + 50, top - 40, hw / 2 + 8, top + 60); ctx.quadraticCurveTo(hw * .1, top + 10, -hw / 2 - 8, top + 70); fillStroke(ctx, col, 8);
    } break;
    case 'hairnet':
      if (layer === 'front') { ctx.beginPath(); ctx.moveTo(-hw / 2 - 10, top + 50); ctx.quadraticCurveTo(-hw / 2 - 6, top - 50, 0, top - 52); ctx.quadraticCurveTo(hw / 2 + 6, top - 50, hw / 2 + 10, top + 50);
        ctx.quadraticCurveTo(0, top + 20, -hw / 2 - 10, top + 50); fillStroke(ctx, col, 8);
        ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3;
        for (let i = -8; i < 9; i++) { ctx.beginPath(); ctx.moveTo(i * 26, top - 60); ctx.lineTo(i * 26 + 80, top + 60); ctx.moveTo(i * 26, top - 60); ctx.lineTo(i * 26 - 80, top + 60); ctx.stroke(); } ctx.restore(); }
      break;
    case 'puff': if (layer === 'back') { circle(ctx, -hw * .42, top + 6, 54, col, 8); circle(ctx, hw * .42, top + 6, 54, col, 8); }
      else { ctx.beginPath(); ctx.moveTo(-hw / 2, top + 40); ctx.quadraticCurveTo(0, top - 30, hw / 2, top + 40); ctx.quadraticCurveTo(0, top + 18, -hw / 2, top + 40); fillStroke(ctx, col, 7); } break;
    case 'cap': if (layer === 'front') {
      ctx.beginPath(); ctx.moveTo(-hw / 2 - 6, top + 46); ctx.quadraticCurveTo(0, top - 50, hw / 2 + 6, top + 46); ctx.closePath(); fillStroke(ctx, c.capC, 8);
      box(ctx, -hw * .1, top + 30, hw * .72, 24, 10, shade(c.capC, -.2), 7); circle(ctx, 0, top - 14, 8, '#fff', 4);
    } break;
    case 'pony':
      if (layer === 'back') { ctx.save(); ctx.translate(hw / 2 + 10, top + 50); ctx.rotate(.4); box(ctx, -24, 0, 48, 120, 24, col, 8); ctx.restore(); }
      else { ctx.beginPath(); ctx.moveTo(-hw / 2 - 6, top + 56); ctx.quadraticCurveTo(-hw / 2, top - 18, 0, top - 16); ctx.quadraticCurveTo(hw / 2, top - 18, hw / 2 + 6, top + 56);
        ctx.quadraticCurveTo(hw * .1, top + 16, -hw / 2 - 6, top + 56); fillStroke(ctx, col, 8); } break;
    case 'buzz': if (layer === 'front') { ctx.beginPath(); ctx.moveTo(-hw / 2, top + 34); ctx.quadraticCurveTo(0, top - 18, hw / 2, top + 34); ctx.quadraticCurveTo(0, top + 14, -hw / 2, top + 34); fillStroke(ctx, col, 6); } break;
    case 'curls': if (layer === 'front') { for (let i = 0; i < 7; i++) circle(ctx, -hw * .48 + i * hw * .16, top + 2 + (i % 2) * 8, 26, col, 6); } break;
    case 'bob':
      if (layer === 'back') { rr(ctx, -hw / 2 - 18, top - 4, hw + 36, hh * .78, 40); fillStroke(ctx, col, 8); }
      else { ctx.beginPath(); ctx.moveTo(-hw / 2 - 14, top + 80); ctx.quadraticCurveTo(-hw / 2 - 10, top - 20, 0, top - 18); ctx.quadraticCurveTo(hw / 2 + 10, top - 20, hw / 2 + 14, top + 80);
        ctx.lineTo(hw / 2 - 10, top + 50); ctx.lineTo(-hw / 2 + 10, top + 50); ctx.closePath(); fillStroke(ctx, col, 8); } break;
  }
  ctx.restore();
}

function drawHead(ctx, name, c, f, view, t) {
  const R = RIG, side = view === 'side', q = view === 'q34', back = view === 'back';
  const hw = R.headW * (side ? .86 : q ? .94 : 1), hh = R.headH;
  const top = -hh + 8;
  let skin = c.skin;
  if (f.pale) skin = '#BFE3D8';
  box(ctx, -hw / 2, top, hw, hh, R.headR, skin, 9);
  // subtle cel highlight & jaw shade
  ctx.save(); rr(ctx, -hw / 2, top, hw, hh, R.headR); ctx.clip();
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ellipse(ctx, -hw * .22, top + hh * .28, hw * .22, hh * .16, 'rgba(255,255,255,.16)');
  ctx.fillStyle = 'rgba(80,30,40,.10)'; ctx.fillRect(-hw / 2, top + hh * .86, hw, hh * .2);
  if (f.red) { ctx.fillStyle = `rgba(238,56,74,${.35 * f.red})`; ctx.fillRect(-hw / 2, top, hw, hh); }
  ctx.restore();
  if (back) { rr(ctx, -hw / 2 - 4, top - 6, hw + 8, hh * .78, R.headR); fillStroke(ctx, c.hairC, 8); drawHair(ctx, c, 'front', hw, hh, view); return; }
  // face center (shifts toward facing direction)
  const fx = side ? hw * .2 : q ? hw * .1 : 0, fy = top + hh * .56;
  const E = EXPR[f.expr || 'neutral'];
  const eyes = Object.assign({ open: 1, pupil: 1, shape: null, lookX: 0, lookY: 0 }, E.eyes, f.eyes || {});
  const blink = f.noBlink ? 1 : blinkAmt(c.seed, t);
  const sep = side ? 0 : 50 * (q ? .92 : 1);
  const ey = fy - 20;
  const eyeList = side ? [fx + 20] : [fx - sep, fx + sep];
  for (let i = 0; i < eyeList.length; i++) drawEye(ctx, eyeList[i], ey, eyes, blink, f.lookX ?? eyes.lookX, f.lookY ?? eyes.lookY, c);
  // brows
  const [raise, ang, asym] = f.brow || E.brow;
  ctx.lineCap = 'round'; ctx.strokeStyle = c.brow; ctx.lineWidth = 12;
  for (let i = 0; i < eyeList.length; i++) {
    const L = side ? 1 : (i === 0 ? -1 : 1);
    const bx = eyeList[i], by = ey - 44 - raise - (L < 0 ? asym : 0) * .5 + (L > 0 ? asym : 0) * .5;
    ctx.save(); ctx.translate(bx, by); ctx.rotate(-L * ang);
    ctx.beginPath(); ctx.moveTo(-22, 2); ctx.quadraticCurveTo(0, -6, 22, 2); ctx.stroke(); ctx.restore();
  }
  if (c.glasses) { ctx.lineWidth = 6; ctx.strokeStyle = '#3b2a20'; for (const x of eyeList) { ctx.beginPath(); ctx.arc(x, ey, 34, 0, TAU); ctx.stroke(); } if (!side) { ctx.beginPath(); ctx.moveTo(eyeList[0] + 34, ey); ctx.lineTo(eyeList[1] - 34, ey); ctx.stroke(); } }
  if (c.shades) { for (const x of eyeList) box(ctx, x - 40, ey - 70, 80, 26, 10, '#222331', 5); }
  // cheeks / freckles / blush
  if (c.freckles) { ctx.fillStyle = '#B5733F'; for (const s of [-1, 1]) for (let k = 0; k < 3; k++) circle(ctx, fx + s * (62 + k * 9), fy + 14 + (k % 2) * 7, 3, '#B5733F'); }
  if (f.blush || E.blush) { ctx.globalAlpha *= .55; ellipse(ctx, fx - 70, fy + 20, 22, 12, '#FF5B9B'); ellipse(ctx, fx + 70, fy + 20, 22, 12, '#FF5B9B'); ctx.globalAlpha /= .55; }
  const facial = c.facial ? [].concat(c.facial) : [];
  for (const n of facial) if (FACE_EXTRAS[n]) FACE_EXTRAS[n](ctx, c, fx, fy, hw, hh, view, f, 'under');
  // mouth
  const shape = f.mouth || E.mouth;
  drawMouth(ctx, fx + (side ? 26 : 0), fy + 48, shape, f.mouthScale || 1);
  for (const n of facial) if (FACE_EXTRAS[n]) FACE_EXTRAS[n](ctx, c, fx, fy, hw, hh, view, f, 'over');
  // extras
  if (f.sweat || E.sweat) { ctx.save(); ctx.translate(hw / 2 - 26, top + 54 + ((t * 40) % 20)); ctx.beginPath(); ctx.moveTo(0, -18); ctx.quadraticCurveTo(14, 4, 0, 12); ctx.quadraticCurveTo(-14, 4, 0, -18); fillStroke(ctx, '#7FD3FF', 5); ctx.restore(); }
  if (f.tears || E.tears) for (const s of side ? [1] : [-1, 1]) { const x = fx + s * (side ? 20 : sep); const k = (t * 1.6) % 1;
    ctx.save(); ctx.globalAlpha *= .9; box(ctx, x - 10, ey + 18, 20, 30 + k * 60, 10, '#6CC8FF', 4); ctx.restore(); }
  if (f.vein) { ctx.save(); ctx.translate(hw * .3, top + 40); ctx.strokeStyle = '#EE384A'; ctx.lineWidth = 7;
    for (const r of [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]) { ctx.save(); ctx.rotate(r); ctx.beginPath(); ctx.moveTo(4, 4); ctx.quadraticCurveTo(14, 4, 14, 14); ctx.stroke(); ctx.restore(); } ctx.restore(); }
  drawHair(ctx, c, 'front', hw, hh, view);
}

function drawEye(ctx, x, y, e, blink, lx, ly, c) {
  const shape = e.shape;
  if (shape === 'happy') { ctx.lineWidth = 9; ctx.strokeStyle = OUTLINE; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y + 10, 20, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); return; }
  if (shape === 'x') { ctx.lineWidth = 9; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.moveTo(x - 16, y - 16); ctx.lineTo(x + 16, y + 16); ctx.moveTo(x + 16, y - 16); ctx.lineTo(x - 16, y + 16); ctx.stroke(); return; }
  if (shape === 'heart') { heartPath(ctx, x, y + 6, 30); fillStroke(ctx, '#FF3D7F', 6); circle(ctx, x - 10, y - 6, 5, '#fff'); return; }
  const open = e.open * blink;
  const rx = 25, ry = 30 * open;
  if (open < .18) { ctx.lineWidth = 8; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.moveTo(x - 20, y + 2); ctx.quadraticCurveTo(x, y + 8, x + 20, y + 2); ctx.stroke(); return; }
  ctx.save();
  ellipse(ctx, x, y, rx, ry, '#fff', 5);
  ctx.beginPath(); ctx.ellipse(x, y, rx - 2, Math.max(1, ry - 2), 0, 0, TAU); ctx.clip();
  const px = x + lx * 9, py = y + ly * 10 + 3, pr = e.pupil;
  ellipse(ctx, px, py, 16 * pr, 20 * pr, '#2b1d16');
  circle(ctx, px - 6 * pr, py - 8 * pr, 6 * pr, '#fff'); circle(ctx, px + 5 * pr, py + 6 * pr, 2.6 * pr, '#fff');
  if (shape === 'sparkle') { starPath(ctx, px + 2, py - 2, 9, 3.5, 4); fillStroke(ctx, '#fff', 0); }
  ctx.restore();
  if (c.lashes) { ctx.lineWidth = 5; ctx.strokeStyle = OUTLINE; ctx.beginPath(); ctx.moveTo(x + (x > 0 ? 18 : -18), y - ry * .8); ctx.lineTo(x + (x > 0 ? 30 : -30), y - ry * .8 - 10); ctx.stroke(); }
}

function drawMouth(ctx, x, y, shape, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = OUTLINE;
  const dark = '#5a1424', tongue = '#FF7A8A';
  switch (shape) {
    case 'closed': ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-20, -2); ctx.quadraticCurveTo(0, 6, 20, -2); ctx.stroke(); break;
    case 'smile': ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-32, -8); ctx.quadraticCurveTo(0, 22, 32, -8); ctx.stroke(); break;
    case 'smallSmile': ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-18, -2); ctx.quadraticCurveTo(0, 12, 18, -2); ctx.stroke(); break;
    case 'frown': ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-28, 10); ctx.quadraticCurveTo(0, -12, 28, 10); ctx.stroke(); break;
    case 'flat': ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-22, 2); ctx.lineTo(22, 2); ctx.stroke(); break;
    case 'smirk': ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-24, 4); ctx.quadraticCurveTo(6, 10, 28, -10); ctx.stroke(); break;
    case 'wavy': ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-28, 2); for (let i = 1; i <= 6; i++) ctx.lineTo(-28 + i * 9.4, i % 2 ? -6 : 6); ctx.stroke(); break;
    case 'smallOpen': ellipse(ctx, 0, 2, 14, 11, dark, 7); break;
    case 'round': ellipse(ctx, 0, 4, 16, 20, dark, 7); ellipse(ctx, 0, 14, 9, 6, tongue); break;
    case 'wideOpen': ctx.beginPath(); ctx.moveTo(-28, -8); ctx.quadraticCurveTo(0, -12, 28, -8); ctx.quadraticCurveTo(26, 34, 0, 34); ctx.quadraticCurveTo(-26, 34, -28, -8); fillStroke(ctx, dark, 7);
      ellipse(ctx, 0, 24, 14, 8, tongue); break;
    case 'teethOpen': box(ctx, -26, -10, 52, 30, 12, dark, 7); ctx.fillStyle = '#fff'; ctx.fillRect(-21, -6, 42, 9); break;
    case 'teeth': box(ctx, -30, -12, 60, 26, 10, '#fff', 7); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-26, 1); ctx.lineTo(26, 1); ctx.stroke(); break;
    case 'grin': case 'laugh': {
      const k = shape === 'laugh' ? 1.3 : 1;
      ctx.beginPath(); ctx.moveTo(-36 * k, -10); ctx.lineTo(36 * k, -10); ctx.quadraticCurveTo(34 * k, 34 * k, 0, 36 * k); ctx.quadraticCurveTo(-34 * k, 34 * k, -36 * k, -10); fillStroke(ctx, dark, 8);
      ctx.save(); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(-40 * k, -10, 80 * k, 12); ellipse(ctx, 0, 30 * k, 18 * k, 12, tongue); ctx.restore(); break; }
    case 'scream': box(ctx, -28, -16, 56, 66, 26, dark, 8); ctx.save(); rr(ctx, -28, -16, 56, 66, 26); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(-28, -16, 56, 10); ellipse(ctx, 0, 44, 20, 12, tongue); ctx.restore(); break;
    case 'wail': ctx.beginPath(); ctx.moveTo(-34, 22); ctx.quadraticCurveTo(0, -26, 34, 22); ctx.quadraticCurveTo(0, 14, -34, 22); fillStroke(ctx, dark, 8); break;
  }
  ctx.restore();
}

// ---------------- Dog (quadruped rig) ----------------
function drawDog(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s);
  const bob = Math.abs(Math.sin(t * 6)) * 6, tail = Math.sin(t * 18) * .6;
  const fur = '#E2A35C', dark = '#9B6230';
  ctx.save(); ctx.globalAlpha = .2; ellipse(ctx, 0, 0, 170, 22, '#000'); ctx.restore();
  for (const [lx, ph] of [[-95, 0], [-55, 1], [55, 2], [95, 3]]) box(ctx, lx - 18, -78, 36, 78 + Math.sin(t * 6 + ph) * 2, 10, ph % 2 ? fur : dark, 7);
  ctx.save(); ctx.translate(-120, -150 - bob); ctx.rotate(-.6 + tail); box(ctx, -12, -70, 24, 74, 12, fur, 7); ctx.restore();
  box(ctx, -140, -170 - bob, 260, 110, 34, fur, 8);
  ellipse(ctx, -10, -110 - bob, 50, 30, '#F6D6A8');
  ctx.save(); ctx.translate(110, -210 - bob); ctx.rotate(Math.sin(t * 2) * .08);
  box(ctx, -70, -80, 150, 130, 34, fur, 8);
  box(ctx, -78, -90, 40, 80, 16, dark, 7); box(ctx, 52, -90, 40, 80, 16, dark, 7);  // ears
  box(ctx, 20, -10, 76, 56, 22, '#F6D6A8', 7); ellipse(ctx, 74, 0, 14, 10, OUTLINE);
  const bl = blinkAmt(99, t);
  for (const ex of [-14, 40]) { if (bl < .3) { ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(ex - 10, -30); ctx.lineTo(ex + 10, -30); ctx.stroke(); } else { ellipse(ctx, ex, -30, 11, 14 * bl, OUTLINE); circle(ctx, ex - 3, -35, 4, '#fff'); } }
  ctx.beginPath(); ctx.moveTo(40, 28); ctx.quadraticCurveTo(56, 70, 72, 30); fillStroke(ctx, '#FF7A8A', 6);
  ctx.restore();
  ctx.restore();
}

// ---------------- Fast silhouettes ----------------
// Draws `drawFn(ctx)` as a flat-colour silhouette. Much faster than ctx.filter = 'brightness(0)' (which re-rasterises
// every path through a filter): draw once to a reusable offscreen layer, tint it with 'source-in', composite back.
let _silCv = null;
function drawSilhouette(ctx, drawFn, alpha = .62, color = '#000') {
  const cv = ctx.canvas;
  if (!_silCv || _silCv.width !== cv.width || _silCv.height !== cv.height) { _silCv = document.createElement('canvas'); _silCv.width = cv.width; _silCv.height = cv.height; }
  const s = _silCv.getContext('2d');
  s.setTransform(1, 0, 0, 1, 0, 0); s.globalCompositeOperation = 'source-over'; s.globalAlpha = 1; s.clearRect(0, 0, cv.width, cv.height);
  s.setTransform(ctx.getTransform());
  drawFn(s);
  s.setTransform(1, 0, 0, 1, 0, 0); s.globalCompositeOperation = 'source-in'; s.fillStyle = color; s.fillRect(0, 0, cv.width, cv.height);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= alpha; ctx.drawImage(_silCv, 0, 0); ctx.restore();
}
