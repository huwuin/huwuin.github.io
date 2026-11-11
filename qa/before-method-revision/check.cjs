/* Local, offline browser checks for the Diamond Mine presentation. */
const { chromium, browserExecutable } = require('./browser.cjs');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const output = path.join(__dirname, 'screenshots');
const MAIN_SLIDES = 13;
const DATASET_SLIDE = MAIN_SLIDES + 3;
const ARCHITECTURE_SLIDE = MAIN_SLIDES + 4;
const TOTAL_SLIDES = ARCHITECTURE_SLIDE;
fs.mkdirSync(output, { recursive: true });
const report = { checks: [], consoleErrors: [], pageErrors: [], externalRequests: [], layouts: [] };
const check = (condition, label, detail) => {
  report.checks.push({ label, pass: Boolean(condition), ...(detail === undefined ? {} : { detail }) });
  if (!condition) console.error('FAIL:', label, detail || '');
};

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: browserExecutable() });
  try {
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();
    page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => report.pageErrors.push(String(error)));
    page.on('request', (request) => { if (/^https?:/.test(request.url())) report.externalRequests.push(request.url()); });
    const url = pathToFileURL(path.join(root, 'index.html')).href;
    const state = () => page.evaluate(() => ({ slide: Number(document.getElementById('stage').dataset.slide), active: document.querySelectorAll('.slide.is-active').length, hash: location.hash, dialog: document.getElementById('deck-dialog').open }));
    const defocus = () => page.evaluate(() => document.activeElement?.blur());
    const key = async (value) => { await defocus(); await page.keyboard.press(value); };
    const go = async (index) => { await page.evaluate((number) => { location.hash = `slide-${number}`; }, index); await page.waitForFunction((number) => Number(document.getElementById('stage').dataset.slide) === number, index); };

    await page.goto(url);
    await page.waitForFunction(() => document.getElementById('stage')?.dataset.slide === '1');
    check(await page.locator('#slides > .slide').count() === TOTAL_SLIDES, '13 main slides and 4 appendix pages');
    check((await state()).active === 1, 'One active slide initially');
    await key('ArrowRight'); check((await state()).slide === 2, 'Right Arrow advances');
    await key('Space'); check((await state()).slide === 3, 'Space advances');
    await key('ArrowLeft'); check((await state()).slide === 2, 'Left Arrow reverses');
    await key('End'); check((await state()).slide === MAIN_SLIDES, 'End selects last main slide');
    await key('Home'); check((await state()).slide === 1, 'Home selects first slide');
    await key('ArrowLeft'); check((await state()).slide === 1, 'Previous clamps at first slide');
    await page.evaluate(() => { for (let i = 0; i < 11; i++) document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); });
    check((await state()).slide === 12 && (await state()).active === 1, 'Rapid forward input preserves one active slide');
    await page.evaluate(() => { for (let i = 0; i < 8; i++) document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })); });
    check((await state()).slide === 4 && (await state()).active === 1, 'Rapid backward input preserves one active slide');
    await key('r'); check((await state()).slide === MAIN_SLIDES + 1, 'R opens references');
    await key('ArrowRight'); check((await state()).slide === MAIN_SLIDES + 2, 'References include second page');
    await key('ArrowRight'); check((await state()).slide === DATASET_SLIDE, 'Appendix includes dataset plan');
    await key('ArrowRight'); check((await state()).slide === ARCHITECTURE_SLIDE, 'Appendix includes system architecture');
    await key('ArrowRight'); check((await state()).slide === TOTAL_SLIDES, 'Next clamps at last appendix');
    await key('r'); check((await state()).slide === 4, 'R returns to original main slide');
    await key('d'); check((await state()).slide === DATASET_SLIDE, 'D opens the dataset plan');
    await key('d'); check((await state()).slide === 4, 'D returns from dataset plan');
    await key('a'); check((await state()).slide === ARCHITECTURE_SLIDE, 'A opens system architecture');
    await key('a'); check((await state()).slide === 4, 'A returns from system architecture');
    await key('o'); check((await state()).dialog, 'O opens overview');
    check(await page.locator('.overview-item').count() === TOTAL_SLIDES, 'Overview lists all slides');
    await page.locator('.overview-item').nth(8).click();
    check((await state()).slide === 9 && !(await state()).dialog, 'Overview selection navigates and closes');
    await key('n'); check((await state()).dialog, 'N opens presenter notes');
    check((await page.locator('#dialog-content').innerText()).length > 80, 'Slide has substantive presenter notes');
    await page.keyboard.press('Escape'); check(!(await state()).dialog, 'Escape closes overlay');
    await key('?'); check((await state()).dialog, '? opens keyboard help');
    await page.keyboard.press('Escape');
    await page.locator('#next-slide').click(); check((await state()).slide === 10, 'Mouse next control works');
    await page.keyboard.press('ArrowLeft'); check((await state()).slide === 9, 'Arrow navigation works after clicking a control');
    await page.keyboard.press('ArrowRight');
    await page.locator('#prev-slide').click(); check((await state()).slide === 9, 'Mouse previous control works');
    await page.locator('.station[data-go="0"]').click(); check((await state()).slide === 1, 'Railway stations navigate');
    await go(MAIN_SLIDES + 1);
    await page.waitForTimeout(700);
    const link = page.locator('.slide.is-active a').first();
    if (await link.count()) {
      await link.focus();
      check(await link.evaluate((element) => element === document.activeElement), 'Reference link receives keyboard focus');
      await page.keyboard.press('Space');
      check((await state()).slide === MAIN_SLIDES + 1, 'Space leaves focused link alone');
    } else check(false, 'References have usable hyperlinks');
    check(await page.evaluate(() => [...document.querySelectorAll('.slide:not(.is-active)')].every((slide) => slide.inert && slide.getAttribute('aria-hidden') === 'true')), 'Inactive slides inert and hidden from assistive technology');
    check(await page.locator('#live-status').getAttribute('aria-live') === 'polite', 'Slide changes announced politely');

    await defocus();
    for (const [width, height] of [[1920,1080], [1280,720]]) {
      await page.setViewportSize({ width, height });
      for (let slide = 1; slide <= TOTAL_SLIDES; slide++) {
        await go(slide); await page.waitForTimeout(1250);
        const layout = await page.evaluate(() => {
          const stage = document.getElementById('stage').getBoundingClientRect();
          const active = document.querySelector('.slide.is-active');
          const outside = [...active.querySelectorAll('h1,h2,h3,p,li,a')].filter((element) => {
            const r = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return r.width && r.height && style.visibility !== 'hidden' && (r.left < stage.left - 1 || r.top < stage.top - 1 || r.right > stage.right + 1 || r.bottom > stage.bottom + 1);
          }).map((element) => element.textContent.trim().slice(0, 100));
          return { stage: { x: stage.x, y: stage.y, width: stage.width, height: stage.height }, scroll: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, outside };
        });
        report.layouts.push({ width, height, slide, ...layout });
        check(Math.abs(layout.stage.width - width) < 1 && Math.abs(layout.stage.height - height) < 1, `${width}×${height} slide ${slide}: stage fits`);
        check(layout.scroll.width <= width && layout.scroll.height <= height, `${width}×${height} slide ${slide}: no page overflow`);
        check(layout.outside.length === 0, `${width}×${height} slide ${slide}: text stays on canvas`, layout.outside);
        await page.screenshot({ path: path.join(output, `${width}x${height}-${String(slide).padStart(2,'0')}.png`) });
      }
    }

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await go(5);
    await key('ArrowRight');
    check((await state()).slide === 6 && (await state()).active === 1, 'Reduced-motion mode navigates correctly');
    const motion = await page.evaluate(() => [...document.querySelectorAll('.slide.is-active, .slide.is-active *')].map((element) => getComputedStyle(element).transitionDuration).filter((duration) => duration.split(',').some((item) => parseFloat(item) > .01)));
    check(motion.length === 0, 'Reduced-motion mode removes long transitions', motion.slice(0, 8));
    const animations = await page.evaluate(() => [...document.querySelectorAll('.slide.is-active, .slide.is-active *')].filter((element) => { const style = getComputedStyle(element); return style.animationName !== 'none' && style.animationDuration.split(',').some((duration) => parseFloat(duration) > .01); }).map((element) => element.className.baseVal || element.className));
    check(animations.length === 0, 'Reduced-motion mode removes active decorative animation', animations.slice(0, 8));
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(100);
    const letterbox = await page.locator('#stage').boundingBox();
    check(Math.abs(letterbox.width / letterbox.height - 16 / 9) < .001 && letterbox.x >= -1 && letterbox.y >= -1 && letterbox.y + letterbox.height <= 769, '4:3 viewport letterboxes without clipping', letterbox);
    const clapperPage = await context.newPage();
    clapperPage.on('pageerror', (error) => report.pageErrors.push(String(error)));
    await clapperPage.clock.install();
    await clapperPage.goto(url);
    await clapperPage.clock.pauseAt(new Date(Date.now() + 10000));
    const clapperHas = (className) => clapperPage.locator('#cinema-clapper').evaluate((element, name) => element.classList.contains(name), className);
    const clapperState = () => clapperPage.evaluate(() => ({ slide: Number(document.getElementById('stage').dataset.slide), active: document.querySelectorAll('.slide.is-active').length, dialog: document.getElementById('deck-dialog').open }));
    check(!(await clapperHas('is-active')), 'Clapper does not obscure initial load');
    await clapperPage.keyboard.press('ArrowRight');
    check(await clapperHas('is-active') && (await clapperState()).slide === 2, 'Opening navigation triggers clapper and updates slide');
    await clapperPage.clock.runFor(200);
    check(await clapperHas('is-snapped'), 'Clapper snaps after 180ms');
    await clapperPage.clock.runFor(500);
    check(await clapperHas('is-active') && !(await clapperHas('is-opening')), 'Clapper holds closed through 700ms');
    await clapperPage.clock.runFor(30);
    check(await clapperHas('is-opening'), 'Clapper begins opening after 720ms');
    await clapperPage.clock.runFor(400);
    check(!(await clapperHas('is-active')), 'Clapper clears after 1100ms');
    await clapperPage.keyboard.press('ArrowLeft');
    check(await clapperHas('is-active') && (await clapperState()).slide === 1, 'Backward return to opening triggers clapper');
    await clapperPage.keyboard.press('ArrowRight');
    await clapperPage.keyboard.press('ArrowRight');
    await clapperPage.clock.runFor(1500);
    check(!(await clapperHas('is-active')) && (await clapperState()).slide === 3 && (await clapperState()).active === 1, 'Rapid navigation cancels stale clapper timers');
    await clapperPage.keyboard.press('c'); check(await clapperHas('is-active'), 'C replays clapper without navigating');
    await clapperPage.keyboard.press('Escape');
    check(!(await clapperHas('is-active')) && (await clapperState()).slide === 3, 'Escape cancels clapper without navigating');
    await clapperPage.keyboard.press('c'); await clapperPage.keyboard.press('n');
    check(!(await clapperHas('is-active')) && (await clapperState()).dialog, 'Opening notes cancels clapper');
    await clapperPage.keyboard.press('Escape');
    await clapperPage.keyboard.press('c');
    await clapperPage.emulateMedia({ reducedMotion: 'reduce' });
    await clapperPage.clock.runFor(50);
    check(!(await clapperHas('is-active')), 'Changing to reduced motion cancels clapper');
    await clapperPage.keyboard.press('c');
    check(!(await clapperHas('is-active')), 'Reduced motion skips clapper replay');
    await clapperPage.close();
    check(report.consoleErrors.length === 0 && report.pageErrors.length === 0, 'No console or JavaScript errors', [...report.consoleErrors, ...report.pageErrors]);
    check(report.externalRequests.length === 0, 'Deck makes no network requests', report.externalRequests);
    fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ passed: report.checks.filter((entry) => entry.pass).length, failed: report.checks.filter((entry) => !entry.pass), screenshots: TOTAL_SLIDES * 2, report: path.join(__dirname, 'report.json') }, null, 2));
    if (report.checks.some((entry) => !entry.pass)) process.exitCode = 1;
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
