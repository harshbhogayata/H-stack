#!/usr/bin/env node
// Prints BACKLOG.md status counts (done / needs-user / dropped) for HS items and IM rows,
// lists anything without a status, and checks needs-user reasons against the allowed list.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const text = fs.readFileSync(path.join(REPO, 'BACKLOG.md'), 'utf8');
const ALLOWED = /(smoke[- ]test (tasks?|results?|numbers?|benchmark)|real tasks|credentials?|accounts?|desktop app|visual check|judgement call)/i;
const STATUS = /^- \*\*Status\.\*\*\s*(done|needs-user|dropped)\b(.*)$/m;

const items = text.split(/^#### /m).slice(1).filter((c) => /^HS-\d{3}/.test(c));
const hs = items.map((c) => { const id = c.slice(0, 6); const m = c.match(STATUS); return { id, status: m ? m[1] : null, detail: m ? m[2].trim() : '' }; });

const lines = text.split('\n');
const head = lines.findIndex((l) => /^\| IM \| Cat\. \|/.test(l));
const cols = lines[head].split('|').map((s) => s.trim());
const si = cols.indexOf('Status');
const im = [];
for (let i = head + 2; i < lines.length && lines[i].startsWith('| IM-'); i++) {
  const cells = lines[i].split('|').map((s) => s.trim());
  const raw = si > 0 ? cells[si] : '';
  const m = raw.match(/^(done|needs-user|dropped)\b(.*)$/);
  im.push({ id: `${cells[1]} ${cells[4].slice(0, 40)}`, status: m ? m[1] : null, detail: m ? m[2].trim() : '' });
}

const count = (rows) => rows.reduce((a, r) => { a[r.status || 'missing'] = (a[r.status || 'missing'] || 0) + 1; return a; }, {});
const badReason = [...hs, ...im].filter((r) => r.status === 'needs-user' && !ALLOWED.test(r.detail));
const fmt = (c) => `done ${c.done || 0} · needs-user ${c['needs-user'] || 0} · dropped ${c.dropped || 0} · missing ${c.missing || 0}`;
console.log(`HS items (${hs.length}): ${fmt(count(hs))}`);
console.log(`IM rows  (${im.length}): ${fmt(count(im))}`);
const missing = [...hs, ...im].filter((r) => !r.status);
if (missing.length) console.log(`Without status: ${missing.map((r) => r.id).join(', ')}`);
if (badReason.length) console.log(`needs-user with a reason outside the allowed list: ${badReason.map((r) => r.id).join(', ')}`);
for (const r of [...hs, ...im].filter((x) => x.status === 'needs-user')) console.log(`  needs-user ${r.id}: ${r.detail.slice(0, 140)}`);
const ok = !missing.length && !badReason.length && hs.length === 87;
console.log(JSON.stringify({ status: ok ? 'ok' : 'fail', reason: `${hs.length} HS items, ${im.length} IM rows, ${missing.length} without status, ${badReason.length} disallowed needs-user reasons` }));
process.exit(ok ? 0 : 1);
