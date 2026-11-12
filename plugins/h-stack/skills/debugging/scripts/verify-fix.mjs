#!/usr/bin/env node
// HS-066 counterfactual fix proof and HS-067 repro harvest.
//   node verify-fix.mjs [--harvest <repro command>] -- <test command>
// Temporarily reverts the uncommitted non-test changes (the fix), runs the test command and
// expects it to FAIL; restores the fix and expects it to PASS. Test files stay as they are.
// With --harvest, the same flip is checked for a throwaway reproduction command, and a passing
// flip means it is worth offering as a regression test. Output: one JSON {status, reason, ...}.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const { isTestPath } = await import(new URL('../../../lib/tests.mjs', import.meta.url));
const { loadConfig } = await import(new URL('../../../lib/core.mjs', import.meta.url));

const argv = process.argv.slice(2);
const dd = argv.indexOf('--');
const harvestIdx = argv.indexOf('--harvest');
const harvest = harvestIdx >= 0 ? argv[harvestIdx + 1] : null;
const testCmd = dd >= 0 ? argv.slice(dd + 1).join(' ') : '';
const out = (o) => { console.log(JSON.stringify(o)); process.exit(o.status === 'ok' ? 0 : 1); };
if (!testCmd) out({ status: 'error', reason: 'usage: verify-fix.mjs [--harvest "<repro cmd>"] -- <test command>' });

const proj = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const git = (...a) => execFileSync('git', ['-C', proj, ...a], { encoding: 'utf8' });
let changed;
try {
  changed = [...git('diff', '--name-only', 'HEAD').split('\n'), ...git('ls-files', '--others', '--exclude-standard').split('\n')].filter(Boolean);
} catch { out({ status: 'error', reason: 'not a git repository with a HEAD commit' }); }
const config = loadConfig(proj);
const fixFiles = [...new Set(changed)].filter((p) => !isTestPath(p, proj, config));
if (!fixFiles.length) out({ status: 'error', reason: 'no uncommitted non-test changes to verify (commit nothing yet, or the fix is only in tests)' });

const run = (cmd) => spawnSync('bash', ['-c', cmd], { cwd: proj, encoding: 'utf8', timeout: 600000, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
const backup = fs.mkdtempSync(path.join(os.tmpdir(), 'hs-verify-fix-'));
const tracked = new Set(git('ls-files').split('\n').filter(Boolean));
for (const p of fixFiles) {
  const src = path.join(proj, p);
  if (fs.existsSync(src)) { fs.mkdirSync(path.dirname(path.join(backup, p)), { recursive: true }); fs.copyFileSync(src, path.join(backup, p)); const st = fs.statSync(src); fs.utimesSync(path.join(backup, p), st.atime, st.mtime); }
}
let without; let withFix; let hWithout = null; let hWith = null;
try {
  for (const p of fixFiles) {
    if (tracked.has(p)) git('checkout', 'HEAD', '--', p);
    else fs.rmSync(path.join(proj, p), { force: true });
  }
  without = run(testCmd);
  if (harvest) hWithout = run(harvest);
} finally {
  for (const p of fixFiles) {
    const b = path.join(backup, p);
    if (fs.existsSync(b)) { fs.mkdirSync(path.dirname(path.join(proj, p)), { recursive: true }); fs.copyFileSync(b, path.join(proj, p)); const st = fs.statSync(b); fs.utimesSync(path.join(proj, p), st.atime, new Date(Math.max(st.mtimeMs, Date.now()) + 2000)); }
  }
  fs.rmSync(backup, { recursive: true, force: true });
}
withFix = run(testCmd);
if (harvest) hWith = run(harvest);
const tail = (r) => `${r.stdout || ''}${r.stderr || ''}`.trim().split('\n').slice(-3).join(' | ').slice(0, 300);
const flip = without.status !== 0 && withFix.status === 0;
const res = {
  status: flip ? 'ok' : 'fail',
  reason: flip ? `clean fail->pass flip: \`${testCmd}\` exits ${without.status} without the fix and 0 with it`
    : without.status === 0 ? `the test passes even without the fix (${fixFiles.length} file(s) reverted), so it does not prove the fix`
      : `the test still fails with the fix (exit ${withFix.status})`,
  without_fix: { exit: without.status, tail: tail(without) },
  with_fix: { exit: withFix.status, tail: tail(withFix) },
  reverted: fixFiles,
};
if (harvest) {
  const ok = hWithout.status !== 0 && hWith.status === 0;
  res.harvest = { command: harvest, without_fix_exit: hWithout.status, with_fix_exit: hWith.status, offer_as_regression_test: ok };
}
out(res);
