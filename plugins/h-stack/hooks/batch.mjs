#!/usr/bin/env node
// PostToolBatch: one receipt line per batch, digest-gated (HS-027); repeat-call reminders at
// 3/5/8 identical calls (HS-037); long-run recitation when goal/step digest changes (HS-055).
// Single writer of sessions/<id>/batch.json. FAILURE_MODE=open
import path from 'node:path';
import { runHook, projectDir, sessionDir, readJsonl, readJson, writeJsonAtomic, stableStringify, sha, context } from '../lib/core.mjs';

const THRESHOLDS = [3, 5, 8];

await runHook('batch', 'open', async (input) => {
  const proj = projectDir(input);
  const sid = input.session_id || 'no-session';
  const dir = sessionDir(proj, sid);
  const stateFile = path.join(dir, 'batch.json');
  const route = readJson(path.join(dir, 'route.json'), {});
  const turn = input.prompt_id || route.prompt_id || null;
  let st = readJson(stateFile, {});
  if (st.turn !== turn) st = { turn, last_hash: null, repeat: 0, receipt_digest: null, recite_digest: st.recite_digest || null };
  const calls = input.tool_calls || [];
  const lines = [];

  // Receipts produced by this batch.
  const ids = new Set(calls.map((c) => c.tool_use_id));
  const receipts = readJsonl(path.join(dir, 'ledger.jsonl')).filter((r) => r.kind === 'receipt' && ids.has(r.tool_use_id));
  if (receipts.length) {
    const txt = receipts.slice(-3).map((r) => `${r.id} \`${r.cmd.slice(0, 40)}\` exit ${r.exit}${r.failed_pattern ? ' (failed: ' + r.failed_pattern + ')' : ''}`).join('; ');
    const d = sha(txt, 12);
    if (d !== st.receipt_digest) { lines.push(`H-Stack receipts: ${txt} (tree ${receipts[receipts.length - 1].tree}).`); st.receipt_digest = d; }
  }

  // Repeat-call detection across consecutive identical calls (never blocks).
  for (const c of calls) {
    const h = sha(`${c.tool_name}:${stableStringify(c.tool_input || {})}`, 16);
    if (h === st.last_hash) st.repeat += 1; else { st.last_hash = h; st.repeat = 1; }
    if (THRESHOLDS.includes(st.repeat)) {
      const prevResult = typeof c.tool_response === 'string' ? c.tool_response : JSON.stringify(c.tool_response ?? '');
      lines.push(`H-Stack: ${c.tool_name} ran ${st.repeat}x in a row with identical input; last result: "${prevResult.slice(0, 50).replace(/\s+/g, ' ')}". Retry only on a new signal.`);
    }
  }

  // HS-055 recitation (long runs only, opt-in via config long_run.recite).
  const goal = readJson(path.join(dir, 'goal.json'), null);
  if (goal && goal.recite) {
    const d = sha(`${goal.goal}|${goal.step}`, 12);
    if (d !== st.recite_digest) { lines.push(`H-Stack goal (replaces earlier versions): ${String(goal.goal).slice(0, 160)}. Current step: ${String(goal.step || '').slice(0, 120)}.`); st.recite_digest = d; }
  }
  writeJsonAtomic(stateFile, st);
  return lines.length ? context('PostToolBatch', lines.join('\n')) : null;
});
