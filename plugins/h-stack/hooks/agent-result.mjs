#!/usr/bin/env node
// PostToolUse(Agent|Task): validate structured output of H-Stack's subagents (HS-062, HS-063, HS-020, HS-060).
// Invalid output is discarded and re-run with a fresh subagent, never repaired. FAILURE_MODE=open
// (Moved from SubagentStop: a SubagentStop block sends the same subagent back to repair its output.)
import path from 'node:path';
import { runHook, projectDir, sessionDir, readJson, context } from '../lib/core.mjs';
import { extractJson, validateFindings, validateIntent, validateRubric, validateGrades } from '../lib/findings.mjs';

await runHook('agent-result', 'open', async (input) => {
  const type = String(input.tool_input?.subagent_type || input.tool_input?.agent_type || '');
  const proj = projectDir(input);
  let validate = null;
  if (/review-lane/.test(type)) validate = (o) => validateFindings(o, proj);
  else if (/intent-check/.test(type)) validate = validateIntent;
  else if (/rubric-writer/.test(type)) validate = validateRubric;
  else if (/rubric-grader/.test(type)) {
    const rubric = readJson(path.join(sessionDir(proj, input.session_id || 'no-session'), 'rubric.json'), null);
    const ids = rubric ? rubric.items.filter((i) => !i.struck).map((i) => i.id) : null;
    validate = (o) => validateGrades(o, ids);
  }
  if (!validate) return null;
  const r = input.tool_response;
  const text = typeof r === 'string' ? r : Array.isArray(r?.content) ? r.content.map((c) => c.text || '').join('\n') : JSON.stringify(r ?? '');
  const res = validate(extractJson(text));
  if (!res.ok) return context('PostToolUse', `H-Stack: ${type} output failed validation (${res.errors.slice(0, 3).join('; ')}). Discard it and re-run a fresh ${type}; do not repair the output.`);
  if (res.shallow) return context('PostToolUse', `H-Stack: ${type} returned no findings and only ${res.cleared} cleared unit(s), which is thin coverage. Re-run a fresh ${type} from a different angle before treating it as clear.`);
  return null;
});
