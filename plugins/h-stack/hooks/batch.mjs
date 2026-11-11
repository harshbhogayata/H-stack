#!/usr/bin/env node
// PostToolBatch: one receipt line per batch, digest-gated (HS-027); long-run recitation when the
// goal/step digest changes and the few-shot rut breaker (HS-055). Repeat calls: hooks/repeat.mjs (HS-037).
// Single writer of sessions/<id>/batch.json. FAILURE_MODE=open
import path from 'node:path';
import { runHook, projectDir, sessionDir, readJsonl, readJson, writeJsonAtomic, stableStringify, sha, context } from '../lib/core.mjs';


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

  // HS-055 recitation: long runs only (a recorded goal); on unless hs goal set --no-recite.
  const goal = readJson(path.join(dir, 'goal.json'), null);
  if (goal && goal.recite !== false) {
    const d = sha(`${goal.goal}|${goal.step}`, 12);
    if (d !== st.recite_digest) { lines.push(`H-Stack goal (replaces earlier versions): ${String(goal.goal).slice(0, 160)}. Current step: ${String(goal.step || '').slice(0, 120)}.`); st.recite_digest = d; }
  }
  // HS-055 few-shot rut breaker (same long-run condition): a batch of 3+ calls to one tool with different inputs
  // is repetitive item work, which tends to copy the previous item's pattern. Restate the current
  // item, rotating the wording so the reminder itself doesn't become a pattern.
  if (goal && goal.recite !== false && goal.step) {
    const byTool = {};
    for (const c of calls) (byTool[c.tool_name] ||= new Set()).add(sha(stableStringify(c.tool_input || {}), 12));
    if (Object.values(byTool).some((set) => set.size >= 3)) {
      const n = (st.rut_count = (st.rut_count || 0) + 1);
      const item = String(goal.step).slice(0, 120);
      const phrasings = [
        `H-Stack: repetitive batch. The current item is "${item}"; check its own details rather than the previous item's.`,
        `H-Stack: same tool, many inputs. Before the next one, re-read what "${item}" itself needs.`,
        `H-Stack: batch work drifts toward copying. Current item: "${item}". Verify this item, not the last pattern.`,
      ];
      lines.push(phrasings[(n - 1) % phrasings.length]);
    }
  }
  writeJsonAtomic(stateFile, st);
  return lines.length ? context('PostToolBatch', lines.join('\n')) : null;
});
