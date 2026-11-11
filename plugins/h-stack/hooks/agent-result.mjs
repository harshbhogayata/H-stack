#!/usr/bin/env node
// PostToolUse(Agent|Task): validate structured output of review/audit/rubric subagents (HS-062, HS-063).
// Invalid output is discarded and re-run with a fresh subagent, never repaired. FAILURE_MODE=open
// (Moved from SubagentStop: a SubagentStop block sends the same subagent back to repair its output.)
import { runHook, projectDir, context } from '../lib/core.mjs';
import { extractJson, validateFindings } from '../lib/findings.mjs';

const VALIDATED = /(review-lane|reviewer|rubric-grader|blind-review|h-stack:review)/i;

await runHook('agent-result', 'open', async (input) => {
  const type = String(input.tool_input?.subagent_type || input.tool_input?.agent_type || '');
  if (!VALIDATED.test(type)) return null;
  const r = input.tool_response;
  const text = typeof r === 'string' ? r : Array.isArray(r?.content) ? r.content.map((c) => c.text || '').join('\n') : JSON.stringify(r ?? '');
  const res = validateFindings(extractJson(text), projectDir(input));
  if (!res.ok) return context('PostToolUse', `H-Stack: ${type} output failed validation (${res.errors.slice(0, 3).join('; ')}). Discard it and re-run a fresh ${type}; do not repair the output.`);
  if (res.shallow) return context('PostToolUse', `H-Stack: ${type} returned no findings and only ${res.cleared} cleared unit(s), which is thin coverage. Re-run a fresh ${type} from a different angle before treating it as clear.`);
  return null;
});
