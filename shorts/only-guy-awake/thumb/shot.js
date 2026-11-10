const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + path.resolve(__dirname, '../thumb.html')); await p.waitForFunction('window.READY===true', null, { timeout: 20000 }).catch(() => {});
  if (errs.length) console.log(errs.join('\n'));
  await (await p.$('#c')).screenshot({ path: process.argv[2] }); await b.close(); })();
