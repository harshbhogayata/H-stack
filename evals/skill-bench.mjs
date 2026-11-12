#!/usr/bin/env node
// Light per-skill benchmark in skill-creator's layout (HS-002): for each eval in a skill's
// evals/evals.json, one run with the skill and one without, each a separate `claude -p`
// process in a fresh copy of the eval's fixture. A check command runs afterwards, outside the
// agent ("verify the world", D15); the other expectations are graded by a separate judge call
// that sees the final message, the diff and the check output (binary verdicts with evidence).
//
//   node evals/skill-bench.mjs --skill core-rules [--skill tdd ...] [--all] [--parallel 4]
//        [--model <id>] [--judge-model <id>] [--iteration 1] [--max-turns 30] [--effort low|medium|high]
//
// Writes evals/results/skills/<skill>/iteration-N/eval-<name>/{with_skill,without_skill}/
// {outputs/final.md, outputs/diff.patch, timing.json, grading.json} and
// evals/results/skills/<skill>/iteration-N/benchmark.{json,md}.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SHOT_ALLOW, SHOT_HINT } from './screenshot.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// --help prints the header comment; without this guard any unknown flag starts model runs.
if (process.argv.includes('--help') || process.argv.includes('-h')) { const h = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1); console.log(h.slice(0, h.findIndex((l) => !l.startsWith('//'))).map((l) => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(0); }
const SKILLS = path.join(REPO, 'plugins', 'h-stack', 'skills');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const multi = (k) => args.flatMap((a, i) => (a === `--${k}` ? [args[i + 1]] : []));
const PARALLEL = Number(opt('parallel', 4));
const MODEL = opt('model', null);
const JUDGE = opt('judge-model', null);
const ITER = Number(opt('iteration', 1));
const MAX_TURNS = Number(opt('max-turns', 30));
const ONLY_EVAL = opt('eval', null);
const EFFORT = opt('effort', null);
const RUNS = Number(opt('runs', 1)); // runs per arm per eval
const LIMIT = /hit your [\w -]*limit/i; // HS-007: compare a skill at two effort levels
const TOOLS = ['Read', 'Edit', 'Write', 'Glob', 'Grep', 'Bash(node:*)', 'Bash(npm test:*)', 'Bash(npm run:*)', 'Bash(npx vitest:*)', 'Bash(npx jest:*)', 'Bash(python3:*)', 'Bash(pytest:*)', 'Bash(git diff:*)', 'Bash(git status:*)', 'Bash(git log:*)', 'Bash(ls:*)', 'Bash(cat:*)', 'Bash(grep:*)', 'Bash(rg:*)', 'Bash(find:*)', 'Bash(mkdir:*)', 'Bash(git stash:*)', SHOT_ALLOW];

function run(cmd, argv, { cwd, input, timeout = 900000, env } = {}) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const p = spawn(cmd, argv, { cwd, env: { ...process.env, ...env }, stdio: ['pipe', 'pipe', 'pipe'] });
    let out = ''; let err = '';
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => { err += d; });
    const timer = setTimeout(() => p.kill('SIGKILL'), timeout);
    p.on('close', (code) => { clearTimeout(timer); resolve({ code, out, err, ms: Date.now() - t0 }); });
    p.stdin.on('error', () => { /* child exited before reading stdin (EPIPE) */ });
    p.stdin.end(input || '');
  });
}

function workspace(skillDir, ev) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hs-bench-'));
  for (const f of ev.files || []) {
    const src = path.join(skillDir, f);
    if (fs.statSync(src).isDirectory()) fs.cpSync(src, dir, { recursive: true });
    else fs.copyFileSync(src, path.join(dir, path.basename(src)));
  }
  const g = (...a) => execFileSync('git', ['-C', dir, ...a], { stdio: 'ignore', env: { ...process.env, GIT_AUTHOR_DATE: '2026-01-01T00:00:00Z', GIT_COMMITTER_DATE: '2026-01-01T00:00:00Z' } });
  g('init', '-q', '-b', 'main'); g('config', 'user.email', 'bench@example.invalid'); g('config', 'user.name', 'bench'); g('add', '-A'); g('commit', '-q', '-m', 'fixture', '--allow-empty');
  return dir;
}

function skillCopy(skillDir) {
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'hs-skill-')), path.basename(skillDir));
  fs.cpSync(skillDir, dir, { recursive: true, filter: (src) => !src.startsWith(path.join(skillDir, 'evals')) });
  return dir;
}

async function agentRun(skill, ev, arm) {
  const skillDir = path.join(SKILLS, skill);
  const ws = workspace(skillDir, ev);
  // The with-skill arm sees a copy of the skill without evals/, so it cannot read the expectations.
  const shown = arm === 'with_skill' ? skillCopy(skillDir) : null;
  const prompt = arm === 'with_skill'
    ? `Before you start, read the skill file ${path.join(shown, 'SKILL.md')} and follow it (it may point to files in the same folder). H-Stack's helper commands it mentions (hs, receipts) are not installed in this run; skip those steps.\n\nTask: ${ev.prompt}`
    : ev.prompt;
  const argv = ['-p', `${prompt}\n\n${SHOT_HINT}`, '--output-format', 'json', '--max-turns', String(MAX_TURNS), '--permission-mode', 'acceptEdits', ...(EFFORT ? ['--effort', EFFORT] : []), '--allowedTools', ...TOOLS];
  if (arm === 'with_skill') argv.push('--add-dir', shown);
  if (MODEL) argv.push('--model', MODEL);
  const r = await run('claude', argv, { cwd: ws });
  let j = {};
  try { j = JSON.parse(r.out.trim().split('\n').pop()); } catch { j = { result: r.out.slice(-2000), is_error: true }; }
  const check = ev.check ? await run('bash', ['-c', ev.check], { cwd: ws, timeout: 120000 }) : null;
  let diff = '';
  try { execFileSync('git', ['-C', ws, 'add', '-A', '-N']); diff = execFileSync('git', ['-C', ws, 'diff'], { encoding: 'utf8', maxBuffer: 8 << 20 }); } catch { /* */ }
  fs.rmSync(ws, { recursive: true, force: true });
  const u = j.usage || {};
  return {
    final: String(j.result || ''), diff, check: check ? { code: check.code, out: (check.out + check.err).slice(-1500) } : null,
    timing: { total_tokens: (u.input_tokens || 0) + (u.output_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0), output_tokens: u.output_tokens || 0, duration_ms: j.duration_ms || r.ms, total_duration_seconds: (j.duration_ms || r.ms) / 1000, num_turns: j.num_turns || null, cost_usd: j.total_cost_usd || null, error: Boolean(j.is_error) },
  };
}

// Keep the grader blind to the arm: drop lines that say a skill file was read or followed.
const blind = (t) => String(t || '').split('\n').filter((l) => !/SKILL\.md|h-stack[:/]|\bthe skill\b|skill (file|says|instructions)/i.test(l)).join('\n');

async function grade(ev, res) {
  const out = [];
  const judged = [];
  for (const text of ev.expectations) {
    if (/^the check command exits 0/i.test(text) && res.check) out.push({ text, passed: res.check.code === 0, evidence: `check exit ${res.check.code}: ${res.check.out.slice(-200)}` });
    else { out.push(null); judged.push(text); }
  }
  if (judged.length) {
    const prompt = `You are grading one run of a coding agent. Judge each expectation strictly from the evidence below. Answer "passed": true only if the evidence clearly shows it; if the evidence is missing or ambiguous, answer false and say so.\n\nTASK GIVEN TO THE AGENT:\n${ev.prompt}\n\nCHECK COMMAND RESULT (run after the agent finished):\n${res.check ? `exit ${res.check.code}\n${res.check.out}` : '(no check)'}\n\nFINAL MESSAGE FROM THE AGENT:\n${blind(res.final).slice(0, 6000)}\n\nDIFF OF THE AGENT'S CHANGES:\n${blind(res.diff).slice(0, 12000) || '(no changes)'}\n\nEXPECTATIONS:\n${judged.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nReply with only JSON: {"expectations":[{"text":"...","passed":true|false,"evidence":"one sentence quoting the evidence"}]} in the same order.`;
    const argv = ['-p', prompt, '--output-format', 'json', '--max-turns', '1', '--tools', ''];
    if (JUDGE) argv.push('--model', JUDGE);
    // One retry when the grader's reply doesn't parse (measured: a qa run lost 2 expectations to this).
    let verdicts = null;
    for (let attempt = 0; attempt < 2 && !verdicts; attempt++) {
      const r = await run('claude', argv, { cwd: os.tmpdir(), timeout: 300000 });
      let text = '';
      try { text = String(JSON.parse(r.out.trim().split('\n').pop()).result || ''); } catch { text = ''; }
      if (process.env.HS_DEBUG_JUDGE) fs.appendFileSync(process.env.HS_DEBUG_JUDGE, `--- attempt ${attempt}\n${r.out.slice(0, 3000)}\n${r.err.slice(0, 1000)}\n`);
      try { verdicts = JSON.parse(text.match(/\{[\s\S]*\}/)[0]).expectations || null; } catch { verdicts = null; }
      // Lenient fallback: unescaped quotes in the evidence break JSON; the verdicts are still in order.
      if (!verdicts) { const ps = [...text.matchAll(/"passed"\s*:\s*(true|false)/g)].map((m) => m[1] === 'true'); if (ps.length === judged.length) verdicts = ps.map((p) => ({ passed: p, evidence: '(verdict read leniently: grader JSON was malformed)' })); }
    }
    if (!verdicts) verdicts = judged.map((t) => ({ text: t, passed: false, evidence: 'judge output unparseable (2 attempts)' }));
    let k = 0;
    for (let i = 0; i < out.length; i++) if (out[i] === null) { const v = verdicts[k] || {}; out[i] = { text: judged[k], passed: Boolean(v.passed), evidence: String(v.evidence || '').slice(0, 300) }; k++; }
  }
  const passed = out.filter((e) => e.passed).length;
  return { expectations: out, summary: { passed, failed: out.length - passed, total: out.length, pass_rate: out.length ? passed / out.length : 0 } };
}

const stats = (xs) => { if (!xs.length) return { mean: 0, stddev: 0, min: 0, max: 0 }; const mean = xs.reduce((a, b) => a + b, 0) / xs.length; const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length); return { mean: +mean.toFixed(3), stddev: +sd.toFixed(3), min: Math.min(...xs), max: Math.max(...xs) }; };

async function pool(tasks, n) {
  const results = []; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < tasks.length) { const k = i++; results[k] = await tasks[k](); } }));
  return results;
}

async function benchSkill(skill) {
  const skillDir = path.join(SKILLS, skill);
  const evs = JSON.parse(fs.readFileSync(path.join(skillDir, 'evals', 'evals.json'), 'utf8')).evals.filter((e) => !ONLY_EVAL || e.eval_name === ONLY_EVAL);
  const base = path.join(REPO, 'evals', 'results', 'skills', skill, `iteration-${ITER}`);
  const tasks = [];
  for (const ev of evs) for (const arm of ['with_skill', 'without_skill']) for (let n = 1; n <= RUNS; n++) tasks.push(async () => {
    const dir = RUNS > 1 ? path.join(base, `eval-${ev.eval_name}`, arm, `run-${n}`) : path.join(base, `eval-${ev.eval_name}`, arm);
    fs.mkdirSync(path.join(dir, 'outputs'), { recursive: true });
    // Resume: reuse a finished run whose output is not a usage-limit message.
    const prevG = path.join(dir, 'grading.json'); const prevF = path.join(dir, 'outputs', 'final.md'); const prevT = path.join(dir, 'timing.json');
    if (fs.existsSync(prevG) && fs.existsSync(prevT) && !LIMIT.test(fs.readFileSync(prevF, 'utf8'))) {
      const g0 = JSON.parse(fs.readFileSync(prevG, 'utf8')); const t0 = JSON.parse(fs.readFileSync(prevT, 'utf8'));
      return { eval_id: ev.id, eval_name: ev.eval_name, configuration: arm, run_number: n, result: { ...g0.summary, time_seconds: t0.total_duration_seconds, tokens: t0.total_tokens, errors: t0.error ? 1 : 0 }, expectations: g0.expectations, resumed: true };
    }
    const res = await agentRun(skill, ev, arm);
    // A usage-limit reply is not a result: stop the whole run so no garbage is scored.
    if (LIMIT.test(res.final)) { process.stderr.write(`usage limit reached during ${skill} ${ev.eval_name} ${arm}#${n}; stopping (re-run resumes)\n`); process.exit(3); }
    const g = await grade(ev, res);
    fs.writeFileSync(path.join(dir, 'outputs', 'final.md'), res.final);
    fs.writeFileSync(path.join(dir, 'outputs', 'diff.patch'), res.diff);
    if (res.check) fs.writeFileSync(path.join(dir, 'outputs', 'check.txt'), `exit ${res.check.code}\n${res.check.out}`);
    fs.writeFileSync(path.join(dir, 'timing.json'), JSON.stringify(res.timing, null, 2));
    fs.writeFileSync(path.join(dir, 'grading.json'), JSON.stringify(g, null, 2));
    process.stderr.write(`${skill} ${ev.eval_name} ${arm}#${n}: ${g.summary.passed}/${g.summary.total} (${Math.round(res.timing.duration_ms / 1000)}s)\n`);
    return { eval_id: ev.id, eval_name: ev.eval_name, configuration: arm, run_number: n, result: { ...g.summary, time_seconds: res.timing.total_duration_seconds, tokens: res.timing.total_tokens, errors: res.timing.error ? 1 : 0 }, expectations: g.expectations };
  });
  return { skill, base, tasks };
}

function summarise(skill, base, runs) {
  const by = (c) => runs.filter((r) => r.configuration === c);
  const sum = (c) => ({ pass_rate: stats(by(c).map((r) => r.result.pass_rate)), time_seconds: stats(by(c).map((r) => r.result.time_seconds)), tokens: stats(by(c).map((r) => r.result.tokens)) });
  const w = sum('with_skill'); const wo = sum('without_skill');
  const sign = (x, d = 2) => (x >= 0 ? '+' : '') + x.toFixed(d);
  const bench = {
    metadata: { skill_name: skill, skill_path: `plugins/h-stack/skills/${skill}`, executor_model: MODEL || 'session default', effort: EFFORT || 'session default', judge_model: JUDGE || 'session default', timestamp: new Date().toISOString(), evals_run: [...new Set(runs.map((r) => r.eval_id))], runs_per_configuration: RUNS, grader: 'fresh claude -p per run, not told the arm; skill mentions redacted from the evidence' },
    runs,
    run_summary: { with_skill: w, without_skill: wo, delta: { pass_rate: sign(w.pass_rate.mean - wo.pass_rate.mean), time_seconds: sign(w.time_seconds.mean - wo.time_seconds.mean, 1), tokens: sign(w.tokens.mean - wo.tokens.mean, 0) } },
    notes: [RUNS > 1 ? `${RUNS} runs per configuration per eval.` : 'Light benchmark: 1 run per configuration per eval, so differences under ~0.15 are within noise.'],
  };
  fs.writeFileSync(path.join(base, 'benchmark.json'), JSON.stringify(bench, null, 2));
  const md = [`# ${skill} benchmark (iteration ${ITER})`, '', `| eval | with skill | without skill |`, '|---|---|---|',
    ...[...new Set(runs.map((r) => r.eval_name))].map((n) => { const a = runs.find((r) => r.eval_name === n && r.configuration === 'with_skill'); const b = runs.find((r) => r.eval_name === n && r.configuration === 'without_skill'); return `| ${n} | ${a ? `${a.result.passed}/${a.result.total}` : '-'} | ${b ? `${b.result.passed}/${b.result.total}` : '-'} |`; }),
    '', `Pass rate: with ${w.pass_rate.mean} vs without ${wo.pass_rate.mean} (delta ${bench.run_summary.delta.pass_rate}). Time: ${w.time_seconds.mean}s vs ${wo.time_seconds.mean}s. Tokens: ${w.tokens.mean} vs ${wo.tokens.mean}.`, ''];
  fs.writeFileSync(path.join(base, 'benchmark.md'), md.join('\n'));
  return bench;
}

// --regrade: re-grade only runs whose grading failed (judge unparseable) from their stored outputs,
// then rewrite benchmark.json for that iteration.
if (args.includes('--regrade')) {
  for (const skill of multi('skill')) {
    const skillDir = path.join(SKILLS, skill);
    const evs = JSON.parse(fs.readFileSync(path.join(skillDir, 'evals', 'evals.json'), 'utf8')).evals;
    const base = path.join(REPO, 'evals', 'results', 'skills', skill, `iteration-${ITER}`);
    const runs = [];
    for (const ev of evs) for (const arm of ['with_skill', 'without_skill']) {
      const armDir = path.join(base, `eval-${ev.eval_name}`, arm);
      if (!fs.existsSync(armDir)) continue;
      const dirs = fs.readdirSync(armDir).filter((d) => d.startsWith('run-')).map((d) => path.join(armDir, d));
      for (const [i, dir] of (dirs.length ? dirs : [armDir]).entries()) {
        let g = JSON.parse(fs.readFileSync(path.join(dir, 'grading.json'), 'utf8'));
        const t = JSON.parse(fs.readFileSync(path.join(dir, 'timing.json'), 'utf8'));
        if (g.expectations.some((e) => /unparseable/.test(e.evidence))) {
          const rd = (f) => (fs.existsSync(path.join(dir, 'outputs', f)) ? fs.readFileSync(path.join(dir, 'outputs', f), 'utf8') : '');
          const ck = rd('check.txt'); const m = ck.match(/^exit (\d+)\n([\s\S]*)$/);
          g = await grade(ev, { final: rd('final.md'), diff: rd('diff.patch'), check: m ? { code: Number(m[1]), out: m[2] } : null });
          fs.writeFileSync(path.join(dir, 'grading.json'), JSON.stringify(g, null, 2));
          process.stderr.write(`regraded ${skill} ${ev.eval_name} ${arm} ${path.basename(dir)}: ${g.summary.passed}/${g.summary.total}\n`);
        }
        runs.push({ eval_id: ev.id, eval_name: ev.eval_name, configuration: arm, run_number: i + 1, result: { ...g.summary, time_seconds: t.total_duration_seconds, tokens: t.total_tokens, errors: t.error ? 1 : 0 }, expectations: g.expectations });
      }
    }
    const b = summarise(skill, base, runs);
    console.log(JSON.stringify({ skill, with: b.run_summary.with_skill.pass_rate.mean, without: b.run_summary.without_skill.pass_rate.mean, delta: b.run_summary.delta }));
  }
  process.exit(0);
}
const skills = args.includes('--all') ? fs.readdirSync(SKILLS).filter((s) => fs.existsSync(path.join(SKILLS, s, 'evals', 'evals.json'))) : multi('skill');
if (!skills.length) { console.log('usage: node evals/skill-bench.mjs --skill <name> [--all]'); process.exit(2); }
const plans = await Promise.all(skills.map(benchSkill));
const all = plans.flatMap((p) => p.tasks.map((t) => ({ p, t })));
const results = await pool(all.map(({ t }) => t), PARALLEL);
let k = 0;
for (const p of plans) {
  const runs = results.slice(k, k + p.tasks.length); k += p.tasks.length;
  const b = summarise(p.skill, p.base, runs);
  console.log(JSON.stringify({ skill: p.skill, with: b.run_summary.with_skill.pass_rate.mean, without: b.run_summary.without_skill.pass_rate.mean, delta: b.run_summary.delta }));
}
