"""Apply the one-time structural refinement to the existing local HTML deck."""
from pathlib import Path
import re

root = Path(__file__).resolve().parent.parent
target = root / 'index.html'
markup = target.read_text(encoding='utf-8')

# Keep main slides free of boilerplate footer paragraphs. Full citations remain
# in rehearsal notes, inline reference markers and the reference library.
def clean_main(match):
    section = match.group(0)
    if 'class="slide references"' in section or 'class="slide dataset-plan"' in section:
        return section
    return re.sub(r'\s*<p class="citation">.*?</p>', '', section, flags=re.S)

markup = re.sub(r'<section class="slide\b.*?</section>', clean_main, markup, flags=re.S)

# The highlight sits in the dark centre between the two copper rails.
def add_group_highlight(match):
    return match.group(0) + '\n        <g class="track-energy">' + match.group(1) + '</g>'

if 'class="track-energy"' not in markup:
    markup = re.sub(r'<g class="track-core">(.*?)</g>', add_group_highlight, markup, flags=re.S)
    markup = re.sub(r'<path class="track-core[^\"]*"[^>]+/>',
                    lambda m: m.group(0) + m.group(0).replace(re.search(r'class="[^\"]*"', m.group(0)).group(0), 'class="track-energy"'), markup)
    connection = '<g class="track-energy connection-flow"><path d="M0 30H475C665 30 650 160 850 160H1420M0 95H475C665 95 650 160 850 160M0 160H850M0 225H475C665 225 650 160 850 160M0 290H475C665 290 650 160 850 160"/></g>'
    markup = markup.replace('    <g class="end-stops">', '    ' + connection + '\n    <g class="end-stops">', 1)

if 'id="cinema-clapper"' not in markup:
    snippet = (root / 'qa' / 'cinema-markup.html').read_text(encoding='utf-8')
    snippet = re.sub(r'\s*<!--.*?-->\s*', '', snippet, flags=re.S)
    markup = markup.replace('  <footer class="deck-footer">', '\n  ' + snippet + '\n  <footer class="deck-footer">', 1)

if 'class="utility-controls"' not in markup:
    markup = markup.replace('<div class="deck-controls"><button id="overview-toggle"', '<div class="deck-controls"><div class="utility-controls"><button id="overview-toggle"', 1)
    markup = markup.replace('<span class="control-divider"></span>', '</div><span class="control-divider"></span>', 1)

target.write_text(markup, encoding='utf-8')
print('Refined markup: citations, rail highlights, cinema slate and restrained controls.')
