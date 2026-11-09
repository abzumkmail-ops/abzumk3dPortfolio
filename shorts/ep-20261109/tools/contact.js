// QA contact sheet: renders frames by seeking directly (proves every frame is reproducible) and tiles them with timestamps.
//   node tools/contact.js out.png                         24 frames across the whole video
//   node tools/contact.js out.png --lines L9-L17 --n 12   only the part of the video covering lines L9..L17
//   node tools/contact.js out.png --range 20-31.5 --n 10  a time range
//   node tools/contact.js out.png --times 1.2,5,9.75      exact times
//   node tools/contact.js --check [--lines L9-L17]        no image: seek every 0.1 s and report JS errors (fast smoke test)
// Options: --w 300 (frame width px), --cols 8
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
const argv = process.argv.slice(2), out = argv[0] && !argv[0].startsWith('--') ? argv[0] : null;
const A = {}; argv.forEach((x, i) => { if (x.startsWith('--')) A[x.slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true; });
(async () => {
  const w = +(A.w || 300), b = await chromium.launch(), p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) errs.push(m.text()); });
  p.on('requestfailed', r => { if (!/shots\/part\d+\.js$/.test(r.url())) errs.push('missing file: ' + r.url()); });
  await p.goto('file://' + path.resolve(__dirname, '../index.html') + '?w=' + w);
  await p.waitForFunction('window.READY===true', null, { timeout: 30000 }).catch(() => errs.push('page never became READY (see errors above)'));
  if (errs.length) { console.log('ERRORS:\n' + [...new Set(errs)].join('\n')); await b.close(); process.exit(1); }
  const END = await p.evaluate('window.END');
  let t0 = 0, t1 = END - .05;
  if (A.lines) { const [a, z] = String(A.lines).split('-'); [t0, t1] = await p.evaluate(([a, z]) => [LINE[a].start - .1, LINE[z || a].end + .1], [a, z]); }
  if (A.range) [t0, t1] = String(A.range).split('-').map(Number);
  const n = +(A.n || 24);
  let ts = A.times ? String(A.times).split(',').map(Number) : Array.from({ length: n }, (_, i) => +(t0 + i * (t1 - t0) / Math.max(1, n - 1)).toFixed(2));
  if (A.check) {
    const bad = await p.evaluate(([t0, t1]) => { const bad = []; for (let t = t0; t <= t1; t += .1) { try { seek(t); } catch (e) { bad.push(t.toFixed(1) + 's: ' + e.message); if (bad.length > 8) break; } } return bad; }, [t0, t1]);
    await b.close();
    if (bad.length || errs.length) { console.log('ERRORS:\n' + [...bad, ...new Set(errs)].join('\n')); process.exit(1); }
    console.log(`OK: ${t0.toFixed(1)}–${t1.toFixed(1)}s renders without errors (END=${END})`); return;
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cs_')); const files = [];
  for (const t of ts) {
    const d = await p.evaluate(t => { seek(t); return document.getElementById('c').toDataURL('image/jpeg', .9); }, t);
    const f = `${dir}/${String(files.length).padStart(3, '0')}.jpg`; fs.writeFileSync(f, Buffer.from(d.split(',')[1], 'base64')); files.push([f, t]);
  }
  await b.close();
  if (errs.length) console.log('ERRORS:\n' + [...new Set(errs)].join('\n'));
  const cols = Math.min(+(A.cols || 8), files.length);
  execFileSync('python3', ['-c', `
from PIL import Image, ImageDraw
fs=${JSON.stringify(files)}; cols=${cols}
ims=[Image.open(f) for f,_ in fs]; w,h=ims[0].size; rows=(len(ims)+cols-1)//cols
S=Image.new('RGB',(cols*w,rows*h),'black'); d=ImageDraw.Draw(S)
for i,(im,(f,t)) in enumerate(zip(ims,fs)):
    x,y=(i%cols)*w,(i//cols)*h; S.paste(im,(x,y)); d.rectangle([x,y,x+64,y+20],fill='black'); d.text((x+4,y+4),f'{t:.2f}s',fill='yellow')
S.save('${out || 'contact.png'}')`]);
  console.log(`END ${END}s, ${files.length} frames (${ts[0]}–${ts[ts.length - 1]}s) -> ${out || 'contact.png'}`);
})();
