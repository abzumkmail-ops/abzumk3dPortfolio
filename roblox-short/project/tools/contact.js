// node tools/contact.js <out.png> [count=24] [width=360] [t1,t2,...]
// Renders frames by seeking directly (proves determinism) and tiles them into a labelled contact sheet.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
(async () => {
  const [out, countS = '24', wS = '360', list] = process.argv.slice(2);
  const w = +wS, b = await chromium.launch(), p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '../index.html') + '?w=' + w);
  await p.waitForFunction('window.READY===true', null, { timeout: 30000 }).catch(() => {});
  if (errs.length) { console.log('ERRORS:', errs.join('\n')); await b.close(); process.exit(1); }
  const END = await p.evaluate('window.END');
  const ts = list ? list.split(',').map(Number) : Array.from({ length: +countS }, (_, i) => +(i * (END - .05) / (+countS - 1)).toFixed(2));
  const dir = fs.mkdtempSync('/tmp/claude-0/cs_'); const files = [];
  for (const t of ts) {
    const d = await p.evaluate(t => { seek(t); return document.getElementById('c').toDataURL('image/png'); }, t);
    const f = `${dir}/${String(files.length).padStart(3, '0')}.png`; fs.writeFileSync(f, Buffer.from(d.split(',')[1], 'base64')); files.push([f, t]);
  }
  if (errs.length) console.log('ERRORS:', errs.join('\n'));
  await b.close();
  const cols = Math.min(8, files.length);
  execFileSync('python3', ['-c', `
import sys
from PIL import Image, ImageDraw
fs=${JSON.stringify(files)}; cols=${cols}
ims=[Image.open(f) for f,_ in fs]; w,h=ims[0].size; rows=(len(ims)+cols-1)//cols
S=Image.new('RGB',(cols*w,rows*h),'black'); d=ImageDraw.Draw(S)
for i,(im,(f,t)) in enumerate(zip(ims,fs)):
    x,y=(i%cols)*w,(i//cols)*h; S.paste(im,(x,y)); d.rectangle([x,y,x+70,y+22],fill='black'); d.text((x+4,y+4),f'{t:.2f}s',fill='yellow')
S.save('${out}')`]);
  console.log('END', END, 'frames', files.length, '->', out);
})();
