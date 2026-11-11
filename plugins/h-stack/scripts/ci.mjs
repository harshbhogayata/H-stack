#!/usr/bin/env node
// H-Stack CI (ARCHITECTURE §7.5): validate, index, budget, snapshots, contract, lint,
// THIRD_PARTY, lesson validator and findings validator tests, mod tests. Exits non-zero on any failure.
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const REPO = path.resolve(ROOT, '..', '..');
const steps = [
  ['plugin validate', 'claude', ['plugin', 'validate', REPO], { optional: true }],
  ['index current (HS-015)', 'node', [path.join(ROOT, 'scripts/gen-index.mjs'), '--check']],
  ['Model Experience note current (HS-010)', 'node', [path.join(ROOT, 'scripts/model-experience.mjs'), '--check']],
  ['context budget (HS-010)', 'node', [path.join(ROOT, 'scripts/budget.mjs')]],
  ['snapshots (HS-011)', 'node', [path.join(ROOT, 'scripts/snapshot.mjs')]],
  ['hook contract (HS-012)', 'node', [path.join(ROOT, 'scripts/contract.mjs')]],
  ['lint (HS-013)', 'node', [path.join(ROOT, 'scripts/lint.mjs')]],
  ['THIRD_PARTY (HS-083)', 'node', [path.join(ROOT, 'scripts/third-party.mjs')]],
  ['egress inventory (HS-014)', 'node', [path.join(ROOT, 'scripts/egress.mjs')]],
  ['unit + validator tests (HS-049, HS-062)', 'node', ['--test', ...fs.readdirSync(path.join(ROOT, 'tests/unit')).filter((f) => f.endsWith('.test.mjs')).map((f) => path.join(ROOT, 'tests/unit', f))]],
];
if (fs.existsSync(path.join(ROOT, 'hooks', 'register.js'))) steps.push(['mod tests (claude plugin test)', 'claude', ['plugin', 'test'], { cwd: ROOT, optional: true }]);
if (fs.existsSync(path.join(REPO, 'evals', 'check-tasks.mjs'))) steps.push(['smoke-test task file (HS-001)', 'node', [path.join(REPO, 'evals', 'check-tasks.mjs')]]);

let failed = 0;
const lines = [];
for (const [name, cmd, args, opts = {}] of steps) {
  const t0 = Date.now();
  const r = spawnSync(cmd, args, { cwd: opts.cwd || REPO, encoding: 'utf8', timeout: 600000 });
  const ms = Date.now() - t0;
  if (r.error && opts.optional) { lines.push(`SKIP ${name}: ${cmd} not available`); continue; }
  const out = `${r.stdout || ''}${r.stderr || ''}`.trim();
  const ok = r.status === 0;
  if (!ok) failed++;
  const summary = out.split('\n').find((l) => l.startsWith('{"status"')) || out.split('\n').filter((l) => /pass|fail|Validation|✔|√|tests?/.test(l)).slice(-2).join(' | ');
  lines.push(`${ok ? 'PASS' : 'FAIL'} ${name} (${ms} ms): ${summary.slice(0, 220)}`);
  if (!ok) lines.push(out.split('\n').slice(-12).map((l) => '     ' + l).join('\n'));
}
console.log(lines.join('\n'));
console.log(JSON.stringify({ status: failed ? 'fail' : 'ok', reason: `${steps.length - failed}/${steps.length} CI steps passed` }));
process.exit(failed ? 1 : 0);
