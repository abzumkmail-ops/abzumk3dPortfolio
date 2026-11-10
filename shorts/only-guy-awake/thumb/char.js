(async () => {
  await Promise.all([document.fonts.load('100px "Lilita One"'), document.fonts.load('700 60px "Fredoka"')]);
  const ctx = document.getElementById('c').getContext('2d');
  ctx.save(); ctx.translate(600, 1500); ctx.scale(2.6, 2.6); ctx.translate(-540, -1500);
  drawCharacter(ctx, 'nubi', P({ x: 540, y: 1500, s: .9 }), { expr: 'happy', noBlink: true }, 0.5);
  ctx.restore(); window.READY = true;
})();
