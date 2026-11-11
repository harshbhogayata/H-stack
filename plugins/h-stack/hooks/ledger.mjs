#!/usr/bin/env node
// PostToolUse(Bash|Edit|Write|MultiEdit|NotebookEdit) and PostToolUseFailure(Bash):
// receipts and edit entries (HS-027), error-as-success (HS-036), event triggers (HS-022).
// Single writer of sessions/<id>/ledger.jsonl and notes.jsonl.
// FAILURE_MODE=open
import path from 'node:path';
import { runHook, projectDir, sessionDir, appendLine, readJsonl, readJson, treeHash, sha, context, relToProject, loadConfig } from '../lib/core.mjs';
import { claimKinds } from '../lib/ledger.mjs';
import { loadIndex } from '../lib/index.mjs';
import { matchesAny } from '../lib/core.mjs';

// Output that means failure even when the exit code is 0 (C11).
const FAIL_PATTERNS = [
  [/^\s*Aborted\.?\s*$/m, 'Aborted.'],
  [/"success"\s*:\s*false/, '"success": false'],
  [/"ok"\s*:\s*false/, '"ok": false'],
  [/"status"\s*:\s*"(error|failed|failure)"/i, '"status": error'],
  [/^npm ERR!/m, 'npm ERR!'],
  [/^Traceback \(most recent call last\):/m, 'a Python traceback'],
  [/\b(no tests (ran|found|to run)|collected 0 items|0 tests? (ran|run|executed)|Ran 0 tests|No test files found|0 passing)\b/i, 'no tests ran'],
  [/^HTTP\/[\d.]+ 200[\s\S]{0,400}"(error|errors)"\s*:/m, 'HTTP 200 with an error body'],
];

function responseText(input) {
  if (input.hook_event_name === 'PostToolUseFailure') return String(input.error || '');
  const r = input.tool_response;
  if (r == null) return '';
  if (typeof r === 'string') return r;
  return [r.stdout, r.stderr, r.output, r.content].filter((x) => typeof x === 'string').join('\n');
}

function exitOf(input) {
  if (input.hook_event_name === 'PostToolUseFailure') {
    const m = String(input.error || '').match(/^Exit code (\d+)/);
    return m ? Number(m[1]) : (input.is_interrupt ? 130 : 1);
  }
  const r = input.tool_response || {};
  if (typeof r.exitCode === 'number') return r.exitCode;
  if (typeof r.exit_code === 'number') return r.exit_code;
  if (r.interrupted) return 130;
  return 0;
}

await runHook('ledger', 'open', async (input) => {
  const proj = projectDir(input);
  const sid = input.session_id || 'no-session';
  const dir = sessionDir(proj, sid);
  const file = path.join(dir, 'ledger.jsonl');
  const notesFile = path.join(dir, 'notes.jsonl');
  const config = loadConfig(proj);
  const rows = readJsonl(file);
  const turn = input.prompt_id || readJson(path.join(dir, 'route.json'), {}).prompt_id || null;
  const notes = [];
  const noted = new Set(readJsonl(notesFile).filter((n) => n.turn === turn).map((n) => n.key));
  const note = (key, text) => { if (noted.has(key)) return; noted.add(key); appendLine(notesFile, { key, turn, ts: Date.now() }, proj); notes.push(text); };

  if (input.tool_name === 'Bash') {
    const cmd = String(input.tool_input?.command || '');
    const out = responseText(input);
    const exit = exitOf(input);
    let failed = null;
    if (exit === 0) for (const [re, label] of FAIL_PATTERNS) if (re.test(out)) { failed = label; break; }
    const id = input.tool_use_id ? `r-${sha(input.tool_use_id, 6)}` : `r-${rows.filter((r) => r.kind === 'receipt').length + 1}`;
    const kinds = claimKinds(cmd, config);
    appendLine(file, {
      id, kind: 'receipt', cmd: cmd.slice(0, 500), exit, out_sha: sha(out, 16), tree: treeHash(proj), ts: Date.now(),
      tool_use_id: input.tool_use_id || null, turn, kinds, failed_pattern: failed, agent: input.agent_id || null,
      background: Boolean(input.tool_input?.run_in_background), interrupted: Boolean(input.is_interrupt),
    }, proj);
    if (failed) note(`fail:${id}`, `H-Stack: \`${cmd.slice(0, 60)}\` exited 0 but its output shows ${failed}; receipt ${id} is recorded as failed.`);
    if (input.is_interrupt) note(`unknown:${id}`, `H-Stack: \`${cmd.slice(0, 60)}\` was interrupted; outcome unknown. Retry only read-only or idempotent steps.`);
    // Event triggers (HS-022): test or build failure -> debugging.
    const idx = loadIndex();
    if ((exit !== 0 || failed) && !input.is_interrupt) {
      const ev = kinds.includes('test') ? 'test_failed' : kinds.includes('build') || kinds.includes('typecheck') ? 'build_failed' : null;
      if (ev && idx.events?.[ev]?.length) note(`ev:${ev}`, `H-Stack: Relevant skill: ${idx.events[ev][0]} because \`${cmd.slice(0, 50)}\` failed (${ev}).`);
    }
  } else {
    const p = input.tool_input?.file_path || input.tool_input?.notebook_path || input.tool_input?.path;
    const rel = relToProject(proj, p);
    const id = input.tool_use_id ? `e-${sha(input.tool_use_id, 6)}` : `e-${rows.filter((r) => r.kind === 'edit').length + 1}`;
    appendLine(file, { id, kind: 'edit', path: rel, tool: input.tool_name, ts: Date.now(), tool_use_id: input.tool_use_id || null, turn, agent: input.agent_id || null }, proj);
    const idx = loadIndex();
    for (const { glob, skill } of idx.paths || []) {
      if (matchesAny(rel, [glob])) { note(`path:${skill}`, `H-Stack: Relevant skill: ${skill} because ${rel} matches its paths (path_edit).`); break; }
    }
  }
  return notes.length ? context(input.hook_event_name || 'PostToolUse', notes.join('\n')) : null;
});
