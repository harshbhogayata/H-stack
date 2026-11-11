#!/usr/bin/env node
// PostToolUse (every tool), HS-037: hash the tool plus its canonical input; at 3, 5 and 8 identical
// calls in a row add one factual line with the previous result. Never blocks; resets on each user
// message (new prompt_id). Single writer of sessions/<id>/repeat.json. FAILURE_MODE=open
import path from 'node:path';
import { runHook, projectDir, sessionDir, readJson, writeJsonAtomic, stableStringify, sha, context } from '../lib/core.mjs';

const THRESHOLDS = [3, 5, 8];

await runHook('repeat', 'open', async (input) => {
  const dir = sessionDir(projectDir(input), input.session_id || 'no-session');
  const file = path.join(dir, 'repeat.json');
  const turn = input.prompt_id || readJson(path.join(dir, 'route.json'), {}).prompt_id || null;
  let st = readJson(file, {});
  if (st.turn !== turn) st = { turn, last_hash: null, count: 0 };
  const h = sha(`${input.tool_name}:${stableStringify(input.tool_input || {})}`, 16);
  if (h === st.last_hash) st.count += 1; else { st.last_hash = h; st.count = 1; }
  writeJsonAtomic(file, st);
  if (!THRESHOLDS.includes(st.count)) return null;
  const r = input.tool_response;
  const prev = (typeof r === 'string' ? r : JSON.stringify(r ?? '')).slice(0, 50).replace(/\s+/g, ' ');
  return context('PostToolUse', `H-Stack: ${input.tool_name} ran ${st.count}x in a row with identical input; last result: "${prev}". Retry only on a new signal.`);
});
