#!/usr/bin/env node
// PostToolUseFailure: failure log (HS-047) and outcome-unknown note on interrupts (HS-036).
// Writes sessions/<id>/failures.jsonl via lib/append (shared with bin/hs failed). FAILURE_MODE=open
import path from 'node:path';
import { runHook, projectDir, sessionDir, context } from '../lib/core.mjs';
import { appendFailure } from '../lib/append.mjs';

await runHook('failure', 'open', async (input) => {
  const proj = projectDir(input);
  const dir = sessionDir(proj, input.session_id || 'no-session');
  const tried = input.tool_name === 'Bash' || input.tool_name === 'PowerShell' ? String(input.tool_input?.command || '') : `${input.tool_name} ${JSON.stringify(input.tool_input || {}).slice(0, 120)}`;
  const err = String(input.error || '').split('\n').slice(0, 3).join(' ').slice(0, 300);
  appendFailure(proj, dir, { tried: tried.slice(0, 300), failed_because: err, source: 'tool', tool: input.tool_name });
  if (input.is_interrupt) return context('PostToolUseFailure', `H-Stack: ${input.tool_name} was interrupted; its outcome is unknown. Retry only read-only or idempotent steps.`);
  return null;
});
