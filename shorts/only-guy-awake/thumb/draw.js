(async () => {
  await Promise.all([document.fonts.load('100px "Lilita One"'), document.fonts.load('700 60px "Fredoka"')]);
  const ctx = document.getElementById('c').getContext('2d'), T = 1.3;
  const cam = camAt(720, 1230, 1.12);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(cam.z * BZ, cam.z * BZ); ctx.translate(-cam.x, -cam.y);
  envClassroom(ctx, T, cam, { board: 'WINTER DANCE\nSIGN UP!', doodles: false });
  // girls (back row first), leaning toward the boy, heart eyes
  const girls = [['kidC', 760, 1440, .78, .25], ['teenSister', 1180, 1430, .78, .2], ['kidE', 960, 1420, .76, .22],
                 ['kidA', 860, 1560, .86, .3], ['lily', 1080, 1570, .88, .28], ['popstar', 1290, 1580, .82, .2]];
  for (const [n, x, y, s, lean] of girls) {
    const p = P({ x, y, s, view: 'q34', flip: -1, lean, armL: 1.0, armR: 1.35, head: -.1 });
    drawCharacter(ctx, n, p, { expr: 'love', blush: 1, mouth: 'grin', lookX: -1 }, T);
  }
  // the boy at his desk, bored
  const pb = P({ x: 300, y: 1560, s: .9, armR: 2.7, handR: 1.2, armL: .5, head: .14 });
  drawCharacter(ctx, 'nubi', pb, { expr: 'neutral', mouth: 'flat', eyes: { open: .45, pupil: .5 }, lookX: .1, lookY: .9, noBlink: true }, T);
  // desk in front of him
  box(ctx, 80, 1330, 460, 46, 10, '#C98B4B', 9); box(ctx, 110, 1376, 30, 260, 6, '#8A5A2B', 7); box(ctx, 480, 1376, 30, 260, 6, '#8A5A2B', 7);
  box(ctx, 190, 1300, 200, 36, 4, '#FFF8E0', 7); box(ctx, 300, 1270, 16, 70, 4, '#FFC83D', 5);
  // floating hearts from the girls toward him
  for (let i = 0; i < 9; i++) { heartPath(ctx, 560 + hash(i * 7.3) * 560, 930 + hash(i * 3.9 + 1) * 260, 26 + hash(i * 1.7) * 26); fillStroke(ctx, ['#FF5B9B', '#FF7AC0', '#EE384A'][i % 3], 6); }
  ctx.restore();
  // screen space: big YOU + arrow
  ctx.save(); ctx.translate(560, 160); ctx.rotate(-.05); txt(ctx, 'YOU', 0, 0, 220, '#FFD447', OUTLINE, 30); ctx.restore();
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const arrow = (col, lw) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(380, 210); ctx.quadraticCurveTo(170, 230, 160, 400); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(110, 350); ctx.lineTo(160, 410); ctx.lineTo(210, 350); ctx.stroke(); };
  arrow(OUTLINE, 52); arrow('#EE384A', 30); ctx.restore();
  // "600 GIRLS" tag
  ctx.save(); ctx.translate(1620, 130); ctx.rotate(.06); box(ctx, -230, -70, 460, 140, 30, '#FF5B9B', 12); txt(ctx, '600 : 1', 0, 4, 100, '#fff', OUTLINE, 14); ctx.restore();
  vignette(ctx, .25);
  window.READY = true;
})();
