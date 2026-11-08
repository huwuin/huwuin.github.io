# Diamond Mine

An offline HTML presentation for English for Professional and Academic Communication, Group 19. Thirteen main slides follow the four-speaker research outline, followed by two reference pages.

## Open the presentation

Open **index.html** in a modern Chrome, Edge, Firefox or Safari browser. No installation, build step, server or internet connection is required. Press **F** for fullscreen. External reference links need internet access.

The fixed 1600 × 900 stage scales proportionally to the screen. Other aspect ratios are letterboxed. The presentation uses local system fonts with fallbacks, so typography may vary slightly across operating systems.

## Controls

| Key | Action |
| --- | --- |
| Right arrow / Space | Next slide |
| Left arrow | Previous slide |
| Home | First slide |
| End | Last main slide, the closing question |
| O | Slide overview |
| N | Speaker notes for the current slide |
| R | Open references / return to the previous main slide |
| F | Toggle fullscreen |
| ? | Show controls |
| Escape | Close an overlay |

The footer provides mouse controls and clickable railway stations. A horizontal swipe also advances or reverses the deck on touch devices. Space retains native activation when a button or link has keyboard focus. Slides do not advance automatically.

Speaker notes open in an overlay **on the same screen**. Use them during rehearsal, or read notes.js separately before presenting. They are not a private second-screen presenter view.

## Speaking order

| Speaker | Slides | Argument |
| --- | --- | --- |
| 1 | 1–3 | Opening question, motivation and research roadmap |
| 2 | 4–6 | Existing approaches, research gap and integration proposal |
| 3 | 7–11 | Five criteria, two phases, architecture, applications and TRL |
| 4 | 12–13 | Synthesis, closing question and discussion |
| Appendix | 14–15 | Evidence sources and methodology references |

## Project files

- `index.html`: individually composed slides, SVG diagrams and reference links.
- `styles.css`: palette, typography, 16:9 layouts and motion.
- `app.js`: navigation, accessible overlays, fullscreen and responsive scaling.
- `notes.js`: concise speaking prompts and handoffs.
- `assets/README.md`: asset and font information.

## Content and design decisions

The supplied Group 19 Speech Preparation Outline is the source for the sequence and proposed algorithm. The presentation follows the additional brief's more cautious language where the outline overstates objectivity or bias removal. The system remains at TRL 2. No final films, dataset statistics, weights, release-year range, mathematical formula or experimental results have been invented.

The five criteria are complementary evidence categories, not mutually exclusive platforms. BFI polls and cinematic citation networks are distinguished. Data reproducibility is an aim subject to availability and licensing. The Bayesian prior, weighting choices and diversity criteria remain to be specified and validated.

All diagrams are original inline SVG or CSS. Geology, copper rails and mineral-colored refinement form the visual narrative. Slides 5 and 6 share the same rail diagram so the disconnected routes visibly connect. Motion respects `prefers-reduced-motion`. Only the active slide is exposed to assistive technology. The presentation has no analytics, remote fonts or runtime dependencies.

## Development checks

`qa/check.cjs` contains the browser acceptance checks used for this project. It requires Playwright and a local Chrome/Edge executable; edit its configured paths to run on another computer. QA artifacts are not needed to present. The deliverable ZIP excludes screenshots and test dependencies.
