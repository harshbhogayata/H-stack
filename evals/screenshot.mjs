#!/usr/bin/env node
// The one render command eval runs may use (issue #7): a headless Chrome or Edge screenshot of a
// local HTML file, written as a PNG. Runners allow exactly this script, not a browser or the network.
//   node evals/screenshot.mjs <page.html> <out.png> [width] [height]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SELF = fileURLToPath(import.meta.url);

// The allowlist entry and the sentence runners add to the prompt.
const SELF_POSIX = SELF.split(path.sep).join('/');
export const SHOT_ALLOW = `Bash(node ${SELF_POSIX}:*)`;
export const SHOT_HINT = `To look at an HTML page you made, run: node ${SELF_POSIX} <page.html> <out.png> [width] [height]  (headless browser screenshot of a local file), then Read the PNG.`;

export function browserCandidates(platform = process.platform, env = process.env) {
  if (platform === 'win32') {
    const roots = [env['ProgramFiles(x86)'], env.ProgramFiles, env.LOCALAPPDATA].filter(Boolean);
    return roots.flatMap((r) => [path.join(r, 'Microsoft', 'Edge', 'Application', 'msedge.exe'), path.join(r, 'Google', 'Chrome', 'Application', 'chrome.exe')]);
  }
  if (platform === 'darwin') return ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Chromium.app/Contents/MacOS/Chromium'];
  return ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge', '/usr/bin/microsoft-edge-stable', '/snap/bin/chromium'];
}

export function browserArgs(page, out, profile, w = 1280, h = 900) {
  return ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', `--user-data-dir=${profile}`, `--window-size=${w},${h}`, `--screenshot=${out}`, pathToFileURL(page).href];
}

function main() {
  const [page, out, w, h] = process.argv.slice(2);
  if (!page || !out) { console.error('usage: node evals/screenshot.mjs <page.html> <out.png> [width] [height]'); process.exit(2); }
  const abs = path.resolve(page);
  if (!/\.(html?|svg)$/i.test(abs) || !fs.existsSync(abs)) { console.error('first argument must be an existing local .html, .htm or .svg file'); process.exit(2); }
  const png = path.resolve(out);
  if (!/\.png$/i.test(png)) { console.error('second argument must end in .png'); process.exit(2); }
  const bin = browserCandidates().find((p) => fs.existsSync(p));
  if (!bin) { console.error('no Chrome, Edge or Chromium found'); process.exit(3); }
  const num = (v, d) => (Number.isInteger(Number(v)) && Number(v) >= 200 && Number(v) <= 4000 ? Number(v) : d);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'hs-shot-'));
  try {
    execFileSync(bin, browserArgs(abs, png, profile, num(w, 1280), num(h, 900)), { stdio: 'ignore', timeout: 60000 });
  } catch (e) { console.error(`screenshot failed: ${e.message}`); process.exit(1); } finally { fs.rmSync(profile, { recursive: true, force: true }); }
  if (!fs.existsSync(png)) { console.error('browser ran but wrote no PNG'); process.exit(1); }
  console.log(png);
}

if (process.argv[1] && path.resolve(process.argv[1]) === SELF) main();
