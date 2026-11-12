#!/usr/bin/env node
// PostToolUse(Edit|Write|MultiEdit): run the project's fastest parser on the edited file and
// return only new errors, +-3 lines, within 3 s (HS-039). FAILURE_MODE=open
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { runHook, projectDir, sessionDir, readJson, writeJsonAtomic, relToProject, context, bashPath } from '../lib/core.mjs';

function check(abs) {
  const ext = path.extname(abs).toLowerCase();
  // 9009: Windows could not find the command (or hit the Microsoft Store python stub); no parser, no note.
  const run = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: 'utf8', timeout: 2500 }); if (r.error || r.status === 9009) return null; return r.status === 0 ? '' : (r.stderr || r.stdout || 'syntax error').trim(); };
  if (ext === '.json' && !/tsconfig|jsconfig|\.vscode/.test(abs)) { try { JSON.parse(fs.readFileSync(abs, 'utf8')); return ''; } catch (e) { return String(e.message); } }
  if (['.js', '.mjs', '.cjs'].includes(ext)) return run(process.execPath, ['--check', abs]);
  if (ext === '.py') return run(process.platform === 'win32' ? 'python' : 'python3', ['-c', 'import ast,sys; ast.parse(open(sys.argv[1]).read(), sys.argv[1])', abs]);
  if (['.sh', '.bash'].includes(ext)) return run(bashPath(), ['-n', abs]);
  if (ext === '.rb') return run('ruby', ['-c', abs]);
  if (ext === '.php') return run('php', ['-l', abs]);
  if (ext === '.go') return run('gofmt', ['-e', '-l', abs]);
  return null;
}

function excerpt(abs, err) {
  const m = String(err).match(/(?:line |:)(\d+)(?::\d+)?/);
  if (!m) return '';
  const n = Number(m[1]);
  try {
    const lines = fs.readFileSync(abs, 'utf8').split('\n');
    return lines.slice(Math.max(0, n - 4), n + 3).map((l, i) => `${Math.max(1, n - 3) + i}| ${l.slice(0, 120)}`).join('\n');
  } catch { return ''; }
}

await runHook('syntax', 'open', async (input) => {
  const proj = projectDir(input);
  const p = input.tool_input?.file_path;
  if (!p) return null;
  const abs = path.isAbsolute(p) ? p : path.join(proj, p);
  const err = check(abs);
  if (err === null) return null;
  const stFile = path.join(sessionDir(proj, input.session_id || 'no-session'), 'syntax.json');
  const st = readJson(stFile, {});
  const rel = relToProject(proj, abs);
  const prev = st[rel] || '';
  const firstLine = (err || '').split('\n').find((l) => /error|unexpected|invalid|expected/i.test(l)) || (err || '').split('\n')[0] || '';
  st[rel] = firstLine;
  writeJsonAtomic(stFile, st);
  if (!err || firstLine === prev) return null;
  return context('PostToolUse', `H-Stack syntax check: ${rel}: ${firstLine.slice(0, 200)}\n${excerpt(abs, err)}`.trim());
});
