// core.js — math, easing, deterministic randomness, drawing helpers.
// Everything is a pure function of time so any frame can be rendered by seeking directly.
'use strict';
const W = 1920, H = 1080;   // LANDSCAPE screen space (16:9). World space is unchanged (floor y 1500, sets built around x 0..1080)
const BZ = 1.3;              // base world→screen zoom: camAt(x,y,1) shows ~1477×831 world units
const TAU = Math.PI * 2;
const OUTLINE = '#1b1530';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const inv = (a, b, v) => clamp((v - a) / (b - a));
const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
const easeIn = t => Math.pow(clamp(t), 3);
const easeInOut = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const backOut = (t, s = 1.9) => { t = clamp(t) - 1; return 1 + t * t * ((s + 1) * t + s); };
// Damped spring 0→1 with overshoot. t in seconds.
const spring = (t, f = 3.2, d = 7) => t <= 0 ? 0 : 1 - Math.exp(-d * t) * Math.cos(TAU * f * t);
// Pop-in scale: 0 → overshoot → 1
const pop = (t, dur = .32) => t <= 0 ? 0 : t >= dur * 2.5 ? 1 : spring(t / dur * .45, 2.2, 5.5);

// Deterministic hash noise
function hash(n) { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }
function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function noise1(x) { const i = Math.floor(x), f = x - i; return lerp(hash(i), hash(i + 1), f * f * (3 - 2 * f)) * 2 - 1; }

// Keyframe track: [[t, value, ease?], ...] → value at t (numbers or objects of numbers)
function track(keys, t) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1], [t1, v1, e] = keys[i];
      const k = (e || easeInOut)((t - t0) / (t1 - t0));
      if (typeof v0 === 'number') return lerp(v0, v1, k);
      const o = {}; for (const key in v1) o[key] = lerp(v0[key] ?? v1[key], v1[key], k); return o;
    }
  }
  return keys[keys.length - 1][1];
}

// ---------- canvas helpers ----------
function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function fillStroke(ctx, fill, lw = 8, stroke = OUTLINE) {
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
}
function box(ctx, x, y, w, h, r, fill, lw = 8) { rr(ctx, x, y, w, h, r); fillStroke(ctx, fill, lw); }
function circle(ctx, x, y, r, fill, lw = 0, stroke = OUTLINE) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); fillStroke(ctx, fill, lw, stroke); }
function ellipse(ctx, x, y, rx, ry, fill, lw = 0, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, TAU); fillStroke(ctx, fill, lw); }
function shade(hex, amt) { // amt -1..1 darken/lighten
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round(lerp(r, f, p)); g = Math.round(lerp(g, f, p)); b = Math.round(lerp(b, f, p));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function heartPath(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * .35);
  ctx.bezierCurveTo(x - s * 1.05, y - s * .35, x - s * .55, y - s * 1.05, x, y - s * .5);
  ctx.bezierCurveTo(x + s * .55, y - s * 1.05, x + s * 1.05, y - s * .35, x, y + s * .35);
  ctx.closePath();
}
function starPath(ctx, x, y, r1, r2, n = 5, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) { const r = i % 2 ? r2 : r1, a = rot + i * Math.PI / n; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
  ctx.closePath();
}
// Offscreen cache for static layers
const CACHE = {};
function cached(key, w, h, draw) {
  if (!CACHE[key]) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d')); CACHE[key] = c;
  }
  return CACHE[key];
}
function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

// ---------- narration timing ----------
let WORDS = null;           // data/words.json
const LINE = {};            // id → line
function lineT(id, wi = 0, edge = 's') { const l = LINE[id]; if (!l) return 0; const w = l.words[Math.max(0, Math.min(l.words.length - 1, wi < 0 ? l.words.length + wi : wi))]; return w[edge]; }
function wordT(id, word, occ = 0, edge = 's') { // time of the occ-th word in line matching `word`
  const l = LINE[id]; let c = 0;
  for (const w of l.words) if (w.w.toLowerCase().replace(/[^a-z0-9']/g, '') === word.toLowerCase()) { if (c++ === occ) return w[edge]; }
  console.warn('word not found', id, word); return l.start;
}
