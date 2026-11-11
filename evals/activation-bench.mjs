#!/usr/bin/env node
// HS-018 activation load rate: how often Claude actually calls the Skill tool for the skill the
// classifier named, per classifier line style. Each run is a separate `claude -p` with the plugin
// in a fresh temp dir; the Skill tool_use is read from the stream-json trace.
//   node evals/activation-bench.mjs [--styles pointer,check,inline] [--runs 2] [--parallel 6]
//   node evals/activation-bench.mjs --outcome [--runs 3]   M4: each case with the plugin vs without it, the
//     final message and diff graded against the case's expectations by a fresh, tool-less grader that is
//     not told the arm. Reports load rate (plugin arm) and pass rate per arm.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
// Files the agent created or changed (fixtures are tiny): name + content, for the grader.
function listNew(dir, seeded) {
  const out = [];
  const walk = (d) => { for (const f of fs.readdirSync(d)) { if (f === '.git' || f === '.h-stack' || f === 'node_modules') continue; const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else { const rel = path.relative(dir, p); const body = fs.readFileSync(p, 'utf8'); if (seeded[rel] !== body) out.push(`--- ${rel}\n${body.slice(0, 3000)}`); } } };
  walk(dir); return out.join('\n').slice(0, 12000);
}
async function gradeOutcome(c, r) {
  const blind = (t) => String(t).split('\n').filter((l) => !/SKILL\.md|h-stack[:/]|\bthe skill\b|H-Stack/i.test(l)).join('\n');
  const prompt = `Grade one run of a coding agent strictly from the evidence. If evidence is missing or ambiguous, answer false.\n\nTASK: ${c.prompt}\n\nFINAL MESSAGE:\n${blind(r.final).slice(0, 6000)}\n\nCHECK COMMAND RESULT (run after the agent finished):\n${r.check ? `exit ${r.check.code}\n${r.check.out}` : '(no check)'}\n\nFILES THE AGENT WROTE OR CHANGED:\n${blind(r.diff) || '(none)'}\n\nEXPECTATIONS:\n${c.expectations.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n\nReply with only JSON: {"expectations":[{"passed":true|false,"evidence":"short quote"}]} in order.`;
  for (let k = 0; k < 2; k++) {
    const g = spawnSync('claude', ['-p', prompt, '--output-format', 'json', '--max-turns', '1', '--tools', ''], { cwd: os.tmpdir(), encoding: 'utf8', timeout: 300000, maxBuffer: 16 << 20 });
    let text = ''; try { text = String(JSON.parse(g.stdout.trim().split('\n').pop()).result || ''); } catch { /* */ }
    try { const v = JSON.parse(text.match(/\{[\s\S]*\}/)[0]).expectations; if (Array.isArray(v) && v.length === c.expectations.length) return v; } catch { /* */ }
    const ps = [...text.matchAll(/"passed"\s*:\s*(true|false)/g)].map((m) => m[1] === 'true'); if (ps.length === c.expectations.length) return ps.map((p) => ({ passed: p, evidence: '(lenient parse)' }));
  }
  return null;
}
const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(`--${k}`); return i >= 0 ? a[i + 1] : d; };
const OUTCOME = a.includes('--outcome');
const STYLES = OUTCOME ? ['plugin', 'no-plugin'] : opt('styles', 'pointer,check,inline').split(',');
const RUNS = Number(opt('runs', 2));
const PAR = Number(opt('parallel', 6));
const ONLY = a.flatMap((x, i) => (x === '--case' ? [a[i + 1]] : []));
// Stale THIRD_PARTY digests make SessionStart call the edited skills unverified, and Claude then
// avoids them: a measured confound (planning 0/3 vs 3/3). Refuse to measure in that state.
{
  const pdir = opt('plugin-dir', path.join(REPO, 'plugins', 'h-stack'));
  const chk = (await import('node:child_process')).spawnSync('node', [path.join(pdir, 'scripts', 'third-party.mjs')], { encoding: 'utf8' });
  if (chk.status !== 0) { console.error(`THIRD_PARTY digests are stale in ${pdir}; run scripts/third-party.mjs --write first.\n${chk.stdout}`); process.exit(2); }
}
// Cases: evals/activation-cases.json (prompts), or --cases <file> whose entries may point at a skill eval
// ({from: {skill, eval}}): its fixture, prompt, check command and expectations are used as is.
const SKILLS_DIR = path.join(REPO, 'plugins', 'h-stack', 'skills');
const CASES = JSON.parse(fs.readFileSync(path.resolve(REPO, opt('cases', 'evals/activation-cases.json')), 'utf8')).filter((c) => !ONLY.length || ONLY.includes(c.name)).map((c) => {
  if (!c.from) return c;
  const ev = JSON.parse(fs.readFileSync(path.join(SKILLS_DIR, c.from.skill, 'evals', 'evals.json'), 'utf8')).evals.find((e) => e.eval_name === c.from.eval);
  return { ...c, prompt: c.prompt || ev.prompt, fixtures: (ev.files || []).map((f) => path.join(SKILLS_DIR, c.from.skill, f)), check: ev.check, expectations: ev.expectations.filter((x) => !/^the check command exits 0/i.test(x)) };
});
const expects = (c) => (Array.isArray(c.expect) ? c.expect : [c.expect]);
const TOOLS = ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Skill', 'Bash(node:*)', 'Bash(npm test:*)', 'Bash(python3:*)', 'Bash(pytest:*)', 'Bash(git diff:*)', 'Bash(git status:*)', 'Bash(git log:*)', 'Bash(ls:*)', 'Bash(cat:*)', 'Bash(mkdir:*)'];

function run(style, c) {
  return new Promise((resolve) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hs-act-'));
    for (const [f, body] of Object.entries(c.files || {})) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), body); }
    for (const fx of c.fixtures || []) fs.cpSync(fx, dir, { recursive: true });
    if (c.fixtures) { spawnSync('git', ['init', '-q', dir]); spawnSync('git', ['-C', dir, 'add', '-A']); spawnSync('git', ['-C', dir, '-c', 'user.email=a@example.invalid', '-c', 'user.name=a', 'commit', '-qm', 'fixture']); }
    const withPlugin = style !== 'no-plugin';
    const argv = ['-p', c.prompt, ...(withPlugin ? ['--plugin-dir', opt('plugin-dir', path.join(REPO, 'plugins', 'h-stack'))] : []), '--output-format', 'stream-json', '--verbose', '--max-turns', OUTCOME ? '20' : '6', '--permission-mode', 'acceptEdits', '--allowedTools', ...(c.fixtures ? TOOLS : ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Skill'])];
    const p = spawn('claude', argv, { cwd: dir, env: { ...process.env, ...(OUTCOME ? {} : { HSTACK_LINE_STYLE: style }), CLAUDE_PROJECT_DIR: dir }, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    p.stdout.on('data', (d) => { out += d; });
    const t = setTimeout(() => p.kill('SIGTERM'), 240000);
    p.on('close', () => {
      clearTimeout(t);
      const skills = [];
      for (const line of out.split('\n')) { try { const j = JSON.parse(line); for (const b of j.message?.content || []) if (b.type === 'tool_use' && b.name === 'Skill') skills.push(String(b.input?.skill || '')); } catch { /* not json */ } }
      let final = ''; let diff = '';
      for (const line of out.split('\n')) { try { const j = JSON.parse(line); if (j.type === 'result') final = String(j.result || ''); } catch { /* skip */ } }
      let check = null;
      if (c.fixtures) {
        spawnSync('git', ['-C', dir, 'add', '-A', '-N']); diff = spawnSync('git', ['-C', dir, 'diff'], { encoding: 'utf8', maxBuffer: 16 << 20 }).stdout.slice(0, 12000);
        if (c.check) { const k = spawnSync('bash', ['-c', c.check], { cwd: dir, encoding: 'utf8', timeout: 180000 }); check = { code: k.status, out: (k.stdout + k.stderr).slice(-600) }; }
      } else { try { diff = listNew(dir, c.files || {}); } catch { /* */ } }
      fs.rmSync(dir, { recursive: true, force: true });
      resolve({ style, case: c.name, expect: c.expect, skills, loaded: skills.some((s) => expects(c).some((e) => s.endsWith(e))), final, diff, check });
    });
  });
}
const jobs = [];
for (const s of STYLES) for (const c of CASES) for (let r = 0; r < RUNS; r++) jobs.push(() => run(s, c));
const res = []; let i = 0;
await Promise.all(Array.from({ length: PAR }, async () => { while (i < jobs.length) { const k = i++; const r = await jobs[k](); res.push(r); process.stderr.write(`${r.style} ${r.case}: ${r.loaded ? 'loaded' : 'not loaded'} [${r.skills.join(',')}]\n`); } }));
if (OUTCOME) for (const r of res) {
  const c = CASES.find((x) => x.name === r.case);
  r.grades = c.expectations.length ? await gradeOutcome(c, r) : [];
  if (r.grades === null) { r.pass = null; continue; }
  const marks = [...(r.check ? [r.check.code === 0] : []), ...r.grades.map((g) => g.passed)];
  r.pass = marks.length ? marks.filter(Boolean).length / marks.length : null;
}
const summary = {};
for (const s of STYLES) { const rs = res.filter((r) => r.style === s); summary[s] = { loaded: rs.filter((r) => r.loaded).length, runs: rs.length, rate: +(rs.filter((r) => r.loaded).length / rs.length).toFixed(2) };
  if (OUTCOME) { const g = rs.filter((r) => r.pass !== null); summary[s].pass_rate = +(g.reduce((x, r) => x + r.pass, 0) / Math.max(1, g.length)).toFixed(2); summary[s].ungraded = rs.length - g.length;
    summary[s].per_case = Object.fromEntries(CASES.map((c) => { const cs = g.filter((r) => r.case === c.name); return [c.name, +(cs.reduce((x, r) => x + r.pass, 0) / Math.max(1, cs.length)).toFixed(2)]; })); } }
const outDir = path.join(REPO, 'evals', 'results', 'activation');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `load-rate-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`), JSON.stringify({ summary, runs: res }, null, 2));
console.log(JSON.stringify(summary));
