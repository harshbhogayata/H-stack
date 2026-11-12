#!/usr/bin/env node
// Validates evals/tasks.json against the task format in ARCHITECTURE §8.2 (run by CI).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const spec = JSON.parse(fs.readFileSync(path.join(REPO, 'evals', 'tasks.json'), 'utf8'));
const errs = [];
const names = new Set();
for (const t of spec.evals) {
  for (const k of ['id', 'eval_name', 'prompt', 'fixture', 'check', 'expectations']) if (t[k] === undefined) errs.push(`${t.eval_name || t.id}: ${k} missing`);
  if (names.has(t.eval_name)) errs.push(`${t.eval_name}: duplicate name`);
  names.add(t.eval_name);
  if (t.check && !fs.existsSync(path.join(REPO, t.check))) errs.push(`${t.eval_name}: check ${t.check} missing`);
  if (t.fixture?.dir && !fs.existsSync(path.join(REPO, t.fixture.dir))) errs.push(`${t.eval_name}: fixture dir missing`);
  if (!Array.isArray(t.protected_tests)) errs.push(`${t.eval_name}: protected_tests must be a list`);
  if (typeof t.needs_question !== 'boolean') errs.push(`${t.eval_name}: needs_question must be boolean`);
}
const groups = {};
for (const t of spec.evals) if (t.context_group) (groups[t.context_group] ||= []).push(t.eval_name);
for (const [g, n] of Object.entries(groups)) if (n.length !== 2) errs.push(`context_group ${g} needs exactly 2 tasks`);
const real = spec.evals.filter((t) => !t.runner_selftest).length;
console.log(JSON.stringify({ status: errs.length ? 'fail' : 'ok', reason: `${spec.evals.length} task(s) valid in format; ${real} smoke task(s) (target ~10)` }));
for (const e of errs) console.log(e);
process.exit(errs.length ? 1 : 0);
