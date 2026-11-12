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
    const go = async (index) => { await page.evaluate((number) => { location.hash = `slide-${number}`; }, index); await page.waitForFunction((number) => Number(document.getElementById('stage').dataset.slide) === number, index); await page.locator('.slide.is-active').waitFor({ state: 'visible' }); };

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

    await go(7);
    check(await page.locator('#detail-toggle').isHidden(), 'Slide detail control is absent where it does not apply');
    await go(8);
    check(await page.locator('.bayesian-mine').isVisible() && await page.locator('#parasite-example').isHidden(), 'Phase 1 starts with the audience-rating balance');
    check((await page.locator('.scale-labels').textContent()).includes('Prior: catalogue average'), 'Audience prior names the catalogue average');
    await key('e');
    check((await state()).slide === 8 && await page.locator('#parasite-example').isVisible() && await page.locator('.bayesian-mine').isHidden(), 'E shows Parasite without adding or changing a slide');
    check(await page.locator('.illustration-warning').isVisible() && await page.locator('.illustration-warning').innerText() === 'Illustrative calculation, not a measured result', 'The whole Parasite example has a visible illustrative warning');
    const calculation = await page.locator('#parasite-example').evaluate((example) => ({ values: [...example.querySelectorAll('dd')].map((cell) => Number(cell.textContent)), output: Number(example.querySelector('.example-result strong').firstChild.textContent), heading: example.querySelector('h2').id, labelledBy: example.closest('.slide').getAttribute('aria-labelledby') }));
    check(JSON.stringify(calculation.values) === '[0.85,0.95,0.9,0.7,0.11]' && Math.abs(calculation.values.reduce((sum, value) => sum + value, 0) / 5 * 100 - calculation.output) < .000001 && calculation.output === 70.2, 'Five supplied indicators give an equal-weight score of 70.2/100', calculation);
    check(calculation.heading === calculation.labelledBy, 'The example has the active slide accessible heading');
    await key('n'); await page.keyboard.press('Escape');
    check(!(await state()).dialog && await page.locator('#parasite-example').isVisible(), 'Closing rehearsal notes preserves the current example');
    await key('e');
    check(await page.locator('.bayesian-mine').isVisible() && await page.locator('#parasite-example').isHidden(), 'E returns to the balance');
    await page.locator('.deck-footer').hover();
    await page.locator('#detail-toggle').click();
    check(await page.locator('#parasite-example').isVisible(), 'Footer detail button opens the example');
    await key('ArrowRight'); await key('ArrowLeft');
    check((await state()).slide === 8 && await page.locator('#parasite-example').isHidden(), 'Backward navigation resets the example to its main view');
    await key('e'); await key('Escape');
    check(await page.locator('#parasite-example').isHidden(), 'Escape returns from slide detail without navigating');
    await go(9);
    const profiles = await page.locator('.diversity-comparison').evaluate((diagram) => [...diagram.querySelectorAll('.candidate-group')].map((group) => [...group.querySelectorAll('.candidate')].map((film) => ({ id: film.dataset.candidate, region: film.className, colour: getComputedStyle(film.querySelector('svg')).stroke, score: film.dataset.evidenceScore || null }))));
    check(profiles[0].every((film) => profiles[1].some((other) => JSON.stringify(other) === JSON.stringify(film))) && profiles[0].map((film) => film.id).join() !== profiles[1].map((film) => film.id).join(), 'Reordering preserves each film identity, region colour and evidence score', profiles);
    check(profiles.every((group) => group.findIndex((film) => film.id === 'P') >= 0 && group.find((film) => film.id === 'P').score === '70.2') && await page.locator('.candidate-legend').isVisible(), 'Parasite retains 70.2 and the region colours have a visible legend');
    await go(10); await key('E');
    check(await page.locator('#validation-plan').isVisible() && await page.locator('.beneficiary-roles').isHidden() && await page.locator('.readiness-current').isVisible() && await page.locator('.readiness-next').isVisible(), 'Validation replaces applications while both TRL states stay visible');
    check((await page.locator('#validation-plan').innerText()).includes('Stability, diversity and mean score loss'), 'Validation names the three proposed evaluation dimensions');
    await key('ArrowRight'); await key('ArrowLeft');
    check(await page.locator('#validation-plan').isHidden() && await page.locator('.beneficiary-roles').isVisible(), 'Returning to applications restores its main view');
    await go(DATASET_SLIDE);
    check((await page.locator('.dataset-scope').innerText()).includes('1910–2024'), 'Dataset appendix uses the agreed RP date scope');

    await go(2);
    const premise = await page.locator('.mission-premise').innerText();
    check(premise.includes('Voyager’s Golden Record') && premise.includes('Imagine a mission with') && premise.includes('room for ten films.'), 'The opener distinguishes the historical Golden Record from an imagined film mission');
    await go(11); await key('1');
    check(await page.locator('.recap-station[data-focus="1"]').getAttribute('aria-pressed') === 'true', 'Key 1 highlights the Background recap station');
    await key('3');
    check(await page.locator('.recap-station.is-focused').count() === 1 && await page.locator('.recap-station[data-focus="3"]').getAttribute('aria-pressed') === 'true', 'Recap highlighting follows the speaker and selects one station at a time');
    await page.waitForTimeout(220);
    const stationColours = await page.locator('.recap-lines').evaluate((recap) => ({ node: getComputedStyle(recap.querySelector('.recap-node-3')).fill, text: getComputedStyle(recap.querySelector('[data-focus="3"] h3')).color, unselected: getComputedStyle(recap.querySelector('.recap-node-1')).fill }));
    check(stationColours.node === stationColours.text && stationColours.node !== stationColours.unselected, 'The highlighted statement and its rail station share the mineral accent', stationColours);
    await page.locator('.recap-station[data-focus="2"]').click();
    check(await page.locator('.recap-station[data-focus="2"]').getAttribute('aria-pressed') === 'true', 'A mouse click highlights the Innovation recap station');
    await page.locator('.recap-station[data-focus="3"]').focus();
    await page.keyboard.press('Space');
    check((await state()).slide === 11 && await page.locator('.recap-station[data-focus="3"]').getAttribute('aria-pressed') === 'true', 'Space activates a focused recap station without navigating');
    await page.keyboard.press('Enter');
    check((await state()).slide === 11, 'Enter activates a recap station without advancing');
    await key('Escape');
    check(await page.locator('.recap-station.is-focused').count() === 0 && await page.locator('.recap-station[aria-pressed="true"]').count() === 0, 'Escape clears visual and accessible recap selection');
    await key('2'); await key('ArrowRight'); await key('ArrowLeft');
    check((await state()).slide === 11 && await page.locator('.recap-station.is-focused').count() === 0, 'Backward navigation restores the recap without a stale highlight');
    await go(4); await key('2');
    check(await page.locator('.source-row[data-focus="2"]').evaluate((row) => row.classList.contains('is-focused')), 'Existing source highlighting remains available');
    await go(12);
    check((await page.locator('#title-13').innerText()).replace(/\s+/g,' ').trim() === 'Which film would you smuggle into space?' && await page.locator('.mission-record').isVisible() && await page.locator('.final-gem').isVisible(), 'The closing question returns to the imagined mission beside the diamond and one record');
    await go(MAIN_SLIDES + 2);
    check(await page.locator('.slide.is-active a[href="https://science.nasa.gov/mission/voyager/golden-record-contents/"]').count() === 1, 'The NASA source used by the RP is linked in the existing reference appendix');

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
        if (slide === 11) {
          await key('2'); await page.waitForTimeout(220);
          await page.screenshot({ path: path.join(output, `${width}x${height}-11-highlight.png`) });
          await key('Escape');
        }
        if ([8,10].includes(slide)) {
          await key('e'); await page.waitForTimeout(300);
          const detailLayout = await page.locator('.slide.is-active [data-detail-panel]').evaluate((panel) => {
            const stage = document.getElementById('stage').getBoundingClientRect();
            return [...panel.querySelectorAll('h2,h3,p,dt,dd,strong')].filter((element) => {
              const r = element.getBoundingClientRect();
              return r.width && r.height && (r.left < stage.left - 1 || r.top < stage.top - 1 || r.right > stage.right + 1 || r.bottom > stage.bottom + 1);
            }).map((element) => element.textContent.trim());
          });
          check(detailLayout.length === 0, `${width}×${height} slide ${slide}: detail text stays on canvas`, detailLayout);
          await page.screenshot({ path: path.join(output, `${width}x${height}-${String(slide).padStart(2,'0')}-detail.png`) });
        }
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
    await go(8); await key('e');
    const detailMotion = await page.locator('#parasite-example').evaluate((panel) => getComputedStyle(panel).animationName);
    check(await page.locator('#parasite-example').isVisible() && detailMotion === 'none', 'Reduced motion preserves the example without a reveal animation');
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
    await clapperPage.keyboard.press('End');
    await clapperPage.keyboard.press('ArrowLeft');
    await clapperPage.clock.fastForward(180000);
    check((await clapperState()).slide === 12, 'The final question waits for the speaker without automatic advance');
    await clapperPage.keyboard.press('ArrowRight');
    check((await clapperState()).slide === 13, 'The speaker advances from the final question to Thank you');
    await clapperPage.keyboard.press('r');
    await clapperPage.keyboard.press('r');
    check((await clapperState()).slide === 13, 'References remain accessible during Q&A and return to Thank you');
    await clapperPage.keyboard.press('ArrowLeft');
    await clapperPage.keyboard.press('ArrowLeft');
    await clapperPage.keyboard.press('3');
    check(await clapperPage.locator('.recap-station[data-focus="3"]').getAttribute('aria-pressed') === 'true', 'Recap highlighting works when returning in reduced-motion mode');
    await clapperPage.close();
    check(report.consoleErrors.length === 0 && report.pageErrors.length === 0, 'No console or JavaScript errors', [...report.consoleErrors, ...report.pageErrors]);
    check(report.externalRequests.length === 0, 'Deck makes no network requests', report.externalRequests);
    fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ passed: report.checks.filter((entry) => entry.pass).length, failed: report.checks.filter((entry) => !entry.pass), screenshots: TOTAL_SLIDES * 2 + 6, report: path.join(__dirname, 'report.json') }, null, 2));
    if (report.checks.some((entry) => !entry.pass)) process.exitCode = 1;
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
