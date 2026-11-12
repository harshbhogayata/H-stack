#!/usr/bin/env node
// Stop dispatcher (ARCHITECTURE §6.4; HS-027, HS-028b, HS-046, HS-060, HS-040 fallback).
// One script, fixed order, one combined note, at most one block per stop, never on turns without edits.
// FAILURE_MODE=open (quality gate)
import path from 'node:path';
import { runHook, projectDir, sessionDir, readJsonl, readJson, latestById, treeHash, loadConfig, isMain } from '../lib/core.mjs';
import { claimsIn, NOT_VERIFIED, freshReceipts } from '../lib/ledger.mjs';
import { scanWorktree } from '../lib/tamper.mjs';
import { logTurn } from '../lib/telemetry.mjs';

export function evaluate({ input, rows, route, stops, assumptions, rubric, tree, tamper }) {
  const turn = input.prompt_id || route.prompt_id || null;
  if (input.stop_hook_active) return { block: false, why: 'stop_hook_active' };
  if (stops.some((s) => s.turn === turn)) return { block: false, why: 'hs stop recorded' };
  const turnRows = rows.filter((r) => !turn || r.turn === turn);
  const edits = turnRows.filter((r) => r.kind === 'edit' && !r.agent);
  const changed = edits.length > 0 || (route.turn_tree && tree && tree !== 'nogit' && route.turn_tree !== tree);
  if (!changed) return { block: false, why: 'no edits' };
  const hits = [];
  const msg = String(input.last_assistant_message || '');
  const fresh = freshReceipts(rows, tree);
  const claims = claimsIn(msg);
  for (const c of claims) {
    const ok = c.kind === 'works' ? fresh.length > 0 : fresh.some((r) => (r.kinds || []).includes(c.kind));
    if (!ok) hits.push(`the reply says "${c.phrase}" but no passing ${c.kind === 'works' ? '' : c.kind + ' '}command ran after the last edit`);
  }
  if (!fresh.length && !NOT_VERIFIED.test(msg) && !claims.length) hits.push('files changed, and there is neither a passing check after the last edit nor a "Not verified:" line');
  const running = (input.background_tasks || []).filter((t) => !/^(completed|done|failed|killed|stopped)$/i.test(String(t.status || 'running')));
  if (running.length) hits.push(`${running.length} background task(s) still running (${running.slice(0, 2).map((t) => t.description || t.command || t.id).join('; ').slice(0, 80)})`);
  const open = assumptions.filter((a) => a.status === 'open');
  if (open.length) hits.push(`${open.length} assumption(s) still open (${open.slice(0, 2).map((a) => a.id).join(', ')}); verify, refute or hand them to the user with hs verify-assumption`);
  if (tamper.length) hits.push(`tamper scan: ${tamper.slice(0, 3).map((t) => `${t.kind} in ${t.path}`).join('; ')}${tamper.length > 3 ? ` (+${tamper.length - 3})` : ''}`);
  if (rubric && Array.isArray(rubric.items)) {
    const unmet = rubric.items.filter((i) => i.level === 'must' && !i.struck && !(rubric.graded && rubric.graded[i.id] && rubric.graded[i.id].pass));
    if (unmet.length) hits.push(`rubric must-have(s) not graded as met: ${unmet.slice(0, 3).map((i) => i.id).join(', ')}`);
  }
  if (!hits.length) return { block: false, why: 'all checks passed' };
  return {
    block: true,
    reason: `Blocked by stop-gate: ${hits.join('; ')}. To proceed: run the check and cite its receipt, add a "Not verified:" line saying what was not checked, or record an honest stop with hs stop "<reason>".`,
  };
}

if (isMain(import.meta.url)) {
  await runHook('stop', 'open', async (input) => {
    const proj = projectDir(input);
    const sid = input.session_id || 'no-session';
    const dir = sessionDir(proj, sid);
    const config = loadConfig(proj);
    const rows = readJsonl(path.join(dir, 'ledger.jsonl'));
    const route = readJson(path.join(dir, 'route.json'), {});
    const stops = readJsonl(path.join(dir, 'stops.jsonl'));
    const assumptions = latestById(readJsonl(path.join(dir, 'assumptions.jsonl')));
    const rubric = readJson(path.join(dir, 'rubric.json'), null);
    const tree = treeHash(proj);
    const turn = input.prompt_id || route.prompt_id || null;
    const edited = rows.some((r) => r.kind === 'edit' && (!turn || r.turn === turn));
    const tamper = edited || (route.turn_tree && route.turn_tree !== tree) ? scanWorktree(proj, config) : [];
    const res = evaluate({ input, rows, route, stops, assumptions, rubric, tree, tamper });
    logTurn(proj, { session: sid, turn, edits: edited, receipts: rows.some((r) => r.kind === 'receipt' && r.turn === turn), stop_block: res.block, why: res.why || null });
    return res.block ? { decision: 'block', reason: res.reason } : null;
  });
}
