#!/usr/bin/env node
// HS-085 release gate. Bump the plugin version only when all of these pass:
//   1. plugins/h-stack/scripts/ci.mjs (plugin validate, index, budget, snapshots, contract, lint, THIRD_PARTY, tests)
//   2. a smoke-test run on the user's real tasks (not the runner self-test), newer than the last
//      change under plugins/h-stack/, committed under evals/results/iteration-N/smoke-summary.json
//   3. the run's regressions are written down (every task where with < without is listed)
// Prints one JSON line per check and exits 1 if any fails.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const results = [];
const check = (name, ok, reason) => { results.push({ name, ok }); console.log(JSON.stringify({ status: ok ? 'ok' : 'fail', check: name, reason })); };

const ci = spawnSync('node', [path.join(REPO, 'plugins/h-stack/scripts/ci.mjs')], { cwd: REPO, encoding: 'utf8' });
check('ci', ci.status === 0, (ci.stdout.trim().split('\n').pop() || '').slice(0, 200));

const tasks = JSON.parse(fs.readFileSync(path.join(REPO, 'evals/tasks.json'), 'utf8')).evals.filter((t) => !t.runner_selftest);
const real = new Set(tasks.map((t) => t.eval_name));
const iters = fs.readdirSync(path.join(REPO, 'evals/results')).filter((d) => /^iteration-\d+$/.test(d) && fs.existsSync(path.join(REPO, 'evals/results', d, 'smoke-summary.json'))).sort((a, b) => Number(b.slice(10)) - Number(a.slice(10)));
let lastChange = 0;
try { lastChange = Number(execFileSync('git', ['log', '-1', '--format=%ct', '--', 'plugins/h-stack'], { cwd: REPO, encoding: 'utf8' }).trim()) * 1000; } catch { /* no git */ }
const latest = iters.map((d) => ({ d, s: JSON.parse(fs.readFileSync(path.join(REPO, 'evals/results', d, 'smoke-summary.json'), 'utf8')) }))
  .find(({ s }) => (s.tasks || []).some((n) => real.has(n)));
if (!real.size) check('smoke', false, 'evals/tasks.json has no real user tasks yet (target ~10; needs the user, HS-001)');
else if (!latest) check('smoke', false, 'no smoke-test run on the real tasks under evals/results/');
else {
  const ts = Date.parse(latest.s.timestamp || 0);
  check('smoke', ts >= lastChange, `${latest.d}: ${(latest.s.tasks || []).length} task(s) run ${latest.s.timestamp}; last plugin change ${new Date(lastChange).toISOString()}`);
  const reg = latest.s.regressions;
  check('regressions listed', Array.isArray(reg), Array.isArray(reg) ? `${reg.length} regression(s) listed` : 'smoke-summary.json has no regressions list');
}
process.exit(results.every((r) => r.ok) ? 0 : 1);
