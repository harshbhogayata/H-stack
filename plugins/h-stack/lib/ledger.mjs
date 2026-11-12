// Receipt/ledger helpers shared by ledger.mjs (writer), stop.mjs, batch.mjs and gate-bash (readers).
import path from 'node:path';
import { readJsonl, sessionDir, loadConfig } from './core.mjs';
import { exe } from './shell.mjs';
import { parseShell } from './pwsh.mjs';

export function ledgerFile(proj, sid) { return path.join(sessionDir(proj, sid), 'ledger.jsonl'); }
export function readLedger(proj, sid) { return readJsonl(ledgerFile(proj, sid)); }

// Self-audit F12: the kind comes from what each parsed command runs (`npm test`, `pytest`), not from
// the raw text, so `echo tests` is not a test receipt.
const NOOP = new Set(['echo', 'printf', 'true', ':', 'cat', 'ls', 'grep', 'rg', 'head', 'tail', 'touch', 'mkdir', 'cd', 'sleep', 'which', 'type', 'export', 'test', '[']);
export function claimKinds(cmd, config, shell) {
  const heads = parseShell(cmd, shell).filter((c) => !NOOP.has(exe(c))).map((c) => [exe(c), ...c.argv.slice(1, 4)].join(' '));
  const kinds = [];
  for (const [k, re] of Object.entries(config.claims || {})) { try { const r = new RegExp(re, 'i'); if (heads.some((h) => r.test(h))) kinds.push(k); } catch { /* bad config */ } }
  return kinds;
}

// Claims in the final message, mapped to kinds.
const CLAIMS = [
  ['test', /\b((all |the )?(unit |integration |e2e )?tests? (now )?(pass|passes|passed|passing|are green|succeed|succeeded)|test suite (passes|passed|is green)|\d+ (tests? )?passed|green tests?)\b/i],
  ['build', /\b(build (passes|passed|succeeds|succeeded|is green|works)|builds? (cleanly|successfully)|compiles? (cleanly|successfully|without errors))\b/i],
  ['lint', /\b(lint(ing|er)? (is )?(clean|passes|passed)|no lint (errors|warnings))\b/i],
  ['typecheck', /\b(type ?check(s|ing)? (passes|passed|clean)|no type errors|types? check out)\b/i],
  ['works', /\b(verified (that )?it works|it works now|now works|works as expected|confirmed (it|that it) works|fixed and verified)\b/i],
];
export function claimsIn(text) {
  const t = String(text || '');
  const negated = /\b(not verified|could not (run|verify)|didn'?t run|did not run|unable to run|haven'?t run|untested)\b/i;
  const found = [];
  for (const [kind, re] of CLAIMS) {
    const m = t.match(re);
    if (!m) continue;
    const start = Math.max(0, m.index - 60);
    if (negated.test(t.slice(start, m.index + m[0].length + 20))) continue;
    found.push({ kind, phrase: m[0] });
  }
  return found;
}
export const NOT_VERIFIED = /^\s*[-*]?\s*\**not verified\**\s*:/im;

// Receipts fresh for the current tree: exit 0, not failed by pattern, after the last edit.
export function freshReceipts(rows, currentTree) {
  let lastEdit = -1;
  rows.forEach((r, i) => { if (r.kind === 'edit') lastEdit = i; });
  return rows.filter((r, i) => r.kind === 'receipt' && i > lastEdit && r.exit === 0 && !r.failed_pattern && (!currentTree || !r.tree || r.tree === currentTree));
}
export { loadConfig };
