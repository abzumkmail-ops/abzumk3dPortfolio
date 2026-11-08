// node tools/render.js [--w 1080] [--fps 60] [--crf 17] [--from 0] [--to END] [--workers 3] [--fmt png|jpeg] [--out out/video_noaudio.mp4]
// Deterministic frame capture: each worker page seeks directly to its frames → H.264 segments → concat (stream copy).
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), { spawn, execFileSync } = require('child_process');
const A = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => (x.startsWith('--') && a.push([x.slice(2), arr[i + 1]]), a), []));
const Wd = +(A.w || 1080), FPS = +(A.fps || 60), CRF = A.crf || '17', WORKERS = +(A.workers || 3), FMT = A.fmt || 'png';
const ROOT = path.resolve(__dirname, '..'), OUT = path.resolve(ROOT, A.out || 'out/video_noaudio.mp4');
const URL = 'file://' + ROOT + '/index.html?w=' + Wd;
(async () => {
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync'] });
  const probe = await browser.newPage(); const errs = [];
  probe.on('pageerror', e => errs.push(e.message));
  await probe.goto(URL); await probe.waitForFunction('window.READY===true', null, { timeout: 60000 });
  if (errs.length) throw new Error(errs.join('\n'));
  const END = await probe.evaluate('window.END'); const EV = await probe.evaluate('window.EV');
  fs.writeFileSync(ROOT + '/data/ev.json', JSON.stringify({ END, fps: FPS, events: EV }, null, 1));
  await probe.close();
  const from = +(A.from || 0), to = Math.min(+(A.to || END), END);
  const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS); const total = f1 - f0;
  console.log(`END=${END}s  frames ${f0}..${f1} (${total}) @${FPS}fps ${Wd}px  workers=${WORKERS}`);
  const segDir = ROOT + '/out/frames'; fs.mkdirSync(segDir, { recursive: true });
  const per = Math.ceil(total / WORKERS); const t0 = Date.now(); let done = 0;
  const segs = await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
    const a = f0 + w * per, b = Math.min(f1, a + per); if (a >= b) return null;
    const seg = `${segDir}/seg_${w}.mp4`;
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', FMT === 'png' ? 'png' : 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', CRF, '-pix_fmt', 'yuv420p', '-r', String(FPS), seg], { stdio: ['pipe', 'inherit', 'inherit'] });
    const page = await browser.newPage(); page.on('pageerror', e => console.log('pageerror', e.message));
    await page.goto(URL); await page.waitForFunction('window.READY===true', null, { timeout: 60000 });
    for (let f = a; f < b; f++) {
      const d = await page.evaluate(([t, fmt]) => { seek(t); return document.getElementById('c').toDataURL(fmt === 'png' ? 'image/png' : 'image/jpeg', .95); }, [f / FPS, FMT]);
      const buf = Buffer.from(d.slice(d.indexOf(',') + 1), 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (++done % 300 === 0) console.log(`  ${done}/${total} frames  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); await page.close(); return seg;
  }));
  await browser.close();
  const list = segDir + '/list.txt'; fs.writeFileSync(list, segs.filter(Boolean).map(s => `file '${s}'`).join('\n'));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', OUT]);
  console.log(`wrote ${OUT} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
})().catch(e => { console.error(e); process.exit(1); });
