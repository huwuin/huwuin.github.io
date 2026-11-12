/* Diamond Mine: self-contained presentation controls. No network or build step. */
(() => {
  'use strict';

  const stage = document.getElementById('stage');
  const slides = Array.from(document.querySelectorAll('#slides > .slide'));
  if (!stage || !slides.length) return;

  const firstAppendix = slides.findIndex((slide) => slide.matches('.references, [data-appendix]'));
  const MAIN_SLIDE_COUNT = firstAppendix < 0 ? slides.length : firstAppendix;
  const byId = (id) => document.getElementById(id);
  const dialog = byId('deck-dialog');
  const dialogContent = byId('dialog-content');
  const dialogTitle = byId('dialog-title');
  const previousButton = byId('prev-slide');
  const nextButton = byId('next-slide');
  const stations = Array.from(document.querySelectorAll('.station[data-go]'));
  const speakerFocusItems = Array.from(document.querySelectorAll('.speaker-focus'));
  const detailSlides = slides.filter((slide) => slide.querySelector('[data-detail-panel]'));
  const detailHeadings = new Map(detailSlides.map((slide) => [slide, slide.getAttribute('aria-labelledby')]));
  const controls = {
    detail: byId('detail-toggle'),
    overview: byId('overview-toggle'),
    notes: byId('notes-toggle'),
    references: byId('references-toggle'),
    fullscreen: byId('fullscreen-toggle'),
    help: byId('help-toggle'),
  };

  let current = 0;
  let returnFromReferences = MAIN_SLIDE_COUNT - 1;
  let dialogMode = null;
  let previousFocus = null;
  let resizeFrame = 0;
  let clapperTimers = [];
  let railAnimations = [];
  let railSlide = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
  const number = (index) => String(index + 1).padStart(2, '0');

  function cancelRailMotion() {
    railAnimations.forEach((animation) => animation.cancel());
    railAnimations = [];
  }

  function playRailMotion(slide, backward, delay = 0) {
    if (railSlide === slide) return;
    cancelRailMotion();
    railSlide = slide;
    if (reducedMotion.matches) return;
    // Hold the moving accent for about three seconds, then fade over 600ms.
    // Document-timeline animations keep their age while slide details hide them.
    const distance = backward ? 784.8 : -784.8;
    railAnimations = Array.from(slide.querySelectorAll('.track-energy'), (track) => track.animate([
      { opacity: 0, strokeDashoffset: '0px', offset: 0 },
      { opacity: .72, strokeDashoffset: `${distance * .05}px`, offset: .05 },
      { opacity: .72, strokeDashoffset: `${distance * (5 / 6)}px`, offset: 5 / 6 },
      { opacity: 0, strokeDashoffset: `${distance}px`, offset: 1 },
    ], { duration: 3600, delay, iterations: 1, easing: 'linear', fill: 'none' }));
  }

  function dismissClapperboard() {
    clapperTimers.forEach((timer) => window.clearTimeout(timer));
    clapperTimers = [];
    byId('cinema-clapper')?.classList.remove('is-active', 'is-snapped', 'is-opening');
    stage.classList.remove('is-clapper-transition');
  }

  function playClapperboard(scene = current + 1) {
    dismissClapperboard();
    const clapper = byId('cinema-clapper');
    if (!clapper || reducedMotion.matches) return;

    setText('clapper-scene-val', String(scene).padStart(2, '0'));
    // Restart the arm cleanly even when C is pressed during a prior reveal.
    // Navigation itself always commits synchronously, beneath this overlay.
    void clapper.offsetWidth;
    clapper.classList.add('is-active');
    stage.classList.add('is-clapper-transition');
    clapperTimers = [
      window.setTimeout(() => clapper.classList.add('is-snapped'), 180),
      window.setTimeout(() => clapper.classList.add('is-opening'), 720),
      window.setTimeout(dismissClapperboard, 1100),
    ];
  }

  function readHash() {
    const match = /^#slide-(\d+)$/.exec(window.location.hash);
    return match ? clamp(Number(match[1]) - 1, 0, slides.length - 1) : 0;
  }

  function fitStage() {
    stage.style.setProperty('--scale', Math.min(window.innerWidth / 1600, window.innerHeight / 900));
    resizeFrame = 0;
  }

  function announce(text) {
    const status = byId('live-status');
    if (status) status.textContent = text;
  }

  function clearSpeakerFocus() {
    speakerFocusItems.forEach((item) => {
      item.classList.remove('is-focused');
      if (item.hasAttribute('aria-pressed')) item.setAttribute('aria-pressed', 'false');
    });
  }

  function setSlideDetail(slide, expanded) {
    const panel = slide.querySelector('[data-detail-panel]');
    const base = slide.querySelector('[data-detail-base]');
    if (!panel || !base) return;
    base.hidden = expanded;
    panel.hidden = !expanded;
    slide.classList.toggle('is-detail-open', expanded);
    const heading = expanded ? panel.querySelector('h2[id]')?.id : null;
    slide.setAttribute('aria-labelledby', heading || detailHeadings.get(slide));
  }

  function updateDetailControl() {
    const slide = slides[current];
    const panel = slide.querySelector('[data-detail-panel]');
    const button = controls.detail;
    if (!button) return;
    button.hidden = !panel;
    const expanded = Boolean(panel && !panel.hidden);
    button.setAttribute('aria-expanded', String(expanded));
    if (!panel) {
      button.removeAttribute('aria-controls');
      return;
    }
    const label = expanded ? 'Return to slide' : `Show ${slide.dataset.detailLabel}`;
    button.title = `${label} (E)`;
    button.setAttribute('aria-label', button.title);
    button.setAttribute('aria-controls', panel.id);
  }

  function toggleSlideDetail() {
    const slide = slides[current];
    const panel = slide.querySelector('[data-detail-panel]');
    if (!panel) return;
    const expanded = panel.hidden;
    setSlideDetail(slide, expanded);
    updateDetailControl();
    announce(expanded ? `${slide.dataset.detailLabel}.` : `${slide.dataset.title}.`);
  }

  function focusSpeakerItem(item) {
    if (!item || !item.closest('.slide.is-active')) return false;
    clearSpeakerFocus();
    item.classList.add('is-focused');
    if (item.hasAttribute('aria-pressed')) item.setAttribute('aria-pressed', 'true');
    announce(`Highlight: ${item.dataset.focusLabel || item.textContent.trim()}`);
    return true;
  }

  function setText(id, value) {
    const element = byId(id);
    if (element) element.textContent = value;
  }

  function updateHash(index) {
    const hash = `#slide-${index + 1}`;
    if (window.location.hash === hash) return;
    // replaceState also works from file:// in modern browsers. The fallback
    // preserves navigation if a browser applies a stricter local-file policy.
    try {
      window.history.replaceState(null, '', hash);
    } catch (_) {
      window.location.hash = hash;
    }
  }

  function goToSlide(index, options = {}) {
    const next = clamp(Number(index) || 0, 0, slides.length - 1);
    const old = current;
    dismissClapperboard();
    clearSpeakerFocus();
    detailSlides.forEach((slide) => setSlideDetail(slide, false));
    if (next >= MAIN_SLIDE_COUNT && old < MAIN_SLIDE_COUNT) returnFromReferences = old;
    current = next;

    if (dialog && dialog.open && !options.keepDialog) closeDialog();
    stage.dataset.direction = next < old ? 'backward' : 'forward';
    stage.dataset.section = slides[next].dataset.section || '';
    stage.dataset.speaker = slides[next].dataset.speaker || '';
    stage.dataset.slide = String(next + 1);

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === next;
      slide.classList.toggle('is-active', active);
      slide.classList.toggle('is-before', slideIndex < next);
      slide.classList.toggle('is-after', slideIndex > next);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });

    const main = next < MAIN_SLIDE_COUNT;
    const progress = main ? next / Math.max(1, MAIN_SLIDE_COUNT - 1) : 1;
    stage.style.setProperty('--progress', String(progress));
    const cart = byId('progress-cart');
    if (cart) cart.style.left = `${progress * 100}%`;
    stations.forEach((station) => {
      const selected = Number(station.dataset.go) === next;
      station.classList.toggle('is-current', selected);
      station.classList.toggle('is-past', Number(station.dataset.go) < next);
      if (selected) station.setAttribute('aria-current', 'step');
      else station.removeAttribute('aria-current');
    });

    setText('section-label', slides[next].dataset.section || (main ? 'Diamond Mine' : 'References'));
    const speaker = slides[next].dataset.speaker;
    setText('speaker-label', speaker ? (/^\d+$/.test(speaker) ? `Speaker ${speaker}` : speaker) : 'Appendix');
    setText('slide-count', main ? `${number(next)} / ${String(MAIN_SLIDE_COUNT).padStart(2, '0')}` : `A${next - MAIN_SLIDE_COUNT + 1} / A${slides.length - MAIN_SLIDE_COUNT}`);
    if (previousButton) previousButton.disabled = next === 0;
    if (nextButton) nextButton.disabled = next === slides.length - 1;
    if (controls.references) controls.references.setAttribute('aria-pressed', String(!main));
    updateDetailControl();

    updateHash(next);
    document.title = `${slides[next].dataset.title || 'Diamond Mine'} · Diamond Mine`;
    announce(`${main ? `Slide ${next + 1} of ${MAIN_SLIDE_COUNT}` : `Appendix ${next - MAIN_SLIDE_COUNT + 1}`}. ${slides[next].dataset.title || ''}`);
    document.dispatchEvent(new CustomEvent('slidechange', { detail: { index: next, previous: old, slide: slides[next] } }));
    const leavingOpening = old === 0 && next === 1;
    const returningToOpening = next === 0 && old > 0 && old < MAIN_SLIDE_COUNT;
    const clapperTransition = !options.skipClapper && !reducedMotion.matches && (leavingOpening || returningToOpening);
    if (clapperTransition) playClapperboard(next + 1);
    playRailMotion(slides[next], next < old, clapperTransition ? 1100 : 0);
  }

  function closeDialog() {
    if (!dialog || !dialog.open) return;
    dialog.close();
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function openDialog(mode, title, content) {
    if (!dialog || !dialogContent || !dialogTitle) return;
    dismissClapperboard();
    if (dialog.open && dialogMode === mode) {
      closeDialog();
      return;
    }
    if (!dialog.open) previousFocus = document.activeElement;
    dialogMode = mode;
    dialog.dataset.mode = mode;
    dialogTitle.textContent = title;
    dialogContent.replaceChildren(content);
    Object.entries(controls).forEach(([name, control]) => {
      if (control && ['overview', 'notes', 'help'].includes(name)) control.setAttribute('aria-expanded', String(mode === name));
    });
    if (!dialog.open) dialog.showModal();
    const focusTarget = mode === 'overview'
      ? dialogContent.querySelector('[aria-current="page"]')
      : byId('dialog-close');
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  }

  function showOverview() {
    const grid = makeElement('div', 'overview-grid');
    slides.forEach((slide, index) => {
      const button = makeElement('button', 'overview-item');
      button.type = 'button';
      if (index === current) button.setAttribute('aria-current', 'page');
      button.append(
        makeElement('span', 'overview-number', index < MAIN_SLIDE_COUNT ? number(index) : `A${index - MAIN_SLIDE_COUNT + 1}`),
        makeElement('span', 'overview-speaker', index < MAIN_SLIDE_COUNT ? `Speaker ${slide.dataset.speaker || ''}` : (slide.dataset.section || 'Appendix')),
        makeElement('span', 'overview-title', slide.dataset.title || `Slide ${index + 1}`),
      );
      button.addEventListener('click', () => goToSlide(index));
      grid.append(button);
    });
    openDialog('overview', 'The mine map', grid);
  }

  function showNotes() {
    const note = (window.DECK_NOTES || [])[current];
    const container = makeElement('div', 'presenter-notes');
    if (typeof note === 'string') {
      note.split(/\n\s*\n/).forEach((paragraph) => container.append(makeElement('p', '', paragraph)));
    } else if (note && typeof note === 'object') {
      if (note.speaker) container.append(makeElement('p', 'notes-speaker', note.speaker));
      if (note.intro) container.append(makeElement('p', '', note.intro));
      const points = note.points || note.notes;
      if (Array.isArray(points)) {
        const list = makeElement('ul', 'notes-list');
        points.forEach((point) => list.append(makeElement('li', '', point)));
        container.append(list);
      } else if (typeof points === 'string') container.append(makeElement('p', '', points));
      if (note.handoff) container.append(makeElement('p', 'notes-handoff', note.handoff));
      if (Array.isArray(note.sources) && note.sources.length) {
        container.append(makeElement('p', 'notes-sources', `Sources: ${note.sources.join('; ')}`));
      }
    } else {
      container.append(makeElement('p', '', current >= MAIN_SLIDE_COUNT ? 'Reference appendix. Use the linked sources for follow-up questions.' : 'No additional presenter notes for this slide.'));
    }
    openDialog('notes', `${number(current)}  ${slides[current].dataset.title || 'Presenter notes'}`, container);
  }

  function showHelp() {
    const list = makeElement('dl', 'shortcuts-list');
    [
      ['→ / Space', 'Next slide'],
      ['←', 'Previous slide'],
      ['Home / End', 'First / last main slide'],
      ['O', 'Open the mine map'],
      ['N', 'Open presenter notes'],
      ['E', 'Show / hide the example on slide 8 or validation on slide 10'],
      ['1–5', 'Highlight on slides 4–6; use 1–3 for the recap on slide 11'],
      ['R', 'References / return to your slide'],
      ['D', 'Dataset plan / return to your slide'],
      ['A', 'Architecture diagram / return to your slide'],
      ['F', 'Enter / leave fullscreen'],
      ['C', 'Replay the cinema clapperboard'],
      ['?', 'Show keyboard controls'],
      ['Escape', 'Close an overlay, slide detail or highlight'],
    ].forEach(([key, description]) => list.append(makeElement('dt', '', key), makeElement('dd', '', description)));
    openDialog('help', 'Presentation controls', list);
  }

  function toggleReferences() {
    if (slides.length <= MAIN_SLIDE_COUNT) return;
    goToSlide(current < MAIN_SLIDE_COUNT ? MAIN_SLIDE_COUNT : returnFromReferences);
  }

  function toggleDatasetPlan() {
    const target = slides.findIndex((slide) => slide.dataset.appendix === 'datasets');
    if (target < 0) return;
    goToSlide(current === target ? returnFromReferences : target);
  }

  function toggleArchitecture() {
    const target = slides.findIndex((slide) => slide.dataset.appendix === 'architecture');
    if (target < 0) return;
    goToSlide(current === target ? returnFromReferences : target);
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else announce('Fullscreen is unavailable in this browser. Use the browser fullscreen command.');
    } catch (_) {
      announce('Fullscreen could not be entered. Use the browser fullscreen command.');
    }
  }

  previousButton?.addEventListener('click', () => goToSlide(current - 1));
  nextButton?.addEventListener('click', () => goToSlide(current + 1));
  controls.overview?.addEventListener('click', showOverview);
  controls.notes?.addEventListener('click', showNotes);
  controls.detail?.addEventListener('click', toggleSlideDetail);
  controls.references?.addEventListener('click', toggleReferences);
  controls.fullscreen?.addEventListener('click', toggleFullscreen);
  controls.help?.addEventListener('click', showHelp);
  byId('dialog-close')?.addEventListener('click', closeDialog);
  stations.forEach((station) => station.addEventListener('click', () => goToSlide(Number(station.dataset.go))));
  speakerFocusItems.forEach((item) => {
    item.addEventListener('click', () => focusSpeakerItem(item));
    item.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      event.stopPropagation();
      focusSpeakerItem(item);
    });
  });

  if (dialog) {
    dialog.addEventListener('close', () => {
      dialogMode = null;
      ['overview', 'notes', 'help'].forEach((name) => controls[name]?.setAttribute('aria-expanded', 'false'));
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected && !previousFocus.closest('[inert]')) {
        previousFocus.focus({ preventScroll: true });
      }
      previousFocus = null;
    });
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
    if (event.key === 'Escape') {
      if (byId('cinema-clapper')?.classList.contains('is-active')) {
        event.preventDefault();
        dismissClapperboard();
      }
      if (dialog?.open) { event.preventDefault(); closeDialog(); return; }
      if (slides[current].classList.contains('is-detail-open')) {
        event.preventDefault();
        toggleSlideDetail();
      }
      clearSpeakerFocus();
      return;
    }
    if (dialog?.open) return;
    const target = event.target;
    if (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')) return;
    // Keep native Space activation on controls, while arrow navigation still
    // works after clicking a station, closing notes, or using the mouse arrows.
    if (event.key === ' ' && target instanceof Element && target.closest('button, a, [role="button"]')) return;
    if (/^[1-5]$/.test(event.key) && focusSpeakerItem(slides[current].querySelector(`[data-focus="${event.key}"]`))) {
      event.preventDefault();
      return;
    }
    let action;
    switch (event.key) {
      case 'ArrowRight': case ' ': case 'PageDown': action = () => goToSlide(current + 1); break;
      case 'ArrowLeft': case 'PageUp': action = () => goToSlide(current - 1); break;
      case 'Home': action = () => goToSlide(0); break;
      case 'End': action = () => goToSlide(MAIN_SLIDE_COUNT - 1); break;
      case 'o': case 'O': action = showOverview; break;
      case 'n': case 'N': action = showNotes; break;
      case 'e': case 'E': if (event.repeat) return; action = toggleSlideDetail; break;
      case 'r': case 'R': action = toggleReferences; break;
      case 'd': case 'D': action = toggleDatasetPlan; break;
      case 'a': case 'A': action = toggleArchitecture; break;
      case 'f': case 'F': action = toggleFullscreen; break;
      case 'c': case 'C': action = () => playClapperboard(); break;
      case '?': action = showHelp; break;
      default: return;
    }
    event.preventDefault();
    action();
  });

  let touchStart = null;
  stage.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1 || dialog?.open || event.target.closest('button, a, input, [role="button"]')) return;
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  stage.addEventListener('touchend', (event) => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) goToSlide(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });

  window.addEventListener('resize', () => {
    if (!resizeFrame) resizeFrame = requestAnimationFrame(fitStage);
  });
  window.addEventListener('hashchange', () => goToSlide(readHash()));
  document.addEventListener('fullscreenchange', () => {
    controls.fullscreen?.setAttribute('aria-pressed', String(Boolean(document.fullscreenElement)));
    fitStage();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      dismissClapperboard();
      cancelRailMotion();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) dismissClapperboard();
  });

  fitStage();
  goToSlide(readHash(), { skipClapper: true });
})();
