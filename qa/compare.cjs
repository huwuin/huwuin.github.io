const { chromium, browserExecutable } = require('./browser.cjs');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');
const output = path.join(__dirname, 'comparison');
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: browserExecutable() });
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    for (const [label, entry] of [
      ['current', path.join(root, 'index.html')],
      ['v2', 'C:/Users/hugor/Downloads/Diamond-Mine-Version-2/Diamond-Mine/index.html'],
    ]) {
      for (const slide of [1, 7, 8, 10, 11]) {
        await page.goto(`${pathToFileURL(entry).href}#slide-${slide}`);
        await page.waitForFunction((number) => document.getElementById('stage')?.dataset.slide === String(number), slide);
        await page.waitForTimeout(1100);
        const screenshot = path.join(output, `${label}-${String(slide).padStart(2, '0')}.png`);
        await page.screenshot({ path: screenshot });
        console.log(screenshot);
      }
      if (label === 'v2') {
        await page.goto(`${pathToFileURL(entry).href}#slide-1`);
        await page.waitForTimeout(800);
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(350);
        const screenshot = path.join(output, 'v2-clapper-350ms.png');
        await page.screenshot({ path: screenshot });
        console.log(screenshot);
      }
    }
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
