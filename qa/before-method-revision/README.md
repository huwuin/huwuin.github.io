# Diamond Mine

An offline HTML presentation for English for Professional and Academic Communication, Group 19. Thirteen main slides follow the four-speaker research outline and end with a thank-you screen. Two reference pages, a dataset plan and the complete system architecture follow as supporting appendices.

## Open the presentation

Open **index.html** in a modern Chrome, Edge, Firefox or Safari browser. No installation, build step, server or internet connection is required. Press **F** for fullscreen. External reference links need internet access.

The fixed 1600 × 900 stage scales proportionally to the screen. Other aspect ratios are letterboxed. The presentation uses local system fonts with fallbacks, so typography may vary slightly across operating systems.

## Controls

| Key | Action |
| --- | --- |
| Right arrow / Space | Next slide |
| Left arrow | Previous slide |
| Home | First slide |
| End | Thank-you screen |
| O | Slide overview |
| N | Speaker notes for the current slide |
| 1–5 | Highlight a source, study or challenge on slides 4–6 |
| R | Open references / return to the previous main slide |
| D | Open the dataset plan / return to the previous main slide |
| A | Open the system architecture / return to the previous main slide |
| C | Replay the cinema clapper transition |
| F | Toggle fullscreen |
| ? | Show controls |
| Escape | Close an overlay or clear a highlight |

The footer provides mouse controls and clickable railway stations. Move the pointer to the footer to reveal its additional controls, or reach them with Tab. A horizontal swipe also advances or reverses the deck on touch devices. Space retains native activation when a button or link has keyboard focus. Slides do not advance automatically.

The cinema slate lasts 1.10 seconds. It plays on the opening transition and when returning to the first slide. Navigation or Escape cancels it immediately. Rail highlights loop continuously while the slide is visible. All slides use the same obsidian background. Reduced-motion preferences keep the rail highlights visible without animation.

Speaker notes open in an overlay **on the same screen**. Use them during rehearsal, or read notes.js separately before presenting. They are not a private second-screen presenter view. The assessment rubric expects the presenters to speak without reading from notes or devices. Rehearse the argument and the handoffs, then present to the audience.

## Speaking order

| Speaker | Slides | Argument |
| --- | --- | --- |
| 1 | 1–3 | Opening question, motivation and research roadmap |
| 2 | 4–6 | Existing evidence, previous research and the applied research gap |
| 3 | 7–10 | Five criteria, two phases, applications and TRL |
| 4 | 11–13 | Synthesis, closing question, thanks and discussion |
| Appendix | 14–15 | Evidence sources and methodology references |
| Appendix | 16 | Proposed data sources, fields, access and study scope |
| Appendix | 17 | Complete system architecture |

## Project files

- `index.html`: individually composed slides, SVG diagrams and reference links.
- `styles.css`: palette, typography, 16:9 layouts and motion.
- `refinements.css`: projection typography, simplified layouts, colored carts and rail highlights.
- `cinema.css`: the cinema-slate transition.
- `app.js`: navigation, accessible overlays, fullscreen and responsive scaling.
- `notes.js`: concise speaking prompts and handoffs.
- `assets/README.md`: asset and font information.

## Content and design decisions

The supplied Group 19 Speech Preparation Outline is the source for the sequence and proposed algorithm. The presentation follows the additional brief's more cautious language where the outline overstates objectivity or bias removal. The system remains at TRL 2. No final films, dataset statistics, numerical weights or experimental results have been invented.

The revision also follows the user's Speaker 2 script and the supplied AW7, Week 8, Week 9 and oral-presentation assessment guidance. The main slides emphasize the academic argument while detailed sources, dataset characteristics and delivery cues remain available in notes and appendices. The original project has been preserved in `versions/01-original/`, including its complete ZIP.

Slides 4–6 follow the revised three-minute literature review: evidence sources (about 55 seconds), contributions and scope of Wasserman (2015), Wang (2024) and Ziegler (2005) (about 60 seconds), then integration, representation and evaluation challenges (about 65 seconds). Use number keys or click the relevant row or challenge to highlight it. All content remains visible, and slide navigation always advances to the next slide. The notes contain the supplied speech and handoff. Study scope is not evidence that a method is ineffective. Evaluation concerns the selected list's diversity, stability and mean evidence score; it does not imply that diversification must change each film's individual score.

Projected slides omit speaker metadata, the long formal proposal title and repeated explanatory captions. Speaker assignments and fuller explanations remain available in the overview and rehearsal notes. After the audience question on slide 12, advance to the thank-you screen for discussion.

David's Innovation and Description script supplies the revision to slides 7–10. Slide 7 retains the colored minecarts and adds copper outline symbols and the two processing stages. Slide 8 replaces the equation with a balance that weighs evidence against a prior, followed by an illustrative ranking of diamonds. Slide 9's visual is preserved exactly. The applications slide contains the two intended audiences and the TRL 2 to TRL 3 route. The complete process is available with A instead of repeating it in the main sequence.

The script proposes inflation adjustment for box-office values, and similarity penalties that may consider director, release year or genre. The proposed study window is 1920–2023 and excludes television series, documentaries and short films. These are research-design choices, not completed preprocessing or evidence of complete source coverage. The prior, weights and penalty settings remain to be specified and tested. The rating example in the notes is hypothetical.

The five criteria are complementary evidence categories, not mutually exclusive platforms. BFI polls and cinematic citation networks are distinguished. Data reproducibility is an aim subject to availability and licensing. The dataset appendix is a source-selection plan and does not claim that the sources have been acquired or audited.

All diagrams are original inline SVG or CSS. Geology, copper rails and mineral-colored refinement form the visual narrative. Slide 6 keeps the evidence routes disconnected; slide 7 connects them as the innovation section begins. The final rail returns to the light introduced at the opening. The continuous railway architecture is retained in the appendix. Only the active slide is exposed to assistive technology. The presentation has no analytics, remote fonts or runtime dependencies.

AI assistance for code and editing: OpenAI Codex. Research proposal, research decisions and oral delivery: Group 19. This acknowledgement also appears in the reference appendix.

## Development checks

`qa/check.cjs` contains the browser acceptance checks used for this project. It requires Playwright and a local Chrome/Edge executable, discovered locally or through the Codex runtime. QA artifacts are not needed to present. The deliverable ZIP excludes screenshots, source-course PDFs and test dependencies.
