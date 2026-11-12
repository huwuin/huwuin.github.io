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
| E | Show / hide Parasite on slide 8 or validation on slide 10 |
| 1–5 | Highlight on slides 4–6; use 1–3 for the recap on slide 11 |
| R | Open references / return to the previous main slide |
| D | Open the dataset plan / return to the previous main slide |
| A | Open the system architecture / return to the previous main slide |
| C | Replay the cinema clapper transition |
| F | Toggle fullscreen |
| ? | Show controls |
| Escape | Close an overlay or slide detail, or clear a highlight |

The footer provides mouse controls and clickable railway stations. Move the pointer to the footer to reveal its additional controls, or reach them with Tab. A horizontal swipe also advances or reverses the deck on touch devices. Space retains native activation when a button or link has keyboard focus. Slides do not advance automatically. On slides 8 and 10, E toggles an additional view within the same slide. The footer E button also works with a mouse or keyboard. Right Arrow and Space still advance to the next slide. Returning to a slide restores its main view.

The cinema slate lasts 1.10 seconds. It plays on the opening transition and when returning to the first slide. Navigation or Escape cancels it immediately. Rail highlights travel for about three seconds after a slide is shown, then fade smoothly over 600ms. Backward navigation reverses their travel while keeping the same fade. Opening slide details does not restart an expired highlight. All slides use the same obsidian background. Reduced-motion preferences show the underlying rails without the moving accent.

Speaker notes open in an overlay **on the same screen**. Use them during rehearsal, or read notes.js separately before presenting. They are not a private second-screen presenter view. The assessment rubric expects the presenters to speak without reading from notes or devices. Rehearse the argument and the handoffs, then present to the audience.

## Speaking order

| Speaker | Slides | Argument |
| --- | --- | --- |
| 1 | 1–3 | Voyager, the hypothetical ten-film mission, team and research roadmap |
| 2 | 4–6 | Existing evidence, previous research and the applied research gap |
| 3 | 7–10 | Five criteria, two phases, applications and TRL |
| 4 | 11–13 | Synthesis, return to Voyager, thanks and discussion |
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

The supplied Group 19 Speech Preparation Outline is the source for the sequence and proposed algorithm. The presentation follows the additional brief's more cautious language where the outline overstates objectivity or bias removal. The system remains at TRL 2. No final Top 10, dataset statistics or experimental results are claimed. The illustrative Parasite calculation uses the values and equal weights supplied in the RP.

The revision also follows the user's Speaker 2 script and the supplied AW7, Week 8, Week 9 and oral-presentation assessment guidance. The main slides emphasize the academic argument while detailed sources, dataset characteristics and delivery cues remain available in notes and appendices. The original project has been preserved in `versions/01-original/`, including its complete ZIP.

Slides 4–6 follow the revised three-minute literature review: evidence sources (about 55 seconds), contributions and scope of Wasserman (2015), Wang (2024) and Ziegler (2005) (about 60 seconds), then integration, representation and evaluation challenges (about 65 seconds). Use number keys or click the relevant row or challenge to highlight it. All content remains visible, and slide navigation always advances to the next slide. The notes contain the supplied speech and handoff. Study scope is not evidence that a method is ineffective. Evaluation concerns the selected list's diversity, stability and mean evidence score; it does not imply that diversification must change each film's individual score.

Projected slides omit speaker metadata, the long formal proposal title and repeated explanatory captions. Speaker assignments and fuller explanations remain available in the overview and rehearsal notes. The three-slide introduction starts with the historical Golden Record carried by Voyager in 1977, then explicitly imagines a successor mission with room for ten films. The third slide introduces Group 19 and the four confirmed members, states the proposed framework and previews the three presentation sections. The original three-station index layout is retained. The three-station recap preserves the Background, Innovation and Description order. Keys 1–3 or a click highlight the corresponding station and its rail node. The closing question is “Which film would you smuggle into space?”. One original copper disc recalls the Golden Record beside the final diamond. After a short speaker-controlled pause, advance to the existing thank-you screen for discussion.

The current Innovation and Description instructions supersede David's earlier script. Slides 7–10 remain four slides for approximately three minutes. Research gap, slide 6, is preserved. Data preparation precedes estimation. Bayesian regularisation applies only to audience ratings, using the catalogue average as a prior. All five indicators are then normalised and combined into individual evidence scores. Diversity optimisation considers regions, languages, genres and exposure when choosing and ordering the final selection.

Slide 8 retains the balance. Press E to replace it with the supplied Parasite example: Audience 0.85, Critics 0.95, Awards 0.90, Economic 0.70 and Recognition 0.11. Equal weights give 70.2/100. The whole example is labelled “Illustrative calculation, not a measured result”. Slide 9 gives each candidate a persistent identifier and production-region colour. P changes position while retaining the same illustrative evidence score. It is an explanatory reordering, not an experimental output.

Slide 10 separates applications from the validation plan with E while keeping TRL 2 and the target TRL 3 visible. The proposed validation compares IMDb and Rotten Tomatoes baselines and assesses stability, diversity and mean score loss. Uneven coverage and proxy indicators remain limitations. The agreed RP date window is 1910–2024. Weights, transformations, missing-data handling, prior strength and diversification settings still require specification and testing. Notes distinguish the proposed mechanism from the published methods cited as background. The complete process remains available with A.

The five criteria are complementary evidence categories, not mutually exclusive platforms. BFI polls and cinematic citation networks are distinguished. Data reproducibility is an aim subject to availability and licensing. The dataset appendix is a source-selection plan and does not claim that the sources have been acquired or audited.

The conclusion notes provide an approximately three-minute rehearsal script using the argument, applications and pending evaluation already presented. They distinguish the completed literature review from the proposed integration and validation. Historical references [12–13] use NASA’s Golden Record contents and Voyager mission overview. The imagined ten-film mission is a narrative device. No winning film or completed ranking is presented.

All diagrams are original inline SVG or CSS. Geology, copper rails and mineral-colored refinement form the visual narrative. Slide 6 keeps the evidence routes disconnected; slide 7 connects them as the innovation section begins. The final rail returns to the light introduced at the opening. The continuous railway architecture is retained in the appendix. Only the active slide is exposed to assistive technology. The presentation has no analytics, remote fonts or runtime dependencies.

AI assistance for code and editing: OpenAI Codex. Research proposal, research decisions and oral delivery: Group 19. This acknowledgement also appears in the reference appendix. The final main slide carries the required exact design credit, in small readable type: “AI-assisted design, adapted and edited by the authors”.

## Development checks

`qa/check.cjs` contains the browser acceptance checks used for this project. It requires Playwright and a local Chrome/Edge executable, discovered locally or through the Codex runtime. QA artifacts are not needed to present. The deliverable ZIP excludes screenshots, source-course PDFs and test dependencies.
