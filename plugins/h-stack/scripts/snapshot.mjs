#!/usr/bin/env node
// HS-011 snapshot tests: canned payloads piped through every hook twice, diffed against *.expected.
// Also enforces the HS-012 output contract on every rendered output. --update rewrites expectations.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CASES = path.join(ROOT, 'tests', 'snapshots');
const REFUSAL = /^Blocked by [\w:-]+: .+?\. To proceed: .+?\.$/;

export function setupProject(c) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hstack-snap-'));
  process.env.GIT_AUTHOR_DATE = process.env.GIT_COMMITTER_DATE = '2026-01-01T00:00:00Z';
  const sub = (v) => (typeof v === 'string' ? v.replaceAll('$PROJ', dir) : JSON.parse(JSON.stringify(v).replaceAll('$PROJ', dir)));
  if (c.setup?.git !== false) {
    execFileSync('git', ['init', '-q', '-b', 'main', dir]);
    execFileSync('git', ['-C', dir, 'config', 'user.email', 'snap@example.invalid']);
    execFileSync('git', ['-C', dir, 'config', 'user.name', 'snap']);
  }
  for (const [rel, content] of Object.entries(c.setup?.files || {})) {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), typeof content === 'string' ? sub(content) : JSON.stringify(sub(content), null, 2));
  }
  if (c.setup?.git !== false && Object.keys(c.setup?.files || {}).length) {
    execFileSync('git', ['-C', dir, 'add', '-A']);
    execFileSync('git', ['-C', dir, 'commit', '-q', '-m', 'fixture']);
  }
  for (const [rel, content] of Object.entries(c.setup?.after_commit || {})) {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), typeof content === 'string' ? content : JSON.stringify(content, null, 2));
  }
  for (const [rel, content] of Object.entries(c.setup?.state || {})) {
    const p = path.join(dir, '.h-stack', rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    const v = sub(content);
    fs.writeFileSync(p, Array.isArray(v) && rel.endsWith('.jsonl') ? v.map((x) => JSON.stringify(x)).join('\n') + '\n' : typeof v === 'string' ? v : JSON.stringify(v));
  }
  return dir;
}

export function runCase(c, proj) {
  const input = JSON.parse(JSON.stringify(c.input).replaceAll('$PROJ', proj));
  const env = { ...process.env, CLAUDE_PROJECT_DIR: proj, CLAUDE_PLUGIN_ROOT: ROOT, HOME: path.join(proj, '.home'), HSTACK_REGISTRY_FIXTURE: path.join(ROOT, 'tests', 'fixtures', 'registry.json'), ...Object.fromEntries(Object.entries(c.env || {}).map(([k, v]) => [k, String(v).replaceAll('__ROOT__', ROOT)])) };
  delete env.CLAUDE_CONFIG_DIR;
  const r = spawnSync('node', [path.join(ROOT, 'hooks', c.hook)], { input: JSON.stringify(input), env, encoding: 'utf8', timeout: 20000 });
  return { stdout: (r.stdout || '').replaceAll(proj, '$PROJ'), status: r.status, stderr: r.stderr };
}

export function contractProblems(stdout) {
  const problems = [];
  const text = stdout.trim();
  if (!text) return problems;
  let obj = null;
  try { obj = JSON.parse(text.split('\n').filter((l) => l.trim().startsWith('{')).pop() || 'null'); } catch { /* plain text (PreCompact) */ }
  const ctx = obj?.hookSpecificOutput?.additionalContext || '';
  const visible = obj ? [ctx, obj.reason || '', obj.hookSpecificOutput?.permissionDecisionReason || ''].join('\n') : text;
  const lines = visible.split('\n').filter((l) => l.trim()).length;
  if (lines > 10) problems.push(`output has ${lines} lines (max 10)`);
  const reason = obj?.hookSpecificOutput?.permissionDecisionReason || (obj?.decision === 'block' ? obj.reason : null);
  if (reason) {
    const parts = reason.split(/(?<=\.) (?=Blocked by )/);
    for (const p of parts) if (!REFUSAL.test(p.trim())) problems.push(`refusal not in contract format: ${p.slice(0, 120)}`);
  }
  if (obj?.hookSpecificOutput?.permissionDecision === 'allow') problems.push('a gate returned allow');
  return problems;
}

export function allCases() {
  const out = [];
  if (!fs.existsSync(CASES)) return out;
  for (const f of fs.readdirSync(CASES).sort()) if (f.endsWith('.json')) out.push({ name: f.replace(/\.json$/, ''), file: path.join(CASES, f), ...JSON.parse(fs.readFileSync(path.join(CASES, f), 'utf8')) });
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const update = process.argv.includes('--update');
  const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7);
  let fail = 0; let n = 0;
  const msgs = [];
  for (const c of allCases()) {
    if (only && !c.name.includes(only)) continue;
    n++;
    const p1 = setupProject(c); const a = runCase(c, p1);
    const p2 = setupProject(c); const b = runCase(c, p2);
    fs.rmSync(p1, { recursive: true, force: true }); fs.rmSync(p2, { recursive: true, force: true });
    const expFile = c.file.replace(/\.json$/, '.expected');
    if (a.stdout !== b.stdout) { fail++; msgs.push(`${c.name}: output differs between two runs (not deterministic)`); continue; }
    if (a.status !== (c.expect_status ?? 0)) { fail++; msgs.push(`${c.name}: exit ${a.status}, expected ${c.expect_status ?? 0} ${a.stderr.slice(0, 200)}`); continue; }
    for (const p of contractProblems(a.stdout)) { fail++; msgs.push(`${c.name}: ${p}`); }
    if (update || !fs.existsSync(expFile)) { fs.writeFileSync(expFile, a.stdout); continue; }
    const exp = fs.readFileSync(expFile, 'utf8');
    if (exp !== a.stdout) { fail++; msgs.push(`${c.name}: differs from ${path.basename(expFile)}\n  expected: ${exp.slice(0, 300)}\n  actual:   ${a.stdout.slice(0, 300)}`); }
  }
  console.log(JSON.stringify({ status: fail ? 'fail' : 'ok', reason: `${n - fail}/${n} snapshot cases pass${update ? ' (updated)' : ''}` }));
  if (msgs.length) console.log(msgs.slice(0, 8).join('\n'));
  process.exit(fail ? 1 : 0);
}
