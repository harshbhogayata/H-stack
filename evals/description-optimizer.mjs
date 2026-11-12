#!/usr/bin/env node
// HS-002 / HS-008 description optimisation, following skill-creator's method in zero-dependency
// Node (its own scripts are not run here: auto mode blocks running downloaded code).
//
// What is measured: native triggering from the skill listing alone. Every run is `claude -p` with
// the plugin and all hooks disabled (--settings {"disableAllHooks":true}), so H-Stack's classifier
// plays no part; a query "triggers" a skill when Claude calls the Skill tool for it.
//
// Method (skill-creator "Description Optimization"):
//   1. Queries: tests/triggers/*.json should / should_not sets per skill.
//   2. Split each skill's queries 60% train / 40% held-out (seeded, stratified).
//   3. Run every query RUNS times with the current descriptions; a should query passes when it
//      triggers in at least half the runs, a should_not query when it triggers in under half.
//   4. For each skill with train failures, Claude proposes a new description + when_to_use from
//      the failures (use case first, factual, combined cap 1,536 chars, listing budget kept).
//   5. The candidate is re-run on that skill's queries. Kept only if held-out accuracy does not
//      drop and train or held-out accuracy rises. Up to ITERS rounds per skill.
//
//   node evals/description-optimizer.mjs [--runs 2] [--iters 2] [--parallel 8] [--skill name ...] [--apply]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { splitFrontmatter } from '../plugins/h-stack/lib/yaml.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLUGIN = path.join(REPO, 'plugins', 'h-stack');
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(`--${k}`); return i >= 0 ? a[i + 1] : d; };
const RUNS = Number(opt('runs', 2));
const ITERS = Number(opt('iters', 2));
const PAR = Number(opt('parallel', 8));
const ONLY = a.flatMap((x, i) => (x === '--skill' ? [a[i + 1]] : []));
const APPLY = a.includes('--apply');
const CAP = 1536;

const sets = {};
for (const f of fs.readdirSync(path.join(PLUGIN, 'tests', 'triggers'))) Object.assign(sets, JSON.parse(fs.readFileSync(path.join(PLUGIN, 'tests', 'triggers', f), 'utf8')));
const skillsAll = Object.keys(sets).map((q) => q.replace('h-stack:', '')).filter((s) => fs.existsSync(path.join(PLUGIN, 'skills', s, 'SKILL.md')));
const skills = ONLY.length ? skillsAll.filter((s) => ONLY.includes(s)) : skillsAll;

// Seeded split.
function rng(seed) { let x = seed; return () => { x = (x * 1103515245 + 12345) % 2147483648; return x / 2147483648; }; }
function split(list, seed) { const r = rng(seed); const s = [...list].sort(() => r() - 0.5); const k = Math.max(1, Math.round(s.length * 0.6)); return { train: s.slice(0, k), held: s.slice(k) }; }
const queries = {};
skills.forEach((s, i) => {
  const set = sets[`h-stack:${s}`];
  const sh = split(set.should, 17 + i); const sn = split(set.should_not, 91 + i);
  queries[s] = [...sh.train.map((q) => ({ q, expect: true, part: 'train' })), ...sh.held.map((q) => ({ q, expect: true, part: 'held' })), ...sn.train.map((q) => ({ q, expect: false, part: 'train' })), ...sn.held.map((q) => ({ q, expect: false, part: 'held' }))];
});

function readFm(skill) { const md = fs.readFileSync(path.join(PLUGIN, 'skills', skill, 'SKILL.md'), 'utf8'); return { md, data: splitFrontmatter(md).data }; }
const q2 = (s) => JSON.stringify(String(s));
function withFrontmatter(md, desc, wtu) {
  return md.replace(/^description: .*$/m, `description: ${q2(desc)}`).replace(/^when_to_use: .*$/m, `when_to_use: ${q2(wtu)}`);
}

// A temp copy of the plugin, optionally with one skill's description replaced.
function pluginCopy(override) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hs-desc-'));
  fs.cpSync(PLUGIN, dir, { recursive: true, filter: (src) => !/\/(evals\/results|node_modules)(\/|$)/.test(src) });
  if (override) { const f = path.join(dir, 'skills', override.skill, 'SKILL.md'); fs.writeFileSync(f, withFrontmatter(fs.readFileSync(f, 'utf8'), override.description, override.when_to_use)); }
  return dir;
}

function claudeRun(argv, cwd, timeoutMs = 120000) {
  return new Promise((resolve) => {
    const p = spawn('claude', argv, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = ''; p.stdout.on('data', (d) => { out += d; });
    const t = setTimeout(() => p.kill('SIGTERM'), timeoutMs);
    p.on('close', () => { clearTimeout(t); resolve(out); });
  });
}
async function triggers(pluginDir, q) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'hs-q-'));
  const out = await claudeRun(['-p', q, '--plugin-dir', pluginDir, '--settings', '{"disableAllHooks":true}', '--output-format', 'stream-json', '--verbose', '--max-turns', '1', '--allowedTools', 'Skill'], cwd);
  fs.rmSync(cwd, { recursive: true, force: true });
  const hit = new Set();
  for (const line of out.split('\n')) { try { const j = JSON.parse(line); for (const b of j.message?.content || []) if (b.type === 'tool_use' && b.name === 'Skill') hit.add(String(b.input?.skill || '').replace(/^h-stack:/, '')); } catch { /* skip */ } }
  return hit;
}
async function pool(jobs) { const res = new Array(jobs.length); let i = 0; await Promise.all(Array.from({ length: PAR }, async () => { while (i < jobs.length) { const k = i++; res[k] = await jobs[k](); } })); return res; }

// rate[q][skill] = fraction of runs where q triggered skill
async function measure(pluginDir, qs) {
  const uniq = [...new Set(qs)];
  const jobs = uniq.flatMap((q) => Array.from({ length: RUNS }, () => async () => ({ q, hit: await triggers(pluginDir, q) })));
  const res = await pool(jobs);
  const rate = {};
  for (const r of res) { rate[r.q] ||= {}; for (const s of r.hit) rate[r.q][s] = (rate[r.q][s] || 0) + 1 / RUNS; }
  return rate;
}
function score(skill, rate) {
  const by = { train: [0, 0], held: [0, 0] }; const fails = [];
  for (const x of queries[skill]) {
    const r = (rate[x.q] || {})[skill] || 0;
    const ok = x.expect ? r >= 0.5 : r < 0.5;
    by[x.part][0] += ok ? 1 : 0; by[x.part][1] += 1;
    if (!ok && x.part === 'train') fails.push({ q: x.q, expect: x.expect, rate: +r.toFixed(2) });
  }
  return { train: +(by.train[0] / by.train[1]).toFixed(2), held: +(by.held[0] / (by.held[1] || 1)).toFixed(2), fails };
}

async function propose(skill, cur, fails) {
  const prompt = `You are tuning the description of a Claude Code skill so Claude invokes it for the right requests and not for others. Claude sees only the name, description and when_to_use in its skill list.

Skill: h-stack:${skill}
Current description: ${cur.description}
Current when_to_use: ${cur.when_to_use || ''}

Misclassified training queries (expect=true means the skill should have been invoked):
${fails.map((f) => `- expect=${f.expect} (triggered in ${Math.round(f.rate * 100)}% of runs): ${f.q}`).join('\n')}

Rewrite both fields. Rules: lead the description with the use case; put trigger phrases and example requests in when_to_use; plain factual wording, no imperatives or all-caps; generalise from the failures instead of quoting them; description + when_to_use together at most ${Math.min(CAP, (cur.description.length + (cur.when_to_use || '').length) + 40)} characters. Reply with JSON only: {"description": "...", "when_to_use": "..."}`;
  const out = await claudeRun(['-p', prompt, '--output-format', 'json', '--max-turns', '1', '--tools', ''], os.tmpdir(), 180000);
  try { const j = JSON.parse(out); const m = String(j.result || '').match(/\{[\s\S]*\}/); const c = JSON.parse(m[0]); const limit = Math.min(CAP, cur.description.length + (cur.when_to_use || '').length + 40); if (c.description && (c.description + (c.when_to_use || '')).length <= limit) return c; } catch { /* bad reply */ }
  return null;
}

const t0 = Date.now();
const base = pluginCopy(null);
const allQ = skills.flatMap((s) => queries[s].map((x) => x.q));
process.stderr.write(`baseline: ${new Set(allQ).size} queries x ${RUNS} runs\n`);
const baseRate = await measure(base, allQ);
fs.rmSync(base, { recursive: true, force: true });
const report = { method: 'skill-creator description optimisation (60/40 split, hooks disabled, native triggering)', runs_per_query: RUNS, iterations: ITERS, skills: {} };
for (const s of skills) {
  const cur = readFm(s).data;
  let best = { description: cur.description, when_to_use: cur.when_to_use || '', ...score(s, baseRate) };
  const entry = { baseline: { train: best.train, held: best.held, fails: best.fails }, candidates: [] };
  for (let it = 0; it < ITERS && best.fails.length; it++) {
    const cand = await propose(s, best, best.fails);
    if (!cand) { entry.candidates.push({ iteration: it + 1, error: 'no valid proposal' }); break; }
    const dir = pluginCopy({ skill: s, ...cand });
    const r = score(s, await measure(dir, queries[s].map((x) => x.q)));
    fs.rmSync(dir, { recursive: true, force: true });
    const keep = r.held >= best.held && (r.train > best.train || r.held > best.held);
    entry.candidates.push({ iteration: it + 1, description: cand.description, when_to_use: cand.when_to_use, train: r.train, held: r.held, kept: keep });
    process.stderr.write(`${s} iter ${it + 1}: train ${best.train}->${r.train} held ${best.held}->${r.held} ${keep ? 'KEPT' : 'rejected'}\n`);
    if (keep) best = { ...cand, ...r };
  }
  entry.final = { train: best.train, held: best.held, changed: best.description !== cur.description };
  if (entry.final.changed) entry.final.description = best.description, entry.final.when_to_use = best.when_to_use;
  report.skills[s] = entry;
  if (APPLY && entry.final.changed) { const f = path.join(PLUGIN, 'skills', s, 'SKILL.md'); fs.writeFileSync(f, withFrontmatter(fs.readFileSync(f, 'utf8'), best.description, best.when_to_use)); }
}
report.seconds = Math.round((Date.now() - t0) / 1000);
const outDir = path.join(REPO, 'evals', 'results', 'description-optimizer');
fs.mkdirSync(outDir, { recursive: true });
const file = path.join(outDir, `${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`);
fs.writeFileSync(file, JSON.stringify(report, null, 2));
for (const [s, e] of Object.entries(report.skills)) console.log(`${s.padEnd(16)} train ${e.baseline.train} -> ${e.final.train}  held ${e.baseline.held} -> ${e.final.held}  ${e.final.changed ? 'description changed' : 'unchanged'}`);
console.log(`report: ${path.relative(REPO, file)}`);
