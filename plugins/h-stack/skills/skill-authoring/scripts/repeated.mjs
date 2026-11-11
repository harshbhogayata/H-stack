#!/usr/bin/env node
// HS-080: find command sequences that succeeded in 2+ sessions (from .h-stack receipts).
import fs from 'node:fs';
import path from 'node:path';
const proj = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const dir = path.join(proj, '.h-stack', 'sessions');
const norm = (c) => c.replace(/\s+/g, ' ').replace(/(["'])[^"']*\1/g, '$1…$1').replace(/\b[0-9a-f]{7,40}\b/g, '<sha>').trim().slice(0, 120);
const seen = new Map();
for (const s of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
  let rows = [];
  try { rows = fs.readFileSync(path.join(dir, s, 'ledger.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)); } catch { continue; }
  const ok = rows.filter((r) => r.kind === 'receipt' && r.exit === 0 && !r.failed_pattern).map((r) => norm(r.cmd));
  const seqs = new Set();
  for (let i = 0; i + 1 < ok.length; i++) seqs.add(`${ok[i]}  &&  ${ok[i + 1]}`);
  for (const c of ok) seqs.add(c);
  for (const q of seqs) seen.set(q, (seen.get(q) || 0) + 1);
}
const out = [...seen].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 15).map(([seq, sessions]) => ({ seq, sessions }));
console.log(JSON.stringify({ status: 'ok', reason: `${out.length} repeated successful command(s) or pair(s) across sessions`, candidates: out }));
