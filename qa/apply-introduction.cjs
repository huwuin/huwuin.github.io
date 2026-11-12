/* One-time revision from the supplied introduction brief. */
const fs=require('node:fs');
const vm=require('node:vm');
let html=fs.readFileSync('index.html','utf8');
html=html.replace(/    <section class="slide opening is-active"[\s\S]*?<\/section>/,`    <section class="slide opening is-active voyager-opening" data-title="Voyager and the Golden Record" data-speaker="1" data-section="Introduction" aria-labelledby="title-1">
      <svg class="record-hero" viewBox="0 0 620 620" role="img" aria-label="Original stylised illustration of the Golden Record carried by Voyager. Historical sources: NASA, references 12 and 13.">
        <defs><radialGradient id="record-gold"><stop stop-color="#d1aa83" stop-opacity=".13"/><stop offset=".8" stop-color="#d1aa83" stop-opacity=".045"/><stop offset="1" stop-color="#d1aa83" stop-opacity=".12"/></radialGradient></defs>
        <circle cx="310" cy="310" r="256" fill="url(#record-gold)"/>
        <use href="#golden-record" x="20" y="20" width="580" height="580"/>
      </svg>
      <div class="hero-copy">
        <p class="eyebrow reveal">VOYAGER / 1977 <sup>[12, 13]</sup></p>
        <h1 id="title-1" class="reveal">The Golden<br><em>Record</em></h1>
        <p class="hero-sub reveal">Music. Sounds. Images.</p>
      </div>
      <p class="record-credit">Original vector illustration <span>/</span> Research proposal</p>
    </section>`);
html=html.replace(/<div class="debate-title">[\s\S]*?<\/div>\s*<svg class="branch-map"/,`<div class="debate-title"><p class="eyebrow">A HYPOTHETICAL MISSION</p><h2 id="title-2"><span class="film-limit">10</span> films.</h2><p class="selection-question">How do we choose?</p></div>
      <svg class="branch-map"`);
html=html.replace('data-title="Why is this so difficult?"','data-title="Ten films: how do we choose?"');
html=html.replaceAll('MOST LOVED?','Audience response').replaceAll('MOST ACCLAIMED?','Critical reception').replaceAll('MOST AWARDED?','Awards').replaceAll('MOST SUCCESSFUL?','Box-office performance').replaceAll('MOST INFLUENTIAL?','Cultural recognition');
html=html.replace('We propose a transparent ranking<br>that combines multiple sources, then<br>refines the selection for diversity.','We propose a transparent framework<br>that combines five criteria and refines<br>the selection for diversity.');
html=html.replace('<p class="journey-thesis">','<p class="team-roster">Group 19</p>\n      <p class="journey-thesis">');
html=html.replace('<p class="end-credit">GROUP 19 <span>/</span> EPAC</p>','<p class="end-credit">GROUP 19 <span>/</span> EPAC</p>\n      <p class="ai-design-credit">AI-assisted design, adapted and edited by the authors</p>');
const nasa='<article><span>[12]</span><p><strong>NASA (n.d.).</strong> Golden Record contents. <i>NASA Science.</i> <a href="https://science.nasa.gov/mission/voyager/golden-record-contents/" target="_blank" rel="noopener noreferrer">science.nasa.gov / Golden Record ↗</a></p></article>';
if(!html.includes(nasa))throw new Error('Expected NASA reference not found');
html=html.replace(nasa,'<article class="nasa-references"><span>[12]<br>[13]</span><p><strong>NASA (n.d.).</strong> Golden Record contents. <i>NASA Science.</i> <a href="https://science.nasa.gov/mission/voyager/golden-record-contents/" target="_blank" rel="noopener noreferrer">Golden Record ↗</a><br><strong>NASA (n.d.).</strong> Voyager: Mission overview. <i>NASA Science.</i> <a href="https://science.nasa.gov/mission/voyager/mission-overview/" target="_blank" rel="noopener noreferrer">Mission overview ↗</a></p></article>');
html=html.replace('Slide 1: The question','Slide 1: Voyager and the Golden Record').replace('Slide 2: Why is this so difficult?','Slide 2: Ten films: how do we choose?');
fs.writeFileSync('index.html',html);
const box={window:{}};vm.runInNewContext(fs.readFileSync('notes.js','utf8'),box);const notes=box.window.DECK_NOTES;
notes[0]=`Speaker 1 · The Golden Record · about 0:00–0:45
Delivery: introduce the historical hook while pointing to the record. Keep eye contact and explain the visual. Move on when saying Imagine. The timing is a rehearsal target, not an automatic transition.

In 1977, NASA launched Voyager 1 and Voyager 2. Each carried a Golden Record with sounds, music and images of life on Earth.

The records also carried spoken greetings. They were messages for possible extraterrestrial discoverers, although an encounter was never guaranteed.

For our presentation, the interesting question is cultural selection. A record has limited space, so deciding what to include means making choices about what matters and what we want to share.

Sources: NASA, Golden Record contents [12] and Voyager: Mission overview [13]. The artwork is an original stylised vector, not a NASA photograph or a technical replica. Do not claim that NASA omitted cinema by mistake.`;
notes[1]=`Speaker 1 · The hypothetical mission · about 0:45–1:35
Delivery: say Imagine explicitly. Pause briefly after How do we choose?, then explain the five branches as possible criteria. This is a rhetorical question; save audience film suggestions for the closing.

Now imagine extending that idea to cinema. A new mission has room for just ten films. How would we choose them?

We might choose films that audiences love, films admired by critics, award winners, commercial successes, or films with lasting cultural recognition.

Those choices could lead to different selections. The challenge is to explain what each criterion contributes and why we give it a particular weight.

Ten films can share part of our cinematic heritage. Our aim is to reflect the variety and impact of cinema through choices that people can examine and discuss.

Precision: the mission is an imagined scenario, not an announced NASA mission or a collaboration with the agency. Each branch is one dimension of evidence, not a complete measure of artistic quality. Leave source comparisons, prior studies and research gaps for the next speaker.

Source: the supplied introduction brief and Group 19 RP. The historical reference remains on the preceding slide; the fictional mission needs no false NASA attribution.`;
notes[2]=`Speaker 1 · Team, objective and route · about 1:35–3:00
Delivery: introduce the team members by their confirmed names. Explain the thesis, then gesture to the three stations in order. They are sections of the presentation, not three phases of the algorithm. Speak without reading the notes.

We are Group 19. Our team proposes a transparent framework for selecting ten films, combining explicit criteria and examining diversity.

We call the project Diamond Mine. Choosing those films is like searching for diamonds. Existing sources offer different routes. Our proposal connects the evidence and makes the selection process explicit.

Transparency matters because different choices about weights, coverage and diversity may change the selection. We want to document those choices and evaluate their effects. The integrated system remains a proposal awaiting implementation and testing.

First, we will review the existing approaches and research gaps. Then, we will explain our proposed contribution and how the system would work. Finally, we will return to our imagined mission and what this proposal could contribute.

My colleague will now review the existing evidence and the gaps our proposal addresses.

Precision: introduce the members briefly before the thesis. Do not invent names or claim a validated algorithm. The three stations preview Background and research gaps, Innovation and Description. The two algorithm phases are explained later. The space story introduces why we choose, and the mine introduces how we investigate that choice.

Sources: the introduction brief, Group 19 RP and oral presentation checklist. Rehearse the complete three-slide opening with names and natural pauses for approximately three minutes.`;
notes[12]+='\n\nDesign acknowledgement on the final main slide: AI-assisted design, adapted and edited by the authors.';
notes[14]=notes[14].replace('Sources [7–12]','Sources [7–13]')+'\n\nNASA’s Voyager: Mission overview [13] documents the 1977 launches and the purpose of the Golden Records. The hypothetical film mission is separate from those historical facts.';
fs.writeFileSync('notes.js','/* Rehearsal cues for 13 main slides and four supporting appendices. */\nwindow.DECK_NOTES = '+JSON.stringify(notes,null,2)+';\n');
console.log('Applied introduction content, exact design acknowledgement and historical references. Team roster awaits confirmed names.');
