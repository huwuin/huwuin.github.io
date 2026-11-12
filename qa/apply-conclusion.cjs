/* One-time narrative and rehearsal-note revision from the conclusion brief. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const write = (name, value) => fs.writeFileSync(path.join(root, name), value, 'utf8');
const box = { window: {} };
vm.runInNewContext(read('notes.js'), box);
const notes = box.window.DECK_NOTES;
notes[1] = `Speaker 1 · The imagined mission
Use the Golden Record as the historical hook, then explicitly introduce our film mission as hypothetical. Keep the five branching questions visible.

NASA’s Voyager spacecraft carry Golden Records containing images, natural sounds, music and greetings. They offer a way to think about selecting cultural material to represent Earth.

Now imagine a successor mission with room for just ten films. Which films would we choose, and how would we explain those choices?

Point to the branching rails. Enjoyment, critical acclaim, awards, commercial success and influence may lead to different choices. We need to make our criteria clear. Film history becomes our mine, and the railway represents a proposed route for selecting its cinematic cargo.

Link: “To explain our choices, we first need to examine the evidence.”

Sources: Group 19 Challenge 2 RP, introduction and reference [1]. The matching reference in this deck is NASA, Golden Record contents [12], https://science.nasa.gov/mission/voyager/golden-record-contents/. The historical record and the imagined ten-film mission are distinct. The disc is an original stylised vector, not an external photograph or a technical replica.`;
notes[10] = `Speaker 4 · Synthesis · about 0:00–2:25
Delivery: preserve the order Background, Innovation, Description. Press 1, 2 and 3, or click each station, as you summarise it. All three statements stay visible. Escape clears the highlight. These timings are rehearsal targets, not programmed transitions.

To conclude, our proposal brings together three parts of the argument.

[Highlight 1.] First, the background showed why choosing ten films is difficult. Audience ratings, criticism, institutional recognition, commercial performance and influence tell us different things. Their coverage is also uneven. The studies we reviewed provide useful methods, but their objectives and samples differ from ours.

[Highlight 2.] Second, our innovation is a documented framework combining five criteria. We propose making the choices visible: which films enter the catalogue, how we handle missing evidence, how we make the indicators comparable, and how much weight each receives. This would help others inspect and reproduce the process, subject to source access and licensing.

[Highlight 3.] Third, the description separates estimating evidence scores from refining the selection. The Bayesian step regularises audience ratings. The number of votes matters because an estimate based on a small audience has less evidence behind it. We then normalise and combine the five dimensions. Diversity optimisation considers regions, languages, genres and exposure when deciding which films to include and where to place them.

These choices create trade-offs. We still need to test stability, diversity and mean score loss against suitable baselines. Stability asks how sensitive the list is to our choices. Mean score loss measures the fall in the selection’s average evidence score as we diversify it. The integrated system remains a TRL 2 proposal. A working proof of concept is the next objective.

For developers, this could provide configurable methods for examining ranking choices. For audiences and curators, it could support film discovery and retrospective selections whose reasoning can be explained.

The aim is a proposed Top 10 with explicit criteria and testable trade-offs. It would make the selection easier to question and discuss.

Method notes: the literature review has been conducted. Source integration, implementation and validation remain proposed work. Do not claim a completed Top 10, guaranteed diversity, objective artistic quality or unrestricted access to all sources. The recap introduces no new study, experiment or metric. All points refer back to slides 4–10. The four-person delivery should be timed in rehearsal, with natural pauses rather than added waiting time.

Sources: the conclusion brief, Group 19 Challenge 2 RP, and the preceding presentation sections. Evidence and method references [1–11].`;
notes[11] = `Speaker 4 · Return to Voyager · about 2:25–2:55
Delivery: advance after the synthesis. The diamond and Golden Record are immediately visible. The question remains on screen until you choose to advance. Speak the longer pocket setup, then pause and make eye contact for a few seconds. Let the audience consider its answer before showing Thank you.

Our imagined mission now has a proposed method for choosing its cinematic cargo.

Before we close, imagine that your spacesuit has a secret pocket, with room for one extra film. Which film would you smuggle into space?

Method notes: the mission is hypothetical. The diamond represents the research objective or cinema’s cultural value. It is not a winning film or a computed result. The stylised disc recalls the real Voyager Golden Record introduced on slide 2. There is no real film-carrying launch or NASA collaboration. Use the exact short question shown on screen. Do not promise a measured or validated final selection.

Sources: the conclusion brief and Group 19 Challenge 2 RP. Historical context: NASA, Golden Record contents [12]. The diamond and disc are original vectors.`;
notes[12] = `Speaker 4 · Thank you and questions · about 2:55–3:00
Delivery: move here only after the final question and its short audience pause. Leave this screen visible during discussion.

Thank you. We would be happy to answer your questions.

For questions: listen to the complete question and answer its central point concisely. If asked about results, explain that the integrated system is a proposal awaiting implementation and validation. Distinguish the illustrative Parasite calculation from measured results. Use R to open references and R again to return here. D opens the data plan and A opens the architecture when useful.

Rehearsal: the conclusion script across slides 11–13 is intended for approximately three minutes with natural pauses. Confirm the pace with a timed rehearsal. No slide advances automatically.`;
notes[14] = notes[14]
  .replace('Reference appendix · Methods and readiness', 'Reference appendix · Methods and context')
  .replace('Sources [7–11] are linked on this slide.', 'Sources [7–12] are linked on this slide. NASA’s Golden Record contents [12] supplies the historical context used in the introduction and closing. It is the same source cited by the Challenge 2 RP. The cinematic successor mission is an imagined scenario.');
write('notes.js', '/* Rehearsal cues for 13 main slides and four supporting appendices. */\nwindow.DECK_NOTES = ' + JSON.stringify(notes, null, 2) + ';\n');

let readme = read('README.md');
readme = readme.replace('| 1–5 | Highlight a source, study or challenge on slides 4–6 |', '| 1–5 | Highlight on slides 4–6; use 1–3 for the recap on slide 11 |');
readme = readme.replace('| 4 | 11–13 | Synthesis, closing question, thanks and discussion |', '| 4 | 11–13 | Synthesis, return to Voyager, thanks and discussion |');
readme = readme.replace('After the audience question on slide 12, advance to the thank-you screen for discussion.', 'The introduction uses Voyager’s Golden Record as a historical hook and explicitly imagines a successor mission with room for ten films. The obsolete trivia opener has been removed. The three-station recap preserves the Background, Innovation and Description order. Keys 1–3 or a click highlight the corresponding station and its rail node. The closing question is “Which film would you smuggle into space?”. One original copper disc recalls the Golden Record beside the final diamond. After a short speaker-controlled pause, advance to the existing thank-you screen for discussion.');
readme = readme.replace('All diagrams are original inline SVG or CSS.', 'The conclusion notes provide an approximately three-minute rehearsal script using the argument, applications and pending evaluation already presented. They distinguish the completed literature review from the proposed integration and validation. The historical Golden Record reference [12] uses the same NASA source as the Challenge 2 RP. The imagined ten-film mission is a narrative device. No winning film or completed ranking is presented.\n\nAll diagrams are original inline SVG or CSS.');
write('README.md', readme);
console.log('Updated Voyager introduction, conclusion notes and controls documentation.');
