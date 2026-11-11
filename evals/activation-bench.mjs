#!/usr/bin/env node
// HS-018 activation load rate: how often Claude actually calls the Skill tool for the skill the
// classifier named, per classifier line style. Each run is a separate `claude -p` with the plugin
// in a fresh temp dir; the Skill tool_use is read from the stream-json trace.
//   node evals/activation-bench.mjs [--styles pointer,check,inline] [--runs 2] [--parallel 6]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(`--${k}`); return i >= 0 ? a[i + 1] : d; };
const STYLES = opt('styles', 'pointer,check,inline').split(',');
const RUNS = Number(opt('runs', 2));
const PAR = Number(opt('parallel', 6));
const CASES = JSON.parse(fs.readFileSync(path.join(REPO, 'evals', 'activation-cases.json'), 'utf8'));

function run(style, c) {
  return new Promise((resolve) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hs-act-'));
    for (const [f, body] of Object.entries(c.files || {})) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), body); }
    const argv = ['-p', c.prompt, '--plugin-dir', path.join(REPO, 'plugins', 'h-stack'), '--output-format', 'stream-json', '--verbose', '--max-turns', '6', '--permission-mode', 'acceptEdits', '--allowedTools', 'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Skill'];
    const p = spawn('claude', argv, { cwd: dir, env: { ...process.env, HSTACK_LINE_STYLE: style, CLAUDE_PROJECT_DIR: dir }, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    p.stdout.on('data', (d) => { out += d; });
    const t = setTimeout(() => p.kill('SIGTERM'), 240000);
    p.on('close', () => {
      clearTimeout(t);
      const skills = [];
      for (const line of out.split('\n')) { try { const j = JSON.parse(line); for (const b of j.message?.content || []) if (b.type === 'tool_use' && b.name === 'Skill') skills.push(String(b.input?.skill || '')); } catch { /* not json */ } }
      fs.rmSync(dir, { recursive: true, force: true });
      resolve({ style, case: c.name, expect: c.expect, skills, loaded: skills.some((s) => s.endsWith(c.expect)) });
    });
  });
}
const jobs = [];
for (const s of STYLES) for (const c of CASES) for (let r = 0; r < RUNS; r++) jobs.push(() => run(s, c));
const res = []; let i = 0;
await Promise.all(Array.from({ length: PAR }, async () => { while (i < jobs.length) { const k = i++; const r = await jobs[k](); res.push(r); process.stderr.write(`${r.style} ${r.case}: ${r.loaded ? 'loaded' : 'not loaded'} [${r.skills.join(',')}]\n`); } }));
const summary = {};
for (const s of STYLES) { const rs = res.filter((r) => r.style === s); summary[s] = { loaded: rs.filter((r) => r.loaded).length, runs: rs.length, rate: +(rs.filter((r) => r.loaded).length / rs.length).toFixed(2) }; }
const outDir = path.join(REPO, 'evals', 'results', 'activation');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `load-rate-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`), JSON.stringify({ summary, runs: res }, null, 2));
console.log(JSON.stringify(summary));
