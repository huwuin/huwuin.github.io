const { chromium, browserExecutable } = require('./browser.cjs');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');
const output = path.join(__dirname, 'method-review');
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: browserExecutable() });
  try {
    const page = await browser.newPage();
    for (const [width, height] of [[1920,1080], [1280,720]]) {
      await page.setViewportSize({ width, height });
      for (const slide of [7,8,9,10,15,16]) {
        await page.goto(pathToFileURL(path.join(root, 'index.html')).href + `#slide-${slide}`);
        await page.waitForTimeout(900);
        await page.screenshot({ path: path.join(output, `${width}-${slide}.png`) });
        if ([8,10].includes(slide)) {
          await page.keyboard.press('e');
          await page.waitForTimeout(300);
          await page.screenshot({ path: path.join(output, `${width}-${slide}-detail.png`) });
        }
      }
    }
    console.log(`Saved 16 previews to ${output}`);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
