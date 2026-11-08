/* Resolve an installed Playwright and browser without pinning a runtime version. */
const fs = require('node:fs');
const path = require('node:path');

function loadPlaywright() {
  try { return require('playwright'); } catch (_) {}
  const candidates = [];
  if (process.env.PLAYWRIGHT_MODULE_PATH) candidates.push(process.env.PLAYWRIGHT_MODULE_PATH);
  const apps = path.join(process.env.ProgramFiles || 'C:/Program Files', 'WindowsApps');
  try {
    fs.readdirSync(apps).filter((name) => /^OpenAI\.CodexPrimaryRuntime\./.test(name)).sort().reverse().forEach((name) => {
      candidates.push(path.join(apps, name, 'dependencies/node/node_modules/playwright'));
    });
  } catch (_) {}
  if (process.env.USERPROFILE) candidates.push(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
  for (const candidate of candidates) {
    try { return require(candidate); } catch (_) {}
  }
  throw new Error('Playwright not found. Install it locally or set PLAYWRIGHT_MODULE_PATH to its package directory.');
}

function browserExecutable() {
  const choices = [
    process.env.PLAYWRIGHT_BROWSER_EXECUTABLE,
    path.join(process.env.ProgramFiles || 'C:/Program Files', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env['ProgramFiles(x86)'] || 'C:/Program Files (x86)', 'Google/Chrome/Application/chrome.exe'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
  ].filter(Boolean);
  return choices.find((candidate) => fs.existsSync(candidate));
}

module.exports = { ...loadPlaywright(), browserExecutable };
