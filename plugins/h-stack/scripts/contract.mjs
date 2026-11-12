#!/usr/bin/env node
// HS-012 hook contract: every hook declares FAILURE_MODE matching onFailure in hooks.json;
// closed hooks deny when they crash; gates never return allow.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'hooks', 'hooks.json'), 'utf8'));
const errs = [];
const seen = new Map();
for (const [event, groups] of Object.entries(cfg.hooks || {})) for (const g of groups) for (const h of g.hooks) {
  const script = (h.args || [])[0]?.replace('${CLAUDE_PLUGIN_ROOT}/', '');
  if (!script) { errs.push(`${event}: hook without args script`); continue; }
  const file = path.join(ROOT, script);
  if (!fs.existsSync(file)) { errs.push(`${event}: ${script} missing`); continue; }
  const src = fs.readFileSync(file, 'utf8');
  const mode = (src.match(/FAILURE_MODE=(closed|open)/) || [])[1];
  if (!mode) errs.push(`${script}: no FAILURE_MODE declaration`);
  if (mode === 'closed' && h.onFailure !== 'block') errs.push(`${script}: FAILURE_MODE=closed but onFailure is ${h.onFailure}`);
  if (mode === 'open' && h.onFailure === 'block') errs.push(`${script}: FAILURE_MODE=open but onFailure is block`);
  if (!h.timeout) errs.push(`${script}: explicit timeout required`);
  if (/permissionDecision:\s*'allow'|"permissionDecision":\s*"allow"|decision:\s*'allow'/.test(src)) errs.push(`${script}: returns allow`);
  seen.set(script, { mode, event });
}
// Closed hooks deny on crash.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hstack-contract-'));
for (const [script, { mode, event }] of seen) {
  if (mode !== 'closed') continue;
  const name = path.basename(script, '.mjs');
  const r = spawnSync('node', [path.join(ROOT, script)], { input: JSON.stringify({ session_id: 'c', cwd: tmp, hook_event_name: event, tool_name: 'Bash', tool_input: { command: 'ls' } }), env: { ...process.env, CLAUDE_PROJECT_DIR: tmp, CLAUDE_PLUGIN_ROOT: ROOT, HSTACK_TEST_CRASH: name }, encoding: 'utf8' });
  let out = null; try { out = JSON.parse(r.stdout); } catch { /* */ }
  if (out?.hookSpecificOutput?.permissionDecision !== 'deny') errs.push(`${script}: crash did not deny (stdout: ${String(r.stdout).slice(0, 100)})`);
}
// onFailure=block layer: a missing script must be configured to block.
fs.rmSync(tmp, { recursive: true, force: true });
console.log(JSON.stringify({ status: errs.length ? 'fail' : 'ok', reason: `${seen.size} hook scripts checked; ${[...seen.values()].filter((x) => x.mode === 'closed').length} closed hooks deny on crash; ${errs.length} problem(s)` }));
for (const e of errs) console.log(e);
process.exit(errs.length ? 1 : 0);
