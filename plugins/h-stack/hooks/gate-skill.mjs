#!/usr/bin/env node
// PreToolUse(Skill): explicit-only skills run only when the classifier recorded an explicit
// request this turn (HS-016). FAILURE_MODE=closed
import path from 'node:path';
import { runHook, projectDir, sessionDir, readJson, refusal, preDecision } from '../lib/core.mjs';
import { loadIndex } from '../lib/index.mjs';
import { logTool } from '../lib/telemetry.mjs';

export function decide(input, proj) {
  const name = String(input.tool_input?.skill || input.tool_input?.name || '').replace(/^\//, '');
  const q = name.includes(':') ? name : `h-stack:${name}`;
  const s = (loadIndex().skills || []).find((x) => x.qualified === q);
  if (!s || !s.explicit_only) return null;
  const route = readJson(path.join(sessionDir(proj, input.session_id || 'no-session'), 'route.json'), {});
  if ((route.explicit || []).includes(q)) return null;
  logTool(proj, { tool: 'Skill', rule: 'explicit-only', decision: 'deny' });
  return preDecision('deny', refusal('explicit-only', `${q} runs only when the user asks for it in this turn`, 'ask the user, or continue without it'));
}
if (import.meta.url === `file://${process.argv[1]}`) await runHook('gate-skill', 'closed', async (i) => decide(i, projectDir(i)));
