// node scripts/make_catalog.js <out_dir>
// Builds the asset catalog from the live engine registries:
//   <out_dir>/ASSET_CATALOG.md        every character, set, hair style, outfit, face extra, accessory, costume and prop (with descriptions)
//   <out_dir>/catalog_people_N.png    labelled character sheets
//   <out_dir>/catalog_sets_<tag>.png  labelled set sheets (Nubi for scale)
//   <out_dir>/nubiverse_asset_pack.js all asset packs combined into ONE drop-in file
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const ENGINE = path.resolve(__dirname, '../engine'), OUT = path.resolve(process.argv[2] || 'catalog');
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1200, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const url = q => 'file://' + ENGINE + '/catalog.html?' + q;
  await p.goto(url('mode=people')); await p.waitForFunction('window.DONE === true');
  const info = await p.evaluate(() => {
    const BASE = ['nubi', 'lily', 'brayden', 'mom', 'grandma', 'teacher', 'popstar', 'lunchlady', 'kidA', 'kidB', 'kidC', 'kidD', 'kidE', 'kidF'];
    const fnNames = pre => Object.getOwnPropertyNames(window).filter(k => k.startsWith(pre) && typeof window[k] === 'function');
    // global function declarations aren't always own props in classic scripts; scan the loaded sources instead
    return {
      cast: Object.keys(CAST).map(k => ({ id: k, base: BASE.includes(k), hair: CAST[k].hair, outfit: CAST[k].outfit || '', tall: CAST[k].tall || 1 })),
      sets: Object.entries(PACK_SETS).map(([k, v]) => ({ id: k, desc: v.desc, opts: v.opts, tags: v.tags })),
      hair: Object.keys(HAIR_STYLES), outfits: Object.keys(OUTFITS), face: Object.keys(FACE_EXTRAS), acc: Object.keys(ACCESSORIES),
      style: typeof STYLE === 'object' ? Object.keys(STYLE) : [], tags: [...new Set(Object.values(PACK_SETS).flatMap(v => v.tags))],
    };
  });
  // props / front layers / helper functions: parse the pack sources
  const packs = ['pack_people.js', 'pack_home.js', 'pack_outdoor.js', 'pack_public.js'].filter(f => fs.existsSync(path.join(ENGINE, 'js', f)));
  const src = packs.map(f => fs.readFileSync(path.join(ENGINE, 'js', f), 'utf8')).join('\n');
  const props = [...new Set([...src.matchAll(/function (hold\w+)\s*\(/g)].map(m => m[1]))];
  const fronts = [...new Set([...src.matchAll(/function (env\w+Front)\s*\(/g)].map(m => m[1]))];
  // sheets
  const shot = async (q, file) => { await p.goto(url(q)); await p.waitForFunction('window.DONE === true'); await (await p.$('canvas')).screenshot({ path: path.join(OUT, file) }); };
  const n = info.cast.length; let pages = 0;
  for (let from = 0; from < n; from += 21) await shot(`mode=people&from=${from}&n=21`, `catalog_people_${++pages}.png`);
  for (const t of info.tags) await shot(`mode=sets&tag=${t}`, `catalog_sets_${t}.png`);
  await b.close();
  if (errs.length) console.log('PAGE ERRORS:\n' + [...new Set(errs)].join('\n'));
  // combined single-file pack
  const header = `// nubiverse_asset_pack.js — ALL asset packs in one file (${packs.join(', ')}).\n// Load after engine/js/{core,characters,env,fx_ui}.js and before shotkit.js. Generated ${new Date().toISOString().slice(0, 10)}.\n`;
  fs.writeFileSync(path.join(OUT, 'nubiverse_asset_pack.js'), header + packs.map(f => `\n// ======================= ${f} =======================\n` + fs.readFileSync(path.join(ENGINE, 'js', f), 'utf8')).join('\n'));
  // markdown catalog
  const L = [];
  L.push('# Nubiverse asset catalog', '', `Generated from the live engine registries (${packs.length} asset packs loaded). Pictures: \`catalog_people_*.png\`, \`catalog_sets_*.png\`.`, '');
  L.push('## How to use in a shot', '```js',
    "bg: (ctx, T, cam) => PACK_SETS.pool.draw(ctx, T, cam, {}),          // or call envPool(ctx, T, cam, {}) directly",
    "draw(ctx, T, lt) { C(ctx, 'dad', P({ x: 300, y: 1500, s: .8 }), { expr: 'happy', holding: { R: holdMug } }, T);",
    "  C(ctx, 'nubi', P({ x: 640, y: 1500, s: .8 }), { expr: 'excited', style: STYLE.swim('nubi') }, T);   // costume change",
    "  envPoolFront(ctx, T, cam, {}); }                                     // front layers go AFTER the characters", '```', '');
  L.push(`## Characters (${info.cast.length})`, '| id | hair | outfit | size | pack |', '|---|---|---|---|---|');
  for (const c of info.cast) L.push(`| \`${c.id}\` | ${c.hair} | ${c.outfit} | ${c.tall} | ${c.base ? 'base' : 'pack'} |`);
  L.push('', `## Sets (${info.sets.length})`, '| id | tags | description | options |', '|---|---|---|---|');
  for (const s of info.sets) L.push(`| \`${s.id}\` | ${s.tags.join(', ')} | ${s.desc.replace(/\|/g, '/')} | ${String(s.opts).replace(/\|/g, '/')} |`);
  L.push('', `**Front layers** (call after drawing characters): ${fronts.map(f => '`' + f + '`').join(', ') || 'none'}`, '');
  L.push(`## Wardrobe and props`, `- **Hair and hats (${info.hair.length}):** ${info.hair.map(x => '`' + x + '`').join(', ')} (plus the base styles)`,
    `- **Outfits (${info.outfits.length}):** ${info.outfits.map(x => '`' + x + '`').join(', ')}`,
    `- **Face extras (${info.face.length}):** ${info.face.map(x => '`' + x + '`').join(', ')}`,
    `- **Accessories (${info.acc.length}):** ${info.acc.map(x => '`' + x + '`').join(', ')}`,
    `- **Costume helpers (any character, per shot via face.style):** ${info.style.map(x => '`STYLE.' + x + '(name)`').join(', ')}`,
    `- **Props (${props.length}, for face.holding):** ${props.map(x => '`' + x + '`').join(', ')}`, '');
  fs.writeFileSync(path.join(OUT, 'ASSET_CATALOG.md'), L.join('\n') + '\n');
  console.log(`catalog: ${info.cast.length} characters, ${info.sets.length} sets, ${info.hair.length} hair, ${info.outfits.length} outfits, ${props.length} props -> ${OUT}`);
})();
