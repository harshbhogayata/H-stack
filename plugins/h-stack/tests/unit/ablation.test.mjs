// HS-006 ablation switch: HSTACK_DISABLE turns named hooks (or all) into no-ops for a measurement run.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HOOK = fileURLToPath(new URL('../../hooks/gate-bash.mjs', import.meta.url));
const run = (env) => {
  const proj = fs.mkdtempSync(path.join(os.tmpdir(), 'hs-abl-'));
  const r = spawnSync('node', [HOOK], { input: JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', session_id: 's1', cwd: proj, tool_input: { command: 'git push --force origin main' } }), env: { ...process.env, CLAUDE_PROJECT_DIR: proj, ...env }, encoding: 'utf8' });
  fs.rmSync(proj, { recursive: true, force: true });
  return r.stdout.trim();
};
test('gate-bash asks on a force push normally', () => { assert.match(run({ HSTACK_DISABLE: '' }), /"permissionDecision":"ask"/); });
test('HSTACK_DISABLE=gate-bash, hooks or all turns it off; other names do not', () => {
  for (const v of ['gate-bash', 'hooks', 'all', 'stop,gate-bash']) assert.equal(run({ HSTACK_DISABLE: v }), '');
  assert.match(run({ HSTACK_DISABLE: 'stop' }), /"permissionDecision":"ask"/);
});
