// story.js — "In This World, Embarrassment Makes You Invisible". Shared state for all shot parts.
'use strict';
// VIS(id,T): opacity (0..1) of a character at time T. Draw with ctx.save(); ctx.globalAlpha*=VIS(id,T); C(...); ctx.restore().
function VIS(id, T) {
  const f = (a, b) => smooth(inv(a, b, T));
  if (id === 'teenSister') {
    let v = 1 - .85 * f(wordT('L0', 'vanished'), wordT('L0', 'vanished') + .5);  // .15 = "basically never visible"
    if (T > LINE.L8.start - .2 && T < LINE.L16.start) v = .4;                  // half-there while warning me
    if (T >= LINE.L16.start) v = .4 * (1 - f(wordT('L16', 'vanished'), wordT('L16', 'vanished') + .4));
    return v;
  }
  if (id === 'nubi') {
    let v = T < LINE.L4.start ? 1 : .5;                                           // always half see-through from L4 on
    if (T >= wordT('L18', 'poof')) v = 0;                                         // gone from L18 to the end (blush stays)
    return v;
  }
  if (id === 'lily') return 1 - f(wordT('L21', 'invisible'), wordT('L21', 'invisible') + .5) * (T >= LINE.L21.start ? 1 : 0);
  return 1; // dad and everyone else: fully visible (dads never get embarrassed)
}
// NUBI_PART(T): which part of nubi is still drawn: 'full' | 'noLegs' (from L11 'legs') | 'head' (from L13 'head') | 'gone' (from L18 'poof').
function NUBI_PART(T) {
  if (T >= wordT('L18', 'poof')) return 'gone';
  if (T >= wordT('L13', 'head')) return 'head';
  if (T >= wordT('L11', 'legs')) return 'noLegs';
  return 'full';
}
// Phone of the sister: visible even while she's invisible, until L16 'phone'.
function PHONE_VIS(T) { return T >= LINE.L16.start ? 1 - smooth(inv(wordT('L16', 'phone'), wordT('L16', 'phone') + .4, T)) : 1; }
STORY.blush = '#FF7FA8';
STORY.music = () => [[0, 'main'], [LINE.L10.start - .1, 'tense'], [LINE.L14.start - .1, 'party'], [LINE.L19.start - .1, 'calm'], [LINE.L20.start + .3, 'love'], [LINE.L23.start - .1, 'party']];
STORY.capColors = {
  red: ['vanished', 'embarrassed', 'embarrass', 'missed', 'disappeared', 'poof', 'gone', 'mom', 'never'],
  yellow: ['invisible', 'teenagers', 'dads', 'dad', 'ice', 'cream', 'cone', 'singing', 'loudly', 'phone', 'signal', 'head', 'legs', 'cool'],
  green: ['full'],
  pink: ['lily', 'like', 'blushes', 'hands', 'too'],
};
STORY.capOverride = { 'L14:subscribe': 'red', 'L24:subscribe': 'red', 'L5:low': 'yellow', 'L23:dad': 'yellow' };
