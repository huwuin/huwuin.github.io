# Diamond Mine

An offline HTML presentation for English for Professional and Academic Communication, Group 19. Thirteen main slides follow the four-speaker research outline, followed by two reference pages and a dataset-plan appendix.

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
| D | Open the dataset plan / return to the previous main slide |
| C | Replay the cinema clapper transition |
| F | Toggle fullscreen |
| ? | Show controls |
| Escape | Close an overlay |

The footer provides mouse controls and clickable railway stations. Move the pointer to the footer to reveal its additional controls, or reach them with Tab. A horizontal swipe also advances or reverses the deck on touch devices. Space retains native activation when a button or link has keyboard focus. Slides do not advance automatically.

The cinema slate lasts 1.10 seconds. It plays on the opening transition and when returning to the first slide. Navigation or Escape cancels it immediately. It has no sound or camera flash. Rail highlights move briefly, then settle while the speaker talks. Reduced-motion preferences disable these animations.

Speaker notes open in an overlay **on the same screen**. Use them during rehearsal, or read notes.js separately before presenting. They are not a private second-screen presenter view. The assessment rubric expects the presenters to speak without reading from notes or devices. Rehearse the argument and the handoffs, then present to the audience.

## Speaking order

| Speaker | Slides | Argument |
| --- | --- | --- |
| 1 | 1–3 | Opening question, motivation and research roadmap |
| 2 | 4–6 | Existing approaches, research gap and integration proposal |
| 3 | 7–11 | Five criteria, two phases, architecture, applications and TRL |
| 4 | 12–13 | Synthesis, closing question and discussion |
| Appendix | 14–15 | Evidence sources and methodology references |
| Appendix | 16 | Proposed data sources, fields, access and unresolved scope |

## Project files

- `index.html`: individually composed slides, SVG diagrams and reference links.
- `styles.css`: palette, typography, 16:9 layouts and motion.
- `refinements.css`: projection typography, simplified layouts, colored carts and rail highlights.
- `cinema.css`: the cinema-slate transition.
- `app.js`: navigation, accessible overlays, fullscreen and responsive scaling.
- `notes.js`: concise speaking prompts and handoffs.
- `assets/README.md`: asset and font information.

## Content and design decisions

The supplied Group 19 Speech Preparation Outline is the source for the sequence and proposed algorithm. The presentation follows the additional brief's more cautious language where the outline overstates objectivity or bias removal. The system remains at TRL 2. No final films, dataset statistics, weights, release-year range or experimental results have been invented.

The revision also follows the user's Speaker 2 script and the supplied AW7, Week 8, Week 9 and oral-presentation assessment guidance. The main slides emphasize the academic argument while detailed sources, dataset characteristics and delivery cues remain available in notes and appendices. The original project has been preserved in `versions/01-original/`, including its complete ZIP.

Slide 8 includes the verified weighted-rating form W = (vR + mC) / (v + m), published in IMDb's Ratings FAQ for its Top 250 calculation. It is explicitly an illustrative model for a rating source: v is a rating count, R a mean film rating, C a prior mean, and m a prior strength. Revenue and award counts are not substituted for rating counts. The cross-source model, priors and criterion weights are still to be specified and validated.

The five criteria are complementary evidence categories, not mutually exclusive platforms. BFI polls and cinematic citation networks are distinguished. Data reproducibility is an aim subject to availability and licensing. The dataset appendix is a source-selection plan and does not claim that the sources have been acquired or audited.

All diagrams are original inline SVG or CSS. Geology, copper rails and mineral-colored refinement form the visual narrative. Slides 5 and 6 share the same rail diagram so the disconnected routes visibly connect. The final rail returns to the light introduced at the opening. The continuous railway composition of slide 10 is retained. Only the active slide is exposed to assistive technology. The presentation has no analytics, remote fonts or runtime dependencies.

AI assistance for code and editing: OpenAI Codex. Research proposal, research decisions and oral delivery: Group 19. This acknowledgement also appears in the reference appendix.

## Development checks

`qa/check.cjs` contains the browser acceptance checks used for this project. It requires Playwright and a local Chrome/Edge executable, discovered locally or through the Codex runtime. QA artifacts are not needed to present. The deliverable ZIP excludes screenshots, source-course PDFs and test dependencies.
