/* One-time adaptation of the supplied David script to the local HTML deck. */
const fs = require('node:fs');
let html = fs.readFileSync('index.html', 'utf8');
const matches = [...html.matchAll(/<section\b[\s\S]*?<\/section>/g)];
if (matches.length !== 17) throw new Error('Unexpected starting slide count');
const old = matches.map(match => match[0]);

const icons = `
  <symbol id="icon-audience" viewBox="0 0 48 48"><path d="m8 17 2.2 4.5 5 .7-3.6 3.5.8 5-4.4-2.4-4.4 2.4.8-5L.8 22.2l5-.7Zm16-4 3 6.1 6.7 1-4.8 4.7 1.1 6.7-6-3.2-6 3.2 1.1-6.7-4.8-4.7 6.7-1Zm16 4 2.2 4.5 5 .7-3.6 3.5.8 5-4.4-2.4-4.4 2.4.8-5-3.6-3.5 5-.7Z"/></symbol>
  <symbol id="icon-critics" viewBox="0 0 48 48"><path d="M24 4 38 28 32 42H16L10 28ZM24 4V25M24 31V42M16 42H32"/><circle cx="24" cy="28" r="3"/></symbol>
  <symbol id="icon-laurels" viewBox="0 0 48 48"><path d="M23 43C9 36 6 22 12 7M25 43C39 36 42 22 36 7M11 15C5 13 4 8 6 4 11 6 14 10 11 15ZM9 25C3 24 1 20 2 16 8 16 11 20 9 25ZM14 35C7 36 3 32 3 28 9 26 13 29 14 35ZM37 15C43 13 44 8 42 4 37 6 34 10 37 15ZM39 25C45 24 47 20 46 16 40 16 37 20 39 25ZM34 35C41 36 45 32 45 28 39 26 35 29 34 35Z"/></symbol>
  <symbol id="icon-ticket" viewBox="0 0 48 48"><path d="M5 12H43V20C34 20 34 28 43 28V36H5V28C14 28 14 20 5 20ZM17 19H26M17 29H26"/><path d="M32 16V32" stroke-dasharray="3 4"/></symbol>
  <symbol id="icon-globe" viewBox="0 0 48 48"><circle cx="24" cy="24" r="19"/><ellipse cx="24" cy="24" rx="8" ry="19"/><path d="M5 24H43M8 14C18 20 30 20 40 14M8 34C18 28 30 28 40 34"/></symbol>
  <symbol id="icon-developer" viewBox="0 0 100 100"><path d="M30 24 7 50 30 76M70 24 93 50 70 76M61 15 39 85"/></symbol>
  <symbol id="icon-viewer" viewBox="0 0 100 100"><path d="M20 12H80L98 38 50 92 2 38ZM2 38H98M20 12 32 38 50 92 68 38 80 12"/><path d="M43 43 63 55 43 67Z"/></symbol>
`;
html = html.replace('</defs></svg>', icons + '</defs></svg>');

const gap = old[5]
  .replace('<span>RATINGS</span>', '<span>AUDIENCE</span>')
  .replace('Test stability, diversity<br>and score costs', 'Test stability, diversity<br>and average score loss');

const innovation = `<section class="slide system" data-title="The Diamond Mine system" data-speaker="3" data-section="Innovation" aria-labelledby="title-7">
      <p class="eyebrow">02 / INNOVATION</p><h2 id="title-7">A framework with five criteria</h2>
      <svg class="system-map" viewBox="0 0 1420 450" role="img" aria-label="Five evidence streams join a proposed route through Bayesian rating and diversity optimization to a proposed Top 10.">
        <g class="evidence-icons"><use href="#icon-audience" x="0" y="12" width="48" height="48"/><use href="#icon-critics" x="0" y="92" width="48" height="48"/><use href="#icon-laurels" x="0" y="172" width="48" height="48"/><use href="#icon-ticket" x="0" y="252" width="48" height="48"/><use href="#icon-globe" x="0" y="332" width="48" height="48"/></g>
        <g class="system-labels"><text x="70" y="45">Public opinion</text><text x="70" y="125">Professional critics</text><text x="70" y="205">Awards & recognition</text><text x="70" y="285">Economic performance</text><text x="70" y="365">Cultural influence</text></g>
        <g class="track-bed"><path d="M440 50H635C750 50 700 210 850 210H1415M440 130H650C750 130 750 210 850 210M440 210H850M440 290H650C750 290 750 210 850 210M440 370H635C750 370 700 210 850 210"/></g>
        <g class="track-core"><path d="M440 50H635C750 50 700 210 850 210H1415M440 130H650C750 130 750 210 850 210M440 210H850M440 290H650C750 290 750 210 850 210M440 370H635C750 370 700 210 850 210"/></g>
        <g class="track-energy"><path d="M440 50H635C750 50 700 210 850 210H1415M440 130H650C750 130 750 210 850 210M440 210H850M440 290H650C750 290 750 210 850 210M440 370H635C750 370 700 210 850 210"/></g>
        <g class="evidence-carts"><use href="#cart" x="535" y="16" width="42" height="32" class="cart-gold"/><use href="#cart" x="575" y="96" width="42" height="32" class="cart-red"/><use href="#cart" x="520" y="176" width="42" height="32" class="cart-amber"/><use href="#cart" x="575" y="256" width="42" height="32" class="cart-green"/><use href="#cart" x="535" y="336" width="42" height="32" class="cart-cyan"/></g>
        <circle cx="850" cy="210" r="13" class="node"/>
        <g class="processing-stations"><circle cx="1020" cy="210" r="8"/><circle cx="1250" cy="210" r="8"/></g>
        <g class="system-phase-labels"><text x="1020" y="122">Bayesian<tspan x="1020" dy="33">rating</tspan></text><text x="1250" y="122">Diversity<tspan x="1250" dy="33">optimization</tspan></text></g>
        <use href="#gem" x="1387" y="197" width="28" height="27" class="system-target"/>
        <text x="1400" y="274" class="system-output">Proposed Top 10</text>
      </svg>
    </section>`;

const bayesian = `<section class="slide phase phase-one david-bayesian" data-title="Phase 1: Bayesian Weighted Rating" data-speaker="3" data-section="Innovation" aria-labelledby="title-8">
      <p class="eyebrow">PHASE 01 / ESTIMATE</p><h2 id="title-8">Bayesian <em>Weighted Rating</em></h2>
      <svg class="bayesian-mine" viewBox="0 0 1420 420" role="img" aria-label="Conceptual illustration: rough film evidence enters a balance that combines evidence and prior information, producing an initial ranking of polished diamonds. Diamond sizes are illustrative, not calculated scores.">
        <g class="bayesian-station-labels"><text x="195" y="24">INPUT</text><text x="710" y="24">ESTIMATION</text><text x="1230" y="24">INITIAL RANKING</text></g>
        <g class="track-bed"><path d="M363 210H452M968 210H1040"/></g><g class="track-core"><path d="M363 210H452M968 210H1040"/></g><g class="track-energy"><path d="M363 210H452M968 210H1040"/></g>
        <g class="raw-minerals"><use href="#ore" x="35" y="153" width="100" height="95"/><use href="#ore" x="145" y="167" width="100" height="95"/><use href="#ore" x="255" y="148" width="100" height="95"/></g>
        <g class="balance-linework">
          <path d="M710 98V310M675 330 710 300 745 330ZM650 344H770"/><circle cx="710" cy="93" r="6"/>
          <g class="balance-motion"><path d="M540 110H880M540 110 492 230M540 110 588 230M880 110 832 230M880 110 928 230M485 230Q540 300 595 230ZM825 230Q880 300 935 230Z"/><circle cx="710" cy="110" r="7"/>
            <path d="M522 208 535 188 552 195 562 216 542 225ZM535 188 542 225M522 208 552 195M863 225 869 198H891L897 225ZM873 198V191Q880 182 887 191V198"/>
          </g>
        </g>
        <g class="scale-labels"><text x="540" y="309">Evidence</text><text x="880" y="309">Prior</text></g>
        <g class="polished-minerals"><use href="#gem" x="1060" y="148" width="100" height="95"/><use href="#gem" x="1180" y="167" width="80" height="76" style="stroke-width:3px"/><use href="#gem" x="1280" y="186" width="60" height="57" style="stroke-width:4px"/></g>
        <path class="mineral-spark" d="M1155 126V140M1148 133H1162M1271 154V166M1265 160H1277"/>
      </svg>
      <p class="bayesian-summary">Less evidence gives the prior more influence.</p>
    </section>`;

const maturity = `<section class="slide maturity david-maturity" data-title="Applications and maturity" data-speaker="3" data-section="Description" aria-labelledby="title-11">
      <p class="eyebrow">APPLICATIONS & MATURITY</p><h2 id="title-11">A concept ready to be tested</h2>
      <div class="beneficiary-roles">
        <div><svg class="beneficiary-icon" viewBox="0 0 100 100" aria-hidden="true"><use href="#icon-developer"/></svg><div><span class="technical-label">FOR DEVELOPERS</span><h3>A reproducible procedure</h3></div></div>
        <div><svg class="beneficiary-icon" viewBox="0 0 100 100" aria-hidden="true"><use href="#icon-viewer"/></svg><div><span class="technical-label">FOR USERS</span><h3>An explainable entry point</h3></div></div>
      </div>
      <div class="readiness-route">
        <svg class="readiness-rail" viewBox="0 0 1000 160" aria-hidden="true"><path class="track-bed" d="M210 88H745"/><path class="track-core" d="M210 88H745"/><path class="track-energy" d="M210 88H745"/><path class="route-direction" d="M731 78 745 88 731 98"/></svg>
        <div class="readiness-current"><span>CURRENT</span><strong>TRL <em>2</em></strong><p>Concept</p></div>
        <div class="readiness-next"><span>NEXT OBJECTIVE</span><strong>TRL <em>3</em></strong><p>Proof of concept <sup>[9]</sup></p></div>
      </div>
    </section>`;

const datasets = old[16].replace(/<p class="dataset-scope">[\s\S]*?<\/p>/,
  '<p class="dataset-scope">Scope: 1920–2023. Excludes series, documentaries and short films.<br>Record counts, matching rules and source access remain to be assessed.</p>');
const architecture = old[9]
  .replace('class="slide architecture"', 'class="slide architecture reference-architecture"')
  .replace('data-title="The complete process" data-speaker="3" data-section="Description"', 'data-title="System architecture" data-speaker="Appendix" data-section="Architecture" data-appendix="architecture"')
  .replace('03 / DESCRIPTION', 'SUPPORTING MATERIAL');

const revised = [...old.slice(0,5),gap,innovation,bayesian,old[8],maturity,...old.slice(11,16),datasets,architecture];
if (revised.length !== 17 || revised[8] !== old[8]) throw new Error('Slide sequence or preserved diversity slide changed');
const currentMatches = [...html.matchAll(/<section\b[\s\S]*?<\/section>/g)];
const first = currentMatches[0].index;
const last = currentMatches[currentMatches.length-1];
html = html.slice(0,first) + revised.join('\n\n    ') + html.slice(last.index+last[0].length);

const chapterStarts = new Set([0,3,6,10]);
const main = revised.slice(0,13);
const buttons = main.map((section,index)=>{
  const title = /data-title="([^"]+)"/.exec(section)[1];
  return '<button class="station'+(chapterStarts.has(index)?' chapter-station':'')+'" data-go="'+index+'" aria-label="Slide '+(index+1)+': '+title+'"></button>';
}).join('');
html = html.replace(/<span class="rail-line" aria-hidden="true"><\/span>[\s\S]*?(?=<svg id="progress-cart")/,
  '<span class="rail-line" aria-hidden="true"></span>\n      '+buttons+'\n      ');
html = html.replace('id="slide-count">01 / 14','id="slide-count">01 / 13');
fs.writeFileSync('index.html',html);
console.log('Applied David layouts: 13 main slides, 4 supporting appendices. Kept slide 9 exactly unchanged.');
