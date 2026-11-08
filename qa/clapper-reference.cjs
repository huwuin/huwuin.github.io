const { chromium, browserExecutable } = require('./browser.cjs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: browserExecutable() });
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.clock.install({ time: new Date('2026-11-08T12:00:00Z') });
    await page.goto(pathToFileURL('C:/Users/hugor/Downloads/Diamond-Mine-Version-2/Diamond-Mine/index.html').href);
    await page.clock.pauseAt(new Date('2026-11-08T12:00:01Z'));
    await page.keyboard.press('ArrowRight');
    await page.clock.runFor(350);
    console.log(await page.locator('#cinema-clapper').getAttribute('class'));
    await page.screenshot({ path: path.join(__dirname, 'comparison/v2-clapper-350ms.png') });
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
