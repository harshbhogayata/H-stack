// Issue #7: eval runs may render a local page through one allowlisted script, nothing wider.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SHOT_ALLOW, SHOT_HINT, browserArgs, browserCandidates } from '../../../../evals/screenshot.mjs';

const EVALS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../evals');

test('allow entry names exactly the screenshot script', () => {
  assert.match(SHOT_ALLOW, /^Bash\(node [^"]*\/evals\/screenshot\.mjs:\*\)$/);
  assert.ok(SHOT_HINT.includes('evals/screenshot.mjs'));
});

test('design-capable runners put the entry in their allowed-tools list and the hint in the prompt', () => {
  for (const f of ['skill-bench.mjs', 'sameness.mjs']) {
    const src = fs.readFileSync(path.join(EVALS, f), 'utf8');
    assert.match(src, /const TOOLS = \[[^\]]*SHOT_ALLOW\]/, `${f} TOOLS`);
    assert.match(src, /--allowedTools[^;]*\.\.\.TOOLS/, `${f} passes TOOLS`);
    assert.ok(src.includes('${SHOT_HINT}'), `${f} prompt hint`);
  }
});

test('browser arguments are headless, write one PNG and open one file URL', () => {
  const a = browserArgs(path.resolve('page.html'), path.resolve('o.png'), 'prof');
  assert.ok(a.includes('--headless=new'));
  assert.ok(a.some((x) => x.startsWith('--screenshot=') && x.endsWith('o.png')));
  assert.ok(a.at(-1).startsWith('file:///'));
});

test('candidates exist for windows, macos and linux', () => {
  for (const p of ['win32', 'darwin', 'linux']) assert.ok(browserCandidates(p, { ProgramFiles: 'C:\P', LOCALAPPDATA: 'C:\L' }).length > 0);
});
