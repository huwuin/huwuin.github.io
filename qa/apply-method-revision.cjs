/* One-time content revision from the supplied Innovation and Description brief. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const write = (name, value) => fs.writeFileSync(path.join(root, name), value, 'utf8');
function replaceOnce(text, before, after) {
  if (text.split(before).length !== 2) throw new Error(`Expected exactly one match: ${before.slice(0, 80)}`);
  return text.replace(before, after);
}

write('index.html', replaceOnce(read('index.html'), '<div class="utility-controls"><button id="overview-toggle"', '<div class="utility-controls"><button id="detail-toggle" title="Show slide detail (E)" aria-label="Show slide detail" aria-expanded="false" hidden>E</button><button id="overview-toggle"'));

const sandbox = { window: {} };
vm.runInNewContext(read('notes.js'), sandbox);
const notes = sandbox.window.DECK_NOTES;
notes[6] = `Speaker 3 · Innovation · about 0:00–0:38
Delivery: follow the five carts to Data preparation, then the two processing stations. Distinguish evidence scores from the final selection.

Our contribution is a framework connecting five dimensions: audience opinion, professional criticism, awards, economic performance and cultural recognition.

First, data preparation links the film records and checks comparability. We then regularise the audience ratings, normalise all five indicators and combine them into an evidence score for each film.

The second phase uses those scores to construct a more varied selection. This separates a film’s evidence score from its final position or inclusion in the Top 10.

Method notes: preparation also requires documented matching rules, missing-data decisions and access checks. Missing evidence is not automatically a zero score. Normalisation makes indicators comparable before their weighted combination. The Bayesian step applies only to audience ratings. Weights and transformations are design choices that require justification and sensitivity testing.

Sources: the supplied RP revision instructions. Weighted audience-rating context: IMDb [1]. Multicriteria research context: Wang et al. [10]. The integration is our proposed framework, not a method already validated by those sources.`;
notes[7] = `Speaker 3 · Phase 1 and worked example · about 0:38–1:25
Delivery: show the balance first. Press E after explaining the audience estimate to show Parasite, then use Right Arrow for the next slide. E or Escape returns to the balance. All calculation values and the warning appear together. Navigation resets this detail view.

Phase one begins with Bayesian Weighted Rating for the audience ratings.

The balance combines a film’s rating evidence with a prior: the catalogue average. Fewer votes mean a stronger pull towards that average. Awards and revenue remain separate indicators.

Next, we normalise and combine all five dimensions.

[Press E.] Take Parasite as an illustration. These five normalised values use equal weights, giving an evidence score of 70.2 out of 100. The values come from our proposal’s worked example. They are not measurements from an implemented system.

Method notes: the prior is the mean audience rating across the study catalogue. Its strength must be specified and tested. The scale is a conceptual illustration, and diamond sizes do not encode measured scores. The initial evidence ranking follows normalisation and combination of all five indicators. IMDb’s documented Top 250 formula supports the audience shrinkage principle, not the complete proposed framework or a claim to reproduce its undisclosed user-weighting procedures.

Calculation check: (0.85 + 0.95 + 0.90 + 0.70 + 0.11) / 5 × 100 = 70.2. Audience 0.85 is an illustrative normalised input after regularisation, not a Bayesian result calculated here from a supplied vote count. The example does not establish actual values for Parasite or final weights for the study.

Sources: supplied RP example and revision instructions. Audience weighted-rating context: IMDb Ratings FAQ [1].`;
notes[8] = `Speaker 3 · Phase 2 · about 1:25–2:05
Delivery: point to the region legend, then follow candidate P from sixth to second position. The candidates, their colours and their labels remain unchanged. The diagram is illustrative.

Phase two reconsiders the selection using regions, languages, genres and exposure. We propose penalising repeated profiles and exposure concentration while retaining strong evidence scores.

Here, colour represents production region. Follow P, our Parasite example. Its position changes, while its colour and illustrative score of 70.2 remain the same.

These candidates demonstrate reordering, not experimental results. The full method may also change which films enter the final ten.

We will test the balance between representation and evidence.

Method notes: A–E are synthetic film identifiers with illustrative region profiles. P continues the proposal’s Parasite calculation. This six-candidate illustration demonstrates exposure through position, not a computed optimisation or a final Top 10. A–E retain their profiles, and P retains its individual evidence score, on both sides. The penalty affects selection or position, not the underlying evidence score. Region colours show one attribute only. Languages, genres and exposure require separate definitions and tests. No quota, penalty strength or guarantee of bias removal is fixed here.

Sources: proposed mechanism from the RP revision instructions. Ziegler et al. (2005) [7] supports list-diversification context in book recommendations. Singh and Joachims (2018) [11] supports considering exposure in rankings. Their constrained exposure framework is background, not a claim that we implement their algorithm or inherit its fairness guarantees.`;
notes[9] = `Speaker 3 · Applications, validation and maturity · about 2:05–3:00
Delivery: explain the developer and user perspectives, then press E to replace them with the validation plan. The TRL route stays visible. E or Escape restores the applications. D opens the dataset appendix, and A opens the architecture, only if needed for questions.

For developers, the aim is configurable, reproducible methods. For users, it is film discovery and retrospective curation.

[Press E.] We plan to compare our selection with IMDb and Rotten Tomatoes baselines on a shared film catalogue. We will assess stability, diversity and mean score loss: how much the selected list’s average evidence score falls relative to the initial top ten.

Uneven coverage and proxy indicators remain limitations. Our scope is 1910 to 2024.

The project is at TRL 2, a formulated concept. TRL 3, an experimental proof of concept, is our next objective.

My colleague will now bring the argument together.

Method notes: use the same eligible films and selection size for baseline comparisons, with documented rating and eligibility rules. IMDb audience ratings and Rotten Tomatoes critics’ approval measure different constructs. Neither is ground truth. Compare diversity and stability, and compute mean score loss against the initial top ten using the same individual evidence scores. Test sensitivity to weights and missing-data assumptions. Coverage, recognition and revenue are imperfect proxies. Reproducibility depends on documented processing, source availability and reuse terms. The agreed RP scope of 1910–2024 supersedes the earlier script’s date window. Source acquisition, complete coverage and experimental validation are not claimed.

Sources: RP revision instructions. Baseline definitions: IMDb [1], Rotten Tomatoes [2]. TRL definitions: European Commission [9].`;
notes[14] = `Reference appendix · Methods and readiness
IMDb [1], on the preceding reference page, documents the audience weighted-rating formula and the role of its reference mean. It does not validate the proposed five-indicator score. Ziegler et al. [7] provides list-diversification research in book recommendations. Wang et al. [10] provides multicriteria movie-recommendation research with a different objective. Singh and Joachims [11] formulates ranking fairness through exposure allocation. Our proposed profile and exposure penalties require their own specification and evaluation.

The European Commission [9] defines TRL 2 as technology concept formulated and TRL 3 as experimental proof of concept. The stated current level is our assessment of this proposal, not an external certification. IMDb’s dataset terms [8] distinguish non-commercial access from unrestricted reuse.

AI assistance for code and editing: OpenAI Codex. Research proposal, research decisions and oral delivery: Group 19. Sources [7–11] are linked on this slide.`;
notes[15] = `Dataset appendix · Proposed sources and scope
The unit of analysis is the film. The agreed RP window is 1910–2024. This replaces the earlier 1920–2023 window. Do not infer complete source coverage or add eligibility exclusions from the superseded delivery script.

IMDb is a candidate source for identifiers, years, audience ratings and vote counts. Rotten Tomatoes supplies a different construct, critics’ approval. Academy records, The Numbers, BFI polls and film-citation research supply candidate indicators for the remaining dimensions. Public visibility does not establish permission to collect or redistribute records.

Before implementation, document acquisition dates, access terms, film matching, inclusion rules, units, coverage and missing-data handling. Record counts and the final matched catalogue remain to be assessed. Missing indicators must not automatically be scored as poor performance. Check economic comparability and the limitations of recognition and influence proxies.

Sources: current RP revision instructions and sources [1–6, 8]. This is a source-selection plan, not an acquired or audited dataset.`;
notes[16] = `Architecture appendix · The complete process
Read the continuous route clockwise: film records, data preparation, audience rating estimation, initial evidence ranking, diversity optimisation, proposed Top 10.

Preparation integrates records and checks comparability. Bayesian Weighted Rating regularises only audience ratings using the catalogue average as the prior. Then normalise and combine all five indicators to obtain each film’s evidence score and the initial ranking. Diversity optimisation uses those evidence scores while considering regions, languages, genres and exposure. It can change position or inclusion without overwriting an individual evidence score.

The continuous route is a conceptual architecture, not a deployed system or measured result. Weights, transformations, prior strength, missing-data rules and diversity penalties require specification and testing. The agreed scope is 1910–2024.

Use A to return to the main presentation. Sources: the current RP revision instructions, AW7 diagram guidance, audience-rating context [1], list-diversification context [7], exposure context [11].`;
write('notes.js', '/* Rehearsal cues for 13 main slides and four supporting appendices. */\nwindow.DECK_NOTES = ' + JSON.stringify(notes, null, 2) + ';\n');

let readme = read('README.md');
readme = replaceOnce(readme, '| N | Speaker notes for the current slide |', '| N | Speaker notes for the current slide |\n| E | Show / hide Parasite on slide 8 or validation on slide 10 |');
readme = replaceOnce(readme, '| Escape | Close an overlay or clear a highlight |', '| Escape | Close an overlay or slide detail, or clear a highlight |');
readme = replaceOnce(readme, 'Slides do not advance automatically.', 'Slides do not advance automatically. On slides 8 and 10, E toggles an additional view within the same slide. The footer E button also works with a mouse or keyboard. Right Arrow and Space still advance to the next slide. Returning to a slide restores its main view.');
readme = replaceOnce(readme, 'No final films, dataset statistics, numerical weights or experimental results have been invented.', 'No final Top 10, dataset statistics or experimental results are claimed. The illustrative Parasite calculation uses the values and equal weights supplied in the RP.');
const oldContent = readme.slice(readme.indexOf("David's Innovation and Description script supplies"), readme.indexOf('The five criteria are complementary'));
if (!oldContent) throw new Error('Missing previous methodology paragraphs');
readme = replaceOnce(readme, oldContent, `The current Innovation and Description instructions supersede David's earlier script. Slides 7–10 remain four slides for approximately three minutes. Research gap, slide 6, is preserved. Data preparation precedes estimation. Bayesian regularisation applies only to audience ratings, using the catalogue average as a prior. All five indicators are then normalised and combined into individual evidence scores. Diversity optimisation considers regions, languages, genres and exposure when choosing and ordering the final selection.

Slide 8 retains the balance. Press E to replace it with the supplied Parasite example: Audience 0.85, Critics 0.95, Awards 0.90, Economic 0.70 and Recognition 0.11. Equal weights give 70.2/100. The whole example is labelled “Illustrative calculation, not a measured result”. Slide 9 gives each candidate a persistent identifier and production-region colour. P changes position while retaining the same illustrative evidence score. It is an explanatory reordering, not an experimental output.

Slide 10 separates applications from the validation plan with E while keeping TRL 2 and the target TRL 3 visible. The proposed validation compares IMDb and Rotten Tomatoes baselines and assesses stability, diversity and mean score loss. Uneven coverage and proxy indicators remain limitations. The agreed RP date window is 1910–2024. Weights, transformations, missing-data handling, prior strength and diversification settings still require specification and testing. Notes distinguish the proposed mechanism from the published methods cited as background. The complete process remains available with A.

`);
write('README.md', readme);
console.log('Updated notes, controls and methodology documentation.');
