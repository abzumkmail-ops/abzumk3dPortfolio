// story.js — story-level state for "In This World, Everyone Has A Like Counter".
// Things that span many shots live here (counters, HUD, music moods, caption colors), so parallel shot agents share them.
'use strict';
function nubiLikes(T) {
  if (!LINE.L21) return 1;
  return counterAt([[0, 1], [wordT('L21', 'two'), 2], [wordT('L21', 'twenty'), 20], [wordT('L21', 'fifty'), 50]], T);
}
function hudState(T) {
  const t0 = wordT('L10', 'ten'), tEnd = lineT('L22', 0) + .5;
  if (T < t0 - .05 || T > tEnd + .4) return null;
  const nl = nubiLikes(T);
  let day = '3 DAYS', danger = false;
  if (T >= lineT('L12')) day = '2 DAYS';
  if (T >= lineT('L13')) day = '1 DAY';
  if (T >= lineT('L14')) { day = 'TODAY!'; danger = true; }
  const lastStep = nl.since;
  return { have: nl.v, goal: 10, day, danger, done: nl.v >= 10, alpha: smooth(inv(t0 - .05, t0 + .25, T)) * (1 - smooth(inv(tEnd, tEnd + .4, T))),
    pulse: Math.max(0, 1 - lastStep * 4) * (T > wordT('L21', 'two') - .01 ? 1 : 0) };
}

STORY.hud = hudState;
STORY.music = () => [[0, 'main'], [wordT('L15', 'wrong'), 'tense'], [LINE.L18.start - .1, 'calm'], [wordT('L21', 'ding'), 'party'], [LINE.L23.start - .1, 'love']];
STORY.capColors = {
  green: ['likes', 'give', 'ding', 'fifty', 'twenty', 'two', 'millions', 'hundred', 'cookies', 'six'],
  yellow: ['number', 'candy', 'backflip', 'friday', 'dance', 'hoodie', 'grandma', 'dog', 'lunch', 'lady'],
  red: ['fake', 'one', 'lonely', 'still', 'wrong', 'slipped', 'ripped', 'falling', 'ten', 'laughed', 'subscribe', 'family'],
  pink: ['lily', 'her', 'me', 'really', 'together', 'quiet', 'teacher', 'pants'],
};
STORY.capOverride = { 'L17:hundred': 'red', 'L21:two': 'green', 'L24:one': 'pink', 'L26:me': 'pink', 'L25:her': 'pink', 'L27:one': 'pink', 'L8:one': 'yellow',
  'L25:one': 'pink', 'L13:teacher': 'pink', 'L6:me': 'white', 'L22:my': 'white', 'L9:hundred': 'yellow', 'L5:hundred': 'green', 'L9:one': 'white' };
