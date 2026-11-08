// node tools/shot.js <url> <out.png>  — screenshot the canvas of a page (QA helper)
const { chromium } = require('playwright');
(async () => {
  const [url, out] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage();
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('console:', m.text()); });
  p.on('pageerror', e => console.log('pageerror:', e.message));
  await p.goto(url); await p.waitForFunction('window.DONE===true', null, { timeout: 30000 });
  await (await p.$('canvas')).screenshot({ path: out }); await b.close();
})();
