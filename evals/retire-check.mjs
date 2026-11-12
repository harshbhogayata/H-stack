#!/usr/bin/env node
// HS-006: after re-running every skill's benchmark on a new model, list the skills the base
// model now passes without. Those are retirement candidates: the skill costs context and the
// measurement shows no gain. Reads the latest evals/results/skills/<skill>/iteration-N/benchmark.json.
//   node evals/retire-check.mjs [--threshold 1.0] [--json]
// Exit 0 always; this reports, the release notes record the decision.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(REPO, 'evals', 'results', 'skills');
const args = process.argv.slice(2);
const th = Number(args[args.indexOf('--threshold') + 1] || 1.0) || 1.0;
const out = [];
for (const skill of fs.existsSync(dir) ? fs.readdirSync(dir).sort() : []) {
  if (!fs.statSync(path.join(dir, skill)).isDirectory()) continue;
  const its = fs.readdirSync(path.join(dir, skill)).filter((d) => /^iteration-\d+$/.test(d) && fs.existsSync(path.join(dir, skill, d, 'benchmark.json'))).sort((a, b) => Number(b.slice(10)) - Number(a.slice(10)));
  if (!its.length) continue;
  const b = JSON.parse(fs.readFileSync(path.join(dir, skill, its[0], 'benchmark.json'), 'utf8'));
  const w = b.run_summary.with_skill.pass_rate.mean; const wo = b.run_summary.without_skill.pass_rate.mean;
  const verdict = wo >= th && w <= wo ? 'retire-candidate (base model passes without; no gain)'
    : wo >= th ? 'ceiling (base passes; skill ties or better: harden the evals before deciding)'
    : w < wo ? 'drop (worse than no skill)' : 'keep';
  out.push({ skill, iteration: its[0], with: w, without: wo, model: b.metadata.executor_model, verdict });
}
if (args.includes('--json')) console.log(JSON.stringify(out, null, 2));
else for (const r of out) console.log(`${r.skill.padEnd(16)} ${r.iteration.padEnd(12)} with ${r.with.toFixed(2)} without ${r.without.toFixed(2)}  ${r.verdict}`);
