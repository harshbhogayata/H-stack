#!/usr/bin/env node
// PreToolUse(WebFetch): loopback / RFC1918 / metadata destinations ask while untrusted
// content is in play (HS-032). FAILURE_MODE=closed
import { runHook, projectDir, refusal, preDecision } from '../lib/core.mjs';
import { taintedIn, privateDestination } from '../lib/taint.mjs';
import { logTool } from '../lib/telemetry.mjs';

export function decide(input, proj) {
  const url = String(input.tool_input?.url || '');
  const priv = privateDestination(url);
  if (!priv) return null;
  const t = taintedIn(proj, input.session_id || 'no-session', url, []);
  if (!t.any) return null;
  logTool(proj, { tool: 'WebFetch', rule: 'fetch-destination', decision: 'ask' });
  return preDecision('ask', refusal('fetch-destination', `WebFetch targets ${priv} while untrusted content is in play`, 'the user confirms this request'));
}
if (import.meta.url === `file://${process.argv[1]}`) await runHook('gate-fetch', 'closed', async (i) => decide(i, projectDir(i)));
