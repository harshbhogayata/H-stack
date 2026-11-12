#!/usr/bin/env node
// HS-078 known-good oracle split. `diff` runs an oracle and a candidate command per input ({} is
// replaced by the input path) and lists inputs whose output or exit code differ. `claim <id>` takes
// an exclusive lock file so parallel agents each work on a different failing item.
//   node oracle.mjs diff --oracle "gcc -E {}" --candidate "./mycc -E {}" tests/*.c
//   node oracle.mjs claim <id>     node oracle.mjs release <id>
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const { bashPath } = await import(new URL('../../../lib/core.mjs', import.meta.url));

const [sub, ...rest] = process.argv.slice(2);
const proj = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const lockDir = path.join(proj, '.h-stack', 'locks');
const out = (o) => { console.log(JSON.stringify(o)); process.exit(o.status === 'error' ? 1 : 0); };
const q = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;
if (sub === 'diff') {
  const get = (k) => { const i = rest.indexOf(`--${k}`); return i >= 0 ? rest.splice(i, 2)[1] : null; };
  const oracle = get('oracle'); const cand = get('candidate');
  if (!oracle || !cand || !rest.length) out({ status: 'error', reason: 'usage: oracle.mjs diff --oracle "<cmd {}>" --candidate "<cmd {}>" <inputs...>' });
  const run = (tpl, f) => spawnSync(bashPath(), ['-c', tpl.replaceAll('{}', q(f))], { cwd: proj, encoding: 'utf8', timeout: 60000 });
  const failing = [];
  for (const f of rest) {
    const a = run(oracle, f); const b = run(cand, f);
    if (a.status !== b.status || a.stdout !== b.stdout) failing.push({ id: f, oracle_exit: a.status, candidate_exit: b.status });
  }
  out({ status: failing.length ? 'differences' : 'ok', reason: `${failing.length} of ${rest.length} input(s) differ from the oracle`, failing: failing.slice(0, 200) });
}
if (sub === 'claim' || sub === 'release') {
  const id = rest[0];
  if (!id) out({ status: 'error', reason: `usage: oracle.mjs ${sub} <id>` });
  fs.mkdirSync(lockDir, { recursive: true });
  const lock = path.join(lockDir, id.replace(/[^A-Za-z0-9._-]/g, '_') + '.lock');
  if (sub === 'release') { fs.rmSync(lock, { force: true }); out({ status: 'ok', reason: `released ${id}` }); }
  try { const fd = fs.openSync(lock, 'wx'); fs.writeSync(fd, `${process.env.HSTACK_AGENT || 'agent'} ${Date.now()}\n`); fs.closeSync(fd); out({ status: 'ok', reason: `claimed ${id}` }); }
  catch { out({ status: 'taken', reason: `${id} is already claimed (${fs.readFileSync(lock, 'utf8').trim()}); pick another` }); }
}
out({ status: 'error', reason: 'usage: oracle.mjs diff|claim|release ...' });
