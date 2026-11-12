#!/usr/bin/env node
// Sameness check (CLAUDE.md "Context over templates", HS-005): the same request in three very
// different project contexts, with and without the skill. Two numbers per skill and arm:
//   fit         share of the context's fit criteria a blind grader finds met. The grader sees the
//               project's own files and the output, never the context's name or the arm.
//   similarity  mean pairwise token Jaccard between the three contexts' outputs (same arm, same
//               run). Lower means the outputs differ; high similarity with low fit means a template.
//   node evals/sameness.mjs [--runs 2] [--parallel 6] [--skill design-ui ...]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// --help prints the header comment; without this guard any unknown flag starts model runs.
if (process.argv.includes('--help') || process.argv.includes('-h')) { const h = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1); console.log(h.slice(0, h.findIndex((l) => !l.startsWith('//'))).map((l) => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(0); }
const DIR = path.join(REPO, 'evals', 'sameness');
const SKILLS = path.join(REPO, 'plugins', 'h-stack', 'skills');
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(`--${k}`); return i >= 0 ? a[i + 1] : d; };
const RUNS = Number(opt('runs', 2));
const PAR = Number(opt('parallel', 6));
const ONLY = a.flatMap((x, i) => (x === '--skill' ? [a[i + 1]] : []));
const spec = JSON.parse(fs.readFileSync(path.join(DIR, 'tasks.json'), 'utf8'));
const TOOLS = ['Read', 'Edit', 'Write', 'Glob', 'Grep', 'Bash(ls:*)', 'Bash(cat:*)', 'Bash(node:*)', 'Bash(git diff:*)', 'Bash(git status:*)', 'Bash(mkdir:*)'];

function run(cmd, argv, cwd, timeout = 600000) {
  return new Promise((resolve) => {
    const p = spawn(cmd, argv, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = ''; p.stdout.on('data', (d) => { out += d; });
    const t = setTimeout(() => p.kill('SIGTERM'), timeout);
    p.on('close', () => { clearTimeout(t); resolve(out); });
  });
}
function workspace(ctx) {
  const ws = fs.mkdtempSync(path.join(os.tmpdir(), 'hs-same-'));
  fs.cpSync(path.join(DIR, ctx), ws, { recursive: true });
  execFileSync('git', ['init', '-q', ws]);
  execFileSync('git', ['-C', ws, 'add', '-A']);
  execFileSync('git', ['-C', ws, '-c', 'user.email=s@example.invalid', '-c', 'user.name=s', 'commit', '-qm', 'fixture']);
  return ws;
}
function skillCopy(skill) {
  const src = path.join(SKILLS, skill);
  const dst = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'hs-skill-')), skill);
  fs.cpSync(src, dst, { recursive: true, filter: (p) => !p.startsWith(path.join(src, 'evals')) });
  return dst;
}
// The project's own files as the grader sees them (no folder name).
function projectView(ctx) {
  const root = path.join(DIR, ctx); const out = [];
  const walk = (d) => { for (const f of fs.readdirSync(d).sort()) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else out.push(`--- ${path.relative(root, p)}\n${fs.readFileSync(p, 'utf8').slice(0, 1500)}`); } };
  walk(root);
  return out.join('\n').slice(0, 14000);
}
const words = (t) => new Set(String(t).toLowerCase().match(/[a-z][a-z0-9_-]{2,}/g) || []);
const jaccard = (x, y) => { const A = words(x); const B = words(y); const inter = [...A].filter((w) => B.has(w)).length; return A.size + B.size ? inter / (A.size + B.size - inter) : 0; };

async function agent(task, ctx, arm) {
  const ws = workspace(ctx);
  const shown = arm === 'with_skill' ? skillCopy(task.skill) : null;
  const prompt = shown ? `Before you start, read the skill file ${path.join(shown, 'SKILL.md')} and follow it (it may point to files in the same folder). H-Stack's helper commands (hs, receipts) are not installed here; skip those steps.\n\nTask: ${task.prompt}` : task.prompt;
  const argv = ['-p', prompt, '--output-format', 'json', '--max-turns', '25', '--permission-mode', 'acceptEdits', '--allowedTools', ...TOOLS, ...(shown ? ['--add-dir', shown] : [])];
  const raw = await run('claude', argv, ws);
  let final = ''; try { final = String(JSON.parse(raw.trim().split('\n').pop()).result || ''); } catch { final = raw.slice(-3000); }
  let diff = ''; try { execFileSync('git', ['-C', ws, 'add', '-A', '-N']); diff = execFileSync('git', ['-C', ws, 'diff'], { encoding: 'utf8', maxBuffer: 8 << 20 }); } catch { /* */ }
  fs.rmSync(ws, { recursive: true, force: true });
  return { final, diff, text: `${final}\n${diff}` };
}
const blind = (t) => String(t).split('\n').filter((l) => !/SKILL\.md|h-stack[:/]|\bthe skill\b/i.test(l)).join('\n');
async function gradeFit(ctx, task, out) {
  const crit = spec.fit_criteria[ctx] || [];
  const prompt = `You are checking whether a change fits the project it was made in. Judge each criterion strictly from the evidence; if it is missing or ambiguous, answer false.\n\nREQUEST: ${task.prompt}\n\nTHE PROJECT'S FILES BEFORE THE CHANGE:\n${projectView(ctx)}\n\nTHE AGENT'S FINAL MESSAGE:\n${blind(out.final).slice(0, 5000)}\n\nTHE AGENT'S DIFF:\n${blind(out.diff).slice(0, 10000) || '(no changes)'}\n\nCRITERIA:\n${crit.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nA criterion is "applicable" only if this kind of request could reasonably meet it (a README intro cannot add a command or call an audit function; a settings page can). Reply with only JSON: {"criteria":[{"applicable":true|false,"passed":true|false,"evidence":"one short quote"}]} in the same order; passed is false when not applicable.`;
  const raw = await run('claude', ['-p', prompt, '--output-format', 'json', '--max-turns', '1', '--tools', ''], os.tmpdir(), 300000);
  try { const j = JSON.parse(raw.trim().split('\n').pop()); const v = JSON.parse(String(j.result).match(/\{[\s\S]*\}/)[0]).criteria || []; const app = v.filter((x) => x.applicable !== false); return { passed: app.filter((x) => x.passed).length, total: app.length, of: crit.length, verdicts: v }; } catch { return { passed: 0, total: crit.length, verdicts: [], error: 'unparseable' }; }
}
async function pool(jobs) { const r = new Array(jobs.length); let i = 0; await Promise.all(Array.from({ length: PAR }, async () => { while (i < jobs.length) { const k = i++; r[k] = await jobs[k](); } })); return r; }

const tasks = spec.tasks.filter((t) => !ONLY.length || ONLY.includes(t.skill));
// --regrade <report.json>: re-grade the stored outputs of an earlier run with the current grader.
const REGRADE = opt('regrade', null);
const jobs = [];
for (const t of tasks) for (const arm of ['with_skill', 'without_skill']) for (let n = 1; n <= RUNS; n++) for (const ctx of spec.contexts) jobs.push(async () => {
  const out = await agent(t, ctx, arm);
  if (/hit your [\w -]*limit/i.test(out.final)) { process.stderr.write(`usage limit reached (${t.skill} ${arm} ${ctx}); stopping\n`); process.exit(3); }
  const fit = await gradeFit(ctx, t, out);
  process.stderr.write(`${t.skill} ${arm}#${n} ${ctx}: fit ${fit.passed}/${fit.total}\n`);
  return { skill: t.skill, arm, run: n, ctx, fit, text: out.text, final: out.final.slice(0, 4000), diff: out.diff.slice(0, 8000) };
});
let res;
if (REGRADE) {
  const prev = JSON.parse(fs.readFileSync(path.resolve(REGRADE), 'utf8')).runs.filter((r) => tasks.some((t) => t.skill === r.skill));
  res = await pool(prev.map((r) => async () => {
    const t = tasks.find((x) => x.skill === r.skill);
    const fit = await gradeFit(r.ctx, t, { final: r.final, diff: r.diff });
    process.stderr.write(`regrade ${r.skill} ${r.arm}#${r.run} ${r.ctx}: fit ${fit.passed}/${fit.total}\n`);
    return { ...r, fit, text: `${r.final}\n${r.diff}` };
  }));
} else res = await pool(jobs);
const summary = {};
for (const t of tasks) for (const arm of ['with_skill', 'without_skill']) {
  const rs = res.filter((r) => r.skill === t.skill && r.arm === arm);
  const fit = rs.reduce((s, r) => s + r.fit.passed, 0) / Math.max(1, rs.reduce((s, r) => s + r.fit.total, 0));
  const sims = [];
  for (let n = 1; n <= RUNS; n++) { const g = rs.filter((r) => r.run === n); for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) sims.push(jaccard(g[i].text, g[j].text)); }
  (summary[t.skill] ||= {})[arm] = { fit: +fit.toFixed(2), similarity: +(sims.reduce((x, y) => x + y, 0) / Math.max(1, sims.length)).toFixed(2), runs: RUNS };
}
const outDir = path.join(REPO, 'evals', 'results', 'sameness');
fs.mkdirSync(outDir, { recursive: true });
const file = path.join(outDir, `${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`);
fs.writeFileSync(file, JSON.stringify({ method: 'blind fit grading per context + mean pairwise token Jaccard across contexts', summary, runs: res.map(({ text, ...r }) => r) }, null, 2));
console.log(JSON.stringify(summary, null, 1));
console.log(`report: ${path.relative(REPO, file)}`);
