#!/usr/bin/env node
// HS-068 diff-targeted mutation check (idea from Trail of Bits, re-expressed; their text is CC BY-SA).
//   node mutate.mjs [--base HEAD] [--max 30] -- <test command>
// For each changed line (vs base) in JS/TS/Python/Go/Ruby source files that are not tests, applies one
// mutation at a time, runs the tests, restores the file. Reports surviving mutants as JSON.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const here = path.dirname(new URL(import.meta.url).pathname);
const { isTestPath } = await import(path.join(here, '..', '..', '..', 'lib', 'tests.mjs'));
const { loadConfig } = await import(path.join(here, '..', '..', '..', 'lib', 'core.mjs'));
const argv = process.argv.slice(2);
const dd = argv.indexOf('--');
const cmd = dd >= 0 ? argv.slice(dd + 1).join(' ') : '';
const opt = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 && i < (dd < 0 ? argv.length : dd) ? argv[i + 1] : d; };
const base = opt('base', 'HEAD');
const max = Number(opt('max', 30));
const out = (o) => { console.log(JSON.stringify(o)); process.exit(o.status === 'error' ? 1 : 0); };
if (!cmd) out({ status: 'error', reason: 'usage: mutate.mjs [--base HEAD] [--max 30] -- <test command>' });
const proj = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const config = loadConfig(proj);
const MUTATIONS = [
  [/===/, '!=='], [/!==/, '==='], [/(?<![=!<>])==(?!=)/, '!='], [/!=(?!=)/, '=='], [/<=/, '<'], [/>=/, '>'], [/(?<![<=-])<(?![=<])/, '<='], [/(?<![>=-])>(?![=>])/, '>='],
  [/&&/, '||'], [/\|\|/, '&&'], [/\band\b/, 'or'], [/\bor\b/, 'and'], [/\btrue\b/, 'false'], [/\bfalse\b/, 'true'], [/\bTrue\b/, 'False'], [/\bFalse\b/, 'True'],
  [/(?<=\s)\+(?=\s)/, '-'], [/(?<=\s)-(?=\s)/, '+'], [/(?<=\s)\*(?=\s)/, '/'], [/\b0\b/, '1'], [/\b1\b/, '0'], [/return (?!;)/, 'return !'],
];
let diff;
try { diff = execFileSync('git', ['-C', proj, 'diff', '-U0', base, '--', '.'], { encoding: 'utf8' }); } catch { out({ status: 'error', reason: 'git diff failed' }); }
const targets = [];
let file = null;
for (const l of diff.split('\n')) {
  if (l.startsWith('+++ b/')) { file = l.slice(6); continue; }
  const m = l.match(/^@@ .* \+(\d+)(?:,(\d+))? @@/);
  if (m && file && /\.(m?[jt]sx?|cjs|py|go|rb)$/.test(file) && !isTestPath(file, proj, config)) {
    const start = Number(m[1]); const n = m[2] === undefined ? 1 : Number(m[2]);
    for (let k = 0; k < n; k++) targets.push({ file, line: start + k });
  }
}
const run = () => spawnSync('bash', ['-c', cmd], { cwd: proj, encoding: 'utf8', timeout: 300000, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
const baseline = run();
if (baseline.status !== 0) out({ status: 'error', reason: 'the test command fails before mutation; fix the suite first' });
const survivors = []; let tried = 0;
for (const t of targets) {
  if (tried >= max) break;
  const abs = path.join(proj, t.file);
  const orig = fs.readFileSync(abs, 'utf8');
  const lines = orig.split('\n');
  const src = lines[t.line - 1];
  if (!src || /^\s*(\/\/|#|\*|import |from |require\()/.test(src)) continue;
  for (const [re, rep] of MUTATIONS) {
    if (!re.test(src) || tried >= max) continue;
    const mutated = src.replace(re, rep);
    lines[t.line - 1] = mutated;
    fs.writeFileSync(abs, lines.join('\n'));
    tried++;
    let r;
    try { r = run(); } finally { fs.writeFileSync(abs, orig); }
    if (r.status === 0) survivors.push({ file: t.file, line: t.line, original: src.trim().slice(0, 100), mutant: mutated.trim().slice(0, 100) });
    lines[t.line - 1] = src;
    break;
  }
}
out({ status: survivors.length ? 'survivors' : 'ok', reason: `${tried} mutant(s) on ${targets.length} changed line(s); ${survivors.length} survived (no test failed)`, survivors: survivors.slice(0, 15) });
