const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 1600 } });
  await p.goto('file://' + path.resolve(__dirname, '../char.html')); await p.waitForFunction('window.READY===true');
  await p.addStyleTag({ content: 'html,body{background:transparent!important}' });
  await (await p.$('#c')).screenshot({ path: process.argv[2], omitBackground: true }); await b.close(); })();
