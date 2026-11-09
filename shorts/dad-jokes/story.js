// story.js — "In This World, Dad Jokes Deal Real Damage". Shared state for all shot parts.
'use strict';
// Recurring device: RPG-style damage numbers. Shot writers draw them with popText/stamp in red (#EE384A), gray (#9AA3AD) for nubi's "-0".
STORY.dmgRed = '#EE384A'; STORY.dmgGray = '#9AA3AD'; STORY.immune = '#4FC3F7';
STORY.music = () => [[0, 'main'], [LINE.L9.start - .1, 'tense'], [LINE.L14.start - .1, 'party'], [LINE.L17.start - .1, 'calm'], [LINE.L20.start - .1, 'love']];
STORY.capColors = {
  red: ['damage', 'dangerous', 'punch', 'critical', 'exploded', 'war', 'nervous', 'crossfire', 'weapon', 'groans', 'fight'],
  yellow: ['dad', 'dad!', 'bakeries', 'bodyguards', 'bread', 'cereal', 'beet', 'nacho', 'banana', 'peeling', 'supermarket', 'carts', 'veggie'],
  green: ['immune', 'zero', 'laughed', 'scratch', 'mom'],
  pink: ['lily', 'like', 'hand', 'me', 'five'],
};
STORY.capOverride = { 'L5:me': 'white', 'L21:me': 'pink', 'L14:subscribe': 'red', 'L24:subscribe': 'red' };
